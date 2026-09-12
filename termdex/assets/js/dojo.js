/* CoreDumps Code Dojo — the writing trainer.

   Reading a solution and being able to produce one under interview pressure
   are different skills, and only the second gets tested. So this section is
   not a reader: it is a sheet you write on.

   Underneath the cursor sits a *blueprint* — the reference solution rendered
   faint, in the same syntax colours the rest of the product uses for code.
   You type over it. Characters that match the reference paint solid; ones
   that diverge go red; the rest of the line stays faint ahead of the caret.
   Three levels, because the point is to stop needing it:

     blueprint   the whole solution, faint. First contact with a problem.
     outline     indentation and the opening word of each line. You remember
                 the shape but have to produce the body yourself.
     blank       nothing, and the match readout stays hidden until you ask
                 for it. Interview conditions.

   The editor is a transparent <textarea> stacked exactly on a <pre> that is
   re-rendered on every keystroke. Both share font, line-height and padding,
   and the line boxes are pinned in pixels, so the caret can never drift from
   the glyphs underneath it. That is the whole trick.

   Nothing here executes Python — there is no interpreter in the page and
   pretending otherwise would be a lie. "Compare with reference" is a text
   comparison against code that was executed, with its assertions checked, at
   the time the data file was generated.
*/
(function (TD) {
  "use strict";

  var esc = TD.esc;

  /* ---- python lexer ---------------------------------------------------
     The shared TD.hl highlighter returns finished HTML for a whole block,
     which cannot answer "colour characters 0..17 of this line and nothing
     else" — and that is exactly what tracing needs. So this one returns
     token ranges instead, and emits the same tok- classes so dojo code and
     lesson code look identical. */

  var KEYWORDS = ("def class return if elif else for while in not and or is None True False " +
    "import from as with try except finally raise yield lambda global nonlocal pass break " +
    "continue assert del async await").split(" ");

  var BUILTINS = ("len range max min sum sorted set dict list tuple str int float bool abs " +
    "enumerate zip map filter print any all reversed divmod ord chr iter next round isinstance " +
    "type self super open format heapq bisect deque OrderedDict collections functools").split(" ");

  var KW = Object.create(null), BI = Object.create(null);
  KEYWORDS.forEach(function (w) { KW[w] = 1; });
  BUILTINS.forEach(function (w) { BI[w] = 1; });

  var cache = Object.create(null);
  var cacheN = 0;

  function tokens(line) {
    if (cache[line]) return cache[line];
    var out = [], i = 0, n = line.length;
    while (i < n) {
      var ch = line[i];
      if (ch === "#") { out.push({ s: i, e: n, c: "tok-com" }); break; }
      if (ch === '"' || ch === "'") {
        var j = i + 1;
        while (j < n) {
          if (line[j] === "\\") { j += 2; continue; }
          if (line[j] === ch) { j++; break; }
          j++;
        }
        if (j > n) j = n;
        out.push({ s: i, e: j, c: "tok-str" });
        i = j;
        continue;
      }
      if (ch >= "0" && ch <= "9") {
        var k = i;
        while (k < n && /[0-9_.]/.test(line[k])) k++;
        out.push({ s: i, e: k, c: "tok-num" });
        i = k;
        continue;
      }
      if (/[A-Za-z_]/.test(ch)) {
        var m = i;
        while (m < n && /[A-Za-z0-9_]/.test(line[m])) m++;
        var word = line.slice(i, m);
        out.push({
          s: i, e: m,
          c: KW[word] ? "tok-kw" : BI[word] ? "tok-bi" : line[m] === "(" ? "tok-fn" : null
        });
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
      out.push({ s: i, e: o, c: "tok-op" });
      i = o;
    }
    if (cacheN > 4000) { cache = Object.create(null); cacheN = 0; }
    cache[line] = out;
    cacheN++;
    return out;
  }

  /* Characters [from, to) of one line, coloured by that line's own tokens. */
  function paint(line, from, to) {
    if (from >= to) return "";
    var t = tokens(line), html = "";
    for (var i = 0; i < t.length; i++) {
      var s = t[i].s > from ? t[i].s : from;
      var e = t[i].e < to ? t[i].e : to;
      if (s >= e) continue;
      var text = esc(line.slice(s, e));
      html += t[i].c ? '<span class="' + t[i].c + '">' + text + "</span>" : text;
    }
    return html;
  }

  /* Whole block, for the reference panel and the given-code block. */
  TD.pyBlock = function (code) {
    return code.split("\n").map(function (l) {
      return paint(l, 0, l.length) || "&nbsp;";
    }).join("\n");
  };

  function prefix(a, b) {
    var n = a.length < b.length ? a.length : b.length, i = 0;
    while (i < n && a[i] === b[i]) i++;
    return i;
  }

  /* An outline keeps the shape and hides the answer: indentation, the opening
     word, and a mark saying there is more on the line. */
  function outlineOf(line) {
    var indent = line.match(/^\s*/)[0];
    var body = line.slice(indent.length);
    if (!body) return "";
    var first = (body.match(/^[A-Za-z_][A-Za-z0-9_]*/) || body.match(/^\S+/) || [""])[0];
    return indent + first + (body.slice(first.length).trim() ? " …" : "");
  }

  function normalize(code) {
    return code.split("\n").map(function (l) { return l.replace(/\s+$/, ""); })
      .filter(function (l) { return l.trim() !== ""; });
  }

  /* ---- the mount ------------------------------------------------------ */

  TD.mountDojo = function (mount, K) {
    if (!mount || !K) return;

    var solLines = K.solution.split("\n");
    var ghost = [];
    var rec = TD.kataScore.rec(K.id);

    var assist = TD.store.get("dojo:assist", "full");
    var fontSize = TD.store.get("dojo:fs", 14);
    var peeking = false;
    var seconds = rec.seconds || 0;
    var keys = 0;
    var lastKey = 0;
    var clock = null;

    mount.innerHTML = shell();
    var input = mount.querySelector(".dj-input");
    var layer = mount.querySelector(".dj-layer");
    var gutter = mount.querySelector(".dj-gutter");
    var verdict = mount.querySelector(".dj-verdict");

    function shell() {
      var h = '<div class="dj-grid">';

      h += '<div class="dj-main">';
      h += '<div class="dj-bar">' +
        '<div class="dj-seg" role="group" aria-label="Blueprint level">' +
        seg("full", "Blueprint", "The whole solution, faint — type over it") +
        seg("outline", "Outline", "Indentation and the opening word of each line") +
        seg("off", "Blank", "Nothing. Interview conditions") +
        "</div>" +
        '<span class="dj-read" title="How much of the reference you have reproduced">' +
        "<u>match</u><b data-o=\"match\">—</b></span>" +
        '<span class="dj-read"><u>time</u><b data-o="time">0:00</b></span>' +
        '<span class="dj-read"><u>wpm</u><b data-o="wpm">0</b></span>' +
        '<span class="dj-track" title="Lines finished"><i></i></span>' +
        '<span class="dj-zoom">' +
        '<button type="button" class="dj-z" data-act="dj-font" data-d="-1" aria-label="Smaller code">A−</button>' +
        '<button type="button" class="dj-z" data-act="dj-font" data-d="1" aria-label="Larger code">A+</button>' +
        "</span></div>";

      h += '<div class="dj-sheet"><div class="dj-gutter" aria-hidden="true"></div>' +
        '<div class="dj-wrap"><pre class="dj-layer" aria-hidden="true"></pre>' +
        '<textarea class="dj-input" spellcheck="false" autocapitalize="off" autocorrect="off" ' +
        'wrap="off" aria-label="Write the solution"></textarea></div></div>';

      h += '<div class="dj-actions">' +
        '<button type="button" class="btn btn-primary btn-sm" data-act="dj-check">' +
        TD.icon("check") + "Compare with reference</button>" +
        '<button type="button" class="btn btn-ghost btn-sm" data-act="dj-reset">' +
        TD.icon("reset") + "Reset</button>" +
        '<button type="button" class="btn btn-ghost btn-sm" data-act="dj-solved">Mark solved</button>' +
        '<button type="button" class="btn btn-ghost btn-sm" data-act="dj-flag">' +
        TD.icon(rec.flag ? "starOn" : "star") + "<span>" + (rec.flag ? "Flagged" : "Flag") + "</span></button>" +
        '<p class="dj-verdict">Type over the faded blueprint. <kbd>Tab</kbd> indents, ' +
        "<kbd>Ctrl</kbd><kbd>Space</kbd> finishes the line.</p></div>";
      h += "</div>";

      /* ---- coach column ---- */
      h += '<aside class="dj-coach">';

      h += '<section class="dj-panel"><div class="dj-panel-h"><h3>Hints</h3>' +
        '<button type="button" class="btn btn-ghost btn-sm" data-act="dj-hint">Reveal next</button></div>' +
        '<div class="dj-hints"></div></section>';

      h += '<section class="dj-panel"><div class="dj-panel-h"><h3>Approach</h3></div>' +
        '<div class="dj-approach"></div>' +
        '<div class="dj-cx"><span><u>time</u><b>' + esc(K.time || "—") + "</b></span>" +
        "<span><u>space</u><b>" + esc(K.space || "—") + "</b></span></div></section>";

      h += '<section class="dj-panel"><div class="dj-panel-h"><h3>Reference</h3>' +
        '<button type="button" class="btn btn-ghost btn-sm" data-act="dj-sol">Show</button></div>' +
        '<div class="dj-sol"></div></section>';

      if (K.tests.length) {
        h += '<section class="dj-panel"><div class="dj-panel-h"><h3>Assertions</h3></div>' +
          '<p class="dj-note">Checked against the reference when this bank was built — ' +
          "not run against what you type.</p>" +
          '<div class="dj-tests">' + K.tests.map(function (t) {
            return '<code class="dj-test">' + esc(t) + "</code>";
          }).join("") +
          (K.harness
            ? '<p class="dj-note">Scaffolding those assertions call:</p><code class="dj-test">' +
              esc(K.harness) + "</code>"
            : "") +
          "</div></section>";
      }

      h += '<section class="dj-panel"><div class="dj-panel-h"><h3>Your notes</h3></div>' +
        '<textarea class="dj-notes" placeholder="What tripped you up? Saved against this problem."></textarea>' +
        "</section>";

      h += "</aside></div>";
      return h;
    }

    function seg(mode, label, title) {
      return '<button type="button" data-act="dj-assist" data-mode="' + mode + '" title="' +
        esc(title) + '" aria-pressed="' + (assist === mode) + '">' + label + "</button>";
    }

    /* ---- rendering ---- */

    function level() { return peeking ? "full" : assist; }

    function buildGhost() {
      var m = level();
      ghost = m === "off" ? [] : m === "full" ? solLines.slice() : solLines.map(outlineOf);
    }

    function out(name, value) {
      var el = mount.querySelector('[data-o="' + name + '"]');
      if (el) el.textContent = value;
    }

    function draw() {
      var mode = level();
      var typed = input.value;
      var lines = typed.split("\n");
      var total = Math.max(lines.length, ghost.length);
      var caret = typed.slice(0, input.selectionStart).split("\n").length - 1;

      var html = "", gut = "";
      var done = 0, matched = 0, wrong = 0;

      for (var i = 0; i < total; i++) {
        var t = i < lines.length ? lines[i] : null;
        var s = solLines[i] !== undefined ? solLines[i] : "";
        var g = ghost[i] !== undefined ? ghost[i] : "";
        var body, ok = false;

        if (t === null) {
          body = '<span class="dj-gh">' + paint(g, 0, g.length) + "</span>";
        } else if (mode === "off") {
          body = paint(t, 0, t.length);
          if (t === s && t.trim() !== "") ok = true;
        } else {
          var p = prefix(t, s);
          matched += p;
          body = paint(s, 0, p);
          if (p < t.length) {
            wrong += t.length - p;
            body += '<span class="dj-bad">' + esc(t.slice(p)) + "</span>";
          }
          if (g.length > t.length) {
            body += '<span class="dj-gh">' + paint(g, t.length, g.length) + "</span>";
          }
          if (t === s && t.trim() !== "") ok = true;
        }

        if (ok) done++;
        html += '<span class="dj-ln">' + body + "</span>";

        var cls = [];
        if (ok && mode !== "off") cls.push("is-done");
        if (i === caret) cls.push("is-here");
        gut += "<div" + (cls.length ? ' class="' + cls.join(" ") + '"' : "") + ">" + (i + 1) + "</div>";
      }

      layer.innerHTML = html;
      gutter.innerHTML = gut;

      var real = 0;
      for (var r = 0; r < solLines.length; r++) if (solLines[r].trim() !== "") real++;
      var bar = mount.querySelector(".dj-track i");

      if (mode === "off") {
        out("match", "—");
        mount.querySelector('[data-o="match"]').parentNode.className = "dj-read";
        bar.style.width = "0%";
      } else {
        var joins = Math.min(lines.length, solLines.length) - 1;
        if (joins > 0) matched += joins;
        var pct = Math.round((matched / Math.max(1, K.solution.length)) * 100);
        out("match", pct + "%");
        mount.querySelector('[data-o="match"]').parentNode.className =
          "dj-read" + (wrong ? " is-bad" : pct >= 99 ? " is-good" : "");
        bar.style.width = Math.round((done / Math.max(1, real)) * 100) + "%";
      }
    }

    /* ---- editing ---- */

    function replace(from, to, text) {
      input.focus();
      input.setSelectionRange(from, to);
      var ok = false;
      try { ok = document.execCommand("insertText", false, text); } catch (err) { ok = false; }
      if (!ok) {
        var v = input.value;
        input.value = v.slice(0, from) + text + v.slice(to);
        input.setSelectionRange(from + text.length, from + text.length);
      }
      touched();
    }

    function lineAt(pos) {
      var v = input.value;
      var start = v.lastIndexOf("\n", pos - 1) + 1;
      var end = v.indexOf("\n", pos);
      if (end === -1) end = v.length;
      return { start: start, end: end, text: v.slice(start, end), i: v.slice(0, pos).split("\n").length - 1 };
    }

    function touched() {
      draw();
      if (!rec.status) { rec.status = "attempted"; TD.kataScore.save(); }
    }

    input.addEventListener("input", function () {
      lastKey = Date.now();
      keys++;
      touched();
    });

    ["click", "keyup"].forEach(function (ev) {
      input.addEventListener(ev, function () { draw(); });
    });

    input.addEventListener("keydown", function (e) {
      var pos = input.selectionStart, end = input.selectionEnd;

      if (e.key === "Tab") {
        e.preventDefault();
        var L = lineAt(pos);
        if (e.shiftKey) {
          var lead = L.text.match(/^ {1,4}/);
          if (lead) replace(L.start, L.start + lead[0].length, "");
        } else {
          replace(pos, end, "    ");
        }
        return;
      }

      if (e.key === "Enter" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        var cur = lineAt(pos);
        var next = solLines[cur.i + 1];
        var indent;
        /* While the line matches the reference, borrow the next line's real
           indentation — that is the single most useful thing the blueprint
           can do for you, because Python indentation is the answer. */
        if (level() !== "off" && next !== undefined && next.trim() !== "" && cur.text === solLines[cur.i]) {
          indent = next.match(/^\s*/)[0];
        } else {
          indent = cur.text.match(/^\s*/)[0];
          if (/:\s*$/.test(cur.text)) indent += "    ";
        }
        replace(pos, end, "\n" + indent);
        return;
      }

      if (e.code === "Space" && e.ctrlKey) {
        e.preventDefault();
        var B = lineAt(pos);
        var want = solLines[B.i];
        if (want !== undefined && want !== B.text) replace(B.start, B.end, want);
        return;
      }

      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        check();
        return;
      }

      if (e.altKey && e.key.toLowerCase() === "b") {
        e.preventDefault();
        setAssist(assist === "full" ? "outline" : assist === "outline" ? "off" : "full");
      }
    });

    /* ---- checking ---- */

    function say(text, cls, code) {
      verdict.className = "dj-verdict" + (cls ? " is-" + cls : "");
      verdict.textContent = text;
      if (code) {
        var c = document.createElement("code");
        c.textContent = code;
        verdict.appendChild(c);
      }
    }

    function check() {
      var mine = normalize(input.value);
      var ref = normalize(K.solution);

      if (!mine.length) {
        say("Nothing on the sheet yet — start typing over the blueprint.", "");
        return;
      }
      if (mine.join("\n") === ref.join("\n")) {
        solved("Character for character, that is the reference. Solved.");
        return;
      }
      var mt = mine.map(function (l) { return l.trim(); }).join("\n");
      var rt = ref.map(function (l) { return l.trim(); }).join("\n");
      if (mt === rt) {
        solved("Matches the reference — but your indentation differs, and Python counts it.", "near");
        return;
      }
      var i = 0;
      while (i < mine.length && i < ref.length && mine[i] === ref[i]) i++;
      say("First difference at line " + (i + 1) + ". The reference has: ", "off",
        ref[i] === undefined ? "(nothing — yours runs longer)" : ref[i].trim());
    }

    function solved(msg, cls) {
      var first = TD.kataScore.solve(K.id, seconds);
      say(msg, cls || "ok");
      var dot = document.querySelector('[data-kata="' + K.id + '"] .dj-dot');
      if (dot) dot.className = "dj-dot is-solved";
      if (first && TD.toast) TD.toast("Solved — " + K.title);
    }

    /* ---- coach ---- */

    function drawHints() {
      var box = mount.querySelector(".dj-hints");
      var shown = rec.hints || 0;
      if (!K.hints.length) { box.innerHTML = '<p class="dj-note">No hints for this one.</p>'; return; }
      if (!shown) {
        box.innerHTML = '<p class="dj-note">' + K.hints.length +
          " hints, from a nudge to nearly the answer. Try the problem first.</p>";
        return;
      }
      var h = "";
      for (var i = 0; i < shown && i < K.hints.length; i++) {
        h += '<div class="dj-hint"><b>' + (i + 1) + "</b><p>" + TD.rich(K.hints[i]) + "</p></div>";
      }
      if (shown >= K.hints.length) h += '<p class="dj-note">That is every hint.</p>';
      box.innerHTML = h;
    }

    function drawApproach(show) {
      var box = mount.querySelector(".dj-approach");
      box.innerHTML = show
        ? '<div class="dj-prose">' + TD.rich(K.approach) + "</div>"
        : '<button type="button" class="dj-locked" data-act="dj-approach">Reveal the approach</button>';
    }

    function drawSolution(show) {
      var box = mount.querySelector(".dj-sol");
      var btn = mount.querySelector('[data-act="dj-sol"]');
      box.innerHTML = show ? '<pre class="dj-ref">' + TD.pyBlock(K.solution) + "</pre>" : "";
      btn.textContent = show ? "Hide" : "Show";
      btn.setAttribute("data-shown", show ? "1" : "");
    }

    function setAssist(mode) {
      assist = mode;
      TD.store.set("dojo:assist", mode);
      Array.prototype.forEach.call(mount.querySelectorAll('[data-act="dj-assist"]'), function (b) {
        b.setAttribute("aria-pressed", b.getAttribute("data-mode") === mode ? "true" : "false");
      });
      buildGhost();
      draw();
    }

    function setFont(size) {
      fontSize = Math.max(11, Math.min(21, size));
      mount.style.setProperty("--dj-fs", fontSize + "px");
      TD.store.set("dojo:fs", fontSize);
    }

    /* ---- one delegated handler for the whole mount ---- */

    mount.addEventListener("click", function (e) {
      var b = e.target.closest("[data-act]");
      if (!b) return;
      var act = b.getAttribute("data-act");

      if (act === "dj-assist") setAssist(b.getAttribute("data-mode"));
      else if (act === "dj-font") setFont(fontSize + Number(b.getAttribute("data-d")));
      else if (act === "dj-check") check();
      else if (act === "dj-reset") {
        input.value = "";
        keys = 0;
        draw();
        say("Sheet cleared.", "");
        input.focus();
      } else if (act === "dj-solved") solved("Marked solved.");
      else if (act === "dj-flag") {
        rec.flag = !rec.flag;
        TD.kataScore.save();
        b.innerHTML = TD.icon(rec.flag ? "starOn" : "star") +
          "<span>" + (rec.flag ? "Flagged" : "Flag") + "</span>";
      } else if (act === "dj-hint") {
        if (rec.hints < K.hints.length) { rec.hints++; TD.kataScore.save(); drawHints(); }
      } else if (act === "dj-approach") drawApproach(true);
      else if (act === "dj-sol") drawSolution(!b.getAttribute("data-shown"));
    });

    mount.querySelector(".dj-notes").addEventListener("input", function () {
      rec.notes = this.value;
      TD.kataScore.save();
    });

    /* Peeking is deliberately hold-to-view rather than a toggle: a peek you
       have to keep holding is one you stop taking. */
    function onKeyDown(e) {
      if (e.altKey && e.key.toLowerCase() === "p" && !peeking) {
        peeking = true;
        buildGhost();
        draw();
      }
    }
    function onKeyUp(e) {
      if (peeking && (e.key === "Alt" || e.key.toLowerCase() === "p")) {
        peeking = false;
        buildGhost();
        draw();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);

    /* ---- clock ---- */

    clock = setInterval(function () {
      if (Date.now() - lastKey < 20000) {
        seconds++;
        rec.seconds = (rec.seconds || 0) + 1;
        if (seconds % 20 === 0) TD.kataScore.save();
      }
      var m = Math.floor(seconds / 60), s = seconds % 60;
      out("time", m + ":" + (s < 10 ? "0" : "") + s);
      var mins = seconds / 60;
      out("wpm", mins > 0.08 ? String(Math.round(keys / 5 / mins)) : "0");
    }, 1000);

    /* Leaving the page must stop the clock and release the document keys, or
       every visit adds another timer and another pair of listeners. */
    TD.dojoCleanup = function () {
      clearInterval(clock);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
      TD.kataScore.save();
    };

    /* ---- go ---- */

    mount.querySelector(".dj-notes").value = rec.notes || "";
    setFont(fontSize);
    setAssist(assist);
    drawHints();
    drawApproach(false);
    drawSolution(false);
    draw();
  };

})(window.TD);
