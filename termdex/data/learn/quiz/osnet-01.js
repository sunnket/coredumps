/* OS & Networking — question bank.

   Every question is one a working engineer would need to answer while
   debugging something real. Distractors are the things people actually
   believe, not filler. */

TD.addMCQ("osnet", "osbasics", [
  {
    "tag": "System call cost",
    "lvl": "core",
    "q": "A script prints 100,000 lines. Run in a terminal it takes 4 seconds; redirected to a file with `> out.txt` it takes 0.3 seconds. The code is unchanged. Why?",
    "o": [
      "Writing to a terminal requires rendering each character on screen",
      "Standard output is line-buffered to a terminal and block-buffered to a file, so the file version makes far fewer write() syscalls",
      "The file system is faster than the terminal driver",
      "Redirection enables compression of the output stream"
    ],
    "a": 1,
    "x": "Buffering mode is chosen by what stdout IS. To a terminal it is line-buffered — roughly one syscall per newline. To a file or pipe it is block-buffered at ~8 KB, so 100,000 lines become a few hundred syscalls. The work is identical; only the number of boundary crossings changed. This is also why a crashed program appears to have printed nothing: the buffer never flushed."
  },
  {
    "tag": "Why user space exists",
    "lvl": "core",
    "q": "Why can your program not write directly to a disk controller, instead of asking the kernel?",
    "o": [
      "Disk controllers use a proprietary protocol the kernel hides",
      "The CPU enforces two privilege modes in hardware; user-mode code is forbidden from touching devices, so one buggy program cannot corrupt the whole machine",
      "It would be slower than a system call",
      "Modern languages do not expose the necessary instructions"
    ],
    "a": 1,
    "x": "The restriction is enforced by the CPU itself, not by convention or by the language. This is why a bug in your program produces a segmentation fault — the kernel refuses the illegal access and kills that process — rather than taking down the machine. It also makes the kernel the single place where permissions can be checked."
  },
  {
    "tag": "Batching across a boundary",
    "lvl": "intermediate",
    "q": "Which optimisation shares its underlying principle with buffering file writes?",
    "o": [
      "Using a faster sorting algorithm",
      "Replacing 100 individual database queries with one query returning 100 rows",
      "Increasing the CPU clock speed",
      "Compressing data before storing it"
    ],
    "a": 1,
    "x": "Both reduce the number of crossings of an expensive boundary rather than the work done on either side. It is the same arithmetic behind batching HTTP requests, GPU kernel launches and network round trips: when a boundary costs a fixed amount per crossing, the number of crossings dominates once the per-item work is small."
  }
]);

TD.addMCQ("osnet", "process", [
  {
    "tag": "Process versus thread",
    "lvl": "core",
    "q": "A worker crashes with a segmentation fault. Other workers continue unaffected. What does this tell you about how they were created?",
    "o": [
      "They are threads within one process",
      "They are separate processes, each with an isolated address space",
      "They are coroutines on an event loop",
      "Nothing — a segfault never affects other workers"
    ],
    "a": 1,
    "x": "A segfault terminates the whole process, so every thread in it dies too. Survivors mean the workers were separate processes with isolated memory. This isolation is exactly why Gunicorn, Celery and similar tools use process workers rather than threads for untrusted or crash-prone work."
  },
  {
    "tag": "Choosing concurrency",
    "lvl": "intermediate",
    "q": "A Python service spends most of its time waiting on HTTP calls to other services. Which approach gives the largest throughput gain?",
    "o": [
      "ProcessPoolExecutor with one worker per core",
      "Threads or asyncio, because the GIL is released while waiting on I/O so waiting overlaps",
      "Rewriting the hot path in C",
      "Increasing the process priority with nice"
    ],
    "a": 1,
    "x": "The work is waiting, not computing. Python releases the GIL during blocking I/O, so threads genuinely overlap. Processes would also work but cost far more memory and startup time for no benefit. Asyncio is best of all at high connection counts, since it avoids per-connection thread stacks and context switching entirely."
  },
  {
    "tag": "Too much concurrency",
    "lvl": "advanced",
    "q": "Raising a thread pool from 20 to 200 threads makes throughput *worse* while CPU sits near 100%. Give the two most likely causes.",
    "o": [
      "The thread pool has a hard limit of 64 threads",
      "Context-switch thrashing on a small number of cores, and — if the work is CPU-bound — the GIL serialising it anyway",
      "Memory fragmentation in the allocator",
      "The operating system is throttling the process"
    ],
    "a": 1,
    "x": "200 runnable threads on a few cores means the scheduler spends its time switching rather than running, and each switch leaves the CPU caches cold. If the work is CPU-bound the GIL adds a second problem: threads take turns on one lock, so you have added overhead and gained no parallelism. Concurrency has an optimum, and it is usually far lower than people guess."
  },
  {
    "tag": "Load average",
    "lvl": "intermediate",
    "q": "A 4-core server shows a load average of 3.8. What does that indicate?",
    "o": [
      "The CPU is at 3.8% utilisation",
      "On average 3.8 processes wanted to run — near capacity for 4 cores, but not yet saturated",
      "3.8 GB of memory is in use",
      "The machine is heavily overloaded"
    ],
    "a": 1,
    "x": "Load average counts runnable (and on Linux, uninterruptible-sleep) processes, not a percentage. It must be compared to core count: 3.8 on 4 cores is busy but healthy; 3.8 on 1 core means everything is queuing. This is why quoting load average without saying how many cores the machine has is meaningless."
  }
]);

TD.addMCQ("osnet", "memory", [
  {
    "tag": "The silent death",
    "lvl": "intermediate",
    "q": "A long-running Python job vanishes after 40 minutes with no traceback, no exception, and a log that stops mid-line. What most likely happened, and where do you confirm it?",
    "o": [
      "An unhandled exception — check the application log",
      "The OOM killer sent SIGKILL, which cannot be caught, so no traceback exists — confirm with dmesg",
      "The process finished normally",
      "A network timeout terminated it"
    ],
    "a": 1,
    "x": "Any Python exception produces a traceback. SIGKILL does not: it cannot be caught or handled, so there is no traceback, no atexit handler and no final log line. `dmesg -T | grep -i 'killed process'` is the only record. The 'runs for a while then dies' shape also indicates a leak rather than a sizing error — a job simply too big fails in the first minute."
  },
  {
    "tag": "Reading free -h",
    "lvl": "intermediate",
    "q": "`free -h` on a healthy Linux server shows only 412 MB free out of 15 GB. Should you be worried?",
    "o": [
      "Yes — the machine is about to run out of memory",
      "No — Linux uses spare RAM as disk cache and reclaims it on demand; the column to read is 'available', not 'free'",
      "Yes — swap should be increased immediately",
      "Only if swap usage is also above zero"
    ],
    "a": 1,
    "x": "Unused RAM is wasted RAM, so Linux fills it with page cache. That cache is instantly reclaimable, which is why 'available' — which accounts for it — is the number that matters. A healthy busy server almost always shows very little 'free'. Panicking about that column is one of the most common misreadings in ops."
  },
  {
    "tag": "Thrashing",
    "lvl": "advanced",
    "q": "A server becomes unresponsive: CPU utilisation is low, disk I/O is at maximum, and even SSH takes minutes. What is happening?",
    "o": [
      "A CPU-bound infinite loop",
      "Thrashing — the working set exceeds RAM, so pages are swapped out and immediately needed again",
      "A network partition",
      "The disk is failing"
    ],
    "a": 1,
    "x": "Low CPU with saturated disk is the signature. The kernel is spending its time moving pages rather than running programs, and it will continue indefinitely rather than resolving. Confirm with sustained non-zero `si`/`so` in `vmstat`. Many servers disable swap entirely because an honest OOM kill is more useful than a machine that grinds forever."
  },
  {
    "tag": "Stack versus heap",
    "lvl": "core",
    "q": "Deep recursion produces `RecursionError` in Python rather than a segmentation fault. What is the limit protecting you from?",
    "o": [
      "Running out of heap memory",
      "Exhausting the fixed-size call stack, which in a language without the check would be a hard-to-debug segfault",
      "An infinite loop in the interpreter",
      "Integer overflow in the frame counter"
    ],
    "a": 1,
    "x": "Each call consumes a stack frame, and the stack is small and fixed (commonly 8 MB). Python's 1000-frame limit is a deliberate guard that turns an opaque crash into a clear, catchable error naming the cause. Raising it with `setrecursionlimit` removes the guard, not the underlying limit — go far enough and you get the segfault after all."
  }
]);

TD.addMCQ("osnet", "concurrency", [
  {
    "tag": "Identifying a race",
    "lvl": "intermediate",
    "q": "A multithreaded counter should reach 400,000 but produces a different, lower number on every run. What class of bug is this, and what is the mechanism?",
    "o": [
      "An off-by-one error in the loop bound",
      "A race condition — `counter += 1` is read, add, write, and two threads can interleave those steps and lose an update",
      "Integer overflow",
      "The threads are not being joined before printing"
    ],
    "a": 1,
    "x": "A *different* wrong answer each run is the signature of a race; a deterministic wrong answer points at ordinary logic. The mechanism is that `+=` is three operations, not one: both threads can read 41, both write 42, and one increment disappears. A lock around the critical section makes it indivisible."
  },
  {
    "tag": "Deadlock prevention",
    "lvl": "advanced",
    "q": "`transfer(a, b)` locks account a then b. Two concurrent calls, `transfer(x, y)` and `transfer(y, x)`, hang forever. Which of the four deadlock conditions does sorting the locks by object id break?",
    "o": [
      "Mutual exclusion",
      "Circular wait — with a consistent global order, no cycle of waiting can form",
      "Hold and wait",
      "No preemption"
    ],
    "a": 1,
    "x": "Ordered acquisition means every thread requests locks in the same sequence, so a cycle is impossible: whichever thread gets the lower-ordered lock first will always be able to progress. It is the standard fix because it requires no coordination between threads and no timeouts — each thread independently follows the same rule."
  },
  {
    "tag": "Check-then-act",
    "lvl": "advanced",
    "q": "A cache does `if key not in cache: cache[key] = expensive(key)`. Under concurrency, `expensive()` sometimes runs twice for the same key. What must a lock-based fix include?",
    "o": [
      "A lock around the entire function including the fast path",
      "A re-check of `key not in cache` INSIDE the lock, since another thread may have filled it while this one waited",
      "A longer timeout on the lock acquisition",
      "Making the cache a list instead of a dict"
    ],
    "a": 1,
    "x": "This is double-checked locking. Without the inner re-check, a thread that waited for the lock proceeds to compute a value another thread already stored — so the lock bought nothing. Omitting that re-check is the most common way this fix is written incorrectly. In Python, `functools.lru_cache` avoids the whole issue."
  },
  {
    "tag": "Debugging concurrency",
    "lvl": "intermediate",
    "q": "Adding a `sleep(0.1)` makes an intermittent concurrency bug disappear. Is it fixed?",
    "o": [
      "Yes — the sleep provides the necessary synchronisation",
      "No — it only changes the timing so the bad interleaving becomes rare; it will return under different load",
      "Yes, provided the sleep is longer than the critical section",
      "Only if the sleep is inside the lock"
    ],
    "a": 1,
    "x": "A sleep changes probability, not correctness. The interleaving is still possible and will reappear on faster hardware, under heavier load, or on a different core count — usually in production. The rule: if you cannot explain *why* a concurrency fix works, it has not worked."
  }
]);

TD.addMCQ("osnet", "netbasics", [
  {
    "tag": "Binding address",
    "lvl": "core",
    "q": "A service works on the developer's laptop but is unreachable when containerised, despite the port being published. What is the most likely cause?",
    "o": [
      "The container needs a static IP address",
      "The application binds 127.0.0.1, which accepts only connections originating inside the container — it must bind 0.0.0.0",
      "Docker requires ports above 1024",
      "The container is missing a default gateway"
    ],
    "a": 1,
    "x": "`127.0.0.1` is the loopback interface: connections must originate on the same machine, and inside a container that means the same container. Traffic arriving from outside is never accepted. Binding `0.0.0.0` listens on all interfaces. This is the single most common containerisation networking mistake."
  },
  {
    "tag": "CIDR arithmetic",
    "lvl": "intermediate",
    "q": "How many usable host addresses does `10.2.0.0/22` provide?",
    "o": [
      "256",
      "1022",
      "1024",
      "512"
    ],
    "a": 1,
    "x": "32 − 22 = 10 host bits, so 2^10 = 1024 total addresses, minus the network address (10.2.0.0) and the broadcast address (10.2.3.255) = 1022 usable. The range spans four /24 blocks. This arithmetic comes up constantly in cloud networking, where overlapping ranges prevent VPCs from being peered."
  },
  {
    "tag": "Privileged ports",
    "lvl": "core",
    "q": "Why do development servers conventionally run on ports like 8000 or 3000 rather than 80?",
    "o": [
      "Port 80 is reserved by the browser",
      "Ports below 1024 are privileged and require root to bind, which a development process should not have",
      "Port 80 only supports HTTP/1.0",
      "Higher ports are faster"
    ],
    "a": 1,
    "x": "The 0–1023 range requires elevated privilege on Unix-like systems, a convention from when those ports implied a trusted service. Running a dev server as root to bind 80 is a bad trade, so the process binds a high port and a reverse proxy or port mapping handles 80. A 'permission denied' on port 80 is a privilege problem, not a networking one."
  }
]);

TD.addMCQ("osnet", "transport", [
  {
    "tag": "Handshake cost",
    "lvl": "intermediate",
    "q": "Why is the first HTTPS request to a server noticeably slower than subsequent ones on the same connection?",
    "o": [
      "The server caches the response after the first request",
      "A cold connection pays DNS, the TCP handshake and the TLS handshake — several round trips — plus TCP slow start",
      "TLS keys are regenerated per request",
      "The browser must download the certificate chain each time"
    ],
    "a": 1,
    "x": "On a cold connection: DNS (often 1 RTT), TCP (1), TLS (1 on 1.3, 2 on 1.2), then the request itself. On a 100 ms link that is 400 ms before the first byte. TCP slow start compounds it by deliberately starting with a small congestion window. This is why connection pooling and keep-alive matter so much, and why a benchmark opening a fresh connection per request understates real throughput."
  },
  {
    "tag": "Choosing UDP",
    "lvl": "advanced",
    "q": "For 50,000 IoT sensors each sending one temperature reading per second, where occasional loss is acceptable, why is UDP the better choice?",
    "o": [
      "UDP guarantees lower latency per packet",
      "It avoids 50,000 sets of per-connection state on the server, and a retransmitted reading would arrive stale anyway",
      "UDP packets are smaller than TCP packets",
      "TCP cannot handle more than 10,000 concurrent connections"
    ],
    "a": 1,
    "x": "Two reasons compound: TCP would require per-connection kernel state, buffers and timers for 50,000 clients, and a retransmitted temperature is superseded by the next reading anyway. What you take on is no delivery guarantee (add a sequence number to detect gaps) and no congestion control (rate-limit at the sensor). If the readings were billing events, the answer would flip."
  },
  {
    "tag": "Head-of-line blocking",
    "lvl": "advanced",
    "q": "What problem does HTTP/3 solve by running over QUIC (UDP) instead of TCP?",
    "o": [
      "It removes the need for TLS encryption",
      "TCP-level head-of-line blocking — one lost packet stalls every multiplexed stream, whereas QUIC's per-stream reliability stalls only the affected one",
      "It eliminates DNS lookups",
      "It allows requests larger than 64 KB"
    ],
    "a": 1,
    "x": "HTTP/2 multiplexes many streams over one TCP connection, but TCP guarantees ordering for the whole connection — so a single lost packet blocks every stream behind it. QUIC reimplements reliability per stream in user space over UDP, so loss affects only its own stream. QUIC still encrypts everything; TLS 1.3 is built into it."
  },
  {
    "tag": "Timeouts",
    "lvl": "intermediate",
    "q": "Why does `requests.get(url)` without a timeout argument risk hanging a production service?",
    "o": [
      "The library retries indefinitely by default",
      "There is no default timeout, so a server that accepts a connection and then stops responding leaves the call waiting indefinitely",
      "DNS resolution has no timeout",
      "It opens a new connection per request"
    ],
    "a": 1,
    "x": "`requests` has no default timeout at all. If the peer accepts the connection and then goes silent, the call waits on TCP's own retransmission behaviour, which can exceed a minute — and in a request path that ties up a worker the whole time. Every outbound call in a service needs an explicit `timeout=(connect, read)`."
  }
]);

TD.addMCQ("osnet", "web", [
  {
    "tag": "Refused versus timed out",
    "lvl": "intermediate",
    "q": "What is the practical difference between `Connection refused` and `Connection timed out`?",
    "o": [
      "They are two names for the same failure",
      "Refused means a machine replied and nothing was listening on that port; timed out means nothing replied at all, usually a firewall dropping packets",
      "Refused is a DNS failure; timed out is a routing failure",
      "Refused applies to TCP, timed out to UDP"
    ],
    "a": 1,
    "x": "Refused means the host is up and actively sent a TCP RST — the service is down or on a different port. Timed out means silence, which typically indicates a firewall dropping rather than rejecting, or the wrong address entirely. They point at completely different problems, and confusing them sends you debugging the wrong layer."
  },
  {
    "tag": "401 versus 403",
    "lvl": "core",
    "q": "An API returns 403 rather than 401. What does that tell you?",
    "o": [
      "The credentials were missing or invalid",
      "The request was authenticated successfully, but this identity is not permitted to perform this action",
      "The endpoint does not exist",
      "The server is rate limiting"
    ],
    "a": 1,
    "x": "401 means 'I do not know who you are' — authentication failed or was absent, and a `WWW-Authenticate` header should accompany it. 403 means 'I know exactly who you are, and no' — authorisation failed. Retrying 403 with fresh credentials for the same identity will not help, which is why the distinction matters operationally."
  },
  {
    "tag": "Certificate failure in a container",
    "lvl": "advanced",
    "q": "TLS verification succeeds on a developer laptop but fails with `certificate verify failed` in a minimal container image. Most likely cause?",
    "o": [
      "The container clock is wrong",
      "The image ships without a CA certificate store, so no certificate chain can be verified",
      "The container cannot resolve DNS",
      "TLS requires a privileged container"
    ],
    "a": 1,
    "x": "Minimal base images (alpine, distroless, scratch) often contain no root CA bundle, so every TLS connection fails identically regardless of the site. The fix is one line: `apk add ca-certificates` or the apt equivalent. A wrong clock is the second candidate — it causes 'certificate not yet valid'. Disabling verification is never the fix: it discards the authentication guarantee entirely."
  },
  {
    "tag": "502 versus 500",
    "lvl": "intermediate",
    "q": "Your load balancer returns 502 Bad Gateway. Where should you look first?",
    "o": [
      "The client's request headers",
      "The upstream application behind the proxy — 502 means the proxy could not get a valid response from it",
      "The DNS configuration",
      "The TLS certificate"
    ],
    "a": 1,
    "x": "502 and 504 are proxy-generated: the proxy itself is healthy and reachable, but the thing behind it failed (502) or was too slow (504). So the investigation starts one hop further in — application logs, whether the upstream process is running, whether it is bound to the expected port. A 500 by contrast usually comes from the application itself."
  }
]);

TD.addMCQ("osnet", "netops", [
  {
    "tag": "Reading traceroute",
    "lvl": "intermediate",
    "q": "A traceroute shows `* * *` at hop 3, but hops 4 through 9 respond normally and reach the destination. What does hop 3 mean?",
    "o": [
      "The path is broken at hop 3 and traffic is being rerouted",
      "That router is configured not to send ICMP replies — traffic passes through it fine, as the later hops prove",
      "Hop 3 is overloaded",
      "There is packet loss of exactly 100% at that hop"
    ],
    "a": 1,
    "x": "Many routers deprioritise or disable generating ICMP time-exceeded messages, which is what traceroute relies on. Later hops replying is proof that traffic traverses hop 3 successfully. Only a run of stars continuing all the way to the destination indicates a real break. Misreading this is the classic traceroute mistake."
  },
  {
    "tag": "Constant versus variable latency",
    "lvl": "advanced",
    "q": "5% of requests to a third-party API fail after exactly 5.0 seconds, every time. What does the exactness suggest?",
    "o": [
      "Network congestion during peak periods",
      "A configured timeout firing — real congestion produces variable durations, a constant one points at a fixed limit somewhere",
      "The remote server is rate limiting",
      "Packet loss on the path"
    ],
    "a": 1,
    "x": "Congestion is variable by nature. A repeated, exact duration is something with a configured limit. Five seconds is the default Linux DNS resolver timeout, so a leading hypothesis is an unhealthy first nameserver in `/etc/resolv.conf`: a fraction of lookups hit it, wait the full timeout, then fall back. DNS is the most under-suspected cause of intermittent latency because it happens before the application logs anything."
  },
  {
    "tag": "tcpdump flags",
    "lvl": "advanced",
    "q": "In a tcpdump capture you see repeated `[S]` packets to a host but never a `[S.]` in reply. What does that indicate?",
    "o": [
      "The server is refusing the connection",
      "SYN packets are being dropped silently — typically a firewall, since an active refusal would return [R]",
      "The connection succeeded and data is flowing",
      "DNS resolution failed"
    ],
    "a": 1,
    "x": "A SYN with no SYN-ACK and no RST means silence: something is dropping packets rather than rejecting them, which is characteristic of a firewall configured to DROP rather than REJECT. An active refusal (nothing listening) returns `[R]` — a reset — and surfaces as 'connection refused' immediately rather than as a timeout."
  },
  {
    "tag": "Comparing resolvers",
    "lvl": "intermediate",
    "q": "Why is `dig @8.8.8.8 example.com` a useful diagnostic when a hostname seems to resolve incorrectly?",
    "o": [
      "Google's resolver is more accurate than others",
      "It bypasses your configured resolver, so a difference in the answer localises the problem to your resolver or its cache",
      "It forces a TCP query instead of UDP",
      "It ignores the TTL"
    ],
    "a": 1,
    "x": "Querying a known-good public resolver directly isolates the variable. If the public answer is correct and yours is not, the fault is your local resolver, its cache, or an override in `/etc/hosts` — not the domain's DNS records. This single comparison settles a large share of 'DNS is broken' arguments in minutes."
  }
]);

TD.addMCQ("osnet", "storage", [
  {
    "tag": "Descriptor leak",
    "lvl": "advanced",
    "q": "A service runs correctly for six hours, then every request fails with `Errno 24: Too many open files`. Restarting fixes it for another six hours. What is the cause and the correct fix?",
    "o": [
      "The ulimit is too low; raise it to 65536 and the problem is solved",
      "A descriptor leak — something opens a file, socket or connection per request without closing it; find and close it",
      "The disk is full",
      "Too many concurrent requests are arriving"
    ],
    "a": 1,
    "x": "A failure that arrives on a schedule and clears on restart is an accumulation, not a capacity limit. Raising ulimit buys hours and hides the bug. Confirm by watching `ls /proc/PID/fd | wc -l` climb, then identify the type with `lsof`. The usual culprits are HTTP clients without a reused Session, and pooled database connections never returned."
  },
  {
    "tag": "Why `with` exists",
    "lvl": "core",
    "q": "Why is `with open(path) as f:` preferred over `f = open(path)` even in a short function that returns immediately?",
    "o": [
      "It is faster",
      "It closes the file on every exit path including exceptions, whereas relying on reference counting is implementation-specific and fails under load",
      "It allows reading larger files",
      "It automatically decodes the file's encoding"
    ],
    "a": 1,
    "x": "CPython's reference counting usually closes an orphaned file quickly, which is worse than never closing it: the code works in testing and leaks in production when an exception keeps the frame alive, or on an implementation without refcounting such as PyPy. `with` guarantees the close, and the same reasoning applies to sockets, connections and locks."
  },
  {
    "tag": "Threads versus async",
    "lvl": "advanced",
    "q": "You need to make 5,000 concurrent HTTP requests. Why is asyncio a better fit than a 5,000-thread pool?",
    "o": [
      "Asyncio makes each individual request faster",
      "5,000 threads means 5,000 stacks and heavy context switching; an event loop handles them on one thread because almost all are idle at any instant",
      "Threads cannot perform HTTP requests",
      "Asyncio bypasses the GIL entirely"
    ],
    "a": 1,
    "x": "Neither approach speeds up an individual request — both remove waiting in series. The difference is cost: each thread reserves stack space and adds scheduler pressure, while an event loop uses one kernel call (`epoll`) to watch thousands of descriptors. The trade-off is that one blocking call inside an async function stalls the whole loop."
  },
  {
    "tag": "Page cache",
    "lvl": "intermediate",
    "q": "A script that reads a large file takes 8 seconds on the first run and 0.9 seconds on the second, with no code changes. Why?",
    "o": [
      "The interpreter cached the compiled bytecode",
      "The kernel page cache is serving the file from RAM instead of the disk on the second run",
      "The file system defragmented the file",
      "The disk switched to a faster mode"
    ],
    "a": 1,
    "x": "Linux keeps recently read file contents in otherwise-unused RAM, so the second read never reaches the disk. This is why any I/O benchmark must be run more than once and the results labelled cold or warm, and why `free -h` shows little 'free' memory on a healthy machine — that RAM is working as cache."
  }
]);
