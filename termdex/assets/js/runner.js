/* Python runner — CoreDumps

   Real CPython in the page, via Pyodide compiled to WebAssembly. This is the
   thing that turns reading into doing: a learner writes their own approach,
   runs it, and reads an actual traceback instead of matching a reference
   string character by character.

   Three deliberate constraints, because this is the only part of the app that
   reaches outside itself:

   1. NOTHING LOADS UNTIL ASKED. The app boots with zero external requests, as
      it always has. Pyodide (~10 MB) is fetched on the first click of Run and
      then cached by the browser. A reader who never runs code never pays for
      it, and the site still works with no network at all.

   2. FAILURE IS A STATE, NOT A CRASH. Offline, blocked CDN, corporate proxy —
      all of these are normal. The runner says so plainly and the lesson is
      still perfectly readable, because the code block was never dependent on
      it.

   3. THE INTERPRETER IS SHARED, THE NAMESPACE IS NOT. Loading Pyodide twice
      would be minutes of wasted download, so one instance serves every block
      on the page. Each run gets a fresh globals dict, so one block cannot
      leak a variable into another and produce a result the reader cannot
      reproduce.

   Everything here degrades to the previous behaviour if Pyodide never
   arrives: the code is still highlighted, still copyable, still annotated. */
(function (TD) {
  "use strict";

  var CDN = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/";

  var state = {
    status: "idle",     /* idle | loading | ready | failed */
    py: null,
    waiting: []         /* callbacks queued while the runtime downloads */
  };

  /* ---- loading ------------------------------------------------------
     Resolved through a queue rather than a promise chain so that several
     Run buttons pressed during the download all get the same instance and
     the same error, without each one starting its own load. */

  /* A hard ceiling on the whole load. `onerror` is not reliable for a blocked
     request -- a proxy that black-holes the connection, or a captive portal
     that never responds, leaves the event pending forever. Without a timeout
     the reader watches a spinner indefinitely, which is a worse failure than
     an honest error message. */
  var LOAD_TIMEOUT = 45000;

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var settled = false;
      function fail(msg) {
        if (settled) return;
        settled = true;
        reject(new Error(msg));
      }

      var timer = setTimeout(function () {
        fail("timed out after " + Math.round(LOAD_TIMEOUT / 1000) + " seconds");
      }, LOAD_TIMEOUT);

      var s = document.createElement("script");
      s.src = src;
      s.onload = function () {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        resolve();
      };
      s.onerror = function () {
        clearTimeout(timer);
        fail("blocked or offline");
      };
      document.head.appendChild(s);
    });
  }

  /* Test seam: a suite cannot wait 45 seconds, and cannot reach a CDN. */
  TD.runnerTimeout = function (ms) { LOAD_TIMEOUT = ms; };

  function settle(err) {
    state.status = err ? "failed" : "ready";
    var queue = state.waiting.slice();
    state.waiting = [];
    queue.forEach(function (fn) { fn(err); });
  }

  function ensure(onReady) {
    if (state.status === "ready") return onReady(null);
    if (state.status === "failed") {
      return onReady(new Error("The Python runtime could not be loaded."));
    }

    state.waiting.push(onReady);
    if (state.status === "loading") return;
    state.status = "loading";

    loadScript(CDN + "pyodide.js")
      .then(function () {
        if (typeof window.loadPyodide !== "function") {
          throw new Error("runtime script loaded but is not usable");
        }
        return window.loadPyodide({ indexURL: CDN });
      })
      .then(function (py) {
        state.py = py;
        /* stdout and stderr are captured per run rather than globally, so a
           block that prints and then raises shows both, in order. */
        settle(null);
      })
      .catch(function (e) { settle(e); });
  }

  /* Exposed so a view can show "downloading" honestly rather than guessing. */
  TD.runnerStatus = function () { return state.status; };

  /* ---- running ------------------------------------------------------ */

  /* Python's own traceback, minus the frames belonging to our harness. A
     learner should see their line numbers, not ours. */
  function cleanTraceback(text, offset) {
    var lines = String(text).split("\n").filter(function (l) {
      return l.indexOf("File \"<exec>\"") === -1 &&
        l.indexOf("pyodide") === -1 &&
        l.trim() !== "";
    });
    if (!offset) return lines.join("\n");
    return lines.map(function (l) {
      return l.replace(/line (\d+)/, function (_, n) {
        return "line " + (parseInt(n, 10) - offset);
      });
    }).join("\n");
  }

  /* Runs `src` and hands back { out, err, ok }. stdout is collected even when
     the code raises, because what was printed before the failure is usually
     the most useful part of a debugging session. */
  TD.runPython = function (src, done) {
    ensure(function (err) {
      if (err) return done({ ok: false, out: "", err: err.message, fatal: true });

      var py = state.py;
      var captured = "";
      try {
        py.setStdout({ batched: function (s) { captured += s + "\n"; } });
        py.setStderr({ batched: function (s) { captured += s + "\n"; } });

        /* A fresh namespace per run: one block must not see another's
           variables, or the reader gets a result they cannot reproduce by
           running the file themselves. */
        var globals = py.globals.get("dict")();
        py.runPython(src, { globals: globals });
        globals.destroy();

        done({ ok: true, out: captured, err: "" });
      } catch (e) {
        done({ ok: false, out: captured, err: cleanTraceback(e.message, 0) });
      } finally {
        try { py.setStdout({}); py.setStderr({}); } catch (e2) { /* ignore */ }
      }
    });
  };

  /* ---- the console attached to a code block -------------------------- */

  function outputHtml(res) {
    if (res.fatal) {
      return '<div class="rn-out is-fatal">' +
        '<p class="rn-out-k">' + TD.icon("alert") + "Cannot run here</p>" +
        "<p>" + TD.esc(res.err) + " The runtime is downloaded from a CDN the " +
        "first time you press Run, so this usually means you are offline or a " +
        "network policy is blocking it. Everything else on the page still " +
        "works.</p></div>";
    }
    var h = '<div class="rn-out' + (res.ok ? "" : " is-err") + '">';
    h += '<p class="rn-out-k">' + TD.icon(res.ok ? "terminal" : "alert") +
      (res.ok ? "Output" : "Traceback") + "</p>";
    if (res.out) h += "<pre>" + TD.esc(res.out.replace(/\n+$/, "")) + "</pre>";
    if (res.err) h += '<pre class="rn-tb">' + TD.esc(res.err) + "</pre>";
    if (!res.out && !res.err) {
      h += '<pre class="rn-quiet">(finished, printed nothing)</pre>';
    }
    return h + "</div>";
  }

  /* Attaches an editable console to one figure. The original source stays in
     the DOM untouched, so "reset" is always available and the annotated
     version a reader came for is never destroyed. */
  TD.mountRunner = function (fig, source) {
    if (!fig || fig.querySelector(".rn")) return;

    var wrap = document.createElement("div");
    wrap.className = "rn";
    wrap.innerHTML =
      '<div class="rn-bar">' +
        '<span class="rn-k">' + TD.icon("terminal") + "Try it yourself</span>" +
        '<div class="rn-acts">' +
          '<button class="btn btn-ghost btn-sm" type="button" data-rn="reset">' +
            TD.icon("refresh") + "Reset</button>" +
          '<button class="btn btn-primary btn-sm" type="button" data-rn="run">' +
            TD.icon("play") + "Run<kbd>Ctrl &#8629;</kbd></button>" +
        "</div>" +
      "</div>" +
      '<textarea class="rn-code" spellcheck="false" autocomplete="off" ' +
        'autocorrect="off" autocapitalize="off" aria-label="Editable Python"></textarea>' +
      '<div class="rn-result" aria-live="polite"></div>';

    fig.appendChild(wrap);

    var ta = wrap.querySelector(".rn-code");
    var result = wrap.querySelector(".rn-result");
    ta.value = source;
    ta.rows = Math.min(20, Math.max(3, source.split("\n").length));

    function run() {
      var btn = wrap.querySelector('[data-rn="run"]');
      btn.disabled = true;
      result.innerHTML = '<div class="rn-out is-wait"><p class="rn-out-k">' +
        TD.icon("clock") +
        (state.status === "ready" ? "Running" : "Fetching the Python runtime") +
        "</p><p>" +
        (state.status === "ready"
          ? "Executing your code."
          : "About 10 MB, once. Your browser caches it, so every run after " +
            "this one is instant.") +
        "</p></div>";

      TD.runPython(ta.value, function (res) {
        result.innerHTML = outputHtml(res);
        btn.disabled = false;
      });
    }

    wrap.addEventListener("click", function (e) {
      var act = e.target.closest("[data-rn]");
      if (!act) return;
      if (act.getAttribute("data-rn") === "run") return run();
      ta.value = source;
      ta.rows = Math.min(20, Math.max(3, source.split("\n").length));
      result.innerHTML = "";
    });

    ta.addEventListener("keydown", function (e) {
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        run();
        return;
      }
      /* Tab indents rather than leaving the box -- in a Python editor that is
         what it must do. Escape is the documented way out, so the control is
         still reachable by keyboard alone. */
      if (e.key === "Tab" && !e.shiftKey) {
        e.preventDefault();
        var s = ta.selectionStart, en = ta.selectionEnd;
        ta.value = ta.value.slice(0, s) + "    " + ta.value.slice(en);
        ta.selectionStart = ta.selectionEnd = s + 4;
        return;
      }
      if (e.key === "Escape") { e.stopPropagation(); ta.blur(); }
    });
  };

  /* ---- wiring into lessons -------------------------------------------
     A Run button is added to every Python block that is worth running. Blocks
     that only show a signature or a fragment are skipped: offering to execute
     `def __init__(self, name: str):` produces a SyntaxError that teaches the
     reader nothing except that the button is unreliable. */

  function runnable(src) {
    if (!src || src.length < 12) return false;
    var lines = src.split("\n").filter(function (l) { return l.trim(); });
    if (!lines.length) return false;
    /* an unclosed block at the end is a fragment, not a program */
    if (/:\s*$/.test(lines[lines.length - 1])) return false;
    /* needs to actually do something observable */
    return /\bprint\s*\(|=|\breturn\b/.test(src);
  }

  TD.wireRunners = function (root) {
    var scope = root || document;
    Array.prototype.forEach.call(scope.querySelectorAll("figure.lc"), function (fig) {
      var lang = (fig.getAttribute("data-lang") || "").toLowerCase();
      if (lang !== "python") return;
      if (fig.querySelector('[data-act="run-lc"]')) return;

      var raw = fig.querySelector(".lc-raw");
      var src = raw ? raw.textContent : "";
      if (!runnable(src)) return;

      var bar = fig.querySelector(".lc-bar");
      if (!bar) return;

      var btn = document.createElement("button");
      btn.className = "lc-copy lc-run";
      btn.type = "button";
      btn.setAttribute("data-act", "run-lc");
      btn.setAttribute("aria-label", "Run this code");
      btn.innerHTML = TD.icon("play") + "Run";
      bar.appendChild(btn);

      btn.addEventListener("click", function () {
        if (fig.querySelector(".rn")) {
          fig.querySelector(".rn").scrollIntoView({ block: "nearest" });
          return;
        }
        TD.mountRunner(fig, src);
        btn.disabled = true;
        btn.innerHTML = TD.icon("check") + "Editor open";
      });
    });
  };

})(window.TD);
