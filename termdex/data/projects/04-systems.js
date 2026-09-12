/* Project Lab — Systems, OS & Cloud Engineering */
(function (TD) {
  TD.addProjects("systems", [
    {
      id: "custom-shell-posix",
      title: "POSIX Unix Shell & Process Orchestrator in C",
      domain: "systems",
      difficulty: "easy",
      year: "1st Year (Foundations)",
      time: "1–2 weeks",
      tagline: "Build a functional Unix command-line shell with process forking, pipes, and I/O redirection.",
      problem: "Every developer uses `bash` or `zsh` daily, but few understand how the operating system handles process isolation, file descriptor duplication, pipe buffers, and asynchronous signals.",
      outcome: "A functional POSIX C shell supporting built-in commands (`cd`, `exit`, `history`), multi-stage pipeline chaining (`cat file | grep text | wc -l`), file redirection (`<`, `>`, `>>`), and background jobs (`&`).",
      stack: ["C (C99 / POSIX)", "Linux Syscalls (fork, execvp, waitpid, dup2, pipe)", "Makefile"],
      diagram:
"User Command: 'cat access.log | grep 404 > errors.txt'\n                         │\n                         ▼\n┌────────────────────────────────────────────────────────┐\n│ Tokenizer & Parser: Splits on '|', '<', '>', '&'       │\n└────────────────────────┬───────────────────────────────┘\n                         ▼\n┌────────────────────────────────────────────────────────┐\n│ Pipe Creation: pipe(pipefd) ──► [Read End, Write End]  │\n└────────────────────────┬───────────────────────────────┘\n                         │\n         ┌───────────────┴───────────────┐\n         ▼                               ▼\n┌─────────────────┐             ┌─────────────────┐\n│ Child Process 1 │             │ Child Process 2 │\n│ dup2(pipefd[1], │             │ dup2(pipefd[0], │\n│      STDOUT_FILENO)           │      STDIN_FILENO)│\n│ execvp(\"cat\")   │ ──Pipe Buffer─► dup2(file_fd, │\n│                 │             │      STDOUT_FILENO)│\n└─────────────────┘             │ execvp(\"grep\")  │\n                                └─────────────────┘",
      steps: [
        { title: "Phase 1: REPL & Command Tokenizer", desc: "Build the Read-Eval-Print Loop using `getline()`. Tokenize input strings into argument arrays handling quoted strings and whitespace." },
        { title: "Phase 2: Process Execution with fork & exec", desc: "Implement process creation using `fork()`, child process binary execution with `execvp()`, and parent reaping with `waitpid()`." },
        { title: "Phase 3: File Descriptor Redirection (dup2)", desc: "Parse `<`, `>`, and `>>` tokens. Open target files with appropriate flags (`O_CREAT`, `O_WRONLY`, `O_APPEND`) and redirect standard streams using `dup2()`." },
        { title: "Phase 4: Multi-Stage Pipelines & Signals", desc: "Implement recursive pipe chaining using `pipe()`. Handle `SIGINT` (Ctrl+C) so the shell doesn't terminate and `SIGCHLD` to reap zombie background processes." }
      ],
      resources: [
        { title: "Stephen Brennan: Write a Shell in C Guide", url: "https://brennan.io/2015/01/16/write-a-shell-in-c/" },
        { title: "Linux Syscall Manual: fork(2), execvp(3), pipe(2)", url: "https://man7.org/linux/man-pages/man2/fork.2.html" },
        { title: "Advanced Programming in the UNIX Environment (Stevens & Rago)", url: "https://en.wikipedia.org/wiki/Advanced_Programming_in_the_Unix_Environment" }
      ],
      pitfalls: [
        "Always close unused pipe file descriptors in both parent and child processes; failing to close the write end in the parent causes the reading child to block indefinitely waiting for EOF.",
        "Always reap child processes using `waitpid(-1, &status, WNOHANG)` on `SIGCHLD` to prevent zombie processes."
      ],
      interview: [
        "What happens in memory and the OS kernel when `fork()` and `execvp()` are called consecutively (Copy-On-Write)?",
        "How does the `dup2()` system call manipulate the process's file descriptor table?"
      ]
    },
    {
      id: "memory-allocator-malloc",
      title: "Custom Dynamic Memory Allocator (malloc & free) in C",
      domain: "systems",
      difficulty: "intermediate",
      year: "2nd Year (Core Builder)",
      time: "2–3 weeks",
      tagline: "Build a high-performance heap memory allocator with segregated free lists, coalescing, and mmap.",
      problem: "C/C++ programs rely on `malloc()` and `free()` for dynamic heap management. A naive allocator causes severe memory fragmentation, poor CPU cache locality, and significant allocation latency.",
      outcome: "A standalone dynamic memory allocator library replacing standard glibc `malloc` with segregated free lists, 8-byte/16-byte alignment, boundary tag coalescing, and benchmarking against fragmentation benchmarks.",
      stack: ["C (GCC / Clang)", "Linux Syscalls (sbrk, mmap)", "Valgrind / GDB", "Performance Benchmarking"],
      diagram:
"Heap Layout with Explicit Free List & Boundary Tags:\n\n┌─────────────┬───────────────────────────┬─────────────┐\n│ Header      │ Payload (User Memory)     │ Footer      │\n│ Size | Alloc│ Free Next / Prev Pointers │ Size | Alloc│\n│ (8 Bytes)   │ (When block is free)      │ (8 Bytes)   │\n└─────────────┴───────────────────────────┴─────────────┘\n\nWhen free(ptr) is called:\n1. Inspect previous block footer (size_t at ptr - 8)\n2. Inspect next block header (size_t at ptr + block_size)\n3. Coalesce adjacent free chunks in O(1) time into one contiguous block\n4. Insert coalesced block into Segregated Free List bin (e.g. 32B, 64B, 128B, 512B, >4KB)",
      steps: [
        { title: "Phase 1: Basic Bump Allocator with sbrk", desc: "Build a simple bump pointer allocator using `sbrk()` to request memory pages from the Linux kernel." },
        { title: "Phase 2: Block Headers & Explicit Free List", desc: "Design 8-byte block headers and footers storing block size and allocation status bit. Implement an explicit doubly linked list of free blocks." },
        { title: "Phase 3: O(1) Boundary Tag Coalescing", desc: "Implement Knuth's boundary tag coalescing algorithm: on `free()`, merge adjacent free blocks to eliminate external fragmentation in constant time." },
        { title: "Phase 4: Segregated Free Lists & Large mmap", desc: "Organize free blocks into size-segregated bins (e.g., powers of 2). For allocations >128KB, allocate dedicated pages directly using `mmap()`." }
      ],
      resources: [
        { title: "Computer Systems: A Programmer's Perspective (CS:APP Chapter 9: Virtual Memory & Allocators)", url: "http://csapp.cs.cmu.edu/" },
        { title: "Doug Lea's Malloc Architecture (dlmalloc)", url: "https://gee.cs.oswego.edu/dl/html/malloc.html" },
        { title: "Linux mmap(2) and sbrk(2) System Calls", url: "https://man7.org/linux/man-pages/man2/mmap.2.html" }
      ],
      pitfalls: [
        "Failing to maintain strict 8-byte (32-bit) or 16-byte (64-bit) memory alignment causes CPU hardware faults on modern architectures.",
        "Ensure the allocation bit in block headers does not corrupt the size value (use bitwise masks on the lowest 3 bits)."
      ],
      interview: [
        "What is the difference between internal and external memory fragmentation?",
        "Why is immediate boundary tag coalescing critical for preventing heap exhaustion?"
      ]
    },
    {
      id: "p2p-bittorrent-client",
      title: "BitTorrent Peer-to-Peer Download Engine from Scratch",
      domain: "systems",
      difficulty: "intermediate",
      year: "2nd Year (Core Builder)",
      time: "2–3 weeks",
      tagline: "Build a BitTorrent file downloader with Bencode parsing, tracker handshakes, and concurrent peer piece pipelining.",
      problem: "Centralized file downloads create massive server bandwidth bottlenecks. The BitTorrent protocol decentralizes file distribution across thousands of untrusted peers, requiring strict cryptographic piece verification and tit-for-tat choking algorithms.",
      outcome: "A working CLI BitTorrent client in Go/Rust that parses `.torrent` files, connects to HTTP/UDP trackers, establishes concurrent TCP peer connections, and downloads files while verifying SHA-1 piece hashes.",
      stack: ["Go / Rust", "TCP Sockets", "Crypto (SHA-1)", "Bencode Parser", "Goroutines / Async"],
      diagram:
".torrent File ──► [ Bencode Parser ] ──► Extracts Info Hash & Tracker URL\n                                             │\n                                             ▼\n┌────────────────────────────────────────────────────────┐\n│ Tracker HTTP/UDP Handshake ──► Returns Peer IP List    │\n└────────────────────────────┬───────────────────────────┘\n                             ▼\n┌────────────────────────────────────────────────────────┐\n│ Concurrent Peer Worker Pool (20 TCP Connections)       │\n└────────────┬───────────────────────────────┬───────────┘\n             ▼                               ▼\n┌─────────────────────────┐     ┌─────────────────────────┐\n│ Peer 1 (Send Bitfield)  │     │ Peer 2 (Send Bitfield)  │\n│ Request 16KB Block      │     │ Request 16KB Block      │\n│ Receive Piece Data      │     │ Receive Piece Data      │\n└────────────┬────────────┘     └────────────┬────────────┘\n             └───────────────┬───────────────┘\n                             ▼\n┌────────────────────────────────────────────────────────┐\n│ Piece Assembler: Verifies 20-Byte SHA-1 Hash per Piece │\n│ If Valid ──► Writes to Disk at Byte Offset             │\n└────────────────────────────────────────────────────────┘",
      steps: [
        { title: "Phase 1: Bencode Parsing & Torrent Metadata", desc: "Build a recursive descent parser for the Bencode format (integers, strings, lists, dictionaries) to extract the 20-byte Info Hash and piece hashes." },
        { title: "Phase 2: Tracker Communication (HTTP / UDP)", desc: "Send tracker announce requests with uploaded/downloaded metrics and parse binary peer IP and port lists." },
        { title: "Phase 3: Peer Wire Protocol & Handshake", desc: "Implement the BitTorrent peer handshake over raw TCP: send `Interested` and `Unchoke` messages, exchange `Bitfield` arrays, and handle keep-alive pings." },
        { title: "Phase 4: Piece Pipelining & File Assembly", desc: "Pipeline multiple 16KB block requests per peer. Assemble received blocks into complete pieces, verify SHA-1 hashes, and write to destination files." }
      ],
      resources: [
        { title: "BitTorrent Protocol Specification (BEP 0003)", url: "http://www.bittorrent.org/beps/bep_0003.html" },
        { title: "Building a BitTorrent Client from Scratch in Go (Jesse Li)", url: "https://blog.jse.li/posts/torrent/" },
        { title: "Bencode Format Specification", url: "https://en.wikipedia.org/wiki/Bencode" }
      ],
      pitfalls: [
        "Do not request entire 1MB+ pieces at once; peers will drop the connection. Always request sub-pieces in 16KB block chunks.",
        "Always verify the SHA-1 hash of every completed piece before saving to disk to prevent corrupted or malicious downloads."
      ],
      interview: [
        "Explain how the Rarest-First piece selection strategy maximizes cluster swarm diversity in BitTorrent.",
        "How does the Choking / Tit-for-Tat algorithm incentivize peers to upload data to others?"
      ]
    },
    {
      id: "redis-from-scratch",
      title: "In-Memory Redis Server from Scratch in C / Go",
      domain: "systems",
      difficulty: "intermediate",
      year: "2nd Year (Core Builder)",
      time: "3 weeks",
      tagline: "Build a single-threaded event-driven key-value store with RESP protocol, incremental hash rehashing, and AOF persistence.",
      problem: "Redis achieves sub-millisecond latencies and millions of operations per second on a single thread. Understanding its event loop, non-blocking network I/O, dynamic string allocations, and incremental hash rehashing requires building it from the socket level.",
      outcome: "A high-performance Redis clone capable of passing standard `redis-benchmark` tests, supporting string/list/set operations, TTL key expiration, and Append-Only File (AOF) crash persistence.",
      stack: ["C / Go / Rust", "Non-blocking Sockets / Epoll", "RESP Protocol Parser", "Hash Table with Incremental Rehashing"],
      diagram:
"Concurrent Redis CLI / Client TCP Connections\n                 │\n                 ▼\n┌────────────────────────────────────────┐\n│ Epoll / Kqueue Event Multiplexer       │ (Non-blocking I/O Event Loop)\n└────────────────┬───────────────────────┘\n                 ▼\n┌────────────────────────────────────────┐\n│ RESP Protocol Parser (RESP2 / RESP3)   │ ──► Decodes: *3\\r\\n$3\\r\\nSET\\r\\n$4\\r\\nuser\\r\\n$4\\r\\nAlex\\r\\n\n└────────────────┬───────────────────────┘\n                 ▼\n┌────────────────────────────────────────┐\n│ In-Memory Hash Table (Dict)            │\n│ • Progressive Incremental Rehashing    │\n│ • Active / Passive TTL Key Eviction    │\n└────────────────┬───────────────────────┘\n                 │\n         ┌───────┴───────────────────────┐\n         ▼                               ▼\n┌───────────────────┐          ┌───────────────────┐\n│ Append-Only File  │          │ Send RESP Response│\n│ (AOF) Disk Log    │          │ +OK\\r\\n           │\n└───────────────────┘          └───────────────────┘",
      steps: [
        { title: "Phase 1: Non-Blocking Epoll Event Loop", desc: "Set up a non-blocking TCP server using Linux `epoll` / macOS `kqueue`. Handle connection state transitions and partial socket buffer reads." },
        { title: "Phase 2: Redis Serialization Protocol (RESP)", desc: "Build a zero-copy parser for Simple Strings (`+`), Errors (`-`), Integers (`:`), Bulk Strings (`$`), and Arrays (`*`)." },
        { title: "Phase 3: Dynamic Hash Table & Progressive Rehashing", desc: "Implement a MurmurHash / SipHash dictionary with progressive incremental rehashing (moving 100 buckets per operation to avoid latency spikes during table resizing)." },
        { title: "Phase 4: TTL Expiration & AOF Persistence", desc: "Implement active and passive key expiration with TTL timers. Write an Append-Only File (AOF) engine with background `fsync` logging for crash recovery." }
      ],
      resources: [
        { title: "Redis Protocol specification (RESP)", url: "https://redis.io/docs/reference/protocol-spec/" },
        { title: "Build Your Own Redis in Go / C (James Smith)", url: "https://build-your-own.org/redis/" },
        { title: "Redis Internal Source Code: dict.c & ae.c", url: "https://github.com/redis/redis" }
      ],
      pitfalls: [
        "Never perform full hash table rehashing synchronously in a single request; resizing a 10,000,000-key table causes seconds of server freeze. Use incremental rehashing across requests.",
        "Always handle partial socket reads: TCP is a stream protocol, so commands may arrive split across multiple `recv()` calls."
      ],
      interview: [
        "Why is Redis single-threaded for command execution, and how does it achieve >100,000 RPS?",
        "Explain how Progressive Incremental Rehashing prevents latency spikes in hash tables."
      ]
    },
    {
      id: "container-runtime-cgroups",
      title: "Lightweight Linux Container Runtime from Scratch (Mini-Docker)",
      domain: "systems",
      difficulty: "hard",
      year: "3rd Year (Advanced Engineering)",
      time: "3–4 weeks",
      tagline: "Build a container runtime using Linux namespaces, cgroups v2 resource limits, and OverlayFS root filesystems.",
      problem: "Containers (Docker, containerd) are not magical virtual machines; they are standard Linux processes isolated by Linux kernel features. Building one from scratch uncovers the core mechanics of OS virtualization.",
      outcome: "A standalone CLI container runtime (`mini-docker run --memory 256M --cpu 0.5 alpine /bin/sh`) that isolates PID/Network/Mount namespaces, pulls OCI container images, and enforces strict cgroup hardware limits.",
      stack: ["Go / C", "Linux Syscalls (clone, unshare, pivot_root, setns)", "Linux Cgroups v2", "OverlayFS", "OCI Image Spec"],
      diagram:
"Command: mini-docker run --memory 256MB --cpu 0.5 alpine /bin/sh\n                            │\n                            ▼\n┌────────────────────────────────────────────────────────┐\n│ 1. Pull & Unpack OCI Image Rootfs                      │\n│ Create OverlayFS: Lower (Image) + Upper (Writable RW)  │\n└───────────────────────────┬────────────────────────────┘\n                            ▼\n┌────────────────────────────────────────────────────────┐\n│ 2. Linux Cgroups v2 Resource Configuration             │\n│ Write: /sys/fs/cgroup/mini-docker/container_id/        │\n│ • memory.max = 268435456 (256MB)                       │\n│ • cpu.max = 50000 100000 (0.5 Core)                   │\n└───────────────────────────┬────────────────────────────┘\n                            ▼\n┌────────────────────────────────────────────────────────┐\n│ 3. Process Isolation with clone() / unshare()          │\n│ Flags: CLONE_NEWPID | CLONE_NEWNET | CLONE_NEWNS |     │\n│        CLONE_NEWUTS | CLONE_NEWIPC                     │\n└───────────────────────────┬────────────────────────────┘\n                            ▼\n┌────────────────────────────────────────────────────────┐\n│ 4. Filesystem Chroot & Pivot Root                      │\n│ pivot_root(overlay_mount, old_root) ──► execv(\"/bin/sh\")\n│ Process runs as isolated PID 1 inside container        │\n└────────────────────────────────────────────────────────┘",
      steps: [
        { title: "Phase 1: Linux Namespaces Isolation", desc: "Use the `clone()` system call with `CLONE_NEWPID`, `CLONE_NEWNS`, `CLONE_NEWUTS`, and `CLONE_NEWIPC` flags so the child process sees an isolated hostname and process tree (PID 1)." },
        { title: "Phase 2: Root Filesystem Isolation with pivot_root", desc: "Mount an alpine rootfs and use `pivot_root` (safer than legacy `chroot`) to switch the process's root filesystem, mounting a fresh `/proc` pseudo-filesystem." },
        { title: "Phase 3: Cgroups v2 Resource Governance", desc: "Create a cgroup directory in `/sys/fs/cgroup/`, write memory limits (`memory.max`) and CPU limits (`cpu.max`), and attach the container process ID." },
        { title: "Phase 4: OverlayFS Layered Storage & Network Bridge", desc: "Implement copy-on-write image layers with OverlayFS. Create virtual ethernet pairs (`veth`) and attach them to a host `bridge` for container internet access." }
      ],
      resources: [
        { title: "Linux Namespaces and Cgroups Manual", url: "https://man7.org/linux/man-pages/man7/namespaces.7.html" },
        { title: "Liz Rice: Building a Container from Scratch in Go (GOTO Conf)", url: "https://github.com/lizrice/containers-from-scratch" },
        { title: "OCI (Open Container Initiative) Runtime Specification", url: "https://github.com/opencontainers/runtime-spec" }
      ],
      pitfalls: [
        "Do not use `chroot` alone; processes with root access can escape a chroot jail. Always use `pivot_root` combined with mount namespaces.",
        "Ensure `/proc` is remounted inside the new mount namespace, otherwise `ps aux` inside the container will still see all host machine processes."
      ],
      interview: [
        "Explain the fundamental architectural differences between Virtual Machines (Hypervisors) and Linux Containers (Namespaces/Cgroups).",
        "How does OverlayFS implement Copy-On-Write (COW) file modifications without altering base image layers?"
      ]
    },
    {
      id: "lisp-compiler-bytecode-vm",
      title: "Lisp Compiler & Register-Based Bytecode Virtual Machine",
      domain: "systems",
      difficulty: "hard",
      year: "3rd Year (Advanced Engineering)",
      time: "3–4 weeks",
      tagline: "Build an interpreted language from scratch with AST parser, bytecode compiler, and Mark-and-Sweep Garbage Collector in C/Rust.",
      problem: "Interpreting programming languages directly on Abstract Syntax Trees is slow and inefficient. Modern runtimes (LuaJIT, V8, JVM) compile source code into compact bytecode instructions executed on virtual machine registers.",
      outcome: "A complete programming language runtime with lexer, parser, bytecode emitter, stack/register VM, and a garbage collector capable of executing closures and recursive algorithms.",
      stack: ["C / Rust", "Lexer / Recursive Descent Parser", "Bytecode Compiler", "Mark-and-Sweep GC"],
      diagram:
"Lisp Source Code: (defn factorial (n) (if (<= n 1) 1 (* n (factorial (- n 1)))))\n                                    │\n                                    ▼\n┌────────────────────────────────────────────────────────┐\n│ Lexer & S-Expression Parser ──► Abstract Syntax Tree   │\n└───────────────────────────┬────────────────────────────┘\n                            ▼\n┌────────────────────────────────────────────────────────┐\n│ Bytecode Compiler (Constant Pool, Opcode Generation)   │\n│ Opcodes: [OP_LOAD_CONST, OP_LE, OP_JUMP_IF_FALSE,      │\n│           OP_SUB, OP_CALL, OP_MUL, OP_RETURN]          │\n└───────────────────────────┬────────────────────────────┘\n                            ▼\n┌────────────────────────────────────────────────────────┐\n│ Register / Stack Virtual Machine Execution Loop        │\n│ while(1) { switch(*ip++) { case OP_MUL: ... } }        │\n└───────────────────────────┬────────────────────────────┘\n                            ▼\n┌────────────────────────────────────────────────────────┐\n│ Tri-Color Mark-and-Sweep Garbage Collector (GC)        │\n│ Traverses root stack pointers and sweeps unreached RAM │\n└────────────────────────────────────────────────────────┘",
      steps: [
        { title: "Phase 1: Lexical Analysis & S-Expression AST", desc: "Build a scanner converting source strings into tokens (identifiers, numbers, strings, parens). Construct the AST tree using recursive descent parsing." },
        { title: "Phase 2: Bytecode Instruction Set Architecture (ISA)", desc: "Define bytecode instructions (`OP_ADD`, `OP_LOAD`, `OP_JUMP`, `OP_CALL`, `OP_CLOSURE`). Build a compiler that flattens AST expressions into linear bytecode." },
        { title: "Phase 3: Virtual Machine Dispatch Loop", desc: "Implement the VM execution loop with call frames, local variable registers, and constant pools." },
        { title: "Phase 4: Mark-and-Sweep Garbage Collector", desc: "Build an automatic garbage collector: mark all reachable heap objects from active VM stack frames, and sweep unreferenced memory back to the allocator." }
      ],
      resources: [
        { title: "Crafting Interpreters (Robert Nystrom)", url: "https://craftinginterpreters.com/" },
        { title: "Structure and Interpretation of Computer Programs (SICP)", url: "https://mitp-content-server.mit.edu/books-am-format/sicp/index.html" },
        { title: "The Implementation of Lua 5.0 (Register-Based VM Paper)", url: "https://www.lua.org/doc/jucs05.pdf" }
      ],
      pitfalls: [
        "Avoid stack overflow during garbage collection marking on deeply nested data structures; use pointer reversal or explicit mark stacks.",
        "Ensure bytecode jump offsets are calculated correctly when patching forward conditional branch targets."
      ],
      interview: [
        "Compare the performance and implementation trade-offs between Stack-based VMs (JVM, Python) and Register-based VMs (Lua, Dalvik).",
        "How does the Tri-Color marking abstraction work in generational and concurrent garbage collectors?"
      ]
    },
    {
      id: "custom-http3-quic-server",
      title: "HTTP/3 & QUIC Protocol Server from Scratch in Rust",
      domain: "systems",
      difficulty: "hard",
      year: "3rd Year (Advanced Engineering)",
      time: "3–4 weeks",
      tagline: "Build a zero-head-of-line-blocking HTTP/3 server over raw UDP sockets with TLS 1.3 encryption.",
      problem: "HTTP/2 solved application-layer head-of-line blocking, but still suffered from transport-layer blocking because TCP guarantees strict in-order delivery: a single dropped packet stalls all multiplexed streams. HTTP/3 replaces TCP with QUIC over UDP.",
      outcome: "A standalone HTTP/3 server built in Rust on raw UDP sockets that executes 0-RTT TLS handshakes, serves multiplexed streams with zero head-of-line blocking, and handles Wi-Fi-to-cellular connection migration.",
      stack: ["Rust", "Raw UDP Sockets", "QUIC Protocol (RFC 9000)", "Rustls (TLS 1.3)", "Tokio Async"],
      diagram:
"Client Browser (HTTP/3 Supported)\n             │ (QUIC Packets over UDP Port 443)\n             ▼\n┌────────────────────────────────────────┐\n│ UDP Socket Listener (Tokio Async)      │\n└────────────┬───────────────────────────┘\n             ▼\n┌────────────────────────────────────────┐\n│ QUIC Packet Decryption & Framing       │\n│ • 1-RTT / 0-RTT TLS 1.3 Handshake      │\n│ • Connection ID (CID) Route Migration  │\n└────────────┬───────────────────────────┘\n             ▼\n┌────────────────────────────────────────┐\n│ Independent Multiplexed Stream Engine  │\n│ • Stream 1 (HTML): Packet 3 Dropped    │ ──► Stream 1 Waits for Retransmit\n│ • Stream 2 (Image): Continues Flowing! │ ──► ZERO Head-of-Line Blocking!\n└────────────┬───────────────────────────┘\n             ▼\nQPACK Header Decompression ──► Serve High-Throughput HTTP/3 Assets",
      steps: [
        { title: "Phase 1: UDP Socket Demultiplexer & Connection IDs", desc: "Build the UDP listener that routes incoming datagrams by 64-bit QUIC Connection IDs (CID) rather than IP/port tuples to support seamless network migration." },
        { title: "Phase 2: TLS 1.3 Handshake Integration", desc: "Integrate `rustls` to establish encrypted sessions directly inside QUIC Initial and Handshake packets." },
        { title: "Phase 3: Stream Framing & Loss Recovery", desc: "Implement individual QUIC streams (`STREAM` frames). Build packet acknowledgment tracking (`ACK` frames) with independent per-stream loss recovery." },
        { title: "Phase 4: QPACK Compression & Benchmarking", desc: "Implement QPACK (HTTP/3's header compression protocol) and benchmark asset loading against HTTP/2 under simulated 5% packet loss networks." }
      ],
      resources: [
        { title: "IETF RFC 9000: QUIC: A UDP-Based Multiplexed and Secure Transport", url: "https://datatracker.ietf.org/doc/html/rfc9000" },
        { title: "IETF RFC 9114: HTTP/3 Protocol Specification", url: "https://datatracker.ietf.org/doc/html/rfc9114" },
        { title: "Quinn: Async QUIC implementation in Rust", url: "https://github.com/quinn-rs/quinn" }
      ],
      pitfalls: [
        "Do not confuse QUIC connection migration with TCP re-binding; connection IDs allow a smartphone to transition from Wi-Fi to 5G without resetting active downloads.",
        "Be careful with UDP buffer sizes: set OS socket buffers (`SO_RCVBUF`, `SO_SNDBUF`) sufficiently large to avoid dropping UDP datagrams under heavy throughput."
      ],
      interview: [
        "Explain how QUIC over UDP eliminates TCP Head-of-Line blocking on multiplexed connections.",
        "How does HTTP/3 QPACK header compression differ from HTTP/2 HPACK?"
      ]
    },
    {
      id: "ebpf-network-profiler",
      title: "Kernel eBPF Observability & Network Traffic Profiler",
      domain: "systems",
      difficulty: "hard",
      year: "3rd Year (Advanced Engineering)",
      time: "3–4 weeks",
      tagline: "Hook into the Linux kernel using eBPF programs for zero-overhead packet filtering and latency profiling.",
      problem: "Traditional userspace monitoring tools (top, Wireshark, pprof) introduce significant CPU overhead and context switching when tracing millions of syscalls and network packets in production servers.",
      outcome: "A production kernel observability agent that compiles eBPF C programs into kernel space, intercepts TCP sockets and syscalls, and exports live latency heatmaps and packet drop metrics.",
      stack: ["C (eBPF / libbpf)", "Linux Kernel XDP / Kprobes", "Go (Cilium ebpf library)", "Grafana"],
      diagram:
"Linux Userspace Application (e.g. Node.js API)\n              │ Makes Syscall: sys_enter_connect()\n              ▼\n═══════════════════════════════════════════════════════ [ Linux Kernel Boundary ]\n┌────────────────────────────────────────┐\n│ eBPF Kprobe: trace_connect()           │ (Runs in verified kernel sandbox with zero context switch)\n│ Captures socket timestamp & Dest IP    │\n└─────────────┬──────────────────────────┘\n              │ Stores in BPF Ring Buffer / Hash Map\n              ▼\n┌────────────────────────────────────────┐\n│ BPF Ring Buffer (Kernel-User Shared Mem│\n└─────────────┬──────────────────────────┘\n═══════════════════════════════════════════════════════\n              │ Zero-Copy Read by Userspace Daemon\n              ▼\n┌────────────────────────────────────────┐\n│ Go Observability Daemon (Cilium ebpf)  │ ──► Exports Prometheus Metrics (TCP Latency, RTT, Drops)\n└────────────────────────────────────────┘",
      steps: [
        { title: "Phase 1: eBPF C Kernel Program & Clang Compiler", desc: "Write eBPF C programs using `libbpf` headers. Pass the kernel BPF verifier (ensuring no infinite loops and valid memory bounds)." },
        { title: "Phase 2: Kprobes & XDP Packet Filter", desc: "Attach eBPF programs to `kprobe/sys_enter_connect` to trace outbound TCP connections, and attach XDP (eXpress Data Path) hooks to network drivers to drop malicious packets before the OS network stack." },
        { title: "Phase 3: BPF Maps & Ring Buffers", desc: "Use BPF Ring Buffers and BPF Hash Maps for lock-free, zero-copy communication between kernel space and userspace Go daemons." },
        { title: "Phase 4: Metrics Dashboard & Flamegraphs", desc: "Aggregate kernel metrics into Prometheus and generate CPU on-CPU/off-CPU flamegraphs for debugging production latency regressions." }
      ],
      resources: [
        { title: "Brendan Gregg: BPF Performance Tools (Book & Guide)", url: "https://www.brendangregg.com/bpf-performance-tools-book.html" },
        { title: "Cilium: BPF and XDP Reference Guide", url: "https://docs.cilium.io/en/stable/bpf/" },
        { title: "Libbpf Bootstrap: Modern eBPF Program Templates", url: "https://github.com/libbpf/libbpf-bootstrap" }
      ],
      pitfalls: [
        "The kernel BPF verifier is extremely strict: unbounded pointer arithmetic, uninitialized variables, or unprovable loops will cause the kernel to reject the program.",
        "Always use BPF Ring Buffers over legacy BPF Perf Buffers for superior performance and memory ordering guarantees."
      ],
      interview: [
        "What is eBPF and how does the kernel verifier guarantee safety when executing custom C bytecode in kernel space?",
        "How does XDP (eXpress Data Path) achieve sub-microsecond packet processing speeds compared to iptables?"
      ]
    },
    {
      id: "raft-distributed-kv",
      title: "Distributed Fault-Tolerant Key-Value Store with Raft Consensus",
      domain: "systems",
      difficulty: "advanced",
      year: "4th Year (Final Year Capstone)",
      time: "4–6 weeks",
      tagline: "Build an etcd/CockroachDB style distributed consensus cluster with leader election, log replication, and snapshots in Go/Rust.",
      problem: "Single-node databases crash. Traditional master-slave replication suffers from split-brain scenarios and data loss during failovers. You must implement the Raft distributed consensus algorithm to guarantee strong linearizable consistency across node failures.",
      outcome: "A production distributed key-value cluster that maintains consistency and zero data loss through network partitions, node crashes, and dynamic leader re-elections.",
      stack: ["Go / Rust", "gRPC / Protobuf", "Raft Consensus Algorithm", "BoltDB / LevelDB Storage"],
      diagram:
"Client Write Request: SET key=\"alex\" val=\"admin\"\n                     │\n                     ▼\n┌────────────────────────────────────────┐\n│ Node 1: Raft LEADER (Term 3)           │\n│ 1. Appends command to local Raft Log   │\n└────────────┬───────────────────────────┘\n             │ Broadcasts AppendEntries RPC (Log Entry #42)\n             ├───────────────────────────┬───────────────────────────┐\n             ▼                           ▼                           ▼\n┌─────────────────────────┐ ┌─────────────────────────┐ ┌─────────────────────────┐\n│ Node 2: FOLLOWER        │ │ Node 3: FOLLOWER        │ │ Node 4: CRASHED NODE    │\n│ Confirms Log Append     │ │ Confirms Log Append     │ │ (Network Partition)     │\n└────────────┬────────────┘ └────────────┬────────────┘ └─────────────────────────┘\n             │                           │\n             └─────────────┬─────────────┘\n                           │ Majority Quorum Confirmed (3 of 4)\n                           ▼\n┌────────────────────────────────────────┐\n│ Leader Commits Entry & Applies to State│ ──► Client Receives Success Acknowledgment\n└────────────────────────────────────────┘",
      steps: [
        { title: "Phase 1: RPC Protocol & Node State Machine", desc: "Define gRPC protobuf contracts for `RequestVote` and `AppendEntries` RPCs. Implement node state transitions: Follower, Candidate, Leader." },
        { title: "Phase 2: Randomized Leader Election", desc: "Implement randomized election timers (150–300ms) to resolve split-vote deadlocks. Handle term increments and vote request validation." },
        { title: "Phase 3: Log Replication & Majority Commit", desc: "Implement log replication with `prevLogIndex` and `prevLogTerm` validation. Once a majority of cluster nodes acknowledge, commit and apply entries to the local key-value store." },
        { title: "Phase 4: Log Compaction & Jepsen Partition Testing", desc: "Implement snapshotting to truncate old log files. Write automated Chaos Engineering tests that drop network packets between nodes to verify linearizability." }
      ],
      resources: [
        { title: "Ongaro & Ousterhout — In Search of an Understandable Consensus Algorithm (Raft Paper)", url: "https://raft.github.io/raft.pdf" },
        { title: "Raft Interactive Visualization & Algorithm Guide", url: "https://raft.github.io/" },
        { title: "Jepsen: Distributed Systems Safety & Fault Injection Testing", url: "https://jepsen.io/" }
      ],
      pitfalls: [
        "Never commit an entry from a previous term directly by counting replicas; in Raft, a leader only commits entries from its current term by counting replicas (Section 5.4.2).",
        "Ensure disk log writes are `fsync`ed before responding to RPCs, otherwise node reboots will corrupt log consistency."
      ],
      interview: [
        "How does Raft guarantee the Leader Completeness property without requiring complex log sync phases?",
        "Explain how Raft prevents split-brain scenarios when a 5-node cluster is partitioned into 2-node and 3-node sub-clusters."
      ]
    },
    {
      id: "distributed-load-balancer-l4",
      title: "Layer-4 High-Performance Load Balancer with Maglev Hashing",
      domain: "systems",
      difficulty: "advanced",
      year: "4th Year (Final Year Capstone)",
      time: "6–8 weeks",
      tagline: "Build a Google Maglev-style L4 load balancer with consistent hashing and zero-copy packet forwarding in C/Rust.",
      problem: "Layer-7 reverse proxies (Nginx, Envoy) terminate TCP and parse full HTTP strings, introducing high CPU overhead. Layer-4 load balancers forward raw TCP/UDP packets directly at the network layer, sustaining 10,000,000+ packets/sec with deterministic backend routing.",
      outcome: "A high-performance L4 network load balancer that executes Maglev consistent hashing, maintains connection affinity across backend server restarts, and performs zero-copy packet forwarding.",
      stack: ["C / Rust", "DPDK / Linux Raw Sockets", "Maglev Consistent Hashing", "Connection Tracking"],
      diagram:
"Incoming 10Gbps TCP Traffic (10,000,000 Packets / Second)\n                         │\n                         ▼\n┌────────────────────────────────────────────────────────┐\n│ Linux Raw Sockets / DPDK Network Driver (Kernel Bypass)│\n└────────────────────────┬───────────────────────────────┘\n                         ▼\n┌────────────────────────────────────────────────────────┐\n│ 5-Tuple Connection Hash (SrcIP, SrcPort, DstIP, DstPort)│\n└────────────────────────┬───────────────────────────────┘\n                         ▼\n┌────────────────────────────────────────────────────────┐\n│ Google Maglev Consistent Hash Lookup Table (M = 65537) │\n│ Guaranteed uniform distribution & minimal re-shuffling │\n└────────────────────────┬───────────────────────────────┘\n                         ▼\n┌────────────────────────────────────────────────────────┐\n│ Direct Server Return (DSR) Packet Encapsulation (IPIP) │\n└────────────────────────┬───────────────────────────────┘\n                         │\n         ┌───────────────┼───────────────┐\n         ▼               ▼               ▼\n  [ Backend App 1 ] [ Backend App 2 ] [ Backend App 3 ]\n  (Backend replies directly to Client IP, bypassing LB for 10x egress throughput!)",
      steps: [
        { title: "Phase 1: Raw Packet Ingestion & Parsing", desc: "Use Linux raw sockets (`AF_PACKET`) or DPDK for zero-copy Ethernet, IP, and TCP packet header parsing." },
        { title: "Phase 2: Maglev Consistent Hashing Algorithm", desc: "Implement Google's Maglev lookup table generation using prime number modulus ($M = 65537$) to ensure uniform distribution and minimal backend re-assignments when nodes join/leave." },
        { title: "Phase 3: Connection Tracking (Conntrack Table)", desc: "Maintain a lock-free hash table tracking active TCP session states (`SYN`, `ESTABLISHED`, `FIN`) so ongoing connections never drop." },
        { title: "Phase 4: Direct Server Return (DSR) & Health Checking", desc: "Implement Direct Server Return (DSR) with IP-in-IP encapsulation: the load balancer handles ingress packets, while backend servers reply directly to the client, maximizing bandwidth." }
      ],
      resources: [
        { title: "Eisenbud et al. — Maglev: A Fast and Reliable Software Network Load Balancer (Google)", url: "https://research.google/pubs/pub44824/" },
        { title: "DPDK: Data Plane Development Kit Architecture", url: "https://www.dpdk.org/" },
        { title: "Direct Server Return (DSR) Architecture Explained", url: "https://www.haproxy.com/blog/layer-4-load-balancing-direct-server-return-mode" }
      ],
      pitfalls: [
        "In Direct Server Return (DSR), backend servers must configure the VIP on a local loopback interface (`dummy0`) without answering ARP requests, otherwise ARP collisions will break the network.",
        "Ensure connection tracking hash tables use lock-free read-copy-update (RCU) data structures to avoid CPU lock contention at 10M+ PPS."
      ],
      interview: [
        "Explain how Direct Server Return (DSR) dramatically increases load balancer egress throughput.",
        "How does Google Maglev's lookup table hashing prevent connection disruption when backend nodes are added or removed?"
      ]
    }
  ]);
})(window.TD = window.TD || {});
