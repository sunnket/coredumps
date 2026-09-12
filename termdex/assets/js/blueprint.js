/* CoreDumps — architecture blueprint renderer.

   The project and research sections used to ship their diagrams as ASCII art
   inside a <pre>. That reads as a text dump rather than a drawing: box-drawing
   characters wrap on narrow screens, arrows never line up once the font
   changes, and none of it can be styled, coloured or made accessible.

   This renders a small declarative spec to real SVG instead:

     {
       nodes: [
         { id: "api", label: "API gateway", sub: "Go · 8 replicas",
           kind: "service", col: 0, row: 1 }
       ],
       edges: [ { from: "client", to: "api", label: "HTTPS" } ],
       groups: [ { label: "Data plane", cols: [1, 3], rows: [0, 2] } ]
     }

   Placement is explicit — `col` and `row` on a grid — because an automatic
   layout engine that occasionally produces a crossed, unreadable diagram is
   worse than one an author positioned in fifteen seconds. Everything else
   (sizing, routing, wrapping, arrowheads) is computed. */
(function (TD) {
  "use strict";

  /* ---------------- geometry ---------------- */

  var NODE_W = 176;
  var NODE_H = 66;
  var GAP_X = 54;
  var GAP_Y = 40;
  var PAD = 26;
  var GROUP_PAD = 16;

  /* Node kinds carry meaning, so they get a consistent accent and label.
     Authors pick a kind rather than a colour, which keeps every diagram in
     the product using one visual language. */
  var KINDS = {
    client:   { cls: "bp-client",   tag: "client" },
    service:  { cls: "bp-service",  tag: "service" },
    store:    { cls: "bp-store",    tag: "storage" },
    cache:    { cls: "bp-cache",    tag: "cache" },
    queue:    { cls: "bp-queue",    tag: "queue" },
    worker:   { cls: "bp-worker",   tag: "worker" },
    external: { cls: "bp-external", tag: "external" },
    model:    { cls: "bp-model",    tag: "model" },
    note:     { cls: "bp-note",     tag: "" }
  };

  var seq = 0;

  function esc(s) {
    return TD.esc(s == null ? "" : s);
  }

  /* SVG has no text wrapping, so lines are measured here. The divisor is an
     empirical average glyph width for the label font at its size — exact
     enough for two or three short lines, which is all a node should carry. */
  function wrap(text, maxWidth, charWidth) {
    var words = String(text || "").split(/\s+/).filter(Boolean);
    var perLine = Math.max(6, Math.floor(maxWidth / charWidth));
    var lines = [];
    var line = "";

    words.forEach(function (w) {
      var candidate = line ? line + " " + w : w;
      if (candidate.length <= perLine) {
        line = candidate;
        return;
      }
      if (line) lines.push(line);
      /* A single word longer than the line is hard-split rather than allowed
         to overflow the node. */
      while (w.length > perLine) {
        lines.push(w.slice(0, perLine - 1) + "-");
        w = w.slice(perLine - 1);
      }
      line = w;
    });
    if (line) lines.push(line);
    return lines;
  }

  /* ---------------- layout ---------------- */

  function layout(spec) {
    var nodes = (spec.nodes || []).map(function (n) {
      var span = Math.max(1, n.span || 1);
      return {
        id: n.id,
        label: n.label,
        sub: n.sub,
        kind: KINDS[n.kind] ? n.kind : "service",
        col: n.col || 0,
        row: n.row || 0,
        span: span,
        w: span * NODE_W + (span - 1) * GAP_X,
        h: n.tall ? NODE_H + 26 : NODE_H
      };
    });

    var byId = {};
    nodes.forEach(function (n) { byId[n.id] = n; });

    /* Row heights vary when a node is marked tall, so rows are measured
       before any y is assigned. */
    var maxCol = 0, maxRow = 0;
    nodes.forEach(function (n) {
      maxCol = Math.max(maxCol, n.col + n.span - 1);
      maxRow = Math.max(maxRow, n.row);
    });

    var rowH = [];
    for (var r = 0; r <= maxRow; r++) {
      rowH[r] = NODE_H;
      nodes.forEach(function (n) {
        if (n.row === r) rowH[r] = Math.max(rowH[r], n.h);
      });
    }

    var rowY = [];
    var y = PAD;
    for (var i = 0; i <= maxRow; i++) {
      rowY[i] = y;
      y += rowH[i] + GAP_Y;
    }

    nodes.forEach(function (n) {
      n.x = PAD + n.col * (NODE_W + GAP_X);
      /* Centre a short node inside a tall row so a row never looks ragged. */
      n.y = rowY[n.row] + (rowH[n.row] - n.h) / 2;
      n.cx = n.x + n.w / 2;
      n.cy = n.y + n.h / 2;
    });

    var width = PAD * 2 + (maxCol + 1) * NODE_W + maxCol * GAP_X;
    var height = y - GAP_Y + PAD;

    return { nodes: nodes, byId: byId, width: width, height: height, rowY: rowY, rowH: rowH };
  }

  /* ---------------- edge routing ---------------- */

  /* Anchors sit on box edges, not centres, so an arrowhead lands on the
     border rather than under the node. */
  function anchor(n, side) {
    switch (side) {
      case "top": return { x: n.cx, y: n.y };
      case "bottom": return { x: n.cx, y: n.y + n.h };
      case "left": return { x: n.x, y: n.cy };
      default: return { x: n.x + n.w, y: n.cy };
    }
  }

  function routeEdge(a, b) {
    /* Same row: a straight horizontal run between facing sides. */
    if (a.row === b.row) {
      var leftFirst = a.cx <= b.cx;
      var p0 = anchor(a, leftFirst ? "right" : "left");
      var p1 = anchor(b, leftFirst ? "left" : "right");
      return {
        d: "M" + p0.x + " " + p0.y + " L" + p1.x + " " + p1.y,
        mid: { x: (p0.x + p1.x) / 2, y: p0.y - 9 }
      };
    }

    /* Same column: a straight vertical run. */
    if (Math.abs(a.cx - b.cx) < 2) {
      var downFirst = a.cy <= b.cy;
      var q0 = anchor(a, downFirst ? "bottom" : "top");
      var q1 = anchor(b, downFirst ? "top" : "bottom");
      return {
        d: "M" + q0.x + " " + q0.y + " L" + q1.x + " " + q1.y,
        mid: { x: q0.x + 8, y: (q0.y + q1.y) / 2 }
      };
    }

    /* Otherwise an orthogonal elbow: leave vertically, turn once at the
       target's centre line, arrive horizontally into its nearest side. The
       quadratic at the corner keeps it from looking like a circuit diagram. */
    var down = a.cy < b.cy;
    var s = anchor(a, down ? "bottom" : "top");
    var e = anchor(b, b.cx > a.cx ? "left" : "right");

    var dirY = down ? 1 : -1;
    var dirX = e.x > s.x ? 1 : -1;
    /* Never round more than half the run, or a short elbow inverts itself. */
    var r = Math.min(10, Math.abs(e.y - s.y) / 2, Math.abs(e.x - s.x) / 2);

    var d = "M" + s.x + " " + s.y +
      " L" + s.x + " " + (e.y - dirY * r) +
      " Q" + s.x + " " + e.y + " " + (s.x + dirX * r) + " " + e.y +
      " L" + e.x + " " + e.y;

    return { d: d, mid: { x: (s.x + e.x) / 2, y: e.y - 9 } };
  }

  /* ---------------- rendering ---------------- */

  function renderNode(n) {
    var kind = KINDS[n.kind];
    var labelLines = wrap(n.label, n.w - 26, 7.15);
    var subLines = n.sub ? wrap(n.sub, n.w - 26, 6.0).slice(0, 2) : [];

    /* Vertically centre the whole text block inside the node. */
    var labelLH = 15;
    var subLH = 12;
    var blockH = labelLines.length * labelLH + (subLines.length ? subLines.length * subLH + 4 : 0);
    var top = n.y + (n.h - blockH) / 2 + 11;

    var labelSvg = labelLines.map(function (line, i) {
      return '<tspan x="' + n.cx + '" y="' + (top + i * labelLH) + '">' + esc(line) + "</tspan>";
    }).join("");

    var subTop = top + labelLines.length * labelLH + 2;
    var subSvg = subLines.map(function (line, i) {
      return '<tspan x="' + n.cx + '" y="' + (subTop + i * subLH) + '">' + esc(line) + "</tspan>";
    }).join("");

    return '<g class="bp-node ' + kind.cls + '">' +
      '<rect x="' + n.x + '" y="' + n.y + '" width="' + n.w + '" height="' + n.h +
        '" rx="10" class="bp-node-box"/>' +
      '<rect x="' + n.x + '" y="' + n.y + '" width="4" height="' + n.h +
        '" rx="2" class="bp-node-accent"/>' +
      '<text class="bp-node-label" text-anchor="middle">' + labelSvg + "</text>" +
      (subSvg ? '<text class="bp-node-sub" text-anchor="middle">' + subSvg + "</text>" : "") +
    "</g>";
  }

  function renderGroup(g, L) {
    var cols = g.cols || [0, 0];
    var rows = g.rows || [0, 0];
    var x = PAD + cols[0] * (NODE_W + GAP_X) - GROUP_PAD;
    var right = PAD + cols[1] * (NODE_W + GAP_X) + NODE_W + GROUP_PAD;
    var y = (L.rowY[rows[0]] || PAD) - GROUP_PAD - 12;
    var bottomRow = rows[1];
    var bottom = (L.rowY[bottomRow] || PAD) + (L.rowH[bottomRow] || NODE_H) + GROUP_PAD;

    return '<g class="bp-group">' +
      '<rect x="' + x + '" y="' + y + '" width="' + (right - x) + '" height="' + (bottom - y) +
        '" rx="14" class="bp-group-box"/>' +
      '<text class="bp-group-label" x="' + (x + 13) + '" y="' + (y + 15) + '">' +
        esc(g.label) + "</text>" +
    "</g>";
  }

  function renderEdge(e, L, arrowId) {
    var a = L.byId[e.from];
    var b = L.byId[e.to];
    if (!a || !b) return "";

    var route = routeEdge(a, b);
    var cls = "bp-edge" + (e.dashed ? " is-dashed" : "") + (e.muted ? " is-muted" : "");

    var label = "";
    if (e.label) {
      var text = String(e.label);
      var w = text.length * 5.6 + 14;
      label = '<g class="bp-edge-label">' +
        '<rect x="' + (route.mid.x - w / 2) + '" y="' + (route.mid.y - 9) +
          '" width="' + w + '" height="17" rx="8"/>' +
        '<text x="' + route.mid.x + '" y="' + (route.mid.y + 3.5) +
          '" text-anchor="middle">' + esc(text) + "</text>" +
      "</g>";
    }

    return '<path class="' + cls + '" d="' + route.d +
      '" marker-end="url(#' + arrowId + (e.muted ? "-muted" : "") + ')"/>' + label;
  }

  /* Render a blueprint spec to an SVG string.

     The result scales with its container via a viewBox, and is wrapped in a
     scroll container so a wide diagram never forces the page sideways. */
  TD.blueprint = function (spec) {
    if (!spec || !spec.nodes || !spec.nodes.length) return "";

    seq++;
    var arrowId = "bp-arrow-" + seq;
    var L = layout(spec);

    var groups = (spec.groups || []).map(function (g) { return renderGroup(g, L); }).join("");
    var edges = (spec.edges || []).map(function (e) { return renderEdge(e, L, arrowId); }).join("");
    var nodes = L.nodes.map(renderNode).join("");

    var legendKinds = {};
    L.nodes.forEach(function (n) { legendKinds[n.kind] = true; });
    var legend = Object.keys(legendKinds)
      .filter(function (k) { return KINDS[k].tag; })
      .map(function (k) {
        return '<span class="bp-key ' + KINDS[k].cls + '"><i></i>' + KINDS[k].tag + "</span>";
      }).join("");

    var defs =
      '<defs>' +
        '<marker id="' + arrowId + '" viewBox="0 0 10 10" refX="9" refY="5" ' +
          'markerWidth="7" markerHeight="7" orient="auto-start-reverse">' +
          '<path d="M0 0 L10 5 L0 10 z" class="bp-arrowhead"/>' +
        '</marker>' +
        '<marker id="' + arrowId + '-muted" viewBox="0 0 10 10" refX="9" refY="5" ' +
          'markerWidth="7" markerHeight="7" orient="auto-start-reverse">' +
          '<path d="M0 0 L10 5 L0 10 z" class="bp-arrowhead is-muted"/>' +
        '</marker>' +
      '</defs>';

    return '<figure class="bp">' +
      (spec.title
        ? '<figcaption class="bp-title">' + TD.icon("flow") + esc(spec.title) + "</figcaption>"
        : "") +
      '<div class="bp-canvas">' +
        '<svg viewBox="0 0 ' + L.width + " " + L.height + '" ' +
          'width="' + L.width + '" height="' + L.height + '" ' +
          'role="img" aria-label="' + esc(spec.alt || spec.title || "Architecture diagram") + '">' +
          defs + groups + edges + nodes +
        "</svg>" +
      "</div>" +
      (legend ? '<div class="bp-legend">' + legend + "</div>" : "") +
      (spec.note ? '<p class="bp-note">' + TD.mdLine(spec.note) + "</p>" : "") +
    "</figure>";
  };

  /* A plain-text rendering of the same spec, for the copy button and for
     anyone who wants the structure in a commit message or a design doc. */
  TD.blueprintText = function (spec) {
    if (!spec || !spec.nodes) return "";
    var lines = [];
    if (spec.title) lines.push(spec.title, "");

    var byId = {};
    spec.nodes.forEach(function (n) { byId[n.id] = n; });

    lines.push("Components");
    spec.nodes.forEach(function (n) {
      lines.push("  - " + n.label + (n.sub ? "  (" + n.sub + ")" : ""));
    });

    if (spec.edges && spec.edges.length) {
      lines.push("", "Flow");
      spec.edges.forEach(function (e) {
        var a = byId[e.from], b = byId[e.to];
        if (!a || !b) return;
        lines.push("  " + a.label + "  ->  " + b.label + (e.label ? "   [" + e.label + "]" : ""));
      });
    }

    if (spec.note) lines.push("", "Note: " + spec.note);
    return lines.join("\n");
  };
})(window.TD = window.TD || {});
