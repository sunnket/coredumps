/* Logic Vault UI — CoreDumps

   Two views: the shelf index, and one shelf's decks of cards.

   The interaction model is recall-first and deliberate about it. A card shows
   its title and, by default, hides the line you are supposed to be able to
   produce. You try to say it, then reveal. Showing the answer alongside the
   question turns a memory tool into a reading list, and reading is the thing
   that feels like learning without being it.

   Progress is a two-state self-assessment — solid or shaky — because "I read
   this" is not a fact worth storing. Whether you could say it unprompted is.

   Everything is rendered as a string and wired by delegation in TD.wireLogic,
   matching how every other section in this app works. */
(function (TD) {
  "use strict";

  var state = {
    shelf: null,
    reveal: false,     /* reveal every card's line at once */
    filter: "all",     /* all | shaky | unseen | known */
    query: ""
  };

  /* ---------------- helpers ---------------- */

  function cardsOfShelf(shelfId) {
    return TD.logicCards.filter(function (C) { return C.shelf === shelfId; });
  }

  function matches(C) {
    if (state.filter !== "all") {
      var m = TD.logicScore.get(C.id);
      if (state.filter === "known" && m !== "known") return false;
      if (state.filter === "shaky" && m !== "shaky") return false;
      if (state.filter === "unseen" && m) return false;
    }
    if (!state.query) return true;
    var q = state.query.toLowerCase();
    return (C.t + " " + C.recall + " " + C.why + " " + (C.use || []).join(" "))
      .toLowerCase().indexOf(q) !== -1;
  }

  function pct(n, d) { return d ? Math.round((n / d) * 100) : 0; }

  /* ---------------- the index ---------------- */

  TD.viewLogic = function () {
    var all = TD.logicCards;
    var sum = TD.logicScore.summary(all);

    var shelves = TD.logicShelves.map(function (S) {
      var cards = cardsOfShelf(S.id);
      var s = TD.logicScore.summary(cards);
      var done = pct(s.known, s.total);
      return '<a class="lv-shelf" href="#/logic/' + S.id + '" style="--sc:' + S.col + '">' +
        '<span class="lv-shelf-ico">' + TD.icon(S.icon) + '</span>' +
        '<div class="lv-shelf-body">' +
          '<h3>' + TD.esc(S.name) + '</h3>' +
          '<p class="lv-shelf-deck">' + TD.esc(S.deck) + '</p>' +
          '<div class="lv-shelf-meta">' +
            '<span>' + s.total + ' cards</span>' +
            '<span>' + S.decks.length + ' decks</span>' +
            (s.known ? '<span class="lv-shelf-done">' + done + '% solid</span>' : '') +
          '</div>' +
          '<div class="lv-bar" aria-hidden="true"><i style="width:' + done + '%"></i></div>' +
        '</div>' +
      '</a>';
    }).join("");

    return '<div class="lv-view">' +
      '<header class="lv-hero">' +
        '<div class="lv-hero-copy">' +
          '<span class="lv-eyebrow">' + TD.icon("brain") + ' Loops &amp; Logics</span>' +
          '<h1>The things you are meant to <em>know</em>, not look up</h1>' +
          '<p>Every engineer carries a working set: the costs, the rules, the trade-offs and the ' +
            'trigger phrases that come out mid-sentence without a pause. This is that set, ' +
            'written down. One card is one recallable fact — the line worth memorising, why it ' +
            'is true, when it applies, and the trap that catches people who half-remember it.</p>' +
          '<div class="lv-hero-actions">' +
            '<a class="btn btn-md btn-primary" href="#/logic/aieng">' +
              TD.icon("sparkles") + ' The AI engineer’s vault</a>' +
            '<a class="btn btn-md btn-ghost" href="#/learn/python/what-a-for-loop-really-does">' +
              TD.icon("code") + ' Loops in depth</a>' +
          '</div>' +
        '</div>' +
        '<div class="lv-hero-stats">' +
          '<div class="lv-stat"><strong>' + all.length + '</strong><span>Cards</span></div>' +
          '<div class="lv-stat"><strong>' + TD.logicShelves.length + '</strong><span>Shelves</span></div>' +
          '<div class="lv-stat"><strong>' + TD.logicDecks.length + '</strong><span>Decks</span></div>' +
          '<div class="lv-stat' + (sum.known ? ' is-live' : '') + '">' +
            '<strong>' + sum.known + '</strong><span>Marked solid</span></div>' +
        '</div>' +
      '</header>' +

      '<section class="lv-how">' +
        '<h2>' + TD.icon("idea") + ' How to use this</h2>' +
        '<ol class="lv-how-steps">' +
          '<li><strong>Read the title, then say the line before revealing it.</strong> ' +
            'The recall line is hidden on purpose. Attempting and failing is what makes it ' +
            'stick; reading it again is what makes it feel familiar and stay unavailable.</li>' +
          '<li><strong>Mark honestly.</strong> <em>Solid</em> means you produced it unprompted. ' +
            'Anything else is <em>shaky</em>. The value of the mark is entirely in its accuracy.</li>' +
          '<li><strong>Come back to the shaky ones.</strong> Filter to them and run the shelf ' +
            'again in a few days. Five minutes of recall beats an hour of rereading.</li>' +
          '<li><strong>Say it out loud.</strong> These are things you will need to produce in ' +
            'conversation. Silent recognition and spoken explanation are different skills.</li>' +
        '</ol>' +
      '</section>' +

      '<div class="lv-shelves">' + shelves + '</div>' +
    '</div>';
  };

  /* ---------------- one shelf ---------------- */

  function cardHtml(C) {
    var mark = TD.logicScore.get(C.id);
    var open = state.reveal;

    var uses = (C.use || []).map(function (u) {
      return '<li>' + TD.rich(u) + '</li>';
    }).join("");

    var nums = (C.num || []).map(function (row) {
      return '<div class="lv-num"><span>' + TD.rich(row[0]) + '</span>' +
        '<strong>' + TD.rich(row[1]) + '</strong></div>';
    }).join("");

    return '<article class="lv-card' + (mark ? " is-" + mark : "") + '" data-card="' + C.id + '">' +
      '<header class="lv-card-h">' +
        '<h4>' + TD.esc(C.t) + '</h4>' +
        '<div class="lv-marks">' +
          '<button class="lv-mark' + (mark === "known" ? " is-on" : "") + '" data-mark="known" ' +
            'data-card="' + C.id + '" title="I could say this unprompted">' +
            TD.icon("check") + 'Solid</button>' +
          '<button class="lv-mark' + (mark === "shaky" ? " is-on" : "") + '" data-mark="shaky" ' +
            'data-card="' + C.id + '" title="Needs another pass">' +
            TD.icon("refresh") + 'Shaky</button>' +
        '</div>' +
      '</header>' +

      '<div class="lv-recall' + (open ? " is-open" : "") + '" data-recall="' + C.id + '">' +
        '<button class="lv-recall-btn" data-reveal="' + C.id + '">' +
          TD.icon("eye") + '<span>Say it, then reveal</span></button>' +
        '<p class="lv-recall-line">' + TD.rich(C.recall) + '</p>' +
      '</div>' +

      '<div class="lv-card-b">' +
        (C.why ? '<p class="lv-why">' + TD.rich(C.why) + '</p>' : "") +
        (nums ? '<div class="lv-nums">' + nums + '</div>' : "") +
        (C.code ? '<pre class="lv-code"><code>' +
          (TD.hl ? TD.hl(C.code.c, C.code.lang) : TD.esc(C.code.c)) + '</code></pre>' : "") +
        (uses ? '<div class="lv-use"><p class="lv-k">' + TD.icon("target") + 'Where it applies</p>' +
          '<ul>' + uses + '</ul></div>' : "") +
        (C.trap ? '<aside class="lv-trap"><span aria-hidden="true">!</span><div>' +
          '<p class="lv-k">The half-remembered version</p>' +
          '<p>' + TD.rich(C.trap) + '</p></div></aside>' : "") +
        (C.r && C.r.length ? '<div class="lv-rel">' + C.r.map(function (name) {
          var t = TD.resolve ? TD.resolve(name) : null;
          if (!t) return "";
          return '<a class="chip" data-cat="' + t.c + '" href="#/t/' + t.slug + '">' +
            '<span class="chip-dot"></span>' + TD.esc(t.t) + '</a>';
        }).filter(Boolean).join("") + '</div>' : "") +
      '</div>' +
    '</article>';
  }

  TD.viewLogicShelf = function (shelfId) {
    var S = TD.logicShelfById[shelfId];
    if (!S) {
      return '<div class="lv-view"><p class="empty">No such shelf. ' +
        '<a href="#/logic">Back to the vault</a>.</p></div>';
    }
    state.shelf = shelfId;

    var all = cardsOfShelf(shelfId);
    var sum = TD.logicScore.summary(all);

    var decks = S.decks.map(function (D) {
      var shown = D.cards.filter(matches);
      if (!shown.length) return "";
      return '<section class="lv-deck" id="deck-' + D.id + '">' +
        '<header class="lv-deck-h">' +
          '<h3>' + TD.esc(D.name) + '<span class="lv-deck-n">' + shown.length + '</span></h3>' +
          (D.why ? '<p>' + TD.rich(D.why) + '</p>' : "") +
        '</header>' +
        '<div class="lv-cards">' + shown.map(cardHtml).join("") + '</div>' +
      '</section>';
    }).join("");

    var filters = [
      { id: "all", label: "All", n: all.length },
      { id: "shaky", label: "Shaky", n: sum.shaky },
      { id: "unseen", label: "Not yet marked", n: sum.untouched },
      { id: "known", label: "Solid", n: sum.known }
    ].map(function (f) {
      return '<button class="lv-filter' + (state.filter === f.id ? " is-active" : "") + '" ' +
        'data-lv-filter="' + f.id + '">' + f.label +
        '<span class="lv-filter-n">' + f.n + '</span></button>';
    }).join("");

    var jump = S.decks.map(function (D) {
      return '<a href="#/logic/' + S.id + '#deck-' + D.id + '">' + TD.esc(D.name) + '</a>';
    }).join("");

    return '<div class="lv-view lv-shelf-view" style="--sc:' + S.col + '">' +
      '<nav class="crumbs"><a href="#/logic">Loops &amp; Logics</a>' +
        '<span class="sep">/</span><span>' + TD.esc(S.name) + '</span></nav>' +

      '<header class="lv-shead">' +
        '<span class="lv-shead-ico">' + TD.icon(S.icon) + '</span>' +
        '<div>' +
          '<h1>' + TD.esc(S.name) + '</h1>' +
          '<p>' + TD.esc(S.desc) + '</p>' +
          '<div class="lv-shead-meta">' +
            '<span>' + all.length + ' cards</span>' +
            '<span>' + S.decks.length + ' decks</span>' +
            '<span>' + pct(sum.known, sum.total) + '% marked solid</span>' +
          '</div>' +
        '</div>' +
      '</header>' +

      '<div class="lv-bar lv-bar-lg" aria-hidden="true">' +
        '<i style="width:' + pct(sum.known, sum.total) + '%"></i></div>' +

      (jump ? '<nav class="lv-jump" aria-label="Decks in this shelf">' + jump + '</nav>' : "") +

      '<div class="lv-tools">' +
        '<div class="lv-filters">' + filters + '</div>' +
        '<div class="lv-tools-r">' +
          '<input class="lv-search" id="lvSearch" type="search" placeholder="Search this shelf…" ' +
            'value="' + TD.esc(state.query) + '" aria-label="Search cards in this shelf" />' +
          '<button class="btn btn-sm btn-ghost" id="lvRevealAll">' +
            TD.icon(state.reveal ? "eye" : "eye") +
            (state.reveal ? "Hide all lines" : "Reveal all lines") + '</button>' +
        '</div>' +
      '</div>' +

      (decks || '<p class="empty">Nothing matches that filter.</p>') +
    '</div>';
  };

  /* ---------------- wiring ----------------
     One delegated listener on #view, which survives re-renders because the
     element itself is never replaced -- only its innerHTML is. That makes
     binding idempotent essential: wireView runs on every route change, so
     without the guard below each visit would stack another listener and a
     single click would be handled twice (marking a card, then immediately
     un-marking it). The rerender callback is read from a live reference for
     the same reason -- the listener outlives the call that installed it. */

  var bound = false;
  var rerenderRef = null;

  TD.wireLogic = function (rerender) {
    var view = document.getElementById("view");
    if (!view) return;

    rerenderRef = rerender;
    if (bound) return;
    bound = true;

    view.addEventListener("click", function (e) {
      var reveal = e.target.closest("[data-reveal]");
      if (reveal) {
        var box = view.querySelector('[data-recall="' + reveal.getAttribute("data-reveal") + '"]');
        if (box) box.classList.add("is-open");
        return;
      }

      var mark = e.target.closest("[data-mark]");
      if (mark) {
        var id = mark.getAttribute("data-card");
        var now = TD.logicScore.set(id, mark.getAttribute("data-mark"));
        var card = view.querySelector('.lv-card[data-card="' + id + '"]');
        if (card) {
          card.classList.remove("is-known", "is-shaky");
          if (now) card.classList.add("is-" + now);
          card.querySelectorAll(".lv-mark").forEach(function (b) {
            b.classList.toggle("is-on", b.getAttribute("data-mark") === now);
          });
        }
        return;
      }

      var filter = e.target.closest("[data-lv-filter]");
      if (filter) {
        state.filter = filter.getAttribute("data-lv-filter");
        if (rerenderRef) rerenderRef();
        return;
      }

      if (e.target.closest("#lvRevealAll")) {
        state.reveal = !state.reveal;
        if (rerenderRef) rerenderRef();
      }
    });

    var search = document.getElementById("lvSearch");
    if (search) {
      var t = null;
      search.addEventListener("input", function () {
        clearTimeout(t);
        t = setTimeout(function () {
          state.query = search.value.trim();
          rerender();
          var again = document.getElementById("lvSearch");
          if (again) {
            again.focus();
            again.setSelectionRange(again.value.length, again.value.length);
          }
        }, 180);
      });
    }
  };

})(window.TD);
