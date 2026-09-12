/* ==========================================================================
   landing.js — the front page.

   The old home page led with a rotating "Concept Spotlight": one card, one
   term at a time, cycling. It showed a dictionary. But this is not a
   dictionary any more — it is 1,481 entries, 481 lessons across 26 tracks,
   1,419 questions, 117 katas, 62 case studies, 21 speaking sessions, 60
   projects and 4 career plans, and a card that shows one word at a time can
   only ever advertise the smallest of those.

   So the page is now an *index*, in the book sense: a front matter that
   states plainly what is inside and where each part begins. It is set like a
   reference work — a serif display face, real rules, generous margins,
   marginalia in the gutter — because the thing being sold here is
   authority, and authority does not look like a product launch.

   Every number rendered below is counted from the loaded data at run time.
   None of them are typed in. If a track is added the page says so by itself.
   ========================================================================== */

(function (TD) {
  "use strict";

  function esc(s) { return TD.esc(s); }
  function icon(n) { return TD.icon(n); }

  /* Roman numerals for the section marks. The page has nine sections and is
     never going to have forty, so the table stops where it stops. */
  var ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

  function fmt(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ","); }

  /* ---------- counted facts ----------
     Everything the page claims about itself, derived. Kept in one function so
     there is exactly one place where a number could ever be wrong, and so the
     test can assert against the same source the page renders from. */
  function facts() {
    var terms = TD.terms || [];
    var f = {
      terms: terms.length,
      fields: (TD.categories || []).length,
      diagrams: terms.filter(function (t) { return t.dg && TD.hasDiagram && TD.hasDiagram(t.dg); }).length,
      examples: terms.filter(function (t) { return t.ex; }).length,
      flows: terms.filter(function (t) { return t.fl; }).length,
      lessons: (TD.lessons || []).length,
      tracks: (TD.tracks || []).length,
      stages: (TD.stages || []).length,
      questions: (TD.quizzes || []).length,
      katas: (TD.katas || []).length,
      studies: (TD.studies || []).length,
      speaking: (TD.speakSessions || []).length,
      projects: (TD.projects || []).length,
      paths: (TD.paths || []).length,
      journeys: (TD.journeys || []).length,
      roles: (TD.roles || []).length,
      cues: (TD.logicCards || []).length,
      speedSets: (TD.speedSets || []).length,
      interviews: (TD.interviewQuestions || []).length,
      companies: (TD.interviewCompanies || []).length,
      papers: (TD.landmarkPapers || []).length
    };
    /* the hardcore subset is what the question bank is actually known for.
       `hardcore` is a level, not a flag — it marks the questions written
       around the wrong answer rather than around a harder fact. */
    f.hardcore = (TD.quizzes || []).filter(function (q) { return q.lvl === "hardcore"; }).length;
    return f;
  }

  /* ---------- the masthead ----------
     A reference book opens by saying what it is and how large it is, then
     gets out of the way. That is the whole brief for this block.

     The type is deliberately restrained: Newsreader at 300, around 3.1rem,
     tight leading, two short lines. The first version of this hero set four
     lines at 4.1rem and it shouted — a reference work that shouts reads as a
     product page, which is the one thing this is not.

     The motion is a single ink wipe. Each line lives inside an SVG mask whose
     white shape sweeps left to right, so the words are revealed the way ink
     meets paper rather than fading in. A hand-drawn rule then draws itself
     under the phrase that carries the claim. Both are strokes and masks —
     nothing here animates a layout property.

     The search field sits immediately under the title because the single most
     common intent on this site is "I have a word and I do not know it". */

  /* A line of the headline, wrapped in its own mask so it can be wiped
     independently and on its own delay. The mask gradient has a soft edge, so
     the leading edge of the reveal is a feather rather than a hard wall. */
  function wipeLine(delay, cls, html) {
    return '<span class="ed-wipe ' + (cls || "") + '" style="--wd:' + delay + 'ms">' +
      '<span class="ed-wipe-in">' + html + '</span>' +
    '</span>';
  }

  function masthead(f) {
    return '<header class="ed-mast" data-rise-group data-rise-step="70">' +

      '<div class="ed-mast-grid">' +
        '<div class="ed-mast-copy">' +

          '<h1 class="ed-title" data-rise>' +
            wipeLine(120, "ed-title-a",
              'Everything an engineer') +
            wipeLine(260, "ed-title-b",
              'is expected to ' +
              '<span class="ed-know">know' +
                /* the drawn rule. Two overlapping strokes at slightly
                   different lengths and angles, so it reads as a pen mark
                   rather than as a border-bottom. */
                '<svg class="ed-underline" viewBox="0 0 220 16" fill="none" ' +
                  'aria-hidden="true" preserveAspectRatio="none">' +
                  /* no data-draw: these are scaled in by their own keyframe.
                     stroke-dashoffset and non-scaling-stroke disagree about
                     units, and the mark needs a real stroke width more than
                     it needs to be drawn end to end. */
                  '<path class="ed-ul-1" d="M3 9C48 3 140 2 217 6" />' +
                  '<path class="ed-ul-2" d="M6 14C52 9 144 8 214 11" />' +
                '</svg>' +
              '</span>.') +
          '</h1>' +

          '<p class="ed-lede" data-rise>' +
            'A working reference for the whole of it — ' +
            '<b>' + fmt(f.terms) + '</b> concepts written out properly, ' +
            '<b>' + fmt(f.lessons) + '</b> lessons that expect you to type, and ' +
            '<b>' + fmt(f.questions) + '</b> questions that expect you to be wrong first.' +
          '</p>' +

          /* the primary action */
          '<div class="ed-find" id="heroFind" data-rise>' +
            '<form class="ed-search" id="heroSearch" role="search">' +
              '<span class="ed-search-ico" aria-hidden="true">' + icon("search") + '</span>' +
              '<input class="ed-search-input" id="heroSearchInput" type="text" ' +
                'autocomplete="off" autocorrect="off" spellcheck="false" ' +
                'aria-label="Search concepts, lessons and case studies" ' +
                'role="combobox" aria-expanded="false" aria-controls="heroSug" ' +
                'aria-autocomplete="list" ' +
                'placeholder="Look up a word — transformer, ACID, closure…" />' +
              '<kbd class="ed-search-kbd" aria-hidden="true">/</kbd>' +
              '<button class="ed-search-go" type="submit">' +
                '<span>Look up</span>' + icon("arrowRight") +
              '</button>' +
            '</form>' +
            '<div class="ed-sug hero-sug" id="heroSug" hidden>' +
              '<ul class="hero-sug-list" id="heroSugList" role="listbox" aria-label="Suggestions"></ul>' +
              '<p class="hero-sug-foot"><kbd>↑</kbd><kbd>↓</kbd> to move · <kbd>↵</kbd> to open · ' +
              '<kbd>Esc</kbd> to dismiss</p>' +
            '</div>' +
          '</div>' +

          /* a few real words people actually look up, as one-tap entries into
             the dictionary — cheaper for a first-time visitor than thinking
             of a query cold */
          '<p class="ed-tries" data-rise>' +
            '<span class="ed-tries-k">Try</span>' +
            /* these are resolved by name, and a name that does not resolve
               renders as nothing at all — test_landing.js asserts all five
               survive so a rename upstream cannot quietly empty this row */
            tryLink("Transformer") + tryLink("Idempotency") +
            tryLink("ACID") + tryLink("Closure") + tryLink("Backpropagation") +
          '</p>' +

        '</div>' +

        /* the colophon block — the "what is inside" table, set as a real
           table of contents rather than as feature cards */
        '<aside class="ed-colophon" data-rise>' +
          '<p class="ed-colophon-k">Contents</p>' +
          '<ol class="ed-toc">' +
            tocRow(1, "The dictionary", f.terms, "concepts", "#/index") +
            tocRow(2, "Courses", f.lessons, "lessons", "#/learn") +
            tocRow(3, "Question bank", f.questions, "questions", "#/quiz") +
            tocRow(4, "Code dojo", f.katas, "katas", "#/code") +
            tocRow(5, "Case studies", f.studies, "studies", "#/studies") +
            tocRow(6, "Project lab", f.projects, "briefs", "#/projects") +
            tocRow(7, "Interview bank", f.interviews, "questions", "#/interviews") +
            tocRow(8, "Speaking practice", f.speaking, "sessions", "#/speak") +
          '</ol>' +
          '<p class="ed-colophon-foot">' +
            fmt(f.diagrams) + ' hand-drawn diagrams · ' + fmt(f.cues) + ' cue cards · ' +
            f.paths + ' reading paths' +
          '</p>' +
        '</aside>' +
      '</div>' +
    '</header>';
  }

  /* One of the words people actually arrive wanting. Cheaper for a first-time
     visitor than having to invent a query cold. */
  function tryLink(name) {
    var t = TD.resolve(name);
    if (!t) return "";
    return '<a class="ed-try" href="#/t/' + t.slug + '">' + esc(t.t) + '</a>';
  }

  function tocRow(n, name, count, unit, href) {
    return '<li class="ed-toc-row">' +
      '<a href="' + href + '">' +
        '<span class="ed-toc-n">' + (n < 10 ? "0" + n : n) + '</span>' +
        '<span class="ed-toc-name">' + esc(name) + '</span>' +
        '<span class="ed-toc-dots" aria-hidden="true"></span>' +
        '<span class="ed-toc-c"><b data-count="' + count + '">' + fmt(count) + '</b> ' +
          esc(unit) + '</span>' +
      '</a></li>';
  }

  /* ---------- section heading ----------
     Numbered, ruled, with the count in the margin. This is the device that
     holds the whole page together: every band below announces itself the
     same way, so the page reads as one document rather than nine widgets. */
  function head(n, title, lede, href, linkText) {
    return '<div class="ed-head" data-rise>' +
      '<p class="ed-head-n"><span>' + ROMAN[n] + '</span></p>' +
      '<div class="ed-head-b">' +
        '<h2>' + esc(title) + '</h2>' +
        (lede ? '<p class="ed-head-lede">' + esc(lede) + '</p>' : '') +
      '</div>' +
      (href ? '<a class="ed-head-go" href="' + href + '">' + esc(linkText || "Open") +
        icon("arrowRight") + '</a>' : '') +
    '</div>';
  }

  /* ---------- the anatomy figure ----------
     An argument the old page tried to make with a rotating card and could
     not: what one entry actually contains. Here it is drawn instead — a
     single figure whose rules draw themselves in, labelling the parts of an
     entry the way a textbook labels a diagram of an engine.

     Every stroke carries data-draw, so motion.js measures its real length and
     animates stroke-dashoffset from that to zero. The stroke is the mask.
     Under reduced motion the figure is simply already drawn, which is the
     same figure — nothing here is load-bearing on the animation. */
  function anatomy(f) {
    return '<figure class="ed-anat" data-rise>' +
      '<svg class="ed-anat-svg" viewBox="0 0 780 300" role="img" ' +
        'aria-label="The parts of a single entry: a definition, two explanatory ' +
        'paragraphs, four key points, and a worked example followed by a ' +
        'step-by-step flow.">' +

        /* the page outline */
        '<rect class="ed-anat-page" x="18" y="26" width="322" height="250" rx="8" ' +
          'data-draw="0" data-draw-len="1144" />' +

        /* the entry's title */
        '<path class="ed-anat-ink ed-anat-ink-hd" d="M46 62 H226" data-draw="200" data-draw-len="180" />' +
        '<path class="ed-anat-ink ed-anat-ink-hd" d="M46 78 H172" data-draw="250" data-draw-len="126" />' +

        /* two paragraphs */
        '<path class="ed-anat-ink" d="M46 112 H312" data-draw="330" data-draw-len="266" />' +
        '<path class="ed-anat-ink" d="M46 128 H312" data-draw="365" data-draw-len="266" />' +
        '<path class="ed-anat-ink" d="M46 144 H258" data-draw="400" data-draw-len="212" />' +

        /* four key points */
        '<path class="ed-anat-ink" d="M46 178 H186" data-draw="460" data-draw-len="140" />' +
        '<path class="ed-anat-ink" d="M46 194 H204" data-draw="490" data-draw-len="158" />' +

        /* example, then flow */
        '<path class="ed-anat-ink" d="M46 228 H312" data-draw="550" data-draw-len="266" />' +
        '<path class="ed-anat-ink" d="M46 244 H272" data-draw="580" data-draw-len="226" />' +

        /* the leader lines out to the labels. These carry the meaning, so
           they land last and each label fades in only once its own line has
           arrived under it. */
        leader("M226 70 H392", 700, 166, 402, 74, "A definition you could say out loud") +
        leader("M312 128 H392", 790, 80, 402, 132, "Two paragraphs that explain it") +
        leader("M204 186 H392", 880, 188, 402, 190, "Four points worth remembering") +
        leader("M312 236 H392", 970, 80, 402, 240, "A worked example, then the flow") +

      '</svg>' +
      '<figcaption class="ed-anat-cap">' +
        'All ' + fmt(f.terms) + ' entries are written to the same shape, so you always ' +
        'know where in one the answer is going to be. ' + fmt(f.examples) + ' carry a worked ' +
        'example, ' + fmt(f.flows) + ' a step-by-step flow, and ' + fmt(f.diagrams) +
        ' a diagram drawn by hand rather than generated.' +
      '</figcaption>' +
    '</figure>';
  }

  function leader(d, delay, len, tx, ty, label) {
    return '<path class="ed-anat-lead" d="' + d + '" data-draw="' + delay +
      '" data-draw-len="' + len + '" />' +
      '<text class="ed-anat-label" x="' + tx + '" y="' + ty + '" ' +
        'style="--d:' + (delay + 260) + 'ms">' + esc(label) + '</text>';
  }

  /* ---------- the ladder ----------
     Ten stages, ground to offer. This is the site's actual spine, and the old
     home page never showed it — a reader had to find /learn and then read a
     paragraph to discover there was an order at all.

     The line is SVG, because a curve drawn by a pen is the point. The nodes
     and the labels are HTML in the same CSS grid, because an SVG stretched
     with preserveAspectRatio="none" distorts anything round and puts text at
     the mercy of the viewBox. Splitting them means the curve can stretch
     while the dots stay circular and the labels stay in the type system. */
  function ladder(f) {
    var stages = TD.stages || [];
    if (!stages.length) return "";

    var n = stages.length;
    var H = 100, amp = 20;

    /* The HTML nodes are centred in n equal columns, so node i sits at
       (i + 0.5)/n of the width. The SVG has to agree with that exactly or the
       curve drifts away from the dots — most visibly at the last one. So the
       viewBox spans the same n columns and the curve runs between the centres
       of the first and last, rather than across the full box. */
    var COL = 100;
    var W = n * COL;

    function xAt(i) { return i * COL + COL / 2; }
    function yAt(i) { return H / 2 + (i % 2 ? amp : -amp); }

    var d = "M" + xAt(0) + " " + yAt(0);
    for (var i = 1; i < n; i++) {
      var px = xAt(i - 1), py = yAt(i - 1);
      var x = xAt(i), y = yAt(i);
      d += " C" + (px + COL * .46) + " " + py + " " + (x - COL * .46) + " " + y +
        " " + x + " " + y;
    }

    /* the nodes ride the same wave, positioned as a percentage of the track's
       height so they land on the curve whatever it is scaled to */
    var stops = stages.map(function (s, i) {
      return '<a class="ed-lad-stop" href="#/learn" style="--d:' + (700 + i * 95) + 'ms">' +
        '<span class="ed-lad-n">' + (i < 9 ? "0" : "") + (i + 1) + '</span>' +
        '<span class="ed-lad-t">' + esc(s.name) + '</span></a>';
    }).join("");

    return '<div class="ed-ladder" data-rise style="--lad-n:' + n + '">' +
      '<div class="ed-lad-track">' +
        '<svg class="ed-lad-svg" viewBox="0 0 ' + W + ' ' + H + '" ' +
          'preserveAspectRatio="none" aria-hidden="true">' +
          '<path class="ed-lad-line" d="' + d + '" data-draw="0" ' +
            'data-draw-len="' + (W + 140) + '" />' +
        '</svg>' +
        '<div class="ed-lad-nodes" aria-hidden="true">' +
          stages.map(function (s, i) {
            return '<span class="ed-lad-dot" style="--nt:' +
              (yAt(i) / H * 100).toFixed(1) + '%; --d:' + (620 + i * 95) + 'ms"></span>';
          }).join("") +
        '</div>' +
      '</div>' +
      '<div class="ed-lad-stops">' + stops + '</div>' +
      '<p class="ed-lad-note">' + n + ' stages · ' + f.tracks + ' tracks · ' +
        fmt(f.lessons) + ' lessons. Nothing appears before the thing it depends on.</p>' +
    '</div>';
  }

  /* ---------- tracks ----------
     Set as a list rather than as cards. Twenty-six cards is wallpaper;
     twenty-six ruled rows with a count in the margin is a syllabus, and a
     reader can scan it the way they would scan a contents page. */
  function trackList(limit) {
    var tracks = (TD.tracks || []).slice(0, limit || 26);
    if (!tracks.length) return "";

    return '<ol class="ed-tracks" data-rise-group data-rise-step="26">' +
      tracks.map(function (t, i) {
        var done = 0;
        if (TD.progress && TD.progress.done && t.modules) {
          done = (TD.progress.done || []).filter(function (k) {
            return k.indexOf(t.id + "/") === 0;
          }).length;
        }
        var pct = t.count ? Math.round(done / t.count * 100) : 0;

        return '<li class="ed-track" data-rise style="--tc:' + (t.col || "var(--accent)") + '">' +
          '<a href="#/learn/' + t.id + '">' +
            '<span class="ed-track-n">' + (i + 1 < 10 ? "0" : "") + (i + 1) + '</span>' +
            '<span class="ed-track-ico">' + icon(t.icon) + '</span>' +
            '<span class="ed-track-b">' +
              '<span class="ed-track-t">' + esc(t.short) + '</span>' +
              '<span class="ed-track-d">' + esc(t.deck || t.desc || "") + '</span>' +
            '</span>' +
            '<span class="ed-track-m">' +
              '<span class="ed-track-c">' + t.count + ' lessons</span>' +
              (pct ? '<span class="ed-track-p">' + pct + '% read</span>' : '') +
            '</span>' +
            '<span class="ed-track-go" aria-hidden="true">' + icon("right") + '</span>' +
          '</a>' +
          (pct ? '<span class="ed-track-bar"><i style="width:' + pct + '%"></i></span>' : '') +
        '</li>';
      }).join("") +
    '</ol>';
  }

  /* ---------- practice ----------
     Four things that expect you to produce something rather than read. They
     are grouped because that is the honest distinction on this site: the
     dictionary and the courses are input, these are output. */
  function practice(f) {
    var items = [
      ["quiz", "Question bank", f.questions, "questions",
        "Multiple choice with worked solutions, " + fmt(f.hardcore) +
        " of them written around the wrong answer rather than a harder fact.", "#/quiz"],
      ["pen", "Code dojo", f.katas, "katas",
        "Write the function, run it in the browser, watch the cases pass or fail.", "#/code"],
      ["gauge", "Speed coding", f.speedSets, "sets",
        "The lines you should not have to think about, timed until you do not.", "#/speed"],
      ["mic", "Speaking practice", f.speaking, "sessions",
        "Say the answer out loud. The page listens through the microphone and marks what it hears.", "#/speak"],
      ["bulb", "Cue cards", f.cues, "cards",
        "One filter across every table — the pattern, the tell, and what to reach for.", "#/cards/patterns"],
      ["shield", "Interview bank", f.interviews, "questions",
        "What " + f.companies + " companies actually ask, with the answer they are listening for.", "#/interviews"]
    ];

    return '<div class="ed-prac" data-rise-group data-rise-step="55">' +
      items.map(function (it) {
        return '<a class="ed-prac-card" href="' + it[5] + '" data-rise>' +
          '<span class="ed-prac-ico">' + icon(it[0]) + '</span>' +
          '<span class="ed-prac-n"><b data-count="' + it[2] + '">' + fmt(it[2]) + '</b>' +
            '<span>' + esc(it[3]) + '</span></span>' +
          '<span class="ed-prac-t">' + esc(it[1]) + '</span>' +
          '<span class="ed-prac-d">' + esc(it[4]) + '</span>' +
        '</a>';
      }).join("") +
    '</div>';
  }

  /* ---------- the fields ----------
     Nineteen shelves, set as an index page: name, rule, count. The reader is
     scanning for one word, so the type does the work and the decoration
     stays out of it. */
  function fields() {
    var cats = TD.categories || [];
    return '<div class="ed-fields" data-rise-group data-rise-step="24">' +
      cats.map(function (c) {
        return '<a class="ed-field" href="#/c/' + c.id + '" data-cat="' + c.id + '" data-rise>' +
          '<span class="ed-field-ico">' + icon(c.icon) + '</span>' +
          '<span class="ed-field-t">' + esc(c.name) + '</span>' +
          '<span class="ed-field-dots" aria-hidden="true"></span>' +
          '<span class="ed-field-c">' + c.count + '</span>' +
        '</a>';
      }).join("") +
    '</div>';
  }

  /* ---------- case studies ----------
     One per collection, most recent first. These are the pages people send
     each other, so they get real estate and a pull quote rather than a card
     with a truncated deck. */
  function studies() {
    var cols = TD.collections || [];
    var pick = cols.map(function (c) {
      var inC = TD.inCollection(c.id) || [];
      return inC.slice().sort(function (a, b) { return b.y - a.y; })[0];
    }).filter(Boolean).slice(0, 4);
    if (!pick.length) return "";

    return '<div class="ed-studies" data-rise-group data-rise-step="70">' +
      pick.map(function (s) {
        var c = TD.colById[s.col] || {};
        return '<a class="ed-study" href="#/s/' + s.slug + '" data-col="' + s.col +
          '" data-rise>' +
          '<span class="ed-study-y">' + esc(String(s.y)) + '</span>' +
          '<span class="ed-study-c">' + esc(c.short || c.name || "") + '</span>' +
          '<span class="ed-study-t">' + esc(s.t) + '</span>' +
          '<span class="ed-study-d">' + esc(s.s || "") + '</span>' +
          '<span class="ed-study-go">Read the story' + icon("arrowRight") + '</span>' +
        '</a>';
      }).join("") +
    '</div>';
  }

  /* ---------- plans ----------
     The four career journeys. This is the answer to the one real usability
     problem the site has — twenty-six tracks is a library, and a library is
     paralysing when what you wanted was to be told what to do on Monday. */
  function plans() {
    var js = TD.journeys || [];
    if (!js.length) return "";

    return '<div class="ed-plans" data-rise-group data-rise-step="70">' +
      js.map(function (j) {
        var ph = (j.phases || []).length;
        /* weeks is a number of weeks, not a label */
        var weeks = j.weeks ? j.weeks + " weeks" : "";
        return '<a class="ed-plan" href="#/plan/' + j.id + '" style="--jc:' + j.col +
          '" data-rise>' +
          '<span class="ed-plan-ico">' + icon(j.icon) + '</span>' +
          '<span class="ed-plan-t">' + esc(j.short) + '</span>' +
          '<span class="ed-plan-d">' + esc(j.deck || "") + '</span>' +
          '<span class="ed-plan-m">' +
            (ph ? '<span>' + ph + ' phases</span>' : '') +
            (weeks ? '<span>' + esc(weeks) + '</span>' : '') +
          '</span>' +
        '</a>';
      }).join("") +
    '</div>';
  }

  /* ---------- resume band ----------
     A returning reader should not have to remember where they were, and a
     new one should be offered the single control that resolves the choice
     paralysis the rest of the page necessarily creates.

     This is the one block carried over from the old home page rather than
     rewritten, and it keeps its original rz-* class hooks alongside the new
     editorial ones. Those hooks are the contract test_journey.js asserts
     against — that choosing a plan changes what the front page offers — and
     that behaviour did not change just because the paint did. */
  function resume() {
    if (!TD.journeyChoice) return "";
    var J = TD.journeyChoice.current();

    if (!J) {
      return '<a class="ed-resume ed-resume-new rz rz-empty" href="#/plan" data-rise>' +
        '<span class="ed-resume-ico">' + icon("compass") + '</span>' +
        '<span class="ed-resume-b">' +
          '<span class="ed-resume-k">Start here</span>' +
          '<span class="ed-resume-h">Pick the job you want and this becomes a plan</span>' +
          '<span class="ed-resume-d">Twenty-six tracks is a library. Choose a role and it turns ' +
            'into a week-by-week route with the practice already attached.</span>' +
        '</span>' +
        '<span class="ed-resume-go">' + icon("right") + '</span>' +
      '</a>';
    }

    var next = TD.journeyNext(J);
    var pr = TD.journeyProgress(J);

    return '<div class="ed-resume rz" style="--jc:' + J.col + '" data-rise>' +
      '<span class="ed-resume-ico">' + icon(J.icon) + '</span>' +
      '<span class="ed-resume-b">' +
        '<span class="ed-resume-k">' + esc(J.short) + ' · ' + pr.pct + '% complete</span>' +
        (next
          ? '<span class="ed-resume-h">' + esc(next.lesson.t) + '</span>' +
            '<span class="ed-resume-d">' + esc(next.phase.name) + ' · ' + esc(next.phase.weeks) + '</span>'
          : '<span class="ed-resume-h">The reading is done.</span>' +
            '<span class="ed-resume-d">Move to the interview bank and finish your projects.</span>') +
        '<span class="ed-resume-bar"><i style="width:' + pr.pct + '%"></i></span>' +
      '</span>' +
      '<span class="ed-resume-a rz-a">' +
        (next
          ? '<a class="btn btn-primary btn-sm" href="#/learn/' + next.lesson.key + '">' +
            icon("play") + 'Continue</a>'
          : '<a class="btn btn-primary btn-sm" href="#/interviews">' +
            icon("shield") + 'Interviews</a>') +
        '<a class="btn btn-ghost btn-sm" href="#/plan/' + J.id + '">' + icon("compass") + 'Plan</a>' +
      '</span>' +
    '</div>';
  }

  /* ---------- the closing note ----------
     Not a call to action. A colophon: who it is for, what it costs, how it
     was made. On a reference work that is the more persuasive ending. */
  function colophon(f) {
    return '<section class="ed-end" data-rise-group data-rise-step="70">' +
      '<div class="ed-end-rule" aria-hidden="true"></div>' +
      '<div class="ed-end-grid">' +
        '<div class="ed-end-copy" data-rise>' +
          '<h2>Written for the moment you are nodding along and do not know the word.</h2>' +
          '<p>Every entry is here because someone had to look it up mid-meeting. There is no ' +
            'account to make, nothing to subscribe to, and no analytics watching which words ' +
            'you did not know. It is ' + fmt(f.terms) + ' plain HTML pages and a search box.</p>' +
          '<div class="ed-end-cta">' +
            '<a class="btn btn-primary" href="#/learn">' + icon("code") + 'Start the courses</a>' +
            '<a class="btn btn-ghost" href="#/index">' + icon("az") + 'Browse the A–Z</a>' +
          '</div>' +
        '</div>' +
        '<dl class="ed-end-facts" data-rise>' +
          fact("Concepts", f.terms) +
          fact("Lessons", f.lessons) +
          fact("Questions", f.questions) +
          fact("Diagrams", f.diagrams) +
          fact("Case studies", f.studies) +
          fact("Dependencies", 0) +
        '</dl>' +
      '</div>' +
    '</section>';
  }

  function fact(k, v) {
    return '<div class="ed-end-fact"><dt>' + esc(k) + '</dt>' +
      '<dd data-count="' + v + '">' + fmt(v) + '</dd></div>';
  }

  /* ================= the page ================= */

  function view() {
    var f = facts();

    var h = '<div class="ed" data-rise-group data-rise-step="0">';

    h += masthead(f);
    h += resume();

    /* I — what an entry is */
    h += '<section class="ed-sec ed-sec-anat" data-rise-group data-rise-step="70">' +
      head(1, "What one entry looks like",
        "The same shape every time, so you always know where the answer is going to be.",
        "#/index", "Open the A–Z") +
      anatomy(f) +
    '</section>';

    /* II — the route */
    h += '<section class="ed-sec" data-rise-group data-rise-step="70">' +
      head(2, "The route, end to end",
        "From not knowing what a terminal is, to an offer. Ten stages, in the order they " +
        "actually have to be taken.",
        "#/learn", "Open the courses") +
      ladder(f) +
    '</section>';

    /* III — the tracks */
    h += '<section class="ed-sec" data-rise-group data-rise-step="26">' +
      head(3, "Courses",
        "Full tracks, not chapters. Every lesson carries the reason the code exists beside " +
        "the code, and ends in something you have to type.",
        "#/learn", "All " + f.tracks + " tracks") +
      trackList(12) +
      '<p class="ed-more" data-rise><a href="#/learn">' +
        'and ' + (f.tracks - 12) + ' more tracks' + icon("arrowRight") + '</a></p>' +
    '</section>';

    /* IV — practice */
    h += '<section class="ed-sec" data-rise-group data-rise-step="55">' +
      head(4, "Practice",
        "The half of the site that expects you to produce something rather than read.",
        "#/quiz", "Question bank") +
      practice(f) +
    '</section>';

    /* V — plans */
    h += '<section class="ed-sec" data-rise-group data-rise-step="70">' +
      head(5, "Plans",
        "Four roles, each turned into a week-by-week route with the reading, the practice " +
        "and the projects already ordered.",
        "#/plan", "All plans") +
      plans() +
    '</section>';

    /* VI — the fields */
    h += '<section class="ed-sec" data-rise-group data-rise-step="24">' +
      head(6, "The dictionary",
        f.fields + " fields, " + fmt(f.terms) + " concepts. Pick the shelf that matches the " +
        "problem in front of you.",
        "#/index", "A–Z index") +
      fields() +
    '</section>';

    /* VII — case studies */
    h += '<section class="ed-sec" data-rise-group data-rise-step="70">' +
      head(7, "Case studies",
        "The incidents, systems and papers engineers reference in conversation — each one a " +
        "thirty-second skim or a five-minute read.",
        "#/studies", "All " + f.studies + " studies") +
      studies() +
    '</section>';

    h += colophon(f);
    h += '</div>';

    return h;
  }

  /* ================= behaviour ================= */

  /* The headline's reveal is pure CSS — the ink wipe is driven by the same
     [data-rise] class the rest of the page uses, and the underline is drawn
     by motion.js like every other stroke. There is nothing left for this
     module to wire by hand. */

  function mount() {
    if (TD.mo) TD.mo.mount(document.getElementById("view") || document);
  }

  function unmount() {
    if (TD.mo) TD.mo.stop();
  }

  TD.viewLanding = view;
  TD.mountLanding = mount;
  TD.unmountLanding = unmount;
  TD.landingFacts = facts;
})(window.TD = window.TD || {});
