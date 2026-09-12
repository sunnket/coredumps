/* LLM Engineering — retrieval-augmented generation. */
TD.addLessons("llm", [

{
 t: "RAG: The Pipeline, and Where Each Stage Fails",
 m: "rag",
 lvl: "core",
 s: "Chunking, embedding, searching, reranking, grounding — and the failure that belongs to each.",
 goal: [
  "Name the seven stages of a RAG pipeline and the failure mode of each",
  "Choose a chunking strategy from the structure of your documents",
  "Diagnose a bad answer by working backwards through the pipeline"
 ],
 b: [
  { p: "*Design a RAG system and tell me how you would evaluate it* is close to a universal interview question for this role. It is also the most-deployed real application of language models. This lesson is the pipeline; the next is what makes it work in production." },

  { h: "Why RAG exists" },
  { l: [
   "**The model does not know your documents.** They were not in its training data and never will be.",
   "**Facts change.** Retraining costs millions; updating an index costs seconds.",
   "**You need citations.** A grounded answer with sources is auditable; a generated one is not.",
   "**Fine-tuning does not fix any of this.** It teaches style, not facts — and on a knowledge problem it makes the model more confidently wrong."
  ] },

  { h: "The seven stages" },
  { tbl: { t: "The pipeline, and what breaks at each point",
    h: ["#", "Stage", "Failure here looks like"],
    rows: [
     ["1", "**Ingest** — get documents in, extract text", "Garbled PDF text, lost tables, missing pages. **The most under-estimated stage by a distance**"],
     ["2", "**Chunk** — split into retrievable pieces", "An answer split across two chunks, so neither is retrievable"],
     ["3", "**Embed** — turn chunks into vectors", "Wrong model for the domain or language; truncated long chunks"],
     ["4", "**Index** — store for fast search", "Slow queries, stale index, missing metadata filters"],
     ["5", "**Retrieve** — find candidates for a query", "**The right chunk is not in the results at all.** Everything downstream is then irrelevant"],
     ["6", "**Rerank** — order by true relevance", "Good chunk retrieved but ranked 40th, so it never reaches the model"],
     ["7", "**Generate** — answer from the chunks", "Ignores the context, hallucinates, or cites the wrong source"]
    ] } },

  { n: "Debug backwards. Given a bad answer, the first question is always *was the right chunk retrieved at all?* If it was not, no prompt change will help and you have a stage 1–5 problem. If it was retrieved and the answer is still wrong, you have a stage 6–7 problem. This split saves enormous amounts of time and almost nobody does it systematically.",
    nt: "The debugging order" },

  { h: "Stage 1: ingestion is harder than it looks" },
  { code: { lang: "python", t: "What goes wrong with real documents",
    lines: [
     { c: "# A PDF is a DRAWING FORMAT, not a text format.", w: "**This is the root of most ingestion pain.**", hi: true },
     { c: "# It says 'put this glyph at these coordinates'.", w: "" },
     { c: "# Reading order is inferred, and often wrongly.", w: "" },
     { c: "", w: "" },
     { c: "# Common damage:", w: "" },
     { c: "#   two-column layouts read across, interleaving columns", w: "" },
     { c: "#   tables become a stream of numbers with no structure", w: "**Tables are the worst case, and they hold the most valuable facts.**" },
     { c: "#   headers and footers repeat into every chunk", w: "" },
     { c: "#   scanned pages contain no text at all -- OCR required", w: "" },
     { c: "#   ligatures: 'fi' becomes an unmatched glyph", w: "" },
     { c: "", w: "" },
     { c: "# ALWAYS print the extracted text of 5 random pages", w: "**Before building anything else.** Ten minutes here saves a fortnight of chasing 'model quality' problems.", hi: true }
    ] } },

  { l: [
   "**PyMuPDF** — fast, good general-purpose text extraction.",
   "**Unstructured / Docling** — layout-aware; keeps tables and headings as structure.",
   "**A vision model** — send page images to a multimodal model and ask for markdown. Expensive, and dramatically better on complex layouts and scans.",
   "**Keep the structure you extract.** Headings, page numbers and section titles are metadata worth carrying — they improve both retrieval and citation."
  ] },

  { h: "Stage 2: chunking" },
  { p: "Chunking decides what can be retrieved. A fact split across two chunks is effectively invisible to your system." },

  { tbl: { t: "Strategies, worst to best",
    h: ["Strategy", "How", "Verdict"],
    rows: [
     ["**Fixed characters**", "Every 1,000 characters", "**Naive.** Splits mid-sentence and mid-table. The default in most tutorials and rarely the right answer"],
     ["**Recursive**", "Split on paragraphs, then sentences, then words, until under a size limit", "**A reasonable default.** Respects natural boundaries"],
     ["**Structural**", "Split on markdown headings, sections, or document structure", "**Best when documents have structure**, which most real ones do"],
     ["**Semantic**", "Split where the topic shifts, measured by embedding distance", "Elegant, slow to compute, and rarely worth it over structural in practice"],
     ["**Whole document**", "No splitting", "Viable for short documents with long-context models. Simple, and expensive per query"]
    ] } },

  { code: { lang: "python", t: "Structural chunking with the context it needs",
    lines: [
     { c: "def chunk_markdown(doc, target=800, overlap=100):", w: "**Target 600–1,000 tokens** is the usual sweet spot. Measure on your own data." },
     { c: "    chunks, cur, heading = [], [], ''", w: "" },
     { c: "", w: "" },
     { c: "    for line in doc.split('\\n'):", w: "" },
     { c: "        if line.startswith('#'):", w: "" },
     { c: "            if cur: chunks.append(make(heading, cur))", w: "**Break at headings.** A section is a natural retrievable unit." },
     { c: "            heading, cur = line.strip('# '), []", w: "" },
     { c: "        else:", w: "" },
     { c: "            cur.append(line)", w: "" },
     { c: "            if tokens(cur) > target:", w: "" },
     { c: "                chunks.append(make(heading, cur))", w: "" },
     { c: "                cur = cur[-overlap_lines(cur, overlap):]", w: "**Overlap.** Carry the tail forward so a fact spanning a boundary appears in both chunks.", hi: true },
     { c: "    return chunks", w: "" },
     { c: "", w: "" },
     { c: "def make(heading, lines):", w: "" },
     { c: "    return {", w: "" },
     { c: "      'text': f'# {heading}\\n' + '\\n'.join(lines),", w: "**Prepend the heading to the chunk text.** A chunk reading *the limit is 50,000* is useless; *Withdrawal Limits: the limit is 50,000* is retrievable and citable.", hi: true },
     { c: "      'heading': heading,", w: "**Also as metadata**, for filtering and citation." },
     { c: "    }", w: "" }
    ] } },

  { trap: "Chunks that lose their context are the most common silent RAG failure. A chunk saying *this must be completed within 30 days* is retrievable and worthless — 30 days of what? Prepend the document title and heading path to every chunk. It costs a few tokens and it is frequently the single largest quality improvement available in a mediocre RAG system." },

  { h: "Stage 3: embedding" },
  { tbl: { t: "Choosing an embedding model",
    h: ["Consideration", "What to do"],
    rows: [
     ["**Dimensions**", "384 is fast and cheap; 1024–1536 is more accurate. **Measure the difference on your data** — it is often small"],
     ["**Max sequence length**", "**Check it.** Many models truncate at 512 tokens, silently. A 1,000-token chunk loses half its content with no warning"],
     ["**Language**", "Multilingual models for non-English content. English-only models degrade badly on Hindi or Tamil"],
     ["**Domain**", "Legal, medical and code have specialised models that are meaningfully better"],
     ["**Asymmetric search**", "Some models have separate query and document encoders. **Use the right one for each side** or retrieval quietly degrades"],
     ["**Hosted or local**", "Hosted is easier; local is cheaper at volume and required when data cannot leave"]
    ] } },

  { code: { lang: "python", t: "Embedding a corpus, with the details that matter",
    lines: [
     { c: "from sentence_transformers import SentenceTransformer", w: "" },
     { c: "", w: "" },
     { c: "model = SentenceTransformer('BAAI/bge-m3')", w: "**Strong multilingual model** — a reasonable default for Indian-language content." },
     { c: "print(model.max_seq_length)", w: "**Check this against your chunk size.** The mismatch is a real and invisible bug.", hi: true },
     { c: "", w: "" },
     { c: "vecs = model.encode(", w: "" },
     { c: "    [c['text'] for c in chunks],", w: "" },
     { c: "    batch_size=64,", w: "**Batch.** One-at-a-time encoding of 100,000 chunks takes hours instead of minutes." },
     { c: "    normalize_embeddings=True,", w: "**Normalise at write time**, so cosine similarity becomes a plain dot product.", hi: true },
     { c: "    show_progress_bar=True)", w: "" }
    ] } },

  { h: "Stages 4 and 5: index and retrieve" },
  { code: { lang: "python", t: "pgvector — the pragmatic default",
    lines: [
     { c: "CREATE EXTENSION vector;", w: "" },
     { c: "", w: "" },
     { c: "CREATE TABLE chunks (", w: "" },
     { c: "  id bigserial PRIMARY KEY,", w: "" },
     { c: "  doc_id text NOT NULL,", w: "" },
     { c: "  heading text,", w: "" },
     { c: "  text text NOT NULL,", w: "" },
     { c: "  tenant_id text NOT NULL,", w: "**Metadata for filtering.** Multi-tenant systems must filter, not merely rank." },
     { c: "  embedding vector(1024)", w: "" },
     { c: ");", w: "" },
     { c: "", w: "" },
     { c: "CREATE INDEX ON chunks USING hnsw (embedding vector_cosine_ops);", w: "**HNSW** — approximate nearest neighbour. Sub-linear search, tiny accuracy loss.", hi: true },
     { c: "CREATE INDEX ON chunks (tenant_id);", w: "**Index the filter column too**, or filtering scans the whole table." }
    ] } },

  { n: "Start with pgvector if you already run Postgres. One fewer system to operate, transactional consistency between your documents and their vectors, and it handles several million vectors comfortably. Move to a dedicated vector database — Qdrant, Weaviate, Pinecone — when you outgrow it, not before. *We need a vector database* is a conclusion, not a starting assumption.",
    nt: "The architecture decision most teams get backwards" },

  { code: { lang: "python", t: "A retrieval query with a filter",
    lines: [
     { c: "SELECT id, doc_id, heading, text,", w: "" },
     { c: "       1 - (embedding <=> %(q)s) AS score", w: "**`<=>` is cosine distance** in pgvector; 1 minus it gives similarity." },
     { c: "FROM chunks", w: "" },
     { c: "WHERE tenant_id = %(tenant)s", w: "**Filter first.** Security is a filter, never a ranking — a low-scoring chunk from another tenant is still a data breach.", hi: true },
     { c: "ORDER BY embedding <=> %(q)s", w: "" },
     { c: "LIMIT 50;", w: "**Retrieve broadly — 50, not 5.** The reranker will cut it down. Recall at this stage is what matters.", hi: true }
    ] } },

  { h: "Stage 6: reranking" },
  { p: "Embedding search is fast and approximate. A **cross-encoder** reranker reads the query and each chunk *together* and scores their actual relevance. It is far more accurate and far too slow to run over the whole corpus — so retrieve 50 cheaply, rerank them expensively, keep 5." },

  { code: { lang: "python", t: "Retrieve broad, rerank hard",
    lines: [
     { c: "from sentence_transformers import CrossEncoder", w: "" },
     { c: "reranker = CrossEncoder('BAAI/bge-reranker-v2-m3')", w: "" },
     { c: "", w: "" },
     { c: "candidates = vector_search(query, k=50)", w: "**Cheap and broad.** Optimise for recall here." },
     { c: "", w: "" },
     { c: "scores = reranker.predict([(query, c['text']) for c in candidates])", w: "**Query and chunk read together**, which is what a bi-encoder cannot do.", hi: true },
     { c: "", w: "" },
     { c: "ranked = sorted(zip(scores, candidates), reverse=True)[:5]", w: "**Optimise for precision here.**" },
     { c: "", w: "" },
     { c: "context = [c for s, c in ranked if s > 0.3]", w: "**Drop weak matches entirely.** Sending an irrelevant chunk is worse than sending nothing — the model may use it." }
    ],
    after: "Adding a reranker is typically the single largest quality improvement available in a working RAG system — commonly ten to twenty points on answer accuracy. It costs latency, usually 100–300ms, and it is almost always worth it." } },

  { h: "Stage 7: grounded generation" },
  { code: { lang: "text", t: "A generation prompt that resists hallucination",
    lines: [
     { c: "Answer using ONLY the sources below." },
     { c: "" },
     { c: "<sources>" },
     { c: "[1] Withdrawal Limits (policy.pdf, p.12)" },
     { c: "    Daily ATM withdrawal is capped at Rs 50,000..." },
     { c: "" },
     { c: "[2] Account Types (policy.pdf, p.4)" },
     { c: "    Premium accounts have a higher cap of..." },
     { c: "</sources>", hi: true },
     { c: "" },
     { c: "Rules:" },
     { c: "- Cite the source number after each claim, like [1]." },
     { c: "- If the sources do not answer the question, say" },
     { c: "  \"I don't have that information\" and stop.", hi: true },
     { c: "- Do not use knowledge from outside the sources." },
     { c: "- If sources conflict, say so and cite both." },
     { c: "" },
     { c: "Question: {question}" }
    ],
    after: "Numbered sources with document and page make citations verifiable by the user and checkable by your evaluation. The *conflict* rule matters more than people expect — real corpora contain contradictory documents, and a model that silently picks one is hiding a problem you need to know about." } },

  { tryit: { t: "Build the pipeline and instrument every stage",
    task: "Build RAG over a corpus you know well — your own notes, a textbook, documentation. Write 20 questions where you know the answer and which chunk contains it. Then measure: retrieval recall@50, recall@5 after reranking, and end-to-end answer accuracy.",
    hint: "Record the correct chunk id for each question. Recall@k is the fraction of questions where the correct chunk is in the top k.",
    sol: { lang: "python", code: "golden = [\n  {'q': 'What is the daily ATM limit?', 'chunk_id': 412},\n  # ... 19 more, with the chunk you know contains the answer\n]\n\nr50 = r5 = correct = 0\nfor g in golden:\n    cands = vector_search(g['q'], k=50)\n    if g['chunk_id'] in [c['id'] for c in cands]:\n        r50 += 1\n\n    top5 = rerank(g['q'], cands)[:5]\n    if g['chunk_id'] in [c['id'] for c in top5]:\n        r5 += 1\n\n    if answer_is_correct(generate(g['q'], top5), g):\n        correct += 1\n\nn = len(golden)\nprint(f'recall@50 (retrieval) : {r50/n:.2f}')\nprint(f'recall@5  (rerank)    : {r5/n:.2f}')\nprint(f'end-to-end accuracy   : {correct/n:.2f}')" },
    w: "These three numbers tell you exactly where to spend your next week. Low recall@50 means fix chunking or embeddings — nothing downstream can help. High recall@50 but low recall@5 means fix the reranker. Both high but low end-to-end means fix the generation prompt. Most teams tune prompts when the problem is at stage 2, and this measurement is what stops that." } },

  { vocab: ["Retrieval-Augmented Generation", "Chunking", "Embedding", "Vector Database", "Reranking", "Semantic Search"] }
 ],
 k: [
  "Seven stages: ingest, chunk, embed, index, retrieve, rerank, generate — each with its own failure mode.",
  "Debug backwards: first ask whether the right chunk was retrieved at all.",
  "Prepend document title and heading to every chunk; context-less chunks are a silent, common failure.",
  "Retrieve broadly (k=50) for recall, then rerank hard and keep about five for precision.",
  "Filter by tenant in the WHERE clause — security is a filter, never a ranking."
 ],
 r: ["Retrieval-Augmented Generation", "Chunking", "Embedding", "Vector Database", "Reranking", "Semantic Search", "Cosine Similarity"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "model.encode(texts, batch_size=64, normalize_embeddings=True)", w: "embed a corpus, normalised at write time" },
   { c: "CREATE INDEX ON chunks USING hnsw (embedding vector_cosine_ops)", w: "approximate nearest-neighbour index" },
   { c: "WHERE tenant_id = %(tenant)s", w: "security is a filter, not a ranking" },
   { c: "reranker.predict([(query, c['text']) for c in candidates])", w: "score query and chunk read together" },
   { c: "[c for s, c in ranked if s > 0.3]", w: "drop weak matches rather than sending them" }
  ]
 }
},

{
 t: "Making Retrieval Actually Work",
 m: "rag",
 lvl: "intermediate",
 s: "Hybrid search, query rewriting, metadata and the failures that only appear with real users.",
 goal: [
  "Combine keyword and vector search, and say why either alone is insufficient",
  "Handle the query types that break naive RAG",
  "Keep an index fresh without rebuilding it"
 ],
 b: [
  { p: "A basic RAG pipeline works impressively on your own test questions and disappoints on real ones. The gap is almost always the same handful of problems, and they are all solvable." },

  { h: "Why pure vector search is not enough" },
  { tbl: { t: "Queries where semantic search fails",
    h: ["Query", "Why it fails", "What fixes it"],
    rows: [
     ["*Error code E-4471*", "**Exact identifiers have no useful semantics.** The embedding of E-4471 is near E-4472", "**Keyword search.** BM25 matches the exact string"],
     ["*Section 80C deduction*", "Legal and tax references are near-identical semantically", "Keyword, plus metadata filters"],
     ["*What did we decide about pricing last March?*", "Time is not encoded in the embedding at all", "**Metadata filter** on date"],
     ["*Compare our refund policy with our returns policy*", "Two topics, one query — a single embedding lands between them", "Query decomposition into two retrievals"],
     ["*It didn't work* (as a follow-up)", "No content to embed", "Rewrite the query using conversation history"]
    ] } },

  { h: "Hybrid search" },
  { p: "Run keyword and vector search in parallel and fuse the results. **Reciprocal Rank Fusion** is the standard method: it combines ranks rather than scores, so it needs no calibration between two systems whose scores mean different things." },

  { code: { lang: "python", t: "RRF, which is about ten lines",
    lines: [
     { c: "def rrf(*rankings, k=60):", w: "**k=60 is the conventional constant** from the original paper. Rarely worth tuning." },
     { c: "    scores = {}", w: "" },
     { c: "    for ranking in rankings:", w: "" },
     { c: "        for rank, doc_id in enumerate(ranking):", w: "" },
     { c: "            scores[doc_id] = scores.get(doc_id, 0) + 1/(k + rank + 1)", w: "**Rank, not score.** A document at position 1 contributes 1/61; at position 10, 1/71. Appearing in both lists compounds.", hi: true },
     { c: "    return sorted(scores, key=scores.get, reverse=True)", w: "" },
     { c: "", w: "" },
     { c: "vec_ids = [c['id'] for c in vector_search(q, k=50)]", w: "" },
     { c: "kw_ids  = [c['id'] for c in bm25_search(q, k=50)]", w: "**Postgres full-text search is entirely sufficient here.** No extra system required." },
     { c: "fused   = rrf(vec_ids, kw_ids)[:50]", w: "**Then rerank the fused list.**", hi: true }
    ],
    after: "Hybrid search is typically the second largest quality win after reranking, and it is particularly large for technical, legal and product corpora full of exact identifiers." } },

  { h: "Query rewriting" },
  { code: { lang: "python", t: "Three rewrites worth having",
    lines: [
     { c: "# 1. RESOLVE REFERENCES from conversation history", w: "" },
     { c: "#    'does it apply to premium too?'", w: "" },
     { c: "#    -> 'does the Rs 50,000 daily ATM withdrawal limit", w: "" },
     { c: "#        apply to premium accounts?'", w: "**Essential for any multi-turn system.** A pronoun has no retrievable content.", hi: true },
     { c: "", w: "" },
     { c: "# 2. DECOMPOSE multi-part questions", w: "" },
     { c: "#    'compare the refund and returns policies'", w: "" },
     { c: "#    -> ['refund policy', 'returns policy']", w: "**Retrieve for each, then merge.** One embedding for two topics lands between them and retrieves neither." },
     { c: "", w: "" },
     { c: "# 3. HyDE -- hypothetical document embedding", w: "" },
     { c: "#    generate a fake ideal answer, embed THAT", w: "**Answers look like documents; questions do not.** Searching with a hypothetical answer often retrieves better.", hi: true },
     { c: "#    costs one extra call; measure before adopting" }
    ] } },

  { trap: "Every rewriting step adds a model call, so latency and cost rise and a new failure mode appears — a bad rewrite silently destroys retrieval. Add rewriting only where you have measured that it helps, keep the original query in the search as well as the rewrite, and log both so you can tell which one found the answer." },

  { h: "Metadata is underused" },
  { code: { lang: "python", t: "Filters that solve problems ranking cannot",
    lines: [
     { c: "chunk_metadata = {", w: "" },
     { c: "  'doc_id': 'policy-2026-v3',", w: "" },
     { c: "  'doc_title': 'Account Terms and Conditions',", w: "**Also prepended to the chunk text**, not only stored." },
     { c: "  'heading_path': 'Accounts > Limits > ATM',", w: "**The full path.** Excellent for citation and for filtering." },
     { c: "  'effective_from': '2026-01-01',", w: "**Version and date.** Superseded policies must be filterable out — retrieving last year's rates is a serious failure, not a ranking nuisance.", hi: true },
     { c: "  'language': 'en',", w: "" },
     { c: "  'tenant_id': 'acme-corp',", w: "**Security.** Always a WHERE clause." },
     { c: "  'access_level': 'internal',", w: "" },
     { c: "  'page': 12,", w: "**So a citation can link to the actual page.**" },
     { c: "}", w: "" }
    ] } },

  { l: [
   "**Filter on date** so superseded documents cannot be retrieved.",
   "**Filter on tenant and access level** — in the query, never after retrieval.",
   "**Filter on language** when serving a multilingual corpus, or on document type when the user has specified one.",
   "**Boost by recency** rather than filtering, when older documents are still valid but less likely to be wanted."
  ] },

  { h: "Keeping the index fresh" },
  { tbl: { t: "Update strategies",
    h: ["Approach", "How", "When"],
    rows: [
     ["**Full rebuild**", "Re-embed everything nightly", "Small corpora. Simple, and simplicity has real value"],
     ["**Incremental**", "Hash each chunk; re-embed only what changed", "**The default for anything sizeable.** Most documents do not change"],
     ["**Event-driven**", "A webhook on document change triggers re-embedding", "Where freshness genuinely matters"],
     ["**Soft delete**", "Mark deleted rather than removing", "**Always.** A hard delete during a query causes confusing partial results"]
    ] } },

  { code: { lang: "python", t: "Incremental updates by content hash",
    lines: [
     { c: "import hashlib", w: "" },
     { c: "", w: "" },
     { c: "def chunk_hash(text):", w: "" },
     { c: "    return hashlib.sha256(text.encode()).hexdigest()[:16]", w: "" },
     { c: "", w: "" },
     { c: "for chunk in new_chunks:", w: "" },
     { c: "    h = chunk_hash(chunk['text'])", w: "" },
     { c: "    if h in existing_hashes:", w: "" },
     { c: "        continue", w: "**Unchanged — skip the embedding call entirely.** On a typical corpus this skips 95%+ of the work.", hi: true },
     { c: "    upsert(chunk, embed(chunk['text']), h)", w: "" },
     { c: "", w: "" },
     { c: "for h in existing_hashes - new_hashes:", w: "" },
     { c: "    mark_deleted(h)", w: "**Soft delete**, so an in-flight query never sees a half-updated index." }
    ] } },

  { h: "The failures that only show up with real users" },
  { ol: [
   "**Questions the corpus cannot answer.** Users ask things nobody documented. The system must say so rather than assembling something plausible — and how often it correctly says so is a metric worth tracking.",
   "**Conflicting documents.** Two policies disagree because one is out of date. Surface the conflict; do not silently pick.",
   "**Very short queries.** *refund* has almost no semantic content. Keyword search and clarification handle this better than embeddings.",
   "**Questions requiring aggregation.** *How many policies mention GST?* is not a retrieval question at all — retrieval finds a few relevant chunks, not a count. Route these to a different tool or decline clearly.",
   "**Multi-hop questions.** *What is the limit for the account type Priya has?* needs two lookups chained. Naive RAG retrieves for the surface question and misses.",
   "**Adversarial input.** Someone will try to make your assistant ignore its instructions. The guardrails module covers this."
  ] },

  { n: "Route before you retrieve. A cheap classifier at the front — is this a lookup, an aggregation, a chit-chat message, or something out of scope? — prevents the most embarrassing failures. Aggregation questions go to SQL, out-of-scope questions get a polite decline, and only genuine lookups reach the retrieval pipeline.",
    nt: "The architectural fix for several problems at once" },

  { tryit: { t: "Break your own system, then fix one thing",
    task: "Take your RAG system and write ten deliberately hard queries: an exact identifier, a date-scoped question, a two-part comparison, a follow-up with a pronoun, and a question the corpus genuinely cannot answer. Record what happens. Then add hybrid search and re-run.",
    hint: "The unanswerable question is the most important one. Does your system say it does not know, or does it produce a confident, plausible fabrication?",
    sol: { lang: "python", code: "hard = [\n  ('exact id',      'what does error E-4471 mean?'),\n  ('date-scoped',   'what was the limit before January 2026?'),\n  ('two-part',      'compare the refund and returns policies'),\n  ('pronoun',       'does it apply to premium accounts?'),\n  ('unanswerable',  'what is the CEO\\'s home address?'),\n  ('aggregation',   'how many sections mention GST?'),\n  ('multi-hop',     'what limit applies to Priya\\'s account type?'),\n  ('very short',    'refund'),\n  ('typo',          'withdrawl limt atm'),\n  ('other language','एटीएम की सीमा क्या है?'),\n]\n\nfor label, q in hard:\n    vec_only = answer(q, hybrid=False)\n    hybrid   = answer(q, hybrid=True)\n    print(f'\\n[{label}] {q}')\n    print(f'  vector : {vec_only[:90]}')\n    print(f'  hybrid : {hybrid[:90]}')" },
    w: "Hybrid search will fix the exact identifier and the typo immediately, and typically help the very short query. It will not fix date scoping (metadata filter), the two-part question (decomposition) or the pronoun (rewriting) — each of those needs its own mechanism. And if the unanswerable question produced a confident address, you have found the most urgent thing to fix, ahead of everything else on the list." } },

  { vocab: ["Hybrid Search", "Reranking", "Vector Database", "Semantic Search"] }
 ],
 k: [
  "Pure vector search fails on exact identifiers, dates, multi-part and follow-up queries.",
  "Hybrid search with Reciprocal Rank Fusion combines ranks, so no score calibration is needed.",
  "Query rewriting resolves pronouns and decomposes multi-part questions, but adds latency and a new failure mode.",
  "Metadata filters solve what ranking cannot — dates, tenants, access levels, versions.",
  "Route before retrieving: aggregation and out-of-scope questions should never reach the retrieval pipeline."
 ],
 r: ["Hybrid Search", "Reranking", "Vector Database", "Retrieval-Augmented Generation"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "scores[doc] = scores.get(doc, 0) + 1/(k + rank + 1)", w: "reciprocal rank fusion, the whole formula" },
   { c: "rrf(vector_ids, keyword_ids)[:50]", w: "combine two rankings, then rerank the result" },
   { c: "hashlib.sha256(text.encode()).hexdigest()[:16]", w: "content hash, so unchanged chunks are never re-embedded" },
   { c: "WHERE effective_from <= now() AND (superseded_at IS NULL)", w: "never retrieve an out-of-date policy" }
  ]
 }
}

]);
