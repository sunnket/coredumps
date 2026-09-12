/* Real-world examples and step-by-step flows — Security. */
TD.attach("security", {

"Encryption": {
 ex: { h: "A locked box, not a hidden one",
       b: "Hiding a letter under a mattress is obscurity; putting it in a safe is encryption. Anyone may see the safe and its design — the security rests entirely on the key. That is Kerckhoffs's principle, and it is why *we wrote our own algorithm* is a red flag, not a selling point." },
 fl: { t: "Protecting data at each stage",
       s: ["Data moves or rests somewhere",
           { q: "Is it crossing a network?",
             y: "Encrypt in transit — TLS, on every hop, including internal ones",
             n: "Encrypt at rest — disk or database-level encryption" },
           { s: "Neither protects data while in use", n: "A compromised application sees plaintext regardless." },
           "Use vetted libraries and standard algorithms — never implement a cipher"] }
},

"Symmetric Encryption": {
 ex: { h: "One key that both locks and unlocks",
       b: "Fast enough to encrypt a video stream in real time, which is exactly why TLS uses it for the actual data. The whole problem is getting the key to the other party without anyone intercepting it — which is the problem asymmetric encryption exists to solve." },
 fl: { t: "Where the key comes from",
       s: ["Both parties need the same secret key",
           { q: "How do they agree on it over a public network?",
             y: "Asymmetric key exchange — Diffie-Hellman, at the start of the session",
             n: "That is the entire key distribution problem" },
           { s: "Then AES-GCM encrypts the actual data", n: "Fast, and authenticated — tampering is detected." },
           "Never reuse a nonce with the same key — it breaks the encryption completely"] }
},

"Asymmetric Encryption": {
 ex: { h: "A postbox anyone can post into and only you can open",
       b: "The slot is public and the key to the door is not. That asymmetry solves key distribution — you can publish your public key on a billboard — at the cost of being far slower, which is why it is used to establish a session and then hand over to symmetric encryption." },
 fl: { t: "How a TLS session starts",
       s: ["The server publishes its public key in a certificate",
           { s: "The client verifies the certificate chain", n: "Proving the key belongs to that domain." },
           { s: "They perform an asymmetric key exchange", n: "Producing a shared symmetric key nobody watching can derive." },
           { q: "What encrypts the actual traffic?",
             y: "The symmetric key — thousands of times faster",
             n: "Asymmetric is used only for the handshake and for signatures" }] }
},

"Hashing": {
 ex: { h: "A mincer, not a safe",
       b: "You cannot un-mince a burger. A hash is a one-way fingerprint — same input, same output, and no way back. Which is why passwords are hashed rather than encrypted: even you should not be able to recover them." },
 fl: { t: "Storing a password correctly",
       s: ["A user sets a password",
           { q: "Which algorithm?",
             y: "bcrypt, scrypt or argon2 — deliberately slow, with a tunable cost",
             n: "SHA-256 is far too fast — billions of guesses per second on a GPU" },
           { s: "A unique random salt per user is included", n: "So identical passwords produce different hashes." },
           { s: "On login, hash the attempt and compare", n: "You never store or recover the original." },
           "Raise the cost factor as hardware improves"] }
},

"Salt": {
 ex: { h: "Adding a different spice to every dish",
       b: "Two users with the password `letmein` would otherwise produce identical hashes — visible in a leaked table, and crackable once for both. A unique random salt per user means an attacker must attack every account separately, and precomputed rainbow tables become useless." },
 fl: { t: "What it defends against",
       s: ["Two users choose the same password",
           { q: "No salt?",
             y: "Identical hashes — the breach reveals which accounts share a password",
             n: "A unique salt per user makes every hash different" },
           { s: "The salt is stored alongside the hash", n: "It is not a secret — it is a uniquifier." },
           { s: "Rainbow tables become worthless", n: "You cannot precompute for every possible salt." },
           "Modern password hashes embed the salt in the output string"] }
},

"Digital Signature": {
 ex: { h: "A wax seal that also proves the letter is unaltered",
       b: "Signing with a private key produces something anyone can verify with the public key — proving both who sent it and that nothing changed in transit. It is the mechanism behind TLS certificates, signed software releases and JWTs." },
 fl: { t: "Signing and verifying",
       s: ["The sender hashes the message",
           { s: "The hash is encrypted with their private key", n: "That result is the signature." },
           { s: "The recipient decrypts it with the public key", n: "Recovering the original hash." },
           { q: "Does it match a fresh hash of the message?",
             y: "Authentic and unmodified",
             n: "It was altered, or not signed by that key" },
           "Signing proves origin and integrity — it does not hide the content"] }
},

"Public Key Infrastructure": {
 ex: { h: "The passport system, for machines",
       b: "You trust a passport because you trust the issuing government, and your browser trusts a certificate because it trusts the authority that signed it. PKI is that chain of delegated trust, plus the machinery for revoking it when something goes wrong." },
 fl: { t: "The chain of trust",
       s: ["Your browser ships with a list of trusted root authorities",
           { s: "A root signs an intermediate; the intermediate signs a site certificate", n: "A chain." },
           { q: "Does the chain lead to a trusted root?",
             y: "The certificate is trusted, if the name matches and it is in date",
             n: "A full-page warning" },
           { s: "Revocation is the weak part", n: "CRL and OCSP both have gaps; short-lived certificates are the practical answer." },
           "Certificate Transparency logs make misissuance publicly detectable"] }
},

"Certificate Authority": {
 ex: { h: "The passport office",
       b: "Everything rests on it verifying identity properly, because a certificate for your bank issued to someone else defeats the whole system. Let's Encrypt made basic domain-validated certificates free and automatic, which is why HTTPS went from a minority to near-universal." },
 fl: { t: "Getting a certificate issued",
       s: ["You request a certificate for your domain",
           { q: "How does the CA verify you control it?",
             y: "Domain validation — an HTTP or DNS challenge, automated by ACME",
             n: "OV and EV involve verifying the organisation, which is manual" },
           { s: "The CA signs your certificate with its intermediate key", n: "Valid for 90 days with Let's Encrypt." },
           { s: "Issuance is logged publicly", n: "Certificate Transparency lets you detect a certificate you did not request." },
           "Automate renewal and alert on expiry — that is the failure that still happens"] }
},

"TLS": {
 ex: { h: "The padlock, and what is behind it",
       b: "It does three things at once: proves the server is who it claims, encrypts everything, and detects tampering. TLS 1.3 stripped out the legacy options that caused most historic vulnerabilities and made the handshake a round trip faster." },
 fl: { t: "A TLS 1.3 handshake",
       s: ["Client sends supported ciphers and a key share",
           { s: "Server responds with its certificate and its key share", n: "One round trip, not two." },
           { q: "Does the certificate verify?",
             y: "Both sides derive the same symmetric key and switch to encrypted traffic",
             n: "The connection is aborted" },
           { s: "Forward secrecy is mandatory in 1.3", n: "Stealing the server key later does not decrypt past sessions." },
           "Disable TLS 1.0 and 1.1 — they are deprecated and exploitable"] }
},

"End-to-End Encryption": {
 ex: { h: "A letter the postman genuinely cannot read",
       b: "The difference from ordinary transport encryption is who holds the keys: with E2EE, the server relays ciphertext it cannot open. That is why a provider can honestly say they cannot hand over message contents — and why losing your key means the messages are gone." },
 fl: { t: "Why the server cannot read it",
       s: ["Keys are generated on the devices",
           { s: "Only the recipient's public key is shared", n: "The private key never leaves the device." },
           { q: "What does the server see?",
             y: "Ciphertext, plus metadata — who talked to whom, and when",
             n: "Metadata is often as sensitive as content, and is rarely protected" },
           { s: "Key verification defends against a substituted key", n: "Safety numbers, QR codes." },
           "Backups are the usual hole — an unencrypted cloud backup undoes it entirely"] }
},

"Key Management": {
 ex: { h: "The keys are the whole problem",
       b: "Encryption is largely solved; keeping keys secret, rotating them, and recovering when one is lost is where systems actually fail. A key hard-coded in a repository provides exactly as much protection as no encryption at all." },
 fl: { t: "A key's lifecycle",
       s: ["Generate it with a cryptographic random source",
           { s: "Store it in a KMS or a vault — never in code or config files", n: "And never in an environment variable that gets logged." },
           { s: "Grant access narrowly and audit every use", n: "Which service, which key, when." },
           { q: "Time to rotate?",
             y: "Support two keys at once so rotation is not an outage",
             n: "Plan for compromise: how quickly can you revoke and re-encrypt?" },
           "Envelope encryption — a data key encrypted by a master key — makes rotation cheap"] }
},

"Secrets Management": {
 ex: { h: "A key safe, not a sticky note",
       b: "Database passwords, API keys and signing keys need to reach the application without ever being committed, logged or visible in a process listing. A secrets manager provides them at runtime, records who read what, and lets you rotate without a deploy." },
 fl: { t: "How a secret reaches the application",
       s: ["The application starts and authenticates to the secret store",
           { s: "Using a workload identity, not another secret", n: "Otherwise you have only moved the problem." },
           { s: "It fetches what it needs, into memory only", n: "Not to disk, not to a log." },
           { q: "A secret leaks?",
             y: "Rotate immediately — the audit log tells you what was accessed and when",
             n: "Short-lived dynamic credentials limit the window automatically" },
           "Scan the repository history — deleting the line does not remove it"] }
},

"Hardware Security Module": {
 ex: { h: "A safe that performs the signing for you",
       b: "The key never leaves the device. You send data in and get a signature out, and even a fully compromised server cannot extract the key material. Tamper-resistant, certified, expensive — and required for payment processing and certificate authorities." },
 fl: { t: "Why the key cannot be stolen",
       s: ["A key is generated inside the HSM",
           { q: "Can it be exported?",
             y: "No — that is the entire design",
             n: "You send data to be signed or decrypted, and receive the result" },
           { s: "Physical tampering destroys the key", n: "Certified to FIPS 140-2 or 140-3." },
           "Cloud KMS gives most of the benefit without buying hardware"] }
},

"SQL Injection": {
 ex: { h: "A form field that becomes part of the instruction",
       b: "Enter `'; DROP TABLE users; --` as a username and, if the query was built by pasting strings together, the database receives two statements. It is decades old, entirely preventable with one technique, and still in the OWASP top ten." },
 fl: { t: "Why parameterised queries fix it",
       s: ["User input must reach a SQL query",
           { q: "Is the query built by string concatenation?",
             y: "The input becomes part of the statement — injection is possible",
             n: "Parameterised: the query is parsed first, then values are bound" },
           { s: "The database never confuses a value for syntax", n: "That separation is the fix, not escaping." },
           { s: "Table and column names cannot be parameters", n: "Validate those against an allow-list." },
           "Least privilege limits the damage: the app account should not be able to DROP"] }
},

"Cross-Site Scripting": {
 ex: { h: "Graffiti on your page that runs as your code",
       b: "An attacker gets JavaScript onto your site and it executes with your site's privileges — reading cookies, making authenticated requests, rewriting the page. The comment box that renders HTML is the classic route in." },
 fl: { t: "The three variants and the defence",
       s: ["Attacker-controlled text reaches the page",
           { q: "Is it stored in your database and shown to others?",
             y: "Stored XSS — the worst kind, it hits every visitor",
             n: "Reflected (from the URL) or DOM-based (client-side sinks)" },
           { s: "Escape on output, contextually", n: "HTML, attribute, URL and JavaScript contexts all escape differently." },
           { s: "Avoid `innerHTML` and `dangerouslySetInnerHTML`", n: "Use `textContent`, or sanitise with DOMPurify." },
           "A Content Security Policy blocks the injected script even if one slips through"] }
},

"Cross-Site Request Forgery": {
 ex: { h: "A form on a hostile site submitting to your bank",
       b: "You are logged in; the browser attaches your cookie automatically to any request to that domain, including one triggered from somewhere else. The attacker cannot read the response — they do not need to, if the request transferred money." },
 fl: { t: "How the defences work",
       s: ["A state-changing request arrives with a valid session cookie",
           { q: "Does it carry a CSRF token the attacker could not know?",
             y: "It came from your own page — accept it",
             n: "Reject: the cookie alone proves nothing about origin" },
           { s: "`SameSite=Lax` on cookies blocks most cross-site sends", n: "The single most effective modern mitigation." },
           { s: "Never make a GET request change state", n: "An image tag can trigger one." },
           "Check Origin and Referer as a secondary defence"] }
},

"Server-Side Request Forgery": {
 ex: { h: "Persuading the server to fetch something for you",
       b: "You give a URL to a *fetch this image* feature and point it at the cloud metadata endpoint, which is reachable from inside the network and not from outside. The server fetches it and hands you the credentials. This was the Capital One breach." },
 fl: { t: "Handling a user-supplied URL",
       s: ["The application must fetch a URL provided by a user",
           { q: "Is the destination on an allow-list?",
             y: "Fetch it — and re-check after any redirect",
             n: "Deny-lists fail: DNS rebinding and decimal-encoded IPs bypass them" },
           { s: "Block private ranges and the metadata IP explicitly", n: "169.254.169.254 is the classic target." },
           { s: "Use IMDSv2, which requires a token", n: "It makes the naive attack fail." },
           "Fetch from an isolated network segment with no internal access"] }
},

"Command Injection": {
 ex: { h: "A filename that is also a shell command",
       b: "Passing user input into a shell command means a semicolon turns one command into two. It is the same failure as SQL injection in a different context, and the fix is the same shape: never let data cross into the instruction." },
 fl: { t: "Avoiding the shell entirely",
       s: ["You need to run an external program with user input",
           { q: "Are you building a command string?",
             y: "`;`, `|`, `$()` and backticks all let the input become a new command",
             n: "Pass an argument array — no shell is involved at all" },
           { s: "`subprocess.run([...], shell=False)`", n: "The arguments are handed to the program directly." },
           { s: "Validate against an allow-list where you can", n: "And drop privileges before running." },
           "Escaping shell metacharacters correctly is far harder than avoiding the shell"] }
},

"Path Traversal": {
 ex: { h: "A filename of `../../../../etc/passwd`",
       b: "The application meant to serve files from one folder, and the dots walk out of it. Every URL-decoding layer and every operating system quirk is another chance for a filter to miss a variant — which is why validating after resolution is the only reliable approach." },
 fl: { t: "Serving a user-named file safely",
       s: ["A user supplies a filename",
           { s: "Resolve it to a canonical absolute path", n: "After every decode, and after following symlinks." },
           { q: "Does the resolved path start with your allowed directory?",
             y: "Serve it",
             n: "Reject — do not attempt to strip `../` and retry" },
           { s: "Better still, do not use user input as a path at all", n: "Map an id to a filename you control." },
           "Encoded variants like `%2e%2e%2f` defeat naive string filters"] }
},

"Insecure Direct Object Reference": {
 ex: { h: "Changing the number in the URL",
       b: "`/invoices/1042` works, so you try 1041 and see somebody else's invoice. The application checked you were logged in and never checked the record belonged to you. It is the most common serious web vulnerability and one of the easiest to test for." },
 fl: { t: "Authorising the object, not just the user",
       s: ["A request asks for a specific record by id",
           { q: "Does the code check ownership?",
             y: "`WHERE id = ? AND user_id = ?` — scoped at the query",
             n: "Authentication alone is not authorisation" },
           { s: "Scope every query by the current user", n: "So a missing check cannot leak anything." },
           { s: "Unguessable ids are not a fix", n: "They are defence in depth, not a control." },
           "Test it: log in as one user and request another's resources"] }
},

"Buffer Overflow": {
 ex: { h: "Pouring a pint into a half-pint glass",
       b: "The excess goes somewhere — over adjacent memory, potentially over the return address, and the program then jumps wherever the attacker wrote. It is the classic memory-safety bug and the reason memory-safe languages are now recommended for new code." },
 fl: { t: "From overflow to code execution",
       s: ["Input longer than the buffer is copied into it",
           { s: "The write continues past the end", n: "`strcpy` with no length check." },
           { q: "What is adjacent in memory?",
             y: "The saved return address — overwrite it and control where execution goes",
             n: "Corrupting other variables is bad; corrupting control flow is worse" },
           { s: "ASLR, stack canaries and NX pages raise the bar", n: "They do not eliminate the class." },
           "Bounds-checked languages make it impossible rather than merely harder"] }
},

"Deserialisation Attack": {
 ex: { h: "Rebuilding a machine from a stranger's blueprint",
       b: "Formats like Python's pickle and Java's serialization can reconstruct arbitrary objects — and reconstructing an object can run code. So deserialising untrusted input is not parsing data, it is executing whatever the sender chose." },
 fl: { t: "Why pickle is not a data format",
       s: ["Untrusted bytes arrive and must be turned into an object",
           { q: "Which format?",
             y: "JSON — data only, no code execution possible",
             n: "pickle, YAML `load`, Java serialization — all can execute code" },
           { s: "The attack does not need a bug in your code", n: "It is the documented behaviour of the format." },
           { s: "If you must, sign the payload and verify first", n: "And still prefer a data-only format." },
           "`yaml.safe_load`, not `yaml.load`"] }
},

"OWASP Top 10": {
 ex: { h: "The ten ways applications actually get broken",
       b: "Compiled from real incident data rather than theory, and refreshed every few years. Broken access control has been at the top because it remains the most common and most damaging — and it is a category most teams assume they have handled." },
 fl: { t: "Using it as a review checklist",
       s: ["Reviewing an application before release",
           { s: "Start with broken access control", n: "Can a user reach another user's data by changing an id?" },
           { s: "Then injection, and cryptographic failures", n: "Parameterised queries; TLS everywhere; passwords hashed properly." },
           { q: "Are dependencies current?",
             y: "Vulnerable components are a category in their own right",
             n: "Run an audit in CI and act on it" },
           "Also check logging: can you tell whether you have been attacked?"] }
},

"Zero Trust": {
 ex: { h: "Checking ID at every door, not just the front gate",
       b: "The old model was a hard perimeter and a trusted interior — which fails completely once an attacker is inside, or once half the staff work from home. Zero trust assumes the network is already hostile and verifies every request on its own merits." },
 fl: { t: "What changes in practice",
       s: ["A request arrives at an internal service",
           { q: "Is it trusted because it came from inside the network?",
             y: "That is the old model — one compromised host reaches everything",
             n: "Verify identity and authorisation per request, regardless of origin" },
           { s: "Mutual TLS between services", n: "Both sides prove who they are." },
           { s: "Device posture and continuous verification", n: "Not one check at login." },
           "Micro-segmentation limits how far an attacker can move once inside"] }
},

"Principle of Least Privilege": {
 ex: { h: "A cleaner's key that opens the offices, not the safe",
       b: "Every extra permission is extra blast radius when an account is compromised — and accounts are compromised. The discipline is granting the minimum, and then actually removing what turns out to be unused." },
 fl: { t: "Applying it to a service account",
       s: ["A service needs access to a resource",
           { q: "What is the minimum it genuinely needs?",
             y: "Grant exactly that — read on two tables, not admin on the database",
             n: "Convenience now is blast radius later" },
           { s: "Prefer short-lived, scoped credentials", n: "Rather than a permanent key with broad rights." },
           { s: "Review what is actually used and revoke the rest", n: "Cloud providers report unused permissions." },
           "It is the single highest-leverage control after MFA"] }
},

"Role-Based Access Control": {
 ex: { h: "Permissions by job title, not by person",
       b: "Grant to *nurse* rather than to each nurse. When someone changes role, one assignment changes and every permission follows. It scales — until you have three hundred roles because everyone needed one exception, which is where attribute-based control starts to look attractive." },
 fl: { t: "Designing roles that stay manageable",
       s: ["Group permissions into roles matching real job functions",
           { s: "Assign users to roles, never permissions to users", n: "Otherwise there is no way to audit anything." },
           { q: "Someone needs one extra permission?",
             y: "Resist creating a bespoke role — review whether the role definition is wrong",
             n: "Role explosion is the standard failure mode" },
           { s: "Review assignments periodically", n: "Permissions accumulate as people move around; they rarely get removed." },
           "ABAC decides from attributes instead — more flexible, harder to reason about"] }
},

"Defence in Depth": {
 ex: { h: "A moat, a wall and a locked door",
       b: "Not because you expect the moat to fail, but because you expect that eventually something will. Every control you add assumes the one in front of it has already been bypassed — which is why a WAF, input validation and parameterised queries all coexist." },
 fl: { t: "Layering controls",
       s: ["Assume any single control will eventually fail",
           { s: "Network: firewalls and segmentation", n: "Limits reach." },
           { s: "Application: validation, authentication, authorisation", n: "Limits what a request can do." },
           { s: "Data: encryption, least privilege, masking", n: "Limits what a breach yields." },
           { q: "Something is bypassed?",
             y: "The next layer still stands, and monitoring should see it",
             n: "Detection is a layer too — assume compromise and watch for it" }] }
},

"Multi-Factor Authentication": {
 ex: { h: "A key and a fingerprint",
       b: "Something you know plus something you have. It stops credential stuffing dead, because a leaked password alone is no longer enough. SMS codes are the weakest form — SIM swapping is a real and routine attack — and an authenticator app or a hardware key is materially better." },
 fl: { t: "Choosing a second factor",
       s: ["A password alone is not sufficient",
           { q: "Which factor?",
             y: "Hardware key or passkey — phishing-resistant, because the origin is checked",
             n: "TOTP app is good; SMS is weak but far better than nothing" },
           { s: "SMS is vulnerable to SIM swapping", n: "And to interception." },
           { s: "Provide recovery codes", n: "Or you will lock users out permanently." },
           "Passkeys remove the password entirely and cannot be phished"] }
},

"Brute Force Attack": {
 ex: { h: "Trying every combination on the padlock",
       b: "Guaranteed to work eventually; the only question is how long. Defence is not making guesses impossible but making them slow and noisy — rate limiting, lockouts, and a slow password hash so each guess costs the attacker real time." },
 fl: { t: "Slowing it to uselessness",
       s: ["An attacker attempts many passwords",
           { s: "Rate limit per account and per IP", n: "With exponential backoff." },
           { q: "Are you using a fast hash like SHA-256?",
             y: "A GPU tries billions per second offline — switch to bcrypt or argon2",
             n: "Each guess now costs real time even with a leaked hash" },
           { s: "Alert on the pattern", n: "Many failures across many accounts is credential stuffing." },
           "MFA makes a correct password insufficient anyway"] }
},

"Credential Stuffing": {
 ex: { h: "Trying the stolen key on every door in the street",
       b: "Not guessing — reusing. Billions of real username and password pairs from past breaches are tried against every other service, and the reuse rate means a meaningful fraction succeed. Nothing about your password policy prevents it." },
 fl: { t: "Defending against reused passwords",
       s: ["Attackers replay known-valid credentials",
           { q: "Would a correct password be enough to get in?",
             y: "Then this attack works — MFA is the answer",
             n: "Check new passwords against known-breached lists at signup" },
           { s: "Watch for the signature", n: "Low failure rate, high volume, many accounts, distributed IPs." },
           { s: "Device fingerprinting and impossible-travel checks", n: "Step up authentication on anomalies." },
           "Have I Been Pwned's k-anonymity API lets you check without sending the password"] }
},

"Phishing": {
 ex: { h: "A convincing letter on stolen letterhead",
       b: "It targets the person, not the software, which is why no amount of patching prevents it. The message is increasingly well written — AI removed the spelling mistakes that used to be the giveaway — so training people to spot it is no longer sufficient on its own." },
 fl: { t: "Making the attack fail even when it works",
       s: ["A user receives a convincing message and clicks",
           { q: "Do they enter credentials on a lookalike site?",
             y: "With a password and TOTP, the attacker relays them in real time and gets in",
             n: "With a passkey or hardware key, the origin does not match and it simply fails" },
           { s: "That origin check is why FIDO2 is phishing-resistant", n: "The credential is bound to the real domain." },
           { s: "SPF, DKIM and DMARC stop spoofing of your domain", n: "So attackers must use lookalikes." },
           "Make reporting easy and blameless, or people hide their mistakes"] }
},

"Social Engineering": {
 ex: { h: "Talking your way past reception",
       b: "A confident person in a high-vis jacket saying they are here for the lift inspection gets further than most exploits. It targets helpfulness, urgency and authority — and the technical controls that matter are the ones that work even when a person is fooled." },
 fl: { t: "Why process beats vigilance",
       s: ["Someone is pressured into an exception",
           { q: "Does the process allow a single person to authorise it?",
             y: "That is the vulnerability — urgency plus authority defeats judgement",
             n: "Require a second approver, out-of-band, for high-risk actions" },
           { s: "Verify through a known channel, never one they supplied", n: "Call back on the number in your directory." },
           { s: "Give people permission to say no", n: "Blame-free reporting is what surfaces attempts." },
           "Help desk password resets are a classic target — verify identity properly"] }
},

"Malware": {
 ex: { h: "Software written to work against you",
       b: "Viruses, worms, trojans, spyware, ransomware — the category is defined by intent rather than technique. Modern delivery is increasingly through legitimate channels: a compromised package, a malicious browser extension, a signed installer from a breached vendor." },
 fl: { t: "How it usually arrives now",
       s: ["Something executes that should not have",
           { q: "How did it get in?",
             y: "Phishing attachment, or a compromised dependency in your build",
             n: "Drive-by download, or a vulnerable internet-facing service" },
           { s: "Least privilege limits what it can reach", n: "A user account cannot install a kernel driver." },
           { s: "EDR watches behaviour, not signatures", n: "Which is what catches novel variants." },
           "Segmented networks and offline backups limit the damage after the fact"] }
},

"Ransomware": {
 ex: { h: "Changing all the locks and selling you the key",
       b: "Modern operators exfiltrate the data first, then encrypt — so paying for decryption does not prevent publication. Which is why the only real defence is backups you have tested restoring, kept offline, and segmentation that stops it spreading." },
 fl: { t: "Surviving an attack rather than paying for it",
       s: [{ s: "Attackers get in — usually through a stolen password or an email attachment — and then wait", n: "Typically weeks. The encryption at the end is the last step, not the first." },
           { s: "During that time they quietly explore, looking for the systems that matter and the accounts that unlock them", n: "This is the window in which you could still catch them, and it is why unusual internal activity is worth alerting on." },
           { s: "Before locking anything, they copy your data out", n: "So paying for the key does not stop them publishing it. Modern attacks demand payment twice, for the key and for their silence." },
           { q: "Can you restore from backups without them?",
             y: "Then you have the only real defence there is. But this requires backups that were disconnected, or that genuinely cannot be altered once written",
             n: "Backups reachable over the network are found and encrypted along with everything else, which is the single most common reason organisations end up paying" },
           { s: "Test a restore before you need one", n: "A backup nobody has ever restored from is a hope, not a plan." },
           { s: "And divide the network so one compromised machine cannot reach everything", n: "The damage is bounded by how far the attacker can travel." }] }
},

"Denial of Service": {
 ex: { h: "Blocking the door with a crowd",
       b: "No data is stolen and nobody can get in. Volumetric attacks flood the pipe; application-layer attacks find the one expensive endpoint and hit it. The second kind needs far less traffic and is much harder to filter." },
 fl: { t: "Absorbing an attack",
       s: ["Traffic overwhelms a resource",
           { q: "Is it volumetric or application-layer?",
             y: "Volumetric — a scrubbing service or CDN absorbs it upstream",
             n: "Application-layer — one expensive endpoint. Rate limit and cache it" },
           { s: "Rate limit by API key and by user, not IP alone", n: "Distributed attacks come from everywhere." },
           { s: "Autoscaling turns an outage into a bill", n: "Cap it deliberately." },
           "Have the provider's DDoS runbook ready before you need it"] }
},

"Man-in-the-Middle Attack": {
 ex: { h: "A relay standing between the two ends of the call",
       b: "Both parties think they are talking directly. Public wifi is the classic setting. TLS with proper certificate validation prevents it — which is exactly why disabling certificate verification to *make it work* is such a serious thing to do." },
 fl: { t: "What certificate validation actually stops",
       s: ["An attacker intercepts the connection",
           { q: "Does the client validate the certificate chain and hostname?",
             y: "The attacker's certificate fails — no trusted CA signed it for that domain",
             n: "The attacker relays everything, reading and modifying at will" },
           { s: "`verify=False` disables exactly this defence", n: "Never in production, however tempting during debugging." },
           { s: "HSTS stops the downgrade to HTTP", n: "Certificate pinning defends against a compromised CA." },
           "Public wifi without a VPN is the everyday risk"] }
},

"Supply Chain Attack": {
 ex: { h: "Poisoning the ingredients, not the meal",
       b: "Compromise one widely used package and you reach everyone who installs it. SolarWinds, event-stream and xz-utils all show the pattern — and it works because a dependency runs with your full privileges and almost nobody reads its code." },
 fl: { t: "Reducing exposure",
       s: ["Every dependency is code you did not write, running as you",
           { s: "Pin exact versions with a lockfile", n: "So a compromised release is not pulled automatically." },
           { q: "Do install scripts run automatically?",
             y: "Disable them where you can — that is a common execution path",
             n: "Audit new dependencies before adding them" },
           { s: "Generate an SBOM and scan continuously", n: "You need to know what you ship." },
           "Build in an isolated environment with no outbound network beyond your registry"] }
},

"Dependency Confusion": {
 ex: { h: "Publishing a package with your internal name",
       b: "Your build asks for `internal-utils`, which exists only in your private registry. Someone publishes a package with the same name publicly, and if your resolver prefers the public one — or falls back to it — their code runs in your build." },
 fl: { t: "Closing the gap",
       s: ["A build resolves an internal package name",
           { q: "Is the resolver configured to check public registries too?",
             y: "A higher public version can win — that is the attack",
             n: "Scope internal packages under your organisation namespace" },
           { s: "Configure the registry per scope explicitly", n: "Never a blanket fallback to public." },
           { s: "Or publish placeholder packages publicly", n: "Claiming the names before anyone else does." },
           "It affects npm, pip, Maven and NuGet alike"] }
},

"Zero-Day": {
 ex: { h: "A lock flaw the locksmith does not know about",
       b: "No patch exists because the vendor has only just learned of it — sometimes from the attack itself. The name refers to the days available to fix it. It is why defence in depth matters: you cannot patch your way out of something nobody knows about." },
 fl: { t: "Surviving the unknown",
       s: ["A vulnerability is exploited before a patch exists",
           { q: "What can you actually do?",
             y: "Limit blast radius — segmentation, least privilege, and detection",
             n: "There is no patch to apply" },
           { s: "Once disclosed, the race begins", n: "Exploits are often public within hours." },
           { s: "Have an emergency patch path", n: "Measured in hours, not the next release train." },
           "Most breaches use known unpatched flaws, not zero-days — patch discipline matters more"] }
},

"CVE": {
 ex: { h: "A catalogue number for a vulnerability",
       b: "`CVE-2021-44228` is Log4Shell, and everyone means the same thing by it. A shared identifier is what lets scanners, vendors and advisories line up — and CVSS gives it a severity score that is a starting point rather than a verdict." },
 fl: { t: "Triaging one",
       s: ["A scanner reports a CVE in a dependency",
           { q: "Is the vulnerable code path actually reachable in your usage?",
             y: "Prioritise by real exploitability, not by the CVSS number alone",
             n: "Many high-scoring CVEs are unreachable in a given application" },
           { s: "Check whether it is in CISA's exploited catalogue", n: "Known-exploited beats theoretical severity." },
           { s: "Patch, or apply the documented mitigation", n: "And record the decision either way." },
           "Log4Shell was so serious because it was trivially exploitable and everywhere"] }
},

"Vulnerability Scanning": {
 ex: { h: "An automated inspection against a checklist",
       b: "It finds known problems — outdated packages, open ports, missing headers — quickly and cheaply. It does not find logic flaws, and it produces false positives, which is why a scan report is the beginning of the work rather than the end." },
 fl: { t: "Fitting it into the build without everyone ignoring it",
       s: [{ s: "Your code depends on hundreds of libraries, which depend on thousands more", n: "Any of them can have a known security flaw published against it at any time, with no action from you." },
           { s: "A scanner compares everything you use against a public list of known flaws", n: "Automated, fast, and worth running on every single build." },
           { s: "Scan the finished container image too, not just your own dependency list", n: "The base image it is built on contains an operating system that ages, and it is often the oldest thing you ship." },
           { q: "Should a finding stop the build?",
             y: "For severe, genuinely exploitable ones, yes — otherwise the report is read once and never again",
             n: "But blocking on everything is worse than nothing. People learn to bypass the check, and then it protects you from nothing at all" },
           { s: "Most findings will not apply to you", n: "A flaw in a feature you never call is real but not urgent. Triage by whether it is actually reachable in your code." }] }
},

"Penetration Testing": {
 ex: { h: "Hiring someone to break in, with permission",
       b: "A scanner checks a list; a tester chains three minor issues into a full compromise the way a real attacker would. Scope and authorisation in writing are what separate it from a crime, and the report should be read as a prioritised to-do list." },
 fl: { t: "Getting value from an engagement",
       s: ["Agree scope and rules of engagement in writing",
           { q: "How much information do the testers get?",
             y: "White box — faster and deeper, since they read the code",
             n: "Black box — closer to a real attacker's starting position" },
           { s: "Findings come with severity and reproduction steps", n: "Fix them, then retest to confirm." },
           { s: "It is a point-in-time assessment", n: "The next release can reintroduce anything." },
           "Bug bounties provide continuous coverage; pen tests provide depth"] }
},

"Threat Modelling": {
 ex: { h: "Working out who would want in, before building the walls",
       b: "A whiteboard, the system diagram, and the question *what could go wrong here*. Done at design time it costs an afternoon; done after launch it costs a rewrite. STRIDE gives you six prompts so the exercise is not purely improvised." },
 fl: { t: "A session, in four questions",
       s: ["Draw the system: components, data flows, trust boundaries",
           { s: "What could go wrong?", n: "STRIDE: spoofing, tampering, repudiation, information disclosure, denial of service, elevation of privilege." },
           { s: "What are we doing about it?", n: "A control, an accepted risk, or a design change." },
           { q: "Did we do a good enough job?",
             y: "Record the decisions — the reasoning is the durable artefact",
             n: "Revisit when the architecture changes" },
           "Focus on trust boundaries — that is where nearly everything interesting happens"] }
},

"Security Misconfiguration": {
 ex: { h: "A vault with the door left open",
       b: "The default admin password, the public S3 bucket, the debug endpoint left on, the verbose error page showing stack traces. No exploit required — and it accounts for an enormous share of real breaches precisely because it needs no skill to find." },
 fl: { t: "The checks worth automating",
       s: ["A system is deployed",
           { s: "Change every default credential", n: "Scanners find them within minutes of exposure." },
           { q: "Is debug mode or a verbose error page enabled?",
             y: "Turn it off — stack traces are reconnaissance",
             n: "Check storage permissions: is anything public that should not be?" },
           { s: "Close unnecessary ports and remove unused services", n: "Smaller surface, fewer surprises." },
           "Infrastructure as code plus policy scanning makes this repeatable rather than heroic"] }
},

"Audit Log": {
 ex: { h: "A CCTV recording nobody can edit",
       b: "Who did what, when, from where. Without it, an investigation is guesswork and you cannot answer the first question anyone asks after an incident. The key property is that the people it records cannot alter it." },
 fl: { t: "Making a log admissible",
       s: ["A significant action occurs",
           { s: "Record actor, action, target, timestamp and source", n: "In a structured format, not a prose string." },
           { q: "Can the actor delete or edit the entry?",
             y: "It is not an audit log — ship to append-only, separate storage",
             n: "Protect it and monitor access to it" },
           { s: "Never log secrets or full personal data", n: "The log becomes a target of its own." },
           "Retain long enough to be useful — breaches are often found months later"] }
},

"Personally Identifiable Information": {
 ex: { h: "Data that points at a person",
       b: "Not only names and emails — an IP address, a device id and a precise location all qualify, and combinations identify people even when each field alone does not. Which is why *we anonymised it by removing the name* usually has not." },
 fl: { t: "Handling it responsibly",
       s: ["You are about to store personal data",
           { q: "Do you actually need it?",
             y: "Minimise — collect the least that serves the purpose",
             n: "Not collecting it is the strongest possible protection" },
           { s: "Encrypt at rest and in transit; restrict and log access", n: "And define a retention period." },
           { q: "Anonymising for analytics?",
             y: "Removing direct identifiers is rarely enough — quasi-identifiers re-identify",
             n: "Pseudonymisation is reversible and still regulated" },
           "Never send it to third-party services without a legal basis"] }
},

"GDPR": {
 ex: { h: "Rules that treat personal data as the person's, not yours",
       b: "You need a lawful basis to process it, people can demand a copy or its deletion, and a breach must be reported within 72 hours. Fines reach 4% of global turnover, which is why it changed engineering practice rather than just policy documents." },
 fl: { t: "What it requires of a system",
       s: ["You process personal data of EU residents",
           { q: "What is your lawful basis?",
             y: "Consent, contract, legal obligation or legitimate interest — documented",
             n: "Consent must be freely given, specific and as easy to withdraw as to give" },
           { s: "Build for the rights", n: "Access, rectification, erasure and portability all need real implementations." },
           { s: "Privacy by design and by default", n: "Minimisation and purpose limitation, from the start." },
           "Breach notification within 72 hours means the runbook must already exist"] }
},

"Data Masking": {
 ex: { h: "Blanking the card number except the last four",
       b: "Support can confirm which card without ever seeing it. In non-production environments the same idea applies to entire datasets: developers need realistic data, not real people's data, and the difference is a policy decision that has to be enforced technically." },
 fl: { t: "Making a safe test dataset",
       s: ["A copy of production data is needed for development",
           { q: "Are personal fields replaced?",
             y: "Substituted with realistic fakes, consistently, so referential integrity holds",
             n: "You have just copied a breach into a less-protected environment" },
           { s: "Static masking transforms the copy", n: "Dynamic masking redacts at query time based on role." },
           { s: "Beware re-identification", n: "Postcode plus date of birth plus gender identifies most people." },
           "Synthetic data avoids the question entirely, where it is good enough"] }
},

"Data Breach": {
 ex: { h: "The day the filing cabinet is found open",
       b: "The technical work is usually the smaller part. Notification deadlines, regulators, customers, and the question *what exactly was taken* all arrive at once — and that last question is unanswerable without logging you put in place beforehand." },
 fl: { t: "The first hours",
       s: ["A breach is suspected",
           { s: "Contain first — revoke credentials, isolate systems", n: "Preserve evidence; do not wipe and rebuild immediately." },
           { q: "What data was accessed?",
             y: "Your logs answer this — or they do not, and that is the lesson",
             n: "Assume the worst until you can show otherwise" },
           { s: "Notify regulators within the deadline", n: "72 hours under GDPR." },
           { s: "Tell affected people clearly and early", n: "The cover-up is always worse than the breach." },
           "Blameless postmortem afterwards, with concrete actions"] }
},

"Sandboxing": {
 ex: { h: "Handling an unknown package in a sealed room",
       b: "If it turns out to be dangerous, the damage is confined. Browser tabs, mobile apps, container workloads and code-execution services all run this way — and the interesting engineering is in the escape routes people find." },
 fl: { t: "Running untrusted code",
       s: ["Code you do not control must execute",
           { s: "Restrict what it can reach", n: "No network, read-only filesystem, no host devices." },
           { q: "How strong does the boundary need to be?",
             y: "Hostile input — a VM or a microVM like Firecracker",
             n: "Containers share the host kernel — a kernel bug is an escape" },
           { s: "Set resource limits", n: "CPU, memory and time, or a fork bomb takes the host." },
           "seccomp and AppArmor restrict which syscalls are even possible"] }
},

"Static Analysis": {
 ex: { h: "Proofreading without running the program",
       b: "It reads the code and reasons about what could happen, so it finds problems on paths your tests never exercise. It also produces false positives, and a tool that cries wolf gets ignored — tuning it is part of adopting it." },
 fl: { t: "Making it stick",
       s: ["Add a SAST tool to the pipeline",
           { q: "Is the false positive rate high?",
             y: "Tune the rules first — an ignored tool is worse than none",
             n: "Fail the build only on high-confidence, high-severity findings" },
           { s: "Run it in the editor too", n: "Feedback while writing beats feedback at merge." },
           { s: "It cannot see runtime or configuration issues", n: "Pair it with dependency scanning and DAST." },
           "Secret scanning is the highest-value rule to switch on first"] }
},

"Web Security": {
 ex: { h: "The headers and habits that make a site hard to attack",
       b: "A handful of response headers, cookies configured correctly, and validating input on the server rather than only in the browser. None of it is exotic and most breaches involve one of them being absent." },
 fl: { t: "The baseline for any site",
       s: ["HTTPS everywhere, with HSTS",
           { s: "A Content Security Policy", n: "The strongest single defence against XSS." },
           { s: "Cookies: HttpOnly, Secure, SameSite", n: "All three, on every session cookie." },
           { q: "Is input validated on the server?",
             y: "Client-side validation is UX only — the server is the control",
             n: "Anything the browser checks can be bypassed with curl" },
           "`X-Content-Type-Options: nosniff` and `frame-ancestors` round it out"] }
},

"Security Awareness": {
 ex: { h: "Fire drills, not a poster in the corridor",
       b: "Annual slide decks change very little. What works is realistic practice, an easy and blameless way to report something suspicious, and technical controls that hold even when someone is fooled — because eventually someone will be." },
 fl: { t: "Training that changes behaviour",
       s: ["People are the target of phishing and social engineering",
           { q: "Is training annual and generic?",
             y: "Compliance theatre — measurably little effect",
             n: "Short, frequent, role-specific, with realistic simulations" },
           { s: "Punishing people who fall for it hides the next incident", n: "Blame-free reporting is the goal." },
           { s: "Make reporting one click", n: "And acknowledge every report." },
           "Phishing-resistant MFA does more than any training programme"] }
},
"Least Privilege": {
 ex: { h: "The key that could do everything",
       b: "An access key with administrator rights is committed to a public repository in a `.env` file. Automated scanners find it within minutes, and because the identity could do anything, so can they — spin up mining instances, read every bucket, delete the backups. The same key scoped to reading one prefix would have made the same mistake a shrug." },
 fl: { t: "Narrowing a permission without breaking it",
       s: ["Start from the service's managed policy so the work is unblocked",
           { s: "Let it run, and read what the identity actually called", n: "The audit log knows; guessing does not." },
           { q: "Does a tool generate a policy from observed usage?",
             y: "Use it — evidence beats intuition, and it is faster",
             n: "Write the actions you saw, and keep the wildcard nowhere" },
           { s: "One identity per workload", n: "Shared roles make every blast radius the union of every use." },
           { s: "Short-lived credentials, so a leak expires on its own" },
           "Set a permission boundary above it, so nobody can create something more powerful than themselves"] }
}

});
