/* CSS — positioning and transitions / animations. */
TD.addLessons("css", [

    {
        t: "Positioning — Where Things Actually Go",
        m: "position",
        lvl: "core",
        s: "The five values of `position` that control layering, overlays and sticky headers.",
        goal: [
            "Explain what each of the five `position` values does differently",
            "Use `absolute` inside `relative` to place a badge on a card",
            "Build a sticky header that stays without JavaScript"
        ],
        b: [
            { p: "Every element you have written has been in the **normal flow**: the browser stacks blocks top to bottom and inlines left to right. `position` pulls an element out of that flow, or changes how it reacts to scrolling, or pins it to the screen. It is five values, and each one does something genuinely different." },

            { h: "The five values" },
            {
                tbl: {
                    h: ["Value", "Stays in flow?", "Positioned relative to", "Scrolls with page?"],
                    rows: [
                        ["`static`", "Yes", "Not positioned — the default", "Yes"],
                        ["`relative`", "Yes (keeps its space)", "Its own normal position", "Yes"],
                        ["`absolute`", "**No** — removed from flow", "Nearest positioned ancestor", "Yes"],
                        ["`fixed`", "**No** — removed from flow", "The **viewport**", "**No** — stays in place"],
                        ["`sticky`", "Yes (until threshold)", "Scrolls normally, then **sticks**", "Part of each"]
                    ]
                }
            },

            { h: "static — the default you never write" },
            { p: "`position: static` is what every element starts with. Nothing happens, `top`/`left`/`right`/`bottom` are ignored, and `z-index` is ignored. You only need to know it exists because occasionally you set it to override a non-static value back to default." },

            { h: "relative — the anchor point" },
            {
                code: {
                    lang: "css", t: "Nudging without breaking layout",
                    lines: [
                        { c: ".badge {", w: "" },
                        { c: "  position: relative;", w: "**Stays in the flow** — nothing else moves." },
                        { c: "  top: -4px;", w: "**Shifted 4px up from its normal position.** Other elements still think it is where it was." },
                        { c: "  left: 2px;", w: "" },
                        { c: "}" }
                    ]
                }
            },
            { p: "`relative` has two jobs. The first is small nudges. The second, and far more important, is **creating the reference frame for `absolute` children**." },

            { h: "absolute — placed exactly where you say" },
            {
                code: {
                    lang: "css", t: "A notification badge on a card",
                    lines: [
                        { c: ".card {", w: "" },
                        { c: "  position: relative;", w: "**This makes the card the reference frame.** Without it, the badge would position itself against the viewport or a higher ancestor.", hi: true },
                        { c: "}", w: "" },
                        { c: "", w: "" },
                        { c: ".card-badge {", w: "" },
                        { c: "  position: absolute;", w: "**Removed from the flow** — no space is reserved for it." },
                        { c: "  top: -8px;", w: "8px above the card's top edge." },
                        { c: "  right: -8px;", w: "8px to the right of the card's right edge." },
                        { c: "  background: #ef4444;", w: "" },
                        { c: "  color: white;", w: "" },
                        { c: "  border-radius: 9999px;", w: "" },
                        { c: "  padding: 2px 8px;", w: "" },
                        { c: "  font-size: 0.75rem;", w: "" },
                        { c: "}" }
                    ]
                }
            },
            {
                n: "**The rule:** an `absolute` element positions itself relative to the nearest ancestor that has `position` set to anything other than `static`. If no ancestor qualifies, it uses the initial containing block (roughly the viewport). Forget the `relative` on the parent and the element teleports to the wrong place — the single most common positioning bug.",
                nt: "The positioning context"
            },

            { h: "fixed — pinned to the screen" },
            {
                code: {
                    lang: "css", t: "A return-to-top button",
                    lines: [
                        { c: ".back-to-top {", w: "" },
                        { c: "  position: fixed;", w: "**Removed from the flow and pinned to the viewport.** It does not scroll." },
                        { c: "  bottom: 2rem;", w: "" },
                        { c: "  right: 2rem;", w: "" },
                        { c: "  z-index: 100;", w: "**Stacking order.** Higher values sit on top." },
                        { c: "}" }
                    ]
                }
            },
            {
                l: [
                    "**Use it for:** floating buttons, modal overlays, cookie banners, persistent toolbars.",
                    "**Do not use it for:** the main layout. A `fixed` element covers content beneath it permanently, and on mobile it fights with the virtual keyboard."
                ]
            },

            { h: "sticky — normal until you scroll, then stuck" },
            {
                code: {
                    lang: "css", t: "A sticky table header",
                    lines: [
                        { c: "thead th {", w: "" },
                        { c: "  position: sticky;", w: "**Acts like `relative` until the scroll position reaches the threshold, then acts like `fixed` within its container.**" },
                        { c: "  top: 0;", w: "**The trigger point.** When the element's `top` would cross this line while scrolling, it sticks.", hi: true },
                        { c: "  background: var(--bg);", w: "A sticky element needs a background, or content scrolls visible behind it." },
                        { c: "  z-index: 10;", w: "" },
                        { c: "}" }
                    ]
                }
            },
            { trap: "`sticky` does not work if any ancestor has `overflow: hidden`, `overflow: scroll` or `overflow: auto`. The element sticks within its scrolling container, and if that container clips, the sticky element clips with it. This is the reason most *my sticky header is not sticking* questions exist." },

            { h: "z-index — stacking order" },
            {
                code: {
                    lang: "css",
                    lines: [
                        { c: "/* z-index only works on positioned elements (not static) */", w: "" },
                        { c: ".dropdown { z-index: 10; }", w: "Above normal content." },
                        { c: ".modal    { z-index: 100; }", w: "Above dropdowns." },
                        { c: ".toast    { z-index: 1000; }", w: "Above everything." }
                    ]
                }
            },
            { p: "Use a consistent scale and leave gaps. A common convention: `10` for dropdowns, `100` for modals, `1000` for toasts. Do not use values like `99999` — it signals a fight with some unknown layer, and the fix is to understand the stacking context, not to escalate the arms race." },

            { h: "Centring with position" },
            {
                code: {
                    lang: "css", t: "The classic absolute centre",
                    lines: [
                        { c: ".overlay-content {", w: "" },
                        { c: "  position: fixed;", w: "" },
                        { c: "  top: 50%;", w: "" },
                        { c: "  left: 50%;", w: "" },
                        { c: "  transform: translate(-50%, -50%);", w: "`top: 50%` puts the *top edge* at the centre. `translate(-50%, -50%)` shifts the element back by half its own width and height, landing it exactly centred.", hi: true },
                        { c: "}" }
                    ]
                }
            },
            { p: "This works for both `fixed` and `absolute`. For most new layouts, `display: grid; place-items: center;` is simpler, but the translate trick remains essential for overlays and modals that sit outside the normal layout." },

            {
                tryit: {
                    t: "Build an overlay",
                    task: "Create a modal overlay: a full-screen semi-transparent backdrop (fixed, covering everything), with a white card centred inside it. Add a close button positioned in the top-right corner of the card using absolute positioning.",
                    hint: "The backdrop is `fixed` with `inset: 0` (which sets top, right, bottom, left all to 0). The card is also `fixed` and centred with the translate trick. The close button is `absolute` inside the card.",
                    sol: { lang: "css", code: ".backdrop {\n  position: fixed;\n  inset: 0;\n  background: rgba(0, 0, 0, 0.6);\n  z-index: 100;\n}\n\n.modal {\n  position: fixed;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  background: white;\n  border-radius: 12px;\n  padding: 2rem;\n  z-index: 101;\n  min-width: 320px;\n}\n\n.modal-close {\n  position: absolute;\n  top: 0.5rem;\n  right: 0.5rem;\n}" },
                    w: "`inset: 0` is the shorthand for setting all four sides to zero — one line instead of four. The modal needs a higher `z-index` than the backdrop so it sits on top of it."
                }
            }
        ],
        k: [
            "`relative` stays in the flow and creates the reference frame for `absolute` children.",
            "`absolute` is removed from the flow and positioned against its nearest non-static ancestor.",
            "`fixed` pins to the viewport and does not scroll; `sticky` scrolls normally then sticks at a threshold.",
            "`z-index` only works on positioned elements; use a consistent scale with gaps."
        ],
        r: ["CSS"],
        drill: {
            lang: "css",
            reps: 3,
            items: [
                { c: "position: relative;", w: "make an element the positioning context for its children" },
                { c: "position: absolute; top: 0; right: 0;", w: "place a badge in the top-right corner of its container" },
                { c: "position: fixed; bottom: 2rem; right: 2rem;", w: "pin a button to the bottom-right of the screen" },
                { c: "position: sticky; top: 0;", w: "make a header stick to the top when scrolled" },
                { c: "transform: translate(-50%, -50%);", w: "shift an element back by half its own size for centring" },
                { c: "z-index: 100;", w: "place an element above other positioned content" }
            ]
        }
    },

    {
        t: "Transitions and Animations",
        m: "motion",
        lvl: "core",
        s: "Making things move — smoothly, purposefully, and without JavaScript.",
        goal: [
            "Add a transition that animates a property change smoothly",
            "Write a keyframe animation for continuous or multi-step motion",
            "Choose the right properties to animate for a smooth 60 fps"
        ],
        b: [
            { p: "A button that instantly changes colour on hover works. A button that fades to the new colour in 200 milliseconds **feels** better. That feeling is not decoration — it is feedback, and it tells the user *something responded to your action*. This lesson is the two CSS systems that produce it." },

            { h: "Transitions — animating a change" },
            { p: "A **transition** watches a property on an element. When that property changes — because of a hover, a class toggle, a focus — the transition smoothly interpolates between the old and new values instead of jumping." },
            {
                code: {
                    lang: "css", t: "A button that fades on hover",
                    lines: [
                        { c: ".btn {", w: "" },
                        { c: "  background: #3b82f6;", w: "" },
                        { c: "  color: white;", w: "" },
                        { c: "  padding: 0.75rem 1.5rem;", w: "" },
                        { c: "  border-radius: 8px;", w: "" },
                        { c: "  transition: background 200ms ease-out;", w: "**The transition declaration.** Property, duration, easing.", hi: true },
                        { c: "}", w: "" },
                        { c: "", w: "" },
                        { c: ".btn:hover {", w: "" },
                        { c: "  background: #2563eb;", w: "When this changes, the transition kicks in — 200ms of smooth colour change." },
                        { c: "}" }
                    ]
                }
            },

            {
                syn: {
                    t: "The transition shorthand",
                    parts: [
                        { p: "transition:", w: "" },
                        { p: " background", w: "**The property to animate.** Can be `all` for everything, but naming it is better for performance and clarity." },
                        { p: " 200ms", w: "**Duration.** 150–300ms feels responsive. Over 500ms feels sluggish. Under 100ms is too fast to register." },
                        { p: " ease-out", w: "**Easing function.** `ease-out` starts fast and decelerates — the most natural for UI. `ease-in` accelerates and feels heavy. `linear` is mechanical." },
                        { p: " 50ms", w: "**Delay** (optional). Wait this long before starting." },
                        { p: ";" }
                    ]
                }
            },

            { h: "Transitioning multiple properties" },
            {
                code: {
                    lang: "css",
                    lines: [
                        { c: ".card {", w: "" },
                        { c: "  transition:", w: "" },
                        { c: "    transform 200ms ease-out,", w: "Comma-separated list." },
                        { c: "    box-shadow 200ms ease-out,", w: "" },
                        { c: "    opacity 150ms ease-out;", w: "Each can have its own duration and easing." },
                        { c: "}", w: "" },
                        { c: "", w: "" },
                        { c: ".card:hover {", w: "" },
                        { c: "  transform: translateY(-4px);", w: "Lift the card slightly on hover." },
                        { c: "  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);", w: "Deepen the shadow." },
                        { c: "  opacity: 1;", w: "" },
                        { c: "}" }
                    ]
                }
            },

            { h: "transform — the property you should animate" },
            { p: "`transform` changes an element's position, size or rotation **without affecting layout** — nothing else on the page moves, reflows or repaints. This is why it is smooth at 60 fps and why animating `width`, `height`, `top` or `left` is not." },
            {
                tbl: {
                    h: ["Transform", "Does", "Example"],
                    rows: [
                        ["`translateX(px)` / `translateY(px)`", "Moves horizontally / vertically", "`transform: translateY(-4px)`"],
                        ["`scale(n)`", "Scales up or down", "`transform: scale(1.05)` — 5% larger"],
                        ["`rotate(deg)`", "Rotates", "`transform: rotate(45deg)`"],
                        ["`skewX(deg)`", "Tilts", "`transform: skewX(-5deg)`"],
                        ["Combined", "Applied in order", "`transform: translateY(-4px) scale(1.02)`"]
                    ]
                }
            },
            {
                n: "**Only animate `transform` and `opacity`.** These two properties are handled by the GPU compositor and do not trigger layout or paint. Animating `width`, `margin`, `top`, `font-size` or almost anything else forces the browser to recalculate the layout of the entire page on every frame, and the animation stutters. The professional habit is to express every motion in terms of `transform` and `opacity`.",
                nt: "The performance rule"
            },

            { h: "Keyframe animations — continuous or multi-step" },
            { p: "A transition reacts to a change. A **keyframe animation** runs on its own — it can loop, reverse, and have arbitrary intermediate steps." },
            {
                code: {
                    lang: "css", t: "A spinning loader",
                    lines: [
                        { c: "@keyframes spin {", w: "**Define the animation** with `@keyframes` and a name." },
                        { c: "  from { transform: rotate(0deg); }", w: "`from` is the start." },
                        { c: "  to   { transform: rotate(360deg); }", w: "`to` is the end." },
                        { c: "}", w: "" },
                        { c: "", w: "" },
                        { c: ".spinner {", w: "" },
                        { c: "  width: 24px;", w: "" },
                        { c: "  height: 24px;", w: "" },
                        { c: "  border: 3px solid rgba(255, 255, 255, 0.2);", w: "" },
                        { c: "  border-top-color: #3b82f6;", w: "" },
                        { c: "  border-radius: 50%;", w: "" },
                        { c: "  animation: spin 0.8s linear infinite;", w: "**Apply it.** Name, duration, easing, iteration count.", hi: true },
                        { c: "}" }
                    ]
                }
            },

            { h: "Multi-step animations" },
            {
                code: {
                    lang: "css", t: "A pulse effect",
                    lines: [
                        { c: "@keyframes pulse {", w: "" },
                        { c: "  0%   { transform: scale(1); opacity: 1; }", w: "**Percentage keyframes** for intermediate steps." },
                        { c: "  50%  { transform: scale(1.05); opacity: 0.8; }", w: "Halfway point." },
                        { c: "  100% { transform: scale(1); opacity: 1; }", w: "Back to start — creates a smooth loop." },
                        { c: "}", w: "" },
                        { c: "", w: "" },
                        { c: ".live-dot {", w: "" },
                        { c: "  animation: pulse 2s ease-in-out infinite;", w: "" },
                        { c: "}" }
                    ]
                }
            },

            { h: "The animation shorthand" },
            {
                tbl: {
                    h: ["Value", "What it sets", "Example"],
                    rows: [
                        ["Name", "`animation-name`", "`spin`"],
                        ["Duration", "`animation-duration`", "`0.8s`"],
                        ["Easing", "`animation-timing-function`", "`ease-out`, `linear`, `cubic-bezier(...)`"],
                        ["Delay", "`animation-delay`", "`0s`"],
                        ["Count", "`animation-iteration-count`", "`infinite`, `1`, `3`"],
                        ["Direction", "`animation-direction`", "`normal`, `reverse`, `alternate`"],
                        ["Fill", "`animation-fill-mode`", "`forwards` — stay at the end state after finishing"],
                        ["Play state", "`animation-play-state`", "`running`, `paused`"]
                    ]
                }
            },

            { h: "Respecting user preferences" },
            {
                code: {
                    lang: "css", t: "Reduce motion for users who asked for it",
                    lines: [
                        { c: "@media (prefers-reduced-motion: reduce) {", w: "**Some users have vestibular disorders** and animations cause nausea. This media query detects their OS setting." },
                        { c: "  *, *::before, *::after {", w: "" },
                        { c: "    animation-duration: 0.01ms !important;", w: "Effectively instant — the animation completes but no motion is visible." },
                        { c: "    transition-duration: 0.01ms !important;", w: "" },
                        { c: "  }", w: "" },
                        { c: "}", w: "" }
                    ]
                }
            },
            {
                n: "This is not optional politeness. People with motion sensitivities will leave your site, and accessibility audits flag its absence. Add it to every project from the start — it is six lines.",
                nt: "Accessibility is not optional"
            },

            { h: "Practical patterns" },
            {
                code: {
                    lang: "css", t: "Fade in on load",
                    lines: [
                        { c: "@keyframes fade-in {", w: "" },
                        { c: "  from { opacity: 0; transform: translateY(10px); }", w: "" },
                        { c: "  to   { opacity: 1; transform: translateY(0); }", w: "" },
                        { c: "}", w: "" },
                        { c: "", w: "" },
                        { c: ".hero { animation: fade-in 0.6s ease-out both; }", w: "`both` (short for `fill-mode: both`) means start invisible and stay in the end state." }
                    ]
                }
            },

            {
                tryit: {
                    t: "Animate a card gallery",
                    task: "Create three cards in a row. On hover, each card should lift up slightly, gain a larger shadow, and scale to 1.02×. Add a staggered fade-in animation so they appear one after another on load (use `animation-delay`). Include the reduced-motion override.",
                    hint: "`transition` handles the hover, `@keyframes` with `animation-delay` handles the stagger. `0s`, `0.15s`, `0.3s` give a clean stagger at three intervals.",
                    sol: { lang: "css", code: "@keyframes fade-up {\n  from { opacity: 0; transform: translateY(20px); }\n  to   { opacity: 1; transform: translateY(0); }\n}\n\n.card {\n  opacity: 0;\n  animation: fade-up 0.5s ease-out forwards;\n  transition: transform 200ms ease-out, box-shadow 200ms ease-out;\n}\n\n.card:nth-child(1) { animation-delay: 0s; }\n.card:nth-child(2) { animation-delay: 0.15s; }\n.card:nth-child(3) { animation-delay: 0.3s; }\n\n.card:hover {\n  transform: translateY(-4px) scale(1.02);\n  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.12);\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .card {\n    animation: none;\n    opacity: 1;\n    transition-duration: 0.01ms !important;\n  }\n}" },
                    w: "`opacity: 0` on the card keeps them invisible before the animation starts. `forwards` holds the end state (opacity: 1). The `:nth-child` selector staggers the delay so they cascade in — a tiny detail that makes the page feel alive."
                }
            }
        ],
        k: [
            "`transition` animates a property change over time; `@keyframes` defines multi-step or continuous animation.",
            "150–300ms is the sweet spot; over 500ms feels slow, under 100ms is invisible.",
            "Only animate `transform` and `opacity` — everything else causes layout recalculation and stutters.",
            "Always include `@media (prefers-reduced-motion: reduce)` to respect user accessibility settings."
        ],
        r: ["CSS", "Web Accessibility"],
        drill: {
            lang: "css",
            reps: 3,
            items: [
                { c: "transition: background 200ms ease-out;", w: "smoothly animate a colour change over 200 milliseconds" },
                { c: "transform: translateY(-4px) scale(1.02);", w: "lift an element and scale it slightly" },
                { c: "@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }", w: "define a spinning animation" },
                { c: "animation: spin 0.8s linear infinite;", w: "apply a continuous looping animation" },
                { c: "animation: fade-in 0.5s ease-out forwards;", w: "play an animation once and keep the end state" },
                { c: "@media (prefers-reduced-motion: reduce) {", w: "begin a block that disables animations for users who need it" }
            ]
        }
    }

]);
