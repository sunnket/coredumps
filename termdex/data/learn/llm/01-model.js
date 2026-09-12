/* LLM Engineering — what you are actually calling. */
TD.addLessons("llm", [

{
 t: "What You Are Actually Calling",
 m: "model",
 lvl: "core",
 s: "Tokens, context, sampling and price — the four things every design decision comes back to.",
 goal: [
  "Explain what one API call costs and why, in tokens",
  "Set temperature and top-p deliberately rather than by superstition",
  "Predict latency from the shape of the request"
 ],
 b: [
  { p: "Before any technique, know precisely what happens when you make a call. Almost every design decision in this track — caching, chunking, routing, streaming — descends from these four facts." },

  { h: "The call, annotated" },
  { code: { lang: "python", t: "Every parameter, and what it does to your bill",
    lines: [
     { c: "from anthropic import Anthropic", w: "" },
     { c: "client = Anthropic()", w: "**Reads `ANTHROPIC_API_KEY` from the environment.** Never hardcode a key — the secrets lesson covers why." },
     { c: "", w: "" },
     { c: "resp = client.messages.create(", w: "" },
     { c: "    model='claude-sonnet-4-5',", w: "**The single biggest cost and quality lever there is.** Model choice matters more than anything else on this list." },
     { c: "    max_tokens=1024,", w: "**A ceiling on the output, not a target.** It does not cost you anything unused — but it does reserve capacity, and it is your protection against a runaway generation." },
     { c: "    system='You are a precise technical assistant.',", w: "**The system prompt.** Counted as input tokens on every single request — so its length is a recurring cost, not a one-off.", hi: true },
     { c: "    messages=[{'role': 'user', 'content': 'Explain BM25 in two sentences.'}],", w: "**The full conversation, resent every time.** The API is stateless; there is no server-side memory of your previous turn." },
     { c: "    temperature=0.0,", w: "**0 for anything you will parse.** Covered below." },
     { c: ")", w: "" },
     { c: "", w: "" },
     { c: "resp.usage.input_tokens, resp.usage.output_tokens", w: "**Log both, on every call, from day one.** You cannot control a cost you are not measuring, and retrofitting this is painful.", hi: true }
    ] } },

  { n: "The API is **stateless**. There is no conversation on the server. A twenty-turn chat means resending all twenty turns on turn twenty-one, so a long conversation costs quadratically in total tokens across the session. This single fact drives conversation trimming, summarisation and prompt caching — all of which exist because of it.",
    nt: "The fact that surprises everyone once" },

  { h: "Tokens are the unit of everything" },
  { tbl: { t: "Rough conversions worth memorising",
    h: ["", "English", "Code", "Hindi / Tamil / Bengali"],
    rows: [
     ["Characters per token", "~4", "~3", "**~1**"],
     ["Words per token", "~0.75", "—", "~0.3"],
     ["One A4 page", "~500 tokens", "~700", "**~2,000**"],
     ["A 50-page PDF", "~25,000", "—", "~100,000"]
    ] } },

  { p: "That last column is a first-order constraint for Indian-language products, not a footnote. The same content costs three to five times more in both money and context window. Measure it on your actual content before you price anything." },

  { code: { lang: "python", t: "Cost, computed rather than guessed",
    lines: [
     { c: "IN_PER_M, OUT_PER_M = 3.00, 15.00", w: "Dollars per million tokens. **Output is typically 3–5× input.**", hi: true },
     { c: "", w: "" },
     { c: "def cost(inp, out):", w: "" },
     { c: "    return inp/1e6*IN_PER_M + out/1e6*OUT_PER_M", w: "" },
     { c: "", w: "" },
     { c: "cost(2000, 500)", w: "$0.0135 per request." },
     { c: "cost(2000, 500) * 100_000", w: "**$1,350 for 100,000 requests.** ~₹115,000 a month at moderate volume.", hi: true },
     { c: "", w: "" },
     { c: "cost(500, 500) * 100_000", w: "**$900.** Cutting 1,500 tokens of context saved a third of the bill and probably improved quality." }
    ] } },

  { h: "The context window is a budget you spend" },
  { p: "A 200,000-token context window is not free space. Everything you put in it is paid for on every request, and — more importantly — quality does not stay flat as you fill it." },

  { l: [
   "**Lost in the middle.** Models attend most reliably to the beginning and end of long contexts. Information buried at 60% depth is measurably less likely to be used. Put the most important material first or last, deliberately.",
   "**Distraction.** Irrelevant retrieved chunks actively degrade answers. Ten precise chunks beat fifty mediocre ones — the extra forty are not neutral, they are noise the model must ignore.",
   "**Latency.** Time to first token scales with input length. A 100k-token prompt takes seconds before a word appears.",
   "**Cost.** Linear in tokens, on every single request, forever."
  ] },

  { trap: "*It fits in the context window* is not an argument for putting it there. The single most common mistake in early RAG systems is stuffing fifty retrieved chunks in because the window allows it. Quality goes down, cost goes up, latency goes up. Retrieve broadly, rerank hard, and send few." },

  { h: "Temperature and top-p" },
  { p: "The model produces a probability distribution over the next token. These parameters decide how you pick from it." },

  { code: { lang: "python", t: "What temperature actually does",
    lines: [
     { c: "logits = np.array([3.2, 2.8, 1.1, 0.4])", w: "Raw scores for four candidate tokens." },
     { c: "", w: "" },
     { c: "softmax(logits / 0.1)", w: "**Temperature 0.1 → [0.98, 0.02, 0, 0].** Nearly deterministic.", hi: true },
     { c: "softmax(logits / 1.0)", w: "**Temperature 1.0 → [0.48, 0.32, 0.06, 0.03].** The model's own distribution, untouched." },
     { c: "softmax(logits / 2.0)", w: "**Temperature 2.0 → [0.35, 0.29, 0.12, 0.09].** Flattened. The fourth-best token now has a real chance." }
    ],
    after: "Temperature divides the logits before the softmax. Low sharpens towards the top choice; high flattens towards uniform. It is exactly the mechanism from the deep learning track, exposed as a dial." } },

  { tbl: { t: "Settings by task",
    h: ["Task", "Temperature", "Why"],
    rows: [
     ["**Extraction, classification, JSON**", "**0**", "You want the same answer every time. Non-zero here is a bug, not a feature"],
     ["Factual question answering", "0–0.3", "Determinism, with a little slack"],
     ["Code generation", "0–0.2", "Correctness matters far more than variety"],
     ["Summarisation", "0.3–0.5", "Slight variation reads more naturally"],
     ["Creative writing, brainstorming", "0.7–1.0", "Variety is the point"],
     ["**Generating synthetic training data**", "**0.8–1.0**", "You explicitly want diversity, not the same example repeated"]
    ] } },

  { n: "Temperature 0 is not fully deterministic in practice. Floating-point non-associativity on GPUs, batching effects and provider-side load balancing across model versions all introduce variation. Expect *nearly always identical*, not *guaranteed identical* — and if your tests assume exact string equality on model output, they will fail intermittently and confusingly.",
    nt: "The caveat that breaks brittle tests" },

  { p: "**Top-p** (nucleus sampling) is the other dial: consider only the smallest set of tokens whose probabilities sum to p. `top_p=0.9` ignores the long tail of very unlikely tokens entirely. Adjust temperature *or* top-p, not both — tuning both at once makes the effect of each impossible to reason about." },

  { h: "Latency, and where it comes from" },
  { code: { lang: "python", t: "The two phases",
    lines: [
     { c: "# 1. PREFILL -- process the entire input", w: "" },
     { c: "#    parallel, one pass, scales with input length", w: "**This is time-to-first-token.**", hi: true },
     { c: "", w: "" },
     { c: "# 2. DECODE -- generate output, one token at a time", w: "" },
     { c: "#    sequential, cannot be parallelised", w: "**This is why output length dominates total latency.**", hi: true },
     { c: "", w: "" },
     { c: "# rough model:", w: "" },
     { c: "# total = prefill(input) + output_tokens x per_token_time", w: "" },
     { c: "#       ~ 0.3s + 500 x 0.02s = 10.3s", w: "**Halving the output length halves the wait. Halving the input barely helps.**", hi: true }
    ] } },

  { l: [
   "**Stream, always, for anything user-facing.** First token in 300ms feels instant; ten seconds of silence feels broken. The total time is identical — the perception is not.",
   "**Ask for less output.** *Answer in two sentences* is a latency optimisation as well as a quality one.",
   "**Batch offline work.** Batch APIs are typically around half price for jobs that can wait.",
   "**Prefill is cacheable.** If your system prompt and retrieved context are stable across calls, prompt caching can cut both cost and time-to-first-token substantially."
  ] },

  { code: { lang: "python", t: "Streaming, which you should default to",
    lines: [
     { c: "with client.messages.stream(", w: "" },
     { c: "    model='claude-sonnet-4-5', max_tokens=1024,", w: "" },
     { c: "    messages=[{'role':'user','content': q}]) as stream:", w: "" },
     { c: "    for text in stream.text_stream:", w: "**Tokens arrive as they are generated.**", hi: true },
     { c: "        print(text, end='', flush=True)", w: "" },
     { c: "    final = stream.get_final_message()", w: "**Usage data is on the final message**, so you can still log tokens." }
    ] } },

  { h: "Failures are normal, not exceptional" },
  { tbl: { t: "What you will hit in production",
    h: ["Failure", "Frequency", "Handle with"],
    rows: [
     ["**429 rate limit**", "Constantly at scale", "Exponential backoff with jitter. **Never a tight retry loop** — it makes the outage worse"],
     ["**529 / 503 overloaded**", "Occasionally", "Retry with backoff; fall back to a second provider if it matters"],
     ["**Timeout**", "Regularly on long generations", "Set an explicit timeout, stream, and cap `max_tokens`"],
     ["**Malformed output**", "Regularly", "Validate and retry with the error. The structured output lesson covers this"],
     ["**Content filter refusal**", "Sometimes, sometimes wrongly", "Detect it and route to a human — do not retry the same prompt harder"]
    ] } },

  { tryit: { t: "Measure your own numbers",
    task: "Write a script that calls a model 20 times with the same prompt at temperature 0 and at 1.0. Record input tokens, output tokens, latency and the response text. Report: mean and p95 latency, cost per 1,000 calls, and how many distinct responses each temperature produced.",
    hint: "`time.perf_counter()` around the call, `resp.usage` for tokens, and a `set()` of the response texts to count distinct outputs.",
    sol: { lang: "python", code: "import time, statistics as st\nfrom anthropic import Anthropic\n\nclient = Anthropic()\nPROMPT = 'Name three uses for a paperclip. One line each.'\n\ndef run(temp, n=20):\n    lat, outs, tin, tout = [], set(), 0, 0\n    for _ in range(n):\n        t0 = time.perf_counter()\n        r = client.messages.create(\n            model='claude-sonnet-4-5', max_tokens=200,\n            temperature=temp,\n            messages=[{'role': 'user', 'content': PROMPT}])\n        lat.append(time.perf_counter() - t0)\n        outs.add(r.content[0].text)\n        tin  += r.usage.input_tokens\n        tout += r.usage.output_tokens\n\n    cost1k = (tin/n/1e6*3.0 + tout/n/1e6*15.0) * 1000\n    print(f'temp={temp}  p50={st.median(lat):.2f}s  '\n          f'p95={sorted(lat)[int(.95*n)]:.2f}s  '\n          f'distinct={len(outs)}/{n}  ${cost1k:.2f}/1k calls')\n\nrun(0.0)\nrun(1.0)" },
    w: "Two things usually land. Temperature 0 gives one or two distinct answers out of twenty; temperature 1.0 gives close to twenty. And p95 latency is often two to three times p50 — the tail is much worse than the average, which is exactly why you set timeouts from p95 and never from the mean." } },

  { vocab: ["Large Language Model", "Tokenisation", "Context Window", "Temperature", "Top-p Sampling", "Streaming"] }
 ],
 k: [
  "The API is stateless — you resend the whole conversation every turn, so long chats cost quadratically.",
  "Log input and output tokens on every call from day one; output typically costs 3–5× input.",
  "Context is a budget: irrelevant chunks degrade quality, and models attend least reliably to the middle.",
  "Temperature 0 for anything you parse; adjust temperature or top-p, never both.",
  "Latency is dominated by output length, so stream everything user-facing and ask for less output."
 ],
 r: ["Large Language Model", "Tokenisation", "Context Window", "Temperature", "Top-p Sampling", "Prompt Engineering"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "resp.usage.input_tokens, resp.usage.output_tokens", w: "log these on every call, always" },
   { c: "temperature=0.0", w: "for anything you are going to parse" },
   { c: "inp/1e6*IN_PER_M + out/1e6*OUT_PER_M", w: "the cost of one request" },
   { c: "with client.messages.stream(...) as stream:", w: "stream anything a human is waiting on" },
   { c: "max_tokens=1024", w: "a ceiling that protects you from a runaway generation" }
  ]
 }
}

]);
