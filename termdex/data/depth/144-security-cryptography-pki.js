(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([
    {
      slug: "encryption",
      why: {
        before: "Historically, secret communications relied on classical ciphers (such as the Caesar substitution, Vigenère polyalphabetic ciphers, or mechanical rotor machines like Enigma) that operated without formal mathematical security proofs.",
        problem: "Classical ciphers relied on security through obscurity or algorithmic secrecy; they were systematically broken by frequency analysis, index of coincidence, and statistical letter distribution analysis, failing completely against electronic computing.",
        shift: "Claude Shannon's 1949 landmark paper 'Communication Theory of Secrecy Systems' founded modern mathematical cryptography, establishing information-theoretic secrecy, computational hardness assumptions, and Kerckhoffs's principle: algorithms must remain secure even if publicly known, relying solely on key secrecy."
      },
      num: {
        t: "Encryption Paradigms & Mathematical Foundations",
        h: ["Cryptographic Class", "Key Architecture", "Mathematical Hardness Assumption", "Standard Key Lengths", "Primary Modern Application"],
        r: [
          ["Information-Theoretic (One-Time Pad)", "Identical secret key shared between sender and receiver", "Information-theoretic; uncrackable even with infinite compute", "Key length must equal message length (non-reusable)", "Ultra-secure diplomatic red lines, quantum-immune transmission"],
          ["Symmetric Block / Stream Ciphers", "Single shared secret key for encryption and decryption", "Pseudorandom permutations / substitution-permutation networks", "128 bits, 256 bits (AES, ChaCha20)", "Bulk data-at-rest encryption (disk, DB), high-throughput TLS data"],
          ["Asymmetric (Public-Key) Systems", "Public key for encryption; private key for decryption", "Integer factorization (RSA) or Discrete Logarithms (ECC)", "2048–4096 bits (RSA), 256–384 bits (ECC)", "Key exchange (Diffie-Hellman), digital signatures, identity PKI"],
          ["Post-Quantum Cryptography (PQC)", "Asymmetric public/private key pairs", "Learning With Errors (LWE) over high-dimensional lattices", "ML-KEM-768 (Kyber): 1184-byte public key", "Future-proof TLS key encapsulation resisting Shor's algorithm"]
        ],
        n: "Modern encryption is formally defined as a tuple of algorithms (KeyGen, Encrypt, Decrypt). The encryption function E_k(M) -> C transforms plaintext M from message space M into ciphertext C using secret key k in keyspace K, such that decryption D_k(C) -> M recovers the original message deterministically. Kerckhoffs's Principle (1883) dictates that the security of a cryptosystem must depend solely on the secrecy of the key, not the secrecy of the algorithm. Modern cryptosystems demand IND-CCA2 security (Indistinguishability under Adaptive Chosen-Ciphertext Attack). To achieve IND-CCA2, raw encryption must never be deployed alone; it must be paired with cryptographic integrity via Authenticated Encryption with Associated Data (AEAD, such as AES-256-GCM or ChaCha20-Poly1305). An AEAD cipher outputs both the ciphertext C and an authentication tag T = MAC_k(C, A), computed over the ciphertext and unencrypted Associated Data A (such as packet headers). During decryption, the receiver validates tag T in constant time before decrypting; if an attacker alters a single bit of the ciphertext or header in transit, decryption immediately aborts, preventing padding oracle attacks and bit-flipping malleability exploits."
      },
      miss: [
        {
          w: "Encryption and encoding (like Base64 or URL encoding) are the same thing with different names.",
          r: "Encoding is a reversible data representation that requires no secret key and provides zero confidentiality; encryption is a mathematical transformation that cannot be reversed without the secret cryptographic key."
        },
        {
          w: "Designing your own custom proprietary encryption algorithm provides superior security against hackers.",
          r: "Schneier's Law states that anyone can create an encryption algorithm they cannot break themselves; custom unreviewed ciphers inevitably contain fatal mathematical flaws; always use open, peer-reviewed standards (AES, ChaCha20)."
        },
        {
          w: "Encrypting data guarantees that attackers cannot tamper with or modify the transmitted message.",
          r: "Basic encryption provides confidentiality, not integrity; an attacker can flip bits in raw unauthenticated ciphertext (malleability attack); tamper-proofing requires Authenticated Encryption (AEAD) or digital signatures."
        },
        {
          w: "A 256-bit symmetric key can be cracked if an attacker has enough supercomputers and time.",
          r: "Brute-forcing a 256-bit key requires testing 2^256 combinations; testing a billion keys per second across every atom in the observable universe for billions of years would not test a fraction of 1% of the keyspace."
        }
      ],
      trade: {
        buys: [
          "Complete confidentiality: prevents unauthorized parties, ISPs, and eavesdroppers from reading data in transit or at rest.",
          "Regulatory compliance: satisfies mandatory data protection laws (GDPR, HIPAA, PCI-DSS) governing sensitive consumer records.",
          "Tamper detection: modern AEAD schemes guarantee that unauthorized payload modifications are detected instantly.",
          "Safe multi-tenant cloud storage: store customer database backups on shared public cloud object stores securely."
        ],
        costs: [
          "Key management liability: losing the cryptographic key results in permanent, irrecoverable data loss.",
          "Computational overhead: encrypting and decrypting multi-gigabyte data streams consumes CPU cycles (mitigated by AES-NI).",
          "Searchability friction: encrypted database fields cannot be indexed, sorted, or queried using standard B-trees without specialized schemes.",
          "Initialization vector management: reusing a Nonce/IV with the same key in GCM mode destroys confidentiality and authentication."
        ],
        avoid: [
          "Reusing an Initialization Vector (IV) or Nonce with the same key in AES-GCM or ChaCha20-Poly1305.",
          "Deploying unauthenticated legacy encryption modes like AES-CBC or AES-ECB without cryptographic HMAC authentication.",
          "Hardcoding cryptographic keys directly into source code repositories or Docker container images.",
          "Attempting to invent proprietary encryption algorithms instead of using established standard cryptographic libraries."
        ]
      }
    },
    {
      slug: "symmetric-encryption",
      why: {
        before: "Early computer cryptography used proprietary hardware scramblers or bespoke stream ciphers developed behind closed doors without international standardization or open public cryptanalysis.",
        problem: "Proprietary ciphers frequently suffered from catastrophic algebraic flaws or hidden government backdoors; interoperability between financial institutions and government agencies was impossible without purchasing matching proprietary hardware.",
        shift: "The National Bureau of Standards (NBS/NIST) established open, standardized symmetric block ciphers—starting with DES in 1977 and culminating in the Advanced Encryption Standard (AES / FIPS 197 in 2001)—where both parties share a single identical secret key for high-speed bulk data encryption."
      },
      num: {
        t: "Symmetric Block & Stream Cipher Architectures Comparison",
        h: ["Algorithm", "Cipher Architecture", "Block Size / State", "Key Length Options", "Cryptographic Security Status"],
        r: [
          ["DES (Data Encryption Standard)", "16-round Feistel network", "64 bits (8 bytes)", "56 bits effective key length", "Broken; crackable in hours via brute force due to small 56-bit key"],
          ["3DES (Triple DES)", "Encrypt-Decrypt-Encrypt Feistel", "64 bits (8 bytes)", "112 or 168 bits", "Deprecated; vulnerable to Sweet32 collision attacks due to 64-bit block size"],
          ["AES (Rijndael - FIPS 197)", "Substitution-Permutation Network", "128 bits (16 bytes)", "128, 192, or 256 bits", "Universal global gold standard; hardware-accelerated via AES-NI"],
          ["ChaCha20 (RFC 8439)", "Stream cipher (ARX: Add-Rotate-XOR)", "512-bit internal state", "256 bits", "Ultra-fast on CPUs lacking AES hardware acceleration (mobile/ARM)"]
        ],
        n: "The Advanced Encryption Standard (AES) operates on a 128-bit block structured as a 4x4 column-major matrix of bytes known as the State. AES executes an iterative series of mathematical rounds: 10 rounds for AES-128, 12 rounds for AES-192, and 14 rounds for AES-256. Each round (except the final round) executes four algebraic transformations over the Galois Field GF(2^8): 1) SubBytes: non-linear byte substitution using a cryptographically inverted Rijndael S-box, providing confusion; 2) ShiftRows: cyclical left-shifting of State rows by varying byte offsets (Row 0 by 0, Row 1 by 1, Row 2 by 2, Row 3 by 3), providing diffusion; 3) MixColumns: matrix multiplication combining the four bytes of each column using modular polynomial arithmetic modulo x^4 + 1; 4) AddRoundKey: bitwise XOR of the State with a 128-bit round key computed via the Rijndael key schedule. Block cipher modes dictate how multi-block messages are processed. Electronic Codebook (ECB) mode encrypts each block independently, dangerously preserving structural plaintext patterns (exemplified by the visible 'ECB Penguin'). Modern production systems mandate Galois/Counter Mode (GCM): GCM turns AES into a stream cipher by encrypting an incrementing counter (CTR mode) and authenticates ciphertext using a universal hash function (GHASH) over GF(2^128), providing authenticated encryption at gigabytes per second via CPU-native AES-NI instructions."
      },
      miss: [
        {
          w: "AES-256 is twice as secure as AES-128 because the key size is doubled.",
          r: "AES-128 provides 2^128 security combinations, which already requires more energy to brute force than exists in our galaxy; AES-256 provides 2^256 combinations, primarily offering a safety buffer against future quantum Grover's algorithm attacks, not a '2x' increase."
        },
        {
          w: "Electronic Codebook (ECB) mode is acceptable for encrypting small database fields.",
          r: "ECB mode encrypts identical 16-byte plaintext blocks into identical ciphertext blocks; an eavesdropper can deduce data patterns, infer repeated database values, and execute replay attacks without knowing the key."
        },
        {
          w: "Symmetric encryption solves the entire problem of secure Internet communications by itself.",
          r: "Symmetric encryption requires both parties to possess the exact same secret key beforehand; it cannot solve the key exchange problem over open networks without asymmetric cryptography (Diffie-Hellman) or PKI."
        },
        {
          w: "Using AES in software is always secure as long as the algorithm implementation is mathematically correct.",
          r: "Software implementations of AES that use memory lookup tables for SubBytes are vulnerable to cache-timing side-channel attacks; secure implementations must use constant-time instructions (AES-NI) or bit-sliced implementations."
        }
      ],
      trade: {
        buys: [
          "Extreme computational speed: encrypts and decrypts at multiple gigabytes per second per CPU core using AES-NI instructions.",
          "Minimal ciphertext expansion: block and stream ciphers add negligible size overhead (only the 12-byte IV and 16-byte auth tag).",
          "Compact key sizes: 256-bit symmetric keys provide post-quantum security margins with tiny 32-byte key storage.",
          "Universal hardware acceleration: built directly into modern x86, ARM, and mobile processors as dedicated silicon instructions."
        ],
        costs: [
          "Key distribution dilemma: securely sharing the symmetric key across untrusted networks requires asymmetric cryptography.",
          "Key management complexity: a separate symmetric key must be generated and managed for every communicating peer pair (O(N^2) scaling).",
          "Nonce reuse catastrophe: in GCM mode, reusing a single Nonce with the same key completely destroys the authentication and confidentiality.",
          "Lack of non-repudiation: because both sender and receiver hold identical keys, either party could have generated any message."
        ],
        avoid: [
          "Using ECB (Electronic Codebook) mode under any circumstances in production software.",
          "Reusing an Initialization Vector (IV) / Nonce across multiple encryption operations with the same AES-GCM key.",
          "Implementing AES using standard software lookup tables susceptible to CPU cache-timing attacks.",
          "Transmitting symmetric keys over unencrypted channels or storing them in plaintext configuration files."
        ]
      }
    },
    {
      slug: "asymmetric-encryption",
      why: {
        before: "For thousands of years, all cryptography required a pre-shared secret key: communicating secretly required parties to physically meet or rely on trusted couriers to transport identical secret keys before exchanging messages.",
        problem: "In a global Internet connecting billions of computers and anonymous users, strangers cannot securely exchange a pre-shared key over open telecommunications lines without an eavesdropper intercepting it (the Key Distribution Problem).",
        shift: "Whitfield Diffie, Martin Hellman, and Ralph Merkle (1976), alongside Rivest, Shamir, and Adleman (RSA in 1977), invented Public-Key (Asymmetric) Cryptography, decoupling the encryption key (public, published openly) from the decryption key (private, retained strictly by the owner)."
      },
      num: {
        t: "Asymmetric Cryptosystems & Mathematical Foundations",
        h: ["Algorithm / Family", "Mathematical Trapdoor Problem", "Key Size (128-bit Security)", "Primary Operational Role", "Quantum Vulnerability (Shor's Algorithm)"],
        r: [
          ["RSA (Rivest-Shamir-Adleman)", "Integer Factorization of N = p * q", "3072 bits (2048-bit minimum)", "Legacy TLS key exchange, digital signatures, S/MIME email", "Completely vulnerable; broken by Shor's algorithm on a quantum computer"],
          ["Diffie-Hellman (DH / DHE)", "Discrete Logarithm Problem in Z_p*", "3072 bits (Finite Field)", "Ephemeral forward-secret key exchange in TLS and VPNs", "Completely vulnerable; broken by Shor's algorithm"],
          ["Elliptic Curve Cryptography (ECDH / ECDSA)", "Elliptic Curve Discrete Logarithm Problem (ECDLP)", "256 bits (NIST P-256 or Curve25519)", "Modern TLS 1.3 handshakes, SSH keys, Bitcoin/Ethereum, WireGuard", "Completely vulnerable; broken by Shor's algorithm"],
          ["ML-KEM (CRYSTALS-Kyber - FIPS 203)", "Learning With Errors over Module Lattices (M-LWE)", "1184-byte public key (ML-KEM-768)", "NIST standardized Post-Quantum Key Encapsulation (PQC)", "Quantum-resistant; immune to known quantum algorithmic attacks"]
        ],
        n: "Asymmetric cryptography is founded on mathematical one-way trapdoor functions: mathematical operations that are computationally trivial to compute in the forward direction, but computationally intractable to invert without knowledge of private trapdoor data. In RSA, given two large secret prime numbers p and q, computing the public modulus N = p * q is trivial (O(log^2 N)); however, factoring N back into p and q requires exponential sub-exponential time using the General Number Field Sieve (GNFS). The public exponent e and private exponent d satisfy e * d = 1 mod phi(N), allowing encryption via C = M^e mod N and decryption via M = C^d mod N. In modern Elliptic Curve Cryptography (such as Curve25519 or secp256k1 over y^2 = x^3 + ax + b), operations are defined as point additions and point doublings over finite fields. A private key is a randomly selected 256-bit scalar integer d; the public key is the curve point Q = d * G, where G is a standardized base generator point. Finding d given Q requires solving the Elliptic Curve Discrete Logarithm Problem (ECDLP), requiring O(sqrt(p)) operations via Pollard's rho algorithm. Because asymmetric operations require intensive multi-precision modular arithmetic (running 100x to 1,000x slower than AES), modern protocols use Hybrid Cryptography: asymmetric cryptography (ECDH) is executed strictly to negotiate a shared ephemeral secret during the initial handshake, which is fed into HKDF to derive symmetric keys (AES-GCM) that encrypt the bulk application payload."
      },
      miss: [
        {
          w: "Asymmetric encryption is used to encrypt all web traffic and video streams on the Internet.",
          r: "Asymmetric encryption is computationally far too slow for bulk data; it is used solely during the initial handshake to authenticate identity and negotiate a short-lived symmetric session key (hybrid cryptography)."
        },
        {
          w: "A 256-bit elliptic curve key is weaker than a 2048-bit RSA key because 256 is smaller than 2048.",
          r: "A 256-bit elliptic curve key provides approximately 128 bits of cryptographic security—matching the security strength of a massive 3072-bit RSA key while consuming a fraction of the bandwidth, memory, and CPU power."
        },
        {
          w: "Public keys must be kept confidential and shared only with trusted business partners.",
          r: "Public keys are designed by mathematical definition to be distributed openly to the entire world; confidentiality applies exclusively to the corresponding private key, which must never leave secure storage."
        },
        {
          w: "Encrypting with a public key and signing with a private key are mathematically identical operations.",
          r: "While related in textbook RSA, modern signature schemes (like Ed25519) and key agreement schemes (like X25519) use fundamentally different curve parameters, padding standards, and mathematical algorithms."
        }
      ],
      trade: {
        buys: [
          "Solves the Key Distribution Problem: strangers establish secure communications over open networks without prior secret sharing.",
          "Digital signatures and non-repudiation: enables cryptographically unforgeable digital signatures proving authorship.",
          "Linear key scaling: each network participant requires only one public/private key pair (O(N) scaling instead of O(N^2)).",
          "Decoupled trust architectures: enables public identity verification via decentralized Web of Trust or hierarchical PKI."
        ],
        costs: [
          "High computational latency: modular exponentiation and scalar point multiplication consume 100x to 1000x more CPU than symmetric ciphers.",
          "Vulnerability to quantum computers: standard RSA, Diffie-Hellman, and ECC are completely broken by Shor's algorithm.",
          "Large key and ciphertext footprint: RSA keys require 3072–4096 bits; post-quantum lattice keys require thousands of bytes.",
          "Man-in-the-Middle exposure: public keys carry no inherent proof of identity without Public Key Infrastructure (PKI) certificates."
        ],
        avoid: [
          "Using raw asymmetric encryption (like RSA) to encrypt large files or database records directly (always use hybrid encryption).",
          "Deploying legacy RSA key lengths under 2048 bits or using deprecated padding schemes like PKCS#1 v1.5 (use OAEP).",
          "Sharing or transferring private keys across network channels or embedding them in container images.",
          "Assuming asymmetric keys are immune to future quantum decryption without deploying hybrid post-quantum algorithms."
        ]
      }
    },
    {
      slug: "hashing",
      why: {
        before: "In early computer systems, data integrity was checked using simple linear parity bits, longitudinal redundancy checks, or cyclic redundancy checks (CRC32).",
        problem: "CRCs and simple checksums were engineered solely to detect accidental physical transmission noise (like bit flips on copper wire); they provide zero security against intentional tampering because an attacker can alter payload bytes and easily adjust trailing bits to produce the identical CRC32 checksum.",
        shift: "Cryptographic Hash Functions (starting with MD5, progressing through SHA-1, SHA-2, and modern SHA-3 / BLAKE3) introduced one-way, collision-resistant mathematical compression algorithms that convert arbitrary-length inputs into fixed-size cryptographic digests."
      },
      num: {
        t: "Cryptographic Hash Functions Evolution & Security Status",
        h: ["Algorithm Family", "Digest Output Size", "Internal Architecture", "Collision Resistance Status", "Primary Modern Deployment"],
        r: [
          ["MD5 (RFC 1321)", "128 bits (16 bytes)", "Merkle-Damgård construction", "Cryptographically broken; collisions generated in seconds", "Legacy non-security checksums (file deduplication)"],
          ["SHA-1 (FIPS 180-1)", "160 bits (20 bytes)", "Merkle-Damgård construction", "Cryptographically broken; practical collision demonstrated (SHAttered 2017)", "Deprecated; actively blocked by modern browsers and Git (moving to SHA-256)"],
          ["SHA-256 / SHA-512 (SHA-2)", "256 / 512 bits", "Merkle-Damgård with Davies-Meyer compression", "Secure; no practical collision attacks known", "TLS certificates, Bitcoin mining, digital signatures, Git SHA-256"],
          ["SHA-3 (Keccak - FIPS 202)", "224, 256, 384, 512 bits", "Sponge construction (Keccak-f permutation)", "Extremely secure; completely independent mathematical design from SHA-2", "Government cryptography, Ethereum smart contracts, security standards"],
          ["BLAKE3", "256 bits (Arbitrary output)", "Tree hashing based on Bao / BLAKE2", "Secure; high security margin", "Ultra-fast parallel hashing; line-rate hashing on multi-core systems"]
        ],
        n: "A cryptographic hash function H(M) -> h maps a message M of arbitrary length to a fixed-size digest h (e.g., 256 bits) while satisfying three mandatory mathematical security criteria: 1) **Preimage Resistance (One-Wayness)**: given a digest h, it is computationally infeasible to find any message M such that H(M) = h (requiring O(2^n) brute-force operations for an n-bit digest); 2) **Second Preimage Resistance (Weak Collision Resistance)**: given a specific input M_1, it is computationally infeasible to find a different input M_2 != M_1 such that H(M_1) = H(M_2) (requiring O(2^n) operations); 3) **Collision Resistance (Strong Collision Resistance)**: it is computationally infeasible to find *any* two arbitrary distinct inputs M_1 != M_2 such that H(M_1) = H(M_2). Under the mathematical Birthday Paradox, finding a collision requires only O(2^(n/2)) operations; for SHA-256, this requires 2^128 operations, an astronomically unreachable threshold. Cryptographic hashes must exhibit the 'Avalanche Effect': flipping a single bit in the input message must cause approximately 50% of the output bits to flip in a completely pseudorandom, unpredictable pattern. Merkle-Damgård hashes (like SHA-256) suffer from Length Extension Attacks: given H(M) and the length of M, an attacker can calculate H(M || padding || M_evil) without knowing secret M, which is why message authentication requires HMAC (H(K_outer || H(K_inner || M))) rather than naive hashing H(Key || Message)."
      },
      miss: [
        {
          w: "A cryptographic hash can be 'decrypted' back into its original input if you have the secret key.",
          r: "Hashing is a strictly one-way mathematical compression function, not encryption; there is no key, and information is permanently discarded (compressing gigabytes into 32 bytes), making true decryption mathematically impossible."
        },
        {
          w: "SHA-256 is the recommended algorithm for hashing and storing user passwords in databases.",
          r: "SHA-256 is engineered for maximum speed (hashing millions of inputs per second per GPU core); storing passwords requires slow, memory-hard Key Derivation Functions (Argon2id, bcrypt, scrypt) to defeat GPU brute-forcing."
        },
        {
          w: "Hash collisions are purely theoretical and have never occurred in real-world software.",
          r: "Practical collisions have been engineered for MD5 (Flame malware forged rogue Microsoft certificates) and SHA-1 (Google's 2017 SHAttered attack produced two PDFs with identical SHA-1 hashes), making them unsafe."
        },
        {
          w: "Hashing an API secret with the message (e.g., hash(secret + message)) creates a secure signature.",
          r: "Naive prefix hashing is vulnerable to Length Extension Attacks in MD5 and SHA-2; attackers can append unauthorized data and compute a valid signature without knowing the secret (use HMAC or SHA-3)."
        }
      ],
      trade: {
        buys: [
          "Tamper-evident verification: detect even a single-bit alteration in multi-gigabyte files or disk images instantly.",
          "Deterministic fixed-size fingerprinting: index, verify, and address arbitrary data via uniform 32-byte hashes.",
          "Digital signature substrate: sign small 32-byte cryptographic hashes rather than slow multi-megabyte payloads.",
          "Content-addressable architectures: form the immutable foundation of Git commits, Merkle trees, and blockchain ledgers."
        ],
        costs: [
          "Irreversible information loss: cannot reconstruct the original data payload from the hash digest alone.",
          "Birthday paradox collision bound: an n-bit hash provides only n/2 bits of collision resistance against brute-force searches.",
          "Length extension attack vulnerability: Merkle-Damgård constructions require HMAC wrappers for secure message authentication.",
          "CPU compute cost on massive files: streaming multi-terabyte files through cryptographic hashes consumes substantial memory bus bandwidth."
        ],
        avoid: [
          "Using broken hash algorithms (MD5, SHA-1) for security signatures, certificates, or integrity verification.",
          "Using fast cryptographic hashes (SHA-256, SHA-512) for user password storage without slow KDFs (Argon2id, bcrypt).",
          "Concatenating secrets with messages (hash(key + msg)) instead of using RFC 2104 compliant HMAC (HMAC-SHA256).",
          "Assuming two files with identical hashes are identical without verifying collision-resistance standards."
        ]
      }
    },
    {
      slug: "salt",
      why: {
        before: "In early multi-user operating systems and web applications, user passwords were stored in system databases as plain, unsalted cryptographic hashes (e.g., Hash('password123')).",
        problem: "Unsalted password hashing had two fatal vulnerabilities: identical passwords produced identical hash strings across all users, and attackers precomputed massive global lookup tables (Rainbow Tables) mapping billions of common passwords to their hashes, cracking stolen databases in seconds.",
        shift: "Cryptographic Salting introduced the mandatory practice of prepending or appending a unique, cryptographically random byte sequence (the salt) to each password before hashing, ensuring that identical passwords produce completely distinct hashes and neutralizing precomputed rainbow tables."
      },
      num: {
        t: "Password Storage Architectures & Attack Resistance",
        h: ["Hashing Strategy", "Salt Uniqueness & Storage", "Computational Work Factor", "Rainbow Table Immunity", "GPU / ASIC Hardware Resistance"],
        r: [
          ["Unsalted Fast Hash (e.g., MD5 / SHA-256)", "None (Raw password hashed directly)", "None; computed in nanoseconds (billions/sec on GPU)", "Zero; completely defeated by precomputed rainbow tables", "Zero; trivial to crack via parallel GPU clusters"],
          ["Static Global Salt (Application Pepper)", "Single hardcoded salt shared across all users", "None; fast single computation", "Low; attacker merely precomputes a rainbow table tailored to that pepper", "Zero; GPU hash rates remain unthrottled"],
          ["Unique Per-User Salt + SHA-256", "Random 16+ byte salt per user (stored in DB)", "None; fast single iteration", "Complete immunity against precomputed rainbow tables", "Extremely low; modern GPUs still test 100M+ guesses per second per user"],
          ["PBKDF2 (RFC 8018)", "Unique per-user salt + HMAC loop", "Tunable iterations (e.g., 600,000 rounds of HMAC-SHA256)", "Complete immunity", "Moderate; compute-heavy but lacks memory hardness (parallelizable on ASICs)"],
          ["Argon2id (RFC 9106 / PHC Winner)", "Unique per-user salt + memory-hard DAG", "Tunable time, memory (e.g., 64 MB), and parallelism", "Complete immunity", "Maximum; memory hardness prevents GPU and ASIC parallelization"]
        ],
        n: "The mathematical power of salting is rooted in combinatorial explosion. Consider a password dictionary D of 10^6 common passwords. Without a salt, an attacker computes H(P) for all 10^6 passwords once and immediately cracks every user in a leaked database whose hash matches the table (O(D) total work). When a 128-bit cryptographically secure pseudorandom salt S is prepended to each password, the total precomputation search space expands to D * 2^128 combinations—a number exceeding the total atom count of the observable universe, rendering precomputed rainbow tables physically impossible. The attacker is forced to execute an independent, per-user brute-force search: work = U * D, where U is the number of user rows. However, a unique salt alone is insufficient against modern GPU clusters if the underlying hash is fast (such as SHA-256, which an NVIDIA RTX 4090 computes at >10 billion hashes/sec). Secure authentication requires pairing unique salts with dedicated Password Hashing Functions (Key Derivation Functions) like Argon2id, bcrypt, or scrypt. These algorithms enforce tunable Work Factors (iteration counts) and Memory Hardness (requiring tens of megabytes of RAM per hash attempt), saturating memory bus bandwidth and neutralizing massive GPU parallelization."
      },
      miss: [
        {
          w: "The salt must be kept strictly secret and encrypted in a secure vault away from the database.",
          r: "A salt is not a secret key; it is stored in plaintext directly alongside the password hash in the database (e.g., $argon2id$v=19$m=65536,t=3,p=4$salt$hash); its purpose is uniqueness, not secrecy."
        },
        {
          w: "Using a single secret global salt ('pepper') stored in server environment variables eliminates the need for per-user salts.",
          r: "A static pepper without per-user salts allows duplicate passwords to produce identical hashes; once an attacker compromises the server environment and steals the pepper, all passwords can be cracked using a single customized rainbow table."
        },
        {
          w: "Salting a password prevents an attacker from brute-forcing simple passwords like '123456'.",
          r: "Salting prevents precomputed dictionary attacks and cross-user correlation, but it cannot prevent an attacker from guessing obvious, low-entropy passwords ('123456') during a dedicated dictionary attack against an individual hash."
        },
        {
          w: "A 4-byte or predictable sequential salt (like incrementing User IDs) provides adequate protection.",
          r: "Small or predictable salts allow attackers to precompute rainbow tables for the limited set of possible salts; salts must be generated using a cryptographically secure pseudorandom number generator (CSPRNG) with at least 16 bytes (128 bits) of entropy."
        }
      ],
      trade: {
        buys: [
          "Immunity to Rainbow Table attacks: precomputed reverse hash lookup tables are rendered mathematically useless.",
          "Identical password differentiation: two users with identical passwords receive completely distinct hash representations.",
          "Defeats multi-user cracking amortization: forces attackers to crack each stolen account sequentially rather than all at once.",
          "Zero operational secret management: salts are stored in cleartext in the database alongside hashes without complex key vaults."
        ],
        costs: [
          "Database storage footprint: storing 16 to 32 bytes of salt per user record increases database index and storage size.",
          "CPU overhead when paired with KDFs: slow password hashing algorithms intentionally consume CPU cycles during user logins.",
          "Does not protect low-entropy passwords: weak passwords can still be cracked via targeted dictionary attacks.",
          "Timing attack risks: verifying password hashes requires constant-time string comparisons to prevent timing side channels."
        ],
        avoid: [
          "Generating salts using weak, non-cryptographic random functions (like Math.random() or rand()).",
          "Reusing the same static salt for all user accounts across the entire application database.",
          "Storing password hashes in databases without an slow, memory-hard KDF (Argon2id, bcrypt, or PBKDF2).",
          "Truncating user passwords before salting and hashing (a notorious historical flaw in early implementations of bcrypt)."
        ]
      }
    },
    {
      slug: "digital-signature",
      why: {
        before: "In physical commerce and legal documentation, authenticity and non-repudiation were established using handwritten ink signatures, embossed seals, or physical wax stamps.",
        problem: "In digital communications, electronic messages and files consist of arbitrary bits that can be copied, edited, and forged without leaving physical traces; a recipient had no mathematical proof that a message came from a specific sender or remained unaltered in transit.",
        shift: "Digital Signatures (invented by Diffie, Hellman, Rivest, Shamir, and Adleman) established a cryptographic mechanism that binds a digital document to a private key, guaranteeing message integrity, signer authenticity, and legal non-repudiation."
      },
      num: {
        t: "Digital Signature Algorithms & Technical Characteristics",
        h: ["Signature Algorithm", "Mathematical Primitive", "Signature Size", "Public Key Size", "Verification Speed vs Signing Speed"],
        r: [
          ["RSA PKCS#1 v1.5 (Legacy)", "Modular exponentiation over N = p * q", "256–512 bytes (2048–4096 bits)", "256–512 bytes", "Extremely fast verification (e=65537); slow signing; padding flaws"],
          ["RSA-PSS (RFC 8017)", "Probabilistic Signature Scheme over RSA", "256–512 bytes", "256–512 bytes", "Fast verification; mathematically proven security reduction"],
          ["ECDSA (NIST P-256)", "Elliptic curve point multiplication (secp256r1)", "64 bytes (r, s integers)", "33 or 65 bytes", "Balanced; catastrophic vulnerability if random nonce k repeats"],
          ["Ed25519 (EdDSA / RFC 8032)", "Twisted Edwards curve (Curve25519) + SHA-512", "64 bytes (deterministic)", "32 bytes", "Ultra-fast signing and verification; immune to nonce side channels"],
          ["ML-DSA (CRYSTALS-Dilithium - FIPS 204)", "Lattice-based Fiat-Shamir with Aborts", "2,420 bytes (ML-DSA-44)", "1,312 bytes", "Fast verification; large post-quantum signature size"]
        ],
        n: "A digital signature scheme consists of three algorithms: KeyGen, Sign, and Verify. In modern Ed25519 (RFC 8032), the lifecycle operates as follows: 1) The signer generates a private scalar key d and derives public curve point Q = d * G; 2) To sign a message M, the signer first hashes M using a cryptographic hash function (SHA-512). Ed25519 derives a deterministic nonce r = H(H(d) || M), eliminating the fatal vulnerability of legacy ECDSA where a flawed pseudorandom number generator reusing nonce k instantly reveals the private key (which compromised the Sony PlayStation 3 security architecture); 3) The signer computes curve point R = r * G and scalar s = r + H(R || Q || M) * d mod l. The signature is the 64-byte tuple (R, s); 4) The verifier receives message M, signature (R, s), and public key Q. The verifier checks the group equation s * G = R + H(R || Q || M) * Q. If valid, it is mathematically impossible for anyone without knowledge of private key d to have generated (R, s), proving both Authenticity (the author possessed the private key) and Integrity (the message was not modified by even a single bit). Furthermore, it guarantees Non-Repudiation: because only the signer holds the private key, the signer cannot legally claim that a third party generated the signature."
      },
      miss: [
        {
          w: "A digital signature is simply an electronic image of your handwritten signature pasted into a PDF document.",
          r: "A pasted image is an unauthenticated graphic with zero cryptographic security; a true digital signature is a mathematical cryptographic proof generated using asymmetric private keys that binds to the exact bits of the document."
        },
        {
          w: "A digital signature encrypts the message and hides its contents from unauthorized eavesdroppers.",
          r: "Digital signatures provide authenticity, integrity, and non-repudiation, not confidentiality; the signed message is transmitted in plain view alongside the signature unless explicitly encrypted in a separate encryption step."
        },
        {
          w: "Signing a document requires encrypting the entire multi-gigabyte document with your private key.",
          r: "Asymmetric cryptography is far too slow to process large payloads; digital signature algorithms compute a fast, 32-byte cryptographic hash of the document (SHA-256) and sign only the tiny hash digest."
        },
        {
          w: "Digital signatures remain valid indefinitely without any time constraints.",
          r: "Signatures can become unverifiable if the signer's public key certificate expires or is revoked, unless an independent RFC 3161 cryptographic Timestamping Authority (TSA) embeds an immutable, signed timestamp token at the moment of signing."
        }
      ],
      trade: {
        buys: [
          "Mathematical authenticity: mathematically guarantees that a message, commit, or binary was created by the legitimate key holder.",
          "Tamper-proof integrity: any alteration of the signed document invalidates the signature verification check instantly.",
          "Non-repudiation: signers cannot deny authoring a transaction or message because the private key is held exclusively by them.",
          "Supply chain security: cryptographically sign container images (Cosign) and Git commits to verify software provenance."
        ],
        costs: [
          "Key compromise disaster: if a developer's private signing key is compromised, attackers can sign malicious malware as legitimate software.",
          "Signature size overhead: post-quantum signatures (ML-DSA) add multiple kilobytes of metadata overhead per signature.",
          "Verification compute overhead: verifying thousands of signatures per second on high-throughput blockchains stresses CPU cores.",
          "Timestamping dependency: proving when a signature was created requires trusted external Timestamping Authorities (TSA)."
        ],
        avoid: [
          "Deploying ECDSA without verifying that the underlying random number generator produces cryptographically secure, non-repeating nonces.",
          "Signing unhashed arbitrary-length data directly with raw RSA (always use secure padding schemes like RSA-PSS).",
          "Distributing public signing keys over unauthenticated HTTP channels without PKI certificate validation.",
          "Allowing unsigned Git commits or unsigned container images into production deployment pipelines."
        ]
      }
    },
    {
      slug: "public-key-infrastructure",
      why: {
        before: "Early public-key cryptography solved the mathematical key exchange problem, but suffered from the critical 'Identity Binding Problem': when an application receives a public key over a network, it has no proof of who actually owns that key.",
        problem: "Without identity verification, public-key encryption is completely vulnerable to Man-in-the-Middle (MitM) attacks: an attacker intercepts traffic, substitutes their own public key, and decrypts, inspects, and re-encrypts all communications without detection.",
        shift: "Public Key Infrastructure (PKI, standardized around ITU-T X.509) established a comprehensive governance framework of Certificate Authorities (CAs), registration authorities, digital certificates, revocation lists, and validation protocols that bind public keys to verified domain names and legal identities."
      },
      num: {
        t: "PKI Architecture Components & Operational Roles",
        h: ["PKI Component / Standard", "Hierarchy Level / Scope", "Primary Operational Function", "Revocation & Verification Mechanism", "Failure Mode / Risk"],
        r: [
          ["Root Certificate Authority (Root CA)", "Top of trust chain (Trust Anchor)", "Issues and signs Intermediate CA certificates; offline air-gapped", "Pre-installed in OS and web browser root trust stores", "Compromise destroys the entire security of the global PKI ecosystem"],
          ["Intermediate CA (Subordinate CA)", "Middle tier of trust chain", "Issues day-to-day leaf certificates; protects offline Root CA", "CRL distribution points and OCSP responder endpoints", "Private key compromise allows unauthorized issuance of rogue certificates"],
          ["Leaf / End-Entity Certificate", "Bottom of chain (Web server / Client)", "Binds a public key to specific domain names (SAN) or user identities", "Validated against Intermediate CA signature and OCSP stapling", "Expiration causes immediate application and website outages"],
          ["Certificate Transparency (CT / RFC 6962)", "Global public audit layer", "Public append-only Merkle tree logging of every issued certificate", "Monitored by domain owners for unauthorized certificate issuance", "Detects rogue CA misissuance; mandated by modern web browsers"],
          ["OCSP Stapling (RFC 6066)", "TLS handshake optimization", "Server fetches signed OCSP response from CA and staples to TLS handshake", "Eliminates client-side OCSP lookup delays and preserves user privacy", "Stale stapled responses or failed CA responders cause TLS handshake failures"]
        ],
        n: "Public Key Infrastructure relies on a hierarchical Chain of Trust governed by the ITU-T X.509 standard. At the pinnacle sits the Root Certificate Authority (Root CA), a trusted entity whose self-signed certificate is pre-installed directly into operating system and browser trust stores (e.g., Windows Certificate Store, macOS Keychain, Linux ca-certificates). To protect against catastrophic compromise, Root CA private keys are stored in offline, air-gapped Hardware Security Modules (HSMs) protected by multi-person M-of-N physical ceremony quorums. The Root CA signs Intermediate CA certificates, which in turn sign Leaf (End-Entity) Certificates deployed on web servers. When a client initiates a TLS handshake with a server (e.g., https://api.example.com), the server transmits its Leaf certificate and Intermediate certificate. The client validates the chain iteratively: 1) It verifies that api.example.com matches the Subject Alternative Name (SAN) extension; 2) It verifies the digital signature on the Leaf certificate using the Intermediate CA's public key; 3) It verifies the Intermediate certificate signature using the Root CA's public key; 4) It confirms the Root CA matches a pre-installed trust anchor. Revocation checking ensures compromised certificates are invalidated: legacy Certificate Revocation Lists (CRLs) download massive lists of serial numbers; modern systems use the Online Certificate Status Protocol (OCSP) or OCSP Stapling, where the web server periodically fetches a time-stamped, CA-signed proof of certificate validity and staples it directly into the TLS handshake."
      },
      miss: [
        {
          w: "Creating a self-signed certificate provides the exact same security as a public CA-signed certificate for public web users.",
          r: "While self-signed certificates provide symmetric TLS encryption, they fail identity authentication: browsers do not trust them, displaying alarming security warnings because the certificate is not signed by a recognized Root CA in the user's trust store."
        },
        {
          w: "Web browsers make a live network query to the Certificate Authority every single time you load an HTTPS webpage.",
          r: "Live OCSP queries leak user browsing history to CAs and add hundreds of milliseconds of latency; modern servers use OCSP Stapling, caching and delivering the CA's signed validation token directly inside the TLS handshake."
        },
        {
          w: "Certificate Authorities verify that a website is free of malware and fraudulent scams before issuing an SSL certificate.",
          r: "Standard Domain Validation (DV) certificates verify only that the applicant controls the DNS domain records; CAs perform zero background checks or malware scans on website contents, meaning malicious phishing sites routinely obtain valid certificates."
        },
        {
          w: "A compromised Intermediate CA can issue fake certificates for any domain on the entire Internet.",
          r: "Historically true, but modern PKI enforces Certificate Transparency (CT) logs where all issued certificates must be logged publicly; modern browsers reject certificates lacking cryptographic Signed Certificate Timestamps (SCTs), alerting domain owners immediately."
        }
      ],
      trade: {
        buys: [
          "Scalable global identity trust: establishes authenticated, encrypted connections between strangers across the planet.",
          "Man-in-the-Middle prevention: cryptographic certificate chains guarantee you are communicating with the authentic domain.",
          "Automated lifecycle management: protocols like ACME (Automated Certificate Management Environment) enable zero-touch certificate renewal.",
          "Centralized access revocation: revoke compromised credentials or rogue employee certificates across the enterprise."
        ],
        costs: [
          "Operational outage risks: unmonitored certificate expirations cause immediate, severe enterprise application downtime.",
          "Trust centralization vulnerability: compromising a single trusted public CA threatens the security of millions of internet users.",
          "Certificate management complexity: managing internal PKIs, private CAs, and root trust distribution requires dedicated infrastructure.",
          "Performance overhead of certificate chains: transmitting multi-kilobyte certificate chains increases initial TLS handshake latency."
        ],
        avoid: [
          "Allowing production public SSL/TLS certificates to expire without automated ACME renewal tools (e.g., Certbot).",
          "Distributing internal self-signed leaf certificates directly to clients instead of establishing an internal root and intermediate CA.",
          "Issuing leaf certificates directly from the Root CA (always use an Intermediate CA to keep the Root CA offline).",
          "Using deprecated SHA-1 or MD5 algorithms in X.509 certificate signature algorithms."
        ]
      }
    }
  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
