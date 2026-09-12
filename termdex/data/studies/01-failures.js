/* Case studies — Failures & Outages. */
TD.addStudies("failures", [

{
 t: "Knight Capital",
 s: "$440 million in 45 minutes",
 y: 2012, when: "1 August 2012",
 g: ["deployment", "finance", "incident", "dead code"],
 tldr: "A trading firm deployed new code to eight servers and got it onto seven. The eighth still ran a decommissioned test program that the new release had quietly reactivated, and it began buying high and selling low across 154 stocks. Forty-five minutes later Knight Capital had lost roughly $440 million — more than the company was worth. It was acquired within five months.",
 say: [
  "It is the canonical argument for deleting dead code rather than leaving it behind a flag.",
  "The deploy was manual and nobody verified all eight servers had it — the failure was in the process, not the algorithm.",
  "The part people forget: the rollback made it worse, because they reverted the new code onto the seven good servers and spread the old behaviour.",
  "It is why every trading system now has a kill switch someone is authorised to pull without asking."
 ],
 b: [
  { h: "What happened" },
  { p: "Knight Capital was one of the largest market makers in US equities, handling around 10% of volume in listed stocks. On 1 August 2012 the NYSE was launching a new Retail Liquidity Program, and Knight had written new code in its order router, SMARS, to participate." },
  { p: "The new code reused a flag that had previously activated **Power Peg** — an internal test program, retired in 2003, that deliberately bought high and sold low to exercise the system. Power Peg had not been deleted. It had been left in the codebase, dormant, for eight years." },
  { p: "A technician deployed the new release manually to Knight's eight production servers over the course of a week. Seven received it. One did not. On that eighth server, the flag now meant *turn on the new logic* to the rest of the fleet and *turn on Power Peg* to itself." },

  { h: "The 45 minutes" },
  { tl: [
    { t: "09:30", d: "Markets open. The eighth server begins routing orders through the reactivated Power Peg logic." },
    { t: "09:31", d: "Knight starts sending orders at a rate far beyond anything normal — eventually around four million orders in 45 minutes, against a parent order set of about 212." },
    { t: "~09:32", d: "Email alerts referencing `Power Peg` had actually been sent an hour earlier, before the open. They were not flagged as critical and nobody had read them." },
    { t: "09:30–10:15", d: "Engineers try to diagnose a system they cannot see clearly. There is no kill switch — no single control to stop order flow." },
    { t: "~09:45", d: "Someone rolls back the new code. Because the new code was the correct code, this removes the working logic from the seven healthy servers and spreads the broken behaviour across the fleet. Volume increases." },
    { t: "10:15", d: "Order flow is finally stopped, 45 minutes after the open. Knight holds a multi-billion dollar unwanted position." }
  ] },
  { p: "Knight had bought high and sold low across 154 stocks, executing about 397 million shares. Unwinding the position cost roughly $440 million — against a company whose market capitalisation was around $296 million the previous day." },

  { h: "Why it keeps getting cited" },
  { p: "Every element of this failure is ordinary. There was no exotic bug, no zero-day, no adversary. There was old code nobody deleted, a manual deployment nobody verified, alerts nobody was watching, and a rollback performed without understanding what was actually wrong." },
  { n: "The rollback is the detail worth internalising. Reverting is the right instinct during an incident, and it is the correct first move in the overwhelming majority of cases. But it is a mitigation, not a diagnosis — and when the new code is the healthy code, reverting spreads the failure. Roll back first, yes; verify the blast radius shrank, always.",
    nt: "The counterintuitive lesson" },
  { p: "The SEC charged Knight with violating the Market Access Rule, and the firm paid a $12 million penalty. Knight was acquired by Getco in December 2012, four months after the incident. As an independent company, it did not survive the year." },

  { h: "What changed" },
  { l: [
   "Dead code became something you delete, not something you disable. A flag that has been off for eight years is not a safety measure, it is a loaded gun.",
   "Deployment automation stopped being a nice-to-have in finance. A human copying files to eight servers will eventually copy them to seven.",
   "Kill switches became standard, along with the organisational answer to *who is allowed to pull it* — the answer being anyone, immediately.",
   "Pre-trade risk limits are now regulated, so a system cannot exceed position or order-rate thresholds regardless of what the software believes."
  ] }
 ],
 k: [
  "Dead code left behind a flag is a live risk, not a dormant one.",
  "A manual deploy is not complete until you have verified every target, not just the ones that reported success.",
  "Rollback is mitigation, not diagnosis — confirm the blast radius actually shrank.",
  "An alert nobody reads is identical to an alert that never fired."
 ],
 r: ["Deployment", "Feature Flag", "Rollback", "Canary Deployment", "Technical Debt", "Monitoring", "Incident Response"],
 src: [
  { t: "SEC administrative proceeding against Knight Capital Americas LLC (2013)", u: "https://www.sec.gov/litigation/admin/2013/34-70694.pdf" },
  { t: "Knight Capital Group — SEC Form 8-K, August 2012", u: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=0001060749" }
 ]
},

{
 t: "The S3 Outage",
 s: "A typo, four hours, and a third of the web",
 y: 2017, when: "28 February 2017",
 g: ["aws", "cloud", "incident", "blast radius"],
 tldr: "An AWS engineer running a routine playbook to remove a few billing servers mistyped one parameter and removed far more capacity than intended — including subsystems that S3 in us-east-1 could not run without. Restarting them took hours because nobody had fully restarted them at that scale in years. Slack, Trello, Quora and a long tail of the internet went down with it, and so did the AWS status dashboard, because its status icons were hosted on S3.",
 say: [
  "It is the standard example of blast radius: the command was authorised and routine, the parameter was wrong, and there was no guard on how much it could remove.",
  "The recovery was slow because the restart path had never been exercised at that size — a system that has been up for years has an untested boot sequence.",
  "The best detail is that the status page could not report the outage because it depended on the thing that was down.",
  "It is also why people say *us-east-1 is the internet's single point of failure* — it is the oldest and busiest region, and the default in far too many configs."
 ],
 b: [
  { h: "What happened" },
  { p: "At 09:37 PST, an authorised engineer on the S3 billing team was following an established playbook to take a small number of servers offline. The command took a parameter for how much capacity to remove. The parameter was entered incorrectly, and a much larger set of servers was removed than intended." },
  { p: "Two of the affected subsystems were not billing infrastructure at all. One was the **index subsystem**, which holds the metadata and location information for every object in the region — it answers every GET, LIST, PUT and DELETE. The other was the **placement subsystem**, which allocates storage for new objects. Removing enough capacity from either takes S3 down." },

  { h: "Why recovery took four hours" },
  { p: "Both subsystems required a full restart. AWS had been growing S3 continuously for years, and while the systems were designed to be restarted, the restart had not been performed at this scale for a long time. The safety checks that run on boot — validating the integrity of the metadata — took far longer than anyone had modelled." },
  { tl: [
    { t: "09:37 PST", d: "The mistyped command removes a large block of capacity." },
    { t: "09:37–11:37", d: "The index subsystem restarts. Nothing in S3 us-east-1 can serve requests." },
    { t: "11:37", d: "Index subsystem recovers. Retrieval begins working again." },
    { t: "13:18", d: "The placement subsystem finishes recovering; PUTs work again. S3 is operational." },
    { t: "Through the afternoon", d: "Dependent services — EC2 instance launches, EBS volumes, Lambda — drain their backlogs and recover." }
  ] },

  { h: "The dependency nobody had drawn" },
  { p: "The AWS Service Health Dashboard was supposed to be how customers learned about this. It could not update, because the console's status icons were served from S3 in the same region. For a significant part of the outage AWS communicated through Twitter, while the dashboard showed everything green." },
  { n: "This is the most-quoted part of the incident, and it generalises well beyond AWS. Your monitoring, your alerting, your status page and your incident-management tooling should not depend on the systems they are there to report on. If the only way to declare an incident is a service that is currently down, you do not have incident tooling.",
    nt: "Never let the alarm depend on the building" },

  { h: "What changed" },
  { l: [
   "AWS modified the removal tool so it removes capacity more slowly and refuses to take any subsystem below a minimum required level.",
   "S3 was re-partitioned into smaller cells, so that recovery time is bounded and a single fault affects a smaller share of the region.",
   "The Service Health Dashboard was moved to run across multiple regions, so it can report on the failure of any one of them.",
   "Across the industry, `us-east-1` concentration became a standing architectural question rather than an unexamined default."
  ] },
  { p: "The wider lesson was not about AWS. Most companies discovered on that day exactly how many of their dependencies terminated in a single S3 bucket in a single region — and that they had never written it down." }
 ],
 k: [
  "Administrative tooling needs guard rails proportional to its blast radius, because the command will eventually be mistyped.",
  "A system that has been running for years has an untested restart path.",
  "Status pages, alerting and incident tooling must not depend on the systems they report on.",
  "Region concentration is an architectural decision even when nobody made it deliberately."
 ],
 r: ["Object Storage", "High Availability", "Disaster Recovery", "Monitoring", "Observability", "Incident Response", "Graceful Degradation", "Runbook"],
 src: [
  { t: "AWS — Summary of the Amazon S3 Service Disruption in the Northern Virginia (US-EAST-1) Region", u: "https://aws.amazon.com/message/41926/" }
 ]
},

{
 t: "Therac-25",
 s: "When a race condition killed people",
 y: 1987, when: "1985–1987",
 g: ["safety-critical", "race condition", "medical", "concurrency"],
 tldr: "A radiation therapy machine delivered massive overdoses to at least six patients, three of whom died. The manufacturer had removed the hardware interlocks present in earlier models and relied on software instead — software containing a race condition that a fast, experienced operator could trigger by editing the treatment screen within about eight seconds. It is the case study that established software as a safety-critical engineering discipline.",
 say: [
  "It is the reason safety-critical software is a regulated discipline with independent review, rather than something a single developer signs off.",
  "The root cause people quote is the race condition, but the deeper failure was removing hardware interlocks because *the software has been reliable so far*.",
  "The machine's error messages said things like `MALFUNCTION 54` with no explanation, and operators had been trained to dismiss them because they happened constantly.",
  "Nancy Leveson's investigation is the definitive account — it is genuinely worth reading, and it is about organisational failure at least as much as code."
 ],
 b: [
  { h: "The machine" },
  { p: "The Therac-25 was a linear accelerator built by Atomic Energy of Canada Limited, used to treat cancer. It could operate in two modes: a low-power electron beam applied directly, and a high-power X-ray mode where a much stronger beam — roughly 100 times the energy — strikes a metal target that converts it into therapeutic X-rays." },
  { p: "The high-power mode is only safe with the target in place. Without it, the patient receives the raw beam. Earlier models, the Therac-6 and Therac-20, had **hardware interlocks**: physical circuits that made it electrically impossible to fire the high-power beam unless the target was correctly positioned." },
  { p: "The Therac-25 removed them. Cost and mechanical simplicity were the drivers, and the reasoning was that the software had been in use on the previous machines without incident, so it could be trusted to enforce the safety conditions alone." },

  { h: "The race condition" },
  { p: "The control software was written in assembly by a single developer, and used concurrent tasks that shared variables without adequate synchronisation. The specific defect involved the treatment setup routine and the data entry routine running concurrently." },
  { p: "An operator would select X-ray mode, which begins moving the target into place — a process taking several seconds. If the operator then noticed a mistake and quickly edited the screen to electron mode and pressed return, the software would update the treatment parameters but a concurrent task had already passed the point where it re-checked the magnet position. The machine fired the high-power beam with the target out of position." },
  { n: "The trigger was operator *speed*. Trainee operators, typing slowly, never hit it. Experienced operators who knew the screens by heart and could correct an entry in under eight seconds hit it repeatedly. The bug was invisible during testing precisely because testers were unfamiliar with the interface.",
    nt: "Why testing missed it" },
  { p: "A separate defect in a different failure mode involved a one-byte counter that incremented on each setup pass. When it overflowed to zero — roughly every 256 passes — a safety check was skipped." },

  { h: "The organisational failure" },
  { p: "Six accidents occurred between 1985 and 1987 in Georgia, Texas, Washington and Ontario. Patients received estimated doses in the region of 100 times the intended amount. At least three died from the radiation." },
  { l: [
   "When early accidents were reported, AECL investigated and stated the machine could not have overdosed anyone. There was no mechanism to detect that it had — no independent dosimetry that would have caught it.",
   "The machine displayed errors constantly, identified only by number. Operators had learned to dismiss `MALFUNCTION` codes because they occurred many times a day and were almost always spurious.",
   "The software had never been independently reviewed. The safety analysis performed for the machine treated software failure as improbable and assigned it a very low probability without justification.",
   "There was no mechanism for hospitals to share incident reports with each other, so each site believed its accident was unique."
  ] },

  { h: "What changed" },
  { p: "The Therac-25 is why medical device software is regulated as a safety-critical system, why the IEC 62304 and related standards exist, and why safety cases must now argue about software explicitly rather than assuming hardware will catch failures." },
  { p: "More broadly it established a principle that engineers still restate: **a safety property enforced only in software is not a safety property.** Where the consequence is physical and irreversible, there should be a mechanism that cannot be defeated by a logic error — an interlock, a mechanical stop, an independent monitor." }
 ],
 k: [
  "Replacing a hardware interlock with a software check removes a guarantee and substitutes a hope.",
  "Concurrency defects hide from testers whose usage patterns differ from real operators.",
  "Errors that fire constantly train people to ignore them, which disables the whole warning channel.",
  "*It has worked so far* is not evidence of safety when nothing was measuring whether it worked."
 ],
 r: ["Race Condition", "Concurrency", "Mutex", "Integer Overflow", "Unit Test", "Code Review", "Firmware", "Formal Verification"],
 src: [
  { t: "Leveson & Turner — An Investigation of the Therac-25 Accidents, IEEE Computer (1993)", u: "https://web.stanford.edu/class/cs240/old/sp2014/readings/therac-25.pdf" }
 ]
},

{
 t: "Ariane 5 Flight 501",
 s: "Reused code, one unchecked conversion, 39 seconds",
 y: 1996, when: "4 June 1996",
 g: ["aerospace", "integer overflow", "code reuse", "redundancy"],
 tldr: "Thirty-nine seconds after launch, the Ariane 5 rocket destroyed itself. The cause was a 64-bit floating point value converted into a 16-bit signed integer without a range check, in navigation software inherited unchanged from the Ariane 4. The value was larger on the Ariane 5's trajectory than it could ever have been on the Ariane 4's. The backup computer failed first, running the same code, milliseconds before the primary.",
 say: [
  "It is the definitive example of why reused code needs its assumptions re-validated against the new environment, not just its behaviour re-tested.",
  "The redundancy was useless because both computers ran identical software — identical redundancy protects against hardware failure and nothing else.",
  "The code that failed was not even needed in flight. It was an alignment routine left running for 40 seconds after liftoff to satisfy an Ariane 4 requirement that no longer applied.",
  "Cost estimates are usually quoted around $370 million for the launcher and payload."
 ],
 b: [
  { h: "What happened" },
  { p: "Ariane 5 was Europe's new heavy launcher, carrying four Cluster scientific satellites on its maiden flight. Thirty-seven seconds after main engine ignition it veered sharply off course, began to break up under aerodynamic load, and its automatic self-destruct triggered. The whole flight lasted 39 seconds." },

  { h: "The chain" },
  { tl: [
    { t: "H+0s", d: "Liftoff. The Inertial Reference System (SRI) continues running its pre-launch horizontal alignment routine — a function with no purpose after liftoff, retained from the Ariane 4 to allow a quick restart during a late launch hold." },
    { t: "H+36.7s", d: "The horizontal velocity value exceeds what a 16-bit signed integer can hold. The conversion from 64-bit float is unprotected, and the Ada runtime raises an operand error." },
    { t: "H+36.7s", d: "The backup SRI, running byte-identical software with byte-identical inputs, has already failed for the same reason milliseconds earlier. It is offline." },
    { t: "H+36.7s", d: "The active SRI shuts itself down, as designed, and outputs a diagnostic bit pattern on the data bus." },
    { t: "H+37s", d: "The on-board computer reads that diagnostic pattern as though it were flight attitude data. It commands a large nozzle deflection to correct an attitude error that does not exist." },
    { t: "H+39s", d: "The vehicle breaks up under aerodynamic load. Self-destruct triggers." }
  ] },

  { h: "Four failures, not one" },
  { l: [
   "**Reuse without re-validation.** The alignment code was correct for the Ariane 4, whose trajectory produced smaller horizontal velocity values. The Ariane 5 flew a different profile. The software was proven — against a different set of physical assumptions.",
   "**Selective protection, undocumented.** Of seven conversions in the module, four were left unprotected against integer overflow. That was a deliberate decision, justified on CPU-load grounds by an analysis showing those values could not overflow — an analysis based, again, on Ariane 4 trajectory data.",
   "**Identical redundancy.** Two SRIs running the same software given the same inputs will fail at the same moment. This protects against a component burning out and nothing else.",
   "**Shutdown as the failure response.** The software treated an unexpected numeric condition as unrecoverable and stopped. For a navigation system on a flying rocket, graceful degradation — continuing with reduced-quality data — would have been survivable; the diagnostic output being mistaken for attitude data was catastrophic."
  ] },
  { n: "The inquiry board noted that the alignment function served no purpose at all once the rocket had lifted off. It was retained because the Ariane 4 needed the ability to resume a countdown after a late hold. Nobody revisited the requirement when the launcher changed. The most expensive single line of code in the flight was executing a requirement that no longer existed.",
    nt: "The code did not need to be running" },

  { h: "What changed" },
  { p: "The inquiry board's recommendations became standard practice in safety-critical aerospace software: no unprotected conversions, justification files for every deliberate omission of a check, unit test coverage against realistic trajectory data rather than nominal values, and — importantly — treating software as part of the flight system to be qualified, rather than as an already-proven component carried over. Where the budget allows, formal verification is now used to prove the absence of exactly this class of arithmetic fault." },
  { p: "The board also recommended that redundant systems where possible use diverse implementations, though in practice the cost of true N-version programming means most systems settle for identical software plus a great deal more testing." }
 ],
 k: [
  "Reused code carries its original assumptions with it; the new environment does not honour them automatically.",
  "Running identical software on two machines is redundancy against hardware failure only.",
  "Shutting down is a reasonable failure response on the ground and often the worst one in flight.",
  "Code that serves no purpose in the current design should be removed, not left running."
 ],
 r: ["Integer Overflow", "Technical Debt", "High Availability", "Graceful Degradation", "Unit Test", "Formal Verification", "Compiler"],
 src: [
  { t: "ESA/CNES — Ariane 501 Inquiry Board Report (1996)", u: "https://esamultimedia.esa.int/docs/esa-x-1819eng.pdf" }
 ]
},

{
 t: "CrowdStrike",
 s: "8.5 million machines, one content file",
 y: 2024, when: "19 July 2024",
 g: ["kernel", "staged rollout", "endpoint security", "recovery"],
 tldr: "A routine content update to CrowdStrike's Falcon security agent contained a mismatch between what a template expected and what it was given, causing an out-of-bounds read inside a kernel-mode driver. Around 8.5 million Windows machines blue-screened, many into boot loops. Airlines grounded, hospitals diverted, broadcasters went dark — and recovery largely required someone to physically touch each machine.",
 say: [
  "The critical distinction is that this was a *content* update, not a code update, so it bypassed the staged rollout customers believed protected them.",
  "It ran in the Windows kernel, which is why a bad read was a blue screen rather than a crashed process.",
  "The recovery was the real story: boot into Safe Mode and delete a file, per machine, and BitLocker meant you needed the recovery key first.",
  "It is now the standard argument that *everything* which reaches production is a deployment, whatever your internal taxonomy calls it."
 ],
 b: [
  { h: "What happened" },
  { p: "CrowdStrike Falcon is an endpoint detection and response agent installed on corporate Windows fleets. To detect new attack techniques quickly, it ships two kinds of update: **Sensor Content**, which is part of the signed driver and goes through staged release, and **Rapid Response Content**, which is configuration data interpreted by the already-installed sensor and ships many times a day." },
  { p: "On 19 July 2024 CrowdStrike shipped a Rapid Response Content update — Channel File 291 — targeting a named-pipe technique used in some attacks. The sensor's template for this detection expected a certain number of input fields. The update supplied more than the template had been built to handle." },
  { p: "A validator in CrowdStrike's build pipeline was supposed to catch exactly this mismatch. Because of a bug in that validator, the mismatched content was marked valid and released. When the sensor loaded it, it performed an out-of-bounds read. The sensor runs as a kernel-mode driver, so the fault was not a crashed application — it was a bugcheck. Blue screen, then reboot, then the same content file, then blue screen again." },

  { h: "Why it spread so fast" },
  { p: "Rapid Response Content was not subject to the phased rollout that governed sensor releases. It went to every machine configured to receive it, effectively at once. Customers who believed they were on a delayed update ring discovered that the ring applied to the sensor binary, not to the content the sensor consumed." },
  { n: "This is the transferable lesson and it has nothing to do with security software. Teams routinely classify some changes as *not deployments* — config flags, feature toggles, ML model weights, rules files, DNS records, IAM policies. To the blast radius, that distinction does not exist. If it reaches production and can change behaviour, it needs staged rollout, automated health checks and an automatic rollback path.",
    nt: "Config is a deployment" },

  { h: "The recovery problem" },
  { p: "CrowdStrike identified and reverted the content within about 78 minutes. That fixed machines which were still able to reach the network. It did not fix the machines already caught in a boot loop, because they never got far enough to download anything." },
  { l: [
   "The documented remediation was to boot into Safe Mode or the Recovery Environment and delete the offending channel file by hand.",
   "On BitLocker-encrypted machines — which is most corporate laptops — that required the recovery key first, and the key escrow systems were themselves sometimes running on affected servers.",
   "Cloud VMs could not simply be reimaged where the affected disk held state, and remote workers had no physical access to a machine that would not boot.",
   "Delta Air Lines cancelled roughly 7,000 flights over several days and subsequently sued CrowdStrike; CrowdStrike disputed the claims. Estimates of total economic damage across all affected organisations run into billions of dollars."
  ] },

  { h: "What changed" },
  { l: [
   "CrowdStrike committed to staged deployment of Rapid Response Content, with customer control over update rings and the ability to delay content as well as sensor versions.",
   "Additional validation and a fixed content validator, plus more error handling in the sensor's content interpreter so malformed input degrades rather than faulting.",
   "Microsoft opened a wider conversation about reducing the need for security vendors to run in kernel mode at all, pointing toward user-mode alternatives on Windows.",
   "Across the industry, *can we recover this without physical access* became a standard question in disaster recovery planning."
  ] }
 ],
 k: [
  "Anything that reaches production and changes behaviour is a deployment, whatever you call it internally.",
  "Code running in the kernel converts an ordinary bug into an unbootable machine.",
  "A fix that requires the machine to be online cannot repair a machine that will not boot.",
  "Test your recovery path against the case where remote access is exactly what you have lost."
 ],
 r: ["Kernel", "Canary Deployment", "Rollback", "Deployment", "Disaster Recovery", "Blue-Green Deployment", "Incident Response", "Operating System"],
 src: [
  { t: "CrowdStrike — External Technical Root Cause Analysis, Channel File 291", u: "https://www.crowdstrike.com/falcon-content-update-remediation-and-guidance-hub/" }
 ]
},

{
 t: "Toyota Unintended Acceleration",
 s: "Spaghetti code, global variables, and people died",
 y: 2009, when: "2002–2010",
 g: ["embedded", "safety-critical", "code quality", "testing"],
 tldr: "Toyota vehicles accelerated without driver input, killing people. An independent expert review of the engine control firmware found 11,000 global variables, spaghetti code with functions thousands of lines long, no MISRA compliance, and a task-death scenario in the real-time operating system that could disable the failsafe. Toyota was fined $1.2 billion and the case became the standard argument for code quality standards in safety-critical embedded software.",
 say: [
  "The expert testimony described the firmware as the worst he had ever seen — 11,000 global variables and functions that ran thousands of lines.",
  "The failsafe — cutting fuel if brakes and throttle disagreed — could itself be disabled by a task-death bug in the RTOS.",
  "There was no MISRA compliance, no static analysis, and testing was largely limited to happy-path scenarios.",
  "It is the case that made every automotive company take software quality seriously, and it is now taught in every embedded systems course."
 ],
 b: [
  { h: "What happened" },
  { p: "Between 2002 and 2010, Toyota received thousands of complaints about vehicles accelerating without throttle input. Multiple fatal crashes were attributed to the issue. Toyota initially blamed floor mats trapping the accelerator pedal, then faulty pedal mechanisms, and recalled millions of vehicles." },
  { p: "In 2013, a jury in Oklahoma found Toyota liable in a case involving a fatal crash. The critical evidence came from embedded systems experts Michael Barr and Phillip Koopman, who had been given access to Toyota's engine control unit (ECU) source code and spent eighteen months analysing it." },

  { h: "What the code looked like" },
  { l: [
   "**11,000 global variables.** The entire application was wired together through shared mutable state, making it functionally impossible to reason about which module could affect which behaviour.",
   "**Spaghetti control flow.** Individual functions ran to thousands of lines. The call graph was effectively untraceable without tooling.",
   "**No MISRA compliance.** The MISRA C coding standard exists specifically for safety-critical automotive software. Toyota's codebase violated it pervasively.",
   "**No static analysis.** Tools that could have caught categories of defects automatically were not used.",
   "**Insufficient stack protection.** Stack overflow could corrupt adjacent memory, and the RTOS had no stack-depth monitoring on critical tasks."
  ] },
  { n: "The failsafe was a function called the *task monitor*, which was supposed to detect conflicts between throttle and brake signals and cut fuel. The experts demonstrated that a specific task-death scenario in the RTOS could kill the monitor task itself, leaving the system without a failsafe — and that Toyota had not tested for this condition.",
    nt: "The failsafe that could be killed" },

  { h: "The broader lesson" },
  { p: "The code was not written by incompetent engineers. It had been developed over many years, by many teams, under schedule pressure, without the structural discipline that safety-critical code requires. Every individual shortcut was explicable. The cumulative effect was a system nobody could verify." },
  { p: "The $1.2 billion criminal penalty Toyota paid in 2014 was the largest ever imposed on an automotive company. The National Highway Traffic Safety Administration's investigation ran for years. The case is now the primary reference in arguments for static analysis, coding standards, formal verification, and independent code review in automotive and embedded software." },

  { h: "What changed" },
  { l: [
   "ISO 26262, the automotive functional safety standard, gained enforcement teeth and wider adoption after this case.",
   "MISRA C compliance became a baseline expectation, not a nice-to-have, in automotive firmware.",
   "Static analysis tools (Coverity, Polyspace, LDRA) became standard in automotive development pipelines.",
   "The case is now taught in university embedded systems and software engineering courses as the canonical example of what happens when code quality is not treated as a safety property."
  ] }
 ],
 k: [
  "Global variables at scale make reasoning about system behaviour impossible.",
  "A failsafe that can itself be disabled by a software fault is not a failsafe.",
  "Coding standards exist because the cumulative effect of individually reasonable shortcuts is a system nobody can verify.",
  "The absence of static analysis in safety-critical code is a management decision with legal consequences."
 ],
 r: ["Firmware", "Race Condition", "Mutex", "Unit Test", "Code Review", "Formal Verification", "Technical Debt"],
 src: [
  { t: "Barr — Expert testimony in Bookout v. Toyota Motor Corp. (2013)", u: "https://www.safetyresearch.net/toyota-unintended-acceleration-and-the-big-bowl-of-spaghetti-code/" },
  { t: "NHTSA/NASA — Technical Assessment of Toyota Electronic Throttle Control", u: "https://www.nhtsa.gov/staticfiles/nvs/pdf/NASA-UA_report.pdf" }
 ]
},

{
 t: "The Cloudflare Regex Outage",
 s: "One regular expression, 27 minutes, half the internet",
 y: 2019, when: "2 July 2019",
 g: ["regex", "algorithmic complexity", "waf", "deployment"],
 tldr: "A Cloudflare engineer deployed a Web Application Firewall rule containing a regular expression with catastrophic backtracking. The regex caused CPU usage to spike to 100% across every Cloudflare edge server worldwide. For 27 minutes, sites behind Cloudflare returned 502 errors — affecting roughly 10% of HTTP requests on the internet. It is the clearest real-world example of algorithmic complexity having production consequences.",
 say: [
  "A single regex took down Cloudflare's entire edge fleet — every server in every data centre hit 100% CPU simultaneously.",
  "The specific pattern was `(?:(?:\\\"[^\\\"]*)+)` — a nested quantifier that causes exponential backtracking on certain inputs.",
  "It is the best example of algorithmic complexity being a production concern, not just a textbook exercise.",
  "The WAF rules did not go through the same staged deployment as code changes, which is the same lesson CrowdStrike would learn five years later."
 ],
 b: [
  { h: "What happened" },
  { p: "Cloudflare's Web Application Firewall uses regular expressions to detect attack patterns in HTTP traffic. On 2 July 2019, an engineer deployed a new rule intended to detect a specific injection pattern. The rule contained a regular expression with nested quantifiers." },
  { p: "When the regex engine encountered certain input strings that partially matched, it entered catastrophic backtracking — the number of paths the engine must explore grows exponentially with input length. Every Cloudflare edge server began consuming 100% CPU processing these matches, and legitimate traffic could not be served." },

  { h: "Why backtracking matters" },
  { p: "Most regex engines are backtracking implementations (NFA-based). When a pattern has ambiguous branching — particularly nested repetitions like `(a+)+` or `(a|a)*` — and the input almost-but-not-quite matches, the engine tries every possible way to partition the input before concluding failure." },
  { x: { lang: "text", code:
"Pattern:  (a+)+$\nInput:    aaaaaaaaaaaaaaaaX\n\nThe engine tries:\n  (aaaaaaaaaaaaaaaa)X  — fails at X\n  (aaaaaaaaaaaaaaa)(a)X — fails\n  (aaaaaaaaaaaaaa)(aa)X — fails\n  (aaaaaaaaaaaaaa)(a)(a)X — fails\n  ... exponentially many partitions\n\n16 'a' characters = ~65,000 steps\n32 'a' characters = ~4 billion steps" } },
  { n: "This is the concept of time complexity made viscerally concrete. The regex was O(2^n) on adversarial input, and the WAF was applying it to every HTTP request. Textbook algorithmic analysis is not academic — it is the difference between a working CDN and a global outage.",
    nt: "Big-O is not academic" },

  { h: "The 27 minutes" },
  { tl: [
    { t: "13:42 UTC", d: "The WAF rule is deployed globally." },
    { t: "13:42", d: "CPU utilisation spikes to 100% across all edge locations. 502 errors begin." },
    { t: "~13:45", d: "Alerts fire. The team initially suspects an attack." },
    { t: "~13:55", d: "The WAF rule change is identified as the cause." },
    { t: "14:02", d: "A global WAF kill switch is used to disable the entire managed ruleset." },
    { t: "14:09", d: "Traffic begins recovering. Full recovery follows within minutes." }
  ] },

  { h: "What changed" },
  { l: [
   "Cloudflare migrated its WAF engine to use a regex implementation that does not backtrack (RE2-like), trading some regex features for guaranteed linear-time execution.",
   "All WAF rule changes now go through staged deployment with automatic rollback on performance regression.",
   "A CPU-time circuit breaker was added so a single rule cannot consume unbounded processing time.",
   "The incident became a widely-used teaching example for why algorithmic complexity analysis is a practical engineering skill."
  ] }
 ],
 k: [
  "Catastrophic backtracking makes a regex with nested quantifiers exponentially slow on adversarial input.",
  "Algorithmic complexity is a production concern, not a textbook abstraction.",
  "Configuration and rule changes need the same deployment discipline as code changes.",
  "Use regex engines with linear-time guarantees (RE2, Rust regex) when processing untrusted input."
 ],
 r: ["Regular Expression", "Time Complexity", "Big O Notation", "Deployment", "Canary Deployment", "Monitoring"],
 src: [
  { t: "Cloudflare — Details of the Cloudflare outage on July 2, 2019", u: "https://blog.cloudflare.com/details-of-the-cloudflare-outage-on-july-2-2019/" }
 ]
},

{
 t: "The GitLab Database Deletion",
 s: "rm -rf on production, and the backup was empty",
 y: 2017, when: "31 January 2017",
 g: ["databases", "backups", "incident", "transparency"],
 tldr: "A tired GitLab engineer, working late to fix a replication issue, accidentally ran a data deletion command on the production database instead of the staging replica. When the team went to restore from backup, they discovered that multiple backup systems had been silently failing for months. Six hours of data was permanently lost. GitLab live-streamed the entire recovery on YouTube — an unprecedented level of incident transparency that became as notable as the failure itself.",
 say: [
  "The engineer ran `rm -rf` on the wrong database directory — production instead of the staging replica he was trying to fix.",
  "Five different backup and replication mechanisms were in place. None of them worked when needed.",
  "GitLab live-streamed the recovery on YouTube and published a detailed public postmortem, which became the gold standard for incident transparency.",
  "The lesson everyone takes from it: an untested backup is not a backup."
 ],
 b: [
  { h: "What happened" },
  { p: "On 31 January 2017, GitLab.com experienced a spike in database replication lag. An engineer worked through the evening to fix it, which involved removing and re-syncing the PostgreSQL replica. Late at night, after multiple failed attempts, the engineer ran a directory removal command. On the wrong server." },
  { p: "About 300GB of live production data began being deleted. The engineer realised within seconds and stopped the command, but roughly six hours of data — issues, merge requests, comments, CI/CD data — was gone." },

  { h: "Five backup failures" },
  { l: [
   "**LVM snapshots** — not configured for the database server.",
   "**Regular PostgreSQL backups (pg_dump)** — had been silently failing because the version of pg_dump did not match the database version. Nobody had checked.",
   "**Continuous WAL archiving** — was not set up for this particular database.",
   "**Azure disk snapshots** — enabled, but only taken every 24 hours, so they would still lose a day.",
   "**S3 backup sync** — was running, but it was syncing the output of the failing pg_dump, so it was syncing empty files."
  ] },
  { n: "Each backup system had a plausible reason for existing and a plausible reason for not working. The failure was not in any individual system — it was that nobody had tested restoration from any of them end to end. A backup you have never restored from is a hope, not a plan.",
    nt: "The backup that matters is the one you have tested" },

  { h: "The response" },
  { p: "GitLab's response became as significant as the incident. They set up a public Google Doc tracking every step of the recovery. They live-streamed the work on YouTube, with engineers working through the night visible to anyone watching. The postmortem was exhaustive and named names — including that the engineer made an honest mistake while tired." },
  { tl: [
    { t: "23:00 UTC", d: "The deletion happens. Engineer stops it within seconds." },
    { t: "23:00–02:00", d: "Team discovers each backup mechanism has failed." },
    { t: "02:00 onwards", d: "Recovery begins from the Azure disk snapshot taken 6 hours earlier." },
    { t: "Next day", d: "GitLab.com is restored. Six hours of data is permanently lost." },
    { t: "Following week", d: "Detailed public postmortem is published." }
  ] },

  { h: "What changed" },
  { l: [
   "GitLab implemented automated daily backup restoration tests — a separate pipeline that restores the backup to a clean environment and verifies it works.",
   "Backup monitoring was added: alerts fire if backup size drops or backup age exceeds threshold.",
   "Production access was tightened with additional safeguards against destructive commands.",
   "The incident normalised radical transparency in postmortems across the industry."
  ] }
 ],
 k: [
  "An untested backup is indistinguishable from no backup.",
  "Multiple backup systems create an illusion of safety that evaporates when you actually need to restore.",
  "Tired engineers making mistakes is a systems problem, not a personnel problem — build guardrails.",
  "Radical transparency in incident response builds more trust than silence."
 ],
 r: ["Replication", "Disaster Recovery", "PostgreSQL", "Monitoring", "Incident Response", "Runbook"],
 src: [
  { t: "GitLab — Postmortem of database outage of 31 January 2017", u: "https://about.gitlab.com/blog/2017/02/10/postmortem-of-database-outage-of-january-31/" }
 ]
},

{
 t: "The Facebook Outage",
 s: "BGP, DNS, and the door locks that needed the internet",
 y: 2021, when: "4 October 2021",
 g: ["bgp", "dns", "networking", "blast radius"],
 tldr: "A routine maintenance command withdrew Facebook's BGP route advertisements, making every Facebook, Instagram, and WhatsApp server unreachable from the internet. DNS servers could no longer be reached either, so the domain names stopped resolving entirely. Recovery was delayed because Facebook's internal tools, remote access systems, and even the badge readers on data centre doors all depended on the infrastructure that was down. The outage lasted about six hours.",
 say: [
  "A BGP withdrawal made Facebook's IP ranges disappear from the internet's routing tables — not just slow, genuinely unreachable.",
  "DNS failed because the authoritative nameservers were inside the unreachable network, so the domain names vanished from the internet.",
  "Engineers could not fix it remotely because VPN and remote access tools ran on the same infrastructure that was down.",
  "The badge readers on the data centre doors needed the network to authenticate, so engineers initially could not get into the building."
 ],
 b: [
  { h: "The mechanism" },
  { p: "Facebook runs its own backbone network connecting its data centres, and announces routes to the internet via BGP (Border Gateway Protocol). On 4 October 2021, during routine backbone maintenance, a command was issued that unintentionally withdrew all of Facebook's BGP route announcements." },
  { p: "Within minutes, every router on the internet removed Facebook's IP prefixes from their routing tables. Packets addressed to Facebook, Instagram, WhatsApp or Messenger had nowhere to go. It was not a performance problem — the addresses ceased to exist from the internet's perspective." },

  { h: "The DNS cascade" },
  { p: "Facebook's authoritative DNS servers lived inside the network that had just become unreachable. When DNS resolvers around the world tried to look up `facebook.com`, they could not reach the nameservers to get an answer. Cached entries expired. Within minutes, `facebook.com` returned `NXDOMAIN` — domain not found — as though the domain had never existed." },
  { n: "This is the difference between a service being down and a service being unfindable. A server error returns a 500; this returned nothing at all, because the name resolution step failed before any connection was attempted. Every system worldwide that depended on Facebook's OAuth, sharing widgets or APIs failed at the DNS layer.",
    nt: "Unfindable is worse than unreachable" },

  { h: "Why recovery took six hours" },
  { l: [
   "**Remote access was down.** Facebook's VPN, internal dashboards, and remote management systems ran on the same infrastructure. Engineers could not SSH into anything.",
   "**Badge readers needed the network.** The physical access control systems in data centres authenticated against internal services that were unreachable.",
   "**The fix required physical presence.** Engineers had to physically travel to data centres and gain access to out-of-band management consoles to re-establish the BGP sessions.",
   "**Verification was slow.** Once BGP routes were restored, the cascade of DNS caches repopulating and services restarting took additional time."
  ] },
  { tl: [
    { t: "15:39 UTC", d: "BGP routes are withdrawn. Facebook disappears from the internet." },
    { t: "Within minutes", d: "DNS entries expire and stop resolving. 3.5 billion users lose access." },
    { t: "15:40–17:00", d: "Engineers cannot access systems remotely. Physical access to data centres is complicated by dependent access controls." },
    { t: "~17:00", d: "Engineers reach out-of-band consoles and begin restoring BGP." },
    { t: "~21:00 UTC", d: "Services gradually come back online. Full recovery follows." }
  ] },

  { h: "What changed" },
  { l: [
   "Facebook invested in out-of-band management systems that do not depend on the production network.",
   "Physical access systems were decoupled from production infrastructure.",
   "BGP configuration changes gained additional validation and staged rollout.",
   "The incident became the go-to teaching example for BGP and DNS in networking courses."
  ] }
 ],
 k: [
  "BGP is the routing protocol of the internet, and a withdrawal makes your entire network vanish, not just go slow.",
  "Hosting your DNS inside the network you are advertising means the name disappears with the route.",
  "Recovery tools that depend on the thing being recovered create a circular dependency that extends outages by hours.",
  "Out-of-band management is not optional for critical infrastructure."
 ],
 r: ["DNS", "TCP/IP Model", "High Availability", "Disaster Recovery", "Monitoring", "Incident Response"],
 src: [
  { t: "Meta Engineering — More details about the October 4 outage", u: "https://engineering.fb.com/2021/10/05/networking-traffic/outage-details/" }
 ]
},

{
 t: "The Morris Worm",
 s: "The first internet worm, written by a grad student",
 y: 1988, when: "2 November 1988",
 g: ["worm", "buffer overflow", "unix", "internet"],
 tldr: "Robert Tappan Morris, a Cornell graduate student, released a self-replicating program onto the early internet. It exploited a buffer overflow in fingerd, a debug backdoor in sendmail, and weak password guessing — all routine Unix attack surfaces. A bug in the reinfection-limiting code caused it to spread far faster than intended, effectively taking down about 10% of the internet's roughly 60,000 connected machines. Morris became the first person convicted under the Computer Fraud and Abuse Act.",
 say: [
  "It exploited three things: a buffer overflow in fingerd, a debug mode in sendmail, and weak passwords via rsh/rexec.",
  "The bug that made it destructive was in the code meant to prevent reinfection — it reinfected machines repeatedly, consuming all resources.",
  "It hit roughly 6,000 of the internet's 60,000 machines — about 10% of the entire internet at the time.",
  "Morris was the first person convicted under the CFAA, and later became a professor at MIT and a Y Combinator founder."
 ],
 b: [
  { h: "The mechanism" },
  { p: "The worm used three propagation methods, each targeting a common Unix service:" },
  { l: [
   "**Buffer overflow in fingerd.** The finger daemon read input into a fixed-size buffer without checking length. The worm sent a payload that overflowed the buffer, overwrote the return address, and executed arbitrary code — the classic stack-smashing attack that would dominate security research for the next two decades.",
   "**Sendmail DEBUG mode.** Many sendmail installations had a debug option enabled that allowed remote command execution. The worm used it to bootstrap itself onto machines.",
   "**Password guessing via rsh/rexec.** The worm tried a short dictionary of common passwords, the username itself, and the username reversed. It succeeded disturbingly often."
  ] },
  { p: "Once on a machine, it downloaded its own source and compiled itself — an early example of what would later be called a dropper pattern." },

  { h: "The bug in the worm" },
  { p: "Morris intended the worm to spread slowly and not disrupt systems. To prevent a machine from being reinfected, the worm checked whether a copy was already running and, if so, exited — most of the time. One in seven times, it would continue regardless, as a defence against administrators running a fake worm to immunise their machines." },
  { n: "That one-in-seven chance was the mistake. On a network where the worm could reach the same machine multiple times from different neighbours, reinfection was common. Machines ended up running dozens of copies, each consuming CPU and memory, until the system was unusable. The worm was not malicious by design — it was malicious by arithmetic.",
    nt: "The reinfection rate was wrong" },

  { h: "The aftermath" },
  { tl: [
    { t: "2 Nov 1988, evening", d: "The worm is released from MIT (not Cornell, to obscure its origin)." },
    { t: "Overnight", d: "Machines at universities, research labs and military sites are overwhelmed." },
    { t: "3 Nov 1988", d: "Administrators begin disconnecting from the network to stop reinfection. Email, at the time the primary communication method for coordinating a response, is disrupted." },
    { t: "Following days", d: "The worm is decompiled and analysed. Patches are distributed." },
    { t: "1990", d: "Morris is convicted under the Computer Fraud and Abuse Act — the first conviction under the law." }
  ] },
  { p: "Morris was sentenced to three years probation, 400 hours of community service and a $10,050 fine. He went on to complete his PhD, became a professor at MIT, and co-founded Y Combinator with Paul Graham." },

  { h: "What changed" },
  { l: [
   "CERT/CC (Computer Emergency Response Team) was created at Carnegie Mellon in direct response to the worm, establishing the model for coordinated vulnerability disclosure.",
   "Buffer overflows became the defining security research topic for the next two decades, leading eventually to stack canaries, ASLR, DEP/NX bits and memory-safe languages.",
   "The incident demonstrated that the internet's trust model — where machines freely accepted connections from peers — was fundamentally inadequate.",
   "It made computer security a field, not a hobby."
  ] }
 ],
 k: [
  "Buffer overflows in C were the dominant vulnerability class for decades, and this was the first major demonstration.",
  "Self-replicating code that is slightly more aggressive than intended can be catastrophically destructive.",
  "Coordinated incident response requires communication channels that do not depend on the thing being attacked.",
  "The internet was designed for trust between peers, and security was retrofitted — a pattern that persists."
 ],
 r: ["Buffer Overflow", "Memory Safety", "Operating System", "Shell", "Authentication", "Incident Response"],
 src: [
  { t: "Spafford — The Internet Worm Program: An Analysis, Purdue Technical Report (1988)", u: "https://spaf.cerias.purdue.edu/tech-reps/823.pdf" },
  { t: "RFC 1135 — The Helminthiasis of the Internet (1989)", u: "https://www.rfc-editor.org/rfc/rfc1135" }
 ]
},

{
 t: "Mars Climate Orbiter",
 s: "Metric versus imperial, $327 million",
 y: 1999, when: "23 September 1999",
 g: ["aerospace", "unit mismatch", "integration testing", "type safety"],
 tldr: "NASA's Mars Climate Orbiter was lost because one software component produced force values in pound-force seconds while the rest of the system expected newton seconds. Nobody caught the mismatch during integration testing. The spacecraft approached Mars 170 kilometres lower than intended and either burned up in the atmosphere or skipped off into solar orbit. A $327 million mission was lost to what is essentially a type error.",
 say: [
  "One module output pound-force seconds; the navigation system expected newton seconds. That is the entire root cause.",
  "It is the canonical argument for strong type systems — a language that distinguishes between units would have caught it at compile time.",
  "The mission specification explicitly required SI units. The ground software team used imperial. Nobody verified.",
  "It is taught in every software engineering course as the example of integration testing failure."
 ],
 b: [
  { h: "What happened" },
  { p: "Mars Climate Orbiter was launched in December 1998 to study the Martian atmosphere. Navigation required precise knowledge of the small velocity changes imparted by thruster firings during the nine-month cruise." },
  { p: "Lockheed Martin built the ground software that calculated these impulses. The specification called for SI units (newton seconds). The software produced values in pound-force seconds — a factor of roughly 4.45 off. The navigation team at JPL used these values directly, assuming they were in the specified units." },

  { h: "The trajectory" },
  { p: "Over nine months of flight, the small errors accumulated. Each thruster firing was modelled as slightly wrong. Course corrections, calculated from the incorrect trajectory, compounded the problem rather than fixing it." },
  { tl: [
    { t: "Dec 1998", d: "Launch." },
    { t: "During cruise", d: "Navigation team notices the trajectory is not matching predictions. Deviations are noted but not traced to the root cause." },
    { t: "23 Sep 1999", d: "Mars Orbit Insertion burn. The spacecraft passes behind Mars at an altitude of about 57 km instead of the planned 226 km." },
    { t: "After loss of signal", d: "The spacecraft either burned up in the atmosphere or escaped into solar orbit. Contact was never re-established." }
  ] },
  { n: "The navigation team had actually noticed anomalies during the cruise and filed reports. The investigations did not trace the problem to the unit mismatch because the ground software was treated as verified. The classic failure mode: an anomaly is observed, investigated, and closed without finding the root cause, because a subsystem is assumed correct.",
    nt: "The anomaly was seen and dismissed" },

  { h: "The type safety argument" },
  { p: "This failure is frequently cited in programming language discussions. A type system that tracks physical units — or even a simpler approach like newtype wrappers — would have caught the mismatch at compile time. `NewtonSeconds` and `PoundForceSeconds` would be different types, and passing one where the other was expected would be a type error, not a silent conversion." },
  { x: { lang: "text", code:
"// What happened (pseudocode)\nfloat thruster_impulse = compute_impulse();  // returns lbf·s\nnavigation_update(thruster_impulse);          // expects N·s\n// Compiles. Runs. Loses a spacecraft.\n\n// What a type system could enforce\nNewtonSeconds thruster_impulse = compute_impulse();  // ERROR:\n// cannot assign PoundForceSeconds to NewtonSeconds" } },

  { h: "What changed" },
  { l: [
   "NASA's mishap investigation board recommended explicit unit checks at all software interfaces, not just in specifications.",
   "Integration testing practices were tightened to verify units, coordinate frames and sign conventions across subsystem boundaries.",
   "The incident is now the standard example in arguments for dimensional analysis in code and for type systems that encode physical quantities.",
   "Subsequent Mars missions (Mars Exploration Rovers, Curiosity, Perseverance) all flew successfully."
  ] }
 ],
 k: [
  "A unit mismatch is a type error that most type systems do not catch — and it cost $327 million.",
  "Integration testing must verify the assumptions each component makes about the data it receives.",
  "Anomalies observed during operation and closed without root cause are failures waiting to compound.",
  "Specifications are not self-enforcing — someone must verify that the code matches what the spec says."
 ],
 r: ["Unit Test", "Integration Test", "Compiler", "Formal Verification", "Code Review"],
 src: [
  { t: "NASA — Mars Climate Orbiter Mishap Investigation Board Phase I Report (1999)", u: "https://llis.nasa.gov/llis_lib/pdf/1009464main1_0641-mr.pdf" }
 ]
}

]);
