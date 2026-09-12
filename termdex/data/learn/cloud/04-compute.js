/* AWS for AI Engineers — choosing where your code runs. */
TD.addLessons("cloud", [

{
 t: "Lambda, Fargate, EC2 — Choosing Honestly",
 m: "compute",
 lvl: "core",
 s: "Five ways to run code on AWS, what each costs, and which one your AI service belongs on.",
 goal: [
  "Pick a compute service from the workload rather than from habit",
  "Reason about cold starts, package size and GPU access before committing",
  "Estimate the monthly cost of each option for a real traffic level"
 ],
 b: [
  { p: "This is the decision people get wrong most often, usually by picking whatever the tutorial they read used. The five options genuinely differ, and the differences that matter for AI work — package size, cold start, GPU access, and how long a request may run — are not the ones general AWS courses emphasise." },

  { h: "The five options" },
  { tbl: { t: "Compared on what actually decides it",
    h: ["", "Lambda", "Fargate (ECS)", "App Runner", "EC2", "SageMaker endpoint"],
    rows: [
     ["**Unit**", "A function", "A container", "A container", "A machine", "A model"],
     ["**Max runtime**", "**15 min**", "Unlimited", "Unlimited", "Unlimited", "Unlimited"],
     ["**Scale to zero**", "**Yes**", "No (min 1 task)", "Yes (with a delay)", "No", "Serverless: yes"],
     ["**Cold start**", "0.2–8 s", "30–90 s (task start)", "~30 s", "None once warm", "Serverless: 10–60 s"],
     ["**GPU**", "**No**", "No", "No", "**Yes**", "**Yes**"],
     ["**Package limit**", "250 MB unzipped, 10 GB image", "No practical limit", "No practical limit", "None", "None"],
     ["**Idle cost**", "**Zero**", "Continuous", "Low", "Continuous", "Continuous unless serverless"],
     ["**Ops burden**", "Lowest", "Low", "Lowest", "**Highest**", "Medium"]
    ] } },

  { n: "The default recommendation for an AI engineer, stated plainly: **Lambda for event-driven and bursty work, ECS Fargate for your main API, EC2 only when you need a GPU.** App Runner is a pleasant shortcut for a simple container and is worth knowing. SageMaker endpoints matter when you are serving your own model weights rather than calling an API.",
    nt: "The short answer" },

  { h: "Lambda, and its two real limits" },
  { code: { lang: "python", file: "handler.py", t: "A Lambda that will not surprise you",
    lines: [
     { c: "import json, os, boto3", w: "" },
     { c: "", w: "" },
     { c: "# Anything expensive goes at MODULE level, outside the handler.", w: "" },
     { c: "# It runs once per cold start and is reused by every warm", w: "" },
     { c: "# invocation on that same execution environment.", w: "" },
     { c: "s3 = boto3.client('s3')", w: "**Clients at module scope.** Creating a boto3 client inside the handler adds 100–300 ms to every single request.", hi: true },
     { c: "BUCKET = os.environ['DOCS_BUCKET']", w: "**Fail at import if configuration is missing**, not on the first real request at 3am." },
     { c: "", w: "" },
     { c: "def handler(event, context):", w: "" },
     { c: "    key = event['Records'][0]['s3']['object']['key']", w: "" },
     { c: "", w: "" },
     { c: "    remaining = context.get_remaining_time_in_millis()", w: "**Lambda tells you how long you have left.** Use it to decide whether to start another unit of work or to hand off." },
     { c: "    if remaining < 5_000:", w: "" },
     { c: "        raise RuntimeError('not enough time; requeue')", w: "" },
     { c: "", w: "" },
     { c: "    body = s3.get_object(Bucket=BUCKET, Key=key)['Body'].read()", w: "" },
     { c: "    return {'statusCode': 200, 'body': json.dumps({'bytes': len(body)})}", w: "" }
    ] } },

  { l: [
   "**The 15-minute ceiling is hard.** An LLM call chain that occasionally takes 20 minutes cannot live here. Either decompose it or use Fargate.",
   "**CPU scales with memory, and you cannot set it separately.** 1,769 MB gives you one full vCPU. A function that is slow because it is CPU-bound often gets *cheaper* when you raise its memory, because it finishes proportionally faster — this is genuinely counter-intuitive and worth measuring.",
   "**Cold starts.** ~200 ms for a small Python function; several seconds once you import `torch`, `pandas` or a large SDK. **Container images can be 10 GB but start slower.** For an AI workload, the honest answer is usually: do not import heavy ML libraries into Lambda; call an API instead.",
   "**Provisioned concurrency** removes cold starts and costs money continuously, which defeats most of the reason you chose Lambda. **SnapStart** is the better answer where supported.",
   "**No GPU. Ever.** If a tutorial suggests running a model on Lambda, it means a model behind an API."
  ] },

  { h: "Fargate — the default for your API" },
  { code: { lang: "json", file: "taskdef.json", t: "The parts of a task definition that matter",
    lines: [
     { c: "{", w: "" },
     { c: "  \"family\": \"rag-api\",", w: "" },
     { c: "  \"requiresCompatibilities\": [\"FARGATE\"],", w: "" },
     { c: "  \"networkMode\": \"awsvpc\",", w: "**Required for Fargate.** Each task gets its own network interface and its own security group." },
     { c: "  \"cpu\": \"1024\",", w: "**1024 = 1 vCPU.** Valid combinations are constrained: 1 vCPU allows 2–8 GB of memory, not anything you like." },
     { c: "  \"memory\": \"2048\",", w: "" },
     { c: "  \"executionRoleArn\": \"arn:aws:iam::...:role/ecsTaskExecutionRole\",", w: "**Lets ECS pull the image and write logs.** This is the role people forget, and the symptom is a task that never starts with no useful message.", hi: true },
     { c: "  \"taskRoleArn\": \"arn:aws:iam::...:role/rag-api-task\",", w: "**What YOUR CODE may do.** These two roles are different and confusing them is a rite of passage.", hi: true },
     { c: "  \"containerDefinitions\": [{", w: "" },
     { c: "    \"name\": \"api\",", w: "" },
     { c: "    \"image\": \"123456789012.dkr.ecr.ap-south-1.amazonaws.com/rag-api:a3f91c0\",", w: "**A commit SHA, never `:latest`.** Otherwise you cannot answer what is running.", hi: true },
     { c: "    \"portMappings\": [{ \"containerPort\": 8000 }],", w: "" },
     { c: "    \"secrets\": [", w: "" },
     { c: "      { \"name\": \"ANTHROPIC_API_KEY\",", w: "" },
     { c: "        \"valueFrom\": \"arn:aws:secretsmanager:...:secret:llm-key\" }", w: "**Injected at start from Secrets Manager**, never baked into the image or written in the task definition." },
     { c: "    ],", w: "" },
     { c: "    \"healthCheck\": {", w: "" },
     { c: "      \"command\": [\"CMD-SHELL\", \"curl -f http://localhost:8000/health || exit 1\"],", w: "**A real check.** A task that is running but broken should be replaced, and only a health check causes that." },
     { c: "      \"interval\": 30, \"timeout\": 5, \"retries\": 3, \"startPeriod\": 60", w: "**`startPeriod` matters for AI services** — a container loading a model needs grace before failures count." },
     { c: "    },", w: "" },
     { c: "    \"logConfiguration\": {", w: "" },
     { c: "      \"logDriver\": \"awslogs\",", w: "" },
     { c: "      \"options\": { \"awslogs-group\": \"/ecs/rag-api\",", w: "" },
     { c: "                    \"awslogs-region\": \"ap-south-1\",", w: "" },
     { c: "                    \"awslogs-stream-prefix\": \"api\" }", w: "**Without this you get no logs at all**, and debugging becomes impossible." },
     { c: "    }", w: "" },
     { c: "  }]", w: "" },
     { c: "}", w: "" }
    ] } },

  { h: "GPUs on EC2, without wasting money" },
  { tbl: { t: "The instances an AI engineer meets, roughly",
    h: ["Instance", "GPU", "VRAM", "On-demand ≈", "Fits"],
    rows: [
     ["`g5.xlarge`", "1× A10G", "24 GB", "~₹100/hr", "7–8B in 4-bit, embeddings, QLoRA"],
     ["`g5.2xlarge`", "1× A10G", "24 GB", "~₹120/hr", "Same, more CPU for data loading"],
     ["`g6.xlarge`", "1× L4", "24 GB", "~₹85/hr", "Cheaper inference, newer"],
     ["`g5.12xlarge`", "4× A10G", "96 GB", "~₹500/hr", "70B in 4-bit, multi-GPU tuning"],
     ["`p4d.24xlarge`", "8× A100", "320 GB", "~₹2,700/hr", "Serious training. Usually needs a quota request"]
    ] } },

  { l: [
   "**Spot instances are 60–90% cheaper** and can be reclaimed with two minutes' notice. For training with checkpointing, that is a superb trade. For a serving endpoint, it is not.",
   "**Request quota early.** A new account has a GPU quota of zero. The request takes hours to days, and discovering that on the evening you planned to train is a wasted evening.",
   "**Use a Deep Learning AMI.** Building CUDA and drivers by hand is a day you will not get back.",
   "**Always schedule a shutdown.** `sudo shutdown -h +120` at launch, or a CloudWatch alarm that stops the instance when GPU utilisation has been near zero for an hour. This one habit is the difference between AWS being affordable and not.",
   "**Stop, do not terminate**, if you want the disk back. A stopped instance still bills for its EBS volume — much less than the instance, but not nothing."
  ] },

  { h: "The cost comparison, done properly" },
  { code: { lang: "text", t: "One AI API, 100,000 requests/month, 500 ms each, 1 GB",
    lines: [
     { c: "  LAMBDA" },
     { c: "    requests   100,000                    ~free (1M free tier)" },
     { c: "    duration   100,000 x 0.5s x 1GB" },
     { c: "               = 50,000 GB-seconds        ~free (400k free tier)" },
     { c: "    TOTAL                                 ~Rs 0", hi: true },
     { c: "" },
     { c: "  FARGATE  (1 task, 0.5 vCPU / 1 GB, always on)" },
     { c: "    vCPU  0.5 x 730h x $0.04048          ~$14.8" },
     { c: "    mem   1   x 730h x $0.004445         ~$3.2" },
     { c: "    TOTAL                                 ~$18  (~Rs 1,500)", hi: true },
     { c: "" },
     { c: "  EC2  (t3.small, always on)" },
     { c: "    TOTAL                                 ~$15  (~Rs 1,250)" },
     { c: "    ...plus you patch it, monitor it and own it" },
     { c: "" },
     { c: "  And the number that dwarfs all of them:" },
     { c: "    LLM API calls 100,000 x Rs 0.4        ~Rs 40,000", hi: true }
    ],
    after: "That last line is the point. For an AI service, compute is usually 3–8% of the bill and the model calls are the rest. Optimising Fargate from ₹1,500 to ₹900 while ignoring a ₹40,000 model bill is a common and expensive misallocation of attention." } },

  { vs: { t: "The decision, made two ways",
    lang: "text",
    bad: { label: "By habit", c: "\"The tutorial used EC2, so I will use EC2.\"\n\n-> a t3.medium running 24/7\n-> you patch the OS\n-> you configure nginx and TLS by hand\n-> it does not autoscale\n-> when it dies at 2am, you are the failover",
      w: "Works, and you have signed up to be an operations team of one." },
    good: { label: "From the workload", c: "Questions, in order:\n\n1. Does it need a GPU?          -> yes: EC2 or SageMaker. Stop here.\n2. Is any request over 15 min?  -> yes: Fargate.\n3. Is traffic bursty or rare?   -> yes: Lambda (scale to zero).\n4. Is it a steady web API?      -> Fargate behind an ALB.\n5. Do I want the simplest path? -> App Runner, and move to\n                                   Fargate when you outgrow it.",
      w: "Five questions, thirty seconds, and an answer you can defend in an interview." } } },

  { tryit: { t: "Deploy the same tiny service three ways and measure",
    task: "Write a minimal FastAPI service with a `/health` endpoint and one endpoint that sleeps 500 ms. Deploy it to Lambda (via a container image and a function URL), to App Runner, and to ECS Fargate behind an ALB. For each, measure cold-start latency, warm latency, and estimate the monthly cost at 100,000 requests. Write down which you would choose and why.",
    hint: "Measure the cold start honestly: wait for the platform to scale down (15+ minutes for Lambda, longer for App Runner), then time the first request against the second.",
    sol: { lang: "bash", code: "# Measure, do not guess\nfor url in $LAMBDA_URL $APPRUNNER_URL $ALB_URL; do\n  echo \"== $url\"\n  curl -s -o /dev/null -w 'cold: %{time_total}s\\n' $url/health\n  curl -s -o /dev/null -w 'warm: %{time_total}s\\n' $url/health\ndone\n\n# Typical results for a small Python container:\n#\n#   Lambda      cold 1.9s   warm 0.09s   ~Rs 0/month at this volume\n#   App Runner  cold 0.04s  warm 0.04s   ~Rs 2,100/month (min 1 instance)\n#   Fargate+ALB cold 0.05s  warm 0.05s   ~Rs 1,500 + Rs 1,400 ALB\n#\n# The ALB is the surprise: about $16/month before it serves a single\n# request. For one small service that is more than the compute.\n#\n# Conclusion for a portfolio project:\n#   Lambda with a function URL. Free, and a 2s cold start on a link\n#   somebody clicks once is survivable.\n# Conclusion for a product with real users:\n#   Fargate behind an ALB, because the cold start is not survivable\n#   and you will want path routing, WAF and multiple services." },
    w: "The ALB cost is the finding most people miss, and it changes the answer for small projects entirely. Having done this comparison yourself means you can answer \"why did you choose that\" with a number rather than a preference — which is exactly what a system design round is listening for." } },

  { vocab: ["Serverless", "Container", "Autoscaling", "Cold Start", "Load Balancer", "Health Check"] }
 ],
 k: [
  "Lambda for bursty and event-driven, Fargate for your API, EC2 only for GPUs — decide from the workload, not the tutorial.",
  "Lambda has a hard 15-minute ceiling, no GPU, and CPU that scales with memory — raising memory can make it cheaper.",
  "Fargate has two roles: execution (pull image, write logs) and task (what your code may do). Confusing them is the classic failure.",
  "GPU quota is zero on a new account and takes days to raise; always schedule a shutdown.",
  "For an AI service, compute is a few percent of the bill — the model calls are the rest."
 ],
 r: ["Serverless", "Container", "Autoscaling", "Load Balancer", "Health Check", "Model Deployment"],
 drill: {
  lang: "bash",
  reps: 3,
  items: [
   { c: "context.get_remaining_time_in_millis()", w: "ask Lambda how long is left before deciding to start more work" },
   { c: "\"executionRoleArn\" vs \"taskRoleArn\"", w: "name the two ECS roles: pulling the image, and what your code may do" },
   { c: "aws ec2 run-instances --instance-market-options 'MarketType=spot'", w: "launch a spot instance for training, at a fraction of the price" }
  ]
 }
}

]);
