/* Docker & Deployment — the problem containers solve. */
TD.addLessons("docker", [

{
 t: "The Problem Containers Solve",
 m: "why",
 lvl: "core",
 s: "Four ideas, and why 'it works on my machine' was a genuine engineering crisis.",
 goal: [
  "Explain what a container is and how it differs from a virtual machine",
  "Distinguish image, container, layer and volume without hesitation",
  "Run something in a container and know what happened"
 ],
 b: [
  { p: "*It works on my machine* was a joke for twenty years and a real, expensive problem for the same twenty years. Your laptop had Python 3.11, CUDA 12 and a system library installed in 2023 by a tutorial you no longer remember. The server had none of that. Deployment meant reproducing an environment nobody had written down." },

  { h: "What a container is" },
  { p: "Your application plus every dependency it needs — libraries, runtime, system packages, configuration — packaged so it runs identically anywhere a container runtime exists." },

  { tbl: { t: "Container against virtual machine",
    h: ["", "Virtual machine", "Container"],
    rows: [
     ["**Contains**", "A whole operating system with its own kernel", "**Just your process** and its files"],
     ["**Size**", "Gigabytes", "Tens to hundreds of megabytes"],
     ["**Start time**", "Tens of seconds", "**Under a second**"],
     ["**Isolation**", "Strong — separate kernel", "**Weaker — shared kernel.** Namespaces and cgroups, not a hardware boundary"],
     ["**Density per host**", "A handful", "**Hundreds**"],
     ["**Right for**", "Different operating systems, hard security boundaries", "**Application deployment**, which is nearly everything"]
    ] } },

  { ana: "A virtual machine ships the whole house. A container ships the furniture and assumes the house is already there. That is why containers start in a second and weigh a tenth as much — and also why they are not a security boundary: everyone's furniture is in the same house, sharing the same foundations.",
    at: "The house and the furniture" },

  { n: "That last point has practical force. A container escape reaches the host kernel, so containers are an *isolation convenience*, not a sandbox for untrusted code. If you need to run code you do not trust — a user-submitted script, for instance — you need a virtual machine, gVisor, Firecracker or similar.",
    nt: "The limitation to remember" },

  { h: "The four ideas" },
  { tbl: { t: "The whole vocabulary",
    h: ["Term", "Is", "Analogy"],
    rows: [
     ["**Image**", "A frozen, read-only filesystem plus a start command", "**A class**"],
     ["**Container**", "One running instance of an image", "**An object.** One image, many containers"],
     ["**Layer**", "One filesystem change, stacked to form an image", "A git commit — cached and shared between images"],
     ["**Volume**", "Storage that outlives the container", "**A USB drive** you plug in. Everything else vanishes on removal"]
    ] } },

  { code: { lang: "bash", t: "The distinction, demonstrated",
    lines: [
     { c: "docker pull python:3.12-slim", w: "**Download an image.** It does not run." },
     { c: "docker images", w: "Images you have. Read-only, shareable." },
     { c: "", w: "" },
     { c: "docker run python:3.12-slim python -c 'print(1+1)'", w: "**Create a container from the image and run it.**", hi: true },
     { c: "docker run python:3.12-slim python -c 'print(2+2)'", w: "**A second container from the same image.** They do not know about each other." },
     { c: "", w: "" },
     { c: "docker ps", w: "Running containers. Both have exited, so this is empty." },
     { c: "docker ps -a", w: "**Including stopped ones.** Two containers, both exited — and both still taking disk space until removed." }
    ] } },

  { h: "Run something real" },
  { code: { lang: "bash", t: "Postgres in one command, with nothing installed",
    lines: [
     { c: "docker run -d \\", w: "**`-d` detached** — run in the background and return the prompt." },
     { c: "  --name pg \\", w: "**Name it**, so you can refer to it later without copying an id." },
     { c: "  -e POSTGRES_PASSWORD=devpass \\", w: "**Environment variables configure it.** This is how almost every official image is configured." },
     { c: "  -p 5432:5432 \\", w: "**host:container.** Without this the port is unreachable from your machine — the single most common beginner confusion.", hi: true },
     { c: "  -v pgdata:/var/lib/postgresql/data \\", w: "**A named volume.** Without it, every byte of your database is deleted when the container is removed.", hi: true },
     { c: "  postgres:16", w: "**Pin the major version.** `latest` will change under you and break something at an inconvenient moment." },
     { c: "", w: "" },
     { c: "docker logs -f pg", w: "**Follow the logs.** The first thing to run when a container will not work." },
     { c: "docker exec -it pg psql -U postgres", w: "**A shell inside the running container.** `-it` gives you an interactive terminal." },
     { c: "", w: "" },
     { c: "docker stop pg && docker rm pg", w: "**The data survives**, because it is in the volume, not the container." }
    ] } },

  { trap: "`-p 5432:5432` is host port to container port, in that order. Getting it backwards, or omitting it entirely, is the most common first-hour mistake — the container runs perfectly and nothing on your machine can reach it. And a container listening on `127.0.0.1` inside itself is unreachable regardless of port mapping; it must bind `0.0.0.0`." },

  { h: "Where the data goes" },
  { code: { lang: "bash", t: "Three storage options",
    lines: [
     { c: "docker run postgres:16", w: "**No volume.** Data lives in the container's writable layer and is destroyed with it. Fine for a throwaway test, catastrophic otherwise.", hi: true },
     { c: "", w: "" },
     { c: "docker run -v pgdata:/var/lib/postgresql/data postgres:16", w: "**Named volume.** Docker manages it. **The right default for databases.**", hi: true },
     { c: "", w: "" },
     { c: "docker run -v $(pwd)/app:/app python:3.12", w: "**Bind mount** — a real directory from your machine. **For development**, so code changes appear instantly without rebuilding. Avoid in production; it couples the container to the host's layout." }
    ] } },

  { h: "Why this changed deployment" },
  { l: [
   "**The environment became part of the artefact.** The dependency list stopped being tribal knowledge in a README and became a file that either builds or does not.",
   "**Tested and deployed became the same thing.** The image you tested is the image that runs, byte for byte.",
   "**Deployment became portable.** Every cloud takes a container, which keeps you able to move and therefore able to negotiate.",
   "**Onboarding collapsed from a day to a command.** New contributor, one `docker compose up`, working stack.",
   "**Local development stopped requiring installations.** Postgres, Redis and a vector database, running, none of them installed on your machine."
  ] },

  { h: "The commands worth knowing on day one" },
  { code: { lang: "bash",
    lines: [
     { c: "docker ps", w: "What is running." },
     { c: "docker ps -a", w: "Including stopped." },
     { c: "docker logs -f <name>", w: "**Follow the logs.** Where nearly every answer is." },
     { c: "docker exec -it <name> sh", w: "**A shell inside a running container.** For looking around when something is wrong.", hi: true },
     { c: "docker stop <name> / docker rm <name>", w: "Stop, then remove." },
     { c: "docker images", w: "Images on disk." },
     { c: "docker rmi <image>", w: "Remove an image." },
     { c: "docker system df", w: "**How much disk Docker is using.** Usually more than you expect." },
     { c: "docker system prune -a", w: "**Reclaim it.** Removes unused images, containers and networks. Named volumes are kept unless you add `--volumes`.", hi: true }
    ] } },

  { n: "Docker consumes disk relentlessly — every build leaves layers, every stopped container keeps its writable layer. `docker system df` then `docker system prune` is a routine worth running when your machine mysteriously fills up, which it will.",
    nt: "The maintenance nobody mentions" },

  { tryit: { t: "Run a stack you have not installed",
    task: "Run Postgres, Redis and a Python container. Connect to Postgres from the Python container. Then stop and remove everything, restart Postgres with the same volume, and confirm your data is still there.",
    hint: "Containers on the default bridge network cannot resolve each other by name. Create a network with `docker network create` and put both on it — then the container name works as a hostname.",
    sol: { lang: "bash", code: "docker network create devnet\n\ndocker run -d --name pg --network devnet \\\n  -e POSTGRES_PASSWORD=devpass \\\n  -v pgdata:/var/lib/postgresql/data postgres:16\n\ndocker run -d --name cache --network devnet redis:7\n\n# 'pg' resolves as a hostname because they share a network\ndocker run --rm -it --network devnet python:3.12-slim sh -c \\\n  \"pip install -q psycopg2-binary && python -c \\\"\nimport psycopg2\nc = psycopg2.connect(host='pg', user='postgres', password='devpass')\ncur = c.cursor()\ncur.execute('CREATE TABLE IF NOT EXISTS t (msg text)')\ncur.execute(\\\\\\\"INSERT INTO t VALUES ('survived')\\\\\\\")\nc.commit()\nprint('written')\n\\\"\"\n\n# destroy everything, then bring Postgres back on the same volume\ndocker rm -f pg cache\ndocker run -d --name pg --network devnet \\\n  -e POSTGRES_PASSWORD=devpass \\\n  -v pgdata:/var/lib/postgresql/data postgres:16\n\nsleep 3\ndocker exec pg psql -U postgres -c 'SELECT * FROM t;'\n#  msg\n# ----------\n#  survived      <- the volume outlived the container" },
    w: "Two things worth taking from this. Container names work as hostnames on a shared network, which is the whole of container networking in one sentence — and it is what Compose automates in the next-but-one lesson. And the volume outlived the container, which is exactly the property that makes containers safe to destroy freely." } },

  { vocab: ["Docker", "Container", "Container Image", "Virtual Machine"] }
 ],
 k: [
  "A container is your app plus its dependencies, sharing the host kernel — fast, small, and not a security boundary.",
  "Image is the class, container is the object, layer is a cached filesystem change, volume is storage that survives.",
  "`-p host:container` in that order, and the process must bind 0.0.0.0 to be reachable.",
  "Without a volume, all data dies with the container.",
  "Container names resolve as hostnames on a shared network — that is the whole of container networking."
 ],
 r: ["Docker", "Container", "DevOps", "Deployment"],
 drill: {
  lang: "bash",
  reps: 3,
  items: [
   { c: "docker run -d --name pg -p 5432:5432 -v pgdata:/var/lib/postgresql/data postgres:16", w: "a database, detached, mapped and persistent" },
   { c: "docker logs -f <name>", w: "the first thing to run when something is wrong" },
   { c: "docker exec -it <name> sh", w: "a shell inside a running container" },
   { c: "docker network create devnet", w: "a network so containers can find each other by name" },
   { c: "docker system prune -a", w: "reclaim the disk Docker has quietly consumed" }
  ]
 }
},

{
 t: "Dockerfiles That Build Small and Fast",
 m: "images",
 lvl: "core",
 s: "Layers, cache ordering and multi-stage builds — and why ML images get to eight gigabytes.",
 goal: [
  "Write a Dockerfile whose layer order exploits the cache",
  "Use multi-stage builds to keep build tools out of the final image",
  "Build a Python AI service image that is not enormous"
 ],
 b: [
  { p: "A Dockerfile is a recipe. Each instruction creates a layer, layers are cached by content, and a change to one invalidates every layer after it. Almost all Dockerfile skill is arranging instructions so that the expensive layers are cached." },

  { h: "The naive version, and why it is slow" },
  { vs: { t: "Layer ordering is the whole trick", lang: "dockerfile",
    bad: { c: "FROM python:3.12\n\nWORKDIR /app\nCOPY . .\nRUN pip install -r requirements.txt\n\nCMD [\"uvicorn\", \"app.main:app\"]", label: "The obvious order",
      w: "`COPY . .` comes before the install, so **any** source change invalidates the layer and pip reinstalls everything. Change one line of a comment and wait three minutes. Every single time." },
    good: { c: "FROM python:3.12-slim\n\nWORKDIR /app\nCOPY requirements.txt .\nRUN pip install --no-cache-dir \\\n    -r requirements.txt\n\nCOPY . .\n\nCMD [\"uvicorn\", \"app.main:app\"]", label: "Dependencies first",
      w: "Requirements are copied and installed *before* the source. Source changes invalidate only the last layer, so the install stays cached and rebuilds take seconds. This one reordering is the highest-value Dockerfile change there is." } } },

  { n: "The rule: **order instructions from least to most frequently changed.** Base image, then system packages, then dependencies, then application code. Your code changes fifty times a day; your dependencies change weekly; your base image changes monthly.",
    nt: "The rule that generates all the others" },

  { h: "Choosing a base image" },
  { tbl: { t: "The trade-offs",
    h: ["Base", "Size", "Use when"],
    rows: [
     ["`python:3.12`", "~1 GB", "Rarely. Includes a full build toolchain you do not need at runtime"],
     ["**`python:3.12-slim`**", "**~150 MB**", "**The default.** Debian-based, so most wheels install cleanly"],
     ["`python:3.12-alpine`", "~50 MB", "**Tempting and often a trap.** musl libc means many scientific packages have no wheel and must compile — slower builds, occasional subtle bugs"],
     ["`nvidia/cuda:...`", "2–4 GB", "GPU inference. Match the CUDA version to your PyTorch build exactly"],
     ["`gcr.io/distroless/python3`", "~50 MB", "Production hardening — no shell, so a much smaller attack surface. Harder to debug"]
    ] } },

  { trap: "Alpine looks like an easy win and frequently is not. NumPy, pandas, scikit-learn and PyTorch ship prebuilt wheels for glibc, not musl, so on Alpine pip compiles them from source — turning a 30-second install into a 20-minute one and producing an image that is sometimes larger than the slim version anyway. Use `slim` unless you have measured a reason not to." },

  { h: "Multi-stage builds" },
  { code: { lang: "dockerfile", file: "Dockerfile", t: "Build tools in, build tools out",
    lines: [
     { c: "# ---- build stage ----", w: "" },
     { c: "FROM python:3.12-slim AS builder", w: "**Named stage.**" },
     { c: "", w: "" },
     { c: "RUN apt-get update && apt-get install -y --no-install-recommends \\", w: "" },
     { c: "      build-essential gcc \\", w: "**Compilers, needed to build some wheels** and needed by nothing at runtime." },
     { c: " && rm -rf /var/lib/apt/lists/*", w: "**Same RUN, or the cleanup is a new layer and saves nothing** — the files are still in the layer below.", hi: true },
     { c: "", w: "" },
     { c: "WORKDIR /app", w: "" },
     { c: "COPY requirements.txt .", w: "" },
     { c: "RUN pip install --no-cache-dir --prefix=/install -r requirements.txt", w: "**Install into a known prefix** so the next stage can copy exactly that.", hi: true },
     { c: "", w: "" },
     { c: "# ---- runtime stage ----", w: "" },
     { c: "FROM python:3.12-slim", w: "**A fresh, clean base.** None of the build stage exists here." },
     { c: "", w: "" },
     { c: "RUN useradd -m -u 1000 appuser", w: "**A non-root user.** Running as root inside a container is an unnecessary risk and many platforms forbid it.", hi: true },
     { c: "", w: "" },
     { c: "COPY --from=builder /install /usr/local", w: "**Only the installed packages cross the boundary.** Compilers, headers and caches are left behind.", hi: true },
     { c: "", w: "" },
     { c: "WORKDIR /app", w: "" },
     { c: "COPY --chown=appuser:appuser . .", w: "" },
     { c: "USER appuser", w: "**Everything after this runs unprivileged.**" },
     { c: "", w: "" },
     { c: "ENV PYTHONUNBUFFERED=1 \\", w: "**Without this, logs are buffered and you see nothing until the buffer flushes** — which during a crash means you see nothing at all.", hi: true },
     { c: "    PYTHONDONTWRITEBYTECODE=1", w: "No `.pyc` files cluttering the image." },
     { c: "", w: "" },
     { c: "EXPOSE 8000", w: "**Documentation only.** It does not publish anything; `-p` does that." },
     { c: "", w: "" },
     { c: "HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \\", w: "**`start-period` matters for ML images** — a model taking 60 seconds to load must not be marked unhealthy while loading.", hi: true },
     { c: "  CMD python -c \"import urllib.request;urllib.request.urlopen('http://localhost:8000/health')\"", w: "" },
     { c: "", w: "" },
     { c: "CMD [\"uvicorn\", \"app.main:app\", \"--host\", \"0.0.0.0\", \"--port\", \"8000\"]", w: "**`0.0.0.0`, not 127.0.0.1.** Binding to localhost inside a container makes it unreachable from outside, and this catches almost everyone once.", hi: true }
    ] } },

  { h: ".dockerignore, which people forget" },
  { code: { lang: "text", file: ".dockerignore",
    lines: [
     { c: ".git", w: "**Often hundreds of megabytes**, and it is sent to the daemon on every build even if unused.", hi: true },
     { c: "__pycache__" },
     { c: "*.pyc" },
     { c: ".venv" },
     { c: "venv" },
     { c: "node_modules" },
     { c: ".env", w: "**Critical.** Without this your secrets are baked into the image and shipped to a registry.", hi: true },
     { c: "*.pkl" },
     { c: "data/" },
     { c: "notebooks/" },
     { c: ".pytest_cache" },
     { c: "Dockerfile" },
     { c: ".dockerignore" }
    ],
    after: "Everything not ignored is sent to the Docker daemon as build context before the build even starts. A repository with a `.git` directory and a data folder can spend a minute uploading context for a ten-second build — and the `.env` line prevents a genuine security incident." } },

  { h: "Why ML images get enormous" },
  { code: { lang: "dockerfile", t: "The line that costs six gigabytes",
    lines: [
     { c: "RUN pip install torch", w: "**~2.5 GB, and it pulls the full CUDA runtime** even on a machine with no GPU.", hi: true },
     { c: "", w: "" },
     { c: "# If you are serving on CPU:", w: "" },
     { c: "RUN pip install torch --index-url https://download.pytorch.org/whl/cpu", w: "**~200 MB.** A twelve-fold reduction from one flag.", hi: true },
     { c: "", w: "" },
     { c: "# And model weights:", w: "" },
     { c: "# DO NOT COPY THEM INTO THE IMAGE.", w: "**A 2 GB model in the image means every deploy pushes and pulls 2 GB.**" },
     { c: "# Download at startup from object storage, or mount a volume.", w: "**The image stays small; the model is data, not code.**", hi: true }
    ] } },

  { tbl: { t: "Where the megabytes actually go",
    h: ["Cause", "Cost", "Fix"],
    rows: [
     ["Full `python` base", "+850 MB", "Use `-slim`"],
     ["CUDA build of torch on a CPU service", "**+2.3 GB**", "The CPU index URL"],
     ["Build tools left in the final image", "+400 MB", "Multi-stage build"],
     ["pip cache", "+300 MB", "`--no-cache-dir`"],
     ["apt lists not cleaned", "+50 MB", "`rm -rf /var/lib/apt/lists/*` **in the same RUN**"],
     ["Model weights baked in", "**+1–10 GB**", "Fetch at startup, or mount"],
     ["`.git` and data in context", "varies", "`.dockerignore`"]
    ] } },

  { h: "Build and inspect" },
  { code: { lang: "bash",
    lines: [
     { c: "docker build -t myapp:1.0 .", w: "**Tag with a version, not just `latest`.** You will want to roll back.", hi: true },
     { c: "docker build -t myapp:1.0 --progress=plain .", w: "**Full build output**, which is what you want when a step fails." },
     { c: "", w: "" },
     { c: "docker images myapp", w: "How big is it?" },
     { c: "docker history myapp:1.0", w: "**Size per layer.** Shows you exactly which instruction cost the gigabyte.", hi: true },
     { c: "", w: "" },
     { c: "docker run --rm -it myapp:1.0 sh", w: "**Look inside.** `--rm` cleans up on exit." },
     { c: "docker run --rm myapp:1.0 pip list", w: "What actually got installed." }
    ] } },

  { tryit: { t: "Shrink an image by an order of magnitude",
    task: "Write the naive Dockerfile for a FastAPI service that uses torch and sentence-transformers. Record the size and the rebuild time after a one-line code change. Then apply: slim base, dependency-first ordering, CPU torch, multi-stage, `.dockerignore`, no-cache-dir. Record both again.",
    hint: "Use `docker history` after each change to see which one saved what. The CPU torch index and the multi-stage split are usually the two largest.",
    sol: { lang: "text", code: "A representative before-and-after:\n\n  naive Dockerfile\n    image size          6.8 GB\n    cold build          8m 40s\n    rebuild after a\n    one-line change     6m 10s      <- pip reran every time\n\n  optimised\n    image size          890 MB      (-87%)\n    cold build          4m 05s\n    rebuild after a\n    one-line change       11s       (-98%)\n\n  where it came from:\n    slim base                -850 MB\n    torch CPU index        -2,300 MB\n    multi-stage              -410 MB\n    --no-cache-dir           -290 MB\n    model weights removed  -2,100 MB\n    .dockerignore          (build context 340 MB -> 2 MB)" },
    w: "The eleven-second rebuild is the change you will feel every day, and it came entirely from moving two lines. The size reduction is what your CI, your registry bill and your deploy time will feel. Neither required any cleverness — only knowing that layers are cached in order." } },

  { vocab: ["Dockerfile", "Container Image", "Container Registry"] }
 ],
 k: [
  "Order instructions from least to most frequently changed; dependencies before source is the big one.",
  "Use `python:3.12-slim`, not full and usually not Alpine — musl means compiling scientific wheels from source.",
  "Multi-stage builds leave compilers and caches behind; copy only the installed packages forward.",
  "`.dockerignore` keeps `.git`, data and — critically — `.env` out of the image and the build context.",
  "Bind `0.0.0.0`, set `PYTHONUNBUFFERED=1`, run as a non-root user, and never bake model weights into the image."
 ],
 r: ["Dockerfile", "Container Image", "Docker", "Container Registry", "DevOps"],
 drill: {
  lang: "bash",
  reps: 3,
  items: [
   { c: "COPY requirements.txt . && RUN pip install -r requirements.txt", w: "dependencies before source, so the cache survives" },
   { c: "COPY --from=builder /install /usr/local", w: "carry packages forward, leave compilers behind" },
   { c: "pip install torch --index-url https://download.pytorch.org/whl/cpu", w: "2.3 GB saved on a CPU service" },
   { c: "CMD [\"uvicorn\", \"app.main:app\", \"--host\", \"0.0.0.0\"]", w: "bind 0.0.0.0 or nothing can reach it" },
   { c: "docker history myapp:1.0", w: "find the instruction that cost the gigabyte" }
  ]
 }
}

]);
