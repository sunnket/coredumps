# NodeCraft

A searchable encyclopedia of engineering vocabulary — **1,240 terms** across 19 fields,
each written as a short, honest read: key points, a real-world example, a step-by-step
flow, code where it helps, and a hand-built SVG diagram where a picture explains it
faster than a paragraph.

Field 1 is a **Crash Course in plain English**: 196 everyday words — variable, endpoint,
token, weights, deployment — explained the way you would explain them to a smart friend
who has never written a line of code.

Alongside the dictionary there are **24 case studies** — Knight Capital, Heartbleed,
Log4Shell, the Bezos API mandate, AlexNet, Conway's Law — the incidents, systems and
papers engineers reference in conversation. Each is layered: a thirty-second skim with
*what to actually say*, then the full story underneath. Terms mentioned in the prose
link straight into the dictionary.

No build step, no dependencies, no framework. Plain HTML, CSS and JavaScript.

---

## Run it

```bash
cd termdex
node server.js
```

Then open **http://localhost:8000**

If port 8000 is taken it will try 8001, 8002 and so on, and print the address it settled on.
You can also pass a port: `node server.js 3000`, or use `npm start`.

Python alternative, if you prefer:

```bash
python -m http.server 8000
```

> Serve it over HTTP rather than opening `index.html` directly — the data files are
> loaded as scripts and the `file://` protocol will block them.

---

## What is in it

| Field | Terms | | Field | Terms |
|---|---:|---|---|---:|
| Crash Course — Plain English | 196 | | Maths & Statistics | 56 |
| Programming Languages | 69 | | CS Fundamentals | 89 |
| Databases & SQL | 70 | | Web & Frontend | 64 |
| Machine Learning Core | 89 | | Backend & Architecture | 65 |
| Deep Learning | 74 | | DevOps & Cloud | 57 |
| Generative AI & LLMs | 69 | | OS & Networking | 49 |
| Natural Language Processing | 34 | | Security | 54 |
| Computer Vision | 33 | | Software Engineering Practice | 57 |
| Data Engineering | 46 | | Emerging & Adjacent Tech | 35 |
| MLOps | 34 | | | |

Plus **1,240 real-world examples**, **1,240 step-by-step flows**, **292 diagrams**,
**219 code examples** and **13 curated learning paths** — four of which are crash-course
routes for people starting from zero, with ten further paths declared and shown on the
index as *coming soon*.

On top of the reading material there are **1,217 multiple-choice questions** with worked
solutions across 108 chapters of seventeen tracks, and **14 speaking sessions** that
listen to you through the microphone and mark what they hear. 179 of those questions are
**hardcore** — written around the wrong answer rather than around a harder fact — and
they are collected into a cross-bank gauntlet of their own.

Every entry has: a one-sentence definition, two explanatory paragraphs, four key points,
a real-world example, a step-by-step flow, and links to related terms. Roughly a fifth
carry a diagram, and a tenth carry runnable code.

### Case studies

| Collection | Studies | Covers |
|---|---:|---|
| Failures & Outages | 5 | Knight Capital, S3, Therac-25, Ariane 5, CrowdStrike |
| Breaches & Security | 5 | Heartbleed, Log4Shell, SolarWinds, XZ Utils, Equifax |
| Landmark Systems | 5 | Unix, Git, the Bezos API mandate, MapReduce, Netflix on AWS |
| Papers & Breakthroughs | 5 | Shannon, AlexNet, the Transformer, AlphaGo, ChatGPT |
| Laws, Moments & Lore | 4 | Conway's Law, Brooks's Law, CAP, left-pad |

Spanning 1948 to 2024. Every study carries a one-paragraph summary, three or four
conversation-ready lines, a full body, takeaways, linked dictionary terms and primary
sources.

### Learn Coding

A third content type: full courses that teach the thing rather than define it.
**23 tracks, 376 lessons**, each track opening with a **briefing** — what the thing is,
why it was invented, what it is genuinely good at, where it is the wrong tool, who pays
people to work on it — before a single line of code.

| Track | Modules | Lessons | Covers |
|---|---:|---:|---|
| **Ground Zero** | 5 | 14 | What a program is, files and paths, the terminal, editors, reading an error |
| **Programming Basics** | 9 | 35 | Every idea a language can throw at you, taught once and in no language |
| **Python** | 16 | 53 | Syntax to pandas to what to do when the data outgrows one machine |
| **Git & GitHub** | 6 | 13 | The mental model first, then commits, branches, undo and pull requests |
| **SQL** | 10 | 15 | `SELECT` to window functions and reading a query plan |
| **HTML** | 6 | 7 | Structure, forms, and the semantics that decide who can use your site |
| **CSS** | 8 | 9 | The cascade, the box model, Flexbox and Grid |
| **ML Maths** | 7 | 13 | Vectors, matrices, calculus, probability — to reading depth, not exam depth |
| **Machine Learning** | 10 | 18 | Classical ML, the metrics, the failure modes, and shipping a model |
| **Deep Learning** | 8 | 11 | One neuron to the transformer, in PyTorch |
| **LLM Engineering** | 8 | 10 | Prompting, structured output, RAG, agents, evaluation, cost |
| **Fine-Tuning** | 8 | 10 | **When to adapt a model and when not to**, LoRA and QLoRA, DPO, honest evaluation, serving |
| **Backend & APIs** | 7 | 7 | FastAPI, async, queues, caching — turning a model into a service |
| **Docker & Deploy** | 6 | 6 | Images, Compose, and a URL somebody can open |
| **AWS Cloud** | 11 | 13 | **IAM, S3, Fargate, pgvector, Bedrock, VPC, monitoring and the bill** |
| **DSA** | 8 | 8 | The interview format, practised deliberately as a format |
| **Portfolio & Hunt** | 6 | 6 | Proof, resume, the loop, the offer |
| **MLOps & Pipelines** | 5 | 10 | Tracking, registry, orchestration, serving, monitoring |
| **NLP** | 7 | 22 | Text, vectors, tasks, sequences, generation, extraction, evaluation |
| **System Design** | 6 | 18 | Sizing, data, caching, async, resilience, and worked cases |
| **Professional English** | 10 | 28 | Grammar, vocabulary, everyday writing, **mail and application writing**, meetings, presenting, interviews |
| **Professional Presence** | 7 | 16 | Posture, dress, greetings, meetings, video, the workstation, reliability, boundaries |
| **Aptitude** | 10 | 34 | The timed test that shortlists before anyone reads your resume |

The two most recent tracks are the ones an AI engineering job description asks for and
most courses omit. **AWS Cloud** teaches the roughly fifteen services you will actually
use — including the two that block beginners hardest and that nobody covers honestly,
IAM and VPC networking — and ends with your own service deployed, monitored, budgeted
and reachable at a URL. **Fine-Tuning** teaches the judgement first, because knowing when
*not* to fine-tune is what a senior engineer is paid for, and then does it properly on
hardware you can rent for the price of a meal.

Two things make it different from a syntax reference:

**Every line carries its reason.** Code never appears as a block to copy. Each line sits
beside an explanation of why *that* line exists and what breaks without it, and the
`syn` block takes a single line apart and names each part — so `def greet(name):` stops
being a shape you imitate.

**You type it until it sticks.** Every lesson ends with the lines it just taught. You
copy each one until it is clean *n* times, then write it again from the description
alone with the code hidden. Results feed a Leitner schedule in `localStorage`, and
`#/drill` asks for exactly the lines due today across everything you have learned —
sooner for the ones you fumbled.

Progress, streak and the practice deck are stored per browser, the same way saved terms
already are.

### Mail and application writing

Everyday email lives in the `write` module of Professional English. **Mail and
application writing** is a separate module because these documents fail differently: a
badly formatted email is read anyway, and a badly formatted application is often not —
it is stacked rather than routed, and nobody tells you that is what happened.

Three lessons: the **formal letter** in full block layout, part by part, with the four
salutation and sign-off pairs that are genuinely wrong when mismatched and the rules
for converting a letter into an email; the **job application** — what a cover letter is
actually for, the four-paragraph structure, the cold email, the referral ask and a
follow-up cadence that is persistence rather than a reputation; and **applications to
authority** — leave, permission, correction, complaint and resignation, each reduced to
the one element that decides whether it is granted.

### Professional Presence

A course about everything an engineer is judged on that is not code. Sixteen lessons
across seven modules: how a body is read, dress and grooming, rooms and greetings and
meetings, the workstation and the working day, food and travel and the events, time and
reliability, and people and boundaries.

Two things separate it from an etiquette guide. **Every rule names its cost** — a disc,
a promotion, a client, an evening, a reputation — and where a rule is merely a local
convention rather than a real cost, that is said plainly, because a course that cannot
tell the difference is teaching superstition. And **the postures are drawn**, not
described: fourteen hand-built SVG figures showing the neutral seated position joint by
joint with its angles, the four ways it goes wrong, the laptop trap and the only
arrangement that solves both halves of it, interview seating, the meeting-room map,
the standing plumb line and the handshake, personal-space bands, the gaze triangles,
open against closed, video framing, the dress scale, a formal cover, and the movement
rhythm of one working hour.

Figures are authored as **joint coordinates** rather than as drawings, so a wrong
posture is the same function called with different numbers — which is what keeps the
right and wrong versions honestly comparable instead of caricatured.

### Question bank

**1,217 multiple-choice questions**, chaptered against the modules of the track they
belong to. The chapter list is derived from the track's own modules, so a new module gets
a chapter the moment somebody writes questions for it.

| Bank | Chapters | Questions | of which hardcore |
|---|---:|---:|---:|
| **Aptitude** | 10 | 342 | 38 |
| **Professional English** | 10 | 140 | 40 |
| **System Design** | 6 | 56 | 0 |
| **AWS Cloud** | 11 | 53 | **36** |
| **Fine-Tuning** | 8 | 47 | **36** |
| **Professional Presence** | 6 | 29 | 29 |
| Python, SQL, ML Maths, Machine Learning, Deep Learning, LLM Engineering, Backend, Docker, DSA, MLOps, NLP | — | 50 each | 0 |

The reveal is the point. Answering a question opens the solution underneath it: the
correct option, the one-line reason it is correct, and — for anything with working — the
worked solution step by step. A bank that returns a letter teaches nothing, so no
question ships without an explanation, and the loader refuses to render one that has a
missing or out-of-range answer.

Two modes. **Practice** reveals as you go and is untimed. **Test** locks every solution
until you submit and runs a clock. Chapter scores persist per browser, and anything you
get wrong is banked into a **mistakes set** at `#/quiz/wrong` that you can practise on
its own — get it right there and it leaves the list.

Option order is permuted at load from a hash of the question text. It is stable across
reloads, and it exists because a hand-written bank always drifts towards one answer slot:
before the permutation, B was correct 64% of the time. One consequence worth knowing
when writing questions: two questions that share a stem share a permutation, so stems
have to be distinct — which they should be anyway.

#### The hardcore level

Questions carry a level, and there are four: `core`, `intermediate`, `advanced` and
`hardcore`. The fourth is not simply "advanced, but more so". An advanced question asks
for a harder fact; a **hardcore question is built around its wrong answer** — the
plausible one a reader who half-knows the material reaches for first. Every distractor
is somebody's real mistake, and the explanation names the mistake rather than only
restating the method.

They are collected at **`#/quiz/hardcore`**, shuffled, across every bank — because four
in one chapter and three in another means the trap never actually gets drilled. The set
is derived rather than curated, so marking a question `hardcore` anywhere puts it in the
gauntlet with no second edit. `#/quiz/hardcore/<track>` narrows it to one bank, and
`/test` runs it against a clock.

### Speaking practice

**14 sessions, 58 activities**, and the only part of the product that needs a microphone.
You say the line or answer the question out loud; the page reports what it actually
heard.

Four activity types, scored by different rules:

| Kind | What you do | How it is marked |
|---|---|---|
| `read` | Read a script aloud | Word for word, with a full edit script |
| `repeat` | One short drill line | Accuracy, strictly |
| `shadow` | The browser speaks first, you repeat | Accuracy against the model |
| `prompt` | Answer an open question | Points covered, pace, fillers, length, range |

The engine is in `speech.js` and does three separable things. It **captures** — Web Speech
API for words, Web Audio for a level meter that tells you whether a silent transcript is
the microphone's fault or the recogniser's. It **compares** — both sides are normalised
hard (contractions expanded, digits spelled out, British and American spellings merged)
and then aligned with a real Levenshtein edit script, so a missed word and a wrong word
are told apart instead of both counting as "not matching". And it **judges** — accuracy,
words per minute, weighted filler density, lexical variety, long pauses, and coverage of
the points the activity asked for — then turns those numbers into sentences, because a
number on its own has never changed how anybody speaks.

Three things about it are deliberate:

**The transcript is always editable.** Recognition mishears, especially on accented
English and technical nouns, and a scorer that punishes the recogniser's mistake loses
your trust in one take. Correct it and re-mark.

**It works without a recogniser.** `SpeechRecognition` ships in Chrome, Edge and Safari
and not in Firefox. There, typing what you said is simply the only path, and every other
part of the analysis runs unchanged.

**Nothing is uploaded and no audio is kept.** The browser's own recogniser does the
transcription, the transcript lives in a variable, and the only thing that survives the
page is an integer score.

---

## Keyboard shortcuts

| Key | Action |
|---|---|
| <kbd>/</kbd> or <kbd>Ctrl</kbd>+<kbd>K</kbd> | Open the search palette |
| <kbd>↑</kbd> <kbd>↓</kbd> | Move through results |
| <kbd>Tab</kbd> | Cycle the category filter inside search |
| <kbd>↵</kbd> | Open the selected term |
| <kbd>R</kbd> | Jump to a random term |
| <kbd>H</kbd> / <kbd>A</kbd> | Home / A–Z index |
| <kbd>L</kbd> / <kbd>D</kbd> | Learn Coding / today's drill |
| <kbd>Q</kbd> / <kbd>M</kbd> | Question bank / speaking practice |
| <kbd>S</kbd> | Save or unsave the current term |
| <kbd>J</kbd> / <kbd>K</kbd> | Previous / next term in the same field |
| <kbd>T</kbd> | Toggle light and dark theme |
| <kbd>?</kbd> | Show the shortcuts sheet |
| <kbd>Esc</kbd> | Close any overlay |

---

## Structure

```
termdex/
├── index.html                  page shell — all views render into #view
├── server.js                   zero-dependency static server
├── assets/
│   ├── css/styles.css          design system: tokens, components, both themes
│   ├── favicon.svg
│   └── js/
│       ├── core.js             registry, slugs, storage, escaping
│       ├── icons.js            one consistent SVG icon family
│       ├── diagrams.js         117 hand-built theme-aware SVG diagrams, plus the
│       │                       figure primitives the posture drawings use
│       ├── flow.js             HTML flowcharts + the real-world example block
│       ├── study.js            case-study block renderer + dictionary auto-linking
│       ├── learn.js            lesson block renderer — annotated code, syntax anatomy
│       ├── drill.js            the practice engine: copy → recall → spaced repetition
│       ├── banks.js            registries for the question bank and speaking sessions
│       ├── quiz.js             the question runner: pick → reveal → worked solution
│       ├── speech.js           the speaking engine: capture, align, judge
│       ├── speaking.js         the session runner around it
│       ├── search.js           ranked search: exact → prefix → tag → body → fuzzy
│       └── app.js              hash router, views, palette, keyboard layer
└── data/
    ├── categories.js           19 fields + the learning paths
    ├── 01…18-*.js              the original entries
    ├── 19…22-crash-course-*.js the plain-English crash course
    ├── extras/x01…x22-*.js     the example + flow for every entry, attached by name
    ├── studies/                case studies, grouped into collections
    │   ├── 00-collections.js   collection definitions (name, icon, accent)
    │   └── 01…05-*.js          the studies themselves
    ├── careers/                the role pages: day, skills, ladder, pay, hire, plan
    ├── interviews/             the company hub — registry + topic banks
    │   ├── 00-companies.js     28 companies in 5 groups, and the question registry
    │   ├── 10…18-*.js          DSA, system design, DBMS, OS, networks, OOP, ML, LLM, behavioural
    │   ├── 19-ai-engineer-core.js     model internals, serving economics, retrieval
    │   ├── 20-company-signature.js    the question each company is known for
    │   └── 21-ai-engineer-applied.js  product, coding rounds, design rounds, behavioural
    └── learn/                  the courses
        ├── 00-tracks.js        track definitions: briefing + modules, then the roadmap
        ├── zero/  basics/      before any language, then the concepts
        ├── python/  git/  sql/  html/  css/
        ├── math/  ml/  dl/     the maths, classical ML, then neural networks
        ├── llm/                LLM application engineering
        ├── finetune/           **when to adapt a model, LoRA/QLoRA, DPO, evaluation, serving**
        ├── backend/  docker/   a service, in a container
        ├── cloud/              **AWS — IAM, S3, compute, data, Bedrock, VPC, deploy, ops, IaC**
        ├── mlops/  nlp/  systemdesign/  dsa/  hunt/
        ├── english/  aptitude/ tested rather than built; english/10-mail.js is
        │                       the mail and application module
        ├── conduct/            Professional Presence — posture, dress, rooms,
        │                       the workstation, food, reliability, boundaries
        ├── quiz/               1,217 MCQs, one file per track
        └── speak/              14 speaking sessions, 58 activities
```

### Company interview hub

**28 companies in five groups**, and **189 questions** tagged with the companies that
actually ask them — so a company's count is derived rather than padded, and a B-tree
question is a B-tree question whether Oracle or Snowflake asks it.

| Group | Companies |
|---|---|
| Frontier AI labs | OpenAI, Anthropic, Google DeepMind, Meta AI, NVIDIA |
| Big tech & cloud | Google, Microsoft, Amazon, Apple, Netflix |
| **AI-first product** | **Perplexity, Cohere, Mistral, Hugging Face, Glean, Scale AI, Sarvam AI** |
| Data, systems & robotics | Databricks, Snowflake, Uber, Tesla, Palantir |
| Enterprise, social & global | ByteDance, Adobe, Oracle, Salesforce, Flipkart, TCS |

The **AI Engineer track** at `#/interview/ai-engineer` is a curated cross-company view
fed by an `aiTrack` flag rather than a company tag — **56 questions** covering attention
and KV-cache economics, prefill against decode, continuous batching, speculative
decoding, quantisation, mixture-of-experts, RoPE and long context, distributed training,
scaling laws, ANN index choice, embedding migration, permission-aware RAG, evaluation
without labels, LLM judges, semantic caching, model routing, streaming, agent tool
design and evaluation, context engineering, unit economics, provider failure, privacy,
document AI, online experiments, guardrails, two full design rounds, six coding-round
problems written out in full, and the two behavioural questions specific to this job.

Every question carries a `simple` one-paragraph version, a long answer, three takeaways,
follow-ups, and a `trap` naming the mistake that loses the round.

---

## Adding a term

Open the right file in `data/` and append an entry to the array:

```js
{
  t: "Term Name",                   // required
  a: "Expansion or acronym",        // optional
  d: "One-sentence definition.",    // required — shown in cards and search
  l: "core",                        // core | intermediate | advanced
  g: ["tag", "tag"],                // tags, used by search
  b: ["First paragraph.",           // body — supports **bold** and `code`
      "Second paragraph."],
  k: ["Key point.", "Key point."],  // 3–4 works best
  x: { lang: "python", code: "…" }, // optional code example
  dg: "neural-net",                 // optional diagram key from diagrams.js
  r: ["Related Term", "Another"]    // resolved by name at render time
}
```

Then add its real-world example and flow to the matching `data/extras/x*.js` file,
keyed by the exact term name:

```js
TD.attach("nlp", {
  "Term Name": {
    ex: { h: "A one-line analogy", b: "Two or three concrete sentences." },
    fl: { t: "Optional flow title",
          s: ["a step",
              { s: "a step", n: "a quiet note under it" },
              { q: "a decision?", y: "…when yes", n: "…when no" }] }
  }
});
```

Bodies support `` `code` ``, `**bold**` and `*emphasis*`.

Reload the page. There is no build step. Related terms, learning-path entries and extras
are resolved by name, so they will silently drop if the target does not exist yet —
`TD.missingAttach` lists every one that failed to find its term, learning paths included.

---

## Adding a learning path

Paths live at the bottom of `data/categories.js`. A path is authored as chapters, and
its flat list of entries is derived from them, so the two can never disagree:

```js
TD.definePaths([{
  id: "frontend", name: "Frontend Engineer essentials",
  cat: "web-frontend",     // borrows this category's accent colour
  kind: "role",            // start | core | role — the filter row on the index
  lvl: "Role track", icon: "browser",
  desc: "the one-line promise",
  who:  "the reader it is written for",
  gain: "what they can do at the bottom that they could not at the top",
  course: "html",          // the Learn Coding track covering the same ground in code,
                           // or { soon: "Name" } while that course is unwritten
  parts: [
    { n: "Chapter name", d: "why this chapter exists",
      s: ["Term Title", "Another Term"] }
  ]
}]);
```

Reading time is computed from the entries themselves rather than declared, and a
reader's progress is simply the set of entries they have opened, kept in this browser
under `termdex:seen`.

A path that is planned but not yet written goes in `TD.defineSoonPaths` in the same
file — the same fields minus `parts` — and renders on the index as a *coming soon*
card, so a reader can see the route exists rather than concluding it does not.

---

## Adding a case study

Append an entry to the right file in `data/studies/`:

```js
TD.addStudies("failures", [{
  t: "Study Title",
  s: "A one-line deck",
  y: 2017, when: "28 February 2017",
  g: ["tag", "tag"],
  tldr: "One paragraph: what happened and why it matters.",
  say: ["A line you could say out loud.", "Another."],
  b: [ /* body blocks — see below */ ],
  k: ["What to take from it.", "…"],
  r: ["Deployment", "Rollback"],           // linked, and auto-linked in the prose
  src: [{ t: "Primary source", u: "https://…" }]
}]);
```

The body is an array of **typed blocks**. Each block object carries one recognised key:

| Block | Renders as |
|---|---|
| `{ h: "Heading" }` | section heading (also builds the contents rail) |
| `{ p: "text" }` | paragraph |
| `{ l: ["a", "b"] }` | bullet list |
| `{ tl: [{ t: "09:37", d: "…" }] }` | timeline |
| `{ q: "quote", by: "who" }` | pull quote |
| `{ n: "body", nt: "title" }` | callout |
| `{ x: { lang: "bash", code: "…" } }` | code block |
| `{ dg: "diagram-key" }` | an SVG diagram from `diagrams.js` |

Prose supports `` `code` ``, `**bold**` and `*emphasis*`. Any term listed in `r` is
linked automatically on its first appearance in the prose, outside code spans — so you
get the cross-links by declaring the term once rather than writing markup.

Read time is computed from the body; you do not set it.

## Adding a lesson

Append to the right file in `data/learn/<track>/`, declaring which module it belongs to:

```js
TD.addLessons("python", [{
  t: "Variables and Names",
  m: "basics",                      // module id from 00-tracks.js
  lvl: "core",                      // core | intermediate | advanced
  s: "One-line deck, shown in the syllabus.",
  goal: ["What the reader can do by the end."],
  b: [ /* typed blocks — see below */ ],
  k: ["Remember this much."],
  r: ["Variable", "Scope"],         // dictionary terms, auto-linked in the prose
  drill: { lang: "python", reps: 3, items: [
    { c: 'name = "Aryan"', w: "store the text Aryan under the name `name`",
      hint: "quotes make it text" }
  ] }
}]);
```

Read time is computed from the body; you do not set it.

The body is an array of **typed blocks**, dispatched on key the way a case study is:

| Block | Renders as |
|---|---|
| `{ h: "Heading" }` | section heading (also builds the contents rail) |
| `{ p: "text" }` · `{ l: [...] }` · `{ ol: [...] }` | paragraph, bullets, numbered list |
| `{ code: { lang, file, t, lines: [{ c, w, hi }], out, after } }` | **annotated code — one `w` per line** |
| `{ syn: { t, parts: [{ p, w }], after } }` | **syntax anatomy — numbered parts of one line** |
| `{ term: { t, lines: [{ c, w, out }] } }` | a terminal session |
| `{ vs: { t, lang, bad: {c,w,label}, good: {…} } }` | the wrong way beside the right way |
| `{ trap: "text", tt: "title" }` | the mistake everyone makes |
| `{ ana: "text", at: "title" }` | an analogy |
| `{ tbl: { t, h: [...], rows: [[...]] } }` | a comparison table |
| `{ tryit: { t, task, hint, sol: {lang,code}, w } }` | a challenge with the answer behind a disclosure |
| `{ n:, nt: }` · `{ q:, by: }` · `{ out:, ot: }` · `{ vocab: [...] }` · `{ dg: }` | callout, quote, output box, dictionary chips, diagram |

Two rules the renderer relies on:

- In a `code` block, a line with **no `w`** spans the full width — that is how blank
  lines and bare punctuation stay quiet. Set `hi: true` to highlight the line that
  matters.
- In a `syn` block, joining every `parts[].p` must reproduce the line **exactly**.
  Segments without a `w` are the glue between the numbered ones, so the anatomy can
  never drift out of step with the code it describes.

Drill items are what the reader will type from memory, so `w` should read as an
instruction (*"store the text Aryan under the name `name`"*), not as a description.

## Adding a question

Open the right file in `data/learn/quiz/` and append to the array. The first two
arguments of `TD.addMCQ` are the track and the **module id** — that is what files the
question into a chapter, and it must match a module declared in `00-tracks.js`.

```js
TD.addMCQ("aptitude", "arith", [
  {
    tag: "Percentages",          // sub-topic, shown as a chip
    lvl: "intermediate",         // core | intermediate | advanced | hardcore
    q: "The price of rice rises by 25%. By what percentage must a family cut " +
       "consumption to keep spending unchanged?",
    o: ["25%", "20%", "22.5%", "16.67%"],
    a: 1,                        // index into `o` — the authored order
    x: "Required cut = 25/(100+25) × 100 = **20%**.",
    steps: [                     // optional: the working, line by line
      "Take 100 units of spending: 100 price × 1 quantity.",
      "New price is 125. To spend 100 again, quantity must be 100/125 = 0.8.",
      "That is a drop from 1 to 0.8, a fall of **20%**."
    ],
    note: "The general formula: a rise of R% needs a cut of R/(100+R) × 100."
  }
]);
```

Three rules the loader enforces or the bank depends on:

- **`x` is not optional.** A question without a reason is a scoreboard entry, not a
  lesson. Anything with a missing stem, fewer than two options, or an `a` outside the
  option range is dropped into `TD.quizBad` and never rendered — so one typo costs one
  question rather than a whole chapter.
- **Never name an option by letter** in `x`, `steps` or `note`. Options are permuted at
  load, so "option C" will be wrong for most readers. Quote the option's text instead.
- **`hardcore` is a promise about the distractors**, not about the difficulty of the
  fact. Mark a question hardcore when every wrong option is a mistake somebody actually
  makes, and say in `x` or `note` why the tempting one is tempting — that sentence is
  the reason the level exists, and it is worth reading even by somebody who got it
  right.
- **Set `fix: true`** if the option order genuinely matters — a ranked list, or a
  sequence that only reads correctly in one order. It opts that question out of the
  permutation.

Add the file to `index.html` if it is new. Nothing else needs editing: the chapter, its
count, the score card and the progress roll-up are all derived.

---

## Adding a speaking session

Append to `data/learn/speak/01-sessions.js`. A session is pure data — the scoring rules
live in `speech.js` and never travel with the content.

```js
TD.addSpeakSessions([{
  id: "disagree-safely",
  t: "Disagreeing without damage",
  m: "speak",                    // an english module id
  lvl: "core",
  icon: "chat",
  s: "One-line description for the card.",
  why: "Why this session exists at all.",
  goal: ["What you can do by the end", "…"],
  coach: ["Advice shown before the microphone opens", "…"],
  acts: [
    {
      kind: "repeat",            // read | repeat | shadow | prompt
      t: "The concession",
      brief: "What to do, in one sentence.",
      text: "That is a fair point on cost.",   // required for the scripted kinds
      tip: "Optional nudge shown above the recorder."
    },
    {
      kind: "prompt",
      t: "Put it together, cold",
      brief: "The scenario, and what the answer must contain.",
      secs: 45,                  // the brief's target length
      expect: [                  // pipe-separated alternatives, all acceptable
        "fair point|good point|agree|understand",
        "concern|worry|risk|issue"
      ],
      avoid: ["with respect|with all due respect"]   // costs marks when used
    }
  ]
}]);
```

`expect` uses alternatives because there is never one right word, and marking a synonym
wrong is how a scorer loses a learner's trust in a single take. `avoid` should only list
the phrasings the activity is specifically training away, and the brief tells the reader
they will be penalised — a hidden penalty is just a trap.

---

## Adding a new section later

The case-study layer was built so a third content type does not require touching the
first two. The pattern is:

1. **Register it in `core.js`** — a `defineX` for the groupings and an `addX` for the
   items, mirroring `defineCollections` / `addStudies`.
2. **Add a renderer** in its own file under `assets/js/`, dispatching on block key the
   way `study.js` does. New block types are one entry in that map; unrecognised blocks
   render as nothing rather than throwing, so content can be written ahead of the
   renderer.
3. **Add a route** in `parseHash` and a case in `render()`, plus a view function.
4. **Add the accent colours** — `injectCategoryStyles` emits `--cat` for any grouping,
   so every existing component that reads `--cat` themes itself for free.
5. **Add it to search** with a small index and prepend it in `runPalette`; results carry
   their own `href`, so navigation needs no change.

## Design notes

- **Dark-first, token-driven.** Every colour is a semantic custom property, so light and
  dark stay in lockstep. Each field has its own accent, defined separately per theme so
  contrast holds in both.
- **Accessibility.** Semantic landmarks, a skip link, visible focus rings, keyboard
  operation throughout, `aria-live` on the toast, and `prefers-reduced-motion` honoured.
- **Diagrams are SVG, drawn in code.** They inherit the current theme and the current
  field's accent colour, so they never look pasted in.
- **State lives in the URL.** Every view is a shareable link. Saved terms and theme
  preference use `localStorage`, wrapped so private-mode browsers do not throw.
