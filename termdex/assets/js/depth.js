/* ==========================================================================
   depth.js — the four sections that take an entry from "I can define it" to
   "I understand it".

   The original schema answered *what* a term is: a definition, two
   paragraphs, four key points, a worked example, a flow. That is a good
   dictionary entry and it is not enough. Someone who has only read that can
   repeat the definition and cannot reason with it — they do not know what
   problem the thing was invented for, which mental model of it is wrong,
   what it costs, or what the numbers actually are.

   So four optional fields, each rendering only when a term carries it:

     t.why   why it exists, and what people did before
     t.miss  the wrong mental models, stated then corrected
     t.trade what it buys, what it costs, when not to use it
     t.num   worked numbers, so the claims stop being hand-waving

   Every one is optional. A term without them renders exactly as it does
   today, which is what makes this safe to roll out across 1,481 entries
   over many sessions rather than all at once.

   Nothing here invents its own markup vocabulary: TD.rich() does inline
   formatting the same way it does everywhere else, so `code`, **bold** and
   *emphasis* work in these sections too.
   ========================================================================== */

(function (TD) {
  "use strict";

  function esc(s) { return TD.esc(s); }
  function rich(s) { return TD.rich(s); }

  /* ---------- why it exists ----------
     A short history with a point. The shape is deliberately: here was the
     problem, here is what people did instead, here is why that stopped
     working. A reader who knows the pain a tool was built for can predict
     how it behaves; a reader who only knows its features cannot.

     Shape:
       why: {
         before: "what people did instead",
         problem: "why that stopped working",
         shift: "what changed as a result"      (optional)
       }
     or a plain string for the simple case. */
  TD.whyExists = function (why) {
    if (!why) return "";
    if (typeof why === "string") {
      return '<div class="dp dp-why"><p>' + rich(why) + "</p></div>";
    }

    var rows = "";
    if (why.before) {
      rows += row("Before", why.before, "clock");
    }
    if (why.problem) {
      rows += row("The problem", why.problem, "alert");
    }
    if (why.shift) {
      rows += row("What changed", why.shift, "spark");
    }
    if (!rows) return "";

    return '<div class="dp dp-why">' + rows + "</div>";

    function row(k, v, ico) {
      return '<div class="dp-row">' +
        '<span class="dp-row-k">' + TD.icon(ico) + esc(k) + "</span>" +
        '<p class="dp-row-v">' + rich(v) + "</p>" +
        "</div>";
    }
  };

  /* ---------- misconceptions ----------
     The wrong belief first, in the words someone would actually use, then
     the correction. Printing the wrong version first is deliberate: a reader
     who holds it recognises themselves and reads the correction properly.
     A list of true statements would slide past them.

     Shape:
       miss: [ { w: "the wrong belief", r: "what is actually true" }, ... ] */
  TD.misconceptions = function (miss) {
    if (!miss || !miss.length) return "";
    return '<ul class="dp-miss">' + miss.map(function (m) {
      if (!m || !m.w) return "";
      return '<li class="dp-miss-i">' +
        '<p class="dp-miss-w"><span class="dp-miss-mark" aria-hidden="true">' +
          TD.icon("close") + '</span><span class="sr-only">Wrong: </span>' +
          rich(m.w) + "</p>" +
        (m.r
          ? '<p class="dp-miss-r"><span class="dp-miss-mark" aria-hidden="true">' +
            TD.icon("check") + '</span><span class="sr-only">Actually: </span>' +
            rich(m.r) + "</p>"
          : "") +
      "</li>";
    }).join("") + "</ul>";
  };

  /* ---------- trade-offs ----------
     What it buys against what it costs, then the cases where the obvious
     choice is the wrong one. The "when not to" list is the part that
     matters: knowing a tool's limits is what separates someone who has used
     it from someone who has read about it.

     Shape:
       trade: {
         buys: ["..."],
         costs: ["..."],
         avoid: ["..."]        when NOT to reach for it
       } */
  TD.tradeoffs = function (tr) {
    if (!tr) return "";
    var h = "";

    if ((tr.buys && tr.buys.length) || (tr.costs && tr.costs.length)) {
      h += '<div class="dp-bal">' +
        col("Buys you", tr.buys, "is-buy", "check") +
        col("Costs you", tr.costs, "is-cost", "minus") +
        "</div>";
    }

    if (tr.avoid && tr.avoid.length) {
      h += '<div class="dp-avoid">' +
        '<p class="dp-avoid-k">' + TD.icon("alert") + "Reach for something else when</p>" +
        '<ul>' + tr.avoid.map(function (a) {
          return "<li>" + rich(a) + "</li>";
        }).join("") + "</ul></div>";
    }

    return h ? '<div class="dp dp-trade">' + h + "</div>" : "";

    function col(title, items, cls, ico) {
      if (!items || !items.length) return "";
      return '<div class="dp-bal-c ' + cls + '">' +
        '<p class="dp-bal-k">' + TD.icon(ico) + esc(title) + "</p>" +
        "<ul>" + items.map(function (i) {
          return "<li>" + rich(i) + "</li>";
        }).join("") + "</ul></div>";
    }
  };

  /* ---------- the numbers ----------
     Concrete figures instead of adjectives. "Much faster" is not knowledge;
     "20 reads instead of a million, 2ms instead of 100 seconds" is something
     a reader can carry into an argument.

     Rendered as a small table because these are almost always a comparison,
     and a comparison wants columns. The note underneath is where the
     surprising part goes — usually how the numbers scale.

     Shape:
       num: {
         t: "optional caption",
         h: ["Case", "Reads", "Time"],       column headers
         r: [ ["full scan", "1,000,000", "100s"], ... ],
         n: "the thing worth noticing"
       } */
  TD.numbers = function (n) {
    if (!n) return "";
    if (typeof n === "string") {
      return '<div class="dp dp-num"><p class="dp-num-n">' + rich(n) + "</p></div>";
    }
    if (!n.r || !n.r.length) {
      return n.n ? '<div class="dp dp-num"><p class="dp-num-n">' + rich(n.n) + "</p></div>" : "";
    }

    var head = "";
    if (n.h && n.h.length) {
      head = "<thead><tr>" + n.h.map(function (c, i) {
        return '<th' + (i ? ' class="is-n"' : "") + ">" + esc(c) + "</th>";
      }).join("") + "</tr></thead>";
    }

    var body = "<tbody>" + n.r.map(function (r) {
      if (!r || !r.length) return "";
      return "<tr>" + r.map(function (c, i) {
        /* the first column labels the case; the rest are figures, and
           figures want tabular numerals and right alignment so they can be
           compared down the column at a glance */
        return i === 0
          ? "<th scope=\"row\">" + rich(String(c)) + "</th>"
          : '<td class="is-n">' + rich(String(c)) + "</td>";
      }).join("") + "</tr>";
    }).join("") + "</tbody>";

    return '<div class="dp dp-num">' +
      '<div class="dp-num-wrap"><table class="dp-num-t">' +
        (n.t ? "<caption>" + esc(n.t) + "</caption>" : "") +
        head + body +
      "</table></div>" +
      (n.n ? '<p class="dp-num-n">' + rich(n.n) + "</p>" : "") +
    "</div>";
  };

  /* Does this term carry any of the deep sections? */
  TD.hasDepth = function (t) {
    return !!(t && (t.why || (t.miss && t.miss.length) || t.trade || t.num));
  };

  /* ---------- merge ----------
     Depth blocks live in their own files under data/depth/ and are attached
     onto the existing terms by slug. Kept separate from the term data for
     two reasons: the depth pass runs over many sessions and would otherwise
     mean re-editing 30-odd large data files, and a term that has not been
     deepened yet renders exactly as it always did.

     A block whose slug does not resolve is recorded rather than silently
     dropped — a typo would otherwise write content nobody ever sees. */
  TD.depthMissing = [];

  TD.applyDepth = function () {
    var list = TD.depth || [];
    var applied = 0;
    list.forEach(function (d) {
      if (!d || !d.slug) return;
      var t = TD.bySlug[d.slug];
      if (!t) { TD.depthMissing.push(d.slug); return; }
      /* never overwrite what the term already says — these are additive */
      if (d.why) t.why = d.why;
      if (d.miss) t.miss = d.miss;
      if (d.trade) t.trade = d.trade;
      if (d.num) t.num = d.num;
      applied++;
    });
    TD.depthCount = applied;
    return applied;
  };
})(window.TD);
