/* ==========================================================================
   Depth pass 117 — Web Frontend batch 2: Responsive Design & Web Accessibility.
   Responsive Design, Media Query, Mobile-First Design, Viewport,
   Web Accessibility, ARIA, WCAG.

   Fluid proportion grids, CSSOM media list evaluations, viewport virtual scaling,
   and Accessibility Tree (a11y tree) screen-reader invariants power inclusive interfaces.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "responsive-design",

      why: {
        before: "Websites were designed for fixed-width 960px desktop monitors, forcing mobile users to pinch, zoom, and scroll horizontally across microscopic text, or forcing companies to maintain separate, stripped-down mobile URLs (`m.example.com`).",
        problem: "The proliferation of smartphones, tablets, laptops, and ultra-wide 4K monitors requires a single unified codebase whose layout, typography, and media dynamically adapt to any screen geometry.",
        shift: "**Responsive Web Design (RWD): An approach to web design that aims to make web pages render well on a variety of devices and window or screen sizes.** Coined by Ethan Marcotte in 2010, RWD synthesizes three core technical pillars: fluid proportion-based grids, flexible images, and CSS media queries."
      },

      num: {
        t: "Responsive Design Foundations: The Three Core Marcotte Pillars",
        h: ["RWD Pillar", "Technical Mechanism", "Underlying Math / CSS Property", "Behavior on Narrow Screens", "Modern Evolution / Standard"],
        r: [
          ["1. Fluid Grids", "Relative percentage & fractional layout sizing", "$\\text{target} / \\text{context} = \\text{result}$", "Containers resize proportionally to viewport width", "CSS Grid (`fr` units), Flexbox, Container Queries"],
          ["2. Flexible Images", "Prevents image overflow past container boundaries", "`max-width: 100%; height: auto;`", "Downscales smoothly while preserving aspect ratio", "`<picture>`, `srcset`, `sizes`, CSS `aspect-ratio`"],
          ["3. Media Queries", "Conditional CSS application based on device media features", "`@media (min-width: 768px) { ... }`", "Re-arranges columns into single stacked vertical flow", "CSS Container Queries (`@container`), Range syntax"],
          ["4. Fluid Typography", "Scales font size dynamically without stepped breakpoints", "`font-size: clamp(1rem, 2vw + 0.5rem, 2.5rem);`", "Smooth continuous scaling between bounds", "CSS `clamp()`, `min()`, `max()`, viewport units (`cqw`, `vi`)"]
        ],
        n: "Responsive Web Design shifts the layout paradigm from fixed Cartesian pixels to fluid proportions. Marcotte's foundational mathematical formula for fluid grids dictates: $\\text{width} = \\frac{\\text{target}}{\\text{context}} \\times 100\\%$. To prevent media from breaking grid boundaries, flexible media enforces `img, video, canvas { max-width: 100%; height: auto; }`. In modern web engineering, RWD has evolved beyond global viewport measurements: **CSS Container Queries (`@container`)** allow individual components to query their parent container's width, enabling truly autonomous modular UI components that adapt whether placed in a narrow sidebar or a wide main body."
      },

      miss: [
        {
          w: "Responsive Web Design and Adaptive Web Design are identical.",
          r: "**Responsive design** uses a single fluid layout that continuously shifts and scales smoothly across all possible screen widths. **Adaptive design** serves distinct, fixed-width layouts tailored to specific device bucket sizes (e.g., separate fixed layouts for 320px, 768px, 1024px)."
        },
        {
          w: "Responsive design means hiding half the content on mobile phones to save space.",
          r: "Hiding features on mobile creates a frustrating user experience where mobile users cannot complete tasks. Modern responsive design preserves **content and functional parity** across devices, reorganizing and restyling content rather than deleting it."
        },
        {
          w: "Using percentage widths on images is sufficient to make them responsive.",
          r: "Percentage width alone scales the CSS box size, but does not solve **bandwidth waste**. Loading a 4000px 5MB desktop image on a 3G mobile device burns user data. True responsive images require the **`<picture>` element** and **`srcset`** to serve smaller physical image files to smaller screens."
        },
        {
          w: "Responsive design is only concerned with screen width.",
          r: "RWD encompasses screen height, pixel density (Retina displays via `device-pixel-ratio`), orientation (landscape vs portrait), input modalities (hover capability vs touch pointers via `@media (hover: hover)`), and user accessibility preferences (`prefers-color-scheme`, `prefers-reduced-motion`)."
        }
      ],

      trade: {
        buys: [
          "Unified codebase: maintains a single codebase and URL structure for desktop, tablet, and mobile devices.",
          "SEO advantage: Google prioritizes responsive mobile-friendly sites under Mobile-First Indexing.",
          "Future-proof hardware compatibility: fluid proportion grids automatically support new device form factors and folding screens.",
          "Lower long-term maintenance: eliminates the operational cost of maintaining separate desktop and mobile backend templates."
        ],
        costs: [
          "Design and QA complexity: requires extensive cross-device testing across dozens of screen sizes and orientations.",
          "CSS bundle size: maintaining multiple breakpoint rules and fluid clamp math increases stylesheet size.",
          "Performance pitfalls: serving desktop-sized assets or heavy DOM structures to low-end mobile devices harms Core Web Vitals.",
          "Cognitive layout overhead: designing interfaces that must gracefully morph from 4-column grids to single vertical cards is challenging."
        ],
        avoid: [
          "Never design a desktop-only layout and attempt to patch it for mobile as an afterthought; use Mobile-First methodology.",
          "Do not use fixed pixel widths (`width: 1200px`) on main layout containers without setting `max-width: 100%`.",
          "Avoid disabling user zoom in the viewport meta tag (`user-scalable=no`), as this severely violates accessibility standards.",
          "Never assume mobile users don't need advanced features available on desktop; maintain functional parity."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "media-query",

      why: {
        before: "Stylesheets applied uniformly to all client devices regardless of physical screen size, resolution, or orientation, resulting in unusable desktop interfaces on mobile screens.",
        problem: "CSS needs a declarative conditional mechanism to query device characteristics and user preferences, applying specific style rules only when environmental conditions are satisfied.",
        shift: "**Media Query: A CSS technique introduced in CSS3 that uses the `@media` rule to include a block of CSS properties only if a certain condition (media type and media features) is true.** Evaluating viewport geometry, pixel density, input mechanisms, and accessibility preferences, media queries power responsive web design."
      },

      num: {
        t: "Media Query Features: Breakpoints, Inputs & Accessibility Capabilities",
        h: ["Media Feature", "Syntax Example", "Evaluation Target", "Modern Range Syntax", "Primary Engineering Use Case"],
        r: [
          ["Viewport Width", "`@media (min-width: 768px)`", "Viewport dimensions in CSS pixels", "`@media (width >= 768px)`", "Responsive column layout switching (tablet/desktop)"],
          ["Device Orientation", "`@media (orientation: landscape)`", "Aspect ratio comparison (width > height)", "`@media (orientation: portrait)`", "Mobile video player fullscreen adjustments"],
          ["Display Density", "`@media (min-resolution: 2dppx)`", "Physical device pixels per CSS pixel", "`@media (resolution >= 192dpi)`", "Serving high-resolution @2x graphics for Retina displays"],
          ["Pointer / Hover", "`@media (hover: hover) and (pointer: fine)`", "Hardware input capabilities", "`@media (hover: none)`", "Disabling hover tooltips and expanding click touch targets for touchscreens"],
          ["Accessibility Preference", "`@media (prefers-reduced-motion: reduce)`", "Operating system accessibility setting", "User accessibility intent", "Disabling non-essential animations for vestibular disorders"],
          ["Color Scheme Preference", "`@media (prefers-color-scheme: dark)`", "OS dark/light theme setting", "User aesthetic/battery preference", "Automated system Dark Mode theme switching"]
        ],
        n: "In browser rendering engines, media queries are evaluated by the **CSSOM MediaList** engine. When the browser window resizes, the engine evaluates active `@media` rules against current viewport metrics: if an evaluation changes from false to true, the browser recomputes the cascade, invalidates the affected style nodes, and triggers layout reflow. Modern CSS Media Queries Level 4 introduced cleaner **Mathematical Range Syntax** (`@media (400px <= width <= 900px)` replacing cumbersome `min-width`/`max-width` chains) and expanded beyond viewport geometry into user capabilities: `@media (pointer: coarse)` targets finger-touch displays, while `@media (prefers-contrast: more)` adapts UI borders for low-vision users."
      },

      miss: [
        {
          w: "Media queries can only check the width and height of the screen.",
          r: "Media queries can query a vast array of hardware and user features: color schemes (`prefers-color-scheme`), motion sensitivities (`prefers-reduced-motion`), contrast settings (`prefers-contrast`), pointer accuracy (`pointer: fine` vs `coarse`), hover capabilities (`hover: none`), display refresh rates, and print modes."
        },
        {
          w: "You should create media query breakpoints matching the exact pixel widths of the latest iPhones.",
          r: "Targeting specific device widths (e.g., 390px for iPhone 14) is an **anti-pattern**. New phones with unique widths are released every year. Breakpoints should be placed **where the content itself breaks** or along standardized major ranges (e.g., Mobile: $<640\\text{px}$, Tablet: $768\\text{px}$, Desktop: $1024\\text{px}$, Wide: $1280\\text{px}$)."
        },
        {
          w: "Media queries cannot be evaluated or used inside JavaScript.",
          r: "Browsers provide the native **`window.matchMedia(query)` API**. JavaScript can evaluate media queries dynamically and listen for changes via `.addEventListener('change', callback)`, allowing JS components to respond to theme changes or viewport shifts."
        },
        {
          w: "Using hundreds of media queries in CSS severely slows down page rendering.",
          r: "Media queries are parsed once into the CSSOM during stylesheet loading and indexed by media condition. Evaluating media rules is computationally lightweight C++ bitmask checking; the performance cost comes from the subsequent layout reflows triggered if styles change."
        }
      ],

      trade: {
        buys: [
          "Device-tailored styling: adapts layout, typography, and controls precisely to client screen dimensions.",
          "Accessibility personalization: respects user OS preferences for dark mode, high contrast, and reduced motion.",
          "Input optimization: customizes hit targets (48px for touch) and enables hover tooltips only for mouse users.",
          "Print optimization: `@media print` generates clean, paper-formatted printouts with stripped navigation bars."
        ],
        costs: [
          "Global viewport limitation: evaluates the global window width, unable to adapt to the width of an isolated parent component (solved by Container Queries).",
          "Maintenance overhead: managing dozens of fragmented media queries across complex stylesheets introduces specificity bugs.",
          "Testing complexity: requires automated viewport resizing testing suites (Playwright, Cypress) across multiple breakpoints.",
          "Layout shift risk: content popping or shifting as media queries trigger post-load causes Cumulative Layout Shift (CLS)."
        ],
        avoid: [
          "Never set breakpoints targeting specific smartphone hardware models; set breakpoints based on content flow.",
          "Do not ignore `@media (prefers-reduced-motion: reduce)`; always disable auto-playing animations for motion-sensitive users.",
          "Avoid mixing Desktop-First (`max-width`) and Mobile-First (`min-width`) media queries in the same stylesheet; stick to Mobile-First.",
          "Never use media queries to hide large DOM trees on mobile if avoiding the download altogether via dynamic imports is possible."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "mobile-first-design",

      why: {
        before: "Developers built heavy, sprawling desktop interfaces first, and then attempted to 'gracefully degrade' them for mobile by hiding elements with `display: none` and overriding desktop CSS with hundreds of complex `max-width` overrides.",
        problem: "Desktop-first development produces bloated, slow mobile experiences that force constrained mobile networks and low-end mobile CPUs to download, parse, and evaluate massive desktop codebases.",
        shift: "**Mobile-First Design: An engineering and design philosophy that prioritizes designing and coding for the smallest screen (mobile) first, progressively enhancing the interface for larger displays (tablets, desktops).** Pioneered by Luke Wroblewski in 2009, mobile-first uses `min-width` media queries to layer complexity upwards."
      },

      num: {
        t: "Mobile-First vs Desktop-First CSS Architecture",
        h: ["Dimension", "Mobile-First (Progressive Enhancement)", "Desktop-First (Graceful Degradation)", "CSS Media Query Strategy", "Performance Consequence"],
        r: [
          ["Default Styles (No Media Query)", "Base styles target mobile devices ($1$-column flow)", "Base styles target large desktop ($4$-column grid)", "Base CSS is lean and clean", "Mobile devices load base CSS without running media overrides"],
          ["Media Query Type", "`min-width` (Scaling upwards)", "`max-width` (Scaling downwards)", "`@media (min-width: 768px)`", "`min-width` layers styles progressively without undoing code"],
          ["Override Requirement", "Additive: adds columns and features as space grows", "Subtractive: writes CSS to undo desktop floats, widths, grids", "Minimal resets needed", "Desktop-first forces mobile to download rules just to override them"],
          ["Asset Delivery", "Loads lightweight assets; lazily enhances for desktop", "Loads desktop assets; attempts to shrink or hide", "Targeted responsive loaders", "Mobile-first drastically improves mobile Largest Contentful Paint (LCP)"],
          ["User Experience Focus", "Forces focus on core essential user tasks and content", "Tempts designers to add non-essential sidebar clutter", "Content prioritization", "Cleaner, higher-converting user flows"]
        ],
        n: "Mobile-First is an implementation of **Progressive Enhancement**. Base CSS styles (outside any `@media` block) define the simple, single-column vertical flow suitable for mobile phones. As viewport width expands, **`min-width` media queries** progressively layer on multi-column grids, hover states, and expansive typography. In contrast, Desktop-First architectures declare complex multi-column grids as defaults and use `max-width` media queries to manually reset `float: none; width: 100%; display: block;` on mobile, forcing mobile browsers to parse and override bloated rules. In Google's search infrastructure, **Mobile-First Indexing** means Googlebot indexes and ranks web pages based exclusively on their mobile version, making mobile-first performance a core SEO requirement."
      },

      miss: [
        {
          w: "Mobile-First means you don't care about the desktop experience.",
          r: "Mobile-First is about **prioritization and architectural order**, NOT ignoring desktop. By stripping away desktop clutter to focus on the essential user journey first, the resulting desktop experience is significantly cleaner, faster, and more focused."
        },
        {
          w: "Mobile-First and responsive design are mutually exclusive choices.",
          r: "Mobile-First is the **preferred methodology for implementing responsive design**. Responsive design is the technical toolkit (fluid grids, media queries); Mobile-First is the engineering strategy of applying that toolkit from mobile upwards using `min-width`."
        },
        {
          w: "Hiding a large desktop element with `display: none` on mobile saves mobile data.",
          r: "Setting `display: none` on an `<img>` or heavy DOM node **does not stop the mobile browser from downloading it**! The browser's preload scanner downloads images and scripts in the HTML regardless of CSS `display: none`. Mobile-first requires avoiding rendering the markup or using responsive images."
        },
        {
          w: "Writing CSS mobile-first requires using different HTML markup for mobile and desktop.",
          r: "Mobile-first uses the **exact same semantic HTML markup** for all devices. The single HTML document is styled additively using CSS `min-width` breakpoints."
        }
      ],

      trade: {
        buys: [
          "Optimized mobile performance: mobile devices execute minimal, clean base CSS without executing heavy overrides.",
          "Mobile-First SEO alignment: aligns with Google's Mobile-First Indexing to ensure maximum search engine visibility.",
          "Additive CSS architecture: styles layer cleanly with `min-width` without needing messy resets (`margin: 0; width: auto`).",
          "Disciplined product focus: forces product teams to identify core user actions without relying on desktop screen real estate."
        ],
        costs: [
          "Mental shift for desktop developers: developers accustomed to wide screens must learn to design for narrow mobile constraints first.",
          "Client stakeholder friction: executives often insist on reviewing desktop mockups first during product design phases.",
          "Complex desktop refactoring: expanding mobile components into intricate desktop dashboards requires thoughtful architectural planning.",
          "Testing discipline: requires continuously testing on constrained CPU mobile throttlers rather than high-powered developer laptops."
        ],
        avoid: [
          "Never mix `max-width` and `min-width` arbitrarily in the same CSS file; commit to a consistent `min-width` mobile-first architecture.",
          "Do not hide massive desktop components on mobile using `display: none` to simulate mobile-first design.",
          "Avoid testing only in desktop browser device emulators; test on physical budget mobile devices to catch CPU and memory bottlenecks.",
          "Never sacrifice desktop usability; ensure tablet and desktop viewports take full advantage of wide horizontal screen real estate."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "viewport",

      why: {
        before: "When smartphones first launched (original iPhone, 2007), web pages were designed for 980px desktop screens; mobile browsers had to invent an artificial zoomed-out desktop canvas that made text microscopic and unreadable.",
        problem: "Mobile browsers need an explicit instruction from web developers declaring how the document's layout dimensions should map to the physical screen width of the device.",
        shift: "**Viewport: The visible area of a web page on a display device.** Governed on mobile devices by the `<meta name='viewport'>` tag, it bridges physical hardware pixels (device pixels) to logical layout pixels (CSS pixels), enabling responsive mobile rendering."
      },

      num: {
        t: "Viewport Concepts: Layout Viewport vs Visual Viewport vs Physical Screen",
        h: ["Viewport Concept", "Definition / Entity", "Typical Mobile Dimension", "Zoom Impact", "JavaScript Access API"],
        r: [
          ["Layout Viewport", "The virtual canvas the browser uses to calculate CSS layout", "$390\\text{ px}$ (with meta tag) vs $980\\text{ px}$ (without)", "Unchanged by pinch-zoom", "`document.documentElement.clientWidth`"],
          ["Visual Viewport", "The physical part of the web page currently visible on screen", "Shrinks as user pinches and zooms into content", "Changes dynamically with pinch-zoom", "`window.visualViewport.width`"],
          ["Ideal Viewport", "The perfect 1:1 pixel size for the device screen in CSS pixels", "Matches physical hardware dimensions scaled by DPR", "Fixed per device hardware", "Target of `width=device-width`"],
          ["Device Pixel Ratio (DPR)", "Ratio of physical hardware screen pixels to logical CSS pixels", "$2.0$ (Retina) to $3.0$ (OLED)", "Fixed hardware multiplier", "`window.devicePixelRatio`"],
          ["Dynamic Viewport Units", "`dvh`, `lvh`, `svh` (accounting for mobile browser URL bars)", "Expands/contracts as mobile address bar slides away", "Tracks UI chrome visibility", "CSS units: `100dvh`, `100svh`, `100lvh`"]
        ],
        n: "The mobile viewport represents the fundamental bridge between **Hardware Device Pixels** and **CSS Logical Pixels**. Without a viewport meta tag, mobile browsers assume legacy desktop content and assign a default **Layout Viewport** of $980\\text{ px}$, rendering the page zoomed out. Declaring `<meta name='viewport' content='width=device-width, initial-scale=1.0'>` instructs the layout engine: (1) Set the Layout Viewport to match the physical width of the device in device-independent CSS pixels (`width=device-width`), and (2) Establish a 1:1 zoom ratio (`initial-scale=1.0`). In modern mobile browsers (iOS Safari, Android Chrome), the floating address bar dynamically appears and disappears on scroll; modern CSS handles this via **Dynamic Viewport Units**: **`svh`** (Small Viewport Height, when address bar is visible), **`lvh`** (Large Viewport Height, when address bar is hidden), and **`dvh`** (Dynamic Viewport Height, which tracks the real-time position)."
      },

      miss: [
        {
          w: "A CSS pixel and a physical screen pixel are the exact same thing.",
          r: "On high-density displays (Retina, 4K), **one CSS pixel does NOT equal one physical pixel**. The **Device Pixel Ratio (DPR)** (typically $2\\times$ or $3\\times$) means a $100 \\times 100$ CSS pixel box is actually rendered using $200 \\times 200 = 40{,}000$ physical hardware LED pixels on a $2\\times$ screen."
        },
        {
          w: "`100vh` in CSS works reliably for full-screen hero sections on mobile phones.",
          r: "`100vh` on mobile phones is notoriously buggy: mobile browsers calculate `100vh` assuming the address bar is **completely hidden**. When the URL bar is visible, `100vh` causes the bottom of the content to be hidden behind the browser interface, forcing users to scroll. Modern CSS solves this using **`100dvh`** or **`100svh`**."
        },
        {
          w: "Adding `user-scalable=no` or `maximum-scale=1.0` is a good way to make your web app feel like a native app.",
          r: "Disabling pinch-to-zoom is a **severe accessibility violation (WCAG 1.4.4)**. Visually impaired users rely on pinch-to-zoom to read text. Modern mobile Safari completely ignores `user-scalable=no` to protect user accessibility."
        },
        {
          w: "The viewport meta tag is only needed on mobile phones.",
          r: "The viewport tag is required for any device that can render mobile-responsive layouts, including tablets, foldable displays, smart TVs, and split-screen desktop browser windows."
        }
      ],

      trade: {
        buys: [
          "Enables responsive rendering: allows CSS media queries to calculate breakpoints against real device widths rather than 980px.",
          "Eliminates mobile zoom glitches: displays text and UI elements at comfortable, legible physical sizes out of the box.",
          "Dynamic mobile address bar adaptation: modern units (`dvh`, `svh`) prevent content from being clipped behind browser chrome.",
          "High-DPI asset clarity: pairing viewport awareness with DPR allows serving sharp Retina images without blurriness."
        ],
        costs: [
          "Legacy desktop page breakage: applying the viewport meta tag to a legacy non-responsive desktop site breaks layout completely.",
          "Mobile browser address bar jitter: using `100dvh` can trigger layout recalculations as the address bar animates on scroll.",
          "Cross-browser viewport edge cases: different mobile browsers handle virtual keyboard appearance in the viewport differently.",
          "Visual vs Layout viewport confusion: scrolling and zooming can desynchronize absolute coordinate calculations in JavaScript."
        ],
        avoid: [
          "Never omit the `<meta name='viewport' content='width=device-width, initial-scale=1.0'>` tag in modern web applications.",
          "Do not set `user-scalable=no` or `maximum-scale=1.0` in the viewport tag; always allow users to zoom.",
          "Avoid using `height: 100vh` for mobile full-screen layouts; use `height: 100dvh` or `min-height: 100svh`.",
          "Never assume `window.innerWidth` accounts for on-screen mobile virtual keyboards; use `window.visualViewport`."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "web-accessibility",

      why: {
        before: "Websites were engineered exclusively for able-bodied users using high-resolution monitors and standard computer mice, completely locking out millions of people with visual, auditory, motor, or cognitive disabilities.",
        problem: "Digital public infrastructure, enterprise software, and e-commerce platforms must be usable by all people—including those who are blind, color blind, deaf, physically impaired, or navigating solely with assistive technologies.",
        shift: "**Web Accessibility (a11y): The inclusive practice of ensuring there are no barriers that prevent interaction with, or access to, websites on the World Wide Web by people with physical, situational, or socio-economic disabilities.** Codified under the W3C Web Accessibility Initiative (WAI) and enforced by global legal mandates (ADA Title III, European Accessibility Act), a11y is an essential software quality discipline."
      },

      num: {
        t: "Web Accessibility (a11y) Disability Categories & Technical Solutions",
        h: ["Disability Category", "User Experience Barrier", "Assistive Technology Used", "Technical Engineering Solution", "Testing / Verification Tool"],
        r: [
          ["Visual (Blindness)", "Cannot see rendered pixel interface", "Screen Readers (NVDA, JAWS, VoiceOver)", "Semantic HTML landmarks, alt text, ARIA attributes", "Screen reader audio audit, axe-core"],
          ["Visual (Low Vision / Color Blind)", "Low contrast text; red/green color confusion", "Screen magnifiers, OS high-contrast mode", "WCAG 4.5:1 color contrast ratio, non-color status icons", "Chrome DevTools Contrast Analyzer"],
          ["Motor / Physical Impairment", "Cannot operate a physical mouse or touch screen", "Keyboard only, Switch Access, Eye tracking", "100% keyboard navigability (`Tab`), visible focus rings", "Keyboard-only navigation audit (no mouse)"],
          ["Auditory (Deaf / Hard of Hearing)", "Cannot hear audio alerts, podcasts, video sound", "Closed Captions, Transcripts", "Synchronized `<track>` captions, visual toast alerts", "Automated caption verification"],
          ["Cognitive / Neurological", "Sensory overload, seizure triggers, confusion", "Ad-blockers, reader modes, text-to-speech", "`prefers-reduced-motion`, simple layout, no strobe flashing ($< 3$ Hz)", "PEST / Lighthouse Cognitive audit"]
        ],
        n: "Web Accessibility operates by constructing the **Accessibility Tree (a11y tree)** parallel to the DOM. The browser's layout engine exposes this tree to OS-level accessibility APIs (MSAA/UIA on Windows, NSAccessibility on macOS, AT-SPI on Linux). Screen readers query the a11y tree to discover an element's **Name**, **Role**, **Value**, and **State**. When semantic HTML (`<button>`, `<input>`) is used, the browser generates a11y nodes automatically. When custom UI widgets are built from scratch, developers must manually bridge them using **WAI-ARIA (Accessible Rich Internet Applications)** attributes. Crucially, accessibility benefits all users: captions help users in noisy environments, high contrast helps users under bright sunlight, and keyboard shortcuts improve power-user productivity."
      },

      miss: [
        {
          w: "Accessibility is a feature you can quickly add at the very end of a project before release.",
          r: "Retrofitting accessibility onto an inaccessible architecture is expensive, painful, and often impossible without rewriting the entire frontend. Accessibility must be designed into the foundational component architecture, color palettes, and keyboard navigation flows from day one."
        },
        {
          w: "Third-party 'Accessibility Overlay' plugins (widgets) automatically make a website ADA compliant.",
          r: "Accessibility overlays are heavily condemned by disability advocates and accessibility experts (see the Overlay Factsheet signed by 800+ a11y professionals). Overlays fail to fix fundamental underlying DOM issues, interfere with native screen readers, and do not protect companies from ADA lawsuits."
        },
        {
          w: "Passing an automated accessibility test (like Lighthouse or Axe) guarantees your site is 100% accessible.",
          r: "Automated scanning tools can only detect approximately **$30\\%\\text{--}40\\%$ of accessibility issues** (e.g., color contrast, missing alt text). They cannot verify whether keyboard focus order is logical, whether alt text actually describes the image accurately, or whether a screen reader experience makes sense."
        },
        {
          w: "Making a site accessible makes it look ugly and boring.",
          r: "Accessibility has zero negative impact on aesthetic beauty. Modern award-winning design systems (Apple, BBC, Stripe) are hyper-accessible, proving that rich animations, beautiful typography, and vibrant palettes thrive alongside accessible contrast and keyboard focus."
        }
      ],

      trade: {
        buys: [
          "Inclusivity: enables over 1 billion people with disabilities worldwide to use digital services independently.",
          "Legal compliance: protects organizations from costly lawsuits and regulatory fines (ADA Title III, Section 508, EAA).",
          "Superior SEO: clean semantic markup, alt text, and logical heading hierarchies directly boost search engine rankings.",
          "Better code quality: accessible components have cleaner DOM structures, robust keyboard support, and fewer UI bugs."
        ],
        costs: [
          "Design constraints: enforcing 4.5:1 color contrast limits certain subtle pastel color palettes.",
          "Engineering effort: custom complex widgets (comboboxes, modal dialogs) require significant focus management code.",
          "Manual QA overhead: necessitates manual keyboard testing and screen-reader testing across VoiceOver and NVDA.",
          "Developer education: requires training engineering teams on ARIA patterns, WCAG specifications, and assistive tech."
        ],
        avoid: [
          "Never remove CSS focus outlines (`outline: none` or `outline: 0`) without replacing them with an accessible custom focus ring.",
          "Do not convey information through color alone (e.g., red text for error without an accompanying icon or text label).",
          "Avoid using third-party accessibility overlay scripts as a substitute for real semantic accessibility remediation.",
          "Never use images of text where real live HTML text can be used instead."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "aria",

      why: {
        before: "Complex client-side JavaScript widgets (modals, dropdown tabs, treeviews, comboboxes) built from `<div>` and `<span>` tags were completely invisible and meaningless to screen readers, which announced them as generic, un-clickable text.",
        problem: "Rich web applications require a standardized set of attributes that can describe the roles, states, and properties of custom, dynamic interactive UI controls to assistive technologies.",
        shift: "**ARIA (WAI-ARIA - Accessible Rich Internet Applications): A set of attributes that define ways to make web content and web applications more accessible to people with disabilities.** Standardized by the W3C, ARIA bridges custom JavaScript UI components directly into the browser's Accessibility Tree."
      },

      num: {
        t: "ARIA Taxonomy: Roles, States & Properties",
        h: ["ARIA Attribute Category", "Core Mechanism", "Attributes / Values", "DOM / a11y Tree Effect", "Primary Production Example"],
        r: [
          ["Widget Roles", "Declares what custom control represents", "`role='tab'`, `role='dialog'`, `role='slider'`", "Overrides element's natural role in a11y tree", "Custom accessible modal dialog window"],
          ["Landmark Roles", "Identifies major navigable page regions", "`role='search'`, `role='banner'`, `role='main'`", "Enables screen reader keyboard landmark jumping", "Search form header container"],
          ["Live Regions", "Announces dynamic asynchronous updates", "`aria-live='polite'` / `aria-live='assertive'`", "Screen reader reads message without page reload", "Toast notifications, checkout price updates, chat feeds"],
          ["Dynamic States", "Reflects real-time interaction state", "`aria-expanded='true'`, `aria-selected`, `aria-checked`", "Informs assistive tech of toggled visibility/selection", "Collapsible accordion panel, custom checkbox"],
          ["Accessible Name Properties", "Provides verbal label to unnamed controls", "`aria-label='Close'`, `aria-labelledby='titleId'`", "Sets programmatic accessible name in a11y tree", "Icon-only button (e.g., `<button><svg/></button>`)"]
        ],
        n: "WAI-ARIA operates by decorating DOM elements with semantic metadata that is consumed exclusively by assistive technologies via the **Accessibility Tree**. ARIA attributes have **zero effect on visual layout, CSS styling, or JavaScript behavior**—they are purely semantic descriptive channels. Under the **ARIA Authoring Practices Guide (APG)**, declaring an ARIA role imposes a strict operational contract: for example, declaring `role='tablist'` requires the developer to manage keyboard navigation (arrow keys to switch tabs, `Space`/`Enter` to select, `Home`/`End` to jump). The cardinal principle is the **First Rule of ARIA**: *Do not use ARIA if a native HTML element with the required semantics already exists.*"
      },

      miss: [
        {
          w: "Adding ARIA attributes automatically adds keyboard navigation and functionality.",
          r: "ARIA **adds zero functionality**! ARIA only provides a verbal label or description to screen readers. Adding `role='button'` to a `<div>` does NOT make it focusable via the `Tab` key, nor does it make it clickable with `Enter` or `Space`. All keyboard handling must be implemented manually in JavaScript."
        },
        {
          w: "More ARIA is always better than less ARIA.",
          r: "Overusing or misapplying ARIA is one of the leading causes of broken accessibility ('No ARIA is better than Bad ARIA'). Adding redundant or contradictory ARIA attributes (e.g., `<button role='link'>`) confuses screen readers and degrades user experience."
        },
        {
          w: "`aria-hidden='true'` hides an element from the visual screen.",
          r: "`aria-hidden='true'` only hides the element from the **Accessibility Tree (screen readers)**. The element remains **completely visible** on screen. To hide an element from both screen readers and visual screens, use the HTML `hidden` attribute or CSS `display: none`."
        },
        {
          w: "`aria-live='assertive'` should be used for all live notifications.",
          r: "`aria-live='assertive'` immediately interrupts whatever the screen reader is currently saying, creating a jarring, stressful experience. It should be reserved exclusively for time-critical emergencies (e.g., server session timeout in 30 seconds). Regular toast notifications and updates should use **`aria-live='polite'`**, which waits until the user pauses speaking."
        }
      ],

      trade: {
        buys: [
          "Accessible custom components: makes complex interactive widgets (tabs, modals, comboboxes) fully usable by screen reader users.",
          "Asynchronous announcement: `aria-live` announces live updates, chat messages, and form validation errors dynamically.",
          "Accessible naming for icon buttons: `aria-label` provides programmatic labels for visual-only SVG buttons (e.g., 'Close', 'Menu').",
          "Rich state communication: `aria-expanded` and `aria-busy` communicate collapsible and loading states clearly."
        ],
        costs: [
          "Implementation responsibility: declaring ARIA roles mandates writing extensive custom keyboard management code.",
          "Desynchronization risk: dynamic ARIA states (`aria-expanded`) can fall out of sync with actual DOM state if JavaScript fails.",
          "No visual feedback: ARIA attributes are invisible, meaning visual testing cannot detect broken or missing ARIA tags.",
          "Verbose markup: complex custom components require dozens of ARIA tags and ID linkages (`aria-describedby`)."
        ],
        avoid: [
          "Never violate the First Rule of ARIA: do not use `<div role='button'>` when you can simply use a native `<button>`.",
          "Do not use `aria-hidden='true'` on focusable elements; this creates a trap where keyboard users focus on an invisible node.",
          "Avoid using `aria-live='assertive'` for routine notifications; default to `aria-live='polite'`.",
          "Never forget to update dynamic ARIA states (`aria-expanded`, `aria-checked`) when the component's state changes in JavaScript."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "wcag",

      why: {
        before: "Organizations had no universal, objective technical criteria to evaluate whether a website was accessible, leading to inconsistent implementations, legal disputes, and arbitrary accessibility standards across countries.",
        problem: "Developers, designers, and regulatory bodies require a globally accepted, testable technical standard that defines explicit success criteria for digital accessibility across all technologies and disability types.",
        shift: "**WCAG (Web Content Accessibility Guidelines): A set of technical recommendations for making web content accessible, developed through the W3C process in cooperation with individuals and organizations around the world.** Built upon four core principles—Perceivable, Operable, Understandable, Robust (POUR)—WCAG is the global legal benchmark for digital inclusion."
      },

      num: {
        t: "WCAG Architecture: Principles, Conformance Levels & Key Success Criteria",
        h: ["POUR Principle", "Definition / Requirement", "Level A (Baseline Minimum)", "Level AA (Global Legal Standard)", "Level AAA (Enhanced / Specialized)"],
        r: [
          ["Perceivable (P)", "Information and UI components must be presentable to users in ways they can perceive", "1.1.1 Non-text Content (Alt text on images)", "1.4.3 Contrast (Minimum: 4.5:1 for normal text, 3:1 for large text)", "1.4.6 Contrast (Enhanced: 7:1 ratio)"],
          ["Operable (O)", "UI components and navigation must be fully operable by all users", "2.1.1 Keyboard (All functionality accessible via keyboard)", "2.4.7 Focus Visible (Any keyboard focusable element has visible indicator)", "2.2.3 No Timing (Zero time limits)"],
          ["Understandable (U)", "Information and the operation of UI must be clear and understandable", "3.1.1 Language of Page (`<html lang='en'>` declared)", "3.3.3 Error Suggestion (Provide guidance on fixing validation errors)", "3.1.5 Reading Level (Lower secondary education reading level)"],
          ["Robust (R)", "Content must be robust enough to be reliably interpreted by wide variety of user agents", "4.1.2 Name, Role, Value (Elements have valid programmatic a11y properties)", "4.1.3 Status Messages (Surface changes via live regions without focus)", "Strict parsing validation (Historic)"]
        ],
        n: "The Web Content Accessibility Guidelines are organized into a strict three-tier hierarchy: **4 Principles (POUR)**, **13 Guidelines**, and measurable **Success Criteria** classified into three Conformance Levels: **Level A** (minimum foundational requirements), **Level AA** (the global target standard referenced in worldwide laws, including ADA Title III, Section 508, and EN 301 549), and **Level AAA** (specialized enhanced requirements). The latest **WCAG 2.2** (October 2023) standard introduced critical mobile criteria: **2.5.8 Target Size (Minimum)** mandates that clickable interactive touch targets must be at least $24 \\times 24\\text{ CSS pixels}$ (or have adequate spacing), and **2.4.11 Focus Not Obscured** prevents sticky headers from covering keyboard-focused inputs."
      },

      miss: [
        {
          w: "Level AAA is the target standard that all commercial websites must achieve.",
          r: "The W3C explicitly states that **Level AAA is NOT recommended as a general policy for entire websites**, because it is impossible to satisfy all AAA criteria for certain types of rich content. **Level AA is the universal legal and commercial target standard** adopted by international legislation and enterprise design systems."
        },
        {
          w: "Large text and small text require the same 4.5:1 color contrast ratio under WCAG AA.",
          r: "Normal text requires a minimum contrast ratio of **4.5:1**. However, **Large Text** (defined by WCAG as 18pt / 24px normal weight, or 14pt / 18.66px bold weight) requires only **3:1 contrast**, recognizing that larger strokes are easier to perceive for low-vision users."
        },
        {
          w: "WCAG only applies to public internet websites.",
          r: "WCAG applies to **all digital products**: internal corporate intranet portals, native mobile apps, desktop software, PDF documents, and kiosk interfaces. Under modern employment discrimination laws, internal enterprise tools must also conform to WCAG AA."
        },
        {
          w: "Every single image must have descriptive text inside its `alt` attribute.",
          r: "Purely decorative images (background flourishes, spacer icons) should have an **empty alt attribute (`alt=''`)**! Providing empty quotes tells screen readers to silently skip the decorative image. Omitting the `alt` attribute entirely causes screen readers to read the raw, unhelpful image filename (`IMG_4021.jpg`)."
        }
      ],

      trade: {
        buys: [
          "Global legal compliance: satisfies international accessibility laws (ADA, Section 508, European Accessibility Act).",
          "Universal usability: improves interface usability, legibility, and navigation clarity for all human beings.",
          "Objective testing criteria: provides verifiable, testable metrics for automated and manual QA engineering audits.",
          "SEO and machine indexing: accessible semantic structures mirror the exact data formats preferred by AI crawlers."
        ],
        costs: [
          "Color palette restrictions: strict 4.5:1 contrast eliminates certain subtle gray-on-white brand aesthetics.",
          "Engineering rigor: mandates focus management, accessible naming, and keyboard trap prevention in all UI components.",
          "Ongoing audit overhead: requires continuous regression testing to prevent new accessibility violations from creeping in.",
          "Specialized QA training: demands that software engineering teams understand screen readers and accessibility devtools."
        ],
        avoid: [
          "Never use a contrast ratio below 4.5:1 for standard body text against its background.",
          "Do not omit `<html lang='...'>`, as screen readers cannot choose the correct pronunciation engine without it.",
          "Avoid click targets smaller than 24x24px (WCAG 2.2 Level AA target size minimum); aim for 44-48px on touchscreens.",
          "Never trap keyboard focus inside a modal dialog without providing a working `Esc` key handler to exit."
        ]
      }
    }

  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
