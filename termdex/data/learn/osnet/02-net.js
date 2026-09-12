/* Operating Systems & Networking — the networking half.

   Built around the question every interviewer asks: what happens when you
   type a URL and press enter. That question is not really about trivia --
   it tests whether you see DNS, TCP, TLS and HTTP as one chain, and whether
   you know which link breaks when.

   Every lesson ends at a command you can run to see the thing for yourself. */

TD.addLessons("osnet", [

/* ==================================================================== */
{
 t: "Layers, Addresses and Ports",
 m: "netbasics",
 lvl: "core",
 s: "The map everything else hangs on — and why layering is what makes the internet possible.",
 goal: [
  "Name the four TCP/IP layers and what each is responsible for",
  "Explain the difference between an IP address, a port and a MAC address",
  "Read a CIDR block and say how many addresses it holds"
 ],
 b: [
  { p: "Networking is layered, and the layering is not academic tidiness — it is the reason the internet works at all. Each layer solves one problem and assumes the layer below solved its own. Your HTTP request does not know or care whether it travels over fibre, copper or radio." },

  { h: "The four layers you actually use" },
  { tbl: { t: "TCP/IP, top to bottom",
    h: ["Layer", "Job", "Addresses by", "Examples"],
    rows: [
     ["**Application**", "What the bytes *mean*", "URL / hostname", "HTTP, DNS, SSH, SMTP"],
     ["**Transport**", "Delivering to the right program", "Port number", "TCP, UDP, QUIC"],
     ["**Internet**", "Getting across networks", "IP address", "IP, ICMP"],
     ["**Link**", "Getting across one wire or hop", "MAC address", "Ethernet, Wi-Fi"]
    ] } },
  { p: "The seven-layer OSI model is what textbooks and interviews reference, but the four above are what exists in practice. Know that OSI splits the application layer into three (session, presentation, application) and you have covered the usual follow-up question." },

  { ana: "A letter inside an envelope inside a mail sack on a truck. The letter's author does not choose the truck; the driver does not read the letter. Each layer wraps the one above and cares only about its own address — street for the postman, sorting office for the sack, road for the truck.",
    at: "Envelopes inside envelopes" },

  { h: "Three kinds of address, constantly confused" },
  { l: [
   "**MAC address** — burned into a network card, like `a4:83:e7:1c:9f:02`. It identifies a device on *one local network segment* and never travels beyond the nearest router.",
   "**IP address** — like `142.250.185.78`. It identifies a device across the whole internet, and it can change: your laptop gets a different one on every network it joins.",
   "**Port** — a number from 0 to 65535 identifying a *program* on that device. The IP gets the packet to the machine; the port gets it to the right process."
  ] },
  { p: "So `142.250.185.78:443` means: that machine, the program listening on 443 — conventionally an HTTPS server. An IP address alone cannot deliver anything, because a machine runs many programs." },

  { tbl: { t: "The ports worth knowing without looking up",
    h: ["Port", "Service", "Note"],
    rows: [
     ["**22**", "SSH", "Remote shell"],
     ["**53**", "DNS", "Usually UDP; TCP for large replies"],
     ["**80**", "HTTP", "Unencrypted"],
     ["**443**", "HTTPS", "TLS; also QUIC over UDP"],
     ["**5432 / 3306**", "PostgreSQL / MySQL", "Never expose these publicly"],
     ["**6379**", "Redis", "No auth by default — the classic breach"],
     ["**8000 / 3000**", "Dev servers", "Convention only"]
    ] } },
  { n: "Ports below 1024 are privileged: binding one requires root. That is why a container or a dev server runs on 8080 and something in front maps 80 to it, and why 'permission denied' on port 80 is a permissions problem rather than a networking one.",
    nt: "Why dev servers use 8000" },

  { h: "Subnets and CIDR" },
  { p: "`192.168.1.0/24` means the first 24 bits are the network and the remaining 8 identify a host within it. Eight bits is 256 addresses, minus two reserved (network and broadcast), so 254 usable." },

  { code: { lang: "text", t: "The four you will meet",
    lines: [
     { c: "10.0.0.0/8        16,777,216 addresses   private", w: "The biggest private range. AWS VPCs default to a slice of this." },
     { c: "172.16.0.0/12      1,048,576 addresses   private", w: "Docker's default bridge network lives here — which is why `172.17.0.x` shows up in container logs." },
     { c: "192.168.0.0/16        65,536 addresses   private", w: "Home routers. Your laptop is almost certainly on one of these right now." },
     { c: "127.0.0.0/8                  localhost", w: "Never leaves the machine. `127.0.0.1` and `localhost` are the same thing, which matters when a service binds one and not the other.", hi: true }
    ],
    after: "The arithmetic: subtract the prefix from 32 and raise 2 to that power. `/24` gives 2^8 = 256; `/16` gives 2^16 = 65,536. Being able to do that in your head is expected in any infrastructure conversation." } },

  { trap: "A server bound to `127.0.0.1` accepts connections only from the same machine. Bound to `0.0.0.0` it accepts from anywhere. This is the single most common 'works locally, unreachable in Docker' cause: the app binds localhost inside the container, so nothing outside the container can ever reach it. Bind `0.0.0.0` in a container, always." },

  { term: { title: "Look at your own machine", t: "",
    lines: [
     { c: "ip addr", w: "Your interfaces and their IPs. `ifconfig` on macOS." },
     { c: "ss -tulpn", w: "Every listening socket, with the process. This answers 'what is using port 8000'. `netstat -tulpn` on older systems.",
       out: "Netid State  Local Address:Port   Process\ntcp   LISTEN 127.0.0.1:5432      postgres\ntcp   LISTEN 0.0.0.0:8000        python" },
     { c: "curl -s ifconfig.me", w: "Your *public* IP, which differs from your local one because of NAT." }
    ] } },
  { p: "In that output, postgres is on `127.0.0.1` — unreachable from another machine, which is correct for a database. The Python service on `0.0.0.0` accepts from anywhere. Reading that distinction is a genuine security check." },

  { tryit: { t: "Work out the range",
    task: "Your team is given `10.2.0.0/22` for a subnet. How many usable host addresses is that, and what is the last address in the range?",
    hint: "32 minus the prefix gives the host bits. Two addresses are always reserved.",
    sol: { lang: "text", code: "32 - 22 = 10 host bits\n2^10   = 1024 total addresses\n       - 2 reserved (network 10.2.0.0, broadcast 10.2.3.255)\n       = 1022 usable\n\nRange: 10.2.0.0  ->  10.2.3.255\n\nWhy .3 and not .1: 1024 addresses spans four /24 blocks --\n  10.2.0.x, 10.2.1.x, 10.2.2.x, 10.2.3.x\n\nCheck it with a tool rather than trusting the arithmetic:\n  ipcalc 10.2.0.0/22\n  python -c \"import ipaddress; \\\n    n=ipaddress.ip_network('10.2.0.0/22'); \\\n    print(n.num_addresses, n[0], n[-1])\"" },
    w: "Subnet sizing comes up constantly in cloud work, and the mistake that costs real time is picking a range that overlaps something else — two VPCs on 10.0.0.0/16 cannot be peered. Plan the ranges before creating anything." } }
 ],
 k: [
  "Four layers: application, transport, internet, link — each assumes the one below works.",
  "MAC is one hop, IP is end to end, port identifies the program on the machine.",
  "A CIDR prefix leaves 32 minus prefix host bits; `/24` is 256 addresses, 254 usable.",
  "`127.0.0.1` accepts only local connections; `0.0.0.0` accepts from anywhere.",
  "`ss -tulpn` tells you what is listening and which process owns it."
 ],
 r: ["IP Address", "Port", "CIDR", "Subnet", "MAC Address", "OSI Model"],
 drill: {
  lang: "bash",
  reps: 3,
  items: [
   { c: "ss -tulpn", w: "list listening sockets and their processes" },
   { c: "ip addr", w: "show interfaces and their addresses" },
   { c: "curl -s ifconfig.me", w: "find your public IP" },
   { c: "ipcalc 10.2.0.0/22", w: "expand a CIDR block into its range" },
   { c: "lsof -i :8000", w: "find what is holding a specific port" }
  ]
 }
},

/* ==================================================================== */
{
 t: "TCP, UDP, and What Reliability Costs",
 m: "transport",
 lvl: "intermediate",
 s: "The handshake, the guarantees, and when you should deliberately give them up.",
 goal: [
  "Walk through the three-way handshake and say what each message establishes",
  "List what TCP guarantees and what it charges for them",
  "Choose TCP or UDP for a given workload and defend it"
 ],
 b: [
  { p: "IP delivers packets, badly. They can arrive out of order, duplicated, or not at all. TCP is a layer on top that turns that into a reliable ordered stream — and UDP is the choice to not bother." },

  { h: "The three-way handshake" },
  { code: { lang: "text", t: "Before any data moves",
    lines: [
     { c: "client  --- SYN (seq=x) --->  server", w: "**1.** I want to talk, and my sequence numbers start at x." },
     { c: "client  <-- SYN-ACK (seq=y, ack=x+1) ---  server", w: "**2.** Agreed, mine start at y, and I acknowledge yours." },
     { c: "client  --- ACK (ack=y+1) --->  server", w: "**3.** I acknowledge yours. The connection is now established." }
    ],
    after: "One full round trip before a single byte of your data moves. On a 100 ms link that is 100 ms of pure setup — which is why connection reuse (keep-alive, connection pools) matters so much, and why every HTTP client library has a pool." } },

  { p: "Add TLS and it is worse: TLS 1.2 needs two more round trips, TLS 1.3 needs one. So an HTTPS request to a fresh connection costs two to three round trips before the request is even sent." },

  { h: "What TCP gives you, and what it charges" },
  { tbl: { t: "The trade",
    h: ["Guarantee", "How", "The cost"],
    rows: [
     ["**Delivery**", "Every segment acknowledged; unacknowledged ones resent", "Waiting for ACKs; retransmission delay"],
     ["**Ordering**", "Sequence numbers; later data buffered until gaps fill", "Head-of-line blocking — one lost packet stalls everything behind it"],
     ["**No duplicates**", "Sequence numbers identify repeats", "State kept per connection"],
     ["**Flow control**", "Receiver advertises a window", "Sender may idle waiting for window space"],
     ["**Congestion control**", "Slow start, then back off on loss", "A new connection starts slow on purpose"]
    ] } },

  { n: "**Slow start** surprises people: a fresh TCP connection deliberately begins by sending very little and doubles each round trip until it sees loss. So the first megabyte over a new connection is markedly slower than the tenth. This is another reason connection reuse matters, and why a benchmark that opens a new connection per request understates your real throughput.",
    nt: "Why the first request is slow" },

  { h: "UDP: none of that" },
  { p: "UDP adds almost nothing to IP — just ports and a checksum. No handshake, no ordering, no retransmission, no congestion control. Send and hope. That sounds strictly worse, and for most things it is, but it is exactly right when **late data is useless data**." },

  { vs: { t: "When each is correct", lang: "text",
    bad: { c: "Video call over TCP\n\nPacket 41 is lost.\nTCP stops everything, waits,\nretransmits, then delivers\n41 through 60 in order.\n\nThe user sees a freeze,\nthen fast-forward.", label: "TCP for real-time",
      w: "The retransmitted frame arrives 200 ms late and is worthless — that moment has passed. Worse, ordering meant every frame behind it also waited." },
    good: { c: "Video call over UDP\n\nPacket 41 is lost.\nNothing happens.\nPacket 42 plays.\n\nThe user sees one\nmomentary glitch and the\ncall continues.", label: "UDP for real-time",
      w: "A lost frame is a small artefact. The application decides what loss means, which is the entire point: TCP's policy is right for files and wrong for live media." } } },

  { l: [
   "**TCP**: HTTP, databases, SSH, file transfer, email — anything where correctness beats latency.",
   "**UDP**: DNS (one small query, just retry), video and voice, gaming, telemetry, NTP.",
   "**QUIC**: UDP underneath, but reimplements reliability *per stream* in user space — so one lost packet stalls only its own stream, not everything. This is HTTP/3, and it exists specifically to kill head-of-line blocking."
  ] },

  { trap: "The 75-second hang. If a server accepts a connection and then stops responding, the client's default TCP retransmission timeout can leave it waiting over a minute before failing. Any network call in a request path needs an explicit timeout — the library default is almost always far too long, and 'the site hangs' is nearly always a missing timeout somewhere." },

  { code: { lang: "python", t: "Timeouts, explicitly",
    lines: [
     { c: "requests.get(url, timeout=(3.05, 10))", w: "**(connect, read).** Connect is quick or never; read allows for a slow response. Without this argument `requests` waits indefinitely — the single most common production hang in Python.", hi: true },
     { c: "", w: "" },
     { c: "sock.settimeout(5.0)", w: "The same idea at the socket level." },
     { c: "", w: "" },
     { c: "async with asyncio.timeout(10):", w: "Python 3.11+. Bounds a whole block rather than a single call." }
    ] } },

  { tryit: { t: "Choose and defend",
    task: "You are designing telemetry for 50,000 IoT sensors, each sending a temperature reading every second. Occasional lost readings are acceptable. TCP or UDP, and what breaks if you choose wrong?",
    hint: "Think about what 50,000 persistent connections cost the server, and what a lost reading actually means here.",
    sol: { lang: "text", code: "UDP, and it is not close.\n\nWhy TCP is the wrong answer here:\n  * 50,000 persistent connections = 50,000 sets of kernel state,\n    buffers and timers on the server. That is real memory and\n    real scheduler load.\n  * A handshake per reading (if not persistent) means 3 packets\n    of setup for 1 packet of data -- 4x the traffic for nothing.\n  * Retransmitting a lost reading delivers a temperature that is\n    now seconds stale. The next reading is already better.\n\nWhy UDP fits:\n  * One packet per reading, no connection state at all.\n  * A lost reading is a gap in a graph, not a failure.\n  * The server is stateless, so it scales horizontally trivially.\n\nWhat you take on:\n  * No delivery guarantee -- so include a sequence number and a\n    timestamp in the payload, and detect gaps at the receiver.\n  * No congestion control -- so rate-limit at the sensor, or\n    50,000 devices can saturate a link with no back-off.\n\nThe honest caveat: if readings were billing events rather than\ntemperatures, this answer flips entirely." },
    w: "The interview follow-up is always 'what do you lose'. Naming the trade — no delivery guarantee, no congestion control, and what you would add to compensate — is what distinguishes an answer from a guess." } }
 ],
 k: [
  "TCP costs one round trip to establish, plus one or two more for TLS.",
  "It guarantees delivery and order; the cost is head-of-line blocking and per-connection state.",
  "Slow start means a fresh connection is deliberately slow — reuse connections.",
  "UDP is right when late data is useless: media, gaming, telemetry, DNS.",
  "Always set an explicit timeout; library defaults hang far longer than you want."
 ],
 r: ["TCP", "UDP", "QUIC", "Socket", "Latency"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "requests.get(url, timeout=(3.05, 10))", w: "connect and read timeouts, explicitly" },
   { c: "sock.settimeout(5.0)", w: "bound a raw socket operation" },
   { c: "async with asyncio.timeout(10):", w: "bound a whole async block" },
   { c: "nc -zv host 443", w: "check whether a TCP port is reachable", lang: "bash" },
   { c: "ss -s", w: "summarise socket counts by state", lang: "bash" }
  ]
 }
},

/* ==================================================================== */
{
 t: "What Happens When You Type a URL",
 m: "web",
 lvl: "intermediate",
 s: "DNS, TCP, TLS, HTTP — the chain, in order, and where each link breaks.",
 goal: [
  "Narrate the full sequence from keystroke to rendered page",
  "Say what TLS actually establishes and why the certificate matters",
  "Identify which link is broken from the symptom"
 ],
 b: [
  { p: "This is the most-asked question in technical interviews, and it is not a trivia test. It checks whether you see one chain rather than four unrelated words — because when something breaks in production, knowing the order is how you find the broken link." },

  { h: "The sequence" },
  { ol: [
   "**Parse the URL.** Scheme, host, port, path. `https://example.com/x` means TLS, host `example.com`, port 443 by default.",
   "**Resolve the name.** `example.com` is not an address. Check the browser cache, the OS cache, `/etc/hosts`, then ask a DNS resolver. It may recurse: root servers, then `.com`, then example.com's nameservers.",
   "**Open a TCP connection** to that IP on port 443. One round trip for the handshake.",
   "**Negotiate TLS.** The server presents a certificate; the client verifies it chains to a trusted root, has not expired, and matches the hostname. Then both agree on session keys. One round trip on TLS 1.3.",
   "**Send the HTTP request.** `GET /x HTTP/1.1`, plus headers.",
   "**Receive the response.** Status line, headers, body.",
   "**Render.** Parse HTML, fetch sub-resources (each of which may repeat this whole process), build the DOM, apply CSS, run JS, paint."
  ] },

  { p: "Counting round trips on a fresh connection: DNS (often 1), TCP (1), TLS (1), request/response (1). Four round trips before the first byte of HTML. On a 100 ms link that is 400 ms of latency you cannot code your way out of — only avoid, by reusing connections and caching DNS." },

  { term: { title: "Watch it happen", t: "`curl` prints the whole conversation with `-v`, which is the fastest way to see every step at once.",
    lines: [
     { c: "curl -v https://example.com 2>&1 | head -20",
       w: "The lines beginning `*` are connection and TLS; `>` is your request; `<` is the response.",
       out: "* Connected to example.com (93.184.216.34) port 443\n* TLSv1.3 (OUT), TLS handshake, Client hello (1):\n* TLSv1.3 (IN), TLS handshake, Server hello (2):\n* SSL certificate verify ok.\n> GET / HTTP/1.1\n> Host: example.com\n> User-Agent: curl/8.4.0\n< HTTP/1.1 200 OK\n< Content-Type: text/html" },
     { c: "curl -w \"dns %{time_namelookup}s  tcp %{time_connect}s  tls %{time_appconnect}s  total %{time_total}s\\n\" -o /dev/null -s https://example.com",
       w: "**Timing per stage.** This is how you find out which link is slow rather than guessing.",
       out: "dns 0.004s  tcp 0.021s  tls 0.058s  total 0.104s" }
    ] } },

  { h: "What TLS actually does" },
  { p: "Three things, and people usually name only the first:" },
  { l: [
   "**Encryption** — nobody in between can read the traffic.",
   "**Integrity** — nobody can modify it undetected.",
   "**Authentication** — you are talking to who you think. This is what the certificate is for, and it is the part that matters most: encryption to an attacker is worthless."
  ] },
  { p: "The certificate is a statement, signed by a Certificate Authority your machine already trusts, that this public key belongs to this hostname. Your browser ships with the root CA list; the chain must reach one of them." },

  { trap: "Certificate errors are almost never worth clicking through, but three of them have mundane causes worth knowing: an **expired** certificate (someone forgot to renew), a **hostname mismatch** (the cert is for `www.x.com` and you asked for `x.com`), and **an incomplete chain** — the server sent its own certificate but not the intermediate, which works in browsers that cache intermediates and fails in `curl` and in your production client. That last one is the classic 'works in my browser, fails in code'." },

  { h: "Diagnosing by symptom" },
  { tbl: { t: "Where the chain broke",
    h: ["Symptom", "Broken link", "Check with"],
    rows: [
     ["`Could not resolve host`", "DNS", "`dig example.com`"],
     ["`Connection refused`", "TCP — reached the machine, nothing listening", "`nc -zv host 443`"],
     ["`Connection timed out`", "TCP — no reply at all, usually a firewall", "`traceroute host`"],
     ["`certificate verify failed`", "TLS", "`openssl s_client -connect host:443`"],
     ["`404` / `500`", "HTTP — the chain worked; the application did not", "`curl -v`"],
     ["Hangs, then fails after ~75s", "Missing timeout in your client", "your own code"]
    ] } },
  { n: "The distinction between *refused* and *timed out* is worth internalising. **Refused** means a machine answered and said no — the host is up, nothing is on that port. **Timed out** means nothing answered at all — usually a firewall dropping packets silently. They point at completely different problems, and confusing them sends you debugging the wrong layer.",
    nt: "Refused versus timed out" },

  { code: { lang: "text", t: "The HTTP status codes to know cold",
    lines: [
     { c: "200 OK              301 Moved Permanently   304 Not Modified", w: "Success and caching. `304` means your cached copy is still good." },
     { c: "400 Bad Request     401 Unauthorized        403 Forbidden", w: "**401 means not authenticated** (who are you?); **403 means authenticated but not allowed** (I know who you are, no). Constantly swapped." },
     { c: "404 Not Found       409 Conflict            429 Too Many Requests", w: "`429` should carry a `Retry-After` header — respect it rather than retrying blindly." },
     { c: "500 Internal Error  502 Bad Gateway         503 Unavailable  504 Gateway Timeout", w: "**5xx is your fault, 4xx is the caller's.** `502` and `504` come from a proxy: the upstream failed or was too slow, which means the problem is behind the thing you are talking to.", hi: true }
    ] } },

  { tryit: { t: "Find the broken link",
    task: "Your API works from your laptop but returns `certificate verify failed` from inside a Docker container. Same URL, same moment. What is the most likely cause?",
    hint: "What does a browser or your OS have that a minimal container image does not?",
    sol: { lang: "bash", code: "# Almost certainly missing CA certificates in the image.\n#\n# Your laptop has a full root CA store. A minimal base image\n# (alpine, distroless, scratch) often ships with none, so no\n# certificate can be verified -- every TLS connection fails\n# identically regardless of the site.\n\n# Confirm inside the container:\nls /etc/ssl/certs/ | head        # empty or missing?\ncurl -v https://example.com      # fails at the verify step\n\n# Fix -- install the trust store:\n#   Alpine\nRUN apk add --no-cache ca-certificates\n#   Debian/Ubuntu\nRUN apt-get update && apt-get install -y ca-certificates\n\n# The second candidate, if certs ARE present: an incomplete\n# chain served by the endpoint. Browsers paper over this by\n# caching intermediates from other sites; curl does not.\nopenssl s_client -connect api.example.com:443 -showcerts\n\n# NEVER the fix, though it will appear in every search result:\n#   verify=False        # in requests\n#   curl -k\n# That disables authentication entirely and leaves you encrypted\n# to an attacker, which is the one guarantee that mattered." },
    w: "This exact failure is extremely common when moving from a laptop to a slim container, and the tempting fix — disabling verification — throws away the only part of TLS that protects against an active attacker. The real fix is one line in the Dockerfile." } }
 ],
 k: [
  "The chain is DNS, TCP, TLS, HTTP — four round trips before the first byte on a cold connection.",
  "TLS provides encryption, integrity and authentication; the certificate is the third one.",
  "`Connection refused` means nothing is listening; `timed out` means nothing replied at all.",
  "401 is unauthenticated, 403 is authenticated but forbidden; 502/504 come from a proxy.",
  "`curl -w` gives per-stage timings, which tells you which link is slow."
 ],
 r: ["DNS", "HTTPS", "TCP", "HTTP", "Proxy"],
 drill: {
  lang: "bash",
  reps: 3,
  items: [
   { c: "curl -v https://example.com", w: "see the whole connection, request and response" },
   { c: "dig example.com +short", w: "resolve a name and print just the answer" },
   { c: "openssl s_client -connect host:443", w: "inspect a TLS handshake and certificate chain" },
   { c: "nc -zv host 443", w: "is anything listening on that port" },
   { c: "curl -o /dev/null -s -w \"%{time_total}\\n\" https://example.com", w: "time a request without printing the body" }
  ]
 }
},

/* ==================================================================== */
{
 t: "Diagnosing a Network You Cannot See",
 m: "netops",
 lvl: "intermediate",
 s: "The commands that turn 'the network is broken' into a specific, fixable statement.",
 goal: [
  "Pick the right tool for a given symptom",
  "Read traceroute output without misinterpreting the stars",
  "Capture and read enough packets to settle an argument"
 ],
 b: [
  { p: "\"The network is slow\" is not a diagnosis. These tools turn it into something actionable — and the skill is choosing the right one for the symptom rather than running all of them." },

  { h: "The order to try things" },
  { ol: [
   "**Does the name resolve?** `dig`. If not, nothing else matters.",
   "**Is the host reachable?** `ping`. Note that many hosts drop ICMP, so no reply is not proof of death.",
   "**Where does it stop?** `traceroute`.",
   "**Is the port open?** `nc -zv`.",
   "**Does the application respond?** `curl -v`.",
   "**What is actually on the wire?** `tcpdump` — last, because it is the heaviest."
  ] },

  { term: { title: "dig — what DNS really returns", t: "",
    lines: [
     { c: "dig example.com +short", w: "Just the answer.", out: "93.184.216.34" },
     { c: "dig example.com", w: "The full record, including **TTL** — how long this answer may be cached. A high TTL is why a DNS change takes hours to take effect everywhere.",
       out: ";; ANSWER SECTION:\nexample.com.  3600  IN  A  93.184.216.34" },
     { c: "dig @8.8.8.8 example.com", w: "Ask a *specific* resolver. If Google's answer differs from yours, the problem is your local resolver or a stale cache — this single check settles a lot of arguments." }
     ] } },

  { term: { title: "traceroute — where it stops", t: "Each line is one router along the path. Three timings per hop, because it sends three probes.",
    lines: [
     { c: "traceroute example.com",
       w: "`* * *` means that hop did not reply — which usually means it is configured not to, **not** that the path is broken. Only a run of stars continuing to the destination indicates a real failure.",
       out: " 1  192.168.1.1      1.2 ms   1.1 ms   1.3 ms\n 2  10.4.0.1        12.4 ms  11.9 ms  12.1 ms\n 3  * * *\n 4  72.14.239.1     24.1 ms  23.8 ms  24.0 ms\n 9  93.184.216.34   88.2 ms  87.9 ms  88.4 ms" }
    ] } },
  { trap: "Reading traceroute wrong is the classic mistake. A single hop of stars is almost always a router declining to send ICMP — the traffic passes through it perfectly well, as hop 4 replying proves. Also ignore a latency *spike* at one middle hop that then drops: routers deprioritise generating ICMP replies, so that number reflects the router's mood, not the path. Only the final hop's latency and a sustained run of stars mean anything." },

  { term: { title: "tcpdump — the ground truth", t: "When two teams disagree about who sent what, this ends it.",
    lines: [
     { c: "sudo tcpdump -i any -n port 443 -c 20",
       w: "`-n` skips DNS lookups (which would themselves generate traffic), `-c` stops after 20 packets so you are not flooded.",
       out: "14:22:01.234 IP 10.0.0.5.51234 > 93.184.216.34.443: Flags [S], seq 1234\n14:22:01.256 IP 93.184.216.34.443 > 10.0.0.5.51234: Flags [S.], seq 5678, ack 1235\n14:22:01.256 IP 10.0.0.5.51234 > 93.184.216.34.443: Flags [.], ack 5679" },
     { c: "sudo tcpdump -i any -n -w capture.pcap port 443", w: "Write to a file and open it in Wireshark for anything non-trivial." }
    ] } },
  { p: "Those three lines are the handshake from the earlier lesson, on a real wire: `[S]` is SYN, `[S.]` is SYN-ACK, `[.]` is the bare ACK. Seeing a SYN with no SYN-ACK in reply is a firewall; seeing `[R]` (reset) means something actively refused." },

  { h: "The flags worth recognising" },
  { code: { lang: "text", t: "tcpdump's shorthand",
    lines: [
     { c: "[S]   SYN        connection request", w: "" },
     { c: "[S.]  SYN-ACK    request accepted", w: "The dot means ACK is also set." },
     { c: "[.]   ACK        plain acknowledgement", w: "" },
     { c: "[P.]  PSH-ACK    data being delivered", w: "This is where your actual payload is." },
     { c: "[F.]  FIN-ACK    orderly close", w: "" },
     { c: "[R]   RST        abrupt refusal or reset", w: "Something said no. A RST immediately after SYN is 'connection refused'.", hi: true }
    ] } },

  { h: "The two symptoms people misread" },
  { tbl: { t: "",
    h: ["Looks like", "Usually is", "Because"],
    rows: [
     ["Intermittent slow requests", "DNS, not the server", "A failing secondary resolver times out before the working one is tried"],
     ["Fails only for large payloads", "MTU / fragmentation", "Small packets fit, large ones need fragmenting and something drops them"],
     ["Works with IP, fails with hostname", "DNS or SNI", "Name resolution, or a TLS cert that does not match the name"],
     ["Fine locally, fails in the cluster", "Binding or egress rules", "`127.0.0.1` instead of `0.0.0.0`, or a network policy"]
    ] } },

  { tryit: { t: "Sequence the investigation",
    task: "A service calls a third-party API. It works 95% of the time; the other 5% take exactly 5 seconds and then fail. What do you check, in what order, and what is your leading hypothesis?",
    hint: "An *exact*, repeated duration is a timeout somewhere, not congestion. Whose timeout is 5 seconds?",
    sol: { lang: "bash", code: "# The exactness is the clue. Real congestion varies; a constant\n# 5.000s is a configured timeout firing.\n\n# 1. Whose 5 seconds is it? Time the stages -- if DNS accounts\n#    for the whole delay, stop here.\ncurl -w \"dns %{time_namelookup}  connect %{time_connect}  total %{time_total}\\n\" \\\n     -o /dev/null -s https://api.example.com\n\n# 2. Leading hypothesis: DNS. The default resolver timeout on\n#    Linux is 5 seconds, and resolv.conf lists servers in order.\n#    If the first nameserver is unhealthy, ~5% of lookups hit it,\n#    wait the full timeout, then fall back to the second.\ncat /etc/resolv.conf\n#   nameserver 10.0.0.2      <- if this one is flaky, that is it\n#   nameserver 10.0.0.3\n\n# 3. Confirm by asking each resolver directly, repeatedly:\nfor i in $(seq 20); do dig @10.0.0.2 api.example.com +short +time=2; done\n\n# Fixes, in order of preference:\n#   * remove or repair the unhealthy nameserver\n#   * options timeout:1 attempts:2   in resolv.conf\n#   * run a local caching resolver so misses are rare\n#   * reuse connections so lookups happen far less often" },
    w: "**A constant duration is a timeout; a variable one is congestion.** That single distinction routes the whole investigation, and DNS is the most under-suspected cause of intermittent latency because it happens before anything your application logs." } }
 ],
 k: [
  "Work up the chain in order: resolve, reach, route, port, application, packets.",
  "`* * *` in traceroute usually means ICMP is disabled at that hop, not a break.",
  "`dig @resolver` compares answers and settles most DNS arguments immediately.",
  "In tcpdump, `[S]` unanswered is a firewall; `[R]` is an active refusal.",
  "A constant failure duration is a timeout; a variable one is congestion."
 ],
 r: ["DNS", "Ping and Traceroute", "Packet", "Firewall", "Latency"],
 drill: {
  lang: "bash",
  reps: 3,
  items: [
   { c: "dig @8.8.8.8 example.com +short", w: "ask a specific resolver directly" },
   { c: "traceroute example.com", w: "find where along the path it stops" },
   { c: "sudo tcpdump -i any -n port 443 -c 20", w: "capture twenty packets on one port" },
   { c: "cat /etc/resolv.conf", w: "see which nameservers this machine uses" },
   { c: "curl -o /dev/null -s -w \"%{time_namelookup} %{time_total}\\n\" https://x.com", w: "time DNS against the total" }
  ]
 }
}

]);
