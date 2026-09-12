/* LLM Engineering — agents and tool use. */
TD.addLessons("llm", [

{
 t: "Agents: The Loop, and Where It Breaks",
 m: "agents",
 lvl: "intermediate",
 s: "An honest map of what works today, what does not, and how to build the narrow kind that ships.",
 goal: [
  "Describe the agent loop and every guard it requires",
  "Explain why reliability compounds downward with steps",
  "Design a narrow agent that fails safely"
 ],
 b: [
  { p: "An **agent** is a model in a loop with tools: it decides what to do, does it, observes the result, and decides again. The idea is genuinely powerful and the marketing has run far ahead of what is reliable. This lesson is the engineering." },

  { h: "The loop" },
  { code: { lang: "python", t: "The whole architecture, with the guards",
    lines: [
     { c: "def agent(task, max_steps=10, budget_usd=0.50):", w: "**Two independent limits.** Steps stop a loop; budget stops an expensive one.", hi: true },
     { c: "    messages = [{'role':'user','content': task}]", w: "" },
     { c: "    spent = 0.0", w: "" },
     { c: "", w: "" },
     { c: "    for step in range(max_steps):", w: "" },
     { c: "        resp = call(messages, tools=TOOLS)", w: "**Decide.**" },
     { c: "        spent += cost_of(resp)", w: "" },
     { c: "        if spent > budget_usd:", w: "" },
     { c: "            return give_up('budget exceeded', messages)", w: "**Fail explicitly.** An agent that silently returns partial work is worse than one that stops." },
     { c: "", w: "" },
     { c: "        if resp.stop_reason != 'tool_use':", w: "" },
     { c: "            return resp.text", w: "**It answered — the normal exit.**" },
     { c: "", w: "" },
     { c: "        for call_block in resp.tool_calls:", w: "**Act.**" },
     { c: "            result = run_tool(call_block, user_id)", w: "" },
     { c: "            messages.append(tool_result(call_block.id, result))", w: "**Observe.**" },
     { c: "", w: "" },
     { c: "        if looping(messages):", w: "**Detect repetition.** Agents get stuck calling the same tool with the same arguments — a specific, common and detectable failure.", hi: true },
     { c: "            return give_up('detected loop', messages)", w: "" },
     { c: "", w: "" },
     { c: "    return give_up('max steps reached', messages)", w: "" }
    ] } },

  { h: "Why reliability collapses with length" },
  { code: { lang: "python", t: "The arithmetic nobody wants to do",
    lines: [
     { c: "# Suppose each step is 95% reliable -- optimistic.", w: "" },
     { c: "", w: "" },
     { c: "0.95 ** 3", w: "**0.857.** Three steps: fine." },
     { c: "0.95 ** 5", w: "**0.774.** Five steps: one run in four fails." },
     { c: "0.95 ** 10", w: "**0.599.** Ten steps: a coin flip.", hi: true },
     { c: "0.95 ** 20", w: "**0.358.** Twenty steps: mostly broken.", hi: true }
    ],
    after: "This is the central engineering fact about agents and it is rarely stated plainly. Reliability multiplies. A twenty-step agent needs 99.7% per-step reliability to reach 94% end to end, and nothing in this stack is 99.7% reliable. **Shorter is not a compromise; it is the design.**" } },

  { n: "This arithmetic is also why *narrow and reliable* beats *broad and impressive* in a portfolio and in production. An agent that books a meeting slot correctly 98% of the time is a product. A general assistant that does anything at 60% is a demo, and everyone in the interview has already seen a dozen of them.",
    nt: "The portfolio implication" },

  { h: "What works and what does not" },
  { tbl: { t: "An honest assessment",
    h: ["Pattern", "Reliability", "Verdict"],
    rows: [
     ["**Single tool call**", "**Very high**", "Not really an agent. Ships everywhere, works well"],
     ["**Fixed pipeline** with model steps", "**High**", "**The sweet spot.** You control the sequence; the model handles judgement within each step"],
     ["**2–5 step loop, narrow tools**", "Good", "Achievable. Needs the guards in this lesson"],
     ["**Router → specialist**", "Good", "Classify the request, dispatch to a purpose-built handler. Underrated"],
     ["**Open-ended 10+ step agent**", "**Poor**", "Demos brilliantly, fails in production. Be honest about this in interviews — the honesty reads as experience"],
     ["**Multi-agent debate / teams**", "**Poor to moderate**", "Costs multiply, errors compound, debugging is very hard. Rarely justified over a good pipeline"]
    ] } },

  { trap: "The strongest instinct when an agent fails is to add another agent to check its work. This roughly doubles cost and latency, and the checker is built from the same model with the same blind spots — so it agrees with the mistake. Prefer deterministic validation: a schema, a database lookup, a unit test, an assertion. Code that checks code is more reliable than a model that checks a model." },

  { h: "Prefer a pipeline to a loop" },
  { vs: { t: "Two designs for the same feature", lang: "python",
    bad: { c: "agent(\n  'Handle this support ticket. You can\n   search orders, issue refunds, escalate\n   to a human, and send emails.',\n  tools=ALL_TOOLS,\n  max_steps=15,\n)", label: "The open agent",
      w: "Impressive in a demo. In production it refunds the wrong order, emails the wrong customer, escalates things it should have handled, and every failure is a different one — so you cannot write a test for it or fix it systematically." },
    good: { c: "cat = classify(ticket)          # model\n\nif cat == 'refund':\n    order  = find_order(ticket)  # model + tool\n    amount = extract_amount(ticket)\n    if amount > 5000:\n        return escalate(ticket)  # code decides\n    return issue_refund(order, amount)\n\nif cat == 'question':\n    return rag_answer(ticket)", label: "The pipeline",
      w: "The model does what models are good at — classification and extraction. Control flow is code. Every branch is testable, the refund limit is enforced in Python rather than requested in a prompt, and a failure is reproducible." } } },

  { p: "The general principle: **let the model make judgements, let code make decisions.** Anything with a monetary limit, an authorisation check or an irreversible effect belongs in code, where it can be tested and audited." },

  { h: "The guards, in full" },
  { tbl: { t: "Every one of these is a production incident somebody has already had",
    h: ["Guard", "Prevents"],
    rows: [
     ["**Max steps**", "Infinite loops"],
     ["**Cost budget per run**", "A single request costing ₹5,000 in a loop"],
     ["**Wall-clock timeout**", "A request hanging until the user leaves"],
     ["**Loop detection**", "The same tool, same arguments, repeatedly"],
     ["**Tool whitelist**", "The model naming a function you did not intend to expose"],
     ["**Identity from session**", "Acting on another user's data"],
     ["**Confirmation before irreversible actions**", "Sending an email, moving money, deleting anything"],
     ["**Result size caps**", "One tool call consuming the entire context window"],
     ["**Idempotency keys**", "A retry issuing a second refund"]
    ] } },

  { code: { lang: "python", t: "Loop detection and the human gate",
    lines: [
     { c: "def looping(messages, window=4):", w: "" },
     { c: "    recent = [(m.name, json.dumps(m.input, sort_keys=True))", w: "**Sorted keys**, so argument order does not hide a repeat." },
     { c: "              for m in tool_calls_in(messages)][-window:]", w: "" },
     { c: "    return len(recent) == window and len(set(recent)) == 1", w: "**Four identical calls in a row is a stuck agent, not a thorough one.**", hi: true },
     { c: "", w: "" },
     { c: "IRREVERSIBLE = {'send_email', 'issue_refund', 'delete_record'}", w: "" },
     { c: "", w: "" },
     { c: "def run_tool(block, user_id):", w: "" },
     { c: "    if block.name in IRREVERSIBLE:", w: "" },
     { c: "        return {'status': 'pending_confirmation',", w: "**Do not perform it.** Return a description of the intended action for a human to approve.", hi: true },
     { c: "                'action': describe(block)}", w: "" },
     { c: "    return ALLOWED_TOOLS[block.name](**block.input)", w: "" }
    ] } },

  { h: "Memory" },
  { l: [
   "**Within a run** — the message list is the memory. Trim it with the same budget discipline as any other context.",
   "**Across runs** — write facts to a store and retrieve them. This is RAG over the user's own history, not a special agent capability.",
   "**Be sceptical of automatic memory.** A system that silently writes *the user prefers concise answers* into a permanent store will eventually write something wrong, and nobody will be able to find or correct it.",
   "**Make memory inspectable and editable.** If a user cannot see what the system believes about them, you cannot debug complaints and they cannot correct errors."
  ] },

  { h: "Observability" },
  { code: { lang: "python", t: "What to log — every step, without exception",
    lines: [
     { c: "log.info('agent_step', extra={", w: "" },
     { c: "  'run_id': run_id,", w: "**One id threading the whole run.** Without it you cannot reconstruct anything." },
     { c: "  'step': step,", w: "" },
     { c: "  'tool': block.name,", w: "" },
     { c: "  'args': redact(block.input),", w: "**Redact PII before logging.** Agent logs are unusually rich in personal data." },
     { c: "  'result_tokens': count_tokens(result),", w: "" },
     { c: "  'latency_ms': ms,", w: "" },
     { c: "  'cost_usd': cost,", w: "" },
     { c: "  'cumulative_cost': spent,", w: "**Cumulative, so you can see a run getting expensive as it happens.**", hi: true },
     { c: "})", w: "" }
    ],
    after: "An agent without step-level tracing is undebuggable. When a user reports that it did the wrong thing, the only useful artefact is the full sequence of decisions and observations — and if you did not log it at the time, it is gone." } },

  { h: "Building one that ships" },
  { ol: [
   "**Pick a genuinely narrow task.** *Triage inbound support tickets* rather than *be a support agent*.",
   "**Write the deterministic version first.** If a pipeline solves it, ship the pipeline. Many tasks that look agentic are not.",
   "**Give it the fewest tools that work.** Every extra tool is another wrong choice available.",
   "**Set max_steps low** — three to five — and see what fails. Raise it only with evidence.",
   "**Build the evaluation set before the agent**: twenty tasks with known-correct outcomes.",
   "**Add each guard as you hit its failure**, and keep the test that caught it.",
   "**Instrument every step from the first line of code.** Retrofitting tracing is much harder."
  ] },

  { tryit: { t: "One narrow agent, honestly measured",
    task: "Build an agent for one small task with two or three tools — for example: given a support email, look up the customer's last order and draft a reply. Write 20 test cases. Measure success rate, mean steps, mean cost, and how often each guard fires.",
    hint: "Instrument first. Run the 20 cases, then read every failing trace by hand — the failures cluster, and the cluster tells you which guard or tool description to fix.",
    sol: { lang: "python", code: "from collections import Counter\n\noutcomes, steps, costs, guards = Counter(), [], [], Counter()\n\nfor case in test_cases:\n    trace = agent(case['task'])\n    outcomes[trace.outcome] += 1        # ok / loop / budget / max_steps\n    steps.append(trace.steps)\n    costs.append(trace.cost)\n    if trace.guard_fired:\n        guards[trace.guard_fired] += 1\n\nprint(outcomes)\nprint(f'mean steps {sum(steps)/len(steps):.1f}  '\n      f'mean cost ${sum(costs)/len(costs):.3f}')\nprint('guards fired:', guards)\n\n# a realistic first result:\n#   Counter({'ok': 14, 'wrong_answer': 4, 'loop': 1, 'max_steps': 1})\n#   mean steps 3.8   mean cost $0.021\n#   guards fired: Counter({'loop': 1, 'max_steps': 1})" },
    w: "Seventy percent on the first attempt is a normal and honest starting point. The useful information is in the four wrong answers — read those traces and you will usually find they share a cause, most often an ambiguous tool description that led the model to the wrong tool. Fixing a description is a ten-minute change worth more than any amount of prompt tuning, and being able to describe that debugging process is exactly what a project deep-dive interview is looking for." } },

  { vocab: ["AI Agent", "Tool Use", "Function Calling", "ReAct"] }
 ],
 k: [
  "An agent is decide, act, observe, repeat — with guards on steps, cost, time and repetition.",
  "Reliability multiplies: at 95% per step, ten steps is a coin flip. Shorter is the design, not a compromise.",
  "Prefer a fixed pipeline; let the model make judgements and let code make decisions.",
  "Never let the model choose identity, limits or irreversible actions — those belong in code.",
  "Log every step with a run id, cost and cumulative cost, or the agent is undebuggable."
 ],
 r: ["AI Agent", "Tool Use", "Function Calling", "Retrieval-Augmented Generation"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "for step in range(max_steps):", w: "the hard cap that prevents an infinite loop" },
   { c: "if spent > budget_usd: return give_up(...)", w: "a cost ceiling per run" },
   { c: "len(set(recent)) == 1", w: "loop detection — the same call repeated" },
   { c: "if block.name in IRREVERSIBLE: return pending_confirmation", w: "a human gate before anything irreversible" },
   { c: "log.info('agent_step', extra={'run_id': ..., 'cumulative_cost': ...})", w: "step-level tracing, from the first line of code" }
  ]
 }
}

]);
