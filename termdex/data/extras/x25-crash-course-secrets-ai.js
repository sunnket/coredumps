/* Real-world examples and step-by-step flows — crash course, credentials and
   the practical AI-tooling vocabulary. */
TD.attach("crash-course", {

"Secret": {
 ex: { h: "A key photocopied into a filing cabinet",
       b: "Once the copy is filed, taking it out of the drawer changes nothing — copies exist, and you cannot be sure who has one. A committed secret is that copy: it lives in the history, in every clone, in every fork and in the bots that scan public repositories within minutes. Changing the lock is the only real remedy." },
 fl: { t: "A key was pushed to a repository",
       s: ["You realise a secret is in the history",
           { q: "Was the repository ever public, or shared?",
             y: "Assume it is compromised. Rotate first, tidy up second",
             n: "Rotate anyway — the cost is minutes" },
           { s: "Rotate: invalidate the old value at the provider", n: "This is the actual fix. Everything else is housekeeping." },
           { s: "Then remove it and add it to `.gitignore`", n: "`git rm --cached`, so it stops being tracked." },
           "Deleting the commit does not remove it from history or from clones"] }
},

"Access Token": {
 ex: { h: "A wristband instead of showing your passport at every door",
       b: "You prove who you are once at the entrance and wear the band inside. The band is easier to steal than a passport, which is exactly why it expires at the end of the night and only opens the rooms you paid for. A token that never expires is a passport you have handed to a stranger." },
 fl: { t: "Access and refresh, working together",
       s: ["A user logs in with their password",
           { s: "The server returns a short-lived access token", n: "Minutes, not days. Sent on every request afterwards." },
           { s: "And a longer-lived refresh token, stored carefully", n: "Its only job is to obtain new access tokens." },
           { q: "The access token expired mid-session?",
             y: "Use the refresh token silently — the user notices nothing",
             n: "Keep going" },
           "Never put anything private inside a JWT — its payload is readable"] }
},

"Two-Factor Authentication": {
 ex: { h: "A key and a code, not two keys",
       b: "A safe needing two keys from the same keyring is barely safer, because whoever takes the keyring has both. That is a password plus a security question — two things you know, one theft. A key plus a code from your phone is a genuine second factor, because stealing one does not get you the other." },
 fl: { t: "Choosing a method",
       s: ["An account offers several second factors",
           { q: "Is a hardware key or passkey available?",
             y: "Take it — it verifies the domain, so phishing simply fails",
             n: "An authenticator app is the next best thing" },
           { s: "SMS is the weakest option and still beats nothing", n: "A SIM swap defeats it, and that attack is not rare." },
           { s: "Save the recovery codes now", n: "Somewhere that is not the phone you are protecting." },
           "The strongest factor is worthless if the recovery path is a security question"] }
},

"SSH Key": {
 ex: { h: "A lock that only your key shape opens, without ever seeing the key",
       b: "You never send the key, and the server never learns it. It sets a puzzle that only the matching private key can solve, watches you solve it, and opens. Nothing secret crosses the wire even once — which is what makes it strictly better than a password, not merely more convenient." },
 fl: { t: "Setting one up correctly",
       s: ["You want to push to GitHub without typing a password",
           { s: "`ssh-keygen -t ed25519` makes the pair", n: "Two files: private, and `.pub`." },
           { q: "Which one goes on the website?",
             y: "The `.pub` one — the public half, always",
             n: "The private key never leaves your machine, ever" },
           { s: "`chmod 600` the private key", n: "SSH refuses to use a key that others can read." },
           "Add a passphrase and let `ssh-agent` hold it — once per session, not per push"] }
},

"Certificate": {
 ex: { h: "A passport, and the country that issued it",
       b: "The document says who you are; the value comes from a border guard already trusting the issuer. Your browser ships with a list of trusted issuers, which is why a certificate from one produces a padlock and a self-signed one produces a warning — nobody the browser trusts has vouched for it." },
 fl: { t: "A certificate outage",
       s: ["Users report a security warning on your site",
           { q: "Has it expired?",
             y: "The most common cause, and entirely preventable",
             n: "Check the domain names it actually covers" },
           { s: "A cert for `example.com` does not cover `www.example.com`", n: "Unless it is a wildcard or lists both." },
           { s: "Renew, and then fix the real problem", n: "Automated renewal plus an alert two weeks before expiry." },
           "Let's Encrypt certificates last 90 days — manual renewal will eventually fail"] }
},

"Password Hashing": {
 ex: { h: "Storing a fingerprint, not a finger",
       b: "The fingerprint proves it was you and cannot be turned back into a finger. That is a hash. The reason to use a deliberately slow one is that an attacker with the whole database is guessing offline at their own pace — and a fast hash lets them try billions of guesses a second, which is exactly the property you do not want here." },
 fl: { t: "Storing a password correctly",
       s: ["A user signs up",
           { q: "Are you reaching for SHA-256 because it is a hash?",
             y: "Stop — fast is the wrong property for passwords",
             n: "Good. bcrypt, scrypt or Argon2" },
           { s: "The library generates and embeds the salt", n: "You do not manage salts yourself." },
           { s: "Compare with the library's own check function", n: "A hand-rolled `==` leaks timing information." },
           "If you can email a user their password back, it was stored wrong"] }
},

"Salt": {
 ex: { h: "Everyone gets a different lock, even with the same key",
       b: "Ten people choose the same password. Without a salt they all produce the same stored value, so one crack opens ten accounts and a precomputed table opens them instantly. A unique salt each means ten different stored values, and the attacker has to start again for every single account." },
 fl: { t: "Why it is not a secret",
       s: ["The salt is stored right next to the hash",
           { q: "Does that not defeat the purpose?",
             y: "No — its job is uniqueness, not concealment",
             n: "Correct. Secrecy was never what it provided" },
           { s: "Uniqueness is what kills rainbow tables", n: "A precomputed table only works against unsalted hashes." },
           { s: "One shared salt for all users defeats it entirely", n: "The classic hand-rolled mistake." },
           "bcrypt and Argon2 embed it in the output string — let them handle it"] }
},

"Sanitisation": {
 ex: { h: "Checking the parcel, not just the label",
       b: "A courier who accepts anything labelled *books* will eventually carry something else. Every value a user supplies is a parcel with a label they wrote themselves — the filename, the content type, the form field. Validating against a list of what is allowed beats checking against a list of what is banned, because the banned list is never finished." },
 fl: { t: "Accepting an uploaded file",
       s: ["A user uploads a file",
           { q: "Are you trusting the filename they sent?",
             y: "`../../etc/passwd` is a valid filename. Use `basename`",
             n: "Good" },
           { s: "The declared content type is also user-supplied", n: "Inspect the actual bytes instead." },
           { s: "Store it outside the web root, with a generated name", n: "Never serve it back from a path the user chose." },
           "Allowlist the extensions you accept; never blocklist the ones you fear"] }
},

"Context Length": {
 ex: { h: "A desk that only fits so many open books",
       b: "Everything the model can consult has to be on the desk at once — the instructions, the conversation so far, the retrieved documents, and room to write the answer. Adding a book means removing one. And in practice the books at the edges of the desk get consulted more than the ones buried in the middle, which is why placement is a real technique." },
 fl: { t: "Budgeting a context window",
       s: ["Your prompts are growing as the conversation continues",
           { s: "Count everything: system, history, documents, reply", n: "The reply comes out of the same budget." },
           { q: "Are you reserving space for the response?",
             y: "Good — otherwise generation is cut off mid-sentence",
             n: "This is the most common context bug" },
           { s: "Trim or summarise old turns rather than sending everything", n: "You pay for the whole context on every call." },
           "Put the instruction and the key material at the start or end, not buried"] }
},

"Token Limit and Truncation": {
 ex: { h: "The recording stops when the tape runs out",
       b: "Not at the end of the sentence — at the end of the tape, mid-word. The API does not consider this an error, because it did exactly what you asked. This is why JSON output from a model fails to parse only on longer inputs, intermittently, in a way that looks like a model quality problem and is really a configuration one." },
 fl: { t: "JSON from a model fails to parse, sometimes",
       s: ["Parsing works on short inputs and fails on long ones",
           { q: "Did you check the finish reason?",
             y: "`length` means truncated — the reply is incomplete, not malformed",
             n: "Check it. This is almost always the cause" },
           { s: "Raise `max_tokens`, or ask for less output", n: "Both are valid; the second is usually cheaper." },
           { s: "Never parse a truncated response as if it were whole", n: "Detect it and retry or fail explicitly." },
           "Context length and `max_tokens` are two different limits — check both"] }
},

"Automation": {
 ex: { h: "A dishwasher, not a robot chef",
       b: "The dishwasher is worth it because the task is identical every time and happens daily. A robot that cooks anything you fancy is a much harder problem and mostly not worth solving. The judgement in automation is telling those two apart — and the second-order rule is that a dishwasher which fails silently and leaves everything dirty is worse than washing by hand." },
 fl: { t: "Deciding whether to automate",
       s: ["A task keeps coming back",
           { q: "Is it frequent, mechanical and stable?",
             y: "Automate it — the consistency matters more than the time saved",
             n: "Probably leave it; maintenance would exceed the benefit" },
           { s: "How long would automating take, against a year of doing it?", n: "Be honest about maintenance, not just the build." },
           { s: "Whatever you automate must alert on failure", n: "Silent automation failure is worse than a manual step." },
           "Better than automating a task: removing the need for it"] }
},

"Design Patterns": {
 ex: { h: "Naming a chess opening",
       b: "*The Sicilian* saves twenty words between people who both know it — that is the entire value, and it is a real one. What it never does is tell you to play the Sicilian in a position that is not a Sicilian. Patterns are the same: a shared name for a shape you recognise, not a list of shapes to impose." },
 fl: { t: "Reaching for one",
       s: ["You are designing a piece of a system",
           { q: "Do you already have the problem the pattern solves?",
             y: "Use it, and use its name — the team will understand instantly",
             n: "Do not apply it yet. Write the simple version" },
           { s: "A pattern applied early adds structure with no payoff", n: "Four classes where one function would have done." },
           { s: "The name is the deliverable", n: "*This is a strategy* communicates a design in three words." },
           "Refactoring into a pattern later is normal and cheap; removing one is not"] }
}

});
