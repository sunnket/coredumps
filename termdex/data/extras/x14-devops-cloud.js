/* Real-world examples and step-by-step flows — DevOps & Cloud. */
TD.attach("devops-cloud", {

"DevOps": {
 ex: { h: "The wall that used to exist",
       b: "Developers threw code over a wall; operations caught it and were paged at 3am for decisions they had no part in. DevOps removed the wall — the team that writes it runs it — and the cultural change did far more for reliability than any of the tooling that now carries the name." },
 fl: { t: "What actually changes",
       s: ["A team owns a service end to end",
           { s: "They deploy it, and they carry the pager for it", n: "Feedback from production reaches the person who can fix the cause." },
           { q: "Did a deploy cause an incident?",
             y: "The fix is a pipeline change, not a rule that people should be more careful",
             n: "Reduce batch size — small frequent deploys fail smaller" },
           { s: "Blameless postmortems, so causes surface honestly", n: "Blame produces silence, and silence produces repeat incidents." },
           "Buying tools without changing ownership gives you the same wall with better dashboards"] }
},

"CI/CD": {
 ex: { h: "From merge to production without a meeting",
       b: "The release used to be a Thursday evening with a rollback plan and a spreadsheet. With a pipeline it is a merge — build, test, deploy, verify, all automated — and the reason it is safer is not the automation but the batch size: fifty small changes fail more gently than one large one." },
 fl: { t: "What the pipeline does on every push",
       s: ["A commit lands on a branch",
           { s: "Build once, producing a versioned artefact", n: "Every later stage deploys that same artefact — never rebuilds." },
           { s: "Run the fast tests, then the slow ones", n: "Fail early and cheaply." },
           { q: "Did every stage pass?",
             y: "Deploy to staging, verify, then progressively to production",
             n: "Stop, and make the failure obvious to whoever pushed it" },
           { s: "Verify in production with smoke tests and metrics", n: "Deployment finishing is not the same as it working." },
           "Keep the pipeline under ten minutes or people start batching changes to avoid waiting"] }
},

"Continuous Integration": {
 ex: { h: "Merging daily so integration never becomes an event",
       b: "Two developers work in isolation for three weeks and spend two days reconciling. Integrate daily and each conflict is small enough to resolve in minutes. CI is that discipline plus an automated check that the mainline still works after every merge." },
 fl: { t: "The CI loop",
       s: ["Pull the latest mainline before you start",
           { s: "Work in small increments — hours, not weeks", n: "Long-lived branches are the thing CI exists to prevent." },
           { s: "Push, and the server builds and tests the merged result", n: "Testing your branch alone is not integration." },
           { q: "Is the build red?",
             y: "Fixing it is the team's top priority — nobody pushes onto a broken mainline",
             n: "Merge and move on" },
           "A test suite people routinely ignore is worse than none — flaky tests must be fixed or deleted"] }
},

"Continuous Deployment": {
 ex: { h: "No human in the release path",
       b: "Every commit that passes the pipeline goes live, dozens of times a day. It sounds reckless and is usually safer, because it forces genuinely good automated verification, small changes, and a rollback that works — none of which survive in a world of quarterly releases." },
 fl: { t: "Prerequisites before you turn it on",
       s: ["Confidence must come from tests, not from a person's judgement",
           { q: "Would you deploy this on a Friday afternoon?",
             y: "You have the automation and the rollback path to do it",
             n: "You are not ready — fix that before removing the approval gate" },
           { s: "Decouple deploy from release with feature flags", n: "Code ships dark; the feature turns on separately." },
           { s: "Automate rollback on metric regression", n: "The safety net that makes it responsible rather than reckless." },
           "Continuous delivery — always releasable, released by a human — is a legitimate destination too"] }
},

"Pipeline": {
 ex: { h: "The conveyor belt with quality gates",
       b: "Build, unit test, integration test, security scan, deploy to staging, smoke test, deploy to production. The essential rule is that one artefact travels the whole belt — rebuilding at each stage means production runs something no stage ever tested." },
 fl: { t: "Designing the stages",
       s: ["Build once, at the start",
           { s: "Tag the artefact with the commit hash", n: "It is the same bytes in staging and production." },
           { s: "Order stages fastest-and-cheapest first", n: "Lint and unit tests before a twenty-minute integration suite." },
           { q: "Does a stage fail intermittently?",
             y: "Fix it — a flaky gate teaches everyone to re-run rather than investigate",
             n: "Promote the artefact to the next environment" },
           { s: "Secrets come from a vault at deploy time", n: "Never baked into the artefact." },
           "Every stage should be runnable locally, or debugging means pushing commits to find out"] }
},

"Artifact": {
 ex: { h: "The thing that actually gets deployed",
       b: "A jar, a container image, a wheel, a tarball — immutable, versioned and stored somewhere addressable. The rule that prevents an entire class of incident: never rebuild for a later environment. `v1.4.2` in production is byte-identical to `v1.4.2` in staging." },
 fl: { t: "Handling built files properly",
       s: [{ s: "An artefact is whatever your build produces and you actually deploy", n: "A container image, a jar, a zip. The thing that runs, not the source code." },
           { s: "Build it exactly once, then move that same file through testing and into production", n: "Rebuilding for each environment means what you tested is not what you shipped, however identical the steps look." },
           { s: "Name it after the exact code version it came from, not a counter that resets", n: "So when something breaks in production you can go straight to the code that produced it, with no guessing." },
           { s: "Store it somewhere central, along with a fingerprint of its contents", n: "The fingerprint lets anyone check the file has not been altered since it was built." },
           { q: "What do you deploy to production?",
             y: "The exact file you tested, pulled by its fingerprint — never a fresh build from the same source",
             n: "Increasingly you also record how and where it was built, because customers and auditors now ask" }] }
},

"Container": {
 ex: { h: "*It works on my machine* — now shippable",
       b: "The dependency, the runtime and the config travel with the code, so the thing that ran on the laptop is the thing that runs on the server. It shares the host kernel rather than emulating hardware, which is why it starts in milliseconds where a VM takes a minute." },
 fl: { t: "What isolation you actually get",
       s: ["The process runs with its own filesystem and network namespace",
           { s: "It sees its own root, its own processes, its own interfaces", n: "Namespaces provide the illusion; cgroups limit the resources." },
           { q: "Is this a security boundary?",
             y: "Weaker than a VM — the kernel is shared, so a kernel escape is a host escape",
             n: "For hostile multi-tenancy, add a VM boundary or a sandboxed runtime" },
           { s: "Containers are ephemeral", n: "Anything you need to keep must be on a mounted volume." },
           "Run as a non-root user — the default is root, and it is a genuinely bad default"] }
},

"Docker": {
 ex: { h: "Containers existed; Docker made them usable",
       b: "Linux had namespaces and cgroups for years and almost nobody used them, because the ergonomics were brutal. Docker's contribution was the image format, the layer cache and one command — and that packaging is why the industry moved in about three years." },
 fl: { t: "From source to running container",
       s: ["Write a Dockerfile describing the environment",
           { s: "Each instruction becomes a cached layer", n: "Order matters enormously for build speed." },
           { s: "Build produces an image, tagged and immutable", n: "Push it to a registry." },
           { q: "Is the image hundreds of megabytes?",
             y: "Use a multi-stage build — compile in a fat image, copy the binary into a slim one",
             n: "Run it, mounting config and secrets at runtime" },
           "Never bake secrets into an image — every layer is readable by anyone who can pull it"] }
},

"Container Image": {
 ex: { h: "Layers, and why your build is slow",
       b: "An image is a stack of read-only layers, each a filesystem diff. Copy your source before installing dependencies and every code change invalidates the dependency layer — so a one-character fix rebuilds `npm install` from scratch, every time." },
 fl: { t: "Ordering for the cache",
       s: ["Start from a minimal, pinned base image",
           { s: "Pin by digest, not by `latest`", n: "`latest` makes your build non-reproducible by definition." },
           { s: "Copy dependency manifests and install them first", n: "`package.json` before the source tree." },
           { q: "Did only application code change?",
             y: "Everything below is cached — the build takes seconds",
             n: "A dependency change rebuilds from that layer down" },
           { s: "Deleting a file in a later layer does not shrink the image", n: "The earlier layer still contains it — and so does anyone who pulls it." },
           "Scan images for vulnerabilities in CI; base images age badly"] }
},

"Dockerfile": {
 ex: { h: "The build, written down",
       b: "Its value is that environment setup stops being tribal knowledge in a wiki and becomes a reviewed file in the repository. Its trap is that every instruction is cached, so a thoughtless line ordering turns a ten-second rebuild into a five-minute one." },
 fl: { t: "Writing a good one",
       s: ["`FROM` a specific, minimal base image",
           { s: "Alpine or distroless where the runtime allows it", n: "Smaller surface, fewer CVEs, faster pulls." },
           { s: "Install dependencies before copying source", n: "The single highest-impact ordering decision." },
           { q: "Do build tools need to be in the final image?",
             y: "Almost never — use a multi-stage build and copy only the output",
             n: "Set a non-root `USER` and an explicit `CMD`" },
           { s: "Combine `RUN` steps that create and clean up temporary files", n: "Cleanup in a later layer does not reclaim space." },
           "Add a `.dockerignore` — otherwise `.git` and `node_modules` land in the build context"] }
},

"Container Registry": {
 ex: { h: "The package repository for images",
       b: "Build pushes, deploy pulls, and everything in between depends on that registry being available — which is why a registry outage stops deployments across an entire company. Pinning by digest rather than tag is what stops a *stable* tag quietly changing under you." },
 fl: { t: "Publishing and pulling safely",
       s: ["Push the built image with an immutable version tag",
           { s: "Plus a digest — the content hash", n: "Tags can be moved; digests cannot." },
           { q: "Is the deployment referencing a mutable tag?",
             y: "The same manifest can deploy different code on different days — pin the digest",
             n: "Pulls are reproducible" },
           { s: "Scan on push and block on critical findings", n: "The registry is the right gate for this." },
           { s: "Set retention policies", n: "Untagged layers accumulate into real storage bills." },
           "Private registries need pull credentials in every cluster — a common first-deploy failure"] }
},

"Virtual Machine": {
 ex: { h: "A whole computer, in software",
       b: "Its own kernel, its own boot sequence, its own everything — which is heavy, slow to start, and a genuinely strong isolation boundary. That last property is why cloud providers run your containers inside VMs even when you only asked for containers." },
 fl: { t: "VM or container?",
       s: ["Consider what you need isolated",
           { q: "Is untrusted or hostile code involved?",
             y: "VM — a separate kernel is a far stronger boundary",
             n: "Container — seconds versus minutes, and far denser packing" },
           { s: "Different OS or kernel version required?", n: "That is a VM requirement, not a container one." },
           { s: "In practice the answer is usually both", n: "Containers on VM nodes: density inside, isolation outside." },
           "Snapshots and live migration are VM capabilities containers do not have"] }
},

"Kubernetes": {
 ex: { h: "You declare the destination, it drives",
       b: "*I want five replicas of this image, reachable at this address.* A control loop then works continuously to make reality match — restarting crashed pods, rescheduling off dead nodes, rolling out new versions. That reconciliation loop is the whole idea; everything else is configuration." },
 fl: { t: "What happens when you apply a manifest",
       s: ["The desired state is written to the API server",
           { s: "Stored in etcd — the cluster's single source of truth", n: "Nothing is executed yet." },
           { s: "Controllers notice a difference between desired and actual", n: "The Deployment controller creates a ReplicaSet, which creates Pods." },
           { s: "The scheduler assigns each pod to a node", n: "Based on resource requests, affinities and taints." },
           { q: "Does a pod die?",
             y: "The loop notices the shortfall and creates another — no human involved",
             n: "The state is reconciled and stays there" },
           "Set resource requests and limits, or the scheduler is packing blind and eviction is arbitrary"] }
},

"Pod": {
 ex: { h: "The unit that gets scheduled",
       b: "Usually one container, sometimes a main container plus a sidecar sharing its network and storage — a log shipper, or a service-mesh proxy. Pods are deliberately disposable: they get a new IP each time, and anything worth keeping must live in a volume." },
 fl: { t: "A pod's life",
       s: ["The scheduler places it on a node with room",
           { s: "Init containers run to completion first", n: "For migrations, config fetching or waiting on a dependency." },
           { s: "The main containers start and probes begin", n: "Readiness gates traffic; liveness triggers restarts." },
           { q: "Does the liveness probe fail?",
             y: "The container is restarted — a badly tuned probe causes restart loops under load",
             n: "It stays in service while ready" },
           { s: "On termination it gets SIGTERM, then a grace period, then SIGKILL", n: "Handle SIGTERM or you drop in-flight requests on every deploy." },
           "Never deploy bare pods — use a Deployment so something recreates them"] }
},

"Helm": {
 ex: { h: "The same manifests, three environments",
       b: "Staging and production differ in replica count, resource limits and hostnames — and copying twelve YAML files per environment guarantees drift. Helm templates them with a values file each. Its cost is that debugging a templating error in generated YAML is genuinely unpleasant." },
 fl: { t: "Installing and upgrading a chart",
       s: ["A chart holds templates plus default values",
           { s: "Environment-specific values files override the defaults", n: "One template set, several deployments." },
           { s: "`helm template` renders locally without applying", n: "Always check the output before an upgrade — this catches most mistakes." },
           { q: "Did the upgrade break something?",
             y: "`helm rollback` reverts to the previous release revision",
             n: "The release history records what changed" },
           "Pin chart versions — a third-party chart upgrading itself is an unreviewed change to production"] }
},

"Infrastructure as Code": {
 ex: { h: "The server nobody remembers configuring",
       b: "Somewhere is a machine that has been running for four years, configured by hand by someone who left, and which nobody dares touch. IaC exists so that never happens again: the infrastructure is a file, reviewed like code, and rebuildable from scratch." },
 fl: { t: "Managing infrastructure as code",
       s: ["Describe the desired resources in version-controlled files",
           { s: "Reviewed via pull request, like any other change", n: "The review is most of the value." },
           { s: "Plan first — see exactly what will change", n: "The plan output is the thing to review, not just the code diff." },
           { q: "Did someone change it manually in the console?",
             y: "Drift — the next apply will revert or conflict with it; detect drift on a schedule",
             n: "Apply, and the state file records reality" },
           { s: "State files hold secrets in plaintext", n: "Store them in an encrypted remote backend with locking." },
           "Make manual console changes impossible in production, or IaC becomes a fiction"] }
},

"Terraform": {
 ex: { h: "One language, every provider",
       b: "It became the default because the alternative was learning a different tool per cloud. The concept that causes most trouble is state: Terraform keeps its own record of what it created, and when that record disagrees with reality — usually because someone clicked something — the results are surprising." },
 fl: { t: "The plan-and-apply cycle",
       s: ["Write the desired resources in HCL",
           { s: "Terraform reads its state file to learn what already exists", n: "State is authoritative to Terraform, not the cloud." },
           { s: "`plan` diffs desired against state and real resources", n: "Read it carefully — especially anything marked destroy." },
           { q: "Does the plan want to replace a database?",
             y: "Stop. Some attribute changes force replacement — check before applying",
             n: "Apply, and the state updates" },
           { s: "Use remote state with locking", n: "Two engineers applying at once corrupts local state." },
           "Import existing resources rather than recreating them — `terraform import` exists for this"] }
},

"Ansible": {
 ex: { h: "SSH, with a memory of what it did",
       b: "No agent to install, no daemon to run — it connects over SSH and applies tasks. Its discipline is idempotence: a good playbook run twice changes nothing the second time, which is what makes it safe to run against production on a schedule." },
 fl: { t: "Running a playbook",
       s: ["Define hosts in an inventory and tasks in a playbook",
           { s: "Tasks declare desired state: *this package installed*, *this file present*", n: "Not *run this command*." },
           { q: "Is the system already in the desired state?",
             y: "The task reports *ok* and changes nothing — that is idempotence",
             n: "It makes the change and reports *changed*" },
           { s: "`--check` does a dry run", n: "Not perfectly, but usefully." },
           { s: "Handlers run once at the end", n: "Restart the service only if something actually changed." },
           "Configuration management fights immutable infrastructure — decide which model you are in"] }
},

"Configuration Management": {
 ex: { h: "Fifty servers, one of which is different",
       b: "That one machine — patched by hand during an incident eighteen months ago — is where the next outage comes from. Configuration management is the practice of eliminating snowflakes, either by converging them continuously or by replacing them entirely." },
 fl: { t: "Two ways to keep systems consistent",
       s: ["Define the desired configuration in code",
           { q: "Are the machines long-lived?",
             y: "Converge them repeatedly with Ansible, Chef or Puppet",
             n: "Bake the config into an image and replace the machine — immutable infrastructure" },
           { s: "Configuration drift is the enemy either way", n: "Detect it: run in check mode and alert on differences." },
           { s: "Secrets stay out of the repository", n: "Injected at run time from a vault." },
           "The immutable approach is simpler to reason about wherever replacement is cheap"] }
},

"Immutable Infrastructure": {
 ex: { h: "Cattle, not pets",
       b: "A server misbehaves; you do not diagnose and patch it, you terminate it and let a new one boot from the known image. It removes configuration drift as a category — and it requires that nothing important lives on the instance, which is the discipline it enforces." },
 fl: { t: "Deploying immutably",
       s: ["Build a machine or container image containing everything",
           { s: "Versioned and tested as a unit", n: "Configuration differences come from environment variables, not edits." },
           { q: "Need to change something on a running instance?",
             y: "Build a new image and replace the instance — never patch in place",
             n: "Instances stay identical to the image by construction" },
           { s: "State must live elsewhere", n: "Managed databases, object storage, external volumes." },
           { s: "Rollback is deploying the previous image", n: "Which is why it is fast and reliable here." },
           "Log to a central system — you cannot SSH into a machine that no longer exists"] }
},

"GitOps": {
 ex: { h: "The cluster reads the repo, not the other way round",
       b: "Instead of CI pushing changes into the cluster with production credentials, an agent inside the cluster pulls from git and reconciles. The repository becomes the audit log — every production change is a reviewed commit — and drift is corrected automatically." },
 fl: { t: "How a change reaches production",
       s: ["Desired state lives in a git repository",
           { s: "A change is a pull request, reviewed and merged", n: "Which is your change management process, for free." },
           { s: "An in-cluster agent notices the new commit", n: "Argo CD or Flux, polling or via webhook." },
           { q: "Does live state differ from the repository?",
             y: "The agent reconciles it — including reverting manual changes",
             n: "It reports in sync" },
           { s: "Rollback is `git revert`", n: "The same mechanism as any other change." },
           "Keep application code and deployment manifests in separate repositories, or every commit triggers a deploy"] }
},

"Blue-Green Deployment": {
 ex: { h: "Two identical environments and a switch",
       b: "Blue serves traffic; green gets the new version and is verified in isolation; then the load balancer points at green. Rollback is pointing it back — seconds, not a redeploy. The cost is running two full environments, and the catch is always the database." },
 fl: { t: "Performing the cutover",
       s: ["Deploy the new version to the idle environment",
           { s: "Warm caches and run smoke tests against it", n: "With no user traffic on it." },
           { q: "Do both versions share a database?",
             y: "Schema changes must be backward compatible — both versions run against it during the switch",
             n: "Switch the load balancer to the new environment" },
           { s: "Keep the old environment running for a while", n: "It is your rollback, and it costs money to keep." },
           { s: "Watch error rates for several minutes", n: "Then release the old environment." },
           "In-flight sessions and long-running requests need draining, or users see errors at the moment of switch"] }
},

"Canary Deployment": {
 ex: { h: "Break it for 1% of users, not all of them",
       b: "Send a small slice of traffic to the new version, watch error rate and latency, and expand only if the numbers hold. It catches the failures that only appear under real traffic — and it needs enough traffic that 1% is statistically meaningful." },
 fl: { t: "Rolling out progressively",
       s: ["Deploy the new version alongside the old",
           { s: "Route a small percentage of traffic to it", n: "By weight, or by a user attribute for a consistent experience." },
           { s: "Compare metrics between the two versions directly", n: "Not against yesterday — against the control running right now." },
           { q: "Are error rate, latency and business metrics holding?",
             y: "Increase the share — 1%, 5%, 25%, 100%",
             n: "Route back to the old version immediately" },
           { s: "Automate the analysis and the rollback", n: "A human watching a dashboard at 2am is not a control." },
           "Sticky routing matters — a user flipping between versions mid-session sees inconsistent behaviour"] }
},

"Rolling Deployment": {
 ex: { h: "Replace them a few at a time",
       b: "The Kubernetes default: bring up new pods, wait for them to be ready, remove old ones, repeat. No extra environment and no downtime — but both versions run simultaneously for a while, so the new code must tolerate the old code's data and vice versa." },
 fl: { t: "How the rollout proceeds",
       s: ["Start new instances alongside the old",
           { s: "`maxSurge` and `maxUnavailable` control the pace", n: "The tradeoff between speed and spare capacity." },
           { q: "Do new instances pass their readiness probe?",
             y: "They receive traffic; an equal number of old ones are drained",
             n: "The rollout stalls — which is the safety mechanism working" },
           { s: "Both versions serve traffic during the rollout", n: "So API and schema changes must be backward compatible." },
           { s: "Old pods get SIGTERM and a grace period", n: "Handle it, or in-flight requests are dropped." },
           "Rollback is another rolling update — slower than a blue-green switch"] }
},

"Rollback": {
 ex: { h: "The first move, not the last resort",
       b: "During an incident the instinct is to diagnose. The correct instinct is to restore service first and diagnose afterwards — which only works if rollback is a single, rehearsed, reliable command. Untested rollback is a plan, not a capability." },
 fl: { t: "Rolling back under pressure",
       s: ["Confirm the deploy correlates with the problem",
           { s: "Check the deploy timeline against the metric change", n: "Most incidents are correlated with a change." },
           { q: "Did the release include a non-reversible migration?",
             y: "You cannot simply roll back — this is why migrations must be backward compatible",
             n: "Revert to the previous artefact version" },
           { s: "Verify recovery with the same metric that alerted", n: "Do not assume." },
           { s: "Then investigate, with the failed artefact preserved", n: "Diagnosis after mitigation." },
           "Practise rollback deliberately — an untested path fails when you need it most"] }
},

"Autoscaling": {
 ex: { h: "Capacity that follows the traffic",
       b: "A retailer at 3am and on Black Friday needs wildly different capacity, and paying for the peak all year is expensive. Autoscaling adjusts the count automatically — and its two classic failures are scaling too slowly to matter, and a feedback loop where scaling itself triggers more scaling." },
 fl: { t: "Configuring it sensibly",
       s: ["Choose a metric that actually reflects load",
           { s: "Request rate or queue depth beats CPU for most services", n: "CPU is a proxy, and often a poor one." },
           { q: "Does a new instance take minutes to become useful?",
             y: "Reactive scaling arrives after the spike — pre-warm or schedule ahead of known peaks",
             n: "Scale on the metric with a cooldown to prevent flapping" },
           { s: "Set a maximum", n: "It caps the blast radius of a runaway loop, and the bill." },
           { s: "Scaling down needs more hysteresis than scaling up", n: "Aggressive scale-down causes thrashing." },
           "Autoscaling cannot fix a database bottleneck — more app servers make that worse"] }
},

"Observability": {
 ex: { h: "Answering a question you did not anticipate",
       b: "Monitoring tells you the dashboard you built is red. Observability is being able to ask *why are requests from this one customer, on this one endpoint, slow only on Tuesdays* — without shipping new code. The difference is whether your telemetry has enough dimensions to slice." },
 fl: { t: "Building a system you can actually ask questions of",
       s: [{ s: "Monitoring answers questions you thought of in advance. Observability answers ones you did not", n: "\"Is the server up?\" is monitoring. \"Why is it slow only for users in Mumbai on Android?\" is not." },
           { s: "So record events as structured data — named fields with values — rather than sentences", n: "`user_id=4471 region=mumbai duration_ms=830` can be filtered and grouped. \"Request took a while\" cannot." },
           { s: "Attach the details that identify one specific request, not just its type", n: "Which user, which version, which region, which request. These are exactly the details that let you slice the data a way nobody anticipated." },
           { s: "Give every request a unique id and pass it to every service it touches", n: "Now one slow page can be followed across six services, and you can see which one actually took the time." },
           { q: "How do you know if you have enough?",
             y: "Take a real incident you have had and ask whether the data you collect could have answered it — without deploying anything new",
             n: "If the answer is \"we would have to add logging and wait for it to happen again\", you are not there yet" }] }
},

"Monitoring": {
 ex: { h: "Watching the things you already know can break",
       b: "Disk usage, error rate, queue depth, certificate expiry. It is deliberately narrow and completely necessary — and its failure mode is a wall of dashboards nobody reads and alerts everybody has muted, which is the same as having none." },
 fl: { t: "Monitoring a service well",
       s: ["Start with the four golden signals",
           { s: "Latency, traffic, errors, saturation", n: "Almost every incident shows up in one of them." },
           { s: "Alert on symptoms users feel, not on internal causes", n: "*Checkout is failing*, not *CPU is at 90%*." },
           { q: "Would this alert require immediate human action at 3am?",
             y: "Page it, with a runbook link",
             n: "It is a ticket or a dashboard, not a page" },
           { s: "Monitor the monitoring", n: "A dead exporter looks exactly like a healthy silent system." },
           "Review and delete alerts that never turn out to be actionable — noise destroys the signal"] }
},

"Logging": {
 ex: { h: "The only record of what actually happened",
       b: "During an incident, logs are the archaeology. The difference between useful and useless is structure: JSON lines with a request id, a user id and a level can be queried; a wall of unstructured English cannot, once there is more than one machine." },
 fl: { t: "Logging that helps at 3am",
       s: ["Emit structured records with consistent fields",
           { s: "Timestamp, level, service, request id, message", n: "Same schema across every service." },
           { q: "Does the line contain personal data or a secret?",
             y: "Redact at source — logs are widely readable and retained for a long time",
             n: "Ship it to a central store" },
           { s: "Use levels honestly", n: "If everything is ERROR, nothing is." },
           { s: "Set retention and sampling", n: "Full-fidelity logs at scale cost more than the service." },
           "Log the decision and its inputs, not just that a function was entered"] }
},

"Metrics": {
 ex: { h: "Cheap numbers over time",
       b: "A counter of requests and a histogram of durations cost almost nothing to record and answer most operational questions. Their limit is dimensionality: adding user id as a label creates a separate time series per user and will take down your metrics system." },
 fl: { t: "Instrumenting a service without drowning in data",
       s: [{ s: "A metric is a number tracked over time — requests per second, errors, how long things took", n: "Cheap to store for years, because you keep the numbers rather than the individual events." },
           { s: "Count things that happen, and record how long things take", n: "Those two cover most of what you need." },
           { s: "For durations, never store just the average", n: "An average of 200ms can hide the fact that one user in a hundred waits nine seconds — and those are the ones who complain." },
           { s: "Store the spread instead, so you can ask what the slowest 1% experienced", n: "That number is what your unhappiest users actually see, and it is the one worth alerting on." },
           { q: "Can you label a metric with the user's id, or the full URL?",
             y: "No — every distinct value creates its own separate series to store forever, and a million users means a million series. This is the classic way to make a monitoring bill explode",
             n: "Labels must have few possible values: which endpoint, which status code, which region. Per-request detail belongs in logs, not here" }] }
},

"Distributed Tracing": {
 ex: { h: "Which of the eleven services made it slow?",
       b: "A request that takes two seconds touches a gateway, three services, a cache and a database. Per-service latency graphs will not tell you where the time went; a trace shows the waterfall — and usually reveals a call being made forty times in a loop." },
 fl: { t: "Following one request",
       s: ["The entry point generates a trace id",
           { s: "Propagated in headers to every downstream call", n: "One missing propagation breaks the chain from there on." },
           { s: "Each service records spans with timing and attributes", n: "Parent-child relationships build the tree." },
           { q: "Is one span dominating the total?",
             y: "That is your bottleneck — or many small repeated spans, which is an N+1",
             n: "Look for gaps between spans: queueing and lock contention hide there" },
           { s: "Sample — tracing every request is expensive", n: "Keep all slow and failed traces; sample the rest." },
           "Use OpenTelemetry so you are not locked to one backend"] }
},

"Prometheus": {
 ex: { h: "It pulls; it does not wait to be told",
       b: "Prometheus scrapes an HTTP endpoint on each target every few seconds, which makes a failing scrape itself a signal that something is down. Its practical limits are cardinality — a label with many values will exhaust memory — and that a single server is not a durable long-term store." },
 fl: { t: "How a metric reaches an alert",
       s: ["The application exposes `/metrics` in a text format",
           { s: "A counter, gauge or histogram per measurement", n: "Client libraries handle the format." },
           { s: "Prometheus discovers targets and scrapes them on an interval", n: "Service discovery from Kubernetes, Consul or a file." },
           { s: "Rules evaluate PromQL expressions continuously", n: "Alerts fire when an expression holds for a duration." },
           { q: "Are alerts flapping?",
             y: "Add a `for` clause — require the condition to persist before firing",
             n: "Alertmanager groups, deduplicates and routes them" },
           "Use `rate()` on counters, never the raw value — counters reset on restart"] }
},

"Grafana": {
 ex: { h: "One pane of glass over several systems",
       b: "Metrics from Prometheus, logs from Loki, traces from Tempo, and a business number from Postgres, on the same dashboard with a shared time range. Its risk is dashboard sprawl — two hundred dashboards, four of which anyone looks at during an incident." },
 fl: { t: "Building a dashboard people use",
       s: ["Decide the question the dashboard answers",
           { s: "*Is this service healthy?* is a different dashboard from *why is it slow?*", n: "Do not merge them." },
           { s: "Put the golden signals at the top", n: "Latency, traffic, errors, saturation — the first screen, no scrolling." },
           { q: "Is a panel ambiguous during an incident?",
             y: "Add a threshold line and units — an unlabelled graph is decoration",
             n: "Add links to the relevant runbook and logs" },
           { s: "Template with variables rather than cloning per service", n: "One dashboard, a dropdown for the service." },
           "Version dashboards as code — a hand-edited dashboard is lost when someone clicks delete"] }
},

"Alerting": {
 ex: { h: "The pager that cried wolf",
       b: "A team receiving forty alerts a night stops reading them, and the one that mattered is lost in the noise. Every page should be actionable, urgent and about something a user is experiencing — everything else is a ticket, a dashboard, or a deletion." },
 fl: { t: "Deciding whether to page",
       s: ["Something is measurably wrong",
           { q: "Is a user affected right now?",
             y: "And can a human do something about it? Then page",
             n: "Ticket it — disk at 70% is tomorrow's problem" },
           { s: "Every page needs a runbook", n: "An alert with no documented response is an interruption, not information." },
           { s: "Alert on symptoms, not causes", n: "One symptom alert beats twenty cause alerts firing together." },
           { q: "Did the alert turn out to be non-actionable?",
             y: "Delete or fix it in the review — this is the discipline that keeps alerting useful",
             n: "Record the response in the runbook" }] }
},

"SLA, SLO and SLI": {
 ex: { h: "Three numbers people use interchangeably and should not",
       b: "The SLI is what you measure — 99.7% of requests succeeded. The SLO is your internal target — 99.5%. The SLA is the contract with a refund clause — 99.0%. The SLO is always stricter than the SLA, so you find out before your customers invoice you." },
 fl: { t: "Setting them in the right order",
       s: ["Choose an SLI that reflects user experience",
           { s: "Successful requests over total, or requests under 300ms", n: "Measured at the edge, where the user is." },
           { s: "Set the SLO from what users actually need", n: "Not from what you currently achieve, and not from a row of nines." },
           { q: "Is there a contractual promise?",
             y: "The SLA sits below the SLO — deliberately, with margin",
             n: "The SLO alone drives engineering decisions" },
           { s: "The gap between SLO and 100% is the error budget", n: "Which is what makes reliability a tradeoff rather than an absolute." },
           "Every extra nine costs roughly ten times more — pick the number deliberately"] }
},

"Error Budget": {
 ex: { h: "Permission to take risks, quantified",
       b: "A 99.9% SLO allows about 43 minutes of failure a month. That is not a shameful allowance — it is the budget that lets you ship. Budget remaining means ship faster; budget exhausted means stop feature work and fix reliability. It turns an argument into a number." },
 fl: { t: "Spending the budget",
       s: ["Compute allowed failure from the SLO",
           { s: "99.9% over 30 days is roughly 43 minutes", n: "Measured in bad requests, not just downtime." },
           { s: "Every incident and risky deploy consumes it", n: "Track consumption continuously, not monthly in arrears." },
           { q: "Is the budget nearly spent?",
             y: "Freeze risky changes and spend the sprint on reliability — agreed in advance",
             n: "Ship — unused budget means you are being too cautious" },
           "The policy must be agreed before it is needed, or it is renegotiated during every incident"] }
},

"Incident Response": {
 ex: { h: "The first ten minutes decide the next two hours",
       b: "Without a structure, six people investigate the same thing while nobody talks to customers. With one, someone is commanding, someone is communicating, someone is investigating — and the first priority is restoring service, not understanding it." },
 fl: { t: "Running an incident",
       s: ["Declare it — explicitly, early, and without embarrassment",
           { s: "Assign an incident commander", n: "They coordinate; they do not debug." },
           { s: "Mitigate before diagnosing", n: "Roll back, fail over, shed load. Understanding can wait." },
           { q: "Was there a recent change?",
             y: "Revert it first — most incidents follow a change",
             n: "Work outward from the affected user path" },
           { s: "Communicate on a schedule, even with no news", n: "Silence is worse than *still investigating*." },
           "Keep a timestamped log during the incident — reconstructing it afterwards never works"] }
},

"Postmortem": {
 ex: { h: "Blameless, because blame buys silence",
       b: "*The engineer ran the wrong command* ends the inquiry and changes nothing. *The command was destructive, had no confirmation, and the runbook was ambiguous* produces four fixes. The point is finding the systemic causes that let a normal human error become an outage." },
 fl: { t: "Writing one that changes something",
       s: ["Build the timeline from logs and chat, with timestamps",
           { s: "What was known when, not what was true", n: "Decisions are judged on the information available at the time." },
           { s: "Ask why the system allowed it, repeatedly", n: "Past the first plausible answer — that one is rarely the cause." },
           { q: "Does an action item have an owner and a date?",
             y: "It might happen",
             n: "It will not — an unowned action item is a wish" },
           { s: "Publish it widely", n: "Other teams have the same latent failure." },
           "Review old postmortems periodically — repeat causes indicate the fixes were not real"] }
},

"On-Call": {
 ex: { h: "Sustainable, or it eats the team",
       b: "A rota where the pager fires most nights is not on-call, it is a retention problem. The measure of a healthy rotation is how rarely it fires — and the fastest way to improve it is to make the on-call engineer's day job be fixing whatever paged them last night." },
 fl: { t: "Running a humane rotation",
       s: ["Define severity levels and what each warrants",
           { s: "Only the top level pages out of hours", n: "Everything else waits for the morning." },
           { q: "Is the on-call engineer being woken regularly?",
             y: "That is the top-priority engineering problem, not an acceptable cost",
             n: "Keep runbooks current for every alert" },
           { s: "Give the on-call engineer no sprint commitments", n: "Their job is the pager and the fixes it generates." },
           { s: "Hand over deliberately at shift change", n: "Open issues, ongoing risks, what changed." },
           "Compensate for out-of-hours work — unpaid disruption is how rotations quietly collapse"] }
},

"Chaos Engineering": {
 ex: { h: "Break it on Tuesday afternoon instead of Sunday night",
       b: "Netflix's Chaos Monkey kills production instances during working hours, deliberately. The reasoning is unarguable: those instances will die anyway, and it is far better to discover the consequences with the whole team awake and watching." },
 fl: { t: "Running an experiment safely",
       s: ["State a hypothesis about steady-state behaviour",
           { s: "*Killing one instance will not change the error rate*", n: "Measurable, and falsifiable." },
           { s: "Start in staging, with a small blast radius", n: "One instance, not one region." },
           { q: "Did the hypothesis hold?",
             y: "Expand the scope — more instances, then dependencies, then a region",
             n: "Stop, fix what you found, and re-run — that is the entire value" },
           { s: "Have an abort switch and use it without hesitation", n: "The experiment is not worth a real outage." },
           "Do not start here — you need monitoring and incident response before you start injecting failure"] }
},

"High Availability": {
 ex: { h: "Removing the single points of failure, one at a time",
       b: "Two web servers behind a load balancer, and one database — the database is the single point of failure, and so, quietly, is the load balancer. HA is the discipline of asking *what breaks if this one thing dies* until the answers are all acceptable." },
 fl: { t: "Designing for it",
       s: ["Draw the request path and mark every component",
           { q: "What happens if this one disappears?",
             y: "If the answer is *outage*, it is a single point of failure",
             n: "Redundant — but check the failover actually works" },
           { s: "Spread replicas across availability zones", n: "Two instances on one physical host is not redundancy." },
           { s: "Health checks must remove failed instances automatically", n: "Manual failover is not high availability." },
           { s: "Test failover regularly", n: "Untested failover fails when it matters." },
           "Every nine costs roughly ten times more — decide what the downtime is genuinely worth"] }
},

"Disaster Recovery": {
 ex: { h: "The backup nobody had ever restored",
       b: "Backups ran nightly and reported success for two years. When they were finally needed, the restore failed — the schema had changed and nobody had tested the path. An untested backup is not a backup; it is a hope with a cron entry." },
 fl: { t: "Building a plan that works",
       s: ["Agree RPO and RTO with the business",
           { s: "How much data may be lost, and how long recovery may take", n: "These two numbers determine the entire architecture and its cost." },
           { s: "Back up across regions and accounts", n: "A backup in the same account an attacker compromised is not a backup." },
           { q: "Has a full restore been performed recently?",
             y: "You have disaster recovery",
             n: "You have backups, which is a different and weaker thing" },
           { s: "Document the runbook for people under pressure", n: "Assume the person who built it is unreachable." },
           "Test annually at minimum, and after any major architectural change"] }
},

"IaaS, PaaS and SaaS": {
 ex: { h: "How much of the stack do you want to run?",
       b: "IaaS gives you a virtual machine and you manage everything above it. PaaS takes the runtime and the scaling. SaaS is finished software you configure. Each step trades control for less operational work — and the honest question is whether your team wants to be in the OS-patching business." },
 fl: { t: "Choosing a level",
       s: ["Decide what is genuinely differentiating for you",
           { q: "Is running the platform part of your value?",
             y: "IaaS — full control, and you own patching, scaling and availability",
             n: "PaaS or serverless — less control, dramatically less operational burden" },
           { s: "Managed databases are almost always the right call", n: "Backups, failover and patching are solved problems you should buy." },
           { s: "SaaS for anything not core to the business", n: "Email, chat, CI — do not run these yourself." },
           "The higher the level, the more lock-in — price the exit as well as the entry"] }
},

"Cloud Region": {
 ex: { h: "Geography with legal and latency consequences",
       b: "Choosing a region decides your latency to users, your compliance posture, and — surprisingly often — your bill, since prices differ meaningfully between them. It also decides your blast radius: a region is the largest failure domain most architectures ever plan for." },
 fl: { t: "Choosing where to run",
       s: [{ s: "A region is a physical place — a cluster of data centres in one part of the world", n: "Your code runs on actual machines somewhere, and where that somewhere is has consequences." },
           { s: "Start with where your users are, because distance costs time you cannot buy back", n: "London to Sydney is roughly a quarter of a second for a round trip, at the speed of light. No amount of money improves it." },
           { q: "Are you legally required to keep the data in a particular country?",
             y: "Then that decides it outright — and it applies to your backups too, which people forget until an audit finds them elsewhere",
             n: "Otherwise weigh cost, which service you need, and how close it is to your users. Prices differ noticeably between regions" },
           { s: "Not every service exists in every region", n: "New features usually appear in the largest regions first and arrive elsewhere months later." },
           { s: "Within a region, spread across separate buildings", n: "They are far enough apart to fail independently and close enough that talking between them is fast. Using only one is how a single power failure takes you offline." }] }
},

"Availability Zone": {
 ex: { h: "Separate buildings, one metro area",
       b: "Distinct power, cooling and network, close enough for low-latency synchronous replication. Spreading across three AZs is the cheapest meaningful resilience available in the cloud — and the most common architectural mistake is running everything in one by accident." },
 fl: { t: "Using them properly",
       s: ["Deploy instances across at least two, ideally three",
           { s: "A load balancer distributes across them", n: "Regional services do this by default; instances do not." },
           { q: "Can the remaining zones carry full load?",
             y: "Genuinely AZ-redundant",
             n: "You have spread the load, not the resilience — size for n−1" },
           { s: "Databases need a standby in another zone", n: "With automatic failover, tested." },
           { s: "Cross-AZ traffic is charged", n: "Cheaper than cross-region, and not free." },
           "Check where your data actually lives — an AZ-pinned volume undoes the whole design"] }
},

"Virtual Private Cloud": {
 ex: { h: "Your own network inside someone else's data centre",
       b: "Address ranges, subnets, route tables and security groups — the same concepts as a physical network, defined in software. The mistake that recurs is putting databases in a public subnet, which works perfectly and is one misconfigured security group from a breach." },
 fl: { t: "Laying out a VPC",
       s: ["Choose an address range that will not collide with anything",
           { s: "Including future VPN peers and acquisitions", n: "Overlapping ranges are painful to fix later." },
           { s: "Public subnets for load balancers only", n: "Anything with a route to the internet gateway is public." },
           { q: "Does this resource need inbound internet access?",
             y: "Public subnet, tightly scoped security group",
             n: "Private subnet — outbound via NAT if it needs to reach out" },
           { s: "Security groups are stateful allow-lists", n: "Reference other groups rather than IP ranges." },
           "Enable flow logs before you need them — they are the only record of what talked to what"] }
},

"FinOps": {
 ex: { h: "The forgotten test cluster that cost £40,000",
       b: "Cloud spending is decentralised by design — any engineer can create expensive resources — so cost control has to be a feedback loop rather than a procurement gate. The single highest-return action is tagging, because untagged spend cannot be attributed and therefore cannot be reduced." },
 fl: { t: "Getting cloud costs under control",
       s: ["Enforce tagging at creation — owner, environment, service",
           { s: "Untagged resources should be blocked or auto-deleted in non-production", n: "Otherwise attribution is guesswork." },
           { s: "Show each team their own spend, weekly", n: "Visibility changes behaviour more than policy does." },
           { q: "Is the workload steady and predictable?",
             y: "Commit — reserved capacity or savings plans, typically 30–70% cheaper",
             n: "Spot instances for interruptible work; autoscale the rest" },
           { s: "Storage lifecycle rules and idle resource cleanup", n: "The unglamorous savings are the reliable ones." },
           "Optimise the biggest line item first — most cloud bills are dominated by two or three services"] }
},

"GitHub Actions": {
 ex: { h: "CI that lives next to the code",
       b: "A YAML file in `.github/workflows` and every push builds. The convenience is real and so are two risks: third-party actions run with access to your repository and secrets, and `pull_request_target` on a fork's PR is a well-documented route to credential theft." },
 fl: { t: "A workflow, and how to keep it safe",
       s: ["A trigger fires — push, PR, schedule or manual",
           { s: "Jobs run on runners, steps run in order", n: "Jobs are parallel by default; use `needs` to sequence them." },
           { q: "Using a third-party action?",
             y: "Pin it to a full commit SHA, not a tag — tags can be moved",
             n: "Prefer first-party actions and plain shell commands" },
           { s: "Scope permissions per workflow", n: "Default to read-only and grant write explicitly." },
           { s: "Cache dependencies between runs", n: "Usually the largest single speed-up available." },
           "Never expose secrets to workflows triggered by forked pull requests"] }
},

"Jenkins": {
 ex: { h: "The build server that runs half the world's enterprises",
       b: "Endlessly extensible, self-hosted, and older than most of its alternatives — which means it can do anything, and also that it becomes a critical, snowflake machine with 90 plugins that nobody dares upgrade. Jenkinsfile-as-code is what makes it manageable." },
 fl: { t: "Keeping it maintainable",
       s: ["Define pipelines as `Jenkinsfile` in each repository",
           { s: "Not clicked together in the UI", n: "UI-configured jobs are unreviewable and unrecoverable." },
           { s: "Keep the controller free of build work", n: "Builds run on agents; the controller orchestrates." },
           { q: "Do builds depend on tools installed on the agent?",
             y: "Containerise the build — otherwise the agent is a snowflake",
             n: "Agents stay disposable" },
           { s: "Manage plugins deliberately", n: "Plugin sprawl is the usual cause of an unupgradeable Jenkins." },
           "Back up the controller configuration — and test restoring it"] }
},

"Environment": {
 ex: { h: "*It worked in staging*",
       b: "Staging had one instance, no traffic and a copy of last month's data; production has forty instances, real load and real data volumes. Environments diverge quietly, and every divergence is a class of bug that only ever appears in production." },
 fl: { t: "Keeping environments honest",
       s: ["Provision every environment from the same code",
           { s: "Different values, identical structure", n: "Divergence starts the moment one is hand-edited." },
           { q: "Is production the only environment with real data volume?",
             y: "Performance problems are undetectable before release — load-test with realistic data",
             n: "Anonymise production-shaped data for lower environments" },
           { s: "Never use production data unmasked in a lower environment", n: "It is a breach waiting for an audit." },
           { s: "Configuration comes from the environment, never from the artefact", n: "One build, many environments." },
           "Fewer environments, kept genuinely similar, beat five that all drift"] }
},

"Site Reliability Engineering": {
 ex: { h: "Operations, treated as a software problem",
       b: "Google's framing: if a task is manual and repeated, automate it — and cap the time engineers spend on toil so there is always room to. The error budget is the other half, turning *how reliable should this be* from an argument into an agreed number." },
 fl: { t: "The core practices",
       s: ["Define SLIs and SLOs from the user's experience",
           { s: "The error budget follows directly from the SLO", n: "And it governs release pace." },
           { q: "Is the budget exhausted?",
             y: "Reliability work takes priority over features — agreed in advance, not debated now",
             n: "Ship, and spend the budget deliberately" },
           { s: "Cap toil — repetitive manual operational work", n: "Google's convention is 50%; the number matters less than the cap existing." },
           { s: "Blameless postmortems for every significant incident", n: "With owned, dated action items." },
           "SRE is not a rename for the ops team — without the error budget authority, it is just a new job title"] }
},

"Build Tool": {
 ex: { h: "Reproducible, or it is not a build",
       b: "Maven, Gradle, Bazel, Make, npm — they compile, test and package. The property that separates a good build from a bad one is reproducibility: the same source producing the same artefact, on your machine and on CI, today and in a year." },
 fl: { t: "What a build has to do",
       s: ["Resolve dependencies from a lockfile",
           { s: "Version ranges make builds non-reproducible", n: "A transitive dependency updates and your build changes without a commit." },
           { s: "Compile and run tests as part of the build", n: "A build that skips tests is just a compile." },
           { q: "Is the build slow?",
             y: "Cache dependencies and build incrementally — cold builds on every CI run waste hours",
             n: "Produce one versioned artefact" },
           { s: "The build must not need network access to succeed twice", n: "Vendor or cache what it needs." },
           "If CI and local builds differ, containerise the build so both use the same environment"] }
},

"npm": {
 ex: { h: "The registry the whole ecosystem leans on",
       b: "One command pulls in a tree of hundreds of transitive dependencies from strangers, and that convenience is also the supply-chain risk — `left-pad`, `event-stream` and the typosquats that follow every popular package. `npm ci` with a committed lockfile is the minimum discipline." },
 fl: { t: "Installing dependencies safely",
       s: ["`package.json` declares direct dependencies with ranges",
           { s: "`package-lock.json` pins the entire resolved tree", n: "Commit it — always." },
           { q: "Installing in CI?",
             y: "`npm ci` — installs exactly the lockfile and fails if they disagree",
             n: "`npm install` may update the lockfile, which is fine locally" },
           { s: "Audit for known vulnerabilities in the pipeline", n: "And treat the findings as work, not noise." },
           { s: "Postinstall scripts run arbitrary code at install time", n: "Which is precisely how supply-chain attacks execute." },
           "Check the package name character by character — typosquatting is the most successful attack here"] }
},
"Cloud Computing": {
 ex: { h: "The capacity guess nobody has to make any more",
       b: "In 2005 launching a product meant buying servers months ahead against a demand nobody could predict — too few and you fell over on launch day, too many and you had bought hardware to sit idle for three years. Renting by the second removed the guess, which is why a student in Pune can now put a GPU behind an API for an afternoon and switch it off." },
 fl: { t: "What renting instead of owning actually changes",
       s: ["Capacity becomes an API call rather than a purchase order",
           { s: "Capital expenditure becomes operating expenditure", n: "Which is why finance now has an opinion about your architecture." },
           { q: "Is the workload steady at full utilisation, all year?",
             y: "Owned or reserved hardware is genuinely cheaper — the cloud premium is real",
             n: "Rent it. Spiky, occasional and growing workloads are what this is for" },
           { s: "The bill becomes a live engineering signal", n: "An unwatched cloud account is an unbounded one — budgets and tags before resources." },
           "Portability is the hedge: a container runs anywhere, a managed proprietary service does not"] }
},

"Durability": {
 ex: { h: "Eleven nines, and the delete you typed yourself",
       b: "Object stores quote 99.999999999% annual durability, achieved by writing every object across several devices in separate failure domains and re-verifying checksums forever. It is an extraordinary number and it says nothing whatsoever about the afternoon somebody runs a recursive delete against the wrong prefix — which is the failure that actually happens." },
 fl: { t: "Deciding what you are protected against",
       s: ["Durability answers *will the bytes survive*; availability answers *can I read them now*",
           { s: "Redundancy across failure domains handles hardware", n: "Disks, racks and whole data centres are what the nines are about." },
           { q: "Could a bad deploy or a wrong command overwrite this?",
             y: "Turn on versioning, and expire noncurrent versions on a schedule",
             n: "Check again — the answer is almost always yes" },
           { s: "Object Lock makes objects immutable for a retention period", n: "The defence against ransomware and against yourself." },
           "Then restore one, from the backup, today — an untested backup is a hypothesis"] }
},

"Configuration Drift": {
 ex: { h: "The security group somebody fixed at 2am",
       b: "During an incident an engineer opens a port in the console to restore service, and it works, and nobody writes it down. Six months later staging behaves differently from production for reasons nobody can reconstruct, and the environment can no longer be rebuilt from what is in the repository. Every step of that was individually reasonable." },
 fl: { t: "How drift is caught rather than prevented",
       s: ["Declared configuration lives in version control",
           { s: "The next plan proposes reverting the manual change", n: "That unexpected diff is the tool reporting drift, not a bug." },
           { q: "Was the manual change correct?",
             y: "Put it in the configuration, then apply — the code becomes true again",
             n: "Apply and let the tool revert it" },
           { s: "Run drift detection on a schedule", n: "Drift found six months later is an archaeology project." },
           "Immutable infrastructure removes the surface entirely — replace the server, never adjust it"] }
},

"Content-Addressable Storage": {
 ex: { h: "Re-ingesting a corpus for the price of the edits",
       b: "A document pipeline that keys chunks by content hash pays to embed only what changed. Edit one paragraph of a two-hundred-page report and two chunks are re-embedded rather than eight hundred — so ingestion cost scales with how much people edit rather than with how much you store, which is the difference between a bill that grows and one that does not." },
 fl: { t: "What falls out of hashing the content",
       s: ["The address is computed from the bytes, not chosen",
           { s: "Identical content therefore stores exactly once", n: "Deduplication is a property of the scheme, not a job you run." },
           { q: "Has this object been ingested before?",
             y: "The write is a no-op — re-running the pipeline is safe",
             n: "Store it under its hash" },
           { s: "Re-hashing verifies integrity for free", n: "Which is why Git history cannot be silently rewritten." },
           "Keep the human filename in metadata — a hash is a good key and a terrible label"] }
}

});
