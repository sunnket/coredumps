/* NodeCraft Banks — the two scored content types.

   Everything before this file is read. This file registers the two things
   that are *performed*: a bank of multiple-choice questions, and a set of
   speaking sessions. They live together because they share one idea — a
   score, kept per chapter, that means nothing until the reader has actually
   attempted something.

   Loaded after core.js, because it uses TD.store, TD.progress and the track
   registry; loaded before the data files, which call into it.
*/
(function (TD) {
  "use strict";

  /* ==================================================================
     Question banks

     A question belongs to a track and to one module of that track, which
     is all the structure a chaptered bank needs: no chapter list is
     maintained anywhere, it is derived from the modules the track already
     declares. Add a module to a track and its chapter appears; write no
     questions for it and the chapter quietly does not.

     One question is deliberately small:

       q      the stem — the thing being asked
       o      the options, in the order they should appear
       a      the index into `o` that is correct
       x      the one-line reason it is correct. Never optional.
       steps  the worked solution, line by line, for anything with working
       tag    the sub-topic, so a chapter can be filtered inside itself
       lvl    core | intermediate | advanced | hardcore, matching lesson
              levels. `hardcore` is the one that is not simply "harder":
              it marks a question whose wrong options are all plausible,
              so it is filed into the cross-bank gauntlet as well as into
              its own chapter.

     `a` is validated at registration rather than at render time. A bank of
     four hundred questions typed by hand will contain an out-of-range
     answer index sooner or later, and finding it when the page boots is
     considerably cheaper than finding it when a reader reaches question 287.
     A bad question is dropped into TD.quizBad instead of being rendered, so
     one typo costs one question rather than a whole chapter.
     ================================================================== */

  TD.quizzes = [];
  TD.quizByKey = Object.create(null);
  TD.quizBad = [];

  /* ---- option order --------------------------------------------------
     Anyone hand-writing four hundred questions drifts: the correct option
     ends up in the same slot far more often than chance, and a test-taker
     who notices can score well without reading anything. Rather than ask
     an author to balance a key by hand — which they will not do, and which
     silently rots as questions are edited — the options are permuted here.

     The permutation is seeded from the question text, so it is stable:
     the same question always renders in the same order, across reloads and
     across machines. That matters because a reader who returns to a
     chapter should find it as they left it, and because a shuffle that
     moves on every render makes a bank feel untrustworthy.

     Two escape hatches, both needed by real questions:
       fix: true   keep the authored order — for options that are a genuine
                   sequence, such as ordered magnitudes or ranked lists.
     and no explanation may name an option by letter, because after this
     runs the letters are no longer the author's to predict. */

  function seedOf(s) {
    var h = 2166136261;
    for (var i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = (h * 16777619) >>> 0;
    }
    return h || 1;
  }

  /* xorshift32. A multiply-based LCG is the obvious choice here and is the
     wrong one: `s * 1103515245` exceeds 2^53, so JavaScript's doubles drop
     the low bits — exactly the bits a shuffle reads — and the "random"
     order comes out visibly skewed. Shifts and xors stay inside int32 and
     are exact. */
  function nextRand(s) {
    s ^= s << 13; s >>>= 0;
    s ^= s >>> 17;
    s ^= s << 5; s >>>= 0;
    return s || 1;
  }

  function permute(opts, ans, seed) {
    var idx = opts.map(function (_, i) { return i; });
    var s = seed;
    for (var i = idx.length - 1; i > 0; i--) {
      s = nextRand(s);
      var j = s % (i + 1);
      var t = idx[i]; idx[i] = idx[j]; idx[j] = t;
    }
    return {
      o: idx.map(function (i) { return opts[i]; }),
      a: idx.indexOf(ans)
    };
  }

  TD.addMCQ = function (trackId, modId, items) {
    (items || []).forEach(function (e) {
      var opts = e.o || [];
      var ans = e.a;
      var key = trackId + "/" + modId + "/" + (TD.quizzes.length + 1);

      if (!e.fix && opts.length > 1 && typeof ans === "number" &&
        ans >= 0 && ans < opts.length) {
        var p = permute(opts, ans, seedOf(e.q || key));
        opts = p.o;
        ans = p.a;
      }

      var Q = {
        key: key,
        track: trackId,
        m: modId,
        q: e.q || "",
        o: opts,
        a: ans,
        x: e.x || "",
        steps: e.steps || [],
        tag: e.tag || "",
        lvl: e.lvl || "core",
        note: e.note || ""
      };
      if (!Q.q || opts.length < 2 || typeof e.a !== "number" ||
        e.a < 0 || e.a >= opts.length) {
        TD.quizBad.push(Q);
        return;
      }
      TD.quizzes.push(Q);
      TD.quizByKey[key] = Q;
    });
  };

  /* Every question in one chapter, in the order it was written. */
  TD.mcqIn = function (trackId, modId) {
    return TD.quizzes.filter(function (Q) {
      return Q.track === trackId && Q.m === modId;
    });
  };

  TD.mcqTrack = function (trackId) {
    return TD.quizzes.filter(function (Q) { return Q.track === trackId; });
  };

  /* ---- the hardcore set ----------------------------------------------
     Every question marked `hardcore`, across every bank, in the order it
     was written. These are the questions built around the plausible wrong
     answer rather than around a harder fact, and they are worth reaching
     directly: a reader who has finished a chapter wants the traps in one
     sitting, not scattered four to a chapter.

     It is derived rather than curated, so writing a hardcore question in
     any chapter of any bank puts it in the gauntlet with no second edit. */

  TD.mcqHard = function (trackId) {
    return TD.quizzes.filter(function (Q) {
      return Q.lvl === "hardcore" && (!trackId || Q.track === trackId);
    });
  };

  /* The hardcore set grouped by bank, for the gauntlet index. */
  TD.mcqHardTracks = function () {
    return TD.tracks.map(function (t) {
      return { track: t, qs: TD.mcqHard(t.id) };
    }).filter(function (g) { return g.qs.length > 0; });
  };

  /* The tracks that actually have a bank, in track order. This is what the
     quiz index renders, so adding a bank for a third track needs no edit
     anywhere in the view layer. */
  TD.quizTracks = function () {
    return TD.tracks.filter(function (t) { return TD.mcqTrack(t.id).length > 0; });
  };

  /* The chapters of a bank: the track's own modules, each with its count,
     skipping any module nobody has written questions for. */
  TD.quizChapters = function (trackId) {
    var tr = TD.trackById[trackId];
    if (!tr) return [];
    var out = [];
    (tr.modules || []).forEach(function (m) {
      var qs = TD.mcqIn(trackId, m.id);
      if (qs.length) {
        out.push({
          id: m.id, n: m.n, name: m.name, desc: m.desc,
          count: qs.length, qs: qs
        });
      }
    });
    return out;
  };

  /* The distinct sub-topics inside one chapter, in first-seen order, each
     with a count. Drives the filter chips at the top of a chapter. */
  TD.mcqTags = function (trackId, modId) {
    var seen = Object.create(null);
    var out = [];
    TD.mcqIn(trackId, modId).forEach(function (Q) {
      if (!Q.tag) return;
      if (seen[Q.tag] == null) { seen[Q.tag] = out.length; out.push({ t: Q.tag, n: 0 }); }
      out[seen[Q.tag]].n++;
    });
    return out;
  };

  /* ---- scores -------------------------------------------------------
     Per chapter, and deliberately thin: best, last, attempts. Storing every
     answer of every attempt would grow without bound and buy nothing a
     reader ever looks at. */

  TD.quizScore = {
    all: TD.store.get("learn:quiz", {}),

    get: function (trackId, modId) {
      return TD.quizScore.all[trackId + "/" + modId] || null;
    },

    save: function (trackId, modId, right, total) {
      var k = trackId + "/" + modId;
      var rec = TD.quizScore.all[k] || { best: 0, tries: 0 };
      var pct = total ? Math.round((right / total) * 100) : 0;
      rec.last = pct;
      rec.right = right;
      rec.total = total;
      rec.best = Math.max(rec.best || 0, pct);
      rec.tries = (rec.tries || 0) + 1;
      rec.when = Date.now();
      TD.quizScore.all[k] = rec;
      TD.store.set("learn:quiz", TD.quizScore.all);
      TD.progress.touchStreak();
      return rec;
    },

    /* Whole-track roll-up for the index card. */
    track: function (trackId) {
      var chaps = TD.quizChapters(trackId);
      var done = 0, sum = 0, qs = 0;
      chaps.forEach(function (c) {
        qs += c.count;
        var rec = TD.quizScore.get(trackId, c.id);
        if (rec) { done++; sum += rec.best; }
      });
      return {
        chapters: chaps.length,
        attempted: done,
        questions: qs,
        avg: done ? Math.round(sum / done) : 0
      };
    }
  };

  /* Questions the reader got wrong last time, across every chapter of a
     track. Recorded by the quiz engine as it is marked, capped so a heavy
     user cannot grow storage without bound. This is what the "practise your
     mistakes" set is built from — the highest-value revision there is. */

  var MISS_CAP = 400;

  TD.quizMissed = {
    keys: TD.store.get("learn:quiz:miss", []),

    has: function (key) { return TD.quizMissed.keys.indexOf(key) >= 0; },

    add: function (key) {
      if (TD.quizMissed.has(key)) return;
      TD.quizMissed.keys.push(key);
      if (TD.quizMissed.keys.length > MISS_CAP) {
        TD.quizMissed.keys = TD.quizMissed.keys.slice(-MISS_CAP);
      }
      TD.store.set("learn:quiz:miss", TD.quizMissed.keys);
    },

    clear: function (key) {
      var i = TD.quizMissed.keys.indexOf(key);
      if (i < 0) return;
      TD.quizMissed.keys.splice(i, 1);
      TD.store.set("learn:quiz:miss", TD.quizMissed.keys);
    },

    /* The live question objects, newest miss first, for one track or all. */
    list: function (trackId) {
      var out = [];
      for (var i = TD.quizMissed.keys.length - 1; i >= 0; i--) {
        var Q = TD.quizByKey[TD.quizMissed.keys[i]];
        if (Q && (!trackId || Q.track === trackId)) out.push(Q);
      }
      return out;
    }
  };


  /* ==================================================================
     Speaking sessions

     The only content type that needs a microphone. A session is a themed
     set of activities; an activity is one thing to say out loud plus how
     it should be judged.

     Activities are typed, because "read this sentence" and "answer this
     question for sixty seconds" are scored by completely different rules:

       read     a target script is given; scored word-for-word on accuracy
       repeat   short drill lines — minimal pairs, stress patterns, one
                phrase-bank sentence — scored strictly on accuracy
       shadow   the browser speaks a model line first, then you repeat it
       prompt   an open question; scored on coverage of the points it
                expects, on length, on pace and on filler density

     Everything needed to score a session travels with the session, so the
     engine in speech.js holds no content and the content holds no scoring
     code. That split is what lets a new session be written as pure data.
     ================================================================== */

  TD.speakSessions = [];
  TD.speakBySlug = Object.create(null);

  TD.addSpeakSessions = function (list) {
    (list || []).forEach(function (e) {
      var slug = e.id || TD.slugify(e.t);
      var S = {
        slug: slug,
        t: e.t,
        m: e.m || "",
        track: e.track || "english",
        s: e.s || "",
        lvl: e.lvl || "core",
        icon: e.icon || "mic",
        goal: e.goal || [],
        why: e.why || "",
        coach: e.coach || [],
        acts: (e.acts || []).map(function (a, i) {
          return {
            i: i,
            kind: a.kind || "read",
            t: a.t || "",
            brief: a.brief || "",
            text: a.text || "",
            secs: a.secs || 0,
            expect: a.expect || [],
            avoid: a.avoid || [],
            tip: a.tip || ""
          };
        })
      };
      S.mins = e.mins || Math.max(3, Math.round(S.acts.length * 2.2));
      TD.speakSessions.push(S);
      TD.speakBySlug[slug] = S;
    });
  };

  /* Sessions grouped by the English module they belong to, so the index
     reads in the same order as the syllabus. */
  TD.speakIn = function (modId) {
    return TD.speakSessions.filter(function (S) { return S.m === modId; });
  };

  TD.speakGroups = function () {
    var tr = TD.trackById.english;
    if (!tr) return [{ id: "", name: "Speaking sessions", desc: "", list: TD.speakSessions }];
    var out = [];
    (tr.modules || []).forEach(function (m) {
      var list = TD.speakIn(m.id);
      if (list.length) out.push({ id: m.id, n: m.n, name: m.name, desc: m.desc, list: list });
    });
    var placed = out.reduce(function (n, g) { return n + g.list.length; }, 0);
    if (placed < TD.speakSessions.length) {
      out.push({
        id: "", name: "Everything else", desc: "",
        list: TD.speakSessions.filter(function (S) { return !tr.modIndex[S.m]; })
      });
    }
    return out;
  };

  /* ---- results ------------------------------------------------------
     Best overall score and how many times a session was run. The transcript
     is never stored. It is voice data; keeping it in localStorage would be
     both useless and rude. */

  TD.speakScore = {
    all: TD.store.get("learn:speak", {}),

    get: function (slug) { return TD.speakScore.all[slug] || null; },

    save: function (slug, score) {
      var rec = TD.speakScore.all[slug] || { best: 0, tries: 0 };
      rec.last = score;
      rec.best = Math.max(rec.best || 0, score);
      rec.tries = (rec.tries || 0) + 1;
      rec.when = Date.now();
      TD.speakScore.all[slug] = rec;
      TD.store.set("learn:speak", TD.speakScore.all);
      TD.progress.touchStreak();
      return rec;
    },

    summary: function () {
      var n = 0, sum = 0;
      TD.speakSessions.forEach(function (S) {
        var r = TD.speakScore.get(S.slug);
        if (r) { n++; sum += r.best; }
      });
      return {
        total: TD.speakSessions.length,
        done: n,
        avg: n ? Math.round(sum / n) : 0
      };
    }
  };

  /* ================= code dojo bank =================
     Coding problems the reader practises by typing the solution out. Unlike
     the quiz banks these carry executable reference code: `solution` is what
     the blueprint traces, and `tests` are assertions that were run against it
     before the data file was written. Registration order is the curriculum
     order, easiest first, so the index reads as a syllabus. */

  TD.katas = [];
  TD.kataById = Object.create(null);

  var DIFF_LVL = { Easy: "core", Medium: "advanced", Hard: "hardcore" };

  TD.addKata = function (items) {
    (items || []).forEach(function (e) {
      if (!e.id || !e.solution || TD.kataById[e.id]) return;
      var K = {
        id: e.id,
        title: e.title || e.id,
        diff: e.diff || "Medium",
        lvl: DIFF_LVL[e.diff] || "advanced",
        pattern: e.pattern || "Misc",
        companies: e.companies || [],
        freq: e.freq || 3,
        statement: e.statement || "",
        examples: e.examples || [],
        constraints: e.constraints || [],
        context: e.context || "",
        hints: e.hints || [],
        approach: e.approach || "",
        time: e.time || "",
        space: e.space || "",
        solution: e.solution,
        tests: e.tests || [],
        harness: e.harness || "",
        i: TD.katas.length
      };
      TD.katas.push(K);
      TD.kataById[K.id] = K;
    });
  };

  /* Patterns in curriculum order, each with its problems. */
  TD.kataPatterns = function () {
    var order = [], byName = Object.create(null);
    TD.katas.forEach(function (K) {
      if (!byName[K.pattern]) { byName[K.pattern] = []; order.push(K.pattern); }
      byName[K.pattern].push(K);
    });
    return order.map(function (name) {
      return { name: name, list: byName[name] };
    });
  };

  /* Companies, most-asked first — the filter is only useful in that order. */
  TD.kataCompanies = function () {
    var count = Object.create(null);
    TD.katas.forEach(function (K) {
      K.companies.forEach(function (c) { count[c] = (count[c] || 0) + 1; });
    });
    return Object.keys(count).sort(function (a, b) {
      return count[b] - count[a] || a.localeCompare(b);
    }).map(function (name) { return { name: name, n: count[name] }; });
  };

  /* Per-problem practice record. Kept in one object rather than a key each,
     because the index reads every record on every render. */

  TD.kataScore = {
    all: TD.store.get("dojo", {}),

    get: function (id) { return TD.kataScore.all[id] || null; },

    rec: function (id) {
      if (!TD.kataScore.all[id]) {
        TD.kataScore.all[id] = { status: "", flag: false, notes: "", hints: 0, best: null, seconds: 0 };
      }
      return TD.kataScore.all[id];
    },

    save: function () { TD.store.set("dojo", TD.kataScore.all); },

    status: function (id) {
      var r = TD.kataScore.all[id];
      return r && r.status ? r.status : "";
    },

    solve: function (id, seconds) {
      var r = TD.kataScore.rec(id);
      var first = r.status !== "solved";
      r.status = "solved";
      if (r.best === null || (seconds && seconds < r.best)) r.best = seconds;
      TD.kataScore.save();
      if (first) TD.progress.touchStreak();
      return first;
    },

    summary: function () {
      var solved = 0, attempted = 0, flagged = 0, seconds = 0;
      TD.katas.forEach(function (K) {
        var r = TD.kataScore.all[K.id];
        if (!r) return;
        if (r.status === "solved") solved++;
        else if (r.status) attempted++;
        if (r.flag) flagged++;
        seconds += r.seconds || 0;
      });
      return {
        total: TD.katas.length,
        solved: solved,
        attempted: attempted,
        flagged: flagged,
        minutes: Math.round(seconds / 60)
      };
    }
  };


  /* ================= Logic Vault =================
     The things an engineer is expected to recall rather than look up.

     A card is one recallable unit: a name, the one-line statement worth
     memorising, why it is true, when it applies, and the trap that catches
     people who half-remember it. Cards live in decks, decks in shelves —
     shelf is the broad area ("Complexity", "AI engineer"), deck is the
     specific set within it.

     `recall` is the field that matters most: it is what you should be able
     to say out loud, unprompted, and it is what the self-test hides first.
     Everything else exists to make that one line stick. */

  TD.logicShelves = [];
  TD.logicShelfById = Object.create(null);
  TD.logicDecks = [];
  TD.logicDeckById = Object.create(null);
  TD.logicCards = [];
  TD.logicCardById = Object.create(null);

  TD.defineLogicShelves = function (list) {
    (list || []).forEach(function (e) {
      if (!e.id || TD.logicShelfById[e.id]) return;
      var S = {
        id: e.id,
        name: e.name || e.id,
        icon: e.icon || "brain",
        col: e.col || "#6366f1",
        deck: e.deck || "",
        desc: e.desc || "",
        decks: [],
        cards: 0,
        i: TD.logicShelves.length
      };
      TD.logicShelves.push(S);
      TD.logicShelfById[S.id] = S;
    });
  };

  /* A deck registers itself against a shelf. Registration order is reading
     order, so a data file is also the syllabus for its shelf. */
  TD.addLogicDeck = function (shelfId, e) {
    if (!e || !e.id || TD.logicDeckById[e.id]) return;
    var shelf = TD.logicShelfById[shelfId];
    var D = {
      id: e.id,
      shelf: shelfId,
      name: e.name || e.id,
      why: e.why || "",
      lvl: e.lvl || "core",
      cards: [],
      i: TD.logicDecks.length
    };
    TD.logicDecks.push(D);
    TD.logicDeckById[D.id] = D;
    if (shelf) shelf.decks.push(D);

    (e.cards || []).forEach(function (c, n) {
      if (!c || !c.t) return;
      var id = D.id + "-" + (n + 1);
      var C = {
        id: id,
        deck: D.id,
        shelf: shelfId,
        t: c.t,
        recall: c.recall || "",
        why: c.why || "",
        use: c.use || [],
        trap: c.trap || "",
        code: c.code || null,
        num: c.num || null,
        r: c.r || [],
        i: TD.logicCards.length
      };
      TD.logicCards.push(C);
      TD.logicCardById[id] = C;
      D.cards.push(C);
      if (shelf) shelf.cards++;
    });
  };

  /* Self-assessment, three states like the interview bank: a checkbox would
     record "I have read this", and the only fact worth storing is whether
     you could produce the line from memory. */

  TD.logicScore = {
    all: TD.store.get("logic", {}),

    get: function (id) { return TD.logicScore.all[id] || ""; },

    set: function (id, mark) {
      if (!mark || TD.logicScore.all[id] === mark) delete TD.logicScore.all[id];
      else TD.logicScore.all[id] = mark;
      TD.store.set("logic", TD.logicScore.all);
      return TD.logicScore.all[id] || "";
    },

    summary: function (cards) {
      var list = cards || TD.logicCards;
      var known = 0, shaky = 0;
      list.forEach(function (C) {
        var m = TD.logicScore.all[C.id];
        if (m === "known") known++;
        else if (m === "shaky") shaky++;
      });
      return { total: list.length, known: known, shaky: shaky, untouched: list.length - known - shaky };
    }
  };



  /* ================= Speed Coding =================
     Warm-up sets for the speed section. These are independent of lesson
     progress -- the drill-derived decks only exist once a reader has cleared
     lessons, which would leave the section empty on day one.

     `rung` is the ladder position, and it is the one field that carries
     meaning beyond presentation:

       1  fragments   keywords and punctuation, typed until automatic
       2  lines       one complete statement
       3  blocks      several lines, indentation included

     Cards reuse the drill card shape ({ c, w, hint }) exactly, so the
     existing engine runs them with no translation. */

  TD.speedSets = [];
  TD.speedSetById = Object.create(null);

  TD.addSpeedSets = function (list) {
    (list || []).forEach(function (e) {
      if (!e.id || TD.speedSetById[e.id]) return;
      var S = {
        id: e.id,
        rung: e.rung || 1,
        name: e.name || e.id,
        lvl: e.lvl || "core",
        time: e.time || "",
        why: e.why || "",
        lang: e.lang || "python",
        cards: (e.cards || []).map(function (c, n) {
          return {
            id: "speed/" + e.id + "#" + n,
            c: c.c,
            w: c.w || "",
            hint: c.hint || "",
            /* the teaching beat, shown after the card is cleared */
            why: c.why || "",
            lang: c.lang || e.lang || "python"
          };
        }),
        i: TD.speedSets.length
      };
      TD.speedSets.push(S);
      TD.speedSetById[S.id] = S;
    });
  };

  /* The ladder, grouped. Rungs are returned in order with their sets, so the
     index reads as a progression rather than a list of decks. */
  TD.speedRungs = function () {
    var RUNGS = [
      { n: 1, name: "Fragments", blurb: "Keywords and punctuation, until the shape is automatic." },
      { n: 2, name: "Lines", blurb: "One complete statement, typed against the clock." },
      { n: 3, name: "Blocks", blurb: "Several lines, indentation included." }
    ];
    return RUNGS.map(function (r) {
      r.sets = TD.speedSets.filter(function (S) { return S.rung === r.n; });
      return r;
    }).filter(function (r) { return r.sets.length; });
  };



  /* ================= Journeys =================
     A journey is the answer to "I want to be hired as X — what do I do, in
     what order, starting today?"

     The app already has tracks (what to learn), stages (the rough order) and
     sections (how to practise). What it did not have was anything tying those
     to a *role* and a *calendar*. A beginner facing fourteen sidebar entries
     and twenty-four tracks has no way to know that an AI engineer needs
     Python before NumPy before PyTorch, and that the Dojo should start in
     week five rather than week one.

     A journey is a list of phases. A phase names weeks, the tracks to read,
     and the practice to do alongside them — because reading without practice
     is the failure mode this whole platform exists to prevent.

     Progress is derived, never stored: a phase is complete when its lessons
     are marked done in TD.progress. That means a journey can be added,
     reordered or rewritten at any time without invalidating anyone's history. */

  TD.journeys = [];
  TD.journeyById = Object.create(null);

  TD.defineJourneys = function (list) {
    (list || []).forEach(function (e) {
      if (!e.id || TD.journeyById[e.id]) return;

      var J = {
        id: e.id,
        name: e.name || e.id,
        short: e.short || e.name || e.id,
        icon: e.icon || "compass",
        col: e.col || "#6366f1",
        deck: e.deck || "",
        desc: e.desc || "",
        /* what the market actually asks for -- kept honest and specific,
           because a journey that oversells is worse than none */
        market: e.market || "",
        weeks: 0,
        phases: []
      };

      (e.phases || []).forEach(function (p, i) {
        var ph = {
          n: i + 1,
          id: p.id || ("phase-" + (i + 1)),
          name: p.name || "",
          weeks: p.weeks || "",
          weekCount: p.weekCount || 0,
          goal: p.goal || "",
          /* track ids, resolved lazily so a journey may reference a track
             that has not been written yet without breaking the page */
          tracks: p.tracks || [],
          /* practice is what makes it stick: section routes with a reason */
          practice: p.practice || [],
          /* the honest checkpoint -- what you should be able to DO */
          proof: p.proof || ""
        };
        J.weeks += ph.weekCount;
        J.phases.push(ph);
      });

      TD.journeys.push(J);
      TD.journeyById[J.id] = J;
    });
  };

  /* Resolve a phase's declared track ids to real tracks, dropping any that do
     not exist yet. Returned live rather than cached, because lesson files load
     after the journey definition and counts would otherwise all be zero. */
  TD.journeyTracks = function (phase) {
    return (phase.tracks || []).map(function (id) {
      return TD.trackById[id];
    }).filter(Boolean);
  };

  /* Completion for one phase, derived from lesson progress. */
  TD.phaseProgress = function (phase) {
    var total = 0, done = 0;
    TD.journeyTracks(phase).forEach(function (t) {
      total += t.count;
      done += TD.progress.inTrack(t.id);
    });
    return { done: done, total: total, pct: total ? Math.round(done / total * 100) : 0 };
  };

  TD.journeyProgress = function (J) {
    var total = 0, done = 0;
    (J.phases || []).forEach(function (p) {
      var pr = TD.phaseProgress(p);
      total += pr.total;
      done += pr.done;
    });
    return { done: done, total: total, pct: total ? Math.round(done / total * 100) : 0 };
  };

  /* The single most useful thing the app can say: what should I do next?
     Walks the phases in order and returns the first unfinished lesson, with
     enough context to render a call to action. */
  TD.journeyNext = function (J) {
    for (var i = 0; i < J.phases.length; i++) {
      var phase = J.phases[i];
      var tracks = TD.journeyTracks(phase);
      for (var k = 0; k < tracks.length; k++) {
        var lesson = TD.progress.next(tracks[k].id);
        if (lesson) return { phase: phase, track: tracks[k], lesson: lesson };
      }
    }
    return null;
  };

  /* The chosen journey, if any. Stored rather than derived because it is a
     declaration of intent, not an observation. */
  TD.journeyChoice = {
    get: function () { return TD.store.get("journey", ""); },
    set: function (id) {
      TD.store.set("journey", id || "");
      return id || "";
    },
    current: function () {
      var id = TD.journeyChoice.get();
      return id ? TD.journeyById[id] || null : null;
    }
  };


})(window.TD);
