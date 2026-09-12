/* Research Hub UI — CoreDumps

   Six tabs, each answering one question a first-time author has: what kind of
   paper is this, how is one built, how do I read them, where does it go, what
   should I already have read, and how does the process actually work.

   The filter categories are derived from the data rather than hardcoded. The
   previous version listed six domain chips against free-text domain strings,
   so CVPR, POPL and the BERT paper were silently unreachable from any filter
   — a bug that is invisible unless you count the results. */
(function (TD) {
  "use strict";

  var state = {
    tab: "overview",
    confField: "all",
    paperField: "all",
    paperQuery: "",
    paperSort: "year"
  };

  /* ---------------- field derivation ----------------
     Venue and paper domains are authored as prose ("Databases & Distributed
     Systems"). Bucketing them into a small closed set keeps the filters
     honest without forcing every data file to be rewritten. */

  var FIELDS = [
    { id: "ai", label: "AI & ML", col: "#7c3aed", match: /machine learning|^ai\b|artificial|computer vision|natural language|deep learning/i },
    { id: "systems", label: "Systems & OS", col: "#0891b2", match: /systems|operating|cloud|architecture/i },
    { id: "data", label: "Databases & Data", col: "#c2410c", match: /database|data\b|storage/i },
    { id: "security", label: "Security & Crypto", col: "#be123c", match: /security|crypto|privacy|hardware/i },
    { id: "networks", label: "Networks", col: "#059669", match: /network|distributed/i },
    { id: "pl", label: "Languages & SE", col: "#b46a05", match: /programming languages|compiler|software engineering/i }
  ];

  /* First match wins, so the ordering above is the precedence. Anything
     unmatched lands in "other" rather than vanishing. */
  function fieldOf(domain) {
    var text = String(domain || "");
    for (var i = 0; i < FIELDS.length; i++) {
      if (FIELDS[i].match.test(text)) return FIELDS[i].id;
    }
    return "other";
  }

  function fieldMeta(id) {
    var found = null;
    FIELDS.forEach(function (f) { if (f.id === id) found = f; });
    return found || { id: "other", label: "Other", col: "#6b7891" };
  }

  /* Attach the derived field once, so filtering never re-runs the regexes. */
  function ensureFields() {
    (TD.conferences || []).forEach(function (c) {
      if (!c._field) c._field = fieldOf(c.domain);
    });
    (TD.landmarkPapers || []).forEach(function (p) {
      if (!p._field) p._field = fieldOf(p.domain);
      if (p._cites === undefined) {
        /* "135,000+" → 135000, for sorting and for the impact bar. */
        p._cites = parseInt(String(p.citations).replace(/[^0-9]/g, ""), 10) || 0;
      }
    });
  }

  function fieldChips(active, attr, items) {
    var counts = { all: items.length };
    items.forEach(function (x) {
      counts[x._field] = (counts[x._field] || 0) + 1;
    });

    var chips = ['<button class="rs-chip' + (active === "all" ? " is-active" : "") +
      '" ' + attr + '="all">All fields<span>' + items.length + "</span></button>"];

    FIELDS.concat([{ id: "other", label: "Other", col: "#6b7891" }]).forEach(function (f) {
      if (!counts[f.id]) return;
      chips.push('<button class="rs-chip' + (active === f.id ? " is-active" : "") +
        '" ' + attr + '="' + f.id + '" style="--fc:' + f.col + '">' +
        TD.esc(f.label) + "<span>" + counts[f.id] + "</span></button>");
    });
    return chips.join("");
  }

  /* ---------------- tab shell ---------------- */

  var TABS = [
    { id: "overview", label: "Paper types", icon: "compass" },
    { id: "anatomy", label: "Anatomy & writing", icon: "scroll" },
    { id: "reading", label: "How to read", icon: "microscope" },
    { id: "venues", label: "Where to publish", icon: "server" },
    { id: "papers", label: "Landmark papers", icon: "book" },
    { id: "process", label: "Review & rejection", icon: "flow" }
  ];

  TD.viewResearch = function (subTab) {
    ensureFields();
    if (subTab && TABS.some(function (t) { return t.id === subTab; })) state.tab = subTab;

    var tabsHtml = TABS.map(function (t) {
      return '<button class="rs-tab' + (state.tab === t.id ? " is-active" : "") +
        '" data-rs-tab="' + t.id + '">' + TD.icon(t.icon) + "<span>" + TD.esc(t.label) +
        "</span></button>";
    }).join("");

    var body = "";
    if (state.tab === "overview") body = renderOverview();
    else if (state.tab === "anatomy") body = renderAnatomy();
    else if (state.tab === "reading") body = renderReading();
    else if (state.tab === "venues") body = renderVenues();
    else if (state.tab === "papers") body = renderPapers();
    else if (state.tab === "process") body = renderProcess();

    return '<div class="rs-view">' +
      '<header class="rs-hero">' +
        '<div class="rs-hero-copy">' +
          '<span class="iv-eyebrow">' + TD.icon("flask") + " Research Hub</span>" +
          "<h1>Reading, writing and publishing research</h1>" +
          "<p>What a paper is structurally for, how to read one in ten minutes instead of " +
            "four hours, where the work goes, and the reasons papers are rejected before " +
            "anyone reads the method.</p>" +
        "</div>" +
        '<div class="rs-hero-stats">' +
          '<div class="iv-stat"><strong>' + ((TD.researchMeta && TD.researchMeta.paperTypes) || []).length +
            "</strong><span>Paper types</span></div>" +
          '<div class="iv-stat"><strong>' + (TD.conferences || []).length + "</strong><span>Venues</span></div>" +
          '<div class="iv-stat"><strong>' + (TD.landmarkPapers || []).length + "</strong><span>Papers</span></div>" +
          '<div class="iv-stat"><strong>3</strong><span>Reading passes</span></div>' +
        "</div>" +
      "</header>" +

      '<nav class="rs-tabs">' + tabsHtml + "</nav>" +
      '<div class="rs-body">' + body + "</div>" +
    "</div>";
  };

  /* ---------------- 1. paper types ---------------- */

  function renderOverview() {
    var meta = TD.researchMeta || {};

    var types = (meta.paperTypes || []).map(function (pt) {
      return '<article class="rs-type">' +
        '<header class="rs-type-head">' +
          '<span class="rs-type-ico">' + TD.icon(pt.icon) + "</span>" +
          "<div><h3>" + TD.esc(pt.name) + "</h3>" +
          '<span class="rs-type-badge">' + TD.esc(pt.badge) + "</span></div>" +
        "</header>" +
        "<p class=\"rs-type-desc\">" + TD.esc(pt.desc) + "</p>" +
        '<div class="rs-type-when"><strong>Write one when</strong> ' + TD.esc(pt.when) + "</div>" +
        '<div class="rs-type-elems"><strong>Reviewers will look for</strong>' +
          "<ul>" + (pt.keyElements || []).map(function (el) {
            return "<li>" + TD.icon("check") + "<span>" + TD.esc(el) + "</span></li>";
          }).join("") + "</ul></div>" +
        '<footer class="rs-type-eg">' + TD.icon("book") + "<em>" + TD.esc(pt.example) + "</em></footer>" +
      "</article>";
    }).join("");

    var roles = (meta.teamRoles || []).map(function (tr, i) {
      return '<div class="rs-role">' +
        '<span class="rs-role-n">' + (i + 1) + "</span>" +
        "<div><h4>" + TD.esc(tr.role) + '<span class="rs-role-size">' + TD.esc(tr.size) + "</span></h4>" +
        "<p>" + TD.esc(tr.desc) + "</p>" +
        '<p class="rs-role-owns"><strong>Owns:</strong> ' + TD.esc(tr.responsibility) + "</p></div>" +
      "</div>";
    }).join("");

    return '<section class="rs-block">' +
      '<div class="rs-block-head">' +
        "<h2>" + TD.icon("compass") + " Six kinds of paper</h2>" +
        "<p>Each archetype is evaluated against different expectations. Submitting a systems " +
          "paper to a venue expecting empirical ML results is a desk reject that has nothing " +
          "to do with the quality of the work.</p>" +
      "</div>" +
      '<div class="rs-type-grid">' + types + "</div>" +

      '<div class="rs-block-head rs-mt">' +
        "<h2>" + TD.icon("users") + " Who does what</h2>" +
        "<p>Author order carries meaning, and the meaning differs by field. In computer " +
          "science the first author did the work and the last author supervised it.</p>" +
      "</div>" +
      '<div class="rs-roles">' + roles + "</div>" +
    "</section>";
  }

  /* ---------------- 2. anatomy & writing ---------------- */

  function renderAnatomy() {
    var guide = TD.writingGuide || {};

    var titles = (guide.titleFormulas || []).map(function (tf) {
      return '<div class="rs-formula">' +
        '<code class="rs-formula-pattern">' + TD.esc(tf.pattern) + "</code>" +
        '<p class="rs-formula-eg">&ldquo;' + TD.esc(tf.example) + "&rdquo;</p>" +
        '<p class="rs-formula-why">' + TD.esc(tf.why) + "</p>" +
      "</div>";
    }).join("");

    var abstract = (guide.abstractFormula || []).map(function (af, i) {
      return '<li class="rs-abs-step">' +
        '<span class="rs-abs-n">' + (i + 1) + "</span>" +
        "<div><h4>" + TD.esc(af.sentence) + "</h4>" +
        "<p>" + TD.esc(af.desc) + "</p>" +
        '<p class="rs-abs-eg">&ldquo;' + TD.esc(af.example) + "&rdquo;</p></div>" +
      "</li>";
    }).join("");

    return '<section class="rs-block">' +
      '<div class="rs-block-head">' +
        "<h2>" + TD.icon("flow") + " What each section is for</h2>" +
        "<p>Sections are not chapters — they are load-bearing parts of an argument, and each " +
          "one owes something to the others.</p>" +
      "</div>" +
      (TD.paperAnatomy && TD.blueprint ? TD.blueprint(TD.paperAnatomy) : "") +

      '<div class="rs-block-head rs-mt">' +
        "<h2>" + TD.icon("spark") + " The title and the first 120 seconds</h2>" +
        "<p>A reviewer forms an impression from the title and abstract before reading a single " +
          "line of method. That impression is very hard to reverse later.</p>" +
      "</div>" +
      '<div class="rs-two">' +
        '<div class="rs-panel">' +
          "<h3>" + TD.icon("tag") + " Title patterns that work</h3>" + titles +
        "</div>" +
        '<div class="rs-panel">' +
          "<h3>" + TD.icon("list") + " The five-sentence abstract</h3>" +
          '<ol class="rs-abs">' + abstract + "</ol>" +
        "</div>" +
      "</div>" +

      '<div class="rs-block-head rs-mt">' +
        "<h2>" + TD.icon("layers") + " Two starting points</h2>" +
        "<p>The skeleton of a two-column submission, and the reply that turns a borderline " +
          "score into an accept. Both are shown as structure — what each block is for and how " +
          "long it should be — with the raw file one click down when you want to paste it.</p>" +
      "</div>" +
      renderLatexKit(guide) +
      renderRebuttalKit(guide) +
    "</section>";
  }

  /* ---------------- templates ----------------

     These two were previously rendered as a pair of <pre> dumps: a 120-line
     .tex file and a 700-word letter, in a 420px scroll box. That is the least
     readable form either of them has — nobody reads a LaTeX preamble top to
     bottom to learn what a paper looks like. Each is rendered as what it
     actually is (a document outline, a piece of correspondence), and the
     source stays available behind a disclosure because that is what you
     eventually paste into Overleaf. Both views read the same data, so they
     cannot drift apart. */

  function kitHead(tag, title, sub, meta, kind, copyLabel) {
    return '<header class="rs-kit-head">' +
      '<div class="rs-kit-id">' +
        '<span class="rs-kit-tag">' + TD.esc(tag) + "</span>" +
        "<div><h3>" + TD.esc(title) + "</h3><p>" + TD.esc(sub) + "</p></div>" +
      "</div>" +
      '<div class="rs-kit-meta">' + meta +
        '<button class="rs-copy" data-rs-copy="' + kind + '">' +
          TD.icon("copy") + " " + TD.esc(copyLabel) + "</button>" +
      "</div>" +
    "</header>";
  }

  function metaChip(icon, text) {
    return '<span class="rs-kit-chip">' + TD.icon(icon) + TD.esc(text) + "</span>";
  }

  /* The raw file, kept but demoted. Closed by default: it is reference, not
     reading material. */
  function sourceDrawer(name, content, kind) {
    if (!content) return "";
    var lines = content.split("\n").length;
    return '<details class="rs-src">' +
      "<summary>" + TD.icon("code") +
        "<span>Full source &mdash; <code>" + TD.esc(name) + "</code></span>" +
        '<em>' + lines + " lines</em>" + TD.icon("chevronDown") +
      "</summary>" +
      '<div class="rs-src-body"><pre><code>' + TD.esc(content) + "</code></pre></div>" +
    "</details>";
  }

  function renderLatexKit(guide) {
    var kit = guide.latexKit;
    if (!kit) return "";

    var steps = (kit.skeleton || []).map(function (s, i) {
      return '<li class="rs-out">' +
        '<span class="rs-out-n">' + (i + 1) + "</span>" +
        '<div class="rs-out-main">' +
          '<div class="rs-out-top">' +
            "<h4>" + TD.esc(s.part) + "</h4>" +
            '<span class="rs-out-len">' + TD.esc(s.len) + "</span>" +
          "</div>" +
          '<code class="rs-out-cmd">' + TD.esc(s.cmd) + "</code>" +
          '<p class="rs-out-what">' + TD.esc(s.what) + "</p>" +
          '<p class="rs-out-watch">' + TD.icon("alert") +
            "<span>" + TD.esc(s.watch) + "</span></p>" +
        "</div>" +
      "</li>";
    }).join("");

    var pkgs = (kit.preamble || []).map(function (p) {
      return "<li><code>" + TD.esc(p.pkg) + "</code><span>" + TD.esc(p.why) + "</span></li>";
    }).join("");

    return '<article class="rs-kit">' +
      kitHead("LaTeX", "Two-column conference skeleton",
        "NeurIPS · ICML · ICLR · OSDI · SOSP · IEEE",
        metaChip("scroll", "8 pages + refs") + metaChip("grid", "2 columns"),
        "latex", "Copy .tex") +

      '<div class="rs-kit-note">' +
        "<code>" + TD.esc(kit.docclass) + "</code>" +
        "<p>" + TD.esc(kit.classNote) + "</p>" +
      "</div>" +

      '<div class="rs-kit-split">' +
        '<div class="rs-kit-left">' + pagePreview() + "</div>" +
        '<div class="rs-kit-right">' +
          '<h4 class="rs-kit-sub">' + TD.icon("list") + " What each block is for</h4>" +
          '<ol class="rs-outline">' + steps + "</ol>" +
        "</div>" +
      "</div>" +

      '<div class="rs-preamble">' +
        '<h4 class="rs-kit-sub">' + TD.icon("layers") + " What the preamble buys you</h4>" +
        "<ul>" + pkgs + "</ul>" +
      "</div>" +

      sourceDrawer("paper_template.tex", guide.latexTemplate, "latex") +
    "</article>";
  }

  /* A miniature of the compiled page. Nothing here is information you cannot
     get from the list beside it — but the two-column shape, with a float at
     the top of a column and one table carrying the headline number, is the
     part a first-time author has never actually seen. It costs no data:
     every bar is a CSS rule. */
  function pagePreview() {
    function bars(widths) {
      return widths.map(function (w) {
        return '<i style="width:' + w + '%"></i>';
      }).join("");
    }

    var col1 =
      "<b>Abstract</b>" + bars([100, 100, 96, 100, 62]) +
      "<b>1&nbsp;&nbsp;Introduction</b>" + bars([100, 94, 100, 100, 88, 100, 71]) +
      '<div class="rs-sheet-fig"><span>' + TD.icon("chart") + " Figure 1</span></div>" +
      bars([100, 92, 100, 55]);

    var col2 =
      "<b>3&nbsp;&nbsp;Method</b>" + bars([100, 100, 90, 100, 68]) +
      '<div class="rs-sheet-table">' +
        '<u></u><i style="width:100%"></i><i style="width:100%"></i>' +
        '<i style="width:100%" class="is-bold"></i><u></u>' +
      "</div>" +
      "<b>4&nbsp;&nbsp;Evaluation</b>" + bars([100, 96, 100, 100, 47]);

    return '<figure class="rs-page">' +
      '<div class="rs-sheet" aria-hidden="true">' +
        '<div class="rs-sheet-title">' + bars([84, 52]) + "</div>" +
        '<div class="rs-sheet-auth">' + bars([46]) + "</div>" +
        '<div class="rs-sheet-cols">' +
          '<div class="rs-sheet-col">' + col1 + "</div>" +
          '<div class="rs-sheet-col">' + col2 + "</div>" +
        "</div>" +
      "</div>" +
      "<figcaption>Roughly what page one compiles to. Figures and tables float to the top " +
        "of a column; nothing important is set inline.</figcaption>" +
    "</figure>";
  }

  function renderRebuttalKit(guide) {
    var kit = guide.rebuttalKit;
    if (!kit) return "";

    var threads = (kit.threads || []).map(function (t) {
      return '<article class="rs-thread">' +
        '<header class="rs-thread-head">' +
          '<span class="rs-thread-who">' + TD.esc(t.who) + "</span>" +
          '<span class="rs-thread-kind">' + TD.esc(t.kind) + "</span>" +
          '<span class="rs-thread-score">' + TD.icon("trend") + TD.esc(t.score) + "</span>" +
        "</header>" +
        '<div class="rs-msg rs-msg-them">' +
          '<span class="rs-msg-tag">' + TD.icon("quote") + " Reviewer</span>" +
          "<p>" + TD.esc(t.q) + "</p>" +
        "</div>" +
        '<div class="rs-msg rs-msg-you">' +
          '<span class="rs-msg-tag">' + TD.icon("pen") + " Your reply</span>" +
          "<p>" + TD.esc(t.a) + "</p>" +
        "</div>" +
        '<footer class="rs-thread-why">' + TD.icon("idea") +
          "<span>" + TD.esc(t.move) + "</span></footer>" +
      "</article>";
    }).join("");

    var rules = (kit.rules || []).map(function (r) {
      return '<li class="rs-rule">' +
        '<p class="rs-rule-do">' + TD.icon("check") + "<span>" + TD.esc(r["do"]) + "</span></p>" +
        '<p class="rs-rule-dont">' + TD.icon("close") + "<span>" + TD.esc(r["dont"]) + "</span></p>" +
      "</li>";
    }).join("");

    var open = kit.opening || {};

    return '<article class="rs-kit rs-kit-reb">' +
      kitHead("Rebuttal", "Reply to reviewers",
        TD.esc(kit.audience || ""),
        metaChip("timer", kit.window || "") + metaChip("scroll", kit.budget || ""),
        "rebuttal", "Copy text") +

      '<div class="rs-reb-flow">' +
        '<div class="rs-reb-open">' +
          '<span class="rs-reb-step">Open</span>' +
          '<p class="rs-reb-quote">' + TD.esc(open.text || "") + "</p>" +
          '<p class="rs-reb-note">' + TD.icon("idea") + "<span>" + TD.esc(open.note || "") + "</span></p>" +
        "</div>" +

        '<div class="rs-threads">' +
          '<span class="rs-reb-step">Answer, weakest score first</span>' +
          threads +
        "</div>" +

        '<div class="rs-reb-close">' +
          '<span class="rs-reb-step">Close</span>' +
          '<p class="rs-reb-quote">' + TD.esc(kit.closing || "") + "</p>" +
        "</div>" +
      "</div>" +

      '<div class="rs-rules">' +
        '<h4 class="rs-kit-sub">' + TD.icon("target") + " What moves a score, and what does not</h4>" +
        "<ul>" + rules + "</ul>" +
      "</div>" +

      sourceDrawer("rebuttal_response.txt", guide.rebuttalTemplate, "rebuttal") +
    "</article>";
  }

  /* ---------------- 3. how to read ---------------- */

  function renderReading() {
    var passes = (TD.readingPasses || []).map(function (rp) {
      return '<article class="rs-pass">' +
        '<header class="rs-pass-head">' +
          '<span class="rs-pass-n">Pass ' + rp.pass + "</span>" +
          "<h3>" + TD.esc(rp.name) + "</h3>" +
          '<span class="rs-pass-time">' + TD.icon("timer") + TD.esc(rp.time) + "</span>" +
        "</header>" +
        '<p class="rs-pass-goal">' + TD.esc(rp.goal) + "</p>" +
        '<div class="rs-pass-cols">' +
          '<div><h4>' + TD.icon("eye") + " What you read</h4><ul>" +
            (rp.does || []).map(function (d) { return "<li>" + TD.esc(d) + "</li>"; }).join("") +
          "</ul></div>" +
          '<div><h4>' + TD.icon("quiz") + " What you should be able to answer</h4><ul>" +
            (rp.answers || []).map(function (a) { return "<li>" + TD.esc(a) + "</li>"; }).join("") +
          "</ul></div>" +
        "</div>" +
        '<footer class="rs-pass-out">' + TD.icon("idea") + "<span>" + TD.esc(rp.outcome) + "</span></footer>" +
      "</article>";
    }).join("");

    return '<section class="rs-block">' +
      '<div class="rs-block-head">' +
        "<h2>" + TD.icon("microscope") + " The three-pass method</h2>" +
        "<p>Reading a paper front to back is the slowest possible way to read one. Three " +
          "increasingly expensive passes let you abandon most papers in ten minutes and spend " +
          "real time only on the few that deserve it.</p>" +
      "</div>" +
      '<div class="rs-passes">' + passes + "</div>" +

      '<div class="rs-callout">' +
        "<h3>" + TD.icon("alert") + " The figures are not decoration</h3>" +
        "<p>In pass two, spend most of your time on the figures and tables. Check that axes are " +
          "labelled, that error bars exist, that the y-axis starts at zero or that the paper " +
          "says why it does not, and that the baselines are recent. Most weak papers are weak " +
          "in a way that is visible in a single chart.</p>" +
      "</div>" +
    "</section>";
  }

  /* ---------------- 4. venues ---------------- */

  /* Acceptance rates are authored as ranges ("20–25%"). Parse the midpoint so
     the bars are comparable, and keep the original string for display. */
  function acceptMid(s) {
    var nums = String(s).match(/\d+/g);
    if (!nums) return null;
    if (nums.length === 1) return Number(nums[0]);
    return (Number(nums[0]) + Number(nums[1])) / 2;
  }

  function renderVenues() {
    var list = (TD.conferences || []).filter(function (c) {
      return state.confField === "all" || c._field === state.confField;
    });

    var maxH5 = 1;
    (TD.conferences || []).forEach(function (c) { maxH5 = Math.max(maxH5, c.h5Index || 0); });

    var rows = list.slice().sort(function (a, b) {
      return (b.h5Index || 0) - (a.h5Index || 0);
    }).map(function (c) {
      var mid = acceptMid(c.acceptRate);
      var f = fieldMeta(c._field);
      return '<article class="rs-venue" style="--fc:' + f.col + '">' +
        '<div class="rs-venue-main">' +
          '<div class="rs-venue-id">' +
            "<h3><a href=\"" + TD.esc(c.url) + "\" target=\"_blank\" rel=\"noopener noreferrer\">" +
              TD.esc(c.name) + TD.icon("external") + "</a></h3>" +
            '<p class="rs-venue-full">' + TD.esc(c.full) + "</p>" +
          "</div>" +
          '<span class="rs-venue-tier">' + TD.esc(c.tier) + "</span>" +
        "</div>" +

        '<p class="rs-venue-desc">' + TD.esc(c.desc) + "</p>" +

        '<div class="rs-venue-metrics">' +
          '<div class="rs-metric">' +
            '<span class="rs-metric-label">Selectivity</span>' +
            '<span class="rs-metric-bar rs-metric-accept">' +
              (mid !== null ? '<i style="width:' + Math.min(100, mid * 2.5) + '%"></i>' : "") +
            "</span>" +
            '<span class="rs-metric-val">' + TD.esc(c.acceptRate) + " accepted</span>" +
          "</div>" +
          '<div class="rs-metric">' +
            '<span class="rs-metric-label">Reach (h5)</span>' +
            '<span class="rs-metric-bar rs-metric-h5">' +
              '<i style="width:' + Math.round(((c.h5Index || 0) / maxH5) * 100) + '%"></i>' +
            "</span>" +
            '<span class="rs-metric-val">' + (c.h5Index || "—") + "</span>" +
          "</div>" +
        "</div>" +

        '<footer class="rs-venue-foot">' +
          "<span>" + TD.icon("shield") + TD.esc(c.reviewFormat) + "</span>" +
          "<span>" + TD.icon("calendar") + TD.esc(c.deadline) + "</span>" +
          '<span class="rs-venue-field">' + TD.esc(f.label) + "</span>" +
        "</footer>" +
      "</article>";
    }).join("");

    var facts = (TD.venueFacts || []).map(function (f) {
      return '<div class="rs-fact"><strong>' + TD.esc(f.v) + "</strong>" +
        "<span>" + TD.esc(f.k) + "</span>" +
        '<p>' + TD.esc(f.note) + "</p></div>";
    }).join("");

    return '<section class="rs-block">' +
      '<div class="rs-block-head">' +
        "<h2>" + TD.icon("server") + " Tier-1 venues</h2>" +
        "<p>Sorted by h5-index. A lower acceptance rate is not automatically a better fit — " +
          "the right venue is the one whose reviewers already care about your question.</p>" +
      "</div>" +
      '<div class="rs-facts">' + facts + "</div>" +
      '<div class="rs-chips-row">' + fieldChips(state.confField, "data-rs-conf", TD.conferences || []) + "</div>" +
      (rows
        ? '<div class="rs-venue-grid">' + rows + "</div>"
        : '<div class="empty"><h3>No venues in that field</h3></div>') +
    "</section>";
  }

  /* ---------------- 5. landmark papers ---------------- */

  function renderPapers() {
    var all = TD.landmarkPapers || [];
    var needle = state.paperQuery.toLowerCase().trim();

    var list = all.filter(function (p) {
      if (state.paperField !== "all" && p._field !== state.paperField) return false;
      if (!needle) return true;
      return [p.title, p.authors, p.venue, p.tldr, p.breakthrough, p.domain]
        .join(" ").toLowerCase().indexOf(needle) !== -1;
    });

    if (state.paperSort === "year") {
      list.sort(function (a, b) { return a.year - b.year; });
    } else {
      list.sort(function (a, b) { return b._cites - a._cites; });
    }

    var maxCites = 1;
    all.forEach(function (p) { maxCites = Math.max(maxCites, p._cites); });

    /* A decade spine: the timeline is the point of this tab, and grouping by
       decade is what makes 1970 and 2025 sit on the same page legibly. */
    var groups = [];
    var lastDecade = null;
    list.forEach(function (p) {
      var decade = Math.floor(p.year / 10) * 10;
      if (decade !== lastDecade) {
        groups.push({ decade: decade, items: [] });
        lastDecade = decade;
      }
      groups[groups.length - 1].items.push(p);
    });

    var timeline = groups.map(function (g) {
      var items = g.items.map(function (p) {
        var f = fieldMeta(p._field);
        var pct = Math.max(4, Math.round((p._cites / maxCites) * 100));
        return '<article class="rs-paper" style="--fc:' + f.col + '">' +
          '<span class="rs-paper-year">' + p.year + "</span>" +
          '<div class="rs-paper-body">' +
            '<div class="rs-paper-top">' +
              '<span class="rs-paper-venue">' + TD.esc(p.venue) + "</span>" +
              '<span class="rs-paper-field">' + TD.esc(f.label) + "</span>" +
            "</div>" +
            "<h3><a href=\"" + TD.esc(p.pdfUrl) + "\" target=\"_blank\" rel=\"noopener noreferrer\">" +
              TD.esc(p.title) + "</a></h3>" +
            '<p class="rs-paper-authors">' + TD.esc(p.authors) + "</p>" +
            '<p class="rs-paper-tldr">' + TD.esc(p.tldr) + "</p>" +
            '<div class="rs-paper-break">' + TD.icon("spark") +
              "<span>" + TD.esc(p.breakthrough) + "</span></div>" +
            '<div class="rs-paper-foot">' +
              '<span class="rs-cites" title="' + TD.esc(p.citations) + ' citations">' +
                '<span class="rs-cites-bar"><i style="width:' + pct + '%"></i></span>' +
                TD.esc(p.citations) + "</span>" +
              '<span class="rs-paper-links">' +
                '<a href="' + TD.esc(p.paperUrl) + '" target="_blank" rel="noopener noreferrer">Abstract</a>' +
                '<a class="is-primary" href="' + TD.esc(p.pdfUrl) + '" target="_blank" ' +
                  'rel="noopener noreferrer">' + TD.icon("book") + " PDF</a>" +
              "</span>" +
            "</div>" +
          "</div>" +
        "</article>";
      }).join("");

      return '<section class="rs-decade">' +
        '<h3 class="rs-decade-label"><span>' + g.decade + "s</span></h3>" +
        '<div class="rs-decade-items">' + items + "</div>" +
      "</section>";
    }).join("");

    return '<section class="rs-block">' +
      '<div class="rs-block-head">' +
        "<h2>" + TD.icon("book") + " Papers worth reading in full</h2>" +
        "<p>Ordered along a timeline, because the interesting thing about this set is how each " +
          "one made the next possible. Bar length is citation count relative to the most-cited " +
          "paper here.</p>" +
      "</div>" +

      '<div class="rs-paper-controls">' +
        '<div class="proj-search-wrap">' +
          '<span class="proj-search-icon">' + TD.icon("search") + "</span>" +
          '<input type="text" class="proj-search-input" id="rsPaperSearch" ' +
            'placeholder="Search by title, author or idea — attention, Raft, Spectre, MapReduce…" ' +
            'value="' + TD.esc(state.paperQuery) + '" />' +
        "</div>" +
        '<div class="rs-chips-row">' +
          fieldChips(state.paperField, "data-rs-paper", all) +
          '<span class="rs-sort">' +
            '<button class="rs-chip' + (state.paperSort === "year" ? " is-active" : "") +
              '" data-rs-sort="year">' + TD.icon("calendar") + "Chronological</button>" +
            '<button class="rs-chip' + (state.paperSort === "cites" ? " is-active" : "") +
              '" data-rs-sort="cites">' + TD.icon("chart") + "By impact</button>" +
          "</span>" +
        "</div>" +
      "</div>" +

      (list.length
        ? '<div class="rs-timeline">' + timeline + "</div>"
        : '<div class="empty"><h3>No papers match that</h3>' +
            "<p>Try an author, a venue, or a concept such as <em>consensus</em> or " +
            "<em>attention</em>.</p></div>") +
    "</section>";
  }

  /* ---------------- 6. review & rejection ---------------- */

  function renderProcess() {
    var steps = ((TD.researchMeta && TD.researchMeta.reviewProcess) || []).map(function (rp) {
      return '<li class="rs-step">' +
        '<span class="rs-step-n">' + rp.step + "</span>" +
        "<div><h4>" + TD.esc(rp.title) + "</h4><p>" + TD.esc(rp.desc) + "</p></div>" +
      "</li>";
    }).join("");

    var reasons = (TD.rejectionReasons || []).map(function (r) {
      return '<article class="rs-reason">' +
        '<header><h3>' + TD.esc(r.reason) + "</h3>" +
          '<span class="rs-reason-share">' + TD.esc(r.share) + "</span></header>" +
        '<p class="rs-reason-tell"><strong>You have it if</strong> ' + TD.esc(r.tell) + "</p>" +
        '<p class="rs-reason-fix">' + TD.icon("check") + "<span><strong>Fix</strong> " +
          TD.esc(r.fix) + "</span></p>" +
      "</article>";
    }).join("");

    return '<section class="rs-block">' +
      '<div class="rs-block-head">' +
        "<h2>" + TD.icon("flow") + " How review actually runs</h2>" +
        "<p>Most of the outcome is decided before the rebuttal. The one place you can still " +
          "move a score is by answering a reviewer's specific question with a specific number.</p>" +
      "</div>" +
      (TD.reviewFlow && TD.blueprint ? TD.blueprint(TD.reviewFlow) : "") +
      '<ol class="rs-steps">' + steps + "</ol>" +

      '<div class="rs-block-head rs-mt">' +
        "<h2>" + TD.icon("alert") + " Why papers get rejected</h2>" +
        "<p>Ordered by how often it happens, not by how serious it sounds. The top three " +
          "account for most rejections and all three are fixable before you submit.</p>" +
      "</div>" +
      '<div class="rs-reasons">' + reasons + "</div>" +

      '<div class="rs-callout">' +
        "<h3>" + TD.icon("idea") + " The rebuttal that works</h3>" +
        "<p>Group by reviewer. Answer the specific question asked, with a number, in the first " +
          "sentence. Concede the points that are correct — conceding one thing makes your " +
          "disagreement on the next thing credible. Never argue that a reviewer misunderstood " +
          "without also fixing the text that let them.</p>" +
      "</div>" +
    "</section>";
  }

  /* ---------------- events ---------------- */

  function onResearch() {
    return window.location.hash.indexOf("#/research") === 0;
  }

  function rerender() {
    var view = document.getElementById("view");
    if (view && onResearch()) view.innerHTML = TD.viewResearch(state.tab);
  }

  document.addEventListener("click", function (e) {
    var tabBtn = e.target.closest("[data-rs-tab]");
    if (tabBtn) {
      state.tab = tabBtn.getAttribute("data-rs-tab");
      rerender();
      window.scrollTo({ top: 0, behavior: "auto" });
      return;
    }

    var confChip = e.target.closest("[data-rs-conf]");
    if (confChip) {
      state.confField = confChip.getAttribute("data-rs-conf");
      rerender();
      return;
    }

    var paperChip = e.target.closest("[data-rs-paper]");
    if (paperChip) {
      state.paperField = paperChip.getAttribute("data-rs-paper");
      rerender();
      return;
    }

    var sortBtn = e.target.closest("[data-rs-sort]");
    if (sortBtn) {
      state.paperSort = sortBtn.getAttribute("data-rs-sort");
      rerender();
      return;
    }

    var copyBtn = e.target.closest("[data-rs-copy]");
    if (copyBtn) {
      var which = copyBtn.getAttribute("data-rs-copy");
      var guide = TD.writingGuide || {};
      var text = which === "latex" ? guide.latexTemplate : guide.rebuttalTemplate;
      if (navigator.clipboard && text) {
        /* Restore whatever label the button had — the two buttons say
           different things ("Copy .tex", "Copy text"), so a hardcoded reset
           would silently rename one of them. */
        var label = copyBtn.innerHTML;
        navigator.clipboard.writeText(text).then(function () {
          copyBtn.innerHTML = TD.icon("check") + " Copied";
          setTimeout(function () { copyBtn.innerHTML = label; }, 1800);
        });
      }
      return;
    }
  });

  document.addEventListener("input", function (e) {
    if (e.target && e.target.id === "rsPaperSearch") {
      state.paperQuery = e.target.value;
      /* Redraw only the timeline so the input keeps focus and the caret
         position while typing. */
      var host = document.querySelector(".rs-timeline");
      var block = host && host.parentNode;
      if (!block) { rerender(); return; }
      var fresh = document.createElement("div");
      fresh.innerHTML = renderPapers();
      var newTimeline = fresh.querySelector(".rs-timeline") || fresh.querySelector(".empty");
      if (newTimeline) block.replaceChild(newTimeline, host);
    }
  });
})(window.TD = window.TD || {});
