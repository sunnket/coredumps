/* Backend & APIs — failure is the normal case. */
TD.addLessons("backend", [

{
 t: "Timeouts, Retries, Idempotency and Circuit Breakers",
 m: "reliable",
 lvl: "core",
 s: "How to depend on something slow, flaky and expensive without going down with it.",
 goal: [
  "Set timeouts and retries that help rather than amplify an outage",
  "Make an operation safe to retry with an idempotency key",
  "Fail gracefully instead of failing entirely"
 ],
 b: [
  { p: "Your AI service depends on a model provider you do not control. It will be slow, it will rate-limit you, and it will have outages. Reliability engineering is deciding in advance what happens then — because the default is that your service goes down whenever theirs does." },

  { h: "Timeouts" },
  { code: { lang: "python", t: "Every layer needs one, and they must be consistent",
    lines: [
     { c: "# Set them from the OUTSIDE IN, each smaller than the last:", w: "", hi: true },
     { c: "", w: "" },
     { c: "# 1. Client (browser / caller)     60s", w: "" },
     { c: "# 2. Load balancer                 55s", w: "" },
     { c: "# 3. Gunicorn --timeout            50s", w: "" },
     { c: "# 4. Your handler's own budget     45s", w: "" },
     { c: "# 5. Model API call                30s", w: "**Leaves 15s for retrieval, reranking and overhead.**" },
     { c: "# 6. Database query                 5s", w: "" },
     { c: "", w: "" },
     { c: "# If any inner timeout exceeds an outer one, the outer", w: "" },
     { c: "# layer kills the request first -- and you get no error", w: "" },
     { c: "# from the inner call, no log line, and no idea why.", w: "**A mismatched timeout ladder produces the most confusing class of production bug there is.**", hi: true }
    ] } },

  { n: "Write the ladder down somewhere visible. It is a small piece of documentation that prevents a category of incident where each layer is individually reasonable and the combination is not — and it is one of the first things a good reviewer asks about.",
    nt: "Worth a comment block in your config" },

  { h: "Retries that do not make it worse" },
  { code: { lang: "python", t: "Exponential backoff with jitter",
    lines: [
     { c: "import random, asyncio", w: "" },
     { c: "", w: "" },
     { c: "RETRYABLE = {408, 429, 500, 502, 503, 504, 529}", w: "**Only retry what might succeed next time.** A 400 or 422 will fail identically forever.", hi: true },
     { c: "", w: "" },
     { c: "async def call_with_retry(fn, attempts=4, base=0.5, cap=20.0):", w: "" },
     { c: "    for i in range(attempts):", w: "" },
     { c: "        try:", w: "" },
     { c: "            return await fn()", w: "" },
     { c: "        except HTTPError as e:", w: "" },
     { c: "            if e.status not in RETRYABLE or i == attempts - 1:", w: "" },
     { c: "                raise", w: "**Give up honestly.**" },
     { c: "", w: "" },
     { c: "            if ra := e.headers.get('retry-after'):", w: "**If the server told you how long to wait, obey it.** Ignoring `Retry-After` is how you get rate-limited harder.", hi: true },
     { c: "                delay = float(ra)", w: "" },
     { c: "            else:", w: "" },
     { c: "                delay = min(cap, base * 2**i)", w: "**Exponential: 0.5, 1, 2, 4…**" },
     { c: "                delay *= 0.5 + random.random()", w: "**Jitter.** Without it, a thousand clients that failed together retry together and re-create the outage on a schedule.", hi: true },
     { c: "", w: "" },
     { c: "            await asyncio.sleep(delay)", w: "" }
    ] } },

  { trap: "Retrying without backoff turns a brief blip into a sustained outage. Every client hammers the recovering service in unison, it falls over again, and the cycle repeats — a *retry storm*. This is a genuinely common cause of extended incidents, and the fix is three lines. Jitter is not an optimisation; it is what breaks the synchronisation." },

  { l: [
   "**Do not retry inside a retry.** Two layers of three attempts is nine requests, and neither layer knows about the other. Retry at exactly one level and document which.",
   "**Cap total time, not just attempts.** Four retries with backoff can exceed your request budget entirely.",
   "**Never retry a non-idempotent write** without an idempotency key. That is the next section, and it is where money gets charged twice."
  ] },

  { h: "Idempotency" },
  { p: "A POST that creates something is unsafe to retry: the request may have succeeded and the *response* been lost, so a retry creates a second one. An **idempotency key** makes the retry safe." },

  { code: { lang: "python", t: "Server-side idempotency, done properly",
    lines: [
     { c: "@app.post('/v1/refunds')", w: "" },
     { c: "async def create_refund(body: RefundIn,", w: "" },
     { c: "                        idempotency_key: str = Header(...)):", w: "**Required.** For anything that moves money, make the client supply one.", hi: true },
     { c: "", w: "" },
     { c: "    k = f'idem:{idempotency_key}'", w: "" },
     { c: "", w: "" },
     { c: "    if cached := await r.get(k):", w: "" },
     { c: "        return json.loads(cached)", w: "**Same key seen before — return the same response**, and do not do the work again." },
     { c: "", w: "" },
     { c: "    if not await r.set(k, '__processing__', nx=True, ex=86400):", w: "**`nx=True` sets only if absent — an atomic lock.** Without it, two simultaneous retries both pass the check above and both issue a refund.", hi: true },
     { c: "        raise HTTPException(409, 'request already in progress')", w: "" },
     { c: "", w: "" },
     { c: "    try:", w: "" },
     { c: "        result = await issue_refund(body)", w: "" },
     { c: "        await r.setex(k, 86400, json.dumps(result))", w: "**Store the response** so a later retry gets the same answer." },
     { c: "        return result", w: "" },
     { c: "    except Exception:", w: "" },
     { c: "        await r.delete(k)", w: "**Release the lock on failure**, or a genuine retry is blocked for 24 hours.", hi: true },
     { c: "        raise", w: "" }
    ] } },

  { l: [
   "**The client generates the key**, once per logical operation, and reuses it across retries. A key generated per attempt defeats the entire mechanism.",
   "**A UUID per user action** is the standard approach.",
   "**Keep keys for 24 hours or so.** Long enough for any realistic retry, short enough not to accumulate forever.",
   "**Apply it to anything with an external effect**: payments, emails, third-party calls, and any operation a user would be upset to see happen twice."
  ] },

  { h: "Circuit breakers" },
  { p: "When a dependency is clearly down, continuing to call it wastes your capacity and slows every request to a timeout. A **circuit breaker** notices and stops trying for a while." },

  { code: { lang: "python", t: "The three states",
    lines: [
     { c: "class CircuitBreaker:", w: "" },
     { c: "    def __init__(self, threshold=5, recovery=30):", w: "" },
     { c: "        self.fails, self.opened_at = 0, None", w: "" },
     { c: "        self.threshold, self.recovery = threshold, recovery", w: "" },
     { c: "", w: "" },
     { c: "    async def call(self, fn):", w: "" },
     { c: "        if self.opened_at:", w: "" },
     { c: "            if time.time() - self.opened_at < self.recovery:", w: "" },
     { c: "                raise CircuitOpen()", w: "**OPEN — fail immediately.** No timeout wait, no wasted capacity.", hi: true },
     { c: "            self.opened_at = None", w: "**HALF-OPEN — let one through and see.**" },
     { c: "", w: "" },
     { c: "        try:", w: "" },
     { c: "            result = await fn()", w: "" },
     { c: "            self.fails = 0", w: "**CLOSED again.**" },
     { c: "            return result", w: "" },
     { c: "        except Exception:", w: "" },
     { c: "            self.fails += 1", w: "" },
     { c: "            if self.fails >= self.threshold:", w: "" },
     { c: "                self.opened_at = time.time()", w: "" },
     { c: "                log.error('circuit opened for %s', fn.__name__)", w: "**Alert on this.** An opening circuit is a genuine incident signal." },
     { c: "            raise", w: "" }
    ],
    after: "Failing in 1ms instead of waiting 30 seconds for a timeout is the point. It keeps your workers free, your queue short, and your fallback path fast — so users get a degraded answer immediately rather than an error eventually." } },

  { h: "Degrade rather than fail" },
  { code: { lang: "python", t: "A ladder of fallbacks",
    lines: [
     { c: "async def answer(question, user):", w: "" },
     { c: "    try:", w: "" },
     { c: "        return await primary_model(question)", w: "**Best answer.**" },
     { c: "    except (CircuitOpen, Timeout):", w: "" },
     { c: "        pass", w: "" },
     { c: "", w: "" },
     { c: "    try:", w: "" },
     { c: "        return await fallback_model(question)", w: "**A second provider, or a smaller model.** Worse, and far better than nothing.", hi: true },
     { c: "    except Exception:", w: "" },
     { c: "        pass", w: "" },
     { c: "", w: "" },
     { c: "    if cached := await stale_cache(question):", w: "" },
     { c: "        return {**cached, 'stale': True}", w: "**A stale answer, clearly labelled.** Often exactly what the user wanted." },
     { c: "", w: "" },
     { c: "    return {'error': 'unavailable',", w: "" },
     { c: "            'message': 'AI answers are temporarily unavailable. '", w: "" },
     { c: "                       'Search results are still available below.',", w: "**Tell them what still works.** A useful error is a product feature.", hi: true },
     { c: "            'retry_after': 30}", w: "" }
    ] } },

  { p: "Decide the degradation ladder before the incident. During one, under pressure, at an unhelpful hour, is a poor time to be designing fallback behaviour." },

  { h: "Rate limiting, inbound" },
  { code: { lang: "python", t: "A token bucket in Redis",
    lines: [
     { c: "async def allow(user_id, limit=60, window=60):", w: "**60 requests per minute per user.**" },
     { c: "    k = f'rate:{user_id}:{int(time.time() // window)}'", w: "**A fixed window keyed by time bucket.** Simple; allows a burst at the boundary. A sliding window is more correct and more complex." },
     { c: "    n = await r.incr(k)", w: "**Atomic**, so concurrent requests count correctly." },
     { c: "    if n == 1:", w: "" },
     { c: "        await r.expire(k, window * 2)", w: "" },
     { c: "    return n <= limit", w: "" },
     { c: "", w: "" },
     { c: "if not await allow(user.id):", w: "" },
     { c: "    raise HTTPException(429, headers={'Retry-After': '60'})", w: "**Always send `Retry-After` with a 429.** It is what lets well-behaved clients back off correctly.", hi: true }
    ] } },

  { n: "Rate limit by user or API key, not by IP — corporate networks and mobile carriers share IPs among thousands of people. Set different limits for expensive endpoints: a hundred cheap lookups a minute is fine, a hundred model calls a minute from one user probably is not.",
    nt: "The detail that catches people" },

  { h: "Health checks that mean something" },
  { code: { lang: "python", t: "Three endpoints, three questions",
    lines: [
     { c: "@app.get('/health')", w: "**Liveness: is the process alive?** Must be trivial — no dependencies, no database.", hi: true },
     { c: "def health(): return {'status': 'ok'}", w: "**If this checks the database, a database blip restarts every container.** A very common and very damaging mistake." },
     { c: "", w: "" },
     { c: "@app.get('/ready')", w: "**Readiness: should traffic be sent here?**", hi: true },
     { c: "async def ready():", w: "" },
     { c: "    checks = {'db': await ping_db(), 'redis': await ping_redis(),", w: "" },
     { c: "              'model': ml.get('model') is not None}", w: "**A model still loading is not ready — and must not be restarted.**" },
     { c: "    ok = all(checks.values())", w: "" },
     { c: "    return JSONResponse(200 if ok else 503, {'checks': checks})", w: "" },
     { c: "", w: "" },
     { c: "@app.get('/startup')", w: "**Startup: has it finished booting?** For slow starts — a large model can take minutes." },
     { c: "def startup(): return {'ready': ml.get('model') is not None}", w: "" }
    ] } },

  { tryit: { t: "Break your dependency on purpose",
    task: "Point your service at a fake model API you control. Make it: return 429 for 30 seconds; then hang for 60 seconds; then return 500s. For each, record what your service does — does it retry sensibly, fall back, or fall over?",
    hint: "A small FastAPI app as the fake provider gives you complete control over the failure modes, which is far better than waiting for a real outage.",
    sol: { lang: "python", code: "# fake_provider.py -- misbehave on demand\nfrom fastapi import FastAPI, Response\nimport asyncio, time\n\napp = FastAPI()\nMODE = {'mode': 'ok'}\n\n@app.post('/set/{mode}')\ndef set_mode(mode: str):\n    MODE['mode'] = mode          # ok | ratelimit | hang | error\n    return MODE\n\n@app.post('/v1/complete')\nasync def complete():\n    m = MODE['mode']\n    if m == 'ratelimit':\n        return Response(status_code=429, headers={'Retry-After': '5'})\n    if m == 'hang':\n        await asyncio.sleep(120)\n    if m == 'error':\n        return Response(status_code=503)\n    return {'text': 'ok'}\n\n# Then run load against YOUR service and check:\n#   ratelimit -> do you honour Retry-After, or hammer it?\n#   hang      -> does your timeout fire, or do workers pile up?\n#   error     -> does the circuit open, or do you retry forever?" },
    w: "Almost every service fails at least one of these the first time. The `hang` case is usually the worst: without a read timeout, workers accumulate until the pool is exhausted and the service stops responding to *everything*, including healthy endpoints. Finding that in a controlled test on a Tuesday afternoon is considerably better than finding it during a provider incident." } },

  { vocab: ["Timeout", "Exponential Backoff", "Idempotency", "Circuit Breaker", "Rate Limiting", "Graceful Degradation"] }
 ],
 k: [
  "Set timeouts outside-in, each inner one smaller — a mismatched ladder produces silent, confusing failures.",
  "Retry only retryable statuses, with exponential backoff and jitter, and honour `Retry-After`.",
  "Idempotency keys make writes safe to retry; the lock must be atomic and released on failure.",
  "A circuit breaker fails in 1ms instead of waiting 30 seconds, keeping capacity free for the fallback.",
  "Liveness must not check dependencies, or one database blip restarts every container you have."
 ],
 r: ["Idempotency", "Rate Limiting", "Circuit Breaker", "HTTP", "Observability"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "delay = min(cap, base * 2**i) * (0.5 + random.random())", w: "exponential backoff with jitter" },
   { c: "await r.set(k, '__processing__', nx=True, ex=86400)", w: "an atomic idempotency lock" },
   { c: "if e.status not in RETRYABLE: raise", w: "never retry what cannot succeed" },
   { c: "raise HTTPException(429, headers={'Retry-After': '60'})", w: "rate limit, and say how long to wait" },
   { c: "@app.get('/health') def health(): return {'status':'ok'}", w: "liveness with no dependencies" }
  ]
 }
},

{
 t: "Auth, Secrets and the Mistakes That Leak Data",
 m: "secure",
 lvl: "core",
 s: "API keys, tokens, CORS and the handful of controls that prevent most incidents.",
 goal: [
  "Authenticate service and user callers appropriately",
  "Handle secrets so they never reach a repository or a log",
  "Configure CORS without disabling it"
 ],
 b: [
  { p: "You do not need to be a security specialist to avoid the incidents that actually happen. A small number of controls prevent the large majority of real breaches in services like yours." },

  { h: "Two kinds of caller" },
  { tbl: { t: "Authenticate them differently",
    h: ["", "API key", "JWT / session token"],
    rows: [
     ["**Who**", "Another service, a script, a partner", "A logged-in human"],
     ["**Lifetime**", "Long-lived until revoked", "**Short — minutes to hours**"],
     ["**Carries**", "Nothing. It is a lookup key", "Claims: user id, roles, expiry"],
     ["**Revocation**", "Delete the row. Immediate", "**Hard** — a valid token stays valid until it expires. Hence short lifetimes plus refresh"],
     ["**Storage**", "**Hash it like a password**", "Not stored server-side; verified by signature"]
    ] } },

  { code: { lang: "python", t: "API keys, stored safely",
    lines: [
     { c: "import secrets, hashlib", w: "" },
     { c: "", w: "" },
     { c: "def create_key(user_id):", w: "" },
     { c: "    raw = 'sk_live_' + secrets.token_urlsafe(32)", w: "**`secrets`, never `random`.** `random` is predictable and has been the root of real key-guessing incidents.", hi: true },
     { c: "    db.insert(", w: "" },
     { c: "        user_id=user_id,", w: "" },
     { c: "        key_hash=hashlib.sha256(raw.encode()).hexdigest(),", w: "**Store the hash.** If your database leaks, the keys are not usable.", hi: true },
     { c: "        prefix=raw[:12],", w: "**A prefix so the user can identify it in a list** without you storing the key." },
     { c: "        created_at=now())", w: "" },
     { c: "    return raw", w: "**Shown exactly once, at creation.** You cannot recover it, and that is the point." },
     { c: "", w: "" },
     { c: "def verify(raw):", w: "" },
     { c: "    h = hashlib.sha256(raw.encode()).hexdigest()", w: "" },
     { c: "    return db.find_one(key_hash=h, revoked_at=None)", w: "**Indexed lookup on the hash.**" }
    ] } },

  { h: "Secrets" },
  { code: { lang: "python", t: "The rules, and what each prevents",
    lines: [
     { c: "# NEVER in code:", w: "" },
     { c: "API_KEY = 'sk-ant-abc123...'", w: "**Git remembers forever.** Deleting it in a later commit does not remove it from history — the key must be rotated.", hi: true },
     { c: "", w: "" },
     { c: "# From the environment:", w: "" },
     { c: "api_key: str = Field(...)", w: "**Required in Settings, no default.** The app refuses to start without it." },
     { c: "", w: "" },
     { c: "# .gitignore, before the first commit:", w: "" },
     { c: "#   .env", w: "" },
     { c: "#   *.pem", w: "" },
     { c: "#   secrets/", w: "" },
     { c: "", w: "" },
     { c: "# And never in logs:", w: "" },
     { c: "log.info('calling api', extra={'headers': headers})", w: "**This logs the Authorization header.** Log aggregators are widely accessible inside a company and retained for months.", hi: true },
     { c: "log.info('calling api', extra={'url': url})", w: "**And this logs a key in the query string, if one is there.** Which is a further reason not to put keys in URLs." }
    ] } },

  { l: [
   "**Run a secret scanner in CI** — gitleaks or similar. It catches the commit before it is pushed, which is the only cheap moment.",
   "**Assume a committed secret is compromised** and rotate it. Public repositories are scraped for keys within minutes, and this is automated at scale.",
   "**Use a secret manager in production** — AWS Secrets Manager, GCP Secret Manager, Vault. Environment variables are fine for small deployments and visible to anyone who can read a process listing.",
   "**Rotate on a schedule**, and make sure rotation is a routine you have practised rather than an emergency procedure."
  ] },

  { h: "CORS" },
  { p: "The browser blocks a page on one origin from reading a response from another. CORS is the server saying which origins are permitted — and it is the single most commonly disabled security control in web development." },

  { code: { lang: "python", t: "Right and wrong",
    lines: [
     { c: "# WRONG -- and extremely common", w: "" },
     { c: "app.add_middleware(CORSMiddleware,", w: "" },
     { c: "    allow_origins=['*'], allow_credentials=True)", w: "**Any website can make authenticated requests as your logged-in users.** Browsers reject this exact combination, and people then reach for a proxy to defeat it.", hi: true },
     { c: "", w: "" },
     { c: "# RIGHT", w: "" },
     { c: "app.add_middleware(CORSMiddleware,", w: "" },
     { c: "    allow_origins=settings.allowed_origins,", w: "**An explicit list**, from configuration, different per environment." },
     { c: "    allow_credentials=True,", w: "" },
     { c: "    allow_methods=['GET', 'POST'],", w: "**Only what you use.**" },
     { c: "    allow_headers=['Authorization', 'Content-Type'],", w: "" },
     { c: "    max_age=3600)", w: "**Cache the preflight**, so the browser stops sending OPTIONS before every request." }
    ] } },

  { n: "CORS is a browser mechanism. It does not protect against `curl`, a script or a server — those ignore it entirely. It stops *other websites* using a visitor's credentials against your API, which is a real and specific threat, and it is not a substitute for authentication or authorisation.",
    nt: "What CORS is and is not for" },

  { h: "Input validation as a security control" },
  { code: { lang: "python", t: "Limits are defence",
    lines: [
     { c: "class Query(BaseModel):", w: "" },
     { c: "    question: str = Field(max_length=2000)", w: "**Caps what an attacker can send** — and caps your token cost.", hi: true },
     { c: "    top_k: int = Field(ge=1, le=50)", w: "**Prevents `top_k=1000000` exhausting memory.**" },
     { c: "", w: "" },
     { c: "# request body size, at the server:", w: "" },
     { c: "# uvicorn --limit-max-request-size, or at the proxy", w: "**Otherwise a 2GB body is an easy denial of service.**" },
     { c: "", w: "" },
     { c: "# SQL: parameterised, always", w: "" },
     { c: "db.execute(text('SELECT * FROM docs WHERE id = :id'), {'id': doc_id})", w: "**Never f-strings into SQL.** The ORM does this correctly; raw queries are where injection appears.", hi: true },
     { c: "", w: "" },
     { c: "# file uploads:", w: "" },
     { c: "#   check content type AND magic bytes, not the extension", w: "" },
     { c: "#   generate your own filename -- never trust theirs", w: "**`../../etc/passwd` is a real filename an attacker will send.**" },
     { c: "#   store in object storage, outside the web root", w: "" }
    ] } },

  { h: "The checklist" },
  { ol: [
   "**HTTPS everywhere**, with HSTS. Free via Let's Encrypt; there is no remaining excuse.",
   "**Authenticate every endpoint** except health and genuinely public ones. Default to closed.",
   "**Authorise per resource** — authentication tells you who, authorisation decides what. Checking only the first is how one customer reads another's data.",
   "**Rate limit by key**, with tighter limits on expensive endpoints.",
   "**Validate and bound every input**, including body size.",
   "**Never log secrets or PII**; redact before the log call.",
   "**Keep dependencies patched** — Dependabot or equivalent, enabled and actually read.",
   "**Return generic errors** to clients and detailed ones to your logs."
  ] },

  { trap: "The most common real breach in services like these is not a clever exploit. It is an endpoint that authenticates the caller and then forgets to check whether *this* caller owns *that* resource — `GET /documents/{id}` returning any document to any logged-in user. Every resource lookup must filter by the caller's identity, in the query, not after it." },

  { tryit: { t: "Audit your own service",
    task: "For a service you have built, check: every endpoint's auth requirement, whether resource lookups filter by owner, whether any secret appears in code or logs, your CORS configuration, and whether request size is bounded. Then try to access another user's data with a valid token for a different account.",
    hint: "The other-user test is the one that finds real bugs. Create two accounts and try to read account A's data with account B's token.",
    sol: { lang: "python", code: "# tests/test_authz.py -- keep this test forever\n\ndef test_cannot_read_another_users_document(client, user_a, user_b):\n    doc = create_document(owner=user_a)\n\n    r = client.get(f'/v1/documents/{doc.id}',\n                   headers={'Authorization': f'Bearer {user_b.token}'})\n\n    assert r.status_code in (403, 404)\n    assert 'content' not in r.json()\n\ndef test_cannot_list_another_users_documents(client, user_a, user_b):\n    create_document(owner=user_a)\n    r = client.get('/v1/documents',\n                   headers={'Authorization': f'Bearer {user_b.token}'})\n    assert r.json()['data'] == []\n\n# The fix, if either fails -- filter in the QUERY:\n#   db.query(Document).filter(\n#       Document.id == doc_id,\n#       Document.owner_id == current_user.id).first()\n# not:\n#   doc = db.get(Document, doc_id)   # then check ownership after" },
    w: "Write these two tests for every resource you expose, and write them early. Broken object-level authorisation is consistently near the top of the OWASP list because it is easy to introduce, invisible in normal use, and catastrophic when found by someone else. A test that fails loudly is worth far more than a rule you intend to remember." } },

  { vocab: ["Authentication", "Authorisation", "JWT", "CORS", "SQL Injection", "Secrets Management"] }
 ],
 k: [
  "API keys for services, short-lived tokens for humans; hash keys before storing them.",
  "Secrets never in code or logs — a committed secret is compromised and must be rotated, not deleted.",
  "`allow_origins=['*']` with credentials is the wrong CORS configuration, and CORS protects browsers only.",
  "Bound every input including body size, and parameterise every SQL query.",
  "Filter resource lookups by the caller's identity in the query — broken object-level authorisation is the commonest real breach."
 ],
 r: ["Authentication", "Authorisation", "JWT", "CORS", "SQL Injection", "HTTP"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "secrets.token_urlsafe(32)", w: "generate a key with a cryptographic source" },
   { c: "hashlib.sha256(raw.encode()).hexdigest()", w: "store the hash, never the key" },
   { c: "allow_origins=settings.allowed_origins", w: "an explicit CORS list, not a wildcard" },
   { c: "text('SELECT * FROM docs WHERE id = :id'), {'id': doc_id}", w: "parameterised SQL, always" },
   { c: ".filter(Document.owner_id == current_user.id)", w: "authorisation in the query, not after it" }
  ]
 }
}

]);
