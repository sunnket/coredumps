/* Computer vision diagrams, including the ones that have to move.

   Convolution is the clearest case in the whole app for animation. Described
   in words it is "a small matrix slides across the image and you multiply and
   sum at each position", which is accurate and teaches almost nobody. Drawn
   as a still, it shows the kernel in one arbitrary position and the reader
   has to imagine the sliding — which is the entire operation. Watching a 3×3
   window step across a grid while the output fills in one cell at a time
   collapses a week of confusion into about four seconds.

   Non-maximum suppression is the same story: it is a loop that deletes boxes,
   and a still picture of it is either "before" or "after", never the process
   that connects them.

   The mechanics follow assets/js/machine.js exactly — CSS keyframes on inline
   SVG, no runtime JavaScript, every figure authored so the motionless frame
   still reads correctly, because prefers-reduced-motion switches all of it
   off. The moving vocabulary is shared with that file via the same class
   names, so a reader's motion preference is honoured identically everywhere.

   This file wraps the diagram registry the same way machine.js does, so it
   must load after both diagrams.js and machine.js. */
(function (TD) {
  "use strict";

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
    return '<path class="' + (cls || "ln") + '" d="M' + n(x1) + " " + n(y1) +
      "L" + n(x2) + " " + n(y2) + '"/>';
  }

  function head(x2, y2, a, cls) {
    var s = 6;
    var bx = x2 - Math.cos(a) * s * 1.5, by = y2 - Math.sin(a) * s * 1.5;
    var px = Math.cos(a + Math.PI / 2) * s * 0.6, py = Math.sin(a + Math.PI / 2) * s * 0.6;
    var fill = cls === "ln-a" ? "fill-a" : cls === "ln-b" ? "fill-b" : "dotgrid";
    return '<path class="' + fill + '" d="M' + n(x2) + " " + n(y2) + "L" +
      n(bx + px) + " " + n(by + py) + "L" + n(bx - px) + " " + n(by - py) + 'Z"/>';
  }

  function AR(x1, y1, x2, y2, cls) {
    var a = Math.atan2(y2 - y1, x2 - x1);
    var bx = x2 - Math.cos(a) * 7, by = y2 - Math.sin(a) * 7;
    return L(x1, y1, bx, by, cls) + head(x2, y2, a, cls);
  }

  /* A grid of cells, optionally with numbers in them. The unit of nearly
     every diagram here, because an image *is* this. */
  function GRID(x, y, cols, rows, cell, cls, values) {
    var o = "", i, j, k = 0;
    for (j = 0; j < rows; j++) {
      for (i = 0; i < cols; i++) {
        var cx = x + i * cell, cy = y + j * cell;
        o += '<rect x="' + n(cx) + '" y="' + n(cy) + '" width="' + n(cell) +
          '" height="' + n(cell) + '" class="' + (cls || "box") + '"/>';
        if (values && values[k] != null) {
          o += T(cx + cell / 2, cy + cell / 2 + 3.5, String(values[k]), "t-sm");
        }
        k++;
      }
    }
    return o;
  }

  /* ---------------- the diagrams ---------------- */

  var V = {};

  /* 1. An image is a grid of numbers. The first thing a CV course must
        establish, and the one people nod along to without believing. */
  V["cv-pixels"] = {
    vb: "0 0 640 300",
    cap: "There is no picture in the file — only a grid of numbers.",
    body: function () {
      var o = T(120, 26, "What you see", "t-title");

      /* a crude greyscale "image": a bright diagonal on a dark ground */
      var vals = [30, 40, 45, 200, 210, 35, 45, 205, 215, 40,
                  190, 200, 45, 35, 30, 195, 40, 35, 30, 25,
                  45, 40, 35, 30, 28];
      var i;
      for (i = 0; i < 25; i++) {
        var col = vals[i];
        var sh = col > 120 ? "box-a" : "box";
        o += '<rect x="' + (40 + (i % 5) * 32) + '" y="' + (44 + Math.floor(i / 5) * 32) +
          '" width="32" height="32" class="' + sh + '"/>';
      }
      o += T(120, 226, "a tiny 5×5 photograph", "t-sm");

      o += AR(212, 124, 268, 124, "ln-a");
      o += T(240, 112, "is", "t-sm");

      o += T(430, 26, "What the computer has", "t-title");
      o += GRID(300, 44, 5, 5, 32, "box", vals);
      o += T(430, 226, "0 = black, 255 = white", "t-sm");

      o += BOX(120, 250, 400, 36, "", "box-a", null, 8);
      o += T(320, 272, "Every technique in this track is arithmetic on those numbers.", "t-title");
      return o;
    }
  };

  /* 2. Convolution, moving. The reason this file exists. */
  V["cv-convolution"] = {
    vb: "0 0 640 320",
    cap: "A kernel slides across the image; each position produces one output number.",
    body: function () {
      var dur = 6;                     /* one full pass */
      var steps = 9;                   /* 3×3 output positions */
      var cell = 34;
      var gx = 40, gy = 56;

      var o = T(150, 30, "Input  5×5", "t-title");
      o += GRID(gx, gy, 5, 5, cell, "box");

      /* The sliding kernel. Nine positions, stepping left-to-right then down,
         held briefly at each so the eye can land on it. */
      var frames = [];
      var r, c;
      for (r = 0; r < 3; r++) {
        for (c = 0; c < 3; c++) {
          frames.push([gx + c * cell, gy + r * cell]);
        }
      }
      var pts = frames.map(function (p) { return n(p[0]) + " " + n(p[1]); });
      o += '<g class="mv-slide" style="animation-duration:' + dur + 's">' +
        '<rect x="0" y="0" width="' + n(cell * 3) + '" height="' + n(cell * 3) +
        '" rx="3" class="box-b mv-lit"/>' +
        '<animate attributeName="x" dur="' + dur + 's" repeatCount="indefinite" ' +
        'calcMode="discrete" values="' + frames.map(function (p) { return n(p[0]); }).join(";") + '"/>' +
        '<animate attributeName="y" dur="' + dur + 's" repeatCount="indefinite" ' +
        'calcMode="discrete" values="' + frames.map(function (p) { return n(p[1]); }).join(";") + '"/>' +
        "</g>";
      o += T(150, 240, "the 3×3 kernel steps across", "t-sm");

      o += AR(226, 140, 286, 140, "ln-a");
      o += T(256, 128, "×  +", "t-sm");

      o += T(430, 30, "Output  3×3", "t-title");
      /* the output grid, whose cells light up in the same order */
      o += GRID(370, 90, 3, 3, cell, "box");
      var k;
      for (k = 0; k < steps; k++) {
        var ox = 370 + (k % 3) * cell, oy = 90 + Math.floor(k / 3) * cell;
        o += '<g class="mv-fill" style="animation-duration:' + dur +
          's;animation-delay:' + n(-dur + (dur / steps) * k) + 's">' +
          '<rect x="' + n(ox) + '" y="' + n(oy) + '" width="' + n(cell) +
          '" height="' + n(cell) + '" class="box-a"/></g>';
      }
      o += T(430, 240, "one number per kernel position", "t-sm");

      o += BOX(90, 262, 460, 40, "", "box", null, 8);
      o += T(320, 279, "Output is smaller than input — the kernel cannot hang off the edge.", "t-sm");
      o += T(320, 294, "Padding adds a border to keep the size; stride makes it jump further.", "t-sm");
      return o;
    }
  };

  /* 3. What the layers learn. The picture that makes depth make sense. */
  V["cv-hierarchy"] = {
    vb: "0 0 640 260",
    cap: "Early layers find edges; later layers combine them into parts, then objects.",
    body: function () {
      var stages = [
        ["Layer 1", "edges, colours", "▟ ▛ ▚"],
        ["Layer 3", "corners, textures", "◪ ◩ ◈"],
        ["Layer 6", "parts — an eye, a wheel", "◕ ◑"],
        ["Layer 12", "whole objects", "☺ ⌂"]
      ];
      var o = T(320, 26, "Nobody programmed any of this — it emerges from training", "t-sm");
      stages.forEach(function (s, i) {
        var x = 26 + i * 152;
        o += BOX(x, 50, 132, 96, "", i === 0 ? "box-a" : "box", null, 9);
        o += T(x + 66, 74, s[0], "t-title");
        o += T(x + 66, 106, s[2], "t-title");
        o += T(x + 66, 134, s[1], "t-sm");
        if (i < 3) o += AR(x + 132, 98, x + 152, 98, "ln-a");
      });
      o += BOX(80, 174, 480, 62, "", "box", null, 8);
      o += T(320, 196, "Each layer sees a wider patch of the original image than the last.", "t-sm");
      o += T(320, 212, "That growing window is the receptive field, and it is why depth", "t-sm");
      o += T(320, 228, "lets a network go from edges to objects.", "t-sm");
      return o;
    }
  };

  /* 4. IoU. Two boxes and a ratio — the metric everything in detection
        is scored against. */
  V["cv-iou"] = {
    vb: "0 0 640 280",
    cap: "Intersection over Union: how much two boxes agree.",
    body: function () {
      var o = T(320, 26, "IoU = area of overlap ÷ area of union", "t-title");

      /* ground truth and prediction, deliberately offset */
      o += '<rect x="120" y="60" width="150" height="110" rx="4" class="box-a"/>';
      o += T(120, 52, "ground truth", "t-sm", "start");
      o += '<rect x="190" y="96" width="150" height="110" rx="4" class="box-b"/>';
      o += T(340, 220, "prediction", "t-sm", "end");

      /* the overlap, pulsing so it is unmistakably the shared region */
      o += '<rect x="190" y="96" width="80" height="74" class="fill-a mv-breathe" ' +
        'style="animation-duration:2.6s;opacity:.55"/>';
      o += T(230, 138, "overlap", "t-sm");

      o += T(430, 76, "IoU  ≥ 0.5", "t-title", "start");
      o += T(430, 94, "usually counted as correct", "t-sm", "start");
      o += T(430, 126, "IoU  ≥ 0.75", "t-title", "start");
      o += T(430, 144, "a strict benchmark", "t-sm", "start");
      o += T(430, 176, "IoU  = 0", "t-title", "start");
      o += T(430, 194, "no overlap at all", "t-sm", "start");

      o += BOX(80, 232, 480, 36, "", "box", null, 8);
      o += T(320, 254, "Two boxes can overlap a lot and still score badly if either is much larger.", "t-sm");
      return o;
    }
  };

  /* 5. NMS, as a process. A still frame of this is either the input or the
        output, never the thing itself. */
  V["cv-nms"] = {
    vb: "0 0 640 280",
    cap: "Non-maximum suppression: keep the best box, delete everything overlapping it.",
    body: function () {
      var dur = 4;
      var o = T(320, 26, "One object, five detections — keep one", "t-title");

      /* five overlapping candidate boxes with confidence scores; the four
         losers fade out in sequence, leaving the winner */
      var cands = [
        [140, 70, 150, 110, "0.62", 0],
        [160, 84, 150, 110, "0.71", 1],
        [128, 92, 150, 110, "0.55", 2],
        [172, 62, 150, 110, "0.48", 3]
      ];
      cands.forEach(function (c, i) {
        o += '<g class="mv-suppress" style="animation-duration:' + dur +
          's;animation-delay:' + n((dur / 6) * i) + 's">' +
          '<rect x="' + c[0] + '" y="' + c[1] + '" width="' + c[2] + '" height="' + c[3] +
          '" rx="4" class="box"/>' +
          T(c[0] + 20, c[1] - 5, c[4], "t-sm") + "</g>";
      });

      /* the winner, always visible */
      o += '<rect x="150" y="78" width="150" height="110" rx="4" class="box-a"/>';
      o += T(172, 72, "0.94", "t-title");

      o += T(430, 84, "1. sort by confidence", "t-sm", "start");
      o += T(430, 108, "2. keep the highest", "t-sm", "start");
      o += T(430, 132, "3. delete anything overlapping", "t-sm", "start");
      o += T(444, 148, "it by more than the threshold", "t-sm", "start");
      o += T(430, 172, "4. repeat with what is left", "t-sm", "start");

      o += BOX(80, 214, 480, 52, "", "box", null, 8);
      o += T(320, 234, "Threshold too high: duplicate boxes on one object.", "t-sm");
      o += T(320, 252, "Too low: a real second object next to the first gets deleted.", "t-sm");
      return o;
    }
  };

  /* 6. The three vision tasks, side by side. The distinction people get
        wrong in interviews. */
  V["cv-tasks"] = {
    vb: "0 0 640 250",
    cap: "Classification, detection, segmentation — increasing precision, increasing cost.",
    body: function () {
      var o = "";
      var panels = [
        ["Classification", "“a cat”", "one label for the whole image"],
        ["Detection", "“a cat, here”", "a box per object"],
        ["Segmentation", "“these pixels”", "a label for every pixel"]
      ];
      panels.forEach(function (p, i) {
        var x = 24 + i * 202;
        o += BOX(x, 44, 182, 130, "", "box", null, 9);
        o += T(x + 91, 68, p[0], "t-title");

        /* a small scene, drawn three ways */
        if (i === 0) {
          o += '<rect x="' + (x + 44) + '" y="86" width="94" height="66" rx="4" class="box-a"/>';
          o += T(x + 91, 124, p[1], "t-title");
        } else if (i === 1) {
          o += '<rect x="' + (x + 44) + '" y="86" width="94" height="66" rx="4" class="box"/>';
          o += '<rect x="' + (x + 58) + '" y="98" width="52" height="42" rx="3" class="box-a"/>';
          o += T(x + 84, 152, p[1], "t-sm");
        } else {
          o += '<rect x="' + (x + 44) + '" y="86" width="94" height="66" rx="4" class="box"/>';
          o += '<circle cx="' + (x + 84) + '" cy="118" r="22" class="fill-a" opacity=".6"/>';
          o += T(x + 91, 164, p[1], "t-sm");
        }
        o += T(x + 91, 190, p[2], "t-sm");
      });
      o += BOX(80, 206, 480, 34, "", "box-a", null, 8);
      o += T(320, 227, "Pick the least precise one that answers your actual question.", "t-title");
      return o;
    }
  };

  /* 7. Transfer learning — the picture of how CV is really done. */
  V["cv-transfer"] = {
    vb: "0 0 640 250",
    cap: "Keep the layers that learned to see; replace only the layers that decide.",
    body: function () {
      var o = T(320, 26, "A pretrained network, adapted", "t-title");

      o += BOX(40, 52, 400, 78, "", "box", null, 9);
      o += T(240, 44, "frozen — learned from a million images", "t-sm");
      var i;
      for (i = 0; i < 6; i++) {
        o += BOX(56 + i * 64, 68, 52, 46, "conv", "box-a", null, 6);
      }

      o += BOX(460, 52, 140, 78, "", "box", null, 9);
      o += T(530, 44, "yours — trained on your data", "t-sm");
      o += BOX(476, 68, 108, 46, "new head", "box-b", null, 6);

      o += AR(440, 91, 460, 91, "ln-a");

      o += BOX(40, 152, 560, 82, "", "box", null, 8);
      o += T(320, 174, "Edges, textures and shapes are the same in every photograph ever taken,", "t-sm");
      o += T(320, 190, "so those layers are already correct for your problem.", "t-sm");
      o += T(320, 212, "Two hundred of your own images beats two million from scratch.", "t-title");
      return o;
    }
  };

  /* ---------------- registration ----------------
     Wraps whatever registry is already in place — diagrams.js, then
     machine.js — so all three sets are reachable through one API. */

  var baseHas = TD.hasDiagram;
  var baseGet = TD.diagram;
  var baseKeys = TD.diagramKeys;

  TD.hasDiagram = function (key) {
    return !!V[key] || (baseHas ? baseHas(key) : false);
  };

  TD.diagram = function (key) {
    var d = V[key];
    if (!d) return baseGet ? baseGet(key) : "";
    var body;
    try { body = typeof d.body === "function" ? d.body() : d.body; }
    catch (e) { return ""; }
    return '<figure class="figure">' +
      '<svg class="dg dg-live" viewBox="' + d.vb + '" role="img" aria-label="' +
      TD.esc(d.cap) + '">' + body + "</svg>" +
      "<figcaption>" + TD.esc(d.cap) + "</figcaption></figure>";
  };

  TD.diagramKeys = function () {
    return (baseKeys ? baseKeys() : []).concat(Object.keys(V));
  };

  TD.visionDiagrams = V;

})(window.TD);
