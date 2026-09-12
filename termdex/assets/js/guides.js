/* Guides UI — CoreDumps
   ============================================================================
   A recipe is read while doing, not while sitting still. So the detail page is
   built as a vertical track: one step at a time, each with the command right
   there, and a tick you can press as you go. Progress is kept locally, because
   the most common failure of a long guide is losing your place in it.

   The diagrams are hand-built SVG, animated with CSS only — same rule as the
   rest of the site: no library, and everything must still read correctly when
   motion is switched off.
   ========================================================================= */

(function (TD) {
  "use strict";

  var state = { group: "all", query: "" };

  var DONE_KEY = "coredumps_guide_steps";

  function readDone() {
    try {
      var raw = localStorage.getItem(DONE_KEY);
      var p = raw ? JSON.parse(raw) : {};
      return p && typeof p === "object" ? p : {};
    } catch (e) { return {}; }
  }

  function writeDone(d) {
    try { localStorage.setItem(DONE_KEY, JSON.stringify(d)); } catch (e) {}
  }

  TD.guideProgress = function (id) {
    var d = readDone()[id] || {};
    var g = TD.guideById(id);
    if (!g) return { done: 0, total: 0, pct: 0 };
    var n = 0;
    for (var i = 0; i < g.steps.length; i++) if (d[i]) n++;
    return { done: n, total: g.steps.length, pct: Math.round((n / g.steps.length) * 100) };
  };

  TD.guideById = function (id) {
    var list = TD.guides || [];
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  };

  function groupById(id) {
    var gs = TD.guideGroups || [];
    for (var i = 0; i < gs.length; i++) if (gs[i].id === id) return gs[i];
    return null;
  }

  /* ---- platform ------------------------------------------------------
     Commands differ between PowerShell and a POSIX shell often enough that
     showing both inline would double the length of every guide. One toggle
     picks a side and every command on the page follows it. */

  var OS_KEY = "coredumps_guide_os";

  function currentOS() {
    try {
      var v = localStorage.getItem(OS_KEY);
      if (v === "win" || v === "mac") return v;
    } catch (e) {}

    /* Sniff several sources rather than one. navigator.platform is
       deprecated and already empty in some environments, and guessing wrong
       here shows a reader `touch` on Windows — a command that does not
       exist there, which is exactly the failure these guides exist to
       prevent. userAgentData is the modern answer; the rest are fallbacks. */
    var nav = (typeof navigator !== "undefined" && navigator) || {};
    var hints = [
      nav.userAgentData && nav.userAgentData.platform,
      nav.platform,
      nav.userAgent
    ].join(" ");
    return /win/i.test(hints) ? "win" : "mac";
  }

  function setOS(v) {
    try { localStorage.setItem(OS_KEY, v); } catch (e) {}
  }

  /* A command is either a plain string, or {win, mac}. */
  function cmdFor(cmd, os) {
    if (!cmd) return null;
    if (typeof cmd === "string") return cmd;
    return cmd[os] || cmd.win || cmd.mac || null;
  }

  function bothDiffer(cmd) {
    return cmd && typeof cmd === "object" && cmd.win && cmd.mac && cmd.win !== cmd.mac;
  }

  /* ---- diagrams ------------------------------------------------------
     Each is a small SVG that says one thing. They animate on a loop with
     pure CSS, and every one of them is still legible as a static picture —
     the motion shows the direction of travel, it does not carry meaning by
     itself. */

  var DIAGRAMS = {

    /* a shell prompt: you are somewhere, and commands act from there */
    shell: function () {
      return '<svg viewBox="0 0 300 96" class="gd-svg" role="img" aria-label="A terminal prompt showing the current folder">' +
        '<rect x="6" y="8" width="288" height="80" rx="7" class="gd-box"/>' +
        '<circle cx="20" cy="21" r="3.2" class="gd-dot-r"/><circle cx="31" cy="21" r="3.2" class="gd-dot-y"/><circle cx="42" cy="21" r="3.2" class="gd-dot-g"/>' +
        '<path d="M6 32h288" class="gd-line"/>' +
        '<text x="20" y="55" class="gd-mono gd-dim">C:\\Users\\you\\project&gt;</text>' +
        '<text x="20" y="75" class="gd-mono gd-ink">ls</text>' +
        '<rect x="38" y="64" width="7" height="13" class="gd-caret"/>' +
        "</svg>";
    },

    /* file -> server -> browser: why localhost exists */
    server: function () {
      return '<svg viewBox="0 0 340 120" class="gd-svg" role="img" aria-label="Files served by a local server to the browser">' +
        '<rect x="8" y="34" width="72" height="52" rx="6" class="gd-box"/>' +
        '<text x="44" y="58" class="gd-lbl" text-anchor="middle">your</text>' +
        '<text x="44" y="72" class="gd-lbl" text-anchor="middle">files</text>' +
        '<rect x="134" y="34" width="72" height="52" rx="6" class="gd-box gd-box-hi"/>' +
        '<text x="170" y="58" class="gd-lbl" text-anchor="middle">server</text>' +
        '<text x="170" y="72" class="gd-lbl gd-dim" text-anchor="middle">:8000</text>' +
        '<rect x="260" y="34" width="72" height="52" rx="6" class="gd-box"/>' +
        '<text x="296" y="64" class="gd-lbl" text-anchor="middle">browser</text>' +
        '<path d="M84 60h44" class="gd-arrow" marker-end="url(#gdArrow)"/>' +
        '<path d="M210 60h44" class="gd-arrow gd-arrow-2" marker-end="url(#gdArrow)"/>' +
        '<circle r="3.4" class="gd-pulse"><animateMotion dur="2.6s" repeatCount="indefinite" path="M84 60 L128 60"/></circle>' +
        '<circle r="3.4" class="gd-pulse gd-pulse-2"><animateMotion dur="2.6s" begin="1.3s" repeatCount="indefinite" path="M210 60 L254 60"/></circle>' +
        '<text x="170" y="24" class="gd-cap" text-anchor="middle">http://localhost:8000</text>' +
        "</svg>";
    },

    /* one port, one listener */
    port: function () {
      return '<svg viewBox="0 0 320 118" class="gd-svg" role="img" aria-label="Two programs competing for one port">' +
        '<rect x="118" y="40" width="84" height="60" rx="7" class="gd-box gd-box-hi"/>' +
        '<text x="160" y="66" class="gd-lbl" text-anchor="middle">port</text>' +
        '<text x="160" y="84" class="gd-lbl gd-ink" text-anchor="middle">8000</text>' +
        '<rect x="10" y="18" width="80" height="34" rx="6" class="gd-box"/>' +
        '<text x="50" y="39" class="gd-lbl" text-anchor="middle">server A</text>' +
        '<rect x="10" y="76" width="80" height="34" rx="6" class="gd-box gd-box-bad"/>' +
        '<text x="50" y="97" class="gd-lbl" text-anchor="middle">server B</text>' +
        '<path d="M92 35 L118 55" class="gd-arrow" marker-end="url(#gdArrow)"/>' +
        '<path d="M92 92 L118 76" class="gd-arrow gd-arrow-bad" stroke-dasharray="4 4"/>' +
        '<path d="M99 78 l12 12 M111 78 l-12 12" class="gd-x"/>' +
        '<text x="240" y="60" class="gd-cap">first one wins</text>' +
        '<text x="240" y="78" class="gd-cap gd-cap-bad">second is refused</text>' +
        "</svg>";
    },

    /* working tree -> staging -> commit */
    git: function () {
      return '<svg viewBox="0 0 350 116" class="gd-svg" role="img" aria-label="Files move from the working folder to staging to a commit">' +
        '<rect x="8" y="38" width="86" height="52" rx="6" class="gd-box"/>' +
        '<text x="51" y="60" class="gd-lbl" text-anchor="middle">working</text>' +
        '<text x="51" y="76" class="gd-lbl gd-dim" text-anchor="middle">folder</text>' +
        '<rect x="132" y="38" width="86" height="52" rx="6" class="gd-box gd-box-hi"/>' +
        '<text x="175" y="60" class="gd-lbl" text-anchor="middle">staged</text>' +
        '<text x="175" y="76" class="gd-lbl gd-dim" text-anchor="middle">git add</text>' +
        '<rect x="256" y="38" width="86" height="52" rx="6" class="gd-box"/>' +
        '<text x="299" y="60" class="gd-lbl" text-anchor="middle">commit</text>' +
        '<text x="299" y="76" class="gd-lbl gd-dim" text-anchor="middle">saved</text>' +
        '<path d="M98 64h30" class="gd-arrow" marker-end="url(#gdArrow)"/>' +
        '<path d="M222 64h30" class="gd-arrow" marker-end="url(#gdArrow)"/>' +
        '<circle r="3.4" class="gd-pulse"><animateMotion dur="3s" repeatCount="indefinite" path="M98 64 L128 64"/></circle>' +
        '<circle r="3.4" class="gd-pulse gd-pulse-2"><animateMotion dur="3s" begin="1.5s" repeatCount="indefinite" path="M222 64 L252 64"/></circle>' +
        '<text x="113" y="30" class="gd-cap" text-anchor="middle">git add</text>' +
        '<text x="237" y="30" class="gd-cap" text-anchor="middle">git commit</text>' +
        "</svg>";
    },

    /* a branch leaving main and rejoining */
    branch: function () {
      return '<svg viewBox="0 0 340 110" class="gd-svg" role="img" aria-label="A branch leaves main, gains commits, and merges back">' +
        '<path d="M20 76h300" class="gd-track"/>' +
        '<path d="M96 76 C126 76 126 32 156 32 L232 32 C262 32 262 76 292 76" class="gd-track gd-track-b" pathLength="1"/>' +
        '<circle cx="40" cy="76" r="6" class="gd-node"/>' +
        '<circle cx="96" cy="76" r="6" class="gd-node"/>' +
        '<circle cx="292" cy="76" r="6" class="gd-node gd-node-hi"/>' +
        '<circle cx="164" cy="32" r="6" class="gd-node gd-node-b"/>' +
        '<circle cx="224" cy="32" r="6" class="gd-node gd-node-b"/>' +
        '<text x="30" y="98" class="gd-cap">main</text>' +
        '<text x="164" y="18" class="gd-cap gd-cap-b" text-anchor="middle">my-feature</text>' +
        '<text x="292" y="98" class="gd-cap" text-anchor="middle">merge</text>' +
        "</svg>";
    },

    /* what a status code's first digit means */
    status: function () {
      var rows = [
        ["2xx", "it worked", "ok"],
        ["3xx", "look elsewhere", "mid"],
        ["4xx", "your request was wrong", "bad"],
        ["5xx", "the server broke", "bad"]
      ];
      var y = 20, out = "";
      rows.forEach(function (r) {
        out += '<rect x="10" y="' + (y - 13) + '" width="46" height="20" rx="4" class="gd-chip gd-chip-' + r[2] + '"/>' +
          '<text x="33" y="' + (y + 2) + '" class="gd-mono gd-chip-t" text-anchor="middle">' + r[0] + "</text>" +
          '<text x="70" y="' + (y + 2) + '" class="gd-lbl">' + r[1] + "</text>";
        y += 27;
      });
      return '<svg viewBox="0 0 300 118" class="gd-svg" role="img" aria-label="What each status code family means">' + out + "</svg>";
    },

    /* global installs collide; a venv keeps them apart */
    venv: function () {
      return '<svg viewBox="0 0 330 122" class="gd-svg" role="img" aria-label="Each project keeps its own dependencies in a virtual environment">' +
        '<rect x="10" y="16" width="140" height="90" rx="7" class="gd-box gd-box-bad"/>' +
        '<text x="80" y="36" class="gd-cap gd-cap-bad" text-anchor="middle">no venv</text>' +
        '<rect x="26" y="48" width="48" height="22" rx="4" class="gd-box"/><text x="50" y="63" class="gd-mono gd-sm" text-anchor="middle">v1.0</text>' +
        '<rect x="86" y="48" width="48" height="22" rx="4" class="gd-box"/><text x="110" y="63" class="gd-mono gd-sm" text-anchor="middle">v2.0</text>' +
        '<path d="M74 59h12" class="gd-arrow gd-arrow-bad"/>' +
        '<path d="M74 52 l12 14 M86 52 l-12 14" class="gd-x"/>' +
        '<text x="80" y="92" class="gd-cap gd-cap-bad" text-anchor="middle">one wins, one breaks</text>' +
        '<rect x="178" y="16" width="142" height="90" rx="7" class="gd-box gd-box-hi"/>' +
        '<text x="249" y="36" class="gd-cap" text-anchor="middle">with .venv</text>' +
        '<rect x="192" y="48" width="52" height="40" rx="4" class="gd-box"/><text x="218" y="65" class="gd-mono gd-sm" text-anchor="middle">app A</text><text x="218" y="79" class="gd-mono gd-sm gd-dim" text-anchor="middle">v1.0</text>' +
        '<rect x="256" y="48" width="52" height="40" rx="4" class="gd-box"/><text x="282" y="65" class="gd-mono gd-sm" text-anchor="middle">app B</text><text x="282" y="79" class="gd-mono gd-sm gd-dim" text-anchor="middle">v2.0</text>' +
        "</svg>";
    },

    /* read a trace from the top, then to your own file */
    trace: function () {
      return '<svg viewBox="0 0 330 126" class="gd-svg" role="img" aria-label="Read the error line, then find the first line naming your own file">' +
        '<rect x="8" y="10" width="314" height="106" rx="7" class="gd-box"/>' +
        '<text x="22" y="30" class="gd-mono gd-bad">TypeError: cannot read \'name\'</text>' +
        '<text x="22" y="52" class="gd-mono gd-dim">at Object.get (node_modules/lib.js:9)</text>' +
        '<text x="22" y="72" class="gd-mono gd-dim">at run (node_modules/core.js:22)</text>' +
        '<rect x="14" y="80" width="230" height="20" rx="4" class="gd-hl"/>' +
        '<text x="22" y="94" class="gd-mono gd-ink">at getUser (src/user.js:42)</text>' +
        '<text x="256" y="94" class="gd-cap">yours</text>' +
        '<path d="M250 88 L246 90 L250 92" class="gd-arrow"/>' +
        '<text x="22" y="112" class="gd-mono gd-dim">at main (src/index.js:8)</text>' +
        "</svg>";
    },

    /* halving the search space */
    bisect: function () {
      return '<svg viewBox="0 0 330 108" class="gd-svg" role="img" aria-label="Halving the search space each test">' +
        '<rect x="14" y="16" width="300" height="16" rx="4" class="gd-band"/>' +
        '<text x="322" y="28" class="gd-cap" text-anchor="end">16</text>' +
        '<rect x="14" y="42" width="150" height="16" rx="4" class="gd-band gd-band-2"/>' +
        '<rect x="168" y="42" width="146" height="16" rx="4" class="gd-band gd-band-out"/>' +
        '<rect x="14" y="68" width="74" height="16" rx="4" class="gd-band gd-band-3"/>' +
        '<rect x="92" y="68" width="72" height="16" rx="4" class="gd-band gd-band-out"/>' +
        '<rect x="14" y="92" width="36" height="12" rx="3" class="gd-band gd-band-hit"/>' +
        '<text x="60" y="102" class="gd-cap">found</text>' +
        "</svg>";
    },

    /* the three tabs that matter */
    devtools: function () {
      return '<svg viewBox="0 0 330 116" class="gd-svg" role="img" aria-label="The console, elements and network tabs">' +
        '<rect x="8" y="10" width="314" height="98" rx="7" class="gd-box"/>' +
        '<path d="M8 34h314" class="gd-line"/>' +
        '<rect x="16" y="16" width="66" height="17" rx="4" class="gd-tab gd-tab-on"/>' +
        '<text x="49" y="29" class="gd-mono gd-sm gd-ink" text-anchor="middle">Console</text>' +
        '<text x="112" y="29" class="gd-mono gd-sm gd-dim">Elements</text>' +
        '<text x="182" y="29" class="gd-mono gd-sm gd-dim">Network</text>' +
        '<circle cx="24" cy="52" r="4" class="gd-dot-r"/>' +
        '<text x="36" y="56" class="gd-mono gd-bad">Uncaught TypeError</text>' +
        '<text x="36" y="76" class="gd-mono gd-dim">at app.js:42</text>' +
        '<text x="24" y="98" class="gd-cap">read the FIRST error, not the last</text>' +
        "</svg>";
    },

    /* VS Code source control workflow */
    vscode: function () {
      return '<svg viewBox="0 0 350 120" class="gd-svg" role="img" aria-label="VS Code Source Control UI: stage files with +, commit, and sync to GitHub">' +
        '<rect x="8" y="12" width="100" height="96" rx="6" class="gd-box"/>' +
        '<text x="18" y="32" class="gd-mono gd-sm gd-ink">Changes (2)</text>' +
        '<rect x="88" y="21" width="14" height="14" rx="3" class="gd-box gd-box-hi"/>' +
        '<text x="95" y="32" class="gd-mono gd-sm" text-anchor="middle">+</text>' +
        '<text x="18" y="52" class="gd-mono gd-sm gd-dim">App.tsx</text>' +
        '<text x="18" y="70" class="gd-mono gd-sm gd-dim">api.ts</text>' +
        '<path d="M112 60h24" class="gd-arrow" marker-end="url(#gdArrow)"/>' +
        '<rect x="140" y="12" width="105" height="96" rx="6" class="gd-box gd-box-hi"/>' +
        '<text x="150" y="32" class="gd-mono gd-sm gd-ink">Staged (2)</text>' +
        '<rect x="148" y="42" width="89" height="24" rx="4" class="gd-box"/>' +
        '<text x="156" y="58" class="gd-mono gd-sm gd-dim">feat: commit</text>' +
        '<rect x="148" y="74" width="89" height="22" rx="4" class="gd-chip gd-chip-ok"/>' +
        '<text x="192" y="89" class="gd-mono gd-chip-t" text-anchor="middle">Commit</text>' +
        '<path d="M248 60h24" class="gd-arrow" marker-end="url(#gdArrow)"/>' +
        '<rect x="276" y="28" width="66" height="64" rx="6" class="gd-box"/>' +
        '<text x="309" y="56" class="gd-mono gd-sm gd-ink" text-anchor="middle">GitHub</text>' +
        '<text x="309" y="74" class="gd-cap" text-anchor="middle">1↑ Sync</text>' +
        '<circle r="3.4" class="gd-pulse"><animateMotion dur="2.5s" repeatCount="indefinite" path="M112 60 L136 60"/></circle>' +
        '<circle r="3.4" class="gd-pulse gd-pulse-2"><animateMotion dur="2.5s" begin="1.2s" repeatCount="indefinite" path="M248 60 L272 60"/></circle>' +
        "</svg>";
    },

    /* interactive rebase squashing */
    rebase: function () {
      return '<svg viewBox="0 0 340 110" class="gd-svg" role="img" aria-label="Interactive rebase squashes multiple messy commits into one clean commit">' +
        '<path d="M20 38h210" class="gd-track"/>' +
        '<circle cx="36" cy="38" r="6" class="gd-node"/>' +
        '<circle cx="96" cy="38" r="6" class="gd-node gd-node-bad"/>' +
        '<circle cx="156" cy="38" r="6" class="gd-node gd-node-bad"/>' +
        '<circle cx="216" cy="38" r="6" class="gd-node gd-node-bad"/>' +
        '<text x="36" y="20" class="gd-cap" text-anchor="middle">pick</text>' +
        '<text x="96" y="20" class="gd-cap gd-cap-bad" text-anchor="middle">squash</text>' +
        '<text x="156" y="20" class="gd-cap gd-cap-bad" text-anchor="middle">squash</text>' +
        '<text x="216" y="20" class="gd-cap gd-cap-bad" text-anchor="middle">squash</text>' +
        '<path d="M126 48 C126 80 250 80 250 80" class="gd-arrow" marker-end="url(#gdArrow)"/>' +
        '<path d="M20 80h300" class="gd-track gd-track-b"/>' +
        '<circle cx="36" cy="80" r="6" class="gd-node"/>' +
        '<circle cx="280" cy="80" r="8" class="gd-node gd-node-hi"/>' +
        '<text x="280" y="102" class="gd-cap gd-cap-b" text-anchor="middle">1 clean commit</text>' +
        "</svg>";
    },

    /* JWT authentication flow */
    jwt: function () {
      return '<svg viewBox="0 0 350 114" class="gd-svg" role="img" aria-label="JWT authentication flow between client and API">' +
        '<rect x="8" y="20" width="80" height="74" rx="6" class="gd-box"/>' +
        '<text x="48" y="52" class="gd-mono gd-sm" text-anchor="middle">Browser</text>' +
        '<text x="48" y="70" class="gd-cap" text-anchor="middle">Client</text>' +
        '<rect x="262" y="20" width="80" height="74" rx="6" class="gd-box gd-box-hi"/>' +
        '<text x="302" y="52" class="gd-mono gd-sm" text-anchor="middle">API</text>' +
        '<text x="302" y="70" class="gd-cap" text-anchor="middle">Server</text>' +
        '<path d="M92 42h160" class="gd-arrow" marker-end="url(#gdArrow)"/>' +
        '<text x="172" y="34" class="gd-cap" text-anchor="middle">1. login {email, password}</text>' +
        '<path d="M252 64H92" class="gd-arrow" marker-end="url(#gdArrow)"/>' +
        '<text x="172" y="58" class="gd-cap gd-cap-b" text-anchor="middle">2. JWT token {access, refresh}</text>' +
        '<path d="M92 86h160" class="gd-arrow" marker-end="url(#gdArrow)"/>' +
        '<text x="172" y="104" class="gd-cap" text-anchor="middle">3. Auth: Bearer &lt;token&gt;</text>' +
        '<circle r="3" class="gd-pulse"><animateMotion dur="3s" repeatCount="indefinite" path="M92 42 L252 42"/></circle>' +
        '<circle r="3" class="gd-pulse gd-pulse-2"><animateMotion dur="3s" begin="1s" repeatCount="indefinite" path="M252 64 L92 64"/></circle>' +
        "</svg>";
    },

    /* Docker multi-stage build */
    docker_multi: function () {
      return '<svg viewBox="0 0 350 116" class="gd-svg" role="img" aria-label="Docker multi-stage build discards build tools to create a tiny production image">' +
        '<rect x="8" y="16" width="145" height="88" rx="6" class="gd-box gd-box-bad"/>' +
        '<text x="80" y="36" class="gd-cap gd-cap-bad" text-anchor="middle">Stage 1: Builder (1.2 GB)</text>' +
        '<text x="80" y="56" class="gd-mono gd-sm gd-dim" text-anchor="middle">TypeScript, Compilers</text>' +
        '<text x="80" y="74" class="gd-mono gd-sm gd-dim" text-anchor="middle">devDependencies</text>' +
        '<text x="80" y="92" class="gd-cap gd-cap-bad" text-anchor="middle">discarded after build</text>' +
        '<path d="M156 60h32" class="gd-arrow" marker-end="url(#gdArrow)"/>' +
        '<text x="172" y="48" class="gd-cap" text-anchor="middle">COPY</text>' +
        '<rect x="194" y="16" width="148" height="88" rx="6" class="gd-box gd-box-hi"/>' +
        '<text x="268" y="36" class="gd-cap" text-anchor="middle">Stage 2: Runner (75 MB)</text>' +
        '<text x="268" y="56" class="gd-mono gd-sm" text-anchor="middle">Alpine Linux</text>' +
        '<text x="268" y="74" class="gd-mono gd-sm" text-anchor="middle">dist/ + prod modules</text>' +
        '<text x="268" y="92" class="gd-cap gd-cap-b" text-anchor="middle">deploys in 2 seconds</text>' +
        "</svg>";
    }
  };

  function diagram(id) {
    if (!id || !DIAGRAMS[id]) return "";
    return '<figure class="gd-fig">' + DIAGRAMS[id]() + "</figure>";
  }

  /* One shared arrowhead for every diagram on the page. */
  function svgDefs() {
    return '<svg width="0" height="0" aria-hidden="true" style="position:absolute">' +
      '<defs><marker id="gdArrow" viewBox="0 0 10 10" refX="9" refY="5" ' +
      'markerWidth="6" markerHeight="6" orient="auto-start-reverse">' +
      '<path d="M0 0 L10 5 L0 10 z" fill="currentColor"/></marker></defs></svg>';
  }

  /* ---- index ---------------------------------------------------------- */

  function matches(g) {
    if (state.group !== "all" && g.g !== state.group) return false;
    var q = state.query.trim().toLowerCase();
    if (!q) return true;
    if (g.t.toLowerCase().indexOf(q) !== -1) return true;
    if (g.why.toLowerCase().indexOf(q) !== -1) return true;
    for (var i = 0; i < g.steps.length; i++) {
      var s = g.steps[i];
      if (String(s.do || "").toLowerCase().indexOf(q) !== -1) return true;
      var c = s.cmd;
      var flat = typeof c === "string" ? c : c ? (c.win || "") + " " + (c.mac || "") : "";
      if (flat.toLowerCase().indexOf(q) !== -1) return true;
    }
    return false;
  }

  function card(g) {
    var grp = groupById(g.g) || { n: "", c: "var(--accent)" };
    var p = TD.guideProgress(g.id);
    return '<a class="gd-card" href="#/guides/' + g.id + '" style="--gc:' + grp.c + '" data-rise>' +
      '<div class="gd-card-top">' +
      '<span class="gd-card-grp">' + TD.esc(grp.n) + "</span>" +
      '<span class="gd-card-mins">' + g.mins + " min</span>" +
      "</div>" +
      "<h3>" + TD.esc(g.t) + "</h3>" +
      "<p>" + TD.rich(g.why) + "</p>" +
      '<div class="gd-card-foot">' +
      '<span class="gd-card-steps">' + g.steps.length + " steps</span>" +
      (p.done
        ? '<span class="gd-card-pr"><i style="width:' + p.pct + '%"></i></span>' +
          '<span class="gd-card-pct">' + p.pct + "%</span>"
        : '<span class="gd-card-go">' + TD.icon("arrowRight") + "</span>") +
      "</div></a>";
  }

  TD.viewGuides = function () {
    var list = (TD.guides || []).filter(matches);
    var groups = TD.guideGroups || [];
    var total = (TD.guides || []).length;
    var steps = (TD.guides || []).reduce(function (a, g) { return a + g.steps.length; }, 0);

    var chips = '<button class="gd-chip-f' + (state.group === "all" ? " is-on" : "") +
      '" data-gg="all">All<span>' + total + "</span></button>";
    groups.forEach(function (gr) {
      var n = (TD.guides || []).filter(function (g) { return g.g === gr.id; }).length;
      chips += '<button class="gd-chip-f' + (state.group === gr.id ? " is-on" : "") +
        '" data-gg="' + gr.id + '" style="--gc:' + gr.c + '">' +
        TD.esc(gr.n) + "<span>" + n + "</span></button>";
    });

    return svgDefs() +
      '<div class="gd-wrap">' +
      '<header class="gd-hero">' +
      '<p class="gd-kicker">Guides</p>' +
      "<h1>How to actually do it</h1>" +
      '<p class="gd-lede">' + total + " short recipes for the things every guide assumes you already know — " +
      steps + " steps in total, each with the command, what you should see, and the part that trips people up.</p>" +
      "</header>" +
      '<div class="gd-tools">' +
      '<div class="gd-search">' + TD.icon("search") +
      '<input id="gdQ" type="search" placeholder="Search — port, commit, venv, 404…" value="' +
      TD.esc(state.query) + '" autocomplete="off"></div>' +
      '<div class="gd-os" role="group" aria-label="Platform">' +
      '<button data-gos="win"' + (currentOS() === "win" ? ' class="is-on"' : "") + ">Windows</button>" +
      '<button data-gos="mac"' + (currentOS() === "mac" ? ' class="is-on"' : "") + ">macOS / Linux</button>" +
      "</div></div>" +
      '<div class="gd-chips">' + chips + "</div>" +
      '<div class="gd-grid" id="gdGrid">' +
      (list.length ? list.map(card).join("") :
        '<p class="gd-empty">Nothing matches that. Try <b>port</b>, <b>commit</b> or <b>server</b>.</p>') +
      "</div></div>";
  };

  /* ---- term highlighting & dictionary linking for guides ---- */

  function escapeRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

  function guideTargets(g) {
    var out = [];
    var added = Object.create(null);

    function addTgt(name, term) {
      if (!term) return;
      var key = (term.slug || "") + ":" + name.toLowerCase();
      if (added[key]) return;
      added[key] = 1;
      out.push({ label: name, term: term });
      if (term.a && term.a.length >= 3 && term.a.toLowerCase() !== name.toLowerCase()) {
        var aKey = (term.slug || "") + ":" + term.a.toLowerCase();
        if (!added[aKey]) {
          added[aKey] = 1;
          out.push({ label: term.a, term: term });
        }
      }
    }

    // 1. Explicit related terms declared on guide (g.r)
    (g.r || []).forEach(function (name) {
      addTgt(name, TD.resolve(name));
    });

    // 2. High-value technical and system terms
    var commonTech = [
      "Job Object", "Socket Exhaustion", "TIME_WAIT", "TCP Window Auto-Tuning",
      "Ephemeral Port", "PktMon", "Raw Socket", "Promiscuous Mode",
      "cProfile", "Flamegraph", "Quantization", "Knowledge Distillation",
      "KL Divergence", "Allow-list Validation", "Unicode Normalization",
      "pip-audit", "Shannon Entropy", "Portable Executable",
      "Import Address Table", "Invoke", "strace", "eBPF",
      "Control Groups", "Namespaces", "sysctl",
      "Virtual Environment", "Reverse Engineering", "Wireshark",
      "Docker", "TCP", "UDP", "DNS", "SSH", "TLS", "SSL", "CORS",
      "WebSocket", "OAuth", "JWT", "REST", "GraphQL", "Redis",
      "PostgreSQL", "SQLite", "Git", "CI/CD", "Rate Limit"
    ];

    commonTech.forEach(function (name) {
      var t = TD.resolve(name);
      if (t) addTgt(name, t);
    });

    out.sort(function (a, b) { return b.label.length - a.label.length; });
    return out;
  }

  function guideLinkCtx(g) {
    return { targets: guideTargets(g), seen: Object.create(null) };
  }

  function autolinkGuide(html, ctx) {
    if (!ctx) return html;

    // First support explicit [[Term Name]] or [[Term Name|Display Label]]
    html = html.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, function (_, target, label) {
      var t = TD.resolve(target.trim());
      var text = label ? label.trim() : target.trim();
      if (t) {
        ctx.seen[t.slug] = 1;
        return '<a class="tlink" href="#/t/' + t.slug + '" title="TermDex: ' + TD.esc(t.t) + '">' + TD.esc(text) + '</a>';
      }
      return text;
    });

    if (!ctx.targets || !ctx.targets.length) return html;

    // Walk HTML outside code and anchor tags
    var depth = 0;
    return html.split(/(<[^>]+>)/).map(function (seg) {
      if (seg.charAt(0) === "<") {
        if (/^<(code|a|pre)\b/i.test(seg)) depth++;
        else if (/^<\/(code|a|pre)>/i.test(seg)) depth = Math.max(0, depth - 1);
        return seg;
      }
      if (depth > 0 || !seg) return seg;

      ctx.targets.forEach(function (tgt) {
        if (ctx.seen[tgt.term.slug]) return;
        var isSpecial = /\s|-/.test(tgt.label) || /^[a-z]+[A-Z]/.test(tgt.label) || tgt.label.length >= 8;
        var flag = isSpecial ? "i" : "";
        var re = new RegExp("(^|[^\\w-])(" + escapeRe(tgt.label) + ")(?![\\w-])", flag);
        if (!re.test(seg)) return;
        ctx.seen[tgt.term.slug] = 1;
        seg = seg.replace(re, function (m, pre, hit) {
          return pre + '<a class="tlink" href="#/t/' + tgt.term.slug + '" title="TermDex: ' + TD.esc(tgt.term.t) + '">' + hit + '</a>';
        });
      });
      return seg;
    }).join("");
  }

  /* ---- detail --------------------------------------------------------- */

  function stepBlock(g, s, i, os, done, ctx) {
    ctx = ctx || guideLinkCtx(g);
    var cmd = cmdFor(s.cmd, os);
    var differs = bothDiffer(s.cmd);
    var h = '<li class="gd-step' + (done ? " is-done" : "") + '" data-si="' + i + '" data-rise>' +
      '<button class="gd-step-n" data-tick="' + i + '" aria-pressed="' + (done ? "true" : "false") +
      '" title="Mark this step done">' +
      '<span class="gd-step-num">' + (i + 1) + "</span>" +
      '<span class="gd-step-tick">' + TD.icon("check") + "</span>" +
      "</button>" +
      '<div class="gd-step-b">' +
      '<p class="gd-step-do">' + autolinkGuide(TD.rich(s.do), ctx) + "</p>";

    if (cmd) {
      h += '<div class="gd-cmd">' +
        '<pre><code>' + TD.esc(cmd) + "</code></pre>" +
        '<button class="gd-copy" data-copy="' + TD.esc(cmd).replace(/"/g, "&quot;") + '" title="Copy">' +
        TD.icon("copy") + "</button>" +
        (differs ? '<span class="gd-cmd-os">' + (os === "win" ? "PowerShell" : "bash / zsh") + "</span>" : "") +
        "</div>";
    }
    if (s.out) {
      h += '<p class="gd-out"><span>you should see</span>' + autolinkGuide(TD.rich(s.out), ctx) + "</p>";
    }
    if (s.note) {
      h += '<p class="gd-note">' + autolinkGuide(TD.rich(s.note), ctx) + "</p>";
    }
    return h + "</div></li>";
  }

  TD.viewGuide = function (id) {
    var g = TD.guideById(id);
    if (!g) {
      return '<div class="gd-wrap"><p class="gd-empty">No such guide. ' +
        '<a href="#/guides">Back to all guides</a>.</p></div>';
    }
    var ctx = guideLinkCtx(g);
    var grp = groupById(g.g) || { n: "", c: "var(--accent)" };
    var os = currentOS();
    var done = readDone()[g.id] || {};
    var p = TD.guideProgress(g.id);

    var h = svgDefs() + '<div class="gd-wrap gd-detail" style="--gc:' + grp.c + '">' +
      '<nav class="gd-crumb"><a href="#/guides" class="gd-back-link">Guides</a><span>/</span>' +
      '<a href="#/guides?g=' + g.g + '">' + TD.esc(grp.n) + "</a></nav>" +

      '<header class="gd-dhead">' +
      "<h1>" + TD.esc(g.t) + "</h1>" +
      '<p class="gd-why">' + autolinkGuide(TD.rich(g.why), ctx) + "</p>" +
      '<div class="gd-meta">' +
      '<span class="gd-meta-i">' + TD.icon("clock") + g.mins + " min</span>" +
      '<span class="gd-meta-i">' + TD.icon("list") + g.steps.length + " steps</span>" +
      '<span class="gd-os gd-os-sm" role="group" aria-label="Platform">' +
      '<button data-gos="win"' + (os === "win" ? ' class="is-on"' : "") + ">Windows</button>" +
      '<button data-gos="mac"' + (os === "mac" ? ' class="is-on"' : "") + ">macOS / Linux</button>" +
      "</span></div>";

    if (g.need && g.need.length) {
      h += '<div class="gd-need"><span>before you start</span><ul>' +
        g.need.map(function (n) { return "<li>" + autolinkGuide(TD.rich(n), ctx) + "</li>"; }).join("") +
        "</ul></div>";
    }
    h += "</header>";

    if (g.diag) h += diagram(g.diag);

    h += '<div class="gd-prog"><div class="gd-prog-bar"><i id="gdBar" style="width:' + p.pct + '%"></i></div>' +
      '<span id="gdProgT">' + p.done + " of " + p.total + " done</span>" +
      (p.done ? '<button class="gd-reset" id="gdReset">reset</button>' : "") +
      "</div>";

    h += '<ol class="gd-steps">' +
      g.steps.map(function (s, i) { return stepBlock(g, s, i, os, !!done[i], ctx); }).join("") +
      "</ol>";

    if (g.fix && g.fix.length) {
      h += '<section class="gd-fix"><h2>' + TD.icon("alert") + "When it goes wrong</h2><dl>" +
        g.fix.map(function (f) {
          return "<dt>" + autolinkGuide(TD.rich(f.p), ctx) + "</dt><dd>" + autolinkGuide(TD.rich(f.s), ctx) + "</dd>";
        }).join("") + "</dl></section>";
    }

    if (g.r && g.r.length) {
      var rTerms = g.r.map(TD.resolve).filter(Boolean);
      if (rTerms.length) {
        h += '<section class="gd-terms"><h2>' + TD.icon("bulb") + "Key Terms in this Guide</h2>" +
          '<div class="gd-terms-row">' +
          rTerms.map(function (t) {
            return '<a class="gd-term-chip" href="#/t/' + t.slug + '">' +
              '<span class="gd-tc-t">' + TD.esc(t.t) + "</span>" +
              '<span class="gd-tc-d">' + TD.esc(t.d) + "</span>" +
              "</a>";
          }).join("") + "</div></section>";
      }
    }

    if (g.next && g.next.length) {
      var nx = g.next.map(TD.guideById).filter(Boolean);
      if (nx.length) {
        h += '<section class="gd-next"><h2>Next</h2><div class="gd-next-row">' +
          nx.map(function (n) {
            var ng = groupById(n.g) || { c: "var(--accent)" };
            return '<a href="#/guides/' + n.id + '" style="--gc:' + ng.c + '">' +
              "<b>" + TD.esc(n.t) + "</b><span>" + n.mins + " min</span></a>";
          }).join("") + "</div></section>";
      }
    }

    return h + "</div>";
  };

  /* ---- interaction ----------------------------------------------------
     One delegated listener on document, guarded so repeated renders of #view
     cannot stack handlers — the same rule the rest of the app follows. */

  function refreshProgress(id) {
    var p = TD.guideProgress(id);
    var bar = document.getElementById("gdBar");
    var txt = document.getElementById("gdProgT");
    if (bar) bar.style.width = p.pct + "%";
    if (txt) txt.textContent = p.done + " of " + p.total + " done";
  }

  document.addEventListener("click", function (e) {
    var t = e.target;

    var back = t.closest && t.closest(".gd-back-link");
    if (back) {
      if (window.history.length > 1) {
        e.preventDefault();
        window.history.back();
        return;
      }
    }

    var chip = t.closest && t.closest("[data-gg]");
    if (chip) {
      state.group = chip.getAttribute("data-gg");
      TD.render && TD.render();
      return;
    }

    var os = t.closest && t.closest("[data-gos]");
    if (os) {
      setOS(os.getAttribute("data-gos"));
      TD.render && TD.render();
      return;
    }

    var tick = t.closest && t.closest("[data-tick]");
    if (tick) {
      var li = tick.closest(".gd-step");
      var wrap = tick.closest(".gd-detail");
      if (!li || !wrap) return;
      var gid = (location.hash.split("/")[2] || "").split("?")[0];
      var i = tick.getAttribute("data-tick");
      var all = readDone();
      var mine = all[gid] || (all[gid] = {});
      if (mine[i]) { delete mine[i]; li.classList.remove("is-done"); tick.setAttribute("aria-pressed", "false"); }
      else { mine[i] = 1; li.classList.add("is-done"); tick.setAttribute("aria-pressed", "true"); }
      writeDone(all);
      refreshProgress(gid);
      return;
    }

    var reset = t.closest && t.closest("#gdReset");
    if (reset) {
      var gid2 = (location.hash.split("/")[2] || "").split("?")[0];
      var d = readDone();
      delete d[gid2];
      writeDone(d);
      TD.render && TD.render();
      return;
    }

    var copy = t.closest && t.closest("[data-copy]");
    if (copy) {
      var text = copy.getAttribute("data-copy");
      try {
        navigator.clipboard.writeText(text);
        copy.classList.add("is-copied");
        setTimeout(function () { copy.classList.remove("is-copied"); }, 1100);
      } catch (err) {}
    }
  });

  document.addEventListener("input", function (e) {
    if (e.target && e.target.id === "gdQ") {
      state.query = e.target.value;
      var grid = document.getElementById("gdGrid");
      if (!grid) return;
      var list = (TD.guides || []).filter(matches);
      grid.innerHTML = list.length ? list.map(card).join("")
        : '<p class="gd-empty">Nothing matches that. Try <b>port</b>, <b>commit</b> or <b>server</b>.</p>';
      /* reveal immediately — these are replacing already-visible cards */
      grid.querySelectorAll("[data-rise]").forEach(function (el) { el.classList.add("is-in"); });
    }
  });

  /* The [data-rise] reveal starts at opacity 0 and is switched on by
     motion.js. app.js stops the motion layer on every route change, so this
     view has to mount it again — otherwise the steps stay invisible.

     TD.mo.net() is the safety net: if an observer never fires (a short page,
     an odd viewport, a browser that reveals nothing), everything is forced
     into its final state after a deadline. A recipe you cannot read is worse
     than a recipe that appears without ceremony. */
  TD.mountGuides = function () {
    var root = document.getElementById("view") || document;
    if (TD.mo) {
      TD.mo.mount(root);
      if (TD.mo.net) TD.mo.net(root);
    } else {
      /* No motion layer at all — show everything rather than nothing. */
      root.querySelectorAll("[data-rise]").forEach(function (el) {
        el.classList.add("is-in");
      });
    }
  };

  TD.guideState = state;
})(window.TD = window.TD || {});
