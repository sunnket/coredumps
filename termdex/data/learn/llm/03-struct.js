/* LLM Engineering — structured output and tool calling. */
TD.addLessons("llm", [

{
 t: "Making a Probabilistic Component Fit a Typed System",
 m: "struct",
 lvl: "core",
 s: "Schemas, validation and repair — how you put a language model behind an API contract.",
 goal: [
  "Get reliable structured output using schemas rather than parsing prose",
  "Build a validate-and-repair loop that fails safely",
  "Design a schema that reduces errors rather than inviting them"
 ],
 b: [
  { p: "Your service has a typed contract. The model produces text. Bridging that gap reliably is most of what separates a demo from something another team can call, and it is far more mechanical than people expect." },

  { h: "Never parse prose" },
  { vs: { t: "Two ways to get a category out of a model", lang: "python",
    bad: { c: "text = call(f'What category is: {ticket}')\n# 'Based on the content, I would\n#  classify this as a billing issue.'\n\nif 'billing' in text.lower():\n    cat = 'billing'\nelif 'access' in text.lower():\n    cat = 'access'\n# ...", label: "String matching on prose",
      w: "Breaks on *this is not a billing issue*. Breaks when the model answers in a different phrasing. Breaks silently, and the failures look like model quality problems rather than parsing bugs." },
    good: { c: "class Triage(BaseModel):\n    category: Literal['access','billing',\n                      'technical','fraud','other']\n    account_id: str | None\n    priority: Literal['low','normal','urgent']\n\nresult = call_structured(ticket, Triage)\nresult.category  # typed, validated", label: "A schema, validated",
      w: "The category cannot be anything outside the list — validation rejects it. Your editor knows the type. A malformed response raises where you can catch it, rather than producing a plausible wrong value." } } },

  { h: "The three ways to get structure" },
  { tbl: { t: "Ranked by reliability",
    h: ["Method", "How", "Reliability"],
    rows: [
     ["**Native structured output**", "The provider constrains generation to your schema", "**Highest.** Use it when available — it is enforced at the decoding level, not requested"],
     ["**Tool / function calling**", "Define a tool whose arguments are your schema; the model 'calls' it", "**High.** Very well supported, and works across most providers"],
     ["**Prompt and parse**", "Ask for JSON, then parse and validate", "Moderate. **Always needs a repair loop.** The fallback, not the plan"]
    ] } },

  { code: { lang: "python", t: "Tool calling for extraction — the portable approach",
    lines: [
     { c: "from pydantic import BaseModel, Field", w: "" },
     { c: "from typing import Literal", w: "" },
     { c: "", w: "" },
     { c: "class Invoice(BaseModel):", w: "" },
     { c: "    vendor: str = Field(description='Legal name of the issuing company')", w: "**The description is sent to the model.** It is a prompt, not a comment — write it as instructions.", hi: true },
     { c: "    total: float = Field(description='Grand total including tax, numbers only')", w: "" },
     { c: "    currency: Literal['INR','USD','EUR']", w: "**Constrain to a set wherever possible.** A free string invites *Rs*, *rupees*, *INR* and *₹* in the same dataset." },
     { c: "    date: str = Field(description='Invoice date as YYYY-MM-DD')", w: "**State the format explicitly**, or you will get five of them." },
     { c: "    line_items: list[str] = Field(default_factory=list)", w: "" },
     { c: "", w: "" },
     { c: "resp = client.messages.create(", w: "" },
     { c: "    model='claude-sonnet-4-5', max_tokens=2000,", w: "" },
     { c: "    tools=[{'name': 'record_invoice',", w: "" },
     { c: "            'description': 'Record the extracted invoice fields.',", w: "" },
     { c: "            'input_schema': Invoice.model_json_schema()}],", w: "**Pydantic generates the JSON schema for you.** One definition, used for both the model and your validation.", hi: true },
     { c: "    tool_choice={'type': 'tool', 'name': 'record_invoice'},", w: "**Force the tool.** Without this the model may reply in prose instead." },
     { c: "    messages=[{'role':'user','content': document}])", w: "" },
     { c: "", w: "" },
     { c: "invoice = Invoice(**resp.content[0].input)", w: "**Validate.** Pydantic raises if a field is missing or the wrong type — which is exactly what you want." }
    ] } },

  { h: "The repair loop" },
  { p: "Even with tools, output occasionally fails validation. The fix is not to retry the same request and hope; it is to tell the model precisely what was wrong." },

  { code: { lang: "python", t: "Validate, repair, give up",
    lines: [
     { c: "from pydantic import ValidationError", w: "" },
     { c: "", w: "" },
     { c: "def extract(document, schema, max_attempts=3):", w: "" },
     { c: "    messages = [{'role':'user','content': document}]", w: "" },
     { c: "", w: "" },
     { c: "    for attempt in range(max_attempts):", w: "" },
     { c: "        raw = call_with_tool(messages, schema)", w: "" },
     { c: "        try:", w: "" },
     { c: "            return schema(**raw)", w: "**Success path.**" },
     { c: "        except ValidationError as e:", w: "" },
     { c: "            log.warning('attempt %d failed: %s', attempt + 1, e)", w: "**Log every repair.** A rising repair rate is an early warning that a prompt or model change has degraded something.", hi: true },
     { c: "            messages += [", w: "" },
     { c: "              {'role':'assistant','content': json.dumps(raw)},", w: "" },
     { c: "              {'role':'user','content':", w: "" },
     { c: "               f'That failed validation:\\n{e}\\nReturn corrected output.'},", w: "**Hand it the actual error.** Models repair well from specific messages and badly from *try again*.", hi: true },
     { c: "            ]", w: "" },
     { c: "", w: "" },
     { c: "    raise ExtractionFailed(document_id)", w: "**Fail loudly after N attempts.** Never return a half-filled object — a silently empty field propagates into your database and is discovered months later.", hi: true }
    ] } },

  { n: "Track your repair rate as a first-class metric. A healthy extraction pipeline repairs perhaps 1–3% of requests. If it jumps to 15%, something changed — the model version, the prompt, or the shape of the incoming documents — and this number will tell you days before a user complains.",
    nt: "The metric almost nobody tracks" },

  { h: "Schema design that prevents errors" },
  { tbl: { t: "Choices that reduce failure",
    h: ["Instead of", "Use", "Why"],
    rows: [
     ["`category: str`", "`category: Literal['a','b','c']`", "**Constrains generation.** With native structured output, an invalid value is impossible"],
     ["`date: str`", "`date: str` + explicit format in the description", "Otherwise you get five formats in the same table"],
     ["`amount: str`", "`amount: float`", "Forces the model to resolve *₹1,200/-* into a number, rather than you doing it later"],
     ["Deeply nested objects", "**Flat, or two calls**", "Nesting depth correlates strongly with failure rate. Flat schemas are markedly more reliable"],
     ["30 fields at once", "**Two calls of 15**", "Long schemas degrade towards the end. Splitting is cheaper than repairing"],
     ["`notes: str` (required)", "`notes: str | None`", "**Give it a way to say nothing.** A required free-text field is an invitation to invent"]
    ] } },

  { trap: "Every required field with no null option is a hallucination invitation. If an invoice has no PO number and your schema demands a string, the model will produce a plausible one — it has no permitted alternative. Make anything genuinely optional `| None` and say in the description *return null if not present*. This one change removes a whole category of quiet data corruption." },

  { h: "Tools that do real work" },
  { p: "Tool calling is not only for extraction. It is how a model reaches things it cannot do — arithmetic, current data, your database, an action in the world." },

  { code: { lang: "python", t: "A tool the model can actually call",
    lines: [
     { c: "TOOLS = [{", w: "" },
     { c: "  'name': 'search_orders',", w: "**Verb-noun, specific.** `search_orders` beats `get_data` — the name is part of the prompt." },
     { c: "  'description': (", w: "" },
     { c: "     'Search a customer\\'s order history by date range. '", w: "" },
     { c: "     'Use when the user asks about past orders, delivery '", w: "" },
     { c: "     'status, or refunds. Do NOT use for product questions.'", w: "**Say when NOT to use it.** Negative guidance prevents more wrong tool calls than positive guidance does.", hi: true },
     { c: "  ),", w: "" },
     { c: "  'input_schema': {", w: "" },
     { c: "    'type': 'object',", w: "" },
     { c: "    'properties': {", w: "" },
     { c: "      'customer_id': {'type':'string'},", w: "" },
     { c: "      'from_date': {'type':'string','description':'YYYY-MM-DD'},", w: "" },
     { c: "      'to_date':   {'type':'string','description':'YYYY-MM-DD'},", w: "" },
     { c: "    },", w: "" },
     { c: "    'required': ['customer_id'],", w: "**Only genuinely required fields.** Everything else optional keeps the call flexible." },
     { c: "  },", w: "" },
     { c: "}]", w: "" }
    ] } },

  { code: { lang: "python", t: "Executing a tool call, safely",
    lines: [
     { c: "def run_tool(name, args, user_id):", w: "" },
     { c: "    if name not in ALLOWED_TOOLS:", w: "**Whitelist.** Never dispatch on a model-produced name without checking it.", hi: true },
     { c: "        return {'error': 'unknown tool'}", w: "" },
     { c: "", w: "" },
     { c: "    if name == 'search_orders':", w: "" },
     { c: "        args['customer_id'] = user_id", w: "**Override identity from the session, never from the model.** This single line prevents the model being talked into reading someone else's orders.", hi: true },
     { c: "", w: "" },
     { c: "    try:", w: "" },
     { c: "        result = ALLOWED_TOOLS[name](**args)", w: "" },
     { c: "    except Exception as e:", w: "" },
     { c: "        log.exception('tool %s failed', name)", w: "" },
     { c: "        return {'error': str(e)[:200]}", w: "**Return the error to the model** so it can recover — but truncated, and never with internal details like a stack trace or a connection string.", hi: true },
     { c: "", w: "" },
     { c: "    return truncate_result(result, max_tokens=1500)", w: "**Cap tool output.** A query returning 10,000 rows will otherwise consume your entire context in one call." }
    ] } },

  { n: "That `args['customer_id'] = user_id` line is the most important security control in this lesson. The model is not a trusted component — a user can ask it to look up a different account, and a sufficiently persuasive prompt sometimes succeeds. Authorisation belongs in your code, derived from the session, and never in a parameter the model chose.",
    nt: "The line that prevents a data breach" },

  { h: "Multi-turn tool use" },
  { code: { lang: "python", t: "The loop, with the guards that matter",
    lines: [
     { c: "messages = [{'role':'user','content': question}]", w: "" },
     { c: "", w: "" },
     { c: "for step in range(MAX_STEPS):", w: "**A hard cap.** Non-negotiable — without it a confused model loops until your budget is gone.", hi: true },
     { c: "    resp = client.messages.create(model=M, tools=TOOLS, messages=messages)", w: "" },
     { c: "", w: "" },
     { c: "    if resp.stop_reason != 'tool_use':", w: "" },
     { c: "        return resp.content[0].text", w: "**Done — it answered instead of calling a tool.**" },
     { c: "", w: "" },
     { c: "    messages.append({'role':'assistant','content': resp.content})", w: "" },
     { c: "", w: "" },
     { c: "    results = []", w: "" },
     { c: "    for block in resp.content:", w: "" },
     { c: "        if block.type == 'tool_use':", w: "**A model may request several tools in one turn** — handle them all, ideally in parallel." },
     { c: "            results.append({", w: "" },
     { c: "                'type':'tool_result', 'tool_use_id': block.id,", w: "**The id must match**, or the model cannot tell which result belongs to which call." },
     { c: "                'content': json.dumps(run_tool(block.name, block.input, user_id)),", w: "" },
     { c: "            })", w: "" },
     { c: "    messages.append({'role':'user','content': results})", w: "" },
     { c: "", w: "" },
     { c: "raise TooManySteps(question)", w: "**Fail explicitly** rather than returning whatever the last partial state was." }
    ] } },

  { tryit: { t: "Build an extraction pipeline that reports its own health",
    task: "Extract five fields from twenty documents of your choosing. Use a Pydantic schema with at least one Literal and one optional field. Implement the repair loop. Report: success rate on first attempt, repair rate, final failure rate, and which field fails most often.",
    hint: "Count failures per field by catching `ValidationError` and reading `e.errors()` — each entry has a `loc` naming the field.",
    sol: { lang: "python", code: "from collections import Counter\nfrom pydantic import ValidationError\n\nstats = Counter()\nfield_failures = Counter()\n\nfor doc in documents:\n    for attempt in range(3):\n        raw = call_with_tool(doc, Invoice)\n        try:\n            Invoice(**raw)\n            stats['ok_attempt_%d' % (attempt + 1)] += 1\n            break\n        except ValidationError as e:\n            for err in e.errors():\n                field_failures[err['loc'][0]] += 1\n    else:\n        stats['failed'] += 1\n\nprint(stats)\nprint('worst fields:', field_failures.most_common(3))\n\n# typical:\n#   ok_attempt_1: 17, ok_attempt_2: 2, failed: 1\n#   worst fields: [('date', 4), ('total', 2), ('currency', 1)]" },
    w: "The per-field failure count is the actionable output. If `date` fails four times, the fix is a better field description — *the invoice issue date, formatted YYYY-MM-DD; if only a month is shown use the first of that month* — not a better model. Fixing the schema is nearly always cheaper and more effective than upgrading the model, and this table is what tells you which field to fix." } },

  { vocab: ["Structured Output", "Function Calling", "Tool Use"] }
 ],
 k: [
  "Never parse prose — use native structured output or tool calling with a schema.",
  "Field descriptions are prompts sent to the model; write them as instructions.",
  "Repair by handing the model the actual validation error, and fail loudly after N attempts.",
  "Constrain with `Literal`, keep schemas flat, and make optional fields nullable to prevent invention.",
  "Override identity parameters from the session, whitelist tool names, and cap tool output size."
 ],
 r: ["Structured Output", "Function Calling", "Tool Use", "Hallucination", "Prompt Engineering"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "category: Literal['access','billing','other']", w: "constrain a field to a fixed set" },
   { c: "'input_schema': Invoice.model_json_schema()", w: "one Pydantic model, used for the tool and for validation" },
   { c: "tool_choice={'type':'tool','name':'record_invoice'}", w: "force the tool so the model cannot reply in prose" },
   { c: "args['customer_id'] = user_id", w: "authorisation from the session, never from the model" },
   { c: "f'That failed validation:\\n{e}\\nReturn corrected output.'", w: "repair with the specific error, not 'try again'" }
  ]
 }
}

]);
