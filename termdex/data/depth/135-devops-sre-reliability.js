/* ==========================================================================
   Depth pass 135 — DevOps & Cloud batch 6: SRE, Incident Management & Reliability.
   Alerting, SLA, SLO and SLI, Error Budget,
   Incident Response, Postmortem, On-Call, Site Reliability Engineering.

   Symptom-based alerting, multi-window burn-rate SLOs, error budget governance,
   Incident Command Systems, blameless postmortems, sustainable on-call rotations,
   and toil-capped Site Reliability Engineering govern mission-critical cloud reliability.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "alerting",

      why: {
        before: "Monitoring tools dispatched pages for every minor server fluctuation (transient CPU spikes, brief memory utilization increases, single dropped ICMP packets); on-call engineers received 40 pages a night, suffered acute sleep deprivation and alert fatigue, and inevitably ignored the page when the core database actually crashed.",
        problem: "Engineering organizations need an alerting philosophy and delivery mechanism that pages humans only when urgent, actionable intervention is required to prevent customer-facing SLA violations, while routing non-urgent anomalies to tickets and dashboards.",
        shift: "**Alerting: The operational practice of dynamically evaluating telemetry against defined threshold rules to notify human operators when automated systems require urgent intervention.** Guided by Google SRE principles, alerting focuses strictly on user-visible symptoms, multi-window burn rates, and actionable runbooks."
      },

      num: {
        t: "Alerting Severity Tiers: Notification Channels & Response SLAs",
        h: ["Severity Tier", "User-Facing Impact Threshold", "Response SLA", "Notification Dispatch Mechanism", "Operational Requirement"],
        r: [
          ["P1 / Critical (Page)", "Active outage; core user journeys blocked; high error rate", "<15 minutes (24/7/365)", "PagerDuty / Opsgenie phone call & SMS", "Mandatory immediate triage; linked actionable runbook"],
          ["P2 / High (Urgent)", "Degraded performance; redundancy lost; non-critical flow down", "<1 hour (business hours)", "Urgent Slack / Teams channel alert + ticket", "Investigate within work hours; scheduled remediation"],
          ["P3 / Medium (Warning)", "Elevated latency; background queue backing up; disk at 75%", "<24 - 48 hours", "Automated Jira / GitHub issue creation", "Address in standard sprint engineering backlog"],
          ["P4 / Low (Info)", "Diagnostic event; deployment completed; node autoscaled", "None (informational only)", "Aggregated dashboard / log entry", "Zero human notification; review during audits"]
        ],
        n: "The golden rule of alerting is: **Alert on Symptoms, Not Causes**. Paging on an internal cause (e.g., CPU > 85% or disk I/O high) is flawed because systems often run hot normally without user impact. Instead, alerts MUST fire on **user-visible symptoms** (elevated HTTP 5xx error rate or P99 latency breaches). Modern SRE alerting uses **Multi-Window Multi-Burn-Rate Alerting** on SLO error budgets: instead of alerting on arbitrary metric spikes, Alertmanager calculates how rapidly the 30-day error budget is being consumed. A 14.4x burn rate (consuming 2% of the budget in 1 hour) pages on-call immediately; a 1x burn rate routes to a ticket. Every paging alert MUST include a direct URL to a **Runbook** detailing verification steps, dashboards, and mitigation procedures."
      },

      miss: [
        {
          w: "Every metric threshold violation should page the on-call engineer immediately.",
          r: "If an alert does not require immediate human action at 3:00 AM, **it must NEVER wake someone up**. Paging for non-actionable issues causes **Alert Fatigue**, guaranteeing engineers will mute pagers and sleep through genuine Sev-1 production outages."
        },
        {
          w: "Setting a 5-minute CPU utilization threshold of 80% is the best way to detect outages.",
          r: "High CPU is frequently benign (e.g., during garbage collection or batch processing). Conversely, a deadlocked database will show 5% CPU while failing 100% of user transactions. **Alert on user-facing symptoms (HTTP 5xx rate, P99 latency)**."
        },
        {
          w: "Alerting rules should evaluate instantaneous, single-point metric spikes.",
          r: "Instantaneous spikes trigger constant false-positive pages due to network jitter. Alerts must evaluate **sliding time windows using `for:` durations** (e.g., `for: 5m` in Prometheus) to ensure the condition is sustained before dispatching notifications."
        },
        {
          w: "A team should have hundreds of paging alert rules to ensure complete coverage.",
          r: "Elite engineering teams maintain **fewer than 15-20 paging alert rules per service**, focused strictly on the Four Golden Signals and SLO burn rates. Hundreds of alerts guarantee high noise and neglected notifications."
        }
      ],

      trade: {
        buys: [
          "Rapid incident mitigation: on-call engineers are mobilized within minutes of true customer-affecting degradation.",
          "Eradication of alert fatigue: strict symptom-based filtering ensures engineers trust that every page is a genuine emergency.",
          "Standardized incident response: attaching runbook links to every alert ensures fast, structured triage by any team member.",
          "Automated SLO protection: burn-rate alerts notify teams long before customer contractual SLAs are breached."
        ],
        costs: [
          "Alert tuning maintenance: requires continuous refinement of thresholds, sliding windows, and grouping rules to eliminate noise.",
          "Third-party paging SaaS fees: running commercial on-call paging platforms (PagerDuty/Opsgenie) incurs per-user licensing costs.",
          "Runbook documentation overhead: engineering teams must write, audit, and update operational runbooks for every alert rule.",
          "Escalation configuration complexity: maintaining multi-tier escalation policies, shift rotations, and overrides requires operational discipline."
        ],
        avoid: [
          "Never page an on-call engineer outside business hours without an attached link to a tested, concrete runbook.",
          "Never alert on cause metrics (CPU, memory) when symptom metrics (error rates, latency) can be measured directly.",
          "Never allow an alert to fire continuously without either fixing the underlying bug or permanently tuning/deleting the alert rule.",
          "Never configure paging alerts without deduplication, grouping, and rate-limiting rules in Alertmanager."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "sla-slo-and-sli",

      why: {
        before: "Product managers, business executives, and software engineers constantly argued about system performance; business contracts promised unrealistic 100% uptime, while developers had no quantitative metric to measure whether the platform was reliable enough for users.",
        problem: "Organizations need a mathematically rigorous, standardized framework that translates technical system measurements into internal engineering targets and external contractual commitments.",
        shift: "**SLA, SLO, and SLI: The three foundational reliability tiers established by Site Reliability Engineering to define, target, and contractually guarantee service reliability.** Spanning measurements (SLI), internal engineering goals (SLO), and business contracts (SLA), this framework aligns engineering velocity with user happiness."
      },

      num: {
        t: "Reliability Framework Hierarchy: SLI vs SLO vs SLA",
        h: ["Concept", "Full Name", "Definition & Mathematical Formula", "Target Audience / Stakeholders", "Consequence of Breach"],
        r: [
          ["SLI", "Service Level Indicator", "A quantifiable real-time measurement: $SLI = \\frac{\\text{Good Events}}{\\text{Total Valid Events}} \\times 100\\%$", "Engineering teams, SREs, monitoring systems", "Triggers alerts and error budget consumption"],
          ["SLO", "Service Level Objective", "Internal reliability goal: e.g., '99.9% of requests <300ms over 30 days'", "Engineering & Product Management", "Deployment freeze; shift engineering focus to reliability"],
          ["SLA", "Service Level Agreement", "External legal/business contract: e.g., '99.5% monthly availability'", "Customers, Legal, Enterprise Sales, Executives", "Financial penalties, service credits, contract termination"]
        ],
        n: "The three tiers operate as a unified hierarchy: (1) **SLI (What you measure)**: an indicator must measure user happiness. A classic SLI is: $\\text{Availability SLI} = \\frac{\\text{Count of HTTP requests where status } < 500 \\text{ and latency } < 300\\text{ms}}{\\text{Total valid HTTP requests}} \\times 100\\%$; (2) **SLO (What you target internally)**: the agreed target over a rolling compliance window (typically 30 days), e.g., 99.9% availability; and (3) **SLA (What you promise contractually)**: the legal contract made with paying customers. Crucially, **the SLO must ALWAYS be stricter than the SLA** (e.g., SLO of 99.9% vs SLA of 99.5%). This creates an operational safety margin: the internal error budget alerts engineers to reliability degradation long before the company breaches customer contracts and pays financial penalties."
      },

      miss: [
        {
          w: "SLA, SLO, and SLI are just three different acronyms for the exact same thing.",
          r: "They represent completely different concepts: **SLI is the actual measurement**, **SLO is the internal engineering goal**, and **SLA is the legal business contract with financial penalties**. Confusing them leads to engineering panic over business contracts."
        },
        {
          w: "A team should set their internal SLO target to 100% availability.",
          r: "100% availability is **the wrong target for virtually every software system**. Achieving 100% uptime is mathematically and economically impossible; it halts all feature deployments, prevents innovation, and costs orders of magnitude more than users are willing to pay."
        },
        {
          w: "Server-side CPU uptime is a valid Service Level Indicator (SLI).",
          r: "A server running for 300 days continuously has 100% server uptime, but if an NGINX misconfiguration returns 500 errors to 100% of users, the user experience is 0% available. **SLIs must measure user-visible outcomes, not hardware uptime**."
        },
        {
          w: "The SLO should be equal to the SLA agreed with customers.",
          r: "If your SLO equals your SLA, the moment you detect an internal goal breach, you are **already paying financial penalties to customers**. The SLO must be significantly stricter than the SLA to provide an operational buffer to react."
        }
      ],

      trade: {
        buys: [
          "Objective alignment: replaces emotional arguments between Product (velocity) and Ops (stability) with mathematical targets.",
          "Early warning safety buffer: strict internal SLOs alert engineering to degradation weeks before legal SLA breaches occur.",
          "User-centric engineering focus: drives teams to measure real customer journeys rather than superficial infrastructure metrics.",
          "Data-driven error budget governance: mathematically dictates when teams can deploy aggressively versus when feature work must pause."
        ],
        costs: [
          "Mathematical modeling complexity: formulating robust SLIs that filter out client-side network disconnects requires careful query design.",
          "Telemetry infrastructure overhead: calculating rolling 30-day compliance windows requires long-term metric storage (Thanos/Mimir).",
          "Organizational negotiation friction: agreeing on realistic SLOs requires extensive debate between product managers and engineering.",
          "Commercial liability: breaching external SLAs carries direct financial penalties (service credits, fee reimbursements)."
        ],
        avoid: [
          "Never set an external SLA without first measuring the internal SLI baseline for at least 30 to 90 days in production.",
          "Never make an internal SLO equal to or looser than an external contractual SLA.",
          "Never measure SLIs based on raw server ping uptime; measure successful customer request outcomes.",
          "Never define an SLO without an agreed organizational Error Budget policy defining what happens when the SLO is breached."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "error-budget",

      why: {
        before: "Product managers demanded shipping new features as fast as possible, while operations engineers resisted all deployments to maintain system stability; the resulting political gridlock led to delayed releases, hidden technical debt, and toxic organizational friction.",
        problem: "Engineering organizations need an objective, quantitative governance mechanism that balances product development velocity against system reliability, defining exactly when teams can innovate aggressively and when deployments must freeze.",
        shift: "**Error Budget: The maximum allowable threshold of unreliability a service can accumulate over a defined time window without violating its Service Level Objective (SLO).** Calculated mathematically as $100\\% - \\text{SLO}$, the error budget treats unreliability as a finite resource to be spent on innovation."
      },

      num: {
        t: "Error Budget Consumption & Burn Rate Dynamics (30-Day Window, 99.9% SLO)",
        h: ["Burn Rate", "Budget Depletion Time", "% of Total Budget Consumed", "Operational Severity", "Mandated Architectural Action"],
        r: [
          ["$1\\times$ Burn Rate", "Consumes 100% of budget in exactly 30 days", "3.3% per day", "Normal Healthy Baseline", "Standard continuous deployment; ship features normally"],
          ["$2\\times$ Burn Rate", "Consumes 100% of budget in 15 days", "6.7% per day", "Warning / Low", "Investigate during business hours; review recent deployments"],
          ["$6\\times$ Burn Rate", "Consumes 100% of budget in 5 days (5% in 6 hrs)", "20% per day", "P2 / High Ticket", "Ticket dispatched to service team; pause non-essential releases"],
          ["$14.4\\times$ Burn Rate", "Consumes 100% of budget in 2 days (2% in 1 hr)", "50% per day", "P1 / Critical Pager", "Immediate 24/7 on-call page; halt deployments; roll back"],
          ["100% Budget Exhausted", "Zero budget remaining", "100% consumed", "Policy Freeze", "Hard deployment freeze; 100% engineering time devoted to reliability"]
        ],
        n: "The Error Budget operationalizes the insight that **100% reliability is the wrong target**. A 99.9% availability SLO over a 30-day window permits **0.1% unreliability (roughly 43.2 minutes of downtime per month)**. This 43.2 minutes is the **Error Budget**. As long as error budget remains, engineering teams are encouraged to move fast, deploy new features, take risks, and push experiments. However, if consecutive bad releases or outages burn the error budget to 0%, the **Error Budget Policy** triggers automatically: **all feature deployments are frozen, and 100% of engineering capacity is redirected to reliability engineering, automated testing, bug fixes, and infrastructure resilience** until the budget recovers."
      },

      miss: [
        {
          w: "Consistently having 100% of your error budget unspent at the end of every quarter is a sign of excellence.",
          r: "If an error budget is never spent, **the team is moving too slowly, over-investing in reliability, and leaving innovation on the table**. An unspent budget means the SLO is too loose or the team should be deploying features more aggressively."
        },
        {
          w: "An error budget policy is just an informal suggestion that product managers can ignore during product launches.",
          r: "If leadership allows teams to bypass error budget freezes whenever it is inconvenient, **the entire SRE framework collapses**. The error budget policy must be an explicit, pre-negotiated contract signed by VP-level engineering and product leadership."
        },
        {
          w: "Error budget is only consumed by catastrophic total system outages.",
          r: "Error budget is consumed continuously by **every failed user request, 500 error, dropped network packet, and latency breach**. A service serving 1% errors over 4 hours burns through significant monthly budget without a complete outage."
        },
        {
          w: "Exhausting the error budget means all developers should be punished.",
          r: "Error budgets are **blameless governance tools**, not punitive metrics. An exhausted budget simply indicates that the system's technical debt has caught up with release velocity, requiring a temporary recalibration toward reliability."
        }
      ],

      trade: {
        buys: [
          "Objective deployment governance: replaces subjective political debates with a mathematical rule agreed upon in advance.",
          "Innovation acceleration: empowers developers to take calculated risks and deploy rapidly while error budget remains healthy.",
          "Protected engineering time for technical debt: provides an unassailable mandate to pause features and fix infrastructure when stability degrades.",
          "Unified team incentives: aligns product managers and software engineers around a shared, quantified reliability contract."
        ],
        costs: [
          "Product delivery pauses: feature development can be halted unexpectedly when third-party dependencies burn budget.",
          "Organizational discipline overhead: requires strict management commitment to enforce deployment freezes when budgets expire.",
          "Telemetry calculation complexity: requires accurate real-time query engines (PromQL) to calculate rolling burn rates.",
          "External dependency friction: third-party cloud outages (AWS/Stripe) burn your error budget unless explicitly excluded from SLIs."
        ],
        avoid: [
          "Never implement error budgets without an explicit, pre-signed policy governing what happens when the budget is exhausted.",
          "Never allow product teams to bypass an error budget freeze without documented executive approval.",
          "Never treat an unspent error budget as a goal; spend it on shipping features, architectural refactoring, and chaos experiments.",
          "Never blame engineers for burning error budget; use the signal to improve automated testing and canary deployment safety."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "incident-response",

      why: {
        before: "When an outage struck, 25 engineers joined a chaotic conference call with no designated leader; multiple engineers ran uncoordinated database commands live on production servers, nobody communicated with customers, and the team spent hours diagnosing root causes while users suffered downtime.",
        problem: "High-severity production incidents are chaotic emergencies that require a disciplined, military-grade command structure that isolates roles, coordinates technical actions, updates stakeholders, and restores service as fast as humanly possible.",
        shift: "**Incident Response: The structured organizational and technical process of detecting, triaging, mitigating, and resolving production system outages and security breaches.** Adapted from FEMA's Incident Command System (ICS), incident response prioritizes rapid service restoration over root-cause diagnosis."
      },

      num: {
        t: "Incident Command System (ICS) Roles & Responsibilities",
        h: ["Incident Role", "Primary Responsibility", "Decision-Making Scope", "External Communication", "Critical Antipattern"],
        r: [
          ["Incident Commander (IC)", "Owns the incident; directs strategy, delegates roles", "Absolute operational authority during incident", "Internal executive escalation only", "Debugging code directly instead of coordinating"],
          ["Operations Lead", "Directs technical responders and system mitigations", "Tactical authority over engineering actions", "Reports technical status exclusively to IC", "Applying uncoordinated fixes without IC approval"],
          ["Communications Lead", "Drafts customer updates, public status page posts", "External messaging and PR communication", "Public Statuspage, enterprise customer comms", "Promising technical recovery times without IC sign-off"],
          ["Scribe / Recorder", "Maintains chronological real-time log of events & actions", "Records commands, timestamps, and hypotheses", "Maintains incident Slack channel summary", "Participating in technical debugging instead of logging"],
          ["Subject Matter Expert (SME)", "Deep-dive technical investigation (DBA, network eng)", "Executes specific tasks delegated by Ops Lead", "Communicates within private incident channel", "Executing rogue changes outside the agreed plan"]
        ],
        n: "Incident response is governed by the cardinal operational rule: **Mitigate First, Investigate Later**. When an incident is declared, the primary goal is not discovering *why* the bug occurred, but **restoring customer service immediately** (via automated rollback, traffic failover, shedding load, or flipping feature flags). Incidents follow a rigid lifecycle: (1) **Detection & Triage**: automated alerts page on-call; severity is classified (Sev-1 Critical Outage down to Sev-3 Minor Degradation); (2) **Mobilization**: Incident Commander assumes command, opens a dedicated Slack channel (`#inc-YYYYMMDD-auth-down`) and video bridge; (3) **Mitigation**: IC coordinates hypotheses, approves actions, and verifies customer recovery; (4) **Resolution**: service restored; and (5) **Postmortem**: blameless retrospective scheduled within 48 hours."
      },

      miss: [
        {
          w: "The Incident Commander should be the most senior engineer who can write code and debug fastest.",
          r: "The Incident Commander must **NEVER write code, touch servers, or debug during an incident**. The IC's sole job is high-level coordination, delegation, resource allocation, and maintaining calm. The moment an IC starts debugging, leadership collapses."
        },
        {
          w: "During an outage, you must find the permanent root cause before restoring service.",
          r: "This is a **catastrophic mistake that multiplies outage duration**. You do not need to understand a bug to roll back the release, restart the wedged service, or flip a feature flag. **Restore service first; diagnose the root cause in the postmortem**."
        },
        {
          w: "Anyone who has an opinion should speak freely on the incident conference call.",
          r: "Uncontrolled noise paralyzes incident response. Communication must be **strictly structured**: all suggestions are routed through the Operations Lead or IC, and side conversations move to text chat to keep audio channels clear."
        },
        {
          w: "Status pages should remain quiet until the incident is 100% resolved to avoid bad PR.",
          r: "Silence breeds customer fury and panic. Status pages must be **updated within 10-15 minutes of detection**, with regular updates posted every 20-30 minutes even if the update only confirms investigation continues."
        }
      ],

      trade: {
        buys: [
          "Dramatically reduced Mean Time to Restore (MTTR): structured command structures eliminate panic and execute fast mitigations.",
          "Clear executive and customer communication: dedicated Comms Leads keep stakeholders informed, protecting brand reputation.",
          "Accurate chronological documentation: Scribe records provide pristine, factual timelines for subsequent postmortems.",
          "Reduced cognitive stress for responders: clear delegation and single points of contact prevent responder burnout."
        ],
        costs: [
          "Organizational training overhead: requires company-wide training and regular mock incident response fire drills (Wheel of Misfortune).",
          "Context switching disruption: mobilizing incident response teams pulls senior engineers away from active sprint feature work.",
          "SaaS tooling costs: maintaining incident management and status page tools (PagerDuty, Incident.io, Statuspage) incurs subscriptions.",
          "Strict process friction: minor issues mistakenly classified as Sev-1 can trigger unnecessary procedural overhead."
        ],
        avoid: [
          "Never debug live code or analyze root causes during an outage when a clean mitigation (rollback/failover) is available.",
          "Never allow multiple uncoordinated engineers to execute changes simultaneously on production systems during an incident.",
          "Never leave incident status pages un-updated for more than 30 minutes during an active customer-facing outage.",
          "Never close an incident without scheduling a formal blameless postmortem within 48 hours."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "postmortem",

      why: {
        before: "Following production outages, management conducted punitive post-incident reviews seeking the 'guilty party'; engineers were reprimanded, fired, or shamed for 'human error', creating a culture of terror where developers hid mistakes, deleted logs, and left underlying system flaws to cause repeated outages.",
        problem: "Complex distributed systems fail in unpredictable ways; organizations need a structured, psychologically safe retrospective process that investigates systemic design flaws and converts failures into permanent institutional resilience.",
        shift: "**Postmortem (Incident Review / Learning Review): A formal written retrospective document and collaborative meeting conducted after a production incident to understand what happened, why it happened, and how to prevent recurrence.** Grounded in blameless culture, postmortems treat human error as a symptom of flawed systems rather than a cause."
      },

      num: {
        t: "Incident Review Cultures: Blame-Centric vs Blameless SRE Postmortem",
        h: ["Dimension", "Traditional Blame-Centric Review", "Blameless SRE Postmortem", "Action Item Outcome", "Impact on System Reliability"],
        r: [
          ["Core Question Asked", "'Who caused the outage?'", "'What systemic factors allowed this failure to occur?'", "Punitive retraining / disciplinary action vs systemic guardrails", "Failures recur repeatedly; high turnover"],
          ["Human Error Treatment", "Treated as the primary root cause of failure", "Treated as the starting point of an investigation", "Scapegoating individuals vs engineering defensive guardrails", "Errors driven underground; psychological terror"],
          ["Information Sharing", "Engineers conceal details and cover up near-misses", "Engineers share transparent, detailed chronological evidence", "Selective filtered truth vs complete, honest technical reality", "High transparency fosters rapid learning"],
          ["Corrective Actions", "Vague directives ('be more careful next time')", "SMART action items (automated linters, architectural bounds)", "Zero structural change vs permanent automated defenses", "Reliability improves continuously across quarters"]
        ],
        n: "Blameless postmortems are grounded in the safety science principles of **Dr. Sidney Dekker** and **John Allspaw**: *Engineers always act reasonably given the information, tooling, and incentives they had at the time*. 'Human error' is never the root cause; it is merely the starting point. If an engineer executed an accidental `DROP TABLE`, the real systemic questions are: *Why did production credentials have DROP permissions? Why was there no confirmation barrier? Why was there no immediate point-in-time recovery?* A production postmortem documents: (1) **Executive Summary & Impact** (downtime duration, affected users, revenue loss); (2) **Detailed Chronological Timeline** (in UTC); (3) **Contributing Factors**; (4) **What Went Well / What Went Poorly**; and (5) **Action Items** (assigned to specific owners with strict deadlines)."
      },

      miss: [
        {
          w: "A postmortem is complete as soon as the team identifies the single 'Root Cause' of the incident.",
          r: "In complex distributed systems, **there is almost NEVER a single root cause**. Outages occur through the combinatorial alignment of multiple latent failures (e.g., a bad deploy + an unexpected network latency spike + a misconfigured timeout). Focusing on a single root cause blinds teams to secondary systemic hazards."
        },
        {
          w: "Being 'blameless' means engineers are never held accountable for their work.",
          r: "Blamelessness means holding people accountable for **learning, transparency, and improving the system**. Blame produces concealment and fear; blamelessness uncovers the truth. (Gross negligence or malicious sabotage is handled by HR, not postmortems)."
        },
        {
          w: "The postmortem document is the primary goal of an incident review.",
          r: "A postmortem document whose action items are never implemented is **worthless corporate theater**. The true value lies in executing the resulting **SMART Action Items** (Specific, Measurable, Achievable, Relevant, Time-bound) to harden the system."
        },
        {
          w: "Postmortems should only be conducted for major catastrophic multi-hour outages.",
          r: "Valuable learning comes from **near-misses, minor degradations, and unexpected system behaviors**. Conducting lightweight postmortems for minor incidents uncovers latent vulnerabilities before they manifest as catastrophic outages."
        }
      ],

      trade: {
        buys: [
          "Institutional learning: converts painful production outages into permanent organizational knowledge and architectural improvements.",
          "Psychological safety: fosters an open culture where engineers report mistakes, near-misses, and vulnerabilities without fear of punishment.",
          "Permanent failure immunization: automated guardrails and architectural fixes prevent the exact same failure from ever recurring.",
          "Cross-team knowledge dissemination: sharing postmortems across engineering teams prevents other squads from repeating known errors."
        ],
        costs: [
          "Engineering capacity overhead: drafting timelines, analyzing logs, and running reviews consumes 10-20 hours of senior engineer time.",
          "Action item backlog debt: tracking, prioritizing, and completing postmortem action items requires dedicated sprint capacity.",
          "Scheduling friction: coordinating review meetings across cross-functional responders within 48-72 hours of an incident.",
          "Facilitation challenge: maintaining a truly blameless, constructive tone requires skilled incident review facilitators."
        ],
        avoid: [
          "Never name or shame individual engineers in postmortem documentation or meetings.",
          "Never conclude a postmortem with 'human error' as the root cause; investigate the system tooling and guardrails.",
          "Never write vague, untracked action items (e.g., 'improve monitoring' or 'be more careful'); assign concrete owners and dates.",
          "Never allow postmortems to be delayed past 48-72 hours after an incident; human memory degrades rapidly."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "on-call",

      why: {
        before: "Software developers wrote features and tossed them over the wall to an isolated operations team; developers had zero incentive to write reliable code because when their code crashed at 3 AM on Saturday, an operations sysadmin was woken up to deal with the disaster.",
        problem: "Organizations need an operational rotation that ensures 24/7/365 production availability while aligning engineering incentives around software reliability and preventing responder burnout.",
        shift: "**On-Call: A scheduled, rotational operational duty where engineers are designated to respond immediately to critical production alerts and incidents outside of standard business hours.** Under the DevOps ethos of 'You build it, you run it', on-call connects software design directly to production accountability."
      },

      num: {
        t: "On-Call Operating Models: Comparative Operational Dynamics",
        h: ["Operating Model", "Primary Responders", "Incentive Alignment", "Escalation Path", "Burnout & Fatigue Risk"],
        r: [
          ["Centralized Ops / NOC", "Dedicated NOC operators / sysadmins", "Zero (developers don't feel operational pain)", "Escalates to dev after prolonged outage", "High for NOC; creates toxic finger-pointing"],
          ["Product Team ('You build it, you run it')", "Software developers who wrote the service", "Maximum (engineers motivated to fix noisy bugs)", "Escalates to tech lead / engineering manager", "Low to Moderate (shared across team of 6-8 engineers)"],
          ["Follow-the-Sun Rotation", "Distributed global teams (US / EMEA / APAC)", "High (engineers hand off during daylight hours)", "Escalates to next geographic timezone", "Minimal (eliminates midnight paging)"],
          ["Dedicated SRE Rotation", "Site Reliability Engineers + Product secondary", "High (SRE enforces error budgets and SLOs)", "Escalates back to product team on budget breach", "Managed (SRE enforces strict toil caps)"]
        ],
        n: "A sustainable on-call rotation requires strict adherence to SRE health metrics: **a healthy rotation should experience no more than 2 high-severity pages per 12-hour shift**. Paging rotations must maintain at least **6 to 8 engineers** so that no individual is on-call more frequently than once every 6 weeks. Core organizational policies must protect responders: (1) **Every Page Must Have a Runbook**: engineers should never guess at 3 AM; (2) **Compensatory Time Off (Sleep Comp)**: if an engineer is paged overnight, they are mandated to take the following morning off to rest; (3) **Financial On-Call Compensation**: engineers receive dedicated stipends for carrying the pager; and (4) **Root-Cause Elimination**: alerts that page repeatedly are silenced immediately until permanently fixed."
      },

      miss: [
        {
          w: "Putting junior developers on-call is dangerous and should be avoided entirely.",
          r: "Junior engineers should participate in on-call rotations **as part of their core professional development**, provided they have completed shadow shifts, have detailed runbooks, and are supported by a designated **Secondary On-Call (Senior Escalation)**."
        },
        {
          w: "Being on-call means sitting at your desk staring at Grafana dashboards all weekend.",
          r: "On-call engineers live their normal lives, requiring only that they carry their mobile phone with the PagerDuty app and remain within **15-30 minutes of a reliable internet connection and laptop**."
        },
        {
          w: "An on-call engineer who receives 10 pages a night should just endure it as part of the job.",
          r: "Waking up 10 times a night is an **unsustainable operational crisis that leads directly to burnout and resignations**. The team must immediately declare an operational emergency, silence noisy non-actionable alerts, and freeze feature work to fix the root cause."
        },
        {
          w: "Software developers should never be put on-call; only dedicated operations teams should handle production.",
          r: "Shielding developers from production reality produces fragile, buggy software. **When developers know their own code will wake them up at 3 AM, they write rigorous automated tests, defensive error handling, and robust self-healing logic**."
        }
      ],

      trade: {
        buys: [
          "Aligned engineering incentives: developers write higher-quality, self-healing code when they own production reliability.",
          "Rapid incident triage: the engineers who wrote the software diagnose and fix bugs orders of magnitude faster than third-party operators.",
          "24/7 customer SLA protection: guarantees that production outages receive immediate expert intervention within minutes.",
          "Operational empathy across teams: shared on-call rotations foster deep organizational respect for reliability engineering."
        ],
        costs: [
          "Responder burnout liability: poorly managed rotations with frequent nighttime pages destroy team morale and spike employee churn.",
          "Engineering capacity distraction: on-call shifts pull engineers away from sprint feature development to handle interrupts.",
          "Financial on-call stipends: fair enterprise compensation policies require ongoing operational budget allocations.",
          "Tooling and escalation overhead: maintaining paging platforms, schedules, holiday overrides, and escalation policies."
        ],
        avoid: [
          "Never operate an on-call rotation with fewer than 4-5 engineers; small rotations lead to chronic exhaustion.",
          "Never permit an alert to page an engineer without an attached, step-by-step troubleshooting runbook.",
          "Never require engineers to work a full regular workday after being woken up repeatedly during night shifts.",
          "Never treat frequent overnight pages as normal business operations; treat alert noise as an urgent system defect."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "site-reliability-engineering",

      why: {
        before: "Organizations scaled system operations by hiring more sysadmins to perform manual server administration, ticket approvals, and manual deployments; as server fleets grew from 100 to 10,000 instances, operational costs scaled linearly, human errors multiplied, and systems collapsed under operational toil.",
        problem: "Hyperscale internet systems require an operational discipline that scales sub-linearly with traffic growth, treating operations as an engineering software problem solvable through automation, error budgets, and statistical reliability targets.",
        shift: "**Site Reliability Engineering (SRE): What happens when you ask a software engineer to design an operations team.** Pioneered by Ben Treynor Sloss at Google, SRE applies software engineering principles to infrastructure and operations, enforcing a strict 50% cap on manual toil and governing reliability via error budgets."
      },

      num: {
        t: "Operational Disciplines: Traditional Sysadmin vs DevOps Culture vs Site Reliability Engineering",
        h: ["Dimension", "Traditional Systems Administration", "DevOps Cultural Movement", "Site Reliability Engineering (SRE)"],
        r: [
          ["Core Approach to Work", "Manual, ticket-driven operational maintenance", "Cultural philosophy of shared Dev/Ops ownership", "Software engineering applied to operational problems"],
          ["Manual Work (Toil) Policy", "Accepted as standard daily work routine", "Encourages automation in general", "Strict mathematical cap: maximum 50% toil; 50% engineering"],
          ["System Failure Stance", "Failures are unacceptable; resist change", "Failures are inevitable; learn blamelessly", "Failures are managed via quantitative Error Budgets"],
          ["Release Governance", "Change Advisory Boards (CAB) manual approval", "Continuous delivery pipelines", "Algorithmic: releases permitted while error budget remains"],
          ["Primary Tooling Medium", "Ad-hoc shell scripts, vendor GUIs", "CI/CD pipelines, IaC (Terraform, Docker)", "Go/Python software systems, Kubernetes operators, Prometheus"]
        ],
        n: "SRE is defined by several core tenets: (1) **Toil Capping at 50%**: **Toil** is defined as manual, repetitive, automatable work that scales linearly with service growth. SRE mandates that at least 50% of an engineer's time MUST be spent on engineering projects (coding automation, architecture redesign, chaos engineering) to permanently engineer toil away; (2) **Embrace Risk**: 100% reliability is the wrong target; availability targets must match user happiness; (3) **Service Level Objectives (SLOs) and Error Budgets**: unreliability is quantified as an error budget that dictates deployment velocity; (4) **Blameless Postmortems**: learning from failure without assigning personal blame; and (5) **Monitoring Distributed Systems**: focusing on the Four Golden Signals (Latency, Traffic, Errors, Saturation)."
      },

      miss: [
        {
          w: "SRE is just a trendy new title for traditional Linux system administrators.",
          r: "SREs are **software engineers who write production code**. They write automation software, Kubernetes operators, distributed telemetry pipelines, and autoscalers. If an engineer spends 90% of their time clicking dashboards and rebooting servers, they are a sysadmin, not an SRE."
        },
        {
          w: "The primary job of an SRE is to prevent 100% of all production system failures.",
          r: "SRE explicitly acknowledges that **failures are mathematically inevitable**. The SRE's job is to define acceptable reliability thresholds (SLOs), ensure fast automated recovery, manage error budgets, and design resilient architectures that absorb failures gracefully."
        },
        {
          w: "Every startup with 5 engineers should hire a dedicated SRE team immediately.",
          r: "Hiring dedicated SREs before product-market fit is **premature and wasteful**. Early-stage startups need full-stack product developers practicing DevOps. Dedicated SRE teams become essential when systems reach complex multi-service scale (50+ microservices, millions of users)."
        },
        {
          w: "SRE replaces the need for software developers to care about production reliability.",
          r: "SRE provides the **framework, tooling, and guardrails** (monitoring, error budgets, deployment platforms), but product development teams remain responsible for their code. If a product team burns their error budget, SRE hands the pager back to the product team."
        }
      ],

      trade: {
        buys: [
          "Sub-linear operational scaling: automated platforms allow an infrastructure team of 10 SREs to manage 100,000 servers efficiently.",
          "Mathematically grounded decision making: error budgets eliminate emotional conflict over deployment frequency and reliability.",
          "High system architectural resilience: chaos engineering, automated failovers, and self-healing eliminate single points of failure.",
          "Continuous elimination of operational toil: mandating 50% software engineering time ensures repetitive tasks are permanently automated."
        ],
        costs: [
          "High engineering talent costs: hiring software engineers with deep distributed systems and operational expertise is expensive.",
          "Strict organizational discipline: leadership must uphold error budget policies and enforce deployment freezes when budgets expire.",
          "Complex observability and tooling overhead: designing, deploying, and maintaining SRE platforms requires significant infrastructure investment.",
          "Cultural friction with legacy teams: shifting legacy organizations from ticket-based operations to code-driven SRE encounters resistance."
        ],
        avoid: [
          "Never rebrand a traditional operations team as 'SRE' without empowering them to write software and cap toil at 50%.",
          "Never allow SRE teams to become dumping grounds for manual developer deployment tickets and operational busywork.",
          "Never ignore error budget breaches; enforce the agreed policy of halting feature work to focus on reliability.",
          "Never penalize engineers for incidents; maintain rigorous blameless postmortem culture to maximize organizational learning."
        ]
      }
    }

  ]);

})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
