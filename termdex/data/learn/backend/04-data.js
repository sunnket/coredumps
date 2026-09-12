/* Backend & APIs — persistence, caching and queues. */
TD.addLessons("backend", [

{
 t: "Databases, Caches and Getting Work Off the Request Path",
 m: "data",
 lvl: "core",
 s: "Connection pools, the N+1 query, Redis caching, and why long jobs need a queue.",
 goal: [
  "Talk to a database from a service without exhausting its connections",
  "Spot and fix an N+1 query, the commonest backend performance bug",
  "Move slow work to a background queue and report progress honestly"
 ],
 b: [
  { p: "Three pieces sit behind almost every service: a database for truth, a cache for speed, and a queue for anything too slow to hold a connection open for. Each has one classic failure that accounts for most of the trouble." },

  { h: "Connection pooling" },
  { code: { lang: "python", t: "The arithmetic that takes services down",
    lines: [
     { c: "from sqlalchemy import create_engine", w: "" },
     { c: "", w: "" },
     { c: "engine = create_engine(", w: "" },
     { c: "    settings.database_url,", w: "" },
     { c: "    pool_size=10,", w: "**Connections held open per process.**" },
     { c: "    max_overflow=5,", w: "**Extra under burst.** So 15 maximum per worker." },
     { c: "    pool_pre_ping=True,", w: "**Checks a connection is alive before handing it out.** Without this, a connection killed by a network blip or a database restart surfaces as a mysterious error hours later.", hi: true },
     { c: "    pool_recycle=3600,", w: "**Recycle hourly**, because managed databases and proxies drop idle connections silently." },
     { c: ")", w: "" },
     { c: "", w: "" },
     { c: "# 4 gunicorn workers x 15 = 60 connections per container", w: "" },
     { c: "# 5 containers                = 300", w: "" },
     { c: "# Postgres default max_connections = 100", w: "**You are down.** And it happens under load, which is when you can least afford it.", hi: true }
    ] } },

  { n: "Do this arithmetic before you scale out. Postgres connections are expensive — each is a process — and the standard answer above about a hundred is **PgBouncer**, a connection pooler that multiplexes many client connections onto few database ones. Most managed Postgres offerings include one; turn it on before you need it.",
    nt: "The limit that catches people at exactly the wrong moment" },

  { h: "The N+1 query" },
  { vs: { t: "The commonest performance bug in backend code", lang: "python",
    bad: { c: "orders = db.query(Order).limit(50).all()\n\nfor o in orders:\n    print(o.customer.name)\n    # each access issues a\n    # SELECT ... WHERE id = ?\n\n# 1 query for orders\n# + 50 for customers\n# = 51 round trips", label: "N+1",
      w: "Fifty extra round trips, each a few milliseconds — so 200ms of pure latency doing nothing useful. Invisible locally with 5 rows of test data, and it scales linearly with page size, so it gets worse exactly as you get more users." },
    good: { c: "from sqlalchemy.orm import joinedload\n\norders = (db.query(Order)\n            .options(joinedload(Order.customer))\n            .limit(50).all())\n\nfor o in orders:\n    print(o.customer.name)\n    # already loaded\n\n# 1 query, joined", label: "Eager loading",
      w: "One query with a JOIN. The ORM was always capable of this; it just needs telling. `selectinload` is the alternative and is often better for one-to-many, because a JOIN there multiplies rows." } } },

  { code: { lang: "python", t: "Catching it before production does",
    lines: [
     { c: "engine = create_engine(url, echo=True)", w: "**Log every SQL statement in development.** If one endpoint produces fifty near-identical SELECTs, you have found it.", hi: true },
     { c: "", w: "" },
     { c: "# or count queries in a test:", w: "" },
     { c: "def test_list_orders_query_count(db_session):", w: "" },
     { c: "    with count_queries() as n:", w: "" },
     { c: "        client.get('/v1/orders?limit=50')", w: "" },
     { c: "    assert n <= 3, f'N+1 suspected: {n} queries'", w: "**A test that fails when someone reintroduces it.** Query-count assertions are underused and cheap.", hi: true }
    ] } },

  { h: "Caching" },
  { code: { lang: "python", t: "Redis, with the details that matter",
    lines: [
     { c: "import redis.asyncio as redis, json, hashlib", w: "" },
     { c: "", w: "" },
     { c: "r = redis.from_url(settings.redis_url, decode_responses=True)", w: "" },
     { c: "", w: "" },
     { c: "def key(*parts):", w: "" },
     { c: "    raw = ':'.join(map(str, parts))", w: "" },
     { c: "    return 'v2:' + hashlib.sha256(raw.encode()).hexdigest()[:24]", w: "**The `v2:` prefix is a global invalidation switch.** Bump it and every old entry is orphaned — far easier than deleting keys correctly.", hi: true },
     { c: "", w: "" },
     { c: "async def cached_answer(question, tenant, ttl=3600):", w: "" },
     { c: "    k = key('answer', tenant, question)", w: "**Tenant in the key.** Omitting it serves one customer's data to another — a real and serious bug.", hi: true },
     { c: "", w: "" },
     { c: "    if hit := await r.get(k):", w: "" },
     { c: "        metrics.incr('cache.hit')", w: "**Instrument both paths**, or you will never know whether the cache is working." },
     { c: "        return json.loads(hit)", w: "" },
     { c: "", w: "" },
     { c: "    metrics.incr('cache.miss')", w: "" },
     { c: "    value = await expensive_call(question)", w: "" },
     { c: "    await r.setex(k, ttl, json.dumps(value))", w: "**`setex` sets the TTL atomically.** A `set` followed by `expire` can leave a key without one if the process dies between them — and that key lives forever.", hi: true },
     { c: "    return value", w: "" }
    ] } },

  { tbl: { t: "What to cache and for how long",
    h: ["Data", "TTL", "Note"],
    rows: [
     ["Embeddings of stable text", "**Forever**", "The text has not changed, so neither has the vector. Key on a content hash"],
     ["Model answers to identical questions", "1–24 hours", "**Include tenant, language and prompt version in the key**"],
     ["Reference data — plans, config", "5–60 minutes", "Rarely changes; a stale minute is harmless"],
     ["User-specific data", "**Seconds, or not at all**", "Staleness here is visible and annoying to the user"],
     ["Anything a user just wrote", "**Never**", "Reading your own write and seeing the old value destroys trust in the product"]
    ] } },

  { trap: "Cache invalidation genuinely is hard, and the practical escape is to prefer short TTLs over clever invalidation. A five-minute TTL is nearly always simpler and safer than a system of invalidation hooks that must fire on every write path — including the ones someone adds next year without knowing the cache exists." },

  { h: "Background jobs" },
  { p: "Anything over a few seconds does not belong in a request. Holding an HTTP connection open for a two-minute PDF ingestion wastes a connection, times out at every proxy in the path, and gives the user nothing to look at." },

  { code: { lang: "python", t: "The 202 pattern, end to end",
    lines: [
     { c: "@app.post('/v1/documents', status_code=202)", w: "**202 Accepted: received, not finished.**", hi: true },
     { c: "async def upload(file: UploadFile, user = Depends(current_user)):", w: "" },
     { c: "    doc_id = await store_raw(file, user.id)", w: "**Do the fast part synchronously** — save the bytes." },
     { c: "    job = ingest_document.delay(doc_id)", w: "**Enqueue the slow part.** Returns immediately." },
     { c: "    return {'document_id': doc_id, 'job_id': job.id,", w: "" },
     { c: "            'status': 'processing',", w: "" },
     { c: "            'poll_url': f'/v1/jobs/{job.id}'}", w: "**Tell the client how to find out.** A 202 with no way to check progress is not useful.", hi: true },
     { c: "", w: "" },
     { c: "@app.get('/v1/jobs/{job_id}')", w: "" },
     { c: "def job_status(job_id: str):", w: "" },
     { c: "    j = get_job(job_id)", w: "" },
     { c: "    return {'status': j.status,", w: "**queued / running / done / failed**" },
     { c: "            'progress': j.progress,", w: "**A number, if you can produce one.** *Page 12 of 200* is worth a great deal to a waiting user." },
     { c: "            'error': j.error}", w: "**Surface the failure.** A job stuck at *running* forever is the worst outcome." }
    ] } },

  { code: { lang: "python", file: "worker.py", t: "The worker side, with the guards",
    lines: [
     { c: "from celery import Celery", w: "**Celery, RQ or arq.** Celery is the most established; RQ is simpler and often enough." },
     { c: "", w: "" },
     { c: "celery = Celery('worker', broker=settings.redis_url)", w: "" },
     { c: "", w: "" },
     { c: "@celery.task(bind=True, max_retries=3,", w: "" },
     { c: "             autoretry_for=(TransientError,),", w: "**Retry only what is worth retrying.** A malformed PDF will fail identically three times and waste the capacity." },
     { c: "             retry_backoff=True)", w: "**Exponential backoff**, so a struggling dependency is not hammered.", hi: true },
     { c: "def ingest_document(self, doc_id):", w: "" },
     { c: "    doc = load(doc_id)", w: "" },
     { c: "    set_status(doc_id, 'running')", w: "" },
     { c: "", w: "" },
     { c: "    for i, page in enumerate(doc.pages):", w: "" },
     { c: "        embed_and_store(page)", w: "" },
     { c: "        if i % 10 == 0:", w: "" },
     { c: "            set_progress(doc_id, i / len(doc.pages))", w: "**Report progress periodically**, not per page — the write itself costs something." },
     { c: "", w: "" },
     { c: "    set_status(doc_id, 'done')", w: "" }
    ] } },

  { l: [
   "**Tasks must be idempotent.** A worker can die after doing the work and before acknowledging it, so the task runs again. Design for that rather than hoping.",
   "**Give every task a timeout.** A hung task holds a worker forever, and a queue with all workers hung looks identical to a queue with no workers.",
   "**Use separate queues for fast and slow work.** One 40-minute job should not delay a hundred 2-second ones.",
   "**Monitor queue depth.** A rising queue is the earliest signal that you are under-provisioned, and it rises long before latency does.",
   "**Have a dead letter queue.** Tasks that fail permanently must go somewhere a human will look, not vanish."
  ] },

  { h: "Which store for what" },
  { tbl: { t: "The pieces of a typical AI service",
    h: ["Need", "Use", "Why"],
    rows: [
     ["Users, documents, jobs, audit", "**Postgres**", "Transactions, constraints, joins. The default and it should be"],
     ["Vectors", "**pgvector**, until it hurts", "One fewer system. Move to Qdrant or similar past several million vectors"],
     ["Cache, queue, rate limits, locks", "**Redis**", "One dependency covering four needs"],
     ["Uploaded files, model artefacts", "**Object storage** (S3, GCS, R2)", "**Never the container filesystem** — it disappears on restart"],
     ["Logs, traces, metrics", "A managed observability service", "Do not build this yourself"]
    ] } },

  { n: "Resist adding stores. Every one is another thing to back up, monitor, upgrade, secure and reason about during an incident. Postgres plus Redis plus object storage covers an enormous amount of ground, and the discipline of staying there for as long as possible is a real engineering strength.",
    nt: "The architecture advice most worth following" },

  { tryit: { t: "Build the async ingestion path",
    task: "Add document upload to a service: POST returns 202 with a job id, a Redis-backed worker processes it with progress reporting, and a GET endpoint reports status. Then kill the worker mid-job and see what happens — is the job stuck, retried, or lost?",
    hint: "The kill test is the important one. Most first implementations leave the job stuck at *running* forever, with no way for the user or you to tell.",
    sol: { lang: "python", code: "# Make the failure visible: a heartbeat plus a stale check.\n\n@celery.task(bind=True, soft_time_limit=600, time_limit=660)\ndef ingest_document(self, doc_id):\n    try:\n        set_status(doc_id, 'running', worker=self.request.hostname)\n        for i, page in enumerate(pages):\n            embed_and_store(page)\n            if i % 10 == 0:\n                heartbeat(doc_id)          # updates last_seen_at\n        set_status(doc_id, 'done')\n    except SoftTimeLimitExceeded:\n        set_status(doc_id, 'failed', error='timed out')\n        raise\n\n# A sweeper, on a schedule:\n@celery.task\ndef reap_stale_jobs():\n    for j in jobs_running_with_no_heartbeat(minutes=5):\n        set_status(j.id, 'failed', error='worker died')\n        # and requeue if the task is idempotent" },
    w: "Without the heartbeat and the sweeper, a killed worker leaves a job at *running* forever — the user waits, support cannot explain it, and nothing alerts. This failure is invisible in development, where workers do not die, and routine in production, where they are killed by deploys, memory limits and node evictions constantly." } },

  { vocab: ["Connection Pool", "N+1 Query Problem", "Redis", "Cache Invalidation", "Message Queue", "Idempotency"] }
 ],
 k: [
  "Do the connection arithmetic — workers × pool × containers — before you scale, and use PgBouncer past about a hundred.",
  "The N+1 query is invisible in development; log SQL and assert on query counts in tests.",
  "Cache with `setex`, include tenant and version in the key, prefer short TTLs to clever invalidation.",
  "Anything over a few seconds returns 202 with a job id and a poll URL.",
  "Tasks must be idempotent and time-limited, with a heartbeat and a sweeper for dead workers."
 ],
 r: ["Redis", "Message Queue", "Caching", "Idempotency", "PostgreSQL", "Vector Database"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "create_engine(url, pool_size=10, pool_pre_ping=True)", w: "a pool that survives dropped connections" },
   { c: ".options(joinedload(Order.customer))", w: "one query instead of fifty-one" },
   { c: "await r.setex(key, ttl, json.dumps(value))", w: "cache with an atomic TTL" },
   { c: "return {'job_id': job.id, 'poll_url': f'/v1/jobs/{job.id}'}", w: "202 with a way to check progress" },
   { c: "@celery.task(max_retries=3, retry_backoff=True)", w: "retry transient failures, backing off" }
  ]
 }
}

]);
