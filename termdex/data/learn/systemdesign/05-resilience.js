/* System Design — High Availability & Resilience. */
TD.addLessons("systemdesign", [

    {
        t: "Circuit Breakers, Bulkheads & Cascading Failure Prevention",
        m: "resilience",
        lvl: "advanced",
        s: "Preventing cascading outages in microservices: state machines, thread isolation, and fail-fast fallbacks.",
        goal: [
            "Implement the Circuit Breaker pattern with Closed, Open, and Half-Open states",
            "Isolate downstream dependency failures using the Bulkhead pattern",
            "Set defensive timeouts to prevent thread pool exhaustion"
        ],
        b: [
            { p: "In a microservice mesh with 50 services, if one minor recommendation service starts taking 10 seconds to respond, upstream services wait, their HTTP connection pools saturate, their thread pools fill up, and they begin dropping requests. Within minutes, a minor dependency failure causes a **Cascading Failure** that takes down the entire company." },

            { dg: "sys-circuit-breaker" },

            { h: "The Circuit Breaker State Machine" },
            {
                tbl: {
                    t: "Circuit Breaker States",
                    h: ["State", "Traffic Handling", "Transition Trigger", "Behavior"],
                    rows: [
                        ["**CLOSED (Normal)**", "All requests pass through to the dependency", "Error rate exceeds threshold (e.g. 50% failures over 10s)", "Normal operations; failure counter increments on 5xx or timeouts"],
                        ["**OPEN (Tripped)**", "**Blocks all calls immediately** (Fast-Fail)", "Sleep window timer expires (e.g. 30 seconds)", "Returns instantaneous fallback response or cached data without hitting the broken dependency, allowing it to recover"],
                        ["**HALF-OPEN (Testing)**", "Allows a small trial percentage of probe requests through", "If trial requests succeed → **CLOSED**; If any fail → **OPEN**", "Tests if the dependency has genuinely recovered before reopening full traffic"]
                    ]
                }
            },

            { h: "The Bulkhead Pattern: Ship Compartmentalization" },
            { p: "Named after watertight bulkheads in ships that prevent a single hull breach from sinking the entire vessel: **assign isolated thread pools and connection pools to each downstream dependency**. If the Payment gateway is slow, only its dedicated 20-thread pool is blocked; the Search and Auth endpoints continue operating with their own untouched thread pools." },

            {
                code: {
                    lang: "python", t: "Circuit Breaker Pattern in Python",
                    lines: [
                        { c: "import time", w: "" },
                        { c: "", w: "" },
                        { c: "class CircuitBreaker:", w: "" },
                        { c: "    def __init__(self, failure_threshold=5, recovery_timeout=30):", w: "" },
                        { c: "        self.state = 'CLOSED'", w: "**Initial state.**" },
                        { c: "        self.failure_count = 0", w: "" },
                        { c: "        self.failure_threshold = failure_threshold", w: "" },
                        { c: "        self.recovery_timeout = recovery_timeout", w: "" },
                        { c: "        self.last_state_change = time.time()", w: "" },
                        { c: "", w: "" },
                        { c: "    def call(self, fn, fallback_fn, *args, **kwargs):", w: "" },
                        { c: "        # Check if OPEN state has expired -> move to HALF-OPEN", w: "" },
                        { c: "        if self.state == 'OPEN':", w: "" },
                        { c: "            if time.time() - self.last_state_change > self.recovery_timeout:", w: "" },
                        { c: "                self.state = 'HALF-OPEN'", w: "**Probe state.**", hi: true },
                        { c: "            else:", w: "" },
                        { c: "                return fallback_fn(*args, **kwargs)  # Fast-Fail", w: "**Instant fallback, zero latency penalty.**", hi: true },
                        { c: "", w: "" },
                        { c: "        try:", w: "" },
                        { c: "            res = fn(*args, **kwargs)  # Call real service", w: "" },
                        { c: "            if self.state == 'HALF-OPEN':", w: "" },
                        { c: "                self.state = 'CLOSED'; self.failure_count = 0", w: "**Recovered.**", hi: true },
                        { c: "            return res", w: "" },
                        { c: "        except Exception as e:", w: "" },
                        { c: "            self.failure_count += 1", w: "" },
                        { c: "            if self.failure_count >= self.failure_threshold or self.state == 'HALF-OPEN':", w: "" },
                        { c: "                self.state = 'OPEN'; self.last_state_change = time.time()", w: "**Trip circuit.**", hi: true },
                        { c: "            return fallback_fn(*args, **kwargs)", w: "" }
                    ]
                }
            },

            { trap: "Never make a remote network RPC without setting an explicit, aggressive timeout. The default timeout in many HTTP client libraries is infinite (`timeout=None`), which is the single most common cause of thread pool exhaustion in production." },

            { vocab: ["Circuit Breaker", "Bulkhead", "Timeout", "Graceful Degradation", "Distributed System"] }
        ],
        k: [
            "Circuit breakers prevent cascading outages by fast-failing broken dependencies and serving degraded fallbacks.",
            "Bulkheads isolate connection and thread pools per service, preventing a slow service from consuming all server resources.",
            "Every remote call must have strict timeouts and fallback degraded responses."
        ],
        r: ["Circuit Breaker", "Bulkhead", "Timeout", "Graceful Degradation", "Rate Limiting"],
        drill: {
            lang: "python",
            reps: 3,
            items: [
                { c: "requests.get(url, timeout=(1.0, 3.0))  # (connect_timeout, read_timeout)", w: "strict HTTP timeout configuration" },
                { c: "if circuit.is_open(): return cached_fallback()", w: "circuit breaker fast-fail check" },
                { c: "# Bulkhead: isolate thread pools per downstream dependency", w: "bulkhead pattern definition" }
            ]
        }
    },

    {
        t: "Rate Limiting Algorithms (Token Bucket, Leaky Bucket, Sliding Window)",
        m: "resilience",
        lvl: "advanced",
        s: "Protecting APIs from abuse: comparison of 5 rate limiting algorithms and a distributed Redis sliding window.",
        goal: [
            "Compare Token Bucket, Leaky Bucket, Fixed Window, and Sliding Window algorithms",
            "Implement a scalable distributed Sliding Window Counter using Redis Lua scripts",
            "Return compliant `X-RateLimit-*` and `429 Too Many Requests` headers"
        ],
        b: [
            { p: "Rate limiting caps the number of requests a client can make in a specified window (e.g. 100 requests per minute). It protects APIs against DDoS attacks, brute-force password stuffing, scrapers, and noisy neighbor tenant starvation in SaaS." },

            { h: "Rate Limiting Algorithms Compared" },
            {
                tbl: {
                    t: "Rate Limiting Algorithms Comparison",
                    h: ["Algorithm", "Mechanism", "Pros", "Cons / Edge Cases"],
                    rows: [
                        ["**Token Bucket**", "Tokens added to bucket at rate $R$; capacity capped at $B$. Request consumes 1 token.", "Allows short bursts up to capacity $B$; memory-efficient (2 numbers: tokens & timestamp)", "Complex to tune burst parameter $B$"],
                        ["**Leaky Bucket**", "Requests enter FIFO queue; processed at constant fixed leak rate", "Completely smooths traffic into a uniform stream", "Bursts are delayed or dropped if the queue is full"],
                        ["**Fixed Window Counter**", "Counts requests in fixed time windows (e.g. 12:00:00–12:01:00)", "Simple memory increment", "**Boundary spike vulnerability**: 2x burst allowed across window edges (100 req at 12:00:59 + 100 req at 12:01:01 = 200 req in 2 seconds)"],
                        ["**Sliding Window Log**", "Stores sorted timestamp set of every request in Redis ZSET", "100% mathematically accurate rate limiting", "**High memory consumption**: Storing thousands of timestamps per user per minute"],
                        ["**Sliding Window Counter**", "Approximates count: `prev_count * (1 - overlap) + curr_count`", "**Industry standard**: Ultra-low memory + smooths boundary bursts", "Slight approximation error (<0.05%)"]
                    ]
                }
            },

            {
                code: {
                    lang: "lua", t: "Atomic Sliding Window Counter in Redis (Lua Script)",
                    lines: [
                        { c: "-- KEYS[1]: user rate limit key (e.g. ratelimit:user_123:60)", w: "" },
                        { c: "-- ARGV[1]: current timestamp in milliseconds", w: "" },
                        { c: "-- ARGV[2]: window size in milliseconds (e.g. 60000 for 1 min)", w: "" },
                        { c: "-- ARGV[3]: max allowed requests (e.g. 100)", w: "" },
                        { c: "", w: "" },
                        { c: "local now = tonumber(ARGV[1])", w: "" },
                        { c: "local window = tonumber(ARGV[2])", w: "" },
                        { c: "local limit = tonumber(ARGV[3])", w: "" },
                        { c: "local clear_before = now - window", w: "Clear expired timestamps." },
                        { c: "", w: "" },
                        { c: "-- 1. Remove all request timestamps older than current sliding window", w: "" },
                        { c: "redis.call('ZREMRANGEBYSCORE', KEYS[1], 0, clear_before)", w: "**Prune old requests.**", hi: true },
                        { c: "", w: "" },
                        { c: "-- 2. Count current active requests in window", w: "" },
                        { c: "local current_requests = redis.call('ZCARD', KEYS[1])", w: "O(1) cardinality." },
                        { c: "", w: "" },
                        { c: "if current_requests < limit then", w: "" },
                        { c: "    -- 3. Add current timestamp to sorted set", w: "" },
                        { c: "    redis.call('ZADD', KEYS[1], now, now)", w: "Record request." },
                        { c: "    redis.call('PEXPIRE', KEYS[1], window)", w: "Auto-cleanup idle keys." },
                        { c: "    return {1, limit - current_requests - 1}  -- ALLOWED", w: "**Return 1 + remaining quota.**", hi: true },
                        { c: "else", w: "" },
                        { c: "    return {0, 0}                             -- REJECTED (429)", w: "**Return 0 (Rate Limited).**", hi: true },
                        { c: "end", w: "" }
                    ]
                }
            },

            { trap: "Always return standard HTTP headers on every response: `X-RateLimit-Limit: 100`, `X-RateLimit-Remaining: 42`, and on a 429 response include `Retry-After: 18` (seconds). Clients that receive `Retry-After` back off gracefully instead of spamming retries." },

            { vocab: ["Rate Limiting", "Status Code", "Redis"] }
        ],
        k: [
            "Token Bucket allows controlled burstiness; Sliding Window Counter is the standard production algorithm balancing accuracy and memory.",
            "Implement distributed rate limiting in Redis using atomic Lua scripts to prevent concurrent race condition over-allocations.",
            "Always return `429 Too Many Requests` with a `Retry-After` header so well-behaved clients back off gracefully."
        ],
        r: ["Rate Limiting", "Reverse Proxy", "API Gateway"],
        drill: {
            lang: "python",
            reps: 3,
            items: [
                { c: "response.status_code = 429; response.headers['Retry-After'] = '30'", w: "standard rate limit exceeded response" },
                { c: "# Token bucket: tokens refill at steady rate, consumed per request", w: "token bucket algorithm definition" },
                { c: "redis.eval(sliding_window_lua_script, 1, key, now, 60000, 100)", w: "execute atomic Redis rate limit check" }
            ]
        }
    },

    {
        t: "Exponential Backoff, Jitter & Distributed Tracing",
        m: "resilience",
        lvl: "advanced",
        s: "Avoiding retry storms with Full Jitter, and tracking requests across microservice graphs with OpenTelemetry.",
        goal: [
            "Calculate Exponential Backoff with Full Jitter to eliminate Retry Storms",
            "Trace requests through distributed microservice architectures using W3C TraceContext headers",
            "Define SLOs, SLAs, SLIs, and Error Budgets for high-availability systems"
        ],
        b: [
            { p: "When a database recovers from a restart, if 10,000 clients retry immediately or at the same fixed 1-second interval, they slam the newly rebooted database with an instant 10,000-QPS surge, crashing it again immediately (**Retry Storm**). Full Jitter is the mathematical cure." },

            { h: "The Full Jitter Algorithm" },
            {
                code: {
                    lang: "python", t: "Exponential Backoff with Full Jitter (AWS Standard)",
                    lines: [
                        { c: "import time, random", w: "" },
                        { c: "", w: "" },
                        { c: "def retry_with_full_jitter(fn, max_attempts=5, base_delay=0.5, max_delay=30.0):", w: "" },
                        { c: "    for attempt in range(max_attempts):", w: "" },
                        { c: "        try:", w: "" },
                        { c: "            return fn()", w: "Execute operation." },
                        { c: "        except TransientError as e:", w: "" },
                        { c: "            if attempt == max_attempts - 1: raise", w: "Rethrow on last attempt." },
                        { c: "            # Exponential backoff ceiling: base * 2^attempt", w: "" },
                        { c: "            temp = min(max_delay, base_delay * (2 ** attempt))", w: "Double delay each attempt." },
                        { c: "            # Full Jitter: Uniform random between 0 and temp", w: "" },
                        { c: "            sleep_time = random.uniform(0, temp)", w: "**Spreads out retry collisions completely.**", hi: true },
                        { c: "            time.sleep(sleep_time)", w: "" }
                    ]
                }
            },

            { h: "Distributed Tracing: OpenTelemetry & Trace IDs" },
            { p: "In a system of 30 microservices, a single user click triggers a directed acyclic graph (DAG) of RPCs across 12 servers. To debug a slow request, every service must propagate standard W3C TraceContext headers: **`traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01`** (Version - TraceID - ParentSpanID - Flags)." },

            {
                tbl: {
                    t: "The Three Pillars of Observability",
                    h: ["Pillar", "What It Is", "Tooling", "Primary Question Answered"],
                    rows: [
                        ["**Metrics**", "Numeric aggregations over time (Counters, Gauges, Histograms)", "Prometheus, Grafana, Datadog", "*Are we healthy right now? What is our p99 latency?*"],
                        ["**Logs**", "Structured JSON records of discrete events", "Elasticsearch, Loki, CloudWatch", "*What specifically happened inside Service X at 14:02:15?*"],
                        ["**Distributed Tracing**", "End-to-end timing span graphs across microservice hops", "Jaeger, Zipkin, OpenTelemetry", "*Which specific microservice or database query caused this 8-second delay?*"]
                    ]
                }
            },

            { trap: "Do not confuse 99.9% uptime with 99.99% uptime. 99.9% ('three nines') permits **43 minutes of downtime per month**; 99.99% ('four nines') permits only **4.3 minutes of downtime per month**. Reaching four nines requires automated multi-region failover and zero-downtime deployment pipelines." },

            { vocab: ["Exponential Backoff", "Distributed System", "Observability", "Retry", "Error Handling"] }
        ],
        k: [
            "Exponential backoff with Full Jitter prevents retry storms by decorrelating client re-connection attempts.",
            "Distributed tracing propagates a global Trace ID across HTTP/gRPC headers to pinpoint cross-service bottlenecks.",
            "Distinguish SLA (contractual legal commitment) from SLO (internal engineering target) and SLI (measured live metric)."
        ],
        r: ["Exponential Backoff", "Observability", "Circuit Breaker", "Error Handling"],
        drill: {
            lang: "python",
            reps: 3,
            items: [
                { c: "sleep_time = random.uniform(0, min(max_delay, base * (2 ** attempt)))", w: "exponential backoff with full jitter formula" },
                { c: "traceparent: 00-{trace_id}-{span_id}-01", w: "W3C traceparent header format" },
                { c: "# SLO = Internal target (99.9%); SLA = Customer contract with financial penalties", w: "SLO vs SLA distinction" }
            ]
        }
    }

]);
