/* Backend, MLOps and the Job Hunt — question banks.

   The hunt bank is unusual and deliberately so: it is the only one where the
   correct answer is about judgement rather than mechanism. Those questions are
   here because the track had no practice at all, and because a candidate who
   cannot articulate why a project counts will not be able to do it under
   pressure either. */

/* ===================================================================
   Backend
   =================================================================== */

TD.addMCQ("backend", "http", [
  {
    "tag": "Idempotent methods",
    "lvl": "intermediate",
    "q": "Why does it matter that PUT is idempotent and POST is not?",
    "o": [
      "PUT is faster because it can be cached",
      "A client that times out can safely retry a PUT, because repeating it has the same effect as doing it once — repeating a POST may create a second resource",
      "POST cannot carry a request body",
      "Only PUT can update existing records"
    ],
    "a": 1,
    "x": "Networks fail after the request arrives but before the response returns, so the client cannot distinguish success from failure and must retry. Idempotency is what makes that retry safe. For POST, the standard fix is a client-supplied idempotency key the server records and de-duplicates against — which is exactly how payment APIs work."
  },
  {
    "tag": "Status codes",
    "lvl": "core",
    "q": "A client sends valid credentials but requests a resource belonging to another user. Which status?",
    "o": [
      "401 Unauthorized",
      "403 Forbidden",
      "404 Not Found",
      "400 Bad Request"
    ],
    "a": 1,
    "x": "401 means 'I do not know who you are' — authentication failed or was absent. 403 means 'I know exactly who you are, and no'. The distinction matters operationally: retrying a 401 with fresh credentials may work, retrying a 403 with the same identity never will. Some APIs deliberately return 404 instead of 403 to avoid confirming that a resource exists."
  }
]);

TD.addMCQ("backend", "api", [
  {
    "tag": "Versioning",
    "lvl": "intermediate",
    "q": "Why version a public API rather than changing the response shape in place?",
    "o": [
      "Versioning improves performance through caching",
      "Existing clients depend on the current shape and cannot all be updated simultaneously — a removed or renamed field breaks them silently",
      "It is required by the HTTP specification",
      "Version numbers help search engines index the API"
    ],
    "a": 1,
    "x": "You control your server, not your clients. Adding a field is usually safe; removing or renaming one is not, because a client reading `user.name` gets undefined and often fails far from the cause. Versioning buys the ability to run both shapes during a migration window."
  },
  {
    "tag": "Pagination",
    "lvl": "advanced",
    "q": "Why is cursor pagination generally better than offset pagination for a large, actively-changing list?",
    "o": [
      "Cursors are shorter than offsets in the URL",
      "OFFSET requires the database to scan and discard every skipped row, and inserts shift rows between pages so items are duplicated or missed",
      "Offset pagination cannot be sorted",
      "Cursors allow random access to any page"
    ],
    "a": 1,
    "x": "Two separate problems. Performance: `OFFSET 100000` makes the database walk 100,000 rows before returning anything. Correctness: if a row is inserted while a user pages through, everything shifts by one and they see an item twice or never. A cursor anchored to the last seen row avoids both — at the cost of losing random page access."
  }
]);

TD.addMCQ("backend", "fastapi", [
  {
    "tag": "Types as the contract",
    "lvl": "intermediate",
    "q": "In FastAPI, what does declaring a Pydantic model as a request body parameter give you beyond documentation?",
    "o": [
      "Faster JSON parsing only",
      "Runtime validation and coercion at the boundary — malformed requests are rejected with a precise 422 before your handler runs",
      "Automatic database persistence",
      "Authentication of the request"
    ],
    "a": 1,
    "x": "This is the key difference from a bare type hint: Pydantic actually checks the incoming data at runtime, unlike static annotations that vanish. Your handler therefore only ever sees valid input, the error message names the offending field, and the OpenAPI schema is generated from the same declaration so it cannot drift."
  }
]);

TD.addMCQ("backend", "async", [
  {
    "tag": "Blocking the event loop",
    "lvl": "advanced",
    "q": "An `async def` endpoint calls a synchronous library that takes 2 seconds. What happens to the server?",
    "o": [
      "Only that request is slow; others are unaffected",
      "The entire event loop is blocked for 2 seconds, so every concurrent request stalls — the async keyword does not make blocking code non-blocking",
      "FastAPI automatically moves it to a thread",
      "The request times out immediately"
    ],
    "a": 1,
    "x": "`async` marks a function as awaitable; it does not make the code inside it yield. A blocking call inside a coroutine holds the single event loop thread and freezes the whole server. Run such work in a thread pool (`run_in_executor`, or FastAPI's plain `def` handlers, which it dispatches to a threadpool automatically)."
  }
]);

TD.addMCQ("backend", "data", [
  {
    "tag": "Connection pooling",
    "lvl": "intermediate",
    "q": "Why does a web service use a database connection pool rather than opening a connection per request?",
    "o": [
      "Pooled connections are encrypted",
      "Establishing a connection costs a network round trip and server-side setup; a pool reuses them and also caps how many the database must handle",
      "Pools automatically retry failed queries",
      "The database requires it"
    ],
    "a": 1,
    "x": "Two benefits: latency saved per request, and a ceiling on concurrent connections. That ceiling matters — databases have a hard connection limit, and an unpooled service under load exhausts it and takes down every other client too. Sizing the pool is a Little's Law problem: arrival rate times query duration."
  }
]);

TD.addMCQ("backend", "reliable", [
  {
    "tag": "Timeouts",
    "lvl": "intermediate",
    "q": "Why must every outbound call from a service have an explicit timeout?",
    "o": [
      "To comply with HTTP standards",
      "Library defaults are often minutes or absent, so a hung dependency ties up a worker for far longer than the user will wait — and enough of those exhaust the pool",
      "Timeouts improve throughput on healthy calls",
      "Without one the connection is never encrypted"
    ],
    "a": 1,
    "x": "The failure mode is cascading: one slow dependency occupies workers, the pool exhausts, and a service that does not even depend on it starts failing. An explicit, short timeout converts an indefinite hang into a fast, handleable error. This is also why circuit breakers exist — to stop calling something that is clearly down."
  }
]);

TD.addMCQ("backend", "secure", [
  {
    "tag": "Password storage",
    "lvl": "advanced",
    "q": "Why hash passwords with bcrypt or argon2 rather than SHA-256?",
    "o": [
      "SHA-256 produces collisions too easily",
      "SHA-256 is designed to be fast, which helps an attacker brute-force billions of guesses; password hashes are deliberately slow and salted",
      "SHA-256 output is too short to store",
      "bcrypt is reversible for account recovery"
    ],
    "a": 1,
    "x": "Speed is the vulnerability. A GPU computes billions of SHA-256 hashes per second, so a leaked table of fast hashes is cracked quickly. bcrypt and argon2 have a tunable work factor that keeps a single verification around 100ms — imperceptible to a user, ruinous to an attacker — and salt each hash so identical passwords do not match."
  },
  {
    "tag": "SQL injection",
    "lvl": "advanced",
    "q": "What actually prevents SQL injection?",
    "o": [
      "Escaping quotes in user input",
      "Parameterised queries, which send the SQL and the values separately so a value can never be parsed as SQL",
      "Validating that input contains no SQL keywords",
      "Using an ORM, which is immune by design"
    ],
    "a": 1,
    "x": "Escaping and keyword filtering are blacklists, and blacklists leak. Parameterisation is structural: the query is compiled first and values are bound afterwards, so there is no parsing step for an attacker to influence. ORMs help because they parameterise by default — but raw SQL passed through one is just as vulnerable."
  }
]);

/* ===================================================================
   MLOps
   =================================================================== */

TD.addMCQ("mlops", "tracking", [
  {
    "tag": "Why track experiments",
    "lvl": "core",
    "q": "What problem does experiment tracking solve that a spreadsheet does not?",
    "o": [
      "It trains models faster",
      "It records parameters, metrics, code version and artefacts together automatically, so a result three months old can actually be reproduced",
      "It replaces version control",
      "It removes the need for a validation set"
    ],
    "a": 1,
    "x": "The failure it prevents is specific: a model performs well, and nobody can reproduce it because the exact hyperparameters, data version and commit are not recorded together. Manual logging fails because it is skipped under pressure — exactly when the interesting runs happen."
  },
  {
    "tag": "What to log",
    "lvl": "intermediate",
    "q": "Beyond metrics and hyperparameters, what must be recorded for a training run to be reproducible?",
    "o": [
      "The wall-clock duration",
      "The code version, the data version, and the random seed — without all three the same parameters can still produce a different model",
      "The GPU temperature",
      "The name of the person who ran it"
    ],
    "a": 1,
    "x": "Parameters alone are not enough. A changed preprocessing step, a re-labelled dataset or an unseeded shuffle each produce different results from identical hyperparameters. Data versioning is the one people skip most often and the one that causes the most confusion later."
  }
]);

TD.addMCQ("mlops", "registry", [
  {
    "tag": "Model registry",
    "lvl": "intermediate",
    "q": "What does a model registry provide that storing model files in blob storage does not?",
    "o": [
      "Cheaper storage",
      "Versioning with stage transitions and lineage — which model is in production, what produced it, and a controlled path for promotion and rollback",
      "Automatic retraining",
      "Faster inference"
    ],
    "a": 1,
    "x": "A file in a bucket answers 'where is the model'. A registry answers 'which model is serving production right now, which run produced it, who approved it, and what do we roll back to' — questions you only discover you need during an incident."
  }
]);

TD.addMCQ("mlops", "orchestration", [
  {
    "tag": "Why a DAG",
    "lvl": "intermediate",
    "q": "Why express a training pipeline as a DAG rather than a script that runs steps in order?",
    "o": [
      "DAGs run faster",
      "Dependencies are explicit, so independent steps run in parallel and a failure can be retried from the failed step rather than from the beginning",
      "Scripts cannot be scheduled",
      "DAGs do not require error handling"
    ],
    "a": 1,
    "x": "The retry property is the practical one: a six-hour pipeline that fails at hour five should not restart from zero. Explicit dependencies also give you parallelism for free and a visual record of what actually depends on what — which a long script hides."
  }
]);

TD.addMCQ("mlops", "serving", [
  {
    "tag": "Batching at inference",
    "lvl": "advanced",
    "q": "Why does a model server batch incoming requests, given that batching adds latency to each one?",
    "o": [
      "Batching reduces model accuracy variance",
      "GPU throughput rises sharply with batch size, so a small wait to accumulate requests serves far more of them per second overall",
      "It is required by most inference frameworks",
      "It prevents memory fragmentation"
    ],
    "a": 1,
    "x": "This is the throughput-versus-latency trade-off made concrete. A GPU processing one request at a time is mostly idle; batching amortises the fixed overhead across many. Dynamic batching with a short deadline — wait up to 10ms or until the batch is full — captures most of the gain for little added latency."
  }
]);

TD.addMCQ("mlops", "monitoring", [
  {
    "tag": "Drift",
    "lvl": "advanced",
    "q": "What is the difference between data drift and concept drift?",
    "o": [
      "They are two names for the same phenomenon",
      "Data drift is the input distribution changing; concept drift is the relationship between inputs and the correct output changing",
      "Data drift affects training and concept drift affects inference",
      "Concept drift only occurs in classification problems"
    ],
    "a": 1,
    "x": "Data drift is detectable without labels — compare feature distributions to training. Concept drift often is not: the inputs look the same but what they mean has changed, as when a fraud pattern evolves. That is why label collection in production matters, and why input monitoring alone gives false confidence."
  },
  {
    "tag": "Monitoring without labels",
    "lvl": "advanced",
    "q": "Ground-truth labels arrive 30 days after prediction. What can you monitor in the meantime?",
    "o": [
      "Nothing useful until the labels arrive",
      "Input feature distributions, prediction distributions, and confidence — a sudden shift in any of them is a signal even without knowing correctness",
      "Only infrastructure metrics such as latency",
      "Retrain daily and compare the models"
    ],
    "a": 1,
    "x": "You cannot compute accuracy, but you can detect that something changed. If the model suddenly predicts the positive class three times as often, or input distributions shift, that warrants investigation before the labels confirm it. Proxy signals are what make a 30-day feedback loop survivable."
  }
]);

/* ===================================================================
   The Job Hunt
   =================================================================== */

TD.addMCQ("hunt", "proof", [
  {
    "tag": "What makes a project count",
    "lvl": "intermediate",
    "q": "Which project is most likely to lead to an interview?",
    "o": [
      "A tutorial project followed exactly, with polished styling",
      "A smaller project you designed yourself, deployed and can explain every decision in — including what you would do differently",
      "A large repository forked from a popular project",
      "Five separate tutorial projects showing breadth"
    ],
    "a": 1,
    "x": "Interviewers ask 'why did you do it that way'. A followed tutorial produces no defensible decisions, and every candidate has the same ones. A small original project has real trade-offs you made and can discuss — which is the entire signal being looked for. Deployment matters because it proves the last mile was crossed."
  }
]);

TD.addMCQ("hunt", "write", [
  {
    "tag": "The README",
    "lvl": "intermediate",
    "q": "What should the first paragraph of a project README contain?",
    "o": [
      "The installation instructions",
      "What the project does and what problem it solves, in plain language, plus a link to it running",
      "The technology stack",
      "Your motivation for building it"
    ],
    "a": 1,
    "x": "A reviewer spends well under a minute deciding whether to look further. Leading with the stack answers a question nobody asked yet; leading with the problem gives context that makes everything else legible. A live link is the strongest single element, because it proves the project actually works."
  }
]);

TD.addMCQ("hunt", "resume", [
  {
    "tag": "The eight-second scan",
    "lvl": "intermediate",
    "q": "What is the most effective way to describe a project on a CV?",
    "o": [
      "List the technologies used",
      "State what it does and a concrete outcome or scale — technologies belong in the line, not as the point of it",
      "Describe the architecture in detail",
      "Explain what you learned from building it"
    ],
    "a": 1,
    "x": "'Built a URL shortener with Redis caching, serving 2,000 redirects/sec at p99 under 15ms' says more in one line than a technology list, because it demonstrates you measured something. A stack list is unfalsifiable and identical across candidates; a number invites a question you can answer well."
  }
]);

TD.addMCQ("hunt", "apply", [
  {
    "tag": "Where jobs come from",
    "lvl": "intermediate",
    "q": "Why does applying through a referral convert so much better than applying cold?",
    "o": [
      "Referred candidates skip the technical interview",
      "A referral moves your application from an unread pile into a queue a human has a reason to look at — it buys attention, not a lower bar",
      "Companies pay recruiters less for referrals",
      "Referrals bypass the applicant tracking system"
    ],
    "a": 1,
    "x": "The bar does not move; the probability of being read does. A popular posting receives hundreds of applications and most are never opened. This is why speaking to people in the field is a better use of an hour than sending twenty more cold applications — and why the cold ones should target smaller, less-advertised companies."
  }
]);

TD.addMCQ("hunt", "loop", [
  {
    "tag": "What each stage tests",
    "lvl": "intermediate",
    "q": "In a coding interview, you cannot see the optimal solution. What is the best next move?",
    "o": [
      "Stay silent until you work it out",
      "State the brute-force approach and its complexity out loud, then improve from there — a working slow solution plus visible reasoning beats silence",
      "Ask to switch to a different question",
      "Start writing code immediately to show progress"
    ],
    "a": 1,
    "x": "The interviewer is assessing how you think, not whether you have memorised the answer. Silence gives them nothing to evaluate. Naming the naive approach establishes a baseline, invites a hint, and often reveals the optimisation — and an honest 'this is O(n squared), I think a hash map makes it linear' is exactly the reasoning being looked for."
  }
]);

TD.addMCQ("hunt", "offer", [
  {
    "tag": "Negotiation",
    "lvl": "intermediate",
    "q": "Why is it usually a mistake to name a number first when asked about salary expectations?",
    "o": [
      "It is illegal in most jurisdictions",
      "Your figure caps the outcome — if it is below their budget the difference is simply saved, and you cannot revise upward later",
      "It signals you have not researched the market",
      "Recruiters are trained to reject the first number automatically"
    ],
    "a": 1,
    "x": "The information is asymmetric: they know their band and you do not. Deflecting once — asking for the range, or saying you would rather discuss it once you both know the fit — costs nothing and is entirely normal. The worst realistic outcome is that they insist, at which point you give a researched range rather than a single figure."
  }
]);
