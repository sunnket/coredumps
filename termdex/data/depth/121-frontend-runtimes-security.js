/* ==========================================================================
   Depth pass 121 — Web Frontend batch 6: Runtime Systems, Storage & Security.
   Progressive Web App, Web Worker, Event Loop, CORS,
   Same-Origin Policy, Cookie, localStorage.

   ServiceWorker fetch proxies, postMessage structured clone threads, V8 microtask queues,
   preflight HTTP OPTIONS headers, and cross-site security sandboxes power browser engineering.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "progressive-web-app",

      why: {
        before: "Websites were entirely dependent on an active internet connection, displayed standard browser navigation chrome, had zero homescreen presence, and could not receive push notifications, forcing companies to maintain expensive separate native iOS/Android apps.",
        problem: "Modern web applications need native app-like capabilities: full offline functionality, homescreen installation, background data synchronization, and push notifications, all delivered through standard web URLs.",
        shift: "**Progressive Web App (PWA): A type of application software delivered through the web, built using common web technologies including HTML, CSS, JavaScript, and WebAssembly, designed to work on any standards-compliant browser.** Combining Service Workers, Web App Manifests, and HTTPS, PWAs bridge the capabilities gap between web and native mobile apps."
      },

      num: {
        t: "Progressive Web App (PWA) Core Architectural Pillars",
        h: ["Technical Pillar", "Standard / API", "Operating System Capability", "Underlying Browser Mechanism", "Primary Production Impact"],
        r: [
          ["Service Worker", "W3C Service Workers API", "Offline caching & background network proxy", "Programmable client-side network interceptor", "Complete offline functionality; instant cached load"],
          ["Web App Manifest", "JSON Manifest (`manifest.webmanifest`)", "Homescreen installation & standalone app window", "OS desktop/mobile app shell registration", "Launches without browser URL address bar"],
          ["Push Notifications", "Push API & Notifications API", "System notification tray alerts", "Push service connection via VAPID keys", "Re-engages users even when browser is completely closed"],
          ["Background Sync", "Background Synchronization API", "Deferred data transmission upon reconnect", "OS wakes service worker when network returns", "Guarantees offline draft form submissions and messages"],
          ["Secure Context (HTTPS)", "TLS / SSL certificate enforcement", "Hardware API access authorization", "Browser isolates privileged APIs to HTTPS", "Protects user data against Man-in-the-Middle attacks"]
        ],
        n: "A Progressive Web App functions through three essential components: (1) **HTTPS** (mandatory secure context), (2) **Web App Manifest** (defining icons, `display: 'standalone'`, theme colors, and start URL), and (3) **Service Worker** (an event-driven, background worker running off the main thread). The Service Worker acts as a programmable **Client-Side Reverse Proxy**: it intercepts every outgoing HTTP network request from the application via the `fetch` event. By orchestrating the **Cache Storage API**, the Service Worker can serve cached responses instantly (**Cache-First** or **Stale-While-Revalidate**), allowing the application to load in under $100\\text{ ms}$ and function completely offline without internet connectivity."
      },

      miss: [
        {
          w: "PWAs are only supported on Android phones and don't work on Apple iOS.",
          r: "iOS Safari has supported PWAs (Service Workers, Web App Manifests, Add to Home Screen, and web push notifications since iOS 16.4). While Apple enforces certain restrictions (like Safari's WebKit engine requirement), millions of users use PWAs daily on iPhones and iPads."
        },
        {
          w: "A PWA must be installed through the Apple App Store or Google Play Store.",
          r: "The defining superpower of a PWA is that it is **installed directly from the web browser via a URL** with zero app store gatekeepers, reviews, or $30\\%$ platform commission fees. (However, tools like PWABuilder also allow wrapping PWAs into standard APK/IPA packages for submission to app stores if desired)."
        },
        {
          w: "Service Workers can directly read and mutate DOM elements.",
          r: "Service Workers run on a completely **separate background thread** and have **zero access to the DOM or `window` object**! To update the UI, a Service Worker must send messages to the main thread via `postMessage()` or update IndexedDB."
        },
        {
          w: "PWAs cannot access modern device hardware like Bluetooth or cameras.",
          r: "Modern PWAs have access to an extensive suite of device hardware through standard Web APIs: Web Camera, Microphone, Geolocation, Accelerometers, Web Bluetooth, Web USB, Web NFC, and the Web Share API."
        }
      ],

      trade: {
        buys: [
          "Cross-platform parity: write a single application codebase that runs on iOS, Android, macOS, Windows, and Linux.",
          "Bypasses app store monopolies: instant distribution via URLs with zero app store approval delays or revenue cuts.",
          "Instant offline performance: cached assets load in sub-100ms speeds even on flaky or offline connections.",
          "Minimal disk footprint: PWAs typically consume less than 5MB of device storage compared to 200MB+ native mobile apps."
        ],
        costs: [
          "Inconsistent iOS feature support: Apple restricts certain background APIs and enforces WebKit storage quotas on iOS.",
          "Cache invalidation complexity: Service Worker lifecycle management and cache invalidation is notoriously difficult to get right.",
          "No native low-level background threads: cannot execute arbitrary long-running background tasks like native iOS/Android services.",
          "Discovery friction: mainstream consumer users are trained to search App Stores rather than installing from browser prompts."
        ],
        avoid: [
          "Never deploy a Service Worker without a robust update and cache invalidation strategy; stale caches can trap users on broken versions.",
          "Do not cache API endpoints containing dynamic, authenticated private user data in broad public caches.",
          "Avoid nagging users with immediate 'Install App' prompts upon their very first landing; wait until they have engaged with value.",
          "Never attempt to access `window` or `document` inside a Service Worker script; communicate via `postMessage`."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "web-worker",

      why: {
        before: "JavaScript ran strictly on a single execution thread; performing heavy computations (image processing, data encryption, 3D physics, massive array sorting) froze the main thread completely, locking up UI clicks, animations, and scrolling.",
        problem: "Web applications need true multi-threaded CPU parallel execution, allowing long-running background calculations to run on separate physical CPU cores without degrading user interface responsiveness.",
        shift: "**Web Worker: A feature of web browsers that allows a JavaScript script to run in a background thread, separate from the main execution thread of a web application.** Communicating via asynchronous message-passing (`postMessage`), Web Workers bring true multi-core CPU parallelism to browser applications."
      },

      num: {
        t: "Web Worker Types: Dedicated vs Shared vs Service Workers",
        h: ["Worker Type", "Instantiation Syntax", "Thread Scope", "Lifecycle Boundary", "Primary Production Use Case"],
        r: [
          ["Dedicated Web Worker", "`new Worker('worker.js')`", "Private to the single browser tab that created it", "Terminated when tab closes or `worker.terminate()`", "Heavy CPU calculations: cryptography, audio processing, image filters"],
          ["Shared Worker", "`new SharedWorker('worker.js')`", "Shared across multiple tabs/windows of same origin", "Persists as long as at least one tab remains open", "Single shared WebSocket connection across 10 browser tabs"],
          ["Service Worker", "`navigator.serviceWorker.register()`", "Shared network proxy across all origin tabs", "Persists indefinitely in background (OS controlled)", "Offline caching, push notifications, background sync"],
          ["Audio Worklet", "`audioContext.audioWorklet.addModule()`", "Hard real-time low-latency audio processing thread", "Tied to Web Audio context", "Custom synthesizers, live microphone audio DSP with zero latency"],
          ["OffscreenCanvas", "`canvas.transferControlToOffscreen()`", "Worker executes GPU canvas rendering", "Tied to worker lifecycle", "60 FPS 3D WebGL game rendering off the main thread"]
        ],
        n: "A Web Worker executes in a completely isolated background operating system thread with its own global context (**`DedicatedWorkerGlobalScope`** / `self`). It has **zero access to the DOM, `document`, or `window`**. Communication between the main thread and a Web Worker is strictly asynchronous via the **Actor-style Message Passing (`postMessage`)** pattern. When passing objects via `worker.postMessage(data)`, the browser executes the **Structured Clone Algorithm**, which deep-copies the memory representation, preventing shared-memory data races. For high-performance zero-copy data transfer, large binary buffers (**`ArrayBuffer`**) can be passed as **Transferable Objects**: the memory ownership is instantly transferred to the worker thread in $\\mathcal{O}(1)$ time, detaching it from the main thread without copying a single byte. For true shared-memory concurrency, **`SharedArrayBuffer`** paired with **`Atomics`** allows multiple threads to read and write the same physical RAM simultaneously."
      },

      miss: [
        {
          w: "Web Workers can update the DOM if they need to show a result.",
          r: "Web Workers have **strictly zero access to the DOM**! They cannot call `document.getElementById()`, mutate CSS, or query elements. To update the UI, the worker must send data back to the main thread via `postMessage()`, and the main thread updates the DOM."
        },
        {
          w: "Web Workers use shared memory by default just like threads in C++ or Java.",
          r: "By default, Web Workers share **zero memory**. Data passed via `postMessage` is deep-copied using the **Structured Clone Algorithm**. True shared memory requires explicitly allocating a **`SharedArrayBuffer`** and using `Atomics` memory operations under strict Cross-Origin Isolation headers (`COOP`/`COEP`)."
        },
        {
          w: "You should use Web Workers for simple asynchronous fetch API requests.",
          r: "Network requests (`fetch`) are already non-blocking and handled asynchronously by the browser kernel. Spawning a Web Worker just to fetch an API adds thread overhead and message cloning latency with zero performance benefit. Web Workers are designed for **heavy CPU-bound computations**, not standard I/O."
        },
        {
          w: "Transferring a massive object via `postMessage` is always free.",
          r: "Standard `postMessage` performs a recursive structured deep-clone of the object, which can lock the main thread for hundreds of milliseconds if the object contains millions of properties. Zero-copy transfer only works for **Transferable Objects** (like typed `ArrayBuffer`s, `ImageBitmap`, and `MessagePort`)."
        }
      ],

      trade: {
        buys: [
          "True multi-core CPU parallelism: offloads heavy computations to run simultaneously across all available physical CPU cores.",
          "Guaranteed 60 FPS UI: keeps main thread free of CPU stalls, ensuring silky-smooth scrolling and instantaneous user inputs.",
          "Thread safety by default: message cloning eliminates low-level memory data races and pointer corruption.",
          "Dedicated graphic processing: `OffscreenCanvas` allows workers to render WebGL/WebGPU graphics directly to the screen."
        ],
        costs: [
          "Zero DOM access: requires complex message-passing serialization protocols to coordinate with the UI.",
          "Cloning serialization latency: copying large object trees via structured clone incurs CPU and memory allocation overhead.",
          "Thread startup memory: each worker spawns an independent OS thread with its own JavaScript runtime context ($1\\text{--}5$ MB RAM).",
          "Debugging complexity: debugging code across multiple asynchronous worker threads in browser devtools requires extra tooling."
        ],
        avoid: [
          "Never attempt to access `window`, `document`, or DOM nodes inside a Web Worker script.",
          "Do not pass massive nested JSON object trees through `postMessage` repeatedly; use typed `ArrayBuffer`s and Transferables.",
          "Avoid spawning an unbounded number of Web Workers; pool workers to match `navigator.hardwareConcurrency` (CPU core count).",
          "Never use Web Workers for lightweight I/O tasks that standard async/await already handles non-blockingly."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "event-loop",

      why: {
        before: "Multi-threaded programming in early desktop applications was notorious for race conditions, memory deadlocks, and complex mutex synchronization that made frontend software brittle and error-prone.",
        problem: "Web browsers need a simple, single-threaded execution model that can process user interactions, run business logic, execute timers, and handle thousands of asynchronous network events without deadlocks or thread contention.",
        shift: "**Event Loop: The underlying runtime coordination mechanism that constantly monitors the Execution Call Stack and queues, dispatching tasks and microtasks to execute single-threaded JavaScript non-blockingly.** Formalized in the HTML Living Standard, the Event Loop orchestrates synchronous execution, Promise reactions, and rendering."
      },

      num: {
        t: "Event Loop Queue Priority & Execution Pipeline",
        h: ["Execution Phase", "Queue / Stack Monitored", "Task Type / API", "Execution Priority", "Drain Behavior"],
        r: [
          ["1. Synchronous Execution", "Call Stack", "Normal synchronous JS statements, function frames", "Immediate (Top Priority)", "Drains call stack until completely empty"],
          ["2. Microtask Queue", "Microtask Queue", "Promise reactions (`.then`), `queueMicrotask`, `MutationObserver`", "Highest Async Priority", "Drained COMPLETELY until queue is empty before moving on"],
          ["3. Render Steps", "Rendering Pipeline", "Style Recalc, Layout (Reflow), Paint, `requestAnimationFrame`", "Runs prior to next frame (typically every 16.6ms for 60Hz)", "Executes if display needs visual repaint"],
          ["4. Macrotask / Task Queue", "Task Queue", "`setTimeout`, `setInterval`, `setImmediate` (Node), I/O events", "Lowest Async Priority", "Executes EXACTLY ONE task, then immediately re-checks Microtasks"]
        ],
        n: "The Event Loop continuously executes a formal cycle defined by the WHATWG specification: (1) Select and execute the oldest task from the **Task Queue (Macrotasks)**; (2) Run the **Microtask Checkpoint**: drain the **Microtask Queue** completely until empty (including any new microtasks queued while draining); (3) If a display refresh is required (typically at 60 Hz / 16.6 ms intervals), execute **`requestAnimationFrame` callbacks**, recalculate styles, and paint the frame; (4) Wait for new tasks. This strict hierarchy explains why Promise reactions (`Promise.resolve().then(...)`) **always execute before `setTimeout(..., 0)`**: Promise reactions are Microtasks that drain immediately at the end of the current synchronous turn, whereas `setTimeout` is a Macrotask that must wait for the next turn."
      },

      miss: [
        {
          w: "`setTimeout(fn, 0)` executes the callback immediately with zero delay.",
          r: "`setTimeout(..., 0)` does NOT execute immediately. It places the callback at the back of the **Macrotask Queue**. It cannot run until the current call stack is empty, all pending Microtasks are completely drained, and the minimum browser timer clamp (typically $4\\text{ ms}$ after 5 nested calls) has elapsed."
        },
        {
          w: "JavaScript is multi-threaded because it can perform asynchronous HTTP requests.",
          r: "JavaScript code execution is **strictly single-threaded**. When an HTTP request is made via `fetch()`, the browser's underlying C++ network stack handles the socket communication on background OS threads. Once completed, the network stack pushes a callback task into JavaScript's event queue for single-threaded processing."
        },
        {
          w: "Chaining infinite Promises (`function loop() { Promise.resolve().then(loop); }`) allows the browser to keep rendering.",
          r: "Chaining infinite microtasks will **completely freeze the browser window**! The Event Loop specification mandates that the Microtask Queue MUST be drained completely before the browser can perform any rendering, painting, or macrotask processing. Infinite microtasks starve the render pipeline entirely."
        },
        {
          w: "Node.js and browser event loops are identical.",
          r: "While both use microtask queues and single-threaded execution, their underlying implementations differ: browsers follow the **WHATWG HTML Event Loop specification**, while Node.js uses **`libuv`**, which organizes macrotasks into distinct chronological phases (Timers, Pending I/O, Idle/Prepare, Poll, Check/`setImmediate`, Close callbacks)."
        }
      ],

      trade: {
        buys: [
          "Zero lock contention: single-threaded execution eliminates multi-threaded data races, deadlocks, and mutex synchronization bugs.",
          "High concurrency throughput: non-blocking event loops handle thousands of concurrent network connections with minimal RAM.",
          "Predictable execution ordering: strict microtask and task ordering rules guarantee deterministic asynchronous execution.",
          "Smooth 60 FPS animations: `requestAnimationFrame` hooks cleanly into the event loop's rendering step."
        ],
        costs: [
          "Event loop blocking vulnerability: a single heavy CPU calculation blocks the entire event loop, freezing all user interaction.",
          "Microtask starvation hazard: recursive microtasks prevent the event loop from ever reaching the render stage.",
          "Timer inaccuracy: `setTimeout` times are minimum delays, not guarantees; heavy tasks delay timer execution arbitrarily.",
          "Stack trace fragmentation: asynchronous events originate from the event loop root, losing the causal call stack."
        ],
        avoid: [
          "Never execute heavy, synchronous CPU loops on the main thread; offload to a Web Worker or chunk using `scheduler.yield()`.",
          "Do not create recursive microtask chains that starve the event loop of rendering frames.",
          "Avoid using `setTimeout(..., 0)` to defer microtasks; use native `queueMicrotask()` for proper microtask scheduling.",
          "Never assume `setTimeout(fn, 1000)` will fire at exactly 1000ms; always account for potential main-thread jitter."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "cors",

      why: {
        before: "Web browsers allowed client-side JavaScript from any malicious website to issue arbitrary HTTP requests to private intranet portals, banking APIs, or email accounts, stealing user data via the user's ambient authentication cookies.",
        problem: "While the Same-Origin Policy protects users by blocking cross-origin reads by default, modern web applications need a secure, standardized mechanism for servers to explicitly authorize specific trusted external origins to access their APIs.",
        shift: "**CORS (Cross-Origin Resource Sharing): A security mechanism that uses HTTP headers to tell browsers whether client-side JavaScript running on one origin is authorized to request resources from a different origin.** Mediated via Preflight OPTIONS requests and response headers, CORS balances web security with distributed API access."
      },

      num: {
        t: "CORS Request Types: Simple vs Preflighted Requests",
        h: ["Request Classification", "Triggering Conditions", "Preflight Required?", "HTTP Request Sequence", "Security Vulnerability Addressed"],
        r: [
          ["Simple Request", "Methods: GET, HEAD, POST; Standard headers only; Content-Type: `text/plain`, `multipart/form-data`, `application/x-www-form-urlencoded`", "No (zero preflight)", "Browser sends actual request directly; checks headers on response", "Protects against CSRF; historically matches HTML form submission behavior"],
          ["Preflighted Request", "Method: PUT, DELETE, PATCH; Custom headers (e.g., `Authorization`); Content-Type: `application/json`", "Yes (mandatory)", "1. Browser sends `OPTIONS` preflight; 2. If approved, sends actual request", "Prevents browser from executing dangerous mutations on servers not expecting them"],
          ["Credentialed Request", "Request includes cookies, HTTP auth (`credentials: 'include'`)", "Follows simple/preflight rules", "Requires explicit `Access-Control-Allow-Credentials: true`", "Strictly forbids wildcard `Access-Control-Allow-Origin: *` to protect private user sessions"],
          ["Non-Browser Request (cURL, Postman)", "Issued from terminal, backend server, mobile app", "Never (CORS is purely a browser-enforced security sandbox)", "Direct HTTP execution with zero CORS checks", "Proves CORS does NOT protect backend APIs from malicious bots"]
        ],
        n: "CORS is a **browser-enforced security mechanism** built on top of the Same-Origin Policy. When client-side JavaScript makes a request across origins, the browser inspects the request: if it is a non-simple request (e.g., a POST containing `application/json` or an `Authorization` header), the browser automatically intercepts it and sends an **HTTP OPTIONS Preflight Request** containing: `Origin`, `Access-Control-Request-Method`, and `Access-Control-Request-Headers`. The server must respond with matching authorization headers: `Access-Control-Allow-Origin: https://app.example.com`, `Access-Control-Allow-Methods: POST, OPTIONS`, and `Access-Control-Allow-Headers: Content-Type, Authorization`. Only if the preflight succeeds does the browser send the real request. Crucially, if cookies are sent (`credentials: 'include'`), the server CANNOT use a wildcard (`*`) for origin; it must explicitly echo the caller's origin."
      },

      miss: [
        {
          w: "CORS is a security feature that protects your backend server from hackers.",
          r: "CORS **DOES NOT protect backend servers from hackers**! CORS is a security mechanism enforced **strictly by web browsers to protect end users**. An attacker using Python, cURL, or Postman can bypass CORS completely because non-browser clients simply ignore CORS headers. Backend servers MUST protect themselves using authentication, authorization, and rate limiting."
        },
        {
          w: "Setting `Access-Control-Allow-Origin: *` is safe for authenticated enterprise APIs.",
          r: "Setting a wildcard `*` allows **ANY malicious website on the internet** to make requests to your API from an authenticated user's browser. If your API relies on ambient authentication (cookies or IP whitelisting), a wildcard header creates a catastrophic security vulnerability."
        },
        {
          w: "When a CORS error happens, the server rejected the request.",
          r: "In many cases (especially Simple Requests), the server **successfully processed the request and executed the database write**! The server simply failed to return the required `Access-Control-Allow-Origin` header in its HTTP response. The **browser** then blocks the JavaScript frontend from reading the response and emits a CORS error in the console."
        },
        {
          w: "You can fix a CORS error by changing your frontend JavaScript code.",
          r: "A CORS error can almost never be fixed in frontend client JavaScript. CORS headers **MUST be configured on the server** (or an API gateway/reverse proxy) providing the API, explicitly allowing the client's origin."
        }
      ],

      trade: {
        buys: [
          "Enables distributed API architectures: allows frontend apps hosted on `app.com` to communicate with APIs on `api.com`.",
          "Protects user session data: prevents malicious third-party websites from reading private user data via ambient cookies.",
          "Preflight safety check: prevents unexpected mutating requests (DELETE/PUT) from touching legacy servers unaware of CORS.",
          "Fine-grained access control: servers can specify precisely which methods, headers, and origins are authorized."
        ],
        costs: [
          "Preflight network latency: sends an extra HTTP OPTIONS request before every JSON API call, doubling network latency.",
          "Developer configuration friction: CORS misconfigurations are one of the most common causes of frontend development blockers.",
          "Caching complexity: requires configuring `Access-Control-Max-Age` to cache preflight OPTIONS responses and avoid latency penalties.",
          "Reverse proxy overhead: often forces teams to set up Nginx/Cloudflare reverse proxies to route around CORS during development."
        ],
        avoid: [
          "Never set `Access-Control-Allow-Origin: *` alongside `Access-Control-Allow-Credentials: true` (browsers will reject it anyway).",
          "Do not forget to configure `Access-Control-Max-Age` (e.g., 86400) to cache preflight OPTIONS responses and eliminate double-request latency.",
          "Avoid disabling browser web security flags to 'fix' CORS during development; configure proper local proxy rewrites in Vite/Webpack.",
          "Never assume a CORS error means the server did not execute the request; simple requests execute on the server regardless."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "same-origin-policy",

      why: {
        before: "Early web browsers allowed JavaScript from one website to freely inspect the DOM, read cookies, and intercept keystrokes of another website open in an adjacent tab or iframe, enabling catastrophic credential theft and total privacy destruction.",
        problem: "Web browsers require an immutable, fundamental security boundary that isolates untrusted web documents from one another, ensuring that scripts from one site cannot tamper with or read sensitive data from another site.",
        shift: "**Same-Origin Policy (SOP): A critical security mechanism that restricts how a document or script loaded by one origin can interact with a resource from another origin.** Enforcing strict equality across Protocol, Hostname, and Port, SOP is the cornerstone of modern web browser security."
      },

      num: {
        t: "Same-Origin Policy Comparison: Target `https://example.com:443`",
        h: ["Compared URL", "Same Origin?", "Failure Reason / Difference", "Permitted Interactions under SOP", "Blocked Interactions under SOP"],
        r: [
          ["`https://example.com/user/profile`", "YES (Same Origin)", "Identical Protocol (`https`), Host (`example.com`), Port (`443`)", "Full DOM access, `localStorage`, Cookies, unrestricted `fetch`", "None (Complete trusted access)"],
          ["`http://example.com`", "NO (Different Origin)", "Different Protocol (`http` vs `https`)", "Embedding in `<img>`, `<link>`, `<script>`", "Reading DOM via iframe, reading `fetch` response, sharing `localStorage`"],
          ["`https://api.example.com`", "NO (Different Origin)", "Different Hostname (subdomain `api.` is distinct origin)", "Cross-origin embedding, CORS preflight allowed", "Direct DOM access, reading cookies without domain sharing, raw `fetch` without CORS"],
          ["`https://example.com:8080`", "NO (Different Origin)", "Different Port (`8080` vs `443`)", "Standard cross-origin media embedding", "Direct script reads, storage access, DOM inspection"],
          ["`https://vulnerable.com`", "NO (Different Origin)", "Completely different domain", "Embedding in `<iframe sandbox>`, `<img>`", "Total isolation; zero access to data, storage, or DOM"]
        ],
        n: "The Same-Origin Policy (Netscape Navigator 2.0, 1995) defines an **Origin** as the strict 3-tuple: **(Protocol, Hostname, Port)**. Two resources have the same origin if and only if all three values are identical. Under SOP: (1) **Cross-Origin Writes are generally permitted** (submitting a form, following a link), (2) **Cross-Origin Embedding is generally permitted** (embedding `<img>`, `<video>`, `<script src='...'>`, `<iframe src='...'>`), but (3) **Cross-Origin Reads are strictly blocked** (JavaScript cannot read the DOM of a cross-origin iframe, read cross-origin `localStorage`/IndexedDB, or read the response of an unauthorized cross-origin `fetch`). This prevents a malicious tab on `evil.com` from querying `bank.com/api/balance` and reading the returned balance."
      },

      miss: [
        {
          w: "Subdomains like `api.example.com` and `app.example.com` share the same origin.",
          r: "Subdomains are **completely distinct origins**! Even though they share the root domain `example.com`, their hostnames differ, meaning the browser enforces full Same-Origin Policy isolation between them (requiring CORS or cookie domain flags to share data)."
        },
        {
          w: "The Same-Origin Policy prevents a malicious website from sending requests to my server.",
          r: "SOP does **NOT prevent sending requests**! A malicious website can easily submit an HTML `<form>` or trigger a simple GET request to your server. SOP only prevents the malicious site from **reading the response**. Protection against unauthorized requests requires **CSRF tokens** and **`SameSite` cookie flags**."
        },
        {
          w: "A script loaded from a CDN (`<script src='https://cdn.com/lib.js'>`) runs in the CDN's origin.",
          r: "External scripts execute within the **origin of the HTML document that loaded them**, NOT the origin where the script file was hosted! A script from `cdn.com` loaded by `example.com` runs with full access to `example.com`'s DOM, cookies, and `localStorage`."
        },
        {
          w: "Changing `document.domain` is a modern recommended way to relax the Same-Origin Policy.",
          r: "`document.domain` mutation has been **deprecated and disabled by default in modern browsers** (Chrome 115+) due to severe security risks. Cross-origin communication should be handled exclusively via **`window.postMessage()`** or CORS."
        }
      ],

      trade: {
        buys: [
          "Foundational internet security: prevents malicious websites from stealing banking sessions, reading emails, or hijacking accounts.",
          "Storage sandboxing: guarantees that `localStorage`, IndexedDB, and cookies are strictly partitioned by origin.",
          "DOM frame isolation: prevents third-party iframes from inspecting user keystrokes, passwords, or credit card inputs.",
          "Trusted script execution: establishes a reliable security perimeter for web applications."
        ],
        costs: [
          "Microservice architecture friction: requires configuring CORS to communicate across subdomains (`api.app.com` vs `app.com`).",
          "Cross-origin iframe communication overhead: requires writing explicit `postMessage` event bridges for embedded widgets.",
          "CDN asset font restrictions: web fonts and SVGs loaded from external CDNs require explicit CORS headers due to SOP rules.",
          "Multi-origin storage fragmentation: users must re-authenticate across subdomains unless shared cookie domains are configured."
        ],
        avoid: [
          "Never rely on the Same-Origin Policy alone to stop CSRF attacks; enforce `SameSite=Lax/Strict` cookies and CSRF tokens.",
          "Do not load untrusted third-party scripts via `<script src='...'>`, as they inherit full access to your origin's DOM and cookies.",
          "Avoid using legacy `document.domain` hacks to bypass origin restrictions; use `window.postMessage()` with explicit target origins.",
          "Never pass `'*'` as the target origin in `postMessage(data, targetOrigin)` when transmitting sensitive data."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "cookie",

      why: {
        before: "HTTP was a completely stateless protocol: every request was entirely independent, meaning web servers had no way to remember user authentication status, retain shopping cart items, or track sessions across page clicks.",
        problem: "Web applications need a secure, automated mechanism to persist small pieces of state on the client browser that are automatically included in subsequent HTTP requests back to the origin server.",
        shift: "**HTTP Cookie (Web Cookie): A small block of data created by a web server while a user is browsing a website and placed on the user's computer by the user's web browser.** Governed by RFC 6265, cookies enable stateful sessions, authentication tokens, and user tracking across the stateless web."
      },

      num: {
        t: "HTTP Cookie Security Attributes: Flags & Protection Capabilities",
        h: ["Cookie Attribute", "Directive Syntax", "Security Attack Prevented", "Browser Enforcement Behavior", "Production Recommendation"],
        r: [
          ["`HttpOnly`", "`; HttpOnly`", "Cross-Site Scripting (XSS) token theft", "Completely hides cookie from `document.cookie` in JavaScript", "Mandatory for all session auth tokens & JWTs"],
          ["`Secure`", "`; Secure`", "Man-in-the-Middle (MitM) packet sniffing", "Browser only transmits cookie over encrypted HTTPS", "Mandatory for all production cookies"],
          ["`SameSite=Strict`", "`; SameSite=Strict`", "Cross-Site Request Forgery (CSRF)", "Cookie never sent on cross-site requests (even clicking external links)", "High-security banking dashboards, checkout actions"],
          ["`SameSite=Lax`", "`; SameSite=Lax`", "Cross-Site Request Forgery (CSRF)", "Sent only on top-level safe GET navigations; blocked on POST forms", "Modern browser default standard for general sessions"],
          ["`SameSite=None`", "`; SameSite=None; Secure`", "Requires `Secure`; enables third-party cookies", "Cookie sent across all cross-site embeds and iframes", "Third-party embedded widgets, single-sign-on (SSO)"],
          ["`Domain` / `Path`", "`; Domain=.example.com; Path=/`", "Scope confinement", "Restricts cookie transmission to specific domains/subdomains", "Set explicitly to share sessions across subdomains"]
        ],
        n: "A Cookie is initialized by the server via the **`Set-Cookie`** HTTP response header: `Set-Cookie: session_id=xyz123; Secure; HttpOnly; SameSite=Lax; Max-Age=86400; Path=/`. On all subsequent HTTP requests matching the domain and path, the browser automatically attaches the cookie in the **`Cookie`** request header. Under modern web security standards, storing sensitive authentication tokens in **`HttpOnly` cookies is vastly superior to `localStorage`**: if an attacker discovers a Cross-Site Scripting (XSS) vulnerability, they can execute `localStorage.getItem('token')` to steal JWTs immediately, but cannot read an `HttpOnly` cookie. Furthermore, **`SameSite=Lax/Strict`** prevents Cross-Site Request Forgery (CSRF) by refusing to attach the cookie when a request originates from an external third-party site."
      },

      miss: [
        {
          w: "Storing JWT authentication tokens in `localStorage` is safe and standard practice.",
          r: "Storing tokens in `localStorage` is a **critical security vulnerability**! Any third-party script, compromised npm package, or XSS flaw can execute `localStorage.getItem('jwt')` and exfiltrate the token to an attacker. Sensitive authentication tokens MUST be stored in **`HttpOnly; Secure; SameSite=Lax` cookies**, which are completely inaccessible to client-side JavaScript."
        },
        {
          w: "Cookies can store megabytes of offline application data.",
          r: "Cookies are strictly limited by RFC specifications to **4 Kilobytes (4096 bytes)** per cookie, and browsers limit total cookies to $\\approx 50$ per domain. Storing large datasets requires **IndexedDB** or `localStorage`."
        },
        {
          w: "Cookies are automatically deleted when the user closes the browser tab.",
          r: "Only **Session Cookies** (cookies created without an `Expires` or `Max-Age` attribute) are deleted when the browser session ends. If `Max-Age` or `Expires` is set, the cookie is **Persistent** and survives browser restarts until the expiration timestamp passes."
        },
        {
          w: "Third-party tracking cookies are still supported everywhere.",
          r: "Third-party cookies are in the process of **global deprecation**. Safari (ITP) and Firefox (ETP) have blocked third-party tracking cookies by default for years, and Google Chrome is phasing them out under Privacy Sandbox, replacing them with privacy-preserving APIs."
        }
      ],

      trade: {
        buys: [
          "Automatic transmission: browsers automatically include matching cookies on every HTTP request without custom headers.",
          "XSS immunity with `HttpOnly`: completely prevents malicious JavaScript from reading or exfiltrating session tokens.",
          "CSRF protection with `SameSite`: modern `SameSite=Lax` eliminates classic cross-site form submission forgery.",
          "Flexible lifecycle control: supports session-only lifecycles or multi-year persistence via `Max-Age`."
        ],
        costs: [
          "Bandwidth bloat: every single HTTP request (including static images and CSS) carries the cookie string in request headers.",
          "Strict 4KB size limitation: cannot store complex offline application states or large datasets.",
          "Subdomain sharing complexity: improperly scoped domain flags can accidentally leak cookies to insecure subdomains.",
          "Legal and consent requirements: GDPR and ePrivacy directives require complex cookie consent banners in the EU."
        ],
        avoid: [
          "Never store sensitive JWT or session tokens in `localStorage`; always use `HttpOnly; Secure` cookies.",
          "Do not omit the `Secure` flag on production cookies; unencrypted transmission exposes tokens to network sniffing.",
          "Avoid storing massive data strings in cookies that inflate HTTP header sizes across all network requests.",
          "Never set `SameSite=None` without the `Secure` flag, as modern browsers will reject the cookie entirely."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "localstorage",

      why: {
        before: "Storing client-side data required abusing 4KB HTTP cookies, forcing browsers to wastefully upload client state back to the server in request headers on every single image and page fetch.",
        problem: "Client-side web applications need a simple, persistent, key-value storage engine that can store megabytes of data directly in the browser across sessions without transmitting it over the network.",
        shift: "**localStorage: A web storage mechanism that allows JavaScript sites and apps to save key-value pairs in a web browser with no expiration date.** Storing up to 5-10MB of data partitioned by origin, localStorage enables persistent client-side UI settings and offline drafts."
      },

      num: {
        t: "Client-Side Storage Mechanisms: localStorage vs sessionStorage vs IndexedDB",
        h: ["Storage API", "Storage Capacity", "Persistence Scope", "Execution Mode", "Data Types Supported"],
        r: [
          ["`localStorage`", "$5\\text{--}10$ MB per origin", "Permanent (persists across browser restarts until cleared)", "Synchronous (Blocks Main Thread)", "Strings only (UTF-16 key/value)"],
          ["`sessionStorage`", "$5$ MB per origin", "Tab lifecycle only (deleted when browser tab is closed)", "Synchronous (Blocks Main Thread)", "Strings only (UTF-16 key/value)"],
          ["`IndexedDB`", "Hundreds of MB to GBs (disk quota)", "Permanent (origin partitioned)", "Asynchronous (Non-blocking via transactions)", "Structured objects, binary blobs, ArrayBuffers"],
          ["Cache Storage API", "Hundreds of MB to GBs", "Permanent (Service Worker controlled)", "Asynchronous (Promise based)", "HTTP `Request` and `Response` objects"],
          ["Cookies", "$4$ KB total per cookie", "Configurable (`Max-Age`) or session", "Synchronous (sent on HTTP headers)", "US-ASCII / encoded strings"]
        ],
        n: "The `localStorage` API is part of the **Web Storage API specification**. It operates as a synchronous, persistent key-value store scoped strictly to the **Origin** (Protocol + Domain + Port). All keys and values are stored as **DOMString (UTF-16 strings)**: storing complex objects requires serializing with `JSON.stringify()`, and reading requires `JSON.parse()`. Because `localStorage` is **synchronous and runs on the main JavaScript thread**, reading or writing large JSON blobs blocks UI rendering and event processing. Furthermore, because `localStorage` is completely accessible to any JavaScript running on the page, **it provides zero protection against Cross-Site Scripting (XSS)**."
      },

      miss: [
        {
          w: "`localStorage` is a secure place to store user passwords and authentication tokens.",
          r: "`localStorage` is **NOT SECURE FOR SENSITIVE DATA**. Any malicious script injected via an XSS flaw or a compromised third-party npm package can run `localStorage.getItem('token')` and steal the credentials immediately. Session tokens MUST be stored in `HttpOnly` cookies."
        },
        {
          w: "`sessionStorage` shares data across multiple browser tabs open to the same website.",
          r: "`sessionStorage` is strictly scoped to the **specific browser tab (window)**! Opening the exact same URL in a new tab creates a completely separate `sessionStorage` instance. `localStorage` is the API that shares data across multiple tabs of the same origin."
        },
        {
          w: "`localStorage` can store JavaScript objects, Dates, and functions directly.",
          r: "`localStorage` **only stores strings**! If you write `localStorage.setItem('user', { id: 1 })`, it will silently convert the object into the useless string `\"[object Object]\"`. Objects must be manually serialized via `JSON.stringify()`."
        },
        {
          w: "`localStorage` writes are asynchronous and don't affect UI performance.",
          r: "`localStorage` is **100% synchronous and blocking**. Calling `localStorage.setItem()` on a large 5MB JSON string freezes the main thread while the browser writes data to disk, causing visible UI jank and dropped frames."
        }
      ],

      trade: {
        buys: [
          "Zero-setup simplicity: simple synchronous API (`getItem`, `setItem`, `removeItem`) requiring zero async ceremony.",
          "Permanent persistence: data persists across browser restarts and computer reboots until explicitly cleared.",
          "Origin isolation: data is strictly partitioned by origin, preventing other websites from reading your storage.",
          "Ideal for non-sensitive UI settings: perfect for persisting theme preferences (dark mode), audio volume, and draft text."
        ],
        costs: [
          "Extreme XSS vulnerability: any script running on the origin can read and exfiltrate all stored data.",
          "Main thread blocking: synchronous disk I/O freezes the main thread on large read/write operations.",
          "String-only limitation: requires manual `JSON.stringify()` and `JSON.parse()` serialization overhead.",
          "Strict 5MB quota: attempts to exceed the storage quota throw a fatal `QuotaExceededError` exception."
        ],
        avoid: [
          "Never store session tokens, JWTs, credit card numbers, or passwords in `localStorage`; use `HttpOnly` cookies.",
          "Do not store massive multi-megabyte datasets in `localStorage`; use asynchronous `IndexedDB` instead.",
          "Avoid calling `localStorage.setItem()` inside high-frequency loops (e.g., scroll or mousemove handlers).",
          "Never forget to wrap `localStorage` access in `try/catch` blocks; private browsing modes or full disks throw quota errors."
        ]
      }
    }

  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
