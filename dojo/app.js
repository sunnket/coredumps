/* =============================================================================
   Blueprint Dojo
   A tracing trainer for Python interview questions. The editor stacks a faded
   "blueprint" of the reference solution under a transparent textarea, so you
   type over the lines and watch the colour solidify as you get them right.
   ========================================================================== */

(function () {
  "use strict";

  var PROBLEMS = window.PROBLEMS || [];
  var STORE_KEY = "blueprint-dojo/v1";

  /* ---------------------------------------------------------------- state */

  var state = {
    id: null,
    assist: "full",
    fontSize: 14,
    theme: "auto",
    filters: { text: "", diff: {}, status: null, company: "" },
    sort: "curriculum",
    peeking: false
  };

  var save = { progress: {}, meta: {} };
  var timer = { seconds: 0, keys: 0, lastKey: 0, handle: null };
  var byId = {};
  PROBLEMS.forEach(function (p, i) { p._i = i; byId[p.id] = p; });

  /* -------------------------------------------------------------- storage */

  function load() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (raw) {
        var data = JSON.parse(raw);
        save.progress = data.progress || {};
        save.meta = data.meta || {};
      }
    } catch (e) { /* private mode, corrupt payload - start fresh */ }
    state.assist = save.meta.assist || "full";
    state.fontSize = save.meta.fontSize || 14;
    state.theme = save.meta.theme || "auto";
  }

  function persist() {
    save.meta.assist = state.assist;
    save.meta.fontSize = state.fontSize;
    save.meta.theme = state.theme;
    save.meta.last = state.id;
    try { localStorage.setItem(STORE_KEY, JSON.stringify(save)); } catch (e) { /* quota or blocked */ }
  }

  function rec(id) {
    if (!save.progress[id]) save.progress[id] = { status: null, flag: false, notes: "", hints: 0, best: null, seconds: 0 };
    return save.progress[id];
  }

  function today() {
    var d = new Date();
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  }

  function touchStreak() {
    var t = today();
    if (save.meta.lastDay === t) return;
    var yest = new Date(Date.now() - 864e5);
    var y = yest.getFullYear() + "-" + (yest.getMonth() + 1) + "-" + yest.getDate();
    save.meta.streak = save.meta.lastDay === y ? (save.meta.streak || 0) + 1 : 1;
    save.meta.lastDay = t;
    persist();
  }

  /* ------------------------------------------------------------- elements */

  function $(id) { return document.getElementById(id); }

  var els = {
    app: $("app"), input: $("input"), layer: $("layer"), gutter: $("gutter"),
    sheet: $("sheet"), libList: $("libList"), libCount: $("libCount"),
    search: $("search"), companyFilter: $("companyFilter"), sortBy: $("sortBy"),
    title: $("pTitle"), meta: $("pMeta"), statement: $("pStatement"),
    examples: $("pExamples"), constraints: $("pConstraints"), brief: $("brief"),
    context: $("pContext"),
    hints: $("pHints"), tests: $("pTests"), notes: $("notes"),
    approachSlot: $("approachSlot"), solutionSlot: $("solutionSlot"),
    pTime: $("pTime"), pSpace: $("pSpace"),
    accuracy: $("rAccuracy"), timerOut: $("rTimer"), wpm: $("rWpm"), track: $("rTrack"),
    verdict: $("verdict"), assistSeg: $("assistSeg"),
    sSolved: $("sSolved"), sAttempted: $("sAttempted"), sStreak: $("sStreak"), sTime: $("sTime")
  };

  /* ------------------------------------------------- python line tokenizer */

  var KEYWORDS = ["def", "class", "return", "if", "elif", "else", "for", "while", "in",
    "not", "and", "or", "is", "None", "True", "False", "import", "from", "as", "with",
    "try", "except", "finally", "raise", "yield", "lambda", "global", "nonlocal",
    "pass", "break", "continue", "assert", "del", "async", "await"];

  var BUILTINS = ["len", "range", "max", "min", "sum", "sorted", "set", "dict", "list",
    "tuple", "str", "int", "float", "bool", "abs", "enumerate", "zip", "map", "filter",
    "print", "any", "all", "reversed", "divmod", "ord", "chr", "iter", "next", "round",
    "isinstance", "type", "self", "super", "open", "format", "heapq", "bisect", "deque",
    "OrderedDict", "collections", "functools"];

  var KW = {}, BI = {};
  KEYWORDS.forEach(function (w) { KW[w] = 1; });
  BUILTINS.forEach(function (w) { BI[w] = 1; });

  var tokenCache = {};

  function tokenize(line) {
    if (tokenCache[line]) return tokenCache[line];
    var out = [], i = 0, n = line.length;
    while (i < n) {
      var ch = line[i];
      if (ch === "#") { out.push({ s: i, e: n, c: "cm" }); break; }
      if (ch === '"' || ch === "'") {
        var j = i + 1;
        while (j < n) {
          if (line[j] === "\\") { j += 2; continue; }
          if (line[j] === ch) { j++; break; }
          j++;
        }
        if (j > n) j = n;
        out.push({ s: i, e: j, c: "st" });
        i = j;
        continue;
      }
      if (ch >= "0" && ch <= "9") {
        var k = i;
        while (k < n && /[0-9_.]/.test(line[k])) k++;
        out.push({ s: i, e: k, c: "nm" });
        i = k;
        continue;
      }
      if (/[A-Za-z_]/.test(ch)) {
        var m = i;
        while (m < n && /[A-Za-z0-9_]/.test(line[m])) m++;
        var word = line.slice(i, m);
        var cls = KW[word] ? "kw" : BI[word] ? "bi" : line[m] === "(" ? "fn" : "id";
        out.push({ s: i, e: m, c: cls });
        i = m;
        continue;
      }
      if (/\s/.test(ch)) {
        var w = i;
        while (w < n && /\s/.test(line[w])) w++;
        out.push({ s: i, e: w, c: null });
        i = w;
        continue;
      }
      var o = i;
      while (o < n && !/[\sA-Za-z0-9_'"#]/.test(line[o])) o++;
      out.push({ s: i, e: o, c: "op" });
      i = o;
    }
    if (Object.keys(tokenCache).length > 4000) tokenCache = {};
    tokenCache[line] = out;
    return out;
  }

  function esc(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  /* Render characters [from, to) of `line`, coloured by its own tokens. */
  function paint(line, from, to) {
    if (from >= to) return "";
    var toks = tokenize(line), html = "";
    for (var i = 0; i < toks.length; i++) {
      var t = toks[i];
      var s = t.s > from ? t.s : from;
      var e = t.e < to ? t.e : to;
      if (s >= e) continue;
      var text = esc(line.slice(s, e));
      html += t.c ? '<span class="' + t.c + '">' + text + "</span>" : text;
    }
    return html;
  }

  function commonPrefix(a, b) {
    var n = a.length < b.length ? a.length : b.length, i = 0;
    while (i < n && a[i] === b[i]) i++;
    return i;
  }

  /* An outline keeps the shape - indentation and the opening word - and hides
     everything that would give the answer away. */
  function outlineOf(line) {
    var indent = line.match(/^\s*/)[0];
    var body = line.slice(indent.length);
    if (!body) return "";
    var first = (body.match(/^[A-Za-z_][A-Za-z0-9_]*/) || body.match(/^\S+/) || [""])[0];
    var rest = body.slice(first.length).trim();
    return indent + first + (rest ? " …" : "");
  }

  /* -------------------------------------------------------------- the sheet */

  var current = null;
  var solLines = [];
  var ghostLines = [];

  function assistNow() {
    return state.peeking ? "full" : state.assist;
  }

  function buildGhost() {
    var mode = assistNow();
    if (mode === "off") ghostLines = [];
    else if (mode === "full") ghostLines = solLines.slice();
    else ghostLines = solLines.map(outlineOf);
  }

  function renderSheet() {
    if (!current) return;
    var mode = assistNow();
    var typed = els.input.value;
    var typedLines = typed.split("\n");
    var total = Math.max(typedLines.length, ghostLines.length);

    var html = "", gut = "";
    var doneLines = 0, matchedChars = 0, wrongChars = 0;
    var caretLine = typed.slice(0, els.input.selectionStart).split("\n").length - 1;

    for (var i = 0; i < total; i++) {
      var t = i < typedLines.length ? typedLines[i] : null;
      var s = solLines[i] !== undefined ? solLines[i] : "";
      var g = ghostLines[i] !== undefined ? ghostLines[i] : "";
      var body = "";
      var done = false;

      if (t === null) {
        body = '<span class="gh">' + paint(g, 0, g.length) + "</span>";
      } else if (mode === "off") {
        body = paint(t, 0, t.length);
        if (t === s && t.trim() !== "") done = true;
      } else {
        var p = commonPrefix(t, s);
        matchedChars += p;
        body = paint(s, 0, p);
        if (p < t.length) {
          wrongChars += t.length - p;
          body += '<span class="bad-char">' + esc(t.slice(p)) + "</span>";
        }
        if (g.length > t.length) {
          body += '<span class="gh">' + paint(g, t.length, g.length) + "</span>";
        }
        if (t === s && t.trim() !== "") done = true;
      }

      if (done) doneLines++;
      html += '<span class="ln">' + body + "</span>";

      var cls = [];
      if (done && mode !== "off") cls.push("done");
      if (i === caretLine) cls.push("here");
      gut += "<div" + (cls.length ? ' class="' + cls.join(" ") + '"' : "") + ">" + (i + 1) + "</div>";
    }

    els.layer.innerHTML = html;
    els.gutter.innerHTML = gut;

    var realLines = 0;
    for (var k = 0; k < solLines.length; k++) if (solLines[k].trim() !== "") realLines++;

    if (mode === "off") {
      els.accuracy.textContent = "—";
      els.accuracy.parentNode.className = "readout";
      els.track.style.width = "0%";
    } else {
      // the newlines between matched lines count toward the reference length too
      var joins = Math.min(typedLines.length, solLines.length) - 1;
      if (joins > 0) matchedChars += joins;
      var pct = Math.round((matchedChars / Math.max(1, current.solution.length)) * 100);
      els.accuracy.textContent = pct + "%";
      els.accuracy.parentNode.className = "readout " + (wrongChars ? "is-bad" : pct >= 99 ? "is-good" : "");
      els.track.style.width = Math.round((doneLines / Math.max(1, realLines)) * 100) + "%";
    }
  }

  /* ------------------------------------------------------- editing helpers */

  function setRange(start, end, text) {
    els.input.focus();
    els.input.setSelectionRange(start, end);
    var ok = false;
    try { ok = document.execCommand("insertText", false, text); } catch (e) { ok = false; }
    if (!ok) {
      var v = els.input.value;
      els.input.value = v.slice(0, start) + text + v.slice(end);
      els.input.setSelectionRange(start + text.length, start + text.length);
    }
    onEdit();
  }

  function lineBounds(pos) {
    var v = els.input.value;
    var start = v.lastIndexOf("\n", pos - 1) + 1;
    var end = v.indexOf("\n", pos);
    if (end === -1) end = v.length;
    return { start: start, end: end, text: v.slice(start, end) };
  }

  function lineIndexAt(pos) {
    return els.input.value.slice(0, pos).split("\n").length - 1;
  }

  function handleKey(e) {
    var input = els.input;
    var pos = input.selectionStart;
    var endPos = input.selectionEnd;

    if (e.key === "Tab") {
      e.preventDefault();
      var lb = lineBounds(pos);
      if (e.shiftKey) {
        var lead = lb.text.match(/^ {1,4}/);
        if (lead) setRange(lb.start, lb.start + lead[0].length, "");
      } else if (pos !== endPos) {
        setRange(pos, endPos, "    ");
      } else {
        setRange(pos, pos, "    ");
      }
      return;
    }

    if (e.key === "Enter" && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      var cur = lineBounds(pos);
      var idx = lineIndexAt(pos);
      var indent;
      var next = solLines[idx + 1];
      if (assistNow() !== "off" && next !== undefined && next.trim() !== "" && cur.text === solLines[idx]) {
        indent = next.match(/^\s*/)[0];
      } else {
        indent = cur.text.match(/^\s*/)[0];
        if (/:\s*$/.test(cur.text)) indent += "    ";
      }
      setRange(pos, endPos, "\n" + indent);
      return;
    }

    if (e.code === "Space" && e.ctrlKey) {
      e.preventDefault();
      var b = lineBounds(pos);
      var want = solLines[lineIndexAt(pos)];
      if (want !== undefined && want !== b.text) setRange(b.start, b.end, want);
      return;
    }

    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      compare();
    }
  }

  /* ------------------------------------------------------------- the clock */

  function tick() {
    if (Date.now() - timer.lastKey < 20000) {
      timer.seconds++;
      var r = rec(state.id);
      r.seconds = (r.seconds || 0) + 1;
      save.meta.totalSeconds = (save.meta.totalSeconds || 0) + 1;
      if (timer.seconds % 15 === 0) { persist(); paintStats(); }
    }
    var m = Math.floor(timer.seconds / 60), s = timer.seconds % 60;
    els.timerOut.textContent = m + ":" + (s < 10 ? "0" : "") + s;
    var mins = timer.seconds / 60;
    els.wpm.textContent = mins > 0.08 ? Math.round(timer.keys / 5 / mins) : 0;
  }

  function onEdit() {
    renderSheet();
    if (state.id) {
      var r = rec(state.id);
      if (!r.status) { r.status = "attempted"; renderLibrary(); paintStats(); persist(); }
    }
  }

  /* -------------------------------------------------------------- checking */

  function normalize(code) {
    return code.split("\n").map(function (l) { return l.replace(/\s+$/, ""); })
      .filter(function (l) { return l.trim() !== ""; });
  }

  function compare() {
    if (!current) return;
    var mine = normalize(els.input.value);
    var ref = normalize(current.solution);

    if (!mine.length) {
      setVerdict("Nothing written yet — start typing over the blueprint.", "");
      return;
    }

    if (mine.join("\n") === ref.join("\n")) {
      markSolved();
      setVerdict("Character-for-character match with the reference. Solved.", "ok");
      return;
    }

    var mineTrim = mine.map(function (l) { return l.trim(); }).join("\n");
    var refTrim = ref.map(function (l) { return l.trim(); }).join("\n");
    if (mineTrim === refTrim) {
      markSolved();
      setVerdict("Matches the reference — your indentation differs, which Python cares about.", "near");
      return;
    }

    var i = 0;
    while (i < mine.length && i < ref.length && mine[i] === ref[i]) i++;
    var where = i + 1;
    var expected = ref[i] === undefined ? "(nothing — your version is longer)" : ref[i].trim();
    setVerdict("First difference at line " + where + ". Reference has: ", "off", expected);
    if (state.id) { rec(state.id).status = rec(state.id).status || "attempted"; }
  }

  function setVerdict(text, cls, code) {
    els.verdict.className = "verdict" + (cls ? " " + cls : "");
    els.verdict.textContent = text;
    if (code) {
      var span = document.createElement("span");
      span.className = "mono";
      span.textContent = code;
      els.verdict.appendChild(span);
    }
  }

  function markSolved() {
    var r = rec(state.id);
    r.status = "solved";
    if (r.best === null || timer.seconds < r.best) r.best = timer.seconds;
    touchStreak();
    persist();
    renderLibrary();
    paintStats();
  }

  /* --------------------------------------------------------------- loading */

  function loadProblem(id, keepScroll) {
    var p = byId[id];
    if (!p) return;
    current = p;
    state.id = id;
    solLines = p.solution.split("\n");
    buildGhost();

    timer.seconds = rec(id).seconds || 0;
    timer.keys = 0;
    timer.lastKey = 0;

    els.title.textContent = p.title;
    els.statement.innerHTML = markup(p.statement);

    var freq = '<span class="freq" title="Asked in interviews: ' + p.freq + ' of 5">';
    for (var f = 1; f <= 5; f++) freq += "<i" + (f <= p.freq ? ' class="on"' : "") + "></i>";
    freq += "</span>";

    els.meta.innerHTML =
      '<span class="tag ' + p.diff.toLowerCase() + '">' + p.diff + "</span>" +
      "<span>" + esc(p.pattern) + "</span>" + freq +
      p.companies.map(function (c) { return '<span class="co">' + esc(c) + "</span>"; }).join("");

    els.examples.innerHTML = p.examples.map(function (ex) {
      return '<div class="example"><div><b>in  </b>' + esc(ex[0]) + "</div>" +
        '<div><b>out </b><span class="out">' + esc(ex[1]) + "</span></div>" +
        (ex[2] ? '<div class="note">' + esc(ex[2]) + "</div>" : "") + "</div>";
    }).join("");

    els.constraints.innerHTML = p.constraints.map(function (c) {
      return "<li>" + esc(c) + "</li>";
    }).join("");

    var testHtml = p.tests.map(function (t) {
      return '<div class="test">' + esc(t) + "</div>";
    }).join("");
    if (p.harness) {
      testHtml += '<div class="prose" style="margin-top:8px;font-size:11.5px;color:var(--ink-faint)">' +
        "Scaffold the assertions above use:</div>" +
        '<div class="test" style="margin-top:4px">' + esc(p.harness) + "</div>";
    }
    els.tests.innerHTML = testHtml;

    els.pTime.textContent = p.time;
    els.pSpace.textContent = p.space;

    renderHints();
    renderApproach(false);
    renderSolution(false);

    if (p.context) {
      var ctxLines = p.context.split("\n").map(function (l) { return paint(l, 0, l.length) || "&nbsp;"; });
      els.context.innerHTML = '<div class="label">Given to you</div><div class="given">' +
        ctxLines.join("\n") + "</div>";
    } else {
      els.context.innerHTML = "";
    }

    els.notes.value = rec(id).notes || "";
    els.input.value = "";
    setVerdict("Type over the faded blueprint. Tab indents, Ctrl+Space completes the line.", "");

    document.getElementById("btnFlag").textContent = rec(id).flag ? "★ Flagged" : "☆ Flag";

    renderSheet();
    renderLibrary();
    persist();
    if (!keepScroll) els.sheet.scrollTop = 0;
    if (window.innerWidth > 860) els.input.focus();
    els.app.removeAttribute("data-lib");
  }

  /* Light markdown: **bold** and `code`. */
  function markup(text) {
    return esc(text)
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/`([^`]+)`/g, "<code>$1</code>");
  }

  function renderHints() {
    var shown = rec(state.id).hints || 0;
    var out = "";
    for (var i = 0; i < current.hints.length; i++) {
      if (i < shown) {
        out += '<div class="hint"><b>' + (i + 1) + '</b><span>' + markup(current.hints[i]) + "</span></div>";
      }
    }
    if (!shown) out = '<div class="prose" style="color:var(--ink-faint)">' + current.hints.length +
      " hints available. They go from a nudge to nearly the answer.</div>";
    else if (shown >= current.hints.length) out += '<div class="prose" style="color:var(--ink-faint);margin-top:8px">No hints left.</div>';
    els.hints.innerHTML = out;
  }

  function renderApproach(show) {
    if (show) {
      els.approachSlot.innerHTML = '<div class="prose">' + markup(current.approach) + "</div>";
    } else {
      els.approachSlot.innerHTML = '<button class="locked" id="revealApproach">Reveal the approach</button>';
      $("revealApproach").onclick = function () { renderApproach(true); };
    }
  }

  function renderSolution(show) {
    var btn = $("btnSolution");
    if (show) {
      var lines = current.solution.split("\n").map(function (l) { return paint(l, 0, l.length) || "&nbsp;"; });
      els.solutionSlot.innerHTML = '<div class="solution-view">' + lines.join("\n") + "</div>";
      btn.textContent = "Hide";
    } else {
      els.solutionSlot.innerHTML = "";
      btn.textContent = "Show";
    }
    btn.dataset.shown = show ? "1" : "";
  }

  /* --------------------------------------------------------------- library */

  function passesFilter(p) {
    var f = state.filters;
    if (f.text) {
      var hay = (p.title + " " + p.pattern + " " + p.companies.join(" ") + " " + p.diff).toLowerCase();
      if (hay.indexOf(f.text) === -1) return false;
    }
    var diffs = Object.keys(f.diff).filter(function (k) { return f.diff[k]; });
    if (diffs.length && diffs.indexOf(p.diff) === -1) return false;
    if (f.company && p.companies.indexOf(f.company) === -1) return false;
    var r = save.progress[p.id];
    if (f.status === "todo" && r && r.status === "solved") return false;
    if (f.status === "flagged" && !(r && r.flag)) return false;
    return true;
  }

  function sortList(list) {
    var order = { Easy: 0, Medium: 1, Hard: 2 };
    var copy = list.slice();
    if (state.sort === "freq") copy.sort(function (a, b) { return b.freq - a.freq || a._i - b._i; });
    else if (state.sort === "diff") copy.sort(function (a, b) { return order[a.diff] - order[b.diff] || b.freq - a.freq; });
    else if (state.sort === "title") copy.sort(function (a, b) { return a.title.localeCompare(b.title); });
    return copy;
  }

  function itemHtml(p) {
    var r = save.progress[p.id] || {};
    var dot = "dot" + (r.status === "solved" ? " is-solved" : r.status ? " is-attempted" : "");
    return '<button class="item" data-id="' + p.id + '"' + (p.id === state.id ? ' aria-current="true"' : "") + ">" +
      '<span class="' + dot + '"></span>' +
      '<span class="item-title">' + esc(p.title) + (r.flag ? ' <span class="flag">★</span>' : "") + "</span>" +
      '<span class="tag ' + p.diff.toLowerCase() + '">' + p.diff[0] + "</span></button>";
  }

  function renderLibrary() {
    var list = PROBLEMS.filter(passesFilter);
    els.libCount.textContent = list.length + " shown · " +
      list.filter(function (p) { return (save.progress[p.id] || {}).status === "solved"; }).length + " solved";

    var html = "";
    if (!list.length) {
      html = '<div class="empty">Nothing matches those filters.</div>';
    } else if (state.sort === "curriculum") {
      var groups = [], seen = {};
      list.forEach(function (p) {
        if (!seen[p.pattern]) { seen[p.pattern] = []; groups.push(p.pattern); }
        seen[p.pattern].push(p);
      });
      groups.forEach(function (g) {
        var solved = seen[g].filter(function (p) { return (save.progress[p.id] || {}).status === "solved"; }).length;
        html += '<button class="group-head"><b>' + esc(g) + '</b><span class="rule"></span><em>' +
          solved + "/" + seen[g].length + "</em></button>";
        html += seen[g].map(itemHtml).join("");
      });
    } else {
      html = sortList(list).map(itemHtml).join("");
    }
    els.libList.innerHTML = html;
  }

  function paintStats() {
    var solved = 0, attempted = 0;
    Object.keys(save.progress).forEach(function (k) {
      var s = save.progress[k].status;
      if (s === "solved") solved++;
      else if (s) attempted++;
    });
    els.sSolved.textContent = solved + "/" + PROBLEMS.length;
    els.sAttempted.textContent = attempted;
    els.sStreak.textContent = (save.meta.streak || 0) + "d";
    var mins = Math.round((save.meta.totalSeconds || 0) / 60);
    els.sTime.textContent = mins >= 60 ? (mins / 60).toFixed(1) + "h" : mins + "m";
  }

  /* ----------------------------------------------------------- navigation */

  function visibleList() {
    var list = PROBLEMS.filter(passesFilter);
    return state.sort === "curriculum" ? list : sortList(list);
  }

  function step(delta) {
    var list = visibleList();
    if (!list.length) return;
    var idx = -1;
    for (var i = 0; i < list.length; i++) if (list[i].id === state.id) idx = i;
    var next = list[(idx + delta + list.length) % list.length];
    loadProblem(next.id);
  }

  function nextUnsolved() {
    var start = current ? current._i : -1;
    for (var n = 1; n <= PROBLEMS.length; n++) {
      var p = PROBLEMS[(start + n) % PROBLEMS.length];
      if ((save.progress[p.id] || {}).status !== "solved") { loadProblem(p.id); return; }
    }
    setVerdict("Every problem is solved. That is the whole bank.", "ok");
  }

  function randomProblem() {
    loadProblem(PROBLEMS[Math.floor(Math.random() * PROBLEMS.length)].id);
  }

  /* ------------------------------------------------------------------ wire */

  function setAssist(mode) {
    state.assist = mode;
    Array.prototype.forEach.call(els.assistSeg.children, function (b) {
      b.setAttribute("aria-pressed", b.dataset.assist === mode ? "true" : "false");
    });
    buildGhost();
    renderSheet();
    persist();
  }

  function setFont(size) {
    state.fontSize = Math.max(11, Math.min(22, size));
    document.documentElement.style.setProperty("--fs", state.fontSize + "px");
    persist();
  }

  function applyTheme() {
    if (state.theme === "auto") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", state.theme);
  }

  function buildCompanyFilter() {
    var counts = {};
    PROBLEMS.forEach(function (p) {
      p.companies.forEach(function (c) { counts[c] = (counts[c] || 0) + 1; });
    });
    var names = Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a] || a.localeCompare(b); });
    var html = '<option value="">All companies</option>';
    names.forEach(function (n) { html += '<option value="' + esc(n) + '">' + esc(n) + " (" + counts[n] + ")</option>"; });
    els.companyFilter.innerHTML = html;
  }

  function wire() {
    els.input.addEventListener("input", function () {
      timer.lastKey = Date.now();
      timer.keys++;
      onEdit();
    });
    els.input.addEventListener("keydown", handleKey);
    ["click", "keyup"].forEach(function (evt) {
      els.input.addEventListener(evt, function () { renderSheet(); });
    });

    els.libList.addEventListener("click", function (e) {
      var item = e.target.closest(".item");
      if (item) loadProblem(item.dataset.id);
    });

    els.search.addEventListener("input", function () {
      state.filters.text = els.search.value.trim().toLowerCase();
      renderLibrary();
    });

    document.getElementById("diffFilters").addEventListener("click", function (e) {
      var chip = e.target.closest(".chip");
      if (!chip) return;
      if (chip.dataset.diff) {
        state.filters.diff[chip.dataset.diff] = !state.filters.diff[chip.dataset.diff];
        chip.setAttribute("aria-pressed", state.filters.diff[chip.dataset.diff] ? "true" : "false");
      } else {
        var s = chip.dataset.status;
        state.filters.status = state.filters.status === s ? null : s;
        Array.prototype.forEach.call(chip.parentNode.querySelectorAll("[data-status]"), function (c) {
          c.setAttribute("aria-pressed", c.dataset.status === state.filters.status ? "true" : "false");
        });
      }
      renderLibrary();
    });

    els.companyFilter.addEventListener("change", function () {
      state.filters.company = els.companyFilter.value;
      renderLibrary();
    });

    els.sortBy.addEventListener("change", function () {
      state.sort = els.sortBy.value;
      renderLibrary();
    });

    els.assistSeg.addEventListener("click", function (e) {
      var b = e.target.closest("button");
      if (b) setAssist(b.dataset.assist);
    });

    $("fontUp").onclick = function () { setFont(state.fontSize + 1); };
    $("fontDown").onclick = function () { setFont(state.fontSize - 1); };

    $("btnCheck").onclick = compare;
    $("btnReset").onclick = function () {
      els.input.value = "";
      timer.keys = 0;
      renderSheet();
      setVerdict("Sheet cleared.", "");
      els.input.focus();
    };
    $("btnSolved").onclick = function () {
      markSolved();
      setVerdict("Marked solved.", "ok");
    };

    $("btnHint").onclick = function () {
      var r = rec(state.id);
      if (r.hints < current.hints.length) { r.hints++; persist(); renderHints(); }
    };

    $("btnSolution").onclick = function () {
      renderSolution(!$("btnSolution").dataset.shown);
    };

    $("btnFlag").onclick = function () {
      var r = rec(state.id);
      r.flag = !r.flag;
      $("btnFlag").textContent = r.flag ? "★ Flagged" : "☆ Flag";
      persist();
      renderLibrary();
    };

    $("btnBrief").onclick = function () {
      var hidden = els.brief.hasAttribute("hidden");
      if (hidden) els.brief.removeAttribute("hidden"); else els.brief.setAttribute("hidden", "");
      $("btnBrief").textContent = hidden ? "Hide brief" : "Show brief";
    };

    els.notes.addEventListener("input", function () {
      rec(state.id).notes = els.notes.value;
      persist();
    });

    $("btnNext").onclick = nextUnsolved;
    $("btnRandom").onclick = randomProblem;
    $("btnKeys").onclick = function () { $("keysDialog").showModal(); };
    $("btnTheme").onclick = function () {
      state.theme = state.theme === "auto" ? "light" : state.theme === "light" ? "dark" : "auto";
      applyTheme();
      persist();
      setVerdict("Theme: " + state.theme + ".", "");
    };

    $("libToggle").onclick = function () {
      els.app.setAttribute("data-lib", els.app.getAttribute("data-lib") === "open" ? "" : "open");
    };
    $("coachToggle").onclick = function () {
      els.app.setAttribute("data-coach", els.app.getAttribute("data-coach") === "open" ? "" : "open");
    };

    $("btnData").onclick = function () {
      $("ioBox").value = JSON.stringify(save);
      $("ioMsg").textContent = "";
      $("dataDialog").showModal();
    };
    $("btnCopy").onclick = function () {
      var box = $("ioBox");
      box.select();
      var done = false;
      try { done = document.execCommand("copy"); } catch (e) { done = false; }
      if (!done && navigator.clipboard) navigator.clipboard.writeText(box.value).then(function () {
        $("ioMsg").textContent = "Copied.";
      });
      else $("ioMsg").textContent = done ? "Copied." : "Select the text and copy it manually.";
    };
    $("btnLoad").onclick = function () {
      try {
        var data = JSON.parse($("ioBox").value);
        save.progress = data.progress || {};
        save.meta = data.meta || {};
        persist();
        renderLibrary();
        paintStats();
        renderHints();
        els.notes.value = rec(state.id).notes || "";
        $("ioMsg").textContent = "Progress restored.";
      } catch (e) {
        $("ioMsg").textContent = "That is not valid progress data — paste the whole block, braces included.";
      }
    };
    $("btnWipe").onclick = function () {
      save.progress = {};
      save.meta = { assist: state.assist, fontSize: state.fontSize, theme: state.theme };
      persist();
      renderLibrary();
      paintStats();
      $("ioBox").value = JSON.stringify(save);
      $("ioMsg").textContent = "Progress erased.";
    };

    Array.prototype.forEach.call(document.querySelectorAll("[data-close]"), function (b) {
      b.onclick = function () { b.closest("dialog").close(); };
    });

    document.addEventListener("keydown", function (e) {
      var typing = e.target === els.input || e.target === els.notes || e.target === els.search;

      if (e.altKey && !e.ctrlKey && !e.metaKey) {
        var k = e.key.toLowerCase();
        if (k === "b") { e.preventDefault(); setAssist(state.assist === "full" ? "outline" : state.assist === "outline" ? "off" : "full"); return; }
        if (k === "r") { e.preventDefault(); randomProblem(); return; }
        if (e.key === "ArrowDown") { e.preventDefault(); step(1); return; }
        if (e.key === "ArrowUp") { e.preventDefault(); step(-1); return; }
        if (k === "p" && !state.peeking) {
          e.preventDefault();
          state.peeking = true;
          buildGhost();
          renderSheet();
          return;
        }
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        els.app.setAttribute("data-lib", "open");
        els.search.focus();
        els.search.select();
        return;
      }

      if (e.key === "?" && !typing) { e.preventDefault(); $("keysDialog").showModal(); }
    });

    document.addEventListener("keyup", function (e) {
      if (state.peeking && (e.key === "Alt" || e.key.toLowerCase() === "p")) {
        state.peeking = false;
        buildGhost();
        renderSheet();
      }
    });

    window.addEventListener("blur", function () {
      if (state.peeking) { state.peeking = false; buildGhost(); renderSheet(); }
    });
  }

  /* ------------------------------------------------------------------ boot */

  function boot() {
    load();
    applyTheme();
    setFont(state.fontSize);
    buildCompanyFilter();
    wire();
    setAssist(state.assist);
    paintStats();

    document.getElementById("brandCount").textContent = PROBLEMS.length + " problems";
    var startId = (save.meta.last && byId[save.meta.last]) ? save.meta.last : PROBLEMS[0].id;
    loadProblem(startId);
    renderLibrary();

    timer.handle = setInterval(tick, 1000);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
