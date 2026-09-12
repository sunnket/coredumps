/* NodeCraft Speaking — the session runner.

   speech.js knows how to listen and how to judge. This file is the room
   the learner stands in: one activity at a time, a record button, a live
   caption so you can see the machine hearing you, and then the marking.

   Three decisions worth stating, because they are the difference between a
   toy and something a nervous speaker will actually use twice:

     The transcript is always editable. Recognition mishears, especially on
     accented English and on technical nouns, and a scorer that punishes the
     recogniser's mistake destroys trust in one take. Every result can be
     re-marked against a corrected transcript, and on a browser with no
     recogniser at all — Firefox — typing is simply the only path, and every
     other part of the analysis still runs.

     Nothing is uploaded and nothing is stored. The audio never leaves the
     browser's own recogniser, the transcript lives in a variable, and what
     survives the page is a single integer score.

     You can always see the target. Hiding the script to make it "harder"
     just makes it a memory test, which is not the skill being trained.
*/
(function (TD) {
  "use strict";

  var S = TD.speech;

  function esc(s) { return TD.esc(s); }
  function rich(s) { return TD.rich(s); }

  var KIND = {
    read: { k: "Read aloud", d: "Read the script exactly as written. Marked word for word." },
    repeat: { k: "Drill", d: "A short line, said cleanly. Marked strictly — this is the accuracy rep." },
    shadow: { k: "Shadow", d: "Hear the model first, then say it back in the same rhythm." },
    prompt: { k: "Speak freely", d: "No script. Marked on what you covered, how you paced it and how clean it was." }
  };

  /* ---- the transcript, marked up ---------------------------------------
     For a scripted activity the edit script is the feedback: a word that
     matched, a word that nearly matched, a word swapped for another and a
     word that never arrived all read differently, and telling them apart is
     the entire reason the aligner exists. */

  function opsHtml(ops) {
    if (!ops || !ops.length) return "";
    return '<p class="sp-diff">' + ops.map(function (o) {
      if (o.op === "ok") return '<span class="w ok">' + esc(o.want) + "</span>";
      if (o.op === "near") return '<span class="w near" title="heard as ' + esc(o.got) + '">' + esc(o.want) + "</span>";
      if (o.op === "sub") return '<span class="w sub" title="heard as ' + esc(o.got) + '">' + esc(o.want) +
        '<i>' + esc(o.got) + "</i></span>";
      if (o.op === "miss") return '<span class="w miss" title="not heard">' + esc(o.want) + "</span>";
      return '<span class="w extra" title="extra word">' + esc(o.got) + "</span>";
    }).join(" ") + "</p>" +
      '<p class="sp-diff-key">' +
      '<span><i class="k ok"></i>said</span>' +
      '<span><i class="k near"></i>close</span>' +
      '<span><i class="k sub"></i>heard as something else</span>' +
      '<span><i class="k miss"></i>not heard</span>' +
      '<span><i class="k extra"></i>added</span></p>';
  }

  function resultHtml(res) {
    var h = '<div class="sp-res" data-band="' + esc(res.band) + '">';

    h += '<div class="sp-res-top">' +
      '<div class="sp-ring" style="--v:' + res.score + '">' +
      '<span class="sp-ring-n">' + res.score + "</span></div>" +
      '<div class="sp-res-hd"><h4>' + esc(res.band.charAt(0).toUpperCase() + res.band.slice(1)) + "</h4>" +
      '<p class="sp-res-pips">' +
      '<span class="pip">' + res.words + " words</span>" +
      '<span class="pip">' + res.secs + "s</span>" +
      (res.wpm ? '<span class="pip">' + res.wpm + " wpm</span>" : "") +
      '<span class="pip">' + res.fillers.total + " filler" + (res.fillers.total === 1 ? "" : "s") + "</span>" +
      "</p></div></div>";

    h += '<ul class="sp-bars">' + res.parts.map(function (p) {
      if (p.v == null) {
        return '<li class="sp-bar is-na"><span class="sp-bar-k">' + esc(p.k) + "</span>" +
          '<span class="sp-bar-t"><i style="width:0%"></i></span>' +
          '<span class="sp-bar-v">–</span>' +
          '<span class="sp-bar-d">' + esc(p.d) + "</span></li>";
      }
      return '<li class="sp-bar"><span class="sp-bar-k">' + esc(p.k) + "</span>" +
        '<span class="sp-bar-t"><i style="width:' + p.v + '%"></i></span>' +
        '<span class="sp-bar-v">' + p.v + "</span>" +
        '<span class="sp-bar-d">' + esc(p.d) + "</span></li>";
    }).join("") + "</ul>";

    if (res.ops && res.ops.length) h += opsHtml(res.ops);

    if (res.coverage && res.coverage.hit && (res.coverage.hit.length || res.coverage.missed.length)) {
      h += '<ul class="sp-cov">' +
        res.coverage.hit.map(function (x) {
          return '<li class="is-hit">' + TD.icon("check") + esc(x) + "</li>";
        }).join("") +
        res.coverage.missed.map(function (x) {
          return '<li class="is-missed">' + TD.icon("close") + esc(x) + "</li>";
        }).join("") + "</ul>";
    }

    h += '<ul class="sp-notes">' + res.notes.map(function (n) {
      return '<li class="sp-note is-' + esc(n.k) + '">' +
        '<span class="sp-note-i" aria-hidden="true">' +
        TD.icon(n.k === "good" ? "check" : n.k === "bad" ? "close" : "bulb") + "</span>" +
        "<div><b>" + rich(n.t) + "</b><span>" + rich(n.w) + "</span></div></li>";
    }).join("") + "</ul>";

    return h + "</div>";
  }

  /* ---- the runner ------------------------------------------------------ */

  TD.mountSpeak = function (root, session, opts) {
    opts = opts || {};
    var acts = session.acts || [];
    if (!acts.length) { root.innerHTML = ""; return; }

    var sup = S.support();
    var at = 0;                  /* which activity */
    var scores = acts.map(function () { return null; });
    var rec = null, meter = null, timer = null, countdown = null;
    var live = { final: "", interim: "" };
    var listening = false;

    /* --- chrome ------------------------------------------------------- */

    function shell() {
      var h = '<section class="sp">';

      if (!sup.rec) {
        h += '<div class="sp-warn">' + TD.icon("micOff") +
          "<div><b>No speech recognition in this browser</b><span>" + esc(sup.why) +
          " Everything else still works: say your answer out loud, type what you said into the box, " +
          "and the pace, filler, coverage and accuracy analysis all run exactly the same.</span></div></div>";
      }

      h += '<nav class="sp-steps" aria-label="Activities">' + acts.map(function (a, i) {
        return '<button type="button" class="sp-step" data-act="sp-go" data-i="' + i + '">' +
          '<span class="sp-step-n">' + (i + 1) + "</span>" +
          '<span class="sp-step-t">' + esc(a.t || KIND[a.kind].k) + "</span>" +
          '<span class="sp-step-s" aria-hidden="true"></span></button>';
      }).join("") + "</nav>";

      h += '<div class="sp-stage" id="spStage"></div>';
      h += '<div class="sp-final" id="spFinal" hidden></div>';
      return h + "</section>";
    }

    root.innerHTML = shell();
    var stage = root.querySelector("#spStage");
    var steps = root.querySelectorAll(".sp-step");

    function paintSteps() {
      steps.forEach(function (b, i) {
        b.classList.toggle("is-here", i === at);
        b.classList.toggle("is-done", scores[i] != null);
        if (scores[i] != null) b.querySelector(".sp-step-s").textContent = scores[i];
      });
    }

    /* --- one activity ------------------------------------------------- */

    function stageHtml(a) {
      var kind = KIND[a.kind] || KIND.read;
      var scripted = a.kind !== "prompt";

      var h = '<article class="sp-act" data-kind="' + esc(a.kind) + '">';

      h += '<header class="sp-act-h">' +
        '<span class="sp-act-k">' + TD.icon(a.kind === "prompt" ? "chat" : a.kind === "shadow" ? "speaker" : "mic") +
        esc(kind.k) + "</span>" +
        "<h3>" + esc(a.t) + "</h3>" +
        '<p class="sp-act-b">' + rich(a.brief || kind.d) + "</p>" +
        "</header>";

      if (scripted && a.text) {
        h += '<div class="sp-script"><p class="sp-script-k">' + TD.icon("book") + "Say this" +
          (sup.tts
            ? '<button type="button" class="sp-hear" data-act="sp-hear">' + TD.icon("speaker") + "Hear it</button>"
            : "") +
          "</p><p class=\"sp-script-t\">" + esc(a.text) + "</p></div>";
      }

      if (a.kind === "prompt") {
        h += '<div class="sp-brief"><p class="sp-brief-k">' + TD.icon("target") + "Cover these" +
          (a.secs ? '<span class="sp-brief-s">' + a.secs + " seconds</span>" : "") + "</p>" +
          '<ul>' + (a.expect || []).map(function (e) {
            return "<li>" + esc(String(e).split("|")[0]) + "</li>";
          }).join("") + "</ul>" +
          (a.avoid && a.avoid.length
            ? '<p class="sp-avoid">' + TD.icon("close") + "Do not use: " +
            a.avoid.map(function (x) { return "<b>" + esc(String(x).split("|")[0]) + "</b>"; }).join(", ") + "</p>"
            : "") +
          "</div>";
      }

      h += '<div class="sp-rig">' +
        '<button type="button" class="sp-rec" data-act="sp-rec"' + (sup.rec ? "" : " disabled") + '>' +
        '<span class="sp-rec-d" aria-hidden="true"></span>' +
        '<span class="sp-rec-t">' + (sup.rec ? "Start speaking" : "Microphone unavailable") + "</span>" +
        "</button>" +
        '<div class="sp-rig-b">' +
        '<div class="sp-level" aria-hidden="true"><i id="spLevel"></i></div>' +
        '<span class="sp-time" id="spTime">' + (a.secs ? "0:00 / 0:" + ("0" + a.secs).slice(-2) : "0:00") + "</span>" +
        "</div></div>";

      h += '<div class="sp-live" id="spLive" hidden><p class="sp-live-k">' + TD.icon("wave") +
        "What the microphone is hearing</p><p class=\"sp-live-t\" id=\"spLiveT\"></p></div>";

      h += '<details class="sp-type"' + (sup.rec ? "" : " open") + '>' +
        "<summary>" + (sup.rec ? "Recognition got a word wrong? Fix the transcript" : "Type what you said") + "</summary>" +
        '<p class="sp-type-w">Correct anything the recogniser misheard, then mark it again. ' +
        "Editing changes the score, which is the point — you should never lose marks for the machine's mistake.</p>" +
        '<textarea class="sp-type-t" id="spText" rows="4" spellcheck="false" ' +
        'placeholder="Type or paste exactly what you said…"></textarea>' +
        '<button type="button" class="btn btn-ghost btn-sm" data-act="sp-mark">' +
        TD.icon("check") + "Mark this transcript</button>" +
        "</details>";

      if (a.tip) {
        h += '<aside class="sp-tip">' + TD.icon("bulb") + "<div><b>Before you start</b><span>" +
          rich(a.tip) + "</span></div></aside>";
      }

      h += '<div class="sp-out" id="spOut"></div>';

      h += '<nav class="sp-nav">' +
        (at > 0 ? '<button type="button" class="btn btn-ghost btn-sm" data-act="sp-prev">' +
          TD.icon("left") + "Previous</button>" : '<span></span>') +
        '<button type="button" class="btn btn-primary btn-sm" data-act="sp-next">' +
        (at < acts.length - 1 ? "Next activity" + TD.icon("arrowRight") : "Finish session" + TD.icon("check")) +
        "</button></nav>";

      return h + "</article>";
    }

    function draw() {
      stopAll();
      stage.innerHTML = stageHtml(acts[at]);
      live = { final: "", interim: "" };
      paintSteps();
      if (scores[at] != null && lastRes[at]) {
        stage.querySelector("#spOut").innerHTML = resultHtml(lastRes[at]);
      }
    }

    var lastRes = acts.map(function () { return null; });

    /* --- recording ---------------------------------------------------- */

    function setRec(on) {
      listening = on;
      var b = stage.querySelector(".sp-rec");
      if (!b) return;
      b.classList.toggle("is-live", on);
      b.querySelector(".sp-rec-t").textContent = on ? "Stop and mark" : "Start speaking";
    }

    function stopAll() {
      if (rec) { rec.abort(); rec = null; }
      if (meter) { meter.stop(); meter = null; }
      if (timer) { clearInterval(timer); timer = null; }
      if (countdown) { clearTimeout(countdown); countdown = null; }
      S.hush();
      listening = false;
    }

    function startRec() {
      var a = acts[at];
      var t0 = Date.now();
      var liveBox = stage.querySelector("#spLive");
      var liveT = stage.querySelector("#spLiveT");
      var timeEl = stage.querySelector("#spTime");
      var levelEl = stage.querySelector("#spLevel");
      var out = stage.querySelector("#spOut");
      out.innerHTML = "";
      liveBox.hidden = false;
      liveT.textContent = "";

      meter = S.meter(function (v) {
        if (levelEl) levelEl.style.width = Math.round(v * 100) + "%";
      });

      timer = setInterval(function () {
        var s = Math.floor((Date.now() - t0) / 1000);
        var txt = Math.floor(s / 60) + ":" + ("0" + (s % 60)).slice(-2);
        if (timeEl) timeEl.textContent = a.secs ? txt + " / 0:" + ("0" + a.secs).slice(-2) : txt;
        if (timeEl && a.secs) timeEl.classList.toggle("is-over", s > a.secs);
      }, 250);

      rec = S.listen({
        secs: a.secs || 0,
        on: {
          text: function (final, interim) {
            live.final = final; live.interim = interim;
            liveT.innerHTML = esc(final) + (interim ? ' <span class="sp-int">' + esc(interim) + "</span>" : "");
          },
          error: function (code, msg) {
            setRec(false);
            stopAll();
            out.innerHTML = '<div class="sp-warn is-err">' + TD.icon("micOff") +
              "<div><b>Recording stopped</b><span>" + esc(msg) +
              " You can still type what you said below and have it marked.</span></div></div>";
          },
          end: function (take) {
            setRec(false);
            if (meter) { meter.stop(); meter = null; }
            if (timer) { clearInterval(timer); timer = null; }
            mark(take);
          }
        }
      });

      if (rec.start()) {
        setRec(true);
        /* A timed prompt stops itself a beat after the brief runs out, so
           the learner practises landing inside the limit rather than being
           cut off mid-word. */
        if (a.secs) {
          countdown = setTimeout(function () { if (listening && rec) rec.stop(); }, (a.secs + 5) * 1000);
        }
      } else {
        setRec(false);
      }
    }

    /* --- marking ------------------------------------------------------- */

    function mark(take) {
      var a = acts[at];
      var out = stage.querySelector("#spOut");
      var box = stage.querySelector("#spText");
      if (box && take.text && !box.value.trim()) box.value = take.text;

      var res = S.score(a, take);
      lastRes[at] = res;
      scores[at] = res.score;
      out.innerHTML = resultHtml(res);
      paintSteps();
      out.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    function markTyped() {
      var box = stage.querySelector("#spText");
      if (!box) return;
      var txt = box.value.trim();
      if (!txt) return;
      /* A typed transcript has no real duration. The brief's own target is
         the fairest stand-in: it neither rewards nor punishes pace, which
         is honest, because pace was not measured. */
      var a = acts[at];
      var words = S.words(txt).length;
      var ms = a.secs ? a.secs * 1000 : Math.max(4000, (words / 140) * 60000);
      mark({ text: txt, ms: ms, conf: 0, chunks: [txt], stamps: [ms] });
    }

    /* --- the session score --------------------------------------------- */

    function finish() {
      stopAll();
      var done = scores.filter(function (s) { return s != null; });
      if (!done.length) {
        stage.querySelector("#spOut").innerHTML =
          '<div class="sp-warn">' + TD.icon("bulb") +
          "<div><b>Nothing marked yet</b><span>Record or type at least one activity before finishing — " +
          "there is nothing to score otherwise.</span></div></div>";
        return;
      }
      var avg = Math.round(done.reduce(function (x, y) { return x + y; }, 0) / done.length);
      var rec2 = TD.speakScore.save(session.slug, avg);

      var band = avg >= 90 ? "excellent" : avg >= 78 ? "strong" : avg >= 64 ? "solid"
        : avg >= 48 ? "developing" : "rough";

      var box = root.querySelector("#spFinal");
      box.innerHTML = '<div class="sp-fin" data-band="' + band + '">' +
        '<span class="sp-fin-i">' + TD.icon("trophy") + "</span>" +
        '<div class="sp-fin-b"><h3>Session score ' + avg + "</h3>" +
        "<p>" + done.length + " of " + acts.length + " activities marked · best for this session " +
        rec2.best + " · attempt " + rec2.tries + "</p>" +
        '<p class="sp-fin-w">' + esc(
          avg >= 85
            ? "Do it once more with the script hidden. Speaking well while reading is a different skill from speaking well, and only the second one shows up in a meeting."
            : avg >= 70
              ? "Repeat only the activities that scored under seventy. Re-running the ones you already own feels productive and changes nothing."
              : "Run the whole session again tomorrow rather than twice today. Speaking improves on a sleep cycle, not on repetition within one sitting."
        ) + "</p>" +
        '<div class="sp-fin-go">' +
        '<button type="button" class="btn btn-ghost btn-sm" data-act="sp-restart">' +
        TD.icon("refresh") + "Run it again</button>" +
        (opts.nextHref ? '<a class="btn btn-primary btn-sm" href="' + opts.nextHref + '">' +
          esc(opts.nextLabel || "Next session") + TD.icon("arrowRight") + "</a>" : "") +
        "</div></div></div>";
      box.hidden = false;
      box.scrollIntoView({ behavior: "smooth", block: "center" });
      if (opts.onDone) opts.onDone(avg);
    }

    /* --- events -------------------------------------------------------- */

    /* Detach any handler from a previous mount into this same root, for the
       same reason the quiz runner does: a re-mount must not double up. */
    if (root.__spClick) root.removeEventListener("click", root.__spClick);
    root.__spClick = function (ev) {
      var el = ev.target.closest("[data-act]");
      if (!el || !root.contains(el)) return;
      var act = el.getAttribute("data-act");

      if (act === "sp-rec") {
        if (listening && rec) { rec.stop(); }
        else { startRec(); }
        return;
      }
      if (act === "sp-hear") {
        S.say(acts[at].text, {
          rate: acts[at].kind === "shadow" ? 0.86 : 0.94
        });
        return;
      }
      if (act === "sp-mark") { markTyped(); return; }
      if (act === "sp-prev") { if (at > 0) { at--; draw(); } return; }
      if (act === "sp-next") {
        if (at < acts.length - 1) { at++; draw(); stage.scrollIntoView({ behavior: "smooth", block: "start" }); }
        else finish();
        return;
      }
      if (act === "sp-go") {
        var i = parseInt(el.getAttribute("data-i"), 10);
        if (i >= 0 && i < acts.length) { at = i; draw(); }
        return;
      }
      if (act === "sp-restart") {
        scores = acts.map(function () { return null; });
        lastRes = acts.map(function () { return null; });
        at = 0;
        root.querySelector("#spFinal").hidden = true;
        draw();
        root.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    };
    root.addEventListener("click", root.__spClick);

    /* Leaving the page mid-take must release the microphone. Without this
       the recording indicator stays lit after navigation, which is alarming
       and entirely our fault. */
    TD.speakCleanup = stopAll;

    draw();
  };

})(window.TD);
