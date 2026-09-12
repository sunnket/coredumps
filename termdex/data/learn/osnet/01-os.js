/* Operating Systems & Networking — the OS half.

   Written for someone who can already write a program but has never been told
   what happens when they run it. Every lesson answers a question a working
   engineer actually hits: why is this slow, why did it hang, why does it
   work on my machine.

   Commands are Linux/macOS. Windows equivalents are given where they differ
   in a way that matters. */

TD.addLessons("osnet", [

/* ==================================================================== */
{
 t: "Kernel, User Space, and the System Call",
 m: "osbasics",
 lvl: "core",
 s: "Your program cannot touch the disk, the network, or the screen. Here is what it does instead.",
 goal: [
  "Explain why user space and kernel space are separated",
  "Describe what happens during a system call",
  "Say why a system call is expensive and why that shapes fast code"
 ],
 b: [
  { p: "Your program cannot write to a file. It cannot send a packet, allocate memory, or draw a pixel. Every one of those is done by the **kernel** on your behalf, and understanding that boundary explains a surprising amount of otherwise mysterious behaviour." },

  { h: "Two worlds" },
  { p: "The CPU itself has two modes. In **kernel mode** code may do anything: touch any memory, talk to any device. In **user mode** most of that is forbidden by the hardware. Your program runs in user mode, always." },

  { ana: "A bank. You cannot walk into the vault, however legitimate your business. You fill in a slip and pass it through a window, and a teller — who is allowed in — fetches what you asked for. The window is the system call, and the reason it exists is not distrust of you specifically but that one careless customer in the vault ruins it for everyone.",
    at: "The teller's window" },

  { p: "This is why a bug in your program crashes your program and not the machine. The kernel refuses the illegal operation and kills the process — that is what a segmentation fault *is*." },

  { h: "What a system call actually does" },
  { ol: [
   "Your code puts a number identifying the operation, plus its arguments, into CPU registers.",
   "It executes a special instruction (`syscall` on x86-64) that switches the CPU into kernel mode and jumps to a fixed entry point.",
   "The kernel checks your arguments — is that a file you are allowed to open? — and does the work.",
   "It switches back to user mode and returns, with a result or an error code."
  ] },

  { code: { lang: "python", t: "One innocent line, several trips through the window",
    lines: [
     { c: "with open(\"data.txt\") as f:", w: "`open()` — a system call. The kernel checks permissions, finds the file, and returns a **file descriptor**: a small integer naming this open file." },
     { c: "    text = f.read()", w: "`read()` — one or more system calls. The kernel copies bytes from the page cache (or the disk) into your process's memory." },
     { c: "", w: "" },
     { c: "print(text)", w: "`write()` to file descriptor 1, which is standard output. Printing is a system call too — which is exactly why printing inside a tight loop is so slow." }
    ] } },

  { term: { title: "See them for yourself", t: "`strace` shows every system call a program makes. It is the single best tool for understanding this boundary, and for finding out what a misbehaving program is really doing.",
    lines: [
     { c: "strace -c python -c \"open('/etc/hostname').read()\"",
       w: "`-c` summarises rather than printing every call. On macOS the equivalent is `dtruss`; on Windows, Process Monitor.",
       out: "% time     seconds  usecs/call     calls    errors syscall\n------ ----------- ----------- --------- --------- ----------------\n 24.11    0.000891           3       242           mmap\n 18.33    0.000677           2       273        61 openat\n 11.02    0.000407           1       266           read\n  8.14    0.000301           2       128           close" }
    ] } },
  { p: "Note the numbers: starting Python and reading one small file made hundreds of system calls, most of them looking for files that do not exist (`61 errors` on `openat` — that is the import system searching directories in order)." },

  { h: "Why this makes code slow" },
  { p: "A system call costs roughly one to two microseconds — the mode switch, the argument checking, the cache disruption. That is nothing once, and ruinous a million times." },

  { vs: { t: "Writing a million lines to a file", lang: "python",
    bad: { c: "for line in lines:\n    f.write(line)\n    f.flush()", label: "A system call per line",
      w: "`flush()` forces a `write()` syscall every iteration. A million lines is a million mode switches — several seconds of pure overhead before any disk work happens." },
    good: { c: "f.writelines(lines)", label: "Buffered",
      w: "Python buffers in user space and calls `write()` when the buffer fills — a few thousand syscalls instead of a million. The disk work is identical; the overhead is not." } } },

  { n: "This is the general shape of I/O optimisation, and it recurs everywhere: batch the calls that cross a boundary. It is the same reason one database query beats a hundred, and one HTTP request beats a hundred. The boundary changes; the arithmetic does not.",
    nt: "The pattern to carry forward" },

  { trap: "`print()` inside a loop is the most common accidental performance bug in Python scripts, and people blame the loop. Standard output is line-buffered when attached to a terminal, so each `print` can be a syscall. Redirect to a file and it becomes block-buffered and much faster — which is why the same script mysteriously runs quicker when you pipe it." },

  { tryit: { t: "Predict the difference",
    task: "You have a script that prints 100,000 lines. Running `python script.py` takes 4 seconds; running `python script.py > out.txt` takes 0.3 seconds. The code is identical. Explain it.",
    hint: "Ask what changes about buffering when standard output is not a terminal.",
    sol: { lang: "python", code: "# Python (like C) chooses its buffering based on what stdout IS:\n#\n#   terminal  -> line buffered: a write() syscall per newline\n#   file/pipe -> block buffered (~8 KB): a syscall per 8 KB\n#\n# 100,000 lines is ~100,000 syscalls in the first case and a few\n# hundred in the second. The loop, the formatting and the disk are\n# all the same -- only the number of boundary crossings changed.\n\n# You can force the fast behaviour explicitly:\nimport sys\nsys.stdout.reconfigure(line_buffering=False)\n\n# ...or the slow behaviour, when you NEED output to appear\n# immediately (a long-running job whose logs you are watching):\nprint(msg, flush=True)" },
    w: "This also explains a bug that costs people hours: a program that crashes appears to have printed nothing, because its buffer was never flushed. The output was written — it just never left the buffer. When debugging a crash, use `flush=True` or `python -u`." } }
 ],
 k: [
  "The CPU has two modes; your code always runs in the restricted one.",
  "A system call is the controlled doorway into the kernel — open, read, write, socket.",
  "It costs 1–2 microseconds, so the cost is in the *number* of calls, not the work.",
  "Batching across a boundary is the general optimisation, from syscalls to HTTP.",
  "Buffering depends on where output goes, which is why piping can be 10x faster."
 ],
 r: ["Kernel", "System Call", "File Descriptor", "Operating System"],
 drill: {
  lang: "bash",
  reps: 3,
  items: [
   { c: "strace -c ./program", w: "count the system calls a program makes" },
   { c: "python -u script.py", w: "run unbuffered, so output appears immediately" },
   { c: "print(msg, flush=True)", w: "force this line out of the buffer now", lang: "python" },
   { c: "f.writelines(lines)", w: "one buffered write instead of many", lang: "python" },
   { c: "ltrace ./program", w: "the same idea for library calls rather than syscalls" }
  ]
 }
},

/* ==================================================================== */
{
 t: "Processes, Threads and the Scheduler",
 m: "process",
 lvl: "core",
 s: "How one CPU appears to run fifty programs, and why that illusion costs something.",
 goal: [
  "State the difference between a process and a thread in one sentence",
  "Explain what a context switch is and what it costs",
  "Choose between threads and processes for a given workload"
 ],
 b: [
  { p: "You have four cores and two hundred running programs. The trick is that none of them runs continuously: the kernel gives each a few milliseconds, then switches. Fast enough that everything looks simultaneous." },

  { h: "Process versus thread" },
  { tbl: { t: "The distinction that matters",
    h: ["", "Process", "Thread"],
    rows: [
     ["**Memory**", "Its own, isolated", "Shared with its siblings"],
     ["**Crash**", "Contained — others survive", "Usually takes the whole process down"],
     ["**Communication**", "Explicit: pipes, sockets, shared memory", "Just read the same variable"],
     ["**Creation cost**", "Expensive (~1 ms)", "Cheap (~0.1 ms)"],
     ["**The danger**", "Wasted memory", "Race conditions"]
    ] } },
  { p: "In one line: **a process is an isolated program; a thread is one path of execution inside it.** Threads share memory, which makes them fast to talk between and dangerous to get wrong." },

  { h: "The context switch" },
  { p: "To switch from one thread to another the kernel must save every register, the program counter and the stack pointer, then load the next thread's. That is perhaps a microsecond — but the real cost is invisible: the CPU caches are now full of the *old* thread's data, and the new one runs slowly until they refill." },

  { num: null },
  { l: [
   "**Direct cost** — saving and restoring registers: around 1–2 microseconds.",
   "**Indirect cost** — cache and TLB pollution: often 10–100 microseconds of degraded performance afterwards.",
   "**Consequence** — more threads is not more speed. Past a point you are paying to shuffle work rather than do it."
  ] },

  { trap: "Creating one thread per request sounds natural and fails badly at scale: 10,000 threads means 10,000 stacks (8 MB of virtual address space each by default) and a scheduler thrashing between them. This is precisely why event loops and async I/O exist — one thread handling ten thousand connections, because those connections are almost always *waiting*, not computing." },

  { h: "Which one do you want?" },
  { code: { lang: "python", file: "choosing.py", t: "The rule, in Python terms",
    lines: [
     { c: "# CPU-bound: hashing, image processing, model inference", w: "" },
     { c: "from multiprocessing import Pool", w: "**Processes.** Python's GIL means threads cannot run bytecode in parallel, so threads give you nothing here. Processes have their own interpreter and their own GIL.", hi: true },
     { c: "with Pool(4) as p:", w: "" },
     { c: "    results = p.map(heavy_computation, items)", w: "" },
     { c: "", w: "" },
     { c: "# I/O-bound: HTTP requests, database queries, file reads", w: "" },
     { c: "from concurrent.futures import ThreadPoolExecutor", w: "**Threads.** The GIL is released while waiting on I/O, so threads genuinely overlap here.", hi: true },
     { c: "with ThreadPoolExecutor(32) as ex:", w: "" },
     { c: "    results = list(ex.map(fetch, urls))", w: "" },
     { c: "", w: "" },
     { c: "# I/O-bound at large scale: thousands of connections", w: "" },
     { c: "import asyncio", w: "**One thread, no switching.** The cheapest option when the work is almost entirely waiting.", hi: true },
     { c: "results = await asyncio.gather(*[fetch(u) for u in urls])", w: "" }
    ],
    after: "The decision is one question: **is this work waiting, or computing?** Waiting wants threads or async; computing wants processes. Getting this backwards is the most common concurrency mistake in Python." } },

  { n: "The Global Interpreter Lock is a Python-specific detail, and it is the reason this advice is not universal. In Java, Go or Rust, threads do run CPU work in parallel and the process/thread choice is about isolation instead. Python 3.13 introduced an experimental free-threaded build that removes the GIL, but the advice above holds for the versions you will meet in production.",
    nt: "Why this is Python-specific" },

  { term: { title: "Looking at what is running", t: "The three commands worth having in your fingers.",
    lines: [
     { c: "ps aux | grep python", w: "Every process, filtered. `%CPU` and `%MEM` are the columns you want." },
     { c: "top -o %CPU", w: "Live, sorted by CPU. `htop` is nicer if you can install it." },
     { c: "cat /proc/loadavg", w: "Load average over 1, 5 and 15 minutes.",
       out: "2.31 1.87 1.42 3/512 28931" }
    ] } },
  { p: "**Load average** confuses everyone. It is not a percentage — it is the average number of processes wanting to run. On a 4-core machine, 4.0 means fully busy; 8.0 means twice as much work as capacity, so everything is waiting. Compare it to your core count, never to 100." },

  { tryit: { t: "Diagnose the slowdown",
    task: "A Python service handling web requests uses a `ThreadPoolExecutor` with 200 threads. Under load, CPU sits near 100% but throughput is *worse* than with 20 threads. What is happening?",
    hint: "Two things could cause this. Ask what the work actually is, and what 200 threads cost.",
    sol: { lang: "python", code: "# Two causes, and they compound:\n#\n# 1. Context-switch thrashing. 200 runnable threads on 4 cores\n#    means the scheduler spends much of its time switching rather\n#    than running, and every switch cold-starts the CPU caches.\n#\n# 2. If the work is CPU-bound, the GIL serialises it anyway --\n#    200 threads take turns holding one lock, so you added\n#    overhead and no parallelism whatsoever.\n\n# The fix depends on which it is. Measure first:\n#   mostly waiting on I/O  -> fewer threads, or asyncio\n#   mostly computing       -> ProcessPoolExecutor, sized to cores\n\nimport os\nfrom concurrent.futures import ProcessPoolExecutor\n\n# a sane default for CPU work: one worker per core\nwith ProcessPoolExecutor(os.cpu_count()) as ex:\n    ...\n\n# and for I/O work, tens -- not hundreds\nwith ThreadPoolExecutor(min(32, (os.cpu_count() or 1) * 4)) as ex:\n    ..." },
    w: "The general lesson: concurrency has a cost curve, not a straight line. There is an optimum, it is usually much lower than people guess, and past it you are paying to shuffle work instead of doing it." } }
 ],
 k: [
  "A process is isolated; a thread shares memory with its siblings.",
  "A context switch costs microseconds directly and far more in lost cache.",
  "CPU-bound work wants processes; I/O-bound work wants threads or async.",
  "Python's GIL means threads never run bytecode in parallel — this is Python-specific.",
  "Load average is a count of processes wanting to run — compare it to your core count."
 ],
 r: ["Process", "Thread", "Context Switch", "Concurrency", "Load Average"],
 drill: {
  lang: "bash",
  reps: 3,
  items: [
   { c: "ps aux | grep python", w: "find running processes by name" },
   { c: "top -o %CPU", w: "watch processes sorted by CPU use" },
   { c: "cat /proc/loadavg", w: "read the load average" },
   { c: "with ProcessPoolExecutor(os.cpu_count()) as ex:", w: "one worker per core, for CPU-bound work", lang: "python" },
   { c: "results = await asyncio.gather(*tasks)", w: "run many I/O operations concurrently on one thread", lang: "python" }
  ]
 }
},

/* ==================================================================== */
{
 t: "Virtual Memory, and What Running Out Looks Like",
 m: "memory",
 lvl: "core",
 s: "Why every program thinks it owns the whole machine, and what the OOM killer is.",
 goal: [
  "Explain what virtual memory buys and what it costs",
  "Distinguish the stack from the heap and know which errors come from each",
  "Recognise thrashing and an OOM kill from their symptoms"
 ],
 b: [
  { p: "Every process believes it has a vast, private, contiguous block of memory starting at address zero. All three parts of that are a lie the kernel maintains, and the lie is what makes modern computing possible." },

  { h: "The mapping" },
  { p: "Your program uses **virtual addresses**. The CPU translates each one to a **physical address** using page tables the kernel maintains, in 4 KB chunks called **pages**. That indirection buys three things at once:" },
  { l: [
   "**Isolation.** Process A's address `0x1000` and process B's are different physical memory. Neither can touch the other, and this is enforced by hardware.",
   "**Overcommit.** You can allocate more than physically exists, because pages are only backed by real memory when actually touched.",
   "**Swapping.** A page can live on disk instead of in RAM, and be fetched when accessed."
  ] },

  { p: "That third one is where the pain lives. Accessing a page that is not in RAM causes a **page fault**: the CPU traps to the kernel, which fetches it from disk, and your program resumes as if nothing happened. It is transparent, and it is roughly a hundred thousand times slower than a normal memory access." },

  { h: "Stack and heap" },
  { tbl: { t: "Two regions, two failure modes",
    h: ["", "Stack", "Heap"],
    rows: [
     ["**Holds**", "Local variables, function call frames", "Anything you allocate dynamically"],
     ["**Managed by**", "Automatic — grows and shrinks with calls", "You, or a garbage collector"],
     ["**Speed**", "Very fast; it is one pointer moving", "Slower; must find a free block"],
     ["**Size**", "Small and fixed (8 MB typical)", "Large, grows on demand"],
     ["**Its error**", "`StackOverflowError` / segfault", "`MemoryError` / OOM kill"]
    ] } },

  { code: { lang: "python", t: "Hitting each one deliberately",
    lines: [
     { c: "def recurse(n):", w: "" },
     { c: "    return recurse(n + 1)", w: "Each call adds a frame to the stack and never removes it." },
     { c: "recurse(0)", w: "`RecursionError`. Python stops at 1000 frames on purpose — without that limit this would be a segfault, which is far harder to debug.", hi: true },
     { c: "", w: "" },
     { c: "data = [0] * (10 ** 10)", w: "Ten billion Python ints on the heap. `MemoryError` if you are lucky; if the kernel overcommitted, the OOM killer arrives instead and the process simply vanishes.", hi: true }
    ] } },

  { h: "Thrashing and the OOM killer" },
  { p: "When RAM runs short, the kernel starts swapping pages to disk. If the working set genuinely does not fit, pages are evicted and immediately needed again — **thrashing**. The machine is not slow because it is busy computing; it is busy moving pages, and it will do so indefinitely." },

  { trap: "Thrashing looks like a hang, and it is worse than a crash. CPU appears low, disk I/O is at maximum, and everything — including your SSH session — takes minutes. On Linux, the giveaway is high `si`/`so` (swap in/out) in `vmstat`. A machine that has run out of memory honestly is usually more useful than one slowly grinding, which is why many servers disable swap entirely." },

  { term: { title: "Checking memory properly", t: "",
    lines: [
     { c: "free -h", w: "The line that matters is **available**, not free. Linux uses spare RAM as disk cache and will hand it back on demand, so 'free' looks alarmingly low on a healthy machine.",
       out: "               total        used        free      shared  buff/cache   available\nMem:            15Gi       6.2Gi       412Mi       1.1Gi       9.0Gi       7.9Gi\nSwap:          2.0Gi       128Mi       1.9Gi" },
     { c: "vmstat 1 5", w: "`si` and `so` are swap in and out. Anything sustained above zero means you are short of memory." },
     { c: "dmesg | grep -i 'killed process'", w: "Did the OOM killer take your process? This is the first thing to check when a service disappears with no traceback and no log.",
       out: "[12345.678] Out of memory: Killed process 4821 (python) total-vm:8123456kB" }
    ] } },

  { n: "A process that vanishes with no exception, no traceback and no log entry was almost certainly OOM-killed. Python cannot catch it — the kernel sends SIGKILL, which is not deliverable to the program. `dmesg` is the only place it is recorded, and knowing to look there saves hours.",
    nt: "The silent death" },

  { tryit: { t: "Read the symptom",
    task: "A training job runs fine for 40 minutes, then the process disappears. No traceback, no Python error, and the log simply stops mid-line. What happened, and where do you confirm it?",
    hint: "An exception always produces a traceback. What kills a process without giving it a chance to say anything?",
    sol: { lang: "bash", code: "# Almost certainly the OOM killer. SIGKILL cannot be caught or\n# handled, so there is no traceback, no atexit handler, and no\n# final log line -- the process is simply gone.\n\n# Confirm:\ndmesg -T | grep -i 'killed process'\n#   [Mon Sep  1 14:22:03] Out of memory: Killed process 4821\n#   (python) total-vm:31842916kB, anon-rss:15903112kB\n\n# Or on a systemd service:\njournalctl -u myservice | grep -i oom\n\n# Common causes in a training job that dies at 40 minutes rather\n# than immediately -- all of them accumulate:\n#   * appending to a list every step (loss history, predictions)\n#   * keeping tensors that still carry their computation graph\n#     -> use loss.item() or .detach(), never keep the graph\n#   * a DataLoader with too many workers, each holding a batch\n#   * validation running without torch.no_grad()" },
    w: "The 'works for 40 minutes then dies' shape is the signature of a leak rather than a sizing error — a job too large for the machine fails in the first minute. Something is growing per step, and `loss` retaining its graph is the most common culprit in PyTorch." } }
 ],
 k: [
  "Virtual memory gives every process a private address space, mapped in 4 KB pages.",
  "A page fault fetches from disk transparently, and is ~100,000x slower than RAM.",
  "The stack is small, fast and automatic; the heap is large, slower and manual.",
  "Thrashing looks like a hang: low CPU, maximum disk, sustained swap in/out.",
  "A process that vanishes with no traceback was OOM-killed — check `dmesg`."
 ],
 r: ["Virtual Memory", "Paging", "Page Fault", "Stack", "Heap"],
 drill: {
  lang: "bash",
  reps: 3,
  items: [
   { c: "free -h", w: "check memory — read the available column" },
   { c: "vmstat 1 5", w: "watch swap in/out for signs of thrashing" },
   { c: "dmesg -T | grep -i 'killed process'", w: "find out whether the OOM killer struck" },
   { c: "journalctl -u myservice | grep -i oom", w: "the same check for a systemd service" },
   { c: "ulimit -s", w: "show the stack size limit for this shell" }
  ]
 }
},

/* ==================================================================== */
{
 t: "Concurrency: Races, Locks and Deadlock",
 m: "concurrency",
 lvl: "intermediate",
 s: "Why correct-looking code produces wrong answers only sometimes, and only in production.",
 goal: [
  "Explain a race condition in terms of non-atomic operations",
  "Use a lock correctly and say what it costs",
  "Name the four conditions for deadlock and how to break one"
 ],
 b: [
  { p: "Sequential code is either right or wrong. Concurrent code can be right a million times and wrong on the million-and-first, and only under load, and never on your laptop. That is not bad luck — it is a specific, understandable class of bug." },

  { h: "The race condition" },
  { p: "`counter += 1` looks like one operation. It is three: read the value, add one, write it back. Two threads can interleave those steps and lose an update." },

  { code: { lang: "python", t: "Losing increments",
    lines: [
     { c: "counter = 0", w: "" },
     { c: "", w: "" },
     { c: "def worker():", w: "" },
     { c: "    global counter", w: "" },
     { c: "    for _ in range(100_000):", w: "" },
     { c: "        counter += 1", w: "**Read, add, write.** Thread A reads 41; thread B reads 41; both write 42. One increment vanished.", hi: true },
     { c: "", w: "" },
     { c: "threads = [Thread(target=worker) for _ in range(4)]", w: "" },
     { c: "for t in threads: t.start()", w: "" },
     { c: "for t in threads: t.join()", w: "" },
     { c: "print(counter)", w: "Expected 400,000. You will get something less, and a different number each run." }
    ],
    out: "387412",
    after: "The number varies per run, which is the signature of a race. A bug that produces a *different* wrong answer each time is almost always concurrency." } },

  { h: "Locks" },
  { code: { lang: "python", t: "One thread at a time through the critical section",
    lines: [
     { c: "lock = Lock()", w: "" },
     { c: "", w: "" },
     { c: "def worker():", w: "" },
     { c: "    global counter", w: "" },
     { c: "    for _ in range(100_000):", w: "" },
     { c: "        with lock:", w: "**Acquire, and release automatically on the way out** — including if the body raises. A manual `acquire()`/`release()` pair leaks the lock on an exception and hangs every other thread forever.", hi: true },
     { c: "            counter += 1", w: "Now indivisible with respect to other threads holding this lock." }
    ],
    out: "400000" } },

  { p: "Correct, and slower. A lock serialises everything inside it, so a lock around too much work turns concurrent code back into sequential code with extra overhead. **Hold a lock for the shortest possible time** — this is the whole craft of it." },

  { h: "Deadlock" },
  { p: "Two threads each hold a lock the other needs, and both wait forever. It requires four conditions simultaneously, and breaking *any one* prevents it:" },
  { ol: [
   "**Mutual exclusion** — the resource cannot be shared.",
   "**Hold and wait** — a thread holds one lock while requesting another.",
   "**No preemption** — a lock cannot be taken away.",
   "**Circular wait** — A waits on B, B waits on A."
  ] },

  { vs: { t: "Transferring money between accounts", lang: "python",
    bad: { c: "def transfer(a, b, amount):\n    with a.lock:\n        with b.lock:\n            a.balance -= amount\n            b.balance += amount", label: "Deadlocks",
      w: "`transfer(x, y)` and `transfer(y, x)` running together: the first holds x and wants y, the second holds y and wants x. Both wait forever. It is rare, so it reaches production." },
    good: { c: "def transfer(a, b, amount):\n    first, second = sorted((a, b), key=id)\n    with first.lock:\n        with second.lock:\n            a.balance -= amount\n            b.balance += amount", label: "Ordered acquisition",
      w: "Always take locks in a consistent global order — here by object id. This breaks **circular wait**, and it is the standard fix because it needs no coordination between threads at all." } } },

  { n: "The four conditions are worth memorising as a checklist, because each suggests a different fix: a lock-free structure removes mutual exclusion, acquiring everything at once removes hold-and-wait, a timeout adds preemption, and consistent ordering removes circular wait. Ordering is usually the cheapest.",
    nt: "Four conditions, four fixes" },

  { trap: "Concurrency bugs do not reproduce reliably, so the temptation is to add a `sleep` until the symptom disappears. That does not fix anything — it changes the timing so the interleaving becomes rare, and it will come back under different load. If you cannot explain *why* a fix works, it has not worked." },

  { tryit: { t: "Spot the race",
    task: "This cache looks thread-safe because each operation is quick. Two threads call `get_or_compute(\"x\")` at the same time and `expensive()` runs twice. Why, and what is the fix?\n\n`if key not in cache: cache[key] = expensive(key)` then `return cache[key]`",
    hint: "Between the check and the assignment, what else can run?",
    sol: { lang: "python", code: "# Check-then-act. The gap between 'not in cache' and the\n# assignment is a window where another thread can run the same\n# check, also find it missing, and also compute.\n#\n#   T1: 'x' not in cache -> True\n#   T2: 'x' not in cache -> True     <-- both decided to compute\n#   T1: cache['x'] = expensive('x')\n#   T2: cache['x'] = expensive('x')  <-- wasted, and possibly\n#                                        a different object\n\n# Fix 1 -- a lock, re-checking inside it (double-checked locking):\ndef get_or_compute(key):\n    if key in cache:              # fast path, no lock\n        return cache[key]\n    with lock:\n        if key not in cache:      # re-check: another thread may\n            cache[key] = expensive(key)   # have filled it while\n        return cache[key]                 # we waited for the lock\n\n# Fix 2 -- let the standard library own the problem:\nfrom functools import lru_cache\n\n@lru_cache(maxsize=None)\ndef expensive(key): ...\n\n# The re-check inside the lock is the part people omit, and\n# without it the lock buys you nothing at all." },
    w: "Check-then-act is the most common race shape in application code, and it appears far beyond caches: 'if not exists, create', 'if balance sufficient, withdraw', 'if not locked, lock'. Whenever you see a check followed by an action that depends on it, ask what could happen in between." } }
 ],
 k: [
  "A race condition is an operation that looks atomic and is not — read, modify, write.",
  "A varying wrong answer across runs is the signature of a concurrency bug.",
  "Use `with lock:` so the lock is released even when the body raises.",
  "Deadlock needs four conditions; breaking any one prevents it, and ordering is cheapest.",
  "Check-then-act is the most common race shape: the gap between the two is the bug."
 ],
 r: ["Race Condition", "Deadlock", "Mutex", "Concurrency", "Thread"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "with lock:", w: "enter a critical section, releasing on any exit" },
   { c: "first, second = sorted((a, b), key=id)", w: "impose a global lock order to prevent deadlock" },
   { c: "threads = [Thread(target=worker) for _ in range(4)]", w: "create a pool of worker threads" },
   { c: "for t in threads: t.join()", w: "wait for every thread to finish" },
   { c: "lock.acquire(timeout=5)", w: "take a lock but refuse to wait forever" }
  ]
 }
}

]);
