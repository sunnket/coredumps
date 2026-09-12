/* NodeCraft diagrams — hand-built inline SVG.
   Every diagram is theme-aware: it paints with CSS custom properties, never
   hard-coded colours, and uses dotted guides so structure reads at a glance. */
(function (TD) {
  "use strict";

  /* ---------------- primitives ---------------- */

  function n(v) { return Math.round(v * 10) / 10; }

  function T(x, y, s, cls, anchor) {
    return '<text x="' + n(x) + '" y="' + n(y) + '"' +
      (cls ? ' class="' + cls + '"' : "") +
      ' text-anchor="' + (anchor || "middle") + '">' + TD.esc(s) + "</text>";
  }

  function BOX(x, y, w, h, label, cls, sub, r) {
    var out = '<rect x="' + n(x) + '" y="' + n(y) + '" width="' + n(w) + '" height="' + n(h) +
      '" rx="' + (r == null ? 7 : r) + '" class="' + (cls || "box") + '"/>';
    if (label != null && label !== "") {
      var cy = sub ? y + h / 2 - 3 : y + h / 2 + 4;
      out += T(x + w / 2, cy, label, "t-title");
      if (sub) out += T(x + w / 2, y + h / 2 + 12, sub, "t-sm");
    }
    return out;
  }

  function L(x1, y1, x2, y2, cls) {
    return '<path class="' + (cls || "ln") + '" d="M' + n(x1) + " " + n(y1) + "L" + n(x2) + " " + n(y2) + '"/>';
  }

  function PATH(d, cls) { return '<path class="' + (cls || "ln") + '" d="' + d + '"/>'; }

  function head(x2, y2, a, cls) {
    var s = 6;
    var bx = x2 - Math.cos(a) * s * 1.5, by = y2 - Math.sin(a) * s * 1.5;
    var px = Math.cos(a + Math.PI / 2) * s * 0.6, py = Math.sin(a + Math.PI / 2) * s * 0.6;
    var fill = cls === "ln-a" ? "fill-a" : cls === "ln-b" ? "fill-b" : "dotgrid";
    return '<path class="' + fill + '" d="M' + n(x2) + " " + n(y2) + "L" + n(bx + px) + " " + n(by + py) +
      "L" + n(bx - px) + " " + n(by - py) + 'Z"/>';
  }

  function AR(x1, y1, x2, y2, cls) {
    var a = Math.atan2(y2 - y1, x2 - x1);
    var bx = x2 - Math.cos(a) * 7, by = y2 - Math.sin(a) * 7;
    return L(x1, y1, bx, by, cls) + head(x2, y2, a, cls);
  }

  /* dotted decorative grid block */
  function DOTS(x, y, cols, rows, gap, r) {
    var o = "", i, j;
    for (i = 0; i < cols; i++) for (j = 0; j < rows; j++) {
      o += '<circle class="dotgrid" cx="' + n(x + i * gap) + '" cy="' + n(y + j * gap) + '" r="' + (r || 1.4) + '"/>';
    }
    return o;
  }

  function CIRC(cx, cy, r, cls) {
    return '<circle cx="' + n(cx) + '" cy="' + n(cy) + '" r="' + n(r) + '" class="' + (cls || "box") + '"/>';
  }

  /* axis helper: x/y axes with labels */
  function AXES(x, y, w, h, xl, yl) {
    return L(x, y, x, y + h, "ln") + L(x, y + h, x + w, y + h, "ln") +
      (xl ? T(x + w, y + h + 15, xl, "t-sm", "end") : "") +
      (yl ? '<text x="' + n(x - 8) + '" y="' + n(y + 2) + '" class="t-sm" text-anchor="end">' + TD.esc(yl) + "</text>" : "");
  }


  /* ================================================================
     Figure primitives — the professional-presence diagrams

     A posture diagram is only useful if it is drawn from real joint
     positions, because the whole lesson is *where the joints go*. So a
     figure here is authored as its joints and nothing else: a limb is a
     round-capped polyline through them, and a bad posture is the same
     function called with different numbers rather than a second drawing.
     That is what keeps the right and wrong versions honestly comparable.

     Everything takes an origin so a figure can be dropped into a panel
     without every coordinate being rewritten.
     ================================================================ */

  /* A limb: polyline through joints, in figure-local coordinates. */
  function LIMB(o, pts, cls) {
    var d = pts.map(function (p, i) {
      return (i ? "L" : "M") + n(o[0] + p[0]) + " " + n(o[1] + p[1]);
    }).join("");
    return '<path class="' + (cls || "body") + '" d="' + d + '"/>';
  }

  /* A head, with an optional nose so the figure has a direction. `face` is
     in degrees, 0 = looking right, 180 = looking left. */
  function HEADF(o, x, y, r, cls, face) {
    var cx = o[0] + x, cy = o[1] + y;
    var out = '<circle cx="' + n(cx) + '" cy="' + n(cy) + '" r="' + n(r) +
      '" class="' + (cls || "headf") + '"/>';
    if (face != null) {
      var a = face * Math.PI / 180;
      var bl = (cls || "headf").indexOf("-x") > 0 ? "body-x"
        : (cls || "headf").indexOf("-a") > 0 ? "body-a" : "body";
      out += '<path class="' + bl + '" style="stroke-width:2.6" d="M' +
        n(cx + Math.cos(a) * r * 0.75) + " " + n(cy + Math.sin(a) * r * 0.75) + "L" +
        n(cx + Math.cos(a) * (r + 5)) + " " + n(cy + Math.sin(a) * (r + 5)) + '"/>';
    }
    return out;
  }

  /* An arc, used for joint angles. Angles in radians, SVG convention:
     0 points right, -PI/2 points up. */
  function ARC(o, cx, cy, r, a1, a2, cls) {
    var x1 = o[0] + cx + r * Math.cos(a1), y1 = o[1] + cy + r * Math.sin(a1);
    var x2 = o[0] + cx + r * Math.cos(a2), y2 = o[1] + cy + r * Math.sin(a2);
    var big = Math.abs(a2 - a1) > Math.PI ? 1 : 0;
    return '<path class="' + (cls || "ln-d") + '" d="M' + n(x1) + " " + n(y1) +
      "A" + n(r) + " " + n(r) + " 0 " + big + " 1 " + n(x2) + " " + n(y2) + '"/>';
  }

  /* An arc with its measurement written on the outside of it. */
  function ANG(o, cx, cy, r, a1, a2, label, cls) {
    var m = (a1 + a2) / 2;
    return ARC(o, cx, cy, r, a1, a2, cls || "ln-d") +
      T(o[0] + cx + Math.cos(m) * (r + 15), o[1] + cy + Math.sin(m) * (r + 15) + 3,
        label, cls === "ln-x" ? "t-x" : "t-sm");
  }

  /* A dimension line: one stroke, an arrowhead at each end, and a label
     offset off the line so it never sits on top of it. */
  function DIM(o, x1, y1, x2, y2, label, dx, dy, cls) {
    var c = cls || "ln-d";
    var a = Math.atan2(y2 - y1, x2 - x1);
    var X1 = o[0] + x1, Y1 = o[1] + y1, X2 = o[0] + x2, Y2 = o[1] + y2;
    var out = L(X1, Y1, X2, Y2, c) + head(X2, Y2, a, c) + head(X1, Y1, a + Math.PI, c);
    if (label) out += T((X1 + X2) / 2 + (dx || 0), (Y1 + Y2) / 2 + (dy || -6), label,
      c === "ln-x" ? "t-x" : "t-sm");
    return out;
  }

  /* Verdict marks. A posture diagram that only labels the wrong version
     makes the reader hunt for which one is which. */
  function XM(o, x, y, s) {
    s = s || 7;
    var X = o[0] + x, Y = o[1] + y;
    return PATH("M" + n(X - s) + " " + n(Y - s) + "L" + n(X + s) + " " + n(Y + s), "ln-x") +
      PATH("M" + n(X + s) + " " + n(Y - s) + "L" + n(X - s) + " " + n(Y + s), "ln-x");
  }

  function OKM(o, x, y, s) {
    s = s || 7;
    var X = o[0] + x, Y = o[1] + y;
    return PATH("M" + n(X - s) + " " + n(Y) + "L" + n(X - s * 0.2) + " " + n(Y + s * 0.8) +
      "L" + n(X + s) + " " + n(Y - s * 0.9), "ln-a");
  }

  /* A panel: the bordered sub-frame the comparison diagrams are built from,
     with its own title and verdict strip. */
  function PANEL(x, y, w, h, title, kind) {
    var cls = kind === "ok" ? "box-a" : kind === "bad" ? "box" : "box";
    var out = BOX(x, y, w, h, "", cls, null, 8);
    if (kind === "bad") out += '<rect x="' + n(x) + '" y="' + n(y) + '" width="' + n(w) +
      '" height="3" class="fill-x"/>';
    if (title) out += T(x + w / 2, y + 19, title, kind === "bad" ? "t-x" : "t-title");
    return out;
  }

  /* A seated figure in side view, facing right, from a joint table. Every
     seated posture in the course is this function with different joints. */
  function SEAT(o, J, cls, hcls) {
    var b = cls || "body";
    var out = LIMB(o, [J.hand, J.elbow, J.shoulder], b);
    out += LIMB(o, J.spine || [J.hip, J.shoulder, J.neck], b);
    out += LIMB(o, [J.hip, J.knee, J.ankle, J.toe], b);
    out += LIMB(o, [J.neck, [J.head[0], J.head[1] + (J.hr || 13)]], b);
    out += HEADF(o, J.head[0], J.head[1], J.hr || 13, hcls || "headf", J.face == null ? 0 : J.face);
    return out;
  }

  /* A chair in side view: seat pan, backrest, post, base. */
  function CHAIR(o, x, seatY, floorY, back) {
    var out = '<rect x="' + n(o[0] + x) + '" y="' + n(o[1] + seatY) +
      '" width="112" height="7" rx="3" class="prop"/>';
    if (back !== false) {
      out += PATH("M" + n(o[0] + x + 6) + " " + n(o[1] + seatY) + "L" +
        n(o[0] + x - 6) + " " + n(o[1] + seatY - 84), "prop-ln");
    }
    out += PATH("M" + n(o[0] + x + 56) + " " + n(o[1] + seatY + 7) + "L" +
      n(o[0] + x + 56) + " " + n(o[1] + floorY - 6), "prop-ln");
    out += PATH("M" + n(o[0] + x + 24) + " " + n(o[1] + floorY - 4) + "L" +
      n(o[0] + x + 88) + " " + n(o[1] + floorY - 4), "prop-ln");
    return out;
  }

  /* ---------------- registry ---------------- */

  var D = {};

  /* ===== Databases ===== */

  D["sql-sublanguages"] = {
    vb: "0 0 640 250", cap: "SQL is one language made of five command families.", body: function () {
      var items = [
        ["DDL", "Data Definition", "CREATE · ALTER · DROP · TRUNCATE"],
        ["DML", "Data Manipulation", "INSERT · UPDATE · DELETE · MERGE"],
        ["DQL", "Data Query", "SELECT"],
        ["DCL", "Data Control", "GRANT · REVOKE"],
        ["TCL", "Transaction Control", "COMMIT · ROLLBACK · SAVEPOINT"]
      ];
      var o = BOX(238, 12, 164, 40, "SQL", "box-a", "one language", 10);
      items.forEach(function (it, i) {
        var x = 12 + i * 124, y = 108;
        o += AR(320, 52, x + 56, y - 6, i === 2 ? "ln-a" : "ln-d");
        o += BOX(x, y, 112, 86, "", "box");
        o += T(x + 56, y + 24, it[0], "t-title");
        o += T(x + 56, y + 41, it[1], "t-sm");
        o += T(x + 56, y + 66, it[2].split(" · ")[0], "t-mono");
        o += T(x + 56, y + 79, it[2].split(" · ").slice(1).join(" "), "t-sm");
      });
      o += DOTS(20, 214, 40, 2, 15);
      return o;
    }
  };

  D["joins"] = {
    vb: "0 0 640 200", cap: "The four joins, as set operations on two tables.", body: function () {
      var kinds = [["INNER JOIN", "both"], ["LEFT JOIN", "left"], ["RIGHT JOIN", "right"], ["FULL JOIN", "all"]];
      var o = "";
      kinds.forEach(function (k, i) {
        var cx = 88 + i * 155, cy = 84;
        o += T(cx, 26, k[0], "t-title");
        var lx = cx - 22, rx = cx + 22, r = 36;
        // shaded region
        if (k[1] === "both") {
          o += '<defs><clipPath id="cp' + i + '"><circle cx="' + lx + '" cy="' + cy + '" r="' + r + '"/></clipPath></defs>';
          o += '<circle cx="' + rx + '" cy="' + cy + '" r="' + r + '" class="fill-a" clip-path="url(#cp' + i + ')" opacity=".55"/>';
        } else if (k[1] === "left") {
          o += '<circle cx="' + lx + '" cy="' + cy + '" r="' + r + '" class="fill-a" opacity=".45"/>';
        } else if (k[1] === "right") {
          o += '<circle cx="' + rx + '" cy="' + cy + '" r="' + r + '" class="fill-a" opacity=".45"/>';
        } else {
          o += '<circle cx="' + lx + '" cy="' + cy + '" r="' + r + '" class="fill-a" opacity=".45"/>';
          o += '<circle cx="' + rx + '" cy="' + cy + '" r="' + r + '" class="fill-a" opacity=".45"/>';
        }
        o += CIRC(lx, cy, r, "ln") + CIRC(rx, cy, r, "ln");
        o += T(lx - 12, cy + 4, "A", "t-title") + T(rx + 12, cy + 4, "B", "t-title");
        o += T(cx, 158, i === 0 ? "matching rows only" : i === 1 ? "all of A + matches" : i === 2 ? "all of B + matches" : "everything, nulls filled", "t-sm");
      });
      return o;
    }
  };

  D["btree"] = {
    vb: "0 0 640 230", cap: "A B-tree index: three hops find any row in millions.", body: function () {
      var o = BOX(258, 14, 124, 32, "50 · 100", "box-a", null, 6);
      var mids = [["10 · 30", 44], ["60 · 80", 258], ["120 · 160", 472]];
      mids.forEach(function (m) {
        o += BOX(m[1], 92, 124, 30, m[0], "box", null, 6);
        o += AR(320, 46, m[1] + 62, 88, "ln-d");
      });
      var leaves = [["1..9", 14], ["11..29", 130], ["51..59", 246], ["61..79", 362], ["101..119", 478], ["161..", 566]];
      leaves.forEach(function (lf, i) {
        o += BOX(lf[1], 162, 62, 28, lf[0], "box", null, 5);
        var parent = i < 2 ? 106 : i < 4 ? 320 : 534;
        o += AR(parent, 122, lf[1] + 31, 158, "ln-d");
      });
      o += T(320, 214, "leaf pages are linked, so range scans walk sideways", "t-sm");
      o += L(14, 205, 626, 205, "ln-d");
      return o;
    }
  };

  D["acid"] = {
    vb: "0 0 640 190", cap: "The four guarantees a transactional database promises.", body: function () {
      var a = [["A", "Atomicity", "all or nothing"], ["C", "Consistency", "rules never broken"],
      ["I", "Isolation", "as if alone"], ["D", "Durability", "survives a crash"]];
      var o = "";
      a.forEach(function (it, i) {
        var x = 14 + i * 156;
        o += BOX(x, 30, 140, 108, "", i === 0 ? "box-a" : "box", null, 10);
        o += '<text x="' + (x + 70) + '" y="70" class="t-title" text-anchor="middle" style="font-size:26px;font-weight:700">' + it[0] + "</text>";
        o += T(x + 70, 96, it[1], "t-title");
        o += T(x + 70, 114, it[2], "t-sm");
      });
      o += T(320, 168, "lose any one and your data is quietly wrong", "t-sm");
      return o;
    }
  };

  D["normalization"] = {
    vb: "0 0 640 220", cap: "Normalising splits repeating data into referenced tables.", body: function () {
      var o = T(120, 20, "Unnormalised", "t-title");
      o += BOX(20, 32, 200, 96, "", "box");
      ["order | items | cust_name", "1 | pen,pad | A. Rao", "2 | pen | B. Shah"].forEach(function (r, i) {
        o += T(120, 54 + i * 22, r, "t-mono");
      });
      o += AR(232, 80, 288, 80, "ln-a");
      o += T(470, 20, "3rd Normal Form", "t-title");
      o += BOX(300, 32, 150, 60, "", "box-a");
      o += T(375, 52, "orders", "t-title") + T(375, 70, "id | cust_id", "t-mono");
      o += BOX(470, 32, 150, 60, "", "box-a");
      o += T(545, 52, "customers", "t-title") + T(545, 70, "id | name", "t-mono");
      o += BOX(300, 110, 150, 60, "", "box-a");
      o += T(375, 130, "order_items", "t-title") + T(375, 148, "order_id | sku", "t-mono");
      o += AR(450, 62, 468, 62, "ln-d") + AR(375, 92, 375, 108, "ln-d");
      o += T(320, 200, "one fact, stored in exactly one place", "t-sm");
      return o;
    }
  };

  D["index-scan"] = {
    vb: "0 0 640 180", cap: "With an index the engine jumps; without one it reads everything.", body: function () {
      var o = T(160, 22, "Full table scan", "t-title");
      var i;
      for (i = 0; i < 14; i++) o += BOX(24 + i * 19, 40, 15, 46, "", "box", null, 3);
      o += T(160, 106, "reads 14 pages — O(n)", "t-sm");
      o += T(480, 22, "Index seek", "t-title");
      for (i = 0; i < 14; i++) o += BOX(344 + i * 19, 40, 15, 46, "", i === 9 ? "box-a" : "box", null, 3);
      o += AR(515, 24, 515, 36, "ln-a");
      o += T(480, 106, "reads 3 pages — O(log n)", "t-sm");
      o += DOTS(24, 140, 34, 2, 18);
      return o;
    }
  };

  D["cap"] = {
    vb: "0 0 640 230", cap: "Under a network partition you must choose: consistency or availability.", body: function () {
      var o = "";
      var pts = [[320, 40, "C", "Consistency"], [172, 178, "A", "Availability"], [468, 178, "P", "Partition tolerance"]];
      o += PATH("M320 40L172 178L468 178Z", "ln-d");
      pts.forEach(function (p, i) {
        o += CIRC(p[0], p[1], 30, i === 2 ? "box-a" : "box");
        o += '<text x="' + p[0] + '" y="' + (p[1] + 6) + '" class="t-title" text-anchor="middle" style="font-size:18px">' + p[2] + "</text>";
        o += T(p[0], p[1] + 50, p[3], "t-sm");
      });
      o += T(246, 112, "CP", "t-title") + T(394, 112, "AP", "t-title") + T(320, 196, "CA — only without a network", "t-sm");
      return o;
    }
  };

  /* ===== ML core ===== */

  D["ml-paradigms"] = {
    vb: "0 0 640 210", cap: "Four ways a model can be told what 'right' looks like.", body: function () {
      var a = [["Supervised", "labelled data", "spam / not spam"],
      ["Unsupervised", "no labels", "find the groups"],
      ["Self-supervised", "labels from data itself", "predict next token"],
      ["Reinforcement", "reward signal", "learn by trying"]];
      var o = "";
      a.forEach(function (it, i) {
        var x = 12 + i * 156;
        o += BOX(x, 24, 142, 112, "", i === 0 ? "box-a" : "box", null, 10);
        o += T(x + 71, 50, it[0], "t-title");
        o += T(x + 71, 74, it[1], "t-sm");
        o += L(x + 26, 88, x + 116, 88, "ln-d");
        o += T(x + 71, 110, it[2], "t-mono");
      });
      o += DOTS(20, 168, 41, 2, 15);
      return o;
    }
  };

  D["overfitting"] = {
    vb: "0 0 640 210", cap: "Underfit, good fit, overfit — the same points, three models.", body: function () {
      var labels = ["Underfitting", "Good fit", "Overfitting"];
      var curves = ["M20 118L180 92", "M20 130C60 60 140 130 180 66", "M20 132C40 40 55 140 78 70C96 118 116 40 134 106C150 140 168 52 180 74"];
      var pts = [[34, 122], [56, 100], [76, 112], [96, 84], [118, 96], [140, 70], [162, 82]];
      var o = "";
      labels.forEach(function (lb, i) {
        var ox = 12 + i * 210;
        o += '<g transform="translate(' + ox + ',10)">';
        o += T(100, 16, lb, "t-title");
        o += AXES(16, 34, 176, 108, "", "");
        o += PATH(curves[i].replace(/([ML])(\d+)/g, function (m, c, v) { return c + v; }), i === 1 ? "ln-a" : "ln-b");
        pts.forEach(function (p) { o += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="3.4" class="dotgrid"/>'; });
        o += T(100, 176, i === 0 ? "too simple, misses signal" : i === 1 ? "captures the trend" : "memorises the noise", "t-sm");
        o += "</g>";
      });
      return o;
    }
  };

  D["bias-variance"] = {
    vb: "0 0 640 220", cap: "Total error is a U: the sweet spot sits between the two curves.", body: function () {
      var o = AXES(70, 24, 500, 140, "model complexity", "error");
      o += PATH("M70 60C170 130 300 158 570 162", "ln-b");
      o += PATH("M70 162C300 158 430 120 570 40", "ln-a");
      o += PATH("M70 62C190 140 260 122 340 118C430 114 500 84 570 36", "ln");
      o += T(140, 52, "bias²", "t-sm", "start") + T(500, 60, "variance", "t-sm", "start");
      o += T(346, 100, "total error", "t-title");
      o += L(340, 118, 340, 164, "ln-d");
      o += '<circle cx="340" cy="118" r="4.5" class="fill-c"/>';
      o += T(340, 182, "sweet spot", "t-sm");
      o += DOTS(72, 198, 34, 1, 15);
      return o;
    }
  };

  D["train-split"] = {
    vb: "0 0 640 170", cap: "Split once, honestly: the test set is opened at the very end.", body: function () {
      var o = T(320, 22, "Full dataset — 100%", "t-title");
      o += BOX(30, 34, 580, 34, "", "box", null, 8);
      var segs = [["Train  70%", 30, 406, "box-a"], ["Val 15%", 436, 87, "box-b"], ["Test 15%", 523, 87, "box"]];
      segs.forEach(function (s) {
        o += BOX(s[1], 78, s[2], 44, s[0], s[3], null, 8);
      });
      o += T(233, 140, "fit the weights", "t-sm");
      o += T(479, 140, "tune hyper-params", "t-sm");
      o += T(566, 140, "final score", "t-sm");
      o += AR(320, 68, 320, 74, "ln-d");
      return o;
    }
  };

  D["confusion-matrix"] = {
    vb: "0 0 640 250", cap: "Every classification metric is a ratio drawn from these four cells.", body: function () {
      var o = T(320, 20, "Predicted", "t-title");
      o += T(238, 42, "Positive", "t-sm") + T(402, 42, "Negative", "t-sm");
      o += '<text x="44" y="112" class="t-title" text-anchor="middle" transform="rotate(-90 44 112)">Actual</text>';
      o += T(96, 84, "Positive", "t-sm", "end") + T(96, 148, "Negative", "t-sm", "end");
      o += BOX(160, 54, 156, 60, "TP", "box-a", "correctly caught", 8);
      o += BOX(324, 54, 156, 60, "FN", "box", "missed (type II)", 8);
      o += BOX(160, 118, 156, 60, "FP", "box", "false alarm (type I)", 8);
      o += BOX(324, 118, 156, 60, "TN", "box-a", "correctly ignored", 8);
      o += T(320, 210, "Precision = TP / (TP + FP)      Recall = TP / (TP + FN)", "t-mono");
      o += T(320, 230, "Accuracy = (TP + TN) / everything", "t-mono");
      return o;
    }
  };

  D["gradient-descent"] = {
    vb: "0 0 640 220", cap: "Gradient descent: step downhill, proportional to the slope.", body: function () {
      var o = AXES(60, 20, 520, 150, "parameter value", "loss");
      o += PATH("M70 40C170 210 420 210 566 44", "ln");
      var steps = [[96, 74], [150, 130], [214, 164], [284, 176], [340, 174]];
      var i;
      for (i = 0; i < steps.length; i++) {
        o += '<circle cx="' + steps[i][0] + '" cy="' + steps[i][1] + '" r="4.6" class="fill-a"/>';
        if (i) o += AR(steps[i - 1][0] + 5, steps[i - 1][1] + 4, steps[i][0] - 5, steps[i][1] - 3, "ln-a");
      }
      o += T(96, 62, "start", "t-sm");
      o += '<circle cx="318" cy="178" r="5" class="fill-c"/>';
      o += T(360, 196, "minimum", "t-sm");
      o += T(500, 92, "big slope → big step", "t-sm");
      o += DOTS(64, 202, 35, 1, 15);
      return o;
    }
  };

  D["kmeans"] = {
    vb: "0 0 640 220", cap: "K-means: assign points to the nearest centroid, move the centroid, repeat.", body: function () {
      var clusters = [[140, 90, "box-a"], [330, 150, "box-b"], [500, 80, "box"]];
      var o = "";
      clusters.forEach(function (c, ci) {
        var cls = ci === 0 ? "fill-a" : ci === 1 ? "fill-b" : "fill-c";
        var i;
        for (i = 0; i < 9; i++) {
          var ang = i * 0.7 + ci, rad = 18 + (i % 3) * 13;
          o += '<circle cx="' + n(c[0] + Math.cos(ang) * rad) + '" cy="' + n(c[1] + Math.sin(ang) * rad) + '" r="3.6" class="' + cls + '" opacity=".55"/>';
        }
        o += '<path class="' + cls + '" d="M' + (c[0] - 7) + " " + c[1] + "l7-8 7 8-7 8Z" + '"/>';
        o += CIRC(c[0], c[1], 52, "ln-d");
        o += T(c[0], c[1] + 70, "cluster " + (ci + 1), "t-sm");
      });
      o += T(320, 26, "k = 3", "t-title");
      o += T(320, 206, "diamonds are centroids — the mean of their members", "t-sm");
      return o;
    }
  };

  D["decision-tree"] = {
    vb: "0 0 640 220", cap: "A decision tree is a sequence of yes/no questions ending in a prediction.", body: function () {
      var o = BOX(248, 12, 144, 34, "age < 30 ?", "box-a", null, 8);
      o += AR(300, 46, 190, 78, "ln-d") + T(228, 66, "yes", "t-sm");
      o += AR(340, 46, 450, 78, "ln-d") + T(412, 66, "no", "t-sm");
      o += BOX(120, 80, 140, 34, "income > 50k ?", "box", null, 8);
      o += BOX(380, 80, 140, 34, "owns car ?", "box", null, 8);
      var leaves = [[40, "approve"], [180, "reject"], [312, "approve"], [452, "reject"]];
      leaves.forEach(function (lf, i) {
        o += BOX(lf[0], 150, 120, 32, lf[1], "box-b", null, 16);
        var px = i < 2 ? 190 : 450;
        o += AR(px, 114, lf[0] + 60, 146, "ln-d");
      });
      o += T(320, 206, "depth is the tuning knob: too deep and it memorises", "t-sm");
      return o;
    }
  };

  D["ensemble"] = {
    vb: "0 0 640 210", cap: "Bagging trains in parallel and votes; boosting trains in sequence on mistakes.", body: function () {
      var o = T(160, 20, "Bagging (parallel)", "t-title");
      var i;
      for (i = 0; i < 3; i++) {
        o += BOX(40 + i * 84, 40, 68, 34, "tree " + (i + 1), "box", null, 6);
        o += AR(74 + i * 84, 74, 160, 104, "ln-d");
      }
      o += BOX(96, 108, 128, 32, "average / vote", "box-a", null, 8);
      o += T(160, 168, "reduces variance", "t-sm");
      o += L(320, 24, 320, 180, "ln-d");
      o += T(480, 20, "Boosting (sequential)", "t-title");
      for (i = 0; i < 3; i++) {
        o += BOX(368 + i * 84, 60, 68, 34, "tree " + (i + 1), i === 2 ? "box-a" : "box", null, 6);
        if (i) o += AR(352 + i * 84, 77, 366 + i * 84, 77, "ln-a");
      }
      o += T(480, 118, "each tree fixes the previous one's errors", "t-sm");
      o += T(480, 168, "reduces bias", "t-sm");
      return o;
    }
  };

  D["pca"] = {
    vb: "0 0 640 210", cap: "PCA rotates the axes onto the directions of greatest variance.", body: function () {
      var o = AXES(70, 20, 220, 150, "x₁", "x₂");
      var i;
      for (i = 0; i < 22; i++) {
        var t = i / 21, jx = (i % 5) * 4 - 8, jy = ((i * 7) % 9) * 3 - 12;
        o += '<circle cx="' + n(90 + t * 180 + jx) + '" cy="' + n(158 - t * 116 + jy) + '" r="3.4" class="dotgrid"/>';
      }
      o += PATH("M84 160L280 34", "ln-a") + T(250, 62, "PC1", "t-sm", "start");
      o += PATH("M150 60L214 132", "ln-b") + T(200, 66, "PC2", "t-sm", "start");
      o += AR(300, 96, 350, 96, "ln");
      o += T(500, 20, "after projection", "t-title");
      o += L(380, 120, 610, 120, "ln");
      for (i = 0; i < 22; i++) {
        o += '<circle cx="' + n(392 + i * 9.6) + '" cy="' + n(120 + (((i * 5) % 7) - 3) * 1.6) + '" r="3.4" class="fill-a" opacity=".7"/>';
      }
      o += T(495, 152, "2 dimensions → 1, most variance kept", "t-sm");
      return o;
    }
  };

  D["roc"] = {
    vb: "0 0 640 230", cap: "ROC sweeps every threshold; AUC is the area beneath the curve.", body: function () {
      var o = AXES(120, 20, 320, 160, "False positive rate", "True positive rate");
      o += PATH("M120 180L440 20", "ln-d");
      o += PATH("M120 180C160 70 250 34 440 20", "ln-a");
      o += '<path class="fill-a" opacity=".14" d="M120 180C160 70 250 34 440 20L440 180Z"/>';
      o += T(300, 120, "AUC", "t-title");
      o += T(268, 146, "random guessing", "t-sm");
      o += T(230, 52, "better model", "t-sm", "start");
      o += T(480, 96, "AUC 0.5 = coin flip", "t-sm", "start");
      o += T(480, 116, "AUC 1.0 = perfect", "t-sm", "start");
      o += DOTS(122, 206, 22, 1, 15);
      return o;
    }
  };

  /* ===== Deep learning ===== */

  D["neural-net"] = {
    vb: "0 0 640 250", cap: "A feed-forward network: weighted sums, an activation, repeat.", body: function () {
      var layers = [[4, 90, "input"], [5, 250, "hidden"], [5, 400, "hidden"], [2, 550, "output"]];
      var pos = layers.map(function (l) {
        var arr = [], i, gap = 34, top = 125 - (l[0] - 1) * gap / 2;
        for (i = 0; i < l[0]; i++) arr.push([l[1], top + i * gap]);
        return arr;
      });
      var o = "";
      var li, a, b;
      for (li = 0; li < pos.length - 1; li++) {
        for (a = 0; a < pos[li].length; a++) for (b = 0; b < pos[li + 1].length; b++) {
          o += L(pos[li][a][0] + 13, pos[li][a][1], pos[li + 1][b][0] - 13, pos[li + 1][b][1], "ln-d");
        }
      }
      pos.forEach(function (layer, li2) {
        layer.forEach(function (p) {
          o += CIRC(p[0], p[1], 13, li2 === 0 ? "box-a" : li2 === pos.length - 1 ? "box-b" : "box");
        });
        o += T(layers[li2][1], 226, layers[li2][2], "t-sm");
        o += T(layers[li2][1], 30, li2 === 0 ? "x" : li2 === pos.length - 1 ? "ŷ" : "h" + li2, "t-title");
      });
      o += AR(30, 125, 66, 125, "ln-a") + AR(574, 125, 610, 125, "ln-b");
      return o;
    }
  };

  D["perceptron"] = {
    vb: "0 0 640 220", cap: "One neuron: multiply, sum, add bias, squash.", body: function () {
      var xs = [[70, 56, "x₁", "w₁"], [70, 110, "x₂", "w₂"], [70, 164, "x₃", "w₃"]];
      var o = "";
      xs.forEach(function (x) {
        o += CIRC(x[0], x[1], 18, "box-a") + T(x[0], x[1] + 5, x[2], "t-title");
        o += AR(x[0] + 18, x[1], 250, 110, "ln-d");
        o += T((x[0] + 250) / 2, x[1] + (110 - x[1]) / 2 - 6, x[3], "t-mono");
      });
      o += CIRC(272, 110, 30, "box") + '<text x="272" y="118" class="t-title" text-anchor="middle" style="font-size:20px">Σ</text>';
      o += T(272, 62, "+ bias b", "t-sm");
      o += AR(302, 110, 358, 110, "ln");
      o += BOX(358, 82, 96, 56, "", "box-b", null, 10);
      o += PATH("M372 124L402 124L436 96", "ln-b");
      o += T(406, 152, "activation", "t-sm");
      o += AR(454, 110, 512, 110, "ln-b");
      o += CIRC(534, 110, 20, "box-b") + T(534, 116, "ŷ", "t-title");
      o += T(320, 200, "ŷ = f( w·x + b )", "t-mono");
      return o;
    }
  };

  D["activations"] = {
    vb: "0 0 640 200", cap: "The three activations you will meet first.", body: function () {
      var defs = [["ReLU", "M20 130L100 130L180 40"], ["Sigmoid", "M20 130C70 130 78 40 180 40"], ["Tanh", "M20 152C70 152 80 34 180 34"]];
      var o = "";
      defs.forEach(function (d, i) {
        var ox = 20 + i * 208;
        o += '<g transform="translate(' + ox + ',0)">';
        o += T(100, 22, d[0], "t-title");
        o += L(20, 130, 180, 130, "ln-d") + L(100, 30, 100, 165, "ln-d");
        o += PATH(d[1], "ln-a");
        o += T(100, 186, i === 0 ? "cheap, sparse, default choice" : i === 1 ? "0…1, used for probabilities" : "−1…1, zero-centred", "t-sm");
        o += "</g>";
      });
      return o;
    }
  };

  D["backprop"] = {
    vb: "0 0 640 200", cap: "Forward for the prediction, backward for the blame.", body: function () {
      var o = "";
      var boxes = [["input", 24], ["layer 1", 144], ["layer 2", 264], ["layer 3", 384], ["loss", 504]];
      boxes.forEach(function (b, i) {
        o += BOX(b[1], 62, 104, 46, b[0], i === 4 ? "box-b" : "box-a", null, 8);
        if (i) o += AR(b[1] - 16, 74, b[1] - 2, 74, "ln-a");
      });
      o += T(320, 40, "forward pass — compute the prediction", "t-title");
      for (var i = 4; i > 0; i--) {
        o += AR(24 + i * 120 + 2, 98, 24 + (i - 1) * 120 + 90, 98, "ln-b");
      }
      o += T(320, 148, "backward pass — chain rule sends the gradient back", "t-title");
      o += T(320, 176, "every weight learns how much it contributed to the error", "t-sm");
      return o;
    }
  };

  D["cnn"] = {
    vb: "0 0 640 210", cap: "A CNN narrows and deepens: pixels become features become a label.", body: function () {
      var o = BOX(20, 50, 76, 76, "", "box-a", null, 6);
      o += T(58, 142, "image", "t-sm") + T(58, 156, "224×224×3", "t-mono");
      o += AR(100, 88, 128, 88, "ln");
      var stages = [[130, 58, 60, 60, "conv", "112×112"], [212, 66, 48, 48, "pool", "56×56"], [278, 72, 38, 38, "conv", "28×28"], [332, 78, 28, 28, "pool", "14×14"]];
      stages.forEach(function (s) {
        o += BOX(s[0], s[1], s[2], s[3], "", "box", null, 5);
        o += T(s[0] + s[2] / 2, 142, s[4], "t-sm");
        o += T(s[0] + s[2] / 2, 156, s[5], "t-mono");
      });
      o += AR(366, 88, 398, 88, "ln");
      o += BOX(400, 62, 22, 52, "", "box-b", null, 4);
      o += T(411, 142, "flatten", "t-sm");
      o += AR(426, 88, 452, 88, "ln");
      o += BOX(456, 66, 60, 44, "dense", "box-b", null, 6);
      o += AR(520, 88, 546, 88, "ln-b");
      o += BOX(550, 66, 74, 44, "cat 0.94", "box-b", null, 6);
      o += DOTS(20, 184, 41, 1, 15);
      return o;
    }
  };

  D["convolution"] = {
    vb: "0 0 640 210", cap: "A kernel slides over the input; each position produces one output number.", body: function () {
      var o = T(96, 22, "input 5×5", "t-title");
      var i, j;
      for (i = 0; i < 5; i++) for (j = 0; j < 5; j++) {
        o += BOX(28 + j * 28, 36 + i * 28, 26, 26, "", (i < 3 && j < 3) ? "box-a" : "box", null, 3);
      }
      o += '<rect x="27" y="35" width="86" height="86" rx="4" class="ln-b" fill="none" stroke-width="2.2"/>';
      o += T(96, 194, "3×3 window", "t-sm");
      o += T(288, 22, "kernel", "t-title");
      for (i = 0; i < 3; i++) for (j = 0; j < 3; j++) {
        o += BOX(244 + j * 30, 60 + i * 30, 28, 28, ((i + j) % 2 ? "0" : "1"), "box-b", null, 3);
      }
      o += T(288, 194, "learned weights", "t-sm");
      o += AR(344, 104, 392, 104, "ln-a") + T(368, 92, "·  Σ", "t-mono");
      o += T(512, 22, "feature map 3×3", "t-title");
      for (i = 0; i < 3; i++) for (j = 0; j < 3; j++) {
        o += BOX(468 + j * 30, 60 + i * 30, 28, 28, "", (i === 0 && j === 0) ? "box-a" : "box", null, 3);
      }
      o += T(512, 194, "one number per window position", "t-sm");
      return o;
    }
  };

  D["rnn"] = {
    vb: "0 0 640 200", cap: "An RNN unrolled: the same cell, carrying state across time.", body: function () {
      var o = "";
      var xs = ["The", "cat", "sat", "on"];
      xs.forEach(function (w, i) {
        var x = 60 + i * 140;
        o += BOX(x, 74, 92, 48, "RNN", "box-a", null, 8);
        o += AR(x + 46, 158, x + 46, 126, "ln-d");
        o += T(x + 46, 176, w, "t-mono");
        o += AR(x + 46, 70, x + 46, 44, "ln-b");
        o += T(x + 46, 34, "h" + (i + 1), "t-sm");
        if (i < 3) { o += AR(x + 92, 98, x + 136, 98, "ln-a"); o += T(x + 114, 88, "state", "t-sm"); }
      });
      o += T(320, 18, "shared weights at every step", "t-title");
      return o;
    }
  };

  D["transformer"] = {
    vb: "0 0 640 300", cap: "A transformer block: attention mixes tokens, the MLP thinks about each one.", body: function () {
      var o = BOX(220, 254, 200, 32, "token embeddings + position", "box-a", null, 8);
      o += AR(320, 250, 320, 232, "ln");
      o += BOX(196, 176, 248, 54, "", "box", null, 10);
      o += T(320, 198, "Multi-Head Self-Attention", "t-title");
      o += T(320, 216, "every token looks at every other token", "t-sm");
      o += AR(320, 172, 320, 154, "ln");
      o += BOX(240, 118, 160, 34, "Add & LayerNorm", "box-b", null, 8);
      o += AR(320, 114, 320, 96, "ln");
      o += BOX(228, 44, 184, 50, "", "box", null, 10);
      o += T(320, 66, "Feed-Forward MLP", "t-title");
      o += T(320, 83, "same network on each position", "t-sm");
      o += AR(320, 40, 320, 22, "ln-a");
      o += T(320, 16, "to the next block  (× N)", "t-sm");
      o += PATH("M186 268C120 268 120 136 186 136", "ln-d") + AR(184, 136, 236, 136, "ln-d");
      o += PATH("M454 204C520 204 520 70 454 70", "ln-d");
      o += T(112, 200, "residual", "t-sm", "start");
      o += DOTS(500, 240, 8, 3, 14);
      return o;
    }
  };

  D["attention"] = {
    vb: "0 0 640 240", cap: "Attention: score every key against the query, then blend the values.", body: function () {
      var o = T(320, 20, 'query: "it"', "t-title");
      var toks = ["The", "animal", "did", "not", "cross", "the", "street"];
      var w = [0.05, 0.62, 0.03, 0.03, 0.08, 0.05, 0.14];
      toks.forEach(function (t, i) {
        var x = 26 + i * 88;
        o += BOX(x, 150, 76, 30, t, "box", null, 6);
        var h = 8 + w[i] * 100;
        o += '<rect x="' + (x + 20) + '" y="' + (140 - h) + '" width="36" height="' + h + '" rx="4" class="' + (w[i] > 0.3 ? "box-a" : "box") + '"/>';
        o += T(x + 38, 134 - h, w[i].toFixed(2), "t-mono");
        o += AR(x + 38, 194, x + 38, 184, "ln-d");
        o += T(x + 38, 210, "value", "t-sm");
      });
      o += T(320, 232, "softmax over scores = the weights above; output is their weighted sum", "t-sm");
      return o;
    }
  };

  D["embedding"] = {
    vb: "0 0 640 230", cap: "Embeddings place meaning in space: similar things land near each other.", body: function () {
      var o = AXES(70, 22, 500, 158, "dimension 1", "dimension 2");
      var groups = [
        [["king", 150, 60], ["queen", 196, 48], ["prince", 132, 92]],
        [["dog", 330, 132], ["cat", 372, 148], ["puppy", 316, 160]],
        [["python", 486, 62], ["java", 526, 82], ["rust", 466, 100]]
      ];
      groups.forEach(function (g, gi) {
        var cls = gi === 0 ? "fill-a" : gi === 1 ? "fill-b" : "fill-c";
        var cx = 0, cy = 0;
        g.forEach(function (p) {
          o += '<circle cx="' + p[1] + '" cy="' + p[2] + '" r="5" class="' + cls + '"/>';
          o += T(p[1], p[2] - 12, p[0], "t-sm");
          cx += p[1]; cy += p[2];
        });
        o += CIRC(cx / 3, cy / 3, 44, "ln-d");
      });
      o += T(320, 212, "distance ≈ semantic similarity — that is the whole trick", "t-sm");
      return o;
    }
  };

  D["tokenization"] = {
    vb: "0 0 640 190", cap: "Text becomes sub-word tokens, then integer ids.", body: function () {
      var o = T(320, 24, '"tokenisation is unbelievable"', "t-mono");
      o += AR(320, 34, 320, 54, "ln-d");
      var toks = [["token", 40], ["isation", 118], [" is", 216], [" un", 278], ["believ", 340], ["able", 432]];
      toks.forEach(function (t, i) {
        var w = t[0].length * 9 + 18;
        o += BOX(t[1], 62, w, 34, t[0], i % 2 ? "box" : "box-a", null, 6);
        o += T(t[1] + w / 2, 124, String(1024 + i * 317), "t-mono");
        o += AR(t[1] + w / 2, 100, t[1] + w / 2, 112, "ln-d");
      });
      o += T(320, 160, "6 tokens ≈ 4 words — this is what you are billed for", "t-sm");
      return o;
    }
  };

  D["rag"] = {
    vb: "0 0 640 250", cap: "RAG: retrieve the facts first, then let the model write.", body: function () {
      var o = BOX(20, 100, 96, 44, "question", "box-a", null, 8);
      o += AR(116, 122, 152, 122, "ln");
      o += BOX(152, 100, 96, 44, "embed", "box", null, 8);
      o += AR(248, 122, 284, 122, "ln");
      o += BOX(284, 92, 112, 60, "", "box-b", null, 8);
      o += T(340, 114, "vector DB", "t-title") + T(340, 132, "top-k search", "t-sm");
      o += BOX(284, 20, 112, 48, "your documents", "box", null, 8);
      o += AR(340, 68, 340, 88, "ln-d") + T(400, 78, "indexed once", "t-sm", "start");
      o += AR(396, 122, 434, 122, "ln-a") + T(415, 110, "chunks", "t-sm");
      o += BOX(434, 92, 96, 60, "", "box-a", null, 8);
      o += T(482, 114, "LLM", "t-title") + T(482, 132, "prompt + context", "t-sm");
      o += AR(530, 122, 566, 122, "ln-a");
      o += BOX(566, 100, 60, 44, "answer", "box-a", null, 8);
      o += T(320, 196, "the model is not retrained — the context window does the work", "t-sm");
      o += DOTS(20, 220, 41, 1, 15);
      return o;
    }
  };

  D["finetune"] = {
    vb: "0 0 640 200", cap: "Pre-train once at enormous cost; adapt cheaply, many times.", body: function () {
      var o = BOX(20, 60, 150, 70, "", "box", null, 10);
      o += T(95, 88, "Pre-training", "t-title") + T(95, 106, "trillions of tokens", "t-sm") + T(95, 120, "months, $M", "t-sm");
      o += AR(170, 95, 216, 95, "ln");
      o += BOX(216, 60, 150, 70, "", "box-a", null, 10);
      o += T(291, 88, "Base model", "t-title") + T(291, 108, "general knowledge", "t-sm");
      o += AR(366, 95, 412, 95, "ln-a");
      var t = [["Fine-tune", 26], ["LoRA adapter", 78], ["Prompt only", 130]];
      t.forEach(function (it) {
        o += BOX(412, it[1], 200, 40, "", "box-b", null, 8);
        o += T(512, it[1] + 18, it[0], "t-title");
        o += T(512, it[1] + 33, it[0] === "Fine-tune" ? "all weights, expensive" : it[0] === "LoRA adapter" ? "0.1% of weights, hours" : "no training at all", "t-sm");
      });
      o += T(320, 180, "cost falls by orders of magnitude as you move right", "t-sm");
      return o;
    }
  };

  D["llm-inference"] = {
    vb: "0 0 640 200", cap: "Prefill reads your prompt in parallel; decode emits one token at a time.", body: function () {
      var o = T(160, 22, "Prefill", "t-title");
      var i;
      for (i = 0; i < 6; i++) o += BOX(24 + i * 46, 40, 40, 34, "", "box-a", null, 5);
      o += T(160, 96, "whole prompt at once — compute bound", "t-sm");
      o += L(320, 20, 320, 176, "ln-d");
      o += T(490, 22, "Decode", "t-title");
      for (i = 0; i < 5; i++) {
        o += BOX(360 + i * 54, 40, 44, 34, "", i < 2 ? "box-b" : "box", null, 5);
        if (i) o += AR(352 + i * 54, 57, 358 + i * 54, 57, "ln-b");
      }
      o += T(490, 96, "one token per step — memory bound", "t-sm");
      o += BOX(180, 128, 280, 34, "KV cache — remembers past keys and values", "box", null, 8);
      o += T(320, 186, "this is why the first token is slow and the rest stream", "t-sm");
      return o;
    }
  };

  D["agent-loop"] = {
    vb: "0 0 640 250", cap: "An agent loop: think, act, observe — until the goal is met.", body: function () {
      var o = BOX(258, 14, 124, 40, "goal", "box-a", null, 20);
      o += AR(320, 54, 320, 76, "ln");
      o += BOX(238, 76, 164, 44, "LLM reasons", "box", null, 8);
      o += AR(402, 98, 468, 98, "ln-a") + T(435, 88, "tool call", "t-sm");
      o += BOX(468, 76, 150, 44, "tool / API", "box-b", null, 8);
      o += PATH("M543 120L543 168L320 168", "ln-b") + head(320, 168, Math.PI, "ln-b");
      o += T(455, 186, "observation", "t-sm");
      o += PATH("M238 98L150 98L150 168L308 168", "ln-d");
      o += BOX(258, 196, 124, 36, "answer", "box-a", null, 18);
      o += AR(320, 168, 320, 192, "ln-a");
      o += T(96, 140, "loop until done", "t-sm", "start");
      o += DOTS(20, 220, 12, 2, 14);
      return o;
    }
  };

  /* ===== Data engineering ===== */

  D["etl-elt"] = {
    vb: "0 0 640 210", cap: "ETL transforms before loading; ELT loads first and transforms in the warehouse.", body: function () {
      var o = T(320, 20, "ETL", "t-title");
      var e = [["Extract", 24], ["Transform", 174], ["Load", 324], ["Warehouse", 474]];
      e.forEach(function (b, i) {
        o += BOX(b[1], 34, 130, 40, b[0], i === 1 ? "box-a" : "box", null, 8);
        if (i) o += AR(b[1] - 18, 54, b[1] - 3, 54, "ln");
      });
      o += T(320, 108, "ELT", "t-title");
      var e2 = [["Extract", 24], ["Load", 174], ["Warehouse", 324], ["Transform", 474]];
      e2.forEach(function (b, i) {
        o += BOX(b[1], 122, 130, 40, b[0], i === 3 ? "box-a" : "box", null, 8);
        if (i) o += AR(b[1] - 18, 142, b[1] - 3, 142, "ln");
      });
      o += T(320, 190, "ELT wins when storage is cheap and the warehouse is fast", "t-sm");
      return o;
    }
  };

  D["batch-stream"] = {
    vb: "0 0 640 210", cap: "Batch waits and processes a block; streaming handles each event as it lands.", body: function () {
      var o = T(160, 22, "Batch", "t-title");
      var i;
      for (i = 0; i < 12; i++) o += '<circle cx="' + (30 + i * 22) + '" cy="52" r="4" class="dotgrid"/>';
      o += '<rect x="22" y="38" width="276" height="28" rx="6" class="ln-d" fill="none"/>';
      o += AR(160, 74, 160, 96, "ln");
      o += BOX(96, 96, 128, 34, "job at 02:00", "box-a", null, 8);
      o += T(160, 158, "high throughput, hours of latency", "t-sm");
      o += L(320, 20, 320, 180, "ln-d");
      o += T(480, 22, "Streaming", "t-title");
      for (i = 0; i < 6; i++) {
        o += '<circle cx="' + (356 + i * 44) + '" cy="52" r="4.5" class="fill-a"/>';
        o += AR(356 + i * 44, 62, 356 + i * 44, 92, "ln-d");
        o += BOX(340 + i * 44, 92, 32, 30, "", "box-b", null, 5);
      }
      o += T(480, 158, "seconds of latency, always on", "t-sm");
      return o;
    }
  };

  D["kafka"] = {
    vb: "0 0 640 230", cap: "Kafka: an append-only log, split into partitions, read at each consumer's own pace.", body: function () {
      var o = BOX(20, 96, 92, 40, "producer", "box-a", null, 8);
      o += AR(112, 116, 152, 116, "ln-a");
      o += T(320, 22, "topic: orders", "t-title");
      var p, i;
      for (p = 0; p < 3; p++) {
        var y = 40 + p * 60;
        o += T(146, y + 22, "P" + p, "t-sm", "end");
        for (i = 0; i < 8; i++) {
          o += BOX(152 + i * 42, y, 38, 32, "", i < 6 ? "box" : "box-b", null, 4);
        }
        o += L(152, y + 44, 488, y + 44, "ln-d");
      }
      o += T(320, 208, "offset →   older on the left, newest on the right", "t-sm");
      o += AR(492, 56, 528, 56, "ln") + BOX(528, 40, 96, 32, "consumer A", "box", null, 6);
      o += AR(492, 176, 528, 176, "ln") + BOX(528, 160, 96, 32, "consumer B", "box", null, 6);
      return o;
    }
  };

  D["warehouse-lake"] = {
    vb: "0 0 640 220", cap: "Warehouse, lake, lakehouse — three answers to 'where does the data live'.", body: function () {
      var a = [["Data Warehouse", "schema on write", "clean, modelled, SQL", "expensive per TB"],
      ["Data Lake", "schema on read", "raw files, any format", "cheap, easy to pollute"],
      ["Lakehouse", "table format on files", "lake price, warehouse rules", "Iceberg · Delta · Hudi"]];
      var o = "";
      a.forEach(function (it, i) {
        var x = 16 + i * 206;
        o += BOX(x, 26, 192, 146, "", i === 2 ? "box-a" : "box", null, 12);
        o += T(x + 96, 54, it[0], "t-title");
        o += L(x + 24, 66, x + 168, 66, "ln-d");
        o += T(x + 96, 88, it[1], "t-sm");
        o += T(x + 96, 116, it[2], "t-sm");
        o += T(x + 96, 148, it[3], "t-mono");
      });
      o += DOTS(20, 196, 41, 1, 15);
      return o;
    }
  };

  D["star-schema"] = {
    vb: "0 0 640 230", cap: "A star schema: one big fact table surrounded by small dimensions.", body: function () {
      var o = BOX(248, 88, 144, 58, "", "box-a", null, 8);
      o += T(320, 110, "fact_sales", "t-title") + T(320, 128, "millions of rows", "t-sm");
      var dims = [["dim_date", 60, 20], ["dim_product", 430, 20], ["dim_store", 60, 168], ["dim_customer", 430, 168]];
      dims.forEach(function (d) {
        o += BOX(d[1], d[2], 150, 44, d[0], "box", null, 8);
        var fx = d[1] < 300 ? 246 : 394, fy = d[2] < 100 ? 92 : 142;
        o += AR(d[1] + (d[1] < 300 ? 150 : 0), d[2] + 22, fx, fy, "ln-d");
      });
      o += T(320, 212, "joins are shallow and predictable — that is the point", "t-sm");
      return o;
    }
  };

  /* ===== MLOps ===== */

  D["mlops-loop"] = {
    vb: "0 0 640 260", cap: "The MLOps loop — models are never finished, only currently deployed.", body: function () {
      var steps = [["data", 320, 26], ["train", 502, 90], ["evaluate", 468, 200], ["deploy", 172, 200], ["monitor", 138, 90]];
      var o = "";
      steps.forEach(function (s, i) {
        o += BOX(s[1] - 64, s[2] - 20, 128, 42, s[0], i === 4 ? "box-b" : "box-a", null, 21);
      });
      o += AR(384, 40, 442, 74, "ln");
      o += AR(510, 132, 486, 178, "ln");
      o += AR(404, 210, 240, 210, "ln");
      o += AR(160, 178, 142, 132, "ln");
      o += AR(166, 66, 250, 36, "ln-b");
      o += T(320, 124, "production data", "t-title");
      o += T(320, 146, "always drifts away from training data", "t-sm");
      o += DOTS(292, 160, 5, 1, 14);
      return o;
    }
  };

  D["drift"] = {
    vb: "0 0 640 210", cap: "Drift: the world moves, the model does not.", body: function () {
      var o = AXES(70, 20, 500, 140, "time", "accuracy");
      o += PATH("M78 44C180 46 260 56 340 82C430 110 490 132 562 148", "ln-a");
      o += L(70, 118, 570, 118, "ln-d");
      o += T(596, 122, "SLA", "t-sm", "end");
      o += '<circle cx="386" cy="98" r="5" class="fill-c"/>';
      o += AR(386, 98, 386, 62, "ln-b");
      o += T(386, 52, "alert fires here", "t-sm");
      o += T(150, 176, "deployed", "t-sm") + T(500, 176, "retrained", "t-sm");
      o += L(94, 160, 94, 168, "ln-d") + L(546, 160, 546, 168, "ln-d");
      return o;
    }
  };

  /* ===== CS fundamentals ===== */

  D["bigo"] = {
    vb: "0 0 640 240", cap: "Growth rates, drawn to scale. The gaps only get worse.", body: function () {
      var o = AXES(74, 20, 480, 160, "input size n", "operations");
      var curves = [
        ["O(1)", "M78 176L550 174", "ln-d"],
        ["O(log n)", "M78 172C160 150 300 140 550 132", "ln"],
        ["O(n)", "M78 176L550 42", "ln-a"],
        ["O(n log n)", "M78 176C240 130 380 70 500 24", "ln-b"],
        ["O(n²)", "M78 176C220 172 300 120 356 24", "ln-b"]
      ];
      curves.forEach(function (c, i) {
        o += PATH(c[1], c[2]);
      });
      o += T(566, 176, "O(1)", "t-sm", "start") + T(566, 132, "O(log n)", "t-sm", "start");
      o += T(566, 44, "O(n)", "t-sm", "start") + T(506, 18, "O(n log n)", "t-sm", "start") + T(352, 16, "O(n²)", "t-sm", "start");
      o += T(320, 214, "at n = 1,000,000: log n ≈ 20 steps, n² ≈ a trillion", "t-sm");
      return o;
    }
  };

  D["array-list"] = {
    vb: "0 0 640 220", cap: "Arrays are contiguous; linked lists are scattered and chained.", body: function () {
      var o = T(320, 22, "Array — contiguous memory", "t-title");
      var i;
      for (i = 0; i < 7; i++) {
        o += BOX(96 + i * 64, 38, 60, 42, String([12, 7, 33, 4, 19, 8, 25][i]), "box-a", null, 4);
        o += T(126 + i * 64, 94, "[" + i + "]", "t-sm");
      }
      o += T(320, 116, "index → address arithmetic → O(1) access", "t-sm");
      o += T(320, 148, "Linked list — nodes anywhere, joined by pointers", "t-title");
      for (i = 0; i < 4; i++) {
        var x = 106 + i * 116;
        o += BOX(x, 164, 76, 38, "", "box", null, 6);
        o += L(x + 52, 164, x + 52, 202, "ln");
        o += T(x + 26, 188, String([12, 7, 33, 4][i]), "t-title");
        if (i < 3) o += AR(x + 76, 183, x + 112, 183, "ln-b");
        else o += T(x + 64, 188, "∅", "t-title");
      }
      return o;
    }
  };

  D["stack-queue"] = {
    vb: "0 0 640 220", cap: "Stack is last-in-first-out; queue is first-in-first-out.", body: function () {
      var o = T(160, 22, "Stack — LIFO", "t-title");
      var i;
      for (i = 0; i < 4; i++) {
        o += BOX(96, 150 - i * 34, 128, 30, String.fromCharCode(65 + i), i === 3 ? "box-a" : "box", null, 5);
      }
      o += AR(258, 52, 232, 52, "ln-a") + T(292, 44, "push", "t-sm");
      o += AR(232, 74, 262, 74, "ln-b") + T(292, 78, "pop", "t-sm");
      o += T(160, 196, "both at the same end", "t-sm");
      o += L(320, 20, 320, 200, "ln-d");
      o += T(490, 22, "Queue — FIFO", "t-title");
      for (i = 0; i < 4; i++) {
        o += BOX(388 + i * 56, 88, 52, 36, String.fromCharCode(65 + i), i === 0 ? "box-a" : "box", null, 5);
      }
      o += AR(626, 106, 616, 106, "ln-a") + T(600, 76, "enqueue", "t-sm");
      o += AR(384, 106, 366, 106, "ln-b") + T(380, 76, "dequeue", "t-sm");
      o += T(490, 196, "opposite ends", "t-sm");
      return o;
    }
  };

  D["hash-table"] = {
    vb: "0 0 640 230", cap: "A hash function turns a key into a bucket index. Collisions chain.", body: function () {
      var keys = [["\"apple\"", 44], ["\"kiwi\"", 92], ["\"plum\"", 140]];
      var o = "";
      keys.forEach(function (k) {
        o += BOX(20, k[1], 106, 34, k[0], "box-a", null, 6);
        o += AR(126, k[1] + 17, 176, k[1] + 17, "ln-d");
      });
      o += BOX(176, 62, 96, 106, "", "box", null, 8);
      o += T(224, 106, "hash()", "t-title") + T(224, 126, "mod 5", "t-sm");
      var i;
      for (i = 0; i < 5; i++) {
        o += BOX(360, 30 + i * 38, 60, 32, String(i), "box-b", null, 5);
        o += AR(272, 115, 356, 46 + i * 38, "ln-d");
      }
      o += BOX(438, 68, 84, 32, "apple", "box-a", null, 5);
      o += BOX(438, 144, 84, 32, "kiwi", "box-a", null, 5);
      o += BOX(530, 144, 84, 32, "plum", "box-a", null, 5);
      o += AR(420, 84, 434, 84, "ln") + AR(420, 160, 434, 160, "ln") + AR(522, 160, 526, 160, "ln-a");
      o += T(576, 128, "collision → chain", "t-sm");
      o += T(320, 212, "average O(1); worst case O(n) when everything collides", "t-sm");
      return o;
    }
  };

  D["binary-tree"] = {
    vb: "0 0 640 220", cap: "A binary search tree keeps smaller left, larger right.", body: function () {
      var nodes = [[320, 34, 50], [200, 96, 30], [440, 96, 70], [136, 158, 20], [264, 158, 40], [376, 158, 60], [504, 158, 80]];
      var o = "";
      o += AR(320, 50, 208, 84, "ln-d") + AR(320, 50, 432, 84, "ln-d");
      o += AR(200, 112, 144, 146, "ln-d") + AR(200, 112, 256, 146, "ln-d");
      o += AR(440, 112, 384, 146, "ln-d") + AR(440, 112, 496, 146, "ln-d");
      nodes.forEach(function (nd, i) {
        o += CIRC(nd[0], nd[1], 20, i === 0 ? "box-a" : "box");
        o += T(nd[0], nd[1] + 5, String(nd[2]), "t-title");
      });
      o += T(320, 202, "search 40: 50 → left → 30 → right → found. log₂ n hops.", "t-sm");
      return o;
    }
  };

  D["graph-traversal"] = {
    vb: "0 0 640 230", cap: "BFS explores level by level; DFS dives to the bottom first.", body: function () {
      function g(ox, order, cls) {
        var pos = [[100, 30], [50, 92], [150, 92], [20, 158], [80, 158], [180, 158]];
        var edges = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5]];
        var out = "";
        edges.forEach(function (e) { out += L(pos[e[0]][0], pos[e[0]][1], pos[e[1]][0], pos[e[1]][1], "ln-d"); });
        pos.forEach(function (p, i) {
          out += CIRC(p[0], p[1], 17, "box");
          out += T(p[0], p[1] + 5, String.fromCharCode(65 + i), "t-title");
          out += '<circle cx="' + (p[0] + 15) + '" cy="' + (p[1] - 14) + '" r="9" class="' + cls + '"/>';
          out += '<text x="' + (p[0] + 15) + '" y="' + (p[1] - 10) + '" text-anchor="middle" class="t-sm" style="font-weight:700">' + order[i] + "</text>";
        });
        return '<g transform="translate(' + ox + ',18)">' + out + "</g>";
      }
      var o = T(160, 22, "BFS — queue", "t-title") + g(60, [1, 2, 3, 4, 5, 6], "fill-a");
      o += L(320, 24, 320, 206, "ln-d");
      o += T(490, 22, "DFS — stack / recursion", "t-title") + g(390, [1, 2, 4, 5, 3, 6], "fill-b");
      o += T(320, 222, "same graph, different visit order", "t-sm");
      return o;
    }
  };

  D["recursion"] = {
    vb: "0 0 640 220", cap: "Each call waits on the next; the base case unwinds the stack.", body: function () {
      var o = "";
      var calls = ["fact(4)", "fact(3)", "fact(2)", "fact(1)"];
      calls.forEach(function (c, i) {
        o += BOX(60 + i * 30, 24 + i * 38, 220, 32, c, i === 3 ? "box-a" : "box", null, 6);
        if (i < 3) o += AR(80 + i * 30, 56 + i * 38, 92 + i * 30, 60 + i * 38, "ln");
      });
      o += T(150, 190, "calls go down…", "t-sm", "start");
      var rets = ["1", "2 × 1 = 2", "3 × 2 = 6", "4 × 6 = 24"];
      rets.forEach(function (r, i) {
        o += T(430, 158 - i * 38, r, "t-mono", "start");
        if (i < 3) o += AR(420, 150 - i * 38, 420, 130 - i * 38, "ln-b");
      });
      o += T(470, 190, "…values come back up", "t-sm", "start");
      return o;
    }
  };

  D["oop"] = {
    vb: "0 0 640 200", cap: "The four pillars, in one line each.", body: function () {
      var a = [["Encapsulation", "hide the state, expose behaviour"],
      ["Abstraction", "show the what, hide the how"],
      ["Inheritance", "a Dog is an Animal"],
      ["Polymorphism", "one call, many implementations"]];
      var o = "";
      a.forEach(function (it, i) {
        var x = 14 + i * 156;
        o += BOX(x, 34, 142, 104, "", i % 2 ? "box" : "box-a", null, 12);
        o += T(x + 71, 74, it[0], "t-title");
        o += L(x + 30, 86, x + 112, 86, "ln-d");
        o += T(x + 71, 108, it[1].split(",")[0], "t-sm");
        o += T(x + 71, 124, it[1].split(",")[1] || "", "t-sm");
      });
      o += T(320, 176, "object-oriented programming, compressed", "t-sm");
      return o;
    }
  };

  /* ===== Web ===== */

  D["request-response"] = {
    vb: "0 0 640 220", cap: "One HTTP request, end to end.", body: function () {
      var o = BOX(20, 84, 104, 52, "browser", "box-a", null, 10);
      o += BOX(180, 84, 104, 52, "DNS", "box", null, 10);
      o += BOX(340, 84, 104, 52, "server", "box-a", null, 10);
      o += BOX(500, 84, 120, 52, "database", "box-b", null, 10);
      o += AR(124, 100, 176, 100, "ln") + T(150, 90, "resolve", "t-sm");
      o += AR(176, 122, 128, 122, "ln-d") + T(150, 140, "IP", "t-sm");
      o += AR(124, 66, 392, 40, "ln-a") + T(258, 32, "GET /orders", "t-mono");
      o += AR(444, 100, 496, 100, "ln") + T(470, 90, "query", "t-sm");
      o += AR(496, 122, 448, 122, "ln-d") + T(470, 140, "rows", "t-sm");
      o += AR(392, 166, 124, 180, "ln-b") + T(258, 198, "200 OK + JSON", "t-mono");
      o += DOTS(20, 208, 41, 1, 15);
      return o;
    }
  };

  D["render-modes"] = {
    vb: "0 0 640 230", cap: "Where the HTML is built decides what the user sees first.", body: function () {
      var modes = [["CSR", "browser builds it", "blank → JS → content", "slow first paint"],
      ["SSR", "server builds it per request", "HTML → hydrate", "fresh, costs CPU"],
      ["SSG", "built at deploy time", "HTML from CDN", "fastest, may be stale"]];
      var o = "";
      modes.forEach(function (m, i) {
        var x = 16 + i * 206;
        o += BOX(x, 24, 192, 152, "", i === 1 ? "box-a" : "box", null, 12);
        o += T(x + 96, 54, m[0], "t-title");
        o += L(x + 24, 66, x + 168, 66, "ln-d");
        o += T(x + 96, 88, m[1], "t-sm");
        o += T(x + 96, 118, m[2], "t-mono");
        o += T(x + 96, 152, m[3], "t-sm");
      });
      o += T(320, 206, "most real apps mix all three, page by page", "t-sm");
      return o;
    }
  };

  D["event-loop"] = {
    vb: "0 0 640 250", cap: "JavaScript's event loop: one stack, two queues, endless turns.", body: function () {
      var o = BOX(40, 34, 150, 120, "", "box-a", null, 10);
      o += T(115, 56, "call stack", "t-title");
      var i;
      for (i = 0; i < 3; i++) o += BOX(58, 120 - i * 26, 114, 22, "", "box", null, 4);
      o += BOX(240, 34, 160, 52, "microtasks", "box-b", null, 8);
      o += T(320, 76, "promises — drained first", "t-sm");
      o += BOX(240, 106, 160, 52, "macrotasks", "box", null, 8);
      o += T(320, 148, "timers, I/O, events", "t-sm");
      o += AR(238, 60, 194, 84, "ln-a");
      o += AR(238, 132, 194, 108, "ln-d");
      o += CIRC(520, 96, 58, "ln-d");
      o += T(520, 92, "event loop", "t-title") + T(520, 110, "is the stack empty?", "t-sm");
      o += AR(402, 76, 462, 88, "ln") + AR(462, 116, 402, 128, "ln");
      o += T(320, 208, "one blocking function freezes the whole page — that is the trade", "t-sm");
      return o;
    }
  };

  D["dom-tree"] = {
    vb: "0 0 640 220", cap: "The DOM is your markup as a live tree of objects.", body: function () {
      var o = BOX(268, 20, 104, 32, "html", "box-a", null, 6);
      o += BOX(148, 82, 104, 32, "head", "box", null, 6);
      o += BOX(388, 82, 104, 32, "body", "box", null, 6);
      o += AR(300, 52, 220, 78, "ln-d") + AR(340, 52, 420, 78, "ln-d");
      o += BOX(84, 144, 104, 32, "title", "box-b", null, 6);
      o += BOX(316, 144, 104, 32, "header", "box-b", null, 6);
      o += BOX(444, 144, 104, 32, "main", "box-b", null, 6);
      o += AR(190, 114, 140, 140, "ln-d") + AR(424, 114, 372, 140, "ln-d") + AR(452, 114, 490, 140, "ln-d");
      o += T(320, 204, "change a node → the browser recalculates style, layout, paint", "t-sm");
      return o;
    }
  };

  D["flexbox"] = {
    vb: "0 0 640 200", cap: "Flexbox lays out in one direction; grid works in two.", body: function () {
      var o = T(160, 22, "Flex — one axis", "t-title");
      o += BOX(24, 36, 272, 68, "", "ln-d", null, 8);
      var i;
      for (i = 0; i < 4; i++) o += BOX(38 + i * 64, 50, 52, 40, "", "box-a", null, 5);
      o += AR(24, 118, 296, 118, "ln-b") + T(160, 140, "main axis", "t-sm");
      o += L(320, 20, 320, 176, "ln-d");
      o += T(480, 22, "Grid — two axes", "t-title");
      o += BOX(344, 36, 272, 100, "", "ln-d", null, 8);
      var r, c;
      for (r = 0; r < 2; r++) for (c = 0; c < 4; c++) o += BOX(358 + c * 64, 50 + r * 46, 52, 36, "", "box-b", null, 5);
      o += T(480, 158, "rows and columns declared up front", "t-sm");
      return o;
    }
  };

  /* ===== Backend / infra ===== */

  D["monolith-micro"] = {
    vb: "0 0 640 220", cap: "One deployable versus many — the trade is coupling for coordination.", body: function () {
      var o = T(160, 22, "Monolith", "t-title");
      o += BOX(50, 36, 220, 128, "", "box-a", null, 12);
      ["auth", "orders", "billing", "search"].forEach(function (m, i) {
        o += BOX(70, 52 + i * 28, 180, 22, m, "box", null, 4);
      });
      o += T(160, 190, "one deploy, one database, one failure domain", "t-sm");
      o += L(320, 20, 320, 200, "ln-d");
      o += T(480, 22, "Microservices", "t-title");
      var svc = [["auth", 356, 40], ["orders", 484, 40], ["billing", 356, 108], ["search", 484, 108]];
      svc.forEach(function (s) {
        o += BOX(s[1], s[2], 108, 48, s[0], "box-b", null, 8);
        o += BOX(s[1] + 20, s[2] + 52, 68, 14, "", "box", null, 3);
      });
      o += T(480, 190, "independent deploys, network between everything", "t-sm");
      return o;
    }
  };

  D["load-balancer"] = {
    vb: "0 0 640 220", cap: "A load balancer spreads traffic and quietly removes sick instances.", body: function () {
      var o = "";
      [40, 96, 152].forEach(function (y, i) {
        o += BOX(20, y - 16, 84, 32, "client", "box", null, 16);
        o += AR(104, y, 186, 96, "ln-d");
      });
      o += BOX(186, 66, 122, 60, "", "box-a", null, 10);
      o += T(247, 92, "load balancer", "t-title") + T(247, 110, "health checks", "t-sm");
      var srv = [["app-1", 30, "box-b"], ["app-2", 92, "box-b"], ["app-3", 154, "box"]];
      srv.forEach(function (s, i) {
        o += BOX(400, s[1], 120, 44, s[0], s[2], null, 8);
        o += AR(308, 96, 396, s[1] + 22, i === 2 ? "ln-d" : "ln-a");
      });
      o += T(578, 178, "unhealthy →", "t-sm", "end");
      o += T(320, 200, "round robin, least connections, or hashed by key", "t-sm");
      return o;
    }
  };

  D["caching"] = {
    vb: "0 0 640 200", cap: "Cache hit answers in microseconds; a miss pays full price.", body: function () {
      var o = BOX(20, 74, 96, 48, "request", "box-a", null, 8);
      o += AR(116, 98, 168, 98, "ln");
      o += BOX(168, 66, 118, 64, "", "box", null, 10);
      o += T(227, 92, "cache", "t-title") + T(227, 110, "in memory", "t-sm");
      o += AR(286, 82, 372, 46, "ln-a") + T(330, 34, "HIT — 1 ms", "t-sm");
      o += AR(286, 116, 372, 152, "ln-d") + T(330, 174, "MISS", "t-sm");
      o += BOX(372, 128, 118, 48, "database", "box-b", null, 8);
      o += AR(490, 152, 560, 116, "ln-d");
      o += BOX(400, 24, 210, 44, "response", "box-a", null, 8);
      o += PATH("M560 116L560 68", "ln-d");
      o += T(320, 194, "the hard parts are invalidation and stampedes", "t-sm");
      return o;
    }
  };

  D["message-queue"] = {
    vb: "0 0 640 190", cap: "A queue decouples producer speed from consumer speed.", body: function () {
      var o = BOX(20, 66, 100, 50, "producer", "box-a", null, 8);
      o += AR(120, 91, 164, 91, "ln-a");
      var i;
      for (i = 0; i < 6; i++) o += BOX(168 + i * 44, 70, 38, 42, "", i < 4 ? "box" : "box-b", null, 5);
      o += '<rect x="164" y="64" width="272" height="54" rx="8" class="ln-d" fill="none"/>';
      o += T(300, 42, "queue — durable buffer", "t-title");
      o += AR(438, 91, 486, 91, "ln");
      o += BOX(490, 42, 130, 44, "consumer 1", "box-a", null, 8);
      o += BOX(490, 98, 130, 44, "consumer 2", "box-a", null, 8);
      o += T(320, 164, "producer never waits; add consumers to drain faster", "t-sm");
      return o;
    }
  };

  D["docker-vm"] = {
    vb: "0 0 640 230", cap: "Containers share the host kernel; VMs each carry a full OS.", body: function () {
      function stack(ox, title, layers) {
        var out = T(ox + 130, 22, title, "t-title"), y = 34, i;
        for (i = 0; i < layers.length; i++) {
          out += BOX(ox + 20, y, 220, layers[i][1], layers[i][0], layers[i][2] || "box", null, 6);
          y += layers[i][1] + 6;
        }
        return out;
      }
      var o = stack(0, "Containers", [
        [" app A · app B · app C ", 34, "box-a"],
        ["container runtime", 30],
        ["host OS kernel", 34, "box-b"],
        ["hardware", 30]
      ]);
      o += L(320, 18, 320, 210, "ln-d");
      o += stack(320, "Virtual machines", [
        ["app A", 26, "box-a"], ["guest OS", 30], ["hypervisor", 30, "box-b"], ["host OS", 26], ["hardware", 26]
      ]);
      o += T(150, 214, "MBs, starts in ms", "t-sm") + T(470, 214, "GBs, starts in seconds", "t-sm");
      return o;
    }
  };

  D["kubernetes"] = {
    vb: "0 0 640 240", cap: "Kubernetes: you declare the desired state, the control loop makes it true.", body: function () {
      var o = BOX(20, 60, 132, 108, "", "box-b", null, 10);
      o += T(86, 84, "control plane", "t-title");
      ["api-server", "scheduler", "controller"].forEach(function (c, i) {
        o += BOX(34, 96 + i * 24, 104, 20, c, "box", null, 4);
      });
      o += AR(152, 114, 194, 114, "ln-a") + T(174, 100, "reconcile", "t-sm");
      o += '<rect x="196" y="34" width="424" height="164" rx="12" class="ln-d" fill="none"/>';
      o += T(408, 26, "worker nodes", "t-title");
      var nodes = [212, 350, 488];
      nodes.forEach(function (nx, i) {
        o += BOX(nx, 52, 116, 128, "", "box", null, 8);
        o += T(nx + 58, 72, "node " + (i + 1), "t-sm");
        var p;
        for (p = 0; p < 2; p++) o += BOX(nx + 12, 84 + p * 44, 92, 38, "pod", "box-a", null, 6);
      });
      o += T(320, 224, "a pod dies → the loop notices → a new pod appears", "t-sm");
      return o;
    }
  };

  D["cicd"] = {
    vb: "0 0 640 190", cap: "The pipeline every commit walks through.", body: function () {
      var steps = ["commit", "build", "test", "scan", "stage", "deploy"];
      var o = "";
      steps.forEach(function (s, i) {
        var x = 14 + i * 104;
        o += BOX(x, 62, 90, 46, s, i === steps.length - 1 ? "box-a" : "box", null, 8);
        if (i) o += AR(x - 13, 85, x - 2, 85, "ln-a");
        o += CIRC(x + 45, 128, 6, i < 5 ? "box-a" : "box-b");
      });
      o += T(320, 34, "green all the way, or nothing ships", "t-title");
      o += L(20, 152, 620, 152, "ln-d");
      o += T(320, 174, "fast feedback beats thorough feedback that arrives tomorrow", "t-sm");
      return o;
    }
  };

  /* ===== Networking / security ===== */

  D["osi"] = {
    vb: "0 0 640 300", cap: "Seven layers; in practice you live in 3, 4 and 7.", body: function () {
      var layers = [["7", "Application", "HTTP, DNS, SMTP"], ["6", "Presentation", "TLS, encoding"],
      ["5", "Session", "connections"], ["4", "Transport", "TCP, UDP"],
      ["3", "Network", "IP, routing"], ["2", "Data link", "Ethernet, MAC"],
      ["1", "Physical", "cable, radio"]];
      var o = "";
      layers.forEach(function (l, i) {
        var y = 16 + i * 39;
        var hot = ["7", "4", "3"].indexOf(l[0]) >= 0;
        o += BOX(90, y, 460, 33, "", hot ? "box-a" : "box", null, 6);
        o += T(118, y + 21, l[0], "t-title");
        o += T(220, y + 21, l[1], "t-title", "middle");
        o += T(430, y + 21, l[2], "t-mono", "middle");
      });
      o += AR(70, 20, 70, 268, "ln-d") + T(46, 150, "down", "t-sm");
      o += AR(570, 268, 570, 20, "ln-d") + T(596, 150, "up", "t-sm");
      o += T(320, 292, "data gains a header at each layer going down, loses it going up", "t-sm");
      return o;
    }
  };

  D["tcp-handshake"] = {
    vb: "0 0 640 230", cap: "Three messages before a single byte of your data moves.", body: function () {
      var o = BOX(60, 20, 120, 36, "client", "box-a", null, 8);
      o += BOX(460, 20, 120, 36, "server", "box-a", null, 8);
      o += L(120, 56, 120, 200, "ln-d") + L(520, 56, 520, 200, "ln-d");
      o += AR(124, 84, 516, 96, "ln-a") + T(320, 76, "SYN  seq=x", "t-mono");
      o += AR(516, 124, 124, 136, "ln-b") + T(320, 116, "SYN-ACK  seq=y ack=x+1", "t-mono");
      o += AR(124, 164, 516, 176, "ln-a") + T(320, 156, "ACK  ack=y+1", "t-mono");
      o += T(320, 212, "1 round trip of latency before any payload — why keep-alive matters", "t-sm");
      return o;
    }
  };

  D["dns"] = {
    vb: "0 0 640 200", cap: "A DNS lookup walks down the hierarchy, caching at every step.", body: function () {
      var o = BOX(20, 76, 96, 44, "browser", "box-a", null, 8);
      var hops = [["resolver", 140], ["root", 264], [".com TLD", 388], ["authoritative", 512]];
      hops.forEach(function (h, i) {
        o += BOX(h[1], 76, 108, 44, h[0], i === 3 ? "box-b" : "box", null, 8);
        var prev = i === 0 ? 116 : hops[i - 1][1] + 108;
        o += AR(prev, 88, h[1] - 4, 88, "ln-a");
        o += AR(h[1] - 4, 110, prev, 110, "ln-d");
      });
      o += T(320, 46, "who is example.com?", "t-title");
      o += T(320, 160, "the answer is an IP address, cached for its TTL", "t-sm");
      o += DOTS(20, 182, 41, 1, 15);
      return o;
    }
  };

  D["encryption"] = {
    vb: "0 0 640 230", cap: "Symmetric shares one secret; asymmetric splits it into a pair.", body: function () {
      var o = T(160, 22, "Symmetric", "t-title");
      o += BOX(24, 44, 96, 40, "Alice", "box-a", null, 8);
      o += BOX(200, 44, 96, 40, "Bob", "box-a", null, 8);
      o += AR(120, 64, 196, 64, "ln-a");
      o += BOX(96, 104, 128, 34, "same key", "box-b", null, 17);
      o += AR(96, 104, 72, 88, "ln-d") + AR(224, 104, 250, 88, "ln-d");
      o += T(160, 172, "fast; the problem is delivering the key", "t-sm");
      o += L(320, 20, 320, 200, "ln-d");
      o += T(480, 22, "Asymmetric", "t-title");
      o += BOX(348, 44, 96, 40, "Alice", "box-a", null, 8);
      o += BOX(524, 44, 96, 40, "Bob", "box-a", null, 8);
      o += AR(444, 64, 520, 64, "ln-a");
      o += BOX(342, 104, 118, 34, "Bob's public", "box", null, 17);
      o += BOX(486, 104, 118, 34, "Bob's private", "box-b", null, 17);
      o += T(480, 172, "encrypt with public, decrypt with private", "t-sm");
      return o;
    }
  };

  D["hashing"] = {
    vb: "0 0 640 200", cap: "Hashing is one-way; salting makes identical passwords hash differently.", body: function () {
      var o = BOX(20, 40, 130, 38, "password123", "box-a", null, 6);
      o += BOX(20, 106, 130, 38, "password123", "box-a", null, 6);
      o += BOX(180, 40, 76, 38, "+ salt A", "box-b", null, 6);
      o += BOX(180, 106, 76, 38, "+ salt B", "box-b", null, 6);
      o += AR(150, 59, 176, 59, "ln-d") + AR(150, 125, 176, 125, "ln-d");
      o += BOX(286, 56, 96, 72, "", "box", null, 10);
      o += T(334, 88, "bcrypt", "t-title") + T(334, 106, "slow by design", "t-sm");
      o += AR(256, 59, 282, 74, "ln") + AR(256, 125, 282, 110, "ln");
      o += BOX(414, 40, 206, 38, "$2b$12$K7f…9aQ", "box", null, 6);
      o += BOX(414, 106, 206, 38, "$2b$12$Xz3…1mT", "box", null, 6);
      o += AR(382, 74, 410, 59, "ln-a") + AR(382, 110, 410, 125, "ln-a");
      o += T(320, 178, "same input, different salts, unrelated digests — rainbow tables die here", "t-sm");
      return o;
    }
  };

  D["xss-injection"] = {
    vb: "0 0 640 210", cap: "Injection in one picture: data crossing into a code position.", body: function () {
      var o = BOX(20, 40, 150, 44, "user input", "box-a", null, 8);
      o += T(95, 108, "' OR 1=1 --", "t-mono");
      o += AR(170, 62, 218, 62, "ln-b");
      o += BOX(218, 30, 200, 64, "", "box", null, 8);
      o += T(318, 54, "string concatenation", "t-title") + T(318, 74, "SELECT … WHERE id = \" + x", "t-mono");
      o += AR(418, 62, 466, 62, "ln-b");
      o += BOX(466, 40, 154, 44, "every row leaks", "box-b", null, 8);
      o += L(20, 132, 620, 132, "ln-d");
      o += BOX(20, 148, 150, 44, "user input", "box-a", null, 8);
      o += AR(170, 170, 218, 170, "ln-a");
      o += BOX(218, 148, 200, 44, "parameterised query", "box-a", null, 8);
      o += AR(418, 170, 466, 170, "ln-a");
      o += BOX(466, 148, 154, 44, "treated as a value", "box-a", null, 8);
      o += T(320, 20, "the fix is never sanitising harder — it is never concatenating", "t-sm");
      return o;
    }
  };

  /* ===== Practice ===== */

  D["git-branch"] = {
    vb: "0 0 640 200", cap: "Branch, commit, merge — the shape of nearly every git history.", body: function () {
      var o = L(40, 130, 600, 130, "ln");
      var main = [70, 150, 300, 450, 560];
      main.forEach(function (x, i) {
        o += CIRC(x, 130, 9, "box-a");
      });
      o += T(40, 160, "main", "t-sm", "start");
      o += PATH("M150 130C200 130 200 62 250 62", "ln-b");
      o += L(250, 62, 420, 62, "ln-b");
      [250, 330, 410].forEach(function (x) { o += CIRC(x, 62, 9, "box-b"); });
      o += PATH("M410 62C462 62 400 130 450 130", "ln-b");
      o += T(330, 40, "feature/search", "t-sm");
      o += T(450, 162, "merge commit", "t-sm");
      o += T(320, 190, "commits are snapshots; branches are just moving labels", "t-sm");
      return o;
    }
  };

  D["test-pyramid"] = {
    vb: "0 0 640 220", cap: "Many fast tests at the bottom, few slow ones at the top.", body: function () {
      var o = PATH("M320 24L470 176L170 176Z", "ln-d");
      o += '<path class="fill-a" opacity=".16" d="M320 24L470 176L170 176Z"/>';
      o += L(232 + 10, 126, 418 - 10, 126, "ln-d") + L(266, 76, 374, 76, "ln-d");
      o += T(320, 60, "E2E", "t-title") + T(320, 106, "integration", "t-title") + T(320, 158, "unit", "t-title");
      o += T(520, 60, "slow, brittle, realistic", "t-sm", "start");
      o += T(520, 106, "some wiring, some speed", "t-sm", "start");
      o += T(520, 158, "milliseconds, thousands", "t-sm", "start");
      o += AR(120, 40, 120, 170, "ln-b") + T(96, 106, "count", "t-sm");
      o += T(320, 204, "invert this and your suite takes an hour and fails randomly", "t-sm");
      return o;
    }
  };

  D["solid"] = {
    vb: "0 0 640 200", cap: "SOLID, one line each.", body: function () {
      var a = [["S", "Single responsibility", "one reason to change"],
      ["O", "Open / closed", "extend, do not edit"],
      ["L", "Liskov substitution", "subtypes must fit"],
      ["I", "Interface segregation", "small interfaces"],
      ["D", "Dependency inversion", "depend on abstractions"]];
      var o = "";
      a.forEach(function (it, i) {
        var y = 16 + i * 35;
        o += BOX(60, y, 520, 30, "", i % 2 ? "box" : "box-a", null, 6);
        o += '<text x="84" y="' + (y + 21) + '" class="t-title" style="font-size:16px" text-anchor="middle">' + it[0] + "</text>";
        o += T(230, y + 20, it[1], "t-title");
        o += T(450, y + 20, it[2], "t-sm");
      });
      return o;
    }
  };

  /* ===== Maths ===== */

  D["normal-dist"] = {
    vb: "0 0 640 220", cap: "The normal distribution and the 68-95-99.7 rule.", body: function () {
      var o = AXES(70, 20, 500, 140, "", "");
      o += PATH("M80 160C200 160 240 40 320 40C400 40 440 160 560 160", "ln-a");
      o += '<path class="fill-a" opacity=".14" d="M80 160C200 160 240 40 320 40C400 40 440 160 560 160Z"/>';
      [[240, "−1σ"], [320, "μ"], [400, "+1σ"], [160, "−2σ"], [480, "+2σ"]].forEach(function (m) {
        o += L(m[0], 160, m[0], 168, "ln-d");
        o += T(m[0], 182, m[1], "t-sm");
      });
      o += L(240, 132, 400, 132, "ln-b") + T(320, 126, "68%", "t-sm");
      o += L(160, 152, 480, 152, "ln-b") + T(320, 148, "95%", "t-sm");
      o += T(320, 208, "most natural measurements pile up like this", "t-sm");
      return o;
    }
  };

  D["vector-matrix"] = {
    vb: "0 0 640 200", cap: "Scalar, vector, matrix, tensor — the same idea with more indices.", body: function () {
      var o = "";
      var labels = ["scalar", "vector", "matrix", "tensor"];
      var shapes = [[1, 1], [1, 4], [3, 3], [3, 3]];
      labels.forEach(function (lb, i) {
        var ox = 30 + i * 156;
        var r, c;
        for (r = 0; r < shapes[i][0]; r++) for (c = 0; c < shapes[i][1]; c++) {
          o += BOX(ox + c * 26, 50 + r * 26, 23, 23, "", i === 3 ? "box-b" : "box-a", null, 3);
        }
        if (i === 3) {
          for (r = 0; r < 3; r++) for (c = 0; c < 3; c++) {
            o += BOX(ox + 8 + c * 26, 42 + r * 26, 23, 23, "", "box", null, 3);
          }
        }
        o += T(ox + 40, 152, lb, "t-title");
        o += T(ox + 40, 170, ["0-D", "1-D", "2-D", "n-D"][i], "t-sm");
      });
      return o;
    }
  };

  D["bayes"] = {
    vb: "0 0 640 200", cap: "Bayes updates a prior belief with new evidence.", body: function () {
      var o = '<text x="320" y="70" class="t-title" text-anchor="middle" style="font-size:20px">P(A|B) = P(B|A) · P(A) / P(B)</text>';
      o += BOX(40, 106, 130, 56, "", "box-a", null, 8);
      o += T(105, 130, "P(A)", "t-title") + T(105, 148, "prior", "t-sm");
      o += BOX(196, 106, 130, 56, "", "box-b", null, 8);
      o += T(261, 130, "P(B|A)", "t-title") + T(261, 148, "likelihood", "t-sm");
      o += BOX(352, 106, 130, 56, "", "box", null, 8);
      o += T(417, 130, "P(B)", "t-title") + T(417, 148, "evidence", "t-sm");
      o += BOX(508, 106, 112, 56, "", "box-a", null, 8);
      o += T(564, 130, "P(A|B)", "t-title") + T(564, 148, "posterior", "t-sm");
      o += AR(482, 134, 504, 134, "ln-a");
      o += T(320, 34, "belief, revised", "t-sm");
      return o;
    }
  };

  D["gpu-cpu"] = {
    vb: "0 0 640 210", cap: "A CPU has few fast cores; a GPU has thousands of small ones.", body: function () {
      var o = T(160, 24, "CPU", "t-title");
      var i, r, c;
      for (i = 0; i < 4; i++) o += BOX(52 + (i % 2) * 118, 46 + Math.floor(i / 2) * 74, 100, 62, "core", "box-a", null, 8);
      o += T(160, 194, "latency optimised — branches, caches, control", "t-sm");
      o += L(320, 20, 320, 186, "ln-d");
      o += T(480, 24, "GPU", "t-title");
      for (r = 0; r < 8; r++) for (c = 0; c < 12; c++) {
        o += BOX(356 + c * 22, 46 + r * 17, 18, 13, "", "box-b", null, 2);
      }
      o += T(480, 194, "throughput optimised — same op on huge arrays", "t-sm");
      return o;
    }
  };

  D["blockchain"] = {
    vb: "0 0 640 190", cap: "Each block commits to the previous one's hash, so history is tamper-evident.", body: function () {
      var o = "";
      var i;
      for (i = 0; i < 4; i++) {
        var x = 24 + i * 156;
        o += BOX(x, 46, 132, 92, "", i === 3 ? "box-a" : "box", null, 8);
        o += T(x + 66, 70, "block " + (i + 1), "t-title");
        o += L(x + 14, 80, x + 118, 80, "ln-d");
        o += T(x + 66, 98, "prev: 0x" + ["0000", "8f3a", "b21c", "44de"][i], "t-mono");
        o += T(x + 66, 122, "hash: 0x" + ["8f3a", "b21c", "44de", "e907"][i], "t-mono");
        if (i < 3) o += AR(x + 132, 92, x + 152, 92, "ln-a");
      }
      o += T(320, 168, "change one byte in block 1 and every later hash breaks", "t-sm");
      return o;
    }
  };

  /* ===== CS & Systems Fundamentals ===== */

  D["stack-heap"] = {
    vb: "0 0 640 220", cap: "The Stack manages temporary execution frames; the Heap holds dynamically allocated objects.", body: function () {
      var o = T(160, 24, "Stack (Fast · LIFO Frames)", "t-title");
      o += BOX(40, 42, 240, 140, "", "box", null, 8);
      o += BOX(52, 54, 216, 54, "Frame: calculateTotal()", "box-a", null, 5);
      o += T(160, 94, "subtotal = 40  |  ptr: 0x8F40", "t-mono");
      o += BOX(52, 116, 216, 54, "Frame: main()", "box", null, 5);
      o += T(160, 156, "userId = 101  |  status = true", "t-mono");

      o += L(320, 20, 320, 195, "ln-d");

      o += T(480, 24, "Heap (Dynamic Allocation)", "t-title");
      o += BOX(360, 42, 240, 140, "", "box", null, 8);
      o += BOX(380, 56, 200, 52, "Object at 0x8F40", "box-b", null, 6);
      o += T(480, 94, '{ items: ["A", "B"], tax: 0.18 }', "t-mono");
      o += BOX(380, 120, 200, 48, "String at 0x3C10", "box", null, 6);
      o += T(480, 152, '"Ada Lovelace"', "t-mono");

      o += AR(246, 90, 376, 80, "ln-a");
      o += T(320, 208, "local variables live on the stack and point to objects in the heap", "t-sm");
      return o;
    }
  };

  D["pass-by-value"] = {
    vb: "0 0 640 210", cap: "Primitives pass a cloned copy; objects pass a reference pointer to the same shared memory.", body: function () {
      var o = T(160, 24, "Pass by Value (Primitive)", "t-title");
      o += BOX(30, 44, 110, 50, "x = 10", "box-a", "caller variable", 6);
      o += AR(140, 69, 180, 69, "ln-a");
      o += BOX(180, 44, 110, 50, "copy = 10", "box", "fn parameter", 6);
      o += BOX(180, 108, 110, 44, "copy = 20", "box-b", "reassigned", 6);
      o += T(160, 180, "x stays 10 (untouched)", "t-sm");

      o += L(320, 18, 320, 188, "ln-d");

      o += T(480, 24, "Pass by Reference / Pointer", "t-title");
      o += BOX(350, 44, 110, 50, "user: 0x9A", "box-a", "caller variable", 6);
      o += AR(460, 69, 500, 69, "ln-a");
      o += BOX(500, 44, 110, 50, "param: 0x9A", "box", "fn parameter", 6);
      o += BOX(420, 114, 150, 50, "{ name: 'Ada' }", "box-b", "shared heap object", 6);
      o += AR(405, 94, 460, 114, "ln-a");
      o += AR(555, 94, 500, 114, "ln-a");
      o += T(480, 180, "mutating param alters caller's user object", "t-sm");
      return o;
    }
  };

  D["binary-search"] = {
    vb: "0 0 640 220", cap: "Binary search eliminates half the remaining elements with every comparison: O(log n).", body: function () {
      var o = T(320, 24, "Target = 27 in sorted array", "t-title");
      var arr = [2, 5, 8, 12, 19, 27, 34, 45];
      var i;
      // Step 1
      o += T(60, 60, "Step 1:", "t-sm", "start");
      for (i = 0; i < 8; i++) {
        var x1 = 120 + i * 62;
        var cls = i === 3 ? "box-a" : i < 3 ? "box" : "box";
        o += BOX(x1, 46, 56, 30, String(arr[i]), cls, null, 4);
      }
      o += T(148, 90, "Low (0)", "t-sm") + T(336, 90, "Mid (3): 12 < 27", "t-title") + T(582, 90, "High (7)", "t-sm");
      o += AR(336, 42, 336, 46, "ln-a");

      // Step 2
      o += T(60, 140, "Step 2:", "t-sm", "start");
      for (i = 0; i < 8; i++) {
        var x2 = 120 + i * 62;
        var cls2 = i <= 3 ? "box" : i === 5 ? "box-b" : "box";
        var op = i <= 3 ? ' opacity="0.35"' : "";
        o += '<g' + op + '>' + BOX(x2, 126, 56, 30, String(arr[i]), cls2, null, 4) + '</g>';
      }
      o += T(396, 170, "Low (4)", "t-sm") + T(458, 170, "Mid (5): 27 == Found!", "t-title") + T(582, 170, "High (7)", "t-sm");
      o += AR(458, 122, 458, 126, "ln-a");

      o += T(320, 206, "1,000,000 items checked in at most 20 comparisons", "t-sm");
      return o;
    }
  };

  D["process-thread"] = {
    vb: "0 0 640 210", cap: "Processes have isolated memory spaces; threads within a process share the same heap and code.", body: function () {
      var o = BOX(24, 28, 280, 150, "", "box", null, 10);
      o += T(164, 48, "Process 1 (PID 4012)", "t-title");
      o += BOX(40, 60, 248, 36, "Shared Heap & Global State", "box-a", null, 4);
      o += BOX(40, 104, 118, 62, "Thread 1", "box-b", "stack A", 4);
      o += BOX(170, 104, 118, 62, "Thread 2", "box-b", "stack B", 4);

      o += BOX(336, 28, 280, 150, "", "box", null, 10);
      o += T(476, 48, "Process 2 (PID 4013)", "t-title");
      o += BOX(352, 60, 248, 36, "Isolated Heap & Memory", "box", null, 4);
      o += BOX(352, 104, 248, 62, "Thread 1", "box-b", "stack C", 4);

      o += L(304, 103, 336, 103, "ln-d");
      o += T(320, 96, "no shared RAM", "t-sm");
      o += T(320, 198, "threads crash together if heap is corrupted; processes stay isolated", "t-sm");
      return o;
    }
  };

  D["deadlock"] = {
    vb: "0 0 640 210", cap: "The circular wait: each process holds what the other needs, locking the system forever.", body: function () {
      var o = BOX(60, 75, 140, 56, "Process 1", "box-a", "running", 8);
      var oLockA = BOX(250, 20, 140, 48, "Lock A", "box", "resource", 6);
      var oLockB = BOX(250, 130, 140, 48, "Lock B", "box", "resource", 6);
      var oP2 = BOX(440, 75, 140, 56, "Process 2", "box-b", "running", 8);

      o += oLockA + oLockB + oP2;
      // Process 1 holds Lock A, wants Lock B
      o += AR(250, 44, 200, 75, "ln-a"); // P1 holds A
      o += T(170, 50, "holds", "t-sm");
      o += AR(200, 120, 250, 145, "ln-b"); // P1 requests B
      o += T(180, 150, "waits for", "t-sm");

      // Process 2 holds Lock B, wants Lock A
      o += AR(390, 154, 440, 120, "ln-b"); // P2 holds B
      o += T(470, 150, "holds", "t-sm");
      o += AR(440, 75, 390, 44, "ln-a"); // P2 requests A
      o += T(460, 50, "waits for", "t-sm");

      o += T(320, 198, "circular dependency: neither process can release until it acquires both", "t-sm");
      return o;
    }
  };

  D["concurrency"] = {
    vb: "0 0 640 220", cap: "Unsynchronised concurrent access: both threads read 5 and write 6, silently losing one increment.", body: function () {
      var o = BOX(250, 16, 140, 44, "Shared: count = 5", "box-a", null, 6);
      // Thread 1
      o += BOX(40, 80, 220, 90, "", "box", null, 8);
      o += T(150, 102, "Thread 1", "t-title");
      o += T(150, 124, "1. Reads count (5)", "t-sm");
      o += T(150, 146, "3. Writes count + 1 = 6", "t-mono");
      o += AR(270, 60, 220, 80, "ln-a");
      o += AR(180, 80, 260, 60, "ln-a");

      // Thread 2
      o += BOX(380, 80, 220, 90, "", "box-b", null, 8);
      o += T(490, 102, "Thread 2 (Overlapping)", "t-title");
      o += T(490, 124, "2. Reads count (5)", "t-sm");
      o += T(490, 146, "4. Overwrites with 6!", "t-mono");
      o += AR(370, 60, 420, 80, "ln-b");
      o += AR(460, 80, 380, 60, "ln-b");

      o += T(320, 202, "Race Condition: two increments happened, but counter only increased by 1", "t-sm");
      return o;
    }
  };

  D["memory-leak"] = {
    vb: "0 0 640 210", cap: "Forgotten references in global scope prevent the garbage collector from freeing dead objects.", body: function () {
      var o = BOX(40, 30, 160, 50, "Global Cache Array", "box-a", "root reference", 6);
      var oDead1 = BOX(280, 30, 140, 44, "Dead Request #1", "box-b", "retained", 5);
      var oDead2 = BOX(280, 84, 140, 44, "Dead Request #2", "box-b", "retained", 5);
      var oDead3 = BOX(280, 138, 140, 44, "Dead Request #3", "box-b", "retained", 5);
      var oGC = BOX(470, 75, 130, 60, "GC Sweeper", "box", "blocked", 8);

      o += oDead1 + oDead2 + oDead3 + oGC;
      o += AR(200, 55, 276, 52, "ln-a");
      o += AR(180, 80, 276, 106, "ln-a");
      o += AR(160, 80, 276, 160, "ln-a");

      o += L(460, 105, 424, 105, "ln-d");
      o += T(445, 96, "cannot free", "t-sm");
      o += T(320, 200, "RAM usage climbs indefinitely until out-of-memory crash (OOM)", "t-sm");
      return o;
    }
  };

  /* ===== Programming Basics — the language-agnostic track ===== */

  D["code-anatomy"] = {
    vb: "0 0 640 240", cap: "Every line of code is a stream of tokens of exactly five kinds.",
    body: function () {
      var toks = [
        ["let", "keyword", "box-b"],
        ["total", "name", "box-a"],
        ["=", "operator", "box"],
        ["price", "name", "box-a"],
        ["*", "operator", "box"],
        ["0.9", "value", "box-b"],
        [";", "punctuation", "box"]
      ];
      var gap = 12, x = 0, i, w = [];
      for (i = 0; i < toks.length; i++) {
        w[i] = Math.max(30, toks[i][0].length * 9 + 20);
        x += w[i] + gap;
      }
      var start = (640 - (x - gap)) / 2, o = "", cx = start;
      for (i = 0; i < toks.length; i++) {
        o += BOX(cx, 34, w[i], 40, "", toks[i][2], null, 6);
        o += T(cx + w[i] / 2, 59, toks[i][0], "t-mono");
        o += L(cx + w[i] / 2, 74, cx + w[i] / 2, 88, "ln-d");
        o += T(cx + w[i] / 2, 100, toks[i][1], "t-sm");
        cx += w[i] + gap;
      }
      o += T(320, 20, "let total = price * 0.9;", "t-sm");
      o += AR(320, 112, 320, 136, "ln-a");
      o += BOX(150, 140, 340, 34, "", "box", null, 8);
      o += T(320, 161, "the parser reads the tokens and checks the grammar", "t-sm");
      o += AR(320, 174, 320, 196, "ln-a");
      o += T(320, 210, "valid  ->  the machine runs it", "t-title");
      o += T(320, 226, "invalid  ->  SyntaxError, and nothing runs at all", "t-sm");
      o += DOTS(24, 40, 3, 4, 14);
      o += DOTS(592, 40, 3, 4, 14);
      return o;
    }
  };

  D["stmt-expr"] = {
    vb: "0 0 640 250", cap: "An expression collapses down to a value. A statement makes something happen.",
    body: function () {
      var o = T(160, 20, "EXPRESSION", "t-title") + T(160, 36, "asks a question, becomes a value", "t-sm");
      o += BOX(40, 48, 240, 34, "", "box-a", null, 6);
      o += T(160, 69, "(2 + 3) * price", "t-mono");
      o += AR(160, 82, 160, 106, "ln-a");
      o += BOX(70, 110, 180, 30, "", "box-a", null, 6);
      o += T(160, 130, "5 * price", "t-mono");
      o += AR(160, 140, 160, 164, "ln-a");
      o += BOX(100, 168, 120, 30, "", "box-a", null, 6);
      o += T(160, 188, "45.0", "t-mono");
      o += T(160, 220, "one value. That is all it ever was.", "t-sm");

      o += L(320, 14, 320, 236, "ln-d");

      o += T(480, 20, "STATEMENT", "t-title") + T(480, 36, "gives an order, changes the world", "t-sm");
      o += BOX(360, 48, 240, 34, "", "box-b", null, 6);
      o += T(480, 69, "total = (2 + 3) * price;", "t-mono");
      o += AR(480, 82, 480, 106, "ln-b");
      o += BOX(390, 110, 180, 44, "", "box", null, 6);
      o += T(480, 128, "memory changed", "t-title");
      o += T(480, 143, "total now holds 45.0", "t-sm");
      o += AR(480, 154, 480, 178, "ln-b");
      o += T(480, 190, "value produced: none", "t-mono");
      o += T(480, 220, "you run it for the effect, not the answer.", "t-sm");
      return o;
    }
  };

  D["source-to-run"] = {
    vb: "0 0 640 230", cap: "The same five stages sit between your text file and the processor, in every language.",
    body: function () {
      var steps = [
        ["Source", "the text you typed", "print(x)"],
        ["Tokens", "split into words", "print ( x )"],
        ["Tree", "grammar checked", "call -> print"],
        ["Instructions", "machine or bytecode", "0xB0 0x61"],
        ["CPU", "actually executed", "output"]
      ];
      var o = "", i;
      for (i = 0; i < steps.length; i++) {
        var x = 12 + i * 126;
        o += BOX(x, 46, 110, 84, "", i === 4 ? "box-a" : "box", null, 8);
        o += T(x + 55, 70, steps[i][0], "t-title");
        o += T(x + 55, 87, steps[i][1], "t-sm");
        o += T(x + 55, 112, steps[i][2], "t-mono");
        if (i < 4) o += AR(x + 110, 88, x + 124, 88, "ln-a");
      }
      o += T(320, 24, "one file of text, five transformations, one result", "t-sm");
      o += PATH("M68 138L68 168L320 168L320 182", "ln-d");
      o += PATH("M320 138L320 168", "ln-d");
      o += T(320, 196, "a SYNTAX error is caught here, before anything runs", "t-title");
      o += PATH("M572 138L572 206L320 206", "ln-d");
      o += T(320, 220, "a RUNTIME error only happens here, once it is already going", "t-sm");
      return o;
    }
  };

  D["var-binding"] = {
    vb: "0 0 640 250", cap: "A variable is a label tied to a value in memory — not a box the value lives inside.",
    body: function () {
      var o = T(320, 20, "score = 10        then later        score = 25", "t-mono");

      o += T(150, 52, "NAMES", "t-sm");
      o += BOX(80, 62, 140, 34, "", "box-a", null, 6);
      o += T(150, 83, "score", "t-mono");
      o += BOX(80, 116, 140, 34, "", "box-a", null, 6);
      o += T(150, 137, "score", "t-mono");
      o += T(150, 168, "the same name, rebound", "t-sm");

      o += T(470, 52, "MEMORY", "t-sm");
      o += BOX(400, 62, 140, 34, "", "box", null, 6);
      o += T(470, 83, "10", "t-mono");
      o += BOX(400, 116, 140, 34, "", "box-b", null, 6);
      o += T(470, 137, "25", "t-mono");

      o += AR(224, 79, 396, 79, "ln-d");
      o += T(310, 70, "before", "t-sm");
      o += AR(224, 133, 396, 133, "ln-a");
      o += T(310, 124, "after", "t-sm");

      o += BOX(60, 190, 520, 46, "", "box", null, 8);
      o += T(320, 210, "Assignment reads the right side first, then points the name at the answer.", "t-title");
      o += T(320, 227, "That is why  x = x + 1  is an instruction, not a contradiction.", "t-sm");
      return o;
    }
  };

  D["type-families"] = {
    vb: "0 0 640 250", cap: "Six families of value. Every language names them differently and means the same thing.",
    body: function () {
      var f = [
        ["Whole number", "int, integer, long", "42"],
        ["Decimal", "float, double, real", "3.14"],
        ["Text", "string, str, char[]", "\"hello\""],
        ["Yes / no", "bool, boolean", "true"],
        ["Nothing", "null, None, nil, undefined", "null"],
        ["Many things", "list, array, dict, map, set", "[1, 2, 3]"]
      ];
      var o = "", i;
      for (i = 0; i < 6; i++) {
        var x = 20 + (i % 3) * 205, y = 30 + Math.floor(i / 3) * 106;
        o += BOX(x, y, 190, 86, "", i === 5 ? "box-a" : "box", null, 8);
        o += T(x + 95, y + 24, f[i][0], "t-title");
        o += T(x + 95, y + 43, f[i][1], "t-sm");
        o += BOX(x + 40, y + 54, 110, 24, "", "box-b", null, 5);
        o += T(x + 95, y + 70, f[i][2], "t-mono");
      }
      o += T(320, 18, "the first five hold one thing; the sixth holds the other five", "t-sm");
      o += T(320, 244, "Learn these once and every new language is vocabulary, not concepts.", "t-sm");
      return o;
    }
  };

  D["static-dynamic"] = {
    vb: "0 0 640 230", cap: "Static and dynamic typing differ in one thing only: when the type is checked.",
    body: function () {
      var o = T(320, 18, "you write the bug   ->   you build   ->   you ship   ->   a user hits the line", "t-sm");
      o += L(40, 40, 600, 40, "ln");
      [70, 250, 400, 560].forEach(function (x) { o += CIRC(x, 40, 3.5, "fill-a"); });

      o += BOX(180, 58, 150, 44, "", "box-a", null, 7);
      o += T(255, 76, "STATIC", "t-title");
      o += T(255, 92, "Java, Go, Rust, TS", "t-sm");
      o += AR(255, 58, 250, 46, "ln-a");
      o += T(255, 118, "type error caught here", "t-sm");
      o += T(255, 133, "nothing ships broken", "t-sm");

      o += BOX(490, 58, 150, 44, "", "box-b", null, 7);
      o += T(565, 76, "DYNAMIC", "t-title");
      o += T(565, 92, "Python, JS, Ruby", "t-sm");
      o += AR(565, 58, 560, 46, "ln-b");
      o += T(565, 118, "type error caught here", "t-sm");
      o += T(565, 133, "at 3am, in production", "t-sm");

      o += BOX(30, 158, 580, 60, "", "box", null, 8);
      o += T(320, 178, "The trade", "t-title");
      o += T(320, 195, "Static: more typing up front, fewer surprises later, better editor help.", "t-sm");
      o += T(320, 210, "Dynamic: faster to write, shorter to read, and it trusts you completely.", "t-sm");
      return o;
    }
  };

  D["alias-copy"] = {
    vb: "0 0 640 250", cap: "b = a copies the label, not the thing. This one line causes more beginner bugs than any other.",
    body: function () {
      var o = T(160, 20, "b = a", "t-mono") + T(160, 36, "ALIAS — two names, one list", "t-sm");
      o += BOX(50, 52, 90, 30, "", "box-a", null, 6);
      o += T(95, 72, "a", "t-mono");
      o += BOX(50, 92, 90, 30, "", "box-a", null, 6);
      o += T(95, 112, "b", "t-mono");
      o += BOX(190, 68, 110, 38, "", "box-b", null, 6);
      o += T(245, 92, "[1, 2, 3]", "t-mono");
      o += AR(142, 70, 186, 82, "ln-a");
      o += AR(142, 110, 186, 96, "ln-a");
      o += T(175, 140, "a.append(4)", "t-mono");
      o += T(175, 156, "b changed too. It was never a copy.", "t-sm");

      o += L(320, 14, 320, 176, "ln-d");

      o += T(480, 20, "b = a.copy()", "t-mono") + T(480, 36, "COPY — two names, two lists", "t-sm");
      o += BOX(370, 52, 90, 30, "", "box-a", null, 6);
      o += T(415, 72, "a", "t-mono");
      o += BOX(370, 92, 90, 30, "", "box-a", null, 6);
      o += T(415, 112, "b", "t-mono");
      o += BOX(505, 48, 110, 32, "", "box-b", null, 6);
      o += T(560, 69, "[1, 2, 3]", "t-mono");
      o += BOX(505, 94, 110, 32, "", "box-b", null, 6);
      o += T(560, 115, "[1, 2, 3]", "t-mono");
      o += AR(462, 67, 501, 64, "ln-a");
      o += AR(462, 107, 501, 110, "ln-a");
      o += T(495, 140, "a.append(4)", "t-mono");
      o += T(495, 156, "b is untouched.", "t-sm");

      o += BOX(40, 190, 560, 48, "", "box", null, 8);
      o += T(320, 210, "Numbers, text and booleans do not have this problem — they cannot be changed in place.", "t-sm");
      o += T(320, 228, "Lists, dictionaries and objects do. Ask yourself: am I sharing this, or copying it?", "t-title");
      return o;
    }
  };

  D["precedence"] = {
    vb: "0 0 640 250", cap: "Operators do not run left to right. They run in a fixed order of precedence.",
    body: function () {
      var o = T(320, 20, "2 + 3 * 4 ** 2 > 30 and not done", "t-mono");
      var rows = [
        ["1", "**", "power", "4 ** 2  ->  16"],
        ["2", "* /  // %", "multiply, divide", "3 * 16  ->  48"],
        ["3", "+  -", "add, subtract", "2 + 48  ->  50"],
        ["4", "<  >  ==  !=", "compare", "50 > 30  ->  true"],
        ["5", "not", "negate", "not done  ->  false"],
        ["6", "and  then  or", "combine", "true and false  ->  false"]
      ];
      var o2 = "", i;
      for (i = 0; i < rows.length; i++) {
        var y = 44 + i * 32;
        o2 += BOX(60, y, 520, 26, "", i === 0 ? "box-a" : "box", null, 5);
        o2 += CIRC(78, y + 13, 9, "box-b");
        o2 += T(78, y + 17, rows[i][0], "t-sm");
        o2 += T(140, y + 17, rows[i][1], "t-mono");
        o2 += T(300, y + 17, rows[i][2], "t-sm");
        o2 += T(480, y + 17, rows[i][3], "t-mono");
      }
      o += o2;
      o += T(320, 244, "When you are unsure, put brackets in. Brackets always win, and they cost nothing.", "t-sm");
      return o;
    }
  };

  D["bool-logic"] = {
    vb: "0 0 640 240", cap: "Three operators, and the whole of decision-making is built out of them.",
    body: function () {
      function table(x, title, sub, rows) {
        var o = BOX(x, 30, 176, 150, "", "box", null, 8);
        o += T(x + 88, 52, title, "t-title");
        o += T(x + 88, 68, sub, "t-sm");
        o += L(x + 14, 78, x + 162, 78, "ln-d");
        rows.forEach(function (r, i) {
          var y = 96 + i * 22;
          o += T(x + 52, y, r[0], "t-mono");
          o += T(x + 108, y, "->", "t-sm");
          o += T(x + 140, y, r[1], "t-mono");
          if (r[1] === "true") o += CIRC(x + 26, y - 4, 4, "fill-a");
        });
        return o;
      }
      var o = table(16, "AND", "both must hold", [
        ["true  true", "true"], ["true  false", "false"],
        ["false true", "false"], ["false false", "false"]
      ]);
      o += table(232, "OR", "either will do", [
        ["true  true", "true"], ["true  false", "true"],
        ["false true", "true"], ["false false", "false"]
      ]);
      o += table(448, "NOT", "flips it", [
        ["true", "false"], ["false", "true"]
      ]);
      o += BOX(40, 192, 560, 40, "", "box-a", null, 8);
      o += T(320, 209, "Short-circuit: AND stops at the first false, OR stops at the first true.", "t-title");
      o += T(320, 225, "That is why  if user and user.name  is safe when user is missing.", "t-sm");
      return o;
    }
  };

  D["branch-flow"] = {
    vb: "0 0 640 250", cap: "if / else if / else — the program takes exactly one road and rejoins.",
    body: function () {
      var o = BOX(270, 12, 100, 26, "start", "box", null, 13);
      o += AR(320, 38, 320, 54, "ln");
      o += PATH("M320 54L392 84L320 114L248 84Z", "box-a");
      o += T(320, 82, "score >= 90", "t-mono");
      o += T(320, 96, "?", "t-sm");
      o += AR(392, 84, 470, 84, "ln-a");
      o += T(430, 76, "true", "t-sm");
      o += BOX(470, 68, 140, 32, "grade = A", "box-b", null, 6);
      o += AR(248, 84, 200, 84, "ln");
      o += T(224, 76, "false", "t-sm");

      o += PATH("M200 84L160 84L160 118", "ln");
      o += PATH("M160 118L232 148L160 178L88 148Z", "box-a");
      o += T(160, 146, "score >= 80", "t-mono");
      o += T(160, 160, "?", "t-sm");
      o += AR(232, 148, 300, 148, "ln-a");
      o += T(266, 140, "true", "t-sm");
      o += BOX(300, 132, 140, 32, "grade = B", "box-b", null, 6);
      o += AR(160, 178, 160, 200, "ln");
      o += T(190, 192, "everything else", "t-sm");
      o += BOX(90, 200, 140, 32, "grade = F", "box", null, 6);

      o += PATH("M540 100L540 222L230 222", "ln-d");
      o += PATH("M370 164L370 222", "ln-d");
      o += T(430, 240, "all roads rejoin here and the program carries on", "t-sm");
      return o;
    }
  };

  D["loop-anatomy"] = {
    vb: "0 0 640 250", cap: "Every loop is the same four moving parts. Lose one and it never stops.",
    body: function () {
      var cx = 250, cy = 132, r = 78;
      var o = BOX(150, 14, 200, 30, "set up  i = 0", "box", null, 6);
      o += AR(250, 44, 250, 54, "ln");
      o += CIRC(cx, cy, r, "ln-d");

      o += BOX(cx - 78, cy - 92, 156, 32, "", "box-a", null, 6);
      o += T(cx, cy - 78, "1. CHECK", "t-title");
      o += T(cx, cy - 66, "i < 5 ?", "t-mono");

      o += BOX(cx + 46, cy - 20, 150, 34, "", "box-b", null, 6);
      o += T(cx + 121, cy - 4, "2. RUN THE BODY", "t-title");
      o += T(cx + 121, cy + 9, "print(i)", "t-mono");

      o += BOX(cx - 78, cy + 62, 156, 32, "", "box-a", null, 6);
      o += T(cx, cy + 78, "3. STEP", "t-title");
      o += T(cx, cy + 90, "i = i + 1", "t-mono");

      o += AR(cx + 74, cy - 30, cx + 66, cy - 12, "ln-a");
      o += AR(cx + 60, cy + 40, cx + 30, cy + 60, "ln-a");
      o += AR(cx - 74, cy + 40, cx - 74, cy - 44, "ln-a");
      o += T(cx - 108, cy, "back to", "t-sm");
      o += T(cx - 108, cy + 13, "the check", "t-sm");

      o += AR(cx, cy - 92, cx + 4, cy - 100, "ln");
      o += PATH("M328 132L400 132L400 208", "ln-d");
      o += T(452, 128, "check says false", "t-sm");
      o += BOX(330, 210, 150, 30, "carry on below", "box", null, 6);

      o += BOX(505, 60, 126, 116, "", "box", null, 8);
      o += T(568, 82, "4. THE EXIT", "t-title");
      o += T(568, 102, "Something in the", "t-sm");
      o += T(568, 116, "body or the step", "t-sm");
      o += T(568, 130, "must eventually", "t-sm");
      o += T(568, 144, "make the check", "t-sm");
      o += T(568, 158, "false. Or forever.", "t-sm");
      return o;
    }
  };

  D["func-machine"] = {
    vb: "0 0 640 250", cap: "Define once, call many times. A function is a named machine with a slot in and a slot out.",
    body: function () {
      var o = T(320, 20, "DEFINING is writing the machine down. CALLING is switching it on.", "t-sm");
      o += BOX(20, 40, 160, 78, "", "box", null, 8);
      o += T(100, 62, "the definition", "t-sm");
      o += T(100, 82, "def area(w, h):", "t-mono");
      o += T(100, 98, "return w * h", "t-mono");
      o += AR(180, 79, 216, 100, "ln-d");
      o += T(210, 66, "runs nothing", "t-sm");

      o += BOX(230, 84, 180, 96, "", "box-a", null, 10);
      o += T(320, 110, "area", "t-title");
      o += T(320, 128, "w * h", "t-mono");
      o += T(320, 152, "the body — the only", "t-sm");
      o += T(320, 166, "part that does work", "t-sm");

      o += BOX(24, 150, 170, 60, "", "box-b", null, 7);
      o += T(109, 170, "arguments", "t-sm");
      o += T(109, 190, "area(3, 4)", "t-mono");
      o += AR(196, 178, 226, 150, "ln-a");
      o += T(210, 210, "in", "t-sm");

      o += BOX(446, 150, 170, 60, "", "box-b", null, 7);
      o += T(531, 170, "return value", "t-sm");
      o += T(531, 190, "12", "t-mono");
      o += AR(414, 150, 444, 178, "ln-a");
      o += T(432, 210, "out", "t-sm");

      o += BOX(446, 52, 170, 62, "", "box", null, 7);
      o += T(531, 72, "call it again", "t-sm");
      o += T(531, 90, "area(10, 2)  ->  20", "t-mono");
      o += T(531, 106, "same machine, new answer", "t-sm");
      o += AR(444, 96, 414, 106, "ln-d");
      o += T(320, 238, "One definition. Unlimited calls. That is the entire point of a function.", "t-sm");
      return o;
    }
  };

  D["scope-chain"] = {
    vb: "0 0 640 250", cap: "A name is looked up from the inside out, and stops at the first match.",
    body: function () {
      var o = BOX(30, 24, 580, 206, "", "box", null, 10);
      o += T(320, 44, "GLOBAL  —  the whole file", "t-title");
      o += T(120, 64, "rate = 0.2", "t-mono");

      o += BOX(70, 76, 500, 142, "", "box-a", null, 10);
      o += T(320, 96, "FUNCTION  checkout()", "t-title");
      o += T(150, 116, "total = 100", "t-mono");

      o += BOX(110, 128, 420, 78, "", "box-b", null, 10);
      o += T(320, 148, "BLOCK  inside the if", "t-title");
      o += T(200, 168, "discount = 5", "t-mono");
      o += T(320, 192, "can see: discount, total, rate", "t-sm");

      o += AR(400, 168, 400, 122, "ln-a");
      o += AR(400, 116, 400, 70, "ln-a");
      o += T(470, 146, "not here? look out", "t-sm");
      o += T(470, 94, "still not here? look out again", "t-sm");
      o += T(470, 60, "not there either? NameError", "t-sm");

      o += T(320, 244, "Outer code can never see inward. discount does not exist once the block ends.", "t-sm");
      return o;
    }
  };

  D["call-stack"] = {
    vb: "0 0 640 250", cap: "Calls stack up and unwind. The stack trace you get on a crash is a photograph of this pile.",
    body: function () {
      var frames = [
        ["main()", "line 20", "box"],
        ["checkout()", "line 12", "box"],
        ["total()", "line 7", "box"],
        ["price()", "line 3  <- it broke here", "box-a"]
      ];
      var o = T(150, 20, "the pile, while it runs", "t-sm");
      var i;
      for (i = 0; i < frames.length; i++) {
        var y = 180 - i * 40;
        o += BOX(40, y, 220, 34, "", frames[i][2], null, 6);
        o += T(110, y + 22, frames[i][0], "t-mono");
        o += T(216, y + 22, frames[i][1], "t-sm");
        if (i > 0) o += AR(276, y + 60, 276, y + 26, "ln-a");
      }
      o += T(300, 100, "pushed", "t-sm");
      o += T(300, 114, "on top", "t-sm");
      o += L(30, 222, 270, 222, "ln");
      o += T(150, 238, "bottom of the stack — where the program started", "t-sm");

      o += BOX(340, 34, 280, 180, "", "box", null, 8);
      o += T(480, 56, "what the crash prints", "t-title");
      o += T(360, 80, "Traceback (most recent call last):", "t-sm", "start");
      o += T(370, 100, "File app.py, line 20, in main", "t-mono", "start");
      o += T(370, 120, "File app.py, line 12, in checkout", "t-mono", "start");
      o += T(370, 140, "File app.py, line 7, in total", "t-mono", "start");
      o += T(370, 160, "File app.py, line 3, in price", "t-mono", "start");
      o += T(370, 182, "TypeError: unsupported operand", "t-mono", "start");
      o += T(480, 204, "read it bottom-up: the last line is the actual fault", "t-sm");
      return o;
    }
  };

  D["error-kinds"] = {
    vb: "0 0 640 240", cap: "Three kinds of wrong, and they fail at three different moments.",
    body: function () {
      var e = [
        ["SYNTAX", "you broke the grammar", "prnt(\"hi\"", "before it runs", "loud and instant"],
        ["RUNTIME", "a legal line that cannot be done", "10 / 0", "while it runs", "loud, halfway through"],
        ["LOGIC", "it runs perfectly and is wrong", "avg = total / (n + 1)", "never — it finishes", "silent, and expensive"]
      ];
      var o = "", i;
      for (i = 0; i < 3; i++) {
        var x = 16 + i * 206;
        o += BOX(x, 30, 192, 150, "", i === 2 ? "box-a" : "box", null, 8);
        o += T(x + 96, 54, e[i][0], "t-title");
        o += T(x + 96, 72, e[i][1], "t-sm");
        o += BOX(x + 20, 84, 152, 26, "", "box-b", null, 5);
        o += T(x + 96, 101, e[i][2], "t-mono");
        o += T(x + 96, 128, "fails: " + e[i][3], "t-sm");
        o += T(x + 96, 148, e[i][4], "t-sm");
        o += CIRC(x + 96, 166, 5, i === 2 ? "fill-b" : "fill-a");
      }
      o += T(320, 18, "the further right you go, the harder it is to find", "t-sm");
      o += AR(60, 200, 580, 200, "ln-d");
      o += T(320, 222, "Only the third kind needs a human. The first two tell you exactly where they are.", "t-title");
      return o;
    }
  };

  D["debug-loop"] = {
    vb: "0 0 640 250", cap: "Debugging is not staring at code. It is a loop, and it always terminates.",
    body: function () {
      var steps = [
        ["1", "REPRODUCE", "make it fail on demand"],
        ["2", "LOCATE", "narrow to a few lines"],
        ["3", "GUESS", "one testable sentence"],
        ["4", "CHECK", "print it, run it, look"],
        ["5", "FIX", "change one thing only"]
      ];
      var o = "", i;
      for (i = 0; i < 5; i++) {
        var x = 12 + i * 126;
        o += BOX(x, 60, 110, 92, "", i === 2 ? "box-a" : "box", null, 8);
        o += CIRC(x + 55, 82, 11, "box-b");
        o += T(x + 55, 86, steps[i][0], "t-sm");
        o += T(x + 55, 112, steps[i][1], "t-title");
        o += T(x + 55, 132, steps[i][2], "t-sm");
        if (i < 4) o += AR(x + 110, 106, x + 124, 106, "ln-a");
      }
      o += T(320, 34, "you are a detective, not a psychic", "t-title");
      o += PATH("M572 152L572 190L67 190L67 156", "ln-d");
      o += AR(67, 172, 67, 156, "ln-a");
      o += T(320, 206, "wrong guess? that is information. Go round again with one thing ruled out.", "t-sm");
      o += T(320, 232, "Never change two things at once — then you cannot tell which one worked.", "t-title");
      return o;
    }
  };

  D["data-shapes"] = {
    vb: "0 0 640 250", cap: "Four containers. Pick by the question you will ask, not by what is nearest to hand.",
    body: function () {
      var o = "";
      o += BOX(16, 30, 144, 130, "", "box-a", null, 8);
      o += T(88, 50, "LIST / ARRAY", "t-title");
      o += T(88, 66, "order matters", "t-sm");
      [0, 1, 2].forEach(function (i) {
        o += BOX(30 + i * 40, 80, 34, 30, "", "box", null, 5);
        o += T(47 + i * 40, 100, ["a", "b", "c"][i], "t-mono");
        o += T(47 + i * 40, 124, "[" + i + "]", "t-sm");
      });
      o += T(88, 146, "fast by position", "t-sm");

      o += BOX(176, 30, 144, 130, "", "box", null, 8);
      o += T(248, 50, "MAP / DICT", "t-title");
      o += T(248, 66, "look up by name", "t-sm");
      [["age", "30"], ["city", "Pune"]].forEach(function (kv, i) {
        o += BOX(190, 78 + i * 32, 56, 26, "", "box-b", null, 5);
        o += T(218, 96 + i * 32, kv[0], "t-mono");
        o += AR(248, 91 + i * 32, 262, 91 + i * 32, "ln-a");
        o += BOX(266, 78 + i * 32, 40, 26, "", "box", null, 5);
        o += T(286, 96 + i * 32, kv[1], "t-mono");
      });
      o += T(248, 150, "fast by key", "t-sm");

      o += BOX(336, 30, 144, 130, "", "box", null, 8);
      o += T(408, 50, "SET", "t-title");
      o += T(408, 66, "no duplicates, no order", "t-sm");
      o += CIRC(380, 104, 20, "box-b");
      o += T(380, 108, "a", "t-mono");
      o += CIRC(420, 92, 20, "box-b");
      o += T(420, 96, "b", "t-mono");
      o += CIRC(432, 128, 20, "box-b");
      o += T(432, 132, "c", "t-mono");
      o += T(408, 150, "fast for is-it-in-there", "t-sm");

      o += BOX(496, 30, 128, 130, "", "box", null, 8);
      o += T(560, 50, "TUPLE / RECORD", "t-title");
      o += T(560, 66, "fixed, never changes", "t-sm");
      o += BOX(510, 84, 100, 34, "", "box-b", null, 5);
      o += T(560, 106, "(18.5, 73.8)", "t-mono");
      o += T(560, 136, "a pair that belongs", "t-sm");
      o += T(560, 150, "together, permanently", "t-sm");

      o += BOX(30, 178, 580, 58, "", "box", null, 8);
      o += T(320, 198, "The question decides the container", "t-title");
      o += T(320, 216, "\"the third one\" -> list.   \"the one called X\" -> map.   \"have I seen this?\" -> set.", "t-sm");
      o += T(320, 231, "\"these values are one thing and must not change\" -> tuple.", "t-sm");
      return o;
    }
  };

  D["paradigms"] = {
    vb: "0 0 640 250", cap: "Four ways to say the same thing. Languages lean, they rarely forbid.",
    body: function () {
      var p = [
        ["IMPERATIVE", "step by step, in order", "for x in list:", "total += x", "C, Python, Go"],
        ["OBJECT-ORIENTED", "data and behaviour bundled", "cart.add(item)", "cart.total()", "Java, C#, Python"],
        ["FUNCTIONAL", "transform, never mutate", "sum(map(price, items))", "no variable changed", "Haskell, Elixir, JS"],
        ["DECLARATIVE", "state the goal, not the route", "SELECT SUM(price)", "the engine decides how", "SQL, HTML, CSS"]
      ];
      var o = "", i;
      for (i = 0; i < 4; i++) {
        var x = 16 + (i % 2) * 312, y = 26 + Math.floor(i / 2) * 104;
        o += BOX(x, y, 296, 88, "", i === 3 ? "box-a" : "box", null, 8);
        o += T(x + 148, y + 22, p[i][0], "t-title");
        o += T(x + 148, y + 38, p[i][1], "t-sm");
        o += T(x + 148, y + 58, p[i][2], "t-mono");
        o += T(x + 148, y + 72, p[i][3], "t-sm");
        o += BOX(x + 190, y + 4, 100, 16, "", "box-b", null, 4);
        o += T(x + 240, y + 16, p[i][4], "t-sm");
      }
      o += T(320, 16, "the same shopping cart, said four ways", "t-sm");
      o += BOX(60, 210, 520, 32, "", "box", null, 8);
      o += T(320, 231, "Nobody is pure. Real code mixes all four, usually inside one file.", "t-title");
      return o;
    }
  };

  D["dep-tree"] = {
    vb: "0 0 640 240", cap: "You install one package. You install everything it stands on.",
    body: function () {
      var o = BOX(250, 14, 140, 34, "your app", "box-a", null, 7);
      var lvl1 = [["requests", 60], ["pandas", 250], ["flask", 440]];
      lvl1.forEach(function (p) {
        o += BOX(p[1], 82, 140, 32, p[0], "box-b", null, 6);
        o += AR(320, 48, p[1] + 70, 78, "ln-a");
      });
      var lvl2 = [
        ["urllib3", 20], ["certifi", 168], ["numpy", 316], ["jinja2", 464]
      ];
      lvl2.forEach(function (p) {
        o += BOX(p[1], 148, 116, 28, p[0], "box", null, 6);
      });
      o += AR(110, 114, 70, 144, "ln-d");
      o += AR(140, 114, 218, 144, "ln-d");
      o += AR(310, 114, 366, 144, "ln-d");
      o += AR(500, 114, 520, 144, "ln-d");
      o += AR(240, 114, 226, 144, "ln-d");
      o += DOTS(30, 190, 38, 1, 15);
      o += T(320, 214, "and each of those has its own. This is why a project pins its versions in a file.", "t-sm");
      o += T(320, 232, "requirements.txt · package.json · go.mod · Cargo.toml — same idea, four names.", "t-sm");
      return o;
    }
  };

  D["sync-async"] = {
    vb: "0 0 640 240", cap: "Waiting is not working. Async is what a program does with the gaps.",
    body: function () {
      function bar(x, y, w, cls, label) {
        return BOX(x, y, w, 22, "", cls, null, 4) + T(x + w / 2, y + 15, label, "t-sm");
      }
      var o = T(60, 26, "BLOCKING — one after another", "t-title", "start");
      o += bar(60, 38, 60, "box-a", "ask A");
      o += bar(122, 38, 110, "box", "waiting…");
      o += bar(234, 38, 60, "box-a", "ask B");
      o += bar(296, 38, 110, "box", "waiting…");
      o += bar(408, 38, 60, "box-a", "ask C");
      o += bar(470, 38, 110, "box", "waiting…");
      o += T(60, 80, "total: 6 units, and 3 of them doing nothing at all", "t-sm", "start");

      o += T(60, 124, "ASYNC — start everything, collect as it lands", "t-title", "start");
      o += bar(60, 136, 60, "box-a", "ask A");
      o += bar(122, 136, 60, "box-a", "ask B");
      o += bar(184, 136, 60, "box-a", "ask C");
      o += bar(246, 136, 110, "box-b", "all three in flight");
      o += bar(358, 136, 70, "box", "A, B, C back");
      o += T(60, 178, "total: about 2 units. The waiting overlapped.", "t-sm", "start");

      o += L(40, 196, 600, 196, "ln-d");
      o += T(320, 216, "Async helps when you are WAITING — network, disk, database.", "t-title");
      o += T(320, 232, "It does nothing for maths. Four numbers still take four additions.", "t-sm");
      return o;
    }
  };

  D["pseudocode"] = {
    vb: "0 0 640 250", cap: "Decomposition: the problem is solved in English before a single line is typed.",
    body: function () {
      var o = BOX(20, 24, 180, 92, "", "box", null, 8);
      o += T(110, 46, "THE PROBLEM", "t-title");
      o += T(110, 68, "\"find the top 3", "t-sm");
      o += T(110, 82, "customers by", "t-sm");
      o += T(110, 96, "spend this month\"", "t-sm");
      o += AR(202, 70, 232, 70, "ln-a");

      o += BOX(236, 24, 210, 160, "", "box-a", null, 8);
      o += T(341, 46, "THE STEPS, IN ENGLISH", "t-title");
      ["1. read every order", "2. keep only this month", "3. add up spend per customer",
        "4. sort, biggest first", "5. take the first three", "6. print them"].forEach(function (s, i) {
          o += T(252, 70 + i * 19, s, "t-sm", "start");
        });
      o += AR(448, 100, 478, 100, "ln-a");

      o += BOX(482, 24, 142, 160, "", "box", null, 8);
      o += T(553, 46, "THE CODE", "t-title");
      ["orders = load()", "m = filter(orders)", "by_cust = group(m)", "ranked = sort(by_cust)",
        "top = ranked[:3]", "print(top)"].forEach(function (s, i) {
          o += T(553, 70 + i * 19, s, "t-mono");
        });

      o += BOX(60, 200, 520, 40, "", "box-b", null, 8);
      o += T(320, 219, "One English line becomes roughly one line of code — in any language.", "t-title");
      o += T(320, 234, "If you cannot write step 3 in English, no amount of syntax will save you.", "t-sm");
      return o;
    }
  };

  D["complexity-growth"] = {
    vb: "0 0 640 240", cap: "Why the nested loop is the line that kills you at scale.",
    body: function () {
      var o = AXES(60, 20, 320, 160, "input size ->", "work");
      o += PATH("M60 180L380 168", "ln-d");
      o += T(392, 168, "O(1) · O(log n)", "t-sm", "start");
      o += PATH("M60 180L380 96", "ln");
      o += T(392, 96, "O(n)", "t-sm", "start");
      o += PATH("M60 180C200 176 280 120 340 20", "ln-a");
      o += T(348, 30, "O(n squared)", "t-sm", "start");

      o += BOX(430, 24, 196, 152, "", "box", null, 8);
      o += T(528, 46, "10,000 items", "t-title");
      o += L(444, 56, 612, 56, "ln-d");
      [["O(1)", "1 step"], ["O(log n)", "14 steps"], ["O(n)", "10 thousand"],
      ["O(n log n)", "140 thousand"], ["O(n squared)", "100 million"]].forEach(function (r, i) {
        o += T(456, 78 + i * 20, r[0], "t-mono", "start");
        o += T(600, 78 + i * 20, r[1], "t-sm", "end");
      });
      o += T(320, 206, "A loop inside a loop over the same data is O(n squared).", "t-title");
      o += T(320, 224, "It is invisible on your 20 test rows and fatal on the real ten thousand.", "t-sm");
      return o;
    }
  };


  /* ===== Professional presence — posture, space and conduct ===== */

  /* The reference posture. Everything else in the track is measured
     against this one, so it is the only figure drawn at full size and the
     only one that carries its own legend. */
  D["sit-neutral"] = {
    vb: "0 0 640 330",
    cap: "The neutral seated posture. Every angle in it is a range rather than a number — and none of them survive an hour without you standing up.",
    body: function () {
      var o = [0, 0];
      var J = {
        hip: [160, 188], knee: [240, 188], ankle: [240, 280], toe: [274, 284],
        shoulder: [158, 100], neck: [160, 84], head: [163, 66], hr: 16,
        elbow: [152, 148], hand: [240, 141], face: 0
      };

      var out = L(24, 286, 440, 286, "floor");
      out += CHAIR(o, 150, 194, 286);

      /* desk, keyboard, screen */
      out += '<rect x="230" y="150" width="196" height="7" rx="2" class="prop"/>';
      out += PATH("M416 157L416 286", "prop-ln");
      out += '<rect x="232" y="142" width="56" height="8" rx="2" class="prop"/>';
      out += '<rect x="330" y="66" width="92" height="78" rx="4" class="prop-a"/>';
      out += PATH("M376 144L376 150", "prop-ln");
      out += '<rect x="358" y="148" width="36" height="4" rx="2" class="prop"/>';
      [0, 1, 2].forEach(function (i) {
        out += PATH("M344 " + (86 + i * 14) + "L" + (408 - i * 14) + " " + (86 + i * 14), "ln-d");
      });

      /* the plumb line, and the eye line to the screen */
      out += L(161, 42, 161, 198, "ln-d");
      out += L(176, 62, 322, 62, "ln-d");
      out += T(376, 58, "top of screen at eye level", "t-ok");
      out += DIM(o, 172, 40, 330, 40, "50-70 cm - about an arm's length", 0, -6);
      out += T(96, 118, "one plumb line", "t-ok");
      out += T(96, 131, "ear, shoulder, hip", "t-sm");
      out += L(134, 126, 157, 126, "ln-d");

      out += SEAT(o, J);

      /* the three joint angles */
      out += ANG(o, 160, 188, 34, -1.5935, 0, "95-105");
      out += ARC(o, 240, 188, 28, 1.5708, 3.1416, "ln-d");
      out += T(302, 200, "90-100 at the knee", "t-sm");
      out += ARC(o, 240, 280, 20, -1.5708, 0.117, "ln-d");
      out += T(306, 272, "about 90 at the ankle", "t-sm");
      out += T(268, 306, "feet flat, taking real weight", "t-ok");

      /* the legend */
      out += BOX(452, 30, 180, 262, "", "box", null, 8);
      out += T(542, 52, "The five checks", "t-title");
      out += L(464, 62, 620, 62, "ln-d");
      var checks = [
        ["Feet flat on the floor", "or on a box that reaches"],
        ["Knees level with the hips", "or a little lower"],
        ["Hips right at the seat back", "and the backrest in use"],
        ["Ear over shoulder over hip", "with no forward head"],
        ["Screen top at eye level", "and an arm's length away"]
      ];
      checks.forEach(function (c, i) {
        var y = 86 + i * 34;
        out += CIRC(472, y - 4, 7.5, "box-a");
        out += T(472, y - 1, String(i + 1), "t-sm");
        out += T(486, y - 3, c[0], "t-sm", "start");
        out += T(486, y + 9, c[1], "t-sm", "start");
      });
      out += L(464, 252, 620, 252, "ln-d");
      out += T(542, 269, "The best posture is the next one.", "t-sm");
      out += T(542, 282, "Stand up every half hour.", "t-sm");
      return out;
    }
  };

  /* The four faults, drawn as the same figure with different joints so the
     comparison is honest rather than caricatured. */
  D["sit-faults"] = {
    vb: "0 0 640 320",
    cap: "The four ways an engineer's chair goes wrong. Each one is comfortable for ten minutes and expensive for ten years.",
    body: function () {
      function chair(o) {
        return L(o[0] + 10, o[1] + 186, o[0] + 141, o[1] + 186, "floor") +
          '<rect x="' + n(o[0] + 24) + '" y="' + n(o[1] + 134) + '" width="66" height="5" rx="2" class="prop"/>' +
          PATH("M" + n(o[0] + 28) + " " + n(o[1] + 134) + "L" + n(o[0] + 23) + " " + n(o[1] + 88), "prop-ln") +
          PATH("M" + n(o[0] + 57) + " " + n(o[1] + 139) + "L" + n(o[0] + 57) + " " + n(o[1] + 182), "prop-ln") +
          PATH("M" + n(o[0] + 40) + " " + n(o[1] + 182) + "L" + n(o[0] + 74) + " " + n(o[1] + 182), "prop-ln");
      }

      var out = "";
      var px = [6, 165, 324, 483];
      var titles = ["The slump", "The perch", "The crane", "The lean (from the front)"];
      var subs = ["Pelvis rolled back", "Front edge, backrest unused", "Head chasing a low screen", "All the weight on one arm"];
      var costs = [
        ["The discs are loaded at the", "front and the ribs cannot open."],
        ["Muscle holds the whole trunk", "for an hour a chair could have."],
        ["At 30 degrees of tilt a 5 kg", "head pulls like roughly 18 kg."],
        ["One hip up, one shoulder down,", "held that way for hours."]
      ];
      px.forEach(function (x, i) {
        var o = [x, 14];
        out += PANEL(x, 14, 151, 232, titles[i], "bad");
        out += T(x + 75, 48, subs[i], "t-sm");
        out += chair(o);
      });

      /* 1 — the slump */
      var o1 = [px[0], 14];
      out += SEAT(o1, {
        hip: [44, 130], spine: [[44, 130], [34, 112], [42, 92], [50, 84]],
        shoulder: [42, 92], neck: [50, 84], head: [60, 74], hr: 10,
        elbow: [36, 112], hand: [76, 116],
        knee: [98, 140], ankle: [112, 182], toe: [128, 185], face: 0
      }, "body-x", "headf-x");
      out += L(o1[0] + 44, o1[1] + 66, o1[0] + 44, o1[1] + 130, "ln-d");
      out += XM(o1, 88, 78, 6);

      /* 2 — the perch */
      var o2 = [px[1], 14];
      out += SEAT(o2, {
        hip: [80, 130], spine: [[80, 130], [76, 110], [72, 90]],
        shoulder: [72, 90], neck: [70, 82], head: [72, 70], hr: 10,
        elbow: [64, 110], hand: [104, 112],
        knee: [114, 134], ankle: [98, 178], toe: [116, 182], face: 0
      }, "body-x", "headf-x");
      out += DIM(o2, 30, 108, 66, 108, "unused", 0, -6, "ln-x");
      out += XM(o2, 126, 74, 6);

      /* 3 — the crane */
      var o3 = [px[2], 14];
      out += '<rect x="' + n(px[2] + 92) + '" y="' + n(14 + 118) + '" width="46" height="4" rx="1" class="prop"/>';
      out += PATH("M" + n(px[2] + 96) + " " + n(14 + 118) + "L" + n(px[2] + 110) + " " + n(14 + 94), "prop-ln");
      out += SEAT(o3, {
        hip: [40, 130], spine: [[40, 130], [42, 110], [44, 92]],
        shoulder: [44, 92], neck: [54, 84], head: [68, 78], hr: 10,
        elbow: [40, 112], hand: [92, 116],
        knee: [94, 134], ankle: [94, 180], toe: [114, 184], face: 20
      }, "body-x", "headf-x");
      out += L(o3[0] + 44, o3[1] + 58, o3[0] + 44, o3[1] + 92, "ln-d");
      out += DIM(o3, 44, 62, 68, 62, "8 cm", 0, -5, "ln-x");
      out += XM(o3, 22, 80, 6);

      /* 4 — the lean, drawn from the front because that is the only view
         the fault is visible from */
      var o4 = [px[3], 14];
      out += '<rect x="' + n(px[3] + 26) + '" y="' + n(14 + 128) + '" width="24" height="5" rx="2" class="prop"/>';
      out += HEADF(o4, 68, 76, 10, "headf-x", null);
      out += LIMB(o4, [[50, 100], [88, 92]], "body-x");
      out += LIMB(o4, [[69, 94], [76, 114], [80, 134]], "body-x");
      out += LIMB(o4, [[62, 134], [92, 134]], "body-x");
      out += LIMB(o4, [[50, 100], [42, 118], [40, 128]], "body-x");
      out += LIMB(o4, [[88, 92], [98, 116], [100, 132]], "body-x");
      out += LIMB(o4, [[70, 134], [96, 158], [100, 182]], "body-x");
      out += LIMB(o4, [[84, 134], [78, 158], [70, 184]], "body-x");
      out += L(o4[0] + 68, o4[1] + 58, o4[0] + 68, o4[1] + 140, "ln-d");
      out += XM(o4, 120, 100, 6);

      px.forEach(function (x, i) {
        out += T(x + 75, 210, costs[i][0], "t-x");
        out += T(x + 75, 222, costs[i][1], "t-x");
      });

      out += BOX(6, 258, 628, 48, "", "box-a", null, 8);
      out += T(320, 280, "None of these is fixed by buying a better chair.", "t-title");
      out += T(320, 296, "Every one of them is fixed by standing up before your body asks you to.", "t-sm");
      return out;
    }
  };

  /* The laptop trap: the one ergonomic problem no engineer escapes, and the
     only arrangement that actually solves both halves of it. */
  D["laptop-neck"] = {
    vb: "0 0 640 300",
    cap: "A laptop puts the screen and the keyboard on the same object, so it can be right for your neck or right for your wrists — never both, until you separate them.",
    body: function () {
      function scene(o) {
        var out = L(o[0] + 12, o[1] + 178, o[0] + 196, o[1] + 178, "floor");
        out += '<rect x="' + n(o[0] + 94) + '" y="' + n(o[1] + 116) + '" width="98" height="6" rx="2" class="prop"/>';
        out += PATH("M" + n(o[0] + 184) + " " + n(o[1] + 122) + "L" + n(o[0] + 184) + " " + n(o[1] + 178), "prop-ln");
        out += '<rect x="' + n(o[0] + 28) + '" y="' + n(o[1] + 124) + '" width="60" height="5" rx="2" class="prop"/>';
        out += PATH("M" + n(o[0] + 32) + " " + n(o[1] + 124) + "L" + n(o[0] + 27) + " " + n(o[1] + 80), "prop-ln");
        out += PATH("M" + n(o[0] + 58) + " " + n(o[1] + 129) + "L" + n(o[0] + 58) + " " + n(o[1] + 174), "prop-ln");
        out += PATH("M" + n(o[0] + 42) + " " + n(o[1] + 174) + "L" + n(o[0] + 74) + " " + n(o[1] + 174), "prop-ln");
        return out;
      }

      var out = "";
      var px = [6, 218, 430];
      out += PANEL(px[0], 14, 204, 234, "Laptop flat on the desk", "bad");
      out += PANEL(px[1], 14, 204, 234, "On a riser, its own keyboard", "bad");
      out += PANEL(px[2], 14, 204, 234, "Riser and a separate keyboard", "ok");

      /* A — neck bent, wrists fine */
      var a = [px[0], 14];
      out += scene(a);
      out += '<rect x="' + n(px[0] + 100) + '" y="' + n(14 + 110) + '" width="52" height="5" rx="1" class="prop"/>';
      out += PATH("M" + n(px[0] + 104) + " " + n(14 + 110) + "L" + n(px[0] + 118) + " " + n(14 + 84), "prop-ln");
      out += SEAT(a, {
        hip: [46, 120], knee: [100, 120], ankle: [100, 172], toe: [120, 176],
        shoulder: [44, 82], neck: [52, 74], head: [64, 68], hr: 11,
        elbow: [40, 100], hand: [102, 108], face: 35
      }, "body-x", "headf-x");
      out += ANG(a, 44, 82, 26, -1.5708, -0.6, "30", "ln-x");
      out += T(102, 202, "The eyes are right, the neck is not.", "t-x");
      out += T(102, 216, "Thirty degrees, eight hours a day.", "t-x");

      /* B — screen up, arms up with it */
      var b = [px[1], 14];
      out += scene(b);
      out += '<rect x="' + n(px[1] + 100) + '" y="' + n(14 + 96) + '" width="52" height="14" rx="2" class="prop"/>';
      out += '<rect x="' + n(px[1] + 100) + '" y="' + n(14 + 90) + '" width="52" height="5" rx="1" class="prop"/>';
      out += PATH("M" + n(px[1] + 104) + " " + n(14 + 90) + "L" + n(px[1] + 118) + " " + n(14 + 62), "prop-ln");
      out += SEAT(b, {
        hip: [46, 120], knee: [100, 120], ankle: [100, 172], toe: [120, 176],
        shoulder: [44, 80], neck: [46, 70], head: [50, 58], hr: 11,
        elbow: [42, 92], hand: [104, 88], face: 0
      }, "body-x", "headf-x");
      out += AR(px[1] + 34, 14 + 96, px[1] + 34, 14 + 76, "ln-x");
      out += T(px[1] + 32, 14 + 70, "shrug", "t-x");
      out += T(102, 202, "The neck is fixed and the shoulders", "t-x");
      out += T(102, 216, "pay for it instead, all day.", "t-x");

      /* C — both */
      var c = [px[2], 14];
      out += scene(c);
      out += '<rect x="' + n(px[2] + 100) + '" y="' + n(14 + 96) + '" width="52" height="14" rx="2" class="prop"/>';
      out += '<rect x="' + n(px[2] + 100) + '" y="' + n(14 + 90) + '" width="52" height="5" rx="1" class="prop"/>';
      out += PATH("M" + n(px[2] + 104) + " " + n(14 + 90) + "L" + n(px[2] + 118) + " " + n(14 + 62), "prop-ln");
      out += '<rect x="' + n(px[2] + 98) + '" y="' + n(14 + 108) + '" width="54" height="8" rx="2" class="prop-a"/>';
      out += SEAT(c, {
        hip: [46, 120], knee: [100, 120], ankle: [100, 172], toe: [120, 176],
        shoulder: [44, 80], neck: [46, 70], head: [50, 58], hr: 11,
        elbow: [40, 100], hand: [104, 106], face: 0
      }, "body-a", "headf-a");
      out += ANG(c, 40, 100, 22, -1.5, 0.05, "90", "ln-a");
      out += L(c[0] + 52, c[1] + 54, c[0] + 118, c[1] + 54, "ln-d");
      out += OKM(c, 174, 60, 7);
      out += T(102, 202, "Eyes level, elbows at ninety,", "t-ok");
      out += T(102, 216, "wrists flat. Two cheap objects.", "t-ok");

      out += BOX(6, 258, 628, 34, "", "box-a", null, 8);
      out += T(320, 280, "A riser and a separate keyboard is the highest-return purchase of an engineering career.", "t-title");
      return out;
    }
  };


  /* How to sit in the room where you are being judged. The side view
     carries the posture; the front view carries what the arms are doing,
     because that is the half a side view cannot show. */
  D["sit-interview"] = {
    vb: "0 0 640 340",
    cap: "Interview seating. Back into the seat to start, forward from the hips to answer — the lean is what makes an answer look like it is being offered rather than recited.",
    body: function () {
      var out = "";
      out += PANEL(6, 14, 306, 250, "From the side — the answering lean", "ok");
      out += PANEL(328, 14, 306, 250, "From the front — what the arms say", "ok");

      /* ---- side ---- */
      var a = [6, 14];
      out += L(a[0] + 16, a[1] + 210, a[0] + 290, a[1] + 210, "floor");
      out += '<rect x="' + n(a[0] + 40) + '" y="' + n(a[1] + 146) + '" width="86" height="6" rx="2" class="prop"/>';
      out += PATH("M" + n(a[0] + 45) + " " + n(a[1] + 146) + "L" + n(a[0] + 38) + " " + n(a[1] + 82), "prop-ln");
      out += PATH("M" + n(a[0] + 83) + " " + n(a[1] + 152) + "L" + n(a[0] + 83) + " " + n(a[1] + 206), "prop-ln");
      out += PATH("M" + n(a[0] + 62) + " " + n(a[1] + 206) + "L" + n(a[0] + 104) + " " + n(a[1] + 206), "prop-ln");
      /* the table they sit at */
      out += '<rect x="' + n(a[0] + 168) + '" y="' + n(a[1] + 112) + '" width="116" height="6" rx="2" class="prop"/>';
      out += PATH("M" + n(a[0] + 276) + " " + n(a[1] + 118) + "L" + n(a[0] + 276) + " " + n(a[1] + 210), "prop-ln");

      /* the resting position — back into the seat, drawn as the ghost */
      out += SEAT(a, {
        hip: [56, 142], knee: [128, 142], ankle: [128, 204], toe: [156, 208],
        shoulder: [54, 82], neck: [56, 70], head: [59, 56], hr: 13,
        elbow: [50, 110], hand: [116, 130], face: 0
      }, "body", "headf");
      /* the answering position — the same figure hinged forward at the hip */
      out += SEAT(a, {
        hip: [56, 142], knee: [128, 142], ankle: [128, 204], toe: [156, 208],
        shoulder: [66, 84], neck: [70, 72], head: [74, 58], hr: 13,
        elbow: [64, 112], hand: [124, 126], face: 0
      }, "body-a", "headf-a");
      out += ANG(a, 56, 142, 46, -1.72, -1.38, "8-12", "ln-a");
      out += AR(a[0] + 40, a[1] + 60, a[0] + 62, a[1] + 52, "ln-a");
      out += T(a[0] + 30, a[1] + 50, "lean in", "t-ok");
      out += T(a[0] + 150, a[1] + 232, "Hinge at the hip, not at the neck.", "t-sm");
      out += T(a[0] + 150, a[1] + 244, "The head stays over the shoulders.", "t-sm");
      out += T(a[0] + 148, a[1] + 178, "feet flat, one may sit forward", "t-sm");

      /* ---- front ---- */
      var b = [328, 14];
      out += '<rect x="' + n(b[0] + 40) + '" y="' + n(b[1] + 150) + '" width="226" height="6" rx="2" class="prop"/>';
      out += HEADF(b, 152, 66, 15, "headf-a", null);
      out += LIMB(b, [[152, 81], [152, 96]], "body-a");
      out += LIMB(b, [[122, 100], [182, 100]], "body-a");
      out += LIMB(b, [[152, 96], [152, 146]], "body-a");
      out += LIMB(b, [[122, 100], [110, 130], [134, 148]], "body-a");
      out += LIMB(b, [[182, 100], [194, 130], [170, 148]], "body-a");
      out += L(b[0] + 152, b[1] + 44, b[0] + 152, b[1] + 150, "ln-d");
      out += DIM(b, 122, 88, 182, 88, "shoulders square to them", 0, -6, "ln-a");
      out += T(b[0] + 152, b[1] + 172, "forearms on the table, hands loosely apart", "t-ok");
      out += T(b[0] + 152, b[1] + 186, "elbows off the ribs — a hand's width of air", "t-sm");
      out += L(b[0] + 40, b[1] + 200, b[0] + 266, b[1] + 200, "ln-d");
      out += T(b[0] + 153, b[1] + 218, "Not this", "t-x");
      [["Arms folded", "reads as closed"], ["Hands hidden", "reads as evasive"],
      ["Hand on the face", "reads as anxious"]].forEach(function (r, i) {
        var x = b[0] + 58 + i * 95;
        out += T(x, b[1] + 236, r[0], "t-x");
        out += T(x, b[1] + 248, r[1], "t-sm");
      });

      out += BOX(6, 276, 628, 46, "", "box-a", null, 8);
      out += T(320, 297, "Sit back while you listen. Come forward while you answer. Go back when you finish.", "t-title");
      out += T(320, 313, "It is one movement, it is not a performance, and a panel reads it as interest without ever naming it.", "t-sm");
      return out;
    }
  };

  /* Where to sit in a meeting room, and what each seat says before you
     open your mouth. Drawn from above because that is the only view in
     which a room has politics. */
  D["seat-map"] = {
    vb: "0 0 640 430",
    cap: "A meeting room from above. Nobody assigns these meanings out loud, and everybody in the room applies them anyway.",
    body: function () {
      var out = '<rect x="30" y="24" width="580" height="252" rx="10" class="prop" style="fill:none"/>';
      /* screen on the far wall, door on the near-left wall */
      out += '<rect x="284" y="26" width="126" height="9" rx="3" class="prop-a"/>';
      out += T(347, 48, "screen", "t-sm");
      out += PATH("M30 196L30 250", "ln-a");
      out += T(60, 268, "door", "t-sm");
      out += ARC([0, 0], 30, 250, 26, -1.5708, 0, "ln-d");

      out += '<rect x="168" y="88" width="300" height="122" rx="12" class="prop"/>';

      var seats = [
        [140, 149, "1"], [498, 149, "4"],
        [214, 66, "2"], [284, 66, "3"], [354, 66, "8"], [424, 66, "5"],
        [214, 232, "6"], [284, 232, "7"], [354, 232, "7"], [424, 232, "6"]
      ];
      seats.forEach(function (st) {
        out += CIRC(st[0], st[1], 15, st[2] === "3" ? "box-a" : "box");
        out += T(st[0], st[1] + 4, st[2], "t-title");
      });
      out += T(284, 44, "your seat", "t-ok");
      out += AR(284, 50, 284, 62, "ln-a");

      var notes = [
        ["1", "The chair", "Runs it, or is handed it."],
        ["2", "The right hand", "Read as the chair's second."],
        ["3", "The working seat", "One in from the end, door in view."],
        ["4", "The far end", "Framed as the challenge. Know that."],
        ["5", "Beside the screen", "You will be driving the slides."],
        ["6", "The corners", "Where quiet people disappear."],
        ["7", "Back to the door", "Avoid it in anything tense."],
        ["8", "Facing the door", "You see who walks in. Free composure."]
      ];
      notes.forEach(function (r, i) {
        var col = i % 2, row = Math.floor(i / 2);
        var x = 24 + col * 312, y = 306 + row * 32;
        out += CIRC(x + 9, y - 4, 9, "box-a");
        out += T(x + 9, y - 0.5, r[0], "t-sm");
        out += T(x + 26, y - 1, r[1], "t-title", "start");
        out += T(x + 26, y + 12, r[2], "t-sm", "start");
      });
      return out;
    }
  };

  D["stand-shake"] = {
    vb: "0 0 640 320",
    cap: "The standing plumb line, and the geometry of a handshake. Both are boring on purpose — a greeting that gets remembered has usually gone wrong.",
    body: function () {
      var out = "";
      out += PANEL(6, 14, 250, 250, "Standing, at rest", "ok");
      out += PANEL(272, 14, 362, 250, "The handshake, from above", "ok");

      /* ---- standing, side view ---- */
      var a = [6, 14];
      out += L(a[0] + 20, a[1] + 222, a[0] + 230, a[1] + 222, "floor");
      out += LIMB(a, [[112, 92], [112, 148]], "body");
      out += LIMB(a, [[112, 148], [110, 186], [110, 218]], "body");
      out += LIMB(a, [[110, 218], [134, 220]], "body");
      out += LIMB(a, [[112, 96], [104, 140], [108, 166]], "body");
      out += LIMB(a, [[112, 92], [113, 78]], "body");
      out += HEADF(a, 116, 64, 14, "headf", 0);
      out += L(a[0] + 113, a[1] + 44, a[0] + 113, a[1] + 226, "ln-d");
      var marks = [
        [64, "ear"], [92, "shoulder"], [148, "hip"], [186, "knee"], [218, "midfoot"]
      ];
      marks.forEach(function (m) {
        out += CIRC(a[0] + 113, a[1] + m[0], 3.2, "fill-a");
        out += T(a[0] + 100, a[1] + m[0] + 3, m[1], "t-sm", "end");
      });
      out += T(a[0] + 168, a[1] + 108, "knees soft,", "t-ok");
      out += T(a[0] + 168, a[1] + 120, "never locked", "t-sm");
      out += T(a[0] + 168, a[1] + 150, "weight even,", "t-ok");
      out += T(a[0] + 168, a[1] + 162, "over the midfoot", "t-sm");
      out += T(a[0] + 125, a[1] + 230, "One line through five points.", "t-sm");
      out += T(a[0] + 125, a[1] + 242, "That is all standing well is.", "t-sm");

      /* ---- handshake, top view ---- */
      var b = [272, 14];
      var y = 96;
      out += CIRC(b[0] + 78, b[1] + y, 17, "box");
      out += LIMB(b, [[62, y + 20], [94, y + 20]], "body");
      out += LIMB(b, [[92, y + 20], [130, y + 6]], "body");
      out += CIRC(b[0] + 284, b[1] + y, 17, "box-a");
      out += LIMB(b, [[268, y + 20], [300, y + 20]], "body-a");
      out += LIMB(b, [[270, y + 20], [232, y + 6]], "body-a");
      out += CIRC(b[0] + 181, b[1] + y + 6, 11, "box-a");
      out += T(b[0] + 181, b[1] + y - 14, "web to web", "t-ok");
      out += DIM(b, 96, y + 52, 266, y + 52, "one arm's length between you", 0, 14);
      out += T(b[0] + 181, b[1] + y + 82, "Two or three pumps. About two seconds. Let go first is fine.", "t-sm");

      /* palm orientation */
      out += L(b[0] + 22, b[1] + 196, b[0] + 340, b[1] + 196, "ln-d");
      [["Palm down", "reads as a power play", "ln-x", -28],
      ["Palm up", "reads as deferring", "ln-x", 28],
      ["Vertical", "reads as an equal", "ln-a", 0]].forEach(function (r, i) {
        var x = b[0] + 62 + i * 118;
        var yy = b[1] + 222;
        var a2 = r[3] * Math.PI / 180;
        out += PATH("M" + n(x - Math.cos(a2) * 20) + " " + n(yy - Math.sin(a2) * 20) +
          "L" + n(x + Math.cos(a2) * 20) + " " + n(yy + Math.sin(a2) * 20), r[2]);
        out += T(x, yy + 22, r[0], r[2] === "ln-x" ? "t-x" : "t-ok");
        out += T(x, yy + 34, r[1], "t-sm");
      });

      out += BOX(6, 276, 628, 34, "", "box-a", null, 8);
      out += T(320, 298, "Stand up for it, make it vertical, look at the face and say the name back. That is the whole skill.", "t-title");
      return out;
    }
  };

  /* Distance. The single most-broken rule in offices, and the one nobody
     will ever tell you that you are breaking. */
  D["space-zones"] = {
    vb: "0 0 640 300",
    cap: "Working distance, from the point of view of the person you are standing in front of. The boundaries move by culture and by relationship; the fact that there are boundaries does not.",
    body: function () {
      var y0 = 176;
      var out = CIRC(72, y0 - 30, 16, "box-a");
      out += LIMB([0, 0], [[56, y0 - 12], [88, y0 - 12]], "body-a");
      out += T(72, y0 + 18, "you", "t-sm");
      out += L(60, y0 + 34, 620, y0 + 34, "ln");

      var bands = [
        [92, 176, "Intimate", "0 - 45 cm", ["Family, and nobody", "else at work. Ever."], "band-x"],
        [176, 306, "Personal", "45 cm - 1.2 m", ["A friend, or a screen", "you are both reading."], "band"],
        [306, 486, "Social", "1.2 - 3.6 m", ["Colleagues, clients,", "the default at work."], "band"],
        [486, 618, "Public", "over 3.6 m", ["Presenting to a room,", "or a stranger passing."], "band"]
      ];
      bands.forEach(function (bd, i) {
        out += '<rect x="' + n(bd[0]) + '" y="60" width="' + n(bd[1] - bd[0]) + '" height="' + n(y0 + 34 - 60) + '" class="' + bd[5] + '"/>';
        out += L(bd[0], 60, bd[0], y0 + 40, "ln-d");
        var mid = (bd[0] + bd[1]) / 2;
        out += T(mid, 82, bd[2], i === 0 ? "t-x" : "t-title");
        out += T(mid, 96, bd[3], "t-sm");
        out += T(mid, 122, bd[4][0], "t-sm");
        out += T(mid, 134, bd[4][1], "t-sm");
      });
      out += L(618, 60, 618, y0 + 40, "ln-d");

      /* the two figures standing at the working distance */
      out += CIRC(340, y0 - 4, 13, "box");
      out += LIMB([0, 0], [[326, y0 + 11], [354, y0 + 11]], "body");
      out += CIRC(452, y0 - 4, 13, "box");
      out += LIMB([0, 0], [[438, y0 + 11], [466, y0 + 11]], "body");
      out += DIM([0, 0], 356, y0 - 4, 436, y0 - 4, "about a metre", 0, -8, "ln-a");

      out += BOX(6, 226, 628, 74, "", "box-a", null, 8);
      out += T(320, 247, "Standing too close is the only rudeness nobody will tell you about.", "t-title");
      out += T(320, 264, "The tell is simple: they step back and you step forward. When that happens once, you have your answer.", "t-sm");
      out += T(320, 278, "Northern Europe, North America and much of East Asia stand further apart.", "t-sm");
      out += T(320, 291, "Much of South Asia, the Gulf and Latin America stand closer. Match the room you are in.", "t-sm");
      return out;
    }
  };


  /* Where to look. Eye contact is the single hardest thing to get right
     for anybody who has been told to "make more eye contact" and nothing
     else, because the instruction has no target in it. */
  D["gaze-map"] = {
    vb: "0 0 640 300",
    cap: "The three gaze triangles. At work you live in the top one, and the fix for staring is never to look away downward.",
    body: function () {
      var out = "";
      /* the face */
      var cx = 148, cy = 130;
      out += '<ellipse cx="' + cx + '" cy="' + cy + '" rx="56" ry="70" class="prop"/>';
      out += CIRC(cx - 22, cy - 14, 6, "prop");
      out += CIRC(cx + 22, cy - 14, 6, "prop");
      out += CIRC(cx - 22, cy - 14, 2.4, "fill-a");
      out += CIRC(cx + 22, cy - 14, 2.4, "fill-a");
      out += PATH("M" + (cx - 4) + " " + (cy + 4) + "L" + cx + " " + (cy + 16) + "L" + (cx - 6) + " " + (cy + 18), "prop-ln");
      out += PATH("M" + (cx - 18) + " " + (cy + 38) + "Q" + cx + " " + (cy + 48) + " " + (cx + 18) + " " + (cy + 38), "prop-ln");

      /* the three triangles */
      out += PATH("M" + (cx - 22) + " " + (cy - 14) + "L" + (cx + 22) + " " + (cy - 14) +
        "L" + cx + " " + (cy - 52) + "Z", "ln-a");
      out += PATH("M" + (cx - 22) + " " + (cy - 14) + "L" + (cx + 22) + " " + (cy - 14) +
        "L" + cx + " " + (cy + 42) + "Z", "ln-d");
      out += PATH("M" + (cx - 22) + " " + (cy - 14) + "L" + (cx + 22) + " " + (cy - 14) +
        "L" + cx + " " + (cy + 96) + "Z", "ln-x");

      out += T(cx, cy - 62, "business", "t-ok");
      out += T(cx + 96, cy + 34, "social", "t-sm", "start");
      out += L(cx + 14, cy + 30, cx + 92, cy + 32, "ln-d");
      out += T(cx + 96, cy + 92, "never at work", "t-x", "start");
      out += L(cx + 12, cy + 88, cx + 92, cy + 90, "ln-x");

      /* the rules */
      out += BOX(300, 40, 334, 178, "", "box", null, 8);
      out += T(467, 62, "The numbers that actually help", "t-title");
      out += L(316, 72, 618, 72, "ln-d");
      var rows = [
        ["50%", "eye contact while you are speaking"],
        ["70%", "while listening. Most get this backwards"],
        ["4-5 sec", "a hold, then break. Longer is a stare"],
        ["break", "sideways. Down reads as evasion"],
        ["one idea", "per person on a panel, then move on"]
      ];
      rows.forEach(function (r, i) {
        var y = 96 + i * 25;
        out += T(370, y, r[0], "t-title", "end");
        out += T(382, y, r[1], "t-sm", "start");
      });

      out += BOX(6, 232, 628, 68, "", "box-a", null, 8);
      out += T(320, 253, "If holding a gaze is genuinely hard, look at the bridge of the nose.", "t-title");
      out += T(320, 270, "At any conversational distance it is indistinguishable from eye contact.", "t-sm");
      out += T(320, 286, "In a video call the camera is the eye. Looking at their face on your screen looks, to them, like looking down.", "t-sm");
      return out;
    }
  };

  /* Open and closed, drawn as the same figure twice, because that is what
     the difference actually is: four joints. */
  D["body-read"] = {
    vb: "0 0 640 320",
    cap: "Open and closed, from the front. Nobody consciously decodes this and everybody responds to it.",
    body: function () {
      var out = "";
      out += PANEL(6, 14, 306, 244, "Open", "ok");
      out += PANEL(328, 14, 306, 244, "Closed", "bad");

      /* open */
      var a = [6, 14];
      out += HEADF(a, 152, 68, 16, "headf-a", null);
      out += LIMB(a, [[152, 84], [152, 100]], "body-a");
      out += LIMB(a, [[120, 104], [184, 104]], "body-a");
      out += LIMB(a, [[152, 100], [152, 154]], "body-a");
      out += LIMB(a, [[120, 104], [106, 138], [116, 162]], "body-a");
      out += LIMB(a, [[184, 104], [198, 138], [188, 162]], "body-a");
      out += LIMB(a, [[136, 154], [128, 194], [124, 214]], "body-a");
      out += LIMB(a, [[168, 154], [176, 194], [180, 214]], "body-a");
      out += LIMB(a, [[124, 214], [140, 218]], "body-a");
      out += LIMB(a, [[180, 214], [196, 218]], "body-a");
      out += T(a[0] + 152, a[1] + 178, "palms visible", "t-ok");
      [["Torso square to the other person", 236], ["Arms uncrossed, hands in view", 249],
      ["Feet pointing at whoever is talking", 262]].forEach(function (r) {
        out += T(a[0] + 152, r[1] - 20, r[0], "t-sm");
      });

      /* closed */
      var b = [328, 14];
      out += HEADF(b, 152, 68, 16, "headf-x", null);
      out += LIMB(b, [[152, 84], [154, 100]], "body-x");
      out += LIMB(b, [[124, 104], [186, 100]], "body-x");
      out += LIMB(b, [[153, 100], [156, 154]], "body-x");
      out += LIMB(b, [[124, 104], [126, 128], [178, 132]], "body-x");
      out += LIMB(b, [[186, 100], [188, 124], [132, 128]], "body-x");
      out += LIMB(b, [[142, 154], [136, 194], [124, 214]], "body-x");
      out += LIMB(b, [[170, 154], [176, 194], [186, 214]], "body-x");
      out += LIMB(b, [[124, 214], [106, 212]], "body-x");
      out += LIMB(b, [[186, 214], [168, 212]], "body-x");
      out += T(b[0] + 152, b[1] + 178, "hands hidden", "t-x");
      [["Torso turned a few degrees away", 236], ["Arms folded across the chest", 249],
      ["Feet pointing at the door", 262]].forEach(function (r) {
        out += T(b[0] + 152, r[1] - 20, r[0], "t-sm");
      });

      out += BOX(6, 268, 628, 46, "", "box-a", null, 8);
      out += T(320, 289, "Feet are the honest joint. People control their face, then their hands, and almost never their feet.", "t-title");
      out += T(320, 305, "If the shoulders are with you and the feet point at the door, the conversation is over. Close it yourself.", "t-sm");
      return out;
    }
  };

  /* The video call, which is now most of professional presence and is
     almost entirely a camera-placement problem. */
  D["video-frame"] = {
    vb: "0 0 640 330",
    cap: "The same person, two camera positions. The left one is what a laptop on a desk gives you by default.",
    body: function () {
      function frame(x, y, w, cls) {
        var h = w * 9 / 16;
        return '<rect x="' + n(x) + '" y="' + n(y) + '" width="' + n(w) + '" height="' + n(h) +
          '" rx="6" class="' + cls + '"/>';
      }
      var out = "";
      out += T(160, 28, "Camera below eye level", "t-x");
      out += T(480, 28, "Camera at eye level", "t-ok");

      /* bad frame */
      var fx = 36, fy = 40, fw = 248, fh = fw * 9 / 16;
      out += frame(fx, fy, fw, "prop");
      out += L(fx, fy + fh / 3, fx + fw, fy + fh / 3, "ln-d");
      out += HEADF([0, 0], fx + 124, fy + fh - 32, 26, "headf-x", null);
      out += LIMB([0, 0], [[fx + 84, fy + fh], [fx + 96, fy + fh - 12], [fx + 152, fy + fh - 12], [fx + 164, fy + fh]], "body-x");
      out += PATH("M" + (fx + 8) + " " + (fy + 14) + "L" + (fx + fw - 8) + " " + (fy + 22), "ln-d");
      out += T(fx + fw - 60, fy + 36, "ceiling", "t-sm");
      out += T(fx + 124, fy + fh + 22, "Head low in the frame, chin first,", "t-x");
      out += T(fx + 124, fy + fh + 35, "half the shot is the room behind you.", "t-x");

      /* good frame */
      var gx = 356;
      out += frame(gx, fy, fw, "prop-a");
      out += L(gx, fy + fh / 3, gx + fw, fy + fh / 3, "ln-d");
      out += HEADF([0, 0], gx + 124, fy + fh / 3 + 4, 30, "headf-a", null);
      out += LIMB([0, 0], [[gx + 66, fy + fh], [gx + 84, fy + fh - 42], [gx + 164, fy + fh - 42], [gx + 182, fy + fh]], "body-a");
      out += T(gx + 240, fy + fh / 3 - 8, "eyes on the", "t-sm", "end");
      out += T(gx + 240, fy + fh / 3 + 4, "upper third", "t-sm", "end");
      out += T(gx + 124, fy + fh + 22, "Head and shoulders, eyes on the third line,", "t-ok");
      out += T(gx + 124, fy + fh + 35, "a hand's width of air above the head.", "t-ok");

      /* how you get there */
      out += BOX(36, 210, 568, 110, "", "box", null, 8);
      out += T(320, 232, "How the right-hand frame is produced", "t-title");
      out += L(56, 242, 584, 242, "ln-d");
      var steps = [
        ["Raise the laptop", "Books work. The lens must reach eye height."],
        ["Sit back a little", "The lens flatters at distance, never close."],
        ["Light in front of you", "A window behind you makes a silhouette."],
        ["Look at the lens", "For the sentence that matters, not for all."]
      ];
      steps.forEach(function (s, i) {
        var x = 56 + (i % 2) * 268, y = 266 + Math.floor(i / 2) * 34;
        out += CIRC(x + 9, y - 4, 9, "box-a");
        out += T(x + 9, y - 0.5, String(i + 1), "t-sm");
        out += T(x + 24, y, s[0], "t-title", "start");
        out += T(x + 24, y + 14, s[1], "t-sm", "start");
      });
      return out;
    }
  };

  /* Dress, as a scale rather than a rulebook, because the rule is always
     relative to the room you are standing in. */
  D["dress-scale"] = {
    vb: "0 0 640 300",
    cap: "The four rungs, and the only rule that survives contact with a real office: read the room, then stand one rung above the median.",
    body: function () {
      function torso(x, y, kind) {
        var c = kind === "on" ? "body-a" : "body";
        var out = HEADF([0, 0], x, y - 34, 13, kind === "on" ? "headf-a" : "headf", null);
        out += LIMB([0, 0], [[x, y - 21], [x, y - 14]], c);
        /* shoulders and body */
        out += PATH("M" + (x - 26) + " " + y + "L" + (x - 22) + " " + (y - 12) + "L" + (x - 10) + " " + (y - 16) +
          "L" + x + " " + (y - 10) + "L" + (x + 10) + " " + (y - 16) + "L" + (x + 22) + " " + (y - 12) +
          "L" + (x + 26) + " " + y + "L" + (x + 24) + " " + (y + 46) + "L" + (x - 24) + " " + (y + 46) + "Z",
          kind === "on" ? "prop-a" : "prop");
        /* collar */
        out += PATH("M" + (x - 10) + " " + (y - 16) + "L" + x + " " + (y - 4) + "L" + (x + 10) + " " + (y - 16), "prop-ln");
        return out;
      }
      var out = "";
      out += L(40, 208, 600, 208, "ln");
      out += AR(40, 208, 604, 208, "ln-a");
      out += T(40, 226, "more relaxed", "t-sm", "start");
      out += T(600, 226, "more formal", "t-sm", "end");

      var stops = [
        ["Casual", "Clean jeans, plain tee or shirt,", "closed shoes. Startups, Fridays.", "off"],
        ["Smart casual", "Chinos or dark jeans, collared", "shirt or knit, leather shoes.", "on"],
        ["Business casual", "Trousers, shirt, optional blazer.", "The default of most offices.", "off"],
        ["Business formal", "Suit, tie, polished shoes.", "Client pitches, some interviews.", "off"]
      ];
      stops.forEach(function (s, i) {
        var x = 106 + i * 143;
        out += torso(x, 96, s[3]);
        out += L(x, 150, x, 202, "ln-d");
        out += CIRC(x, 208, 6, s[3] === "on" ? "fill-a" : "box");
        out += T(x, 40, s[0], s[3] === "on" ? "t-ok" : "t-title");
        out += T(x, 250, s[1], "t-sm");
        out += T(x, 262, s[2], "t-sm");
      });

      out += BOX(6, 272, 628, 24, "", "box-a", null, 6);
      out += T(320, 287, "Overdressed is forgotten by lunch. Underdressed is remembered for a year.", "t-title");
      return out;
    }
  };

  /* The formal cover, for the dinner nobody warns a new engineer about. */
  D["place-setting"] = {
    vb: "0 0 640 320",
    cap: "A formal cover, seen from your chair. Two rules cover almost every setting you will ever meet: outside in, and your bread is on the left.",
    body: function () {
      var cx = 300, cy = 158;
      var out = CIRC(cx, cy, 52, "prop");
      out += CIRC(cx, cy, 40, "prop");

      /* forks left, knives and spoon right */
      function piece(x, y1, y2, cls) {
        return PATH("M" + x + " " + y1 + "L" + x + " " + y2, cls || "prop-ln");
      }
      out += piece(cx - 76, cy - 34, cy + 40);
      out += piece(cx - 92, cy - 34, cy + 40);
      out += piece(cx + 76, cy - 34, cy + 40);
      out += piece(cx + 92, cy - 34, cy + 40);
      out += piece(cx + 108, cy - 34, cy + 40);
      out += T(cx - 84, cy + 62, "forks", "t-sm");
      out += T(cx + 92, cy + 62, "knives, spoon", "t-sm");
      out += T(cx - 84, cy + 74, "outside in", "t-ok");
      out += T(cx + 92, cy + 74, "outside in", "t-ok");

      /* dessert above */
      out += PATH("M" + (cx - 26) + " " + (cy - 74) + "L" + (cx + 26) + " " + (cy - 74), "prop-ln");
      out += PATH("M" + (cx - 26) + " " + (cy - 86) + "L" + (cx + 26) + " " + (cy - 86), "prop-ln");
      out += T(cx + 62, cy - 82, "dessert — used last", "t-sm", "start");

      /* bread left, glasses right */
      out += CIRC(cx - 122, cy - 60, 24, "prop-a");
      out += T(cx - 122, cy - 96, "bread", "t-ok");
      out += CIRC(cx + 126, cy - 62, 13, "prop-a");
      out += CIRC(cx + 154, cy - 48, 11, "prop-a");
      out += CIRC(cx + 148, cy - 76, 10, "prop-a");
      out += T(cx + 148, cy - 100, "glasses", "t-ok");

      out += BOX(20, 240, 280, 62, "", "box", null, 8);
      out += T(160, 261, "BMW, left to right", "t-title");
      out += T(160, 278, "Bread, Meal, Water.", "t-sm");
      out += T(160, 291, "Yours are always in that order.", "t-sm");

      out += BOX(340, 240, 280, 62, "", "box", null, 8);
      out += T(480, 261, "Resting is not finished", "t-title");
      out += T(480, 278, "Crossed on the plate means pause.", "t-sm");
      out += T(480, 291, "Together at four o'clock means done.", "t-sm");
      return out;
    }
  };

  /* The working day as a rhythm rather than a block. This is the diagram
     that prevents the injury the other diagrams only postpone. */
  D["work-rhythm"] = {
    vb: "0 0 640 270",
    cap: "One hour, and what has to happen inside it. The posture diagrams buy you comfort; this one buys you a career length.",
    body: function () {
      var x0 = 60, x1 = 604, y = 92;
      var out = L(x0, y, x1, y, "ln");
      for (var m = 0; m <= 60; m += 5) {
        var x = x0 + (x1 - x0) * (m / 60);
        out += L(x, y - (m % 20 === 0 ? 9 : 5), x, y + (m % 20 === 0 ? 9 : 5), "ln-d");
        if (m % 20 === 0) out += T(x, y + 24, m + " min", "t-sm");
      }

      /* 20-20-20 marks */
      [20, 40, 60].forEach(function (m) {
        var x = x0 + (x1 - x0) * (m / 60);
        var anch = m === 60 ? "end" : "middle";
        out += CIRC(x, y, 6, "fill-a");
        out += T(x, y - 22, "look 20 m away", "t-ok", anch);
        out += T(x, y - 34, "for 20 seconds", "t-sm", anch);
      });

      /* stand marks */
      [30, 60].forEach(function (m) {
        var x = x0 + (x1 - x0) * (m / 60);
        var anch = m === 60 ? "end" : "middle";
        out += AR(x, y + 62, x, y + 40, "ln-a");
        out += T(x, y + 76, "stand up", "t-ok", anch);
        out += T(x, y + 88, "and walk 60 seconds", "t-sm", anch);
      });

      out += BOX(20, 206, 292, 52, "", "box", null, 8);
      out += T(166, 226, "What the eye break prevents", "t-title");
      out += T(166, 242, "Focus spasm, dry eye, and the headache you blamed on the sprint.", "t-sm");

      out += BOX(328, 206, 292, 52, "", "box", null, 8);
      out += T(474, 226, "What the walk prevents", "t-title");
      out += T(474, 242, "Loaded discs, stiff hips, and the back that starts at 30 and stays.", "t-sm");
      return out;
    }
  };

  /* The formal letter, drawn as a page because the layout IS the content:
     an application that arrives in the wrong shape has already said
     something about the person who sent it. */
  D["letter-block"] = {
    vb: "0 0 640 400",
    cap: "Full block format — everything flush left, one blank line between the parts. It is the layout every institution accepts and the one nobody can mark you down for.",
    body: function () {
      var px = 74, pw = 250, py = 20, ph = 364;
      var out = '<rect x="' + px + '" y="' + py + '" width="' + pw + '" height="' + ph + '" rx="4" class="prop"/>';
      var lx = px + 24;
      out += L(lx, py + 12, lx, py + ph - 12, "ln-d");

      var parts = [
        [40, 3, "Your name and address", "Top left. Skip it if your signature has it."],
        [86, 1, "The date, written out", "12 September 2026 — never 12/09/26."],
        [112, 3, "Their name, title, employer", "A name if you can find one, a title if not."],
        [158, 1, "Subject: one line", "The line that decides whether it is read."],
        [184, 1, "Dear Ms Sharma,", "Surname, comma. Never the full name."],
        [210, 5, "The body, three paragraphs", "The ask. The grounds. What happens next."],
        [304, 1, "Yours sincerely,", "Faithfully instead, if you never had a name."],
        [330, 2, "Signature, then your name", "Plus the roll or employee number they file by."]
      ];
      parts.forEach(function (pt, i) {
        var y = py + pt[0];
        for (var k = 0; k < pt[1]; k++) {
          var w = k === pt[1] - 1 ? (pw - 48) * 0.62 : (pw - 48);
          out += L(lx, y + k * 11, lx + w, y + k * 11, i === 3 ? "ln-a" : "ln");
        }
        out += CIRC(px - 16, y - 3, 9, "box-a");
        out += T(px - 16, y + 0.5, String(i + 1), "t-sm");
      });

      out += BOX(350, 20, 282, 364, "", "box", null, 8);
      out += T(491, 42, "What each part is doing", "t-title");
      out += L(364, 52, 618, 52, "ln-d");
      parts.forEach(function (pt, i) {
        var y = 74 + i * 36;
        out += T(364, y, (i + 1) + ". " + pt[2], "t-title", "start");
        out += T(364, y + 13, pt[3], "t-sm", "start");
      });
      out += L(364, 348, 618, 348, "ln-d");
      out += T(364, 364, "Flush left. No indents.", "t-ok", "start");
      out += T(364, 377, "One blank line between every part.", "t-sm", "start");
      return out;
    }
  };

  /* ---- System Design Diagrams ---- */

  D["sys-loadbalancer"] = {
    vb: "0 0 660 380",
    cap: "End-to-End High-Availability Web Architecture: DNS Anycast → CDN Edge → L4/L7 Load Balancers → Stateless App Cluster → Distributed Cache & Database with Read Replicas.",
    body: function () {
      var out = "";
      // Clients
      out += BOX(20, 160, 70, 60, "Clients", "box", "Web / Mobile", 6);
      out += AR(90, 190, 140, 190, "ln-a");

      // CDN / Edge
      out += BOX(140, 150, 90, 80, "CDN / Edge", "box-a", "Static & Cache", 6);
      out += AR(230, 190, 280, 190, "ln-a");

      // Load Balancer
      out += BOX(280, 130, 100, 120, "Load Balancer", "box", "L7 Reverse Proxy", 6);
      out += T(330, 220, "(HA Active-Passive)", "t-sm");

      // Arrows to App Servers
      out += AR(380, 160, 430, 90, "ln");
      out += AR(380, 190, 430, 190, "ln-a");
      out += AR(380, 220, 430, 290, "ln");

      // Stateless App Cluster
      out += BOX(430, 60, 90, 60, "App Instance 1", "box", "Stateless Node", 6);
      out += BOX(430, 160, 90, 60, "App Instance 2", "box-a", "Stateless Node", 6);
      out += BOX(430, 260, 90, 60, "App Instance 3", "box", "Stateless Node", 6);

      // Arrows to Cache & DB
      out += AR(520, 90, 560, 90, "ln-b");
      out += AR(520, 190, 560, 190, "ln-a");
      out += AR(520, 290, 560, 290, "ln");

      // Redis Cache & Database
      out += BOX(560, 60, 80, 60, "Redis Cache", "box-b", "In-Memory", 6);
      out += BOX(560, 150, 80, 70, "Primary DB", "box-a", "Writes Only", 6);
      out += BOX(560, 250, 80, 70, "Replica DB", "box", "Reads Only", 6);
      out += AR(600, 220, 600, 250, "ln-d"); // replication stream
      out += T(600, 238, "Replicate", "t-sm");

      // Annotations
      out += T(185, 250, "Anycast DNS", "t-sm");
      out += T(330, 270, "SSL Termination", "t-sm");
      out += T(330, 285, "Rate Limiting & Auth", "t-sm");
      return out;
    }
  };

  D["sys-consistent-hashing"] = {
    vb: "0 0 640 380",
    cap: "Consistent Hashing Ring (0 to 2³² - 1) with Virtual Nodes: Keys map clockwise to the next server node, minimising remapping during node additions or removals.",
    body: function () {
      var cx = 220, cy = 190, r = 120;
      var out = "";

      // Big Ring
      out += CIRC(cx, cy, r, "ln-d");
      out += T(cx, cy - r - 10, "0 / 2³² - 1", "t-sm");

      // Server Nodes on Ring (Angles)
      var nodes = [
        { a: -Math.PI / 2, label: "Node A (V1)", cls: "box-a", fill: "#38bdf8" },
        { a: 0.1, label: "Node B (V1)", cls: "box-b", fill: "#34d399" },
        { a: Math.PI * 0.7, label: "Node C (V1)", cls: "box", fill: "#a78bfa" },
        { a: Math.PI * 1.1, label: "Node A (V2)", cls: "box-a", fill: "#38bdf8" },
        { a: Math.PI * 1.6, label: "Node B (V2)", cls: "box-b", fill: "#34d399" }
      ];

      nodes.forEach(function (n) {
        var x = cx + r * Math.cos(n.a), y = cy + r * Math.sin(n.a);
        out += CIRC(x, y, 10, n.cls);
        var tx = cx + (r + 30) * Math.cos(n.a), ty = cy + (r + 30) * Math.sin(n.a);
        out += T(tx, ty + 4, n.label, "t-title");
      });

      // Keys (Items)
      var keys = [
        { a: -Math.PI * 0.25, label: "Key 1 → Node B" },
        { a: Math.PI * 0.4, label: "Key 2 → Node C" },
        { a: Math.PI * 0.9, label: "Key 3 → Node A" }
      ];

      keys.forEach(function (k) {
        var x = cx + r * Math.cos(k.a), y = cy + r * Math.sin(k.a);
        out += CIRC(x, y, 5, "fill-b");
        // Clockwise arrow indicator
        var nx = cx + (r - 20) * Math.cos(k.a), ny = cy + (r - 20) * Math.sin(k.a);
        out += T(nx, ny + 3, "●", "t-sm");
      });

      // Right Explanation Panel
      out += BOX(390, 40, 230, 300, "", "box", null, 8);
      out += T(505, 68, "Consistent Hashing Rules", "t-title");
      out += L(405, 80, 605, 80, "ln-d");

      out += T(405, 108, "1. Hash Ring Topology", "t-title", "start");
      out += T(405, 126, "Range [0, 2^32 - 1] wraps in circle.", "t-sm", "start");

      out += T(405, 160, "2. Clockwise Routing", "t-title", "start");
      out += T(405, 178, "Key hash routes clockwise to next node.", "t-sm", "start");

      out += T(405, 212, "3. Virtual Nodes (vnodes)", "t-title", "start");
      out += T(405, 230, "Balances keys evenly across nodes.", "t-sm", "start");

      out += T(405, 264, "4. Minimal Churn on Scale", "t-title", "start");
      out += T(405, 282, "Adding 1 node re-keys only k/N items.", "t-ok", "start");

      return out;
    }
  };

  D["sys-caching-patterns"] = {
    vb: "0 0 660 380",
    cap: "Distributed Caching Topologies: Cache-Aside (Lazy), Write-Through (Synchronous), and Write-Behind (Asynchronous Write-Back).",
    body: function () {
      var out = "";

      // Top Section: Cache Aside
      out += BOX(20, 30, 620, 95, "", "box", null, 8);
      out += T(35, 55, "1. Cache-Aside (Lazy Loading)", "t-title", "start");
      out += BOX(40, 68, 70, 42, "App", "box", null, 4);
      out += AR(110, 85, 180, 85, "ln-a");
      out += T(145, 78, "1. Read", "t-sm");
      out += BOX(180, 68, 80, 42, "Cache", "box-b", null, 4);
      out += AR(260, 85, 330, 85, "ln-d");
      out += T(295, 78, "2. Miss", "t-sm");
      out += BOX(330, 68, 80, 42, "Database", "box-a", null, 4);
      out += AR(410, 85, 480, 85, "ln-a");
      out += T(445, 78, "3. Populate", "t-sm");
      out += T(560, 90, "Best for read-heavy", "t-ok");

      // Middle Section: Write-Through
      out += BOX(20, 140, 620, 95, "", "box", null, 8);
      out += T(35, 165, "2. Write-Through (Sync Strong Consistency)", "t-title", "start");
      out += BOX(40, 178, 70, 42, "App", "box", null, 4);
      out += AR(110, 195, 180, 195, "ln-a");
      out += T(145, 188, "1. Write", "t-sm");
      out += BOX(180, 178, 80, 42, "Cache", "box-b", null, 4);
      out += AR(260, 195, 330, 195, "ln-a");
      out += T(295, 188, "2. Sync Write", "t-sm");
      out += BOX(330, 178, 80, 42, "Database", "box-a", null, 4);
      out += T(560, 200, "Higher write latency", "t-sm");

      // Bottom Section: Write-Behind
      out += BOX(20, 250, 620, 95, "", "box", null, 8);
      out += T(35, 275, "3. Write-Behind / Write-Back (Async High-Throughput)", "t-title", "start");
      out += BOX(40, 288, 70, 42, "App", "box", null, 4);
      out += AR(110, 305, 180, 305, "ln-a");
      out += T(145, 298, "1. Fast Write", "t-sm");
      out += BOX(180, 288, 80, 42, "Cache", "box-b", null, 4);
      out += AR(260, 305, 330, 305, "ln-d");
      out += T(295, 298, "2. Async Batch", "t-sm");
      out += BOX(330, 288, 80, 42, "Database", "box-a", null, 4);
      out += T(560, 310, "Risk of data loss on crash", "t-x");

      return out;
    }
  };

  D["sys-circuit-breaker"] = {
    vb: "0 0 660 360",
    cap: "Circuit Breaker State Transitions: CLOSED (normal operations) → OPEN (fast-fail on consecutive errors) → HALF-OPEN (testing recovery with trial requests).",
    body: function () {
      var out = "";

      // CLOSED State
      out += BOX(50, 130, 140, 100, "CLOSED", "box-a", "Normal Flow", 8);
      out += T(120, 205, "Traffic Passes", "t-ok");

      // OPEN State
      out += BOX(470, 130, 140, 100, "OPEN", "box", "Tripped State", 8);
      out += T(540, 205, "Fast-Fail / Fallback", "t-x");

      // HALF-OPEN State
      out += BOX(260, 230, 140, 90, "HALF-OPEN", "box-b", "Probe State", 8);
      out += T(330, 298, "Trial Requests", "t-sm");

      // Arrows
      // Closed -> Open (Failure threshold)
      out += AR(190, 160, 470, 160, "ln-x");
      out += T(330, 148, "Failure Rate > Threshold (e.g. 50% errors)", "t-x");

      // Open -> Half-Open (Timeout expired)
      out += AR(540, 230, 400, 280, "ln-d");
      out += T(500, 275, "Timeout Elapsed (e.g. 30s)", "t-sm");

      // Half-Open -> Closed (Success)
      out += AR(260, 280, 120, 230, "ln-a");
      out += T(170, 280, "Probe Succeeds", "t-ok");

      // Half-Open -> Open (Probe Fails)
      out += AR(400, 260, 470, 210, "ln-x");
      out += T(450, 245, "Probe Fails", "t-x");

      return out;
    }
  };

  /* ---------------- public API ---------------- */

  TD.hasDiagram = function (key) { return !!D[key]; };

  TD.diagram = function (key) {
    var d = D[key];
    if (!d) return "";
    var body;
    try { body = typeof d.body === "function" ? d.body() : d.body; }
    catch (e) { return ""; }
    return '<figure class="figure">' +
      '<svg class="dg" viewBox="' + d.vb + '" role="img" aria-label="' + TD.esc(d.cap) + '">' + body + "</svg>" +
      "<figcaption>" + TD.esc(d.cap) + "</figcaption></figure>";
  };

  TD.diagramKeys = function () { return Object.keys(D); };
})(window.TD);
