/* Interview Bank UI — CoreDumps

   Two views: a company directory and a per-company question bank.

   The interaction model is deliberately two-stage. A question shows its title
   and nothing else; you can then open a plain-English framing (the "nudge")
   and, separately, the full technical answer. Revealing everything at once
   turns a practice bank into a reading list — the pause where you try to
   answer first is the part that does the work.

   Progress is a three-state self-assessment (unseen / solid / revisit) rather
   than a checkbox, because "I have read this" and "I could say this out loud
   in an interview" are different facts and only the second one matters. */
(function (TD) {
  "use strict";

  /* This module loads after every data file, which makes it the one place
     that can safely sort the bank and derive the per-company counts. */
  if (TD.finaliseInterviewBank) TD.finaliseInterviewBank();

  /* ---------------- state ---------------- */

  var state = {
    /* directory */
    group: "all",
    companyQuery: "",
    /* company page */
    topic: "all",
    level: "all",
    query: "",
    progressFilter: "all",   /* all | unseen | solid | revisit */
    expandAll: false,
    companyId: null
  };

  /* ---------------- progress store ---------------- */

  var PROGRESS_KEY = "coredumps_interview_progress";
  var SOLID = "solid";
  var REVISIT = "revisit";

  function readProgress() {
    try {
      var raw = localStorage.getItem(PROGRESS_KEY);
      var parsed = raw ? JSON.parse(raw) : {};
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch (e) {
      /* A corrupt or unavailable store must not take the page down; an empty
         object degrades to "no progress recorded", which is recoverable. */
      return {};
    }
  }

  function writeProgress(map) {
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(map));
    } catch (e) { /* private mode, quota — the UI still works without it */ }
  }

  /* Clicking the mark you already hold clears it, so the control is a toggle
     in both directions and there is no separate "undo". */
  function setMark(qid, mark) {
    var map = readProgress();
    if (map[qid] === mark) delete map[qid];
    else map[qid] = mark;
    writeProgress(map);
    return map[qid] || null;
  }

  function progressFor(questions, map) {
    var solid = 0, revisit = 0;
    questions.forEach(function (q) {
      if (map[q.id] === SOLID) solid++;
      else if (map[q.id] === REVISIT) revisit++;
    });
    return {
      solid: solid,
      revisit: revisit,
      unseen: questions.length - solid - revisit,
      total: questions.length,
      pct: questions.length ? Math.round((solid / questions.length) * 100) : 0
    };
  }

  /* ---------------- helpers ---------------- */

  function levelMeta(level) {
    return TD.ivLevelMeta[level] || { label: level, cls: "lvl-med", blurb: "" };
  }

  function topicMeta(topic) {
    return TD.ivTopicById[topic] || { label: topic, icon: "spark", col: "#6b7891" };
  }

  function companiesFor(q) {
    return (q.companyIds || []).map(function (id) { return TD.companyById[id]; })
      .filter(Boolean);
  }

  /* A question's searchable text, computed once and cached on the question.
     Recomputing this per keystroke across a hundred questions is the kind of
     thing that makes a search box feel sticky. */
  function haystack(q) {
    if (!q._hay) {
      q._hay = [
        q.q, q.topic, q.level, q.simple, q.trap,
        TD.mdPlain(q.answer),
        (q.tags || []).join(" "),
        (q.takeaways || []).join(" "),
        (q.followUps || []).join(" ")
      ].join(" ").toLowerCase();
    }
    return q._hay;
  }

  function matches(q, needle) {
    if (!needle) return true;
    return haystack(q).indexOf(needle) !== -1;
  }

  /* ---------------- directory view ---------------- */

  function filterCompanies() {
    var list = TD.interviewCompanies || [];
    var needle = state.companyQuery.toLowerCase().trim();

    return list.filter(function (c) {
      if (state.group !== "all" && c.group !== state.group) return false;
      if (!needle) return true;
      var hay = [c.name, c.domain, c.badge, c.tagline, c.hiringFocus,
                 (c.rounds || []).map(function (r) { return r.name + " " + r.what; }).join(" ")]
        .join(" ").toLowerCase();
      return hay.indexOf(needle) !== -1;
    });
  }

  /* A compact stacked bar showing what a company's loop actually weights.
     More useful than a list of round names, because it answers "what should I
     spend this week on" at a glance. */
  function topicMixBar(mix) {
    if (!mix) return "";
    var entries = Object.keys(mix).map(function (k) {
      return { topic: k, pct: mix[k] };
    }).sort(function (a, b) { return b.pct - a.pct; });

    var segs = entries.map(function (e) {
      var m = topicMeta(e.topic);
      return '<span class="iv-mix-seg" style="width:' + e.pct + '%;background:' + m.col + '"' +
        ' title="' + TD.esc(m.label) + ' — ' + e.pct + '% of the loop"></span>';
    }).join("");

    var keys = entries.slice(0, 3).map(function (e) {
      var m = topicMeta(e.topic);
      return '<span class="iv-mix-key"><i style="background:' + m.col + '"></i>' +
        TD.esc(m.label) + ' ' + e.pct + '%</span>';
    }).join("");

    return '<div class="iv-mix"><div class="iv-mix-bar">' + segs + '</div>' +
      '<div class="iv-mix-keys">' + keys + '</div></div>';
  }

  function companyCard(c, progressMap) {
    var questions = TD.questionsByCompany[c.id] || [];
    var p = progressFor(questions, progressMap);
    var lvl = levelMeta(c.difficulty);

    return '<article class="iv-co-card">' +
      '<div class="iv-co-head">' +
        '<span class="iv-co-mark" style="--co:' + c.col + '">' + TD.esc(c.name.charAt(0)) + '</span>' +
        '<div class="iv-co-ident">' +
          '<h3><a href="#/interview/' + c.id + '">' + TD.esc(c.name) + '</a></h3>' +
          '<p class="iv-co-badge">' + TD.esc(c.badge) + '</p>' +
        '</div>' +
        '<span class="iv-lvl ' + lvl.cls + '">' + TD.esc(lvl.label) + '</span>' +
      '</div>' +

      '<p class="iv-co-tagline">' + TD.esc(c.tagline) + '</p>' +

      topicMixBar(c.topicMix) +

      '<dl class="iv-co-facts">' +
        '<div><dt>Loop</dt><dd>' + TD.esc(c.loop) + '</dd></div>' +
        '<div><dt>Focus</dt><dd>' + TD.esc(c.hiringFocus) + '</dd></div>' +
      '</dl>' +

      '<div class="iv-co-foot">' +
        (p.solid
          ? '<span class="iv-co-progress" title="' + p.solid + ' of ' + p.total + ' marked solid">' +
              '<span class="iv-co-progress-bar"><i style="width:' + p.pct + '%"></i></span>' +
              p.pct + '%</span>'
          : '<span class="iv-co-count">' + TD.icon("list") + '<strong>' + p.total + '</strong> questions</span>') +
        '<a class="btn btn-sm btn-primary" href="#/interview/' + c.id + '">' +
          'Open bank' + TD.icon("arrowRight") + '</a>' +
      '</div>' +
    '</article>';
  }

  function directoryGrid() {
    var list = filterCompanies();
    if (!list.length) {
      return '<div class="empty"><h3>No companies match that search</h3>' +
        '<p>Try a company name, a domain, or a technology such as <em>CUDA</em>, ' +
        '<em>Spark</em> or <em>machine coding</em>.</p></div>';
    }
    var map = readProgress();
    return '<div class="iv-co-grid">' +
      list.map(function (c) { return companyCard(c, map); }).join("") +
      '</div>';
  }

  TD.viewInterviews = function () {
    var companies = TD.interviewCompanies || [];
    var totalQuestions = (TD.interviewQuestions || []).length;
    var map = readProgress();
    var overall = progressFor(TD.interviewQuestions || [], map);

    var groupTabs = [{ id: "all", short: "All companies", blurb: "" }]
      .concat(TD.ivGroups)
      .map(function (g) {
        var n = g.id === "all"
          ? companies.length
          : companies.filter(function (c) { return c.group === g.id; }).length;
        return '<button class="iv-tab' + (state.group === g.id ? " is-active" : "") + '"' +
          ' data-iv-group="' + g.id + '"' + (g.blurb ? ' title="' + TD.esc(g.blurb) + '"' : "") + '>' +
          TD.esc(g.short) + '<span class="iv-tab-n">' + n + '</span></button>';
      }).join("");

    /* Topic totals, so the reader can see the shape of the whole bank before
       picking a company. */
    var topicCounts = {};
    (TD.interviewQuestions || []).forEach(function (q) {
      topicCounts[q.topic] = (topicCounts[q.topic] || 0) + 1;
    });
    var topicCards = TD.ivTopics.map(function (t) {
      return '<div class="iv-topic-card" style="--tc:' + t.col + '">' +
        '<span class="iv-topic-ico">' + TD.icon(t.icon) + '</span>' +
        '<div><h4>' + TD.esc(t.label) + '<em>' + (topicCounts[t.id] || 0) + '</em></h4>' +
        '<p>' + TD.esc(t.blurb) + '</p></div>' +
      '</div>';
    }).join("");

    return '<div class="iv-view">' +
      '<header class="iv-hero">' +
        '<div class="iv-hero-copy">' +
          '<span class="iv-eyebrow">' + TD.icon("shield") + ' Interview Bank</span>' +
          '<h1>Company technical interview bank</h1>' +
          '<p>Real questions, phrased the way interviewers phrase them. Every one carries a ' +
            'plain-English framing, a full technical answer, the follow-ups to expect, and the ' +
            'wrong answer that sounds right.</p>' +
          '<div class="iv-hero-actions">' +
            '<a class="btn btn-md btn-primary" href="#/interview/ai-engineer">' +
              TD.icon("spark") + ' AI Engineer track</a>' +
            '<button class="btn btn-md btn-ghost" id="ivRandomBtn">' +
              TD.icon("shuffle") + ' Random question</button>' +
          '</div>' +
        '</div>' +
        '<div class="iv-hero-stats">' +
          '<div class="iv-stat"><strong>' + companies.length + '</strong><span>Companies</span></div>' +
          '<div class="iv-stat"><strong>' + totalQuestions + '</strong><span>Questions</span></div>' +
          '<div class="iv-stat"><strong>' + TD.ivTopics.length + '</strong><span>Topics</span></div>' +
          '<div class="iv-stat' + (overall.solid ? ' is-live' : '') + '">' +
            '<strong>' + overall.solid + '</strong><span>Marked solid</span></div>' +
        '</div>' +
      '</header>' +

      '<section class="iv-guide">' +
        '<h2>' + TD.icon("idea") + ' How to use this bank</h2>' +
        '<ol class="iv-guide-steps">' +
          '<li><strong>Answer before you open it.</strong> Say it out loud, or write four bullets. ' +
            'Reading an answer you have not attempted feels productive and teaches very little.</li>' +
          '<li><strong>Use the nudge, not the answer.</strong> Each question has a plain-English ' +
            'framing behind a separate button. Take that first if you are stuck.</li>' +
          '<li><strong>Mark honestly.</strong> <em>Solid</em> means you could say it in a room ' +
            'under mild pressure — not that you understood it while reading.</li>' +
          '<li><strong>Read the trap and the follow-ups.</strong> Interviews are decided in the ' +
            'follow-ups far more often than in the first answer.</li>' +
        '</ol>' +
      '</section>' +

      '<section class="iv-topics">' +
        '<h2>' + TD.icon("grid") + ' What the bank covers</h2>' +
        '<div class="iv-topic-grid">' + topicCards + '</div>' +
      '</section>' +

      '<section class="iv-directory">' +
        '<h2>' + TD.icon("company") + ' Companies</h2>' +
        '<div class="iv-controls">' +
          '<div class="proj-search-wrap">' +
            '<span class="proj-search-icon">' + TD.icon("search") + '</span>' +
            '<input type="text" class="proj-search-input" id="ivCompanySearch" ' +
              'placeholder="Search a company, a domain, or a technology…" ' +
              'value="' + TD.esc(state.companyQuery) + '" />' +
          '</div>' +
          '<div class="iv-tabs">' + groupTabs + '</div>' +
        '</div>' +
        '<div id="ivDirectory">' + directoryGrid() + '</div>' +
      '</section>' +
    '</div>';
  };

  /* ---------------- company page ---------------- */

  /* The AI-engineer track is a curated cross-company view, so it is described
     here rather than in the company registry — it has no interview loop of
     its own to document. */
  var AI_TRACK = {
    id: "ai-engineer",
    name: "AI Engineer track",
    badge: "Cross-company LLM engineering",
    col: "#7c3aed",
    difficulty: "hard",
    loop: "Curated across every AI-heavy loop in the bank",
    tagline: "The questions that recur across frontier labs, AI infrastructure teams and " +
      "applied-AI product roles — attention internals, serving economics, retrieval, " +
      "fine-tuning, agents and evaluation.",
    hiringFocus: "Transformer internals, KV-cache economics, RAG and evaluation, LoRA/QLoRA, " +
      "agent containment, inference optimisation, and honest reasoning about model failure.",
    signals: [
      "Can you do the arithmetic — memory, throughput, cost — rather than describe it qualitatively?",
      "Do you know which techniques are exact and which are approximations?",
      "Can you say what you would measure to find out you were wrong?"
    ],
    rounds: null
  };

  function resolveCompany(id) {
    if (id === "ai-engineer") return AI_TRACK;
    return TD.companyById[id] || null;
  }

  function questionsFor(id) {
    if (id === "ai-engineer") return TD.aiEngineerQuestions || [];
    return TD.questionsByCompany[id] || [];
  }

  function filterQuestions(all, map) {
    var needle = state.query.toLowerCase().trim();
    return all.filter(function (q) {
      if (state.topic !== "all" && q.topic !== state.topic) return false;
      if (state.level !== "all" && q.level !== state.level) return false;
      if (state.progressFilter !== "all") {
        var mark = map[q.id] || "unseen";
        if (state.progressFilter !== mark) return false;
      }
      return matches(q, needle);
    });
  }

  function listItems(arr, icon) {
    return (arr || []).map(function (x) {
      return '<li>' + TD.icon(icon) + '<span>' + TD.mdLine(x) + '</span></li>';
    }).join("");
  }

  function questionCard(q, index, map) {
    var mark = map[q.id] || null;
    var lvl = levelMeta(q.level);
    var t = topicMeta(q.topic);
    var alsoAsked = companiesFor(q).filter(function (c) { return c.id !== state.companyId; });

    var askedChips = alsoAsked.slice(0, 6).map(function (c) {
      return '<a class="iv-asked-chip" href="#/interview/' + c.id + '" ' +
        'style="--co:' + c.col + '">' + TD.esc(c.name) + '</a>';
    }).join("");
    var askedMore = alsoAsked.length > 6
      ? '<span class="iv-asked-more">+' + (alsoAsked.length - 6) + ' more</span>' : "";

    return '<article class="iv-q' + (mark ? " is-" + mark : "") + '" id="q-' + q.id + '" data-qid="' + q.id + '">' +
      '<div class="iv-q-top">' +
        '<span class="iv-q-n">' + (index + 1) + '</span>' +
        '<span class="iv-q-topic" style="--tc:' + t.col + '">' + TD.icon(t.icon) + TD.esc(t.label) + '</span>' +
        '<span class="iv-lvl ' + lvl.cls + '" title="' + TD.esc(lvl.blurb) + '">' + TD.esc(lvl.label) + '</span>' +
        (mark === SOLID ? '<span class="iv-q-mark is-solid">' + TD.icon("check") + 'Solid</span>' : "") +
        (mark === REVISIT ? '<span class="iv-q-mark is-revisit">' + TD.icon("refresh") + 'Revisit</span>' : "") +
      '</div>' +

      '<h3 class="iv-q-title">' + TD.mdLine(q.q) + '</h3>' +

      ((q.tags || []).length
        ? '<div class="iv-q-tags">' + q.tags.map(function (tag) {
            return '<span class="iv-tag">' + TD.esc(tag) + '</span>';
          }).join("") + '</div>'
        : "") +

      '<div class="iv-q-actions">' +
        '<button class="iv-btn iv-btn-nudge" data-iv-nudge="' + q.id + '" ' +
          'aria-expanded="false" aria-controls="nudge-' + q.id + '">' +
          TD.icon("idea") + '<span>Nudge</span></button>' +
        '<button class="iv-btn iv-btn-answer" data-iv-answer="' + q.id + '" ' +
          'aria-expanded="false" aria-controls="ans-' + q.id + '">' +
          TD.icon("eye") + '<span>Full answer</span></button>' +
        '<span class="iv-q-spacer"></span>' +
        '<button class="iv-btn iv-mark' + (mark === SOLID ? " is-on" : "") + '" ' +
          'data-iv-mark="' + q.id + '" data-mark="' + SOLID + '" title="I could say this out loud">' +
          TD.icon("check") + '<span>Solid</span></button>' +
        '<button class="iv-btn iv-mark' + (mark === REVISIT ? " is-on" : "") + '" ' +
          'data-iv-mark="' + q.id + '" data-mark="' + REVISIT + '" title="Come back to this">' +
          TD.icon("refresh") + '<span>Revisit</span></button>' +
      '</div>' +

      '<div class="iv-nudge" id="nudge-' + q.id + '" hidden>' +
        '<h4>' + TD.icon("idea") + ' In plain English</h4>' +
        '<p>' + TD.mdLine(q.simple) + '</p>' +
        '<p class="iv-nudge-hint">Try the question again before opening the full answer.</p>' +
      '</div>' +

      '<div class="iv-answer" id="ans-' + q.id + '" hidden>' +
        '<div class="iv-answer-body md">' + TD.md(q.answer) + '</div>' +

        ((q.takeaways || []).length
          ? '<div class="iv-panel iv-panel-key">' +
              '<h4>' + TD.icon("award") + ' What to actually say</h4>' +
              '<ul>' + listItems(q.takeaways, "check") + '</ul>' +
            '</div>'
          : "") +

        (q.trap
          ? '<div class="iv-panel iv-panel-trap">' +
              '<h4>' + TD.icon("trap") + ' The trap</h4>' +
              '<p>' + TD.mdLine(q.trap) + '</p>' +
            '</div>'
          : "") +

        ((q.followUps || []).length
          ? '<div class="iv-panel iv-panel-next">' +
              '<h4>' + TD.icon("arrowRight") + ' Follow-ups to expect</h4>' +
              '<ul>' + listItems(q.followUps, "chevronDown") + '</ul>' +
            '</div>'
          : "") +

        (askedChips
          ? '<div class="iv-asked"><span class="iv-asked-label">Also asked at</span>' +
              askedChips + askedMore + '</div>'
          : "") +
      '</div>' +
    '</article>';
  }

  function questionList(all, map) {
    var filtered = filterQuestions(all, map);

    if (!filtered.length) {
      return '<div class="empty"><h3>Nothing matches those filters</h3>' +
        '<p>Clear the search, or widen the topic and difficulty.</p>' +
        '<button class="btn btn-sm btn-ghost" id="ivResetFilters">' +
          TD.icon("reset") + ' Reset filters</button></div>';
    }

    return '<p class="iv-result-count">Showing <strong>' + filtered.length + '</strong> of ' +
        all.length + ' questions</p>' +
      '<div class="iv-q-list">' +
        filtered.map(function (q, i) { return questionCard(q, i, map); }).join("") +
      '</div>';
  }

  TD.viewCompanyQuestions = function (companyId) {
    var comp = resolveCompany(companyId);
    if (!comp) {
      return '<div class="empty"><h3>No such company</h3>' +
        '<p>That company is not in the bank. <a href="#/interviews">Back to the Interview Bank</a>.</p></div>';
    }

    state.companyId = companyId;
    var all = questionsFor(companyId);
    var map = readProgress();
    var p = progressFor(all, map);

    /* Chip counts are computed against the *other* active filters, so a chip
       showing 0 genuinely means "nothing here given what else you picked"
       rather than "nothing here at all". */
    function countWith(override) {
      var saved = { topic: state.topic, level: state.level, progressFilter: state.progressFilter };
      Object.keys(override).forEach(function (k) { state[k] = override[k]; });
      var n = filterQuestions(all, map).length;
      state.topic = saved.topic;
      state.level = saved.level;
      state.progressFilter = saved.progressFilter;
      return n;
    }

    var presentTopics = TD.ivTopics.filter(function (t) {
      return all.some(function (q) { return q.topic === t.id; });
    });

    var topicChips = '<button class="iv-chip' + (state.topic === "all" ? " is-active" : "") +
      '" data-iv-topic="all">All topics<span>' + countWith({ topic: "all" }) + '</span></button>' +
      presentTopics.map(function (t) {
        return '<button class="iv-chip' + (state.topic === t.id ? " is-active" : "") +
          '" data-iv-topic="' + TD.esc(t.id) + '" style="--tc:' + t.col + '">' +
          TD.esc(t.label) + '<span>' + countWith({ topic: t.id }) + '</span></button>';
      }).join("");

    var levelChips = '<button class="iv-chip' + (state.level === "all" ? " is-active" : "") +
      '" data-iv-level="all">Any level<span>' + countWith({ level: "all" }) + '</span></button>' +
      TD.ivLevels.filter(function (lv) {
        return all.some(function (q) { return q.level === lv; });
      }).map(function (lv) {
        var m = levelMeta(lv);
        return '<button class="iv-chip ' + m.cls + (state.level === lv ? " is-active" : "") +
          '" data-iv-level="' + lv + '" title="' + TD.esc(m.blurb) + '">' +
          TD.esc(m.label) + '<span>' + countWith({ level: lv }) + '</span></button>';
      }).join("");

    var progressChips = [
      { id: "all", label: "All" },
      { id: "unseen", label: "Not yet marked" },
      { id: SOLID, label: "Solid" },
      { id: REVISIT, label: "Revisit" }
    ].map(function (pf) {
      return '<button class="iv-chip' + (state.progressFilter === pf.id ? " is-active" : "") +
        '" data-iv-progress="' + pf.id + '">' + pf.label +
        '<span>' + countWith({ progressFilter: pf.id }) + '</span></button>';
    }).join("");

    /* Rounds timeline — the AI track has no loop of its own. */
    var roundsHtml = (comp.rounds || []).map(function (r, i) {
      return '<li class="iv-round">' +
        '<span class="iv-round-n">' + (i + 1) + '</span>' +
        '<div class="iv-round-body">' +
          '<h4>' + TD.esc(r.name) + '</h4>' +
          '<p>' + TD.esc(r.what) + '</p>' +
          '<p class="iv-round-prep">' + TD.icon("idea") + ' ' + TD.esc(r.prep) + '</p>' +
        '</div>' +
      '</li>';
    }).join("");

    var signalsHtml = (comp.signals || []).map(function (s) {
      return '<li>' + TD.icon("target") + '<span>' + TD.esc(s) + '</span></li>';
    }).join("");

    var lvl = levelMeta(comp.difficulty);
    var ring = 100 - p.pct;

    return '<div class="iv-detail" data-company="' + TD.esc(companyId) + '">' +
      '<nav class="proj-detail-nav">' +
        '<a href="#/interviews" class="proj-back-btn">' + TD.icon("arrowLeft") +
          ' Interview Bank</a>' +
        '<div class="proj-detail-crumbs">' +
          '<a href="#/interviews">Interviews</a> <span>/</span> ' +
          '<span class="is-current">' + TD.esc(comp.name) + '</span>' +
        '</div>' +
      '</nav>' +

      '<header class="iv-co-header" style="--co:' + comp.col + '">' +
        '<div class="iv-co-header-main">' +
          '<div class="iv-co-header-top">' +
            '<span class="iv-co-mark lg">' + TD.esc(comp.name.charAt(0)) + '</span>' +
            '<div>' +
              '<h1>' + TD.esc(comp.name) + '</h1>' +
              '<p class="iv-co-badge">' + TD.esc(comp.badge) + '</p>' +
            '</div>' +
            '<span class="iv-lvl ' + lvl.cls + '">' + TD.esc(lvl.label) + '</span>' +
          '</div>' +
          '<p class="iv-co-lede">' + TD.esc(comp.tagline) + '</p>' +
          '<dl class="iv-co-facts wide">' +
            '<div><dt>Loop</dt><dd>' + TD.esc(comp.loop) + '</dd></div>' +
            '<div><dt>Evaluated on</dt><dd>' + TD.esc(comp.hiringFocus) + '</dd></div>' +
          '</dl>' +
        '</div>' +

        '<div class="iv-progress-card">' +
          '<div class="iv-ring" style="--pct:' + p.pct + '">' +
            '<svg viewBox="0 0 42 42" aria-hidden="true">' +
              '<circle class="iv-ring-track" cx="21" cy="21" r="15.9" pathLength="100"></circle>' +
              '<circle class="iv-ring-fill" cx="21" cy="21" r="15.9" pathLength="100" ' +
                'stroke-dasharray="' + p.pct + ' ' + ring + '"></circle>' +
            '</svg>' +
            '<span class="iv-ring-label"><strong>' + p.pct + '%</strong></span>' +
          '</div>' +
          '<ul class="iv-progress-legend">' +
            '<li><i class="dot-solid"></i>' + p.solid + ' solid</li>' +
            '<li><i class="dot-revisit"></i>' + p.revisit + ' to revisit</li>' +
            '<li><i class="dot-unseen"></i>' + p.unseen + ' not yet marked</li>' +
          '</ul>' +
          (p.solid + p.revisit
            ? '<button class="iv-reset" id="ivResetProgress">' + TD.icon("reset") +
                ' Reset progress for this company</button>'
            : '') +
        '</div>' +
      '</header>' +

      (roundsHtml
        ? '<section class="iv-loop">' +
            '<h2>' + TD.icon("flow") + ' What the loop looks like</h2>' +
            '<ol class="iv-rounds">' + roundsHtml + '</ol>' +
          '</section>'
        : "") +

      (signalsHtml
        ? '<section class="iv-signals">' +
            '<h2>' + TD.icon("target") + ' What they are actually scoring</h2>' +
            '<ul>' + signalsHtml + '</ul>' +
          '</section>'
        : "") +

      '<section class="iv-bank">' +
        '<div class="iv-filters" id="ivFilters">' +
          '<div class="proj-search-wrap">' +
            '<span class="proj-search-icon">' + TD.icon("search") + '</span>' +
            '<input type="text" class="proj-search-input" id="ivQuestionSearch" ' +
              'placeholder="Search these questions — try KV cache, deadlock, saga, skew…" ' +
              'value="' + TD.esc(state.query) + '" />' +
          '</div>' +
          '<div class="iv-filter-row"><span class="iv-filter-label">Topic</span>' +
            '<div class="iv-chips">' + topicChips + '</div></div>' +
          '<div class="iv-filter-row"><span class="iv-filter-label">Level</span>' +
            '<div class="iv-chips">' + levelChips + '</div></div>' +
          '<div class="iv-filter-row"><span class="iv-filter-label">Progress</span>' +
            '<div class="iv-chips">' + progressChips + '</div>' +
            '<button class="iv-btn iv-expand" id="ivExpandAll">' +
              TD.icon(state.expandAll ? "chevronUp" : "chevronDown") +
              '<span>' + (state.expandAll ? "Collapse all" : "Expand all") + '</span></button>' +
          '</div>' +
        '</div>' +

        '<div id="ivQuestions">' + questionList(all, map) + '</div>' +
      '</section>' +
    '</div>';
  };

  /* ---------------- rendering helpers ---------------- */

  function onInterviewsRoute() {
    return window.location.hash.indexOf("#/interviews") === 0;
  }

  function onCompanyRoute() {
    return window.location.hash.indexOf("#/interview/") === 0;
  }

  function currentCompanyId() {
    return decodeURIComponent(window.location.hash.replace("#/interview/", ""));
  }

  /* Redraw only the question list, preserving scroll position. Re-rendering
     the whole view on a chip click would jump the reader back to the top,
     which is the single most irritating thing a filter can do. */
  function redrawQuestions() {
    var host = document.getElementById("ivQuestions");
    if (!host) return;
    var all = questionsFor(currentCompanyId());
    var map = readProgress();
    host.innerHTML = questionList(all, map);
    if (state.expandAll) applyExpandAll(true);
    refreshChipCounts(all, map);
  }

  /* The chips carry live counts, so they must be refreshed whenever the
     filters change — otherwise they describe the previous state. */
  function refreshChipCounts(all, map) {
    var filters = document.getElementById("ivFilters");
    if (!filters) return;

    function recount(selector, attr, key) {
      filters.querySelectorAll(selector).forEach(function (btn) {
        var value = btn.getAttribute(attr);
        var saved = state[key];
        state[key] = value;
        var n = filterQuestions(all, map).length;
        state[key] = saved;
        var badge = btn.querySelector("span");
        if (badge) badge.textContent = n;
        btn.classList.toggle("is-active", saved === value);
      });
    }

    recount("[data-iv-topic]", "data-iv-topic", "topic");
    recount("[data-iv-level]", "data-iv-level", "level");
    recount("[data-iv-progress]", "data-iv-progress", "progressFilter");
  }

  function applyExpandAll(open) {
    document.querySelectorAll(".iv-answer").forEach(function (d) { d.hidden = !open; });
    document.querySelectorAll("[data-iv-answer]").forEach(function (b) {
      b.classList.toggle("is-on", open);
      b.setAttribute("aria-expanded", open ? "true" : "false");
      var label = b.querySelector("span");
      if (label) label.textContent = open ? "Hide answer" : "Full answer";
    });
  }

  /* Recompute the header ring in place rather than re-rendering the page, so
     marking a question does not move anything under the pointer. */
  function refreshProgressCard() {
    var card = document.querySelector(".iv-progress-card");
    if (!card) return;
    var all = questionsFor(currentCompanyId());
    var p = progressFor(all, readProgress());

    var ring = card.querySelector(".iv-ring");
    if (ring) {
      ring.style.setProperty("--pct", p.pct);
      var fill = ring.querySelector(".iv-ring-fill");
      if (fill) fill.setAttribute("stroke-dasharray", p.pct + " " + (100 - p.pct));
      var label = ring.querySelector(".iv-ring-label strong");
      if (label) label.textContent = p.pct + "%";
    }

    var legend = card.querySelectorAll(".iv-progress-legend li");
    if (legend.length === 3) {
      legend[0].innerHTML = '<i class="dot-solid"></i>' + p.solid + " solid";
      legend[1].innerHTML = '<i class="dot-revisit"></i>' + p.revisit + " to revisit";
      legend[2].innerHTML = '<i class="dot-unseen"></i>' + p.unseen + " not yet marked";
    }
  }

  /* ---------------- events ---------------- */

  document.addEventListener("click", function (e) {
    /* --- directory: group tabs --- */
    var groupBtn = e.target.closest("[data-iv-group]");
    if (groupBtn && onInterviewsRoute()) {
      state.group = groupBtn.getAttribute("data-iv-group");
      document.querySelectorAll("[data-iv-group]").forEach(function (b) {
        b.classList.toggle("is-active", b === groupBtn);
      });
      var dir = document.getElementById("ivDirectory");
      if (dir) dir.innerHTML = directoryGrid();
      return;
    }

    /* --- directory: random question --- */
    if (e.target.closest("#ivRandomBtn")) {
      var pool = TD.interviewQuestions || [];
      if (!pool.length) return;
      var pick = pool[Math.floor(Math.random() * pool.length)];
      var host = pick.companyIds && pick.companyIds[0];
      if (!host) return;
      /* Clear filters first, or the target question may be filtered out of
         the page we are about to send the reader to. */
      state.topic = "all";
      state.level = "all";
      state.progressFilter = "all";
      state.query = "";
      window.location.hash = "#/interview/" + host;
      /* The route renders synchronously on hashchange, so defer the scroll
         and the open until after that has happened. */
      setTimeout(function () {
        var card = document.getElementById("q-" + pick.id);
        if (!card) return;
        card.scrollIntoView({ block: "center" });
        card.classList.add("is-spotlit");
        var btn = card.querySelector("[data-iv-nudge]");
        if (btn) btn.click();
      }, 60);
      return;
    }

    /* --- company page: filter chips --- */
    var topicBtn = e.target.closest("[data-iv-topic]");
    if (topicBtn && onCompanyRoute()) {
      state.topic = topicBtn.getAttribute("data-iv-topic");
      redrawQuestions();
      return;
    }

    var levelBtn = e.target.closest("[data-iv-level]");
    if (levelBtn && onCompanyRoute()) {
      state.level = levelBtn.getAttribute("data-iv-level");
      redrawQuestions();
      return;
    }

    var progBtn = e.target.closest("[data-iv-progress]");
    if (progBtn && onCompanyRoute()) {
      state.progressFilter = progBtn.getAttribute("data-iv-progress");
      redrawQuestions();
      return;
    }

    if (e.target.closest("#ivResetFilters")) {
      state.topic = "all";
      state.level = "all";
      state.progressFilter = "all";
      state.query = "";
      var box = document.getElementById("ivQuestionSearch");
      if (box) box.value = "";
      redrawQuestions();
      return;
    }

    /* --- nudge --- */
    var nudgeBtn = e.target.closest("[data-iv-nudge]");
    if (nudgeBtn) {
      var nId = nudgeBtn.getAttribute("data-iv-nudge");
      var nPanel = document.getElementById("nudge-" + nId);
      if (nPanel) {
        var opening = nPanel.hidden;
        nPanel.hidden = !opening;
        nudgeBtn.classList.toggle("is-on", opening);
        nudgeBtn.setAttribute("aria-expanded", opening ? "true" : "false");
        var nLabel = nudgeBtn.querySelector("span");
        if (nLabel) nLabel.textContent = opening ? "Hide nudge" : "Nudge";
      }
      return;
    }

    /* --- full answer --- */
    var ansBtn = e.target.closest("[data-iv-answer]");
    if (ansBtn) {
      var aId = ansBtn.getAttribute("data-iv-answer");
      var aPanel = document.getElementById("ans-" + aId);
      if (aPanel) {
        var open = aPanel.hidden;
        aPanel.hidden = !open;
        ansBtn.classList.toggle("is-on", open);
        ansBtn.setAttribute("aria-expanded", open ? "true" : "false");
        var aLabel = ansBtn.querySelector("span");
        if (aLabel) aLabel.textContent = open ? "Hide answer" : "Full answer";
      }
      return;
    }

    /* --- self-assessment marks --- */
    var markBtn = e.target.closest("[data-iv-mark]");
    if (markBtn) {
      var qid = markBtn.getAttribute("data-iv-mark");
      var wanted = markBtn.getAttribute("data-mark");
      var now = setMark(qid, wanted);

      var card = document.getElementById("q-" + qid);
      if (card) {
        card.classList.remove("is-" + SOLID, "is-" + REVISIT);
        if (now) card.classList.add("is-" + now);

        card.querySelectorAll("[data-iv-mark]").forEach(function (b) {
          b.classList.toggle("is-on", b.getAttribute("data-mark") === now);
        });

        var top = card.querySelector(".iv-q-top");
        if (top) {
          var badge = top.querySelector(".iv-q-mark");
          if (badge) badge.remove();
          if (now) {
            var span = document.createElement("span");
            span.className = "iv-q-mark is-" + now;
            span.innerHTML = TD.icon(now === SOLID ? "check" : "refresh") +
              (now === SOLID ? "Solid" : "Revisit");
            top.appendChild(span);
          }
        }
      }

      refreshProgressCard();
      /* If the reader is filtering by progress, the card they just marked may
         no longer belong in the list — redraw so the filter stays honest. */
      if (state.progressFilter !== "all") redrawQuestions();
      else {
        var all = questionsFor(currentCompanyId());
        refreshChipCounts(all, readProgress());
      }
      return;
    }

    /* --- expand / collapse all --- */
    var expandBtn = e.target.closest("#ivExpandAll");
    if (expandBtn) {
      state.expandAll = !state.expandAll;
      applyExpandAll(state.expandAll);
      expandBtn.innerHTML = TD.icon(state.expandAll ? "chevronUp" : "chevronDown") +
        "<span>" + (state.expandAll ? "Collapse all" : "Expand all") + "</span>";
      return;
    }

    /* --- reset progress for this company --- */
    var resetBtn = e.target.closest("#ivResetProgress");
    if (resetBtn) {
      var ids = questionsFor(currentCompanyId()).map(function (q) { return q.id; });
      var map = readProgress();
      ids.forEach(function (id) { delete map[id]; });
      writeProgress(map);
      var view = document.getElementById("view");
      if (view && onCompanyRoute()) view.innerHTML = TD.viewCompanyQuestions(currentCompanyId());
      return;
    }
  });

  document.addEventListener("input", function (e) {
    if (!e.target) return;

    if (e.target.id === "ivCompanySearch") {
      state.companyQuery = e.target.value;
      var dir = document.getElementById("ivDirectory");
      if (dir) dir.innerHTML = directoryGrid();
      return;
    }

    if (e.target.id === "ivQuestionSearch") {
      state.query = e.target.value;
      redrawQuestions();
    }
  });

  /* Leaving the section resets the transient view state. Filters that survive
     a navigation away and back are confusing — the reader has forgotten they
     set them and the page looks broken. */
  window.addEventListener("hashchange", function () {
    if (!onCompanyRoute() && !onInterviewsRoute()) {
      state.topic = "all";
      state.level = "all";
      state.progressFilter = "all";
      state.query = "";
      state.expandAll = false;
    }
  });
})(window.TD = window.TD || {});
