(function (TD) {
  "use strict";
  TD.depth = (TD.depth || []).concat([
    {
      slug: "smoke-test",
      why: {
        before: "Teams deployed new builds to production or staging and waited for end users to discover whether the application was completely broken or unable to connect to its database.",
        problem: "Catastrophic deployment failures—such as missing environment variables, bad database connection strings, or fatal boot syntax errors—went unnoticed until customer complaints rolled in.",
        shift: "A smoke test executes a rapid, non-exhaustive suite of critical health checks immediately following deployment to verify that core services can boot, respond, and perform basic operations before accepting full traffic."
      },
      num: {
        t: "Smoke Test Validation Levels, Execution Speed, and Failure Actions",
        h: ["Validation Tier", "Targeted Subsystem", "Execution Window", "Pass / Fail Condition", "Automated Action on Failure"],
        r: [
          ["Liveness / Boot Probe", "HTTP Server & Process Runtime", "< 2 seconds", "HTTP 200 on /healthz endpoint", "Orchestrator restarts container immediately"],
          ["Backing Service Connectivity", "Postgres DB & Redis Cache", "< 5 seconds", "Successful ping query (SELECT 1;)", "Marks pod unready; blocks ingress traffic"],
          ["Critical Business Path", "Authentication & Primary API", "< 15 seconds", "Synthetic login returns valid JWT token", "Halts canary rollout; triggers instant rollback"],
          ["Static Asset & CDN Reachability", "CSS, JS bundles, HTML entry point", "< 5 seconds", "HTTP 200 with matching Content-Length", "Invalidates CDN edge cache or alerts on-call"],
          ["Asynchronous Queue Worker", "RabbitMQ / Kafka Worker", "< 10 seconds", "Consumes and acks synthetic canary event", "Halts worker deployment to prevent queue lockup"]
        ],
        n: "Originating in hardware testing—where a newly assembled circuit board was powered on to literally see if it emitted smoke—smoke testing in modern software represents an essential Continuous Delivery verification gate. Unlike comprehensive end-to-end regression suites that execute for hours, a smoke test is mathematically bounded: $T_{\\text{smoke}} < 60\\text{ seconds}$. It evaluates a minimal set of non-negotiable operational invariants: $I = \\{\\text{HTTP 200}, \\text{DB Connected}, \\text{Auth Operable}, \\text{Storage Accessible}\\}$. If any invariant $i \\in I$ evaluates to false, the deployment pipeline immediately triggers an automated rollback, shifts traffic away from canary instances, and pages the on-call engineer, preventing wide customer exposure."
      },
      miss: [
        {
          w: "A smoke test is a full end-to-end test suite checking every single button and edge case in the application.",
          r: "Smoke tests are strictly lightweight and shallow; they test only whether the application boots and core critical paths function, leaving exhaustive regression testing to separate pipelines."
        },
        {
          w: "Passing a smoke test proves that the deployment is 100% free of bugs and ready for all users.",
          r: "Smoke tests only verify that the application isn't catastrophically broken on boot; subtle calculation bugs, race conditions, and UI styling regressions require deeper testing layers."
        },
        {
          w: "Smoke tests are only useful when run manually by human QA testers clicking around.",
          r: "Production smoke tests are fully automated within CI/CD pipelines (via curl, k6, or Cypress scripts), executing autonomously within seconds of artifact deployment."
        },
        {
          w: "Smoke tests should insert permanent test records and seed mutations into the production database.",
          r: "Production smoke tests should be read-only or operate on isolated synthetic test tenants with automated cleanup to avoid corrupting analytics or billing records."
        }
      ],
      trade: {
        buys: [
          "Instant detection of catastrophic build, configuration, and infrastructure failures in under a minute.",
          "Enables automated, confident rollbacks before broken software reaches mainstream customers.",
          "Drastic reduction in false starts: gates long-running test suites until basic functionality is verified.",
          "Verifies real-world production environmental wiring (DNS, TLS certs, firewalls, secrets) that staging misses."
        ],
        costs: [
          "Maintenance burden of maintaining dedicated synthetic test accounts and health check endpoints.",
          "Risk of false alarms in CI/CD pipelines if smoke test timeouts are tuned too aggressively.",
          "Operational care required to ensure production smoke tests do not skew business analytics.",
          "Limited depth: provides zero coverage for complex business domain calculations or edge cases."
        ],
        avoid: [
          "Letting smoke tests bloat into a 20-minute comprehensive regression suite.",
          "Testing only the local process port without routing through the real production load balancer and CDN.",
          "Ignoring a smoke test failure and manually bypassing deployment gates to push code anyway.",
          "Failing to clean up synthetic customer records created during automated live smoke tests."
        ]
      }
    },
    {
      slug: "seed-data",
      why: {
        before: "Developers spun up local or staging databases that were completely empty, forcing every engineer to manually create mock accounts, products, and records through the UI just to test a feature.",
        problem: "Empty databases made local development frustratingly slow, manual testing was inconsistent across developers, and foreign-key relational constraints made manual data creation an agonizing chore.",
        shift: "Seed data provides declarative, automated scripts that populate development, staging, and demo environments with realistic, consistent baseline records and referential relationships."
      },
      num: {
        t: "Database Seeding Paradigms, Volumetrics, and Referential Handling",
        h: ["Seeding Paradigm", "Generation Mechanism", "Data Volume", "Execution Speed", "Ideal Target Environment"],
        r: [
          ["Static Seed Manifests", "Raw SQL or static JSON/CSV dumps", "Small (10-100 rows)", "Instantaneous (< 1 second)", "System lookups (roles, countries, currencies, statuses)"],
          ["Programmatic Factories", "Faker-driven factories (FactoryBot, Prisma Seed)", "Moderate (100-10,000 rows)", "Fast (2-10 seconds)", "Local developer environments and feature testing"],
          ["Production-Scale Synthetic", "Procedural generator algorithms", "Massive (100k - 10M rows)", "Minutes (Bulk COPY / Batched inserts)", "Staging performance benchmarking and load testing"],
          ["Sanitized Prod Clone", "Production dump stripped of PII via hashing", "Realistic (100% prod volume)", "Hours (Extraction, masking, restoration)", "Staging environment pre-release validation"],
          ["Idempotent Upsert Seed", "INSERT ... ON CONFLICT DO UPDATE", "Small to Moderate", "Fast (< 5 seconds)", "Continuous delivery database migration hooks"]
        ],
        n: "Database seeding populates a datastore with a deterministic initial state $S_0$. In modern data engineering, seeding operates across two categories: system-critical metadata (e.g., countries, permission roles) and development test fixtures (e.g., users, transactions). Determinism is achieved by initializing pseudo-random generators with a fixed integer seed: $\\text{PRNG}(\\text{seed} = 42)$, guaranteeing identical generated data across all developer laptops. To satisfy relational database referential integrity, seeding scripts must resolve foreign key dependencies via topological sorting of the table dependency graph $G = (V, E)$, inserting root entities before dependent leaf tables, while utilizing idempotent `ON CONFLICT DO UPDATE` clauses to allow repeated script execution without primary key collisions."
      },
      miss: [
        {
          w: "Database seeds and database migrations are two different words for the exact same thing.",
          r: "Migrations modify the database schema structure (tables, columns, indexes); seeds populate tables with actual row data values."
        },
        {
          w: "Seed scripts should be run on live production databases during every deployment.",
          r: "Production seeding is strictly reserved for immutable system lookup tables (e.g., ISO country codes); running developer mock seeds on production will corrupt real customer datasets."
        },
        {
          w: "Seed data scripts can only create completely random, meaningless junk text strings.",
          r: "Modern seed generators utilize contextual generators (e.g., Faker, Chance.js) paired with realistic schemas to produce realistic emails, geographic addresses, and semantic transactions."
        },
        {
          w: "Seeding an empty database can be done in any random table order.",
          r: "Relational foreign-key constraints mandate strict topological ordering: inserting an order before its parent user or product exists triggers immediate foreign key constraint violations."
        }
      ],
      trade: {
        buys: [
          "Zero-friction onboarding: new engineers run a single command to get a fully populated, functioning local app.",
          "Consistent local testing: all developers test features against an identical, standardized baseline dataset.",
          "Enables realistic UI and pagination design by populating lists with hundreds of diverse sample records.",
          "Critical for automated end-to-end and staging environments that require pre-existing accounts and states."
        ],
        costs: [
          "Maintenance debt: seed scripts break whenever database schemas, validations, or column types change.",
          "Slow initial setup times if developers design seed scripts with unoptimized, serial single-row SQL inserts.",
          "Risk of data pollution if developers run seed commands against the wrong database environment.",
          "Can create false security if seed data fails to replicate the messy, corrupted edge cases present in live production data."
        ],
        avoid: [
          "Running development seed scripts containing mock accounts against a production database.",
          "Writing non-idempotent seed scripts that crash with duplicate key errors when executed a second time.",
          "Inserting thousands of rows one-by-one with single INSERT statements instead of batch operations.",
          "Hardcoding real customer personal information or API secrets inside publicly accessible seed files."
        ]
      }
    },
    {
      slug: "migration",
      why: {
        before: "Developers altered production database schemas by manually typing raw SQL `ALTER TABLE` statements directly into database command lines without version control or rollback tracking.",
        problem: "Manual SQL updates caused catastrophic database outages: missing columns broke running code, schema states diverged across environments, and reversing an error required emergency manual surgery.",
        shift: "Database migrations treat database schema evolution as version-controlled, auditable, and automated software code, applying incremental transitions (up and down) deterministically across environments."
      },
      num: {
        t: "Database Migration Patterns, Locking Mechanisms, and Risk Mitigation",
        h: ["Schema Alteration Type", "Postgres Lock Acquired", "Table Rewrite Required", "Production Risk Level", "Zero-Downtime Safe Pattern"],
        r: [
          ["Add Column (Nullable / Default)", "ACCESS EXCLUSIVE (instant metadata update)", "No (Postgres 11+)", "Low", "Direct ADD COLUMN with constant default"],
          ["Add Index on Large Table", "ACCESS EXCLUSIVE (blocks reads and writes)", "Reads entire table", "Catastrophic if unconstrained", "CREATE INDEX CONCURRENTLY (avoids exclusive locks)"],
          ["Drop Column in Active Use", "ACCESS EXCLUSIVE", "No", "Severe (Crashes active v1 code)", "Expand-Contract pattern: stop writing -> stop reading -> drop"],
          ["Rename Column", "ACCESS EXCLUSIVE", "No", "Severe (Breaks running queries)", "Add new column -> dual-write -> backfill -> read new -> drop old"],
          ["Change Column Data Type", "ACCESS EXCLUSIVE", "Yes (Full table lock & rewrite)", "Very High (Downtime on large tables)", "Create new column -> backfill in batches -> swap references"]
        ],
        n: "Database migrations formalize the state transition of a database schema from version $V_{k-1}$ to $V_k$ as an atomic directed transformation: $S_{k} = \\Delta_k(S_{k-1})$. Modern migration tools (Flyway, Liquibase, Prisma, Rails Migrations) maintain an internal metadata table (e.g., `schema_migrations`) storing the executed migration hashes and timestamps. In high-throughput distributed systems, executing naive DDL acquires heavy table-level locks (e.g., PostgreSQL `ACCESS EXCLUSIVE`), blocking all concurrent queries and causing connection pool exhaustion. Zero-downtime migrations therefore mandate the Expand-Contract (Parallel Run) pattern: breaking a change into multi-phase non-breaking deployments (e.g., adding a nullable column, dual-writing, asynchronously backfilling historical rows, switching reads, and dropping the old column in a subsequent release)."
      },
      miss: [
        {
          w: "You should rename a database column in production using a simple ALTER TABLE RENAME statement.",
          r: "Renaming a column instantly breaks running application instances that still expect the old name; zero-downtime systems add a new column, dual-write, migrate data, and switch reads over multiple releases."
        },
        {
          w: "All database migrations automatically execute safely inside an atomic database transaction.",
          r: "Certain database systems (like MySQL) do not support transactional DDL; in Postgres, operations like CREATE INDEX CONCURRENTLY cannot run inside a transaction block, requiring distinct safety strategies."
        },
        {
          w: "You can freely edit and rewrite historical migration files that have already been run in production.",
          r: "Once a migration has run in production, its file is immutable; changes to the schema must always be applied by creating a brand new forward migration file."
        },
        {
          w: "Running database migrations automatically on application pod boot in Kubernetes is best practice.",
          r: "Running migrations on pod startup causes race conditions when multiple pods scale simultaneously; migrations must run as dedicated, isolated one-shot pre-deployment jobs (e.g., Kubernetes Job)."
        }
      ],
      trade: {
        buys: [
          "Complete version control, repeatability, and auditability for database schema modifications.",
          "Guarantees that database structures remain synchronized across local, staging, and production environments.",
          "Enables automated continuous delivery pipelines to safely upgrade databases as part of releases.",
          "Provides structured rollback scripts (down migrations) to revert faulty schema changes when possible."
        ],
        costs: [
          "Requires strict discipline to implement multi-phase Expand-Contract migrations for zero-downtime releases.",
          "Risk of catastrophic production table locking if developers write naive DDL on large tables.",
          "Complex merge conflicts when two developers create migrations with the same timestamp or sequence number.",
          "Long-running data backfills can overwhelm database replication lag and CPU if not batched properly."
        ],
        avoid: [
          "Adding un-indexed foreign key columns to massive multi-million-row production tables.",
          "Running CREATE INDEX without the CONCURRENTLY keyword on active production PostgreSQL databases.",
          "Modifying existing, already-deployed migration files instead of adding a new forward migration.",
          "Triggering database migrations concurrently from multiple auto-scaling application containers."
        ]
      }
    },
    {
      slug: "array-vs-linked-list",
      why: {
        before: "Engineers viewed arrays and linked lists merely as interchangeable sequential collections of elements, choosing between them based purely on theoretical Big-O insertion complexity without understanding hardware memory architecture.",
        problem: "Relying on textbook theory led to terrible real-world performance: linked lists caused rampant CPU cache misses and massive memory pointer overhead, running slower than arrays even for insertions.",
        shift: "Understanding hardware memory architecture reveals that contiguous array storage maximizes CPU cache-line prefetching, making arrays superior for almost all general-purpose computing despite linked lists' theoretical $O(1)$ insertion advantages."
      },
      num: {
        t: "Array vs Linked List Architectural, Algorithmic, and Hardware Comparison",
        h: ["Dimension / Operation", "Dynamic Array (Vector)", "Singly Linked List", "Doubly Linked List", "Hardware Reality & Mechanism"],
        r: [
          ["Memory Layout", "Contiguous block in memory", "Scattered heap allocations", "Scattered heap allocations", "Arrays exploit 64-byte CPU cache lines (L1/L2/L3 spatial locality)"],
          ["Random Access (Index $i$)", "$O(1)$ constant time", "$O(N)$ linear traversal", "$O(N)$ linear traversal", "Array calculates memory offset $\\text{Base} + i \\times \\text{sizeof}(T)$ in 1 CPU cycle"],
          ["Insert / Delete at Head", "$O(N)$ (requires shifting elements)", "$O(1)$ pointer update", "$O(1)$ pointer update", "Linked list updates head pointer; array shifts memory buffer"],
          ["Insert / Delete at Tail", "$O(1)$ amortized", "$O(N)$ (or $O(1)$ with tail pointer)", "$O(1)$ pointer update", "Array doubles capacity at saturation; linked list updates tail pointer"],
          ["Memory Overhead per Element", "Near zero (amortized buffer capacity)", "1 pointer (8 bytes on 64-bit)", "2 pointers (16 bytes on 64-bit)", "Linked lists waste 100-200% extra RAM on 64-bit pointers alone"]
        ],
        n: "The fundamental divide between arrays and linked lists is defined by memory hierarchy and CPU caching. An array allocates contiguous memory, allowing element lookup via simple pointer arithmetic: $\\text{Addr}(A[i]) = \\text{Base} + i \\times S$, executing in $O(1)$ time. When the CPU accesses $A[i]$, the memory controller loads a full $64$-byte cache line into L1 cache, prefetching adjacent elements in $O(1)$ cycles. Conversely, a linked list consists of non-contiguous heap nodes linked via pointers. Traversing a linked list requires pointer chasing: each node dereference introduces an L1/L2 cache miss, forcing an access to main memory ($~50-100\\text{ ns}$ latency versus $<1\\text{ ns}$ for L1 cache). Consequently, despite the theoretical $O(1)$ node insertion time of linked lists, modern hardware almost universally executes dynamic array operations (such as C++ `std::vector`) orders of magnitude faster in practice."
      },
      miss: [
        {
          w: "Linked lists are faster than arrays for inserting elements because linked list insertion is $O(1)$ while array insertion is $O(N)$.",
          r: "To insert an element at a specific position in a linked list, you must first traverse to that position in $O(N)$ time; furthermore, CPU cache misses make pointer traversal dramatically slower than shifting contiguous array memory."
        },
        {
          w: "Arrays always have a fixed, immutable size and cannot grow or shrink dynamically.",
          r: "Dynamic arrays (Python lists, JavaScript arrays, Java ArrayList, C++ vector) dynamically grow: when full, they allocate a buffer $2\\times$ larger, copy elements, and achieve $O(1)$ amortized append time."
        },
        {
          w: "Linked lists use less memory than arrays because arrays pre-allocate unused capacity.",
          r: "Linked lists suffer massive pointer overhead: on 64-bit machines, storing a 4-byte integer in a doubly-linked list requires 16 extra bytes of pointers plus heap allocator metadata, wasting far more RAM than array buffers."
        },
        {
          w: "You should use linked lists whenever you need a FIFO queue.",
          r: "A circular ring buffer implemented on a contiguous array is dramatically faster, more cache-friendly, and memory-efficient for FIFO queues than a pointer-based linked list."
        }
      ],
      trade: {
        buys: [
          "Arrays: blistering fast iteration, random index access ($O(1)$), and optimal CPU cache line prefetching.",
          "Arrays: minimal memory overhead with zero per-element pointer metadata.",
          "Linked Lists: truly deterministic $O(1)$ head insertion/deletion without resizing latency spikes.",
          "Linked Lists: pointer-based structural splicing without copying blocks of memory."
        ],
        costs: [
          "Arrays: expensive $O(N)$ resizing copies and element shifting when inserting at beginning or middle.",
          "Arrays: occasional memory waste from pre-allocated amortized buffer capacity.",
          "Linked Lists: catastrophic CPU cache misses due to scattered heap node allocations.",
          "Linked Lists: massive 64-bit pointer overhead and heap fragmentation on thousands of small node allocations."
        ],
        avoid: [
          "Using a linked list for general-purpose collection storage where fast sequential iteration is needed.",
          "Iterating over a linked list using an index-based for loop (e.g., list.get(i)), degrading traversal to $O(N^2)$.",
          "Assuming asymptotic Big-O bounds on paper reflect real-world execution speed without considering CPU caches.",
          "Ignoring dynamic array capacity pre-allocation when inserting millions of known elements."
        ]
      }
    },
    {
      slug: "stack-and-queue",
      why: {
        before: "Programs managed ordered execution and buffer workflows using arbitrary list insertions and deletions, resulting in disorganized data access, race conditions, and lack of structural invariants.",
        problem: "Unstructured list mutations made it impossible to enforce strict processing orders: tasks were processed out-of-order, backtracking algorithms corrupted intermediate states, and buffer overflows were common.",
        shift: "Stacks (LIFO) and Queues (FIFO) enforce strict linear access disciplines, providing deterministic, constrained operational boundaries for memory execution, backtracking, parsing, and asynchronous message buffering."
      },
      num: {
        t: "Stack and Queue Primitives, Operational Mechanics, and Asymptotics",
        h: ["Data Structure", "Access Principle", "Primary Operations", "Time Complexity", "Canonical Systems Application"],
        r: [
          ["Stack", "LIFO (Last-In, First-Out)", "Push(x), Pop(), Peek()", "$O(1)$ constant time", "CPU call stack, undo/redo buffers, syntax parsing, DFS traversal"],
          ["FIFO Queue", "FIFO (First-In, First-Out)", "Enqueue(x), Dequeue(), Front()", "$O(1)$ constant time", "OS process scheduling, print queues, BFS traversal, request buffers"],
          ["Double-Ended Queue (Deque)", "Bidirectional LIFO/FIFO", "PushFront/Back, PopFront/Back", "$O(1)$ constant time", "Sliding window algorithms, work-stealing thread schedulers (Go)"],
          ["Priority Queue", "Priority-ordered extraction", "Insert(x), ExtractMax/Min()", "$O(\\log N)$ via Binary Heap", "Dijkstra's shortest path, A* pathfinding, event-driven simulation"],
          ["Circular Ring Buffer", "Bounded FIFO buffer", "Enqueue(x), Dequeue() on fixed array", "$O(1)$ zero allocation", "Audio processing, network socket driver I/O, ring telemetry"]
        ],
        n: "Stacks and queues represent fundamental abstract data types (ADTs) that govern temporal data flow. A stack enforces Last-In, First-Out (LIFO): the most recently pushed element is the first popped, operating as the mathematical model for recursive computation and pushdown automata. Every program call stack allocates stack frames containing return pointers, parameters, and local variables in strict LIFO order. Conversely, a queue enforces First-In, First-Out (FIFO): elements are inserted at the tail and dequeued from the head. In high-performance systems, FIFO queues are implemented via circular ring buffers over contiguous arrays: head and tail pointers advance modulo the buffer capacity: $\\text{tail} = (\\text{tail} + 1) \\pmod C$. This achieves zero-allocation $O(1)$ operations while avoiding the memory fragmentation of linked lists."
      },
      miss: [
        {
          w: "Implementing a queue by calling array.shift() in JavaScript or list.pop(0) in Python is completely fine.",
          r: "Removing the first element of a standard dynamic array forces the runtime to shift all remaining $N-1$ elements in memory, degrading an intended $O(1)$ dequeue into an $O(N)$ operation."
        },
        {
          w: "The call stack in an operating system can grow infinitely as long as your computer has hard drive space.",
          r: "Process call stacks have fixed, limited memory allocations (typically 1-8 MB); unbounded recursion exhausts this reserved memory, triggering a fatal StackOverflowError."
        },
        {
          w: "Stacks and queues can only store simple primitive values like numbers or strings.",
          r: "Stacks and queues are generic abstract collections; they can store complex domain objects, functions, closures, execution contexts, and distributed network messages."
        },
        {
          w: "Priority Queues maintain elements in a fully sorted array at all times.",
          r: "Priority queues typically utilize binary heaps (min-heap or max-heap), maintaining partial heap-order invariants to achieve $O(\\log N)$ insertion and extraction without sorting the entire array."
        }
      ],
      trade: {
        buys: [
          "Strict structural invariants: eliminates accidental random-access bugs by restricting mutation boundaries.",
          "Guaranteed $O(1)$ time complexity for all primary operations (push, pop, enqueue, dequeue).",
          "Natural conceptual alignment with real-world workflows: processing order, pipelines, and undo stacks.",
          "Zero memory allocation overhead when backed by pre-allocated circular array buffers."
        ],
        costs: [
          "Complete loss of arbitrary random access: inspecting or modifying the $k$-th element requires emptying the structure.",
          "Risk of Stack Overflow in recursion if recursion depth is not bounded or converted to iteration.",
          "Unbounded queue hazard: message queues without capacity limits can exhaust server memory under traffic spikes.",
          "Complexity of managing circular pointer wraps and concurrency locking in multi-threaded queues."
        ],
        avoid: [
          "Using standard dynamic array unshift/shift operations for queues without specialized Deque data structures.",
          "Allowing asynchronous message queues to grow without enforcing backpressure or maximum capacity limits.",
          "Writing deep recursive functions without verifying that recursion depth will not exceed call stack limits.",
          "Popping from an empty stack or queue without verifying non-empty invariants, causing crash errors."
        ]
      }
    },
    {
      slug: "graph-traversal",
      why: {
        before: "Engineers tried to inspect and search interconnected network relationships using nested loops or linear array scans, failing as soon as relationships contained cycles or arbitrary branching.",
        problem: "Linear scans cannot navigate networks: code entered infinite loops on cyclic references, missed unreachable clusters, and could not calculate shortest paths between entities.",
        shift: "Graph traversal algorithms—primarily Breadth-First Search (BFS) and Depth-First Search (DFS)—provide systematic, provably complete mechanisms to explore every vertex and edge in a graph."
      },
      num: {
        t: "Graph Traversal Algorithms, State Mechanisms, and Topological Bounds",
        h: ["Algorithm", "Underlying Frontier Structure", "Time Complexity", "Space Complexity", "Canonical Use Case"],
        r: [
          ["Breadth-First Search (BFS)", "FIFO Queue", "$O(|V| + |E|)$", "$O(|V|)$ (width of graph)", "Shortest path on unweighted graphs, peer-to-peer broadcast, level-order traversal"],
          ["Depth-First Search (DFS)", "LIFO Stack / Call Stack", "$O(|V| + |E|)$", "$O(|V|)$ (depth of graph)", "Cycle detection, topological sorting, maze solving, connected components"],
          ["Dijkstra's Algorithm", "Priority Queue (Min-Heap)", "$O((|V| + |E|) \\log |V|)$", "$O(|V|)$", "Shortest path on non-negative weighted graphs (routing, GPS maps)"],
          ["A* Search Algorithm", "Priority Queue + Heuristic $h(n)$", "$O(|E|)$ best; $O(b^d)$ worst", "$O(|V|)$", "Pathfinding in video games, robotics navigation, AI planning"],
          ["Tarjan's / Kosaraju's", "DFS Stack + Discovery Low-Links", "$O(|V| + |E|)$", "$O(|V|)$", "Finding Strongly Connected Components (SCCs) in directed networks"]
        ],
        n: "Graph traversal explores a graph $G = (V, E)$ comprising vertices $V$ and edges $E$. To prevent infinite loops caused by cycles, traversals maintain a visited set $S$ of explored vertices, classifying states using the tri-color abstraction: White (unvisited), Gray (currently exploring in active frontier), and Black (fully explored). Breadth-First Search (BFS) explores radially outward level-by-level using a FIFO queue; on unweighted graphs, BFS mathematically guarantees finding the shortest path $\\delta(s, v)$ from source $s$ to vertex $v$. Depth-First Search (DFS) plunges down paths to dead ends before backtracking using a LIFO stack. In a Directed Acyclic Graph (DAG), post-order DFS traversal yields the reverse of a valid Topological Sort, fundamental to build systems resolving compilation dependency orders."
      },
      miss: [
        {
          w: "Breadth-First Search (BFS) can find the shortest path on any graph, including graphs with weighted edges.",
          r: "Standard BFS only guarantees shortest paths on unweighted graphs (or graphs with uniform edge weights); weighted graphs require Dijkstra's algorithm or the Bellman-Ford algorithm."
        },
        {
          w: "Graph traversal algorithms can omit the 'visited' tracking set if the graph looks simple.",
          r: "Omitting the visited set causes instant infinite loops and call stack crashes the moment the graph contains a single cycle or bidirectional undirected edge."
        },
        {
          w: "Depth-First Search (DFS) can only be written using recursion and cannot be implemented iteratively.",
          r: "Recursive DFS simply uses the implicit runtime call stack; DFS can be implemented iteratively using an explicit in-memory Stack data structure, avoiding stack overflow errors on deep graphs."
        },
        {
          w: "A tree traversal and a graph traversal are completely different algorithms.",
          r: "A tree is merely a connected, acyclic directed graph; tree traversals (pre-order, in-order, level-order) are simply specialized forms of DFS and BFS where cycle detection is unnecessary."
        }
      ],
      trade: {
        buys: [
          "Guaranteed exploration of all reachable nodes in complex, interconnected relationship networks.",
          "Shortest path discovery: BFS provides mathematically optimal paths on unweighted topologies.",
          "Cycle detection and dependency ordering: DFS enables topological sorting for build dependency graphs.",
          "Standard linear asymptotic efficiency: $O(|V| + |E|)$ traverses massive graphs in near-optimal time."
        ],
        costs: [
          "Memory overhead: BFS stores the entire graph frontier in memory, which can balloon to gigabytes on high-degree graphs.",
          "Stack overflow risk when executing recursive DFS on deeply nested graph topologies.",
          "Complexity of maintaining visited state sets when processing distributed, dynamic, or streaming graphs.",
          "Inefficiency of naive traversals on massive graphs where targeted heuristics (A*) are needed."
        ],
        avoid: [
          "Running recursive DFS on deep or untrusted graphs without converting to an iterative stack.",
          "Forgetting to mark a vertex as visited immediately when enqueueing in BFS, causing duplicate queue processing.",
          "Using BFS on weighted road networks where Dijkstra or A* is required.",
          "Assuming graph traversal order is deterministic when iterating over unordered hash set neighbors."
        ]
      }
    },
    {
      slug: "process-vs-thread",
      why: {
        before: "Early operating systems executed a single monolithic task at a time; when a program blocked on slow disk I/O, the entire computer froze completely until the transfer finished.",
        problem: "Single-tasking systems could not utilize multi-core processors, suffered from total system lockups when one application crashed, and wasted over 90% of available CPU computational cycles.",
        shift: "Modern operating systems separate concurrency into processes (isolated memory address spaces for safety) and threads (lightweight execution units sharing process memory for high-performance concurrency)."
      },
      num: {
        t: "Process vs Thread Architectural, Memory, and Scheduling Comparison",
        h: ["Dimension / Primitive", "Operating System Process", "OS Kernel Thread", "User-Space Green Thread", "Underlying Hardware / Kernel Mechanism"],
        r: [
          ["Address Space & Memory", "Completely isolated virtual address space", "Shared heap, code, data; private stack", "Shared process memory space", "Process has unique page tables; threads share MMU mappings"],
          ["Communication Mechanism (IPC)", "Inter-Process Communication (Pipes, Sockets, Shared Memory)", "Direct memory read/write (Heap variables)", "In-memory channels or cooperative queues", "Process IPC requires OS kernel context switch; threads use shared pointers"],
          ["Context Switch Overhead", "Heavy (~1,000 - 10,000 ns)", "Moderate (~100 - 1,000 ns)", "Ultra-light (~10 - 50 ns)", "Process switch forces CPU TLB cache flush; thread switch only swaps registers"],
          ["Crash / Fault Isolation", "Total isolation; process crash does not affect peers", "Zero isolation; segfault crashes entire process", "Zero isolation; unhandled panic kills runtime", "OS kernel memory protection (ring 0) enforces process boundaries"],
          ["Creation / Teardown Cost", "High (fork/exec allocations)", "Low to Moderate (pthread_create)", "Virtually zero (Goroutines / Erlang actors)", "Process duplicates file descriptor tables and memory pages (Copy-on-Write)"]
        ],
        n: "The process is the operating system's fundamental unit of resource allocation, while the thread is the fundamental unit of CPU execution scheduling. An OS process owns a dedicated Virtual Memory space managed by page tables in the Memory Management Unit (MMU), file descriptors, security tokens, and environment variables. When switching between processes, the CPU kernel must update the CR3 control register, invalidating the Translation Lookaside Buffer (TLB) and incurring heavy cache-miss penalties ($O(10^3)\\text{ ns}$). In contrast, all threads within a process share the identical page table, heap, global variables, and file descriptors, possessing only a private Program Counter (PC), register set, and stack ($~1-8\\text{ MB}$). While thread context switches are orders of magnitude faster, shared memory exposes programs to data races, requiring explicit synchronization primitives (mutexes, semaphores, atomic CAS instructions)."
      },
      miss: [
        {
          w: "Threads run faster than processes because threads do not use the real CPU hardware cores.",
          r: "Kernel threads map directly to physical CPU hardware cores; threads are faster to create and switch because they share virtual memory, avoiding expensive TLB cache flushes."
        },
        {
          w: "Spawning more threads always makes a program run faster.",
          r: "Excessive threads cause thread thrashing: the CPU spends more time switching thread contexts than executing useful work; optimal worker thread counts typically match physical CPU core counts."
        },
        {
          w: "If one thread in a multi-threaded application suffers a segmentation fault or crash, the other threads continue running fine.",
          r: "Because all threads share the exact same process memory space, an unhandled memory fault or panic in any single thread terminates the entire host process and all peer threads."
        },
        {
          w: "Inter-Process Communication (IPC) is always worse and slower than using shared-memory multi-threading.",
          r: "Multi-process architectures (like Google Chrome tabs or PostgreSQL backends) provide complete crash isolation, memory leak containment, and bulletproof security sandboxing that multi-threading cannot achieve."
        }
      ],
      trade: {
        buys: [
          "Processes: total memory isolation, security boundaries, and crash resilience (one crash cannot kill peers).",
          "Processes: zero risk of data races or memory corruption across independent programs.",
          "Threads: blazing fast context switching and minimal memory footprint compared to full processes.",
          "Threads: effortless high-throughput data sharing via shared heap pointers without serialization overhead."
        ],
        costs: [
          "Processes: expensive context switching latency and heavy memory consumption per instance.",
          "Processes: complex IPC serialization boilerplate (JSON, Protobuf, shared memory segments).",
          "Threads: catastrophic race conditions, deadlocks, and memory corruption without disciplined locking.",
          "Threads: lack of fault containment—a fatal memory bug in one thread kills the entire application."
        ],
        avoid: [
          "Spawning thousands of unmanaged OS kernel threads instead of using a worker pool or green threads.",
          "Sharing mutable state across threads without mutex locks or atomic synchronization primitives.",
          "Using multi-threading for untrusted code execution where process sandboxing is required.",
          "Assuming multi-threaded code is faster without measuring lock contention and context switch overhead."
        ]
      }
    },
    {
      slug: "solid-principles",
      why: {
        before: "Developers designed object-oriented applications as tightly coupled, monolithic classes where modifying a single requirement forced cascading code rewrites across dozens of unrelated files.",
        problem: "Software was brittle, rigid, and fragile: code could not be tested in isolation, adding a feature broke existing functionality, and components were completely impossible to reuse.",
        shift: "The SOLID principles establish five foundational architectural rules for object-oriented software design, ensuring systems remain decoupled, maintainable, testable, and extensible over time."
      },
      num: {
        t: "The SOLID Principles, Architectural Invariants, and Refactoring Mechanics",
        h: ["Principle", "Core Invariant / Rule", "Direct Architectural Metric", "Primary Code Smell Solved", "Canonical Design Pattern"],
        r: [
          ["Single Responsibility (SRP)", "A module should have one, and only one, reason to change", "High cohesion; low coupling", "'God Class' doing auth, DB queries, and email sending", "Facade / Service decomposition"],
          ["Open / Closed (OCP)", "Open for extension, closed for modification", "Additive changes without altering existing source", "Sprawling if-else / switch statements on type enums", "Strategy / Factory / Polymorphism"],
          ["Liskov Substitution (LSP)", "Subtypes must be substitutable for base types without breaking invariants", "Behavioral subtyping; precondition/postcondition rules", "Derived class throwing UnsupportedOperationException", "Composition over Inheritance"],
          ["Interface Segregation (ISP)", "Clients should not be forced to depend on interfaces they do not use", "Lean, fine-grained role interfaces", "Bloated 'Fat Interfaces' forcing dummy empty methods", "Role Interfaces (e.g., Reader, Writer)"],
          ["Dependency Inversion (DIP)", "High-level modules should depend on abstractions, not concretions", "Decoupling business logic from framework/database", "Direct new DatabaseConnection() instantiations", "Dependency Injection / Hexagonal Architecture"]
        ],
        n: "Codified by Robert C. Martin (Uncle Bob), the SOLID acronym establishes the foundational guidelines of maintainable software architecture. Mathematically, Liskov Substitution (LSP, formulated by Barbara Liskov) requires behavioral subtyping: if $S$ is a subtype of $T$, then for any program property $\\phi(x)$ provable about objects $x \\in T$, $\\phi(y)$ must hold for all $y \\in S$. Formally, preconditions cannot be strengthened in a subtype ($\\text{Pre}_S \\Leftarrow \\text{Pre}_T$), and postconditions cannot be weakened ($\\text{Post}_S \\Rightarrow \\text{Post}_T$). Dependency Inversion (DIP) inverts architectural gravity: rather than high-level business domain rules importing low-level SQL database drivers, both layers depend on an abstract interface: $\\text{Domain} \\to \\mathcal{I} \\leftarrow \\text{DBDriver}$, enabling effortless mocking, unit testing, and backing service substitution."
      },
      miss: [
        {
          w: "Single Responsibility Principle (SRP) means that every function or class should only do exactly one single line of code.",
          r: "SRP states that a class should have only one reason to change, meaning it should be responsible to a single actor or business domain stakeholder; it is about cohesion, not micro-line counts."
        },
        {
          w: "Following Open/Closed Principle (OCP) means you are legally forbidden from ever editing an existing file.",
          r: "OCP encourages designing systems where new features can be introduced by writing new classes or plugins rather than modifying battle-tested existing logic; bug fixes still edit existing code."
        },
        {
          w: "SOLID principles only apply to traditional class-based languages like Java or C++.",
          r: "SOLID concepts apply universally across all programming paradigms: TypeScript interfaces, Go interfaces, and functional closures all rely heavily on SRP, interface segregation, and dependency inversion."
        },
        {
          w: "Every single class in a codebase must strictly follow every SOLID principle from day one.",
          r: "Premature abstraction and dogmatic adherence to SOLID on trivial scripts creates over-engineered, unreadable architectures with dozens of pointless one-method interfaces."
        }
      ],
      trade: {
        buys: [
          "Maximum testability: decoupling classes via interfaces allows effortless mocking and isolated unit tests.",
          "High maintainability: changes to one business feature are localized to one class, preventing cascading breaks.",
          "Extensibility: add new payment methods, databases, or notification channels by adding classes without altering core logic.",
          "Reduced cognitive load: small, cohesive classes are vastly easier for new engineers to understand."
        ],
        costs: [
          "File sprawl: decomposing monolithic classes increases the total number of files and interfaces in a repository.",
          "Initial design overhead: requires thoughtful planning and architectural design before typing code.",
          "Risk of over-engineering if applied dogmatically to simple CRUD operations or throwaway scripts.",
          "Indirection: tracking down concrete implementations can require navigating through interface layers."
        ],
        avoid: [
          "Creating massive 'God Objects' that handle database access, HTTP routing, business logic, and email sending.",
          "Violating Liskov Substitution by creating a subclass that throws an error when a parent method is called.",
          "Designing fat interfaces with 30 methods, forcing consumers to implement methods they do not need.",
          "Hardcoding concrete database or HTTP client instances directly inside core domain logic classes."
        ]
      }
    }
  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
