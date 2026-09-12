(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([
    {
      slug: "osi-model",
      why: {
        before: "In the 1970s, computer networking was completely fragmented across incompatible proprietary vendor architectures (such as IBM Systems Network Architecture / SNA, DECnet, and Xerox XNS); hardware and software from different vendors could not communicate.",
        problem: "Proprietary networking caused severe vendor lock-in; enterprises purchasing an IBM mainframe could only connect IBM peripherals and IBM cabling, and interconnecting heterogeneous systems required bespoke, expensive protocol translation gateways.",
        shift: "The International Organization for Standardization (ISO) published the 7-Layer Open Systems Interconnection (OSI) Reference Model (ISO/IEC 7498-1 in 1984), creating an open conceptual architecture that decoupled networking into physical transmission, link framing, path routing, transport reliability, session coordination, data syntax presentation, and application services."
      },
      num: {
        t: "The 7-Layer OSI Reference Model Architecture",
        h: ["Layer Number & Name", "Protocol Data Unit (PDU)", "Primary Hardware / Scope", "Core Architectural Function", "Canonical Protocols / Standards"],
        r: [
          ["7. Application", "Data", "End-user software / OS APIs", "Direct interface to network services; semantic application logic", "HTTP/3, DNS, SSH, SMTP, gRPC"],
          ["6. Presentation", "Data", "OS runtime / Libraries", "Data serialization, character encoding, encryption/decryption, compression", "TLS/SSL, JSON, ASN.1, Protobuf, gzip"],
          ["5. Session", "Data", "OS sockets / RPC runtimes", "Dialog control, session establishment, token management, synchronization checkpoints", "RPC, NetBIOS, PPTP, SOCKS5"],
          ["4. Transport", "Segment (TCP) / Datagram (UDP)", "Host OS Network Stack", "End-to-end reliability, flow control, port multiplexing, error recovery", "TCP, UDP, SCTP, QUIC"],
          ["3. Network", "Packet", "Routers / Layer 3 Switches", "Logical addressing, path determination across heterogeneous subnets, packet routing", "IPv4, IPv6, ICMP, BGP, OSPF"],
          ["2. Data Link", "Frame", "Network Interface Cards / Layer 2 Switches", "Physical MAC addressing, media access control (CSMA/CD), local frame delivery", "Ethernet (802.3), Wi-Fi (802.11), PPP, ARP"],
          ["1. Physical", "Bit", "Cables, Transceivers, Hubs", "Transmission of unstructured raw bit streams over physical copper, fiber, or radio waves", "1000BASE-T, 100GBASE-LR4, NRZ, QAM-256"]
        ],
        n: "The OSI model formalizes the encapsulation and decapsulation pipeline of networked systems. When an application initiates a transmission, data cascades downward from Layer 7 to Layer 1. Each layer wraps the incoming Service Data Unit (SDU) with its own protocol header (and Layer 2 appends a cyclic redundancy check / CRC frame check sequence trailer), transforming it into a layer-specific Protocol Data Unit (PDU): Data -> Segment -> Packet -> Frame -> Bits. At the destination, the reverse decapsulation occurs: each layer inspects and strips its corresponding header before passing the unencapsulated SDU to the layer above. While the full ISO protocol stack (such as TP4, CLNP, and X.400) failed commercially due to excessive bureaucratic complexity and late delivery compared to working TCP/IP code, the 7-layer model persists as the universal conceptual taxonomy and vocabulary used to diagnose faults, design firewalls, and architect distributed systems."
      },
      miss: [
        {
          w: "The Internet runs directly on the official OSI protocol suite.",
          r: "The global Internet runs on the 4-layer TCP/IP protocol suite; the OSI model is a theoretical reference framework used for teaching and system analysis, not the actual running implementation."
        },
        {
          w: "Every network protocol maps cleanly and strictly to exactly one of the seven OSI layers.",
          r: "Many real-world protocols span or sit between layers: TLS combines Layer 5 (session) and Layer 6 (presentation); ARP operates between Layer 2 and Layer 3; and modern QUIC merges transport, security, and stream multiplexing."
        },
        {
          w: "Layer 7 Application firewalls only inspect the top layer of network traffic.",
          r: "To inspect Layer 7 HTTP payloads, an application firewall or proxy must terminate and reconstruct all underlying layers (Layer 1 through Layer 4), including completing full TCP handshakes and TLS decryption."
        },
        {
          w: "Physical network switches only operate at Layer 2.",
          r: "Modern enterprise switches include 'Layer 3 switches' that perform hardware-accelerated IP packet routing and 'Layer 4-7 switches' (load balancers) that route based on TCP ports, cookies, and HTTP headers."
        }
      ],
      trade: {
        buys: [
          "Standardized mental model: establishes a precise, shared architectural vocabulary for troubleshooting and systems engineering.",
          "Modularity and abstraction: changes at one layer (e.g., replacing copper Ethernet with 100G fiber) do not break higher-level applications.",
          "Layered security engineering: enables defense-in-depth across physical cables, link-layer 802.1X, IP firewalls, and application WAFs.",
          "Interoperability guidance: provides hardware and software vendors with clear boundaries for building interchangeable components."
        ],
        costs: [
          "Theoretical mismatch: layers 5 (Session) and 6 (Presentation) have no distinct protocol implementations in the real-world TCP/IP stack.",
          "Encapsulation overhead: each layer adds byte headers, reducing effective payload throughput (goodput) relative to line rate.",
          "Debugging friction: real-world performance issues often cross layer boundaries (e.g., TCP performance degradation caused by Wi-Fi packet loss).",
          "Excessive abstraction: strict adherence to layered boundaries can prevent useful cross-layer optimizations (like zero-copy kernel networking)."
        ],
        avoid: [
          "Attempting to force modern internet protocols (like QUIC, BGP, or eBPF) into rigid theoretical 7-layer silos.",
          "Diagnosing application issues at Layer 7 before verifying Layer 3 IP reachability (ping) and Layer 4 port connectivity (nc/telnet).",
          "Ignoring header overhead: encapsulating small payloads inside nested headers wastes network bandwidth on tiny packets.",
          "Confusing Layer 2 MAC addresses (local link hop) with Layer 3 IP addresses (end-to-end global routing)."
        ]
      }
    },
    {
      slug: "tcp-ip-model",
      why: {
        before: "In the late 1960s and 1970s, network prototypes (like the original ARPANET NCP protocol) were designed around reliable, circuit-switched telecommunications assumptions that broke down when connecting diverse, unreliable radio, satellite, and cable networks.",
        problem: "Early protocols could not interconnect heterogeneous networks with differing packet sizes, lacked robust congestion control, suffered from connection drops across lossy links, and forced network routers to maintain complex connection states.",
        shift: "Vint Cerf and Bob Kahn created the TCP/IP Model (formalized in RFC 1122), built upon the 'End-to-End Principle'—shifting intelligence, reliability, and state to the host endpoints while leaving intermediate network routers simple, stateless, and best-effort packet forwarders."
      },
      num: {
        t: "TCP/IP Model Architecture vs OSI Reference Model",
        h: ["TCP/IP Layer", "Equivalent OSI Layers", "Protocol Data Unit (PDU)", "Core Architectural Responsibilities", "Foundational Protocols"],
        r: [
          ["Application", "Application (7), Presentation (6), Session (5)", "Message / Payload", "User process communication, application semantics, encryption, formatting", "HTTP, DNS, SSH, TLS, SMTP, WebSocket"],
          ["Transport", "Transport (4)", "Segment (TCP) / Datagram (UDP)", "End-to-end flow control, port multiplexing, error recovery, congestion control", "TCP, UDP, QUIC, SCTP"],
          ["Internet", "Network (3)", "Datagram / Packet", "Logical host addressing, hierarchical packet routing across networks, fragmentation", "IPv4, IPv6, ICMP, IGMP, BGP, OSPF"],
          ["Network Access (Link)", "Data Link (2), Physical (1)", "Frame / Bit stream", "Hardware device drivers, physical framing, MAC addressing, signal modulation", "Ethernet (802.3), Wi-Fi (802.11), ARP, DOCSIS, Fiber Optics"]
        ],
        n: "The TCP/IP model operates on the End-to-End Principle formulated by Saltzer, Reed, and Clark in 1984: network functions should be implemented at the communication endpoints unless they can be completely and correctly implemented by the intermediate network. Intermediate IP routers inspect only the Layer 3 Internet header to forward datagrams using the Longest Prefix Match rule, remaining completely oblivious to application data or TCP connection states. Transmission Control Protocol (TCP) provides a reliable, bidirectional, ordered byte stream abstraction over the inherently unreliable, packet-dropping Internet Protocol (IP). TCP manages connection lifecycles via the three-way handshake (SYN -> SYN-ACK -> ACK) and teardown (FIN -> ACK -> FIN -> ACK). Reliability is achieved through 32-bit sequence numbers, cumulative acknowledgments, and dynamic retransmission timers (RTO computed via Jacobson's algorithm tracking smoothed round-trip time SRTT and variance). Flow control is governed by the sliding receiver window (rwnd), while network stability is maintained by congestion control algorithms (Slow Start, Congestion Avoidance, Fast Retransmit, and Fast Recovery, dynamically adjusting the congestion window cwnd based on packet loss or delay signals)."
      },
      miss: [
        {
          w: "TCP/IP ensures that packets arrive in order at the intermediate physical routers.",
          r: "Routers forward each IP packet independently; packets routinely travel across different physical routes and arrive out of order at the destination host, where the receiving TCP stack reorders them using sequence numbers."
        },
        {
          w: "The TCP/IP model has five layers in its formal specification.",
          r: "The official RFC 1122 specification defines exactly four layers (Application, Transport, Internet, Link); textbooks frequently split the Link layer into Data Link and Physical to align conceptually with the OSI model."
        },
        {
          w: "TCP guarantees that data is received by the destination application as soon as send() returns.",
          r: "The send() system call merely copies bytes from user space into the local operating system's kernel TCP socket buffer; data is transmitted, acknowledged, and delivered to the remote application asynchronously."
        },
        {
          w: "The Internet layer (IP) guarantees that packets will eventually be delivered if given enough time.",
          r: "The Internet Protocol is strictly 'best-effort': it provides zero delivery guarantees and will silently drop packets upon router buffer queue exhaustion, corrupted checksums, or TTL expiration."
        }
      ],
      trade: {
        buys: [
          "Universal internetworking: connects any physical transmission medium (copper, fiber, Wi-Fi, satellite) across a unified global network.",
          "Stateless network core: intermediate routers do not track individual connections, allowing the Internet to scale to billions of endpoints.",
          "Self-healing fault tolerance: dynamic routing protocols reroute IP packets around failed physical links without terminating endpoints.",
          "Decoupled development: applications (HTTP, SSH) evolve independently of underlying physical network hardware upgrades."
        ],
        costs: [
          "Head-of-line blocking: in TCP, a single lost packet stalls delivery of all subsequent data in the stream buffer until retransmitted.",
          "Connection establishment latency: TCP three-way handshake and TLS negotiation require multiple network round-trips before data transfer.",
          "Header overhead: combined TCP and IPv4 headers consume at least 40 bytes per packet, reducing goodput on small transaction payloads.",
          "Congestion collapse vulnerability: without robust congestion control at endpoints, aggressive traffic can collapse shared router queues."
        ],
        avoid: [
          "Treating TCP network streams as message-oriented (TCP is a raw continuous byte stream with no inherent message boundaries).",
          "Disabling TCP Nagle's algorithm (TCP_NODELAY) without benchmarking the trade-off between latency and packet overhead.",
          "Assuming local IP routing guarantees equal latency: asymmetric routing frequently directs outbound and inbound packets over different paths.",
          "Building distributed consensus protocols that assume physical network links are reliable or synchronous."
        ]
      }
    },
    {
      slug: "ip-address",
      why: {
        before: "Early computer networks identified machines using physical hardware addresses (like Ethernet MAC addresses) or flat numerical identifiers tied directly to physical switch ports.",
        problem: "Flat hardware addresses cannot be routed hierarchically across global internetworks; core routers would need an individual routing table entry for every connected device on the planet ($O(N)$ memory explosion), making global scalability impossible.",
        shift: "The Internet Protocol (IP) address established a hierarchical, logical network addressing scheme (32-bit IPv4 and 128-bit IPv6) that decouples a device's logical network location from its physical hardware, enabling routers to summarize billions of endpoints into compact hierarchical routing prefixes."
      },
      num: {
        t: "IPv4 vs IPv6 Architectural Comparison",
        h: ["Architectural Dimension", "IPv4 (RFC 791)", "IPv6 (RFC 8200)", "Dual-Stack Coexistence", "Network Address Translation (NAT)"],
        r: [
          ["Address Length & Space", "32 bits (4 bytes); 4,294,967,296 total addresses", "128 bits (16 bytes); 3.4 x 10^38 total addresses", "Hosts run both IPv4 and IPv6 stacks concurrently", "Private IPv4 spaces (RFC 1918) mapped to public IPs"],
          ["Notation & Format", "Dotted-decimal (e.g., 192.0.2.1)", "Hexadecimal 8-hextet colon-separated (e.g., 2001:db8::1)", "Resolves dual A and AAAA DNS records", "Stateful IP:Port translation tables in firewalls/routers"],
          ["Header Format & Size", "Variable length (20 to 60 bytes with options); includes checksum", "Fixed 40-byte base header; extension headers chained", "Independent packet processing per IP version", "Rewrites IP header and updates TCP/UDP checksums"],
          ["Host Auto-Configuration", "DHCPv4 or manual static configuration", "SLAAC (Stateless Address Autoconfiguration) + DHCPv6", "DHCPv4 alongside IPv6 SLAAC router advertisements", "Unnecessary in native IPv6 (every device has global IP)"],
          ["Security Architecture", "IPSec optional (retrofitted via extension headers)", "IPSec mandatory architectural support built into standard", "Requires maintaining synchronized dual firewall rule sets", "Breaks end-to-end encryption protocols without NAT traversal"]
        ],
        n: "An IP address serves two fundamental functions: host identification and location addressing. In IPv4, the 32-bit address is split into two logical components: the Network Prefix (identifying the specific subnetwork) and the Host Identifier (identifying the specific interface on that subnetwork). The boundary between network and host is defined by a 32-bit Subnet Mask or CIDR prefix length (e.g., /24 indicates that the first 24 bits represent the network). Special reserved address blocks are defined by IETF RFCs: RFC 1918 allocates private, non-routable address spaces (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16) for internal corporate and home networks; 127.0.0.0/8 is reserved for host loopback; and 169.254.0.0/16 is reserved for Link-Local Auto-Configuration (APIPA). IPv6 expands the address space to 128 bits, structured into a 64-bit Global Routing Prefix + Subnet ID and a 64-bit Interface Identifier, completely eliminating the architectural need for IPv4 NAT and restoring true end-to-end reachability across the Internet."
      },
      miss: [
        {
          w: "An IP address uniquely identifies a physical computer or laptop.",
          r: "An IP address identifies a specific network interface, not a physical computer; a laptop connected to both Wi-Fi and Ethernet simultaneously possesses two distinct IP addresses."
        },
        {
          w: "Public IPv4 address exhaustion means that IPv4 has stopped working or is no longer used.",
          r: "While regional registries (RIRs) have exhausted their free pools of unallocated /8 IPv4 blocks, the global Internet continues to run predominantly on IPv4 via carrier-grade NAT (CGNAT), address trading markets, and dual-stack deployments."
        },
        {
          w: "IPv6 is slower than IPv4 because its 128-bit addresses are four times larger.",
          r: "IPv6 uses a fixed, simplified 40-byte header with no checksum and no intermediate router fragmentation, allowing routers to process IPv6 packets faster in hardware than variable-length IPv4 headers."
        },
        {
          w: "Private IP addresses (e.g., 192.168.1.1) are inherently secure and cannot be hacked.",
          r: "Private IP addresses are merely non-routable on the public Internet; they offer zero encryption, zero authentication, and remain vulnerable to local network attacks, malware pivoting, and DNS rebinding exploits."
        }
      ],
      trade: {
        buys: [
          "Hierarchical global routing: enables core BGP routers to route traffic across the planet using compact aggregated routing tables.",
          "Device portability: devices can transition between networks (Wi-Fi to LTE) by acquiring new IP addresses dynamically.",
          "Subnet isolation: allows network administrators to partition physical infrastructure into isolated broadcast and security domains.",
          "Universal addressing abstraction: applications bind to abstract IP sockets without needing knowledge of underlying Ethernet or fiber optics."
        ],
        costs: [
          "Address space scarcity: IPv4 address exhaustion has made public IPv4 blocks expensive commodities requiring complex NAT architectures.",
          "NAT traversal complexity: Network Address Translation breaks peer-to-peer protocols (SIP, WebRTC), requiring STUN/TURN/ICE servers.",
          "Configuration drift: managing static IP address assignments across thousands of enterprise servers requires IPAM tools to avoid collisions.",
          "Dual-stack operational overhead: running both IPv4 and IPv6 concurrently requires monitoring two sets of DNS records, firewalls, and routes."
        ],
        avoid: [
          "Hardcoding static IP addresses inside application configuration files or source code (always use DNS hostnames).",
          "Deploying new cloud infrastructure using public IPv4 addresses for private internal database or cache instances.",
          "Assuming an incoming IP address in HTTP headers (X-Forwarded-For) is authentic without validating trusted reverse proxy boundaries.",
          "Overlapping RFC 1918 private CIDR blocks across corporate networks that will eventually be merged via VPC peering or site-to-site VPNs."
        ]
      }
    },
    {
      slug: "subnet",
      why: {
        before: "In early IPv4 (pre-1985), networks were partitioned into rigid, monolithic classes: Class A (/8, 16.7 million hosts), Class B (/16, 65,536 hosts), and Class C (/24, 254 hosts). Organizations were assigned an entire class block.",
        problem: "Classful allocation caused catastrophic address waste: an organization requiring 300 IP addresses could not fit in a Class C block (254 hosts) and was granted a full Class B block (65,536 hosts), stranding over 65,000 addresses. Furthermore, huge flat networks suffered from massive broadcast storms.",
        shift: "Subnetting (formalized in RFC 950) introduced the Subnet Mask, allowing network engineers to borrow bits from the host portion of an IP address to divide a single network into multiple smaller, logically isolated subnetworks."
      },
      num: {
        t: "Subnet Masks, Prefix Lengths & Host Capacities",
        h: ["CIDR Prefix", "Subnet Mask (Dotted Decimal)", "Total IP Addresses (2^h)", "Usable Host Capacity (2^h - 2)", "Primary Architectural Deployment Role"],
        r: [
          ["/24", "255.255.255.0", "256", "254", "Standard corporate office LAN, standard Kubernetes pod subnet"],
          ["/25", "255.255.255.128", "128", "126", "Mid-sized departmental tier (e.g., isolated backend database cluster)"],
          ["/26", "255.255.255.192", "64", "62", "Cloud Availability Zone public subnet for application load balancers"],
          ["/27", "255.255.255.224", "32", "30", "Small service cluster, DMZ bastions, or managed cloud VPC endpoints"],
          ["/28", "255.255.255.240", "16", "14 (AWS: 11)", "Minimal cloud VPC subnet; AWS reserves 5 IPs per VPC subnet"],
          ["/30", "255.255.255.252", "4", "2", "Point-to-point router interconnections (RFC 3021 /31 supersedes with 2 IPs)"]
        ],
        n: "Subnetting uses bitwise arithmetic to split a 32-bit IPv4 address into Network, Subnet, and Host fields. When an IP stack evaluates whether a destination IP is local or remote, it executes a bitwise AND between the IP address and the Subnet Mask: Network ID = IP & Mask. If the resulting Network ID matches the local interface's Network ID, the packet is delivered locally via Layer 2 ARP; if different, the packet is forwarded to the default gateway router. The host capacity of any subnet is calculated as 2^(32 - prefix) - 2. Two addresses are mathematically reserved in standard IPv4 subnets: the address where all host bits are 0 represents the Network Identifier itself, and the address where all host bits are 1 represents the Subnet Directed Broadcast Address. In public cloud environments like AWS VPC, an additional three IP addresses are reserved per subnet (e.g., .1 for VPC router, .2 for VPC DNS, .3 for future use), leaving 2^(32 - prefix) - 5 usable IP addresses."
      },
      miss: [
        {
          w: "Every IP address within a /24 subnet can be assigned to an active host or server.",
          r: "In standard networking, two addresses are always reserved: the network ID (e.g., .0) and the broadcast address (e.g., .255); in cloud environments like AWS VPC, five addresses (.0, .1, .2, .3, .255) are reserved."
        },
        {
          w: "Subnetting is only used to conserve scarce IPv4 addresses.",
          r: "Subnetting is equally critical for security isolation (placing databases in private subnets without Internet gateways) and broadcast containment (limiting ARP/DHCP broadcast noise to small collision/broadcast domains)."
        },
        {
          w: "A device in Subnet A can communicate directly with a device in Subnet B on the same physical switch without a router.",
          r: "Devices in different subnets perceive each other as remote networks; their operating systems will refuse to ARP directly for the destination MAC address and will strictly forward traffic to a Layer 3 router or default gateway."
        },
        {
          w: "Subnet masks can contain arbitrary scattered bits like 255.0.255.0.",
          r: "A valid subnet mask must consist of contiguous binary 1s followed by contiguous binary 0s; non-contiguous masks are invalid in standard modern IP routing."
        }
      ],
      trade: {
        buys: [
          "Broadcast domain containment: prevents Layer 2 broadcast storms from saturating the entire corporate network infrastructure.",
          "Network security zoning: enables strict firewall and Security Group boundaries between public DMZ, application, and database tiers.",
          "Efficient address allocation: precisely tailor address block sizes (/28 vs /24) to match the exact host requirements of each team.",
          "Granular routing control: route traffic between subnets through inspection appliances (IDS/IPS, firewalls) via route tables."
        ],
        costs: [
          "Address overhead: every allocated subnet loses at least two IP addresses (network and broadcast) to addressing math.",
          "Routing latency: inter-subnet communication requires routing through Layer 3 switches or virtual routers, adding latency.",
          "VPC re-architecting pain: expanding a subnet once deployed in cloud providers is often impossible without provisioning a new subnet.",
          "Management complexity: designing and documenting non-overlapping subnet allocations across multi-region cloud infrastructures."
        ],
        avoid: [
          "Allocating overly small subnets (e.g., /28) in cloud environments that later run out of IPs for autoscaling worker nodes.",
          "Placing databases and internal microservices into public subnets with direct Internet Gateways attached.",
          "Creating overlapping subnet CIDR blocks across different cloud VPCs or on-premise datacenters that need to peer.",
          "Forgetting cloud provider IP reservations when calculating host capacities for container clusters (Kubernetes EKS/GKE)."
        ]
      }
    },
    {
      slug: "cidr",
      why: {
        before: "Prior to 1993, the Internet relied entirely on Classful Routing (Class A, B, and C). Routing tables in core Internet routers stored individual route entries for every allocated class block across the globe.",
        problem: "By 1993, the Internet faced imminent collapse due to the 'Class B Exhaustion' crisis and the exponential explosion of global BGP routing tables, which threatened to overwhelm the physical memory capacity of core backbone routers.",
        shift: "Classless Inter-Domain Routing (CIDR, published in RFC 1518 and RFC 1519) abolished rigid Class A/B/C boundaries, replacing them with variable-length prefix routing (e.g., /19, /22) and route aggregation (supernetting) that allowed thousands of routes to be summarized into single BGP announcements."
      },
      num: {
        t: "Classful vs Classless (CIDR) Routing Comparison",
        h: ["Routing Architecture", "Prefix Length Flexibility", "Route Aggregation (Supernetting)", "Routing Protocol Support", "Global Internet Backbone Impact"],
        r: [
          ["Classful Routing (pre-1993)", "Rigid 8, 16, or 24-bit fixed masks", "Impossible; each class network was advertised independently", "RIPv1, IGRP (did not transmit subnet masks in updates)", "Exponential routing table growth; impending backbone memory collapse"],
          ["Classless Routing (CIDR)", "Any arbitrary prefix from /0 to /32", "Enables hierarchical supernetting (aggregating multiple /24s into a /20)", "BGP-4, OSPFv2, IS-IS, RIPv2 (transmits prefix mask with route)", "Preserved global routing scalability; stabilized BGP table growth"],
          ["IPv6 CIDR (RFC 4291)", "Standardized 4-bit nibble boundaries (/48, /56, /64)", "Native hierarchical aggregation from /32 ISP allocations down to /64", "BGP-4 MP-BGP, OSPFv3", "Supports global routing tables for 3.4 x 10^38 addresses seamlessly"]
        ],
        n: "CIDR notation specifies an IP address and its associated routing prefix length using a slash followed by the decimal count of leading contiguous binary 1s (e.g., 198.51.100.0/22 represents a 22-bit network prefix and a 10-bit host identifier, encompassing 1,024 total addresses). CIDR enables 'supernetting' (route aggregation): an Internet Service Provider holding sixteen contiguous /24 networks (e.g., 198.51.0.0/24 through 198.51.15.0/24) aggregates them into a single /20 prefix announcement (198.51.0.0/20), slashing global BGP routing table entries from 16 to 1. When a router evaluates forwarding paths for a destination IP, it enforces the 'Longest Prefix Match' (LPM) algorithm: if the routing table contains both 10.0.0.0/16 and 10.0.1.0/24, a packet destined for 10.0.1.50 matches both, but is strictly forwarded via the /24 route because 24 is more specific than 16. Modern hardware routers execute LPM lookups at line rate (terabits per second) using Ternary Content-Addressable Memory (TCAM), which searches all routing table entries simultaneously in a single clock cycle."
      },
      miss: [
        {
          w: "CIDR is simply a shorthand syntax for writing subnet masks in documentation.",
          r: "CIDR is a fundamental routing architecture that replaced classful routing globally, allowing arbitrary bit-length prefix routing and route aggregation across the entire Internet backbone."
        },
        {
          w: "A router always selects the shortest path or the route learned from the fastest protocol.",
          r: "In IP routing, the Longest Prefix Match (LPM) rule takes absolute precedence over metric, administrative distance, and protocol: the most specific prefix (e.g., /28 over /24) is always chosen regardless of protocol."
        },
        {
          w: "CIDR prefix lengths can only be divided along clean 8-bit octet boundaries (/8, /16, /24).",
          r: "The entire purpose of CIDR is classless bitwise flexibility: prefixes can be any integer from /0 (default route 0.0.0.0/0) to /32 (single host 192.0.2.1/32)."
        },
        {
          w: "Route aggregation (supernetting) can combine any arbitrary list of IP subnets together.",
          r: "Supernetting requires that the combined subnets be contiguous in address space and align mathematically on a binary boundary matching the power-of-two size of the resulting supernet."
        }
      ],
      trade: {
        buys: [
          "Route summarization: condenses millions of individual subnets into hundreds of thousands of aggregated BGP routes.",
          "Efficient address conservation: eliminates the massive address waste inherent in legacy Class A, B, and C allocations.",
          "Longest prefix match routing: enables fine-grained traffic engineering by advertising specific sub-prefixes to override broad routes.",
          "Arbitrary network sizing: deploy networks sized precisely to need (/29 for firewalls, /22 for large office buildings)."
        ],
        costs: [
          "Route disaggregation risk: organizations leaking unaggregated /24 routes bloat global BGP routing tables (approaching 1 million routes).",
          "TCAM hardware expense: storing hundreds of thousands of classless routes in high-speed router TCAM requires expensive specialized silicon.",
          "Mental calculation overhead: calculating non-octet CIDR boundaries (/21, /27) requires binary arithmetic compared to classful masks.",
          "Subnet fragmentation: allocating non-contiguous variable-length subnets can leave fragmented, unaggregatable address holes."
        ],
        avoid: [
          "Advertising de-aggregated, small /24 routes to the global BGP table when a single summarized supernet can be announced.",
          "Assuming routers evaluate routes based on hop count before checking the Longest Prefix Match.",
          "Configuring default routes (0.0.0.0/0) without understanding that more specific internal routes will always take precedence.",
          "Splitting CIDR blocks arbitrarily without aligning them to binary power-of-two boundaries."
        ]
      }
    },
    {
      slug: "port",
      why: {
        before: "In early computer networking, network packets were addressed solely to the destination host's physical network adapter or single operating system input queue.",
        problem: "Once a packet arrived at a computer, the operating system had no standardized mechanism to determine which specific application should receive it—a server could not run a web server, an email server, and an SSH daemon simultaneously over a single IP address without proprietary hacks.",
        shift: "Transport layer port numbers (16-bit integers from 0 to 65535 in TCP and UDP) introduced standardized application multiplexing and demultiplexing, allowing thousands of independent network processes to communicate concurrently over a single IP address."
      },
      num: {
        t: "Port Number Ranges & Operating System Constraints",
        h: ["Port Range", "Classification Category", "Privilege Requirement (POSIX)", "Governance & Assignment", "Canonical Protocol Examples"],
        r: [
          ["0 – 1023", "Well-Known / System Ports", "Root / CAP_NET_BIND_SERVICE required", "Assigned by IANA for standard system infrastructure services", "SSH (22), DNS (53), HTTP (80), HTTPS (443), NTP (123)"],
          ["1024 – 49151", "Registered / User Ports", "Unprivileged user processes", "Registered with IANA by vendors and software developers", "MySQL (3306), Redis (6379), PostgreSQL (5432), Kubernetes API (6443)"],
          ["49152 – 65535", "Dynamic / Private / Ephemeral Ports", "Unprivileged user processes", "Allocated dynamically by host OS for outbound client connections", "Client-side sockets, temporary RPC connections, NAT translations"]
        ],
        n: "In the TCP/IP stack, a unique network conversation endpoint is mathematically identified by a 5-tuple: (Source IP, Source Port, Destination IP, Destination Port, Transport Protocol). When a client process initiates an outbound TCP connection (e.g., fetching a webpage via curl), the operating system kernel automatically assigns a temporary, high-numbered port from its ephemeral port range (configured on Linux via /proc/sys/net/ipv4/ip_local_port_range, typically 32768–60999). Listening on well-known ports (0–1023) historically required root privileges to prevent unprivileged local users from setting up rogue servers on standard ports; modern Linux systems manage this via the granular CAP_NET_BIND_SERVICE capability. A critical operational failure mode in high-throughput microservices is 'ephemeral port exhaustion': when a client initiates thousands of short-lived TCP connections per second to the same destination IP:Port, closed sockets linger in the TIME_WAIT state for 2 * MSL (Maximum Segment Lifetime = 60 seconds) to ensure delayed packets drain from the network, exhausting all ~28,000 available ephemeral ports and triggering EADDRNOTAVAIL errors."
      },
      miss: [
        {
          w: "A server can only accept a maximum of 65,535 simultaneous TCP connections on port 443.",
          r: "The 65,535 port limit applies only to the local port number; TCP connections are tracked by the full 5-tuple, meaning a single server on port 443 can accept millions of concurrent connections as long as client IP or client port numbers differ."
        },
        {
          w: "TCP and UDP share the same port number pool, so port 80 cannot be used by both protocols simultaneously.",
          r: "TCP and UDP maintain completely independent port number spaces inside the kernel; an application can listen on TCP port 53 (DNS zone transfers) while another application listens on UDP port 53 (DNS queries) on the exact same IP."
        },
        {
          w: "Opening a port in a firewall automatically starts an application listening on that port.",
          r: "A firewall merely permits packets to pass through the network filter; if no operating system process has invoked the bind() and listen() system calls on that port, the kernel immediately rejects incoming packets with TCP RST or ICMP Port Unreachable."
        },
        {
          w: "Running web services on non-standard ports (like port 8080 or 8443) provides robust security.",
          r: "Security through obscurity is not security; automated port scanners (like masscan and nmap) scan all 65,535 ports on an IP address in seconds and identify services via protocol banner grabbing."
        }
      ],
      trade: {
        buys: [
          "Process multiplexing: run hundreds of independent services (databases, web servers, metrics collectors) on a single physical host.",
          "Granular firewall filtering: allow public traffic to port 443 while strictly blocking management ports (SSH 22, database 5432).",
          "Dynamic client connections: ephemeral ports allow applications to open thousands of outbound API calls concurrently.",
          "Standardized service discovery: clients connect to well-known ports (HTTP 80, DNS 53) without requiring explicit port configuration."
        ],
        costs: [
          "Ephemeral port exhaustion: high-frequency short-lived connections exhaust available client ports due to TIME_WAIT socket states.",
          "Port scanning exposure: open ports provide adversaries with direct attack surfaces against unpatched service daemons.",
          "NAT translation state: stateful firewalls and NAT gateways must track every active port mapping in memory tables.",
          "Port collision friction: two local services cannot bind to the exact same IP:Port combination without SO_REUSEPORT socket flags."
        ],
        avoid: [
          "Creating short-lived TCP connections in tight loops instead of using persistent connection pools (keep-alive).",
          "Exposing internal database or cache ports (3306, 5432, 6379) directly to the public Internet without private subnet isolation.",
          "Running production containerized web services as root solely to bind to port 80 (use reverse proxies or CAP_NET_BIND_SERVICE).",
          "Ignoring the TIME_WAIT socket buildup in high-throughput reverse proxies (tune net.ipv4.tcp_tw_reuse)."
        ]
      }
    },
    {
      slug: "udp",
      why: {
        before: "In early network design, reliable connection-oriented transport protocols (like TCP) dominated, requiring complex three-way handshakes, state machines, packet sequencing, mandatory acknowledgments, and retransmission loops.",
        problem: "For real-time applications (such as live audio/video streaming, multiplayer online gaming, DNS queries, and sensor telemetry), TCP's mandatory retransmissions and Head-of-Line blocking introduced catastrophic latency spikes; receiving a lost video packet 200 milliseconds late is useless because the frame has already passed.",
        shift: "The User Datagram Protocol (UDP, formalized in RFC 768 in 1980 by David Reed) introduced an ultra-minimal, connectionless, lightweight transport protocol that transmits discrete datagrams with zero connection setup, zero acknowledgment overhead, and zero retransmission delays."
      },
      num: {
        t: "Transport Protocol Architectural Comparison",
        h: ["Dimension / Feature", "UDP (RFC 768)", "TCP (RFC 793 / 9293)", "QUIC / HTTP/3 (RFC 9000)", "SCTP (RFC 4960)"],
        r: [
          ["Connection Setup", "0-RTT (Connectionless; sends data immediately)", "1-RTT (Three-way handshake: SYN, SYN-ACK, ACK)", "0-RTT / 1-RTT (Integrated TLS 1.3 handshake over UDP)", "4-way handshake with cryptographic cookie"],
          ["Header Overhead", "8 bytes fixed minimal header", "20 to 60 bytes (variable with TCP options)", "Variable (compact packet header over UDP)", "12 bytes common header + chunk headers"],
          ["Delivery Reliability", "Unreliable (Best-effort; packets can be lost, reordered, duplicated)", "Guaranteed reliable (Retransmissions, sequence numbers)", "Guaranteed reliable (Stream-level recovery over UDP)", "Configurable (Reliable or partially reliable)"],
          ["Head-of-Line Blocking", "None (Every datagram is completely independent)", "Yes (Lost segment stalls all subsequent bytes in stream)", "None (Lost packet stalls only its specific stream)", "None (Supports multi-streaming within association)"],
          ["Congestion Control", "None native (Transmits at application speed)", "Kernel-managed (CUBIC, BBR, Reno)", "User-space managed (BBR, NewReno implemented in app)", "Built-in congestion control similar to TCP"]
        ],
        n: "UDP provides the absolute minimum protocol mechanism required to multiplex application traffic across an IP network. Its header is exactly 8 bytes long, consisting of four 16-bit fields: Source Port (16 bits), Destination Port (16 bits), Length (16 bits, specifying total datagram length including header and payload, minimum 8, maximum 65,535 bytes), and Checksum (16 bits). The checksum validates payload integrity across a 96-bit 'pseudo-header' (containing Source IP, Destination IP, Protocol 17, and UDP Length) plus the UDP payload; in IPv4, checksum computation is optional for sender (though strongly recommended), whereas in IPv6 it is strictly mandatory. In user space, applications interact with UDP via SOCK_DGRAM sockets: calling sendto() packages user bytes directly into an IP datagram and submits it immediately to the network interface without buffering, handshaking, or connection state tracking. Modern high-performance protocols (such as QUIC / HTTP/3, WebRTC, and WireGuard) run exclusively on top of UDP, moving encryption, multiplexing, and congestion control into user-space application runtimes while bypassing legacy kernel TCP stack bottlenecks."
      },
      miss: [
        {
          w: "UDP is unreliable, meaning it frequently corrupts data payloads during transit.",
          r: "UDP datagrams that arrive corrupted are detected by the 16-bit checksum and silently discarded by the operating system; 'unreliable' means UDP does not guarantee packet delivery, ordering, or deduplication, not that it delivers corrupted data."
        },
        {
          w: "UDP is always faster than TCP under all network conditions.",
          r: "While UDP avoids connection handshakes and acknowledgment overhead, an unthrottled UDP stream can overwhelm intermediate router queues and cause 90%+ packet loss, whereas TCP's congestion control optimizes throughput to match available path bandwidth."
        },
        {
          w: "Applications cannot implement reliable file transfers using UDP.",
          r: "High-performance data transfer protocols (such as Aspera FASP, Tsunami UDP, and modern QUIC) implement custom, ultra-fast reliability and selective acknowledgment algorithms in user space on top of UDP, vastly outperforming standard TCP over high-latency WAN links."
        },
        {
          w: "Calling connect() on a UDP socket is invalid because UDP is connectionless.",
          r: "Calling connect() on a POSIX UDP socket is valid and standard: it associates the socket with a specific destination IP and port in the kernel, enabling the use of send() and recv() while filtering out packets from other senders and improving syscall performance."
        }
      ],
      trade: {
        buys: [
          "Zero connection latency: transmit data instantaneously in the first packet (0-RTT) without waiting for three-way handshakes.",
          "Zero Head-of-Line blocking: packet loss on one message does not stall the processing or delivery of subsequent independent messages.",
          "Minimal header overhead: fixed 8-byte header consumes far less network bandwidth than TCP's 20–60 byte headers.",
          "Application-level protocol innovation: foundation for modern user-space transport protocols like QUIC, WebRTC, and WireGuard."
        ],
        costs: [
          "No built-in reliability: applications must tolerate lost, duplicate, and out-of-order packets or build custom retransmission logic.",
          "No native congestion control: unconstrained UDP traffic can saturate network links and trigger network-wide congestion collapse.",
          "Aggressive firewall blocking: corporate firewalls and middleboxes frequently throttle or block arbitrary UDP traffic outside port 53 and 443.",
          "Path MTU discovery complexity: datagrams exceeding path MTU (typically 1500 bytes) are fragmented by IP routers or dropped if DF bit is set."
        ],
        avoid: [
          "Sending UDP datagrams larger than the standard Ethernet MTU (1500 bytes), which triggers brittle IP packet fragmentation.",
          "Transmitting high-volume UDP data streams without implementing application-level rate limiting or congestion control.",
          "Using raw UDP for transactional financial or database commands that require guaranteed, exactly-once delivery semantics.",
          "Assuming UDP packets will arrive in the order they were transmitted: always include application-level sequence numbers when order matters."
        ]
      }
    }
  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
