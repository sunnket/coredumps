/* Backend & APIs — concurrency and async. */
TD.addLessons("backend", [

{
 t: "Blocking Versus Waiting",
 m: "async",
 lvl: "core",
 s: "Why async matters enormously for AI services, and the one mistake that undoes all of it.",
 goal: [
  "Explain the difference between waiting on I/O and doing CPU work",
  "Choose correctly between `def` and `async def` in FastAPI",
  "Avoid the blocking call that freezes the entire event loop"
 ],
 b: [
  { p: "Your AI service spends most of its life waiting — on a model API, a database, a vector store. Concurrency is about what happens during that wait, and getting it wrong is the difference between serving 10 concurrent users and 1,000 on the same hardware." },

  { h: "The distinction that decides everything" },
  { tbl: { t: "Two kinds of slow",
    h: ["", "I/O-bound", "CPU-bound"],
    rows: [
     ["**Doing what**", "Waiting for a network, disk or database", "Computing — parsing, embedding, encryption"],
     ["**The CPU is**", "**Idle**", "**Busy**"],
     ["**Examples in your service**", "Model API call, DB query, vector search, HTTP request", "Tokenising, running a local model, JSON parsing a large body"],
     ["**Fixed by**", "**async**, so the CPU serves other requests during the wait", "**More processes or a worker**, because there is no idle time to reclaim"]
    ] } },

  { ana: "A waiter in a restaurant. Waiting for the kitchen is I/O — a good waiter takes other tables' orders during it. Chopping the vegetables themselves is CPU-bound; no amount of attentiveness makes it faster, and while they chop nobody else gets served. Async makes your waiter efficient. It does nothing about the chopping, and a waiter who starts chopping stops serving everyone.",
    at: "The waiter and the kitchen" },

  { h: "What async actually does" },
  { code: { lang: "python", t: "Three model calls, two ways",
    lines: [
     { c: "import asyncio, time", w: "" },
     { c: "", w: "" },
     { c: "# SEQUENTIAL", w: "" },
     { c: "def sync_version():", w: "" },
     { c: "    a = call_model(q1)   # 2s", w: "" },
     { c: "    b = call_model(q2)   # 2s", w: "" },
     { c: "    c = call_model(q3)   # 2s", w: "**6 seconds. The CPU was idle for essentially all of it.**", hi: true },
     { c: "    return a, b, c", w: "" },
     { c: "", w: "" },
     { c: "# CONCURRENT", w: "" },
     { c: "async def async_version():", w: "" },
     { c: "    return await asyncio.gather(", w: "**All three start immediately.**" },
     { c: "        call_model_async(q1),", w: "" },
     { c: "        call_model_async(q2),", w: "" },
     { c: "        call_model_async(q3),", w: "**About 2 seconds** — the time of the slowest, not the sum.", hi: true },
     { c: "    )", w: "" }
    ],
    after: "Nothing got faster. The waiting overlapped. That distinction is the whole of async, and it is why it helps a service that calls three APIs and does nothing at all for a service that computes." } },

  { h: "The one mistake that undoes everything" },
  { p: "There is a single event loop per worker process. A blocking call inside an `async def` freezes it — not just that request, **every** request that worker is handling." },

  { vs: { t: "The bug and the fix", lang: "python",
    bad: { c: "@app.post('/predict')\nasync def predict(body: In):\n    r = requests.post(URL, json=...)\n    # `requests` is SYNCHRONOUS.\n    # The event loop is now frozen\n    # for 2 seconds. Every other\n    # request on this worker waits.\n    return r.json()", label: "Blocking inside async",
      w: "Throughput collapses to sequential, and it looks like a mysterious latency problem rather than a bug. This is the most common async mistake in Python, by a wide margin." },
    good: { c: "@app.post('/predict')\nasync def predict(body: In):\n    r = await http.post(URL, json=...)\n    # httpx.AsyncClient, awaited.\n    # The loop is free to serve\n    # other requests while this\n    # one waits.\n    return r.json()", label: "Async all the way down",
      w: "`async` is only useful if every I/O call in the path is awaitable. One synchronous library anywhere in the chain and you have paid the complexity cost for nothing." } } },

  { trap: "This bug produces no error, no warning and no obvious symptom. The service works perfectly under one user and degrades badly under load, in a way that looks like the model API being slow. The test is simple: send 20 concurrent requests. If total time is roughly 20× a single request, something in the path is blocking." },

  { h: "FastAPI's rule" },
  { code: { lang: "python", t: "def or async def — and FastAPI handles both correctly",
    lines: [
     { c: "@app.get('/a')", w: "" },
     { c: "async def a():", w: "**`async def`: runs on the event loop.**" },
     { c: "    return await db.fetch(...)", w: "**Everything inside must be awaitable.** One `time.sleep` or `requests.get` here freezes the worker.", hi: true },
     { c: "", w: "" },
     { c: "@app.get('/b')", w: "" },
     { c: "def b():", w: "**Plain `def`: FastAPI runs it in a thread pool automatically.**" },
     { c: "    return sync_db.query(...)", w: "**Blocking here is fine** — it blocks one thread, not the loop.", hi: true },
     { c: "", w: "" },
     { c: "# The rule:", w: "" },
     { c: "#   async libraries available  -> async def", w: "" },
     { c: "#   only sync libraries        -> plain def", w: "" },
     { c: "#   NEVER sync calls in async def", w: "**The only combination that is actually wrong.**", hi: true }
    ] } },

  { n: "If you are unsure, use plain `def`. FastAPI's thread pool handles it correctly, and a thread-pool endpoint that works is better than an async one that quietly serialises. Move to `async def` when you have measured that you need the concurrency and every library in the path supports it.",
    nt: "The safe default" },

  { h: "CPU work in an async service" },
  { code: { lang: "python", t: "Get it off the event loop",
    lines: [
     { c: "from concurrent.futures import ProcessPoolExecutor", w: "" },
     { c: "import asyncio", w: "" },
     { c: "", w: "" },
     { c: "pool = ProcessPoolExecutor(max_workers=4)", w: "**Processes, not threads, for CPU work** — Python's GIL means threads do not give you parallel CPU.", hi: true },
     { c: "", w: "" },
     { c: "@app.post('/embed')", w: "" },
     { c: "async def embed(body: In):", w: "" },
     { c: "    loop = asyncio.get_running_loop()", w: "" },
     { c: "    vecs = await loop.run_in_executor(pool, encode, body.texts)", w: "**Hands the work to another process and awaits it**, so the loop keeps serving.", hi: true },
     { c: "    return {'vectors': vecs}", w: "" }
    ],
    after: "For anything heavier than a few hundred milliseconds, prefer a background queue over an executor. Holding an HTTP connection open for a thirty-second job wastes a connection and gives the user nothing to look at." } },

  { h: "Timeouts, which are not optional" },
  { code: { lang: "python", t: "Every external call needs one",
    lines: [
     { c: "import httpx", w: "" },
     { c: "", w: "" },
     { c: "http = httpx.AsyncClient(", w: "" },
     { c: "    timeout=httpx.Timeout(", w: "" },
     { c: "        connect=3.0,", w: "**Getting a connection.** Should be fast; if not, the host is unreachable." },
     { c: "        read=30.0,", w: "**Waiting for the response.** Generous for a model call, and still bounded.", hi: true },
     { c: "        write=5.0, pool=5.0),", w: "**`pool` is waiting for a free connection** from the pool — the timeout everyone forgets, and the one that matters under load." },
     { c: "    limits=httpx.Limits(max_connections=100,", w: "**Cap the pool.** Unbounded connections exhaust file descriptors and take the process down." },
     { c: "                        max_keepalive_connections=20),", w: "" },
     { c: ")", w: "" }
    ] } },

  { p: "A call with no timeout waits forever. Under a provider slowdown, requests pile up, connections are exhausted, and your service goes down because of someone else's outage. The default in most libraries is *no timeout*, which is the wrong default and has caused a great many incidents." },

  { code: { lang: "python", t: "Bounding total work with a semaphore",
    lines: [
     { c: "sem = asyncio.Semaphore(20)", w: "**At most 20 in-flight model calls per worker.**", hi: true },
     { c: "", w: "" },
     { c: "async def call_model(prompt):", w: "" },
     { c: "    async with sem:", w: "**Queue beyond 20 rather than firing them all.**" },
     { c: "        return await http.post(MODEL_URL, json={'prompt': prompt})", w: "" },
     { c: "", w: "" },
     { c: "# Without this, 500 concurrent requests means 500", w: "" },
     { c: "# simultaneous calls -- you rate-limit yourself,", w: "" },
     { c: "# exhaust the pool, and get 429s from the provider.", w: "**Backpressure is your responsibility**, not the provider's.", hi: true }
    ] } },

  { h: "Running it in production" },
  { code: { lang: "bash",
    lines: [
     { c: "uvicorn app.main:app --reload", w: "**Development only.**" },
     { c: "", w: "" },
     { c: "gunicorn app.main:app \\", w: "" },
     { c: "  -k uvicorn.workers.UvicornWorker \\", w: "**Uvicorn workers under gunicorn** — the standard production setup." },
     { c: "  -w 4 \\", w: "**Roughly 2 × CPU cores** for an I/O-heavy service. Each worker is a separate process with its own event loop.", hi: true },
     { c: "  -b 0.0.0.0:8000 \\", w: "**Not 127.0.0.1**, or nothing outside the container can reach it. A very common first-deploy confusion." },
     { c: "  --timeout 120 \\", w: "**Longer than your slowest endpoint**, or gunicorn kills workers mid-request." },
     { c: "  --graceful-timeout 30", w: "**Let in-flight requests finish on shutdown.** Without it, every deploy drops live requests." }
    ] } },

  { trap: "Each worker is a separate process, so anything held in module-level state is per-worker. An in-memory cache, a rate limit counter or a request counter will be wrong by a factor of the worker count — and it will look correct in local development, where you ran one worker. Shared state belongs in Redis." },

  { tryit: { t: "Prove the blocking bug to yourself",
    task: "Build two endpoints: one `async def` that calls `time.sleep(2)`, one `async def` that calls `await asyncio.sleep(2)`. Fire 10 concurrent requests at each and compare total time.",
    hint: "`ab -n 10 -c 10` or a small asyncio client. The difference is roughly 20 seconds against roughly 2.",
    sol: { lang: "python", code: "import time, asyncio\nfrom fastapi import FastAPI\n\napp = FastAPI()\n\n@app.get('/blocking')\nasync def blocking():\n    time.sleep(2)              # freezes the whole event loop\n    return {'ok': True}\n\n@app.get('/awaiting')\nasync def awaiting():\n    await asyncio.sleep(2)     # yields control back to the loop\n    return {'ok': True}\n\n@app.get('/threaded')\ndef threaded():\n    time.sleep(2)              # plain def -> thread pool, also fine\n    return {'ok': True}\n\n# client:\n#   import httpx, asyncio, time\n#   async def hit(path, n=10):\n#       async with httpx.AsyncClient(timeout=60) as c:\n#           t0 = time.perf_counter()\n#           await asyncio.gather(*[c.get(f'http://localhost:8000{path}')\n#                                  for _ in range(n)])\n#           print(path, f'{time.perf_counter()-t0:.1f}s')\n#\n# /blocking  ~20.1s   <- fully serialised\n# /awaiting   ~2.1s\n# /threaded   ~2.1s" },
    w: "Twenty seconds against two, from one wrong function call. In a real service the blocking call is not `time.sleep` — it is `requests.get`, or a synchronous database driver, or a library that opens a file. Same effect, much harder to spot, which is why the load test is the diagnostic and reading the code usually is not." } },

  { vocab: ["Event Loop", "Concurrency"] }
 ],
 k: [
  "Async helps waiting, not computing — it overlaps I/O, it does not make anything faster.",
  "One synchronous call inside `async def` freezes the whole event loop for every request on that worker.",
  "If unsure, use plain `def` — FastAPI runs it in a thread pool and blocking there is harmless.",
  "Every external call needs a timeout, including the pool timeout, and a semaphore to bound concurrency.",
  "Each gunicorn worker is a separate process, so module-level state is per-worker and usually wrong."
 ],
 r: ["Concurrency", "HTTP", "Rate Limiting"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "await asyncio.gather(a(), b(), c())", w: "overlap independent waits" },
   { c: "await loop.run_in_executor(pool, cpu_work, arg)", w: "get CPU work off the event loop" },
   { c: "httpx.Timeout(connect=3, read=30, pool=5)", w: "every timeout, including the one people forget" },
   { c: "async with sem:", w: "bound in-flight calls so you do not rate-limit yourself" },
   { c: "gunicorn app:app -k uvicorn.workers.UvicornWorker -w 4", w: "the production run command" }
  ]
 }
}

]);
