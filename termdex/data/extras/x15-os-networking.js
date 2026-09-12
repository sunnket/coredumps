/* Real-world examples and step-by-step flows — OS & Networking. */
TD.attach("os-networking", {

"Operating System": {
 ex: { h: "The referee nobody watches",
       b: "Your browser, your editor and a background updater all believe they own the machine. The OS maintains that illusion — slicing the CPU, handing each process a private view of memory, and standing between every program and the hardware it must not be trusted with directly." },
 fl: { t: "What happens when a program wants something",
       s: ["A process runs in user mode, with no hardware privileges",
           { s: "It cannot touch the disk, the network or another process's memory", n: "Deliberately — that restriction is the whole safety model." },
           { q: "Does it need a privileged operation?",
             y: "It makes a system call — a controlled entry into the kernel",
             n: "It computes in its own address space, uninterrupted until its slice ends" },
           { s: "The kernel validates, performs the work, and returns", n: "Switching back to user mode on the way out." },
           "Almost every performance question comes down to how often you cross that boundary"] }
},

"Kernel": {
 ex: { h: "The part where a bug takes down the machine",
       b: "Kernel code runs with full hardware privileges, so a null dereference there is a kernel panic rather than a crashed application. That is why drivers are the most common cause of operating system crashes, and why moving things out of the kernel is a recurring design theme." },
 fl: { t: "The privilege boundary",
       s: ["The CPU has separate privileged and unprivileged modes",
           { s: "User code runs unprivileged and cannot execute certain instructions", n: "Enforced by hardware, not by convention." },
           { q: "How does control reach the kernel?",
             y: "A system call, an interrupt, or a fault — all controlled entry points",
             n: "There is no other route in, which is what makes the boundary meaningful" },
           { s: "The kernel manages processes, memory, filesystems and devices", n: "Everything shared has to be arbitrated somewhere." },
           "Monolithic kernels put drivers inside; microkernels push them out for isolation at a speed cost"] }
},

"System Call": {
 ex: { h: "The expensive question",
       b: "Reading a file one byte at a time makes a syscall per byte — thousands of context switches to read a kilobyte. Buffered I/O reads 4KB at once and serves the rest from memory. The same total work, a hundredfold difference, and the reason buffering exists at all." },
 fl: { t: "What one syscall costs",
       s: ["The program places arguments and a call number in registers",
           { s: "Then executes a trap instruction", n: "Which switches the CPU into kernel mode." },
           { s: "The kernel validates every argument", n: "It must assume user pointers are hostile." },
           { q: "Does the operation block — a disk read, a socket receive?",
             y: "The process is descheduled and another runs; the cost is far more than the call itself",
             n: "It returns quickly, back in user mode" },
           "Use `strace` to count them — surprising syscall volume is a common performance discovery"] }
},

"Context Switch": {
 ex: { h: "The tax on doing several things at once",
       b: "Save every register, swap the memory mappings, load the next task's state — a few microseconds, plus the invisible cost of a CPU cache now full of the wrong data. Spawning a thousand threads for a thousand connections spends most of the CPU on switching rather than working." },
 fl: { t: "What gets saved and restored",
       s: ["A timer interrupt or a blocking call enters the kernel",
           { s: "The current task's registers and program counter are saved", n: "So it can resume as though nothing happened." },
           { s: "The scheduler picks the next runnable task", n: "By priority, fairness and how long it has waited." },
           { q: "Is it a different process, or another thread of the same one?",
             y: "Different process — the page tables change and the TLB is flushed; considerably more expensive",
             n: "Same process — threads share the address space, so it is cheaper" },
           "Async I/O exists precisely to serve many connections without a thread and a switch for each"] }
},

"Virtual Memory": {
 ex: { h: "Every process thinks it owns the machine",
       b: "Two programs can both use address `0x400000` and never collide, because each address is translated through per-process page tables. It is why one program cannot read another's memory, why a process can use more memory than you have RAM, and why a wild pointer segfaults instead of corrupting the kernel." },
 fl: { t: "Turning a virtual address into a real one",
       s: ["The program uses an address in its own space",
           { s: "The MMU translates it through the page tables", n: "In hardware, on every single memory access." },
           { s: "Recent translations are cached in the TLB", n: "A TLB miss is a measurable performance cost." },
           { q: "Is the page currently in physical RAM?",
             y: "Access proceeds at full speed",
             n: "A page fault: the kernel loads it from disk, or kills the process if the address is invalid" },
           "Overcommit means allocation can succeed and later fail — which is what the OOM killer is for"] }
},

"Paging": {
 ex: { h: "Memory in fixed-size tiles",
       b: "4KB pages are the unit everything is managed in — mapped, protected, swapped and shared. Their fixed size makes allocation simple and eliminates external fragmentation, at the cost of wasting a little inside the last page of every allocation." },
 fl: { t: "Where a page can be",
       s: ["Memory is divided into fixed-size pages",
           { s: "Physical memory is divided into frames of the same size", n: "Any page can go in any frame — the mapping is arbitrary." },
           { q: "Is physical memory under pressure?",
             y: "Evict a page — write it to swap if modified, discard it if it is clean and file-backed",
             n: "Keep it resident" },
           { s: "Shared libraries map the same physical page into many processes", n: "One copy of libc in RAM, mapped everywhere." },
           "Huge pages reduce TLB pressure for large working sets — databases often enable them"] }
},

"Page Fault": {
 ex: { h: "Not necessarily an error",
       b: "Most page faults are routine: the page is on disk, or is being allocated lazily on first touch. It only becomes a problem when it happens constantly — thrashing, where the system spends all its time swapping and almost none running your code." },
 fl: { t: "Handling a fault",
       s: ["A program accesses an address whose page is not resident",
           { s: "The CPU traps into the kernel", n: "The instruction is paused mid-execution." },
           { q: "Is the address actually valid for this process?",
             y: "Load the page — from disk, from swap, or allocate a zeroed one — and resume the instruction",
             n: "Segmentation fault: the process is killed" },
           { s: "A minor fault needs no disk access", n: "The page is already in memory, just not mapped — cheap." },
           "High major-fault rates mean you are short of RAM — adding CPU will not help"] }
},

"File System": {
 ex: { h: "Turning a flat array of blocks into a tree",
       b: "A disk is a numbered sequence of blocks with no notion of names or folders. The filesystem invents directories, permissions and timestamps on top — and its hardest job is staying consistent when power is lost halfway through a write, which is what journalling is for." },
 fl: { t: "Opening and reading a file",
       s: ["Resolve the path, one component at a time",
           { s: "Each directory is a file mapping names to inode numbers", n: "Permissions are checked at every level." },
           { s: "Read the inode for metadata and block locations", n: "The name is not in the inode — it is in the directory." },
           { q: "Is the data already in the page cache?",
             y: "Serve it from RAM — most reads never touch the disk",
             n: "Read the blocks, and cache them for next time" },
           "`fsync` is what actually forces data to durable storage — a successful `write` does not"] }
},

"Inode": {
 ex: { h: "The file is not its name",
       b: "An inode holds size, permissions, timestamps and block pointers — everything about a file except its name, which lives in a directory entry. That separation is why hard links work, why deleting an open file frees no space until it is closed, and why you can run out of inodes on a disk with free space." },
 fl: { t: "What deleting a file does",
       s: ["`unlink` removes the name from the directory",
           { s: "The inode's link count drops by one", n: "The data is untouched at this point." },
           { q: "Is the link count now zero and no process has it open?",
             y: "The inode and its blocks are freed",
             n: "It survives — an open file with no name still occupies disk" },
           { s: "Hard links are additional names for the same inode", n: "No original, no copy — just names." },
           "`df` shows free space; `df -i` shows free inodes — millions of tiny files exhaust the second first"] }
},

"File Permissions": {
 ex: { h: "Three groups, three bits, one common mistake",
       b: "`chmod 777` makes a problem go away and opens the file to every user and process on the machine. The permission that catches people is on directories, where the execute bit means *may traverse into* — a directory you can read but not execute lists names you cannot open." },
 fl: { t: "How access is decided",
       s: ["The kernel compares the process's user against the file's",
           { q: "Is it the owner?",
             y: "The owner bits apply — and only those, even if group bits are broader",
             n: "Group match uses group bits; otherwise the other bits apply" },
           { s: "On directories, `x` means traverse and `r` means list", n: "They are genuinely separate capabilities." },
           { s: "Every parent directory must be traversable", n: "A perfect file inside a locked directory is unreachable." },
           "`umask` decides default permissions on creation — which is why new files are not 666"] }
},

"Linux": {
 ex: { h: "The kernel your cloud bill is really for",
       b: "Almost every server, every container and every Android phone runs it. Its most consequential design decision is the stable syscall interface: a binary compiled in 2005 still runs, which is precisely why the ecosystem could grow the way it did." },
 fl: { t: "What happens at boot",
       s: ["Firmware loads a bootloader, which loads the kernel",
           { s: "The kernel initialises hardware and mounts the root filesystem", n: "Drivers and initramfs do the awkward parts." },
           { s: "It starts PID 1 — usually systemd", n: "Every other process descends from it." },
           { q: "Something is not running?",
             y: "`systemctl status`, then `journalctl -u` — the unit's own log",
             n: "The system reaches its target state and waits" },
           { s: "Everything is a file, including devices and kernel state", n: "`/proc` and `/sys` are readable interfaces to the kernel." },
           "Containers are Linux features — namespaces and cgroups — not a separate technology"] }
},

"Shell": {
 ex: { h: "The interface that composes everything else",
       b: "`grep`, `sort`, `uniq` and a pipe replace a script you were about to write. Its power is composition; its danger is that an unquoted variable containing a space silently becomes two arguments, and the same expression that works interactively destroys something in a cron job." },
 fl: { t: "What the shell does with a line",
       s: ["Expand variables, globs and command substitutions",
           { s: "This happens before the command ever runs", n: "`rm $file` with a space in the name deletes two things." },
           { s: "Split into words, then find and execute the command", n: "Quoting is what prevents the splitting." },
           { q: "Is there a pipe?",
             y: "Both commands run concurrently, connected by a buffer — not one after the other",
             n: "Run it and wait for the exit status" },
           { s: "Exit status 0 is success", n: "`&&` and `||` chain on it." },
           "In scripts, always `set -euo pipefail` and quote every variable"] }
},

"Daemon": {
 ex: { h: "The process with no terminal",
       b: "`sshd`, `nginx`, `cron` — running in the background, started at boot, surviving logout. Modern service managers supervise them rather than requiring the old double-fork ritual, which means a crashed daemon restarts automatically and its output goes to the journal instead of nowhere." },
 fl: { t: "Running a service properly",
       s: ["Define a unit describing how to start it",
           { s: "Let the supervisor daemonise it", n: "Modern services run in the foreground and are backgrounded by systemd." },
           { s: "Log to stdout and stderr", n: "The supervisor captures it — no log file handling in the service." },
           { q: "Does it crash?",
             y: "Restart policy handles it, with backoff to avoid a hot loop",
             n: "It runs until stopped" },
           { s: "Handle SIGTERM for graceful shutdown", n: "Finish in-flight work, then exit — or requests get dropped on every restart." },
           "Run it as an unprivileged user with only the capabilities it needs"] }
},

"Signal": {
 ex: { h: "Ctrl-C, explained",
       b: "That is SIGINT, and a well-behaved program catches it to clean up before exiting. SIGTERM is the polite stop that every deployment system sends; SIGKILL cannot be caught at all, which is why a process ignoring SIGTERM gets killed hard after the grace period." },
 fl: { t: "Shutting down gracefully",
       s: ["The supervisor sends SIGTERM",
           { s: "The process's handler runs, interrupting whatever it was doing", n: "Handlers must be async-signal-safe — very few functions are." },
           { q: "Did the process exit within the grace period?",
             y: "Clean shutdown — in-flight requests completed",
             n: "SIGKILL arrives: immediate termination, no cleanup, no chance to flush" },
           { s: "Set a flag in the handler and act on it in the main loop", n: "Doing real work inside a handler is how deadlocks happen." },
           "In containers your process is PID 1 and does not get default signal handling — handle SIGTERM explicitly"] }
},

"CPU": {
 ex: { h: "Fast at one thing at a time",
       b: "A few very sophisticated cores with deep pipelines, branch prediction and large caches — optimised to finish one sequential task as quickly as possible. That is the opposite of a GPU's design, and it is why the right processor depends entirely on the shape of the work." },
 fl: { t: "Why your code is slower than the clock speed suggests",
       s: ["The CPU fetches, decodes and executes instructions",
           { s: "Several at once, out of order, speculating past branches", n: "The clock speed is a poor predictor of throughput." },
           { q: "Does the code wait on memory?",
             y: "A cache miss costs hundreds of cycles — memory layout matters more than instruction count",
             n: "Unpredictable branches cost a pipeline flush" },
           { s: "More cores do not help serial code", n: "Amdahl's law: the sequential fraction sets the ceiling." },
           "Profile before optimising — the bottleneck is almost never where intuition puts it"] }
},

"CPU Cache": {
 ex: { h: "Why iterating rows beats iterating columns",
       b: "The same loop over the same array, traversed in the other order, can run five times slower — because memory is fetched in 64-byte cache lines and one order uses every byte while the other uses eight and throws the rest away. Nothing about the algorithm changed." },
 fl: { t: "How a read is served",
       s: ["The core requests an address",
           { s: "L1 is a few cycles; L2 tens; L3 more; RAM hundreds", n: "Each level is larger and slower than the one above." },
           { q: "Is the line already cached?",
             y: "Served immediately",
             n: "Fetch the whole 64-byte line from further out — including the neighbours you did not ask for" },
           { s: "Sequential access gets prefetched automatically", n: "Random access defeats the prefetcher entirely." },
           { s: "Two cores writing to the same line contend", n: "False sharing: correct code, terrible performance." },
           "Prefer contiguous arrays over pointer-chasing structures where performance matters"] }
},

"GPU": {
 ex: { h: "Thousands of slow cores beat four fast ones — sometimes",
       b: "Applying the same operation to a million pixels or a million matrix elements is exactly what a GPU is built for. Branchy, sequential, dependency-heavy code is exactly what it is bad at — and moving data across the PCIe bus can cost more than the computation saves." },
 fl: { t: "Deciding whether to use one",
       s: ["Look at the shape of the work",
           { q: "Is the same operation applied independently to a lot of data?",
             y: "It maps well — matrix multiplies, convolutions, image processing",
             n: "Divergent branches serialise the warp; a CPU will be faster" },
           { s: "Data must be transferred to device memory first", n: "For small workloads that transfer dominates the total time." },
           { s: "Keep it resident across operations", n: "Round-tripping to host memory between steps wastes the advantage." },
           "Watch memory capacity — a model that does not fit is a hard wall, not a slowdown"] }
},

"OSI Model": {
 ex: { h: "A teaching model, not an implementation",
       b: "Nothing on the internet is built to seven layers — TCP/IP has four. Its lasting value is vocabulary: *a layer 7 problem* versus *a layer 3 problem* immediately locates a fault, and load balancers are still sold by which layer they operate at." },
 fl: { t: "Using it to locate a fault",
       s: ["Start at the bottom and work up",
           { s: "Layer 1–2: is the link up, is there a MAC address?", n: "Cables and switches." },
           { q: "Can you ping the IP?",
             y: "Layer 3 is fine — move to layer 4: is the port open?",
             n: "Routing, addressing or firewall — a network layer problem" },
           { s: "Layer 4 works but the app fails: it is layer 7", n: "TLS, HTTP, authentication, application logic." },
           { s: "Layers 5 and 6 barely exist in practice", n: "TLS is usually described as sitting between 4 and 7." },
           "Bottom-up diagnosis converges fast because each layer depends on the one below"] }
},

"TCP/IP Model": {
 ex: { h: "The four layers that actually shipped",
       b: "Link, Internet, Transport, Application — and the reason it won is the narrow waist at IP. Everything below can be Ethernet or Wi-Fi or fibre; everything above can be HTTP or SSH or a game protocol; IP is the single agreement in the middle that everything shares." },
 fl: { t: "A packet's journey",
       s: ["The application produces data — an HTTP request",
           { s: "Transport adds a TCP header with ports and sequence numbers", n: "Handling reliability and ordering." },
           { s: "Internet adds an IP header with source and destination addresses", n: "This is what routers read." },
           { s: "Link adds a frame header for the next hop only", n: "Rewritten at every hop; the IP header is not." },
           { q: "Arriving at the destination?",
             y: "Each layer strips its header and passes upward",
             n: "The router replaces the link header and forwards it on" }] }
},

"IP Address": {
 ex: { h: "Where, not who",
       b: "An IP identifies a network interface's position in the network, which is why it changes when you move between Wi-Fi and mobile data. IPv4 ran out of addresses years ago — NAT is the workaround, IPv6 is the fix, and both are in use simultaneously." },
 fl: { t: "Getting a packet to an address",
       s: ["The host compares the destination against its own subnet",
           { q: "Is it on the local subnet?",
             y: "ARP for the MAC address and deliver it directly",
             n: "Send it to the default gateway" },
           { s: "Each router forwards toward the destination", n: "Consulting its routing table, hop by hop." },
           { s: "Private ranges — 10.x, 172.16–31.x, 192.168.x — are not routable on the internet", n: "Which is why NAT exists." },
           "An IP is not an identity: NAT, proxies and CGNAT put thousands of people behind one address"] }
},

"Subnet": {
 ex: { h: "Drawing a line inside the address space",
       b: "Splitting a network limits which machines can reach each other directly, which is both a performance measure — broadcast traffic stays local — and a security one. Putting your database in a subnet with no route to the internet is the cheapest control available." },
 fl: { t: "Deciding if two hosts are local",
       s: ["Apply the subnet mask to both addresses",
           { s: "The masked portion is the network; the rest is the host", n: "`/24` means the first 24 bits are the network." },
           { q: "Do the network portions match?",
             y: "Same subnet — deliver directly over the link layer",
             n: "Different subnet — send it to the router" },
           { s: "Smaller subnets mean fewer hosts and more isolation", n: "A `/24` gives 254 usable addresses; a `/30` gives two." },
           "Plan ranges with room to grow — renumbering a live network is genuinely painful"] }
},

"CIDR": {
 ex: { h: "The notation that saved IPv4",
       b: "Classful addressing handed out fixed blocks — an organisation needing 300 addresses got 65,536. CIDR made the prefix length arbitrary, so `/23` gives 510. It also made routing tables aggregatable, which is what kept the internet's core routers viable." },
 fl: { t: "Reading a CIDR block",
       s: ["`10.0.0.0/16` — the number is how many bits are fixed",
           { s: "16 fixed bits leaves 16 for hosts: 65,536 addresses", n: "Each extra bit halves the block." },
           { q: "Need to split it up?",
             y: "Increase the prefix — `/16` becomes two `/17`s, four `/18`s, and so on",
             n: "The first address is the network, the last is broadcast — both unusable" },
           { s: "`/32` is a single host; `0.0.0.0/0` is everything", n: "The latter appears in every default route and every over-broad firewall rule." },
           "Overlapping ranges between networks you later need to connect is a recurring, avoidable mistake"] }
},

"Port": {
 ex: { h: "The flat number on the building",
       b: "The IP gets the packet to the machine; the port gets it to the right process. One server runs a web server on 443, SSH on 22 and a database on 5432 simultaneously — and *connection refused* almost always means nothing is listening on that port." },
 fl: { t: "Diagnosing a connection failure",
       s: ["A client connects to an address and port",
           { q: "Connection refused, immediately?",
             y: "The host is reachable and nothing is listening — check the service is running and bound correctly",
             n: "A timeout instead means a firewall is dropping it silently" },
           { s: "Check what is listening with `ss -tlnp`", n: "Bound to 127.0.0.1 means local only — a very common cause." },
           { s: "Ports below 1024 need privilege to bind", n: "Which is why containers often use 8080 internally." },
           "Each outbound connection consumes an ephemeral port — exhaustion is a real production failure"] }
},

"TCP": {
 ex: { h: "Reliability you did not have to write",
       b: "Packets get lost, duplicated and reordered on any real network. TCP hides all of it — retransmitting, reassembling, and slowing down when the path is congested — which is why almost everything uses it, and why a lossy link makes it feel slow rather than broken." },
 fl: { t: "The life of a connection",
       s: ["Three-way handshake: SYN, SYN-ACK, ACK",
           { s: "One full round trip before any data moves", n: "Which is why connection reuse matters so much." },
           { s: "Data is sent in segments with sequence numbers", n: "The receiver acknowledges; unacknowledged data is retransmitted." },
           { q: "Are packets being lost?",
             y: "Congestion control cuts the sending rate — TCP treats loss as congestion",
             n: "The window grows and throughput increases" },
           { s: "Closing takes four packets and leaves sockets in TIME_WAIT", n: "Which is why a busy server accumulates them." },
           "Head-of-line blocking: one lost packet stalls everything behind it, and it is why QUIC exists"] }
},

"UDP": {
 ex: { h: "Fire and forget, deliberately",
       b: "In a video call, a packet that arrives late is worthless — you want the next frame, not last second's. UDP does not retransmit, does not reorder and does not slow down, which is exactly right for real-time media, DNS lookups and games." },
 fl: { t: "When it is the right choice",
       s: ["The application sends a datagram",
           { q: "Is late data worse than missing data?",
             y: "UDP — media, telemetry and gaming all prefer a gap to a stall",
             n: "TCP, unless you intend to build reliability yourself" },
           { s: "Anything you need — ordering, retries, congestion control — is yours to implement", n: "QUIC is exactly that, done well, over UDP." },
           { s: "One request, one response, no handshake", n: "Which is why DNS uses it." },
           "Keep datagrams under the path MTU — fragmented UDP is frequently dropped"] }
},

"QUIC": {
 ex: { h: "TCP's problems, fixed by starting over on UDP",
       b: "TCP's head-of-line blocking and its handshake latency are baked into operating system kernels, so changing them is impossible in practice. QUIC rebuilt the transport in user space on top of UDP — independent streams, TLS folded into the handshake, and connections that survive changing network." },
 fl: { t: "What it changes",
       s: ["The connection is established over UDP",
           { s: "Transport and TLS handshake combine into one round trip", n: "Zero round trips on resumption." },
           { q: "Is a packet lost?",
             y: "Only its own stream stalls — other streams continue unaffected",
             n: "Streams are multiplexed independently over one connection" },
           { s: "A connection id, not the IP and port, identifies the connection", n: "So switching from Wi-Fi to mobile does not drop it." },
           "Some corporate networks block or throttle UDP — clients must be able to fall back to TCP"] }
},

"HTTP": {
 ex: { h: "Text you can type by hand",
       b: "A method, a path, some headers, a body. Its simplicity is why it became the universal application protocol — REST, GraphQL, webhooks and most RPC ride on it — and why every layer of infrastructure between you and a server understands it well enough to cache, route and inspect it." },
 fl: { t: "One request-response cycle",
       s: ["The client sends a method, path and headers",
           { s: "GET, POST, PUT, DELETE — with defined semantics", n: "GET must be safe; PUT and DELETE must be idempotent." },
           { s: "The server responds with a status, headers and a body", n: "2xx success, 3xx redirect, 4xx your fault, 5xx mine." },
           { q: "Do caching headers permit reuse?",
             y: "A cache anywhere in the path may serve it — often the largest available speed-up",
             n: "Every request reaches the origin" },
           { s: "HTTP itself is stateless", n: "Cookies and tokens carry the state." },
           "Use the right status code — clients, proxies and monitoring all act on them"] }
},

"HTTP/2": {
 ex: { h: "One connection instead of six",
       b: "HTTP/1.1 could only have one request in flight per connection, so browsers opened six and still queued. HTTP/2 multiplexes many streams over one binary connection — which made domain sharding and sprite sheets obsolete overnight, and their continued use actively harmful." },
 fl: { t: "What changed from 1.1",
       s: ["Frames replace text — binary, and cheaper to parse",
           { s: "Many streams share one TCP connection", n: "No more six-connection limit, no more head-of-line blocking at the HTTP layer." },
           { s: "Headers are compressed with HPACK", n: "Repeated cookies and user agents stop dominating small requests." },
           { q: "Does one TCP packet get lost?",
             y: "Every stream stalls — TCP-level head-of-line blocking remains, which is what HTTP/3 fixes",
             n: "Streams proceed independently and can be prioritised" },
           "Stop concatenating and sharding for HTTP/2 — those workarounds now cost you"] }
},

"HTTP/3": {
 ex: { h: "The same HTTP, on a transport that does not stall",
       b: "The semantics are identical — methods, headers, status codes. What changes is underneath: QUIC over UDP, so a lost packet stalls only its own stream, and the handshake is one round trip instead of three. On lossy mobile networks the difference is very noticeable." },
 fl: { t: "How a browser gets there",
       s: ["The first connection is made over HTTP/2",
           { s: "The server advertises HTTP/3 with an `Alt-Svc` header", n: "Or the client tries both at once — happy eyeballs." },
           { q: "Does UDP reach the server?",
             y: "Subsequent connections use HTTP/3 over QUIC",
             n: "Fall back to HTTP/2 — some networks block UDP" },
           { s: "Encryption is mandatory", n: "There is no unencrypted HTTP/3." },
           "Check that your load balancer and CDN terminate it — most origin servers still speak HTTP/2 internally"] }
},

"HTTPS": {
 ex: { h: "The padlock proves the pipe, not the site",
       b: "It confirms you are talking privately to whoever holds the certificate for that domain — and a phishing site with a valid certificate for `paypa1.com` gets exactly the same padlock. Encryption is not endorsement, which is why *look for the padlock* was retired as security advice." },
 fl: { t: "Establishing the connection",
       s: ["The client sends a hello with supported cipher suites",
           { s: "Including SNI — the hostname, historically in plaintext", n: "Which is how networks can see which sites you visit even over HTTPS." },
           { s: "The server presents its certificate chain", n: "Signed by a certificate authority the client trusts." },
           { q: "Does the chain validate for this hostname and is it in date?",
             y: "Derive a shared session key and switch to symmetric encryption",
             n: "The browser warns — and users click through, which is the persistent weakness" },
           { s: "TLS 1.3 needs one round trip, and zero on resumption", n: "The old three-round-trip handshake is gone." },
           "Automate renewal — expired certificates remain a leading cause of self-inflicted outages"] }
},

"DNS": {
 ex: { h: "*It's always DNS*",
       b: "The joke persists because DNS failures look like everything else: intermittent, cached at four layers, and often stale in exactly one of them. A record changed twenty minutes ago is still being served from a resolver that honoured a 24-hour TTL." },
 fl: { t: "Resolving a name",
       s: ["Check the local cache, then the OS cache",
           { s: "Both honour TTLs, and browsers cache separately again", n: "Which is why *it works for me* is so common during a change." },
           { s: "The resolver asks a root server, then the TLD, then the authoritative server", n: "Usually all cached — the full walk is rare." },
           { q: "Are you about to change a record?",
             y: "Lower the TTL well in advance, or clients keep the old value for the old TTL",
             n: "The answer is cached for its TTL at every layer" },
           { s: "`dig +trace` shows the full delegation path", n: "And `dig @8.8.8.8` bypasses your local resolver." },
           "DNS-based failover is only as fast as the TTL — it is not an instant switch"] }
},

"Network Address Translation": {
 ex: { h: "A whole house behind one address",
       b: "Your router rewrites every outbound packet's source to its single public IP and remembers the mapping so replies come back. It is why IPv4 survived, and why inbound connections need port forwarding — from the outside, the devices behind it do not have reachable addresses." },
 fl: { t: "How a reply finds its way home",
       s: ["An internal host sends a packet to the internet",
           { s: "The router rewrites the source IP and port, recording the mapping", n: "The translation table is the whole mechanism." },
           { s: "The reply arrives addressed to the public IP and that port", n: "The router looks up the mapping and rewrites it back." },
           { q: "Is the connection inbound and unsolicited?",
             y: "There is no mapping — it is dropped unless a rule forwards it",
             n: "It flows normally" },
           { s: "Mappings expire", n: "Which is why idle connections die and keep-alives exist." },
           "Carrier-grade NAT puts thousands of subscribers behind one IP — IP-based blocking hits all of them"] }
},

"DHCP": {
 ex: { h: "Why joining Wi-Fi requires no configuration",
       b: "Your device shouts *does anyone here give out addresses*, a server offers one, and thirty seconds later you have an address, a gateway and a DNS server. It is entirely automatic and entirely trusting, which is why a rogue DHCP server on a network is a straightforward attack." },
 fl: { t: "The DORA exchange",
       s: ["Discover — the client broadcasts, having no address at all",
           { s: "It cannot yet address anyone specifically", n: "Which is why the exchange is broadcast-based." },
           { s: "Offer — a server proposes an address and settings", n: "Gateway, DNS servers, lease duration." },
           { s: "Request — the client formally asks for that offer", n: "Broadcast, so other servers know it declined theirs." },
           { q: "Does the server acknowledge?",
             y: "The lease begins; the client renews at half its duration",
             n: "The client retries, or self-assigns a link-local address" },
           "Servers and printers get reservations or static addresses — a changing address breaks things"] }
},

"Router": {
 ex: { h: "The device that decides *which way*",
       b: "It reads the destination IP, consults its table, and forwards toward the next hop — millions of times a second. Every packet crossing between networks passes through one, and the internet is essentially these tables, kept roughly in agreement by BGP." },
 fl: { t: "Forwarding one packet",
       s: ["A packet arrives on an interface",
           { s: "The router reads the destination IP address", n: "It does not care what is inside." },
           { q: "Does a routing table entry match?",
             y: "Take the most specific prefix — longest prefix match — and forward accordingly",
             n: "Use the default route, or drop it and send an ICMP unreachable" },
           { s: "Decrement the TTL and rewrite the link-layer header", n: "TTL reaching zero is what stops routing loops." },
           "`traceroute` works by sending packets with increasing TTLs and reading who complains"] }
},

"Switch": {
 ex: { h: "The device that learns who is where",
       b: "A switch starts knowing nothing and builds a table by watching source MAC addresses on incoming frames. After a moment it forwards each frame only to the port where that device lives — which is why a switch is not a hub, and why sniffing a switched network requires effort." },
 fl: { t: "Forwarding a frame",
       s: ["A frame arrives on a port",
           { s: "Record its source MAC against that port", n: "This is how the table is learned — continuously." },
           { q: "Is the destination MAC already in the table?",
             y: "Send it out that one port only",
             n: "Flood it to every port except the one it arrived on" },
           { s: "Broadcasts always go everywhere in the same VLAN", n: "Which is why large flat networks suffer." },
           { s: "VLANs split one switch into separate broadcast domains", n: "Traffic between them must pass through a router." },
           "Spanning tree prevents loops — without it, one broadcast circulates forever and saturates the network"] }
},

"MAC Address": {
 ex: { h: "The name on the front door, not the postal address",
       b: "It only has meaning on the local link — a router strips and rewrites it at every hop, while the IP address travels unchanged. It is also why phones now randomise MACs per network: a fixed hardware address is a very effective tracking identifier." },
 fl: { t: "How ARP finds it",
       s: ["A host has an IP and needs the MAC to deliver locally",
           { s: "It broadcasts: *who has 192.168.1.5?*", n: "Everyone on the segment hears it." },
           { q: "Does a host own that address?",
             y: "It replies with its MAC, and the answer is cached",
             n: "No reply — delivery fails" },
           { s: "ARP has no authentication whatsoever", n: "Any host can answer for any address — that is ARP spoofing." },
           "`arp -a` shows the cache; two IPs sharing a MAC usually means someone is spoofing"] }
},

"Socket": {
 ex: { h: "A network connection that behaves like a file",
       b: "Open it, write to it, read from it, close it — the same interface as a file, deliberately, so most code does not need to know it is talking over a network. The abstraction leaks in one important place: writes can partially succeed, and code that ignores the return value is subtly broken." },
 fl: { t: "Server and client",
       s: ["The server creates a socket, binds an address and listens",
           { s: "`accept` returns a new socket per connection", n: "The listening socket keeps listening." },
           { s: "The client creates a socket and connects", n: "Which is the TCP handshake." },
           { q: "Did `send` return fewer bytes than you passed?",
             y: "It is a partial write — loop until it is all sent, or you silently truncate data",
             n: "Continue reading and writing until close" },
           { s: "Both sides must close, and TIME_WAIT holds the port briefly", n: "`SO_REUSEADDR` is why servers can restart immediately." },
           "A read returning zero means orderly shutdown; −1 with an error means something else"] }
},

"File Descriptor": {
 ex: { h: "*Too many open files*",
       b: "A small integer indexing the kernel's table of what this process has open — files, sockets, pipes, all the same. The error appears in production when a connection pool leaks descriptors, and it appears suddenly, because the limit is a hard ceiling rather than a gradual slowdown." },
 fl: { t: "How they are allocated and lost",
       s: ["Opening anything returns the lowest available integer",
           { s: "0, 1 and 2 are stdin, stdout and stderr", n: "Which is why shell redirection uses those numbers." },
           { s: "It stays allocated until explicitly closed", n: "Or until the process exits." },
           { q: "Hitting the limit?",
             y: "You are leaking — find it with `lsof -p`, do not just raise `ulimit`",
             n: "Raise the limit deliberately for a server handling many connections" },
           { s: "Use language constructs that close automatically", n: "`with`, `defer`, try-with-resources." },
           "Forked children inherit descriptors — a common and subtle source of leaks"] }
},

"Blocking and Non-Blocking I/O": {
 ex: { h: "Ten thousand connections, four threads",
       b: "Blocking I/O gives you one thread per connection, which is simple and stops scaling around a few thousand — the memory and context switching dominate. Non-blocking plus an event loop serves them all on a handful of threads, at the cost of code that is considerably harder to follow." },
 fl: { t: "Choosing a model",
       s: ["A read is requested on a socket",
           { q: "Is data available?",
             y: "It returns immediately in both models",
             n: "Blocking: the thread sleeps. Non-blocking: it returns *would block* right away" },
           { s: "Non-blocking needs a readiness notifier", n: "`epoll` on Linux, `kqueue` on BSD — this is what an event loop wraps." },
           { s: "The event loop calls you back when the socket is ready", n: "One thread, thousands of connections." },
           { s: "Blocking anywhere in an event loop stalls every connection", n: "The cardinal sin in Node.js and similar runtimes." },
           "Async/await is non-blocking I/O with syntax that reads sequentially"] }
},

"Bandwidth and Latency": {
 ex: { h: "A lorry full of tapes has enormous bandwidth",
       b: "And terrible latency. Upgrading a connection from 100Mbps to 1Gbps does nothing for a page load dominated by round trips — the data was never the bottleneck. Bandwidth you can buy; latency is bounded by the speed of light and the number of hops." },
 fl: { t: "Working out which one is actually slowing you down",
       s: [{ s: "These are two different things that both get called \"slow\", and they need opposite fixes", n: "Bandwidth is how much can flow per second. Latency is how long one thing takes to arrive." },
           { s: "A lorry full of hard drives has terrible latency and staggering bandwidth", n: "Two days to arrive, carrying petabytes. A text message is the reverse." },
           { q: "Are you moving something large — a video, a backup, a big file?",
             y: "Then bandwidth is your limit, and paying for a fatter connection genuinely helps",
             n: "If you are making many small requests, more bandwidth changes nothing at all. You are waiting on the round trips" },
           { s: "Every back-and-forth costs the full delay, and they add up invisibly", n: "Opening a secure connection takes several exchanges before a single byte of your actual data moves." },
           { s: "Fix latency by having fewer conversations, not faster ones", n: "Combine requests, keep connections open, cache answers, and move the server closer to the user." },
           { s: "And remember one thing you cannot fix: the speed of light", n: "London to Sydney is about 80 milliseconds each way at best. No amount of money changes that." }] }
},

"Packet": {
 ex: { h: "Everything is cut up and reassembled",
       b: "A 10MB file crosses the network as thousands of packets, each routed independently, arriving possibly out of order and by different paths. The receiving TCP stack reassembles them into the original stream — and none of that is visible to the application." },
 fl: { t: "What a packet carries",
       s: ["A header names the source and destination",
           { s: "Plus TTL, protocol and a checksum", n: "Each layer adds and strips its own header." },
           { s: "The payload is the actual data — up to the MTU", n: "Typically 1500 bytes on Ethernet." },
           { q: "Is it larger than the path MTU?",
             y: "Fragment it, or the router drops it and sends *fragmentation needed*",
             n: "It is forwarded hop by hop" },
           { s: "Fragmentation hurts — one lost fragment loses the whole packet", n: "Path MTU discovery exists to avoid it." },
           "Blocking all ICMP breaks path MTU discovery and causes baffling stalls on large transfers"] }
},

"Firewall": {
 ex: { h: "Default deny, and then argue about exceptions",
       b: "The only defensible starting position is that nothing is allowed, then opening specific ports to specific sources. The opposite — allowing everything and blocking known threats — is a list you will never finish, and it is how databases end up on the public internet." },
 fl: { t: "How a rule set decides",
       s: ["A packet arrives and rules are evaluated in order",
           { s: "First match wins — order is semantics, not style", n: "A broad allow above a specific deny makes the deny dead code." },
           { q: "Does any rule match?",
             y: "Apply it — accept, drop or reject",
             n: "The default policy applies, and it should be deny" },
           { s: "Stateful firewalls track connections", n: "Reply traffic is allowed automatically; you only open the initiating direction." },
           { s: "Drop is silent; reject sends an error", n: "Drop causes a timeout, which is slower for the client and quieter for a scanner." },
           "Filter outbound too — it is what contains an already-compromised host"] }
},

"VPN": {
 ex: { h: "Two different products, one name",
       b: "A corporate VPN puts your laptop logically inside the office network so internal services are reachable. A consumer VPN just moves your apparent location and shifts trust from your ISP to the VPN provider. The technology overlaps; the purposes barely do." },
 fl: { t: "How the tunnel works",
       s: ["The client authenticates to the VPN server",
           { s: "They negotiate an encrypted tunnel", n: "WireGuard, IPsec or OpenVPN." },
           { s: "A virtual interface appears on the client", n: "With an address from the remote network." },
           { q: "Split tunnel or full tunnel?",
             y: "Split — only corporate ranges go through the tunnel; everything else goes direct",
             n: "Full — all traffic routes through, which is slower and more visible to the operator" },
           { s: "DNS must route through the tunnel too", n: "Otherwise internal names do not resolve, or leak externally." },
           "The VPN operator sees everything your ISP would have — it moves trust, it does not remove it"] }
},

"Proxy": {
 ex: { h: "Forward and reverse, depending which end it serves",
       b: "A forward proxy sits in front of clients — corporate filtering, caching, egress control. A reverse proxy sits in front of servers — TLS termination, load balancing, caching. Same mechanism, opposite direction, and the words are constantly used interchangeably by mistake." },
 fl: { t: "Which one do you need?",
       s: ["Identify who the proxy is acting on behalf of",
           { q: "Are you controlling or hiding the clients?",
             y: "Forward proxy — filtering, caching and a single egress IP",
             n: "Reverse proxy — one public entry point in front of many backends" },
           { s: "Reverse proxies terminate TLS and add headers", n: "`X-Forwarded-For` carries the original client IP." },
           { s: "Trust those headers only from your own proxy", n: "A client can forge them otherwise — a classic spoofing bug." },
           "Nginx, HAProxy and Envoy are all reverse proxies with different emphases"] }
},

"Latency": {
 ex: { h: "The number users actually feel",
       b: "Every round trip is paid in full, so a page needing DNS, TCP, TLS and then a request has spent four round trips before a byte of content arrives. At 100ms each, that is 400ms before anything happens — which is why connection reuse and CDNs matter so much." },
 fl: { t: "Reducing it",
       s: ["Measure where the time goes, hop by hop",
           { s: "DNS, connect, TLS, time to first byte, download", n: "Browser dev tools break it down for you." },
           { q: "Is the server far from the user?",
             y: "A CDN or an edge region is the largest available win — physics, not software",
             n: "Cut round trips: keep-alive, HTTP/2, fewer sequential requests" },
           { s: "Sequential dependent requests multiply latency", n: "Three chained calls at 100ms is 300ms before rendering." },
           { s: "Report p95 and p99", n: "The average hides the experience of your most active users." },
           "Caching removes the round trip entirely — which beats making it faster"] }
},

"Load Average": {
 ex: { h: "A number people misread constantly",
       b: "A load average of 4 on a four-core machine is fully used, not overloaded. And on Linux it counts processes blocked on disk as well as those wanting CPU — so a load of 20 with idle CPUs almost always means I/O is the bottleneck, not compute." },
 fl: { t: "Interpreting it",
       s: ["Read the three numbers: 1, 5 and 15 minute averages",
           { s: "The trend matters more than any single value", n: "Rising means the problem is getting worse." },
           { q: "Is the load above the core count?",
             y: "Work is queueing — check whether it is CPU or I/O with `top` and `iostat`",
             n: "There is headroom" },
           { s: "Linux includes uninterruptible sleep in the figure", n: "Which is why a stuck NFS mount produces an enormous load with an idle CPU." },
           "Load alone is not an alerting metric — alert on latency and errors, and use load to explain them"] }
},

"Keep-Alive": {
 ex: { h: "Stop paying for the handshake every time",
       b: "A page loading forty resources over new connections pays a TCP handshake and a TLS handshake forty times. Reusing one connection eliminates all of it — which is why connection pooling is one of the highest-value changes available in any HTTP client." },
 fl: { t: "Reusing a connection",
       s: ["The first request completes and the connection is held open",
           { s: "The next request uses it with no handshake", n: "Saving two or three round trips every time." },
           { q: "Is the connection idle beyond the server's timeout?",
             y: "The server closes it — a client that reuses it anyway sees a race and a failed request",
             n: "It is reused until the limit or the timeout" },
           { s: "Client idle timeout must be shorter than the server's", n: "Otherwise you hit that race regularly under load." },
           { s: "Idle connections consume file descriptors and memory on the server", n: "Which is why the timeout exists." },
           "Always use a pooled HTTP client — creating a new one per request defeats all of this"] }
},

"Ping and Traceroute": {
 ex: { h: "The first two commands, and their honest limits",
       b: "Ping tells you a host answers ICMP and how long it took. Traceroute maps the path. Both are frequently misleading now: routers deprioritise ICMP so a slow ping can mean nothing, and firewalls silently drop it, so no reply does not mean no host." },
 fl: { t: "Diagnosing with them",
       s: ["Ping the destination",
           { q: "No reply at all?",
             y: "Could be down, or ICMP could be blocked — try connecting to the actual port",
             n: "Note the round-trip time and any packet loss" },
           { s: "Traceroute sends packets with increasing TTLs", n: "Each hop reports back as its TTL expires." },
           { s: "A middle hop showing high latency is usually not the problem", n: "It deprioritises the reply; if later hops are fast, ignore it." },
           { s: "Loss at the final hop is what matters", n: "Loss in the middle that does not persist is normal." },
           "`mtr` runs both continuously and is far more useful for intermittent faults"] }
},

"SSH": {
 ex: { h: "The remote hands everyone uses",
       b: "Encrypted, authenticated, and capable of far more than a shell — file transfer, port forwarding, and tunnelling a database connection through a bastion. The single most valuable change is disabling password authentication entirely: keys defeat the brute-force attempts every public server receives constantly." },
 fl: { t: "Connecting securely",
       s: ["The client connects and the server presents its host key",
           { q: "Have you seen this host key before?",
             y: "It matches `known_hosts` and the connection proceeds",
             n: "First connection: verify it out of band. A changed key means investigate, not accept" },
           { s: "The client authenticates with a key pair", n: "The private key never leaves your machine." },
           { s: "Disable password auth and root login on the server", n: "Two settings that remove most of the attack surface." },
           { s: "Local forwarding tunnels a port through the connection", n: "`-L 5432:db:5432` reaches a database with no public exposure." },
           "Use an agent with a passphrase-protected key — an unprotected private key is a password in a file"] }
}

});
