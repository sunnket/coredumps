/* ==========================================================================
   Depth pass 136 — DevOps & Cloud batch 7: Cloud Infrastructure, Networking & FinOps.
   Cloud Computing, IaaS PaaS and SaaS, Cloud Region,
   Availability Zone, Virtual Private Cloud, FinOps.

   Shared responsibility models, geographic fault domains, isolated VPC network topology,
   multi-AZ synchronous data replication, and cost-attributed FinOps governance
   establish foundational cloud platform architectures.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "cloud-computing",

      why: {
        before: "Enterprises purchased, racked, powered, and maintained physical servers in private on-premise datacenters; provisioning a new server required 6 to 12 months of procurement forecasting, upfront capital expenditures (CapEx) running into millions of dollars, and organizations either ran out of capacity during traffic surges or wasted 80% of their investment during lulls.",
        problem: "Modern business requires instant, on-demand access to elastic computing resources that can be provisioned via APIs in seconds and scaled dynamically, converting rigid upfront capital expenditures into variable operating expenses.",
        shift: "**Cloud Computing: The on-demand delivery of IT resources over the internet with pay-as-you-go pricing.** Standardized by NIST into five essential characteristics (on-demand self-service, broad network access, resource pooling, rapid elasticity, measured service), cloud computing replaces physical datacenters with programmable infrastructure."
      },

      num: {
        t: "Infrastructure Hosting Paradigms: Comparative Economic & Operational Models",
        h: ["Hosting Model", "Financial Structure", "Provisioning Latency", "Capacity Elasticity", "Hardware Maintenance Burden"],
        r: [
          ["On-Premise Datacenter", "High CapEx (buy servers, real estate, cooling upfront)", "Months (procure, ship, rack, cable)", "Zero elasticity (fixed hardware limits)", "100% customer responsibility (hardware, power, networking)"],
          ["Colocation Facility (Colo)", "High CapEx (own servers) + OpEx (rent rack space)", "Weeks to Months", "Limited to leased rack space", "Hardware customer; facility/power vendor"],
          ["Public Cloud (AWS/GCP/Azure)", "100% OpEx (pay per second/millisecond used)", "Seconds to Minutes (via API call)", "Virtually unlimited elastic scaling", "Zero hardware maintenance (cloud provider owns physical tier)"],
          ["Private Cloud (OpenStack)", "High CapEx + High OpEx (software virtualization layer)", "Minutes (virtual provisioning)", "Bounded by private physical cluster size", "100% internal IT operations team"],
          ["Hybrid Cloud", "Mixed CapEx & OpEx (workload-specific placement)", "Variable (cloud bursts; on-premise baseline)", "Elastic burst to public cloud", "Shared between internal IT and cloud provider"]
        ],
        n: "Cloud computing transforms infrastructure from **Capital Expenditure (CapEx)**—buying physical depreciating hardware assets—into **Operating Expenditure (OpEx)**—paying an operational utility bill for resources consumed. Hyper-scale cloud providers (Amazon Web Services, Microsoft Azure, Google Cloud Platform) achieve massive economies of scale by pooling multi-tenant physical hardware and abstracting it through software-defined networking, storage, and compute hypervisors. However, the operational reality of cloud computing is: **An unwatched cloud account is an unbounded financial liability**. Because spinning up a 128-core virtual machine requires only a single un-metered API call or Terraform apply, cloud cost monitoring and automated governance are core engineering responsibilities."
      },

      miss: [
        {
          w: "Cloud computing is always cheaper than owning and running physical on-premise servers.",
          r: "Cloud computing is dramatically cheaper for **spiky, growing, seasonal, or uncertain workloads**. However, for steady-state 24/7 workloads with predictable 100% hardware utilization over 3-5 years, owning physical hardware in a colocation facility can be significantly cheaper than paying cloud markup."
        },
        {
          w: "Moving an application to the cloud automatically makes it highly available and self-healing.",
          r: "The cloud provides the *building blocks* for high availability, but does not guarantee it automatically. If you deploy an application as a single virtual machine in a single availability zone, **a single hardware crash will take your application offline just like an on-premise server**."
        },
        {
          w: "Public cloud providers can access and view all your proprietary application data.",
          r: "Major cloud providers enforce strict cryptographic multi-tenant isolation, hypervisor memory sandboxing, and compliance certifications (SOC 2, FedRAMP High, ISO 27001). Customer data is encrypted at rest using customer-managed encryption keys (CMEK) that providers cannot decrypt."
        },
        {
          w: "Cloud computing means you no longer need system architects or network engineers.",
          r: "Cloud infrastructure replaces physical cabling with **Software-Defined Networking (SDN), Virtual Private Clouds (VPCs), IAM policies, and distributed system design**. Architectural expertise is more critical than ever to avoid catastrophic security leaks and runaway cloud bills."
        }
      ],

      trade: {
        buys: [
          "Instant time-to-market: provision complete enterprise-grade multi-region architectures in minutes via APIs.",
          "Elastic dynamic scalability: scale from a single container to 50,000 instances automatically during viral traffic surges.",
          "Zero physical datacenter overhead: eliminate the costs of real estate, diesel generators, cooling systems, and hardware procurement.",
          "Global reach in minutes: deploy application endpoints in 30+ international regions physically adjacent to global customers."
        ],
        costs: [
          "Runaway billing vulnerability: unmetered API calls, forgotten test clusters, and unattached disks accumulate massive monthly bills.",
          "Proprietary cloud vendor lock-in: deep coupling to cloud-specific services (DynamoDB, BigQuery) makes cross-cloud migration expensive.",
          "Network data egress pricing: transferring terabytes of data out of cloud provider networks incurs high egress bandwidth fees.",
          "Shared-tenancy noisy neighbors: neighboring virtual machines on the same physical host can occasionally contend for I/O bandwidth."
        ],
        avoid: [
          "Never migrate a monolithic legacy application to the cloud via 'lift-and-shift' without re-architecting for cloud elasticity.",
          "Never run cloud infrastructure without automated billing alerts, hard spending budget caps, and daily anomaly detection.",
          "Never deploy cloud workloads into a default VPC without configuring private subnets and restrictive security groups.",
          "Never leave idle test environments, orphaned unattached storage disks, or unused static IPs running in cloud accounts."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "iaas-paas-and-saas",

      why: {
        before: "Companies attempted to build and manage every single layer of their technology stack in-house—purchasing physical hardware, managing Linux kernel updates, configuring database replication, and writing custom CRM software—wasting massive engineering capacity on undifferentiated heavy lifting.",
        problem: "Organizations need to choose the appropriate abstraction level for each technical workload, balancing direct low-level control against operational maintenance overhead and developer velocity.",
        shift: "**IaaS, PaaS, and SaaS: The three primary cloud service delivery models defined by how much of the technology stack is managed by the cloud vendor versus the customer.** Delineating the Shared Responsibility Model, these tiers allow organizations to focus engineering resources on unique business logic."
      },

      num: {
        t: "Cloud Service Models: The Shared Responsibility Stack",
        h: ["Technology Stack Layer", "On-Premise", "IaaS (Infrastructure as a Service)", "PaaS (Platform as a Service)", "SaaS (Software as a Service)"],
        r: [
          ["Applications & Code", "Customer Manages", "Customer Manages", "Customer Manages", "Vendor Manages"],
          ["Data & Access Governance", "Customer Manages", "Customer Manages", "Customer Manages", "Customer Manages (Config & Data)"],
          ["Runtime & Middleware", "Customer Manages", "Customer Manages", "Vendor Manages", "Vendor Manages"],
          ["Operating System & Patches", "Customer Manages", "Customer Manages (Guest OS)", "Vendor Manages", "Vendor Manages"],
          ["Virtualization & Hypervisor", "Customer Manages", "Vendor Manages", "Vendor Manages", "Vendor Manages"],
          ["Physical Servers & Network", "Customer Manages", "Vendor Manages", "Vendor Manages", "Vendor Manages"],
          ["Primary Industry Examples", "Private Datacenter", "AWS EC2, Google GCE, Azure VMs", "Heroku, Google Cloud Run, AWS Elastic Beanstalk", "Salesforce, Google Workspace, GitHub, Slack"]
        ],
        n: "The spectrum between IaaS, PaaS, and SaaS represents an explicit architectural trade-off: **Control versus Convenience**. In **IaaS**, you rent raw virtual compute, storage, and networking; you control the guest OS, kernel parameters, and installed packages, but you inherit the operational burden of security patching, OS updates, and scaling. In **PaaS**, you provide only your application code and configuration; the vendor completely abstracts the operating system, container runtime, scaling, and load balancing, giving high developer velocity at the expense of runtime customizability. In **SaaS**, the vendor delivers a fully functional, managed end-user application accessible over the web. Modern engineering organizations **use all three tiers concurrently**: running custom core APIs on IaaS/PaaS, while using SaaS for communication, monitoring, and HR."
      },

      miss: [
        {
          w: "In SaaS, the cloud vendor is 100% responsible for all security, and the customer has zero security obligations.",
          r: "Under the **Shared Responsibility Model**, the customer is ALWAYS responsible for **User Access Management, Password Policies, Multi-Factor Authentication, and Data Classification**. If an employee uses a weak password with no MFA and an attacker accesses your Salesforce data, the breach is a customer failure."
        },
        {
          w: "PaaS is always the best choice for startups because it requires zero operations engineers.",
          r: "PaaS (Heroku, Render) delivers extraordinary velocity early on, but **becomes economically and technically restrictive as systems scale**. At high throughput, PaaS compute pricing is significantly higher than raw IaaS, and restrictive network topologies prevent custom kernel or database optimizations."
        },
        {
          w: "Serverless FaaS (AWS Lambda) is a fourth, completely unrelated cloud model.",
          r: "Serverless FaaS sits directly within the **evolved PaaS spectrum** (often termed Function-as-a-Service or High-Level PaaS), abstracting the runtime and server management entirely while charging strictly for execution duration."
        },
        {
          w: "Choosing IaaS means you can lift-and-shift legacy on-premise software without making any changes.",
          r: "Running legacy architectures unchanged on IaaS creates expensive, fragile systems. IaaS still requires implementing cloud-native patterns: ephemeral instance management, dynamic IP address handling, and multi-AZ replication."
        }
      ],

      trade: {
        buys: [
          "Elimination of undifferentiated heavy lifting: offload hardware maintenance, hypervisor patching, and datacenter cooling to vendors.",
          "Targeted engineering focus: developer squads focus 100% of their time on customer-facing business features.",
          "Rapid prototyping velocity: PaaS enables engineers to deploy production-ready web services in minutes with a single git push.",
          "Turnkey enterprise software: SaaS delivers world-class tools (Slack, Datadog, GitHub) without maintaining custom internal clones."
        ],
        costs: [
          "Loss of low-level control in PaaS/SaaS: unable to tune kernel network stacks, install custom OS drivers, or access raw hardware.",
          "PaaS pricing premium at scale: per-unit compute costs on PaaS platforms are substantially higher than raw IaaS virtual machines.",
          "Vendor lock-in liability: proprietary PaaS and SaaS APIs make migrating away to alternate providers difficult and expensive.",
          "Compliance and data sovereignty constraints: storing sensitive customer data in third-party SaaS tools introduces regulatory compliance review."
        ],
        avoid: [
          "Never build custom internal tools (e.g., building an internal chat system or email client) when battle-tested SaaS exists.",
          "Never assume cloud vendors manage your application security; adhere strictly to the Shared Responsibility Model.",
          "Never choose IaaS for simple web applications when managed container PaaS (Google Cloud Run) reduces operational toil.",
          "Never grant unmonitored administrative access to SaaS platforms without mandatory enterprise Single Sign-On (SSO) and MFA."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "cloud-region",

      why: {
        before: "Companies hosted their application in a single physical datacenter in North America; customers in Singapore, Tokyo, and Sydney experienced 250-300ms speed-of-light network round-trip latencies, while localized regional disasters (earthquakes, power grid failures) took the entire global business offline.",
        problem: "Global internet applications must comply with strict national data residency laws, withstand catastrophic regional geographic disasters, and deliver sub-50ms response times to international users worldwide.",
        shift: "**Cloud Region: A distinct geographic location around the world containing an isolated cluster of multiple, physically separate data centers (Availability Zones) connected by high-speed, private fiber-optic networks.** Governing data sovereignty, latency, and disaster recovery boundaries, regions form the macro-topology of cloud platforms."
      },

      num: {
        t: "Cloud Region Selection Criteria: Comparative Architecture Dimensions",
        h: ["Dimension", "Primary Engineering Impact", "Latency / Cost Implication", "Regulatory & Compliance Mandate", "Operational Best Practice"],
        r: [
          ["Geographic Latency", "Physical distance to end users ($T = \\frac{2d}{c_{\\text{fiber}}}$)", "Every 1,000 km adds ~10ms network RTT", "User satisfaction & conversion rate directly correlate with latency", "Deploy compute physically closest to largest user demographic"],
          ["Data Sovereignty Laws", "Legal jurisdiction governing stored data", "Cross-border data transfer legal liabilities", "GDPR (EU), CCPA (California), HIPAA (US Healthcare)", "Store EU citizen PII exclusively in European regions (e.g., Frankfurt/Dublin)"],
          ["Cloud Feature Parity", "Not all cloud services exist in all regions", "Older/smaller regions lack newest GPU & AI hardware", "Regional availability of specialized services", "Verify service availability matrix before selecting region"],
          ["Regional Pricing Variance", "Cloud compute and storage prices differ by region", "Costs vary by 10-30% between regions (e.g., US-East vs Brazil)", "Budget impact on high-throughput workloads", "Compare regional pricing catalogs; US-East is typically cheapest"],
          ["Cross-Region Egress Cost", "Transferring data between cloud regions", "$0.02 - $0.09 per GB cross-region bandwidth", "High data transfer charges on multi-region sync", "Minimize inter-region database replication; compress data streams"]
        ],
        n: "A Cloud Region (e.g., `us-east-1` in North Virginia, `eu-central-1` in Frankfurt) is a **completely isolated geographic failure domain**. By definition, regions are separated by substantial physical distance (typically hundreds to thousands of kilometers) to ensure that a major natural catastrophe (hurricane, earthquake, flood) or regional power grid collapse affecting one region cannot impact another. Every region contains at least **three physically distinct Availability Zones (AZs)** connected via dedicated private dark fiber with sub-2ms latency. Crucially, **cloud providers do NOT replicate data between regions automatically**; cross-region replication must be explicitly architected and incurs significant cloud network egress costs."
      },

      miss: [
        {
          w: "All cloud regions offer the exact same services, instance types, and hardware capabilities.",
          r: "Cloud providers roll out new services, latest-generation CPUs, and high-demand GPUs (e.g., NVIDIA H100s) to **flagship regions first (e.g., us-east-1, us-central1)**. Smaller international regions often lack specialized services or have restricted instance quotas."
        },
        {
          w: "Data stored in a cloud region is automatically backed up across other global regions by default.",
          r: "Cloud providers **NEVER replicate data across regions automatically**; doing so would violate international data privacy laws (GDPR). Cross-region replication must be explicitly configured and paid for by the customer."
        },
        {
          w: "Multi-region active-active deployment is the best architecture for all production applications.",
          r: "Multi-region active-active is the **most complex, expensive, and difficult architecture in computer science**. It requires distributed multi-master consensus, handling speed-of-light replication lag, resolving write conflicts, and doubles cloud costs. **Multi-AZ within a single region satisfies 99.9% of applications**."
        },
        {
          w: "Cloud pricing is uniform across all global regions of the same provider.",
          r: "Cloud pricing varies by up to **20-40% depending on regional electricity, real estate, labor, and tax costs**. An instance in São Paulo or Sydney is significantly more expensive than the exact same instance in North Virginia."
        }
      ],

      trade: {
        buys: [
          "Low geographic latency: deploying workloads physically close to end users cuts round-trip times from 250ms to 15ms.",
          "Strict data sovereignty compliance: satisfy national data privacy laws by pinning customer data within designated legal borders.",
          "Catastrophic disaster isolation: survive total loss of an entire geographic datacenter cluster or regional power grid.",
          "Tailored regional hardware access: deploy AI model training in regions with cheap hydro-electric power and high GPU quotas."
        ],
        costs: [
          "Cross-region data egress bandwidth fees: synchronizing databases across regions generates continuous cloud bandwidth charges.",
          "Distributed data replication latency: speed-of-light physical latency across continents prevents synchronous ACID transactions.",
          "Multi-region deployment complexity: requires managing global DNS routing (Route 53 latency routing) and multi-region CI/CD pipelines.",
          "Configuration drift between regions: regional differences in available instance types or service versions complicate IaC templates."
        ],
        avoid: [
          "Never deploy EU customer personal data into US cloud regions without verifying GDPR adequacy and legal frameworks.",
          "Never execute synchronous distributed database transactions across regions separated by thousands of kilometers.",
          "Never select a cloud region without auditing whether all required cloud services and GPU instance types are available there.",
          "Never ignore cross-region data transfer fees when designing distributed backup and data warehouse pipelines."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "availability-zone",

      why: {
        before: "Organizations deployed redundant servers inside the same physical room or building; when a local transformer exploded, a roof leaked onto server racks, or a backhoe severed the building's incoming fiber conduit, all 'redundant' servers lost power and connectivity simultaneously.",
        problem: "Systems require physical infrastructure redundancy where servers run in distinct physical buildings with independent power feeds, backup generators, and cooling, while maintaining single-digit millisecond network latency between them to support synchronous database replication.",
        shift: "**Availability Zone (AZ): One or more discrete, physically separate data centers within a cloud region, equipped with independent power, cooling, and physical security, connected via low-latency private optical networks.** Providing the foundational fault-domain boundary of cloud high availability, AZs survive local physical disasters."
      },

      num: {
        t: "Availability Zone Fault Domain Isolation: Physical & Network Characteristics",
        h: ["Dimension", "Physical Isolation Boundary", "Network Latency to Other AZs", "Synchronous Replication Support?", "Typical Disaster Survived"],
        r: [
          ["Physical Infrastructure", "Separate buildings on distinct flood plains (10 - 100 km apart)", "Sub-2 millisecond round-trip time", "Yes (fully supports synchronous ACID writes)", "Building fire, power grid failure, localized flood"],
          ["Power Distribution", "Independent utility sub-stations + onsite diesel generators", "N/A", "N/A", "Municipal power blackout / grid collapse"],
          ["Network Transit", "Dedicated redundant subterranean dark fiber paths", "Ultra-low latency (<1.5ms)", "Yes (seamless distributed consensus e.g. Raft/Paxos)", "Physical fiber line cut / local transit provider outage"],
          ["Physical Security", "Independent military-grade perimeter access controls", "N/A", "N/A", "Physical intrusion, localized sabotage"],
          ["Cross-AZ Data Billing", "Cloud providers charge ~$0.01/GB for cross-AZ traffic", "High throughput (100 Gbps+ backbones)", "N/A (charged per gigabyte transferred)", "Economic trade-off for high availability"]
        ],
        n: "Within a Cloud Region, each **Availability Zone (AZ)** is identified by an alphanumeric code (e.g., `us-east-1a`, `us-east-1b`). Crucially, cloud providers **randomize the mapping of AZ names to physical datacenters per cloud account** (your `us-east-1a` may be another account's `us-east-1c`) to prevent all customers from crowding into the first alphabetical zone. AZs within a region are spaced close enough for **sub-2ms network round trips**, making **synchronous database replication** (e.g., AWS Aurora Multi-AZ or PostgreSQL synchronous standby) technically viable without significant write latency penalties. Spreading stateless compute instances across at least **three Availability Zones** behind a load balancer is the non-negotiable baseline for enterprise production availability."
      },

      miss: [
        {
          w: "Availability Zones within the same region are just different server racks inside the same room.",
          r: "Availability Zones are **completely separate physical buildings located miles apart** on independent geographical flood plains, powered by independent municipal utility substations with dedicated backup diesel generators."
        },
        {
          w: "Network traffic transferred between Availability Zones within the same region is always free.",
          r: "Cloud providers (AWS, Azure) charge **network data transfer fees (typically $0.01 per GB in each direction)** for traffic crossing AZ boundaries. High-throughput distributed databases (Cassandra/Kafka) running cross-AZ replication can generate thousands of dollars in surprise bandwidth bills."
        },
        {
          w: "Deploying two application replicas in the same Availability Zone provides high availability.",
          r: "If both instances run in AZ-a, a single power substation failure or cooling breakdown taking down AZ-a **takes down both instances simultaneously**. High Availability mandates spreading replicas across at least two or three distinct AZs."
        },
        {
          w: "Availability Zone names like `us-east-1a` refer to the exact same physical building for every customer.",
          r: "Cloud providers **dynamically map AZ names to physical datacenter IDs per account** to balance load across physical sites. To verify that two AWS accounts share the same physical building, you must compare **AZ IDs (`use1-az1`)**, not zone names."
        }
      ],

      trade: {
        buys: [
          "Localized disaster resilience: survives building fires, municipal power grid blackouts, and localized physical network cuts.",
          "Synchronous ACID replication: sub-2ms network latency enables real-time zero-data-loss database replication.",
          "Automated load balancer failover: cloud load balancers instantly route traffic away from a degraded AZ in milliseconds.",
          "Zero-downtime rolling maintenance: cloud providers perform hypervisor and hardware maintenance one AZ at a time."
        ],
        costs: [
          "Cross-AZ data transfer expenses: transferring gigabytes of data between AZs incurs continuous cloud bandwidth charges.",
          "Subtle network latency overhead: cross-AZ RPC calls add 1-2ms of network traversal compared to single-AZ in-rack calls.",
          "Uneven capacity allocation: individual AZs can occasionally experience spot instance or specialized GPU capacity constraints.",
          "Topology-aware routing complexity: optimizing traffic to stay within the same AZ requires configuring Kubernetes topology-aware routing."
        ],
        avoid: [
          "Never deploy production workloads into a single Availability Zone; always span at least two or three AZs.",
          "Never run single-AZ relational databases in production; always enable Multi-AZ automated failover replication.",
          "Never ignore cross-AZ data transfer costs in high-volume data ingestion or distributed streaming clusters.",
          "Never rely on alphabetical AZ names (`us-east-1a`) when coordinating multi-account peering; use immutable AZ IDs."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "virtual-private-cloud",

      why: {
        before: "Early public cloud infrastructure assigned public internet IP addresses directly to every single virtual machine; databases, caching layers, and internal microservices were exposed directly to the public internet, leaving systems vulnerable to brute-force attacks, port scanning, and catastrophic data breaches.",
        problem: "Organizations require a secure, logically isolated private software-defined network within the public cloud where they retain complete control over IP addressing, subnetting, routing tables, network gateways, and stateful firewall boundaries.",
        shift: "**Virtual Private Cloud (VPC): A logically isolated, private virtual network dedicated to a specific cloud account within a cloud provider's shared infrastructure.** Providing private IP address spaces and multi-tiered subnet security boundaries, VPCs form the network perimeter of enterprise cloud environments."
      },

      num: {
        t: "VPC Network Security Controls: Architectural Layers & Filtering Mechanisms",
        h: ["Network Control", "OSI Layer", "Application Scope", "Statefulness", "Primary Security Function"],
        r: [
          ["Public Subnet", "Layer 3 (IP Routing)", "Direct route to Internet Gateway (IGW)", "N/A", "Hosts public-facing Application Load Balancers and NAT Gateways"],
          ["Private Subnet", "Layer 3 (IP Routing)", "Outbound only via NAT Gateway; zero ingress", "N/A", "Hosts application compute containers and microservice pods"],
          ["Isolated Data Subnet", "Layer 3 (IP Routing)", "Zero internet routes (no IGW, no NAT)", "N/A", "Hosts relational databases and sensitive data stores"],
          ["Security Group (SG)", "Layer 4 (Transport / TCP / UDP)", "Applied at virtual network interface (ENI)", "Stateful (inbound return traffic automatically allowed)", "Acts as virtual instance firewall; whitelist ports & CIDRs"],
          ["Network ACL (NACL)", "Layer 3/4 (Subnet boundary)", "Applied at entire subnet boundary", "Stateless (must explicitly allow inbound and outbound return)", "Secondary subnet perimeter defense; block specific IP CIDRs"],
          ["VPC Endpoint (PrivateLink)", "Layer 3/7 (Private AWS network)", "Private IP routes to cloud SaaS (S3, ECR)", "N/A", "Keeps cloud API traffic completely off public internet"]
        ],
        n: "A VPC is defined by a private IPv4 Classless Inter-Domain Routing (**CIDR block**, typically within RFC 1918 private address spaces, e.g., `10.0.0.0/16`, providing 65,536 private IPs). Enterprise VPC architecture strictly enforces a **Three-Tier Subnet Topology** across multiple Availability Zones: (1) **Public Subnets**: contain public load balancers and **NAT Gateways** connected to an Internet Gateway (`0.0.0.0/0 -> igw`); (2) **Private Application Subnets**: contain application compute containers, routing outbound internet traffic through the NAT Gateway for package updates (`0.0.0.0/0 -> nat-gateway`), but completely inaccessible from the outside internet; and (3) **Isolated Database Subnets**: contain production databases with **zero internet routes**, accessible strictly from the application subnet via private IP. Stateful **Security Groups** enforce the principle of least privilege between tiers."
      },

      miss: [
        {
          w: "Databases in a private subnet cannot be attacked because they have no public IP address.",
          r: "If an application server in the public subnet has a Server-Side Request Forgery (SSRF) or SQL injection vulnerability, an attacker can **pivot through the application server to attack the private database**. Network segmentation must be paired with database authentication, TLS encryption, and least-privilege IAM."
        },
        {
          w: "Security Groups and Network ACLs (NACLs) are redundant tools that do the exact same thing.",
          r: "**Security Groups are stateful** (allowing inbound automatically permits response traffic) and apply at the *instance interface level*. **NACLs are stateless** (requiring explicit outbound ephemeral port rules) and apply at the *subnet boundary*. NACLs are used for broad IP blocking, while Security Groups govern service-to-service rules."
        },
        {
          w: "Connecting two VPCs together requires routing traffic across the public internet.",
          r: "VPCs can be connected privately using **VPC Peering** or a **Transit Gateway**, routing traffic entirely across the cloud provider's ultra-fast private global fiber backbone with zero exposure to the public internet."
        },
        {
          w: "Downloading container images from Amazon ECR in a private subnet requires an expensive NAT Gateway.",
          r: "Routing ECR or S3 traffic through a NAT Gateway incurs high data transfer processing charges. Configuring a **VPC Gateway / Interface Endpoint** routes traffic directly to S3 and ECR over internal cloud backbones for free, bypassing the NAT Gateway."
        }
      ],

      trade: {
        buys: [
          "Absolute perimeter isolation: completely shields backend databases and internal microservices from the public internet.",
          "Granular network access control: enforce defense-in-depth using stateful Security Groups and stateless subnet NACLs.",
          "Custom private IP topologies: design custom subnet IP hierarchies aligning with enterprise corporate networks via VPN/DirectConnect.",
          "Free internal data transfer: traffic between services inside the same subnet and AZ incurs zero cloud network transfer fees."
        ],
        costs: [
          "NAT Gateway hourly and bandwidth fees: cloud providers charge hourly fees plus per-GB data processing costs for all outbound NAT traffic.",
          "Network architecture complexity: managing CIDR blocks, route tables, peering connections, and transit gateways requires dedicated netops skill.",
          "IP exhaustion risk: choosing a CIDR block that is too small (e.g., `/24`) can exhaust available IP addresses as Kubernetes pods scale.",
          "Troubleshooting friction: diagnosing broken routing tables, asymmetric NACL blocks, and security group rejections requires network flow logs."
        ],
        avoid: [
          "Never place production databases or Redis caches in public subnets with public IP addresses.",
          "Never create security group rules with `0.0.0.0/0` ingress on SSH (port 22) or RDP (port 3389).",
          "Never choose a small VPC CIDR block (e.g., `/24`) for Kubernetes clusters; pods will rapidly exhaust available IP space.",
          "Never route traffic destined for cloud object stores (S3) through expensive NAT Gateways; use free VPC Gateway Endpoints."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "finops",

      why: {
        before: "Infrastructure procurement was managed by central finance departments via annual hardware budgets; when organizations moved to the cloud, any developer could spin up a $10,000/month GPU cluster or database with an API call, resulting in terrifying monthly cloud billing spikes, untracked waste, and explosive board-level panic.",
        problem: "In an elastic, decentralized cloud operating model, organizations require an operational and cultural framework that brings financial accountability to variable cloud spend, enabling engineering teams to make data-driven trade-offs between speed, cost, and quality.",
        shift: "**FinOps (Cloud Financial Operations): An evolving cloud financial management discipline and cultural practice that enables organizations to get maximum business value by helping engineering, finance, technology, and business teams to collaborate on data-driven spending decisions.** Combining cost allocation, right-sizing, and commitment discounting, FinOps turns cloud spend into a measurable business driver."
      },

      num: {
        t: "Cloud Pricing Models & Cost Optimization Strategies",
        h: ["Pricing / Purchase Model", "Commitment Horizon", "Discount vs On-Demand", "Interruption Risk", "Optimal Production Workload"],
        r: [
          ["On-Demand / Pay-As-You-Go", "Zero commitment (pay per second/minute)", "0% (Highest base price)", "Zero interruption risk (highest SLA)", "Spiky workloads, new unvalidated apps, short-lived experiments"],
          ["Savings Plans (Compute / EC2)", "1-Year or 3-Year hourly spend commitment ($/hr)", "30% - 66% discount", "Zero interruption risk", "Predictable baseline compute across all instances, Fargate, Lambda"],
          ["Reserved Instances (Standard / Convertible)", "1-Year or 3-Year specific instance type commitment", "35% - 72% discount", "Zero interruption risk", "Steady-state 24/7 relational databases (RDS) and Redis clusters"],
          ["Spot / Preemptible Instances", "Zero commitment (bids on unused cloud capacity)", "70% - 90% discount", "High (reclaimed with 2-minute warning)", "Fault-tolerant stateless batch jobs, CI/CD runners, AI model training"],
          ["Storage Lifecycle Policies", "Rule-based automatic tiering (Standard -> Infrequent -> Glacier)", "50% - 95% storage savings", "Retrieval latency increases (milliseconds to hours)", "Historical logs, compliance archives, database backups"]
        ],
        n: "FinOps operates across three continuous phases defined by the **FinOps Foundation**: (1) **Inform**: achieve 100% cost visibility and attribution by enforcing mandatory resource **Cost Allocation Tags** (`CostCenter`, `Owner`, `Environment`, `Service`). If an EC2 instance or S3 bucket is untagged, costs cannot be attributed, and waste cannot be eliminated; (2) **Optimize**: eliminate waste through **Right-Sizing** (downsizing over-provisioned VMs running at 5% CPU), terminating orphaned resources (unattached EBS volumes, idle load balancers, unused Elastic IPs), establishing storage lifecycle policies, and purchasing **1-to-3-year Savings Plans / Reserved Instances** for predictable baseline workloads; and (3) **Operate**: integrate unit economics (e.g., 'Cost per Active User' or 'Cost per Search Query') into engineering KPIs and CI/CD pull request reviews."
      },

      miss: [
        {
          w: "FinOps is purely about cutting cloud costs as much as possible.",
          r: "FinOps is about **maximizing business value, NOT just cutting costs**. Spending $50,000 more per month on cloud infrastructure is a fantastic engineering decision if it generates $500,000 in new customer revenue. FinOps ensures cloud spending drives profitable business growth."
        },
        {
          w: "Cost optimization should be handled exclusively by the finance department, not engineers.",
          r: "Finance cannot right-size a Kubernetes pod or refactor an unindexed database query. **Engineers make architecture decisions every day that directly dictate cloud spending**. FinOps empowers engineers with cost data inside their daily developer workflows."
        },
        {
          w: "Turning off running virtual machines completely stops all cloud spending for that instance.",
          r: "Stopping a VM only stops compute CPU charges. The **attached persistent storage volume (EBS), provisioned IOPS, and static IP addresses continue billing every hour** until the volume is explicitly deleted."
        },
        {
          w: "Purchasing 3-Year Reserved Instances on day one of a new startup is smart financial planning.",
          r: "Early-stage architecture evolves rapidly. Locking into a 3-year reservation for a specific instance family before achieving product-market fit leaves companies **paying for obsolete, unused hardware reservations**. Use On-Demand and Flexible Compute Savings Plans initially."
        }
      ],

      trade: {
        buys: [
          "Massive operational savings: typical FinOps implementations reduce monthly cloud waste by 20% to 40% in the first 90 days.",
          "Granular cost attribution: business executives see exact cloud spending broken down by product team, customer, and feature.",
          "Unit economics visibility: measure financial efficiency metrics (e.g., cost per API request, cost per customer checkout).",
          "Automated waste elimination: automated janitor scripts terminate orphaned disks, idle load balancers, and zombie staging clusters."
        ],
        costs: [
          "Tooling licensing expenses: enterprise cloud cost management platforms (CloudHealth, Vantage, Kubecost) incur subscriptions.",
          "Engineering tagging discipline overhead: requires strict CI/CD linting and policy enforcement (OPA/Terraform) to block untagged resources.",
          "Financial commitment risk: over-committing to multi-year Savings Plans risks paying for unused capacity if architectures shift.",
          "Organizational culture friction: requires cross-functional alignment between engineering teams and corporate finance."
        ],
        avoid: [
          "Never allow developers to provision cloud resources without mandatory metadata tags (`Owner`, `Environment`, `Service`).",
          "Never leave unattached EBS storage volumes, idle load balancers, or unassociated static IPs running in cloud accounts.",
          "Never run predictable 24/7 baseline production workloads on expensive On-Demand pricing without Savings Plans.",
          "Never evaluate cloud spending purely as a raw dollar total; evaluate spend relative to business revenue and unit metrics."
        ]
      }
    }

  ]);

})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
