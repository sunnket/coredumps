/* Real-world examples and step-by-step flows — Backend & Architecture. */
TD.attach("backend-architecture", {

"API": {
 ex: { h: "The menu in a restaurant",
       b: "It lists what you may order and what you get back. You never walk into the kitchen. The menu is a promise the restaurant keeps even when they change supplier or rebuild the kitchen — which is exactly why breaking an API contract is so much worse than changing the code behind it." },
 fl: { t: "What an API contract actually promises",
       s: ["A consumer reads the documented interface",
           { s: "Endpoints, request shapes, response shapes, error codes", n: "Everything a caller may rely on." },
           { q: "Can you change the implementation freely?",
             y: "Yes — as long as the contract holds",
             n: "Changing a response field is a breaking change, however small it looks" },
           "Version the contract; you cannot recall the clients already using it"] }
},

"REST": {
 ex: { h: "A well-organised filing system with standard verbs",
       b: "Every resource has an address, and there are only a handful of things you can do to one: read it, create it, replace it, delete it. That constraint is the point — any client that understands HTTP already understands most of your API without reading a line of documentation." },
 fl: { t: "Designing a resource endpoint",
       s: ["Name the resource as a plural noun: `/orders`",
           { s: "Let the method supply the verb", n: "GET lists, POST creates, PUT replaces, PATCH updates, DELETE removes." },
           { s: "Identifiers go in the path, filters in the query", n: "`/orders/42?include=items`" },
           { q: "Tempted to add `/orders/42/cancel`?",
             y: "It is a verb — pragmatic and very common, but not strictly REST",
             n: "Model it as state: `PATCH /orders/42 {\"status\":\"cancelled\"}`" },
           "Version from day one — `/v1/` costs nothing now and saves a migration later"] }
},

"GraphQL": {
 ex: { h: "Ordering exactly the dishes you want, in one trip",
       b: "REST gives you fixed plates and you often take three trips to assemble a meal. GraphQL lets the client describe the shape it wants and get it in one request — which is wonderful for mobile clients and moves a great deal of complexity onto the server." },
 fl: { t: "One request, one tailored response",
       s: ["The client sends a query naming exactly the fields it wants",
           { s: "The server resolves each field", n: "Possibly across several data sources." },
           { q: "Does a field resolve per-item?",
             y: "The N+1 problem — one query becomes 500. Use DataLoader to batch",
             n: "The response mirrors the query shape exactly" },
           { s: "A malicious deep query can be very expensive", n: "Enforce depth and complexity limits." },
           "HTTP caching is harder — everything is a POST to one endpoint"] }
},

"gRPC": {
 ex: { h: "A private line between two offices with an agreed form",
       b: "Both sides generated their code from the same schema, so there is no guesswork about field names or types, and the messages are compact binary rather than verbose text. Excellent between your own services; awkward from a browser without a proxy." },
 fl: { t: "Where it fits",
       s: ["Define the service and messages in a `.proto` file",
           { s: "Generate client and server code in every language you use", n: "The contract is enforced by the compiler." },
           { q: "Who is calling?",
             y: "Another internal service — gRPC over HTTP/2 is fast and strongly typed",
             n: "A browser — you need grpc-web and a proxy; REST or GraphQL is simpler" },
           "Streaming in both directions comes for free, which REST cannot do"] }
},

"WebSocket": {
 ex: { h: "Leaving the phone line open",
       b: "Instead of hanging up and redialling for each sentence, the line stays open and either side can speak at any moment. That is what chat, live dashboards and collaborative editing need — and it means the server now holds state for every connected user." },
 fl: { t: "From HTTP to a persistent connection",
       s: ["The client sends an HTTP request with an Upgrade header",
           { s: "The server agrees and the connection switches protocol", n: "Same TCP connection, now full-duplex." },
           { q: "Do you actually need server-to-client push?",
             y: "Yes, and bidirectional — WebSocket is right",
             n: "One-way updates only? Server-sent events are simpler and reconnect automatically" },
           { s: "Connections drop — plan for reconnection and state resync", n: "And heartbeats, or proxies will close idle connections." },
           "Every connection consumes server memory — this changes how you scale"] }
},

"Server-Sent Events": {
 ex: { h: "A news ticker you subscribe to",
       b: "Updates flow one way, over ordinary HTTP, and the browser reconnects on its own if the line drops. For a live feed, a progress bar or streaming an LLM's tokens, it does everything a websocket would and needs none of the machinery." },
 fl: { t: "SSE or WebSocket?",
       s: ["You need the server to push updates",
           { q: "Does the client also need to send messages over the same channel?",
             y: "WebSocket — full duplex",
             n: "SSE — plain HTTP, automatic reconnection, far simpler" },
           { s: "SSE is text only and works through most proxies", n: "It is what LLM token streaming uses." },
           "Browsers cap SSE connections per domain on HTTP/1.1 — HTTP/2 removes that"] }
},

"Webhook": {
 ex: { h: "*Don't call us, we'll call you*",
       b: "Rather than polling a payment provider every ten seconds asking whether the money arrived, you give them a URL and they post to it when it does. The inversion is efficient — and it means you are now running a public endpoint that strangers can call." },
 fl: { t: "Receiving one safely",
       s: ["A provider POSTs an event to your URL",
           { q: "Is the signature valid?",
             y: "Verify it against the shared secret before doing anything else",
             n: "Reject — anyone on the internet can hit this endpoint" },
           { s: "Return 200 immediately and process asynchronously", n: "Providers time out fast and retry aggressively." },
           { q: "Have you seen this event id before?",
             y: "Ignore it — deliveries are at-least-once, so duplicates are normal",
             n: "Enqueue the work and acknowledge" }] }
},

"JSON": {
 ex: { h: "A shipping label everybody's system can read",
       b: "Not the prettiest format and universally understood, which beats elegance. Its gaps are worth knowing: no date type, no comments, and integers larger than 2⁵³ lose precision in JavaScript — which is why database ids so often travel as strings." },
 fl: { t: "The three things that catch people",
       s: ["An object is serialised to JSON",
           { q: "Does it contain a date?",
             y: "It becomes a string — use ISO 8601 in UTC and parse it back deliberately",
             n: "Does it contain a very large integer?" },
           { q: "Above 2⁵³?",
             y: "JavaScript will silently lose precision — send it as a string",
             n: "Watch for trailing commas and comments — both are invalid JSON" },
           "Validate against a schema at the boundary, before anything trusts it"] }
},

"XML": {
 ex: { h: "A legal document with numbered clauses and margins",
       b: "Verbose, heavily standardised, and genuinely good at things JSON never attempted — namespaces, schema validation, digital signatures, comments. Which is why finance, government and healthcare integrations are still full of it." },
 fl: { t: "Parsing it without opening a hole",
       s: ["You receive an XML document",
           { q: "Is it from an untrusted source?",
             y: "Disable external entity resolution — XXE is a serious, common vulnerability",
             n: "Validate against the XSD if one exists" },
           { s: "Namespaces make naive parsing fail", n: "Use a real parser, never regex." },
           "Billion laughs is the other classic attack — cap entity expansion"] }
},

"YAML": {
 ex: { h: "A form where the indentation is load-bearing",
       b: "Readable, and unforgiving: a tab instead of spaces breaks it, and the *Norway problem* — where `NO` parses as the boolean false — is real. Quote your strings, and validate the file rather than discovering the mistake in production." },
 fl: { t: "The traps that bite in CI",
       s: ["You edit a pipeline file",
           { q: "Did you use a tab anywhere?",
             y: "Invalid YAML — tabs are not permitted for indentation at all",
             n: "Check your unquoted scalars" },
           { s: "`yes`, `no`, `on`, `off` become booleans", n: "So does an unquoted country code `NO`." },
           { s: "`1.0` is a number; `1.10` is not the same as `1.1` as a string", n: "Version numbers must be quoted." },
           "Never `yaml.load()` untrusted input — use `safe_load`"] }
},

"Status Code": {
 ex: { h: "The stamp on a returned form",
       b: "APPROVED, WRONG OFFICE, NOT SIGNED, OUR SYSTEM IS DOWN. Reading it first tells you whose problem it is — and returning 200 with an error inside the body is why so many clients fail to notice anything went wrong at all." },
 fl: { t: "Choosing the right one",
       s: ["A request has been handled",
           { q: "Did it succeed?",
             y: "200, or 201 for a creation, or 204 for no content",
             n: "Whose fault is it?" },
           { q: "Bad input, missing auth, or no permission?",
             y: "400, 401 or 403 — the client can fix this",
             n: "404 if it does not exist; 409 for a conflict; 429 if rate limited" },
           { s: "5xx means you broke", n: "Never use 200 to report an error in the body." }] }
},

"Pagination": {
 ex: { h: "A search result that gives you ten at a time",
       b: "Nobody wants five million rows and no server wants to send them. The interesting part is what happens when data changes mid-browse: with page numbers, a deletion on page one shifts everything and you silently skip a record." },
 fl: { t: "Offset or cursor?",
       s: ["A collection is too large to return at once",
           { q: "Is the data changing while users page through it?",
             y: "Cursor-based — pass an opaque marker, and nothing is skipped or duplicated",
             n: "Offset is simpler, and fine for stable data and small offsets" },
           { s: "`OFFSET 100000` makes the database count 100,000 rows to skip them", n: "It gets slower the deeper you page." },
           "Always cap the page size — a client asking for 100,000 will try"] }
},

"API Versioning": {
 ex: { h: "Keeping the old phone number working after a move",
       b: "You cannot force every caller to update at once — some are mobile apps on phones nobody has updated in two years. So the old number keeps ringing while the new one takes over, and eventually you announce a date and mean it." },
 fl: { t: "Making a breaking change",
       s: ["You need to change a response shape",
           { q: "Is it additive?",
             y: "Add the new field — well-behaved clients ignore unknown fields",
             n: "Removing or renaming breaks callers — that needs a new version" },
           { s: "Run both versions side by side", n: "In the URL path or an Accept header." },
           { s: "Instrument usage of the old version", n: "You cannot deprecate what you cannot measure." },
           "Announce a sunset date, warn in headers, then actually turn it off"] }
},

"Rate Limiting": {
 ex: { h: "A doorman counting people per hour",
       b: "Not to be difficult — to stop the venue collapsing when one coach party arrives. Limits protect the service from a runaway client, a scraper, or your own retry loop, and they are far kinder than falling over for everybody." },
 fl: { t: "Handling and enforcing limits",
       s: ["A client exceeds the allowance",
           { s: "Return 429 with a `Retry-After` header", n: "Tell them when to come back." },
           { q: "You are the client receiving a 429?",
             y: "Back off exponentially with jitter — do not retry immediately",
             n: "Token bucket is the usual algorithm: refills steadily, allows bursts" },
           { s: "Limit per API key or per user, not per IP alone", n: "NAT puts thousands behind one address." },
           "Separate limits per endpoint — a search is not a health check"] }
},

"Authentication": {
 ex: { h: "Showing your passport at the desk",
       b: "It answers one question: who are you? It says nothing about what you are allowed to do — that is the next desk along. Conflating the two is why systems end up with an admin flag on the session and no idea who can do what." },
 fl: { t: "A login, end to end",
       s: ["User submits credentials over TLS",
           { s: "Look up the user and verify the password hash", n: "bcrypt or argon2 — never a fast hash, never plaintext." },
           { q: "Correct?",
             y: "Issue a session token or a signed JWT",
             n: "Return a generic failure — never reveal which part was wrong" },
           { s: "Rate limit attempts and support a second factor", n: "Passwords alone are not enough." },
           "Now do authorisation — this only established identity"] }
},

"Authorisation": {
 ex: { h: "Which doors your badge opens",
       b: "The badge proves who you are; the access list decides where you may go. And it must be checked on every door — checking once at reception and then trusting the corridor is exactly how an insecure direct object reference happens." },
 fl: { t: "Checking permission on every request",
       s: ["An authenticated user requests `/orders/42`",
           { q: "Does the code check they own order 42?",
             y: "Denied if not — 403 or 404, deliberately chosen",
             n: "Anyone can change the number and read anyone's order — IDOR" },
           { s: "Enforce at the data layer where possible", n: "Scope every query by the current user." },
           { s: "Choose a model: role-based, or attribute-based", n: "RBAC is simpler; ABAC is more expressive." },
           "Deny by default — allow-listing is far safer than deny-listing"] }
},

"JWT": {
 ex: { h: "A festival wristband instead of a guest list",
       b: "The gate does not phone the office — the band itself carries who you are and is tamper-evident. Fast and stateless, with one real consequence: you cannot cut a wristband off remotely, so revoking a token before it expires needs extra machinery." },
 fl: { t: "Verifying one, and its catch",
       s: ["A token arrives with three base64 parts",
           { s: "Header, payload, signature", n: "Anyone can read the payload — it is encoded, not encrypted." },
           { q: "Does the signature verify with your key?",
             y: "The claims are trustworthy — check `exp`, `iss` and `aud` too",
             n: "Reject. And never accept `alg: none`" },
           { q: "How do you revoke it before expiry?",
             y: "You cannot, without a deny-list — which reintroduces state",
             n: "Keep access tokens short-lived and use refresh tokens" },
           "Never put anything secret in the payload"] }
},

"OAuth 2.0": {
 ex: { h: "A valet key for your car",
       b: "It starts the engine and will not open the boot. *Sign in with Google* hands an app a scoped, revocable key rather than your password — and the whole design exists so the app never sees your credentials at all." },
 fl: { t: "The authorisation code flow",
       s: ["App redirects the user to the provider",
           { s: "User authenticates there and approves the requested scopes", n: "Your app never sees the password." },
           { s: "Provider redirects back with a short-lived code", n: "Plus a `state` value you must verify against CSRF." },
           { s: "Your server exchanges the code for tokens", n: "Back-channel, with the client secret." },
           { q: "Public client — a mobile or single-page app?",
             y: "Use PKCE; there is no safe place to keep a secret",
             n: "Store the tokens server-side and never expose them" }] }
},

"OpenID Connect": {
 ex: { h: "OAuth with a photo ID attached",
       b: "OAuth answers *may this app do that*. It never actually says who you are, which people used it for anyway. OIDC adds an identity token that does — signed, with a defined set of claims — so *sign in with* finally has a proper standard behind it." },
 fl: { t: "What it adds on top",
       s: ["Run an ordinary OAuth flow with the `openid` scope",
           { s: "You get an ID token as well as an access token", n: "A JWT with claims about the user." },
           { q: "What is each token for?",
             y: "ID token proves identity to *your* app; access token calls the provider's API",
             n: "Do not send the ID token to APIs, or use the access token as identity" },
           "Verify the signature, issuer, audience and nonce — every time"] }
},

"Single Sign-On": {
 ex: { h: "One staff badge for the whole campus",
       b: "Sign in once and the library, the gym and the labs all recognise you. Enormously better for users and for offboarding — one revocation locks every door. It also means the identity provider is now a single point of failure worth protecting heavily." },
 fl: { t: "What it centralises",
       s: ["User signs in at the identity provider once",
           { s: "Each application redirects there and receives an assertion", n: "SAML or OIDC." },
           { q: "What happens when someone leaves?",
             y: "Disable one account and every application is closed to them",
             n: "Without SSO you are chasing twenty separate systems" },
           { s: "The IdP becomes critical infrastructure", n: "Its outage is everyone's outage." },
           "Enforce MFA there — it is the key to everything"] }
},

"Session": {
 ex: { h: "A tab kept behind the bar",
       b: "You are handed a number, and the bar remembers what you have had. Server-side state means you can close the tab instantly — which is exactly the revocation problem JWTs have — at the cost of every server needing access to that memory." },
 fl: { t: "Sessions versus tokens",
       s: ["A user logs in successfully",
           { q: "Do you store state on the server?",
             y: "Session — instantly revocable; needs a shared store to scale",
             n: "Stateless token — scales trivially; hard to revoke early" },
           { s: "The session id goes in a cookie", n: "HttpOnly, Secure, SameSite — all three." },
           { s: "Regenerate the id on login", n: "Otherwise you are open to session fixation." },
           "In-memory sessions break the moment you run two instances"] }
},

"API Gateway": {
 ex: { h: "A hotel reception in front of every department",
       b: "Guests do not wander to the kitchen or the laundry. One desk handles identification, directs requests, and enforces house rules — which is exactly why cross-cutting concerns like auth, rate limiting and TLS belong here rather than being reimplemented in every service." },
 fl: { t: "What it handles before your service does",
       s: ["A request arrives at the edge",
           { s: "TLS termination, then authentication", n: "One implementation instead of one per service." },
           { s: "Rate limiting, request validation, routing", n: "Bad requests never reach your code." },
           { q: "Should business logic live here?",
             y: "No — a gateway that grows logic becomes a new monolith with no tests",
             n: "Add tracing headers and forward it on" },
           "It is a single point of failure — run it redundantly"] }
},

"Monolith": {
 ex: { h: "One large well-organised shop",
       b: "Everything under one roof, one till, one set of stock. It is simple, fast to work in, and genuinely the right answer for most teams — the trouble only starts when forty people are trying to rearrange the same aisles at once." },
 fl: { t: "When it stops fitting",
       s: ["One deployable unit contains the whole application",
           { s: "Simple to run, debug, test and deploy", n: "One log, one trace, one transaction." },
           { q: "What is actually hurting?",
             y: "Deploy contention and team coordination — that is an organisational signal",
             n: "Slow tests or tangled code — fix the modularity first, inside the monolith" },
           "Start here. Split only when a specific pain justifies distributed-system costs"] }
},

"Microservices": {
 ex: { h: "A high street of independent shops",
       b: "Each is run by its own team, opens on its own schedule, and can be rebuilt without closing the others. It also means the butcher phoning the baker can fail, and *where did that order go* now spans six shops — which is the real cost." },
 fl: { t: "The costs you take on",
       s: ["Each service is independently deployable, with its own data",
           { s: "Teams ship without coordinating", n: "The genuine prize, and it is organisational." },
           { q: "What did you just buy?",
             y: "Network failures between every call, distributed tracing, eventual consistency",
             n: "There is no free version of this" },
           { s: "Cross-service transactions no longer exist", n: "You need sagas and compensating actions." },
           "Do it when team scale demands it — not because the architecture diagram looks better"] }
},

"Modular Monolith": {
 ex: { h: "One building with proper internal walls",
       b: "Clear boundaries, enforced module interfaces, no reaching into another module's tables — but one deployment and one database transaction. It gets most of the discipline of microservices with none of the network, and it makes a later split straightforward if you ever need one." },
 fl: { t: "Getting the benefits without the network",
       s: ["Split the codebase into modules with explicit interfaces",
           { s: "No module touches another's tables directly", n: "Enforce it — with build rules, not good intentions." },
           { q: "Do you need independent deployment yet?",
             y: "The boundaries are already there — extraction is mechanical",
             n: "Stay in one process: transactions, tracing and debugging all stay easy" },
           "This is the sensible default for most teams under about fifty engineers"] }
},

"Service Mesh": {
 ex: { h: "A postal service for your internal calls",
       b: "Every service gets a sidecar that handles routing, retries, encryption and metrics, so none of that has to be written in each language you use. Powerful, and a whole extra system to operate — which is why it earns its keep only at real scale." },
 fl: { t: "What moves out of your code",
       s: ["A sidecar proxy runs beside every service",
           { s: "All traffic goes through it", n: "Your service just calls localhost." },
           { q: "What does it provide?",
             y: "mTLS, retries, timeouts, circuit breaking, traffic splitting, uniform metrics",
             n: "All of it consistent across every language in your estate" },
           { s: "The cost is latency and operational complexity", n: "Two proxies per call, and a control plane to run." },
           "Below a few dozen services, libraries are usually the better trade"] }
},

"Serverless": {
 ex: { h: "Taxis instead of a company car",
       b: "You pay per journey and never think about insurance or parking. Brilliant for spiky, occasional trips; expensive and constraining for a daily commute. And the first taxi of the morning takes a while to arrive — that is the cold start." },
 fl: { t: "Is it the right shape?",
       s: ["Traffic is spiky or unpredictable",
           { q: "Can the work finish in seconds and hold no state?",
             y: "Serverless fits — you pay only for execution and scaling is automatic",
             n: "Long-running or stateful work fights the model" },
           { s: "Cold starts add latency to the first call", n: "Provisioned concurrency mitigates it, at a cost." },
           { q: "Is traffic high and steady?",
             y: "A container on a reserved instance is usually far cheaper",
             n: "Watch the database — thousands of concurrent functions exhaust connections" }] }
},

"Function as a Service": {
 ex: { h: "Hiring a specialist for one task",
       b: "They arrive, do the thing, invoice, and leave. No desk, no contract, no memory of last time. Which is exactly why FaaS suits image thumbnailing and webhook handling, and suits a stateful websocket server not at all." },
 fl: { t: "The lifecycle of one invocation",
       s: ["An event arrives — HTTP, queue message, file upload",
           { q: "Is a warm instance available?",
             y: "It handles the event in milliseconds",
             n: "Cold start — a container spins up and loads your code first" },
           { s: "The function runs, returns, and may be frozen", n: "Anything in memory may or may not survive." },
           { s: "Initialise clients outside the handler", n: "So warm invocations reuse connections." },
           "Never rely on local disk or in-memory state between invocations"] }
},

"Event-Driven Architecture": {
 ex: { h: "A newsroom noticeboard instead of phone calls",
       b: "*Order placed* is pinned up, and billing, shipping and analytics each act on it without the order service knowing they exist. Adding a fourth reader requires no change to the writer — which is the whole benefit, and why tracing a request becomes so much harder." },
 fl: { t: "Publishing an event well",
       s: ["Something meaningful happens in a service",
           { s: "Publish a fact, in the past tense", n: "`OrderPlaced` — not a command telling someone what to do." },
           { s: "Include enough data for consumers to act", n: "Or they all have to call back and you have rebuilt coupling." },
           { q: "Consumers may receive it twice — is that safe?",
             y: "They are idempotent, keyed on the event id",
             n: "Delivery is at-least-once; duplicates are not an edge case" },
           "Version your event schemas — consumers outlive producers"] }
},

"Message Queue": {
 ex: { h: "An in-tray between two desks",
       b: "The sender drops work in and carries on; the receiver takes it when ready. The tray absorbs a rush, survives the receiver being out for an hour, and lets you add a second receiver when the pile grows — none of which a direct phone call offers." },
 fl: { t: "What putting a queue in the middle buys you",
       s: [{ s: "Some work does not need doing while the user waits — sending an email, resizing a photo, generating a report", n: "Doing it inline means the user watches a spinner for something they do not care about." },
           { s: "Instead, drop a note describing the work into a queue and reply to the user immediately", n: "The note is small: what to do, and to what." },
           { s: "Separate workers pick notes off the queue and do the actual work", n: "The user has long since moved on." },
           { q: "What if those workers are down?",
             y: "The notes simply wait in the queue. Nothing is lost, and everything gets done when the workers come back",
             n: "And if work is piling up faster than it is handled, add more workers — the queue's length tells you exactly when" },
           { s: "Make the work safe to do twice", n: "Queues generally guarantee a note is delivered at least once, which means occasionally twice. Sending two identical emails is the mild version of that bug." }] }
},

"Publish-Subscribe": {
 ex: { h: "A radio broadcast, not a phone call",
       b: "The station does not know who is listening, and adding a listener changes nothing at the transmitter. That decoupling is why pub/sub scales organisationally: a new analytics consumer needs no change to the service producing the events." },
 fl: { t: "One event, many independent consumers",
       s: ["A publisher emits an event to a topic",
           { s: "It does not know or care who subscribes", n: "Zero, or twenty." },
           { s: "Every subscriber receives its own copy", n: "Unlike a queue, where one consumer takes each message." },
           { q: "One subscriber is slow or failing?",
             y: "Its lag grows; the others are unaffected — that is the isolation you wanted",
             n: "Each subscriber tracks its own position in the stream" },
           "Ordering is usually only guaranteed within a partition"] }
},

"Dead Letter Queue": {
 ex: { h: "The undeliverable mail office",
       b: "A parcel that has failed five delivery attempts does not go back on the van forever — it goes somewhere a human can look at it. Without one, a single poison message can block a queue indefinitely and nobody notices until the backlog is enormous." },
 fl: { t: "Handling a message that will never succeed",
       s: ["A consumer fails to process a message",
           { s: "It is retried a bounded number of times", n: "With backoff." },
           { q: "Still failing after the limit?",
             y: "Move it to the dead letter queue with the failure reason attached",
             n: "Without this, it blocks the queue and retries forever" },
           { s: "Alert on DLQ depth", n: "A queue nobody watches is a silent data-loss channel." },
           "Support replaying from it once the bug is fixed"] }
},

"Event Sourcing": {
 ex: { h: "A bank statement, not just a balance",
       b: "Store every transaction and the balance is derivable at any point in history. You gain a complete audit trail and the ability to ask questions you had not thought of yet — at the cost that reading the current state now requires work, and schema changes are permanent." },
 fl: { t: "Storing changes instead of state",
       s: ["Every change is appended as an immutable event",
           { s: "Current state is the fold of all events", n: "Replay from the beginning, or from a snapshot." },
           { q: "Reading is now expensive?",
             y: "Maintain read models — this is where CQRS comes in",
             n: "Snapshots cap how far back a replay must go" },
           { s: "Events are permanent", n: "You cannot fix a bad event — you append a corrective one." },
           "Excellent for audit-heavy domains; heavy machinery for a CRUD app"] }
},

"CQRS": {
 ex: { h: "Separate tills and stockroom systems",
       b: "The system that records a sale and the system that answers *what sold last week* have completely different shapes, loads and needs. Splitting them lets you optimise each — and accept that the report may be a few seconds behind the till." },
 fl: { t: "Splitting reading from writing",
       s: [{ s: "Most systems use one model of the data for both saving and displaying, and those two jobs want opposite things", n: "Saving wants no duplication so nothing can disagree. Displaying wants everything pre-joined so pages load fast." },
           { s: "This pattern gives up on one model and builds two", n: "One for changes, one for queries." },
           { s: "Changes go through the write side, which is strict: validated, tidy, no duplicated facts", n: "Correctness is the only priority here. It can afford to be slower." },
           { s: "Screens read from a separate copy, deliberately shaped for the exact questions they ask", n: "Facts repeated across it on purpose, so a page needs one lookup instead of six joins." },
           { q: "What does that cost you?",
             y: "The read copy is always slightly behind — a change may take a moment to appear, so the screen must not pretend otherwise",
             n: "In exchange you can scale reading and writing separately, which matters when one is a thousand times more common" }] }
},

"Saga Pattern": {
 ex: { h: "Cancelling a holiday booked through three companies",
       b: "There is no single transaction across the airline, the hotel and the car hire. If the hotel falls through, you cancel the flight explicitly — a compensating action. Sagas formalise that: no rollback, only deliberate undo steps." },
 fl: { t: "A distributed transaction without a transaction",
       s: ["Step 1 succeeds — payment taken",
           { s: "Step 2 succeeds — stock reserved", n: "Each step commits locally and publishes an event." },
           { q: "Step 3 fails — shipping unavailable?",
             y: "Run compensating actions in reverse: release stock, refund payment",
             n: "The saga completes and the order is confirmed" },
           { s: "Compensations must be idempotent and can themselves fail", n: "Which is the genuinely hard part." },
           "Choreography scales; orchestration is easier to reason about"] }
},

"Domain-Driven Design": {
 ex: { h: "Speaking the customer's language in the code",
       b: "If the business says *policy*, *claim* and *adjuster*, the code should too. When engineers say `record_type_2` and the business says *renewal*, every conversation needs translation and something gets lost each time. The shared vocabulary is the deliverable." },
 fl: { t: "Starting a DDD conversation",
       s: ["Talk to the people who do the work",
           { s: "Write down the nouns and verbs they use", n: "That is the ubiquitous language — use it in the code verbatim." },
           { q: "Does one word mean different things to different teams?",
             y: "You have found a bounded context boundary",
             n: "Model the aggregates — the consistency units the business cares about" },
           "The strategic patterns matter far more than the tactical ones"] }
},

"Bounded Context": {
 ex: { h: "*Customer* means different things in sales and support",
       b: "To sales, a customer has a pipeline stage and a contract value. To support, a customer has a ticket history and an SLA. Forcing one shared model creates an object with forty fields that nobody fully understands — two models with a translation layer is healthier." },
 fl: { t: "Finding a boundary",
       s: ["A shared model is growing unwieldy",
           { q: "Does the same word mean different things to different teams?",
             y: "That is a context boundary — split the model",
             n: "Look at which fields each team actually reads and writes" },
           { s: "Each context owns its own model and data", n: "Translation happens explicitly at the edges." },
           "These boundaries usually make the best service boundaries too"] }
},

"Hexagonal Architecture": {
 ex: { h: "An appliance with interchangeable plugs",
       b: "The motor does not know whether it is on UK or European current — an adapter handles that. Business logic in the middle, adapters at the edges for the database, the API and the message queue, and swapping any of them leaves the core untouched." },
 fl: { t: "Dependencies pointing inward",
       s: ["Business logic sits at the centre, depending on nothing external",
           { s: "It defines ports — interfaces it needs", n: "`UserRepository`, not `PostgresUserRepository`." },
           { s: "Adapters implement those ports at the edges", n: "Postgres, HTTP, Kafka." },
           { q: "Testing the core?",
             y: "Substitute in-memory adapters — no database, no network, fast tests",
             n: "That testability is most of the value" },
           "The rule: dependencies always point inward, never outward"] }
},

"Dependency Injection": {
 ex: { h: "Being handed your tools rather than fetching them",
       b: "A function that constructs its own database connection can only ever be tested against a real database. One that is handed a connection can be handed a fake. That is the whole idea, and no framework is required to benefit from it." },
 fl: { t: "Making code testable",
       s: ["A class needs a collaborator",
           { q: "Does it construct it internally?",
             y: "It is welded to that implementation — untestable without the real thing",
             n: "It is passed in — you can substitute a fake in tests" },
           { s: "Depend on the interface, not the concrete class", n: "Then swapping implementations is free." },
           "Constructor injection is usually enough — frameworks are optional"] }
},

"Middleware": {
 ex: { h: "A series of checkpoints on the way to the desk",
       b: "Security, then registration, then the badge printer — each does one thing and passes you along. Logging, authentication, compression and error handling all sit in this chain, which is why the order you register them in genuinely matters." },
 fl: { t: "Order matters",
       s: ["A request enters the middleware chain",
           { s: "Each layer may act, then call the next", n: "Or short-circuit and respond immediately." },
           { q: "Where should authentication sit?",
             y: "Early — so unauthenticated requests never reach expensive work",
             n: "Error handling should be outermost, so it catches everything inside" },
           { s: "The response travels back out through the same layers", n: "In reverse order." },
           "A layer that forgets to call the next one hangs the request"] }
},

"Load Balancer": {
 ex: { h: "The person directing you to the next free till",
       b: "They keep the queues even, and stop sending people to a till whose card reader is broken. That second job — health checking — is at least as important as the first, and it is what lets you deploy without anyone hitting a server that is restarting." },
 fl: { t: "How traffic is routed",
       s: ["A request arrives at the load balancer",
           { s: "It picks a healthy backend", n: "Round robin, least connections, or by hash." },
           { q: "Is a backend failing health checks?",
             y: "It is removed from rotation — no user sees the failure",
             n: "Forward the request and stream the response back" },
           { s: "This is what makes zero-downtime deploys possible", n: "Drain one instance, replace it, return it to rotation." },
           "It also terminates TLS and is a natural place for rate limiting"] }
},

"Reverse Proxy": {
 ex: { h: "A receptionist who answers for the whole building",
       b: "Callers only ever reach the front desk, which knows which extension to use. Your services are never exposed directly, TLS ends in one place, and you can serve static files, compress responses and cache — all without touching application code." },
 fl: { t: "What it does before your app sees anything",
       s: ["A client connects to the proxy, not the service",
           { s: "TLS is terminated here", n: "One certificate to manage, not one per service." },
           { s: "Static files are served directly", n: "Your application never wakes up for them." },
           { q: "Which backend handles this path?",
             y: "Route by hostname or path prefix and forward",
             n: "Add compression, caching headers and rate limits on the way through" },
           "Nginx, Caddy and Envoy are the usual choices"] }
},

"Caching": {
 ex: { h: "A pastry case at the front of the bakery",
       b: "Baked earlier, handed over instantly. Everything hinges on how stale you can tolerate — and on remembering that a shared case must never hold one customer's personalised order, which is the cache-key bug that leaks one user's data to another." },
 fl: { t: "Adding a cache safely",
       s: ["Something slow is called repeatedly",
           { q: "Is the result the same for every user?",
             y: "Cache it globally — one computation serves everybody",
             n: "The key must include the user, or you leak data between accounts" },
           { s: "Set a short TTL rather than inventing invalidation logic", n: "Time-based expiry is far easier to reason about." },
           { s: "Decide what happens on a miss stampede", n: "A thousand simultaneous misses can flatten the database." },
           "Measure the hit rate — a cache below 80% may not be earning its complexity"] }
},

"Cache Invalidation": {
 ex: { h: "Recalling a printed price list",
       b: "The price changed this morning and ten thousand copies are already out there. Working out who has one, and getting the new version to them, is genuinely hard — which is why *there are two hard things in computer science* is a joke everyone repeats and nobody has fixed." },
 fl: { t: "Choosing a strategy",
       s: ["Underlying data has changed",
           { q: "Can you tolerate a short window of staleness?",
             y: "TTL expiry — simplest and by far the most robust",
             n: "Invalidate explicitly on write, and accept the coupling" },
           { s: "Write-through updates the cache as you write", n: "Consistent, and slower on writes." },
           { s: "Key by version, and let old keys expire", n: "No deletion needed at all." },
           "Distributed caches make this harder — several nodes may hold copies"] }
},

"CDN": {
 ex: { h: "Local depots instead of one warehouse",
       b: "A shopper in Sydney does not wait for a parcel from Manchester. Copies of your static assets sit in hundreds of locations, so the first byte arrives in milliseconds — and a cache-busting filename hash is what lets you keep them cached forever and still deploy." },
 fl: { t: "Serving assets fast and updating them",
       s: ["A user requests an image or a script",
           { q: "Is it in the nearby edge cache?",
             y: "Served immediately — no trip to your origin",
             n: "The edge fetches from origin once, then serves everyone locally" },
           { s: "Hash the filename on build", n: "`app.4f2a9c.js` — content and name change together." },
           { q: "How long should it cache?",
             y: "A year — the hash guarantees a new deploy is a new URL",
             n: "HTML must be short-lived; it points at the hashed assets" }] }
},

"Horizontal Scaling": {
 ex: { h: "Opening more checkouts",
       b: "Cheaper than building a single super-checkout and it has no ceiling — until you discover one till keeps the only copy of the loyalty card list. That shared state is what makes statelessness a precondition rather than a nice-to-have." },
 fl: { t: "What must be true first",
       s: ["Traffic exceeds one instance",
           { q: "Is the application stateless?",
             y: "Add instances behind a load balancer — scaling is nearly free",
             n: "Move sessions and uploads out to a shared store first" },
           { s: "The database usually becomes the new bottleneck", n: "Read replicas, then caching, then sharding." },
           "Autoscale on a metric that reflects real load, with sensible bounds"] }
},

"Vertical Scaling": {
 ex: { h: "A bigger van instead of a second van",
       b: "Simple, immediate, and no code changes — which is why it is often the right first move. It also has a hard ceiling, gets disproportionately expensive at the top end, and leaves you with one machine whose failure takes everything down." },
 fl: { t: "When to reach for it",
       s: ["A service is resource-constrained",
           { q: "Is it a quick fix to buy time?",
             y: "Resize the instance — minutes of work, no architecture change",
             n: "Long term you will hit the ceiling and the price curve" },
           { s: "Databases scale vertically far more readily than stateless services", n: "Which is why it remains the usual first answer there." },
           "One large machine is still a single point of failure"] }
},

"Statelessness": {
 ex: { h: "A ticket that works at any turnstile",
       b: "The gate holds no memory; the ticket carries everything. That is what lets you open a second gate at rush hour without anyone being turned away — and why in-memory sessions break the moment you run two copies of your service." },
 fl: { t: "Making a service stateless",
       s: ["Find everything the process keeps between requests",
           { s: "Sessions, uploaded files, in-memory caches, counters", n: "Each is an obstacle to running two copies." },
           { q: "Where should each one go?",
             y: "Sessions to Redis or a token; files to object storage; counters to the database",
             n: "Anything left local will behave inconsistently across instances" },
           "Then any instance can serve any request, and scaling is trivial"] }
},

"Sticky Session": {
 ex: { h: "Always being sent back to the same clerk",
       b: "It works because that clerk remembers your case — and it is a workaround for not having written the case down. When that clerk goes home, so does your progress. It is a bridge to statelessness, not a destination." },
 fl: { t: "Why it is a stopgap",
       s: ["The load balancer pins a user to one instance",
           { s: "Usually by a cookie or a hash of the client IP", n: "Which is why NAT can pin thousands of users together." },
           { q: "That instance is redeployed or crashes?",
             y: "Every session on it is lost — users are logged out mid-task",
             n: "Load also distributes unevenly, since sessions live different lengths" },
           "The real fix is to move the state out and drop stickiness"] }
},

"Circuit Breaker": {
 ex: { h: "A fuse that trips before the house burns down",
       b: "When a downstream service is failing, hammering it with retries makes everything worse and holds your own threads hostage. The breaker opens, fails fast, and periodically lets one request through to see whether the other end has recovered." },
 fl: { t: "Three states",
       s: ["Closed — requests flow normally, failures are counted",
           { q: "Has the failure rate crossed the threshold?",
             y: "Open — fail immediately without calling. No waiting, no thread exhaustion",
             n: "Stay closed" },
           { s: "After a cooldown, move to half-open", n: "Let a single trial request through." },
           { q: "Did it succeed?",
             y: "Close the breaker and resume normal traffic",
             n: "Open again and wait longer" },
           "Pair it with a fallback — cached data, or a degraded response"] }
},

"Retry": {
 ex: { h: "Redialling after a dropped call",
       b: "Sensible once or twice. Ten devices all redialling instantly the moment a service recovers is how you knock it straight over again — which is why every retry policy needs a cap, a backoff and some jitter." },
 fl: { t: "Retrying without causing an outage yourself",
       s: [{ s: "A call to another service fails. The instinct is to try again, and sometimes that is right", n: "Sometimes it is how a small problem becomes a large one." },
           { q: "Was the failure temporary, or is it going to fail identically?",
             y: "Temporary — a timeout, a connection dropped, a \"try later\" response. Worth retrying, because the next attempt may well work",
             n: "A rejected request or a refused login will fail exactly the same way every time. Retrying just wastes calls and hides the real error" },
           { q: "Is it safe to do this action twice?",
             y: "Reading something, or setting a value to a fixed result — no harm if it lands twice",
             n: "Taking a payment is not safe. Send a unique reference with the request so the far side recognises the repeat and does not charge again" },
           { s: "Wait longer before each attempt: one second, then two, then four", n: "Retrying immediately, over and over, is how a struggling service gets finished off." },
           { s: "Add a small random delay to each wait", n: "Otherwise every client that failed at the same moment retries at the same moment, and you have built a stampede." },
           { s: "And stop after a few attempts", n: "Endless retries turn one broken dependency into a system-wide pile-up." }] }
},

"Exponential Backoff": {
 ex: { h: "Knocking, then waiting longer each time",
       b: "One second, then two, then four, then eight. It gives a struggling service room to recover instead of being drowned by the very clients waiting for it. Add randomness, or every client retries in perfect unison and you have rebuilt the stampede." },
 fl: { t: "Computing the next delay",
       s: ["Attempt fails; attempt number is n",
           { s: "Base delay doubles each time: 1s, 2s, 4s, 8s", n: "Capped at a sensible maximum." },
           { q: "Do all clients use the same formula?",
             y: "They retry simultaneously — a thundering herd. Add jitter",
             n: "Full jitter: pick uniformly between 0 and the computed delay" },
           "Respect `Retry-After` when the server tells you when to come back"] }
},

"Timeout": {
 ex: { h: "Hanging up after ringing for a minute",
       b: "Without one you wait forever, holding a connection, a thread and a user's patience. Cascading timeouts are the failure mode: your caller gives up before you do, so your work is wasted and everything upstream is still blocked." },
 fl: { t: "Setting them sensibly",
       s: ["Every network call gets an explicit timeout",
           { q: "Is there a default?",
             y: "Often none, or minutes long — never rely on it",
             n: "Set it from the p99 latency plus a margin" },
           { s: "Inner timeouts must be shorter than outer ones", n: "Otherwise the caller gives up while you are still trying." },
           { s: "Distinguish connect, read and total timeouts", n: "They fail for different reasons." },
           "A timeout is not a failure signal — the work may still have happened"] }
},

"Bulkhead": {
 ex: { h: "Watertight compartments in a ship",
       b: "One flooded compartment does not sink the vessel. Give each downstream dependency its own connection pool and thread budget, and one slow service cannot consume every thread and take the whole application down with it." },
 fl: { t: "Stopping one slow thing from sinking everything",
       s: [{ s: "The name comes from ships: walls dividing the hull, so a leak floods one compartment rather than the whole vessel", n: "Same idea, applied to software." },
           { s: "Your service can handle a limited number of things at once — say fifty simultaneous requests", n: "That limit is shared across everything it does." },
           { q: "What happens if one dependency you call becomes very slow?",
             y: "Requests waiting on it pile up and consume all fifty slots. Now every other feature stops too, even though nothing is wrong with them",
             n: "Instead, reserve a slice for each dependency: ten slots for this one, ten for that one" },
           { s: "Now when one becomes slow, it fills its own ten and stops", n: "Requests needing it fail quickly and clearly. Everything else carries on unaffected." },
           { s: "Failing fast is the point, not a side effect", n: "A quick clear error lets you show a fallback. A request hanging for thirty seconds helps nobody." }] }
},

"Graceful Degradation": {
 ex: { h: "A restaurant that runs out of fish",
       b: "It does not close. It takes fish off the menu and serves everything else. A recommendations service being down should hide the recommendations panel, not fail the product page — and deciding that in advance is what makes it possible." },
 fl: { t: "Deciding what is essential",
       s: ["List each component of a page or flow",
           { q: "Is this one essential to the core task?",
             y: "Its failure must fail the request — be explicit about that",
             n: "Wrap it: on failure, hide it or serve stale data" },
           { s: "Serve stale cache rather than nothing", n: "Old prices usually beat an error page." },
           "Test it — deliberately break a dependency and see what users get"] }
},

"Health Check": {
 ex: { h: "A pulse check versus a full physical",
       b: "The load balancer needs a fast, cheap yes-or-no. A liveness check that queries the database on every poll adds load and can cascade — one slow query and every instance is marked unhealthy and removed at once." },
 fl: { t: "Liveness versus readiness",
       s: ["The orchestrator polls your endpoints",
           { q: "Which question is being asked?",
             y: "Liveness: is the process alive? Cheap, no dependencies. Failure means restart",
             n: "Readiness: can it serve traffic? May check dependencies. Failure means remove from rotation" },
           { s: "Never check dependencies in liveness", n: "A database blip should not restart every instance." },
           "Use readiness to drain connections cleanly during a deploy"] }
},

"Twelve-Factor App": {
 ex: { h: "A checklist for software that runs anywhere",
       b: "Config in the environment, logs to stdout, stateless processes, dependencies declared explicitly. None of it is novel and following it is the difference between an app that deploys to any platform and one that only runs on the machine it was born on." },
 fl: { t: "The factors that matter most in practice",
       s: [{ s: "Config in the environment", n: "One build, many environments." },
           { s: "Stateless processes", n: "Horizontal scaling becomes trivial." },
           { s: "Logs as an event stream to stdout", n: "The platform collects them; your app does not manage files." },
           { s: "Explicit, isolated dependencies", n: "Nothing implicit from the host." },
           { q: "Dev and production differ substantially?",
             y: "Close the gap — same backing services, same versions",
             n: "Disposability: start fast, shut down gracefully" }] }
},

"Backend for Frontend": {
 ex: { h: "A different menu for the takeaway window",
       b: "The mobile app needs small, aggregated responses over a slow connection; the desktop web app wants richer data. One shared API compromises for both. A BFF per client lets each be shaped for its actual consumer." },
 fl: { t: "When a BFF earns its place",
       s: ["Several clients consume the same backend",
           { q: "Are their needs genuinely different?",
             y: "A thin BFF per client aggregates and shapes what that client needs",
             n: "One API is simpler — do not add a layer for its own sake" },
           { s: "The BFF owns aggregation, not business logic", n: "Logic there is logic duplicated per client." },
           "It is also where the mobile app's API key can safely live"] }
},

"Feature Flag": {
 ex: { h: "A dimmer switch on a new feature",
       b: "Deploy the code dark, enable it for yourself, then for 1% of users, then for everyone — and turn it off in seconds if the error rate moves. It separates deploying from releasing, which is the single biggest reduction in deploy risk available." },
 fl: { t: "A safe rollout",
       s: ["Ship the code behind a flag, defaulted off",
           { s: "Enable for internal users first", n: "Then a small percentage of real traffic." },
           { q: "Do the metrics look wrong?",
             y: "Flip it off — no deploy, no rollback, seconds",
             n: "Increase the percentage gradually" },
           { s: "Remove the flag once it is fully on", n: "Stale flags are technical debt that multiplies code paths." },
           "Keep an inventory with owners and expiry dates"] }
},

"Distributed System": {
 ex: { h: "Coordinating a team across three time zones",
       b: "Messages arrive late, out of order or not at all, and you cannot tell a slow colleague from an absent one. Every hard distributed-systems problem is a version of that ambiguity — which is why the fallacies of distributed computing all start with an assumption that stops holding." },
 fl: { t: "The assumptions that break",
       s: ["A call crosses a network boundary",
           { q: "Did the call fail, or is it just slow?",
             y: "You cannot distinguish them — that is the fundamental problem",
             n: "Assume it may have succeeded; make the operation idempotent" },
           { s: "Clocks disagree, ordering is not guaranteed, partitions happen", n: "The eight fallacies, all of them." },
           "Design for partial failure from the start; it is the normal case, not an edge case"] }
},

"Consensus": {
 ex: { h: "A committee agreeing while some members are unreachable",
       b: "You need a decision that every reachable member honours, even though messages get lost and members go offline. Raft and Paxos solve it with a quorum — a majority agreeing is enough, which is why cluster sizes are always odd." },
 fl: { t: "Why quorums are odd-numbered",
       s: ["A cluster must agree on a value",
           { s: "A proposal is accepted when a majority acknowledges it", n: "3 of 5, 2 of 3." },
           { q: "The network splits into two halves?",
             y: "Only the side with a majority can proceed — no split brain",
             n: "An even cluster can split evenly and neither side can act" },
           { s: "5 nodes tolerate 2 failures; 6 also tolerate only 2", n: "Which is why you never see 6." },
           "Use etcd, ZooKeeper or Consul — do not implement this yourself"] }
},

"Leader Election": {
 ex: { h: "Deciding who chairs the meeting when the chair is away",
       b: "Somebody must run the scheduled job, and exactly one somebody. Election gives you that guarantee, plus automatic replacement when the leader disappears — and the lease-based version means a leader that loses the network stops acting rather than duplicating work." },
 fl: { t: "One actor, automatically replaced",
       s: ["Instances compete to acquire a lease",
           { s: "One wins and becomes leader", n: "It must renew the lease continuously." },
           { q: "Does the leader stop renewing?",
             y: "The lease expires and the others hold a new election",
             n: "It keeps the role and keeps working" },
           { s: "A partitioned leader must step down", n: "Or two leaders act at once — split brain." },
           "Do not build it on a plain database row without fencing tokens"] }
},

"Cron Job": {
 ex: { h: "A recurring calendar reminder for the machine",
       b: "Every night at two, run the report. Simple, ubiquitous, and full of quiet traps: it runs in UTC or local depending on config, it runs twice or never on daylight-saving night, and it will happily start a second copy while the first is still going." },
 fl: { t: "Making a scheduled job reliable",
       s: ["A job is scheduled to run periodically",
           { q: "Could the previous run still be going?",
             y: "Take a lock — overlapping runs corrupt data",
             n: "Schedule in UTC to avoid daylight-saving skips and repeats" },
           { s: "Make it idempotent", n: "So a manual re-run after a failure is safe." },
           { s: "Alert when it does not run", n: "A silent job is indistinguishable from a broken one — use a dead-man's switch." },
           "Log the start, the end and the outcome, every time"] }
},

"Protocol Buffers": {
 ex: { h: "A form with numbered fields instead of labels",
       b: "The wire carries field 3 rather than the word `emailAddress`, which makes messages far smaller and faster to parse. It also means field numbers are permanent — reuse one for a different meaning and old clients silently misread the data." },
 fl: { t: "Evolving a schema without breaking anyone",
       s: ["Define messages in a `.proto` file and generate code",
           { s: "Each field has a permanent number", n: "That number is the contract, not the name." },
           { q: "Removing a field?",
             y: "Reserve its number so it can never be reused",
             n: "Adding one? Give it a new number and make it optional" },
           { s: "Never change a field's type or renumber it", n: "Old readers will misinterpret the bytes." },
           "Renaming a field is safe — the wire format never carried the name"] }
},

"Error Handling": {
 ex: { h: "A shop assistant who says what went wrong",
       b: "*Card declined — try another?* is actionable. *An error occurred* is not, and *Error: undefined* actively wastes someone's time. The difference between the three is entirely in the design, and it is the part most often left until last." },
 fl: { t: "Designing errors that help",
       s: ["Something fails",
           { q: "Can the caller do anything about it?",
             y: "Say what happened and what to do — plus a request id for support",
             n: "Log the detail, return something generic, and alert" },
           { s: "Never leak stack traces or SQL to users", n: "They are a gift to an attacker and useless to everybody else." },
           { s: "Log with enough context to reproduce it", n: "Request id, user id, the inputs that mattered." },
           "Fail loudly internally and gracefully externally"] }
}

});
