(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([
    {
      slug: "network-address-translation",
      why: {
        before: "In the original architectural design of the Internet Protocol, every computer connected to the network was assigned a globally unique, publicly routable IPv4 address, adhering to the pure End-to-End Principle.",
        problem: "The explosive commercial growth of the Internet in the early 1990s threatened rapid exhaustion of the 4.3 billion IPv4 address space; individual households, small businesses, and branch offices could not acquire sufficient public IP addresses for all internal machines.",
        shift: "Network Address Translation (NAT, formalized in RFC 1631 and RFC 3022) enabled entire private internal networks (RFC 1918) to share a single public IPv4 address by dynamically translating IP headers and transport-layer port numbers at the perimeter gateway router."
      },
      num: {
        t: "Network Address Translation Architectures & Flavors",
        h: ["NAT Flavor / Standard", "Mapping Cardinality", "Header Translation Scope", "Primary Operational Role", "Peer-to-Peer Traversal Complexity"],
        r: [
          ["Static NAT (1:1)", "One private IP to one dedicated public IP", "Rewrites IP source/destination; preserves ports", "Publishing internal DMZ servers (e.g., mail, web) with dedicated public IPs", "Low; direct bidirectional reachability"],
          ["Dynamic NAT (M:N)", "Pool of private IPs to pool of public IPs", "Translates IP addresses dynamically from available pool", "Legacy corporate networks with large public IP allocations", "Moderate; temporary public IP mapping"],
          ["NAPT / PAT (Masquerading)", "Many private IPs to single public IP", "Translates Source IP and Source Port simultaneously", "Ubiquitous home Wi-Fi routers, enterprise office egress, AWS NAT Gateways", "High; requires STUN, TURN, or ICE traversal"],
          ["Carrier-Grade NAT (CGNAT / RFC 6598)", "Thousands of residential subscribers to public IP pool", "Two-tier NAT using 100.64.0.0/10 shared address space", "ISP cellular 4G/5G mobile networks and residential broadband", "Extreme; double-NAT blocks inbound port forwarding"],
          ["NAT64 / DNS64 (RFC 6146)", "IPv6-only clients to IPv4-only servers", "Translates IPv6 headers to IPv4 headers using synthetic DNS", "Modern IPv6-only cellular networks accessing legacy IPv4 websites", "Moderate; transparent to standard web clients"]
        ],
        n: "Port Address Translation (PAT), or NAPT, operates by maintaining a stateful translation table in router memory. When an internal private host (192.168.1.50:52310) initiates an outbound TCP connection to a public web server (93.184.216.34:443), the NAT router intercepts the packet. It replaces the private source IP with its own public WAN IP (203.0.113.1) and assigns an available temporary external port (40001). The router writes a translation record: (Protocol: TCP, Private IP: 192.168.1.50, Private Port: 52310, Public IP: 203.0.113.1, Public Port: 40001, Destination IP: 93.184.216.34, Destination Port: 443). The router updates the IPv4 header checksum and the TCP pseudo-header checksum, then transmits the packet. When the web server replies to 203.0.113.1:40001, the NAT gateway searches its state table, translates the destination back to 192.168.1.50:52310, and forwards the packet into the LAN. NAT fundamentally breaks peer-to-peer protocols (such as VoIP SIP and WebRTC video) because endpoints behind NAT cannot know their public IP or receive unsolicited inbound connections, necessitating NAT traversal protocols: STUN (Session Traversal Utilities for NAT, RFC 5389) to discover public IP/port bindings, and TURN (Traversal Using Relays around NAT, RFC 5766) to relay media traffic through an intermediate server when symmetric NAT blocks direct P2P connections."
      },
      miss: [
        {
          w: "Network Address Translation is a security firewall that protects internal networks from malware.",
          r: "NAT is an address multiplexing mechanism, not a security firewall; while it drops unsolicited inbound connections by default due to missing state table entries, it does not inspect packet payloads, block malicious outbound connections, or prevent command-and-control malware traffic."
        },
        {
          w: "Devices behind a NAT router cannot communicate using UDP because UDP is connectionless.",
          r: "NAT gateways maintain stateful UDP translation timers (typically 30–60 seconds); when an internal host transmits a UDP datagram, the router creates a translation mapping that permits inbound replies to that port until the inactivity timer expires."
        },
        {
          w: "Every NAT router handles inbound traffic mappings in the exact same standardized way.",
          r: "NAT implementations vary wildly in NAT mapping behavior (Full Cone, Restricted Cone, Port Restricted Cone, and Symmetric NAT); symmetric NAT assigns different public ports for different destinations, making direct peer-to-peer hole-punching impossible without TURN relays."
        },
        {
          w: "IPv6 networks require NAT just like IPv4 to secure private devices.",
          r: "IPv6 eliminates the need for NAT by providing every device with a globally unique address; security is enforced via stateful firewall rules that drop unsolicited inbound packets rather than address translation."
        }
      ],
      trade: {
        buys: [
          "Preserved IPv4 viability: extended the practical operational lifespan of IPv4 for three decades past address exhaustion.",
          "Internal IP renumbering independence: change public ISPs without having to reconfigure IP addresses on thousands of internal hosts.",
          "Default inbound privacy: shields internal network IP topologies and host counts from external internet reconnaissance.",
          "Cost consolidation: connect thousands of corporate workstations to the public Internet using a single billed public IP address."
        ],
        costs: [
          "Destruction of the End-to-End Principle: devices behind NAT cannot act as peer-to-peer servers without port forwarding or relays.",
          "Router memory and CPU exhaustion: state tables consume router RAM; high connection rates can exhaust state memory and drop packets.",
          "Protocol breakage: protocols embedding IP addresses inside payloads (FTP active mode, SIP) require complex Application Layer Gateways (ALGs).",
          "Logging and forensics friction: external web servers see only the shared public IP, obscuring which internal host generated malicious requests."
        ],
        avoid: [
          "Deploying SIP or WebRTC applications without configuring STUN/TURN servers to handle symmetric NAT traversal.",
          "Enabling buggy router Application Layer Gateways (SIP ALG) on office routers, which frequently corrupts VoIP packets.",
          "Relying on NAT as a substitute for a true stateful inspection firewall or network segmentation.",
          "Allowing internal applications to transmit private RFC 1918 addresses in public API responses or DNS records."
        ]
      }
    },
    {
      slug: "dhcp",
      why: {
        before: "In early computer networks, every workstation, printer, and server required manual static configuration by a systems administrator who physically typed in the IP address, subnet mask, default gateway, and DNS servers on each machine.",
        problem: "Manual configuration was tedious, caused frequent duplicate IP address conflicts that crashed network connectivity, made mobile laptops unable to transition between office buildings, and caused widespread outages whenever network parameters (such as a DNS server IP) changed.",
        shift: "The Dynamic Host Configuration Protocol (DHCP, RFC 2131 in 1997, evolving from BOOTP RFC 951) automated network onboarding: devices broadcast requests upon joining a network and automatically lease valid IP addresses, default gateways, and configuration parameters from a centralized server."
      },
      num: {
        t: "DHCP DORA Exchange Protocol Lifecycle",
        h: ["DORA Phase", "Message Type", "Layer 2 / Layer 3 Addressing", "Information Carried / Proposed", "Client Operating State"],
        r: [
          ["1. Discover", "DHCPDISCOVER", "L2: FF:FF:FF:FF:FF:FF / L3: 0.0.0.0 -> 255.255.255.255", "Client MAC address, requested parameters list (Option 55), Transaction ID", "INIT (Client has no IP; broadcasts to local segment)"],
          ["2. Offer", "DHCPOFFER", "L2: Broadcast or Unicast / L3: Server IP -> 255.255.255.255", "Proposed IP, Subnet Mask (Opt 1), Router Gateway (Opt 3), DNS (Opt 6), Lease Time", "SELECTING (Evaluates offers from available servers)"],
          ["3. Request", "DHCPREQUEST", "L2: FF:FF:FF:FF:FF:FF / L3: 0.0.0.0 -> 255.255.255.255", "Publicly requests specific server's IP; notifies other servers to release reservations", "REQUESTING (Waiting for final confirmation)"],
          ["4. Acknowledge", "DHCPACK (or DHCPNAK)", "L2: Broadcast or Unicast / L3: Server IP -> 255.255.255.255", "Final lease commitment, renewal timers (T1=50%, T2=87.5%), committed IP options", "BOUND (Configures interface; initiates ARP probe)"]
        ],
        n: "DHCP operates over UDP port 67 (server) and port 68 (client). The four-step onboarding sequence is known as DORA (Discover, Offer, Request, Acknowledge). Because a booting client has no assigned IP, it transmits a DHCPDISCOVER broadcast from source 0.0.0.0 to destination 255.255.255.255. To span multiple subnets, intermediate routers run DHCP Relay Agents (ip helper-address), converting client Layer 2 broadcasts into unicast UDP packets forwarded to a centralized DHCP server. The server responds with DHCPOFFER, reserving an available address from its IP pool. The client broadcasts DHCPREQUEST: this broadcast is critical because it publicly announces which server's offer was accepted, allowing competing DHCP servers on the subnet to release their unselected reserved addresses back to their free pools. The chosen server records the binding in its lease database and transmits DHCPACK. Upon receiving the ACK, modern operating systems execute an ARP probe (broadcasting an ARP request for the newly assigned IP) to verify no duplicate host is silently using the address before activating the interface. Lease maintenance is governed by two internal timers: at T1 (0.5 * Lease Time), the client attempts unicast renewal via DHCPREQUEST; if unanswered, at T2 (0.875 * Lease Time), it broadcasts to find any available DHCP server."
      },
      miss: [
        {
          w: "Once a device receives a DHCP IP address, it owns that address permanently.",
          r: "DHCP addresses are leased temporarily (typically 8 hours to 7 days); if a client disconnects and fails to renew its lease before expiration, the server reallocates the IP address to a different device."
        },
        {
          w: "DHCP traffic cannot cross network routers into other subnets.",
          r: "While raw DHCP broadcasts cannot cross routers, enterprise routers configure DHCP Relay Agents (RFC 1542 / ip helper-address) that intercept local broadcasts, encapsulate them into unicast IP packets, and forward them to central DHCP servers across WANs."
        },
        {
          w: "Any computer connected to an office network can safely run a DHCP server without issues.",
          r: "A rogue DHCP server (e.g., an accidental home Wi-Fi router plugged into an office port) will hand out incorrect gateways and DNS servers to nearby machines, causing instant network outages or Man-in-the-Middle attacks (mitigated by DHCP Snooping)."
        },
        {
          w: "DHCP provides cryptographically secure authentication of connecting devices by default.",
          r: "Standard DHCP is unauthenticated; any device can spoof MAC addresses to exhaust available IP pools (DHCP starvation attack) or inject rogue DHCP responses unless network switches enforce 802.1X and DHCP Snooping."
        }
      ],
      trade: {
        buys: [
          "Automated client onboarding: zero-touch configuration for laptops, smartphones, IoT devices, and virtual machines.",
          "Centralized network administration: update corporate DNS servers or default gateways across thousands of hosts by editing one server config.",
          "Efficient address recycling: automatically reclaims and reuses IP addresses from transient or offline devices.",
          "Prevention of IP address conflicts: centralized server guarantees that identical IP addresses are never leased to two active hosts."
        ],
        costs: [
          "Single point of failure: if the DHCP server fails or address pools are exhausted, new devices cannot obtain network connectivity.",
          "Broadcast overhead: initial discovery floods local Layer 2 broadcast domains with broadcast packets.",
          "Rogue server vulnerability: vulnerable to rogue DHCP servers and starvation attacks without switch-level DHCP Snooping.",
          "Dynamic address instability: servers and printers require explicit static DHCP reservations (MAC bindings) to maintain predictable IPs."
        ],
        avoid: [
          "Deploying enterprise networks without enabling DHCP Snooping on access switches to block unauthorized rogue DHCP servers.",
          "Configuring short lease times (e.g., 5 minutes) on large networks, which generates unnecessary DHCP packet broadcast floods.",
          "Using dynamic DHCP without static reservations for core infrastructure servers (databases, domain controllers, DNS servers).",
          "Creating overlapping IP address pools on separate uncoordinated DHCP servers on the same physical subnet."
        ]
      }
    },
    {
      slug: "router",
      why: {
        before: "Early local networks were connected together using physical repeaters or Layer 2 bridges, forming massive, flat broadcast domains where every Ethernet broadcast frame was flooded to every connected computer.",
        problem: "Flat bridged networks suffered from broadcast storms that saturated network bandwidth, could not connect disparate network architectures (like Token Ring, Ethernet, and serial WAN lines), lacked path redundancy, and could not scale beyond a few hundred machines.",
        shift: "Routers (Layer 3 intermediate systems) established the foundation of internetworking, terminating broadcast domains, interconnecting distinct logical IP subnets, and dynamically determining the optimal path for packets across global topologies using routing protocols (BGP, OSPF)."
      },
      num: {
        t: "Router Architectural Classes & Capabilities",
        h: ["Router Class", "Forwarding Plane Implementation", "Throughput & Port Density", "Routing Table Capacity (FIB/RIB)", "Primary Deployment Role"],
        r: [
          ["Software Router (Linux / VyOS)", "General-purpose x86 CPU + kernel networking stack / DPDK", "10–100 Gbps; standard PCIe NICs", "Hundreds of thousands of routes in kernel RAM", "Branch office, virtualized edge firewall, lab routing"],
          ["Enterprise Branch Router (Cisco ISR)", "Multi-core NPU (Network Processor) + hardware crypto engine", "1–10 Gbps; modular WAN interfaces (T1, cellular, fiber)", "~1 million routes in dedicated NPU memory", "Corporate branch offices, SD-WAN edge gateways"],
          ["Core Backbone Router (Cisco 8000 / Juniper PTX)", "Custom ASICs (e.g., Cisco Silicon One, Juniper Express) + TCAM", "10–100+ Terabits/sec; 400G/800G optical ports", "Millions of routes searched in hardware TCAM at line rate", "Tier-1 Internet Service Providers, cloud hyperscale backbones"],
          ["Cloud Virtual Router (AWS Transit Gateway)", "Distributed software-defined SDN hypervisor overlay (Nitro)", "50 Gbps per attachment; virtually infinite aggregate", "Proprietary cloud routing tables (up to 10,000 routes)", "Interconnecting hundreds of VPCs and on-premise VPNs"]
        ],
        n: "A router operates on two strictly decoupled functional planes: the Control Plane and the Data Plane (Forwarding Plane). The Control Plane runs routing protocol daemons (such as BGP, OSPF, and IS-IS) in general-purpose CPU memory, exchanging link-state or path-vector metrics with neighboring routers to construct the global Routing Information Base (RIB). The router compiles the RIB into an optimized, flat Forwarding Information Base (FIB) and downloads it directly to the Data Plane. The Data Plane processes packets at line rate using specialized Application-Specific Integrated Circuits (ASICs) and Ternary Content-Addressable Memory (TCAM). The step-by-step packet forwarding lifecycle per hop is: 1) The router receives a Layer 2 frame and verifies the Frame Check Sequence (FCS) CRC; 2) It strips the Layer 2 Ethernet header; 3) It verifies the IPv4 header checksum; 4) It decrements the IPv4 Time-to-Live (TTL) or IPv6 Hop Limit by 1 (if TTL=0, it discards the packet and transmits an ICMP Time Exceeded message to the sender); 5) It performs a Longest Prefix Match (LPM) query in the FIB TCAM to determine the egress interface and next-hop IP; 6) It resolves the next-hop IP to a Layer 2 destination MAC via its local ARP/NDP cache; 7) It prepends a brand new Layer 2 frame header with its own egress MAC as source and the next-hop MAC as destination; 8) It recomputes the IPv4 header checksum and Layer 2 FCS, and transmits the frame out the egress interface."
      },
      miss: [
        {
          w: "A router preserves the original Ethernet frame and MAC addresses as a packet traverses the Internet.",
          r: "Layer 2 Ethernet frames are stripped and discarded at every single router hop; only the inner Layer 3 IP packet survives across routers, with brand new Layer 2 frame headers constructed for each physical hop."
        },
        {
          w: "Routers choose paths based purely on physical geographic distance between servers.",
          r: "Routers make decisions based on protocol-specific metrics (OSPF uses interface cost/bandwidth, while BGP uses complex autonomous system path policies, local preference, and peering business relationships, completely independent of physical mileage)."
        },
        {
          w: "A standard consumer Wi-Fi box is purely a router.",
          r: "A consumer 'Wi-Fi router' is actually four distinct devices consolidated into one plastic enclosure: a Layer 3 router, a 4-port Layer 2 Ethernet switch, an 802.11 Wi-Fi Access Point, a NAT gateway, and a DHCP/DNS caching server."
        },
        {
          w: "Routers queue and store dropped packets until network congestion clears.",
          r: "Routers possess finite hardware packet buffers; when input or output queues fill during microbursts (bufferbloat), routers immediately discard incoming packets (tail drop or active queue management like CoDel/RED)."
        }
      ],
      trade: {
        buys: [
          "Broadcast isolation: terminates Layer 2 broadcast domains, preventing local traffic storms from spreading across the enterprise.",
          "Dynamic fault tolerance: routing protocols automatically reroute packets around severed cables or failed transit providers.",
          "Hierarchical network scaling: enables billions of machines to communicate globally without requiring flat MAC address tables.",
          "Traffic engineering and QoS: allows administrators to prioritize critical traffic (VoIP, database queries) over bulk file downloads."
        ],
        costs: [
          "Per-hop processing latency: inspecting headers, decrementing TTL, recalculating checksums, and switching add microseconds of latency.",
          "Packet fragmentation overhead: routers must drop or fragment packets that exceed an egress interface's Maximum Transmission Unit (MTU).",
          "Hardware expense: high-speed backbone routers with multi-terabit ASICs and TCAM cost hundreds of thousands of dollars.",
          "Protocol convergence delays: when physical links fail, dynamic routing protocols require time to recalculate loop-free topologies."
        ],
        avoid: [
          "Creating routing loops by configuring conflicting static routes on adjacent routers.",
          "Configuring large interface buffers on routers, which causes severe 'bufferbloat' latency spikes under heavy load.",
          "Permitting asymmetric MTUs along a network path without verifying Path MTU Discovery (PMTUD) and ICMP Type 3 Code 4 delivery.",
          "Running unauthenticated dynamic routing protocols (OSPF/BGP) vulnerable to malicious route injection and BGP hijacking."
        ]
      }
    },
    {
      slug: "switch",
      why: {
        before: "Early local area Ethernet networks connected computers using multi-port repeaters (Hubs) or shared coaxial cables (10BASE5 / 10BASE2).",
        problem: "Hubs operated as a single, shared collision domain; if two computers transmitted at the exact same moment, electrical signals collided, corrupting frames and triggering CSMA/CD exponential backoff delays. As traffic exceeded 30% of capacity, bandwidth collapsed, and all computers could eavesdrop on all traffic.",
        shift: "The network switch (Layer 2 multi-port bridge) introduced micro-segmentation, providing dedicated, collision-free full-duplex transmission paths between individual ports by dynamically learning MAC addresses and switching frames in hardware."
      },
      num: {
        t: "Network Switch Architectural Tiers Comparison",
        h: ["Switch Tier / Category", "Forwarding Layer", "Switching Fabric Architecture", "VLAN & Security Features", "Dominant Enterprise Deployment"],
        r: [
          ["Unmanaged Desktop Switch", "Layer 2 only", "Store-and-forward shared memory ASIC", "None; single flat broadcast domain", "Home offices, small workgroups, desktop expansion"],
          ["Enterprise Managed L2 Switch", "Layer 2 (with L3 awareness)", "Non-blocking crossbar switching fabric", "802.1Q VLANs, 802.1X port auth, Dynamic ARP Inspection (DAI)", "Enterprise campus access layer, wiring closets"],
          ["Layer 3 Switch (Multilayer / MLS)", "Layer 2 + Layer 3 hardware routing", "High-speed ASIC performing wire-speed IP routing", "Inter-VLAN routing, OSPF, BGP, Access Control Lists (ACLs)", "Enterprise core/distribution layers, datacenter top-of-rack (ToR)"],
          ["Datacenter Whitebox Switch", "Layer 2 / Layer 3 programmable", "High-radix merchant silicon (e.g., Broadcom Tomahawk)", "VXLAN EVPN overlays, RoCEv2 (RDMA over Converged Ethernet)", "Hyperscale cloud datacenters, AI training GPU clusters"]
        ],
        n: "A network switch operates on the Data Link Layer (Layer 2). Its internal processing pipeline is governed by four core actions: Learning, Flooding, Filtering, and Forwarding. The switch maintains a Content-Addressable Memory (CAM) table (or MAC address table) that maps hardware MAC addresses to physical port numbers and VLAN IDs. When an Ethernet frame enters Port 1 with Source MAC A and Destination MAC B: 1) **Learning**: The switch inspects the Source MAC A and records that MAC A is reachable on Port 1, resetting its 300-second aging timer; 2) **Lookup**: The switch queries the CAM table for Destination MAC B; 3) **Forwarding / Filtering**: If MAC B is found in the table associated with Port 4, the switch directs the frame exclusively out of Port 4, filtering it from all other ports (creating an isolated, collision-free conversation); 4) **Flooding**: If Destination MAC B is unknown (Unknown Unicast) or is the broadcast address (FF:FF:FF:FF:FF:FF), the switch floods the frame out of all ports belonging to that VLAN except Port 1. To prevent catastrophic 'broadcast storms' caused by redundant cabling loops, switches execute the Spanning Tree Protocol (STP / Rapid STP - IEEE 802.1w), mathematically computing a loop-free tree topology and placing redundant physical ports into a blocking state until a primary link fails."
      },
      miss: [
        {
          w: "A network switch eliminates all network collisions, even on half-duplex connections.",
          r: "Switches eliminate collisions only when operating in full-duplex mode; connecting a legacy half-duplex device still relies on CSMA/CD collision detection on that specific port segment."
        },
        {
          w: "Switches prevent broadcast packets from reaching other computers on the network.",
          r: "Switches isolate collision domains, but they forward broadcast frames (FF:FF:FF:FF:FF:FF) out of every single port; containing broadcasts requires partitioning the switch into distinct VLANs or routing through Layer 3 boundaries."
        },
        {
          w: "A Layer 3 switch is identical in performance to a traditional software router.",
          r: "A Layer 3 switch routes packets in dedicated hardware ASICs at wire speed (terabits per second) with low latency, but lacks the complex WAN interface modules, deep packet inspection, and massive routing table capacities of dedicated edge routers."
        },
        {
          w: "Ethernet switches inspect IP addresses to deliver packets between office computers.",
          r: "Standard Layer 2 switches have zero awareness of IP addresses; they read only the 48-bit hardware MAC addresses in the Layer 2 Ethernet frame header."
        }
      ],
      trade: {
        buys: [
          "Micro-segmentation: eliminates shared collisions, granting each connected port dedicated full-duplex line-rate bandwidth.",
          "Traffic privacy: packets are delivered only to the intended recipient's physical port, preventing eavesdropping sniffer attacks.",
          "VLAN network segmentation: isolate corporate departments (Finance, Engineering, Guests) logically across shared physical switches.",
          "Hardware wire-speed forwarding: non-blocking switching fabrics transfer gigabits or terabits per second with sub-microsecond latency."
        ],
        costs: [
          "CAM table overflow vulnerabilities: MAC flooding attacks flood fake MAC addresses, forcing the switch to act like a hub and broadcast all traffic.",
          "Spanning Tree convergence disruption: link flaps in large STP topologies trigger topology change notifications (TCNs), causing temporary packet loss.",
          "Broadcast domain scaling limits: flat Layer 2 networks cannot scale beyond a few thousand endpoints due to cumulative broadcast noise.",
          "Configuration complexity: managed enterprise switches require extensive configuration for trunking, port security, and 802.1X authentication."
        ],
        avoid: [
          "Disabling Spanning Tree Protocol (STP) to speed up port initialization (use 'PortFast' / 'Edge Port' instead).",
          "Deploying flat Layer 2 enterprise networks with thousands of hosts without subnetting and VLAN segmentation.",
          "Leaving unused switch ports in the default VLAN (VLAN 1) with administrative access enabled.",
          "Allowing physical loops in unmanaged switches that lack Spanning Tree support, causing immediate broadcast storms."
        ]
      }
    },
    {
      slug: "mac-address",
      why: {
        before: "In early point-to-point serial communications, devices were hardwired directly to specific communication channels without needing physical device identifiers.",
        problem: "As shared multi-access media (like coaxial Ethernet 10BASE5 and radio frequencies) emerged, multiple network adapters shared the exact same physical transmission medium; transmitters had no universal way to ensure a signal was processed only by the intended recipient on that physical wire.",
        shift: "The Media Access Control (MAC) address (standardized by the IEEE 802 committee) established a globally unique, 48-bit physical hardware identifier burned into the firmware of every Network Interface Card (NIC), governing local Layer 2 frame delivery."
      },
      num: {
        t: "MAC Address Bit Structure & Framing Semantics",
        h: ["Address Field / Component", "Bit Length & Position", "Value Interpretation", "Architectural Function", "Security & Tracking Role"],
        r: [
          ["Organizationally Unique Identifier (OUI)", "First 24 bits (Bits 0–23)", "Vendor prefix assigned by IEEE (e.g., 00:1A:2B)", "Identifies hardware manufacturer (Intel, Apple, Cisco)", "Used for device fingerprinting on local networks"],
          ["Network Interface Specific (NIC)", "Last 24 bits (Bits 24–47)", "Unique serialized identifier assigned by vendor", "Guarantees global uniqueness among vendor's devices", "Hardware serial identifier on local link"],
          ["Individual / Group Bit (I/G)", "Bit 0 of the first octet (LSB)", "0 = Unicast / 1 = Multicast or Broadcast", "Differentiates single-device targets from group broadcasts", "01:00:5E:... indicates IPv4 Multicast; FF:FF:FF:FF:FF:FF is Broadcast"],
          ["Universally / Locally Administered (U/L)", "Bit 1 of the first octet", "0 = Universally administered (IEEE OUI) / 1 = Locally administered (LAA)", "Indicates whether address was burned at factory or overridden", "Modern mobile OS MAC randomization sets U/L bit to 1"]
        ],
        n: "A standard MAC address (EUI-48) consists of 48 bits, represented as twelve hexadecimal digits grouped in pairs separated by colons or hyphens (e.g., 00:14:22:01:23:45). In the first octet, the two least significant bits govern global addressing rules: the Individual/Group (I/G) bit denotes whether the address is Unicast (0) or Multicast/Broadcast (1); the Universally/Locally Administered (U/L) bit denotes whether the address conforms to the factory IEEE OUI (0) or has been overridden as a Locally Administered Address (1). Layer 2 Ethernet frame delivery relies on Address Resolution Protocol (ARP / RFC 826) in IPv4 and Neighbor Discovery Protocol (NDP / RFC 4861) in IPv6. When Host A wishes to transmit an IP packet to Host B on the same local subnet, Host A checks its kernel ARP cache. On a cache miss, Host A broadcasts an ARP Request: 'Who has IP 192.168.1.50? Tell 192.168.1.10'. Host B receives the broadcast and unicasts an ARP Reply containing its MAC address. Host A caches the binding and wraps the IP packet inside an Ethernet frame with Host B's MAC as destination. Because static MAC addresses expose mobile devices to physical location tracking across Wi-Fi networks, modern operating systems (iOS, Android, Windows) employ MAC Address Randomization, generating rotated Locally Administered Addresses for each Wi-Fi SSID."
      },
      miss: [
        {
          w: "A MAC address is physically permanent and impossible to change or spoof.",
          r: "While the MAC address is burned into NIC ROM at the factory, operating system drivers allow users to easily spoof or override the active MAC address in software (via 'ip link set dev eth0 address' or MAC randomization)."
        },
        {
          w: "Your computer's MAC address is transmitted across the Internet to the websites you visit.",
          r: "MAC addresses operate strictly within the local Layer 2 broadcast domain; the first router hop strips the Ethernet frame, meaning external web servers across the Internet see only your public IP address, never your MAC address."
        },
        {
          w: "MAC address filtering on a Wi-Fi router provides strong security against unauthorized access.",
          r: "MAC addresses are transmitted unencrypted in cleartext in every 802.11 Wi-Fi frame; an attacker can sniff authorized MAC addresses using a passive Wi-Fi monitor and spoof an authorized MAC in seconds."
        },
        {
          w: "Two devices in the world can never have the exact same MAC address.",
          r: "Manufacturing errors, virtual machine cloning, container interface generation, and software spoofing frequently produce duplicate MAC addresses, causing erratic ARP flapping and frame loss on shared local switches."
        }
      ],
      trade: {
        buys: [
          "Hardware-level framing: provides unambiguous local delivery of raw electrical, optical, and radio signals between network interfaces.",
          "Plug-and-play local connectivity: devices communicate over local Ethernet cables or Wi-Fi without needing prior IP configuration.",
          "Micro-segmentation indexing: enables Layer 2 switches to direct frames directly to specific physical ports via CAM tables.",
          "Privacy defense via randomization: rotating locally administered MAC addresses defeats physical retail and urban tracking."
        ],
        costs: [
          "Non-hierarchical scalability limit: flat 48-bit MAC addresses cannot be aggregated into routing prefixes, limiting scalability to single LANs.",
          "ARP spoofing vulnerability: unauthenticated ARP allows local attackers to poison ARP caches and execute Man-in-the-Middle attacks.",
          "CAM table overflow risks: malicious hosts can flood fake MAC addresses to exhaust switch memory and compromise security.",
          "Ephemeral tracking friction: MAC randomization breaks enterprise network authentication schemes that rely on static hardware MACs."
        ],
        avoid: [
          "Relying on MAC address whitelisting as a primary security perimeter for enterprise wireless networks.",
          "Allowing static MAC address definitions in virtual machine templates that cause duplicate MAC conflicts when cloned.",
          "Deploying local enterprise networks without Dynamic ARP Inspection (DAI) to protect against ARP cache poisoning attacks.",
          "Assuming local Layer 2 broadcast domains can scale to tens of thousands of hosts without running into ARP storm limits."
        ]
      }
    },
    {
      slug: "socket",
      why: {
        before: "In early operating systems, inter-process communication (IPC) was confined to local mechanisms (like pipes, message queues, and shared memory) that could not cross physical machine boundaries.",
        problem: "Programmers had no unified, standardized programming interface to communicate with processes over a network without writing bespoke device drivers, managing raw network card buffers, and manually assembling packets in assembly language.",
        shift: "The Berkeley Sockets API (introduced in 4.2BSD UNIX in 1983) established a universal programming abstraction that treated network connections as standard operating system file descriptors, unifying local IPC and global internetworking under standard POSIX system calls."
      },
      num: {
        t: "Berkeley Socket Types & Paradigms Comparison",
        h: ["Socket Family & Type", "Underlying Protocol", "Connection Paradigm", "Data Delivery Semantics", "Primary Application Use Case"],
        r: [
          ["AF_INET / SOCK_STREAM", "TCP (RFC 793 / 9293)", "Connection-oriented (Handshake required)", "Reliable, ordered, bidirectional continuous byte stream", "Web servers (HTTP), database connections, SSH, RPC"],
          ["AF_INET / SOCK_DGRAM", "UDP (RFC 768)", "Connectionless (Sendto/recvfrom)", "Unreliable, unordered, discrete message datagrams", "DNS queries, real-time gaming, VoIP, QUIC/HTTP/3"],
          ["AF_UNIX / SOCK_STREAM", "UNIX Domain Socket (UDS)", "Local connection-oriented", "High-speed in-memory byte stream; zero network stack overhead", "Local inter-process communication, Docker daemon socket"],
          ["AF_INET / SOCK_RAW", "Raw IP / ICMP / Custom", "Connectionless raw packet access", "Unfiltered access to raw IP headers and payload bytes", "Network diagnostic tools (ping / traceroute), packet sniffers"],
          ["AF_PACKET / SOCK_RAW", "Raw Ethernet Layer 2", "Raw link-layer frames", "Direct access to raw Layer 2 Ethernet frames including MAC headers", "Wireshark, tcpdump, low-level link discovery daemons"]
        ],
        n: "The Berkeley Socket API models network communication through an operating system file descriptor. For a TCP server, the operational lifecycle proceeds through five fundamental system calls: 1) socket(AF_INET, SOCK_STREAM, 0) allocates an endpoint and returns an unbonded file descriptor; 2) bind(fd, &sockaddr, sizeof) binds the socket to a specific local IP address and port number; 3) listen(fd, backlog) marks the socket as passive and configures the kernel connection backlog queue; 4) accept(fd, &client_addr, &len) blocks until a client completes the TCP three-way handshake, returning a brand new connected file descriptor dedicated to that specific connection while leaving the listening socket available for new clients; 5) read()/recv() and write()/send() transfer data. Sockets do not write directly to the network wire: calling write() copies user-space bytes into the kernel's Socket Send Buffer (SO_SNDBUF). The TCP stack segments this buffer into packets bounded by the Maximum Segment Size (MSS) and governed by the sliding congestion window. When incoming packets arrive from the network card via hardware interrupts, the kernel places the reassembled bytes into the Socket Receive Buffer (SO_RCVBUF), where a subsequent read() copies them into application memory."
      },
      miss: [
        {
          w: "A TCP socket is a message-oriented pipe where one write() call corresponds exactly to one read() call on the other side.",
          r: "TCP is a raw, unstructured byte stream with zero concept of message boundaries; writing 100 bytes once might be delivered to the receiving socket as ten 10-byte chunks or one 100-byte chunk depending on network fragmentation and buffering."
        },
        {
          w: "Closing a socket with close() immediately sends a FIN packet and discards all data in flight.",
          r: "By default, close() executes gracefully in the background: it flushes unsent send-buffer data, transmits a FIN packet, and enters the TIME_WAIT state unless SO_LINGER is configured to abort forcefully with a TCP RST."
        },
        {
          w: "A server needs a separate open network port for every single concurrent client connection.",
          r: "A server binds and listens on a single port (e.g., port 443); each accepted client receives a new file descriptor, but all connections share the same local port, differentiated in the kernel by the client's remote IP and remote port."
        },
        {
          w: "UNIX domain sockets (AF_UNIX) have the same performance as loopback network sockets (127.0.0.1).",
          r: "UNIX domain sockets bypass the entire TCP/IP network stack (no IP encapsulation, no checksumming, no packet serialization, no routing), running up to 2x to 3x faster with significantly lower CPU overhead than loopback TCP sockets."
        }
      ],
      trade: {
        buys: [
          "Universal I/O abstraction: communicate across local processes or global servers using standard POSIX read(), write(), and close().",
          "Decoupled network layers: applications write to socket buffers without needing to manage TCP sequence numbers or IP routing.",
          "High performance via kernel buffering: asynchronous kernel send/receive buffers maximize network throughput and absorb bursts.",
          "Rich socket option tuning: fine-tune TCP behavior using setsockopt (TCP_NODELAY, SO_REUSEPORT, SO_KEEPALIVE)."
        ],
        costs: [
          "Memory overhead per socket: kernel send and receive buffers consume 64 KB to several megabytes of non-swappable RAM per socket.",
          "File descriptor limits: operating systems limit open file descriptors per process (RLIMIT_NOFILE), capping concurrent connections.",
          "Kernel memory copy penalty: transferring data requires copying bytes between user space and kernel socket buffers (mitigated by sendfile()).",
          "Blocking I/O bottlenecks: default blocking sockets require one thread per connection, causing thread thrashing under high concurrency."
        ],
        avoid: [
          "Assuming read() will return the complete message in a single invocation without implementing length-prefix framing or delimiters.",
          "Failing to enable TCP_NODELAY on latency-critical RPC connections, which triggers 40 ms delays due to Nagle's algorithm and delayed ACKs.",
          "Creating millions of short-lived connections without tuning ephemeral port ranges and TIME_WAIT socket reuse (tcp_tw_reuse).",
          "Using loopback TCP sockets (127.0.0.1) for local inter-process communication when UNIX domain sockets (AF_UNIX) are available."
        ]
      }
    },
    {
      slug: "file-descriptor",
      why: {
        before: "Early operating systems provided distinct, incompatible APIs, system calls, and data structures for interacting with different hardware devices (such as disk drives, paper tapes, line printers, and serial terminals).",
        problem: "Software was tightly coupled to physical hardware types; an application written to output text to a physical terminal could not redirect its output to a disk file or across a network connection without rewriting and recompiling source code.",
        shift: "UNIX introduced the 'Everything is a File' paradigm, establishing the File Descriptor (an unsigned non-negative integer indexing a process-level table) as a universal, uniform handle to files, directories, pipes, terminals, block devices, and network sockets."
      },
      num: {
        t: "POSIX File Descriptors & Kernel Data Structure Hierarchy",
        h: ["Structure / Level", "Scope & Ownership", "Array Index / Identifier", "State Data Stored", "System Call Interactions"],
        r: [
          ["Standard Streams (0, 1, 2)", "Per-Process", "FD 0 (stdin), FD 1 (stdout), FD 2 (stderr)", "Pre-allocated standard I/O streams bound to terminal or pipes", "read(0), write(1), write(2)"],
          ["Process File Descriptor Table", "Per-Process (in task_struct)", "Integer index (0, 1, 2, 3... up to ulimit -n)", "Descriptor flags (e.g., FD_CLOEXEC) + pointer to Open File Description", "dup(), dup2(), fcntl(), close()"],
          ["Open File Description Table", "System-wide (Kernel space)", "Shared kernel struct file pointer", "Current byte offset, file status flags (O_NONBLOCK, O_APPEND), refcount", "lseek(), read(), write()"],
          ["VFS Inode Table / vnode", "System-wide (Kernel space)", "Filesystem inode number / struct inode", "File size, permissions (st_mode), disk extent pointers, file locks", "stat(), fstat(), truncate(), flock()"]
        ],
        n: "In POSIX operating systems, file descriptor operations traverse a three-tiered kernel abstraction hierarchy. 1) The **Process File Descriptor Table** is a dynamic array stored in the process's task_struct. An integer file descriptor (such as 3) simply indexes this array. Each entry contains a single flag (FD_CLOEXEC, which determines whether the descriptor survives an execve() call) and a pointer to an entry in the system-wide Open File Description Table. 2) The **Open File Description Table** stores the runtime state of the active open instance: the current file offset pointer (seek position), file access mode (O_RDONLY, O_WRONLY), status flags (such as O_NONBLOCK), and a reference counter. When a process calls fork(), the child process inherits an identical copy of the parent's file descriptor table: both parent and child descriptors point to the *exact same* Open File Description, meaning if the child reads 50 bytes and advances the file offset, the parent's file offset advances simultaneously. 3) The Open File Description points to the **VFS Inode** (or vnode), which represents the concrete underlying object on disk, managing file metadata, storage extents, and filesystem operations. Operating systems enforce strict descriptor limits per process (RLIMIT_NOFILE, viewed via 'ulimit -n', typically defaulting to 1024); exhausting descriptors triggers the catastrophic EMFILE ('Too many open files') error, preventing web servers from accepting new connections."
      },
      miss: [
        {
          w: "File descriptors 0, 1, and 2 are hardcoded by the kernel and can never be closed or redirected.",
          r: "Descriptors 0 (stdin), 1 (stdout), and 2 (stderr) are standard conventions established at program launch; shell redirection (<, >, 2>&1) uses dup2() to close and rewire these descriptors to arbitrary files, pipes, or sockets."
        },
        {
          w: "Two processes with an open file descriptor numbered '3' are accessing the exact same file.",
          r: "File descriptor integers are strictly local to each process's private descriptor table; FD 3 in Process A might point to an open network socket while FD 3 in Process B points to a local log file on disk."
        },
        {
          w: "Garbage collectors in languages like Java, Python, or Go automatically close leaked file descriptors safely.",
          r: "Garbage collectors clean up user-space object memory, but finalizers or destructors that close OS file descriptors execute unpredictably; failing to close files or sockets explicitly (e.g., using try-with-resources or defer) rapidly causes EMFILE descriptor exhaustion."
        },
        {
          w: "Closing a file descriptor with close() immediately frees the underlying file on disk.",
          r: "close() merely closes the descriptor in the current process and decrements the open file description's reference count; a file is deleted only when its inode link count reaches zero *and* all processes close their descriptors."
        }
      ],
      trade: {
        buys: [
          "Universal I/O polymorphism: read and write to files, sockets, pipes, and devices using identical system call interfaces.",
          "Composable shell pipelines: redirect and chain process inputs and outputs cleanly via dup2() and anonymous pipes.",
          "Efficient integer identification: lightweight 32-bit integers minimize memory overhead in user space and system call arguments.",
          "Event multiplexing readiness: pass integer descriptors directly to high-performance event demultiplexers (epoll, kqueue)."
        ],
        costs: [
          "Descriptor leak exhaustion: unclosed sockets or files consume process table slots until reaching ulimit -n, freezing applications.",
          "Accidental descriptor inheritance: descriptors without FD_CLOEXEC leak into spawned child processes, causing security vulnerabilities.",
          "Kernel memory consumption: every open file descriptor allocates kernel state structures (file structs, buffers, socket caches).",
          "Race conditions in multi-threaded code: thread A closing FD 4 while thread B opens a new file can lead to thread B writing to the wrong resource."
        ],
        avoid: [
          "Spawning child processes via fork/exec without setting the O_CLOEXEC or FD_CLOEXEC flag on sensitive open sockets and files.",
          "Leaving default 'ulimit -n 1024' limits unchanged on high-concurrency production database, proxy, or web server hosts.",
          "Relying on language garbage collectors to close database connections, file handles, or network sockets.",
          "Writing code that assumes standard streams (0, 1, 2) will always be open (closing stdin can cause open() to return FD 0)."
        ]
      }
    },
    {
      slug: "blocking-and-non-blocking-i-o",
      why: {
        before: "Standard operating system I/O operations were strictly synchronous and blocking: when a program called read() or write(), the kernel suspended thread execution until hardware completed the transfer.",
        problem: "In high-concurrency network servers (the 'C10K problem'), handling 10,000 concurrent client connections using blocking I/O required spawning 10,000 OS threads. Each thread consumed 2–8 MB of stack memory (tens of gigabytes total) and crippled CPU throughput via extreme context switch thrashing and scheduler lock contention.",
        shift: "Non-blocking I/O (via the O_NONBLOCK flag) combined with I/O event demultiplexing primitives (epoll on Linux, kqueue on BSD/macOS, and modern io_uring) enabled a single thread or small worker pool to monitor hundreds of thousands of concurrent sockets simultaneously, waking up only when descriptors are ready for I/O."
      },
      num: {
        t: "I/O Models & Multiplexing Mechanisms Comparison",
        h: ["I/O Architecture / Model", "Primary System Call", "Kernel Readiness Notification", "Algorithmic Scalability", "Dominant High-Performance Use Case"],
        r: [
          ["Blocking I/O (Thread-per-client)", "read(), write()", "Thread sleeps in kernel wait queue until data arrives", "O(N) thread memory; collapses past ~1,000 threads", "Simple CLI scripts, legacy Apache prefork, low-concurrency internal apps"],
          ["Non-Blocking Polling (Busy-Wait)", "read() with O_NONBLOCK", "Returns EAGAIN immediately if no data ready", "O(N) CPU thrashing; wastes 100% CPU spinning in loops", "Ultra-low latency trading hot-loops (spinning on dedicated core)"],
          ["I/O Multiplexing (select / poll)", "select(), poll()", "Kernel scans entire descriptor array on every call", "O(N) linear scan on every event loop iteration", "Legacy cross-platform portable network servers (<1,024 sockets)"],
          ["Event-Driven Demultiplexing (epoll / kqueue)", "epoll_wait(), kevent()", "Kernel callback places ready sockets onto ready-list queue", "O(1) constant time regardless of total tracked sockets", "Nginx, Node.js (libuv), Netty, Redis, Envoy, modern proxies"],
          ["Asynchronous Ring Completion (io_uring)", "io_uring_enter()", "Lock-free shared submission & completion ring buffers", "O(1) with zero syscall overhead in SQPOLL mode", "High-throughput NVMe SSD storage, cutting-edge Linux network servers"]
        ],
        n: "The fundamental limitation of legacy I/O multiplexing (select and poll) is algorithmic: the application passes an array of N file descriptors to the kernel; the kernel iterates over all N descriptors to check readiness (O(N)), and upon return, user space must iterate through the entire array again (O(N)) to find which sockets fired. Linux epoll solved this by establishing an O(1) event-driven architecture. The application calls epoll_create1() to allocate an eventpoll kernel structure containing a red-black tree (for storing registered file descriptors) and a ready list (a doubly linked list). When an application registers a socket via epoll_ctl(EPOLL_CTL_ADD), the kernel attaches a callback to the socket's internal wait queue. When a network packet arrives at the network card, the hardware interrupt invokes the driver callback, which places the ready socket directly onto epoll's ready list. When the application calls epoll_wait(), the thread sleeps until items appear on the ready list, returning only the active, fired file descriptors in O(1) time without scanning idle connections. epoll supports two operational modes: Level-Triggered (the default: epoll_wait notifies repeatedly as long as unread bytes remain in the socket buffer) and Edge-Triggered (EPOLLET: notifies strictly once when new data transitions into the buffer, requiring the application to drain the socket in a loop until read() returns EAGAIN or EWOULDBLOCK)."
      },
      miss: [
        {
          w: "Non-blocking I/O means that disk and file read operations complete asynchronously in the background.",
          r: "On standard POSIX filesystems, regular disk files ignore the O_NONBLOCK flag; read() on a regular file always blocks the thread while waiting for disk storage I/O, which is why Node.js and event loops use thread pools (libuv) or io_uring for disk operations."
        },
        {
          w: "Node.js and Python asyncio are multi-threaded because they handle thousands of requests simultaneously.",
          r: "Node.js and Python asyncio run application business logic on a single thread; they achieve massive concurrency by using non-blocking I/O event loops (epoll/kqueue) to multiplex thousands of waiting network sockets."
        },
        {
          w: "Edge-Triggered epoll is always faster and should be used instead of Level-Triggered epoll.",
          r: "Edge-Triggered epoll is notoriously difficult to program correctly: failing to drain the receive buffer in a loop until EAGAIN results in missed events that permanently hang connections; Level-Triggered epoll is safer and performs identically for most workloads."
        },
        {
          w: "Spawning 10,000 OS threads is an acceptable design on modern 64-bit multi-core servers.",
          r: "10,000 threads consume 40+ GB of RAM just for thread call stacks and overwhelm CPU cores with millions of context switches per second, destroying throughput compared to a single-threaded non-blocking event loop."
        }
      ],
      trade: {
        buys: [
          "Massive connection scalability: manage 100,000+ concurrent connections on a single server without thread memory exhaustion.",
          "Predictable low CPU overhead: event loops sleep when idle and wake up only to process sockets with active data ready.",
          "Single-threaded determinism: eliminates multi-threaded data races, deadlocks, and shared-memory mutex contention in business logic.",
          "High hardware efficiency: maximizes line-rate throughput by keeping CPU cores executing application logic rather than context switching."
        ],
        costs: [
          "Callback hell and async complexity: programming non-blocking state machines requires async/await runtimes or complex event loops.",
          "Event loop blocking vulnerability: a single long-running CPU calculation (e.g., JSON parsing or crypto) freezes the entire server.",
          "POSIX disk file blocking mismatch: standard non-blocking APIs do not work on regular disk files, requiring thread pools or io_uring.",
          "Debugging friction: stack traces in asynchronous event loops are fragmented across event ticks, complicating root-cause analysis."
        ],
        avoid: [
          "Executing CPU-heavy synchronous calculations (like image resizing or heavy crypto) directly inside an asynchronous event loop thread.",
          "Using Edge-Triggered epoll without reading in a loop until receiving EAGAIN/EWOULDBLOCK, causing hung sockets.",
          "Using legacy select() or poll() in high-concurrency modern servers (strictly use epoll on Linux, kqueue on BSD/macOS).",
          "Assuming file I/O is non-blocking on POSIX systems without checking whether io_uring or background thread pools are handling disk operations."
        ]
      }
    }
  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
