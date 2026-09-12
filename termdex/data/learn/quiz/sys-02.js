/* Two questions only. This file previously re-added four questions that
   sys-01.js already contained -- an accidental paste that produced exact
   duplicates in the async and resilience banks, so a reader met the same
   question twice in one quiz. The duplicates were removed; these two are
   genuinely additional. */

/* Advanced System Design Scenarios — 50+ Hardcore Question Bank (Part 2). */

/* ===================================================================
   Module: async — Kafka Internals, Consumer Rebalancing & Event Sourcing
   =================================================================== */

TD.addMCQ("systemdesign", "async", [
  {
    tag: "Kafka Cooperative Sticky Rebalancing", lvl: "advanced",
    q: "Why did Apache Kafka 2.4 introduce the **Cooperative Sticky Assignor (Incremental Rebalance Protocol)** to replace the legacy Eager Rebalance protocol?",
    o: [
      "Eager rebalancing did not support JSON payloads",
      "Under legacy Eager rebalancing, when a single consumer joined or left the group, **ALL consumers were forced to revoke ALL partition assignments simultaneously**, pausing all stream processing across the entire fleet ('Stop-the-World' pause); Cooperative Sticky revokes only the specific partitions that need to migrate",
      "Cooperative Sticky eliminates the need for partition leaders",
      "Eager rebalancing consumed 100% CPU on Kafka brokers"
    ],
    a: 1,
    x: "Legacy Eager rebalancing triggered a global 'Stop-the-World' pause where every consumer gave up all its partitions and waited for reassignment. **Cooperative Sticky Rebalancing** performs incremental two-phase rebalancing: unaffected consumers continue processing their existing partitions without interruption, migrating only the minimal subset of partitions that must move."
  },
  {
    tag: "Transactional Outbox & CDC", lvl: "advanced",
    q: "Why is the Transactional Outbox Pattern combined with Change Data Capture (Debezium / Kafka Connect) superior to publishing directly to Kafka from application code?",
    o: [
      "Because Kafka cannot handle JSON payloads",
      "It eliminates the Dual-Write Problem where the DB transaction succeeds but the network call to Kafka fails (or vice versa), guaranteeing that every domain mutation is atomically recorded in the DB WAL log and published to Kafka with zero message loss",
      "It increases HTTP request latency for security auditing",
      "Because databases do not support foreign keys"
    ],
    a: 1,
    x: "Writing to a DB and publishing to Kafka are two distinct distributed systems that cannot be joined in a single ACID transaction without slow 2PC. The Transactional Outbox pattern writes both the business row and an outbox event into the *same* local database transaction. Debezium reads the database's Write-Ahead Log (WAL) and streams events to Kafka reliably."
  },
]);
