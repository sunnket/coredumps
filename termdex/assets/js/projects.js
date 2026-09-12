/* Project Lab UI — CoreDumps

   A directory of 60 buildable projects and a per-project blueprint page.

   The detail page is ordered the way someone actually approaches a build:
   what the problem is, what the thing looks like when assembled (the
   diagram), what you do first, what you will get wrong, and what you can
   claim afterwards. Resources and related work sit to the side, because they
   are reference rather than instruction. */
(function (TD) {
  "use strict";

  var state = {
    domain: "all",
    difficulty: "all",
    query: ""
  };

  /* Build progress is per project and per phase, kept locally. It exists so a
     half-finished project is visible on the index — the most common reason a
     side project dies is losing track of where you stopped. */
  var PROGRESS_KEY = "coredumps_project_progress";

  function readProgress() {
    try {
      var raw = localStorage.getItem(PROGRESS_KEY);
      var parsed = raw ? JSON.parse(raw) : {};
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch (e) {
      return {};
    }
  }

  function writeProgress(map) {
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(map));
    } catch (e) { /* storage unavailable — the page still works */ }
  }

  function phasesDone(projectId) {
    var map = readProgress();
    return (map[projectId] || []).length;
  }

  function togglePhase(projectId, index) {
    var map = readProgress();
    var done = map[projectId] || [];
    var at = done.indexOf(index);
    if (at === -1) done.push(index);
    else done.splice(at, 1);
    map[projectId] = done;
    writeProgress(map);
    return done;
  }

  /* ---------------- lookup helpers ---------------- */

  function domainMeta(id) {
    var found = null;
    (TD.projectDomains || []).forEach(function (d) { if (d.id === id) found = d; });
    return found || { id: id, name: id, short: id, icon: "server", col: "#38bdf8", colL: "#0284c7" };
  }

  var DIFFICULTY = {
    easy: { label: "Easy", cls: "pl-easy", blurb: "First year. One or two weeks, mostly new-to-you APIs." },
    intermediate: { label: "Intermediate", cls: "pl-med", blurb: "Second year. Several moving parts that must agree." },
    hard: { label: "Hard", cls: "pl-hard", blurb: "Third year. You will need to read a specification." },
    advanced: { label: "Capstone", cls: "pl-adv", blurb: "Final year. A term of work, and a genuine portfolio piece." }
  };

  function difficultyMeta(d) {
    return DIFFICULTY[(d || "").toLowerCase()] || { label: d, cls: "pl-med", blurb: "" };
  }

  function extrasFor(id) {
    return (TD.projectExtras && TD.projectExtras[id]) || null;
  }

  function blueprintFor(id) {
    return (TD.projectBlueprints && TD.projectBlueprints[id]) || null;
  }

  /* Cached searchable text — recomputing this per keystroke over 60 projects
     with their full prose is what makes a search box feel sluggish. */
  function haystack(p) {
    if (!p._hay) {
      var ex = extrasFor(p.id) || {};
      p._hay = [
        p.title, p.tagline, p.problem, p.outcome, p.year,
        (p.stack || []).join(" "),
        (p.steps || []).map(function (s) { return s.title + " " + s.desc; }).join(" "),
        (ex.learn || []).join(" "),
        (ex.stretch || []).join(" ")
      ].join(" ").toLowerCase();
    }
    return p._hay;
  }

  TD.filterProjects = function () {
    var needle = state.query.toLowerCase().trim();
    return (TD.projects || []).filter(function (p) {
      if (state.domain !== "all" && p.domain !== state.domain) return false;
      if (state.difficulty !== "all" &&
          (p.difficulty || "").toLowerCase() !== state.difficulty) return false;
      if (!needle) return true;
      return haystack(p).indexOf(needle) !== -1;
    });
  };

  /* ---------------- index ---------------- */

  function projectCard(p) {
    var dm = domainMeta(p.domain);
    var diff = difficultyMeta(p.difficulty);
    var total = (p.steps || []).length;
    var done = phasesDone(p.id);
    var stack = (p.stack || []).slice(0, 4).map(function (s) {
      return '<span class="pl-tag">' + TD.esc(s) + "</span>";
    }).join("");
    var more = (p.stack || []).length > 4
      ? '<span class="pl-tag is-more">+' + ((p.stack || []).length - 4) + "</span>" : "";

    return '<article class="pl-card" style="--dc:' + dm.colL + '">' +
      '<div class="pl-card-top">' +
        '<span class="pl-diff ' + diff.cls + '" title="' + TD.esc(diff.blurb) + '">' +
          TD.esc(diff.label) + "</span>" +
        '<span class="pl-time">' + TD.icon("timer") + TD.esc(p.time) + "</span>" +
      "</div>" +

      '<h3 class="pl-card-title"><a href="#/project/' + p.id + '">' + TD.esc(p.title) + "</a></h3>" +
      '<p class="pl-card-lede">' + TD.esc(p.tagline) + "</p>" +
      '<div class="pl-stack">' + stack + more + "</div>" +

      '<div class="pl-card-foot">' +
        '<span class="pl-domain">' + TD.icon(dm.icon) + TD.esc(dm.short) + "</span>" +
        (done
          ? '<span class="pl-prog" title="' + done + " of " + total + ' phases done">' +
              '<span class="pl-prog-bar"><i style="width:' +
                Math.round((done / Math.max(1, total)) * 100) + '%"></i></span>' +
              done + "/" + total + "</span>"
          : '<a class="pl-open" href="#/project/' + p.id + '">Open blueprint' +
              TD.icon("arrowRight") + "</a>") +
      "</div>" +
    "</article>";
  }

  function projectGrid() {
    var list = TD.filterProjects();
    if (!list.length) {
      return '<div class="empty"><h3>No projects match that</h3>' +
        "<p>Try a different technology, or clear the difficulty filter.</p>" +
        '<button class="btn btn-sm btn-ghost" id="plReset">' + TD.icon("reset") +
        " Clear filters</button></div>";
    }
    return '<p class="pl-count">Showing <strong>' + list.length + "</strong> of " +
        (TD.projects || []).length + " projects</p>" +
      '<div class="pl-grid">' + list.map(projectCard).join("") + "</div>";
  }

  TD.viewProjects = function (domain) {
    if (domain && domain !== state.domain) state.domain = domain;

    var domains = TD.projectDomains || [];
    var all = TD.projects || [];

    var tabs = '<button class="pl-tab' + (state.domain === "all" ? " is-active" : "") +
      '" data-pl-domain="all">All<span>' + all.length + "</span></button>" +
      domains.map(function (d) {
        var n = all.filter(function (p) { return p.domain === d.id; }).length;
        return '<button class="pl-tab' + (state.domain === d.id ? " is-active" : "") +
          '" data-pl-domain="' + d.id + '" style="--dc:' + d.colL + '">' +
          TD.icon(d.icon) + TD.esc(d.short) + "<span>" + n + "</span></button>";
      }).join("");

    var levels = [{ id: "all", label: "Any level" }].concat(
      ["easy", "intermediate", "hard", "advanced"].map(function (k) {
        return { id: k, label: DIFFICULTY[k].label, blurb: DIFFICULTY[k].blurb };
      })
    );

    var chips = levels.map(function (lv) {
      var n = lv.id === "all"
        ? all.length
        : all.filter(function (p) { return (p.difficulty || "").toLowerCase() === lv.id; }).length;
      return '<button class="pl-chip' + (state.difficulty === lv.id ? " is-active" : "") +
        '" data-pl-diff="' + lv.id + '"' + (lv.blurb ? ' title="' + TD.esc(lv.blurb) + '"' : "") + ">" +
        TD.esc(lv.label) + "<span>" + n + "</span></button>";
    }).join("");

    /* Domain cards double as an explanation of what each track contains —
       more useful on a first visit than a bare filter row. */
    var domainCards = domains.map(function (d) {
      var n = all.filter(function (p) { return p.domain === d.id; }).length;
      return '<button class="pl-domain-card" data-pl-domain="' + d.id + '" style="--dc:' + d.colL + '">' +
        '<span class="pl-domain-ico">' + TD.icon(d.icon) + "</span>" +
        "<span class=\"pl-domain-body\"><strong>" + TD.esc(d.name) + "<em>" + n + "</em></strong>" +
        "<span>" + TD.esc(d.desc) + "</span></span>" +
      "</button>";
    }).join("");

    return '<div class="pl-view">' +
      '<header class="pl-hero">' +
        '<div class="pl-hero-copy">' +
          '<span class="iv-eyebrow">' + TD.icon("terminal") + " Project Lab</span>" +
          "<h1>Sixty projects worth finishing</h1>" +
          "<p>Each one is a real system with an architecture diagram, a phased plan, the " +
            "mistakes people make, what you will actually learn, and how to prove you built " +
            "it. Pick one that scares you slightly.</p>" +
        "</div>" +
        '<div class="pl-hero-stats">' +
          '<div class="iv-stat"><strong>' + all.length + "</strong><span>Projects</span></div>" +
          '<div class="iv-stat"><strong>' + domains.length + "</strong><span>Domains</span></div>" +
          '<div class="iv-stat"><strong>4</strong><span>Levels</span></div>' +
        "</div>" +
      "</header>" +

      '<section class="pl-domains">' + domainCards + "</section>" +

      '<section class="pl-browse">' +
        '<div class="pl-controls">' +
          '<div class="proj-search-wrap">' +
            '<span class="proj-search-icon">' + TD.icon("search") + "</span>" +
            '<input type="text" class="proj-search-input" id="plSearch" ' +
              'placeholder="Search by technology or idea — Redis, CUDA, Kafka, CRDT, eBPF…" ' +
              'value="' + TD.esc(state.query) + '" />' +
            (state.query
              ? '<button class="proj-search-clear" id="plClear" aria-label="Clear search">✕</button>'
              : "") +
          "</div>" +
          '<div class="pl-tabs">' + tabs + "</div>" +
          '<div class="pl-chips">' + chips + "</div>" +
        "</div>" +
        '<div id="plGrid">' + projectGrid() + "</div>" +
      "</section>" +
    "</div>";
  };

  /* ---------------- detail ---------------- */

  function listBlock(items, icon) {
    return (items || []).map(function (x) {
      return "<li>" + TD.icon(icon) + "<span>" + TD.mdLine(x) + "</span></li>";
    }).join("");
  }

  TD.viewProject = function (slug) {
    var p = (TD.projectById || {})[slug];
    if (!p) {
      return '<div class="empty"><h3>No such project</h3>' +
        '<p>That blueprint does not exist. <a href="#/projects">Back to the Project Lab</a>.</p></div>';
    }

    var dm = domainMeta(p.domain);
    var diff = difficultyMeta(p.difficulty);
    var ex = extrasFor(p.id);
    var bp = blueprintFor(p.id);
    var doneList = readProgress()[p.id] || [];
    var total = (p.steps || []).length;

    var phases = (p.steps || []).map(function (st, i) {
      var isDone = doneList.indexOf(i) !== -1;
      return '<li class="pl-phase' + (isDone ? " is-done" : "") + '">' +
        '<button class="pl-phase-check" data-pl-phase="' + i + '" ' +
          'aria-pressed="' + (isDone ? "true" : "false") + '" ' +
          'aria-label="Mark phase ' + (i + 1) + (isDone ? " not done" : " done") + '">' +
          (isDone ? TD.icon("check") : "<span>" + (i + 1) + "</span>") +
        "</button>" +
        '<div class="pl-phase-body">' +
          "<h4>" + TD.esc(st.title.replace(/^Phase\s*\d+:\s*/i, "")) + "</h4>" +
          "<p>" + TD.esc(st.desc) + "</p>" +
        "</div>" +
      "</li>";
    }).join("");

    var pct = total ? Math.round((doneList.length / total) * 100) : 0;

    return '<div class="pl-detail">' +
      '<nav class="proj-detail-nav">' +
        '<a href="#/projects" class="proj-back-btn">' + TD.icon("arrowLeft") + " Project Lab</a>" +
        '<div class="proj-detail-crumbs">' +
          '<a href="#/projects">Projects</a> <span>/</span> ' +
          '<a href="#/projects/' + dm.id + '" style="color:' + dm.colL + '">' +
            TD.esc(dm.short) + "</a> <span>/</span> " +
          '<span class="is-current">' + TD.esc(p.title) + "</span>" +
        "</div>" +
      "</nav>" +

      '<header class="pl-detail-header" style="--dc:' + dm.colL + '">' +
        '<div class="pl-meta-row">' +
          '<span class="pl-diff ' + diff.cls + '">' + TD.esc(diff.label) + "</span>" +
          '<span class="pl-meta-pill">' + TD.icon(dm.icon) + TD.esc(dm.name) + "</span>" +
          '<span class="pl-meta-pill">' + TD.icon("timer") + TD.esc(p.time) + "</span>" +
          '<span class="pl-meta-pill">' + TD.icon("calendar") + TD.esc(p.year) + "</span>" +
        "</div>" +
        "<h1>" + TD.esc(p.title) + "</h1>" +
        '<p class="pl-detail-lede">' + TD.esc(p.tagline) + "</p>" +
        '<div class="pl-stack-row">' +
          '<span class="pl-stack-label">Stack</span>' +
          (p.stack || []).map(function (s) {
            return '<span class="pl-tag-lg">' + TD.esc(s) + "</span>";
          }).join("") +
        "</div>" +
        (total
          ? '<div class="pl-build-progress">' +
              '<span class="pl-build-bar"><i style="width:' + pct + '%"></i></span>' +
              '<span class="pl-build-text"><strong id="plPhaseCount">' + doneList.length +
                "</strong> of " + total + " phases done</span>" +
              (doneList.length
                ? '<button class="pl-build-reset" id="plResetPhases">' + TD.icon("reset") +
                    " Reset</button>"
                : "") +
            "</div>"
          : "") +
      "</header>" +

      '<div class="pl-body">' +
        '<main class="pl-main">' +
          '<section class="pl-section">' +
            "<h2>" + TD.icon("compass") + " The problem</h2>" +
            '<p class="pl-prose">' + TD.esc(p.problem) + "</p>" +
          "</section>" +

          (bp
            ? '<section class="pl-section">' +
                "<h2>" + TD.icon("flow") + " How it fits together</h2>" +
                TD.blueprint(bp) +
                '<div class="pl-bp-actions">' +
                  '<button class="btn btn-sm btn-ghost" data-pl-copy-bp="' + p.id + '">' +
                    TD.icon("copy") + " Copy as text</button>" +
                "</div>" +
              "</section>"
            : "") +

          '<section class="pl-section">' +
            "<h2>" + TD.icon("list") + " Build order</h2>" +
            '<p class="pl-section-sub">Tick a phase as you finish it — progress is saved in this browser.</p>' +
            '<ol class="pl-phases">' + phases + "</ol>" +
          "</section>" +

          '<section class="pl-section">' +
            "<h2>" + TD.icon("award") + " Done looks like</h2>" +
            '<div class="pl-outcome">' + TD.esc(p.outcome) + "</div>" +
          "</section>" +

          (ex && ex.proof
            ? '<section class="pl-section">' +
                "<h2>" + TD.icon("microscope") + " How to prove you built it</h2>" +
                '<div class="pl-proof">' + TD.icon("target") +
                  "<p>" + TD.mdLine(ex.proof) + "</p></div>" +
              "</section>"
            : "") +

          ((p.pitfalls || []).length
            ? '<section class="pl-section">' +
                "<h2>" + TD.icon("alert") + " Where people get stuck</h2>" +
                '<ul class="pl-pitfalls">' + listBlock(p.pitfalls, "alert") + "</ul>" +
              "</section>"
            : "") +

          (ex && (ex.stretch || []).length
            ? '<section class="pl-section">' +
                "<h2>" + TD.icon("trend") + " Take it further</h2>" +
                '<p class="pl-section-sub">Ordered from an afternoon to a term. This is where the ' +
                  "project stops being a tutorial.</p>" +
                '<ol class="pl-stretch">' +
                  (ex.stretch || []).map(function (s, i) {
                    return '<li><span class="pl-stretch-n">' + (i + 1) + "</span>" +
                      "<p>" + TD.mdLine(s) + "</p></li>";
                  }).join("") +
                "</ol>" +
              "</section>"
            : "") +

          ((p.interview || []).length
            ? '<section class="pl-section">' +
                "<h2>" + TD.icon("mic") + " What to say about it in an interview</h2>" +
                '<ul class="pl-interview">' + listBlock(p.interview, "quote") + "</ul>" +
              "</section>"
            : "") +
        "</main>" +

        '<aside class="pl-side">' +
          (ex && (ex.learn || []).length
            ? '<div class="pl-side-box pl-side-learn">' +
                "<h3>" + TD.icon("idea") + " What you will learn</h3>" +
                "<ul>" + listBlock(ex.learn, "check") + "</ul>" +
              "</div>"
            : "") +

          ((p.resources || []).length
            ? '<div class="pl-side-box">' +
                "<h3>" + TD.icon("book") + " Read these first</h3>" +
                '<ul class="pl-resources">' +
                  (p.resources || []).map(function (r) {
                    return '<li><a href="' + TD.esc(r.url) + '" target="_blank" ' +
                      'rel="noopener noreferrer">' + TD.esc(r.title) +
                      TD.icon("external") + "</a></li>";
                  }).join("") +
                "</ul>" +
              "</div>"
            : "") +

          (function () {
            var related = (TD.projects || []).filter(function (o) {
              return o.domain === p.domain && o.id !== p.id;
            }).slice(0, 4);
            if (!related.length) return "";
            return '<div class="pl-side-box">' +
              "<h3>" + TD.icon(dm.icon) + " More " + TD.esc(dm.short) + "</h3>" +
              '<div class="pl-related">' +
                related.map(function (r) {
                  var rd = difficultyMeta(r.difficulty);
                  return '<a class="pl-related-item" href="#/project/' + r.id + '">' +
                    '<span class="pl-diff ' + rd.cls + '">' + TD.esc(rd.label) + "</span>" +
                    "<strong>" + TD.esc(r.title) + "</strong>" +
                  "</a>";
                }).join("") +
              "</div>" +
            "</div>";
          })() +
        "</aside>" +
      "</div>" +
    "</div>";
  };

  /* ---------------- events ---------------- */

  function onIndex() {
    return window.location.hash.indexOf("#/projects") === 0;
  }

  function redrawGrid() {
    var host = document.getElementById("plGrid");
    if (host) host.innerHTML = projectGrid();
  }

  document.addEventListener("click", function (e) {
    var domainBtn = e.target.closest("[data-pl-domain]");
    if (domainBtn) {
      state.domain = domainBtn.getAttribute("data-pl-domain");
      if (onIndex()) {
        var view = document.getElementById("view");
        if (view) view.innerHTML = TD.viewProjects();
        /* Selecting a domain from the cards near the top should move the
           reader to the results, not leave them looking at the same cards. */
        var browse = document.querySelector(".pl-browse");
        if (browse && domainBtn.classList.contains("pl-domain-card")) {
          browse.scrollIntoView({ block: "start", behavior: "smooth" });
        }
      } else {
        window.location.hash = "#/projects";
      }
      return;
    }

    var diffBtn = e.target.closest("[data-pl-diff]");
    if (diffBtn) {
      state.difficulty = diffBtn.getAttribute("data-pl-diff");
      document.querySelectorAll("[data-pl-diff]").forEach(function (b) {
        b.classList.toggle("is-active", b === diffBtn);
      });
      redrawGrid();
      return;
    }

    if (e.target.closest("#plClear") || e.target.closest("#plReset")) {
      state.query = "";
      state.difficulty = "all";
      state.domain = "all";
      var view2 = document.getElementById("view");
      if (view2 && onIndex()) view2.innerHTML = TD.viewProjects();
      return;
    }

    /* Phase checkbox on the detail page. */
    var phaseBtn = e.target.closest("[data-pl-phase]");
    if (phaseBtn) {
      var slug = window.location.hash.replace("#/project/", "");
      var idx = Number(phaseBtn.getAttribute("data-pl-phase"));
      var done = togglePhase(decodeURIComponent(slug), idx);
      var isDone = done.indexOf(idx) !== -1;

      var li = phaseBtn.closest(".pl-phase");
      if (li) li.classList.toggle("is-done", isDone);
      phaseBtn.setAttribute("aria-pressed", isDone ? "true" : "false");
      phaseBtn.innerHTML = isDone ? TD.icon("check") : "<span>" + (idx + 1) + "</span>";

      var proj = (TD.projectById || {})[decodeURIComponent(slug)];
      var totalPhases = proj ? (proj.steps || []).length : 0;
      var bar = document.querySelector(".pl-build-bar i");
      if (bar && totalPhases) {
        bar.style.width = Math.round((done.length / totalPhases) * 100) + "%";
      }
      var count = document.getElementById("plPhaseCount");
      if (count) count.textContent = done.length;
      return;
    }

    if (e.target.closest("#plResetPhases")) {
      var slug2 = decodeURIComponent(window.location.hash.replace("#/project/", ""));
      var map = readProgress();
      delete map[slug2];
      writeProgress(map);
      var v = document.getElementById("view");
      if (v) v.innerHTML = TD.viewProject(slug2);
      return;
    }

    /* Copy the blueprint as plain text, for a README or a design doc. */
    var copyBtn = e.target.closest("[data-pl-copy-bp]");
    if (copyBtn) {
      var id = copyBtn.getAttribute("data-pl-copy-bp");
      var text = TD.blueprintText(blueprintFor(id));
      if (navigator.clipboard && text) {
        navigator.clipboard.writeText(text).then(function () {
          copyBtn.innerHTML = TD.icon("check") + " Copied";
          setTimeout(function () {
            copyBtn.innerHTML = TD.icon("copy") + " Copy as text";
          }, 1800);
        });
      }
      return;
    }
  });

  document.addEventListener("input", function (e) {
    if (e.target && e.target.id === "plSearch") {
      state.query = e.target.value;
      redrawGrid();
    }
  });
})(window.TD = window.TD || {});
