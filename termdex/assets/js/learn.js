/* NodeCraft Learn — the lesson block renderer.

   A lesson body is an array of typed blocks, dispatched on key exactly the
   way study.js dispatches a case study. The set below is larger because a
   lesson has to do more than narrate: it has to show a line of code, label
   its parts, say why each line exists, show what it prints, and warn about
   the mistake everyone makes.

     { h:   "Heading" }                     section heading (builds the rail)
     { p:   "A paragraph." }                prose, auto-linked to the dictionary
     { l:   ["a bullet", "another"] }       bullet list
     { ol:  ["first", "second"] }           numbered list
     { syn: { c, parts:[{p,w}] } }          syntax anatomy — label parts of a line
     { code:{ lang, file, t, lines:[{c,w}], out } }  annotated code, a why per line
     { term:{ t, lines:[{c,w,out}] } }      a terminal session
     { out:  "printed text", ot: "label" }  a standalone output box
     { vs:  { bad:{c,w}, good:{c,w} } }     the wrong way beside the right way
     { trap: "text", tt: "title" }          the mistake everyone makes
     { ana:  "text", at: "title" }          an analogy
     { n:    "text", nt: "title" }          a quiet callout
     { q:    "quote", by: "who" }           a quotation
     { tbl: { t, h:[...], rows:[[...]] } }  a comparison table
     { tryit:{ t, task, hint, sol:{lang,code}, w } }  a challenge with a reveal
     { vocab:["Term","Term"] }              chips into the dictionary
     { dg:  "diagram-key" }                 reuses diagrams.js

   Adding a block type is one entry in BLOCKS and one entry in ORDER.
   An unrecognised block renders as nothing rather than throwing, so lesson
   content can be written ahead of the renderer that will display it.
*/
(function (TD) {
  "use strict";

  /* The highlighter lives in app.js, which loads after this file. Resolving
     it at call time rather than at load time keeps the dependency one-way:
     this file never has to exist before the app boots. */
  function hi(code, lang) {
    return TD.hl ? TD.hl(code, String(lang || "").toLowerCase()) : TD.esc(code);
  }

  function prose(text, ctx) {
    return ctx && TD.prose ? TD.prose(text, ctx) : TD.rich(text);
  }

  /* ---- annotated code -------------------------------------------------
     The centrepiece. Every line carries its own reason for existing, laid
     out beside the code on a wide screen and underneath it on a narrow one.
     A line with no `w` spans the full width, which is how blank lines and
     pure punctuation stay quiet instead of demanding an explanation they
     do not need. */

  function codeBlock(b) {
    var c = b.code;
    var lang = c.lang || "code";
    var lines = c.lines || [];
    var plain = lines.map(function (l) { return l.c == null ? "" : l.c; }).join("\n");

    var h = '<figure class="lc" data-lang="' + TD.esc(lang) + '">';

    h += '<div class="lc-bar">' +
      '<span class="lc-dots" aria-hidden="true"><i></i><i></i><i></i></span>' +
      (c.file ? '<span class="lc-file">' + TD.esc(c.file) + "</span>" : "") +
      '<span class="lc-lang">' + TD.esc(lang) + "</span>" +
      '<button class="lc-copy" type="button" data-act="copy-lc" ' +
      'aria-label="Copy this code">' + TD.icon("copy") + "Copy</button>" +
      "</div>";

    if (c.t) h += '<p class="lc-t">' + TD.rich(c.t) + "</p>";

    h += '<ol class="lc-lines">';
    lines.forEach(function (l, i) {
      var body = l.c == null ? "" : String(l.c);
      var blank = body.trim() === "";
      h += '<li class="lc-line' + (blank ? " is-blank" : "") + (l.w ? "" : " is-bare") +
        (l.hi ? " is-hi" : "") + '">' +
        '<span class="lc-n" aria-hidden="true">' + (i + 1) + "</span>" +
        '<code class="lc-c">' + (blank ? "&#8203;" : hi(body, lang)) + "</code>" +
        (l.w ? '<span class="lc-w"><span class="lc-w-arm" aria-hidden="true"></span>' +
          TD.rich(l.w) + "</span>" : "") +
        "</li>";
    });
    h += "</ol>";

    /* the plain source, for the copy button and for anyone selecting text */
    h += '<pre class="lc-raw" hidden>' + TD.esc(plain) + "</pre>";

    if (c.out != null) {
      h += '<div class="lc-out"><span class="lc-out-k">' + TD.icon("terminal") +
        TD.esc(c.ot || "What it prints") + "</span><pre>" + TD.esc(c.out) + "</pre></div>";
    }
    if (c.after) h += '<p class="lc-after">' + TD.rich(c.after) + "</p>";

    return h + "</figure>";
  }

  /* ---- syntax anatomy -------------------------------------------------
     One line, broken into named parts. Segments carrying a `w` are numbered
     and explained; segments without one are the glue between them. Joining
     every `p` reproduces the line exactly, so the anatomy can never drift
     out of step with the code it claims to describe. */

  function synBlock(b) {
    var s = b.syn;
    var parts = s.parts || [];
    var n = 0;
    var line = parts.map(function (p) {
      var txt = TD.esc(p.p);
      if (!p.w) return '<span class="syn-glue">' + txt + "</span>";
      n++;
      return '<span class="syn-part" data-n="' + n + '">' +
        '<span class="syn-mark" aria-hidden="true">' + n + "</span>" + txt + "</span>";
    }).join("");

    var m = 0;
    var legend = parts.filter(function (p) { return !!p.w; }).map(function (p) {
      m++;
      return '<li class="syn-item"><span class="syn-item-n" aria-hidden="true">' + m + "</span>" +
        '<span class="syn-item-b"><code class="syn-item-k">' + TD.esc(p.p.trim() || p.p) + "</code>" +
        '<span class="syn-item-w">' + TD.rich(p.w) + "</span></span></li>";
    }).join("");

    return '<figure class="syn">' +
      (s.t ? '<figcaption class="syn-cap">' + TD.rich(s.t) + "</figcaption>" : "") +
      '<div class="syn-line"><code>' + line + "</code></div>" +
      '<ol class="syn-legend">' + legend + "</ol>" +
      (s.after ? '<p class="syn-after">' + TD.rich(s.after) + "</p>" : "") +
      "</figure>";
  }

  /* ---- terminal session ---- */

  function termBlock(b) {
    var t = b.term;
    var h = '<figure class="tm">' +
      '<div class="tm-bar"><span class="tm-dots" aria-hidden="true"><i></i><i></i><i></i></span>' +
      '<span class="tm-title">' + TD.esc(t.title || "Terminal") + "</span></div>";
    if (t.t) h += '<p class="tm-t">' + TD.rich(t.t) + "</p>";
    h += '<div class="tm-body">';
    (t.lines || []).forEach(function (l) {
      if (l.c != null) {
        h += '<div class="tm-cmd"><span class="tm-p" aria-hidden="true">$</span>' +
          "<code>" + TD.esc(l.c) + "</code></div>";
      }
      if (l.w) h += '<p class="tm-w">' + TD.rich(l.w) + "</p>";
      if (l.out != null) h += '<pre class="tm-out">' + TD.esc(l.out) + "</pre>";
    });
    return h + "</div></figure>";
  }

  /* ---- wrong beside right ---- */

  function vsBlock(b) {
    var v = b.vs;
    function side(o, kind, fallback) {
      if (!o) return "";
      return '<div class="vs-side is-' + kind + '">' +
        '<p class="vs-k">' + TD.esc(o.label || fallback) + "</p>" +
        '<pre class="vs-code"><code>' + hi(o.c, v.lang || o.lang || "") + "</code></pre>" +
        (o.w ? '<p class="vs-w">' + TD.rich(o.w) + "</p>" : "") + "</div>";
    }
    return '<figure class="vs">' +
      (v.t ? '<figcaption class="vs-cap">' + TD.rich(v.t) + "</figcaption>" : "") +
      '<div class="vs-grid">' + side(v.bad, "bad", "What people write") +
      side(v.good, "good", "What to write instead") + "</div></figure>";
  }

  /* ---- try it yourself ----
     The task is always visible; the hint and the solution sit behind a
     disclosure, because a challenge whose answer is already on screen is
     not a challenge. <details> is used deliberately — it is keyboard
     operable and announced correctly with no script at all. */

  function tryBlock(b) {
    var t = b.tryit;
    var h = '<section class="ty">' +
      '<p class="ty-k">' + TD.icon("spark") + TD.esc(t.t || "Your turn") + "</p>" +
      '<p class="ty-task">' + TD.rich(t.task) + "</p>";
    if (t.hint) {
      h += '<details class="ty-fold"><summary>Nudge me</summary>' +
        '<p class="ty-hint">' + TD.rich(t.hint) + "</p></details>";
    }
    if (t.sol) {
      h += '<details class="ty-fold is-sol"><summary>Show one answer</summary>' +
        '<pre class="ty-sol"><code>' + hi(t.sol.code, t.sol.lang) + "</code></pre>" +
        (t.w ? '<p class="ty-w">' + TD.rich(t.w) + "</p>" : "") + "</details>";
    }
    return h + "</section>";
  }

  /* ---- block table ---- */

  var BLOCKS = {
    h: function (b) {
      return '<h2 class="ln-h" id="h-' + TD.slugify(b.h) + '">' + TD.esc(b.h) + "</h2>";
    },
    p: function (b, ctx) { return '<p class="ln-p">' + prose(b.p, ctx) + "</p>"; },
    l: function (b, ctx) {
      return '<ul class="ln-list">' + b.l.map(function (i) {
        return "<li>" + prose(i, ctx) + "</li>";
      }).join("") + "</ul>";
    },
    ol: function (b, ctx) {
      return '<ol class="ln-olist">' + b.ol.map(function (i) {
        return "<li>" + prose(i, ctx) + "</li>";
      }).join("") + "</ol>";
    },
    syn: synBlock,
    code: codeBlock,
    term: termBlock,
    out: function (b) {
      return '<div class="lc-out is-solo"><span class="lc-out-k">' + TD.icon("terminal") +
        TD.esc(b.ot || "What it prints") + "</span><pre>" + TD.esc(b.out) + "</pre></div>";
    },
    vs: vsBlock,
    trap: function (b, ctx) {
      return '<aside class="ln-trap"><span class="ln-trap-m" aria-hidden="true">!</span><div>' +
        '<p class="ln-trap-t">' + TD.esc(b.tt || "The mistake everyone makes") + "</p>" +
        '<p class="ln-trap-b">' + prose(b.trap, ctx) + "</p></div></aside>";
    },
    ana: function (b, ctx) {
      return '<aside class="ln-ana"><span class="ln-ana-m" aria-hidden="true">' +
        TD.icon("compass") + "</span><div>" +
        '<p class="ln-ana-t">' + TD.esc(b.at || "Think of it like this") + "</p>" +
        '<p class="ln-ana-b">' + prose(b.ana, ctx) + "</p></div></aside>";
    },
    n: function (b, ctx) {
      return '<aside class="cs-note"><span class="cs-note-m" aria-hidden="true">' +
        TD.icon("bulb") + "</span><div>" +
        (b.nt ? '<p class="cs-note-t">' + TD.esc(b.nt) + "</p>" : "") +
        '<p class="cs-note-b">' + prose(b.n, ctx) + "</p></div></aside>";
    },
    q: function (b, ctx) {
      return '<figure class="cs-quote"><blockquote>' + prose(b.q, ctx) + "</blockquote>" +
        (b.by ? "<figcaption>" + TD.esc(b.by) + "</figcaption>" : "") + "</figure>";
    },
    tbl: function (b, ctx) {
      var t = b.tbl;
      return '<figure class="ln-tbl">' +
        (t.t ? "<figcaption>" + TD.rich(t.t) + "</figcaption>" : "") +
        '<div class="ln-tbl-scroll"><table><thead><tr>' +
        (t.h || []).map(function (c) { return "<th>" + TD.rich(c) + "</th>"; }).join("") +
        "</tr></thead><tbody>" +
        (t.rows || []).map(function (row) {
          return "<tr>" + row.map(function (c, i) {
            return (i === 0 ? '<th scope="row">' : "<td>") + prose(c, ctx) + (i === 0 ? "</th>" : "</td>");
          }).join("") + "</tr>";
        }).join("") + "</tbody></table></div></figure>";
    },
    tryit: tryBlock,
    vocab: function (b) {
      var chips = (b.vocab || []).map(function (name) {
        var t = TD.resolve(name);
        if (!t) return "";
        return '<a class="chip" data-cat="' + t.c + '" href="#/t/' + t.slug + '">' +
          '<span class="chip-dot"></span>' + TD.esc(t.t) + "</a>";
      }).filter(Boolean).join("");
      if (!chips) return "";
      return '<div class="ln-vocab"><p class="ln-vocab-k">' + TD.icon("book") +
        "Look these up in the dictionary</p>" +
        '<div class="chips">' + chips + "</div></div>";
    },
    dg: function (b) {
      if (!TD.hasDiagram || !TD.hasDiagram(b.dg)) return "";
      return '<figure class="cs-dg">' + TD.diagram(b.dg) + "</figure>";
    }
  };

  /* Checked in order, so a block object is read by its first recognised
     key. The specific keys come before the generic ones. */
  var ORDER = ["h", "syn", "code", "term", "vs", "tryit", "tbl", "vocab",
    "trap", "ana", "out", "p", "l", "ol", "q", "n", "dg"];

  function renderBlock(b, ctx) {
    for (var i = 0; i < ORDER.length; i++) {
      var key = ORDER[i];
      if (b[key] != null) return BLOCKS[key](b, ctx);
    }
    return "";
  }

  /* Exposed so a single block can be rendered against an existing context.
     TD.linkCtx rebuilds its regex target set over the whole dictionary on
     every call, so anything rendering many blocks should build one context
     and reuse it rather than going through lessonBody per block. */
  TD.renderLessonBlock = renderBlock;

  TD.lessonBody = function (L) {
    var ctx = TD.linkCtx ? TD.linkCtx(L) : null;
    return (L.b || []).map(function (b) { return renderBlock(b, ctx); }).join("");
  };

  TD.lessonOutline = function (L) {
    return (L.b || []).filter(function (b) { return b.h; })
      .map(function (b) { return { id: "h-" + TD.slugify(b.h), t: b.h }; });
  };

  /* The promise at the top of a lesson: what the reader will be able to do
     when they reach the bottom. */
  TD.lessonGoals = function (L) {
    if (!L.goal || !L.goal.length) return "";
    return '<section class="ln-goal">' +
      '<p class="ln-goal-k">' + TD.icon("compass") + "By the end of this lesson you can</p>" +
      "<ul>" + L.goal.map(function (g) {
        return "<li>" + TD.rich(g) + "</li>";
      }).join("") + "</ul></section>";
  };

})(window.TD);
