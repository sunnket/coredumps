(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([
    {
      slug: "cross-site-scripting",
      why: {
        before: "In early web architecture (static HTML 1.0), web pages were immutable server-rendered documents; web browsers parsed basic layout tags without executing dynamic client-side scripting or storing persistent session credentials.",
        problem: "The introduction of JavaScript (1995) and browser cookies allowed web applications to become interactive; however, interpolating raw, unescaped user input directly into dynamic HTML strings allowed attackers to inject executable JavaScript that ran within other users' browser sessions.",
        shift: "Cross-Site Scripting (XSS, formalized in 1999) established the vulnerability class where malicious client-side scripts execute within the trusted security origin of the victim, driving the adoption of context-aware output encoding, strict Content Security Policy (CSP), and virtual-DOM auto-escaping frameworks."
      },
      num: {
        t: "Cross-Site Scripting (XSS) Classification & Execution Mechanics",
        h: ["XSS Classification", "Payload Delivery Vector", "Persistence Mechanism", "Execution Context", "Primary Architectural Defense"],
        r: [
          ["Stored XSS (Persistent)", "Injected via database entry (comments, profile fields)", "Stored permanently in application database/backend", "Executes whenever any victim loads the stored content", "Context-aware HTML entity encoding + server-side sanitization"],
          ["Reflected XSS (Non-Persistent)", "Injected via HTTP query parameters, search forms, or headers", "Not stored; reflected immediately in server response HTML", "Executes when victim clicks a malicious crafted URL link", "Framework output encoding + input validation + CSP"],
          ["DOM-Based XSS", "Client-side JavaScript reads from an untrusted source", "Client-side execution only (URL hash, location.search)", "Executes entirely in client browser DOM without touching server", "Avoiding unsafe sinks (innerHTML, eval); using textContent"],
          ["Blind XSS", "Injected via feedback forms or logs viewed by admins", "Stored in internal admin consoles or ticketing systems", "Executes inside privileged internal administrative dashboards", "Strict output encoding across internal admin tools; CSP"],
          ["Mutation XSS (mXSS)", "Bypasses sanitizers via unexpected browser HTML re-parsing", "Injected via complex SVG, MathML, or nested HTML fragments", "Executes when browser DOM parser mutates seemingly safe markup", "DOMPurify with strict HTML5 parsing standards"]
        ],
        n: "Cross-Site Scripting exploits the browser's inability to distinguish between legitimate application markup and malicious executable code injected by untrusted parties. Because injected JavaScript executes within the victim's browser session under the application's domain origin, the browser's Same-Origin Policy (SOP) grants the script full access to document.cookie, localStorage, sessionStorage, and the IndexedDB database. The script can intercept keystrokes, hijack session tokens, rewrite DOM elements to display fake login prompts, or execute authenticated API requests (like transferring funds or changing account emails) on behalf of the victim using fetch(). DOM-based XSS occurs when client-side JavaScript reads data from an untrusted 'source' (e.g., location.search, location.hash, document.referrer) and passes it directly to an execution 'sink' (such as element.innerHTML, document.write(), or eval()). Robust defense requires defense-in-depth: 1) Context-aware output encoding (converting <, >, &, \", and ' into their respective HTML entities &lt;, &gt;, etc.); 2) Setting the HttpOnly and SameSite flags on session cookies to prevent JavaScript from reading authentication tokens; 3) Enforcing a strict Content Security Policy (e.g., Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-random') that disables inline scripts and unauthorized external script domains; and 4) Building UIs using modern frameworks (React, Angular, Vue) that automatically escape data-bound strings by default."
      },
      miss: [
        {
          w: "Setting HttpOnly on session cookies completely neutralizes all Cross-Site Scripting (XSS) risks.",
          r: "HttpOnly prevents an attacker from reading the raw session cookie via document.cookie, but the malicious script can still make authenticated background HTTP requests (fetch/XHR) on behalf of the user, steal sensitive screen data, or log keystrokes."
        },
        {
          w: "Sanitizing user input using regular expression blacklists (like stripping '<script>' tags) makes applications safe.",
          r: "Blacklisting is trivially bypassed using alternative HTML execution vectors: <img src=x onerror=alert(1)>, <svg onload=...>, javascript: pseudo-protocols, and case variations (<sCrIpt>); sanitization must use strict whitelists and context-aware encoding."
        },
        {
          w: "Modern single-page application frameworks like React are 100% immune to XSS vulnerabilities.",
          r: "While React escapes strings in standard JSX bindings ({userInput}), developers introduce severe XSS vulnerabilities when using dangerouslySetInnerHTML, javascript: URLs in <a href>, or evaluating strings with eval()."
        },
        {
          w: "Cross-Site Scripting is a low-severity flaw that only allows annoying alert() popups.",
          r: "XSS is a critical vulnerability that allows complete account takeover, full identity theft, session hijacking, silent exfiltration of confidential customer records, and watering-hole malware distribution."
        }
      ],
      trade: {
        buys: [
          "Origin context integrity: guarantees that only authorized, first-party scripts execute within the user's browser session.",
          "Session token defense: protects authentication cookies from client-side exfiltration via HttpOnly and CSP.",
          "Tamper-proof user interfaces: prevents malicious actors from defacing web applications or injecting phishing credential prompts.",
          "API authorization protection: stops malicious scripts from silently invoking privileged REST or GraphQL endpoints."
        ],
        costs: [
          "CSP operational complexity: crafting and maintaining strict Content Security Policies without breaking analytics or third-party tags.",
          "Rich-text rendering overhead: supporting rich-text user markup (WYSIWYG editors) requires complex, heavy sanitization engines (DOMPurify).",
          "Inline script restrictions: strict CSP blocks inline <script> tags, requiring refactoring legacy inline event handlers.",
          "False-positive sanitization: overly aggressive character filtering can corrupt legitimate user inputs (e.g., mathematical formulas, code)."
        ],
        avoid: [
          "Using innerHTML, outerHTML, or document.write() to render user-supplied data (use textContent or element.setAttribute).",
          "Disabling framework safety mechanisms by casually invoking dangerouslySetInnerHTML in React or v-html in Vue.",
          "Storing sensitive authentication tokens in localStorage or sessionStorage where any XSS payload can read them.",
          "Relying on deprecated browser XSS filters (X-XSS-Protection) instead of deploying a modern Content Security Policy."
        ]
      }
    },
    {
      slug: "server-side-request-forgery",
      why: {
        before: "In early web architecture, servers operated as isolated islands that rarely initiated dynamic outbound HTTP requests based on client-provided parameters.",
        problem: "As modern cloud applications added features requiring servers to fetch remote URLs (such as webhook deliveries, link preview generation, PDF rendering from HTML, and external avatar imports), attackers discovered they could supply internal network URLs (like 'http://localhost:6379/' or cloud metadata addresses) to access private systems.",
        shift: "Server-Side Request Forgery (SSRF, ranked on the OWASP Top 10) established the attack vector where an external adversary abuses a server's trusted network position to pivot past firewalls, probe internal microservices, and extract cloud infrastructure credentials."
      },
      num: {
        t: "SSRF Attack Vectors & Target Exploitation Dynamics",
        h: ["Target Infrastructure", "Exploitation Payload URL", "Underlying Vulnerability", "Stolen Asset / Architectural Impact", "Primary Security Defense"],
        r: [
          ["Cloud Instance Metadata (AWS IMDSv1)", "http://169.254.169.254/latest/meta-data/iam/security-credentials/", "Unvalidated link-local HTTP GET", "Extracts temporary AWS IAM role access keys; full account takeover", "Enforce IMDSv2 (Session token header required)"],
          ["Google Cloud Metadata (GCP)", "http://metadata.google.internal/computeMetadata/v1/", "Missing 'Metadata-Flavor: Google' header validation", "Extracts service account access tokens and cluster configuration", "GCP requires custom HTTP headers on all metadata queries"],
          ["Internal Cache / Database (Redis)", "gopher://127.0.0.1:6379/_SET%20key%20evil", "Multi-protocol URI parsing (Gopher/DICT)", "Direct command execution against unauthenticated internal Redis", "Disable non-HTTP URL schemes (block gopher://, file://)"],
          ["Internal Microservices (K8s)", "http://internal-billing-service.production.svc.cluster.local/", "Trusting internal network boundary", "Bypasses ingress firewalls to call unauthenticated internal APIs", "Service mesh mTLS + zero-trust authentication between pods"],
          ["DNS Rebinding Attack", "http://rebind.evil.com/ (Resolves to 127.0.0.1 on 2nd lookup)", "Time-of-Check to Time-of-Use (TOCTOU) DNS race", "Bypasses IP blacklist filters that check DNS before fetching", "Resolve IP once; pin socket connection directly to resolved IP"]
        ],
        n: "Server-Side Request Forgery occurs when a web application accepts a user-supplied URL and uses backend server libraries (such as curl, Python requests, or Node.js axios) to fetch the resource without validating the destination IP address. In cloud environments (AWS EC2, Google Cloud, Azure, Kubernetes), the cloud hypervisor provides an Instance Metadata Service (IMDS) at the non-routable link-local IP 169.254.169.254. In legacy AWS IMDSv1, a simple HTTP GET request to http://169.254.169.254/latest/meta-data/iam/security-credentials/<role-name> returns temporary AWS secret access keys, granting the attacker the instance's IAM permissions (the exact exploit vector used in the 2019 Capital One breach of over 100 million records). SSRF vulnerabilities are classified into In-Band (the response content is returned directly to the attacker) and Blind SSRF (the server fetches the URL but does not return the response body, requiring attackers to infer state via timing differences or out-of-band DNS callbacks). A sophisticated bypass is the DNS Rebinding Attack: an attacker configures a custom nameserver for a domain with TTL=0; during the application's initial validation check, the domain resolves to a safe public IP (e.g., 203.0.113.1), passing the filter; milliseconds later, when the HTTP client initiates the actual TCP connection, the nameserver returns 127.0.0.1 or 169.254.169.254, bypassing naive validation."
      },
      miss: [
        {
          w: "Validating that a URL begins with 'http://' or 'https://' prevents SSRF vulnerabilities.",
          r: "Validating the URL scheme prevents protocol smuggling (like file:// or gopher://), but does nothing to prevent requests to http://169.254.169.254, http://localhost, or private RFC 1918 internal subnets (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16)."
        },
        {
          w: "Checking if a domain string contains 'localhost' or '127.0.0.1' is an effective SSRF defense.",
          r: "String blacklists are trivially bypassed using alternative IP representations: decimal IPs (http://2130706433/), hex IPs (http://0x7f000001/), IPv6 loopback (http://[::1]/), 0.0.0.0, or custom domains pointing to loopback."
        },
        {
          w: "Firewalls outside the cloud VPC protect against SSRF attacks.",
          r: "Perimeter firewalls filter traffic entering the VPC from the outside; in an SSRF attack, the request originates *from inside* the VPC on the trusted application server, bypassing all perimeter ingress firewall rules."
        },
        {
          w: "AWS IMDSv2 completely eliminates the need for applications to validate user URLs.",
          r: "IMDSv2 prevents cloud metadata theft by requiring a PUT token header that standard SSRF GET requests cannot generate; however, SSRF can still target internal databases, microservices, and local server ports."
        }
      ],
      trade: {
        buys: [
          "Perimeter network protection: prevents external attackers from using public servers to pivot into private internal infrastructure.",
          "Cloud identity containment: shields cloud instance metadata endpoints (IMDS) from credential exfiltration.",
          "Internal service isolation: ensures internal microservices, databases, and admin dashboards remain inaccessible from public ingress.",
          "Protocol abuse prevention: blocks protocol smuggling attacks using dangerous URI handlers (gopher://, file://, dict://)."
        ],
        costs: [
          "Network architecture complexity: requires deploying dedicated forward egress proxies (like Smokescreen) for outbound user requests.",
          "DNS resolution latency: resolving and validating destination IP addresses before connection establishment adds latency.",
          "Feature constraints: strict SSRF whitelisting limits application flexibility if users need to connect to arbitrary public APIs.",
          "Cloud migration overhead: migrating legacy cloud instances to AWS IMDSv2 requires updating SDKs and configuration parameters."
        ],
        avoid: [
          "Allowing cloud workloads to run legacy AWS IMDSv1 (always enforce IMDSv2 with http-tokens=required and hop-limit=1).",
          "Resolving a domain once for validation and then letting the HTTP client resolve it again (vulnerable to DNS rebinding).",
          "Permitting application servers to fetch URLs using non-HTTP schemes (file://, gopher://, dict://, ldap://).",
          "Running unauthenticated internal administrative microservices or databases on shared local networks without authentication."
        ]
      }
    },
    {
      slug: "command-injection",
      why: {
        before: "In early Unix web development (e.g., Perl CGI and early PHP in the 1990s), developers frequently executed system tasks (like checking disk space, sending mail, or pinging an IP) by passing shell commands directly to system execution functions.",
        problem: "Concatenating unvalidated user inputs directly into operating system shell strings allowed attackers to inject shell control metacharacters (such as ';', '&', '|', and backticks), tricking the host OS into executing arbitrary commands with the privileges of the web server.",
        shift: "Command Injection was classified as one of the most destructive Remote Code Execution (RCE) vulnerabilities, driving the software industry toward parameterized process execution APIs (execve without a shell), strict input whitelisting, and least-privilege containerization."
      },
      num: {
        t: "Command Execution APIs & Injection Vulnerability Risk",
        h: ["Programming Language / API", "Shell Invocation Model", "Argument Passing Format", "Command Injection Risk", "Recommended Secure Alternative"],
        r: [
          ["C / C++: system()", "Spawns /bin/sh -c 'cmd'", "Single concatenated string", "Critical; interprets all shell metacharacters", "Use execve() or posix_spawnp() directly"],
          ["Python: os.system()", "Spawns underlying system shell", "Single concatenated string", "Critical; vulnerable to shell metacharacters", "subprocess.run([args], shell=False)"],
          ["Python: subprocess.run(shell=True)", "Spawns /bin/sh or cmd.exe", "Single string or array", "Critical; explicitly enables shell metacharacter parsing", "subprocess.run([cmd, arg1, arg2], shell=False)"],
          ["Node.js: child_process.exec()", "Spawns /bin/sh or cmd.exe", "Single command string", "Critical; shell parsing enabled by default", "child_process.execFile() or spawn() without shell"],
          ["Java: Runtime.getRuntime().exec()", "Executes process directly (No shell)", "String array or single string", "Moderate; avoids shell metacharacters but prone to argument injection", "ProcessBuilder with explicit argument list"]
        ],
        n: "Command Injection occurs when an application executes a system shell (such as /bin/sh, /bin/bash, or Windows cmd.exe) and passes an unvalidated string containing shell metacharacters. In shell syntax, special control operators alter execution flow: ';' executes commands sequentially; '&&' and '||' provide conditional branching; '|' pipes output between processes; '`cmd`' and '$(cmd)' execute command substitution; '>' and '<' perform I/O redirection; and '\\n' separates independent commands. If an application executes 'ping -c 1 ' + user_input, and the user submits '8.8.8.8; cat /etc/passwd', the shell interprets the semicolon as a command terminator and executes cat /etc/passwd immediately after the ping completes. The architectural vulnerability is the invocation of the shell interpreter itself: when software uses parameterized process execution (such as the POSIX execve() system call, Python's subprocess.run(shell=False), or Node.js child_process.execFile()), the operating system kernel receives the command and arguments as an array of discrete strings directly. In this model, metacharacters like ';' or '|' are passed to the target binary as literal, harmless text arguments without being parsed by a shell, rendering command injection mathematically impossible."
      },
      miss: [
        {
          w: "Escaping spaces or stripping semicolons in user input completely prevents command injection.",
          r: "Shells support dozens of command separators and whitespace alternatives: newlines (\\n), pipes (|), ampersands (&), subshell syntax ($()), backticks (``), and shell variables ($IFS for spaces); blacklisting specific characters is trivially bypassed."
        },
        {
          w: "Command injection and SQL injection are the exact same vulnerability with different targets.",
          r: "While both are injection flaws, SQL injection executes within a database query engine, whereas command injection executes directly on the host operating system, granting attackers raw terminal access to the server."
        },
        {
          w: "Passing an array of arguments to Python's subprocess.run() is always safe, even with shell=True.",
          r: "If shell=True is set, Python passes the first array element directly to the shell as a shell string, leaving the application fully vulnerable to command injection regardless of array formatting."
        },
        {
          w: "Running web servers in Docker containers eliminates the danger of command injection.",
          r: "Command injection gives the attacker an interactive shell inside the container; they can steal environment variables, compromise database connections, pivot across the internal Docker network, or exploit kernel CVEs to escape the container."
        }
      ],
      trade: {
        buys: [
          "Complete remote code execution defense: parameterized execution eliminates the possibility of shell metacharacter manipulation.",
          "Operating system boundary integrity: prevents external adversaries from obtaining unauthorized terminal access on production servers.",
          "Predictable execution determinism: parameterized processes execute with explicit, controlled argument vectors.",
          "Secure container confinement: prevents containerized services from being turned into interactive attacker command-and-control nodes."
        ],
        costs: [
          "Loss of shell convenience: cannot use convenient shell features (globbing, wildcards, output redirection) without writing code.",
          "Refactoring legacy codebases: migrating legacy shell scripts to native programming APIs requires significant development effort.",
          "Subprocess spawning overhead: spawning heavy external system processes remains computationally expensive compared to native libraries.",
          "Cross-platform argument formatting: managing executable path differences between Windows (cmd/powershell) and Linux."
        ],
        avoid: [
          "Invoking system execution functions with shell interpreters enabled (e.g., shell=True in Python or exec() in Node.js).",
          "Attempting to sanitize command injection using custom regex blacklists instead of parameterized argument arrays.",
          "Executing shell commands using user-supplied binary names or dynamic command paths.",
          "Running production web application processes with root or administrative operating system privileges."
        ]
      }
    },
    {
      slug: "path-traversal",
      why: {
        before: "Early web applications served uploaded files, images, or dynamic documents by concatenating user-supplied filenames directly into local server filesystem paths (e.g., path = '/var/www/uploads/' + filename).",
        problem: "Operating systems interpret relative path sequences (such as '../' or '..\\'); by passing crafted directory traversal strings, attackers could break out of the intended uploads directory and read, modify, or delete arbitrary files on the server (like '/etc/passwd' or application configuration files).",
        shift: "Path Traversal (Directory Traversal, CWE-22) established the vulnerability class where unvalidated input manipulates filesystem path resolution, driving the adoption of canonical path resolution (realpath), strict root boundary validation, and cloud object store abstractions."
      },
      num: {
        t: "Path Traversal Attack Vectors & Bypass Mechanics",
        h: ["Attack Vector / Technique", "Input Payload Pattern", "Parser / Decoder Behavior", "Bypassed Flawed Defense", "Secure Architectural Defense"],
        r: [
          ["Standard Relative Traversal", "../../../../etc/passwd", "OS resolves '..' to parent directory iteratively", "No input validation or naive prefix checks", "Resolve canonical path via realpath(); check prefix"],
          ["URL-Encoded Traversal", "%2e%2e%2f%2e%2e%2fetc%2fpasswd", "Web server decodes %2e to '.' and %2f to '/'", "Naive string matching looking for literal '../'", "Decode input first; validate canonicalized path"],
          ["Double URL-Encoded Traversal", "%252e%252e%252f", "WAF decodes once; application framework decodes twice", "WAF / perimeter regex filters", "Strict character whitelisting ([a-zA-Z0-9_-])"],
          ["Nested Filter Evasion", "....//....//etc/passwd", "Naive single-pass filter strips '../', collapsing remainder", "Single-pass string replace ('../' -> '')", "Reject input containing '..' rather than stripping"],
          ["Null-Byte Poisoning (Legacy)", "../../../etc/passwd%00.jpg", "C string terminator terminates path before '.jpg'", "Extension check (ends_with('.jpg')) in C/PHP", "Modern runtime memory safety; explicit path APIs"]
        ],
        n: "Path Traversal exploits filesystem navigation conventions: the single dot '.' represents the current directory, while the double dot '..' represents the parent directory. When an operating system resolves a path like /var/app/uploads/../../../../etc/shadow, it evaluates the relative segments sequentially: /var/app/uploads/.. becomes /var/app; /var/app/.. becomes /var; /var/.. becomes /; and further traversals remain bounded at the root filesystem /, successfully reading /etc/shadow. Naive filtering techniques routinely fail: stripping '../' in a single pass is bypassed by '....//' (when the inner '../' is removed, the remaining characters collapse into a functional '../'); URL encoding (%2e%2e%2f) and double URL encoding (%252e%252e%252f) bypass superficial regex firewalls; and on Windows, forward slashes and backslashes (..\\) are treated interchangeably. Robust programmatic mitigation requires a two-step verification process: 1) **Canonicalization**: Call the operating system's canonical path resolution API (such as realpath() in C/PHP, Path.resolve() / fs.realpathSync() in Node.js, or os.path.realpath() in Python) to resolve all symbolic links, double dots, and relative sequences into an absolute canonical path; 2) **Prefix Confinement**: Verify that the resolved canonical path strictly starts with the authorized base directory prefix plus a directory separator (e.g., canonical_path.startswith('/var/app/uploads/')). If the check fails, the request must be rejected immediately."
      },
      miss: [
        {
          w: "Checking that a file ends with '.png' or '.pdf' completely prevents path traversal attacks.",
          r: "An attacker can append the valid extension while traversing directories: '../../../../etc/passwd%00.png' (in legacy runtimes) or simply traverse into directories containing authorized files without altering the extension check."
        },
        {
          w: "Using a regular expression to strip all instances of '../' from filenames makes them safe to use.",
          r: "Single-pass string replacement is fundamentally flawed: submitting '....//' collapses into '../' after the first replacement; inputs containing traversal sequences should be rejected outright rather than sanitized."
        },
        {
          w: "Path traversal only allows attackers to read files, not write or delete them.",
          r: "Path traversal in file upload or deletion endpoints allows attackers to overwrite critical system binaries, inject malicious SSH authorized_keys files, drop web shells into server execution directories, or delete database files."
        },
        {
          w: "Storing files on AWS S3 or Google Cloud Storage is vulnerable to the exact same path traversal attacks.",
          r: "Cloud object stores are flat key-value databases that do not execute operating system filesystem traversal; '..' in an S3 key is treated as literal text characters, completely eliminating POSIX path traversal."
        }
      ],
      trade: {
        buys: [
          "Filesystem confinement: guarantees that file access is strictly restricted to designated public storage boundaries.",
          "Arbitrary file disclosure defense: prevents exposure of sensitive configuration files, environment secrets, and password hashes.",
          "Arbitrary file write protection: prevents attackers from overwriting system files or uploading web shells into executable paths.",
          "Robust multi-tenant isolation: ensures tenant A cannot access tenant B's uploaded files via directory traversal tricks."
        ],
        costs: [
          "Filesystem I/O overhead: resolving canonical paths via realpath() requires stat() system calls across directory components.",
          "Symbolic link handling complexity: handling legitimate symbolic links requires careful validation to prevent symlink traversal escapes.",
          "User filename restrictions: strict character whitelisting may prevent users from uploading files with international characters or spaces.",
          "Application code rigidity: requires explicit path validation logic on every single filesystem interaction."
        ],
        avoid: [
          "Concatenating unvalidated user inputs directly into filesystem paths using string concatenation.",
          "Relying on single-pass search-and-replace to strip '../' sequences from user-supplied strings.",
          "Failing to append a trailing slash when checking canonical path prefixes (checking '/var/uploads' matches '/var/uploads_private').",
          "Serving user-uploaded files directly from local server filesystems instead of using dedicated cloud object stores (S3/GCS)."
        ]
      }
    },
    {
      slug: "insecure-direct-object-reference",
      why: {
        before: "Early web architectures and REST APIs structured database records around sequential, auto-incrementing integer primary keys (e.g., user_id = 1042, invoice_id = 8521) and exposed these identifiers directly in client-facing URLs (GET /api/invoices/8521).",
        problem: "Applications frequently verified authentication (confirming the user was logged in) but failed to verify authorization (checking whether user 1042 actually owned invoice 8521); an attacker could simply increment the ID parameter (8522, 8523...) to download every customer's private invoices.",
        shift: "Insecure Direct Object Reference (IDOR, a foundational category of Broken Object-Level Authorization / BOLA, ranked #1 on the OWASP API Security Top 10) established the vital distinction between authentication and authorization, mandating context-aware object-level access control on every query."
      },
      num: {
        t: "Object Referencing Paradigms & Authorization Architecture",
        h: ["Referencing Paradigm", "Identifier Format / Type", "Enumerability & Predictability", "Primary Failure Mode", "Recommended Architectural Mitigation"],
        r: [
          ["Sequential Integer IDs", "Auto-incrementing integer (1, 2, 3...)", "Trivially predictable; linear enumeration in seconds", "Mass horizontal data scraping via simple loops", "Mandatory database-level user ownership query scoping"],
          ["Random UUIDv4 / GUID", "128-bit random hex string", "Unpredictable; immune to sequential guessing", "Security through obscurity: leaked UUIDs remain unauthenticated", "Treat UUIDs as addressing only; enforce strict authorization checks"],
          ["Indirect Session Mapping", "Temporary ephemeral session token (A, B, C)", "Scoped strictly to current user's session state", "State synchronization overhead across clustered servers", "Map internal IDs to temporary session-scoped references"],
          ["Signed Cryptographic Tokens", "HMAC-signed payload (e.g., ID + Signature)", "Tamper-evident; client cannot forge other IDs", "Key rotation complexity; lacks real-time revocation", "Verify HMAC signature before processing object ID"],
          ["Database Scoped Ownership", "Any identifier format (Integer, UUID, Slug)", "Irrelevant to security (Security enforced by query logic)", "None; query returns 0 rows if user does not own object", "SELECT * FROM t WHERE id = $1 AND org_id = $auth_user_org_id"]
        ],
        n: "Insecure Direct Object Reference (IDOR) occurs when an application exposes a reference to an internal database object (such as a database primary key, storage filename, or internal account number) in client-accessible parameters without validating that the authenticated requester holds authorization to perform that specific operation on that specific object. IDOR flaws are broadly categorized into: 1) **Horizontal Privilege Escalation**: User A accesses User B's private records (e.g., viewing another customer's bank statement by changing invoice_id=500 to invoice_id=501); 2) **Vertical Privilege Escalation**: an unprivileged user alters an ID parameter to access or modify administrative resources (e.g., updating role_id=1 to role_id=admin). A widespread engineering misconception is that replacing sequential integer IDs with random UUIDv4 identifiers fixes IDOR: while UUIDs prevent automated sequential enumeration, they provide zero authorization security—an attacker who observes or guesses a valid UUID (via browser history, shared links, API metadata, or employee access) can still access unauthorized records. The true architectural solution is Database-Level Contextual Authorization: every data retrieval and mutation query must mathematically bind the requested object ID to the authenticated user's session identifier directly within the SQL/ORM query: 'SELECT * FROM documents WHERE id = $doc_id AND user_id = $session_user_id'. If the user does not own the document, the database returns zero rows (404 Not Found), neutralizing IDOR at the architectural core."
      },
      miss: [
        {
          w: "Replacing sequential integer IDs with UUIDv4 completely eliminates all IDOR vulnerabilities.",
          r: "UUIDs merely make IDs unguessable; they do not enforce authorization. If an endpoint does not verify ownership, any user who obtains a valid UUID (via logs, referrers, or collaboration features) can access the data."
        },
        {
          w: "Hiding direct object IDs and using HTTP POST instead of GET parameters prevents IDOR.",
          r: "HTTP method selection provides zero security; attackers inspect and manipulate POST request bodies, JSON payloads, and headers just as easily as URL query parameters using standard browser dev tools or proxies."
        },
        {
          w: "If an API checks that the user has a valid JWT token, the API is protected against IDOR.",
          r: "A valid JWT proves only authentication (who the user is); IDOR is an authorization failure (what the user is permitted to access). The API must inspect the claims inside the JWT and verify ownership of the target record."
        },
        {
          w: "IDOR only affects read operations and cannot be used to modify or delete data.",
          r: "IDOR vulnerabilities frequently occur on PUT, POST, and DELETE endpoints, allowing attackers to modify passwords, delete other users' accounts, or alter financial transaction details simply by changing the target ID in the request."
        }
      ],
      trade: {
        buys: [
          "Robust multi-tenant data isolation: guarantees that users and organizations can never inspect or tamper with neighboring tenant data.",
          "Prevention of automated data scraping: eliminates bulk data extraction attacks targeting public-facing API endpoints.",
          "Defense-in-depth authorization: enforces access control at the data layer, protecting against UI-level access control oversights.",
          "Compliance with data privacy laws: satisfies GDPR, HIPAA, and PCI-DSS requirements regarding unauthorized data access."
        ],
        costs: [
          "Database query overhead: scoping all queries by user/tenant IDs requires composite database indexes (e.g., index on (id, tenant_id)).",
          "Authorization logic complexity: managing complex hierarchical ownership (teams, departments, delegated permissions) in code.",
          "Testing burden: comprehensive security testing requires creating multiple distinct user accounts to verify cross-tenant boundaries.",
          "API design discipline: developers must never write raw findById() queries without explicit contextual authorization checks."
        ],
        avoid: [
          "Relying on UUIDs as a substitute for object-level authorization checks.",
          "Using raw findById(id) ORM methods without scoping the query to the authenticated user's organization or account ID.",
          "Enforcing access control exclusively on frontend UI buttons while leaving backend API endpoints unauthenticated.",
          "Exposing internal auto-incrementing database primary keys in public API routes when business slugs or UUIDs can be used."
        ]
      }
    },
    {
      slug: "buffer-overflow",
      why: {
        before: "In early computer systems programming, languages like C and C++ were designed for raw hardware execution speed on resource-constrained computers; they omitted automated memory bounds checking and garbage collection.",
        problem: "When software copied more data into a fixed-size memory buffer than it could hold, the excess bytes spilled over into adjacent memory, corrupting variables, function pointers, and the CPU's saved instruction return address (RIP), causing crashes or allowing attackers to execute arbitrary shellcode.",
        shift: "Buffer Overflow vulnerabilities (famously documented in Aleph One's 1996 paper 'Smashing the Stack for Fun and Profit') led to hardware CPU defenses (DEP/NX, ASLR, Stack Canaries) and drove the modern industry transition toward memory-safe programming languages (Rust, Go, Swift)."
      },
      num: {
        t: "Memory Safety Protections & Exploit Mitigations",
        h: ["Defense Mechanism", "Operating Layer", "Protection Technique", "Exploit Class Defeated", "Bypass / Advanced Attacker Technique"],
        r: [
          ["Stack Canaries (-fstack-protector)", "Compiler / CPU Stack", "Random canary integer placed before saved RIP; verified on ret", "Classic linear stack buffer smashing", "Canary leakage via format string bugs or brute force in forking daemons"],
          ["Data Execution Prevention (DEP / NX bit)", "Hardware CPU MMU / OS Page Table", "Marks stack and heap memory pages as Non-Executable", "Direct injection and execution of shellcode in memory", "Return-Oriented Programming (ROP) chaining existing code gadgets"],
          ["Address Space Layout Randomization (ASLR)", "OS Kernel Virtual Memory Loader", "Randomizes base memory addresses of stack, heap, and libraries", "Fixed hardcoded memory jump addresses", "Information disclosure / memory leak bugs to calculate base offsets"],
          ["Control Flow Integrity (CFI / CET)", "Hardware CPU & Compiler", "Shadow stacks and forward-edge indirect branch tracking (ENDBR)", "ROP gadget chaining and return address corruption", "Advanced data-only attacks (modifying variables without altering flow)"],
          ["Memory-Safe Language Migration", "Language Runtime / Type System", "Compile-time ownership (Rust) or runtime bounds checking (Go)", "Entire classes of spatial and temporal memory safety bugs", "Unsafe code blocks, FFI boundary vulnerabilities, compiler bugs"]
        ],
        n: "A classic stack-based buffer overflow occurs due to the anatomical layout of the x86-64 call stack. When a function is called, the CPU pushes a stack frame: function arguments, local variables, the saved Base Pointer (RBP), and the Saved Return Address (RIP) pointing to the instruction following the call. In x86 architecture, the stack grows downward (toward lower memory addresses), but memory buffers fill upward (toward higher memory addresses). If a program allocates a 64-byte local buffer and uses an unbounded function (such as strcpy(), gets(), or sprintf()) to copy 128 bytes of input, the input fills the 64-byte buffer, overwrites the saved RBP, and overwrites the saved RIP with attacker-controlled bytes. When the function finishes and executes the RET instruction, the CPU pops the corrupted RIP into its instruction pointer, jumping directly to the attacker's address. To defeat injected shellcode, operating systems introduced the Non-Executable (NX / DEP) bit, enforcing W^X (Write XOR Execute): a memory page can be writable or executable, but never both. In response, modern exploits use Return-Oriented Programming (ROP): the attacker overwrites the return address not with injected shellcode, but with addresses of existing snippets of executable machine code ('gadgets' ending in RET) already present in shared libraries (like libc). By chaining these gadgets together, the attacker invokes system calls (like execve('/bin/sh', ...)) without executing a single byte of injected code."
      },
      miss: [
        {
          w: "Buffer overflow vulnerabilities are a common risk when writing code in Python, Java, or JavaScript.",
          r: "Python, Java, and JavaScript are memory-safe managed languages; their runtimes enforce strict automatic bounds checking, throwing array index exceptions rather than corrupting memory (though their underlying C runtimes can have bugs)."
        },
        {
          w: "Enabling Address Space Layout Randomization (ASLR) makes buffer overflows impossible to exploit.",
          r: "ASLR randomizes memory addresses, but attackers bypass it by combining buffer overflows with Information Disclosure vulnerabilities (memory leaks) that reveal a single library address, allowing them to calculate the base address of all ROP gadgets."
        },
        {
          w: "Buffer overflows only occur on the CPU call stack.",
          r: "Buffer overflows frequently occur on the Heap (Heap Overflows), where overflowing memory corrupts adjacent heap chunk metadata (glibc malloc chunk headers) or C++ virtual method table (vtable) pointers, leading to arbitrary code execution."
        },
        {
          w: "Replacing strcpy() with strncpy() completely guarantees memory safety in C programs.",
          r: "strncpy() is notoriously error-prone: if the source string equals or exceeds the buffer size, strncpy() does not null-terminate the destination buffer, leading to off-by-one errors and subsequent string buffer overflows."
        }
      ],
      trade: {
        buys: [
          "Immunity via modern languages: adopting memory-safe languages (Rust, Go) eliminates 70% of all critical CVE security vulnerabilities.",
          "Hardware-enforced execution containment: DEP/NX and ASLR prevent trivial script-kiddie exploitation of legacy C binaries.",
          "Early compiler detection: modern compilers (-Wall, -Wextra, AddressSanitizer) detect out-of-bounds array writes during compilation and testing.",
          "Control Flow Integrity: hardware technologies (Intel CET shadow stacks) block Return-Oriented Programming gadget chaining."
        ],
        costs: [
          "Runtime bounds-checking tax: memory-safe languages perform array bounds checking at runtime (though optimized out in loops).",
          "Memory overhead for sandboxing: shadow stacks and AddressSanitizer instrumentations increase binary memory footprint.",
          "Legacy code rewrite cost: porting multi-million-line legacy C/C++ codebases to modern memory-safe languages requires immense investment.",
          "Complex debugging in C: memory corruption bugs often manifest unpredictably thousands of instructions after the actual overflow occurs."
        ],
        avoid: [
          "Using unbounded, legacy C functions (gets(), strcpy(), strcat(), sprintf()) in production codebases.",
          "Disabling compiler stack protection flags (-fno-stack-protector) or compiling binaries with executable stacks (execstack).",
          "Using 'unsafe' blocks in Rust without rigorous formal verification and comprehensive fuzz testing.",
          "Writing new systems infrastructure in unmanaged C/C++ when modern memory-safe alternatives (Rust, Go) are viable."
        ]
      }
    },
    {
      slug: "owasp-top-10",
      why: {
        before: "In the late 1990s and early 2000s, software security was fragmented, opaque, and poorly understood; organizations spent vast sums on network firewalls while leaving custom web applications riddled with basic, preventable security vulnerabilities.",
        problem: "Software developers, architects, and business leaders lacked an authoritative, data-driven consensus standard defining which application security risks posed the greatest real-world danger, leading to widespread vulnerabilities and inconsistent audit standards.",
        shift: "The Open Web Application Security Project (OWASP, founded in 2001) established the OWASP Top 10, a globally recognized, data-backed standard awareness document that catalogs the ten most critical web application security risks, transforming secure coding standards, tooling, and regulatory compliance."
      },
      num: {
        t: "OWASP Top 10 (2021 Edition) Vulnerability Categories",
        h: ["Rank & Category ID", "Primary Vulnerability Scope", "Core Architectural Failure", "Real-World Exploit Example", "Primary Architectural Defense"],
        r: [
          ["A01:2021 - Broken Access Control", "Authorization enforcement across objects & functions", "Failing to verify user permissions on objects and endpoints", "IDOR: user increments ID in URL to view another's records", "Database-level ownership scoping; mandatory RBAC/ABAC middleware"],
          ["A02:2021 - Cryptographic Failures", "Data confidentiality & integrity at rest and in transit", "Using weak ciphers, cleartext transmission, poor key management", "Storing passwords as unsalted MD5; missing TLS on API routes", "Enforce TLS 1.3, AES-256-GCM, Argon2id, and KMS key management"],
          ["A03:2021 - Injection", "Interpreting untrusted input as commands or code", "Concatenating user strings directly into syntax interpreters", "SQLi, Command Injection, Cross-Site Scripting (XSS)", "Parameterized queries, ORMs, execve argument arrays, context encoding"],
          ["A04:2021 - Insecure Design", "Flaws in architectural threat modeling and design", "Designing software without considering threat vectors and limits", "E-commerce app allowing negative quantities to credit bank accounts", "Formal threat modeling (STRIDE), secure design patterns, rate limiting"],
          ["A05:2021 - Security Misconfiguration", "Default credentials, unnecessary ports, verbose errors", "Deploying systems with default settings or unhardened configs", "Exposed cloud S3 buckets, enabled debug pages showing stack traces", "Automated Infrastructure as Code (IaC) hardening and GitOps auditing"],
          ["A06:2021 - Vulnerable Components", "Software supply chain and third-party dependencies", "Running outdated open-source packages with known CVEs", "Equifax breach (Apache Struts CVE-2017-5638)", "Software Bill of Materials (SBOM), automated Dependabot / Snyk scanning"]
        ],
        n: "The OWASP Top 10 reflects an evolving consensus derived from empirical vulnerability data analyzed across hundreds of thousands of applications worldwide. In earlier editions (2003–2017), technical syntax bugs dominated the rankings—Injection (SQLi, OS command injection) held the #1 position for over a decade. In the modern 2021 edition, the paradigm shifted significantly: modern frameworks (React, Django, Rails, Spring Boot) have largely eliminated raw syntax injection by default through parameterized ORMs and auto-escaping template engines. Consequently, architectural and logical access control flaws surged to the forefront: **A01:2021 - Broken Access Control** now occupies the #1 spot globally, present in over 94% of audited applications. Furthermore, the 2021 edition introduced strategic, foundational categories: **A04:2021 - Insecure Design** establishes that security cannot be retrofitted via testing if the underlying system architecture is inherently flawed, mandating pre-development Threat Modeling (STRIDE) and secure design patterns; **A08:2021 - Software and Data Integrity Failures** addresses unverified CI/CD deployment pipelines, insecure deserialization, and untrusted auto-update mechanisms; and **A10:2021 - Server-Side Request Forgery (SSRF)** was elevated to a standalone top-10 category driven by cloud infrastructure exploitation."
      },
      miss: [
        {
          w: "Passing an OWASP Top 10 compliance checklist means your web application is 100% secure.",
          r: "The OWASP Top 10 represents only the minimum baseline awareness of the ten most common vulnerability categories; applications face hundreds of other security risks, business logic flaws, and zero-day vulnerabilities."
        },
        {
          w: "SQL Injection is still the #1 most dangerous vulnerability in modern web development.",
          r: "In the modern OWASP Top 10 (2021), Broken Access Control is ranked #1; SQL Injection is grouped under A03: Injection, which dropped to #3 as modern ORMs and parameterized queries became industry standards."
        },
        {
          w: "Installing a Web Application Firewall (WAF) automatically protects against all OWASP Top 10 vulnerabilities.",
          r: "WAFs rely on pattern matching and signature detection; they cannot detect architectural flaws (A04: Insecure Design), Broken Access Control (A01), or business logic abuse without application-level authorization code."
        },
        {
          w: "The OWASP Top 10 is only relevant to security penetration testers and ethical hackers.",
          r: "The OWASP Top 10 is designed primarily for software developers, architects, and DevOps engineers to guide secure software design, code reviews, CI/CD automated linting, and system procurement."
        }
      ],
      trade: {
        buys: [
          "Standardized risk taxonomy: provides a universal, data-backed security vocabulary across engineering, audit, and executive teams.",
          "Prioritized security investment: focuses limited engineering and security budgets on the ten highest-probability attack vectors.",
          "Regulatory compliance alignment: satisfies mandatory security audit requirements across PCI-DSS, SOC 2, ISO 27001, and HIPAA.",
          "Proactive secure development: guides automated SAST/DAST testing rules and architectural design patterns in CI/CD pipelines."
        ],
        costs: [
          "Compliance checklist fallacy: organizations treat the Top 10 as a comprehensive checklist, ignoring custom business logic flaws.",
          "Rapid obsolescence risk: relying strictly on static guidelines can cause teams to miss emerging attack vectors between publication cycles.",
          "Broad category generalization: categories like 'Insecure Design' are abstract and difficult to verify using automated testing tools.",
          "Over-focus on web layer: may cause organizations to neglect mobile, IoT, firmware, or physical hardware security risks."
        ],
        avoid: [
          "Treating the OWASP Top 10 as an exhaustive security checklist rather than a minimum baseline starting point.",
          "Assuming third-party libraries and container base images are secure without automated SCA vulnerability scanning (A06).",
          "Deploying applications with default credentials, open admin dashboards, or verbose stack traces enabled in production (A05).",
          "Designing complex software features without conducting formal Threat Modeling (STRIDE) during the design phase (A04)."
        ]
      }
    }
  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
