(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([
    {
      slug: "http",
      why: {
        before: "In the late 1980s, document and file retrieval across networked computers relied on fragmented, specialized protocols like FTP, Gopher, NNTP, or raw Telnet terminal sessions.",
        problem: "Existing protocols were stateful, lacked support for embedded multimedia, had no standardized document hyperlinking syntax, and required specialized client software that could not render distributed hypertext across heterogeneous operating systems.",
        shift: "Tim Berners-Lee created HTTP (Hypertext Transfer Protocol, formalized in HTTP/1.0 RFC 1945 and HTTP/1.1 RFC 2616 / RFC 9110), establishing an open, stateless, text-based request-response protocol based on standard uniform resource identifiers (URIs), extensible headers, status codes, and MIME-typed payload bodies."
      },
      num: {
        t: "HTTP Protocol Generation & Architectural Evolution",
        h: ["Protocol Version", "Transport Layer", "Wire Framing & Syntax", "Connection Concurrency", "Header Compression"],
        r: [
          ["HTTP/0.9 (1991)", "Raw TCP stream", "Raw ASCII string ('GET /path\\r\\n'); zero headers", "Single request per TCP connection; server closes immediately", "None (no headers existed)"],
          ["HTTP/1.0 (1996)", "Raw TCP stream", "Text headers separated by CRLF; status codes", "Single request per TCP connection (Connection: close default)", "None; headers sent in full plaintext"],
          ["HTTP/1.1 (1997 / 1999)", "Persistent TCP stream", "ASCII text headers; Chunked Transfer Encoding", "Persistent connections (Keep-Alive default); pipelining (broken)", "None; redundant plaintext headers on every request"],
          ["HTTP/2 (2015)", "Single TCP stream", "Binary framing layer (DATA, HEADERS frames)", "Full bidirectional stream multiplexing on single TCP connection", "HPACK (Static/dynamic lookup tables + Huffman coding)"],
          ["HTTP/3 (2022)", "QUIC over UDP", "Binary framing over independent QUIC streams", "Full multiplexing without transport-level Head-of-Line blocking", "QPACK (Out-of-order header compression tables)"]
        ],
        n: "HTTP/1.1 operates as a plaintext, ASCII-encoded request-response protocol running over TCP. An HTTP request begins with a Request Line containing the HTTP Method (GET, POST, PUT, DELETE, etc.), the Request URI, and the Protocol Version (HTTP/1.1), terminated by CRLF (\\r\\n). Subsequent header fields consist of case-insensitive key-value pairs formatted as 'Header-Name: Value\\r\\n'. The header section terminates with an empty CRLF line, followed immediately by the optional message payload body. For dynamic responses where total content length is unknown at transmission time, HTTP/1.1 provides Chunked Transfer Encoding (Transfer-Encoding: chunked), streaming data in discrete hex-length chunks terminated by a zero-length chunk (0\\r\\n\\r\\n). While HTTP/1.1 introduced persistent TCP connections (Connection: keep-alive) to eliminate the overhead of repeated TCP three-way handshakes, it suffers from fundamental Application-Level Head-of-Line (HoL) Blocking: requests and responses on a single TCP connection must be processed in strict FIFO order, forcing web browsers to open up to 6 concurrent TCP connections per domain to load web assets in parallel."
      },
      miss: [
        {
          w: "HTTP is a connection-oriented protocol that maintains persistent session state internally.",
          r: "HTTP is fundamentally stateless; every request-response cycle is independent. Persistent state is maintained entirely at the application layer using HTTP cookies, authorization headers, or server-side session stores."
        },
        {
          w: "HTTP pipelining is widely used in modern browsers to achieve fast multiplexed HTTP/1.1 loading.",
          r: "HTTP/1.1 pipelining was disabled by default in virtually all browsers because buggy intermediary proxies and routers frequently returned responses out of order or hung connections due to Head-of-Line blocking."
        },
        {
          w: "The HTTP GET method cannot contain a request body according to protocol specifications.",
          r: "RFC 9110 states that a GET request can technically carry a body, but specifies that message bodies in GET requests have no defined semantics and may be rejected, ignored, or stripped by intermediate proxies and caches."
        },
        {
          w: "HTTP/1.1 keep-alive connections remain open indefinitely without resource cost.",
          r: "Keep-alive connections consume server memory, socket descriptors, and TCP buffers; servers configure strict keep-alive timeouts (e.g., 5 to 60 seconds) and maximum request limits to reclaim idle socket resources."
        }
      ],
      trade: {
        buys: [
          "Universal client-server interoperability: any programming language on any hardware can parse and generate HTTP messages.",
          "Stateless horizontal scalability: web servers can scale behind load balancers without synchronizing connection states.",
          "Rich edge caching ecosystem: standardized Cache-Control, ETag, and Last-Modified headers enable massive global CDN caching.",
          "Human-readable debugging: plaintext framing enables developers to inspect requests directly via curl, telnet, or network sniffers."
        ],
        costs: [
          "Application Head-of-Line blocking: slow responses block subsequent requests on the same HTTP/1.1 connection.",
          "Bandwidth waste from uncompressed headers: large cookies and repeated User-Agent strings consume kilobytes of redundant bandwidth.",
          "High TCP connection count: browsers open multiple parallel TCP connections per origin, saturating server socket limits.",
          "Text-parsing overhead: parsing variable-length ASCII text strings is computationally slower than processing binary protocol frames."
        ],
        avoid: [
          "Deploying high-throughput public web applications without enabling persistent connections (Keep-Alive).",
          "Sending multi-megabyte payloads in GET query parameters instead of using POST with structured JSON/Protobuf request bodies.",
          "Relying on HTTP/1.1 for mobile applications requiring dozens of simultaneous API calls (upgrade to HTTP/2 or HTTP/3).",
          "Ignoring HTTP cache validation headers (ETag, If-None-Match), forcing servers to re-transmit unchanged assets repeatedly."
        ]
      }
    },
    {
      slug: "http-2",
      why: {
        before: "Web applications running over HTTP/1.1 required dozens to hundreds of independent asset requests (HTML, CSS, JavaScript, images) to render a single modern web page.",
        problem: "Because HTTP/1.1 suffered from application Head-of-Line blocking, web browsers enforced a strict limit of 6 concurrent TCP connections per domain. Developers resorted to complex performance anti-patterns: domain sharding (cdn1, cdn2), CSS image spriting, JavaScript inlining, and file concatenation, which increased complexity and broke caching.",
        shift: "HTTP/2 (RFC 7540 / RFC 9113, derived from Google's SPDY) introduced binary framing, full bidirectional request/response multiplexing over a single TCP connection, HPACK header compression, stream prioritization, and server push."
      },
      num: {
        t: "HTTP/1.1 vs HTTP/2 Architectural & Operational Dynamics",
        h: ["Dimension / Feature", "HTTP/1.1 (RFC 9112)", "HTTP/2 (RFC 9113)", "Impact on Web Application Architecture"],
        r: [
          ["Framing & Wire Format", "Plaintext ASCII strings separated by CRLF (\\r\\n)", "Binary framing layer; typed frame structs", "Eliminates whitespace/parsing bugs; enables fast hardware parsing"],
          ["Connection Multiplexing", "None (FIFO serialization; 1 active request per socket)", "Full stream multiplexing over a single TCP connection", "Transfers dozens of assets concurrently without blocking"],
          ["Header Compression", "None (Full plaintext sent on every single request)", "HPACK compression (RFC 7541) with static/dynamic tables", "Reduces header size overhead by 80% to 90% across requests"],
          ["TCP Connections per Origin", "Multiple parallel connections (typically 6 per browser)", "Single persistent TCP connection per origin", "Eliminates redundant TCP 3-way handshakes and slow-start phases"],
          ["Asset Packaging Patterns", "Encouraged bundling, spriting, and domain sharding", "Encourages granular, modular asset delivery", "Obsoletes image sprites and massive monolithic JS bundle files"]
        ],
        n: "HTTP/2 replaces plaintext parsing with a binary framing layer. Every HTTP/2 transmission is decomposed into discrete, typed binary frames sharing a uniform 9-byte header: Length (24 bits), Type (8 bits: DATA, HEADERS, PRIORITY, RST_STREAM, SETTINGS, PUSH_PROMISE, PING, GOAWAY, WINDOW_UPDATE), Flags (8 bits, e.g., END_STREAM, END_HEADERS), and a 31-bit Stream Identifier. By tagging every frame with a Stream ID, the client and server interleave frames from dozens of independent bidirectional requests and responses simultaneously across a single TCP connection, eliminating application-level Head-of-Line blocking. Header compression is performed by HPACK (RFC 7541): the client and server maintain synchronized stateful tables (a fixed 61-entry static table of common headers like ':method: GET' and an evolving dynamic table of recently exchanged headers), encoding strings with Huffman tables to reduce hundreds of bytes of cookie and metadata overhead to single-byte indices. However, HTTP/2 introduced a new vulnerability: Transport-Level Head-of-Line Blocking. Because all multiplexed streams share a single TCP byte stream, a single dropped TCP packet causes the OS TCP stack to stall delivery of all multiplexed streams until the missing segment is retransmitted."
      },
      miss: [
        {
          w: "HTTP/2 changes the underlying HTTP semantics like methods (GET, POST), headers, and status codes.",
          r: "HTTP/2 preserves identical core HTTP semantics; only the wire framing layer is altered (converting headers and data into binary frames), meaning application code and REST APIs require zero semantic changes."
        },
        {
          w: "Asset concatenation and domain sharding are still best practices when deploying on HTTP/2.",
          r: "Domain sharding actively degrades HTTP/2 performance by forcing multiple TCP handshakes and splitting HPACK compression tables; fine-grained modular files cache far better than monolithic bundles under HTTP/2 multiplexing."
        },
        {
          w: "HTTP/2 Server Push is widely adopted and should be used to push all critical assets to clients.",
          r: "Server Push suffered from critical implementation flaws (pushing assets already cached by the browser, wasting mobile bandwidth); it was deprecated and removed from modern web standards and Chrome in favor of 103 Early Hints."
        },
        {
          w: "HTTP/2 multiplexing completely eliminates all Head-of-Line blocking across the entire network.",
          r: "HTTP/2 eliminates application Head-of-Line blocking, but remains vulnerable to TCP-level Head-of-Line blocking: a single lost IP packet stalls all multiplexed streams within that TCP connection."
        }
      ],
      trade: {
        buys: [
          "True request multiplexing: stream hundreds of images, scripts, and API calls concurrently across a single TCP socket.",
          "Massive header bandwidth reduction: HPACK compresses repetitive HTTP headers by up to 90%, speeding up mobile requests.",
          "TCP slow-start elimination: a single long-lived connection stays in the optimal congestion window, achieving maximum line throughput.",
          "Clean modular architecture: eliminates the need for build-step asset hacks like CSS image sprites and domain sharding."
        ],
        costs: [
          "TCP Head-of-Line blocking on lossy networks: 2% packet loss on Wi-Fi or cellular degrades HTTP/2 performance below HTTP/1.1.",
          "Server memory consumption: tracking HPACK dynamic compression tables and stream prioritization states consumes server memory.",
          "Loss of plaintext debuggability: raw HTTP/2 traffic cannot be inspected with simple netcat or telnet; requires Wireshark or TLS proxies.",
          "Buffer bloat and reset latency: canceling a download stream (RST_STREAM) leaves unread frames in flight across the network pipe."
        ],
        avoid: [
          "Retaining domain sharding (e.g., assets1.example.com, assets2.example.com) on HTTP/2 enabled infrastructures.",
          "Deploying HTTP/2 over plain unencrypted TCP (h2c) in production (virtually all web browsers require HTTPS/TLS for HTTP/2).",
          "Attempting to use deprecated HTTP/2 Server Push instead of modern '103 Early Hints' response headers.",
          "Running HTTP/2 without tuning server concurrent stream limits (SETTINGS_MAX_CONCURRENT_STREAMS) to prevent memory exhaustion."
        ]
      }
    },
    {
      slug: "http-3",
      why: {
        before: "HTTP/2 achieved high-performance application-level multiplexing over TCP, but was fundamentally constrained by the limitations of the underlying 1980s Transmission Control Protocol.",
        problem: "On lossy networks (such as mobile 4G/5G and congested Wi-Fi with 1–3% packet loss), TCP-level Head-of-Line blocking caused a single dropped packet to stall all multiplexed HTTP/2 streams on the connection. Furthermore, establishing a secure connection required redundant multi-round-trip handshakes (TCP + TLS 1.3 = 2 RTTs), and changing IP addresses (switching from Wi-Fi to cellular) dropped active connections.",
        shift: "HTTP/3 (RFC 9114 in 2022) completely replaced TCP with QUIC (RFC 9000), a modern user-space transport protocol running over UDP that natively integrates TLS 1.3 encryption, stream-independent multiplexing, 0-RTT connection resumption, and connection migration."
      },
      num: {
        t: "HTTP/2 (over TCP/TLS) vs HTTP/3 (over QUIC/UDP)",
        h: ["Architectural Dimension", "HTTP/2 (over TCP + TLS)", "HTTP/3 (over QUIC + UDP)", "Operational Performance Impact"],
        r: [
          ["Transport Protocol", "TCP (Kernel space) + TLS 1.3", "QUIC (User space) over UDP", "Bypasses slow OS kernel networking upgrade cycles"],
          ["Connection Handshake", "1-RTT TCP handshake + 1-RTT TLS handshake (2 RTT)", "Combined 1-RTT cryptographic & transport handshake (0-RTT resumption)", "Cuts connection establishment latency by 50% to 100%"],
          ["Head-of-Line (HoL) Blocking", "TCP-level: single lost packet stalls all streams", "Stream-isolated: lost packet stalls only its specific stream", "Dramatically improves page load speed over lossy cellular/Wi-Fi"],
          ["Connection Migration", "Impossible (TCP bound to 4-tuple IP:Port; drops on network change)", "Native (Connections identified by 64-bit Connection ID)", "Zero interruption when switching between Wi-Fi and 5G cellular"],
          ["Header Compression", "HPACK (Requires strict in-order frame processing)", "QPACK (RFC 9204; supports out-of-order stream decompression)", "Eliminates compression synchronization deadlocks across streams"]
        ],
        n: "HTTP/3 runs on top of QUIC (Quick UDP Internet Connections), executing transport logic in user space over UDP port 443. QUIC integrates the TLS 1.3 cryptographic handshake directly into its transport parameter exchange: an initial connection completes mutual cryptographic key agreement and transport setup in a single round-trip (1-RTT), and returning clients resume sessions instantaneously in zero round-trips (0-RTT) by transmitting early encrypted application data alongside the initial packet. Unlike TCP, QUIC treats multiplexed streams as independent byte channels at the transport layer: if a packet carrying frames for Stream 5 is lost in transit, the destination QUIC stack continues delivering arriving packets for Streams 1, 3, and 7 directly to the application without stalling. Session continuity is decoupled from IP addresses via a 64-bit Connection ID (CID): when a user walks out of Wi-Fi range and their smartphone switches to a cellular IP address, the client continues sending packets with the existing CID, migrating the session transparently without dropping active streaming video or downloads."
      },
      miss: [
        {
          w: "HTTP/3 uses UDP, which means web traffic is now unreliable and packets can be permanently lost.",
          r: "QUIC implements fully reliable, acknowledged stream delivery with packet retransmission and congestion control on top of UDP; UDP is used merely as a stateless substrate to bypass rigid OS kernel TCP implementations."
        },
        {
          w: "HTTP/3 is unencrypted by default and requires an extra TLS layer just like HTTP/1.1.",
          r: "QUIC has mandatory, end-to-end TLS 1.3 encryption baked directly into its transport layer; it is impossible to run unencrypted HTTP/3, and even packet metadata (like sequence numbers) is cryptographically authenticated."
        },
        {
          w: "Servers can replace HTTP/2 entirely with HTTP/3 on port 443 without any fallback.",
          r: "Many corporate firewalls, captive portals, and middleboxes aggressively block inbound UDP port 443; web servers must run HTTP/2 over TCP alongside HTTP/3, advertising HTTP/3 support via the 'Alt-Svc' HTTP header."
        },
        {
          w: "HTTP/3 consumes less server CPU than HTTP/2 because UDP is a lightweight protocol.",
          r: "HTTP/3 currently consumes more server CPU than HTTP/2 because modern Network Interface Cards (NICs) have dedicated hardware offload (LSO/LRO/TSO) optimized for TCP, whereas user-space UDP packet processing incurs high syscall overhead."
        }
      ],
      trade: {
        buys: [
          "Zero transport Head-of-Line blocking: packet loss on one stream does not degrade the throughput of independent concurrent streams.",
          "Ultra-fast connection setup: establishes fully encrypted connections in 1-RTT (or 0-RTT on resumption), accelerating mobile loads.",
          "Seamless connection migration: active downloads and video streams survive network transitions (Wi-Fi to 5G) without reconnecting.",
          "Rapid user-space innovation: QUIC congestion control algorithms (BBRv2) can be updated without waiting years for OS kernel upgrades."
        ],
        costs: [
          "High server CPU utilization: lack of mature UDP hardware segmentation offload (GSO/GRO) increases CPU cycles per gigabit transferred.",
          "UDP blocking by corporate firewalls: up to 5% to 10% of enterprise networks block UDP port 443, requiring seamless TCP fallback.",
          "Complex user-space architecture: debugging requires specialized tooling (Wireshark with TLS key logging or QLOG visualization).",
          "0-RTT replay attack exposure: early data sent in 0-RTT packets can be intercepted and replayed by network adversaries."
        ],
        avoid: [
          "Deploying HTTP/3 without retaining HTTP/2 over TCP fallback enabled via the Alt-Svc header.",
          "Using 0-RTT early data for non-idempotent HTTP state changes (like POST payment transactions) vulnerable to replay attacks.",
          "Running HTTP/3 on servers without enabling Linux UDP GSO (Generic Segmentation Offload) to mitigate CPU utilization spikes.",
          "Assuming all cloud load balancers support HTTP/3: verify whether your edge CDN terminates QUIC before enabling origin support."
        ]
      }
    },
    {
      slug: "https",
      why: {
        before: "Original HTTP transmitted all web communications—including HTML pages, URLs, user authentication credentials, session cookies, and credit card numbers—in raw plaintext across the public Internet.",
        problem: "Plaintext HTTP allowed any intermediary along the physical network path (local Wi-Fi hotspot operators, rogue routers, Internet Service Providers, and state surveillance actors) to eavesdrop on private user data, steal session tokens, and inject malicious scripts or ads via Man-in-the-Middle (MitM) attacks.",
        shift: "HTTPS (HTTP over TLS, formalized in RFC 2818 and modern TLS 1.3 RFC 8446) wraps application HTTP streams inside a cryptographically secure Transport Layer Security tunnel, guaranteeing confidentiality (encryption), data integrity (anti-tampering), and server authenticity (X.509 certificates)."
      },
      num: {
        t: "TLS Handshake Evolution & Cryptographic Dynamics",
        h: ["Protocol Specification", "Handshake Round Trips", "Forward Secrecy (PFS)", "Vulnerable Primitives Retained", "Handshake Privacy"],
        r: [
          ["SSL 3.0 / TLS 1.0 (Deprecated)", "2-RTT (Complex negotiation)", "Optional (Frequently disabled in favor of static RSA)", "MD5, SHA-1, RC4, CBC-mode ciphers (POODLE, BEAST)", "Plaintext metadata; zero handshake encryption"],
          ["TLS 1.2 (RFC 5246 - 2008)", "2-RTT (1-RTT with session tickets)", "Optional (Supported via ECDHE / DHE cipher suites)", "CBC ciphers, static RSA key exchange, arbitrary renegotiation", "Server certificate transmitted in cleartext"],
          ["TLS 1.3 (RFC 8446 - 2018)", "1-RTT (0-RTT for resumed sessions)", "Mandatory (All supported ciphers enforce ephemeral ECDHE)", "Completely removed static RSA, CBC ciphers, RC4, SHA-1", "Server certificate and extensions encrypted in transit"]
        ],
        n: "The modern HTTPS connection sequence is governed by the TLS 1.3 handshake (RFC 8446). The client initiates the connection by transmitting a ClientHello message containing supported cryptographic cipher suites, a Server Name Indication (SNI) extension specifying the target domain, and speculative Key Shares computed using elliptic curve cryptography (such as X25519). The server selects the cipher suite, responds with ServerHello and its matching public Key Share, and immediately switches to encrypted transmission. The server then transmits its encrypted X.509 digital certificate and a digital signature (CertificateVerify) generated using its private key (RSA-PSS or Ed25519) over the handshake transcript. The client validates the certificate chain up to a trusted Root Certificate Authority (CA) stored in its operating system trust store. Both endpoints derive identical symmetric encryption keys using HKDF (HMAC-based Key Derivation Function) from the shared secret generated via Ephemeral Elliptic Curve Diffie-Hellman (ECDHE). All subsequent HTTP application traffic is encrypted using authenticated symmetric ciphers (AES-256-GCM or ChaCha20-Poly1305), providing Authenticated Encryption with Associated Data (AEAD) that guarantees both absolute privacy and tamper-proof cryptographic integrity."
      },
      miss: [
        {
          w: "HTTPS encryption adds massive latency and CPU overhead that severely slows down web servers.",
          r: "Modern CPUs feature dedicated hardware instructions (AES-NI) that encrypt and decrypt data at line rate (gigabytes per second per core) with negligible CPU impact; TLS 1.3 requires only a single network round-trip."
        },
        {
          w: "Having a valid HTTPS padlock icon guarantees that a website is trustworthy and safe from fraud.",
          r: "The HTTPS certificate verifies only that traffic is encrypted and connects to the domain name shown in the browser URL; phishing websites routinely obtain legitimate, free automated certificates (via Let's Encrypt) to deceive users."
        },
        {
          w: "HTTPS encrypts everything, hiding the destination website domain name from ISPs and network monitors.",
          r: "Traditional TLS transmits the Server Name Indication (SNI) and DNS queries in plaintext, allowing ISPs and firewalls to see every domain you visit; hiding domain metadata requires Encrypted Client Hello (ECH) and DNS-over-HTTPS."
        },
        {
          w: "If a server's private RSA key is stolen in the future, attackers can decrypt all past recorded HTTPS traffic.",
          r: "Modern HTTPS mandates Perfect Forward Secrecy (PFS) via ephemeral Diffie-Hellman (ECDHE); each session uses temporary session keys that are erased upon termination, preventing future private key compromises from decrypting past recordings."
        }
      ],
      trade: {
        buys: [
          "Complete communication confidentiality: protects passwords, credit cards, and personal data from eavesdropping over untrusted networks.",
          "Cryptographic data integrity: prevents ISPs, captive portals, and attackers from tampering with payloads or injecting advertisements.",
          "Verified identity authentication: guarantees through X.509 certificate validation that the user is communicating with the legitimate domain.",
          "Modern web platform prerequisite: required to unlock modern web APIs (Service Workers, Geolocation, HTTP/2, HTTP/3, WebRTC)."
        ],
        costs: [
          "Certificate lifecycle management: expired certificates cause immediate catastrophic service outages across applications.",
          "Handshake latency overhead: initial connections require one additional round-trip (1-RTT) to negotiate cryptographic keys.",
          "Middlebox and proxy friction: deep packet inspection appliances cannot inspect encrypted corporate traffic without installed MITM root certs.",
          "SNI leakage: destination hostnames are exposed in cleartext during initial handshake unless Encrypted Client Hello (ECH) is deployed."
        ],
        avoid: [
          "Allowing certificates to expire in production by failing to deploy automated ACME renewal tools (e.g., Certbot / Let's Encrypt).",
          "Supporting legacy, insecure cryptographic protocols (SSL 3.0, TLS 1.0, TLS 1.1) or broken ciphers (RC4, 3DES, CBC mode).",
          "Transmitting sensitive API credentials over plain HTTP before an HTTP-to-HTTPS redirect occurs.",
          "Failing to deploy HTTP Strict Transport Security (HSTS) with preloading, leaving users vulnerable to SSL stripping attacks."
        ]
      }
    },
    {
      slug: "dns",
      why: {
        before: "In the early ARPANET (1970s), host-to-IP mappings were maintained in a single monolithic text file (HOSTS.TXT) managed manually by the Stanford Research Institute (SRI-NIC) and periodically downloaded by administrators via FTP.",
        problem: "As the network expanded beyond a few thousand hosts, HOSTS.TXT suffered catastrophic scaling failures: frequent name collision conflicts, massive bandwidth consumed by FTP downloads, lack of localized administrative delegation, and inability to support dynamic, real-time updates.",
        shift: "Paul Mockapetris invented the Domain Name System (DNS, RFC 1034 and RFC 1035 in 1987), establishing a globally distributed, hierarchical, federated database that translates human-readable hostnames into numerical IP addresses via delegated authority zones and aggressive caching."
      },
      num: {
        t: "Essential DNS Record Types & Architecture",
        h: ["Record Type", "Data Payload Format", "Primary Operational Purpose", "Typical Caching TTL", "DNSSEC & Modern Role"],
        r: [
          ["A Record", "32-bit IPv4 address (e.g., 198.51.100.1)", "Maps a fully qualified domain name (FQDN) to an IPv4 host address", "300s to 86400s", "Signed via RRSIG records in DNSSEC"],
          ["AAAA Record", "128-bit IPv6 address (e.g., 2001:db8::1)", "Maps a domain name to an IPv6 host address", "300s to 86400s", "Signed via RRSIG records in DNSSEC"],
          ["CNAME Record", "Canonical domain name string", "Creates an alias pointing one domain name to another canonical domain", "300s to 86400s", "Cannot coexist with other records at zone apex (@)"],
          ["MX Record", "Priority integer + Mail server domain", "Routes incoming electronic mail to designated mail exchange servers", "3600s to 86400s", "Directs SMTP traffic; supports multiple prioritized targets"],
          ["TXT Record", "Arbitrary text string (up to 255 chars per string)", "Domain verification, email security authentication (SPF, DKIM, DMARC)", "300s to 3600s", "Universal substrate for cryptographic ownership verification"],
          ["NS Record", "Authoritative nameserver hostname", "Delegates a DNS subzone to specific authoritative nameservers", "86400s (1 day)", "Establishes authoritative hierarchy from TLD down"]
        ],
        n: "The Domain Name System functions as a globally distributed, hierarchical inverted tree. The hierarchy starts at the Root Zone (represented by a dot '.', served by 13 logical root server identities, a.root-servers.net through m.root-servers.net, distributed across hundreds of global locations via BGP Anycast). Below the root sit Top-Level Domains (TLDs like .com, .org, or ccTLDs like .uk), followed by Authoritative Second-Level Domains (e.g., example.com). When a client application resolves a domain, the operating system's stub resolver queries a Recursive Resolver (e.g., 8.8.8.8 or 1.1.1.1). The recursive resolver executes an iterative walk: 1) It queries a Root server, which responds with a referral to the TLD nameservers; 2) It queries the TLD nameserver, which responds with a referral to the authoritative nameservers for example.com; 3) It queries the Authoritative nameserver, which returns the final A or AAAA record. Every response contains a Time-to-Live (TTL) value: intermediate resolvers cache the record for the TTL duration, shielding authoritative servers from query floods. Modern privacy and security enhancements include DNSSEC (cryptographic signing of records to prevent cache poisoning), DNS over HTTPS (DoH / RFC 8484), and DNS over TLS (DoT / RFC 7858), which encrypt DNS queries over port 443/853 to prevent ISP eavesdropping and manipulation."
      },
      miss: [
        {
          w: "There are only 13 physical DNS root server computers in the entire world.",
          r: "There are 13 logical root server IP addresses (letters A through M), but each IP address is distributed globally across thousands of physical server instances in hundreds of data centers worldwide using BGP Anycast routing."
        },
        {
          w: "Lowering a DNS record's TTL instantly updates the record across the entire Internet.",
          r: "Lowering a TTL takes effect only after the *previous* longer TTL expires from all intermediate resolver caches around the world; TTL changes must be planned days in advance of a migration."
        },
        {
          w: "You can place a CNAME record at the root apex of a domain (e.g., example.com).",
          r: "RFC 1034 prohibits CNAME records from coexisting with any other records (such as SOA and NS records, which are mandatory at the root apex); cloud DNS providers solve this using proprietary ALIAS or ANAME virtual record flattening."
        },
        {
          w: "DNS queries are encrypted and private by default.",
          r: "Standard DNS runs in plaintext over UDP port 53; anyone on the local network or your ISP can inspect and log every domain query you make unless DNS over HTTPS (DoH) or DNS over TLS (DoT) is explicitly configured."
        }
      ],
      trade: {
        buys: [
          "Human-friendly naming: replaces cryptic, changing numerical IP addresses with memorable, brandable domain names.",
          "Traffic routing and load balancing: DNS Anycast, GeoDNS, and weighted round-robin dynamically direct users to the closest servers.",
          "Decoupled infrastructure migrations: switch underlying server IPs or cloud providers by updating DNS records with zero downtime.",
          "Cryptographic domain ownership verification: TXT records provide the foundational verification layer for SSL certificates and email."
        ],
        costs: [
          "Propagation delay: changes are governed by caching TTLs; records cannot be forcefully invalidated across millions of global resolvers.",
          "Single point of failure: DNS outages take down entire enterprise infrastructures even if underlying application servers are healthy.",
          "Vulnerability to cache poisoning: without DNSSEC validation, attackers can spoof DNS responses and hijack traffic via Kaminsky attacks.",
          "Plaintext privacy leakage: traditional DNS reveals every website domain an organization queries to network eavesdroppers."
        ],
        avoid: [
          "Setting TTLs to extremely high values (e.g., 7 days) right before conducting a major server or cloud migration.",
          "Placing CNAME records at the domain zone apex (@) without verifying if your DNS provider supports CNAME flattening / ALIAS records.",
          "Running production domain infrastructure on a single nameserver or relying on a single DNS hosting provider without redundancy.",
          "Neglecting to configure SPF, DKIM, and DMARC TXT records, allowing spammers to spoof your domain name in phishing attacks."
        ]
      }
    }
  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
