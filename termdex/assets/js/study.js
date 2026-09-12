/* NodeCraft case studies — block renderer and dictionary auto-linking.

   A study body is an array of typed blocks. Each block is an object with one
   recognised key, and BLOCKS below maps that key to a renderer:

     { h:  "Heading" }
     { p:  "A paragraph." }
     { l:  ["a bullet", "another"] }
     { tl: [ { t: "09:37", d: "what happened" } ] }   timeline
     { q:  "A quotation", by: "who said it" }
     { n:  "Callout body", nt: "Callout title" }
     { x:  { lang: "bash", code: "…" } }
     { dg: "diagram-key" }                            reuses diagrams.js

   Adding a block type later means adding one entry to BLOCKS. Existing
   studies are unaffected, and an unrecognised block renders as nothing
   rather than throwing — so content can safely be written ahead of a
   renderer that does not exist yet.
*/
(function (TD) {
  "use strict";

  /* ---- dictionary auto-linking ----------------------------------------
     Only the terms a study explicitly lists in `r` are linked, and each one
     only on its first appearance. Scanning all 1,211 term names against
     prose would link "Go", "C" and "Cache" everywhere; declaring them per
     study keeps the editorial control with the author and means there are
     no false positives to chase. */

  function linkTargets(study) {
    var out = [];
    (study.r || []).forEach(function (name) {
      var term = TD.resolve(name);
      if (!term) return;
      out.push({ label: name, term: term });
      /* an acronym is often what actually appears in the prose */
      if (term.a && term.a.length > 2 && term.a.toLowerCase() !== name.toLowerCase()) {
        out.push({ label: term.a, term: term });
      }
    });
    /* longest first, so "Machine Learning" wins over "Learning" */
    out.sort(function (a, b) { return b.label.length - a.label.length; });
    return out;
  }

  function escapeRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

  /* Walks the already-escaped rich HTML and links only in text that sits
     outside <code> and <a>, so a term inside a code span stays literal. */
  function autolink(html, targets, seen) {
    if (!targets.length) return html;
    var depth = 0;
    return html.split(/(<[^>]+>)/).map(function (seg) {
      if (seg.charAt(0) === "<") {
        if (/^<(code|a)\b/i.test(seg)) depth++;
        else if (/^<\/(code|a)>/i.test(seg)) depth = Math.max(0, depth - 1);
        return seg;
      }
      if (depth > 0 || !seg) return seg;

      targets.forEach(function (tgt) {
        if (seen[tgt.term.slug]) return;
        var re = new RegExp("(^|[^\\w-])(" + escapeRe(tgt.label) + ")(?![\\w-])", "i");
        if (!re.test(seg)) return;
        seen[tgt.term.slug] = 1;
        seg = seg.replace(re, function (m, pre, hit) {
          return pre + '<a class="tlink" href="#/t/' + tgt.term.slug + '">' + hit + "</a>";
        });
      });
      return seg;
    }).join("");
  }

  /* rich text + auto-links, the standard treatment for study prose */
  function prose(text, ctx) {
    return autolink(TD.rich(text), ctx.targets, ctx.seen);
  }

  /* Shared with the lesson renderer: any content type that declares related
     dictionary terms in `r` gets the identical auto-linking treatment, so
     prose reads the same whether it sits in a study or a lesson. */
  TD.linkCtx = function (item) {
    return { targets: linkTargets(item), seen: Object.create(null) };
  };
  TD.prose = prose;

  /* ---- block renderers ---- */

  var BLOCKS = {
    h: function (b) {
      var id = TD.slugify(b.h);
      return '<h2 class="cs-h" id="h-' + id + '">' + TD.esc(b.h) + "</h2>";
    },

    p: function (b, ctx) {
      return '<p class="cs-p">' + prose(b.p, ctx) + "</p>";
    },

    l: function (b, ctx) {
      return '<ul class="cs-list">' + b.l.map(function (i) {
        return "<li>" + prose(i, ctx) + "</li>";
      }).join("") + "</ul>";
    },

    tl: function (b, ctx) {
      return '<ol class="cs-time">' + b.tl.map(function (i) {
        return '<li class="cs-time-i"><span class="cs-time-t">' + TD.esc(i.t || "") + "</span>" +
          '<span class="cs-time-d">' + prose(i.d || "", ctx) + "</span></li>";
      }).join("") + "</ol>";
    },

    q: function (b, ctx) {
      return '<figure class="cs-quote"><blockquote>' + prose(b.q, ctx) + "</blockquote>" +
        (b.by ? '<figcaption>' + TD.esc(b.by) + "</figcaption>" : "") + "</figure>";
    },

    n: function (b, ctx) {
      return '<aside class="cs-note">' +
        '<span class="cs-note-m" aria-hidden="true">' + TD.icon("bulb") + "</span><div>" +
        (b.nt ? '<p class="cs-note-t">' + TD.esc(b.nt) + "</p>" : "") +
        '<p class="cs-note-b">' + prose(b.n, ctx) + "</p></div></aside>";
    },

    x: function (b) {
      return '<div class="cs-code"><div class="cs-code-bar">' +
        '<span>' + TD.esc(b.x.lang || "code") + "</span></div>" +
        "<pre><code>" + TD.esc(b.x.code) + "</code></pre></div>";
    },

    dg: function (b) {
      if (!TD.hasDiagram || !TD.hasDiagram(b.dg)) return "";
      return '<figure class="cs-dg">' + TD.diagram(b.dg) + "</figure>";
    }
  };

  var ORDER = ["h", "p", "l", "tl", "q", "n", "x", "dg"];

  function renderBlock(b, ctx) {
    for (var i = 0; i < ORDER.length; i++) {
      var key = ORDER[i];
      if (b[key] != null) return BLOCKS[key](b, ctx);
    }
    return "";
  }

  TD.studyBody = function (study) {
    var ctx = { targets: linkTargets(study), seen: Object.create(null) };
    return (study.b || []).map(function (b) { return renderBlock(b, ctx); }).join("");
  };

  /* Headings, for the in-page contents rail. */
  TD.studyOutline = function (study) {
    return (study.b || []).filter(function (b) { return b.h; })
      .map(function (b) { return { id: "h-" + TD.slugify(b.h), t: b.h }; });
  };

  /* The skim layer: everything a reader needs if they stop after 30 seconds. */
  TD.studySkim = function (study) {
    var ctx = { targets: linkTargets(study), seen: Object.create(null) };
    var h = '<div class="cs-skim">';

    if (study.tldr) {
      h += '<div class="cs-tldr"><p class="cs-tldr-k">The short version</p>' +
        '<p class="cs-tldr-b">' + prose(study.tldr, ctx) + "</p></div>";
    }

    if (study.say && study.say.length) {
      h += '<div class="cs-say"><p class="cs-say-k">' + TD.icon("chat") +
        "What to actually say</p><ul>" +
        study.say.map(function (line) { return "<li>" + prose(line, ctx) + "</li>"; }).join("") +
        "</ul></div>";
    }

    return h + "</div>";
  };

})(window.TD);
