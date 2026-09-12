/* Speed Coding — CoreDumps

   A section of its own, not a mode of the drill. The distinction matters:
   the daily drill asks "do you still remember this?", and this asks "can
   your hands produce it without you thinking about it?". Those are different
   questions, they want different decks, and mixing them into one page makes
   both harder to read.

   Three views:

     #/speed              the ladder — every warm-up set, plus your own numbers
     #/speed/<set>        one warm-up set, run through the drill engine
     #/speed/slow         the personalised deck: lines you know but type slowly

   The engine itself is TD.mountDrill from drill.js. Nothing here re-implements
   typing, comparison or scheduling — this section is a deck chooser and a
   scoreboard around the machine that already exists. */
(function (TD) {
  "use strict";

  function pct(n, d) { return d ? Math.round((n / d) * 100) : 0; }

  /* A warm-up set's own history, read straight from the drill store so the
     two sections agree about what has been practised. */
  function setStats(S) {
    var timed = 0, best = 0, sum = 0;
    S.cards.forEach(function (c) {
      var rec = TD.drillRecord(c.id);
      if (!rec || !rec.best) return;
      timed++;
      sum += rec.best;
      if (rec.best > best) best = rec.best;
    });
    return {
      timed: timed,
      total: S.cards.length,
      avg: timed ? Math.round(sum / timed) : 0,
      best: best
    };
  }

  /* ---------------- the ladder ---------------- */

  TD.viewSpeed = function () {
    var speed = TD.speedStats();
    var slow = TD.slowCards(12);
    var rungs = TD.speedRungs();

    var h = '<div class="sp-view">';

    h += '<header class="sp-hero">' +
      '<div class="sp-hero-copy">' +
        '<span class="sp-eyebrow">' + TD.icon("gauge") + " Speed coding</span>" +
        "<h1>Knowing it and <em>typing</em> it are different skills</h1>" +
        "<p>You can know exactly what to write and still look lost, because your " +
        "hands are hunting for the brackets. This section trains the second half. " +
        "Start with fragments until they cost you nothing, move up to whole lines, " +
        "then to blocks where the indentation is part of the motion.</p>" +
        '<div class="sp-hero-actions">' +
          '<a class="btn btn-md btn-primary" href="#/speed/' +
            (rungs[0] ? rungs[0].sets[0].id : "keys") + '">' +
            TD.icon("play") + " Start the first set</a>" +
          (slow.length >= 3
            ? '<a class="btn btn-md btn-ghost" href="#/speed/slow">' +
              TD.icon("spark") + " Your slow lines (" + slow.length + ")</a>"
            : "") +
        "</div>" +
      "</div>" +
      '<div class="sp-hero-stats">' +
        '<div class="sp-stat"><strong>' + (speed.median || "—") + "</strong><span>cpm typical</span></div>" +
        '<div class="sp-stat"><strong>' + (speed.best || "—") + "</strong><span>cpm best</span></div>" +
        '<div class="sp-stat"><strong>' + speed.timed + "</strong><span>lines timed</span></div>" +
      "</div>" +
    "</header>";

    h += '<section class="sp-how">' +
      "<h2>" + TD.icon("idea") + " How this works</h2>" +
      '<ol class="sp-how-steps">' +
        "<li><strong>The clock starts when you do.</strong> Timing begins on your " +
          "first keystroke, not when the card appears — reading it is thinking " +
          "time, and this measures your hands.</li>" +
        "<li><strong>Only clean runs count.</strong> A line you peeked at or " +
          "mistyped is not timed. A number you did not earn is worse than none.</li>" +
        "<li><strong>Beat yourself, not a leaderboard.</strong> The target is your " +
          "own previous best on that exact line. Everyone's hands are different.</li>" +
        "<li><strong>Speed follows accuracy, never the other way round.</strong> " +
          "If you are still getting a line wrong, go back to the lesson. Typing a " +
          "mistake faster is not progress.</li>" +
      "</ol>" +
    "</section>";

    /* the personalised deck, when there is one */
    if (slow.length >= 3) {
      h += '<a class="sp-slow" href="#/speed/slow">' +
        '<span class="sp-slow-i">' + TD.icon("target") + "</span>" +
        "<div><h3>Your slow lines</h3>" +
        "<p>" + slow.length + " lines you have already recalled from memory but " +
        "type below your own " + speed.median + " cpm. Recall is not the problem " +
        "here; fluency is — and this is the deck where the gain is largest.</p></div>" +
        '<span class="sp-slow-go">' + TD.icon("right") + "</span></a>";
    }

    rungs.forEach(function (r) {
      h += '<section class="sp-rung">' +
        '<header class="sp-rung-h">' +
          '<span class="sp-rung-n">' + r.n + "</span>" +
          "<div><h2>" + TD.esc(r.name) + "</h2>" +
          "<p>" + TD.esc(r.blurb) + "</p></div>" +
        "</header>" +
        '<div class="sp-sets">';

      r.sets.forEach(function (S) {
        var st = setStats(S);
        var done = pct(st.timed, st.total);
        h += '<a class="sp-set" href="#/speed/' + S.id + '">' +
          '<div class="sp-set-top">' +
            "<h3>" + TD.esc(S.name) + "</h3>" +
            '<span class="sp-set-n">' + st.total + "</span>" +
          "</div>" +
          "<p>" + TD.esc(S.why) + "</p>" +
          '<div class="sp-set-foot">' +
            '<span class="sp-set-time">' + TD.icon("clock") + TD.esc(S.time) + "</span>" +
            (st.timed
              ? '<span class="sp-set-best">' + st.avg + " cpm avg</span>"
              : '<span class="sp-set-new">not started</span>') +
          "</div>" +
          '<div class="sp-bar" aria-hidden="true"><i style="width:' + done + '%"></i></div>' +
        "</a>";
      });

      h += "</div></section>";
    });

    return h + "</div>";
  };

  /* ---------------- one set ---------------- */

  TD.viewSpeedSet = function (id) {
    var S = TD.speedSetById[id];
    if (!S) {
      return '<div class="sp-view"><p class="empty">No such set. ' +
        '<a href="#/speed">Back to speed coding</a>.</p></div>';
    }
    var st = setStats(S);

    return '<div class="sp-view">' +
      '<nav class="crumbs"><a href="#/speed">Speed coding</a>' +
        '<span class="sep">/</span><span class="cur">' + TD.esc(S.name) + "</span></nav>" +

      '<header class="sp-shead">' +
        '<span class="sp-shead-n">Rung ' + S.rung + "</span>" +
        "<h1>" + TD.esc(S.name) + "</h1>" +
        "<p>" + TD.esc(S.why) + "</p>" +
        '<div class="sp-shead-meta">' +
          "<span>" + S.cards.length + " lines</span>" +
          "<span>" + TD.esc(S.time) + "</span>" +
          (st.timed ? "<span>" + st.avg + " cpm average</span>" : "") +
          (st.best ? "<span>" + st.best + " cpm best</span>" : "") +
        "</div>" +
      "</header>" +

      '<div id="drillMount" class="sp-mount"></div>' +
    "</div>";
  };

  /* ---------------- the personalised deck ---------------- */

  TD.viewSpeedSlow = function () {
    var slow = TD.slowCards(12);
    var speed = TD.speedStats();

    var h = '<div class="sp-view">' +
      '<nav class="crumbs"><a href="#/speed">Speed coding</a>' +
        '<span class="sep">/</span><span class="cur">Your slow lines</span></nav>' +

      '<header class="sp-shead">' +
        '<span class="sp-shead-n">Personalised</span>' +
        "<h1>Your slow lines</h1>" +
        "<p>Every line here is one you have already produced from memory, so " +
        "recall is not what is being tested. These are simply the ones your " +
        "hands are slowest at, ordered worst first.</p>" +
        '<div class="sp-shead-meta">' +
          "<span>" + slow.length + " queued</span>" +
          "<span>" + speed.median + " cpm typical</span>" +
          "<span>" + speed.best + " cpm best</span>" +
        "</div>" +
      "</header>";

    if (!slow.length) {
      h += '<div class="sp-empty">' +
        '<span>' + TD.icon("check") + "</span>" +
        "<h3>" + (speed.timed ? "Nothing is dragging" : "Nothing timed yet") + "</h3>" +
        "<p>" + (speed.timed
          ? "Every timed line sits at or above your own typical speed. Run a " +
            "warm-up set or clear more lesson drills to give this deck something " +
            "to work with."
          : "This deck is built from lines you have typed from memory in a lesson " +
            "drill or a warm-up set. Run one first and it will fill itself.") +
        "</p>" +
        '<a class="btn btn-primary btn-sm" href="#/speed">' +
          TD.icon("gauge") + "Back to the ladder</a>" +
      "</div>";
      return h + "</div>";
    }

    return h + '<div id="drillMount" class="sp-mount"></div></div>';
  };

  /* ---------------- mounting ----------------
     Both runnable views hand their deck to the drill engine. Warm-up sets
     start in copy so the shape is seen before it is recalled; the slow deck
     starts in recall, because those lines are already known and showing them
     again would turn a speed test back into a typing test. */

  TD.wireSpeed = function (r) {
    var mount = document.getElementById("drillMount");
    if (!mount) return;

    if (r.name === "speedSlow") {
      var slow = TD.slowCards(12);
      if (!slow.length) return;
      TD.mountDrill(mount, slow, {
        mode: "speed",
        start: "recall",
        t: "Against the clock",
        sub: "You already know these. Beat your own best time on each one."
      });
      return;
    }

    var S = TD.speedSetById[r.id];
    if (!S || !S.cards.length) return;
    TD.mountDrill(mount, S.cards, {
      mode: "speed",
      reps: S.rung === 1 ? 2 : 1,
      t: S.name,
      sub: "Type it, then type it again from memory. The clock starts on your first keystroke.",
      nextHref: "#/speed",
      nextLabel: "Back to the ladder"
    });
  };

})(window.TD);
