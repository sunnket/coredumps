/* System Design — Storage, Partitioning & Replication. */
TD.addLessons("systemdesign", [

    {
        t: "Database Sharding & Consistent Hashing",
        m: "data",
        lvl: "intermediate",
        s: "Horizontal partitioning strategies, avoiding hotspots, and consistent hashing with virtual nodes.",
        goal: [
            "Select the correct database sharding key to prevent hotspot partitions",
            "Implement a Consistent Hashing ring with virtual nodes in code",
            "Handle cross-shard queries and data re-sharding without downtime"
        ],
        b: [
            { p: "When a single relational or NoSQL database exceeds its disk capacity or maximum write IOPS, you must partition the data across multiple independent database servers. This is **Sharding (Horizontal Partitioning)**." },

            { h: "Sharding Strategies" },
            {
                tbl: {
                    t: "Database Sharding Approaches",
                    h: ["Strategy", "Mechanism", "Pros", "Cons / Failure Modes"],
                    rows: [
                        ["**Range-Based**", "Partition by value ranges (e.g. User IDs 1–1M on Shard A, 1M–2M on Shard B)", "Simple range queries", "**Severe hotspots** on sequential IDs or timestamps"],
                        ["**Hash-Based (Modulo)**", "`shard_id = hash(user_id) % N`", "Even distribution across N nodes", "**Catastrophic re-sharding**: Changing N moves 90%+ of keys"],
                        ["**Consistent Hashing**", "Keys and nodes map to a 0–2³² circular ring", "Adding/removing a node only moves `k/N` keys", "Requires virtual nodes to ensure balanced load"],
                        ["**Directory-Based**", "Lookup service maps `entity_id → shard_id`", "Total flexibility to move individual tenants", "Lookup service becomes a SPOF and latency bottleneck"]
                    ]
                }
            },

            { dg: "sys-consistent-hashing" },

            { h: "The Celebrity / Hotspot Problem" },
            { p: "If you shard Twitter/X tweets by `user_id`, a user with 50 followers generates negligible write/read volume. But an account with 100M followers will overwhelm its assigned shard with millions of reads per second. Solutions: **hybrid sharding** (read-heavy celebrity posts replicated across all shards) or **caching in Redis at the application layer**." },

            {
                code: {
                    lang: "python", t: "Consistent Hashing Ring Implementation with Virtual Nodes",
                    lines: [
                        { c: "import hashlib", w: "" },
                        { c: "import bisect", w: "" },
                        { c: "", w: "" },
                        { c: "class ConsistentHashRing:", w: "" },
                        { c: "    def __init__(self, vnodes=100):", w: "**100 virtual nodes per physical server.**" },
                        { c: "        self.vnodes = vnodes", w: "" },
                        { c: "        self.ring = []        # sorted list of hash values", w: "" },
                        { c: "        self.node_map = {}    # hash -> physical server", w: "" },
                        { c: "", w: "" },
                        { c: "    def _hash(self, key):", w: "" },
                        { c: "        return int(hashlib.md5(key.encode()).hexdigest(), 16)", w: "MD5 gives 128-bit integer space." },
                        { c: "", w: "" },
                        { c: "    def add_node(self, node):", w: "" },
                        { c: "        for i in range(self.vnodes):", w: "" },
                        { c: "            h = self._hash(f'{node}-vnode-{i}')", w: "**Distribute vnodes evenly on ring.**", hi: true },
                        { c: "            bisect.insort(self.ring, h)", w: "Keep sorted for binary search." },
                        { c: "            self.node_map[h] = node", w: "" },
                        { c: "", w: "" },
                        { c: "    def get_node(self, key):", w: "" },
                        { c: "        if not self.ring: return None", w: "" },
                        { c: "        h = self._hash(key)", w: "" },
                        { c: "        idx = bisect.bisect_right(self.ring, h) % len(self.ring)", w: "**Find next clockwise node in O(log V).**", hi: true },
                        { c: "        return self.node_map[self.ring[idx]]", w: "" }
                    ]
                }
            },

            { trap: "Avoid sharding on auto-incrementing timestamps. If you shard by `created_at`, 100% of current write traffic hits the single shard holding today's date, while older shards sit completely idle. Shard on a hashed entity ID instead." },

            { vocab: ["Sharding", "Partitioning"] }
        ],
        k: [
            "Hash modulo sharding breaks when scaling node counts; Consistent Hashing with virtual nodes ensures minimal key relocation.",
            "Choose shard keys with high cardinality and uniform query access to avoid celebrity hotspot partitions.",
            "Cross-shard joins are prohibitively expensive — denormalise data or execute parallel scatter-gather queries with application-level merging."
        ],
        r: ["Sharding", "Relational Database", "NoSQL", "Distributed System"],
        drill: {
            lang: "python",
            reps: 3,
            items: [
                { c: "idx = bisect.bisect_right(ring, hash(key)) % len(ring)", w: "consistent hashing clockwise lookup" },
                { c: "# Shard by hash(user_id) — NEVER by sequential created_at timestamp", w: "avoid timestamp write hotspot" },
                { c: "vnodes: 100-250 virtual positions per physical server", w: "virtual node count rule of thumb" }
            ]
        }
    },

    {
        t: "Replication Topologies & The Split-Brain Problem",
        m: "data",
        lvl: "intermediate",
        s: "Leader-follower, multi-leader, leaderless quorum systems, replication lag, and split-brain mitigation.",
        goal: [
            "Compare single-leader, multi-leader and leaderless replication architectures",
            "Calculate Quorum consistency ($R + W > N$) for leaderless systems",
            "Mitigate split-brain and replication lag in production"
        ],
        b: [
            { p: "Replication keeps identical copies of data across multiple physical machines to ensure high availability (if one node catches fire) and scale read throughput. How writes propagate across these replicas defines your consistency guarantees." },

            { h: "The Three Replication Topologies" },
            {
                tbl: {
                    t: "Replication Topologies Comparison",
                    h: ["Topology", "Write Path", "Read Path", "Best For", "Key Challenge"],
                    rows: [
                        ["**Single-Leader (Primary-Replica)**", "Writes go ONLY to Leader; Leader streams replication log", "Reads distributed across multiple read replicas", "Read-heavy web apps (95%+ reads)", "Replication lag on replicas; failover downtime if leader dies"],
                        ["**Multi-Leader (Active-Active)**", "Writes accepted by any regional leader", "Reads served locally in each region", "Multi-datacenter global apps", "**Write conflicts**: User edits profile simultaneously in US and EU"],
                        ["**Leaderless (Dynamo / Cassandra)**", "Client writes to $W$ nodes in parallel; reads from $R$ nodes", "Client takes majority vote; repairs stale replicas", "Write-intensive workloads (IoT, telemetry)", "Eventual consistency only; no native transactions"]
                    ]
                }
            },

            { h: "Leaderless Quorum Math ($R + W > N$)" },
            { p: "In a cluster with $N$ total replicas for a key: if you require $W$ nodes to acknowledge a write before success, and read from $R$ nodes taking the newest timestamp: whenever **$W + R > N$**, the read set and write set must overlap by at least one node, guaranteeing you read the latest write." },

            {
                code: {
                    lang: "python", t: "Configuring Cassandra / DynamoDB Quorum",
                    lines: [
                        { c: "# Given: Replication Factor N = 3", w: "" },
                        { c: "# Strong Quorum: W = 2, R = 2  -->  W + R = 4 > 3", w: "**Guarantees strong consistency.**", hi: true },
                        { c: "# Fast Writes:   W = 1, R = 3  -->  W + R = 4 > 3", w: "Fast write, slow read." },
                        { c: "# Fast Reads:    W = 3, R = 1  -->  W + R = 4 > 3", w: "Slow write, instant read." },
                        { c: "# Weak / Async:  W = 1, R = 1  -->  W + R = 2 < 3", w: "**Eventual consistency only — risk of stale reads.**", hi: true }
                    ]
                }
            },

            { h: "The Split-Brain Problem & Fencing Tokens" },
            { p: "If a network partition isolates Leader A from the rest of the cluster, the remaining nodes elect Leader B. If Leader A is still alive and accepting writes from isolated clients, you have two leaders mutating the database independently (**Split-Brain**). Mitigation: **Quorum-based leader election** (Raft/Paxos requiring $N/2 + 1$ votes) and **Fencing Tokens** (monotonically increasing version numbers that reject stale leaders)." },

            { trap: "Replication Lag can cause users to submit a form, immediately refresh the page, and see their changes missing (read hitting an async replica that is 500ms behind). Fix: enforce **Read-Your-Own-Writes** consistency by routing reads for recently updated data to the Primary for 5 seconds." },

            { vocab: ["Replication", "Eventual Consistency", "Consensus", "Leader Election"] }
        ],
        k: [
            "Single-leader is the industry standard for transactional apps; leaderless is ideal for high-throughput append-only data.",
            "Leaderless systems achieve strong consistency when $W + R > N$, overlapping write and read sets.",
            "Prevent split-brain using odd-numbered quorum clusters (3 or 5 nodes) and monotonic fencing tokens."
        ],
        r: ["Replication", "Eventual Consistency", "Consensus", "CAP Theorem", "Database Migration"],
        drill: {
            lang: "python",
            reps: 3,
            items: [
                { c: "is_strong_consistency = (write_quorum + read_quorum) > replication_factor", w: "quorum consistency check" },
                { c: "read_your_writes = route_to_primary if (now - last_write < 5.0) else read_replica", w: "read-your-own-writes routing" },
                { c: "quorum_majority = (total_nodes // 2) + 1", w: "minimum votes needed for leader election" }
            ]
        }
    },

    {
        t: "The CAP Theorem & PACELC in Real Distributed Systems",
        m: "data",
        lvl: "intermediate",
        s: "Consistency vs Availability during network partitions, PACELC latency trade-offs, and choosing your database.",
        goal: [
            "Apply the CAP Theorem accurately (understanding why P is non-negotiable)",
            "Use the PACELC theorem to explain latency vs consistency during normal operations",
            "Classify real-world databases (Postgres, Cassandra, DynamoDB, MongoDB, Spanner)"
        ],
        b: [
            { p: "In any network connecting independent servers, network packets will eventually be delayed, dropped, or cut entirely. This is a **Network Partition ($P$)**. The **CAP Theorem** states that when a partition occurs, a distributed system must choose between **Consistency ($C$)** (returning errors or waiting) or **Availability ($A$)** (returning stale data)." },

            { h: "Why You Cannot 'Choose CA'" },
            { p: "Networks are physical cables and routers. Partitions are physical reality, not a configuration option. Therefore, you cannot choose 'CA without P'. Your only choice is: **when a partition occurs, do you choose CP or AP?**" },

            {
                tbl: {
                    t: "CAP Classification of Modern Databases",
                    h: ["System Type", "During Network Partition ($P$)", "Examples", "Business Fit"],
                    rows: [
                        ["**CP (Consistency + Partition Tolerance)**", "Refuses or blocks writes if consensus cannot be reached. Data is always 100% correct, but some nodes return 5xx errors during an outage.", "Google Spanner, CockroachDB, HBase, Redis Cluster, ZooKeeper, etcd", "Financial balances, payment processing, inventory reservation, auth tokens"],
                        ["**AP (Availability + Partition Tolerance)**", "Every node accepts reads and writes even when partitioned. Nodes return potentially stale data and reconcile conflicts later.", "Apache Cassandra, Amazon DynamoDB, Couchbase, Riak", "Social media feeds, product reviews, analytics counters, live chat history"]
                    ]
                }
            },

            { h: "PACELC: What Happens When There is NO Partition?" },
            { p: "Partitions are rare (0.01% of the time). What happens during the 99.99% of normal operations? **PACELC** extends CAP: **If Partition ($P$)**: choose between Availability ($A$) and Consistency ($C$); **Else ($E$)**: choose between Latency ($L$) and Consistency ($C$)." },

            {
                tbl: {
                    t: "PACELC Classifications",
                    h: ["PACELC Category", "Partition Behavior", "Normal Behavior", "Examples"],
                    rows: [
                        ["**PC / EC**", "Yields Availability for Consistency", "Yields Latency for Consistency (Sync commits)", "Spanner, CockroachDB, RDBMS sync clusters"],
                        ["**PA / EL**", "Yields Consistency for Availability", "Yields Consistency for Latency (Async writes)", "Cassandra, DynamoDB (eventual), CouchDB"],
                        ["**PC / EL**", "Yields Availability during partition", "Fast local reads with async replication normally", "MongoDB (single primary), MySQL async replication"]
                    ]
                }
            },

            { trap: "Do not assume 'eventual consistency' means 'data will be consistent in 10 milliseconds'. Under heavy network congestion or node recovery, eventual consistency can lag by minutes or hours, leading to user-visible anomalies if not monitored." },

            { vocab: ["CAP Theorem", "Eventual Consistency", "ACID", "BASE", "Distributed System"] }
        ],
        k: [
            "Network partitions are inevitable physical events — you choose CP (correctness over uptime) or AP (uptime over correctness).",
            "PACELC describes normal day-to-day trade-offs: low latency (async replication) vs strict consistency (sync cross-datacenter round trips).",
            "Use CP stores for financial ledgers and inventory; use AP stores for metrics, feeds, and comments."
        ],
        r: ["CAP Theorem", "Eventual Consistency", "ACID", "BASE", "Distributed System"],
        drill: {
            lang: "python",
            reps: 3,
            items: [
                { c: "# CAP: When network partition happens -> Choose CP (strict truth) or AP (always return answer)", w: "CAP theorem core rule" },
                { c: "# PACELC: If Partition (A or C) Else (Latency or Consistency)", w: "PACELC formula breakdown" },
                { c: "banking_db = 'CP'  # Financial ledgers MUST reject writes rather than corrupt data", w: "database selection for financial ledger" }
            ]
        }
    }

]);
