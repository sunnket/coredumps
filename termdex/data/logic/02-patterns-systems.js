/* Logic Vault — algorithmic patterns and distributed systems logic.

   The patterns deck is organised around *triggers*: the phrase in a problem
   statement that should make a particular approach the first thing you try.
   Recognition is the skill; the implementations are the easy part. */

TD.addLogicDeck("patterns", {
  id: "pattern-triggers",
  name: "Trigger phrases",
  lvl: "core",
  why: "Interviewers and real problems both describe the shape before you see it. These are the words that give it away.",
  cards: [

    { t: "Sliding window",
      recall: "Trigger: 'contiguous subarray or substring' plus 'longest', 'shortest' or 'at most k'.",
      why: "A window keeps a running answer for a contiguous range, so extending it by one costs O(1) instead of recomputing. Both edges only move forward, giving O(n) total. The word that licenses it is *contiguous* — items cannot be skipped.",
      use: ["Longest substring without repeating characters",
            "Max sum of any k consecutive elements",
            "Rate limiting over a time window",
            "Trimming a chat history to a token budget"],
      trap: "'Subsequence' allows gaps and kills the window — that is usually dynamic programming instead. One word decides the whole approach, so read it carefully.",
      code: { lang: "python", c: "left = 0\nfor right, x in enumerate(xs):\n    add(x)\n    while invalid():\n        remove(xs[left]); left += 1\n    best = max(best, right - left + 1)" },
      r: ["Sliding Window", "Two Pointers"] },

    { t: "Two pointers",
      recall: "Trigger: a **sorted** array plus 'find a pair', or a problem about both ends at once.",
      why: "Sorted order means a comparison rules out a whole region rather than one candidate. Sum too small, so the smallest element cannot work with anything — discard it and move in. That is what collapses n squared to n.",
      use: ["Pair summing to a target", "Removing duplicates in place",
            "Reversing", "Palindrome checks", "Merging two sorted lists"],
      trap: "It needs sorted input. If sorting is allowed, sorting first at O(n log n) and then scanning at O(n) is often still the best answer — say that out loud rather than assuming sorting is cheating.",
      r: ["Two Pointers", "Sorting Algorithm"] },

    { t: "Binary search",
      recall: "Trigger: sorted data, or any question where you can *test* an answer more easily than compute it.",
      why: "Each comparison halves the space, so a million items take twenty steps. The underused half is 'binary search on the answer': if you can ask 'is x good enough?' in O(n), you can find the optimal x in O(n log range) without ever solving directly.",
      use: ["Lookup in sorted data", "First or last occurrence",
            "Minimum capacity / speed / size that satisfies a constraint",
            "Finding a boundary in a monotonic condition"],
      trap: "`lo + (hi - lo) // 2` rather than `(lo + hi) // 2` — in languages with fixed-width integers the second overflows. Python is immune, but the habit is expected, and the off-by-one in the loop bound is where nearly all binary search bugs live.",
      code: { lang: "python", c: "import bisect\ni = bisect.bisect_left(xs, target)   # use the stdlib\n# hand-rolled only when the predicate is custom" },
      r: ["Binary Search", "Divide and Conquer"] },

    { t: "BFS versus DFS",
      recall: "BFS uses a queue and finds the shortest path in an unweighted graph. DFS uses a stack or recursion and explores one branch fully.",
      why: "BFS expands by distance, so the first time it reaches a node it has arrived by the fewest edges — that is what makes it shortest-path-correct without weights. DFS goes deep first, which suits questions about whole structures: cycles, connectivity, topological order.",
      use: ["BFS: shortest hops, level-by-level, nearest match",
            "DFS: cycle detection, topological sort, flood fill, backtracking"],
      trap: "BFS is only shortest-path for *unweighted* graphs. Add weights and you need Dijkstra — which is BFS with a priority queue instead of a plain queue. Saying it that way shows you understand both.",
      r: ["Breadth-First Search", "Depth-First Search", "Dijkstra's Algorithm"] },

    { t: "Dynamic programming",
      recall: "Trigger: 'count the ways', 'maximum or minimum over choices', and overlapping subproblems.",
      why: "DP applies when the same subproblem is solved repeatedly and an optimal solution is built from optimal sub-solutions. Memoising turns exponential recursion into polynomial work. The whole task is defining the state — once the state and the transition are right, the code is mechanical.",
      use: ["Fibonacci and every staircase variant", "Knapsack", "Edit distance",
            "Longest common subsequence", "Coin change"],
      trap: "Start with plain recursion, confirm it is correct, then add a cache. People try to write the bottom-up table first, get the state wrong, and cannot debug it because there is no correct version to compare against.",
      code: { lang: "python", c: "from functools import lru_cache\n\n@lru_cache(maxsize=None)\ndef solve(i, k):\n    ...   # top-down first; optimise to a table only if needed" },
      r: ["Dynamic Programming", "Memoisation", "Recursion"] },

    { t: "Greedy",
      recall: "Take the locally best option each step — and it only works if you can argue why that is globally optimal.",
      why: "Greedy is right when a local choice never forecloses a better global outcome, a property called the greedy-choice property. Interval scheduling by earliest end time is provably optimal; coin change with arbitrary denominations is not.",
      use: ["Interval scheduling and merging", "Huffman coding",
            "Minimum spanning trees", "Most 'schedule the maximum number of X' problems"],
      trap: "Greedy is the most commonly wrong 'obvious' answer. If you cannot justify why the local choice is safe, assume it is not and reach for DP. Being able to give a one-sentence exchange argument is the difference between a correct answer and a lucky one.",
      r: ["Greedy Algorithm", "Dynamic Programming"] },

    { t: "Hash map to kill a nested loop",
      recall: "If the inner loop is searching, replace it with a dict and the whole thing becomes one pass.",
      why: "The most common O(n squared) is 'for each item, look through the others'. Storing what you have seen turns each inner search into O(1). This single move accounts for a large share of easy-to-medium problems.",
      use: ["Two-sum", "Finding duplicates", "Anagram grouping",
            "Any 'have I seen a complementary item' question"],
      trap: "It costs O(n) memory. On a genuinely huge stream that may not be available, and then the answer is sorting, or a probabilistic structure like a Bloom filter that trades exactness for space.",
      r: ["Hash Table", "Time Complexity"] }
  ]
});

TD.addLogicDeck("systems", {
  id: "distributed-truths",
  name: "Distributed systems truths",
  lvl: "intermediate",
  why: "These come up in every system design round and every production incident. They are the vocabulary of the conversation.",
  cards: [

    { t: "CAP, stated correctly",
      recall: "When the network partitions, you choose consistency or availability. You do not choose P.",
      why: "Partitions are a fact of networks, not an option — so CAP is really a choice between CP and AP *during a partition*. When the network is healthy you can have both. The common misstatement 'pick two of three' implies you could choose to not have partitions, which no distributed system can.",
      use: ["Justifying a database choice",
            "Explaining why a payment system and a social feed make opposite calls"],
      trap: "The real trade-off in normal operation is PACELC's second half: else, latency versus consistency. Strong consistency costs a round trip even when nothing is broken, which is why most systems are eventually consistent by default.",
      r: ["CAP Theorem", "Eventual Consistency"] },

    { t: "Idempotency",
      recall: "Doing it twice has the same effect as doing it once.",
      why: "Networks fail after the request arrives but before the response returns, so the client cannot tell success from failure and must retry. If the operation is not idempotent, that retry charges the card twice. Idempotency is what makes retries safe, and retries are unavoidable.",
      use: ["Payments and any write API", "Message queue consumers (at-least-once delivery)",
            "Any operation behind a retry"],
      trap: "GET, PUT and DELETE are idempotent by definition; POST is not. Make POST safe with a client-supplied idempotency key that the server records and de-duplicates against.",
      r: ["Idempotency", "HTTP Methods", "Retry"] },

    { t: "At-least-once, at-most-once, exactly-once",
      recall: "Exactly-once delivery does not exist. Exactly-once *processing* does — at-least-once delivery plus idempotent handling.",
      why: "To guarantee delivery you must retry until acknowledged, which risks duplicates. To guarantee no duplicates you must not retry, which risks loss. The way out is not better delivery but a consumer for which duplicates are harmless.",
      use: ["Designing any queue consumer", "Kafka, SQS, and every event pipeline"],
      trap: "Systems advertising 'exactly-once' mean it within their own boundary, usually via transactional offsets. The moment you call an external API from a consumer, you are back to at-least-once and you own the de-duplication.",
      r: ["Message Queue", "Idempotency", "Kafka"] },

    { t: "Backpressure",
      recall: "When a consumer cannot keep up, it must slow the producer down rather than silently buffer.",
      why: "An unbounded buffer converts an overload into an out-of-memory crash, and it does so after the queue has grown so large that everything in it is stale anyway. Bounded queues that block or reject make the overload visible immediately, while it is still fixable.",
      use: ["Streaming pipelines", "Job queues", "Any producer faster than its consumer",
            "Rate-limited API clients"],
      trap: "The default in most naive code is an unbounded queue, which looks fine until the day it is not. Set a maximum size and decide explicitly what happens when it is reached: block, drop oldest, or reject.",
      r: ["Queue", "Flow Control"] },

    { t: "The thundering herd",
      recall: "Everything retries at the same moment and the recovering service dies again.",
      why: "Clients that fail together retry together. A fixed retry delay synchronises them into a wave that arrives exactly when the service is trying to come back. Exponential backoff spreads them out; random jitter breaks the synchronisation that backoff alone leaves intact.",
      use: ["Any retry policy", "Cache expiry (stagger the TTLs)",
            "Scheduled jobs across many instances"],
      trap: "Backoff without jitter still synchronises — every client doubles at the same instants. Jitter is the part people omit, and it is the part that actually solves it.",
      code: { lang: "python", c: "delay = base * (2 ** attempt)\ntime.sleep(delay * random.uniform(0.5, 1.5))   # jitter" },
      r: ["Retry", "Exponential Backoff", "Cache Stampede"] },

    { t: "Circuit breaker",
      recall: "After enough failures, stop calling the failing service entirely for a while.",
      why: "Calling a dead service costs a timeout per request, and those timeouts consume your own threads and connections until you fail too. Opening the circuit fails fast, protects your own resources, and gives the other service room to recover instead of drowning it in traffic.",
      use: ["Any outbound dependency", "Microservice meshes", "Third-party API clients"],
      trap: "Without one, a single slow dependency propagates upward and takes down callers that do not even need it. This is cascading failure, and it is how one small outage becomes a full one.",
      r: ["Circuit Breaker", "Cascading Failure", "Timeout"] },

    { t: "Cache invalidation",
      recall: "There are two hard problems and this is the one with no general solution — so prefer expiry over cleverness.",
      why: "A TTL is simple, self-correcting and wrong for a bounded time. Explicit invalidation is exact and fails silently forever when you miss a write path. Most teams should choose the failure mode that heals itself.",
      use: ["Any read-heavy path", "CDN configuration", "Embedding and inference caches"],
      trap: "Cache stampede: a popular key expires and a thousand requests all miss and all recompute simultaneously. Fix with a lock so one recomputes, or by refreshing slightly before expiry.",
      r: ["Caching", "Cache Invalidation", "TTL"] },

    { t: "Horizontal versus vertical scaling",
      recall: "Vertical is a bigger machine. Horizontal is more machines — and it requires statelessness.",
      why: "Vertical is far simpler and should be the first answer; it has a ceiling and a single point of failure. Horizontal is unbounded but forces you to move state out of the process into a shared store, which is the actual work of scaling.",
      use: ["Any capacity conversation", "The first fork in a system design round"],
      trap: "Saying 'just add more servers' about a stateful service is a red flag. If a request must land on the same machine as the previous one, you have not scaled horizontally — you have sharded, and now you own rebalancing.",
      r: ["Horizontal Scaling", "Stateless", "Load Balancing"] }
  ]
});

TD.addLogicDeck("data", {
  id: "db-truths",
  name: "Database logic",
  lvl: "core",
  why: "Almost every backend performance problem and almost every data-loss story reduces to one of these.",
  cards: [

    { t: "ACID",
      recall: "Atomicity, Consistency, Isolation, Durability — all or nothing, valid state, no interference, survives a crash.",
      why: "It is the contract that lets you reason about a transaction as a single step despite concurrency and failure. Atomicity is why a half-completed transfer cannot exist; durability is why a committed write survives the power cut a millisecond later.",
      use: ["Anything touching money or inventory", "Justifying a relational database"],
      trap: "Isolation is the one with levels, and the default is usually not the strictest. Read Committed still permits non-repeatable reads; anomalies appear under load and never in testing.",
      r: ["ACID", "Transaction", "Isolation Level"] },

    { t: "What an index actually is",
      recall: "A sorted copy of one or more columns with pointers back to the rows — usually a B-tree.",
      why: "It converts a full scan, O(n), into a tree descent, O(log n). It is a real data structure on disk, which is why it costs storage and slows every write: each insert must update the table and every index on it.",
      use: ["Any column in a WHERE, JOIN or ORDER BY on a large table"],
      trap: "An index on (a, b) helps queries filtering on a, or on a and b — but not on b alone. Leftmost prefix. And wrapping a column in a function (`WHERE lower(email) = ...`) disables the index unless you built a matching functional index.",
      r: ["Database Index", "B-Tree", "Query Optimizer"] },

    { t: "The N+1 query problem",
      recall: "One query for the list, then one more per row. 101 round trips where 2 would do.",
      why: "ORMs make lazy loading invisible: iterating a collection and touching a related field issues a query per item. Each is fast, so nothing looks wrong in the logs, and the page takes two seconds because of 500 round trips of a millisecond each.",
      use: ["Reviewing any ORM code that loops over query results"],
      trap: "It never shows up with ten rows of test data. Test with realistic volume, or read the query log — the count is the signal, not the individual durations.",
      code: { lang: "python", c: "# N+1\nfor u in User.objects.all():\n    print(u.profile.city)      # one query each\n\n# fixed\nUser.objects.select_related(\"profile\")" },
      r: ["N+1 Query Problem", "ORM", "Eager Loading"] },

    { t: "Normalisation, and when to stop",
      recall: "Normalise so each fact lives in exactly one place. Denormalise when reads demand it, knowingly.",
      why: "Duplicated data drifts — two copies of an address become two different addresses. Normalisation makes updates safe. But it also means joins, and at scale a read-heavy system often duplicates deliberately to avoid them.",
      use: ["Schema design", "Explaining why a report query needs five joins"],
      trap: "Denormalising is a decision to maintain consistency in application code instead of the database. That is legitimate — but it must be a decision, with a written plan for keeping the copies in step, not an accident.",
      r: ["Normalisation", "Denormalization", "Join"] },

    { t: "SQL versus NoSQL, honestly",
      recall: "Relational unless you have a specific reason. The reason is usually scale or genuinely schemaless data.",
      why: "Relational gives transactions, joins, constraints and a query language that has outlived every alternative. Document stores buy horizontal scale and schema flexibility by giving up joins and often transactional guarantees across documents.",
      use: ["The default answer in a design round, with the reason attached"],
      trap: "'Schemaless' means the schema lives in your application code instead of the database — where nothing enforces it and every reader must handle every historical shape. Postgres with a JSONB column often gets you both.",
      r: ["SQL", "NoSQL", "Document Database"] }
  ]
});
