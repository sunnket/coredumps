/* Journeys UI — CoreDumps

   Two views: choose a role, then follow it.

   This section exists to answer one question the rest of the app could not:
   "what do I open on Monday?" Everything else is organised by subject, which
   is right for a reference and wrong for a beginner. A journey is organised by
   time and by role, and it points *into* the other sections rather than
   duplicating them.

   The design rule throughout: never show a phase without showing the practice
   that goes with it. Reading without practice is the failure this platform
   exists to prevent, and a plan that lists only reading quietly encourages it. */
(function (TD) {
  "use strict";

  function pct(n, d) { return d ? Math.round((n / d) * 100) : 0; }

  /* ---------------- the chooser ---------------- */

  TD.viewJourneys = function () {
    var chosen = TD.journeyChoice.current();

    var cards = TD.journeys.map(function (J) {
      var pr = TD.journeyProgress(J);
      var isOn = chosen && chosen.id === J.id;
      return '<a class="jy-card' + (isOn ? " is-on" : "") + '" href="#/plan/' + J.id + '" ' +
        'style="--jc:' + J.col + '">' +
        '<span class="jy-card-ico">' + TD.icon(J.icon) + "</span>" +
        '<div class="jy-card-b">' +
          "<h3>" + TD.esc(J.name) + (isOn ? '<span class="jy-yours">your plan</span>' : "") + "</h3>" +
          "<p>" + TD.esc(J.deck) + "</p>" +
          '<div class="jy-card-meta">' +
            "<span>" + J.weeks + " weeks</span>" +
            "<span>" + J.phases.length + " phases</span>" +
            "<span>" + pr.total + " lessons</span>" +
          "</div>" +
          (pr.done ? '<div class="jy-bar"><i style="width:' + pr.pct + '%"></i></div>' : "") +
        "</div>" +
      "</a>";
    }).join("");

    return '<div class="jy-view">' +
      '<header class="jy-hero">' +
        '<div class="jy-hero-copy">' +
          '<span class="jy-eyebrow">' + TD.icon("compass") + " Your plan</span>" +
          "<h1>Twenty-four tracks is a library. <em>This</em> is a plan.</h1>" +
          "<p>Everything on this site is organised by subject, which is right for looking " +
          "something up and wrong for starting out. Pick the job you want and this becomes " +
          "a week-by-week route through it — what to read, what to practise alongside it, " +
          "and what you should be able to do before moving on.</p>" +
        "</div>" +
      "</header>" +

      '<section class="jy-how">' +
        "<h2>" + TD.icon("idea") + " Before you pick</h2>" +
        '<ul class="jy-how-list">' +
          "<li><strong>The weeks assume 10–12 focused hours.</strong> They are deliberately " +
            "not optimistic. Going slower is fine; pretending you are going faster is not.</li>" +
          "<li><strong>You can change your mind.</strong> Choosing a plan changes what the " +
            "home page suggests — it does not lock or hide anything.</li>" +
          "<li><strong>Every phase names practice, not just reading.</strong> Skipping that " +
            "column is the single most common way people finish a course and still cannot " +
            "write code.</li>" +
          "<li><strong>Where a track does not exist yet, the plan says so.</strong> You will " +
            "not be sent to an empty page.</li>" +
        "</ul>" +
      "</section>" +

      '<div class="jy-cards">' + cards + "</div>" +
    "</div>";
  };

  /* ---------------- one journey ---------------- */

  function phaseHtml(J, phase, isNext) {
    var tracks = TD.journeyTracks(phase);
    var pr = TD.phaseProgress(phase);
    var done = pr.total > 0 && pr.done >= pr.total;

    var trackRows = tracks.map(function (t) {
      var n = TD.progress.inTrack(t.id);
      var complete = t.count > 0 && n >= t.count;
      return '<a class="jy-track' + (complete ? " is-done" : "") + '" href="#/learn/' + t.id + '">' +
        '<span class="jy-track-ico" style="--tc:' + (t.col || "var(--accent-2)") + '">' +
          TD.icon(t.icon || "book") + "</span>" +
        '<span class="jy-track-n">' + TD.esc(t.short || t.name) + "</span>" +
        '<span class="jy-track-p">' + n + "/" + t.count + "</span>" +
      "</a>";
    }).join("");

    var practiceRows = (phase.practice || []).map(function (p) {
      return '<li><a href="' + TD.esc(p.href) + '">' + TD.esc(p.label) + "</a>" +
        (p.why ? "<span>" + TD.rich(p.why) + "</span>" : "") + "</li>";
    }).join("");

    /* A phase with no resolvable tracks is a declared gap, not a bug. Say so
       plainly rather than rendering an empty box the reader has to interpret. */
    var gap = !tracks.length;

    return '<section class="jy-phase' + (done ? " is-done" : "") +
      (isNext ? " is-next" : "") + (gap ? " is-gap" : "") + '" id="phase-' + phase.id + '">' +
      '<header class="jy-phase-h">' +
        '<span class="jy-phase-n">' + (done ? TD.icon("check") : phase.n) + "</span>" +
        "<div>" +
          "<h3>" + TD.esc(phase.name) +
            (isNext ? '<span class="jy-here">you are here</span>' : "") + "</h3>" +
          '<p class="jy-phase-w">' + TD.esc(phase.weeks) + "</p>" +
        "</div>" +
        (pr.total ? '<span class="jy-phase-p">' + pr.done + "/" + pr.total + "</span>" : "") +
      "</header>" +

      '<div class="jy-phase-b">' +
        '<p class="jy-goal">' + TD.rich(phase.goal) + "</p>" +

        (gap
          ? '<div class="jy-gapnote">' + TD.icon("alert") +
            "<span>No track on this platform covers this yet. The goal above says what to " +
            "learn elsewhere in the meantime.</span></div>"
          : '<div class="jy-tracks">' + trackRows + "</div>") +

        (practiceRows
          ? '<div class="jy-practice"><p class="jy-k">' + TD.icon("spark") +
            "Practise alongside</p><ul>" + practiceRows + "</ul></div>"
          : "") +

        (phase.proof
          ? '<div class="jy-proof"><p class="jy-k">' + TD.icon("target") +
            "Before you move on</p><p>" + TD.rich(phase.proof) + "</p></div>"
          : "") +
      "</div>" +
    "</section>";
  }

  TD.viewJourney = function (id) {
    var J = TD.journeyById[id];
    if (!J) {
      return '<div class="jy-view"><p class="empty">No such plan. ' +
        '<a href="#/plan">Back to the plans</a>.</p></div>';
    }

    var pr = TD.journeyProgress(J);
    var next = TD.journeyNext(J);
    var chosen = TD.journeyChoice.get() === J.id;

    /* Which phase is "here": the first one not yet complete. */
    var herePhase = null;
    for (var i = 0; i < J.phases.length; i++) {
      var p = TD.phaseProgress(J.phases[i]);
      if (!(p.total > 0 && p.done >= p.total)) { herePhase = J.phases[i]; break; }
    }

    var h = '<div class="jy-view jy-one" style="--jc:' + J.col + '">' +
      '<nav class="crumbs"><a href="#/plan">Your plan</a>' +
        '<span class="sep">/</span><span class="cur">' + TD.esc(J.short) + "</span></nav>";

    h += '<header class="jy-head">' +
      '<span class="jy-head-ico">' + TD.icon(J.icon) + "</span>" +
      "<div>" +
        "<h1>" + TD.esc(J.name) + "</h1>" +
        "<p>" + TD.esc(J.desc) + "</p>" +
        (J.market ? '<p class="jy-market">' + TD.icon("idea") + TD.rich(J.market) + "</p>" : "") +
        '<div class="jy-head-meta">' +
          "<span><b>" + J.weeks + "</b> weeks</span>" +
          "<span><b>" + J.phases.length + "</b> phases</span>" +
          "<span><b>" + pr.total + "</b> lessons</span>" +
          (pr.done ? "<span><b>" + pr.pct + "%</b> done</span>" : "") +
        "</div>" +
      "</div>" +
    "</header>";

    h += '<div class="jy-bar jy-bar-lg"><i style="width:' + pr.pct + '%"></i></div>';

    /* The single most useful control on the page. */
    h += '<div class="jy-next">' +
      '<div class="jy-next-b">' +
        '<p class="jy-k">' + TD.icon("play") + (pr.done ? "Pick up where you left off" : "Start here") + "</p>" +
        (next
          ? "<h3>" + TD.esc(next.lesson.t) + "</h3>" +
            "<p>" + TD.esc(next.phase.name) + " · " + TD.esc(next.track.short || next.track.name) + "</p>"
          : "<h3>Every lesson in this plan is complete.</h3>" +
            "<p>Move to the interview bank and the project lab — the reading is done.</p>") +
      "</div>" +
      '<div class="jy-next-a">' +
        (next
          ? '<a class="btn btn-primary" href="#/learn/' + next.lesson.key + '">' +
            TD.icon("play") + "Open lesson</a>"
          : '<a class="btn btn-primary" href="#/interviews">' + TD.icon("shield") + "Interview bank</a>") +
        '<button class="btn btn-ghost btn-sm" type="button" data-jy-pick="' + J.id + '">' +
          TD.icon(chosen ? "check" : "bookmark") +
          (chosen ? "This is your plan" : "Make this my plan") + "</button>" +
      "</div>" +
    "</div>";

    J.phases.forEach(function (phase) {
      h += phaseHtml(J, phase, herePhase && herePhase.id === phase.id);
    });

    return h + "</div>";
  };

  /* ---------------- wiring ----------------
     One delegated listener, bound once. #view survives re-renders, so binding
     on every route change would stack handlers and make one click fire twice. */

  var bound = false;
  var rerenderRef = null;

  TD.wireJourney = function (rerender) {
    var view = document.getElementById("view");
    if (!view) return;

    rerenderRef = rerender;
    if (bound) return;
    bound = true;

    view.addEventListener("click", function (e) {
      var pick = e.target.closest("[data-jy-pick]");
      if (!pick) return;
      var id = pick.getAttribute("data-jy-pick");
      /* clicking again clears it -- the control is a toggle, so a reader is
         never stuck with a plan they picked to look at */
      TD.journeyChoice.set(TD.journeyChoice.get() === id ? "" : id);
      if (rerenderRef) rerenderRef();
    });
  };

})(window.TD);
