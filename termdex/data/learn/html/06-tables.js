/* HTML — tables done right. */
TD.addLessons("html", [

    {
        t: "Tables — Presenting Data, Not Layout",
        m: "tables",
        lvl: "core",
        s: "The element that got a bad reputation from the 1990s, and when it is still the only right answer.",
        goal: [
            "Build a properly structured table with headers, body and caption",
            "Explain why tables are for data and never for layout",
            "Make a table accessible to someone who cannot see it"
        ],
        b: [
            { p: "In the early web, `<table>` was the layout tool — entire page designs were built from nested tables. CSS replaced that job, and tables got a reputation they did not deserve. The element is not the problem; using it for something it was never meant for was the problem. For **tabular data** — a spreadsheet, a comparison, a schedule, a price list — a table is not just acceptable, it is the only semantically correct choice." },

            { h: "The structure" },
            {
                code: {
                    lang: "html", t: "A complete, well-formed table",
                    lines: [
                        { c: "<table>", w: "The container. A table without internal structure is almost useless to a screen reader." },
                        { c: "  <caption>Monthly expenses — August 2026</caption>", w: "**Visible title for the table.** Screen readers announce it; sighted users read it. Skipping this is like writing a chart with no title." },
                        { c: "  <thead>", w: "**The header section.** Browsers treat it differently for scrolling and printing — headers repeat on each printed page." },
                        { c: "    <tr>", w: "A table row." },
                        { c: "      <th scope=\"col\">Category</th>", w: "**`<th>`, not `<td>`, for headers.** `scope=\"col\"` tells assistive tech *this header labels the column below it*." },
                        { c: "      <th scope=\"col\">Amount</th>", w: "" },
                        { c: "      <th scope=\"col\">Due</th>", w: "" },
                        { c: "    </tr>", w: "" },
                        { c: "  </thead>", w: "" },
                        { c: "  <tbody>", w: "**The data section.** Can have multiple `<tbody>` elements to group rows visually." },
                        { c: "    <tr>", w: "" },
                        { c: "      <td>Rent</td>", w: "`<td>` — a data cell." },
                        { c: "      <td>₹25,000</td>", w: "" },
                        { c: "      <td>1st</td>", w: "" },
                        { c: "    </tr>", w: "" },
                        { c: "    <tr>", w: "" },
                        { c: "      <td>Electricity</td>", w: "" },
                        { c: "      <td>₹2,400</td>", w: "" },
                        { c: "      <td>15th</td>", w: "" },
                        { c: "    </tr>", w: "" },
                        { c: "    <tr>", w: "" },
                        { c: "      <td>Internet</td>", w: "" },
                        { c: "      <td>₹999</td>", w: "" },
                        { c: "      <td>20th</td>", w: "" },
                        { c: "    </tr>", w: "" },
                        { c: "  </tbody>", w: "" },
                        { c: "  <tfoot>", w: "**Footer row** — for totals and summaries. Semantically distinct from the data." },
                        { c: "    <tr>", w: "" },
                        { c: "      <th scope=\"row\">Total</th>", w: "`scope=\"row\"` — this header labels the row it sits in." },
                        { c: "      <td>₹28,399</td>", w: "" },
                        { c: "      <td></td>", w: "" },
                        { c: "    </tr>", w: "" },
                        { c: "  </tfoot>", w: "" },
                        { c: "</table>" }
                    ]
                }
            },

            { h: "What each element is for" },
            {
                tbl: {
                    h: ["Element", "Purpose", "Required?"],
                    rows: [
                        ["`<table>`", "The table itself", "Yes"],
                        ["`<caption>`", "A visible title — what the data is", "Technically optional, practically essential"],
                        ["`<thead>`", "Header rows — column labels", "Optional but recommended"],
                        ["`<tbody>`", "Data rows", "Implied if absent, explicit is clearer"],
                        ["`<tfoot>`", "Footer rows — totals, summaries", "Optional"],
                        ["`<tr>`", "A row", "Yes, inside any section"],
                        ["`<th>`", "A header cell — labels a row or column", "In `<thead>` and for row headers"],
                        ["`<td>`", "A data cell", "The actual content"]
                    ]
                }
            },

            { h: "scope — making it work for everyone" },
            { p: "`scope` tells a screen reader which cells a header governs. Without it, the reader guesses — and on a complex table, it guesses wrong." },
            {
                tbl: {
                    h: ["Attribute", "Means"],
                    rows: [
                        ["`scope=\"col\"`", "This header labels the **column** below it"],
                        ["`scope=\"row\"`", "This header labels the **row** it sits in"],
                        ["`scope=\"colgroup\"`", "For merged column headers spanning a group"],
                        ["`scope=\"rowgroup\"`", "For merged row headers spanning a group"]
                    ]
                }
            },
            {
                n: "A sighted person sees that **Category** is the header for the column beneath it — the position makes it obvious. A screen reader does not see position. `scope=\"col\"` is that spatial relationship, stated explicitly. Without it, a user navigating with a screen reader hears `₹25,000` and has no idea which column it belongs to.",
                nt: "Why scope matters"
            },

            { h: "Spanning rows and columns" },
            {
                code: {
                    lang: "html", t: "A header that covers two columns",
                    lines: [
                        { c: "<thead>", w: "" },
                        { c: "  <tr>", w: "" },
                        { c: "    <th rowspan=\"2\">Name</th>", w: "**`rowspan=\"2\"`** — this cell stretches down two rows." },
                        { c: "    <th colspan=\"2\">Contact</th>", w: "**`colspan=\"2\"`** — this cell stretches across two columns." },
                        { c: "  </tr>", w: "" },
                        { c: "  <tr>", w: "The second header row only needs the cells not already claimed by spans." },
                        { c: "    <th>Email</th>", w: "" },
                        { c: "    <th>Phone</th>", w: "" },
                        { c: "  </tr>", w: "" },
                        { c: "</thead>" }
                    ]
                }
            },
            { trap: "Spanning makes tables harder for screen readers to parse. Use it when the data genuinely has grouped headers — a comparison table with a `Contact` header over `Email` and `Phone`. Do not use it for visual decoration." },

            { h: "Tables for layout — why not" },
            {
                vs: {
                    t: "Two ways to lay out a page", lang: "html",
                    bad: {
                        c: "<table>\n  <tr>\n    <td>Sidebar</td>\n    <td>Main content</td>\n  </tr>\n</table>", label: "Layout table",
                        w: "A screen reader announces this as a data table with two cells. A user tabbing through will hear *row 1, column 2* and wonder what spreadsheet they have landed in. The markup is a lie about the content."
                    },
                    good: {
                        c: "<aside>Sidebar</aside>\n<main>Main content</main>", label: "Semantic HTML + CSS layout",
                        w: "Each element says what it is. CSS Grid or Flexbox puts them where you want. The markup is true, and the layout is flexible."
                    }
                }
            },
            { p: "The test is simple: **Is the content tabular?** Does it have rows and columns of data that relate to each other? If yes, use a table. If you are just trying to put two boxes side by side, use CSS." },

            { h: "Styling tables with CSS" },
            {
                code: {
                    lang: "css", t: "A clean, readable table style",
                    lines: [
                        { c: "table {", w: "" },
                        { c: "  border-collapse: collapse;", w: "**Collapses double borders** into single lines. Without this, every cell has its own border and the table looks like a prison window." },
                        { c: "  width: 100%;", w: "" },
                        { c: "  font-variant-numeric: tabular-nums;", w: "**Aligns digits in columns** — so 1,000 and 10 line up at the comma." },
                        { c: "}", w: "" },
                        { c: "", w: "" },
                        { c: "th, td {", w: "" },
                        { c: "  padding: 0.75rem 1rem;", w: "Generous padding makes cells readable." },
                        { c: "  text-align: left;", w: "" },
                        { c: "  border-bottom: 1px solid #333;", w: "Horizontal rules only — cleaner than a full grid." },
                        { c: "}", w: "" },
                        { c: "", w: "" },
                        { c: "thead th {", w: "" },
                        { c: "  font-weight: 600;", w: "" },
                        { c: "  border-bottom: 2px solid #666;", w: "A heavier line separating headers from data." },
                        { c: "}", w: "" },
                        { c: "", w: "" },
                        { c: "tbody tr:hover {", w: "" },
                        { c: "  background: rgba(255, 255, 255, 0.05);", w: "**A subtle hover** helps the eye track across wide rows." },
                        { c: "}" }
                    ]
                }
            },

            {
                tryit: {
                    t: "Build a comparison table",
                    task: "Create a table comparing three programming languages on five characteristics (e.g. typing, speed, primary use, learning curve, job market). Include a caption, proper `<th>` elements with `scope`, and a `<tfoot>` with a recommendation row.",
                    hint: "Languages as columns, characteristics as rows. Each row's first cell is a `<th scope=\"row\">`.",
                    sol: { lang: "html", code: "<table>\n  <caption>Choosing your first language</caption>\n  <thead>\n    <tr>\n      <th scope=\"col\">Feature</th>\n      <th scope=\"col\">Python</th>\n      <th scope=\"col\">JavaScript</th>\n      <th scope=\"col\">SQL</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <th scope=\"row\">Typing</th>\n      <td>Dynamic</td>\n      <td>Dynamic</td>\n      <td>Declarative</td>\n    </tr>\n    <tr>\n      <th scope=\"row\">Best for</th>\n      <td>Data, ML, automation</td>\n      <td>Web, full-stack</td>\n      <td>Querying databases</td>\n    </tr>\n    <tr>\n      <th scope=\"row\">Learning curve</th>\n      <td>Gentle</td>\n      <td>Moderate</td>\n      <td>Gentle</td>\n    </tr>\n  </tbody>\n  <tfoot>\n    <tr>\n      <th scope=\"row\">Start here if</th>\n      <td>Data or AI</td>\n      <td>Building websites</td>\n      <td>Working with data</td>\n    </tr>\n  </tfoot>\n</table>" },
                    w: "Row headers (`<th scope=\"row\">`) on the first column of each row mean a screen reader announces *Feature: Best for, Python: Data ML automation* — which is exactly the information a sighted person gets from the position."
                }
            }
        ],
        k: [
            "Use `<table>` for tabular data, never for layout — CSS Grid and Flexbox replaced that job.",
            "`<caption>` is the table's title; `<thead>`, `<tbody>`, `<tfoot>` separate structure; `<th>` marks headers.",
            "`scope=\"col\"` and `scope=\"row\"` tell screen readers which cells a header governs.",
            "`border-collapse: collapse` and horizontal-only rules produce the cleanest visual style."
        ],
        r: ["HTML", "Web Accessibility", "Semantic HTML"],
        drill: {
            lang: "html",
            reps: 3,
            items: [
                { c: "<table>", w: "begin a data table" },
                { c: "<caption>Monthly expenses</caption>", w: "give the table a visible title" },
                { c: "<th scope=\"col\">Amount</th>", w: "mark a column header so screen readers know what it labels" },
                { c: "<th scope=\"row\">Total</th>", w: "mark a row header in the footer" },
                { c: "<thead>", w: "begin the header section of a table" },
                { c: "border-collapse: collapse;", w: "the CSS property that merges double cell borders" }
            ]
        }
    }

]);
