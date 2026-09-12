/* Docker & Deployment — deploying and living with it. */
TD.addLessons("docker", [

{
 t: "Getting a URL That Works",
 m: "ship",
 lvl: "core",
 s: "Registries, platforms, environment configuration and TLS — from your laptop to the internet.",
 goal: [
  "Push an image to a registry and deploy it",
  "Choose a platform from what your workload actually needs",
  "Configure secrets, domains and TLS without leaking anything"
 ],
 b: [
  { p: "You have an image that runs. Getting it onto the internet is four steps: push it to a registry, pick a platform, give it configuration, point a domain at it. None of them is hard; all of them have one detail that catches people." },

  { h: "Registries" },
  { code: { lang: "bash", t: "Push an image somewhere a platform can pull it",
    lines: [
     { c: "docker login ghcr.io -u <user>", w: "**GitHub Container Registry** — free for public images, and already connected to where your code lives." },
     { c: "", w: "" },
     { c: "docker build -t ghcr.io/<user>/myapp:1.0.3 .", w: "**Tag with the registry path and a real version.**", hi: true },
     { c: "docker tag ghcr.io/<user>/myapp:1.0.3 ghcr.io/<user>/myapp:latest", w: "**Two tags on the same image.** `latest` for convenience, the version for rollback." },
     { c: "", w: "" },
     { c: "docker push ghcr.io/<user>/myapp:1.0.3", w: "" },
     { c: "docker push ghcr.io/<user>/myapp:latest", w: "" }
    ] } },

  { trap: "Never deploy `:latest` to production. It is a moving pointer, so *which version is running?* becomes unanswerable and rollback becomes guesswork. Tag with the git commit SHA — `myapp:a3f91c0` — and you can always answer both questions exactly. Use `latest` for local convenience only." },

  { code: { lang: "yaml", file: ".github/workflows/deploy.yaml", t: "Build and push on every merge",
    lines: [
     { c: "on:", w: "" },
     { c: "  push:", w: "" },
     { c: "    branches: [main]", w: "" },
     { c: "", w: "" },
     { c: "jobs:", w: "" },
     { c: "  build:", w: "" },
     { c: "    runs-on: ubuntu-latest", w: "" },
     { c: "    permissions:", w: "" },
     { c: "      contents: read", w: "" },
     { c: "      packages: write", w: "**Least privilege**, even in CI." },
     { c: "    steps:", w: "" },
     { c: "      - uses: actions/checkout@v4", w: "" },
     { c: "      - uses: docker/setup-buildx-action@v3", w: "**Buildx enables layer caching between runs**, which turns a five-minute CI build into one minute." },
     { c: "      - uses: docker/login-action@v3", w: "" },
     { c: "        with:", w: "" },
     { c: "          registry: ghcr.io", w: "" },
     { c: "          username: ${{ github.actor }}", w: "" },
     { c: "          password: ${{ secrets.GITHUB_TOKEN }}", w: "**Provided automatically.** No secret to manage." },
     { c: "      - uses: docker/build-push-action@v5", w: "" },
     { c: "        with:", w: "" },
     { c: "          push: true", w: "" },
     { c: "          tags: |", w: "" },
     { c: "            ghcr.io/${{ github.repository }}:${{ github.sha }}", w: "**The commit SHA — always answerable.**", hi: true },
     { c: "            ghcr.io/${{ github.repository }}:latest", w: "" },
     { c: "          cache-from: type=gha", w: "**Reuse layers from previous runs.**", hi: true },
     { c: "          cache-to: type=gha,mode=max", w: "" }
    ] } },

  { h: "Choosing a platform" },
  { tbl: { t: "Where to run a container, honestly",
    h: ["Platform", "Good for", "Watch out for"],
    rows: [
     ["**Render / Railway**", "**Start here.** Push a repo, get a URL, TLS included", "More expensive per unit at scale"],
     ["**Google Cloud Run**", "**Excellent for AI APIs.** Scale to zero, per-request billing, generous free tier", "Cold starts — significant with a large model"],
     ["**Fly.io**", "Multi-region, persistent volumes, cheap", "Smaller ecosystem"],
     ["**AWS ECS / Fargate**", "You are already on AWS", "IAM and networking are a genuine learning curve"],
     ["**A single VPS + Compose**", "**Cheapest, and fine for real services.** ₹500/month runs a lot", "You patch, back up and monitor it yourself"],
     ["**Kubernetes**", "Many services, a platform team", "**Almost certainly not yet.** It is a solution to a scale problem you probably do not have"]
    ] } },

  { n: "For a portfolio project or a first product, use Cloud Run or Render. The engineering effort saved is worth far more than the cost difference at low volume, and *I deployed it on Kubernetes* impresses nobody who has actually operated Kubernetes.",
    nt: "The recommendation" },

  { code: { lang: "bash", t: "Cloud Run, end to end",
    lines: [
     { c: "gcloud run deploy myapp \\", w: "" },
     { c: "  --image ghcr.io/<user>/myapp:a3f91c0 \\", w: "**A specific version.**" },
     { c: "  --region asia-south1 \\", w: "**Mumbai.** Region choice is a latency decision — pick one near your users." },
     { c: "  --allow-unauthenticated \\", w: "**Public.** Omit for an internal service." },
     { c: "  --port 8000 \\", w: "**Must match what your container listens on.**" },
     { c: "  --memory 2Gi --cpu 2 \\", w: "**Size for the model.** An embedding model needs more than a plain web service." },
     { c: "  --min-instances 0 \\", w: "**Scale to zero — you pay nothing when idle.** The trade is a cold start on the next request.", hi: true },
     { c: "  --max-instances 10 \\", w: "**Always set a maximum.** Without one, a traffic spike or a loop becomes an unbounded bill." },
     { c: "  --concurrency 20 \\", w: "**Requests per instance.** For an I/O-bound AI service, higher is better — it is waiting, not computing." },
     { c: "  --timeout 300 \\", w: "**Long enough for a slow generation.**" },
     { c: "  --set-secrets ANTHROPIC_API_KEY=anthropic-key:latest", w: "**From Secret Manager, not an environment variable in the deploy command** — which would appear in your shell history and the deployment log.", hi: true }
    ] } },

  { h: "Cold starts, which matter more for AI" },
  { code: { lang: "text", t: "Where a cold start goes",
    lines: [
     { c: "  pull image (900 MB)          8s   -> smaller image helps directly" },
     { c: "  start container              1s" },
     { c: "  import torch                 4s   -> unavoidable if you need it" },
     { c: "  load embedding model        12s   -> the dominant term", hi: true },
     { c: "  ready                       25s" },
     { c: "" },
     { c: "  Fixes, in order of effect:" },
     { c: "   - min-instances 1        (costs money, removes the problem)" },
     { c: "   - bake the model into a mounted volume, not downloaded" },
     { c: "   - smaller model / quantised" },
     { c: "   - call an embedding API instead of self-hosting", hi: true },
     { c: "   - smaller image" }
    ],
    after: "A twenty-five second cold start means the first user after an idle period waits twenty-five seconds. For a demo that is acceptable; for a product it is not. `--min-instances 1` costs a few dollars a month and eliminates it, which is usually the right trade." } },

  { h: "Configuration and secrets" },
  { l: [
   "**Configuration from the environment**, always. The same image runs in staging and production with different variables — that is the whole point of a container.",
   "**Secrets from a secret manager**, injected at runtime. Never in the image, never in the deploy command, never in a committed file.",
   "**Validate at startup** with your Settings object. Fail loudly and immediately on a missing variable rather than at 3am on one code path.",
   "**Never write secrets to logs.** Deployment platforms log the commands they run."
  ] },

  { h: "Domains and TLS" },
  { code: { lang: "bash",
    lines: [
     { c: "# Managed platforms handle TLS for you:", w: "" },
     { c: "gcloud run domain-mappings create --service myapp --domain api.example.com", w: "**Certificate provisioned and renewed automatically.**", hi: true },
     { c: "", w: "" },
     { c: "# On your own VPS, Caddy is the simplest option:", w: "" },
     { c: "# Caddyfile", w: "" },
     { c: "#   api.example.com {", w: "" },
     { c: "#       reverse_proxy api:8000", w: "" },
     { c: "#   }", w: "**Three lines, and Caddy obtains and renews a Let's Encrypt certificate automatically.** Nginx needs certbot and more configuration for the same result.", hi: true }
    ] } },

  { tryit: { t: "Deploy something you can send someone",
    task: "Take a service you have built. Push the image to GHCR tagged with the commit SHA, deploy to Cloud Run or Render, configure a secret through the platform's secret store, and verify the health endpoint over HTTPS. Then measure the cold start and decide whether to pay for min-instances.",
    hint: "Measure the cold start honestly: wait fifteen minutes for it to scale to zero, then time the first request against the second.",
    sol: { lang: "bash", code: "# cold start, measured\ncurl -w '\\ncold: %{time_total}s\\n' -o /dev/null -s https://myapp.run.app/health\ncurl -w 'warm: %{time_total}s\\n'  -o /dev/null -s https://myapp.run.app/health\n\n# cold: 24.8s\n# warm:  0.31s\n\n# with --min-instances 1:\n# cold:  0.34s\n# warm:  0.29s\n#\n# cost of min-instances 1 on a 2Gi/2cpu service:\n#   roughly $25-35/month idle\n#\n# The decision: for a portfolio link somebody clicks once,\n# 25s is survivable and free. For anything with real users,\n# pay it -- 25 seconds of silence reads as broken." },
    w: "You now have a URL you can put in a resume, and more importantly you know its cold start number and can explain the trade you made. That specificity — *it is 25 seconds cold, 300ms warm, and here is why I chose not to pay for warm instances* — is what makes a project sound like engineering rather than a tutorial you followed." } },

  { vocab: ["Container Registry", "CI/CD", "TLS", "Cold Start", "Deployment"] }
 ],
 k: [
  "Tag images with the commit SHA; never deploy `:latest`, or you cannot answer what is running.",
  "Cache layers in CI with buildx, and let the pipeline build and push on merge.",
  "Start with Cloud Run or Render; Kubernetes is a solution to a scale problem you probably do not have.",
  "Always set max-instances, or a spike becomes an unbounded bill.",
  "Cold starts are dominated by model loading — the fix is min-instances, a smaller model, or an API."
 ],
 r: ["Container Registry", "CI/CD", "Cloud Computing", "Deployment", "Docker"],
 drill: {
  lang: "bash",
  reps: 3,
  items: [
   { c: "docker build -t ghcr.io/user/app:$(git rev-parse --short HEAD) .", w: "tag with the commit, so rollback is possible" },
   { c: "cache-from: type=gha", w: "reuse layers between CI runs" },
   { c: "--min-instances 0 --max-instances 10", w: "scale to zero, and cap the bill" },
   { c: "--set-secrets KEY=secret-name:latest", w: "inject a secret at runtime, not in the command" }
  ]
 }
},

{
 t: "Living With It in Production",
 m: "ops",
 lvl: "core",
 s: "Logs, health, limits, cost — and what to do when it is on fire.",
 goal: [
  "Emit logs a machine can query and a human can read",
  "Set health checks, restart policies and resource limits correctly",
  "Diagnose a production incident with a repeatable sequence"
 ],
 b: [
  { p: "Deployment is the beginning. What follows is the part nobody covers: making the thing observable, keeping the bill sane, and having a method for when it breaks at an inconvenient hour." },

  { h: "Logs" },
  { code: { lang: "python", t: "Structured logging, which costs nothing extra",
    lines: [
     { c: "import structlog, sys, logging", w: "" },
     { c: "", w: "" },
     { c: "structlog.configure(", w: "" },
     { c: "    processors=[", w: "" },
     { c: "        structlog.contextvars.merge_contextvars,", w: "**Adds request-scoped context automatically** — bind the request id once and every log line in that request carries it.", hi: true },
     { c: "        structlog.processors.add_log_level,", w: "" },
     { c: "        structlog.processors.TimeStamper(fmt='iso'),", w: "" },
     { c: "        structlog.processors.JSONRenderer(),", w: "**JSON to stdout.** Every platform collects stdout, and JSON means you can query it.", hi: true },
     { c: "    ],", w: "" },
     { c: ")", w: "" },
     { c: "", w: "" },
     { c: "log = structlog.get_logger()", w: "" },
     { c: "", w: "" },
     { c: "structlog.contextvars.bind_contextvars(request_id=rid, user_id=uid)", w: "**Bind once per request, in middleware.**" },
     { c: "log.info('answered', latency_ms=812, tokens=1240, cost_usd=0.014)", w: "**Fields, not a formatted string.** Now you can ask *what was p95 latency for user X yesterday* instead of grepping.", hi: true }
    ],
    out: '{"event":"answered","request_id":"9f2c","user_id":"u_88","latency_ms":812,"tokens":1240,"cost_usd":0.014,"level":"info","timestamp":"2026-08-28T09:14:22Z"}' } },

  { l: [
   "**Log to stdout, never to a file.** In a container, files vanish with the container and nothing collects them.",
   "**One line per event, as JSON.** Multi-line tracebacks break most log collectors — configure your logger to serialise exceptions into a single field.",
   "**Include the request id everywhere**, and return it to the client. That id is what turns *a user says it was slow* into a query.",
   "**Never log secrets or PII.** Redact before the call, as the guardrails lesson covered.",
   "**Set a retention period.** Logs are useful for a fortnight and a liability after a year."
  ] },

  { h: "Health, restarts and shutdown" },
  { code: { lang: "python", t: "Shutting down without dropping requests",
    lines: [
     { c: "import signal, asyncio", w: "" },
     { c: "", w: "" },
     { c: "shutting_down = False", w: "" },
     { c: "", w: "" },
     { c: "@app.get('/ready')", w: "" },
     { c: "def ready():", w: "" },
     { c: "    if shutting_down:", w: "" },
     { c: "        return JSONResponse(503, {'status': 'draining'})", w: "**Fail readiness first**, so the load balancer stops sending new requests while in-flight ones finish.", hi: true },
     { c: "    return {'status': 'ok'}", w: "" },
     { c: "", w: "" },
     { c: "def handle_sigterm(*_):", w: "" },
     { c: "    global shutting_down", w: "" },
     { c: "    shutting_down = True", w: "**SIGTERM is what an orchestrator sends before SIGKILL** — usually 30 seconds of grace. Use it." },
     { c: "", w: "" },
     { c: "signal.signal(signal.SIGTERM, handle_sigterm)", w: "" }
    ],
    after: "Without this, every deploy kills in-flight requests and users see errors during what should be an invisible rollout. It is about fifteen lines and it is the difference between a deploy nobody notices and one that produces support tickets." } },

  { h: "Cost control" },
  { tbl: { t: "Where the money goes in a small AI service",
    h: ["Line", "Typical", "Lever"],
    rows: [
     ["**Model API calls**", "**60–85%**", "**The LLM ops lesson.** Caching, routing, shorter output"],
     ["Compute", "10–25%", "Scale to zero, right-size memory, higher concurrency"],
     ["Database", "5–15%", "A managed instance one size down than you think"],
     ["Egress", "1–5%", "Compress responses; keep services in one region"],
     ["Logs and monitoring", "**1–20%**", "**Frequently a surprise.** Verbose debug logging in production can cost more than the database"]
    ] } },

  { code: { lang: "bash", t: "The controls to set on day one",
    lines: [
     { c: "gcloud run services update myapp --max-instances 10", w: "**A ceiling on scale.** Prevents a loop or a spike becoming an unbounded bill.", hi: true },
     { c: "", w: "" },
     { c: "gcloud billing budgets create --display-name 'myapp' \\", w: "" },
     { c: "  --budget-amount 100 --threshold-rule percent=0.5,percent=0.9", w: "**A budget alert at 50% and 90%.** Set this before you deploy, not after the first invoice." },
     { c: "", w: "" },
     { c: "# and in your own code, per user:", w: "" },
     { c: "if await daily_spend(user_id) > user.daily_limit:", w: "**Application-level cost limits.** The platform cannot know that one user is running up your model bill.", hi: true },
     { c: "    raise HTTPException(429, 'daily quota exceeded')", w: "" }
    ] } },

  { h: "The incident sequence" },
  { ol: [
   "**Is it up?** Hit the health endpoint. If it fails, check whether instances exist at all — a failed deploy or a crash loop.",
   "**What changed?** Deploys, configuration, dependency versions, provider status. Ninety percent of incidents follow a change, and it is usually recent.",
   "**Read the logs**, filtered to errors, for the ten minutes before the first report. Not the last line — the first failure.",
   "**Check the dependencies.** Database connections, Redis, the model provider's status page. Your outage is frequently theirs.",
   "**Check resources.** Memory, CPU, connection pool, queue depth. Exit 137 means OOM.",
   "**Roll back if you can.** Restoring service beats diagnosing. Investigate from the logs afterwards, with users unaffected.",
   "**Write it down** while it is fresh: what happened, why, what would have caught it earlier. Add that check."
  ] },

  { code: { lang: "bash", t: "The commands you want ready in advance",
    lines: [
     { c: "curl -s -o /dev/null -w '%{http_code} %{time_total}s\\n' $URL/health", w: "**Is it up, and how slow.**" },
     { c: "gcloud run revisions list --service myapp --limit 5", w: "**What is deployed, and what was before it.**" },
     { c: "gcloud run services update-traffic myapp --to-revisions=PREV=100", w: "**Roll back in seconds.** Know this command before you need it.", hi: true },
     { c: "gcloud logging read 'severity>=ERROR' --limit 50 --format json", w: "" },
     { c: "docker stats", w: "**On a VPS: memory and CPU per container.**" }
    ] } },

  { n: "Practise the rollback once, deliberately, on a quiet afternoon. The first time you run a rollback command should not be during an incident with a director watching. This is a fifteen-minute exercise that pays for itself the first time something goes wrong.",
    nt: "The rehearsal worth doing" },

  { h: "Backups" },
  { l: [
   "**Managed database backups on, with a retention you have checked.** Most providers default to something short.",
   "**Test a restore.** A backup nobody has restored is a hypothesis, not a backup — and restores fail for boring reasons like version mismatches.",
   "**Volumes are not backed up** by default. Anything in a Docker volume on a VPS needs its own backup job.",
   "**Object storage needs versioning** turned on, or a bad deploy that overwrites files is unrecoverable.",
   "**Your embeddings are derived data**, so they are recoverable in principle — but re-embedding a large corpus takes hours and costs money. Back them up anyway."
  ] },

  { tryit: { t: "Break production on purpose",
    task: "On a deployed service: trigger a rollback and time it; cause an OOM by lowering the memory limit; stop the database and see what the API does; and check whether your logs let you find one specific user's request from an hour ago. Fix whatever you could not do.",
    hint: "The log query is the one most people fail. If you cannot find a single request by id, your logging is not structured enough to be useful during an incident.",
    sol: { lang: "bash", code: "# 1. rollback drill -- time it\ntime gcloud run services update-traffic myapp \\\n     --to-revisions=myapp-00042-abc=100\n# should be under 30 seconds\n\n# 2. OOM on purpose\ngcloud run services update myapp --memory 256Mi\n# then load the model -> container killed, 137 in the logs\n# CHECK: does your alerting notice, or did you only find out\n#        because you were looking?\n\n# 3. dependency failure\n# stop the database, then:\ncurl $URL/ready    # -> 503 with which check failed?\ncurl $URL/v1/ask   # -> 503 with a useful message, or a\n#                       30-second timeout and a 500?\n\n# 4. the log query that matters\ngcloud logging read \\\n  'jsonPayload.request_id=\"9f2c1e04\"' --limit 20\n# If this returns nothing, your logs are strings, not fields." },
    w: "Most people fail at least two of these the first time — usually the alerting on the OOM and the per-request log query. Both are quick fixes and both are the difference between a ten-minute incident and a two-hour one. Doing this drill on a deployed portfolio project also gives you something specific and unusual to talk about in an interview." } },

  { vocab: ["Observability", "Health Check", "Rollback", "Incident Response"] }
 ],
 k: [
  "Log JSON to stdout with a request id bound per request — fields, not formatted strings.",
  "Fail readiness before shutting down so in-flight requests finish and deploys go unnoticed.",
  "Set max-instances, a billing budget and per-user cost limits before you deploy, not after.",
  "Rolling back beats diagnosing; practise the rollback command before you need it.",
  "A backup nobody has restored is a hypothesis — and Docker volumes are not backed up by default."
 ],
 r: ["Observability", "Logging", "Monitoring", "DevOps", "Deployment", "Incident Response"],
 drill: {
  lang: "bash",
  reps: 3,
  items: [
   { c: "log.info('answered', latency_ms=812, cost_usd=0.014)", w: "structured fields you can query later" },
   { c: "structlog.contextvars.bind_contextvars(request_id=rid)", w: "bind once, appears on every line" },
   { c: "gcloud run services update-traffic myapp --to-revisions=PREV=100", w: "the rollback command, known in advance" },
   { c: "gcloud logging read 'jsonPayload.request_id=\"9f2c\"'", w: "find one user's request during an incident" }
  ]
 }
}

]);
