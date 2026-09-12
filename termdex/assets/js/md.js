/* CoreDumps — compact prose renderer for long-form answer bodies.

   The interview / research / project sections author their answers as plain
   strings so they stay readable and diffable in the data files. Those strings
   carry three kinds of markup that the old code passed straight through
   TD.esc(), so readers saw literal asterisks and dollar signs on screen:

     **bold**, *emphasis*, `code`      inline markup
     ## heading, - bullet, 1. step     block structure
     $x^2$ and $$ ... $$               inline and display maths

   Nothing here is a general Markdown implementation. It is deliberately the
   smallest grammar that covers what the answer bodies actually use, because a
   half-correct general parser fails in ways that are hard to spot spread
   across hundreds of answers.

   Maths is rendered by translating the common LaTeX subset to Unicode rather
   than shipping a typesetting engine — the pages are offline-first and a
   200 KB dependency for "O(n log n)" is a bad trade. Anything the table does
   not know is left as-is, which degrades to "slightly plain" rather than
   "wrong". */
(function (TD) {
  "use strict";

  /* ---------- maths: LaTeX subset to Unicode ---------- */

  var SYMBOLS = {
    /* relations */
    "\\leq": "≤", "\\le": "≤", "\\geq": "≥", "\\ge": "≥",
    "\\neq": "≠", "\\ne": "≠", "\\ll": "≪", "\\gg": "≫",
    "\\approx": "≈", "\\equiv": "≡", "\\sim": "∼",
    "\\propto": "∝", "\\perp": "⊥", "\\parallel": "∥",
    /* operators */
    "\\times": "×", "\\cdot": "·", "\\div": "÷",
    "\\pm": "±", "\\mp": "∓", "\\ast": "∗", "\\star": "⋆",
    "\\oplus": "⊕", "\\otimes": "⊗",
    /* sets and logic */
    "\\subseteq": "⊆", "\\subset": "⊂", "\\supseteq": "⊇",
    "\\supset": "⊃", "\\notin": "∉", "\\in": "∈",
    "\\cup": "∪", "\\cap": "∩", "\\emptyset": "∅",
    "\\varnothing": "∅", "\\forall": "∀", "\\exists": "∃",
    "\\neg": "¬", "\\land": "∧", "\\lor": "∨",
    /* arrows */
    "\\longrightarrow": "⟶", "\\rightarrow": "→", "\\to": "→",
    "\\leftarrow": "←", "\\gets": "←",
    "\\Rightarrow": "⇒", "\\Leftarrow": "⇐",
    "\\leftrightarrow": "↔", "\\Leftrightarrow": "⇔",
    "\\mapsto": "↦", "\\uparrow": "↑", "\\downarrow": "↓",
    /* big operators and calculus */
    "\\sum": "∑", "\\prod": "∏", "\\int": "∫", "\\oint": "∮",
    "\\partial": "∂", "\\nabla": "∇", "\\infty": "∞",
    "\\angle": "∠", "\\degree": "°",
    /* dots */
    "\\ldots": "…", "\\dots": "…", "\\cdots": "⋯",
    "\\vdots": "⋮", "\\ddots": "⋱",
    /* lowercase greek */
    "\\alpha": "α", "\\beta": "β", "\\gamma": "γ",
    "\\delta": "δ", "\\varepsilon": "ε", "\\epsilon": "ε",
    "\\zeta": "ζ", "\\eta": "η", "\\vartheta": "ϑ",
    "\\theta": "θ", "\\iota": "ι", "\\kappa": "κ",
    "\\lambda": "λ", "\\mu": "μ", "\\nu": "ν", "\\xi": "ξ",
    "\\pi": "π", "\\rho": "ρ", "\\sigma": "σ", "\\tau": "τ",
    "\\upsilon": "υ", "\\varphi": "φ", "\\phi": "φ",
    "\\chi": "χ", "\\psi": "ψ", "\\omega": "ω",
    /* uppercase greek */
    "\\Gamma": "Γ", "\\Delta": "Δ", "\\Theta": "Θ",
    "\\Lambda": "Λ", "\\Xi": "Ξ", "\\Pi": "Π",
    "\\Sigma": "Σ", "\\Upsilon": "Υ", "\\Phi": "Φ",
    "\\Psi": "Ψ", "\\Omega": "Ω",
    /* blackboard / script */
    "\\mathbb{R}": "ℝ", "\\mathbb{N}": "ℕ", "\\mathbb{Z}": "ℤ",
    "\\mathbb{Q}": "ℚ", "\\mathbb{C}": "ℂ", "\\mathbb{E}": "E",
    "\\mathbb{P}": "ℙ", "\\mathcal{O}": "O", "\\mathcal{L}": "ℒ",
    "\\mathcal{N}": "N", "\\mathcal{D}": "D",
    /* named operators. LaTeX sets these upright purely as typography, so the
       plain word is the correct Unicode rendering — without them, every
       "$O(n \log n)$" in the banks printed a literal backslash on screen. */
    "\\log": "log", "\\lg": "lg", "\\ln": "ln", "\\exp": "exp",
    "\\min": "min", "\\max": "max", "\\arg": "arg",
    "\\lim": "lim", "\\sup": "sup", "\\inf": "inf",
    "\\gcd": "gcd", "\\lcm": "lcm", "\\bmod": "mod", "\\mod": "mod",
    "\\det": "det", "\\dim": "dim", "\\deg": "deg", "\\Pr": "Pr",
    "\\sin": "sin", "\\cos": "cos", "\\tan": "tan",
    "\\ell": "ℓ", "\\implies": "⇒", "\\impliedby": "⇐",
    /* norm bars, and the sizing commands that only affect delimiters */
    "\\|": "‖", "\\Bigg": "", "\\bigg": "", "\\Big": "", "\\big": "",
    /* spacing that should simply vanish */
    "\\ ": " ", "\\qquad": "    ", "\\quad": "  ", "\\,": " ", "\\;": " ", "\\!": "",
    "\\left": "", "\\right": "", "\\displaystyle": "", "\\limits": ""
  };

  var SUP = {
    "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴",
    "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹",
    "+": "⁺", "-": "⁻", "=": "⁼", "(": "⁽", ")": "⁾",
    "n": "ⁿ", "i": "ⁱ", "T": "ᵀ", "k": "ᵏ", "m": "ᵐ",
    "d": "ᵈ", "a": "ᵃ", "b": "ᵇ", "c": "ᶜ", "x": "ˣ",
    "y": "ʸ", "j": "ʲ", "L": "ᴸ"
  };

  var SUB = {
    "0": "₀", "1": "₁", "2": "₂", "3": "₃", "4": "₄",
    "5": "₅", "6": "₆", "7": "₇", "8": "₈", "9": "₉",
    "+": "₊", "-": "₋", "=": "₌", "(": "₍", ")": "₎",
    "a": "ₐ", "e": "ₑ", "h": "ₕ", "i": "ᵢ", "j": "ⱼ",
    "k": "ₖ", "l": "ₗ", "m": "ₘ", "n": "ₙ", "o": "ₒ",
    "p": "ₚ", "r": "ᵣ", "s": "ₛ", "t": "ₜ", "u": "ᵤ",
    "v": "ᵥ", "x": "ₓ"
  };

  /* Map a run of characters through SUP/SUB. Returns null when even one
     character has no glyph, so the caller can fall back to the literal form
     instead of printing a half-raised expression. */
  function mapRun(run, table) {
    var out = "";
    for (var i = 0; i < run.length; i++) {
      var g = table[run.charAt(i)];
      if (g === undefined) return null;
      out += g;
    }
    return out;
  }

  /* Read a LaTeX group starting at `i` (which must point at "{"), returning
     [contents, indexAfterClosingBrace]. Brace-aware, so nesting survives. */
  function readGroup(s, i) {
    if (s.charAt(i) !== "{") return [s.charAt(i), i + 1];
    var depth = 0, start = i + 1;
    for (var j = i; j < s.length; j++) {
      if (s.charAt(j) === "{") depth++;
      else if (s.charAt(j) === "}") {
        depth--;
        if (depth === 0) return [s.slice(start, j), j + 1];
      }
    }
    return [s.slice(start), s.length];
  }

  function mathToText(src) {
    var s = String(src);

    /* \text{...} and friends carry ordinary words; unwrap them first so their
       contents are not mangled by the symbol pass. */
    s = s.replace(/\\(?:text|mathrm|textit|textbf|operatorname)\s*\{([^{}]*)\}/g, "$1");

    /* \frac{a}{b} becomes a/b, parenthesised only where it would otherwise
       be ambiguous. */
    var guard = 0;
    while (s.indexOf("\\frac") !== -1 && guard++ < 40) {
      var at = s.indexOf("\\frac");
      var i = at + 5;
      while (s.charAt(i) === " ") i++;
      var num = readGroup(s, i);
      var j = num[1];
      while (s.charAt(j) === " ") j++;
      var den = readGroup(s, j);
      var wrapN = /[+\-\s]/.test(num[0]) ? "(" + num[0] + ")" : num[0];
      var wrapD = /[+\-\s]/.test(den[0]) ? "(" + den[0] + ")" : den[0];
      s = s.slice(0, at) + wrapN + "/" + wrapD + s.slice(den[1]);
    }

    /* \sqrt{x}: bare radical for one character, parenthesised otherwise. */
    s = s.replace(/\\sqrt\s*\{([^{}]*)\}/g, function (_, inner) {
      return inner.length === 1 ? "√" + inner : "√(" + inner + ")";
    });
    s = s.replace(/\\sqrt/g, "√");

    /* Row breaks before the symbol pass: "\\ " would otherwise be split by the
       escaped-space key, which consumes the second backslash and leaves a
       stray one behind. */
    s = s.replace(/\\\\/g, "  ");

    /* Named symbols, longest key first so \subseteq is not eaten by \subset. */
    var keys = Object.keys(SYMBOLS).sort(function (a, b) { return b.length - a.length; });
    keys.forEach(function (k) { s = s.split(k).join(SYMBOLS[k]); });

    /* Superscripts and subscripts, braced or single-character. */
    s = s.replace(/\^\{([^{}]*)\}|\^(\S)/g, function (m, braced, single) {
      var run = braced !== undefined ? braced : single;
      return mapRun(run, SUP) || ("^" + run);
    });
    s = s.replace(/_\{([^{}]*)\}|_(\S)/g, function (m, braced, single) {
      var run = braced !== undefined ? braced : single;
      return mapRun(run, SUB) || ("_" + run);
    });

    /* Anything left over: drop stray braces and the LaTeX row break. */
    return s.replace(/\\\\/g, "  ").replace(/[{}]/g, "").trim();
  }

  TD.mathToText = mathToText;

  /* ---------- sentinels ----------
     Lifted spans and blocks are parked behind private-use codepoints. Prose
     cannot contain one, so nothing an author writes can collide with a
     placeholder — which a printable marker like @@CODE0@@ could not promise. */

  var C_OPEN = "\uE000", C_SHUT = "\uE001";   /* inline code span  */
  var B_OPEN = "\uE002", B_SHUT = "\uE003";   /* fenced code block */
  var M_OPEN = "\uE004", M_SHUT = "\uE005";   /* display formula   */

  var RE_CODE = new RegExp(C_OPEN + "(\\d+)" + C_SHUT, "g");
  var RE_BLOCK = new RegExp("^" + B_OPEN + "(\\d+)" + B_SHUT + "$");
  var RE_MATH = new RegExp("^" + M_OPEN + "(\\d+)" + M_SHUT + "$");

  /* A block placeholder is classified as a plain line by kindOf, so the
     paragraph and list loops must test for one or they would swallow it. */
  var BLOCK_HOLE = new RegExp("^[" + B_OPEN + M_OPEN + "]\\d+[" + B_SHUT + M_SHUT + "]$");

  /* ---------- inline markup ---------- */

  /* Runs on already-escaped text. Order matters: code spans are lifted out
     first so that ** inside a code sample is never read as bold. */
  function inline(escaped) {
    var stash = [];
    var s = escaped.replace(/`([^`]+)`/g, function (_, code) {
      stash.push(code);
      return C_OPEN + (stash.length - 1) + C_SHUT;
    });

    /* Display maths inside a paragraph is rare; inline $...$ is everywhere.
       A maths span may not open or close on whitespace, which is what keeps
       prices out of it: in "costs $5 and $10", the only candidate span is
       "5 and " and it ends on a space, so no match is made and both dollar
       signs survive as text. */
    s = s.replace(/\$\$([\s\S]+?)\$\$/g, function (_, m) {
      return '<span class="md-math md-math-em">' + mathToText(m) + "</span>";
    });
    s = s.replace(/\$(?!\s)([^$\n]*[^$\s])\$/g, function (_, m) {
      return '<span class="md-math">' + mathToText(m) + "</span>";
    });

    s = s
      /* Bold first, and tolerant of single asterisks inside it so that
         "**the *user's* permissions**" survives. `\*(?!\*)` admits a lone
         asterisk but never a "**", which is what stops one span from
         swallowing the gap between two separate bold runs. */
      .replace(/\*\*((?:[^*]|\*(?!\*))+)\*\*/g, "<strong>$1</strong>")
      /* Then emphasis, which now also picks up any pair left inside a
         <strong> by the pass above. */
      .replace(/(^|[\s(])\*(?=\S)([^*\n]*\S)\*/g, "$1<em>$2</em>")
      /* Arrows show up constantly in the architecture prose and read badly as
         hyphens. The text arrived escaped, so ">" is already "&gt;". */
      .replace(/--&gt;/g, "⟶")
      .replace(/(\s)-&gt;(\s)/g, "$1→$2");

    RE_CODE.lastIndex = 0;
    return s.replace(RE_CODE, function (_, n) {
      return "<code>" + stash[Number(n)] + "</code>";
    });
  }

  /* ---------- block structure ---------- */

  /* A line-kind classifier keeps the block loop flat rather than nesting a
     regex test per branch. */
  function kindOf(line) {
    if (/^\s*$/.test(line)) return "blank";
    if (/^#{2,4}\s+/.test(line)) return "head";
    if (/^\s*[-•*]\s+/.test(line)) return "ul";
    if (/^\s*\d+[.)]\s+/.test(line)) return "ol";
    if (/^\s*\|.*\|\s*$/.test(line)) return "row";
    if (/^\s*>\s?/.test(line)) return "quote";
    return "p";
  }

  function renderTable(rows) {
    /* Rows arrive as raw "| a | b |" strings. A separator row of dashes marks
       the header boundary; without one the first row is still the header,
       which is what every table in the data files wants. */
    var cells = rows.map(function (r) {
      return r.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map(function (c) {
        return c.trim();
      });
    });
    var sepAt = -1;
    cells.forEach(function (row, i) {
      if (sepAt === -1 && row.length && row.every(function (c) { return /^:?-{2,}:?$/.test(c); })) sepAt = i;
    });
    var head = sepAt > 0 ? cells.slice(0, sepAt) : cells.slice(0, 1);
    var body = sepAt > 0 ? cells.slice(sepAt + 1) : cells.slice(1);

    var thead = head.map(function (row) {
      return "<tr>" + row.map(function (c) { return "<th>" + inline(TD.esc(c)) + "</th>"; }).join("") + "</tr>";
    }).join("");
    var tbody = body.map(function (row) {
      return "<tr>" + row.map(function (c) { return "<td>" + inline(TD.esc(c)) + "</td>"; }).join("") + "</tr>";
    }).join("");

    return '<div class="md-table-wrap"><table class="md-table"><thead>' + thead +
      "</thead><tbody>" + tbody + "</tbody></table></div>";
  }

  /* Render a long-form body to HTML. Every leaf goes through TD.esc() before
     any markup is reintroduced. */
  TD.md = function (src) {
    if (!src) return "";
    var text = String(src).replace(/\r\n?/g, "\n");
    var out = [];

    /* Fenced code is pulled out whole before line processing, since its
       contents must survive verbatim. */
    var blocks = [];
    text = text.replace(/```([a-zA-Z0-9+#-]*)\n([\s\S]*?)```/g, function (_, lang, body) {
      blocks.push({ lang: lang, body: body.replace(/\n$/, "") });
      return "\n" + B_OPEN + (blocks.length - 1) + B_SHUT + "\n";
    });

    /* Display maths on its own line, likewise. */
    var formulas = [];
    text = text.replace(/^[ \t]*\$\$([\s\S]+?)\$\$[ \t]*$/gm, function (_, m) {
      formulas.push(m);
      return "\n" + M_OPEN + (formulas.length - 1) + M_SHUT + "\n";
    });

    var lines = text.split("\n");
    var i = 0;

    while (i < lines.length) {
      var line = lines[i];

      var fence = line.match(RE_BLOCK);
      if (fence) {
        var b = blocks[Number(fence[1])];
        out.push('<pre class="md-code"' + (b.lang ? ' data-lang="' + TD.esc(b.lang) + '"' : "") +
          "><code>" + TD.esc(b.body) + "</code></pre>");
        i++;
        continue;
      }

      var disp = line.match(RE_MATH);
      if (disp) {
        out.push('<div class="md-formula">' + TD.esc(mathToText(formulas[Number(disp[1])])) + "</div>");
        i++;
        continue;
      }

      var kind = kindOf(line);

      if (kind === "blank") { i++; continue; }

      if (kind === "head") {
        var hm = line.match(/^(#{2,4})\s+(.*)$/);
        var lvl = Math.min(hm[1].length + 2, 6);
        out.push("<h" + lvl + ' class="md-h">' + inline(TD.esc(hm[2].trim())) + "</h" + lvl + ">");
        i++;
        continue;
      }

      if (kind === "ul" || kind === "ol") {
        var tag = kind === "ul" ? "ul" : "ol";
        var items = [];
        while (i < lines.length && kindOf(lines[i]) === kind) {
          var raw = lines[i].replace(/^\s*(?:[-•*]|\d+[.)])\s+/, "");
          /* An indented following line is a wrapped continuation, not a new
             item. */
          while (i + 1 < lines.length && /^\s{2,}\S/.test(lines[i + 1]) &&
                 kindOf(lines[i + 1]) === "p" && !BLOCK_HOLE.test(lines[i + 1].trim())) {
            raw += " " + lines[i + 1].trim();
            i++;
          }
          items.push("<li>" + inline(TD.esc(raw)) + "</li>");
          i++;
        }
        out.push("<" + tag + ' class="md-list">' + items.join("") + "</" + tag + ">");
        continue;
      }

      if (kind === "row") {
        var rows = [];
        while (i < lines.length && kindOf(lines[i]) === "row") { rows.push(lines[i]); i++; }
        out.push(renderTable(rows));
        continue;
      }

      if (kind === "quote") {
        var qbuf = [];
        while (i < lines.length && kindOf(lines[i]) === "quote") {
          qbuf.push(lines[i].replace(/^\s*>\s?/, ""));
          i++;
        }
        out.push('<blockquote class="md-quote">' + inline(TD.esc(qbuf.join(" "))) + "</blockquote>");
        continue;
      }

      /* Plain paragraph: absorb following plain lines so a soft-wrapped
         sentence in the source becomes one <p> on screen. */
      var pbuf = [line.trim()];
      i++;
      while (i < lines.length && kindOf(lines[i]) === "p" && !BLOCK_HOLE.test(lines[i].trim())) {
        pbuf.push(lines[i].trim());
        i++;
      }
      out.push('<p class="md-p">' + inline(TD.esc(pbuf.join(" "))) + "</p>");
    }

    return out.join("");
  };

  /* Single-line variant for titles, list items and table cells: inline markup
     only, no block wrapping. */
  TD.mdLine = function (src) {
    if (!src) return "";
    return inline(TD.esc(String(src)));
  };

  /* Plain text with every trace of markup removed — used for search matching
     and for collapsed previews, where markup would be noise. */
  TD.mdPlain = function (src) {
    if (!src) return "";
    return String(src)
      .replace(/```[\s\S]*?```/g, " ")
      .replace(/\$\$([\s\S]+?)\$\$/g, function (_, m) { return mathToText(m); })
      .replace(/\$(?!\s)([^$\n]*[^$\s])\$/g, function (_, m) { return mathToText(m); })
      .replace(/[*`>#|]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  };
})(window.TD = window.TD || {});
