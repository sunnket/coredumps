(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([
    {
      slug: "generator",
      why: {
        before: "Iterating over large sequences required materializing complete lists in memory up front, causing immediate out-of-memory crashes when processing multi-gigabyte log files or infinite data streams.",
        problem: "Allocating millions of intermediate objects during pipeline transformations exhausts RAM, creates heavy garbage collection pauses, and introduces high initial latency before the first element can be consumed.",
        shift: "Generators (introduced via PEP 255) provide lazy, on-demand evaluation: functions yield values one at a time, suspending their local execution state (`PyFrameObject`) between calls, enabling infinite streams and complex processing pipelines with strictly O(1) auxiliary memory."
      },
      num: {
        t: "Sequence Processing Paradigms & Memory Profiles",
        h: ["Paradigm", "Evaluation Timing", "Memory Consumption (N items)", "Time to First Item", "Iteration Mechanics"],
        r: [
          ["Materialized List (`[x for x in data]`)", "Eager / Immediate", "O(N) memory allocation", "O(N) initial delay", "Direct indexable array"],
          ["Generator Function (`yield`)", "Lazy / On-demand", "O(1) constant frame", "O(1) instantaneous", "Iterator protocol (`__next__`)"],
          ["Generator Expression (`(x for x in data)`)", "Lazy / On-demand", "O(1) constant frame", "O(1) instantaneous", "Inline comprehension syntax"],
          ["Custom Iterator Class", "Lazy / On-demand", "O(1) class state", "O(1) instantaneous", "Explicit `__iter__` and `__next__`"],
          ["Itertools Pipeline", "Lazy / Optimized C", "O(1) constant", "O(1) instantaneous", "High-speed C-extension primitives"]
        ],
        n: "When a generator function encounters `yield x`, execution halts, saving the instruction pointer and CPU registers in a heap-allocated `PyGenObject`. Subsequent `next(g)` calls resume execution in $O(1)$ operations with zero allocation overhead: $\\text{Memory}(N) = \\Theta(1)$ for arbitrary $N$."
      },
      miss: [
        {
          w: "Generators can be indexed or sliced directly like lists (e.g. `gen[0]`).",
          r: "Generators are one-way lazy iterators that do not support random indexing or slicing; indexing requires consuming elements using `itertools.islice()` or converting to a list."
        },
        {
          w: "A generator can be iterated over multiple times in loops.",
          r: "Generators are single-pass consumers; once exhausted (`StopIteration`), subsequent iteration attempts yield zero items and the generator must be re-instantiated."
        },
        {
          w: "Generators are always faster than list comprehensions.",
          r: "For small collections ($N < 10,000$), list comprehensions are slightly faster due to optimized C-level batch allocation; generators win when memory conservation or streaming latency is required."
        },
        {
          w: "Generators can only send data outward to callers.",
          r: "Generators can receive data bidirectionally from callers via `.send(value)`, forming the foundational coroutine mechanism in Python prior to native `async/await`."
        }
      ],
      trade: {
        buys: [
          "Strict $O(1)$ constant memory overhead regardless of stream or dataset size.",
          "Instantaneous time-to-first-item without precomputation delays.",
          "Enables processing infinite telemetry feeds and multi-terabyte log archives.",
          "Clean, composable pipeline architectures using Unix-pipe-like generator chaining."
        ],
        costs: [
          "Single-use exhaustion: cannot be rewound or re-iterated without re-running the generator function.",
          "No random access or length inquiry (`len(gen)` throws a `TypeError`).",
          "Harder to debug because exceptions occur lazily at the consumption site, not at definition.",
          "Thread-unsafe: iterating over a single generator instance across multiple threads causes race conditions."
        ],
        avoid: [
          "Avoid wrapping generators in `list()` unless all elements must reside in memory simultaneously.",
          "Avoid calling `len()` on a generator; track item counts during iteration if needed.",
          "Avoid sharing a single generator instance across concurrent threads without locks.",
          "Avoid nesting generator pipelines so deeply that recursive frame overhead degrades throughput; use `yield from`."
        ]
      }
    },
    {
      slug: "global-interpreter-lock",
      why: {
        before: "Early dynamic language runtimes struggled with thread-safe memory management, requiring complex fine-grained locks across all internal hash tables and object allocators, severely degrading single-threaded execution speed.",
        problem: "In CPython, reference-counting garbage collection requires atomic increments/decrements on every pointer assignment; without a global lock, multi-threaded operations cause race conditions and memory corruption.",
        shift: "The Global Interpreter Lock (GIL) is a mutual exclusion lock that ensures only one native operating system thread executes Python bytecode at any given moment in CPython, protecting internal reference counts at the cost of preventing CPU-bound multi-core parallelism on a single Python process."
      },
      num: {
        t: "CPython Concurrency Strategies & GIL Interaction",
        h: ["Concurrency Strategy", "GIL Status", "Multi-Core CPU Parallelism", "Memory Overhead", "Best Use Case"],
        r: [
          ["Multi-Threading (`threading`)", "Enforced (1 thread at a time)", "No (bound to 1 CPU core)", "Low (shared heap)", "I/O-bound tasks & network requests"],
          ["Multi-Processing (`multiprocessing`)", "Bypassed (1 GIL per process)", "Yes (Full multi-core)", "High (forked process copies)", "CPU-bound calculations & data processing"],
          ["C/Rust Extensions (PyO3/Ctypes)", "Explicitly released (`Py_BEGIN_ALLOW_THREADS`)", "Yes (in native code)", "Low (native threads)", "Heavy numerical matrix operations (NumPy/PyTorch)"],
          ["AsyncIO (`asyncio`)", "Single thread (GIL irrelevant)", "No (single core)", "Lowest (coroutines)", "High-concurrency network servers"],
          ["Free-Threaded Python 3.13 (PEP 703)", "Disabled / Removed (Optional build)", "Yes (True multi-threading)", "Moderate (mimalloc + biased refcounts)", "Future multi-threaded Python CPU tasks"]
        ],
        n: "The GIL switches threads via cooperative checks or timeout intervals (default 5ms via `sys.getswitchinterval()`). During CPU-bound tasks, thread contention causes OS context-switching thrashing (the 'convoy effect'), making multi-threaded CPU code slower than single-threaded code."
      },
      miss: [
        {
          w: "The GIL prevents all race conditions in Python, so thread locks are unnecessary.",
          r: "The GIL only protects CPython's internal memory structures; application-level race conditions (e.g. `counter += 1` expanding to multiple bytecode instructions) still require explicit `threading.Lock`."
        },
        {
          w: "Python threads are fake green threads that do not use operating system threads.",
          r: "Python threads are genuine native OS threads (`pthread` on Linux, Win32 threads on Windows); the GIL merely prevents more than one from running Python bytecode simultaneously."
        },
        {
          w: "The GIL makes multi-threading useless for all Python programs.",
          r: "Python threads are highly effective for I/O-bound tasks (file reading, database queries, HTTP requests) because CPython automatically releases the GIL during blocking I/O system calls."
        },
        {
          w: "NumPy and PyTorch are crippled by the GIL.",
          r: "NumPy and PyTorch release the GIL before entering compiled C/CUDA routines, allowing high-performance parallel computation across all CPU cores and GPUs."
        }
      ],
      trade: {
        buys: [
          "Blazingly fast single-threaded execution performance with zero lock contention overhead.",
          "Straightforward, rock-solid thread-safe integration with legacy C libraries and extensions.",
          "Simple, deterministic reference-counting memory reclamation without stop-the-world pauses.",
          "Transparent concurrency benefits for I/O-bound network and storage workloads."
        ],
        costs: [
          "CPU-bound workloads cannot scale across multiple CPU cores within a single Python process.",
          "Multi-processing workarounds require heavy IPC serialization (`pickle`) and higher RAM usage.",
          "Thread priority inversion and CPU contention under mixed I/O and compute workloads.",
          "Historical barrier to native parallel programming in high-performance computing."
        ],
        avoid: [
          "Avoid using `threading` to speed up CPU-bound loops; use `multiprocessing` or compiled extensions.",
          "Avoid assuming thread safety for compound operations like `dict[k] += 1` without explicit locks.",
          "Avoid frequent cross-process IPC transfers of massive datasets; use shared memory (`multiprocessing.shared_memory`).",
          "Avoid blocking the GIL in custom C extensions; wrap long compute loops in `Py_BEGIN_ALLOW_THREADS`."
        ]
      }
    },
    {
      slug: "cprofile",
      why: {
        before: "Optimizing Python applications relied on guesswork or littering code with manual `time.time()` print statements, which were tedious to maintain, missed hidden bottlenecks, and distorted runtime characteristics.",
        problem: "Developers frequently spent days optimizing the wrong functions because human intuition notoriously misjudges which function calls consume the majority of runtime execution.",
        shift: "cProfile provides a standard-library, C-extension deterministic profiler that hooks into every function call and return event, measuring exact call counts, cumulative execution times, and per-call durations with minimal instrumentation overhead, exporting standardized profile data for visualization."
      },
      num: {
        t: "Python Profiling Tools & Mechanics",
        h: ["Profiler", "Methodology", "Overhead Penalty", "Standard Library", "Primary Target"],
        r: [
          ["cProfile", "Deterministic (Every call/return hook)", "Low-Moderate (~ 1.3x - 2x slowdown)", "Yes (Built-in)", "Function-level CPU bottleneck analysis"],
          ["profile", "Deterministic (Pure Python)", "Very High (~ 10x - 30x slowdown)", "Yes (Built-in)", "Historical reference only"],
          ["Py-Spy", "Statistical (Sampling stack inspect)", "Near Zero (< 5% overhead)", "No (External Rust binary)", "Production live server profiling"],
          ["line_profiler", "Deterministic (Line-by-line tracing)", "High (~ 3x - 10x slowdown)", "No (External C extension)", "Granular line-by-line inner loop analysis"],
          ["tracemalloc", "Memory allocation tracking", "Moderate (~ 1.5x - 3x slowdown)", "Yes (Built-in)", "RAM allocation & memory leak detection"]
        ],
        n: "cProfile records four primary metrics per function: `ncalls` (total executions), `tottime` (time spent strictly inside function body excluding sub-calls), `cumtime` (total time from entry to exit including all child calls), and per-call averages: $\\text{percall} = \\frac{\\text{tottime}}{\\text{ncalls}}$."
      },
      miss: [
        {
          w: "Functions with the highest `cumtime` are always the primary bottleneck to optimize.",
          r: "`cumtime` includes all child function calls (e.g. `main()` always has ~100% `cumtime`); optimization must focus on high `tottime` where the function's own code spends time."
        },
        {
          w: "cProfile measures memory consumption and RAM allocations.",
          r: "cProfile exclusively measures execution time and call counts; tracking memory allocations requires `tracemalloc` or `memory_profiler`."
        },
        {
          w: "cProfile should be run continuously in production web servers.",
          r: "Deterministic function hooking adds 30-100% CPU overhead; production environments should use non-intrusive statistical sampling profilers like Py-Spy."
        },
        {
          w: "cProfile output can only be viewed as raw terminal text.",
          r: "cProfile dumps binary `.prof` files (`-o output.prof`) that can be interactively visualized as flame graphs and treemaps using tools like SnakeViz, Tuna, or pyprof2calltree."
        }
      ],
      trade: {
        buys: [
          "Built into standard Python with zero external pip dependencies required.",
          "C-extension implementation provides high measurement accuracy with modest overhead.",
          "Exact call counts expose accidental recursive or redundant function invocations.",
          "Dumps standardized `.prof` files compatible with modern flame graph visualization tools."
        ],
        costs: [
          "Adds 30% to 100% overhead, which can distort micro-benchmarks of tiny fast functions.",
          "Provides function-level resolution only; cannot isolate which specific line in a function is slow.",
          "Does not capture multi-threaded contention or asyncio event-loop stalling accurately.",
          "Raw terminal table output can be overwhelming without visualization tools like SnakeViz."
        ],
        avoid: [
          "Avoid using the legacy pure-Python `profile` module; always import `cProfile`.",
          "Avoid optimizing code based on intuition before generating a cProfile baseline.",
          "Avoid running cProfile inside high-throughput production request loops; use sampling profilers.",
          "Avoid ignoring `ncalls`; millions of calls to a fast function often represent an algorithmic flaw."
        ]
      }
    },
    {
      slug: "poetry",
      why: {
        before: "Python dependency management was fragmented across `requirements.txt`, `setup.py`, `setup.cfg`, `MANIFEST.in`, and `Pipfile`, leading to unpinned sub-dependencies, version collisions, and non-reproducible environments.",
        problem: "A `pip install -r requirements.txt` on Monday could break on Friday because an unpinned transitive dependency released a breaking change, causing the classic 'it works on my machine' production outage.",
        shift: "Poetry unified Python packaging, dependency resolution, and virtual environment management around modern standards (PEP 518/621 `pyproject.toml`), featuring a deterministic SAT dependency solver that locks exact transitive versions in `poetry.lock` for 100% reproducible builds."
      },
      num: {
        t: "Python Packaging & Dependency Management Tools",
        h: ["Tool", "Lockfile Support", "Dependency Resolver", "Virtualenv Management", "Build & Publish Native"],
        r: [
          ["Poetry", "Deterministic (`poetry.lock`)", "Advanced SAT solver", "Automatic isolation", "Yes (`poetry build / publish`)"],
          ["Pip + requirements.txt", "Manual (`pip freeze`)", "Basic backtracking resolver", "No (requires manual venv)", "No (requires twine & build)"],
          ["Pipenv", "Deterministic (`Pipfile.lock`)", "Pip-tools resolver", "Automatic isolation", "No (packaging not supported)"],
          ["UV (Astral)", "Deterministic (`uv.lock`)", "Ultra-fast Rust PubGrub solver", "Automatic isolation", "Yes (Modern fast alternative)"],
          ["Hatch", "No lockfile by default", "Pip resolver", "Environment matrices", "Yes (PEP 621 compliant)"]
        ],
        n: "Poetry enforces strict semantic versioning constraints: caret (`^1.2.3` permits $\\ge 1.2.3, < 2.0.0$) and tilde (`~1.2.3` permits $\\ge 1.2.3, < 1.3.0$). The dependency graph is resolved globally before any package is installed, preventing partial or corrupt virtual environment states."
      },
      miss: [
        {
          w: "The `poetry.lock` file should be added to `.gitignore`.",
          r: "`poetry.lock` must be committed to version control for application repositories to guarantee that every developer and CI/CD runner installs identical package versions."
        },
        {
          w: "Running `poetry update` is the standard way to install project dependencies.",
          r: "`poetry update` recalculates the solver and upgrades all packages to their latest permitted versions; standard setup should use `poetry install` to respect existing locked versions."
        },
        {
          w: "Poetry cannot build or publish libraries to private package indexes.",
          r: "Poetry provides native commands (`poetry config repositories.foo <url>` and `poetry publish -r foo`) to deploy wheels to private Artifactory, Nexus, or AWS CodeArtifact repositories."
        },
        {
          w: "Poetry requires manual activation of virtual environments.",
          r: "Running `poetry run <command>` automatically executes commands within the isolated project virtual environment without manual activation."
        }
      ],
      trade: {
        buys: [
          "Guarantees 100% reproducible development and deployment environments via `poetry.lock`.",
          "Single configuration source: consolidates metadata, dependencies, and tools in `pyproject.toml`.",
          "Powerful SAT solver catches incompatible transitive dependency conflicts before installation.",
          "Built-in commands for package building and publishing streamline open-source library releases."
        ],
        costs: [
          "Dependency resolution solver can be slow on massive dependency graphs with complex version ranges.",
          "Steeper learning curve for developers accustomed to flat `requirements.txt` workflows.",
          "Can occasionally conflict with external environment managers like Conda.",
          "Docker caching requires multi-stage copying of `pyproject.toml` and `poetry.lock` to optimize builds."
        ],
        avoid: [
          "Avoid running `poetry update` in CI/CD pipelines; strictly execute `poetry install --no-root`.",
          "Avoid forgetting to commit `poetry.lock` to git in application projects.",
          "Avoid manually editing the `poetry.lock` file; always modify dependencies via `poetry add`.",
          "Avoid mixing `pip install` commands inside a Poetry-managed virtual environment."
        ]
      }
    },
    {
      slug: "tenacity",
      why: {
        before: "Handling transient network blips and API rate limits required writing verbose, error-prone `while` loops with manual `time.sleep()` calls, scattered across database clients and HTTP adapters.",
        problem: "Custom retry loops frequently omitted exponential backoff and jitter, resulting in the 'thundering herd' problem that repeatedly overwhelmed recovering databases and external APIs during outages.",
        shift: "Tenacity provides a battle-tested, declarative Python retrying library that replaces messy retry loops with a clean `@retry` decorator, offering composable stop conditions, exponential backoff with full jitter, conditional exception filtering, and comprehensive retry lifecycle hooks."
      },
      num: {
        t: "Retry Strategy Mechanics & Failure Resistance",
        h: ["Strategy / Pattern", "Backoff Formula", "Jitter Mechanism", "Thundering Herd Risk", "Best Use Case"],
        r: [
          ["Fixed Interval Retry", "Sleep = C (constant)", "None", "Severe (synchronized bursts)", "Internal fast cache blips"],
          ["Exponential Backoff", "Sleep = min(M, B * 2^attempt)", "None", "Moderate (phased synchronization)", "Standard network retries"],
          ["Exponential + Full Jitter", "Sleep = uniform(0, min(M, B * 2^a))", "Full randomized spread", "Zero (desynchronized)", "Cloud APIs & distributed microservices"],
          ["Exponential + Equal Jitter", "Sleep = (B * 2^a)/2 + uniform(0, ...)", "Half fixed / half random", "Very Low", "Latency-sensitive RPC calls"],
          ["Linear Backoff", "Sleep = B * attempt", "Optional", "Moderate", "Batch background ETL retries"]
        ],
        n: "Tenacity configures retries via decorator composition: `@retry(stop=stop_after_attempt(5), wait=wait_random_exponential(multiplier=1, max=60), retry=retry_if_exception_type(httpx.HTTPStatusError))`. Jitter disperses retry timestamps uniformly across the interval $[0, B \\cdot 2^{\\text{attempt}}]$."
      },
      miss: [
        {
          w: "Retrying should be applied to all errors including 400 Bad Request and 401 Unauthorized.",
          r: "Client errors (4xx) are deterministic; retrying a 400 or 401 error will never succeed and merely wastes bandwidth; retries should strictly target transient errors (429, 502, 503, 504, network timeouts)."
        },
        {
          w: "Exponential backoff alone without jitter is sufficient to prevent API stampedes.",
          r: "Without randomized jitter, clients that fail simultaneously will retry at identical synchronized exponential intervals, repeatedly hammering the recovering server."
        },
        {
          w: "Tenacity only works with synchronous functions.",
          r: "Tenacity natively supports asynchronous coroutines (`async def`), automatically awaiting non-blocking sleeps using `asyncio.sleep` without blocking the event loop."
        },
        {
          w: "Retrying non-idempotent operations (like credit card payments) is safe with Tenacity.",
          r: "Retrying non-idempotent HTTP POST operations without an idempotency key risks duplicate financial transactions or duplicate database record insertions."
        }
      ],
      trade: {
        buys: [
          "Dramatically increases system resilience against transient network failures and cloud service blips.",
          "Eliminates boilerplate retry while-loops across the codebase with declarative decorators.",
          "Built-in full jitter prevents the thundering herd problem during upstream recovery.",
          "Rich callback hooks enable structured logging and metrics on every retry attempt."
        ],
        costs: [
          "Misconfigured retries can mask underlying persistent infrastructure degradations.",
          "Long retry chains increase end-to-end request latency for user-facing interactive requests.",
          "Risk of duplicate operations if applied to non-idempotent mutating endpoints.",
          "Can exhaust thread pools if many requests are simultaneously sleeping in retry loops."
        ],
        avoid: [
          "Avoid retrying non-idempotent mutations without passing unique idempotency keys.",
          "Avoid retrying on deterministic exceptions like `ValueError` or `KeyError`.",
          "Avoid retrying without a hard `stop` condition (`stop_after_attempt` or `stop_after_delay`).",
          "Avoid exponential backoff without randomized jitter on high-concurrency distributed clients."
        ]
      }
    },
    {
      slug: "structured-logging",
      why: {
        before: "Applications emitted free-form, human-readable text strings to log files (`logger.info(f'User {user_id} logged in from {ip}')`), requiring fragile regular expressions to parse in log aggregators.",
        problem: "Unstructured string logs cannot be indexed efficiently, break whenever developer phrasing changes, prevent high-cardinality filtering, and turn incident debugging across thousands of microservices into a nightmare.",
        shift: "Structured Logging emits machine-readable key-value payloads (typically JSON) with standardized schemas (timestamp, log level, correlation ID, event, context attributes), enabling instant indexing, filtering, and aggregation in modern observability backends (Datadog, Loki, OpenSearch)."
      },
      num: {
        t: "Logging Paradigms & Observability Capabilities",
        h: ["Logging Format", "Machine Parseability", "Log Aggregator Indexing", "Context Propagation", "Overhead / Complexity"],
        r: [
          ["Unstructured Plain Text", "Poor (Requires brittle regex)", "Full-text search only (expensive)", "Difficult (scattered strings)", "Lowest (primitive)"],
          ["Structured JSON (structlog)", "Optimal (Instant native JSON)", "Granular field indexing (fast)", "Native context binding", "Low-Moderate (JSON serialization)"],
          ["Logfmt (key=value pairs)", "Good (Simple token parsing)", "Moderate field indexing", "Supported", "Low (compact text format)"],
          ["OpenTelemetry Log Record", "Optimal (Protobuf / JSON standard)", "Native trace/metric correlation", "Native distributed context", "Moderate (OTel collector pipeline)"],
          ["Syslog RFC 5424", "Moderate (Fixed header + MSG)", "Header indexed only", "Manual structured data blocks", "Low"]
        ],
        n: "Structured logging libraries (e.g. Python `structlog`) bind persistent contextual attributes across the execution lifecycle: $L_{\\text{bound}} = L_0 \\cup \\{ \\text{request\\_id}, \\text{user\\_id}, \\text{tenant} \\}$. Output logs serialize as JSON objects: `{\"timestamp\": \"...\", \"level\": \"info\", \"event\": \"checkout\", \"amount\": 42.0, \"trace_id\": \"...\"}`."
      },
      miss: [
        {
          w: "Using Python's f-strings inside `logger.info()` is structured logging.",
          r: "F-strings produce a single merged unstructured string; true structured logging passes key-value kwargs (`logger.info('user_login', user_id=123, ip='1.2.3.4')`) that remain distinct queryable fields."
        },
        {
          w: "Structured JSON logs are too large and waste too much network bandwidth.",
          r: "Modern network compression (gzip/zstd) and the immense debugging speedup in production far outweigh the minor byte increase of JSON field keys."
        },
        {
          w: "Structured logging is only useful in distributed microservice architectures.",
          r: "Even in single-server monolithic applications, structured logs allow instant filtering of error spikes by customer ID or endpoint using basic tools like `jq`."
        },
        {
          w: "Structured logs cannot be read comfortably by human developers.",
          r: "Structured logging libraries provide console development renderers that format logs into beautifully colored, readable text locally while emitting JSON in production."
        }
      ],
      trade: {
        buys: [
          "Enables instant, high-cardinality querying and aggregation in Datadog, Elasticsearch, and Loki.",
          "Seamless correlation between logs, metrics, and traces via standardized `trace_id` injection.",
          "Context binding allows attaching request IDs once and having them automatically appear on all sub-logs.",
          "Eliminates log parser breakage when log message descriptions are updated."
        ],
        costs: [
          "Slightly higher CPU overhead for JSON serialization compared to raw string concatenation.",
          "Slightly larger storage volume on disk before log compression is applied.",
          "Requires establishing organizational naming conventions to prevent schema collisions (e.g. `userId` vs `user_id`).",
          "Requires developer discipline to pass structured kwargs instead of interpolated strings."
        ],
        avoid: [
          "Avoid string interpolation (`f'...'`) in log calls; pass parameters as explicit keyword arguments.",
          "Avoid logging sensitive data (passwords, auth tokens, unmasked credit cards) into structured fields.",
          "Avoid inconsistent key naming across services; standardize on snake_case or camelCase across all teams.",
          "Avoid discarding correlation IDs when spawning background asynchronous tasks."
        ]
      }
    },
    {
      slug: "fastapi",
      why: {
        before: "Building Python web APIs required using legacy WSGI frameworks like Flask or Django, which were synchronous, lacked native async I/O, required manual request validation, and forced developers to maintain separate Swagger API documentation that constantly drifted out of sync.",
        problem: "Synchronous WSGI servers blocked worker threads on slow database or LLM API calls, scaling poorly under high concurrency, while manually written validation logic frequently permitted malformed payloads to crash endpoints.",
        shift: "FastAPI revolutionized Python web development by combining high-performance ASGI asynchronous concurrency (Starlette) with robust type-hint-driven data validation (Pydantic), automatically generating interactive OpenAPI and Swagger UI documentation directly from Python code at near-Go speeds."
      },
      num: {
        t: "Python Web Frameworks Architectural Comparison",
        h: ["Framework", "Server Interface", "Validation Engine", "Async/Await Native", "Automatic OpenAPI Docs"],
        r: [
          ["FastAPI", "ASGI (Uvicorn / Starlette)", "Pydantic V2 (Rust core)", "Yes (Native async & sync)", "Yes (Interactive Swagger & Redoc)"],
          ["Flask", "WSGI (Gunicorn / Werkzeug)", "Manual / Marshmallow", "No (Limited async in 2.0)", "No (Requires flasgger extension)"],
          ["Django REST Framework", "WSGI / ASGI (Django core)", "DRF Serializers", "Partial (evolving async)", "No (Requires drf-spectacular)"],
          ["Tornado", "Custom Async Event Loop", "Manual validation", "Yes (Pioneered async)", "No"],
          ["Litestar", "ASGI", "Pydantic / Msgspec / Attrs", "Yes (Native async)", "Yes (Native OpenAPI)"]
        ],
        n: "FastAPI routes define typed dependencies via `Depends()`. At runtime, ASGI requests pass through Starlette middleware to Pydantic models for validation in compiled Rust. Validated models are injected into route handlers with zero glue code: $\\text{ASGI Request} \\xrightarrow{\\text{Pydantic V2}} \\text{Typed Parameters} \\to \\text{Response}$."
      },
      miss: [
        {
          w: "Every route in FastAPI must be defined with `async def`.",
          r: "If a route performs synchronous blocking I/O (e.g. legacy database queries), defining it with plain `def` is safer because FastAPI automatically runs it on an external threadpool, preventing event-loop freezing."
        },
        {
          w: "FastAPI is slow because Python is slow.",
          r: "FastAPI benchmarks among the fastest Python frameworks available, approaching Go and Node.js performance thanks to Starlette's lightweight ASGI architecture and Pydantic V2's compiled Rust core."
        },
        {
          w: "FastAPI requires separate code to generate OpenAPI (Swagger) specifications.",
          r: "FastAPI automatically parses function signatures, Pydantic models, and docstrings at startup to generate complete, interactive `/docs` Swagger UIs with zero extra configuration."
        },
        {
          w: "FastAPI includes a built-in ORM for database access.",
          r: "FastAPI is an API framework, not a monolithic web stack; developers pair it with dedicated ORMs and query builders like SQLAlchemy, SQLModel, Tortoise ORM, or Prisma."
        }
      ],
      trade: {
        buys: [
          "State-of-the-art developer velocity: type hints drive validation, serialization, and documentation.",
          "Automatic, always-synchronized interactive API documentation (Swagger UI and Redoc).",
          "High-concurrency asynchronous performance powered by Starlette and Uvicorn.",
          "Elegant, composable Dependency Injection system (`Depends`) for authentication, database sessions, and configuration."
        ],
        costs: [
          "Accidental execution of blocking synchronous code inside `async def` routes freezes the server.",
          "Not a full-stack framework: requires selecting and configuring separate ORM, migration, and auth packages.",
          "Pydantic V2 upgrades introduced breaking changes for legacy Pydantic V1 codebases.",
          "Steep learning curve for developers unfamiliar with Python static typing and ASGI concurrency."
        ],
        avoid: [
          "Avoid running synchronous blocking calls (e.g. `requests.get`) inside `async def` routes; use `httpx.AsyncClient`.",
          "Avoid bypassing Pydantic schemas by parsing raw request dictionaries manually.",
          "Avoid defining database session dependencies without proper context manager yields for cleanup.",
          "Avoid exposing internal database model instances directly in responses; use explicit output schemas (`response_model`)."
        ]
      }
    },
    {
      slug: "pgvector",
      why: {
        before: "Building vector search and RAG applications required deploying and managing separate, dedicated vector databases (Pinecone, Weaviate, Milvus, Qdrant), fragmenting data architectures and breaking ACID transactions.",
        problem: "Synchronizing state between a primary relational database (PostgreSQL) and an external vector database required complex dual-write ETL pipelines prone to synchronization drift, network latency, and data consistency bugs.",
        shift: "pgvector brought native vector similarity search directly inside PostgreSQL as an open-source extension, allowing high-dimensional embeddings to be stored in standard table columns, indexed with HNSW and IVFFlat, and queried with SQL alongside standard relational joins and ACID transactions."
      },
      num: {
        t: "Vector Storage & Search Architectures Comparison",
        h: ["Architecture", "Storage Engine", "Index Types", "Relational Joins & ACID", "Operational Overhead"],
        r: [
          ["pgvector (PostgreSQL)", "PostgreSQL table column", "HNSW & IVFFlat", "Full ACID & relational joins", "Zero (uses existing Postgres)"],
          ["Pinecone", "Proprietary managed cloud", "Proprietary graph", "Metadata filtering only (No SQL)", "Managed SaaS (Vendor lock-in)"],
          ["Qdrant", "Dedicated Rust vector engine", "HNSW variant", "Payload filtering (No relational joins)", "Requires separate cluster"],
          ["Milvus", "Distributed Go/C++ cluster", "HNSW, IVF, SCaNN", "Metadata scalar filtering", "High (complex multi-component)"],
          ["Chroma", "Local SQLite / DuckDB / ClickHouse", "HNSW (hnswlib)", "Basic metadata dict", "Low (embedded / prototyping)"]
        ],
        n: "pgvector supports exact nearest neighbor and approximate nearest neighbor (ANN) search via three distance operators: L2 distance (`<->`), cosine distance (`<=>`), and inner product (`<#>`). HNSW indices build multi-layer proximity graphs offering sub-millisecond queries with $>95\\%$ recall."
      },
      miss: [
        {
          w: "pgvector is only suitable for small toy prototypes and cannot scale.",
          r: "With HNSW indexing, half-precision vectors (`halfvec`), and iterative index scanning, pgvector efficiently handles tens of millions of high-dimensional vectors within existing enterprise PostgreSQL infrastructure."
        },
        {
          w: "pgvector requires rewriting existing PostgreSQL queries.",
          r: "Vector queries are standard SQL: `SELECT * FROM items ORDER BY embedding <=> '[...]' LIMIT 5;`, enabling seamless integration with `WHERE` filters, `JOIN` clauses, and window functions."
        },
        {
          w: "IVFFlat indexing is always superior to HNSW in pgvector.",
          r: "IVFFlat requires training on existing data, degrades if data is added before building, and offers lower query throughput; HNSW builds incrementally without training and delivers substantially higher queries per second."
        },
        {
          w: "pgvector cannot perform hybrid keyword and semantic search.",
          r: "PostgreSQL uniquely combines pgvector semantic similarity with PostgreSQL's built-in full-text search (`tsvector` / `tsquery`) and Reciprocal Rank Fusion (RRF) in a single SQL statement."
        }
      ],
      trade: {
        buys: [
          "Zero new infrastructure: store embeddings directly inside existing PostgreSQL databases.",
          "Full ACID guarantees: vector updates commit atomically with corresponding relational row changes.",
          "Rich relational filtering: combine complex SQL `JOIN` and `WHERE` clauses with vector similarity.",
          "Eliminates fragile dual-write synchronization pipelines between relational and vector stores."
        ],
        costs: [
          "HNSW index construction requires substantial PostgreSQL `maintenance_work_mem` RAM.",
          "Large vector embeddings significantly increase PostgreSQL backup and WAL replication sizes.",
          "Extreme scale (> 50M vectors) may eventually require dedicated database node separation.",
          "PostgreSQL vacuuming processes must manage high churn if vector embeddings are frequently updated."
        ],
        avoid: [
          "Avoid querying large vector tables without creating an HNSW or IVFFlat index.",
          "Avoid building IVFFlat indexes on empty tables before data has been populated.",
          "Avoid forgetting to tune `hnsw.ef_search` during queries to balance recall against latency.",
          "Avoid migrating to complex standalone vector databases before testing whether pgvector meets requirements."
        ]
      }
    }
  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
