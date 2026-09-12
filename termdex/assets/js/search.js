/* NodeCraft search — small, dependency-free, ranked.
   Exact > prefix > word-prefix > substring > tag > definition > fuzzy subsequence. */
(function (TD) {
  "use strict";

  var index = null;

  function build() {
    index = TD.terms.map(function (t) {
      var name = t.t.toLowerCase();
      return {
        ref: t,
        name: name,
        words: name.split(/[^a-z0-9+#]+/).filter(Boolean),
        abbr: (t.a || "").toLowerCase(),
        tags: (t.g || []).map(function (g) { return g.toLowerCase(); }),
        def: (t.d || "").toLowerCase(),
        /* full text: key points and body, so "which term explains X" works */
        text: ((t.k || []).join(" ") + " " + (t.b || []).join(" ")).toLowerCase(),
        cat: t.c
      };
    });
  }

  /* is `q` a subsequence of `s`?  returns a compactness score or -1 */
  function subseq(q, s) {
    var qi = 0, si = 0, first = -1, last = -1;
    while (qi < q.length && si < s.length) {
      if (q.charCodeAt(qi) === s.charCodeAt(si)) {
        if (first < 0) first = si;
        last = si;
        qi++;
      }
      si++;
    }
    if (qi < q.length) return -1;
    var span = last - first + 1;
    return Math.max(0, 40 - (span - q.length) * 2 - first);
  }

  function scoreOne(rec, q) {
    var s = 0, i;

    if (rec.name === q) return 1200;
    if (rec.abbr && rec.abbr === q) return 1000;

    if (rec.name.indexOf(q) === 0) s = Math.max(s, 700 - rec.name.length);
    else {
      for (i = 0; i < rec.words.length; i++) {
        if (rec.words[i].indexOf(q) === 0) { s = Math.max(s, 480 - i * 12 - rec.name.length); break; }
      }
      if (!s && rec.name.indexOf(q) > 0) s = Math.max(s, 300 - rec.name.length);
    }

    if (rec.abbr && rec.abbr.indexOf(q) >= 0) s = Math.max(s, 340);

    for (i = 0; i < rec.tags.length; i++) {
      if (rec.tags[i] === q) { s = Math.max(s, 260); break; }
      if (rec.tags[i].indexOf(q) >= 0) s = Math.max(s, 170);
    }

    if (!s || s < 120) {
      var d = rec.def.indexOf(q);
      if (d >= 0) s = Math.max(s, 110 - Math.min(d, 60) / 2);
    }

    /* body and key-point text: lowest weight, but makes concept search work */
    if (!s && q.length >= 3 && rec.text.indexOf(q) >= 0) s = 55;

    if (!s && q.length >= 3) {
      var f = subseq(q, rec.name);
      if (f >= 0) s = f;
    }
    return s;
  }

  /* main entry: returns [{term, score}] */
  TD.search = function (query, opts) {
    if (!index) build();
    opts = opts || {};
    var q = String(query || "").toLowerCase().trim();
    if (!q) return [];
    var tokens = q.split(/\s+/).filter(Boolean);
    var limit = opts.limit || 40;
    var cat = opts.cat || null;
    var out = [];

    for (var i = 0; i < index.length; i++) {
      var rec = index[i];
      if (cat && rec.cat !== cat) continue;
      var total = 0, ok = true;
      for (var j = 0; j < tokens.length; j++) {
        var sc = scoreOne(rec, tokens[j]);
        if (!sc) { ok = false; break; }
        total += sc;
      }
      if (!ok) continue;
      /* whole-phrase bonus */
      if (tokens.length > 1 && rec.name.indexOf(q) >= 0) total += 400;
      out.push({ term: rec.ref, score: total });
    }

    out.sort(function (a, b) {
      if (b.score !== a.score) return b.score - a.score;
      if (a.term.t.length !== b.term.t.length) return a.term.t.length - b.term.t.length;
      return a.term.t.localeCompare(b.term.t);
    });
    return out.slice(0, limit);
  };

  /* highlight every query token inside a plain string */
  TD.highlight = function (text, query) {
    var esc = TD.esc(text);
    var tokens = String(query || "").toLowerCase().trim().split(/\s+/).filter(Boolean);
    if (!tokens.length) return esc;
    tokens.sort(function (a, b) { return b.length - a.length; });
    var pattern = tokens.map(function (t) {
      return t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }).join("|");
    try {
      return esc.replace(new RegExp("(" + pattern + ")", "gi"), "<mark>$1</mark>");
    } catch (e) { return esc; }
  };

  /* ---- case studies ----
     A separate, much smaller index. Studies are ranked independently of terms
     so the palette can show them as their own group rather than interleaving
     two different kinds of result. */
  var sIndex = null;

  function buildStudies() {
    sIndex = (TD.studies || []).map(function (st) {
      return {
        ref: st,
        name: st.t.toLowerCase(),
        deck: (st.s || "").toLowerCase(),
        tags: (st.g || []).map(function (g) { return g.toLowerCase(); }),
        text: ((st.tldr || "") + " " + (st.say || []).join(" ")).toLowerCase()
      };
    });
  }

  TD.searchStudies = function (query, limit) {
    if (!sIndex) buildStudies();
    var q = String(query || "").toLowerCase().trim();
    if (!q) return [];
    var out = [];
    for (var i = 0; i < sIndex.length; i++) {
      var rec = sIndex[i], s = 0, j;
      if (rec.name === q) s = 1200;
      else if (rec.name.indexOf(q) === 0) s = 700 - rec.name.length;
      else if (rec.name.indexOf(q) > 0) s = 400 - rec.name.length;
      if (!s && rec.deck.indexOf(q) >= 0) s = 240;
      if (!s) {
        for (j = 0; j < rec.tags.length; j++) {
          if (rec.tags[j].indexOf(q) >= 0) { s = 200; break; }
        }
      }
      if (!s && q.length >= 3 && rec.text.indexOf(q) >= 0) s = 90;
      if (s) out.push({ study: rec.ref, score: s });
    }
    out.sort(function (a, b) { return b.score - a.score; });
    return out.slice(0, limit || 3);
  };

  /* ---- lessons ----
     A third small index, ranked on its own so the palette can group results
     by kind rather than interleaving a lesson, a term and a study by score
     alone. A lesson also matches on its track name, so typing "python
     loops" finds the loops lesson inside the Python track. */
  var lIndex = null;

  function buildLessons() {
    lIndex = (TD.lessons || []).map(function (L) {
      var tr = TD.trackById[L.track] || {};
      return {
        ref: L,
        name: L.t.toLowerCase(),
        deck: (L.s || "").toLowerCase(),
        trackName: (tr.short || "").toLowerCase(),
        /* goals and key points make "how do I read a csv" land somewhere */
        text: ((L.goal || []).join(" ") + " " + (L.k || []).join(" ")).toLowerCase()
      };
    });
  }

  TD.searchLessons = function (query, limit) {
    if (!lIndex) buildLessons();
    var q = String(query || "").toLowerCase().trim();
    if (!q) return [];
    var tokens = q.split(/\s+/).filter(Boolean);
    var out = [];

    for (var i = 0; i < lIndex.length; i++) {
      var rec = lIndex[i], total = 0, ok = true;

      for (var t = 0; t < tokens.length; t++) {
        var tok = tokens[t], s = 0;
        if (rec.name === tok) s = 1200;
        else if (rec.name.indexOf(tok) === 0) s = 640 - rec.name.length;
        else if (rec.name.indexOf(tok) > 0) s = 380 - rec.name.length;
        if (!s && rec.trackName.indexOf(tok) >= 0) s = 300;
        if (!s && rec.deck.indexOf(tok) >= 0) s = 210;
        if (!s && tok.length >= 3 && rec.text.indexOf(tok) >= 0) s = 80;
        if (!s) { ok = false; break; }
        total += s;
      }
      if (!ok) continue;
      if (tokens.length > 1 && rec.name.indexOf(q) >= 0) total += 350;
      out.push({ lesson: rec.ref, score: total });
    }

    out.sort(function (a, b) { return b.score - a.score; });
    return out.slice(0, limit || 3);
  };

  /* used by the empty state of the palette */
  TD.suggest = function (n) {
    if (!index) build();
    var picks = [], seen = {};
    var wanted = n || 6;
    var guard = 0;
    while (picks.length < wanted && guard++ < 400) {
      var i = Math.floor(Math.random() * TD.terms.length);
      if (seen[i]) continue;
      seen[i] = 1;
      picks.push(TD.terms[i]);
    }
    return picks;
  };
})(window.TD);
