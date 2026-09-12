/* Real-world examples and step-by-step flows — crash course, the web, file
   formats and everyday tooling. */
TD.attach("crash-course", {

"URL Anatomy": {
 ex: { h: "A postal address, read from the outside in",
       b: "Country, city, street, house, then *ask for Priya*. A URL is the same funnel: protocol, machine, door, path, options — and finally the fragment, which is the equivalent of *she is in the back room*. That last part never leaves your hands; the postman does not need it, and the server never receives it either." },
 fl: { t: "Reading an unfamiliar URL",
       s: ["You are handed a long URL and something is wrong",
           { s: "Split it at `?` first", n: "Everything before is the address; everything after is options." },
           { q: "Is there a `#` in it?",
             y: "Everything after it is browser-only and never reaches the server",
             n: "Then the whole thing is sent" },
           { s: "Repeated keys are normal", n: "`?tag=a&tag=b` is a list, not a mistake." },
           "A `%` followed by two hex digits is an escaped character, not corruption"] }
},

"URL Encoding": {
 ex: { h: "Saying *comma* out loud when dictating",
       b: "Dictating an address, you say *comma* and the listener writes a punctuation mark. If you actually want the word, you have to say so explicitly. Percent-encoding is that explicit marker: `%26` means *the ampersand character*, not *the separator between parameters* — and forgetting it is how a search for `cats & dogs` becomes a search for `cats ` plus a mysterious extra parameter called `dogs`." },
 fl: { t: "A search silently loses half its query",
       s: ["Searching for *cats & dogs* returns results for *cats*",
           { q: "Was the URL built by joining strings?",
             y: "The `&` in the value started a new parameter. That is the bug",
             n: "Check whether the encoder ran on the whole URL by mistake" },
           { s: "Encode values, not the whole URL", n: "`encodeURIComponent`, not `encodeURI` — the latter leaves `&` alone." },
           { s: "Better: never build the string yourself", n: "`urlencode` in Python, `URLSearchParams` in JavaScript." },
           "The failure is silent — no error, just quietly wrong results"] }
},

"HTTP Status Code Families": {
 ex: { h: "The first digit answers *whose problem is this?*",
       b: "Before looking anything up, the leading digit has told you where to go next. A 4 means read your own request again. A 5 means read their status page, and consider retrying. Getting that reflex is worth more than memorising the difference between 502 and 504, because it decides what you do in the next thirty seconds." },
 fl: { t: "An API call failed",
       s: ["You get a non-200 response",
           { q: "Does the code start with 4 or 5?",
             y: "4xx — your request is wrong. Retrying sends the same wrong request",
             n: "5xx — their side. This one is worth retrying with backoff" },
           { s: "401 versus 403 are different fixes", n: "401: your credentials failed. 403: they worked, and you lack permission." },
           { s: "429 is its own case", n: "Not your fault, not theirs — you are simply going too fast." },
           "Read the response body; most APIs explain the 4xx in it"] }
},

"CRUD": {
 ex: { h: "Every app is a filing cabinet",
       b: "Add a folder, read one, amend one, throw one away. Under the features and the design, almost every screen you have ever built is one of those four against some kind of record. Seeing it that way is genuinely useful early: you can guess the endpoints, the tables and the permissions before anyone has specified them." },
 fl: { t: "Mapping a feature to endpoints",
       s: ["*Users should be able to manage their saved addresses*",
           { s: "The resource is an address", n: "Name the noun first; the verbs follow from it." },
           { s: "Create, read, update, delete — four endpoints", n: "POST, GET, PUT/PATCH, DELETE on `/addresses`." },
           { q: "Should delete really remove the row?",
             y: "Only if nothing references it and no audit trail is needed",
             n: "Soft delete — a `deleted_at` column — is the usual answer" },
           "Every list endpoint needs pagination from day one, not later"] }
},

"Rate Limit": {
 ex: { h: "Everyone crowding back to the door at once",
       b: "A shop closes briefly and reopens. If every waiting customer pushes in at the same second, it closes again. Retrying without jitter is exactly that: a hundred clients that all failed at 12:00:03 all retry at 12:00:04, recreating the spike that caused the limit. The random extra fraction of a second is what spreads the crowd out." },
 fl: { t: "Handling a 429 properly",
       s: ["The API returns 429 Too Many Requests",
           { q: "Is there a `Retry-After` header?",
             y: "Obey it exactly — they have told you the answer",
             n: "Back off exponentially: 1s, 2s, 4s, 8s" },
           { s: "Add random jitter to every wait", n: "Without it, all your clients retry in lockstep." },
           { s: "Cap the retries and then fail properly", n: "Infinite retry is how a small blip becomes an outage." },
           "Watch `X-RateLimit-Remaining` and slow down before you are cut off"] }
},

"MIME Type": {
 ex: { h: "The label on the box, not the shape of it",
       b: "A courier reads *fragile — glass* and handles it accordingly. The label is what drives behaviour, not the contents, which is both the point and the hazard. Send perfectly good JSON labelled `text/plain` and the client treats it as a string; let a user upload a script labelled `image/png` and something may well execute it." },
 fl: { t: "*Why is my JSON a string?*",
       s: ["The client received valid JSON and did not parse it",
           { q: "What Content-Type did the response carry?",
             y: "`application/json` — then the bug is elsewhere",
             n: "`text/plain` or missing. The client did exactly as it was told" },
           { s: "Set it explicitly on the server", n: "Most frameworks do; hand-rolled responses often do not." },
           { s: "Include the charset for text types", n: "`text/html; charset=utf-8`." },
           "On uploads, never trust the declared type — inspect the actual bytes"] }
},

"Redirect": {
 ex: { h: "A permanent forwarding order you cannot cancel",
       b: "Tell the post office *permanently*, and they stop even checking the old address — which is wonderful until you move back. A 301 is cached in every visitor's browser, so a mistaken one keeps sending people to the wrong place long after you have fixed the server. This is the whole argument for reaching for 302 when you are unsure." },
 fl: { t: "Choosing a redirect code",
       s: ["A URL needs to point somewhere else",
           { q: "Is this move permanent and certain?",
             y: "301 — search engines transfer ranking, browsers cache hard",
             n: "302 or 307 — re-checked every time, and reversible" },
           { s: "Unsure means 302", n: "You can promote it to 301 later; you cannot easily recall a 301." },
           { s: "Use 307/308 to preserve the method", n: "301 and 302 may turn a POST into a GET." },
           "Chained redirects cost a round trip each — point straight at the final URL"] }
},

"Cookie and Session": {
 ex: { h: "A cloakroom ticket",
       b: "The ticket is meaningless — a number on card stock — and the coat stays behind the counter. That is a session: the cookie holds an id, the real data sits on the server. It also makes the risk obvious. Anyone holding your ticket collects your coat, and nobody at the counter asks who they are." },
 fl: { t: "Setting a session cookie safely",
       s: ["A user logs in and you need to remember them",
           { s: "Store an opaque id in the cookie, data on the server", n: "The cookie should reveal nothing by itself." },
           { q: "Does JavaScript need to read it?",
             y: "Almost certainly not — and saying yes costs you XSS protection",
             n: "Set `HttpOnly`" },
           { s: "`Secure` so it never travels over plain http", n: "And `SameSite=Lax` to limit cross-site sending." },
           "Set an expiry. A session cookie that never expires is a password"] }
},

"CSV": {
 ex: { h: "The format that has no rules and everyone follows anyway",
       b: "There is no authority, no type system and no way to state the encoding, and every tool on earth reads it. That combination is exactly why it hurts: two programs disagree about quoting, Excel decides your product code is a date, and nothing anywhere reports an error. The file loads fine and the data is wrong." },
 fl: { t: "A CSV import produced wrong data",
       s: ["Rows imported, values are mangled",
           { q: "Did you parse with `split(',')`?",
             y: "That breaks on the first quoted comma. Use the CSV library",
             n: "Check the encoding next" },
           { s: "Garbled accents mean an encoding mismatch", n: "Open it as UTF-8 explicitly rather than guessing." },
           { s: "Leading zeros gone? Dates where codes were?", n: "Excel touched it. Treat those columns as text." },
           "Ask for the delimiter and encoding up front — never infer them"] }
},

"UTF-8": {
 ex: { h: "Reading French with a Spanish pronunciation guide",
       b: "The letters are all there and the sounds come out wrong. Mojibake is precisely that: correct bytes, read with the wrong table. `cafÃ©` is not damaged text — it is UTF-8 being read as Latin-1, and the fix is to correct the reading, never to strip the strange characters out." },
 fl: { t: "Text is full of question marks or `Ã©`",
       s: ["Characters display incorrectly",
           { q: "Is it `Ã©`-style mojibake, or literal `?` marks?",
             y: "Mojibake — the bytes are fine, the declared encoding is wrong",
             n: "Question marks usually mean the data was already destroyed on write" },
           { s: "Declare UTF-8 at every boundary", n: "File open, database column, HTTP header, HTML meta tag." },
           { s: "In MySQL use `utf8mb4`, not `utf8`", n: "MySQL's `utf8` is 3-byte and silently breaks emoji." },
           "Fix the earliest point in the chain; later fixes just move the damage"] }
},

"Line Endings": {
 ex: { h: "An invisible extra character at the end of every line",
       b: "Nothing looks wrong. The file opens, the diff shows every line changed, and a shell script dies complaining about `/bin/bash^M` — which is `/bin/bash` plus a carriage return that the kernel dutifully treated as part of the path. The whole family of symptoms comes from one character you cannot see." },
 fl: { t: "`bad interpreter: /bin/bash^M`",
       s: ["A shell script fails immediately with a strange error",
           { s: "That `^M` is a Windows carriage return", n: "The file has CRLF endings; the shebang line ends in `\\r`." },
           { q: "Do you need to fix just this file, or the whole repo?",
             y: "`dos2unix script.sh` fixes one now",
             n: "Commit a `.gitattributes` so it stops happening to everyone" },
           { s: "`* text=auto` plus `*.sh text eol=lf`", n: "Applies to every clone, unlike a local git setting." },
           "A diff showing every line changed with no visible change is the same cause"] }
},

"Markdown": {
 ex: { h: "Formatting that survives being read as plain text",
       b: "That is the whole design goal, and it is why it beat the alternatives. An email written in Markdown is readable as an email. A README is readable in a terminal, in an editor and rendered on a web page, with no conversion step and no tooling — which is exactly what a README needs to be." },
 fl: { t: "Writing a README people read",
       s: ["A new project needs a README",
           { s: "What it is, in one sentence, at the top", n: "Before installation, before badges." },
           { s: "How to run it — the exact commands", n: "In a fenced block, tagged with the language." },
           { q: "Did you tag the code fences with a language?",
             y: "Highlighted and readable",
             n: "An untagged block is a grey wall — always tag it" },
           "Blank lines separate paragraphs; a single newline usually renders as nothing"] }
},

"Escaping": {
 ex: { h: "Quotation marks around a quotation",
       b: "Writing *she said \"stop\"* needs a way to show which quotes are yours and which are hers. Every system has this problem and every system solves it with an escape character. Injection attacks are what happens when the marks are missing — the reader cannot tell the quotation from the instruction, and follows both." },
 fl: { t: "Handling untrusted text safely",
       s: ["User input must go into a query, a page or a command",
           { q: "Are you building the string by concatenation?",
             y: "Stop — this is how injection happens, in every language",
             n: "Good. Which tool is doing the escaping?" },
           { s: "SQL: parameterised queries, always", n: "The driver escapes; you never touch the string." },
           { s: "HTML: a template engine that escapes by default", n: "Turning escaping off should be a conscious, rare act." },
           "Shell: pass an argument list, never a single assembled command string"] }
},

"Debugger and Breakpoints": {
 ex: { h: "Pausing the film to look at one frame",
       b: "You can rewind and squint at full speed, or you can stop on the frame and examine every detail at leisure. Print statements are squinting: each one requires guessing in advance what will matter, then re-running. A breakpoint stops the frame and lets you inspect everything that is there, including the thing you would never have thought to print." },
 fl: { t: "Moving beyond print statements",
       s: ["A value is wrong and you do not know why",
           { s: "Put a breakpoint just before it goes wrong", n: "`breakpoint()` in Python, or click the editor's gutter." },
           { s: "Inspect every variable in scope, not just the suspect", n: "The cause is often something you would not have printed." },
           { q: "Is it inside a loop that runs 10,000 times?",
             y: "Use a conditional breakpoint — stop only when the condition holds",
             n: "Step through one line at a time" },
           "Walk up the call stack to see who called this, with what"] }
},

"Log Level": {
 ex: { h: "A smoke alarm that goes off when the toast is done",
       b: "After a week, nobody looks up. Logging every handled exception at ERROR does exactly this to your alerting — the signal is technically present and no human reacts to it any more. Levels exist so that ERROR keeps meaning *a person must look at this now*." },
 fl: { t: "Choosing a level as you write the line",
       s: ["You are about to log something",
           { q: "Must a human act on this, today?",
             y: "ERROR — and it should be rare enough to stay meaningful",
             n: "Not an error, whatever the code did" },
           { s: "Recovered, but suspicious? WARNING", n: "A retry that succeeded, a fallback that fired." },
           { s: "Normal operation worth recording? INFO", n: "Keep it to the handful that describe what happened." },
           "Everything else is DEBUG — off in production, priceless when turned on"] }
},

"Profiler": {
 ex: { h: "A stopwatch on every function, not a hunch",
       b: "Ask a team where the time goes and you get confident, contradictory answers. Run a profiler and the answer is often something nobody named — a logging call, a repeated import, a query inside a loop. It is routinely humbling, and that is precisely its value." },
 fl: { t: "Reading a profile",
       s: ["You have a profile and a wall of numbers",
           { s: "Sort by cumulative time first", n: "It shows which whole subtree is expensive." },
           { q: "Is the top entry doing the work, or calling it?",
             y: "*Own* time is high — this function itself is slow",
             n: "It is a wrapper; look at what it calls" },
           { s: "Check the call counts", n: "50,000 calls to one function is usually an N+1 problem." },
           "Fix the top item, then profile again — the shape changes completely"] }
},

"Hot Reload": {
 ex: { h: "The difference between a sketch and a photograph",
       b: "When a change appears in half a second you try five things; when it takes twenty you try one and think hard first. Neither is wrong, but the fast loop changes what kind of work is possible — you explore rather than plan. That is the real reason it matters, more than the seconds saved." },
 fl: { t: "When behaviour makes no sense",
       s: ["The app is doing something impossible given the code",
           { q: "Have you restarted fully since the change?",
             y: "Then debug it properly — the state is real",
             n: "Restart first. Hot reload leaves stale state surprisingly often" },
           { s: "Module-level state survives a hot swap", n: "Caches, connections and singletons keep their old values." },
           { s: "A full restart takes ten seconds", n: "Cheaper than twenty minutes debugging a ghost." },
           "Never enable reload in production — it is a development tool"] }
},

"Estimation": {
 ex: { h: "*How long to drive there?* depends on the traffic",
       b: "Nobody answers that question with a single number and expects to be held to the second. They say *forty minutes, an hour if the ring road is bad* — a range with the risk named. Software estimates are worse than driving, because you are estimating a route you have not seen, and a single number claims a precision that nobody has." },
 fl: { t: "Producing an estimate you can defend",
       s: ["You are asked how long something will take",
           { q: "Can you break it into pieces under a day each?",
             y: "Do that, estimate each, and add them up",
             n: "You do not understand it well enough yet" },
           { s: "Cannot break it down? Timebox a spike first", n: "*Two days to investigate, then I can estimate properly.*" },
           { s: "Give a range, and say what drives the top end", n: "*Four to six days; six if the legacy import fights back.*" },
           "Include review, testing and the failure path — that is where the time goes"] }
},

"Technical Specification": {
 ex: { h: "Cheaper to move a wall on paper",
       b: "An architect who has drawn the plan can be told *the kitchen door opens into the stairwell* for the price of an afternoon. The same sentence after the wall is built costs a great deal more. A spec is the drawing, and its whole value is arriving before anything is poured." },
 fl: { t: "Writing one worth reading",
       s: ["A piece of work is big enough to be worth planning",
           { s: "State the problem before any solution", n: "If you cannot write it clearly, you are not ready to build." },
           { s: "Propose one approach, and name the alternatives", n: "Say why you rejected them — that is the most reused section." },
           { q: "Has anyone outside your team read it?",
             y: "Good — they are who catches the cross-system breakage",
             n: "Circulate it. The objection is the entire point" },
           "Two pages that get read beat twenty that do not"] }
}

});
