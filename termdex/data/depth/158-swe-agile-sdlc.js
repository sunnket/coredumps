(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([
    {
      slug: "agile",
      why: {
        before: "Software development was managed using heavyweight manufacturing-inspired project management models (Waterfall), requiring multi-year upfront requirement specifications and rigid change control boards.",
        problem: "By the time software shipped years later, the business requirements, market conditions, and underlying technologies had completely shifted, resulting in multi-million-dollar cancellations or products that users rejected.",
        shift: "Seventeen software leaders met in Snowbird, Utah in 2001 and published the Agile Manifesto, declaring four core values and twelve principles emphasizing iterative delivery, customer collaboration, working software, and rapid response to change."
      },
      num: {
        t: "Agile Manifesto Four Core Values & Operational Meaning",
        h: ["Agile Value (Left Over Right)", "Primary Focus Area", "Underlying Operational Mechanism", "Right-Side Value Role (Still Valued)", "Primary Organizational Failure Mode"],
        r: [
          ["Individuals & Interactions over Processes & Tools", "Team communication & psychological safety", "Face-to-face cross-functional collaboration; self-organizing teams", "Processes and tools provide scaffolding, but cannot replace communication", "Dogmatic Jira ticketing worship where developers stop talking to each other"],
          ["Working Software over Comprehensive Documentation", "Empirical validation & feedback loops", "Deploying functional, tested software increments to real users every 1-2 weeks", "Documentation is maintained as living code (ADRs, Readmes, OpenAPI)", "Building 'feature-complete' architectures on paper that fail when compiled"],
          ["Customer Collaboration over Contract Negotiation", "Shared product discovery & alignment", "Continuous customer user testing, demos, and telemetry-driven feedback", "Contracts define high-level milestones, but allow scope flexibility", "Rigid legal change requests that penalize discovering better solutions"],
          ["Responding to Change over Following a Plan", "Adaptive strategy & uncertainty management", "Short iteration cycles (sprints/continuous flow) with backlog re-prioritization", "Plans provide directional vision, but yield when new market data emerges", "Following a 2-year Gantt chart off an economic cliff despite user rejection"]
        ],
        n: "Agile is fundamentally an empirical process control model (derived from Deming's Plan-Do-Check-Act cycle), contrasting sharply with the defined process control model of traditional civil engineering. Software development exists in the complex domain of the Cynefin framework, where cause-and-effect relationships are only discernible in retrospect. Consequently, detailed long-term predictive planning is mathematically impossible due to nonlinear feedback loops and market uncertainty. Agile compresses the feedback loop between conceptualizing a feature and measuring its real-world user utility from years to days. High-performing Agile engineering teams practice continuous integration, trunk-based development, and automated testing to ensure the software remains deployable at all times."
      },
      miss: [
        {
          w: "Agile means you don't do any planning, design, or documentation at all.",
          r: "Agile involves continuous, just-in-time planning and living documentation at every iteration, rather than massive speculative upfront planning that rapidly becomes obsolete."
        },
        {
          w: "Agile and Scrum are identical terms for the exact same thing.",
          r: "Agile is an overarching philosophy and set of values; Scrum is one specific prescriptive operational framework with defined roles, ceremonies, and artifacts."
        },
        {
          w: "Adopting Agile allows engineering teams to ship features twice as fast with half the staff.",
          r: "Agile does not magically speed up coding; it eliminates waste by stopping teams from building the wrong features, delivering value earlier, and exposing organizational dysfunctions."
        },
        {
          w: "Agile means developers can change software architecture randomly every day without any discipline.",
          r: "Agile requires far higher technical discipline (automated unit testing, CI/CD, refactoring, code reviews) than Waterfall to maintain code flexibility without introducing chaos."
        }
      ],
      trade: {
        buys: [
          "Rapid risk mitigation: shipping early working increments proves architectural viability and catches misunderstandings immediately.",
          "High market responsiveness: teams can pivot product direction in response to real customer analytics and competitor moves.",
          "Continuous customer value: delivers functional software enhancements to production every few weeks rather than years later.",
          "Transparent progress metrics: progress is measured by working software deployed to users, not subjective percentage-complete reports."
        ],
        costs: [
          "Budget and scope predictability friction: enterprise leadership must embrace variable-scope budgeting rather than fixed-bid contracts.",
          "High engineering discipline requirement: requires continuous automated testing and refactoring to prevent rapid codebase decay.",
          "Stakeholder engagement demand: product owners and business stakeholders must be actively available daily for feedback.",
          "Cultural resistance: traditional hierarchical management structures often resist devolving authority to self-organizing teams."
        ],
        avoid: [
          "'Agile in Name Only' (Dark Agile): imposing rigid Waterfall deadlines while forcing developers into daily micromanaged standups.",
          "Abandoning automated testing, architecture, and documentation under the guise of 'moving fast and being Agile'.",
          "Using Agile ceremonies (standups, retrospectives) as mechanical rituals without embracing continuous empirical learning.",
          "Treating sprint commitments as ironclad contractual quotas that encourage cutting quality and skipping tests."
        ]
      }
    },
    {
      slug: "scrum",
      why: {
        before: "Software teams worked under top-down command-and-control managers who assigned tasks individually, producing disconnected work, lack of collective ownership, and zero accountability for delivery.",
        problem: "Without clear roles, cadence, or inspect-and-adapt mechanisms, teams drifted aimlessly, suffered endless requirement churn mid-development, and accumulated blockers that went unaddressed for weeks.",
        shift: "Ken Schwaber and Jeff Sutherland created the Scrum framework, organizing self-managing, cross-functional teams around fixed-length Sprints, specific accountabilities (Product Owner, Scrum Master, Developers), and formal empirical ceremonies."
      },
      num: {
        t: "The Scrum Framework: Roles, Ceremonies & Artifacts",
        h: ["Scrum Pillar / Element", "Classification", "Primary Responsibility / Purpose", "Timebox / Cadence", "Primary Failure Mode / Anti-Pattern"],
        r: [
          ["Product Owner (PO)", "Accountability / Role", "Maximizes product value; owns and prioritizes Product Backlog", "Continuous full-time role", "Proxy PO with no authority; treated as an order-taking ticket writer"],
          ["Scrum Master (SM)", "Accountability / Role", "Promotes Scrum; removes team blockers; coaches team efficiency", "Continuous full-time role", "Acting as a micromanaging project manager or administrative calendar clerk"],
          ["Developers", "Accountability / Role", "Cross-functional team creating a usable Increment each Sprint", "Continuous full-time role", "Siloed specialists refusing to help outside their narrow technical specialty"],
          ["Sprint Planning", "Ceremony / Event", "Defines Sprint Goal, selected backlog items, and work plan", "Max 8h for 1-month Sprint (usually 2h for 2-week)", "Committing to a laundry list of unrelated tasks without a unified Sprint Goal"],
          ["Daily Scrum (Standup)", "Ceremony / Event", "Inspects progress toward Sprint Goal; adapts plan for next 24h", "Strictly 15 minutes daily", "Turns into a status report to the manager rather than peer-to-peer replanning"],
          ["Sprint Review & Retrospective", "Ceremony / Event", "Inspects Increment with stakeholders (Review); inspects team process (Retro)", "Review: 2h; Retro: 1.5h (per 2-week Sprint)", "Skipping Retrospectives or venting complaints without assigning action items"]
        ],
        n: "Scrum is an intentionally lightweight, prescriptive framework built on empirical process control: Transparency, Inspection, and Adaptation. At the start of a fixed timebox (Sprint, typically 2 weeks), the team crafts a Sprint Goal and pulls a forecast of Product Backlog items into the Sprint Backlog. Crucially, once the Sprint begins, no external stakeholder is permitted to alter the Sprint Goal, providing the engineering team with an uninterrupted zone of deep technical focus. Daily, the team holds a 15-minute Daily Scrum to synchronize progress and identify blockers. At the conclusion of the Sprint, the team produces a potentially shippable 'Increment' that meets their formal 'Definition of Done' (DoD). The Sprint Review inspects the working software with business stakeholders, while the Sprint Retrospective inspects the team's interpersonal and technical processes to implement concrete improvements in the next Sprint."
      },
      miss: [
        {
          w: "The Scrum Master is the technical team lead or project manager who assigns daily tasks to developers.",
          r: "The Scrum Master has zero management authority and never assigns tasks; Scrum teams are self-organizing, meaning developers collaboratively pull tasks and decide how to build the Increment."
        },
        {
          w: "The Daily Scrum is a daily status report where developers justify what they did yesterday to management.",
          r: "The Daily Scrum is a peer-to-peer tactical synchronization meeting for developers to collaborate on blockers and adapt their plan to achieve the shared Sprint Goal."
        },
        {
          w: "You can change the Sprint Backlog items midway through a Sprint whenever leadership requests a new feature.",
          r: "Scope cannot be injected into an active Sprint if it compromises the Sprint Goal; if business priorities shift radically, the Product Owner must formally cancel the Sprint and re-plan."
        },
        {
          w: "Story points measure exact developer hours and can be used to compare productivity across different teams.",
          r: "Story points are relative, subjective estimates of complexity, uncertainty, and effort specific to one team; comparing velocity across teams is statistically invalid and incentivizes point inflation."
        }
      ],
      trade: {
        buys: [
          "Predictable cadence: fixed timeboxed Sprints establish a reliable operational rhythm for planning, delivery, and review.",
          "Protected engineering focus: shields developers from constant mid-sprint context switching and requirement churn.",
          "Continuous empirical improvement: structured retrospectives guarantee dedicated time to refine technical processes.",
          "Transparent accountability: unambiguous ownership (Product Owner owns 'what', Developers own 'how') eliminates blame games."
        ],
        costs: [
          "Ceremony time overhead: attending planning, standups, reviews, and retrospectives consumes 10% to 15% of team capacity.",
          "Sprint boundary artificiality: complex engineering tasks that naturally take 3 weeks must be artificially decomposed into 2-week chunks.",
          "Vulnerability to commercialized dogmatism: organizations often hire expensive consultants and apply rigid dogma without cultural change.",
          "Velocity obsession risk: management often fixates on increasing velocity metrics rather than delivering actual customer outcomes."
        ],
        avoid: [
          "Turning the Daily Standup into a 45-minute problem-solving session or a managerial status interrogation.",
          "Ending sprints without a potentially shippable increment that meets a rigorous, automated Definition of Done.",
          "Using story point velocity as a KPI to rank, evaluate, or compare performance across different engineering teams.",
          "Treating the Scrum Master as a glorified Jira administrator or secret project manager."
        ]
      }
    },
    {
      slug: "kanban",
      why: {
        before: "Teams forced all software work into rigid two-week batch sprints, causing friction for operational teams (DevOps, Site Reliability Engineering, maintenance) whose work consists of unpredictable, continuous incident tickets.",
        problem: "Sprint batching created artificial delays for urgent requests, caused end-of-sprint testing crunches, and masked systemic workflow bottlenecks where dozens of tasks piled up waiting in 'Code Review'.",
        shift: "David J. Anderson adapted the Toyota Production System's Kanban methodology to software, establishing a continuous-flow framework centered on visualizing the workflow, limiting Work-in-Progress (WIP), and optimizing lead time."
      },
      num: {
        t: "Kanban Core Metrics & Little's Law Queuing Dynamics",
        h: ["Kanban Metric / Law", "Mathematical Formulation", "Physical Meaning in Software Flow", "Operational Target", "Systemic Impact of Overload"],
        r: [
          ["Work in Progress (WIP)", "Count of active concurrent tickets", "Number of tasks started but not yet deployed to production", "Strict upper limit enforced per workflow column", "Uncapped WIP causes multitasking thrashing and exponential latency"],
          ["Cycle Time", "$T_{\\text{cycle}} = T_{\\text{done}} - T_{\\text{in-progress}}$", "Elapsed time from when active development begins to completion", "Minimize and stabilize standard deviation", "High cycle time delays feedback and inflates code divergence"],
          ["Lead Time", "$T_{\\text{lead}} = T_{\\text{done}} - T_{\\text{requested}}$", "Total elapsed time from customer ticket creation to production release", "Predictable Service Level Expectations (SLE)", "High lead time leads to frustrated stakeholders and stale requirements"],
          ["Little's Law", "$L = \\lambda W \\implies \\text{WIP} = \\text{Throughput} \\times \\text{Lead Time}$", "Fundamental queuing theorem relating queue size, rate, and wait time", "Optimize flow by decreasing WIP rather than pushing workers", "Proves mathematically that doubling WIP doubles lead time for the same throughput"],
          ["Throughput", "$\\text{Items} / \\Delta t$", "Number of completed, deployed work items per unit time (e.g. week)", "Consistent, sustainable flow velocity", "Cannot be increased by overloading the system with more work"]
        ],
        n: "Kanban is a pull-based continuous delivery methodology governed by queueing theory and Little's Law ($L = \\lambda W$), which proves mathematically that the average lead time in any stable queuing system is directly proportional to the amount of Work-in-Progress (WIP). When a team takes on too many tasks concurrently, context-switching overhead escalates exponentially, causing individual task lead times to skyrocket. Kanban resolves this by making work visible on a Kanban board divided into explicit workflow states (e.g., Backlog, Specifying, Developing, Code Review, In QA, Deployed) and imposing strict WIP limits on each column. When a column hits its WIP limit, developers are forbidden from pulling new tasks; instead, they must 'swarm' on existing blocked items downstream to pull them across the finish line, embodying the core Kanban ethos: 'Stop starting, start finishing.'"
      },
      miss: [
        {
          w: "Kanban is just Scrum without deadlines, estimates, or planning meetings.",
          r: "Kanban is a rigorous queuing discipline based on Little's Law, continuous flow, explicit workflow policies, and WIP limits; removing Scrum meetings without enforcing WIP limits is not Kanban—it is chaos."
        },
        {
          w: "A team is doing Kanban as long as they have a Trello or Jira board with columns.",
          r: "A board without strictly enforced WIP limits and explicit exit criteria is merely a visual status board, not a Kanban pull system."
        },
        {
          w: "Kanban cannot be used for complex software product development and is only for bug fixes.",
          r: "World-class engineering organizations use Kanban and continuous delivery for complex product features, delivering higher throughput and shorter cycle times than sprint-based teams."
        },
        {
          w: "WIP limits should be set equal to the number of developers on the team so everyone has one ticket.",
          r: "WIP limits should typically be *lower* than the number of developers, forcing engineers to pair program, review peer PRs, and swarm on bottlenecks rather than starting isolated tasks."
        }
      ],
      trade: {
        buys: [
          "Minimizes cycle time: Little's Law guarantees that constraining WIP slashes the time required to take a feature from idea to production.",
          "Extreme operational flexibility: urgent security patches or high-priority features can be pulled into development immediately without disrupting sprints.",
          "Bottleneck visualization: columns with overflowing queues instantly highlight systemic process blockages (e.g. QA or code review crunches).",
          "Zero sprint boundary overhead: eliminates sprint planning estimation marathons and artificial sprint end-of-batch panics."
        ],
        costs: [
          "Requires high self-discipline: without fixed sprint deadlines, undisciplined teams can let low-priority tasks languish.",
          "Predictability requires statistical modeling: forecasting completion dates requires Monte Carlo simulations and cycle time scatterplots.",
          "Idle time discomfort: developers must become comfortable pairing or waiting rather than pulling new work when WIP limits are reached.",
          "Coordination overhead: cross-team synchronization requires continuous communication rather than periodic batch sprint planning."
        ],
        avoid: [
          "Operating a Kanban board without WIP limits, allowing dozens of half-finished tickets to accumulate in progress.",
          "Ignoring WIP limit violations by casually bumping the limit number whenever someone wants to start a new task.",
          "Leaving blocked tickets on the board without explicit visual blocker tags and escalation protocols.",
          "Failing to review Cumulative Flow Diagrams (CFD) to spot widening bands that indicate growing systemic bottlenecks."
        ]
      }
    },
    {
      slug: "sprint",
      why: {
        before: "Software projects operated on unbounded, open-ended timelines where developers tinkered with code indefinitely, continuously postponing releases and accumulating scope creep.",
        problem: "Without temporal boundaries, projects suffered Parkinson's Law (work expands to fill time available); stakeholders had no visibility into delivery dates; and teams burned out in massive crunch periods.",
        shift: "The Scrum framework instituted the Sprint: a fixed timebox (typically 1 to 4 weeks) during which a cross-functional team commits to transforming a selected set of backlog items into a usable, potentially shippable Increment."
      },
      num: {
        t: "Sprint Dynamics & Timeboxing Variations",
        h: ["Sprint Duration", "Target Problem Domain", "Feedback Loop Frequency", "Planning & Ceremony Overhead", "Market Agility / Pivot Latency"],
        r: [
          ["1-Week Sprint", "Rapid early-stage discovery; high-uncertainty prototypes", "Extremely High (weekly working software review)", "High (ceremonies recur every 5 days; ~20% overhead)", "Ultra-Fast (pivot product direction every 7 days)"],
          ["2-Week Sprint (Industry Standard)", "Standard product development & SaaS feature delivery", "Optimal balance between deep work and stakeholder feedback", "Moderate (planning and retro every other week; ~10% overhead)", "Fast (re-align roadmap and backlog every 14 days)"],
          ["3-Week Sprint", "Complex enterprise systems with heavy manual compliance", "Moderate feedback frequency", "Low relative ceremony frequency", "Moderate (slower reaction to emerging competitive threats)"],
          ["4-Week / 1-Month Sprint", "Hardware integration, embedded systems, or regulated medical devices", "Slowest allowable Scrum timebox", "Very Low relative ceremony overhead", "Slow (one month of engineering investment before course-correction)"]
        ],
        n: "A Sprint is fundamentally a timebox: an inviolable boundary where time and quality are fixed, while scope is the only variable that may be adjusted through negotiation between the Developers and the Product Owner. The sprint operates as a mini-project governed by the Sprint Goal—a cohesive business objective that provides the team with a clear mission (e.g., 'Enable customers to checkout using Apple Pay'). To protect engineering focus, external changes that would endanger the Sprint Goal are strictly prohibited during the Sprint. If the team discovers during development that tasks were underestimated or unforeseen technical complexities arise, the team collaborates with the Product Owner to negotiate scope out of the Sprint Backlog without compromising the overarching Sprint Goal or sacrificing the Definition of Done."
      },
      miss: [
        {
          w: "A sprint can be extended by a few days if the team has not finished all committed user stories.",
          r: "Extending a sprint destroys the core premise of timeboxing; if work is unfinished, the sprint ends on time, incomplete items return to the Product Backlog, and the team inspects what happened in the Retrospective."
        },
        {
          w: "The primary purpose of a sprint is to cram as many disconnected Jira tickets as possible into two weeks.",
          r: "The purpose of a sprint is to achieve the unified Sprint Goal and deliver a cohesive, potentially shippable Increment that solves a real user problem."
        },
        {
          w: "Software can only be released to production at the very end of a sprint.",
          r: "Modern teams deploy to production continuously (multiple times a day via CI/CD); the sprint represents the cadence of planning and empirical inspection, not the exclusive deployment window."
        },
        {
          w: "Sprints are designed to enforce a constant, non-stop 100% maximum-capacity death march on developers.",
          r: "Agile Principle 8 mandates a sustainable pace indefinitely; sprints should plan for 70-80% capacity to accommodate code reviews, operational interrupts, and continuous refactoring."
        }
      ],
      trade: {
        buys: [
          "Focused engineering cadence: gives developers an uninterrupted window of deep focus without mid-sprint requirement changes.",
          "Predictable release forecasting: consistent historical sprint velocity allows leadership to forecast roadmap delivery timelines.",
          "Forced scoping discipline: tight timeboxes force product managers to decompose large epics into small, valuable vertical slices.",
          "Empirical rhythm: regular sprint reviews and retrospectives ensure problems are addressed within two weeks rather than festering."
        ],
        costs: [
          "Arbitrary work boundaries: complex tasks that naturally take 12 days must be artificially contorted to fit into a 10-day sprint.",
          "Batching latency: low-effort urgent requests must wait until the next sprint planning session unless treated as an interruption.",
          "End-of-sprint panic: developers often rush testing or take shortcuts on the final two days of a sprint to mark tickets 'Done'.",
          "Ceremony context switching: planning, review, and retro days temporarily disrupt normal coding momentum."
        ],
        avoid: [
          "Altering the Sprint Goal or injecting unrelated emergency tasks into an active sprint without canceling the sprint.",
          "Extending the sprint deadline by 3 days to 'squeeze in' unfinished stories before the demo.",
          "Operating without a clear Sprint Goal, resulting in developers working on disconnected, low-priority tasks.",
          "Sacrificing automated testing or code review standards to hit an arbitrary sprint completion deadline."
        ]
      }
    },
    {
      slug: "user-story",
      why: {
        before: "Product managers wrote 100-page Business Requirement Documents (BRDs) filled with dense technical jargon, functional specifications, and database schemas.",
        problem: "Engineers built exactly what was written in the specification without understanding who the user was or what problem they faced, resulting in technically compliant software that failed to solve the user's real-world need.",
        shift: "Extreme Programming and Agile formulated the User Story: a lightweight, conversational tool capturing who needs a capability, what they want to achieve, and why, encapsulated in the Connextra format ('As a... I want... So that...')."
      },
      num: {
        t: "Bill Wake's INVEST Criteria for High-Quality User Stories",
        h: ["INVEST Attribute", "Formal Criterion Definition", "Engineering Impact / Manifestation", "Common Anti-Pattern Violation", "Primary Quality Outcome"],
        r: [
          ["Independent", "Story can be scheduled and developed in any order without blocking dependencies", "Avoids cascading sprint blockers; stories developed concurrently", "Story B cannot start until Story A finishes DB migration", "Enables flexible backlog re-prioritization"],
          ["Negotiable", "Not an explicit contract; open for collaborative discussion between PM and Devs", "Team explores multiple technical solutions to solve the user need", "PM writes rigid UI implementation details as ironclad mandates", "Fosters creative engineering problem solving"],
          ["Valuable", "Delivers tangible, observable value to the end user or customer", "Vertical end-to-end slice delivering user capability", "Horizontal technical stories ('Create SQL database tables')", "Every deployed story provides real business value"],
          ["Estimable", "Team understands scope sufficiently to estimate relative complexity", "Clear domain boundaries and technical clarity", "Vague, ambiguous requirements with high unknown unknowns", "Enables reliable sprint planning and velocity forecasting"],
          ["Small", "Sized to be fully completed, tested, and deployed within a single sprint (1-3 days)", "Decomposed into vertical slices rather than monolithic epics", "Multi-week mega-stories that drag across 3 consecutive sprints", "Maximizes throughput and prevents end-of-sprint crunches"],
          ["Testable", "Clear, unambiguous Acceptance Criteria defining when the story is 'Done'", "Explicit Given-When-Then criteria or verifiable checklist", "Vague statements like 'The search should be fast and intuitive'", "Eliminates ambiguity between developers and QA"]
        ],
        n: "Ron Jeffries encapsulated the three vital aspects of a User Story with the '3 Cs': Card, Conversation, and Confirmation. The Card is the initial physical or digital index card representing the token of a requirement, intentionally constrained in size to prevent exhaustive specification. The Conversation is the continuous verbal dialogue between developers, product owners, and stakeholders where the true nuances of the problem are explored. The Confirmation comprises the explicit Acceptance Criteria that confirm when the story is successfully completed and satisfies the customer's intent. User stories must be sliced vertically (delivering a full-stack slice from UI to API to DB) rather than horizontally (building an entire database layer one sprint, an API the next, and UI third), ensuring that every completed story yields a functional, demonstrable capability."
      },
      miss: [
        {
          w: "A user story is just a shorter, modern replacement for a formal IEEE requirement document.",
          r: "A user story is not a requirement specification; it is an invitation to have a conversation ('a promise for a conversation') between engineers and product owners."
        },
        {
          w: "Technical tasks like database migrations, CI pipeline setup, and refactoring should be written as user stories.",
          r: "Stories represent end-user value ('As a user...'); internal technical work should be documented as technical enablers, architecture spikes, or chore tasks without forcing awkward user phrasing."
        },
        {
          w: "Writing 'As a Product Owner, I want a database table...' is a valid user story.",
          r: "The persona must be the real end user or consumer of the system, not the internal product manager, and the objective must be a business outcome, not a technical artifact."
        },
        {
          w: "Acceptance criteria should be written by the developer after finishing the code to reflect what was built.",
          r: "Acceptance criteria must be defined collaboratively *before* development begins, establishing the clear, verifiable definition of success."
        }
      ],
      trade: {
        buys: [
          "Customer empathy focus: keeps engineering centered on real human user problems rather than abstract technical machinery.",
          "Cross-functional shared understanding: collaborative refinement ensures developers, designers, and PMs share the exact same mental model.",
          "Vertical value delivery: guarantees that every merged PR delivers an end-to-end testable capability rather than orphaned layers.",
          "Flexible prioritization: small, independent stories allow product owners to re-order backlogs seamlessly based on ROI."
        ],
        costs: [
          "Refinement time investment: requires continuous collaboration and backlog grooming sessions with engineering and product.",
          "Decomposition difficulty: breaking complex enterprise problems into small vertical slices requires deep domain analysis.",
          "Under-specification risk: if conversations are not followed by clear acceptance criteria, critical edge cases can be missed.",
          "Clutter overhead: managing hundreds of fine-grained user stories in Jira or Linear can create administrative overhead."
        ],
        avoid: [
          "Writing horizontal technical stories (e.g. 'Build user database table') that deliver zero standalone user value.",
          "Treating the user story card as a rigid, non-negotiable contract rather than an invitation for creative dialogue.",
          "Writing user stories so massive that they cannot be completed, tested, and reviewed within a single sprint.",
          "Omitting concrete, testable acceptance criteria, leaving developers guessing about boundary conditions."
        ]
      }
    },
    {
      slug: "retrospective",
      why: {
        before: "Teams finished projects with no formal review of how they worked, repeatedly making the same communication blunders, deployment mistakes, and technical missteps project after project.",
        problem: "When projects suffered catastrophic delays or outages, companies conducted blame-filled 'post-mortems' where engineers were punished, destroying psychological safety and guaranteeing future mistakes would be covered up.",
        shift: "Norm Kerth formalized the Prime Directive of Retrospectives: establishing a regular, blameless ceremony where the team reflects on what went well, what went wrong, and commits to concrete experiments for continuous process improvement."
      },
      num: {
        t: "Sprint Retrospective Frameworks & Continuous Improvement Exercises",
        h: ["Retrospective Technique", "Exercise Structure / Prompt", "Target Focus / Mood", "Outcome Mechanism", "Risk / Failure Mode"],
        r: [
          ["Start / Stop / Continue", "Categories: What should we start doing? Stop doing? Keep doing?", "Action-oriented; practical operational habits", "Generates immediate behavioral change experiments", "Teams generate 20 action items and execute zero"],
          ["Mad / Sad / Glad", "Emotional triage: What made you angry? Sad/frustrated? Happy?", "Psychological safety; interpersonal team health", "Surfaces hidden team friction and morale blockers", "Turns into a venting session without concrete fixes"],
          ["4 Ls (Liked, Learned, Lacked, Longed for)", "Reflective: What did we enjoy? Discover? Miss? Wish we had?", "Balanced learning and structural discovery", "Uncovers systemic tooling and organizational gaps", "Abstract discussions that fail to translate into sprint backlog tasks"],
          ["Sailboat / Speedboat", "Metaphor: Wind (propellers), Anchors (blockers), Rocks (risks), Island (goal)", "Holistic system and risk visualization", "Identifies hidden drags slowing down team velocity", "Silly metaphors can alienate pragmatic engineers if overdone"],
          ["Timeline / Retrospective Map", "Chronological mapping of sprint events, outages, and commits", "Factual root-cause analysis of chaotic sprints", "Correlates specific events with team stress spikes", "Consumes full 2 hours constructing timeline; no time for solutions"]
        ],
        n: "The Retrospective is the single most critical engine of long-term engineering excellence. Governed by Norm Kerth's Prime Directive: 'Regardless of what we discover, we understand and truly believe that everyone did the best job they could, given what they knew at the time, their skills and abilities, the resources available, and the situation at hand.' A high-performing retrospective follows five structured phases formulated by Esther Derby and Diana Larsen: (1) Set the Stage, (2) Gather Data, (3) Generate Insights, (4) Decide What to Do, and (5) Close the Retrospective. The fatal failure mode of retrospectives is the 'Complaint Graveyard'—where engineers vent about the same recurring issues every two weeks, but never commit to actionable experiments. To prevent this, teams limit retrospective outcomes to 1 or 2 high-leverage action items assigned to specific owners and tracked directly in the next Sprint Backlog."
      },
      miss: [
        {
          w: "Retrospectives are optional fluff meetings that should be canceled whenever the team is busy coding.",
          r: "Canceling retrospectives when busy is like refusing to stop for gas because you're driving too fast; it guarantees that technical friction and process debt will continue to slow the team down."
        },
        {
          w: "The retrospective is the appropriate forum for managers to evaluate individual performance and assign blame.",
          r: "Retrospectives must be blameless and psychologically safe; introducing performance evaluation or management surveillance silences honesty and destroys team trust."
        },
        {
          w: "A great retrospective ends with a list of 15 different process improvements to implement immediately.",
          r: "Teams that attempt 15 changes fail to accomplish any; high-performing teams select exactly 1 or 2 impactful, measurable experiments for the next sprint."
        },
        {
          w: "Retrospectives only deal with soft team feelings and have nothing to do with technical engineering practices.",
          r: "The best retrospectives address technical friction: slow CI builds, flaky tests, broken staging environments, missing test doubles, and poor API contracts."
        }
      ],
      trade: {
        buys: [
          "Continuous process evolution: team gets systematically faster, happier, and more reliable with every single iteration.",
          "High psychological safety: blameless reflection fosters vulnerability, honest communication, and mutual accountability.",
          "Early problem remediation: catches interpersonal tensions, burnout, and technical friction before they escalate into crises.",
          "Team empowerment: gives developers autonomy over their own working environment and operational processes."
        ],
        costs: [
          "Time investment: dedicating 1 to 1.5 hours per sprint consumes valuable developer and team capacity.",
          "Vulnerability discomfort: honest reflection requires emotional maturity and can be uncomfortable for defensive team members.",
          "Cynicism risk: if management repeatedly blocks team action items, developers become cynical and disengage.",
          "Facilitation skill requirement: requires skilled, impartial facilitation to prevent dominant personalities from monopolizing the conversation."
        ],
        avoid: [
          "Turning the retrospective into a finger-pointing blame session when things go wrong in production.",
          "Generating a long list of action items that are never reviewed or executed in subsequent sprints.",
          "Inviting senior executives or HR personnel whose presence inhibits open, candid engineering discussions.",
          "Skipping the retrospective repeatedly under the excuse that 'we have too much feature work to do'."
        ]
      }
    },
    {
      slug: "waterfall",
      why: {
        before: "Early commercial computing projects in the 1950s and 1960s were chaotic, undisciplined, and plagued by runaway budgets, prompting computer scientists to look for structured engineering methodologies.",
        problem: "Software was treated like physical civil engineering (e.g. building a bridge), where requirements, architecture, construction, and inspection must follow a strict, non-reversible linear sequence.",
        shift: "Winston W. Royce described the linear sequential model in 1970 (later termed Waterfall), dividing the software development lifecycle into distinct, sequential phases: Requirements, Design, Implementation, Verification, and Maintenance."
      },
      num: {
        t: "Waterfall Linear Stages vs Empirical Software Realities",
        h: ["Waterfall Stage", "Primary Phase Output", "Phase Exit Gate", "Inherent Assumption", "Failure Mechanics in Complex Software"],
        r: [
          ["Requirements Analysis", "Exhaustive Business Requirements Document (BRD)", "Formal stakeholder sign-off", "Customers know exactly what they need years in advance", "Requirements change by 2% - 5% per month in dynamic competitive markets"],
          ["System Design", "Detailed technical architecture & UML specifications", "Architecture Review Board approval", "Architecture can be validated on paper prior to writing code", "Paper architectures encounter fatal performance and concurrency bottlenecks in code"],
          ["Implementation (Coding)", "Source code written to match design specs", "Code freeze; hand-off to QA", "Coding is mere mechanical translation of pre-existing specs", "Engineers discover unhandled edge cases and contradictions in the original specs"],
          ["Verification (Testing)", "System integration, regression, and QA sign-off", "Zero critical defects reported", "Testing is a final downstream quality assurance checkpoint", "Massive defect explosion; integration bugs discovered too late to fix cleanly"],
          ["Deployment & Maintenance", "Production rollout and operational support", "Final project sign-off", "Software is complete and enters permanent maintenance mode", "Product rejected by end users; multi-million dollar investments written off"]
        ],
        n: "In the pure Waterfall model, progress flows strictly downwards like a cascade: each phase must be 100% complete and formally approved through rigorous exit documentation before the subsequent phase can begin. Feedback between phases is minimized or prohibited. Winston Royce's original 1970 paper actually warned that the pure linear model was flawed and risky, advocating for feedback loops between adjacent steps. However, defense contractors and government agencies codified the rigid linear model into standards like DoD-STD-2167A. Waterfall fails on complex software projects because it delays the discovery of high-risk integration, architectural, and user-acceptance defects until the very end of the multi-year project lifecycle, when the cost of making architectural changes is at its mathematical peak."
      },
      miss: [
        {
          w: "Winston Royce invented Waterfall and recommended it as the ideal way to build modern software.",
          r: "Royce's 1970 paper explicitly stated that the linear approach was 'risky and invites failure', and he proposed iterative cycles with prototypes to mitigate its flaws."
        },
        {
          w: "Waterfall is always completely useless and has no valid use cases in any modern engineering context.",
          r: "Waterfall remains effective in environments with physical hardware constraints, unchangeable regulatory statutes, and fully known, immutable requirements (e.g. ASIC chip fabrication, rocket flight firmware)."
        },
        {
          w: "In Waterfall, testing happens continuously throughout the development process.",
          r: "Pure Waterfall sequesters testing into a discrete downstream phase after all development is 100% finished, leading to the dreaded 'testing crunch' at project deadlines."
        },
        {
          w: "Waterfall projects deliver high customer satisfaction because requirements are documented in exhaustive detail upfront.",
          r: "Empirical studies (The Standish Group CHAOS report) revealed that Waterfall projects fail at triple the rate of Agile projects because user needs evolve faster than the project can deliver."
        }
      ],
      trade: {
        buys: [
          "Upfront contractual clarity: fixed scope, fixed budget, and fixed timeline defined clearly for procurement contracts.",
          "Exhaustive documentation: creates massive documentation archives detailing every design decision and system specification.",
          "Simple project tracking: progress is easily mapped to visual Gantt charts and phase-gate milestone reviews.",
          "Clear role specialization: distinct phases align with specialized departmental silos (analysts, architects, coders, testers)."
        ],
        costs: [
          "Extreme risk of total project failure: high-risk architectural bugs and user mismatches are discovered at the very end of the schedule.",
          "Zero adaptability: rigid change control boards penalize and resist incorporating new customer feedback.",
          "Delayed time-to-value: customers receive zero working software until months or years after project inception.",
          "Integration nightmare: integrating code written by separate teams over months in a late 'big-bang' phase creates catastrophic defects."
        ],
        avoid: [
          "Applying Waterfall to dynamic web applications, consumer mobile apps, or startup products with high uncertainty.",
          "Delaying integration and automated testing until the final months of a multi-year project.",
          "Assuming customers will be satisfied with a product simply because it adhered to a three-year-old requirements document.",
          "Refusing to incorporate critical market feedback due to bureaucratic change control board penalties."
        ]
      }
    },
    {
      slug: "software-development-life-cycle",
      why: {
        before: "Early computer programming was an ad-hoc, chaotic craft where programmers wrote code in isolation without planning, testing, or maintenance protocols, resulting in software that frequently crashed and was impossible to modify.",
        problem: "The 1968 NATO Software Engineering Conference coined the term 'Software Crisis': projects routinely ran 200% over budget, missed deadlines by years, and delivered defective, unmaintainable codebases.",
        shift: "Computer scientists formalized the Software Development Life Cycle (SDLC): a structured framework of repeatable stages spanning conception, requirements, design, implementation, testing, deployment, and ongoing maintenance."
      },
      num: {
        t: "SDLC Phases & Evolution Across Methodological Paradigms",
        h: ["SDLC Phase", "Primary Objective", "Modern DevOps/CI/CD Manifestation", "Key Engineering Artifact", "Risk if Bypassed"],
        r: [
          ["Planning & Requirements", "Define business problem, feasibility, and functional scope", "Continuous product discovery; user story mapping; RFCs", "PRDs, User Stories, Acceptance Criteria, System Spikes", "Building the wrong product that fails to solve user needs"],
          ["System Architectural Design", "Architect system topology, data models, and API interfaces", "Distributed systems modeling; ADRs; schema-first design", "ADRs, OpenAPI schemas, DB entity-relationship models", "Unscalable architectures, data corruption, and massive technical debt"],
          ["Implementation (Coding)", "Translate design into production-grade executable software", "Trunk-based development, pair programming, automated linting", "Clean source code, unit test suites, modular components", "Buggy, unreadable spaghetti code that cannot be maintained"],
          ["Verification (Testing)", "Validate correctness, performance, security, and contracts", "Automated CI test matrix (unit, integration, mutation, SAST)", "Automated test reports, security scans, coverage metrics", "Releasing catastrophic defects, vulnerabilities, and data loss into production"],
          ["Deployment & Release", "Deliver software artifact into production environments", "GitOps, continuous deployment, canary rollouts, blue-green", "Docker images, Helm charts, Terraform infrastructure", "Outages during releases, broken migrations, and service downtime"],
          ["Operations & Maintenance", "Monitor system health, resolve incidents, observe telemetry", "Observability (metrics, logs, traces), automated SLO alerts", "Grafana dashboards, incident runbooks, post-mortems", "Silent production outages, unmonitored memory leaks, and customer churn"]
        ],
        n: "The Software Development Life Cycle (SDLC) represents the overarching process model encompassing all activities required to conceive, build, verify, deploy, and retire software assets. Over six decades, the SDLC has evolved across four major paradigms: (1) Linear Sequential (Waterfall), where phases occurred in strict chronological silos; (2) Iterative / Spiral (Boehm), introducing risk-driven cyclic prototyping; (3) Agile, compressing cycles into two-week cross-functional sprints; and (4) Modern Continuous DevOps / DevSecOps. In the modern continuous SDLC paradigm, the traditional phases are no longer temporal stages separated by months; instead, they operate concurrently as a continuous loop (the DevOps infinity loop). Automated pipelines run static security analysis, unit tests, container builds, and canary deployments in minutes, unifying development, testing, security, and operations into a continuous, audited discipline."
      },
      miss: [
        {
          w: "SDLC is just another name for the Waterfall methodology.",
          r: "Waterfall is merely one specific historical implementation of SDLC; modern SDLC encompasses Agile, Scrum, Kanban, Extreme Programming, and continuous DevOps delivery pipelines."
        },
        {
          w: "The SDLC ends once the software is successfully deployed to production.",
          r: "Over 75% of the total lifecycle cost of software occurs in the post-deployment Operations & Maintenance phase (bug fixes, monitoring, dependency patching, scaling)."
        },
        {
          w: "Following an SDLC slows down high-performing engineering startups.",
          r: "A lightweight, modern SDLC with automated testing and continuous integration accelerates startups by eliminating catastrophic regressions and chaotic rewrites."
        },
        {
          w: "Security should be treated as a separate phase at the very end of the SDLC.",
          r: "Waiting until the end of the SDLC to check security leads to massive delays; 'Shift-Left' security embeds automated SAST, DAST, and dependency scanning into every commit."
        }
      ],
      trade: {
        buys: [
          "Predictable software delivery: provides an organized, repeatable framework that transforms software from a craft into an engineering discipline.",
          "High software quality: formal verification, code reviews, and testing stages eliminate defects before reaching end users.",
          "Clear stakeholder visibility: gives business leadership transparent milestones and progress tracking throughout the development process.",
          "Reduced lifecycle costs: catching architectural and design flaws in early SDLC phases is 10x to 100x cheaper than fixing them in production."
        ],
        costs: [
          "Process overhead: establishing and adhering to SDLC phases requires administrative tracking and tooling investment.",
          "Risk of bureaucratic ossification: dogmatic organizations can turn SDLC stages into slow, heavyweight gatekeeping committees.",
          "Training and alignment requirements: all team members must understand their roles and responsibilities across the lifecycle.",
          "Toolchain maintenance: orchestrating modern SDLC tooling (Jira, GitHub, Docker, Kubernetes, Datadog) requires dedicated platform engineering."
        ],
        avoid: [
          "Skipping requirements alignment and architectural planning to jump straight into unstructured coding.",
          "Treating testing and security as downstream afterthoughts rather than embedding them continuously throughout the cycle.",
          "Neglecting the operations and maintenance phase, leading to unmonitored production systems and technical bankruptcy.",
          "Imposing rigid, heavyweight phase-gate bureaucracy that paralyzes developer velocity on lightweight internal tools."
        ]
      }
    }
  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
