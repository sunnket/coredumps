/* ==========================================================================
   Depth pass 126 — Backend Architecture batch 3: Identity, Security & System Topologies.
   JWT, OAuth 2.0, OpenID Connect, Single Sign-On,
   Session, API Gateway, Monolith.

   Stateless cryptographic tokens, delegated authorization frameworks, federated identity,
   server-side session lifecycle management, ingress edge gateways, and modular monolithic
   cohesion define distributed backend topologies.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "jwt",

      why: {
        before: "Distributed microservices authenticated incoming requests by making synchronous RPC queries back to a centralized relational database or Redis session cluster on every single HTTP request; under heavy load, auth queries overwhelmed the cache, adding 5-15ms of latency to every hop.",
        problem: "Modern distributed architectures require a compact, tamper-proof, self-contained credential that downstream microservices can cryptographically verify locally using an in-memory public key without performing remote database lookups.",
        shift: "**JWT (JSON Web Token): An open, industry-standard (RFC 7519) compact token format that encodes JSON claims signed with a cryptographic signature.** Comprising Header, Payload, and Signature segments, JWTs provide stateless, verifiable identity propagation across distributed microservices."
      },

      num: {
        t: "Cryptographic Token Formats & Signature Schemes: Comparative Analysis",
        h: ["Format / Algorithm", "Cryptographic Scheme", "Public Key Verification?", "Relative Verification CPU Cost", "Primary Production Domain"],
        r: [
          ["JWT HS256", "Symmetric HMAC-SHA256", "No (shared symmetric secret)", "Extremely low (~0.05ms)", "Single monolithic backend, private trusted service pairs"],
          ["JWT RS256", "Asymmetric RSA-256 (PKCS #1 v1.5)", "Yes (verifies with public key)", "Moderate (~0.5ms RSA verification)", "Public API identity providers (Auth0, Okta, Firebase)"],
          ["JWT ES256", "Asymmetric ECDSA (NIST P-256)", "Yes (verifies with public key)", "Low (~0.2ms, shorter key/sig)", "High-performance mobile and modern web auth"],
          ["JWT Ed25519 (EdDSA)", "Asymmetric Edwards-curve", "Yes (verifies with public key)", "Extremely low (~0.1ms, collision-proof)", "Modern zero-trust infrastructure, SSH tokens"],
          ["PASETO (Platform-Agnostic)", "Pre-chosen modern primitives (XChaCha20, Ed25519)", "Yes (V2/V4 Public)", "Extremely low (immune to alg: none attacks)", "Next-generation secure token architecture"]
        ],
        n: "A JWT consists of three base64url-encoded parts delimited by periods (`header.payload.signature`). The **Header** specifies the algorithm (`alg: \"RS256\"`) and key identifier (`kid`); the **Payload** contains registered claims (`sub: user_id`, `iss: issuer`, `aud: audience`, `exp: expiration`, `iat: issued_at`) and custom claims (roles, tenant ID); the **Signature** is calculated over `base64url(header) + \".\" + base64url(payload)` using the private key. Because JWT payloads are merely base64url-encoded and **not encrypted**, any party holding the token can inspect all claims in cleartext. The fundamental operational trade-off of JWTs is **statelessness versus instant revocability**: once issued, a JWT is valid until `exp` expires. Robust systems issue short-lived access tokens (5-15 minutes) paired with stateful refresh tokens, or maintain an in-memory Redis token revocation list / user token version counter."
      },

      miss: [
        {
          w: "JWT payloads are encrypted and completely secret from client inspection.",
          r: "JWT payloads are **signed, not encrypted** (JWS). The base64url payload can be decoded trivially by anyone with access to the string (e.g., at jwt.io). **Never store passwords, API secrets, or PII inside a JWT payload** unless using JSON Web Encryption (JWE)."
        },
        {
          w: "The server should automatically verify tokens using whichever algorithm is declared in the token header.",
          r: "This creates the catastrophic **`alg: none` or Algorithm Confusion vulnerability**: an attacker can modify the header to `\"alg\": \"none\"` or change RS256 to HS256 (using the server's public key as an HMAC secret). **The verification server must explicitly whitelist and enforce allowed algorithms** (e.g., `algorithms: ['RS256']`)."
        },
        {
          w: "Stateless JWTs mean the server never needs to store session state anywhere.",
          r: "Stateless JWTs cannot be revoked if a user logs out, changes their password, or has their account compromised before `exp`. Real-world production architectures require stateful refresh tokens in a database or an in-memory Redis blocklist for revoked token IDs (`jti`)."
        },
        {
          w: "JWTs are compact enough to store all user permissions, organization data, and metadata.",
          r: "Every claim added to a JWT inflates its string length. Because JWTs are transmitted in HTTP `Authorization` headers on every single request, bloated tokens degrade network performance and exceed web server header size limits (e.g., NGINX 8KB `large_client_header_buffers`)."
        }
      ],

      trade: {
        buys: [
          "Zero-lookup local verification: microservices verify signatures in-memory using public keys without querying a database.",
          "Stateless horizontal scaling: identity verification scales linearly across hundreds of gateway and service instances.",
          "Federated trust delegation: third-party identity providers (Auth0, Cognito, Okta) issue verifiable claims to independent resource servers.",
          "Standardized payload claims: uniform token semantics (`sub`, `iss`, `exp`) across heterogeneous programming languages."
        ],
        costs: [
          "Revocation complexity: revoking compromised tokens before expiration requires stateful token versioning or blocklists.",
          "Network payload overhead: base64-encoded cryptographic signatures add 500-2,000 bytes to every HTTP request header.",
          "Cryptographic verification CPU: high-throughput gateways spend noticeable CPU cycles verifying RSA/ECDSA mathematical signatures.",
          "Algorithm misconfiguration risks: flawed library defaults enable `alg: none` and key substitution attacks if unpinned."
        ],
        avoid: [
          "Never place sensitive secrets, credit card numbers, or passwords inside unencrypted JWT payloads.",
          "Never trust the `alg` header supplied in the incoming JWT; always hardcode expected algorithms in the verification options.",
          "Never issue JWT access tokens with long lifetimes (e.g., days or weeks); enforce 5-15 minute expirations.",
          "Never store JWT access tokens in browser `localStorage`; use `HttpOnly`, `Secure`, `SameSite=Strict` cookies or memory."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "oauth-2-0",

      why: {
        before: "Third-party applications requiring integration (e.g., a photo printing service accessing your Google Drive) demanded users provide their actual Google username and password directly into the third-party app's login form.",
        problem: "Sharing primary user credentials grants third-party apps unlimited access to the entire account (email, files, settings), prevents granular permission scoping, exposes credentials to theft by untrusted developers, and leaves users unable to revoke access without changing their master password.",
        shift: "**OAuth 2.0: An open authorization framework (RFC 6749) that enables a third-party application to obtain limited, delegated access to a protected HTTP resource on behalf of a user.** By separating user authentication from resource authorization, OAuth 2.0 issues scoped access tokens without exposing user credentials."
      },

      num: {
        t: "OAuth 2.0 Grant Types & Architectural Workflows (RFC 6749 & RFC 7636)",
        h: ["Grant Type", "Client Architecture", "Client Secret Required?", "User Consent Interaction", "Optimal Production Domain"],
        r: [
          ["Authorization Code + PKCE", "Single Page Apps (React/Vue), Mobile Apps, Web Apps", "No for public clients (PKCE protects flow)", "Yes (interactive browser login & consent)", "Standard web, mobile, and desktop client integrations"],
          ["Client Credentials", "Machine-to-machine (M2M) backend microservices", "Yes (backend holds secure client secret)", "No (service acts on its own behalf)", "Internal microservices, daemon jobs, automated batch scripts"],
          ["Refresh Token Grant", "Native mobile apps, confidential server-side web apps", "Yes for confidential; No for public with PKCE", "No (silent background token refresh)", "Extending user sessions without requiring re-login"],
          ["Device Authorization (RFC 8628)", "Smart TVs, IoT devices, CLI developer tools (`gh auth`)", "No (secondary device login via short code)", "Yes (user enters code on mobile/browser)", "Input-constrained devices, terminal command-line tools"],
          ["Implicit Grant (Deprecated)", "Legacy browser SPAs without backend servers", "No (returns access token in URL hash)", "Yes (interactive browser redirect)", "DEPRECATED by OAuth 2.1 Security BCP; do not use"]
        ],
        n: "OAuth 2.0 defines four fundamental roles: (1) **Resource Owner** (the end user), (2) **Client** (the third-party application), (3) **Authorization Server** (the server issuing tokens, e.g., Google Accounts), and (4) **Resource Server** (the API serving protected data, e.g., Google Drive API). The modern standard flow is the **Authorization Code Flow with PKCE (Proof Key for Code Exchange, RFC 7636)**. The client generates a cryptographically random secret string (`code_verifier`) and computes its SHA-256 hash (`code_challenge`). The client redirects the user to the authorization server with the challenge. After user consent, the auth server returns an ephemeral authorization code. The client exchanges this code alongside the raw `code_verifier` for an access token. This completely prevents authorization code interception attacks on public mobile and single-page apps."
      },

      miss: [
        {
          w: "OAuth 2.0 is an authentication protocol used to log users into websites.",
          r: "OAuth 2.0 is strictly an **Authorization Delegation Protocol**, not an authentication protocol. An OAuth access token indicates permission to access an API, not *who* the user is. **OpenID Connect (OIDC)** was created as an identity layer on top of OAuth 2.0 to handle authentication."
        },
        {
          w: "Mobile applications and React SPAs should store a client_secret to communicate with OAuth servers.",
          r: "Public clients (mobile apps, browser JavaScript) cannot keep a secret safe; compiled code and network requests can be inspected by anyone. Public clients **must use Authorization Code with PKCE and never contain a hardcoded `client_secret`**."
        },
        {
          w: "The Implicit Grant flow is the standard way to implement OAuth in browser Single-Page Applications.",
          r: "The Implicit Grant is **deprecated and forbidden in modern OAuth 2.1 specifications**. Returning access tokens directly in URL fragments exposes them to browser history, referrer headers, and access token injection attacks. Use Authorization Code with PKCE."
        },
        {
          w: "Scopes in OAuth 2.0 enforce fine-grained database row-level permissions.",
          r: "OAuth scopes represent **coarse-grained delegated boundaries** (e.g., `read:calendar`, `write:contacts`). They do not enforce internal enterprise business rules (e.g., 'can edit calendar entries only between 9am and 5pm for team X'), which must be enforced by resource server authorization logic."
        }
      ],

      trade: {
        buys: [
          "Credential isolation: users never expose their primary master passwords to third-party applications.",
          "Granular permission scoping: users grant minimal necessary permissions (read-only calendar) without full account access.",
          "Independent token revocation: users can revoke access for an individual application without altering their password.",
          "Standardized ecosystem integration: uniform integration interface across thousands of external SaaS platforms."
        ],
        costs: [
          "Protocol complexity: implementing redirect flows, state parameters, PKCE challenges, and token refreshes requires extensive engineering.",
          "Multiple network round-trips: token acquisition requires redirects, consent dialogs, code exchanges, and refresh requests.",
          "Token lifecycle management: resource servers and clients must handle token expiration, refresh concurrency, and clock skew.",
          "Security failure surface: state parameter omissions, open redirectors, and unvalidated redirect URIs introduce high-severity vulnerabilities."
        ],
        avoid: [
          "Never use the deprecated Implicit Flow for single-page applications or mobile apps; use Auth Code with PKCE.",
          "Never omit the cryptographically random `state` parameter in authorization requests; omitting it exposes users to CSRF attacks.",
          "Never accept arbitrary wildcards in registered redirect URIs; enforce exact matching to prevent token exfiltration.",
          "Never embed confidential `client_secret` values inside mobile application binaries or frontend JavaScript files."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "openid-connect",

      why: {
        before: "Developers attempted to use plain OAuth 2.0 access tokens for user authentication ('Log in with Facebook/Google'); applications lacked a standardized token describing the user, resulting in proprietary API hacks, unvalidated token exchanges, and widespread account-takeover vulnerabilities.",
        problem: "Modern web and mobile applications need a standardized, cryptographically verifiable identity layer that securely proves a user has authenticated, provides their verified profile attributes (subject ID, email, name), and informs the client how and when the authentication occurred.",
        shift: "**OpenID Connect (OIDC): An identity authentication layer built directly on top of the OAuth 2.0 framework.** By introducing the standardized **ID Token** (a cryptographically signed JWT) and Discovery endpoints, OIDC provides universal, secure Single Sign-On and identity federation."
      },

      num: {
        t: "OpenID Connect Tokens & Artifacts: Operational Anatomy",
        h: ["Artifact", "Format & Standards", "Intended Recipient / Audience", "Lifespan", "Primary Security Purpose"],
        r: [
          ["ID Token", "Signed JWT (RFC 7519)", "The Client Application (Frontend / Backend)", "Short (typically 5 to 60 minutes)", "Proves authentication event, supplies identity claims (`sub`, `email`)"],
          ["Access Token", "Opaque string or signed JWT", "The Resource Server (API endpoints)", "Short (typically 5 to 60 minutes)", "Authorizes API requests at protected resource servers"],
          ["Refresh Token", "Opaque cryptographic string", "The Authorization Server", "Long (days to months)", "Obtains fresh ID and Access Tokens without user re-authentication"],
          ["UserInfo Endpoint", "JSON payload over HTTPS", "The Client Application", "N/A (live HTTP endpoint)", "Returns rich identity profile claims using valid Access Token"],
          ["Discovery Document", "`/.well-known/openid-configuration`", "All Clients & Gateways", "Cacheable (hours to days)", "Publishes issuer, endpoints, and JWKS URI for auto-configuration"]
        ],
        n: "OpenID Connect extends OAuth 2.0 by introducing the `openid` scope and the **ID Token**. While the OAuth Access Token is an opaque authorization credential meant exclusively for the Resource Server API, the OIDC ID Token is a signed JWT meant exclusively for the **Client Application**. The ID Token contains verified claims: `iss` (Identity Provider issuer URL), `sub` (unique immutable subject identifier), `aud` (client ID of the application), `exp` (expiration), `iat` (issued at), and `nonce` (cryptographic nonce mitigating replay attacks). Clients validate ID Tokens against the identity provider's published public keys located at the **JSON Web Key Set (JWKS)** endpoint discovered via `/.well-known/openid-configuration`."
      },

      miss: [
        {
          w: "An Access Token and an ID Token are interchangeable and can be used for the same purpose.",
          r: "This is a **critical security misunderstanding**. The **ID Token is for the client application** to consume identity information. The **Access Token is for the API (resource server)** to authorize requests. Sending an ID Token as a bearer token to an API violates security boundaries."
        },
        {
          w: "Validating an ID Token only requires checking that the JWT is not expired.",
          r: "A secure ID Token validation MUST verify: (1) cryptographic signature against the provider's JWKS, (2) `iss` matches expected issuer, (3) `aud` matches the client's application ID, (4) `exp` is in the future, and (5) `nonce` matches the nonce generated during the initial request."
        },
        {
          w: "The `sub` (subject) claim and the user's `email` are equally reliable as primary database user identifiers.",
          r: "Emails change, can be recycled by domain providers, or may remain unverified. The **`sub` claim is the only immutable, unique identifier** guaranteed by the OIDC specification for a given identity provider. User accounts should be keyed to `(issuer, sub)`."
        },
        {
          w: "OIDC requires manually updating client configuration whenever an identity provider rotates its signing keys.",
          r: "OIDC features standard **JWKS key rotation**: clients cache keys from the identity provider's `jwks_uri` and dynamically fetch updated keys when an incoming ID Token carries an unrecognized `kid` (key ID) header."
        }
      ],

      trade: {
        buys: [
          "Universal SSO interoperability: allows applications to implement Google, Microsoft, Apple, and enterprise Okta logins identically.",
          "Zero password liability: client applications never store, salt, hash, or manage end-user passwords.",
          "Tamper-proof client-side identity: ID Tokens prove user identity cryptographically without requiring database round-trips.",
          "Automated provider configuration: the discovery document (`.well-known/openid-configuration`) automates client setup."
        ],
        costs: [
          "Vendor dependency: outages at identity providers (e.g., Google or Azure AD) prevent users from accessing the application.",
          "Identity mapping complexity: linking accounts across multiple social/enterprise identity providers (e.g., merging Google and GitHub) is error-prone.",
          "Token verification overhead: clients must fetch, cache, and rotate JWKS keys and perform asymmetric cryptographic validation.",
          "Data privacy constraints: relying on third-party identity providers leaks user login activity metadata to the provider."
        ],
        avoid: [
          "Never pass the ID Token to backend resource servers as an API authorization credential; pass the Access Token.",
          "Never identify users in your local database using `email` without verifying the `email_verified: true` claim.",
          "Never omit `nonce` verification in hybrid and authorization flows; omitting `nonce` allows replay attacks.",
          "Never hardcode identity provider public keys in application code; fetch dynamically from the provider's `jwks_uri`."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "single-sign-on",

      why: {
        before: "Enterprises forced employees to maintain distinct usernames and passwords across 50+ corporate tools (Slack, Jira, Salesforce, AWS, HR portal); users reused weak passwords or wrote them on sticky notes, while IT took weeks to revoke access when employees departed.",
        problem: "Organizations require centralized identity governance where an employee authenticates once against a single authoritative Identity Provider (IdP), enforcing uniform Multi-Factor Authentication (MFA) and enabling instant, organization-wide access termination upon offboarding.",
        shift: "**Single Sign-On (SSO): An authentication scheme that allows a user to log in with a single set of credentials and access multiple independent software applications.** Operating via protocols like SAML 2.0 and OIDC, SSO establishes centralized trust between Identity Providers and Service Providers."
      },

      num: {
        t: "Enterprise SSO Protocols: SAML 2.0 vs OIDC / OAuth 2.0",
        h: ["Dimension", "SAML 2.0 (Security Assertion Markup)", "OpenID Connect (OIDC)", "WS-Federation", "Kerberos / SPNEGO"],
        r: [
          ["Data Interchange Format", "Signed XML documents (`<saml:Assertion>`)", "JSON / Signed JWTs", "XML SOAP Envelopes", "Binary ticket payloads"],
          ["Transport Mechanism", "HTTP POST binding via browser redirects", "REST HTTPS redirects & direct POSTs", "HTTP POST / SOAP redirects", "Direct TCP/UDP (Port 88) on corporate LAN"],
          ["Client Compatibility", "Web browsers only (poor mobile/SPA support)", "Native mobile apps, modern SPAs, web APIs", "Legacy Windows enterprise environments", "Desktop domain-joined workstations (Active Directory)"],
          ["Configuration Complexity", "High (X.509 certificates, XML metadata exchange)", "Low (JSON discovery endpoints, client ID/secret)", "Very High (complex WS-* specifications)", "High (domain controllers, Key Distribution Center)"],
          ["Dominant Enterprise Domain", "Traditional enterprise B2B SaaS (Okta, Ping, Salesforce)", "Modern cloud SaaS, consumer SSO, mobile apps", "Legacy Microsoft SharePoint & ADFS", "Internal on-premise Windows network logins"]
        ],
        n: "In SSO architecture, the **Identity Provider (IdP)** (e.g., Okta, Microsoft Entra ID, Ping Identity) manages user credentials, credentials directories (LDAP, Active Directory), and MFA enforcement. The **Service Provider (SP)** (e.g., Salesforce, GitHub Enterprise, your SaaS app) delegates authentication to the IdP. In an **SP-initiated flow**, when a user navigates to `app.com`, the SP redirects the browser to the IdP. The user logs in and solves MFA. The IdP generates a cryptographically signed assertion (SAML response or OIDC ID Token) and posts it back to the SP's Assertion Consumer Service (ACS) endpoint. Automated user lifecycle management is handled via **SCIM (System for Cross-domain Identity Management)**, allowing the IdP to provision and de-provision user records automatically."
      },

      miss: [
        {
          w: "Single Sign-On and Same Sign-On mean the exact same thing.",
          r: "**Same Sign-On** means a user uses the same password across multiple systems, but must log into each system individually. **Single Sign-On (SSO)** means the user authenticates *once* at the central IdP, and is automatically authenticated across all participating systems without re-entering credentials."
        },
        {
          w: "SSO completely eliminates the need for applications to manage authorization roles and permissions.",
          r: "SSO verifies only **authentication** (who the employee is). While IdP assertions can transmit coarse group memberships (`groups: ['engineers']`), the target application must still maintain internal authorization logic to determine exact resource permissions."
        },
        {
          w: "SAML SSO is outdated and has been completely replaced by OpenID Connect in all modern systems.",
          r: "While OIDC is preferred for modern cloud applications, **SAML 2.0 remains the dominant enterprise B2B standard**. Large corporations and government entities overwhelmingly mandate SAML 2.0 integration for enterprise SaaS procurement."
        },
        {
          w: "Centralizing authentication with SSO introduces an unacceptable single point of failure without remedy.",
          r: "While IdP outages can block logins, enterprise architectures mitigate this by enforcing highly resilient IdP SLAs (99.99%+), maintaining emergency **break-glass administrator accounts** with direct local credentials, and utilizing long-lived sessions for active users."
        }
      ],

      trade: {
        buys: [
          "Instant employee offboarding: terminating an employee's IdP account immediately severs access across all corporate applications.",
          "Centralized security governance: enforce enterprise-wide MFA, conditional access (IP whitelists, device health), and password policies in one place.",
          "Dramatically reduced password fatigue: users remember only one primary credential, drastically reducing phishing vulnerability.",
          "Automated user provisioning: SCIM integration automatically creates, updates, and archives user accounts in downstream SaaS apps."
        ],
        costs: [
          "Concentration of risk: a compromised IdP master account or session grants an attacker access to every integrated corporate application.",
          "IdP outage blast radius: an outage at the primary identity provider halts authentication across the entire company.",
          "Complex protocol implementation: parsing XML signatures (SAML) and handling certificate rotations requires specialized libraries.",
          "Enterprise pricing friction: SaaS vendors frequently lock SSO integration behind expensive 'Enterprise' pricing tiers (the 'SSO tax')."
        ],
        avoid: [
          "Never implement SAML XML parsing from scratch; XML signature wrapping (XSW) attacks are subtle and dangerous; use battle-tested libraries.",
          "Never lock your operations out of critical infrastructure; always maintain secure, monitored 'break-glass' local admin credentials.",
          "Never omit signature verification on SAML assertions and OIDC identity tokens.",
          "Never ignore user deprovisioning webhooks (SCIM); failing to process deprovisioning leaves orphaned access open in SaaS tools."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "session",

      why: {
        before: "HTTP was engineered as a purely stateless request-response protocol; early web servers treated every request as completely independent, making it impossible to maintain shopping carts, multi-step checkout forms, or logged-in user profiles.",
        problem: "Web applications need to preserve continuous conversational state across multiple HTTP requests without trusting the client to store and report its own sensitive server-side state or permissions.",
        shift: "**Session: A server-side state mechanism that associates a sequence of HTTP requests with an authenticated user via an opaque identifier stored in an HTTP cookie.** By isolating authoritative state on the server, sessions enable instant revocation, fine-grained lifecycle control, and tamper-proof security."
      },

      num: {
        t: "Session Storage Architectures: Operational Comparison",
        h: ["Storage Medium", "Horizontal Scalability", "Revocation Speed", "Max Payload Capacity", "Latency per Request"],
        r: [
          ["Server Local Memory (Sticky Sessions)", "Poor (requires sticky sessions on load balancer)", "Instant (process memory deletion)", "High (limited only by server RAM)", "Extremely low (<0.01ms in-process)"],
          ["Distributed In-Memory (Redis / Memcached)", "Excellent (any node reads from shared cluster)", "Instant (delete key `session:id` in Redis)", "High (kilobytes to megabytes per session)", "Very low (0.5ms - 1.5ms network round-trip)"],
          ["Relational Database (PostgreSQL / MySQL)", "Good (backed by DB connection pool)", "Instant (`DELETE FROM sessions WHERE id = $1`)", "Very High (gigabytes across table)", "Moderate (2ms - 5ms database query)"],
          ["Encrypted Client Cookie (Cookie Session)", "Infinite (zero server storage)", "Impossible without server-side revocation list", "Strict 4KB browser cookie limit", "Zero server I/O (CPU decryption only)"]
        ],
        n: "The classical session lifecycle proceeds as follows: upon successful authentication, the server generates a cryptographically secure random session ID (minimum 128 bits of entropy using CSPRNG, e.g., `/dev/urandom` or `crypto.randomBytes`). The server stores session data in a distributed cache (such as Redis) keyed by this ID and sets an HTTP response header: `Set-Cookie: sid=abc123xyz; HttpOnly; Secure; SameSite=Lax; Path=/`. On subsequent requests, the browser automatically transmits the cookie in the `Cookie` header. The server reads the ID, queries Redis, and populates the request context. To prevent **Session Fixation attacks**, the server must destroy the existing session ID and generate a brand-new ID immediately upon user privilege escalation (such as logging in)."
      },

      miss: [
        {
          w: "Storing session IDs in cookies is inherently insecure compared to storing them in JavaScript variables.",
          r: "JavaScript variables and `localStorage` are vulnerable to Cross-Site Scripting (XSS) token extraction. A session ID stored in a cookie marked **`HttpOnly` cannot be read by JavaScript**, providing the strongest defense against credential theft."
        },
        {
          w: "Session state can safely be stored in web server process memory when scaling behind a load balancer.",
          r: "Process-local memory requires **Sticky Sessions** (session affinity) at the load balancer. If an instance crashes, restarts, or auto-scales down, all connected users are forcibly logged out, and traffic cannot be balanced evenly across the cluster. Distributed backends **must use shared session stores (Redis)**."
        },
        {
          w: "Once a session cookie expires in the browser, the server session is automatically destroyed.",
          r: "The browser simply stops sending the cookie. If the backend fails to enforce a corresponding **Time-To-Live (TTL)** in its database or Redis store, the orphaned session record persists forever, consuming memory and remaining vulnerable to replay attacks if captured."
        },
        {
          w: "A user logging out only requires deleting the cookie on the client side.",
          r: "Client-side cookie deletion leaves the session alive on the server. If an attacker stole the session ID prior to logout, they can continue using it indefinitely. **Logout must explicitly destroy the session record in Redis/DB**."
        }
      ],

      trade: {
        buys: [
          "Instant, authoritative revocation: deleting the session key in Redis instantly logs out the user across all devices.",
          "XSS theft mitigation: `HttpOnly` cookies prevent malicious client-side JavaScript from reading the session identifier.",
          "Zero client payload bloat: only a lightweight opaque ID travels over the network, keeping request headers minimal.",
          "Dynamic state modification: servers can mutate user permissions or update cart contents immediately without client token regeneration."
        ],
        costs: [
          "Infrastructure storage dependency: requires managing and scaling a high-availability distributed datastore (Redis cluster).",
          "Latency overhead: every incoming HTTP request requires an additional network I/O lookup to the session store.",
          "CSRF vulnerability: browser cookie auto-attachment exposes endpoints to Cross-Site Request Forgery unless mitigated by `SameSite` or CSRF tokens.",
          "Multi-domain friction: sharing cookies across distinct top-level domains (`app.com` and `api.io`) requires complex proxying or CORS setups."
        ],
        avoid: [
          "Never create session IDs using sequential numbers, timestamps, or predictable algorithms; use a CSPRNG.",
          "Never set session cookies without the `HttpOnly` and `Secure` attributes.",
          "Never retain the same session ID after a user logs in; regenerate the session ID to defeat session fixation.",
          "Never store giant data blobs (files, full database records) in session storage; store only user identifiers and minimal auth flags."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "api-gateway",

      why: {
        before: "Microservice backends exposed dozens of internal services directly to the public internet; frontend web and mobile clients made separate network calls to 20 different service hostnames, each requiring independent authentication, rate limiting, and CORS management.",
        problem: "Exposing internal microservices directly leaks internal network topology, forces heterogeneous services to duplicate boilerplate cross-cutting concerns (auth, logging, rate limiting, TLS termination), and degrades mobile performance due to high network round-trip waterfalls.",
        shift: "**API Gateway: A centralized architectural component that acts as the single reverse-proxy entry point for all external client requests entering a microservice ecosystem.** Offloading cross-cutting concerns and providing protocol translation, the API gateway isolates internal services from external consumers."
      },

      num: {
        t: "API Gateway Architectures: Operational Comparison",
        h: ["Gateway Technology", "Underlying Core Engine", "Dynamic Configuration Control Plane", "Throughput / P99 Latency Overhead", "Optimal Production Deployment"],
        r: [
          ["Kong Gateway", "NGINX + OpenResty (Lua) / Go", "Declarative DB-less or PostgreSQL", "Extremely high / <1.5ms overhead", "Enterprise multi-cloud, REST/gRPC API traffic management"],
          ["Envoy Proxy", "C++ (Event-driven, non-blocking)", "gRPC dynamic xDS discovery APIs", "Maximum / <0.5ms overhead", "Service mesh ingress, high-performance microservice clusters"],
          ["Traefik", "Go", "Native Docker / Kubernetes CRDs", "High / ~2ms overhead", "Kubernetes-native edge ingress, dynamic container environments"],
          ["AWS API Gateway", "Proprietary managed cloud service", "AWS CloudFormation / Console", "Moderate / 10-30ms overhead", "Serverless architectures (AWS Lambda + DynamoDB)"],
          ["Spring Cloud Gateway", "Java (Netty / Project Reactor)", "Spring Cloud Config", "Moderate / ~5ms overhead", "Enterprise Java / Spring Boot microservice ecosystems"]
        ],
        n: "An API Gateway operates at Layer 7 of the OSI model, orchestrating several critical cross-cutting capabilities: (1) **Request Routing & Path Rewriting** (mapping `/api/v1/orders` to internal Kubernetes service `orders-svc.internal:8080`), (2) **Edge Authentication & JWT Validation** (terminating client auth, verifying signatures once at the edge, and injecting verified identity headers `X-User-Id` downstream), (3) **Global Rate Limiting & Throttling**, (4) **SSL/TLS Termination**, (5) **Protocol Translation** (e.g., transcoding external JSON/HTTP REST into internal high-performance gRPC/Protobuf), and (6) **Distributed Tracing Header Injection** (`traceparent`). In advanced setups, the **Backend-for-Frontend (BFF)** pattern deploys dedicated gateways tailored to specific client form factors (mobile vs desktop web)."
      },

      miss: [
        {
          w: "An API Gateway is just another name for a standard reverse proxy like NGINX.",
          r: "While built on reverse-proxy foundations, an API Gateway provides **specialized API management capabilities**: dynamic service discovery, programmatic plugin filters (Lua/Wasm), JWT signature validation, distributed rate limiting, API key quotas, and OpenAPI schema validation."
        },
        {
          w: "Business logic and database transformations should be placed inside the API Gateway to save service code.",
          r: "Placing domain business logic in the gateway is a **devastating anti-pattern** (the 'Smart Proxy' anti-pattern). It couples the gateway to internal domain schemas, creates an unmaintainable organizational bottleneck, and turns the gateway into an unstable distributed monolith."
        },
        {
          w: "Every microservice architecture requires a heavyweight API Gateway from day one.",
          r: "Small architectures with only 2-3 services incur unnecessary operational complexity and latency by deploying complex gateways. A simple NGINX reverse proxy or cloud load balancer is sufficient until team count and service numbers scale."
        },
        {
          w: "The API Gateway completely eliminates the need for internal microservices to check authorization.",
          r: "Relying solely on edge gateway authentication creates a **Zero-Trust violation**. If an attacker penetrates the perimeter or compromises an internal service, they can invoke internal services unrestricted. Services must still validate identity and authorization context."
        }
      ],

      trade: {
        buys: [
          "Centralized cross-cutting concerns: implement auth, TLS, rate limiting, and CORS once at the edge instead of in every service.",
          "Internal topology isolation: backend services can be rewritten, relocated, or split without altering external client URLs.",
          "Optimized client network traffic: request aggregation and BFF patterns combine multiple backend calls into single client responses.",
          "Protocol translation: enables exposing user-friendly JSON/REST externally while using high-speed gRPC internally."
        ],
        costs: [
          "Single point of failure: an outage or misconfiguration at the API gateway brings down all external communication.",
          "Network latency hop: adds 1-5ms of processing and network traversal latency to every external request.",
          "Operational maintenance: managing routing rules, plugin lifecycles, and high-availability gateway clusters requires dedicated infrastructure ops.",
          "Deployment bottleneck: if multiple teams share a single monolithic gateway config, release coordination becomes contentious."
        ],
        avoid: [
          "Never embed domain business logic, SQL queries, or complex business rules inside gateway filters.",
          "Never run an API Gateway as a single instance; always deploy multiple redundant instances behind a Layer 4 load balancer.",
          "Never expose raw internal service hostnames, ports, or error traces directly to external callers through the gateway.",
          "Never disable distributed tracing propagation at the gateway; always generate or propagate `traceparent` headers."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "monolith",

      why: {
        before: "Teams fragmented new software projects into 20 microservices before understanding business domains, resulting in crushing operational overhead: distributed transactions failed, network latency skyrocketed, local development required 16GB Docker environments, and debugging required distributed tracing.",
        problem: "Software startups and early-stage enterprise products need rapid iteration speed, trivial refactoring capabilities, zero network-induced failure modes, and ACID transactional guarantees across the entire business domain.",
        shift: "**Monolith: An architectural pattern where all business logic, user interfaces, database access layers, and background jobs are packaged, built, and deployed as a single unified executable.** Maximizing developer velocity and eliminating network boundaries, the monolith is the gold standard foundation for software systems."
      },

      num: {
        t: "Monolith vs Microservices: Operational Mechanics Comparison",
        h: ["Dimension", "Classical Monolith", "Modular Monolith", "Microservices Architecture", "Serverless FaaS"],
        r: [
          ["Deployment Unit", "Single unified binary / container", "Single binary with strict module boundaries", "Dozens to hundreds of independent containers", "Hundreds of individual ephemeral functions"],
          ["Inter-Module Communication", "In-process memory call (<0.001ms)", "In-process memory call (<0.001ms)", "Network RPC / HTTP / gRPC (1-10ms)", "HTTP / Event Bus / Queue (10-50ms)"],
          ["Transactional Integrity", "ACID transactions across entire DB", "ACID within module; events across modules", "BASE / Saga pattern / Eventual consistency", "Distributed Saga / Two-Phase Commit"],
          ["Local Developer Setup", "Single `git clone` & `npm run dev`", "Single repository, simple test runners", "Complex Docker Compose / Minikube setup", "Cloud emulators or remote dev environments"],
          ["Team Scaling Bottleneck", "Merge conflicts on shared codebase", "Low (clear code-ownership directories)", "Low (autonomous team deployments)", "Low (autonomous function deployments)"]
        ],
        n: "In a monolith, all components execute within the same operating system process and memory space. When the billing module invokes the shipping module, it executes an in-process function call via CPU registers and stack memory, completing in nanoseconds with zero risk of partial network failure, dropped packets, or serialization overhead. Database operations share a single connection pool and can execute within a unified **ACID transaction** (`BEGIN ... COMMIT`), guaranteeing data consistency. To prevent the monolith from degenerating into an unmaintainable 'Big Ball of Mud', modern engineering enforces a **Modular Monolith**: strict internal architectural boundaries (using Domain-Driven Design, bounded contexts, and internal package encapsulation) where modules communicate solely through defined interfaces, allowing future extraction into microservices only when specific scaling bottlenecks emerge."
      },

      miss: [
        {
          w: "Monolithic architecture cannot scale to handle high traffic or large user bases.",
          r: "Monoliths scale exceptionally well **horizontally**: you simply deploy multiple identical instances of the monolithic container behind a Layer 4/7 load balancer. Giant platforms like Shopify, GitHub, Basecamp, and Stack Overflow process billions of requests daily using monolithic codebases."
        },
        {
          w: "Microservices are modern and inherently superior to monoliths for all new projects.",
          r: "Adopting microservices before product-market fit is the **number one cause of startup technical bankruptcy**. Microservices introduce distributed state, network latency, eventual consistency bugs, deployment sprawl, and complex observability needs that cripple small engineering teams."
        },
        {
          w: "A monolithic architecture forces you to write spaghetti code without structure.",
          r: "Code quality is an organizational and discipline issue, not an architectural unit issue. A **Modular Monolith** enforces strict encapsulation, domain boundaries, and isolated schemas within a single deployable artifact, maintaining clean architecture without network overhead."
        },
        {
          w: "You cannot scale individual compute-heavy features in a monolith independently.",
          r: "Compute-heavy or memory-intensive tasks (such as image resizing or video encoding) should not run synchronously inside web processes in *any* architecture. In a monolith, these tasks are offloaded to **asynchronous background worker queues** (Sidekiq, BullMQ, Celery) scaling independently."
        }
      ],

      trade: {
        buys: [
          "Maximum developer velocity: single repository, instantaneous full-stack search, and one-command local environment setup.",
          "Zero network latency overhead: internal domain calls execute in nanoseconds as native CPU function calls.",
          "Rock-solid ACID transactions: database updates across multiple business domains succeed or roll back atomically.",
          "Operational simplicity: single CI/CD pipeline, unified logging, simple monitoring, and zero distributed tracing complexity."
        ],
        costs: [
          "Shared blast radius: an unhandled fatal error, memory leak, or infinite loop in one module can crash the entire application process.",
          "Deployment contention: large teams (100+ engineers) contend for the deployment pipeline, risking merge conflicts and deployment queues.",
          "Uniform technology stack: the entire application is bound to a single primary programming language and framework ecosystem.",
          "Longer build and test times: as the codebase expands to millions of lines of code, CI test suites can take 30+ minutes to execute."
        ],
        avoid: [
          "Never build microservices on day one for a new product; build a clean modular monolith first.",
          "Never allow unrestricted direct cross-module database table joins in a modular monolith; enforce module API boundaries.",
          "Never run heavy CPU-intensive background tasks synchronously on web request threads; offload to background queues.",
          "Never allow modules to import private internal implementation details of other modules; expose clear public interfaces."
        ]
      }
    }

  ]);

})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
