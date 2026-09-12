(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([
    {
      slug: "file-permissions",
      why: {
        before: "Early single-user computing environments (e.g., CP/M, MS-DOS, early OS/360) operated without user accounts or access boundaries; any executing code had unrestricted ability to read, overwrite, or delete any file on physical disks.",
        problem: "In multi-user timesharing environments and multi-tenant servers, the lack of file permissions allowed ordinary users to read confidential files (like password hashes), tamper with critical system configuration files, or accidentally wipe adjacent users' directories.",
        shift: "UNIX introduced the standard POSIX Discretionary Access Control (DAC) permission model, structuring file access around User ID (UID), Group ID (GID), and three 3-bit octal triads (read, write, execute for user, group, and other), augmented by special bits (SUID, SGID, Sticky) and fine-grained Access Control Lists (ACLs)."
      },
      num: {
        t: "POSIX File Permission Bits & Security Semantics",
        h: ["Permission / Special Bit", "Octal Value", "Regular File Semantic", "Directory Semantic", "Security Vulnerability / Risk"],
        r: [
          ["Read (r)", "4 (0400 / 0040 / 0004)", "Allows reading file content (read() syscall)", "Allows reading directory entry names (ls / getdents())", "Information disclosure of sensitive credentials or keys"],
          ["Write (w)", "2 (0200 / 0020 / 0002)", "Allows modifying or truncating file content", "Allows creating, deleting, or renaming files within directory", "Unauthorized file tampering or directory denial-of-service"],
          ["Execute (x)", "1 (0100 / 0010 / 0001)", "Allows executing file as a binary or script (execve())", "Allows traversing directory (cd, stat(), access path components)", "Execution of untrusted or malicious binaries"],
          ["Setuid (SUID)", "4000 (04000)", "Executes binary with the privileges of file owner (e.g., root)", "No effect on standard Linux filesystems", "Privilege escalation if SUID binary has buffer overflow or shell escape"],
          ["Setgid (SGID)", "2000 (02000)", "Executes binary with privileges of file's group", "Newly created files inherit directory's group ID automatically", "Group privilege escalation or unintended data sharing across teams"],
          ["Sticky Bit", "1000 (01000)", "Historically retained text segment in swap memory", "Restricts deletion/rename: only file owner or root can delete files", "Without sticky bit on /tmp, any user can delete other users' temp files"]
        ],
        n: "File permissions are stored inside the 16-bit st_mode field of the inode. The upper 4 bits define file type (regular file S_IFREG, directory S_IFDIR, symbolic link S_IFLNK, socket S_IFSOCK), bits 11–9 define special flags (SUID 04000, SGID 02000, Sticky 01000), and the lower 9 bits define read (4), write (2), and execute (1) permissions for Owner (User), Group, and Other. When a process attempts an operation, the kernel evaluates access using strict short-circuit precedence: if the process Effective UID matches the file's Owner UID, the kernel checks only the User permission bits and ignores Group and Other; if the process UID does not match but its Effective GID (or any supplementary group) matches the file's GID, it evaluates only Group bits; otherwise, it falls back to Other bits. Notably, directory execute (+x) permissions govern path resolution: a user cannot open /a/b/c.txt even with 777 permissions on c.txt if any parent directory lacks the execute bit."
      },
      miss: [
        {
          w: "Setting a file's permissions to 777 is a safe and acceptable quick fix for permission denied errors in production.",
          r: "Setting 777 allows any unprivileged user, compromised service, or container escapee to overwrite, tamper with, or truncate the file, completely destroying system security boundaries."
        },
        {
          w: "A user needs write permissions on a file in order to delete it.",
          r: "File deletion is a directory operation: deleting a file requires write (+w) and execute (+x) permissions on the parent directory containing the file's dentry, regardless of the permissions on the file itself."
        },
        {
          w: "Linux evaluates all permission categories (User, Group, Other) and grants access if any of them permit the operation.",
          r: "Linux uses strict first-match evaluation: if you own the file but User permissions are set to 000, access is immediately denied even if Group or Other permissions are set to 7."
        },
        {
          w: "Standard POSIX file permissions are sufficient to implement modern multi-tenant enterprise access policies.",
          r: "Standard POSIX DAC permissions support only one owner and one group; complex access patterns require POSIX ACLs (setfacl/getfacl) or Mandatory Access Control (SELinux, AppArmor) to enforce label-based security."
        }
      ],
      trade: {
        buys: [
          "Hardware-enforced principle of least privilege across multi-user operating systems and shared compute environments.",
          "Deterministic security auditing: inspect permissions instantly via standard ls -l or stat commands.",
          "Granular execution delegation: SUID binaries (like passwd, sudo) allow unprivileged users to perform specific privileged operations safely.",
          "Directory collaboration: SGID and sticky bits enable shared team directories and secure public temporary directories (/tmp)."
        ],
        costs: [
          "Operational complexity: misconfigured permissions cause service outages, broken deployments, and cryptic permission denied errors.",
          "Privilege escalation risk: SUID/SGID binaries are primary targets for local privilege escalation exploits.",
          "Coarse granularity: standard DAC cannot grant distinct read permissions to two different non-owner groups without ACL extensions.",
          "Root bypass: the superuser (UID 0) bypasses all DAC permission checks, requiring MAC systems (SELinux) for true confinement."
        ],
        avoid: [
          "Using chmod -R 777 to resolve permission issues instead of properly configuring user ownership (chown) and groups.",
          "Adding SUID bits to interpreted script files (bash, python), which Linux kernels deliberately ignore or restrict due to race conditions.",
          "Running production containerized web applications as UID 0 (root) inside container images.",
          "Forgetting to set the sticky bit (+t) on world-writable shared directories like /tmp or /var/tmp."
        ]
      }
    },
    {
      slug: "linux",
      why: {
        before: "In the late 1980s and early 1990s, enterprise UNIX operating systems (AT&T System V, Sun Solaris, IBM AIX, HP-UX) were proprietary, expensive, tied to proprietary RISC hardware, and embroiled in intellectual property litigation.",
        problem: "Software developers, universities, and small businesses could not inspect, modify, or extend operating system source code, and running production UNIX software required purchasing proprietary workstations costing tens of thousands of dollars.",
        shift: "In 1991, Linus Torvalds released the Linux kernel under the GNU General Public License (GPLv2), establishing a free, modular, open-source monolithic kernel that democratized enterprise computing and became the ubiquitous foundation of modern cloud infrastructure, supercomputers, Android devices, and container platforms."
      },
      num: {
        t: "Operating System Architecture Comparison",
        h: ["Feature / Dimension", "Linux Kernel (Modern 6.x)", "FreeBSD (14.x)", "Windows Server (NT Kernel)", "macOS (XNU / Darwin)"],
        r: [
          ["Kernel Architecture", "Monolithic with dynamic Loadable Kernel Modules (LKM)", "Monolithic with dynamic kernel modules", "Hybrid kernel (executive services + user-mode subsystems)", "Hybrid (Mach microkernel + BSD monolithic layer)"],
          ["License Model", "GNU GPLv2 (Copyleft)", "2-Clause / 3-Clause BSD (Permissive)", "Proprietary Commercial", "Apple Public Source License / Proprietary"],
          ["Containerization Primitives", "Namespaces (PID, NET, MNT, USER), cgroups v2, seccomp", "FreeBSD Jails (process isolation + IP virtualization)", "Windows Server Containers (Hyper-V isolation)", "None native (runs Linux VM for Docker)"],
          ["High-Performance I/O", "io_uring, epoll, XDP (eXpress Data Path), eBPF", "kqueue, netmap", "I/O Completion Ports (IOCP), RIO", "kqueue, Network.framework"],
          ["Dominant Deployment Role", "Cloud servers, Kubernetes nodes, Android, TOP500 supercomputers", "High-performance storage appliances (TrueNAS), networking routers", "Enterprise Active Directory, enterprise desktop software", "Developer workstations, consumer mobile (iOS), audio/video production"]
        ],
        n: "The Linux kernel is a preemptive, multi-tasking monolithic kernel supporting dynamic Loadable Kernel Modules (LKMs). Key subsystems include: Process Management (scheduling threads via the Completely Fair Scheduler / CFS or EEVDF using red-black trees); Memory Management (buddy allocator for physical page allocation and SLUB allocator for kernel object caching); Virtual Filesystem (VFS, providing a unified POSIX interface across ext4, XFS, Btrfs, and network filesystems); and the Networking Stack (supporting TCP/IP, UDP, wire-speed packet processing via eBPF/XDP, and Netfilter firewalling). Linux serves as the fundamental engine of modern containerization: containers are not hardware virtualization, but standard Linux processes bounded by kernel Namespaces (which isolate process IDs, network interfaces, mount points, and user IDs) and throttled by Control Groups (cgroups v1/v2, which enforce strict CPU shares, memory limits, and I/O bandwidth quotas)."
      },
      miss: [
        {
          w: "Linux is an entire operating system created completely by Linus Torvalds.",
          r: "Linux is strictly the operating system kernel; a functional operating system distribution (Ubuntu, RHEL, Debian) pairs the Linux kernel with GNU coreutils, systemd, compilers, package managers, and user-space libraries."
        },
        {
          w: "Linux distributions are immune to malware, viruses, and security vulnerabilities.",
          r: "Linux systems are subject to privilege escalation vulnerabilities (Dirty COW, Dirty Pipe), kernel CVEs, misconfigured permissions, container breakout exploits, and supply-chain malware targeting open-source dependencies."
        },
        {
          w: "All Linux distributions run the exact same kernel with the exact same performance characteristics.",
          r: "Distributions apply hundreds of custom kernel patches, select different default schedulers, configure different timer tick frequencies (HZ=100, HZ=250, HZ=1000), and tune distinct sysctl networking parameters."
        },
        {
          w: "Linux does not support binary hardware drivers because it is fully open-source.",
          r: "Linux supports proprietary, closed-source hardware drivers (e.g., NVIDIA GPU drivers) loaded dynamically at runtime via Loadable Kernel Modules (LKMs), although out-of-tree modules lack a stable in-kernel ABI."
        }
      ],
      trade: {
        buys: [
          "Zero licensing costs: deploy thousands of cloud instances or bare-metal servers without per-core or per-socket software fees.",
          "Complete architectural flexibility: scales from tiny 16 MB embedded IoT devices to the world's fastest exascale supercomputers.",
          "Industry-standard container foundation: native kernel primitives (namespaces, cgroups, seccomp) power Docker and Kubernetes.",
          "Deep observability and extensibility: inspect and trace kernel behavior in real time using eBPF, perf, and ftrace."
        ],
        costs: [
          "No stable in-kernel ABI: kernel internal APIs change continuously between releases, requiring third-party drivers to be recompiled.",
          "Ecosystem fragmentation: subtle differences in package managers (apt, dnf, pacman), init systems, and defaults across distributions.",
          "Steep administrative learning curve: mastering kernel tuning (sysctl), systemd internals, and command-line diagnostics requires expertise.",
          "Hardware driver certification: bleeding-edge consumer Wi-Fi cards and laptop sleep states occasionally suffer from delayed driver support."
        ],
        avoid: [
          "Modifying core kernel sysctl parameters in production without benchmarking and documenting specific rationale.",
          "Deploying outdated long-term support (LTS) kernels that lack critical security backports and hardware fixes.",
          "Relying on out-of-tree kernel modules that break during automated kernel security package upgrades.",
          "Treating containers as full security sandboxes without configuring AppArmor, SELinux, or rootless user namespaces."
        ]
      }
    },
    {
      slug: "shell",
      why: {
        before: "Early computer operators interacted with machines via physical switches, punch card batches, or hardwired teletype machines that executed single programs sequentially without interactive user control or composable data flows.",
        problem: "Users had no interactive method to launch processes, inspect environment variables, chain programs together, redirect input/output streams, or automate repetitive system administration tasks without writing and compiling C programs.",
        shift: "The UNIX shell (pioneered by Ken Thompson in 1971 and popularized by Steve Bourne in 1979) created a universal command language and interactive execution environment centered around standard input/output streams, pipes, and process composition."
      },
      num: {
        t: "Shell Architectures & Command Processing Engines",
        h: ["Shell Implementation", "POSIX Compatibility", "Process Execution Model", "Interactive Productivity Features", "Primary Enterprise Role"],
        r: [
          ["Bourne Shell (sh / dash)", "Strict POSIX minimal subset", "Fork + Exec with minimal memory overhead", "Minimal; no tab completion or history search", "Fast init scripts, Debian package install scripts, minimal Docker containers"],
          ["Bash (Bourne-Again Shell)", "POSIX superset with bashisms", "Fork + Exec with rich built-in command parsing", "Tab completion, programmable completion, history expansion", "Default login shell on enterprise Linux (RHEL, Ubuntu), CI/CD build scripts"],
          ["Zsh (Z Shell)", "Highly configurable POSIX superset", "Fork + Exec with advanced parameter expansion", "Fuzzy auto-completion, rich themes (Oh My Zsh), syntax highlighting", "Default interactive shell on macOS, power-user developer workstations"],
          ["Fish (Friendly Interactive Shell)", "Deliberately non-POSIX compliant", "Fork + Exec with clean modern syntax", "Out-of-the-box autosuggestions, web configuration, auto-completion", "Personal developer terminals; unsuitable for POSIX shell scripts"],
          ["PowerShell Core (pwsh)", "Non-POSIX; Object-oriented pipeline", "Fork + Exec + .NET Core runtime objects", "Typed object pipelines, rich tab completion across platforms", "Cross-platform Windows/Linux systems administration, Azure automation"]
        ],
        n: "The shell functions as both an interactive command language interpreter and a scripting language environment. When a command line is entered, the shell executes an internal evaluation pipeline: 1) Tokenization into words and operators; 2) Brace expansion ({1..10}); 3) Tilde expansion (~); 4) Parameter and variable expansion ($VAR); 5) Command substitution ($(cmd)); 6) Arithmetic expansion ($((a + b))); 7) Word splitting based on the Internal Field Separator ($IFS); 8) Pathname expansion (globbing with * and ?); 9) Redirection setup (<, >, 2>&1); and 10) Command execution. For external commands, the shell executes the fork() system call to create a child process, uses dup2() to rewire file descriptors 0 (stdin), 1 (stdout), and 2 (stderr) to target files or pipes, and invokes execve() to overwrite the child's address space with the executable binary. In a pipeline (e.g., 'cat file | grep pattern'), the shell calls pipe() to instantiate a kernel ring buffer, connects the stdout of the upstream process to the pipe write-end, connects the stdin of the downstream process to the pipe read-end, and executes both processes concurrently."
      },
      miss: [
        {
          w: "Shell scripts written for bash will run without modifications in any POSIX /bin/sh shell.",
          r: "Bash includes extensive non-POSIX extensions ('bashisms' like [[ ]], arrays, and <<<) that fail with syntax errors when executed by strict POSIX shells like dash (used as /bin/sh in Debian and Ubuntu)."
        },
        {
          w: "In a pipeline like 'A | B', process A must finish executing and close before process B begins running.",
          r: "All commands in a pipeline are launched concurrently in separate child processes; data streams continuously through the kernel pipe buffer, and process B blocks only when the buffer is empty."
        },
        {
          w: "Shell built-in commands (like cd, echo, export) execute as child processes spawned via fork().",
          r: "Built-in commands execute directly within the parent shell process without fork(); if cd were an external binary, it would change only its child process working directory and leave the parent shell unchanged."
        },
        {
          w: "Putting double quotes around variables in shell scripts is purely stylistic and optional.",
          r: "Unquoted variables undergo word splitting and pathname expansion (globbing); omitting double quotes causes paths with spaces or special characters to split into multiple arguments or expand unexpectedly."
        }
      ],
      trade: {
        buys: [
          "Composable automation: effortlessly combine independent command-line utilities into powerful data pipelines via pipes.",
          "Rapid prototyping: write concise, declarative scripts that manipulate files, processes, and network sockets without compiling.",
          "Universal availability: POSIX shells are installed by default on virtually every UNIX, Linux, and macOS system on Earth.",
          "Interactive control: direct inspectability of running processes, environment variables, exit codes, and hardware state."
        ],
        costs: [
          "Process spawning overhead: running tight loops that invoke external binaries (e.g., sed or awk in a while loop) creates massive fork() overhead.",
          "Fragile error handling: scripts continue executing past failed commands by default unless 'set -euo pipefail' is explicitly enabled.",
          "Lack of strong data structures: bash lacks native multi-dimensional arrays, objects, or strict type systems, making large scripts unmaintainable.",
          "Security vulnerability to injection: unescaped variables in eval or command strings lead to arbitrary command execution vulnerabilities."
        ],
        avoid: [
          "Writing shell scripts without 'set -euo pipefail' at the top to catch unhandled errors and unset variables.",
          "Building complex multi-thousand-line business applications in bash instead of Python, Go, or Rust.",
          "Leaving shell variables unquoted when passing paths or user inputs (always use \"$VAR\").",
          "Using non-standard 'bashisms' in scripts that specify '#!/bin/sh' in their shebang line."
        ]
      }
    },
    {
      slug: "daemon",
      why: {
        before: "In early interactive computing, all programs were bound directly to a physical teletype terminal (TTY); when the user logged out or the communication line dropped, the operating system kernel terminated all associated child processes.",
        problem: "Essential background infrastructure services—such as web servers, database engines, print spoolers, and cron schedulers—could not remain continuously active because they terminated whenever their launching terminal session ended.",
        shift: "The daemon pattern established an autonomous background execution model in UNIX/Linux: processes decouple from controlling terminals, disassociate session and process groups, redirect standard streams to null devices or log sinks, and run continuously in the background to serve requests."
      },
      num: {
        t: "Background Service Execution Models Comparison",
        h: ["Execution Paradigm", "Session / Terminal Decoupling", "Process Lifecycle Management", "Service Health & Restarts", "Standard Output / Error Handling"],
        r: [
          ["Classic SysV Forking Daemon", "Double-fork() + setsid() detaches from TTY", "Orphaned to PID 1 (init); self-managed PID file", "No automated supervision; requires external watchdog scripts", "Redirected to /dev/null or manual syslog() calls"],
          ["Systemd Service Unit", "Foreground execution (Type=simple / exec); systemd handles cgroup", "Managed directly by PID 1; tracked via kernel cgroups", "Automated restart policies (Restart=on-failure), watchdog timeouts", "Captured automatically by systemd-journald via stdout/stderr socket"],
          ["Supervisord / Runit Supervisor", "Sub-process spawned directly under supervisor", "Supervisor tracks child PID directly", "Fast polling or SIGCHLD tracking with automated restart", "Piped directly to log rotation files or central sinks"],
          ["OCI Container Entrypoint", "Single foreground PID 1 inside container namespace", "Managed by container runtime (containerd/runc) shim", "Orchestrator-managed (Kubernetes liveness/readiness probes)", "Streamed to container log drivers (json-file, fluentd, journald)"]
        ],
        n: "The classical UNIX daemonization sequence involves six precise operational steps: 1) The process executes fork() and the parent immediately calls exit(0), returning control to the invoking shell and guaranteeing that the child is not a process group leader; 2) The child calls setsid(), creating a new session, becoming the session leader, and breaking association with any controlling terminal (TTY); 3) The process executes a second fork() and exits the intermediate parent, ensuring the resulting daemon process is not a session leader and can never accidentally reacquire a controlling terminal (e.g., when opening a TTY device file); 4) It calls chdir('/') to ensure it does not hold a lock on a mounted filesystem, allowing administrators to unmount volumes cleanly; 5) It calls umask(0) to ensure file creation permissions are not masked by the inherited environment; and 6) It closes inherited file descriptors (0, 1, 2) and reopens them to /dev/null to prevent spurious I/O errors. Modern service managers like systemd obsolete manual daemonization: services run in the foreground (Type=simple or Type=notify via sd_notify), allowing systemd to track processes via cgroups and eliminating PID file race conditions."
      },
      miss: [
        {
          w: "Appending an ampersand (&) to a shell command converts it into a true UNIX daemon.",
          r: "Appending '&' merely runs a job in the background of the current shell session; the process remains attached to the controlling terminal and will terminate upon logout when the shell sends SIGHUP unless nohup or disown is used."
        },
        {
          w: "Modern systemd services should use double-forking daemonization code to run properly in production.",
          r: "Systemd prefers non-forking foreground services (Type=simple or Type=notify); double-forking introduces PID tracking ambiguity, makes cgroup accounting complex, and obscures startup readiness."
        },
        {
          w: "A daemon can never receive keyboard or interactive user inputs under any circumstances.",
          r: "While daemons have no controlling terminal, they interact with users and processes via UNIX domain sockets, named pipes (FIFOs), network sockets, and signals (e.g., SIGHUP to reload configuration)."
        },
        {
          w: "PID files (/var/run/*.pid) provide 100% reliable tracking and single-instance locking for daemons.",
          r: "PID files are prone to race conditions, stale locks following sudden crashes or power failures, and PID recycling where an unrelated new process receives the dead daemon's former PID; flock() or systemd cgroups are required."
        }
      ],
      trade: {
        buys: [
          "Continuous autonomous execution: services run independently of user login sessions and terminal disconnections.",
          "System resource isolation: background tasks operate without locking mounted filesystems or holding terminal buffers open.",
          "Predictable startup orchestration: integrates with system init managers for automated boot startup and dependency sequencing.",
          "Standardized signal communication: supports standard administrative controls (SIGHUP for reload, SIGTERM for graceful exit)."
        ],
        costs: [
          "Operational debugging complexity: daemons have no interactive stdout/stderr; debugging requires analyzing log files or strace.",
          "Zombie and orphan leak risks: poorly written daemons that fail to reap child processes create zombie processes that consume kernel PID tables.",
          "Silent failure modes: crashes in background daemons go unnoticed unless monitored by active health checks or process supervisors.",
          "Security privilege persistence: daemons started as root must explicitly drop privileges (setuid/setgid) to avoid privilege escalation risks."
        ],
        avoid: [
          "Writing legacy double-forking code for new services designed to run in systemd or Docker containers.",
          "Leaving standard file descriptors (stdin/stdout/stderr) open to inherited terminal devices.",
          "Running daemons with the working directory set to a removable or NFS-mounted storage volume.",
          "Storing plaintext passwords or secrets in command-line arguments visible in global ps -ef listings."
        ]
      }
    },
    {
      slug: "signal",
      why: {
        before: "Early operating systems provided no mechanism to asynchronously notify or interrupt an executing program from the outside without terminating the computer hardware or cutting physical power lines.",
        problem: "Applications could not respond to hardware events (such as arithmetic division by zero or invalid memory accesses), handle user abort requests (Ctrl+C), implement execution timeouts, or perform graceful buffer flushing before system shutdown.",
        shift: "UNIX signals introduced software interrupts delivered asynchronously by the kernel to user-space processes, suspending normal instruction execution to invoke custom signal handlers or execute default kernel actions."
      },
      num: {
        t: "Essential POSIX Signals & Execution Semantics",
        h: ["Signal Name", "Signal Number (x86)", "Default Action", "Catchable / Maskable?", "Primary Operating System Role"],
        r: [
          ["SIGHUP (Hangup)", "1", "Terminate process", "Yes (Catchable & Maskable)", "Notifies terminal disconnection; universally used by daemons to reload configuration files"],
          ["SIGINT (Interrupt)", "2", "Terminate process", "Yes (Catchable & Maskable)", "Triggered by terminal driver on Ctrl+C; requests graceful user interruption"],
          ["SIGKILL (Kill)", "9", "Forced immediate termination", "No (Cannot be caught, blocked, or ignored)", "Immediate kernel-enforced process termination; uncatchable emergency stop"],
          ["SIGSEGV (Segmentation Violation)", "11", "Terminate process + Core dump", "Yes (Catchable & Maskable)", "Triggered by CPU MMU on invalid memory access or permission violation (#PF exception)"],
          ["SIGTERM (Terminate)", "15", "Terminate process", "Yes (Catchable & Maskable)", "Standard termination signal sent by kill, systemd, and Kubernetes to request clean shutdown"],
          ["SIGCHLD (Child Status Changed)", "17", "Ignore", "Yes (Catchable & Maskable)", "Sent to parent process when a child process terminates, stops, or resumes; used to reap zombies"]
        ],
        n: "A signal is an asynchronous notification delivered by the kernel to a process or thread. When a signal is generated (by a hardware exception like SIGSEGV, or via the kill() system call), the kernel marks a pending bit in the task_struct signal bitmap. Delivery occurs when the process transitions from kernel mode back to user mode (e.g., following a timer interrupt or system call return). If a custom signal handler is registered via sigaction(), the kernel saves the current user register context onto the user stack (creating a ucontext_t signal frame), sets the instruction pointer (RIP) to the address of the signal handler, and sets the return address to a kernel trampoline function (which calls rt_sigreturn()). When the handler completes, rt_sigreturn() restores the original CPU registers and resumes the interrupted code. Because a signal can interrupt execution at any arbitrary CPU instruction—including while the thread holds internal locks inside malloc() or printf()—signal handlers must strictly call async-signal-safe functions (functions that are reentrant or do not use shared locks, such as write(), _exit(), or atomic sig_atomic_t flag sets)."
      },
      miss: [
        {
          w: "Sending 'kill -9' (SIGKILL) is the standard and recommended way to stop any unresponsive process.",
          r: "SIGKILL immediately kills the process without running cleanup code, preventing the application from flushing database buffers, closing network sockets, removing lock files, or notifying child processes, risking severe state corruption."
        },
        {
          w: "A signal handler can safely call any standard library function like printf(), malloc(), or free().",
          r: "Standard library functions like printf() and malloc() acquire internal global mutexes; if a signal interrupts a thread while it already holds that mutex, calling malloc() inside the handler causes an immediate, unrecoverable deadlock."
        },
        {
          w: "Signals can deliver rich, complex payload objects and data structures directly to a process.",
          r: "Standard POSIX signals carry no payload beyond the signal number; only real-time signals (SIGRTMIN to SIGRTMAX) using sigqueue() can transmit a single integer or pointer value."
        },
        {
          w: "If an application receives ten identical signals in rapid succession, the signal handler will execute ten times.",
          r: "Standard POSIX signals are represented as a bitmask and do not queue; if multiple instances of the same signal arrive while that signal is blocked, only one instance is recorded and delivered."
        }
      ],
      trade: {
        buys: [
          "Asynchronous event handling: intercept user interruptions, hardware faults, and administrative shutdown requests instantly.",
          "Graceful shutdown coordination: allows microservices and databases to drain active HTTP connections and commit dirty pages before exiting.",
          "Zero-downtime configuration reload: update daemon configuration files in place by sending SIGHUP without terminating the process.",
          "Child lifecycle monitoring: parent processes track child process termination asynchronously via SIGCHLD without busy-waiting."
        ],
        costs: [
          "Async-signal safety constraints: writing safe signal handlers is notoriously difficult; only a tiny subset of POSIX APIs is safe to call.",
          "Reentrancy bugs and race conditions: unexpected signal delivery can corrupt global state unless variables are protected with sig_atomic_t.",
          "System call interruption: blocking system calls may fail with EINTR when interrupted by a signal, requiring explicit retry logic.",
          "Non-queueing lossiness: standard signals drop redundant events if they occur before the process can process the first notification."
        ],
        avoid: [
          "Invoking non-async-signal-safe functions (printf, malloc, free, syslog) inside signal handlers.",
          "Using kill -9 (SIGKILL) as the first response to stop services instead of sending SIGTERM and allowing a graceful drain window.",
          "Ignoring SIGCHLD in parent processes without calling wait()/waitpid(), which leaks zombie processes into the kernel task table.",
          "Relying on deprecated signal() API instead of the robust, standard sigaction() interface with SA_RESTART flags."
        ]
      }
    },
    {
      slug: "cpu",
      why: {
        before: "Early electromechanical and electronic calculating machines (such as ENIAC) were single-purpose calculating devices configured by manually rewiring physical plugboards, switches, and patch cables for every specific mathematical problem.",
        problem: "Reprogramming hardware required hours or days of physical rewiring, hardware could not store instructions in memory, operations were strictly sequential without conditional branching, and computation speeds were bottlenecked by manual human intervention.",
        shift: "The stored-program concept (von Neumann and Harvard architectures) established the Central Processing Unit (CPU) as a universal, programmable instruction engine executing a continuous cycle of Fetch, Decode, Execute, Memory Access, and Writeback from shared memory."
      },
      num: {
        t: "CPU Architecture Paradigms Comparison",
        h: ["Dimension", "CISC (x86-64 / Intel & AMD)", "RISC (ARM64 / Apple & Neoverse)", "Open RISC (RISC-V)", "VLIW / DSP (Very Long Instruction Word)"],
        r: [
          ["Instruction Set Architecture", "Variable-length (1 to 15 bytes); complex multi-operation instructions", "Fixed-length (32-bit); load/store architecture with simple instructions", "Modular fixed-length (32-bit standard); open-source royalty-free ISA", "Very long instruction words containing multiple parallel operations"],
          ["Decoding Complexity", "Complex hardware decoders translate CISC instructions into internal micro-ops (uops)", "Simple, power-efficient decoders operating directly on aligned instructions", "Extremely clean, minimal base integer ISA with optional extensions", "Zero runtime hardware scheduling; compiler explicitly schedules parallel execution"],
          ["Out-of-Order Execution (OoO)", "Massive Reorder Buffers (ROB), register renaming, deep speculation", "Aggressive OoO in modern cores (Apple M-series, Cortex-X), lightweight in embedded", "Supported in high-end implementations; in-order in low-power cores", "Strictly in-order; compiler statically resolves all execution pipelines"],
          ["Power Efficiency", "Moderate to high power consumption (higher transistor count for legacy decode)", "Exceptional performance-per-watt across mobile, laptops, and cloud datacenters", "Highly power-efficient; customizable silicon footprint", "Ultra-low power for dedicated signal processing; poor for general OS code"],
          ["Dominant Workload", "Legacy enterprise servers, high-end PC gaming, complex scientific workstations", "Mobile devices, hyperscale cloud servers (AWS Graviton), modern consumer PCs", "Embedded microcontrollers, custom AI accelerators, IoT devices", "Audio/video signal processing, radar systems, telecommunications"]
        ],
        n: "The modern high-performance CPU operates as a superscalar, out-of-order (OoO) pipelined instruction processor. The execution pipeline comprises five foundational stages: 1) Instruction Fetch (loading instruction bytes from L1 instruction cache using the program counter and branch predictors); 2) Instruction Decode (translating variable or fixed-length instructions into internal micro-operations / uops); 3) Register Renaming and Allocation (mapping architectural registers to a vast internal physical register file to eliminate Write-After-Read / WAR and Write-After-Write / WAW false dependencies); 4) Out-of-Order Execution (scheduling uops into available Arithmetic Logic Units, floating-point units, and memory load/store queues as soon as their operands are ready, bypassing stalled instructions); and 5) Retirement / Writeback (committing results to architectural state in strict program order via the Reorder Buffer / ROB to ensure precise exception handling). Modern CPUs incorporate advanced branch prediction algorithms (such as TAGE - TAgged GEometric history length predictors) with >95% accuracy; a branch misprediction flushes the entire speculative instruction pipeline, incurring a 15–20 clock cycle latency penalty."
      },
      miss: [
        {
          w: "A CPU with a higher clock speed (GHz) is always faster than a CPU with a lower clock speed.",
          r: "Total CPU performance is defined by the Iron Law of Processor Performance: Execution Time = (Instructions) * (Cycles Per Instruction / CPI) * (Clock Cycle Time); architectural IPC (Instructions Per Cycle) and cache efficiency often outweigh raw clock frequency."
        },
        {
          w: "Modern x86 CPUs execute raw x86 assembly instructions directly on the silicon hardware.",
          r: "Modern x86 processors are RISC engines underneath: hardware decoders translate complex CISC x86 instructions into simpler, fixed-length RISC micro-operations (uops) that execute on out-of-order execution pipelines."
        },
        {
          w: "Having more CPU cores will automatically make every software application run faster.",
          r: "Software speedup from multi-core parallelism is strictly limited by the sequential, unparallelizable portion of the algorithm, as formalized by Amdahl's Law: Speedup = 1 / ((1 - P) + (P / N))."
        },
        {
          w: "The CPU executes instructions strictly in the exact order written in the compiled binary code.",
          r: "Out-of-Order (OoO) CPUs execute instructions speculatively based on data dependency availability, reordering execution on the fly and restoring apparent sequential order only upon final retirement in the Reorder Buffer."
        }
      ],
      trade: {
        buys: [
          "Universal general-purpose computation: executes arbitrary algorithmic logic, branch-heavy control code, and complex operating systems.",
          "Low-latency single-thread execution: massive caches, aggressive speculation, and high clock frequencies minimize serial task latency.",
          "Rich instruction set features: hardware virtualization (VT-x/AMD-V), cryptographic acceleration (AES-NI), and SIMD vector math.",
          "Backwards compatibility: x86-64 processors execute legacy binaries compiled decades ago without recompilation."
        ],
        costs: [
          "High power consumption and thermal dissipation: complex out-of-order logic, branch predictors, and high clock rates generate massive heat.",
          "Silicon area overhead: up to 80% of CPU die area is dedicated to caches, branch predictors, and decoders rather than raw execution ALUs.",
          "Memory wall bottleneck: CPU computation speed far outpaces DRAM access latency, requiring massive multi-level cache hierarchies.",
          "Speculative execution vulnerabilities: branch prediction and speculative execution expose side-channel attacks (Spectre, Meltdown)."
        ],
        avoid: [
          "Writing code with unpredictable branch patterns in tight performance loops, which causes continuous branch misprediction pipeline stalls.",
          "Assuming code will scale linearly across dozens of CPU cores without eliminating shared memory lock contention.",
          "Running compute-intensive matrix math on scalar CPU registers instead of leveraging SIMD vector instructions (AVX-512, NEON) or GPUs.",
          "Ignoring CPU cache alignment and data locality: memory stalls frequently bottleneck CPU workloads far more than raw arithmetic instructions."
        ]
      }
    },
    {
      slug: "cpu-cache",
      why: {
        before: "In early microcomputers (1970s–1980s), CPU clock speeds and DRAM memory speeds operated at comparable frequencies (~1–5 MHz); CPUs accessed main memory directly in a single clock cycle without waiting.",
        problem: "Between 1980 and 2000, CPU clock frequencies accelerated exponentially from 5 MHz to over 1 GHz, while DRAM memory latency improved by only ~10% per decade (the 'Memory Wall'). Without caching, modern 3–5 GHz CPUs would waste over 95% of their execution cycles stalled waiting for memory.",
        shift: "Hardware CPU caches introduced a hierarchical pyramid of tiny, ultra-fast Static RAM (SRAM) banks integrated directly onto the CPU die (L1, L2, L3), exploiting the physical principles of temporal and spatial locality to deliver data to execution units in 1 to 40 clock cycles."
      },
      num: {
        t: "Modern CPU Memory Hierarchy Latency & Capacity",
        h: ["Memory Level", "Typical Capacity (Per Core / Socket)", "Access Latency (Cycles)", "Access Latency (Nanoseconds)", "Physical Implementation & Scope"],
        r: [
          ["L1 Data Cache (L1D)", "32 KB – 64 KB per core", "~4–5 clock cycles", "~1.0–1.2 ns", "On-core SRAM; 8-way set-associative; single-cycle access"],
          ["L1 Instruction Cache (L1I)", "32 KB – 64 KB per core", "~4–5 clock cycles", "~1.0–1.2 ns", "On-core SRAM; feeds instruction fetch and decode units"],
          ["L2 Cache", "512 KB – 2 MB per core", "~12–14 clock cycles", "~3.0–3.5 ns", "Dedicated on-core SRAM; non-inclusive or inclusive"],
          ["L3 Cache (Last Level Cache / LLC)", "16 MB – 96 MB per socket (up to 768 MB 3D V-Cache)", "~35–50 clock cycles", "~10–12 ns", "Shared on-die SRAM pool across all cores in socket / CCD"],
          ["Main Memory (DDR5 DRAM)", "16 GB – 512 GB", "~150–250 clock cycles", "~50–80 ns", "Off-die dynamic capacitor DRAM; accessed via memory bus"],
          ["NVMe SSD (PCIe Gen 4/5)", "512 GB – 8 TB", "~50,000–200,000 cycles", "~10,000–50,000 ns (10–50 us)", "Non-volatile NAND flash; accessed via PCIe storage controller"]
        ],
        n: "CPU caches organize data into uniform blocks called cache lines, universally standardized to 64 bytes in modern x86 and ARM processors. A physical memory address is divided into three bit fields: Tag, Set Index, and Block Offset. In an N-way set-associative cache, the Set Index directs the request to a specific cache set containing N independent lines; the hardware compares the address Tag in parallel against all N tags to detect a cache hit. Cache replacement algorithms (like Pseudo-LRU or adaptive insertion policies) evict old lines when a set is full. Multi-core systems maintain cache coherency across cores using the MESI (Modified, Exclusive, Shared, Invalid) or MOESI protocol via bus snooping or directory filters. A critical performance pitfall is 'false sharing': when two independent threads on different CPU cores modify distinct variables that happen to share the exact same 64-byte cache line, the cache coherency hardware repeatedly bounces the line between core caches in the Invalid/Modified states, degrading multi-threaded throughput by orders of magnitude."
      },
      miss: [
        {
          w: "CPUs read and write individual bytes or 64-bit integers directly from main memory.",
          r: "The CPU memory subsystem never transfers single variables; it loads and evicts data in full 64-byte cache lines, meaning accessing a single 1-byte boolean pulls the entire surrounding 64-byte memory window into the cache."
        },
        {
          w: "Traversing a 2D matrix row-by-row or column-by-column has the exact same execution performance.",
          r: "In row-major languages (C, C++, Rust), row-by-row traversal accesses contiguous memory, yielding spatial locality and hardware prefetching hits; column-by-column traversal strides across memory lines, causing a cache miss on every access and running 10x to 50x slower."
        },
        {
          w: "Linked lists are just as cache-friendly as contiguous arrays if they store the same data.",
          r: "Array elements are packed contiguously in memory, allowing hardware prefetchers to preload cache lines before execution; linked list nodes are scattered across the heap, forcing the CPU to stall on pointer-chasing cache misses."
        },
        {
          w: "Adding hardware mutexes and atomic variables to multi-threaded code has negligible overhead if there is no lock contention.",
          r: "Atomic write operations require exclusive cache line ownership (Invalidating all other core caches under MESI), which flushes CPU store buffers and forces memory bus synchronization cycles."
        }
      ],
      trade: {
        buys: [
          "Bridges the Memory Wall: converts slow 80 ns DRAM accesses into lightning-fast 1 ns L1 cache hits for active data.",
          "Spatial locality acceleration: hardware prefetchers automatically detect sequential access patterns and preload upcoming cache lines.",
          "Temporal locality reuse: frequently accessed loop variables, stack frames, and lookup tables remain hot in SRAM.",
          "Transparent hardware operation: works automatically without requiring manual programmer register management."
        ],
        costs: [
          "Silicon area and manufacturing expense: on-die SRAM consumes vast transistor budgets and increases chip manufacturing costs.",
          "Cache coherency bus traffic: multi-core MESI protocol snooping creates memory bus contention under heavy cross-core writes.",
          "False sharing traps: concurrent writes to adjacent independent variables ruin multi-threaded scaling.",
          "Cache side-channel attacks: timing discrepancies between cache hits and misses enable cryptographic key leakage (Spectre/Meltdown)."
        ],
        avoid: [
          "Using pointer-heavy data structures (like deeply linked lists or trees) for performance-critical inner loops instead of flat arrays.",
          "Allowing independent multi-threaded worker variables to share the same 64-byte cache line (use alignas(64) or padding).",
          "Iterating through multidimensional arrays against the language's native memory storage order (row-major vs column-major).",
          "Routinely flushing CPU caches or executing serializing memory fences unnecessarily in performance-critical code."
        ]
      }
    },
    {
      slug: "gpu",
      why: {
        before: "Early computer graphics were rendered entirely by the CPU using software rasterizers that computed vertex projections, rasterized polygons, and wrote scanline pixels directly into raw VGA framebuffer memory.",
        problem: "CPUs are designed for low-latency serial instruction execution, featuring only a handful of complex cores; rendering millions of independent pixels and vertices at 60+ frames per second overwhelmed CPU pipelines, limiting games and visualizations to low resolutions and primitive graphics.",
        shift: "The Graphics Processing Unit (GPU, pioneered by NVIDIA GeForce 256 in 1999 and generalized via CUDA in 2006) abandoned complex out-of-order execution and massive branch predictors to pack thousands of lightweight arithmetic cores that execute massive Single Instruction, Multiple Threads (SIMT) parallelism across graphics, matrix math, and deep learning."
      },
      num: {
        t: "Compute Hardware Architectures Comparison",
        h: ["Dimension", "Modern Server CPU (AMD EPYC / Intel Xeon)", "Datacenter GPU (NVIDIA H100 SXM5)", "Unified Mobile GPU (Apple M3 Max)", "Dedicated AI ASIC (Google TPU v5p)"],
        r: [
          ["Core Count & Topology", "64–128 complex out-of-order cores", "144 Streaming Multiprocessors (16,896 CUDA cores, 528 Tensor cores)", "40 GPU cores (5,120 ALUs) unified with CPU", "8,960 Tensor Cores per pod / 4 VMMUs per chip"],
          ["Parallelism Paradigm", "MIMD (Multiple Instruction, Multiple Data) + SIMD (AVX-512)", "SIMT (Single Instruction, Multiple Threads) scheduled in 32-thread warps", "SIMT scheduled in 32-thread SIMD execution units", "Systolic Array architecture executing matrix multiplications"],
          ["Memory Bandwidth", "DDR5-4800: ~460 GB/s (12 channels)", "HBM3: 3,350 GB/s (3.35 TB/s) on-package", "Unified LPDDR5: 400 GB/s shared memory", "HBM2e: 4,800 GB/s aggregate bandwidth"],
          ["Peak Compute (FP16 / BF16)", "~5–10 TFLOPS (using AVX-512)", "1,979 TFLOPS (almost 2 PFLOPS FP16 Tensor Core)", "~28 TFLOPS FP32 / ~56 TFLOPS FP16", "459 TFLOPS BF16 per chip"],
          ["Optimal Workload", "Branch-heavy business logic, operating systems, compilers, database queries", "Deep learning training/inference, 3D ray tracing, molecular dynamics", "On-device creative video/audio editing, local ML inference", "Large-scale LLM pretraining and matrix-heavy transformer models"]
        ],
        n: "A GPU achieves massive computational throughput by organizing thousands of execution units into Streaming Multiprocessors (SMs). Execution is governed by the Single Instruction, Multiple Threads (SIMT) model: user code is written as a thread kernel, but the hardware scheduler groups threads into atomic units of 32 called warps. All 32 threads in a warp execute the exact same instruction simultaneously on different data. If code contains conditional branching (if-else), 'warp divergence' occurs: the SM disables threads that do not take the active path, serializes execution of both branches, and recombines threads afterward, halving compute efficiency. High-Bandwidth Memory (HBM3e) provides over 3 TB/s of memory throughput to feed thousands of cores. GPU memory access requires 'coalescing': when all 32 threads in a warp access consecutive memory addresses within a 128-byte cache line, the hardware combines the requests into a single memory bus transaction. Modern datacenter GPUs incorporate dedicated Tensor Cores—hardwired mixed-precision matrix multiplication units that compute D = A * B + C in a single clock cycle, forming the mathematical engine of modern artificial intelligence."
      },
      miss: [
        {
          w: "A GPU can completely replace a CPU and run an entire operating system faster.",
          r: "GPUs are specialized throughput accelerators; they lack complex out-of-order execution, branch predictors, and interrupt handling required to run operating systems, file systems, and branch-heavy general-purpose code."
        },
        {
          w: "Moving any computation to a GPU will automatically make it run faster than on a CPU.",
          r: "Offloading workloads to a discrete GPU incurs significant PCIe host-to-device memory transfer latency; small computations or algorithms with low arithmetic intensity run far slower on a GPU than on a local CPU."
        },
        {
          w: "Every thread on a GPU runs completely independently on its own dedicated physical CPU-like core.",
          r: "GPU threads are executed in lockstep warps of 32; threads do not have independent instruction pointers and share execution pipelines, caches, and registers within their Streaming Multiprocessor."
        },
        {
          w: "Conditional branching (if/else statements) works efficiently on GPU compute shaders and CUDA kernels.",
          r: "Branching inside a GPU warp causes warp divergence, where divergent paths are executed sequentially while inactive threads sit idle, severely degrading computational throughput."
        }
      ],
      trade: {
        buys: [
          "Massive mathematical throughput: deliver teraflops or petaflops of parallel floating-point performance for linear algebra and graphics.",
          "Extreme memory bandwidth: HBM memory interfaces provide over 3 TB/s bandwidth, eliminating memory bus bottlenecks for matrix math.",
          "Deep learning acceleration: specialized Tensor Cores execute low-precision matrix multiply-accumulate operations at incredible speeds.",
          "High energy efficiency for parallel tasks: delivers orders of magnitude more calculations per watt than CPUs for data-parallel problems."
        ],
        costs: [
          "Host-to-device transfer latency: copying data over the PCIe bus between CPU RAM and GPU VRAM creates severe latency bottlenecks.",
          "Severe branch divergence penalty: control flow with divergent branches wastes GPU execution cycles.",
          "Complex programming model: mastering CUDA, OpenCL, or Vulkan requires understanding warps, shared memory, and coalesced access.",
          "High thermal and financial cost: enterprise GPUs consume 700+ watts each and cost tens of thousands of dollars per accelerator."
        ],
        avoid: [
          "Transferring small arrays across the PCIe bus to perform trivial computations on the GPU.",
          "Writing GPU kernels with heavy conditional branching and divergence within 32-thread warps.",
          "Accessing GPU global memory with non-coalesced, random access patterns that trigger dozens of serialized memory transactions.",
          "Neglecting GPU shared memory (SRAM on SMs) to stage frequently reused matrix tiles during GEMM computations."
        ]
      }
    }
  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
