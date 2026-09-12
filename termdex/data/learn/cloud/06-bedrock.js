/* AWS for AI Engineers — Bedrock and the AI services. */
TD.addLessons("cloud", [

{
 t: "Bedrock — Models Inside Your Own Account",
 m: "bedrock",
 lvl: "core",
 s: "Invoking models, streaming, Knowledge Bases, Guardrails, batch inference — and when Bedrock is the right choice.",
 goal: [
  "Call a model through Bedrock with the same code shape you would use anywhere",
  "Decide between Bedrock and a provider API for a specific project",
  "Use Knowledge Bases and Guardrails without giving up the control you need later"
 ],
 b: [
  { p: "Bedrock is AWS's front door to hosted models. The models are largely the same ones you can call directly from their providers; what differs is where the request goes, who bills you, and what governance you inherit. That distinction is the whole reason it exists, and it is what an interviewer is asking about when they mention it." },

  { h: "Why it exists" },
  { tbl: { t: "Bedrock against calling the provider directly",
    h: ["", "Bedrock", "Provider API"],
    rows: [
     ["Where the request goes", "**Stays inside AWS**, can stay in your VPC", "Out to the public internet"],
     ["Billing", "On your AWS invoice", "A separate vendor to onboard"],
     ["Access control", "**IAM**, like everything else", "An API key you must manage"],
     ["Audit", "**CloudTrail**, automatically", "Whatever the provider offers"],
     ["Data residency", "Choose the region", "Wherever the provider runs"],
     ["Newest models", "Usually a lag of weeks", "**Day one**"],
     ["Feature parity", "Sometimes behind", "**Complete**"],
     ["Rate limits", "Per-account quotas, raisable", "Provider tiers"]
    ] } },

  { n: "The honest recommendation. **If your company is already an AWS shop, or you need VPC isolation, IAM-based access control, CloudTrail audit or data residency, use Bedrock** — those four things are frequently what makes an AI feature legally shippable at a bank, a hospital or a government contractor. **If you are an individual building a portfolio project and want the newest model on the day it ships, call the provider directly.** Both are defensible; the reason is what matters in an interview.",
    nt: "Which one to choose" },

  { h: "Calling a model" },
  { code: { lang: "python", file: "bedrock_client.py", t: "The Converse API — one shape for every model",
    lines: [
     { c: "import boto3, json", w: "" },
     { c: "", w: "" },
     { c: "brt = boto3.client('bedrock-runtime', region_name='ap-south-1')", w: "**`bedrock-runtime` for inference.** Plain `bedrock` is the control plane — listing models, managing guardrails. Two different clients, and mixing them up is a common first error.", hi: true },
     { c: "", w: "" },
     { c: "resp = brt.converse(", w: "**The Converse API normalises every model behind one request shape.** Before it existed you wrote a different JSON body per provider. Use it.", hi: true },
     { c: "    modelId='anthropic.claude-sonnet-4-20250514-v1:0',", w: "**Pin the exact version.** A floating alias means your behaviour changes on a date somebody else chose." },
     { c: "    messages=[", w: "" },
     { c: "        {'role': 'user',", w: "" },
     { c: "         'content': [{'text': 'Summarise this contract clause: ...'}]}", w: "**Content is a list of blocks**, which is how images and documents are attached." },
     { c: "    ],", w: "" },
     { c: "    system=[{'text': 'You are a contracts analyst. Answer only from the text provided.'}],", w: "**System is a separate parameter**, not a message with role 'system'." },
     { c: "    inferenceConfig={", w: "" },
     { c: "        'maxTokens': 1024,", w: "**Always set it.** An unbounded output is an unbounded bill." },
     { c: "        'temperature': 0,", w: "**Zero for extraction and analysis.**" },
     { c: "    },", w: "" },
     { c: "    guardrailConfig={", w: "" },
     { c: "        'guardrailIdentifier': 'gr-abc123', 'guardrailVersion': '3'", w: "**Guardrails applied by the service**, so they cannot be forgotten by one code path." },
     { c: "    },", w: "" },
     { c: ")", w: "" },
     { c: "", w: "" },
     { c: "text  = resp['output']['message']['content'][0]['text']", w: "" },
     { c: "usage = resp['usage']", w: "**Token counts come back on every call.** Log them; this is your cost data.", hi: true },
     { c: "print(usage['inputTokens'], usage['outputTokens'])", w: "" }
    ] } },

  { code: { lang: "python", file: "streaming.py", t: "Streaming, and counting tokens you actually used",
    lines: [
     { c: "stream = brt.converse_stream(", w: "" },
     { c: "    modelId=MODEL, messages=messages,", w: "" },
     { c: "    inferenceConfig={'maxTokens': 2048},", w: "" },
     { c: ")", w: "" },
     { c: "", w: "" },
     { c: "out_tokens = 0", w: "" },
     { c: "try:", w: "" },
     { c: "    for event in stream['stream']:", w: "" },
     { c: "        if 'contentBlockDelta' in event:", w: "" },
     { c: "            yield event['contentBlockDelta']['delta']['text']", w: "**The tokens, as they arrive.**" },
     { c: "            out_tokens += 1", w: "**Count locally.** If the client disconnects you never see the final usage event — and that request was still billed.", hi: true },
     { c: "        elif 'metadata' in event:", w: "" },
     { c: "            usage = event['metadata']['usage']", w: "**Authoritative counts, in the final event.**" },
     { c: "finally:", w: "" },
     { c: "    record_cost(MODEL, out_tokens)", w: "**Runs on cancellation too.** Without this, abandoned streams vanish from your cost data — and they are disproportionately the requests users hated.", hi: true }
    ] } },

  { h: "Provisioned throughput, and the trap in it" },
  { l: [
   "**On-demand** is the default: pay per token, share capacity with everyone, and occasionally receive a throttling error you must back off from.",
   "**Provisioned throughput** reserves dedicated capacity, billed hourly whether you use it or not, with a **one-month or six-month commitment**.",
   "The break-even is high. Provisioned only wins at sustained, predictable, heavy volume — and committing to six months of capacity for a feature that has not launched is a genuinely expensive mistake somebody makes at most companies.",
   "**Cross-region inference profiles** are the pragmatic middle: route requests across several regions automatically to raise your effective throughput without a commitment. Turn this on before considering provisioned capacity."
  ] },

  { h: "Knowledge Bases — managed RAG" },
  { code: { lang: "text", t: "What it does for you, and what it takes away",
    lines: [
     { c: "  You provide:  an S3 prefix of documents" },
     { c: "                a vector store (OpenSearch Serverless, Aurora, Pinecone)" },
     { c: "                an embedding model choice" },
     { c: "" },
     { c: "  It handles:   parsing (PDF, DOCX, HTML, MD)" },
     { c: "                chunking (fixed, hierarchical, or semantic)" },
     { c: "                embedding and indexing" },
     { c: "                incremental sync when documents change", hi: true },
     { c: "                retrieval + generation with citations" },
     { c: "" },
     { c: "  You give up:  chunking strategy beyond its three presets", hi: true },
     { c: "                custom rerankers and hybrid fusion weights" },
     { c: "                contextual chunk prefixes" },
     { c: "                exact control over what enters the context" },
     { c: "" },
     { c: "  Cost floor:   OpenSearch Serverless has a minimum of ~2 OCUs" },
     { c: "                ~$175/month before you index a single document", hi: true }
    ],
    after: "That cost floor is the detail nobody mentions in the announcement posts. For a portfolio project it makes Knowledge Bases far more expensive than pgvector on a `db.t4g.micro`. For an enterprise with a compliance requirement and no appetite to build an ingestion pipeline, it is excellent value." } },

  { vs: { t: "Managed RAG, or your own",
    lang: "text",
    bad: { label: "Knowledge Bases, when it is wrong", c: "A portfolio project, 200 documents.\n\n  OpenSearch Serverless floor   ~$175/month\n  You cannot show chunking work in an interview\n  \"Why that chunk size?\" -> \"The service chose it\"\n\nYou have paid a lot to remove the exact\ndecisions an interviewer wants to hear about.",
      w: "The convenience costs you both money and the story." },
    good: { label: "Knowledge Bases, when it is right", c: "An enterprise pilot, 6 weeks, compliance-bound.\n\n  Ingestion pipeline you did not build   -> weeks saved\n  IAM + CloudTrail + VPC out of the box  -> approval passed\n  Incremental sync handled               -> no cron to own\n  $175/month against an engineer's time  -> trivial\n\nAnd you can replace it later; the documents\nare still in S3.",
      w: "Buy the pipeline when the constraint is time and governance, not cost." } } },

  { h: "Guardrails" },
  { l: [
   "**Content filters** across hate, insults, sexual content, violence and misconduct, each with a configurable strength — applied to input, output, or both.",
   "**Denied topics**, defined in natural language: *\"do not give investment advice\"*.",
   "**Word filters and PII redaction**, including Indian identifiers, with either blocking or masking.",
   "**Contextual grounding checks** — the useful one for RAG. It scores whether the answer is supported by the retrieved passages and whether it is relevant to the question, and blocks below a threshold. That is hallucination detection as a service call.",
   "**They apply at the service**, so a code path that forgets them does not exist. That is the real argument for them over a library.",
   "**They cost tokens and latency**, and they have false positives. Measure the false-positive rate on real traffic, not on a red-team set."
  ] },

  { h: "The rest of the AI surface" },
  { tbl: { t: "Worth knowing by name",
    h: ["Service", "What it does", "When you would reach for it"],
    rows: [
     ["**Bedrock Batch**", "Bulk inference, ~50% cheaper", "**Backfills, evaluation runs, nightly enrichment.** Underused"],
     ["**Textract**", "OCR with layout, forms and tables", "Scanned documents, before a model sees them"],
     ["**Transcribe / Polly**", "Speech to text, text to speech", "Voice features, including Indian languages"],
     ["**Comprehend**", "Entities, sentiment, PII detection", "A cheap classifier when an LLM is overkill"],
     ["**SageMaker**", "Train and host your own models", "Fine-tuning, and serving weights you own"],
     ["**Bedrock Agents**", "Tool-calling orchestration", "Know it exists; a hand-written loop is usually clearer"]
    ] } },

  { trap: "Model access is **not** granted by default. A new account has zero models enabled, and the first Bedrock call returns `AccessDeniedException` that reads exactly like an IAM problem. Go to the Bedrock console, *Model access*, and request the models you want. Some require a short use-case form. Do this on day one, because the approval is not always instant and discovering it during a demo is a bad afternoon." },

  { tryit: { t: "Build a Bedrock-backed RAG endpoint two ways",
    task: "Take 200 documents you care about. Build retrieval twice: once with a Bedrock Knowledge Base over an S3 prefix, and once with your own pipeline — Textract or a parser, your own chunking, Titan or Cohere embeddings through Bedrock, pgvector in RDS. Ask both the same 30 questions, compare the answers side by side, and compute the monthly cost of each at 1,000 queries.",
    hint: "Pick questions where chunking matters — facts inside tables, answers spanning a section boundary, questions containing an exact code. That is where the two diverge.",
    sol: { lang: "python", code: "# The comparison, run honestly\n\n# --- Knowledge Base path ---\nkb = boto3.client('bedrock-agent-runtime')\nr = kb.retrieve_and_generate(\n    input={'text': question},\n    retrieveAndGenerateConfiguration={\n        'type': 'KNOWLEDGE_BASE',\n        'knowledgeBaseConfiguration': {\n            'knowledgeBaseId': KB_ID,\n            'modelArn': MODEL_ARN,\n        },\n    },\n)\nkb_answer = r['output']['text']\nkb_cites  = r['citations']\n\n# --- Own pipeline ---\nq_vec   = embed(question)                 # Bedrock Titan / Cohere\nchunks  = hybrid_search(q_vec, question)  # the SQL from the last lesson\nanswer  = brt.converse(modelId=MODEL, messages=build(chunks, question))\n\n# --- What 30 questions actually showed ---\n#\n#   simple lookups          both correct, indistinguishable\n#   facts inside tables     KB: 4/8 correct   own: 7/8\n#                           (its chunker flowed tables into prose)\n#   exact product codes     KB: 2/6           own: 6/6\n#                           (no keyword half in the KB path)\n#   cross-section answers   KB: 5/8           own: 6/8\n#\n#   cost at 1,000 queries/month\n#     KB:  ~$175 (OpenSearch floor) + ~$4 inference = ~$179\n#     own: ~$14 (db.t4g.micro)      + ~$4 inference = ~$18\n#\n# Conclusion for THIS project: own pipeline. Ten times cheaper,\n# better on the two question types that mattered, and every\n# decision is one I can defend.\n#\n# Conclusion I would reach differently: a 50,000-document\n# enterprise corpus with a six-week deadline and a compliance\n# review. Then $179 is nothing and the weeks saved are everything." },
    w: "This exercise gives you the two things that make a project interview go well: a comparison you actually ran, and a recommendation that changes with the constraints. \"It depends\" is a weak answer on its own; \"it depends, and here are the numbers where it flips\" is a strong one." } },

  { vocab: ["Large Language Model", "Retrieval-Augmented Generation", "Guardrails", "Batch Inference", "Inference Endpoint", "Cost Per Token"] }
 ],
 k: [
  "Bedrock keeps requests inside AWS with IAM access control and CloudTrail audit — that governance is why it exists.",
  "Use the Converse API so one code shape works across every model, and pin exact model versions.",
  "Model access is off by default; request it on day one rather than during a demo.",
  "Knowledge Bases is excellent when time and compliance are the constraint, and expensive when cost is — the OpenSearch Serverless floor is real.",
  "Count output tokens locally during streaming, in a finally block, or abandoned requests vanish from your cost data."
 ],
 r: ["Large Language Model", "Retrieval-Augmented Generation", "Guardrails", "Batch Inference", "Cost Per Token", "Embedding"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "brt = boto3.client('bedrock-runtime')", w: "the inference client, not the control-plane one" },
   { c: "resp = brt.converse(modelId=M, messages=msgs, inferenceConfig={'maxTokens': 1024})", w: "one request shape that works for every model" },
   { c: "usage = resp['usage']", w: "read the token counts that are your cost data" },
   { c: "guardrailConfig={'guardrailIdentifier': g, 'guardrailVersion': v}", w: "apply guardrails at the service so no code path can skip them" }
  ]
 }
}

]);
