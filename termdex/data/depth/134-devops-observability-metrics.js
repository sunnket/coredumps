/* ==========================================================================
   Depth pass 134 — DevOps & Cloud batch 5: Observability, Metrics & Telemetry.
   Observability, Monitoring, Logging, Metrics,
   Distributed Tracing, Prometheus, Grafana.

   High-cardinality telemetry, four golden signals, structured JSON logging,
   time-series percentiles, W3C distributed trace propagation, PromQL time-series engines,
   and federated visualization dashboards establish full-stack production observability.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "observability",

      why: {
        before: "Teams relied on static monitoring dashboards checking predefined health thresholds ('is server CPU > 80%?'); in distributed microservices, systems suffered catastrophic outages while all dashboards showed green because failures stemmed from novel 'unknown unknowns' (e.g., query timeouts for a single enterprise tenant across 8 service hops).",
        problem: "Modern distributed architectures are non-deterministic: failures cannot be predicted in advance, requiring an operational capability to interrogate internal system states and debug emergent distributed pathologies without deploying new code.",
        shift: "**Observability (o11y): A measure of how well the internal states of a system can be inferred from knowledge of its external outputs.** Originating in mathematical control theory, observability synthesizes high-cardinality metrics, structured logs, and distributed traces into a unified interrogable telemetry fabric."
      },

      num: {
        t: "Telemetry Pillars vs Modern Observability Paradigms",
        h: ["Telemetry Signal", "Core Data Structure", "Cardinality Limit", "Storage Cost & Indexing", "Primary Diagnostic Value"],
        r: [
          ["Metrics (Prometheus / TSDB)", "Aggregated numeric time-series ($timestamp + float64$)", "Low (high cardinality crashes TSDB)", "Ultra-cheap (highly compressed chunks)", "Detects *that* a problem is occurring (alerting, trends)"],
          ["Logs (JSON / Loki / OpenSearch)", "Discrete timestamped event strings with metadata", "High (indexed fields or raw text)", "Moderate to High (disk-intensive)", "Explains *why* a specific component failed (stack traces, errors)"],
          ["Distributed Traces (OTel / Tempo)", "Directed Acyclic Graph of Spans with timestamps", "High (trace_id, span_id, parent_id)", "High (requires sampling)", "Pinpoints *where* time was spent across microservice hops"],
          ["Wide Events (Canonical Log Lines)", "Single wide JSON object per request (50-100 fields)", "Virtually unlimited (columnar storage)", "Moderate (compressed columnar e.g. ClickHouse)", "Enables exploratory querying of 'unknown unknowns' without guessing"]
        ],
        n: "In classical Control Theory, a system is **observable** if the current state of the system can be determined in finite time using only outputs. In software engineering, observability is standardized by the **OpenTelemetry (OTel)** framework under the CNCF. True observability requires supporting **High-Cardinality and High-Dimensional Data**: the ability to filter, group, and query telemetry by unique dimensions with millions of distinct values (such as `user_id`, `tenant_id`, `cart_id`, or `device_firmware`). While traditional monitoring tests known failure modes ('known unknowns'), observability empowers engineers to isolate emergent failures ('unknown unknowns') by correlating metrics, traces, and structured logs through a unified **`trace_id`**."
      },

      miss: [
        {
          w: "Installing Prometheus, Grafana, and an ELK stack automatically gives your system Observability.",
          r: "Having three disconnected tools is **not Observability; it is three fragmented telemetry silos**. Observability requires **contextual correlation**: clicking a spike on a Grafana metric panel jumps directly to the relevant distributed traces in Tempo, which links directly to the specific structured log lines in Loki."
        },
        {
          w: "Observability and Monitoring are identical terms used interchangeably.",
          r: "**Monitoring** checks whether the system is working based on pre-configured rules and known thresholds (e.g., 'alert if error rate > 1%'). **Observability** is the capability to understand *why* a system is behaving in an unexpected way when novel, unpredicted failures occur."
        },
        {
          w: "Observability requires capturing 100% of all traces and logs in production forever.",
          r: "Capturing 100% of telemetry at high scale (100,000 req/sec) generates petabytes of data that cost more than the application compute itself. Production observability uses **Head-based and Tail-based Sampling** to retain 100% of errors and slow requests while sampling healthy requests."
        },
        {
          w: "Adding high-cardinality labels (like user IDs or session tokens) to Prometheus metrics is safe.",
          r: "Prometheus allocates memory for every unique combination of label key-value pairs. Adding high-cardinality values like `user_id` causes **metric explosion**, consuming gigabytes of RAM and crashing the Prometheus server with Out-Of-Memory (OOM) errors."
        }
      ],

      trade: {
        buys: [
          "Rapid resolution of unknown unknowns: isolate bizarre distributed bugs (e.g., latency spikes affecting only Android users in Brazil) in minutes.",
          "Radical reduction in Mean Time to Detect (MTTD) and Repair (MTTR): jump directly from high-level alerts to root-cause lines of code.",
          "Engineering team velocity: engineers ship features confidently knowing anomalous behavior is immediately visible.",
          "Elimination of guesswork in postmortems: trace waterfalls provide definitive, chronological proof of system execution paths."
        ],
        costs: [
          "Telemetry infrastructure expense: storing and indexing petabytes of logs, traces, and metrics generates substantial vendor or cloud bills.",
          "Application runtime overhead: generating spans, serializing JSON logs, and exporting telemetry consumes application CPU and network bandwidth.",
          "Code instrumentation discipline: requires developers to propagate contexts, attach span attributes, and log structured data consistently.",
          "Data privacy compliance liabilities: accidentally logging PII, passwords, or credit cards into observability tools violates GDPR and HIPAA."
        ],
        avoid: [
          "Never generate logs, metrics, and traces in disconnected silos; always inject and propagate `trace_id` across all signals.",
          "Never emit high-cardinality values (user IDs, email addresses, UUIDs) as Prometheus metric labels.",
          "Never store un-sampled distributed traces in high-throughput production environments without tail-based sampling.",
          "Never allow raw unmasked customer PII or authentication tokens to be written into telemetry logs."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "monitoring",

      why: {
        before: "Operations had no real-time visibility into infrastructure health; servers ran out of disk space silently, memory leaked until processes crashed, and engineering learned of catastrophic outages only when furious customers flooded customer support phone lines.",
        problem: "Teams require continuous, automated measurement of system health that alerts on-call engineers to service degradation before users are impacted, distinguishing normal operating fluctuations from critical production emergencies.",
        shift: "**Monitoring: The operational process of collecting, aggregating, analyzing, and displaying real-time quantitative measurements of a system's health, performance, and behavior.** Anchored by Google's Four Golden Signals and the RED method, monitoring provides automated alerting and baseline visibility."
      },

      num: {
        t: "Monitoring Frameworks: Google Golden Signals vs RED Method vs USE Method",
        h: ["Framework", "Core Telemetry Dimensions", "Target Architecture Layer", "Primary Metric Types", "Primary Focus"],
        r: [
          ["Google 4 Golden Signals", "Latency, Traffic, Errors, Saturation", "End-to-end distributed services", "Percentiles, request rates, error codes, queue buffers", "User-facing service health & capacity"],
          ["RED Method (Tom Wilkie)", "Rate (req/sec), Errors (err/sec), Duration (latency)", "Request-driven microservices / web APIs", "Counter rates, error percentages, histogram percentiles", "Service-level request performance"],
          ["USE Method (Brendan Gregg)", "Utilization (time busy), Saturation (backlog), Errors", "Hardware & infrastructure resources (CPU, disk, net)", "Percentages, queue lengths, hardware error counters", "Resource bottlenecks and hardware capacity"],
          ["Black-Box Monitoring", "External ping, HTTP status, SSL expiry, DNS resolve", "Perimeter edge / external caller view", "Uptime percentages, synthetic probe latencies", "User-visible availability (symptom monitoring)"],
          ["White-Box Monitoring", "Internal memory pools, GC pauses, thread counts", "Application runtime internals", "Gauges, JVM metrics, DB connection pool states", "Internal diagnostic insight (cause monitoring)"]
        ],
        n: "Monitoring is structured around two distinct perspectives: **Black-Box Monitoring** (testing external symptoms without knowing system internals, e.g., an external Pingdom probe hitting `/healthz`) and **White-Box Monitoring** (inspecting internal runtime counters, thread pools, and queue depths). Google's **Four Golden Signals** govern production alerting: (1) **Latency**: time taken to service a request (tracking P95/P99 percentiles, separating successful requests from errors); (2) **Traffic**: demand placed on the system (requests per second); (3) **Errors**: rate of requests that fail (explicit 5xx status codes, unhandled exceptions); and (4) **Saturation**: how full the most constrained system resource is (CPU run queue, memory buffer, database connection pool). Alerting rules MUST trigger on **Symptoms affecting users** rather than internal causes."
      },

      miss: [
        {
          w: "Alerting on high CPU utilization (e.g., CPU > 85%) is the most important alert for any server.",
          r: "Alerting on CPU is a **classic cause-based antipattern**. A server running at 95% CPU can be serving requests flawlessly within SLA. Conversely, a server at 10% CPU whose database is locked will fail 100% of user requests. **Alert on user-visible symptoms (Error Rate, Latency)**."
        },
        {
          w: "Monitoring dashboards should display as many graphs and panels as possible to be thorough.",
          r: "Giant dashboards with 60 panels create a **'Wall of Confusion'**. During an active production outage, engineers suffer cognitive overload and cannot find relevant signals. Dashboards should be hierarchical, prioritized, and focused on the Golden Signals."
        },
        {
          w: "If a monitoring alert fires and an engineer closes it because it was harmless, that is fine.",
          r: "If an alert fires and requires no human action, **it is not an alert; it is noise**. Chronic non-actionable pages cause **Alert Fatigue**, guaranteeing that engineers will sleep through or ignore a catastrophic outage. Noisy alerts must be tuned or deleted immediately."
        },
        {
          w: "Mean (average) response latency is an accurate representation of user experience.",
          r: "Averages **hide outliers completely**. An average latency of 150ms can conceal that 5% of your users are waiting 8 seconds for responses. Production monitoring mandates tracking **P95, P99, and P99.9 latency percentiles**."
        }
      ],

      trade: {
        buys: [
          "Proactive incident detection: discover and mitigate performance degradations before end users file customer support tickets.",
          "Actionable operational guardrails: SLO-based alerting ensures on-call engineers are paged only when error budgets are breached.",
          "Capacity planning data: historical traffic and saturation metrics guide infrastructure right-sizing and cloud cost budgets.",
          "Automated infrastructure self-healing: feeds real-time metrics to Kubernetes HPAs and load balancer health checks."
        ],
        costs: [
          "Alert fatigue hazard: noisy, poorly calibrated alerts desensitize on-call engineers to genuine production emergencies.",
          "Metric scraping overhead: frequent scraping of thousands of application metrics generates continuous network and CPU overhead.",
          "Dashboard maintenance debt: dashboards bit-rot as architectures evolve unless maintained as version-controlled code.",
          "False sense of security: monitoring only catches 'known knowns' and predefined threshold violations, missing emergent bugs."
        ],
        avoid: [
          "Never configure pager alerts for internal causes (e.g., CPU > 80%) unless it directly threatens user-facing SLAs.",
          "Never create an alert that pages an engineer outside business hours without attaching a link to a concrete runbook.",
          "Never evaluate service performance using mean (average) latency; always evaluate P95 and P99 percentiles.",
          "Never allow broken or flapping alerts to page on-call rotations repeatedly without immediate silencing and remediation."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "logging",

      why: {
        before: "Developers wrote unstructured, free-text log strings directly to local disk files (`log.Println(\"User logged in: \" + id)`); during incidents, operators had to SSH into 40 different servers, run fragile `grep` commands across gigabytes of text, and manually piece together the timeline of a failed transaction.",
        problem: "Distributed systems require an auditable, searchable, high-throughput record of discrete system events that can be ingested from thousands of containers, parsed systematically by machines, and correlated across microservice boundaries.",
        shift: "**Logging: The practice of recording discrete, timestamped events emitted by software during execution for debugging, auditing, compliance, and post-incident analysis.** Emphasizing machine-readable structured JSON format and correlation IDs, logging provides granular forensic evidence."
      },

      num: {
        t: "Centralized Logging Architectures: Ingestion Engines & Storage Paradigms",
        h: ["Logging System", "Storage & Indexing Model", "Query Language", "Ingestion Resource Overhead", "Optimal Production Scale"],
        r: [
          ["Elasticsearch / OpenSearch (ELK)", "Full-text inverted index on every JSON field", "Lucene / KQL (Kibana Query Language)", "High (heavy RAM/disk for Lucene inverted index)", "Enterprise search, complex multi-attribute ad-hoc queries"],
          ["Grafana Loki", "Indexes only stream labels; stores raw chunks", "LogQL (Prometheus-inspired log query language)", "Minimal (ultra-lightweight ingestion footprint)", "Cloud-native Kubernetes, cost-conscious microservices"],
          ["ClickHouse (Columnar)", "Columnar DBMS with data-skipping indexes", "Standard SQL with vector functions", "Low to Moderate (blazing fast compression)", "High-throughput hyper-scale logging (millions of events/sec)"],
          ["AWS CloudWatch Logs", "Proprietary AWS managed log store", "CloudWatch Logs Insights syntax", "Zero server maintenance; high AWS data ingestion cost", "AWS serverless (Lambda, ECS) cloud-native workloads"]
        ],
        n: "Modern engineering strictly mandates **Structured Logging**: emitting logs as valid JSON objects containing standardized schema keys (`timestamp`, `level`, `service`, `message`, `trace_id`, `span_id`, `duration_ms`, `http_status`). In standard **Twelve-Factor App (Factor 11: Logs)**, application processes write logs exclusively to unbuffered `stdout` / `stderr`. A node-level log shipper daemon (such as **Fluent Bit**, **Vector**, or **Promtail**) scrapes the container stdout streams, enriches them with Kubernetes metadata (pod name, namespace), and ships them to a centralized storage cluster. Crucially, every log statement associated with an HTTP request MUST include the **Correlation ID (`trace_id`)** to enable filtering all logs emitted across 10 microservices for a single user transaction."
      },

      miss: [
        {
          w: "Writing logs as plain-text formatted strings is fine as long as developers write clear English descriptions.",
          r: "Plain-text logs require brittle regular expressions to parse. **Production systems must emit structured JSON**. Machine-readable JSON allows log systems to index fields like `user_id` or `status_code` natively, enabling instant SQL-like filtering across billions of log lines."
        },
        {
          w: "Logging everything at DEBUG level in production ensures you have all the data needed to fix any bug.",
          r: "Logging verbose debug output in production **balloons storage bills by 10x, exhausts disk I/O, and drowns critical error signals in noise**. Production logs should default to `INFO` or `WARN`, with `DEBUG` toggled dynamically via feature flags or log-level APIs."
        },
        {
          w: "Logging user passwords, auth tokens, and credit card numbers is harmless if logs are stored in private cloud storage.",
          r: "Logging secrets is a **catastrophic security and compliance failure (CWE-532)**. Logs are widely accessible to developers, shipped to third-party SaaS tools, and retained for long periods. Loggers MUST implement **automated PII redaction filters**."
        },
        {
          w: "Applications should write log files directly to local server hard drives (`/var/log/app.log`).",
          r: "Writing to local files exhausts server disk space, creates non-reproducible state, and loses logs when ephemeral containers restart. Applications should **log directly to `stdout`**, allowing orchestrators and daemon log shippers to handle aggregation."
        }
      ],

      trade: {
        buys: [
          "Exhaustive forensic audit trails: reconstruct the exact chronological sequence of events, inputs, and states during an incident.",
          "Instant cross-service transaction tracing: filtering by `trace_id` aggregates all logs emitted across dozens of microservices.",
          "Regulatory compliance: satisfies SOC 2, HIPAA, and PCI-DSS audit log retention and security monitoring mandates.",
          "Machine-parsable telemetry: structured JSON logs enable automated error rate detection and log-derived metrics."
        ],
        costs: [
          "Massive storage and network expenses: high-volume logging clusters consume substantial disk space and cloud network transfer fees.",
          "Application I/O overhead: synchronous logging locks application threads; logging must be asynchronous and non-blocking.",
          "Data privacy compliance liability: accidental logging of customer PII requires complex log scrub and purge procedures.",
          "Query latency at scale: querying petabytes of full-text indexed logs across long time ranges can be slow and resource-intensive."
        ],
        avoid: [
          "Never emit unstructured plain-text strings in production; always use structured JSON logging format.",
          "Never log unredacted passwords, authorization bearer tokens, API keys, or credit card numbers.",
          "Never write logs synchronously to local disk files inside containerized applications; stream to `stdout`.",
          "Never log high-frequency events inside tight inner loops (e.g., inside every iteration of a 100,000-item array)."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "metrics",

      why: {
        before: "Systems attempted to monitor performance by parsing text log files or storing every request event in relational databases; at high traffic (50,000 req/sec), the compute and storage cost of processing raw events exceeded the cost of running the actual applications.",
        problem: "High-throughput distributed systems require a lightweight, highly compressed numeric data format that aggregates measurements over time, enabling sub-second dashboard rendering and automated threshold evaluation with minimal overhead.",
        shift: "**Metrics: Numeric measurements recorded and aggregated over time, representing the quantifiable operational health, performance, and resource utilization of a system.** Stored in Time-Series Databases (TSDBs) as timestamped values with dimensional key-value labels, metrics power real-time dashboards and alerting."
      },

      num: {
        t: "Core Metric Types: Characteristics & Mathematical Semantics",
        h: ["Metric Type", "Value Behavior", "Reset on Restart?", "Aggregation Function", "Primary Production Workload"],
        r: [
          ["Counter", "Monotonically increasing integer/float (only goes up or resets to 0)", "Yes (resets to 0 on process reboot)", "`rate()`, `increase()` in PromQL", "Total requests served, cumulative HTTP errors, bytes sent"],
          ["Gauge", "Arbitrary numerical value (can go up, down, or stay flat)", "Yes (reports instantaneous current state)", "`avg()`, `max()`, `min()` over time", "Current memory usage, CPU temperature, active thread count, queue depth"],
          ["Histogram", "Samples observations into configurable cumulative buckets", "Yes (bucket counters reset to 0)", "`histogram_quantile()` for P50/P90/P99", "Request duration latencies, payload byte sizes"],
          ["Summary", "Directly calculates streaming quantiles over sliding time window", "Yes (in-memory sliding window)", "Precomputed percentiles on client side", "Legacy quantile tracking (cannot be aggregated across pods)"]
        ],
        n: "Metrics are stored in specialized **Time-Series Databases (TSDBs)** using highly optimized delta-of-delta timestamp compression (Gorilla compression algorithm) and XOR floating-point compression, allowing a single metric sample to occupy less than 1.5 bytes on disk. A metric consists of: (1) **Metric Name** (`http_requests_total`); (2) **Labels / Dimensions** (`{method=\"POST\", status=\"200\", service=\"auth\"}`); and (3) **Timestamped Samples** ($t, v$). The cardinal rule of metrics is: **Percentiles, Not Averages**. Because averages completely obscure the long tail of user suffering, request duration must be measured using **Histograms** to compute **P95, P99, and P99.9 Percentiles**. High label cardinality (e.g., attaching user IDs to labels) multiplies time series exponentially, crashing TSDB memory."
      },

      miss: [
        {
          w: "Calculating average (mean) request latency is sufficient to monitor user performance.",
          r: "Averages **conceal critical performance degradation**. If 99 requests take 10ms and 1 request takes 10,000ms, the average is ~109ms (looking healthy), while 1% of your users experience a 10-second freeze. **Production metrics require P95 and P99 percentiles computed via Histograms**."
        },
        {
          w: "You can safely add customer email addresses or UUIDs as metric labels in Prometheus.",
          r: "This causes **Metric Cardinality Explosion**. Every unique combination of label values creates an entirely new time-series stream in memory. Adding 100,000 unique user IDs will create millions of series, exhausting RAM and crashing Prometheus."
        },
        {
          w: "Summaries are superior to Histograms because they compute percentiles directly in the client library.",
          r: "Summaries compute percentiles client-side and **CANNOT be mathematically aggregated across multiple instances**. If you have 5 pods running a service, you cannot calculate the true P99 latency across the cluster from summaries. **Histograms must be used for cluster-wide percentiles**."
        },
        {
          w: "Metrics replace the need for application logging.",
          r: "Metrics tell you **THAT something is broken** (e.g., error rate spiked from 0.1% to 5%), but cannot tell you **WHY it is broken**. Metrics indicate when to investigate; structured logs and traces provide the diagnostic explanation."
        }
      ],

      trade: {
        buys: [
          "Extreme storage efficiency: compressed time-series data requires only ~1.5 bytes per sample, storing billions of points cheaply.",
          "Sub-second query performance: time-series databases render multi-day trend graphs and evaluate alert thresholds in milliseconds.",
          "Mathematically rigorous percentiles: histograms provide mathematically aggregatable P50, P95, and P99 latency distributions.",
          "Low runtime compute overhead: updating in-memory atomic counters in application code has near-zero performance cost."
        ],
        costs: [
          "Loss of individual event fidelity: aggregated numbers cannot explain why an individual specific request failed.",
          "Cardinality explosion risk: accidental inclusion of dynamic identifiers in labels crashes time-series database memory.",
          "Client-side histogram bucket tuning: misconfigured bucket boundaries lead to inaccurate percentile interpolations.",
          "Retention limitations: raw high-frequency time-series data is expensive to retain long-term without downsampling."
        ],
        avoid: [
          "Never include high-cardinality values (user IDs, request IDs, IP addresses) in metric label dimensions.",
          "Never rely on average (mean) latency for SLAs; always measure P95 and P99 percentiles.",
          "Never configure wide, coarse histogram buckets that cluster around your latency target; place granular buckets near your SLO threshold.",
          "Never use client-calculated Summaries when cluster-wide percentile aggregation across pods is required."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "distributed-tracing",

      why: {
        before: "In a microservice architecture where a single user click traversed 20 different services (API Gateway -> Auth -> Order -> Inventory -> Payment -> DB), a slow response or 500 error left engineers helpless; each service's logs were disconnected, and determining which service caused the 4-second delay was impossible.",
        problem: "Engineering teams need a standardized way to trace the end-to-end execution path of a single transaction across distributed service boundaries, measuring exact latency and errors at every network hop.",
        shift: "**Distributed Tracing: A telemetry method used to profile and monitor applications, especially those built using a microservices architecture, by tracking the lifecycle of requests as they propagate across network boundaries.** Spearheaded by Google Dapper and standardized by OpenTelemetry, tracing visualizes distributed call trees."
      },

      num: {
        t: "Distributed Tracing Protocols & Storage Backends: Architectural Comparison",
        h: ["Tracing Component", "Specification / Format", "Context Header Standard", "Trace Storage Engine", "Primary Sampling Paradigm"],
        r: [
          ["OpenTelemetry (OTel)", "CNCF vendor-neutral telemetry standard", "W3C TraceContext (`traceparent`)", "Pluggable (Jaeger, Tempo, ClickHouse)", "Head-based (SDK) & Tail-based (Collector)"],
          ["Jaeger", "CNCF open-source distributed tracing platform", "W3C TraceContext / Jaeger native", "OpenSearch / Elasticsearch / Cassandra", "Adaptive dynamic sampling based on traffic"],
          ["Grafana Tempo", "High-scale, cost-effective distributed tracing", "W3C TraceContext / OTLP", "Object Storage (S3 / GCS) without indexing", "Ingests 100% of traces; cheap object storage"],
          ["AWS X-Ray", "Proprietary AWS managed cloud tracing service", "`X-Amzn-Trace-Id` header", "AWS managed backend storage", "Reservoir sampling (1 req/sec + 5% additional)"]
        ],
        n: "Distributed tracing models an execution flow as a **Trace**, which is represented as a Directed Acyclic Graph (DAG) of **Spans**. A **Span** represents a single contiguous unit of work (e.g., executing an HTTP request or database query), containing a name, start time, duration, status, and custom attributes (`http.status_code: 200`, `db.statement: SELECT...`). Tracing operates via **Context Propagation**: when Service A calls Service B, it injects the **W3C TraceContext** HTTP header: `traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01` (comprising Version, 16-byte Trace ID, 8-byte Parent Span ID, and Trace Flags). Service B extracts the header, links its child span to the parent span, and propagates it downstream. In high-volume systems, **Tail-based Sampling** buffers traces in an OpenTelemetry Collector and saves only traces that contained errors or breached latency thresholds."
      },

      miss: [
        {
          w: "Distributed tracing requires manually rewriting all application code to time every function call.",
          r: "Modern distributed tracing relies on **OpenTelemetry Auto-Instrumentation**. OTel bytecode agents or monkey-patching libraries automatically intercept incoming HTTP requests, outgoing HTTP calls, database queries, and Redis commands without modifying business logic."
        },
        {
          w: "Traces can automatically connect across microservices without propagating headers.",
          r: "If a single service in a 10-hop call chain fails to **extract and propagate the `traceparent` HTTP header** to its downstream calls, the trace is **broken into disconnected pieces**. Context propagation across HTTP, gRPC, and message queues is mandatory."
        },
        {
          w: "Distributed tracing should record 100% of all requests in production.",
          r: "Storing 100% of traces at high scale generates petabytes of redundant data and heavy network overhead. Production systems use **Head-based Sampling (e.g., 1-5% of requests)** or **Tail-based Sampling (saving 100% of errors and 1% of successes)**."
        },
        {
          w: "Distributed tracing replaces the need for structured logging and metrics.",
          r: "Tracing is the **connective glue**, not a complete replacement. Tracing shows *where* time was spent across services, but structured logs explain detailed error diagnostics, and metrics provide lightweight long-term trend analysis and alerting."
        }
      ],

      trade: {
        buys: [
          "Instant latency bottleneck visualization: waterfall timeline charts pinpoint the exact slow database query or downstream microservice.",
          "End-to-end service dependency mapping: automatically generates topological maps of service architecture and traffic flow.",
          "Root-cause isolation across teams: eliminates inter-team blame by proving definitively which service introduced an error.",
          "Complete visibility into asynchronous messaging: tracks messages across Kafka/RabbitMQ queues from publisher to consumer."
        ],
        costs: [
          "Sampling configuration complexity: tuning tail-based sampling rules to capture elusive edge-case bugs without exploding storage.",
          "Network and memory overhead: injecting and serializing span metadata on every network hop adds slight network payload bloat.",
          "Context propagation maintenance: asynchronous thread handoffs, background goroutines, and worker queues require careful context plumbing.",
          "Storage infrastructure expenses: maintaining distributed tracing backends (Tempo/Jaeger) requires significant storage allocations."
        ],
        avoid: [
          "Never break context propagation; always pass context tokens through internal function calls and outgoing HTTP headers.",
          "Never store un-sampled distributed traces in high-throughput production environments without tail-based sampling.",
          "Never put unbounded payload data (full JSON request/response bodies) into span attributes.",
          "Never use proprietary vendor tracing headers when the open W3C TraceContext standard (`traceparent`) is available."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "prometheus",

      why: {
        before: "Traditional monitoring tools pushed metrics from agents over the network to centralized servers; during major network partitions or server overloads, agent push floods overwhelmed monitoring collectors, while dead servers that silently crashed stopped reporting with no immediate detection.",
        problem: "Cloud-native containerized environments need a resilient, multidimensional time-series monitoring system that automatically discovers dynamic container targets, pulls metrics reliably, and provides a powerful mathematical query language.",
        shift: "**Prometheus: An open-source, metrics-based monitoring and alerting system designed for reliability and cloud-native architectures, operating primarily via pull-based scraping of HTTP endpoints.** Featuring an autonomous single-node TSDB and the PromQL query language, Prometheus is the de facto monitoring standard for Kubernetes."
      },

      num: {
        t: "Prometheus Monitoring Ecosystem: Core Component Architecture",
        h: ["Component", "Architectural Role", "Data Storage Mechanism", "Communication Protocol", "Failure Impact"],
        r: [
          ["Prometheus Server", "Scrapes targets, evaluates rules, stores time series", "Local append-only TSDB block chunks on disk", "HTTP pull scraping (`/metrics`)", "Local monitoring and alerting halts on that instance"],
          ["Alertmanager", "Deduplicates, groups, and routes alerts to PagerDuty/Slack", "In-memory state + mesh gossip cluster", "HTTP POST from Prometheus server", "Alerts cannot be dispatched to humans"],
          ["Node Exporter", "Exposes host hardware & OS metrics (CPU, disk, network)", "Stateless (queries Linux `/proc` and `/sys`)", "HTTP GET endpoint on port 9100", "Host OS telemetry missing; node still runs"],
          ["kube-state-metrics", "Exposes Kubernetes object state metrics (pod status, replicas)", "Stateless (watches Kubernetes API)", "HTTP GET endpoint on port 8080", "Cluster orchestration telemetry missing"],
          ["Thanos / Mimir", "Provides long-term storage, global querying, HA deduplication", "Cloud Object Storage (S3/GCS) + distributed querier", "gRPC / StoreAPI", "Long-term historical queries fail; live scraping unaffected"]
        ],
        n: "Prometheus operates via a **Pull-Based Architecture**: instead of applications pushing data out, the Prometheus server discovers targets dynamically (using Kubernetes API service discovery) and periodically scrapes their HTTP endpoints (typically `GET /metrics` returning OpenMetrics plain-text exposition format) on a configured **Scrape Interval** (e.g., every 15 seconds). The pull model has a profound operational advantage: **Prometheus instantly detects when a target is down** (if a scrape fails, it records `up == 0`). Metrics are queried using **PromQL (Prometheus Query Language)**, which executes vector math across multidimensional labels (e.g., calculating 5-minute per-second request rates via `sum(rate(http_requests_total[5m])) by (status)`). For long-term historical retention and multi-cluster querying, Prometheus pairs with **Thanos** or **Grafana Mimir**."
      },

      miss: [
        {
          w: "Prometheus should be used to store metrics permanently for years of historical analysis.",
          r: "Prometheus is engineered for **real-time operational monitoring and alerting (typically 15-30 days retention)**. Storing years of data locally exhausts local disk IOPS and crashes during large queries. Long-term metric storage mandates **Thanos, Cortex, or Grafana Mimir** backed by object storage."
        },
        {
          w: "A push-based metric model is always superior to Prometheus's pull-based scraping model.",
          r: "The pull model provides **built-in health detection** (a failed scrape proves a service is dead), prevents misbehaved applications from flooding monitoring servers with DDOS traffic, and allows monitoring configurations to be managed centrally."
        },
        {
          w: "Prometheus can monitor short-lived batch jobs and serverless Lambdas using standard scrape intervals.",
          r: "If a serverless Lambda or cron job runs for only 3 seconds, it will terminate before Prometheus's 15-second scrape cycle can hit it. Short-lived ephemeral tasks must push their metrics to the **Prometheus Pushgateway**, which Prometheus scrapes normally."
        },
        {
          w: "Writing PromQL queries using `rate()` over raw counters is identical to using `increase()`.",
          r: "`rate(v[1m])` calculates the **per-second average rate of change** over the time window. `increase(v[1m])` calculates the **total absolute increase** over that window. Using `increase()` inside rate calculations distorts per-second graphs."
        }
      ],

      trade: {
        buys: [
          "Autonomous operational reliability: single-node architecture has zero distributed dependencies, ensuring monitoring works even during cluster outages.",
          "Dynamic cloud-native service discovery: automatically detects newly spun-up Kubernetes pods, services, and nodes instantly.",
          "Expressive multidimensional PromQL: powerful vector math enables sophisticated SLI/SLO calculations and rate derivations.",
          "Universal industry standard: supported by virtually every open-source cloud project with native `/metrics` endpoints."
        ],
        costs: [
          "Memory vulnerability to high cardinality: accidental injection of high-cardinality labels crashes Prometheus with OOM panics.",
          "Non-distributed single node scale ceiling: a single Prometheus server can only scale to millions of series before requiring sharding.",
          "Limited native long-term retention: requires deploying and managing secondary distributed systems (Thanos/Mimir) for long-term storage.",
          "Pull model network firewall constraints: requires Prometheus servers to have direct network line-of-sight to target pod endpoints."
        ],
        avoid: [
          "Never add dynamic values (user IDs, request IDs, email addresses) into Prometheus metric label dimensions.",
          "Never run Prometheus in production without defining resource limits and setting `--storage.tsdb.retention.size` boundaries.",
          "Never query raw counters directly in Grafana graphs without wrapping them in PromQL `rate()` or `increase()` functions.",
          "Never use the Pushgateway as a general-purpose metric collector for long-lived web services; use it solely for ephemeral batch jobs."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "grafana",

      why: {
        before: "Engineers had to log into separate web consoles for every tool (Prometheus for metrics, Elasticsearch for logs, AWS CloudWatch for cloud infra, MySQL for DB stats); during high-stress production outages, correlating disparate data across 5 different UIs delayed incident resolution.",
        problem: "Organizations require a unified, multi-tenant visualization and dashboarding platform that federates metrics, logs, and traces from heterogeneous data sources into correlated, real-time operational views.",
        shift: "**Grafana: An open-source analytics, visualization, and interactive dashboarding web platform that queries, visualizes, alerts on, and explores metrics, logs, and traces regardless of where they are stored.** Enabling multi-source data federation and 'Dashboard as Code', Grafana serves as the visual command center of modern DevOps."
      },

      num: {
        t: "Unified Observability Dashboards: Grafana vs Dedicated APM Platforms",
        h: ["Platform", "Data Source Model", "Dashboard Portability", "Metric / Log / Trace Correlation", "Deployment & Governance Model"],
        r: [
          ["Grafana (Open Source / Cloud)", "Federated (connects to 100+ heterogeneous DBs)", "JSON definitions versioned in Git (IaC)", "Seamless via split-view data links & trace-to-logs", "Self-hosted container or fully managed cloud"],
          ["Kibana / OpenSearch Dashboards", "Coupled strictly to Elasticsearch/OpenSearch", "JSON exportable via API", "Coupled to Elasticsearch document store", "Self-hosted cluster or cloud managed service"],
          ["Datadog Dashboards", "Proprietary unified SaaS data lake", "Terraform Datadog provider supported", "Built-in proprietary correlation", "100% vendor-locked proprietary SaaS"],
          ["AWS CloudWatch Dashboards", "Coupled to AWS native telemetry ecosystem", "CloudFormation / Terraform IaC", "Basic correlation within AWS services", "Native AWS managed service"]
        ],
        n: "Grafana's architectural superpower is **Data Source Federation**: it does not store telemetry data itself; instead, it provides native pluggable query connectors for **Prometheus, Loki, Tempo, OpenSearch, PostgreSQL, InfluxDB, and CloudWatch**, allowing a single dashboard panel to plot Prometheus CPU metrics alongside PostgreSQL query times and AWS billing numbers. Panels support diverse visualizations: Time Series, Stat, Bar Gauges, Heatmaps, and Node Graph dependency maps. In production SRE operations, **Dashboards MUST be managed as Code (Dashboard as Code)**: authored in JSON or generated via tools like **Jsonnet / Grafana Operator** and checked into Git, preventing accidental manual edits from breaking production dashboards."
      },

      miss: [
        {
          w: "Grafana stores all metrics and logs inside its own internal database.",
          r: "Grafana's internal database (SQLite or PostgreSQL) stores **ONLY configuration metadata** (user accounts, permissions, dashboard JSON definitions). All telemetry data is queried dynamically on-the-fly from underlying external data sources (Prometheus, Loki)."
        },
        {
          w: "Building dashboards with 50+ panels on a single page is the best way to monitor a service.",
          r: "Mega-dashboards create a **disastrous 'Wall of Confusion'** during outages and execute 50 heavy concurrent queries that overwhelm backend Prometheus databases. Dashboards should be compact, hierarchical, and focused strictly on the Four Golden Signals."
        },
        {
          w: "Clicking through the Grafana UI to build dashboards manually is standard production practice.",
          r: "Manual UI dashboard creation leads to lost changes and configuration drift. In production environments, dashboards should be managed as **Dashboard as Code** using Terraform, Jsonnet (grafonnet), or the Kubernetes Grafana Operator."
        },
        {
          w: "Grafana alerts can only notify humans via email.",
          r: "Grafana features an advanced **Alerting Engine** that routes alerts to PagerDuty, Opsgenie, Slack, Webhooks, and Microsoft Teams, supporting complex alert routing trees, deduplication, and suppression policies."
        }
      ],

      trade: {
        buys: [
          "Universal data source federation: query and display Prometheus metrics, Loki logs, and Tempo traces side-by-side in one view.",
          "Seamless context jumping: click a latency spike on a metric graph to instantly view correlated distributed traces in a split-screen pane.",
          "Dashboard as Code reproducibility: store entire dashboard suites as version-controlled JSON/Jsonnet files in Git repositories.",
          "Flexible, customizable alerting: evaluate alert rules across heterogeneous data sources and route to on-call notification channels."
        ],
        costs: [
          "Downstream query load pressure: popular or auto-refreshing dashboards execute continuous queries that can overload backend databases.",
          "Dashboard maintenance rot: dashboards fall out of sync with software releases unless maintained with engineering discipline.",
          "Query language learning curve: engineers must learn distinct query languages (PromQL, LogQL, SQL) for different panel data sources.",
          "Access control management: enterprise RBAC permissions across multi-tenant teams requires Grafana Enterprise or careful folder structuring."
        ],
        avoid: [
          "Never build massive 50-panel dashboards that cause query timeouts on Prometheus during incidents.",
          "Never maintain production dashboards exclusively through manual web UI clicks; version-control dashboards in Git.",
          "Never configure panels with aggressive 1-second auto-refresh intervals across high-traffic engineering teams.",
          "Never create alert panels without including direct links to actionable troubleshooting runbooks."
        ]
      }
    }

  ]);

})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
