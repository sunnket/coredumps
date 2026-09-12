/* AWS for AI Engineers — deploying your service for real. */
TD.addLessons("cloud", [

{
 t: "Shipping Your AI Service",
 m: "deploy",
 lvl: "core",
 s: "ECR, Fargate behind a load balancer, secrets, a domain with TLS, and deploys nobody notices.",
 goal: [
  "Take a container from your laptop to a public HTTPS URL on AWS",
  "Inject secrets at runtime rather than baking them into an image",
  "Deploy a new version without dropping a single in-flight request"
 ],
 b: [
  { p: "This is the lesson that turns everything before it into a link you can put on a resume. The pieces are: a registry for the image, a cluster to run it, a load balancer to receive traffic, a certificate for HTTPS, and a DNS record. Six commands and one task definition." },

  { h: "The shape" },
  { code: { lang: "text", t: "What you are building",
    lines: [
     { c: "  api.yourdomain.com" },
     { c: "        |  Route 53 (alias record)" },
     { c: "        v" },
     { c: "  Application Load Balancer     public subnets, 2 AZs" },
     { c: "        |  HTTPS 443, cert from ACM", hi: true },
     { c: "        |  target group, health check /health" },
     { c: "        v" },
     { c: "  ECS Service (Fargate)         private subnets, 2 AZs" },
     { c: "        |  desired count 2, rolling deploy" },
     { c: "        |  image from ECR, tagged with the commit SHA", hi: true },
     { c: "        |  secrets from Secrets Manager" },
     { c: "        v" },
     { c: "  RDS Postgres                  isolated subnets" }
    ] } },

  { h: "1. The image, into ECR" },
  { code: { lang: "bash", t: "Build and push",
    lines: [
     { c: "ACCOUNT=$(aws sts get-caller-identity --query Account --output text)", w: "" },
     { c: "REGION=ap-south-1", w: "" },
     { c: "REPO=$ACCOUNT.dkr.ecr.$REGION.amazonaws.com/rag-api", w: "" },
     { c: "SHA=$(git rev-parse --short HEAD)", w: "**The tag is the commit.** This is how you answer *what is running* six months later.", hi: true },
     { c: "", w: "" },
     { c: "aws ecr create-repository --repository-name rag-api \\", w: "" },
     { c: "  --image-scanning-configuration scanOnPush=true \\", w: "**Free vulnerability scanning** on every push. No reason not to." },
     { c: "  --lifecycle-policy-text file://ecr-lifecycle.json", w: "**Keep the last 20 images.** Without this, ECR storage grows forever and it is a line on your bill nobody investigates." },
     { c: "", w: "" },
     { c: "aws ecr get-login-password --region $REGION \\", w: "" },
     { c: "  | docker login --username AWS --password-stdin $REPO", w: "**`--password-stdin`**, never a password on the command line where it lands in shell history." },
     { c: "", w: "" },
     { c: "docker build --platform linux/amd64 -t $REPO:$SHA .", w: "**`--platform linux/amd64` matters if you are on an Apple silicon Mac.** Otherwise you build an arm64 image, push it, and the task fails to start with a message that explains nothing.", hi: true },
     { c: "docker push $REPO:$SHA", w: "" }
    ] } },

  { trap: "Building on an M-series Mac and deploying to x86 Fargate produces `exec format error` in the task logs — or often no logs at all, just a task that starts and immediately stops. Either pass `--platform linux/amd64` or set your Fargate task to `runtimePlatform: { cpuArchitecture: ARM64 }`, which is also about 20% cheaper. Pick one deliberately and put it in the build script." },

  { h: "2. Secrets, injected not baked" },
  { code: { lang: "bash", t: "Secrets Manager, and how the task gets them",
    lines: [
     { c: "aws secretsmanager create-secret --name prod/rag-api \\", w: "" },
     { c: "  --secret-string '{\"ANTHROPIC_API_KEY\":\"sk-...\",\"DB_PASSWORD\":\"...\"}'", w: "**One secret holding several keys** is usually tidier than one per value, and cheaper — Secrets Manager charges per secret." },
     { c: "", w: "" },
     { c: "# In the task definition, reference individual JSON keys:", w: "" },
     { c: "#   \"secrets\": [", w: "" },
     { c: "#     { \"name\": \"ANTHROPIC_API_KEY\",", w: "" },
     { c: "#       \"valueFrom\": \"arn:...:secret:prod/rag-api-AbCdEf:ANTHROPIC_API_KEY::\" }", w: "**The `:KEY::` suffix pulls one field out of the JSON.** The two trailing colons are version-stage and version-id, left empty for 'current'.", hi: true },
     { c: "#   ]", w: "" },
     { c: "", w: "" },
     { c: "# The EXECUTION role needs permission to read it:", w: "" },
     { c: "#   secretsmanager:GetSecretValue on that ARN", w: "**The execution role, not the task role.** ECS fetches the secret before your code starts, so it is ECS that needs the permission. Getting this backwards is a very common half-hour.", hi: true },
     { c: "#   plus kms:Decrypt if you used a customer-managed key", w: "" }
    ],
    after: "The result: your container receives an ordinary environment variable, the value never appears in the image, the task definition, your repository or the deploy logs, and rotating it is a Secrets Manager update plus a redeploy. **Parameter Store** does the same thing for free with fewer features — use it when you do not need automatic rotation." } },

  { h: "3. The load balancer and the certificate" },
  { code: { lang: "bash", t: "HTTPS, end to end",
    lines: [
     { c: "aws acm request-certificate --domain-name api.yourdomain.com \\", w: "" },
     { c: "  --validation-method DNS", w: "**DNS validation**, not email. It renews automatically forever, which email validation does not." },
     { c: "", w: "" },
     { c: "# Add the CNAME it gives you to your DNS. If the domain is in", w: "" },
     { c: "# Route 53, the console will do it in one click.", w: "" },
     { c: "", w: "" },
     { c: "aws elbv2 create-load-balancer --name rag-alb \\", w: "" },
     { c: "  --subnets $PUBLIC_A $PUBLIC_B \\", w: "**Two public subnets in two AZs.** The load balancer refuses to be created with one." },
     { c: "  --security-groups $SG_ALB --scheme internet-facing", w: "" },
     { c: "", w: "" },
     { c: "aws elbv2 create-target-group --name rag-tg \\", w: "" },
     { c: "  --protocol HTTP --port 8000 --vpc-id $VPC \\", w: "" },
     { c: "  --target-type ip \\", w: "**`ip`, not `instance`** — Fargate tasks have their own network interfaces." },
     { c: "  --health-check-path /health \\", w: "" },
     { c: "  --health-check-interval-seconds 15 \\", w: "" },
     { c: "  --healthy-threshold-count 2 --unhealthy-threshold-count 3 \\", w: "**Two checks to become healthy, three to be replaced.** Asymmetric on purpose: quick to trust, slow to condemn." },
     { c: "  --deregistration-delay.timeout_seconds 30", w: "**How long the ALB waits for in-flight requests before killing a draining target.** Longer than your slowest request, or deploys drop connections.", hi: true },
     { c: "", w: "" },
     { c: "aws elbv2 create-listener --load-balancer-arn $ALB \\", w: "" },
     { c: "  --protocol HTTPS --port 443 --certificates CertificateArn=$CERT \\", w: "" },
     { c: "  --ssl-policy ELBSecurityPolicy-TLS13-1-2-2021-06 \\", w: "**Choose the policy.** The default permits older ciphers than you probably want." },
     { c: "  --default-actions Type=forward,TargetGroupArn=$TG", w: "" },
     { c: "", w: "" },
     { c: "# And redirect port 80 to 443 rather than serving it:", w: "" },
     { c: "aws elbv2 create-listener --load-balancer-arn $ALB --protocol HTTP --port 80 \\", w: "" },
     { c: "  --default-actions '[{\"Type\":\"redirect\",\"RedirectConfig\":{\"Protocol\":\"HTTPS\",\"Port\":\"443\",\"StatusCode\":\"HTTP_301\"}}]'", w: "" }
    ] } },

  { h: "4. Health checks that mean something" },
  { vs: { t: "The health check that lies, and the one that helps",
    lang: "python",
    bad: { label: "Always healthy", c: "@app.get('/health')\ndef health():\n    return {'status': 'ok'}",
      w: "Returns 200 while the database is down, the model provider is unreachable and every real request is failing. The load balancer keeps sending traffic to a broken task forever." },
    good: { label: "Two endpoints, two questions", c: "@app.get('/health')          # LIVENESS\ndef health():\n    # Is the process alive? Nothing else.\n    # If this fails, restarting helps.\n    return {'status': 'ok'}\n\n@app.get('/ready')           # READINESS\nasync def ready():\n    # Can I serve a real request right now?\n    checks = {}\n    try:\n        await db.execute('SELECT 1')\n        checks['db'] = 'ok'\n    except Exception as e:\n        checks['db'] = str(e)[:80]\n\n    if shutting_down:\n        return JSONResponse(503, {'status': 'draining'})\n    if any(v != 'ok' for v in checks.values()):\n        return JSONResponse(503, {'status': 'degraded', **checks})\n    return {'status': 'ok', **checks}",
      w: "Liveness answers *should I restart this*. Readiness answers *should I send it traffic*. Point the ALB at `/ready` and the container health check at `/health`, and the two failure modes get the two different responses they need." } } },

  { h: "5. Deploys nobody notices" },
  { code: { lang: "python", file: "shutdown.py", t: "Draining properly",
    lines: [
     { c: "import signal", w: "" },
     { c: "", w: "" },
     { c: "shutting_down = False", w: "" },
     { c: "", w: "" },
     { c: "def _sigterm(*_):", w: "" },
     { c: "    global shutting_down", w: "" },
     { c: "    shutting_down = True", w: "**ECS sends SIGTERM, waits 30 seconds by default, then SIGKILL.** Use the window.", hi: true },
     { c: "", w: "" },
     { c: "signal.signal(signal.SIGTERM, _sigterm)", w: "" },
     { c: "", w: "" },
     { c: "# The sequence that makes a deploy invisible:", w: "" },
     { c: "#   1. new task starts, passes /ready twice, joins the target group", w: "" },
     { c: "#   2. old task receives SIGTERM", w: "" },
     { c: "#   3. /ready starts returning 503 -> ALB stops sending NEW requests", w: "**Fail readiness first.** This is the step that makes the difference.", hi: true },
     { c: "#   4. in-flight requests finish, within deregistration_delay", w: "" },
     { c: "#   5. old task exits", w: "" },
     { c: "", w: "" },
     { c: "# Deployment settings that give you this:", w: "" },
     { c: "#   minimumHealthyPercent: 100   <- never below full capacity", w: "" },
     { c: "#   maximumPercent: 200          <- allow double during the roll", w: "" },
     { c: "#   deploymentCircuitBreaker: { enable: true, rollback: true }", w: "**Automatic rollback if the new version fails to become healthy.** One line, and it converts a bad deploy from an outage into a non-event.", hi: true }
    ] } },

  { h: "6. Autoscaling, sized for an AI service" },
  { l: [
   "**Scale on the right metric.** CPU is the reflex and it is wrong for an AI service, which spends most of its time waiting on a model API rather than computing. Scale on **ALB request count per target** or on your own queue depth.",
   "**Set a minimum of 2**, spread across zones. One task is a single point of failure and an availability zone can go down.",
   "**Scale out fast, scale in slowly.** A 60-second scale-out cooldown and a 300-second scale-in cooldown avoids flapping.",
   "**Always set a maximum.** Without it, a retry storm or a runaway loop scales you to a bill nobody authorised.",
   "**Remember the concurrency shape.** An I/O-bound AI service handles far more concurrent requests per task than a CPU-bound one, because it is waiting, not working. Test what one task actually holds before choosing your thresholds."
  ] },

  { tryit: { t: "Ship it, then deploy over it under load",
    task: "Deploy a containerised AI service to Fargate behind an ALB with a real certificate and your own domain. Confirm HTTPS works and the health checks behave. Then generate steady load with a load-testing tool and deploy a new version while the load is running. Count the failed requests. If any failed, fix the draining and repeat until zero.",
    hint: "Zero failures is achievable and is the point of the exercise. If you see failures, the causes are almost always: readiness not failing before shutdown, deregistration delay shorter than your slowest request, or no SIGTERM handler at all.",
    sol: { lang: "bash", code: "# Steady load, in another terminal\nhey -z 3m -q 20 -c 10 https://api.yourdomain.com/v1/ask\n\n# Deploy while it runs\naws ecs update-service --cluster prod --service rag-api \\\n  --task-definition rag-api:47 --force-new-deployment\n\n# --- First attempt, typical result ---\n#   Status code distribution:\n#     [200] 3541 responses\n#     [502]   23 responses     <- in-flight requests killed\n#\n# Cause: no SIGTERM handler. The container died mid-request.\n#\n# --- After adding the handler and readiness draining ---\n#   Status code distribution:\n#     [200] 3600 responses\n#\n# Watch the roll happen:\naws ecs describe-services --cluster prod --services rag-api \\\n  --query 'services[0].deployments[].[status,desiredCount,runningCount]' \\\n  --output table\n\n# And prove the circuit breaker works: deploy a deliberately\n# broken image and watch ECS roll back on its own.\naws ecs update-service --cluster prod --service rag-api \\\n  --task-definition rag-api-broken:1\naws ecs describe-services --cluster prod --services rag-api \\\n  --query 'services[0].events[:5].message'\n#   \"deployment failed: tasks failed to start\"\n#   \"rolling back to rag-api:47\"" },
    w: "\"Zero failed requests during a deploy under load\" is a specific, verifiable claim you can make about your own project, and it is unusual. Most people have never measured it, which is why most deploys quietly drop requests. Being able to describe this experiment is worth more in a system design round than knowing another service by name." } },

  { vocab: ["Container Registry", "Load Balancer", "Health Check", "Rolling Deployment", "TLS", "Autoscaling", "Secrets Management"] }
 ],
 k: [
  "Tag images with the commit SHA and set an ECR lifecycle policy; never deploy `:latest`.",
  "Build with `--platform linux/amd64` on Apple silicon, or the task dies with an unexplained exec format error.",
  "Secrets are read by the ECS **execution** role before your code starts — not the task role.",
  "Liveness and readiness are different questions; fail readiness first and deploys stop dropping requests.",
  "Scale an AI service on request count, not CPU, and always set a maximum."
 ],
 r: ["Container Registry", "Load Balancer", "Health Check", "Rolling Deployment", "Blue-Green Deployment", "Secrets Management", "Autoscaling"],
 drill: {
  lang: "bash",
  reps: 3,
  items: [
   { c: "docker build --platform linux/amd64 -t $REPO:$(git rev-parse --short HEAD) .", w: "build for the right architecture, tagged with the commit" },
   { c: "aws ecr get-login-password | docker login --username AWS --password-stdin $REPO", w: "authenticate to the registry without a password in shell history" },
   { c: "deploymentCircuitBreaker: { enable: true, rollback: true }", w: "make a failed deploy roll itself back" },
   { c: "aws ecs update-service --cluster prod --service api --force-new-deployment", w: "roll the service onto a new task definition" }
  ]
 }
}

]);
