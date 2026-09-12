(function (TD) {
  "use strict";
  TD.depth = (TD.depth || []).concat([
    {
      slug: "encoding",
      why: {
        before: "Early computer architectures represented text using proprietary, incompatible byte mappings (ASCII, EBCDIC, ISO-8859-1), corrupting characters as soon as files moved between different operating systems.",
        problem: "Text was ruined by the 'mojibake' phenomenon: non-English alphabets, mathematical symbols, and emojis were corrupted into unreadable gibberish, and binary data broke text-only transmission channels.",
        shift: "Standardized encoding systems (UTF-8, Unicode, Percent-Encoding) establish unambiguous, universal mathematical mappings between abstract symbols/bytes and their digital binary representations."
      },
      num: {
        t: "Encoding Schemes, Byte Mechanics, and Transformation Spaces",
        h: ["Encoding Standard", "Code Space / Unit", "Byte Length", "Backward Compatibility", "Primary Domain"],
        r: [
          ["ASCII", "7-bit ($0$ to $127$)", "1 byte (Top bit zero)", "Universal baseline", "Legacy teleprinters, base terminal escape codes"],
          ["UTF-8 (RFC 3629)", "Variable-length Unicode ($U+0000$ to $U+10\\text{FFFF}$)", "1 to 4 bytes per code point", "100% backward compatible with ASCII", "Modern web standard (HTML, JSON, source code, APIs)"],
          ["UTF-16", "16-bit code units + surrogate pairs", "2 or 4 bytes", "Incompatible with ASCII", "Java, JavaScript, C# in-memory string representations"],
          ["URL / Percent-Encoding (RFC 3986)", "ASCII characters ($[a\\text{-}z0\\text{-}9]$) + %XX", "Variable", "ASCII subset", "HTTP URI paths, query strings, form payloads"],
          ["HTML Entity Encoding", "&name; or &#xHH; character references", "Variable text", "ASCII text representation", "Sanitizing user inputs to prevent Cross-Site Scripting (XSS)"]
        ],
        n: "Encoding is a deterministic, reversible bijection between an abstract set of symbols $S$ and a digital representation space $B \\subset \\{0,1\\}^*$: $f: S \\leftrightarrow B$, requiring zero private secret keys. Unicode establishes a universal character set mapping $>149,000$ characters to integer code points ranging from $U+0000$ to $U+10\\text{FFFF}$. UTF-8 is an ingenious variable-length encoding: standard 7-bit ASCII characters ($0-127$) are encoded as single identical bytes (leading bit `0xxxxxxx`). Higher code points are distributed across $2$, $3$, or $4$ bytes prefixed by continuation bits (`110xxxxx`, `1110xxxx`, `11110xxx` followed by `10xxxxxx`), guaranteeing that an ASCII byte can never appear inside a multi-byte sequence, eliminating byte-boundary framing errors."
      },
      miss: [
        {
          w: "Encoding, encryption, and hashing are interchangeable terms for protecting digital data.",
          r: "Encoding transforms data formats for compatibility using public algorithms with zero security; encryption transforms data for confidentiality using secret keys; hashing generates irreversible fixed-size digests."
        },
        {
          w: "One character in a modern programming language string always equals exactly one byte in memory.",
          r: "In UTF-8, a single character or emoji can occupy 1, 2, 3, or 4 bytes; in Unicode, complex glyphs (like flags or family emojis) combine multiple code points and can consume over 20 bytes."
        },
        {
          w: "Encoding user-provided HTML inputs is unnecessary if your database uses UTF-8.",
          r: "UTF-8 merely stores text correctly; HTML entity encoding (e.g., converting `<` to `&lt;`) is mandatory to prevent browsers from executing user input as malicious executable JavaScript (XSS)."
        },
        {
          w: "You can safely calculate the true human-visible length of a string using `string.length` in JavaScript.",
          r: "JavaScript's `string.length` counts 16-bit UTF-16 code units, not Unicode code points or visible grapheme clusters; an emoji like '👩‍🚀' has a length of 5 in JavaScript."
        }
      ],
      trade: {
        buys: [
          "Universal internationalization: supports every human language, symbol set, and emoji seamlessly.",
          "Corruption-free transmission: prevents 'mojibake' and framing crashes across heterogeneous networks.",
          "Backward compatibility: UTF-8 preserves 100% compatibility with legacy 7-bit ASCII tools and protocols.",
          "Security enforcement: context-aware encoding (HTML, URL) forms the primary defense against injection attacks."
        ],
        costs: [
          "String indexing complexity: finding the $i$-th visible character in UTF-8 requires $O(N)$ byte scanning.",
          "Memory and bandwidth expansion when storing Asian scripts in UTF-8 (which use 3 bytes per character).",
          "Security vulnerabilities if applications mix different character encodings or misinterpret byte lengths.",
          "Visual confusion from homoglyph attacks (e.g., Cyrillic 'а' visually spoofing Latin 'a' in phishing URLs)."
        ],
        avoid: [
          "Using non-UTF-8 character encodings (like ISO-8859-1 or Windows-1252) in modern web applications.",
          "Assuming `string.length` represents the number of human-visible letters in international text.",
          "Trusting raw client strings without applying HTML entity encoding before rendering into web pages.",
          "Manually implementing custom string encoding functions instead of using vetted standard libraries."
        ]
      }
    },
    {
      slug: "filtering",
      why: {
        before: "Applications queried entire database tables into server RAM and used procedural loops to iterate over thousands of rows, discarding irrelevant records in application memory.",
        problem: "In-memory filtering saturated server RAM, overwhelmed network links with gigabytes of discarded data, caused full database table scans, and destroyed database performance.",
        shift: "Filtering pushes data predicates down to the earliest possible architectural layer (hardware, indexes, database query engines, edge proxies), returning only the exact subset matching criteria."
      },
      num: {
        t: "Filtering Architectures, Data Structures, and Algorithmic Efficiencies",
        h: ["Filtering Tier", "Mechanism / Data Structure", "Algorithmic Complexity", "Data Transfer Overhead", "Ideal Scale"],
        r: [
          ["Database Index Scan", "B-tree / GIN / GiST index traversal", "$O(\\log N + K)$ where $K$ is matches", "Zero; only matching rows read from disk", "Millions to billions of indexed relational records"],
          ["Probabilistic Bloom Filter", "Bit array with $k$ independent hash functions", "$O(k)$ constant time membership test", "Zero disk/network; evaluates in RAM", "Ultra-fast exclusion check (e.g., 'does user exist?')"],
          ["In-Memory Stream (Array.filter)", "Linear iteration over collection", "$O(N)$ linear time in application RAM", "Severe; requires loading all $N$ records first", "Small localized datasets (< 1,000 items)"],
          ["Network Packet Filter (eBPF)", "Kernel-space bytecode execution (XDP)", "$O(1)$ packet header matching", "Zero; drops unauthorized packets at NIC driver", "Multi-gigabit DDoS mitigation and packet routing"],
          ["Edge / CDN Cache Filtering", "URL query parameter normalization", "$O(1)$ cache key hash lookup", "Zero origin server traffic", "Caching public filtered search results at edge"]
        ],
        n: "Filtering evaluates a boolean predicate $P: X \\to \\{0, 1\\}$ across a set $X$, yielding the subset $Y = \\{x \\in X \\mid P(x) = 1\\}$. The computational efficiency of filtering depends entirely on where predicate pushdown occurs. When filtering occurs at the database tier via B-tree indexing, query planners traverse balanced tree levels in $O(\\log N)$ time, avoiding full table scans. In distributed big-data systems (e.g., BigQuery, Cassandra), Bloom filters provide space-efficient probabilistic set membership tests. Given a bit array of size $m$ and $k$ hash functions, the false-positive probability after inserting $n$ elements satisfies: $p \\approx \\left(1 - e^{-kn/m}\\right)^k$. A Bloom filter guarantees zero false negatives ($x \\notin \\text{Filter} \\implies x \\notin \\text{Store}$), allowing storage engines to bypass reading entire data blocks from disk in $O(1)$ time."
      },
      miss: [
        {
          w: "Fetching all database records with `SELECT *` and filtering them with JavaScript `.filter()` is fine for small apps.",
          r: "As tables grow, fetching all rows exhausts server memory, saturates database network connections, and triggers catastrophic out-of-memory crashes; filtering must always occur inside the SQL `WHERE` clause."
        },
        {
          w: "Adding a database index automatically speeds up all possible filter queries on that column.",
          r: "Using functions or wildcards at the start of a filter (e.g., `WHERE LOWER(name) = 'alice'` or `WHERE name LIKE '%son'`) completely invalidates standard B-tree indexes, forcing slow full table scans."
        },
        {
          w: "A Bloom filter can tell you with 100% certainty that a record definitely exists in a database.",
          r: "Bloom filters are probabilistic: they have zero false negatives (if it says 'No', the record definitely does not exist), but they have a configurable rate of false positives (it may say 'Yes' when it does not)."
        },
        {
          w: "Client-side filtering in the browser is sufficient for sensitive data privacy and security.",
          r: "If sensitive records are sent over the network to the browser, any user can inspect the full raw network payload in DevTools; security and authorization filtering must strictly execute on the server."
        }
      ],
      trade: {
        buys: [
          "Massive reduction in network payload sizes and database I/O by transferring only requested data.",
          "Sub-millisecond query response times when predicates leverage B-tree, Hash, or GIN database indexes.",
          "Protects server memory from being exhausted by massive, unbounded relational dataset scans.",
          "Probabilistic filters (Bloom filters) eliminate millions of unnecessary disk reads in high-throughput engines."
        ],
        costs: [
          "Database index overhead: indexes consume significant disk space and slow down INSERT/UPDATE writes.",
          "Query planning complexity: multi-column filtering requires composite indexes aligned to query column ordering.",
          "Risk of severe slow query degradation if developers filter on un-indexed or computed columns.",
          "False-positive management complexity when utilizing probabilistic Bloom filtering layers."
        ],
        avoid: [
          "Filtering datasets in application code instead of pushing `WHERE` filters down to the SQL database engine.",
          "Applying leading wildcard queries (e.g., `LIKE '%searchTerm'`) that bypass standard B-tree indexes.",
          "Sending sensitive internal records to the frontend and relying on client-side JavaScript to hide them.",
          "Creating dozens of redundant single-column indexes instead of targeted composite indexes."
        ]
      }
    },
    {
      slug: "tcp-three-way-handshake",
      why: {
        before: "Early network protocols transmitted data packets blindly without establishing whether the recipient was powered on, listening, or ready to receive, resulting in massive silent data loss and out-of-order packets.",
        problem: "Unreliable transmission caused dropped financial records, scrambled file contents, and lack of congestion control across unstable internet routing networks.",
        shift: "The TCP three-way handshake establishes a reliable, full-duplex connection between client and server, synchronizing sequence numbers and negotiating buffer sizes before a single byte of application data is sent."
      },
      num: {
        t: "TCP Three-Way Handshake Steps, Packet Flags, and Latency Impacts",
        h: ["Step / Packet", "Source $\\to$ Target", "TCP Control Flags Set", "Sequence / Ack Numbers", "Network Latency Added"],
        r: [
          ["Step 1: SYN", "Client $\\to$ Server", "SYN = 1", "Seq = $ISN_c$ (Client Initial Sequence Number)", "0.5 Round-Trip Time (RTT)"],
          ["Step 2: SYN-ACK", "Server $\\to$ Client", "SYN = 1, ACK = 1", "Seq = $ISN_s$, Ack = $ISN_c + 1$", "0.5 RTT (Total 1.0 RTT)"],
          ["Step 3: ACK", "Client $\\to$ Server", "ACK = 1", "Seq = $ISN_c + 1$, Ack = $ISN_s + 1$", "0.0 RTT (Client can send data immediately)"],
          ["TCP Fast Open (TFO)", "Client $\\to$ Server", "SYN + TFO Cookie + Data", "Embeds initial HTTP request inside SYN packet", "Reduces handshake latency to 0 RTT on reconnect"],
          ["Connection Teardown", "Client $\\rightleftharpoons$ Server", "FIN / ACK four-way wave", "Terminates bidirectional state; enters TIME_WAIT", "Zero application latency; background cleanup"]
        ],
        n: "The Transmission Control Protocol (TCP, RFC 793) provides a reliable, ordered, error-checked stream of octets over an unreliable IP network. Connection establishment requires the three-way handshake to synchronize Initial Sequence Numbers ($ISN$) and negotiate TCP options: Maximum Segment Size (MSS), Window Scale (RFC 7323), and Selective Acknowledgment (SACK). Sequence numbers are randomized using cryptographically secure clocks to prevent TCP sequence prediction attacks. The handshake introduces an irreducible latency tax of exactly one network Round-Trip Time ($1.0\\text{ RTT}$) before application data flows: $\\text{Latency} = 2 \\times \\frac{D}{c_{\\text{fiber}}}$. In malicious environments, attackers exploit this stateful allocation via SYN Flood attacks; modern operating systems defend against this using SYN Cookies, encoding server state into $ISN_s = \\text{HMAC}(c_{\\text{IP}}, s_{\\text{IP}}, \\text{timestamp})$ to avoid allocating kernel memory until the final ACK arrives."
      },
      miss: [
        {
          w: "TCP handshakes can be completely eliminated without altering network protocols.",
          r: "TCP is stateful and requires synchronizing sequence numbers; eliminating handshake latency requires upgrading transport protocols entirely to UDP-based HTTP/3 (QUIC) or utilizing TCP Fast Open."
        },
        {
          w: "The third step of the handshake (the client's ACK) cannot carry any application data payload.",
          r: "Standard TCP allows the client to attach its first application data payload (e.g., the HTTP GET request) directly inside the packet carrying the final ACK flag, saving half a round-trip."
        },
        {
          w: "A server with high bandwidth can complete the TCP handshake faster than a slow server.",
          r: "The duration of the TCP handshake is governed by speed-of-light propagation latency (distance and fiber routing), not bandwidth; a 10 Gbps connection takes the exact same handshake time as a 10 Mbps connection."
        },
        {
          w: "Once the TCP handshake is complete, data packets are guaranteed never to be dropped.",
          r: "Packets are routinely dropped by congested intermediate routers; TCP does not prevent packet loss, but rather detects loss via timeouts/duplicate ACKs and retransmits missing segments."
        }
      ],
      trade: {
        buys: [
          "Guaranteed reliability: detects lost packets and automatically retransmits them until verified.",
          "Ordered byte delivery: reassembles out-of-order IP packets into their exact sequential stream.",
          "Congestion control: algorithms (BBR, CUBIC) prevent senders from overwhelming the network infrastructure.",
          "Flow control: sliding windows prevent fast senders from overflowing slow receiver socket memory buffers."
        ],
        costs: [
          "Mandatory 1.0 RTT latency penalty before application data (e.g., HTTP request) can be received by server.",
          "Head-of-line blocking: a single dropped packet stalls the delivery of all subsequent packets in the stream.",
          "Vulnerability to SYN Flood denial-of-service attacks if OS kernel lacks SYN cookie protections.",
          "Server kernel memory overhead: maintaining thousands of open TCP socket control blocks (TCBs)."
        ],
        avoid: [
          "Opening fresh TCP connections for every single HTTP request (use HTTP/1.1 Keep-Alive or HTTP/2 multiplexing).",
          "Leaving TCP SYN cookies disabled on internet-facing Linux production servers.",
          "Ignoring geographically distant RTT latencies when designing chatty, multi-request mobile APIs.",
          "Tearing down TCP sockets aggressively, causing socket churn and local port exhaustion in TIME_WAIT."
        ]
      }
    },
    {
      slug: "dns-resolution",
      why: {
        before: "Early internet users manually maintained a local text file (`hosts.txt`) on their computers containing the static IP addresses of every computer on the ARPANET, manually updating it via FTP.",
        problem: "As the internet grew to thousands of machines, centralized flat files collapsed under naming conflicts, human error, inability to scale, and immediate obsolescence when IP addresses changed.",
        shift: "The Domain Name System (DNS) establishes a globally distributed, hierarchical, cached database that translates human-friendly domain names (like `example.com`) into machine routable IP addresses."
      },
      num: {
        t: "DNS Resolution Hierarchy, Query Steps, and Record Types",
        h: ["Resolution Step / Server", "Hierarchical Tier", "Role / Authority", "Typical Record Type", "Caching TTL Strategy"],
        r: [
          ["Local OS / Browser Cache", "Client Hardware", "Instant local memory lookup", "A / AAAA (IPv4 / IPv6)", "Cached based on record TTL (e.g., 60s - 3600s)"],
          ["Recursive Resolver (ISP / 8.8.8.8)", "Intermediate ISP / Public Resolver", "Executes full recursive tree walk for client", "Full DNS record payload", "Shared cache across thousands of regional users"],
          ["Root Name Server (13 clusters .)", "Global Root Zone (.)", "Directs resolver to correct Top-Level Domain", "NS record for TLD (.com, .org)", "Very long TTL (Days to weeks)"],
          ["TLD Name Server (.com / .org)", "Top-Level Domain Authority", "Directs resolver to authoritative nameserver", "NS record for specific domain", "Long TTL (1 - 2 days)"],
          ["Authoritative Name Server (Cloudflare / Route53)", "Domain Owner Authority", "Returns final authoritative IP address", "A, AAAA, CNAME, MX, TXT", "Configured by domain administrator (60s to 86400s)"]
        ],
        n: "DNS resolution is a distributed hierarchical lookup that translates a Fully Qualified Domain Name (FQDN) into an IP address. When a cache miss occurs in the local OS resolver, a recursive query is dispatched to a Recursive Resolver over UDP port 53. The resolver conducts an iterative tree traversal: (1) queries a Root Server for the Top-Level Domain (TLD), (2) queries the TLD server (e.g., `.com`) for the domain's Authoritative Name Server, and (3) queries the Authoritative Server for the final resource record (e.g., `A` record for IPv4, `AAAA` for IPv6). Security extensions (DNSSEC) protect this hierarchy against cache poisoning by cryptographically validating records using asymmetric public-key chains of trust anchored at the Root KSK (Key Signing Key)."
      },
      miss: [
        {
          w: "There are literally only 13 physical root DNS servers in the entire world.",
          r: "There are 13 logical root server IP addresses (A through M), but they are backed by thousands of physical server instances globally utilizing BGP Anycast routing for high redundancy."
        },
        {
          w: "When you update a DNS record, changing the TTL to 1 second updates all users across the world instantly.",
          r: "Setting a low TTL only takes effect after the *previous* high TTL has expired across intermediate resolver caches; furthermore, some ISP resolvers ignore low TTLs and enforce minimum cache times."
        },
        {
          w: "A CNAME record can safely be used at the apex/root of a domain (e.g., `example.com`).",
          r: "RFC specifications prohibit CNAME records at the domain apex because CNAMEs cannot coexist with required SOA and NS records; apex domains require ALIAS, ANAME, or direct A/AAAA records."
        },
        {
          w: "DNS queries are always encrypted and secure from ISP snooping by default.",
          r: "Traditional DNS operates in plain unencrypted UDP text; encryption requires modern protocols like DNS over HTTPS (DoH) or DNS over TLS (DoT) to prevent snooping and tampering."
        }
      ],
      trade: {
        buys: [
          "Human readability: replaces unmemorable numeric IP addresses with intuitive, memorable brand names.",
          "Seamless infrastructure migration: change physical server IPs or cloud providers by updating DNS records.",
          "Geographic and latency-based routing: route users to the geographically closest datacenter via Anycast DNS.",
          "High resilience and caching: global distributed caches absorb billions of queries without touching origin servers."
        ],
        costs: [
          "Initial lookup latency: an uncached cold DNS resolution can add 100-300ms to first-time page loads.",
          "Propagation delay: changes take hours to propagate globally due to distributed resolver caching.",
          "Vulnerability to DDoS attacks: attacks against primary DNS providers (e.g., the 2016 Dyn attack) can take down major web services.",
          "DNS cache poisoning vulnerabilities if DNSSEC is not properly configured."
        ],
        avoid: [
          "Configuring a CNAME record at the root apex of a domain.",
          "Lowering DNS TTL to 60 seconds during an emergency; reduce TTL days in advance before a planned migration.",
          "Relying on a single DNS provider without a secondary redundant DNS failover provider for critical systems.",
          "Hardcoding raw IP addresses into client-side code instead of using domain names."
        ]
      }
    },
    {
      slug: "ssl-certificate",
      why: {
        before: "Internet traffic traveled across networks in plain, unencrypted text; anyone on the same Wi-Fi network, ISP, or government agency could intercept passwords, read emails, and alter web page code.",
        problem: "Man-in-the-Middle (MITM) attacks were rampant: rogue actors intercepted sensitive bank credentials and injected malicious malware or ads directly into unencrypted HTTP traffic.",
        shift: "An SSL/TLS certificate provides a cryptographically signed digital identity document that binds a public encryption key to a domain name, enabling encrypted HTTPS connections and server authentication."
      },
      num: {
        t: "SSL/TLS Certificate Types, Validation Rigor, and Handshake Mechanics",
        h: ["Validation Tier", "Validation Mechanism", "Issuance Velocity", "Browser Indicator", "Ideal Application"],
        r: [
          ["Domain Validation (DV)", "Automated DNS / HTTP challenge (ACME / Let's Encrypt)", "Instantaneous (< 60 seconds)", "Standard HTTPS padlock / secure status", "99% of web applications, personal sites, APIs, SaaS"],
          ["Organization Validation (OV)", "Vets domain control + legal business registration documents", "1 - 3 business days", "Standard HTTPS padlock + legal name in cert", "Commercial enterprise websites, e-commerce stores"],
          ["Extended Validation (EV)", "Rigorous legal vetting, physical address, and phone check", "1 - 7 business days", "Standard padlock (EV green bar deprecated)", "High-profile financial institutions, government portals"],
          ["Wildcard Certificate (*.domain.com)", "Validates domain control for base and all subdomains", "Instant (DV) to days (OV)", "Covers *.example.com (single level only)", "Multi-tenant SaaS with custom dynamic subdomains"],
          ["Mutual TLS (mTLS) Client Cert", "Client presents client cert to server; server verifies CA", "Automated PKI issuance", "Non-browser / programmatic API", "Zero-trust service-to-service microservice mesh communications"]
        ],
        n: "An SSL/TLS certificate is an X.509 digital certificate formatted per RFC 5280. It binds an identity (Subject Alternative Name, or SAN) to a public key (RSA or ECDSA) via a cryptographic digital signature: $\\text{Signature} = \\text{Sign}_{K_{\\text{CA}}}(\\text{CertData})$. Trust is established through a hierarchical Chain of Trust: the Leaf Certificate points to an Intermediate Certificate Authority (ICA), which anchors to a Root CA pre-installed in the operating system or browser's trusted root trust store. During the TLS 1.3 handshake, the server presents this chain; the client verifies each signature: $V(K_{\\text{parent}}, \\text{Cert}_{\\text{child}}) \\equiv \\text{True}$. Modern issuance is fully automated via the ACME protocol (RFC 8555) popularized by Let's Encrypt, which validates control via HTTP-01 or DNS-01 challenges, terminating the era of expensive manual certificate purchases."
      },
      miss: [
        {
          w: "An expensive $500 Extended Validation (EV) certificate provides stronger mathematical encryption than a free Let's Encrypt certificate.",
          r: "All valid SSL certificates provide the exact same AES-256 or ChaCha20 encryption strength; the price difference reflects only manual corporate identity verification paperwork, not encryption quality."
        },
        {
          w: "A wildcard certificate for `*.example.com` automatically covers nested subdomains like `app.sub.example.com`.",
          r: "Wildcards match strictly a single subdomain level; `*.example.com` covers `api.example.com` but will fail with an SSL security warning on `dev.api.example.com`."
        },
        {
          w: "Once you install an SSL certificate, your website is completely immune to hacking.",
          r: "SSL/TLS encrypts only data in transit over the network; it does not protect against SQL injection, XSS attacks, server vulnerabilities, or compromised database passwords."
        },
        {
          w: "Renewing an SSL certificate is a manual task that system administrators must do once a year.",
          r: "Modern production infrastructure uses automated ACME certificate managers (Certbot, cert-manager for Kubernetes, Cloudflare, Caddy) that automatically renew 90-day certificates without human intervention."
        }
      ],
      trade: {
        buys: [
          "Complete confidentiality: encrypts passwords, financial transactions, and user data against eavesdropping.",
          "Guaranteed integrity: ensures network intermediaries cannot tamper with or inject ads into web traffic.",
          "Authenticity: cryptographically proves the user is connected to the genuine server, preventing MITM phishing.",
          "Mandatory requirement for modern browser features (HTTP/2, HTTP/3, Service Workers, Geolocation)."
        ],
        costs: [
          "Operational risk of catastrophic outages if certificate renewal automation fails and certs expire.",
          "Computational overhead of asymmetric cryptography handshakes (drastically reduced in TLS 1.3).",
          "Initial TLS handshake round-trip latency penalty on cold connections.",
          "Complexity of managing private key rotation and security across distributed cluster infrastructure."
        ],
        avoid: [
          "Allowing production SSL certificates to expire, instantly breaking the application for all users.",
          "Committing private certificate keys (`privkey.pem`) into public or private Git repositories.",
          "Purchasing expensive manual certificates when automated Let's Encrypt or cloud-managed certs suffice.",
          "Using self-signed certificates in production environments (which trigger terrifying browser security warnings)."
        ]
      }
    },
    {
      slug: "hashing-vs-encryption",
      why: {
        before: "Developers confused hashing and encryption, using reversible encryption algorithms to store passwords or using one-way hashes to store data they needed to read back later.",
        problem: "Encrypting passwords allowed attackers who breached the database and stole the key to decrypt every user password instantly, while hashing sensitive customer data made it permanently unrecoverable.",
        shift: "Hashing is a one-way, irreversible mathematical transformation used for verification and integrity; encryption is a two-way, reversible mathematical transformation requiring a secret key to ensure confidentiality."
      },
      num: {
        t: "Hashing vs Encryption Architectural, Cryptographic, and Operational Comparison",
        h: ["Dimension", "Cryptographic Hashing", "Symmetric Encryption", "Asymmetric Encryption", "Primary Application"],
        r: [
          ["Reversibility", "Irreversible (One-way: $y = H(x)$)", "Reversible with secret key ($m = D_k(c)$)", "Reversible with private key ($m = D_{K_{\\text{priv}}}(c)$)", "Hashing: verification; Encryption: confidentiality"],
          ["Key Requirement", "None (or fixed HMAC key)", "Single shared secret key ($K$)", "Key pair: Public key ($K_{\\text{pub}}$) + Private key ($K_{\\text{priv}}$)", "Hashing is keyless; encryption is key-dependent"],
          ["Output Length", "Fixed digest length (e.g., 256 bits)", "Proportional to input plaintext length", "Proportional to input (bounded by key size)", "Hashing: deterministic fixed fingerprints"],
          ["Computation Speed Target", "Fast (SHA-256) OR Intentionally Slow (Argon2id)", "Extremely Fast (AES-NI hardware accelerated)", "Computationally heavy / slow", "Password storage requires slow, memory-hard hashes"],
          ["Canonical Algorithms", "Argon2id, bcrypt, SHA-256, BLAKE3", "AES-256-GCM, ChaCha20-Poly1305", "RSA-4096, ECDSA, X25519", "Store passwords with Argon2; encrypt PII with AES"]
        ],
        n: "The theoretical boundary between hashing and encryption is reversibility and information theory. A cryptographic hash function is a one-way pre-image resistant mapping $H: \\{0,1\\}^* \\to \\{0,1\\}^n$ that compresses arbitrary-length inputs into a fixed $n$-bit digest. Because the input space is infinite and the output space is finite, collisions mathematically exist (by the Pigeonhole Principle), making inverse reconstruction impossible. Conversely, encryption is a family of bijective permutations parametrized by a key: $E: \\mathcal{K} \\times \\mathcal{M} \\to \\mathcal{C}$, such that $\\forall m \\in \\mathcal{M}, D_k(E_k(m)) = m$. For password storage, algorithms like SHA-256 are dangerous because modern GPUs can compute $>10^{11}$ hashes per second; production systems mandate slow, memory-hard algorithms (Argon2id, bcrypt) with adaptive work factors to mathematically neutralize brute-force ASIC attacks."
      },
      miss: [
        {
          w: "Hashing user passwords with SHA-256 or MD5 is secure for modern production applications.",
          r: "Fast hashing algorithms (MD5, SHA-1, SHA-256) are completely broken for password storage; consumer GPUs calculate billions of SHA-256 hashes per second; passwords require slow, memory-hard hashes (Argon2id, bcrypt)."
        },
        {
          w: "If you lose the secret key used to encrypt a database column, you can recover the data by hacking it.",
          r: "Modern encryption (like AES-256) is mathematically unbreakable without the key; losing the decryption key means the ciphertext is permanently unrecoverable, random mathematical noise forever."
        },
        {
          w: "Salted hashes can be decrypted if you know the salt value.",
          r: "Salts do not make hashes reversible; salts are public random strings added to passwords before hashing to defeat precomputed rainbow table attacks and ensure two users with identical passwords have different hashes."
        },
        {
          w: "Base64 encoding is an acceptable, lightweight form of encryption for non-sensitive data.",
          r: "Base64 has zero cryptographic properties and requires no key; it is a public encoding format that can be reversed by anyone in a millisecond."
        }
      ],
      trade: {
        buys: [
          "Hashing: enables zero-knowledge password authentication (servers verify passwords without ever knowing them).",
          "Hashing: provides tamper-evident integrity checks (checksums) for software downloads and Git commits.",
          "Encryption: ensures absolute confidentiality of sensitive data at rest and in transit.",
          "Clear architectural boundaries prevent catastrophic security vulnerabilities caused by misapplying primitives."
        ],
        costs: [
          "Key management burden: encryption requires secure KMS vaults, key rotation, and strict access controls.",
          "CPU overhead: slow password hashing (Argon2id) consumes intentional memory and CPU to resist brute force.",
          "Irreversible data loss: losing an encryption key permanently destroys the encrypted data.",
          "Searching encrypted data: database columns encrypted with random IVs cannot be queried using standard SQL."
        ],
        avoid: [
          "Storing user passwords using reversible encryption instead of salted one-way hashes.",
          "Using fast general-purpose hashes (MD5, SHA-1, SHA-256) for password storage.",
          "Hardcoding symmetric encryption keys directly inside application source code repositories.",
          "Attempting to design custom, home-grown encryption or hashing algorithms."
        ]
      }
    },
    {
      slug: "load-balancing",
      why: {
        before: "Applications ran on a single monolithic web server; when traffic surged, the server crashed from CPU exhaustion, and when the hardware died, the entire business went offline.",
        problem: "A single server established a single point of failure (SPOF), could not scale beyond physical hardware limits, and suffered catastrophic downtime during maintenance and updates.",
        shift: "A load balancer distributes incoming network traffic across a pool of backend servers, optimizing resource utilization, eliminating single points of failure, and enabling seamless horizontal scaling."
      },
      num: {
        t: "Load Balancer OSI Layers, Dispatch Algorithms, and Routing Architectures",
        h: ["Load Balancer Model", "OSI Layer", "Routing Intelligence", "Performance / Throughput", "Canonical Technology"],
        r: [
          ["Layer 4 (Transport / NLB)", "Layer 4 (TCP / UDP)", "Routes on IP address & TCP port only (No payload inspection)", "Blazing fast; millions of packets/sec with near-zero latency", "AWS Network Load Balancer (NLB), Linux IPVS, HAProxy (TCP mode)"],
          ["Layer 7 (Application / ALB)", "Layer 7 (HTTP / gRPC / TLS)", "Routes on URL path, HTTP headers, cookies, host headers", "Moderate; decrypts TLS and parses HTTP headers", "AWS Application Load Balancer (ALB), NGINX, Envoy Proxy, Traefik"],
          ["Round Robin", "L4 or L7", "Sequentially rotates requests: $i = (i + 1) \\pmod N$", "Zero computation overhead", "Homogeneous servers with uniform request processing durations"],
          ["Weighted Least Connections", "L4 or L7", "Routes to server with fewest active connections $\\min(\\frac{C_i}{W_i})$", "Prevents server overload", "Long-lived connections, database pools, variable-duration requests"],
          ["Consistent Hashing", "L7", "Hashes request key (user ID) onto hash ring", "Minimal cache churn on server additions", "Distributed caching tiers, stateful session routing, WebSockets"]
        ],
        n: "Load balancing distributes incoming traffic across a set of $N$ servers. Layer 4 load balancers operate at the transport tier without inspecting application payloads: packet routing occurs via Direct Server Return (DSR) or Network Address Translation (NAT) at wirespeed. Layer 7 load balancers terminate TLS handshakes and parse HTTP protocol frames, allowing sophisticated content-based routing (e.g., routing `/api/v1/checkout` to a dedicated checkout service). In caching tiers, consistent hashing organizes servers on a hash ring modulo $2^{32}-1$. When a backend server is added or removed, consistent hashing mathematically guarantees that only $\\frac{K}{N}$ keys must be remapped (where $K$ is total keys and $N$ is server count), avoiding catastrophic cache stampedes."
      },
      miss: [
        {
          w: "A load balancer makes individual slow database queries execute faster.",
          r: "A load balancer distributes query volume across multiple servers to prevent queueing; it does not accelerate the execution speed of an individual slow un-indexed query."
        },
        {
          w: "Round Robin is always the best load balancing algorithm for all web applications.",
          r: "Round Robin assumes every request takes the exact same amount of time to process; if some requests take 10 seconds and others take 5ms, Round Robin will overload servers; Least Connections is far more resilient."
        },
        {
          w: "A load balancer completely eliminates all possibility of system downtime.",
          r: "The load balancer itself can become a single point of failure if not deployed in an active-passive or active-active redundant pair with DNS failover."
        },
        {
          w: "Layer 7 load balancers are always superior to Layer 4 load balancers.",
          r: "Layer 7 balancers parse full HTTP text and decrypt TLS, adding latency and CPU overhead; high-performance protocols and raw TCP gaming/streaming backends rely on ultra-fast Layer 4 balancers."
        }
      ],
      trade: {
        buys: [
          "Eliminates single points of failure: automatically routes traffic away from unhealthy or crashed servers.",
          "Enables seamless horizontal scaling: add or remove backend servers dynamically based on real-time load.",
          "Zero-downtime rolling deployments: take servers offline for updates sequentially without dropping traffic.",
          "Centralized TLS termination, DDoS protection, and SSL certificate management at the edge."
        ],
        costs: [
          "Additional infrastructure cost for redundant load balancer appliances or managed cloud balancers.",
          "Introduces an extra network hop, adding minor latency (~1-5ms) to overall request durations.",
          "Configuration complexity: health check tuning, session persistence (sticky sessions), and connection draining.",
          "Can become an architectural bottleneck if load balancer capacity limits are reached."
        ],
        avoid: [
          "Configuring shallow health checks (e.g., pinging a static text file) that pass even when the database is down.",
          "Setting health check thresholds so aggressively that transient network blips cause all servers to be marked dead.",
          "Terminating servers during deployment without allowing connection draining for active in-flight requests.",
          "Relying on a single load balancer instance without high-availability failover."
        ]
      }
    }
  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
