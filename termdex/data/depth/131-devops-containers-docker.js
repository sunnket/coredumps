/* ==========================================================================
   Depth pass 131 — DevOps & Cloud batch 2: Containers, Virtualization & Kubernetes.
   Container, Container Image, Dockerfile, Container Registry,
   Virtual Machine, Kubernetes, Pod.

   Linux namespaces and cgroups, OverlayFS layer caching, multi-stage image minimization,
   OCI distribution registries, hardware hypervisors, and declarative Kubernetes pod reconciliation
   establish cloud-native containerized infrastructure foundations.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "container",

      why: {
        before: "Applications were deployed directly on host operating systems, leading to 'works on my machine' dependency collisions (different Python/glibc versions on dev vs prod), or deployed inside heavy virtual machines where each application booted a full redundant operating system, burning gigabytes of RAM and taking minutes to start.",
        problem: "Modern cloud platforms require lightweight, portable, instant-starting execution environments that isolate process memory, filesystems, and network stacks while sharing the host Linux kernel for near-native CPU and memory efficiency.",
        shift: "**Container: A standard unit of software that packages code and all its dependencies so the application runs quickly and reliably across computing environments.** Leveraging Linux kernel isolation primitives (Namespaces and Control Groups / cgroups) rather than hardware emulation, containers deliver process-level isolation in milliseconds."
      },

      num: {
        t: "Process Isolation Paradigms: Bare Metal vs Containers vs Virtual Machines",
        h: ["Dimension", "Bare Metal Process", "Linux Container (Docker / runc)", "Virtual Machine (KVM / VMware)", "MicroVM (AWS Firecracker)"],
        r: [
          ["Operating System Kernel", "Shares host kernel directly", "Shares host kernel directly", "Full independent Guest OS kernel", "Minimal stripped Guest Linux kernel"],
          ["Isolation Primitives", "None (shared OS memory and files)", "Linux Namespaces & cgroups v2", "Hardware virtualization (Intel VT-x / AMD-V)", "KVM hardware virtualization"],
          ["Startup Boot Latency", "Instantaneous (<10ms)", "Milliseconds (50ms - 300ms)", "Minutes (30s - 3 minutes)", "Milliseconds (5ms - 100ms)"],
          ["Memory & Disk Overhead", "Zero extra overhead", "Megabytes (shared base kernel pages)", "Gigabytes (full OS image in RAM)", "Megabytes (~5MB RAM baseline)"],
          ["Multi-Tenant Security Boundary", "Zero isolation", "Moderate (vulnerable to kernel exploits)", "Extreme (hardware hypervisor isolation)", "High (hardware hypervisor sandbox)"]
        ],
        n: "A Linux container is **not a virtual machine; it is simply a standard Linux process run with restricted visibility and resource quotas**. Isolation is achieved through two kernel subsystems: (1) **Namespaces** (isolating what a process can *see*): `pid` (process tree isolation), `net` (isolated virtual network interfaces and routing tables), `mnt` (independent filesystem mounts via `pivot_root`), `ipc` (inter-process communication isolation), `uts` (isolated hostnames), and `user` (mapping container root to an unprivileged host UID); and (2) **Control Groups (cgroups v2)** (limiting what a process can *use*): enforcing hard constraints on CPU shares, memory limits (triggering OOM killer on breach), block I/O bandwidth, and maximum process counts (`pids.max` preventing fork bombs). Security is fortified by **Seccomp** syscall filters, **AppArmor/SELinux** mandatory access controls, and dropping Linux capabilities (`--cap-drop=ALL`)."
      },

      miss: [
        {
          w: "Containers contain a complete guest operating system just like a virtual machine.",
          r: "Containers have **NO operating system kernel**. A container image contains only userspace binaries, libraries, and application code. Every container running on a host executes system calls directly on the single shared host Linux kernel."
        },
        {
          w: "Containers provide the same level of security isolation as virtual machines for untrusted code.",
          r: "Because all containers share the host Linux kernel, **a kernel privilege escalation exploit in one container can compromise the entire host node**. Running untrusted multi-tenant customer code requires virtual machine boundaries (Firecracker MicroVMs, gVisor, or Kata Containers)."
        },
        {
          w: "Processes running inside Docker containers run as root on the host by default.",
          r: "If a container runs as UID 0 (`root`) and lacks user namespace remapping (`userns-remap`), **it is root on the host kernel**. If an attacker escapes the container filesystem, they possess full root privileges over the host. Containers MUST specify `USER nonroot`."
        },
        {
          w: "Docker is the only software capable of creating and running containers.",
          r: "Docker popularized containers, but the runtime specification was standardized by the **Open Container Initiative (OCI)**. Modern production platforms use standardized OCI runtimes like **containerd**, **CRI-O**, and **runc** directly, bypassing Docker entirely."
        }
      ],

      trade: {
        buys: [
          "Zero environment discrepancy: encapsulates code, runtimes, and system libraries into a single portable unit that runs identically everywhere.",
          "Sub-second startup velocity: containers start in milliseconds, enabling instant autoscaling and rolling deployments.",
          "High compute density: run hundreds of isolated containers on a single physical host without VM OS memory overhead.",
          "Standardized packaging ecosystem: universal OCI standard supported by every major cloud provider and orchestrator."
        ],
        costs: [
          "Shared kernel security exposure: kernel vulnerabilities can be leveraged to escape container isolation to the host.",
          "Complex state management: container filesystems are ephemeral; persistent data requires managing external network storage volumes.",
          "Debugging and introspection friction: minimal container images lacking shells (`/bin/sh`) or curl require ephemeral debug containers.",
          "Networking and overlay latency: container virtual bridge networking (veth pairs, CNI overlay networks) introduces subtle packet latency."
        ],
        avoid: [
          "Never run production container processes as the default `root` user; create and declare an unprivileged UID.",
          "Never run containers with `--privileged` in production; it disables all namespace isolation and grants raw device access.",
          "Never store persistent application data on the container's writable layer; use persistent volumes (PVCs) or external object stores.",
          "Never deploy containers without setting explicit CPU and memory resource limits in orchestration manifests."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "container-image",

      why: {
        before: "Application deployment archives (tarballs, zip files) lacked system dependencies, forcing operations to manually install specific versions of Python, OpenSSL, or glibc on production hosts; different dependency versions between machines caused silent crashes.",
        problem: "Software teams need an immutable, content-addressed, cryptographic package format that bundles application code alongside its exact operating system libraries, enabling predictable instantiation across heterogeneous computing environments.",
        shift: "**Container Image: A static, read-only, content-addressable package conforming to the OCI specification that contains all files, libraries, environment variables, and metadata required to instantiate a container.** Built using stacked union filesystem layers, container images maximize caching, distribution efficiency, and immutability."
      },

      num: {
        t: "Base Container Image Distributions: Production Security & Size Trade-offs",
        h: ["Base Image", "Uncompressed Size", "Package Manager Included?", "Interactive Shell (`/bin/sh`)", "Vulnerability Surface / CVE Count"],
        r: [
          ["Ubuntu / Debian Standard", "75 - 120 MB", "Yes (`apt-get`)", "Yes (`/bin/bash`, `/bin/sh`)", "Moderate to High (hundreds of OS packages)"],
          ["Debian Slim (`node:slim`)", "30 - 50 MB", "Yes (`apt-get`)", "Yes (`/bin/sh`)", "Low (stripped documentation, man pages, dev headers)"],
          ["Alpine Linux (`alpine:latest`)", "5 - 8 MB", "Yes (`apk`)", "Yes (`ash` shell, BusyBox)", "Minimal (uses `musl libc` instead of `glibc`)"],
          ["Google Distroless", "15 - 30 MB", "No", "No shell included", "Near-Zero (contains only runtime and essential libs)"],
          ["Scratch (`FROM scratch`)", "0 MB (pure empty layer)", "No", "No shell included", "Absolute Zero (pure statically linked binary e.g. Go/Rust)"]
        ],
        n: "A container image is structured according to the **OCI Image Specification**, comprising: (1) **Image Manifest** (a JSON file pointing to the config and layer tarballs); (2) **Configuration JSON** (environment variables, working directory, entrypoint commands); and (3) **Filesystem Layers**. Layers are stacked using a **Copy-on-Write (CoW) Union Filesystem (OverlayFS)**. In OverlayFS, read-only image layers act as the `lowerdir`. When a container runs, a thin, ephemeral writable layer (`upperdir`) is placed on top. If a container modifies a file from an image layer, OverlayFS copies the file up to the writable layer before modifying it. Crucially, each layer is named after its **SHA-256 cryptographic hash**, enabling global deduplication: multiple images sharing the same base layer download it only once."
      },

      miss: [
        {
          w: "Container image tags like `v1.2` or `latest` guarantee that you are running the exact same code every time.",
          r: "Container tags are **mutable pointers**, just like Git branches. Anyone with registry write access can overwrite `v1.2` with a different image. **Production systems must pin immutable SHA-256 digests (`@sha256:...`)** to ensure absolute reproducibility."
        },
        {
          w: "Alpine Linux is always the best choice for all production container images because of its 5MB size.",
          r: "Alpine uses **musl libc** instead of GNU `glibc`. Python packages with C extensions (NumPy, Pandas) or complex C++ libraries compiled against `glibc` must be compiled from source on Alpine or suffer obscure runtime segfaults and performance degradations. **Debian Slim is often safer for Python and Node.js**."
        },
        {
          w: "Deleting a file in a later Dockerfile instruction (`RUN rm -rf /large-file`) reduces the total image size.",
          r: "Because container images are append-only stacked layers, **deleting a file in a subsequent layer only hides it in the union view; the bytes remain embedded in the earlier layer forever**. Files must be cleaned up within the *same* `RUN` instruction or pruned via multi-stage builds."
        },
        {
          w: "Scanning a container image once before initial release is sufficient for its lifecycle.",
          r: "New Common Vulnerabilities and Exposures (CVEs) are discovered daily in existing software packages. A container image with zero CVEs today can have critical vulnerabilities discovered next week. **Registries must scan images continuously on schedule**."
        }
      ],

      trade: {
        buys: [
          "Complete environment encapsulation: packs application binaries, system libraries, and configs into a single reproducible unit.",
          "Layer deduplication efficiency: identical base layers are downloaded and cached once across entire host clusters.",
          "Immutable deployment baseline: eliminates runtime software installation and configuration drift on production nodes.",
          "Fast container instantiation: local OverlayFS mount points spin up new running containers in under 100 milliseconds."
        ],
        costs: [
          "Image storage bloat: unoptimized images accumulate gigabytes of disk space across container registries and host nodes.",
          "Vulnerability inheritance: base OS images pull in outdated system packages that trigger continuous security scanner alerts.",
          "Network transfer bandwidth: pushing and pulling multi-gigabyte images across regions consumes cloud data transfer budgets.",
          "Multi-architecture build complexity: supporting both ARM64 (Apple Silicon/Graviton) and x86_64 requires multi-arch build pipelines."
        ],
        avoid: [
          "Never deploy container images using the mutable `:latest` tag in production environments.",
          "Never install build compilers (gcc, make) or dev dependencies inside the final production container image.",
          "Never include sensitive configuration files, SSH private keys, or `.env` secrets inside image layers.",
          "Never leave package manager caches behind; combine installation and cache cleaning in single instructions (e.g., `apt-get clean && rm -rf /var/lib/apt/lists/*`)."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "dockerfile",

      why: {
        before: "System administrators documented manual shell command checklists ('install Python 3.10, compile OpenSSL, export PATH') to set up servers; human error, forgotten environment variables, and differing command execution orders made reproducing server environments impossible.",
        problem: "Developers require a declarative, version-controlled recipe that compiles, packages, and configures container images deterministically, optimizing build layer caching and minimizing the attack surface.",
        shift: "**Dockerfile: A plain-text configuration file containing a sequential series of declarative instructions that the Docker/BuildKit engine executes to automatically build a container image.** Incorporating multi-stage builds and layer cache optimization, Dockerfiles serve as the foundational recipe of modern cloud packaging."
      },

      num: {
        t: "Dockerfile Instructions: Layer Mechanics & Architectural Impact",
        h: ["Instruction", "Layer Generated?", "Cache Invalidation Sensitivity", "Execution Context", "Core Production Best Practice"],
        r: [
          ["`FROM`", "Sets base image layer", "High (invalidates on base image tag update)", "Build initial stage", "Always pin base image with specific version or SHA digest"],
          ["`COPY` / `ADD`", "Creates new read-only layer", "High (invalidates if file content or checksum changes)", "Build time file transfer", "Copy lockfiles first (`package*.json`) before full source code"],
          ["`RUN`", "Creates new read-only layer", "Invalidates if command string or previous layer changes", "Build time execution in container", "Chain commands with `&&` to clean up temporary files in same layer"],
          ["`ENV`", "Metadata layer (no filesystem delta)", "Invalidates subsequent cached instructions", "Persists into runtime container", "Use for application configs; NEVER for secrets or API keys"],
          ["`USER`", "Metadata layer", "Low", "Enforces runtime process UID", "Always switch to unprivileged user (`USER 10001` or `USER node`)"],
          ["`CMD` vs `ENTRYPOINT`", "Metadata layer", "Low", "Runtime process initialization", "Use exec form `ENTRYPOINT [\"node\", \"server.js\"]`; avoid shell form"]
        ],
        n: "Optimizing a Dockerfile requires mastering **BuildKit Layer Caching** and **Multi-Stage Builds**. Because Docker checks layer cache sequentially from top to bottom, instructions that change least frequently MUST appear first. The canonical pattern copies package manifests (`COPY package.json package-lock.json ./`) and runs installation (`RUN npm ci`) *before* copying application source code (`COPY . .`). This ensures that editing application code does not invalidate the expensive dependency installation layer. In **Multi-Stage Builds**, a temporary builder stage contains heavy compilers, SDKs, and dev dependencies to build the application binary, while a final, pristine stage copies only the compiled output into a stripped runtime image (Distroless/Alpine), cutting final image size by 80-90% and eliminating compilers from production attack surfaces."
      },

      miss: [
        {
          w: "The order of instructions in a Dockerfile does not affect build speed.",
          r: "Instruction order is **the single most critical determinant of build performance**. If you write `COPY . .` before `RUN npm install`, every single code edit invalidates the dependency cache, forcing Docker to re-download all dependencies on every build."
        },
        {
          w: "The `.dockerignore` file is an optional convenience that only cleans up the file view.",
          r: "Omitting `.dockerignore` is a **critical security and performance failure**. Without it, `COPY . .` copies `.git` directories (leaking commit history and credentials), local `.env` secret files, and local `node_modules` into the build context, bloating images and leaking sensitive secrets."
        },
        {
          w: "Using shell form `CMD node server.js` is identical to exec form `CMD [\"node\", \"server.js\"]`.",
          r: "Shell form executes the command as a subprocess of `/bin/sh -c`. This causes the shell to become PID 1, **preventing POSIX signals (`SIGTERM`) from reaching the Node.js process**. When Kubernetes attempts graceful shutdown, the application cannot drain connections and is forcefully killed after timeout."
        },
        {
          w: "Multi-stage builds are only useful for compiled languages like Go and Rust.",
          r: "Multi-stage builds are **essential for interpreted languages (Node.js, Python)**. The build stage installs build tools, dev dependencies, and runs TypeScript compilation; the final stage installs only production dependencies (`npm ci --omit=dev`) and copies compiled JS files, slashing image size."
        }
      ],

      trade: {
        buys: [
          "Hermetic build reproducibility: guaranteed identical builds across developer laptops, CI runners, and production registries.",
          "Blazing fast incremental builds: BuildKit layer caching reuses unchanged layers, reducing rebuild times from 5 minutes to 3 seconds.",
          "Minimized attack surface: multi-stage builds strip compilers, test frameworks, and package managers from production images.",
          "Self-documenting infrastructure: version-controlled code recipe documents all system dependencies and startup configurations."
        ],
        costs: [
          "Layer caching subtle bugs: failing to invalidate caches when upstream external assets change can produce stale builds.",
          "Multi-stage syntax complexity: maintaining multi-stage target dependencies and build arguments requires Dockerfile expertise.",
          "Build context upload latency: large repositories without `.dockerignore` waste time uploading gigabytes to the Docker daemon.",
          "Debugging friction: stripped final images lacking package managers and shells require multi-target debug builds."
        ],
        avoid: [
          "Never place `COPY . .` before dependency installation commands (`npm ci`, `pip install`, `cargo build`).",
          "Never build container images without a comprehensive `.dockerignore` file excluding `.git`, `node_modules`, and `.env`.",
          "Never run commands in shell form for `CMD` or `ENTRYPOINT`; always use JSON array exec form (`[\"bin\", \"arg\"]`).",
          "Never pass production API keys, passwords, or secrets into `ENV` or `ARG` instructions; use BuildKit secret mounts (`--mount=type=secret`)."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "container-registry",

      why: {
        before: "Teams transferred container images between servers by saving them to tar files (`docker save`), copying them over SSH via `scp`, and loading them manually (`docker load`); distributing updates across 50 production servers was slow, fragile, and lacked access control.",
        problem: "Cloud environments require a secure, highly available, distributed storage and distribution service that stores container image layers, deduplicates shared blobs, validates image provenance, and serves images rapidly to thousands of cluster nodes.",
        shift: "**Container Registry: A specialized cloud service or server-side application that stores, manages, and distributes OCI-compliant container images and related cloud artifacts.** Operating on the OCI Distribution Specification, registries provide content-addressable layer storage, vulnerability scanning, and cryptographic signing verification."
      },

      num: {
        t: "Container Registries: Architecture & Enterprise Capabilities",
        h: ["Registry Service", "Hosting Model", "Vulnerability Scanning Engine", "Image Signing & Provenance", "Geo-Replication / Multi-Region"],
        r: [
          ["Amazon ECR", "Managed AWS Cloud (IAM integrated)", "Amazon Inspector & Clair", "Native Cosign / AWS Signer integration", "Cross-region and cross-account replication"],
          ["GitHub Container Registry (GHCR)", "Managed SaaS (GitHub integrated)", "GitHub Dependabot & native scanning", "Integrated with GitHub Actions / Sigstore Cosign", "Global CDN edge distribution"],
          ["Google Artifact Registry", "Managed GCP Cloud (IAM integrated)", "Google Container Analysis", "Binary Authorization integration", "Multi-region regional buckets"],
          ["Docker Hub", "Public SaaS / Commercial", "Docker Scout / Snyk engine", "Docker Content Trust (Notary v2)", "Global edge distribution network"],
          ["Harbor (Cloud Native)", "Self-hosted Open Source (CNCF)", "Trivy / Clair pluggable scanners", "Cosign and Notary support", "Replication between heterogeneous registries"]
        ],
        n: "A Container Registry implements the **OCI Distribution Specification**. Storage is bifurcated into: (1) **Blobs**: content-addressable layer tarballs and configuration JSON files stored in object storage (Amazon S3, Google Cloud Storage) keyed by SHA-256 digests; and (2) **Manifests**: JSON documents that map image tags to specific layer digests. Because layer storage is content-addressed, if 100 images use the same Ubuntu base layer, the registry stores only **one single physical copy of that layer**, saving massive storage. In production Kubernetes clusters, node image pulls are optimized using private **VPC Endpoints** (keeping high-bandwidth container image traffic off the public internet) and **ImagePullSecrets**."
      },

      miss: [
        {
          w: "A container registry runs running containers just like a Kubernetes cluster.",
          r: "A container registry is strictly a **storage and distribution repository for static container images** (a specialized file server). It does not execute, run, or orchestrate containers."
        },
        {
          w: "All container images stored in a private registry are automatically safe from malware and vulnerabilities.",
          r: "Container images frequently incorporate base OS packages with critical CVEs or malicious third-party dependencies. Registries must be configured to **scan images automatically on push** and integrate with Kubernetes admission controllers to block deployment of vulnerable images."
        },
        {
          w: "Public container images from Docker Hub can be used directly in enterprise production.",
          r: "Relying directly on public Docker Hub images exposes organizations to **rate limiting (HTTP 429), supply chain poisoning, and upstream image deletion**. Production enterprises mirror approved public images into private internal registries."
        },
        {
          w: "Untagged container images in a registry are automatically deleted immediately.",
          r: "When a new image is pushed with an existing tag, the old image becomes an untagged 'dangling image' that persists in storage. Without automated **Lifecycle / Retention Rules**, orphaned image blobs consume terabytes of expensive cloud storage."
        }
      ],

      trade: {
        buys: [
          "Centralized image distribution: serves pre-built immutable container images to thousands of cluster nodes concurrently.",
          "Massive storage deduplication: content-addressable storage ensures shared OS layers are stored and transferred only once.",
          "Automated supply chain security: automated CVE scanning on push prevents deployment of known vulnerable packages.",
          "Cryptographic image verification: integrates with Cosign and admission controllers to enforce deployment of signed images only."
        ],
        costs: [
          "Cloud egress bandwidth expenses: pulling multi-gigabyte images across cloud regions or over the public internet incurs bandwidth costs.",
          "Storage accumulation costs: maintaining historical build images without retention pruning generates continuous storage bills.",
          "Single point of failure for deployments: a registry outage prevents auto-scaling groups and Kubernetes from spinning up new pods.",
          "Access management overhead: managing service accounts, IAM roles, and secret rotation for node pull credentials across clusters."
        ],
        avoid: [
          "Never pull container images from public registries directly in production workloads; mirror them into a private registry.",
          "Never run a container registry without automated image lifecycle retention policies to clean up old untagged images.",
          "Never pull images over the public internet when private cloud VPC endpoints (e.g., AWS ECR VPC Endpoint) are available.",
          "Never allow anonymous write access to any container registry repository."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "virtual-machine",

      why: {
        before: "Operating systems ran directly on dedicated physical bare-metal servers; servers operated at 5-15% average CPU utilization, provisioning new physical hardware took weeks of procurement, and software bugs crashed the physical machine.",
        problem: "Enterprises need to maximize physical hardware utilization by running multiple independent, securely isolated operating systems on a single physical machine with elastic CPU, memory, and storage provisioning.",
        shift: "**Virtual Machine (VM): An emulation of a physical computer system that executes programs and runs a complete guest operating system using hardware-assisted virtualization managed by a hypervisor.** Providing hardware-level isolation, VMs serve as the primary tenancy boundary of modern cloud computing."
      },

      num: {
        t: "Virtualization Architectures: Type-1 vs Type-2 vs MicroVM vs Containers",
        h: ["Virtualization Model", "Hypervisor Layer", "Guest OS Requirement", "Boot Latency", "Multi-Tenant Isolation Strength"],
        r: [
          ["Type-1 Bare-Metal Hypervisor", "Runs directly on physical hardware (KVM, ESXi, Xen)", "Complete full guest OS kernel", "20 - 60 seconds", "Maximum (hardware-enforced virtualization boundary)"],
          ["Type-2 Hosted Hypervisor", "Runs as software on host OS (VirtualBox, VMware Fusion)", "Complete full guest OS kernel", "30 - 90 seconds", "Moderate (vulnerable to host OS crashes)"],
          ["MicroVM (Firecracker)", "Minimalist KVM-based hypervisor (Rust)", "Stripped Linux kernel (no ACPI, no PCI)", "5 - 50 milliseconds", "Maximum (hardware virtualization at container speed)"],
          ["Container Engine (runc)", "No hypervisor; Linux namespaces and cgroups", "No guest OS; shares host kernel", "50 - 300 milliseconds", "Moderate (process boundary on shared kernel)"]
        ],
        n: "Virtual Machines operate via a **Hypervisor (Virtual Machine Monitor / VMM)**. Modern hypervisors utilize hardware virtualization extensions built into modern CPUs (**Intel VT-x** and **AMD-V**) to execute guest operating system instructions directly on the physical processor at native speeds (**Hardware-Assisted Virtualization**). Sensitive CPU instructions (such as ring-0 kernel operations) trigger a hardware 'VM-Exit', returning control to the hypervisor to emulate the operation safely. Virtual disk and network performance is optimized using **virtio paravirtualized drivers**, bypassing slow hardware emulation. In public cloud environments (AWS EC2, Google Compute Engine, Azure VMs), every customer instance runs inside a Type-1 hypervisor VM, ensuring strict cryptographic and memory isolation between untrusted cloud tenants."
      },

      miss: [
        {
          w: "Containers have made Virtual Machines obsolete for all modern cloud architectures.",
          r: "Virtual Machines are the **foundational substrate of modern cloud computing**. Every managed Kubernetes service (AWS EKS, GCP GKE) runs container pods *inside* virtual machines. VMs provide the mandatory multi-tenant security boundary that containers cannot guarantee."
        },
        {
          w: "Type-1 hypervisors emulate all CPU instructions in software, making them 10x slower than bare metal.",
          r: "Modern Type-1 hypervisors (KVM) utilize hardware CPU extensions (Intel VT-x) that execute guest instructions **directly on physical CPU cores with near-zero overhead (<2-3%)**. Only I/O and memory paging incur modest hypervisor mediation."
        },
        {
          w: "Virtual machines are completely immune to all cross-tenant security attacks.",
          r: "CPU microarchitectural vulnerabilities (such as **Spectre, Meltdown, and Foreshadow/L1TF**) demonstrated that CPU speculative execution can leak memory across VM boundaries, requiring hypervisor kernel page table isolation and CPU microcode patches."
        },
        {
          w: "Virtual machine disks work like physical hard drives and never fail or corrupt.",
          r: "Cloud VM disks (such as AWS EBS) are **network-attached storage volumes** communicating over internal datacenter networks. Network partitions, IOPS throttling, and snapshot locks can cause VM disk hangs just like physical drive failures."
        }
      ],

      trade: {
        buys: [
          "Uncompromised multi-tenant security isolation: hardware-assisted hypervisors guarantee memory and CPU isolation between untrusted workloads.",
          "Heterogeneous OS flexibility: run Windows, Linux, and specialized BSD operating systems concurrently on the exact same physical host.",
          "Dedicated kernel tuning: customize kernel parameters (`sysctl`), load custom kernel modules, and manage OS-level network stacks.",
          "Live migration capabilities: hypervisors can migrate running virtual machines between physical servers with zero user-perceptible downtime."
        ],
        costs: [
          "Heavy memory and storage footprint: every VM runs a full guest operating system, consuming gigabytes of RAM and disk.",
          "Slow boot initialization: booting a full guest OS takes 20 to 60 seconds, limiting instant auto-scaling responsiveness.",
          "Hypervisor operational maintenance: managing hypervisor hosts, kernel security patches, and VM templates requires dedicated sysadmin overhead.",
          "Licensing and management expenses: commercial hypervisor platforms (VMware vSphere) carry high enterprise licensing fees."
        ],
        avoid: [
          "Never run untrusted, multi-tenant customer code inside shared-kernel containers; use Virtual Machines or MicroVMs.",
          "Never leave VM disks unencrypted; enable default cloud disk encryption (EBS KMS) across all virtual machine storage.",
          "Never run production VMs without paravirtualized drivers (`virtio`) installed for networking and disk I/O.",
          "Never treat virtual machine instances as permanent pets; automate provisioning via Infrastructure as Code (Terraform/Packer)."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "kubernetes",

      why: {
        before: "Teams deployed containers manually across virtual machines using custom shell scripts and Docker Compose; when a container crashed, an engineer had to restart it manually, and when a physical server died, all running workloads vanished until someone noticed hours later.",
        problem: "Production containerized microservices require an automated cluster operating system that schedules containers across thousands of servers, automatically heals failed workloads, manages service discovery, scales replicas based on traffic, and orchestrates zero-downtime rollouts.",
        shift: "**Kubernetes (K8s): An open-source container orchestration system for automating software deployment, scaling, and management of containerized applications.** Operating via declarative reconciliation loops, Kubernetes continuously drives the actual state of a cluster to match the desired state."
      },

      num: {
        t: "Kubernetes Control Plane Architecture: Core Component Mechanics",
        h: ["Component", "Function & Architectural Responsibility", "State Management", "Scalability Mechanism", "Failure Impact"],
        r: [
          ["`kube-apiserver`", "REST API gateway, authentication, admission control", "Stateless (reads/writes to etcd)", "Horizontal scaling behind load balancer", "Cluster management halts; running workloads continue"],
          ["`etcd`", "Consistent and highly-available key-value store", "Stateful (Raft consensus protocol)", "Clustered odd-node quorum (3 or 5 nodes)", "Catastrophic; total cluster state corruption / read-only"],
          ["`kube-scheduler`", "Assigns unscheduled pods to optimal worker nodes", "Stateless", "Active-passive leader election", "New pods stay in `Pending` state; running pods unaffected"],
          ["`kube-controller-manager`", "Executes reconciliation loops (Node, Deployment, Endpoint)", "Stateless", "Active-passive leader election", "Self-healing and scaling halt; existing state frozen"],
          ["`kubelet` (Worker Node)", "Node agent registering node, runs pods via CRI", "Local state on node", "One instance per physical/virtual node", "Node marked `NotReady`; pods rescheduled elsewhere"],
          ["`kube-proxy` (Worker Node)", "Maintains network rules (iptables/IPVS) for Services", "Stateless", "DaemonSet across all worker nodes", "Service routing breaks or becomes stale on that node"]
        ],
        n: "Kubernetes is built around the fundamental concept of **Declarative State and Reconciliation Loops**. Instead of telling the cluster *how* to do something imperatively, you declare the *desired state* in YAML manifests (e.g., `replicas: 3`). The **Control Plane** continuously observes the actual state, compares it to the declared state, and executes actions to converge reality toward the goal (**Control Loop**: Observe -> Diff -> Act). If a worker node suffers a hardware failure, the controller detects missing node heartbeats and the scheduler automatically spins up replacement pods on healthy nodes. Kubernetes abstracts infrastructure through core primitives: **Pods** (compute unit), **Services** (stable L4 virtual IP and load balancing), **Deployments** (declarative pod lifecycle and rolling updates), **ConfigMaps/Secrets** (configuration injection), and **Ingress** (L7 HTTP edge routing)."
      },

      miss: [
        {
          w: "Kubernetes is essential and recommended for all modern software applications.",
          r: "Adopting Kubernetes for a simple application with only 2-3 services is **massive architectural overkill**. Kubernetes introduces extreme operational complexity, YAML sprawl, networking overhead, and dedicated maintenance burdens. Managed container platforms (AWS ECS, Google Cloud Run) are often superior."
        },
        {
          w: "Setting CPU and memory requests and limits on pods is an optional optimization.",
          r: "Omitting resource requests and limits is the **number one cause of Kubernetes cluster instability**. Without requests, the scheduler packs too many pods on a node; without limits, a single memory leak will cause the Linux OOM killer to crash unrelated critical pods."
        },
        {
          w: "Kubernetes automatically makes stateful relational databases simple to run and scale.",
          r: "Kubernetes was designed for stateless workloads. Running stateful databases (PostgreSQL/MySQL) requires **StatefulSets, persistent volume claims, automated failover operators, and split-brain defenses**. Managed cloud databases (RDS, Cloud SQL) remain the industry best practice."
        },
        {
          w: "A Kubernetes Service load balances traffic by routing packets through a central proxy server.",
          r: "A standard ClusterIP Service is **not a physical proxy server**; it is a set of virtual **iptables or IPVS packet-filtering rules** programmed into the Linux kernel by `kube-proxy` on every worker node, translating the Service VIP directly to pod IPs with zero proxy hop."
        }
      ],

      trade: {
        buys: [
          "Automated self-healing: automatically restarts failed containers, reschedules evicted pods, and routes around dead nodes.",
          "Declarative infrastructure management: git-versioned YAML/Helm manifests define entire datacenter architectures reproducibility.",
          "Seamless horizontal autoscaling: Horizontal Pod Autoscaler (HPA) automatically adjusts replica counts based on CPU or custom metrics.",
          "Zero-downtime rolling deployments: gradually replaces old pods with new pods while verifying readiness probes before traffic shift."
        ],
        costs: [
          "Massive operational complexity: mastering Kubernetes requires deep expertise in networking (CNI), storage (CSI), and security (RBAC).",
          "Steep learning curve: developers must learn complex abstractions (Pods, Deployments, Services, Ingress, NetworkPolicies).",
          "Control plane infrastructure tax: running dedicated etcd and master nodes consumes continuous cloud infrastructure spend.",
          "Debugging friction: diagnosing failures requires correlating events, pod logs, kubelet logs, and CNI network packet captures."
        ],
        avoid: [
          "Never adopt Kubernetes when simple serverless containers (Cloud Run, AWS ECS) satisfy your organizational requirements.",
          "Never deploy pods without defining explicit `resources.requests` and `resources.limits` for both CPU and memory.",
          "Never store unencrypted production secrets in standard Kubernetes Secret manifests (which are merely base64-encoded plain text).",
          "Never run Kubernetes master control plane nodes as single instances without an odd-numbered etcd quorum (3 or 5 nodes)."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "pod",

      why: {
        before: "Container engines (Docker) managed individual, isolated containers; applications that required tightly coupled companion processes (log shippers, envoy proxies, metric scrapers) had to bake everything into a single bloated container image or coordinate complex manual networking across separate containers.",
        problem: "Distributed systems need an atomic scheduling primitive that allows tightly coupled companion containers to share the same network namespace, local storage volumes, and lifecycle while maintaining separate container images.",
        shift: "**Pod: The smallest deployable and schedulable computing unit in Kubernetes, encapsulating one or more containers that share storage, a network IP address, and runtime specifications.** Serving as the atomic foundation of Kubernetes, pods enable the sidecar architecture pattern."
      },

      num: {
        t: "Kubernetes Pod Architectural Patterns: Container Composition",
        h: ["Pod Pattern", "Container Roles", "Shared Resource Mechanism", "Lifecycle Coupling", "Primary Production Workload"],
        r: [
          ["Single Application Container", "Standard single web API or worker process", "Isolated veth network interface", "Single process lifecycle", "90% of standard microservice workloads"],
          ["Sidecar Pattern", "Main app + companion helper (logging, envoy proxy)", "Shared `localhost` networking & `emptyDir` disk", "Sidecar runs alongside main app", "Service mesh proxies (Istio/Linkerd), log forwarders (FluentBit)"],
          ["Init Container Pattern", "Setup container runs to completion before app boots", "Shared volume for downloaded assets/configs", "Runs sequentially to completion before app starts", "Database migration scripts, waiting for dependencies"],
          ["Ambassador Pattern", "Main app communicates through local ambassador proxy", "Shared `localhost` port forwarding", "Runs alongside main application", "Proxying local connections to external sharded databases"],
          ["Adapter Pattern", "Standardizes and translates app output/metrics", "Shared loopback interface / metrics socket", "Runs alongside main application", "Exposing standard Prometheus metrics from legacy apps"]
        ],
        n: "All containers inside a single Pod share two critical Linux kernel namespaces: (1) **Network Namespace**: all containers in the pod share the exact same IP address, port space, and routing table. A container running on port 8080 can communicate with a sidecar container running on port 9090 over **`localhost`** with near-zero network latency; and (2) **IPC / UTS Namespace**: containers share hostname and inter-process communication mechanisms. When a pod is scheduled, Kubernetes first creates a special **Pause Container** (`k8s.gcr.io/pause`) that initializes and holds open the shared network and IPC namespaces; application containers then join this existing namespace. Containers in a pod can also share storage using **Pod Volumes** (such as an `emptyDir` ephemeral scratch disk)."
      },

      miss: [
        {
          w: "A Pod and a Container are synonymous terms in Kubernetes.",
          r: "A **Pod is an abstraction that holds one or more containers**. While most pods run a single container, a pod can host multiple tightly coupled containers (main application + sidecar proxies + log shippers) sharing the same network namespace and IP address."
        },
        {
          w: "Pods have permanent, stable IP addresses that remain fixed throughout their lifetime.",
          r: "Pods are **strictly ephemeral and disposable**. When a pod crashes, restarts, or is rescheduled to another node, it receives a **brand-new IP address**. Client applications must NEVER address pod IPs directly; they must connect to a stable **Kubernetes Service**."
        },
        {
          w: "Multiple containers in the same pod can listen on the same TCP port.",
          r: "Because all containers in a pod share the **exact same network namespace and IP address**, they cannot bind to the same port. If Container A binds to port 8080, Container B attempting to bind to 8080 will crash with `EADDRINUSE (Address already in use)`."
        },
        {
          w: "You should create individual Pod manifests directly in production using `kubectl run`.",
          r: "Bare pods are not managed by controllers. If a bare pod dies or its node crashes, it will **NEVER be restarted or rescheduled**. In production, pods must always be managed by high-level controllers: **Deployments, StatefulSets, DaemonSets, or Jobs**."
        }
      ],

      trade: {
        buys: [
          "Clean separation of concerns: modularize cross-cutting concerns (logging, mTLS, metrics) into reusable sidecar containers.",
          "Zero-latency companion communication: containers communicate over `localhost` and shared memory volumes.",
          "Atomic scheduling guarantee: all containers within a pod are guaranteed to be co-located on the exact same physical node.",
          "Coordinated initialization: Init Containers execute database migrations and dependency checks before main apps start."
        ],
        costs: [
          "Shared fate failure: if the node hosting the pod crashes or runs out of memory, all containers in the pod die together.",
          "Resource contention: companion sidecars consume node CPU and memory allocations alongside the main application.",
          "Startup race conditions: main containers may attempt to handle traffic before network sidecars (Istio) have fully booted.",
          "Logging and debugging complexity: inspecting pod logs requires specifying which container within the pod to tail (`kubectl logs -c`)."
        ],
        avoid: [
          "Never deploy bare Pods directly; always wrap pods in high-level controllers (Deployments, StatefulSets).",
          "Never configure two containers in the same pod to listen on identical TCP or UDP port numbers.",
          "Never pack unrelated business microservices into the same pod; use multi-container pods strictly for tightly coupled sidecars.",
          "Never hardcode pod IP addresses in application configurations; use Kubernetes Service DNS names."
        ]
      }
    }

  ]);

})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
