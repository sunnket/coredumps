/* NodeCraft flow diagrams and real-world examples.

   Flowcharts here are built from HTML rather than SVG on purpose: labels are
   written per term and vary wildly in length, and SVG text does not wrap. HTML
   nodes reflow, stay selectable, stay searchable by the browser, and read
   correctly to a screen reader — while CSS supplies the connectors and the
   step badges.

   Shape of a flow:
     fl: {
       t: "Optional title",
       s: [ "a step",
            { q: "the question this step turns on?", y: "one case", n: "the other case" },
            { s: "a step", n: "a quiet note under it" } ]
     }

   About { q, y, n }: this used to render as a Yes/No decision diamond, and it
   read badly. Across the term set the two branches are almost never literal
   answers — they are two cases, or a gain and its cost. A sixth of the
   questions are not even yes/no ("Which platform?", "What does a rewrite
   cost?"), and a couple of dozen have a `y` that opens with the word "No"
   ("Do the types exist at runtime?" -> "No - they are erased"), so a green
   YES badge sat directly above the word No.

   So the question now renders as an ordinary numbered step reading "It
   depends: <question>", and y/n render as two plain, evenly weighted cases
   underneath. No diamond, no Yes/No labels, no green-versus-red — nothing
   that tells the reader one branch is the right answer and the other is the
   failure. The data keys stay `q`/`y`/`n` so no term file has to change.
*/
(function (TD) {
  "use strict";

  function stepNode(item, num) {
    var label = typeof item === "string" ? item : item.s;
    var note = typeof item === "string" ? "" : item.n;
    return '<li class="flow-node">' +
      '<span class="flow-num" aria-hidden="true">' + num + "</span>" +
      '<span class="flow-body"><span class="flow-label">' + TD.rich(label) + "</span>" +
      (note ? '<span class="flow-note">' + TD.rich(note) + "</span>" : "") +
      "</span></li>";
  }

  /* Two shapes of question appear in the data, and one lead-in does not suit
     both. About 1090 are conditional ("Is the accuracy good enough?") and read
     naturally after "It depends:". The other ~190 are open questions ("What
     does a rewrite cost?", "Which platform?") where "It depends" is simply
     wrong — those get "Worth knowing:" instead. */
  var OPEN_Q = /^(which|what|how|where|who|when|why)\b/i;

  function leadIn(q) {
    return OPEN_Q.test(q) ? "Worth knowing:" : "It depends:";
  }

  /* A fork in the sequence. Still numbered, so the reader keeps counting
     steps, with the two cases stacked and equally weighted below it. */
  function decisionNode(item, num) {
    return '<li class="flow-node is-decision">' +
      '<span class="flow-num" aria-hidden="true">' + num + "</span>" +
      '<span class="flow-body">' +
      '<span class="flow-label"><span class="flow-depends">' + leadIn(item.q) + "</span> " + TD.rich(item.q) + "</span>" +
      '<span class="flow-cases">' +
      '<span class="flow-case"><span class="flow-case-mark" aria-hidden="true"></span>' +
      "<span>" + TD.rich(item.y) + "</span></span>" +
      '<span class="flow-case"><span class="flow-case-mark" aria-hidden="true"></span>' +
      "<span>" + TD.rich(item.n) + "</span></span>" +
      "</span></span></li>";
  }

  /* Plain-text version, used for the aria-label so the whole chart is
     announced as one coherent sentence rather than a pile of fragments. */
  function describe(fl) {
    var parts = [];
    var num = 0;
    (fl.s || []).forEach(function (item) {
      num++;
      if (typeof item === "string") parts.push(num + ". " + item);
      else if (item.q) parts.push(num + ". " + leadIn(item.q) + " " + item.q + " Either: " + item.y + ". Or: " + item.n + ".");
      else parts.push(num + ". " + item.s + (item.n ? " — " + item.n : ""));
    });
    return (fl.t ? fl.t + ". " : "") + parts.join(" ");
  }

  TD.flow = function (fl) {
    if (!fl || !fl.s || !fl.s.length) return "";
    var num = 0;
    var nodes = fl.s.map(function (item) {
      num++;
      if (item && item.q) return decisionNode(item, num);
      return stepNode(item, num);
    }).join("");

    return '<figure class="flow" role="group" aria-label="' + TD.esc(describe(fl)) + '">' +
      '<ol class="flow-list">' + nodes + "</ol>" +
      (fl.t ? '<figcaption class="flow-cap">' + TD.esc(fl.t) + "</figcaption>" : "") +
      "</figure>";
  };

  TD.realWorld = function (ex) {
    if (!ex || !ex.b) return "";
    return '<aside class="rw">' +
      '<span class="rw-mark" aria-hidden="true">' + TD.icon("compass") + "</span>" +
      '<div class="rw-in">' +
      (ex.h ? '<p class="rw-h">' + TD.rich(ex.h) + "</p>" : "") +
      '<p class="rw-b">' + TD.rich(ex.b) + "</p>" +
      "</div></aside>";
  };

})(window.TD);
