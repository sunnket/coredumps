/* Career Roadmap — Infrastructure, Cloud, Security and Quality roles.
   Rarely a first job. Consistently well paid once you are two years in. */

TD.addRoles("infra", [

  /* ==================================================================== */
  {
    id: "devops-engineer",
    t: "DevOps / Cloud Engineer",
    a: "Platform Engineer · Cloud Infrastructure Engineer",
    icon: "cloud",
    tag: "Hard to automate away",
    demand: "hot",
    deck: "You build the road that code travels on — deployment pipelines, cloud infrastructure, and the automation that lets a team ship twenty times a day instead of twice a month.",

    what: [
      "DevOps is not a tool and it was never meant to be a job title, but the market decided otherwise. In practice you own how software gets from a developer's laptop to production, and how it behaves once it is there.",
      "The work is infrastructure as code, CI/CD pipelines, containers and orchestration, cloud architecture, monitoring, cost management and security posture. Increasingly the title 'platform engineer' is used for the same work done with more product thinking.",
      "It is one of the most durable roles in tech. Every company that ships software needs this, the skills transfer completely across industries, and the tooling — while it changes — sits on foundations (Linux, networking, distributed systems) that have not changed in decades.",
      "It hires freshers only occasionally. The usual and better route is one to two years of development experience first, because it is difficult to build good developer tooling if you have never been the developer."
    ],

    day: [
      { t: "8:30", d: "An alert overnight. A certificate expired on an internal service. You fix it in ten minutes and then spend two hours automating renewal so it never happens again — that second part is the actual job." },
      { t: "11:00", d: "Terraform work: bring a manually created environment under code so it can be reviewed, reproduced and destroyed safely." },
      { t: "14:00", d: "Cut the CI pipeline from eighteen minutes to five. Every engineer on the team gets that time back on every push." },
      { t: "16:00", d: "Cloud cost review. Untagged resources, oversized instances, forgotten load balancers. You remove a substantial monthly line item." }
    ],

    fit: {
      love: [
        "Automating a task you resent doing gives you genuine satisfaction.",
        "You like making other engineers faster.",
        "You are calm during incidents.",
        "Systems and how they fit together interest you more than features."
      ],
      avoid: [
        "You want to build user-facing products.",
        "On-call is a deal-breaker.",
        "You want credit; good infrastructure is invisible by definition."
      ]
    },

    skills: [
      {
        g: "Foundation",
        note: "Learn these in order. Skipping Linux and networking to reach Kubernetes is the single most common mistake in this path, and it produces engineers who can copy manifests and cannot debug.",
        items: [
          { n: "Linux", lvl: "must", d: "Processes, permissions, systemd, file systems, logs, performance tools. Everything runs on this.", track: "linux" },
          { n: "Networking", lvl: "must", d: "TCP/IP, DNS, HTTP, TLS, load balancing, subnets, firewalls. Most 'mysterious' production problems are networking problems.", track: "networking" },
          { n: "Scripting", lvl: "must", d: "Bash and Python. You automate in these daily.", track: "python" },
          { n: "Git", lvl: "must", d: "Everything, including infrastructure, is versioned.", track: "git" },
          { n: "How software is built", lvl: "should", d: "Enough development experience to understand what you are deploying and why builds fail." }
        ]
      },
      {
        g: "The stack",
        items: [
          { n: "Docker", lvl: "must", d: "Images, layers, multi-stage builds, networking, volumes. The unit of deployment.", track: "docker" },
          { n: "One cloud, thoroughly", lvl: "must", d: "AWS is the volume employer in India. Compute, storage, networking, IAM, managed services. Certification is genuinely useful here, unusually.", track: "cloud" },
          { n: "CI/CD", lvl: "must", d: "GitHub Actions, GitLab CI or Jenkins. Build, test, deploy, roll back.", track: "cicd" },
          { n: "Infrastructure as code", lvl: "must", d: "Terraform above all. Infrastructure that is reviewed, versioned and reproducible.", track: "terraform" },
          { n: "Kubernetes", lvl: "must", d: "The industry default. Deployments, services, ingress, autoscaling, RBAC, debugging a pod that will not start.", track: "k8s" },
          { n: "Observability", lvl: "must", d: "Prometheus, Grafana, logs, traces, alerting that does not cry wolf.", track: "observability" },
          { n: "Configuration management", lvl: "should", d: "Ansible, Helm. Repeatable configuration at scale." },
          { n: "Security practice", lvl: "must", d: "Secrets management, least privilege, image scanning, supply chain. Increasingly a formal requirement.", track: "appsec" },
          { n: "Cost engineering", lvl: "should", d: "Right-sizing, spot instances, tagging, reserved capacity. A directly measurable contribution." }
        ]
      }
    ],

    stack: ["Linux", "Docker", "Kubernetes", "Terraform", "AWS / Azure / GCP", "GitHub Actions", "Prometheus + Grafana", "Ansible", "Helm", "ArgoCD", "Vault", "Python + Bash"],

    edge: [
      { t: "Quantify developer time saved", d: "'Cut deploy time from 40 minutes to 6, across 30 engineers' is a number with a rupee value attached. Infrastructure work is invisible unless you make it countable — so make it countable." },
      { t: "Own the cloud bill", d: "Cloud spend is one of the largest and least-understood costs in most companies. An engineer who reduces it 40% without degrading anything has produced a result that reaches the CFO." },
      { t: "Treat the platform as a product", d: "Golden paths, good defaults, real documentation, clear errors. Platform engineers who think about developer experience get adopted; those who build technically correct but hostile tooling get bypassed." },
      { t: "Get seriously good at debugging", d: "The defining skill. When production is down and nobody knows why, the person who methodically narrows it down is worth the entire team's salary that hour — and everyone remembers who it was." },
      { t: "Add security depth", d: "DevSecOps is where this role is heading and where the premium is. It is also the direction regulation is pushing every company in." }
    ],

    ladder: [
      { t: "DevOps Engineer I", y: "0–2 yrs", pay: "₹4–20 LPA", d: "Pipeline maintenance, scripting, supporting existing infrastructure." },
      { t: "DevOps Engineer II", y: "2–5 yrs", pay: "₹14–40 LPA", d: "You own environments and design pipelines." },
      { t: "Senior DevOps / Platform Engineer", y: "5–8 yrs", pay: "₹30–70 LPA", d: "Architecture, standards, cost and reliability ownership." },
      { t: "Staff / Principal / Head of Platform", y: "8+ yrs", pay: "₹60–160 LPA", d: "Infrastructure strategy across the organisation." }
    ],

    pay: {
      bands: [
        { k: "Fresher", y: "0–1 yr", lo: 4, mid: 9, hi: 20, note: "Genuinely uncommon as a first job. Most people enter after a year or two of development or support work — and that route is faster overall than waiting for a fresher DevOps opening." },
        { k: "Early", y: "1–3 yrs", lo: 9, mid: 19, hi: 38, note: "Kubernetes plus Terraform is the combination that moves you up this band decisively." },
        { k: "Mid", y: "3–6 yrs", lo: 19, mid: 38, hi: 70, note: "" },
        { k: "Senior", y: "6–10 yrs", lo: 34, mid: 65, hi: 125, note: "" },
        { k: "Staff+", y: "10+ yrs", lo: 60, mid: 110, hi: 220, note: "" }
      ],
      notes: [
        "One of the strongest demand-to-supply ratios in Indian tech, and unusually resistant to automation — because automation is what the role produces.",
        "Cloud certifications matter more here than in any other role on this site. An AWS Solutions Architect Associate genuinely helps a resume clear screening."
      ]
    },

    cos: [
      { tier: "Cloud-native product companies", pay: "₹14–30 LPA at entry", d: "Modern infrastructure and real scale.", names: ["Flipkart", "Swiggy", "Razorpay", "PhonePe", "Meesho", "Zomato", "Postman", "Hasura", "Zeta"] },
      { tier: "Cloud providers and vendors", pay: "₹18–40 LPA at entry", d: "Building the platforms everyone else uses.", names: ["AWS", "Microsoft Azure", "Google Cloud", "HashiCorp", "Red Hat", "VMware", "Databricks", "Nutanix"] },
      { tier: "GCCs and BFSI", pay: "₹9–22 LPA at entry", d: "Large estates, strong governance, very good stability.", names: ["Walmart Global Tech", "JPMorgan Chase", "Goldman Sachs", "Wells Fargo", "American Express", "HSBC", "Optum", "Target"] },
      { tier: "Services and managed cloud", pay: "₹3.5–10 LPA at entry", d: "The most realistic fresher entry point into this field. Broad tool exposure quickly.", names: ["TCS", "Infosys", "Wipro", "Accenture", "HCLTech", "Rackspace", "Cognizant", "Capgemini"] }
    ],

    hire: [
      { t: "Linux and troubleshooting", d: "'A service is slow. Walk me through diagnosing it.'", tip: "Have a systematic method and narrate it: is it CPU, memory, disk, network, or the application? Structure is what is being graded." },
      { t: "Cloud round", d: "VPCs, IAM, storage classes, high availability design.", tip: "IAM and networking are where candidates are weakest. Prepare them specifically." },
      { t: "Kubernetes", d: "Pod scheduling, services, why a deployment is failing.", tip: "Run a real cluster. Break it deliberately. Fix it. That experience is audible in an interview." },
      { t: "Scripting", d: "Bash and Python automation tasks.", tip: "Handle errors and edge cases; they are watching for production instincts, not clever one-liners." },
      { t: "Infrastructure design", d: "'Design a highly available deployment for this application.'", tip: "Cover monitoring, rollback and cost unprompted — the three things most candidates forget." }
    ],

    proof: [
      { t: "A fully automated deployment for a real app", d: "Push to main triggers build, test, containerise and deploy with zero downtime and a working rollback. All infrastructure in Terraform.", why: "It is the entire job in one repository, and it is fully verifiable by a stranger." },
      { t: "A home lab or personal cluster", d: "Run Kubernetes on cheap hardware or a small cloud budget. Break it. Document what you learned.", why: "Real operational experience is what separates candidates who have read about this from ones who have done it." },
      { t: "A monitoring and alerting setup", d: "Prometheus and Grafana on your own services, with alerts that fire on genuine problems and stay silent otherwise.", why: "Alert design is a mature skill and rare in juniors." },
      { t: "A cost optimisation write-up", d: "Take a cloud setup, reduce its cost substantially, document the reasoning.", why: "Directly demonstrates the commercial value of the role." }
    ],

    plan: [
      { n: "Linux, properly", d: "Do not rush this. It is the substrate for everything that follows.", track: "linux", mo: "Months 1–3" },
      { n: "Networking", d: "DNS, TCP, TLS, load balancing. The other half of the substrate.", track: "networking", mo: "Months 2–4" },
      { n: "Bash and Python scripting", d: "Automation is the job.", track: "python", mo: "Months 3–5" },
      { n: "Git and CI/CD", d: "Pipelines follow naturally from version control.", track: "git", mo: "Month 4" },
      { n: "Docker", d: "Containers before orchestration. Always in that order.", track: "docker", mo: "Months 5–6" },
      { n: "One cloud, with a certification", d: "AWS for the Indian market. The certification genuinely helps here.", track: "cloud", mo: "Months 6–8" },
      { n: "Terraform", d: "Infrastructure that can be reviewed like code.", track: "terraform", mo: "Months 8–9" },
      { n: "Kubernetes", d: "The largest single investment. Take your time.", track: "k8s", mo: "Months 9–12" },
      { n: "Observability", d: "Metrics, logs, traces, sane alerting.", track: "observability", mo: "Months 12–13" },
      { n: "Build the portfolio, then hunt", d: "One fully automated project plus a home lab.", track: "hunt", mo: "Months 13–16" }
    ],

    myths: [
      { m: "I can start with Kubernetes and learn Linux later.", r: "You will be able to copy manifests and unable to debug anything. Every experienced platform engineer will tell you the same thing: Linux and networking first, and it is not close." },
      { m: "Certifications are worthless.", r: "Broadly true in software engineering, and specifically false here. Cloud certifications clear resume screens in infrastructure hiring and are frequently required for partner-status reasons at services companies." },
      { m: "DevOps means I do not write code.", r: "You write a great deal of code — Terraform, pipelines, operators, automation. It simply is not application code." }
    ],

    next: ["sre", "mlops-engineer", "security-engineer", "backend-engineer"],
    r: ["Kubernetes", "Docker", "CI/CD", "Infrastructure as Code", "Load Balancer", "DNS", "Containerization"]
  },

  /* ==================================================================== */
  {
    id: "sre",
    t: "Site Reliability Engineer",
    a: "SRE · Production Engineer",
    icon: "gauge",
    tag: "For the calm ones",
    demand: "strong",
    deck: "You are accountable for whether the system stays up — with error budgets, incident command, capacity planning, and engineering rather than heroics.",

    what: [
      "SRE is what happened when Google decided reliability should be an engineering discipline with numbers rather than an operations team with pagers. You define what 'reliable enough' means quantitatively, measure it, and spend engineering effort to close the gap.",
      "The distinguishing ideas are service level objectives and error budgets: you agree the system may be unavailable for a defined amount of time, and when that budget is spent, feature work stops until reliability is restored. That single mechanism converts an argument into a policy.",
      "It overlaps DevOps heavily and differs in emphasis. DevOps optimises for delivery speed; SRE optimises for reliability, and the tension between them is deliberate and productive.",
      "This is a senior-leaning role. It requires production judgement that is genuinely difficult to acquire without having been in production incidents, so plan on entering it after development or infrastructure experience."
    ],

    day: [
      { t: "9:00", d: "Review last night's alerts. Two were noise; you delete them, because alert fatigue is the most dangerous failure mode in this job." },
      { t: "10:30", d: "Write the postmortem for Tuesday's incident. Blameless, specific, with action items that have owners and dates." },
      { t: "13:00", d: "Capacity planning. Traffic grows 8% monthly; you work out when the current architecture stops working and start the conversation four months early." },
      { t: "15:30", d: "Reduce toil. Automate a recurring manual task the on-call engineer performs weekly." },
      { t: "17:00", d: "A game day: deliberately break a dependency in staging and confirm the system degrades the way the design claims it will." }
    ],

    fit: {
      love: [
        "You are genuinely calm when things are on fire.",
        "You think in probabilities and systems rather than absolutes.",
        "You prefer preventing problems to shipping features.",
        "Postmortems interest you rather than depress you."
      ],
      avoid: [
        "On-call and night pages are unacceptable to you.",
        "You want feature ownership and visible product work.",
        "High-stakes ambiguity raises your stress rather than your focus."
      ]
    },

    skills: [
      {
        g: "Foundation",
        items: [
          { n: "Strong software engineering", lvl: "must", d: "SRE is an engineering role. You write tooling, automation and sometimes production code.", track: "python" },
          { n: "Linux internals", lvl: "must", d: "Deeper than DevOps requires — memory, scheduling, file descriptors, kernel-level diagnosis.", track: "linux" },
          { n: "Networking", lvl: "must", d: "Deep. A large share of production incidents are network incidents.", track: "networking" },
          { n: "Distributed systems", lvl: "must", d: "Consistency, partitions, cascading failure, retry storms, back-pressure. The theory that explains your outages.", track: "sysdesign" }
        ]
      },
      {
        g: "The discipline",
        items: [
          { n: "SLIs, SLOs and error budgets", lvl: "must", d: "The defining framework. Be able to define a good SLI for a service you have never seen.", term: "Service Level Objective" },
          { n: "Incident command", lvl: "must", d: "Running an incident: roles, communication, mitigation before diagnosis. A learnable, high-value skill." },
          { n: "Observability", lvl: "must", d: "Metrics, logs, traces, and designing for debuggability before the incident happens.", track: "observability" },
          { n: "Capacity planning", lvl: "should", d: "Load testing, growth modelling, headroom." },
          { n: "Chaos engineering", lvl: "should", d: "Deliberately injecting failure to verify the system behaves as designed." },
          { n: "Kubernetes and cloud", lvl: "must", d: "The environment you operate.", track: "k8s" },
          { n: "Postmortem culture", lvl: "must", d: "Blameless analysis that produces real change rather than a document nobody reads." }
        ]
      }
    ],

    stack: ["Kubernetes", "Prometheus + Grafana", "OpenTelemetry", "PagerDuty", "Terraform", "Go / Python", "Chaos Mesh", "Datadog", "Grafana Loki", "Envoy"],

    edge: [
      { t: "Reduce toil relentlessly", d: "Google's own definition of a healthy SRE team is one spending under half its time on operations. Engineers who systematically automate their own manual work create compounding capacity and are promoted for it." },
      { t: "Write postmortems people actually read", d: "A clear, honest, specific incident analysis is one of the highest-leverage documents in engineering. It teaches the whole organisation something at the price of one outage." },
      { t: "Design alerts that mean something", d: "Most teams' alerting is noise, and noise gets outages missed. Fixing that is unglamorous, difficult and enormously valuable." },
      { t: "Be the calm one", d: "During a major incident the person who stays methodical becomes the de facto leader regardless of title. This is a real, trainable skill and it defines careers in this role." }
    ],

    ladder: [
      { t: "SRE I", y: "1–3 yrs", pay: "₹8–26 LPA", d: "Usually entered from development or infrastructure work." },
      { t: "SRE II", y: "3–6 yrs", pay: "₹20–48 LPA", d: "You own the reliability of a service and its SLOs." },
      { t: "Senior SRE", y: "6–9 yrs", pay: "₹38–85 LPA", d: "Architecture for reliability, incident leadership, mentoring." },
      { t: "Staff / Principal SRE", y: "9+ yrs", pay: "₹70–180 LPA", d: "Reliability standards across the organisation." }
    ],

    pay: {
      bands: [
        { k: "Fresher", y: "0–1 yr", lo: 5, mid: 11, hi: 22, note: "Rare directly. A few large companies run SRE graduate programmes; otherwise enter through backend or DevOps and move across at the two-year mark." },
        { k: "Early", y: "1–3 yrs", lo: 11, mid: 22, hi: 42, note: "" },
        { k: "Mid", y: "3–6 yrs", lo: 22, mid: 42, hi: 78, note: "" },
        { k: "Senior", y: "6–10 yrs", lo: 38, mid: 72, hi: 135, note: "" },
        { k: "Staff+", y: "10+ yrs", lo: 65, mid: 125, hi: 250, note: "" }
      ],
      notes: [
        "Typically pays 10–20% above equivalent DevOps roles, partly for the depth required and partly as compensation for on-call responsibility.",
        "Check on-call terms explicitly before accepting. Rotation frequency and compensation vary enormously and materially affect your quality of life."
      ]
    },

    cos: [
      { tier: "Large-scale product companies", pay: "₹18–40 LPA at entry", d: "Where reliability engineering is a mature, respected discipline.", names: ["Google", "Microsoft", "Amazon", "Uber", "LinkedIn", "Flipkart", "Swiggy", "PhonePe", "Razorpay"] },
      { tier: "Financial services", pay: "₹14–35 LPA at entry", d: "Downtime has an immediate, calculable cost, so reliability is funded properly.", names: ["Goldman Sachs", "JPMorgan Chase", "Wells Fargo", "American Express", "Visa", "Mastercard", "NPCI", "Zerodha"] },
      { tier: "Infrastructure companies", pay: "₹18–45 LPA at entry", d: "Reliability is the product.", names: ["AWS", "Cloudflare", "Datadog", "PagerDuty", "Confluent", "MongoDB"] }
    ],

    hire: [
      { t: "Troubleshooting round", d: "'The site is down. Go.' Live, unstructured, deliberately stressful.", tip: "Mitigate first, diagnose second. Restoring service before understanding the cause is correct, and saying so scores highly." },
      { t: "Systems depth", d: "Linux internals, networking, distributed failure modes.", tip: "Understand cascading failure and retry storms; they come up constantly." },
      { t: "Coding", d: "Real automation code, sometimes DSA.", tip: "SRE interviews expect genuine engineering ability, not just operations knowledge." },
      { t: "Reliability design", d: "'Design monitoring and SLOs for this service.'", tip: "Define the SLI in terms of user experience, not server metrics. That distinction is the entire discipline." },
      { t: "Incident behaviour", d: "Tell me about an outage you handled.", tip: "Have a real story with a timeline, your specific actions and what you changed afterwards." }
    ],

    proof: [
      { t: "A service with real SLOs", d: "Deploy something, define its SLIs, implement error budget tracking, and show a month of data.",  why: "Almost no candidate below senior level has done this, and it demonstrates the actual framework." },
      { t: "A chaos engineering experiment", d: "Break a dependency deliberately, document how the system behaved against how you predicted it would." },
      { t: "A written postmortem", d: "For any incident, including one in a personal project. Blameless, specific, with real action items.", why: "It shows you can turn a failure into organisational learning — the core cultural skill of SRE." }
    ],

    plan: [
      { n: "Software engineering first", d: "SRE is engineering. Backend or infrastructure experience is the prerequisite, not an optional extra.", href: "#/role/backend-engineer", kind: "role", mo: "Years 1–2" },
      { n: "Linux internals", d: "Deeper than most roles require.", track: "linux", mo: "Months 6–10" },
      { n: "Networking, deeply", d: "Most incidents live here.", track: "networking", mo: "Months 8–11" },
      { n: "Distributed systems", d: "The theory that explains production behaviour.", track: "sysdesign", mo: "Months 10–14" },
      { n: "Kubernetes and cloud", d: "The operating environment.", track: "k8s", mo: "Months 12–15" },
      { n: "Observability and SLOs", d: "The instrumentation and the framework.", track: "observability", mo: "Months 15–17" },
      { n: "Move into the role", d: "Usually an internal transfer from a development or platform team.", track: "hunt", mo: "Year 2–3" }
    ],

    myths: [
      { m: "SRE is just DevOps with a nicer title.", r: "There is overlap, and the framework is different. Error budgets, SLOs and an explicit reliability mandate change what you optimise for and what you are allowed to block." },
      { m: "SRE means being on call constantly.", r: "A well-run SRE team caps operational load at around 50% and treats excessive paging as a bug to be fixed. A team that pages you nightly is badly run — and you should ask about this in the interview." }
    ],

    next: ["devops-engineer", "backend-engineer", "mlops-engineer"],
    r: ["Service Level Objective", "Observability", "Circuit Breaker", "Chaos Engineering", "Postmortem", "Load Balancer"]
  },

  /* ==================================================================== */
  {
    id: "security-engineer",
    t: "Security Engineer",
    a: "AppSec Engineer · Cloud Security Engineer · Offensive Security",
    icon: "shield",
    tag: "Recession-resistant",
    demand: "hot",
    deck: "You find the ways a system can be abused before someone else does — in code, in cloud configuration, in identity, and increasingly in AI systems.",

    what: [
      "Security splits into several distinct careers that share a mindset. **Application security** reviews code and designs, builds secure defaults and runs the secure development lifecycle. **Cloud security** owns identity, configuration and posture. **Offensive security** attacks systems with permission and reports what it found. **Detection and response** runs the security operations centre and handles incidents. **GRC** handles governance and compliance, which is less technical and still well paid.",
      "The unifying skill is adversarial thinking — reading a design and immediately seeing how to abuse it. It is trainable, and people who have it naturally are unusually well suited here.",
      "Demand is strong and structurally growing: India's DPDP Act, RBI mandates, global compliance regimes and a rising breach rate all push companies to hire whether or not the market is good. It is among the most recession-resistant roles on this page.",
      "A new specialisation is emerging fast: **AI security** — prompt injection, model supply chain, data leakage through models, agent permissions. Very few people currently combine security and AI expertise, and that gap is a substantial opportunity for anyone entering now."
    ],

    day: [
      { t: "9:30", d: "Triage findings from the automated scanners. Most are false positives; separating signal from noise is a large part of the job." },
      { t: "11:00", d: "Threat model a new feature with its engineering team. Ask what an attacker would do, before the code exists — which is when security is cheap." },
      { t: "14:00", d: "Review a pull request touching authentication. Find an authorisation check missing on one endpoint. This single catch justifies the week." },
      { t: "16:00", d: "Write a secure-by-default library so the whole organisation stops making the same mistake. Scaling yourself is how security teams survive." }
    ],

    fit: {
      love: [
        "You instinctively think about how things could be broken or abused.",
        "You are persistent and enjoy puzzles with no guaranteed solution.",
        "Detail and precision matter to you.",
        "You can deliver bad news to engineers without antagonising them."
      ],
      avoid: [
        "You want to build features rather than examine them.",
        "You find being the person who says no draining.",
        "Continuous learning about new attack classes sounds tiring rather than interesting."
      ]
    },

    skills: [
      {
        g: "Foundation",
        note: "Security without engineering foundations produces someone who runs scanners and cannot interpret them. Build the base first.",
        items: [
          { n: "How software actually works", lvl: "must", d: "You cannot secure what you do not understand. Real programming ability is the entry requirement.", track: "python" },
          { n: "Networking", lvl: "must", d: "TCP/IP, DNS, TLS, HTTP, proxies. The medium of most attacks.", track: "networking" },
          { n: "Linux and Windows internals", lvl: "must", d: "Permissions, processes, authentication mechanisms.", track: "linux" },
          { n: "Cryptography, applied", lvl: "must", d: "Hashing, symmetric and asymmetric encryption, TLS, key management. Applied use, not the mathematics.", term: "Encryption" },
          { n: "Web fundamentals", lvl: "must", d: "Sessions, cookies, CORS, same-origin policy, OAuth and OIDC.", track: "js" }
        ]
      },
      {
        g: "Security proper",
        items: [
          { n: "The OWASP Top 10, deeply", lvl: "must", d: "Injection, broken authentication and authorisation, SSRF, deserialisation. Know how to exploit each and how to fix it.", term: "SQL Injection" },
          { n: "Threat modelling", lvl: "must", d: "STRIDE or similar. Finding flaws in a design before any code exists is the cheapest security there is." },
          { n: "Cloud security", lvl: "must", d: "IAM, least privilege, network isolation, secrets, posture management. Where most modern breaches actually begin.", track: "cloud" },
          { n: "Secure code review", lvl: "must", d: "Reading code adversarially. The core application-security skill." },
          { n: "Penetration testing", lvl: "should", d: "Burp Suite, methodology, reporting. Essential for offensive roles and useful for all of them." },
          { n: "Identity and access", lvl: "must", d: "OAuth, SAML, OIDC, MFA, session management. Identity is the modern perimeter." },
          { n: "Detection and response", lvl: "should", d: "SIEM, log analysis, incident handling, forensics." },
          { n: "Compliance", lvl: "should", d: "India's DPDP Act, ISO 27001, SOC 2, PCI-DSS, GDPR. Unfashionable and it is what funds the team." },
          { n: "AI security", lvl: "edge", d: "Prompt injection, model supply chain, agent permissions, data leakage. Scarce, new, and rising in value quickly." }
        ]
      }
    ],

    stack: ["Burp Suite", "Nmap", "Metasploit", "Semgrep", "Snyk", "Wireshark", "Splunk / Elastic", "HashiCorp Vault", "Prowler / ScoutSuite", "Python", "Kali Linux"],

    edge: [
      { t: "Fix classes of bugs, not bugs", d: "Reporting one SQL injection is useful. Building a query layer that makes SQL injection structurally impossible removes the whole class permanently. Senior security engineers work exclusively at this level." },
      { t: "Be the security person engineers actually like", d: "Security teams that block and lecture get routed around. The engineer who pairs on the fix and explains the risk gets consulted early — which is when security is cheapest and most effective." },
      { t: "Quantify risk in business terms", d: "'This is a critical vulnerability' means little to a manager choosing between it and a feature. 'This exposes 40,000 customer records and is a reportable DPDP breach' is a decision." },
      { t: "Specialise in AI security now", d: "The intersection of security and AI is genuinely thin on people, demand is climbing fast, and the body of knowledge is small enough to learn in months rather than years. This is a rare, clear arbitrage." },
      { t: "Build a public track record", d: "Bug bounties, CVEs, CTF placings, write-ups. Security is unusually meritocratic — verifiable findings outweigh credentials, which makes it friendly to self-taught candidates." }
    ],

    ladder: [
      { t: "Security Analyst / Engineer I", y: "0–2 yrs", pay: "₹4–18 LPA", d: "SOC work, scanning, triage, supporting reviews." },
      { t: "Security Engineer II", y: "2–5 yrs", pay: "₹14–38 LPA", d: "You own an area — application, cloud or detection." },
      { t: "Senior Security Engineer", y: "5–8 yrs", pay: "₹30–70 LPA", d: "Architecture, standards, threat modelling at design time." },
      { t: "Principal / Security Architect", y: "8+ yrs", pay: "₹60–160 LPA", d: "Security strategy; often a direct path toward CISO." }
    ],

    pay: {
      bands: [
        { k: "Fresher", y: "0–1 yr", lo: 4, mid: 9, hi: 20, note: "SOC analyst roles hire freshers in reasonable volume at ₹4–8 and are a legitimate entry point. Application security typically requires development experience first." },
        { k: "Early", y: "1–3 yrs", lo: 9, mid: 19, hi: 36, note: "Certifications carry unusual weight in this field — OSCP in particular changes offers." },
        { k: "Mid", y: "3–6 yrs", lo: 19, mid: 36, hi: 68, note: "" },
        { k: "Senior", y: "6–10 yrs", lo: 32, mid: 62, hi: 120, note: "" },
        { k: "Staff+", y: "10+ yrs", lo: 60, mid: 110, hi: 250, note: "CISO roles at large Indian companies go well beyond this." }
      ],
      notes: [
        "Among the most recession-resistant roles here. Regulatory pressure means security hiring continues through downturns when feature hiring stops.",
        "Certifications matter more than in software engineering. OSCP for offensive work, CISSP for senior and management tracks, cloud security certifications throughout."
      ]
    },

    cos: [
      { tier: "Product companies", pay: "₹12–30 LPA at entry", d: "Building security into the product rather than auditing it afterwards.", names: ["Google", "Microsoft", "Amazon", "Flipkart", "Razorpay", "PhonePe", "CRED", "Zoho", "Freshworks", "Atlassian"] },
      { tier: "Security companies", pay: "₹10–28 LPA at entry", d: "Security as the product. Deepest specialist learning available.", names: ["Palo Alto Networks", "CrowdStrike", "Zscaler", "Qualys", "Cloudflare", "Snyk", "SentinelOne", "Seclore", "Lucideus / SAFE"] },
      { tier: "BFSI and regulated industries", pay: "₹8–24 LPA at entry", d: "Heavy compliance requirements and correspondingly large security teams.", names: ["HDFC Bank", "ICICI Bank", "Goldman Sachs", "JPMorgan Chase", "Wells Fargo", "American Express", "Visa", "NPCI"] },
      { tier: "Consulting and audit", pay: "₹4–14 LPA at entry", d: "The largest fresher intake in security. Broad exposure across many client environments.", names: ["Deloitte", "EY", "PwC", "KPMG", "Accenture", "TCS", "Wipro", "NetSPI", "Payatu"] }
    ],

    hire: [
      { t: "Fundamentals", d: "How TLS works, how sessions work, what CORS actually prevents.", tip: "Be able to explain a TLS handshake and what OAuth does step by step. Both are asked routinely." },
      { t: "Vulnerability round", d: "Explain and exploit SQL injection, XSS, SSRF, IDOR.", tip: "Explain both exploitation and remediation. Candidates who only know the attack read as hobbyists." },
      { t: "Practical / CTF-style", d: "Find vulnerabilities in a provided application.", tip: "Practise on deliberately vulnerable applications until methodology is automatic." },
      { t: "Code review", d: "Read code and find the flaw.", tip: "Follow the data. Untrusted input reaching a dangerous sink is the shape of most findings." },
      { t: "Scenario round", d: "'We have been breached. What do you do?'", tip: "Contain, preserve evidence, then investigate. Order matters and is being marked." }
    ],

    proof: [
      { t: "Bug bounty findings", d: "Even low-severity accepted reports on HackerOne or Bugcrowd.", why: "Verifiable, adversarially validated proof that you can find real issues in real systems." },
      { t: "CTF participation with write-ups", d: "Compete, then explain your solutions publicly.", why: "The standard credential in security, and it demonstrates methodology rather than tool use." },
      { t: "A security review of an open-source project", d: "Threat model it, review the code, report responsibly, publish afterwards.", why: "Mirrors the actual application-security job precisely." },
      { t: "An AI security study", d: "Demonstrate prompt injection against an agent you built, then design and test the mitigations.", why: "Currently a rare and highly differentiating portfolio piece." }
    ],

    plan: [
      { n: "Programming", d: "Python. You cannot secure code you cannot read.", track: "python", mo: "Months 1–3" },
      { n: "Networking", d: "The medium of most attacks.", track: "networking", mo: "Months 3–5" },
      { n: "Linux", d: "Permissions, processes, logs.", track: "linux", mo: "Months 4–6" },
      { n: "Web fundamentals", d: "Sessions, cookies, CORS, authentication flows.", track: "js", mo: "Months 5–7" },
      { n: "Web security and OWASP", d: "Exploit and remediate every item on the Top 10.", track: "appsec", mo: "Months 7–10" },
      { n: "Cloud security", d: "IAM and posture — where modern breaches start.", track: "cloud", mo: "Months 10–12" },
      { n: "CTFs and bug bounties", d: "Start in month eight and never stop. This is the real training.", track: "ctf", mo: "Months 8+, ongoing" },
      { n: "Certification and applications", d: "OSCP for offensive roles; cloud security certifications otherwise.", track: "hunt", mo: "Months 12–16" }
    ],

    myths: [
      { m: "I need to be a hacker genius.", r: "Most security work is methodical review, threat modelling and unglamorous remediation. Persistence and rigour matter far more than brilliance." },
      { m: "Certifications are everything.", r: "They open doors and they do not close deals. A candidate with accepted bug bounty reports and no certification generally outperforms the reverse." },
      { m: "Security is a separate world from engineering.", r: "The best security engineers are engineers first. If you are early in your career, becoming a good developer is a legitimate and often faster route into security." }
    ],

    next: ["devops-engineer", "backend-engineer", "sre"],
    r: ["SQL Injection", "Cross-Site Scripting", "Encryption", "OAuth 2.0", "Zero Trust", "Penetration Testing", "Threat Model"]
  },

  /* ==================================================================== */
  {
    id: "qa-sdet",
    t: "QA / SDET",
    a: "Software Development Engineer in Test · Automation Engineer",
    icon: "check",
    tag: "Underrated entry point",
    demand: "steady",
    deck: "You build the systems that prove software works — automated test suites, frameworks and quality infrastructure that let a team ship confidently.",

    what: [
      "There are two versions and they have very different prospects. **Manual QA** executes test cases by hand; it is the most accessible entry into tech and its ceiling is low and falling. **SDET** builds test automation frameworks and quality tooling; it is a software engineering role and pays like one.",
      "If you enter through manual QA, treat automation as a deadline rather than an ambition. The transition takes six to twelve months of deliberate work and roughly doubles your pay.",
      "The SDET role itself is genuinely interesting: designing test architecture, building frameworks other engineers use, performance and load testing, CI integration and flakiness management. It requires real engineering skill.",
      "It is worth saying plainly that this is one of the easiest doors into the Indian IT industry for someone without a computer science degree — and one of the easiest to get stuck behind if you stop learning after walking through it."
    ],

    day: [
      { t: "9:30", d: "Investigate three failing tests from the nightly run. Two are genuine bugs; one is flakiness, which you fix properly rather than by adding a wait." },
      { t: "11:00", d: "Build test infrastructure — a fixture that makes writing an integration test five lines instead of fifty. Multiplying other engineers' output is the leverage in this role." },
      { t: "14:00", d: "Exploratory testing on a new feature. Automation catches known cases; a human finds the unknown ones, and this hour is where the interesting bugs come from." },
      { t: "16:00", d: "Load testing before a launch. Find the breaking point before customers do." }
    ],

    fit: {
      love: [
        "You are systematically thorough and notice inconsistencies.",
        "Breaking things gives you satisfaction.",
        "You like building tools for other engineers.",
        "You want an accessible entry into tech with a clear route upward."
      ],
      avoid: [
        "You want to build user-facing features.",
        "Repetition frustrates you and you would not automate your way out of it.",
        "You want the highest pay ceiling — engineering roles are higher."
      ]
    },

    skills: [
      {
        g: "Foundation",
        items: [
          { n: "Programming", lvl: "must", d: "Java, Python or JavaScript. This is the line between manual QA and SDET, and therefore between pay bands.", track: "python" },
          { n: "Testing fundamentals", lvl: "must", d: "Test design, equivalence classes, boundary values, risk-based prioritisation. The thinking, not the tooling." },
          { n: "Git and CI/CD", lvl: "must", d: "Tests that do not run automatically may as well not exist.", track: "git" },
          { n: "SQL", lvl: "should", d: "Verifying that data is correct, not merely that the screen looks right.", track: "sql" },
          { n: "APIs and HTTP", lvl: "must", d: "API testing is faster, more stable and more valuable than UI testing.", term: "REST" }
        ]
      },
      {
        g: "Automation craft",
        items: [
          { n: "UI automation", lvl: "must", d: "Playwright, Cypress or Selenium. Playwright is where new work is going.", track: "testing" },
          { n: "API testing", lvl: "must", d: "REST Assured, Postman, pytest. Higher value per hour than UI testing." },
          { n: "Framework design", lvl: "must", d: "Page objects, fixtures, data management, reporting. What makes an SDET an engineer." },
          { n: "Flakiness management", lvl: "must", d: "Diagnosing and eliminating non-deterministic tests. A flaky suite is worse than no suite because it teaches people to ignore failures." },
          { n: "Performance testing", lvl: "should", d: "JMeter, k6, Locust. Load, stress and soak testing." },
          { n: "Mobile testing", lvl: "should", d: "Appium, device farms, real-device strategy." },
          { n: "Test strategy", lvl: "should", d: "The pyramid, what to automate, what to leave manual, when the cost exceeds the value." },
          { n: "Security and accessibility testing", lvl: "edge", d: "Both are increasingly required and both are scarce skills in QA." }
        ]
      }
    ],

    stack: ["Playwright", "Selenium", "Cypress", "pytest / TestNG", "REST Assured", "Postman", "k6 / JMeter", "Appium", "GitHub Actions", "Docker", "BrowserStack"],

    edge: [
      { t: "Move to automation immediately", d: "This is the single decision that determines this career. Manual-only QA pay stagnates; SDET pay tracks software engineering. Give yourself a deadline, not an intention." },
      { t: "Kill flakiness properly", d: "Most teams have a test suite nobody trusts. The engineer who makes the suite reliable restores the entire team's ability to ship confidently — a visible, valued outcome." },
      { t: "Test the API layer, not the interface", d: "UI tests are slow and brittle. Shifting coverage down the pyramid makes the suite faster and steadier, and demonstrates strategic thinking rather than tool operation." },
      { t: "Use it as a launchpad", d: "SDET is an excellent route into backend or DevOps engineering. You already write code, understand the system and know CI. Many strong engineers arrived exactly this way." }
    ],

    ladder: [
      { t: "QA Engineer", y: "0–2 yrs", pay: "₹3–12 LPA", d: "Test execution and basic automation." },
      { t: "SDET / Automation Engineer", y: "2–5 yrs", pay: "₹10–28 LPA", d: "You build and own frameworks." },
      { t: "Senior SDET", y: "5–8 yrs", pay: "₹22–50 LPA", d: "Test architecture and quality strategy." },
      { t: "QA Lead / Quality Architect", y: "8+ yrs", pay: "₹40–100 LPA", d: "Quality standards across the organisation." }
    ],

    pay: {
      bands: [
        { k: "Fresher", y: "0–1 yr", lo: 3, mid: 6, hi: 14, note: "Manual QA ₹3–5; SDET with genuine coding ability ₹8–14 at product companies. The difference is entirely programming skill, which is the clearest signal in this table." },
        { k: "Early", y: "1–3 yrs", lo: 6, mid: 13, hi: 26, note: "The automation transition is the single largest pay event in this career." },
        { k: "Mid", y: "3–6 yrs", lo: 13, mid: 25, hi: 45, note: "" },
        { k: "Senior", y: "6–10 yrs", lo: 22, mid: 42, hi: 80, note: "" },
        { k: "Lead+", y: "10+ yrs", lo: 38, mid: 70, hi: 130, note: "" }
      ],
      notes: [
        "The most accessible entry into Indian IT for non-CS graduates, with a genuine route upward — provided you learn to code.",
        "SDET at a product company pays close to a backend engineer at the same level; manual QA at a services company does not. Choose the path deliberately."
      ]
    },

    cos: [
      { tier: "Product companies", pay: "₹9–20 LPA at entry", d: "SDET roles with real engineering content.", names: ["Flipkart", "Swiggy", "Razorpay", "Zoho", "Freshworks", "Microsoft", "Amazon", "Adobe", "Postman", "BrowserStack"] },
      { tier: "GCCs", pay: "₹6–16 LPA at entry", d: "Large, structured quality organisations.", names: ["Walmart Global Tech", "Target", "Optum", "Wells Fargo", "American Express", "SAP"] },
      { tier: "IT services", pay: "₹3–8 LPA at entry", d: "The largest QA intake in the country and the most common first job in Indian IT.", names: ["TCS", "Infosys", "Wipro", "Accenture", "Cognizant", "Capgemini", "LTIMindtree", "Qualitest"] }
    ],

    hire: [
      { t: "Testing fundamentals", d: "Test design techniques, prioritisation, what you would test and why.", tip: "Given a feature, generate test cases systematically rather than randomly. The method is what is graded." },
      { t: "Coding round", d: "Real programming. This is the SDET gate.", tip: "Prepare like a developer interview; this round is what separates the pay bands." },
      { t: "Automation round", d: "Write a test for a given scenario, discuss framework design.", tip: "Talk about maintainability and flakiness unprompted." },
      { t: "Scenario round", d: "'How would you test a payment flow?'", tip: "Cover the failure paths — timeouts, double submissions, partial failures. Almost everyone covers the happy path only." }
    ],

    proof: [
      { t: "An automation framework on GitHub", d: "Test a real public site or API. Page objects, fixtures, reporting, CI integration.", why: "It is exactly the artefact the job produces, and it proves you write code." },
      { t: "An API test suite", d: "Comprehensive coverage of a public API including negative and edge cases.", why: "Demonstrates the higher-value half of testing." },
      { t: "A load testing report", d: "Find the breaking point of an application and document it properly.", why: "Performance testing is scarce in junior QA and immediately differentiating." }
    ],

    plan: [
      { n: "Programming basics", d: "The decision that determines this entire career path. Do not skip it.", track: "basics", mo: "Months 1–2" },
      { n: "One language", d: "Python or Java.", track: "python", mo: "Months 2–4" },
      { n: "Testing fundamentals", d: "Test design and strategy — the thinking behind the tooling.", track: "testing", mo: "Months 3–4" },
      { n: "Git and CI/CD", d: "Tests must run automatically.", track: "git", mo: "Month 4" },
      { n: "API testing", d: "Higher value than UI testing and easier to learn well.", track: "apitest", mo: "Months 5–6" },
      { n: "UI automation with Playwright", d: "The modern default.", track: "playwright", mo: "Months 6–8" },
      { n: "Framework design", d: "Where QA becomes engineering.", track: "testarch", mo: "Months 8–10" },
      { n: "Portfolio and applications", d: "One real framework on GitHub.", track: "hunt", mo: "Months 9–12" }
    ],

    myths: [
      { m: "QA is where you go if you cannot code.", r: "That describes manual QA, which is the part of the field that is shrinking. SDET is a software engineering role with software engineering pay." },
      { m: "AI will automate testing away.", r: "AI generates test cases well and cannot decide what risk matters, design a maintainable framework or interpret an ambiguous failure. Test writing compresses; test strategy does not." },
      { m: "It is a dead end.", r: "Only if you stay manual. It is one of the most reliable launchpads into backend and DevOps engineering that exists in Indian IT." }
    ],

    next: ["backend-engineer", "devops-engineer", "frontend-engineer"],
    r: ["Unit Test", "Integration Test", "CI/CD", "Test Pyramid", "Load Testing"]
  }

]);
