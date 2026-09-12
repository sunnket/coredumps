(function (TD) {
  "use strict";
  TD.depth = (TD.depth || []).concat([
    {
      slug: "secret",
      why: {
        before: "Developers hardcoded production database passwords, encryption keys, and third-party API tokens directly into application source code files and committed them to version control.",
        problem: "Hardcoded credentials leaked to public Git repositories, attackers scanned commits and breached infrastructure within minutes, and rotating compromised keys required rewriting and redeploying software.",
        shift: "Secrets management externalizes all confidential digital credentials into dedicated encrypted vaults (HashiCorp Vault, AWS Secrets Manager), injecting them into runtime memory ephemerally."
      },
      num: {
        t: "Secrets Storage Paradigms, Lifecycle States, and Security Profiles",
        h: ["Storage / Injection Model", "Storage Mechanism", "Encryption at Rest", "Dynamic Rotation Support", "Leakage Vector / Exposure Hazard"],
        r: [
          ["Hardcoded in Source Code", "Raw string inside Git repository", "Zero (Plaintext in version control)", "Impossible without full code redeploy", "Catastrophic; permanent Git history leak"],
          ["Environment Variables (.env)", "Process environment (process.env)", "Varies (Unencrypted in container memory)", "Requires process restart / redeploy", "Leaked via debug dumps, crash logs, or procfs inspect"],
          ["Encrypted Secret Vault (Vault / AWS)", "Centralized hardware security module (HSM)", "AES-256-GCM / Envelope encryption", "Automated rotation via API webhooks", "Network IAM misconfiguration"],
          ["Kubernetes Secret", "Base64 encoded string in etcd", "Requires explicit KMS provider encryption", "Mounted as volume or injected as env", "Base64 is NOT encryption; readable by any cluster pod reader"],
          ["Ephemeral Workload Identity", "Short-lived OIDC federation tokens (SPIFFE)", "Cryptographically signed ephemeral tokens", "Automatic continuous sub-hour rotation", "Minimum blast radius; stolen token expires in minutes"]
        ],
        n: "A secret is a high-entropy confidential value whose unauthorized disclosure completely breaches the authentication and cryptographic boundary of an organization. Information-theoretically, a secret must exhibit high Shannon entropy: $H(X) = -\\sum P(x) \\log_2 P(x) \\ge 128\\text{ bits}$, preventing brute-force reconstruction. Modern secrets management enforces the Principle of Ephemeral Credentials: rather than granting long-lived static database passwords, application containers authenticate via Workload Identity Federation (OIDC/SPIFFE), exchanging machine identity for temporary credentials valid for $\\Delta t \\le 15\\text{ minutes}$. Automated pre-commit scanning tools (TruffleHog, GitGuardian) scan abstract syntax trees and entropy distributions on git commits, blocking secrets before they ever reach remote git remotes."
      },
      miss: [
        {
          w: "Encoding a secret password in Base64 before putting it in a file makes it safe and encrypted.",
          r: "Base64 has zero cryptographic properties and requires no key; it is a public, reversible encoding that any scanner or attacker can decode in half a millisecond."
        },
        {
          w: "Deleting a secret in a new Git commit safely erases it from the repository.",
          r: "Git is an immutable historical graph; deleting a secret in a subsequent commit leaves the secret permanently visible in previous commit snapshots and reflogs until Git history is rewritten with `git-filter-repo`."
        },
        {
          w: "Kubernetes Secrets are encrypted by default out of the box.",
          r: "By default in vanilla Kubernetes, Secrets are stored in plain Base64 text in etcd; true encryption at rest requires explicitly configuring a KMS EncryptionProvider in the API server."
        },
        {
          w: "Storing secrets in environment variables is completely immune to security leaks.",
          r: "Environment variables are visible in `/proc/[PID]/environ`, printed in full by application crash reporters (Sentry), and inherited by child processes; production systems mount secrets as in-memory tmpfs files."
        }
      ],
      trade: {
        buys: [
          "Eliminates hardcoded credentials: zero sensitive passwords or private keys committed to Git repositories.",
          "Automated key rotation: change database passwords periodically without disrupting running microservices.",
          "Fine-grained auditing: track exactly which service or user accessed which secret at what timestamp.",
          "Least privilege containment: limits the blast radius if an individual container is compromised."
        ],
        costs: [
          "Operational complexity: requires deploying and maintaining high-availability secret vaults (Vault, KMS).",
          "Bootstrapping challenge: the 'Secret Zero' problem (how a service proves its identity to fetch its first secret).",
          "Runtime dependency: if the centralized secrets vault is unreachable, applications cannot boot.",
          "Latency overhead: fetching secrets dynamically over the network adds latency to application startup."
        ],
        avoid: [
          "Committing `.env` files or API secrets into private or public version control repositories.",
          "Using Base64 encoding as a substitute for true AES/RSA encryption.",
          "Re-using the exact same production database password across staging and development environments.",
          "Printing the entire `process.env` dictionary in error logging handlers or crash reports."
        ]
      }
    },
    {
      slug: "access-token",
      why: {
        before: "Clients authenticated with backend APIs by sending the user's raw master username and password on every single HTTP request, exposing root credentials to network interception and third-party apps.",
        problem: "Sharing master credentials granted third parties total account control, prevented scoped permissions (read-only vs write), and required users to change their password to revoke a single app's access.",
        shift: "Access tokens provide short-lived, cryptographically verifiable, and permission-scoped authorization bearer tokens that decouple client authentication from primary user passwords."
      },
      num: {
        t: "Access Token Architectures, Verification Models, and Lifecycles",
        h: ["Token Architecture", "Verification Mechanism", "Database Lookup Required?", "Revocation Speed", "Payload Storage Overhead"],
        r: [
          ["Stateless Signed (JWT / PASETO)", "Asymmetric public key signature (RS256 / EdDSA)", "NO (Verified mathematically in userspace)", "Slow (Requires revocation blacklists until expiry)", "Large (~500 - 2,000 bytes in HTTP headers)"],
          ["Opaque / Reference Token", "Cryptographically random CSPRNG string", "YES (Database / Redis lookup per request)", "Instantaneous (Delete token row from Redis)", "Minimal (32 - 64 bytes on the wire)"],
          ["Refresh Token", "Long-lived reference token in secure cookie", "YES (Validated against database on rotation)", "Instantaneous via family revocation", "Compact reference string; rotated on use"],
          ["mTLS Proof-of-Possession", "Token bound to client X.509 TLS certificate", "TLS handshake + token signature check", "Instantaneous via CRL / cert expiry", "Token unusable if stolen without client TLS private key"],
          ["Macaroon / Caveat Token", "Chained HMAC cryptographic caveats", "Evaluated locally via hash chain", "Decentralized contextual attenuation", "Supports dynamic client-side permission attenuation"]
        ],
        n: "In the OAuth 2.0 (RFC 6749) and OpenID Connect (OIDC) frameworks, an Access Token is a credential representing authorization to access specific protected resources. In JSON Web Token (JWT, RFC 7519) implementations, the token comprises three Base64URL-encoded segments separated by dots: $\\text{JWT} = \\text{Header} . \\text{Claims} . \\text{Signature}$. The signature is generated via asymmetric cryptography: $\\text{Signature} = \\text{Sign}_{K_{\\text{priv}}}(\\text{Header} . \\text{Claims})$. The resource server validates the token using the authorization server's public key (retrieved via JWKS): $V(K_{\\text{pub}}, \\text{Data}, \\text{Signature}) \\equiv \\text{True}$, verifying claims without querying a centralized database. To mitigate theft of stateless bearer tokens, access tokens enforce short lifetimes (e.g., $15\\text{ minutes}$), requiring clients to refresh credentials via rotating Refresh Tokens."
      },
      miss: [
        {
          w: "JWT access tokens are encrypted and nobody can read the data stored inside them.",
          r: "Standard JWTs are cryptographically *signed*, not encrypted; the payload is merely Base64-encoded text that anyone can read in plain text; sensitive passwords or secrets must never be placed inside a JWT."
        },
        {
          w: "Setting a 30-day expiration time on access tokens is completely fine for web applications.",
          r: "If a stateless access token is stolen by an attacker, it remains valid until it expires; best practice mandates short-lived access tokens (10-15 minutes) paired with rotating refresh tokens."
        },
        {
          w: "Revoking a JWT access token is as simple as deleting the user's session in the database.",
          r: "Stateless JWTs are validated mathematically without database queries; deleting a database session will not stop an existing JWT from working until its expiration time elapses, unless an active token blacklist is checked."
        },
        {
          w: "Access tokens should be stored in browser `localStorage` for easy JavaScript access.",
          r: "Storing access tokens in `localStorage` exposes them to complete theft via Cross-Site Scripting (XSS); secure web architectures store tokens in `HttpOnly`, `Secure`, `SameSite` cookies."
        }
      ],
      trade: {
        buys: [
          "Decoupled security: users never expose their primary master password to third-party client apps.",
          "Granular scope boundaries: tokens restrict clients to specific least-privilege actions (e.g., `read:profile`).",
          "Massive scalability: stateless JWTs allow thousands of microservices to verify authorization without database hits.",
          "Standardized federation: integrates seamlessly across OAuth 2.0, OpenID Connect, and enterprise IdPs."
        ],
        costs: [
          "Instant revocation difficulty: revoking compromised stateless JWTs requires building complex blacklist state.",
          "Header bloat: large JWTs with dozens of claims add 1-2 KB of overhead to every single HTTP request.",
          "Bearer token liability: anyone who obtains the token can use it (unless bound via mTLS or DPoP).",
          "Cryptographic algorithm vulnerabilities if verification libraries improperly accept `alg: 'none'`."
        ],
        avoid: [
          "Placing sensitive user passwords, Social Security numbers, or private keys inside JWT claims.",
          "Allowing access tokens to remain valid for days or weeks without short expiration intervals.",
          "Accepting the insecure `alg: 'none'` algorithm header during JWT verification.",
          "Storing access tokens in browser `localStorage` where any XSS vulnerability can exfiltrate them."
        ]
      }
    },
    {
      slug: "two-factor-authentication",
      why: {
        before: "Account security relied exclusively on a single factor—a password—which was routinely stolen via phishing attacks, database breaches, keyloggers, or credential stuffing.",
        problem: "Over 80% of corporate data breaches resulted from compromised passwords; once an attacker guessed or purchased a user's password, they gained immediate, unrestricted access to the account.",
        shift: "Two-Factor Authentication (2FA) mandates that authentication verify at least two distinct, independent authentication categories: something you know (password), something you have (security key), or something you are (biometrics)."
      },
      num: {
        t: "Authentication Factors, 2FA Protocols, and Phishing Resistance",
        h: ["2FA Mechanism", "Factor Category", "Underlying Protocol / Standard", "Phishing Resistance Level", "Primary Vulnerability Vector"],
        r: [
          ["FIDO2 / WebAuthn / Passkeys", "Something You Have (Hardware Key/Secure Enclave)", "Public Key Cryptography (W3C WebAuthn)", "100% Phishing Proof (Cryptographically bound to origin domain)", "Loss of physical hardware token without cloud sync"],
          ["TOTP (Authenticator App)", "Something You Have (Software shared secret)", "RFC 6238 Time-Based OTP (HMAC-SHA1)", "Phishable (Attacker relays code through reverse proxy)", "Phishing sites prompting for live 6-digit code"],
          ["SMS / Voice Call", "Something You Have (Cellular SIM card)", "PSTN / Telephony network SMS", "Severely Flawed / Dangerous", "SIM Swapping, SS7 telecom interception, social engineering"],
          ["Push Notification (Authenticator)", "Something You Have (Push token on mobile)", "APNs / FCM push notification", "Moderate to High (Subject to Push Fatigue)", "MFA Fatigue (Spamming user with push prompts at 3 AM)"],
          ["Biometric (TouchID / FaceID)", "Something You Are (Physical biology)", "Local platform biometric authenticator", "High (Local unlock of FIDO2 private key)", "Cannot be changed if biometrically compromised"]
        ],
        n: "Authentication factors partition strictly into three orthogonal categories: Knowledge (something you know), Possession (something you have), and Inherence (something you are). True 2FA requires selecting elements from two distinct categories. The Time-Based One-Time Password (TOTP, RFC 6238) algorithm generates 6-digit codes via HMAC-SHA1 over a shared base32 secret $K$ and the current Unix time step: $T = \\lfloor \\frac{t - t_0}{T_X} \\rfloor$, where $T_X = 30\\text{ seconds}$. The code is calculated via dynamic truncation: $\\text{TOTP} = \\text{Truncate}(\\text{HMAC-SHA1}(K, T)) \\pmod{10^6}$. While TOTP prevents credential reuse from historical breaches, it remains vulnerable to real-time Adversary-in-the-Middle (AitM) reverse proxies (Evilginx). Only FIDO2/WebAuthn provides true phishing resistance by cryptographically binding the public-key signature challenge to the exact browser domain origin."
      },
      miss: [
        {
          w: "Requiring a password and a security question (e.g., mother's maiden name) is Two-Factor Authentication.",
          r: "Both are 'something you know'; combining two passwords is just two Knowledge factors; true 2FA requires two *different* categories (e.g., a password plus a physical hardware token)."
        },
        {
          w: "SMS text message 2FA is the most secure authentication method available.",
          r: "SMS is the least secure 2FA method: it is vulnerable to SIM-swapping attacks, SS7 cellular protocol interception, and phishing; security standards (NIST SP 800-63B) actively deprecate SMS 2FA."
        },
        {
          w: "TOTP 6-digit codes generated by Google Authenticator require internet access to work.",
          r: "TOTP operates completely offline; both your phone and the server compute the identical mathematical formula using the shared secret and the current clock timestamp without any network communication."
        },
        {
          w: "Enabling 2FA makes an account 100% unhackable.",
          r: "Attackers can steal session cookies post-authentication via malware (session hijacking), socially engineer support agents into resetting accounts, or exploit MFA fatigue attacks."
        }
      ],
      trade: {
        buys: [
          "Massive security posture improvement: neutralizes 99% of automated credential-stuffing and password-spraying attacks.",
          "Prevents account takeover even when primary passwords are leaked in external third-party database breaches.",
          "Regulatory compliance: mandatory requirement for PCI-DSS, SOC 2, HIPAA, and ISO 27001 certifications.",
          "FIDO2 / WebAuthn provides mathematically unbreakable defense against modern phishing proxy attacks."
        ],
        costs: [
          "User login friction: requires an extra physical step and device interaction on every login.",
          "Account lockout hazard: users who lose their physical 2FA device require complex identity recovery procedures.",
          "Operational expense for SMS delivery fees or purchasing hardware YubiKeys for corporate employees.",
          "Vulnerability to MFA Fatigue attacks if push-notification approvals lack number matching."
        ],
        avoid: [
          "Using SMS text messaging as the primary 2FA method for high-risk administrator or financial accounts.",
          "Failing to provide single-use backup recovery codes when a user initializes two-factor authentication.",
          "Deploying push notification 2FA without requiring number-matching verification to defeat MFA fatigue.",
          "Permitting customer support agents to bypass 2FA via informal verbal requests without rigorous identity checks."
        ]
      }
    },
    {
      slug: "ssh-key",
      why: {
        before: "System administrators authenticated with remote servers over Telnet or SSH by typing interactive passwords over the network, leaving servers vulnerable to automated brute-force attacks.",
        problem: "Password authentication was vulnerable to dictionary attacks, automated botnet spraying, keyloggers, and human password re-use, and prevented automated CI/CD servers from authenticating securely.",
        shift: "SSH keys leverage asymmetric public-key cryptography (Ed25519 / RSA) to establish mathematically un-phishable, automated, and brute-force-proof authentication between client and server."
      },
      num: {
        t: "SSH Key Cryptographic Algorithms, Key Sizes, and Security Postures",
        h: ["Algorithm", "Key Size / Curve", "Cryptographic Basis", "Security Strength", "Modern Recommendation"],
        r: [
          ["Ed25519 (Modern Standard)", "256 bits", "Edwards-curve Digital Signature (Curve25519)", "Very High (~128-bit security level)", "GOLD STANDARD: Fastest, most compact, collision-proof"],
          ["RSA-4096", "4,096 bits", "Integer Factorization", "High (~128-bit security level)", "Acceptable legacy fallback; large key size and slower compute"],
          ["RSA-2048", "2,048 bits", "Integer Factorization", "Marginal (~112-bit security level)", "Legacy; actively phased out by modern OpenSSH releases"],
          ["ECDSA (NIST P-256)", "256 bits", "NIST Elliptic Curve", "High, but controversial curve design", "Fragile implementation; flawed PRNG leaks private key"],
          ["DSA (Digital Signature)", "1,024 bits", "Discrete Logarithm", "BROKEN / INSECURE", "Completely disabled in modern OpenSSH"]
        ],
        n: "SSH authentication (RFC 4252 §7) utilizes asymmetric public-key cryptography. The keypair consists of a private key $K_{\\text{priv}}$ (stored with strict permissions `chmod 600 ~/.ssh/id_ed25519`) and a public key $K_{\\text{pub}}$ appended to the server's `~/.ssh/authorized_keys`. Authentication occurs via a zero-knowledge challenge-response protocol: the server generates a cryptographically random session challenge $C$, sending it to the client. The client signs the challenge using its private key: $\\sigma = \\text{Sign}_{K_{\\text{priv}}}(C)$. The server verifies the signature using the public key: $V(K_{\\text{pub}}, C, \\sigma) \\equiv \\text{True}$. At no point is the private key ever transmitted across the network, rendering eavesdropping and network interception mathematically impossible."
      },
      miss: [
        {
          w: "The public key and private key must both be uploaded to the server to make SSH work.",
          r: "The private key must *never* leave your local computer; only the public key (`.pub`) is placed on the remote server; sharing your private key compromises all accounts using that key."
        },
        {
          w: "An SSH private key stored on your laptop is completely safe without a passphrase.",
          r: "An unencrypted private key can be copied in seconds by malware or stolen laptops; private keys should always be encrypted with a strong passphrase, managed in memory via `ssh-agent`."
        },
        {
          w: "RSA 2048-bit keys are the best modern choice for generating new SSH keys.",
          r: "Modern cryptography standardizes on Ed25519 (`ssh-keygen -t ed25519`); Ed25519 is faster, vastly more secure against side-channel attacks, and has a compact 68-character key footprint."
        },
        {
          w: "SSH Agent Forwarding (`ssh -A`) is a completely safe way to access remote servers.",
          r: "Agent forwarding allows root administrators on the remote server to hijack your local SSH agent socket and authenticate as you to other servers; use `ProxyJump` (`-J`) instead."
        }
      ],
      trade: {
        buys: [
          "Immunity to brute-force attacks: an Ed25519 key space ($2^{256}$) cannot be guessed or dictionary-sprayed.",
          "Zero-friction automation: enables automated CI/CD deployments, git pushes, and server management without passwords.",
          "Zero-knowledge authentication: private keys are never transmitted over the wire or stored on remote servers.",
          "Enables disabling password authentication entirely on remote SSH daemons (`PasswordAuthentication no`)."
        ],
        costs: [
          "Key management burden: rotating, auditing, and revoking keys across hundreds of servers is complex.",
          "Loss of private key: losing your private key locks you out of the server permanently if no backdoor exists.",
          "Passphrase friction: typing a private key passphrase on every command (mitigated by `ssh-agent`).",
          "Risk of SSH agent socket hijacking when using insecure Agent Forwarding (`ssh -A`)."
        ],
        avoid: [
          "Generating legacy RSA keys with fewer than 3,072 bits (always default to `ssh-keygen -t ed25519`).",
          "Storing unencrypted private keys on shared or portable laptops without passphrases.",
          "Using SSH Agent Forwarding (`ssh -A`) to jump through untrusted intermediate bastion hosts (use `-J`).",
          "Committing private SSH keys (`id_ed25519`) into version control repositories."
        ]
      }
    },
    {
      slug: "certificate",
      why: {
        before: "Early internet systems shared public encryption keys over plain channels, allowing attackers in the middle to intercept the key, substitute their own fake public key, and decrypt all traffic.",
        problem: "Man-in-the-Middle (MITM) attacks were mathematically undetectable: clients could verify that a key worked, but had zero proof of *who* actually owned the key, allowing eavesdropping on bank traffic.",
        shift: "Digital certificates bind an identity to a public key through a cryptographically signed document issued by a trusted Certificate Authority (CA), establishing a verifiable Chain of Trust."
      },
      num: {
        t: "Certificate Architectures, Validation Protocols, and Trust Models",
        h: ["Certificate Model / Standard", "Trust Verification Mechanism", "Identity Binding", "Revocation Check Protocol", "Primary Use Case"],
        r: [
          ["X.509 TLS Server Cert (RFC 5280)", "Hierarchical Chain of Trust (Root CA -> Intermediate -> Leaf)", "Domain Name (Subject Alternative Name - SAN)", "OCSP Stapling / CRL (Certificate Revocation List)", "HTTPS web servers, public web browsing"],
          ["Client Certificate (mTLS)", "Mutual TLS; server verifies client certificate against internal CA", "Machine / Client Identity (UUID, Service Name)", "Internal CA CRL / Short-lived cert lifetimes", "Zero-trust service-to-service microservice mesh"],
          ["Code Signing Certificate", "Cryptographic signature over binary executable ELF/PE/Mach-O", "Software Publisher / Organization Legal Name", "Timestamp authority + online revocation", "Operating system installer validation (Windows SmartScreen)"],
          ["SSH Certificate (OpenSSH CA)", "Custom OpenSSH CA signature over SSH public key", "SSH Principals / Usernames + valid time window", "Certificate Revocation Lists (KRL)", "Enterprise zero-trust SSH access without authorized_keys sprawl"],
          ["Self-Signed Certificate", "Self-signed root; lacks intermediate verification", "Arbitrary unverified identity", "Manual pinning required", "Local development testing only (Triggers browser warnings)"]
        ],
        n: "An X.509 digital certificate (RFC 5280) establishes cryptographic non-repudiation by binding an identity (Subject) to a public key $K_{\\text{pub}}$ via a digital signature authored by a Certificate Authority (CA): $\\text{Cert} = \\text{Data} \\cup \\text{Sign}_{K_{\\text{CA}}}(\\text{Data})$, where $\\text{Data}$ includes Subject Alternative Names (SAN), validity dates, and key usage extensions. Trust is verified via a directed tree traversal (Chain of Trust) terminating at an authoritative Trust Anchor (Root CA) pre-installed in the operating system's root certificate store. During handshake validation, the client verifies the signature of each link: $V(K_{\\text{parent}}, \\text{Data}_{\\text{child}}, \\text{Signature}_{\\text{child}}) \\equiv \\text{True}$. Modern issuance is fully automated via the ACME protocol (RFC 8555), shifting certificate lifespans from years to 90 days."
      },
      miss: [
        {
          w: "A digital certificate encrypts the data traveling across the network.",
          r: "A certificate does not encrypt data; it proves identity and shares the public key; encryption is handled dynamically by symmetric session keys (AES-GCM) negotiated during the TLS handshake."
        },
        {
          w: "A self-signed certificate provides weaker mathematical encryption than an expensive commercial certificate.",
          r: "All certificates provide the exact same mathematical encryption strength; the difference is trust: a self-signed certificate triggers terrifying security warnings because no trusted CA validated the identity."
        },
        {
          w: "Revoking an expired or compromised certificate happens instantly worldwide.",
          r: "Certificate revocation is notoriously fragile: Certificate Revocation Lists (CRLs) can be slow to download, and OCSP checks can fail open unless modern OCSP Stapling is enforced."
        },
        {
          w: "Installing an internal root CA certificate on an employee's computer has zero security risks.",
          r: "Whoever holds the private key to a trusted Root CA can forge valid certificates for *any domain in the world* (Google, banking sites) and inspect all decrypted HTTPS traffic invisibly."
        }
      ],
      trade: {
        buys: [
          "Authenticity and identity verification: mathematically proves you are communicating with the real domain.",
          "Total protection against Man-in-the-Middle (MITM) attacks and public network eavesdropping.",
          "Enables automated Mutual TLS (mTLS) zero-trust microservice communication.",
          "Code signing certificates guarantee software binaries have not been tampered with by malware."
        ],
        costs: [
          "Outage hazard: expired certificates cause catastrophic, immediate downtime for applications and APIs.",
          "Operational complexity of managing certificate renewal automation (Certbot, cert-manager) in clusters.",
          "Initial TLS handshake latency overhead for certificate chain exchange and verification.",
          "PKI infrastructure complexity: maintaining secure offline Root CAs and active Intermediate CAs."
        ],
        avoid: [
          "Allowing production SSL/TLS certificates to expire without automated renewal alerts.",
          "Committing certificate private keys (`privkey.pem`) into version control repositories.",
          "Using self-signed certificates in production environments where customer trust is required.",
          "Trusting private enterprise Root CAs on personal non-work devices."
        ]
      }
    },
    {
      slug: "password-hashing",
      why: {
        before: "Websites stored user passwords in plaintext or used fast cryptographic hash functions like MD5 or SHA-256, assuming hashes were safe from discovery.",
        problem: "When databases leaked, attackers used modern GPUs to compute billions of SHA-256 hashes per second, cracking millions of passwords in minutes using precomputed Rainbow Tables.",
        shift: "Password hashing mandates slow, salted, memory-hard mathematical functions (Argon2id, bcrypt) that intentionally consume heavy CPU and RAM to mathematically neutralize GPU and ASIC brute-force attacks."
      },
      num: {
        t: "Password Hashing Algorithms, Memory Hardness, and Cracking Resistance",
        h: ["Algorithm", "Design Objective", "Memory-Hardness", "GPU / ASIC Resistance", "Standard Recommendation"],
        r: [
          ["Argon2id (Winner of PHC)", "Modern state-of-the-art password hashing", "Extremely High (Configurable RAM, e.g., 64 MB)", "Optimal (Defeats both GPU memory bandwidth and cache attacks)", "GOLD STANDARD (NIST / OWASP recommended)"],
          ["bcrypt", "Eksblowfish-based slow hashing", "Low (4 KB internal state)", "High against GPUs; moderate against dedicated ASICs", "Highly recommended; universal industry battle-tested standard"],
          ["scrypt", "Sequential memory-hard algorithm", "Configurable High RAM", "High (Forces attacker to allocate heavy memory per core)", "Strong modern alternative to Argon2"],
          ["PBKDF2 (HMAC-SHA256)", "NIST legacy iterated HMAC", "Zero (Compute-bound only)", "Very Low (Easily parallelized on modern consumer GPUs)", "Acceptable legacy compliance; inferior to Argon2/bcrypt"],
          ["MD5 / SHA-256 (Anti-Pattern)", "Fast general-purpose cryptographic digest", "Zero", "Completely broken (Consumer GPUs test $>10^{11}$ hashes/sec)", "CATASTROPHIC VULNERABILITY: Never use for passwords"]
        ],
        n: "Password hashing is fundamentally distinct from general-purpose cryptographic hashing. While SHA-256 is designed to be as computationally fast as possible for data integrity, password hashing must be intentionally slow and resource-intensive. The modern gold standard is Argon2id (RFC 9106), which combines data-dependent and data-independent memory addressing to protect against both GPU brute-force and side-channel cache attacks. Argon2id is parameterized by time cost $t$, memory cost $m$ (typically $64\\text{ MB}$), and parallelism $p$: $\\text{Hash} = \\text{Argon2id}(P, S, t, m, p)$. A cryptographically unique, random salt $S \\in \\{0,1\\}^{128}$ is generated per password via CSPRNG, mathematically neutralizing precomputed Rainbow Table attacks and guaranteeing that identical passwords yield distinct hash digests."
      },
      miss: [
        {
          w: "Hashing passwords with SHA-256 with a secret salt is completely secure.",
          r: "SHA-256 is dangerously fast: an off-the-shelf consumer GPU (RTX 4090) computes over 10 billion SHA-256 hashes per second; brute-forcing an 8-character password takes hours; passwords require Argon2id or bcrypt."
        },
        {
          w: "The salt must be kept completely secret like a private encryption key.",
          r: "The salt is not a secret; it is stored publicly in plain text right next to the hash digest in the database; its purpose is uniqueness: defeating rainbow tables and preventing identical passwords from sharing hashes."
        },
        {
          w: "Encrypting passwords with AES-256 is better than hashing because encryption is stronger.",
          r: "Encryption is reversible: an attacker who compromises the database and steals the encryption key decrypts 100% of user passwords; hashing is irreversible, mathematically ensuring passwords can never be decrypted."
        },
        {
          w: "Setting bcrypt cost factors to 20 makes your site super secure.",
          r: "Each increment of bcrypt cost doubles computation time; cost 20 takes ~30 seconds of CPU per login, allowing a single attacker to crash your web server with simple concurrent login requests (denial-of-service)."
        }
      ],
      trade: {
        buys: [
          "Zero-knowledge security: the server never stores or knows user passwords, only irreversible verification digests.",
          "Breach containment: if the database is leaked, passwords remain mathematically uncrackable for decades.",
          "Adaptive work factor: increase computational difficulty over time as hardware GPU speeds advance.",
          "Salting guarantees that two users with identical passwords produce completely different hash strings."
        ],
        costs: [
          "Deliberate server CPU consumption: verifying slow hashes consumes intentional compute during login.",
          "Denial-of-service vulnerability: attackers can flood login endpoints with bogus passwords to saturate server CPUs.",
          "Irreversibility constraint: impossible to retrieve a forgotten password (requires password reset flows).",
          "Tuning complexity: finding the optimal balance between security work factors and user login latency."
        ],
        avoid: [
          "Using fast hash functions (MD5, SHA-1, SHA-256, SHA-512) for password storage.",
          "Hardcoding a single static global salt instead of generating a unique CSPRNG salt per password.",
          "Storing passwords using reversible two-way encryption algorithms (AES).",
          "Setting work cost factors so high that legitimate user logins take longer than 500 milliseconds."
        ]
      }
    }
  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
