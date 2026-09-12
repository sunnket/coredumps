/* Operating Systems & Networking — files and I/O.

   The module that explains why most programs are not CPU-bound at all, and
   why the fix for a slow program is usually to stop waiting rather than to
   compute faster. */

TD.addLessons("osnet", [

/* ==================================================================== */
{
 t: "File Descriptors, Buffering and Blocking I/O",
 m: "storage",
 lvl: "intermediate",
 s: "Why most programs spend their lives waiting, and the three ways to stop.",
 goal: [
  "Explain what a file descriptor is and why sockets and files share the concept",
  "Distinguish blocking, non-blocking and asynchronous I/O",
  "Recognise and fix a 'too many open files' failure"
 ],
 b: [
  { p: "A typical web service spends the overwhelming majority of its wall-clock time doing nothing — waiting on a disk, a database, or another service. Understanding what that waiting *is* changes how you make programs faster far more than any algorithmic improvement." },

  { h: "Everything is a file descriptor" },
  { p: "When you open a file the kernel returns a small integer. That integer indexes a per-process table of open things — and the same mechanism covers sockets, pipes, terminals and devices. This is the Unix idea that everything is a file, and it is why the same `read()` and `write()` calls work on all of them." },

  { code: { lang: "python", t: "The three that always exist",
    lines: [
     { c: "import sys", w: "" },
     { c: "print(sys.stdin.fileno())", w: "**0** — standard input." },
     { c: "print(sys.stdout.fileno())", w: "**1** — standard output. This is why `2>&1` in a shell means 'send stderr wherever stdout goes'." },
     { c: "print(sys.stderr.fileno())", w: "**2** — standard error. Separate from stdout precisely so you can redirect one without the other." },
     { c: "", w: "" },
     { c: "f = open(\"data.txt\")", w: "" },
     { c: "print(f.fileno())", w: "The next free number, typically 3. Sockets come from the same pool — a process is limited in its *total* open descriptors, not separately per kind.", hi: true }
    ],
    out: "0\n1\n2\n3" } },

  { h: "The limit you will eventually hit" },
  { trap: "`OSError: [Errno 24] Too many open files` is one of the most common production failures, and it is almost always a leak rather than a genuine need for more descriptors. Every file, every socket, every database connection consumes one. A function that opens something on each call without closing it will run correctly for hours and then fail everything at once, when the table fills." },

  { term: { title: "Finding and raising the limit", t: "",
    lines: [
     { c: "ulimit -n", w: "The soft limit for this shell. 1024 is a common default and is low for any server.", out: "1024" },
     { c: "ls /proc/$(pgrep -f myservice)/fd | wc -l", w: "How many a running process currently holds. Watch this climb and you have found a leak.", out: "847" },
     { c: "lsof -p 4821 | tail -5", w: "*What* it is holding — the fastest way to identify which resource is leaking." }
    ] } },

  { vs: { t: "The leak, and the fix", lang: "python",
    bad: { c: "def read_config(path):\n    f = open(path)\n    return json.load(f)", label: "Leaks a descriptor per call",
      w: "Never closed. CPython's reference counting usually closes it eventually, which is worse than never — it works in testing and fails under load, and it does not work at all on PyPy or when an exception keeps the frame alive." },
    good: { c: "def read_config(path):\n    with open(path) as f:\n        return json.load(f)", label: "Closed on every exit path",
      w: "`with` closes the file when the block ends, including when `json.load` raises. This is the entire reason context managers exist, and it applies identically to sockets, database connections and locks." } } },

  { h: "Blocking, non-blocking, asynchronous" },
  { tbl: { t: "Three answers to 'what do I do while waiting'",
    h: ["Model", "What the thread does", "Cost", "Used by"],
    rows: [
     ["**Blocking**", "Stops until the data arrives", "One thread per concurrent operation", "Ordinary `open()`, `requests`"],
     ["**Non-blocking**", "Returns immediately, you poll", "You manage the loop yourself", "Rare directly; used inside frameworks"],
     ["**Async (event loop)**", "Registers interest and runs other work", "One thread, many operations", "`asyncio`, Node.js, nginx"]
    ] } },

  { p: "The event loop is the important one, and it is less magical than it sounds: the kernel provides a call (`epoll` on Linux, `kqueue` on BSD) that says *tell me when any of these thousands of descriptors is ready*. One thread can then service ten thousand connections, because at any instant almost all of them are idle." },

  { code: { lang: "python", t: "The same work, three ways",
    lines: [
     { c: "# blocking: 100 requests, one after another", w: "" },
     { c: "for url in urls:", w: "" },
     { c: "    results.append(requests.get(url))", w: "100 x 200 ms = 20 seconds, almost all of it waiting." },
     { c: "", w: "" },
     { c: "# threads: 100 requests, 20 at a time", w: "" },
     { c: "with ThreadPoolExecutor(20) as ex:", w: "" },
     { c: "    results = list(ex.map(requests.get, urls))", w: "About 1 second. Twenty threads waiting simultaneously — the GIL is released during I/O." },
     { c: "", w: "" },
     { c: "# async: 100 requests, one thread, no thread stacks at all", w: "" },
     { c: "async with aiohttp.ClientSession() as s:", w: "" },
     { c: "    results = await asyncio.gather(*[s.get(u) for u in urls])", w: "About 200 ms — the time of the single slowest request. This scales to thousands where threads would not.", hi: true }
    ],
    after: "Note that none of these made the network faster. They removed the *waiting in series*, which is where the time actually was." } },

  { n: "The rule for choosing, in one line: **threads for hundreds of concurrent waits, async for thousands.** Threads are simpler and integrate with ordinary blocking libraries; async needs the whole stack to cooperate, and one blocking call inside an async function stalls the entire event loop — which is the classic async bug.",
    nt: "Threads or async" },

  { h: "Why disk I/O is different from it used to be" },
  { l: [
   "**A spinning disk** had to physically move a head: a random read cost ~10 ms, and sequential access was 100x faster than random. Databases were designed around that fact.",
   "**An SSD** has no moving parts: random reads are ~100 microseconds, only a few times slower than sequential. Much old advice about avoiding random access is now obsolete.",
   "**The page cache** means a repeated read of the same file usually never touches the disk at all — the kernel serves it from RAM. This is why the second run of a script is so much faster, and why benchmarks must be run more than once."
  ] },

  { tryit: { t: "Find the leak",
    task: "A service works for about six hours, then every request fails with `Errno 24`. Restarting fixes it for another six hours. What is happening, and how would you confirm which resource is leaking?",
    hint: "A failure that arrives on a schedule and resets on restart is an accumulation. What accumulates?",
    sol: { lang: "bash", code: "# A descriptor leak. Something opens a file, socket or connection\n# per request without closing it. The count climbs until it hits\n# ulimit -n, at which point EVERY new open fails at once --\n# which is why the failure is sudden rather than gradual.\n\n# 1. Watch the count climb; this confirms it in minutes rather\n#    than waiting six hours.\nwatch -n 5 \"ls /proc/$(pgrep -f myservice)/fd | wc -l\"\n\n# 2. Identify WHAT is leaking -- group by type:\nlsof -p $(pgrep -f myservice) | awk \"{print \\$5}\" | sort | uniq -c | sort -rn\n#     823 IPv4      <- sockets: an HTTP client or DB pool\n#      12 REG       <- regular files\n\n# 3. The usual suspects, in order of likelihood:\n#    * requests.get() without a Session, or a Session never closed\n#    * database connections taken from a pool and not returned\n#    * open() without a with block\n#    * subprocess pipes never waited on\n\n# Raising the limit is a workaround, not a fix -- it buys hours:\nulimit -n 65536" },
    w: "The diagnostic shape generalises: **a failure that arrives on a schedule and clears on restart is an accumulation.** Descriptors, memory, threads, connections — the specific resource differs but the investigation is the same. Watch the count climb rather than waiting for the failure." } }
 ],
 k: [
  "A file descriptor is a small integer naming an open file, socket or pipe — 0, 1, 2 are always taken.",
  "`Errno 24: too many open files` is nearly always a leak, not a limit that needs raising.",
  "`with` closes on every exit path, including exceptions — this is why it exists.",
  "Blocking uses a thread per wait; an event loop uses one thread for thousands.",
  "A failure that arrives on a schedule and clears on restart is an accumulation."
 ],
 r: ["File Descriptor", "Blocking and Non-Blocking I/O", "Socket", "File System"],
 drill: {
  lang: "bash",
  reps: 3,
  items: [
   { c: "ulimit -n", w: "show the open-file limit" },
   { c: "lsof -p 4821 | tail -5", w: "see what a process currently holds open" },
   { c: "ls /proc/$(pgrep -f myservice)/fd | wc -l", w: "count a process's open descriptors" },
   { c: "with open(path) as f:", w: "open something that closes on every exit path", lang: "python" },
   { c: "results = await asyncio.gather(*tasks)", w: "wait on many operations at once, one thread", lang: "python" }
  ]
 }
}

]);
