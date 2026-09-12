/* ==========================================================================
   Depth pass 132 — DevOps & Cloud batch 3: IaC, GitOps & Infrastructure Automation.
   Helm, Terraform, Ansible, Configuration Management,
   Immutable Infrastructure, GitOps, Configuration Drift.

   Declarative infrastructure graphs, agentless remote automation, immutable server baking,
   pull-based GitOps cluster reconciliation, and continuous drift eradication
   govern modern cloud operations.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "helm",

      why: {
        before: "Kubernetes applications required maintaining dozens of sprawling, repetitive YAML manifests (Deployments, Services, ConfigMaps, Ingresses, RBAC) across dev, staging, and production environments; managing copy-pasted manifests led to subtle indentation errors, configuration drift, and impossible multi-resource rollbacks.",
        problem: "Kubernetes lacks native templating, parameterization, and release versioning; teams need a package manager that bundles complex multi-resource applications into parameterized, version-controlled releases that can be installed, upgraded, and rolled back with a single command.",
        shift: "**Helm: The de facto package manager for Kubernetes that bundles related YAML manifests into versioned, reusable packages called Helm Charts.** Parameterizing configurations via `values.yaml` and tracking releases via in-cluster secrets, Helm standardizes Kubernetes application deployment."
      },

      num: {
        t: "Kubernetes Packaging & Templating Tools: Comparative Architecture",
        h: ["Tool", "Configuration Mechanism", "Release Tracking & Rollbacks", "Secret Management Support", "Primary Production Domain"],
        r: [
          ["Helm v3", "Go text/template engine over YAML manifests", "In-cluster release history in Secrets (`helm rollback`)", "Helm-secrets / external secrets operator", "Third-party software distribution, complex multi-tier apps"],
          ["Kustomize", "Template-free overlay patches (`kustomization.yaml`)", "None native (relies on Git / GitOps)", "Native secretGenerator with hashing", "Kubernetes-native internal service customization"],
          ["Jsonnet / Tanka", "Object-oriented configuration DSL extending JSON", "None native (compiled via CLI / CI)", "External secrets integration", "Complex enterprise multi-cluster environments"],
          ["CUE (Timoni)", "Type-safe declarative validation & data constraint language", "OCI-packaged instances with state tracking", "Strict schema validation for secrets", "Next-gen robust Kubernetes packaging without text templates"],
          ["Carvel (ytt)", "Deterministic YAML templating via Starlark (Python subset)", "kapp release and state tracking", "Integrated with secretgen-controller", "VMware Tanzu enterprise Kubernetes ecosystems"]
        ],
        n: "A Helm package is called a **Chart**, structured as: (1) `Chart.yaml` (metadata and semantic version); (2) `values.yaml` (default configuration parameters); and (3) `templates/` (Kubernetes YAML manifests containing Go template directives like `{{ .Values.replicaCount }}`). In **Helm v3**, the insecure server-side daemon (**Tiller**) was completely eliminated; Helm now communicates directly with the Kubernetes API using the local user's kubeconfig RBAC credentials. Every deployment creates a versioned **Release**, storing snapshot metadata in Kubernetes Secrets. This enables deterministic one-line rollbacks (`helm rollback <release> <revision>`). Modern organizations package and distribute Helm charts as OCI artifacts stored directly in container registries (Amazon ECR, Harbor)."
      },

      miss: [
        {
          w: "Helm v3 requires installing a server-side component (Tiller) with cluster-admin rights.",
          r: "Tiller was **completely removed in Helm v3**. Helm v3 is a purely client-side CLI tool that operates using the RBAC permissions of the executing user or CI service account, eliminating the severe security vulnerabilities of Helm v2."
        },
        {
          w: "Go templating over YAML manifests is safe from syntax and type errors.",
          r: "Go template evaluation is **pure string manipulation without YAML awareness**. A single misplaced space in an indentation block (`{{ toYaml . | indent 4 }}`) produces syntactically invalid YAML that fails at runtime during deployment."
        },
        {
          w: "Helm and Kustomize are mutually exclusive tools that cannot be used together.",
          r: "They complement each other exceptionally well. Teams frequently use **Helm to template and package third-party vendor applications**, and use **Kustomize to apply environment-specific overlays** without modifying upstream Helm chart templates (`helm template | kustomize build`)."
        },
        {
          w: "Storing plaintext database passwords in Helm `values.yaml` is safe if the Git repository is private.",
          r: "Private repositories leak credentials through developer checkouts, logs, and compromised accounts. Secrets in Helm must be encrypted using **SOPS / Helm-secrets** or managed via the **External Secrets Operator** fetching from AWS Secrets Manager/Vault."
        }
      ],

      trade: {
        buys: [
          "Parameterization across environments: deploy identical chart templates to staging and production using different `values.yaml`.",
          "One-command atomic rollbacks: revert multi-manifest deployments instantly via `helm rollback` without rebuilding images.",
          "Expansive open-source ecosystem: install battle-tested production platforms (Prometheus, cert-manager, Redis) in minutes via public charts.",
          "OCI registry distribution: store, version, and distribute Helm charts alongside container images in standard registries."
        ],
        costs: [
          "Go template syntax fragility: debugging complex template whitespace, quotation, and indentation errors is frustrating.",
          "Chart drift and upgrade maintenance: keeping upstream charts updated and reconciling breaking changes across major chart versions.",
          "State synchronization lag: direct `kubectl` edits bypass Helm release history, causing conflicts during subsequent `helm upgrade`.",
          "Limited dry-run verification: `helm template` catches syntax errors but cannot validate cluster admission controller constraints."
        ],
        avoid: [
          "Never commit unencrypted passwords, API tokens, or TLS private keys into `values.yaml` files in version control.",
          "Never execute manual `kubectl edit` modifications on resources managed by a Helm release; change `values.yaml` and upgrade.",
          "Never deploy third-party Helm charts from the public internet without auditing the templates and pinning chart versions.",
          "Never neglect to define resource requests and limits in Helm chart `values.yaml` files."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "terraform",

      why: {
        before: "Cloud infrastructure was provisioned by clicking through cloud web consoles or running ad-hoc shell scripts; configurations were unversioned, environments could not be cloned reliably, and catastrophic manual typos in production took down systems without audit trails.",
        problem: "Organizations need to define, provision, and manage multi-cloud infrastructure deterministically using version-controlled code that computes dependency graphs, previews changes before execution, and tracks infrastructure state.",
        shift: "**Terraform: An open-source, declarative Infrastructure as Code (IaC) tool created by HashiCorp that provisions and manages cloud infrastructure across hundreds of providers using the HashiCorp Configuration Language (HCL).** Utilizing state files and dependency graphs, Terraform brings software engineering rigor to infrastructure."
      },

      num: {
        t: "Terraform Core Lifecycle Commands: Operational Mechanics & Risk",
        h: ["Command", "State File Mutation", "Cloud API Calls Executed", "Human Review Requirement", "Critical Operational Risk"],
        r: [
          ["`terraform init`", "None (downloads providers/modules)", "Downloads plugins from registry", "None", "Network timeouts; malicious third-party provider versions"],
          ["`terraform plan`", "Refreshes in-memory state; no disk writes", "Read-only API calls to inspect live resources", "Mandatory review step", "Misinterpreting `forces replacement` plan warnings"],
          ["`terraform apply`", "Writes updated state file to remote backend", "Mutating API calls (Create, Update, Delete)", "Requires manual confirmation (`yes`)", "Accidental destruction of databases or network routing"],
          ["`terraform refresh`", "Updates state file to match live cloud state", "Read-only API calls to all resources", "None (deprecated in favor of `plan -refresh-only`)", "Overwrites state file, masking out-of-band manual drift"],
          ["`terraform state rm`", "Removes resource from state file", "Zero cloud API calls (leaves cloud resource intact)", "Extreme caution required", "Resource orphaned; no longer tracked or managed by IaC"]
        ],
        n: "Terraform is built on **Declarative Graph Resolution**. You write HCL declaring the desired end-state; Terraform constructs a **Directed Acyclic Graph (DAG)** of all resources, determines optimal creation parallelism, and reconciles differences against the **Terraform State File (`terraform.tfstate`)**. The state file maps declared HCL configuration blocks to real-world cloud provider resource IDs. Because the state file is the single authoritative source of truth, teams MUST store it in a **Remote Backend** (such as Amazon S3 with KMS encryption) with **Distributed State Locking** (using DynamoDB) to prevent concurrent executions from corrupting state. Reviewing the execution plan (`terraform plan`) is the primary safety guardrail: any resource showing `~` is modified in-place, while `- / +` denotes **destructive replacement** (destroy and recreate)."
      },

      miss: [
        {
          w: "The Terraform state file can safely be committed to a private Git repository.",
          r: "Committing state files to Git is a **critical security vulnerability**. The state file records all resource attributes in **plaintext**, including initial database passwords, private keys, and API tokens. Remote encrypted backends (S3 with KMS) must always be used."
        },
        {
          w: "Terraform automatically detects and prevents all concurrent applies across a team.",
          r: "Terraform only prevents concurrent applies if **State Locking is explicitly configured** (e.g., using a DynamoDB table with S3, or native locking in Terraform Cloud). Without state locking, two simultaneous applies will corrupt the state file permanently."
        },
        {
          w: "Changes marked as `forces replacement` in a Terraform plan are harmless routine updates.",
          r: "`forces replacement` means **Terraform will DESTROY the existing resource and create a new one**. If this occurs on a managed database (RDS) or persistent disk, all data will be permanently wiped unless `lifecycle { prevent_destroy = true }` is set."
        },
        {
          w: "Terraform is an imperative tool that executes commands in the exact order they appear in the file.",
          r: "Terraform is **strictly declarative**. The order of code blocks in `.tf` files does not matter. Terraform builds an internal dependency graph based on resource references (`vpc_id = aws_vpc.main.id`) and provisions independent resources concurrently."
        }
      ],

      trade: {
        buys: [
          "Complete multi-cloud declarative reproducibility: clone identical production, staging, and disaster-recovery environments in minutes.",
          "Pre-execution change visibility: `terraform plan` previews all creations, modifications, and destructions before anything touches cloud APIs.",
          "Automated dependency resolution: constructs a dependency graph to create resources in optimal parallel order.",
          "Reusable architectural modules: encapsulate enterprise security and networking standards into versioned, shared Terraform modules."
        ],
        costs: [
          "State file management liability: losing, corrupting, or leaking the state file can paralyze infrastructure operations.",
          "Out-of-band configuration drift: manual changes made in cloud consoles diverge from code, requiring drift reconciliation.",
          "Destructive update hazards: subtle attribute changes can trigger unintended resource destruction and recreation.",
          "Provider API rate limiting: refreshing thousands of cloud resources during large plans can trigger cloud API throttling."
        ],
        avoid: [
          "Never commit `terraform.tfstate` or `.tfstate.backup` files into Git repositories.",
          "Never execute `terraform apply` without carefully inspecting the output of `terraform plan` for destructive replacements.",
          "Never run Terraform in a team without automated remote state storage and distributed state locking.",
          "Never create giant monolithic state files covering entire organizations; decompose into small, blast-radius-isolated states."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "ansible",

      why: {
        before: "Configuring servers required installing and managing heavy client-server agents (Puppet, Chef) on every machine, maintaining agent PKI certificates, and running master servers that crashed under scale; or running un-idempotent bash scripts that broke when re-run.",
        problem: "Systems administrators need an agentless, lightweight, idempotent automation engine that connects over standard SSH to configure operating systems, deploy software, and orchestrate complex multi-node rolling upgrades.",
        shift: "**Ansible: An open-source, agentless IT automation and configuration management engine that uses declarative YAML playbooks to configure systems, deploy software, and orchestrate operational workflows over standard SSH/WinRM.** Delivering idempotent task execution without daemon overhead, Ansible simplifies fleet configuration."
      },

      num: {
        t: "Configuration Management Architectures: Ansible vs Puppet vs Chef vs SaltStack",
        h: ["Platform", "Agent Architecture", "Transport Protocol", "Language & Syntax", "Idempotency Enforcement"],
        r: [
          ["Ansible", "Agentless (requires only Python & SSH)", "OpenSSH / WinRM", "Declarative YAML (Playbooks & Jinja2)", "Module-level declarative idempotency checks"],
          ["Puppet", "Agent-based (Puppet Agent daemon)", "HTTPS / Custom PKI certificates", "Declarative Ruby-like DSL", "Resource abstraction layer (RAL) enforcement"],
          ["Chef", "Agent-based (Chef Client daemon)", "HTTPS pull from Chef Server", "Imperative / Declarative Ruby DSL", "Recipe state evaluation per resource"],
          ["SaltStack", "Agent-based (Salt Minion) & Agentless", "ZeroMQ message bus (ultra-fast)", "YAML / Jinja2 / Python", "State modules with execution functions"],
          ["Terraform (Comparison)", "Agentless cloud API driver", "HTTPS Cloud REST APIs", "Declarative HCL", "Target state reconciliation via state file"]
        ],
        n: "Ansible's architectural power derives from being **strictly agentless**: it requires no background daemons, open listening ports, or agent certificates on managed nodes. It requires only standard **OpenSSH** and a Python interpreter. You define tasks inside **Playbooks** structured in YAML. Crucially, Ansible modules are **Idempotent**: before executing an action (e.g., `apt: name=nginx state=present`), the module inspects the target machine. If NGINX is already installed at the desired version, Ansible reports `ok` (status unchanged) and takes no action; if missing, it installs the package and reports `changed`. Inventory can be static (INI/YAML) or dynamic (querying AWS EC2 or Kubernetes APIs in real-time). Secrets are encrypted using **Ansible Vault**."
      },

      miss: [
        {
          w: "Ansible is a replacement for Terraform and should be used to provision all cloud infrastructure.",
          r: "Terraform is fundamentally designed for **provisioning infrastructure** (VPCs, subnets, databases, VMs), tracking state in a state file. Ansible is designed for **configuring operating systems and software inside running servers**. The industry standard pairs them: Terraform provisions the VM, and Ansible configures the software."
        },
        {
          w: "All shell commands and bash scripts run inside Ansible playbooks are automatically idempotent.",
          r: "The `shell` and `command` modules are **NOT idempotent by default**; they execute raw shell commands on every run. To achieve idempotency with shell tasks, you must declare conditional guards like `creates: /path/to/file` or `when: condition`."
        },
        {
          w: "Ansible is too slow to manage fleets of thousands of servers because it uses SSH sequentially.",
          r: "Ansible executes tasks **concurrently across multiple hosts in parallel** using configurable worker forks (`forks = 50` in `ansible.cfg`) and SSH connection multiplexing (`ControlMaster`), allowing it to configure hundreds of nodes in parallel."
        },
        {
          w: "Ansible playbooks can only be used on Linux operating systems.",
          r: "Ansible has first-class native support for **Windows Server** (communicating over WinRM or OpenSSH via PowerShell modules), network switches (Cisco, Arista, Juniper), and cloud provider management APIs."
        }
      ],

      trade: {
        buys: [
          "Zero client-side agent maintenance: operates over standard OpenSSH with zero software to install or patch on target machines.",
          "Idempotent task execution: running playbooks multiple times safely converges target machines to the declared state.",
          "Extremely low barrier to entry: readable, human-friendly YAML playbooks eliminate the need to learn complex programming DSLs.",
          "Powerful multi-tier orchestration: execute sequential multi-node workflows (drain load balancer -> patch DB -> restart app -> verify)."
        ],
        costs: [
          "SSH connection latency: connecting and executing Python scripts over SSH is slower than persistent binary agent buses (ZeroMQ).",
          "Scaling bottleneck on controller: large playbooks running against thousands of nodes demand significant CPU and memory on the controller.",
          "Variable module quality: community Ansible modules vary widely in code quality, documentation, and idempotency guarantees.",
          "Target Python dependency: target Linux systems must have a functional Python runtime installed to execute Ansible modules."
        ],
        avoid: [
          "Never use the raw `command` or `shell` modules when a dedicated idempotent Ansible module (e.g., `apt`, `copy`, `user`) exists.",
          "Never commit unencrypted passwords, private keys, or API tokens in Ansible playbooks; encrypt with `ansible-vault`.",
          "Never maintain static hardcoded server IP inventories in cloud environments; use dynamic inventory plugins (e.g., `aws_ec2`).",
          "Never run Ansible against large fleets without enabling SSH `ControlMaster` pipelining to reduce connection overhead."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "configuration-management",

      why: {
        before: "System administrators manually logged into servers to edit config files, install packages, and tune kernels; servers diverged into unique 'Snowflakes' that nobody could replicate, and any server crash resulted in catastrophic prolonged downtime while engineers tried to remember how it was configured.",
        problem: "Organizations must maintain thousands of servers, containers, and services in a known, consistent, verifiable state across environments, eliminating manual configuration drift and ensuring instant disaster recovery.",
        shift: "**Configuration Management: The engineering practice of establishing and maintaining consistency of a product's performance, functional, and physical attributes with its requirements, design, and operational information throughout its life.** Enforced through versioned code, configuration management eliminates snowflake servers."
      },

      num: {
        t: "Configuration Management Paradigms: Comparative Operational Models",
        h: ["Paradigm", "Implementation Mechanism", "Configuration Mutability", "Drift Resistance", "Primary Production Domain"],
        r: [
          ["Mutable In-Place Configuration", "Ansible, Puppet, Chef updating running OS", "Mutable (files edited in-place on live disk)", "Low to Moderate (requires continuous re-runs)", "Long-lived bare-metal servers, enterprise legacy systems"],
          ["Immutable Image Baking", "HashiCorp Packer baking golden VM images", "Immutable (instances replaced, never modified)", "Absolute (drift cannot accumulate on running node)", "Auto-scaling groups, cloud virtual machines"],
          ["Container Environment Injection", "Kubernetes ConfigMaps & Secrets injected as env/volumes", "Immutable container, dynamic config injection", "High (containers restarted on config change)", "Cloud-native containerized microservices"],
          ["Dynamic Centralized Config", "HashiCorp Consul, Spring Cloud Config, etcd", "Dynamic runtime updates without restarts", "Moderate (requires app watch logic)", "Feature flags, runtime rate limits, dynamic routing rules"]
        ],
        n: "Configuration Management is governed by the **Twelve-Factor App (Factor 3: Config)**: 'Store config in the environment'. Application code must be strictly separated from configuration: the exact same binary or container image must be deployed to development, staging, and production, with behavior differing solely through injected configuration values. Managing configuration requires establishing clear boundaries: (1) **Static Infrastructure Configuration** (VPCs, firewall rules) managed by Terraform; (2) **Operating System Configuration** (systemd units, sysctl parameters) managed by Ansible or baked via Packer; and (3) **Application Runtime Configuration** (database URLs, log levels) injected via environment variables or secret managers. Separating configuration from code eliminates the need to recompile or rebuild artifacts when promoting across environments."
      },

      miss: [
        {
          w: "Hardcoding environment-specific configurations inside application source code is fine if wrapped in `if (env === 'production')`.",
          r: "Baking environment conditionals inside application code **violates Twelve-Factor App principles**. It couples code to specific deployment topologies, leaks production configuration details into dev builds, and requires a full code deployment to change a simple config value."
        },
        {
          w: "Configuration Management only applies to traditional Linux virtual machines, not modern Kubernetes containers.",
          r: "Kubernetes relies extensively on configuration management through **ConfigMaps, Secrets, and Admission Controllers**. Managing configuration drift across dozens of microservice manifests in Kubernetes is a primary DevOps discipline."
        },
        {
          w: "Environment variables are completely secure for storing sensitive production passwords and API keys.",
          r: "Environment variables can easily leak into crash logs, child processes, `/proc/<pid>/environ`, and application diagnostic dumps. **High-security environments inject secrets as in-memory temporary volume mounts (`tmpfs`)** or fetch secrets dynamically from Vault/KMS."
        },
        {
          w: "A configuration management tool eliminates the risk of human error during production updates.",
          r: "A misconfigured Ansible playbook or Puppet manifest executed against 1,000 servers simultaneously will **destroy 1,000 servers in parallel in 30 seconds**. Configuration management scripts require rigorous peer code review, linting, and canary staging validation."
        }
      ],

      trade: {
        buys: [
          "Elimination of snowflake servers: guarantees that all servers in a cluster share an identical, auditable configuration baseline.",
          "Rapid disaster recovery: recreate an entire server fleet from scratch in minutes using version-controlled configuration recipes.",
          "Environment parity: ensures staging and development environments match production configurations with high fidelity.",
          "Centralized security compliance: enforce OS security hardening (CIS benchmarks, SSH key rotations) across the entire fleet in one run."
        ],
        costs: [
          "Toolchain maintenance overhead: managing configuration management repositories, test suites, and runners requires dedicated ops effort.",
          "Blast radius amplification: bugs in configuration playbooks are applied across the entire fleet simultaneously.",
          "Drift reconciliation latency: in-place configuration tools require periodic scheduled runs to detect and repair drift.",
          "Secrets management complexity: encrypting and distributing production credentials safely across configurations requires dedicated tooling."
        ],
        avoid: [
          "Never edit configuration files manually on production servers via SSH; make changes in code and deploy through the pipeline.",
          "Never bake environment-specific configuration values or credentials into static container images or binaries.",
          "Never deploy configuration changes to an entire server fleet simultaneously; use canary batches.",
          "Never store unencrypted production secrets in plain-text configuration files or repositories."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "immutable-infrastructure",

      why: {
        before: "Servers were treated as 'Pets': individual machines were given affectionate names ('zeus', 'hermes'), patched and upgraded in-place over years; over time, undocumented configuration tweaks, conflicting libraries, and leftover temporary files accumulated into fragile snowflake systems that nobody dared reboot.",
        problem: "In-place server updates cause configuration drift, leave behind corrupt state, make rollbacks difficult, and prevent automated horizontal autoscaling.",
        shift: "**Immutable Infrastructure: An operational paradigm where servers, containers, and infrastructure components are never modified or patched in-place after deployment; if an update, bug fix, or configuration change is required, new instances are built from scratch, tested, deployed, and old instances are terminated.** Treating servers as 'Cattle, not Pets', immutable infrastructure guarantees absolute environment determinism."
      },

      num: {
        t: "Infrastructure Management Paradigms: Mutable (Pets) vs Immutable (Cattle)",
        h: ["Dimension", "Mutable Infrastructure ('Pets')", "Immutable Infrastructure ('Cattle')", "Deployment Mechanism", "Rollback Speed & Reliability"],
        r: [
          ["Server Identity & Lifecycle", "Long-lived, named servers patched continuously", "Short-lived, disposable, ephemeral instances", "In-place SSH patching (Ansible, bash scripts)", "Slow & risky (requires writing inverse rollback scripts)"],
          ["Configuration Drift Risk", "High (inevitable divergence over months/years)", "Zero (instances are replaced from clean image)", "Rolling instance replacement (ASG / Kubernetes)", "Instantaneous (re-route traffic to previous image version)"],
          ["Debugging Paradigm", "SSH into production server to poke around", "External telemetry, APM traces, centralized logs", "Blue-Green / Canary deployment traffic shift", "High confidence (identical tested image launched)"],
          ["Disaster Recovery", "Complex manual rebuild of snowflake state", "Trivial automated re-instantiation from image", "Cloud-init, AMI, OCI container image launch", "Automated self-healing replaces dead nodes seamlessly"]
        ],
        n: "The transition to Immutable Infrastructure is captured by the famous cloud computing analogy: **'Pets vs Cattle'**. In the traditional model, servers are *Pets*: when a pet gets sick, you nurse it back to health. In the immutable model, servers are *Cattle*: when an instance becomes unhealthy or needs an update, you terminate it and provision a fresh replacement. The workflow relies on **Image Baking**: tools like **HashiCorp Packer** build pre-configured machine images (AMIs, VM templates) containing the OS, dependencies, and application binary. When a release occurs, the cloud **Auto Scaling Group** or Kubernetes Deployment launches new instances running the new image, verifies health checks, shifts traffic via load balancers, and terminates the old instances. Because instances are disposable, **configuration drift is mathematically impossible**."
      },

      miss: [
        {
          w: "Immutable infrastructure means you can never update or patch your software.",
          r: "You update software **constantly and frequently**, but you do so by **building and deploying a fresh replacement image** rather than patching files on a live, running server."
        },
        {
          w: "Immutable infrastructure is only possible with Docker and Kubernetes.",
          r: "Immutable infrastructure predates modern containers. Cloud virtual machines (AWS EC2) implement immutable infrastructure using **pre-baked AMIs (Amazon Machine Images) managed by Auto Scaling Groups** and Terraform."
        },
        {
          w: "Engineers should SSH into immutable production servers to fix urgent production incidents.",
          r: "Logging into an immutable server to apply manual fixes **destroys immutability and creates drift**. Production instances should have SSH disabled; all diagnostics must be performed through centralized logs and distributed tracing, and fixes must be deployed through the CI/CD image pipeline."
        },
        {
          w: "Immutable infrastructure makes persistent stateful databases impossible to run.",
          r: "Immutable infrastructure cleanly decouples compute from storage: **stateless compute instances are immutable and disposable**, while persistent state lives in dedicated, decoupled managed storage (AWS EBS, RDS, S3, persistent volume claims)."
        }
      ],

      trade: {
        buys: [
          "Complete eradication of configuration drift: running instances are provably identical to the versioned source image.",
          "Trivial, bulletproof rollbacks: reverting a bad deployment simply means launching instances of the previous known-good image.",
          "Seamless horizontal auto-scaling: new instances boot in seconds from pre-baked images without executing slow installation scripts.",
          "High operational confidence: what was tested and validated in staging is bit-for-bit identical to what runs in production."
        ],
        costs: [
          "Image build pipeline overhead: every small code or patch update requires executing an image baking pipeline.",
          "Deployment image transfer latency: distributing new OS or container images across cloud clusters consumes network bandwidth.",
          "Strict logging and telemetry requirements: engineers cannot SSH to investigate bugs, demanding comprehensive external observability.",
          "Storage accumulation: maintaining catalogs of historical VM images (AMIs) and container layers incurs storage costs."
        ],
        avoid: [
          "Never install packages or patch software directly on live production virtual machines or containers.",
          "Never store persistent application data on local instance disks in an immutable architecture.",
          "Never leave SSH port 22 open to the public internet on immutable cloud instances.",
          "Never skip automated health checks when rolling out new immutable image instances."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "gitops",

      why: {
        before: "CI/CD pipelines pushed deployments to production clusters by storing broad, high-privilege cluster administrator credentials inside external CI servers (Jenkins, GitHub Actions); compromising the CI system granted attackers full root access to production Kubernetes clusters.",
        problem: "Modern cloud-native operations require an automated, declarative deployment model where the desired state of infrastructure is version-controlled in Git, and an in-cluster agent continuously pulls and reconciles state without exposing cluster credentials externally.",
        shift: "**GitOps: An operational framework that takes DevOps best practices used for application development (version control, collaboration, compliance, and CI/CD) and applies them to infrastructure automation, using Git as the single source of truth for declarative infrastructure and applications.** Powered by in-cluster reconcilers like Argo CD and Flux, GitOps enforces continuous automated drift correction."
      },

      num: {
        t: "Continuous Delivery Paradigms: Push-Based CI/CD vs Pull-Based GitOps",
        h: ["Dimension", "Push-Based CI/CD (GitHub Actions / Jenkins)", "Pull-Based GitOps (Argo CD / Flux v2)", "Security Credential Model", "Drift Detection & Auto-Healing"],
        r: [
          ["Deployment Trigger", "CI server executes `kubectl apply` or SSH script", "In-cluster agent detects Git commit diff and reconciles", "CI holds cluster-admin credentials (HIGH risk)", "None (drift remains undetected until next push)"],
          ["Direction of Control", "External push into cluster via open firewall port", "Internal pull from Git; zero inbound firewall holes", "Cluster pulls read-only from Git; zero external secrets", "Continuous automated self-healing overwrites drift"],
          ["Auditability & Compliance", "Scattered across CI job logs and build outputs", "Full commit history in Git with signed commits", "Single Git commit SHA defines entire cluster state", "Instant one-click rollback via `git revert`"],
          ["Multi-Cluster Scale", "CI must maintain credentials and pipelines for every cluster", "Each cluster runs its own lightweight pulling agent", "Isolated security blast radius per cluster", "Uniform declarative state across heterogeneous clusters"]
        ],
        n: "GitOps is defined by the **OpenGitOps Standard (CNCF)** through four fundamental principles: (1) **Declarative**: the entire desired system state must be expressed declaratively; (2) **Versioned and Immutable**: desired state is stored in Git, serving as an immutable, auditable log of all changes; (3) **Pulled Automatically**: software agents running *inside* the target environment pull the state automatically; and (4) **Continuously Reconciled**: software agents continuously observe actual system state and apply changes to eliminate drift. In **Argo CD** or **Flux**, if an engineer manually edits a deployment via `kubectl edit`, the GitOps reconciler immediately detects the discrepancy, triggers an alert, and **overwrites the manual change to restore the state declared in Git**."
      },

      miss: [
        {
          w: "GitOps is just another word for running `kubectl apply` from a GitHub Actions workflow.",
          r: "Pushing from GitHub Actions is **Push-based CI/CD, NOT GitOps**. GitOps requires an **in-cluster reconciliation agent (Argo CD / Flux)** that continuously pulls from Git and enforces bidirectional synchronization, preventing drift."
        },
        {
          w: "Application source code and Kubernetes GitOps manifests should always live in the same repository.",
          r: "Industry best practice **separates application source code from GitOps deployment manifests into separate repositories**. Combining them triggers infinite CI/CD build loops when automated tag updates commit back to the repo, and complicates RBAC permissions."
        },
        {
          w: "GitOps eliminates the need for Continuous Integration (CI) systems.",
          r: "GitOps manages **Continuous Delivery (CD)**. A robust CI system is still mandatory to compile code, run unit tests, scan for vulnerabilities, and build container images. The CI pipeline finishes by committing the new image tag to the GitOps repository."
        },
        {
          w: "GitOps is too slow to handle emergency production hotfixes.",
          r: "A GitOps deployment takes **seconds**: merging a hotfix pull request into the GitOps repo triggers an immediate webhook sync in Argo CD. Furthermore, GitOps guarantees that emergency fixes are fully audited in Git, preventing unrecorded rogue edits."
        }
      ],

      trade: {
        buys: [
          "Zero inbound cluster firewall holes: in-cluster agents pull state over outbound HTTPS, keeping cluster APIs private.",
          "Continuous automated drift correction: out-of-band manual changes are automatically detected and reverted to match Git.",
          "Complete regulatory audit compliance: every change to production infrastructure is documented as a signed, reviewed Git commit.",
          "Trivial, bulletproof disaster recovery: recreating an entire production cluster requires pointing Argo CD at the Git repository."
        ],
        costs: [
          "Git repository proliferation: managing separate repositories for application code and environment manifests adds operational overhead.",
          "Secret management complexity: secrets cannot be stored in plaintext Git, requiring tooling (Sealed Secrets, SOPS, External Secrets).",
          "Learning curve for developers: engineers must understand GitOps sync phases, PR promotion workflows, and Helm/Kustomize overlays.",
          "Sync loop contention: rapid-fire commits or misconfigured webhooks can cause reconciliation loop thrashing."
        ],
        avoid: [
          "Never store plaintext Kubernetes Secret manifests in GitOps repositories; use Sealed Secrets or External Secrets Operator.",
          "Never grant external CI/CD runners direct cluster-admin access when pull-based GitOps reconcilers can be deployed.",
          "Never execute manual `kubectl apply` commands on production clusters managed by a GitOps agent.",
          "Never mix application source code and deployment manifests in a single repository without path filtering to prevent recursive builds."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "configuration-drift",

      why: {
        before: "During production incidents, on-call engineers logged into cloud consoles or SSH'd into servers to apply urgent manual fixes (tweaking a firewall security group, upgrading a library, bumping RAM); these emergency tweaks were never documented or codified, causing live production to silently diverge from source code until disaster struck during the next deployment.",
        problem: "Undocumented, unmanaged divergence between actual live cloud infrastructure and declared code definitions causes catastrophic deployment failures, breaks disaster recovery replication, and creates severe security compliance vulnerabilities.",
        shift: "**Configuration Drift: The phenomenon where the actual operational state of infrastructure or systems silently diverges over time from the declared baseline state defined in Infrastructure as Code (IaC) or configuration repositories.** Detected via scheduled audits and resolved via GitOps and immutable infrastructure, drift eradication guarantees system reproducibility."
      },

      num: {
        t: "Configuration Drift Manifestations: Root Causes & Remediation Mechanics",
        h: ["Drift Trigger", "Operational Mechanism", "Outage & Security Risk", "Detection Mechanism", "Architectural Remediation"],
        r: [
          ["Console Click-Ops", "Engineer modifies security group or IAM role directly in AWS console", "Security boundary weakened; wiped on next `terraform apply`", "Terraform plan diff, AWS Config rules", "Revoke console write access; enforce IaC pipeline only"],
          ["In-Place Server Patching", "Engineer runs `apt-get upgrade` or edits `/etc/hosts` via SSH", "Snowflake server creation; breaks during autoscaling", "Ansible check mode (`--check`), Tripwire", "Adopt Immutable Infrastructure (replace, never patch)"],
          ["Unpinned Dependency Updates", "Build pulls floating dependencies (`FROM node:latest`, `pip install foo`)", "Different software versions deployed between staging and prod", "Dependency lockfile audits, Trivy scans", "Strictly pin lockfiles and container image digests"],
          ["Cloud Provider Auto-Patching", "Cloud provider modifies underlying hypervisor or managed DB engine", "Unexpected parameter deprecations, query plan regressions", "Automated synthetic regression tests", "Pin maintenance windows and disable automatic minor upgrades"],
          ["Rogue Local Environment Overrides", "Local testing scripts leave orphaned test databases or ports open", "Resource leaks, unexpected billing spikes, port conflicts", "Cloud custodian scripts, automated tag reaper jobs", "Automated ephemeral environment destruction on PR merge"]
        ],
        n: "Configuration drift represents the silent decay of infrastructure. In Infrastructure as Code, Terraform detects drift by executing a **Refresh** before planning: it queries cloud provider APIs, compares live attributes to the recorded state file, and flags discrepancies. If an engineer manually added an ingress rule in the AWS console, `terraform plan` flags an unexpected diff and proposes deleting the unauthorized rule to restore declared state. The modern gold standard for drift eradication is **GitOps with Automated Self-Healing**: in-cluster controllers (Argo CD) continuously poll cluster state every few seconds; if actual state diverges from the Git repository, the reconciler **automatically overwrites the live resource to match Git**, rendering manual 'Click-Ops' modifications impossible."
      },

      miss: [
        {
          w: "Configuration drift only happens in poorly managed companies that do not use Infrastructure as Code.",
          r: "Configuration drift happens in **every organization using cloud infrastructure**. Cloud providers modify default settings, automated patches run, cloud resources expire, and engineers make emergency console edits during midnight outages. **Detecting and reconciling drift must be an automated continuous process**."
        },
        {
          w: "Terraform automatically prevents developers from making manual changes in the AWS Console.",
          r: "Terraform only runs when invoked. It does not actively block console modifications while idle. To prevent manual drift, organizations must **enforce IAM Service Control Policies (SCPs) that revoke console write permissions**, forcing all changes through CI/CD pipelines."
        },
        {
          w: "Ignoring configuration drift is harmless as long as the application continues serving traffic.",
          r: "Drift is a **latent catastrophe**. If a database security group is edited manually to resolve an incident, the next scheduled Terraform run by an unrelated developer will **revert the manual fix and take down production again**, leaving the team baffled."
        },
        {
          w: "Detecting configuration drift should only be done manually right before a major production release.",
          r: "Drift detected 6 months after the fact turns into an impossible archaeology project where nobody remembers who made the change or why. **Drift detection should execute continuously or on automated daily schedules**."
        }
      ],

      trade: {
        buys: [
          "Guaranteed disaster recovery fidelity: ensures staging and disaster recovery environments can be rebuilt identically from code.",
          "Strict security compliance: detects and reverts unauthorized open firewall ports, permissive IAM roles, and public S3 buckets.",
          "Elimination of deployment surprises: prevents routine Terraform applies from accidentally wiping out uncodified production fixes.",
          "Single source of truth integrity: ensures Git and IaC repositories remain the authoritative, accurate blueprint of all infrastructure."
        ],
        costs: [
          "API rate limit pressure: continuous scheduled drift detection queries cloud APIs across thousands of resources, risking throttling.",
          "Emergency response friction: forces engineers to follow IaC pipelines during urgent incidents rather than making instant console tweaks.",
          "Alert noise management: benign drift (such as cloud provider auto-scaling counters) can trigger false-positive alerts.",
          "Remediation coordination: importing pre-existing manual resources into Terraform requires careful state file manipulation (`terraform import`)."
        ],
        avoid: [
          "Never permit engineers to make manual 'Click-Ops' changes in production cloud consoles without codifying the change immediately.",
          "Never run Terraform without inspecting whether proposed changes are legitimate plan updates or reversions of manual drift.",
          "Never leave out-of-band manual changes undocumented; if emergency console changes are made, immediately backport them to IaC.",
          "Never disable GitOps automated self-healing without an active incident investigation reason."
        ]
      }
    }

  ]);

})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
