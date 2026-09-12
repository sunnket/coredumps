/* NodeCraft Drill — the practice engine.

   Reading a line of code and being able to write it are different skills,
   and only the second one survives a blank editor. This is the part of the
   course that closes that gap.

   Every lesson declares a small set of lines it wants in the reader's
   fingers. Each line goes through two phases:

     copy    the line is on screen. Type it exactly, `reps` times.
             Character-level feedback, no silent passes — a wrong character
             stops you where you made it rather than at the end.

     recall  the line is hidden. Only the intent is shown — "store the text
             Aryan under the name `name`" — and you reproduce it from
             memory. This is the phase that actually builds recall.

   Results feed a Leitner schedule kept in localStorage, so #/drill can ask
   for exactly the lines that are due today across everything studied so
   far. A line answered cleanly moves up a box and returns later; a line
   fumbled drops a box and returns tomorrow.
*/
(function (TD) {
  "use strict";

  /* Leitner intervals in days, indexed by box. Box 0 is "due now". */
  var BOX_DAYS = [0, 1, 2, 4, 9, 18, 35];
  var DAY = 86400000;
  var DEFAULT_REPS = 3;

  /* ---- storage ---- */

  function load() { return TD.store.get("learn:drill", {}); }
  function save(db) { TD.store.set("learn:drill", db); }

  function cardId(lessonKey, i) { return lessonKey + "#" + i; }

  /* Typing speed, in characters per minute of the target line rather than of
     what was typed -- a card is only ever recorded once the text matches, so
     the two are the same length, and measuring the target keeps a card's
     score comparable across attempts.

     `ms` is the time from the first keystroke to the clean submission, not
     from when the card appeared: reading the intent line is thinking time,
     and this measures fingers. A card cleared without timing (an older
     record, or a paste) simply carries no speed and is skipped by every
     speed read-out. */

  function cpm(chars, ms) {
    if (!ms || ms < 120) return 0;      /* implausibly fast: a paste */
    return Math.round(chars / (ms / 60000));
  }

  function record(id, clean, ms, chars) {
    var db = load();
    var rec = db[id] || { box: 0, ok: 0, miss: 0, seen: 0 };
    if (clean) rec.box = Math.min(BOX_DAYS.length - 1, rec.box + 1);
    else rec.box = Math.max(0, rec.box - 1);
    rec.ok += clean ? 1 : 0;
    rec.miss += clean ? 0 : 1;
    rec.seen = Date.now();
    rec.due = Date.now() + BOX_DAYS[rec.box] * DAY;

    /* Speed is only meaningful on a clean run from memory. A card that was
       peeked at or mistyped was not really recalled, so timing it would
       flatter the reader with a number they did not earn. */
    var rate = clean ? cpm(chars, ms) : 0;
    rec.last = rate || rec.last || 0;
    if (rate) {
      rec.runs = (rec.runs || 0) + 1;
      if (!rec.best || rate > rec.best) {
        rec.best = rate;
        rec.pb = true;          /* read once by the caller, then cleared */
      } else {
        rec.pb = false;
      }
    }

    db[id] = rec;
    save(db);
    return rec;
  }

  /* Exposed so the speed views can read a card's history without knowing
     the storage shape. */
  TD.drillRecord = function (id) { return load()[id] || null; };
  TD.drillCpm = cpm;

  /* ---- cards ---- */

  /* The lines one lesson wants in your fingers. */
  TD.drillCards = function (L) {
    if (!L || !L.drill || !L.drill.items) return [];
    var lang = L.drill.lang || "";
    return L.drill.items.map(function (it, i) {
      return {
        id: cardId(L.key, i),
        c: it.c,
        w: it.w,
        hint: it.hint || "",
        why: it.why || "",
        lang: it.lang || lang,
        lessonKey: L.key,
        lessonTitle: L.t,
        track: L.track
      };
    });
  };

  /* Everything due today, hardest-first, across every lesson that has ever
     been drilled. A card never practised is not due — the daily drill
     reviews what you have learned, it does not front-run the syllabus. */
  TD.dueCards = function (limit) {
    var db = load();
    var now = Date.now();
    var out = [];
    TD.lessons.forEach(function (L) {
      TD.drillCards(L).forEach(function (card) {
        var rec = db[card.id];
        if (!rec) return;
        if ((rec.due || 0) > now) return;
        card.box = rec.box;
        card.miss = rec.miss;
        out.push(card);
      });
    });
    /* lowest box first: the lines you keep getting wrong come back first */
    out.sort(function (a, b) {
      if (a.box !== b.box) return a.box - b.box;
      return b.miss - a.miss;
    });
    return limit ? out.slice(0, limit) : out;
  };

  /* Speed across everything ever timed. `median` rather than mean, because a
     handful of very short cards would otherwise drag the headline number up
     and make it meaningless as a personal benchmark. */
  TD.speedStats = function () {
    var db = load();
    var rates = [];
    var pbs = 0;
    Object.keys(db).forEach(function (k) {
      var r = db[k];
      if (r.best) { rates.push(r.best); pbs++; }
    });
    if (!rates.length) return { timed: 0, median: 0, best: 0 };
    rates.sort(function (a, b) { return a - b; });
    var mid = Math.floor(rates.length / 2);
    var median = rates.length % 2
      ? rates[mid]
      : Math.round((rates[mid - 1] + rates[mid]) / 2);
    return { timed: pbs, median: median, best: rates[rates.length - 1] };
  };

  /* The cards worth practising for speed: known well enough that recall is
     not the bottleneck (box 2+), and slow relative to the reader's own pace.

     The bar is the median rather than an absolute cpm, because a realistic
     target depends on the person and on how long their lines are. It sits at
     the median *inclusive* -- a card exactly at the median is still in the
     slower half and worth a run. A strict comparison silently drops cards
     whenever several share a rate, which is common early on when there are
     only a handful of timed cards to take a median over.

     Sorted slowest first, so a session starts where the gain is largest. */
  TD.slowCards = function (limit) {
    var db = load();
    var stats = TD.speedStats();
    if (!stats.timed) return [];
    var out = [];
    TD.lessons.forEach(function (L) {
      TD.drillCards(L).forEach(function (card) {
        var rec = db[card.id];
        if (!rec || !rec.best || rec.box < 2) return;
        if (rec.best > stats.median) return;
        card.best = rec.best;
        card.box = rec.box;
        out.push(card);
      });
    });
    out.sort(function (a, b) { return a.best - b.best; });
    return limit ? out.slice(0, limit) : out;
  };

  TD.drillStats = function () {
    var db = load();
    var now = Date.now();
    var total = 0, due = 0, strong = 0;
    Object.keys(db).forEach(function (k) {
      total++;
      if ((db[k].due || 0) <= now) due++;
      if (db[k].box >= 4) strong++;
    });
    return { total: total, due: due, strong: strong };
  };

  /* How much of one lesson's drill is already in memory, 0–1. */
  TD.drillProgress = function (L) {
    var cards = TD.drillCards(L);
    if (!cards.length) return null;
    var db = load(), done = 0;
    cards.forEach(function (c) { if (db[c.id]) done++; });
    return { done: done, total: cards.length };
  };

  /* ---- comparison ----------------------------------------------------
     Trailing whitespace on a line is invisible and never the point, so it
     is forgiven. Everything else — every space of indentation, every
     quote, every colon — is compared exactly, because in Python and in
     every other language taught here those characters are the lesson. */

  function normalise(s) {
    return String(s).replace(/[ \t]+$/gm, "").replace(/\s+$/, "");
  }

  /* index of the first differing character, or -1 when the typed text is a
     clean prefix of (or equal to) the target */
  function firstDiff(typed, target) {
    var n = Math.min(typed.length, target.length);
    for (var i = 0; i < n; i++) {
      if (typed[i] !== target[i]) return i;
    }
    return typed.length > target.length ? target.length : -1;
  }

  /* ---- rendering ---- */

  function esc(s) { return TD.esc(s); }

  /* The target line with the typed prefix marked good, the first wrong
     character marked bad, and the rest left as a ghost to type toward. */
  function ghost(target, typed) {
    var diff = firstDiff(typed, target);
    var okTo = diff < 0 ? Math.min(typed.length, target.length) : diff;
    var head = esc(target.slice(0, okTo));
    var bad = "";
    var tail = "";
    if (diff >= 0 && diff < target.length) {
      bad = esc(target.charAt(diff)) || "&#9251;";
      tail = esc(target.slice(diff + 1));
    } else {
      tail = esc(target.slice(okTo));
    }
    return '<span class="dr-ok">' + head + "</span>" +
      (bad ? '<span class="dr-bad">' + bad + "</span>" : "") +
      '<span class="dr-rest">' + tail + "</span>";
  }

  function shell(opts) {
    var h = '<section class="dr" data-mode="' + esc(opts.mode || "lesson") + '">';

    h += '<header class="dr-head">' +
      '<div class="dr-head-t"><span class="dr-ico" aria-hidden="true">' + TD.icon("terminal") + "</span>" +
      "<div><h2>" + esc(opts.t || "Burn it in") + "</h2>" +
      "<p>" + esc(opts.sub || "Type each line until your hands know it without you.") + "</p></div></div>" +
      '<div class="dr-count"><b id="drDone">0</b><span>of ' + opts.n + " cleared</span></div>" +
      "</header>";

    h += '<div class="dr-rail" id="drRail" aria-hidden="true"></div>';

    h += '<div class="dr-stage" id="drStage">' +

      '<div class="dr-phase"><span class="dr-phase-k" id="drPhase">Copy it</span>' +
      '<span class="dr-phase-w" id="drPhaseW">Type the line exactly as it appears.</span></div>' +

      '<p class="dr-intent" id="drIntent"></p>' +

      '<div class="dr-target" id="drTarget"><code id="drGhost"></code></div>' +

      '<div class="dr-inputwrap">' +
      '<label class="sr-only" for="drInput">Type the line</label>' +
      '<span class="dr-caretline" aria-hidden="true"></span>' +
      '<textarea id="drInput" class="dr-input" rows="1" spellcheck="false" autocomplete="off" ' +
      'autocorrect="off" autocapitalize="off" aria-describedby="drHelp"></textarea>' +
      "</div>" +

      '<p class="dr-msg" id="drMsg" role="status" aria-live="polite"></p>' +

      /* The teaching beat. Shown only after a card is cleared -- that is the
         moment the reader has just produced the line themselves and is paying
         the most attention to what it actually means. Showing it beforehand
         would make this a reading exercise. */
      '<aside class="dr-why" id="drWhy" hidden></aside>' +

      '<div class="dr-foot">' +
      '<div class="dr-reps" id="drReps" aria-label="Repetitions cleared"></div>' +
      '<div class="dr-speed" id="drSpeed" aria-live="polite"></div>' +
      '<div class="dr-acts">' +
      '<button class="btn btn-ghost btn-sm" type="button" id="drPeek">Show me the line</button>' +
      '<button class="btn btn-primary btn-sm" type="button" id="drCheck">Check' +
      "<kbd>&#8629;</kbd></button>" +
      "</div></div>" +

      '<p class="dr-help" id="drHelp">Press <kbd>&#8629;</kbd> to check a single line. ' +
      "In a multi-line card <kbd>Tab</kbd> indents by two spaces and " +
      "<kbd>Esc</kbd> steps out of the box.</p>" +

      "</div>";

    h += '<div class="dr-done" id="drDoneCard" hidden></div>';

    return h + "</section>";
  }

  /* ---- the machine ---------------------------------------------------
     One card at a time. `phase` is "copy" until the card has been typed
     `reps` times cleanly, then "recall" for one final attempt with the
     target hidden. A card is only recorded as clean if it was never
     peeked at and never mistyped during recall. */

  TD.mountDrill = function (root, cards, opts) {
    if (!root) return;
    opts = opts || {};
    if (!cards || !cards.length) {
      root.innerHTML = "";
      return;
    }

    var reps = opts.reps || DEFAULT_REPS;
    var mode = opts.mode || "lesson";

    root.innerHTML = shell({
      t: opts.t, sub: opts.sub, n: cards.length, mode: mode
    });

    var $ = function (s) { return root.querySelector(s); };

    var rail = $("#drRail");
    var phaseK = $("#drPhase");
    var phaseW = $("#drPhaseW");
    var intent = $("#drIntent");
    var targetBox = $("#drTarget");
    var ghostEl = $("#drGhost");
    var input = $("#drInput");
    var msg = $("#drMsg");
    var repsEl = $("#drReps");
    var speedEl = $("#drSpeed");
    var whyEl = $("#drWhy");
    var peekBtn = $("#drPeek");
    var checkBtn = $("#drCheck");
    var doneEl = $("#drDone");
    var doneCard = $("#drDoneCard");
    var stage = $("#drStage");

    /* The daily review opens straight into recall — these are lines you have
       already copied out in their lesson, and showing them again would turn
       a memory test back into a typing test. */
    var startPhase = opts.start === "recall" ? "recall" : "copy";

    var i = 0;          /* current card */
    var phase = startPhase;
    var hit = 0;        /* clean copies of the current card */
    var dirty = false;  /* peeked or mistyped during this card */
    var cleared = 0;

    /* A correct answer schedules the next screen a beat later so the reader
       sees the confirmation. Enter is easy to hit twice in that gap, and a
       second submission would score the same card again and skip past the
       next one — so submissions are ignored until the transition lands. */
    var busy = false;
    var over = false;

    /* The clock starts on the first keystroke of a card's recall attempt and
       stops when that attempt is accepted, so it measures typing rather than
       the pause while the reader reads the intent line and thinks. */
    var startedAt = 0;
    var lastRate = 0;
    var lastPb = false;
    var runRates = [];   /* every clean timed rate this session */
    var runPbs = 0;

    function target() { return normalise(cards[i].c); }
    function multiline() { return cards[i].c.indexOf("\n") >= 0; }

    function drawRail() {
      rail.innerHTML = cards.map(function (c, n) {
        var cls = n < i ? "is-done" : n === i ? "is-now" : "";
        return '<i class="' + cls + '"></i>';
      }).join("");
    }

    function drawReps() {
      var pips = "";
      for (var n = 0; n < reps; n++) {
        pips += '<i class="' + (n < hit ? "is-on" : "") + '"></i>';
      }
      repsEl.innerHTML = phase === "copy"
        ? pips + "<span>" + hit + " of " + reps + " clean copies</span>"
        : '<span class="dr-reps-recall">From memory — one clean run clears it</span>';
    }

    /* The card's own history, shown only once it has one. A first encounter
       has nothing useful to say, and an empty slot invites the reader to
       chase a number before they can produce the line at all. */
    function drawSpeed() {
      if (!speedEl) return;
      var rec = TD.drillRecord(cards[i].id);
      var bits = "";
      if (lastRate) {
        bits += '<span class="dr-sp-now' + (lastPb ? " is-pb" : "") + '">' +
          lastRate + '<i>cpm</i></span>';
      }
      if (rec && rec.best) {
        bits += '<span class="dr-sp-best">best ' + rec.best + '</span>';
      }
      speedEl.innerHTML = bits;
      speedEl.classList.toggle("is-on", !!bits);
    }

    /* The note, plus the control that moves on. Focus lands on the button so
       Enter continues -- the reader's hands are already on the keyboard and
       reaching for the mouse to advance would break the rhythm the whole
       section is trying to build. */
    function showWhy(card) {
      whyEl.innerHTML =
        '<span class="dr-why-k">' + TD.icon("bulb") + "Why this line</span>" +
        '<p class="dr-why-b">' + TD.rich(card.why) + "</p>" +
        '<button class="btn btn-primary btn-sm" type="button" id="drNext">' +
        (i + 1 >= cards.length ? "Finish" : "Next line") + "<kbd>&#8629;</kbd></button>";
      whyEl.hidden = false;

      var go = whyEl.querySelector("#drNext");
      go.addEventListener("click", function () {
        whyEl.hidden = true;
        nextCard();   /* clears busy itself */
      });
      go.focus();
    }

    function drawGhost() {
      ghostEl.innerHTML = ghost(target(), input.value);
    }

    function sizeInput() {
      input.rows = Math.max(1, target().split("\n").length);
    }

    function paint() {
      var card = cards[i];
      intent.innerHTML = TD.rich(card.w || "");
      targetBox.hidden = phase !== "copy";
      stage.setAttribute("data-phase", phase);

      phaseK.textContent = phase === "copy" ? "Copy it" : "From memory";
      phaseW.textContent = phase === "copy"
        ? "Type the line exactly as it appears — every space and every quote."
        : "The line is hidden. Write it from the description alone.";

      peekBtn.hidden = phase === "copy";
      peekBtn.textContent = "Show me the line";

      input.value = "";
      input.placeholder = phase === "copy" ? "" : "write it out";
      sizeInput();
      drawGhost();
      drawRail();
      drawReps();
      msg.textContent = "";
      msg.className = "dr-msg";
      startedAt = 0;
      if (whyEl) { whyEl.hidden = true; whyEl.innerHTML = ""; }
      root.querySelector(".dr").classList.remove("is-good", "is-bad");
      drawSpeed();
      input.focus();
    }

    function flash(cls) {
      var box = root.querySelector(".dr");
      box.classList.remove("is-good", "is-bad");
      void box.offsetWidth;
      box.classList.add(cls);
    }

    function say(text, kind) {
      msg.textContent = text;
      msg.className = "dr-msg is-" + kind;
    }

    function nextCard() {
      cleared++;
      doneEl.textContent = cleared;
      i++;
      if (i >= cards.length) return finish();
      phase = startPhase;
      hit = 0;
      dirty = false;
      busy = false;
      lastRate = 0;
      lastPb = false;
      paint();
    }

    /* The session's own speed, not the all-time figure -- a reader wants to
       know how this run went. Reported as an average of the clean timed runs,
       with personal bests called out because that is the thing worth chasing. */
    function speedLine() {
      if (!runRates.length) return "";
      var sum = runRates.reduce(function (a, b) { return a + b; }, 0);
      var avg = Math.round(sum / runRates.length);
      return '<p class="dr-done-speed">' + TD.icon("gauge") +
        "<b>" + avg + " cpm</b> average across " + runRates.length +
        (runRates.length === 1 ? " timed line" : " timed lines") +
        (runPbs ? " &middot; <b>" + runPbs + "</b> personal best" + (runPbs === 1 ? "" : "s") : "") +
        "</p>";
    }

    function finish() {
      over = true;
      busy = false;
      stage.hidden = true;
      doneCard.hidden = false;

      var streak = TD.progress.touchStreak();
      var marked = opts.lessonKey ? TD.progress.mark(opts.lessonKey) : false;

      doneCard.innerHTML = '<div class="dr-done-in">' +
        '<span class="dr-done-ico" aria-hidden="true">' + TD.icon("check") + "</span>" +
        "<h3>" + (mode === "daily" ? "Review cleared" : "That is in your fingers now") + "</h3>" +
        "<p>" + cards.length + (cards.length === 1 ? " line" : " lines") +
        " typed from memory." +
        (marked ? " This lesson is marked complete." : "") +
        " They will come back for review on a widening schedule — tomorrow, " +
        "then in a few days, then in a few weeks.</p>" +
        speedLine() +
        '<p class="dr-done-streak">' + TD.icon("spark") + "<b>" + streak +
        (streak === 1 ? " day</b> streak — it starts today." : " day</b> streak.") + "</p>" +
        '<div class="dr-done-acts">' +
        '<button class="btn btn-ghost btn-sm" type="button" id="drAgain">' +
        TD.icon("dice") + "Run it again</button>" +
        (opts.nextHref ? '<a class="btn btn-primary btn-sm" href="' + esc(opts.nextHref) + '">' +
          esc(opts.nextLabel || "Next lesson") + TD.icon("arrowRight") + "</a>" : "") +
        "</div></div>";

      var again = doneCard.querySelector("#drAgain");
      if (again) {
        again.addEventListener("click", function () {
          i = 0; phase = startPhase; hit = 0; dirty = false; cleared = 0;
          busy = false; over = false;
          runRates = []; runPbs = 0; lastRate = 0; lastPb = false;
          doneEl.textContent = "0";
          doneCard.hidden = true;
          stage.hidden = false;
          paint();
        });
      }
      if (opts.onDone) opts.onDone();
    }

    function check() {
      if (busy || over) return;

      var typed = normalise(input.value);
      var want = target();

      if (!typed.length) {
        say("Nothing typed yet.", "bad");
        return;
      }

      if (typed === want) {
        if (phase === "copy") {
          hit++;
          flash("good");
          if (hit >= reps) {
            phase = "recall";
            hit = 0;
            busy = true;
            say("Clean. Now do it with the line hidden.", "good");
            setTimeout(function () { busy = false; paint(); }, 620);
          } else {
            say("Correct — " + (reps - hit) + " more to go.", "good");
            input.value = "";
            drawGhost();
            drawReps();
          }
        } else {
          var ms = startedAt ? Date.now() - startedAt : 0;
          var rec = record(cards[i].id, !dirty, ms, want.length);
          lastRate = !dirty && ms ? TD.drillCpm(want.length, ms) : 0;
          lastPb = !!(rec && rec.pb && lastRate);
          if (lastRate) runRates.push(lastRate);
          if (lastPb) runPbs++;
          busy = true;
          flash("good");
          say(dirty
            ? "Correct. That one comes back tomorrow."
            : lastRate
              ? (lastPb
                ? "From memory, first try — " + lastRate + " cpm, your fastest yet."
                : "From memory, first try — " + lastRate + " cpm" +
                  (rec.best ? " (best " + rec.best + ")" : "") + ".")
              : "From memory, first try. Filed away.", "good");
          drawSpeed();

          /* A card with something to teach holds the screen longer, and the
             reader advances when they are ready rather than on a timer --
             a note that vanishes before it is read teaches nothing. */
          if (cards[i].why && whyEl) {
            showWhy(cards[i]);
          } else {
            setTimeout(nextCard, lastPb ? 1000 : 700);
          }
        }
        return;
      }

      /* wrong — point at exactly where it diverged */
      dirty = true;
      flash("bad");
      var d = firstDiff(typed, want);
      if (d < 0) {
        say("That is the start of it — keep going, the line is not finished.", "bad");
      } else if (d >= want.length) {
        say("There is extra on the end. The line stops after " + want.length + " characters.", "bad");
      } else {
        var ch = want.charAt(d);
        var label = ch === " " ? "a space" : ch === "\n" ? "a new line" : '"' + ch + '"';
        say("Character " + (d + 1) + " should be " + label + ". Fix it there.", "bad");
        input.focus();
        try { input.setSelectionRange(d, typed.length); } catch (e) { /* ignore */ }
      }
      drawGhost();
    }

    input.addEventListener("input", function () {
      if (!startedAt && input.value.length) startedAt = Date.now();
      if (phase === "copy") drawGhost();
      if (msg.textContent) { msg.textContent = ""; msg.className = "dr-msg"; }
    });

    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && !e.shiftKey && !multiline()) {
        e.preventDefault();
        check();
        return;
      }
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        check();
        return;
      }
      if (e.key === "Tab" && multiline() && !e.shiftKey) {
        e.preventDefault();
        var s = input.selectionStart, en = input.selectionEnd;
        input.value = input.value.slice(0, s) + "  " + input.value.slice(en);
        input.selectionStart = input.selectionEnd = s + 2;
        drawGhost();
        return;
      }
      if (e.key === "Escape") {
        /* let the reader out of a multi-line box without trapping Tab */
        e.stopPropagation();
        input.blur();
      }
    });

    checkBtn.addEventListener("click", check);

    peekBtn.addEventListener("click", function () {
      dirty = true;
      targetBox.hidden = false;
      ghostEl.innerHTML = '<span class="dr-rest">' + esc(target()) + "</span>";
      peekBtn.hidden = true;
      say("Looked it up — this card will come back sooner.", "warn");
      input.focus();
    });

    paint();
  };

})(window.TD);
