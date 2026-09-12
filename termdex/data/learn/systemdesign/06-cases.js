/* System Design — End-to-End Whiteboard Case Studies. */
TD.addLessons("systemdesign", [

    {
        t: "Case Study: Designing a Scalable URL Shortener (TinyURL)",
        m: "resilience",
        lvl: "advanced",
        s: "End-to-end architecture: Base62 encoding, 301 vs 302 redirects, collision avoidance, and multi-tier caching.",
        goal: [
            "Calculate capacity requirements and storage math for a global URL shortening service",
            "Implement Base62 encoding from a 64-bit integer ID with zero collision risk",
            "Choose between 301 Permanent and 302 Temporary redirects based on analytics requirements"
        ],
        b: [
            { p: "Designing a URL Shortener (like TinyURL or bit.ly) is the quintessential system design interview question because it touches every foundational layer: character encoding, database schema, caching, collision mitigation, and high-read redirect optimization." },

            { h: "Step 1: Requirements & Capacity Estimation" },
            {
                tbl: {
                    t: "TinyURL Estimation Math",
                    h: ["Metric", "Calculation", "Target Capacity"],
                    rows: [
                        ["**Write Volume**", "100 Million new URLs created / month", "~38.5 writes / sec"],
                        ["**Read Volume**", "100:1 read-to-write ratio (10 Billion clicks / month)", "~3,850 reads / sec (Peak: ~10,000 QPS)"],
                        ["**URL Length**", "Base62 (`[0-9a-zA-Z]`), 7 characters long", "$62^7 = 3.52$ **Trillion unique URLs**"],
                        ["**5-Year Storage**", "100M URLs/mo * 12 * 5 yrs * 500 bytes/record", "**~3.0 Terabytes total** (fits easily on a small database cluster)"]
                    ]
                }
            },

            { h: "Step 2: Short Code Generation Approaches" },
            {
                tbl: {
                    t: "Base62 Encoding vs MD5 Hashing",
                    h: ["Approach", "Mechanism", "Pros", "Cons / Risk"],
                    rows: [
                        ["**1. Hash + Truncate**", "Take MD5(original_url), take first 7 characters", "Deterministic", "**Collisions inevitable**: Two different URLs produce same 7-character prefix. Requires DB query loop to re-hash on collision."],
                        ["**2. Auto-Increment ID → Base62**", "Generate unique 64-bit integer ID (e.g. 10,000,000) → Convert to Base62 (`15FTG`)", "**Zero collisions guaranteed**; 100% mathematical uniqueness", "Sequential IDs can be scraped by competitors unless obfuscated with Feistel cipher"],
                        ["**3. KGS (Key Generation Service)**", "Pre-generate millions of random 7-char strings into a standalone database table", "Fastest write path: app server grabs 1,000 pre-made tokens into memory", "Requires coordination to ensure two workers never grab the same key"]
                    ]
                }
            },

            {
                code: {
                    lang: "python", t: "Base62 Encoding Implementation in Python",
                    lines: [
                        { c: "CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'", w: "62 characters." },
                        { c: "", w: "" },
                        { c: "def encode_base62(num: int) -> str:", w: "" },
                        { c: "    if num == 0: return CHARS[0]", w: "" },
                        { c: "    result = []", w: "" },
                        { c: "    while num > 0:", w: "" },
                        { c: "        result.append(CHARS[num % 62])", w: "**Remainder gives character index.**", hi: true },
                        { c: "        num //= 62", w: "" },
                        { c: "    return ''.join(reversed(result))", w: "" },
                        { c: "", w: "" },
                        { c: "# Example: Integer ID 125,300,123 -> Base62 short code '8nmH3'", w: "" },
                        { c: "print(encode_base62(125300123))  # '8nmH3'", w: "**Produces compact 7-char strings.**", hi: true }
                    ]
                }
            },

            { h: "Step 3: 301 vs 302 HTTP Redirect" },
            { p: "**301 Moved Permanently**: The browser permanently caches the redirect. Subsequent clicks never hit your servers — extremely low backend load, but **you cannot track click analytics**. **302 Found (Temporary)**: Every click routes to your backend first — slightly higher server load, but **enables 100% accurate click analytics and geotracking**." },

            { trap: "Do not use a single SQL `AUTO_INCREMENT` column as your global ID generator if running multiple database primaries. Multiple write nodes will produce colliding IDs. Use a distributed ID generator (Twitter Snowflake) or a dedicated Redis counter cluster." },

            { vocab: ["Status Code", "Caching", "Sharding", "Reverse Proxy", "Relational Database"] }
        ],
        k: [
            "Base62 encoding with 7 characters ($62^7$) yields 3.5 Trillion unique short codes.",
            "Generate unique numeric IDs using Snowflake/KGS and encode to Base62 to achieve zero-collision uniqueness.",
            "Use HTTP 302 redirects when click tracking analytics are required, and HTTP 301 when minimizing server traffic is the priority."
        ],
        r: ["Status Code", "Caching", "Reverse Proxy", "Relational Database"],
        drill: {
            lang: "python",
            reps: 3,
            items: [
                { c: "short_code = encode_base62(unique_snowflake_id)", w: "convert unique integer ID to Base62 short code" },
                { c: "# HTTP 301 = cached by browser (no analytics); HTTP 302 = hits server (track clicks)", w: "301 vs 302 redirect trade-off" },
                { c: "redis.setex(f'url:{code}', 86400, long_url)", w: "cache short code mapping in Redis" }
            ]
        }
    },

    {
        t: "Case Study: Designing a Distributed Unique ID Generator (Twitter Snowflake)",
        m: "resilience",
        lvl: "advanced",
        s: "64-bit sortable IDs, avoiding UUIDv4 indexing fragmentation, and handling NTP clock skew.",
        goal: [
            "Explain why UUIDv4 random strings degrade database B-Tree index performance",
            "Design a 64-bit Twitter Snowflake ID layout (Timestamp, Worker ID, Sequence)",
            "Mitigate NTP clock drift and backwards clock movement in production"
        ],
        b: [
            { p: "In distributed databases, every record needs a globally unique Primary Key. Standard auto-incrementing integers only work on a single server, and random **UUIDv4 (128-bit strings)** cause massive B-Tree index fragmentation, high disk I/O, and cannot be sorted chronologically. The solution is **Twitter Snowflake**." },

            { h: "The Twitter Snowflake 64-bit Layout" },
            {
                tbl: {
                    t: "64-Bit Snowflake ID Bit Breakdown",
                    h: ["Bit Range", "Field Name", "Length", "Description / Capacity"],
                    rows: [
                        ["**Bit 63**", "Sign Bit", "1 bit", "Always set to `0` (ensures positive 64-bit signed integer)"],
                        ["**Bits 22–62**", "Timestamp", "41 bits", "Milliseconds since custom epoch ($2^{41} \\approx 69$ **years of lifespan**)"],
                        ["**Bits 12–21**", "Worker / Machine ID", "10 bits", "Identifies specific generator node ($2^{10} = 1,024$ **machines**)"],
                        ["**Bits 0–11**", "Sequence Number", "12 bits", "Increments for IDs generated within the same millisecond ($2^{12} = 4,096$ **IDs/ms/node**)"]
                    ]
                }
            },

            {
                code: {
                    lang: "python", t: "Complete Twitter Snowflake ID Generator in Python",
                    lines: [
                        { c: "import time", w: "" },
                        { c: "", w: "" },
                        { c: "class SnowflakeGenerator:", w: "" },
                        { c: "    def __init__(self, worker_id: int, custom_epoch: int = 1704067200000):", w: "Epoch: Jan 1, 2024." },
                        { c: "        self.worker_id = worker_id", w: "" },
                        { c: "        self.custom_epoch = custom_epoch", w: "" },
                        { c: "        self.sequence = 0", w: "" },
                        { c: "        self.last_timestamp = -1", w: "" },
                        { c: "", w: "" },
                        { c: "    def _current_time(self):", w: "" },
                        { c: "        return int(time.time() * 1000)  # Current time in ms", w: "" },
                        { c: "", w: "" },
                        { c: "    def next_id(self) -> int:", w: "" },
                        { c: "        now = self._current_time()", w: "" },
                        { c: "        if now < self.last_timestamp:", w: "" },
                        { c: "            raise ValueError('Clock moved backwards! Refusing generation.')", w: "**NTP Clock Skew Guard.**", hi: true },
                        { c: "", w: "" },
                        { c: "        if now == self.last_timestamp:", w: "" },
                        { c: "            self.sequence = (self.sequence + 1) & 0xFFF  # 12-bit mask (4095)", w: "" },
                        { c: "            if self.sequence == 0:", w: "" },
                        { c: "                # Sequence overflow in same millisecond -> wait for next ms", w: "" },
                        { c: "                while now <= self.last_timestamp: now = self._current_time()", w: "Spin until next ms." },
                        { c: "        else:", w: "" },
                        { c: "            self.sequence = 0", w: "" },
                        { c: "", w: "" },
                        { c: "        self.last_timestamp = now", w: "" },
                        { c: "        # Bitwise compose 64-bit integer", w: "" },
                        { c: "        id_val = ((now - self.custom_epoch) << 22) | (self.worker_id << 12) | self.sequence", w: "**Fast bit-shift composition.**", hi: true },
                        { c: "        return id_val", w: "" }
                    ]
                }
            },

            { trap: "NTP (Network Time Protocol) clock drift can cause server clocks to jump backwards by several milliseconds. A naive generator would generate duplicate IDs during that window. Always check `if now < last_timestamp` and raise an alert or wait until the clock catches up." },

            { vocab: ["Primary Key", "B-Tree", "Distributed System", "Index"] }
        ],
        k: [
            "Snowflake IDs are 64-bit integers ordered by timestamp, providing optimal B-Tree index insertion performance.",
            "Each generator node can produce 4,096,000 unique IDs per second without any network coordination or database locks.",
            "Defend against NTP clock skew by rejecting ID generation if system time moves backwards."
        ],
        r: ["Primary Key", "Index", "B-Tree", "Distributed System"],
        drill: {
            lang: "python",
            reps: 3,
            items: [
                { c: "snowflake_id = ((timestamp - epoch) << 22) | (worker_id << 12) | sequence", w: "64-bit snowflake bit-shift formula" },
                { c: "if now < last_timestamp: raise ClockSkewError()", w: "NTP clock backwards jump guard" },
                { c: "# 41 bits timestamp (69 yrs) + 10 bits machine (1024 nodes) + 12 bits seq (4096/ms)", w: "Snowflake bit allocation structure" }
            ]
        }
    },

    {
        t: "Case Study: Designing a Scalable Real-Time Chat & Notification System",
        m: "resilience",
        lvl: "advanced",
        s: "WebSockets at scale, connection managers, presence tracking with Redis, and offline push delivery.",
        goal: [
            "Architect bidirectional real-time communication using WebSocket connection managers",
            "Implement scalable online/offline user presence tracking using Redis heartbeats",
            "Store chat history in a wide-column store optimized for reverse-chronological pagination"
        ],
        b: [
            { p: "A real-time messaging platform (WhatsApp, Slack, Discord) must support 1-on-1 chats, group messaging, typing indicators, read receipts, and online presence tracking with sub-100ms latency across 50M concurrent connections." },

            { h: "Step 1: Network Protocol Selection" },
            {
                tbl: {
                    t: "Real-Time Protocols Comparison",
                    h: ["Protocol", "Communication Model", "Header Overhead", "Best Use Case"],
                    rows: [
                        ["**HTTP Polling**", "Client sends GET request every 2s", "Massive overhead (HTTP headers on every empty poll)", "Legacy systems only"],
                        ["**HTTP Long Polling**", "Server holds request open until a message arrives", "High reconnection overhead after every message", "Fallback when WebSockets blocked by firewall"],
                        ["**Server-Sent Events (SSE)**", "One-way stream (Server → Client)", "Low overhead over standard HTTP/2", "Stock tickers, AI streaming completions"],
                        ["**WebSockets (WS)**", "**Full-duplex bidirectional persistent TCP**", "**2–6 bytes frame overhead** per message", "**Chat apps, multiplayer games, real-time collaboration**"]
                    ]
                }
            },

            { h: "Step 2: Connection Management & Message Routing" },
            { p: "When User A sends a message to User B: User A is connected via WebSocket to **Chat Server 1**; User B is connected to **Chat Server 5**. How does Server 1 find Server 5? A distributed **Message Broker (Redis Pub/Sub or Kafka)** acts as the communication bus. When User B connects, Server 5 subscribes to Redis channel `user:user_b`. Server 1 publishes to `user:user_b`, and Redis routes the packet directly to Server 5." },

            { h: "Step 3: Online Presence Tracking" },
            { p: "Clients send a small heartbeat ping every 30 seconds (`POST /heartbeat`). The server writes to Redis: `SET presence:user_123 1 EX 60`. If User B loses WiFi, no heartbeat arrives; after 60 seconds the Redis key expires automatically, marking the user **Offline** without needing explicit disconnect hooks." },

            {
                code: {
                    lang: "python", t: "Chat Storage Schema (Cassandra / ScyllaDB)",
                    lines: [
                        { c: "-- Cassandra partition key clusters all messages in a channel together", w: "" },
                        { c: "CREATE TABLE channel_messages (", w: "" },
                        { c: "    channel_id UUID,", w: "**Partition Key: Distributes channels across nodes.**", hi: true },
                        { c: "    message_id TIMEUUID,", w: "**Clustering Key: Automatically sorted chronologically.**", hi: true },
                        { c: "    sender_id UUID,", w: "" },
                        { c: "    content TEXT,", w: "" },
                        { c: "    PRIMARY KEY ((channel_id), message_id)", w: "" },
                        { c: ") WITH CLUSTERING ORDER BY (message_id DESC);", w: "**Optimized for recent message queries.**" },
                        { c: "", w: "" },
                        { c: "-- Paginate previous 50 messages with zero table scans", w: "" },
                        { c: "SELECT * FROM channel_messages WHERE channel_id = ? AND message_id < ? LIMIT 50;", w: "O(1) partition seek." }
                    ]
                }
            },

            { trap: "For group chats with 10,000 members (e.g. large Discord channels), do NOT duplicate the message 10,000 times into 10,000 user inboxes (**Fanout-on-Write**). Instead, write the message once to the channel table, and have the 10,000 connected clients read from the single channel stream (**Fanout-on-Read**)." },

            { vocab: ["WebSocket", "Publish-Subscribe", "Redis", "Cassandra", "Message Queue"] }
        ],
        k: [
            "Use persistent WebSockets for full-duplex messaging with minimal 2-byte frame overhead.",
            "Route messages between chat server nodes using Redis Pub/Sub channels assigned per user.",
            "Use Cassandra/NoSQL wide-column tables partitioned on `channel_id` and clustered by `TIMEUUID DESC` for fast reverse-chronological pagination."
        ],
        r: ["WebSocket", "Publish-Subscribe", "Redis", "Cassandra", "Message Queue"],
        drill: {
            lang: "python",
            reps: 3,
            items: [
                { c: "redis.publish(f'user:{recipient_id}', json.dumps(message))", w: "route message via Redis pub-sub" },
                { c: "redis.set(f'presence:{user_id}', '1', ex=60)", w: "update presence heartbeat with TTL" },
                { c: "# Big groups (>100 users): Fanout-on-Read; 1-on-1 chats: Fanout-on-Write", w: "chat fanout decision rule" }
            ]
        }
    }

]);
