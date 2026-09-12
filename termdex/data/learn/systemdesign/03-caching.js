/* System Design — Distributed Caching & Invalidation. */
TD.addLessons("systemdesign", [

    {
        t: "Caching Topologies — Cache-Aside, Write-Through & Write-Behind",
        m: "caching",
        lvl: "intermediate",
        s: "Where caches live in the stack, read/write patterns, and cache invalidation strategies.",
        goal: [
            "Select the correct caching pattern (Cache-Aside vs Write-Through vs Write-Behind)",
            "Implement a robust Cache-Aside pattern in code with fallback logic",
            "Solve the cache invalidation problem without stale data bugs"
        ],
        b: [
            { p: "Reading from RAM takes ~100 nanoseconds; reading from an SSD takes ~100 microseconds; querying a relational database across a network takes 5–50 milliseconds. Caching stores the results of expensive queries in fast in-memory stores like **Redis** or **Memcached** to eliminate database load." },

            { dg: "sys-caching-patterns" },

            { h: "The Three Core Caching Patterns" },
            {
                tbl: {
                    t: "Caching Patterns Comparison",
                    h: ["Pattern", "Write Operation", "Read Operation", "Pros", "Cons / Risk"],
                    rows: [
                        ["**Cache-Aside (Lazy Loading)**", "App writes directly to DB; invalidates (deletes) cache entry", "App checks Cache; on miss, reads DB and populates Cache", "Only requested data is cached; cache failures don't stop writes", "Initial read penalty on cold miss; potential brief inconsistency"],
                        ["**Write-Through**", "App writes to Cache; Cache synchronously writes to DB before returning", "App reads from Cache (always populated)", "Cache is always 100% consistent with database", "Higher write latency (must write to both layers before returning)"],
                        ["**Write-Behind (Write-Back)**", "App writes to Cache immediately; Cache asynchronously flushes batch to DB", "App reads from Cache", "Blazing fast write throughput; absorbs massive write spikes", "**High risk of data loss** if Cache node crashes before flushing to DB"]
                    ]
                }
            },

            {
                code: {
                    lang: "python", t: "Production Cache-Aside Implementation with Redis",
                    lines: [
                        { c: "import json", w: "" },
                        { c: "import redis", w: "" },
                        { c: "", w: "" },
                        { c: "r = redis.Redis(host='localhost', port=6379, db=0)", w: "" },
                        { c: "", w: "" },
                        { c: "def get_user_profile(user_id):", w: "" },
                        { c: "    cache_key = f'user:{user_id}'", w: "" },
                        { c: "    # 1. Check in-memory cache first", w: "" },
                        { c: "    cached = r.get(cache_key)", w: "" },
                        { c: "    if cached:", w: "" },
                        { c: "        return json.loads(cached)  # Cache HIT (~1ms)", w: "**Instant return.**", hi: true },
                        { c: "", w: "" },
                        { c: "    # 2. Cache MISS: Query primary database", w: "" },
                        { c: "    profile = db.query('SELECT * FROM users WHERE id = %s', user_id)", w: "Database read." },
                        { c: "    if profile:", w: "" },
                        { c: "        # 3. Populate cache with TTL (Time To Live = 1 hour)", w: "" },
                        { c: "        r.setex(cache_key, 3600, json.dumps(profile))", w: "**Always set an explicit TTL.**", hi: true },
                        { c: "    return profile", w: "" },
                        { c: "", w: "" },
                        { c: "def update_user_profile(user_id, data):", w: "" },
                        { c: "    db.execute('UPDATE users SET name = %s WHERE id = %s', (data['name'], user_id))", w: "Write to DB first." },
                        { c: "    # Invalidate (delete) cache — NEVER update in place", w: "" },
                        { c: "    r.delete(f'user:{user_id}')", w: "**Invalidating prevents concurrent write race conditions.**", hi: true }
                    ]
                }
            },

            { trap: "When updating data in Cache-Aside, DELETE the cache key rather than updating it with the new value. If two concurrent requests update the DB simultaneously, writing to cache directly can cause the slower request to overwrite the cache with older stale data." },

            { vocab: ["Caching", "Cache Invalidation", "Redis", "Latency", "Throughput"] }
        ],
        k: [
            "Cache-Aside is the default pattern for read-heavy systems; invalidate (delete) keys on mutation rather than updating them.",
            "Write-Through ensures strict consistency at the expense of write latency; Write-Behind maximises write throughput with data loss risk.",
            "Every cached key MUST have an explicit TTL to prevent zombie stale data lingering forever."
        ],
        r: ["Caching", "Cache Invalidation", "Redis", "Database Migration"],
        drill: {
            lang: "python",
            reps: 3,
            items: [
                { c: "r.setex(key, ttl_seconds, json_payload)", w: "set cache key with expiration TTL" },
                { c: "db.update(record); r.delete(cache_key)", w: "proper cache-aside invalidation pattern" },
                { c: "# Delete cache on write — NEVER update in place due to race conditions", w: "concurrency invalidation rule" }
            ]
        }
    },

    {
        t: "Eviction Policies & Memory Sizing (LRU, LFU, ARC & TTL)",
        m: "caching",
        lvl: "intermediate",
        s: "Managing bounded cache memory: eviction algorithms, Pareto 80/20 sizing, and O(1) LRU implementations.",
        goal: [
            "Compare LRU, LFU, FIFO and ARC cache eviction algorithms",
            "Size cache memory requirements accurately using the 80/20 rule",
            "Implement an O(1) LRU Cache using a hash map and doubly linked list"
        ],
        b: [
            { p: "RAM is expensive. You cannot cache your entire 50TB database in memory. When the cache fills its RAM limit (e.g. 64GB), it must evict older items according to a defined **Eviction Policy**." },

            { h: "Cache Eviction Algorithms" },
            {
                tbl: {
                    t: "Cache Eviction Policies Comparison",
                    h: ["Policy", "Eviction Criteria", "Ideal Workload", "Weakness"],
                    rows: [
                        ["**LRU (Least Recently Used)**", "Discards the item not accessed for the longest time", "Standard web traffic with temporal locality", "Vulnerable to sudden one-time batch scans wiping out popular keys"],
                        ["**LFU (Least Frequently Used)**", "Discards the item with the lowest historical access count", "Items with persistent long-term popularity", "Past popular items that are no longer accessed occupy memory forever without count decay"],
                        ["**ARC (Adaptive Replacement Cache)**", "Dynamically balances between recency (LRU) and frequency (LFU)", "Mixed, unpredictable enterprise workloads", "Patented (IBM), slightly higher compute overhead"],
                        ["**FIFO (First In, First Out)**", "Discards the oldest item inserted", "Simple queues, streaming data", "Often evicts highly active hot keys"]
                    ]
                }
            },

            { h: "Cache Sizing: The 80/20 Pareto Principle" },
            { p: "In most consumer applications, **20% of items generate 80% of traffic** (top videos, trending tweets, active products). If your daily read volume is 100M queries across 10TB of content, caching the top 20% active dataset (~2TB) delivers an 80%+ cache hit ratio. Add 20–30% overhead for Redis metadata." },

            {
                code: {
                    lang: "python", t: "O(1) LRU Cache Implementation in Python",
                    lines: [
                        { c: "from collections import OrderedDict", w: "" },
                        { c: "", w: "" },
                        { c: "class LRUCache:", w: "" },
                        { c: "    def __init__(self, capacity: int):", w: "" },
                        { c: "        self.cache = OrderedDict()", w: "**Hash map + Doubly Linked List under the hood.**" },
                        { c: "        self.cap = capacity", w: "" },
                        { c: "", w: "" },
                        { c: "    def get(self, key: str):", w: "" },
                        { c: "        if key not in self.cache:", w: "" },
                        { c: "            return None", w: "" },
                        { c: "        self.cache.move_to_end(key)  # Mark as most recently used", w: "**O(1) pointer update.**", hi: true },
                        { c: "        return self.cache[key]", w: "" },
                        { c: "", w: "" },
                        { c: "    def put(self, key: str, value: any):", w: "" },
                        { c: "        if key in self.cache:", w: "" },
                        { c: "            self.cache.move_to_end(key)", w: "" },
                        { c: "        self.cache[key] = value", w: "" },
                        { c: "        if len(self.cache) > self.cap:", w: "" },
                        { c: "            self.cache.popitem(last=False)  # Evict least recently used", w: "**O(1) head eviction.**", hi: true }
                    ]
                }
            },

            { trap: "Setting identical TTLs on 100,000 keys loaded at midnight causes all 100,000 keys to expire at the exact same second 1 hour later, triggering an instant database crash (**Synchronized Expiration**). Always add random jitter: `TTL = base_ttl + random.randint(0, 300)`." },

            { vocab: ["Caching", "Time Complexity", "Space Complexity", "Hash Table"] }
        ],
        k: [
            "LRU is the industry standard eviction policy for general web workloads; LFU is superior for stable long-term popularity.",
            "Use the 80/20 Pareto rule to size in-memory cache capacity at ~20% of active working data.",
            "Always add random jitter to TTLs to prevent synchronized multi-key expiration spikes."
        ],
        r: ["Caching", "Cache Invalidation", "Redis", "Data Structure"],
        drill: {
            lang: "python",
            reps: 3,
            items: [
                { c: "ttl = base_seconds + random.randint(0, 300)", w: "add random jitter to cache key expiration" },
                { c: "cache.move_to_end(key)  # O(1) mark recently used", w: "LRU touch operation" },
                { c: "cache.popitem(last=False) # O(1) evict least recently used", w: "LRU eviction operation" }
            ]
        }
    },

    {
        t: "Cache Failure Modes — Stampedes, Penetration & Distributed Locking",
        m: "caching",
        lvl: "advanced",
        s: "Mitigating Cache Stampedes (Thundering Herd), Cache Penetration, and implementing Redis Redlock.",
        goal: [
            "Prevent Cache Stampedes using mutex locking and early probabilistic expiration",
            "Eliminate Cache Penetration using Bloom Filters and Null Caching",
            "Implement distributed mutual exclusion using Redis `SET NX PX` and Lua scripts"
        ],
        b: [
            { p: "In production, an in-memory cache failure is not just a performance drop — it can trigger a total system collapse as hundreds of thousands of concurrent requests bypass the cache and hammer the underlying database." },

            { h: "The Three Deadly Cache Failure Modes" },
            {
                tbl: {
                    t: "Cache Failure Modes & Solutions",
                    h: ["Failure Mode", "What Happens", "Root Cause", "Architectural Solution"],
                    rows: [
                        ["**Cache Stampede (Thundering Herd)**", "A highly popular key (e.g. World Cup score) expires. 50,000 requests miss simultaneously and all 50,000 query the DB at once, melting it.", "Key expiration under high concurrency", "**Mutex Locking**: Only 1 thread queries DB while others wait; or **XFetch probabilistic pre-computation**"],
                        ["**Cache Penetration**", "Malicious actor sends millions of requests for non-existent IDs (e.g. `user_id=-9999`). Every request misses cache and queries DB.", "Missing data is never stored in cache", "1. **Cache NULL values** with 60s TTL; 2. **Bloom Filter** at edge to reject non-existent keys instantly"],
                        ["**Cache Breakdown**", "A single hot key holding massive traffic expires or is evicted.", "Single hot spot key eviction", "Never set TTL on critical hot keys; update them via background cron worker"]
                    ]
                }
            },

            {
                code: {
                    lang: "python", t: "Distributed Lock with Redis (Mutex) to Prevent Stampede",
                    lines: [
                        { c: "import time, uuid", w: "" },
                        { c: "", w: "" },
                        { c: "def get_with_mutex(key, db_fetch_fn, ttl=3600):", w: "" },
                        { c: "    val = r.get(key)", w: "Check cache." },
                        { c: "    if val: return json.loads(val)", w: "" },
                        { c: "", w: "" },
                        { c: "    lock_key = f'lock:{key}'", w: "" },
                        { c: "    token = str(uuid.uuid4())", w: "Unique owner token." },
                        { c: "    # Acquire lock: SET NX (only if not exists), PX (auto-expire in 5000ms)", w: "" },
                        { c: "    acquired = r.set(lock_key, token, nx=True, px=5000)", w: "**Only 1 concurrent caller wins.**", hi: true },
                        { c: "", w: "" },
                        { c: "    if acquired:", w: "" },
                        { c: "        try:", w: "" },
                        { c: "            data = db_fetch_fn()  # Query DB once", w: "Single DB query." },
                        { c: "            r.setex(key, ttl, json.dumps(data))", w: "Repopulate cache." },
                        { c: "            return data", w: "" },
                        { c: "        finally:", w: "" },
                        { c: "            # Safe atomic unlock via Lua script (ensures token matches)", w: "" },
                        { c: "            LUA_UNLOCK = '''if redis.call('get', KEYS[1]) == ARGV[1] then", w: "" },
                        { c: "                              return redis.call('del', KEYS[1])", w: "" },
                        { c: "                            else return 0 end'''", w: "**Atomic release prevents releasing others' locks.**", hi: true },
                        { c: "            r.eval(LUA_UNLOCK, 1, lock_key, token)", w: "" },
                        { c: "    else:", w: "" },
                        { c: "        time.sleep(0.05)  # Wait 50ms and retry", w: "Other requests wait for winner." },
                        { c: "        return get_with_mutex(key, db_fetch_fn, ttl)", w: "" }
                    ]
                }
            },

            { trap: "Never release a Redis distributed lock by running a simple `r.delete(lock_key)`. If your DB query takes 6 seconds but your lock TTL was 5 seconds, the lock expired and was acquired by another process. Calling `delete` would delete the OTHER process's active lock! Always use a Lua script matching your unique token." },

            { vocab: ["Caching", "Redis", "Distributed System", "Race Condition", "Deadlock"] }
        ],
        k: [
            "Cache Stampedes occur when high-traffic keys expire; solve them using distributed mutex locks or probabilistic early refreshes.",
            "Cache Penetration is mitigated by placing a space-efficient Bloom Filter in front of the cache or caching NULL responses.",
            "Acquire distributed locks using `SET NX PX` with a unique token and release them atomically using a verified Lua script."
        ],
        r: ["Caching", "Redis", "Distributed System", "Race Condition"],
        drill: {
            lang: "python",
            reps: 3,
            items: [
                { c: "r.set(lock_key, unique_token, nx=True, px=5000)", w: "acquire distributed lock with expiration" },
                { c: "# Cache Penetration fix: Bloom filter or r.setex(key, 60, 'NULL')", w: "cache penetration mitigation" },
                { c: "r.eval(lua_atomic_unlock_script, 1, lock_key, token)", w: "atomic safe lock release" }
            ]
        }
    }

]);
