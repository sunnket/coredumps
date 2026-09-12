/* Backend & APIs — HTTP, properly. */
TD.addLessons("backend", [

{
 t: "What Actually Travels Over the Wire",
 m: "http",
 lvl: "core",
 s: "Requests, methods, status codes and headers — the protocol every API is a conversation in.",
 goal: [
  "Read a raw HTTP request and response and name every part",
  "Choose the right method and status code without looking them up",
  "Know which headers matter and why"
 ],
 b: [
  { p: "HTTP is text. Once you have seen a raw request, the whole subject stops being abstract — every framework, every client library and every API design argument is about the shape of these few lines." },

  { h: "A request" },
  { code: { lang: "http", t: "What your browser actually sends",
    lines: [
     { c: "POST /v1/predict HTTP/1.1", w: "**Method, path, version.** The request line — everything else is optional in principle." },
     { c: "Host: api.example.com", w: "**Required in HTTP/1.1.** One server hosts many domains and this is how it knows which." },
     { c: "Content-Type: application/json", w: "**What the body is.** Without it, the server guesses — and often wrongly." },
     { c: "Content-Length: 47", w: "How many bytes of body follow." },
     { c: "Authorization: Bearer eyJhbGci...", w: "**Credentials.** Note it is a header, not the URL — URLs end up in logs, browser history and referrer headers.", hi: true },
     { c: "Accept: application/json", w: "What the client would like back." },
     { c: "Idempotency-Key: 7f3a-9c21", w: "**Your own header.** A safe retry depends on this — covered in the reliability module." },
     { c: "", w: "**A blank line separates headers from body.** This is the whole framing rule." },
     { c: "{\"customer_id\": \"c_991\", \"amount\": 4200}", w: "The body." }
    ] } },

  { code: { lang: "http", t: "And the response",
    lines: [
     { c: "HTTP/1.1 200 OK", w: "**Status line.** The number is what your code branches on; the text is for humans." },
     { c: "Content-Type: application/json; charset=utf-8", w: "" },
     { c: "Cache-Control: no-store", w: "**Say whether this may be cached.** Omitting it means intermediaries guess." },
     { c: "X-Request-Id: 9f2c1e04", w: "**Return the request id.** When a user reports a problem, this is what makes it findable in your logs.", hi: true },
     { c: "", w: "" },
     { c: "{\"probability\": 0.183, \"model_version\": \"a3f91c02\"}", w: "" }
    ] } },

  { n: "Everything else — REST, GraphQL, webhooks, streaming — is a convention layered on this. When an integration misbehaves, drop to the raw exchange with `curl -v` or your browser's network tab. The answer is nearly always visible in the headers, and nearly always missed because people read the framework's error instead.",
    nt: "The debugging habit" },

  { h: "Methods, and the two properties that matter" },
  { tbl: { t: "The methods you will use",
    h: ["Method", "For", "Safe?", "Idempotent?"],
    rows: [
     ["**GET**", "Read. **Never changes anything**", "Yes", "Yes"],
     ["**POST**", "Create, or an action that does not fit the others", "No", "**No** — this is why double-submit creates two orders"],
     ["**PUT**", "Replace a resource entirely at a known id", "No", "**Yes** — same request twice gives the same state"],
     ["**PATCH**", "Partially update", "No", "Usually, if written carefully"],
     ["**DELETE**", "Remove", "No", "**Yes** — deleting twice leaves it deleted"]
    ] } },

  { l: [
   "**Safe** means it does not change state. Crawlers, prefetchers and browsers assume GET is safe and will call it without being asked. A GET that deletes something *will* be triggered by accident.",
   "**Idempotent** means calling it twice has the same effect as once. This is what makes retries safe, and it is why POST needs an idempotency key while PUT does not.",
   "**Never put actions in a GET.** `GET /orders/1/cancel` looks convenient and will be cancelled by a link preview bot.",
   "**Never put secrets in a URL.** Query strings are logged by every proxy, server and analytics tool in the path."
  ] },

  { h: "Status codes" },
  { tbl: { t: "The ones worth knowing precisely",
    h: ["Code", "Means", "Use when"],
    rows: [
     ["**200 OK**", "Success with a body", "A normal successful read or action"],
     ["**201 Created**", "A new resource exists", "**Include a `Location` header** pointing at it"],
     ["**202 Accepted**", "Received, not finished", "**Async work.** Return a job id the client can poll"],
     ["**204 No Content**", "Success, nothing to say", "A successful DELETE"],
     ["**400 Bad Request**", "The request is malformed", "Validation failure. **Say which field**"],
     ["**401 Unauthorized**", "We do not know who you are", "Missing or invalid credentials"],
     ["**403 Forbidden**", "We know who you are, and no", "**The distinction from 401 matters** — one means log in, the other means do not bother"],
     ["**404 Not Found**", "No such resource", "Also correct for *exists but you may not know that*"],
     ["**409 Conflict**", "Clashes with current state", "Duplicate creation, version conflict"],
     ["**422 Unprocessable**", "Well-formed but semantically wrong", "What FastAPI returns on a schema failure"],
     ["**429 Too Many Requests**", "Rate limited", "**Include `Retry-After`** so clients can behave"],
     ["**500 Internal Server Error**", "We broke", "**Your bug.** Never leak a stack trace"],
     ["**503 Service Unavailable**", "Temporarily down", "Overloaded or a dependency is out. Retryable"]
    ] } },

  { trap: "Returning 200 with `{\"error\": \"...\"}` in the body is the most common API design mistake there is. Every HTTP client, load balancer, retry library, monitoring tool and dashboard treats 200 as success — so your error rate reads as zero while everything is failing. Use the status code. It is the only part of the response the rest of the internet understands." },

  { code: { lang: "python", t: "An error body worth returning",
    lines: [
     { c: "# 400 Bad Request", w: "" },
     { c: "{", w: "" },
     { c: "  \"error\": \"validation_failed\",", w: "**A stable machine-readable code.** Clients branch on this; never on the message text." },
     { c: "  \"message\": \"amount must be a positive number\",", w: "**For a human.** Free to change without breaking anyone." },
     { c: "  \"field\": \"amount\",", w: "**Which field.** *Invalid input* wastes an hour of someone's day." },
     { c: "  \"request_id\": \"9f2c1e04\"", w: "**So they can quote it in a support ticket** and you can find the log line.", hi: true },
     { c: "}", w: "" }
    ] } },

  { h: "Headers that matter" },
  { tbl: { t: "The working set",
    h: ["Header", "Direction", "Why"],
    rows: [
     ["`Content-Type`", "Both", "What the body is. `application/json` almost always"],
     ["`Authorization`", "Request", "**`Bearer <token>`.** Never in the URL"],
     ["`Accept`", "Request", "What the client wants back"],
     ["`X-Request-Id`", "Both", "**Trace one request across services.** Generate it at the edge if absent"],
     ["`Retry-After`", "Response", "How long to wait after a 429 or 503"],
     ["`Cache-Control`", "Response", "Whether and how long this may be cached"],
     ["`ETag` / `If-None-Match`", "Both", "Conditional requests — 304 instead of resending an unchanged body"],
     ["`Content-Encoding: gzip`", "Response", "**Compression.** Frequently a 5–10× reduction on JSON, for one setting"]
    ] } },

  { h: "Streaming" },
  { p: "For anything long-running — and an AI response always is — you do not have to wait for the whole body. **Server-Sent Events** is the simplest mechanism and it is what most model APIs use." },

  { code: { lang: "http", t: "SSE, in full",
    lines: [
     { c: "HTTP/1.1 200 OK", w: "" },
     { c: "Content-Type: text/event-stream", w: "**This is the whole protocol switch.**", hi: true },
     { c: "Cache-Control: no-cache", w: "" },
     { c: "Connection: keep-alive", w: "" },
     { c: "", w: "" },
     { c: "data: {\"token\": \"The\"}", w: "**Each event is `data: ` then a blank line.** That is the entire format." },
     { c: "", w: "" },
     { c: "data: {\"token\": \" answer\"}", w: "" },
     { c: "", w: "" },
     { c: "data: [DONE]", w: "**A sentinel** so the client knows it is finished rather than disconnected." },
     { c: "", w: "" }
    ],
    after: "SSE is one-directional and runs over plain HTTP, so proxies and load balancers handle it without special configuration. Use WebSockets only when you genuinely need the client to send messages continuously too — they are considerably more operational work." } },

  { h: "curl, which is worth learning properly" },
  { code: { lang: "bash",
    lines: [
     { c: "curl -v https://api.example.com/health", w: "**`-v` shows request and response headers.** The first thing to run when an integration misbehaves.", hi: true },
     { c: "", w: "" },
     { c: "curl -X POST https://api.example.com/v1/predict \\", w: "" },
     { c: "  -H 'Content-Type: application/json' \\", w: "" },
     { c: "  -H \"Authorization: Bearer $API_KEY\" \\", w: "**From the environment.** Never paste a key into your shell history." },
     { c: "  -d '{\"customer_id\":\"c_991\"}'", w: "" },
     { c: "", w: "" },
     { c: "curl -w '\\ntotal: %{time_total}s  ttfb: %{time_starttransfer}s\\n' \\", w: "**Timing breakdown.** Distinguishes a slow server from a slow network.", hi: true },
     { c: "  -o /dev/null -s https://api.example.com/v1/predict", w: "" },
     { c: "", w: "" },
     { c: "curl -N https://api.example.com/v1/stream", w: "**`-N` disables buffering**, so you can watch a stream arrive." }
    ] } },

  { tryit: { t: "Read the wire",
    task: "Pick any public API. Use `curl -v` to make a successful request, then a deliberately malformed one, then one with a bad token. Record the status code, the error body shape, and every response header for each. Then find one API that returns 200 on an error.",
    hint: "Try a wrong field type in the body, then an invalid Authorization header. Compare how precisely each error tells you what was wrong.",
    sol: { lang: "bash", code: "# 1. success\ncurl -v -H \"Authorization: Bearer $KEY\" \\\n     https://api.github.com/user 2>&1 | head -40\n\n# 2. bad token -> 401, and note WWW-Authenticate\ncurl -v -H 'Authorization: Bearer nonsense' \\\n     https://api.github.com/user 2>&1 | grep -E '^< HTTP|^< www'\n\n# 3. malformed body\ncurl -v -X POST https://api.github.com/gists \\\n     -H \"Authorization: Bearer $KEY\" \\\n     -d '{\"files\": \"not-an-object\"}' 2>&1 | tail -20\n\n# Note for each:\n#   - status code, and whether it is the RIGHT one\n#   - does the error name the offending field?\n#   - is there a machine-readable error code?\n#   - is there a request id you could quote in a ticket?" },
    w: "You will find that good APIs name the field and give a stable error code, and poor ones return *Bad Request* with no detail. That difference is entirely a design choice, it takes no extra effort to get right, and the API design lesson is about making yours the first kind." } },

  { vocab: ["HTTP", "JSON", "Status Code", "Server-Sent Events"] }
 ],
 k: [
  "HTTP is text: request line, headers, blank line, body. Everything else is convention on top.",
  "GET must be safe and never change state; POST is not idempotent, which is why retries need a key.",
  "Never return 200 on an error — every tool in the stack reads the status code, not your body.",
  "Error bodies need a stable code, a human message, the offending field, and a request id.",
  "SSE is `Content-Type: text/event-stream` plus `data:` lines, and it is what model APIs stream over."
 ],
 r: ["HTTP", "JSON", "API", "Idempotency"],
 drill: {
  lang: "bash",
  reps: 3,
  items: [
   { c: "curl -v https://api.example.com/health", w: "see the actual request and response headers" },
   { c: "-H \"Authorization: Bearer $API_KEY\"", w: "credentials in a header, from the environment" },
   { c: "curl -w '%{time_total}s %{time_starttransfer}s'", w: "separate a slow server from a slow network" },
   { c: "curl -N", w: "watch a stream arrive unbuffered" }
  ]
 }
},

{
 t: "Designing an API Someone Else Can Use",
 m: "api",
 lvl: "core",
 s: "Resources, errors, versioning and pagination — the contract, not the code.",
 goal: [
  "Design endpoints that need no explanation",
  "Version an API without breaking existing clients",
  "Paginate correctly, including under concurrent writes"
 ],
 b: [
  { p: "An API is a promise about behaviour that other people build on. Once someone depends on it, changing it is expensive — so the design decisions here are unusually long-lived for how quickly they are usually made." },

  { h: "Resources, not verbs" },
  { vs: { t: "Two ways to name the same six operations", lang: "text",
    bad: { c: "POST /getUser\nPOST /createUser\nPOST /updateUserEmail\nPOST /deleteUser\nPOST /listUsersByTeam\nPOST /searchUsers", label: "RPC-style, everything POST",
      w: "Six names to learn with no pattern. Nothing is cacheable, because everything is POST. Nothing is safely retryable. Every new operation is a new invented name." },
    good: { c: "GET    /users/{id}\nPOST   /users\nPATCH  /users/{id}\nDELETE /users/{id}\nGET    /teams/{id}/users\nGET    /users?q=priya", label: "Resource-oriented",
      w: "One noun, five methods, and a predictable shape. A developer who has used one endpoint can guess the rest, GETs are cacheable and retryable, and a new resource follows the same pattern automatically." } } },

  { l: [
   "**Plural nouns** for collections: `/users`, `/orders`, `/documents`.",
   "**Nest for genuine ownership only**: `/teams/{id}/users` is fine; `/teams/{id}/users/{uid}/orders/{oid}/items` is a design that has escaped.",
   "**Query parameters for filtering, sorting and paging**, never new endpoints. `/orders?status=open&sort=-created_at`.",
   "**Actions that are not CRUD get a sub-resource**: `POST /orders/{id}/refunds`. Better than inventing `POST /refundOrder`, because a refund is a thing with its own history."
  ] },

  { h: "Errors, consistently" },
  { code: { lang: "python", t: "One error shape, everywhere",
    lines: [
     { c: "class APIError(Exception):", w: "" },
     { c: "    def __init__(self, status, code, message, field=None):", w: "" },
     { c: "        self.status, self.code = status, code", w: "" },
     { c: "        self.message, self.field = message, field", w: "" },
     { c: "", w: "" },
     { c: "@app.exception_handler(APIError)", w: "**One handler, so the shape cannot drift** between endpoints written months apart.", hi: true },
     { c: "async def handle(request, exc):", w: "" },
     { c: "    return JSONResponse(status_code=exc.status, content={", w: "" },
     { c: "        'error': exc.code,", w: "" },
     { c: "        'message': exc.message,", w: "" },
     { c: "        'field': exc.field,", w: "" },
     { c: "        'request_id': request.state.request_id,", w: "" },
     { c: "    })", w: "" },
     { c: "", w: "" },
     { c: "@app.exception_handler(Exception)", w: "" },
     { c: "async def unhandled(request, exc):", w: "" },
     { c: "    log.exception('unhandled', extra={'rid': request.state.request_id})", w: "**Log the full trace server-side.**" },
     { c: "    return JSONResponse(500, {", w: "" },
     { c: "        'error': 'internal_error',", w: "" },
     { c: "        'message': 'Something went wrong.',", w: "**Never the exception text.** Stack traces leak table names, file paths and occasionally credentials.", hi: true },
     { c: "        'request_id': request.state.request_id,", w: "**But give them the id**, so support can find it." },
     { c: "    })", w: "" }
    ] } },

  { h: "Versioning" },
  { tbl: { t: "Three approaches",
    h: ["Approach", "Example", "Verdict"],
    rows: [
     ["**URL path**", "`/v1/users`", "**Use this.** Visible, trivially routable, obvious in logs and in a browser"],
     ["**Header**", "`Accept: application/vnd.api.v2+json`", "Purer, and harder to test, debug and cache. Rarely worth it"],
     ["**Query param**", "`/users?version=2`", "Muddles versioning with filtering. Avoid"]
    ] } },

  { p: "The more useful discipline is avoiding a version bump at all. Most changes can be made compatibly:" },
  { l: [
   "**Adding a field is safe.** Clients ignore what they do not know — provided they were written to.",
   "**Removing or renaming a field breaks people.** Deprecate, keep both for a period, then remove.",
   "**Making an optional field required breaks people.**",
   "**Changing a type breaks people**, including `\"4200\"` to `4200`.",
   "**Changing the meaning of a value is the worst kind**, because nothing errors — it just becomes quietly wrong everywhere."
  ] },

  { h: "Pagination" },
  { code: { lang: "python", t: "Offset, and why it fails",
    lines: [
     { c: "GET /orders?limit=50&offset=100", w: "" },
     { c: "SELECT * FROM orders ORDER BY created_at DESC LIMIT 50 OFFSET 100;", w: "" },
     { c: "", w: "" },
     { c: "# Two problems:", w: "" },
     { c: "# 1. OFFSET 100000 makes the database count and", w: "" },
     { c: "#    discard 100,000 rows. It gets slower as you page.", w: "" },
     { c: "# 2. A new row inserted between page 1 and page 2", w: "" },
     { c: "#    SHIFTS EVERYTHING. You see one item twice and", w: "" },
     { c: "#    miss another entirely.", w: "**Silent, and impossible to reproduce on demand.**", hi: true }
    ] } },

  { code: { lang: "python", t: "Cursor pagination, which does not have those problems",
    lines: [
     { c: "GET /orders?limit=50", w: "" },
     { c: "GET /orders?limit=50&after=eyJpZCI6MTIzfQ", w: "**The cursor encodes the position of the last row seen.**", hi: true },
     { c: "", w: "" },
     { c: "SELECT * FROM orders", w: "" },
     { c: "WHERE (created_at, id) < (%(ts)s, %(id)s)", w: "**Tuple comparison**, so ties on the timestamp are broken deterministically by id. Without this, rows with identical timestamps can be skipped or repeated." },
     { c: "ORDER BY created_at DESC, id DESC", w: "" },
     { c: "LIMIT 51;", w: "**Fetch one extra** to know whether there is a next page, without a separate COUNT." },
     { c: "", w: "" },
     { c: "{", w: "" },
     { c: "  \"data\": [...50 items...],", w: "" },
     { c: "  \"next_cursor\": \"eyJpZCI6MTczfQ\",", w: "**Opaque to the client.** Base64 a JSON object so you can change what is inside without breaking anyone.", hi: true },
     { c: "  \"has_more\": true", w: "" },
     { c: "}", w: "" }
    ],
    after: "Cursor pagination is constant time regardless of depth and stable under concurrent inserts. Offset is fine for a small admin table and wrong for anything a user pages through or anything an integration iterates." } },

  { h: "The contract details that get missed" },
  { l: [
   "**Always paginate list endpoints**, from the first version. An endpoint that returns everything works fine until one customer has 80,000 rows, and by then clients depend on the unpaginated shape.",
   "**Set a maximum limit** and clamp silently rather than erroring. `limit=1000000` should return your maximum, not a 400 or a timeout.",
   "**Timestamps in UTC, ISO 8601, with the offset.** `2026-08-27T14:32:00Z`. Never a local time, never a bare unix integer in a public API.",
   "**Money in minor units as an integer**, with an explicit currency. `{\"amount\": 420000, \"currency\": \"INR\"}`. Floats and money do not mix.",
   "**Use `null` deliberately.** Distinguish *not set* from *set to empty*, and document which you mean.",
   "**Return the created object** from a POST, not just an id. It saves the client a round trip and removes a class of race."
  ] },

  { h: "Documentation the API generates itself" },
  { p: "Hand-written API documentation is wrong within a month. Generated documentation is wrong only when the code is. FastAPI produces an OpenAPI schema and an interactive page from your type annotations, which is the strongest argument for using it." },

  { tryit: { t: "Design before you code",
    task: "Design an API for a document-question-answering service. Write the endpoint list, one request and response example each, the error shape, and the pagination scheme — before writing any code. Then give it to someone and see whether they can guess the endpoint for an operation you did not tell them about.",
    hint: "If they can guess it, the design is consistent. If they cannot, find out which convention you broke.",
    sol: { lang: "text", code: "POST   /v1/documents              upload; 202 + job id\nGET    /v1/documents?limit=50     list, cursor-paginated\nGET    /v1/documents/{id}         one document + status\nDELETE /v1/documents/{id}         204\n\nPOST   /v1/questions              ask; returns answer + citations\nGET    /v1/questions?limit=50     history\nGET    /v1/questions/{id}         one Q&A with full citations\n\nGET    /v1/jobs/{id}              poll async ingestion\nGET    /v1/health                 liveness\n\n-- POST /v1/questions --\n{ \"question\": \"What is the ATM limit?\",\n  \"document_ids\": [\"d_1\", \"d_2\"] }        # optional filter\n\n200:\n{ \"id\": \"q_88\",\n  \"answer\": \"Rs 50,000 per day. [1]\",\n  \"citations\": [\n    {\"n\": 1, \"document_id\": \"d_1\", \"page\": 12,\n     \"quote\": \"Daily ATM withdrawal is capped at...\"}\n  ],\n  \"model_version\": \"a3f91c02\",\n  \"created_at\": \"2026-08-27T14:32:00Z\" }\n\n422:\n{ \"error\": \"validation_failed\",\n  \"message\": \"question must not be empty\",\n  \"field\": \"question\",\n  \"request_id\": \"9f2c1e04\" }" },
    w: "Note two choices worth defending. Citations are structured objects rather than markdown in the answer text, so a client can render them as links without parsing prose. And ingestion returns 202 with a job id, because parsing a 200-page PDF cannot finish inside a request — that decision belongs in the design, not discovered later when requests start timing out." } },

  { vocab: ["API Versioning", "Pagination", "Idempotency"] }
 ],
 k: [
  "Resource nouns plus HTTP methods; query parameters for filtering, never new endpoints.",
  "One error shape everywhere, with a stable code, a field and a request id — and never a stack trace.",
  "Version in the URL path, and avoid needing to: adding fields is safe, removing and retyping are not.",
  "Use cursor pagination — offset gets slower with depth and duplicates rows under concurrent writes.",
  "UTC ISO timestamps, money as integer minor units with a currency, and paginate list endpoints from day one."
 ],
 r: ["API", "Pagination", "HTTP", "Idempotency"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "GET /teams/{id}/users?limit=50&after=<cursor>", w: "a nested collection, cursor-paginated" },
   { c: "WHERE (created_at, id) < (%(ts)s, %(id)s)", w: "cursor comparison that breaks ties deterministically" },
   { c: "{'error': code, 'message': msg, 'field': f, 'request_id': rid}", w: "the one error shape" },
   { c: "@app.exception_handler(Exception)", w: "catch-all that logs the trace and returns none of it" },
   { c: "LIMIT 51", w: "one extra row tells you whether there is a next page" }
  ]
 }
}

]);
