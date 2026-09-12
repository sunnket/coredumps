/* Project Lab — Cybersecurity & Network Engineering */
(function (TD) {
  TD.addProjects("security", [
    {
      id: "shamir-secret-sharing-vault",
      title: "Cryptographic Shamir's Secret Sharing Vault",
      domain: "security",
      difficulty: "easy",
      year: "1st Year (Foundations)",
      time: "1–2 weeks",
      tagline: "Split master encryption keys and passwords into (k, n) mathematical polynomial shares with Lagrange interpolation.",
      problem: "Storing master database keys or Bitcoin seed phrases in a single location creates a single point of failure and vulnerability to theft. If a key is required by a board of directors, you need a mathematical mechanism where any $k$ out of $n$ shareholders can reconstruct the secret, but any $k-1$ shares reveal zero information.",
      outcome: "A secure CLI tool and web cryptographic playground that splits sensitive master secrets into $n$ shares and reconstructs the original plaintext only when a valid quorum of $k$ shares is provided.",
      stack: ["Python / Rust", "Finite Field Arithmetic (Galois Field GF(2^8))", "Lagrange Polynomial Interpolation", "CLI"],
      diagram:
"Master Secret: S = 42 (Constant Term of Polynomial f(0) = 42)\nGenerate Random Degree (k-1 = 2) Polynomial: f(x) = 3x² + 7x + 42\n                               │\n                               ▼\n┌────────────────────────────────────────────────────────┐\n│ Evaluate Polynomial at n = 5 Distinct Points:          │\n│ • Share 1: (x=1, y=52)   • Share 2: (x=2, y=68)        │\n│ • Share 3: (x=3, y=90)   • Share 4: (x=4, y=118)       │\n│ • Share 5: (x=5, y=152)                                │\n└──────────────────────────────┬─────────────────────────┘\n                               ▼\nAny k = 3 Shares Provided ──► Lagrange Polynomial Interpolation ──► Reconstructs S = 42!\nAny k = 2 Shares Provided ──► Infinitely many possible polynomials ──► ZERO Information Leaked!",
      steps: [
        { title: "Phase 1: Galois Field GF(2^8) Arithmetic", desc: "Implement finite field arithmetic (addition, subtraction, multiplication, and multiplicative inverses) over $GF(2^8)$ to avoid floating-point precision loss." },
        { title: "Phase 2: Polynomial Generation & Share Splitting", desc: "For each byte of the secret, generate a random polynomial $f(x)$ of degree $k-1$ with $f(0) = \\text{byte}$. Evaluate at $n$ distinct non-zero $x$ points." },
        { title: "Phase 3: Lagrange Interpolation Reconstruction", desc: "Given any $k$ shares $(x_i, y_i)$, compute the Lagrange basis polynomials $L_i(0) = \\prod_{j \\neq i} \\frac{-x_j}{x_i - x_j}$ to solve for $f(0)$ in constant field operations." },
        { title: "Phase 4: Encrypted Paper Key Backup Generator", desc: "Format generated shares into printable QR codes and mnemonic word phrases with checksum validation." }
      ],
      resources: [
        { title: "Adi Shamir — How to Share a Secret (Communications of the ACM 1979)", url: "https://dl.acm.org/doi/10.1145/359168.359176" },
        { title: "Galois Field Arithmetic in Cryptography Guide", url: "https://en.wikipedia.org/wiki/Finite_field_arithmetic" },
        { title: "HashiCorp Vault Architecture: Shamir Secret Unsealing", url: "https://developer.hashicorp.com/vault/docs/concepts/seal" }
      ],
      pitfalls: [
        "Do not use standard real-number arithmetic; rounding errors on floats will corrupt key reconstruction. Always use finite field arithmetic ($GF(2^8)$ or large primes).",
        "Ensure random polynomial coefficients are generated using cryptographically secure pseudorandom number generators (`crypto.getRandomValues()` / `secrets`), never `Math.random()`."
      ],
      interview: [
        "Why is Shamir's Secret Sharing considered 'information-theoretically secure' when fewer than $k$ shares are presented?",
        "How does HashiCorp Vault use Shamir's Secret Sharing to unseal master storage encryption keys?"
      ]
    },
    {
      id: "dns-sinkhole-adblocker",
      title: "High-Performance DNS Sinkhole & Privacy Firewall (Pi-hole Clone)",
      domain: "security",
      difficulty: "easy",
      year: "1st Year (Foundations)",
      time: "2 weeks",
      tagline: "Build a network-wide DNS proxy in Go/Rust that blocks malware domains and telemetry trackers in sub-2ms.",
      problem: "Ad trackers, telemetry beacons, and phishing domains slow network traffic and compromise user privacy across all devices on a local network (smartphones, IoT devices, laptops).",
      outcome: "A standalone DNS server running on port 53 that intercepts network DNS queries, matches requested domains against millions of malicious host rules using a prefix Trie, and forwards clean traffic via encrypted DNS-over-HTTPS (DoH).",
      stack: ["Go / Rust", "UDP / TCP Socket Handling (Port 53)", "RFC 1035 DNS Protocol", "DNS-over-HTTPS (DoH)", "Fast Trie Index"],
      diagram:
"Network Client (Laptop / Smartphone)\n                 │ (DNS Query: 'tracking.analytics-tracker.com')\n                 ▼\n┌────────────────────────────────────────┐\n│ Custom DNS Proxy Server (Port 53 UDP)  │\n└────────────────┬───────────────────────┘\n                 ▼\n┌────────────────────────────────────────┐\n│ In-Memory Blocklist Trie (1,500,000 Domains)\n└────────────────┬───────────────────────┘\n                 │\n         ┌───────┴───────────────────────┐\n         │ Match Found (Malware / Ad)    │ Clean Domain (e.g. 'github.com')\n         ▼                               ▼\n┌───────────────────────────────┐ ┌──────────────────────────────────────┐\n│ Return Sinkhole IP: 0.0.0.0   │ │ Forward via DNS-over-HTTPS (DoH)     │\n│ Query Blocked in <0.5ms!      │ │ to Cloudflare (1.1.1.1) / Google DNS │\n└───────────────────────────────┘ └──────────────────────────────────────┘",
      steps: [
        { title: "Phase 1: RFC 1035 Binary DNS Message Parser", desc: "Build a zero-allocation binary parser for DNS header flags, Question records, Resource Records (A, AAAA, CNAME, PTR), and compressed domain name pointers." },
        { title: "Phase 2: High-Speed Domain Trie Lookup", desc: "Parse public blocklists (StevenBlack, EasyList) into an in-memory prefix Trie structure for constant-time $O(L)$ domain matching." },
        { title: "Phase 3: Upstream Forwarding & DNS-over-HTTPS (DoH)", desc: "Forward permitted queries to upstream resolvers (1.1.1.1 / 8.8.8.8) using encrypted DoH (RFC 8484) to prevent ISP eavesdropping." },
        { title: "Phase 4: Web Admin Dashboard", desc: "Build an interactive web UI showing total queries, blocked percentage, top requested domains, and real-time client IP traffic graphs." }
      ],
      resources: [
        { title: "IETF RFC 1035: Domain Names - Implementation and Specification", url: "https://datatracker.ietf.org/doc/html/rfc1035" },
        { title: "IETF RFC 8484: DNS Queries over HTTPS (DoH)", url: "https://datatracker.ietf.org/doc/html/rfc8484" },
        { title: "Pi-hole Open Source DNS Ad-Blocking Architecture", url: "https://pi-hole.net/" }
      ],
      pitfalls: [
        "Correctly handle DNS domain name compression pointers (offset bytes starting with `0xC0`); failing to resolve recursive pointers causes corrupt domain lookups.",
        "Ensure the server responds with `0.0.0.0` or `NXDOMAIN` immediately rather than timing out, allowing client browsers to render pages without delay."
      ],
      interview: [
        "Explain how DNS name compression works at the binary packet byte level.",
        "How does DNS-over-HTTPS (DoH) protect against DNS spoofing and ISP surveillance?"
      ]
    },
    {
      id: "honey-pot-ssh-logger",
      title: "Deceptive SSH Honeypot & Threat Intelligence Sensor",
      domain: "security",
      difficulty: "easy",
      year: "1st Year (Foundations)",
      time: "2 weeks",
      tagline: "Deploy a decoy SSH server to capture automated botnet attacks, brute-force credentials, and hacker keystrokes.",
      problem: "Security teams need visibility into real-world threat actors: what passwords are botnets attempting, what automated malware payloads are attackers downloading, and which global IP subnets are launching scans?",
      outcome: "A deceptive Cowrie-style SSH honeypot that mimics an authentic Linux server, logs every attacker command and downloaded payload into a threat intelligence database, and alerts on Slack.",
      stack: ["Python (AsyncSSH / Paramiko)", "SQLite / PostgreSQL", "GeoIP2", "MaxMind / IPWhois", "Discord / Slack Webhooks"],
      diagram:
"Malicious Internet Botnet / Hacker\n              │ (SSH Connection to Port 22)\n              ▼\n┌────────────────────────────────────────┐\n│ Fake SSH Honeypot Daemon               │\n│ • Accepts common credentials (root/123)│\n└─────────────┬──────────────────────────┘\n              ▼\n┌────────────────────────────────────────┐\n│ Sandboxed Fake POSIX Environment       │ (Simulates standard Linux commands: ls, wget, uname)\n│ Logs all keystrokes, passwords, and IPs│\n└─────────────┬──────────────────────────┘\n              ▼\n┌────────────────────────────────────────┐\n│ Threat Intelligence Aggregation Engine │ ──► Captures downloaded malware binaries\n│ • GeoIP & ASN Lookup (Country, ISP)    │ ──► Triggers Slack Security Alert\n│ • Computes SHA-256 Malware Hashes      │ ──► Visualizes Global Attack Heatmap\n└────────────────────────────────────────┘",
      steps: [
        { title: "Phase 1: Emulated SSH Protocol Server", desc: "Build an SSH server using `asyncssh` on port 2222 (port-forwarded from 22). Emulate standard SSH banner responses (e.g. `OpenSSH_8.9p1 Ubuntu`)." },
        { title: "Phase 2: Deceptive Interactive Shell Environment", desc: "Provide an emulated Linux bash shell that responds convincingly to common reconnaissance commands (`uname -a`, `cat /etc/passwd`, `ip a`, `uptime`)." },
        { title: "Phase 3: Payload Capture & Malware Hash Logging", desc: "When attackers run `wget` or `curl` to download shell scripts or crypto-miners, intercept the network download, store the payload in a quarantine folder, and calculate its SHA-256 hash." },
        { title: "Phase 4: Global Attack Dashboard", desc: "Build a web dashboard showing top attacked usernames, passwords, originating countries, and an interactive world map of attacker IPs." }
      ],
      resources: [
        { title: "Cowrie SSH/Telnet Honeypot Documentation", url: "https://cowrie.readthedocs.io/" },
        { title: "AsyncSSH: Asynchronous SSHv2 Protocol for Python", url: "https://asyncssh.readthedocs.io/" },
        { title: "SANS Internet Storm Center Threat Feeds", url: "https://isc.sans.edu/" }
      ],
      pitfalls: [
        "Never run honeypot scripts with root privileges on your primary machine; always isolate the honeypot in a dedicated cloud VPS or restricted container to prevent sandbox breakouts.",
        "Do not allow the honeypot to make outbound network connections; attackers might use your honeypot as a bounce host for DDoS attacks."
      ],
      interview: [
        "What is the difference between Low-Interaction and High-Interaction honeypots?",
        "How do threat intelligence analysts use honeypot data to detect zero-day exploitation trends?"
      ]
    },
    {
      id: "packet-sniffer-ids",
      title: "Raw Socket Packet Sniffer & Network Intrusion Detector (Mini-Snort)",
      domain: "security",
      difficulty: "intermediate",
      year: "2nd Year (Core Builder)",
      time: "2–3 weeks",
      tagline: "Capture raw Ethernet packets and detect port scans, SYN floods, and cleartext credential leaks in C/Python.",
      problem: "Security Operations Centers (SOC) must inspect high-speed network traffic to detect suspicious lateral movement, port scans, and unencrypted credentials before breaches compromise the entire enterprise.",
      outcome: "A standalone packet analyzer and intrusion detection system (IDS) that decodes raw Ethernet/IP/TCP/UDP packets, reassembles TCP streams, and triggers Snort-style rule alerts.",
      stack: ["C / Python (Raw Sockets / Libpcap)", "TCP/IP Protocol Stack Decoding", "Snort Rule Parser", "SQLite / Elastic"],
      diagram:
"Network Interface Card (Promiscuous Mode: eth0)\n                         │\n                         ▼\n┌────────────────────────────────────────────────────────┐\n│ Raw Socket Listener (AF_PACKET / libpcap)              │\n└────────────────────────┬───────────────────────────────┘\n                         ▼\n┌────────────────────────────────────────────────────────┐\n│ Packet Header Dissector: Ethernet ──► IP ──► TCP / UDP │\n└────────────────────────┬───────────────────────────────┘\n                         ▼\n┌────────────────────────────────────────────────────────┐\n│ State Tracking & TCP Stream Reassembly Engine          │\n└────────────────────────┬───────────────────────────────┘\n                         │\n         ┌───────────────┴───────────────┐\n         ▼                               ▼\n┌─────────────────────────────────┐ ┌─────────────────────────────────┐\n│ Port Scan / SYN Flood Detector  │ │ Signature Rule Matcher (Snort)  │\n│ Detects 50 unique ports scanned │ │ Regex match on unencrypted HTTP │\n│ from single IP in <2 seconds    │ │ passwords, SQLi, or API tokens  │\n└─────────────────────────────────┘ └─────────────────────────────────┘",
      steps: [
        { title: "Phase 1: Promiscuous Mode & Raw Packet Capture", desc: "Open a raw Linux socket (`socket(AF_PACKET, SOCK_RAW, htons(ETH_P_ALL))`) in promiscuous mode to capture all network traffic crossing the physical interface." },
        { title: "Phase 2: Packet Header Dissector", desc: "Parse binary struct offsets for Ethernet frames (MAC addresses), IPv4/IPv6 headers (TTL, Source/Dest IP), and TCP/UDP transport headers (Ports, Flags, Sequence Numbers)." },
        { title: "Phase 3: TCP Stream Reassembly & Port Scan Detection", desc: "Implement a sliding TCP state table to track sequence numbers and reassemble fragmented HTTP/FTP payloads. Detect vertical and horizontal port scans using sliding temporal windows." },
        { title: "Phase 4: Rule Engine & Live Terminal Dashboard", desc: "Build a rule engine matching custom signatures (`alert tcp any any -> any 80 (msg:\"Cleartext password detected\"; content:\"password=\";)`). Render live ncurses terminal packet statistics." }
      ],
      resources: [
        { title: "Tcpdump and Libpcap Architecture", url: "https://www.tcpdump.org/" },
        { title: "Snort Rules and IDS Architecture Guide", url: "https://www.snort.org/documents" },
        { title: "TCP/IP Illustrated, Vol. 1 (W. Richard Stevens)", url: "https://en.wikipedia.org/wiki/TCP/IP_Illustrated" }
      ],
      pitfalls: [
        "Raw sockets on high-speed 1Gbps+ networks will drop packets unless memory-mapped ring buffers (`PACKET_MMAP`) or multi-threaded packet rings are implemented.",
        "Ensure IP checksums and TCP checksum calculations are verified to discard corrupted packets before analysis."
      ],
      interview: [
        "Explain how promiscuous mode allows a network interface card (NIC) to capture traffic intended for other host machines.",
        "How does a SYN flood attack abuse the TCP 3-way handshake, and how do SYN Cookies mitigate it?"
      ]
    },
    {
      id: "static-code-vuln-scanner",
      title: "Static AST Code Vulnerability Scanner (Mini-Semgrep)",
      domain: "security",
      difficulty: "intermediate",
      year: "2nd Year (Core Builder)",
      time: "2–3 weeks",
      tagline: "Build a static analysis security testing (SAST) tool with AST taint analysis for SQL injection and XSS detection.",
      problem: "Simple regex linters produce massive false positives when scanning source code. A true security scanner must parse code into Abstract Syntax Trees and track taint flow from untrusted user inputs (Sources) to dangerous functions (Sinks).",
      outcome: "A CLI security scanner that analyzes Python/JavaScript codebases, traces taint propagation across variable assignments and function calls, and generates SARIF reports for GitHub Actions.",
      stack: ["Python", "Tree-Sitter / Python ast module", "Taint Analysis Engine", "SARIF JSON Format", "CLI"],
      diagram:
"Source Code File: app.py\n  user_input = request.args.get('id')         <── [ SOURCE: Untrusted User Input ]\n  clean_query = 'SELECT * FROM users WHERE id = ' + user_input\n  db.execute(clean_query)                     <── [ SINK: Dangerous Database Execution ]\n                         │\n                         ▼\n┌────────────────────────────────────────────────────────┐\n│ Tree-Sitter AST Construction & Symbol Table            │\n└────────────────────────┬───────────────────────────────┘\n                         ▼\n┌────────────────────────────────────────────────────────┐\n│ Taint Propagation Engine: Tracks variable 'user_input' │\n│ flows into 'clean_query' without sanitization          │\n└────────────────────────┬───────────────────────────────┘\n                         ▼\nVulnerability Confirmed: High-Severity SQL Injection (CWE-89) at line 3\nGenerates SARIF Report with Remediation Guide: Use Parameterized Queries!",
      steps: [
        { title: "Phase 1: AST Parser & Pattern Matcher", desc: "Use Python's built-in `ast` module or Tree-Sitter to parse source files into navigable syntax trees, identifying function calls, assignments, and expressions." },
        { title: "Phase 2: Source-to-Sink Taint Tracking", desc: "Define security sources (`request.form`, `req.query`, `sys.argv`) and dangerous sinks (`eval()`, `db.execute()`, `os.system()`, `innerHTML`). Trace variable assignments to verify if tainted variables reach sinks without passing through sanitizers." },
        { title: "Phase 3: Custom YAML Rule Engine", desc: "Create a declarative rule format (Semgrep style) allowing security teams to write custom company-specific security rules with regex and AST constraints." },
        { title: "Phase 4: SARIF Format & Pre-Commit Integration", desc: "Export findings in standardized SARIF (Static Analysis Results Interchange Format) JSON so security alerts render directly in GitHub pull request diffs." }
      ],
      resources: [
        { title: "Semgrep Open-Source Static Analysis Engine", url: "https://semgrep.dev/docs/" },
        { title: "OASIS SARIF Specification (Static Analysis Results Interchange Format)", url: "https://docs.oasis-open.org/sarif/sarif/v2.1.0/sarif-v2.1.0.html" },
        { title: "Taint Analysis Concepts (MIT Software Security)", url: "https://6.858.csail.mit.edu/" }
      ],
      pitfalls: [
        "Beware of sanitizers: if a variable passes through `html.escape()` or parameterized SQL wrappers, the taint flag must be cleared (un-tainted) to avoid false alarms.",
        "Handle variable shadowing and scope blocks correctly so local variables in one function do not taint variables with the same name in another."
      ],
      interview: [
        "Explain the concepts of Source, Sink, and Sanitizer in static taint analysis.",
        "What are the key trade-offs between Static Application Security Testing (SAST) and Dynamic Application Security Testing (DAST)?"
      ]
    },
    {
      id: "zero-trust-proxy-mtls",
      title: "Zero-Trust Reverse Proxy with Mutual TLS & OPA Authorization",
      domain: "security",
      difficulty: "hard",
      year: "3rd Year (Advanced Engineering)",
      time: "3–4 weeks",
      tagline: "Build a service-mesh style reverse proxy with X.509 mTLS identity certificates and Open Policy Agent (OPA).",
      problem: "Traditional perimeter security (firewalls, VPNs) assumes all traffic inside the internal corporate network is trusted. In modern zero-trust architecture, every single microservice-to-microservice request must authenticate cryptographically and prove authorization.",
      outcome: "A zero-trust reverse proxy that enforces mutual TLS (mTLS) with automated X.509 certificate validation, verifies SPIFFE workload IDs, and evaluates fine-grained authorization policies with Open Policy Agent (OPA).",
      stack: ["Go / Rust", "Mutual TLS (mTLS)", "SPIFFE / SPIRE Identities", "Open Policy Agent (OPA / Rego)", "Prometheus"],
      diagram:
"Microservice A (Client)                              Zero-Trust Proxy Gateway                Microservice B (Target)\n┌──────────────────────┐                             ┌──────────────────────┐                ┌──────────────────────┐\n│ Client Certificate   │                             │ Gateway Certificate  │                │                      │\n│ SAN: spiffe://app/svc│                             │ Verifies Client mTLS │                │                      │\n└──────────┬───────────┘                             └──────────┬───────────┘                └──────────┬───────────┘\n           │ 1. Mutual TLS Handshake (mTLS)                     │                                       │\n           ├───────────────────────────────────────────────────►│                                       │\n           │ 2. Extracts Client SPIFFE ID: 'spiffe://app/svc'   │                                       │\n           │                                                    ▼                                       │\n           │                                     ┌─────────────────────────────┐                        │\n           │                                     │ Open Policy Agent (Rego)    │                        │\n           │                                     │ Policy: Can Service A call  │                        │\n           │                                     │ POST /billing/charge?       │                        │\n           │                                     └──────────────┬──────────────┘                        │\n           │                                                    │ If ALLOW                              │\n           │                                                    ▼                                       │\n           │                                     Forward Request over Internal mTLS ───────────────────►│\n           │◄──────────────────────────────────── Returns HTTP 200 OK ◄────────────────────────────────┤",
      steps: [
        { title: "Phase 1: Internal PKI & Certificate Authority", desc: "Build an automated Private Key Infrastructure (PKI) issuing short-lived X.509 certificates with SPIFFE Subject Alternative Names (SANs)." },
        { title: "Phase 2: Mutual TLS (mTLS) Reverse Proxy", desc: "Implement the proxy in Go with `tls.RequireAndVerifyClientCert`. Both client and server verify each other's cryptographic certificates against the trusted root CA." },
        { title: "Phase 3: OPA Rego Authorization Engine", desc: "Integrate Open Policy Agent: extract client identity, target HTTP path, and method, passing the JSON context to Rego policy rules for sub-millisecond authorization." },
        { title: "Phase 4: Audit Logging & Access Graphs", desc: "Log all allowed and rejected requests with client certificate fingerprints, generating interactive dependency security maps." }
      ],
      resources: [
        { title: "SPIFFE (Secure Production Identity Framework for Everyone) Standard", url: "https://spiffe.io/" },
        { title: "Open Policy Agent (OPA) Documentation & Rego Language", url: "https://www.openpolicyagent.org/docs/latest/" },
        { title: "NIST Special Publication 800-207: Zero Trust Architecture", url: "https://csrc.nist.gov/publications/detail/sp/800-207/final" }
      ],
      pitfalls: [
        "Do not rely on long-lived certificates (e.g. 1-year certs); zero-trust environments require short-lived certificates (hours/days) with automated rotation to limit stolen credential impact.",
        "Ensure the proxy properly terminates client TLS before opening upstream connections, sanitizing forwarded HTTP headers (`X-Forwarded-Client-Cert`)."
      ],
      interview: [
        "Explain how Mutual TLS (mTLS) differs from standard one-way TLS.",
        "What is the SPIFFE ID format and how does it establish workload identity in dynamic Kubernetes clusters?"
      ]
    },
    {
      id: "end-to-end-encrypted-chat",
      title: "End-to-End Encrypted Messaging with Signal Double Ratchet Algorithm",
      domain: "security",
      difficulty: "hard",
      year: "3rd Year (Advanced Engineering)",
      time: "3–4 weeks",
      tagline: "Build a Signal/WhatsApp style secure messenger with Double Ratchet, Diffie-Hellman ephemeral keys, and forward secrecy.",
      problem: "Standard messaging apps store encryption keys on servers, allowing rogue employees or subpoenas to read private messages. End-to-end encrypted protocols ensure that even if the server is fully compromised, past and future messages remain unreadable.",
      outcome: "A functional E2EE chat client and relay server implementing the Signal Double Ratchet protocol, providing Forward Secrecy and Break-in Recovery for 1-on-1 conversations.",
      stack: ["TypeScript / Rust", "Curve25519 (X25519)", "HKDF (HMAC Key Derivation)", "AES-256-GCM", "WebSockets"],
      diagram:
"Alice (Client)                                                                               Bob (Client)\n┌──────────────────────────────────────┐                                                     ┌──────────────────────────────────────┐\n│ Root Key (RK) ──► KDF Chain          │                                                     │ Root Key (RK) ──► KDF Chain          │\n│ • Generates Ephemeral DH Key Pair    │                                                     │ • Generates Ephemeral DH Key Pair    │\n│ • Computes Shared Secret: DH(A, B)   │                                                     │ • Computes Shared Secret: DH(A, B)   │\n└──────────────────┬───────────────────┘                                                     └──────────────────┬───────────────────┘\n                   │ Symmetric Ratchet Chain                                                                    │ Symmetric Ratchet Chain\n                   ▼                                                                                            ▼\n┌──────────────────────────────────────┐                                                     ┌──────────────────────────────────────┐\n│ Message Key 1 ──► AES-256-GCM Encrypt│ ──Ciphertext + Ephemeral Key (Over Untrusted Server)─►│ Message Key 1 ──► AES-256-GCM Decrypt│\n│ (Immediately Deleted from RAM!)      │                                                     │ (Immediately Deleted from RAM!)      │\n└──────────────────────────────────────┘                                                     └──────────────────────────────────────┘\nEvery single message ratchets both the DH Key and the Symmetric Chain:\n• Forward Secrecy: Compromising current key cannot decrypt PAST messages!\n• Post-Compromise Security: Compromising current key cannot decrypt FUTURE messages once a new DH ratchet turns!",
      steps: [
        { title: "Phase 1: Diffie-Hellman Key Exchange (X25519)", desc: "Implement ephemeral Diffie-Hellman key exchanges using Curve25519 to establish the initial shared secret." },
        { title: "Phase 2: Symmetric KDF Chain (KDF Ratchet)", desc: "Build the symmetric key derivation ratchet using HKDF-SHA256: each step derives a new message key and a new chain key, instantly deleting the previous message key." },
        { title: "Phase 3: Asymmetric DH Ratchet (The Double Ratchet)", desc: "Integrate the asymmetric DH ratchet: whenever a reply is received, generate a new DH key pair and ratchet the root key, achieving Break-in Recovery." },
        { title: "Phase 4: Message Out-of-Order Handling & UI", desc: "Store skipped message keys in an encrypted ephemeral buffer to handle delayed or out-of-order message delivery over WebSockets." }
      ],
      resources: [
        { title: "The Double Ratchet Algorithm Specification (Signal)", url: "https://signal.org/docs/specifications/doubleratchet/" },
        { title: "The X3DH Key Agreement Protocol (Signal)", url: "https://signal.org/docs/specifications/x3dh/" },
        { title: "Cryptography Engineering (Ferguson, Schneier, Kohno)", url: "https://www.schneier.com/books/cryptography-engineering/" }
      ],
      pitfalls: [
        "Never reuse nonces in AES-GCM encryption; repeating a nonce with the same key catastrophically leaks the authentication key and plaintext XOR differences.",
        "Always securely zero-out/overwrite message keys in RAM immediately after encrypting/decrypting."
      ],
      interview: [
        "What is the mathematical difference between Forward Secrecy and Post-Compromise Security (Break-in Recovery)?",
        "How does the Signal Double Ratchet protocol combine symmetric KDF ratchets with asymmetric Diffie-Hellman ratchets?"
      ]
    },
    {
      id: "fuzzing-engine-binary",
      title: "Coverage-Guided Mutation Fuzzing Engine in C/Rust (AFL Clone)",
      domain: "security",
      difficulty: "hard",
      year: "3rd Year (Advanced Engineering)",
      time: "3–4 weeks",
      tagline: "Build an automated vulnerability discovery fuzzer with LLVM edge coverage bitmaps and genetic mutation algorithms.",
      problem: "Software binaries (C/C++ parsers, image codecs, network servers) contain subtle memory corruption bugs (buffer overflows, use-after-free, null pointer dereferences). Manual code auditing misses obscure edge cases that automated fuzzers can discover in hours.",
      outcome: "A working coverage-guided binary fuzzer in C/Rust that instruments target programs, detects new branch transitions via a 64KB shared memory bitmap, mutates test inputs genetically, and deduplicates crash dumps.",
      stack: ["C / Rust", "LLVM Sanitizer Coverage (SanitizerCoverage)", "Linux Shared Memory (shmget)", "Genetic Mutation Algorithms"],
      diagram:
"Seed Input Corpus (e.g. valid 'test.png' file)\n                     │\n                     ▼\n┌────────────────────────────────────────┐\n│ Mutation Engine (Bit Flips, Arithmetic,│\n│ Byte Swaps, Block Deletion, Dictionary)│\n└────────────────────┬───────────────────┘\n                     ▼\n┌────────────────────────────────────────┐\n│ Fork Server: Executes Mutated Input    │ ──► Target Program Instrumented with LLVM\n└────────────────────┬───────────────────┘\n                     ▼\n┌────────────────────────────────────────┐\n│ 64KB Shared Memory Edge Coverage Map   │\n│ virgin_bits[cur_location ^ (prev >> 1)]│\n└────────────────────┬───────────────────┘\n                     │\n     ┌───────────────┴───────────────┐\n     │ New Code Path Discovered!     │ Crash / Segmentation Fault Detected (SIGSEGV)\n     ▼                               ▼\n┌─────────────────────────────┐ ┌──────────────────────────────────────┐\n│ Save to Corpus Queue for    │ │ Save Input as Reproducible Exploit   │\n│ Further Recursive Mutation  │ │ Deduplicate by Crash Stack Trace     │\n└─────────────────────────────┘ └──────────────────────────────────────┘",
      steps: [
        { title: "Phase 1: High-Speed Fork Server & Shared Memory", desc: "Build a Linux fork server using `fork()` and pipes to avoid `execve()` process startup overhead, testing 5,000+ executions per second." },
        { title: "Phase 2: Compiler Instrumentation & 64KB Bitmap", desc: "Write an LLVM pass or GCC wrapper that injects edge-recording code at every conditional branch, updating a 64KB shared memory coverage bitmap (`shmat`)." },
        { title: "Phase 3: Genetic Mutation Operators", desc: "Implement mutation operators: deterministic bit flips, byte addition/subtraction, interesting integer replacements (0, MAX_INT, -1), and random crossover splice mutations." },
        { title: "Phase 4: Crash Triaging & GDB Deduplication", desc: "Capture crashes (SIGSEGV, SIGABRT, ASan alerts). Compute unique crash signatures by hashing GDB stack trace frames to deduplicate unique root causes." }
      ],
      resources: [
        { title: "American Fuzzy Lop (AFL) Technical Whitepaper (Michał Zalewski)", url: "https://lcamtuf.coredump.cx/afl/technical_details.txt" },
        { title: "LLVM SanitizerCoverage Documentation", url: "https://clang.llvm.org/docs/SanitizerCoverage.html" },
        { title: "The Fuzzing Book: Tools and Techniques for Software Testing", url: "https://www.fuzzingbook.org/" }
      ],
      pitfalls: [
        "Do not spawn a fresh process using `execve()` on every iteration; the exec syscall overhead drops throughput by 95%. Use a Persistent Fork Server.",
        "Ensure fuzzer test inputs are constrained by strict execution timeout limits (e.g. 50ms) to prevent infinite loop inputs from stalling the fuzzer."
      ],
      interview: [
        "How does Coverage-Guided Fuzzing differ from Black-Box and Generative Grammar Fuzzing?",
        "Explain how the AFL 64KB shared memory bitmap calculates edge transitions $(A \\to B)$ without hash collisions."
      ]
    },
    {
      id: "kernel-rootkit-detector",
      title: "Linux Kernel Rootkit Detector & Syscall Integrity Scanner",
      domain: "security",
      difficulty: "advanced",
      year: "4th Year (Final Year Capstone)",
      time: "4–6 weeks",
      tagline: "Detect stealth kernel rootkits, hooked system call tables, and hidden processes in C/Linux kernel space.",
      problem: "Sophisticated advanced persistent threats (APTs) install Loadable Kernel Modules (LKMs) that hook the OS system call table, hiding malicious processes from `ps`, concealing files from `ls`, and intercepting network traffic invisibly from userspace tools.",
      outcome: "A security kernel module and userspace scanner that verifies kernel text section checksums, inspects the System Call Table for unauthorized pointer modifications, and uncovers hidden processes via brute-force PID checking.",
      stack: ["C (Linux Kernel Module LKM)", "Linux Syscall Table (sys_call_table)", "Kprobes / ftrace", "Memory Forensics"],
      diagram:
"Userspace Process calls: getdents64() (List Directory Contents)\n                           │\n                           ▼\n══════════════════════════════════════════════════════════ [ Linux Kernel Space ]\n┌────────────────────────────────────────────────────────┐\n│ Rootkit Hooked Syscall: sys_call_table[__NR_getdents64]│ (Points to Malicious LKM Memory!)\n│ Filters out rootkit files like '/var/malware/'         │\n└──────────────────────────┬─────────────────────────────┘\n                           │\n┌──────────────────────────┴─────────────────────────────┐\n│ Integrity Scanner Kernel Sentinel                      │\n│ 1. Resolves true kernel address from /boot/System.map  │\n│ 2. Compares: Current Pointer vs Clean Kernel Text Hash │\n│ 3. Flags: UNEXPECTED SYSCALL HOOK at __NR_getdents64!  │\n│ 4. Scans kernel task_struct linked list vs scheduler   │\n│    to detect hidden unlinked processes!                │\n└────────────────────────────────────────────────────────┘",
      steps: [
        { title: "Phase 1: Linux Kernel Module (LKM) Development", desc: "Build a safe LKM using `kallsyms_lookup_name` to locate core kernel symbols (`sys_call_table`, `init_task`)." },
        { title: "Phase 2: Syscall Table Pointer Verification", desc: "Read `/boot/System.map` or `/proc/kallsyms` to determine original symbol addresses. Compare live `sys_call_table` function pointers against valid kernel code bounds (`_stext` to `_etext`)." },
        { title: "Phase 3: Hidden Process Detection (DKOM)", desc: "Detect Direct Kernel Object Manipulation (DKOM): traverse the kernel's circular `tasks` list (`task_struct->tasks`) and compare against the scheduler's active CPU runqueues to find unlinked stealth processes." },
        { title: "Phase 4: Netfilter Hook & Kernel Module Verification", desc: "Inspect Netfilter packet hook chains (`nf_hooks`) for unauthorized packet sniffers and scan `/proc/modules` against the kernel internal `modules` list." }
      ],
      resources: [
        { title: "The Linux Kernel Module Programming Guide", url: "https://sysprog21.github.io/lkmpg/" },
        { title: "A Guide to Kernel Exploitation: Attacking the Core (Perla & Oldani)", url: "https://www.sciencedirect.com/book/9781597494861/a-guide-to-kernel-exploitation" },
        { title: "Volatileship: Volatility Memory Forensics Framework", url: "https://www.volatilityfoundation.org/" }
      ],
      pitfalls: [
        "Modifying or accessing kernel page tables without disabling write protection (`CR0` register or `set_memory_rw`) will trigger immediate kernel panics.",
        "Ensure memory scanning code holds appropriate read locks (`rcu_read_lock()` / `tasklist_lock`) when traversing process trees to prevent race conditions during process termination."
      ],
      interview: [
        "How do kernel rootkits use Direct Kernel Object Manipulation (DKOM) to hide processes from `ps` and `/proc`?",
        "Explain how ftrace-based syscall hooking operates in modern Linux kernels."
      ]
    },
    {
      id: "automated-ddos-mitigation-xdp",
      title: "eBPF/XDP High-Speed DDoS Mitigation & SYN Flood Shield",
      domain: "security",
      difficulty: "advanced",
      year: "4th Year (Final Year Capstone)",
      time: "6–8 weeks",
      tagline: "Drop 10,000,000 malicious DDoS packets per second at the network driver layer using eBPF and XDP SYN cookies.",
      problem: "Massive Distributed Denial of Service (DDoS) volumetric attacks (SYN floods, UDP amplification, HTTP floods) exhaust operating system socket buffers, CPU interrupts, and conntrack tables before user applications can even inspect the packets.",
      outcome: "A high-performance eBPF / XDP network defense system running directly in the network card driver that drops malicious packets in sub-microsecond time, sustaining wire-speed 10Gbps traffic without host CPU degradation.",
      stack: ["C (eBPF / XDP)", "Linux Kernel Network Stack", "Go (Cilium ebpf)", "XDP SYN Cookies (XDP_TX / XDP_DROP)"],
      diagram:
"Incoming 10Gbps DDoS Attack (14,000,000 Packets / Second)\n                         │\n                         ▼\n┌────────────────────────────────────────────────────────┐\n│ Network Interface Card (NIC) Driver RX Queue           │\n└────────────────────────┬───────────────────────────────┘\n                         ▼\n┌────────────────────────────────────────────────────────┐\n│ eBPF / XDP (eXpress Data Path) Hook (Kernel Driver)    │\n│ • Runs BEFORE Linux socket allocation or conntrack!    │\n└────────────────────────┬───────────────────────────────┘\n                         │\n         ┌───────────────┴───────────────┐\n         ▼                               ▼\n┌─────────────────────────────────┐ ┌─────────────────────────────────┐\n│ Malicious SYN Flood / IP Blacklist│ Valid Legitimate User Traffic   │\n│ Computes XDP SYN Cookie in XDP  │ Passes verification filter      │\n│ Return XDP_DROP (<0.1 µs!)      │ Return XDP_PASS                 │\n│ Discards 10M+ packets/sec with  │ Packet forwarded to normal      │\n│ ZERO CPU Interrupt Overhead!    │ Linux network stack (Nginx/App) │\n└─────────────────────────────────┘ └─────────────────────────────────┘",
      steps: [
        { title: "Phase 1: eBPF XDP Driver Hook Setup", desc: "Write C programs using `bpf_endian` headers. Attach the program to the network card driver using `XDP_FLAGS_DRV_MODE` for native driver-layer execution." },
        { title: "Phase 2: XDP SYN Cookie Authentication", desc: "Implement stateless SYN Cookies entirely inside the XDP program: respond with a forged `SYN-ACK` packet (`XDP_TX`) without allocating any TCP socket state in memory." },
        { title: "Phase 3: In-Memory BPF Bloom Filter & Rate Limiter", desc: "Use BPF LRU Hash Maps and Bloom Filters to track per-IP packet rates, automatically dropping offending subnets with `XDP_DROP` when thresholds are exceeded." },
        { title: "Phase 4: Userspace Telemetry & Attack Mitigation UI", desc: "Build a Go userspace daemon that streams BPF map drop counters to Grafana, displaying live attack mitigation throughput in real time." }
      ],
      resources: [
        { title: "Cloudflare: L4Drop and XDP-based DDoS Mitigation Architecture", url: "https://blog.cloudflare.com/how-to-drop-10-million-packets/" },
        { title: "The eXpress Data Path (XDP): Fast Programmable Packet Processing in the Linux Kernel (ACM CoNEXT)", url: "https://dl.acm.org/doi/10.1145/3281411.3281443" },
        { title: "Biman et al. — XDP SYN Cookies: A Defense Against Volumetric TCP SYN Floods", url: "https://www.kernel.org/doc/html/latest/networking/net_dim.html" }
      ],
      pitfalls: [
        "Avoid using standard BPF Hash Maps for high-volume untrusted IP keys; map collisions and table filling can exhaust kernel memory. Use BPF LRU (Least Recently Used) maps.",
        "Ensure XDP packet pointer bounds checks (`data + sizeof(struct ethhdr) > data_end`) are strictly verified on every header access, otherwise the BPF verifier will reject the kernel program."
      ],
      interview: [
        "Why does XDP (eXpress Data Path) achieve 10x higher packet drop throughput than iptables or userspace firewalls?",
        "How do stateless SYN Cookies operate at the transport layer to prevent server connection table exhaustion?"
      ]
    }
  ]);
})(window.TD = window.TD || {});
