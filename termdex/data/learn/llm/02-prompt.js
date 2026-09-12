/* LLM Engineering — prompt and context engineering. */
TD.addLessons("llm", [

{
 t: "Prompting as Engineering, Not Incantation",
 m: "prompt",
 lvl: "core",
 s: "The techniques that reliably work, the ones that were superstition, and how to tell them apart.",
 goal: [
  "Structure a prompt so the model has no room to guess wrong",
  "Use few-shot examples where they help and skip them where they do not",
  "Iterate on prompts against an evaluation set instead of against a vibe"
 ],
 b: [
  { p: "Prompt engineering acquired a bad reputation because a lot of what circulated in 2023 was folklore — magic phrases, bribery, threats. What survives is unglamorous and genuinely works: be specific, show the shape of the answer, and measure." },

  { h: "The structure that works" },
  { code: { lang: "text", t: "A production prompt, in order",
    lines: [
     { c: "[ROLE]      You are a support triage assistant for an" },
     { c: "            Indian fintech company.", w: "Sets vocabulary and assumed context. **One line is enough** — elaborate personas are mostly decorative." },
     { c: "" },
     { c: "[TASK]      Classify the ticket into exactly one category" },
     { c: "            and extract the customer's account ID.", w: "**One sentence, unambiguous.** If you cannot state the task in one sentence, split it into two prompts." },
     { c: "" },
     { c: "[CONTEXT]   <retrieved policy documents>", w: "**Reference material goes here**, clearly delimited so the model can tell data from instructions." },
     { c: "" },
     { c: "[RULES]     - If no account ID is present, return null." },
     { c: "            - If the ticket mentions fraud, always" },
     { c: "              set priority to urgent." },
     { c: "            - Never guess a category. Use 'other'.", w: "**Every rule here is a bug you already found.** This section grows over time and that is correct.", hi: true },
     { c: "" },
     { c: "[FORMAT]    Return JSON matching this schema:" },
     { c: "            {\"category\": str, \"account_id\": str|null," },
     { c: "             \"priority\": \"low\"|\"normal\"|\"urgent\"}", w: "**Show the exact shape.** Describing it in prose is much less reliable than showing it." },
     { c: "" },
     { c: "[EXAMPLES]  <2-3 worked examples, including one edge case>", w: "**Include a hard case**, not three easy ones. Easy examples teach nothing the model did not already do." },
     { c: "" },
     { c: "[INPUT]     <the actual ticket>", w: "**Last.** Recency matters, and the thing to act on should be closest to the generation." }
    ] } },

  { n: "Put instructions before the data for short inputs, and repeat the key instruction *after* the data for long ones. With 50,000 tokens of context, an instruction at the top can genuinely be under-weighted by the time the model reaches the end. Restating it in one line at the bottom costs almost nothing and measurably helps.",
    nt: "Ordering, for long contexts" },

  { h: "What actually works" },
  { tbl: { t: "Techniques, ranked by how reliably they help",
    h: ["Technique", "Effect", "Notes"],
    rows: [
     ["**Being specific about the output format**", "**Large**", "The highest-yield single change. Show the schema, do not describe it"],
     ["**Few-shot examples**", "**Large** for format, moderate for reasoning", "2–5 is the sweet spot. **Include edge cases**; more than 5 rarely helps and always costs"],
     ["**Chain of thought** — *think step by step*", "**Large** on multi-step reasoning", "Costs output tokens and latency. Useless on simple extraction"],
     ["**Explicit negative rules**", "Moderate", "*Never guess a category* prevents a specific failure. Add one per bug found"],
     ["**Giving it an out**", "**Moderate to large**", "*If the context does not contain the answer, say so* — the single best anti-hallucination line there is"],
     ["**XML or markdown delimiters**", "Moderate", "Helps the model tell instructions from data. Also helps you read your own prompt"],
     ["**Role prompting**", "Small", "*You are an expert* is largely folklore now. One line for vocabulary is enough"],
     ["**Emotional pressure / bribery**", "**Negligible**", "Briefly effective on 2023 models. Not a technique — do not build on it"]
    ] } },

  { h: "Few-shot, done properly" },
  { vs: { t: "Two sets of examples for the same task", lang: "text",
    bad: { c: "Ticket: \"Can't log in\"\n-> {\"category\": \"access\"}\n\nTicket: \"Payment failed\"\n-> {\"category\": \"billing\"}\n\nTicket: \"App crashes\"\n-> {\"category\": \"technical\"}", label: "Three easy examples",
      w: "Teaches the format, which the schema already did. Every one of these is a case the model would have got right unaided. Roughly 80 tokens spent per request, forever, for almost nothing." },
    good: { c: "Ticket: \"Payment failed but money debited\"\n-> {\"category\": \"billing\", \"priority\": \"urgent\"}\n   (money movement is always urgent)\n\nTicket: \"How do I export my data?\"\n-> {\"category\": \"other\"}\n   (not access -- they can log in fine)\n\nTicket: \"Someone else used my card\"\n-> {\"category\": \"fraud\", \"priority\": \"urgent\"}", label: "Three examples that teach a boundary",
      w: "Each one resolves an ambiguity the model gets wrong without help. The parenthetical reasoning teaches the *rule*, not just the mapping. Same token cost, far more signal." } } },

  { p: "The rule for choosing examples: pick the cases your model currently gets wrong. Examples that reproduce behaviour you already have are pure cost." },

  { h: "Chain of thought, and its cost" },
  { code: { lang: "python", t: "When the extra tokens pay for themselves",
    lines: [
     { c: "# WITHOUT: 'What is the total after 18% GST on Rs 4,200,", w: "" },
     { c: "#           minus a 10% discount applied first?'", w: "" },
     { c: "#   -> 'Rs 4,956' (wrong -- applied GST first)", w: "" },
     { c: "", w: "" },
     { c: "# WITH: '...Think step by step, then give the final answer.'", w: "" },
     { c: "#   -> 'Discount: 4200 x 0.10 = 420. After discount: 3780.", w: "" },
     { c: "#       GST: 3780 x 0.18 = 680.40. Total: Rs 4,460.40'", w: "**Correct.** The intermediate steps gave the model somewhere to do the work.", hi: true },
     { c: "", w: "" },
     { c: "# Cost: ~15 output tokens -> ~120. Eight times more,", w: "" },
     { c: "# and worth it here. Useless on 'extract the invoice date'.", w: "**Use it where there are steps. Not everywhere.**" }
    ] } },

  { l: [
   "**Newer reasoning-focused models do this internally**, so an explicit *think step by step* adds less than it used to. Test rather than assume.",
   "**Ask for the reasoning before the answer, never after.** Reasoning after the answer is post-hoc justification and does not improve correctness.",
   "**Separate the reasoning from the parseable output** — reasoning in one field, the answer in another — so your parser is not fishing through prose."
  ] },

  { h: "The out clause" },
  { code: { lang: "text", t: "One line that removes a large fraction of hallucination",
    lines: [
     { c: "Answer using ONLY the context provided above." },
     { c: "If the context does not contain enough information to" },
     { c: "answer, respond exactly: \"I don't have that information.\"", hi: true },
     { c: "Do not use knowledge from outside the context." }
    ],
    after: "Without a permitted way to fail, the model's training pushes it towards producing *an* answer. Giving it an explicit, easy exit is the cheapest hallucination reduction available — and it is a one-line change that most teams do not make until after their first incident." } },

  { h: "Iterating properly" },
  { p: "The failure mode of prompt engineering is fiddling: change a word, try one input, feel better, ship. That is not iteration, it is superstition with extra steps." },

  { code: { lang: "python", t: "Prompt iteration as an experiment",
    lines: [
     { c: "cases = json.load(open('golden_set.json'))", w: "**50–200 inputs with known-correct outputs.** Build this before you touch the prompt.", hi: true },
     { c: "", w: "" },
     { c: "def score(prompt_version):", w: "" },
     { c: "    hits = 0", w: "" },
     { c: "    for c in cases:", w: "" },
     { c: "        out = call(prompt_version, c['input'])", w: "" },
     { c: "        hits += check(out, c['expected'])", w: "" },
     { c: "    return hits / len(cases)", w: "" },
     { c: "", w: "" },
     { c: "for name, p in PROMPTS.items():", w: "" },
     { c: "    print(f'{name}: {score(p):.3f}')", w: "**Now a change is measured, not felt.**", hi: true }
    ],
    out: "v1_basic:        0.62\nv2_with_schema:  0.79\nv3_plus_rules:   0.84\nv4_few_shot:     0.91\nv5_longer_role:  0.90",
    after: "v5 made the role description more elaborate and scored slightly worse. Without the harness you would have shipped it, because it *reads* better. That is precisely the trap." } },

  { trap: "Do not tune a prompt against the same twenty examples forever. You will overfit to them exactly as a model overfits to training data — the prompt accumulates rules that fix those specific cases and generalise to nothing. Hold out a test set of cases you never look at while iterating, and check it at the end." },

  { h: "Prompts are code" },
  { l: [
   "**Version them in git**, in files, not pasted into a dashboard.",
   "**Template them** — `prompt.format(context=..., question=...)` — and never build them with string concatenation scattered across the codebase.",
   "**Log which version produced which output.** When a user complains about an answer from three weeks ago, you need to know what prompt was live.",
   "**Review them like code.** A prompt change is a behaviour change and deserves the same scrutiny as a code change.",
   "**Keep the golden set in the repository** next to the prompt it tests."
  ] },

  { code: { lang: "python", file: "prompts/triage.py", t: "A prompt as a versioned artefact",
    lines: [
     { c: "TRIAGE_V4 = '''", w: "" },
     { c: "You are a support triage assistant for an Indian fintech.", w: "" },
     { c: "", w: "" },
     { c: "Classify the ticket and extract the account ID.", w: "" },
     { c: "", w: "" },
     { c: "<rules>", w: "**XML tags** — easy for the model to parse, easy for you to read." },
     { c: "- Money movement issues are always priority=urgent.", w: "" },
     { c: "- If no account ID is present, return null. Never invent one.", w: "" },
     { c: "- If unsure of the category, use \"other\".", w: "" },
     { c: "</rules>", w: "" },
     { c: "", w: "" },
     { c: "<ticket>{ticket}</ticket>", w: "**One template variable, clearly delimited.**", hi: true },
     { c: "", w: "" },
     { c: "Return only JSON: {{\"category\": ..., \"account_id\": ..., \"priority\": ...}}", w: "**Doubled braces** escape the literal ones in a Python format string — a small trap worth knowing." },
     { c: "'''", w: "" },
     { c: "", w: "" },
     { c: "PROMPT_VERSION = 'triage_v4'", w: "**Log this with every response.**" }
    ] } },

  { tryit: { t: "Run a real prompt experiment",
    task: "Pick a task with checkable answers — extraction or classification. Build a 30-case golden set by hand. Write four prompt versions: bare, plus schema, plus rules, plus few-shot. Score all four. Then write a fifth that you expect to be better and see whether you were right.",
    hint: "Write the golden set first, before any prompt. If you write it afterwards you will unconsciously build it around what your prompt already does.",
    sol: { lang: "python", code: "PROMPTS = {\n  'v1_bare':   'Classify this support ticket: {t}',\n\n  'v2_schema': 'Classify this support ticket.\\n'\n               'Return JSON: {{\"category\": \"access\"|\"billing\"'\n               '|\"technical\"|\"fraud\"|\"other\"}}\\n\\n{t}',\n\n  'v3_rules':  'Classify this support ticket.\\n'\n               '<rules>\\n'\n               '- Money movement -> billing, unless unauthorised -> fraud\\n'\n               '- Cannot sign in -> access\\n'\n               '- Unsure -> other. Never guess.\\n'\n               '</rules>\\n'\n               'Return JSON: {{\"category\": ...}}\\n\\n{t}',\n\n  'v4_shots':  V3 + EDGE_CASE_EXAMPLES,\n}\n\nfor name, p in PROMPTS.items():\n    print(f'{name:<12} {score(p):.3f}')\n\n# typical result:\n#   v1_bare      0.58\n#   v2_schema    0.81   <- biggest single jump, from the schema\n#   v3_rules     0.87\n#   v4_shots     0.93" },
    w: "The largest jump is almost always adding the output schema, and it is the cheapest change on the list. Most teams reach for few-shot examples first, which costs tokens on every request and delivers less. Measuring reorders your instincts, which is the real value of the harness." } },

  { vocab: ["Prompt Engineering", "Chain-of-Thought Prompting", "Zero-Shot Learning", "Hallucination"] }
 ],
 k: [
  "Structure: role, task, context, rules, format, examples, input — with the input last.",
  "Showing the output schema is the highest-yield single change you can make.",
  "Choose few-shot examples that resolve boundaries the model currently gets wrong, not easy cases.",
  "*If the context does not contain the answer, say so* is the cheapest hallucination reduction available.",
  "Prompts are code: version them, template them, log the version, and score changes against a golden set."
 ],
 r: ["Prompt Engineering", "Chain-of-Thought Prompting", "Hallucination", "Context Window", "System Prompt"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "Return only JSON matching: {\"category\": str, \"id\": str|null}", w: "show the schema, do not describe it" },
   { c: "If the context does not contain the answer, say so.", w: "give the model a permitted way to fail" },
   { c: "<rules>...</rules>", w: "delimit instructions so they are distinguishable from data" },
   { c: "PROMPT_VERSION = 'triage_v4'", w: "log which prompt produced which output" },
   { c: "score(prompt) over a golden set", w: "measure a prompt change instead of feeling it" }
  ]
 }
},

{
 t: "Context Engineering — Spending a Scarce Budget",
 m: "prompt",
 lvl: "intermediate",
 s: "What goes in the window, in what order, and what gets thrown away.",
 goal: [
  "Allocate a context budget across system prompt, history, retrieval and output",
  "Manage a long conversation without unbounded cost growth",
  "Use prompt caching to cut the cost of a stable prefix"
 ],
 b: [
  { p: "Once your system does anything real, the context window stops being spacious and becomes a resource you allocate. Context engineering is that allocation — and it is where the difference between a demo and a product usually lives." },

  { h: "Budget it explicitly" },
  { code: { lang: "python", t: "A written budget, not an accident",
    lines: [
     { c: "BUDGET = {", w: "" },
     { c: "  'system':      800,", w: "**Paid on every request.** Keep it tight; a bloated system prompt is a permanent tax.", hi: true },
     { c: "  'tools':       600,", w: "Tool definitions, if you use them. They are tokens too, and people forget." },
     { c: "  'history':   2_000,", w: "**Trimmed, not unbounded.**" },
     { c: "  'retrieval': 4_000,", w: "The largest slice, and the one to fill with precision rather than volume." },
     { c: "  'question':    200,", w: "" },
     { c: "  'output':    1_000,", w: "Reserved. **Some APIs will error if the input leaves no room for `max_tokens`.**" },
     { c: "}", w: "" },
     { c: "sum(BUDGET.values())", w: "**8,600 tokens.** Now every component has a limit and an owner, and *retrieval got too big* is a measurable statement.", hi: true }
    ] } },

  { n: "Write this down and enforce it in code. Systems without a budget do not stay small — a chunk gets bigger, history grows, someone adds a tool, and six months later your average request is 40,000 tokens and nobody can say which part is responsible.",
    nt: "Why the budget must be in code" },

  { h: "Managing conversation history" },
  { tbl: { t: "Four strategies",
    h: ["Strategy", "How", "Trade-off"],
    rows: [
     ["**Keep everything**", "Send the full history", "Simple. **Cost grows quadratically.** Fine for short sessions only"],
     ["**Sliding window**", "Keep the last N turns", "**The default.** Cheap and predictable. Loses early context, which occasionally matters"],
     ["**Summarise older turns**", "Compress everything beyond the window into a paragraph", "Keeps the thread. Costs an extra call, and summaries lose detail"],
     ["**Retrieve from history**", "Embed past turns, retrieve the relevant ones", "**Best for very long sessions.** Most complex; usually premature"]
    ] } },

  { code: { lang: "python", t: "Sliding window with summarisation, the practical middle",
    lines: [
     { c: "def build_history(msgs, keep=6, budget=2000):", w: "" },
     { c: "    recent = msgs[-keep:]", w: "**Always keep the last few turns verbatim.** Recent context is the most load-bearing." },
     { c: "    older  = msgs[:-keep]", w: "" },
     { c: "", w: "" },
     { c: "    if not older:", w: "" },
     { c: "        return recent", w: "" },
     { c: "", w: "" },
     { c: "    if count_tokens(recent) > budget:", w: "" },
     { c: "        recent = recent[-2:]", w: "**Even the recent window has a ceiling.** One enormous pasted document can blow the whole budget on its own." },
     { c: "", w: "" },
     { c: "    summary = get_or_make_summary(older)", w: "**Cache the summary** keyed on the message ids — do not regenerate it every turn.", hi: true },
     { c: "    return [{'role':'user',", w: "" },
     { c: "             'content': f'<earlier_conversation>{summary}</earlier_conversation>'}] + recent", w: "" }
    ] } },

  { h: "Position matters" },
  { p: "Models attend most reliably to the start and the end of a long context. This is measurable and it should shape your ordering." },

  { code: { lang: "text", t: "The ordering to use",
    lines: [
     { c: "1. System prompt and rules          <- start: high attention" },
     { c: "2. Tool definitions" },
     { c: "3. Stable reference material        <- middle: lowest attention" },
     { c: "4. Conversation summary" },
     { c: "5. Recent conversation turns" },
     { c: "6. RETRIEVED CONTEXT, best chunk LAST", hi: true },
     { c: "7. The user's question              <- end: high attention" },
     { c: "8. Restated key instruction         <- for very long contexts" }
    ],
    after: "Note point 6. If your reranker orders chunks best-first and you paste them in that order, your best chunk lands furthest from the question. Reverse them — best chunk closest to the question — and quality improves for free." } },

  { h: "Prompt caching" },
  { p: "If a large prefix is identical across requests — a system prompt, a policy document, a set of tool definitions — providers can cache the prefill and charge substantially less for it." },

  { code: { lang: "python", t: "Marking a cacheable prefix",
    lines: [
     { c: "resp = client.messages.create(", w: "" },
     { c: "    model='claude-sonnet-4-5', max_tokens=1024,", w: "" },
     { c: "    system=[{", w: "" },
     { c: "        'type': 'text',", w: "" },
     { c: "        'text': LONG_POLICY_DOCUMENT,", w: "**20,000 tokens of stable reference.**" },
     { c: "        'cache_control': {'type': 'ephemeral'},", w: "**Cache everything up to this point.** Subsequent hits cost a small fraction of the normal input price.", hi: true },
     { c: "    }],", w: "" },
     { c: "    messages=[{'role':'user','content': question}],", w: "**The variable part goes after the cache boundary.**" },
     { c: ")", w: "" },
     { c: "resp.usage.cache_read_input_tokens", w: "**Log this** — it tells you whether caching is actually working, and it frequently is not." }
    ] } },

  { trap: "Caching is prefix-based and byte-exact. A timestamp, a session id or a randomly ordered set of retrieved chunks anywhere in the prefix invalidates it completely — and you will not get an error, only a bill. Put everything stable first, everything variable last, and verify with `cache_read_input_tokens` rather than assuming." },

  { h: "What to cut when you are over budget" },
  { ol: [
   "**Retrieved chunks, by reranker score.** Ten good chunks beat thirty mediocre ones, so this cut usually *improves* quality.",
   "**Older conversation turns**, into a summary.",
   "**Few-shot examples.** Once the model is reliable on format, they are pure cost. Test removing them.",
   "**System prompt verbosity.** Most system prompts contain paragraphs of unmeasured aspiration. Cut and score.",
   "**Tool definitions** the current request cannot possibly need. Route first, then define only the relevant tools.",
   "**Never cut the rules that encode past bugs.** Those are the cheapest tokens in the whole prompt."
  ] },

  { code: { lang: "python", t: "A budget you can enforce",
    lines: [
     { c: "def fit_context(chunks, budget):", w: "" },
     { c: "    out, used = [], 0", w: "" },
     { c: "    for c in chunks:", w: "**Assumes chunks are already sorted best-first by the reranker.**" },
     { c: "        n = count_tokens(c.text)", w: "" },
     { c: "        if used + n > budget:", w: "" },
     { c: "            break", w: "**Stop. Do not truncate mid-chunk** — half a document is worse than no document, because it reads complete." },
     { c: "        out.append(c); used += n", w: "" },
     { c: "    return list(reversed(out)), used", w: "**Reversed, so the best chunk sits closest to the question.**", hi: true }
    ] } },

  { tryit: { t: "Find your own quality cliff",
    task: "Take a RAG-style task with a golden set. Run it with 3, 5, 10, 20 and 40 retrieved chunks. Plot accuracy and cost per request against chunk count. Find where accuracy stops improving and where it starts falling.",
    hint: "Most systems peak somewhere between 5 and 15 chunks and then decline. Log tokens per request so you can put cost on the same chart.",
    sol: { lang: "python", code: "results = []\nfor k in [3, 5, 10, 20, 40]:\n    acc, tokens = evaluate_rag(golden_set, top_k=k)\n    cost = tokens / 1e6 * 3.0 * 1000        # $ per 1k requests\n    results.append((k, acc, cost))\n    print(f'k={k:>2}  acc={acc:.3f}  ${cost:.2f}/1k')\n\n# a typical curve:\n#   k= 3  acc=0.71  $1.20/1k\n#   k= 5  acc=0.83  $1.90/1k\n#   k=10  acc=0.88  $3.40/1k   <- best value\n#   k=20  acc=0.87  $6.60/1k   <- more cost, slightly worse\n#   k=40  acc=0.81  $12.90/1k  <- distraction is now hurting" },
    w: "That curve is one of the most useful artefacts you can produce for a RAG system, and almost nobody plots it. It shows a specific k where quality peaks, and that beyond it you are paying more for worse answers. Both halves of that sentence tend to surprise people, and having the chart makes the design decision unarguable." } },

  { vocab: ["Context Window", "Prompt Caching", "Retrieval-Augmented Generation", "Reranking", "Tokenisation"] }
 ],
 k: [
  "Write the context budget down in code, with a limit per component.",
  "Manage history with a sliding window plus a cached summary of older turns.",
  "Models attend best to the start and end — put the best retrieved chunk closest to the question.",
  "Prompt caching is prefix-based and byte-exact; one timestamp in the prefix silently destroys it.",
  "When over budget, cut low-scoring chunks first — it usually improves quality as well as cost."
 ],
 r: ["Context Window", "Prompt Caching", "Retrieval-Augmented Generation", "Reranking", "Prompt Engineering"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "'cache_control': {'type': 'ephemeral'}", w: "mark a stable prefix as cacheable" },
   { c: "resp.usage.cache_read_input_tokens", w: "verify the cache is actually being hit" },
   { c: "return list(reversed(out))", w: "put the best chunk closest to the question" },
   { c: "recent = msgs[-keep:]", w: "a sliding window over conversation history" }
  ]
 }
}

]);
