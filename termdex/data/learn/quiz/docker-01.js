/* DOCKER — 50+ Hardcore Question Bank (Staff/Principal Level). */

/* ===================================================================
   Module: container — (14 Hardcore Questions)
   =================================================================== */

TD.addMCQ("docker", "container", [
  {
    "tag": "Linux Namespaces Isolation Dimensions",
    "lvl": "advanced",
    "q": "Which Linux kernel namespace isolates process IDs so that a container process can be PID 1 inside the container while having PID 10452 on the host OS?",
    "o": [
      "Mount Namespace",
      "PID Namespace (`CLONE_NEWPID`)",
      "Net Namespace",
      "User Namespace"
    ],
    "a": 1,
    "x": "The PID namespace virtualizes process IDs: the container process sees itself as PID 1, while the host kernel tracks its global PID in the host namespace."
  },
  {
    "tag": "Linux Cgroups v1 vs v2 Unified Hierarchy",
    "lvl": "advanced",
    "q": "Why did Linux transition from Cgroups v1 to Cgroups v2 in modern container engines?",
    "o": [
      "v1 was written in Python",
      "Cgroups v1 had independent, conflicting hierarchies per resource controller (memory, cpu, blkio), preventing coordinated resource limits; Cgroups v2 establishes a single **unified process hierarchy** with accurate combined memory/buffer-cache accounting",
      "v2 eliminates memory limits",
      "v1 did not support 64-bit kernels"
    ],
    "a": 1,
    "x": "Cgroups v2 unifies resource controllers under a single hierarchy tree, fixing broken out-of-memory handling and writeback page cache accounting in v1."
  },
  {
    "tag": "PID 1 Zombie Reaping (tini / dumb-init)",
    "lvl": "advanced",
    "q": "Why does running a Node.js or Python application directly as PID 1 in a Docker container lead to system resource exhaustion over time?",
    "o": [
      "PID 1 runs in read-only mode",
      "Standard application runtimes do not implement a **SIGCHLD reap handler**; when child sub-processes exit, they remain in the process table as **Zombie processes (`<defunct>`)** forever unless adopted and reaped by an init system like `tini`",
      "PID 1 disables network sockets",
      "PID 1 cannot execute multithreading"
    ],
    "a": 1,
    "x": "In Unix, orphaned child processes get reparented to PID 1. If PID 1 does not call `waitpid()` on `SIGCHLD`, zombies accumulate in the kernel process table until max PID exhaustion."
  },
  {
    "tag": "Overlay2 Storage Driver Write Amplification",
    "lvl": "advanced",
    "q": "In Docker's Overlay2 storage driver, what happens when a container modifies a single byte inside a 10GB file that exists in an underlying image layer (`lowerdir`)?",
    "o": [
      "Modifies the byte directly on disk in place",
      "Copy-on-Write (CoW) triggers: the entire 10GB file is copied from `lowerdir` up into the container's writable layer (`upperdir`) before the single byte write is executed, causing heavy disk I/O latency and space consumption",
      "Creates a symlink",
      "Compresses the file with gzip"
    ],
    "a": 1,
    "x": "Overlay2 operates at the file level, not block level. Modifying any part of a file in lowerdir forces a full file copy into upperdir."
  },
  {
    "tag": "Multi-Stage Docker Distroless Builds",
    "lvl": "advanced",
    "q": "How do Multi-Stage builds using `gcr.io/distroless/static` or `scratch` minimize container attack surface and CVE vulnerabilities?",
    "o": [
      "Encrypts the Dockerfile",
      "Compiles binary artifacts in an initial build stage and copies strictly the compiled static binary into a minimalist scratch image with **zero shell (`/bin/sh`), package managers (`apt/apk`), or OS utilities**, rendering shell injection and script payloads inoperable",
      "Runs images in CPU hardware enclaves",
      "Disables container networking"
    ],
    "a": 1,
    "x": "Distroless images contain strictly your application and runtime dependencies without bash, curl, or package managers, eliminating shell-spawn CVE exploitation."
  },
  {
    "tag": "Dropping Linux Capabilities (CAP_SYS_ADMIN)",
    "lvl": "advanced",
    "q": "Why is dropping all capabilities (`--cap-drop=ALL --cap-add=NET_BIND_SERVICE`) standard security practice in production Docker containers?",
    "o": [
      "Capabilities consume 1GB of RAM",
      "Even if a root process inside a container is compromised, lacking `CAP_SYS_ADMIN`, `CAP_NET_RAW`, and `CAP_DAC_OVERRIDE` prevents the attacker from mounting file systems, loading kernel modules, or escaping the container into the host OS",
      "Capabilities slow down CPU execution",
      "Dropping capabilities enables GPU access"
    ],
    "a": 1,
    "x": "Linux capabilities break root privileges into granular units. Dropping unneeded capabilities prevents privilege escalation and host container escapes."
  },
  {
    "tag": "gVisor (runsc) User-Space Kernel Sandbox",
    "lvl": "advanced",
    "q": "How does Google's gVisor (`runsc` OCI runtime) provide stronger multi-tenant container isolation than standard `runc`?",
    "o": [
      "Runs containers on separate physical machines",
      "Implements an independent user-space Linux kernel written in Go (Sentry) that intercepts and emulates all container system calls, preventing untrusted code from ever directly invoking host Linux kernel syscalls",
      "Replaces Docker with virtual machines",
      "Disables memory allocation"
    ],
    "a": 1,
    "x": "gVisor acts as a user-space kernel proxy. System calls are handled by the Sentry sandbox rather than directly touching the host OS kernel, preventing kernel zero-day privilege exploits."
  },
  {
    "tag": "Rootless Docker User Namespace UID Mapping",
    "lvl": "advanced",
    "q": "How does Rootless Docker allow non-root users to run containers securely without daemon root privileges?",
    "o": [
      "Bypasses Linux kernel security",
      "Uses Linux User Namespaces (`/etc/subuid` and `/etc/subgid`) to map container UID 0 (root inside container) to an unprivileged subordinate UID range (e.g. UID 100000–165535) on the host, ensuring container breakouts have zero host root permissions",
      "Disables file permissions",
      "Runs Docker in browser"
    ],
    "a": 1,
    "x": "Rootless Docker maps container root (UID 0) to unprivileged high UID ranges on the host, preventing host compromise even during container escape."
  },
  {
    "tag": "Docker BuildKit Cache Mounts",
    "lvl": "advanced",
    "q": "How does Docker BuildKit `--mount=type=cache,target=/root/.cache/pip` accelerate container builds in CI/CD pipelines?",
    "o": [
      "Disables pip installations",
      "Persists package manager cache directories across independent build runs without writing the cache data into the final output image layers, cutting build time by 10x",
      "Compresses images with zstd",
      "Pre-compiles Python to machine code"
    ],
    "a": 1,
    "x": "Cache mounts persist cache directories between image builds without embedding temporary cache data into the committed image filesystem."
  },
  {
    "tag": "Container Stop Signal Sequence Flow",
    "lvl": "advanced",
    "q": "What is the exact signal lifecycle executed when running `docker stop <container>`?",
    "o": [
      "Sends `SIGKILL` immediately",
      "Sends `SIGTERM` to the container main process, waits for a configurable grace period (default 10 seconds), and sends `SIGKILL` if the process has not cleanly exited",
      "Sends `SIGINT` then reboots",
      "Sends `SIGHUP`"
    ],
    "a": 1,
    "x": "`docker stop` sends `SIGTERM` to allow graceful cleanup. If the process does not terminate within the grace period (10s), the kernel sends un-catchable `SIGKILL`."
  },
  {
    "tag": "Kata Containers MicroVM Isolation",
    "lvl": "advanced",
    "q": "How do Kata Containers achieve hardware-level virtualization isolation while maintaining container-like speed?",
    "o": [
      "Runs Docker in virtualbox",
      "Spawns a dedicated lightweight MicroVM (using QEMU / Cloud-Hypervisor / Firecracker) with its own guest Linux kernel per Pod, eliminating shared-kernel vulnerabilities",
      "Uses WebAssembly only",
      "Disables hypervisors"
    ],
    "a": 1,
    "x": "Kata Containers wrap containers inside dedicated lightweight MicroVMs with independent guest kernels, providing hardware virtualization isolation."
  },
  {
    "tag": "Docker Daemon Live-Restore Setting",
    "lvl": "advanced",
    "q": "What is the function of configuring `\"live-restore\": true` in Docker's `/etc/docker/daemon.json`?",
    "o": [
      "Restores deleted containers from backup",
      "Allows containers to continue running uninterrupted when the Docker daemon crashes, restarts, or undergoes software upgrades, eliminating host maintenance outages",
      "Auto-restarts failed containers",
      "Restores image layers from Docker Hub"
    ],
    "a": 1,
    "x": "Live-restore decouples container execution from the dockerd daemon process, keeping containers alive across daemon restarts."
  },
  {
    "tag": "CRI-O vs Containerd Architecture",
    "lvl": "advanced",
    "q": "What makes CRI-O distinct from Containerd as a Kubernetes Container Runtime Interface (CRI)?",
    "o": [
      "CRI-O is written in Rust",
      "CRI-O is built exclusively and strictly to serve Kubernetes CRI specifications without supporting standalone CLI execution or non-Kubernetes features, maintaining a tiny code footprint tied directly to Kubernetes major releases",
      "CRI-O does not use OCI runtimes",
      "Containerd is deprecated in K8s"
    ],
    "a": 1,
    "x": "CRI-O is purpose-built solely for Kubernetes CRI with zero extraneous features, aligned release-by-release with Kubernetes core versions."
  },
  {
    "tag": "Docker ADD vs COPY Checksum Invalidation",
    "lvl": "advanced",
    "q": "Why is `COPY` preferred over `ADD` in Dockerfiles unless automatic tar extraction is explicitly required?",
    "o": [
      "`ADD` is slower",
      "`COPY` strictly copies local files verifying byte checksums for cache invalidation; `ADD` has unpredictable magic behavior (automatically uncompressing tar archives and downloading remote URLs without cache verification)",
      "`ADD` is deprecated",
      "`COPY` encrypts image layers"
    ],
    "a": 1,
    "x": "`COPY` is transparent and strictly copies files. `ADD` features automatic tar extraction and remote URL fetching, which complicates cache determinism."
  }
]);

/* ===================================================================
   Module: k8s — (18 Hardcore Questions)
   =================================================================== */

TD.addMCQ("docker", "k8s", [
  {
    "tag": "etcd Raft Consensus Quorum Math",
    "lvl": "advanced",
    "q": "In a Kubernetes control plane with an etcd cluster of $N = 5$ nodes, what is the maximum number of simultaneous node failures the cluster can tolerate while maintaining write availability?",
    "o": [
      "1 node",
      "2 nodes (Quorum is $\\lfloor N/2 \\rfloor + 1 = 3$ nodes; $5 - 3 = 2$ failures tolerated)",
      "3 nodes",
      "4 nodes"
    ],
    "a": 1,
    "x": "etcd uses Raft: a quorum of $\\lfloor N/2 \\rfloor + 1$ active nodes is required. For $N=5$, quorum is 3. The cluster can tolerate $5 - 3 = 2$ failures."
  },
  {
    "tag": "Kube-Proxy IPVS vs iptables Complexity",
    "lvl": "advanced",
    "q": "Why does `kube-proxy` in IPVS (IP Virtual Server) mode scale to 10,000+ Services without latency degradation, whereas `iptables` mode degrades significantly?",
    "o": [
      "IPVS disables firewall rules",
      "`iptables` rules are evaluated sequentially in an $O(N)$ linear chain per packet (introducing latency spikes at 5,000+ services); IPVS uses in-kernel **IPSet Hash Tables** achieving $O(1)$ constant-time packet routing regardless of service count",
      "IPVS runs in user space",
      "iptables is single-threaded"
    ],
    "a": 1,
    "x": "iptables requires sequential inspection of every packet against all service rules ($O(N)$). IPVS uses hash tables ($O(1)$), eliminating CPU packet processing bottlenecks in large clusters."
  },
  {
    "tag": "Kubernetes Operator Reconciliation Loop",
    "lvl": "advanced",
    "q": "What is the core design philosophy of a Kubernetes Custom Controller / Operator Reconciliation Loop?",
    "o": [
      "Execute instructions on a cron timer",
      "**Level-Triggered State Reconciliation**: Continuously observe the **Current State** of the cluster, compare it against the **Desired State** declared in Custom Resource Definitions (CRDs), and execute corrective actions to drive current state toward desired state (self-healing)",
      "Trigger actions only once upon event reception",
      "Restart pods when memory reaches 80%"
    ],
    "a": 1,
    "x": "Kubernetes operates on level-triggered reconciliation: controllers don't just react to edge events; they continuously ensure the actual cluster state matches desired declarative spec."
  },
  {
    "tag": "Horizontal Pod Autoscaler (HPA) Formula",
    "lvl": "advanced",
    "q": "A deployment has 4 replicas with average CPU utilization at 80%. Target CPU utilization is configured at 50%. How many replicas will HPA scale the deployment to?",
    "o": [
      "5 replicas",
      "7 replicas ($\\lceil 4 \\times \\frac{80}{50} \\rceil = \\lceil 6.4 \\rceil = 7$ replicas)",
      "8 replicas",
      "10 replicas"
    ],
    "a": 1,
    "x": "$\\text{DesiredReplicas} = \\lceil \\text{CurrentReplicas} \\times \\frac{\\text{CurrentMetric}}{\\text{DesiredMetric}} \\rceil = \\lceil 4 \\times \\frac{80}{50} \\rceil = \\lceil 6.4 \\rceil = 7$."
  },
  {
    "tag": "Pod Disruption Budget (PDB)",
    "lvl": "advanced",
    "q": "Why is defining a `PodDisruptionBudget` (PDB) critical for high-availability workloads during Kubernetes node drain operations?",
    "o": [
      "PDB limits CPU usage",
      "PDB guarantees that a minimum number (or percentage) of pod replicas (e.g. `minAvailable: 80%`) remain running concurrently during voluntary disruptions (e.g. cluster node upgrades/drains), preventing maintenance from causing downtime",
      "PDB prevents pods from crashing",
      "PDB encrypts pod secrets"
    ],
    "a": 1,
    "x": "PDB sets safety constraints on voluntary disruptions. When `kubectl drain` is executed, the API server respects PDBs by evicting pods incrementally only when minAvailable thresholds are satisfied."
  },
  {
    "tag": "Kubernetes CoreDNS ndots:5 Query Storm",
    "lvl": "advanced",
    "q": "Why does the default `ndots:5` setting in `/etc/resolv.conf` in Kubernetes pods cause a 5x DNS query multiplication storm when querying external hostnames (e.g. `api.stripe.com`)?",
    "o": [
      "CoreDNS has a recursive loop",
      "Because `api.stripe.com` contains 2 dots (< 5), the resolver first tries appending internal search domains sequentially (`api.stripe.com.default.svc.cluster.local`, `api.stripe.com.svc.cluster.local`, etc.), generating 4 failing internal queries before making the external query",
      "CoreDNS is single-threaded",
      "External queries are blocked by default"
    ],
    "a": 1,
    "x": "`ndots:5` forces the resolver to test internal search suffixes for any domain with fewer than 5 dots. Appending a trailing dot (`api.stripe.com.`) bypasses search domain expansion."
  },
  {
    "tag": "Kubernetes Ingress vs Gateway API",
    "lvl": "advanced",
    "q": "What architectural limitation of traditional Kubernetes Ingress did the new Gateway API specification address?",
    "o": [
      "Ingress cannot handle HTTPS",
      "Ingress is a single monolithic resource mixing cluster ops and developer routing rules; Gateway API splits responsibilities into role-oriented resources (`GatewayClass` for infra, `Gateway` for cluster ops, `HTTPRoute` for developers) with cross-namespace routing",
      "Ingress only works on AWS",
      "Gateway API disables load balancers"
    ],
    "a": 1,
    "x": "Gateway API provides role-oriented multi-tenancy, expressive header-based routing, traffic splitting, and cross-namespace route attachment that legacy Ingress lacked."
  },
  {
    "tag": "PreStop Hook vs SIGTERM Termination Race",
    "lvl": "advanced",
    "q": "Why must a `preStop` hook (e.g. `sleep 15`) be configured in Kubernetes Pods to achieve true zero-downtime rolling deployments?",
    "o": [
      "To let the CPU cool down",
      "When a pod is deleted, the endpoints removal event propagates asynchronously to all `kube-proxy` / ingress nodes across the cluster; without a `preStop` sleep, the container receives `SIGTERM` and stops serving before ingress proxies have finished removing the pod IP from routing tables, dropping traffic",
      "To allow disk sync",
      "To renew SSL certs"
    ],
    "a": 1,
    "x": "Endpoints removal across nodes takes several seconds. A `preStop` sleep delays `SIGTERM` until all external proxies and iptables rules have finished deregistering the dying pod IP."
  },
  {
    "tag": "Taints and Tolerations NoSchedule vs NoExecute",
    "lvl": "advanced",
    "q": "What is the difference between taint effects `effect: NoSchedule` and `effect: NoExecute` in Kubernetes?",
    "o": [
      "`NoSchedule` deletes pods; `NoExecute` pauses pods",
      "`NoSchedule` prevents new non-tolerating pods from being scheduled onto the node but allows existing pods to stay; `NoExecute` immediately **evicts already-running non-tolerating pods** from the node",
      "Both are identical",
      "`NoExecute` reboots the node"
    ],
    "a": 1,
    "x": "`NoSchedule` only affects the scheduler for new pods. `NoExecute` evicts existing running pods immediately unless they possess a matching toleration."
  },
  {
    "tag": "Pod Anti-Affinity Multi-AZ Topology Spread",
    "lvl": "advanced",
    "q": "How do you guarantee in Kubernetes that 3 replicas of a payment service are scheduled across 3 separate AWS Availability Zones?",
    "o": [
      "Use 3 separate clusters",
      "Configure `podAntiAffinity.requiredDuringSchedulingIgnoredDuringExecution` with `topologyKey: topology.kubernetes.io/zone` matching the payment pod labels",
      "Set node CPU limits",
      "Use hostPort"
    ],
    "a": 1,
    "x": "Pod Anti-Affinity with `topologyKey: topology.kubernetes.io/zone` forbids scheduling more than 1 replica inside the same failure domain zone."
  },
  {
    "tag": "Native Sidecar Containers (K8s 1.28+)",
    "lvl": "advanced",
    "q": "How do native sidecar containers (`initContainers` with `restartPolicy: Always`) in Kubernetes 1.28+ solve the legacy sidecar lifecycle problem?",
    "o": [
      "Runs sidecars on separate nodes",
      "Native sidecars start **before** main application containers and keep running throughout the pod lifetime, and main containers terminate cleanly **before** native sidecars exit, preventing log-shippers and proxy sidecars from dying prematurely during job execution",
      "Sidecars share process namespace with host",
      "Sidecars do not consume RAM"
    ],
    "a": 1,
    "x": "Native sidecars start before main containers and shut down only after main containers have completely exited, fixing broken batch job completion."
  },
  {
    "tag": "Node Lease and Heartbeat Failure Eviction",
    "lvl": "advanced",
    "q": "How does the Kubernetes `node-lease` controller detect node failure and trigger pod eviction?",
    "o": [
      "Pings node via ICMP",
      "The Kubelet periodically renews a `Lease` object in the `kube-node-lease` namespace (default every 10s); if lease renewal fails for longer than `node-monitor-grace-period` (default 40s), the controller marks the node `NotReady` and schedules pod evictions",
      "Restarts master node",
      "Checks SSH connection"
    ],
    "a": 1,
    "x": "Kubelet heartbeats update Lease objects in etcd. If updates cease for 40s, the node controller marks the node dead and evicts pods to healthy nodes."
  },
  {
    "tag": "Kubernetes StatefulSet Ordinal Partition Updates",
    "lvl": "advanced",
    "q": "In Kubernetes StatefulSets, how does setting `spec.updateStrategy.rollingUpdate.partition: 2` enable canary deployments?",
    "o": [
      "Updates all pods simultaneously",
      "Only pods with ordinal index $\\ge 2$ will be updated with the new container image (e.g. `pod-2`, `pod-3`), while `pod-0` and `pod-1` continue running the old image for canary observation",
      "Deletes pod-2",
      "Restarts pod-0"
    ],
    "a": 1,
    "x": "StatefulSet update partition defines the minimum ordinal index to update, allowing fine-grained canary releases across numbered stateful instances."
  },
  {
    "tag": "CSI Volume Attachment Workflow",
    "lvl": "advanced",
    "q": "In the Kubernetes Container Storage Interface (CSI), what component attaches an AWS EBS volume to an EC2 instance before Kubelet formats and mounts it?",
    "o": [
      "Kube-DNS",
      "`csi-attacher` (external controller communicating with cloud APIs to attach the block volume to the node), followed by Kubelet's `VolumeManager` executing `NodeStageVolume` and `NodePublishVolume`",
      "Ingress controller",
      "CoreDNS"
    ],
    "a": 1,
    "x": "CSI decouples volume attach from volume mount. The external-attacher calls cloud APIs, and Kubelet executes local filesystem mounting."
  },
  {
    "tag": "Vertical Pod Autoscaler (VPA) Resizing Mechanics",
    "lvl": "advanced",
    "q": "How does the Kubernetes Vertical Pod Autoscaler (VPA) apply updated CPU and Memory requests to existing pods?",
    "o": [
      "Dynamically modifies RAM without restarting",
      "VPA Recommender computes optimal resource requests, VPA Updater evicts the current pod, and the VPA Mutating Webhook injects the new resource requests into the Pod spec during pod recreation",
      "Hot-plugs virtual CPUs",
      "Modifies etcd directly"
    ],
    "a": 1,
    "x": "Unless using in-place resize (K8s 1.27+ alpha), VPA resizes pods by evicting them so admission controllers inject adjusted requests during restart."
  },
  {
    "tag": "Ephemeral Storage emptyDir Size Limits",
    "lvl": "advanced",
    "q": "What happens when an application writes 20GB of data into an `emptyDir: {}` volume with `sizeLimit: 10Gi` in Kubernetes?",
    "o": [
      "Writes are compressed with gzip",
      "The Kubelet's ephemeral storage eviction manager detects that the pod has exceeded its `sizeLimit` and **evicts the pod immediately** with an `Evicted: Pod ephemeral local storage usage exceeds limit` message",
      "Disk expansion occurs",
      "Container CPU is throttled"
    ],
    "a": 1,
    "x": "`emptyDir` storage is monitored by Kubelet. Exceeding configured `sizeLimit` triggers pod eviction to prevent host disk exhaustion."
  },
  {
    "tag": "Scheduler Framework Extension Points",
    "lvl": "advanced",
    "q": "In the Kubernetes Scheduler Framework, what is the role of the `Score` and `NormalizeScore` extension plugins?",
    "o": [
      "Encrypts pod spec",
      "`Score` plugins rank nodes that passed the `Filter` phase by assigning numerical scores ($0-100$), and `NormalizeScore` scales plugin scores to a uniform range before computing the final weighted node sum to pick the winning node",
      "Filters out nodes with taints",
      "Binds pod to etcd"
    ],
    "a": 1,
    "x": "The Score phase evaluates node fitness, assigning weighted scores to prioritize optimal nodes after Filter plugins have removed invalid nodes."
  },
  {
    "tag": "DaemonSet Node Surge Scheduling (maxSurge)",
    "lvl": "advanced",
    "q": "How does configuring `spec.updateStrategy.rollingUpdate.maxSurge: 1` optimize DaemonSet updates in Kubernetes 1.22+?",
    "o": [
      "Deletes all DaemonSet pods",
      "Creates the new version of the DaemonSet pod on the node **before** terminating the old version during upgrades, ensuring zero downtime for critical node agents like log forwarders and CNI plugins",
      "Restarts the worker node",
      "Runs DaemonSets on master nodes only"
    ],
    "a": 1,
    "x": "`maxSurge` spawns the new DaemonSet pod concurrently on the same node before stopping the old pod, ensuring uninterrupted agent monitoring."
  }
]);

/* ===================================================================
   Module: net — (6 Hardcore Questions)
   =================================================================== */

TD.addMCQ("docker", "net", [
  {
    "tag": "Kubernetes CNI Overlay (VXLAN) vs Direct BGP Routing",
    "lvl": "advanced",
    "q": "What is the performance trade-off between an Overlay CNI network (Flannel/Weave with VXLAN) and a Direct Routing CNI (Calico BGP / Cilium native routing)?",
    "o": [
      "Overlay networks do not support IPv4",
      "Overlay networks encapsulate pod traffic in UDP packets (adding 50-byte header overhead and CPU packet encapsulation latency); Direct BGP routing peers with top-of-rack switches to route native pod IPs with line-rate physical network speed",
      "Direct routing requires virtual machines",
      "Overlay networks have zero CPU overhead"
    ],
    "a": 1,
    "x": "VXLAN overlays encapsulate pod packets in UDP, incurring MTU truncation and CPU overhead. Direct BGP/Cilium routing routes raw pod IPs natively without packet encapsulation."
  },
  {
    "tag": "Service Mesh Ambient Mesh (Sidecarless) Architecture",
    "lvl": "advanced",
    "q": "How does Istio Ambient Mesh eliminate the memory and CPU overhead of injecting an Envoy sidecar proxy into every application Pod?",
    "o": [
      "Disables mTLS encryption",
      "Splits the proxy into two layers: a shared node-level Layer 4 Zero-Trust Tunnel (`ztunnel`) daemon that handles mutual TLS encryption transparently, and optional standalone Layer 7 Waypoint proxies only where complex routing/auth is needed",
      "Runs proxies on user laptops",
      "Replaces Envoy with iptables"
    ],
    "a": 1,
    "x": "Sidecar proxies consume 50MB+ RAM per pod. Ambient mesh replaces sidecars with a shared L4 node agent (ztunnel), cutting proxy compute and memory overhead by up to 90%."
  },
  {
    "tag": "Headless Services for Distributed Cluster Discovery",
    "lvl": "advanced",
    "q": "Why must distributed stateful databases (Kafka, Cassandra, MongoDB) use a Kubernetes **Headless Service (`clusterIP: None`)**?",
    "o": [
      "Headless services bypass firewalls",
      "A headless service does not allocate a single virtual VIP load balancer; instead, a DNS query returns **A-records for ALL individual pod IPs**, allowing database nodes to discover each other's direct peer network addresses directly",
      "Headless services provide SSL termination",
      "Headless services run in RAM only"
    ],
    "a": 1,
    "x": "Stateful clusters need direct node-to-node peer communication. `clusterIP: None` returns all pod IPs via DNS rather than load-balancing through a shared virtual IP."
  },
  {
    "tag": "Kubernetes NetworkPolicies Default Deny",
    "lvl": "advanced",
    "q": "By default in Kubernetes, all pods can communicate with all other pods across all namespaces. How do you enforce a **Default Deny All Ingress** policy on a namespace?",
    "o": [
      "Delete kube-dns",
      "Create a `NetworkPolicy` selecting all pods (`podSelector: {}`) with `policyTypes: [Ingress]` and an empty `ingress: []` rule array, blocking all incoming traffic unless explicitly whitelisted",
      "Set node firewall to drop packets",
      "Disable container ports"
    ],
    "a": 1,
    "x": "An empty `ingress: []` list inside a `NetworkPolicy` matching `{}` creates a default deny-all rule, enforcing zero-trust ingress isolation."
  },
  {
    "tag": "Docker Macvlan vs Ipvlan Network Drivers",
    "lvl": "advanced",
    "q": "What is the difference between Docker `macvlan` and `ipvlan` network drivers when connecting containers directly to physical networks?",
    "o": [
      "Ipvlan is wireless only",
      "`macvlan` assigns a unique MAC address to every container (which can overload network switch MAC tables); `ipvlan` shares the parent host NIC's single MAC address across all containers while assigning distinct IP addresses",
      "Macvlan does not support IPv4",
      "Both require NAT"
    ],
    "a": 1,
    "x": "`macvlan` creates distinct MAC addresses per container. `ipvlan` multiplexes multiple container IP addresses on a single parent physical MAC address, avoiding switch port security limits."
  },
  {
    "tag": "Docker Host Networking (--net=host) Throughput",
    "lvl": "advanced",
    "q": "What is the architectural benefit and security trade-off of running a high-throughput network service with Docker `--net=host`?",
    "o": [
      "Encrypts network packets",
      "Completely bypasses container network namespace isolation and virtual ethernet (`veth`) bridge translation, achieving zero packet latency overhead at the cost of exposing container port bindings directly on the host interface",
      "Runs networking on GPU",
      "Disables TCP checksums"
    ],
    "a": 1,
    "x": "Host networking places container network interfaces directly in the host namespace, eliminating virtual bridge and NAT overhead for maximum line-rate network performance."
  }
]);

/* ===================================================================
   Module: sec — (7 Hardcore Questions)
   =================================================================== */

TD.addMCQ("docker", "sec", [
  {
    "tag": "Sigstore Cosign Keyless Container Signing",
    "lvl": "advanced",
    "q": "How does Sigstore / Cosign achieve **Keyless Container Image Signing** in production CI/CD pipelines?",
    "o": [
      "Signs images with hardcoded passwords",
      "Uses OpenID Connect (OIDC) from the CI/CD runner (GitHub Actions) to obtain a short-lived x509 certificate from Fulcio (CA) tied to the runner's identity, signs the image digest, and logs the cryptographic proof in the Rekor transparency ledger",
      "Encrypts the container image with AES-256",
      "Stores private keys on disk"
    ],
    "a": 1,
    "x": "Keyless signing eliminates dangerous long-lived private keys. Fulcio issues ephemeral certificates tied to OIDC workload identity, and Rekor records public immutable proof."
  },
  {
    "tag": "Kubernetes Validating Admission Webhook (OPA/Kyverno)",
    "lvl": "advanced",
    "q": "How do Policy Engines like OPA Gatekeeper and Kyverno enforce security policies (e.g. forbidding `privileged: true` containers) before resources are saved to etcd?",
    "o": [
      "Scans container logs periodically",
      "Intercept the API request in the **Validating Admission Controller** phase of the Kubernetes API Server pipeline, evaluating the resource manifest JSON against declarative policies and returning an HTTP 403 rejection if violations are detected",
      "Terminates running pods after 10 seconds",
      "Rewrites container Dockerfiles"
    ],
    "a": 1,
    "x": "Admission webhooks intercept create/update requests after authentication and schema validation, rejecting non-compliant manifests before they are ever persisted to etcd."
  },
  {
    "tag": "Bound Service Account Tokens (Projected Volumes)",
    "lvl": "advanced",
    "q": "Why did Kubernetes 1.22+ deprecate static auto-generated Secret tokens in favor of Bound Service Account Token Projection?",
    "o": [
      "Static tokens were too long",
      "Legacy static secret tokens never expired and could be stolen to access the API server indefinitely; Bound tokens are short-lived (e.g. 1 hour), cryptographically bound to the pod's lifetime and namespace, and auto-rotated in projected volumes",
      "Bound tokens are encrypted with RSA-4096",
      "Static tokens do not support RBAC"
    ],
    "a": 1,
    "x": "Bound tokens are time-limited, audience-restricted, and tied to the pod lifecycle. If the pod is deleted, the token becomes immediately invalid."
  },
  {
    "tag": "Pod OOMKilled vs Node Eviction Mechanics",
    "lvl": "advanced",
    "q": "What is the difference between a Pod receiving `OOMKilled` (Exit Code 137) and a Pod being `Evicted` due to Node MemoryPressure?",
    "o": [
      "They are identical",
      "`OOMKilled` occurs when an individual container exceeds its configured `resources.limits.memory` and is terminated directly by the Linux kernel cgroup OOM killer; `Evicted` occurs when the Kubelet evicts pods according to QoS classes to protect the overall host node from crashing",
      "Evicted pods restart immediately",
      "OOMKilled is for CPU only"
    ],
    "a": 1,
    "x": "Cgroups OOM-killer terminates specific processes violating limit boundaries (Exit 137). Kubelet eviction occurs at node-level thresholds based on QoS classes (BestEffort evicted first)."
  },
  {
    "tag": "Trivy Container Vulnerability Scanning",
    "lvl": "advanced",
    "q": "How does Trivy detect vulnerabilities and misconfigurations in container images during CI/CD builds?",
    "o": [
      "Runs image in a sandbox for 10 minutes",
      "Extracts the image filesystem layers, parses OS package metadata (`dpkg`, `rpm`, `apk`) and language lockfiles (`package-lock.json`, `go.sum`, `Cargo.lock`), and matches hashes against public CVE and vulnerability advisories",
      "Decompiles binary files to C",
      "Scans network ports"
    ],
    "a": 1,
    "x": "Trivy inspects layer package databases and dependency lockfiles to generate a full SBOM and match known CVE signatures."
  },
  {
    "tag": "External Secrets Operator (ESO) Architecture",
    "lvl": "advanced",
    "q": "How does the External Secrets Operator (ESO) synchronize credentials from AWS Secrets Manager or HashiCorp Vault into Kubernetes?",
    "o": [
      "Stores credentials in Git",
      "A controller polls external secret management APIs using authenticated cloud IAM roles (IRSA) and dynamically creates and updates native Kubernetes `Secret` objects in the cluster with automatic rotation sync",
      "Hardcodes passwords in pods",
      "Encrypts secrets on the developer laptop"
    ],
    "a": 1,
    "x": "ESO connects to external enterprise secret stores via cloud IAM roles, reconciling external secret state into native Kubernetes secrets automatically."
  },
  {
    "tag": "Pod Security Standards (PSS) Restricted Profile",
    "lvl": "advanced",
    "q": "What does setting `pod-security.kubernetes.io/enforce: restricted` on a Kubernetes namespace enforce?",
    "o": [
      "Deletes all pods",
      "Enforces strict hardening: forbids root user execution (`runAsNonRoot: true`), denies all privilege escalation (`allowPrivilegeEscalation: false`), drops all Linux capabilities except `NET_BIND_SERVICE`, and restricts volume types to standard safe mounts",
      "Blocks all outbound internet traffic",
      "Restricts namespace to 1 user"
    ],
    "a": 1,
    "x": "Restricted PSS enforces container hardening: non-root execution, privilege escalation denial, read-only root filesystems, and strict capability dropping."
  }
]);

/* ===================================================================
   Module: ops — (5 Hardcore Questions)
   =================================================================== */

TD.addMCQ("docker", "ops", [
  {
    "tag": "Karpenter vs Cluster Autoscaler Node Provisioning",
    "lvl": "advanced",
    "q": "Why is AWS Karpenter significantly faster and more cost-effective than legacy Kubernetes Cluster Autoscaler?",
    "o": [
      "Karpenter is written in Python",
      "Legacy Autoscaler scales fixed-size Auto Scaling Groups (ASGs); Karpenter bypasses ASGs, directly evaluates pending unschedulable pod resource requirements (CPU, memory, GPU, spot preferences), and provisions custom right-sized EC2 instances directly via EC2 APIs in seconds",
      "Karpenter disables EC2 billing",
      "Cluster Autoscaler only works on GCP"
    ],
    "a": 1,
    "x": "Karpenter evaluates exact pod constraints and launches optimal mixed-instance node types directly via cloud APIs in sub-minute time without rigid Auto Scaling Groups."
  },
  {
    "tag": "ArgoCD GitOps Automated Drift Detection",
    "lvl": "advanced",
    "q": "In a GitOps workflow with ArgoCD, what happens when a developer manually runs `kubectl edit deployment` to alter a production configuration directly in the cluster?",
    "o": [
      "ArgoCD crashes",
      "ArgoCD detects a **State Drift** between the desired state in Git and the live state in the cluster, flags the application as `OutOfSync`, and (if auto-sync with self-healing is enabled) automatically overwrites the manual change to restore Git source-of-truth",
      "Git repository is automatically updated",
      "The cluster is locked in read-only mode"
    ],
    "a": 1,
    "x": "GitOps enforces Git as the single source of truth. ArgoCD detects configuration drift and automatically reconciles the live cluster back to the committed Git manifest."
  },
  {
    "tag": "Helm Templating vs Kustomize Overlays",
    "lvl": "advanced",
    "q": "What is the architectural difference between Helm and Kustomize for Kubernetes manifest management?",
    "o": [
      "Helm is for Windows; Kustomize is for Linux",
      "Helm uses dynamic text template interpolation (`{{ .Values.replicaCount }}`) with chart packaging; Kustomize is **template-free**, using declarative structured YAML patches and overlays on pristine base manifests",
      "Kustomize requires Docker daemon",
      "Helm does not support versioning"
    ],
    "a": 1,
    "x": "Helm parameterizes templates via Go text templates. Kustomize uses patch overlays without templates, keeping pure Kubernetes YAML intact."
  },
  {
    "tag": "Docker Logging Driver Max-Size Rotation",
    "lvl": "advanced",
    "q": "Why must `/etc/docker/daemon.json` configure `log-driver: json-file` with `max-size: 50m` and `max-file: 3` in production nodes?",
    "o": [
      "To speed up container logs",
      "By default, Docker `json-file` logging driver writes container stdout/stderr to disk with **unbounded size**, which will silently fill the host `/var/lib/docker` partition to 100% disk utilization and crash the host OS",
      "To encrypt logs",
      "To forward logs to AWS S3"
    ],
    "a": 1,
    "x": "Unconfigured Docker log files grow indefinitely until disk space is exhausted. Setting `max-size` and `max-file` enforces automatic file rotation."
  },
  {
    "tag": "Docker Compose v2 Variable Precedence",
    "lvl": "advanced",
    "q": "In Docker Compose v2, if variable `PORT` is defined in the host shell environment, in a local `.env` file, and inside the `compose.yaml` file, what is the evaluation precedence?",
    "o": [
      "`.env` file wins",
      "**Host Shell Environment** overrides `.env` file, which in turn overrides defaults set inside `compose.yaml`",
      "`compose.yaml` overrides shell environment",
      "All values are concatenated"
    ],
    "a": 1,
    "x": "Compose follows standard hierarchy: host environment variables take highest precedence, followed by `.env` file values, followed by compose file defaults."
  }
]);

