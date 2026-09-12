/* AWS for AI Engineers — monitoring, logs and the bill. */
TD.addLessons("cloud", [

{
 t: "CloudWatch, Alarms and the Bill",
 m: "ops",
 lvl: "core",
 s: "Logs you can query, metrics that matter, alarms that are worth waking up for, and cutting an AI bill.",
 goal: [
  "Emit logs a machine can query and find one user's request during an incident",
  "Alarm on symptoms users feel rather than on machine statistics",
  "Attribute every rupee of an AI bill to a feature and cut it deliberately"
 ],
 b: [
  { p: "Everything so far has been about making the thing run. This lesson is about the six months afterwards, which is where most of an engineer's actual time goes — and about the cost line, which for an AI service is the number your management will ask about first." },

  { h: "Logs you can query" },
  { code: { lang: "python", file: "logging_setup.py", t: "Structured logging, which costs nothing extra",
    lines: [
     { c: "import json, logging, sys, time, uuid", w: "" },
     { c: "from contextvars import ContextVar", w: "" },
     { c: "", w: "" },
     { c: "request_id: ContextVar[str] = ContextVar('request_id', default='-')", w: "**Set once per request in middleware**, read by every log line without being passed around." },
     { c: "", w: "" },
     { c: "class JsonFormatter(logging.Formatter):", w: "" },
     { c: "    def format(self, record):", w: "" },
     { c: "        payload = {", w: "" },
     { c: "            'ts': time.time(),", w: "" },
     { c: "            'level': record.levelname,", w: "" },
     { c: "            'msg': record.getMessage(),", w: "" },
     { c: "            'request_id': request_id.get(),", w: "**The field that turns 'a user says it was slow' into a query.**", hi: true },
     { c: "            **getattr(record, 'extra_fields', {}),", w: "" },
     { c: "        }", w: "" },
     { c: "        if record.exc_info:", w: "" },
     { c: "            payload['error'] = self.formatException(record.exc_info)", w: "**Exception into a single field.** A multi-line traceback becomes several unrelated log events otherwise, and CloudWatch Insights cannot reassemble them.", hi: true },
     { c: "        return json.dumps(payload)", w: "" },
     { c: "", w: "" },
     { c: "h = logging.StreamHandler(sys.stdout)", w: "**stdout, never a file.** In a container, files vanish with the container and nothing collects them." },
     { c: "h.setFormatter(JsonFormatter())", w: "" },
     { c: "logging.basicConfig(handlers=[h], level=logging.INFO)", w: "" },
     { c: "", w: "" },
     { c: "log = logging.getLogger('api')", w: "" },
     { c: "log.info('answered', extra={'extra_fields': {", w: "" },
     { c: "    'latency_ms': 812, 'in_tokens': 4120, 'out_tokens': 240,", w: "" },
     { c: "    'cost_inr': 0.94, 'model': 'claude-sonnet-4', 'feature': 'ask',", w: "**Fields, not a formatted string.** Every one of these becomes something you can group by later.", hi: true },
     { c: "    'chunks': 5, 'cache': 'miss', 'user_id': 'u_88'}})", w: "" }
    ],
    out: '{"ts":1772345678.9,"level":"INFO","msg":"answered","request_id":"9f2c1e04","latency_ms":812,"in_tokens":4120,"out_tokens":240,"cost_inr":0.94,"model":"claude-sonnet-4","feature":"ask","chunks":5,"cache":"miss","user_id":"u_88"}' } },

  { code: { lang: "sql", file: "insights.sql", t: "CloudWatch Logs Insights — the queries you will actually run",
    lines: [
     { c: "-- One user's request during an incident. This is the whole", w: "" },
     { c: "-- reason for structured logging.", w: "" },
     { c: "fields @timestamp, msg, latency_ms, error", w: "" },
     { c: "| filter request_id = '9f2c1e04'", w: "" },
     { c: "| sort @timestamp asc", w: "" },
     { c: "", w: "" },
     { c: "-- p50/p95/p99 latency by feature, hour by hour", w: "" },
     { c: "fields feature, latency_ms", w: "" },
     { c: "| filter msg = 'answered'", w: "" },
     { c: "| stats pct(latency_ms, 50) as p50,", w: "" },
     { c: "        pct(latency_ms, 95) as p95,", w: "" },
     { c: "        pct(latency_ms, 99) as p99,", w: "" },
     { c: "        count() as n by feature, bin(1h)", w: "**By feature.** An aggregate p99 hides the one endpoint that is broken.", hi: true },
     { c: "", w: "" },
     { c: "-- Which feature is spending the money", w: "" },
     { c: "fields feature, cost_inr", w: "" },
     { c: "| filter ispresent(cost_inr)", w: "" },
     { c: "| stats sum(cost_inr) as total, count() as calls,", w: "" },
     { c: "        sum(cost_inr)/count() as per_call by feature", w: "" },
     { c: "| sort total desc", w: "**The query that answers the question your manager will ask.**", hi: true },
     { c: "", w: "" },
     { c: "-- The ten users costing the most today", w: "" },
     { c: "fields user_id, cost_inr", w: "" },
     { c: "| stats sum(cost_inr) as spend by user_id", w: "" },
     { c: "| sort spend desc | limit 10", w: "**One user with a script can consume a month of margin overnight.**" }
    ] } },

  { trap: "CloudWatch Logs ingestion costs roughly $0.50 per GB, and the default retention is **Never Expire**. A chatty debug logger in production can genuinely cost more than the compute it is describing, forever. Set retention on every log group the day you create it — 30 days for application logs is a reasonable default — and never log full prompts or responses by default." },

  { h: "Metrics: three sources, one dashboard" },
  { tbl: { t: "Where the numbers come from",
    h: ["Source", "Examples", "Cost"],
    rows: [
     ["**AWS-published**", "ALB `TargetResponseTime`, `HTTPCode_Target_5XX_Count`, ECS CPU/memory, RDS connections", "Free at 5-minute resolution"],
     ["**Embedded Metric Format**", "Your own numbers, emitted inside a structured log line", "**Free of the PutMetricData charge.** The right way"],
     ["`PutMetricData`", "Custom metrics via an API call", "$0.30 per metric per month, and it adds up fast"]
    ] } },

  { n: "**Embedded Metric Format** is the trick worth knowing. Emit a specially-shaped JSON log line and CloudWatch extracts metrics from it automatically — no extra API call, no per-metric charge, and the log line and the metric stay consistent because they are the same object. Most teams discover it after their custom-metrics bill surprises them.",
    nt: "The cheap way to publish custom metrics" },

  { h: "Alarms worth being woken by" },
  { vs: { t: "Two alarm sets",
    lang: "text",
    bad: { label: "What people alarm on first", c: "CPU > 80%\nMemory > 75%\nDisk > 90%\nTask count changed\n\nProblems:\n  - a healthy autoscaling service is often at 80% CPU\n  - an AI service is I/O-bound; CPU says nothing\n  - none of these is something a user feels\n  - they fire constantly, so people stop reading them",
      w: "Machine statistics. They page you for things that are fine and stay quiet for things that are not." },
    good: { label: "What to alarm on", c: "5xx rate > 1% for 5 minutes            -> users see errors\np99 latency > 8s for 10 minutes        -> users feel it\nSQS oldest message age > 15 min        -> work is stuck\nDLQ has any messages at all            -> something failed 3x\nDaily spend > 1.5x the 7-day average   -> money is leaking\nHealthy target count < 2               -> no redundancy left\nRDS free storage < 20%                 -> a real deadline",
      w: "Every one is a symptom a user or an accountant experiences. Six alarms you trust beat forty you ignore." } } },

  { code: { lang: "bash", t: "A composite alarm, so one incident is one page",
    lines: [
     { c: "aws cloudwatch put-metric-alarm --alarm-name rag-5xx \\", w: "" },
     { c: "  --metric-name HTTPCode_Target_5XX_Count --namespace AWS/ApplicationELB \\", w: "" },
     { c: "  --statistic Sum --period 300 --threshold 10 \\", w: "" },
     { c: "  --comparison-operator GreaterThanThreshold --evaluation-periods 1 \\", w: "" },
     { c: "  --treat-missing-data notBreaching", w: "**Decide this explicitly.** The default treats missing data as breaching, so an alarm on a low-traffic endpoint fires at 3am on a quiet night." },
     { c: "", w: "" },
     { c: "aws cloudwatch put-composite-alarm --alarm-name rag-service-down \\", w: "" },
     { c: "  --alarm-rule 'ALARM(rag-5xx) OR ALARM(rag-p99) OR ALARM(rag-no-targets)' \\", w: "**One page for one incident.** Three separate alarms firing at once during the same outage is three pages and a worse night.", hi: true },
     { c: "  --alarm-actions $SNS_TOPIC", w: "" }
    ] } },

  { h: "Tracing, when the chain gets long" },
  { l: [
   "A RAG request touches your API, a database, an embedding call, a vector search and a model call. When it is slow, *which one* is the only question that matters, and logs alone will not tell you.",
   "**X-Ray** or **OpenTelemetry** gives you a waterfall per request. Instrument the boundaries: retrieval, rerank, model call, and each tool call in an agent.",
   "**Sample.** 100% tracing is expensive and unnecessary; 5% plus 100% of errors is a good default.",
   "**Put the trace id in your logs and return it to the client.** Then a user's bug report carries the exact request with it, and \"it was slow this morning\" becomes a link."
  ] },

  { h: "The bill" },
  { code: { lang: "text", t: "A real small AI product, monthly",
    lines: [
     { c: "  Bedrock / model API      Rs 42,000    72%    <- start here", hi: true },
     { c: "  Fargate (2 tasks)        Rs  3,100     5%" },
     { c: "  ALB                      Rs  1,400     2%" },
     { c: "  RDS db.t4g.small         Rs  2,900     5%" },
     { c: "  NAT Gateway x1           Rs  2,700     5%    <- endpoints fix this", hi: true },
     { c: "  S3 + requests            Rs    600     1%" },
     { c: "  CloudWatch Logs          Rs  4,800     8%    <- retention never set", hi: true },
     { c: "  Data transfer out        Rs  1,000     2%" },
     { c: "                          ---------" },
     { c: "                          Rs 58,500" },
     { c: "" },
     { c: "  Two lines are pure waste and cost more than the compute:" },
     { c: "    - logs with no retention policy" },
     { c: "    - a NAT gateway where a free S3 endpoint would do" }
    ],
    after: "That shape is typical. Model calls dominate; the next largest items are usually two accidents rather than two decisions. An engineer who reads a bill and finds those two accidents has done something visible in a way that refactoring rarely is." } },

  { ol: [
   "**Tag everything**, and activate the tags as cost allocation tags in the billing console (they do nothing until you do). `Project`, `Environment`, `Owner`, `Feature`.",
   "**Log cost per request** with the feature name, as in the logging section above. Cost Explorer tells you what AWS charged; only your own logs tell you *which feature*.",
   "**Budget alerts** at 50%, 80% and 100% of forecast, emailed to a human who will act.",
   "**Cost Anomaly Detection** — free, machine-learned, and it catches the class of problem a fixed threshold misses: a service that doubles quietly while staying under budget.",
   "**Review monthly**, with the top three lines and one action for each. Fifteen minutes."
  ] },

  { tbl: { t: "The levers, largest first",
    h: ["Lever", "Typical saving", "Effort"],
    rows: [
     ["**Retrieve fewer, better-ranked chunks**", "**30–40% of model cost**", "A day"],
     ["**Prompt caching / static-first ordering**", "15–40% of input cost", "An hour"],
     ["**Route easy requests to a small model**", "**50–65% blended**", "A week"],
     ["Log retention + stop debug logging", "Often 80% of the log line", "**Ten minutes**"],
     ["VPC endpoints instead of NAT", "₹2,000–3,000/month", "An hour"],
     ["Graviton (ARM) for Fargate and RDS", "~20% of compute", "A rebuild"],
     ["Savings Plans on steady compute", "~30% of compute", "A commitment"],
     ["S3 lifecycle + Intelligent-Tiering", "30–60% of storage", "Ten minutes"]
    ] } },

  { n: "Note the ordering. The two ten-minute items are pure waste with no downside, so do them first. The model-cost levers are the largest and involve real trade-offs, so they come with measurement. And Savings Plans come last, because committing to a year of capacity for a product whose traffic you cannot yet predict is how teams end up paying for compute they no longer use.",
    nt: "Why this order" },

  { tryit: { t: "Instrument, alarm, and cut",
    task: "On a deployed service: emit structured logs with cost and feature fields; build a Logs Insights query that returns spend per feature and per user; create the six alarms from the good list; and then find and remove two sources of waste in your own account. Write down the monthly saving.",
    hint: "The two easiest wins are almost always a log group with no retention policy and a NAT gateway carrying S3 traffic. Check both first.",
    sol: { lang: "bash", code: "# 1. Find log groups with no retention -- usually several\naws logs describe-log-groups \\\n  --query 'logGroups[?!retentionInDays].[logGroupName,storedBytes]' \\\n  --output table\n\n# Fix them all in one line\naws logs describe-log-groups --query 'logGroups[?!retentionInDays].logGroupName' \\\n  --output text | tr '\\t' '\\n' | while read g; do\n    aws logs put-retention-policy --log-group-name \"$g\" --retention-in-days 30\n  done\n\n# 2. How much is NAT actually processing?\naws cloudwatch get-metric-statistics --namespace AWS/NATGateway \\\n  --metric-name BytesOutToDestination --dimensions Name=NatGatewayId,Value=$NAT \\\n  --start-time $(date -u -d '30 days ago' +%Y-%m-%dT%H:%M:%SZ) \\\n  --end-time $(date -u +%Y-%m-%dT%H:%M:%SZ) \\\n  --period 2592000 --statistics Sum\n# 480 GB x $0.045 = ~$22/month of data processing,\n# most of it S3 traffic that a FREE gateway endpoint removes.\n\n# 3. Spend by tag, to see whether tagging is actually working\naws ce get-cost-and-usage \\\n  --time-period Start=2026-08-01,End=2026-09-01 \\\n  --granularity MONTHLY --metrics UnblendedCost \\\n  --group-by Type=TAG,Key=Feature\n# If most of it lands in 'No Feature$', your tagging is incomplete\n# -- and that is the finding, not a failure of the query.\n\n# --- Result from one real pass ---\n#   log retention set on 11 groups     -Rs 4,200/month\n#   S3 gateway endpoint added          -Rs 1,800/month\n#   rerank 12 chunks -> 5              -Rs 12,600/month\n#                                      ------------------\n#                                      -Rs 18,600/month (-32%)\n#   ...and answer quality measured flat on the golden set." },
    w: "A saving with a number and a quality check beside it is the single most portable achievement an AI engineer can carry into an interview. \"I cut our inference bill by a third with no measurable quality loss, and here is how I verified that\" is a sentence that gets remembered, and it comes from an afternoon of work like this one." } },

  { vocab: ["Observability", "Monitoring", "Logging", "Distributed Tracing", "Error Budget", "Cost Per Token"] }
 ],
 k: [
  "Log JSON to stdout with a request id on every line — fields, not formatted strings.",
  "Set log retention the day you create a group; the default is forever and it costs real money.",
  "Alarm on symptoms users feel — 5xx rate, p99, queue age, DLQ depth — not on CPU.",
  "Use Embedded Metric Format for custom metrics to avoid the per-metric charge.",
  "Model calls are 70%+ of an AI bill; the next two lines are usually accidents, not decisions."
 ],
 r: ["Observability", "Monitoring", "Logging", "Distributed Tracing", "Incident Response", "Cost Per Token"],
 drill: {
  lang: "bash",
  reps: 3,
  items: [
   { c: "aws logs put-retention-policy --log-group-name /ecs/api --retention-in-days 30", w: "stop a log group costing money forever" },
   { c: "| stats pct(latency_ms, 99) as p99 by feature, bin(1h)", w: "p99 latency per feature, hour by hour, in Logs Insights" },
   { c: "--treat-missing-data notBreaching", w: "stop a low-traffic alarm firing on a quiet night" },
   { c: "| stats sum(cost_inr) as total by feature | sort total desc", w: "answer which feature is spending the money" }
  ]
 }
}

]);
