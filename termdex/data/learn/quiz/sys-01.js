/* SYSTEMDESIGN — 50+ Hardcore Question Bank (Staff/Principal Level). */

/* ===================================================================
   Module: foundations — (9 Hardcore Questions)
   =================================================================== */

TD.addMCQ("systemdesign", "foundations", [
  {
    "tag": "Capacity Estimation Math",
    "lvl": "advanced",
    "q": "An application has 50 Million Daily Active Users (DAU). Each user performs 20 write actions per day. What is the approximate average Write QPS (Queries Per Second)?",
    "o": [
      "~1,150 QPS",
      "~11,574 QPS",
      "~57,870 QPS",
      "~115,740 QPS"
    ],
    "a": 1,
    "x": "Total daily requests = $50,000,000 \\times 20 = 1,000,000,000$ requests/day. One day has 86,400 seconds. $\\frac{1,000,000,000}{86,400} \\approx$ **11,574 QPS**."
  },
  {
    "tag": "L4 vs L7 Load Balancing",
    "lvl": "advanced",
    "q": "Why would an engineer choose a Layer 7 (L7) load balancer over a Layer 4 (L4) load balancer?",
    "o": [
      "L7 operates with lower CPU overhead and higher packet forwarding throughput",
      "L7 can inspect HTTP paths and headers to route `/api/video` to a dedicated video service",
      "L7 does not terminate TCP connections, preserving raw socket state",
      "L7 eliminates the need for SSL certificates on the load balancer"
    ],
    "a": 1,
    "x": "Layer 7 (Application Layer) inspects HTTP request paths, headers, cookies, and payloads, enabling intelligent content-based routing."
  },
  {
    "tag": "Stateless Web Tier",
    "lvl": "advanced",
    "q": "What is the primary architectural requirement to enable frictionless horizontal autoscaling of an application tier?",
    "o": [
      "Configuring Sticky Sessions (Session Affinity) on the Layer 4 load balancer",
      "Storing user session tokens and in-memory caches directly in web server local RAM",
      "Externalising all user session state to a shared distributed store like Redis or using stateless JWTs",
      "Using vertical database partitioning on the local server SSD"
    ],
    "a": 2,
    "x": "Stateless web tiers decouple session state from local memory, allowing any instance to serve any request."
  },
  {
    "tag": "Edge CDN Caching",
    "lvl": "advanced",
    "q": "An API response header contains `Cache-Control: public, s-maxage=300, stale-while-revalidate=60`. What does `stale-while-revalidate=60` tell the CDN edge?",
    "o": [
      "The CDN must refuse to serve any response after 60 seconds",
      "If cached data is expired, the CDN may immediately return stale content while asynchronously fetching fresh data in the background for up to 60 seconds",
      "The client browser is instructed to clear its local cache after 60 seconds",
      "The upstream server must revalidate database indexes every 60 seconds"
    ],
    "a": 1,
    "x": "`stale-while-revalidate` enables instant responses from cache while refreshing content in the background."
  },
  {
    "tag": "Anycast DNS Routing",
    "lvl": "advanced",
    "q": "How does Anycast BGP routing route global user traffic to the nearest Cloudflare or AWS CloudFront CDN Point of Presence (PoP)?",
    "o": [
      "By assigning a unique IP address to every single server in the world",
      "Multiple geographically distributed data centres advertise the exact same IP address via Border Gateway Protocol (BGP); internet routers naturally route the user's packets along the shortest BGP Autonomous System (AS) path",
      "By querying the client's GPS coordinates via JavaScript",
      "By establishing persistent VPN tunnels to every client device"
    ],
    "a": 1,
    "x": "Anycast advertises the same IP globally. BGP routing naturally directs packets to the topologically closest edge data center."
  },
  {
    "tag": "L4 Maglev / Direct Server Return",
    "lvl": "advanced",
    "q": "How does Direct Server Return (DSR) in high-throughput Layer 4 load balancers (e.g. Google Maglev) eliminate load balancer bandwidth bottlenecks?",
    "o": [
      "L4 balancer compresses video streams",
      "The load balancer rewrites the destination MAC address for incoming packets to forward them to backend servers, and backend servers send large egress response packets directly back to the client IP bypassing the load balancer entirely",
      "Backend servers act as DNS resolvers",
      "L4 balancer terminates TCP"
    ],
    "a": 1,
    "x": "In DSR, only small incoming requests traverse the load balancer. Large response egress flows directly from application servers to clients, preventing balancer network saturation."
  },
  {
    "tag": "Envoy Thread-Per-Core Architecture",
    "lvl": "advanced",
    "q": "Why does Envoy Proxy use a Thread-Per-Core event-driven architecture with `SO_REUSEPORT` instead of a thread-pool-per-connection model?",
    "o": [
      "Thread pools cannot handle HTTP",
      "Each CPU core runs an independent, non-blocking `epoll` event loop with zero thread context switching or lock contention between cores, maximizing L1 CPU cache locality and request throughput",
      "Envoy compiles to WebAssembly",
      "Thread pools leak sockets"
    ],
    "a": 1,
    "x": "Thread-per-core assigns one event loop per physical core, eliminating cross-thread synchronization and mutex lock overhead."
  },
  {
    "tag": "API Gateway Rate Limiting Algorithms",
    "lvl": "advanced",
    "q": "What is the difference between Token Bucket and Leaky Bucket rate limiting algorithms?",
    "o": [
      "Token bucket only works on UDP",
      "Token Bucket allows short bursts of traffic up to maximum bucket capacity $B$ while maintaining average rate $r$; Leaky Bucket processes requests at a strictly constant smooth output rate regardless of incoming bursts",
      "Leaky bucket uses more memory",
      "Token bucket requires Redis Cluster"
    ],
    "a": 1,
    "x": "Token Bucket accommodates bursty client traffic by storing unused tokens. Leaky Bucket smooths traffic to a fixed constant output rate."
  },
  {
    "tag": "Reverse Proxy Stale-If-Error Caching",
    "lvl": "advanced",
    "q": "What is the behavior specified by `Cache-Control: max-age=600, stale-if-error=86400`?",
    "o": [
      "Returns 500 error after 10 minutes",
      "If the origin backend server crashes or returns a 5xx error, the reverse proxy may continue serving stale cached content to users for up to 24 hours (86,400s) rather than displaying an error page",
      "Caches errors on disk",
      "Deletes user cookies"
    ],
    "a": 1,
    "x": "`stale-if-error` provides high availability by serving expired cached responses during upstream server outages."
  }
]);

/* ===================================================================
   Module: data — (9 Hardcore Questions)
   =================================================================== */

TD.addMCQ("systemdesign", "data", [
  {
    "tag": "Consistent Hashing Ring Math",
    "lvl": "advanced",
    "q": "In a system using standard modulo sharding (`hash(key) % N`), what happens when you scale from $N=4$ nodes to $N=5$ nodes?",
    "o": [
      "Only 20% of keys are moved to new nodes",
      "Approximately 80%+ of all existing keys must be remapped to different nodes, causing severe cache/DB thrashing",
      "No keys are moved because modulo is deterministic",
      "The database automatically switches to range-based partitioning"
    ],
    "a": 1,
    "x": "Modulo sharding changes the denominator from $N$ to $N+1$, causing almost every key to hash to a different node ($>80\\%$ reshuffling). Consistent hashing minimizes movement to $k/N$."
  },
  {
    "tag": "Leaderless Quorum Math",
    "lvl": "advanced",
    "q": "In an Apache Cassandra cluster with Replication Factor $N = 5$, what configuration guarantees strong consistency ($R + W > N$) with optimal write performance?",
    "o": [
      "Write Quorum $W = 1$, Read Quorum $R = 1$",
      "Write Quorum $W = 2$, Read Quorum $R = 2$",
      "Write Quorum $W = 2$, Read Quorum $R = 4$",
      "Write Quorum $W = 3$, Read Quorum $R = 3$"
    ],
    "a": 2,
    "x": "$W + R > N \\implies 2 + 4 = 6 > 5$. Writes complete fast with 2 confirmations, while reads check 4 nodes to guarantee overlap with latest writes."
  },
  {
    "tag": "Vector Clocks & Causality",
    "lvl": "advanced",
    "q": "In a leaderless distributed database (Amazon Dynamo / Riak), why are physical server timestamps insufficient for conflict resolution, requiring Vector Clocks instead?",
    "o": [
      "Physical clocks cannot format ISO-8601 strings",
      "Physical clocks across different servers experience NTP clock drift; two concurrent writes may have misleading physical timestamps, causing Last-Write-Wins (LWW) to silently overwrite newer data without detecting causality conflicts",
      "Physical clocks consume 64 bytes of storage",
      "Vector Clocks eliminate the need for replication"
    ],
    "a": 1,
    "x": "NTP clock drift creates skew between nodes. Vector Clocks track causal precedence ($V_A < V_B$), reliably detecting concurrent conflicting writes for manual or sibling resolution."
  },
  {
    "tag": "CAP Theorem Reality",
    "lvl": "advanced",
    "q": "Why is it impossible for a distributed database spanning a real network to be strictly 'CA' (Consistent and Available without Partition Tolerance)?",
    "o": [
      "Because SQL databases do not support replication",
      "Because network cables, switches, and routers physically fail, making network partitions an unavoidable reality rather than an architectural choice",
      "Because CAP theorem applies only to single-node relational databases",
      "Because availability requires synchronous multi-region disk replication"
    ],
    "a": 1,
    "x": "Network partitions ($P$) are a physical inevitability of networked hardware. Systems must choose between CP (consistency over uptime during partitions) or AP (availability over immediate consistency)."
  },
  {
    "tag": "PACELC Theorem Definition",
    "lvl": "advanced",
    "q": "According to the PACELC theorem (Abadi), what does the 'ELC' component address beyond standard CAP theorem?",
    "o": [
      "Encryption, Logging, and Compression",
      "If there is **E**lse (no partition), how does the system trade off **L**atency versus **C**onsistency?",
      "Error rates, Latency, and Cost",
      "Elasticity, Load, and Concurrency"
    ],
    "a": 1,
    "x": "PACELC states: If Partition ($P$), choose Availability ($A$) or Consistency ($C$); **Else ($E$)**, choose **Latency ($L$)** or **Consistency ($C$)**."
  },
  {
    "tag": "Database Sharding Rebalancing Strategies",
    "lvl": "advanced",
    "q": "Why is Virtual Nodes (Vnodes) in Consistent Hashing necessary to avoid data hotspots?",
    "o": [
      "Vnodes encrypt keys",
      "A single physical node is mapped to dozens or hundreds of virtual positions across the ring, ensuring uniform hash distribution and preventing uneven token range allocations",
      "Vnodes eliminate disk I/O",
      "Vnodes replace primary keys"
    ],
    "a": 1,
    "x": "With few physical nodes, random token assignment creates uneven ring segments (hotspots). Virtual nodes distribute hundreds of points per server, averaging out variance."
  },
  {
    "tag": "Read-Your-Own-Writes Consistency",
    "lvl": "advanced",
    "q": "In a system with asynchronous read replicas, how can an application guarantee **Read-Your-Own-Writes (Monotonic Read)** consistency for a user who just updated their profile?",
    "o": [
      "Lock the entire database for 5 seconds",
      "Route read requests for the user's own profile strictly to the Primary database (or check replica replication LSN/timestamp) for a brief window (e.g. 5 seconds) after an update, while routing general reads to replicas",
      "Disable read replicas",
      "Store profiles in browser cookies"
    ],
    "a": 1,
    "x": "Routing the updating user's reads to the primary for a short period guarantees they see their committed changes immediately while other users read eventually consistent replicas."
  },
  {
    "tag": "RUM Conjecture in Database Engines",
    "lvl": "advanced",
    "q": "What does the RUM Conjecture state regarding distributed storage engine trade-offs?",
    "o": [
      "Read, Update, and Memory",
      "You can optimize at most two of the three access costs: **R**ead overhead, **U**pdate overhead, and **M**emory/space overhead simultaneously (e.g. B-Trees optimize reads at the expense of updates; LSM-Trees optimize updates at the expense of reads/space)",
      "Random, Unordered, and Multi-master",
      "Relational, Unstructured, and Monolithic"
    ],
    "a": 1,
    "x": "The RUM conjecture establishes fundamental trade-offs: reducing read amplification increases write amplification or space overhead."
  },
  {
    "tag": "Cassandra Tombstones Saturation",
    "lvl": "advanced",
    "q": "Why does performing mass deletions in Apache Cassandra cause subsequent read queries on that partition to experience latency spikes or crash with `TombstoneOverwhelmingException`?",
    "o": [
      "Deletes crash SSD firmware",
      "In Cassandra (LSM storage), a `DELETE` writes a **Tombstone marker**; reads must scan and filter through thousands of tombstone records in memory until garbage-collected by compaction after `gc_grace_seconds`",
      "Tombstones lock the cluster",
      "Deletes disable read cache"
    ],
    "a": 1,
    "x": "Cassandra does not delete data in-place; it appends tombstones. Queries scanning partitions with accumulated tombstones must read and discard them, degrading performance."
  }
]);

/* ===================================================================
   Module: caching — (7 Hardcore Questions)
   =================================================================== */

TD.addMCQ("systemdesign", "caching", [
  {
    "tag": "Cache-Aside Invalidation Race",
    "lvl": "advanced",
    "q": "When updating a record in a Cache-Aside architecture, why should the application DELETE (invalidate) the cache key rather than updating it with the new value?",
    "o": [
      "Redis does not support updating existing keys",
      "Deleting a key saves RAM compared to overwriting it",
      "Concurrent writes can race, causing a slower stale write to overwrite the cache with outdated data permanently",
      "Deleting the key automatically triggers a database rollback"
    ],
    "a": 2,
    "x": "If two concurrent writes execute out of order, updating the cache directly can cause the older write to overwrite the newer value in cache. Invalidation forces the next read to fetch the latest DB state."
  },
  {
    "tag": "Bloom Filter Optimal Hash Functions",
    "lvl": "advanced",
    "q": "In a Bloom Filter with $m$ bits allocated for $n$ inserted items, what is the mathematically optimal number of hash functions $k$ that minimizes the False Positive rate?",
    "o": [
      "$k = \\frac{m}{n} \\ln 2 \\approx 0.693 \\frac{m}{n}$",
      "$k = \\frac{n}{m} \\times 10$",
      "$k = m \\times n$",
      "$k = 1$"
    ],
    "a": 0,
    "x": "Differentiating the false positive formula $p \\approx (1 - e^{-kn/m})^k$ yields the exact minimum at $k = \\frac{m}{n} \\ln 2$."
  },
  {
    "tag": "Probabilistic Cache Refresh (XFetch)",
    "lvl": "advanced",
    "q": "How does the optimal XFetch algorithm (Vattani et al.) completely eliminate Cache Stampedes without using distributed locks?",
    "o": [
      "It doubles the cache RAM size dynamically",
      "A worker reading from cache early-refreshes the value asynchronously before actual expiration if $-\\beta \\cdot \\delta \\cdot \\ln(\\text{rand}()) > \\text{TTL} - \\text{now}$, where $\\delta$ is the computation delta time and $\\beta > 0$",
      "It deletes all cached keys at midnight",
      "It converts the cache to an LSM-tree"
    ],
    "a": 1,
    "x": "XFetch probabilistically triggers background cache refresh as the key approaches expiration, ensuring a worker wins the refresh lottery before expiration without zero-TTL stampedes."
  },
  {
    "tag": "Cache Stampede Mutex (Singleflight)",
    "lvl": "advanced",
    "q": "How does Go's `singleflight.Group` or Redis distributed mutex prevent a Cache Stampede on a hot key miss?",
    "o": [
      "Drops all concurrent requests",
      "Ensures that for a specific cache key miss, only **one single in-flight database query** is executed, while all other concurrent requests wait and share the exact same returned response",
      "Stores all data in RAM",
      "Retries failed requests 10 times"
    ],
    "a": 1,
    "x": "Singleflight coalesces concurrent duplicate calls into a single execution, suppressing thousands of duplicate DB queries on cache misses."
  },
  {
    "tag": "Redis Distributed Locks Failover Flaw",
    "lvl": "advanced",
    "q": "Why is acquiring a distributed lock using `SET key token NX PX 30000` on a primary Redis node unsafe under asynchronous master-replica failover?",
    "o": [
      "Redis keys expire immediately",
      "If the master acknowledges the lock to Client A and crashes before replicating the key to the replica, the replica is promoted and grants the exact same lock to Client B, violating mutual exclusion",
      "Redis cannot store strings longer than 10 bytes",
      "Sentinel deletes all locks"
    ],
    "a": 1,
    "x": "Asynchronous replication means the promoted replica may not contain the lock key, allowing a second client to acquire the lock concurrently."
  },
  {
    "tag": "Two-Tier Caching (L1 Local + L2 Distributed)",
    "lvl": "advanced",
    "q": "What is the primary operational hazard of using an in-memory L1 cache (e.g. Caffeine/Guava in JVM) alongside a shared L2 Redis cache?",
    "o": [
      "L1 cache cannot store objects",
      "Cache incoherency: when an update mutates L2 Redis, local L1 caches across hundreds of web nodes contain stale data unless an invalidation pub/sub bus (e.g. Redis Pub/Sub or Kafka) is used to broadcast evictions",
      "L1 cache is single-threaded",
      "JVM crashes on cache hit"
    ],
    "a": 1,
    "x": "Local in-process L1 caches do not know when another server updates the database. A pub/sub invalidation bus is required to evict local caches across instances."
  },
  {
    "tag": "Adaptive Replacement Cache (ARC)",
    "lvl": "advanced",
    "q": "Why is the Adaptive Replacement Cache (ARC, Megiddo & Modha) superior to traditional LRU or LFU in high-throughput databases?",
    "o": [
      "ARC requires zero memory",
      "ARC dynamically self-tunes between recency (LRU) and frequency (LFU) using two dual learning lists, preventing scan pollution (where a sequential query flushes the entire cache) while retaining frequently accessed items",
      "ARC is written in assembly",
      "ARC encrypts cached items"
    ],
    "a": 1,
    "x": "ARC tracks recent and frequent items in two separate lists and dynamically shifts partition boundaries between them based on eviction hits, providing optimal hit rates."
  }
]);

/* ===================================================================
   Module: async — (9 Hardcore Questions)
   =================================================================== */

TD.addMCQ("systemdesign", "async", [
  {
    "tag": "Kafka Cooperative Sticky Rebalancing",
    "lvl": "advanced",
    "q": "Why did Apache Kafka 2.4 introduce the **Cooperative Sticky Assignor** to replace the legacy Eager Rebalance protocol?",
    "o": [
      "Eager rebalancing did not support JSON payloads",
      "Under legacy Eager rebalancing, when a single consumer joined or left the group, **ALL consumers were forced to revoke ALL partition assignments simultaneously**, pausing all stream processing across the entire fleet ('Stop-the-World' pause); Cooperative Sticky revokes only the specific partitions that need to migrate",
      "Cooperative Sticky eliminates the need for partition leaders",
      "Eager rebalancing consumed 100% CPU on Kafka brokers"
    ],
    "a": 1,
    "x": "Cooperative Sticky Rebalance performs incremental migrations without revoking unassigned partitions, eliminating fleet-wide stop-the-world pauses."
  },
  {
    "tag": "Transactional Outbox & CDC",
    "lvl": "advanced",
    "q": "Why is the Transactional Outbox Pattern combined with Change Data Capture (Debezium) superior to publishing directly to Kafka from application code?",
    "o": [
      "Because Kafka cannot handle JSON payloads",
      "It eliminates the Dual-Write Problem where the DB transaction succeeds but the network call to Kafka fails (or vice versa), guaranteeing that every domain mutation is atomically recorded in the DB WAL log and published to Kafka with zero message loss",
      "It increases HTTP request latency for security auditing",
      "Because databases do not support foreign keys"
    ],
    "a": 1,
    "x": "Transactional Outbox writes events to an outbox table in the same ACID transaction as business mutations, and CDC streams them reliably to Kafka."
  },
  {
    "tag": "Kafka Partition Ordering Scope",
    "lvl": "advanced",
    "q": "In an Apache Kafka cluster, what is the exact scope of message ordering guarantees?",
    "o": [
      "Strict FIFO order is guaranteed globally across all topics and partitions",
      "Strict FIFO order is guaranteed **only within a single partition**; there is zero order guarantee across different partitions in the same topic",
      "Messages are ordered alphabetically by message key",
      "Order is guaranteed only if the cluster has 1 broker"
    ],
    "a": 1,
    "x": "Kafka maintains FIFO order strictly within a single partition. Events sharing the same partition key route to the same partition and are processed in order."
  },
  {
    "tag": "Kafka ISR (In-Sync Replicas) and acks=all",
    "lvl": "advanced",
    "q": "In Kafka, what does configuring `acks=all` (or `acks=-1`) combined with `min.insync.replicas=2` guarantee?",
    "o": [
      "Zero latency writes",
      "A write is acknowledged only after it has been committed to the partition leader AND replicated to at least 1 in-sync follower, ensuring zero data loss if the leader crashes immediately after",
      "All consumers receive the message synchronously",
      "Messages are compressed with zstd"
    ],
    "a": 1,
    "x": "`acks=all` combined with `min.insync.replicas=2` prevents message loss during sudden leader failover by ensuring at least one follower has copied the message."
  },
  {
    "tag": "RabbitMQ vs Kafka Architecture",
    "lvl": "advanced",
    "q": "What is the core architectural difference in message consumption models between RabbitMQ (AMQP) and Apache Kafka?",
    "o": [
      "RabbitMQ uses disks only; Kafka uses memory only",
      "RabbitMQ is a **smart broker / dumb consumer** system that tracks per-message delivery and deletes messages upon consumer ACK; Kafka is a **dumb broker / smart consumer** append-only distributed commit log where consumers manage their own read offsets",
      "RabbitMQ requires ZooKeeper",
      "Kafka is single-threaded"
    ],
    "a": 1,
    "x": "RabbitMQ brokers track individual message ACKs and delete consumed items. Kafka stores an immutable, partitioned append-only log where consumers track their own read offsets."
  },
  {
    "tag": "Dead Letter Queue (DLQ) Backoff",
    "lvl": "advanced",
    "q": "In event-driven architectures, why must failed message retries use Exponential Backoff with Jitter before routing to a Dead Letter Queue (DLQ)?",
    "o": [
      "To convert JSON to XML",
      "Immediate retries of poison pill messages (e.g. payload syntax errors or downstream outages) create high CPU retry storms and block partition processing; backoff with jitter spreads load and DLQ isolates unprocessable messages",
      "DLQs can only accept 1 message per second",
      "Kafka requires backoff for TLS"
    ],
    "a": 1,
    "x": "Retrying failing messages immediately thrashes consumer threads. Backoff with jitter prevents thundering herds, and DLQs unblock the stream by moving corrupt messages aside."
  },
  {
    "tag": "CQRS Read Model Projection",
    "lvl": "advanced",
    "q": "In Command Query Responsibility Segregation (CQRS), how does the Read Model synchronize with the Write Model?",
    "o": [
      "Direct synchronous database joins across both models",
      "The Write Model executes domain commands and publishes Domain Events to an asynchronous event bus; event handlers consume these events and project denormalized read-optimized views into a query database (e.g. Elasticsearch or Mongo)",
      "Read queries mutate the write database",
      "CQRS eliminates write databases"
    ],
    "a": 1,
    "x": "CQRS separates write mutations from read queries. The write database captures business logic, and events asynchronously update denormalized read stores."
  },
  {
    "tag": "WebSocket Connection Scaling via Redis Pub/Sub",
    "lvl": "advanced",
    "q": "How do large-scale real-time chat architectures (e.g. Slack/Discord) route direct messages between two users connected to different WebSocket gateway servers?",
    "o": [
      "Each gateway opens a direct TCP connection to every other gateway",
      "When a user connects, their gateway subscribes to their unique channel `user:<id>` on a distributed Redis Pub/Sub or Kafka cluster; incoming messages publish to `user:<id>`, which broadcasts directly to the target user's active gateway server",
      "All messages are stored in SQL before delivery",
      "WebSockets are replaced with long polling"
    ],
    "a": 1,
    "x": "A distributed Pub/Sub backplane allows stateless WebSocket gateway clusters to route real-time frames between clients connected to arbitrary servers."
  },
  {
    "tag": "Kafka Log Compaction Mechanics",
    "lvl": "advanced",
    "q": "How does Kafka Log Compaction (`cleanup.policy=compact`) preserve state for changelog topics?",
    "o": [
      "Compresses messages with zlib",
      "Kafka Log Cleaner periodically scans segments and retains **strictly the latest message payload for each message key**, discarding older superseded revisions of that key",
      "Deletes all messages older than 7 days",
      "Encrypts partition logs"
    ],
    "a": 1,
    "x": "Log compaction ensures that for key-value changelogs, Kafka retains the most recent state for every key indefinitely, enabling rapid in-memory table restoration."
  }
]);

/* ===================================================================
   Module: resilience — (9 Hardcore Questions)
   =================================================================== */

TD.addMCQ("systemdesign", "resilience", [
  {
    "tag": "Sliding Window Counter Math",
    "lvl": "advanced",
    "q": "In a Sliding Window Counter rate limiter with a 1-minute window allowing 100 requests: The previous 1-minute window had 80 requests. The current 1-minute window has 30 requests and is currently 30% through its duration ($t = 18\\text{s}$). What is the estimated request count at this exact millisecond?",
    "o": [
      "110 requests (Rate limited)",
      "86 requests (Allowed: $30 + 80 \\times (1 - 0.3) = 30 + 56 = 86$)",
      "30 requests",
      "50 requests"
    ],
    "a": 1,
    "x": "$\\text{Count} = 30 + 80 \\times (1 - 0.3) = 30 + 56 = 86$. Under limit $100 \\implies$ Allowed."
  },
  {
    "tag": "Geohash & Spatial Indexing",
    "lvl": "advanced",
    "q": "Why do ride-sharing dispatch systems (like Uber or Lyft) use Hierarchical Spatial Indexing (e.g. Google S2 Geometry / Uber H3 Hexagons / Geohash) instead of standard SQL `WHERE ST_Distance(driver_loc, rider_loc) < 5000`?",
    "o": [
      "SQL databases cannot store GPS coordinates",
      "`ST_Distance` computes expensive trigonometric spherical distance (Haversine formula) across millions of driver rows ($O(N)$ full table scan); spatial indexing discretizes Earth's surface into 1D integer cell IDs (e.g. Hilbert curve or Base32 prefixes), enabling $O(1)$ B-Tree range scans to find nearby drivers in adjacent cells",
      "Spatial indexes encrypt driver GPS locations for GDPR compliance",
      "Geohash reduces GPS precision to 10 kilometers strictly"
    ],
    "a": 1,
    "x": "Evaluating spherical trigonometry across millions of drivers saturates CPUs. Spatial indexes (Uber H3, S2) map 2D coordinates to 1D integer cell IDs for fast $O(1)$ neighboring cell lookups."
  },
  {
    "tag": "Cassandra Compaction Strategies",
    "lvl": "advanced",
    "q": "For a read-heavy relational-style table in Apache Cassandra where read latency is the primary bottleneck, why is **Leveled Compaction Strategy (LCS)** preferred over **Size-Tiered Compaction Strategy (STCS)**?",
    "o": [
      "LCS requires zero disk space",
      "In LCS, 90%+ of read queries are guaranteed to hit **at most 1 SSTable per read** because key ranges in higher levels ($L_1, L_2, \\dots$) do not overlap, eliminating multi-SSTable disk seeking",
      "LCS automatically compresses data using gzip",
      "STCS is deprecated in Cassandra 4.0"
    ],
    "a": 1,
    "x": "Leveled Compaction (LCS) guarantees non-overlapping key ranges within levels $L_1, L_2, \\dots$, ensuring ~90% of read operations seek strictly 1 SSTable on disk."
  },
  {
    "tag": "Circuit Breaker Half-Open State",
    "lvl": "advanced",
    "q": "In a resilience Circuit Breaker pattern (e.g. Resilience4j / Netflix Hystrix), what is the function of the **HALF-OPEN** state?",
    "o": [
      "Shuts down the server gracefully",
      "Allows a limited trial number of probe requests through to the failing downstream service after a timeout sleep window; if the trial requests succeed, the breaker resets to CLOSED; if they fail, it trips back to OPEN",
      "Logs errors to disk without executing code",
      "Doubles request timeout"
    ],
    "a": 1,
    "x": "Half-Open is a canary state that sends a small number of probe requests to check if the downstream service has recovered before fully reopening traffic."
  },
  {
    "tag": "Exponential Backoff with Full Jitter",
    "lvl": "advanced",
    "q": "According to AWS Architecture research (Marc Brooker), why is **Full Jitter** (`sleep = random_between(0, min(cap, base * 2^attempt))`) superior to Exponential Backoff without jitter?",
    "o": [
      "It guarantees all requests finish in 1 second",
      "Without jitter, all synchronized client retries fire simultaneously in discrete waves (Thundering Herd retry storm), re-crashing the struggling server; full jitter completely decorrelates retry bursts across continuous time",
      "Full jitter eliminates retries",
      "It uses less CPU memory"
    ],
    "a": 1,
    "x": "Without jitter, synchronized clients retry in periodic spikes, re-overwhelming recovering servers. Full jitter spreads retries uniformly across time."
  },
  {
    "tag": "Bulkhead Pattern Architecture",
    "lvl": "advanced",
    "q": "How does the Bulkhead Pattern prevent cascading outages in microservice architectures?",
    "o": [
      "Encrypts network traffic between services",
      "Isolates critical resource pools (e.g. separate thread pools, connection pools, and memory quotas) per downstream dependency, ensuring that a slow or failing service cannot exhaust all available threads and crash unrelated features",
      "Replaces microservices with monoliths",
      "Disables database transactions"
    ],
    "a": 1,
    "x": "Named after ship bulkheads: if one compartment floods, others stay dry. Isolating thread pools ensures that a slow dependency cannot exhaust the global thread pool."
  },
  {
    "tag": "Distributed Tracing Context Propagation",
    "lvl": "advanced",
    "q": "In OpenTelemetry distributed tracing, how is trace context passed across asynchronous HTTP and Kafka boundaries between microservices?",
    "o": [
      "Stored in a global Redis database",
      "Injected into standardized HTTP headers and message metadata (e.g. W3C `traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01`), carrying the 128-bit `trace_id` and 64-bit `parent_span_id` across network hops",
      "Encrypted in SSL certificates",
      "Tracked via client IP addresses"
    ],
    "a": 1,
    "x": "W3C `traceparent` headers propagate `trace_id` and `span_id` across network calls, allowing the collector to assemble the complete end-to-end trace timeline."
  },
  {
    "tag": "Snowflake 64-bit ID Generator Layout",
    "lvl": "advanced",
    "q": "What is the standard 64-bit bit layout of Twitter Snowflake distributed unique ID generators?",
    "o": [
      "64 bits of random UUID",
      "1 sign bit (0) + 41-bit millisecond timestamp (~69 years) + 10-bit machine/datacenter ID (1024 nodes) + 12-bit sequence counter (4096 IDs per ms per node)",
      "32-bit IP address + 32-bit timestamp",
      "64-bit MD5 hash"
    ],
    "a": 1,
    "x": "Snowflake IDs are 64-bit k-ordered integers composed of timestamp (41b), machine ID (10b), and sequence counter (12b), supporting 4.096M IDs/sec per node."
  },
  {
    "tag": "Adaptive Bitrate Video Chunking (HLS/DASH)",
    "lvl": "advanced",
    "q": "How does Adaptive Bitrate (ABR) streaming (HLS/DASH) handle varying client network bandwidth without video buffering stalls?",
    "o": [
      "Transcodes video on the client GPU",
      "Video is pre-transcoded into multiple bitrates (1080p, 720p, 360p) and sliced into short chunks (e.g. 2–6 seconds); client video players dynamically read the master `.m3u8` playlist and request higher or lower bitrate chunks based on instantaneous network throughput",
      "Transfers raw uncompressed frames",
      "Uses peer-to-peer torrents"
    ],
    "a": 1,
    "x": "ABR chunks media into short segments across resolutions. The client evaluates its download bitrate and requests segment files corresponding to the optimal resolution."
  }
]);

/* ===================================================================
   Module: consistency — (7 Hardcore Questions)
   =================================================================== */

TD.addMCQ("systemdesign", "consistency", [
  {
    "tag": "Raft Log Matching Invariant",
    "lvl": "advanced",
    "q": "In Raft consensus, if two server logs contain an entry with the same index and term, what does the Log Matching Property guarantee?",
    "o": [
      "Only that those two entries match",
      "The logs are identical in all entries up through that index across both servers",
      "Both servers are currently leaders",
      "The entry has been committed to disk on all nodes"
    ],
    "a": 1,
    "x": "Raft guarantees by induction that if two logs agree on index and term, they are completely identical in all preceding entries."
  },
  {
    "tag": "Two-Phase Commit (2PC) Blocking Flaw",
    "lvl": "advanced",
    "q": "What is the critical failure mode of Two-Phase Commit (2PC) in distributed transactions?",
    "o": [
      "2PC does not support SQL",
      "2PC is a blocking protocol: if the Coordinator crashes after participants vote 'YES' in Phase 1 (Prepare), participants must hold locks and block indefinitely until the coordinator recovers",
      "2PC requires all servers to be identical",
      "2PC cannot abort transactions"
    ],
    "a": 1,
    "x": "2PC blocks all participant nodes if the coordinator fails during the decision phase, holding row locks and freezing transaction throughput."
  },
  {
    "tag": "Saga Pattern Orchestration vs Choreography",
    "lvl": "advanced",
    "q": "In distributed microservices, how does the Saga Pattern handle transaction failures across multiple independent services without 2PC locks?",
    "o": [
      "Automatically rolls back database storage using snapshots",
      "Executes a sequence of local ACID transactions and, upon any failure, triggers a series of **Compensating Transactions** in reverse order to semantically undo previously committed changes",
      "Locks all database tables for the duration of the saga",
      "Retries failed steps infinitely"
    ],
    "a": 1,
    "x": "Sagas use compensating transactions (e.g. `refund_payment` to undo `charge_card`) to achieve eventual consistency across distributed services without distributed locks."
  },
  {
    "tag": "Split-Brain Prevention with Fencing Tokens",
    "lvl": "advanced",
    "q": "In primary-backup distributed systems, how do **Fencing Tokens** (e.g. ZooKeeper `zxid` or Raft term numbers) protect shared storage from a zombie former primary that paused for a long GC pause?",
    "o": [
      "Reboots the storage hardware",
      "The lock server issues a monotonically increasing integer token with every lock grant; shared storage rejects any write request carrying a token lower than the highest token it has already observed",
      "Encrypts the storage disk",
      "Forces all writes to be synchronous"
    ],
    "a": 1,
    "x": "A zombie master that wakes up from a GC pause attempts to write using an old token. The storage layer checks that the token is strictly less than the new primary's token and rejects the write."
  },
  {
    "tag": "Gossip Protocol (SWIM) Failure Detection",
    "lvl": "advanced",
    "q": "How does the SWIM (Structured Weakly-Consistent Infection-Style Process Group Membership) protocol achieve $O(1)$ failure detection overhead per node?",
    "o": [
      "Central heartbeat server",
      "Nodes periodically ping a randomly chosen member via UDP; if no response, it requests $k$ random peers to ping the target indirectly (`ping-req`), detecting failures in expected $O(1)$ time without broadcast storms",
      "Scans the entire cluster via TCP",
      "Uses DNS lookups"
    ],
    "a": 1,
    "x": "SWIM uses randomized peer probing and indirect `ping-req` to achieve $O(1)$ per-node message overhead and robust network partition detection."
  },
  {
    "tag": "Distributed File System HDFS Chunk Size",
    "lvl": "advanced",
    "q": "Why did Google File System (GFS) and Hadoop HDFS choose large block sizes (64MB / 128MB) instead of traditional OS 4KB disk blocks?",
    "o": [
      "Hard drives only support 64MB reads",
      "To minimize the metadata footprint stored in the Master/NameNode's RAM (since every block mapping consumes ~150 bytes of NameNode memory) and amortize TCP connection setup costs over large sequential analytics scans",
      "To eliminate replication",
      "Because HDFS only stores text"
    ],
    "a": 1,
    "x": "Large block sizes reduce the number of block metadata records the master node must keep in memory, enabling a single master to manage petabytes of data."
  },
  {
    "tag": "Base62 vs Base64 in URL Shorteners",
    "lvl": "advanced",
    "q": "Why do URL shortener systems (e.g. TinyURL) use **Base62 (`[0-9a-zA-Z]`)** rather than standard **Base64** encoding for short slugs?",
    "o": [
      "Base62 is faster to compute",
      "Base64 includes characters `+` and `/` (and padding `=`), which are reserved characters in URL query strings and URI path separators, requiring URL encoding (`%2B`, `%2F`); Base62 uses strictly alphanumeric characters safe for all URLs without escaping",
      "Base62 provides encryption",
      "Base64 is limited to 10 characters"
    ],
    "a": 1,
    "x": "Base64 contains `+` and `/`, which have special syntactic meaning in URLs. Base62 consists purely of alphanumeric characters `[a-z, A-Z, 0-9]`, making slugs directly copy-pasteable."
  }
]);

