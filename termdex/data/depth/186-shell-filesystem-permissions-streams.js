(function (TD) {
  "use strict";
  TD.depth = (TD.depth || []).concat([
    {
      slug: "working-directory",
      why: {
        before: "Early computer operating systems required users and programs to specify absolute, fully qualified storage hardware track and sector addresses for every single file access.",
        problem: "Hardcoding absolute filesystem locations made programs completely unportable: moving a script to another folder or computer broke every file lookup, and running parallel tests collided over shared absolute files.",
        shift: "The Current Working Directory (CWD) establishes a dynamic, process-local contextual reference anchor in the filesystem, allowing programs to resolve file paths relatively."
      },
      num: {
        t: "Working Directory Mechanics, POSIX System Calls, and Process State",
        h: ["Aspect / Primitive", "Operating System Mechanism", "POSIX System Call", "Inheritance Behavior", "Security / Failure Vector"],
        r: [
          ["Process Inode Anchor", "Pointer in Process Control Block (task_struct->fs->pwd)", "chdir(2) / fchdir(2)", "Inherited by child processes on fork(2)", "Directory unlinking leaves dangling deleted CWD"],
          ["Path Resolution", "Kernel walks VFS tree relative to CWD inode", "openat(2) / faccessat2(2)", "Evaluated at system call execution time", "Race condition (TOCTOU) if directory renamed during walk"],
          ["Environment Query", "Reads CWD string from kernel or caches in $PWD", "getcwd(3)", "Exported across subshells if maintained by shell", "Buffer overflow in legacy fixed-size getcwd buffers"],
          ["Process Isolation", "Restricting CWD to filesystem subtree", "chroot(2) / pivot_root(2)", "Children restricted to jailed root", "Escape via fchdir to unconfined file descriptors"],
          ["Container Workdir", "OCI container runtime specification (WORKDIR)", "Configured in container rootfs pivot", "Applied to entrypoint process inside mount namespace", "Defaulting to root (/) and polluting system namespaces"]
        ],
        n: "The Current Working Directory (CWD) is a core execution attribute maintained inside the operating system kernel's Process Control Block (e.g., Linux `struct task_struct`). The CWD is not stored as a plain string, but as an active reference to a Virtual File System (VFS) `dentry` and `inode` object. When an application invokes system calls with relative paths (e.g., `open(\"data.json\")`), the kernel traverses directory dentries starting from the CWD inode rather than the root directory inode ($/$). Modern secure programming mandates using descriptor-relative system calls like `openat(int dirfd, const char *pathname, int flags)`, eliminating Time-of-Check to Time-of-Use (TOCTOU) race conditions caused by concurrent `chdir` invocations in multi-threaded programs."
      },
      miss: [
        {
          w: "Changing the working directory inside a shell script changes the directory for the parent terminal shell.",
          r: "A shell script executes in an isolated child process; changes to its CWD via `cd` affect only that child process and are discarded upon script exit unless sourced with `. script.sh` or `source script.sh`."
        },
        {
          w: "The CWD is stored purely as an environment variable named `$PWD`.",
          r: "`$PWD` is merely a convenience environment variable maintained by the shell; the authoritative working directory is an internal kernel VFS inode reference queried via the `getcwd(2)` system call."
        },
        {
          w: "Every thread in a multi-threaded application can have its own independent working directory.",
          r: "In POSIX operating systems (Linux, macOS), all threads in a process share the exact same filesystem context; calling `chdir()` in one thread immediately mutates the working directory for all peer threads."
        },
        {
          w: "Deleting a directory while a program is running inside it immediately terminates the program.",
          r: "The kernel retains the unlinked directory's inode in memory until the process exits or changes directory; calls to create new relative files inside a deleted CWD will fail with `ENOENT`."
        }
      ],
      trade: {
        buys: [
          "Portability: allows code, projects, and CLI tools to be executed from any filesystem location.",
          "Clean modularity: applications reference local configs, assets, and temporary files via short relative paths.",
          "Essential foundation for containerization and reproducible builds within isolated directory roots.",
          "Simplifies script authoring by avoiding brittle hardcoded absolute filesystem paths."
        ],
        costs: [
          "Stateful process hazard: modifying CWD via chdir in multi-threaded code introduces severe race conditions.",
          "Ambient context confusion: executing a command from the wrong directory can overwrite or delete unexpected files.",
          "Daemon vulnerabilities: long-running daemons holding a CWD prevent underlying storage volumes from unmounting.",
          "Security risks: loading configuration files from untrusted CWDs exposes applications to arbitrary code execution."
        ],
        avoid: [
          "Calling `chdir()` inside shared multi-threaded application code or reusable software libraries.",
          "Writing scripts that rely on an assumed CWD without asserting or verifying the path on startup.",
          "Allowing long-running system daemons to keep a user home folder as CWD (daemons should chdir to `/`).",
          "Loading dynamic plugins or configuration files from relative paths in security-sensitive programs."
        ]
      }
    },
    {
      slug: "absolute-and-relative-path",
      why: {
        before: "Early operating systems used flat single-directory filesystems where all files shared a single global namespace, causing naming collisions and chaos as disk sizes grew.",
        problem: "Hierarchical file trees introduced navigation ambiguity: programs needed a precise way to distinguish between a file located in the global root system versus a file located next to the executing script.",
        shift: "Path resolution defines two complementary coordinate systems: absolute paths anchored to the immutable filesystem root, and relative paths anchored dynamically to the process's current working directory."
      },
      num: {
        t: "Path Syntax, Resolution Algorithms, and Traversal Vulnerabilities",
        h: ["Path Representation", "Anchor Reference", "Resolution Complexity", "Portability Profile", "Security Attack Vector"],
        r: [
          ["Absolute Path (POSIX / Windows)", "Root anchor (/var/log or C:\\Windows)", "Direct VFS tree traversal from root inode", "Zero portability; bound to specific machine layout", "Exposes underlying host directory structures"],
          ["Relative Path (./ or local)", "Current Working Directory (CWD)", "CWD inode offset traversal", "High; moves seamlessly with project folder", "Ambiguous if executed from unexpected directory"],
          ["Parent Traversal (../)", "Parent directory (..) dentry walk", "Kernel walks up to parent inode", "Flexible for sibling modules", "Directory Traversal Attack (../../etc/passwd)"],
          ["Canonical Path (Realpath)", "Fully resolved absolute path without symlinks", "O(N) resolving all symlinks and dots", "Absolute deterministic filesystem identifier", "Expensive disk I/O on deeply nested symlink trees"],
          ["URI / File Scheme (file://)", "Standardized protocol resource locator", "Parsed into OS-specific absolute path", "Universal across web and native runtimes", "URL-encoding bypasses in path traversal filters"]
        ],
        n: "Path resolution translates a sequence of directory names separated by delimiters into a target inode: $P = (s_1, s_2, \\dots, s_k)$. An absolute path begins with the root sentinel ($\\text{root} = /$ on POSIX, or drive letter $\\text{C:}\\\\ $ on Windows), initiating traversal strictly from the root vnode. A relative path begins without a leading slash, initiating traversal from the process CWD. The special directory entries `.` and `..` represent identity (self) and parent pointers. Path normalization computes the canonical form: $\\text{realpath}(P)$, evaluating and stripping redundant dot components ($A/./B \\to A/B$) and resolving parent steps ($A/B/../C \\to A/C$). In web backends, failure to sanitize relative path inputs introduces the classic Directory Traversal vulnerability (CWE-22), where an attacker passes `../../../../etc/passwd` to escape the intended public directory."
      },
      miss: [
        {
          w: "Hardcoding absolute paths (like `/Users/alice/project/data.json`) is a reliable way to make code work.",
          r: "Hardcoded absolute paths guarantee code will immediately crash on any other developer's laptop, in CI/CD containers, or on production servers where usernames and directory structures differ."
        },
        {
          w: "Checking if a path starts with `./` is sufficient to prevent directory traversal attacks.",
          r: "Attackers bypass naive string checks using parent traversal sequences (`../`), encoded percent-encoding (`%2e%2e%2f`), or null-byte injections; paths must be resolved via `path.resolve()` and validated against a root."
        },
        {
          w: "Windows and POSIX path separators (`\\` vs `/`) are purely visual and interchangeable in all software.",
          r: "Windows uses backslashes (`\\`) natively while POSIX uses forward slashes (`/`); while modern Windows APIs accept `/`, naive string splitting on `/` breaks on Windows; code must use `path.join()`."
        },
        {
          w: "The path `./file.txt` and `file.txt` refer to different files in command-line terminals.",
          r: "In standard filesystem path resolution, both refer to the exact same file in the current directory; however, in shell command execution, `./program` executes a local binary while `program` searches the `$PATH`."
        }
      ],
      trade: {
        buys: [
          "Absolute paths provide unambiguous, rock-solid determinism regardless of where a script is executed from.",
          "Relative paths deliver total project portability: packages run anywhere without configuration rewrites.",
          "Hierarchical parent navigation (`../`) enables modular code organization across sibling directories.",
          "Canonical paths (`realpath`) eliminate duplicate representations and detect symlink loops."
        ],
        costs: [
          "Security vulnerability: unsanitized relative paths allow catastrophic path traversal attacks (arbitrary file read).",
          "Cross-platform friction: differences between Windows drive letters (`C:\\`) and POSIX roots (`/`).",
          "Execution brittleness: relative paths break if a script is invoked from an unexpected parent folder.",
          "Performance overhead: continuously resolving deep, symlinked canonical paths adds disk VFS traversal latency."
        ],
        avoid: [
          "Concatenating file paths using raw string operations (e.g., `dir + '/' + file`) instead of `path.join()`.",
          "Hardcoding local developer absolute machine paths into production codebases or configuration files.",
          "Serving user-requested files from disk without verifying that `realpath(target)` resides within the allowed root.",
          "Assuming paths are case-sensitive across all filesystems (macOS and Windows default to case-insensitive)."
        ]
      }
    },
    {
      slug: "path",
      why: {
        before: "To execute any computer program, users had to type its full, exhaustive absolute filesystem path (e.g., `/usr/bin/python3` or `/bin/ls`) on every single terminal command invocation.",
        problem: "Typing absolute paths for every command was excruciatingly slow, and shell scripts broke whenever different Unix distributions installed binaries in different directories (e.g., `/bin` vs `/usr/local/bin`).",
        shift: "The PATH environment variable defines an ordered list of directories that the operating system searches sequentially to locate and execute binary executable commands by short name."
      },
      num: {
        t: "PATH Search Mechanics, Precedence Rules, and Security Invariants",
        h: ["Directory Position / Type", "Search Precedence", "Security Profile", "Typical Binaries Located", "Primary Exploitation Vector"],
        r: [
          ["Leading PATH (/usr/local/bin)", "Evaluated First ($O(1)$ lookup per dir)", "Admin-controlled user overrides", "Modern CLI tools, Homebrew, custom scripts", "Shadowing core system utilities"],
          ["System Core PATH (/usr/bin, /bin)", "Evaluated Middle / Standard", "Protected root-only write permissions", "Core POSIX utilities (ls, grep, cat, bash)", "Tampering requires root compromise"],
          ["Runtime / Language PATH (.cargo/bin, .nvm)", "User-level precedence", "Writable by unprivileged user", "Language toolchains (node, cargo, pipx)", "Malicious package installers prepending to PATH"],
          ["Current Directory (. / empty entry)", "Dangerous anti-pattern", "Severe vulnerability (CWE-426)", "Executes untrusted local binaries", "Binary Planting / Trojan execution via common names (ls)"],
          ["Windows Path Ext (PATHEXT)", "Evaluates .EXE, .BAT, .CMD, .PS1", "Windows-specific extension resolution", "Executable binaries and scripts", "Extension hijacking (.bat executing before .exe)"]
        ],
        n: "The PATH variable is a delimiter-separated string (colons `:` on POSIX, semicolons `;` on Windows) specifying a directory search vector: $\\mathbf{P} = (d_1, d_2, \\dots, d_m)$. When a user invokes a command $C$ lacking slashes, the shell or `execvp(3)` system call performs a linear search: $\\exists d_k \\in \\mathbf{P}$ such that the file $d_k/C$ exists, is a regular file, and has execute bits set ($X\\_OK$ via `access(2)`). The search terminates on the first match ($O(1)$ per directory), giving earlier directories strict precedence over later ones. To prevent repetitive filesystem disk walks on every keystroke, shells maintain an internal hash table (viewable via `hash`): caching the resolved absolute path of commands in memory, which must be cleared via `hash -r` when new binaries are added."
      },
      miss: [
        {
          w: "Putting the current directory (`.` or a leading colon) at the start of your PATH is convenient and harmless.",
          r: "Including `.` in PATH creates a catastrophic privilege escalation vulnerability: an attacker placing a malicious script named `ls` in `/tmp` will trick you into running their malware the instant you type `ls`."
        },
        {
          w: "Editing the PATH variable in your current terminal session permanently changes it for all applications.",
          r: "Modifying `export PATH=...` affects only the active shell process and its future children; permanent system changes require modifying shell configuration files (`~/.bashrc`, `~/.zshrc`, or `/etc/environment`)."
        },
        {
          w: "Installing a new program always makes it instantly accessible by name in every running terminal window.",
          r: "Running shells cache command locations in an internal hash table; if a binary is moved or installed to an existing directory, you must run `hash -r` or open a fresh shell to refresh lookup."
        },
        {
          w: "PATH only searches for compiled binary executable machine code files.",
          r: "PATH searches for any file with execute permissions (`chmod +x`), including shell scripts, Python scripts with shebang lines (`#!/usr/bin/env python3`), and binary ELF files."
        }
      ],
      trade: {
        buys: [
          "Effortless command execution: run any installed system tool by short name without typing absolute paths.",
          "Clean abstraction: decouples script invocations from specific underlying OS binary install locations.",
          "Custom tool prioritization: prepend user directories to override system default versions with modern tools.",
          "Language version management: tools like nvm, pyenv, and rbenv switch runtime versions purely via PATH manipulation."
        ],
        costs: [
          "PATH hijacking security risk: untrusted or world-writable directories in PATH allow binary planting attacks.",
          "Command shadowing confusion: installing a tool that shares a name with a core utility silently hijacks commands.",
          "Debugging complexity: diagnosing why a script behaves differently across machines due to diverging PATH orders.",
          "Execution overhead: long PATH lists with dozens of directories add disk lookup latency on command cache misses."
        ],
        avoid: [
          "Adding the current directory (`.` or empty entries) to your system or user PATH environment variable.",
          "Allowing world-writable directories (like `/tmp`) into the PATH search list.",
          "Calling system binaries without explicit paths in security-critical root setuid scripts.",
          "Appending directories to the front of PATH without understanding what existing system commands are being shadowed."
        ]
      }
    },
    {
      slug: "glob-pattern",
      why: {
        before: "Command-line tools required users to type out every individual file name manually when performing operations on groups of files (e.g., deleting 50 logs or compiling 20 source files).",
        problem: "Executing batch operations on dozens or hundreds of files was tedious and error-prone; writing custom shell loops for simple multi-file selections wasted time and broke on spaces.",
        shift: "Glob patterns provide a declarative wildcard matching syntax that allows the shell kernel and application runtimes to expand multi-file path selections in a single compact expression."
      },
      num: {
        t: "Glob Syntax, Matching Mechanics, and Engine Variations",
        h: ["Glob Token / Pattern", "Matching Rule", "Recursive / Directory Traversal", "Hidden File Matching (Dotfiles)", "Engine Support"],
        r: [
          ["Asterisk (*)", "Matches zero or more characters within a single directory", "Single directory level only (Does not cross /)", "Ignored unless dotglob enabled", "Standard POSIX shell, Python glob, glob(3)"],
          ["Question Mark (?)", "Matches exactly one single character", "Single directory level only", "Ignored for leading dot", "Standard POSIX shell"],
          ["Character Set ([a-z] / [!0-9])", "Matches any single character within set or inverted", "Single directory level only", "Ignored for leading dot", "POSIX bracket expressions"],
          ["Globstar (**)", "Recursively matches directories and subdirectories", "Recursive arbitrary depth ($O(V+E)$ tree walk)", "Subject to configuration", "Bash 4+ (shopt -s globstar), Zsh, Fast-Glob"],
          ["Brace Expansion ({a,b}.ts)", "Literal string alternation expansion (Pre-glob step)", "Synthesizes multiple patterns before matching", "Literal expansion; no disk query", "Bash, Zsh (Not supported in standard POSIX sh)"]
        ],
        n: "Globbing (Pathname Expansion) is the process by which a pattern containing wildcards is transformed into a sorted list of concrete matching pathnames. The expansion algorithm is mathematically modeled via deterministic finite automata (DFA) constructed over pathname strings. In shell execution, glob expansion occurs *before* the command executes: when a user types `rm *.log`, the shell scans the directory, matches the regex equivalent $\\wedge[^/]*\\.log\\$, sorts the matching files lexicographically, and passes the expanded array of strings as `argv` to `rm`. If the expanded argument list exceeds operating system memory limits (POSIX `ARG_MAX`, typically 2 MB), the kernel aborts the execution with a fatal `E2BIG (Argument list too long)` error."
      },
      miss: [
        {
          w: "The command being executed (like `ls` or `rm`) is what parses the `*` wildcard.",
          r: "In Unix/Linux, the shell expands the glob into an array of file arguments before invoking the program; the program receives only the resulting list of concrete filenames (unlike Windows CMD)."
        },
        {
          w: "Globbing and Regular Expressions (Regex) are the exact same syntax.",
          r: "Globs and Regex are distinct: in globs, `*` means 'any characters'; in regex, `*` means 'zero or more of the preceding token'; in globs, `?` means 'any single character'; in regex, it means 'optional'."
        },
        {
          w: "A standard `*` glob pattern matches all files in a folder, including hidden dotfiles.",
          r: "By default, POSIX globs ignore files beginning with a dot (`.gitignore`, `.env`) to prevent accidental deletion of critical configs; matching dotfiles requires explicit patterns (`.*`) or `shopt -s dotglob`."
        },
        {
          w: "Running `rm -rf *` inside a directory will delete all hidden configuration files.",
          r: "Because `*` skips dotfiles, running `rm -rf *` leaves all hidden files and hidden directories completely untouched; deleting everything requires enabling `dotglob` or using explicit flags."
        }
      ],
      trade: {
        buys: [
          "Extreme efficiency: perform batch operations across hundreds of files with a few keystrokes.",
          "Language-agnostic file discovery: supported natively across shells, Python, Node.js, and build tools.",
          "Declarative file exclusion: easily ignore file classes (e.g., `!**/*.test.ts`) in build bundlers.",
          "Consistent alphabetical sorting: POSIX mandates that shell glob expansions are returned in sorted order."
        ],
        costs: [
          "Argument length explosion: expanding massive globs (e.g., `*` on 100,000 files) crashes with `E2BIG`.",
          "Unintended deletion hazard: a misplaced space in a glob (`rm -rf * .tmp`) can delete the entire filesystem.",
          "Recursive performance drag: `**/*` on deep directories (like `node_modules`) forces massive recursive disk walks.",
          "Inconsistent empty glob handling: standard shells pass the literal unexpanded pattern string if zero files match."
        ],
        avoid: [
          "Using unbounded `rm -rf *` commands without verifying the current working directory first.",
          "Running recursive globs (`**/*`) without explicitly ignoring massive dependency directories (e.g., `node_modules`).",
          "Assuming globs behave identically in Windows CMD (which delegates globbing to individual applications).",
          "Failing to quote glob patterns in tool arguments where the application (not the shell) must parse the glob."
        ]
      }
    },
    {
      slug: "permissions",
      why: {
        before: "Early personal computers operated without any security permissions; any program or user could read, modify, or delete any file on the system, including core operating system kernel files.",
        problem: "Multi-user computing was impossible: users could spy on each other's private files, rogue programs corrupted operating system binaries, and a compromised web server could alter system passwords.",
        shift: "POSIX file permissions enforce a rigid access-control matrix separating Read, Write, and Execute rights across User, Group, and Others, protected by operating system kernel rings."
      },
      num: {
        t: "POSIX Permission Bits, Octal Notation, and Special Attributes",
        h: ["Permission Target", "Binary Bitmask", "Octal Value", "File Meaning", "Directory Meaning"],
        r: [
          ["Read (r)", "100", "4", "View file text / byte contents", "List files inside directory (ls)"],
          ["Write (w)", "010", "2", "Modify or overwrite file contents", "Create, delete, or rename files inside directory"],
          ["Execute (x)", "001", "1", "Run file as an executable program", "Traverse / enter directory (cd) or access inodes"],
          ["SetUID (SUID)", "4000", "4 (Special)", "Executes with file owner's privileges (e.g., passwd)", "Ignored on directories in modern Linux"],
          ["SetGID (SGID)", "2000", "2 (Special)", "Executes with group privileges", "New files inherit parent directory's group"],
          ["Sticky Bit", "1000", "1 (Special)", "Historical swap-space flag (Obsolete)", "Users can delete only files they own (/tmp)"]
        ],
        n: "POSIX file security is governed by a 16-bit mode attribute stored in the file inode (queried via `stat(2)`). The lower 12 bits define permissions: 3 special bits (SUID, SGID, Sticky) and 9 permission bits partitioned into three 3-bit octal triads: User (owner), Group, and Others (world). The kernel enforces authorization at system call execution (`open`, `execve`): $\\text{Access} = \\text{Mode} \\ \\& \\ \\text{RequestedPermissions}$. In octal notation, `chmod 755` translates to binary `111 101 101`, granting the owner full permissions ($4+2+1=7$) and group/others read-and-execute ($4+0+1=5$). The creation mode is dynamically masked by the process `umask`: $\\text{FinalMode} = \\text{RequestedMode} \\ \\& \\ \\sim\\text{umask}$, preventing newly created files from inadvertently granting world-writable permissions."
      },
      miss: [
        {
          w: "Running `chmod 777` on a file or folder is a harmless way to fix a permission error.",
          r: "777 grants every single user and compromised service on the computer full permission to read, overwrite, or delete the file, creating a massive critical security vulnerability."
        },
        {
          w: "To delete a file, you must have write permission on that specific file.",
          r: "File deletion is a modification of the *parent directory's* inode; you can delete a read-only file if you have write permission on the directory that contains it."
        },
        {
          w: "A directory only needs Read (r) permission for users to enter it and open files inside.",
          r: "Entering a directory (`cd`) and accessing file inodes requires Execute (x) permission; Read permission only allows listing the filenames with `ls`."
        },
        {
          w: "The root user (UID 0) is completely restricted by file permission bits.",
          r: "The Linux root superuser bypasses all read and write permission checks entirely; root can read and overwrite any file on the filesystem regardless of permissions."
        }
      ],
      trade: {
        buys: [
          "Core multi-user security boundary: prevents unauthorized users and compromised services from tampering with files.",
          "Principle of Least Privilege: restricts applications to only the exact files and directories they need.",
          "Prevents accidental execution of untrusted text files by requiring explicit execute (`+x`) permissions.",
          "Sticky bit allows safe shared multi-user temporary scratch directories (like `/tmp`)."
        ],
        costs: [
          "Administrative friction: misconfigured permissions cause frequent deployment and Docker container crashes.",
          "Coarse granularity: standard POSIX triads (owner/group/other) cannot express complex multi-user access rules (requiring ACLs).",
          "Risk of privilege escalation through insecurely configured SetUID binaries.",
          "File permission stripping when transferring archives across non-POSIX filesystems (FAT32/NTFS)."
        ],
        avoid: [
          "Using `chmod -R 777` to resolve permission denied errors in production or local environments.",
          "Storing private SSH keys or TLS certificates with open permissions (SSH rejects keys looser than 600).",
          "Leaving SetUID bits enabled on shell scripts or programs that take untrusted user arguments.",
          "Running production web servers as the root user instead of dedicated unprivileged service users."
        ]
      }
    },
    {
      slug: "symbolic-link",
      why: {
        before: "If multiple applications needed access to the same configuration file or directory, administrators were forced to duplicate the file across multiple folders, creating massive synchronization problems.",
        problem: "Editing a duplicated file updated only one copy, leaving other applications running on obsolete configurations, while hard links could not span across different disk partitions or link to directories.",
        shift: "A symbolic link (symlink) creates a specialized pointer file containing a path reference, providing a transparent, filesystem-level redirection that spans across partitions and links directories."
      },
      num: {
        t: "Symbolic Link vs Hard Link File System Invariants",
        h: ["Feature / Dimension", "Symbolic Link (Soft Link)", "Hard Link", "Kernel System Call", "Cross-Device / Partition Support"],
        r: [
          ["Target Reference", "Stores target path as text in data block", "Direct secondary pointer to existing inode", "symlink(2) vs link(2)", "Symlinks span partitions; Hard links cannot cross filesystems"],
          ["Directory Linking", "Fully supported (`ln -s /dir link`)", "Prohibited by kernel (Prevents directory loops)", "symlink(2)", "Enables clean directory aliasing"],
          ["Target Deletion Behavior", "Link becomes broken ('dangling symlink')", "File data remains intact until link count = 0", "unlink(2)", "Dangling symlink errors with ENOENT on read"],
          ["Inode Assignment", "Allocates a brand new unique inode", "Shares the exact same existing inode number", "stat(2) / lstat(2)", "Hard links increment target inode st_nlink counter"],
          ["Dereferencing Overhead", "Kernel walks path string recursively", "Zero overhead; direct inode access", "Followed by open(2) unless O_NOFOLLOW", "Subject to SYMLOOP_MAX (typically max 40 links)"]
        ],
        n: "A symbolic link (symlink, created via `symlink(2)`) is a special file whose type indicator in `stat.st_mode` is `S_IFLNK`. Its data block contains exclusively the target path string. When a system call encounters a symlink, the VFS kernel driver recursively dereferences the target path. To prevent infinite loops caused by circular symlinks ($A \\to B \\to A$), the kernel enforces a recursion ceiling: `SYMLOOP_MAX` (typically 40 traversals), returning `ELOOP (Too many levels of symbolic links)` upon violation. In release engineering, symlinks enable *Atomic Zero-Downtime Deployments*: releases are deployed to versioned folders (`/releases/v2.1`), and the production traffic pointer is updated instantaneously via atomic symlink replacement: `ln -sfn /releases/v2.1 /var/www/current`."
      },
      miss: [
        {
          w: "Deleting a symbolic link deletes the original target file that it points to.",
          r: "Deleting a symlink with `rm link` removes only the lightweight pointer file; the original underlying target file and its data remain completely untouched."
        },
        {
          w: "A hard link and a symbolic link are identical mechanisms with different names.",
          r: "A hard link is a direct inode pointer sharing the exact same data and permissions on the same disk; a symlink is an independent pointer file storing a path string that can point across disks and to directories."
        },
        {
          w: "Editing a file through a symbolic link creates a new copy of the file.",
          r: "Opening and writing to a symlink dereferences directly to the target file; modifications mutate the original target file in real-time."
        },
        {
          w: "Symbolic links are automatically followed when checking file metadata with `stat`.",
          r: "`stat` follows the symlink to report the target file's metadata; to inspect the symlink itself (its own size and permissions), programs must use the `lstat` system call."
        }
      ],
      trade: {
        buys: [
          "Instant zero-downtime application deployments via atomic symlink directory swapping.",
          "Transparent file aliasing across different physical storage disks and network file mounts.",
          "Enables shared library versioning (e.g., `libssl.so -> libssl.so.1.1`) without duplicating binary files.",
          "Directory linking: map complex nested project structures to simple, clean top-level paths."
        ],
        costs: [
          "Dangling symlink hazard: deleting or moving the target breaks the symlink silently without warning.",
          "Security vulnerability: symlink race attacks (CWE-59) where unprivileged users hijack file writes in `/tmp`.",
          "Loop overhead: circular symlinks cause `ELOOP` errors and crash naive recursive directory traversals.",
          "Path traversal complexity when calculating relative links across moved directories."
        ],
        avoid: [
          "Creating hardcoded absolute symlinks in portable packages (use relative symlinks within the repo).",
          "Writing recursive directory traversal scripts without tracking visited inodes to prevent infinite symlink loops.",
          "Opening files in shared `/tmp` directories without the `O_NOFOLLOW` flag to prevent symlink hijacking.",
          "Using `rm -rf link/` with a trailing slash (which can delete the contents of the target directory instead of the link)."
        ]
      }
    },
    {
      slug: "standard-streams-and-redirection",
      why: {
        before: "Early software wrote outputs directly to physical terminal screens or hardware printer devices; capturing a program's output to save to a file required rewriting the program's source code.",
        problem: "Programs could not communicate or chain together: data could not be saved to disk, errors corrupted standard output, and combining small tools into powerful workflows was impossible.",
        shift: "Ken Thompson's Unix philosophy decoupled I/O into three standard abstract streams (stdin, stdout, stderr), allowing the shell to dynamically redirect data between files, devices, and programs."
      },
      num: {
        t: "Standard Streams, File Descriptors, and Redirection Operators",
        h: ["Stream Name", "File Descriptor (fd)", "POSIX Constant", "Default Destination / Source", "Redirection Syntax Operator"],
        r: [
          ["Standard Input (stdin)", "0", "STDIN_FILENO", "Keyboard input / Terminal tty", "< file.txt (Read from file)"],
          ["Standard Output (stdout)", "1", "STDOUT_FILENO", "Terminal display screen", "> file.txt (Overwrite) or >> file.txt (Append)"],
          ["Standard Error (stderr)", "2", "STDERR_FILENO", "Terminal display screen (Unbuffered)", "2> error.log (Redirect error stream)"],
          ["Combined Output (stdout + stderr)", "1 & 2", "Both streams merged", "Terminal display", "&> all.log or > all.log 2>&1"],
          ["Anonymous Pipe (|)", "Pipe read/write pair", "Inter-Process Pipe", "Streamed from stdout of A to stdin of B", "cmd1 | cmd2 (Kernel-managed buffer ring)"]
        ],
        n: "In POSIX operating systems, every newly spawned process inherits three open file descriptors in its file descriptor table: `0 (stdin)`, `1 (stdout)`, and `2 (stderr)`. Redirection is implemented by the shell using the `dup2(int oldfd, int newfd)` system call. When a user runs `cmd > output.txt`, the shell opens `output.txt` (receiving fd 3), calls `dup2(3, 1)` to overwrite file descriptor 1, closes fd 3, and calls `execve(cmd)`. Crucially, stream buffering dynamics diverge: `stdout` is line-buffered when connected to an interactive terminal, but automatically switches to full block-buffering ($4-8\\text{ KB}$) when redirected to a file or pipe. Conversely, `stderr` is strictly unbuffered, guaranteeing that critical error diagnostics appear immediately even if the application panics or crashes mid-line."
      },
      miss: [
        {
          w: "Writing error messages to `console.log()` or standard output is completely fine in CLI tools.",
          r: "Logging errors to stdout pollutes data pipelines; if another program pipes the output (`tool | jq`), unexpected error strings on stdout corrupt JSON parsing; errors must always be written to stderr."
        },
        {
          w: "The redirection syntax `> file 2>&1` and `2>&1 > file` do the exact same thing.",
          r: "Order matters: `> file 2>&1` redirects stdout to file, then duplicates stderr to stdout (both go to file); `2>&1 > file` duplicates stderr to the terminal screen first, and only sends stdout to the file."
        },
        {
          w: "Piping data through a pipe (`cat file | grep text`) waits for the first command to finish completely.",
          r: "Pipes execute concurrently: both processes run in parallel, streaming data through an in-memory kernel ring buffer ($64\\text{ KB}$ on Linux); when the buffer fills, the writer blocks until the reader consumes data."
        },
        {
          w: "Redirecting output using `>` appends new data to the end of an existing file.",
          r: "`>` truncates the target file to zero bytes immediately before writing, wiping existing contents; appending requires the double angle bracket operator `>>`."
        }
      ],
      trade: {
        buys: [
          "Extreme composability: stitch independent single-purpose programs together into complex pipelines via `|`.",
          "Separation of concerns: clean isolation of operational data (stdout) from debugging diagnostics (stderr).",
          "Automated logging: redirect program outputs and error streams directly to persistent log files or `/dev/null`.",
          "High performance: kernel anonymous pipes stream data between processes in memory without touching physical disk."
        ],
        costs: [
          "Silent data loss hazard: accidentally typing `>` instead of `>>` completely wipes existing log files.",
          "Buffering lag: block-buffering on redirected stdout delays logs from appearing in real-time.",
          "Broken pipe crashes: if a downstream reader closes (e.g., `head`), the writer receives `SIGPIPE` and can crash.",
          "Debugging confusion if errors are hidden by redirecting stderr to `/dev/null` without logging."
        ],
        avoid: [
          "Emitting debugging logs or error traces to standard output instead of standard error.",
          "Using `cat file | grep pattern` (useless use of cat); use `grep pattern file` directly.",
          "Overwriting important files with accidental `>` truncations instead of appending with `>>`.",
          "Confusing the order of redirection operations when merging stdout and stderr (`> file 2>&1`)."
        ]
      }
    },
    {
      slug: "background-process",
      why: {
        before: "Executing a command in a terminal locked the shell session until the process completed; running a 2-hour backup script meant that terminal window was completely unusable for other work.",
        problem: "Closing the terminal window or losing an SSH connection sent a hangup signal that instantly killed running jobs, while running long servers required opening dozens of terminal tabs.",
        shift: "Background processes decouple command execution from the interactive terminal session, allowing programs to run asynchronously in the background while keeping the shell prompt free."
      },
      num: {
        t: "Process Execution States, Job Control, and Terminal Detachment",
        h: ["Execution Mode", "Shell Control Operator", "Terminal Stdin Access", "SIGHUP Survival", "Primary Operational Usage"],
        r: [
          ["Foreground Process", "Standard invocation (cmd)", "Direct interactive access to keyboard", "Killed if terminal closes", "Interactive text editors, CLI prompts, short commands"],
          ["Background Job (&)", "Appended ampersand (cmd &)", "Suspended if reads stdin (SIGTTIN)", "Killed if terminal closes (unless disowned)", "Non-interactive builds, local dev servers, fast scripts"],
          ["Disowned Job", "disown -h %1", "Zero terminal stdin", "Survives terminal closure", "Keeping a background script alive when closing a local terminal"],
          ["Nohup Execution", "nohup cmd &", "Redirects stdin from /dev/null; out to nohup.out", "Survives SIGHUP signal", "Simple long-running scripts on remote SSH servers"],
          ["Systemd / Supervisor Daemon", "Managed system service unit", "Completely decoupled from any terminal session", "Absolute resilience; automated restarts", "Production web servers, database daemons, worker pools"]
        ],
        n: "Process control in Unix shells operates through POSIX Job Control. When a command is launched with an ampersand (`cmd &`), the shell creates a child process via `fork(2)` and places it into a distinct Process Group (`setpgid(2)`), while the shell retains control of the terminal's foreground process group. The shell stores the background process PID in the special variable `$!`. If a background process attempts to read from the controlling terminal's standard input, the operating system kernel suspends it via a `SIGTTIN` signal. When an interactive terminal window closes or an SSH session terminates, the kernel broadcasts a `SIGHUP (Signal Hangup)` to all child processes in the session, terminating them unless shielded via `nohup`, `disown`, or system daemon managers."
      },
      miss: [
        {
          w: "Adding `&` to the end of a command ensures it will run forever on a remote server even after you close SSH.",
          r: "Appending `&` only places the job in the background of your current session; when your SSH connection drops, the kernel sends a SIGHUP signal that kills the process unless you use `nohup`, `tmux`, or `systemd`."
        },
        {
          w: "A background process is completely silent and can never print text to your screen.",
          r: "By default, background processes still share the terminal's stdout and stderr; unless explicitly redirected (`> /dev/null 2>&1 &`), their text outputs will interleave with your active terminal typing."
        },
        {
          w: "Pressing `Ctrl+C` will terminate a running background process.",
          r: "`Ctrl+C` broadcasts `SIGINT` strictly to the active foreground process group; background jobs ignore `Ctrl+C` and must be terminated explicitly using `kill <PID>`."
        },
        {
          w: "Background processes running on a server have lower CPU priority than foreground processes.",
          r: "Foreground and background processes receive identical CPU scheduling priorities by default; changing priority requires explicitly using the `nice` or `renice` commands."
        }
      ],
      trade: {
        buys: [
          "Instant multitasking: frees up the interactive terminal prompt immediately while long tasks execute.",
          "Enables parallel execution: fire off multiple independent batch scripts simultaneously from a single shell.",
          "Allows running local development servers (Node, Redis) without dedicating separate terminal tabs.",
          "Easy job control: seamlessly suspend (`Ctrl+Z`), background (`bg`), and foreground (`fg`) active processes."
        ],
        costs: [
          "Silent failure hazard: background processes that crash or fail can go completely unnoticed.",
          "Accidental terminal pollution if stdout/stderr are not properly redirected to log files.",
          "Zombie process clutter: forgotten background processes consume CPU and memory indefinitely.",
          "Vulnerability to terminal disconnects if not decoupled with nohup, tmux, or systemd."
        ],
        avoid: [
          "Launching background processes without redirecting stdout and stderr away from the active screen.",
          "Relying on `nohup cmd &` to run production enterprise web servers (use systemd or Docker).",
          "Forgetting to check the process exit code or capture `$!` when running background jobs in scripts.",
          "Leaving long-running background processes running locally that tie up development ports (e.g., 3000, 8080)."
        ]
      }
    }
  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
