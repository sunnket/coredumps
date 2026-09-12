/* AWS for AI Engineers — the AWS an interviewer asks about. */
TD.addLessons("cloud", [

{
 t: "The AWS an Interviewer Asks About",
 m: "interview",
 lvl: "core",
 s: "The questions that recur in AI engineering loops, the certification question answered honestly, and what to put on a resume.",
 goal: [
  "Answer the eight AWS questions that actually come up in an AI engineering interview",
  "Decide whether a certification is worth your time, for your situation",
  "Describe your cloud work on a resume in a way that survives a follow-up"
 ],
 b: [
  { p: "You will not be interviewed as a cloud engineer. You will be interviewed as an AI engineer who is expected not to be helpless when the model has to become a service. That is a much lower bar than it feels like from the outside, and it is a specific one — these are the questions." },

  { h: "The eight questions" },

  { ol: [
   "**\"How would you deploy this model / this service on AWS?\"** — the most common one by far.",
   "**\"Lambda or a container? Why?\"**",
   "**\"How do you handle secrets?\"**",
   "**\"How would you keep the cost down?\"**",
   "**\"What happens when it goes down at 2am?\"**",
   "**\"How do you keep customer data private?\"**",
   "**\"Have you used infrastructure as code?\"**",
   "**\"Bedrock or the provider API directly?\"**"
  ] },

  { n: "Notice what is not on that list: nothing about the 200 services, nothing about exam trivia, nothing about VPC peering topologies. Every question is *how would you ship and run this thing*. Prepare for those eight and the cloud section of an AI interview stops being a risk.",
    nt: "What is not asked" },

  { h: "Answering the first one well" },
  { vs: { t: "\"How would you deploy this on AWS?\"",
    lang: "text",
    bad: { label: "The answer that sounds memorised", c: "\"I'd use EC2 with Docker, put it behind\nnginx, and use S3 for storage.\"\n\nProblems:\n  - no clarifying questions asked\n  - no reasoning, just service names\n  - nothing about secrets, logs, scaling or cost\n  - nothing about what happens when it breaks\n  - EC2 chosen by habit, not from the workload",
      w: "It is not wrong. It gives the interviewer nothing to be impressed by." },
    good: { label: "The answer that gets remembered", c: "\"A few questions first: is there a GPU\ninvolved, or are we calling a model API?\nWhat is the traffic shape -- steady, or\nspiky? And is there a latency target?\n\nAssuming an API-backed service, steady\ntraffic, sub-2s target:\n\n  Container in ECR, tagged with the commit.\n  ECS Fargate, 2 tasks across 2 AZs,\n  private subnets, behind an ALB with an\n  ACM certificate.\n  Secrets from Secrets Manager, injected\n  by the execution role -- nothing in the\n  image.\n  RDS Postgres with pgvector in isolated\n  subnets; I'd start there rather than a\n  separate vector database.\n  Structured JSON logs to CloudWatch with\n  a request id and per-request token cost,\n  30-day retention.\n  Alarms on 5xx rate and p99, not CPU.\n  Autoscale on request count per target,\n  min 2, max capped.\n\nCost at 100k requests/month is roughly\nRs 1,500 of compute against maybe Rs 40,000\nof model calls -- so I'd spend my\noptimisation effort on retrieval size and\nmodel routing, not on the infrastructure.\n\nIf there were a GPU I'd say EC2 or a\nSageMaker endpoint instead, and the\ntrade changes completely.\"",
      w: "Clarifying questions, a concrete architecture with reasons, and — the part almost nobody does — a cost sentence that says where the money actually is." } } },

  { h: "The other seven, in one paragraph each" },

  { tbl: { t: "What a strong answer contains",
    h: ["Question", "The core of the answer", "The detail that lands"],
    rows: [
     ["**Lambda or container?**", "Five questions: GPU? runtime over 15 min? bursty or steady? package size? cold start tolerable?", "\"Lambda outside a VPC has internet by default; put it in one for RDS and it loses that unless you add a NAT or endpoints\""],
     ["**Secrets?**", "Secrets Manager or Parameter Store, injected at runtime by the execution role", "\"Never in the image or the task definition — and the execution role reads it, not the task role\""],
     ["**Cost?**", "Model calls are 70%+; retrieval size, prompt caching and model routing come before infrastructure", "\"Two accidental lines are usually next: log groups with no retention, and NAT charges an S3 gateway endpoint would remove\""],
     ["**2am?**", "Alarms on symptoms, a runbook, structured logs with a request id, and rolling back before diagnosing", "\"Practise the rollback on a quiet afternoon; the first time you run it should not be during an incident\""],
     ["**Privacy?**", "Enumerate the fields that leave, redact, use a regional endpoint, set retention, check the training terms", "\"Traces and prompt logs are copies of the data and inherit the same obligations\""],
     ["**IaC?**", "Terraform, state in S3, encrypted and locked, separate state per environment", "\"I destroy and recreate my dev environment routinely, which is how I know the config is real\""],
     ["**Bedrock or direct?**", "Bedrock when you need IAM, CloudTrail, VPC isolation or residency; direct when you want the newest model", "\"Model access is off by default in a new account — a detail that catches people on demo day\""]
    ] } },

  { h: "The certification question, honestly" },
  { l: [
   "**A certification does not get you an AI engineering job.** No hiring manager has offered anyone this role because of a badge. What gets the role is a deployed system you can explain.",
   "**It sometimes gets you past a filter**, particularly at IT services companies and consultancies where a recruiter screens on keywords. If that is your target segment, it has real value.",
   "**It is a decent forcing function** if you are the sort of person who learns better with an exam date. The Solutions Architect Associate covers roughly the right ground.",
   "**It is a poor use of six weeks** if you do not already have a deployed project. Build the project first. Then, if you still want the certificate, most of the studying is already done.",
   "**The honest ordering for someone starting now:** deploy something real, write it up, then certify if your target companies reward it. Not the reverse."
  ] },

  { h: "What to put on a resume" },
  { vs: { t: "Two ways to write the same experience",
    lang: "text",
    bad: { label: "The keyword list", c: "AWS: EC2, S3, Lambda, ECS, RDS, IAM, VPC,\nCloudWatch, SQS, SNS, DynamoDB, Bedrock,\nSageMaker, CloudFormation, Terraform",
      w: "Reads as a syllabus, not experience. It invites the follow-up \"tell me about the SageMaker work\" — which you cannot answer, and now everything else on the list is in doubt." },
    good: { label: "The claim with a number", c: "Deployed a RAG service on AWS: FastAPI in\na container on ECS Fargate behind an ALB,\nPostgres with pgvector on RDS, documents\nin S3 with lifecycle rules, secrets in\nSecrets Manager. Infrastructure in\nTerraform. Cut inference cost 68% (from\nRs 4.10 to Rs 1.30 per request) by\nreranking to fewer chunks and routing\nsimple queries to a smaller model, with\nanswer quality flat on a 200-question\nevaluation set.\n\nLive: https://api.example.com/docs\nCode: github.com/you/rag-service",
      w: "Every claim is checkable, every technology is attached to a decision, and the cost sentence is the one they will ask about — which is exactly what you want, because you can answer it." } } },

  { h: "The two-week plan, if you are starting from nothing" },
  { code: { lang: "text", t: "Enough AWS for an AI engineering interview",
    lines: [
     { c: "  WEEK 1  -- the account and the pieces" },
     { c: "    day 1   account, MFA, budget alarm, CLI. Lesson 1-2." },
     { c: "    day 2   IAM: build a least-privilege role, use the simulator" },
     { c: "    day 3   S3: bucket, lifecycle, versioning, presigned upload" },
     { c: "    day 4   RDS + pgvector: schema, HNSW index, hybrid query" },
     { c: "    day 5   Bedrock: model access, converse, streaming, cost log" },
     { c: "    day 6-7 containerise your service; push to ECR" },
     { c: "" },
     { c: "  WEEK 2  -- make it real" },
     { c: "    day 8   VPC: two-tier, endpoints, no NAT if you can manage it" },
     { c: "    day 9   ECS Fargate + ALB + certificate + domain", hi: true },
     { c: "    day 10  health checks, graceful shutdown, deploy under load" },
     { c: "    day 11  CloudWatch: structured logs, Insights queries, alarms" },
     { c: "    day 12  cost: tag everything, find two sources of waste, cut them" },
     { c: "    day 13  Terraform: import it all, destroy, recreate", hi: true },
     { c: "    day 14  write it up: the README, the numbers, the trade-offs" },
     { c: "" },
     { c: "  Outcome: a URL, a repo, and three numbers you can defend." },
     { c: "           That is a stronger cloud story than most candidates" },
     { c: "           with two years of experience can tell.", hi: true }
    ] } },

  { h: "The three numbers" },
  { l: [
   "**Cost per request**, and how you reduced it. \"₹4.10 to ₹1.30, quality flat on a 200-question set.\"",
   "**Latency, p50 and p99**, and where the time goes. \"p50 1.2s, p99 3.4s; retrieval is 180ms, the model is the rest.\"",
   "**What it costs a month at your traffic**, broken down. \"₹58,000, of which 72% is model calls — which is why I worked on retrieval size before touching the infrastructure.\""
  ] },

  { n: "Those three numbers are worth more than any additional service on your resume. They are the difference between somebody who followed a tutorial and somebody who operated a system, and an interviewer can tell within one follow-up question which they are speaking to.",
    nt: "Why numbers" },

  { tryit: { t: "Write the answer, then say it out loud",
    task: "Write your own answer to \"how would you deploy an AI service on AWS?\" — with your clarifying questions, your architecture, your reasoning per component, and your cost sentence. Keep it to about ninety seconds spoken. Then record yourself saying it, listen back, and cut everything that is a service name without a reason attached.",
    hint: "The recording is uncomfortable and it is the point. Almost everybody discovers they list services faster than they explain them, and that the cost sentence — the strongest part — got dropped for time.",
    sol: { lang: "text", code: "# The structure that fits ninety seconds\n\n  1. TWO CLARIFYING QUESTIONS               (10s)\n     GPU or API? Traffic shape and latency target?\n\n  2. THE ARCHITECTURE, WITH REASONS         (45s)\n     Name each component and why, not what.\n     \"Fargate rather than EC2 because there is no GPU\n      and I do not want to patch machines.\"\n     \"pgvector rather than a vector database because\n      at this size it is faster to build and I get\n      transactional consistency with the metadata.\"\n\n  3. HOW I KNOW IT IS WORKING               (20s)\n     Logs with a request id, alarms on 5xx and p99,\n     evaluation set running nightly.\n\n  4. THE COST SENTENCE                      (15s)\n     Where the money is, and what I would do first.\n\n# The two failure modes to listen for in the recording:\n#\n#   - service names with no 'because' after them\n#   - running out of time before point 4\n#\n# Point 4 is the one most candidates never reach and the\n# one interviewers remember. If you are short of time,\n# cut a component from point 2 -- never the cost sentence." },
    w: "This ninety seconds is reused in every interview you will ever take for this role, in the system design round, the project deep-dive and often the recruiter call. It is worth rehearsing until it is smooth, and worth updating with real numbers every time your project changes." } },

  { vocab: ["Cloud Computing", "Model Deployment", "Observability", "Infrastructure as Code", "Cost Per Token"] }
 ],
 k: [
  "Eight questions cover the AWS asked in an AI engineering loop — none of them are about exam trivia.",
  "Open with clarifying questions, give reasons rather than service names, and finish with a cost sentence.",
  "A certification can clear a recruiter filter but never substitutes for a deployed system; build first.",
  "On a resume, one architecture with checkable numbers beats a keyword list every time.",
  "Carry three numbers: cost per request, p50/p99 latency, and the monthly bill broken down."
 ],
 r: ["Model Deployment", "Observability", "Infrastructure as Code", "Cost Per Token", "Latency Budget"],
 drill: {
  lang: "text",
  reps: 3,
  items: [
   { c: "GPU or API-backed? Traffic shape? Latency target?", w: "the three clarifying questions to open a deployment answer with" },
   { c: "Fargate + ALB + RDS/pgvector + Secrets Manager + CloudWatch", w: "the default AI service architecture, said as one line" },
   { c: "Model calls are ~70% of the bill, so I would start with retrieval size and routing", w: "the cost sentence most candidates never reach" }
  ]
 }
}

]);
