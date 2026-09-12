/* System Design — consistency, consensus and distributed transactions.

   The module the track declared and never filled. It is the hardest part of
   distributed systems and the part interviewers press hardest on, because it
   is where hand-waving is most obvious: anyone can say "eventually
   consistent", and very few can say what a client actually observes.

   Everything here is written from the client's point of view, because that is
   the only place consistency is real. A guarantee nobody can detect is not a
   guarantee. */

TD.addLessons("systemdesign", [

/* ==================================================================== */
{
 t: "CAP, PACELC, and Saying It Correctly",
 m: "consistency",
 lvl: "advanced",
 s: "The theorem everyone quotes and most people misstate — and the one that matters more in practice.",
 goal: [
  "State CAP without the 'pick two of three' error",
  "Explain why PACELC describes the everyday trade-off better",
  "Classify a real database and defend the classification"
 ],
 b: [
  { p: "CAP is the most-quoted and most-misquoted result in distributed systems. Stating it correctly takes one sentence, and getting it wrong in an interview is an immediate signal that the knowledge is second-hand." },

  { h: "The correct statement" },
  { p: "**When the network partitions, a system must choose between consistency and availability.** That is it. You do not choose P — partitions are a property of networks, not an option you enable." },

  { trap: "\"Pick two of three\" is the standard misstatement, and it implies you could choose CA — a system that gives up partition tolerance. No distributed system can do that, because you cannot decline to have your network fail. A single-node database is CA only in the sense that it is not distributed at all." },

  { tbl: { t: "What the choice actually looks like during a partition",
    h: ["Choice", "The system does", "You get", "Examples"],
    rows: [
     ["**CP**", "Refuses requests it cannot confirm", "Errors, but never a wrong answer", "etcd, ZooKeeper, HBase, Spanner"],
     ["**AP**", "Answers from whatever node you reached", "An answer, possibly stale", "Cassandra, DynamoDB (default), Riak"]
    ] } },

  { ana: "Two bank branches with the phone line cut. CP is refusing all withdrawals until the line is back — nobody overdraws, and nobody gets their money. AP is letting both branches pay out from their own copy of the balance — every customer is served, and the account may go negative. Neither is wrong; they are different businesses.",
    at: "The branch with a cut phone line" },

  { h: "PACELC: the half nobody quotes" },
  { p: "CAP only describes behaviour *during a partition*, which is rare. PACELC extends it to the other 99.9% of the time: **if Partition, then A or C; Else, then L or C** — latency or consistency." },

  { p: "This is the trade-off you actually pay for every day. Strong consistency requires talking to other nodes before answering, and that costs a round trip whether or not anything is broken. That cost, not partitions, is why most large systems are eventually consistent by default." },

  { code: { lang: "text", t: "Classifying real systems",
    lines: [
     { c: "PostgreSQL (single primary)   PC/EC", w: "Consistent during a partition and in normal operation. You pay latency for it." },
     { c: "Cassandra                     PA/EL", w: "Available during a partition, and tuned for latency otherwise. The default is fast and possibly stale." },
     { c: "DynamoDB                      PA/EL", w: "Same, though a strongly-consistent read is available per request — at roughly double the cost and latency." },
     { c: "Spanner                       PC/EC", w: "Strong consistency globally, bought with atomic clocks and a deliberate commit-wait delay.", hi: true },
     { c: "MongoDB                       PC/EC", w: "Since the default write concern became majority. Older defaults were far weaker, which is why old advice about MongoDB is misleading." }
    ],
    after: "Notice that Spanner is not a counterexample to CAP. It is CP — during a partition, the minority side stops serving. What it buys with its clocks is very low latency for a CP system, not an escape from the theorem." } },

  { n: "The interview-ready phrasing: \"CAP is only about partition behaviour, and partitions are not optional — so the real question is what happens the rest of the time, which is PACELC's latency-versus-consistency trade-off. Most systems choose latency, and then bolt consistency back on for the specific operations that need it.\"",
    nt: "How to say it" },

  { tryit: { t: "Classify and defend",
    task: "You are designing the *inventory count* for a flash sale — thousands of concurrent buyers, limited stock. CP or AP? Then answer the follow-up: what do you do about the fact that your choice makes the checkout slower?",
    hint: "Ask what an incorrect answer costs here, compared to a slow one.",
    sol: { lang: "text", code: "CP for the decrement, and it is not close.\n\nAP means two nodes both see 'stock: 1' during a partition and\nboth sell it. You have now sold inventory you do not have, and\nthe resolution is a refund, an apology and a support ticket --\nper oversold item, at flash-sale volume.\n\nThe follow-up is the real question, and the answer is NOT\n'accept the latency everywhere':\n\n  * Make only the DECREMENT strongly consistent. Browsing,\n    search and the product page can all be stale -- nobody is\n    harmed by a count that is two seconds old.\n  * Reserve rather than sell: a short-lived hold on stock,\n    confirmed at payment. This moves the strong-consistency\n    requirement to a much smaller, shorter operation.\n  * Shard by SKU so contention is per product, not global.\n    Ten thousand buyers for one item still serialise; ten\n    thousand buyers across a thousand items do not.\n\nThe general move: do not choose one consistency level for the\nwhole system. Choose it per operation, and make the strongly\nconsistent set as small as you can defend." },
    w: "\"Consistency per operation, not per system\" is the answer that separates a memorised classification from real design judgement. Almost every large system is mostly eventually consistent with a small strongly-consistent core." } }
 ],
 k: [
  "CAP: during a partition, choose consistency or availability. You never choose P.",
  "'Pick two of three' is wrong — it implies CA, which no distributed system can be.",
  "PACELC adds the normal case: else, latency or consistency. That is the daily cost.",
  "Strong consistency costs a round trip even when nothing is broken.",
  "Choose consistency per operation, and keep the strongly-consistent set small."
 ],
 r: ["CAP Theorem", "Eventual Consistency", "Latency", "Replication"],
 drill: {
  lang: "text",
  reps: 2,
  items: [
   { c: "During a partition: consistency or availability.", w: "CAP, stated correctly" },
   { c: "Else: latency or consistency.", w: "the half of PACELC people omit" },
   { c: "CP refuses; AP answers with possibly stale data.", w: "what each choice does to a client" },
   { c: "Consistency per operation, not per system.", w: "the design move that resolves the trade-off" },
   { c: "Reserve, then confirm at payment.", w: "shrinking the strongly-consistent window" }
  ]
 }
},

/* ==================================================================== */
{
 t: "Consistency Models, From the Client's Seat",
 m: "consistency",
 lvl: "advanced",
 s: "What a reader actually observes — and why 'eventually consistent' is not one guarantee but several.",
 goal: [
  "Order the main consistency models from strongest to weakest",
  "Describe read-your-writes and why its absence looks like a bug",
  "Pick the weakest model that still makes your feature correct"
 ],
 b: [
  { p: "Consistency is usually taught as a property of a system. It is more useful as a property of what a **client can observe**, because that is where the bug reports come from — and because a guarantee nobody can detect is not worth paying for." },

  { h: "The ladder" },
  { tbl: { t: "Strongest at the top; each rung costs less than the one above",
    h: ["Model", "What a client is promised", "Cost"],
    rows: [
     ["**Linearisable**", "Every read sees the most recent write, as if there were one copy", "A round trip to consensus on every operation"],
     ["**Sequential**", "Everyone sees operations in the same order, not necessarily real time", "Cheaper than linearisable, rarely offered directly"],
     ["**Causal**", "If A caused B, nobody sees B without A", "Track causality; no global coordination"],
     ["**Read-your-writes**", "*You* see your own writes; others may lag", "Route your reads to where you wrote"],
     ["**Eventual**", "If writes stop, replicas converge. Until then, anything", "Nearly free"]
    ] } },

  { h: "The one that causes support tickets" },
  { p: "**Read-your-writes** is the model whose absence users notice immediately. Someone edits their profile, the write goes to the primary, the redirect reads from a replica that has not caught up, and the page shows the old name. The system is behaving exactly as designed and the user is certain it is broken." },

  { code: { lang: "python", t: "Three ways to fix it, cheapest first",
    lines: [
     { c: "# 1. Sticky reads after a write", w: "" },
     { c: "session[\"read_primary_until\"] = time.time() + 5", w: "For a few seconds after writing, read the primary. Simple, effective, and costs nothing when idle.", hi: true },
     { c: "", w: "" },
     { c: "# 2. Wait for the replica to catch up", w: "" },
     { c: "lsn = db.execute(\"SELECT pg_current_wal_lsn()\")", w: "Record the write position, then have the reader wait until the replica has reached it. Correct, and slower." },
     { c: "", w: "" },
     { c: "# 3. Show the client its own write optimistically", w: "" },
     { c: "return {**stored, **submitted}", w: "The UI shows what the user just typed regardless of replication. This is what most web apps actually do, and it is why the problem seems rarer than it is." }
    ] } },

  { trap: "Do not reach for linearisability because it is the safest word on the list. It requires coordination on every operation, which means every read pays a round trip and the system stops serving during a partition. Most features do not need it: a like count, a feed, a search result and a dashboard are all correct while eventually consistent. Ask what a stale read would actually cost before paying for freshness." },

  { h: "Choosing per feature" },
  { code: { lang: "text", t: "One product, four different answers",
    lines: [
     { c: "payment / stock decrement    linearisable", w: "A wrong answer is money. Pay for it." },
     { c: "user profile after editing   read-your-writes", w: "The user must see their own change. Nobody else needs it immediately." },
     { c: "comment thread               causal", w: "A reply must never appear before the comment it answers.", hi: true },
     { c: "like count / view count      eventual", w: "Nobody can tell, and nobody is harmed. Making this strong is pure waste." }
    ],
    after: "Four models in one product, and that is normal rather than sloppy. Being able to argue each choice from what a stale read would cost is the skill being tested." } },

  { tryit: { t: "Pick the model",
    task: "A chat application. Messages appear in a room shared by many users. Which model does the message list need, and what specifically goes wrong one rung lower?",
    hint: "Think about what a reply looks like if it arrives before the thing it replies to.",
    sol: { lang: "text", code: "Causal consistency.\n\nWhy not eventual (one rung lower):\n  Messages could arrive out of order across replicas, so a\n  reader can see\n\n      Bob: \"I completely agree\"\n      Ann: \"we should ship on Friday\"\n\n  The conversation is nonsense. Nothing is lost and it will\n  converge -- but the intermediate state is unreadable, and\n  users will report it as a bug because it IS one.\n\nWhy not linearisable (one rung higher):\n  It would also work, and it costs a consensus round trip per\n  message in a system whose entire purpose is to feel instant.\n  Nobody can perceive the difference between causal and\n  linearisable ordering in a chat room, so the extra latency\n  buys nothing observable.\n\nHow causal is usually implemented here:\n  * a per-room monotonic sequence number, or\n  * vector clocks / Lamport timestamps across replicas,\n  * plus client-side buffering: hold a message whose\n    predecessor has not arrived, rather than rendering it.\n\nThe rule this illustrates: pick the WEAKEST model under which\nyour feature is still correct. Anything stronger is latency you\npay for and nobody can see." },
    w: "\"The weakest model that is still correct\" is the whole discipline. Reaching for the strongest guarantee is not caution — it is an unexamined cost, and at scale it is the difference between a system that responds in 20 ms and one that responds in 200." } }
 ],
 k: [
  "Consistency is best reasoned about as what a client can observe, not as a system property.",
  "The ladder: linearisable, sequential, causal, read-your-writes, eventual.",
  "Missing read-your-writes is the failure users report as a bug — fix with sticky reads.",
  "Causal ordering is what stops a reply appearing before the comment it answers.",
  "Pick the weakest model under which the feature is still correct."
 ],
 r: ["Eventual Consistency", "Replication", "CAP Theorem", "Latency"],
 drill: {
  lang: "python",
  reps: 2,
  items: [
   { c: "session[\"read_primary_until\"] = time.time() + 5", w: "sticky reads to guarantee read-your-writes" },
   { c: "return {**stored, **submitted}", w: "show the client its own write optimistically" },
   { c: "linearisable > causal > read-your-writes > eventual", w: "the ladder, strongest first", lang: "text" },
   { c: "Pick the weakest model that is still correct.", w: "the rule for choosing", lang: "text" },
   { c: "A reply must not appear before its comment.", w: "what causal consistency buys you", lang: "text" }
  ]
 }
},

/* ==================================================================== */
{
 t: "Distributed Transactions: 2PC, Saga and the Outbox",
 m: "consistency",
 lvl: "advanced",
 s: "How to change two things at once when they live in different databases — and why the obvious answer is usually wrong.",
 goal: [
  "Explain why two-phase commit blocks and where that matters",
  "Design a saga with compensating actions",
  "Recognise the dual-write problem and fix it with an outbox"
 ],
 b: [
  { p: "A single database gives you a transaction: both changes happen or neither does. Split the data across two services and that guarantee disappears — and the ways of getting it back all cost something." },

  { h: "Two-phase commit" },
  { ol: [
   "**Prepare.** A coordinator asks every participant: can you commit this? Each locks the rows and replies yes or no.",
   "**Commit.** If all said yes, the coordinator tells everyone to commit. If any said no, everyone rolls back."
  ] },
  { p: "It is correct, and it is why almost nobody uses it across services." },

  { trap: "2PC blocks. Between prepare and commit, every participant is holding locks and waiting. If the coordinator dies in that window, those locks are held indefinitely — participants cannot decide alone, because they do not know what the others answered. One slow or failed coordinator can freeze every service involved, which is precisely the coupling microservices exist to avoid." },

  { h: "Sagas: give up atomicity, keep correctness" },
  { p: "A saga replaces one atomic transaction with a **sequence of local transactions**, each with a **compensating action** that undoes it. There is no moment where everything is locked; instead there are intermediate states, and you handle them deliberately." },

  { code: { lang: "text", t: "Booking a trip across three services",
    lines: [
     { c: "1. reserve flight     -> compensate: cancel flight", w: "" },
     { c: "2. reserve hotel      -> compensate: cancel hotel", w: "" },
     { c: "3. charge card        -> compensate: refund card", w: "" },
     { c: "", w: "" },
     { c: "step 3 fails:", w: "" },
     { c: "  run compensate(2), then compensate(1), in reverse", w: "The trip is not booked and nothing is left half-done. But there *was* a moment when the hotel was reserved and the card was not charged — that state existed and was visible.", hi: true }
    ] } },

  { p: "Compensation is not rollback. A rollback erases history; a compensation is a new action that offsets an old one. You cannot un-send an email, so you send an apology. You cannot un-charge a card, so you refund it — and the customer sees both lines on their statement." },

  { tbl: { t: "Choosing between them",
    h: ["", "2PC", "Saga"],
    rows: [
     ["**Atomicity**", "Real", "Eventual, via compensation"],
     ["**Locks**", "Held across services", "None beyond each local step"],
     ["**Failure of coordinator**", "Participants block", "Each step is independently recoverable"],
     ["**Intermediate states**", "Invisible", "Visible — you must design for them"],
     ["**Use when**", "Inside one database or a tight cluster", "Across services, which is most of the time"]
    ] } },

  { h: "The dual-write problem" },
  { p: "Even without a distributed transaction, there is a subtler version that catches almost everyone: writing to a database and publishing an event." },

  { vs: { t: "Save an order and tell the world", lang: "python",
    bad: { c: "db.save(order)\nqueue.publish(\"order.created\", order)", label: "Two writes, no atomicity",
      w: "If the process dies between these lines, the order exists and nothing downstream knows. Reverse the order and you can publish an event for an order that was never saved. There is no ordering of two independent writes that is safe." },
    good: { c: "with db.transaction():\n    db.save(order)\n    db.save(OutboxEvent(\"order.created\", order))\n\n# a separate worker reads the outbox and publishes", label: "The transactional outbox",
      w: "Both writes go to the *same* database in one real transaction, so they are genuinely atomic. A relay then publishes from the outbox table and marks rows sent. The event may be published twice if the relay crashes after publishing and before marking — which is why consumers must be idempotent." } } },

  { n: "The outbox pattern is the standard answer to dual writes, and it is worth naming in an interview. Its cost is at-least-once delivery: the relay may publish an event twice. That is acceptable precisely because idempotent consumers are required anyway — every message queue you will use is at-least-once.",
    nt: "Why the outbox is the standard answer" },

  { tryit: { t: "Design the saga",
    task: "An e-commerce checkout: reserve stock, charge the card, create the shipment. The card charge succeeds but shipment creation fails permanently. Write the compensation sequence — and identify the one step where a naive compensation is wrong.",
    hint: "Ask which compensating action has consequences that a refund does not undo.",
    sol: { lang: "text", code: "Compensate in reverse order:\n\n  3. create shipment   FAILED -- nothing to compensate\n  2. charge card       -> refund the card\n  1. reserve stock     -> release the reservation\n\nThe step where naive compensation is wrong: step 2.\n\nA refund is not the inverse of a charge. It leaves:\n  * two lines on the customer's statement, which generates a\n    support contact even when nothing was lost\n  * payment-processor fees that are often NOT returned\n  * a settlement delay of days, so the customer is out of\n    pocket meanwhile\n\nWhich is why real checkouts reorder the saga:\n\n  1. reserve stock\n  2. AUTHORISE the card      (a hold, not a charge)\n  3. create shipment\n  4. CAPTURE the authorisation\n\nNow the compensation for step 2 is 'void the authorisation',\nwhich the customer never sees and which costs nothing.\n\nThe general principle: order a saga so the hardest-to-compensate\nstep happens LAST. If an action cannot be cleanly undone, it\nshould be the final commit, not an early one." },
    w: "\"Put the irreversible step last\" is the single most useful heuristic in saga design, and it applies well beyond payments — sending email, provisioning infrastructure, calling a third-party API. Do everything reversible first, then commit." } }
 ],
 k: [
  "2PC is atomic but blocks: a dead coordinator leaves participants holding locks.",
  "A saga is local transactions plus compensating actions — intermediate states are visible.",
  "Compensation is a new offsetting action, not a rollback; you cannot un-send an email.",
  "Writing to a database and a queue is a dual write and is never atomic — use an outbox.",
  "Order a saga so the hardest-to-compensate step happens last."
 ],
 r: ["Transaction", "Idempotency", "Message Queue", "ACID"],
 drill: {
  lang: "python",
  reps: 2,
  items: [
   { c: "with db.transaction():", w: "make the outbox write atomic with the data write" },
   { c: "db.save(OutboxEvent(\"order.created\", order))", w: "record the event in the same transaction" },
   { c: "prepare, then commit", w: "the two phases of 2PC", lang: "text" },
   { c: "Compensate in reverse order.", w: "how a saga unwinds", lang: "text" },
   { c: "Put the irreversible step last.", w: "the saga ordering heuristic", lang: "text" }
  ]
 }
},

/* ==================================================================== */
{
 t: "Consensus: Raft, Quorums and Split Brain",
 m: "consistency",
 lvl: "advanced",
 s: "How a group of machines agrees on one answer when any of them may fail or lie about being alive.",
 goal: [
  "Explain why a majority quorum prevents split brain",
  "Describe leader election and log replication in Raft",
  "Say why consensus clusters are sized 3, 5 or 7 and never 4"
 ],
 b: [
  { p: "Consensus is the problem of getting a group of machines to agree on a value when messages can be lost, delayed or reordered and machines can crash. Every strongly-consistent system has one of these at its core, usually deciding who the leader is." },

  { h: "Quorums, and why the majority" },
  { p: "A **quorum** is the number of nodes that must agree for a decision to count. Set it at a strict majority — more than half — and two things follow that make the whole scheme work:" },
  { ol: [
   "**Two quorums must overlap.** Any two majorities of the same set share at least one node, so a decision can never be made twice with contradictory values.",
   "**Only one side of a partition can have one.** Split five nodes into 3 and 2, and only the group of three can act. The minority side knows it is a minority and stops."
  ] },

  { trap: "**Split brain** is what happens without a majority rule: a partition leaves two groups that both believe they are in charge, both accept writes, and the data diverges irreconcilably. Requiring a strict majority makes this impossible, at the cost of the minority side becoming unavailable — which is the CP choice from the first lesson, in mechanical form." },

  { code: { lang: "text", t: "Why cluster sizes are odd",
    lines: [
     { c: "3 nodes  quorum 2  tolerates 1 failure", w: "" },
     { c: "4 nodes  quorum 3  tolerates 1 failure", w: "**One more machine, no more tolerance.** A 4-node cluster fails at 2 lost nodes, exactly like a 3-node one — you paid for a machine and bought nothing but a larger surface for partitions.", hi: true },
     { c: "5 nodes  quorum 3  tolerates 2 failures", w: "" },
     { c: "6 nodes  quorum 4  tolerates 2 failures", w: "Same waste as 4." },
     { c: "7 nodes  quorum 4  tolerates 3 failures", w: "" }
    ],
    after: "The formula: with n nodes, quorum is floor(n/2) + 1, and you tolerate n − quorum failures. Every even size wastes a machine, which is why every consensus cluster you meet has 3, 5 or 7 members. Beyond 7, the cost of agreeing among more nodes outweighs the extra tolerance." } },

  { h: "Raft, in three parts" },
  { p: "Raft was designed to be *understandable*, explicitly in reaction to Paxos being correct and nearly unteachable. It splits the problem into three pieces you can reason about separately." },

  { ol: [
   "**Leader election.** One node is the leader; all writes go through it. Each follower runs a randomised timeout, and on expiry becomes a candidate and requests votes. The randomisation is what prevents every node standing simultaneously forever.",
   "**Log replication.** The leader appends an entry, sends it to followers, and commits once a majority has acknowledged. Only then does the client get a success.",
   "**Safety.** A node will not vote for a candidate whose log is behind its own, which guarantees a new leader already contains every committed entry."
  ] },

  { code: { lang: "text", t: "One write through Raft",
    lines: [
     { c: "client -> leader        SET x = 5", w: "" },
     { c: "leader appends to its own log (uncommitted)", w: "" },
     { c: "leader -> followers     AppendEntries", w: "" },
     { c: "2 of 3 followers ack    -> majority reached", w: "The leader itself counts, so 2 acks out of 3 nodes is a majority of 3." },
     { c: "leader commits, applies to state machine", w: "" },
     { c: "leader -> client        OK", w: "**The client hears nothing until a majority has the entry durably.** That is the round trip strong consistency costs, and it is the latency PACELC's 'else C' refers to.", hi: true }
    ] } },

  { n: "You will almost never implement consensus — you will *use* it. etcd (behind Kubernetes), Consul, ZooKeeper and the control plane of most managed databases are all Raft or Paxos. What matters in practice is knowing that this is what leader election costs, why the cluster is sized 3 or 5, and why writes stop when a majority is unreachable.",
    nt: "You use it, you don't build it" },

  { tryit: { t: "Size the cluster",
    task: "You are deploying etcd across three availability zones and want to survive losing an entire zone. How many nodes, and how do you distribute them? Then say what happens if you put 3 nodes in one zone and 1 each in the others.",
    hint: "A quorum must be reachable after the loss. Where the nodes sit matters as much as how many there are.",
    sol: { lang: "text", code: "5 nodes: 2 + 2 + 1 across the three zones.\n\nLosing any one zone leaves at least 3 of 5 -- a quorum -- so\nthe cluster keeps serving:\n  lose the 2-node zone  -> 3 remain, quorum 3  OK\n  lose the 1-node zone  -> 4 remain, quorum 3  OK\n\nWhy not 3 nodes (1+1+1): it also survives one zone loss\n(2 of 3 = quorum), and is cheaper. Choose 3 if a single\nsimultaneous failure is your ceiling; choose 5 if you want to\nsurvive a zone loss AND a machine failure at the same time.\n\nThe bad layout -- 3 + 1 + 1:\n  Losing the 3-node zone leaves 2 of 5. Quorum is 3.\n  The cluster STOPS. No writes, no leader election, and\n  anything depending on it (all of Kubernetes, if this is\n  etcd) is frozen until that zone returns.\n\n  It looks fault-tolerant -- five nodes, three zones -- and it\n  has a single point of failure hiding in the placement.\n\nThe rule: no single failure domain may hold a quorum. Count\nnodes per zone, not just in total." },
    w: "Placement is where real deployments fail, not node count. \"No single failure domain holds a quorum\" is worth memorising — the 3+1+1 layout is a real and common mistake, and it passes a casual review because the totals look right." } }
 ],
 k: [
  "A quorum is a strict majority; two majorities always overlap, so decisions cannot contradict.",
  "Split brain is impossible with majority quorums — at the cost of the minority stopping.",
  "Cluster sizes are odd: 4 nodes tolerate no more failures than 3 and waste a machine.",
  "Raft is leader election, log replication and a safety rule about whose log is current.",
  "No single failure domain may hold a quorum — placement matters as much as count."
 ],
 r: ["Consensus", "Replication", "CAP Theorem"],
 drill: {
  lang: "text",
  reps: 2,
  items: [
   { c: "quorum = floor(n / 2) + 1", w: "the majority formula" },
   { c: "3, 5 or 7 — never 4", w: "why consensus clusters are odd-sized" },
   { c: "Two majorities always overlap.", w: "why quorums prevent contradiction" },
   { c: "The minority side stops serving.", w: "what prevents split brain" },
   { c: "No single failure domain holds a quorum.", w: "the placement rule" }
  ]
 }
}

]);
