(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([
    {
      slug: "principle-of-least-privilege",
      why: {
        before: "In early operating systems and early UNIX, administrative access was binary: a process was either an unprivileged standard user or it ran as 'root' (UID 0), granting unrestricted god-mode control over all files, devices, memory, and hardware.",
        problem: "When monolithic services (like web servers, mail transfer agents, or DNS daemons) ran as root, a single software bug (such as a buffer overflow or command injection) instantly gave the attacker complete, unconstrained administrative ownership of the entire physical server.",
        shift: "Jerome Saltzer and Michael Schroeder (1975) formalized the Principle of Least Privilege (PoLP): every process, user, and program must be granted strictly the minimum operational permissions necessary to execute its valid business function, and for the minimum duration required."
      },
      num: {
        t: "Privilege Confinement Paradigms Across System Layers",
        h: ["Operating Layer", "Unconfined Mode (Anti-Pattern)", "Least-Privilege Confinement Boundary", "Granular Enforcement Mechanism", "Blast Radius of Exploitation"],
        r: [
          ["Operating System Process", "Daemon runs as root (UID 0)", "Unprivileged service user (nobody / app-user)", "Linux Capabilities (e.g., CAP_NET_BIND_SERVICE) + seccomp", "Local unprivileged user shell; cannot modify system files"],
          ["Container Runtime", "Container runs with --privileged flag", "Rootless container + read-only root filesystem", "Drop ALL capabilities; drop-cap=ALL; add CAP_NET_BIND_SERVICE", "Container escape prevented; host kernel remains shielded"],
          ["Cloud Infrastructure (IAM)", "AdministratorAccess / wildcard (Action: *)", "Fine-grained resource-scoped IAM policy", "Explicit actions (s3:GetObject) on specific ARNs only", "Attacker access bounded strictly to single S3 bucket"],
          ["Database Access Layer", "Application connects as DB superuser (postgres / sa)", "Dedicated microservice database user role", "Grant SELECT, INSERT on specific tables; revoke DROP/ALTER", "Attacker cannot drop tables, alter schema, or view other apps"],
          ["Developer Workstations", "Developers hold permanent local admin / domain admin", "Standard user accounts + Just-in-Time (JIT) sudo", "PAM sudoers auditing + ephemeral privileged access requests", "Malware cannot persist in system directories or hook drivers"]
        ],
        n: "The Principle of Least Privilege is implemented at the operating system level through Linux Capabilities. Modern Linux decomposed the historic monolithic authority of root (UID 0) into 41 distinct kernel capabilities (man capabilities). A web server that historically required root privileges solely to bind to privileged TCP port 80 no longer runs as UID 0; it runs as an unprivileged service user granted exclusively the CAP_NET_BIND_SERVICE capability. If compromised, the attacker has zero ability to load kernel modules (CAP_SYS_MODULE), intercept raw network packets (CAP_NET_RAW), or modify file ownerships (CAP_CHOWN). In cloud architecture (AWS, Azure, GCP IAM), least privilege requires eliminating wildcard actions (e.g., Action: 's3:*', Resource: '*') in favor of explicit, resource-scoped policies: Action: ['s3:GetObject', 's3:PutObject'], Resource: 'arn:aws:s3:::customer-invoices/*'. To prevent 'privilege creep' (the gradual accumulation of permanent permissions over time), modern enterprises deploy Just-in-Time (JIT) access and automated boundary analysis (such as AWS IAM Access Analyzer), automatically revoking unused permissions based on actual CloudTrail access logs."
      },
      miss: [
        {
          w: "Running an application as an unprivileged user means it can never perform privileged operations like binding to port 443.",
          r: "Modern operating systems decouple capabilities from user IDs; using Linux capabilities (setcap 'cap_net_bind_service=+ep' /path/to/binary), unprivileged processes can bind to low ports without running as root."
        },
        {
          w: "Applying least privilege is a one-time configuration task completed during application deployment.",
          r: "Least privilege requires continuous auditing; permissions inevitably accumulate over time (privilege creep), requiring regular automated access reviews and continuous removal of unused IAM permissions."
        },
        {
          w: "Giving a microservice broad read-only access across all database tables is safe because it cannot modify data.",
          r: "Excessive read access enables massive data exfiltration breaches; an attacker compromising a reporting service with broad read access can dump sensitive customer passwords, credit cards, and PII."
        },
        {
          w: "Containers automatically enforce the Principle of Least Privilege by default.",
          r: "By default, Docker containers run as root (UID 0) inside the container namespace and retain multiple dangerous kernel capabilities; least privilege requires explicitly declaring 'USER 10001' and dropping all capabilities."
        }
      ],
      trade: {
        buys: [
          "Dramatically reduced blast radius: a compromised service or user account cannot pivot to adjacent systems or escalate privileges.",
          "Containment of insider threats: limits the damage rogue or compromised employees can inflict across sensitive infrastructure.",
          "Protection against accidental catastrophic errors: prevents engineers from accidentally running DROP DATABASE or deleting cloud buckets.",
          "Regulatory audit compliance: satisfies mandatory least-privilege access requirements for SOC 2, ISO 27001, and PCI-DSS."
        ],
        costs: [
          "Operational engineering overhead: authoring and testing fine-grained IAM policies and capability lists requires significant development time.",
          "Deployment friction: overly restrictive permissions can cause sudden application runtime failures when new features are deployed.",
          "Administrative burden: managing thousands of fine-grained permissions requires automated tooling and continuous auditing.",
          "Emergency response delays: engineers facing production outages may need to request elevated temporary access via break-glass procedures."
        ],
        avoid: [
          "Deploying cloud IAM roles with wildcard permissions (e.g., 'Action': '*', 'Resource': '*') in production environments.",
          "Running production containerized web applications as root (UID 0) inside Docker containers.",
          "Connecting web applications to production databases using the root or superuser database credentials.",
          "Granting permanent administrative privileges to developer accounts instead of using Just-in-Time ephemeral role assumption."
        ]
      }
    },
    {
      slug: "role-based-access-control",
      why: {
        before: "In early multi-user operating systems and applications, permissions were managed via Discretionary Access Control (DAC), where access rights were assigned directly to individual user accounts on specific files or resources.",
        problem: "In large enterprises with thousands of employees and high turnover, managing permissions per-user created unmanageable complexity ('access control matrix explosion'); updating individual permissions when employees changed jobs caused orphaned access and security leaks.",
        shift: "Role-Based Access Control (RBAC, formalized by David Ferraiolo and Rick Kuhn in 1992 and standardized in ANSI/INCITS 359-2004) decoupled users from permissions by introducing the 'Role' abstraction: permissions are assigned to roles, and users are assigned to roles matching their job functions."
      },
      num: {
        t: "Access Control Architectures & Models Comparison",
        h: ["Access Control Model", "Core Abstraction", "Policy Assignment Mapping", "Dynamic Context Support", "Scalability & Administrative Burden"],
        r: [
          ["Discretionary Access Control (DAC)", "Owner-assigned file mode bits (rwx)", "Direct user-to-object permission lists", "None (Static user/group IDs)", "Collapses past a few dozen users; high permission drift"],
          ["Mandatory Access Control (MAC)", "Security clearance labels (Top Secret)", "Centrally enforced by system security policy", "None (Rigid classification hierarchy)", "High administrative complexity; military/defense deployments"],
          ["Role-Based Access Control (RBAC)", "Job function roles (e.g., Billing Admin)", "Users assigned to Roles; Roles assigned to Permissions", "Low (Context-blind; checks role membership only)", "Highly scalable for standard organizational hierarchies"],
          ["Attribute-Based Access Control (ABAC)", "Attributes (User, Resource, Environment)", "Evaluated dynamically via policy rules (XACML / OPA)", "High (Time, IP location, device posture, risk score)", "High policy complexity; maximum flexibility"],
          ["Relationship-Based Access Control (ReBAC)", "Object-to-object relationship graphs", "Google Zanzibar graph traversal (tuples of user#relation@object)", "High (Inherits permissions across data graphs)", "Ideal for consumer collaboration (Google Docs, Figma)"]
        ],
        n: "The formal ANSI/INCITS 359-2004 RBAC standard establishes a four-tier hierarchical specification. 1) **Core RBAC** models access as five fundamental sets: Users (U), Roles (R), Permissions (P), Operations (OPS), and Objects (OBS). The User-to-Role Assignment (UA ⊆ U x R) and Permission-to-Role Assignment (PA ⊆ P x R) are many-to-many relationships. A user's effective permissions are mathematically the union of permissions across all assigned active roles: Perms(u) = ⋃_{r ∈ Roles(u)} Perms(r). 2) **Hierarchical RBAC** introduces partial-order role inheritance (r_1 ≥ r_2), where senior roles automatically inherit all permissions granted to subordinate roles (e.g., an 'Engineering Director' automatically inherits all permissions of 'Software Engineer'), eliminating redundant policy definitions. 3) **Constrained RBAC** enforces Separation of Duty (SoD): Static Separation of Duty (SSD) mathematically prohibits a single user from holding mutually conflicting roles (e.g., a user cannot be both 'Invoice Creator' and 'Payment Approver'); Dynamic Separation of Duty (DSD) permits holding both roles, but strictly prohibits activating both roles within the same active session. A fundamental limitation of RBAC is 'Role Explosion': when applications attempt to enforce contextual rules (such as 'can edit document only during office hours if located in the US'), administrators create hundreds of bespoke roles (e.g., Editor_US_Daytime), driving modern systems toward hybrid RBAC-ABAC policy engines like Open Policy Agent (OPA)."
      },
      miss: [
        {
          w: "RBAC is sufficient to enforce fine-grained object ownership (e.g., User A can only edit their own profile).",
          r: "RBAC is coarse-grained and context-blind: it determines if a user can execute the 'EditProfile' action, but cannot easily verify whether the profile being edited belongs to that specific user (requiring ABAC, ReBAC, or contextual database queries)."
        },
        {
          w: "Roles should be created for each individual user in an organization to provide tailored access.",
          r: "Creating one role per user defeats the entire purpose of RBAC and triggers catastrophic Role Explosion; roles must represent generalized job functions (e.g., Support Tier 1), not individual human identities."
        },
        {
          w: "Checking if a user has the 'admin' role in frontend code provides secure authorization.",
          r: "Frontend role checks merely control UI visibility; true authorization must be enforced on every backend API endpoint and database query, verifying the role cryptographically on the server."
        },
        {
          w: "Once RBAC is configured, permissions never need to be updated.",
          r: "RBAC systems suffer from 'permission creep' as employees transfer departments and accumulate roles; organizations must conduct regular automated access certification campaigns to prune obsolete roles."
        }
      ],
      trade: {
        buys: [
          "Operational scalability: onboard, reassign, and offboard employees by modifying role memberships rather than thousands of ACLs.",
          "Enforcement of Separation of Duty: mathematically prevents toxic combinations of privileges (e.g., creating and approving payments).",
          "Simplified auditing and compliance: auditors verify permissions mapped to roles rather than inspecting millions of user-file tuples.",
          "Standardized access governance: aligns software permissions directly with enterprise organizational hierarchies."
        ],
        costs: [
          "Role Explosion hazard: attempting to handle fine-grained contextual exceptions causes role counts to proliferate uncontrollably.",
          "Lack of dynamic context: standard RBAC cannot evaluate request IP, time of day, device health, or document ownership.",
          "Initial modeling investment: designing a clean enterprise role catalog across diverse departments requires significant effort.",
          "Stale role accumulation: users accumulate roles over years of promotions unless automated de-provisioning is enforced."
        ],
        avoid: [
          "Hardcoding role checks (e.g., if (user.role === 'admin')) throughout business logic instead of checking granular permissions (can_delete_user).",
          "Allowing users to hold mutually conflicting roles that violate Static Separation of Duty policies.",
          "Creating hundreds of hyper-specific roles for individual users instead of adopting Attribute-Based Access Control (ABAC).",
          "Failing to revoke previous roles when an employee transfers to an entirely different department or job function."
        ]
      }
    },
    {
      slug: "defence-in-depth",
      why: {
        before: "Early computer security relied on the 'Castle-and-Moat' paradigm: build a single, heavily fortified outer perimeter (a network firewall) and assume everything inside the corporate network is completely trusted and safe.",
        problem: "Perimeter defense failed completely against modern attacks: a single compromised employee laptop (via phishing or infected USB) or an unpatched external VPN gateway allowed attackers to breach the perimeter and roam freely across internal unencrypted servers.",
        shift: "Defence in Depth (adapted from military strategy by the NSA in the 1990s) established a multi-layered security architecture where diverse, redundant security controls are deployed across physical, network, identity, host, application, and data tiers so that the failure of any single barrier is safely contained."
      },
      num: {
        t: "Multi-Layered Defence-in-Depth Architecture",
        h: ["Architectural Layer", "Primary Threat Mitigated", "Primary Preventative Control", "Secondary Resilient Control", "Detective / Auditing Control"],
        r: [
          ["Perimeter & Edge", "DDoS attacks, malicious bot scrapers, port scans", "Cloudflare WAF / AWS Shield / Edge Rate Limiting", "Perimeter stateful firewall dropping unsolicited traffic", "Real-time edge flow logs, NetFlow, CDN analytics"],
          ["Network & Mesh", "Lateral movement between compromised workloads", "VPC private subnets + Kubernetes NetworkPolicies", "Mutual TLS (mTLS) service mesh encryption (Istio)", "VPC Flow Logs, eBPF network monitoring (Cilium)"],
          ["Identity & Access", "Compromised credentials, unauthorized API access", "Phishing-resistant MFA (FIDO2) + Single Sign-On", "Role-Based Access Control (RBAC) + Least Privilege", "Audit logs (AWS CloudTrail), anomalous login alerts"],
          ["Host & Runtime", "Privilege escalation, container breakout", "Hardened OS images (CIS benchmarks) + read-only root", "AppArmor / SELinux profiles + seccomp syscall filters", "Host intrusion detection (Falco, Wazuh, Osquery)"],
          ["Application Code", "Injection flaws (SQLi, XSS, SSRF), business logic bugs", "Parameterized ORMs + strict context output encoding", "Content Security Policy (CSP) + input validation schemas", "Web Application Firewall (WAF), static SAST scans"],
          ["Data & Storage", "Data theft, unattached drive theft, database dumps", "Envelope Encryption at rest (AES-256-GCM via KMS)", "Field-level data masking + database tokenization", "Database query audit logs, S3 access access logs"]
        ],
        n: "Defence in Depth operates on the mathematical principle of independent failure probabilities. If an enterprise relies on a single perimeter firewall with a compromise probability of p_1 = 0.05 (5%), the system fails 5% of the time. However, if the architecture implements five independent, overlapping security layers (Edge WAF, Network Microsegmentation, mTLS Authentication, Host SELinux Confinement, and Database Envelope Encryption), each with independent breach probabilities p_1 through p_5, the composite probability of an attacker achieving unauthorized data exfiltration is the product of all failure rates: P_compromise = ∏_{i=1}^5 p_i. Even if an attacker exploits a zero-day vulnerability in the public web application (Layer 5), the host container's read-only filesystem and seccomp filters (Layer 4) prevent them from installing persistence tools; the network policy (Layer 2) blocks them from opening outbound reverse shells; and the database encryption key segregation (Layer 6) prevents them from reading plaintext customer data. Modern implementations synthesize Defence in Depth with the Zero Trust Architecture (NIST SP 800-207): assuming that the network is already hostile and compromised, every single request—even between two containers on the same physical host—must be independently authenticated, authorized, encrypted, and audited."
      },
      miss: [
        {
          w: "If you have a strong firewall and full disk encryption, your web application is fully defended in depth.",
          r: "Full disk encryption protects data only when the physical server is powered off; while the operating system is running, the database reads plaintext, meaning an application SQL injection completely bypasses disk encryption."
        },
        {
          w: "Defence in depth means deploying multiple firewalls from different vendors in a row.",
          r: "Deploying identical controls in sequence is redundant, not layered; true defence in depth deploys fundamentally different *classes* of security across distinct abstraction layers (network, identity, code, runtime, data)."
        },
        {
          w: "Zero Trust and Defence in Depth are competing, mutually exclusive security philosophies.",
          r: "Zero Trust is the modern evolution of Defence in Depth: it operationalizes layered security by eliminating ambient network trust and enforcing continuous per-transaction verification at every layer."
        },
        {
          w: "Security layers should be transparent and never introduce user friction or latency.",
          r: "Security controls inevitably introduce minor trade-offs (handshake latency, MFA prompts, permission request workflows); the engineering goal is minimizing unnecessary friction while maintaining non-negotiable security boundaries."
        }
      ],
      trade: {
        buys: [
          "Complete containment of zero-day exploits: a zero-day vulnerability in one tier is neutralized by subsequent security layers.",
          "Elimination of single points of security failure: no single compromised credential or misconfigured server causes total breach.",
          "Early attacker detection: redundant detective controls detect and alert on unauthorized lateral movement before data exfiltration.",
          "Resilience against insider threats: prevents employees with legitimate network access from accessing unauthorized databases."
        ],
        costs: [
          "Architectural complexity: managing and orchestrating security configurations across six distinct layers requires specialized expertise.",
          "Latency accumulation: traffic passing through edge WAFs, ingress proxies, mTLS sidecars, and KMS decryption accumulates latency.",
          "Operational maintenance overhead: updating firewall rules, IAM policies, and container security profiles across microservices.",
          "Troubleshooting friction: diagnosing legitimate application failures requires checking multiple security layers (WAF, network, IAM)."
        ],
        avoid: [
          "Assuming internal network traffic behind the perimeter firewall is safe and leaving internal microservice RPC unencrypted.",
          "Relying on a single security control (like a WAF) to protect vulnerable, unpatched application code.",
          "Deploying security layers without centralized logging (SIEM) to correlate cross-layer security events.",
          "Failing to encrypt sensitive database backups because the production database volume is already encrypted."
        ]
      }
    },
    {
      slug: "multi-factor-authentication",
      why: {
        before: "In early computing and early internet services, user identity was authenticated using single-factor authentication: something the user knows (a username and a static secret password).",
        problem: "Static passwords proved disastrous: users reuse identical passwords across hundreds of services, choose predictable words, fall victim to phishing emails, and have credentials exposed in third-party database breaches, leading to automated account takeovers.",
        shift: "Multi-Factor Authentication (MFA, standardized in NIST SP 800-63B) mandated that identity verification require independent, orthogonal evidence from at least two distinct authentication factor categories: knowledge, possession, and inherence."
      },
      num: {
        t: "MFA Authentication Factors & Cryptographic Mechanisms",
        h: ["MFA Method / Factor", "Factor Category", "Cryptographic Substrate", "Phishing Resistance Status", "Vulnerability / Attack Vector"],
        r: [
          ["SMS / Voice Call OTP", "Possession (Telephony network)", "Plaintext numeric code transmitted over SS7 cellular", "Zero (Easily phished via reverse proxy kits)", "SIM swapping attacks, SS7 cellular interception"],
          ["Time-Based OTP (TOTP - RFC 6238)", "Possession (Authenticator app)", "HMAC-SHA1(Secret, Floor(UnixTime/30))", "Zero (Trivially phished via real-time reverse proxies)", "Real-time relay kits (Evilginx), device malware"],
          ["Push Notification (Mobile Prompt)", "Possession (Apple/Google APNs)", "TLS tunnel to mobile app with public-key response", "Low to Moderate (Vulnerable to MFA fatigue)", "MFA Prompt Bombing / Fatigue attacks, push spamming"],
          ["FIDO2 / WebAuthn (Passkeys)", "Possession + Inherence (Hardware Key)", "Asymmetric public-key cryptography (secp256r1/Ed25519)", "Absolute (Cryptographically immune to phishing)", "Physical theft of hardware key without PIN/biometric"],
          ["Biometric Inherence (TouchID/FaceID)", "Inherence (Biological trait)", "Local hardware secure enclave matching biometric template", "Absolute (When paired with local WebAuthn key)", "Coerced physical unlocking, flawed sensor spoofing"]
        ],
        n: "MFA mandates combining at least two of the three canonical authentication factors: 1) Something you know (Knowledge: password, PIN); 2) Something you have (Possession: hardware token, smartphone, cryptographic key); 3) Something you are (Inherence: fingerprint, facial geometry). In Time-Based One-Time Passwords (TOTP / RFC 6238), the client authenticator and the authentication server share a pre-shared 160-bit symmetric secret K. The current time is divided into 30-second windows: T = Floor((UnixTime - T_0) / 30). The 6-digit code is computed as Truncate(HMAC-SHA1(K, T)) mod 10^6. While TOTP defeats credential stuffing, it is completely vulnerable to modern reverse-proxy phishing (Evilginx): the attacker relays the victim's TOTP code to the real server in real time and captures the authenticated session cookie. The only truly phishing-resistant standard is FIDO2 / WebAuthn (W3C standard). In WebAuthn, authentication uses asymmetric public-key cryptography bound to the browser's exact URL origin: when logging into https://bank.com, the browser sends the domain origin to the client's hardware authenticator (YubiKey, TouchID). The authenticator signs the server challenge using its private key *only* for that exact origin. If the user visits https://bank-phishing.com, the authenticator signs the phishing domain; the legitimate bank server rejects the signature, rendering phishing mathematically impossible."
      },
      miss: [
        {
          w: "SMS-based one-time text message codes provide high security for banking and enterprise accounts.",
          r: "NIST SP 800-63B explicitly deprecates SMS 2FA: SMS is vulnerable to SIM-swapping (bribing or tricking mobile carrier employees to port a phone number), SS7 telecommunications interception, and real-time reverse-proxy phishing."
        },
        {
          w: "Entering a password and then answering a security question (like your mother's maiden name) counts as two-factor authentication.",
          r: "A password and a security question both belong to the exact same factor category: 'Something you know' (Knowledge); true multi-factor authentication requires combining distinct factor categories (Knowledge + Possession)."
        },
        {
          w: "Using an authenticator app with 6-digit TOTP codes protects your users from phishing attacks.",
          r: "Standard TOTP codes are not phishing-resistant; reverse-proxy phishing tools (Evilginx) proxy login requests in real time, capturing the victim's 6-digit code and hijacking the authenticated session cookie within seconds."
        },
        {
          w: "Once MFA is enabled, user session cookies can never be stolen or hijacked.",
          r: "MFA protects only the initial authentication handshake; if an attacker infects a user's machine with Infostealer malware, they steal the post-authentication session cookies directly from the browser, bypassing MFA entirely."
        }
      ],
      trade: {
        buys: [
          "Elimination of credential stuffing: stolen password dumps are rendered completely useless without the second authentication factor.",
          "Phishing immunity via WebAuthn: FIDO2 passkeys mathematically prevent domain spoofing and credential theft.",
          "Regulatory and insurance compliance: mandatory requirement for cyber insurance policies, PCI-DSS, and SOC 2 audits.",
          "Protection against employee password reuse: isolates corporate network security from third-party public breach dumps."
        ],
        costs: [
          "User login friction: entering secondary codes or tapping hardware tokens slows down user authentication workflows.",
          "Account recovery complexity: handling lost, broken, or reset phones requires secure, out-of-band identity verification recovery channels.",
          "Hardware token provisioning costs: purchasing and distributing physical FIDO2 keys (YubiKeys) to thousands of employees.",
          "MFA Fatigue attack risk: push-notification MFA can be abused by attackers bombarding employees with midnight push notifications."
        ],
        avoid: [
          "Using SMS text messaging as the primary or sole MFA factor for sensitive administrative or financial accounts.",
          "Deploying simple push notifications without 'Number Matching' (prompting the user to enter the specific digits shown on screen).",
          "Providing weak account recovery options (like security questions) that completely bypass the MFA requirement.",
          "Failing to enforce phishing-resistant FIDO2/WebAuthn for administrative cloud infrastructure access (AWS/GCP consoles)."
        ]
      }
    },
    {
      slug: "brute-force-attack",
      why: {
        before: "In early system security, network services and login portals accepted unlimited consecutive authentication attempts without rate limits, artificial delays, or account lockout mechanisms.",
        problem: "Attackers used automated computer scripts to systematically guess thousands of passwords per second (or cycle through encryption keys), inevitably cracking weak user credentials and penetrating network perimeters.",
        shift: "Modern security engineering deployed rate-limiting algorithms (Token Bucket, Leaky Bucket), exponential backoff, account lockout policies, CAPTCHAs, and IP reputation firewalls to make brute-force guessing computationally and economically impossible."
      },
      num: {
        t: "Brute-Force Attack Variants & Technical Characteristics",
        h: ["Attack Variant", "Target Scope & Strategy", "Velocity / Speed", "Detection Signature", "Primary Defensive Countermeasure"],
        r: [
          ["Classic Direct Brute-Force", "Single account; cycles thousands of passwords", "High (hundreds to thousands of attempts/sec)", "Spike in 401 Unauthorized errors from single IP", "Account lockout, exponential backoff, rate limiting"],
          ["Password Spraying", "Thousands of accounts; tests 1 common password", "Low and slow (1 attempt per account per hour)", "Distributed failed logins across many distinct usernames", "Detecting identical passwords across accounts; MFA"],
          ["Distributed Botnet Brute-Force", "Rotates across thousands of residential proxy IPs", "Massive aggregate volume; low per-IP volume", "High aggregate failure rate; diverse User-Agents", "Behavioral bot detection, CAPTCHA, WebAuthn"],
          ["Offline Hash Cracking", "Stolen database password hash dump", "Astronomical (Billions/sec via Hashcat on GPUs)", "Zero network footprint (executes entirely offline)", "Memory-hard KDFs (Argon2id, bcrypt) with high work factor"],
          ["Reverse Brute-Force", "Fixes password (e.g., 'Winter2024!'); guesses usernames", "Moderate; avoids locking any single user", "High volume of invalid usernames tested", "Generic error messages ('Invalid username or password')"]
        ],
        n: "The mathematical probability of a brute-force attack succeeding is governed by the binomial probability of guessing correctly within k attempts across a keyspace or dictionary of size N: P(success) = 1 - (1 - 1/N)^k ≈ 1 - e^(-k/N). For an unthrottled 4-digit numeric PIN (N = 10,000 combinations), an automated script executing 100 requests per second will crack the PIN in at most 100 seconds (average 50 seconds). For an 8-character alphanumeric password (N = 62^8 ≈ 2.18 * 10^14 combinations), an online service enforcing rate limiting (e.g., 5 attempts per 15 minutes) would require over 12 million years to test a fraction of 1% of the space. Consequently, modern attackers have abandoned direct single-account brute-forcing in favor of Password Spraying: rather than attempting 10,000 passwords against one user (which instantly triggers account lockout thresholds), the attacker attempts a single highly probable seasonal password (e.g., 'Spring2024!') across 50,000 distinct enterprise email addresses. By spacing attempts across hours and routing through rotating residential proxies, password spraying remains beneath per-account and per-IP lockout thresholds while successfully compromising dozens of weak accounts."
      },
      miss: [
        {
          w: "Enforcing an account lockout policy (locking accounts after 5 failed attempts) completely solves brute-force attacks.",
          r: "Aggressive account lockouts expose services to trivial Denial-of-Service (DoS) attacks: an attacker scripts failed logins for all corporate usernames, locking out the entire company; modern systems use progressive delays or CAPTCHAs instead."
        },
        {
          w: "Having an 8-character password with letters, numbers, and symbols makes you safe from offline brute-force cracking.",
          r: "An 8-character password has a maximum entropy of ~47 bits; an offline GPU cracking cluster testing 100 billion hashes per second against fast hashes (like NTLM or SHA-256) will crack every possible 8-character password in hours."
        },
        {
          w: "Returning detailed error messages ('User does not exist' vs 'Incorrect password') helps users without compromising security.",
          r: "Detailed error messages enable Username Enumeration, allowing brute-force attackers to filter out invalid usernames and focus their attacks exclusively on verified accounts."
        },
        {
          w: "Brute-force attacks only target user login forms on web pages.",
          r: "Attackers aggressively brute-force API endpoints, SSH daemons (port 22), RDP remote desktops (port 3389), VPN gateways, password-reset tokens, and multi-factor authentication SMS/TOTP codes."
        }
      ],
      trade: {
        buys: [
          "Account credential security: prevents automated software from systematically guessing user passwords or PINs.",
          "Protection of sensitive endpoints: shields password reset tokens, API keys, and one-time verification codes from discovery.",
          "Early attack detection: monitoring failed login rates provides early warning of targeted adversary reconnaissance.",
          "Reduced server compute load: blocking malicious volumetric guessing scripts saves backend CPU and database connection pools."
        ],
        costs: [
          "Legitimate user lockouts: legitimate users who forget their passwords can be locked out, generating IT helpdesk support tickets.",
          "Denial-of-Service vulnerability: poorly designed lockout policies can be weaponized by attackers to lock out all employees.",
          "State management overhead: distributed rate-limiting requires centralized, high-speed in-memory datastores (Redis).",
          "User experience friction: CAPTCHAs and progressive delays frustrate legitimate users during accidental typos."
        ],
        avoid: [
          "Returning distinct error messages that reveal whether an email address exists in the system (always return generic failure messages).",
          "Locking accounts permanently on failed attempts without automated self-service email or SMS unlocking mechanisms.",
          "Relying on simple IP-based rate limiting alone (attackers bypass this via rotating residential proxy botnets).",
          "Permitting unlimited attempts on short verification codes (e.g., 6-digit SMS/email password reset tokens)."
        ]
      }
    },
    {
      slug: "credential-stuffing",
      why: {
        before: "Organizations historically operated on the assumption that as long as their own internal databases and web applications were secure and unbreached, their user accounts were safe from compromise.",
        problem: "Because over 65% of Internet users reuse identical passwords across multiple websites, breaches at third-party services (e.g., a forum or retail site) leak hundreds of millions of valid email/password pairs, which automated botnets immediately test against major banking and SaaS portals.",
        shift: "Credential Stuffing was formalized as a massive automated threat (OWASP Automated Threat OAT-008), driving the adoption of breached credential screening (Have I Been Pwned API), behavioral bot detection, and mandatory multi-factor authentication."
      },
      num: {
        t: "Credential Stuffing vs Related Authentication Attack Vectors",
        h: ["Attack Vector / Category", "Input Data Source", "Target Breadth / Scope", "Typical Success Rate", "Primary Architectural Defense"],
        r: [
          ["Credential Stuffing (OAT-008)", "Stolen third-party breach dumps (Combo lists)", "Massive (Millions of accounts across high-value sites)", "0.1% to 2% (Yields tens of thousands of accounts)", "Breached credential screening, bot management, MFA"],
          ["Password Spraying", "Small set of common passwords (e.g., 'Company2024!')", "Broad (Thousands of enterprise corporate emails)", "0.5% to 5% of enterprise employees", "Banning common seasonal passwords, anomaly detection"],
          ["Dictionary Brute-Force", "Wordlists (e.g., rockyou.txt) + permutations", "Targeted (Single account or small group)", "High against weak passwords; low against strong", "Progressive rate limiting, account lockout, CAPTCHA"],
          ["Targeted Phishing", "Attacker-crafted deceptive clone websites", "Specific individuals or departments", "10% to 30% click/submission rate", "Phishing-resistant WebAuthn passkeys, email DMARC"]
        ],
        n: "Credential stuffing is an automated cyberattack where adversaries take 'combo lists' (large text files containing tens of millions of username:password pairs harvested from past corporate data breaches) and execute automated login requests against targeted high-value services (banks, streaming services, e-commerce, cloud platforms). The attack is orchestrated via specialized bot automation suites (such as OpenBullet or custom headless browser clusters) paired with rotating residential proxy networks. The proxy network routes every individual login request through a different residential consumer ISP IP address, rendering traditional per-IP rate limiting completely ineffective. While the conversion rate is statistically low (typically between 0.1% and 2%), testing a 50-million credential combo list yields 50,000 to 1,000,000 compromised accounts in a matter of hours. Defending against credential stuffing requires a three-tier defense: 1) **Compromised Credential Screening**: Checking user passwords at signup and login against known breach databases using the Have I Been Pwned k-Anonymity API (NIST SP 800-63B guideline: only the first 5 characters of the SHA-1 hash are sent to the API, preserving user privacy); 2) **Behavioral Bot Detection**: Analyzing TLS client handshakes (JA3/JA4 fingerprints), HTTP/2 frame settings, and behavioral biometrics to differentiate headless bot browsers from real humans; and 3) **Enforcing MFA**: Even when the password matches perfectly, the lack of the second factor halts the automated botnet instantly."
      },
      miss: [
        {
          w: "Credential stuffing means hackers breached your company's database to steal your customer passwords.",
          r: "Credential stuffing does not exploit any vulnerability in your database; attackers use credentials stolen from *other* breached companies and exploit human password reuse against your login API."
        },
        {
          w: "Standard IP-based rate limiting (e.g., max 10 requests per IP per minute) stops credential stuffing attacks.",
          r: "Attackers route credential stuffing traffic through distributed residential proxy networks encompassing millions of compromised residential IP addresses, sending only 1 or 2 requests per IP."
        },
        {
          w: "Strong password complexity rules (requiring uppercase, numbers, and symbols) prevent credential stuffing.",
          r: "If a user creates a complex password like 'Tr0ub4dor&3' and reuses it on multiple websites, compromising that password on one site allows attackers to stuff it into all other sites regardless of complexity."
        },
        {
          w: "Credential stuffing only affects consumer retail websites and is irrelevant to enterprise B2B SaaS.",
          r: "Enterprise employees frequently reuse corporate passwords for external personal services; credential stuffing campaigns routinely compromise enterprise VPNs, Single Sign-On (SSO) portals, and GitHub accounts."
        }
      ],
      trade: {
        buys: [
          "Account takeover prevention: stops automated cybercriminals from draining customer loyalty points, funds, and private data.",
          "Infrastructure protection: prevents massive bot login floods from saturating backend authentication databases and servers.",
          "Preserved business reputation: avoids public breach disclosures and regulatory penalties resulting from mass credential abuse.",
          "Reduced customer support costs: eliminates thousands of tickets from legitimate users locked out by account takeovers."
        ],
        costs: [
          "Bot management licensing expense: enterprise bot detection solutions (Cloudflare, Akamai, Arkose) cost thousands of dollars per month.",
          "False-positive customer friction: aggressive bot challenges can present difficult CAPTCHAs to legitimate human users.",
          "Authentication latency: checking passwords against compromised breach databases adds 50 to 100 milliseconds to login flows.",
          "Ongoing arms race: attackers continuously update bot scripts, spoofing mobile device signatures and human mouse movements."
        ],
        avoid: [
          "Relying on basic IP rate limiting to protect authentication APIs against distributed botnet traffic.",
          "Permitting users to choose passwords that appear in public compromised breach databases (use k-Anonymity breach screening).",
          "Leaving mobile API login endpoints unmonitored (attackers routinely target mobile endpoints that lack web CAPTCHAs).",
          "Allowing single-factor password authentication without deploying multi-factor authentication on customer portals."
        ]
      }
    },
    {
      slug: "phishing",
      why: {
        before: "Computer security historically focused almost exclusively on technical software vulnerabilities (buffer overflows, open ports, software bugs), treating human users as peripheral to technical security models.",
        problem: "The strongest mathematical cryptography, firewalls, and operating system sandboxes are rendered completely useless if a legitimate human user willingly types their credentials, passwords, and MFA codes into a fraudulent website disguised as their corporate portal.",
        shift: "Phishing established social engineering and deceptive mimicry as the primary initial access vector in over 80% of enterprise security breaches, driving domain email authentication (SPF, DKIM, DMARC), anti-phishing hardware tokens (FIDO2/WebAuthn), and security awareness training."
      },
      num: {
        t: "Phishing Attack Classifications & Delivery Vectors",
        h: ["Phishing Classification", "Target Scope & Customization", "Primary Delivery Medium", "Attacker Objective", "Primary Technical Defense"],
        r: [
          ["Mass Bulk Phishing", "Broad spray (Millions of random targets)", "Spam email, spoofed notifications", "Harvesting consumer banking credentials, credit cards", "Email spam filtering, domain blacklists, browser heuristics"],
          ["Spear Phishing", "Highly targeted (Specific individual or company)", "Customized email using target reconnaissance", "Initial access to corporate network, lateral movement", "DMARC enforcement, email attachment sandboxing, EDR"],
          ["Whaling (Executive Fraud)", "High-profile executives (C-suite, finance directors)", "Urgent executive impersonation emails", "Authorizing fraudulent multi-million dollar wire transfers", "Multi-person dual approval policies, out-of-band phone confirmation"],
          ["Reverse-Proxy Phishing (Evilginx)", "Any user with multi-factor authentication", "Deceptive lookalike domain acting as live MITM proxy", "Intercepting session cookies to bypass 2FA / TOTP", "Phishing-resistant FIDO2 / WebAuthn hardware keys"],
          ["Smishing / Vishing", "Mobile phone users", "SMS text messages / Telephone voice calls", "Urgent bank fraud alerts, package delivery scams", "Carrier spam filtering, zero-trust employee protocols"]
        ],
        n: "Phishing relies on deceptive psychological manipulation paired with technical domain mimicry to trick users into divulging credentials, executing malware, or authorizing fraudulent transactions. Modern attackers use Reverse-Proxy Phishing frameworks (such as Evilginx, Modlishka, or Muraena) to defeat standard Multi-Factor Authentication (MFA). Rather than creating a static fake webpage, the attacker deploys a transparent Man-in-the-Middle reverse proxy hosted on a lookalike domain (e.g., login.microsoft-verify.com). The proxy forwards the victim's HTTP requests to the legitimate corporate login portal in real time and proxies the legitimate server's responses back to the victim. When the victim enters their username, password, and 6-digit TOTP code, the proxy submits them directly to the real server, successfully completing authentication. The proxy then intercepts the authenticated session cookie (Set-Cookie) returned in the HTTP response headers, logging the user in while saving the valid session token for the attacker. The attacker imports this session cookie into their own browser, obtaining full access to the corporate account without ever needing the password or MFA token again. The only cryptographic technology that defeats reverse-proxy phishing is FIDO2 / WebAuthn (Passkeys): WebAuthn cryptographically binds the authentication assertion to the browser's exact URL origin; because the authenticator signs the domain name shown in the browser address bar (microsoft-verify.com), the legitimate server (microsoft.com) rejects the signature."
      },
      miss: [
        {
          w: "Enforcing standard SMS or Authenticator App (TOTP) multi-factor authentication protects users from phishing.",
          r: "Standard SMS and TOTP codes are easily captured by modern reverse-proxy phishing kits (Evilginx) that relay codes in real time and steal session cookies; true phishing immunity requires FIDO2/WebAuthn hardware keys."
        },
        {
          w: "Phishing emails always contain obvious spelling mistakes, poor grammar, and suspicious Nigerian prince stories.",
          r: "Modern spear phishing attacks use Generative AI (LLMs) and extensive corporate reconnaissance (LinkedIn scraping) to author flawless, highly persuasive, context-aware emails mimicking real executives and vendors."
        },
        {
          w: "Looking for the HTTPS padlock icon in the browser address bar guarantees a website is not a phishing site.",
          r: "Over 85% of phishing websites use HTTPS and hold valid SSL certificates (obtained automatically via Let's Encrypt); the padlock proves only that connection encryption exists, not that the website owner is legitimate."
        },
        {
          w: "Security awareness training alone can reduce employee phishing click rates to 0%.",
          r: "Even after extensive training, real-world human error rates in simulated phishing tests rarely drop below 3% to 5%; organizations must implement technical guardrails (FIDO2 keys, DMARC, sandboxes) that prevent breach when a human fails."
        }
      ],
      trade: {
        buys: [
          "Human factor defense: trains employees to identify deceptive social engineering tactics and report suspicious emails.",
          "Domain reputation protection: deploying SPF, DKIM, and DMARC prevents cybercriminals from spoofing your corporate domain name.",
          "Phishing-resistant authentication: deploying WebAuthn passkeys mathematically eliminates credential theft via fake login portals.",
          "Early threat visibility: user-reported phishing alerts provide security operations centers (SOC) with early warning of campaigns."
        ],
        costs: [
          "Security awareness fatigue: excessive or punitive phishing simulations alienate employees and create friction between IT and staff.",
          "Email deliverability friction: strict DMARC rejection policies (p=reject) can block legitimate third-party marketing emails if misconfigured.",
          "Hardware key deployment expense: procuring and distributing physical FIDO2 tokens across distributed global workforces.",
          "Continuous evasion adaptations: attackers continuously rotate lookalike domains, cloud hosting providers, and obfuscation techniques."
        ],
        avoid: [
          "Relying on user vigilance and security awareness training as the sole line of defense against credential theft.",
          "Leaving corporate email domains without strict DMARC 'p=reject' policies configured.",
          "Using easily phished SMS or mobile push notifications for administrative access to critical infrastructure.",
          "Treating employees who click simulated phishing emails punitively rather than reinforcing positive reporting behaviors."
        ]
      }
    },
    {
      slug: "social-engineering",
      why: {
        before: "Information security treated computer networks as closed, purely technological systems governed by mathematical algorithms, assuming system compromise required technical software exploitation.",
        problem: "Adversaries realized that the human brain possesses hardwired psychological heuristics (trust of authority, fear of consequences, social proof, urgency) that can be manipulated through psychological deception, allowing attackers to bypass millions of dollars in cybersecurity hardware with a single phone call.",
        shift: "Social Engineering (popularized by Kevin Mitnick in 'The Art of Deception') established the discipline of exploiting human psychology to breach security perimeters, establishing human factors, multi-person operational controls, and Zero Trust verification as mandatory security pillars."
      },
      num: {
        t: "Social Engineering Attack Frameworks & Psychological Vectors",
        h: ["Social Engineering Framework", "Psychological Trigger Exploited", "Delivery Medium / Vector", "Attacker Objective", "Procedural & Technical Countermeasure"],
        r: [
          ["Pretexting", "Trust, professionalism, fabricated believable scenario", "Telephone (vishing), in-person impersonation, email", "Tricking helpdesk into resetting an executive's password", "Out-of-band employee verification, multi-factor helpdesk resets"],
          ["Baiting", "Curiosity, greed, desire for free goods", "Malicious USB drives dropped in parking lots, free downloads", "Inducing victim to plug infected hardware into corporate PC", "Disabling USB mass storage ports via endpoint EDR; training"],
          ["Quid Pro Quo", "Reciprocity (Offering a service in exchange for info)", "Fake IT support calls offering to fix a computer glitch", "Gaining remote desktop access (TeamViewer) to corporate PC", "Inward IT support protocols; employees must never accept unsolicited help"],
          ["Tailgating / Piggybacking", "Politeness, social reluctance to challenge strangers", "Physical building security doors, badges, turnstiles", "Gaining physical entry into restricted server rooms/offices", "Anti-tailgating turnstiles, mantrap doors, security badge culture"],
          ["Watering Hole Attack", "Implicit trust of third-party community websites", "Compromising an industry news website frequented by targets", "Delivering drive-by browser zero-days to specific employees", "Strict endpoint browser sandboxing, DNS threat filtering"]
        ],
        n: "Social Engineering exploits cognitive vulnerabilities in human psychology, specifically the principles of influence formalized by psychologist Robert Cialdini: 1) **Authority**: people instinctively comply with recognized authority figures; attackers pose as corporate executives, law enforcement, or IT directors; 2) **Urgency and Fear**: artificially induced time pressure ('Your account will be terminated in 15 minutes') forces victims to bypass logical, deliberative reasoning (System 2 cognitive processing) in favor of hasty emotional reactions (System 1); 3) **Liking and Social Proof**: attackers build rapport and claim 'everyone else on your team has already approved this'; 4) **Scarcity and Reciprocity**: offering unsolicited help or gifts triggers an innate psychological urge to reciprocate. In high-profile corporate attacks (such as the 2020 Twitter breach and 2022 Uber breach), attackers used Vishing (Voice Phishing) to contact IT helpdesk contractors, pretexting as internal employees locked out of their VPNs. Technical and procedural defenses require eliminating single-person discretion: enforcing the 'Four-Eyes Principle' (dual-authorization requirements for financial transactions or privileged account creation), automated out-of-band verification callbacks, and implementing Zero Trust architectures where technical controls (FIDO2 hardware keys, microsegmentation) physically prevent users from executing catastrophic actions even if successfully deceived."
      },
      miss: [
        {
          w: "Smart, highly educated technical employees are immune to social engineering attacks.",
          r: "Intelligence does not grant immunity to psychological manipulation; sophisticated social engineers target emotional triggers (pride, urgency, fear, helpfulness) and execute deep reconnaissance to craft hyper-believable pretexts."
        },
        {
          w: "Social engineering is strictly a non-technical problem that cannot be mitigated with technical controls.",
          r: "Technical controls are the most effective defense against social engineering: hardware security keys (FIDO2) prevent credential theft, least privilege blocks lateral movement, and network microsegmentation halts breach propagation."
        },
        {
          w: "Physical security controls (badges, door locks) are separate from cybersecurity.",
          r: "Physical access directly compromises cybersecurity: a social engineer tailgating through an office door can plug a hardware keylogger or rogue Wi-Fi pineapple directly into the internal corporate network."
        },
        {
          w: "Deepfake voice and video cloning are theoretical sci-fi threats not yet seen in real attacks.",
          r: "AI voice and video cloning (vishing) is actively used in multi-million dollar corporate fraud, generating real-time cloned executive voices on phone calls to coerce finance teams into authorizing wire transfers."
        }
      ],
      trade: {
        buys: [
          "Human firewall enablement: turns employees from vulnerable targets into active, vigilant security sensors.",
          "Protection of administrative workflows: stops helpdesk credential resets from being weaponized by external adversaries.",
          "Physical perimeter integrity: prevents unauthorized physical intrusion into server rooms and corporate offices.",
          "Cultural security resilience: establishes a corporate environment where questioning unverified authority requests is encouraged."
        ],
        costs: [
          "Operational bureaucracy: enforcing dual-authorization (Four-Eyes Principle) and identity callbacks slows administrative workflows.",
          "Employee friction: security verification steps (identity confirmation, badge challenges) introduce workplace friction.",
          "Continuous testing investment: running effective social engineering assessments and simulated tests requires ongoing budget.",
          "Trust erosion risks: overly aggressive or deceitful internal security simulations can damage employee trust in management."
        ],
        avoid: [
          "Allowing IT helpdesks to reset employee passwords or MFA tokens based solely on a phone call or unverified chat message.",
          "Authorizing large wire transfers or critical infrastructure changes without out-of-band secondary verification.",
          "Leaving public-facing company directories with detailed employee organizational hierarchies and vendor relationships.",
          "Punishing employees who report falling for a social engineering attack, which discourages early incident disclosure."
        ]
      }
    }
  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
