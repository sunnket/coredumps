/* LLM Engineering — cost, latency and observability. */
TD.addLessons("llm", [

{
 t: "Cost and Latency Engineering",
 m: "ops",
 lvl: "intermediate",
 s: "The work that produces a number in someone's quarterly review.",
 goal: [
  "Find where your tokens and milliseconds actually go",
  "Apply caching, routing and batching in the right order",
  "Cut cost substantially without losing measurable quality"
 ],
 b: [
  { p: "AI features have a per-request cost, which makes them unlike all other software and deeply alarming to finance. An engineer who cuts inference spend by seventy percent without hurting quality has produced a number that appears in someone's quarterly review — and very few people do this work." },

  { h: "Measure before optimising" },
  { code: { lang: "python", t: "The breakdown that tells you where to start",
    lines: [
     { c: "SELECT", w: "" },
     { c: "  feature,", w: "" },
     { c: "  count(*) AS requests,", w: "" },
     { c: "  avg(input_tokens)  AS avg_in,", w: "" },
     { c: "  avg(output_tokens) AS avg_out,", w: "" },
     { c: "  sum(cost_usd) AS total,", w: "" },
     { c: "  sum(cost_usd) / count(*) AS per_request,", w: "" },
     { c: "  percentile_cont(0.95) WITHIN GROUP (ORDER BY cost_usd) AS p95_cost", w: "**The p95 is where the surprises live.** A handful of enormous requests frequently dominate the bill.", hi: true },
     { c: "FROM llm_calls", w: "" },
     { c: "WHERE created_at > now() - interval '7 days'", w: "" },
     { c: "GROUP BY feature ORDER BY total DESC;", w: "" }
    ],
    out: "feature        requests   avg_in  avg_out    total  per_req  p95_cost\ndoc_summary       8,400     28,400     900   $781.2   $0.093   $0.412\nchat_answer     142,000      3,100     280   $412.6   $0.003   $0.009\nclassify        890,000        420      12   $ 51.4   $0.0001  $0.0002",
    after: "Read it: `doc_summary` is 0.8% of requests and 63% of the bill. Optimising `classify` — which handles 85% of traffic — would save almost nothing. Without this table, most teams optimise the high-traffic endpoint because it feels important." } },

  { n: "Cost in AI systems is almost always concentrated. One feature, or one class of oversized request, dominates. Find it before you change anything — the twenty minutes spent on this query routinely saves weeks of misdirected work.",
    nt: "The pattern that holds nearly everywhere" },

  { h: "The levers, in order of return" },
  { tbl: { t: "What each is worth",
    h: ["Lever", "Typical saving", "Quality risk", "Effort"],
    rows: [
     ["**Do not call the model**", "**100%**", "None", "Low. **Always check this first**"],
     ["**Cache identical requests**", "10–40%", "None", "Low"],
     ["**Prompt caching** on a stable prefix", "**Up to 90% of input cost**", "None", "Low"],
     ["**Cut context**", "20–50%", "**Often improves quality**", "Medium"],
     ["**Route to a smaller model**", "**50–90%**", "Real — measure it", "Medium"],
     ["**Shorten output**", "30–60% of output cost, and latency", "Low if done deliberately", "Low"],
     ["**Batch offline work**", "~50%", "None", "Low, where latency allows"],
     ["**Self-host**", "Large at very high volume", "Real operational cost", "High. Rarely right early"]
    ] } },

  { h: "Do not call the model" },
  { code: { lang: "python", t: "The cheapest optimisation there is",
    lines: [
     { c: "def handle(query):", w: "" },
     { c: "    if len(query) < 3:", w: "" },
     { c: "        return ASK_FOR_MORE", w: "**No call.**" },
     { c: "", w: "" },
     { c: "    if q := FAQ_EXACT.get(normalise(query)):", w: "**A lookup table of the twenty commonest questions.** In most support systems this is 20–40% of traffic.", hi: true },
     { c: "        return q", w: "" },
     { c: "", w: "" },
     { c: "    if hit := semantic_cache(query, threshold=0.97):", w: "**Semantic cache**: a previous *near-identical* question. Threshold high — 0.97, not 0.85 — or you will serve wrong answers." },
     { c: "        return hit", w: "" },
     { c: "", w: "" },
     { c: "    if is_out_of_scope(query):", w: "**A cheap classifier.** Declining costs a fraction of answering." },
     { c: "        return POLITE_DECLINE", w: "" },
     { c: "", w: "" },
     { c: "    return llm_answer(query)", w: "**Only what genuinely needs the model reaches here.**" }
    ] } },

  { trap: "A semantic cache with a low threshold is a correctness bug wearing a performance costume. *What is the limit for standard accounts* and *what is the limit for premium accounts* can sit at 0.94 cosine similarity and have different answers. Set the threshold near 0.97, always include filters like tenant and language in the cache key, and log cache hits so you can audit them." },

  { h: "Model routing" },
  { code: { lang: "python", t: "Cheap first, escalate on evidence",
    lines: [
     { c: "def answer(query, context):", w: "" },
     { c: "    complexity = classify_complexity(query)", w: "**A small model or a rule.** Length, question type, whether reasoning is required." },
     { c: "", w: "" },
     { c: "    if complexity == 'simple':", w: "" },
     { c: "        resp = call(SMALL_MODEL, query, context)", w: "**~10-20x cheaper.**", hi: true },
     { c: "        if confident(resp):", w: "**Check before accepting** — self-consistency, a validation rule, or a groundedness check." },
     { c: "            return resp", w: "" },
     { c: "", w: "" },
     { c: "    return call(LARGE_MODEL, query, context)", w: "**Escalate only when needed.**" },
     { c: "", w: "" },
     { c: "# Typical outcome: 70% handled by the small model,", w: "" },
     { c: "# overall cost down 60%, quality within noise.", w: "**Measure both halves.** Routing that saves 60% and loses 8 points of accuracy is not a win.", hi: true }
    ] } },

  { h: "Latency" },
  { code: { lang: "python", t: "Where the time goes, and what to do",
    lines: [
     { c: "# a typical RAG request:", w: "" },
     { c: "#   embed query            40ms", w: "" },
     { c: "#   vector search          25ms", w: "" },
     { c: "#   rerank                180ms   <- often the surprise", w: "**Measure it. Reranking is frequently the largest non-generation cost.**", hi: true },
     { c: "#   prefill (4k tokens)   300ms", w: "" },
     { c: "#   generate 400 tokens  8000ms   <- dominant", w: "**Output length dominates everything else combined.**", hi: true },
     { c: "#   -------------------------------", w: "" },
     { c: "#   total                8545ms", w: "" },
     { c: "", w: "" },
     { c: "# fixes, by size of effect:", w: "" },
     { c: "#   stream               -> 300ms to first token (feels 25x faster)", w: "**The largest perceived improvement available, and it changes nothing real.**", hi: true },
     { c: "#   'answer in 3 sentences' -> 400 to 120 tokens = 5.6s saved" },
     { c: "#   parallel embed + keyword search -> 25ms saved" },
     { c: "#   prompt caching       -> 300ms to 60ms prefill" },
     { c: "#   smaller reranker     -> 180ms to 60ms" }
    ] } },

  { code: { lang: "python", t: "Parallelise what does not depend on itself",
    lines: [
     { c: "import asyncio", w: "" },
     { c: "", w: "" },
     { c: "async def retrieve(query):", w: "" },
     { c: "    vec, kw = await asyncio.gather(", w: "**Both searches at once.** They are independent, so serialising them is pure waste.", hi: true },
     { c: "        vector_search(query),", w: "" },
     { c: "        keyword_search(query),", w: "" },
     { c: "    )", w: "" },
     { c: "    return rrf(vec, kw)", w: "" }
    ] } },

  { h: "Observability" },
  { code: { lang: "python", t: "The record to write for every call",
    lines: [
     { c: "log_llm_call({", w: "" },
     { c: "  'trace_id': trace_id,", w: "**One id across the whole request**, including every model call inside it." },
     { c: "  'feature': 'chat_answer',", w: "**Tag by feature** — this is what makes the cost query above possible.", hi: true },
     { c: "  'model': model_name,", w: "" },
     { c: "  'model_version': resp.model,", w: "**The version the provider actually served.** Providers update models; you want this in your logs when quality shifts." },
     { c: "  'prompt_version': PROMPT_VERSION,", w: "" },
     { c: "  'input_tokens': u.input_tokens,", w: "" },
     { c: "  'output_tokens': u.output_tokens,", w: "" },
     { c: "  'cache_read_tokens': u.cache_read_input_tokens,", w: "**Proves whether caching is working.** Frequently it is not." },
     { c: "  'cost_usd': cost,", w: "" },
     { c: "  'latency_ms': ms,", w: "" },
     { c: "  'ttft_ms': ttft,", w: "**Time to first token** — the number that matters for perceived speed." },
     { c: "  'retrieved_ids': chunk_ids,", w: "**Which chunks were used.** Without this you cannot debug a single bad answer." },
     { c: "  'stop_reason': resp.stop_reason,", w: "**`max_tokens` here means a truncated answer** — a real bug that otherwise looks like poor quality." },
     { c: "  'user_id': user_id, 'session_id': session_id,", w: "" },
     { c: "})", w: "" }
    ] } },

  { p: "Every one of those fields answers a question you will be asked. *Why did this user get a bad answer?* needs the retrieved ids. *Why did the bill go up?* needs the feature tag and token counts. *Did the model change?* needs the version. Retrofitting this is much harder than adding it on day one." },

  { h: "Alert on these" },
  { tbl: { t: "A minimal, non-noisy alert set",
    h: ["Alert", "Threshold", "Means"],
    rows: [
     ["**Daily spend**", "Above 1.5× the 7-day median", "A loop, a leak, or an abusive user"],
     ["**p95 latency**", "Above 1.5× baseline", "Provider degradation or a context that has grown"],
     ["**Error rate**", "Above 2%", "Provider issues or a broken deploy"],
     ["**Repair rate** (validation failures)", "Above 2× baseline", "**A model or prompt change has degraded structure**"],
     ["**Refusal rate**", "Above 2× baseline", "Broken retrieval, or an attack"],
     ["**`stop_reason == max_tokens`**", "Above 1%", "Answers are being truncated mid-sentence"],
     ["**Cache hit rate**", "Below baseline", "Something in the prefix changed and caching silently stopped"]
    ] } },

  { h: "A worked reduction" },
  { code: { lang: "text", t: "The kind of study that belongs in a portfolio",
    lines: [
     { c: "Baseline: $4,180/month, p95 6.2s" },
     { c: "" },
     { c: "1. Prompt caching on the 6k-token system prompt" },
     { c: "     -> $3,050  (-27%),  p95 5.4s" },
     { c: "2. Cut retrieval from 20 chunks to 8 (reranked)" },
     { c: "     -> $2,240  (-46%),  p95 4.6s,  accuracy +2pts", hi: true },
     { c: "3. Exact + semantic cache (31% hit rate)" },
     { c: "     -> $1,550  (-63%),  p95 3.1s" },
     { c: "4. Route simple queries to a small model (68% of traffic)" },
     { c: "     -> $  890  (-79%),  p95 2.4s" },
     { c: "5. Cap output: 'answer in under 150 words'" },
     { c: "     -> $  710  (-83%),  p95 1.8s" },
     { c: "" },
     { c: "Quality on the golden set: 0.847 -> 0.851 (+0.004)", hi: true },
     { c: "Cost per request: $0.028 -> $0.0048" }
    ],
    after: "Note step 2: cutting context *raised* accuracy, because the extra twelve chunks were distraction. Note also the last line — the whole exercise is only defensible because a golden set proved quality held. Without it, this is a story about making things cheaper and possibly worse." } },

  { tryit: { t: "Run the study on your own project",
    task: "Take a project of yours. Log tokens, cost and latency per call. Establish a baseline over 100 requests with a golden-set score. Then apply four optimisations in order, measuring cost, p95 latency and quality after each. Write it up with the table.",
    hint: "Do them one at a time and measure after each. Applied together you will not know which one caused the quality change, and one of them usually does.",
    sol: { lang: "python", code: "import json, statistics as st\n\ndef benchmark(system, golden, n=100):\n    costs, lats, correct = [], [], 0\n    for case in golden[:n]:\n        r = system.answer(case['question'])\n        costs.append(r.cost); lats.append(r.latency)\n        correct += check(r, case)\n    return {\n        'mean_cost': st.mean(costs),\n        'monthly':   st.mean(costs) * MONTHLY_VOLUME,\n        'p95':       sorted(lats)[int(0.95 * len(lats))],\n        'accuracy':  correct / n,\n    }\n\nstages = {\n    'baseline':      base_system,\n    '+prompt cache': with_cache,\n    '+fewer chunks': with_rerank_8,\n    '+result cache': with_semantic_cache,\n    '+routing':      with_router,\n}\n\nfor name, sys_ in stages.items():\n    m = benchmark(sys_, golden)\n    print(f\"{name:<16} ${m['monthly']:>8,.0f}/mo  \"\n          f\"p95 {m['p95']:.1f}s  acc {m['accuracy']:.3f}\")" },
    w: "Almost nobody does this, which is precisely why it is worth doing. It maps directly onto what senior engineers are paid for, it gives you a specific number to say in an interview — *I cut inference cost by 79% with no quality loss, and here is the table* — and it demonstrates that you measure rather than assume. That is the whole hiring signal in one artefact." } },

  { vocab: ["Prompt Caching", "Model Routing", "Observability", "Latency", "Batch Inference"] }
 ],
 k: [
  "Cost is concentrated: find the feature that dominates the bill before optimising anything.",
  "The cheapest call is the one you do not make — lookup tables, caches and scope classifiers first.",
  "Cutting context often improves quality as well as cost; more chunks is not more information.",
  "Stream everything user-facing: it changes nothing real and is the largest perceived speed gain available.",
  "Log feature, model version, tokens, cost, ttft, retrieved ids and stop_reason on every single call."
 ],
 r: ["Prompt Caching", "Observability", "Latency", "Large Language Model", "Context Window", "Retrieval-Augmented Generation"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "percentile_cont(0.95) WITHIN GROUP (ORDER BY cost_usd)", w: "find the expensive tail of requests" },
   { c: "if hit := semantic_cache(query, threshold=0.97):", w: "reuse a near-identical previous answer, carefully" },
   { c: "await asyncio.gather(vector_search(q), keyword_search(q))", w: "run independent retrievals in parallel" },
   { c: "'ttft_ms': ttft", w: "time to first token — the number users actually feel" },
   { c: "'stop_reason': resp.stop_reason", w: "catch answers truncated at max_tokens" }
  ]
 }
}

]);
