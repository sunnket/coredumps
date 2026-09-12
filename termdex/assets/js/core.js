/* NodeCraft core — data registry, slugs, storage helpers.
   Loaded before every data file. */
(function (w) {
  "use strict";

  var TD = {
    terms: [],
    bySlug: Object.create(null),
    byName: Object.create(null),
    categories: [],
    catById: Object.create(null),
    byCatName: Object.create(null),
    missingAttach: [],
    paths: [],
    pathById: Object.create(null),
    soonPaths: [],

    /* case studies — a second content type alongside terms. Registered the
       same way (define the groups, then add the items) so a future section
       can follow the identical shape without touching anything here. */
    collections: [],
    colById: Object.create(null),
    studies: [],
    studyBySlug: Object.create(null)
  };

  /* ---- slugs ---- */
  var CHAR_MAP = { "+": "plus", "#": "sharp", "&": "and", "/": "-", ".": "-" };

  function slugify(s) {
    var out = String(s).toLowerCase().trim();
    out = out.replace(/[+#&]/g, function (m) { return "-" + CHAR_MAP[m] + "-"; });
    out = out.replace(/[^a-z0-9]+/g, "-");
    out = out.replace(/^-+|-+$/g, "").replace(/-{2,}/g, "-");
    return out || "term";
  }
  TD.slugify = slugify;

  /* ---- normalising key for lookups (related-term resolution) ----
     Keeps the same +, # and & expansion as slugify, because stripping them
     outright collapses C, C++ and C# onto one key — which silently sends all
     three of their extras to whichever registered last. */
  function nkey(s) {
    return String(s).toLowerCase()
      .replace(/[+#&]/g, function (m) { return CHAR_MAP[m]; })
      .replace(/[^a-z0-9]+/g, "");
  }
  TD.nkey = nkey;

  /* ---- category registration ---- */
  TD.defineCategories = function (list) {
    list.forEach(function (c) {
      c.count = 0;
      TD.categories.push(c);
      TD.catById[c.id] = c;
    });
  };

  /* ---- term registration; called by every data/*.js file ---- */
  TD.add = function (catId, entries) {
    entries.forEach(function (e) {
      var slug = slugify(e.t);
      if (TD.bySlug[slug]) {
        var n = 2;
        while (TD.bySlug[slug + "-" + n]) n++;
        slug = slug + "-" + n;
      }
      var term = {
        slug: slug,
        t: e.t,
        a: e.a || "",
        c: catId,
        d: e.d || "",
        b: e.b || [],
        k: e.k || [],
        x: e.x || null,
        dg: e.dg || "",
        r: e.r || [],
        g: e.g || [],
        l: e.l || "core"
      };
      TD.terms.push(term);
      TD.bySlug[slug] = term;
      var bucket = TD.byCatName[catId] || (TD.byCatName[catId] = Object.create(null));
      bucket[nkey(e.t)] = term;
      if (e.a) bucket[nkey(e.a)] = bucket[nkey(e.a)] || term;
      var nk = nkey(e.t);
      if (!TD.byName[nk]) TD.byName[nk] = term;
      if (e.a) {
        var nka = nkey(e.a);
        if (nka && !TD.byName[nka]) TD.byName[nka] = term;
      }
      if (TD.catById[catId]) TD.catById[catId].count++;
    });
  };

  /* ---- reading paths ---------------------------------------------------
     A path is a curated route through the dictionary, authored as a list of
     *parts* — named chapters of a handful of terms each — because a flat run
     of thirty words tells a reader the order and nothing else, while the same
     thirty under six headings tells them the shape of the subject.

     The flat `steps` array is derived from the parts rather than authored
     beside them, so the two can never drift apart.

     Resolution is deferred exactly as stage totals are: this file registers
     paths before a single term has loaded, so anything computed eagerly here
     would be permanently empty. The first read of `terms`, `count` or `mins`
     resolves the whole path once and caches it. */

  function pathMins(terms) {
    var words = 0;
    terms.forEach(function (t) {
      words += String(t.d || "").split(/\s+/).length;
      (t.b || []).forEach(function (para) { words += String(para).split(/\s+/).length; });
    });
    return Math.max(1, Math.round(words / 200));
  }

  function resolvePath(p) {
    if (p._done) return p;
    p._done = true;
    p._terms = [];
    p.parts.forEach(function (part) {
      var found = [];
      (part.s || []).forEach(function (name) {
        var t = TD.resolve(name);
        if (t) { found.push(t); p._terms.push(t); }
        else TD.missingAttach.push("path " + p.id + " :: " + name);
      });
      part._terms = found;
      part.count = found.length;
    });
    p._mins = pathMins(p._terms);
    return p;
  }

  TD.definePaths = function (list) {
    list.forEach(function (p, i) {
      p.i = i;

      /* parts are the authority; a flat legacy path is wrapped in a single
         part so every consumer below has exactly one shape to handle */
      if (!p.parts || !p.parts.length) {
        p.parts = [{ n: p.name, d: p.desc || "", s: p.steps || [] }];
      }

      p.steps = [];
      p.parts.forEach(function (part, n) {
        part.n_ = n + 1;
        (part.s || []).forEach(function (name) { p.steps.push(name); });
        Object.defineProperty(part, "terms", {
          get: function () { resolvePath(p); return part._terms; }
        });
      });

      Object.defineProperty(p, "terms", {
        get: function () { return resolvePath(p)._terms; }
      });
      Object.defineProperty(p, "count", {
        get: function () { return resolvePath(p)._terms.length; }
      });
      Object.defineProperty(p, "mins", {
        get: function () { resolvePath(p); return p._mins; }
      });

      p.kind = p.kind || "role";
      p.icon = p.icon || "path";

      TD.paths.push(p);
      TD.pathById[p.id] = p;
    });
  };

  /* Paths that are planned but not yet written. They are declared rather than
     left out, because a reader looking for the vision track deserves to know
     it is coming instead of concluding the subject is not covered. */
  TD.defineSoonPaths = function (list) {
    list.forEach(function (p) {
      p.soon = true;
      p.kind = p.kind || "role";
      p.icon = p.icon || "path";
      TD.soonPaths.push(p);
      TD.pathById[p.id] = p;
    });
  };

  /* ---- case studies ---------------------------------------------------
     A study is a title, a skim layer (tldr + say) and a body built from
     typed blocks. Blocks are dispatched on their key by study.js, so a new
     block kind — a table, a chart — is one renderer function and needs no
     change to this registry or to any existing study. */

  TD.defineCollections = function (list) {
    list.forEach(function (c) {
      c.count = 0;
      TD.collections.push(c);
      TD.colById[c.id] = c;
    });
  };

  /* Rough reading time. Counts the prose inside whichever block keys carry
     text, so unknown future block types simply contribute nothing. */
  function studyWords(s) {
    var n = String(s.tldr || "").split(/\s+/).length;
    (s.say || []).forEach(function (line) { n += String(line).split(/\s+/).length; });
    (s.k || []).forEach(function (line) { n += String(line).split(/\s+/).length; });
    (s.b || []).forEach(function (blk) {
      ["h", "p", "q", "n"].forEach(function (key) {
        if (blk[key]) n += String(blk[key]).split(/\s+/).length;
      });
      if (blk.l) blk.l.forEach(function (i) { n += String(i).split(/\s+/).length; });
      if (blk.tl) blk.tl.forEach(function (i) {
        n += String(i.t || "").split(/\s+/).length + String(i.d || "").split(/\s+/).length;
      });
    });
    return n;
  }

  TD.addStudies = function (colId, entries) {
    entries.forEach(function (e) {
      var slug = slugify(e.t);
      if (TD.studyBySlug[slug]) {
        var n = 2;
        while (TD.studyBySlug[slug + "-" + n]) n++;
        slug = slug + "-" + n;
      }
      var s = {
        slug: slug,
        t: e.t,
        s: e.s || "",
        y: e.y || 0,
        when: e.when || "",
        col: colId,
        g: e.g || [],
        tldr: e.tldr || "",
        say: e.say || [],
        b: e.b || [],
        k: e.k || [],
        r: e.r || [],
        src: e.src || []
      };
      s.rt = Math.max(2, Math.round(studyWords(s) / 210));
      TD.studies.push(s);
      TD.studyBySlug[slug] = s;
      if (TD.colById[colId]) TD.colById[colId].count++;
    });
  };

  TD.inCollection = function (colId) {
    return TD.studies.filter(function (s) { return s.col === colId; });
  };

  /* ---- extras: real-world examples and flow diagrams, attached by name ----
     Kept in data/extras/*.js so the term files stay readable. Resolution is
     scoped to a category first, so duplicate names across fields never clash. */
  TD.attach = function (catId, map) {
    var bucket = TD.byCatName[catId] || Object.create(null);
    Object.keys(map).forEach(function (name) {
      var term = bucket[nkey(name)] || TD.resolve(name);
      if (!term) { TD.missingAttach.push(catId + " :: " + name); return; }
      var add = map[name];
      if (add.ex) term.ex = add.ex;
      if (add.fl) term.fl = add.fl;
    });
  };

  /* ---- resolve a related-term string to a term object ---- */
  TD.resolve = function (name) {
    return TD.byName[nkey(name)] || TD.bySlug[slugify(name)] || null;
  };

  /* ---- terms of a category, alphabetical ---- */
  TD.inCategory = function (catId) {
    return TD.terms.filter(function (t) { return t.c === catId; });
  };

  /* ---- local storage (defensive: private mode / blocked storage) ---- */
  TD.store = {
    get: function (k, fallback) {
      try {
        var v = w.localStorage.getItem("termdex:" + k);
        return v == null ? fallback : JSON.parse(v);
      } catch (err) { return fallback; }
    },
    set: function (k, v) {
      try { w.localStorage.setItem("termdex:" + k, JSON.stringify(v)); } catch (err) { /* ignore */ }
    }
  };

  /* ---- what the reader has already read -------------------------------
     Path progress needs a memory longer than the twelve-entry "recent"
     list, so visited terms are recorded in their own set. It is capped so
     a heavy reader cannot grow localStorage without bound, and it degrades
     to zero progress rather than throwing when storage is blocked. */

  var SEEN_CAP = 4000;

  TD.seen = {
    list: TD.store.get("seen", []),
    map: null,

    index: function () {
      if (TD.seen.map) return TD.seen.map;
      TD.seen.map = Object.create(null);
      TD.seen.list.forEach(function (s) { TD.seen.map[s] = 1; });
      return TD.seen.map;
    },

    has: function (slug) { return !!TD.seen.index()[slug]; },

    mark: function (slug) {
      if (!slug || TD.seen.has(slug)) return false;
      TD.seen.list.push(slug);
      if (TD.seen.list.length > SEEN_CAP) {
        TD.seen.list = TD.seen.list.slice(-SEEN_CAP);
        TD.seen.map = null;
      } else {
        TD.seen.index()[slug] = 1;
      }
      TD.store.set("seen", TD.seen.list);
      return true;
    },

    clear: function () {
      TD.seen.list = [];
      TD.seen.map = null;
      TD.store.set("seen", []);
    }
  };

  /* A path's completion as one object, shared by the card, the hero and the
     resume panel so the arithmetic lives in exactly one place. */
  TD.pathProgress = function (p) {
    var done = 0;
    p.terms.forEach(function (t) { if (TD.seen.has(t.slug)) done++; });
    return {
      done: done,
      total: p.count,
      pct: p.count ? Math.round((done / p.count) * 100) : 0,
      started: done > 0,
      complete: p.count > 0 && done >= p.count
    };
  };

  /* The next unread term in a path — where "continue" should actually go. */
  TD.pathNext = function (p) {
    for (var i = 0; i < p.terms.length; i++) {
      if (!TD.seen.has(p.terms[i].slug)) return p.terms[i];
    }
    return p.terms[0] || null;
  };

  /* ---- tiny DOM helper ---- */
  TD.esc = function (s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  };

  /* ---- inline maths ---------------------------------------------------
     The depth content carries ~7,900 LaTeX expressions in $…$ delimiters.
     Loading MathJax or KaTeX would break the no-external-scripts rule the
     whole site is built on, so this converts the notation that actually
     appears into styled HTML. It is a transliterator, not a TeX engine:
     the goal is that a reader sees O(n log n) and σ rather than raw
     $\mathcal{O}(n \log n)$ and \sigma.

     Anything it cannot map is left as readable text with the backslash
     stripped, so an unknown command degrades to a word rather than noise. */

  var GREEK = {
    alpha: "α", beta: "β", gamma: "γ", delta: "δ", epsilon: "ε", zeta: "ζ",
    eta: "η", theta: "θ", iota: "ι", kappa: "κ", lambda: "λ", mu: "μ",
    nu: "ν", xi: "ξ", pi: "π", rho: "ρ", sigma: "σ", tau: "τ",
    upsilon: "υ", phi: "φ", chi: "χ", psi: "ψ", omega: "ω",
    Gamma: "Γ", Delta: "Δ", Theta: "Θ", Lambda: "Λ", Xi: "Ξ", Pi: "Π",
    Sigma: "Σ", Upsilon: "Υ", Phi: "Φ", Psi: "Ψ", Omega: "Ω"
  };

  var SYM = {
    times: "×", cdot: "·", div: "÷", pm: "±", mp: "∓",
    le: "≤", leq: "≤", ge: "≥", geq: "≥", neq: "≠", ne: "≠",
    approx: "≈", equiv: "≡", cong: "≅", sim: "∼", propto: "∝",
    to: "→", rightarrow: "→", leftarrow: "←", Rightarrow: "⇒",
    Leftarrow: "⇐", leftrightarrow: "↔", mapsto: "↦",
    uparrow: "↑", downarrow: "↓", rightleftharpoons: "⇌",
    in: "∈", notin: "∉", subset: "⊂", subseteq: "⊆", supset: "⊃",
    sqsubseteq: "⊑", cup: "∪", cap: "∩", bigcup: "⋃", bigcap: "⋂",
    emptyset: "∅", forall: "∀", exists: "∃", nexists: "∄",
    sum: "∑", prod: "∏", int: "∫", infty: "∞", partial: "∂",
    nabla: "∇", sqrt: "√", angle: "∠", perp: "⊥", parallel: "∥",
    wedge: "∧", vee: "∨", bigwedge: "⋀", bigvee: "⋁", neg: "¬",
    oplus: "⊕", otimes: "⊗", bowtie: "⋈", star: "⋆", ast: "∗",
    ldots: "…", dots: "…", cdots: "⋯", vdots: "⋮", ddots: "⋱",
    mid: "|", backslash: "\\", langle: "⟨", rangle: "⟩",
    lfloor: "⌊", rfloor: "⌋", lceil: "⌈", rceil: "⌉",
    prec: "≺", succ: "≻", ll: "≪", gg: "≫", therefore: "∴",
    quad: " ", qquad: "  ", ",": " ", ";": " ", ":": " ", "!": ""
  };

  /* Operators that should read upright, not italic. */
  var OPS = ("log|ln|exp|max|min|arg|argmax|argmin|sin|cos|tan|arcsin|arccos|" +
    "arctan|sinh|cosh|tanh|det|dim|deg|gcd|lcm|sup|inf|lim|mod|Pr").split("|");

  /* Digits and letters that have Unicode super/subscript forms. Anything
     outside these falls back to <sup>/<sub> tags. */
  var SUP = { "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵",
    "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹", "+": "⁺", "-": "⁻", "n": "ⁿ",
    "i": "ⁱ", "T": "ᵀ" };
  var SUB = { "0": "₀", "1": "₁", "2": "₂", "3": "₃", "4": "₄", "5": "₅",
    "6": "₆", "7": "₇", "8": "₈", "9": "₉", "+": "₊", "-": "₋",
    "i": "ᵢ", "j": "ⱼ", "k": "ₖ", "n": "ₙ", "t": "ₜ", "x": "ₓ", "a": "ₐ" };

  function mapScript(txt, table, tag) {
    var out = "", ok = true;
    for (var i = 0; i < txt.length; i++) {
      if (table[txt[i]]) out += table[txt[i]];
      else { ok = false; break; }
    }
    return ok && out ? out : "<" + tag + ">" + txt + "</" + tag + ">";
  }

  /* Pull one balanced {...} group starting at i (which must be "{"),
     returning [contents, indexAfterClosingBrace]. */
  function group(s, i) {
    if (s[i] !== "{") return [s[i] || "", i + 1];
    var depth = 0, start = i + 1;
    for (; i < s.length; i++) {
      if (s[i] === "{") depth++;
      else if (s[i] === "}") { depth--; if (!depth) return [s.slice(start, i), i + 1]; }
    }
    return [s.slice(start), s.length];
  }

  /* Convert the body of a single $…$ expression to HTML. Input has already
     been HTML-escaped by TD.esc, so &amp; and &lt; may be present. */
  function tex(src) {
    var out = "", i = 0;

    while (i < src.length) {
      var c = src[i];

      if (c === "\\") {
        var m = /^\\([a-zA-Z]+|.)/.exec(src.slice(i));
        if (!m) { i++; continue; }
        var name = m[1];
        i += m[0].length;

        if (name === "frac" || name === "tfrac" || name === "dfrac") {
          var n1 = group(src, i); i = n1[1];
          var d1 = group(src, i); i = d1[1];
          out += '<span class="mf"><span class="mf-n">' + tex(n1[0]) +
            '</span><span class="mf-d">' + tex(d1[0]) + "</span></span>";
        } else if (name === "sqrt") {
          var r = group(src, i); i = r[1];
          out += "√<span class=\"msqrt\">" + tex(r[0]) + "</span>";
        } else if (name === "text" || name === "mathrm" || name === "textrm" ||
                   name === "operatorname" || name === "textit" || name === "mbox") {
          var g = group(src, i); i = g[1];
          out += '<span class="mtxt">' + tex(g[0]) + "</span>";
        } else if (name === "mathbf" || name === "bm" || name === "boldsymbol" ||
                   name === "textbf") {
          var b = group(src, i); i = b[1];
          out += "<b>" + tex(b[0]) + "</b>";
        } else if (name === "texttt" || name === "mathtt") {
          var tt = group(src, i); i = tt[1];
          out += "<code>" + tex(tt[0]) + "</code>";
        } else if (name === "mathcal" || name === "mathbb" || name === "mathscr" ||
                   name === "mathfrak" || name === "mathsf") {
          var s2 = group(src, i); i = s2[1];
          out += '<span class="mcal">' + tex(s2[0]) + "</span>";
        } else if (name === "underbrace" || name === "overbrace") {
          /* The brace is decoration; its label follows as a _{...} script and
             is more useful kept than dropped. */
          var ub = group(src, i); i = ub[1];
          out += tex(ub[0]);
        } else if (name === "hat" || name === "bar" || name === "tilde" ||
                   name === "vec" || name === "dot" || name === "overline") {
          var h = group(src, i); i = h[1];
          var acc = { hat: "̂", bar: "̄", tilde: "̃",
            vec: "⃗", dot: "̇", overline: "̄" }[name];
          out += tex(h[0]) + acc;
        } else if (name === "left" || name === "right" || name === "big" ||
                   name === "Big" || name === "bigg" || name === "Bigg") {
          /* size hints carry no meaning here — the delimiter itself follows */
          continue;
        } else if (name === "begin" || name === "end") {
          var e = group(src, i); i = e[1];   /* drop the environment name */
          continue;
        } else if (name === "not") {
          continue;
        } else if (GREEK[name]) {
          out += GREEK[name];
        } else if (SYM[name] !== undefined) {
          out += SYM[name];
        } else if (OPS.indexOf(name) !== -1) {
          out += '<span class="mop">' + name + "</span>";
        } else {
          /* Unknown command: show the word rather than a stray backslash. */
          out += name;
        }
        continue;
      }

      if (c === "^" || c === "_") {
        var g2 = group(src, i + 1);
        i = g2[1];
        var inner = g2[0];
        /* a nested command inside the script needs full conversion */
        out += /[\\{]/.test(inner)
          ? "<" + (c === "^" ? "sup" : "sub") + ">" + tex(inner) +
            "</" + (c === "^" ? "sup" : "sub") + ">"
          : mapScript(inner, c === "^" ? SUP : SUB, c === "^" ? "sup" : "sub");
        continue;
      }

      if (c === "{" || c === "}") { i++; continue; }

      out += c;
      i++;
    }
    return out;
  }

  /* Public: convert $…$ spans in an already-escaped string. Splitting on the
     delimiter pairs means prose between two expressions is never touched. */
  TD.math = function (s) {
    if (s.indexOf("$") === -1) return s;

    /* A literal dollar inside maths is written \$ — a price quoted in a
       formula. Lift those out before splitting or they throw the pairing
       off and the whole expression is left as raw source. */
    var ESC = String.fromCharCode(2);
    s = s.replace(/\\\$/g, ESC);

    function unesc(x) { return x.split(ESC).join("$"); }

    /* Display maths ($$…$$) is set on its own line. It has to be pulled out
       before the single-$ pass, which would otherwise see the doubled
       delimiters as a pair of empty expressions. */
    var block = [];
    var BLK = String.fromCharCode(3);
    s = s.replace(/\$\$([\s\S]+?)\$\$/g, function (_, body) {
      block.push(body);
      return BLK + (block.length - 1) + BLK;
    });

    /* Put the display blocks back, rendered. Runs on every exit path so a
       string containing only display maths is still converted. */
    function restore(x) {
      if (!block.length) return x;
      return x.replace(new RegExp(BLK + "(\\d+)" + BLK, "g"), function (_, n) {
        return '<span class="math math-block">' + tex(unesc(block[+n])) + "</span>";
      });
    }

    var parts = s.split("$");
    /* An odd number of segments means the delimiters pair up. If they do not,
       the $ is something else (a shell variable, currency) — leave it alone. */
    if (parts.length % 2 === 0) return restore(unesc(s));
    var out = parts[0];
    for (var i = 1; i < parts.length; i += 2) {
      var body = parts[i];
      /* An empty or space-only body is not maths. */
      out += body.trim()
        ? '<span class="math">' + tex(unesc(body)) + "</span>"
        : "$" + body + "$";
      out += parts[i + 1];
    }
    return restore(unesc(out));
  };

  /* Some content carries LaTeX commands with no $…$ around them — an author
     writing O(N \log N) or \lambda \sum inline. Those never reach the pass
     above, so the reader gets a raw backslash. This converts the commands
     themselves wherever they appear, without needing delimiters.

     Deliberately conservative: only a fixed list of unambiguous maths names
     is touched, so a Windows path (\Users), a shell escape (\n) or a regex
     (\d) is never altered. */
  var BARE = new RegExp(
    "\\\\(" +
    "alpha|beta|gamma|delta|epsilon|zeta|eta|theta|iota|kappa|lambda|mu|nu|xi|" +
    "rho|sigma|tau|upsilon|phi|chi|psi|omega|" +
    "Gamma|Delta|Theta|Lambda|Xi|Pi|Sigma|Upsilon|Phi|Psi|Omega|" +
    "infty|partial|nabla|approx|times|cdot|div|pm|leq|geq|neq|le|ge|ne|" +
    "rightarrow|leftarrow|Rightarrow|to|mapsto|forall|exists|in|notin|" +
    "subseteq|subset|supset|cup|cap|sum|prod|int|log|ln|exp|max|min|" +
    "argmax|argmin|sqrt|equiv|propto|sim|ldots|dots|cdots|quad" +
    /* Not \b: an underscore counts as a word character, so \b would never
       match in "\beta_j" and the subscript branch would be unreachable. */
    ")(?![A-Za-z])(?:([_^])(\\{[^}]*\\}|[A-Za-z0-9]))?", "g");

  function bareMath(s) {
    if (s.indexOf("\\") === -1) return s;
    return s.replace(BARE, function (whole, name, script, arg) {
      var body;
      if (GREEK[name]) body = GREEK[name];
      else if (SYM[name] !== undefined) body = SYM[name];
      else if (OPS.indexOf(name) !== -1) body = '<span class="mop">' + name + "</span>";
      else return whole;

      /* A trailing _x or ^x belongs to the symbol: "\\beta_j" is one term, not
         a beta followed by loose characters. Captured here rather than
         consumed afterwards, because replace() cannot eat trailing input. */
      if (script) {
        var inner = arg.replace(/^\{|\}$/g, "");
        body += mapScript(inner, script === "^" ? SUP : SUB,
          script === "^" ? "sup" : "sub");
      }
      return '<span class="math">' + body + "</span>";
    });
  }

  /* Inline markup for term bodies: **bold**, `code`, *emphasis* and $maths$. */
  TD.rich = function (s) {
    /* Code spans are lifted out first and restored last. Without this, a
       PowerShell `$_.CPU` or a MongoDB `$match` inside backticks would be
       read as a maths delimiter and mangled. */
    var code = [];
    /* U+0001 cannot appear in the content, so the placeholder is unambiguous. */
    var M = String.fromCharCode(1);
    var text = TD.esc(s).replace(/`([^`]+)`/g, function (_, inner) {
      code.push(inner);
      return M + (code.length - 1) + M;
    });

    text = bareMath(TD.math(text))
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      /* Single asterisks read as emphasis. Run after **bold** so no pair is
         left to match, and require non-space either side so arithmetic like
         "3 * 4 * 5" is untouched. */
      .replace(/\*(?=\S)([^*\n]*\S)\*/g, "<em>$1</em>");

    return text.replace(new RegExp(M + "(\\d+)" + M, "g"), function (_, n) {
      return "<code>" + code[+n] + "</code>";
    });
  };


  /* ---- difficulty levels ---------------------------------------------
     Four rungs, shared by terms, lessons, speaking sessions and questions
     so one badge means one thing everywhere in the product.

       core          you should get this without hesitating
       intermediate  you should get this after the lesson
       advanced      you should get this after the lesson and some practice
       hardcore      designed so that knowing the topic is not enough

     `hardcore` is not simply "advanced, but more so". An advanced question
     asks for a harder fact; a hardcore question is built around the wrong
     answer — the plausible one that a reader who half-knows the material
     will reach for first. Every distractor is somebody's real mistake, so
     getting one wrong is information rather than noise.

     Anything unrecognised falls back to Core, which keeps a typo in a data
     file from rendering an empty badge. */

  var LEVEL_NAME = {
    core: "Core",
    intermediate: "Intermediate",
    advanced: "Advanced",
    hardcore: "Hardcore"
  };

  TD.levels = ["core", "intermediate", "advanced", "hardcore"];
  TD.levelName = function (l) { return LEVEL_NAME[l] || "Core"; };
  TD.levelRank = function (l) {
    var i = TD.levels.indexOf(l);
    return i < 0 ? 0 : i;
  };

  /* ---- learn tracks -------------------------------------------------
     A third content type, registered the same way as the first two:
     define the groupings, then add the items. The one structural
     difference is that a track carries an explicit list of modules, so a
     syllabus has three levels (track -> module -> lesson) where a study
     has two. Everything else — slugs, accent colours, search, routing —
     follows the pattern categories and collections already set. */

  TD.tracks = [];
  TD.trackById = Object.create(null);
  TD.lessons = [];
  TD.lessonByKey = Object.create(null);

  TD.defineTracks = function (list) {
    list.forEach(function (t) {
      t.count = 0;
      t.mins = 0;
      t.modIndex = Object.create(null);
      (t.modules || []).forEach(function (m, i) {
        m.count = 0;
        m.mins = 0;
        m.n = i + 1;
        m.track = t.id;
        t.modIndex[m.id] = m;
      });
      TD.tracks.push(t);
      TD.trackById[t.id] = t;
    });
  };

  /* Rough reading time, same idea as studies: count the prose in the block
     keys that carry text, so an unrecognised future block adds zero rather
     than throwing. Annotated code counts extra per line — a reader spends
     longer on a line of code plus its explanation than on the same number
     of words of plain prose. */
  function lessonWords(L) {
    var n = 0;
    function words(s) { return String(s || "").split(/\s+/).length; }
    n += words(L.s);
    (L.goal || []).forEach(function (g) { n += words(g); });
    (L.k || []).forEach(function (g) { n += words(g); });
    (L.b || []).forEach(function (blk) {
      ["h", "p", "q", "n", "trap", "ana"].forEach(function (key) {
        if (blk[key]) n += words(blk[key]);
      });
      if (blk.l) blk.l.forEach(function (i) { n += words(i); });
      if (blk.ol) blk.ol.forEach(function (i) { n += words(i); });
      if (blk.code && blk.code.lines) {
        blk.code.lines.forEach(function (ln) { n += words(ln.w) + 6; });
      }
      if (blk.tbl && blk.tbl.rows) {
        blk.tbl.rows.forEach(function (row) {
          row.forEach(function (cell) { n += words(cell); });
        });
      }
      if (blk.tryit) n += words(blk.tryit.task) + words(blk.tryit.hint) + 20;
    });
    return n;
  }

  TD.addLessons = function (trackId, entries) {
    var tr = TD.trackById[trackId];
    entries.forEach(function (e) {
      var slug = slugify(e.t);
      var key = trackId + "/" + slug;
      if (TD.lessonByKey[key]) {
        var n = 2;
        while (TD.lessonByKey[trackId + "/" + slug + "-" + n]) n++;
        slug = slug + "-" + n;
        key = trackId + "/" + slug;
      }
      var L = {
        key: key,
        slug: slug,
        track: trackId,
        t: e.t,
        m: e.m || "",
        s: e.s || "",
        lvl: e.lvl || "core",
        goal: e.goal || [],
        b: e.b || [],
        k: e.k || [],
        r: e.r || [],
        drill: e.drill || null
      };
      L.mins = e.mins || Math.max(3, Math.round(lessonWords(L) / 190));
      TD.lessons.push(L);
      TD.lessonByKey[key] = L;
      if (tr) {
        tr.count++;
        tr.mins += L.mins;
        var mod = tr.modIndex[L.m];
        if (mod) { mod.count++; mod.mins += L.mins; }
      }
    });
  };

  TD.inTrack = function (trackId) {
    return TD.lessons.filter(function (L) { return L.track === trackId; });
  };

  TD.inModule = function (trackId, modId) {
    return TD.lessons.filter(function (L) { return L.track === trackId && L.m === modId; });
  };

  /* The flat reading order for a track: module by module, lesson by lesson.
     Drives prev/next and the continue card. Anything whose module id does
     not match a declared module still appears at the end, rather than
     silently vanishing from the syllabus. */
  TD.trackOrder = function (trackId) {
    var tr = TD.trackById[trackId];
    if (!tr) return [];
    var out = [];
    (tr.modules || []).forEach(function (m) {
      TD.inModule(trackId, m.id).forEach(function (L) { out.push(L); });
    });
    TD.inTrack(trackId).forEach(function (L) {
      if (out.indexOf(L) < 0) out.push(L);
    });
    return out;
  };

  /* ---- the roadmap ------------------------------------------------
     Stages sit above tracks: a track says what it teaches, a stage says
     when to take it. Registered the same way as everything else, so the
     ordering of the whole course lives in one editable list rather than
     being implied by the order of the cards on a page. */

  TD.stages = [];
  TD.stageById = Object.create(null);
  TD.stageOfTrack = Object.create(null);

  TD.defineStages = function (list) {
    list.forEach(function (st, i) {
      st.i = i;
      /* Resolve declared track ids once, dropping any that do not exist so
         a half-written roadmap renders rather than throwing. */
      st.trackList = (st.tracks || []).map(function (id) {
        return TD.trackById[id];
      }).filter(Boolean);
      /* Totals are read live rather than captured. Stages are declared at the
         end of the track file, which loads before any lesson file, so at this
         moment every track count is still zero — a snapshot here would be
         permanently wrong. */
      Object.defineProperty(st, "lessons", {
        get: function () {
          return st.trackList.reduce(function (a, t) { return a + t.count; }, 0);
        }
      });
      Object.defineProperty(st, "mins", {
        get: function () {
          return st.trackList.reduce(function (a, t) { return a + t.mins; }, 0);
        }
      });
      st.trackList.forEach(function (t) { TD.stageOfTrack[t.id] = st; });
      TD.stages.push(st);
      TD.stageById[st.id] = st;
    });
  };

  /* Completion across every track in a stage, as one figure. */
  TD.stageProgress = function (st) {
    var done = st.trackList.reduce(function (a, t) {
      return a + TD.progress.inTrack(t.id);
    }, 0);
    return {
      done: done,
      total: st.lessons,
      pct: st.lessons ? Math.round((done / st.lessons) * 100) : 0,
      started: done > 0,
      complete: st.lessons > 0 && done >= st.lessons
    };
  };

  /* The single lesson a brand-new reader should open. The first lesson of
     the first stage's first track, worked out rather than hard-coded, so
     it follows the roadmap if the roadmap is reordered. */
  TD.firstLesson = function () {
    for (var i = 0; i < TD.stages.length; i++) {
      var st = TD.stages[i];
      if (st.optional) continue;
      for (var j = 0; j < st.trackList.length; j++) {
        var order = TD.trackOrder(st.trackList[j].id);
        if (order.length) return order[0];
      }
    }
    return TD.lessons[0] || null;
  };

  /* Where the reader actually is: the first stage that is not finished.
     Drives the "you are here" marker on the roadmap. */
  TD.currentStage = function () {
    for (var i = 0; i < TD.stages.length; i++) {
      var st = TD.stages[i];
      if (st.optional) continue;
      if (!TD.stageProgress(st).complete) return st;
    }
    return TD.stages[TD.stages.length - 1] || null;
  };

  TD.lesson = function (trackId, slug) {
    return TD.lessonByKey[trackId + "/" + slug] || null;
  };

  /* ---- learner progress ------------------------------------------------
     Completion, the practice queue and the streak live in localStorage
     through TD.store, so a blocked-storage browser degrades to a perfectly
     usable stateless course rather than throwing. */

  function dayKey(d) {
    return d.getFullYear() + "-" +
      ("0" + (d.getMonth() + 1)).slice(-2) + "-" +
      ("0" + d.getDate()).slice(-2);
  }

  TD.progress = {
    done: TD.store.get("learn:done", []),
    streak: TD.store.get("learn:streak", { last: "", n: 0 }),

    isDone: function (key) { return TD.progress.done.indexOf(key) >= 0; },

    mark: function (key) {
      if (TD.progress.isDone(key)) return false;
      TD.progress.done.push(key);
      TD.store.set("learn:done", TD.progress.done);
      TD.progress.touchStreak();
      return true;
    },

    unmark: function (key) {
      var i = TD.progress.done.indexOf(key);
      if (i < 0) return false;
      TD.progress.done.splice(i, 1);
      TD.store.set("learn:done", TD.progress.done);
      return true;
    },

    toggle: function (key) {
      if (TD.progress.isDone(key)) { TD.progress.unmark(key); return false; }
      TD.progress.mark(key);
      return true;
    },

    inTrack: function (trackId) {
      var n = 0;
      TD.progress.done.forEach(function (k) {
        if (k.indexOf(trackId + "/") === 0) n++;
      });
      return n;
    },

    /* the next unfinished lesson in reading order, or null when the track
       is complete */
    next: function (trackId) {
      var order = TD.trackOrder(trackId);
      for (var i = 0; i < order.length; i++) {
        if (!TD.progress.isDone(order[i].key)) return order[i];
      }
      return null;
    },

    /* most recently finished lesson across every track */
    last: function () {
      var d = TD.progress.done;
      for (var i = d.length - 1; i >= 0; i--) {
        var L = TD.lessonByKey[d[i]];
        if (L) return L;
      }
      return null;
    },

    today: function () { return dayKey(new Date()); },

    yesterday: function () {
      var y = new Date();
      y.setDate(y.getDate() - 1);
      return dayKey(y);
    },

    /* A day counts once a lesson is completed or a drill cleared. */
    touchStreak: function () {
      var s = TD.progress.streak;
      var today = TD.progress.today();
      if (s.last === today) return s.n;
      s.n = (s.last === TD.progress.yesterday()) ? s.n + 1 : 1;
      s.last = today;
      TD.store.set("learn:streak", s);
      return s.n;
    },

    /* The streak as it should be displayed. A missed day breaks it, and the
       display must not keep claiming otherwise just because nothing has
       run to reset the stored value. */
    streakNow: function () {
      var s = TD.progress.streak;
      if (!s.last) return 0;
      if (s.last === TD.progress.today()) return s.n;
      return s.last === TD.progress.yesterday() ? s.n : 0;
    }
  };


  /* ---- careers ---------------------------------------------------------
     A fourth content type, registered exactly like the first three: define
     the groupings, then add the items. A family is to a role what a
     category is to a term.

     The one idea worth naming here is how a role links to the course. A
     role's study plan points at track ids. Rather than hand-maintaining a
     "we haven't written this yet" flag in twenty places, a step whose
     target track does not exist resolves to "coming soon" on its own — so
     the day a track is added, every role that pointed at it lights up with
     no edit to any career file. */

  TD.families = [];
  TD.famById = Object.create(null);
  TD.roles = [];
  TD.roleBySlug = Object.create(null);

  TD.defineFamilies = function (list) {
    list.forEach(function (f) {
      f.count = 0;
      TD.families.push(f);
      TD.famById[f.id] = f;
    });
  };

  TD.addRoles = function (famId, entries) {
    entries.forEach(function (e) {
      var slug = e.id || slugify(e.t);
      if (TD.roleBySlug[slug]) {
        var n = 2;
        while (TD.roleBySlug[slug + "-" + n]) n++;
        slug = slug + "-" + n;
      }
      var r = {
        slug: slug,
        t: e.t,
        a: e.a || "",
        fam: famId,
        icon: e.icon || "compass",
        tag: e.tag || "",
        deck: e.deck || "",
        demand: e.demand || "steady",
        what: e.what || [],
        day: e.day || [],
        fit: e.fit || null,
        skills: e.skills || [],
        stack: e.stack || [],
        edge: e.edge || [],
        ladder: e.ladder || [],
        pay: e.pay || null,
        cos: e.cos || [],
        hire: e.hire || [],
        proof: e.proof || [],
        plan: e.plan || [],
        myths: e.myths || [],
        next: e.next || [],
        r: e.r || []
      };

      /* One shared ceiling for every salary bar on the page. Bars drawn to
         per-band scales look identical at every level, which is the exact
         opposite of what a salary chart is for. */
      r.payTop = (r.pay && r.pay.bands || []).reduce(function (a, b) {
        return Math.max(a, b.hi || 0);
      }, 0);

      /* Skill totals, read live so a card and a page never disagree. */
      r.skillCount = r.skills.reduce(function (a, g) {
        return a + (g.items || []).length;
      }, 0);

      TD.roles.push(r);
      TD.roleBySlug[slug] = r;
      if (TD.famById[famId]) TD.famById[famId].count++;
    });
  };

  /* Two pieces of career advice that belong to no single role: the phases
     every technical career passes through, and the hiring playbook. Set the
     same way paths are — one assignment, edited in one file. */
  TD.careerPhases = [];
  TD.definePhases = function (l) { TD.careerPhases = l; };

  TD.careerGuide = null;
  TD.defineCareerGuide = function (g) { TD.careerGuide = g; };

  TD.inFamily = function (famId) {
    return TD.roles.filter(function (r) { return r.fam === famId; });
  };

  /* Resolve one study-plan step to something linkable. A step names a track
     ("python"), a dictionary term, or an external idea we have not written
     yet — and the third case must render as an honest "coming soon" chip
     rather than a link into a 404. */
  TD.resolveStep = function (step) {
    var out = { label: step.n || "", note: step.d || "", href: null, kind: "soon", soon: true };
    if (step.soon) return out;
    if (step.track) {
      var tr = TD.trackById[step.track];
      if (tr) {
        out.href = "#/learn/" + tr.id;
        out.kind = "track";
        out.soon = false;
        out.label = step.n || tr.short;
        return out;
      }
      return out;
    }
    if (step.term) {
      var t = TD.resolve(step.term);
      if (t) {
        out.href = "#/t/" + t.slug;
        out.kind = "term";
        out.soon = false;
        out.label = step.n || t.t;
        return out;
      }
      return out;
    }
    if (step.href) {
      out.href = step.href;
      out.kind = step.kind || "link";
      out.soon = false;
    }
    return out;
  };

  /* How much of a role's plan we can actually teach today. Drives the
     "N of M covered" line on every role card, and it is derived, never
     stored, so it stays true as tracks are written. */
  TD.roleCoverage = function (r) {
    var steps = r.plan || [];
    var ready = steps.filter(function (s) { return !TD.resolveStep(s).soon; }).length;
    return {
      ready: ready,
      total: steps.length,
      pct: steps.length ? Math.round((ready / steps.length) * 100) : 0
    };
  };

  /* A role's skills flattened to the ones that matter most, for cards. */
  TD.mustSkills = function (r, n) {
    var out = [];
    r.skills.forEach(function (g) {
      (g.items || []).forEach(function (it) {
        if (it.lvl === "must") out.push(it.n);
      });
    });
    return out.slice(0, n || 5);
  };


  w.TD = TD;
})(window);
