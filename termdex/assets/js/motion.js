/* ==========================================================================
   motion.js — the landing page's motion layer.

   There is no GSAP here and no framer-motion, on purpose. This site loads no
   external scripts, has no build step, and is read on slow connections by
   people trying to look one word up. A 70KB animation library to move a
   heading twelve pixels is not a trade worth making.

   So this is the small subset of what those libraries do that this page
   actually needs, written against the platform:

     TD.mo.reveal(root)    scroll-triggered entrances, staggered by DOM order
     TD.mo.draw(root)      SVG stroke-dashoffset draw-on, used as a mask
     TD.mo.count(root)     requestAnimationFrame number ramps
     TD.mo.parallax(root)  scroll-linked transforms, rAF-throttled
     TD.mo.type(el, ...)   a word that writes itself
     TD.mo.magnet(root)    pointer-following highlight on a surface

   Two rules hold everywhere in this file:

     1. Only transform and opacity are animated. Nothing here can trigger
        layout, so nothing here can cost a frame.
     2. prefers-reduced-motion is not a downgrade path, it is a supported
        mode. Under it every element lands in its final state immediately
        and every observer is skipped. The page must be identical with
        motion off, minus the movement.

   Everything registers into a teardown list so a route change can undo it.
   ========================================================================== */

(function (TD) {
  "use strict";

  var teardown = [];
  var rafs = [];

  function reduced() {
    return !!(window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }

  function fine() {
    return !!(window.matchMedia &&
      window.matchMedia("(pointer: fine)").matches);
  }

  function all(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  /* IntersectionObserver is the whole scroll engine. One observer per feature
     rather than one per element, and every element unobserves itself the
     moment it fires — a reveal that has played is not worth a callback. */
  function once(els, opts, fn) {
    if (!els.length) return null;
    /* No IntersectionObserver means no scroll engine, so everything lands
       immediately. Hiding content behind an API that is not there would make
       the page blank rather than unanimated. */
    if (!window.IntersectionObserver) { els.forEach(fn); return null; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        fn(e.target);
      });
    }, opts);
    els.forEach(function (el) { io.observe(el); });
    teardown.push(function () { io.disconnect(); });
    return io;
  }

  /* ---------- reveal ----------
     [data-rise] enters when it scrolls into view. The stagger is written onto
     the element as a custom property rather than computed in CSS, so markup
     controls the rhythm and a section can opt into a tighter cascade. */
  function reveal(root) {
    var els = all("[data-rise]", root);
    if (!els.length) return;

    if (reduced()) {
      els.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }

    /* Grouped by nearest [data-rise-group] so each group's stagger restarts
       from zero — otherwise the ninth section's cards wait two seconds. */
    els.forEach(function (el) {
      var group = (el.closest && el.closest("[data-rise-group]")) || root || document.body;
      var sibs = all("[data-rise]", group);
      var i = sibs.indexOf(el);
      var step = parseFloat(group.getAttribute && group.getAttribute("data-rise-step") || "60");
      el.style.setProperty("--rise-delay", Math.min(i, 12) * step + "ms");
    });

    once(els, { rootMargin: "0px 0px -12% 0px", threshold: 0.01 }, function (el) {
      el.classList.add("is-in");
    });
  }

  /* ---------- draw ----------
     An SVG path drawn by animating stroke-dashoffset from its own length to
     zero. This is the honest version of the "SVG mask" reveal: the stroke is
     the mask, so a line looks drawn by a pen rather than faded in.

     Path length is measured at run time, because a path authored by hand and
     a path scaled by viewBox do not agree on what "100" means. */
  function draw(root) {
    var paths = all("[data-draw]", root);
    if (!paths.length) return;

    paths.forEach(function (p) {
      var len = 0;
      try { len = p.getTotalLength(); } catch (e) { len = 0; }
      /* jsdom and a few older engines return 0 or throw; fall back to an
         authored length so the animation still has something to travel. */
      if (!len || !isFinite(len)) len = parseFloat(p.getAttribute("data-draw-len") || "600");
      p.style.setProperty("--len", len);
      p.style.strokeDasharray = len;
      p.style.strokeDashoffset = reduced() ? 0 : len;
    });

    if (reduced()) {
      paths.forEach(function (p) { p.classList.add("is-drawn"); });
      return;
    }

    once(paths, { rootMargin: "0px 0px -10% 0px", threshold: 0.01 }, function (p) {
      var d = parseFloat(p.getAttribute("data-draw") || "0");
      p.style.transitionDelay = d + "ms";
      p.classList.add("is-drawn");
      p.style.strokeDashoffset = "0";
    });
  }

  function fmtNum(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ","); }

  /* ---------- count ----------
     Number ramps. One rAF loop drives every counter on the page rather than
     one loop per element — twelve independent loops is twelve times the work
     for an effect that lasts under a second.

     The easing is the same cubic ease-out the CSS uses, so a counter and the
     card it sits in decelerate together. */
  function count(root) {
    var els = all("[data-count]", root);
    if (!els.length) return;

    function land(el) {
      el.textContent = (el.getAttribute("data-count-pre") || "") +
        fmtNum(parseInt(el.getAttribute("data-count"), 10) || 0) +
        (el.getAttribute("data-count-post") || "");
    }

    if (reduced()) { els.forEach(land); return; }

    els.forEach(function (el) {
      el.textContent = (el.getAttribute("data-count-pre") || "") + "0";
    });

    var live = [];
    once(els, { threshold: 0.3 }, function (el) {
      live.push(el);
      if (live.length === 1) start();
    });

    function start() {
      var t0 = null;
      var dur = 1100;
      function step(ts) {
        if (t0 === null) t0 = ts;
        var p = Math.min(1, (ts - t0) / dur);
        var e = 1 - Math.pow(1 - p, 3);
        live.forEach(function (el) {
          var target = parseInt(el.getAttribute("data-count"), 10) || 0;
          el.textContent = (el.getAttribute("data-count-pre") || "") +
            fmtNum(Math.round(target * e)) +
            (el.getAttribute("data-count-post") || "");
        });
        if (p < 1) rafs.push(requestAnimationFrame(step));
        else live.forEach(land);
      }
      rafs.push(requestAnimationFrame(step));
    }
  }

  /* ---------- parallax ----------
     Scroll-linked translation. Every element is read in one pass and written
     in one pass inside a single rAF, so a scroll never interleaves reads and
     writes and never forces a synchronous layout. */
  function parallax(root) {
    if (reduced()) return;
    var els = all("[data-parallax]", root);
    if (!els.length) return;

    var ticking = false;

    function frame() {
      ticking = false;
      var vh = window.innerHeight || 800;
      /* read */
      var boxes = els.map(function (el) { return el.getBoundingClientRect(); });
      /* write */
      els.forEach(function (el, i) {
        var b = boxes[i];
        if (b.bottom < -200 || b.top > vh + 200) return;
        var k = parseFloat(el.getAttribute("data-parallax")) || 0;
        /* -1..1 across the viewport, 0 when the element is centred */
        var mid = (b.top + b.height / 2 - vh / 2) / vh;
        el.style.setProperty("--py", (mid * k * 100).toFixed(2) + "px");
      });
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      rafs.push(requestAnimationFrame(frame));
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    teardown.push(function () {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    });
    frame();
  }

  /* ---------- type ----------
     A word written one character at a time. Used for the single rotating word
     in the headline and nowhere else — a page where everything types itself
     is a page nobody can read. */
  function type(el, text, done) {
    if (!el) return function () {};
    if (reduced()) {
      el.textContent = text;
      if (done) done();
      return function () {};
    }
    var n = 0;
    el.textContent = "";
    var id = setInterval(function () {
      n++;
      el.textContent = text.slice(0, n);
      if (n >= text.length) { clearInterval(id); if (done) done(); }
    }, 46);
    teardown.push(function () { clearInterval(id); });
    return function () { clearInterval(id); };
  }

  /* ---------- magnet ----------
     A highlight that follows the pointer across a surface, exposed to CSS as
     --mx/--my percentages. Fine pointers only: on touch there is no hover
     state to reward and the listener would only cost battery. */
  function magnet(root) {
    if (reduced() || !fine()) return;
    all("[data-magnet]", root).forEach(function (el) {
      function move(e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100).toFixed(1) + "%");
        el.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100).toFixed(1) + "%");
      }
      function leave() {
        el.style.removeProperty("--mx");
        el.style.removeProperty("--my");
      }
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      teardown.push(function () {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
      });
    });
  }

  /* ---------- lifecycle ----------
     #view is re-rendered on every route change but never replaced, so every
     listener bound here would stack if it were not explicitly released.
     mount() always tears the previous page down first. */
  function stop() {
    teardown.forEach(function (fn) { try { fn(); } catch (e) {} });
    teardown = [];
    rafs.forEach(function (id) { cancelAnimationFrame(id); });
    rafs = [];
  }

  /* ---------- the safety net ----------
     Everything above hides content until an observer says otherwise. That is
     fine when the observer fires, and a blank page when it does not — a
     print stylesheet, a headless renderer, a scroll container the observer
     was not given, a browser that throttles callbacks in a background tab.

     A reveal is a nice-to-have; the text underneath it is the entire point.
     So a hard deadline runs after mount and forces anything still waiting
     into its final state. If the observers did their job this finds nothing
     to do and costs one pass over the page. */
  function net(root) {
    var id = setTimeout(function () {
      all("[data-rise]", root).forEach(function (el) {
        el.classList.add("is-in");
      });
      all("[data-draw]", root).forEach(function (p) {
        p.classList.add("is-drawn");
        p.style.strokeDashoffset = "0";
      });
      all("[data-count]", root).forEach(function (el) {
        /* only the ones the rAF never reached */
        if (!/[1-9]/.test(el.textContent) &&
            parseInt(el.getAttribute("data-count"), 10) > 0) {
          el.textContent = (el.getAttribute("data-count-pre") || "") +
            fmtNum(parseInt(el.getAttribute("data-count"), 10)) +
            (el.getAttribute("data-count-post") || "");
        }
      });
    }, 2600);
    teardown.push(function () { clearTimeout(id); });
  }

  function mount(root) {
    stop();
    var r = root || document;
    reveal(r);
    draw(r);
    count(r);
    parallax(r);
    magnet(r);
    net(r);
  }

  TD.mo = {
    mount: mount,
    stop: stop,
    reveal: reveal,
    draw: draw,
    count: count,
    parallax: parallax,
    type: type,
    magnet: magnet,
    net: net,
    reduced: reduced,
    fmt: fmtNum
  };
})(window.TD = window.TD || {});
