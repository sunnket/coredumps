/* NodeCraft career roadmap — section renderers.

   Each function here returns the HTML for one section of a role page, so
   app.js can assemble a role from named parts rather than one long string.
   Two conventions worth knowing before reading:

   1. "Coming soon" is never written by hand. Every link to a course goes
      through TD.resolveStep, which reports a step whose target track does
      not exist yet. The tag is therefore always truthful, and the day a
      track is written every role that points at it lights up on its own.

   2. Salary bars share one scale per role (r.payTop). Bars drawn to their
      own band's maximum look identical at every level, which is precisely
      the opposite of what a salary chart is for.
*/
(function (TD) {
  "use strict";

  var esc = TD.esc, rich = TD.rich, icon = TD.icon;

  /* ---- shared bits ---- */

  /* Levels carry a word as well as a colour. Colour alone would leave the
     matrix unreadable to a colour-blind reader and in a printed page. */
  var LVL = {
    must: { k: "Must have", d: "Interviews assume it" },
    should: { k: "Should have", d: "Expected within a year" },
    edge: { k: "Edge", d: "Rare — a real differentiator" }
  };

  var DEMAND = {
    explosive: { k: "Explosive demand", n: 4 },
    hot: { k: "High demand", n: 3 },
    strong: { k: "Strong demand", n: 3 },
    steady: { k: "Steady demand", n: 2 },
    niche: { k: "Niche — few roles", n: 1 }
  };
  TD.demandOf = function (r) { return DEMAND[r.demand] || DEMAND.steady; };

  /* ₹ figures are in lakhs. Above 100 the readable unit is crores, and a
     salary page that prints "₹250 LPA" reads as a typo to an Indian eye. */
  function lpa(n) {
    if (n >= 100) {
      var cr = n / 100;
      return "₹" + (cr % 1 === 0 ? cr : cr.toFixed(1)) + " Cr";
    }
    return "₹" + (n % 1 === 0 ? n : n.toFixed(1)) + "L";
  }
  TD.lpa = lpa;

  /* A step — study plan item or skill row — as a link, or as an honest
     coming-soon chip when we have not written the course yet. */
  function stepLink(step, label) {
    var s = TD.resolveStep(step);
    var text = esc(label || s.label || "");
    if (s.soon) {
      return '<span class="cr-soon" title="This course is not written yet">' +
        text + '<b>soon</b></span>';
    }
    return '<a class="cr-golink" href="' + s.href + '">' + text + icon("arrowRight") + "</a>";
  }
  TD.stepLink = stepLink;

  function head(id, ico, title, sub) {
    return '<h2 class="cr-h2" id="' + id + '"><span class="cr-h2-i">' + icon(ico) + "</span>" +
      "<span><b>" + esc(title) + "</b>" +
      (sub ? "<i>" + esc(sub) + "</i>" : "") + "</span></h2>";
  }
  TD.crHead = head;

  /* ================= role page sections ================= */

  TD.roleWhat = function (r) {
    if (!r.what.length) return "";
    return '<section class="cr-sec">' +
      head("what", "bulb", "What this job actually is", "past the title, past the job posting") +
      '<div class="cr-prose">' + r.what.map(function (p) {
        return "<p>" + rich(p) + "</p>";
      }).join("") + "</div></section>";
  };

  TD.roleDay = function (r) {
    if (!r.day.length) return "";
    return '<section class="cr-sec">' +
      head("day", "gauge", "A day in the life", "the strongest signal of fit there is") +
      '<ol class="cr-day">' + r.day.map(function (d) {
        return '<li class="cr-day-i"><span class="cr-day-t">' + esc(d.t) + "</span>" +
          '<span class="cr-day-d">' + rich(d.d) + "</span></li>";
      }).join("") + "</ol></section>";
  };

  TD.roleFit = function (r) {
    if (!r.fit) return "";
    return '<section class="cr-sec">' +
      head("fit", "compass", "Is this actually you?", "read this before the salary section, not after") +
      '<div class="cr-fit">' +
      '<div class="cr-fit-c is-yes"><p class="cr-fit-k">' + icon("check") +
      "You will probably love it if</p><ul>" +
      r.fit.love.map(function (x) { return "<li>" + rich(x) + "</li>"; }).join("") +
      "</ul></div>" +
      '<div class="cr-fit-c is-no"><p class="cr-fit-k">' + icon("close") +
      "Think twice if</p><ul>" +
      r.fit.avoid.map(function (x) { return "<li>" + rich(x) + "</li>"; }).join("") +
      "</ul></div></div></section>";
  };

  TD.roleSkills = function (r) {
    if (!r.skills.length) return "";
    var counts = { must: 0, should: 0, edge: 0 };
    r.skills.forEach(function (g) {
      (g.items || []).forEach(function (it) { counts[it.lvl] = (counts[it.lvl] || 0) + 1; });
    });

    var h = '<section class="cr-sec">' +
      head("skills", "layers", "The skill matrix", r.skillCount + " skills, grouped by what they are for");

    /* A legend, because the level chips are a coded scale and a coded scale
       without a key is decoration. */
    h += '<div class="cr-legend">' + Object.keys(LVL).map(function (k) {
      return '<span class="cr-legend-i" data-lvl="' + k + '"><i></i><b>' + esc(LVL[k].k) +
        "</b> — " + esc(LVL[k].d) + ' <em>(' + (counts[k] || 0) + ")</em></span>";
    }).join("") + "</div>";

    h += r.skills.map(function (g) {
      var gh = '<div class="cr-sg"><div class="cr-sg-h"><h3>' + esc(g.g) + "</h3>" +
        (g.note ? "<p>" + rich(g.note) + "</p>" : "") + "</div><ul class=\"cr-sk\">";
      gh += (g.items || []).map(function (it) {
        var s = TD.resolveStep(it);
        return '<li class="cr-sk-i" data-lvl="' + esc(it.lvl) + '">' +
          '<span class="cr-sk-top">' +
          '<span class="cr-sk-n">' + esc(it.n) + "</span>" +
          '<span class="cr-sk-l" data-lvl="' + esc(it.lvl) + '">' +
          esc((LVL[it.lvl] || LVL.should).k) + "</span></span>" +
          (it.d ? '<span class="cr-sk-d">' + rich(it.d) + "</span>" : "") +
          ((it.track || it.term)
            ? '<span class="cr-sk-go">' + stepLink(it, s.soon ? "Course" : "Learn it") + "</span>"
            : "") +
          "</li>";
      }).join("");
      return gh + "</ul></div>";
    }).join("");

    if (r.stack.length) {
      h += '<div class="cr-stack"><p class="cr-stack-k">' + icon("terminal") +
        "The tools that appear in the job posting</p><div class=\"chips\">" +
        r.stack.map(function (s) {
          return '<span class="chip is-static"><span class="chip-dot"></span>' + esc(s) + "</span>";
        }).join("") + "</div></div>";
    }

    return h + "</section>";
  };

  TD.roleEdge = function (r) {
    if (!r.edge.length) return "";
    return '<section class="cr-sec">' +
      head("edge", "spark", "What makes you exceptional at it",
        "the difference between employable and sought-after") +
      '<div class="cr-edge">' + r.edge.map(function (e, i) {
        return '<div class="cr-edge-c"><span class="cr-edge-n">' + (i + 1) + "</span>" +
          "<h3>" + esc(e.t) + "</h3><p>" + rich(e.d) + "</p></div>";
      }).join("") + "</div></section>";
  };

  /* ---- salary ----------------------------------------------------------
     A range chart, not a single number, because a single number for "fresher
     AI engineer salary in India" is always a lie. Every bar carries its
     figures as text as well as width, so the section is fully readable
     without seeing the bars at all. */
  TD.rolePay = function (r) {
    if (!r.pay || !r.pay.bands.length) return "";
    var top = r.payTop || 1;
    var guide = r.pay.bands[0];

    var h = '<section class="cr-sec">' +
      head("pay", "sigma", "What it pays in India",
        "fixed CTC, in lakhs per annum · estimates, not quotes");

    h += '<figure class="cr-pay" role="img" aria-label="Salary ranges by experience. ' +
      r.pay.bands.map(function (b) {
        return b.k + ": " + lpa(b.lo) + " to " + lpa(b.hi) + ", typically " + lpa(b.mid);
      }).join(". ") + '">';

    h += '<figcaption class="cr-pay-cap"><span class="cr-pay-key">' +
      '<i class="k-range"></i>range across company tiers</span>' +
      '<span class="cr-pay-key"><i class="k-mid"></i>typical offer</span>' +
      '<span class="cr-pay-scale">scale: 0 – ' + lpa(top) + "</span></figcaption>";

    h += '<div class="cr-pay-rows">' + r.pay.bands.map(function (b) {
      var l = (b.lo / top) * 100, w = Math.max(((b.hi - b.lo) / top) * 100, 2);
      var m = (b.mid / top) * 100;
      return '<div class="cr-pay-row">' +
        '<div class="cr-pay-lab"><b>' + esc(b.k) + "</b><span>" + esc(b.y) + "</span></div>" +
        '<div class="cr-pay-track">' +
        '<div class="cr-pay-bar" style="left:' + l.toFixed(1) + "%;width:" + w.toFixed(1) + '%"></div>' +
        '<div class="cr-pay-mid" style="left:' + m.toFixed(1) + '%"></div>' +
        "</div>" +
        '<div class="cr-pay-num"><b>' + lpa(b.mid) + "</b><span>" +
        lpa(b.lo) + " – " + lpa(b.hi) + "</span></div>" +
        (b.note ? '<p class="cr-pay-note">' + rich(b.note) + "</p>" : "") +
        "</div>";
    }).join("") + "</div></figure>";

    if (r.pay.notes && r.pay.notes.length) {
      h += '<ul class="cr-notes">' + r.pay.notes.map(function (n) {
        return "<li>" + rich(n) + "</li>";
      }).join("") + "</ul>";
    }

    /* The disclaimer is deliberately inside the section rather than in a
       footer. Numbers this specific must carry their caveat where they are
       read, not where they are easy to miss. */
    if (TD.careerGuide && TD.careerGuide.payNote) {
      h += '<p class="cr-disclaim">' + icon("bulb") + "<span>" +
        rich(TD.careerGuide.payNote) + "</span></p>";
    }

    /* One concrete anchor, because a fresher reading this wants a number
       they can hold on to. */
    if (guide) {
      h += '<p class="cr-pay-anchor">If you are applying as a fresher, the honest number to ' +
        "expect across all company tiers is <b>" + lpa(guide.lo) + " – " + lpa(guide.hi) +
        "</b>, with <b>" + lpa(guide.mid) + "</b> being typical. Which end you land on is " +
        "decided mostly by company tier and by how much you have actually built.</p>";
    }

    return h + "</section>";
  };

  TD.roleLadder = function (r) {
    if (!r.ladder.length) return "";
    return '<section class="cr-sec">' +
      head("ladder", "path", "The ladder", "what the next fifteen years look like") +
      '<ol class="cr-ladder">' + r.ladder.map(function (l, i) {
        return '<li class="cr-rung"><span class="cr-rung-n">' + (i + 1) + "</span>" +
          '<div class="cr-rung-b"><div class="cr-rung-h"><h3>' + esc(l.t) + "</h3>" +
          '<span class="cr-rung-m"><span class="cr-rung-y">' + esc(l.y) + "</span>" +
          '<span class="cr-rung-p">' + esc(l.pay) + "</span></span></div>" +
          "<p>" + rich(l.d) + "</p></div></li>";
      }).join("") + "</ol></section>";
  };

  TD.roleCompanies = function (r) {
    if (!r.cos.length) return "";
    return '<section class="cr-sec">' +
      head("cos", "grid", "Who actually hires for this",
        "company tier is the single biggest multiplier on your salary") +
      '<div class="cr-cos">' + r.cos.map(function (c, i) {
        return '<div class="cr-co" data-tier="' + i + '">' +
          '<div class="cr-co-h"><h3>' + esc(c.tier) + "</h3>" +
          '<span class="cr-co-p">' + esc(c.pay) + "</span></div>" +
          "<p>" + rich(c.d) + "</p>" +
          '<div class="cr-co-names">' + c.names.map(function (n) {
            return "<span>" + esc(n) + "</span>";
          }).join("") + "</div></div>";
      }).join("") + "</div></section>";
  };

  TD.roleHire = function (r) {
    if (!r.hire.length) return "";
    return '<section class="cr-sec">' +
      head("hire", "list", "The interview loop", "stage by stage, and how to pass each one") +
      '<ol class="cr-hire">' + r.hire.map(function (s, i) {
        return '<li class="cr-hire-i"><span class="cr-hire-n">' + (i + 1) + "</span>" +
          "<div><h3>" + esc(s.t) + "</h3><p>" + rich(s.d) + "</p>" +
          (s.tip ? '<p class="cr-hire-tip">' + icon("spark") + "<span>" + rich(s.tip) + "</span></p>" : "") +
          "</div></li>";
      }).join("") + "</ol></section>";
  };

  TD.roleProof = function (r) {
    if (!r.proof.length) return "";
    return '<section class="cr-sec">' +
      head("proof", "check", "Build these and you are hireable",
        "portfolio projects that actually change a hiring decision") +
      '<div class="cr-proof">' + r.proof.map(function (p) {
        return '<div class="cr-proof-c"><h3>' + esc(p.t) + "</h3><p>" + rich(p.d) + "</p>" +
          (p.why ? '<p class="cr-proof-w"><b>Why it works:</b> ' + rich(p.why) + "</p>" : "") +
          "</div>";
      }).join("") + "</div></section>";
  };

  /* ---- the study plan --------------------------------------------------
     The one section that ties a career page back to the course. Every row
     resolves through TD.resolveStep, so the coming-soon tags maintain
     themselves. */
  TD.rolePlan = function (r) {
    if (!r.plan.length) return "";
    var cov = TD.roleCoverage(r);

    var h = '<section class="cr-sec">' +
      head("plan", "path", "Your study plan, in order",
        "roughly 12–16 months from zero if you work at it steadily");

    h += '<div class="cr-cov"><div class="cr-cov-b">' +
      '<p class="cr-cov-k">Available on CoreDumps right now</p>' +
      '<p class="cr-cov-v"><b>' + cov.ready + "</b> of " + cov.total + " steps</p></div>" +
      '<div class="cr-cov-bar" role="img" aria-label="' + cov.ready + " of " + cov.total +
      ' study steps have a course written"><i style="width:' + cov.pct + '%"></i></div>' +
      '<p class="cr-cov-n">The rest are written and on the way. Steps marked ' +
      '<span class="cr-soon is-inline">coming soon</span> tell you exactly what to learn ' +
      "even before the course exists — take them elsewhere and come back.</p></div>";

    h += '<ol class="cr-plan">' + r.plan.map(function (s, i) {
      var res = TD.resolveStep(s);
      return '<li class="cr-plan-i' + (res.soon ? " is-soon" : "") + '">' +
        '<span class="cr-plan-n">' + (i + 1) + "</span>" +
        '<div class="cr-plan-b">' +
        '<div class="cr-plan-h"><h3>' + esc(s.n) + "</h3>" +
        (s.mo ? '<span class="cr-plan-mo">' + esc(s.mo) + "</span>" : "") + "</div>" +
        "<p>" + rich(s.d) + "</p>" +
        '<span class="cr-plan-go">' + stepLink(s, res.soon ? "Course being written" : "Open the course") +
        "</span></div></li>";
    }).join("") + "</ol></section>";

    return h;
  };

  TD.roleMyths = function (r) {
    if (!r.myths.length) return "";
    return '<section class="cr-sec">' +
      head("myths", "bulb", "What people get wrong", "each of these costs someone months") +
      '<div class="cr-myths">' + r.myths.map(function (m) {
        return '<div class="cr-myth"><p class="cr-myth-m"><span>Myth</span>' + rich(m.m) + "</p>" +
          '<p class="cr-myth-r"><span>Reality</span>' + rich(m.r) + "</p></div>";
      }).join("") + "</div></section>";
  };

  /* ---- the contents rail, built from whatever sections exist ---- */
  TD.roleOutline = function (r) {
    var out = [];
    function add(id, t, on) { if (on) out.push({ id: id, t: t }); }
    add("what", "What the job is", r.what.length);
    add("day", "A day in the life", r.day.length);
    add("fit", "Is this you?", !!r.fit);
    add("skills", "Skill matrix", r.skills.length);
    add("edge", "Being exceptional", r.edge.length);
    add("pay", "Salary in India", r.pay && r.pay.bands.length);
    add("ladder", "The ladder", r.ladder.length);
    add("cos", "Who hires", r.cos.length);
    add("hire", "Interview loop", r.hire.length);
    add("proof", "Portfolio", r.proof.length);
    add("plan", "Study plan", r.plan.length);
    add("myths", "Myths", r.myths.length);
    return out;
  };

  /* ================= index page pieces ================= */

  /* One role, as a card. Used on the index, on the family filter and in the
     "adjacent roles" rail at the foot of a role page. */
  TD.roleCard = function (r, compact) {
    var f = TD.famById[r.fam] || {};
    var band = r.pay && r.pay.bands[0];
    var cov = TD.roleCoverage(r);
    var dem = TD.demandOf(r);

    var h = '<a class="cr-card' + (compact ? " is-compact" : "") + '" data-fam="' + r.fam +
      '" href="#/role/' + r.slug + '">';

    h += '<span class="cr-card-top"><span class="cr-card-ico">' + icon(r.icon) + "</span>" +
      '<span class="cr-card-dem" data-n="' + dem.n + '" title="' + esc(dem.k) + '">' +
      '<i></i><i></i><i></i><i></i><b>' + esc(dem.k) + "</b></span></span>";

    h += '<span class="cr-card-t">' + esc(r.t) + "</span>";
    if (r.a) h += '<span class="cr-card-a">' + esc(r.a) + "</span>";
    h += '<span class="cr-card-d">' + esc(r.deck) + "</span>";

    if (!compact) {
      var must = TD.mustSkills(r, 4);
      if (must.length) {
        h += '<span class="cr-card-sk">' + must.map(function (s) {
          return "<i>" + esc(s) + "</i>";
        }).join("") + "</span>";
      }
    }

    h += '<span class="cr-card-f">' +
      (band ? '<span class="cr-card-pay"><b>' + lpa(band.lo) + "–" + lpa(band.hi) +
        "</b><i>fresher CTC</i></span>" : "") +
      '<span class="cr-card-cov">' + cov.ready + "/" + cov.total + " steps ready</span>" +
      "</span>";

    return h + "</a>";
  };

  /* The five phases every technical career passes through. */
  TD.phaseList = function () {
    return '<ol class="cr-ph">' + TD.careerPhases.map(function (p) {
      return '<li class="cr-ph-i"><div class="cr-ph-h">' +
        '<span class="cr-ph-n">' + p.n + "</span>" +
        "<div><h3>" + esc(p.name) + "</h3>" +
        '<span class="cr-ph-t">' + esc(p.time) + "</span></div></div>" +
        '<p class="cr-ph-l">' + rich(p.lede) + "</p>" +
        '<ul class="cr-ph-do">' + p.do.map(function (d) {
          return "<li>" + rich(d) + "</li>";
        }).join("") + "</ul>" +
        '<div class="cr-ph-x">' +
        '<p class="cr-ph-done"><span>' + icon("check") + "You are through it when</span>" +
        rich(p.done) + "</p>" +
        '<p class="cr-ph-trap"><span>' + icon("shield") + "Where people get stuck</span>" +
        rich(p.trap) + "</p></div></li>";
    }).join("") + "</ol>";
  };

  /* Fresher pay across every role, one shared scale. The comparison a
     reader actually wants and cannot get from twenty separate pages. */
  TD.payCompare = function () {
    var rows = TD.roles.filter(function (r) { return r.pay && r.pay.bands.length; })
      .map(function (r) {
        var b = r.pay.bands[0];
        return { r: r, lo: b.lo, mid: b.mid, hi: b.hi };
      }).sort(function (a, b) { return b.mid - a.mid; });
    if (!rows.length) return "";
    var top = rows.reduce(function (a, x) { return Math.max(a, x.hi); }, 0);

    return '<figure class="cr-cmp" role="img" aria-label="Entry-level salary ranges by role. ' +
      rows.map(function (x) {
        return x.r.t + ": " + lpa(x.lo) + " to " + lpa(x.hi);
      }).join(". ") + '">' +
      '<figcaption class="cr-cmp-cap">Entry-level fixed CTC across company tiers · ' +
      "scale 0 – " + lpa(top) + "</figcaption>" +
      '<div class="cr-cmp-rows">' + rows.map(function (x) {
        var l = (x.lo / top) * 100, w = Math.max(((x.hi - x.lo) / top) * 100, 2);
        var m = (x.mid / top) * 100;
        return '<a class="cr-cmp-row" data-fam="' + x.r.fam + '" href="#/role/' + x.r.slug + '">' +
          '<span class="cr-cmp-n">' + esc(x.r.t) + "</span>" +
          '<span class="cr-cmp-track">' +
          '<i class="cr-cmp-bar" style="left:' + l.toFixed(1) + "%;width:" + w.toFixed(1) + '%"></i>' +
          '<i class="cr-cmp-mid" style="left:' + m.toFixed(1) + '%"></i></span>' +
          '<span class="cr-cmp-v">' + lpa(x.lo) + "–" + lpa(x.hi) + "</span></a>";
      }).join("") + "</div></figure>";
  };

  /* The hiring playbook — the parts that are true for every role. */
  TD.playbook = function () {
    var g = TD.careerGuide;
    if (!g) return "";
    var h = "";

    h += '<div class="cr-truths">' + g.truths.map(function (t) {
      return '<div class="cr-truth"><h3>' + esc(t.t) + "</h3><p>" + rich(t.d) + "</p></div>";
    }).join("") + "</div>";

    h += '<div class="cr-pbrow">';

    h += '<div class="cr-pb"><p class="cr-pb-k">' + icon("list") +
      "Your resume, fixed in six lines</p><ul class=\"cr-pb-l\">" +
      g.resume.map(function (x) {
        return "<li><b>" + esc(x.t) + "</b>" + rich(x.d) + "</li>";
      }).join("") + "</ul></div>";

    h += '<div class="cr-pb"><p class="cr-pb-k">' + icon("gauge") +
      "The maths of a job hunt</p>" +
      '<p class="cr-pb-i">This is what a normal, successful search looks like. ' +
      "Knowing the shape of it is the main defence against giving up in month two.</p>" +
      '<ul class="cr-funnel">' + g.funnel.map(function (f) {
        return '<li><span class="cr-funnel-v">' + esc(f.v) + "</span>" +
          '<span class="cr-funnel-k">' + esc(f.k) + "</span>" +
          '<span class="cr-funnel-d">' + rich(f.d) + "</span></li>";
      }).join("") + "</ul></div>";

    h += "</div>";

    h += '<div class="cr-pb is-wide"><p class="cr-pb-k">' + icon("spark") +
      "Where the money actually comes from</p>" +
      '<p class="cr-pb-i">Ranked by size of effect. Freshers systematically over-weight the ' +
      "first offer and under-weight everything below it.</p>" +
      '<ul class="cr-levers">' + g.levers.map(function (l) {
        return '<li><span class="cr-lever-t">' + esc(l.t) + "</span>" +
          '<span class="cr-lever-d">' + esc(l.d) + "</span>" +
          '<span class="cr-lever-n">' + rich(l.n) + "</span></li>";
      }).join("") + "</ul></div>";

    return h;
  };

})(window.TD);
