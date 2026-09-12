# Code Dojo — source and build pipeline

The Code Dojo is a section of **CoreDumps** (`../termdex`), at `#/code`. This
folder is not the product: it is where the problem bank is *authored and
verified* before it is emitted into the app.

Problems are written in Python rather than JSON so that every reference
solution can actually be executed and its assertions checked. Nothing reaches
`termdex/data/code/` that has not run.

## The pipeline

```
tools/probs_*.py            you edit these
        │
        │  python tools/build.py          execs all 117 solutions, evaluates
        │                                 344 assertions, refuses to emit on
        │                                 any failure
        ▼
tools/emit_termdex.py  ──►  termdex/data/code/*.js     ← the app reads these
```

```bash
python tools/build.py --check     # verify only
python tools/emit_termdex.py      # verify, then write the termdex data files
```

`build.py` also rejects duplicate ids, tabs, trailing whitespace, a `freq`
outside 1–5, and any example that is not an (input, output, note) triple.

## Editing the bank

| File | Covers | n |
| --- | --- | --- |
| `tools/probs_a.py` | Arrays, hashing, matrix | 20 |
| `tools/probs_b.py` | Two pointers, sliding window, stack, binary search | 24 |
| `tools/probs_c.py` | Linked lists, trees | 25 |
| `tools/probs_d.py` | Graphs, backtracking, heaps, intervals, tries | 24 |
| `tools/probs_e.py` | DP, bit manipulation, maths, greedy | 24 |

Each entry is a `P(...)` call. The fields that carry weight:

- **`solution`** — the reference. This is what the blueprint traces, so it is
  also the thing the reader's muscle memory ends up holding. Write it the way
  you would want it written in an interview.
- **`tests`** — boolean expressions `eval`'d after the solution is `exec`'d.
  Each must be exactly `True`.
- **`context`** — code the reader is *given* rather than typing (`class
  ListNode`). Shown on the problem page under "Given to you", and executed
  before the solution.
- **`harness`** — helpers the assertions call (`_run_lru()`), executed after
  the solution and shown under the assertions.
- **`freq`** — 1–5, how often it really comes up. Drives the meter and reads
  as the honest signal about what to practise first.
- **`diff`** — `Easy` / `Medium` / `Hard`, mapped on to CoreDumps' own level
  badges (`core` / `advanced` / `hardcore`) by `TD.addKata`.

Common test helpers (`_build_list`, `_to_list`, `_build_tree`,
`_tree_to_list`, `_find`) are injected by `build.py` — use them freely in
`tests` and `harness` without defining them.

## What lives in termdex

| File | Role |
| --- | --- |
| `data/code/*.js` | generated bank — **do not hand-edit** |
| `assets/js/banks.js` | `TD.addKata`, `TD.kataPatterns`, `TD.kataScore` (registry + progress) |
| `assets/js/dojo.js` | `TD.mountDojo` — the editor, blueprint renderer and coach |
| `assets/js/app.js` | `#/code` and `#/code/<id>` routes, both views, `B` shortcut |
| `assets/css/styles.css` | the `dj-*` section, appended at the end |

Progress is stored under `termdex:dojo` through `TD.store`, and a first solve
calls `TD.progress.touchStreak()` — so the dojo feeds the same streak as
lessons and quizzes.

## Tests

```bash
python tools/build.py --check         # 117 solutions executed, 344 assertions
python tools/verify_loops_code.py     # 33 checks — runs the loops lesson examples
python tools/verify_logic_numbers.py  # 30 checks — derives the Logic Vault figures
python tools/verify_speed_code.py     # parses every Python line in Speed Coding
node tools/verify_speed_js.js         # 31 checks — the JavaScript speed cards
node tools/test_termdex.js            # 73 checks — boots the real app, drives #/code
node tools/test_loops.js              # 547 checks — renders the loops module
node tools/test_logic.js              # 874 checks — drives the Loops & Logics section
node tools/test_speed.js              # 714 checks — Speed Coding + the timing layer
node tools/test_runner.js             # 37 checks — the Python runner, offline path
node tools/test_newtracks.js          # 850 checks — generative DL + OS/Networking
node tools/test_journey.js            # 389 checks — Journeys, orphans, empty modules
node tools/test_js.js                 # 483 checks — the JavaScript & TypeScript track
node tools/test_banks.js              # 11,714 checks — every MCQ on the platform
node tools/test_app.js                # 69 checks — the standalone build
node tools/verify_dist.js             # the bundled single file still boots
```

## Question bank coverage

Every track has a bank. Eight had none — including `basics`, where a beginner
spends six weeks, and `hunt`, whose content has to be said out loud under
pressure — and that is the gap `data/learn/quiz/{found,web,prod}-01.js` closes.

`tools/test_banks.js` audits **every MCQ on the platform**, not only the new
ones: an answer index in range, four distinct non-empty options, an explanation
that explains, and no duplicated question stem anywhere. It found four exact
duplicates in `sys-02.js` — a paste that made readers answer the same question
twice in one quiz — which have been removed.

Two of its checks had to be *loosened for the right reason*, and the comments
in the file say so: a length bar written for prose reported 61 correct
aptitude answers as defects, because `n(n+1)/2 = 50 x 51 / 2 = 1275` is a
complete explanation in 34 characters and `47² = ?` is a complete question in
seven. The checks now accept a worked calculation and still reject an empty one.

## Journeys — the curation layer

A top-level section at `#/plan`. The platform had 24 tracks, 400+ lessons and
five practice sections — a library, not a plan. A beginner facing that has no
way to know that an AI engineer needs Python before NumPy before PyTorch, or
that the Dojo should start in week five rather than week one.

```
termdex/data/journeys/*.js     four role-shaped routes
termdex/assets/js/journey.js   TD.viewJourneys / viewJourney / wireJourney
termdex/assets/js/banks.js     TD.defineJourneys, journeyNext, phaseProgress
termdex/assets/js/app.js       resumeBand() on the home page
```

A journey is phases; a phase names weeks, tracks to read, **practice to do
alongside**, and a `proof` — what you should be able to *do* before moving on.
Progress is **derived, never stored**: a phase is complete when its lessons are
marked done, so a journey can be rewritten at any time without invalidating
anyone's history.

Two rules the data follows:

- **Weeks are honest.** They assume 10–12 focused hours and are deliberately
  not the numbers a marketing page would use.
- **A gap is declared, never hidden.** The Full-Stack journey's JavaScript
  phase has no tracks because they are unwritten; it says so in the goal and
  renders a visible note. `test_journey.js` enforces this: a phase resolving to
  no tracks *must* say so in its goal text, or the test fails.

### What the tests guard

`tools/test_journey.js` checks the connections, not just the rendering:

- every track a journey names resolves, or the phase declares itself a gap
- every practice link points at a route that actually renders
- **no track is orphaned from the stage system** (this caught `osnet`, which
  had been added without a stage)
- **no module anywhere is declared and left empty** — an empty module shipped
  once, and this is what stops it recurring

## The Python runner

Real CPython in the page via Pyodide (WebAssembly), so a learner writes their
own approach, runs it, and reads an actual traceback instead of matching a
reference string character by character. **568 runnable blocks across 213
lessons.**

```
termdex/assets/js/runner.js   TD.wireRunners / mountRunner / runPython
```

This is the only part of the app that reaches outside itself, so it is built
under three rules:

1. **Nothing loads until asked.** `index.html` still declares zero external
   scripts. Pyodide (~10 MB) is fetched on the first click of Run and cached by
   the browser thereafter. A reader who only reads never pays for it, and the
   site still works with no network at all.
2. **Failure is a state, not a crash.** Offline, blocked CDN, corporate proxy —
   all normal. The runner says so plainly and the lesson stays fully readable.
   A 45-second timeout bounds the load, because `script.onerror` does *not*
   fire for a black-holed request and a hanging spinner is worse than an error.
3. **The interpreter is shared, the namespace is not.** One instance serves
   every block; each run gets a fresh `globals` dict, so one block cannot leak
   a variable into another and produce a result the reader cannot reproduce.

A Run button is only added to Python blocks that are worth running — a block
ending in an open `:` is a fragment, and offering to execute it would produce
a SyntaxError that teaches nothing except that the button is unreliable.

`tools/test_runner.js` is honest about what it can prove: jsdom cannot download
or execute Pyodide, which makes it exactly the environment of a reader on a
plane or behind a proxy. It asserts the two things that matter — the app is
untouched until someone asks, and the failure is bounded and explained. It
caught the loader hanging forever with no timeout.

## Speed Coding

A top-level section at `#/speed`. The daily drill asks *do you still remember
this?*; Speed Coding asks *can your hands produce it without you thinking?*
Those are different questions with different decks, which is why this is a
section rather than a mode of the drill.

```
termdex/data/speed/*.js       the card bank (9 sets, 114 lines)
termdex/assets/js/speed.js    TD.viewSpeed / viewSpeedSet / viewSpeedSlow / wireSpeed
termdex/assets/js/drill.js    the timing layer the section is built on
termdex/assets/js/banks.js    TD.addSpeedSets, TD.speedRungs
```

The section is a deck chooser and a scoreboard around `TD.mountDrill` — it
re-implements no typing, comparison or scheduling. Its ladder is three rungs,
and the rung is structural rather than decorative: it tells a reader where to
start and what comes next.

| Rung | | Sets |
| --- | --- | --- |
| 1 | Fragments — keywords, punctuation, operators | `keys`, `punct`, `ops` |
| 2 | Lines — one complete statement | `lines`, `shell` |
| 3 | Blocks — indentation included | `blocks`, `aieng`, `llmops`, `interview` |

### The teaching beat

Every card carries a `why` — one or two sentences shown **only after the card
is cleared**, at the moment the reader has just produced the line themselves
and is paying the most attention to what it means. Showing it beforehand would
make the section a reading exercise, which is exactly what it is not.

A card with a note holds the screen and offers a button (focused, so Enter
continues) instead of auto-advancing — a note that vanishes before it is read
teaches nothing. Cards without a note keep the original timed advance.

The notes are the part that makes this more than a typing trainer: `zero_grad`
explains gradient accumulation, `except` explains why a bare one swallows
Ctrl-C, `in` explains why the same syntax is O(1) on a set and O(n) on a list.

`#/speed/slow` is the personalised deck: lines already recalled from memory
that sit at or below the reader's own median rate. Warm-up sets exist so the
section works on day one — a drill-derived deck is empty until lessons have
been cleared.

### The timing rules, and why each exists

- The clock starts on the **first keystroke**, not when the card appears —
  reading the intent is thinking time, and this measures fingers.
- Only a **clean run from memory** is timed. A peeked or mistyped card was not
  really recalled, so timing it would flatter the reader with a number they
  did not earn.
- Anything faster than 120 ms is discarded as a paste.
- Rated in **characters per minute of the target**, so a card's score is
  comparable across attempts.
- The slow deck requires Leitner box 2+ — a barely-known card is a recall
  problem, not a speed one. The median bar is **inclusive**: a strict
  comparison silently drops cards whenever several share a rate, which is
  common when few cards are timed.

`tools/test_speed.js` drives the real engine by typing into the real textarea
and faking `Date.now`, so timing assertions are deterministic. It caught the
speed deck being hidden on the drill's "nothing due" page — which is exactly
when a reader has time for it.

`tools/verify_speed_code.py` parses every Python card: complete statements are
compiled with `ast`, and rung-1 fragments (`if `, `**kwargs`, `[::-1]`) are
tokenised instead, since they are deliberately not statements. A typo here
would become muscle memory for a mistake, which is worse than not practising.

## Loops & Logics (the Logic Vault)

A top-level section at `#/logic`, separate from the Python track: the things
an engineer is expected to *recall* rather than look up. Ten shelves, and the
largest by design is **The AI Engineer's Vault** — tokens and context, RAG and
retrieval, evaluation, agents, and shipping.

```
termdex/data/logic/*.js        the bank (shelves, decks, cards)
termdex/assets/js/logic.js     TD.viewLogic, TD.viewLogicShelf, TD.wireLogic
termdex/assets/js/banks.js     TD.defineLogicShelves / addLogicDeck / logicScore
```

A card is one recallable unit: `recall` (the line worth memorising, hidden by
default), `why`, `use`, `trap`, and optionally `num` and `code`. The recall
line is capped at 200 characters by `test_logic.js` — a paragraph nobody can
hold in their head is not a recall line.

Two guards, on the same split as the loops module:

- `tools/test_logic.js` boots the real app and drives the section — revealing
  a line, marking a card, filtering, navigating. It caught a duplicate
  event-listener bug that made marking a card silently un-mark it.
- `tools/verify_logic_numbers.py` **derives** every figure a card asserts
  (log tables, Little's Law, Bayes, model memory, F1) and compares it against
  the claim. A card with a wrong number is worse than no card, because the
  reader will repeat it.

## The loops module

`termdex/data/learn/python/16-loops.js` is a six-lesson course on iteration,
sitting in the Python track under the `loops` module (declared in
`data/learn/00-tracks.js`). It picks up where the `flow` module stops: the
iterator protocol, the six named loop shapes, two pointers and sliding
windows, the under-taught standard library, the ways loops break silently,
and the four loops that applied AI work is built on.

Two test files guard it, and they check different things:

- `tools/test_loops.js` boots the real app and renders every block through
  the real renderer, so a block whose key is misspelled — and would silently
  vanish from the page — fails here.
- `tools/verify_loops_code.py` **executes** the Python in the lessons and
  compares it against the output each example claims. A lesson that prints
  something other than what it says it prints is the one error a learner
  cannot debug, because they assume the mistake is theirs.

If you edit a lesson's code or its `out:` string, run the Python one.

`test_termdex.js` injects every script `index.html` lists, in order, so it
catches load-order mistakes as well as behaviour. It ends by mounting all 117
problems, typing each full solution in, and asserting the blueprint clears
with zero mismatched characters — a malformed solution string cannot ship
quietly.

The jsdom tests need `jsdom`, installed with `npm install --no-save jsdom`,
which npm placed in the workspace root (`../node_modules`, ~25 MB) because
that is where `package.json` lives. Nothing in either app depends on it.

## The standalone build (optional)

`index.html` + `app.js` + `styles.css` + `dist/` are a self-contained version
of the same trainer, in its own visual identity, kept from before the section
was folded into CoreDumps. It shares no code with `termdex/assets/js/dojo.js`.

If you only want the CoreDumps section, these can go — the bank does not
depend on them:

```
dojo/index.html  dojo/app.js  dojo/styles.css  dojo/problems.js  dojo/dist/
dojo/tools/bundle.py  dojo/tools/test_app.js  dojo/tools/verify_dist.js
```

Keep `tools/probs_*.py`, `tools/build.py` and `tools/emit_termdex.py` — those
are the bank.
