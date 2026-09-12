/* Real-world examples and step-by-step flows — crash course, how the web works. */
TD.attach("crash-course", {

"Client": {
 ex: { h: "The person at the counter, whoever they are",
       b: "At a post office, *customer* is a role, not a person — the postmaster becomes a customer the moment they walk into the bank next door. Your API server is a client to its own database. And the reason you never trust a client is the same reason a counter clerk checks the ID rather than believing the form: the other side of the glass is not yours to control." },
 fl: { t: "Why validation runs twice",
       s: ["A form validates the email in the browser",
           { s: "This is a courtesy — instant feedback, no round trip", n: "It is not security. It is user experience." },
           { q: "Can someone skip the browser entirely?",
             y: "Yes — curl, Postman, a modified page. Your validation never ran",
             n: "There is no no. Assume every request is hand-crafted" },
           "The server validates again, and that is the check that counts"] }
},

"Server": {
 ex: { h: "A switchboard that never sleeps",
       b: "It does not call anyone. It sits on a numbered line, waits, and answers whoever rings. One building can host many switchboards on different numbers, which is exactly what your laptop does when the API is on 8000 and the frontend on 3000 — one machine, two servers, two ports." },
 fl: { t: "What happens between listen and respond",
       s: ["The process binds to a port and waits",
           { s: "A connection arrives", n: "The operating system hands it to the process." },
           { s: "The request is parsed and routed to a handler", n: "Method plus path decides which code runs." },
           { q: "Does the handler wait on a database or a network call?",
             y: "An event loop or another thread serves other requests meanwhile",
             n: "It computes the answer directly" },
           "A response is written back and the connection is reused or closed"] }
},

"Request": {
 ex: { h: "A letter to a government department",
       b: "The envelope says which office (the path), the covering line says what you want done (the method), the letterhead carries your reference number (the headers), and the enclosed form is the actual content (the body). Send a *please cancel my licence* to the office that only issues them and you get a polite refusal — a 405." },
 fl: { t: "Why a link preview deleted a record",
       s: ["A `DELETE` action is exposed as `GET /items/7/delete`",
           { s: "Someone shares the link in a chat app", n: "The app fetches it to build a preview." },
           { q: "Is GET supposed to change anything?",
             y: "No — every crawler, proxy and prefetcher assumes it is safe",
             n: "There is no no. The record is now gone" },
           "Destructive actions belong on POST or DELETE, never GET"] }
},

"Response": {
 ex: { h: "The stamp on a returned application",
       b: "APPROVED, WRONG OFFICE, MISSING SIGNATURE, or OUR SYSTEM IS DOWN. You read the stamp before you read anything else, because it tells you whose problem this is. 4xx means you filled the form in wrong; 5xx means the office lost it — and those need completely different next steps." },
 fl: { t: "Reading a failure in thirty seconds",
       s: ["A request failed",
           { q: "Is the status 4xx or 5xx?",
             y: "4xx — your request was wrong. Check auth, body and content type",
             n: "5xx — the server broke. Check its logs, not your payload" },
           { s: "401 versus 403 is the common confusion", n: "401: we do not know who you are. 403: we do, and you may not." },
           "Then read the response body — a good API explains what was wrong"] }
},

"Endpoint": {
 ex: { h: "A desk number in a large office",
       b: "*Desk 12, renewals* is precise; *the building* is not. What makes it work is consistency — every branch numbers desks the same way, so once you know the system you can find anything. That is API design: plural nouns for collections, the id in the path, filters in the query, version at the front." },
 fl: { t: "Why the same path behaves differently",
       s: ["Two calls both go to `/v1/users`",
           { q: "Which method is used?",
             y: "`GET` lists users — safe, cacheable, repeatable",
             n: "`POST` creates one — not safe, not repeatable" },
           { s: "The path names the resource", n: "The method supplies the verb, which is why URLs are nouns." },
           "`/v1/users/7` addresses one; filters like `?active=true` shape the list"] }
},

"Payload": {
 ex: { h: "What is inside the envelope",
       b: "The address, stamp and franking are the envelope; the letter is the payload. And the envelope has to declare what is inside — a customs form saying *documents* when the box holds batteries gets the parcel rejected. That is `Content-Type`, and a mismatch is why a perfectly valid body comes back as a 400." },
 fl: { t: "Why the API rejected a body that looks fine",
       s: ["You POST JSON and get 400 or 415",
           { q: "Does `Content-Type: application/json` appear on the request?",
             y: "The server parsed it — the error is in the shape, so read the message",
             n: "The server tried to parse JSON as form data and gave up" },
           { s: "Then check the body against the schema", n: "A missing required field or a string where a number was expected." },
           "Large uploads need multipart or a pre-signed direct upload, not a JSON body"] }
},

"HTTP Header": {
 ex: { h: "The information printed on a parcel label",
       b: "Fragile, signed-for, sender's account number, keep refrigerated. None of it is the contents, and all of it changes what happens to the parcel. Headers work the same way, which is why so many API mysteries — the 401, the CORS error, the stale page — are solved by reading them rather than the body." },
 fl: { t: "Debugging a request from the network tab",
       s: ["The call fails and the body is unhelpful",
           { s: "Open the request headers", n: "Is `Authorization` present and does the token look right?" },
           { q: "Is it a CORS error in the console?",
             y: "Look at the *response* headers — the server must send `Access-Control-Allow-Origin`",
             n: "Check `Content-Type` and `Accept` on both sides" },
           "`Cache-Control` explains why you are still seeing yesterday's data"] }
},

"Query Parameter": {
 ex: { h: "The filters on a library catalogue search",
       b: "*Fiction, published after 2010, sorted by date, page 3* — none of that changes which library you are in, only which slice of the shelves you are shown. That is the whole distinction: the path says where, the query says which subset, in what order, how much." },
 fl: { t: "Why a search with an ampersand breaks",
       s: ["The user searches for `Marks & Spencer`",
           { q: "Was the value URL-encoded?",
             y: "`?q=Marks%20%26%20Spencer` — one parameter, correct value",
             n: "The `&` starts a new parameter and the query becomes `Marks `" },
           { s: "Never build query strings by hand", n: "Use `URLSearchParams` or your client's params option." },
           "And never put a token in one — query strings appear in logs and referrers"] }
},

"Serialization": {
 ex: { h: "Flat-packing furniture to post it",
       b: "The wardrobe cannot go through the letterbox as a wardrobe. It is disassembled into a flat box with an instruction sheet, posted, and rebuilt at the other end. What arrives is a wardrobe again — but anything that could not be flat-packed, like the mirror's exact colour of glass, quietly did not survive the trip." },
 fl: { t: "Where the date went wrong",
       s: ["Your object holds a real datetime",
           { s: "JSON has no date type", n: "It becomes a string, and the timezone comes with it or does not." },
           { q: "Did you serialise as ISO 8601 in UTC?",
             y: "The other end can parse it unambiguously",
             n: "You are one timezone assumption away from an off-by-hours bug" },
           { s: "Large integers are the other casualty", n: "JavaScript loses precision above 2^53 — send IDs as strings." },
           "Never deserialise untrusted data with `pickle` or `eval`"] }
},

"Cache": {
 ex: { h: "The pastry case at the front of a bakery",
       b: "Nobody bakes a croissant when you ask for one. They were baked at six and sit where they can be handed over instantly. The trade is freshness: at four in the afternoon that croissant is not what it was. Every cache makes exactly this bargain, and the only real question is how stale you can tolerate." },
 fl: { t: "Deciding what to cache",
       s: ["A page feels slow",
           { s: "Measure first — find the actual bottleneck", n: "Caching a fast layer changes nothing." },
           { q: "Is the slow thing the same for everyone?",
             y: "Cache it — one computation serves every visitor",
             n: "Per-user data must be keyed by user, or you leak one user's data to another" },
           { s: "Prefer a short expiry to clever invalidation", n: "Knowing when a cached answer went wrong is genuinely hard." },
           "Measure again — the bottleneck has moved somewhere else"] }
},

"Throughput": {
 ex: { h: "A motorway versus a single fast car",
       b: "A wider motorway moves more cars per hour; it does not make any individual journey shorter. Adding lanes is throughput, and raising the speed limit is latency. Confusing them is why teams add servers to fix a slow page, and why the page stays slow." },
 fl: { t: "Why the average latency lies",
       s: ["A dashboard shows 100 ms average response time",
           { q: "What does the p99 say?",
             y: "4 seconds — one request in a hundred is having a terrible time",
             n: "Also around 100 ms — the system is genuinely even" },
           { s: "Averages hide exactly the requests that hurt", n: "Ten thousand fast ones bury a hundred awful ones." },
           "Quote p50, p95 and p99, and set alerts on the tail"] }
},

"Bandwidth": {
 ex: { h: "A wide pipe with a long run to the house",
       b: "The main can carry a bathful a minute, but the water still takes eight seconds to arrive after you open the tap. Widening the pipe does nothing about those eight seconds. On mobile, latency dominates — which is why cutting the number of requests usually helps far more than shrinking each one." },
 fl: { t: "Making a page fast on a train",
       s: ["The page is 4 MB and makes 90 requests",
           { q: "Is the problem the size or the number of round trips?",
             y: "Size — compress, resize images, drop unused JavaScript",
             n: "Round trips — bundle, inline critical CSS, preconnect" },
           { s: "On a mobile network, each round trip can cost 100 ms or more", n: "Ninety of them is nine seconds before anything renders." },
           "Measure on a throttled connection, not on office wifi"] }
},

"Bottleneck": {
 ex: { h: "One passport desk open at arrivals",
       b: "The plane landed on time, the bags are already out, the taxis are waiting — and everyone is standing in the same queue. Making the baggage belt faster changes nothing at all. That is why optimisation guided by instinct so often produces no measurable improvement: the fast stage was never the problem." },
 fl: { t: "Finding the real one",
       s: ["A request takes 2 seconds",
           { s: "Profile it or read a trace", n: "Do not guess — intuition is wrong more often than not." },
           { q: "Where does the time actually go?",
             y: "Usually the database: a missing index, or N+1 queries in a loop",
             n: "Occasionally an unbatched external call, or serialisation of a huge payload" },
           { s: "Fix that one thing and measure again", n: "The bottleneck has now moved; the next one may not be worth fixing." }] }
},

"Uptime": {
 ex: { h: "A corner shop that closes for an afternoon",
       b: "99% sounds like a shop that is basically always open. It is closed for three and a half days a year — and if all of that falls on the December weekend, nobody cares about the annual average. Which is why the honest question is not how many nines, but what failure looks like and when it lands." },
 fl: { t: "Choosing a realistic target",
       s: ["Someone asks for five nines",
           { s: "Convert it to time", n: "99.999% is five minutes a year. 99.9% is nearly nine hours." },
           { q: "What does an hour of downtime actually cost?",
             y: "If it is small, buy graceful degradation instead of another nine",
             n: "Each nine costs roughly ten times the last one" },
           "Serving stale cache when the database is down is usually the cheaper win"] }
},

"Metric": {
 ex: { h: "The instrument panel, not the flight recorder",
       b: "Six dials you glance at constantly, versus a black box you only open after something goes wrong. Metrics are the dials — cheap, continuous, glanceable. Logs are the recorder: detailed, expensive at volume, read after the fact. A cockpit with forty dials nobody watches is worse than six that someone does." },
 fl: { t: "Choosing what to put on the wall",
       s: ["You are building a dashboard",
           { s: "Start with the four golden signals", n: "Latency, traffic, errors, saturation." },
           { q: "Would a human take action on this alert right now?",
             y: "Keep it — page someone",
             n: "Make it a dashboard panel, not an alert" },
           "An alert nobody acts on trains the team to ignore all alerts"] }
},

"Polling": {
 ex: { h: "A child asking *are we there yet*",
       b: "It works. It is also almost entirely wasted breath, and it scales badly with the number of children. Polling is fine when updates are rare and a few seconds of delay is acceptable — and it is the right answer far more often than websocket enthusiasts admit." },
 fl: { t: "Polling without wasting everyone's resources",
       s: ["A dashboard refreshes on a timer",
           { q: "Is the browser tab visible?",
             y: "Poll at the normal interval",
             n: "Skip the request entirely — nobody is looking" },
           { s: "Back off when the answer keeps being *nothing new*", n: "5s, then 10s, then 30s." },
           "If updates are frequent and immediacy matters, move to SSE or websockets"] }
},

"Long Polling": {
 ex: { h: "Waiting on hold instead of ringing back",
       b: "Rather than calling every two minutes to ask, you stay on the line and they speak when there is news. You occupy a line the whole time, which is the cost — and the switchboard will cut you off after a while, which is why the hold has to be shorter than the network's patience." },
 fl: { t: "How the connection is held",
       s: ["The client sends a request and waits",
           { q: "Is there news within the timeout?",
             y: "The server responds immediately with the update",
             n: "The server responds empty just before the timeout" },
           { s: "The client immediately asks again", n: "So there is almost always an open connection per client." },
           "Keep the hold shorter than any proxy's idle timeout, or it is cut mid-wait"] }
},

"Debounce": {
 ex: { h: "A lift door that waits for the corridor to clear",
       b: "It does not close and reopen for each arriving passenger. It waits until nobody has stepped in for two seconds, then goes. Debouncing a search box is the same: ignore the flurry of keystrokes, act once the typing stops, and send one request for the finished word." },
 fl: { t: "Search-as-you-type, without ten requests",
       s: ["The user starts typing a five-letter query",
           { s: "Each keystroke resets a 300 ms timer", n: "No request has been sent yet." },
           { q: "Did they pause for 300 ms?",
             y: "Fire one request, for the complete text",
             n: "Keep resetting — they are still typing" },
           { s: "Cancel any request still in flight", n: "Otherwise a slow earlier answer overwrites a fresh one." }] }
},

"Throttle": {
 ex: { h: "A ticket barrier that admits one person a second",
       b: "However many people push, the gate opens at a steady rate. That is different from waiting for the crowd to disperse. Scroll handlers want the steady drip — you need a regular sample of where the page is, not the final resting position ten seconds later." },
 fl: { t: "Debounce or throttle?",
       s: ["An event fires far more often than you can handle",
           { q: "Do you need the final value, or a running sample?",
             y: "Final value — debounce. Search, autosave, resize-then-recalculate",
             n: "Running sample — throttle. Scroll position, drag, progress" },
           { s: "Throttle guarantees a maximum rate", n: "Debounce guarantees only one call, eventually." },
           "The server-side cousin of throttling is rate limiting"] }
},

"Blocking": {
 ex: { h: "One till, and the customer is on the phone to their bank",
       b: "The queue does not move. Not because the cashier is slow, but because they are standing there waiting for something outside their control. A non-blocking cashier would serve the next three people and come back. Node has exactly one till, which is why one synchronous file read freezes everything." },
 fl: { t: "Why one slow call stalled every request",
       s: ["An async server handles hundreds of concurrent requests",
           { q: "Does a handler call a synchronous function?",
             y: "The event loop stops there — every other request waits too",
             n: "The thread is released while waiting and serves others" },
           { s: "Common culprits", n: "`readFileSync`, a CPU-heavy loop, a blocking database driver." },
           "Await the async version, or move heavy work to a worker or a queue"] }
},

"Stateless": {
 ex: { h: "A ticket that works at any turnstile",
       b: "The barrier does not remember you; the ticket carries everything needed to decide. That is why the station can open a second gate at rush hour without anyone being turned away. The moment a gate keeps its own list of who has passed, the gates stop being interchangeable." },
 fl: { t: "Why users get logged out at random",
       s: ["Sessions are stored in each server's memory",
           { s: "You scale from one instance to three", n: "A load balancer now spreads requests across them." },
           { q: "Does the next request land on the same instance?",
             y: "It works — one time in three",
             n: "That server has never heard of this session: logged out" },
           "Move the session into a signed token, a shared cache, or the database"] }
},

"SSL Certificate": {
 ex: { h: "A passport, and the country that issued it",
       b: "The border does not trust you because you say who you are; it trusts a document signed by an authority it already recognises, and it checks the expiry date. A browser does exactly this, and an expired certificate fails at the border for the same reason an expired passport does." },
 fl: { t: "How the padlock is earned",
       s: ["The browser connects and asks for the certificate",
           { s: "It checks the signature chain up to a trusted root", n: "The root list ships with the browser or the OS." },
           { q: "Does the name match and is it in date?",
             y: "An encrypted session is negotiated and the padlock appears",
             n: "A full-page warning — and most users leave" },
           { s: "Let's Encrypt renews every 90 days automatically", n: "Until the renewal job breaks silently in March." },
           "Alert on expiry weeks ahead — it is the most preventable outage there is"] }
},

"UUID": {
 ex: { h: "A cloakroom ticket versus a numbered seat",
       b: "Ticket 1042 tells a rival exactly how many coats you have taken today, and lets anyone try 1041 and 1043 to see what turns up. A random ticket reveals nothing and cannot be guessed. It is longer, which is the price — and a modern time-ordered version wins back the filing convenience." },
 fl: { t: "Picking an identifier for a new table",
       s: ["You need a primary key",
           { q: "Will ids ever be visible to users or partners?",
             y: "Use a UUID — no enumeration, no leaked counts",
             n: "A sequential integer is smaller and indexes beautifully" },
           { s: "Random v4 scatters across the index", n: "On a large table that hurts insert performance measurably." },
           "UUID v7 puts a timestamp first — unguessable and roughly sortable"] }
},

"Timestamp": {
 ex: { h: "A postmark, not a wall clock",
       b: "The postmark records the moment in one agreed reference, and the recipient converts to their own time when they read it. Store UTC, display local. The alternative — everyone writing their own wall-clock time with no zone — is how a booking system ends up double-booking a room at 2 a.m. in October." },
 fl: { t: "Storing a moment so it survives travel",
       s: ["An event happens",
           { s: "Capture it as an aware UTC datetime", n: "Never a naive local time." },
           { s: "Store as UTC; transmit as ISO 8601 with the offset", n: "Unix seconds are fine for comparison and arithmetic." },
           { q: "Are you showing it to a person?",
             y: "Convert to their zone at the very last moment, for display only",
             n: "Keep it in UTC through every calculation" }] }
},

"Time Zone": {
 ex: { h: "A rota written in local time, twice a year",
       b: "The clocks go back and 01:30 happens twice. A shift scheduled then is either worked twice or not at all, depending on who reads it. Governments also change the rules with weeks of notice, which is why an offset hard-coded today is a bug scheduled for a future date you have not chosen." },
 fl: { t: "Why a nightly job ran twice",
       s: ["A job is scheduled for 02:30 local time",
           { q: "What happens on a daylight-saving night?",
             y: "In spring, 02:30 does not exist — the job is skipped entirely",
             n: "In autumn, 02:30 happens twice — the job runs twice" },
           { s: "Schedule in UTC instead", n: "The moment is unambiguous and the rules cannot move it." },
           "Use zone names like `Europe/London`, never a fixed `+01:00`"] }
},

"Base64": {
 ex: { h: "Spelling a name with the phonetic alphabet",
       b: "*Alpha, Delta, Alpha* gets the name through a noisy radio channel that cannot carry the letters directly. It is longer and completely public — anyone listening understands it instantly. That is base64: a way of surviving a text-only channel, and no kind of secrecy whatsoever." },
 fl: { t: "Why a JWT is readable but still trustworthy",
       s: ["A token arrives as three dot-separated chunks",
           { s: "The middle chunk is base64 — decode it and read the claims", n: "Anyone holding the token can do this in a second." },
           { q: "So can anyone forge one?",
             y: "No — the third chunk is a signature they cannot reproduce",
             n: "Encoding hides nothing; the signature is what makes it trustworthy" },
           "Never put anything secret in a token payload"] }
},

"Encoding": {
 ex: { h: "Reading Morse with the wrong codebook",
       b: "The dots and dashes arrive perfectly and come out as gibberish, because sender and receiver disagreed on what the symbols mean. Mojibake — those Ã© sequences — is exactly that: correct bytes, wrong codebook. UTF-8 is the codebook everyone should be using at every step of the chain." },
 fl: { t: "Tracking down garbled characters",
       s: ["A name shows as `Ã©` instead of `é`",
           { s: "The bytes are UTF-8 but something read them as Latin-1", n: "Or the reverse. The data is usually still intact." },
           { q: "Is every link in the chain explicitly UTF-8?",
             y: "File read, database column, connection, HTTP header, HTML meta tag",
             n: "Find the one that is guessing — that is where it broke" },
           "One character is not one byte outside ASCII; length checks must count characters"] }
},

"Filtering": {
  ex: { h: "Asking the archivist rather than fetching every box",
        b: "You do not have all four thousand boxes wheeled to your desk so you can look for the 1987 ones. You ask for 1987 and six boxes arrive. Filtering in the database is asking the archivist; filtering in application code is the trolley." },
  fl: { t: "Where the filter should happen",
        s: ["You need active users only",
            { q: "Does the filter run in the database?",
              y: "Only matching rows cross the network — fast and cheap",
              n: "You fetched everything and discarded most of it" },
            { s: "Check the filtered column has an index", n: "Otherwise the database scans every row to answer you." },
            "Combine with pagination — even a filtered list can be enormous"] }
},

"TCP Three-Way Handshake": {
  ex: { h: "The walkie-talkie radio check",
        b: "Before sending sensitive coordinates over a walkie-talkie, soldier A says 'Do you copy? Over' (SYN). Soldier B replies 'Loud and clear, do you copy me? Over' (SYN-ACK). Soldier A says 'Roger, copy you loud and clear' (ACK). Now both sides know with 100% certainty that transmission and reception work in both directions." },
  fl: { t: "The three packets that open every TCP stream",
        s: ["Client initiates connection to server port",
            { s: "Step 1 (SYN): Client sends starting sequence number `seq=X`", n: "Advertises client receive window." },
            { s: "Step 2 (SYN-ACK): Server acknowledges `ack=X+1` and sends `seq=Y`", n: "Server confirms it can receive." },
            { s: "Step 3 (ACK): Client acknowledges `ack=Y+1`", n: "Connection established!" },
            "Payload data begins flowing on subsequent packets"] }
},

"DNS Resolution": {
  ex: { h: "Asking a hotel concierge for a restaurant address",
        b: "You know the restaurant name 'Luigi's Pizza', but the taxi driver needs coordinates. You ask the concierge, who checks the city business directory, looks up the street name, and hands the driver the exact physical address '142 Main St'." },
  fl: { t: "How a domain name becomes an IP address",
        s: ["Browser requests `termdex.com`",
            { q: "Is the IP cached in browser or OS DNS cache?",
              y: "Instant cache hit — connect directly to IP",
              n: "Recursive resolver queries DNS hierarchy (Root -> `.com` TLD -> Authoritative)" },
            { s: "Authoritative server returns IP address `93.184.216.34`", n: "Cached according to TTL." },
            "Browser connects to the resolved IP address over TCP"] }
},

"Hashing vs Encryption": {
  ex: { h: "A padlocked safe vs a bluberry smoothie",
        b: "Encryption is putting a secret in a steel safe with a key: anyone with the key can open the safe and get the exact paper back (reversible). Hashing is putting fruit into a high-speed blender: you can easily turn strawberries and bananas into a pink smoothie, but no blender in the universe can reverse the smoothie back into whole strawberries." },
  fl: { t: "Choosing between encryption and hashing",
        s: ["You need to protect sensitive data",
            { q: "Will the original plaintext ever need to be read back again?",
              y: "Encryption (AES/RSA): two-way, decryptable with secret key",
              n: "Hashing (bcrypt/SHA-256): one-way, irreversible fingerprint for passwords/integrity" },
            { s: "Never store user passwords using reversible encryption", n: "Always use salted slow hashes (bcrypt)." },
            "Use encryption for data in transit (TLS) and confidential files at rest"] }
},

"Load Balancing": {
  ex: { h: "The bank queue coordinator",
        b: "Instead of customers randomly piling up in front of teller #1 while teller #2 and #3 sit idle, a coordinator at the front of the queue guides each customer to whichever teller just finished their previous transaction, keeping wait times minimal and staff utilized." },
  fl: { t: "How a load balancer routes traffic",
        s: ["Incoming web request arrives at public IP",
            { s: "Load balancer inspects health status of backend server pool", n: "Failed nodes automatically excluded." },
            { q: "Which routing algorithm is configured?",
              y: "Round Robin / Least Connections: distributes load evenly across cluster",
              n: "IP Hash / Sticky Sessions: pins user to specific server for session cache" },
            "Request forwarded to chosen backend server; response relayed back to client"] }
}

});
