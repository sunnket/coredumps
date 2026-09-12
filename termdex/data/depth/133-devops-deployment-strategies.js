/* ==========================================================================
   Depth pass 133 — DevOps & Cloud batch 4: Deployment Strategies & Operational Resilience.
   Blue-Green Deployment, Rolling Deployment, Rollback,
   Autoscaling, High Availability, Disaster Recovery, Environment.

   Zero-downtime traffic switching, incremental rolling updates, atomic rollback automation,
   elastic metric autoscaling, multi-AZ high-availability redundancy, RPO/RTO disaster recovery,
   and ephemeral environment promotion form the operational bedrock of production systems.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "blue-green-deployment",

      why: {
        before: "Deployments overwrote active application code live on production servers; during the 10-minute deployment window, servers served broken requests, threw 500 errors, and if the new release contained a fatal bug, the business suffered prolonged downtime while engineers scrambled to reinstall previous versions.",
        problem: "Production releases require a zero-downtime deployment strategy with near-instantaneous rollback capabilities, eliminating maintenance windows and isolating newly deployed code until full health verification is complete.",
        shift: "**Blue-Green Deployment: A release management strategy that utilizes two identical production environments (Blue and Green), where one serves live user traffic while the other receives the new software version.** By switching traffic at the load balancer or router level, cutovers and rollbacks execute in seconds."
      },

      num: {
        t: "Production Deployment Strategies: Comparative Architectural Trade-offs",
        h: ["Strategy", "Zero Downtime?", "Rollback Latency", "Compute Cost Multiplier", "Database Compatibility Requirement"],
        r: [
          ["Recreate / In-Place", "No (downtime during replacement)", "Slow (requires re-deployment)", "$1\\times$ (no extra capacity)", "Single version compatibility"],
          ["Rolling Deployment", "Yes (gradual instance replacement)", "Moderate (sequential reverse rollout)", "$1.2\\times$ (temporary surge pods)", "Dual-version compatibility (N and N+1 concurrently)"],
          ["Blue-Green Deployment", "Yes (instantaneous router traffic switch)", "Near-instant (<5 seconds router flip)", "$2\\times$ (full duplicate environment)", "Dual-version compatibility during cutover"],
          ["Canary Deployment", "Yes (gradual percentage traffic shift)", "Fast (shift traffic back to baseline)", "$1.1\\times$ - $1.2\\times$ (small canary pool)", "Dual-version compatibility across entire rollout"],
          ["Shadow / Dark Launch", "Yes (traffic mirrored; responses discarded)", "Instant (disable traffic mirroring)", "$2\\times$ (duplicate backend processing)", "Read-only compatibility (avoids duplicate writes)"]
        ],
        n: "In a Blue-Green architecture, **Blue** represents the active environment serving 100% of production traffic, while **Green** is the idle environment. When deploying version 2.0, Green is provisioned and deployed. Automated synthetic smoke tests run against Green without affecting live users. Once verified, the Layer 7 router, CDN, or load balancer flips traffic from Blue to Green. The critical operational requirement is **Database Backward Compatibility**: because both Blue and Green share the same underlying database, database schema changes must be deployed using the **Expand-and-Contract (Parallel Run) Pattern** (e.g., adding a new column as nullable, backfilling, and only dropping the old column in a subsequent release)."
      },

      miss: [
        {
          w: "Blue-Green deployment allows you to run destructive database migrations (like dropping a column) before switching traffic.",
          r: "If you drop a column on the shared database while Blue is still active, **Blue crashes instantly before traffic can be switched**. Database schema changes must be strictly backward compatible with BOTH Blue and Green versions simultaneously."
        },
        {
          w: "Blue-Green deployment requires purchasing twice as many physical bare-metal servers permanently.",
          r: "In cloud and container environments (AWS, Kubernetes), Green infrastructure is provisioned **ephemerally on demand**. Once Green is verified and takes live traffic, Blue is kept on standby for 1-2 hours for safe rollback, and then terminated to eliminate double compute costs."
        },
        {
          w: "Switching DNS records (A/CNAME records) is the best way to execute a Blue-Green cutover.",
          r: "DNS switching is **slow and unpredictable due to client-side DNS caching and ISP TTL overrides**. Blue-Green cutovers must occur at the **Layer 7 Load Balancer, Ingress Controller, or CDN Edge**, where traffic shifts take effect in milliseconds."
        },
        {
          w: "Blue-Green deployment completely eliminates the need for Canary testing.",
          r: "Blue-Green flips 100% of user traffic in a single instant. If a latent bug only surfaces under massive concurrency or with specific user data, **all users hit the bug simultaneously**. High-scale systems combine Blue-Green with Canary percentage traffic shifting."
        }
      ],

      trade: {
        buys: [
          "Near-instantaneous zero-downtime rollback: switching the router back to Blue restores service in under 5 seconds.",
          "Thorough pre-release validation: execute full end-to-end synthetic testing on Green in a real production environment before any user touches it.",
          "Zero client disruption: users experience no connection drops, server restarts, or mixed-version assets during release.",
          "Predictable release cadence: eliminates late-night maintenance windows, enabling routine daylight releases."
        ],
        costs: [
          "Temporary double infrastructure compute cost: running duplicate Blue and Green environments during cutover increases cloud spending.",
          "Database migration complexity: requires strict expand-and-contract migrations to support dual-version concurrency.",
          "Stateful connection termination: active WebSockets and long-running HTTP connections on Blue must be drained cleanly.",
          "Cloud provider resource quota pressure: spinning up duplicate environments can hit regional cloud vCPU or IP address quotas."
        ],
        avoid: [
          "Never execute destructive, breaking database schema migrations during a Blue-Green deployment.",
          "Never rely on public DNS TTL records to execute a Blue-Green cutover; use load balancers or edge reverse proxies.",
          "Never terminate the old Blue environment immediately after cutover; keep it warm for at least 1-2 hours for instant rollback.",
          "Never perform Blue-Green deployments without validating active WebSocket and background job draining."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "rolling-deployment",

      why: {
        before: "Deploying applications required taking down all running server instances simultaneously (Recreate strategy), causing 5 to 15 minutes of user-facing downtime on every release; alternatively, Blue-Green deployments required spinning up 100% duplicate infrastructure, exceeding cloud compute quotas and budgets.",
        problem: "Large containerized clusters need a resource-efficient release strategy that updates instances incrementally in small batches, ensuring continuous service availability without requiring a full duplicate environment.",
        shift: "**Rolling Deployment: A release strategy that gradually updates an application across a cluster by replacing old instances with new instances a few at a time, keeping the overall service available throughout the rollout.** Serving as the default deployment strategy in Kubernetes, rolling updates balance resource efficiency and availability."
      },

      num: {
        t: "Kubernetes RollingUpdate Strategy Parameters: Concurrency & Availability Tuning",
        h: ["Parameter Configuration", "Surge Capacity Required", "Minimum Available Pods During Update", "Rollout Velocity", "Primary Failure Guarantee"],
        r: [
          ["`maxSurge: 25%`, `maxUnavailable: 25%`", "Up to 125% cluster capacity", "Maintains at least 75% capacity", "Balanced (replaces in 25% batches)", "Default Kubernetes production setting"],
          ["`maxSurge: 0`, `maxUnavailable: 1`", "Zero extra capacity ($1\\times$ compute)", "Guarantees N-1 capacity", "Slow (updates 1 pod at a time)", "Zero extra cloud spend; fixed hardware limits"],
          ["`maxSurge: 100%`, `maxUnavailable: 0`", "Requires $2\\times$ surge capacity", "Guarantees 100% capacity", "Fast (creates all new pods before killing old)", "Maximum availability; zero throughput drop"],
          ["`maxSurge: 10%`, `maxUnavailable: 0`", "Minimal surge capacity", "Guarantees 100% capacity", "Slow & safe (rolls 10% at a time)", "High-traffic tier-1 services with zero downtime tolerance"]
        ],
        n: "In a Kubernetes **RollingUpdate**, the Deployment controller creates a new ReplicaSet alongside the existing ReplicaSet. The update is governed by two parameters: **`maxSurge`** (how many additional pods can be created above the desired replica count) and **`maxUnavailable`** (how many pods can be taken down during the update). The controller creates a batch of new pods and waits for their **Readiness Probes** to succeed before directing traffic to them and terminating a corresponding batch of old pods. A critical architectural reality of rolling deployments is that **Version N and Version N+1 run concurrently and process live user traffic simultaneously** for the duration of the rollout, mandating that API contracts, session cookies, and database schemas remain fully compatible across both versions."
      },

      miss: [
        {
          w: "A rolling deployment guarantees that all running instances are on the same version at all times.",
          r: "During a rolling deployment, **both the old version and the new version serve live traffic simultaneously**. A user request at 10:01am may hit v1, and their next click at 10:02am may hit v2. All API payloads, session tokens, and database schemas must be backward and forward compatible."
        },
        {
          w: "Rolling deployments work reliably without configuring Kubernetes readiness probes.",
          r: "Without a readiness probe, Kubernetes considers a container ready **the millisecond its process boots**. Traffic is immediately routed to the new pod before it finishes initializing, resulting in hundreds of connection refused and 502 Bad Gateway errors."
        },
        {
          w: "Rolling back a failed rolling deployment is as fast as rolling back a Blue-Green deployment.",
          r: "Rolling back a rolling deployment requires executing **another rolling deployment in reverse**, which can take several minutes to spin up, verify, and replace pods. Blue-Green rollbacks, by contrast, take under 5 seconds via router traffic flipping."
        },
        {
          w: "Rolling deployments are completely safe for stateful clustered databases.",
          r: "Rolling updates are designed for **stateless services**. Applying a rolling update to a stateful database cluster (Cassandra, Elasticsearch, Kafka) can trigger data rebalancing storms, quorum loss, or split-brain partitions unless managed by specialized operators."
        }
      ],

      trade: {
        buys: [
          "High compute resource efficiency: requires only a small fraction of surge capacity (e.g., 25%) rather than a 100% duplicate environment.",
          "Zero user downtime: service remains available throughout the rollout with no interruption in traffic handling.",
          "Automated health-gated progression: readiness probes verify that new pods are healthy before subsequent batches are replaced.",
          "Default orchestration standard: built natively into Kubernetes Deployments with zero third-party tooling required."
        ],
        costs: [
          "Mixed-version concurrency window: old and new code versions run concurrently, complicating session state and API contracts.",
          "Slower rollback duration: reverting requires sequentially replacing pods in reverse, extending incident recovery times.",
          "Longer deployment duration: rolling updates through large fleets of 500+ pods can take 15 to 30 minutes.",
          "Readiness probe sensitivity: an overly aggressive readiness probe can halt the rollout midway in a partially deployed state."
        ],
        avoid: [
          "Never execute rolling deployments without properly tuned `readinessProbe` configurations on all containers.",
          "Never introduce breaking API changes between the previous version and the new version during a rolling update.",
          "Never set `maxUnavailable: 100%` in production; it converts the rolling update into a downtime-inducing Recreate deployment.",
          "Never omit `terminationGracePeriodSeconds` handling; pods must handle `SIGTERM` to drain in-flight connections."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "rollback",

      why: {
        before: "When a bad deployment caused a production outage, engineers panicked and attempted to 'fix forward'—diagnosing the bug, writing a patch, opening a PR, waiting for CI to build, and redeploying; a simple regression that could have been reverted in 60 seconds turned into a 3-hour multi-million-dollar outage.",
        problem: "When a production incident occurs post-deployment, the primary imperative is immediate restoration of customer service, requiring a rehearsed, single-command automated mechanism to revert to the previous known-good version.",
        shift: "**Rollback: The operational procedure of reverting a deployed software version, database migration, or configuration change back to the previous stable, known-good state to restore service during an incident.** Prioritizing 'mitigate first, diagnose later', rollbacks form the ultimate safety net of continuous delivery."
      },

      num: {
        t: "Rollback Mechanisms: Recovery Speed & Operational Trade-offs",
        h: ["Rollback Mechanism", "Mean Time to Rollback (MTTR)", "Data Mutation Risk", "Automated Health Trigger?", "Operational Complexity"],
        r: [
          ["Blue-Green Router Switch", "<5 seconds (traffic flip)", "Zero (previous environment already warm)", "Yes (automated health check flip)", "Low (router/load balancer traffic shift)"],
          ["Kubernetes `rollout undo`", "1 - 3 minutes (reverse rolling update)", "Low (redeploys previous ReplicaSet)", "Yes (via Flagger / Argo Rollouts)", "Low (single CLI command or GitOps revert)"],
          ["GitOps `git revert`", "2 - 5 minutes (commit -> reconciler sync)", "Low (full audit trail of revert)", "Yes (via automated canary analysis)", "Low (standard Git workflow)"],
          ["Database Down Migration", "5 - 30 minutes", "Extreme (risk of data corruption/loss)", "No (manual DBA intervention required)", "High (requires explicit backward migration scripts)"],
          ["Feature Flag Kill Switch", "<1 second (instant in-memory flip)", "Zero (code stays deployed, feature disabled)", "Yes (automated APM metric trigger)", "Minimal (dashboard toggle or API call)"]
        ],
        n: "The golden rule of high-reliability operations is: **Restore service first; diagnose the root cause afterward**. When a production deployment triggers error rate spikes or latency breaches, on-call engineers must immediately trigger a rollback rather than debugging live code. However, the fundamental barrier to trivial rollbacks is **Destructive Database Mutations**. If a deployment executes a migration that renames or drops a database column, rolling back the application code will immediately crash because the old code expects the deleted column. Achieving trivial rollbacks mandates the **Expand-and-Contract Pattern**: (1) Expand: add new column as nullable; (2) Deploy code writing to both old and new columns; (3) Backfill historical data; (4) Deploy code reading only from new column; and (5) Contract: drop old column in a separate release."
      },

      miss: [
        {
          w: "Fixing forward during a major production incident is better than rolling back because you solve the problem permanently.",
          r: "'Fixing forward' under the high-stress pressure of an active production incident leads to rushed, unreviewed code edits that frequently **introduce secondary, more catastrophic bugs**. Restoring service immediately via rollback buys the team calm, uninterrupted time to investigate."
        },
        {
          w: "Executing `git revert` on the source code branch immediately fixes the production cluster.",
          r: "`git revert` only updates the Git repository. The revert commit must still be **built, tested, packaged into an artifact, and deployed through the CI/CD pipeline**, which can take 10-20 minutes. Production systems should roll back directly to the **pre-built previous artifact digest**."
        },
        {
          w: "Database migrations can always be rolled back using automated down migration scripts (`down.sql`).",
          r: "Down migrations that drop newly created columns or revert modified data types **permanently destroy customer data** written while the new version was active. Database rollbacks are notoriously high-risk and must be avoided through non-breaking additive schema designs."
        },
        {
          w: "A rollback plan is something you can improvise during an outage when needed.",
          r: "An untested rollback plan is a guaranteed failure. Rollbacks must be **practiced, automated, and tested regularly during staging deployments and chaos drills** to ensure deployment permissions, images, and tools function under pressure."
        }
      ],

      trade: {
        buys: [
          "Radically minimized Mean Time to Restore (MTTR): restores customer service in minutes rather than hours during incidents.",
          "Low-stress incident mitigation: allows on-call engineers to restore availability without debugging complex distributed stack traces under pressure.",
          "High deployment psychological safety: developers deploy frequently knowing that mistakes can be undone immediately without penalty.",
          "Audit compliance and traceability: GitOps rollbacks preserve an explicit, immutable audit trail of what was reverted and when."
        ],
        costs: [
          "Artifact retention overhead: requires keeping previous immutable container images and Helm revisions ready in registries.",
          "Database migration constraints: strictly forbids destructive schema migrations, requiring multi-phase expand-and-contract releases.",
          "State synchronization challenges: in-flight asynchronous messages and background jobs created by the bad version must be reconciled.",
          "False sense of security: relying on rollbacks can lead to lax pre-production testing and canary verification."
        ],
        avoid: [
          "Never attempt to 'fix forward' during a critical tier-1 production outage when a clean rollback path is available.",
          "Never run destructive database migrations in the same release step as application code updates.",
          "Never delete or overwrite the previous container image artifact in the registry during a deployment.",
          "Never leave rollback procedures undocumented or untested; automate rollbacks via canary analysis wherever possible."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "autoscaling",

      why: {
        before: "Infrastructure was provisioned for theoretical peak holiday traffic 24/7; servers operated at 8% average CPU utilization during off-peak hours, wasting millions of dollars in idle cloud compute, while unexpected viral traffic spikes overwhelmed capacity and took down systems.",
        problem: "Cloud-native backends need elastic, autonomous compute scaling that dynamically provisions additional instances during traffic surges to preserve response SLAs, and scales down during lulls to eliminate wasted infrastructure spending.",
        shift: "**Autoscaling: The automated capability of cloud infrastructure to dynamically adjust the number of active compute instances, containers, or hardware resources up or down in response to real-time workload demands.** Operating via metric thresholds and predictive algorithms, autoscaling delivers cloud elasticity."
      },

      num: {
        t: "Autoscaling Mechanisms: Operational Architecture & Latency Comparison",
        h: ["Autoscaling Mechanism", "Scaling Target", "Trigger Metric", "Scaling Latency", "Primary Production Workload"],
        r: [
          ["Horizontal Pod Autoscaler (HPA)", "Kubernetes Pod replica count", "CPU, Memory, custom Prometheus metrics", "30 - 60 seconds", "Stateless HTTP APIs, web microservices"],
          ["Kubernetes Karpenter / Cluster Autoscaler", "Kubernetes Worker Nodes (EC2 / VMs)", "Unscheduled Pending Pods", "45 - 90 seconds", "Dynamic cluster node provisioning on demand"],
          ["Vertical Pod Autoscaler (VPA)", "CPU/Memory resource requests/limits", "Historical utilization profiles", "Requires pod restart (unless in-place)", "Batch jobs, memory-intensive single-instance workloads"],
          ["Cloud Auto Scaling Groups (ASG)", "Cloud Virtual Machines (EC2)", "CloudWatch CPU, network, ALB request count", "2 - 5 minutes", "Legacy VM fleets, monolithic background workers"],
          ["Queue-Based Autoscaling (KEDA)", "Kubernetes Pods driven by queue depth", "SQS depth, Kafka consumer lag, RabbitMQ", "10 - 30 seconds", "Asynchronous background workers, event-driven streaming"]
        ],
        n: "Autoscaling operates across two coordinated dimensions: **Horizontal Scaling (adding/removing instances)** and **Cluster Infrastructure Scaling (adding/removing physical/virtual nodes)**. In Kubernetes, the **Horizontal Pod Autoscaler (HPA)** executes a control loop every 15 seconds, computing desired replicas using the formula: $\\text{desiredReplicas} = \\lceil \\text{currentReplicas} \\cdot (\\frac{\\text{currentMetricValue}}{\\text{targetMetricValue}}) \\rceil$. Tuning autoscaling requires two mandatory rules: (1) **Scale on Meaningful Bottleneck Metrics**: scaling on CPU is often flawed for I/O-bound web services; scaling on **Request Concurrency, HTTP Latency, or Queue Depth (via KEDA)** provides far more accurate responsiveness; and (2) **Asymmetric Cooldowns**: scale out rapidly (within 30 seconds) to catch incoming traffic surges, but scale down slowly (with 5-minute cooldown stabilization windows) to prevent **Autoscaling Flapping (Thrashing)**."
      },

      miss: [
        {
          w: "Autoscaling can scale instances up from zero to 1,000 in less than one second.",
          r: "Autoscaling takes time: metrics must be scraped (15-30s), the autoscaler computes the diff (15s), cloud virtual machines must be provisioned (45-90s), container images pulled (10-30s), and applications booted. **Rapid 100x traffic spikes require pre-warming capacity**."
        },
        {
          w: "CPU utilization is the only metric you need to configure for autoscaling web services.",
          r: "Web applications waiting on external databases or third-party APIs spend CPU waiting on I/O. CPU utilization may stay at 20% while request queues back up and response latencies explode. **Web APIs should autoscale on active request concurrency or P99 latency**."
        },
        {
          w: "Setting a minimum replica count of 1 is best to save maximum cloud compute costs.",
          r: "A minimum of 1 replica provides **zero high availability**. If that single node crashes, the service goes down completely while a replacement boots. Production stateless services should enforce a **minimum replica count of at least 2 or 3 across multiple Availability Zones**."
        },
        {
          w: "Autoscaling compute instances eliminates all performance bottlenecks in a system.",
          r: "Scaling application instances adds more client connections to downstream relational databases. A burst from 10 to 200 web pods will **instantly exhaust PostgreSQL connection pools and lock table buffers**, crashing the database."
        }
      ],

      trade: {
        buys: [
          "Massive cloud cost optimization: automatically scale down compute capacity during nights and weekends, cutting monthly bills by 40-70%.",
          "Automated traffic surge absorption: smoothly scales from tens to hundreds of instances during marketing promotions or viral spikes.",
          "Self-healing capacity maintenance: automatically provisions replacement instances when underlying cloud hardware fails.",
          "Hands-free operational capacity management: eliminates manual capacity estimation and emergency manual server provisioning."
        ],
        costs: [
          "Autoscaling latency lag: instance provisioning latency means sudden, sharp traffic spikes can experience transient elevated latency.",
          "Downstream database saturation risk: unbounded compute autoscaling can overwhelm fixed downstream databases and third-party APIs.",
          "Flapping and thrashing instability: misconfigured cooldown thresholds cause continuous cycling between scaling up and scaling down.",
          "Complex telemetry infrastructure: requires deploying and maintaining metric servers (Prometheus Adapter, KEDA) and tuning thresholds."
        ],
        avoid: [
          "Never configure autoscaling without establishing a strict maximum replica limit (`maxReplicas`) to prevent runaway billing spikes.",
          "Never scale in (down) as aggressively as you scale out; enforce stabilization windows (cooldowns) to avoid thrashing.",
          "Never set a minimum replica count of 1 for customer-facing production services; enforce a multi-AZ minimum baseline.",
          "Never autoscale application tiers without connection poolers (PgBouncer) protecting downstream relational databases."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "high-availability",

      why: {
        before: "Applications were hosted on single physical servers in single on-premise datacenters; when a power supply failed, a fiber cable was severed, or a server crashed, the entire business went offline for hours or days.",
        problem: "Modern global digital platforms require continuous, uninterrupted availability where the failure of individual servers, network switches, or entire physical datacenters is absorbed seamlessly without impacting end users.",
        shift: "**High Availability (HA): An architectural characteristic of a system aimed at ensuring an agreed level of operational performance, usually uptime, for a higher than normal period.** Achieved by eliminating Single Points of Failure (SPOFs) and deploying redundant, self-healing components across independent failure domains."
      },

      num: {
        t: "High Availability Tiers: 'The Nines' & Permitted Downtime Budgets",
        h: ["Availability Tier", "Annual Downtime Allowed", "Monthly Downtime Allowed", "Redundancy Architecture Required", "Relative Cost Multiplier"],
        r: [
          ["99.0% (Two Nines)", "3 days, 15 hours, 39 min", "7 hours, 18 min", "Single-instance with automated reboot/backup", "$1\\times$ (baseline cost)"],
          ["99.9% (Three Nines)", "8 hours, 45 minutes", "43 minutes, 49 seconds", "Multi-instance behind load balancer; Multi-AZ DB", "$2\\times$ - $3\\times$ (production baseline)"],
          ["99.99% (Four Nines)", "52 minutes, 35 seconds", "4 minutes, 23 seconds", "Multi-AZ active-active; automated sub-minute failover", "$5\\times$ - $10\\times$ (enterprise SaaS tier)"],
          ["99.999% (Five Nines)", "5 minutes, 15 seconds", "26 seconds", "Multi-Region active-active; zero planned downtime", "$20\\times$ - $50\\times$ (telecom, tier-1 finance)"]
        ],
        n: "Achieving High Availability requires systematically eliminating **Single Points of Failure (SPOFs)** across every layer of the architecture: (1) **DNS Layer**: multi-provider Anycast routing; (2) **Edge Layer**: global CDN with multi-POP termination; (3) **Ingress Layer**: Layer 4/7 load balancers spanning multiple Availability Zones; (4) **Compute Tier**: stateless microservice pods distributed across at least 3 Availability Zones using Kubernetes **Pod Anti-Affinity** (`topologyKey: topology.kubernetes.io/zone`); and (5) **Data Tier**: relational databases running with an active primary in AZ-a and synchronous/semi-synchronous standby replicas in AZ-b and AZ-c with automated failover. Crucially, **availability targets follow an exponential cost curve**: each additional 'nine' requires an order-of-magnitude increase in architectural complexity and infrastructure spending."
      },

      miss: [
        {
          w: "High Availability can be achieved simply by running two identical containers on the same physical server.",
          r: "If both containers run on the same physical machine or hypervisor, a single hardware crash, motherboard failure, or kernel panic takes down both instances simultaneously. **High Availability requires spreading instances across independent failure domains (Availability Zones)**."
        },
        {
          w: "Every modern software application should aim for 99.999% ('Five Nines') availability.",
          r: "Five Nines permits **only 5 minutes of total downtime per YEAR**, including all deployments and unexpected outages. Achieving this requires multi-region active-active databases, automated chaos engineering, and massive engineering budgets. Most commercial SaaS applications thrive on **99.9% or 99.95%**."
        },
        {
          w: "Automated database failover works flawlessly without regular testing.",
          r: "Database failover is the **most fragile operational event in distributed systems**. DNS record propagation lag, split-brain scenarios, and stale replica promotions frequently fail during real incidents unless failover drills are executed regularly."
        },
        {
          w: "Deploying an application across multiple cloud regions is required to achieve high availability.",
          r: "Deploying across multiple **Availability Zones (isolated datacenters within a single region)** provides 99.99% availability with single-digit millisecond latency. Multi-region deployments introduce cross-continent latency, distributed consensus hurdles, and massive cost."
        }
      ],

      trade: {
        buys: [
          "Continuous business operation: individual server crashes, network switch failures, and zone blackouts cause zero user downtime.",
          "Contractual SLA compliance: meets enterprise customer SLA agreements, avoiding financial penalties and reputational damage.",
          "Seamless daylight deployments: zero-downtime rolling and blue-green updates eliminate late-night weekend maintenance windows.",
          "Customer trust and retention: high uptime establishes brand reliability, protecting recurring subscription revenue."
        ],
        costs: [
          "Exponential infrastructure cost curve: multi-AZ redundancy and standby databases multiply cloud infrastructure spending.",
          "Architectural complexity: requires managing load balancing, distributed locks, database replication, and circuit breakers.",
          "Cross-zone data transfer costs: cloud providers charge fees for network traffic transferred between different Availability Zones.",
          "Testing and chaos engineering tax: maintaining HA requires continuous chaos engineering drills and automated failover validation."
        ],
        avoid: [
          "Never run production applications or databases within a single Availability Zone or single physical server.",
          "Never design systems where a single shared resource (such as a single Redis cache or Bastion host) acts as an un-replicated SPOF.",
          "Never assume automated failover works without conducting regular, scheduled failover testing.",
          "Never promise contractual five-nines (99.999%) availability to customers without multi-region active-active architectures."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "disaster-recovery",

      why: {
        before: "Organizations assumed cloud datacenters were infallible; when a major hurricane, catastrophic power outage, or malicious ransomware attack destroyed a cloud region or corrupted primary databases, companies lost all historical records and went out of business.",
        problem: "Organizations require a proven, documented, and regularly rehearsed strategy to recover mission-critical data, applications, and business operations following catastrophic infrastructure failure or localized destruction.",
        shift: "**Disaster Recovery (DR): The policies, tools, and procedures enabling the recovery or continuation of vital technology infrastructure and systems following a natural or human-induced disaster.** Governed by RPO and RTO metrics, DR strategies range from simple cold backups to multi-region active-active failover."
      },

      num: {
        t: "Disaster Recovery Strategies: Recovery Metrics & Cost Progression",
        h: ["DR Strategy", "Recovery Point Objective (RPO)", "Recovery Time Objective (RTO)", "Infrastructure Cost", "Failover Automation & Complexity"],
        r: [
          ["Backup & Restore", "Hours to Days (time of last backup)", "Hours to Days (reprovision and restore)", "Minimal ($) (object storage costs only)", "Manual (recreate infrastructure via IaC, restore snapshots)"],
          ["Pilot Light", "Minutes (continuous DB replication)", "Hours (scale up minimal compute footprint)", "Low ($$) (idle standby DB + minimal core infra)", "Semi-Automated (trigger autoscaling of compute fleet)"],
          ["Warm Standby", "Seconds to Minutes (real-time replication)", "Minutes (10-30 min to switch traffic)", "Moderate ($$$) (scaled-down running replica in DR region)", "Automated / 1-Click (scale up standby and switch DNS/CDN)"],
          ["Multi-Region Active-Active", "Near-Zero (sub-second cross-region replication)", "Near-Zero (<1 minute automated routing)", "Maximum ($$$$$) (full duplicate active infrastructure)", "Fully Automated (global Anycast traffic shifting)"]
        ],
        n: "Every Disaster Recovery plan is dictated by two foundational metrics: (1) **RPO (Recovery Point Objective)**: the maximum acceptable age of files or data that must be recovered from backup storage for normal operations to resume (i.e., *'how much data can the business afford to lose in time?'*); and (2) **RTO (Recovery Time Objective)**: the maximum acceptable duration of time that can elapse between disaster declaration and service restoration (i.e., *'how long can the business afford to be offline?'*). The cardinal rule of DR is: **A backup nobody has tested restoring is merely a hypothesis, not a backup**. Cloud storage snapshots must be verified with automated restore drills into isolated sandboxes, and immutable **Object Lock (WORM - Write Once, Read Many)** must protect backups against ransomware."
      },

      miss: [
        {
          w: "High Availability and Disaster Recovery are the exact same thing.",
          r: "**High Availability (HA)** protects against *localized component failures* (a crashed server or a single dead AZ) within a region. **Disaster Recovery (DR)** protects against *catastrophic events* (total loss of an entire geographic cloud region, ransomware, or regional network severed)."
        },
        {
          w: "Having automated daily cloud database backups means your Disaster Recovery plan is complete.",
          r: "Backups are only 10% of the plan. When disaster strikes, you must also recreate VPCs, subnets, firewall rules, routing tables, DNS records, Kubernetes clusters, and SSL certificates. **Complete DR requires automated Infrastructure as Code (Terraform) to rebuild everything**."
        },
        {
          w: "Replicating data asynchronously to a disaster recovery region guarantees zero data loss.",
          r: "Asynchronous cross-region replication has **replication lag** (typically hundreds of milliseconds to several seconds). In a sudden regional blackout, any data in-flight that was not yet committed in the secondary region is **lost (RPO > 0)**."
        },
        {
          w: "Writing a comprehensive Disaster Recovery document satisfies organizational DR requirements.",
          r: "Un-rehearsed DR documentation fails 100% of the time during real emergencies. Teams discover that credentials expired, scripts have syntax errors, or recovery images were deleted. **DR plans must be validated with scheduled live failover drills**."
        }
      ],

      trade: {
        buys: [
          "Existential business survival: protects the company from catastrophic total data loss following natural disasters or ransomware attacks.",
          "Regulatory compliance: satisfies strict legal mandates (SOC 2, HIPAA, PCI-DSS, ISO 27001) requiring proven business continuity plans.",
          "Predictable incident recovery: clearly defined RPO and RTO targets provide engineering teams with explicit recovery benchmarks.",
          "Ransomware defense: immutable object lock backups prevent attackers from encrypting or wiping enterprise recovery snapshots."
        ],
        costs: [
          "Secondary infrastructure expenses: maintaining cross-region replication and standby compute multiplies cloud infrastructure bills.",
          "Cross-region data transfer bandwidth: replicating database writes and storage objects across regions incurs continuous cloud egress fees.",
          "Engineering operational drills: executing realistic disaster recovery fire drills consumes significant engineering sprint capacity.",
          "Data consistency trade-offs: cross-region replication requires navigating distributed consensus and latency trade-offs."
        ],
        avoid: [
          "Never assume backups are valid without regularly performing end-to-end restoration drills into test environments.",
          "Never store disaster recovery backups in the same cloud account or region as primary production systems.",
          "Never allow backup snapshots to be deleted without MFA Delete and immutable Object Lock (WORM) protections.",
          "Never define DR plans without explicit, business-approved RPO and RTO numerical targets."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "environment",

      why: {
        before: "Developers tested code solely on their local laptops and pushed directly to production; undocumented local system dependencies, different database versions, and unvalidated environment variables caused code that worked locally to fail instantly in production.",
        problem: "Software teams need an isolated, structured sequence of deployment targets (Development, Staging, Production) that mirror real-world topologies, enabling thorough testing, security validation, and stakeholder review before reaching live customers.",
        shift: "**Environment: An isolated, bounded deployment target and runtime infrastructure configuration (such as Local, Staging, or Production) designed to execute and validate software at specific stages of the delivery lifecycle.** Enforcing parity across environments via Twelve-Factor principles, environments ensure safe software promotion."
      },

      num: {
        t: "Software Delivery Environments: Operational Hierarchy & Access Controls",
        h: ["Environment Tier", "Target Audience", "Data Sanitization & Fidelity", "Infrastructure Parity with Prod", "Access Control & Mutation Policy"],
        r: [
          ["Local Development", "Individual software engineer", "Mocked data / synthetic local seeds", "Low (Docker Compose / Minikube on laptop)", "Full developer root access; rapidly mutated"],
          ["Ephemeral PR Preview", "Code reviewers, QA, product managers", "Synthetic seed data / sanitized fixtures", "Moderate (isolated Kubernetes namespace per PR)", "Automated CI/CD deployment; destroyed on merge"],
          ["Shared Staging / UAT", "Cross-team integration, QA testers, E2E suites", "Anonymized, sanitized production-scale snapshot", "High (identical cloud architecture & sizing)", "Automated CI/CD deployment only; no manual edits"],
          ["Production", "Live real-world customers & users", "Authoritative live production customer data", "100% (The baseline standard)", "Strict zero-trust RBAC; changes via GitOps / CI only"],
          ["Disaster Recovery Sandbox", "SREs, automated DR drill harnesses", "Sanitized replica or isolated backup restore", "100% (Mirrors production in alternate region)", "Isolated emergency credentials only"]
        ],
        n: "Environment management is governed by the **Twelve-Factor App (Factor 10: Dev/Prod Parity)**: 'Keep development, staging, and production as similar as possible'. Discrepancies between environments (e.g., using SQLite in development and PostgreSQL in production, or running different versions of Redis) are the leading cause of late-stage production bugs. Furthermore, **environments must differ ONLY by injected configuration, NEVER by build artifacts**: the identical, immutable container image tested in staging must be promoted to production. Modern cloud-native engineering increasingly adopts **Ephemeral Environments**: when a pull request is opened, the CI/CD pipeline dynamically provisions an isolated preview environment in Kubernetes, runs automated tests, and destroys the environment upon PR merge."
      },

      miss: [
        {
          w: "Copying the real production database directly into staging is the best way to get realistic test data.",
          r: "Using un-sanitized production data in staging is a **massive security and regulatory violation (GDPR, HIPAA, PCI-DSS)**. Staging environments have broader developer access and weaker security boundaries; customer PII must be **anonymized, scrubbed, or synthetically generated** before loading into staging."
        },
        {
          w: "Compiling code with different compiler optimization flags for staging and production is good engineering.",
          r: "Compiling separate builds violates the core CD rule: **Build Once, Promote Everywhere**. Code must be compiled once into an immutable artifact, with environment behavior controlled strictly through externalized configuration."
        },
        {
          w: "A shared staging environment is sufficient for a team of 100 developers.",
          r: "A single shared staging environment becomes a **massive bottleneck**: multiple developers overwrite each other's changes, test runs collide, and staging is constantly broken. High-velocity teams use **Ephemeral Preview Environments per Pull Request**."
        },
        {
          w: "Developers should have direct SSH and database write access to production environments for quick fixes.",
          r: "Direct human access to production violates SOC 2 compliance, audit controls, and principle of least privilege. **All production changes must flow through peer-reviewed code and automated CI/CD pipelines**."
        }
      ],

      trade: {
        buys: [
          "Isolated failure boundaries: bugs, crashes, and performance tests in development and staging never impact live users.",
          "High deployment confidence: verifying identical artifacts in production-mirror staging environments eliminates surprises.",
          "Regulatory compliance: strict separation of duties satisfies SOC 2, HIPAA, and PCI-DSS compliance requirements.",
          "Faster code reviews: ephemeral preview environments give product managers live URLs to test features before merging."
        ],
        costs: [
          "Cloud infrastructure spend: running multiple persistent environments (staging, QA, dev) multiplies monthly cloud bills.",
          "Data anonymization pipeline maintenance: building and maintaining automated PII scrubbing pipelines requires engineering effort.",
          "Configuration synchronization overhead: keeping environment configurations and secret schemas aligned across environments.",
          "Staging environment contention: shared staging environments require scheduling and coordination across teams unless ephemeral."
        ],
        avoid: [
          "Never load un-sanitized production customer personal data (PII) into development or staging environments.",
          "Never rebuild an artifact when promoting software from staging to production; promote the identical digest.",
          "Never allow developers direct write access to production databases without audited break-glass procedures.",
          "Never use different database engines between development and production (e.g., SQLite locally and PostgreSQL in prod)."
        ]
      }
    }

  ]);

})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
