/* The machine, drawn and moving.

   Ground Zero opens with a module about the physical computer, and a
   physical computer is the one subject in this whole app where a still
   picture actively lies. A bus is not a line, it is traffic. A clock is not
   a number, it is a beat. The fetch-decode-execute cycle is not a triangle
   of boxes, it is a loop that never stops turning while the machine is on.
   A reader who has only seen the still version has to be *told* the machine
   is fast; a reader who has watched the pulses run can see it.

   So these diagrams animate, and everything about how they animate is
   decided by three constraints:

     1. No JavaScript at runtime. The motion is CSS keyframes on an inline
        SVG, so a diagram is still one string of markup that the lesson
        renderer drops in place. Nothing to wire, nothing to tear down, and
        no way for a diagram to leak a timer into a view that has moved on.

     2. No external anything, in keeping with the rest of the app.

     3. Still correct when nothing moves. Every diagram is authored so the
        motionless frame reads properly on its own, because under
        prefers-reduced-motion the animation is switched off entirely and
        the reader must lose decoration, never information.

   The animation vocabulary lives here rather than in diagrams.js because it
   is genuinely different work — diagrams.js draws structure, this draws
   time. They share the same CSS custom properties, so a diagram from either
   file is theme-aware and sits in the same figure frame. */
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

  /* ---------------- the moving vocabulary ----------------

     Each helper emits a shape plus an inline animation-delay, and the
     keyframes themselves live in the stylesheet. Delay is the only thing
     that varies per shape, which is what lets one keyframe rule drive a
     whole convoy of pulses down a wire at even spacing. */

  /* A packet travelling a straight wire, over and over. `i` of `count`
     spaces the convoy out across one full period. */
  function PULSE(x1, y1, x2, y2, i, count, dur, cls) {
    var delay = -(dur * (i / count));
    return '<circle r="3.4" class="' + (cls || "fill-a") + ' mv-pulse" ' +
      'style="animation-duration:' + dur + 's;animation-delay:' + n(delay) + 's">' +
      '<animateMotion dur="' + dur + 's" repeatCount="indefinite" ' +
      'begin="' + n(delay) + 's" path="M' + n(x1) + " " + n(y1) + "L" + n(x2) + " " + n(y2) + '"/>' +
      "</circle>";
  }

  /* The same, but the reader is told what is on the wire. Used once, on the
     bus diagram, because a labelled packet explains a bus better than six
     anonymous dots. */
  function PACKET(x1, y1, x2, y2, label, dur, delay, cls) {
    return '<g class="mv-fade" style="animation-duration:' + dur + 's;animation-delay:' + n(delay) + 's">' +
      '<rect x="-16" y="-8" width="32" height="16" rx="4" class="' + (cls || "box-a") + '"/>' +
      T(0, 4, label, "t-sm") +
      '<animateMotion dur="' + dur + 's" repeatCount="indefinite" begin="' + n(delay) + 's" ' +
      'path="M' + n(x1) + " " + n(y1) + "L" + n(x2) + " " + n(y2) + '"/></g>';
  }

  /* A box that lights up for its slice of a shared cycle. This is the
     workhorse: it is how the fetch-decode-execute ring shows which stage is
     currently running without any script deciding. */
  function STAGE(x, y, w, h, label, sub, i, count, dur) {
    var delay = -(dur * (i / count));
    return '<g class="mv-stage" style="animation-duration:' + dur + 's;animation-delay:' + n(delay) + 's">' +
      '<rect x="' + n(x) + '" y="' + n(y) + '" width="' + n(w) + '" height="' + n(h) +
      '" rx="8" class="box-a mv-lit"/></g>' +
      BOX(x, y, w, h, label, "box-none", sub, 8);
  }

  /* The clock: a bar that fills, empties and fills again. */
  function TICK(x, y, w, h, dur, delay) {
    return '<rect x="' + n(x) + '" y="' + n(y) + '" width="' + n(w) + '" height="' + n(h) +
      '" rx="3" class="box"/>' +
      '<rect x="' + n(x) + '" y="' + n(y) + '" width="' + n(w) + '" height="' + n(h) +
      '" rx="3" class="fill-a mv-tick" style="animation-duration:' + dur +
      's;animation-delay:' + n(delay || 0) + 's"/>';
  }

  /* ---------------- the diagrams ---------------- */

  var M = {};

  /* 1. The whole box, once, so every later diagram has a home to sit in.
        Nothing here moves except the power light, because the point of this
        one is orientation rather than mechanism. */
  M["mc-box"] = {
    vb: "0 0 640 300",
    cap: "The five things inside every computer — a phone, a laptop, a server rack.",
    body: function () {
      var o = BOX(20, 20, 600, 260, "", "box", null, 14);
      o += T(40, 44, "The case", "t-sm", "start");

      /* the power light: the one thing that says the machine is alive */
      o += '<circle cx="596" cy="40" r="5" class="fill-a mv-breathe" ' +
        'style="animation-duration:3s"/>';

      o += BOX(56, 74, 150, 92, "CPU", "box-a", "does the thinking", 10);
      o += T(131, 152, "billions of steps a second", "t-sm");

      o += BOX(246, 74, 150, 92, "RAM", "box-b", "the desk", 10);
      o += T(321, 152, "fast · forgets on power-off", "t-sm");

      o += BOX(436, 74, 150, 92, "Storage", "box", "the filing cabinet", 10);
      o += T(511, 152, "slow · remembers forever", "t-sm");

      o += BOX(56, 198, 240, 62, "The bus", "box", "the roads between them", 10);
      o += BOX(336, 198, 250, 62, "GPU", "box", "thousands of tiny workers", 10);

      /* traffic on the bus, so the one moving part is the one that is
         genuinely always moving */
      for (var i = 0; i < 5; i++) o += PULSE(72, 245, 280, 245, i, 5, 2.4);

      return o;
    }
  };

  /* 2. Fetch, decode, execute — the loop that is the whole machine. */
  M["mc-cycle"] = {
    vb: "0 0 640 300",
    cap: "The cycle every computer has run since 1945, billions of times a second.",
    body: function () {
      var dur = 3;
      var o = T(320, 26, "One instruction, start to finish", "t-title");

      o += STAGE(40, 60, 160, 84, "FETCH", "go get the next one", 0, 3, dur);
      o += STAGE(240, 60, 160, 84, "DECODE", "what does it mean?", 1, 3, dur);
      o += STAGE(440, 60, 160, 84, "EXECUTE", "do it", 2, 3, dur);

      o += AR(200, 102, 240, 102, "ln-a");
      o += AR(400, 102, 440, 102, "ln-a");

      /* the return arc: the reason it is a cycle and not a list */
      o += '<path class="ln-a" d="M520 144 L520 196 L120 196 L120 144" fill="none"/>';
      o += head(120, 148, -Math.PI / 2, "ln-a");
      o += T(320, 214, "and again, and again, and again", "t-sm");

      /* the clock underneath: what actually paces the loop */
      o += T(60, 252, "The clock", "t-sm", "start");
      for (var i = 0; i < 12; i++) o += TICK(60 + i * 26, 262, 16, 14, dur / 3, -(dur / 3) * (i / 12));
      o += T(400, 274, "every tick, one more step — 3 billion times a second", "t-sm", "start");

      return o;
    }
  };

  /* 3. The memory hierarchy, drawn as distance rather than as a list,
        because the entire point is that farther means slower. */
  M["mc-memory"] = {
    vb: "0 0 640 320",
    cap: "Everything is a trade between how fast it is and how much it holds.",
    body: function () {
      var rows = [
        ["Registers", "inside the CPU", "~1 tick", "a few hundred bytes", 0],
        ["Cache", "on the CPU chip", "~4–40 ticks", "megabytes", 1],
        ["RAM", "a chip away", "~200 ticks", "gigabytes", 2],
        ["SSD", "down the bus", "~500,000 ticks", "terabytes", 3],
        ["The network", "another building", "~100,000,000 ticks", "everything", 4]
      ];
      var o = T(320, 24, "The closer it is, the faster — and the less of it there is", "t-title");
      rows.forEach(function (r, i) {
        var y = 46 + i * 52;
        var w = 120 + i * 96;                  /* wider = holds more */
        o += BOX(40, y, w, 40, "", i === 0 ? "box-a" : "box", null, 8);
        o += T(52, y + 18, r[0], "t-title", "start");
        o += T(52, y + 32, r[1], "t-sm", "start");
        o += T(628, y + 18, r[2], "t-sm", "end");
        o += T(628, y + 32, r[3], "t-sm", "end");
      });
      /* one pulse per tier, each slower than the last: the delay you can
         see rather than the delay you are told about */
      [1.1, 1.6, 2.3, 3.4, 4.8].forEach(function (d, i) {
        o += PULSE(46, 66 + i * 52, 46 + 110 + i * 96, 66 + i * 52, 0, 1, d,
          i === 0 ? "fill-a" : "fill-b");
      });
      return o;
    }
  };

  /* 4. CPU versus GPU. The single most useful picture in the module,
        because it is the one that explains the reader's future hardware
        bill without a word of jargon. */
  M["mc-cpu-gpu"] = {
    vb: "0 0 640 300",
    cap: "Four brilliant workers, or four thousand simple ones. Different jobs.",
    body: function () {
      var o = T(160, 26, "CPU", "t-title") + T(160, 42, "a few very clever cores", "t-sm");
      var i, j;
      for (i = 0; i < 2; i++) for (j = 0; j < 2; j++) {
        o += BOX(72 + j * 92, 62 + i * 74, 76, 60, "core", "box-a", null, 8);
        o += PULSE(78 + j * 92, 132 + i * 74, 142 + j * 92, 132 + i * 74, 0, 1, 1.2);
      }
      o += T(160, 232, "does one hard thing at a time,", "t-sm");
      o += T(160, 248, "extremely fast", "t-sm");
      o += T(160, 272, "runs your operating system, your browser,", "t-sm");
      o += T(160, 286, "the code you are about to write", "t-sm");

      o += L(320, 50, 320, 270, "ln-d");

      o += T(480, 26, "GPU", "t-title") + T(480, 42, "thousands of simple ones", "t-sm");
      for (i = 0; i < 8; i++) for (j = 0; j < 14; j++) {
        var x = 366 + j * 16, y = 62 + i * 16;
        o += '<rect x="' + x + '" y="' + y + '" width="11" height="11" rx="2" ' +
          'class="box-b mv-twinkle" style="animation-duration:1.6s;animation-delay:' +
          n(-((i * 14 + j) % 12) * 0.13) + 's"/>';
      }
      o += T(480, 232, "does the same easy thing", "t-sm");
      o += T(480, 248, "to four thousand numbers at once", "t-sm");
      o += T(480, 272, "which is exactly what training a model is —", "t-sm");
      o += T(480, 286, "the same multiply, a trillion times over", "t-sm");
      return o;
    }
  };

  /* 5. What a bit physically is. The bottom of the whole stack: the point
        where the reader stops taking "it's all ones and zeros" on faith. */
  M["mc-bits"] = {
    vb: "0 0 640 260",
    cap: "A bit is a switch. Everything above it is agreement about what the switches mean.",
    body: function () {
      var o = T(320, 24, "One wire, two possible states", "t-title");
      var i;
      for (i = 0; i < 8; i++) {
        var x = 96 + i * 58;
        o += BOX(x, 44, 42, 42, "", "box", null, 6);
        o += '<circle cx="' + (x + 21) + '" cy="65" r="12" class="fill-a mv-blink" ' +
          'style="animation-duration:2.4s;animation-delay:' + n(-i * 0.3) + 's"/>';
        o += T(x + 21, 104, i < 4 ? "0 or 1" : "on or off", "t-sm");
      }
      o += T(320, 138, "Eight of them together is a byte — 256 possible patterns", "t-sm");

      o += BOX(96, 158, 448, 34, "", "box-a", null, 8);
      o += T(320, 180, "01001000  01101001", "t-mono");
      o += AR(320, 192, 320, 214, "ln-a");
      o += T(320, 234, "“Hi”  —  because everyone agreed 01001000 means H", "t-title");
      return o;
    }
  };

  /* 6. Where a running program actually lives. This is the bridge from the
        hardware module into the software one: the same picture that
        01-machine.js describes in words, drawn in the parts just learned. */
  M["mc-run"] = {
    vb: "0 0 640 300",
    cap: "Double-click to running program: what physically moves.",
    body: function () {
      var o = BOX(30, 60, 150, 78, "Storage", "box", "your file, asleep", 10);
      o += T(105, 158, "program.py", "t-mono");

      o += BOX(245, 60, 150, 78, "RAM", "box-b", "loaded, awake", 10);
      o += T(320, 158, "now it is a process", "t-sm");

      o += BOX(460, 60, 150, 78, "CPU", "box-a", "running it", 10);
      o += T(535, 158, "line by line", "t-sm");

      o += PACKET(180, 99, 245, 99, "load", 3, 0);
      o += PACKET(395, 99, 460, 99, "run", 3, 1.5);

      o += T(320, 210, "1. you double-click   2. the OS copies it into RAM   " +
        "3. the CPU starts reading", "t-sm");

      o += BOX(140, 232, 360, 44, "", "box", null, 8);
      o += T(320, 252, "Close it, or pull the plug", "t-title");
      o += T(320, 267, "RAM forgets. Storage does not. That is the whole difference.", "t-sm");
      return o;
    }
  };

  /* 7. The payoff picture: the reader's own laptop against a model that
        does not fit on it. Every number here is checked in the tests
        against the formula card, so the two cannot drift apart. */
  M["mc-ai-scale"] = {
    vb: "0 0 640 300",
    cap: "Why AI engineers talk about hardware constantly.",
    body: function () {
      var o = T(320, 26, "A 70-billion-parameter model, at 2 bytes each", "t-title");
      o += T(320, 44, "70 × 2 = 140 GB, and it all has to be in memory at once", "t-sm");

      o += T(120, 82, "your laptop", "t-sm");
      o += BOX(40, 92, 160, 40, "16 GB RAM", "box", null, 8);

      o += T(120, 156, "one big GPU", "t-sm");
      o += BOX(40, 166, 160, 40, "80 GB", "box-b", null, 8);

      o += T(120, 230, "what it needs", "t-sm");
      o += BOX(40, 240, 160, 40, "140 GB", "box-a", null, 8);

      /* the bar chart, to scale, because the gap is the argument */
      var scale = 380 / 140;
      o += BOX(232, 92, 16 * scale, 40, "", "box", null, 5);
      o += BOX(232, 166, 80 * scale, 40, "", "box-b", null, 5);
      o += BOX(232, 240, 140 * scale, 40, "", "box-a", null, 5);
      o += T(232 + 16 * scale + 8, 117, "nowhere near", "t-sm", "start");
      o += T(232 + 80 * scale + 8, 191, "still not enough — so, two of them", "t-sm", "start");

      o += '<path class="ln-d" d="M' + n(232 + 140 * scale) + ' 84 L' +
        n(232 + 140 * scale) + ' 288" fill="none"/>';
      return o;
    }
  };

  /* ---------------- registration ----------------
     These are merged into the same registry the rest of the app reads, so a
     lesson block writes { dg: "mc-cycle" } exactly as it would for any other
     diagram and neither the renderer nor the tests need to know there are
     two source files. */

  var baseHas = TD.hasDiagram;
  var baseGet = TD.diagram;
  var baseKeys = TD.diagramKeys;

  TD.hasDiagram = function (key) {
    return !!M[key] || (baseHas ? baseHas(key) : false);
  };

  TD.diagram = function (key) {
    var d = M[key];
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
    return (baseKeys ? baseKeys() : []).concat(Object.keys(M));
  };

  /* Exposed so the tests can assert every animated diagram renders and that
     none of them lost their still-frame legibility. */
  TD.machineDiagrams = M;

})(window.TD);
