/* NodeCraft Speech — the speaking engine.

   Reading advice about speaking is worth almost nothing. The gap between
   knowing that you say "basically" too much and hearing that you said it
   nine times in ninety seconds is the entire product. This file closes it.

   Three separable pieces, in order:

     1. CAPTURE   the microphone. Web Speech API for words, Web Audio for
                  loudness. Both are optional and both degrade to a typed
                  transcript rather than to a broken page.

     2. COMPARE   what was said against what should have been said. Text is
                  normalised hard (contractions expanded, digits spelled,
                  punctuation dropped) and then aligned with a real edit
                  script, so a missed word and a wrong word are told apart
                  instead of both being counted as "not matching".

     3. JUDGE     turn the alignment plus the timings into numbers a learner
                  can act on — accuracy, pace, fillers, repetition, coverage
                  — and then into sentences, because a number alone never
                  changed how anybody speaks.

   The engine holds no content. Sessions live in data/learn/speak/. The
   scoring rules live here; what to say lives there.

   Browser reality, stated plainly rather than discovered by the reader:
   SpeechRecognition ships in Chrome, Edge and Safari and does not ship in
   Firefox. Every path here works without it — you type what you said and
   get the same analysis, minus the transcription. Nothing is ever uploaded
   by this file; the browser's own recogniser does whatever it does, and the
   transcript never leaves the page.
*/
(function (TD) {
  "use strict";

  var S = {};
  TD.speech = S;

  /* ==================================================================
     1. Capture
     ================================================================== */

  var Rec = window.SpeechRecognition || window.webkitSpeechRecognition || null;

  S.support = function () {
    var secure = window.isSecureContext !== false;
    return {
      rec: !!Rec && secure,
      tts: !!window.speechSynthesis,
      meter: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia &&
        (window.AudioContext || window.webkitAudioContext)),
      secure: secure,
      why: !Rec
        ? "This browser has no speech recognition. Chrome, Edge and Safari have it; Firefox does not."
        : !secure
          ? "Speech recognition needs a secure page. Open this over https or on localhost."
          : ""
    };
  };

  /* A recogniser wrapped so the rest of the app never touches the raw API.

     Two behaviours are worth naming. First, Chrome fires `end` on its own
     after a pause even in continuous mode; a session that is still meant to
     be running restarts it, so a thinking pause does not silently end the
     take. Second, `interim` results are kept separate from `final` ones —
     the live caption needs the guesses, the score must only ever see the
     committed text. */

  S.listen = function (opts) {
    opts = opts || {};
    var on = opts.on || {};
    var r = null;
    var running = false;
    var wantRun = false;
    var finals = [];
    var confs = [];
    var stamps = [];          /* ms from start, one per final chunk */
    var t0 = 0;
    var stopAt = 0;

    function emit(name, a, b) { if (on[name]) on[name](a, b); }

    function build() {
      var x = new Rec();
      x.lang = opts.lang || "en-US";
      x.continuous = true;
      x.interimResults = true;
      x.maxAlternatives = 1;

      x.onresult = function (ev) {
        var interim = "";
        for (var i = ev.resultIndex; i < ev.results.length; i++) {
          var res = ev.results[i];
          var txt = res[0] && res[0].transcript ? res[0].transcript : "";
          if (res.isFinal) {
            finals.push(txt.trim());
            stamps.push(Date.now() - t0);
            if (res[0] && typeof res[0].confidence === "number" && res[0].confidence > 0) {
              confs.push(res[0].confidence);
            }
          } else {
            interim += txt;
          }
        }
        emit("text", finals.join(" ").trim(), interim.trim());
      };

      x.onerror = function (ev) {
        var code = ev.error || "unknown";
        /* `no-speech` and `aborted` are ordinary events, not failures: the
           first means a quiet stretch, the second means we stopped it. */
        if (code === "no-speech" || code === "aborted") return;
        wantRun = false;
        emit("error", code, code === "not-allowed"
          ? "Microphone permission was refused. Allow it in the address bar, then try again."
          : code === "audio-capture"
            ? "No microphone was found. Check that one is plugged in and selected."
            : code === "network"
              ? "The recogniser could not reach the network. Check your connection."
              : "Speech recognition stopped unexpectedly (" + code + ").");
      };

      x.onend = function () {
        running = false;
        /* Restart if the take is still meant to be running and we have not
           passed the time limit. */
        if (wantRun && (!stopAt || Date.now() < stopAt)) {
          try { x.start(); running = true; return; } catch (err) { /* fall through */ }
        }
        wantRun = false;
        emit("end", S.pack(finals, confs, stamps, t0));
      };

      return x;
    }

    return {
      supported: !!Rec,

      start: function () {
        if (!Rec) return false;
        finals = []; confs = []; stamps = [];
        t0 = Date.now();
        stopAt = opts.secs ? t0 + opts.secs * 1000 + 4000 : 0;
        wantRun = true;
        try {
          r = build();
          r.start();
          running = true;
          emit("start");
          return true;
        } catch (err) {
          wantRun = false;
          emit("error", "start", "The microphone could not be started. Close any other tab using it and try again.");
          return false;
        }
      },

      stop: function () {
        wantRun = false;
        if (r && running) { try { r.stop(); } catch (err) { /* ignore */ } }
        else emit("end", S.pack(finals, confs, stamps, t0));
      },

      abort: function () {
        wantRun = false;
        if (r) { try { r.abort(); } catch (err) { /* ignore */ } }
        running = false;
      },

      elapsed: function () { return t0 ? Date.now() - t0 : 0; }
    };
  };

  /* One take, as the scorer wants it. */
  S.pack = function (finals, confs, stamps, t0) {
    var text = finals.join(" ").replace(/\s+/g, " ").trim();
    var ms = t0 ? Date.now() - t0 : 0;
    var conf = confs.length
      ? confs.reduce(function (a, b) { return a + b; }, 0) / confs.length
      : 0;
    return { text: text, ms: ms, conf: conf, chunks: finals.slice(), stamps: (stamps || []).slice() };
  };

  /* ---- loudness ------------------------------------------------------
     Not scored, and deliberately so — a level meter that fed into a mark
     would only ever punish people with quiet microphones. It exists for
     one reason: when nothing is being transcribed, the bar tells you at a
     glance whether the problem is the microphone or the recogniser. */

  S.meter = function (onLevel) {
    var ctx = null, stream = null, raf = null, dead = false;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return { stop: function () { } };
    }
    navigator.mediaDevices.getUserMedia({ audio: true }).then(function (s) {
      if (dead) { s.getTracks().forEach(function (t) { t.stop(); }); return; }
      stream = s;
      ctx = new AC();
      var src = ctx.createMediaStreamSource(s);
      var an = ctx.createAnalyser();
      an.fftSize = 512;
      an.smoothingTimeConstant = 0.75;
      src.connect(an);
      var buf = new Uint8Array(an.frequencyBinCount);
      (function tick() {
        if (dead) return;
        an.getByteTimeDomainData(buf);
        var peak = 0;
        for (var i = 0; i < buf.length; i++) {
          var v = Math.abs(buf[i] - 128) / 128;
          if (v > peak) peak = v;
        }
        onLevel(Math.min(1, peak * 2.4));
        raf = requestAnimationFrame(tick);
      })();
    })["catch"](function () { /* no meter; the take still works */ });

    return {
      stop: function () {
        dead = true;
        if (raf) cancelAnimationFrame(raf);
        if (stream) stream.getTracks().forEach(function (t) { t.stop(); });
        if (ctx && ctx.close) { try { ctx.close(); } catch (e) { /* ignore */ } }
      }
    };
  };

  /* ---- the model voice ----------------------------------------------
     Used by shadow activities, and by the "hear it" button anywhere a
     target line is shown. Prefers a real en-GB/en-US voice over whatever
     the platform defaults to, and slows slightly below natural pace,
     because a model you cannot follow is not a model. */

  var voice = null;

  function pickVoice() {
    if (!window.speechSynthesis) return null;
    if (voice) return voice;
    var all = window.speechSynthesis.getVoices() || [];
    if (!all.length) return null;
    var pref = ["Google UK English Female", "Google US English", "Samantha", "Daniel", "Microsoft Aria", "Microsoft Guy"];
    for (var i = 0; i < pref.length; i++) {
      for (var j = 0; j < all.length; j++) {
        if (all[j].name === pref[i]) { voice = all[j]; return voice; }
      }
    }
    for (var k = 0; k < all.length; k++) {
      if (/^en[-_]/i.test(all[k].lang)) { voice = all[k]; return voice; }
    }
    voice = all[0];
    return voice;
  }

  if (window.speechSynthesis) {
    try { window.speechSynthesis.onvoiceschanged = function () { voice = null; pickVoice(); }; }
    catch (e) { /* ignore */ }
  }

  S.say = function (text, opts) {
    opts = opts || {};
    if (!window.speechSynthesis || !text) { if (opts.onend) opts.onend(); return false; }
    try {
      window.speechSynthesis.cancel();
      var u = new SpeechSynthesisUtterance(String(text));
      var v = pickVoice();
      if (v) u.voice = v;
      u.lang = (v && v.lang) || "en-US";
      u.rate = opts.rate || 0.92;
      u.pitch = opts.pitch || 1;
      if (opts.onend) u.onend = opts.onend;
      window.speechSynthesis.speak(u);
      return true;
    } catch (err) {
      if (opts.onend) opts.onend();
      return false;
    }
  };

  S.hush = function () {
    if (window.speechSynthesis) { try { window.speechSynthesis.cancel(); } catch (e) { /* ignore */ } }
  };


  /* ==================================================================
     2. Compare

     Normalisation is where a naive scorer dies. A recogniser writes "I'm"
     or "I am" more or less at random, gives you "5" where the script says
     "five", drops most punctuation and capitalises unpredictably. Marking
     any of that as an error would tell the learner they mispronounced a
     word they said perfectly, which is worse than no feedback at all.

     So both sides are pushed through the same funnel and only then
     compared. Anything that survives the funnel is a real difference.
     ================================================================== */

  var EXPAND = {
    "i'm": "i am", "im": "i am", "i've": "i have", "i'll": "i will", "i'd": "i would",
    "you're": "you are", "youre": "you are", "you've": "you have", "you'll": "you will", "you'd": "you would",
    "we're": "we are", "we've": "we have", "we'll": "we will", "we'd": "we would",
    "they're": "they are", "theyre": "they are", "they've": "they have", "they'll": "they will", "they'd": "they would",
    "he's": "he is", "she's": "she is", "it's": "it is", "its": "it is",
    "he'll": "he will", "she'll": "she will", "it'll": "it will",
    "he'd": "he would", "she'd": "she would",
    "that's": "that is", "thats": "that is", "there's": "there is", "theres": "there is",
    "here's": "here is", "what's": "what is", "who's": "who is", "let's": "let us",
    "don't": "do not", "dont": "do not", "doesn't": "does not", "doesnt": "does not",
    "didn't": "did not", "didnt": "did not", "isn't": "is not", "isnt": "is not",
    "aren't": "are not", "arent": "are not", "wasn't": "was not", "weren't": "were not",
    "can't": "can not", "cant": "can not", "cannot": "can not",
    "couldn't": "could not", "wouldn't": "would not", "shouldn't": "should not",
    "won't": "will not", "wont": "will not", "haven't": "have not", "hasn't": "has not",
    "hadn't": "had not", "mustn't": "must not", "we'd've": "we would have",
    "would've": "would have", "could've": "could have", "should've": "should have",
    "might've": "might have", "must've": "must have",
    "ok": "okay", "o.k.": "okay", "'cause": "because", "cos": "because",
    "gonna": "going to", "wanna": "want to", "gotta": "got to", "kinda": "kind of",
    "sorta": "sort of", "lemme": "let me", "gimme": "give me", "dunno": "do not know"
  };

  var NUM = {
    "0": "zero", "1": "one", "2": "two", "3": "three", "4": "four", "5": "five",
    "6": "six", "7": "seven", "8": "eight", "9": "nine", "10": "ten",
    "11": "eleven", "12": "twelve", "13": "thirteen", "14": "fourteen", "15": "fifteen",
    "16": "sixteen", "17": "seventeen", "18": "eighteen", "19": "nineteen", "20": "twenty",
    "30": "thirty", "40": "forty", "50": "fifty", "60": "sixty", "70": "seventy",
    "80": "eighty", "90": "ninety", "100": "hundred", "1000": "thousand",
    "1st": "first", "2nd": "second", "3rd": "third", "4th": "fourth", "5th": "fifth"
  };

  /* British and American spellings of the same word are the same word. The
     recogniser picks a side based on the voice model, not on the speaker. */
  function deLocale(w) {
    return w
      .replace(/([a-z]{3,})isation$/, "$1ization")
      .replace(/([a-z]{3,})ise$/, "$1ize")
      .replace(/([a-z]{3,})ised$/, "$1ized")
      .replace(/([a-z]{3,})ising$/, "$1izing")
      .replace(/^(behavi|col|fav|hon|lab|neighb|hum|flav|rum|end|vig)our/, "$1or")
      .replace(/^(cent|met|lit|theat|fib)re$/, "$1er")
      .replace(/^(travel|cancel|label|model|signal|total)l(ed|ing|er)$/, "$1$2");
  }

  /* The funnel. Returns an array of comparable word tokens. */
  S.words = function (text) {
    if (!text) return [];
    var s = String(text)
      .toLowerCase()
      .replace(/[‘’ʼ]/g, "'")     /* smart apostrophes */
      .replace(/[“”]/g, '"')
      .replace(/[–—]/g, " ")           /* dashes are spaces */
      .replace(/(\d),(\d)/g, "$1$2")             /* 1,200 -> 1200 */
      .replace(/[^a-z0-9'%.\s-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    var out = [];
    s.split(" ").forEach(function (raw) {
      if (!raw) return;
      var w = raw.replace(/^[-'.]+|[-'.]+$/g, "");
      if (!w) return;
      if (EXPAND[w]) { EXPAND[w].split(" ").forEach(function (p) { out.push(p); }); return; }
      if (NUM[w]) { out.push(NUM[w]); return; }
      if (w.indexOf("-") > 0) { w.split("-").forEach(function (p) { if (p) out.push(deLocale(p)); }); return; }
      out.push(deLocale(w));
    });
    return out;
  };

  /* ---- alignment -----------------------------------------------------
     Levenshtein over words with a backtrace, which gives an edit script
     rather than a single distance. That distinction is the whole point:
     "you skipped a word" and "you said a different word" need different
     advice, and a bare distance cannot tell them apart.

     Substitutions between words that merely sound close are charged at half
     price, so "affect" for "effect" reads as a near-miss rather than as a
     wholly different word. It changes what the reader is told, which is
     what the number is for. */

  function near(a, b) {
    if (a === b) return true;
    if (Math.abs(a.length - b.length) > 2) return false;
    if (a.length > 3 && b.length > 3) {
      if (a.slice(0, 4) === b.slice(0, 4)) return true;      /* same stem */
      if (a.slice(-3) === b.slice(-3) && a[0] === b[0]) return true;
    }
    /* one edit apart */
    var m = a.length, n = b.length;
    if (Math.abs(m - n) > 1) return false;
    var i = 0, j = 0, edits = 0;
    while (i < m && j < n) {
      if (a[i] === b[j]) { i++; j++; continue; }
      if (++edits > 1) return false;
      if (m > n) i++; else if (n > m) j++; else { i++; j++; }
    }
    return true;
  }

  var SUB = 1, NEARSUB = 0.5, GAP = 1;

  S.align = function (want, got) {
    var m = want.length, n = got.length;
    var d = new Array(m + 1);
    var bt = new Array(m + 1);
    var i, j;
    for (i = 0; i <= m; i++) {
      d[i] = new Array(n + 1);
      bt[i] = new Array(n + 1);
      d[i][0] = i * GAP; bt[i][0] = "d";
    }
    for (j = 0; j <= n; j++) { d[0][j] = j * GAP; bt[0][j] = "i"; }
    bt[0][0] = "";

    for (i = 1; i <= m; i++) {
      for (j = 1; j <= n; j++) {
        var same = want[i - 1] === got[j - 1];
        var cost = same ? 0 : (near(want[i - 1], got[j - 1]) ? NEARSUB : SUB);
        var sub = d[i - 1][j - 1] + cost;
        var del = d[i - 1][j] + GAP;
        var ins = d[i][j - 1] + GAP;
        var best = sub, op = same ? "=" : "s";
        if (del < best) { best = del; op = "d"; }
        if (ins < best) { best = ins; op = "i"; }
        d[i][j] = best;
        bt[i][j] = op;
      }
    }

    var ops = [];
    i = m; j = n;
    while (i > 0 || j > 0) {
      var o = (i > 0 && j > 0) ? bt[i][j] : (i > 0 ? "d" : "i");
      if (o === "=" || o === "s") {
        ops.push({
          op: want[i - 1] === got[j - 1] ? "ok" : (near(want[i - 1], got[j - 1]) ? "near" : "sub"),
          want: want[i - 1], got: got[j - 1]
        });
        i--; j--;
      } else if (o === "d") {
        ops.push({ op: "miss", want: want[i - 1], got: "" });
        i--;
      } else {
        ops.push({ op: "extra", want: "", got: got[j - 1] });
        j--;
      }
    }
    ops.reverse();
    return ops;
  };


  /* ==================================================================
     3. Judge
     ================================================================== */

  /* The words that make a fluent speaker sound unsure. Weighted, because
     "um" once in a minute is human and "basically" nine times is a habit. */
  var FILLER = {
    "um": 1, "uh": 1, "erm": 1, "er": 1, "ah": 0.7, "hmm": 0.7, "mmm": 0.7,
    "like": 0.6, "basically": 1, "actually": 0.7, "literally": 0.9,
    "obviously": 0.7, "honestly": 0.6, "right": 0.4, "yeah": 0.5, "so": 0.25,
    "just": 0.35, "really": 0.4, "very": 0.3, "stuff": 0.6, "things": 0.35
  };
  /* Two-word fillers, checked as pairs. */
  var FILLER2 = {
    "you know": 1, "i mean": 0.9, "sort of": 0.9, "kind of": 0.9,
    "or something": 0.9, "and stuff": 1, "et cetera": 0.5, "and so on": 0.5
  };

  /* Phrasing that reads as junior in a professional setting. Not errors —
     they are all perfectly good English — but each has a stronger neighbour,
     and pointing at them is the single most useful thing this can do for
     someone who is already fluent. */
  var HEDGE = {
    "just": "Drop it. *I just wanted to ask* is *I wanted to ask*, and the second one sounds like it belongs in the room.",
    "sorry": "Reserve it for actual apologies. *Sorry, could you repeat that* is *Could you say that again*.",
    "maybe": "Fine once. Twice in a minute and the listener stops believing you have a position.",
    "hopefully": "It puts the outcome outside your control. Say what you will do instead.",
    "guess": "*I guess* undercuts the sentence it introduces. *I think* is already hedged enough.",
    "little": "*A little bit slower* is *slower*. The softener adds nothing but length."
  };

  function count(words, i) {
    var n = 0;
    for (var k = 0; k < words.length; k++) if (words[k] === i) n++;
    return n;
  }

  /* Filler tally over a token stream, returning both a weighted score and
     the actual offenders, because "you used 6 fillers" is advice and
     "you said *basically* five times" is a change. */
  function fillers(words) {
    var hits = [], weight = 0, total = 0;
    var seen = Object.create(null);
    var i;
    for (i = 0; i < words.length; i++) {
      var w = words[i];
      var two = i + 1 < words.length ? w + " " + words[i + 1] : "";
      if (FILLER2[two]) {
        weight += FILLER2[two]; total++;
        seen[two] = (seen[two] || 0) + 1;
        i++;
        continue;
      }
      if (FILLER[w]) {
        weight += FILLER[w]; total++;
        seen[w] = (seen[w] || 0) + 1;
      }
    }
    Object.keys(seen).forEach(function (k) { hits.push({ w: k, n: seen[k] }); });
    hits.sort(function (a, b) { return b.n - a.n; });
    return { hits: hits, weight: weight, total: total };
  }

  /* Pace. The band is not arbitrary: comfortable presentation English sits
     around 130–150 words a minute, conversation runs a little faster, and
     anything past 190 stops being followable by a non-native listener.

     Below five words there is nothing to measure — a three-word repeat drill
     has no meaningful tempo — and the part is dropped from the blend rather
     than scored zero, because "unmeasurable" and "bad" are different. */
  function pace(nWords, ms) {
    var mins = ms / 60000;
    if (nWords < 5 || ms < 700) return { wpm: 0, band: "short", pts: null };
    var wpm = Math.round(nWords / mins);
    var band = wpm < 90 ? "slow" : wpm < 115 ? "measured" : wpm <= 165 ? "good"
      : wpm <= 190 ? "brisk" : "rushed";
    var pts = band === "good" ? 100 : band === "measured" ? 88 : band === "brisk" ? 78
      : band === "slow" ? 62 : 50;
    return { wpm: wpm, band: band, pts: pts };
  }

  /* Lexical variety. A low ratio over a long answer means the same handful
     of words is doing all the work — the thing that makes an answer sound
     rehearsed and thin at the same time. */
  function variety(words) {
    if (words.length < 25) return { ratio: 1, pts: 100 };
    var seen = Object.create(null), uniq = 0;
    words.forEach(function (w) { if (!seen[w]) { seen[w] = 1; uniq++; } });
    var ratio = uniq / words.length;
    var pts = ratio >= 0.62 ? 100 : ratio >= 0.52 ? 88 : ratio >= 0.44 ? 74 : 58;
    return { ratio: ratio, pts: pts, uniq: uniq };
  }

  /* Long silences. Chunk timestamps are coarse — the recogniser commits a
     chunk when it feels like it — so this only ever reports gaps big enough
     to be unambiguous, and never charges for the first one. Everybody
     pauses to think once. */
  function gaps(stamps, ms) {
    if (!stamps || stamps.length < 3) return { long: 0, pts: 100 };
    var big = 0, prev = 0;
    for (var i = 0; i < stamps.length; i++) {
      if (stamps[i] - prev > 3200) big++;
      prev = stamps[i];
    }
    if (ms - prev > 4000) big++;
    var chargeable = Math.max(0, big - 1);
    return { long: big, pts: Math.max(50, 100 - chargeable * 14) };
  }

  /* Did the answer touch the points it was supposed to touch?
     An expectation is a pipe-separated set of acceptable surface forms —
     "trade-off|tradeoff|compromise" — because there is never one right
     word, and marking a synonym wrong is how a scorer loses trust. */
  function coverage(expect, words) {
    if (!expect || !expect.length) return { pts: 100, hit: [], missed: [] };
    var hay = " " + words.join(" ") + " ";
    var hit = [], missed = [];
    expect.forEach(function (raw) {
      var alts = String(raw).split("|");
      var label = alts[0];
      var found = alts.some(function (alt) {
        var t = S.words(alt);
        if (!t.length) return false;
        return hay.indexOf(" " + t.join(" ") + " ") >= 0;
      });
      if (found) hit.push(label); else missed.push(label);
    });
    return {
      pts: Math.round((hit.length / expect.length) * 100),
      hit: hit, missed: missed
    };
  }

  /* Phrases the activity explicitly asked you not to use. Same pipe syntax. */
  function avoided(avoid, words) {
    if (!avoid || !avoid.length) return { used: [], pts: 100 };
    var hay = " " + words.join(" ") + " ";
    var used = [];
    avoid.forEach(function (raw) {
      var alts = String(raw).split("|");
      alts.forEach(function (alt) {
        var t = S.words(alt);
        if (t.length && hay.indexOf(" " + t.join(" ") + " ") >= 0 && used.indexOf(alts[0]) < 0) {
          used.push(alts[0]);
        }
      });
    });
    return { used: used, pts: Math.max(40, 100 - used.length * 20) };
  }

  function band(score) {
    return score >= 90 ? "excellent" : score >= 78 ? "strong"
      : score >= 64 ? "solid" : score >= 48 ? "developing" : "rough";
  }

  function pct(x) { return Math.max(0, Math.min(100, Math.round(x))); }

  /* The weighted blend of the parts that could actually be measured.

     A part whose value is null was not measurable on this take — pace on a
     four-word drill, range on a one-sentence answer — and is dropped, with
     the remaining weights renormalised over what is left. Scoring an
     unmeasurable part as zero would quietly punish exactly the activities
     that are too short to judge, which is the opposite of the intent. */
  function blend(parts) {
    var live = parts.filter(function (p) { return p.v != null; });
    var w = live.reduce(function (a, x) { return a + x.w; }, 0);
    if (!w) return 0;
    return pct(live.reduce(function (a, x) { return a + x.v * x.w; }, 0) / w);
  }

  /* ---- the two scorers ----------------------------------------------
     Both return the same shape, so the UI renders one result panel rather
     than two. `parts` is what draws the bars; `notes` is what a person
     actually reads. */

  /* read / repeat / shadow — there is a script, so accuracy dominates. */
  S.scoreRead = function (act, take) {
    var want = S.words(act.text);
    var got = S.words(take.text);
    var ops = S.align(want, got);

    var ok = 0, nearHit = 0, sub = 0, miss = 0, extra = 0;
    ops.forEach(function (o) {
      if (o.op === "ok") ok++;
      else if (o.op === "near") nearHit++;
      else if (o.op === "sub") sub++;
      else if (o.op === "miss") miss++;
      else extra++;
    });

    var acc = want.length ? pct(((ok + nearHit * 0.6) / want.length) * 100) : 0;
    /* Extra words are only charged past a small allowance — people say
       "okay" before they start, and that is not a reading error. */
    var slop = Math.max(0, extra - 2);
    var clean = pct(acc - slop * 3);

    var p = pace(got.length, take.ms);
    var f = fillers(got);
    var fPts = pct(100 - (got.length ? (f.weight / got.length) * 420 : 0));

    var parts = [
      { k: "Accuracy", v: clean, w: 0.62, d: ok + " of " + want.length + " words matched" },
      { k: "Pace", v: p.pts, w: 0.22, d: p.wpm ? p.wpm + " words per minute — " + p.band : "too short to measure" },
      { k: "Clarity", v: got.length ? fPts : null, w: 0.16, d: f.total ? f.total + " filler word" + (f.total === 1 ? "" : "s") : "no fillers" }
    ];

    var notes = [];
    /* Nothing captured is a setup failure, not a performance. Scoring the
       parts that happen to survive an empty transcript would hand out marks
       for silence, so the take is zero and the note says why. */
    if (!got.length) {
      notes.push({ k: "bad", t: "Nothing was captured", w: "The microphone heard no words. Check the level bar moves while you speak, and that the tab has microphone permission." });
      return {
        kind: "read", score: 0, band: "rough", parts: parts, notes: notes,
        ops: ops, said: "", wpm: 0, secs: Math.round(take.ms / 1000),
        words: 0, fillers: f
      };
    }

    var total = blend(parts);
    {
      if (clean >= 92) notes.push({ k: "good", t: "Read cleanly", w: "Word-for-word accuracy above ninety per cent. This line is ready — take it faster next time and see whether it holds." });
      else if (clean >= 75) notes.push({ k: "ok", t: "Close", w: "Most of the line landed. The words highlighted below are where it slipped — say those three or four on their own before running the whole line again." });
      else notes.push({ k: "bad", t: "Slow this one right down", w: "Under three quarters matched. Read it aloud once at half speed with the text in front of you, then record again. Speed is the last thing to add, never the first." });

      var missed = ops.filter(function (o) { return o.op === "miss"; }).map(function (o) { return o.want; });
      if (missed.length > 2) {
        notes.push({ k: "bad", t: "Words that vanished", w: "**" + missed.slice(0, 6).join(", ") + "** were not heard at all. Swallowed word endings are the usual cause — the final consonant is where clarity is won." });
      }
      var wrong = ops.filter(function (o) { return o.op === "sub"; });
      if (wrong.length) {
        notes.push({
          k: "ok", t: "Heard as something else",
          w: wrong.slice(0, 4).map(function (o) { return "**" + o.want + "** came out as *" + o.got + "*"; }).join("; ") + ". That is a pronunciation gap, not a reading gap — drill those words on their own."
        });
      }
      if (p.band === "rushed") notes.push({ k: "bad", t: "Too fast to follow", w: p.wpm + " wpm. Rushing is nerves, not fluency; a listener stops parsing above about 190. Put a real breath at every full stop." });
      if (p.band === "slow" && got.length > 12) notes.push({ k: "ok", t: "Very deliberate", w: p.wpm + " wpm reads as unsure even when every word is right. Aim for 120–150." });
      if (f.total >= 3) notes.push({ k: "ok", t: "Fillers crept in", w: "You said " + f.hits.slice(0, 3).map(function (h) { return "*" + h.w + "* ×" + h.n; }).join(", ") + ". In a scripted line there is no thinking to cover — a silent pause is always better." });
    }

    return {
      kind: "read", score: total, band: band(total), parts: parts, notes: notes,
      ops: ops, said: take.text, wpm: p.wpm, secs: Math.round(take.ms / 1000),
      words: got.length, fillers: f
    };
  };

  /* prompt — no script, so this measures whether you covered the ground and
     sounded like someone worth listening to while you did. */
  S.scorePrompt = function (act, take) {
    var got = S.words(take.text);
    var secs = take.ms / 1000;
    var target = act.secs || 45;

    var cov = coverage(act.expect, got);
    var av = avoided(act.avoid, got);
    var p = pace(got.length, take.ms);
    var f = fillers(got);
    var v = variety(got);
    var g = gaps(take.stamps, take.ms);

    /* Length is judged against the brief, not against an absolute. Going
       well over is penalised more gently than stopping early, because the
       failure mode this course cares about is drying up after fifteen
       seconds. */
    var ratio = target ? secs / target : 1;
    var lenPts = ratio >= 0.8 && ratio <= 1.45 ? 100
      : ratio >= 0.6 ? 84 : ratio >= 0.4 ? 66 : ratio > 1.9 ? 74 : 46;

    var fRate = got.length ? (f.weight / got.length) * 100 : 0;   /* per 100 words */
    var fPts = fRate <= 1.2 ? 100 : fRate <= 2.5 ? 86 : fRate <= 4.5 ? 70 : fRate <= 7 ? 54 : 40;

    var parts = [
      { k: "Content", v: act.expect && act.expect.length ? cov.pts : null, w: 0.34, d: act.expect && act.expect.length ? cov.hit.length + " of " + act.expect.length + " points covered" : "open answer — not scored" },
      { k: "Fluency", v: p.pts == null ? null : pct((p.pts + g.pts) / 2), w: 0.22, d: p.wpm ? p.wpm + " wpm, " + g.long + " long pause" + (g.long === 1 ? "" : "s") : "too short to measure" },
      { k: "Clarity", v: pct((fPts + av.pts) / 2), w: 0.24, d: f.total + " filler" + (f.total === 1 ? "" : "s") + " in " + got.length + " words" },
      { k: "Range", v: got.length >= 25 ? v.pts : null, w: 0.10, d: got.length >= 25 ? Math.round(v.ratio * 100) + "% distinct words" : "too short to measure" },
      { k: "Length", v: lenPts, w: 0.10, d: Math.round(secs) + "s against a " + target + "s brief" }
    ];
    var total = blend(parts);

    var notes = [];
    if (!got.length) {
      notes.push({ k: "bad", t: "Nothing was captured", w: "No words reached the recogniser. Check the level bar moves while you speak, and that this tab has microphone permission." });
      return { kind: "prompt", score: 0, band: "rough", parts: parts, notes: notes, said: "", wpm: 0, secs: Math.round(secs), words: 0, fillers: f, coverage: cov };
    }

    if (cov.missed.length && act.expect && act.expect.length) {
      notes.push({
        k: cov.pts >= 70 ? "ok" : "bad",
        t: cov.pts >= 70 ? "Nearly all the ground covered" : "Points you did not reach",
        w: "You did not mention: **" + cov.missed.join("**, **") + "**. Run it again and hit those explicitly — an answer is judged on what the listener heard, never on what you meant."
      });
    } else if (act.expect && act.expect.length) {
      notes.push({ k: "good", t: "Every point covered", w: "You touched all " + act.expect.length + " things the brief asked for. That is the hard half of this activity." });
    }

    if (secs < target * 0.6) {
      notes.push({ k: "bad", t: "You stopped early", w: "You spoke for " + Math.round(secs) + " seconds against a " + target + "-second brief. Running out is almost always structure, not vocabulary: state the point, give one example, say what it led to. That shape fills a minute on its own." });
    } else if (secs > target * 1.9) {
      notes.push({ k: "ok", t: "You went long", w: Math.round(secs) + " seconds for a " + target + "-second answer. In an interview the second minute is where a good answer starts losing. Land the point and stop." });
    }

    if (fRate > 2.5) {
      notes.push({
        k: fRate > 4.5 ? "bad" : "ok", t: "Filler is carrying your pauses",
        w: "Most used: " + f.hits.slice(0, 3).map(function (h) { return "*" + h.w + "* ×" + h.n; }).join(", ") +
          ". The fix is not to speak faster — it is to let the pause be silent. A silent half-second reads as thinking; *um* reads as searching."
      });
    }

    Object.keys(HEDGE).forEach(function (w) {
      var n = count(got, w);
      if (n >= 2) notes.push({ k: "ok", t: "You said *" + w + "* " + n + " times", w: HEDGE[w] });
    });

    if (av.used.length) {
      notes.push({ k: "bad", t: "Phrases this activity asked you to avoid", w: "You used **" + av.used.join("**, **") + "**. That was the whole exercise — the point is to reach for the stronger construction under pressure, not when reminded." });
    }

    if (p.band === "rushed") notes.push({ k: "bad", t: "Too fast", w: p.wpm + " wpm. Above roughly 190 a non-native listener stops keeping up, and it reads as nerves rather than command." });
    if (p.band === "slow") notes.push({ k: "ok", t: "Quite slow", w: p.wpm + " wpm. Deliberate is good; hesitant is not, and from outside they sound identical. Aim for 130–150." });
    if (g.long >= 3) notes.push({ k: "ok", t: g.long + " long pauses", w: "Silences over three seconds. One is thinking. Three is a structure problem — decide your three beats before you start speaking, not during." });
    if (v.pts < 75) notes.push({ k: "ok", t: "The same words are doing all the work", w: "Only " + Math.round(v.ratio * 100) + "% of what you said was distinct. Pick the two words you repeated most and find one alternative for each — that is the whole vocabulary drill." });

    if (total >= 85 && notes.filter(function (n) { return n.k === "bad"; }).length === 0) {
      notes.unshift({ k: "good", t: "This is a strong take", w: "Covered, paced and clean. Do it once more without the brief on screen — that is the version you will actually need." });
    }

    return {
      kind: "prompt", score: total, band: band(total), parts: parts, notes: notes,
      said: take.text, wpm: p.wpm, secs: Math.round(secs), words: got.length,
      fillers: f, coverage: cov, variety: v
    };
  };

  S.score = function (act, take) {
    return act.kind === "prompt" ? S.scorePrompt(act, take) : S.scoreRead(act, take);
  };

})(window.TD);
