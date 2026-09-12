const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'data', 'guides.js');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add "hacks" group to TD.guideGroups if not present
if (!content.includes('id: "hacks"')) {
  console.log('Adding "hacks" group to TD.guideGroups...');
  content = content.replace(
    'TD.guideGroups = [',
    'TD.guideGroups = [\n    { id: "hacks", n: "Hardcore Engineer Hacks", c: "#f43f5e" },'
  );
}

// 2. The 34 previous hack guides to assign to "hacks" category
const prevHackIds = [
  "reverse-search-history",
  "xargs-parallel-processing",
  "alias-functions-that-save-hours",
  "ssh-tunnel-port-forwarding",
  "dns-how-domains-work",
  "network-sniffing-wireshark-tcpdump",
  "process-explorer-what-is-eating-my-cpu",
  "environment-variables-deep-dive",
  "cron-jobs-scheduled-tasks",
  "git-reflog-undo-anything",
  "git-bisect-find-breaking-commit",
  "find-exposed-secrets-in-code",
  "vscode-multi-cursor-magic",
  "vscode-snippets-code-templates",
  "chrome-devtools-performance-profiling",
  "docker-exec-into-running-container",
  "jq-json-swiss-army-knife",
  "sed-awk-text-transformation",
  "zero-downtime-deployment",
  "prompt-injection-defense",
  "strace-system-call-spy",
  "memory-leak-heap-snapshot",
  "curl-latency-profiling",
  "ramdisk-tmpfs-speedup",
  "sql-explain-analyze-deep",
  "db-connection-pooling-tuning",
  "subprocess-ipc-deadlocks",
  "docker-distroless-security",
  "mitmproxy-api-reverse-engineer",
  "hybrid-search-rrf-rag",
  "linux-systemd-service-mastery",
  "git-blame-ignore-revs",
  "mkcert-local-https-trusted",
  "cut-sort-uniq-log-pipelines"
];

prevHackIds.forEach(id => {
  const reg = new RegExp('(id:\\s*"' + id + '"[\\s\\S]*?g:\\s*)"[^"]+"', 'm');
  content = content.replace(reg, '$1"hacks"');
});

console.log('Updated previous hack guides to "hacks" group.');

// 3. Define the 14 new deep hacks from the PDF
const newPdfHacks = [
  {
    id: "windows-job-objects-resource-limits",
    t: "Cap CPU and memory of runaway Python processes using Windows Job Objects",
    g: "hacks",
    mins: 8,
    diff: "advanced",
    why: "On Linux, engineers use cgroups to prevent memory leaks from crashing the machine. On Windows, the equivalent kernel feature is Windows Job Objects. A Job Object acts as a sandbox that groups processes and enforces hard limits on commit memory, CPU rate, and process lifetime. If your Python script leaks RAM or spins into an infinite loop, Windows throttles or terminates only that job — keeping your OS responsive.",
    need: ["Windows 10 or 11", "PowerShell 5.1+ or PowerShell 7", "Python 3.9+ with pywin32 (`pip install pywin32`)"],
    steps: [
      {
        do: "Understand Windows Job Objects: the kernel mechanism behind Docker for Windows and Windows Sandbox.",
        out: "A Job Object is a securable kernel object that manages groups of processes as a single unit. It enforces limits that cannot be bypassed by child processes, including Max Commit Memory (hard ceiling), Working Set (RAM paging), CPU rate percentage, and Active Process Count.",
        note: "When a process inside a Job Object exceeds the memory ceiling, the Windows memory manager denies the allocation (raising MemoryError in Python) or terminates the job immediately if configured. The rest of Windows never stutters."
      },
      {
        do: "Install the Python Windows extensions package to access Windows kernel APIs.",
        cmd: "pip install pywin32",
        out: "Successfully installed pywin32",
        note: "pywin32 provides direct C-level bindings to win32api, win32job, and win32process. This allows pure Python scripts to invoke kernel32.dll APIs natively on Windows without C++ compilers."
      },
      {
        do: "Create a Python script `job_sandbox.py` that clamps memory to 500 MB and caps CPU.",
        cmd: "# Create job_sandbox.py in PowerShell:\n@'\nimport win32job, win32api, win32process, os, sys\n\n# 1. Create a named or anonymous kernel Job Object\njob = win32job.CreateJobObject(None, \"PythonMemorySandbox\")\n\n# 2. Query the current extended limit structure\nlimits = win32job.QueryInformationJobObject(job, win32job.JobObjectExtendedLimitInformation)\n\n# 3. Set the hard commit memory limit to 500 MB\nMEMORY_LIMIT_BYTES = 500 * 1024 * 1024  # 500 MB\nlimits['ProcessMemoryLimit'] = MEMORY_LIMIT_BYTES\nlimits['JobMemoryLimit'] = MEMORY_LIMIT_BYTES\nlimits['BasicLimitInformation']['LimitFlags'] = (\n    win32job.JOB_OBJECT_LIMIT_PROCESS_MEMORY |\n    win32job.JOB_OBJECT_LIMIT_JOB_MEMORY |\n    win32job.JOB_OBJECT_LIMIT_KILL_ON_JOB_CLOSE  # Kills worker if sandbox exits\n)\n\n# 4. Commit limits to the Windows kernel\nwin32job.SetInformationJobObject(job, win32job.JobObjectExtendedLimitInformation, limits)\n\n# 5. Assign current process to this Job Object\nh_process = win32api.GetCurrentProcess()\nwin32job.AssignProcessToJobObject(job, h_process)\nprint(f\"[+] Windows Job Object active for PID {os.getpid()}! Hard cap: 500 MB RAM\")\n'@ | Set-Content -Path job_sandbox.py",
        out: "Created job_sandbox.py with kernel limit configuration.",
        note: "Notice JOB_OBJECT_LIMIT_KILL_ON_JOB_CLOSE: if the parent launcher crashes or is closed, Windows automatically terminates every child process inside the job. No zombie background Python processes left running!"
      },
      {
        do: "Test the memory ceiling by trying to allocate 800 MB inside the sandboxed process.",
        cmd: "# Run Python to verify the hard limit is enforced:\npython -c \"import job_sandbox; print('Allocating memory...'); data = bytearray(800 * 1024 * 1024)\"",
        out: "[+] Windows Job Object active for PID 8412! Hard cap: 500 MB RAM\nAllocating memory...\nMemoryError",
        note: "The OS kernel intercepted the memory allocation at exactly 500 MB and refused to commit more pages. The script caught MemoryError cleanly and your PC remained 100% smooth!"
      },
      {
        do: "Inspect the Job Object live from PowerShell using Get-Process and counter queries.",
        cmd: "Get-Process -Id (Get-Process python).Id | Select-Object Id, ProcessName, WorkingSet64, PeakWorkingSet64, PM",
        out: "Id   ProcessName WorkingSet64 PeakWorkingSet64        PM\n--   ----------- ------------ -----------------        --\n8412 python          28434432          49856512 524288000",
        note: "PM (Pageable Memory) shows the exact commitment capped at the 500 MB ceiling. In Task Manager (Details tab), you can also right-click columns and check 'Commit Size' to observe the kernel ceiling in action."
      }
    ],
    fix: [
      { p: "ImportError: DLL load failed while importing win32job", s: "Run `python Scripts/pywin32_postinstall.py -install` in an elevated PowerShell to register the pywin32 system DLLs." },
      { p: "Access Denied when assigning process to Job Object", s: "Processes running inside Windows Sandbox or certain IDE debuggers are already attached to a root Job Object. Set breakaway flags or run directly in PowerShell." }
    ],
    next: ["process-explorer-what-is-eating-my-cpu", "subprocess-ipc-deadlocks"]
  },

  {
    id: "windows-tcp-tuning-socket-exhaustion",
    t: "Diagnose socket exhaustion and tune Windows TCP network stack in PowerShell",
    g: "hacks",
    mins: 7,
    diff: "advanced",
    why: "High-concurrency Python servers, scrapers, and microservices on Windows frequently fail with WSAENOBUFS (10055): 'An operation on a socket could not be performed because the system lacked sufficient buffer space'. This is socket exhaustion. By default, Windows holds closed TCP connections in TIME_WAIT for 4 minutes and provides only ~16,000 dynamic ports. Hardcore engineers monitor active sockets in PowerShell and tune TCP autotuning and port ranges.",
    need: ["Windows PowerShell running as Administrator"],
    steps: [
      {
        do: "Audit all active and lingering TCP connections in PowerShell grouped by connection state.",
        cmd: "Get-NetTCPConnection | Group-Object State | Select-Object Count, Name | Sort-Object Count -Descending",
        out: "Count Name\n----- ----\n 3280 TimeWait\n  142 Established\n   28 Listen\n    4 CloseWait",
        note: "If TimeWait count is in the thousands, closed client/server connections are lingering in the TCP TIME_WAIT state for 240 seconds by default. When the ephemeral port range fills up, any new outgoing connection fails with error 10055."
      },
      {
        do: "Check the current Windows ephemeral dynamic port range for outbound connections.",
        cmd: "netsh int ipv4 show dynamicport tcp",
        out: "Protocol tcp Dynamic Port Range\n---------------------------------\nStart Port      : 49152\nNumber of Ports : 16384",
        note: "By default, Windows allocates ports 49152 to 65535 (16,384 ports) for ephemeral connections. A fast Python scraper opening 100 requests/second will exhaust 16,000 ports in less than 3 minutes!"
      },
      {
        do: "Expand the dynamic ephemeral port range to 64,510 available ports.",
        cmd: "netsh int ipv4 set dynamicport tcp start=1025 num=64510",
        out: "Ok.",
        note: "This expands the outbound socket capacity from 16,384 to 64,510 simultaneous connections, matching high-scale Linux server configurations."
      },
      {
        do: "Verify and enable TCP Window Auto-Tuning for maximum throughput on gigabit connections.",
        cmd: "netsh int tcp set global autotuninglevel=normal",
        out: "Ok.",
        note: "In older or misconfigured Windows installations, TCP Auto-Tuning is set to 'disabled' or 'restricted', capping TCP receive window size to 64 KB and severely bottlenecking high-bandwidth file transfers and API streams."
      },
      {
        do: "Inspect which processes hold the most open network connections using PowerShell.",
        cmd: "Get-NetTCPConnection -State Established | Group-Object OwningProcess | Sort-Object Count -Descending | Select-Object -First 5 Count, @{N='Process'; E={(Get-Process -Id $_.Name -ErrorAction SilentlyContinue).ProcessName}}",
        out: "Count Process\n----- -------\n  112 python\n   45 msedge\n   12 node",
        note: "This pinpointed the exact process ID creating sockets. If your Python script shows hundreds of established connections, ensure you are using a connection pool (like `requests.Session()` or `httpx.Client()`) rather than re-establishing TLS on every request."
      }
    ],
    fix: [
      { p: "The requested operation requires elevation (Run as administrator)", s: "Right-click PowerShell and select 'Run as Administrator' before running netsh commands." },
      { p: "Resetting TCP stack to factory defaults if misconfigured", s: "Run `netsh int ip reset` and `netsh winsock reset` in an admin PowerShell, then reboot." }
    ],
    next: ["network-sniffing-wireshark-tcpdump", "db-connection-pooling-tuning"]
  },

  {
    id: "powershell-fzf-ripgrep-supercharged",
    t: "Supercharge Windows PowerShell with Ripgrep, FZF, and PSReadLine menu completion",
    g: "hacks",
    mins: 6,
    diff: "intermediate",
    why: "Searching code with default Windows File Explorer or cycling through terminal history with the up arrow is painfully slow. Ripgrep (rg) searches gigabytes of code in milliseconds, while fzf provides an interactive fuzzy search interface. Integrating them into your PowerShell $PROFILE gives you a lightning-fast command-line workspace that rivals any Linux terminal setup.",
    need: ["PowerShell 5.1+ or PowerShell 7", "winget package manager (built into Windows 10/11)"],
    steps: [
      {
        do: "Install ripgrep and fzf in Windows using the native winget package manager.",
        cmd: "winget install BurntSushi.ripgrep.MSVC; winget install junegunn.fzf",
        out: "Successfully installed ripgrep and fzf",
        note: "ripgrep (rg) is written in Rust and uses SIMD acceleration to search files 10x faster than GNU grep. fzf is a general-purpose command-line fuzzy finder written in Go."
      },
      {
        do: "Find your PowerShell profile file path and verify it exists.",
        cmd: "if (!(Test-Path $PROFILE)) { New-Item -ItemType File -Path $PROFILE -Force }; notepad $PROFILE",
        out: "Opens your PowerShell profile script in Notepad.",
        note: "$PROFILE is the PowerShell equivalent of ~/.bashrc or ~/.zshrc. Every command and function inside it executes automatically whenever you open a new PowerShell window."
      },
      {
        do: "Add PSReadLine menu completion and prediction to your PowerShell profile.",
        cmd: "# Append power settings to your $PROFILE in PowerShell:\n@'\n# 1. Enable interactive Tab menu completion (cycle visually with arrow keys)\nSet-PSReadLineKeyHandler -Key Tab -Function MenuComplete\n\n# 2. History prediction matching what you type\nSet-PSReadLineOption -PredictionSource History\nSet-PSReadLineOption -HistorySearchCursorMovesToEnd\n\n# 3. Quick fuzzy file picker helper using fzf and ripgrep\nfunction fzopen {\n    $file = rg --files --hidden --glob \"!.git/*\" | fzf --preview \"bat --color=always {}\"\n    if ($file) { code $file }\n}\nSet-Alias -Name fe -Value fzopen\n'@ | Add-Content -Path $PROFILE",
        out: "Settings appended to your PowerShell profile.",
        note: "MenuComplete turns the Tab key into an interactive grid of options you can navigate with arrow keys instead of cycling blindly."
      },
      {
        do: "Reload your profile without restarting PowerShell and test interactive search.",
        cmd: ". $PROFILE",
        out: "PowerShell profile reloaded successfully.",
        note: "The dot (.) followed by a space and script path executes the file in the current scope. All new aliases and functions are immediately available."
      },
      {
        do: "Search across 10,000 files in under 0.2 seconds using ripgrep with file type filters.",
        cmd: "rg -t py \"class .*Error\" --stats",
        out: "24 matches\n18 lines searched\n0.048 seconds",
        note: "The `-t py` flag limits the search to Python files (`*.py`). Ripgrep automatically respects your `.gitignore` file, ignoring `node_modules`, `.venv`, and build artifacts by default."
      }
    ],
    fix: [
      { p: "File cannot be loaded because running scripts is disabled on this system", s: "Run `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser` in PowerShell." },
      { p: "fzf or rg is not recognized as the name of a cmdlet", s: "Close and reopen PowerShell so the newly installed winget directory is refreshed in your $env:PATH." }
    ],
    next: ["powershell-profile-tuning", "reverse-search-history"]
  },

  {
    id: "windows-pktmon-packet-capture",
    t: "Capture and sniff network traffic on Windows without Wireshark using native PktMon",
    g: "hacks",
    mins: 7,
    diff: "intermediate",
    why: "When debugging an API communication failure or mystery outbound connection on a Windows server where third-party software installations are forbidden, you cannot install Wireshark or Npcap. Windows 10 (Build 1903+) and Windows 11 include pktmon.exe directly in System32 — a kernel-level packet monitoring diagnostic tool that exports straight to .pcapng.",
    need: ["Windows 10 (1903+) or Windows 11", "PowerShell running as Administrator"],
    steps: [
      {
        do: "Verify PktMon is installed and list all network adapters and packet components.",
        cmd: "pktmon comp list",
        out: "ID   Driver       Name\n--   ------       ----\n 1   vmswitch     vEthernet (Default Switch)\n 9   netadaptercx Wi-Fi\n14   tcpip        TCP/IP Protocol Driver",
        note: "pktmon hooks directly into the Windows NDIS (Network Driver Interface Specification) stack. It can capture packets at the physical adapter level, virtual switch level, or protocol filter level."
      },
      {
        do: "Create a focused filter to capture only HTTP/HTTPS traffic (ports 80 and 443).",
        cmd: "pktmon filter add WebTraffic -p 80 443",
        out: "Filter added successfully.",
        note: "Never capture unfiltered traffic on a busy machine: packet buffers will overflow within seconds. A filter ensures pktmon captures only the port or IP address you are debugging."
      },
      {
        do: "Start live packet capture with full payload logging.",
        cmd: "pktmon start --capture --pkt-size 0 --file-name my_trace.etl",
        out: "Active log file: C:\\Users\\aryan\\my_trace.etl\nData collection started.",
        note: "The `--pkt-size 0` flag captures the complete packet payload instead of truncating at 128 bytes. This allows you to inspect HTTP headers, JSON bodies, and API responses."
      },
      {
        do: "Trigger the network request using PowerShell or Python, then stop capture.",
        cmd: "Invoke-WebRequest -Uri \"https://httpbin.org/get\" -UseBasicParsing | Out-Null; pktmon stop",
        out: "Data collection stopped.\nLog file: C:\\Users\\aryan\\my_trace.etl (42 packets logged)",
        note: "pktmon reports the exact number of packets logged. The raw file is stored in Windows Event Trace (.etl) format."
      },
      {
        do: "Convert the native Windows .etl log into a standard Wireshark .pcapng file.",
        cmd: "pktmon etl2pcap my_trace.etl --out my_trace.pcapng",
        out: "Processing...\nPackets: 42\nSaved as: my_trace.pcapng",
        note: "The converted .pcapng file can be opened in Wireshark, analyzed with Python's Scapy, or examined on any operating system without installing extra capture drivers!"
      }
    ],
    fix: [
      { p: "Pktmon: A capture session is already active", s: "Run `pktmon stop` to terminate any hanging background capture session." },
      { p: "Filter already exists error", s: "Run `pktmon filter remove` to reset all packet filters." }
    ],
    next: ["network-sniffing-wireshark-tcpdump", "curl-latency-profiling"]
  },

  {
    id: "python-raw-socket-sniffer-windows",
    t: "Build a raw network packet sniffer in pure Python on Windows",
    g: "hacks",
    mins: 9,
    diff: "hardcore",
    why: "Most developers treat network packets as magic strings handled by libraries like requests or urllib. Writing a raw packet sniffer in pure Python on Windows strips away the abstraction: you bind directly to SOCK_RAW, issue the Windows socket IOCTL SIO_RCVALL to enable promiscuous mode, and unpack raw binary IPv4 headers byte-by-byte with Python's struct module.",
    need: ["Python 3.8+", "Windows PowerShell running as Administrator (raw sockets require Admin)"],
    steps: [
      {
        do: "Understand the IPv4 packet header structure (RFC 791).",
        out: "Every IPv4 packet begins with a 20-byte header:\n- Byte 0: Version (4 bits) + Internet Header Length (IHL, 4 bits)\n- Byte 8: Time To Live (TTL, 8 bits)\n- Byte 9: Protocol (8 bits: 1=ICMP, 6=TCP, 17=UDP)\n- Bytes 12-15: Source IP (32 bits)\n- Bytes 16-19: Destination IP (32 bits)",
        note: "By decoding these 20 bytes with struct.unpack, you read the actual IP routing metadata before Windows delivers it to high-level applications."
      },
      {
        do: "Find your active local IPv4 address in PowerShell.",
        cmd: "(Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.InterfaceAlias -notmatch 'Loopback' -and $_.IPAddress -like '192.*' -or $_.IPAddress -like '10.*' -or $_.IPAddress -like '172.*' }).IPAddress[0]",
        out: "192.168.1.105",
        note: "On Windows, a raw socket must be bound to a specific local interface IP address before enabling promiscuous mode."
      },
      {
        do: "Create raw_sniffer.py with Windows-specific socket ioctl and struct unpacking.",
        cmd: "# Write raw_sniffer.py in PowerShell:\n@'\nimport socket, struct\n\n# 1. Discover local IP\nhost = socket.gethostbyname(socket.gethostname())\nprint(f\"[+] Binding raw socket to {host}...\")\n\n# 2. Create raw socket on Windows (AF_INET, SOCK_RAW, IPPROTO_IP)\ns = socket.socket(socket.AF_INET, socket.SOCK_RAW, socket.IPPROTO_IP)\ns.bind((host, 0))\n\n# 3. Windows-specific: include IP headers and enable promiscuous mode\ns.setsockopt(socket.IPPROTO_IP, socket.IP_HDRINCL, 1)\ns.ioctl(socket.SIO_RCVALL, socket.RCVALL_ON)\n\nprint(\"[+] Sniffing live packets (Ctrl+C to stop)...\")\ntry:\n    for _ in range(10):\n        packet, _ = s.recvfrom(65565)\n        ip_header = packet[:20]\n        iph = struct.unpack(\"!BBHHHBBH4s4s\", ip_header)\n        ttl = iph[5]\n        proto = iph[6]\n        src_ip = socket.inet_ntoa(iph[8])\n        dst_ip = socket.inet_ntoa(iph[9])\n        proto_name = {1: \"ICMP\", 6: \"TCP\", 17: \"UDP\"}.get(proto, str(proto))\n        print(f\"[{proto_name}] {src_ip} -> {dst_ip} (TTL={ttl})\")\nfinally:\n    s.ioctl(socket.SIO_RCVALL, socket.RCVALL_OFF)\n    print(\"[*] Promiscuous mode disabled.\")\n'@ | Set-Content -Path raw_sniffer.py",
        out: "Created raw_sniffer.py",
        note: "socket.SIO_RCVALL is Windows-specific: it instructs the Network Interface Card (NIC) driver to deliver ALL incoming packets on that interface to your socket, not just packets addressed to your port."
      },
      {
        do: "Run the sniffer in an elevated PowerShell and generate a test ping in a second terminal.",
        cmd: "python raw_sniffer.py",
        out: "[+] Binding raw socket to 192.168.1.105...\n[+] Sniffing live packets (Ctrl+C to stop)...\n[TCP] 192.168.1.105 -> 140.82.114.26 (TTL=128)\n[UDP] 192.168.1.105 -> 1.1.1.1 (TTL=128)\n[ICMP] 192.168.1.105 -> 8.8.8.8 (TTL=128)",
        note: "Every packet traveling through your network adapter is intercepted and printed. You see DNS queries to 1.1.1.1, GitHub syncs over TCP, and ICMP echo requests in real-time."
      },
      {
        do: "Verify clean socket cleanup: SIO_RCVALL_OFF disables promiscuous mode on exit.",
        out: "[*] Promiscuous mode disabled.",
        note: "Always use a try...finally block around SIO_RCVALL_ON. If promiscuous mode is left on after an unhandled crash, the socket handle could keep your NIC in high-interrupt mode until reboot."
      }
    ],
    fix: [
      { p: "OSError: [WinError 10013] An attempt was made to access a socket in a way forbidden by its access permissions", s: "Raw sockets require Administrator privileges on Windows. Right-click PowerShell and select 'Run as Administrator'." },
      { p: "Socket binds to 127.0.0.1 instead of Wi-Fi/Ethernet", s: "Replace `socket.gethostname()` with your actual local LAN IPv4 address (e.g., 192.168.x.x) discovered in Step 2." }
    ],
    next: ["windows-pktmon-packet-capture", "network-sniffing-wireshark-tcpdump"]
  },

  {
    id: "python-cprofile-snakeviz-flamegraph",
    t: "Profile Python bottlenecks and generate interactive flamegraphs with cProfile and SnakeViz",
    g: "hacks",
    mins: 7,
    diff: "intermediate",
    why: "Premature optimization wastes hours rewriting functions that account for 0.1% of execution time. Python includes cProfile in its standard library to measure every function call down to microseconds. Combining it with snakeviz turns raw statistics into an interactive, visual sunburst and flamegraph in your browser on Windows.",
    need: ["Python 3.8+", "Windows PowerShell"],
    steps: [
      {
        do: "Understand the cProfile statistics: ncalls, tottime, percall, cumtime.",
        out: "cProfile tracks:\n- ncalls: number of times the function was called\n- tottime: total time spent in the function ITSELF (excluding sub-calls)\n- cumtime: cumulative time spent in the function AND all functions it called",
        note: "If a function has high `cumtime` but low `tottime`, the function itself is fine — the bottleneck is a slow sub-function it calls inside its body (e.g. database query or sleep)."
      },
      {
        do: "Install snakeviz for visual flamegraph rendering in your browser.",
        cmd: "pip install snakeviz",
        out: "Successfully installed snakeviz",
        note: "SnakeViz is an open-source browser-based graphical viewer for Python cProfile output. It runs a local Python web server and displays interactive flamecharts and sunburst charts."
      },
      {
        do: "Create a benchmark Python script slow_pipeline.py containing an intentional bottleneck.",
        cmd: "@'\nimport time, math\n\ndef fast_math():\n    return [math.sqrt(x) for x in range(100000)]\n\ndef slow_io():\n    time.sleep(0.5)  # Simulated slow database / API call\n    return \"data\"\n\ndef main():\n    for _ in range(5):\n        fast_math()\n        slow_io()\n\nif __name__ == '__main__':\n    main()\n'@ | Set-Content -Path slow_pipeline.py",
        out: "Created slow_pipeline.py",
        note: "In this pipeline, fast_math executes 500,000 square root calculations while slow_io sleeps for 2.5 seconds total."
      },
      {
        do: "Profile the script execution using Python's built-in cProfile module.",
        cmd: "python -m cProfile -o app.prof slow_pipeline.py",
        out: "Generates binary profile output in app.prof without modifying source code.",
        note: "Running `-m cProfile -o app.prof` can profile ANY existing Python script or test suite without altering a single line of application code."
      },
      {
        do: "Launch the interactive SnakeViz flamegraph visualization in your default browser.",
        cmd: "snakeviz app.prof",
        out: "Starting SnakeViz at http://127.0.0.1:8080/snakeviz/%2Fapp.prof\nOpening your web browser...",
        note: "Switch to 'Flamegraph' style in the top left corner of the SnakeViz UI. You immediately see that `slow_io` (specifically `time.sleep`) occupies 96% of the timeline width, proving where optimization effort must be spent."
      }
    ],
    fix: [
      { p: "SnakeViz fails to launch default browser automatically", s: "Run `snakeviz -s -p 8080 app.prof` and open `http://localhost:8080` manually in Chrome or Edge." },
      { p: "Profiling multithreaded Python code", s: "cProfile only profiles the main thread by default. For multithreaded apps, initialize `cProfile.Profile()` inside each worker thread target function." }
    ],
    next: ["chrome-devtools-performance-profiling", "memory-leak-heap-snapshot"]
  },

  {
    id: "pytorch-dynamic-quantization-int8",
    t: "Quantize PyTorch models from Float32 to Int8 for 4x memory reduction and faster CPU inference",
    g: "hacks",
    mins: 8,
    diff: "advanced",
    why: "Deep learning models saved in 32-bit floating point (float32) are bloated, consuming gigabytes of RAM and running sluggishly on laptops without dedicated Nvidia GPUs. PyTorch dynamic quantization converts weights and matrix multiplications in Linear layers to 8-bit integers (qint8). This cuts memory footprint by 75% and speeds up CPU inference by 2-3x with negligible loss in accuracy.",
    need: ["Python 3.9+", "PyTorch (`pip install torch`)", "Windows PowerShell"],
    steps: [
      {
        do: "Understand how Int8 Dynamic Quantization works under the hood.",
        out: "A float32 weight uses 32 bits (4 bytes). Int8 uses 8 bits (1 byte) — a 4x reduction. In dynamic quantization, weights are converted to int8 ahead of time, while activations are dynamically quantized to int8 at runtime during matrix multiplication (GEMM).",
        note: "Because matrix math on modern x86/x64 Intel and AMD CPUs has dedicated AVX-512 and VNNI instructions for 8-bit integer vector operations, int8 runs dramatically faster than float32 on regular laptops."
      },
      {
        do: "Create a benchmark Python script quantize_demo.py comparing Float32 vs Int8 models.",
        cmd: "@'\nimport torch, time, os\n\n# 1. Define a typical neural network with Linear layers\nclass TextClassifier(torch.nn.Module):\n    def __init__(self):\n        super().__init__()\n        self.fc1 = torch.nn.Linear(512, 1024)\n        self.relu = torch.nn.ReLU()\n        self.fc2 = torch.nn.Linear(1024, 512)\n        self.fc3 = torch.nn.Linear(512, 10)\n    def forward(self, x):\n        return self.fc3(self.relu(self.fc2(self.relu(self.fc1(x)))))\n\nmodel_fp32 = TextClassifier().eval()\n\n# 2. Save FP32 model and measure file size\ntorch.save(model_fp32.state_dict(), \"model_fp32.pth\")\nsize_fp32 = os.path.getsize(\"model_fp32.pth\") / (1024 * 1024)\n\n# 3. Apply dynamic quantization targeting Linear layers to int8\nmodel_int8 = torch.quantization.quantize_dynamic(\n    model_fp32, {torch.nn.Linear}, dtype=torch.qint8\n)\ntorch.save(model_int8.state_dict(), \"model_int8.pth\")\nsize_int8 = os.path.getsize(\"model_int8.pth\") / (1024 * 1024)\n\nprint(f\"[*] FP32 Model Size: {size_fp32:.2f} MB\")\nprint(f\"[*] Int8 Model Size: {size_int8:.2f} MB (Reduction: {(1 - size_int8/size_fp32)*100:.1f}%)\")\n'@ | Set-Content -Path quantize_demo.py",
        out: "Created quantize_demo.py",
        note: "Notice that only ONE line of code is needed to quantize the model: `torch.quantization.quantize_dynamic(model, {torch.nn.Linear}, dtype=torch.qint8)`."
      },
      {
        do: "Run the script to observe the 4x file size reduction.",
        cmd: "python quantize_demo.py",
        out: "[*] FP32 Model Size: 4.22 MB\n[*] Int8 Model Size: 1.08 MB (Reduction: 74.4%)",
        note: "The model file is exactly 4x smaller because every 4-byte float in the weight matrices is now stored in a single 1-byte integer."
      },
      {
        do: "Benchmark inference latency on 1,000 sample batches on CPU.",
        cmd: "# Append latency benchmark to quantize_demo.py and run:\n@'\nx = torch.randn(64, 512)\n# Warmup\nfor _ in range(50): _ = model_fp32(x); _ = model_int8(x)\n\n# Benchmark FP32\nt0 = time.perf_counter()\nfor _ in range(500): _ = model_fp32(x)\nt_fp32 = (time.perf_counter() - t0) * 1000\n\n# Benchmark Int8\nt0 = time.perf_counter()\nfor _ in range(500): _ = model_int8(x)\nt_int8 = (time.perf_counter() - t0) * 1000\n\nprint(f\"[*] FP32 500 inferences: {t_fp32:.2f} ms\")\nprint(f\"[*] Int8 500 inferences: {t_int8:.2f} ms ({t_fp32/t_int8:.2f}x speedup on CPU)\")\n'@ | Add-Content -Path quantize_demo.py; python quantize_demo.py",
        out: "[*] FP32 500 inferences: 142.60 ms\n[*] Int8 500 inferences: 64.10 ms (2.22x speedup on CPU)",
        note: "Inference throughput more than doubled on a normal laptop CPU without touching CUDA or purchasing a GPU."
      }
    ],
    fix: [
      { p: "Quantized model fails during training (backward pass)", s: "Quantization is an inference-only optimization. You must train the model in float32 (or using Quantization-Aware Training QAT) before quantizing for production deployment." },
      { p: "Model accuracy drops significantly", s: "Use Dynamic Quantization on Linear and LSTM layers only. Avoid quantizing sensitive attention softmax or normalization layers without calibration." }
    ],
    next: ["knowledge-distillation-pytorch", "model-serve"]
  },

  {
    id: "knowledge-distillation-pytorch",
    t: "Train a compact student AI model from a large teacher using Knowledge Distillation in Python",
    g: "hacks",
    mins: 9,
    diff: "hardcore",
    why: "Large AI models (teachers) have immense knowledge but are too slow and expensive to deploy on edge devices or cheap CPU servers. Knowledge distillation transfers knowledge from a giant teacher model to a lightweight student model by training the student on the teacher's soft probability logits using Temperature scaling and Kullback-Leibler (KL) divergence loss.",
    need: ["Python 3.9+", "PyTorch (`pip install torch`)", "Windows PowerShell"],
    steps: [
      {
        do: "Understand the math behind Knowledge Distillation (Hinton et al.).",
        out: "Hard labels say an image is 100% Dog and 0% Cat. The teacher's softened output says: 88% Golden Retriever, 10% Labrador, 2% Cat. This 'dark knowledge' teaches the student model the geometric relationships between classes that one-hot labels discard.",
        note: "By dividing the raw logits by Temperature T (e.g. T=4.0) before applying Softmax, we soften the probability distribution so the student learns nuanced similarities."
      },
      {
        do: "Create distillation_loss.py implementing the composite loss function in PyTorch.",
        cmd: "@'\nimport torch\nimport torch.nn as nn\nimport torch.nn.functional as F\n\nclass DistillationLoss(nn.Module):\n    def __init__(self, temperature=4.0, alpha=0.7):\n        super().__init__()\n        self.T = temperature\n        self.alpha = alpha\n        self.kl_div = nn.KLDivLoss(reduction='batchmean')\n        self.ce = nn.CrossEntropyLoss()\n\n    def forward(self, student_logits, teacher_logits, true_labels):\n        # 1. Softened teacher and student probability distributions\n        p_s = F.log_softmax(student_logits / self.T, dim=1)\n        p_t = F.softmax(teacher_logits / self.T, dim=1)\n        \n        # 2. KL Divergence loss scaled by T^2\n        soft_loss = self.kl_div(p_s, p_t) * (self.T ** 2)\n        \n        # 3. Standard Cross-Entropy with true ground truth labels\n        hard_loss = self.ce(student_logits, true_labels)\n        \n        # 4. Weighted combination\n        return self.alpha * soft_loss + (1.0 - self.alpha) * hard_loss\n\nprint(\"[+] DistillationLoss module initialized.\")\n'@ | Set-Content -Path distillation_loss.py",
        out: "Created distillation_loss.py",
        note: "The `(self.T ** 2)` scaling factor is mathematically required: dividing logits by T scales gradients down by 1/T^2, so multiplying by T^2 keeps soft loss and hard loss on the same gradient scale."
      },
      {
        do: "Build train_distill.py comparing the parameter counts of Teacher vs Student.",
        cmd: "@'\nimport torch, torch.nn as nn\nfrom distillation_loss import DistillationLoss\n\n# Heavy Teacher Model (3 large layers, 2M parameters)\nclass TeacherModel(nn.Module):\n    def __init__(self):\n        super().__init__()\n        self.net = nn.Sequential(\n            nn.Linear(128, 1024), nn.ReLU(),\n            nn.Linear(1024, 1024), nn.ReLU(),\n            nn.Linear(1024, 10)\n        )\n    def forward(self, x): return self.net(x)\n\n# Tiny Student Model (1 layer, 13K parameters — 150x smaller!)\nclass StudentModel(nn.Module):\n    def __init__(self):\n        super().__init__()\n        self.net = nn.Sequential(nn.Linear(128, 96), nn.ReLU(), nn.Linear(96, 10))\n    def forward(self, x): return self.net(x)\n\nteacher = TeacherModel().eval()\nstudent = StudentModel()\n\nparams_t = sum(p.numel() for p in teacher.parameters())\nparams_s = sum(p.numel() for p in student.parameters())\nprint(f\"[*] Teacher Parameters: {params_t:,}\")\nprint(f\"[*] Student Parameters: {params_s:,} ({params_t/params_s:.1f}x smaller)\")\n'@ | Set-Content -Path train_distill.py; python train_distill.py",
        out: "[*] Teacher Parameters: 1,165,322\n[*] Student Parameters: 13,354 (87.3x smaller)",
        note: "The student model has 87x fewer parameters, meaning it can run on Raspberry Pi or ordinary mobile devices at microsecond latency."
      },
      {
        do: "Run a training step: student learns simultaneously from ground truth and teacher logits.",
        cmd: "# Append training step to train_distill.py and execute:\n@'\nloss_fn = DistillationLoss(temperature=3.0, alpha=0.6)\noptimizer = torch.optim.Adam(student.parameters(), lr=1e-3)\n\n# Synthetic input batch (32 samples, 128 features) and true labels\nx = torch.randn(32, 128)\ny = torch.randint(0, 10, (32,))\n\n# 1. Teacher produces soft guidance (no gradients needed)\nwith torch.no_grad():\n    t_logits = teacher(x)\n\n# 2. Student forward pass\ns_logits = student(x)\n\n# 3. Calculate distillation loss and backpropagate\nloss = loss_fn(s_logits, t_logits, y)\nloss.backward()\noptimizer.step()\nprint(f\"[*] Distillation training step complete! Loss: {loss.item():.4f}\")\n'@ | Add-Content -Path train_distill.py; python train_distill.py",
        out: "[*] Distillation training step complete! Loss: 2.3412",
        note: "This exact technique is how HuggingFace built DistilBERT (40% smaller, 60% faster, retaining 97% of BERT accuracy) and how modern compact LLMs are distilled from 70B parent models."
      }
    ],
    fix: [
      { p: "RuntimeError: The size of tensor a must match the size of tensor b", s: "Ensure both teacher and student output the exact same number of classes (output logits dimension)." },
      { p: "Teacher model weights changing during training", s: "Always place the teacher in `teacher.eval()` and wrap teacher inference in `with torch.no_grad():`." }
    ],
    next: ["pytorch-dynamic-quantization-int8", "fine-tuning-vs-rag"]
  },

  {
    id: "python-defensive-input-validation",
    t: "Stop injection attacks cold with strict allow-list regex validation and Pydantic in Python",
    g: "hacks",
    mins: 6,
    diff: "beginner",
    why: "Blacklisting 'bad characters' like <script> or single quotes is a fatal security flaw because attackers easily bypass it using Unicode normalization tricks, null bytes, or URL encoding. The OWASP secure coding standard demands allow-list validation: accept ONLY known-valid patterns and reject everything else by default.",
    need: ["Python 3.9+", "Pydantic v2 (`pip install pydantic`)", "Windows PowerShell"],
    steps: [
      {
        do: "Understand why deny-list (blacklist) sanitization fails against real attackers.",
        out: "A blacklist checks for '<script>'. An attacker sends '%3Cscript%3E' (URL encoded), or '\\u003cscript\\u003e' (Unicode), or '<scr<script>ipt>' (nested stripping bypass). The blacklist fails because the attacker's variations are infinite.",
        note: "Allow-listing reverses the paradigm: define what characters ARE permitted (e.g. alphanumeric + underscore only, length 3-30). Anything containing any other byte is rejected instantly."
      },
      {
        do: "Install Pydantic v2 for high-performance schema validation in Python.",
        cmd: "pip install pydantic",
        out: "Successfully installed pydantic",
        note: "Pydantic v2 core is written in Rust, validating schemas up to 20x faster than pure Python validation libraries."
      },
      {
        do: "Create a defensive input validator validate_input.py combining Unicode normalization and regex allow-lists.",
        cmd: "@'\nimport re, unicodedata\nfrom pydantic import BaseModel, Field, field_validator\n\n# Strict allow-list regex: Only letters, digits, underscores, hyphens (3 to 32 chars)\nUSERNAME_PATTERN = re.compile(r\"^[a-zA-Z0-9_-]{3,32}$\")\n\ndef clean_text(val: str) -> str:\n    # 1. Normalize Unicode (NFKC collapses full-width variants)\n    normalized = unicodedata.normalize(\"NFKC\", val)\n    # 2. Strip null bytes and surrounding whitespace\n    return normalized.replace(\"\\x00\", \"\").strip()\n\nclass UserRegistration(BaseModel):\n    username: str = Field(..., min_length=3, max_length=32)\n    email: str = Field(..., max_length=255)\n    age: int = Field(..., ge=13, le=120)\n\n    @field_validator(\"username\", mode=\"before\")\n    @classmethod\n    def validate_username(cls, v):\n        cleaned = clean_text(str(v))\n        if not USERNAME_PATTERN.match(cleaned):\n            raise ValueError(\"Username contains illegal characters. Only alphanumeric, -, _ allowed.\")\n        return cleaned\n\nprint(\"[+] Validation schema compiled.\")\n'@ | Set-Content -Path validate_input.py",
        out: "Created validate_input.py",
        note: "Unicode normalization with NFKC is critical: without it, full-width Unicode characters like '＜ｓｃｒｉｐｔ＞' can evade regex checks before getting converted back to ASCII downstream by database drivers."
      },
      {
        do: "Test the validator against malicious input vectors in PowerShell.",
        cmd: "# Append test cases to validate_input.py and run:\n@'\n# Valid input\nu1 = UserRegistration(username=\"aryan_dev\", email=\"user@example.com\", age=22)\nprint(\"[+] Accepted valid user:\", u1.username)\n\n# Malicious SQL Injection attempt in username\ntry:\n    UserRegistration(username=\"admin' OR 1=1;--\", email=\"hacker@test.com\", age=30)\nexcept Exception as e:\n    print(\"[!] Rejected attack:\", e.errors()[0]['msg'])\n'@ | Add-Content -Path validate_input.py; python validate_input.py",
        out: "[+] Accepted valid user: aryan_dev\n[!] Rejected attack: Value error, Username contains illegal characters. Only alphanumeric, -, _ allowed.",
        note: "The attack payload never reached a database query, file path, or template engine. It was stopped at the front door."
      }
    ],
    fix: [
      { p: "Regex catastrophic backtracking (ReDoS)", s: "Never write nested quantifiers like `(a+)+`. Use simple, bounded character classes with specific lengths like `^[a-zA-Z0-9]{3,32}$`." },
      { p: "Valid international characters (accents, non-English names) rejected", s: "Use Unicode regex classes `^[\\p{L}\\p{N}_-]{3,32}$` with Python's `regex` package (`pip install regex`) for multilingual names." }
    ],
    next: ["prompt-injection-defense", "find-exposed-secrets-in-code"]
  },

  {
    id: "python-pip-audit-vulnerability-scan",
    t: "Audit Python virtual environments for known CVE vulnerabilities using pip-audit",
    g: "hacks",
    mins: 5,
    diff: "beginner",
    why: "Over 80% of lines of code in modern applications live in third-party packages installed via pip. Unpatched dependencies expose your systems to remote code execution (RCE) and data leaks. pip-audit scans your local virtual environment or requirements.txt against the Google OSV and PyPA vulnerability databases in seconds.",
    need: ["Python 3.8+", "Windows PowerShell"],
    steps: [
      {
        do: "Install pip-audit in your Python environment.",
        cmd: "pip install pip-audit",
        out: "Successfully installed pip-audit",
        note: "pip-audit is maintained by the Python Security Authority (PyPA) and OpenSSF. It queries the Open Source Vulnerabilities (OSV) database and NIST NVD."
      },
      {
        do: "Audit all currently installed packages in your active environment.",
        cmd: "pip-audit",
        out: "No known vulnerabilities found",
        note: "pip-audit inspects the exact package versions in your site-packages folder and flags any version with a published CVE advisory."
      },
      {
        do: "Scan a specific requirements.txt file with full CVE descriptions.",
        cmd: "pip-audit -r requirements.txt --desc",
        out: "Name    Version ID             Fix Versions Description\n------- ------- -------------- ------------ ---------------------------------\nflask   0.12.2  PYSEC-2018-66  0.12.3       Unexpected memory consumption in...\njinja2  2.10    GHSA-g3rq-g295 2.10.1       Sandbox escape vulnerability in...",
        note: "The `--desc` flag displays a human-readable summary of what the vulnerability allows an attacker to execute."
      },
      {
        do: "Automatically upgrade vulnerable packages to their patched versions.",
        cmd: "pip-audit -r requirements.txt --fix",
        out: "Upgraded flask from 0.12.2 to 0.12.3\nUpgraded jinja2 from 2.10 to 2.10.1",
        note: "The `--fix` option automatically upgrades vulnerable dependencies to the minimum non-vulnerable version required to close the security hole."
      }
    ],
    fix: [
      { p: "Fix fails due to dependency conflicts", s: "Manually review the fix version and test your test suite with `pytest` before deploying to staging." },
      { p: "Ignoring a specific development-only vulnerability that has no fix yet", s: "Pass `--ignore-vuln GHSA-xxxx-yyyy` to suppress non-critical warnings in local development." }
    ],
    next: ["find-exposed-secrets-in-code", "python-defensive-input-validation"]
  },

  {
    id: "windows-powershell-threat-hunting",
    t: "Hunt for hidden malware persistence mechanisms in Windows using PowerShell",
    g: "hacks",
    mins: 8,
    diff: "advanced",
    why: "When malicious software or an unauthorized script gains execution on Windows, it creates a persistence mechanism so it survives reboots: a registry Run key, a hidden Scheduled Task, a Startup folder link, or a rogue service. Security engineers use PowerShell to sweep all persistence locations in seconds without third-party antivirus.",
    need: ["Windows 10 or 11", "PowerShell 5.1+"],
    steps: [
      {
        do: "Inspect user and system Registry Run keys where auto-starting programs hide.",
        cmd: "Get-ItemProperty 'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Run', 'HKLM:\\Software\\Microsoft\\Windows\\CurrentVersion\\Run' | Select-Object * -ExcludeProperty PSPath, PSParentPath, PSChildName, PSDrive, PSProvider",
        out: "OneDrive : \"C:\\Users\\aryan\\AppData\\Local\\Microsoft\\OneDrive\\OneDrive.exe\" /background\nSecurityHealth : %ProgramFiles%\\Windows Defender\\MSASCuiL.exe",
        note: "Attackers commonly add keys under HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Run because writing to the CurrentUser hive requires ZERO administrator privileges!"
      },
      {
        do: "Audit all non-Microsoft Scheduled Tasks running on the system.",
        cmd: "Get-ScheduledTask | Where-Object { $_.State -ne 'Disabled' -and $_.Author -notmatch 'Microsoft' -and $_.TaskPath -notmatch '\\\\Microsoft\\\\' } | Select-Object TaskName, State, @{N='Action'; E={$_.Actions.Execute}}",
        out: "TaskName             State Action\n--------             ----- ------\nGoogleUpdateTaskUser Ready C:\\Users\\aryan\\AppData\\Local\\Google\\Update\\GoogleUpdate.exe\nNodeAutoWorker       Ready C:\\Program Files\\nodejs\\node.exe",
        note: "Malware often creates scheduled tasks set to trigger 'At log on' or 'On idle' pointing at PowerShell or cmd scripts hidden in AppData."
      },
      {
        do: "Check the Windows Startup folder for rogue scripts or batch files.",
        cmd: "Get-ChildItem \"$env:APPDATA\\Microsoft\\Windows\\Start Menu\\Programs\\Startup\", \"$env:ProgramData\\Microsoft\\Windows\\Start Menu\\Programs\\Startup\"",
        out: "Directory: C:\\Users\\aryan\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu\\Programs\\Startup\nMode                LastWriteTime         Length Name\n----                -------------         ------ ----\n-a----        8/14/2026   9:12 AM           1420 docker-desktop.lnk",
        note: "Any shortcut (.lnk) or script (.bat, .vbs, .ps1) in the Startup folder executes automatically as soon as the user logs in."
      },
      {
        do: "Correlate all active listening network ports with their executable file path on disk.",
        cmd: "Get-NetTCPConnection -State Listen | Select-Object LocalPort, OwningProcess, @{N='Process'; E={(Get-Process -Id $_.OwningProcess -ErrorAction SilentlyContinue).ProcessName}}, @{N='Path'; E={(Get-Process -Id $_.OwningProcess -ErrorAction SilentlyContinue).Path}} | Sort-Object LocalPort",
        out: "LocalPort OwningProcess Process Path\n--------- ------------- ------- ----\n     3000          4912 node    C:\\Program Files\\nodejs\\node.exe\n     8000         12844 python  C:\\Python312\\python.exe",
        note: "If you see a listening port with a blank process or an executable located in `C:\\Users\\...\\AppData\\Local\\Temp`, that is an immediate red flag for an unauthorized backdoor."
      }
    ],
    fix: [
      { p: "Cannot access HKLM registry key", s: "Run PowerShell as Administrator to query machine-wide registry keys." },
      { p: "Suspicious task detected", s: "Disable it immediately with `Disable-ScheduledTask -TaskName 'SuspiciousName'` and inspect its payload path." }
    ],
    next: ["windows-extract-binary-strings-powershell", "python-pefile-inspect-executables"]
  },

  {
    id: "python-pefile-inspect-executables",
    t: "Inspect Windows EXE and DLL headers and imported APIs in pure Python with pefile",
    g: "hacks",
    mins: 8,
    diff: "advanced",
    why: "How do reverse engineers and malware analysts know what a suspicious Windows executable does before ever clicking it? Every Windows binary uses the Portable Executable (PE) format. Using Python's pefile library, you can parse section headers, calculate Shannon entropy to detect packed malware, and inspect the Import Address Table (IAT) to reveal exactly which Windows OS APIs the binary calls.",
    need: ["Python 3.8+", "pefile library (`pip install pefile`)", "Windows PowerShell"],
    steps: [
      {
        do: "Install pefile: the gold-standard Python library for parsing Windows PE binaries.",
        cmd: "pip install pefile",
        out: "Successfully installed pefile",
        note: "pefile is a pure-Python module that parses the complete Portable Executable header structure, including 32-bit (PE32) and 64-bit (PE32+) executables."
      },
      {
        do: "Understand the Import Address Table (IAT): the blueprint of binary capabilities.",
        out: "A Windows program cannot interact with the outside world directly. It must import DLLs provided by Windows:\n- kernel32.dll: memory, files, process creation\n- ws2_32.dll: network sockets, HTTP connections\n- advapi32.dll: Windows registry, user tokens, cryptography",
        note: "If a simple calculator app imports `ws2_32.dll` and `VirtualAllocEx`, it is almost certainly a Trojan or contains injected shellcode!"
      },
      {
        do: "Create a Python script inspect_pe.py that parses imports and calculates section entropy.",
        cmd: "@'\nimport pefile, math, sys\n\ndef calculate_entropy(data):\n    if not data: return 0.0\n    entropy = 0.0\n    for x in range(256):\n        p_x = float(data.count(bytes([x]))) / len(data)\n        if p_x > 0: entropy += - p_x * math.log(p_x, 2)\n    return entropy\n\npe_path = sys.argv[1] if len(sys.argv) > 1 else r\"C:\\Windows\\System32\\notepad.exe\"\npe = pefile.PE(pe_path)\n\nprint(f\"[*] Analyzing: {pe_path}\")\nprint(f\"[*] Target Machine: {hex(pe.FILE_HEADER.Machine)} (0x8664 = x64)\")\n\nprint(\"\\n--- Sections & Entropy (Entropy > 7.0 suggests packed/encrypted data) ---\")\nfor section in pe.sections:\n    name = section.Name.decode().strip('\\x00')\n    ent = calculate_entropy(section.get_data())\n    print(f\"  {name:<10} Size: {section.SizeOfRawData:>8} bytes | Entropy: {ent:.2f}\")\n\nprint(\"\\n--- Imported DLLs and APIs ---\")\nfor entry in pe.DIRECTORY_ENTRY_IMPORT:\n    dll = entry.dll.decode()\n    funcs = [f.name.decode() for f in entry.imports if f.name]\n    print(f\"  [+] {dll} ({len(funcs)} functions): {', '.join(funcs[:3])}...\")\n'@ | Set-Content -Path inspect_pe.py",
        out: "Created inspect_pe.py",
        note: "Shannon entropy measures randomness on a scale from 0 to 8. Plain code has entropy between 4.5 and 6.2. If a section has entropy > 7.2, it contains encrypted or compressed shellcode!"
      },
      {
        do: "Run the inspector on Windows Notepad to see its real kernel imports.",
        cmd: "python inspect_pe.py \"C:\\Windows\\System32\\notepad.exe\"",
        out: "[*] Analyzing: C:\\Windows\\System32\\notepad.exe\n[*] Target Machine: 0x8664 (0x8664 = x64)\n\n--- Sections & Entropy ---\n  .text      Size:   184320 bytes | Entropy: 6.12\n  .rdata     Size:    90112 bytes | Entropy: 5.41\n  .data      Size:     4096 bytes | Entropy: 2.15\n\n--- Imported DLLs and APIs ---\n  [+] KERNEL32.dll (82 functions): CloseHandle, CreateFileW, GetLastError...\n  [+] USER32.dll (46 functions): CreateWindowExW, DefWindowProcW, DestroyWindow...",
        note: "Without running the binary, you extracted its compile architecture, verified normal entropy (.text = 6.12), and audited every Windows API it interacts with."
      }
    ],
    fix: [
      { p: "pefile.PEFormatError: 'Invalid NT Headers signature'", s: "The file is not a valid Windows Portable Executable (it might be a Linux ELF binary, script, or corrupt download)." },
      { p: "AttributeError: 'PE' object has no attribute 'DIRECTORY_ENTRY_IMPORT'", s: "Some binaries statically link all functions or have stripped import tables. Check `pe.DIRECTORY_ENTRY_EXPORT` instead." }
    ],
    next: ["windows-extract-binary-strings-powershell", "windows-powershell-threat-hunting"]
  },

  {
    id: "windows-extract-binary-strings-powershell",
    t: "Extract embedded URLs, passwords, and API keys from compiled binaries with PowerShell",
    g: "hacks",
    mins: 6,
    diff: "intermediate",
    why: "Developers frequently assume that compiling source code into a .exe, .dll, .pyc, or .bin hides hardcoded secrets. In reality, string literals remain in plaintext inside the binary. On Linux, engineers run strings; on Windows, you can achieve the same and extract both 8-bit ASCII and 16-bit UTF-16 Unicode strings natively in PowerShell.",
    need: ["Windows PowerShell 5.1+ or PowerShell 7"],
    steps: [
      {
        do: "Understand how strings hide in compiled binaries.",
        out: "A compiled binary contains binary opcodes interspersed with plaintext string tables. On Windows, strings are stored in two formats:\n1. ASCII/UTF-8: 1 byte per character\n2. UTF-16 LE: 2 bytes per character (e.g. 'h\\x00t\\x00t\\x00p\\x00')",
        note: "Tools that search only for ASCII will completely miss UTF-16 strings — which is what most Windows APIs and .NET assemblies use by default!"
      },
      {
        do: "Create a reusable PowerShell function Get-BinaryStrings in your profile or session.",
        cmd: "@'\nfunction Get-BinaryStrings {\n    param(\n        [Parameter(Mandatory=$true)][string]$Path,\n        [int]$MinLength = 5\n    )\n    if (!(Test-Path $Path)) { Write-Error \"File not found\"; return }\n    $bytes = [System.IO.File]::ReadAllBytes((Resolve-Path $Path))\n    \n    # 1. ASCII extraction\n    $asciiText = [System.Text.Encoding]::ASCII.GetString($bytes)\n    $asciiMatches = [regex]::Matches($asciiText, \"[\\x20-\\x7E]{$MinLength,}\") | ForEach-Object { $_.Value }\n    \n    # 2. Unicode UTF-16 LE extraction\n    $unicodeText = [System.Text.Encoding]::Unicode.GetString($bytes)\n    $unicodeMatches = [regex]::Matches($unicodeText, \"[\\x20-\\x7E]{$MinLength,}\") | ForEach-Object { $_.Value }\n    \n    # Combine, deduplicate, and return\n    ($asciiMatches + $unicodeMatches) | Select-Object -Unique\n}\n'@ | Invoke-Expression",
        out: "Function Get-BinaryStrings loaded into current PowerShell session.",
        note: "This function reads the raw file bytes, decodes both ASCII and UTF-16 streams, and uses a regex pattern matching runs of printable characters between ASCII 32 (space) and 126 (~)."
      },
      {
        do: "Scan any executable or DLL and filter for URLs, IP addresses, or file paths.",
        cmd: "Get-BinaryStrings -Path \"C:\\Windows\\System32\\notepad.exe\" | Where-Object { $_ -match 'https?://|\\.dll|\\.json' } | Select-Object -First 10",
        out: "http://schemas.microsoft.com/SMI/2005/WindowsSettings\nCOMCTL32.dll\nADVAPI32.dll\nKERNEL32.dll\nUSER32.dll",
        note: "In 1 second, you extracted manifest schemas and referenced DLL names from a compiled binary without a debugger."
      },
      {
        do: "Use the same technique to find hardcoded tokens in compiled Python bytecode (.pyc files).",
        cmd: "# Create a secret in python, compile to bytecode, and extract:\npython -c \"import py_compile; open('secret.py', 'w').write('API_KEY = \\\"sk-secret-token-123456\\\"'); py_compile.compile('secret.py')\"; Get-ChildItem -Recurse -Filter \"*.pyc\" | ForEach-Object { Get-BinaryStrings -Path $_.FullName | Where-Object { $_ -match 'sk-secret' } }",
        out: "sk-secret-token-123456",
        note: "Compiling Python to `.pyc` does NOT encrypt or protect your strings. Any string literal in Python is visible in plaintext inside the `.pyc` bytecode."
      }
    ],
    fix: [
      { p: "Out of memory on multi-gigabyte files", s: "Use a buffer stream of 64 KB chunks rather than `ReadAllBytes` on files larger than 500 MB." },
      { p: "Too many random short strings", s: "Increase the `-MinLength` parameter to 8 or 10 characters to filter out false positive byte patterns." }
    ],
    next: ["python-pefile-inspect-executables", "find-exposed-secrets-in-code"]
  },

  {
    id: "python-invoke-windows-automation",
    t: "Replace clunky Makefiles on Windows with typed, cross-platform Python Invoke tasks",
    g: "hacks",
    mins: 6,
    diff: "beginner",
    why: "Makefiles break constantly on Windows because Windows has no native make, rm, cat, or Bash subshells. Trying to install MinGW or MSYS2 just to run make test creates environment nightmares for Windows teammates. Python engineers use invoke (tasks.py): a pure Python automation runner with argument parsing, colorized output, and cross-platform path handling that runs seamlessly in Windows PowerShell.",
    need: ["Python 3.8+", "invoke library (`pip install invoke`)", "Windows PowerShell"],
    steps: [
      {
        do: "Install the invoke automation library.",
        cmd: "pip install invoke",
        out: "Successfully installed invoke",
        note: "Invoke is the modern Python alternative to Make, Fabric, and Rake. Tasks are written as standard Python functions with `@task` decorators."
      },
      {
        do: "Create a tasks.py file in your project root defining cross-platform dev tasks.",
        cmd: "@'\nfrom invoke import task\nimport shutil, os, sys\nfrom pathlib import Path\n\n@task\ndef clean(c):\n    \"\"\"Remove build artifacts, caches, and temp files safely on Windows.\"\"\"\n    patterns = [\"__pycache__\", \"*.pyc\", \".pytest_cache\", \"dist\", \"build\"]\n    for p in patterns:\n        for path in Path(\".\").rglob(p):\n            if path.is_dir():\n                shutil.rmtree(path, ignore_errors=True)\n            else:\n                path.unlink(missing_ok=True)\n    print(\"[+] Cleaned all caches and build artifacts.\")\n\n@task\ndef lint(c):\n    \"\"\"Run code formatting and style checks.\"\"\"\n    print(\"[*] Running linter...\")\n    c.run(f\"{sys.executable} -m py_compile check_syntax.js\", echo=True)\n\n@task(pre=[clean, lint])\ndef build(c):\n    \"\"\"Clean, lint, and build the project.\"\"\"\n    print(\"[+] Build pipeline completed successfully!\")\n'@ | Set-Content -Path tasks.py",
        out: "Created tasks.py with clean, lint, and build tasks.",
        note: "Notice `@task(pre=[clean, lint])`: Invoke automatically resolves and runs prerequisite tasks in order before executing `build`."
      },
      {
        do: "List all available tasks with their auto-generated documentation in PowerShell.",
        cmd: "invoke --list",
        out: "Available tasks:\n\n  build   Clean, lint, and build the project.\n  clean   Remove build artifacts, caches, and temp files safely on Windows.\n  lint    Run code formatting and style checks.",
        note: "The docstrings of your Python functions automatically become the CLI documentation."
      },
      {
        do: "Execute the automated build pipeline from Windows PowerShell.",
        cmd: "invoke build",
        out: "[+] Cleaned all caches and build artifacts.\n[*] Running linter...\n[+] Build pipeline completed successfully!",
        note: "Invoke runs natively on Windows PowerShell without needing bash, cygwin, or WSL, while still functioning identically if a coworker runs it on Linux or macOS."
      }
    ],
    fix: [
      { p: "'invoke' is not recognized as an internal or external command", s: "Run `python -m invoke` if your Python Scripts folder is not in your Windows PATH." },
      { p: "Passing arguments with flags to tasks", s: "Define parameters in the function like `def test(c, verbose=False):` and call it as `invoke test --verbose`." }
    ],
    next: ["powershell-fzf-ripgrep-supercharged", "powershell-profile-tuning"]
  }
];

console.log('Number of new PDF hacks to append:', newPdfHacks.length);

// Verify that all new IDs are unique
const globalWindow = {};
eval(content.replace('window.TD = window.TD || {}', 'globalWindow.TD = globalWindow.TD || {}'));
const existingGuides = globalWindow.TD.guides;
console.log('Current total guides before append:', existingGuides.length);

const existingIds = new Set(existingGuides.map(g => g.id));
for (const g of newPdfHacks) {
  if (existingIds.has(g.id)) {
    console.error('DUPLICATE ID:', g.id);
    process.exit(1);
  }
  existingIds.add(g.id);
}
console.log('All 14 new IDs are unique! Total after append will be:', existingIds.size);

// Format guide helper
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

const formattedBlock = ',\n\n' + newPdfHacks.map(formatGuide).join(',\n\n') + '\n\n';

const closingIdx = content.lastIndexOf('  ];');
if (closingIdx === -1) {
  console.error('Could not find closing bracket in guides.js!');
  process.exit(1);
}

const finalContent = content.slice(0, closingIdx) + formattedBlock + '  ];\n})(window.TD = window.TD || {});\n';
fs.writeFileSync(filePath, finalContent, 'utf8');
console.log('Successfully wrote updated guides.js!');

// Final validation
const verifyWindow = {};
eval(finalContent.replace('window.TD = window.TD || {}', 'verifyWindow.TD = verifyWindow.TD || {}'));
console.log('Final verified guide count:', verifyWindow.TD.guides.length);
const groupCounts = {};
verifyWindow.TD.guides.forEach(g => {
  groupCounts[g.g] = (groupCounts[g.g] || 0) + 1;
});
console.log('Guide counts per group:', groupCounts);
