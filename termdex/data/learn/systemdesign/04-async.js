/* System Design — Asynchronous Messaging & Event-Driven Systems. */
TD.addLessons("systemdesign", [

    {
        t: "Message Queues vs Event Streams (RabbitMQ vs Apache Kafka)",
        m: "async",
        lvl: "intermediate",
        s: "Synchronous bottlenecks vs asynchronous buffering, message queues, and distributed commit logs.",
        goal: [
            "Decouple monolithic synchronous HTTP chains using asynchronous message brokers",
            "Choose between traditional Message Queues (RabbitMQ/SQS) and Event Streams (Kafka)",
            "Handle traffic spikes and backpressure safely without dropping requests"
        ],
        b: [
            { p: "When an e-commerce checkout executes 6 synchronous HTTP calls in sequence (Charge Card → Update Inventory → Send Email → Trigger Warehouse → Analytics → SMS), total request latency equals the sum of all 6 calls. If the email service is down or slow, the entire checkout fails. **Asynchronous Messaging** decouples this pipeline." },

            { h: "Synchronous vs Asynchronous Architecture" },
            {
                tbl: {
                    t: "Sync REST vs Async Messaging",
                    h: ["Dimension", "Synchronous HTTP (REST / gRPC)", "Asynchronous Messaging (Queue / Stream)"],
                    rows: [
                        ["**Coupling**", "Temporal & spatial coupling: both caller and receiver must be online simultaneously", "Decoupled: producer drops message and returns immediately"],
                        ["**Failure Impact**", "Downstream failure immediately fails the user request", "Downstream failure is buffered; messages processed when service recovers"],
                        ["**Spike Absorption**", "Surge in traffic overloads backend servers and databases", "**Buffer / shock absorber**: Consumers process at their own controlled pace"],
                        ["**Response Time**", "Bounded by the slowest downstream dependency", "Sub-10ms (acknowledgement of queue acceptance)"]
                    ]
                }
            },

            { h: "Message Queues (RabbitMQ / SQS) vs Distributed Event Logs (Kafka)",
              p: "Traditional **Message Queues** track message delivery state per message: when a consumer acknowledges a message, the broker deletes it. **Event Streams (Kafka)** treat topics as partitioned, append-only, immutable commit logs on disk: messages are retained for days/weeks, and multiple independent consumer groups read from their own offset at their own speed." },

            {
                tbl: {
                    t: "RabbitMQ vs Apache Kafka Deep Comparison",
                    h: ["Feature", "RabbitMQ / Amazon SQS (Message Queue)", "Apache Kafka / Amazon Kinesis (Event Stream)"],
                    rows: [
                        ["**Model**", "Smart broker, dumb consumer (broker routes and tracks ACKs)", "Dumb broker, smart consumer (consumer tracks offset position)"],
                        ["**Persistence**", "Messages deleted once acknowledged by consumer", "Messages retained on disk for days/weeks/forever"],
                        ["**Replayability**", "**No**: Cannot rewind and re-read past messages", "**Yes**: Consumers can rewind offsets to re-process historical data"],
                        ["**Throughput**", "10K–50K messages/sec per node", "1,000,000+ messages/sec per cluster (zero-copy OS disk I/O)"],
                        ["**Routing Logic**", "Complex routing (Exchange types: Direct, Topic, Fanout, Header)", "Simple topic + partition key routing"],
                        ["**Best For**", "Task queues, background email jobs, complex routing", "High-throughput telemetry, real-time analytics, event sourcing, CDC"]
                    ]
                }
            },

            { trap: "Do not use Apache Kafka as a simple task queue with individual message acknowledgements and granular retry intervals per message. Kafka is an immutable sequence log; if one message in a partition fails, it blocks subsequent messages in that partition until resolved." },

            { vocab: ["Message Queue", "Publish-Subscribe", "Dead Letter Queue", "Event Sourcing", "CQRS", "Idempotency"] }
        ],
        k: [
            "Asynchronous messaging eliminates cascading failures and buffers traffic spikes, protecting downstream databases.",
            "Use RabbitMQ/SQS for discrete task execution with complex routing; use Kafka for high-throughput streaming and event replays.",
            "Kafka's append-only log allows new microservices to join months later and replay historical events from day one."
        ],
        r: ["Message Queue", "Publish-Subscribe", "Dead Letter Queue", "Event Sourcing", "CQRS"],
        drill: {
            lang: "python",
            reps: 3,
            items: [
                { c: "# RabbitMQ = message deleted on ACK; Kafka = append-only log retained on disk", w: "RabbitMQ vs Kafka core difference" },
                { c: "topic.send(key=user_id, value=payload)", w: "Kafka producer message partition routing" },
                { c: "consumer.commit_offset(partition, offset)", w: "Kafka consumer offset acknowledgement" }
            ]
        }
    },

    {
        t: "Partitions, Consumer Groups & Delivery Guarantees",
        m: "async",
        lvl: "intermediate",
        s: "Scaling Kafka consumers, partition key ordering, at-least-once delivery, and Dead Letter Queues.",
        goal: [
            "Scale stream processing using Kafka Consumer Groups and partition rebalancing",
            "Maintain strict message ordering per entity using partition keys",
            "Handle Poison Pill messages safely using Dead Letter Queues (DLQs)"
        ],
        b: [
            { p: "In Apache Kafka, a **Topic** is split into multiple **Partitions** distributed across broker disks. Partitions are the fundamental unit of parallelism and ordering in event-driven architecture." },

            { h: "Ordering Rules: Order is Guaranteed ONLY Within a Single Partition" },
            { p: "Kafka guarantees strict FIFO ordering **within a single partition**, but NEVER across multiple partitions. If a producer specifies a `partition_key` (e.g. `user_id`), Kafka hashes that key to ensure all events for that user land in the exact same partition in order." },

            { h: "Consumer Groups & Scaling Rules" },
            {
                tbl: {
                    t: "Consumer Group Parallelism Rules",
                    h: ["Scenario", "Partitions", "Consumers in Group", "Result / Efficiency"],
                    rows: [
                        ["**Balanced**", "4 Partitions", "4 Consumers", "100% efficiency: Each consumer reads exactly 1 partition"],
                        ["**Under-provisioned**", "4 Partitions", "2 Consumers", "Each consumer reads 2 partitions concurrently"],
                        ["**Over-provisioned**", "4 Partitions", "6 Consumers", "**2 consumers sit completely idle** (a partition cannot be read by >1 consumer in the same group)"],
                        ["**Different Group**", "4 Partitions", "Group B (Analytics)", "Group B receives an independent duplicate stream of all messages"]
                    ]
                }
            },

            { h: "Delivery Semantics & Idempotent Consumers" },
            {
                tbl: {
                    t: "Delivery Guarantees in Distributed Messaging",
                    h: ["Guarantee", "Mechanism", "Failure Mode", "Production Reality"],
                    rows: [
                        ["**At-Most-Once**", "Consumer commits offset BEFORE processing message", "If consumer crashes during processing, message is lost forever", "Acceptable only for non-critical telemetry metrics"],
                        ["**At-Least-Once**", "Consumer commits offset AFTER processing message finishes", "If consumer crashes after processing but before committing offset, message is re-delivered on restart", "**Standard industry default** — requires consumer to be idempotent"],
                        ["**Exactly-Once (EOS)**", "Two-phase commit between Kafka producer and consumer with transactional IDs", "Slightly higher latency and compute overhead", "Required for financial ledgers and exact inventory updates"]
                    ]
                }
            },

            {
                code: {
                    lang: "python", t: "Idempotent Consumer Implementation with Dead Letter Queue (DLQ)",
                    lines: [
                        { c: "def process_message(msg):", w: "" },
                        { c: "    message_id = msg['id']", w: "" },
                        { c: "    # 1. Idempotency Check: Have we already processed this message?", w: "" },
                        { c: "    if redis.exists(f'processed:{message_id}'):", w: "**Deduplicate redeliveries.**", hi: true },
                        { c: "        return  # Skip duplicate without error", w: "" },
                        { c: "", w: "" },
                        { c: "    try:", w: "" },
                        { c: "        # 2. Execute business logic inside DB transaction", w: "" },
                        { c: "        with db.transaction():", w: "" },
                        { c: "            execute_order(msg['payload'])", w: "" },
                        { c: "            # Record message ID in DB/Redis with 7-day TTL", w: "" },
                        { c: "            redis.setex(f'processed:{message_id}', 604800, '1')", w: "**Record unique processing.**", hi: true },
                        { c: "    except PoisonPillError as e:", w: "" },
                        { c: "        # 3. Corrupted message: Route to Dead Letter Queue (DLQ) so we don't block partition", w: "" },
                        { c: "        dlq_producer.send('orders-dlq', key=msg['key'], value=msg['value'])", w: "**Route unprocessable message.**", hi: true },
                        { c: "        log.error(f'Moved msg {message_id} to DLQ: {e}')", w: "" }
                    ]
                }
            },

            { trap: "Never set `max.poll.interval.ms` too low in Kafka consumers. If processing a heavy batch takes 31 seconds but your poll interval is 30 seconds, Kafka assumes the consumer has crashed, kicks it out of the group, triggers an expensive **Consumer Rebalance**, and assigns the same batch to another consumer in an endless loop." },

            { vocab: ["Message Queue", "Dead Letter Queue", "Idempotency", "Publish-Subscribe"] }
        ],
        k: [
            "Ordering in Kafka is guaranteed only within a single partition — use consistent entity partition keys.",
            "The number of active consumers in a consumer group cannot exceed the total number of partitions in the topic.",
            "Because At-Least-Once delivery can redeliver duplicates during network blips, every message consumer MUST be idempotent."
        ],
        r: ["Message Queue", "Dead Letter Queue", "Idempotency", "Event Sourcing"],
        drill: {
            lang: "python",
            reps: 3,
            items: [
                { c: "max_active_consumers = num_partitions", w: "Kafka consumer group scaling limit" },
                { c: "if is_duplicate(msg.id): return  # idempotent consumer guard", w: "idempotency check pattern" },
                { c: "dlq.send(poison_message)  # unblock consumer partition", w: "dead letter queue routing" }
            ]
        }
    },

    {
        t: "Event Sourcing, CQRS & The Transactional Outbox Pattern",
        m: "async",
        lvl: "advanced",
        s: "Storing immutable event streams, segregating read and write models, and solving the distributed dual-write bug.",
        goal: [
            "Implement Event Sourcing (deriving current application state from an immutable event stream)",
            "Architect Command Query Responsibility Segregation (CQRS) for high-scale reads and writes",
            "Eliminate distributed dual-write inconsistencies using the Transactional Outbox Pattern"
        ],
        b: [
            { p: "In traditional CRUD databases, updating a user's balance from $100 to $70 overwrites the row: the old value is lost forever. **Event Sourcing** stores every change as an immutable domain event (`AccountOpened`, `Deposited($100)`, `Withdrew($30)`). Current state is the mathematical reduction of the event stream." },

            { h: "CQRS: Command Query Responsibility Segregation" },
            { p: "In high-traffic systems, the data shape needed for fast writes (normalized 3NF relational tables) is completely opposite to the data shape needed for fast reads (denormalised search indices in Elasticsearch). **CQRS** splits the application into two separate models: a **Command Model** (writes) and a **Query Model** (reads)." },

            {
                tbl: {
                    t: "Command Model vs Query Model in CQRS",
                    h: ["Component", "Command Side (Writes)", "Query Side (Reads)"],
                    rows: [
                        ["**Responsibility**", "Validates domain rules, enforces invariants, writes events", "Serves complex filters, aggregations, search queries"],
                        ["**Database**", "Relational DB (PostgreSQL / MySQL) or Event Store", "Elasticsearch, Read Replicas, Redis, MongoDB"],
                        ["**Data Model**", "Normalized, strict schema, transactional consistency", "Denormalised, flat JSON documents, zero joins"],
                        ["**Scaling**", "Scales with business transaction mutations", "Scales with read traffic (100x higher than writes)"]
                    ]
                }
            },

            { h: "The Dual-Write Bug & Transactional Outbox Pattern" },
            { p: "If your code writes to the database and then immediately sends an event to Kafka: if the database succeeds but the Kafka call fails (network drop), your systems are out of sync. If you send to Kafka first and the database write fails, Kafka has sent a phantom event. This is the **Dual-Write Problem**." },

            {
                code: {
                    lang: "sql", t: "The Transactional Outbox Solution",
                    lines: [
                        { c: "-- 1. In a single local ACID transaction, write both domain state and outbox event", w: "" },
                        { c: "BEGIN;", w: "Single atomic transaction." },
                        { c: "INSERT INTO orders (id, user_id, amount, status) VALUES ('o_123', 'u_99', 500, 'CREATED');", w: "Domain table." },
                        { c: "INSERT INTO outbox_events (id, aggregate_type, aggregate_id, payload, created_at) ", w: "" },
                        { c: "VALUES ('evt_1', 'Order', 'o_123', '{\"event\": \"OrderCreated\", \"amount\": 500}', NOW());", w: "**Outbox table in same DB.**", hi: true },
                        { c: "COMMIT;", w: "Both commit or neither commits." },
                        { c: "", w: "" },
                        { c: "-- 2. Background Change Data Capture (CDC / Debezium) reads DB WAL log and publishes to Kafka safely", w: "**Zero message loss.**" }
                    ]
                }
            },

            { trap: "CQRS introduces eventual consistency between the write model and read model. If a user creates a comment and is immediately redirected to the search page, the new comment may take 200ms to index in Elasticsearch. Handle this in UI with optimistic rendering." },

            { vocab: ["Event Sourcing", "CQRS", "ACID", "Eventual Consistency", "Database Migration"] }
        ],
        k: [
            "Event Sourcing provides a complete audit trail and time-travel debugging by storing immutable state mutations.",
            "CQRS allows read and write databases to scale and optimize independently according to their distinct workloads.",
            "The Transactional Outbox Pattern with CDC (Debezium) guarantees reliable event publication without distributed 2PC transactions."
        ],
        r: ["Event Sourcing", "CQRS", "Message Queue", "ACID", "Database Migration"],
        drill: {
            lang: "sql",
            reps: 3,
            items: [
                { c: "INSERT INTO outbox (event_type, payload) VALUES (...); -- in same DB transaction", w: "transactional outbox pattern write" },
                { c: "-- CQRS: Writes go to Command DB; Debezium syncs events to Read ElasticSearch", w: "CQRS architecture data flow" },
                { c: "current_balance = sum(event.amount for event in event_log)", w: "event sourcing state fold" }
            ]
        }
    }

]);
