/* Backend & APIs — FastAPI in practice. */
TD.addLessons("backend", [

{
 t: "FastAPI: Types as the Contract",
 m: "fastapi",
 lvl: "core",
 s: "Routes, Pydantic, dependency injection — and documentation that cannot go stale.",
 goal: [
  "Build a validated, documented endpoint from type annotations alone",
  "Use dependency injection for auth, database sessions and shared resources",
  "Structure a project that will still make sense at 5,000 lines"
 ],
 b: [
  { p: "FastAPI's central idea: your type annotations *are* the API contract. Write the types and you get validation, serialisation, error responses and interactive documentation for free — and none of them can drift from the code, because they are generated from it." },

  { h: "The smallest complete service" },
  { code: { lang: "python", file: "main.py",
    lines: [
     { c: "from fastapi import FastAPI", w: "" },
     { c: "from pydantic import BaseModel, Field", w: "" },
     { c: "", w: "" },
     { c: "app = FastAPI(title='Prediction API', version='1.0.0')", w: "**Title and version appear in the generated docs and the OpenAPI schema.**" },
     { c: "", w: "" },
     { c: "class PredictIn(BaseModel):", w: "" },
     { c: "    customer_id: str", w: "**Required.** A missing field returns 422 with the field named — you write nothing." },
     { c: "    amount: float = Field(gt=0, description='Transaction amount in rupees')", w: "**Constraints are validation.** `gt=0` rejects negatives before your code runs.", hi: true },
     { c: "    channel: str = 'web'", w: "**A default makes it optional.**" },
     { c: "", w: "" },
     { c: "class PredictOut(BaseModel):", w: "" },
     { c: "    probability: float", w: "" },
     { c: "    decision: bool", w: "" },
     { c: "    model_version: str", w: "" },
     { c: "", w: "" },
     { c: "@app.post('/v1/predict', response_model=PredictOut)", w: "**`response_model` filters the output too** — anything not in the model is stripped, which is a genuine protection against accidentally leaking internal fields.", hi: true },
     { c: "def predict(body: PredictIn) -> PredictOut:", w: "**The annotation is the parser.** No manual JSON handling anywhere." },
     { c: "    p = model.predict_proba([[body.amount]])[0][1]", w: "" },
     { c: "    return PredictOut(probability=p, decision=p > 0.32,", w: "" },
     { c: "                      model_version=MODEL_VERSION)", w: "" }
    ] } },

  { code: { lang: "bash", t: "Run it and look at what you got",
    lines: [
     { c: "uvicorn main:app --reload", w: "**`--reload` for development only.** It watches files and restarts." },
     { c: "", w: "" },
     { c: "# http://localhost:8000/docs", w: "**An interactive page**, generated from the types. You can call the endpoint from it.", hi: true },
     { c: "# http://localhost:8000/openapi.json", w: "**The OpenAPI schema** — feed it to a client generator and other teams get a typed SDK for free." }
    ] } },

  { n: "That generated documentation is the strongest practical argument for FastAPI. Hand-written API docs are wrong within a month because nobody updates them under deadline. These cannot be wrong unless the code is, and a frontend developer can try the endpoint without asking you anything.",
    nt: "Why this matters more than it sounds" },

  { h: "Validation you get for nothing" },
  { code: { lang: "python", t: "Constraints in the type",
    lines: [
     { c: "from typing import Literal, Annotated", w: "" },
     { c: "from pydantic import BaseModel, Field, EmailStr, field_validator", w: "" },
     { c: "", w: "" },
     { c: "class Query(BaseModel):", w: "" },
     { c: "    question: str = Field(min_length=1, max_length=2000)", w: "**Length limits are a security control**, not only validation — they cap what an attacker can send." },
     { c: "    top_k: int = Field(default=5, ge=1, le=50)", w: "**Clamped range.** Prevents `top_k=100000` taking the service down." },
     { c: "    mode: Literal['fast', 'accurate'] = 'fast'", w: "**Only these two values are accepted**, and both appear in the docs." },
     { c: "    email: EmailStr | None = None", w: "" },
     { c: "", w: "" },
     { c: "    @field_validator('question')", w: "" },
     { c: "    @classmethod", w: "" },
     { c: "    def not_blank(cls, v: str) -> str:", w: "" },
     { c: "        if not v.strip():", w: "" },
     { c: "            raise ValueError('question cannot be blank')", w: "**Custom rules where a constraint is not enough.**", hi: true },
     { c: "        return v.strip()", w: "**Validators can normalise as well as reject** — returning the stripped value means every downstream consumer gets clean input." }
    ],
    out: "422 Unprocessable Entity\n{\"detail\":[{\"type\":\"greater_than_equal\",\"loc\":[\"body\",\"top_k\"],\n  \"msg\":\"Input should be greater than or equal to 1\",\"input\":0}]}" } },

  { h: "Dependency injection" },
  { p: "FastAPI's second big idea. A dependency is a function whose result is passed into your handler — used for auth, database sessions, and anything shared. It makes handlers testable and removes a great deal of repetition." },

  { code: { lang: "python", file: "deps.py",
    lines: [
     { c: "from fastapi import Depends, Header, HTTPException", w: "" },
     { c: "", w: "" },
     { c: "def get_db():", w: "" },
     { c: "    db = SessionLocal()", w: "" },
     { c: "    try:", w: "" },
     { c: "        yield db", w: "**`yield`, not `return`.** Everything after the yield runs when the request finishes, whether it succeeded or raised.", hi: true },
     { c: "    finally:", w: "" },
     { c: "        db.close()", w: "**The connection is always returned to the pool.** Leaked connections are a classic production outage." },
     { c: "", w: "" },
     { c: "def current_user(authorization: str = Header(None), db = Depends(get_db)):", w: "**Dependencies can depend on dependencies**, and FastAPI resolves the graph." },
     { c: "    if not authorization or not authorization.startswith('Bearer '):", w: "" },
     { c: "        raise HTTPException(401, 'missing bearer token')", w: "" },
     { c: "    user = verify(authorization[7:], db)", w: "" },
     { c: "    if not user:", w: "" },
     { c: "        raise HTTPException(401, 'invalid token')", w: "" },
     { c: "    return user", w: "" },
     { c: "", w: "" },
     { c: "# usage", w: "" },
     { c: "@app.get('/v1/orders')", w: "" },
     { c: "def list_orders(user = Depends(current_user), db = Depends(get_db)):", w: "" },
     { c: "    return db.query(Order).filter(Order.user_id == user.id).all()", w: "**Identity comes from the dependency, never from a query parameter.** Same rule as the LLM guardrails lesson, for the same reason.", hi: true }
    ] } },

  { code: { lang: "python", t: "Overriding dependencies in tests — the payoff",
    lines: [
     { c: "from fastapi.testclient import TestClient", w: "" },
     { c: "", w: "" },
     { c: "def fake_user():", w: "" },
     { c: "    return User(id=1, email='test@example.com')", w: "" },
     { c: "", w: "" },
     { c: "app.dependency_overrides[current_user] = fake_user", w: "**Swap auth out for the whole test suite in one line.** No mocking library, no patching.", hi: true },
     { c: "", w: "" },
     { c: "client = TestClient(app)", w: "" },
     { c: "def test_list_orders():", w: "" },
     { c: "    r = client.get('/v1/orders')", w: "" },
     { c: "    assert r.status_code == 200", w: "" }
    ] } },

  { h: "Lifespan — load once, not per request" },
  { code: { lang: "python", t: "The most common performance mistake, prevented",
    lines: [
     { c: "from contextlib import asynccontextmanager", w: "" },
     { c: "", w: "" },
     { c: "ml = {}", w: "" },
     { c: "", w: "" },
     { c: "@asynccontextmanager", w: "" },
     { c: "async def lifespan(app: FastAPI):", w: "" },
     { c: "    ml['model'] = joblib.load('model.pkl')", w: "**Once, at startup.** Loading a model per request is a genuinely common bug and it is catastrophic for latency.", hi: true },
     { c: "    ml['embedder'] = SentenceTransformer('BAAI/bge-m3')", w: "" },
     { c: "    ml['http'] = httpx.AsyncClient(timeout=30)", w: "**One connection pool for the process.** A new client per request defeats connection reuse entirely." },
     { c: "    yield", w: "**The app serves requests here.**" },
     { c: "    await ml['http'].aclose()", w: "**Clean shutdown.** Runs on SIGTERM, which is what a container orchestrator sends." },
     { c: "", w: "" },
     { c: "app = FastAPI(lifespan=lifespan)", w: "" }
    ] } },

  { h: "Project structure" },
  { code: { lang: "text", t: "A layout that survives growth",
    lines: [
     { c: "app/" },
     { c: "  main.py            app creation, middleware, routers" },
     { c: "  config.py          settings from environment, one place" },
     { c: "  deps.py            shared dependencies" },
     { c: "  api/" },
     { c: "    v1/" },
     { c: "      predict.py     one router per resource", hi: true },
     { c: "      documents.py" },
     { c: "      health.py" },
     { c: "  models/            Pydantic schemas (the API contract)" },
     { c: "  db/                SQLAlchemy models and session" },
     { c: "  services/          business logic -- NO FastAPI imports here", hi: true },
     { c: "  core/              logging, errors, security" },
     { c: "tests/" }
    ],
    after: "The rule that matters is the one on `services/`: business logic must not import FastAPI. Then it can be tested without HTTP, reused from a background worker or a CLI, and your handlers stay thin — parse, call a service, return. Handlers that contain business logic are the single most common reason a backend becomes untestable." } },

  { code: { lang: "python", file: "app/main.py", t: "Wiring it together",
    lines: [
     { c: "app = FastAPI(title='API', version='1.0.0', lifespan=lifespan)", w: "" },
     { c: "", w: "" },
     { c: "app.include_router(predict.router, prefix='/v1', tags=['predict'])", w: "**Prefix once**, not in every route. Tags group the generated docs." },
     { c: "app.include_router(documents.router, prefix='/v1', tags=['documents'])", w: "" },
     { c: "app.include_router(health.router, tags=['ops'])", w: "**Health checks are unversioned** — they are for infrastructure, not clients." },
     { c: "", w: "" },
     { c: "@app.middleware('http')", w: "" },
     { c: "async def add_request_id(request, call_next):", w: "" },
     { c: "    rid = request.headers.get('x-request-id') or str(uuid.uuid4())", w: "**Accept an upstream id or generate one.** This is what makes tracing across services work.", hi: true },
     { c: "    request.state.request_id = rid", w: "" },
     { c: "    resp = await call_next(request)", w: "" },
     { c: "    resp.headers['x-request-id'] = rid", w: "**Return it**, so the client can quote it." },
     { c: "    return resp", w: "" }
    ] } },

  { h: "Configuration" },
  { code: { lang: "python", file: "app/config.py",
    lines: [
     { c: "from pydantic_settings import BaseSettings", w: "" },
     { c: "", w: "" },
     { c: "class Settings(BaseSettings):", w: "" },
     { c: "    database_url: str", w: "**No default — the app refuses to start without it.** Far better than discovering it is missing under load.", hi: true },
     { c: "    anthropic_api_key: str", w: "" },
     { c: "    max_context_tokens: int = 8000", w: "**Sensible defaults for tunables.**" },
     { c: "    environment: Literal['dev','staging','prod'] = 'dev'", w: "" },
     { c: "", w: "" },
     { c: "    class Config:", w: "" },
     { c: "        env_file = '.env'", w: "**Local development only.** `.env` must be in `.gitignore`." },
     { c: "", w: "" },
     { c: "settings = Settings()", w: "**Validated at import.** A typo in an environment variable fails at startup with a clear message rather than at 3am with a KeyError." }
    ] } },

  { trap: "Do not read `os.environ` scattered through the codebase. A missing variable then surfaces as a `KeyError` inside a request handler, hours after deploy, on the one code path that uses it. One `Settings` object validated at startup turns every configuration mistake into a clear failure before the service accepts traffic." },

  { tryit: { t: "Build a real service",
    task: "Build a FastAPI service with: a typed POST endpoint with constrained fields, an auth dependency, a database session dependency, lifespan model loading, request id middleware, a health endpoint, and one test that overrides the auth dependency. Then open `/docs` and call it from there.",
    hint: "Make the health endpoint check the database too — a liveness check that only proves the process is running is nearly useless.",
    sol: { lang: "python", code: "# app/api/v1/health.py\nfrom fastapi import APIRouter, Depends\nfrom sqlalchemy import text\n\nrouter = APIRouter()\n\n@router.get('/health')\ndef health():\n    # liveness: is the process alive at all?\n    return {'status': 'ok'}\n\n@router.get('/ready')\ndef ready(db = Depends(get_db)):\n    # readiness: can it actually serve traffic?\n    checks = {}\n    try:\n        db.execute(text('SELECT 1')); checks['db'] = 'ok'\n    except Exception as e:\n        checks['db'] = f'fail: {e}'\n\n    checks['model'] = 'ok' if ml.get('model') else 'not loaded'\n\n    ok = all(v == 'ok' for v in checks.values())\n    return JSONResponse(200 if ok else 503,\n                        {'status': 'ok' if ok else 'degraded', 'checks': checks})" },
    w: "The liveness/readiness split matters in deployment and the docker track uses it. Liveness answers *should this container be restarted?* Readiness answers *should traffic be sent here?* A model still loading is not ready and should not be restarted — conflating the two produces a restart loop, which is a confusing outage to debug at speed." } },

  { vocab: ["Dependency Injection"] }
 ],
 k: [
  "Type annotations are the contract: validation, serialisation, errors and docs all come from them.",
  "`response_model` filters output, which prevents accidentally leaking internal fields.",
  "Dependencies with `yield` guarantee cleanup, and `dependency_overrides` makes tests trivial.",
  "Load models and HTTP clients once in `lifespan`, never per request.",
  "Keep business logic in `services/` with no FastAPI imports, and validate all configuration at startup."
 ],
 r: ["API", "HTTP", "Dependency Injection"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "@app.post('/v1/predict', response_model=PredictOut)", w: "a typed endpoint that filters its own output" },
   { c: "top_k: int = Field(default=5, ge=1, le=50)", w: "a clamped range, validated before your code runs" },
   { c: "def get_db(): db = SessionLocal(); try: yield db; finally: db.close()", w: "a dependency that always cleans up" },
   { c: "app.dependency_overrides[current_user] = fake_user", w: "swap auth out for tests, in one line" },
   { c: "ml['model'] = joblib.load('model.pkl')  # in lifespan", w: "load once at startup, not per request" }
  ]
 }
}

]);
