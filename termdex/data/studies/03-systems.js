/* Case studies — Landmark Systems. */
TD.addStudies("systems", [

{
 t: "Unix and the Bell Labs Philosophy",
 s: "Do one thing well, and connect it with a pipe",
 y: 1969, when: "1969 onwards",
 g: ["unix", "composition", "c", "portability"],
 tldr: "Two researchers at Bell Labs, freed by the failure of a much more ambitious project, built a small operating system on a spare machine. Its ideas — small programs that do one thing, text as the universal interface, and pipes to connect them — plus the decision to rewrite it in C so it could be moved between machines, produced the lineage that now runs almost every server, phone and container on earth.",
 say: [
  "The philosophy in one line: write programs that do one thing well, and that work together, using text streams as the interface.",
  "The move that actually mattered was rewriting it in C in 1973 — that made the OS portable, which had never really been true before.",
  "Pipes are the whole idea in one character: `|` lets you compose tools that were never written with each other in mind.",
  "Linux, macOS, Android and iOS are all either Unix or Unix-shaped, which is why the same shell skills work everywhere."
 ],
 b: [
  { h: "The origin" },
  { p: "Bell Labs had been part of Multics, an ambitious time-sharing operating system project that was running late and growing complicated. Bell Labs withdrew in 1969. Ken Thompson, Dennis Ritchie and colleagues, now without a convenient computing environment, started building something far smaller on a little-used PDP-7." },
  { p: "The name was a pun — Multics was multiplexed, this was *Unics*, doing rather less. The constraint was real: tiny memory, a machine nobody else wanted, and no mandate. What emerged was shaped by having to be small." },

  { h: "The philosophy" },
  { p: "Doug McIlroy, who ran the research group, later summarised it in a form that has been quoted ever since:" },
  { q: "Write programs that do one thing and do it well. Write programs to work together. Write programs to handle text streams, because that is a universal interface.", by: "Doug McIlroy, Bell Labs" },
  { p: "The third clause is the one that makes the first two useful. If every tool reads and writes plain text, then any tool can feed any other tool, including combinations nobody anticipated. `grep` did not need to know `sort` existed." },
  { x: { lang: "bash", code:
"# four programs, none written with the others in mind,\n# answering a question none of them knows about\n\ncat access.log \\\n  | awk '{print $1}' \\\n  | sort \\\n  | uniq -c \\\n  | sort -rn \\\n  | head -10" } },
  { n: "McIlroy proposed pipes in 1973 and Thompson implemented them in an evening. The idea — connect the output of one process to the input of another, with the operating system handling buffering and scheduling — turned a collection of utilities into a composition system. It is arguably the highest ratio of consequence to implementation effort in computing history.",
    nt: "Pipes took one evening" },

  { h: "The decision that made it spread" },
  { p: "In 1973 Unix was rewritten in C, a language Ritchie had developed alongside it. Operating systems at the time were written in assembly, which tied them to one processor. A Unix written in a high-level language could be recompiled for a different machine with far less work." },
  { p: "That portability, combined with AT&T's regulatory position — which limited its ability to sell software commercially, so Unix was licensed cheaply to universities with source code — put Unix into a generation of computer science departments. The students who learned on it went on to build the industry, and the Berkeley variant (BSD) fed TCP/IP networking back into the ecosystem." },

  { h: "What survived, and what did not" },
  { l: [
   "**Survived:** the file abstraction, where devices, pipes and sockets are all things you open, read and write. The hierarchical filesystem. The shell as a programmable interface. Small composable tools. C.",
   "**Survived in spirit:** microservices are the Unix philosophy at network scale — small services with a narrow interface, composed. Containers do something similar for packaging. Kubernetes reads as an attempt to build pipes for distributed processes.",
   "**Did not survive:** *everything is text* strains when the data is structured. Modern tooling frequently reaches for JSON and dedicated parsers precisely because parsing loosely-formatted text with `awk` is fragile.",
   "**Actively criticised:** the terse naming and inconsistent flags that came from typing on slow terminals are a genuine usability cost that newer tools deliberately reject."
  ] },
  { p: "The philosophy is now applied more often as an argument than as a practice — plenty of software described as Unix-like is a monolith with a plugin system. But the underlying instinct, that a small thing with a clean interface outlives a large thing with a broad one, is the reason engineers still cite it." }
 ],
 k: [
  "A narrow interface is what allows composition you did not design for.",
  "Portability came from writing the system in a high-level language — a decision that looked like a performance sacrifice.",
  "Free access with source code to universities distributed the ideas more effectively than any product strategy.",
  "The philosophy scales up: microservices are the same argument about process boundaries instead of program boundaries."
 ],
 r: ["Operating System", "Kernel", "Shell", "Linux", "Compiler", "Microservices", "Container", "File System"],
 src: [
  { t: "Ritchie & Thompson — The UNIX Time-Sharing System, CACM (1974)", u: "https://dl.acm.org/doi/10.1145/361011.361061" },
  { t: "Eric S. Raymond — The Art of Unix Programming", u: "http://www.catb.org/~esr/writings/taoup/html/" }
 ]
},

{
 t: "Git in Ten Days",
 s: "A licence dispute, and the tool everyone now uses",
 y: 2005, when: "April 2005",
 g: ["version control", "linus torvalds", "data model", "distributed"],
 tldr: "The Linux kernel had been using BitKeeper, a commercial tool offered free to open source projects. When that arrangement collapsed in April 2005, Linus Torvalds wrote a replacement. The first commit was on 7 April; git was managing its own source that same day and the kernel within two weeks. Its design — content-addressed snapshots rather than file diffs — is why it is fast, and its interface is why everyone complains about it.",
 say: [
  "It exists because the kernel lost access to BitKeeper and Linus refused to go back to CVS.",
  "The core insight is that git stores snapshots addressed by the hash of their content, not diffs between files — which is why branching is instant.",
  "A branch is a 41-byte file containing a commit hash. That is the whole thing.",
  "Everyone agrees the data model is elegant and the command-line interface is not, which is why so many tools exist to sit on top of it."
 ],
 b: [
  { h: "Why it was written" },
  { p: "Kernel development had used BitKeeper since 2002. It was proprietary, but BitMover offered a free-of-charge licence to open source projects, and it was distributed — which mattered enormously for a project with thousands of contributors and a maintainer hierarchy." },
  { p: "The arrangement was politically uncomfortable for parts of the free software community from the start. In April 2005, after Andrew Tridgell demonstrated a tool that interoperated with BitKeeper by reverse-engineering its protocol, BitMover withdrew the free licence. The kernel was suddenly without version control." },
  { p: "The alternatives at the time were centralised (CVS, Subversion) or distributed but slow (Monotone, Darcs). Torvalds' requirements were unusual: it had to handle a very large tree, merge quickly, support a distributed workflow with a chain of trust, and be fast enough that a maintainer could apply hundreds of patches a day." },

  { h: "Ten days" },
  { tl: [
    { t: "3 Apr 2005", d: "Torvalds begins writing code." },
    { t: "7 Apr 2005", d: "First commit. Git is self-hosting — its own source is stored in git — the same day." },
    { t: "17 Apr 2005", d: "Git performs its first multi-branch merge." },
    { t: "16 Jun 2005", d: "The kernel 2.6.12 release is managed with git." },
    { t: "26 Jul 2005", d: "Torvalds hands maintainership to Junio Hamano, who still leads the project." }
  ] },
  { n: "The ten-day figure refers to reaching a usable core, not a finished product. What existed after ten days was a fast content-addressable object store with the plumbing commands to build on — the porcelain most people use came later, from many contributors. The speed was possible because the data model is genuinely simple.",
    nt: "What *ten days* actually means" },

  { h: "The data model" },
  { p: "Git stores four kinds of object, each addressed by the SHA hash of its contents:" },
  { l: [
   "**Blob** — the contents of a file. No name, no history, just bytes.",
   "**Tree** — a directory listing: names mapped to blob or tree hashes.",
   "**Commit** — a pointer to one tree (the whole project state), plus parent commit hashes, author, and message.",
   "**Tag** — a named pointer to an object, optionally signed."
  ] },
  { p: "Because a commit points at a complete tree, a commit is a **snapshot**, not a diff. Diffs are computed on demand when you ask for them. Because every object is addressed by the hash of its content, identical files are stored once, and any change to history changes every hash downstream of it — which is where git's integrity guarantee comes from, and why rewriting shared history is so disruptive." },
  { x: { lang: "bash", code:
"# a branch really is just a file with a hash in it\n$ cat .git/refs/heads/main\n9f2c1a7e5b3d8f04c6e21b9a7d3f5c8e10b4a6d2\n\n# which is why creating one is instantaneous\n$ git branch experiment" } },

  { h: "The interface problem" },
  { p: "Git's commands were originally the plumbing — low-level operations exposing the object model directly. The user-facing layer grew on top over years, by different people, without a single consistent design. The result is a tool where `checkout` did several unrelated jobs until `switch` and `restore` were added in 2019, and where the mental model must be learned before the commands make sense." },
  { p: "That is the usual complaint, and it is fair. It is also why learning the object model first — objects, refs, the index — converts git from arbitrary incantations into something predictable." },

  { h: "What it changed" },
  { p: "Distributed version control won completely. Every clone holding full history made forking cheap, which made GitHub's model — fork, change, pull request — possible, which reshaped how open source collaboration works. The pull request is arguably a bigger cultural artefact than git itself, and it only exists because branching and merging became cheap." }
 ],
 k: [
  "Content addressing gives integrity and deduplication as a side effect of the storage design.",
  "A commit is a snapshot of the whole tree; diffs are computed, not stored.",
  "Branching is cheap because a branch is a pointer, which is what made the fork-and-pull-request workflow viable.",
  "An elegant data model does not guarantee an elegant interface — learn the model and the commands stop being arbitrary."
 ],
 r: ["Git", "Version Control", "Commit", "Branch", "Merge", "Hashing", "Pull Request", "Open Source"],
 src: [
  { t: "Git — official documentation and history", u: "https://git-scm.com/book/en/v2/Getting-Started-A-Short-History-of-Git" },
  { t: "Linus Torvalds — initial git commit, 7 April 2005", u: "https://github.com/git/git/commit/e83c5163316f89bfbde7d9ab23ca2e25604af290" }
 ]
},

{
 t: "The Bezos API Mandate",
 s: "An org chart change that produced AWS",
 y: 2002, when: "around 2002",
 g: ["architecture", "conway's law", "service oriented", "amazon"],
 tldr: "Amazon reportedly issued an internal instruction that all teams must expose their data and functionality through service interfaces, communicate only through those interfaces, and design every one of them to be externalisable. It was deeply unpopular and took years. The result was an organisation that was already a set of composable services when it decided to sell infrastructure — which is a large part of why AWS existed years before its competitors.",
 say: [
  "The mandate was that teams talk to each other only through service interfaces — no shared databases, no back doors, no linking directly to another team's code.",
  "The clause that mattered was *all interfaces must be designed to be externalisable* — building for an outside customer from day one.",
  "It is the best-known example of the inverse Conway manoeuvre: change the organisation to force the architecture.",
  "Worth knowing that the widely-quoted text comes from Steve Yegge's 2011 post, not an official Amazon document."
 ],
 b: [
  { h: "The mandate" },
  { p: "The version everyone quotes comes from a long internal post by Steve Yegge in 2011, written while he was at Google about his previous years at Amazon, which was accidentally shared publicly. It is a secondhand recollection written years afterwards, not a leaked document — worth stating plainly, because it is usually quoted as though it were the memo itself." },
  { p: "As Yegge recalled it, the instruction was roughly:" },
  { l: [
   "All teams will expose their data and functionality through service interfaces.",
   "Teams must communicate with each other through those interfaces — no direct database reads, no shared memory, no back doors of any kind.",
   "The technology used does not matter: HTTP, CORBA, custom protocols, whatever.",
   "All service interfaces without exception must be designed from the ground up to be externalisable — able to be exposed to developers outside the company.",
   "Anyone who does not do this will be fired."
  ] },

  { h: "Why the fourth point is the whole thing" },
  { p: "The first three describe service-oriented architecture, which was not a new idea in 2002. The fourth changes the engineering standard entirely. An internal interface can be sloppy: undocumented, unversioned, authenticated by being on the same network, and freely broken by a coordinated deploy." },
  { p: "An interface designed to be externalisable cannot be any of those things. It needs documentation, versioning, authentication, authorisation, rate limiting, metering, error contracts and backwards compatibility — because the consumer might be a stranger you cannot coordinate a deploy with." },
  { n: "Every team was therefore forced to build the operational maturity of a public API provider before there was any public API. When Amazon later decided to sell compute and storage, it did not need to build a services company — it already was one. Competitors starting from a monolith had to do the hard part first, which is a plausible explanation for a multi-year head start.",
    nt: "The head start was accidental" },

  { h: "The cost" },
  { p: "Accounts of the period describe it as brutal. Turning direct database access into service calls means latency where there was none, distributed failure modes where there were none, and a great deal of work that produces no customer-visible feature. Yegge's own post is at least as much a complaint about Amazon as a compliment." },
  { l: [
   "Every previously-free in-process call became a network call that can time out, retry, or partially fail.",
   "Debugging moved from a stack trace to correlating logs across services — which is why distributed tracing had to be invented.",
   "Teams needed on-call rotations, SLAs and monitoring for interfaces that had previously been function calls."
  ] },

  { h: "Conway's Law, used deliberately" },
  { p: "Conway's Law observes that systems mirror the communication structures of the organisations that build them. The mandate is the *inverse* manoeuvre: rather than accepting the architecture your org chart produces, change the communication structure to force the architecture you want." },
  { p: "That is why this story is quoted in architecture discussions far more often than in Amazon history. If teams share a database, you will get a distributed monolith regardless of what the diagram says, because the cheapest path is always the back door. Removing the back door is an organisational act, not a technical one." },
  { n: "The mandate is frequently cited to justify splitting a small company's product into microservices. That is usually the wrong lesson. Amazon had thousands of engineers and an organisational coordination problem; a team of fifteen has neither, and pays all of the distributed-systems cost for none of the benefit. The transferable idea is the discipline of a real interface, which a modular monolith can also enforce.",
    nt: "The common misapplication" }
 ],
 k: [
  "Designing every internal interface as though an outsider will consume it forces real operational maturity.",
  "Removing back doors — shared databases, direct table reads — is what actually enforces service boundaries.",
  "You can change architecture by changing the organisation; this is Conway's Law used deliberately.",
  "The cost is paid in latency, partial failure and observability work before any benefit appears."
 ],
 r: ["API", "Microservices", "Monolith", "REST", "Distributed System", "Distributed Tracing", "Rate Limiting", "Semantic Versioning"],
 src: [
  { t: "Steve Yegge — Google Platforms Rant (2011), the source of the widely-quoted version", u: "https://gist.github.com/chitchcock/1281611" }
 ]
},

{
 t: "MapReduce and the Hadoop Lineage",
 s: "Google published the papers, not the code",
 y: 2004, when: "2003–2006",
 g: ["big data", "distributed", "google", "hadoop"],
 tldr: "Google published three papers describing how it stored and processed data at a scale nobody else was operating at — GFS, MapReduce and Bigtable — while keeping the implementations internal. Outside engineers reimplemented them as Hadoop and HBase, which created the entire big data industry. By the time Hadoop was at peak adoption, Google had already moved on to the systems that replaced it internally.",
 say: [
  "The core idea was to move the computation to the data instead of moving petabytes across the network, on cheap machines that are expected to fail.",
  "Google published the papers without the code; Doug Cutting and Mike Cafarella built Hadoop from them, and Yahoo scaled it.",
  "Almost nobody starts a Hadoop cluster now — object storage plus elastic compute replaced it — but the vocabulary is still everywhere.",
  "Its lasting legacy is separating storage from compute, which is the opposite of Hadoop's original premise about data locality."
 ],
 b: [
  { h: "The problem" },
  { p: "By the early 2000s Google was indexing the web on a scale where single machines were irrelevant and reliable hardware was uneconomic. The design assumption became: build on cheap commodity machines, assume several are broken at any moment, and handle that in software rather than paying for reliable hardware." },
  { p: "Three papers described the resulting stack:" },
  { l: [
   "**GFS (2003)** — a distributed filesystem splitting huge files into large chunks replicated across machines, optimised for streaming reads and appends rather than random writes.",
   "**MapReduce (2004)** — a programming model where computation is expressed as a map phase that runs independently on each chunk and a reduce phase that aggregates. The framework handles distribution, retries and failed machines.",
   "**Bigtable (2006)** — a sparse, distributed, sorted map for structured data at scale, which is a direct ancestor of HBase, Cassandra and much of the wide-column NoSQL family."
  ] },
  { n: "The genuinely important design move was **moving computation to the data**. Rather than pulling terabytes across the network to a compute cluster, the scheduler tries to run each map task on the machine that already holds that chunk. In 2004, when network bandwidth was the binding constraint, this was the difference between feasible and impossible.",
    nt: "Why locality mattered then" },

  { h: "The reimplementation" },
  { p: "Doug Cutting and Mike Cafarella were building Nutch, an open source web crawler, and hitting exactly the scaling problems the papers described. They implemented the ideas, and in 2006 the storage and processing parts were split out as Hadoop — named after Cutting's son's toy elephant. Yahoo hired Cutting and put serious engineering behind it, running clusters of thousands of nodes." },
  { p: "Hadoop created an industry. Cloudera, Hortonworks and MapR were built on it, enterprises stood up clusters, and *big data* became a job title. An ecosystem grew on top: Hive for SQL, Pig for dataflow, HBase for the Bigtable model, ZooKeeper for coordination, and later Spark, which kept intermediate data in memory and made iterative work an order of magnitude faster." },

  { h: "Why it faded" },
  { p: "Hadoop's core premise was that storage and compute should live on the same machines, because moving data was expensive. Two things undermined that." },
  { l: [
   "**Network got faster.** Data centre bandwidth grew faster than the assumption held. Reading from network storage stopped being the bottleneck it had been.",
   "**Object storage got cheap and infinite.** S3 and its equivalents offered durability and elasticity that a self-managed HDFS cluster could not match at a comparable cost or operational burden.",
   "**Coupled scaling is wasteful.** If storage and compute are on the same nodes, needing more storage means buying CPUs you will not use, and vice versa. Separating them lets each scale independently, and lets compute be shut down entirely when idle.",
   "**Operating it was expensive.** Running a large Hadoop cluster required a dedicated team. Managed cloud services removed that job."
  ] },
  { p: "MapReduce as a programming model was also more restrictive than people wanted. Expressing everything as map and reduce is awkward for iterative algorithms and interactive queries, which is exactly the gap Spark and then warehouse SQL engines filled." },

  { h: "What actually survived" },
  { p: "Almost everything except the implementation. Distributed processing over partitioned data, fault tolerance through retries and replication, the shuffle as the expensive phase, data skew as the recurring failure mode, and the columnar file formats that came out of the ecosystem — Parquet and ORC — are all still central. Spark, Trino, BigQuery, Snowflake and Databricks are all descendants." },
  { p: "The strategic lesson is separate: Google published the ideas and kept the implementations, and got a decade in which competitors reimplemented its 2004 architecture while it built the next one." }
 ],
 k: [
  "Assume commodity hardware fails and handle it in software — this is now the default, not a novelty.",
  "Data locality was a response to a bandwidth constraint that later stopped binding.",
  "Separating storage from compute lets each scale independently, which reversed Hadoop's founding premise.",
  "Publishing the architecture while keeping the implementation is a viable strategic position."
 ],
 r: ["MapReduce", "Hadoop", "HDFS", "Apache Spark", "Object Storage", "Partitioning", "Data Skew", "Parquet"],
 src: [
  { t: "Dean & Ghemawat — MapReduce: Simplified Data Processing on Large Clusters (2004)", u: "https://research.google/pubs/pub62/" },
  { t: "Ghemawat, Gobioff & Leung — The Google File System (2003)", u: "https://research.google/pubs/pub51/" }
 ]
},

{
 t: "Netflix on AWS",
 s: "Seven years, and a monkey that breaks production",
 y: 2016, when: "2008–2016",
 g: ["cloud migration", "chaos engineering", "resilience", "microservices"],
 tldr: "A database corruption in 2008 stopped Netflix shipping DVDs for three days. The conclusion was not to buy better hardware but to abandon vertically-scaled databases entirely and rebuild on horizontally scalable cloud infrastructure. The migration took seven years. Along the way they built Chaos Monkey, which deliberately kills production servers during working hours, on the reasoning that failures you cause on purpose are far cheaper than the ones that arrive at 3am.",
 say: [
  "It started with a three-day outage in 2008 that stopped DVD shipping, not with a cloud strategy.",
  "It took seven years and was a rewrite, not a lift-and-shift — they explicitly refused to move the old architecture.",
  "Chaos Monkey randomly terminates production instances during office hours, so failure happens when engineers are awake and watching.",
  "The principle is designing for failure rather than trying to prevent it, which is now standard in any distributed system."
 ],
 b: [
  { h: "The trigger" },
  { p: "In August 2008, database corruption in Netflix's data centre prevented the company from shipping DVDs for three days. At the time the business was DVD-by-post with a growing streaming service, and the outage was an existential embarrassment." },
  { p: "The analysis concluded that the problem was architectural. They were running vertically scaled relational databases with single points of failure — the standard enterprise pattern — and making that more reliable meant buying progressively more expensive hardware while never removing the fundamental fragility." },

  { h: "The decision" },
  { p: "Netflix chose to move to AWS, and to rebuild rather than migrate. The distinction was deliberate and it is the reason the project took seven years." },
  { l: [
   "Monolithic applications were decomposed into hundreds of services, each independently deployable and independently scalable.",
   "Vertically scaled Oracle databases were replaced with horizontally scalable stores, principally Cassandra, accepting eventual consistency where the business could tolerate it.",
   "Every service was designed on the assumption that its dependencies would fail — timeouts, retries with backoff, circuit breakers, and fallbacks that degrade rather than error.",
   "State was pushed out of application instances so any instance could be destroyed and replaced without consequence."
  ] },
  { tl: [
    { t: "Aug 2008", d: "Database corruption halts DVD shipping for three days." },
    { t: "2009–2010", d: "Streaming infrastructure begins moving to AWS. The first services go live." },
    { t: "2011", d: "Chaos Monkey is introduced, and later open-sourced as part of the Simian Army." },
    { t: "Dec 2012", d: "An AWS ELB outage on Christmas Eve affects Netflix streaming, driving further investment in multi-region resilience." },
    { t: "Jan 2016", d: "The final customer-facing service is migrated; the last data centre for streaming is shut down. Billing was among the last pieces." }
  ] },

  { h: "Chaos Monkey" },
  { p: "The reasoning is straightforward once stated. Cloud instances fail. If your system cannot survive an instance disappearing, you will discover that at the worst possible moment. So terminate instances continuously, deliberately, during business hours, when the whole team is awake and able to fix what breaks." },
  { q: "The best way to avoid failure is to fail constantly.", by: "Netflix engineering, on the Simian Army" },
  { p: "It grew into a family: Chaos Kong simulated the loss of an entire AWS region; Latency Monkey injected artificial delays and errors into service calls; later tools like FIT and ChAP ran controlled experiments on a fraction of live traffic with automatic abort conditions." },
  { n: "Chaos engineering is often adopted in the wrong order. Netflix built it *after* designing services to tolerate failure, and after having the monitoring to detect the consequences within seconds. Introducing random instance termination to a system that cannot survive it, and that you cannot observe, just produces outages. The prerequisite list is: redundancy, health checks, automated replacement, and monitoring you trust.",
    nt: "Do not start here" },

  { h: "What it cost, and what it bought" },
  { p: "The bought part is well documented: Netflix scaled to well over a hundred million subscribers on infrastructure that grows elastically, deploys thousands of times a day, and routinely loses instances without customer impact. Regional failover became a practised operation rather than a theoretical plan." },
  { p: "The cost is less often quoted. Seven years of engineering effort, a period of running two architectures simultaneously, and the permanent complexity of a large distributed system — which is why Netflix also had to build a great deal of its own tooling for tracing, dependency management and deployment, much of which was open-sourced because nothing comparable existed." },
  { p: "The honest summary is that this was the right answer for a company whose scale and failure cost justified it. It is quoted constantly by organisations at a scale where a well-run pair of database servers would serve them better for a decade." }
 ],
 k: [
  "Designing for failure is cheaper than trying to prevent it once the system is large enough.",
  "A cloud migration that carries the old architecture across yields the old failure modes at higher cost.",
  "Deliberate failure injection belongs after redundancy and observability, not before.",
  "The scale that justified this is unusual — the practices transfer better than the architecture does."
 ],
 r: ["Chaos Engineering", "Microservices", "High Availability", "Circuit Breaker", "Graceful Degradation", "Eventual Consistency", "Autoscaling", "Distributed Tracing"],
 src: [
  { t: "Netflix Technology Blog — Completing the Netflix Cloud Migration", u: "https://about.netflix.com/en/news/completing-the-netflix-cloud-migration" },
  { t: "Principles of Chaos Engineering", u: "https://principlesofchaos.org/" }
 ]
},

{
 t: "The Linux Kernel",
 s: "A student project that runs the world",
 y: 1991, when: "1991 onwards",
 g: ["linux", "open source", "kernel", "community"],
 tldr: "A 21-year-old Finnish student posted a message to a Usenet newsgroup announcing a free operating system kernel he was working on as a hobby. Three decades later, Linux runs over 90% of servers, all of the world's top 500 supercomputers, every Android phone, and the majority of cloud infrastructure. It is maintained by thousands of contributors coordinated through a mailing-list-based workflow that Linus Torvalds still personally manages at the top level.",
 say: [
  "Torvalds' original post said it was 'just a hobby, won't be big and professional like GNU' — it now runs most of the internet.",
  "The kernel is monolithic, not microkernel — the famous Tanenbaum-Torvalds debate. Pragmatism won.",
  "It is the largest collaborative software project in human history: over 20,000 contributors from 1,700+ companies.",
  "The development model — mailing lists, subsystem maintainers, Torvalds as a final merge bottleneck — is unusual and works at a scale that shouldn't."
 ],
 b: [
  { h: "The origin" },
  { q: "I'm doing a (free) operating system (just a hobby, won't be big and professional like gnu) for 386(486) AT clones.", by: "Linus Torvalds, comp.os.minix, 25 August 1991" },
  { p: "Torvalds was a computer science student at the University of Helsinki. He was using MINIX, Andrew Tanenbaum's teaching operating system, and wanted something more capable. He started writing his own kernel targeting the Intel 386 processor, initially just a terminal emulator that could talk to his university's mainframe." },
  { p: "The kernel was released under the GPL in 1992, which meant anyone could use, modify and redistribute it — but had to share modifications under the same licence. That decision, combined with the growing GNU toolchain that provided everything except a kernel, created a complete free operating system." },

  { h: "The architecture debate" },
  { p: "In January 1992, Andrew Tanenbaum posted that Linux was obsolete because it used a monolithic kernel architecture. Tanenbaum advocated microkernels, where drivers and filesystems run in user space and communicate through message passing. Torvalds argued that monolithic kernels were faster and simpler." },
  { l: [
   "**Monolithic (Linux).** All kernel code runs in one address space with direct function calls. Faster, but a bug in any driver can crash the entire system.",
   "**Microkernel (Mach, MINIX 3, QNX).** Minimal kernel, with drivers in user space. More robust and modular, but message-passing overhead.",
   "**Pragmatic winner.** Linux won not because the architecture was theoretically superior but because it shipped, worked, and attracted contributors. Torvalds was willing to sacrifice elegance for functionality."
  ] },
  { n: "The debate is studied in every OS course. The honest summary: microkernels have theoretical advantages in reliability and modularity, and Linux has the entire market. The engineering lesson is that a working system you can improve beats a correct design you cannot ship.",
    nt: "The debate that never ended" },

  { h: "The development model" },
  { l: [
   "**Subsystem maintainers.** The kernel is divided into subsystems (networking, filesystems, drivers, memory management), each with a maintainer who reviews and merges patches for their area.",
   "**Mailing list workflow.** Patches are submitted as emails to relevant mailing lists. Review happens publicly in replies. There is no GitHub-style pull request interface.",
   "**Torvalds as final integrator.** Subsystem maintainers send pull requests to Torvalds, who merges them into the mainline during merge windows. His review is the final gate.",
   "**Release cadence.** A new kernel version ships roughly every 9–10 weeks: a two-week merge window followed by 7–8 weeks of stabilisation (rc1 through rc7).",
   "**Scale.** The 6.x kernel has roughly 30 million lines of code. The 5.10 release had contributions from over 1,900 developers at 200+ companies."
  ] },

  { h: "Where it runs" },
  { l: [
   "**Servers:** 90%+ of cloud workloads, including all of AWS, GCP and Azure's Linux VMs.",
   "**Supercomputers:** all 500 of the TOP500 run Linux.",
   "**Mobile:** Android uses a modified Linux kernel — roughly 3 billion active devices.",
   "**Embedded:** routers, smart TVs, automotive infotainment, IoT devices.",
   "**Containers:** Docker and Kubernetes depend on Linux kernel features (namespaces, cgroups)."
  ] }
 ],
 k: [
  "A working system that ships beats a correct design that does not.",
  "Open source with a strong licence (GPL) created contributions from competitors because they all needed the same foundation.",
  "The development model scales through hierarchy and subsystem ownership, not through democracy.",
  "Kernel features (namespaces, cgroups) enabled containerisation, which reshaped how software is deployed."
 ],
 r: ["Kernel", "Operating System", "Linux", "Open Source", "Container", "Shell", "File System", "Process"],
 src: [
  { t: "Torvalds — original comp.os.minix post (25 August 1991)", u: "https://groups.google.com/g/comp.os.minix/c/dlNtH7RRrGA/m/SwRavCzVE7gJ" },
  { t: "The Linux Kernel Archives", u: "https://www.kernel.org/" }
 ]
},

{
 t: "Google's PageRank",
 s: "An eigenvalue problem that built a trillion-dollar company",
 y: 1998, when: "1996–1998",
 g: ["search", "graph algorithm", "linear algebra", "stanford"],
 tldr: "Two Stanford PhD students observed that the web is a directed graph and that the link structure contains information about page quality. Their algorithm, PageRank, modelled a random surfer following links and computed the stationary probability distribution — the eigenvalue problem on the web's adjacency matrix. The pages most likely to be reached by random walks were ranked highest. The result was dramatically better search, which became Google.",
 say: [
  "The core idea: a link from page A to page B is a vote, and a vote from an important page counts more. That is a recursive definition — importance is defined in terms of importance.",
  "Mathematically, it is the principal eigenvector of the web's link matrix — a linear algebra problem on a graph with billions of nodes.",
  "It turned search from keyword matching into a graph quality problem, which is why Google's results were so much better than AltaVista.",
  "It is the clearest example of a graph algorithm having direct, world-changing commercial impact."
 ],
 b: [
  { h: "The insight" },
  { p: "Before PageRank, search engines ranked pages primarily by text relevance — keyword frequency, metadata, and basic text analysis. The results were easily gamed and frequently irrelevant." },
  { p: "Larry Page and Sergey Brin, Stanford PhD students, observed that the link structure of the web carried quality signal. Academic citation works this way: a paper cited by many important papers is probably important. The web has links instead of citations, but the principle transfers." },
  { p: "The key insight was that importance is recursive: a page is important if important pages link to it. That circularity is not a problem — it is an eigenvalue problem." },

  { h: "The mathematics" },
  { p: "Model a random surfer who starts on a page and repeatedly clicks a random link on whatever page they are on. With probability d (the damping factor, usually 0.85), they follow a link; with probability 1−d, they jump to a random page anywhere on the web." },
  { x: { lang: "text", code:
"PageRank(p) = (1-d)/N + d × Σ PageRank(q) / L(q)\n                              for all q linking to p\n\nwhere:\n  N = total number of pages\n  d = damping factor (0.85)\n  L(q) = number of outbound links from page q\n\nIn matrix form: PR = (1-d)/N × 1 + d × M × PR\n\nThis is an eigenvector equation. The PageRank vector\nis the principal eigenvector of the modified adjacency\nmatrix M, computed iteratively via power iteration." } },
  { l: [
   "**Power iteration.** Start with uniform PageRank across all pages. Repeatedly multiply by the link matrix until convergence. This is how it was computed in practice — it converges in 50–100 iterations on the web.",
   "**Damping factor.** The 0.85 probability of following a link (versus random jump) prevents rank from concentrating in link sinks and ensures the Markov chain is ergodic.",
   "**Sparse matrix.** The web has billions of pages but each links to relatively few, so the matrix is extremely sparse — making the computation tractable."
  ] },
  { n: "This is the linear algebra from your B.Tech maths course applied at planetary scale. Eigenvalues, Markov chains, power iteration, sparse matrices — all of it shows up in one of the most commercially successful algorithms ever written. It is the strongest answer to 'when will I use this in real life'.",
    nt: "Your linear algebra course, applied" },

  { h: "From algorithm to company" },
  { tl: [
    { t: "1996", d: "Page and Brin begin the research project at Stanford, initially called BackRub." },
    { t: "1998", d: "The PageRank paper is published. Google is incorporated." },
    { t: "Early 2000s", d: "Google's search quality, driven by PageRank and subsequent improvements, rapidly gains market share." },
    { t: "2004", d: "Google IPO. The algorithm that started as a Stanford project underpins a company valued at $23 billion." }
  ] },
  { p: "PageRank alone did not make Google. It was combined with text relevance, anchor text analysis, and many subsequent signals. But it was the foundational insight: use the structure of the graph, not just the content of the nodes, to determine quality. That insight now shows up in social network analysis, recommendation systems, fraud detection and biological networks." }
 ],
 k: [
  "Link structure is a signal about quality — using the graph, not just the content, was the breakthrough.",
  "Recursive definitions of importance resolve as eigenvalue problems, computed by power iteration.",
  "Linear algebra at scale is not academic — eigenvalues, sparse matrices and Markov chains built a trillion-dollar company.",
  "The idea generalises: any graph where edges carry endorsement signal is amenable to the same approach."
 ],
 r: ["Graph", "Adjacency List", "Eigenvalue", "Markov Chain", "Hash Table", "Distributed System", "MapReduce"],
 src: [
  { t: "Page et al. — The PageRank Citation Ranking: Bringing Order to the Web (Stanford, 1998)", u: "http://ilpubs.stanford.edu:8090/422/1/1999-66.pdf" },
  { t: "Brin & Page — The Anatomy of a Large-Scale Hypertextual Web Search Engine (1998)", u: "https://research.google/pubs/pub334/" }
 ]
},

{
 t: "Docker and Containerisation",
 s: "Namespaces, cgroups, and the end of 'works on my machine'",
 y: 2013, when: "2013 onwards",
 g: ["containers", "devops", "linux", "packaging"],
 tldr: "Linux had namespaces and cgroups for years — the kernel features that let processes run in isolated environments sharing the host kernel. Docker did not invent them. What Docker did was package them into a developer-friendly tool with a simple CLI, a layered image format, and a public registry for sharing images. 'Works on my machine' stopped being a joke because the machine shipped with the code. It changed how software is built, shipped and run, and it made Kubernetes necessary.",
 say: [
  "Docker did not invent containers — Linux namespaces and cgroups existed since 2006–2008. Docker made them usable.",
  "The Dockerfile is the real innovation: a declarative, repeatable recipe for building an environment, versioned with the code.",
  "The layered image format meant base images were shared and only differences were stored, which made images practical to distribute.",
  "It made microservices viable in practice — if each service ships its own container, dependency conflicts between services disappear."
 ],
 b: [
  { h: "What already existed" },
  { p: "Process isolation on Linux was not new in 2013:" },
  { l: [
   "**chroot (1979)** — changes the root directory for a process, providing basic filesystem isolation.",
   "**Namespaces (2002–2013)** — isolate process IDs, network stacks, mount points, user IDs and more. Each namespace gives a process a private view of the resource.",
   "**cgroups (2006)** — limit and account for CPU, memory, I/O and network resources per group of processes.",
   "**LXC (2008)** — combined namespaces and cgroups into a container runtime. Usable, but not simple."
  ] },
  { p: "The technology was there. The interface was not. Using LXC required understanding kernel internals. Building a repeatable environment meant writing shell scripts. Distributing environments meant tar files and tribal knowledge." },

  { h: "What Docker added" },
  { l: [
   "**Dockerfile.** A simple text file that declaratively describes how to build an image: start from a base, copy files, run commands, expose ports. Repeatable and versioned with the code.",
   "**Layered images.** Each instruction creates a filesystem layer. Layers are cached and shared, so a Python base image downloaded once serves all Python projects.",
   "**Docker Hub.** A public registry for sharing images. `docker pull nginx` gives you a running web server in seconds.",
   "**Simple CLI.** `docker build`, `docker run`, `docker push`. The abstraction was pitched at application developers, not system administrators."
  ] },
  { n: "The key insight was not technical but ergonomic. Containers were a kernel feature used by infrastructure teams. Docker repackaged them as a developer tool with a five-minute onboarding experience. That accessibility is what drove adoption — and it is a pattern that repeats: the technology that wins is often not the one that is most capable but the one that is most approachable.",
    nt: "The interface was the innovation" },

  { h: "What it changed" },
  { tl: [
    { t: "Mar 2013", d: "Docker is announced at PyCon. The demo takes five minutes." },
    { t: "2014", d: "Google, Microsoft and Amazon add Docker support. Adoption accelerates." },
    { t: "2015", d: "Docker Compose for multi-container apps. The OCI (Open Container Initiative) standardises image and runtime formats." },
    { t: "2014–2017", d: "Orchestration wars: Docker Swarm, Apache Mesos, Kubernetes. Kubernetes wins." },
    { t: "2018+", d: "Containers are the default deployment unit. Kubernetes becomes the standard orchestration layer." }
  ] },
  { l: [
   "**Dev-prod parity.** The container that runs in development is the same one that runs in production. Environment drift largely disappears.",
   "**Microservices became practical.** Dependency isolation per service means one team's Python 3.8 does not conflict with another team's Python 3.11.",
   "**CI/CD pipelines standardised.** Build a container, test it, push it to a registry, deploy it. The artifact is the same at every stage.",
   "**Kubernetes.** If every service is a container, you need a system to schedule, scale and network them. Kubernetes filled that role.",
   "**Serverless and FaaS** build on container primitives — functions run in lightweight containers with sub-second cold starts."
  ] }
 ],
 k: [
  "The kernel features existed for years; the developer experience is what created adoption.",
  "A Dockerfile is infrastructure as code at the packaging level — declarative, repeatable, versioned.",
  "Containers solve the dependency conflict problem by giving each service its own filesystem.",
  "Making containers easy to use created the need for orchestration, which is why Kubernetes exists."
 ],
 r: ["Container", "Docker", "Kubernetes", "Linux", "Microservices", "CI/CD", "DevOps"],
 src: [
  { t: "Solomon Hykes — The future of Linux Containers (PyCon 2013)", u: "https://www.youtube.com/watch?v=wW9CAH9nSLs" },
  { t: "Open Container Initiative — image and runtime specifications", u: "https://opencontainers.org/" }
 ]
},

{
 t: "The World Wide Web",
 s: "A proposal at CERN that connected humanity",
 y: 1989, when: "1989–1993",
 g: ["web", "http", "html", "client-server"],
 tldr: "Tim Berners-Lee, a physicist at CERN, proposed a system for sharing research documents using hypertext over the internet. He built three things: a naming scheme for resources (URLs), a transfer protocol (HTTP), and a markup language for documents (HTML). He also built the first web server and the first web browser. CERN released the technology royalty-free in 1993, and the web went from a document-sharing tool at a physics lab to the platform that reshaped civilisation.",
 say: [
  "Three inventions: URLs for naming, HTTP for transferring, HTML for structuring. That is the entire foundation.",
  "The decision to release it royalty-free was as important as the technology itself — if CERN had charged, the web would not have become universal.",
  "It was built on top of the internet (TCP/IP), not alongside it. The web is an application layer; the internet is the transport.",
  "Berners-Lee's original proposal was titled 'Information Management: A Proposal'. His boss wrote 'Vague, but exciting' on it."
 ],
 b: [
  { h: "The problem" },
  { p: "CERN had thousands of researchers using different computers, different operating systems, and different document formats. Information about projects, protocols and contacts was scattered across incompatible systems. Berners-Lee's proposal was for a networked hypertext system that could link documents across any machine." },
  { q: "This proposal provides for an information management system that links related information together in a useful way.", by: "Tim Berners-Lee, Information Management: A Proposal (March 1989)" },

  { h: "The three pillars" },
  { l: [
   "**URL (Uniform Resource Locator).** A universal naming scheme: `http://info.cern.ch/hypertext/WWW/TheProject.html`. Any resource anywhere on any server has an address anyone can type.",
   "**HTTP (HyperText Transfer Protocol).** A simple, stateless request-response protocol. A client sends `GET /page`, the server returns the document. No session, no connection memory, no complexity.",
   "**HTML (HyperText Markup Language).** A markup language where documents contain links to other documents. Click a link, fetch another page. The link is the web."
  ] },
  { p: "Berners-Lee also built the first web server (running on his NeXT workstation at CERN, with a note stuck to it reading 'This machine is a server. DO NOT POWER IT DOWN!!') and the first browser-editor, WorldWideWeb." },
  { n: "HTTP's statelessness is the design decision that matters most. Each request is independent — the server does not remember the client between requests. This was considered a limitation (and is why cookies had to be invented), but it is the reason the web scales: a stateless server can handle any request from any client with no coordination, which is why load balancing, caching and CDNs work.",
    nt: "Stateless by design" },

  { h: "The timeline" },
  { tl: [
    { t: "Mar 1989", d: "Berners-Lee writes the proposal. His boss, Mike Sendall, writes 'Vague, but exciting' on the cover." },
    { t: "Dec 1990", d: "The first web server and browser are running at CERN." },
    { t: "Aug 1991", d: "Berners-Lee posts to the alt.hypertext newsgroup announcing the World Wide Web." },
    { t: "1993", d: "CERN releases the web technology into the public domain, royalty-free." },
    { t: "1993", d: "Mosaic, the first graphical browser for non-expert users, is released by NCSA. It becomes Netscape." },
    { t: "1994", d: "Berners-Lee founds the W3C to steward web standards." }
  ] },

  { h: "Why it won" },
  { p: "The web was not the only hypertext system. HyperCard, Gopher, WAIS, and several academic hypertext systems existed. The web won because:" },
  { l: [
   "**It ran on the internet.** Not a separate network, not a proprietary protocol. It used TCP/IP, which was already everywhere.",
   "**It was free.** No licensing fees, no proprietary technology. Anyone could build a browser or a server.",
   "**It was simple.** HTML could be written in a text editor. HTTP could be debugged with telnet. The barrier to publishing was nearly zero.",
   "**Links were one-directional and could break.** This was considered a design flaw by hypertext purists. In practice, it meant you could link to any page without asking permission, which is why the web grew explosively."
  ] }
 ],
 k: [
  "Three simple standards — URLs, HTTP, HTML — are the entire foundation of the web.",
  "HTTP's statelessness is why the web scales: no per-client state on the server.",
  "Releasing the technology royalty-free was as important as inventing it.",
  "One-directional links that can break were a pragmatic choice that enabled permissionless linking and exponential growth."
 ],
 r: ["HTTP", "HTML", "DNS", "TCP/IP Model", "REST", "API", "Caching"],
 src: [
  { t: "Tim Berners-Lee — Information Management: A Proposal (1989)", u: "https://www.w3.org/History/1989/proposal.html" },
  { t: "CERN — The birth of the web", u: "https://home.cern/science/computing/birth-web" }
 ]
},

{
 t: "TCP/IP and the Internet",
 s: "The protocol suite that connected everything",
 y: 1983, when: "1969–1983",
 g: ["networking", "protocol", "packet switching", "arpanet"],
 tldr: "The internet exists because Vint Cerf and Bob Kahn designed a protocol suite — TCP/IP — that could connect fundamentally different networks without requiring them to change. The end-to-end principle put intelligence at the edges and made the network itself simple, which is why it scaled from four university nodes in 1969 to billions of devices. On 1 January 1983, ARPANET switched from NCP to TCP/IP, and the internet as we know it began.",
 say: [
  "The key idea was internetworking: connecting different networks (satellite, radio, Ethernet) through a common protocol without changing the underlying networks.",
  "The end-to-end principle puts complexity at the endpoints, not in the network. The network just moves packets — it does not understand them.",
  "TCP handles reliability (retransmission, ordering, flow control). IP handles addressing and routing. Separating them was a critical design decision.",
  "Flag Day — 1 January 1983 — is when ARPANET switched to TCP/IP. Every machine had to switch simultaneously. It is considered the birthday of the internet."
 ],
 b: [
  { h: "The problem" },
  { p: "By the early 1970s, ARPANET existed — a packet-switched network connecting research institutions. But it was one network with one protocol (NCP). Other networks were being built: satellite networks, radio networks, Ethernet LANs. They used different technologies, different speeds, different packet sizes." },
  { p: "The question was how to connect them. The telephone system's approach — a single global standard everyone must adopt — did not work because the networks were too different. Cerf and Kahn's insight was that you could connect networks without unifying them, by defining a common protocol that ran *between* networks." },

  { h: "The architecture" },
  { l: [
   "**IP (Internet Protocol).** Every machine gets an address. IP handles routing packets from source to destination across multiple networks. It is *unreliable by design* — packets can be dropped, duplicated, or arrive out of order. That simplicity is why routers are fast.",
   "**TCP (Transmission Control Protocol).** Runs on top of IP at the endpoints. Provides reliable, ordered, flow-controlled byte streams. Retransmits lost packets. Handles congestion. All the complexity lives here, at the edges.",
   "**The layered model.** Application → Transport (TCP/UDP) → Internet (IP) → Link (Ethernet, Wi-Fi, etc.). Each layer depends only on the one below it."
  ] },
  { n: "The end-to-end principle is the design philosophy: do not build reliability into the network if the endpoints need to verify it anyway. If TCP must check for errors regardless, having the network check too is redundant. This keeps the core network simple and fast, at the cost of complexity at the endpoints. Every subsequent internet protocol builds on this foundation.",
    nt: "The end-to-end principle" },

  { h: "The timeline" },
  { tl: [
    { t: "1969", d: "ARPANET connects its first four nodes: UCLA, SRI, UCSB, and Utah." },
    { t: "1974", d: "Cerf and Kahn publish 'A Protocol for Packet Network Intercommunication' describing TCP." },
    { t: "1978", d: "TCP is split into TCP and IP. UDP is added for connectionless datagrams." },
    { t: "1 Jan 1983", d: "Flag Day. ARPANET switches from NCP to TCP/IP. The internet begins." },
    { t: "1983", d: "DNS is introduced to replace the hosts.txt file that was manually maintained." },
    { t: "1990s", d: "The web, running on TCP/IP, drives explosive growth. The internet goes from academic to universal." }
  ] },

  { h: "Why it survived" },
  { p: "The OSI model, backed by ISO and international standards bodies, was supposed to replace TCP/IP with a more formally designed protocol suite. It failed. TCP/IP won because:" },
  { l: [
   "**It was running.** TCP/IP was deployed and working while OSI was being designed by committee.",
   "**It was free.** The specifications were published as RFCs (Requests for Comments), available to anyone. No licensing.",
   "**It was simple enough.** Four layers, not seven. The implementations were small enough for the hardware of the time.",
   "**BSD Unix included it.** Berkeley's TCP/IP implementation shipped with BSD Unix, which universities were already running. Adoption was immediate."
  ] },
  { p: "The protocols designed in the 1970s are the ones carrying your video call right now. The addressing scheme (IPv4) is running out, and IPv6 deployment has been a two-decade transition — but the architecture is unchanged." }
 ],
 k: [
  "Internetworking — connecting different networks without changing them — was the fundamental insight.",
  "The end-to-end principle: keep the network simple, put intelligence at the edges.",
  "Separating TCP (reliability) from IP (routing) allowed each to evolve independently.",
  "Running code beats elegant specification — TCP/IP won against the formally superior OSI model."
 ],
 r: ["TCP/IP Model", "DNS", "HTTP", "Bandwidth and Latency", "Load Balancer", "Packet", "Router", "Socket"],
 src: [
  { t: "Cerf & Kahn — A Protocol for Packet Network Intercommunication, IEEE (1974)", u: "https://ieeexplore.ieee.org/document/1092259" },
  { t: "RFC 791 — Internet Protocol (1981)", u: "https://www.rfc-editor.org/rfc/rfc791" }
 ]
},

{
 t: "Bitcoin and the Blockchain",
 s: "Solving double-spending without a bank",
 y: 2008, when: "2008–2009",
 g: ["distributed consensus", "cryptography", "peer-to-peer", "economics"],
 tldr: "An anonymous author using the name Satoshi Nakamoto published a paper describing a peer-to-peer electronic cash system that could operate without a trusted third party. The key innovation was the blockchain: a distributed ledger where transactions are grouped into blocks linked by cryptographic hashes, and the right to append a block is earned by expending computational work (proof of work). It solved the double-spending problem without a bank, and the data structure and consensus mechanism became a field of their own.",
 say: [
  "The problem it solved: how do you prevent someone from spending the same digital money twice without a central authority to check?",
  "The blockchain is a linked list of blocks, where each block contains a hash of the previous block — changing any historical block invalidates every subsequent one.",
  "Proof of work is a lottery: miners compete to find a nonce that makes their block's hash fall below a target, burning electricity as the cost of participation.",
  "The technical ideas — hash chains, Merkle trees, proof of work — all existed before. Nakamoto's contribution was combining them into a working system."
 ],
 b: [
  { h: "The double-spending problem" },
  { p: "Physical cash solves double-spending trivially: when you hand someone a coin, you do not have it anymore. Digital data can be copied perfectly, so digital money can be spent twice unless something prevents it. Traditional systems use a trusted third party — a bank — to maintain the canonical ledger and reject duplicate transactions." },
  { p: "Nakamoto's paper asked: can you build a payment system where no single party controls the ledger, and participants who do not trust each other can still agree on which transactions are valid?" },

  { h: "How it works" },
  { l: [
   "**Transactions** are broadcast to the network. Each transaction references the outputs of previous transactions and is signed with the sender's private key.",
   "**Blocks** are collections of transactions. Each block header contains a hash of the previous block header, creating a chain. Altering any block changes its hash, which invalidates every block after it.",
   "**Merkle trees.** Transactions within a block are hashed into a binary tree. The root hash is included in the block header, allowing efficient verification that any transaction is in the block without downloading all of them.",
   "**Proof of work.** To append a block, a miner must find a value (nonce) such that the block header's SHA-256 hash falls below a difficulty target. This requires brute-force computation — roughly 10 minutes of the entire network's combined hash power.",
   "**Longest chain rule.** If two miners produce valid blocks simultaneously, the network eventually converges on the chain with more cumulative work. Transactions become effectively irreversible after several blocks."
  ] },
  { x: { lang: "text", code:
"Block 0 (Genesis)    Block 1              Block 2\n┌──────────────┐     ┌──────────────┐     ┌──────────────┐\n│ Hash: 000abc │◄────│ Prev: 000abc │◄────│ Prev: 000def │\n│ Nonce: 42    │     │ Hash: 000def │     │ Hash: 000ghi │\n│ Merkle Root  │     │ Nonce: 1337  │     │ Nonce: 7890  │\n│ Tx1, Tx2     │     │ Merkle Root  │     │ Merkle Root  │\n└──────────────┘     │ Tx3, Tx4, Tx5│     │ Tx6, Tx7     │\n                     └──────────────┘     └──────────────┘\n\nChanging Tx3 → changes Merkle Root → changes Block 1 Hash\n→ invalidates Block 2's Prev pointer → chain breaks" } },
  { n: "The energy cost of proof of work is not a bug — it is the mechanism. Rewriting history requires re-doing all the work for the altered block and every block after it, faster than the rest of the network extends the honest chain. The cost of attack scales with the network's total hash rate, which is why 51% attacks are discussed as the fundamental threat model.",
    nt: "Energy is the security model" },

  { h: "The CS concepts involved" },
  { l: [
   "**Cryptographic hash functions (SHA-256).** One-way, collision-resistant, deterministic. The foundation of both the chain structure and the mining process.",
   "**Merkle trees.** Binary hash trees enabling O(log n) membership proofs — a data structure from 1979 that found its most visible application here.",
   "**Public-key cryptography.** Transaction signing and address generation use elliptic curve cryptography (secp256k1).",
   "**Distributed consensus.** Nakamoto consensus is a probabilistic solution to Byzantine fault tolerance — nodes agree on state without trusting each other, at the cost of finality being probabilistic rather than instant.",
   "**Peer-to-peer networking.** No central server. Nodes discover each other, broadcast transactions and blocks, and independently validate everything."
  ] },

  { h: "What it became" },
  { p: "Bitcoin launched in January 2009. The blockchain concept spawned Ethereum (adding programmable smart contracts), DeFi, NFTs, and thousands of other projects — alongside substantial fraud, speculation and environmental criticism. The underlying data structure and consensus mechanism are now studied as serious distributed systems contributions regardless of one's view on cryptocurrency." }
 ],
 k: [
  "A hash chain makes history tamper-evident: changing any block invalidates all subsequent ones.",
  "Proof of work converts electricity into trustless consensus — the energy cost is the security guarantee.",
  "Merkle trees provide efficient membership proofs in O(log n) — used far beyond blockchains.",
  "Nakamoto consensus is probabilistic Byzantine fault tolerance for open networks where participants are anonymous."
 ],
 r: ["Hashing", "Public-Key Cryptography", "Distributed System", "Consensus", "Encryption"],
 src: [
  { t: "Nakamoto — Bitcoin: A Peer-to-Peer Electronic Cash System (2008)", u: "https://bitcoin.org/bitcoin.pdf" },
  { t: "Bitcoin Developer Documentation", u: "https://developer.bitcoin.org/devguide/" }
 ]
},

{
 t: "Amazon Dynamo",
 s: "The paper that ignited the NoSQL era",
 y: 2007, when: "October 2007",
 g: ["nosql", "distributed systems", "eventual consistency", "consistent hashing", "amazon", "high availability"],
 tldr: "Amazon discovered that 70% of their retail database queries were simple single-key lookups, yet relational databases were collapsing under Black Friday peak traffic due to strict ACID constraints. Giuseppe DeCandia and Werner Vogels published Dynamo — a decentralized, highly available key-value storage system that traded ACID consistency for guaranteed write availability. Its techniques — consistent hashing, vector clocks, sloppy quorums (W + R > N), and hinted handoff — directly birthed Cassandra, Riak, DynamoDB, and the entire NoSQL industry.",
 say: [
  "Dynamo established that for high-scale e-commerce, availability and bounded latency trump strict ACID consistency.",
  "Consistent hashing with virtual nodes ensures load is evenly distributed across a ring without repartitioning the entire cluster.",
  "Sloppy quorums and hinted handoff ensure writes succeed even if the primary replica nodes are temporarily unreachable.",
  "It gave birth to the NoSQL movement — Cassandra, Riak, DynamoDB, and Couchbase are direct descendants."
 ],
 b: [
  { h: "The shopping cart problem" },
  { p: "In the mid-2000s, Amazon's e-commerce platform ran on massive Oracle relational database clusters. During holiday peak traffic (like Black Friday and Cyber Monday), database locks, multi-table joins, and synchronous replication brought the checkout flow to a crawl." },
  { p: "Amazon leadership established a core business rule: **a customer must never be prevented from adding an item to their shopping cart.** If a network partition occurred, a database write must succeed anyway, even if different data replicas temporarily disagreed on the contents of the cart." },

  { h: "The core architecture: A ring of nodes" },
  { p: "Dynamo is a decentralized, masterless peer-to-peer storage system where all nodes are symmetrical. It synthesized five fundamental distributed systems techniques:" },
  { l: [
   "**Consistent Hashing with Virtual Nodes.** Keys and server nodes are hashed onto a 128-bit circular ring. A key is stored on the first $N$ unique physical nodes clockwise from its hash position. Virtual nodes (tokens) ensure even data distribution across machines with varying hardware capabilities.",
   "**Sloppy Quorums ($W + R > N$).** If $N=3$ replicas are configured, a write succeeds as soon as $W=2$ nodes acknowledge, and a read succeeds when $R=2$ respond. Since $W + R > N$, read and write sets overlap, guaranteeing the latest update is seen under normal operation.",
   "**Hinted Handoff.** If a target replica node is down during a write, the write is sent to a healthy substitute node with a 'hint' metadata tag. Once the original node recovers, the substitute delivers the missed update.",
   "**Vector Clocks.** When network partitions allow concurrent conflicting updates to the same key, vector clocks capture the causal ordering of events. If branches cannot be merged automatically, Dynamo hands the conflicting versions back to the client application to reconcile (e.g. merging shopping carts by taking the union of items).",
   "**Anti-entropy with Merkle Trees.** Background gossip protocols compare hierarchical Merkle hash trees between replicas to rapidly detect and synchronize out-of-date key ranges without transferring the entire dataset across the network."
  ] },
  { x: { lang: "text", code:
"                         Consistent Hashing Ring\n\n                             Node A (Tokens: 0, 100)\n                                  ▲\n                             ┌────┴────┐\n                        ┌────┘         └────┐\n                        │                   │\n       Node D (Tokens)  │     Key 'user_42' │   Node B (Tokens: 50, 150)\n             ◄──────────┤      (Hash: 120)  ├──────────►\n                        │   Stored on:      │\n                        │   Nodes B, C, D   │\n                        └────┐         ┌────┘\n                             └────┬────┘\n                                  ▼\n                             Node C (Tokens: 80, 180)\n\n  Key is mapped to the ring and replicated clockwise to the next N physical nodes" } },

  { h: "Trade-offs and the birth of NoSQL" },
  { p: "Dynamo explicitly chose **Availability and Partition Tolerance (AP)** in the CAP theorem, sacrificing immediate Consistency in exchange for SLA guarantees where 99.9% of requests completed under 300ms." },
  { p: "In 2007, Amazon published the paper at SOSP. Because Amazon did not open-source the code, the open-source community implemented the paper directly:" },
  { l: [
   "**Apache Cassandra (Facebook, 2008):** Combined Dynamo's partitioned ring with Google Bigtable's log-structured merge-tree (LSM) storage engine.",
   "**Basho Riak (2009):** A pure Erlang implementation of the Dynamo paper.",
   "**Amazon DynamoDB (2012):** Amazon's fully managed cloud service that incorporated Dynamo's partitioning with Paxos-based strong consistency options."
  ] }
 ],
 k: [
  "Dynamo prioritized write availability and 99.9th percentile latency over strict ACID consistency.",
  "Consistent hashing distributes keys across a ring, minimizing data movement when nodes join or fail.",
  "Sloppy quorums (W + R > N) and hinted handoff ensure high availability during network partitions.",
  "The 2007 Dynamo paper triggered the NoSQL explosion, directly inspiring Cassandra, Riak, and DynamoDB."
 ],
 r: ["Distributed System", "Eventual Consistency", "NoSQL", "Replication", "CAP Theorem", "High Availability"],
 src: [
  { t: "DeCandia et al. — Dynamo: Amazon's Highly Available Key-value Store (SOSP 2007)", u: "https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf" },
  { t: "Werner Vogels — Eventually Consistent (CACM 2009)", u: "https://cacm.acm.org/magazines/2009/1/15666-eventually-consistent/fulltext" }
 ]
},

{
 t: "Raft Consensus",
 s: "Making distributed agreement understandable",
 y: 2014, when: "June 2014",
 g: ["consensus", "distributed systems", "raft", "fault tolerance", "replicated state machine", "kubernetes"],
 tldr: "For two decades, Leslie Lamport's Paxos was the unchallenged theoretical foundation of distributed consensus, yet almost nobody in the industry could understand or implement it correctly. Diego Ongaro and John Ousterhout introduced Raft with 'understandability' as a primary engineering design goal. By decomposing consensus into three independent subproblems — Leader Election, Log Replication, and Safety — Raft became the consensus engine behind Kubernetes (via etcd), CockroachDB, TiKV, HashiCorp Consul, and modern cloud infrastructure.",
 say: [
  "Paxos was so obscure that real-world implementations constantly failed; Raft was explicitly designed to be easy for humans to understand.",
  "Raft breaks consensus into three clear phases: Leader Election, Log Replication, and Safety invariants.",
  "A leader cannot be elected unless its log contains all committed entries from previous terms (the Leader Completeness property).",
  "Raft powers the backbone of modern cloud computing through etcd in every Kubernetes cluster worldwide."
 ],
 b: [
  { h: "The Paxos comprehension crisis" },
  { p: "In 1998, Leslie Lamport published *The Part-Time Parliament*, introducing the **Paxos** algorithm for consensus in asynchronous distributed systems with unannounced failures. Paxos was mathematically profound, but notoriously unintelligible." },
  { p: "In 2007, Google engineers published *Paxos Made Live*, describing their multi-year ordeal implementing Paxos for Chubby: *'There are significant gaps between the description of the Paxos algorithm and the needs of a real-world system... the final system will be based on an unproven protocol.'* If Google's top engineers struggled to implement Paxos correctly, the broader software industry had little hope." },

  { h: "Design for understandability" },
  { p: "Diego Ongaro and John Ousterhout at Stanford set out to create a consensus algorithm whose primary design objective was human understandability. They conducted user studies with 43 computer science students to measure how quickly engineers could learn, explain, and correctly modify the protocol." },
  { p: "Raft decomposes consensus into three decoupled subproblems:" },
  { l: [
   "**1. Leader Election.** At any given time, every node is in one of three states: *Leader*, *Follower*, or *Candidate*. Time is divided into arbitrary numbered *Terms*. If a follower hears no heartbeat from the leader before a randomized election timeout (150ms–300ms), it transitions to Candidate and requests votes from peers. A candidate receiving votes from a majority of nodes becomes the new Leader.",
   "**2. Log Replication.** Clients send write commands exclusively to the Leader. The leader appends the command to its local log and broadcasts `AppendEntries` RPCs to followers. Once a majority of followers acknowledge the entry, the leader commits it and applies it to its local state machine.",
   "**3. Safety & Log Matching.** A candidate's vote request is rejected if its log is less up-to-date than the voter's log. This **Leader Completeness** guarantee ensures that any newly elected leader already holds all committed entries from all previous terms — meaning log entries only flow in one direction: from Leader to Followers."
  ] },
  { x: { lang: "text", code:
"                 Raft Replicated State Machine Architecture\n\n       Client Write Request ──► [ Leader (Term 2) ]\n                                        │\n                       AppendEntries RPC│ (Broadcast to Quorum)\n                                        ▼\n          ┌─────────────────────────────┴─────────────────────────────┐\n          ▼                                                           ▼\n┌───────────────────┐                                       ┌───────────────────┐\n│ Follower 1 (Term 2│                                       │ Follower 2 (Term 2│\n│ Log: [1:SET x=5]  │                                       │ Log: [1:SET x=5]  │\n│      [2:SET y=10] │                                       │      [2:SET y=10] │\n└─────────┬─────────┘                                       └─────────┬─────────┘\n          │ Majority Quorum Confirms (2 of 3)                         │\n          └─────────────────────────────┬─────────────────────────────┘\n                                        ▼\n                         Entry Committed & Applied to\n                         Replicated State Machine (KV Store)" } },

  { h: "Randomized timers solve split votes" },
  { p: "In symmetric distributed systems, split votes occur when two nodes simultaneously declare candidacy, splitting the vote 50/50 and causing repeated deadlocks. Raft solves this with **randomized election timeouts** (e.g. node A waits 170ms, node B waits 240ms)." },
  { p: "One node's timer inevitably expires first, allowing it to collect votes and broadcast heartbeats before other candidates trigger an election." },

  { h: "Modern infrastructure backbone" },
  { p: "Raft's clean specification allowed engineers across the world to build bulletproof, production-grade distributed consensus engines in months rather than years:" },
  { l: [
   "**etcd:** The distributed key-value store powering Kubernetes state, service discovery, and cluster configuration worldwide.",
   "**HashiCorp Consul & Nomad:** Raft-based service mesh and workload orchestration.",
   "**Distributed SQL:** CockroachDB, TiDB/TiKV, and YugabyteDB use Multi-Raft (running thousands of isolated Raft groups per database partition) for horizontal scaling with strong ACID guarantees."
  ] }
 ],
 k: [
  "Raft replaced inscrutable Paxos by decomposing consensus into Leader Election, Log Replication, and Safety.",
  "Randomized election timeouts cleanly resolve split-vote deadlocks during leader elections.",
  "The Leader Completeness property guarantees that entries only flow one-way from the leader to followers.",
  "Raft powers the consensus core of modern cloud infrastructure via etcd, Kubernetes, and Distributed SQL."
 ],
 r: ["Distributed System", "Consensus", "State Machine", "Leader Election", "Replication", "CAP Theorem"],
 src: [
  { t: "Ongaro & Ousterhout — In Search of an Understandable Consensus Algorithm (USENIX ATC 2014)", u: "https://raft.github.io/raft.pdf" },
  { t: "Raft Consensus Algorithm Interactive Visualization & Specification", u: "https://raft.github.io/" }
 ]
}

]);

