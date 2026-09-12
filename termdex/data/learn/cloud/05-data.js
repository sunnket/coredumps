/* AWS for AI Engineers — databases, queues and vectors. */
TD.addLessons("cloud", [

{
 t: "Databases, Vectors and Queues",
 m: "data",
 lvl: "core",
 s: "RDS with pgvector, DynamoDB, OpenSearch and SQS — with the reasoning for which store an AI workload belongs in.",
 goal: [
  "Choose a data store from access pattern rather than from familiarity",
  "Run vector search on Postgres and know when that stops being enough",
  "Decouple slow AI work from a fast API with a queue"
 ],
 b: [
  { p: "Almost every AI application needs four things stored: application data, chat history, document chunks with their embeddings, and work that has not finished yet. AWS has an obvious service for each, and a much cheaper answer for two of them than most people reach for." },

  { h: "The four stores" },
  { tbl: { t: "What goes where, and why",
    h: ["Data", "Service", "Why", "Rough cost"],
    rows: [
     ["Users, documents, jobs, metadata", "**RDS Postgres**", "Relational, transactional, joins, and you already know SQL", "~₹1,200/mo `db.t4g.micro`"],
     ["Embeddings and chunks", "**pgvector in the same RDS**", "One database, one backup, joins against metadata in the same query", "Included"],
     ["Chat history, sessions, high-write logs", "**DynamoDB**", "Single-digit-ms writes, scales without thinking, on-demand pricing", "Pennies at small scale"],
     ["Full-text and hybrid search at scale", "**OpenSearch**", "BM25 plus vectors, when Postgres runs out", "~₹6,000/mo minimum"],
     ["Work in progress", "**SQS**", "Retries, dead letters, decoupling — the cheapest reliability you can buy", "~free at small scale"]
    ] } },

  { n: "The recommendation that saves people the most money and complexity: **use Postgres with pgvector until you have a measured reason not to.** Under roughly a million chunks it is fast enough, it lives in the database you already run, it filters against your real columns in the same query, and it is transactional. Most teams add a dedicated vector database two years before they need one, and then maintain a consistency problem they invented.",
    nt: "The single most useful opinion in this lesson" },

  { h: "pgvector, end to end" },
  { code: { lang: "sql", file: "schema.sql", t: "A chunk table that works in production",
    lines: [
     { c: "CREATE EXTENSION IF NOT EXISTS vector;", w: "**Available on RDS Postgres 15+** and on Aurora. Nothing to install." },
     { c: "", w: "" },
     { c: "CREATE TABLE chunks (", w: "" },
     { c: "  id           bigserial PRIMARY KEY,", w: "" },
     { c: "  document_id  uuid NOT NULL REFERENCES documents(id) ON DELETE CASCADE,", w: "**A real foreign key.** Deleting a document deletes its chunks, atomically. A separate vector database cannot give you this.", hi: true },
     { c: "  tenant_id    uuid NOT NULL,", w: "**Multi-tenancy as a column**, filterable in the same query as the similarity." },
     { c: "  chunk_index  int  NOT NULL,", w: "" },
     { c: "  content      text NOT NULL,", w: "" },
     { c: "  content_hash text NOT NULL,", w: "**Re-embed only what changed.** The economics of ingestion depend on this column." },
     { c: "  heading_path text[],", w: "" },
     { c: "  embedding    vector(1024),", w: "**Dimension is fixed at creation.** Changing embedding models means a new column or a new table — see the migration discussion in the LLM track." },
     { c: "  tsv          tsvector GENERATED ALWAYS AS (to_tsvector('english', content)) STORED,", w: "**Keyword search in the same row.** This is what makes hybrid retrieval possible without a second system.", hi: true },
     { c: "  created_at   timestamptz NOT NULL DEFAULT now()", w: "" },
     { c: ");", w: "" },
     { c: "", w: "" },
     { c: "CREATE INDEX ON chunks USING hnsw (embedding vector_cosine_ops)", w: "**HNSW, not IVFFlat**, unless memory is tight. Better recall, no training step, and it handles inserts." },
     { c: "  WITH (m = 16, ef_construction = 64);", w: "**m** is neighbours per node; **ef_construction** is build quality. Defaults are reasonable." },
     { c: "CREATE INDEX ON chunks USING gin (tsv);", w: "**The keyword index.**" },
     { c: "CREATE INDEX ON chunks (tenant_id, document_id);", w: "**Ordinary B-tree for the filters.** The planner uses this before touching the vector index when the filter is selective." },
     { c: "CREATE UNIQUE INDEX ON chunks (document_id, chunk_index);", w: "**Idempotent ingestion.** Re-running the pipeline updates rather than duplicates." }
    ] } },

  { code: { lang: "sql", file: "hybrid.sql", t: "Hybrid search with reciprocal rank fusion, in one query",
    lines: [
     { c: "WITH dense AS (", w: "" },
     { c: "  SELECT id, ROW_NUMBER() OVER (ORDER BY embedding <=> $1) AS rank", w: "**`<=>` is cosine distance.** `<->` is L2, `<#>` is negative inner product. Match the operator to the index's ops class or the index is ignored.", hi: true },
     { c: "  FROM chunks", w: "" },
     { c: "  WHERE tenant_id = $2", w: "**Filter first.** Postgres applies this during the index scan, not after — which is why pre-filtering here does not destroy recall the way post-filtering does." },
     { c: "  ORDER BY embedding <=> $1", w: "" },
     { c: "  LIMIT 50", w: "" },
     { c: "), sparse AS (", w: "" },
     { c: "  SELECT id, ROW_NUMBER() OVER (ORDER BY ts_rank_cd(tsv, q) DESC) AS rank", w: "**BM25-like keyword ranking.** This is what catches product codes and rare acronyms that embeddings miss." },
     { c: "  FROM chunks, plainto_tsquery('english', $3) q", w: "" },
     { c: "  WHERE tenant_id = $2 AND tsv @@ q", w: "" },
     { c: "  ORDER BY ts_rank_cd(tsv, q) DESC", w: "" },
     { c: "  LIMIT 50", w: "" },
     { c: ")", w: "" },
     { c: "SELECT c.id, c.content,", w: "" },
     { c: "       COALESCE(1.0 / (60 + d.rank), 0) +", w: "**Reciprocal rank fusion.** Uses rank position only, never raw scores — because cosine lives in [0,1] and text rank is unbounded, so adding them directly is meaningless.", hi: true },
     { c: "       COALESCE(1.0 / (60 + s.rank), 0) AS score", w: "**The 60 damps the dominance of the top result.**" },
     { c: "FROM chunks c", w: "" },
     { c: "LEFT JOIN dense d ON d.id = c.id", w: "" },
     { c: "LEFT JOIN sparse s ON s.id = c.id", w: "" },
     { c: "WHERE d.id IS NOT NULL OR s.id IS NOT NULL", w: "" },
     { c: "ORDER BY score DESC", w: "" },
     { c: "LIMIT 10;", w: "" }
    ],
    after: "Adding the keyword half to a dense-only system is frequently the single largest retrieval improvement available, and here it costs one CTE and one index. That is the strongest practical argument for keeping vectors in Postgres." } },

  { trap: "`SET hnsw.ef_search = 100;` before your query, or you get pgvector's default of 40 and lower recall than you expected. It is a per-session setting, so it must be issued on the connection — which means setting it in your pool's initialisation, not once at startup. This costs people recall silently for months." },

  { h: "When Postgres is no longer the answer" },
  { l: [
   "**Above roughly 5–10 million vectors**, the HNSW index stops fitting comfortably in memory and query latency becomes erratic. Move to OpenSearch or a dedicated store.",
   "**When you need sub-20 ms at high concurrency**, a purpose-built index wins.",
   "**When ingestion is continuous and heavy**, HNSW index maintenance competes with your transactional workload on the same instance.",
   "**Bedrock Knowledge Bases** is the managed shortcut: point it at an S3 prefix, it chunks, embeds and indexes for you. Excellent for getting something working in an afternoon; less controllable than doing it yourself, and you will want the control eventually."
  ] },

  { h: "DynamoDB, in the one shape you need" },
  { code: { lang: "python", file: "history.py", t: "Chat history — the classic DynamoDB use case",
    lines: [
     { c: "# Partition key: the conversation. Sort key: the timestamp.", w: "" },
     { c: "# This one design answers 'give me this conversation in order'", w: "" },
     { c: "# in a single, constant-cost query.", w: "" },
     { c: "table.put_item(Item={", w: "" },
     { c: "    'pk': f'CONV#{conversation_id}',", w: "**Partition key decides everything in DynamoDB.** Pick it from the query you must serve, before anything else.", hi: true },
     { c: "    'sk': f'MSG#{timestamp_iso}#{message_id}',", w: "**Sort key gives you ordering and range queries** within the partition." },
     { c: "    'role': 'user',", w: "" },
     { c: "    'content': text,", w: "" },
     { c: "    'tokens': n_tokens,", w: "" },
     { c: "    'ttl': int(time.time()) + 90 * 86400,", w: "**TTL deletes the item automatically after 90 days.** Free, and it is how you meet a retention policy without writing a cleanup job.", hi: true },
     { c: "})", w: "" },
     { c: "", w: "" },
     { c: "resp = table.query(", w: "" },
     { c: "    KeyConditionExpression=Key('pk').eq(f'CONV#{conversation_id}')", w: "" },
     { c: "                          & Key('sk').begins_with('MSG#'),", w: "" },
     { c: "    ScanIndexForward=False,", w: "**Newest first.**" },
     { c: "    Limit=20,", w: "**The last 20 turns.** Bounded by design, which is also your context budget." },
     { c: ")", w: "" }
    ],
    after: "The rule that makes DynamoDB usable: design the key from the access pattern, not from the entity. If you find yourself scanning, you have modelled it as a relational table and it will be slow and expensive." } },

  { h: "SQS — the cheapest reliability available" },
  { code: { lang: "text", t: "Why an AI pipeline needs a queue",
    lines: [
     { c: "  WITHOUT a queue" },
     { c: "    POST /ingest -> parse -> embed -> index -> 200 OK" },
     { c: "                     |" },
     { c: "                     +- 4 minutes for a 300-page PDF" },
     { c: "                     +- client times out at 30s", hi: true },
     { c: "                     +- a provider hiccup loses the work entirely" },
     { c: "" },
     { c: "  WITH a queue" },
     { c: "    POST /ingest -> write to S3 -> enqueue -> 202 Accepted (80ms)", hi: true },
     { c: "                                      |" },
     { c: "                          worker picks it up, at its own pace" },
     { c: "                                      |" },
     { c: "                          fails? -> visible again after the" },
     { c: "                                    visibility timeout, retried" },
     { c: "                                      |" },
     { c: "                          fails 3 times? -> dead-letter queue,", hi: true },
     { c: "                                            where a human looks" }
    ] } },

  { l: [
   "**Set a dead-letter queue on every queue.** Without one, a permanently failing message retries forever, burning money and hiding the failure.",
   "**Visibility timeout must exceed your worst-case processing time**, or a slow message is delivered twice and you embed the same document twice.",
   "**Delivery is at-least-once**, so consumers must be idempotent. Content-hash keys and a unique constraint give you that for free.",
   "**FIFO queues** guarantee order and exactly-once processing at lower throughput. You rarely need them for ingestion.",
   "**Lambda triggered by SQS** is the least-code worker there is, and it scales with the queue automatically."
  ] },

  { tryit: { t: "Build the storage layer for a RAG service",
    task: "Provision an RDS Postgres instance, enable pgvector, create the chunks table with both indexes, and load 5,000 real chunks with embeddings. Then run three queries: dense-only, keyword-only, and the hybrid fusion query. Compare which chunks each returns for a query containing a rare identifier — a product code, a ticket number, an error string. Finally, measure the query latency with and without `hnsw.ef_search` raised.",
    hint: "Choose the test query deliberately: something with an exact token that a semantic embedding will not represent well. That is the case hybrid exists for, and seeing it fail on dense-only is the lesson.",
    sol: { lang: "sql", code: "-- The demonstration that justifies hybrid search\n\n-- Query: \"what does error PGX-4417 mean\"\n\n-- 1. Dense only\nSET hnsw.ef_search = 100;\nSELECT id, left(content, 60), embedding <=> :q AS dist\nFROM chunks WHERE tenant_id = :t\nORDER BY embedding <=> :q LIMIT 5;\n--   returns generic passages about error handling.\n--   The exact code appears in NONE of them.\n\n-- 2. Keyword only\nSELECT id, left(content, 60), ts_rank_cd(tsv, q) r\nFROM chunks, plainto_tsquery('english','PGX-4417') q\nWHERE tenant_id = :t AND tsv @@ q\nORDER BY r DESC LIMIT 5;\n--   returns the exact passage, rank 1.\n\n-- 3. Fused: the exact match ranks first, and the semantically\n--    related context still appears at 3-5. Best of both.\n\n-- Latency check\nEXPLAIN (ANALYZE, BUFFERS)\nSELECT id FROM chunks WHERE tenant_id = :t\nORDER BY embedding <=> :q LIMIT 10;\n--   ef_search 40  ->  4.2 ms,  recall@10 measured at 0.86\n--   ef_search 100 ->  9.1 ms,  recall@10 measured at 0.97\n--\n-- Five extra milliseconds for eleven points of recall.\n-- That is the trade, and it is worth knowing your own numbers." },
    w: "Two things come out of this exercise that are worth carrying into an interview. First, a concrete demonstration of why dense retrieval alone fails — with a real query and a real miss, not an assertion. Second, your own measured recall/latency curve for `ef_search`, which is exactly the kind of specific number that makes a project sound like engineering." } },

  { vocab: ["Vector Database", "Relational Database", "Message Queue", "Idempotency", "Dead Letter Queue", "Sharding"] }
 ],
 k: [
  "Use pgvector in the Postgres you already run until you have a measured reason to add a vector database.",
  "Keeping vectors and metadata in one table gives you foreign keys, transactions and hybrid search in a single query.",
  "Set `hnsw.ef_search` per connection — the default of 40 silently costs you recall.",
  "In DynamoDB the partition key comes from the access pattern; if you are scanning, you modelled it relationally.",
  "Every SQS queue needs a dead-letter queue, and every consumer must be idempotent because delivery is at-least-once."
 ],
 r: ["Vector Database", "Relational Database", "Message Queue", "Idempotency", "Embedding", "Reranking"],
 drill: {
  lang: "sql",
  reps: 3,
  items: [
   { c: "CREATE INDEX ON chunks USING hnsw (embedding vector_cosine_ops);", w: "build the vector index that matches the cosine operator" },
   { c: "SET hnsw.ef_search = 100;", w: "raise recall on this connection before querying" },
   { c: "ORDER BY embedding <=> $1 LIMIT 50", w: "nearest neighbours by cosine distance" },
   { c: "1.0 / (60 + rank)", w: "the reciprocal rank fusion term, which uses rank not score" }
  ]
 }
}

]);
