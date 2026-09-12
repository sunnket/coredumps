/* Deep Learning — pretraining and scale. */
TD.addLessons("dl", [

{
 t: "How a Pile of Text Becomes an Assistant",
 m: "pretrain",
 lvl: "intermediate",
 s: "Next-token prediction, scaling laws, and the three stages that produce a model you can talk to.",
 goal: [
  "Explain why predicting the next token produces general capability",
  "Describe the three training stages and what each contributes",
  "Read a scaling law and say what it does and does not predict"
 ],
 b: [
  { p: "A base language model has one job: given some text, predict what comes next. It is difficult to believe that this single objective produces something that can write code, summarise a contract and hold a conversation — and the reason it does is worth understanding properly." },

  { h: "Why next-token prediction is not a trivial task" },
  { p: "The objective sounds like autocomplete. Consider what it actually requires:" },

  { l: [
   "*\"The capital of Australia is ___\"* — requires a fact.",
   "*\"2 + 2 × 3 = ___\"* — requires operator precedence.",
   "*\"She picked up the heavy box and ___\"* — requires physical common sense.",
   "*\"def fibonacci(n):\\n    if n <= 1:\\n        return ___\"* — requires understanding the algorithm.",
   "*\"The detective realised the murderer must be ___\"* — requires tracking a narrative across thousands of tokens."
  ] },

  { p: "To minimise loss across trillions of tokens of this, the model has no efficient alternative to internally representing facts, syntax, arithmetic, code semantics and narrative state. Compression forces structure — memorising the internet is not available, so it must find the regularities that generate it." },

  { n: "This is the central bet of the era, and it was not obvious. It was widely expected that next-token prediction would produce a fluent parrot. That it produced something able to do multi-step reasoning is arguably the biggest empirical surprise in the history of the field, and there is still no complete theoretical account of why.",
    nt: "The surprise" },

  { h: "Three stages" },
  { tbl: { t: "From raw text to something you can talk to",
    h: ["Stage", "Data", "Objective", "Cost", "Result"],
    rows: [
     ["**1. Pretraining**", "Trillions of tokens of web, books, code", "Predict the next token", "**Millions of dollars, months**", "A *base model*: knowledgeable, and useless as an assistant"],
     ["**2. Instruction tuning (SFT)**", "10k–1M curated instruction/response pairs", "Same next-token loss, on demonstrations", "Thousands of dollars, days", "Follows instructions. Answers rather than continues"],
     ["**3. Preference tuning (RLHF/DPO)**", "Human comparisons of pairs of responses", "Prefer the response humans preferred", "Expensive — humans are the cost", "Helpful, harmless, honest-*ish*. The tone you recognise"]
    ] } },

  { code: { lang: "text", t: "The same prompt, at each stage",
    lines: [
     { c: "PROMPT: \"How do I reverse a list in Python?\"" },
     { c: "" },
     { c: "BASE MODEL:" },
     { c: "  \"How do I reverse a string in Python? How do I sort a" },
     { c: "   dictionary by value? How do I read a file line by line?\"" },
     { c: "  -> It continued the text. It produced a plausible FAQ page." },
     { c: "     Not wrong. Not an answer.", hi: true },
     { c: "" },
     { c: "AFTER INSTRUCTION TUNING:" },
     { c: "  \"Use lst.reverse() to reverse in place, or lst[::-1]" },
     { c: "   to get a reversed copy.\"" },
     { c: "  -> It answers. This stage is where 'assistant' appears." },
     { c: "" },
     { c: "AFTER PREFERENCE TUNING:" },
     { c: "  \"There are two ways, depending on whether you want to" },
     { c: "   modify the original list:  ...with an example each," },
     { c: "   and a note about reversed() for iteration.\"" },
     { c: "  -> Structured, complete, anticipates the follow-up." }
    ] } },

  { p: "Almost all the *knowledge* comes from stage 1. Stages 2 and 3 add almost no new information — they teach the model which of its existing capabilities to surface and in what form. This is why fine-tuning is good at changing style and format and poor at adding facts, a point the adaptation module returns to." },

  { h: "Scaling laws" },
  { p: "In 2020 and 2022, OpenAI and then DeepMind found that model loss follows a predictable power law in parameters, data and compute. Predictable enough to plan a multi-million-dollar training run before starting it." },

  { code: { lang: "text", t: "Chinchilla, and why it mattered",
    lines: [
     { c: "Kaplan et al. 2020:   scale parameters aggressively" },
     { c: "  -> GPT-3: 175B parameters, 300B tokens" },
     { c: "" },
     { c: "Hoffmann et al. 2022 (Chinchilla): that was wrong." },
     { c: "  Optimal is roughly 20 TOKENS PER PARAMETER.", hi: true },
     { c: "  GPT-3 was badly undertrained for its size." },
     { c: "" },
     { c: "  Chinchilla: 70B parameters, 1.4T tokens" },
     { c: "  -> beat the 175B GPT-3 at less than half the size," },
     { c: "     and far cheaper to run." },
     { c: "" },
     { c: "Since then: models trained FAR past 20:1 on purpose," },
     { c: "  because inference cost dominates over a model's life.", hi: true },
     { c: "  Llama 3 8B saw ~15T tokens -- roughly 1,800:1." }
    ] } },

  { n: "That last shift is an economics lesson, not a modelling one. Chinchilla optimises for *training* cost. If you will serve a model billions of times, a smaller model trained far longer is cheaper overall — you pay once to train and forever to serve. This is why capable 7B and 8B models exist at all, and it is the same reasoning you will apply when choosing a model for your own product.",
    nt: "Why the rule was deliberately broken" },

  { h: "Emergence, and the argument about it" },
  { p: "Some capabilities appear absent below a certain scale and present above it — multi-step arithmetic, following complex instructions, chain-of-thought reasoning. This is called **emergence**, and it is genuinely contested." },
  { l: [
   "**The claim**: capabilities appear discontinuously with scale, so you cannot predict them from small models.",
   "**The counterargument** (Schaeffer et al., 2023): much of the apparent discontinuity is an artefact of the metric. Exact-match scoring is all-or-nothing, so gradual improvement looks like a sudden jump. Measure with a continuous metric and the curve is smooth.",
   "**Where it lands**: partly a measurement artefact, and not entirely. The practical implication is what matters — small-model behaviour does not reliably predict large-model behaviour, so evaluate at the scale you will actually deploy."
  ] },

  { h: "Tokenisation, which explains several oddities" },
  { p: "Models do not see characters. They see tokens — subword chunks produced by an algorithm like byte-pair encoding — and several famous failure modes follow directly." },

  { code: { lang: "python", t: "Where the weirdness comes from",
    lines: [
     { c: "# 'strawberry' tokenises to ['str', 'aw', 'berry']", w: "" },
     { c: "# Asked how many r's it contains, the model cannot", w: "" },
     { c: "# see letters at all -- only three opaque chunks.", w: "**Not a reasoning failure. A representation failure.**", hi: true },
     { c: "", w: "" },
     { c: "# Numbers tokenise inconsistently:", w: "" },
     { c: "#   '1234' might be ['123', '4'] or ['12', '34']", w: "**Which is why arithmetic is unreliable** and why you should hand it to a tool." },
     { c: "", w: "" },
     { c: "# Non-English text uses far more tokens per word", w: "" },
     { c: "# -- Hindi or Tamil can cost 3-5x the tokens of English", w: "**A direct cost and context-window penalty for non-English products.**", hi: true }
    ] } },

  { h: "Where the data comes from, and what that implies" },
  { tbl: { t: "A typical pretraining mixture",
    h: ["Source", "Rough share", "Contributes"],
    rows: [
     ["Filtered web (CommonCrawl)", "60–70%", "Breadth, and most of the noise"],
     ["**Code** (GitHub)", "5–15%", "**Reasoning and structure.** Code improves non-code reasoning measurably — a genuinely surprising finding"],
     ["Books", "5–10%", "Long-range coherence, narrative"],
     ["Wikipedia and reference", "3–5%", "Factual density"],
     ["Academic papers", "2–5%", "Technical vocabulary"],
     ["Curated / synthetic", "growing", "Increasingly important as clean human text runs short"]
    ] } },

  { l: [
   "**The cutoff is real.** A model knows nothing after its training data ends. This is the single strongest argument for retrieval.",
   "**Web text is skewed** towards English, towards the well-documented, and towards whatever was popular online. Every bias in the corpus is a bias in the model.",
   "**Public benchmarks are on the public web.** Assume any public test set has been seen. Your own private evaluation set is worth more than any published score.",
   "**Duplication matters.** Heavily duplicated text gets memorised rather than generalised, which is both a quality problem and a privacy one."
  ] },

  { tryit: { t: "See tokenisation for yourself",
    task: "Install `tiktoken` and tokenise: an English sentence, the same sentence in Hindi, a Python function, a long number, and 'strawberry'. Compare token counts against character counts.",
    hint: "`enc = tiktoken.get_encoding('cl100k_base')`, then `enc.encode(text)` and `[enc.decode([t]) for t in tokens]` to see the individual pieces.",
    sol: { lang: "python", code: "import tiktoken\nenc = tiktoken.get_encoding('cl100k_base')\n\ndef show(label, s):\n    t = enc.encode(s)\n    print(f'{label:<12} {len(s):>4} chars -> {len(t):>4} tokens  '\n          f'({len(s)/len(t):.1f} chars/token)')\n    if len(t) < 12:\n        print('             ', [enc.decode([x]) for x in t])\n\nshow('english',    'The quick brown fox jumps over the lazy dog.')\nshow('hindi',      'तेज़ भूरी लोमड़ी आलसी कुत्ते के ऊपर से कूदती है।')\nshow('code',       'def add(a, b):\\n    return a + b')\nshow('number',     '1234567890')\nshow('strawberry', 'strawberry')" },
    w: "English averages roughly 4 characters per token. Hindi or Tamil often manages barely 1 — so the same sentence costs three to five times more, in both money and context window. If you are building for Indian languages this is a first-order design constraint, not a footnote, and it is worth measuring on your actual content before you price anything." } },

  { vocab: ["Large Language Model", "Pretraining", "Fine-Tuning", "RLHF", "Tokenisation", "Scaling Laws"] }
 ],
 k: [
  "Next-token prediction forces the model to represent facts, syntax, arithmetic and narrative state — compression demands structure.",
  "Pretraining supplies the knowledge; instruction and preference tuning shape how it is surfaced.",
  "Chinchilla found ~20 tokens per parameter is training-optimal; modern models deliberately exceed it because inference cost dominates.",
  "Emergence is partly a metric artefact — evaluate at the scale you will deploy.",
  "Models see tokens, not characters, which explains letter-counting failures, unreliable arithmetic and the cost penalty for non-English text."
 ],
 r: ["Large Language Model", "Pretraining", "Fine-Tuning", "RLHF", "Tokenisation", "Foundation Model", "Emergent Ability"],
 drill: {
  lang: "python",
  reps: 2,
  items: [
   { c: "enc = tiktoken.get_encoding('cl100k_base')", w: "load a tokeniser" },
   { c: "len(enc.encode(text))", w: "count tokens — what you actually pay for" },
   { c: "[enc.decode([t]) for t in tokens]", w: "see the individual chunks the model receives" }
  ]
 }
}

]);
