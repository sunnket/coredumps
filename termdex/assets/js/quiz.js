/* NodeCraft Quiz — the question runner.

   A bank of questions is data; this is the thing that makes answering one
   feel like anything. Two modes, because they train different muscles:

     practice   every question is open. Answer it, reveal it, read the
                worked solution, move on. Nothing is timed and nothing is
                hidden — this is where you learn the method.

     test       the reveal is locked until you submit. A clock runs, and
                the score at the end is the one that counts. This is where
                you find out whether the method survives pressure.

   The reveal is the whole point of the practice mode, so it is built to be
   worth pressing: the correct option is marked, the wrong option you picked
   is marked separately, and underneath sits the one-line reason plus the
   working, step by step. A question that only tells you the letter of the
   answer has taught you nothing.

   State is local to the mount and deliberately not persisted per question.
   What survives is the chapter score, which is the only thing anyone ever
   looks at twice.
*/
(function (TD) {
  "use strict";

  var LETTER = ["A", "B", "C", "D", "E", "F"];

  function esc(s) { return TD.esc(s); }
  function rich(s) { return TD.rich(s); }

  /* ---- one question ---------------------------------------------------
     Rendered once, then mutated in place as it is answered and revealed.
     Re-rendering the whole list on every click would lose scroll position
     and, on a 40-question chapter, be visibly slow. */

  function questionHtml(Q, n, mode) {
    var h = '<li class="qz-q" data-key="' + esc(Q.key) + '" data-a="' + Q.a + '" id="q-' + n + '">';

    h += '<header class="qz-q-h">' +
      '<span class="qz-n">' + n + "</span>" +
      '<div class="qz-q-meta">' +
      (Q.tag ? '<span class="qz-tag">' + esc(Q.tag) + "</span>" : "") +
      '<span class="lvl" data-lvl="' + esc(Q.lvl) + '">' + TD.levelName(Q.lvl) +
      "</span></div>" +
      '<span class="qz-mark" aria-hidden="true"></span>' +
      "</header>";

    h += '<div class="qz-stem">' + rich(Q.q) + "</div>";

    h += '<ul class="qz-opts" role="list">' + Q.o.map(function (o, i) {
      return '<li class="qz-opt"><button type="button" class="qz-opt-b" data-act="qz-pick" data-i="' + i + '">' +
        '<span class="qz-let">' + LETTER[i] + "</span>" +
        '<span class="qz-opt-t">' + rich(o) + "</span>" +
        '<span class="qz-opt-s" aria-hidden="true"></span></button></li>';
    }).join("") + "</ul>";

    h += '<div class="qz-q-foot">' +
      (mode === "test"
        ? '<span class="qz-locked">' + TD.icon("clock") + "Answers unlock when you submit</span>"
        : '<button type="button" class="btn btn-ghost btn-sm qz-reveal" data-act="qz-reveal">' +
        TD.icon("eye") + "<span>Reveal answer</span></button>") +
      "</div>";

    /* The solution ships with the page and is hidden, rather than being
       built on click. It costs nothing at this size and it means the
       browser's own find-in-page can reach a worked solution the reader
       half-remembers. */
    h += '<div class="qz-sol" hidden>' +
      '<p class="qz-sol-a">' + TD.icon("check") + "Correct answer: <b>" + LETTER[Q.a] + "</b> — " + rich(Q.o[Q.a]) + "</p>" +
      (Q.x ? '<p class="qz-sol-x">' + rich(Q.x) + "</p>" : "") +
      (Q.steps && Q.steps.length
        ? '<div class="qz-steps"><p class="qz-steps-k">' + TD.icon("list") + "Working</p><ol>" +
        Q.steps.map(function (s) { return "<li>" + rich(s) + "</li>"; }).join("") + "</ol></div>"
        : "") +
      (Q.note ? '<p class="qz-sol-n">' + TD.icon("bulb") + rich(Q.note) + "</p>" : "") +
      "</div>";

    return h + "</li>";
  }

  /* ---- the runner ---------------------------------------------------- */

  TD.mountQuiz = function (root, questions, opts) {
    opts = opts || {};
    var mode = opts.mode === "test" ? "test" : "practice";
    var qs = questions.slice();
    var total = qs.length;
    if (!total) { root.innerHTML = ""; return; }

    /* picked[i] = option index or -1; shown[i] = has been revealed */
    var picked = qs.map(function () { return -1; });
    var shown = qs.map(function () { return false; });
    var submitted = false;
    var t0 = Date.now();
    var tick = null;

    function answered() { return picked.filter(function (p) { return p >= 0; }).length; }
    function right() {
      var n = 0;
      picked.forEach(function (p, i) { if (p === qs[i].a) n++; });
      return n;
    }

    function shell() {
      var h = '<section class="qz" data-mode="' + mode + '">';

      h += '<header class="qz-bar">' +
        '<div class="qz-bar-l">' +
        '<span class="qz-bar-k">' + TD.icon(mode === "test" ? "clock" : "quiz") +
        (mode === "test" ? "Test — " + total + " questions" : "Practice — " + total + " questions") + "</span>" +
        '<span class="qz-bar-s" id="qzStat">Not started</span>' +
        "</div>" +
        '<div class="qz-bar-r">' +
        (mode === "test" ? '<span class="qz-clock" id="qzClock">0:00</span>' : "") +
        (mode === "practice"
          ? '<button type="button" class="btn btn-ghost btn-sm" data-act="qz-reveal-all">' +
          TD.icon("eye") + "Reveal all</button>"
          : "") +
        '<button type="button" class="btn btn-primary btn-sm" data-act="qz-finish">' +
        TD.icon("check") + (mode === "test" ? "Submit" : "Score me") + "</button>" +
        "</div>" +
        '<div class="qz-bar-pg"><span id="qzPg" style="width:0%"></span></div>' +
        "</header>";

      h += '<ol class="qz-list">' + qs.map(function (Q, i) {
        return questionHtml(Q, i + 1, mode);
      }).join("") + "</ol>";

      h += '<div class="qz-result" id="qzResult" hidden></div>';

      return h + "</section>";
    }

    root.innerHTML = shell();

    var list = root.querySelectorAll(".qz-q");
    var stat = root.querySelector("#qzStat");
    var pg = root.querySelector("#qzPg");
    var clock = root.querySelector("#qzClock");

    function paintStat() {
      var a = answered();
      pg.style.width = (total ? (a / total) * 100 : 0) + "%";
      if (!a) { stat.textContent = "Not started"; return; }
      stat.textContent = mode === "test"
        ? a + " of " + total + " answered"
        : a + " answered · " + right() + " right";
    }

    if (mode === "test" && clock) {
      tick = setInterval(function () {
        if (submitted) return;
        var s = Math.floor((Date.now() - t0) / 1000);
        clock.textContent = Math.floor(s / 60) + ":" + ("0" + (s % 60)).slice(-2);
      }, 1000);
    }

    /* Reveal marks the options and opens the solution. Called on click in
       practice mode, and for every question at once on submit. */
    function reveal(i) {
      if (shown[i]) return;
      shown[i] = true;
      var el = list[i];
      var Q = qs[i];
      var btns = el.querySelectorAll(".qz-opt-b");
      btns.forEach(function (b, j) {
        b.disabled = true;
        if (j === Q.a) b.classList.add("is-right");
        else if (j === picked[i]) b.classList.add("is-wrong");
      });
      el.querySelector(".qz-sol").hidden = false;
      el.classList.add("is-shown");
      if (picked[i] >= 0) {
        el.classList.add(picked[i] === Q.a ? "is-right" : "is-wrong");
        if (picked[i] !== Q.a) TD.quizMissed.add(Q.key);
        else TD.quizMissed.clear(Q.key);
      }
      var rb = el.querySelector(".qz-reveal");
      if (rb) rb.remove();
    }

    function finish() {
      if (submitted) return;
      submitted = true;
      if (tick) { clearInterval(tick); tick = null; }
      for (var i = 0; i < total; i++) reveal(i);

      var r = right();
      var a = answered();
      var pctv = total ? Math.round((r / total) * 100) : 0;
      var secs = Math.round((Date.now() - t0) / 1000);

      var rec = null;
      if (opts.track && opts.mod) rec = TD.quizScore.save(opts.track, opts.mod, r, total);

      var band = pctv >= 90 ? "excellent" : pctv >= 75 ? "strong"
        : pctv >= 60 ? "solid" : pctv >= 40 ? "developing" : "rough";
      var line = pctv >= 90
        ? "This chapter is done. Move on — re-reading what you already know is the most comfortable way to waste a week."
        : pctv >= 75
          ? "Solid. Read the solutions for the ones you missed; they will almost always be the same two ideas repeating."
          : pctv >= 60
            ? "The method is there and the accuracy is not. That gap closes with volume, not with more theory."
            : pctv >= 40
              ? "Go back to the lesson for this chapter before doing more questions. Drilling on a shaky method just makes the shaky method faster."
              : "Start with the worked solutions rather than the questions. Read ten of them end to end, then come back and attempt the chapter cold.";

      var box = root.querySelector("#qzResult");
      box.innerHTML = '<div class="qz-res-in" data-band="' + band + '">' +
        '<div class="qz-res-score"><span class="qz-res-pct">' + pctv + "%</span>" +
        "<span>" + r + " / " + total + " correct</span></div>" +
        '<div class="qz-res-b"><h3>' + esc(band.charAt(0).toUpperCase() + band.slice(1)) + "</h3>" +
        "<p>" + esc(line) + "</p>" +
        '<div class="qz-res-pips">' +
        '<span class="pip">' + a + " attempted</span>" +
        '<span class="pip">' + (total - a) + " skipped</span>" +
        '<span class="pip">' + Math.floor(secs / 60) + "m " + (secs % 60) + "s</span>" +
        (rec ? '<span class="pip">best ' + rec.best + "%</span>" : "") +
        "</div>" +
        '<div class="qz-res-go">' +
        '<button type="button" class="btn btn-ghost btn-sm" data-act="qz-again">' +
        TD.icon("refresh") + "Try again</button>" +
        (opts.wrongHref && r < total
          ? '<a class="btn btn-ghost btn-sm" href="' + opts.wrongHref + '">' +
          TD.icon("target") + "Practise my mistakes</a>"
          : "") +
        (opts.nextHref
          ? '<a class="btn btn-primary btn-sm" href="' + opts.nextHref + '">' +
          esc(opts.nextLabel || "Next chapter") + TD.icon("arrowRight") + "</a>"
          : "") +
        "</div></div></div>";
      box.hidden = false;

      root.querySelector(".qz-bar").classList.add("is-done");
      stat.textContent = r + " / " + total + " correct";
      pg.style.width = "100%";
      if (opts.onDone) opts.onDone(r, total);

      box.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    /* "Try again" re-mounts into the same root, so a handler attached
       unconditionally would accumulate one listener per attempt. The old
       one is detached first — without this the count grows all session, and
       the only reason it does not currently misbehave is the accident that
       a stale handler replaces the DOM before the newer one sees the click.
       That is not a thing to rely on. */
    if (root.__qzClick) root.removeEventListener("click", root.__qzClick);
    root.__qzClick = function (ev) {
      var el = ev.target.closest("[data-act]");
      if (!el || !root.contains(el)) return;
      var act = el.getAttribute("data-act");

      if (act === "qz-pick") {
        var q = el.closest(".qz-q");
        var i = Array.prototype.indexOf.call(list, q);
        if (i < 0 || shown[i] || submitted) return;
        picked[i] = parseInt(el.getAttribute("data-i"), 10);
        q.querySelectorAll(".qz-opt-b").forEach(function (b) { b.classList.remove("is-picked"); });
        el.classList.add("is-picked");
        q.classList.add("is-answered");
        paintStat();
        /* In practice mode an answer reveals itself. Making the reader press
           a second button to find out whether they were right is friction
           with no teaching value — the reveal button stays for anyone who
           wants the solution without committing to an answer. */
        if (mode === "practice") reveal(i);
        return;
      }

      if (act === "qz-reveal") {
        var qq = el.closest(".qz-q");
        var j = Array.prototype.indexOf.call(list, qq);
        if (j >= 0) reveal(j);
        return;
      }

      if (act === "qz-reveal-all") {
        for (var k = 0; k < total; k++) reveal(k);
        return;
      }

      if (act === "qz-finish") { finish(); return; }

      if (act === "qz-again") {
        if (tick) clearInterval(tick);
        TD.mountQuiz(root, opts.shuffle === false ? qs : shuffle(qs), opts);
        root.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    };
    root.addEventListener("click", root.__qzClick);

    paintStat();
  };

  /* Fisher–Yates on a copy. Used only on "try again", because a chapter
     read for the first time should appear in the order it was written —
     the questions build on each other. */
  function shuffle(a) {
    var out = a.slice();
    for (var i = out.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = out[i]; out[i] = out[j]; out[j] = t;
    }
    return out;
  }
  TD.shuffleQs = shuffle;

})(window.TD);
