(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([
    {
      slug: "ide",
      why: {
        before: "Software engineers wrote code in plain text editors (Notepad, Ed, Vi), manually switched to a terminal to invoke compilers, switched to a third window to launch a debugger, and memorized API signatures from physical paper books.",
        problem: "Context switching between disjointed command-line tools wasted hours; developers had no real-time syntax checking, no refactoring automation, and spent days tracking down typos that compilers caught only during batch builds.",
        shift: "The Integrated Development Environment (IDE, pioneered by Smalltalk and popularized by Borland Turbo Pascal and Microsoft Visual Studio) unified code editing, compilation, debugging, static analysis, and version control into a single cohesive graphical workstation."
      },
      num: {
        t: "IDE Architectural Eras & Language Server Protocol (LSP)",
        h: ["IDE Generation / Architecture", "Core Technology & Runtime", "Language Support Decoupling", "Memory & Startup Footprint", "Representative Platforms"],
        r: [
          ["Monolithic Integrated IDE", "Native C++ / C# / Java desktop GUI", "Tight coupling: each language requires proprietary compiler plugin", "Heavy (500MB - 2GB RAM; slow startup)", "Visual Studio, IntelliJ IDEA, Eclipse, Xcode"],
          ["LSP-Decoupled Modern Editor", "Electron / Web tech (VS Code) or native Rust (Zed)", "Decoupled: Language Server Protocol ($M \\times N$ reduced to $M + N$)", "Moderate to Light (150MB - 600MB RAM)", "VS Code, Zed, Neovim (LSP), Cursor"],
          ["Cloud / Browser IDE", "Web browser client + remote container backend", "LSP running inside container / Kubernetes pod", "Zero local install; scales with cloud VM", "GitHub Codespaces, Gitpod, Cloud9, Replit"],
          ["Modal Terminal Editor", "C / Rust terminal TUI (ncurses, termion)", "Extensible via Lua/Vimscript + external LSP daemons", "Ultra-light (< 50MB RAM; instantaneous startup)", "Neovim, Vim, Emacs, Helix"]
        ],
        n: "The defining modern breakthrough in IDE architecture is the **Language Server Protocol (LSP)**, created by Microsoft, Red Hat, and Codenvy. Historically, supporting $M$ programming languages across $N$ distinct IDEs required writing $M \\times N$ independent plugins, duplicating parsing and AST indexing logic across every editor. The LSP standardized a JSON-RPC protocol over standard I/O: the editor acts as a dumb client displaying UI, while an out-of-process Language Server (such as `rust-analyzer`, `tsserver`, or `gopls`) parses the Abstract Syntax Tree, computes symbol references, and streams real-time diagnostic errors, autocomplete suggestions, and refactoring renames to the editor over JSON-RPC. This democratized world-class IDE intelligence, allowing editors like Neovim, Emacs, and VS Code to share the exact same compiler-grade intelligence."
      },
      miss: [
        {
          w: "A text editor with syntax highlighting (like Sublime Text or Notepad++) is a full IDE.",
          r: "Syntax highlighting is merely regular expression pattern matching; a true IDE provides deep semantic understanding: AST symbol indexing, type inference, integrated debugging with breakpoints, and automated refactoring."
        },
        {
          w: "Real professional software engineers only use bare-bones terminal editors and look down on graphical IDEs.",
          r: "World-class engineers select tools pragmatically: modern IDEs provide automated multi-file refactoring, memory profiling, and interactive visual debuggers that save hundreds of hours of manual labor."
        },
        {
          w: "VS Code is just a lightweight text editor and not a real IDE.",
          r: "VS Code with language servers (LSP), debugger adapters (DAP), and extension ecosystems provides full IDE functionality while retaining a modular, lightweight core architecture."
        },
        {
          w: "Using an IDE makes developers lazy and prevents them from understanding how compilers work.",
          r: "IDEs automate mechanical, repetitive tasks (imports, formatting, refactoring renames), freeing engineering cognitive capacity to focus on complex domain modeling and system architecture."
        }
      ],
      trade: {
        buys: [
          "Massive developer productivity: instant autocomplete, parameter hints, and jump-to-definition accelerate coding velocity.",
          "Real-time defect prevention: static analysis catches syntax errors and type mismatches instantly before code is ever run.",
          "Fearless automated refactoring: rename symbols and extract methods safely across thousands of files in a single click.",
          "Integrated graphical debugging: set breakpoints, inspect heap memory, and step through execution lines visually."
        ],
        costs: [
          "Hardware resource consumption: monolithic IDEs and Electron editors consume gigabytes of RAM and induce CPU battery drain.",
          "Configuration fatigue: configuring multi-language LSPs, linters, formatters, and workspace settings requires continuous maintenance.",
          "Startup latency: heavy IDEs take 10 to 30 seconds to index large multi-gigabyte codebases upon initial opening.",
          "Tooling dependence: developers can become helpless when forced to debug issues in headless production server terminals."
        ],
        avoid: [
          "Installing 50 unvetted extensions into your IDE, causing severe editor lag and battery drain.",
          "Relying on an IDE's GUI buttons without understanding the underlying Git, build, and compiler CLI commands.",
          "Committing IDE-specific project files (like `.idea/` or `.vscode/`) to shared git repositories without team consensus.",
          "Refusing to learn keyboard shortcuts, forcing you to reach for the mouse for every basic file navigation action."
        ]
      }
    },
    {
      slug: "command-line-interface",
      why: {
        before: "Computing was controlled through physical wiring boards, toggle switches on hardware front panels, and batches of punch cards submitted to mainframe operators.",
        problem: "Operating computers was slow, required physical presence, lacked conversational feedback, and could not be automated through scripted repeatable workflows.",
        shift: "The Command Line Interface (CLI) emerged via teletype terminals and Unix shells, establishing a text-based conversational interface where users execute commands, pass arguments, and compose programs via standard streams."
      },
      num: {
        t: "Command Line Interface Paradigms & Architectural Models",
        h: ["CLI Paradigm / Style", "Data Exchange Format", "Composition / Piping Model", "Programmability / Automation", "Primary Ecosystems"],
        r: [
          ["Unix / POSIX Shell (Bash, Zsh)", "Raw byte streams (unstructured plain text)", "POSIX Anonymous Pipes (`|`) streaming text lines", "Shell scripting (`.sh`), `awk`, `sed`, `grep`", "Linux, macOS, BSD, modern cloud containers"],
          ["Object-Oriented Shell (PowerShell)", ".NET Objects with typed properties", "Object Pipeline passing strongly typed instances", "Full .NET scripting with direct C# integration", "Windows administrative automation, enterprise DevOps"],
          ["Interactive REPL / TUI", "Structured text and terminal curses screens", "In-process interactive evaluation loops", "Interactive experimentation, debugging, REPL workflows", "Python REPL, Node.js CLI, `htop`, `lazygit`"],
          ["Modern Structured CLI (CLI Tools)", "JSON / YAML / Structured text tables", "Flags, subcommands, and machine-readable JSON flags (`--json`)", "Scriptable via `jq`, GitHub Actions, CI/CD pipelines", "Docker, Kubernetes `kubectl`, GitHub `gh`, AWS CLI"]
        ],
        n: "A Command Line Interface (CLI) is a mechanism of human-computer interaction based on sequential text prompts and inputs. The architecture separates three distinct components: (1) The Terminal Emulator (the GUI application, such as Alacritty, iTerm2, or Windows Terminal, that renders fonts and handles keyboard input), (2) The Pseudo-Terminal (PTY, an operating system kernel device that pairs a master controller with a slave terminal), and (3) The Shell (the command interpreter, such as Bash, Zsh, or Fish, that parses the input string, performs variable expansion, and executes system calls). Under POSIX, commands adhere to the Unix Philosophy: 'Write programs that do one thing and do it well. Write programs to work together. Write programs to handle text streams, because that is a universal interface.'"
      },
      miss: [
        {
          w: "The terminal window and the shell program are the exact same thing.",
          r: "The terminal (e.g. Windows Terminal, iTerm2) is a graphical program that displays text on screen; the shell (e.g. Bash, Zsh, PowerShell) is the command interpreter running inside the terminal that executes commands."
        },
        {
          w: "CLIs are obsolete relics from the 1970s that are inferior to modern Graphical User Interfaces (GUIs).",
          r: "CLIs are exponentially faster, scriptable, effortlessly automatable in CI/CD pipelines, accessible over remote SSH networks, and use minimal computing resources compared to GUIs."
        },
        {
          w: "Running a command in a CLI bypasses the operating system's security permissions.",
          r: "CLI commands execute with the exact same OS permissions and security rings as GUI applications; commands cannot access protected files unless run with elevated privileges (`sudo` / admin)."
        },
        {
          w: "CLI commands can only accept plain text arguments without structure.",
          r: "Modern CLIs (like `kubectl`, `gh`, `aws`) accept rich structured flags, configuration files, and emit machine-readable JSON payloads designed for automated parsing via tools like `jq`."
        }
      ],
      trade: {
        buys: [
          "Effortless automation: any CLI command sequence can be saved into a script and automated in headless CI/CD pipelines.",
          "Remote server accessibility: manage remote cloud servers and Kubernetes clusters across low-bandwidth SSH connections.",
          "Extreme operational speed: experienced engineers execute complex tasks in seconds via keyboard shortcuts and aliases.",
          "Universal composability: pipe output from one command directly into another (`grep | sort | uniq -c`)."
        ],
        costs: [
          "Steep cognitive learning curve: requires memorizing hundreds of commands, flags, and regular expression syntax.",
          "Zero discoverability: unlike GUIs with visual buttons, users must know command names and flags upfront (mitigated by `--help`).",
          "Catastrophic error blast radius: running destructive commands (`rm -rf /`) with typoed paths executes instantly with no confirmation.",
          "Text parsing brittleness: parsing unstructured text output from older Unix tools breaks if the tool updates its output formatting."
        ],
        avoid: [
          "Running destructive terminal commands copied from the internet without reading and understanding every single flag.",
          "Relying exclusively on GUI tools for deployments, making automated CI/CD pipeline automation impossible.",
          "Parsing human-formatted CLI tables with fragile `awk` scripts when the tool provides a stable `--json` flag.",
          "Running commands with root privileges (`sudo`) when standard user permissions are sufficient."
        ]
      }
    },
    {
      slug: "file-path",
      why: {
        before: "Early computer storage systems had flat disk layouts with no directory structures, forcing all files on a physical drive to share a single flat list of filenames.",
        problem: "Flat filesystems suffered catastrophic name collisions; managing thousands of files was impossible; and establishing organizational hierarchies or access controls was unfeasible.",
        shift: "Hierarchical File Systems (Multics, Unix) introduced the File Path: a string of characters that uniquely specifies the location of a file or directory within a tree-structured filesystem hierarchy."
      },
      num: {
        t: "File Path Archetypes & Cross-Platform Conventions",
        h: ["Path Representation", "Starting Anchor Point", "Separator Syntax", "Portability Across Machines", "Representative Example"],
        r: [
          ["Absolute Path (Unix/POSIX)", "Filesystem Root Directory (`/`)", "Forward slash (`/`)", "Machine-dependent (relies on absolute host disk path)", "`/var/log/nginx/access.log`"],
          ["Absolute Path (Windows)", "Drive letter root (`C:\\` or `D:\\`)", "Backslash (`\\`), forward slash accepted by Win32 APIs", "Machine-dependent (relies on specific drive letter)", "`C:\\Users\\Alice\\AppData\\Local`"],
          ["Relative Path", "Current Working Directory (CWD)", "Forward slash (`/`) or platform separator", "Highly portable across systems and git checkouts", "`./src/components/Button.tsx` or `../../config.json`"],
          ["UNC Path (Windows Network)", "Network server share root (`\\\\server\\share`)", "Backslash (`\\\\`)", "Network-dependent (enterprise LAN storage)", "`\\\\fileserver\\shared\\datasets\\data.csv`"],
          ["File URI (`file://`)", "Scheme identifier + absolute host path", "Forward slash (`/`)", "Universal RFC 8089 web/browser standard", "`file:///C:/Users/Alice/document.pdf`"]
        ],
        n: "A file path resolves through the Virtual File System (VFS) layer of the operating system kernel. Paths are classified into **Absolute Paths** (anchored at the root of the filesystem, resolving independently of current context) and **Relative Paths** (resolved relative to the calling process's Current Working Directory, or CWD). Path resolution involves two special directory entries present in every directory node: `.` (representing the current directory) and `..` (representing the parent directory). In cross-platform software engineering, path handling is a notorious source of bugs: Windows historically uses backslashes (`\\`) and drive letters (`C:`), while POSIX systems use forward slashes (`/`). Modern robust codebases strictly forbid string concatenation for paths, using standard normalization libraries (such as Node.js `path.join()` or Python's `pathlib.Path`)."
      },
      miss: [
        {
          w: "Hardcoding absolute paths like `C:\\Users\\john\\project` in your source code is fine for local development.",
          r: "Hardcoded absolute paths break immediately when another team member clones the repo or when code runs in CI/CD containers; always use relative paths or environment variables."
        },
        {
          w: "You should build file paths by manually concatenating strings with the `+` operator (`dir + '/' + file`).",
          r: "Manual string concatenation introduces double slashes (`dir//file`), missing slashes, and fails on Windows; always use standard path libraries (`path.resolve()`, `pathlib.Path`)."
        },
        {
          w: "Windows completely refuses to understand forward slashes (`/`) in file paths.",
          r: "Modern Windows OS APIs, PowerShell, and programming language runtimes handle forward slashes (`/`) seamlessly in file paths; only legacy `cmd.exe` strictly demands backslashes."
        },
        {
          w: "A relative path always resolves relative to the location where the source code file lives on disk.",
          r: "A relative path resolves relative to the process's **Current Working Directory (CWD)** where the script was launched, which may be completely different from where the script file resides (use `__dirname` or `import.meta.url` for file-relative paths)."
        }
      ],
      trade: {
        buys: [
          "Deterministic filesystem navigation: precisely locates any file or directory among millions of storage nodes.",
          "Portable relative addressing: code and assets remain functional regardless of where the repository is cloned on disk.",
          "Hierarchical data organization: naturally models project structures, modules, logs, and operating system assets.",
          "Cross-platform normalization: modern path libraries abstract differences between Windows and POSIX path syntax."
        ],
        costs: [
          "Cross-platform delimiter bugs: naive backslash handling causes escape character bugs and cross-platform failures.",
          "The 'Path Traversal' security vulnerability: un-sanitized user paths containing `../` allow attackers to read `/etc/passwd`.",
          "Working directory confusion: assuming relative paths resolve to the script location rather than process CWD causes file-not-found bugs.",
          "Case sensitivity mismatches: Linux filesystems (ext4) are case-sensitive, while macOS (APFS) and Windows (NTFS) are case-insensitive by default."
        ],
        avoid: [
          "Concatenating file paths using raw string operations (use `path.join()` in Node or `pathlib` in Python).",
          "Hardcoding machine-specific absolute paths (`/Users/myuser/...`) into source code or configuration files.",
          "Allowing un-sanitized user-supplied filenames in file reading endpoints, opening Path Traversal vulnerabilities.",
          "Writing filenames with inconsistent casing that work on macOS/Windows laptops but fail when deployed to Linux containers."
        ]
      }
    },
    {
      slug: "localhost",
      why: {
        before: "Testing network applications required deploying code to physical remote servers across local area networks, requiring external network connectivity and hardware setup.",
        problem: "Network testing was slow, insecure, exposed unfinished development code to local networks, and failed completely when developers worked offline without internet connections.",
        shift: "The IETF (RFC 1122 and RFC 6761) reserved the Loopback Interface and the domain name `localhost` (`127.0.0.1` / `::1`): routing network packets directly back to the local machine entirely within operating system memory without hitting physical network hardware."
      },
      num: {
        t: "Localhost Networking & Loopback Interface Specifications",
        h: ["Networking Primitive", "IP Address / Representation", "Network Routing Boundary", "Physical Hardware Traversal", "Primary Engineering Role"],
        r: [
          ["IPv4 Loopback Address", "`127.0.0.1` (entire `127.0.0.0/8` block)", "Operating system network kernel stack only", "Zero; never leaves local memory/NIC hardware", "Local dev servers, database testing, microservice mocks"],
          ["IPv6 Loopback Address", "`::1` (compressed notation for 127 zeros + 1)", "OS IPv6 networking stack", "Zero; internal kernel loopback driver (`lo`)", "Modern IPv6 local socket communications"],
          ["Loopback Domain Name", "`localhost` (RFC 6761 reserved)", "Resolved via local `hosts` file or OS resolver", "Zero; mapped directly to `127.0.0.1` or `::1`", "Browser local development URL (`http://localhost:3000`)"],
          ["Wildcard / Any Interface", "`0.0.0.0` (IPv4) or `::` (IPv6)", "Binds socket to ALL available network interfaces", "Listens on both local loopback AND external LAN/Wi-Fi", "Binding server to allow external LAN/mobile testing"],
          ["Docker Container Localhost", "Container-isolated network namespace", "Bound to container's internal loopback interface", "Zero; cannot see host machine loopback without bridge", "Containerized service isolation (`host.docker.internal` needed)"]
        ],
        n: "The domain name `localhost` is a reserved top-level domain mapping to the Loopback Network Interface. When an application dispatches a TCP/IP packet to `localhost` or `127.0.0.1`, the operating system's network routing table detects the loopback destination address. Rather than passing the packet down to the physical Network Interface Card (NIC) hardware, the OS kernel's virtual loopback driver (`lo` in Linux) immediately short-circuits the packet back up the TCP/IP stack to the listening local socket. This communication occurs entirely within system RAM at multi-gigabit speeds, bypassing Ethernet cables, Wi-Fi radios, and external routers. Crucially, a common source of confusion in containerized environments (Docker) is that each container possesses its own private network namespace: `localhost` inside a Docker container refers to that specific container, not the host machine."
      },
      miss: [
        {
          w: "Visiting `http://localhost:3000` in your web browser sends data across the internet.",
          r: "`localhost` routes 100% within your local computer's operating system memory; zero packets ever leave your machine or touch an internet connection, functioning fully offline."
        },
        {
          w: "Binding a local development server to `localhost` allows coworkers on your local Wi-Fi to test your app.",
          r: "`localhost` (`127.0.0.1`) is strictly private to your own computer; to allow other devices on your local Wi-Fi to connect, you must bind the server to `0.0.0.0` (all interfaces) and share your local LAN IP address."
        },
        {
          w: "Inside a Docker container, `localhost` connects to servers running on your host laptop.",
          r: "Inside a container, `localhost` points to the container itself; connecting to the host machine from inside Docker requires `host.docker.internal` or host networking mode."
        },
        {
          w: "The domain `localhost` requires paying a domain registrar like GoDaddy to keep active.",
          r: "`localhost` is permanently reserved by IETF RFC 6761; your computer's operating system resolves it locally without ever querying an external public DNS server."
        }
      ],
      trade: {
        buys: [
          "Zero-latency network testing: test web servers, APIs, and microservices in memory at gigabyte-per-second bus speeds.",
          "Complete offline independence: develop and test full-stack web applications on airplanes with zero internet connection.",
          "Total security isolation: local dev servers bound to `127.0.0.1` cannot be accessed by external attackers on public Wi-Fi.",
          "Zero infrastructure cost: test complex multi-tier database and frontend architectures without paying for cloud servers."
        ],
        costs: [
          "The 'Works on My Machine' trap: development on localhost masks production latency, CORS headers, and firewall rules.",
          "Port collision friction: two dev servers cannot listen on the same port simultaneously (`EADDRINUSE: port 3000 in use`).",
          "Docker network namespace confusion: junior developers struggle to understand why containers cannot reach host localhost.",
          "Cookie and HTTPS friction: modern browser security features (Secure cookies, PWA service workers) require custom HTTPS setup on localhost."
        ],
        avoid: [
          "Binding development servers to `0.0.0.0` on insecure public coffee-shop Wi-Fi, exposing unfinished code to attackers.",
          "Hardcoding `http://localhost:3000` inside production frontend bundles instead of using environment variables.",
          "Assuming localhost performance (sub-millisecond latency) will mirror production real-world mobile internet speeds.",
          "Struggling with port conflicts by killing processes randomly; use `lsof -i :3000` to identify the occupying PID cleanly."
        ]
      }
    },
    {
      slug: "bash-and-powershell",
      why: {
        before: "Command-line scripting was fragmented between Unix text-stream shells (sh, Bash) and legacy Windows batch files (`cmd.exe`), which lacked advanced programming features and consistent cross-platform capabilities.",
        problem: "Bash processed everything as unstructured text, requiring fragile string parsing (`awk`, `grep`, `sed`) that broke on whitespace; while Windows `cmd.exe` lacked modern loops, arrays, and associative data structures.",
        shift: "Bash became the undisputed standard text-stream shell for Unix/Linux, while Jeffrey Snover created PowerShell: an object-oriented shell piping strongly typed .NET objects across commands rather than raw text streams."
      },
      num: {
        t: "Bash vs PowerShell: Architectural Execution Comparison",
        h: ["Dimension", "GNU Bash (Bourne-Again Shell)", "PowerShell (PowerShell 7 / Core)", "Architectural Advantage", "Primary Failure Mode / Gotcha"],
        r: [
          ["Pipeline Data Type", "Raw unstructured byte/text stream (characters)", "Strongly typed .NET Object stream", "PowerShell properties accessed directly (`$proc.CPU`) without parsing text", "Bash scripts break if output formatting or whitespace shifts"],
          ["Parsing Philosophy", "Text parsing via `awk`, `sed`, `cut`, `grep`, `jq`", "Object property querying (`Select-Object`, `Where-Object`)", "Bash is lightweight; universal on all Linux servers", "PowerShell commands are wordy cmdlets (`Get-ChildItem` vs `ls`)"],
          ["Platform Availability", "Universal on Linux, macOS, WSL, Docker containers", "Cross-platform (PowerShell Core), native on Windows", "Bash is pre-installed in 99% of cloud server images", "PowerShell requires separate installation on minimal Linux images"],
          ["Typing & Data Structures", "Untyped strings (arrays and assoc-arrays supported)", "Strongly typed .NET class system with type-safety", "PowerShell handles dates, XML, and JSON natively", "Bash variable quoting traps (`\"$var\"`) causing word splitting"]
        ],
        n: "The fundamental architectural divergence between Bash and PowerShell represents two competing software engineering philosophies: Text Streams versus Object Pipelines. In Bash, every command outputs a continuous stream of ASCII/UTF-8 bytes. To extract data (such as getting the PID of a process from `ps`), the engineer must parse the text using column-based tools (`awk '{print $2}'`). If an operating system update alters the spacing or adds a column to `ps`, the downstream Bash script breaks silently. In contrast, PowerShell pipes actual .NET CLR objects: `Get-Process | Where-Object CPU -gt 10 | Stop-Process` does not parse text; it queries the typed `.CPU` property directly from real process objects in memory. While PowerShell is vastly more robust for complex enterprise management, Bash remains the undisputed lingua franca of cloud infrastructure, Docker containers, and CI/CD pipelines."
      },
      miss: [
        {
          w: "Bash and PowerShell scripts can be run interchangeably on any operating system without modification.",
          r: "They are completely different programming languages with incompatible syntax, operators, and execution models; a Bash script cannot run in PowerShell, and vice versa."
        },
        {
          w: "PowerShell is strictly for Windows and cannot be used on Linux or macOS.",
          r: "PowerShell Core (PowerShell 7+) is an open-source, cross-platform runtime built on .NET Core, running natively on Ubuntu, Red Hat, macOS, and Docker containers."
        },
        {
          w: "In Bash, unquoted variables (`$file`) are safe to pass to commands.",
          r: "Unquoted variables in Bash undergo 'Word Splitting' and globbing; if a filename contains a space (`My File.txt`), Bash splits it into two separate arguments, causing catastrophic script bugs (always double-quote: `\"$file\"`)."
        },
        {
          w: "PowerShell aliases like `ls` and `curl` behave identically to the Linux Bash utilities.",
          r: "In Windows PowerShell, `ls` is an alias for `Get-ChildItem` and `curl` was historically an alias for `Invoke-WebRequest`, which accept completely different flags and return .NET objects rather than text."
        }
      ],
      trade: {
        buys: [
          "Universal server automation: Bash executes natively on virtually every Linux cloud server and container in the world.",
          "Object pipeline robustness (PowerShell): eliminates fragile text parsing; access object properties (`.Size`, `.Id`) directly.",
          "Rapid systems scripting: automate file transfers, process monitoring, and backup routines in a few lines of code.",
          "CI/CD workflow orchestration: acts as the primary glue scripting language inside GitHub Actions, GitLab CI, and Dockerfiles."
        ],
        costs: [
          "Bash word-splitting traps: unquoted variables and whitespace in filenames create endless security and logic bugs.",
          "PowerShell startup overhead: starting the .NET CLR runtime introduces minor startup latency compared to instant Bash forks.",
          "Cross-platform friction: maintaining dual shell scripts (`.sh` and `.ps1`) for Windows and Linux teams duplicates effort.",
          "Cryptic Bash syntax: arcane Bash idioms (`${var:-default}`, `2>&1`, `set -euo pipefail`) have a steep learning curve."
        ],
        avoid: [
          "Writing Bash scripts without `set -euo pipefail` at the top (which ensures scripts halt immediately on unhandled errors).",
          "Leaving Bash variables unquoted (`$var` instead of `\"$var\"`), exposing the script to word-splitting bugs.",
          "Writing massive 1,000-line shell scripts when a proper language like Python, Go, or TypeScript would be maintainable.",
          "Assuming PowerShell cmdlet aliases behave identically to Unix coreutils flags in cross-platform scripts."
        ]
      }
    },
    {
      slug: "standard-input-and-output",
      why: {
        before: "Early computer programs were hardwired directly to specific physical hardware devices: printing directly to a specific teletype model or reading directly from a specific card reader.",
        problem: "Programs could not be repurposed or redirected; running a program to output to a file instead of a printer required rewriting and recompiling the source code.",
        shift: "Ken Thompson and Dennis Ritchie introduced Standard Streams (Standard I/O) in Unix in 1973: abstracting communication channels into three universal, numbered file descriptors (`stdin`, `stdout`, `stderr`)."
      },
      num: {
        t: "The Three Standard I/O Streams in POSIX Operating Systems",
        h: ["Standard Stream Name", "File Descriptor (FD)", "Default Terminal Device", "Redirection Operator", "Primary Engineering Purpose"],
        r: [
          ["Standard Input (`stdin`)", "FD 0", "Keyboard input / Terminal typing", "`<` (e.g. `cmd < input.txt`)", "Consuming text data, piped input, or interactive user prompts"],
          ["Standard Output (`stdout`)", "FD 1", "Terminal screen / console display", "`>` (overwrite) or `>>` (append)", "Emitting normal program results, data payloads, and output streams"],
          ["Standard Error (`stderr`)", "FD 2", "Terminal screen / console display", "`2>` (e.g. `cmd 2> error.log`)", "Emitting diagnostic logs, warnings, and error messages"],
          ["Combined Redirection", "FD 1 + 2", "Terminal screen", "`&>` or `2>&1`", "Redirecting both normal output and errors into a single unified log file"]
        ],
        n: "In POSIX operating systems, everything is treated as a file. When an operating system kernel launches a new process, it automatically opens and assigns three default File Descriptors in the process's file descriptor table: File Descriptor 0 (`stdin`), File Descriptor 1 (`stdout`), and File Descriptor 2 (`stderr`). By default, all three point to the controlling pseudo-terminal (`/dev/pts/X`), meaning output appears on screen and input reads from the keyboard. The architectural genius of standard streams lies in **Stream Redirection**: using shell operators (`>`, `<`, `|`), the shell can alter these file descriptors *before* the process executes, pointing `stdout` to a physical disk file (`app > output.log`) or pointing `stdout` directly into the `stdin` of another process via an anonymous pipe (`app | grep filter`)."
      },
      miss: [
        {
          w: "Printing error messages to `stdout` (`console.log`) is fine as long as the text says 'ERROR'.",
          r: "Errors must be written strictly to `stderr` (`console.error` / `eprintln!`); piping `stdout` into another program (`app | jq`) will crash the downstream consumer if errors are mixed into the data stream."
        },
        {
          w: "`stdout` and `stderr` can only write to the terminal screen.",
          r: "Standard streams are abstract file descriptors; the shell or operating system can redirect them to disk files, network sockets, null devices (`/dev/null`), or piping channels without altering the program's code."
        },
        {
          w: "The operator `>` appends data to the end of an existing file.",
          r: "`>` *overwrites and truncates* the destination file to zero bytes before writing; appending data requires the double operator `>>`."
        },
        {
          w: "`stdin` can only accept interactive human keyboard typing.",
          r: "`stdin` accepts piped output from other programs (`cat file.txt | app`) or redirected files (`app < file.txt`), enabling headless batch automation."
        }
      ],
      trade: {
        buys: [
          "Universal program composability: any program that reads `stdin` and writes `stdout` can be chained with any other program.",
          "Decoupling from physical devices: code writes to abstract streams without knowing whether output goes to screen, disk, or network.",
          "Clean separation of data and diagnostics: keeping errors on `stderr` allows clean piping of `stdout` data without logging clutter.",
          "Effortless log aggregation: redirecting streams (`>> /var/log/app.log 2>&1`) provides simple, reliable file logging."
        ],
        costs: [
          "Accidental file truncation risk: accidentally typing `> file` instead of `>> file` wipes out existing file contents instantly.",
          "Buffering latency anomalies: `stdout` is typically line-buffered on terminals but block-buffered (4KB) when redirected to files.",
          "Text-only format limitations: standard streams pass raw text/bytes, lacking native rich data schemas without JSON/Protobuf.",
          "Silent error masking: redirecting `stderr` to `/dev/null` (`2> /dev/null`) hides critical errors and makes debugging impossible."
        ],
        avoid: [
          "Logging error messages and debug warnings to `stdout` instead of `stderr`.",
          "Accidentally overwriting important files using single `>` instead of append `>>`.",
          "Silencing errors by redirecting `2> /dev/null` unless you are explicitly and intentionally discarding a known benign warning.",
          "Writing programs that fail when their input comes from a piped file rather than an interactive keyboard TTY."
        ]
      }
    },
    {
      slug: "pipe",
      why: {
        before: "To pass data between two independent programs, developers had to write the output of Program A to a temporary file on disk, wait for it to finish, and then execute Program B to read the file from disk.",
        problem: "Temporary disk files filled up storage drives, required manual cleanup scripts, incurred heavy disk I/O latency bottlenecks, and prevented concurrent streaming between programs.",
        shift: "Douglas McIlroy invented the Pipeline (`|`) in Unix in 1973: connecting the standard output (`stdout`) of one process directly into the standard input (`stdin`) of another process via an in-memory kernel circular buffer."
      },
      num: {
        t: "POSIX Anonymous Pipes vs Named Pipes (FIFOs)",
        h: ["Pipe Mechanism", "Filesystem Node Presence", "Process Relationship", "Lifecycle / Duration", "Primary Engineering Domain"],
        r: [
          ["POSIX Anonymous Pipe (`|`)", "No (exists purely in kernel memory)", "Related processes (parent/child via `fork()` or shell pipeline)", "Terminates when processes exit", "Shell command composition (`cat file | grep pattern | wc -l`)"],
          ["Named Pipe (FIFO - `mkfifo`)", "Yes (special filesystem FIFO node)", "Arbitrary unrelated processes on same machine", "Persistent until explicitly deleted from disk", "Inter-Process Communication (IPC) between background daemons"],
          ["Windows Named Pipe", "Named kernel object (`\\\\.\\pipe\\PipeName`)", "Unrelated local processes or remote networked machines", "Managed by Windows kernel", "IPC in Windows services, Docker daemon socket on Windows"],
          ["Subshell Process Substitution", "Synthetic file descriptor (`<()`)", "Pipes command output as a pseudo-file path", "Active for duration of command execution", "Comparing outputs: `diff <(cmd1) <(cmd2)`"]
        ],
        n: "An anonymous pipe is an Inter-Process Communication (IPC) primitive implemented entirely within operating system kernel memory. When a shell executes `cmd1 | cmd2`, the OS kernel allocates a unidirectional, in-memory circular buffer (typically 64 kilobytes in Linux). The kernel creates two file descriptors: a write end (`pipe[1]`) connected to `cmd1`'s `stdout`, and a read end (`pipe[0]`) connected to `cmd2`'s `stdin`. Both processes execute **concurrently and in parallel**: `cmd1` pushes bytes into the buffer while `cmd2` pulls bytes out. If `cmd1` produces data faster than `cmd2` can consume it, the kernel blocks `cmd1` once the 64KB buffer fills up (Backpressure); conversely, if the buffer is empty, `cmd2` blocks waiting for more input. If `cmd2` terminates prematurely, the kernel sends a `SIGPIPE` signal to `cmd1`, halting further execution."
      },
      miss: [
        {
          w: "In a pipeline like `cat file | grep text`, the first command finishes completely before the second command starts.",
          r: "All commands in a pipeline run *concurrently and in parallel* on separate CPU cores; data streams continuously through the in-memory kernel buffer as it is produced."
        },
        {
          w: "Pipes write data to a hidden temporary file on the hard drive.",
          r: "Pipes operate 100% in volatile kernel RAM (a 64KB ring buffer); data never touches physical disk storage, making pipes lightning-fast."
        },
        {
          w: "In Bash, a pipeline fails only if the last command in the pipeline fails.",
          r: "By default in Bash, a pipeline returns the exit code of the *last* command, silently ignoring failures in upstream commands; robust scripts must set `set -o pipefail`."
        },
        {
          w: "Variables modified inside a piped while loop in Bash remain modified in the outer script.",
          r: "Bash executes piped commands in a separate subshell process; variables mutated inside a piped loop do not exist in the parent shell environment after the pipeline exits."
        }
      ],
      trade: {
        buys: [
          "Stream-based memory efficiency: process terabytes of data through pipelines with only 64KB of RAM buffering.",
          "Concurrent multiprocessing: pipeline stages execute in parallel across multiple CPU cores automatically.",
          "Unix modularity: chain simple, single-purpose CLI tools into powerful, customized data-processing pipelines.",
          "Automatic backpressure: kernel pauses fast producers when slow consumers fall behind, preventing memory exhaustion."
        ],
        costs: [
          "Subshell variable isolation in Bash: variables modified inside piped subshells are lost when the subshell terminates.",
          "Masked upstream failures: default shell behavior masks errors in early pipeline stages without `set -o pipefail`.",
          "The `SIGPIPE` crash hazard: programs that do not handle `SIGPIPE` crash when downstream readers terminate early.",
          "Unstructured text parsing fragility: pipelines break if upstream command output alters column spacing or headers."
        ],
        avoid: [
          "Writing Bash pipelines without `set -o pipefail`, allowing broken upstream commands to pass CI unnoticed.",
          "Using 'Useless Use of Cat' (`cat file.txt | grep ...`); use direct input redirection (`grep ... < file.txt`) or arguments.",
          "Mutating shell variables inside a piped loop expecting the outer script to see the updated values.",
          "Piping unvalidated user inputs into shell execution commands like `| sh` (vulnerable to remote code execution)."
        ]
      }
    },
    {
      slug: "exit-code",
      why: {
        before: "When command-line scripts finished running, they terminated without communicating whether their operation succeeded or failed, forcing parent processes to parse screen text to guess what happened.",
        problem: "Automated scripts could not detect errors; failures went unnoticed; and automated deployment scripts continued executing even after a critical compilation step crashed.",
        shift: "POSIX and operating system standards established Exit Codes (Exit Status / Return Codes): an 8-bit unsigned integer ($0$ to $255$) returned by a terminating process to its parent, where $0$ signals success and non-zero signals failure."
      },
      num: {
        t: "Standard POSIX Exit Codes & Semantic Conventions",
        h: ["Exit Code Range", "Standard Meaning", "OS / Shell Origin", "CI/CD Pipeline Impact", "Common Example Scenario"],
        r: [
          ["`0`", "Success / No Error", "Universal POSIX standard", "Pipeline continues to next step", "Build succeeded, tests passed, file copied cleanly"],
          ["`1`", "General Catch-All Error", "Application-level failure", "Pipeline halts immediately (in `set -e`)", "Uncaught JavaScript exception, Python `sys.exit(1)`"],
          ["`2`", "Misuse of Shell Builtin / Syntax Error", "Bash / Shell parser", "Pipeline halts immediately", "Missing required CLI argument, invalid flag passed"],
          ["`126`", "Command Invoked Cannot Execute", "Operating system loader", "Pipeline halts immediately", "File permissions missing (lacks execute `+x` bit)"],
          ["`127`", "Command Not Found", "Operating system shell lookup", "Pipeline halts immediately", "Typo in command name or binary missing from `$PATH`"],
          ["`128 + N` (e.g. `137`, `139`)", "Fatal Error Signal $N$ (`128 + Signal`)", "Linux kernel process termination", "Pipeline fails with critical infrastructure alert", "`137` = $128+9$ (Killed by `SIGKILL` / OOMKilled); `139` = `SIGSEGV`"]
        ],
        n: "When a process terminates in a POSIX operating system, the kernel retains its termination state in the Process Table until the parent process calls the `wait()` or `waitpid()` system call (a terminated process whose parent has not yet called `wait` is known as a Zombie Process). The exit status is an 8-bit integer ($0$ to $255$). The universal computing law is: **0 represents Success, and any non-zero value ($1-255$) represents Failure**. When a process is terminated by an uncatchable OS Signal (such as `SIGKILL` Signal 9, or `SIGTERM` Signal 15), shells adopt the standard convention of returning $128 + \\text{Signal Number}$. For example, an exit code of `137` mathematically signals $128 + 9$: the process was forcefully terminated by `SIGKILL`, almost universally indicating an Out-Of-Memory (`OOMKilled`) termination by the Linux kernel."
      },
      miss: [
        {
          w: "In exit codes, 1 represents true (success) and 0 represents false (failure), just like boolean logic.",
          r: "In exit codes, the convention is inverted: **0 strictly means Success (zero errors)**, while any non-zero number ($1-255$) indicates a specific failure code."
        },
        {
          w: "CI/CD pipelines read the text output printed to screen to determine if a test suite passed.",
          r: "CI/CD engines (GitHub Actions, GitLab) completely ignore console text; they determine step success or failure exclusively by checking the process's numerical Exit Code."
        },
        {
          w: "An exit code can be any negative integer like `-1`.",
          r: "Exit codes in POSIX are strictly 8-bit unsigned integers ($0$ to $255$); returning `-1` wraps around modulo 256 to exit code `255`."
        },
        {
          w: "A Bash script automatically stops executing if a command inside it fails with a non-zero exit code.",
          r: "By default, Bash ignores non-zero exit codes and blindly continues executing the next line; scripts must include `set -e` at the top to halt execution on command failures."
        }
      ],
      trade: {
        buys: [
          "Universal automation contract: allows CI/CD pipelines and scripts to detect success or failure objectively.",
          "Failure categorization: distinct non-zero exit codes communicate the exact reason for failure to automated supervisors.",
          "Kernel signal forensics: codes like 137 (`SIGKILL`) or 139 (`SIGSEGV`) reveal OS-level kills instantly.",
          "Conditional execution chaining: powers shell logic operators (e.g. `npm test && npm run deploy` stops if test fails)."
        ],
        costs: [
          "The 8-bit value ceiling: limited to integers between 0 and 255; cannot convey complex error payload strings.",
          "Inconsistent code meanings: beyond 0, 126, and 127, exit codes 1-125 are arbitrary and vary across different tools.",
          "Bash default ignore trap: scripts continue running after fatal failures unless `set -e` is explicitly declared.",
          "Sign-wrap confusion: developers returning negative numbers accidentally generate confusing high codes like 255."
        ],
        avoid: [
          "Terminating a failed Node or Python script with `exit(0)`, which tricks CI pipelines into reporting a successful build.",
          "Writing production Bash scripts without `set -e` to ensure failure halt behavior.",
          "Returning negative exit codes like `-1` (use standard positive integers like `1` or `2`).",
          "Ignoring the exit code of background processes without calling `wait`."
        ]
      }
    }
  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
