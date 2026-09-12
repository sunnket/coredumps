/* Docker & Deployment — running containers and Compose. */
TD.addLessons("docker", [

{
 t: "Running, Debugging and the Container That Will Not Start",
 m: "run",
 lvl: "core",
 s: "Ports, environment, logs, shells — and a method for the five ways it fails.",
 goal: [
  "Configure a container's ports, environment and storage correctly",
  "Debug a container that exits immediately",
  "Read logs and get inside a running container"
 ],
 b: [
  { p: "Most container trouble is one of five failures, and each has a specific diagnostic. Learning the method is worth more than learning more flags." },

  { h: "The five failures" },
  { tbl: { t: "Diagnose by symptom",
    h: ["Symptom", "Usually", "Check"],
    rows: [
     ["**Exits immediately, code 0**", "The main process finished. A container lives exactly as long as PID 1", "`docker logs`. A container running `bash` with no TTY exits at once"],
     ["**Exits with code 1**", "The application crashed", "**`docker logs`.** The traceback is there"],
     ["**Exits with code 137**", "**Killed — out of memory**", "`docker stats`, then raise the memory limit. 137 is 128+9, meaning SIGKILL"],
     ["**Runs, unreachable**", "Port not published, or bound to 127.0.0.1 inside", "`docker port <name>`, and check the bind address in your start command"],
     ["**Runs, cannot reach a dependency**", "Not on the same network, or using `localhost`", "**Inside a container, `localhost` is the container itself.** Use the other container's name"]
    ] } },

  { n: "`localhost` inside a container means *this container*. Your database is not there. This single misunderstanding accounts for an enormous share of first-week container confusion — the fix is to use the service name as the hostname, which works because containers on a shared network resolve each other by name.",
    nt: "The mistake everyone makes exactly once" },

  { code: { lang: "bash", t: "The debugging sequence",
    lines: [
     { c: "docker ps -a", w: "**Is it running, or did it exit?** And with what code." },
     { c: "docker logs <name>", w: "**Almost always contains the answer.** Read all of it, not the last line." },
     { c: "docker logs --tail 50 -f <name>", w: "Follow live." },
     { c: "", w: "" },
     { c: "docker exec -it <name> sh", w: "**Get inside a running container.** Then check files, environment and connectivity from where the app actually lives.", hi: true },
     { c: "", w: "" },
     { c: "docker run --rm -it --entrypoint sh myapp:1.0", w: "**When it exits too fast to exec into.** Overrides the start command and drops you into a shell instead.", hi: true },
     { c: "", w: "" },
     { c: "docker inspect <name>", w: "Everything: mounts, networks, environment, the resolved command." },
     { c: "docker stats", w: "**Live CPU and memory.** How you confirm an OOM kill." },
     { c: "docker port <name>", w: "What is actually published." }
    ] } },

  { h: "Environment and configuration" },
  { code: { lang: "bash",
    lines: [
     { c: "docker run -e LOG_LEVEL=debug -e ENV=staging myapp", w: "**One at a time.**" },
     { c: "docker run --env-file .env myapp", w: "**From a file.** Convenient locally, and note the file itself is not in the image — that is the point." },
     { c: "", w: "" },
     { c: "docker run -e API_KEY=$API_KEY myapp", w: "**Pass through from your shell**, so the secret never appears in the command or in shell history.", hi: true },
     { c: "", w: "" },
     { c: "# NEVER:", w: "" },
     { c: "# ENV API_KEY=sk-abc123    (in a Dockerfile)", w: "**Baked into the image, visible in `docker history` to anyone who pulls it.**", hi: true }
    ] } },

  { h: "Resource limits" },
  { code: { lang: "bash", t: "Bound it, or one container takes the host down",
    lines: [
     { c: "docker run \\", w: "" },
     { c: "  --memory=2g \\", w: "**Hard limit. Exceeding it means SIGKILL — exit 137.**", hi: true },
     { c: "  --memory-reservation=1g \\", w: "A soft target under pressure." },
     { c: "  --cpus=1.5 \\", w: "**One and a half cores.** Prevents one container starving everything else." },
     { c: "  --restart=unless-stopped \\", w: "**Restart on crash and on host reboot**, but not if you stopped it deliberately." },
     { c: "  myapp:1.0", w: "" }
    ],
    after: "A Python service that loads a large model can quietly use several gigabytes. Without a limit it competes with everything else on the host; with one, it fails predictably and visibly, which is much easier to diagnose." } },

  { tryit: { t: "Cause each failure deliberately",
    task: "Produce all five failures on purpose: a container that exits 0, one that crashes with 1, one killed for memory (137), one running but unreachable, and one that cannot reach its database. Record the exact diagnostic that identified each.",
    hint: "For 137, run a Python container with `--memory=64m` and allocate a large list. For unreachable, bind to `127.0.0.1` inside the container and publish the port anyway.",
    sol: { lang: "bash", code: "# 1. exits 0 -- the process simply finished\ndocker run --name a python:3.12-slim python -c 'print(\"done\")'\ndocker ps -a --filter name=a --format '{{.Status}}'\n# Exited (0)\n\n# 2. exits 1 -- crash\ndocker run --name b python:3.12-slim python -c 'raise SystemExit(1)'\ndocker logs b\n\n# 3. exits 137 -- OOM killed\ndocker run --name c --memory=64m python:3.12-slim \\\n  python -c 'x = [0] * 100_000_000'\ndocker inspect c --format '{{.State.OOMKilled}} {{.State.ExitCode}}'\n# true 137\n\n# 4. running, unreachable -- bound to localhost INSIDE\ndocker run -d --name d -p 8000:8000 python:3.12-slim \\\n  python -m http.server 8000 --bind 127.0.0.1\ncurl -m 3 http://localhost:8000    # hangs / refused\ndocker logs d                      # no errors at all -- that is the tell\n\n# 5. cannot reach dependency\ndocker run --rm python:3.12-slim \\\n  python -c \"import socket; socket.create_connection(('localhost',5432),3)\"\n# ConnectionRefused -- 'localhost' is this container, not the host" },
    w: "Case 4 is the instructive one: no error anywhere. The container is healthy, the port is published, the logs are clean, and nothing works. Only knowing to check the bind address finds it — which is why `--host 0.0.0.0` is in every container start command in this track." } },

  { vocab: ["Docker", "Container", "Environment Variable"] }
 ],
 k: [
  "A container lives exactly as long as its main process; exit 0 usually means the command simply finished.",
  "Exit 137 is an out-of-memory kill; `docker inspect` confirms it with `OOMKilled`.",
  "`localhost` inside a container is that container — use the other container's name as a hostname.",
  "`--entrypoint sh` gets you into an image that exits too fast to exec into.",
  "Set memory and CPU limits, or one container can take the whole host with it."
 ],
 r: ["Docker", "Container", "DevOps", "Deployment"],
 drill: {
  lang: "bash",
  reps: 3,
  items: [
   { c: "docker ps -a", w: "did it exit, and with what code" },
   { c: "docker run --rm -it --entrypoint sh myapp:1.0", w: "get inside an image that will not stay up" },
   { c: "docker inspect <name> --format '{{.State.OOMKilled}}'", w: "confirm a memory kill" },
   { c: "docker run --memory=2g --cpus=1.5 --restart=unless-stopped myapp", w: "bounded and self-healing" }
  ]
 }
},

{
 t: "Compose: Your Whole Stack in One File",
 m: "compose",
 lvl: "core",
 s: "API, database, cache and vector store, started with one command.",
 goal: [
  "Define a multi-service stack in a Compose file",
  "Use dependency conditions so services start in a usable order",
  "Keep development and production configurations from diverging"
 ],
 b: [
  { p: "Running five containers by hand with the right networks, volumes, environment and ports is tedious and error-prone. Compose puts the whole thing in one file, and `docker compose up` becomes the entire onboarding instruction for a new contributor." },

  { h: "The whole stack" },
  { code: { lang: "yaml", file: "compose.yaml",
    lines: [
     { c: "services:", w: "" },
     { c: "", w: "" },
     { c: "  api:", w: "**The service name is also its hostname.** Other containers reach it at `http://api:8000`.", hi: true },
     { c: "    build:", w: "" },
     { c: "      context: .", w: "" },
     { c: "      dockerfile: Dockerfile", w: "" },
     { c: "    ports:", w: "" },
     { c: "      - \"8000:8000\"", w: "**Only the API needs publishing.** Databases should not be reachable from outside the stack." },
     { c: "    environment:", w: "" },
     { c: "      DATABASE_URL: postgresql://postgres:devpass@db:5432/app", w: "**`db` is the service name.** Not localhost, not an IP.", hi: true },
     { c: "      REDIS_URL: redis://cache:6379", w: "" },
     { c: "      ANTHROPIC_API_KEY: ${ANTHROPIC_API_KEY}", w: "**From your shell or a `.env` file.** Never written literally here — this file is committed.", hi: true },
     { c: "    depends_on:", w: "" },
     { c: "      db:", w: "" },
     { c: "        condition: service_healthy", w: "**Wait until the healthcheck passes**, not merely until the container starts. Plain `depends_on` only waits for *started*, which is almost never what you want.", hi: true },
     { c: "      cache:", w: "" },
     { c: "        condition: service_started", w: "" },
     { c: "    volumes:", w: "" },
     { c: "      - ./app:/app/app", w: "**Bind mount for development**, so code changes appear without rebuilding." },
     { c: "    command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload", w: "**Overrides the Dockerfile CMD.** `--reload` for development only." },
     { c: "", w: "" },
     { c: "  db:", w: "" },
     { c: "    image: postgres:16", w: "" },
     { c: "    environment:", w: "" },
     { c: "      POSTGRES_PASSWORD: devpass", w: "**Development only.** Production uses a real secret store." },
     { c: "      POSTGRES_DB: app", w: "" },
     { c: "    volumes:", w: "" },
     { c: "      - pgdata:/var/lib/postgresql/data", w: "" },
     { c: "      - ./sql/init.sql:/docker-entrypoint-initdb.d/init.sql", w: "**Anything in that directory runs on first initialisation.** A neat way to seed a schema." },
     { c: "    healthcheck:", w: "" },
     { c: "      test: [\"CMD-SHELL\", \"pg_isready -U postgres\"]", w: "**What `service_healthy` above waits for.**", hi: true },
     { c: "      interval: 5s", w: "" },
     { c: "      retries: 10", w: "" },
     { c: "", w: "" },
     { c: "  cache:", w: "" },
     { c: "    image: redis:7-alpine", w: "**Alpine is fine here** — Redis has no Python wheels to compile." },
     { c: "    command: redis-server --save 60 1 --maxmemory 256mb --maxmemory-policy allkeys-lru", w: "**Bound the memory and evict oldest.** An unbounded Redis will eventually consume everything." },
     { c: "", w: "" },
     { c: "  worker:", w: "" },
     { c: "    build: .", w: "**The same image as the API**, different command. This is the normal pattern.", hi: true },
     { c: "    command: celery -A app.worker worker --loglevel=info", w: "" },
     { c: "    environment:", w: "" },
     { c: "      DATABASE_URL: postgresql://postgres:devpass@db:5432/app", w: "" },
     { c: "      REDIS_URL: redis://cache:6379", w: "" },
     { c: "    depends_on:", w: "" },
     { c: "      db: { condition: service_healthy }", w: "" },
     { c: "", w: "" },
     { c: "volumes:", w: "" },
     { c: "  pgdata:", w: "**Declare named volumes**, or Compose will not create them." }
    ] } },

  { code: { lang: "bash", t: "Working with it",
    lines: [
     { c: "docker compose up", w: "**Start everything, logs in the foreground.**" },
     { c: "docker compose up -d", w: "Detached." },
     { c: "docker compose up --build", w: "**Rebuild images first.** Forgetting this after a Dockerfile change is a common source of confusion." },
     { c: "", w: "" },
     { c: "docker compose logs -f api", w: "**One service's logs.**" },
     { c: "docker compose exec api sh", w: "A shell in the running API container." },
     { c: "docker compose exec db psql -U postgres app", w: "Straight into the database." },
     { c: "", w: "" },
     { c: "docker compose ps", w: "What is up, and health status." },
     { c: "docker compose restart api", w: "One service." },
     { c: "", w: "" },
     { c: "docker compose down", w: "**Stop and remove containers. Volumes survive.**" },
     { c: "docker compose down -v", w: "**Also delete the volumes — your database is gone.** Deliberate, occasionally exactly what you want.", hi: true }
    ] } },

  { h: "Dev and production without duplication" },
  { code: { lang: "yaml", file: "compose.override.yaml", t: "Compose merges this automatically",
    lines: [
     { c: "# Applied on top of compose.yaml when present.", w: "**Loaded automatically in development, absent in production.**", hi: true },
     { c: "services:", w: "" },
     { c: "  api:", w: "" },
     { c: "    volumes:", w: "" },
     { c: "      - ./app:/app/app", w: "**Live reload, development only.**" },
     { c: "    command: uvicorn app.main:app --host 0.0.0.0 --reload", w: "" },
     { c: "    environment:", w: "" },
     { c: "      LOG_LEVEL: debug", w: "" },
     { c: "  db:", w: "" },
     { c: "    ports:", w: "" },
     { c: "      - \"5432:5432\"", w: "**Expose the database to your machine for a GUI client** — never in production." }
    ],
    after: "Keep `compose.yaml` production-shaped and put every development convenience in the override. Then `docker compose -f compose.yaml up` on a server gives you the production configuration with no editing and no chance of shipping `--reload`." } },

  { trap: "Do not commit a `.env` containing real secrets, and do not write secrets into `compose.yaml`. Use `${VAR}` interpolation, commit a `.env.example` with the keys and no values, and keep `.env` in `.gitignore`. This is the most common way a real API key reaches a public repository." },

  { h: "Adding a vector store" },
  { code: { lang: "yaml", t: "Two options for a RAG stack",
    lines: [
     { c: "  # option 1: pgvector -- one fewer system", w: "" },
     { c: "  db:", w: "" },
     { c: "    image: pgvector/pgvector:pg16", w: "**Postgres with the extension preinstalled.** Start here.", hi: true },
     { c: "", w: "" },
     { c: "  # option 2: a dedicated vector database", w: "" },
     { c: "  qdrant:", w: "" },
     { c: "    image: qdrant/qdrant:latest", w: "" },
     { c: "    ports:", w: "" },
     { c: "      - \"6333:6333\"", w: "**Publish only to browse its dashboard locally.**" },
     { c: "    volumes:", w: "" },
     { c: "      - qdrant_data:/qdrant/storage", w: "**Persist, or you re-embed your whole corpus after every restart** — which on a large corpus is hours and real money.", hi: true }
    ] } },

  { h: "What Compose is not" },
  { l: [
   "**Not an orchestrator.** No rolling deploys, no autoscaling, no self-healing across hosts. For that you want Kubernetes, ECS or a managed platform.",
   "**Fine on a single server**, and genuinely enough for a great many small production services. Do not let anyone tell you a single Compose host is unprofessional — it is simple, and simplicity has real operational value.",
   "**Excellent for development and CI**, universally.",
   "**The natural next step** is a managed container platform — Cloud Run, Render, Railway, Fly — which the deployment lesson covers."
  ] },

  { tryit: { t: "One command onboarding",
    task: "Write a Compose file for an API, Postgres with pgvector, Redis and a worker. Include healthchecks and dependency conditions. Then delete every container, image and volume on your machine and confirm `docker compose up` brings the whole stack back from nothing.",
    hint: "The clean-machine test is the point. Write down every manual step you had to take afterwards — each one is something missing from the file.",
    sol: { lang: "bash", code: "# the test that proves it\ndocker compose down -v\ndocker system prune -af --volumes\n\n# then, from a clean machine:\ngit clone <repo> && cd <repo>\ncp .env.example .env      # fill in ANTHROPIC_API_KEY\ndocker compose up --build\n\n# It should be working with NO other steps. If you had to:\n#   - create a database manually  -> add an init.sql mount\n#   - run migrations manually     -> add a migrate service\n#   - wait and retry              -> add healthcheck +\n#                                    condition: service_healthy\n#   - edit a config file          -> move it to environment:\n#\n# Every manual step is a line missing from compose.yaml,\n# and also a line missing from your README." },
    w: "A repository where `docker compose up` produces a working stack from a clean machine is a strong signal in a portfolio. It says the person thought about someone else running their code — and a reviewer who can start your project in one command is far more likely to actually look at it than one facing a page of setup instructions." } },

  { vocab: ["Healthcheck"] }
 ],
 k: [
  "The service name is the hostname — `db`, `cache`, `api` — never localhost.",
  "Use `depends_on` with `condition: service_healthy`, or your API starts before the database is ready.",
  "Keep `compose.yaml` production-shaped and put development conveniences in `compose.override.yaml`.",
  "Interpolate secrets with `${VAR}` and commit only a `.env.example`.",
  "Persist vector store data, or every restart costs you a full re-embedding run."
 ],
 r: ["Docker", "Container", "DevOps", "Deployment"],
 drill: {
  lang: "bash",
  reps: 3,
  items: [
   { c: "docker compose up --build", w: "rebuild and start the whole stack" },
   { c: "condition: service_healthy", w: "wait for ready, not merely for started" },
   { c: "DATABASE_URL: postgresql://user:pass@db:5432/app", w: "the service name is the hostname" },
   { c: "docker compose exec api sh", w: "a shell inside a running service" },
   { c: "docker compose down -v", w: "stop everything and delete the data, deliberately" }
  ]
 }
}

]);
