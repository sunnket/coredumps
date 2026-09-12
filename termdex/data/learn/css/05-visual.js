/* CSS — colour, type and the visual layer. */
TD.addLessons("css", [

  {
    t: "Colour, Typography and Custom Properties",
    m: "visual",
    lvl: "core",
    s: "The layer that makes a page look deliberate, and the variable system that makes it themeable.",
    goal: [
      "Choose and write colours, including with enough contrast",
      "Set typography that is readable rather than merely styled",
      "Build a design system with custom properties"
    ],
    b: [
      { p: "Layout decides where things go. This lesson is what makes a page look like somebody meant it — and most of the difference is consistency rather than talent." },

      { h: "Writing colours" },
      {
        code: {
          lang: "css",
          lines: [
            { c: "color: #1a1a1a;", w: "**Hex.** `#RGB` shorthand expands — `#fff` is `#ffffff`. `#1a1a1aCC` adds alpha as two more digits." },
            { c: "color: rgb(26 26 26);", w: "**Modern syntax: spaces, no commas.**" },
            { c: "color: rgb(26 26 26 / 0.8);", w: "**Alpha after a slash.** The old `rgba()` still works and is no longer necessary." },
            { c: "", w: "" },
            { c: "color: hsl(220 90% 56%);", w: "**Hue, saturation, lightness. The one to reach for when building a palette**, because related colours differ in one readable number rather than three opaque ones.", hi: true },
            { c: "color: hsl(220 90% 46%);", w: "**The same colour, 10% darker** — a hover state, derived rather than eyedropped." },
            { c: "", w: "" },
            { c: "color: oklch(60% 0.15 250);", w: "**Perceptually uniform** — equal changes look equal to the eye, which HSL does not manage. Widely supported now and worth adopting for new palettes." },
            { c: "", w: "" },
            { c: "color: currentColor;", w: "**Whatever `color` resolves to here.** Perfect for an SVG icon or a border that should follow its text." },
            { c: "color: transparent;", w: "" }
          ]
        }
      },
      {
        n: "HSL's advantage is that a palette becomes arithmetic. Hold the hue and saturation, vary the lightness, and you have a consistent scale of tints and shades. Doing the same in hex means guessing at six characters and hoping the result looks related.",
        nt: "Why HSL for palettes"
      },

      { h: "Contrast is not optional" },
      { p: "**WCAG** sets minimum contrast ratios, and they are both a legal requirement in many places and simply good design — plenty of people read your site in sunlight." },
      {
        tbl: {
          h: ["Content", "Minimum (AA)", "Enhanced (AAA)"],
          rows: [
            ["Body text", "**4.5 : 1**", "7 : 1"],
            ["Large text (18pt+, or 14pt bold)", "**3 : 1**", "4.5 : 1"],
            ["UI components, focus rings, icons", "**3 : 1**", "—"]
          ]
        }
      },
      {
        l: [
          "**Check it in DevTools.** Inspect a colour swatch in the Styles pane and it shows the contrast ratio with a pass/fail mark.",
          "**Light grey text on white fails**, always. `#999` on `#fff` is 2.8:1 — it looks elegant on your calibrated monitor and is unreadable on a phone outdoors.",
          "**Never use colour alone** to convey meaning. A red border on an invalid field is invisible to a colour-blind user; add an icon or text."
        ]
      },

      { h: "Typography" },
      {
        code: {
          lang: "css",
          lines: [
            { c: "body {", w: "" },
            { c: "  font-family: system-ui, -apple-system, 'Segoe UI', sans-serif;", w: "**A stack, tried left to right.** `system-ui` uses the operating system's own font — zero download, instantly familiar, and genuinely a good default.", hi: true },
            { c: "", w: "" },
            { c: "  font-size: 1rem;", w: "**`rem`, never `px`** — it respects the user's browser font setting." },
            { c: "  line-height: 1.6;", w: "**Unitless.** `1.6` means 1.6× this element's font size, so it scales correctly when nested. `1.6em` computes once and is then inherited as a fixed value — a real trap." },
            { c: "  font-weight: 400;", w: "400 normal, 700 bold. Variable fonts accept anything between." },
            { c: "  letter-spacing: 0;", w: "**Tighten large headings slightly (`-0.02em`), never body text.**" },
            { c: "}", w: "" },
            { c: "", w: "" },
            { c: "h1 { font-size: 2.5rem; line-height: 1.1; }", w: "**Large text wants tighter leading**; 1.5 on a heading looks loose and disconnected." },
            { c: "p  { max-width: 65ch; }", w: "**Line length is the most underrated readability control.** 45–75 characters; `ch` gets you there directly." }
          ]
        }
      },
      {
        code: {
          lang: "css", t: "A type scale — sizes that relate to each other",
          lines: [
            { c: ":root {", w: "" },
            { c: "  --text-sm:   0.875rem;", w: "**Pick a ratio and stick to it.** This is a 1.25 scale." },
            { c: "  --text-base: 1rem;", w: "" },
            { c: "  --text-lg:   1.25rem;", w: "" },
            { c: "  --text-xl:   1.563rem;", w: "" },
            { c: "  --text-2xl:  1.953rem;", w: "" },
            { c: "  --text-3xl:  2.441rem;", w: "" },
            { c: "}", w: "" }
          ],
          after: "Using six related sizes rather than eleven arbitrary ones is most of what makes a page look designed. The specific ratio matters far less than having one."
        }
      },
      {
        code: {
          lang: "css", t: "Loading a web font without the flash",
          lines: [
            { c: "@font-face {", w: "" },
            { c: "  font-family: 'Inter';", w: "" },
            { c: "  src: url('/fonts/inter.woff2') format('woff2');", w: "**WOFF2 only.** Every browser in use supports it; older formats are dead weight." },
            { c: "  font-display: swap;", w: "**Show the fallback font immediately and swap when the real one arrives.** Without this the text is invisible for up to three seconds.", hi: true },
            { c: "  font-weight: 100 900;", w: "**A variable font: one file covering every weight.** Usually smaller than two static weights." },
            { c: "}", w: "" }
          ]
        }
      },

      { h: "Custom properties" },
      { p: "CSS variables. Unlike a preprocessor variable, these are **live in the browser** — they cascade, they inherit, and JavaScript can change them at runtime. That is what makes theming possible." },
      {
        code: {
          lang: "css", file: "tokens.css",
          lines: [
            { c: ":root {", w: "**`:root` is `<html>`.** Declaring here makes them available everywhere by inheritance." },
            { c: "  --color-bg:      hsl(0 0% 100%);", w: "**Two dashes to declare.** The name is arbitrary; be systematic." },
            { c: "  --color-text:    hsl(0 0% 10%);", w: "" },
            { c: "  --color-accent:  hsl(220 90% 56%);", w: "" },
            { c: "  --color-border:  hsl(0 0% 90%);", w: "" },
            { c: "", w: "" },
            { c: "  --space-1: 0.25rem;", w: "**A spacing scale.** Every margin and padding in the project comes from these six values — which is why the result looks consistent." },
            { c: "  --space-2: 0.5rem;", w: "" },
            { c: "  --space-4: 1rem;", w: "" },
            { c: "  --space-8: 2rem;", w: "" },
            { c: "", w: "" },
            { c: "  --radius: 8px;", w: "" },
            { c: "  --shadow: 0 1px 3px rgb(0 0 0 / 0.1);", w: "" },
            { c: "}", w: "" },
            { c: "", w: "" },
            { c: ".card {", w: "" },
            { c: "  background: var(--color-bg);", w: "**`var()` to use one.**", hi: true },
            { c: "  color: var(--color-text);", w: "" },
            { c: "  padding: var(--space-4);", w: "" },
            { c: "  border: 1px solid var(--color-border);", w: "" },
            { c: "  border-radius: var(--radius);", w: "" },
            { c: "  box-shadow: var(--shadow);", w: "" },
            { c: "}", w: "" },
            { c: "", w: "" },
            { c: ".card { padding: var(--card-padding, var(--space-4)); }", w: "**A fallback second argument** — used if the variable is not defined." }
          ]
        }
      },
      {
        code: {
          lang: "css", t: "Dark mode, from the same tokens",
          lines: [
            { c: "@media (prefers-color-scheme: dark) {", w: "**Respects the operating system setting.**" },
            { c: "  :root {", w: "" },
            { c: "    --color-bg:     hsl(0 0% 8%);", w: "**Redefine only the tokens.** Every rule using `var(--color-bg)` updates — no component CSS changes at all.", hi: true },
            { c: "    --color-text:   hsl(0 0% 92%);", w: "" },
            { c: "    --color-border: hsl(0 0% 20%);", w: "" },
            { c: "  }", w: "" },
            { c: "}", w: "" },
            { c: "", w: "" },
            { c: "[data-theme=\"dark\"] {", w: "**And a manual toggle**, set by JavaScript on `<html>` to override the system preference." },
            { c: "  --color-bg:   hsl(0 0% 8%);", w: "" },
            { c: "  --color-text: hsl(0 0% 92%);", w: "" },
            { c: "}", w: "" }
          ],
          after: "This is exactly how NodeCraft's own theme toggle works. Two dozen tokens redefined in two places, and the entire site switches."
        }
      },
      {
        n: "Custom properties inherit, which is the feature that makes component variants trivial: set `--card-bg` on `.card--danger` and only that card's children see the new value. A preprocessor variable is compiled away before the browser ever sees it and can do none of this.",
        nt: "Why they beat preprocessor variables"
      },

      { h: "Backgrounds, shadows and effects" },
      {
        code: {
          lang: "css",
          lines: [
            { c: "background: linear-gradient(180deg, #fff, #f3f4f6);", w: "**Angle then colour stops.** `radial-gradient` and `conic-gradient` too." },
            { c: "", w: "" },
            { c: "background-image: url('/hero.jpg');", w: "" },
            { c: "background-size: cover;", w: "**Fill the box, cropping as needed.** `contain` fits the whole image, letterboxed." },
            { c: "background-position: center;", w: "" },
            { c: "", w: "" },
            { c: "box-shadow: 0 1px 2px rgb(0 0 0 / 0.06),", w: "**Layer two or three subtle shadows** rather than one heavy one — a tight close shadow plus a wide soft one is what makes it look real.", hi: true },
            { c: "            0 8px 24px rgb(0 0 0 / 0.08);", w: "" },
            { c: "box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.1);", w: "`inset` draws it inside." },
            { c: "", w: "" },
            { c: "opacity: 0.6;", w: "**Affects the element and all its children.** Use a transparent colour instead when you only want the background faded." },
            { c: "filter: blur(4px) grayscale(1);", w: "" },
            { c: "backdrop-filter: blur(12px);", w: "**Blurs what is *behind* the element** — the frosted-glass effect." }
          ]
        }
      },

      { h: "Transitions" },
      {
        code: {
          lang: "css",
          lines: [
            { c: ".button {", w: "" },
            { c: "  background: var(--color-accent);", w: "" },
            { c: "  transition: background 150ms ease, transform 150ms ease;", w: "**Name the properties.** `transition: all` also animates things you did not intend and costs performance.", hi: true },
            { c: "}", w: "" },
            { c: ".button:hover { background: hsl(220 90% 46%); transform: translateY(-1px); }", w: "" },
            { c: "", w: "" },
            { c: "/* animate only transform and opacity where you can */", w: "**Those two run on the compositor** and stay at 60fps. Animating `width`, `height`, `top` or `margin` triggers layout on every frame and stutters." },
            { c: "", w: "" },
            { c: "@media (prefers-reduced-motion: reduce) {", w: "" },
            { c: "  *, *::before, *::after {", w: "" },
            { c: "    animation-duration: 0.01ms !important;", w: "**Respect the setting.** Some people get genuinely ill from motion, and this is a two-line kindness that costs nothing.", hi: true },
            { c: "    transition-duration: 0.01ms !important;", w: "" },
            { c: "  }", w: "" },
            { c: "}", w: "" }
          ]
        }
      },
      { trap: "Durations above about 300ms feel sluggish for interface feedback. Hover and focus want 100–200ms; a panel sliding in can take 250–400ms. The most common mistake is making animations too slow because they look nice in isolation — used fifty times an hour, they become an irritation." },

      {
        tryit: {
          t: "Build a token system with a dark mode",
          task: "Define custom properties for colours, spacing, radius and shadow. Style a card and a button entirely from them. Then add a dark mode by redefining only the colour tokens — with no changes to any component rule.",
          hint: "If you have to touch a component rule to make dark mode work, that value should have been a token.",
          sol: { lang: "css", code: ":root {\n  --bg:      hsl(0 0% 100%);\n  --surface: hsl(0 0% 98%);\n  --text:    hsl(0 0% 12%);\n  --muted:   hsl(0 0% 40%);\n  --border:  hsl(0 0% 90%);\n  --accent:  hsl(220 90% 56%);\n  --accent-hover: hsl(220 90% 46%);\n\n  --space-2: 0.5rem;\n  --space-4: 1rem;\n  --radius: 10px;\n  --shadow: 0 1px 2px rgb(0 0 0 / 0.06), 0 8px 24px rgb(0 0 0 / 0.06);\n}\n\n@media (prefers-color-scheme: dark) {\n  :root {\n    --bg:      hsl(0 0% 8%);\n    --surface: hsl(0 0% 12%);\n    --text:    hsl(0 0% 92%);\n    --muted:   hsl(0 0% 62%);\n    --border:  hsl(0 0% 22%);\n    --shadow:  0 1px 2px rgb(0 0 0 / 0.4);\n  }\n}\n\nbody { background: var(--bg); color: var(--text); }\n\n.card {\n  background: var(--surface);\n  border: 1px solid var(--border);\n  border-radius: var(--radius);\n  padding: var(--space-4);\n  box-shadow: var(--shadow);\n}\n\n.button {\n  background: var(--accent);\n  color: white;\n  border: 0;\n  border-radius: var(--radius);\n  padding: var(--space-2) var(--space-4);\n  transition: background 150ms ease;\n}\n.button:hover { background: var(--accent-hover); }" },
          w: "Note that `--shadow` is redefined in dark mode too. A shadow tuned for a white background is invisible on a dark one — which is the sort of detail that separates a dark mode that was designed from one that was inverted."
        }
      }
    ],
    k: [
      "HSL makes a palette arithmetic — hold the hue, vary the lightness. Check contrast in DevTools: 4.5:1 for body text.",
      "Font sizes in `rem`, `line-height` unitless, line length around 65ch, and a small type scale rather than arbitrary sizes.",
      "Custom properties are live in the browser and inherit, which is what makes theming and component variants work.",
      "Animate `transform` and `opacity` only, keep it under 300ms, and honour `prefers-reduced-motion`."
    ],
    r: ["CSS", "Design System", "WCAG", "Dark Mode", "Colour Space", "Web Accessibility"],
    drill: {
      lang: "css",
      reps: 4,
      items: [
        { c: "color: hsl(220 90% 56%);", w: "write a colour you can derive shades from" },
        { c: "--color-accent: hsl(220 90% 56%);", w: "declare a design token" },
        { c: "background: var(--color-bg);", w: "use a token, with the browser resolving it live" },
        { c: "padding: var(--card-padding, var(--space-4));", w: "use a token with a fallback" },
        { c: "@media (prefers-color-scheme: dark) { :root { --color-bg: hsl(0 0% 8%); } }", w: "switch the whole theme by redefining tokens" },
        { c: "transition: background 150ms ease, transform 150ms ease;", w: "animate two named properties" },
        { c: "@media (prefers-reduced-motion: reduce) { }", w: "respect a user who has asked for less motion" }
      ]
    }
  }

]);
