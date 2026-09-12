/* ==========================================================================
   Depth pass 9 — security, MLOps and the things that break in production.

   The security terms share a theme worth stating: nearly every one exists
   because a boundary that looked like a boundary was not one. Data and code
   share a channel; a client is trusted because it says so; a token proves
   identity and nobody checked which. The MLOps terms share a different one:
   a model that scored well offline is not the same object as a model serving
   traffic, and the gap between them is where systems fail silently.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "sql-injection",

      why: {
        before: "Queries were built by concatenating strings: " +
          "`\"SELECT * FROM users WHERE name = '\" + name + \"'\"`. Obvious, " +
          "readable, and how everyone wrote database code.",
        problem: "The database receives **one string** and cannot tell which " +
          "parts were your query and which were the user's data. Supply " +
          "`' OR '1'='1` as a name and the quote closes early — what you meant " +
          "as data is parsed as **syntax**. The boundary you imagined between " +
          "code and input does not exist at the point it matters.",
        shift: "Send the query and the data down **separate channels**. A " +
          "prepared statement gives the database the query text with " +
          "placeholders first; it parses and plans it, then receives the " +
          "parameters as values that can never be re-parsed as SQL. The " +
          "boundary becomes real rather than imagined."
      },

      num: {
        t: "Defences, ranked by what they actually do",
        h: ["Defence", "Effective?", "Note"],
        r: [
          ["Parameterised queries", "**yes**", "the actual fix"],
          ["Stored procedures", "usually", "unless they concatenate internally"],
          ["Allowlist for identifiers", "yes", "for table/column names"],
          ["Escaping input", "fragile", "encoding and edge cases defeat it"],
          ["Blocking keywords like `DROP`", "no", "trivially bypassed"],
          ["Hiding error messages", "no", "blind injection still works"]
        ],
        n: "SQL injection has been in the **OWASP Top 10 since 2003** and " +
          "remains there — over twenty years after the fix was well known and " +
          "universally available. It caused the **Heartland** breach (130M " +
          "cards) and **TalkTalk** (157k customers, £400k fine). The reason it " +
          "persists is not ignorance of parameterisation; it is that ORMs have " +
          "raw-SQL escape hatches, dynamic `ORDER BY` cannot be parameterised, " +
          "and a single concatenation anywhere in a large codebase is enough."
      },

      miss: [
        {
          w: "Using an ORM protects me from SQL injection.",
          r: "Only where you use it idiomatically. Every ORM has a raw-query " +
            "escape hatch, and `.raw()`, `.extra()` or a string-built `where` " +
            "clause is exactly as vulnerable as hand-written SQL. ORMs remove " +
            "the *common* case, not the risk."
        },
        {
          w: "Escaping quotes in user input is enough.",
          r: "Escaping is a blocklist and blocklists lose. Character-set " +
            "mismatches, second-order injection (stored now, concatenated " +
            "later), and numeric contexts with no quotes at all defeat it. " +
            "Parameterisation is not a better escape — it removes the parsing " +
            "step entirely, which is a different kind of guarantee."
        },
        {
          w: "Parameterised queries handle everything.",
          r: "They bind **values**, not **identifiers**. You cannot " +
            "parameterise a table name, a column name, or an `ORDER BY` " +
            "direction — those still need an **allowlist** mapping user input " +
            "to a fixed set of permitted strings. Dynamic sorting is the most " +
            "common surviving injection point in otherwise clean code."
        },
        {
          w: "My query only reads data, so injection is low severity.",
          r: "A `SELECT` can exfiltrate the entire database via `UNION`, and " +
            "**blind injection** extracts data one bit at a time through " +
            "timing or boolean responses even with errors suppressed. Depending " +
            "on the database and privileges, stacked queries or file functions " +
            "can escalate further. Read access is usually the whole breach."
        }
      ],

      trade: {
        buys: [
          "Parameterisation eliminates the vulnerability class outright.",
          "It is also **faster** — the database caches the parsed plan.",
          "Correct handling of quotes, encodings and NULLs for free.",
          "Requires no security expertise from the developer."
        ],
        costs: [
          "Cannot parameterise identifiers, so dynamic SQL still needs care.",
          "Very dynamic query building becomes more verbose.",
          "Plan caching can occasionally choose a plan wrong for a specific " +
            "parameter value — parameter sniffing."
        ],
        avoid: [
          "Never — there is no case for concatenating user input into SQL.",
          "For **identifiers**, parameterisation does not apply; use an " +
            "allowlist instead.",
          "For very complex dynamic queries, build the *structure* from " +
            "trusted code and bind every *value*."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "cross-site-request-forgery",

      why: {
        before: "Sessions were tracked with cookies, and the browser attached " +
          "them automatically to every request to that origin. Convenient, and " +
          "the whole point of cookies.",
        problem: "The browser attaches them on requests **the user did not " +
          "initiate**. A form on `evil.com` that POSTs to `yourbank.com` " +
          "carries the victim's session cookie, because the browser has no " +
          "idea the user did not mean it. The server sees a perfectly valid " +
          "authenticated request.",
        shift: "Require something the attacker's site **cannot read**. A " +
          "random token, placed in the page by your server and echoed back in " +
          "the form, cannot be obtained cross-origin because the same-origin " +
          "policy prevents `evil.com` reading your HTML. Authentication proves " +
          "*who*; the token proves *this request came from our page*."
      },

      num: {
        t: "Defences and their coverage",
        h: ["Defence", "Protects", "Caveat"],
        r: [
          ["`SameSite=Lax` (default)", "cross-site POST", "top-level GET still sent"],
          ["`SameSite=Strict`", "everything cross-site", "breaks inbound links"],
          ["Synchroniser token", "all state-changing requests", "needs server state"],
          ["Double-submit cookie", "same", "stateless; weaker to subdomains"],
          ["Checking `Origin` header", "most cases", "absent on some old clients"],
          ["Checking `Referer`", "some", "often stripped by privacy tools"]
        ],
        n: "**Chrome made `SameSite=Lax` the default in 2020**, and other " +
          "browsers followed — which removed most classic CSRF at a stroke, " +
          "since a cross-site POST no longer carries the cookie. That is why " +
          "CSRF feels like a solved problem, and why it is not: `Lax` still " +
          "permits **top-level GET navigations**, so any state change behind a " +
          "`GET` remains exploitable. Tokens also remain necessary for older " +
          "browsers and for subdomain-adjacent attacks. The single most " +
          "important rule predates all of it: **`GET` must never change state**."
      },

      miss: [
        {
          w: "CSRF lets the attacker read my data.",
          r: "It lets them **make requests**, not read responses. The " +
            "same-origin policy still blocks reading the reply. CSRF is a " +
            "write-side attack — transfer funds, change email, delete account " +
            "— which is why the defence is required on state-changing " +
            "endpoints and not on reads."
        },
        {
          w: "An API using bearer tokens in a header needs CSRF protection.",
          r: "Generally not, and this is the key distinction. CSRF exists " +
            "because browsers attach **cookies automatically**. A token the " +
            "JavaScript must read from storage and set as a header cannot be " +
            "sent by a cross-origin form. If you authenticate with " +
            "`Authorization`, you are not exposed; if you authenticate with " +
            "cookies, you are."
        },
        {
          w: "`SameSite=Lax` means I can drop CSRF tokens.",
          r: "It is strong defence-in-depth and not complete. `Lax` allows " +
            "cookies on top-level `GET`, so a state-changing `GET` is still " +
            "vulnerable. Subdomains are same-site, so an XSS on " +
            "`blog.example.com` can reach `app.example.com`. Keep tokens on " +
            "sensitive actions."
        },
        {
          w: "Checking the `Referer` header is a reasonable defence.",
          r: "It is stripped by privacy settings, proxies and " +
            "`Referrer-Policy`, so you must decide what to do when it is " +
            "absent — and *allow* is a bypass while *deny* breaks real users. " +
            "The **`Origin`** header is the better version: present on all " +
            "cross-origin requests and on all POSTs, and not user-controllable."
        }
      ],

      trade: {
        buys: [
          "Blocks an attack that needs no XSS and no network position.",
          "Tokens are cheap and framework support is universal.",
          "`SameSite` gives broad protection with a single cookie attribute."
        ],
        costs: [
          "Synchroniser tokens need server-side state or signing.",
          "`SameSite=Strict` breaks the experience of following external links.",
          "Tokens complicate caching and multi-tab flows.",
          "Another thing to get right in every form and AJAX call."
        ],
        avoid: [
          "The API is stateless with bearer tokens in headers — the attack " +
            "does not apply.",
          "The endpoint is genuinely read-only and changes nothing.",
          "Authentication is mutual TLS or another non-ambient mechanism.",
          "It is a public endpoint with no authentication and no side effects."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "zero-trust",

      why: {
        before: "Security was a perimeter. A firewall separated the trusted " +
          "internal network from the hostile internet, and once inside the VPN " +
          "you were assumed to belong there.",
        problem: "The model assumes the inside is safe, and it never was. One " +
          "phished laptop, one compromised contractor, one vulnerable printer " +
          "and the attacker is *inside* — where nothing checks anything. Cloud, " +
          "SaaS and remote work then dissolved the perimeter entirely: there " +
          "is no longer an inside to be in.",
        shift: "Stop treating network location as evidence of anything. " +
          "**Never trust, always verify**: authenticate and authorise every " +
          "request on its own merits, from any location, for every resource, " +
          "every time. Being on the corporate network becomes worth exactly " +
          "nothing."
      },

      num: {
        t: "Perimeter against zero trust",
        h: ["Question", "Perimeter model", "Zero trust"],
        r: [
          ["Is this request trusted?", "is it inside the network?", "who, what device, what resource"],
          ["Lateral movement", "**unrestricted**", "blocked per-service"],
          ["After a breach", "attacker roams freely", "attacker has one identity"],
          ["Access grant", "broad, long-lived", "least privilege, short-lived"]
        ],
        n: "The **2013 Target breach** is the canonical illustration: attackers " +
          "entered through an **HVAC contractor's** credentials and moved " +
          "laterally to point-of-sale systems — 40 million cards, because " +
          "network position implied trust. Google's **BeyondCorp** was the " +
          "first large public implementation, and it took them **roughly a " +
          "decade**. That timescale is the honest headline: zero trust is a " +
          "multi-year architectural programme, not a product you buy."
      },

      miss: [
        {
          w: "Zero trust is a product you can purchase.",
          r: "It is an architecture. Vendors sell components — identity " +
            "providers, device posture, micro-segmentation, policy engines — " +
            "and no single purchase delivers it. A *zero trust solution* on a " +
            "datasheet is marketing attached to one piece of a much larger " +
            "programme."
        },
        {
          w: "Zero trust means no VPN.",
          r: "Removing the VPN is a **consequence**, not the definition. The " +
            "principle is that access decisions rest on identity, device state " +
            "and policy rather than network location. A VPN that still grants " +
            "flat network access is the thing being replaced; a VPN used purely " +
            "as an encrypted transport is not incompatible."
        },
        {
          w: "It means nothing is ever trusted.",
          r: "It means trust is never **implicit** or **permanent**. Trust is " +
            "granted explicitly, scoped narrowly, verified continuously and " +
            "expires. *Verify then trust, briefly, for this one thing* is the " +
            "actual model."
        },
        {
          w: "Zero trust prevents breaches.",
          r: "It limits **blast radius**. An attacker with one set of stolen " +
            "credentials gets exactly what that identity is authorised for, and " +
            "lateral movement is what the model is specifically designed to " +
            "stop. The initial compromise still happens; the difference is what " +
            "it is worth."
        }
      ],

      trade: {
        buys: [
          "Removes lateral movement, the mechanism behind most large breaches.",
          "Location-independent — remote and cloud are not special cases.",
          "Least privilege by default rather than by exception.",
          "Rich audit trail, since every access is an explicit decision."
        ],
        costs: [
          "A multi-year programme touching identity, devices, network and apps.",
          "Every service must authenticate and authorise properly.",
          "Policy engines and identity infrastructure become critical " +
            "dependencies.",
          "Legacy systems that cannot participate need bridges."
        ],
        avoid: [
          "You have no identity foundation yet — start with SSO and MFA, which " +
            "deliver more per unit of effort.",
          "The estate is a handful of servers with two administrators.",
          "You are treating it as a purchase; that produces cost without the " +
            "architecture.",
          "Basic hygiene — patching, backups, least privilege — is not in " +
            "place. Do that first."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "feature-store",

      why: {
        before: "Features were computed in a training notebook with pandas, " +
          "and then computed again in the serving code — usually by a " +
          "different engineer, in a different language, months later.",
        problem: "The two implementations drift. A subtle difference in how " +
          "nulls are filled or how a rolling average is windowed means the " +
          "model sees different inputs in production than it trained on — " +
          "**training-serving skew** — and accuracy silently degrades with no " +
          "error anywhere. Worse, features are re-implemented per team with no " +
          "sharing.",
        shift: "Define each feature **once** and serve it to both paths: batch " +
          "for training, low-latency for inference, from the same definition. " +
          "The store also solves **point-in-time correctness**, which is the " +
          "harder half of the problem."
      },

      num: {
        t: "What it addresses",
        h: ["Problem", "Without a store", "With one"],
        r: [
          ["Training-serving skew", "two implementations", "one definition"],
          ["Point-in-time joins", "hand-rolled, error-prone", "built in"],
          ["Feature reuse", "copy-paste per team", "a catalogue"],
          ["Serving latency", "recompute per request", "precomputed lookup"],
          ["Backfill", "rewrite the pipeline", "replay the definition"]
        ],
        n: "**Point-in-time correctness** is the part people underestimate. " +
          "Training a churn model on *total lifetime spend* computed **today** " +
          "leaks the future into every historical row — the model learns from " +
          "information that did not exist at prediction time, scores " +
          "beautifully offline and fails completely in production. A correct " +
          "join must reconstruct each feature **as it was at that row's " +
          "timestamp**, and doing that by hand in SQL is where most silent " +
          "leakage bugs live."
      },

      miss: [
        {
          w: "A feature store is a database for features.",
          r: "The storage is the least interesting part. Its actual jobs are " +
            "**one definition serving two paths**, **point-in-time correct " +
            "joins**, and a **shared catalogue**. A table of precomputed " +
            "features with no point-in-time semantics is not a feature store; " +
            "it is a table."
        },
        {
          w: "You need one as soon as you deploy a model.",
          r: "For one or two models owned by one team, the overhead usually " +
            "exceeds the benefit — a shared feature library plus disciplined " +
            "point-in-time SQL covers it. Feature stores earn their place when " +
            "several teams need the same features and consistency across them " +
            "becomes a real coordination problem."
        },
        {
          w: "It eliminates training-serving skew.",
          r: "It eliminates the *feature computation* source of skew. Skew from " +
            "different preprocessing, different library versions, or a " +
            "production data distribution that has shifted remains entirely. " +
            "It closes one important door of several."
        },
        {
          w: "Online and offline stores hold the same data.",
          r: "They hold the same **definitions** with different shapes. The " +
            "offline store keeps full history for training joins; the online " +
            "store keeps only the **latest** value per entity, in a key-value " +
            "store optimised for single-digit-millisecond lookup. Keeping them " +
            "in sync is a core part of what the system does."
        }
      ],

      trade: {
        buys: [
          "One feature definition serving training and inference.",
          "Point-in-time correct joins, preventing a whole class of leakage.",
          "Features become reusable, discoverable assets across teams.",
          "Low-latency serving without recomputation on the request path."
        ],
        costs: [
          "Substantial infrastructure — two stores plus a sync pipeline.",
          "A new dependency on the critical inference path.",
          "Feature definitions become their own thing to version and govern.",
          "Real learning curve for the team."
        ],
        avoid: [
          "One team, a couple of models — a shared library is enough.",
          "Features are computed from the request payload itself and have no " +
            "history.",
          "Batch scoring only, where serving latency is irrelevant.",
          "The organisation has no feature reuse problem yet."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "data-drift",

      why: {
        before: "A model was validated at training time, deployed, and " +
          "monitored for uptime and latency like any other service.",
        problem: "Models decay in a way software does not. The code is " +
          "unchanged and correct, and the **world moves**: prices inflate, " +
          "user behaviour shifts, a competitor launches, a pandemic rewrites " +
          "every pattern. Accuracy falls with no error, no alert and no failed " +
          "test — the service is 100% healthy and increasingly wrong.",
        shift: "Monitor the **data**, not just the service. Compare the " +
          "distribution of incoming features against the training " +
          "distribution, and treat divergence as a signal to investigate or " +
          "retrain."
      },

      num: {
        t: "Kinds of drift, and what they mean",
        h: ["Type", "What changed", "Example"],
        r: [
          ["Covariate / feature drift", "P(X)", "users skew younger"],
          ["Label drift", "P(Y)", "fraud rate rises"],
          ["**Concept drift**", "P(Y\\|X)", "same inputs, different meaning"],
          ["Upstream data bug", "neither — a pipeline broke", "a field becomes null"]
        ],
        n: "**Population Stability Index** is the common detector: below " +
          "**0.1** is stable, 0.1–0.25 warrants investigation, above **0.25** " +
          "is significant drift. Two cautions from practice. First, the most " +
          "frequent cause of a drift alert is not the world changing but an " +
          "**upstream pipeline bug** — a renamed column, a unit change, a " +
          "default that became null. Check that before retraining. Second, " +
          "**concept drift is the dangerous one and the hardest to see**: " +
          "feature distributions can look identical while the relationship " +
          "between inputs and outcome has inverted, and only labels reveal it."
      },

      miss: [
        {
          w: "Drift means the model has degraded.",
          r: "Drift means the **inputs** changed. Performance may be unaffected " +
            "— the model might be robust to that shift, or the drifting feature " +
            "may be unimportant. Conversely accuracy can collapse with no " +
            "detectable feature drift, if the *relationship* changed. Drift is " +
            "a leading indicator, not a measurement of quality."
        },
        {
          w: "Detecting drift means it is time to retrain.",
          r: "First establish **why**. If a pipeline broke, retraining bakes " +
            "corrupted data into the model and makes things much worse. If the " +
            "world genuinely changed, retraining is right. Automatic retraining " +
            "triggered by drift alerts is a well-known way to amplify a data " +
            "bug into a production incident."
        },
        {
          w: "You can detect drift without labels.",
          r: "You can detect **feature** drift without labels, which is why it " +
            "is monitored — labels often arrive weeks later, if at all. But " +
            "true performance degradation needs ground truth. Feature drift is " +
            "the proxy you watch precisely because the real signal is delayed."
        },
        {
          w: "Statistical tests are the right detector at scale.",
          r: "Tests like Kolmogorov-Smirnov become **too sensitive** on large " +
            "samples — with a million rows, statistically significant " +
            "differences appear constantly and mean nothing operationally. " +
            "Effect-size measures like PSI or Wasserstein distance, with " +
            "thresholds, are the practical choice."
        }
      ],

      trade: {
        buys: [
          "Early warning before accuracy visibly falls.",
          "Works without labels, which are usually delayed.",
          "Catches upstream data bugs that no other monitor sees.",
          "Evidence for when retraining is actually warranted."
        ],
        costs: [
          "False alarms are common and erode trust in the alerts.",
          "Requires storing reference distributions and monitoring " +
            "infrastructure.",
          "Feature drift correlates imperfectly with performance.",
          "Concept drift — the one that matters most — is largely invisible " +
            "to it."
        ],
        avoid: [
          "You have fast ground-truth labels — monitor **accuracy** directly, " +
            "which is strictly better.",
          "The input distribution is genuinely stationary and controlled.",
          "The model is used once and discarded.",
          "You have no plan for what to do when it fires; an unactioned alert " +
            "is noise."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "canary-deployment",

      why: {
        before: "Deploys replaced the old version with the new one everywhere " +
          "at once. Tests passed, so ship it.",
        problem: "Staging is never production. Real traffic has data volumes, " +
          "concurrency patterns, cache states and long-tail inputs no test " +
          "environment reproduces. A bug that only appears under those " +
          "conditions reaches **100% of users** simultaneously.",
        shift: "Send a small slice of real traffic to the new version, watch " +
          "the metrics that matter, and expand only if they hold. The " +
          "**blast radius** of a bad release becomes a number you choose in " +
          "advance rather than a number you discover afterwards."
      },

      num: {
        t: "Deployment strategies",
        h: ["Strategy", "Blast radius", "Rollback", "Extra capacity"],
        r: [
          ["Big bang", "100%", "redeploy old", "none"],
          ["Rolling", "grows gradually", "roll back through", "small"],
          ["**Canary**", "1–5%, then chosen", "shift traffic back", "small"],
          ["Blue-green", "0% then 100%", "**instant switch**", "2×"]
        ],
        n: "A typical progression is **1% → 5% → 25% → 50% → 100%**, with a " +
          "bake time at each step long enough for the relevant signal to " +
          "appear. That last point is what teams get wrong: a memory leak needs " +
          "hours to show, so a five-minute bake proves nothing about it. Note " +
          "also the statistics — at 1% of traffic you may simply not have " +
          "enough samples to detect a small regression, so the canary size has " +
          "to be large enough for the error rate you care about to be visible."
      },

      miss: [
        {
          w: "A canary deployment is a gradual rollout.",
          r: "A rolling deploy replaces instances gradually with no comparison. " +
            "A canary **compares** the new version's metrics against the old " +
            "and gates progression on that comparison. Without the comparison " +
            "and the automatic rollback, you have a rolling deploy with extra " +
            "steps."
        },
        {
          w: "If the canary has no errors, the release is safe.",
          r: "Only for what you measured, over the time you waited. Error rate " +
            "catches crashes; it misses slow memory leaks, cache-related " +
            "degradation, and behaviour that only appears for a segment absent " +
            "from your 1%. Latency percentiles, saturation and business metrics " +
            "matter as much as errors."
        },
        {
          w: "Canary deployments work for any change.",
          r: "They assume both versions can run **simultaneously against the " +
            "same data**. A backwards-incompatible database migration breaks " +
            "that assumption outright — which is why schema changes need the " +
            "**expand-migrate-contract** pattern, making the schema compatible " +
            "with both versions before either is deployed."
        },
        {
          w: "You should route random traffic to the canary.",
          r: "Random per-request routing gives one user a mix of versions, " +
            "which is confusing and can corrupt sessions. Route by **sticky " +
            "identity** — user or session — so an individual experiences one " +
            "consistent version, and consider whether internal users should go " +
            "first."
        }
      ],

      trade: {
        buys: [
          "Blast radius becomes a deliberate decision.",
          "Validation against real traffic, which no staging reproduces.",
          "Rollback is a traffic shift, not a redeploy.",
          "Confidence to deploy more often, which makes each change smaller."
        ],
        costs: [
          "Two versions live at once, so both must tolerate shared state.",
          "Needs good metrics and an automated comparison to be worth it.",
          "Slower to fully release, which delays fixes as well as features.",
          "Database migrations require an explicit compatibility strategy."
        ],
        avoid: [
          "The change is a breaking schema migration — sequence it separately.",
          "Traffic is too low for a small percentage to be statistically " +
            "meaningful.",
          "You lack the metrics to judge the canary; you are just deploying " +
            "slowly.",
          "The change is trivial and reversible, where the ceremony costs more " +
            "than it saves."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "infrastructure-as-code",

      why: {
        before: "Servers were configured by hand or by scripts run once and " +
          "forgotten. The state of production lived in the machines themselves " +
          "and in the memory of whoever built them.",
        problem: "Nothing is reproducible. Rebuilding after a failure means " +
          "rediscovering what was there; staging silently diverges from " +
          "production; a change made at 2am is invisible to everyone else — " +
          "**configuration drift**, and no way to detect it.",
        shift: "Declare the desired state in files under version control and " +
          "let a tool reconcile reality to it. Infrastructure gains what code " +
          "already had: review, history, rollback and testing. The definitive " +
          "answer to *what is running* becomes a repository rather than a " +
          "machine."
      },

      num: {
        t: "Declarative against imperative",
        h: ["", "Declarative (Terraform)", "Imperative (scripts)"],
        r: [
          ["You write", "the desired end state", "the steps to get there"],
          ["Running twice", "**no change**", "may duplicate or fail"],
          ["Drift detection", "`plan` shows it", "invisible"],
          ["Partial failure", "state may be inconsistent", "unknown position"]
        ],
        n: "**Idempotence** is the property that makes declarative tooling " +
          "work: applying the same configuration repeatedly converges to the " +
          "same state. The hard operational reality is the **state file** — " +
          "Terraform's record of what it believes exists. It must be stored " +
          "remotely and **locked**, or two engineers applying simultaneously " +
          "corrupt it. A lost state file means Terraform no longer knows it " +
          "owns your infrastructure and will attempt to recreate it. Treat " +
          "state as production data: remote backend, locking, versioning, " +
          "backups."
      },

      miss: [
        {
          w: "Infrastructure as code means writing scripts to set up servers.",
          r: "Scripts are **imperative** — a sequence of steps whose outcome " +
            "depends on the starting state. IaC in the modern sense is " +
            "**declarative**: you describe the end state and the tool computes " +
            "the difference. Running a script twice may break; applying a " +
            "declaration twice does nothing."
        },
        {
          w: "Once it is in code, the infrastructure cannot drift.",
          r: "Anyone with console access can still change things by hand, and " +
            "then your code and reality disagree. Drift is *detectable* rather " +
            "than *prevented*, and only if you regularly run `plan`. Real " +
            "prevention needs restricted console permissions and drift " +
            "detection in CI."
        },
        {
          w: "You should manage every resource with it.",
          r: "Some resources are genuinely awkward — anything with a long " +
            "provisioning time, anything stateful and irreplaceable, anything " +
            "another system already owns. A production database managed by " +
            "Terraform is one careless `terraform destroy` from disaster, which " +
            "is why `prevent_destroy` and data-protection lifecycle rules exist."
        },
        {
          w: "The code is the source of truth.",
          r: "The **state file** is what the tool acts on. If it disagrees with " +
            "reality — because someone deleted a resource by hand, or state was " +
            "lost — the next apply does something surprising. Understanding " +
            "state, `import` and `refresh` is what separates people who use IaC " +
            "from people who fight it."
        }
      ],

      trade: {
        buys: [
          "Reproducible environments, and disaster recovery that is a rerun.",
          "Review and audit for infrastructure changes.",
          "Staging that genuinely matches production.",
          "Documentation that cannot go stale, because it is the source."
        ],
        costs: [
          "State files are critical infrastructure needing locking and backup.",
          "A real learning curve and a new failure mode when state is wrong.",
          "Slower for one-off exploratory changes.",
          "Provider bugs and lagging coverage for new cloud features."
        ],
        avoid: [
          "A genuine one-off experiment you will delete tomorrow.",
          "The resource is better owned by another system — do not manage the " +
            "same thing from two places.",
          "You are in an incident and need a manual fix now; reconcile the code " +
            "afterwards.",
          "A managed platform already owns the lifecycle."
        ]
      }
    }

  ]);
})(window.TD = window.TD || {});
