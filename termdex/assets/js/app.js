/* NodeCraft app — hash router, views, command palette, keyboard layer. */
(function (TD) {
  "use strict";

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var view = $("#view");
  var sidebar = $("#sidebar");
  var scrim = $("#sidebarScrim");
  var palette = $("#palette");
  var pInput = $("#paletteInput");
  var pResults = $("#paletteResults");
  var pFilters = $("#paletteFilters");
  var pCount = $("#paletteCount");
  var shortcuts = $("#shortcuts");
  var toastEl = $("#toast");
  var progressBar = $("#readProgress").firstElementChild;

  var state = {
    route: { name: "home" },
    bookmarks: TD.store.get("bookmarks", []),
    recent: TD.store.get("recent", []),
    theme: "light",
    palSel: 0,
    palResults: [],
    palCat: null,
    lastQuery: ""
  };

  /* ================= scroll restoration engine ================= */
  var scrollPositions = {};
  var lastCardClick = null;
  var cardClicksByHash = {};
  var isPopNav = false;
  var prevRouteHash = null;

  if (typeof history !== "undefined" && "scrollRestoration" in history) {
    try { history.scrollRestoration = "manual"; } catch (e) {}
  }

  function restoreScrollPos(targetY, clickedHref) {
    if (targetY == null || targetY < 0) return;
    window.scrollTo({ top: targetY, behavior: "instant" });
    requestAnimationFrame(function () {
      window.scrollTo({ top: targetY, behavior: "instant" });
      if (clickedHref) {
        try {
          var targetEl = document.querySelector('a[href="' + clickedHref + '"]');
          if (targetEl) {
            var rect = targetEl.getBoundingClientRect();
            if (rect.top < 40 || rect.bottom > window.innerHeight) {
              targetEl.scrollIntoView({ block: "center", behavior: "instant" });
            }
          }
        } catch (err) {}
      }
    });
    setTimeout(function () {
      window.scrollTo({ top: targetY, behavior: "instant" });
    }, 60);
  }

  /* ================= theme + category colours ================= */

  function injectCategoryStyles() {
    var css = "";
    TD.categories.forEach(function (c) {
      css += '[data-cat="' + c.id + '"]{--cat:' + c.col + ";}\n";
      css += 'html[data-theme="light"] [data-cat="' + c.id + '"]{--cat:' + c.colL + ";}\n";
    });
    /* study collections drive the same --cat channel, keyed on data-col, so
       every component that already reads --cat works unchanged */
    TD.collections.forEach(function (c) {
      css += '[data-col="' + c.id + '"]{--cat:' + c.col + ";}\n";
      css += 'html[data-theme="light"] [data-col="' + c.id + '"]{--cat:' + c.colL + ";}\n";
    });
    /* career families feed the same channel, keyed on data-fam */
    TD.families.forEach(function (f) {
      css += '[data-fam="' + f.id + '"]{--cat:' + f.col + ";}\n";
      css += 'html[data-theme="light"] [data-fam="' + f.id + '"]{--cat:' + f.colL + ";}\n";
    });
    /* learn tracks feed the same channel again, keyed on data-track */
    TD.tracks.forEach(function (t) {
      css += '[data-track="' + t.id + '"]{--cat:' + t.col + ";}\n";
      css += 'html[data-theme="light"] [data-track="' + t.id + '"]{--cat:' + t.colL + ";}\n";
    });
    var el = document.createElement("style");
    el.textContent = css;
    document.head.appendChild(el);
  }

  /* ---------- theme ----------
     Three states, not two: "dark", "light", and no stored value at all,
     which follows the operating system. A reader who has set their machine
     to switch at sunset expects a site to come with them, and a reader who
     has explicitly picked one expects it to stick. Cycling through all
     three is what makes both of those possible from one control.

     The <html> element already carries the right attribute before this
     runs — the inline script in <head> sets it from storage synchronously,
     so there is no flash of the wrong theme on load. */

  var THEME_ORDER = ["system", "light", "dark"];

  function systemTheme() {
    return (window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: light)").matches) ? "light" : "dark";
  }

  function resolveTheme(pref) {
    return pref === "system" ? systemTheme() : pref;
  }

  function applyTheme(pref) {
    if (THEME_ORDER.indexOf(pref) < 0) pref = "system";
    state.theme = pref;

    var actual = resolveTheme(pref);
    var root = document.documentElement;

    /* Crossfade the swap, but only when the theme actually changes and only
       after first paint — transitioning on boot would fade the page in from
       the wrong colours, which is the flash this is meant to avoid. */
    if (state.themeReady && root.getAttribute("data-theme") !== actual) {
      root.classList.add("theme-swap");
      clearTimeout(applyTheme._t);
      applyTheme._t = setTimeout(function () {
        root.classList.remove("theme-swap");
      }, 320);
    }
    state.themeReady = true;

    root.setAttribute("data-theme", actual);
    /* the browser needs to know too, so form controls, scrollbars and the
       address bar match the page rather than fighting it */
    root.style.colorScheme = actual;

    if (pref === "system") TD.store.set("theme", "");
    else TD.store.set("theme", pref);

    paintThemeBtn(pref, actual);
  }

  function paintThemeBtn(pref, actual) {
    var btn = $("#themeBtn");
    if (!btn) return;
    btn.innerHTML = TD.icon("theme");
    btn.setAttribute("data-theme-pref", pref);
    btn.setAttribute("data-theme-now", actual);
    var label = pref === "system"
      ? "Theme: following your system (" + actual + ")"
      : "Theme: " + pref;
    btn.setAttribute("aria-label", label + ". Click to change.");
    btn.setAttribute("title", label);
  }

  function cycleTheme() {
    var i = THEME_ORDER.indexOf(state.theme);
    var next = THEME_ORDER[(i + 1) % THEME_ORDER.length];
    applyTheme(next);
    toast(next === "system"
      ? "Theme follows your system"
      : next === "dark" ? "Dark theme" : "Light theme");
  }

  /* ================= small helpers ================= */

  function cat(id) { return TD.catById[id] || TD.categories[0]; }

  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("is-on");
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { toastEl.classList.remove("is-on"); }, 2600);
  }

  /* Feature modules mounted into a view need this too — the dojo announces a
     first solve with it. Exposed rather than duplicated. */
  TD.toast = toast;

  function isSaved(slug) { return state.bookmarks.indexOf(slug) >= 0; }

  function toggleSave(slug, silent) {
    var i = state.bookmarks.indexOf(slug);
    if (i >= 0) { state.bookmarks.splice(i, 1); if (!silent) toast("Removed from saved"); }
    else { state.bookmarks.push(slug); if (!silent) toast("Saved — find it under Saved"); }
    TD.store.set("bookmarks", state.bookmarks);
    updateBookmarkBadge();
    return i < 0;
  }

  function updateBookmarkBadge() {
    var b = $("#bmCount");
    if (state.bookmarks.length) { b.hidden = false; b.textContent = state.bookmarks.length > 99 ? "99+" : state.bookmarks.length; }
    else b.hidden = true;
  }

  /* "Recent" is a twelve-entry shelf for the home page; path progress needs a
     memory that does not forget, so the visit is also recorded in TD.seen. */
  function pushRecent(slug) {
    TD.seen.mark(slug);
    var i = state.recent.indexOf(slug);
    if (i >= 0) state.recent.splice(i, 1);
    state.recent.unshift(slug);
    state.recent = state.recent.slice(0, 12);
    TD.store.set("recent", state.recent);
  }

  function levelLabel(l) { return TD.levelName(l); }

  /* ================= code highlighting ================= */

  var KEYWORDS = ("select from where group by order having join inner left right full outer on as insert into values update set delete create table alter drop " +
    "index view primary key foreign references unique not null default distinct limit offset union all case when then else end with " +
    "grant revoke commit rollback savepoint begin transaction truncate exists between like in is asc desc count sum avg min max over partition " +
    "def class return if elif else for while import from as try except finally with lambda yield pass break continue global none true false and or not in is print self async await raise assert del " +
    "function const let var new this typeof instanceof export default extends implements interface type enum public private protected static readonly " +
    "int float double char boolean string void long short byte struct union sizeof malloc free include using namespace template " +
    "func package go defer chan map range fn let mut impl trait pub use match crate " +
    "echo print_r require_once foreach endforeach elseif " +
    "SELECT FROM WHERE GROUP BY ORDER HAVING JOIN INNER LEFT RIGHT FULL OUTER ON AS INSERT INTO VALUES UPDATE SET DELETE CREATE TABLE ALTER DROP " +
    "PRIMARY KEY FOREIGN REFERENCES UNIQUE NOT NULL DEFAULT DISTINCT LIMIT OFFSET UNION ALL CASE WHEN THEN ELSE END WITH COUNT SUM AVG MIN MAX " +
    "GRANT REVOKE COMMIT ROLLBACK BEGIN TRANSACTION AND OR IN IS BETWEEN LIKE EXISTS INDEX VIEW OVER PARTITION"
  ).split(/\s+/);

  var KWSET = Object.create(null);
  KEYWORDS.forEach(function (k) { KWSET[k] = 1; });

  var COMMENT = {
    sql: "--[^\\n]*",
    python: "#[^\\n]*", bash: "#[^\\n]*", shell: "#[^\\n]*", yaml: "#[^\\n]*", r: "#[^\\n]*",
    dockerfile: "#[^\\n]*", ruby: "#[^\\n]*", perl: "#[^\\n]*",
    html: "<!--[\\s\\S]*?-->",
    css: "/\\*[\\s\\S]*?\\*/"
  };

  function hl(code, lang) {
    var cpat = COMMENT[lang] || "//[^\\n]*|/\\*[\\s\\S]*?\\*/";
    var re;
    try {
      re = new RegExp("(" + cpat + ")|(\"(?:[^\"\\\\]|\\\\.)*\"|'(?:[^'\\\\]|\\\\.)*')|(\\b\\d+(?:\\.\\d+)?\\b)|([A-Za-z_][A-Za-z0-9_]*)(\\s*\\()?", "g");
    } catch (e) { return TD.esc(code); }
    var out = "", last = 0, m;
    while ((m = re.exec(code)) !== null) {
      out += TD.esc(code.slice(last, m.index));
      if (m[1]) out += '<span class="tok-com">' + TD.esc(m[1]) + "</span>";
      else if (m[2]) out += '<span class="tok-str">' + TD.esc(m[2]) + "</span>";
      else if (m[3]) out += '<span class="tok-num">' + TD.esc(m[3]) + "</span>";
      else if (m[4]) {
        if (KWSET[m[4]]) out += '<span class="tok-kw">' + TD.esc(m[4]) + "</span>" + TD.esc(m[5] || "");
        else if (m[5]) out += '<span class="tok-fn">' + TD.esc(m[4]) + "</span>" + TD.esc(m[5]);
        else out += TD.esc(m[4]);
      }
      last = re.lastIndex;
      if (m.index === re.lastIndex) re.lastIndex++;
    }
    out += TD.esc(code.slice(last));
    return out;
  }

  /* Shared with learn.js, which renders code inside lessons. Exposed rather
     than duplicated so a language added to KEYWORDS lights up everywhere. */
  TD.hl = hl;

  /* ================= reusable fragments ================= */

  function termCard(t, q) {
    var c = cat(t.c);
    return '<a class="term-card" data-cat="' + t.c + '" href="#/t/' + t.slug + '">' +
      '<div class="term-card-top"><h3>' + (q ? TD.highlight(t.t, q) : TD.esc(t.t)) +
      (t.a ? '<span class="abbr">' + TD.esc(t.a) + "</span>" : "") + "</h3>" +
      '<span class="lvl" data-lvl="' + t.l + '">' + levelLabel(t.l) + "</span></div>" +
      "<p>" + (q ? TD.highlight(t.d, q) : TD.esc(t.d)) + "</p>" +
      '<div class="term-card-foot"><span class="pip">' + TD.esc(c.short) + "</span>" +
      (t.dg && TD.hasDiagram(t.dg) ? '<span title="includes a diagram">diagram</span>' : "") +
      "</div></a>";
  }

  function catCard(c) {
    return '<a class="cat-card" data-cat="' + c.id + '" href="#/c/' + c.id + '">' +
      '<span class="cat-ico">' + TD.icon(c.icon) + "</span>" +
      '<span class="cat-name">' + TD.esc(c.name) + "</span>" +
      '<span class="cat-desc">' + TD.esc(c.desc) + "</span>" +
      '<span class="cat-meta"><b>' + c.count + "</b> terms</span></a>";
  }

  /* The compact form of a path, used wherever the home page advertises one.
     It links at the path itself rather than at the top of the index, so a
     reader who clicks "AI in plain English" lands on that card and not on a
     page of thirteen others. */
  function pathMiniCard(p) {
    var prog = TD.pathProgress(p);
    return '<a class="cat-card" data-cat="' + p.cat + '" href="#/paths/' + p.kind + '#p-' + p.id + '">' +
      '<span class="cat-ico">' + TD.icon(p.icon) + "</span>" +
      '<span class="cat-name">' + TD.esc(p.name) + "</span>" +
      '<span class="cat-desc">' + TD.esc(p.desc) + "</span>" +
      '<span class="cat-meta"><b>' + p.count + "</b> entries · " + fmtMins(p.mins) +
      (prog.started ? ' · <b>' + prog.pct + "%</b> read" : "") + "</span></a>";
  }

  function sectionHead(title, desc, linkHref, linkText, catId) {
    return '<div class="sec-head"' + (catId ? ' data-cat="' + catId + '"' : "") + "><div><h2>" + TD.esc(title) + "</h2>" +
      (desc ? '<p class="sec-desc">' + TD.esc(desc) + "</p>" : "") + "</div>" +
      (linkHref ? '<a class="sec-link" href="' + linkHref + '">' + TD.esc(linkText) + TD.icon("arrowRight") + "</a>" : "") +
      "</div>";
  }

  /* ================= views ================= */

  var FEATURED = ["sql", "machine-learning", "large-language-model", "docker", "big-o-notation",
    "rest", "transformer", "kubernetes", "git", "acid", "retrieval-augmented-generation", "hash-table"];

  /* The home page lives in landing.js. The rotating "Concept Spotlight" hero
     that used to be here — and its chips, spec list and rotation table — was
     removed with it; nothing routes to viewHome() any more. */

  function viewCategory(id) {
    var c = TD.catById[id];
    if (!c) return viewNotFound("No such category.");
    var terms = TD.inCategory(id).sort(function (a, b) { return a.t.localeCompare(b.t); });

    var h = '<nav class="crumbs"><a href="#/">Home</a><span class="sep">/</span><span class="cur">' + TD.esc(c.name) + "</span></nav>";
    h += '<header class="cat-hero" data-cat="' + c.id + '">' +
      '<span class="cat-ico">' + TD.icon(c.icon) + "</span><div>" +
      "<h1>" + TD.esc(c.name) + "</h1><p>" + TD.esc(c.desc) + "</p>" +
      '<div class="cat-hero-meta"><span class="pip">' + terms.length + " terms</span>" +
      '<span class="pip">' + terms.filter(function (t) { return t.dg && TD.hasDiagram(t.dg); }).length + " diagrams</span>" +
      '<span class="pip">' + terms.filter(function (t) { return t.x; }).length + " code examples</span>" +
      "</div></div></header>";

    h += '<div class="toolbar">' +
      '<input class="filter-input" id="catFilter" type="text" placeholder="Filter inside ' + TD.esc(c.short) + '…" aria-label="Filter terms in this category" autocomplete="off">' +
      '<div class="seg" id="lvlSeg" role="group" aria-label="Filter by level">' +
      '<button class="is-on" data-lvl="all">All</button>' +
      '<button data-lvl="core">Core</button>' +
      '<button data-lvl="intermediate">Intermediate</button>' +
      '<button data-lvl="advanced">Advanced</button></div>' +
      '<span class="result-count" id="catCount">' + terms.length + " terms</span></div>";

    h += '<div class="term-grid" id="catGrid">' + terms.map(function (t) { return termCard(t); }).join("") + "</div>";
    h += '<div id="catEmpty" hidden>' + emptyBlock("Nothing matches", "Try a shorter filter, or search the whole dictionary.") + "</div>";
    return h;
  }

  function emptyBlock(title, msg, ctaHtml) {
    return '<div class="empty"><div class="empty-ico">' + TD.icon("compass") + "</div>" +
      "<h3>" + TD.esc(title) + "</h3><p>" + TD.esc(msg) + "</p>" +
      (ctaHtml || '<button class="btn btn-ghost" data-act="open-search">' + TD.icon("search") + "Search everything</button>") + "</div>";
  }

  function viewTerm(slug) {
    var t = TD.bySlug[slug];
    if (!t) return viewNotFound("That term is not in the dictionary yet.");
    var c = cat(t.c);
    pushRecent(slug);

    var siblings = TD.inCategory(t.c).sort(function (a, b) { return a.t.localeCompare(b.t); });
    var idx = siblings.findIndex(function (s) { return s.slug === slug; });
    var prev = idx > 0 ? siblings[idx - 1] : null;
    var next = idx >= 0 && idx < siblings.length - 1 ? siblings[idx + 1] : null;
    state.neighbours = { prev: prev, next: next };

    var h = '<article class="article" data-cat="' + t.c + '" data-slug="' + t.slug + '">';
    h += '<nav class="crumbs"><a href="#/">Home</a><span class="sep">/</span>' +
      '<a href="#/c/' + c.id + '">' + TD.esc(c.name) + "</a><span class=\"sep\">/</span>" +
      '<span class="cur">' + TD.esc(t.t) + "</span></nav>";

    h += '<header class="art-head"><div class="art-tags">' +
      '<a class="pip" href="#/c/' + c.id + '">' + TD.esc(c.name) + "</a>" +
      '<span class="lvl" data-lvl="' + t.l + '">' + levelLabel(t.l) + "</span>" +
      (t.g || []).slice(0, 4).map(function (g) { return '<span class="lvl">' + TD.esc(g) + "</span>"; }).join("") +
      "</div>";
    h += "<h1>" + TD.esc(t.t) + "</h1>";
    if (t.a) h += '<p class="art-abbr">' + TD.esc(t.a) + "</p>";
    h += '<p class="art-def">' + TD.rich(t.d) + "</p>";
    h += '<div class="art-actions">' +
      '<button class="btn btn-ghost btn-sm" data-act="save" data-slug="' + t.slug + '">' +
      TD.icon(isSaved(t.slug) ? "bookmarkOn" : "bookmark") + "<span>" + (isSaved(t.slug) ? "Saved" : "Save") + "</span></button>" +
      '<button class="btn btn-ghost btn-sm" data-act="copylink">' + TD.icon("link") + "Copy link</button>" +
      '<button class="btn btn-ghost btn-sm" data-act="random">' + TD.icon("dice") + "Random</button>" +
      "</div></header>";

    h += '<div class="art-body">';
    (t.b || []).forEach(function (p) { h += "<p>" + TD.rich(p) + "</p>"; });

    /* Why it exists comes before the example, because it is the context the
       example is an instance of — a reader who knows what problem the thing
       was built for reads everything below it differently. */
    if (t.why && TD.whyExists) {
      h += '<h2 class="art-h2"><span class="h2-ico">' + TD.icon("clock") + "</span>Why it exists</h2>";
      h += TD.whyExists(t.why);
    }

    if (t.ex) {
      h += '<h2 class="art-h2"><span class="h2-ico">' + TD.icon("compass") + "</span>In the real world</h2>";
      h += TD.realWorld(t.ex);
    }

    if (t.fl) {
      h += '<h2 class="art-h2"><span class="h2-ico">' + TD.icon("path") + "</span>How it works, step by step</h2>";
      h += TD.flow(t.fl);
    }

    if (t.dg && TD.hasDiagram(t.dg)) {
      h += '<h2 class="art-h2"><span class="h2-ico">' + TD.icon("graph") + "</span>How it looks</h2>";
      h += TD.diagram(t.dg);
    }

    if (t.k && t.k.length) {
      h += '<h2 class="art-h2"><span class="h2-ico">' + TD.icon("bulb") + "</span>Key points</h2>";
      h += '<ul class="kpoints">' + t.k.map(function (k) { return "<li><span>" + TD.rich(k) + "</span></li>"; }).join("") + "</ul>";
    }

    /* The reasoning half of the entry. Each renders only if the term carries
       it, so an entry that has not been deepened yet is unchanged. */
    if (t.num && TD.numbers) {
      h += '<h2 class="art-h2"><span class="h2-ico">' + TD.icon("chart") + "</span>The numbers</h2>";
      h += TD.numbers(t.num);
    }

    if (t.miss && t.miss.length && TD.misconceptions) {
      h += '<h2 class="art-h2"><span class="h2-ico">' + TD.icon("trap") + "</span>What people get wrong</h2>";
      h += TD.misconceptions(t.miss);
    }

    if (t.trade && TD.tradeoffs) {
      h += '<h2 class="art-h2"><span class="h2-ico">' + TD.icon("gauge") + "</span>The trade-off</h2>";
      h += TD.tradeoffs(t.trade);
    }

    if (t.x && t.x.code) {
      h += '<h2 class="art-h2"><span class="h2-ico">' + TD.icon("terminal") + "</span>In code</h2>";
      h += '<div class="codebox"><div class="codebox-head"><span class="codebox-lang">' + TD.esc(t.x.lang || "code") + "</span>" +
        '<button class="copy-btn" data-act="copycode">' + TD.icon("copy") + "Copy</button></div>" +
        "<pre><code>" + hl(t.x.code, (t.x.lang || "").toLowerCase()) + "</code></pre></div>";
    }

    var rel = (t.r || []).map(function (r) { return TD.resolve(r); }).filter(function (x) { return x && x.slug !== t.slug; });
    if (rel.length) {
      h += '<h2 class="art-h2"><span class="h2-ico">' + TD.icon("link") + "</span>Related terms</h2>";
      h += '<div class="chips">' + rel.map(function (r) {
        return '<a class="chip" data-cat="' + r.c + '" href="#/t/' + r.slug + '"><span class="chip-dot"></span>' + TD.esc(r.t) + "</a>";
      }).join("") + "</div>";
    }
    h += "</div>";

    h += '<nav class="art-nav" aria-label="Previous and next term">' +
      (prev ? '<a class="art-nav-card prev" href="#/t/' + prev.slug + '"><span>Previous</span><strong>' + TD.esc(prev.t) + "</strong></a>"
        : '<span class="art-nav-card is-empty"></span>') +
      (next ? '<a class="art-nav-card next" href="#/t/' + next.slug + '"><span>Next</span><strong>' + TD.esc(next.t) + "</strong></a>"
        : '<span class="art-nav-card is-empty"></span>') +
      "</nav></article>";
    return h;
  }

  function viewIndex() {
    var groups = {};
    TD.terms.slice().sort(function (a, b) { return a.t.localeCompare(b.t); }).forEach(function (t) {
      var ch = t.t[0].toUpperCase();
      if (!/[A-Z]/.test(ch)) ch = "#";
      (groups[ch] = groups[ch] || []).push(t);
    });
    var letters = "#ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    var h = '<nav class="crumbs"><a href="#/">Home</a><span class="sep">/</span><span class="cur">A–Z Index</span></nav>';
    h += "<h1 style=\"font-size:var(--fs-2xl);margin-bottom:8px\">Every term, alphabetically</h1>";
    h += '<p class="sec-desc" style="margin-bottom:20px">' + TD.terms.length + " entries across " + TD.categories.length + " fields. Jump with a letter, or press <kbd>/</kbd> to search.</p>";
    h += '<div class="az-bar">' + letters.map(function (L) {
      var has = groups[L] && groups[L].length;
      return '<a class="az-key' + (has ? "" : " is-empty") + '" href="#az-' + (L === "#" ? "num" : L) + '">' + L + "</a>";
    }).join("") + "</div>";

    letters.forEach(function (L) {
      var g = groups[L];
      if (!g || !g.length) return;
      h += '<section class="az-group" id="az-' + (L === "#" ? "num" : L) + '">' +
        '<h2 class="az-letter">' + L + "</h2><ul class=\"az-list\">" +
        g.map(function (t) {
          return '<li><a class="az-item" data-cat="' + t.c + '" href="#/t/' + t.slug + '">' +
            '<span class="chip-dot"></span><span>' + TD.esc(t.t) + "</span></a></li>";
        }).join("") + "</ul></section>";
    });
    return h;
  }

  /* ================= learning paths =================
     A path is a reading order through the dictionary. The index used to be
     a stack of thirty-item lists, which told a reader the sequence and
     nothing else — not how long it would take, not what shape the subject
     was, not where they had already got to.

     This view answers those instead. Every path arrives with its chapters
     visible, an honest reading time computed from the entries themselves,
     the reader's own progress across it, and the Learn Coding course that
     covers the same ground in code — or a note that the course is coming.  */

  var PATH_GROUPS = [
    { id: "start", n: "Start here",
      d: "No experience assumed. Each of these gives you the vocabulary the next thing you read will take for granted." },
    { id: "core", n: "Foundations",
      d: "The ideas underneath every role. Slower to pay off, and the reason some engineers stop improving in year three." },
    { id: "role", n: "Role tracks",
      d: "One route per job. Read top to bottom and you have the working vocabulary of that role." }
  ];

  function pathGroup(id) {
    for (var i = 0; i < PATH_GROUPS.length; i++) {
      if (PATH_GROUPS[i].id === id) return PATH_GROUPS[i];
    }
    return PATH_GROUPS[PATH_GROUPS.length - 1];
  }

  /* A donut rather than a bar: a path card is a square-ish block and a ring
     reads as a single glanceable figure where a full-width bar would compete
     with the title beside it. */
  function pathRing(prog) {
    var r = 15.5;
    var c = 2 * Math.PI * r;
    var on = c * (prog.pct / 100);
    return '<span class="px-ring' + (prog.complete ? " is-done" : "") + '" role="img" aria-label="' +
      prog.done + " of " + prog.total + ' entries read">' +
      '<svg viewBox="0 0 40 40" aria-hidden="true">' +
      '<circle class="px-ring-t" cx="20" cy="20" r="' + r + '"/>' +
      '<circle class="px-ring-f" cx="20" cy="20" r="' + r + '" ' +
      'stroke-dasharray="' + on.toFixed(1) + " " + c.toFixed(1) + '"/></svg>' +
      '<b>' + (prog.complete ? TD.icon("check") : prog.pct + "<i>%</i>") + "</b></span>";
  }

  /* The bridge between the two halves of the site: a path teaches the words,
     a track teaches the typing. Where the track does not exist yet the chip
     still renders — saying so is more useful than an absence. */
  function pathCourse(p) {
    if (!p.course) return "";
    if (typeof p.course === "string") {
      var tr = TD.trackById[p.course];
      if (!tr) return "";
      return '<a class="px-course" data-track="' + tr.id + '" href="#/learn/' + tr.id + '">' +
        '<span class="px-course-i">' + TD.icon("code") + "</span>" +
        '<span class="px-course-b"><b>Then write it: ' + TD.esc(tr.short) + "</b>" +
        "<span>" + tr.count + " lessons · " + fmtMins(tr.mins) + " in the course</span></span>" +
        '<span class="px-course-go">' + TD.icon("arrowRight") + "</span></a>";
    }
    return '<span class="px-course is-soon">' +
      '<span class="px-course-i">' + TD.icon("code") + "</span>" +
      '<span class="px-course-b"><b>' + TD.esc(p.course.soon) + " course</b>" +
      "<span>Coming soon — the reading path is ready now</span></span>" +
      '<span class="px-soon-tag">Coming soon</span></span>';
  }

  /* One chapter. Collapsed it is a single line that says what the chapter is
     for; opened it is the entries themselves. <details> is used deliberately
     — it is keyboard operable and announced correctly with no script. */
  function pathPart(p, part, offset, next) {
    var read = 0;
    var holdsNext = false;
    part.terms.forEach(function (t) {
      if (TD.seen.has(t.slug)) read++;
      if (next && t.slug === next.slug) holdsNext = true;
    });
    var full = part.count > 0 && read >= part.count;

    /* the chapter the reader is up to arrives open. Every other chapter
       stays shut, so the card is a syllabus at a glance rather than a
       thirty-line list, and opening one is a single click. */
    var h = '<details class="px-part' + (full ? " is-done" : "") +
      (holdsNext ? " is-here" : "") + '"' + (holdsNext ? " open" : "") + ">" +
      '<summary class="px-part-h">' +
      '<span class="px-part-n">' + (full ? TD.icon("check") : part.n_) + "</span>" +
      '<span class="px-part-b"><span class="px-part-t">' + TD.esc(part.n) + "</span>" +
      '<span class="px-part-d">' + TD.rich(part.d) + "</span></span>" +
      '<span class="px-part-c">' + (read ? read + " / " + part.count : part.count) + "</span>" +
      '<span class="px-part-x" aria-hidden="true">' + TD.icon("right") + "</span>" +
      "</summary>";

    h += '<ol class="px-steps">' + part.terms.map(function (t, i) {
      var seen = TD.seen.has(t.slug);
      var here = next && t.slug === next.slug && !seen;
      return '<li class="px-step' + (seen ? " is-read" : "") + (here ? " is-next" : "") +
        '" data-cat="' + t.c + '">' +
        '<a href="#/t/' + t.slug + '">' +
        '<span class="px-step-n" aria-hidden="true">' + (offset + i + 1) + "</span>" +
        '<span class="px-step-t">' + TD.esc(t.t) + "</span>" +
        (t.a ? '<span class="px-step-a">' + TD.esc(t.a) + "</span>" : "") +
        '<span class="px-step-d">' + TD.esc(t.d) + "</span>" +
        (seen ? '<span class="px-step-r" aria-label="Already read">' + TD.icon("check") + "</span>"
          : here ? '<span class="px-step-r is-next">You are here</span>' : "") +
        "</a></li>";
    }).join("") + "</ol></details>";

    return h;
  }

  function pathCard(p) {
    var prog = TD.pathProgress(p);
    var next = TD.pathNext(p);
    var left = prog.total - prog.done;

    var h = '<article class="px-card' + (prog.complete ? " is-done" : prog.started ? " is-going" : "") +
      '" data-cat="' + p.cat + '" id="p-' + p.id + '">';

    h += '<header class="px-head">' +
      '<span class="px-ico">' + TD.icon(p.icon) + "</span>" +
      '<div class="px-head-b">' +
      '<span class="px-lvl">' + TD.esc(p.lvl || pathGroup(p.kind).n) + "</span>" +
      "<h3>" + TD.esc(p.name) + "</h3>" +
      '<p class="px-desc">' + TD.esc(p.desc) + "</p>" +
      "</div>" +
      pathRing(prog) +
      "</header>";

    h += '<div class="px-meta">' +
      '<span class="pip">' + p.count + " entries</span>" +
      '<span class="pip">' + p.parts.length + " chapters</span>" +
      '<span class="pip">' + fmtMins(p.mins) + " of reading</span>" +
      (prog.started && !prog.complete ? '<span class="pip is-live">' + prog.done + " read</span>" : "") +
      (prog.complete ? '<span class="pip is-live">' + TD.icon("check") + "Finished</span>" : "") +
      "</div>";

    if (p.who || p.gain) {
      h += '<dl class="px-facts">' +
        (p.who ? "<div><dt>Read this if</dt><dd>" + TD.rich(p.who) + "</dd></div>" : "") +
        (p.gain ? "<div><dt>You come out able to</dt><dd>" + TD.rich(p.gain) + "</dd></div>" : "") +
        "</dl>";
    }

    var off = 0;
    h += '<div class="px-parts">' + p.parts.map(function (part) {
      var out = pathPart(p, part, off, prog.started && !prog.complete ? next : null);
      off += part.count;
      return out;
    }).join("") + "</div>";

    h += pathCourse(p);

    h += '<footer class="px-foot">' +
      (next
        ? '<a class="btn ' + (prog.started ? "btn-primary" : "btn-primary") + ' btn-sm" href="#/t/' + next.slug + '">' +
        (prog.started ? "Continue — " + TD.esc(next.t) : "Start reading") + TD.icon("arrowRight") + "</a>"
        : "") +
      '<span class="px-foot-n">' +
      (prog.complete ? "Every entry read. Nothing left here."
        : prog.started ? left + (left === 1 ? " entry" : " entries") + " still unread"
          : "Entries you open are ticked off automatically.") +
      "</span></footer>";

    return h + "</article>";
  }

  function pathSoonCard(p) {
    var c = TD.catById[p.cat];
    var courseName = p.course && typeof p.course === "object" ? p.course.soon
      : (p.course && TD.trackById[p.course] ? TD.trackById[p.course].short : "");
    return '<article class="px-soon" data-cat="' + p.cat + '">' +
      '<span class="px-soon-tag">Coming soon</span>' +
      '<span class="px-ico">' + TD.icon(p.icon) + "</span>" +
      "<h3>" + TD.esc(p.name) + "</h3>" +
      "<p>" + TD.esc(p.desc) + "</p>" +
      '<span class="px-soon-f">' +
      (c ? '<a class="px-soon-c" href="#/c/' + c.id + '">' + TD.icon("tag") +
        "Read the " + TD.esc(c.short) + " entries meanwhile</a>" : "") +
      (courseName ? '<span class="px-soon-w">Pairs with ' + TD.esc(courseName) + "</span>" : "") +
      "</span></article>";
  }

  function viewPaths(kind) {
    var all = TD.paths;
    var list = kind ? all.filter(function (p) { return p.kind === kind; }) : all;
    var soon = kind ? TD.soonPaths.filter(function (p) { return p.kind === kind; }) : TD.soonPaths;

    var stops = all.reduce(function (a, p) { return a + p.count; }, 0);
    var mins = all.reduce(function (a, p) { return a + p.mins; }, 0);

    /* progress across every path, and the one worth resuming */
    var readAll = 0, resume = null;
    all.forEach(function (p) {
      var g = TD.pathProgress(p);
      readAll += g.done;
      if (g.started && !g.complete && (!resume || g.pct > TD.pathProgress(resume).pct)) resume = p;
    });

    var h = '<nav class="crumbs"><a href="#/">Home</a><span class="sep">/</span>' +
      '<span class="cur">Learning Paths</span></nav>';

    h += '<header class="px-hero">' +
      '<span class="px-hero-ico">' + TD.icon("path") + "</span><div>" +
      "<h1>Learning Paths</h1>" +
      "<p>A dictionary answers the question you already knew to ask. A path tells you " +
      "which questions to ask, and in what order. Each one is a route through the " +
      "entries — assuming nothing, building in the order the ideas actually depend on " +
      "each other, and stopping when you can hold your own in the conversation.</p>" +
      '<p class="px-hero-meta">' +
      '<span class="pip">' + all.length + " paths</span>" +
      '<span class="pip">' + stops + " entries in order</span>" +
      '<span class="pip">' + fmtMins(mins) + " end to end</span>" +
      (readAll ? '<span class="pip is-live">' + readAll + " read so far</span>" : "") +
      (soon.length ? '<span class="pip is-soon">' + TD.soonPaths.length + " more coming</span>" : "") +
      "</p></div></header>";

    /* how a path differs from the A–Z, said once, at the top */
    var HOW = [
      ["list", "An order, not an index",
        "The A–Z is alphabetical, which is useless for learning. A path is in dependency order — nothing appears before the word it needs."],
      ["book", "Every stop is a full entry",
        "A step is not a summary. It is the same complete dictionary entry, with the worked example and the related terms."],
      ["check", "It remembers where you got to",
        "Open an entry and it is ticked off. Progress is kept in this browser only — nothing is sent anywhere."]
    ];
    h += '<section class="sec"><div class="lx-how">' + HOW.map(function (x) {
      return '<div class="lx-how-c"><span class="lx-how-i">' + TD.icon(x[0]) + "</span>" +
        "<h3>" + TD.esc(x[1]) + "</h3><p>" + TD.rich(x[2]) + "</p></div>";
    }).join("") + "</div></section>";

    /* pick the thread back up */
    if (resume) {
      var rp = TD.pathProgress(resume);
      var rn = TD.pathNext(resume);
      h += '<a class="px-resume" data-cat="' + resume.cat + '" href="#/t/' + rn.slug + '">' +
        '<span class="px-resume-k">' + TD.icon("spark") + "Pick it back up</span>" +
        '<span class="px-resume-p">' + TD.esc(resume.name) + " · " + rp.done + " of " + rp.total + "</span>" +
        "<strong>" + TD.esc(rn.t) + "</strong>" +
        '<span class="px-resume-d">' + TD.esc(rn.d) + "</span>" +
        '<span class="px-resume-go">Continue' + TD.icon("arrowRight") + "</span>" +
        '<span class="pg px-resume-bar"><span class="pg-fill" style="width:' + rp.pct + '%"></span></span>' +
        "</a>";
    }

    /* the filter row */
    h += '<div class="px-filters">' +
      '<a class="px-filter' + (!kind ? " is-on" : "") + '" href="#/paths">All paths<b>' +
      all.length + "</b></a>" +
      PATH_GROUPS.map(function (g) {
        var n = all.filter(function (p) { return p.kind === g.id; }).length;
        return '<a class="px-filter' + (kind === g.id ? " is-on" : "") + '" href="#/paths/' + g.id + '">' +
          TD.esc(g.n) + "<b>" + n + "</b></a>";
      }).join("") + "</div>";

    if (!list.length && !soon.length) {
      h += emptyBlock("Nothing in this group yet",
        "Every path is filed under one of the three groups above.",
        '<a class="btn btn-ghost" href="#/paths">' + TD.icon("path") + "All paths</a>");
      return h;
    }

    /* grouped, unless the reader has already picked a group */
    if (kind) {
      var g0 = pathGroup(kind);
      h += '<section class="sec">' + sectionHead(g0.n, g0.d, null, null, null) +
        '<div class="px-grid">' + list.map(pathCard).join("") + "</div></section>";
    } else {
      PATH_GROUPS.forEach(function (g) {
        var items = all.filter(function (p) { return p.kind === g.id; });
        if (!items.length) return;
        h += '<section class="sec">' + sectionHead(g.n, g.d, "#/paths/" + g.id, "Only these", null) +
          '<div class="px-grid">' + items.map(pathCard).join("") + "</div></section>";
      });
    }

    /* what is being written next */
    if (soon.length) {
      h += '<section class="sec">' +
        sectionHead("Being written next",
          "The routes below are planned and not yet published. The dictionary already covers " +
          "the ground — what is missing is the order, which is the part worth waiting for.",
          null, null, null) +
        '<div class="px-soon-grid">' + soon.map(pathSoonCard).join("") + "</div></section>";
    }

    /* the other half of the site */
    h += '<section class="sec"><div class="px-cross">' +
      '<span class="px-cross-i">' + TD.icon("code") + "</span>" +
      "<div><h3>Reading is half of it</h3>" +
      "<p>A path gives you the vocabulary. The course gives you the keyboard time — " +
      "every line explained, then drilled until you can write it from memory. " +
      "Most paths above name the track that covers the same ground in code.</p></div>" +
      '<a class="btn btn-primary btn-sm" href="#/learn">' + TD.icon("path") +
      "Learn Coding" + TD.icon("arrowRight") + "</a></div></section>";

    return h;
  }

  function viewBookmarks() {
    var terms = state.bookmarks.map(function (s) { return TD.bySlug[s]; }).filter(Boolean);
    var h = '<nav class="crumbs"><a href="#/">Home</a><span class="sep">/</span><span class="cur">Saved</span></nav>';
    h += "<h1 style=\"font-size:var(--fs-2xl);margin-bottom:8px\">Saved terms</h1>";
    h += '<p class="sec-desc" style="margin-bottom:24px">Stored in this browser only. Press <kbd>S</kbd> on any term to add it.</p>';
    if (!terms.length) {
      h += emptyBlock("Nothing saved yet", "Open a term and hit Save, or press S while reading it.",
        '<a class="btn btn-ghost" href="#/index">' + TD.icon("az") + "A–Z index</a>");
    } else {
      h += '<div class="term-grid">' + terms.map(function (t) { return termCard(t); }).join("") + "</div>";
    }
    return h;
  }

  function viewSearch(q) {
    var res = TD.search(q, { limit: 120 });
    var h = '<nav class="crumbs"><a href="#/">Home</a><span class="sep">/</span><span class="cur">Search</span></nav>';
    h += "<h1 style=\"font-size:var(--fs-2xl);margin-bottom:8px\">Results for “" + TD.esc(q) + "”</h1>";
    h += '<p class="sec-desc" style="margin-bottom:24px">' + res.length + (res.length === 1 ? " match" : " matches") + " found.</p>";
    if (!res.length) {
      h += emptyBlock("No match", "Nothing in the dictionary matches that. Check the spelling, or try a broader word.");
    } else {
      h += '<div class="term-grid">' + res.map(function (r) { return termCard(r.term, q); }).join("") + "</div>";
    }
    return h;
  }

  /* ================= case studies ================= */

  function col(id) { return TD.colById[id] || TD.collections[0]; }

  function studyCard(st) {
    var c = col(st.col);
    return '<a class="cs-card" data-col="' + st.col + '" href="#/s/' + st.slug + '">' +
      '<span class="cs-card-top"><span class="cs-card-y">' + st.y + "</span>" +
      '<span class="cs-card-c">' + TD.esc(c.short) + "</span></span>" +
      '<span class="cs-card-t">' + TD.esc(st.t) + "</span>" +
      '<span class="cs-card-s">' + TD.esc(st.s) + "</span>" +
      '<span class="cs-card-f">' + TD.icon("book") + st.rt + " min read</span></a>";
  }

  function viewStudies(filter) {
    var all = TD.studies.slice().sort(function (a, b) { return b.y - a.y; });
    var list = filter ? all.filter(function (s) { return s.col === filter; }) : all;

    var h = '<nav class="crumbs"><a href="#/">Home</a><span class="sep">/</span>' +
      '<span class="cur">Case Studies</span></nav>';

    h += '<header class="cs-hero">' +
      '<span class="cs-hero-ico">' + TD.icon("book") + "</span><div>" +
      "<h1>Case Studies</h1>" +
      "<p>The incidents, systems and papers engineers reference in conversation. " +
      "Each one is a skim in thirty seconds or a read in five minutes — what happened, " +
      "why it still gets quoted, and what to say when it comes up.</p>" +
      '<p class="cs-hero-meta"><span class="pip">' + TD.studies.length + " studies</span>" +
      '<span class="pip">' + TD.collections.length + " collections</span>" +
      '<span class="pip">' + Math.min.apply(null, all.map(function (s) { return s.y; })) +
      "–" + Math.max.apply(null, all.map(function (s) { return s.y; })) + "</span></p>" +
      "</div></header>";

    /* collection filter */
    h += '<div class="cs-filters">' +
      '<a class="cs-filter' + (!filter ? " is-on" : "") + '" href="#/studies">All' +
      '<b>' + all.length + "</b></a>" +
      TD.collections.map(function (c) {
        return '<a class="cs-filter' + (filter === c.id ? " is-on" : "") + '" data-col="' + c.id +
          '" href="#/studies/' + c.id + '"><i></i>' + TD.esc(c.short) + "<b>" + c.count + "</b></a>";
      }).join("") + "</div>";

    if (filter) {
      var cc = col(filter);
      h += '<p class="cs-coldesc" data-col="' + cc.id + '">' + TD.esc(cc.desc) + "</p>";
    }

    /* grouped by decade, newest first — the timeline spine */
    var groups = [], seen = Object.create(null);
    list.forEach(function (st) {
      var dec = Math.floor(st.y / 10) * 10;
      if (!seen[dec]) { seen[dec] = { dec: dec, items: [] }; groups.push(seen[dec]); }
      seen[dec].items.push(st);
    });

    h += '<div class="cs-timeline">' + groups.map(function (g) {
      return '<section class="cs-era">' +
        '<h2 class="cs-era-h"><span>' + g.dec + "s</span><i></i>" +
        '<b>' + g.items.length + "</b></h2>" +
        '<div class="cs-grid">' + g.items.map(studyCard).join("") + "</div></section>";
    }).join("") + "</div>";

    return h;
  }

  function viewStudy(slug) {
    var st = TD.studyBySlug[slug];
    if (!st) return viewNotFound("That case study does not exist yet.");
    var c = col(st.col);

    var siblings = TD.inCollection(st.col).sort(function (a, b) { return a.y - b.y; });
    var idx = siblings.findIndex(function (s) { return s.slug === slug; });
    var prev = idx > 0 ? siblings[idx - 1] : null;
    var next = idx >= 0 && idx < siblings.length - 1 ? siblings[idx + 1] : null;

    var h = '<article class="article cs-article" data-col="' + st.col + '">';

    h += '<nav class="crumbs"><a href="#/">Home</a><span class="sep">/</span>' +
      '<a href="#/studies">Case Studies</a><span class="sep">/</span>' +
      '<a href="#/studies/' + c.id + '">' + TD.esc(c.short) + "</a>" +
      '<span class="sep">/</span><span class="cur">' + TD.esc(st.t) + "</span></nav>";

    h += '<header class="art-head"><div class="art-tags">' +
      '<a class="pip" href="#/studies/' + c.id + '">' + TD.esc(c.name) + "</a>" +
      '<span class="lvl">' + TD.esc(st.when || String(st.y)) + "</span>" +
      '<span class="lvl">' + st.rt + " min read</span>" +
      (st.g || []).slice(0, 3).map(function (g) {
        return '<span class="lvl">' + TD.esc(g) + "</span>";
      }).join("") + "</div>";
    h += "<h1>" + TD.esc(st.t) + "</h1>";
    h += '<p class="art-def cs-deck">' + TD.esc(st.s) + "</p>";
    h += '<div class="art-actions">' +
      '<button class="btn btn-ghost btn-sm" data-act="copylink">' + TD.icon("link") + "Copy link</button>" +
      '<a class="btn btn-ghost btn-sm" href="#/studies">' + TD.icon("grid") + "All studies</a>" +
      '<button class="btn btn-ghost btn-sm" data-act="randomstudy">' + TD.icon("dice") + "Random study</button>" +
      "</div></header>";

    /* the skim layer — everything a reader needs if they stop here */
    h += TD.studySkim(st);

    /* contents rail */
    var outline = TD.studyOutline(st);
    if (outline.length > 2) {
      h += '<nav class="cs-toc" aria-label="Contents"><p class="cs-toc-k">In this study</p><ol>' +
        outline.map(function (o) {
          return '<li><a href="#' + o.id + '">' + TD.esc(o.t) + "</a></li>";
        }).join("") + "</ol></nav>";
    }

    h += '<div class="art-body cs-body">' + TD.studyBody(st) + "</div>";

    if (st.k && st.k.length) {
      h += '<h2 class="art-h2"><span class="h2-ico">' + TD.icon("spark") + "</span>What to take from it</h2>";
      h += '<ul class="kpoints">' + st.k.map(function (p) {
        return "<li><span>" + TD.rich(p) + "</span></li>";
      }).join("") + "</ul>";
    }

    /* related dictionary terms */
    var rel = (st.r || []).map(function (n) { return TD.resolve(n); }).filter(Boolean);
    if (rel.length) {
      h += '<h2 class="art-h2"><span class="h2-ico">' + TD.icon("link") + "</span>Terms in this study</h2>";
      h += '<div class="chips">' + rel.map(function (t) {
        return '<a class="chip" data-cat="' + t.c + '" href="#/t/' + t.slug + '">' +
          '<span class="chip-dot"></span>' + TD.esc(t.t) + "</a>";
      }).join("") + "</div>";
    }

    if (st.src && st.src.length) {
      h += '<h2 class="art-h2"><span class="h2-ico">' + TD.icon("book") + "</span>Sources</h2>";
      h += '<ul class="cs-src">' + st.src.map(function (s) {
        return '<li><a href="' + TD.esc(s.u) + '" target="_blank" rel="noopener noreferrer">' +
          TD.esc(s.t) + TD.icon("link") + "</a></li>";
      }).join("") + "</ul>";
    }

    h += '<nav class="art-nav" aria-label="Previous and next case study">' +
      (prev ? '<a class="art-nav-card prev" href="#/s/' + prev.slug + '"><span>Earlier · ' +
        TD.esc(c.short) + "</span><strong>" + TD.esc(prev.t) + "</strong></a>"
        : '<span class="art-nav-card is-empty"></span>') +
      (next ? '<a class="art-nav-card next" href="#/s/' + next.slug + '"><span>Later · ' +
        TD.esc(c.short) + "</span><strong>" + TD.esc(next.t) + "</strong></a>"
        : '<span class="art-nav-card is-empty"></span>') +
      "</nav>";

    return h + "</article>";
  }

  function viewNotFound(msg) {
    return '<nav class="crumbs"><a href="#/">Home</a><span class="sep">/</span><span class="cur">Not found</span></nav>' +
      emptyBlock("Not found", msg || "That page does not exist.");
  }

  /* ================= career roadmap ================= */

  function fam(id) { return TD.famById[id] || TD.families[0]; }

  /* The triage at the top of the roadmap. A grid of twenty role cards is a
     catalogue; this is the thing that turns it into an instruction. */
  function careerTriage() {
    var rows = [
      { k: "I want the AI job everyone is talking about",
        d: "Read the AI Engineer page end to end before anything else. It is the most complete page here, and it will tell you honestly whether the job is what you imagine.",
        go: "#/role/ai-engineer", cta: "Open AI Engineer", hot: true },
      { k: "I want a job as fast as realistically possible",
        d: "Data Analyst, then move inside. SQL plus spreadsheets plus clear thinking is employable in six to nine months, and it is the most reliable door into data and AI work.",
        go: "#/role/data-analyst", cta: "Open Data Analyst" },
      { k: "I want the largest number of open jobs",
        d: "Backend engineering. For every AI role posted in India there are roughly fifteen software ones, and it is also the most common route into an AI team.",
        go: "#/role/backend-engineer", cta: "Open Backend Engineer" },
      { k: "I have no idea what any of these people do",
        d: "Start with the five phases below. They are the same for every role, so you can begin before you have decided which one you want.",
        go: "#phases", cta: "Read the phases" }
    ];
    return '<div class="rm-triage cr-triage">' + rows.map(function (r) {
      return '<a class="rm-tri' + (r.hot ? " is-hot" : "") + '" href="' + r.go + '">' +
        '<span class="rm-tri-q">' + TD.esc(r.k) + "</span>" +
        '<span class="rm-tri-d">' + TD.esc(r.d) + "</span>" +
        '<span class="rm-tri-go">' + TD.esc(r.cta) + TD.icon("arrowRight") + "</span></a>";
    }).join("") + "</div>";
  }

  function viewCareers(filter) {
    var list = filter ? TD.inFamily(filter) : TD.roles;
    var totalCov = TD.roles.reduce(function (a, r) {
      var c = TD.roleCoverage(r);
      a.ready += c.ready; a.total += c.total; return a;
    }, { ready: 0, total: 0 });

    var h = '<nav class="crumbs"><a href="#/">Home</a><span class="sep">/</span>' +
      '<span class="cur">Career Roadmap</span></nav>';

    /* ---- hero ---- */
    h += '<header class="cr-hero">' +
      '<div class="cr-hero-c">' +
      '<span class="lx-eyebrow"><span class="pulse"></span>' + TD.roles.length +
      " roles · " + TD.families.length + " families · India salaries · nothing sugar-coated</span>" +
      "<h1>Pick a job. Then work backwards from it.</h1>" +
      "<p>Most people learn to code for a year and only then ask what job it leads to. " +
      "That is the wrong way round, and it is why so much of that year gets spent on the " +
      "wrong things. Start with the role, and every hour after it has a destination.</p>" +
      '<p class="cr-hero-sub">Every page here tells you what the work actually is, what a ' +
      "day looks like, which skills are genuinely non-negotiable, what it pays in India at " +
      "every level, who hires, how the interview runs, what to build, and the order to learn " +
      "it in. Where the numbers are estimates, it says so.</p>" +
      '<div class="lx-cta">' +
      '<a class="btn btn-primary" href="#/role/ai-engineer">' + TD.icon("brain") +
      "Start with AI Engineer</a>" +
      '<a class="btn btn-ghost" href="#roles">' + TD.icon("grid") + "See all " +
      TD.roles.length + " roles</a>" +
      "</div></div>" +

      '<div class="lx-hero-s">' +
      '<div class="lx-stat"><b>' + TD.roles.length + "</b><span>roles mapped</span></div>" +
      '<div class="lx-stat"><b>' + TD.careerPhases.length + "</b><span>career phases</span></div>" +
      '<div class="lx-stat"><b>' + totalCov.ready + "</b><span>steps open today</span></div>" +
      '<div class="lx-stat"><b>₹3L–4Cr</b><span>the range on offer</span></div>' +
      "</div></header>";

    /* ---- triage ---- */
    h += '<section class="sec">' +
      sectionHead("Where should you actually start?",
        "Four honest answers, depending on what you are optimising for. Pick the one that sounds like you and open that page first.",
        null, null, null) +
      careerTriage() + "</section>";

    /* ---- the phases ---- */
    h += '<section class="sec" id="phases">' +
      sectionHead("The five phases, whichever role you choose",
        "Roles differ in what you learn. Nobody differs in the order: orient, build the foundation, specialise, prove it, then run the hunt as a system. Most people stall in phase one by never finishing it.",
        null, null, null) +
      TD.phaseList() + "</section>";

    /* ---- family filter + role grid ---- */
    h += '<section class="sec" id="roles">' +
      sectionHead("Every role, with the numbers",
        "Twenty roles across five families. Each card carries entry-level pay across all company tiers and how much of its study plan is already written.",
        null, null, null);

    h += '<div class="cs-filters cr-filters">' +
      '<a class="cs-filter' + (!filter ? " is-on" : "") + '" href="#/careers">All roles' +
      "<b>" + TD.roles.length + "</b></a>" +
      TD.families.map(function (f) {
        return '<a class="cs-filter' + (filter === f.id ? " is-on" : "") + '" data-fam="' + f.id +
          '" href="#/careers/' + f.id + '"><i></i>' + TD.esc(f.short) + "<b>" + f.count + "</b></a>";
      }).join("") + "</div>";

    if (filter) {
      var ff = fam(filter);
      h += '<div class="cr-famdesc" data-fam="' + ff.id + '">' +
        '<span class="cr-famdesc-i">' + TD.icon(ff.icon) + "</span>" +
        "<div><h3>" + TD.esc(ff.name) + "</h3><p>" + TD.rich(ff.desc) + "</p></div></div>";
      h += '<div class="cr-grid">' + list.map(function (r) {
        return TD.roleCard(r);
      }).join("") + "</div>";
    } else {
      /* Grouped by family, so the shape of the industry is visible rather
         than twenty cards in one flat wall. */
      h += TD.families.map(function (f) {
        var items = TD.inFamily(f.id);
        if (!items.length) return "";
        return '<div class="cr-fam" data-fam="' + f.id + '">' +
          '<div class="cr-fam-h"><span class="cr-fam-i">' + TD.icon(f.icon) + "</span>" +
          "<div><h3>" + TD.esc(f.name) + "</h3><p>" + TD.esc(f.deck) + "</p></div>" +
          '<a class="sec-link" href="#/careers/' + f.id + '">' + items.length +
          " roles" + TD.icon("arrowRight") + "</a></div>" +
          '<div class="cr-grid">' + items.map(function (r) {
            return TD.roleCard(r);
          }).join("") + "</div></div>";
      }).join("");
    }
    h += "</section>";

    /* ---- salary comparison ---- */
    h += '<section class="sec">' +
      sectionHead("What they pay, side by side",
        "Entry-level fixed CTC in India across every company tier — from a services firm at the bottom of the bar to a global product company at the top. The bar is the range; the mark is the typical offer.",
        null, null, null) +
      TD.payCompare() +
      '<p class="cr-disclaim">' + TD.icon("bulb") + "<span>" +
      TD.rich(TD.careerGuide.payNote) + "</span></p>" +
      "</section>";

    /* ---- the playbook ---- */
    h += '<section class="sec">' +
      sectionHead("The things that are true for every one of these roles",
        "Role-specific advice lives on the role pages. This is the part nobody tells you and everybody needs.",
        null, null, null) +
      TD.playbook() + "</section>";

    /* ---- honest note about coverage ---- */
    h += '<section class="sec"><div class="cr-honest">' +
      '<span class="cr-honest-i">' + TD.icon("compass") + "</span><div>" +
      '<h3>About the <span class="cr-soon is-inline">coming soon</span> tags</h3>' +
      "<p>The study plans point at courses. <b>" + totalCov.ready + "</b> of " + totalCov.total +
      " of those steps are written and open right now; the rest are marked honestly rather " +
      "than linked to a page that does not exist. Every step still tells you exactly what to " +
      "learn and roughly when — so a plan is fully usable today whether or not the lesson " +
      "behind it is finished. Nothing here is locked.</p>" +
      '<a class="btn btn-ghost btn-sm" href="#/learn">' + TD.icon("code") +
      "See what is already written</a></div></div></section>";

    return h;
  }

  function viewRole(slug) {
    var r = TD.roleBySlug[slug];
    if (!r) return viewNotFound("That role is not mapped yet.");
    var f = fam(r.fam);
    var dem = TD.demandOf(r);
    var band = r.pay && r.pay.bands[0];
    var cov = TD.roleCoverage(r);

    var siblings = TD.inFamily(r.fam);
    var idx = siblings.indexOf(r);
    var prev = idx > 0 ? siblings[idx - 1] : null;
    var next = idx >= 0 && idx < siblings.length - 1 ? siblings[idx + 1] : null;

    var h = '<article class="article cr-article" data-fam="' + r.fam + '">';

    h += '<nav class="crumbs"><a href="#/">Home</a><span class="sep">/</span>' +
      '<a href="#/careers">Career Roadmap</a><span class="sep">/</span>' +
      '<a href="#/careers/' + f.id + '">' + TD.esc(f.short) + "</a>" +
      '<span class="sep">/</span><span class="cur">' + TD.esc(r.t) + "</span></nav>";

    /* ---- role header ---- */
    h += '<header class="cr-head">' +
      '<div class="cr-head-top"><span class="cr-head-ico">' + TD.icon(r.icon) + "</span>" +
      '<div class="art-tags">' +
      '<a class="pip" href="#/careers/' + f.id + '">' + TD.esc(f.name) + "</a>" +
      (r.tag ? '<span class="lvl is-tag">' + TD.esc(r.tag) + "</span>" : "") +
      '<span class="lvl">' + TD.esc(dem.k) + "</span>" +
      "</div></div>";

    h += "<h1>" + TD.esc(r.t) + "</h1>";
    if (r.a) h += '<p class="cr-head-a">Also posted as: ' + TD.esc(r.a) + "</p>";
    h += '<p class="art-def cr-deck">' + TD.esc(r.deck) + "</p>";

    /* The four numbers a reader wants immediately, before any prose. */
    h += '<div class="cr-facts">' +
      (band ? '<div class="cr-fact"><b>' + TD.lpa(band.lo) + "–" + TD.lpa(band.hi) +
        "</b><span>fresher CTC, India</span></div>" : "") +
      '<div class="cr-fact"><b>' + r.skillCount + "</b><span>skills mapped</span></div>" +
      '<div class="cr-fact"><b>' + r.plan.length + "</b><span>steps to job-ready</span></div>" +
      '<div class="cr-fact"><b>' + cov.ready + "/" + cov.total +
      "</b><span>courses ready now</span></div>" +
      "</div>";

    h += '<div class="art-actions">' +
      '<a class="btn btn-primary btn-sm" href="#plan">' + TD.icon("path") +
      "Jump to the study plan</a>" +
      '<button class="btn btn-ghost btn-sm" data-act="copylink">' + TD.icon("link") +
      "Copy link</button>" +
      '<a class="btn btn-ghost btn-sm" href="#/careers">' + TD.icon("grid") + "All roles</a>" +
      "</div></header>";

    /* ---- contents ---- */
    var outline = TD.roleOutline(r);
    if (outline.length > 3) {
      h += '<nav class="cs-toc cr-toc" aria-label="Contents"><p class="cs-toc-k">On this page</p><ol>' +
        outline.map(function (o) {
          return '<li><a href="#' + o.id + '">' + TD.esc(o.t) + "</a></li>";
        }).join("") + "</ol></nav>";
    }

    /* ---- body ---- */
    h += '<div class="cr-body">';
    h += TD.roleWhat(r);
    h += TD.roleDay(r);
    h += TD.roleFit(r);
    h += TD.roleSkills(r);
    h += TD.roleEdge(r);
    h += TD.rolePay(r);
    h += TD.roleLadder(r);
    h += TD.roleCompanies(r);
    h += TD.roleHire(r);
    h += TD.roleProof(r);
    h += TD.rolePlan(r);
    h += TD.roleMyths(r);
    h += "</div>";

    /* ---- adjacent roles ---- */
    var adj = (r.next || []).map(function (s) { return TD.roleBySlug[s]; }).filter(Boolean);
    if (adj.length) {
      h += '<section class="cr-sec">' +
        TD.crHead("next", "path", "If this one is not quite right",
          "the closest roles, and the ones people actually move to from here") +
        '<div class="cr-grid is-compact">' + adj.map(function (x) {
          return TD.roleCard(x, true);
        }).join("") + "</div></section>";
    }

    /* ---- dictionary terms ---- */
    var rel = (r.r || []).map(function (n) { return TD.resolve(n); }).filter(Boolean);
    if (rel.length) {
      h += '<section class="cr-sec">' +
        TD.crHead("terms", "link", "The vocabulary of this job",
          "words you will hear in the interview") +
        '<div class="chips">' + rel.map(function (t) {
          return '<a class="chip" data-cat="' + t.c + '" href="#/t/' + t.slug + '">' +
            '<span class="chip-dot"></span>' + TD.esc(t.t) + "</a>";
        }).join("") + "</div></section>";
    }

    /* ---- prev / next within the family ---- */
    h += '<nav class="art-nav" aria-label="Previous and next role">' +
      (prev ? '<a class="art-nav-card prev" href="#/role/' + prev.slug + '"><span>' +
        TD.esc(f.short) + "</span><strong>" + TD.esc(prev.t) + "</strong></a>"
        : '<span class="art-nav-card is-empty"></span>') +
      (next ? '<a class="art-nav-card next" href="#/role/' + next.slug + '"><span>' +
        TD.esc(f.short) + "</span><strong>" + TD.esc(next.t) + "</strong></a>"
        : '<span class="art-nav-card is-empty"></span>') +
      "</nav>";

    return h + "</article>";
  }

  /* ================= learn coding ================= */

  function track(id) { return TD.trackById[id] || TD.tracks[0]; }

  /* A track's completion as a single object, used by three different views
     so the arithmetic lives in exactly one place. */
  function trackProgress(tr) {
    var total = tr.count;
    var done = TD.progress.inTrack(tr.id);
    return {
      total: total,
      done: done,
      pct: total ? Math.round((done / total) * 100) : 0,
      started: done > 0,
      complete: total > 0 && done >= total
    };
  }

  function fmtMins(m) {
    if (m < 60) return m + " min";
    var h = Math.floor(m / 60), r = m % 60;
    return r ? h + " hr " + r + " min" : h + " hr";
  }

  function pgBar(p, cls) {
    return '<div class="pg ' + (cls || "") + '" role="img" aria-label="' +
      p.done + " of " + p.total + ' lessons complete">' +
      '<span class="pg-fill" style="width:' + p.pct + '%"></span></div>';
  }

  function trackCard(tr) {
    var p = trackProgress(tr);
    var next = TD.progress.next(tr.id);
    var href = p.started && next ? "#/learn/" + tr.id + "/" + next.slug : "#/learn/" + tr.id;
    return '<a class="tk-card" data-track="' + tr.id + '" href="' + href + '">' +
      '<span class="tk-top"><span class="tk-ico">' + TD.icon(tr.icon) + "</span>" +
      '<span class="tk-tag">' + TD.esc(tr.tag) + "</span></span>" +
      '<span class="tk-name">' + TD.esc(tr.short) + "</span>" +
      '<span class="tk-deck">' + TD.esc(tr.deck) + "</span>" +
      '<span class="tk-meta"><b>' + tr.count + "</b> lessons" +
      (tr.mins ? '<span class="tk-dot"></span>' + fmtMins(tr.mins) : "") + "</span>" +
      (p.started
        ? '<span class="tk-pg">' + pgBar(p) +
        '<span class="tk-pg-l">' + (p.complete ? "Complete" : p.pct + "% · continue") + "</span></span>"
        : '<span class="tk-start">Start the track' + TD.icon("arrowRight") + "</span>") +
      "</a>";
  }

  /* ---- the roadmap ----------------------------------------------------
     The Learn index used to be two grids of cards, which answered "what is
     here" and not "where do I start". This answers the second question
     first: a numbered spine, one rung per stage, in the order to take them.

     The spine is also the progress bar — each rung's connector fills to the
     completion of the tracks inside it, so the line itself shows how far up
     the ladder the reader is. */

  function stageFacts(st) {
    var rows = [
      ["You are here if", st.who],
      [st.optional ? "Skip it when" : "Safe to skip when", st.skip],
      ["You come out with", st.gets]
    ].filter(function (r) { return !!r[1]; });

    return '<dl class="rm-facts">' + rows.map(function (r) {
      return "<div><dt>" + TD.esc(r[0]) + "</dt><dd>" + TD.rich(r[1]) + "</dd></div>";
    }).join("") + "</dl>";
  }

  function roadmapStage(st, current) {
    var p = TD.stageProgress(st);
    var accent = (st.trackList[0] || {}).id || "";
    var state = p.complete ? " is-done" : (st === current ? " is-current" : "");
    if (st.optional) state += " is-optional";

    var h = '<li class="rm-stage' + state + '" data-track="' + TD.esc(accent) + '">';

    /* the rail: spine, fill, node */
    h += '<div class="rm-rail" aria-hidden="true">' +
      '<span class="rm-line"><i style="height:' + p.pct + '%"></i></span>' +
      '<span class="rm-node">' +
      (p.complete ? TD.icon("check") : st.optional ? "+" : st.n) +
      "</span></div>";

    h += '<div class="rm-body">';

    h += '<header class="rm-head">' +
      '<div class="rm-head-t">' +
      '<span class="rm-k">' + (st.optional ? "Optional branch" : "Stage " + st.n) +
      (st === current && !p.complete ? '<span class="rm-you">you are here</span>' : "") +
      "</span>" +
      "<h3>" + TD.esc(st.name) + "</h3></div>" +
      '<span class="rm-meta"><b>' + st.lessons + "</b> lessons" +
      '<span class="tk-dot"></span>' + fmtMins(st.mins) +
      (p.started ? '<span class="tk-dot"></span><b>' + p.pct + "%</b> done" : "") +
      "</span></header>";

    h += '<p class="rm-lede">' + TD.rich(st.lede) + "</p>";
    h += stageFacts(st);
    h += '<div class="rm-tracks">' + st.trackList.map(trackCard).join("") + "</div>";

    return h + "</div></li>";
  }

  /* The whole route on one line, before any scrolling — so the shape of the
     course is visible in a glance rather than assembled from six screens. */
  function roadmapRibbon(current) {
    return '<ol class="rm-ribbon" aria-label="Course route">' + TD.stages.map(function (st) {
      var p = TD.stageProgress(st);
      var cls = p.complete ? " is-done" : (st === current ? " is-current" : "");
      if (st.optional) cls += " is-optional";
      return '<li class="rm-rib' + cls + '" data-track="' +
        TD.esc((st.trackList[0] || {}).id || "") + '">' +
        '<span class="rm-rib-n">' + (p.complete ? TD.icon("check") : st.optional ? "+" : st.n) + "</span>" +
        '<span class="rm-rib-t">' + TD.esc(st.name) + "</span>" +
        '<span class="rm-rib-m">' + st.lessons + " lessons</span>" +
        "</li>";
    }).join("") + "</ol>";
  }

  /* "Which of these is you?" — the triage that turns a course index into a
     starting instruction. Each row links straight at the right lesson. */
  function roadmapTriage() {
    var first = TD.firstLesson();
    var rows = [
      { k: "I have never written a line of code",
        d: "Start at the very beginning. Nothing below assumes anything.",
        go: first ? "#/learn/" + first.track + "/" + first.slug : "#/learn/zero",
        cta: "Open lesson 1", hot: true },
      { k: "I have done tutorials but nothing sticks",
        d: "You have seen syntax without the concepts underneath. That is the usual cause, and stage 2 is the fix.",
        go: "#/learn/basics", cta: "Go to Programming Basics" },
      { k: "I can already write some code",
        d: "Skim stage 2 for the gaps, then pick a language track and take the modules you have not met.",
        go: "#/learn/python", cta: "Go to the languages" },
      { k: "I just need one specific thing",
        d: "Every track is independent once you have the basics. Jump in wherever you like.",
        go: "#/index", cta: "Browse everything" }
    ];

    return '<div class="rm-triage">' + rows.map(function (r) {
      return '<a class="rm-tri' + (r.hot ? " is-hot" : "") + '" href="' + r.go + '">' +
        '<span class="rm-tri-q">' + TD.esc(r.k) + "</span>" +
        '<span class="rm-tri-d">' + TD.esc(r.d) + "</span>" +
        '<span class="rm-tri-go">' + TD.esc(r.cta) + TD.icon("arrowRight") + "</span></a>";
    }).join("") + "</div>";
  }

  function roadmap() {
    var current = TD.currentStage();
    var first = TD.firstLesson();
    var core = TD.stages.filter(function (s) { return !s.optional; });
    var coreMins = core.reduce(function (a, s) { return a + s.mins; }, 0);

    var h = '<section class="sec rm-sec">';

    h += sectionHead("Where do I start?",
      "Read this once, top to bottom. The " + core.length + " numbered stages are in the " +
      "order they should be taken, and each one tells you how to know whether you are " +
      "standing on it, when it is safe to skip, and what you can do once you are past it.",
      null, null, null);

    h += roadmapTriage();

    /* The unmissable first step — for a reader with no progress at all.
       Once they are underway the "Where you left off" panel above says
       something truer, and showing both invites the wrong one to be clicked. */
    if (first && !TD.progress.done.length) {
      h += '<a class="rm-first" href="#/learn/' + first.track + "/" + first.slug + '">' +
        '<span class="rm-first-k">' + TD.icon("spark") + "The first thing to read</span>" +
        "<strong>" + TD.esc(first.t) + "</strong>" +
        "<span class=\"rm-first-d\">" + TD.esc(first.s) + "</span>" +
        '<span class="rm-first-go">' + fmtMins(first.mins) +
        ' · no setup needed' + TD.icon("arrowRight") + "</span></a>";
    }

    h += '<p class="rm-route-k">The whole route — ' + core.length + " stages, " +
      fmtMins(coreMins) + " of core course</p>";
    h += roadmapRibbon(current);

    h += '<ol class="rm">' + TD.stages.map(function (st) {
      return roadmapStage(st, current);
    }).join("") + "</ol>";

    return h + "</section>";
  }

  function viewLearn() {
    var totalLessons = TD.lessons.length;
    var totalMins = TD.tracks.reduce(function (a, t) { return a + t.mins; }, 0);
    var doneCount = TD.progress.done.length;
    var streak = TD.progress.streakNow();
    var stats = TD.drillStats();
    var last = TD.progress.last();
    var firstL = TD.firstLesson();

    var h = '<nav class="crumbs"><a href="#/">Home</a><span class="sep">/</span>' +
      '<span class="cur">Learn Coding</span></nav>';

    h += '<header class="lx-hero">' +
      '<div class="lx-hero-c">' +
      '<span class="lx-eyebrow"><span class="pulse"></span>' + TD.stages.length +
      " stages · " + TD.tracks.length + " tracks · " + totalLessons +
      " lessons · nothing assumed</span>" +
      "<h1>Learn to code, properly, from zero.</h1>" +
      "<p>Not a list of syntax to copy. Every line of code in this course carries the " +
      "reason it exists beside it — what it does, why it is written that way, and what " +
      "breaks if you write it differently. Then you type it until your hands know it " +
      "without you.</p>" +
      "<p class=\"lx-hero-order\">The tracks are numbered and meant to be taken in order. " +
      "If you are starting from nothing, the roadmap below tells you exactly which lesson " +
      "to open first and how to tell when you are ready for the next stage.</p>" +
      '<div class="lx-cta">' +
      (last
        ? '<a class="btn btn-primary" href="#/learn/' + last.track + '">' +
        TD.icon("path") + "Continue " + TD.esc(track(last.track).short) + "</a>"
        : '<a class="btn btn-primary" href="' + (firstL
          ? "#/learn/" + firstL.track + "/" + firstL.slug : "#/learn/zero") + '">' +
        TD.icon("terminal") + "Start at lesson one</a>") +
      '<a class="btn btn-ghost" href="#/drill">' + TD.icon("spark") + "Daily practice" +
      (stats.due ? '<span class="lx-due">' + stats.due + "</span>" : "") + "</a>" +
      "</div></div>" +

      '<div class="lx-hero-s">' +
      '<div class="lx-stat"><b>' + doneCount + "</b><span>lessons done</span></div>" +
      '<div class="lx-stat"><b>' + streak + "</b><span>day streak</span></div>" +
      '<div class="lx-stat"><b>' + stats.strong + "</b><span>lines memorised</span></div>" +
      '<div class="lx-stat"><b>' + fmtMins(totalMins) + "</b><span>of course</span></div>" +
      "</div></header>";

    /* ---- how the course works ---- */
    var HOW = [
      ["list", "Every line explained",
        "Code never appears without a reason beside it. Line 3 tells you why line 3 exists."],
      ["graph", "Syntax taken apart",
        "The parts of a line are numbered and named, so `def greet(name):` stops being a shape you copy."],
      ["terminal", "Typed until it sticks",
        "Each lesson ends with the lines it taught. Copy them, then write them again from memory alone."],
      ["compass", "Why, where and when",
        "Every track opens with what the language is for, what it is bad at, and who actually pays people to write it."]
    ];
    h += '<section class="sec"><div class="lx-how">' + HOW.map(function (x) {
      return '<div class="lx-how-c"><span class="lx-how-i">' + TD.icon(x[0]) + "</span>" +
        "<h3>" + TD.esc(x[1]) + "</h3><p>" + TD.rich(x[2]) + "</p></div>";
    }).join("") + "</div></section>";

    /* ---- continue where you left off ---- */
    if (last) {
      var lt = track(last.track);
      var nxt = TD.progress.next(last.track);
      var lp = trackProgress(lt);
      h += '<section class="sec">' +
        sectionHead("Where you left off", "Pick the thread back up.", null, null, null) +
        '<div class="lx-cont" data-track="' + lt.id + '">' +
        '<div class="lx-cont-l"><span class="lx-cont-ico">' + TD.icon(lt.icon) + "</span>" +
        "<div><p class=\"lx-cont-k\">" + TD.esc(lt.short) + " · " + lp.done + " of " + lp.total +
        " lessons</p>" +
        "<h3>" + TD.esc(nxt ? nxt.t : "Track complete") + "</h3>" +
        "<p class=\"lx-cont-d\">" + TD.esc(nxt ? nxt.s : "You have finished every lesson in this track.") +
        "</p></div></div>" +
        '<div class="lx-cont-r">' + pgBar(lp) +
        (nxt ? '<a class="btn btn-primary btn-sm" href="#/learn/' + lt.id + "/" + nxt.slug + '">' +
          "Resume" + TD.icon("arrowRight") + "</a>"
          : '<a class="btn btn-ghost btn-sm" href="#/learn">Pick a new track</a>') +
        "</div></div></section>";
    }

    /* ---- the roadmap: the order, and how to know where you are ---- */
    h += roadmap();

    /* ---- every track, for anyone who already knows what they want ---- */
    h += '<section class="sec">' +
      sectionHead("Every track, at a glance",
        "The same tracks again with the roadmap stripped out — for when you already know what you are looking for.",
        null, null, null) +
      '<div class="tk-grid">' + TD.tracks.map(trackCard).join("") + "</div></section>";

    /* ---- practice ---- */
    h += '<section class="sec">' +
      sectionHead("Practice", "Reading code and writing it are different skills. This is the second one.", null, null, null) +
      '<div class="lx-drill">' +
      '<span class="lx-drill-i">' + TD.icon("terminal") + "</span>" +
      "<div><h3>Daily drill</h3>" +
      "<p>Every line you have drilled comes back on a widening schedule — tomorrow, then " +
      "in a few days, then in a few weeks. Lines you fumbled come back sooner. " +
      (stats.total
        ? "<b>" + stats.due + "</b> of your <b>" + stats.total + "</b> lines are due now."
        : "Finish a lesson to start filling the queue.") + "</p></div>" +
      '<a class="btn ' + (stats.due ? "btn-primary" : "btn-ghost") + '" href="#/drill">' +
      (stats.due ? "Practise " + stats.due + " lines" : "Open the drill") + TD.icon("arrowRight") +
      "</a></div></section>";

    return h;
  }

  /* ---- one track: the briefing, then the syllabus ---- */

  function viewTrack(id) {
    var tr = TD.trackById[id];
    if (!tr) return viewNotFound("No such track.");
    var p = trackProgress(tr);
    var next = TD.progress.next(tr.id);
    var br = tr.brief || {};

    var h = '<div class="tkv" data-track="' + tr.id + '">';
    h += '<nav class="crumbs"><a href="#/">Home</a><span class="sep">/</span>' +
      '<a href="#/learn">Learn Coding</a><span class="sep">/</span>' +
      '<span class="cur">' + TD.esc(tr.short) + "</span></nav>";

    h += '<header class="tk-hero">' +
      '<span class="tk-hero-ico">' + TD.icon(tr.icon) + "</span>" +
      "<div class=\"tk-hero-b\">" +
      '<span class="tk-hero-tag">' + TD.esc(tr.tag) + "</span>" +
      "<h1>" + TD.esc(tr.name) + "</h1>" +
      "<p class=\"tk-hero-d\">" + TD.esc(tr.desc) + "</p>" +
      '<div class="tk-hero-meta">' +
      '<span class="pip">' + tr.count + " lessons</span>" +
      '<span class="pip">' + (tr.modules || []).length + " modules</span>" +
      '<span class="pip">' + fmtMins(tr.mins) + "</span>" +
      (br.born ? '<span class="pip">' + TD.esc(br.born) + "</span>" : "") +
      "</div>" +
      '<div class="tk-hero-go">' +
      (next
        ? '<a class="btn btn-primary" href="#/learn/' + tr.id + "/" + next.slug + '">' +
        (p.started ? "Continue — " + TD.esc(next.t) : "Start lesson 1") + TD.icon("arrowRight") + "</a>"
        : '<span class="tk-done-pill">' + TD.icon("check") + "Track complete</span>") +
      (p.started ? '<span class="tk-hero-pg">' + pgBar(p) +
        "<span>" + p.done + " of " + p.total + " done</span></span>" : "") +
      "</div></div></header>";

    /* ---- where this track sits on the roadmap ----
       A track page opened straight from a search result gives no sense of
       order. This strip restores it: which stage this is, what should have
       come first, and what follows. */
    var st = TD.stageOfTrack[tr.id];
    if (st) {
      var prev = null, nxt = null, seen = false;
      TD.stages.forEach(function (o) {
        if (o === st) { seen = true; return; }
        if (!seen && !o.optional) prev = o;
        if (seen && !nxt && !o.optional) nxt = o;
      });
      if (!nxt) nxt = TD.stages.filter(function (o) {
        return o !== st && o.i > st.i;
      })[0] || null;

      h += '<nav class="tk-where" aria-label="Where this sits in the course">' +
        '<a class="tk-where-b" href="#/learn">' + TD.icon("path") + "Roadmap</a>" +
        (prev
          ? '<span class="tk-where-s is-prev"><b>Before this</b>' +
          TD.esc("Stage " + prev.n + " · " + prev.name) + "</span>"
          : '<span class="tk-where-s is-prev"><b>Before this</b>Nothing — this is the start</span>') +
        '<span class="tk-where-s is-here"><b>' +
        (st.optional ? "Optional branch" : "Stage " + st.n) + '</b>' +
        TD.esc(st.name) + "</span>" +
        (nxt
          ? '<span class="tk-where-s is-next"><b>After this</b>' +
          TD.esc("Stage " + nxt.n + " · " + nxt.name) + "</span>"
          : '<span class="tk-where-s is-next"><b>After this</b>Build something of your own</span>') +
        "</nav>";
    }

    /* ---- the briefing ---- */
    if (br.what || br.why) {
      h += '<section class="bf">';
      h += '<h2 class="bf-h">' + TD.icon("compass") + "Before you write a line</h2>";

      if (br.feel) {
        h += '<p class="bf-feel"><span>What it feels like to write</span>' + TD.rich(br.feel) + "</p>";
      }

      if (br.what) {
        h += '<div class="bf-block"><h3>What it actually is</h3>' +
          br.what.map(function (x) { return "<p>" + TD.rich(x) + "</p>"; }).join("") + "</div>";
      }
      if (br.why) {
        h += '<div class="bf-block"><h3>Why it was invented</h3>' +
          br.why.map(function (x) { return "<p>" + TD.rich(x) + "</p>"; }).join("") + "</div>";
      }

      if (br.good || br.bad) {
        h += '<div class="bf-two">';
        if (br.good) {
          h += '<div class="bf-col is-good"><h3>' + TD.icon("check") + "Genuinely good at</h3><ul>" +
            br.good.map(function (x) { return "<li>" + TD.rich(x) + "</li>"; }).join("") + "</ul></div>";
        }
        if (br.bad) {
          h += '<div class="bf-col is-bad"><h3>' + TD.icon("close") + "The wrong tool for</h3><ul>" +
            br.bad.map(function (x) { return "<li>" + TD.rich(x) + "</li>"; }).join("") + "</ul></div>";
        }
        h += "</div>";
      }

      if (br.used) {
        h += '<div class="bf-block"><h3>Where you will actually meet it</h3>' +
          '<ul class="bf-used">' + br.used.map(function (u) {
            return "<li><b>" + TD.esc(u.w) + "</b><span>" + TD.rich(u.d) + "</span></li>";
          }).join("") + "</ul></div>";
      }

      if (br.build) {
        h += '<div class="bf-build"><h3>' + TD.icon("spark") + "What you will be able to build</h3><ul>" +
          br.build.map(function (x) { return "<li>" + TD.rich(x) + "</li>"; }).join("") + "</ul></div>";
      }

      h += "</section>";
    }

    /* ---- the syllabus ---- */
    h += '<section class="sy"><h2 class="sy-h">' + TD.icon("path") + "The syllabus</h2>";

    var n = 0;
    (tr.modules || []).forEach(function (m) {
      var lessons = TD.inModule(tr.id, m.id);
      var mdone = lessons.filter(function (L) { return TD.progress.isDone(L.key); }).length;
      h += '<section class="sy-mod' + (lessons.length ? "" : " is-soon") + '">' +
        '<header class="sy-mod-h"><span class="sy-mod-n">' + m.n + "</span><div>" +
        "<h3>" + TD.esc(m.name) + "</h3><p>" + TD.esc(m.desc) + "</p></div>" +
        '<span class="sy-mod-c">' +
        (lessons.length
          ? (mdone === lessons.length && lessons.length
            ? TD.icon("check") + "done"
            : mdone + " / " + lessons.length)
          : "writing") +
        "</span></header>";

      if (!lessons.length) {
        h += '<p class="sy-soon">Lessons for this module are being written.</p></section>';
        return;
      }

      h += '<ol class="sy-list">' + lessons.map(function (L) {
        n++;
        var done = TD.progress.isDone(L.key);
        return '<li class="sy-item' + (done ? " is-done" : "") + '">' +
          '<a href="#/learn/' + tr.id + "/" + L.slug + '">' +
          '<span class="sy-n">' + (done ? TD.icon("check") : n) + "</span>" +
          '<span class="sy-b"><span class="sy-t">' + TD.esc(L.t) + "</span>" +
          '<span class="sy-d">' + TD.esc(L.s) + "</span></span>" +
          '<span class="sy-m"><span class="lvl" data-lvl="' + L.lvl + '">' +
          levelLabel(L.lvl) + "</span><span class=\"sy-min\">" + L.mins + " min</span></span>" +
          "</a></li>";
      }).join("") + "</ol></section>";
    });

    h += "</section>";

    /* ---- what to read next ---- */
    var others = TD.tracks.filter(function (t) { return t.id !== tr.id; }).slice(0, 3);
    if (others.length) {
      h += '<section class="sec">' +
        sectionHead("Other tracks", "When you are done here.", "#/learn", "All tracks", null) +
        '<div class="tk-grid">' + others.map(trackCard).join("") + "</div></section>";
    }

    return h + "</div>";
  }

  /* ---- one lesson ---- */

  function viewLesson(trackId, slug) {
    var tr = TD.trackById[trackId];
    if (!tr) return viewNotFound("No such track.");
    var L = TD.lesson(trackId, slug);
    if (!L) return viewNotFound("That lesson does not exist yet.");

    var order = TD.trackOrder(trackId);
    var idx = order.findIndex(function (x) { return x.key === L.key; });
    var prev = idx > 0 ? order[idx - 1] : null;
    var next = idx >= 0 && idx < order.length - 1 ? order[idx + 1] : null;
    state.lessonNav = { prev: prev, next: next, track: trackId };

    var mod = tr.modIndex[L.m];
    var done = TD.progress.isDone(L.key);

    var h = '<article class="article ln-article" data-track="' + trackId +
      '" data-key="' + TD.esc(L.key) + '">';

    h += '<nav class="crumbs"><a href="#/">Home</a><span class="sep">/</span>' +
      '<a href="#/learn">Learn</a><span class="sep">/</span>' +
      '<a href="#/learn/' + tr.id + '">' + TD.esc(tr.short) + "</a>" +
      '<span class="sep">/</span><span class="cur">' + TD.esc(L.t) + "</span></nav>";

    h += '<header class="art-head"><div class="art-tags">' +
      (mod ? '<a class="pip" href="#/learn/' + tr.id + '">' + TD.esc(mod.name) + "</a>" : "") +
      '<span class="lvl" data-lvl="' + L.lvl + '">' + levelLabel(L.lvl) + "</span>" +
      '<span class="lvl">' + L.mins + " min</span>" +
      '<span class="lvl">lesson ' + (idx + 1) + " of " + order.length + "</span>" +
      "</div>";
    h += "<h1>" + TD.esc(L.t) + "</h1>";
    h += '<p class="art-def">' + TD.rich(L.s) + "</p>";
    h += '<div class="art-actions">' +
      '<button class="btn ' + (done ? "btn-ghost" : "btn-primary") + ' btn-sm" data-act="lesson-done" ' +
      'data-key="' + TD.esc(L.key) + '">' + TD.icon(done ? "check" : "bookmark") +
      "<span>" + (done ? "Completed" : "Mark complete") + "</span></button>" +
      '<button class="btn btn-ghost btn-sm" data-act="copylink">' + TD.icon("link") + "Copy link</button>" +
      '<a class="btn btn-ghost btn-sm" href="#/learn/' + tr.id + '">' + TD.icon("list") + "Syllabus</a>" +
      "</div></header>";

    h += TD.lessonGoals(L);

    var outline = TD.lessonOutline(L);
    if (outline.length > 2) {
      h += '<nav class="cs-toc" aria-label="Contents"><p class="cs-toc-k">In this lesson</p><ol>' +
        outline.map(function (o) {
          return '<li><a href="#' + o.id + '">' + TD.esc(o.t) + "</a></li>";
        }).join("") + "</ol></nav>";
    }

    h += '<div class="art-body ln-body">' + TD.lessonBody(L) + "</div>";

    if (L.k && L.k.length) {
      h += '<h2 class="art-h2"><span class="h2-ico">' + TD.icon("bulb") + "</span>Remember this much</h2>";
      h += '<ul class="kpoints">' + L.k.map(function (p) {
        return "<li><span>" + TD.rich(p) + "</span></li>";
      }).join("") + "</ul>";
    }

    /* the practice panel mounts here after render */
    if (L.drill && L.drill.items && L.drill.items.length) {
      h += '<div id="drillMount" class="ln-drill-mount"></div>';
    }

    var rel = (L.r || []).map(function (r) { return TD.resolve(r); }).filter(Boolean);
    if (rel.length) {
      h += '<h2 class="art-h2"><span class="h2-ico">' + TD.icon("link") + "</span>These words in the dictionary</h2>";
      h += '<div class="chips">' + rel.map(function (t) {
        return '<a class="chip" data-cat="' + t.c + '" href="#/t/' + t.slug + '">' +
          '<span class="chip-dot"></span>' + TD.esc(t.t) + "</a>";
      }).join("") + "</div>";
    }

    h += '<nav class="art-nav" aria-label="Previous and next lesson">' +
      (prev ? '<a class="art-nav-card prev" href="#/learn/' + trackId + "/" + prev.slug +
        '"><span>Previous</span><strong>' + TD.esc(prev.t) + "</strong></a>"
        : '<span class="art-nav-card is-empty"></span>') +
      (next ? '<a class="art-nav-card next" href="#/learn/' + trackId + "/" + next.slug +
        '"><span>Next</span><strong>' + TD.esc(next.t) + "</strong></a>"
        : '<a class="art-nav-card next" href="#/learn/' + trackId +
        '"><span>Finished the track</span><strong>Back to the syllabus</strong></a>') +
      "</nav></article>";

    return h;
  }

  /* ---- the daily drill ---- */

  function viewDrill() {
    var stats = TD.drillStats();
    var due = TD.dueCards(24);
    var streak = TD.progress.streakNow();
    var speed = TD.speedStats();
    var slow = TD.slowCards(12);

    var h = '<nav class="crumbs"><a href="#/">Home</a><span class="sep">/</span>' +
      '<a href="#/learn">Learn</a><span class="sep">/</span>' +
      '<span class="cur">Daily drill</span></nav>';

    h += '<header class="dl-hero">' +
      '<span class="dl-hero-i">' + TD.icon("terminal") + "</span><div>" +
      "<h1>Daily drill</h1>" +
      "<p>The lines you have already learned, brought back exactly when you are " +
      "about to forget them. Anything you fumble drops down the schedule and " +
      "returns tomorrow; anything you nail moves further out each time.</p>" +
      '<div class="dl-stats">' +
      '<span class="pip"><b>' + stats.due + "</b> due now</span>" +
      '<span class="pip"><b>' + stats.strong + "</b> well known</span>" +
      '<span class="pip"><b>' + stats.total + "</b> in the deck</span>" +
      '<span class="pip"><b>' + streak + "</b> day streak</span>" +
      (speed.timed ? '<span class="pip is-speed">' + TD.icon("gauge") +
        "<b>" + speed.median + "</b> cpm typical</span>" : "") +
      "</div></div></header>";

    if (!stats.total) {
      h += emptyBlock("Nothing in the deck yet",
        "Finish a lesson and clear its practice panel — those lines land here automatically.",
        '<a class="btn btn-primary" href="#/learn/zero">' + TD.icon("terminal") + "Start at Ground Zero</a>");
      return h;
    }

    if (!due.length) {
      h += '<div class="dl-clear"><span>' + TD.icon("check") + "</span>" +
        "<h3>Nothing is due right now</h3>" +
        "<p>Every line in your deck is still fresh. Come back tomorrow, or push " +
        "further into a track and give the deck something new.</p>" +
        '<a class="btn btn-ghost" href="#/learn">' + TD.icon("path") + "Back to the tracks</a></div>";
      /* An empty review queue is exactly when there is time to work on speed,
         so the invitation belongs here rather than only above a due list. */
      h += speedInvite(slow, speed);
      return h;
    }

    h += speedInvite(slow, speed);
    h += '<div id="drillMount" class="dl-mount"></div>';
    return h;
  }

  /* Three is enough to be worth a session. The median moves as the reader
     improves, so this queue is never empty for long -- and gating it higher
     would hide the feature from exactly the people who have just started
     timing and would benefit most. */
  function speedInvite(slow, speed) {
    if (slow.length < 3) return "";
    return '<div class="dl-speed">' +
      '<span class="dl-speed-i">' + TD.icon("gauge") + "</span>" +
      "<div><h3>Speed run &mdash; " + slow.length + " lines you know but type slowly</h3>" +
      "<p>Lines you can already recall, ranked by how far below your own " +
      "typical " + speed.median + " cpm they sit. Recall is not the problem here; " +
      "fluency is.</p></div>" +
      '<a class="btn btn-primary btn-sm" href="#/speed/slow">' +
      TD.icon("spark") + "Run it</a></div>";
  }

  /* ================= question banks ================= */

  /* The bank index. Built from TD.quizTracks(), so a bank written for a
     third track appears here with no edit to this function. */
  function viewQuizIndex() {
    var tracks = TD.quizTracks();

    var h = '<nav class="crumbs"><a href="#/">Home</a><span class="sep">/</span>' +
      '<a href="#/learn">Learn</a><span class="sep">/</span>' +
      '<span class="cur">Question bank</span></nav>';

    var total = TD.quizzes.length;
    var missed = TD.quizMissed.list().length;

    h += '<header class="qh">' +
      '<span class="qh-i">' + TD.icon("quiz") + "</span><div>" +
      "<h1>Question bank</h1>" +
      "<p>Every chapter that is tested rather than built, as questions rather than " +
      "prose. Answer one and the worked solution opens underneath it — the letter " +
      "of the answer teaches nothing, so you get the method instead.</p>" +
      '<div class="qh-pips">' +
      '<span class="pip"><b>' + total + "</b> questions</span>" +
      '<span class="pip"><b>' + tracks.length + "</b> banks</span>" +
      (missed ? '<span class="pip"><b>' + missed + "</b> to revisit</span>" : "") +
      "</div></div></header>";

    if (missed) {
      h += '<a class="qz-wrongcard" href="#/quiz/wrong">' +
        '<span class="qz-wrongcard-i">' + TD.icon("target") + "</span><div>" +
        "<h3>Practise your mistakes</h3>" +
        "<p>The " + missed + " question" + (missed === 1 ? "" : "s") +
        " you last got wrong, from every chapter. This is the highest-value " +
        "revision set you have, because you built it yourself.</p></div>" +
        '<span class="qz-wrongcard-go">' + TD.icon("arrowRight") + "</span></a>";
    }

    var hard = TD.mcqHard().length;
    if (hard) {
      h += '<a class="qz-wrongcard is-hard" href="#/quiz/hardcore">' +
        '<span class="qz-wrongcard-i">' + TD.icon("flame") + "</span><div>" +
        "<h3>The hardcore set</h3>" +
        "<p>The " + hard + " questions written so that knowing the topic is not " +
        "enough — every wrong option is a mistake somebody actually makes. " +
        "Collected from every chapter and shuffled.</p></div>" +
        '<span class="qz-wrongcard-go">' + TD.icon("arrowRight") + "</span></a>";
    }

    h += '<div class="qb-grid">' + tracks.map(function (tr) {
      var st = TD.quizScore.track(tr.id);
      return '<a class="qb-card" href="#/quiz/' + tr.id + '" style="--c:' + tr.col + '">' +
        '<span class="qb-card-i">' + TD.icon(tr.icon) + "</span>" +
        "<h3>" + TD.esc(tr.short) + "</h3>" +
        "<p>" + TD.esc(tr.deck) + "</p>" +
        '<div class="qb-card-m">' +
        '<span class="pip">' + st.questions + " questions</span>" +
        '<span class="pip">' + st.chapters + " chapters</span>" +
        (st.attempted
          ? '<span class="pip is-on">' + st.avg + "% average</span>"
          : '<span class="pip">not started</span>') +
        "</div></a>";
    }).join("") + "</div>";

    return h;
  }

  /* The chapters of one bank. */
  function viewQuizTrack(trackId) {
    var tr = TD.trackById[trackId];
    if (!tr) return viewNotFound("No question bank for that track.");
    var chapters = TD.quizChapters(trackId);
    if (!chapters.length) return viewNotFound("That bank has no questions yet.");

    var st = TD.quizScore.track(trackId);
    var missed = TD.quizMissed.list(trackId).length;

    var h = '<div class="qbv" style="--c:' + tr.col + '">';
    h += '<nav class="crumbs"><a href="#/">Home</a><span class="sep">/</span>' +
      '<a href="#/quiz">Question bank</a><span class="sep">/</span>' +
      '<span class="cur">' + TD.esc(tr.short) + "</span></nav>";

    h += '<header class="qh">' +
      '<span class="qh-i">' + TD.icon(tr.icon) + "</span><div>" +
      "<h1>" + TD.esc(tr.short) + " — question bank</h1>" +
      "<p>" + TD.esc(tr.deck) + "</p>" +
      '<div class="qh-pips">' +
      '<span class="pip"><b>' + st.questions + "</b> questions</span>" +
      '<span class="pip"><b>' + st.chapters + "</b> chapters</span>" +
      '<span class="pip"><b>' + st.attempted + "</b> attempted</span>" +
      (st.attempted ? '<span class="pip is-on"><b>' + st.avg + "%</b> average</span>" : "") +
      "</div>" +
      '<div class="qh-go">' +
      '<a class="btn btn-ghost btn-sm" href="#/learn/' + tr.id + '">' +
      TD.icon("book") + "Read the lessons</a>" +
      (missed ? '<a class="btn btn-ghost btn-sm" href="#/quiz/wrong/' + tr.id + '">' +
        TD.icon("target") + "Practise my " + missed + " mistakes</a>" : "") +
      (TD.mcqHard(tr.id).length
        ? '<a class="btn btn-ghost btn-sm" href="#/quiz/hardcore/' + tr.id + '">' +
        TD.icon("flame") + "Hardcore only <b>" + TD.mcqHard(tr.id).length + "</b></a>"
        : "") +
      "</div></div></header>";

    h += '<ol class="qb-chaps">' + chapters.map(function (c) {
      var rec = TD.quizScore.get(trackId, c.id);
      var band = !rec ? "" : rec.best >= 80 ? " is-strong" : rec.best >= 55 ? " is-mid" : " is-weak";
      return '<li class="qb-chap' + band + '">' +
        '<a href="#/quiz/' + trackId + "/" + c.id + '">' +
        '<span class="qb-chap-n">' + c.n + "</span>" +
        '<span class="qb-chap-b"><span class="qb-chap-t">' + TD.esc(c.name) + "</span>" +
        '<span class="qb-chap-d">' + TD.esc(c.desc) + "</span></span>" +
        '<span class="qb-chap-m">' +
        (rec ? '<span class="qb-best">' + rec.best + "%</span>" : "") +
        '<span class="qb-count">' + c.count + " Q</span>" +
        "</span></a>" +
        '<a class="qb-chap-test" href="#/quiz/' + trackId + "/" + c.id + '/test" ' +
        'title="Timed test — answers stay hidden until you submit">' + TD.icon("clock") + "Test</a>" +
        "</li>";
    }).join("") + "</ol>";

    return h + "</div>";
  }

  /* One chapter, in practice or test mode. */
  function viewQuizChapter(trackId, modId, mode) {
    var tr = TD.trackById[trackId];
    if (!tr) return viewNotFound("No such bank.");
    var mod = tr.modIndex[modId];
    var qs = TD.mcqIn(trackId, modId);
    if (!qs.length) return viewNotFound("That chapter has no questions yet.");

    var chapters = TD.quizChapters(trackId);
    var idx = -1;
    chapters.forEach(function (c, i) { if (c.id === modId) idx = i; });
    var next = idx >= 0 && idx < chapters.length - 1 ? chapters[idx + 1] : null;
    state.quizNav = { track: trackId, mod: modId, mode: mode, next: next };

    var rec = TD.quizScore.get(trackId, modId);
    var tags = TD.mcqTags(trackId, modId);

    var h = '<div class="qcv" style="--c:' + tr.col + '">';
    h += '<nav class="crumbs"><a href="#/">Home</a><span class="sep">/</span>' +
      '<a href="#/quiz">Question bank</a><span class="sep">/</span>' +
      '<a href="#/quiz/' + trackId + '">' + TD.esc(tr.short) + "</a>" +
      '<span class="sep">/</span><span class="cur">' + TD.esc(mod ? mod.name : modId) + "</span></nav>";

    h += '<header class="art-head"><div class="art-tags">' +
      '<span class="pip">Chapter ' + (mod ? mod.n : idx + 1) + "</span>" +
      '<span class="lvl">' + qs.length + " questions</span>" +
      (rec ? '<span class="lvl">best ' + rec.best + "%</span>" : "") +
      '<span class="lvl" data-lvl="' + (mode === "test" ? "advanced" : "core") + '">' +
      (mode === "test" ? "Test mode" : "Practice mode") + "</span>" +
      "</div>";
    h += "<h1>" + TD.esc(mod ? mod.name : modId) + "</h1>";
    if (mod) h += '<p class="art-def">' + TD.rich(mod.desc) + "</p>";

    h += '<div class="art-actions">' +
      (mode === "test"
        ? '<a class="btn btn-ghost btn-sm" href="#/quiz/' + trackId + "/" + modId + '">' +
        TD.icon("quiz") + "Practice mode</a>"
        : '<a class="btn btn-ghost btn-sm" href="#/quiz/' + trackId + "/" + modId + '/test">' +
        TD.icon("clock") + "Take it as a test</a>") +
      '<a class="btn btn-ghost btn-sm" href="#/learn/' + trackId + '">' +
      TD.icon("book") + "The lessons</a>" +
      "</div></header>";

    h += '<p class="qc-how">' +
      (mode === "test"
        ? "Answers and solutions stay hidden until you submit. A clock is running — that is the point."
        : "Pick an answer and the solution opens underneath, with the working. " +
        "Or press <b>Reveal answer</b> to see it without committing.") +
      "</p>";

    if (tags.length > 1) {
      h += '<div class="qc-tags"><span class="qc-tags-k">' + TD.icon("tag") + "Topics in this chapter</span>" +
        tags.map(function (t) {
          return '<span class="qc-tag">' + TD.esc(t.t) + "<b>" + t.n + "</b></span>";
        }).join("") + "</div>";
    }

    h += '<div id="quizMount"></div>';

    h += '<nav class="art-nav" aria-label="Previous and next chapter">' +
      (idx > 0
        ? '<a class="art-nav-card prev" href="#/quiz/' + trackId + "/" + chapters[idx - 1].id +
        '"><span>Previous chapter</span><strong>' + TD.esc(chapters[idx - 1].name) + "</strong></a>"
        : '<span class="art-nav-card is-empty"></span>') +
      (next
        ? '<a class="art-nav-card next" href="#/quiz/' + trackId + "/" + next.id +
        '"><span>Next chapter</span><strong>' + TD.esc(next.name) + "</strong></a>"
        : '<a class="art-nav-card next" href="#/quiz/' + trackId +
        '"><span>Last chapter</span><strong>Back to the bank</strong></a>') +
      "</nav>";

    return h + "</div>";
  }

  /* The mistakes set — every question last answered wrongly. */
  /* ---- the gauntlet ---------------------------------------------------
     Every hardcore question in the product, in one place, shuffled.

     It exists because the hardcore questions are the ones worth repeating
     and the ones a reader is least likely to meet enough of: four in one
     chapter, three in another, and the trap never gets drilled. Collected,
     they become the thing you run the night before an exam. */

  function viewQuizHard(trackId, mode) {
    var tr = trackId ? TD.trackById[trackId] : null;
    var qs = TD.mcqHard(trackId);
    var groups = TD.mcqHardTracks();

    var h = '<nav class="crumbs"><a href="#/">Home</a><span class="sep">/</span>' +
      '<a href="#/quiz">Question bank</a><span class="sep">/</span>' +
      '<span class="cur">Hardcore</span></nav>';

    h += '<header class="qh is-hard">' +
      '<span class="qh-i">' + TD.icon("flame") + "</span><div>" +
      "<h1>The hardcore set" + (tr ? " — " + TD.esc(tr.short) : "") + "</h1>" +
      "<p>Every question in the product marked <b>hardcore</b>, shuffled into one " +
      "run. These are not questions with harder facts in them. They are questions " +
      "built around the wrong answer — the one a reader who half-knows the topic " +
      "reaches for first — so scoring badly here tells you something a chapter " +
      "score cannot.</p>" +
      '<div class="qh-pips"><span class="pip"><b>' + qs.length + "</b> questions</span>" +
      '<span class="pip"><b>' + groups.length + "</b> banks</span>" +
      "</div>";

    if (qs.length) {
      h += '<div class="qh-go">' +
        (mode === "test"
          ? '<a class="btn btn-ghost btn-sm" href="#/quiz/hardcore' + (trackId ? "/" + trackId : "") + '">' +
          TD.icon("quiz") + "Practice mode</a>"
          : '<a class="btn btn-ghost btn-sm" href="#/quiz/hardcore' + (trackId ? "/" + trackId : "") + '/test">' +
          TD.icon("clock") + "Take it as a test</a>") +
        (trackId
          ? '<a class="btn btn-ghost btn-sm" href="#/quiz/hardcore">' + TD.icon("grid") + "All banks</a>"
          : groups.map(function (g) {
            return '<a class="btn btn-ghost btn-sm" href="#/quiz/hardcore/' + g.track.id + '">' +
              TD.icon(g.track.icon) + TD.esc(g.track.short) + " <b>" + g.qs.length + "</b></a>";
          }).join("")) +
        "</div>";
    }
    h += "</div></header>";

    if (!qs.length) {
      h += emptyBlock("No hardcore questions here yet",
        "Nothing in this bank is marked hardcore. Try the full set, or work a chapter normally.",
        '<a class="btn btn-primary" href="#/quiz">' + TD.icon("quiz") + "Open the question bank</a>");
      return h;
    }

    h += '<p class="qc-how">' +
      (mode === "test"
        ? "Solutions stay hidden until you submit, and the clock is running. " +
        "Anything above 60% on this set is a good score."
        : "Answer and the solution opens underneath, including <b>why the tempting " +
        "option is tempting</b> — which is the part worth reading even when you got " +
        "it right.") +
      "</p>";

    return h + '<div id="quizMount"></div>';
  }

  function viewQuizWrong(trackId) {
    var tr = trackId ? TD.trackById[trackId] : null;
    var qs = TD.quizMissed.list(trackId);

    var h = '<nav class="crumbs"><a href="#/">Home</a><span class="sep">/</span>' +
      '<a href="#/quiz">Question bank</a><span class="sep">/</span>' +
      '<span class="cur">My mistakes</span></nav>';

    h += '<header class="qh">' +
      '<span class="qh-i">' + TD.icon("target") + "</span><div>" +
      "<h1>Practise your mistakes</h1>" +
      "<p>Every question you last answered wrongly" +
      (tr ? " in " + TD.esc(tr.short) : "") +
      ". Get one right here and it leaves the set; get it wrong again and it stays. " +
      "This is the only revision list worth keeping.</p>" +
      '<div class="qh-pips"><span class="pip"><b>' + qs.length + "</b> questions</span></div>" +
      "</div></header>";

    if (!qs.length) {
      h += emptyBlock("Nothing to revisit",
        "You have no outstanding mistakes. Work through a chapter and anything you miss lands here automatically.",
        '<a class="btn btn-primary" href="#/quiz">' + TD.icon("quiz") + "Open the question bank</a>");
      return h;
    }

    state.quizNav = { track: trackId, mod: null, mode: "practice", next: null };
    return h + '<div id="quizMount"></div>';
  }

  /* ================= speaking ================= */

  function viewSpeakIndex() {
    var sup = TD.speech.support();
    var sum = TD.speakScore.summary();
    var groups = TD.speakGroups();

    var h = '<nav class="crumbs"><a href="#/">Home</a><span class="sep">/</span>' +
      '<a href="#/learn">Learn</a><span class="sep">/</span>' +
      '<span class="cur">Speaking</span></nav>';

    h += '<header class="qh is-speak">' +
      '<span class="qh-i">' + TD.icon("mic") + "</span><div>" +
      "<h1>Speaking sessions</h1>" +
      "<p>Reading about speaking changes nothing. These sessions listen to you: " +
      "you say the line or answer the question out loud, and the page reports back " +
      "what it actually heard — your accuracy, your pace, the fillers you did not " +
      "know you used, and the points you meant to make and did not.</p>" +
      '<div class="qh-pips">' +
      '<span class="pip"><b>' + sum.total + "</b> sessions</span>" +
      '<span class="pip"><b>' + TD.speakSessions.reduce(function (n, S) { return n + S.acts.length; }, 0) +
      "</b> activities</span>" +
      (sum.done ? '<span class="pip is-on"><b>' + sum.avg + "</b> average score</span>" : "") +
      "</div></div></header>";

    h += '<div class="sp-cap' + (sup.rec ? " is-ok" : " is-warn") + '">' +
      (sup.rec ? TD.icon("mic") : TD.icon("micOff")) + "<div>" +
      "<b>" + (sup.rec ? "Speech recognition is available in this browser" : "No speech recognition in this browser") + "</b>" +
      "<span>" + (sup.rec
        ? "Your voice is transcribed by the browser itself and analysed on this page. Nothing is uploaded and no recording is kept — the only thing stored is a score."
        : TD.esc(sup.why) + " Every session still works: say your answer aloud, type what you said, and the pace, filler, coverage and accuracy analysis all run unchanged.") +
      "</span></div></div>";

    groups.forEach(function (g) {
      h += '<section class="sp-group">' +
        '<h2 class="sp-group-h">' + (g.n ? '<span class="sp-group-n">' + g.n + "</span>" : "") +
        TD.esc(g.name) + "</h2>" +
        (g.desc ? '<p class="sp-group-d">' + TD.esc(g.desc) + "</p>" : "") +
        '<div class="sp-cards">' + g.list.map(function (S) {
          var rec = TD.speakScore.get(S.slug);
          return '<a class="sp-card' + (rec ? " is-done" : "") + '" href="#/speak/' + S.slug + '">' +
            '<span class="sp-card-i">' + TD.icon(S.icon) + "</span>" +
            '<span class="sp-card-b"><span class="sp-card-t">' + TD.esc(S.t) + "</span>" +
            '<span class="sp-card-s">' + TD.esc(S.s) + "</span>" +
            '<span class="sp-card-m">' +
            '<span class="pip">' + S.acts.length + " activities</span>" +
            '<span class="pip">' + S.mins + " min</span>" +
            '<span class="lvl" data-lvl="' + S.lvl + '">' + levelLabel(S.lvl) + "</span>" +
            (rec ? '<span class="pip is-on">best ' + rec.best + "</span>" : "") +
            "</span></span></a>";
        }).join("") + "</div></section>";
    });

    return h;
  }

  function viewSpeakSession(slug) {
    var S = TD.speakBySlug[slug];
    if (!S) return viewNotFound("That speaking session does not exist.");

    var all = TD.speakSessions;
    var i = all.indexOf(S);
    var next = i >= 0 && i < all.length - 1 ? all[i + 1] : null;
    state.speakNav = { next: next };

    var rec = TD.speakScore.get(slug);
    var tr = TD.trackById.english;
    var mod = tr && tr.modIndex[S.m];

    var h = '<article class="spv">';
    h += '<nav class="crumbs"><a href="#/">Home</a><span class="sep">/</span>' +
      '<a href="#/speak">Speaking</a><span class="sep">/</span>' +
      '<span class="cur">' + TD.esc(S.t) + "</span></nav>";

    h += '<header class="art-head"><div class="art-tags">' +
      (mod ? '<span class="pip">' + TD.esc(mod.name) + "</span>" : "") +
      '<span class="lvl" data-lvl="' + S.lvl + '">' + levelLabel(S.lvl) + "</span>" +
      '<span class="lvl">' + S.acts.length + " activities</span>" +
      '<span class="lvl">' + S.mins + " min</span>" +
      (rec ? '<span class="lvl">best ' + rec.best + "</span>" : "") +
      "</div>";
    h += "<h1>" + TD.esc(S.t) + "</h1>";
    h += '<p class="art-def">' + TD.rich(S.s) + "</p></header>";

    if (S.why) {
      h += '<aside class="ln-ana"><span class="ln-ana-m" aria-hidden="true">' +
        TD.icon("compass") + "</span><div>" +
        '<p class="ln-ana-t">Why this one matters</p>' +
        '<p class="ln-ana-b">' + TD.rich(S.why) + "</p></div></aside>";
    }

    if (S.goal && S.goal.length) {
      h += '<section class="ln-goal">' +
        '<p class="ln-goal-k">' + TD.icon("target") + "By the end of this session you can</p><ul>" +
        S.goal.map(function (g) { return "<li>" + TD.rich(g) + "</li>"; }).join("") +
        "</ul></section>";
    }

    if (S.coach && S.coach.length) {
      h += '<section class="sp-coach"><h2 class="sp-coach-h">' + TD.icon("bulb") +
        "Before you start</h2><ul>" +
        S.coach.map(function (c) { return "<li>" + TD.rich(c) + "</li>"; }).join("") +
        "</ul></section>";
    }

    h += '<div id="speakMount"></div>';

    h += '<nav class="art-nav" aria-label="Other sessions">' +
      (i > 0
        ? '<a class="art-nav-card prev" href="#/speak/' + all[i - 1].slug +
        '"><span>Previous session</span><strong>' + TD.esc(all[i - 1].t) + "</strong></a>"
        : '<span class="art-nav-card is-empty"></span>') +
      (next
        ? '<a class="art-nav-card next" href="#/speak/' + next.slug +
        '"><span>Next session</span><strong>' + TD.esc(next.t) + "</strong></a>"
        : '<a class="art-nav-card next" href="#/speak"><span>Last session</span>' +
        "<strong>Back to the index</strong></a>") +
      "</nav>";

    return h + "</article>";
  }

  /* ================= code dojo ================= */

  /* Filters live on state rather than in the hash: they are a working
     preference, not a place, and putting them in the URL would fill the back
     button with noise on the way to one problem. */

  function codeFilters() {
    if (!state.codeF) state.codeF = { q: "", diff: {}, status: null, company: "" };
    return state.codeF;
  }

  function kataPasses(K) {
    var f = codeFilters();
    if (f.q) {
      var hay = (K.title + " " + K.pattern + " " + K.companies.join(" ") + " " + K.diff).toLowerCase();
      if (hay.indexOf(f.q) < 0) return false;
    }
    var picked = Object.keys(f.diff).filter(function (d) { return f.diff[d]; });
    if (picked.length && picked.indexOf(K.diff) < 0) return false;
    if (f.company && K.companies.indexOf(f.company) < 0) return false;
    var r = TD.kataScore.get(K.id);
    if (f.status === "todo" && r && r.status === "solved") return false;
    if (f.status === "flagged" && !(r && r.flag)) return false;
    return true;
  }

  function freqBars(n) {
    var h = '<span class="dj-freq" title="Asked in interviews: ' + n + ' of 5">';
    for (var i = 1; i <= 5; i++) h += "<i" + (i <= n ? ' class="on"' : "") + "></i>";
    return h + "</span>";
  }

  function kataRow(K) {
    var r = TD.kataScore.get(K.id) || {};
    var dot = "dj-dot" + (r.status === "solved" ? " is-solved" : r.status ? " is-attempted" : "");
    return '<li><a class="dj-row" data-kata="' + K.id + '" href="#/code/' + K.id + '">' +
      '<span class="' + dot + '" aria-hidden="true"></span>' +
      '<span class="dj-row-t">' + TD.esc(K.title) +
      (r.flag ? ' <span class="dj-flagmark">' + TD.icon("starOn") + "</span>" : "") + "</span>" +
      '<span class="dj-row-co">' + K.companies.slice(0, 3).map(function (c) {
        return "<span>" + TD.esc(c) + "</span>";
      }).join("") + "</span>" +
      freqBars(K.freq) +
      '<span class="lvl" data-lvl="' + K.lvl + '">' + K.diff + "</span></a></li>";
  }

  function kataListHtml() {
    var groups = TD.kataPatterns();
    var shown = 0, h = "";

    groups.forEach(function (g) {
      var list = g.list.filter(kataPasses);
      if (!list.length) return;
      shown += list.length;
      var solved = list.filter(function (K) { return TD.kataScore.status(K.id) === "solved"; }).length;
      h += '<section class="dj-group"><div class="dj-group-h"><h2>' + TD.esc(g.name) +
        '</h2><span class="rule"></span><b>' + solved + "/" + list.length + "</b></div>" +
        '<ul class="dj-list">' + list.map(kataRow).join("") + "</ul></section>";
    });

    if (!shown) {
      h = '<div class="dj-empty">Nothing matches those filters. ' +
        "Clear one and the list comes back.</div>";
    }
    return { html: h, n: shown };
  }

  function viewCodeIndex() {
    var s = TD.kataScore.summary();

    var h = '<nav class="crumbs"><a href="#/">Home</a><span class="sep">/</span>' +
      '<span class="cur">Code Dojo</span></nav>';

    h += '<header class="qh">' +
      '<span class="qh-i">' + TD.icon("pen") + "</span><div>" +
      "<h1>Code Dojo</h1>" +
      "<p>Reading a solution and producing one under pressure are different " +
      "skills, and only the second gets interviewed. So you write these out. " +
      "Under the cursor sits a faded blueprint of the reference — type over it, " +
      "and the colour solidifies as you get it right. Then turn the blueprint " +
      "down to an outline, then off, and find out what you actually know.</p>" +
      '<div class="qh-pips">' +
      '<span class="pip"><b>' + s.total + "</b> problems</span>" +
      '<span class="pip"><b>' + TD.kataPatterns().length + "</b> patterns</span>" +
      (s.solved ? '<span class="pip"><b>' + s.solved + "</b> solved</span>" : "") +
      (s.minutes ? '<span class="pip"><b>' + s.minutes + "m</b> at the keyboard</span>" : "") +
      "</div></div></header>";

    var f = codeFilters();
    h += '<div class="dj-filters" id="djFilters">' +
      '<input class="dj-search" id="djSearch" type="search" placeholder="Search title, pattern or company…" ' +
      'autocomplete="off" value="' + TD.esc(f.q) + '" aria-label="Search problems">' +
      ["Easy", "Medium", "Hard"].map(function (d) {
        return '<button type="button" class="dj-chip" data-diff="' + d + '" aria-pressed="' +
          (f.diff[d] ? "true" : "false") + '">' + d + "</button>";
      }).join("") +
      '<button type="button" class="dj-chip" data-status="todo" aria-pressed="' +
      (f.status === "todo") + '">Unsolved</button>' +
      '<button type="button" class="dj-chip" data-status="flagged" aria-pressed="' +
      (f.status === "flagged") + '">Flagged</button>' +
      '<select class="dj-chip" id="djCompany" aria-label="Filter by company">' +
      '<option value="">All companies</option>' +
      TD.kataCompanies().map(function (c) {
        return '<option value="' + TD.esc(c.name) + '"' + (f.company === c.name ? " selected" : "") +
          ">" + TD.esc(c.name) + " (" + c.n + ")</option>";
      }).join("") +
      "</select>" +
      '<span class="dj-count" id="djCount"></span></div>';

    var built = kataListHtml();
    h += '<div id="djList">' + built.html + "</div>";
    return h;
  }

  function viewCodeProblem(id) {
    var K = TD.kataById[id];
    if (!K) return viewNotFound();

    var h = '<nav class="crumbs"><a href="#/">Home</a><span class="sep">/</span>' +
      '<a href="#/code">Code Dojo</a><span class="sep">/</span>' +
      '<span class="cur">' + TD.esc(K.title) + "</span></nav>";

    h += '<header class="qh">' +
      '<span class="qh-i">' + TD.icon("pen") + "</span><div>" +
      "<h1>" + TD.esc(K.title) + "</h1>" +
      '<div class="qh-pips">' +
      '<span class="lvl" data-lvl="' + K.lvl + '">' + K.diff + "</span>" +
      '<span class="pip">' + TD.esc(K.pattern) + "</span>" +
      '<span class="pip">' + freqBars(K.freq) + " asked</span>" +
      K.companies.map(function (c) { return '<span class="pip">' + TD.esc(c) + "</span>"; }).join("") +
      "</div></div></header>";

    h += '<div class="dj-brief"><p>' + TD.rich(K.statement) + "</p>";

    if (K.context) {
      h += '<p class="dj-lab">Given to you</p><pre class="dj-given">' +
        TD.pyBlock(K.context) + "</pre>";
    }

    if (K.examples.length) {
      h += '<p class="dj-lab">Examples</p>' + K.examples.map(function (e) {
        return '<div class="dj-ex"><div><u>in  </u>' + TD.esc(e[0]) + "</div>" +
          '<div><u>out </u><span class="o">' + TD.esc(e[1]) + "</span></div>" +
          (e[2] ? '<div class="n">' + TD.esc(e[2]) + "</div>" : "") + "</div>";
      }).join("");
    }

    if (K.constraints.length) {
      h += '<p class="dj-lab">Constraints</p><ul class="dj-cons">' +
        K.constraints.map(function (c) { return "<li>" + TD.esc(c) + "</li>"; }).join("") +
        "</ul>";
    }
    h += "</div>";

    h += '<div id="dojoMount"></div>';

    var prev = TD.katas[K.i - 1], next = TD.katas[K.i + 1];
    h += '<div class="dj-nav">' +
      (prev ? '<a class="btn btn-ghost btn-sm" href="#/code/' + prev.id + '">' +
        TD.icon("arrowLeft") + TD.esc(prev.title) + "</a>" : "<span></span>") +
      (next ? '<a class="btn btn-ghost btn-sm" href="#/code/' + next.id + '">' +
        TD.esc(next.title) + TD.icon("arrowRight") + "</a>" : "<span></span>") +
      "</div>";

    return h;
  }

  function wireCodeIndex() {
    var box = $("#djFilters");
    if (!box) return;

    function redraw() {
      var built = kataListHtml();
      $("#djList").innerHTML = built.html;
      $("#djCount").textContent = built.n + " shown";
    }

    $("#djSearch").addEventListener("input", function () {
      codeFilters().q = this.value.trim().toLowerCase();
      redraw();
    });

    $("#djCompany").addEventListener("change", function () {
      codeFilters().company = this.value;
      redraw();
    });

    box.addEventListener("click", function (e) {
      var chip = e.target.closest(".dj-chip");
      if (!chip || chip.tagName === "SELECT") return;
      var f = codeFilters();
      if (chip.getAttribute("data-diff")) {
        var d = chip.getAttribute("data-diff");
        f.diff[d] = !f.diff[d];
        chip.setAttribute("aria-pressed", f.diff[d] ? "true" : "false");
      } else {
        var st = chip.getAttribute("data-status");
        f.status = f.status === st ? null : st;
        $$("[data-status]", box).forEach(function (c) {
          c.setAttribute("aria-pressed", c.getAttribute("data-status") === f.status ? "true" : "false");
        });
      }
      redraw();
    });

    redraw();
  }

  function wireCodeProblem(r) {
    var mount = $("#dojoMount");
    var K = TD.kataById[r.id];
    if (mount && K) TD.mountDojo(mount, K);
  }

  /* ================= router ================= */

  function parseHash() {
    var raw = location.hash.replace(/^#/, "");
    if (!raw || raw === "/") return { name: "home" };
    /* a second # inside the fragment addresses an element within the view,
       the way #/paths/start#p-frontend lands on one card of the index */
    var at = raw.indexOf("#");
    var frag = at >= 0 ? raw.slice(at + 1) : null;
    if (at >= 0) raw = raw.slice(0, at);
    var parts = raw.replace(/^\//, "").split("/");
    if (parts[0] === "paths") {
      return { name: "paths", kind: parts[1] ? decodeURIComponent(parts[1]) : null, anchor: frag };
    }
    if (parts[0] === "t" && parts[1]) return { name: "term", slug: decodeURIComponent(parts[1]) };
    if (parts[0] === "c" && parts[1]) return { name: "category", id: decodeURIComponent(parts[1]) };
    if (parts[0] === "index") return { name: "index" };
    if (parts[0] === "learn") {
      if (parts[1] && parts[2]) {
        return { name: "lesson", track: decodeURIComponent(parts[1]), slug: decodeURIComponent(parts[2]) };
      }
      if (parts[1]) return { name: "track", id: decodeURIComponent(parts[1]) };
      return { name: "learn" };
    }
    if (parts[0] === "careers") {
      return { name: "careers", fam: parts[1] ? decodeURIComponent(parts[1]) : null };
    }
    if (parts[0] === "role" && parts[1]) return { name: "role", slug: decodeURIComponent(parts[1]) };
    if (parts[0] === "drill") return { name: "drill" };
    if (parts[0] === "cards") {
      return { name: "cards", kind: parts[1] === "formulas" ? "formulas" : "patterns" };
    }
    if (parts[0] === "plan") {
      if (parts[1]) return { name: "journey", id: decodeURIComponent(parts[1]) };
      return { name: "plans" };
    }
    if (parts[0] === "speed") {
      if (parts[1] === "slow") return { name: "speedSlow" };
      if (parts[1]) return { name: "speedSet", id: decodeURIComponent(parts[1]) };
      return { name: "speed" };
    }
    if (parts[0] === "logic") {
      if (parts[1]) return { name: "logicShelf", id: decodeURIComponent(parts[1]), anchor: frag };
      return { name: "logic" };
    }
    if (parts[0] === "code") {
      if (parts[1]) return { name: "codeProblem", id: decodeURIComponent(parts[1]) };
      return { name: "code" };
    }
    if (parts[0] === "quiz") {
      /* #/quiz/wrong and #/quiz/wrong/<track> are checked before the
         track form, so a bank can never be named "wrong". */
      if (parts[1] === "wrong") {
        return { name: "quizWrong", track: parts[2] ? decodeURIComponent(parts[2]) : null };
      }
      /* #/quiz/hardcore and #/quiz/hardcore/<track> — same reservation as
         "wrong": checked first, so no bank may be named "hardcore". */
      if (parts[1] === "hardcore") {
        return {
          name: "quizHard",
          track: parts[2] ? decodeURIComponent(parts[2]) : null,
          mode: parts[3] === "test" ? "test" : "practice"
        };
      }
      if (parts[1] && parts[2]) {
        return {
          name: "quizChapter",
          track: decodeURIComponent(parts[1]),
          mod: decodeURIComponent(parts[2]),
          mode: parts[3] === "test" ? "test" : "practice"
        };
      }
      if (parts[1]) return { name: "quizTrack", track: decodeURIComponent(parts[1]) };
      return { name: "quiz" };
    }
    if (parts[0] === "speak") {
      if (parts[1]) return { name: "speakSession", slug: decodeURIComponent(parts[1]) };
      return { name: "speak" };
    }
    if (parts[0] === "projects") return { name: "projects", domain: parts[1] ? decodeURIComponent(parts[1]) : null };
    if (parts[0] === "guides") {
      if (parts[1]) return { name: "guide", id: decodeURIComponent(parts[1]) };
      return { name: "guides" };
    }
    if (parts[0] === "project" && parts[1]) return { name: "project", slug: decodeURIComponent(parts[1]) };
    if (parts[0] === "interviews") return { name: "interviews" };
    if (parts[0] === "interview" && parts[1]) return { name: "interview", companyId: decodeURIComponent(parts[1]) };
    if (parts[0] === "research") return { name: "research", tab: parts[1] ? decodeURIComponent(parts[1]) : null };
    if (parts[0] === "studies") return { name: "studies", col: parts[1] ? decodeURIComponent(parts[1]) : null };
    if (parts[0] === "s" && parts[1]) return { name: "study", slug: decodeURIComponent(parts[1]) };
    if (parts[0] === "bookmarks") return { name: "bookmarks" };
    if (parts[0] === "search" && parts[1]) return { name: "search", q: decodeURIComponent(parts.slice(1).join("/")) };
    if (parts[0].indexOf("az-") === 0) return { name: "index", anchor: parts[0] };
    return { name: "notfound" };
  }

  function render() {
    var curHash = location.hash || "#/";
    var isSameRoute = (prevRouteHash === curHash);
    var currentYBeforeRender = window.scrollY || document.documentElement.scrollTop || 0;
    if (prevRouteHash && !isSameRoute) {
      scrollPositions[prevRouteHash] = currentYBeforeRender;
    }

    var r = parseHash();
    /* Leaving a speaking session mid-take must release the microphone.
       Without this the browser's recording indicator stays lit after
       navigation, which is alarming and entirely our fault. */
    if (TD.speakCleanup) { TD.speakCleanup(); TD.speakCleanup = null; }
    /* the dojo runs a clock and listens on the document while mounted */
    if (TD.dojoCleanup) { TD.dojoCleanup(); TD.dojoCleanup = null; }
    if (TD.speech) TD.speech.hush();
    state.route = r;
    var html;
    switch (r.name) {
      case "home":
        html = TD.viewLanding ? TD.viewLanding() : "";
        document.title = "CoreDumps — The Engineer's Technical Dictionary";
        break;
      case "category":
        html = viewCategory(r.id);
        document.title = (TD.catById[r.id] ? TD.catById[r.id].name : "Category") + " — CoreDumps";
        break;
      case "term":
        html = viewTerm(r.slug);
        document.title = (TD.bySlug[r.slug] ? TD.bySlug[r.slug].t : "Term") + " — CoreDumps";
        break;
      case "index": html = viewIndex(); document.title = "A–Z Index — CoreDumps"; break;
      case "paths": html = viewPaths(r.kind); document.title = "Learning Paths — CoreDumps"; break;
      case "learn": html = viewLearn(); document.title = "Learn Coding — CoreDumps"; break;
      case "track":
        html = viewTrack(r.id);
        document.title = (TD.trackById[r.id] ? TD.trackById[r.id].short : "Track") + " — Learn — CoreDumps";
        break;
      case "lesson":
        html = viewLesson(r.track, r.slug);
        var _L = TD.lesson(r.track, r.slug);
        document.title = (_L ? _L.t : "Lesson") + " — CoreDumps";
        break;
      case "careers":
        html = viewCareers(r.fam);
        document.title = (r.fam && TD.famById[r.fam] ? TD.famById[r.fam].name + " careers" : "Career Roadmap") + " — CoreDumps";
        break;
      case "role":
        html = viewRole(r.slug);
        document.title = (TD.roleBySlug[r.slug] ? TD.roleBySlug[r.slug].t + " — Career Roadmap" : "Role") + " — CoreDumps";
        break;
      case "drill": html = viewDrill(); document.title = "Daily drill — CoreDumps"; break;
      case "cards":
        html = r.kind === "formulas"
          ? (TD.viewFormulaCard ? TD.viewFormulaCard() : "")
          : (TD.viewCueCard ? TD.viewCueCard() : "");
        document.title = (r.kind === "formulas" ? "AI formula card" : "Pattern cue card") +
          " — CoreDumps";
        break;
      case "plans":
        html = TD.viewJourneys ? TD.viewJourneys() : "";
        document.title = "Your plan — CoreDumps";
        break;
      case "journey":
        html = TD.viewJourney ? TD.viewJourney(r.id) : "";
        document.title = (TD.journeyById[r.id] ? TD.journeyById[r.id].short : "Plan") +
          " — CoreDumps";
        break;
      case "speed":
        html = TD.viewSpeed ? TD.viewSpeed() : "";
        document.title = "Speed Coding — CoreDumps";
        break;
      case "speedSet":
        html = TD.viewSpeedSet ? TD.viewSpeedSet(r.id) : "";
        document.title = (TD.speedSetById[r.id] ? TD.speedSetById[r.id].name : "Speed") +
          " — CoreDumps";
        break;
      case "speedSlow":
        html = TD.viewSpeedSlow ? TD.viewSpeedSlow() : "";
        document.title = "Your slow lines — CoreDumps";
        break;
      case "logic":
        html = TD.viewLogic ? TD.viewLogic() : "";
        document.title = "Loops & Logics — CoreDumps";
        break;
      case "logicShelf":
        html = TD.viewLogicShelf ? TD.viewLogicShelf(r.id) : "";
        document.title = (TD.logicShelfById[r.id] ? TD.logicShelfById[r.id].name : "Logic") +
          " — CoreDumps";
        break;
      case "code": html = viewCodeIndex(); document.title = "Code Dojo — CoreDumps"; break;
      case "codeProblem":
        html = viewCodeProblem(r.id);
        document.title = (TD.kataById[r.id] ? TD.kataById[r.id].title : "Code Dojo") + " — CoreDumps";
        break;
      case "quiz": html = viewQuizIndex(); document.title = "Question bank — CoreDumps"; break;
      case "quizTrack":
        html = viewQuizTrack(r.track);
        document.title = (TD.trackById[r.track] ? TD.trackById[r.track].short : "Bank") + " questions — CoreDumps";
        break;
      case "quizChapter":
        html = viewQuizChapter(r.track, r.mod, r.mode);
        var qtr = TD.trackById[r.track];
        var qmod = qtr && qtr.modIndex[r.mod];
        document.title = (qmod ? qmod.name : "Chapter") + " — CoreDumps";
        break;
      case "quizWrong": html = viewQuizWrong(r.track); document.title = "My mistakes — CoreDumps"; break;
      case "quizHard": html = viewQuizHard(r.track, r.mode); document.title = "The hardcore set — CoreDumps"; break;
      case "speak": html = viewSpeakIndex(); document.title = "Speaking sessions — CoreDumps"; break;
      case "speakSession":
        html = viewSpeakSession(r.slug);
        document.title = (TD.speakBySlug[r.slug] ? TD.speakBySlug[r.slug].t : "Session") + " — CoreDumps";
        break;
      case "guides":
        html = TD.viewGuides ? TD.viewGuides() : "";
        document.title = "Guides — CoreDumps";
        break;
      case "guide":
        html = TD.viewGuide ? TD.viewGuide(r.id) : "";
        var _g = TD.guideById && TD.guideById(r.id);
        document.title = (_g ? _g.t : "Guide") + " — CoreDumps";
        break;
      case "projects":
        html = TD.viewProjects ? TD.viewProjects(r.domain) : "<div>Project Lab Loading...</div>";
        document.title = "Engineering Project Lab — CoreDumps";
        break;
      case "project":
        html = TD.viewProject ? TD.viewProject(r.slug) : "<div>Project Loading...</div>";
        var _proj = TD.projectById && TD.projectById[r.slug];
        document.title = (_proj ? _proj.title + " — Project Blueprint" : "Project Blueprint") + " — CoreDumps";
        break;
      case "interviews":
        html = TD.viewInterviews ? TD.viewInterviews() : "<div>Interviews Loading...</div>";
        document.title = "Interview Bank — CoreDumps";
        break;
      case "interview":
        html = TD.viewCompanyQuestions ? TD.viewCompanyQuestions(r.companyId) : "<div>Interview Bank Loading...</div>";
        /* The AI-engineer track is not a company, so fall back to a readable
           label rather than showing the raw slug. */
        var _comp = (TD.companyById && TD.companyById[r.companyId]) || null;
        var _ivTitle = _comp
          ? _comp.name + " interview questions"
          : (r.companyId === "ai-engineer" ? "AI Engineer track" : "Interview bank");
        document.title = _ivTitle + " — CoreDumps";
        break;
      case "research":
        html = TD.viewResearch ? TD.viewResearch(r.tab) : "<div>Research Hub Loading...</div>";
        document.title = "Research Hub & Paper Writing Academy — CoreDumps";
        break;
      case "studies":
        html = viewStudies(r.col);
        document.title = (r.col && TD.colById[r.col] ? TD.colById[r.col].name : "Case Studies") + " — CoreDumps";
        break;
      case "study":
        html = viewStudy(r.slug);
        document.title = (TD.studyBySlug[r.slug] ? TD.studyBySlug[r.slug].t : "Case study") + " — CoreDumps";
        break;
      case "bookmarks": html = viewBookmarks(); document.title = "Saved — CoreDumps"; break;
      case "search": html = viewSearch(r.q); document.title = '"' + r.q + '" — CoreDumps'; break;
      default: html = viewNotFound(); document.title = "Not found — CoreDumps";
    }

    view.innerHTML = html;
    view.classList.remove("view-enter");
    void view.offsetWidth;
    view.classList.add("view-enter");

    markActiveNav(r);
    wireView(r);
    closeSidebar();

    if (r.name === "logicShelf" && r.anchor) {
      var deck = document.getElementById(r.anchor);
      if (deck) deck.scrollIntoView({ block: "start" });
      else window.scrollTo({ top: 0, behavior: "auto" });
    } else if (r.name === "paths" && r.anchor) {
      var card = document.getElementById(r.anchor);
      if (card) card.scrollIntoView({ block: "start" });
      else window.scrollTo({ top: 0, behavior: "auto" });
    } else if (r.name === "index" && r.anchor) {
      var target = document.getElementById(r.anchor);
      if (target) target.scrollIntoView();
    } else if (isSameRoute) {
      /* In-page interaction (filter chips, OS toggle, progress tick, reset): preserve position */
      window.scrollTo({ top: currentYBeforeRender, behavior: "instant" });
    } else {
      var savedPos = scrollPositions[curHash];
      var cardInfo = cardClicksByHash && cardClicksByHash[curHash];
      var restoreY = null;
      var clickedHref = null;

      if (cardInfo && cardInfo.scrollY > 0) {
        restoreY = cardInfo.scrollY;
        clickedHref = cardInfo.targetHref;
      } else if (lastCardClick && lastCardClick.fromHash === curHash) {
        restoreY = lastCardClick.scrollY;
        clickedHref = lastCardClick.targetHref;
      } else if (savedPos != null && (isPopNav || savedPos > 0)) {
        restoreY = savedPos;
      }

      if (restoreY != null && restoreY > 0) {
        restoreScrollPos(restoreY, clickedHref);
      } else {
        window.scrollTo({ top: 0, behavior: "auto" });
      }
    }

    isPopNav = false;
    prevRouteHash = curHash;
    updateProgress();
    /* move focus to the main region for screen readers on route change */
    if (render._booted) $("#main").focus({ preventScroll: true });
    render._booted = true;
  }

  function markActiveNav(r) {
    $$(".side-link").forEach(function (a) {
      a.classList.remove("is-active");
      var nav = a.getAttribute("data-nav");
      var catId = a.getAttribute("data-catid");
      if (nav && nav === r.name) a.classList.add("is-active");
      if (nav === "home" && r.name === "home") a.classList.add("is-active");
      if (nav === "projects" && (r.name === "projects" || r.name === "project")) a.classList.add("is-active");
      if (nav === "interviews" && (r.name === "interviews" || r.name === "interview")) a.classList.add("is-active");
      if (nav === "research" && r.name === "research") a.classList.add("is-active");
      /* a single study belongs under the Case Studies nav entry */
      if (nav === "studies" && r.name === "study") a.classList.add("is-active");
      /* a role page belongs under Career Roadmap */
      if (nav === "careers" && r.name === "role") a.classList.add("is-active");
      /* tracks, lessons and the drill all live under Learn Coding */
      if (nav === "plan" && (r.name === "plans" || r.name === "journey")) {
        a.classList.add("is-active");
      }
      if (nav === "speed" && (r.name === "speed" || r.name === "speedSet" ||
        r.name === "speedSlow")) {
        a.classList.add("is-active");
      }
      if (nav === "learn" && (r.name === "track" || r.name === "lesson" ||
        r.name === "drill")) {
        a.classList.add("is-active");
      }
      /* a chapter, a mistakes set and a bank all live under Question bank */
      if (nav === "quiz" && (r.name === "quizTrack" || r.name === "quizChapter" || r.name === "quizHard" ||
        r.name === "quizWrong")) {
        a.classList.add("is-active");
      }
      if (nav === "speak" && r.name === "speakSession") a.classList.add("is-active");
      /* a single problem belongs under Code Dojo */
      if (nav === "code" && (r.name === "code" || r.name === "codeProblem")) a.classList.add("is-active");
      /* a shelf belongs under the Loops & Logics nav entry */
      if (nav === "logic" && (r.name === "logic" || r.name === "logicShelf")) {
        a.classList.add("is-active");
      }
      if (catId && ((r.name === "category" && r.id === catId) ||
        (r.name === "term" && TD.bySlug[r.slug] && TD.bySlug[r.slug].c === catId))) {
        a.classList.add("is-active");
      }
    });
  }

  /* ================= per-view wiring ================= */

  function wireView(r) {
    clearHomeTimers();
    if (r.name === "category") wireCategoryFilter();
    if (r.name === "home") wireHome();
    /* Guides use the same [data-rise] reveal the landing page does, and that
       class starts at opacity 0. Without mounting the motion layer here the
       steps would never become visible at all. */
    if ((r.name === "guides" || r.name === "guide") && TD.mountGuides) TD.mountGuides();
    if (r.name === "lesson") wireLessonDrill(r);
    /* Run buttons on Python blocks. Nothing is downloaded until one is
       clicked, so this stays free for a reader who only wants to read. */
    if (TD.wireRunners) TD.wireRunners($("#view"));
    if (r.name === "drill") wireDailyDrill();
    if ((r.name === "speedSet" || r.name === "speedSlow") && TD.wireSpeed) TD.wireSpeed(r);
    if ((r.name === "plans" || r.name === "journey") && TD.wireJourney) TD.wireJourney(render);
    if ((r.name === "logic" || r.name === "logicShelf") && TD.wireLogic) TD.wireLogic(render);
    if (r.name === "cards" && TD.wireCards) TD.wireCards();
    if (r.name === "quizChapter") wireQuiz(r);
    if (r.name === "quizWrong") wireQuizWrong(r);
    if (r.name === "quizHard") wireQuizHard(r);
    if (r.name === "speakSession") wireSpeak(r);
    if (r.name === "code") wireCodeIndex();
    if (r.name === "codeProblem") wireCodeProblem(r);
  }

  /* The quiz runner owns interactive state, so like the drill panel it is
     mounted into a placeholder rather than rendered into the view string. */
  function wireQuiz(r) {
    var mount = $("#quizMount");
    if (!mount) return;
    var qs = TD.mcqIn(r.track, r.mod);
    if (!qs.length) return;
    var nav = state.quizNav || {};
    TD.mountQuiz(mount, qs, {
      mode: r.mode,
      track: r.track,
      mod: r.mod,
      nextHref: nav.next ? "#/quiz/" + r.track + "/" + nav.next.id : "#/quiz/" + r.track,
      nextLabel: nav.next ? "Next chapter" : "Back to the bank",
      wrongHref: "#/quiz/wrong/" + r.track
    });
  }

  function wireQuizWrong(r) {
    var mount = $("#quizMount");
    if (!mount) return;
    var qs = TD.quizMissed.list(r.track);
    if (!qs.length) return;
    TD.mountQuiz(mount, qs, {
      mode: "practice",
      nextHref: r.track ? "#/quiz/" + r.track : "#/quiz",
      nextLabel: "Back to the bank"
    });
  }

  function wireQuizHard(r) {
    var mount = $("#quizMount");
    if (!mount) return;
    var qs = TD.mcqHard(r.track);
    if (!qs.length) return;
    /* Shuffled on mount, unlike a chapter. A chapter is written to be read
       in order; the gauntlet is a mixed bag by definition, and drawing the
       same forty in the same sequence every time teaches the sequence. */
    TD.mountQuiz(mount, TD.shuffleQs(qs), {
      mode: r.mode,
      nextHref: r.track ? "#/quiz/" + r.track : "#/quiz",
      nextLabel: "Back to the bank",
      wrongHref: "#/quiz/wrong" + (r.track ? "/" + r.track : "")
    });
  }

  function wireSpeak(r) {
    var mount = $("#speakMount");
    if (!mount) return;
    var S = TD.speakBySlug[r.slug];
    if (!S) return;
    var nav = state.speakNav || {};
    TD.mountSpeak(mount, S, {
      nextHref: nav.next ? "#/speak/" + nav.next.slug : "#/speak",
      nextLabel: nav.next ? "Next session" : "Back to the index"
    });
  }

  /* The practice panel is mounted rather than rendered into the view string,
     because it owns interactive state and needs its own root element. */
  function wireLessonDrill(r) {
    var mount = $("#drillMount");
    if (!mount) return;
    var L = TD.lesson(r.track, r.slug);
    if (!L) return;
    var nav = state.lessonNav || {};
    TD.mountDrill(mount, TD.drillCards(L), {
      mode: "lesson",
      reps: (L.drill && L.drill.reps) || 3,
      t: (L.drill && L.drill.t) || "Burn it in",
      sub: (L.drill && L.drill.sub) ||
        "Type each line until your hands know it without you. Copy it first, then write it from memory.",
      lessonKey: L.key,
      nextHref: nav.next ? "#/learn/" + r.track + "/" + nav.next.slug : "#/learn/" + r.track,
      nextLabel: nav.next ? "Next lesson" : "Back to the syllabus",
      onDone: function () {
        var btn = $('[data-act="lesson-done"]');
        if (btn && TD.progress.isDone(L.key)) {
          btn.className = "btn btn-ghost btn-sm";
          btn.innerHTML = TD.icon("check") + "<span>Completed</span>";
        }
      }
    });
  }

  function wireDailyDrill() {
    var mount = $("#drillMount");
    if (!mount) return;
    TD.mountDrill(mount, TD.dueCards(24), {
      mode: "daily",
      start: "recall",
      t: "Today's review",
      sub: "The line is hidden. Write each one from its description alone — that is the whole test."
    });
  }

  /* ================= home page behaviour ================= */

  var homeTimers = [];
  var homeRaf = null;

  /* #view survives every route change, so anything the landing page bound to
     it or to window has to be released by hand or it stacks. */
  function clearHomeTimers() {
    homeTimers.forEach(function (id) { clearInterval(id); });
    homeTimers = [];
    if (homeRaf) { cancelAnimationFrame(homeRaf); homeRaf = null; }
    if (TD.unmountLanding) TD.unmountLanding();
  }

  function reducedMotion() {
    return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }

  /* The landing page owns its own motion; app.js only still owns the search
     field, because the suggestion list is built from the same search index
     the command palette uses and there should be one of those, not two. */
  function wireHome() {
    wireHeroFind();
    if (TD.mountLanding) TD.mountLanding();
  }

  /* The hero field is the page's primary action. It answers inline rather than
     throwing the reader into a modal on the second keystroke — the palette is
     still one Enter away, so there is one search experience, not two. */
  function wireHeroFind() {
    var wrap = $("#heroFind");
    var form = $("#heroSearch");
    var input = $("#heroSearchInput");
    var panel = $("#heroSug");
    var list = $("#heroSugList");
    if (!wrap || !form || !input || !panel || !list) return;

    var results = [], active = -1, open = false;

    function close() {
      if (!open) return;
      open = false;
      panel.hidden = true;
      active = -1;
      input.setAttribute("aria-expanded", "false");
      input.removeAttribute("aria-activedescendant");
    }

    function mark(i) {
      active = i;
      $$(".hero-sug-item", list).forEach(function (el, n) {
        var on = n === i;
        el.classList.toggle("is-active", on);
        el.setAttribute("aria-selected", on ? "true" : "false");
        if (on) {
          input.setAttribute("aria-activedescendant", el.id);
          if (el.scrollIntoView) el.scrollIntoView({ block: "nearest" });
        }
      });
      if (i < 0) input.removeAttribute("aria-activedescendant");
    }

    function draw(q) {
      /* lessons, then studies, then terms — one list, each row carrying its
         own href. Lessons lead because someone typing "for loop" into the
         home search almost always wants to be taught it, not defined it. */
      var lessons = TD.searchLessons(q, 2).map(function (r) {
        var lt = TD.trackById[r.lesson.track] || {};
        return {
          href: "#/learn/" + r.lesson.track + "/" + r.lesson.slug,
          tone: r.lesson.track,
          title: r.lesson.t,
          desc: r.lesson.s,
          tag: lt.short || "Learn",
          kind: "lesson"
        };
      });
      var studies = TD.searchStudies(q, 2).map(function (r) {
        var c = TD.colById[r.study.col] || {};
        return {
          href: "#/s/" + r.study.slug,
          tone: r.study.col,
          title: r.study.t,
          desc: r.study.s,
          tag: c.short || "Study",
          kind: "study"
        };
      });
      var used = lessons.length + studies.length;
      var terms = TD.search(q, { limit: Math.max(2, 6 - used) }).map(function (r) {
        var c = cat(r.term.c);
        return {
          href: "#/t/" + r.term.slug,
          tone: r.term.c,
          title: r.term.t,
          desc: r.term.d,
          tag: c.short || c.name,
          kind: "term"
        };
      });
      results = lessons.concat(studies).concat(terms);

      if (!results.length) {
        list.innerHTML = '<li class="hero-sug-none" role="presentation">Nothing matches ' +
          "<b>" + TD.esc(q) + "</b> — press <kbd>↵</kbd> to search everything</li>";
      } else {
        list.innerHTML = results.map(function (r, i) {
          var badge = r.kind === "study" ? "case study" : r.kind === "lesson" ? "lesson" : "";
          return '<li class="hero-sug-item is-' + r.kind + '" id="heroSug' + i +
            '" role="option" aria-selected="false" ' +
            'data-href="' + r.href + '" data-cat="' + r.tone + '" data-col="' + r.tone +
            '" data-track="' + r.tone + '">' +
            '<span class="hero-sug-dot" aria-hidden="true"></span>' +
            '<span class="hero-sug-main">' +
            '<span class="hero-sug-t">' + TD.highlight(r.title, q) +
            (badge ? ' <span class="hero-sug-badge">' + badge + "</span>" : "") + "</span>" +
            '<span class="hero-sug-d">' + TD.highlight(r.desc, q) + "</span></span>" +
            '<span class="hero-sug-c">' + TD.esc(r.tag) + "</span></li>";
        }).join("");
      }

      open = true;
      panel.hidden = false;
      input.setAttribute("aria-expanded", "true");
      mark(results.length ? 0 : -1);
    }

    input.addEventListener("input", function () {
      var q = input.value.trim();
      if (q.length < 1) { close(); return; }
      draw(q);
    });

    input.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        if (open) { e.stopPropagation(); close(); }
        return;
      }
      if (!open || !results.length) return;

      if (e.key === "ArrowDown") { e.preventDefault(); mark((active + 1) % results.length); }
      else if (e.key === "ArrowUp") { e.preventDefault(); mark((active - 1 + results.length) % results.length); }
      else if (e.key === "Enter" && active >= 0) {
        e.preventDefault();
        go(results[active]);
      }
    });

    function go(r) {
      close();
      input.value = "";
      location.hash = r.href;
    }

    /* Enter with nothing selected, or with no matches, opens the full palette
       seeded with what was typed — nothing the reader wrote is thrown away. */
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var q = input.value;
      if (open && active >= 0 && results[active]) { go(results[active]); return; }
      input.value = "";
      close();
      openPalette(q);
    });

    list.addEventListener("mousedown", function (e) {
      /* mousedown, not click: focusout would close the panel first */
      var li = e.target.closest(".hero-sug-item");
      if (!li) return;
      e.preventDefault();
      var href = li.getAttribute("data-href");
      if (href) go({ href: href });
    });

    list.addEventListener("mousemove", function (e) {
      var li = e.target.closest(".hero-sug-item");
      if (!li) return;
      var i = $$(".hero-sug-item", list).indexOf(li);
      if (i >= 0 && i !== active) mark(i);
    });

    /* Scoped to the wrapper, so nothing has to be unbound on route change. */
    wrap.addEventListener("focusout", function (e) {
      if (!wrap.contains(e.relatedTarget)) close();
    });
  }

  function wireCategoryFilter() {
    var input = $("#catFilter");
    var grid = $("#catGrid");
    var countEl = $("#catCount");
    var emptyEl = $("#catEmpty");
    var seg = $("#lvlSeg");
    if (!input || !grid) return;
    var lvl = "all";

    function apply() {
      var q = input.value.toLowerCase().trim();
      var shown = 0;
      $$(".term-card", grid).forEach(function (card) {
        var slug = card.getAttribute("href").split("/").pop();
        var t = TD.bySlug[slug];
        if (!t) return;
        var okLvl = lvl === "all" || t.l === lvl;
        var okQ = !q || (t.t + " " + t.a + " " + t.d + " " + t.g.join(" ")).toLowerCase().indexOf(q) >= 0;
        var on = okLvl && okQ;
        card.style.display = on ? "" : "none";
        if (on) shown++;
      });
      countEl.textContent = shown + (shown === 1 ? " term" : " terms");
      emptyEl.hidden = shown > 0;
      grid.hidden = shown === 0;
    }

    var deb;
    input.addEventListener("input", function () {
      clearTimeout(deb);
      deb = setTimeout(apply, 120);
    });
    seg.addEventListener("click", function (e) {
      var b = e.target.closest("button");
      if (!b) return;
      $$("button", seg).forEach(function (x) { x.classList.remove("is-on"); });
      b.classList.add("is-on");
      lvl = b.getAttribute("data-lvl");
      apply();
    });
  }

  /* ================= sidebar ================= */

  function buildSidebar() {
    var box = $("#sideCats");
    TD.categories.forEach(function (c) {
      var a = document.createElement("a");
      a.className = "side-link";
      a.href = "#/c/" + c.id;
      a.setAttribute("data-cat", c.id);
      a.setAttribute("data-catid", c.id);
      a.innerHTML = '<span class="side-cat-dot"></span>' + TD.esc(c.short) +
        '<span class="side-count">' + c.count + "</span>";
      box.appendChild(a);
    });
    $$(".side-ico").forEach(function (s) {
      s.innerHTML = TD.icon(s.getAttribute("data-icon"));
    });
    $("#sideTermCount").textContent = TD.terms.length;
  }

  function openSidebar() {
    sidebar.classList.add("is-open");
    scrim.hidden = false;
    $("#navToggle").setAttribute("aria-expanded", "true");
  }
  function closeSidebar() {
    sidebar.classList.remove("is-open");
    scrim.hidden = true;
    $("#navToggle").setAttribute("aria-expanded", "false");
  }

  /* ================= command palette ================= */

  function openPalette(seed) {
    palette.hidden = false;
    document.body.classList.add("no-scroll");
    pInput.value = seed || state.lastQuery || "";
    renderPaletteFilters();
    runPalette();
    setTimeout(function () { pInput.focus(); pInput.select(); }, 20);
  }

  function closePalette() {
    palette.hidden = true;
    document.body.classList.remove("no-scroll");
  }

  function renderPaletteFilters() {
    var h = '<button class="pf' + (state.palCat ? "" : " is-on") + '" data-pf="">All fields</button>';
    h += TD.categories.map(function (c) {
      return '<button class="pf' + (state.palCat === c.id ? " is-on" : "") + '" data-cat="' + c.id + '" data-pf="' + c.id + '">' +
        TD.esc(c.short) + "</button>";
    }).join("");
    pFilters.innerHTML = h;
  }

  function runPalette() {
    var q = pInput.value.trim();
    state.lastQuery = q;
    var list;
    if (!q) {
      list = (state.palCat ? TD.inCategory(state.palCat) : TD.suggest(8)).slice(0, 8)
        .map(function (t) { return { term: t, score: 0 }; });
      pCount.textContent = q ? "" : "suggestions";
    } else {
      list = TD.search(q, { limit: 50, cat: state.palCat });
      /* case studies lead when they match — there are few of them and a
         matching one is usually what the reader wanted. Suppressed while a
         category filter is active, since studies are not in a category. */
      if (!state.palCat) {
        list = TD.searchLessons(q, 3).concat(TD.searchStudies(q, 3)).concat(list);
      }
      pCount.textContent = list.length + (list.length === 1 ? " result" : " results");
    }
    /* every result carries its own destination, so commit does not need to
       know which kind it is */
    list.forEach(function (r) {
      r.href = r.lesson ? "#/learn/" + r.lesson.track + "/" + r.lesson.slug
        : r.study ? "#/s/" + r.study.slug
          : "#/t/" + r.term.slug;
    });
    state.palResults = list;
    state.palSel = 0;

    if (!list.length) {
      pResults.innerHTML = '<li class="palette-empty">No term matches <b>' + TD.esc(q) + "</b>.<br>Try a shorter word, or an acronym.</li>";
      return;
    }
    pResults.innerHTML = list.map(function (r, i) {
      var sel = i === 0 ? " is-sel" : "";
      if (r.lesson) {
        var L = r.lesson, lt = TD.trackById[L.track] || {};
        return '<li class="pr-item is-lesson' + sel + '" role="option" data-track="' + L.track +
          '" data-href="' + r.href + '" data-i="' + i + '" aria-selected="' + (i === 0) + '">' +
          '<span class="pr-dot"></span>' +
          '<span class="pr-main"><span class="pr-t">' + TD.highlight(L.t, q) +
          ' <span class="pr-badge is-lesson">lesson</span></span>' +
          '<span class="pr-d">' + TD.highlight(L.s, q) + "</span></span>" +
          '<span class="pr-cat">' + TD.esc(lt.short || "Learn") + "</span></li>";
      }
      if (r.study) {
        var st = r.study, sc = TD.colById[st.col] || {};
        return '<li class="pr-item is-study' + sel + '" role="option" data-col="' + st.col +
          '" data-href="' + r.href + '" data-i="' + i + '" aria-selected="' + (i === 0) + '">' +
          '<span class="pr-dot"></span>' +
          '<span class="pr-main"><span class="pr-t">' + TD.highlight(st.t, q) +
          ' <span class="pr-badge">case study</span></span>' +
          '<span class="pr-d">' + TD.highlight(st.s, q) + "</span></span>" +
          '<span class="pr-cat">' + TD.esc(sc.short || "Study") + "</span></li>";
      }
      var t = r.term, c = cat(t.c);
      return '<li class="pr-item' + sel + '" role="option" data-cat="' + t.c +
        '" data-slug="' + t.slug + '" data-href="' + r.href + '" data-i="' + i + '" aria-selected="' + (i === 0) + '">' +
        '<span class="pr-dot"></span>' +
        '<span class="pr-main"><span class="pr-t">' + TD.highlight(t.t, q) + (t.a ? ' <span style="color:var(--text-3);font-weight:400">· ' + TD.esc(t.a) + "</span>" : "") + "</span>" +
        '<span class="pr-d">' + TD.highlight(t.d, q) + "</span></span>" +
        '<span class="pr-cat">' + TD.esc(c.short) + "</span></li>";
    }).join("");
  }

  function movePaletteSel(delta) {
    if (!state.palResults.length) return;
    var items = $$(".pr-item", pResults);
    items[state.palSel] && items[state.palSel].classList.remove("is-sel");
    items[state.palSel] && items[state.palSel].setAttribute("aria-selected", "false");
    state.palSel = (state.palSel + delta + items.length) % items.length;
    var el = items[state.palSel];
    el.classList.add("is-sel");
    el.setAttribute("aria-selected", "true");
    var r = el.getBoundingClientRect(), pr = pResults.getBoundingClientRect();
    if (r.bottom > pr.bottom) pResults.scrollTop += r.bottom - pr.bottom + 8;
    if (r.top < pr.top) pResults.scrollTop -= pr.top - r.top + 8;
  }

  function commitPalette() {
    var r = state.palResults[state.palSel];
    if (!r) return;
    closePalette();
    location.hash = r.href || ("#/t/" + r.term.slug);
  }

  function cyclePaletteFilter(dir) {
    var ids = [null].concat(TD.categories.map(function (c) { return c.id; }));
    var i = ids.indexOf(state.palCat);
    state.palCat = ids[(i + dir + ids.length) % ids.length];
    renderPaletteFilters();
    runPalette();
  }

  /* ================= reading progress ================= */

  function updateProgress() {
    if (state.route.name !== "term") { progressBar.style.width = "0%"; return; }
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var pct = max > 20 ? Math.min(100, (h.scrollTop / max) * 100) : 0;
    progressBar.style.width = pct.toFixed(1) + "%";
  }

  /* ================= global events ================= */

  function goRandom() {
    var t = TD.terms[Math.floor(Math.random() * TD.terms.length)];
    location.hash = "#/t/" + t.slug;
  }

  function goRandomStudy() {
    if (!TD.studies.length) return;
    var s = TD.studies[Math.floor(Math.random() * TD.studies.length)];
    location.hash = "#/s/" + s.slug;
  }

  function copyText(txt, okMsg) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(txt).then(function () { toast(okMsg); },
        function () { fallbackCopy(txt, okMsg); });
    } else fallbackCopy(txt, okMsg);
  }

  function fallbackCopy(txt, okMsg) {
    var ta = document.createElement("textarea");
    ta.value = txt;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); toast(okMsg); }
    catch (e) { toast("Copy failed — select the text manually"); }
    document.body.removeChild(ta);
  }

  function bindGlobal() {
    var themeBtn = $("#themeBtn");
    if (themeBtn) {
      themeBtn.addEventListener("click", cycleTheme);
    }

    /* while on "system", follow the OS if it flips underneath us */
    if (window.matchMedia) {
      var mq = window.matchMedia("(prefers-color-scheme: light)");
      var onSys = function () { if (state.theme === "system") applyTheme("system"); };
      if (mq.addEventListener) mq.addEventListener("change", onSys);
      else if (mq.addListener) mq.addListener(onSys);
    }
    var randomBtn = $("#randomBtn");
    if (randomBtn) {
      randomBtn.innerHTML = TD.icon("dice");
      randomBtn.addEventListener("click", goRandom);
    }
    var bNav = $("#bookmarkNav");
    if (bNav) bNav.insertAdjacentHTML("afterbegin", TD.icon("bookmark"));
    var nToggle = $("#navToggle");
    if (nToggle) {
      nToggle.innerHTML = TD.icon("menu");
      nToggle.addEventListener("click", function () {
        sidebar.classList.contains("is-open") ? closeSidebar() : openSidebar();
      });
    }
    if (scrim) scrim.addEventListener("click", closeSidebar);

    var sTrigger = $("#searchTrigger");
    if (sTrigger) sTrigger.addEventListener("click", function () { openPalette(); });

    /* delegated click handling for all views */
    document.addEventListener("click", function (e) {
      var actEl = e.target.closest("[data-act]");
      if (actEl) {
        var act = actEl.getAttribute("data-act");
        if (act === "open-search") { openPalette(); return; }
        if (act === "print") { window.print(); return; }
        if (act === "random") { goRandom(); return; }
        if (act === "randomstudy") { goRandomStudy(); return; }
        if (act === "copylink") {
          copyText(location.href, "Link copied");
          return;
        }
        if (act === "save") {
          var slug = actEl.getAttribute("data-slug");
          var now = toggleSave(slug);
          actEl.innerHTML = TD.icon(now ? "bookmarkOn" : "bookmark") + "<span>" + (now ? "Saved" : "Save") + "</span>";
          return;
        }
        if (act === "copycode") {
          var box = actEl.closest(".codebox");
          var code = box ? box.querySelector("code").textContent : "";
          copyText(code, "Code copied");
          return;
        }
        /* annotated code: copy the source, not the per-line commentary */
        if (act === "copy-lc") {
          var fig = actEl.closest(".lc");
          var raw = fig ? fig.querySelector(".lc-raw") : null;
          copyText(raw ? raw.textContent : "", "Code copied");
          return;
        }
        if (act === "lesson-done") {
          var key = actEl.getAttribute("data-key");
          var nowDone = TD.progress.toggle(key);
          actEl.className = "btn " + (nowDone ? "btn-ghost" : "btn-primary") + " btn-sm";
          actEl.innerHTML = TD.icon(nowDone ? "check" : "bookmark") +
            "<span>" + (nowDone ? "Completed" : "Mark complete") + "</span>";
          toast(nowDone ? "Lesson marked complete" : "Marked as not done");
          return;
        }
      }
      if (e.target.closest("[data-close-palette]")) { closePalette(); return; }
      if (e.target.closest("[data-close-shortcuts]")) { shortcuts.hidden = true; document.body.classList.remove("no-scroll"); return; }

      var pr = e.target.closest(".pr-item");
      if (pr) {
        closePalette();
        location.hash = pr.getAttribute("data-href") || ("#/t/" + pr.getAttribute("data-slug"));
        return;
      }
      var pf = e.target.closest(".pf");
      if (pf) {
        var v = pf.getAttribute("data-pf");
        state.palCat = v || null;
        renderPaletteFilters();
        runPalette();
        pInput.focus();
        return;
      }
    });

    pInput.addEventListener("input", function () {
      clearTimeout(pInput._d);
      pInput._d = setTimeout(runPalette, 70);
    });

    pInput.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") { e.preventDefault(); movePaletteSel(1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); movePaletteSel(-1); }
      else if (e.key === "Enter") { e.preventDefault(); commitPalette(); }
      else if (e.key === "Tab") { e.preventDefault(); cyclePaletteFilter(e.shiftKey ? -1 : 1); }
      else if (e.key === "Escape") { e.preventDefault(); closePalette(); }
    });

    window.addEventListener("hashchange", render);
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("scroll", function () {
      var h = location.hash || "#/";
      scrollPositions[h] = window.scrollY || document.documentElement.scrollTop || 0;
    }, { passive: true });

    window.addEventListener("popstate", function () {
      isPopNav = true;
    });

    document.addEventListener("click", function (e) {
      var a = e.target && e.target.closest && e.target.closest("a[href^='#'], [data-nav]");
      if (a) {
        var cur = location.hash || "#/";
        var y = window.scrollY || document.documentElement.scrollTop || 0;
        scrollPositions[cur] = y;
        var href = a.getAttribute("href");
        if (href && href !== cur) {
          cardClicksByHash[cur] = {
            targetHref: href,
            scrollY: y,
            time: Date.now()
          };
          lastCardClick = cardClicksByHash[cur];
        }
      }
    }, true);
    TD.render = render;

    document.addEventListener("keydown", function (e) {
      var tag = (e.target.tagName || "").toLowerCase();
      var typing = tag === "input" || tag === "textarea" || e.target.isContentEditable;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        palette.hidden ? openPalette() : closePalette();
        return;
      }
      if (e.key === "Escape") {
        if (!palette.hidden) { closePalette(); return; }
        if (!shortcuts.hidden) { shortcuts.hidden = true; document.body.classList.remove("no-scroll"); return; }
        if (sidebar.classList.contains("is-open")) { closeSidebar(); return; }
      }
      if (typing || !palette.hidden || !shortcuts.hidden) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      switch (e.key) {
        case "/": e.preventDefault(); openPalette(""); break;
        case "?": e.preventDefault(); shortcuts.hidden = false; document.body.classList.add("no-scroll"); break;
        case "r": case "R": goRandom(); break;
        case "h": case "H": location.hash = "#/"; break;
        case "a": case "A": location.hash = "#/index"; break;
        case "t": case "T": cycleTheme(); break;
        case "s": case "S":
          if (state.route.name === "term") {
            var now = toggleSave(state.route.slug);
            var btn = $('[data-act="save"]');
            if (btn) btn.innerHTML = TD.icon(now ? "bookmarkOn" : "bookmark") + "<span>" + (now ? "Saved" : "Save") + "</span>";
          }
          break;
        case "l": case "L": location.hash = "#/learn"; break;
        case "d": case "D": location.hash = "#/drill"; break;
        case "b": case "B": location.hash = "#/code"; break;
        case "q": case "Q": location.hash = "#/quiz"; break;
        case "m": case "M": location.hash = "#/speak"; break;
        case "p": case "P": location.hash = "#/projects"; break;
        case "i": case "I": location.hash = "#/interviews"; break;
        case "w": case "W": location.hash = "#/research"; break;
        case "c": case "C": location.hash = "#/careers"; break;
        case "j": case "J":
          if (state.route.name === "term" && state.neighbours && state.neighbours.prev)
            location.hash = "#/t/" + state.neighbours.prev.slug;
          else if (state.route.name === "lesson" && state.lessonNav && state.lessonNav.prev)
            location.hash = "#/learn/" + state.lessonNav.track + "/" + state.lessonNav.prev.slug;
          break;
        case "k": case "K":
          if (state.route.name === "term" && state.neighbours && state.neighbours.next)
            location.hash = "#/t/" + state.neighbours.next.slug;
          else if (state.route.name === "lesson" && state.lessonNav && state.lessonNav.next)
            location.hash = "#/learn/" + state.lessonNav.track + "/" + state.lessonNav.next.slug;
          break;
      }
    });
  }

  /* ================= boot ================= */

  function boot() {
    if (!TD.terms.length) {
      view.innerHTML = '<div class="empty"><h3>No data loaded</h3><p>The term files did not load. Serve this folder over HTTP rather than opening the file directly.</p></div>';
      return;
    }
    /* attach the depth blocks before anything renders */
    if (TD.applyDepth) TD.applyDepth();
    injectCategoryStyles();
    /* "" means no explicit choice, which is the system-following state */
    applyTheme(TD.store.get("theme", "") || "system");
    buildSidebar();
    updateBookmarkBadge();
    bindGlobal();

    /* platform-correct modifier hint */
    if (/Mac|iPhone|iPad/.test(navigator.platform || "")) {
      var k = $("#kbdHint");
      if (k) k.textContent = "⌘ K";
    }

    render();
  }

  if (document.getElementById("view")) {
    boot();
  } else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})(window.TD);
