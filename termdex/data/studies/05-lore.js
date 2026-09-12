/* Case studies — Laws, Moments & Lore. */
TD.addStudies("lore", [

{
 t: "Conway's Law",
 s: "You ship your org chart",
 y: 1967, when: "1967",
 g: ["architecture", "organisation", "team topology"],
 tldr: "Melvin Conway observed that any organisation designing a system produces a design that copies the organisation's own communication structure. The paper was rejected by Harvard Business Review for lack of evidence; the evidence arrived later, and it holds. The practical version is that you cannot ship an architecture your organisation is not shaped to support — and the useful corollary is that you can change the architecture by changing the organisation.",
 say: [
  "The original line is that a system's design copies the communication structure of the organisation that built it.",
  "Four teams will produce four components whether or not that is the right number.",
  "The inverse Conway manoeuvre is the actionable part: reorganise the teams to get the architecture you want.",
  "It explains most *why is our system shaped like this* questions better than any technical account does."
 ],
 b: [
  { h: "The observation" },
  { q: "Any organization that designs a system (defined broadly) will produce a design whose structure is a copy of the organization's communication structure.", by: "Melvin Conway, How Do Committees Invent? (1967)" },
  { p: "Conway's argument is mechanical rather than mystical. Designing an interface between two components requires the people responsible for them to agree, which requires communication. Where communication is easy — same team, same room, same standup — interfaces are negotiated freely and can be rich, chatty and frequently changed. Where communication is hard — different departments, different time zones, different companies — interfaces get defined once, kept narrow, and changed rarely." },
  { p: "So the system's module boundaries end up tracking the organisation's communication boundaries, because that is where the friction is." },

  { h: "Where you can see it" },
  { l: [
   "A company with separate frontend and backend teams produces a hard, formal, versioned API between them — and a company where one team owns a feature end to end usually does not.",
   "Three teams owning one service produce three subsystems inside it with suspiciously formal boundaries.",
   "A compiler built by four groups famously ends up with four passes.",
   "Products acquired rather than built keep their seams for years, because the organisational seam persists after the code is merged.",
   "Microsoft and Harvard researchers found that organisational structure was a strong predictor of defect density in Windows components — stronger than several code-based metrics."
  ] },
  { n: "The failure mode this predicts is the **distributed monolith**: services on the diagram, but every change requires a coordinated release across four of them. That happens when you split the code without splitting the ownership. The organisation still communicates constantly, so the interfaces stayed chatty, so the services are not independent. The architecture diagram lied; Conway's Law did not.",
    nt: "Why your microservices are not independent" },

  { h: "The inverse manoeuvre" },
  { p: "If structure follows organisation, then to change the structure you change the organisation first. This is the *inverse Conway manoeuvre*, and it is what Amazon's API mandate did deliberately: forcing teams to communicate only through service interfaces guaranteed the architecture would become service-oriented, because no other option remained." },
  { l: [
   "Want independently deployable services? Give each one a team that owns it end to end, including on-call, and remove shared databases so the back door is closed.",
   "Want a shared platform? You need a team whose product is that platform and whose customers are other teams — otherwise it becomes nobody's job and rots.",
   "Want fewer integration meetings? Reduce the number of teams that must agree to ship one user-visible change. This is the metric *Team Topologies* calls cognitive load, and it predicts delivery speed better than headcount does."
  ] },
  { p: "The reverse also holds as a warning: reorganising will change your architecture whether or not that was the intention. A reorg that splits a team in two will, over the following year, produce a seam in the code where the team boundary was drawn." },

  { h: "The honest caveats" },
  { p: "Conway's Law is an observation with good empirical support, not a theorem. Small teams routinely build systems whose structure has nothing to do with their org chart, because with five people there is effectively one communication structure. It bites hardest at the scale where coordination is genuinely expensive." },
  { p: "It is also frequently used as a fatalistic excuse — *our architecture is bad because the org is bad* — when the point of the inverse manoeuvre is precisely that the org is a thing engineering leadership can change." }
 ],
 k: [
  "Module boundaries form where communication is expensive, which is usually at team boundaries.",
  "Splitting code without splitting ownership produces a distributed monolith.",
  "Reorganising changes the architecture, intentionally or not.",
  "It is an empirical tendency, not a law of nature — it bites hardest at coordination-heavy scale."
 ],
 r: ["Microservices", "Monolith", "API", "Separation of Concerns", "Technical Debt", "DevOps", "Distributed System"],
 src: [
  { t: "Melvin Conway — How Do Committees Invent? (1968)", u: "https://www.melconway.com/Home/Committees_Paper.html" },
  { t: "Nagappan, Murphy & Basili — The Influence of Organizational Structure on Software Quality (Microsoft Research)", u: "https://www.microsoft.com/en-us/research/publication/the-influence-of-organizational-structure-on-software-quality-an-empirical-case-study/" }
 ]
},

{
 t: "The Mythical Man-Month",
 s: "Adding people to a late project makes it later",
 y: 1975, when: "1975",
 g: ["project management", "brooks", "estimation", "complexity"],
 tldr: "Fred Brooks managed the development of IBM's OS/360, one of the largest software projects attempted at the time, and wrote up what he learned. The central claim — that adding people to a late software project makes it later — is now called Brooks's Law, and fifty years of practice have not falsified it. The book's other arguments, about essential versus accidental complexity, have aged just as well.",
 say: [
  "Brooks's Law: adding manpower to a late software project makes it later.",
  "The reason is ramp-up time plus communication overhead — links grow as n(n−1)/2, so every new person costs everyone else.",
  "*No Silver Bullet* is the other famous piece: essential complexity is inherent to the problem, accidental complexity is in our tools, and only the second one is going away.",
  "The line people quote is that nine women cannot make a baby in one month — effort and time are not interchangeable."
 ],
 b: [
  { h: "The man-month" },
  { p: "The unit *man-month* implies that people and time are interchangeable — that twelve people for one month equals one person for twelve months. Brooks argues this only holds for work that can be partitioned with no communication between workers, such as picking cotton. Software is close to the opposite case." },
  { l: [
   "**Ramp-up.** A new person cannot contribute immediately. They must learn the domain, the codebase and the conventions, and the people teaching them are the people who were already the bottleneck.",
   "**Communication overhead.** Communication paths grow as n(n−1)/2. Three people have three pairs; ten have forty-five. Every addition costs a share of everyone else's attention.",
   "**Partitioning limits.** Some tasks are inherently sequential. You cannot parallelise a dependency chain by hiring."
  ] },
  { q: "The bearing of a child takes nine months, no matter how many women are assigned.", by: "Fred Brooks, The Mythical Man-Month" },
  { p: "The law is often misread as *never add people to a project*. Brooks's claim is narrower and more useful: adding people to a project that is **already late** will make it later still, because the ramp-up and communication costs are paid immediately while the benefit arrives after the deadline." },

  { h: "The other arguments" },
  { l: [
   "**The second-system effect.** An engineer's first system is cautious because they are unsure. The second is where they add every feature they held back, and it is characteristically over-engineered. Brooks advises particular scepticism toward a designer's second system.",
   "**Plan to throw one away; you will anyhow.** The first build teaches you what you should have built. Brooks later moderated this toward iterative development rather than literally discarding a system, which is closer to how it is practised now.",
   "**Conceptual integrity.** A system designed by one mind, or a very small group, is more coherent than one designed by committee — and coherence matters more to usability than feature count. This is the argument behind the technical lead or chief architect role.",
   "**The surgical team.** Rather than a flat group of equals, organise around a lead who does the design and writing, supported by specialists. Rarely adopted as described, but the instinct behind tech-lead structures."
  ] },

  { h: "No Silver Bullet" },
  { p: "Brooks's 1986 essay is the more contested piece and arguably the more important one. He divides difficulty into two kinds:" },
  { l: [
   "**Essential complexity** — the inherent difficulty of the problem. Modelling a tax system is hard because tax law is hard, and no tool changes that.",
   "**Accidental complexity** — difficulty introduced by our tools and methods. Manual memory management, deployment by hand, configuration drift."
  ] },
  { p: "His claim was that no single development in the following decade would produce a tenfold improvement in productivity, because the accidental complexity had already been substantially reduced and what remains is essential. Compilers, garbage collection, package managers and cloud infrastructure each removed real accidental complexity — and none of them made requirements easier to elicit or distributed systems easy to reason about." },
  { n: "The essay is regularly declared refuted — by object orientation, by frameworks, by cloud, most recently by AI code generation. The question Brooks would ask each time is which kind of complexity is being removed. A tool that writes the code faster attacks accidental complexity; deciding what the software should do, and whether it is correct, is essential and remains where the difficulty concentrates.",
    nt: "The argument keeps being re-run" },

  { h: "Why it survived" },
  { p: "Brooks was writing about a 1960s mainframe project in an industry that has changed beyond recognition. The book survives because its subject is not technology but coordination between people, and that has not changed at all. The 1995 anniversary edition's main revision is Brooks noting which parts he now considered wrong — chiefly *plan to throw one away* — which is itself a decent model for how to hold an opinion." },
  { p: "The practices that grew up afterwards are all responses to the same constraints he identified. Agile and Scrum exist to shorten the feedback loop he complained was too long. Continuous refactoring replaced *throw the first one away*. Pair programming attacks the ramp-up cost directly, and good documentation is what makes the communication overhead survivable at all. None of them repeal the law; they are ways of living with it." }
 ],
 k: [
  "Effort and time are not interchangeable when the work requires communication.",
  "Adding people to an already-late project pays the cost immediately and the benefit after the deadline.",
  "Essential complexity is in the problem; only accidental complexity yields to better tools.",
  "Conceptual integrity from a small design group beats feature richness from a large one."
 ],
 r: ["Technical Debt", "Agile", "Scrum", "Separation of Concerns", "Refactoring", "Documentation", "Pair Programming"],
 src: [
  { t: "Fred Brooks — The Mythical Man-Month (1975, anniversary edition 1995)", u: "https://en.wikipedia.org/wiki/The_Mythical_Man-Month" },
  { t: "Fred Brooks — No Silver Bullet: Essence and Accidents of Software Engineering (1986)", u: "http://www.cs.unc.edu/techreports/86-020.pdf" }
 ]
},

{
 t: "The CAP Theorem, Misquoted",
 s: "It was never pick two of three",
 y: 2000, when: "2000, proved 2002",
 g: ["distributed systems", "consistency", "availability", "misconception"],
 tldr: "Eric Brewer conjectured that a distributed data store cannot simultaneously provide consistency, availability and partition tolerance. Gilbert and Lynch proved a formal version in 2002. The popular summary — pick two of three — is wrong in a way that matters: partitions are not something you choose, they are something that happens to you, so the real choice is what to do *during* a partition. Brewer himself wrote a piece in 2012 saying the two-of-three framing is misleading.",
 say: [
  "*Pick two of three* is the wrong summary — you never get to choose partition tolerance, the network chooses for you.",
  "The real statement is: when a partition occurs, you must choose between consistency and availability.",
  "Which means the choice only applies during a partition. The rest of the time you can have both.",
  "PACELC is the better model: during a Partition choose A or C, Else choose Latency or Consistency."
 ],
 b: [
  { h: "What it actually says" },
  { p: "The three properties, in the formal sense Gilbert and Lynch used:" },
  { l: [
   "**Consistency** — every read receives the most recent write or an error. This is linearizability, and it is a stronger and narrower thing than the C in ACID, which is a frequent source of confusion.",
   "**Availability** — every request to a non-failing node receives a non-error response. Note that it says nothing about the response being fast.",
   "**Partition tolerance** — the system continues to operate despite arbitrary numbers of messages being dropped between nodes."
  ] },
  { p: "The theorem states you cannot guarantee all three. The reasoning is intuitive: if the network splits into two halves that cannot talk, and a write arrives on one side, you have exactly two options. Accept the write — and the other side now serves stale data, so you have given up consistency. Or refuse to serve until the partition heals — and you have given up availability." },

  { h: "Why *pick two* is wrong" },
  { p: "Partition tolerance is not a design choice. Networks partition: switches fail, cables are unplugged, a data centre link saturates, a garbage collection pause makes a node indistinguishable from an unreachable one. If you are running on more than one machine, partitions will occur." },
  { n: "So *CA* — consistent and available, sacrificing partition tolerance — is not a real category for a distributed system. Choosing it means choosing to behave arbitrarily when a partition occurs, which is worse than either alternative. A single-node database is genuinely CA, and it achieves that by not being distributed.",
    nt: "There is no CA option" },
  { p: "The real question is therefore: **when a partition happens, do you sacrifice consistency or availability?** That is a choice you make in advance, and it applies only for the duration of the partition." },
  { l: [
   "**CP** — refuse requests that cannot be served consistently. Choose this when incorrect data is worse than no data: financial ledgers, inventory with hard limits, configuration and coordination systems.",
   "**AP** — keep serving, reconcile afterwards. Choose this when stale data is better than no service: shopping carts, social feeds, DNS, session stores, analytics."
  ] },

  { h: "Brewer's own correction" },
  { p: "In 2012, twelve years after the original conjecture, Brewer wrote *CAP Twelve Years Later: How the Rules Have Changed*, arguing that the two-of-three formulation had done damage." },
  { l: [
   "The choice is not global to a system. It is per-operation. The same store can serve a shopping cart with AP semantics and a checkout with CP semantics.",
   "It applies only during a partition. Outside one, a system can be both consistent and available, and most are.",
   "Partition handling should be an explicit design phase: detect the partition, enter a deliberate degraded mode, and have a defined recovery and reconciliation procedure when it heals.",
   "The properties are continuous, not binary. There are many useful consistency models between linearizable and eventual — causal consistency, read-your-writes, bounded staleness."
  ] },

  { h: "PACELC" },
  { p: "Daniel Abadi's extension is the more complete model and deserves to be better known:" },
  { q: "If there is a Partition, choose between Availability and Consistency; Else, choose between Latency and Consistency.", by: "Daniel Abadi, PACELC" },
  { p: "The *else* branch is the half CAP omits and the half you live with daily. With no partition at all, a system that synchronously replicates across regions before acknowledging a write is consistent and slow; one that acknowledges locally is fast and briefly inconsistent. That tradeoff is present every single day, not just during incidents." },
  { p: "So the practically useful sentence is not about CAP at all: **how much staleness can this specific operation tolerate, and how much latency will it pay to avoid it?**" }
 ],
 k: [
  "Partition tolerance is not optional for a distributed system; the network decides.",
  "The choice between consistency and availability applies only during a partition.",
  "It is a per-operation decision, not a system-wide label.",
  "PACELC captures the everyday tradeoff CAP omits: latency versus consistency when nothing is broken."
 ],
 r: ["CAP Theorem", "Eventual Consistency", "Distributed System", "Replication", "Consensus", "ACID", "Sharding", "Latency"],
 src: [
  { t: "Gilbert & Lynch — Brewer's Conjecture and the Feasibility of Consistent, Available, Partition-Tolerant Web Services (2002)", u: "https://users.ece.cmu.edu/~adrian/731-sp04/readings/GL-cap.pdf" },
  { t: "Eric Brewer — CAP Twelve Years Later: How the Rules Have Changed (2012)", u: "https://www.infoq.com/articles/cap-twelve-years-later-how-the-rules-have-changed/" }
 ]
},

{
 t: "left-pad",
 s: "Eleven lines that broke the internet",
 y: 2016, when: "22 March 2016",
 g: ["npm", "dependencies", "supply chain", "javascript"],
 tldr: "A developer in a naming dispute with a company unpublished all 273 of his npm packages. One of them was left-pad — eleven lines that pad a string with spaces — and it turned out to sit underneath Babel, React Native and thousands of other projects. Builds broke worldwide within hours. npm took the unprecedented step of restoring a package against its author's wishes, and then changed its unpublish policy permanently.",
 say: [
  "Eleven lines of code, removed from npm, broke builds across the entire JavaScript ecosystem within hours.",
  "It happened because of a trademark dispute over the name *kik*, which npm resolved in the company's favour.",
  "npm un-unpublished the package, which had never been done, then changed the rules so it could not happen again.",
  "The lasting question it raised is whether a function you could write in a minute should be a dependency at all."
 ],
 b: [
  { h: "What happened" },
  { p: "Azer Koçulu maintained an npm package called `kik`. The messaging company Kik contacted him asking him to rename it; he declined. Kik's lawyers approached npm, and npm transferred the name to the company under its dispute policy." },
  { p: "Koçulu's response was to unpublish all 273 of his packages from npm. One of them was `left-pad`, which does exactly what its name says:" },
  { x: { lang: "javascript", code:
"module.exports = leftpad;\n\nfunction leftpad (str, len, ch) {\n  str = String(str);\n  var i = -1;\n  if (!ch && ch !== 0) ch = ' ';\n  len = len - str.length;\n  while (++i < len) {\n    str = ch + str;\n  }\n  return str;\n}" } },
  { p: "It was being downloaded millions of times a month, almost entirely as a transitive dependency. Babel used it. React Native's toolchain used it. Anything depending on those depended on it, several levels down, without any of those developers having chosen it." },
  { tl: [
    { t: "22 Mar, morning", d: "Koçulu unpublishes 273 packages including left-pad." },
    { t: "Within hours", d: "Builds fail worldwide with `npm ERR! 404 Registry returned 404 for GET on left-pad`. CI pipelines break; deploys stop." },
    { t: "Same day", d: "Another developer publishes a replacement, but as a new version number it does not satisfy existing lockfiles pinned to 0.0.3." },
    { t: "Same day", d: "npm restores left-pad 0.0.3 against the author's wishes — the first time it had ever un-unpublished a package." },
    { t: "Following days", d: "npm publishes a new unpublish policy: packages older than 24 hours with dependents cannot be removed unilaterally." }
  ] },

  { h: "Why it broke so much" },
  { p: "The mechanics are worth understanding because they generalise well beyond npm." },
  { l: [
   "**Transitive depth.** Almost nobody had left-pad in their `package.json`. They had a framework, which had a build tool, which had a helper, which had left-pad. Dependency trees in JavaScript routinely run hundreds of packages deep.",
   "**No vendoring by default.** Builds fetched from the registry at install time rather than from a local copy, so registry availability was a build-time dependency for everyone.",
   "**The registry is a single point of failure.** One namespace, one operator, one policy decision away from removal.",
   "**Culture of small modules.** npm's ecosystem actively encouraged tiny single-purpose packages, which maximises reuse and also maximises the number of independent parties you are trusting."
  ] },

  { h: "What changed, and what did not" },
  { l: [
   "**npm's unpublish policy.** A package can now only be removed unilaterally within 24 hours of publishing, and not at all if others depend on it. Otherwise it requires npm support and a deprecation path.",
   "**Lockfiles became universal.** `package-lock.json` arrived in npm 5 and `yarn.lock` before it. Pinning the whole resolved tree is now the default rather than a discipline.",
   "**Registry mirrors and vendoring** became standard for organisations that could not accept a third-party outage breaking their builds.",
   "**The trivial-dependency debate** started here and has never resolved. `is-odd`, `is-number` and their relatives are still widely depended upon."
  ] },
  { n: "The strongest argument to come out of it is that the cost of a dependency is not the code you avoid writing. It is the trust relationship: you are trusting that person's judgement, their availability, their account security and their willingness to keep the package published. For eleven lines, that trade is usually bad — and the same reasoning is what makes modern supply chain attacks like the XZ backdoor possible.",
    nt: "The real cost of a dependency" },
  { p: "left-pad is quoted as a joke about JavaScript, but it was the industry's first mainstream lesson that the software supply chain is infrastructure with owners, policies and failure modes — a lesson that SolarWinds, Log4Shell and XZ would each teach again, more expensively." }
 ],
 k: [
  "Most of your dependency tree consists of packages nobody on your team chose.",
  "A public registry is a build-time single point of failure unless you mirror or vendor.",
  "Lockfiles pin versions, not availability — the artefact still has to exist.",
  "The cost of a small dependency is the trust relationship, not the lines of code."
 ],
 r: ["npm", "Dependency", "Semantic Versioning", "Supply Chain Attack", "Build Tool", "CI/CD", "Open Source", "Artifact"],
 src: [
  { t: "npm blog — kik, left-pad, and npm (2016)", u: "https://blog.npmjs.org/post/141577284765/kik-left-pad-and-npm" },
  { t: "npm blog — changes to npm's unpublish policy", u: "https://blog.npmjs.org/post/141905368000/changes-to-npms-unpublish-policy" }
 ]
},

{
 t: "Moore's Law",
 s: "The observation that shaped six decades of computing",
 y: 1965, when: "1965 onwards",
 g: ["hardware", "scaling", "transistors", "economics"],
 tldr: "In 1965, Gordon Moore observed that the number of transistors on an integrated circuit was doubling roughly every year (later revised to every two years). This was not a law of physics — it was an economic and engineering observation that became a self-fulfilling prophecy, because the entire semiconductor industry organised its roadmaps around maintaining it. For fifty years, software got away with increasing inefficiency because hardware reliably got faster. That era is ending.",
 say: [
  "It is not a law of physics. It is an observation about the economics of semiconductor manufacturing that the industry turned into a target.",
  "Transistor count doubled every ~2 years for five decades. This is why your phone has more compute than a 1990s supercomputer.",
  "It made software bloat tolerable — why optimise when next year's hardware will be twice as fast?",
  "The slowdown of Moore's Law is why parallelism, specialised hardware (GPUs, TPUs) and software efficiency suddenly matter again."
 ],
 b: [
  { h: "The observation" },
  { p: "Gordon Moore, co-founder of Intel, published a paper in Electronics magazine in 1965 noting that the number of components on integrated circuits had been doubling approximately every year since their invention. He predicted this would continue for at least a decade." },
  { p: "In 1975, he revised the doubling period to every two years. Caltech professor Carver Mead coined the term 'Moore's Law'. The observation held for over five decades." },

  { h: "Why it was self-fulfilling" },
  { l: [
   "**The industry organised around it.** The International Technology Roadmap for Semiconductors set targets that matched Moore's Law. Companies planned R&D budgets, factory construction and product cycles assuming the pace would continue.",
   "**Enormous capital investment made it true.** Fabrication plants (fabs) cost billions. Each generation required new lithography techniques, new materials, and new physics tricks (strained silicon, FinFET, EUV). The investment continued because the returns justified it.",
   "**Software benefited implicitly.** If hardware doubles in speed every two years, software written today will run twice as fast on next year's hardware without any code changes. This is why software efficiency was deprioritised for decades."
  ] },
  { n: "The deepest consequence of Moore's Law is economic, not technical. It meant that the cost per transistor fell exponentially, which is why computing went from room-sized mainframes to pocket devices. The transistor count doubled, but the cost per function halved. That exponential cost reduction is what made personal computers, smartphones, and cloud computing economically viable.",
    nt: "Cost per transistor is the real story" },

  { h: "The slowdown" },
  { p: "Physical limits are being reached. Transistor gate lengths are approaching the size of individual atoms. The key challenges:" },
  { l: [
   "**Power density.** Dennard scaling (voltage reduction with shrinking transistors) ended around 2006. Smaller transistors no longer use proportionally less power, which is why clock speeds plateaued around 4-5 GHz.",
   "**Lithography complexity.** EUV (Extreme Ultraviolet Lithography) enables sub-7nm nodes but the machines cost >$150 million each.",
   "**Economic limits.** Each new node costs more to develop and manufacture. The number of companies that can afford leading-edge fabs has shrunk to three (TSMC, Samsung, Intel).",
   "**The response.** The industry has shifted from pure scaling to architectural innovation: multi-core, GPU compute, application-specific chips (TPUs, NPUs), and chiplet packaging (putting multiple dies in one package)."
  ] },

  { h: "What it means for software" },
  { l: [
   "**Free performance is over.** Code that gets faster by waiting for the next CPU generation is no longer a viable strategy.",
   "**Parallelism is mandatory.** Multi-core has been the norm since 2005. Code that does not parallelise does not scale.",
   "**Software efficiency matters again.** The greenfield performance gains now come from better algorithms, better data structures, and less waste — not from faster clocks.",
   "**Specialised hardware.** GPUs for graphics and ML, TPUs for tensor operations, FPGAs for specific workloads. General-purpose CPU scaling alone is insufficient."
  ] }
 ],
 k: [
  "Moore's Law was an economic observation that the industry turned into a self-fulfilling prophecy for five decades.",
  "The cost per transistor halving is the consequence that matters — it made computing universally affordable.",
  "Dennard scaling ending in ~2006 is why clock speeds plateaued and multi-core became necessary.",
  "The slowdown means software efficiency, parallelism and specialised hardware are now the path to performance."
 ],
 r: ["CPU", "GPU", "Parallelism", "Compiler", "Cache"],
 src: [
  { t: "Moore — Cramming more components onto integrated circuits, Electronics (1965)", u: "https://newsroom.intel.com/wp-content/uploads/sites/11/2018/05/moores-law-electronics.pdf" }
 ]
},

{
 t: "Linus's Law",
 s: "Given enough eyeballs, all bugs are shallow — or are they?",
 y: 1999, when: "1999",
 g: ["open source", "security", "code review", "debugging"],
 tldr: "Eric Raymond coined 'Linus's Law' in his essay The Cathedral and the Bazaar: 'Given enough eyeballs, all bugs are shallow.' The claim was that open source software is more secure because many people can inspect the code. Heartbleed (2014) and the XZ Utils backdoor (2024) challenged this — critical open source infrastructure can be maintained by one or two exhausted volunteers, and the eyeballs assumed to be watching may not exist.",
 say: [
  "The law: 'Given enough eyeballs, all bugs are shallow.' If many people read the code, someone will spot the bug.",
  "The assumption is that open source code actually gets reviewed. For popular projects, it often does. For critical-but-boring infrastructure libraries, it often does not.",
  "Heartbleed was in OpenSSL for two years. The XZ backdoor was deliberately inserted by a trusted contributor. The eyeballs were not watching.",
  "The law is aspirational, not descriptive. It works when the conditions hold — enough reviewers, actually reading the code — and fails when they do not."
 ],
 b: [
  { h: "The claim" },
  { p: "In 1999, Eric Raymond published The Cathedral and the Bazaar, comparing two software development models: the cathedral (closed, planned, top-down) and the bazaar (open, organic, community-driven). His central argument was that the bazaar model — open source — produced better software because more people could find and fix bugs." },
  { q: "Given enough eyeballs, all bugs are shallow. I dub this: Linus's Law.", by: "Eric Raymond, The Cathedral and the Bazaar (1999)" },
  { p: "The logic: if the source code is available and many developers read it, bugs that would be hidden in proprietary software will be found quickly. The probability that someone with the right expertise notices a bug increases with the number of reviewers." },

  { h: "Where it worked" },
  { l: [
   "**The Linux kernel** has thousands of active reviewers. Subsystem maintainers examine every patch. Bugs are found and fixed rapidly.",
   "**Major open source projects** (PostgreSQL, Chromium, the Rust compiler) have active, well-funded review processes.",
   "**Security audit programs** (Google's Project Zero, bug bounties) deliberately provide the eyeballs that Raymond assumed would appear naturally."
  ] },

  { h: "Where it failed" },
  { l: [
   "**Heartbleed (2014).** A buffer over-read in OpenSSL — the library that encrypted most of the internet — went undetected for two years. OpenSSL was maintained by a handful of volunteers. The code was available; almost nobody was reading it.",
   "**XZ Utils backdoor (2024).** A contributor spent years building trust in the xz compression library, then inserted a sophisticated backdoor targeting SSH authentication. It was discovered by accident when a Microsoft engineer noticed unusual CPU usage.",
   "**The fundamental issue.** The 'enough eyeballs' assumption fails for infrastructure that is critical, ubiquitous, and boring. Nobody volunteers to audit compression libraries."
  ] },
  { n: "The law confuses availability with attention. Making code open is necessary but not sufficient. Review requires expertise, motivation, and time. For glamorous projects, these appear. For the dependency buried four levels deep in your stack that handles cryptographic operations — the one maintained by one person in their spare time — the eyeballs are not there.",
    nt: "Open is not the same as reviewed" },

  { h: "The corrected understanding" },
  { l: [
   "Linus's Law is aspirational, not descriptive. It describes what happens when review conditions are good.",
   "Critical open source infrastructure needs funded maintenance, not just volunteer attention.",
   "The Linux Foundation, Open Source Security Foundation, and corporate sponsorship programs exist precisely because the 'eyeballs' do not appear automatically.",
   "Automated tools (fuzzing, static analysis, dependency scanning) partially compensate for insufficient human review."
  ] }
 ],
 k: [
  "Open source code that is available but not actively reviewed is not meaningfully more secure than closed code.",
  "The law works when review conditions are met — sufficient reviewers with expertise and motivation.",
  "Critical infrastructure maintained by volunteers is a systemic risk, as Heartbleed and XZ demonstrated.",
  "Funded maintenance and automated analysis partially fill the gap where human eyeballs are absent."
 ],
 r: ["Open Source", "Code Review", "Buffer Overflow", "Supply Chain Attack", "Zero-Day", "Static Analysis", "Technical Debt"],
 src: [
  { t: "Raymond — The Cathedral and the Bazaar (1999)", u: "http://www.catb.org/esr/writings/cathedral-bazaar/cathedral-bazaar/" },
  { t: "Heartbleed — CVE-2014-0160", u: "https://heartbleed.com/" }
 ]
},

{
 t: "Knuth's Premature Optimisation",
 s: "The most misquoted sentence in computer science",
 y: 1974, when: "1974",
 g: ["optimisation", "profiling", "design", "knuth"],
 tldr: "Donald Knuth wrote: 'Premature optimization is the root of all evil.' It is the most frequently cited sentence in software engineering — and the most frequently misused. In context, Knuth was arguing against micro-optimising code before profiling, not against thinking about performance during design. The full quote makes this clear, but the abbreviated version has been used to justify ignoring performance entirely.",
 say: [
  "The full quote: 'We should forget about small efficiencies, say about 97% of the time: premature optimization is the root of all evil. Yet we should not pass up our opportunities in that critical 3%.'",
  "He was talking about micro-optimisations — loop unrolling, register allocation, bit tricks — not about algorithmic choices or architecture.",
  "Using this quote to justify an O(n³) algorithm when O(n log n) exists is precisely the misuse Knuth would object to.",
  "The correct lesson: profile first, then optimise the hot path. But choose the right algorithm and data structure from the start."
 ],
 b: [
  { h: "What Knuth actually said" },
  { q: "Programmers waste enormous amounts of time thinking about, or worrying about, the speed of noncritical parts of their programs, and these attempts at efficiency actually have a strong negative impact when debugging and maintenance are considered. We should forget about small efficiencies, say about 97% of the time: premature optimization is the root of all evil. Yet we should not pass up our opportunities in that critical 3%.", by: "Donald Knuth, Structured Programming with go to Statements (1974)" },
  { p: "The context is critical. Knuth was writing about when to use GOTO for micro-performance gains. He was not arguing against choosing efficient algorithms. He was arguing against sacrificing code clarity for marginal speed improvements in code that is not on the critical path." },

  { h: "What it means" },
  { l: [
   "**Do not micro-optimise before profiling.** If you do not know where the bottleneck is, you are guessing. Guessing wrong wastes time and makes code harder to maintain.",
   "**The 97/3 split matters.** Most code runs rarely. A small fraction — typically loops, hot functions, inner algorithms — accounts for most execution time. Optimise that 3%.",
   "**Profile, then optimise.** Use profiling tools to find where time is actually spent. Optimise what the profiler says, not what your intuition guesses.",
   "**Algorithm choice is not premature.** Choosing an O(n²) algorithm when an O(n log n) alternative exists is not 'leaving optimisation for later' — it is a design mistake."
  ] },

  { h: "How it is misused" },
  { l: [
   "**'Performance does not matter yet.'** Used to justify architectures that are fundamentally slow, creating problems that are expensive to fix later.",
   "**'We will optimise later.'** Later often never comes, and by then the inefficiency is baked into the architecture.",
   "**Ignoring algorithmic complexity.** The quote is about micro-optimisation (bit tricks, cache line alignment), not about choosing the wrong data structure.",
   "**Conflating readable code with slow code.** Clean code and efficient code are not opposites. A well-chosen data structure is both readable and fast."
  ] },
  { n: "The honest reading of Knuth: think about performance at the design level (algorithm, data structure, architecture). Do not micro-optimise until you have profiled. The first decision is a design decision. The second is an engineering decision. They are different activities, and 'premature optimisation is the root of all evil' applies to the second, not the first.",
    nt: "Design-level thinking is not premature" },

  { h: "The practical workflow" },
  { l: [
   "Choose the right algorithm and data structure during design.",
   "Write clean, correct code first.",
   "Profile under realistic load.",
   "Optimise the hot 3% — and only with evidence from the profiler.",
   "Benchmark before and after to verify the optimisation actually helped."
  ] }
 ],
 k: [
  "Knuth was arguing against micro-optimisation without profiling, not against performance-aware design.",
  "Algorithmic choice (O(n²) vs O(n log n)) is a design decision, not an optimisation — make it correctly upfront.",
  "Profile first: optimise where the profiler says time is spent, not where intuition guesses.",
  "Clean code and efficient code are not opposites — well-chosen abstractions are both."
 ],
 r: ["Big O Notation", "Time Complexity", "Algorithm", "Data Structure", "Caching", "Profiling"],
 src: [
  { t: "Knuth — Structured Programming with go to Statements, ACM Computing Surveys (1974)", u: "https://dl.acm.org/doi/10.1145/356635.356640" }
 ]
},

{
 t: "The Two Generals Problem",
 s: "Reliable agreement over unreliable channels is impossible",
 y: 1975, when: "1975",
 g: ["distributed systems", "impossibility", "consensus", "theory"],
 tldr: "Two armies on opposite sides of a valley need to agree on when to attack. They can only communicate by sending messengers through the valley, but any messenger might be captured. The problem: no finite number of messages can guarantee both generals know the other will attack. If you send a confirmation, you need confirmation of the confirmation, ad infinitum. It is the first impossibility result in distributed systems and directly motivates TCP's three-way handshake, two-phase commit protocols, and the entire field of consensus algorithms.",
 say: [
  "Two generals must coordinate an attack. They communicate through an unreliable channel. No protocol with a finite number of messages can guarantee agreement.",
  "The issue is not technical — it is a mathematical impossibility. No amount of engineering can solve it perfectly; you can only manage the probability of failure.",
  "TCP's three-way handshake is the practical compromise: both sides agree to communicate, acknowledging that perfect certainty is impossible.",
  "It is the gateway to the CAP theorem, Byzantine fault tolerance, and Paxos/Raft consensus — all of which deal with the same fundamental tension."
 ],
 b: [
  { h: "The setup" },
  { p: "Two armies (commanded by General A and General B) are positioned on hills on opposite sides of a valley, with an enemy army in the valley. They must attack simultaneously to win; if only one attacks, it is defeated. They can only communicate by sending messengers through the valley, but messengers can be captured by the enemy." },
  { p: "General A sends a message: 'Attack at dawn.' But A does not know if the messenger arrived. B receives it and sends a confirmation: 'Confirmed, attack at dawn.' But B does not know if the confirmation arrived. A receives the confirmation and sends: 'Confirmed your confirmation.' But now A does not know if that message arrived..." },

  { h: "Why it is impossible" },
  { l: [
   "Any protocol that solves the problem must have a last message. The sender of the last message does not know if it was received.",
   "If the protocol works without the last message being received, then the last message was unnecessary — and the second-to-last message becomes the new last message, with the same problem.",
   "By induction, no finite sequence of messages can guarantee agreement.",
   "This is not a limitation of a specific protocol. It is a proof that no protocol can solve it."
  ] },
  { n: "The impossibility is not about the channel being unreliable. It is about the lack of common knowledge. Even if 999 out of 1000 messages get through, neither general can ever be certain the other will act. In distributed systems terms: you cannot achieve guaranteed consensus over an asynchronous, lossy channel.",
    nt: "Common knowledge cannot be established" },

  { h: "How systems cope" },
  { p: "Real systems do not solve the Two Generals Problem — they accept the impossibility and manage the risk:" },
  { l: [
   "**TCP's three-way handshake.** SYN → SYN-ACK → ACK. Both sides agree to communicate with high probability, but either side can still fail after the handshake. TCP handles this with timeouts and retransmission.",
   "**Two-phase commit (2PC).** A coordinator sends PREPARE to participants, waits for votes, then sends COMMIT or ABORT. If the coordinator fails between phases, participants are blocked — the protocol is not fully fault-tolerant.",
   "**Three-phase commit and Paxos/Raft.** Add more phases or quorum-based voting to reduce the blocking window, at the cost of complexity and latency.",
   "**Timeouts and retries.** Accept that certainty is impossible and design for eventual consistency or probabilistic guarantees."
  ] },

  { h: "Related results" },
  { l: [
   "**The Byzantine Generals Problem (1982)** extends this to scenarios where some participants may be malicious, not just unreliable.",
   "**The FLP impossibility result (1985)** proves that consensus in an asynchronous system is impossible if even one process can crash.",
   "**The CAP theorem (2000)** formalises the tradeoff: in a network partition, you choose consistency or availability, not both."
  ] }
 ],
 k: [
  "Reliable agreement over an unreliable channel is provably impossible with a finite number of messages.",
  "The impossibility is about establishing common knowledge, not about channel reliability.",
  "Practical systems (TCP, 2PC, Paxos) manage the impossibility with timeouts, retries and probabilistic guarantees.",
  "It is the foundation problem for all of distributed systems: consensus, consistency, and coordination."
 ],
 r: ["Distributed System", "CAP Theorem", "Consensus", "TCP/IP Model", "Replication"],
 src: [
  { t: "Akkoyunlu et al. — Some constraints and tradeoffs in the design of network communications (1975)", u: "https://dl.acm.org/doi/10.1145/800213.806523" },
  { t: "Gray — Notes on Data Base Operating Systems (1978, formalisation)", u: "https://jimgray.azurewebsites.net/papers/dbos.pdf" }
 ]
},

{
 t: "Hyrum's Law",
 s: "All observable behaviours will be depended upon",
 y: 2017, when: "2017",
 g: ["api design", "compatibility", "dependencies", "google"],
 tldr: "Hyrum Wright, a Google engineer, observed: 'With a sufficient number of users of an API, it does not matter what you promise in the contract: all observable behaviors of your system will be depended on by somebody.' This means that changing anything — even undocumented behaviour, error message text, timing characteristics or hash iteration order — will break someone. It is the most concise explanation of why backward compatibility is hard and why APIs calcify.",
 say: [
  "If your API has enough users, every observable behaviour — documented or not — will be depended upon by someone.",
  "This includes error message strings, the order of unordered results, timing characteristics, and side effects you did not intend as part of the contract.",
  "It is why changing the iteration order of a hash map is a breaking change in practice, even though no specification promises any order.",
  "It is the engineering corollary of Chesterton's fence: before you change behaviour, understand why someone might be relying on it."
 ],
 b: [
  { h: "The law" },
  { q: "With a sufficient number of users of an API, it does not matter what you promise in the contract: all observable behaviors of your system will be depended on by somebody.", by: "Hyrum Wright" },
  { p: "The observation is empirical, drawn from years of experience maintaining large-scale APIs at Google. It does not matter what the documentation says. If users can observe a behaviour, they will build systems that depend on it — including behaviours you considered implementation details." },

  { h: "Examples" },
  { l: [
   "**Hash map iteration order.** Most languages specify that hash map iteration order is undefined. In practice, it is deterministic for a given implementation. Change it, and tests fail, scripts break, and users file bugs.",
   "**Error messages.** Users parse error message strings to determine failure types. Change the wording, and their error handling breaks.",
   "**Timing.** An API that consistently responds in 5ms will be used as a synchronisation point. Slow it to 50ms and downstream systems time out.",
   "**Side effects.** An API that happens to create a temporary file at a predictable path will have users depending on that file existing.",
   "**Undocumented endpoints.** If an internal API endpoint is reachable, someone will find it and build on it."
  ] },
  { n: "The law is not a complaint — it is a design constraint. It means that the effective API contract is not what you document but what you ship. Every observable behaviour is, implicitly, a promise. This has profound implications for how you design, version, and evolve APIs: you must assume that any change is a potential breaking change.",
    nt: "Your API contract is what you ship, not what you document" },

  { h: "Implications for design" },
  { l: [
   "**Minimise observable surface area.** The less behaviour is observable, the less can be depended upon. Encapsulate, hide implementation details, use opaque types.",
   "**Make contracts explicit and narrow.** Document exactly what is guaranteed and nothing more. Use types and schemas to enforce it.",
   "**Version early.** If you might need to change behaviour, version the API from the start. Migrating users after the fact is exponentially harder.",
   "**Test with randomisation.** Randomise hash iteration order, randomise timing, vary non-guaranteed behaviour in tests to prevent implicit dependencies from forming.",
   "**Chesterton's fence.** Before changing any behaviour, assume someone depends on it and investigate. The cost of breaking unknown dependents often exceeds the benefit of the change."
  ] }
 ],
 k: [
  "With enough users, all observable behaviour — documented or not — will be depended upon.",
  "The effective API contract is what you ship, not what you document.",
  "Minimise observable surface area to minimise implicit contracts.",
  "Before changing any behaviour, assume someone depends on it and verify."
 ],
 r: ["API", "Abstraction", "Encapsulation", "Semantic Versioning", "Technical Debt", "Refactoring"],
 src: [
  { t: "Hyrum's Law", u: "https://www.hyrumslaw.com/" },
  { t: "Wright — Hyrum's Law: Software Engineering at Google, Chapter 1", u: "https://abseil.io/resources/swe-book/html/ch01.html" }
 ]
},

{
 t: "The Joel Test",
 s: "Twelve questions that reveal a software team's health",
 y: 2000, when: "August 2000",
 g: ["engineering culture", "best practices", "management", "hiring"],
 tldr: "Joel Spolsky published twelve yes-or-no questions that measure the quality of a software development team. Do you use source control? Can you make a build in one step? Do you fix bugs before writing new code? Two decades later, most of the questions are still relevant — and teams that cannot answer yes to all of them still ship slower, burn out engineers faster, and produce buggier software. It is the simplest litmus test for whether a team takes engineering seriously.",
 say: [
  "Twelve simple questions. All yes/no. A score of 12 means you are probably a good team. Below 10 means you have serious problems.",
  "It was written in 2000, and most questions (source control, one-step builds, bug triage, quiet working conditions) are still relevant.",
  "Some questions have evolved: 'Do you use the best tools money can buy?' now means 'Do you give engineers the infrastructure they need?'",
  "It is the fastest way to evaluate an engineering team — in a job interview, in a consulting engagement, or in a retrospective."
 ],
 b: [
  { h: "The twelve questions" },
  { l: [
   "Do you use source control?",
   "Can you make a build in one step?",
   "Do you make daily builds?",
   "Do you have a bug database?",
   "Do you fix bugs before writing new code?",
   "Do you have an up-to-date schedule?",
   "Do you have a spec?",
   "Do programmers have quiet working conditions?",
   "Do you use the best tools money can buy?",
   "Do you have testers?",
   "Do new candidates write code during their interview?",
   "Do you do hallway usability testing?"
  ] },
  { p: "Each question is binary. There is no partial credit. The test is intentionally blunt — it is a screening tool, not a comprehensive assessment." },

  { h: "Why it still works" },
  { p: "Many questions map directly to modern equivalents:" },
  { l: [
   "**Source control** → Git. Non-negotiable. But 'do you use it well?' (branching strategy, code review, CI integration) is the modern question.",
   "**One-step build** → CI/CD. Can you go from code to deployed artifact with one command or merged PR?",
   "**Daily builds** → Continuous integration. Every commit is built and tested automatically.",
   "**Bug database** → Issue tracker (Jira, Linear, GitHub Issues). Is it maintained or a graveyard?",
   "**Fix bugs first** → Do you prioritise tech debt, or do you only ship features until the codebase collapses?",
   "**Quiet working conditions** → Deep work. Open offices, Slack noise and meeting overload are the modern enemies.",
   "**Best tools** → Fast machines, good monitors, licences for the software engineers need. Cheap hardware is an expensive decision."
  ] },
  { n: "The Joel Test is not a comprehensive engineering assessment. It does not cover architecture quality, code review practices, deployment safety or security posture. But it catches the most common pathologies: teams that do not use version control, cannot build reliably, do not track bugs, and do not invest in their own productivity. If you fail the Joel Test, deeper problems are guaranteed.",
    nt: "It catches the floor, not the ceiling" },

  { h: "Using it" },
  { l: [
   "**In job interviews.** Ask the twelve questions. The answers — and how candidly they are given — tell you more about team quality than the tech stack.",
   "**In retrospectives.** Score your own team honestly. The questions where you answer 'no' are where your process is weakest.",
   "**For new teams.** Use it as a checklist when setting up a new team or project. Get to 12 before you write features."
  ] }
 ],
 k: [
  "Twelve binary questions are enough to identify most engineering process failures.",
  "The test catches the floor: if you fail it, deeper problems are guaranteed.",
  "The questions have modern equivalents (CI/CD, issue trackers, deep work) that make the test still relevant.",
  "Use it in interviews, retrospectives and project setup as a minimum quality bar."
 ],
 r: ["CI/CD", "Code Review", "Git", "Agile", "Technical Debt", "Refactoring", "Monitoring"],
 src: [
  { t: "Spolsky — The Joel Test: 12 Steps to Better Code (2000)", u: "https://www.joelonsoftware.com/2000/08/09/the-joel-test-12-steps-to-better-code/" }
 ]
},

{
 t: "Worse is Better",
 s: "Unix won because simplicity beats correctness",
 y: 1991, when: "1991",
 g: ["design philosophy", "unix", "simplicity", "pragmatism"],
 tldr: "Richard Gabriel described two software design philosophies: 'the right thing' (prioritise correctness, consistency and completeness) and 'worse is better' (prioritise simplicity of implementation, even at the cost of correctness). The Unix/C approach — worse is better — won the market because simpler implementations ship faster, port easier and attract more contributors. The essay is both a description and a warning: the design that wins may not be the design that is best.",
 say: [
  "The 'right thing' approach (MIT/Lisp tradition) prioritises correctness and interface beauty, making the implementation complex if necessary.",
  "'Worse is better' (Unix/C tradition) prioritises implementation simplicity, even if the interface is slightly worse or edge cases are unhandled.",
  "Unix and C won over Lisp machines and more elegant systems because they were simpler to implement, port and understand.",
  "The essay is intentionally ambivalent — Gabriel admired Lisp and was troubled that the worse approach won."
 ],
 b: [
  { h: "The two philosophies" },
  { p: "Gabriel contrasted two approaches to software design:" },
  { l: [
   "**The Right Thing (MIT approach).** The interface must be correct and consistent. The implementation may be complex. Edge cases are handled. Completeness is required. Example: Lisp, the Lisp Machine, Common Lisp.",
   "**Worse is Better (New Jersey approach).** The implementation must be simple. The interface can be slightly worse. If simplicity and correctness conflict, simplicity wins. Completeness is sacrificed for simplicity. Example: Unix, C, TCP/IP."
  ] },

  { h: "The example" },
  { p: "Gabriel used Unix's handling of a system call interrupted by a signal to illustrate the difference:" },
  { l: [
   "**The Right Thing.** The system call should be automatically restarted after the signal handler runs. The user should not need to know it was interrupted. This is correct but makes the kernel implementation complex.",
   "**Worse is Better.** The system call returns an error (EINTR) and the user must retry. This is worse for the user but simpler for the kernel. The complexity is pushed to the application."
  ] },
  { n: "Unix chose EINTR — the simpler implementation. Every Unix programmer has written a retry loop for interrupted system calls. It is annoying. It is also the reason Unix kernels were small enough to port to new hardware, which is why Unix spread to every platform and Lisp machines did not.",
    nt: "EINTR is the design philosophy in action" },

  { h: "Why worse wins" },
  { l: [
   "**Simpler to implement** → ships faster. First-mover advantage compounds.",
   "**Simpler to port** → runs on more hardware. Unix ran on everything; Lisp machines were proprietary.",
   "**Simpler to understand** → more contributors. People write code for systems they can comprehend.",
   "**Good enough** → users tolerate small imperfections if the core works. Perfection is not required for adoption.",
   "**Viral** → simple software spreads because it is easy to install, easy to modify and easy to embed."
  ] },

  { h: "The tension" },
  { p: "Gabriel was not celebrating the outcome. He was describing a dynamic he found troubling: the design that wins the market may not be the design that is best for users in the long run. 'Worse is better' systems accumulate technical debt, push complexity onto users and leave edge cases permanently unhandled." },
  { p: "The essay ends ambivalently. Gabriel acknowledged that the Lisp approach produced more correct software, but the Unix approach produced software that existed, spread and evolved. The pragmatic question for any engineer is: do you want to ship the right thing to a small audience, or a good-enough thing to everyone?" }
 ],
 k: [
  "Implementation simplicity, even at the cost of interface quality, leads to faster adoption and broader portability.",
  "The design that ships first and is simple enough to port wins over the design that is correct but complex.",
  "Worse-is-better systems push complexity to the user but are easier to build, understand and contribute to.",
  "The tradeoff is real: simpler systems accumulate more technical debt and handle fewer edge cases."
 ],
 r: ["Abstraction", "Technical Debt", "Refactoring", "API", "Open Source", "Encapsulation"],
 src: [
  { t: "Gabriel — Worse Is Better (1991)", u: "https://www.dreamsongs.com/WorseIsBetter.html" },
  { t: "Gabriel — Is Worse Really Better? (reflections)", u: "https://www.dreamsongs.com/Files/IsWorseReallyBetter.pdf" }
 ]
}

]);
