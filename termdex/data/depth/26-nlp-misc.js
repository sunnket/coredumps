/* ==========================================================================
   Depth pass 26 — classical NLP, protocols, and engineering practice.

   The NLP terms here are pre-transformer and worth understanding for two
   reasons: several are still the right tool at small scale, and the
   problems they were built for (ambiguity, reference, word meaning) did not
   disappear — transformers absorbed them implicitly rather than solving
   them explicitly, which is why they resurface as failure modes.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "quic",

      why: {
        before: "HTTP/2 solved application-level head-of-line blocking by " +
          "multiplexing many streams over **one** TCP connection. A genuine " +
          "improvement over HTTP/1.1's six connections per host.",
        problem: "It moved the blocking down a layer rather than removing it. " +
          "TCP delivers a **single ordered byte stream**, so one lost packet " +
          "stalls *every* multiplexed stream — including the ones whose data " +
          "already arrived intact. HTTP/2 over a lossy mobile link can be " +
          "**worse** than HTTP/1.1, because six connections lose independently " +
          "while one connection loses for everyone.",
        shift: "Fix it where the problem is: build a new transport on **UDP**, " +
          "with reliability and congestion control implemented per-stream in " +
          "userspace. Streams become genuinely independent, TLS is integrated " +
          "rather than layered, and — because it lives in the application — it " +
          "can be **deployed without waiting for operating systems to update**."
      },

      num: {
        t: "Connection setup, and what QUIC changes",
        h: ["", "TCP + TLS 1.3", "QUIC", "QUIC 0-RTT"],
        r: [
          ["Round trips before data", "**2**", "**1**", "**0**"],
          ["At 50ms RTT", "100ms", "50ms", "**0ms**"],
          ["Head-of-line blocking", "**across all streams**", "per stream", "per stream"],
          ["Survives network change", "**no**", "**yes — connection ID**", "yes"],
          ["Runs in", "kernel", "**userspace**", "userspace"]
        ],
        n: "**Connection migration** is the feature people underestimate. TCP " +
          "identifies a connection by the four-tuple of IPs and ports, so " +
          "moving from Wi-Fi to cellular **breaks it** and everything restarts. " +
          "QUIC uses a **connection ID** independent of the addresses, so the " +
          "session survives the switch — which is why it matters " +
          "disproportionately on mobile. The costs are real: **userspace means " +
          "more CPU** than kernel TCP (early deployments reported roughly 2× " +
          "per byte, since narrowed), some networks throttle or block UDP " +
          "outright, and mature kernel TCP optimisations do not transfer. " +
          "0-RTT also carries a genuine **replay** risk, so it must only carry " +
          "idempotent requests."
      },

      miss: [
        {
          w: "QUIC is HTTP/3.",
          r: "QUIC is the **transport protocol**; HTTP/3 is HTTP mapped onto " +
            "it. QUIC can carry other protocols — DNS over QUIC, SMB, and " +
            "others — and the separation matters because QUIC's benefits are " +
            "transport-level rather than HTTP-specific."
        },
        {
          w: "UDP is unreliable, so QUIC is unreliable.",
          r: "QUIC implements **its own** reliability, ordering and congestion " +
            "control on top of UDP. It uses UDP only because that is the " +
            "datagram service the internet already forwards — building on TCP " +
            "would inherit exactly the ordering constraint it exists to escape."
        },
        {
          w: "QUIC is always faster than TCP.",
          r: "It wins clearly on **lossy or high-latency** links and on " +
            "connection setup. On a fast, reliable, low-latency network the " +
            "gains shrink, and userspace processing can make it **slower** for " +
            "bulk transfer. Measure on your actual network conditions."
        },
        {
          w: "0-RTT is free performance you should always enable.",
          r: "0-RTT data can be **replayed** by an attacker who captures it. It " +
            "is only safe for **idempotent** requests — a `GET` is fine, a " +
            "payment is not. Enabling it indiscriminately is a genuine security " +
            "error."
        }
      ],

      trade: {
        buys: [
          "No head-of-line blocking across streams.",
          "1-RTT setup, or 0-RTT on resumption.",
          "Connections survive network changes.",
          "Deployable without OS updates — it lives in the application.",
          "TLS 1.3 integrated by design; encryption is not optional."
        ],
        costs: [
          "Higher CPU cost than kernel TCP.",
          "Some networks throttle or block UDP.",
          "Encrypted headers make network debugging much harder.",
          "0-RTT carries replay risk.",
          "Less mature tooling than decades-old TCP."
        ],
        avoid: [
          "The network is reliable and low-latency, where TCP is fine.",
          "You are on a network that blocks or degrades UDP.",
          "Bulk transfer where CPU cost matters more than latency.",
          "Middleboxes require visible transport headers for policy."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "chaos-engineering",

      why: {
        before: "Reliability was pursued by **preventing** failure: redundant " +
          "hardware, careful testing, and thorough runbooks for when things " +
          "went wrong anyway.",
        problem: "In a distributed system, failure is continuous and the " +
          "**failure-handling code is the least tested code you own**. Retry " +
          "logic, circuit breakers, fallbacks and timeouts run only during " +
          "incidents — which is precisely when you discover the retry storms, " +
          "the fallback that also depends on the dead service, and the timeout " +
          "longer than the caller's.",
        shift: "Netflix's answer was to **inject failure deliberately, in " +
          "production, continuously**. If instances die randomly every day, " +
          "engineers build systems that tolerate it — and you find the broken " +
          "recovery path at 2pm on a Tuesday with everyone watching, rather " +
          "than at 3am during a real outage."
      },

      num: {
        t: "The discipline, not the tool",
        h: ["Step", "Why it matters"],
        r: [
          ["**State a steady-state hypothesis**", "**without it you are just breaking things**"],
          ["Define the blast radius", "start with 1% of traffic, not 100%"],
          ["Have an abort switch", "stop the experiment instantly"],
          ["Run in production", "staging does not reproduce real conditions"],
          ["Automate and repeat", "one-off tests decay"]
        ],
        n: "The first row is what separates chaos engineering from vandalism, " +
          "and it is the step most often skipped. The method is a **scientific " +
          "experiment**: state what *should* happen (*checkout success rate " +
          "stays above 99.9% when one availability zone fails*), inject the " +
          "failure, and see whether the hypothesis holds. If you have not " +
          "written the hypothesis, you cannot tell success from luck. The " +
          "prerequisite people skip is **observability** — running an " +
          "experiment on a system you cannot measure teaches you nothing and " +
          "risks an outage. Netflix's Chaos Monkey is the famous tool; the " +
          "discipline is the transferable part."
      },

      miss: [
        {
          w: "Chaos engineering means randomly breaking production.",
          r: "It means **controlled experiments with a stated hypothesis, a " +
            "bounded blast radius and an abort switch**. Randomly killing " +
            "things without those is an outage you caused. The rigour is what " +
            "makes it defensible to run in production."
        },
        {
          w: "You should start with Chaos Monkey in production.",
          r: "You start by **fixing what you already know is fragile**, and by " +
            "building observability good enough to detect impact. Injecting " +
            "failure into a system with known weaknesses and no monitoring " +
            "produces an incident, not a finding."
        },
        {
          w: "It is only for companies at Netflix's scale.",
          r: "The scale determines the *tooling*, not the principle. A " +
            "two-service system can usefully ask *what happens if the database " +
            "is slow?* and test it in staging with `tc netem`. **GameDays** — " +
            "scheduled manual failure exercises — are chaos engineering without " +
            "any automation."
        },
        {
          w: "If the experiment causes an incident, it failed.",
          r: "It **succeeded** — it found a real weakness under controlled " +
            "conditions with engineers watching, which is enormously cheaper " +
            "than finding it at 3am. The failure mode is an experiment that " +
            "teaches nothing, not one that finds something."
        }
      ],

      trade: {
        buys: [
          "Tests the failure-handling code that never otherwise runs.",
          "Finds unknown dependencies and hidden coupling.",
          "Builds genuine confidence in recovery, not assumed confidence.",
          "Surfaces problems on a schedule rather than at random."
        ],
        costs: [
          "Can cause real incidents if the blast radius is wrong.",
          "Requires strong observability as a prerequisite.",
          "Organisational buy-in is genuinely hard to obtain.",
          "Tooling and ongoing maintenance."
        ],
        avoid: [
          "Observability is insufficient to measure the impact.",
          "Known reliability problems are still unfixed — fix those first.",
          "The system is a single-instance application with no redundancy to " +
            "test.",
          "There is no abort mechanism or the blast radius cannot be bounded.",
          "The organisation would treat a finding as a failure rather than a " +
            "result."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "formal-verification",

      why: {
        before: "Correctness was established by **testing**. Write cases, run " +
          "them, and gain confidence proportional to coverage.",
        problem: "Dijkstra's observation is the whole argument: *testing shows " +
          "the presence, not the absence, of bugs*. A system with a 64-bit " +
          "input has more possible inputs than there are atoms in the Earth — " +
          "no test suite explores a meaningful fraction, and the bugs that " +
          "matter are in the states you did not think to test.",
        shift: "**Prove** the property instead. Express the specification " +
          "mathematically and derive that the implementation satisfies it for " +
          "*all* inputs. Where a proof succeeds it is not evidence of " +
          "correctness — it is correctness, for the property stated, relative " +
          "to the model."
      },

      num: {
        t: "The verification spectrum",
        h: ["Method", "Effort", "Guarantee", "Used in"],
        r: [
          ["Testing", "low", "sampled inputs", "everywhere"],
          ["Property-based testing", "low-med", "many random inputs", "increasingly common"],
          ["**Model checking (TLA+)**", "**medium**", "**the design, exhaustively**", "**AWS, Azure**"],
          ["Static analysis", "low", "specific bug classes", "widely"],
          ["**Proof assistants (Coq)**", "**very high**", "**the code**", "seL4, CompCert"]
        ],
        n: "**TLA+ is the row worth knowing about**, because it is the " +
          "practical middle. It verifies the **design**, not the code — you " +
          "model the algorithm and check whether concurrent interleavings " +
          "violate an invariant. AWS reported using it on S3, DynamoDB and " +
          "others, finding bugs that *would not have been found by any amount " +
          "of testing* because they required specific rare interleavings. At " +
          "the far end, **seL4** is a fully proven microkernel: roughly 10,000 " +
          "lines of C, over 200,000 lines of proof, and around **20 " +
          "person-years** — a ratio of about 20:1 proof to code, which is why " +
          "full verification is reserved for kernels, compilers and avionics."
      },

      miss: [
        {
          w: "A verified program has no bugs.",
          r: "It satisfies **the specification you wrote**, under **the " +
            "assumptions you made**. A wrong specification is faithfully " +
            "implemented; assumptions about the hardware, compiler or " +
            "environment can be violated. Verification moves the trust from the " +
            "code to the spec, which is enormous progress and not the same as " +
            "no bugs."
        },
        {
          w: "Formal verification is impractical for real systems.",
          r: "**Full** verification is expensive and rarely justified. " +
            "Lightweight formal methods are routine: TLA+ for protocol design, " +
            "SMT solvers inside static analysers, refinement types, and " +
            "property-based testing. The spectrum matters more than the " +
            "extreme."
        },
        {
          w: "You verify the code you shipped.",
          r: "Most industrial use verifies the **design or model**, not the " +
            "implementation. TLA+ finds concurrency bugs in the algorithm; the " +
            "code that implements it can still be wrong. Verifying actual " +
            "source is far rarer and far more expensive."
        },
        {
          w: "It is only for safety-critical software.",
          r: "Distributed systems are a major driver — consensus protocols, " +
            "cache coherence and replication have interleavings human review " +
            "reliably misses. Cryptographic implementations are another, where " +
            "a subtle bug is a total break."
        }
      ],

      trade: {
        buys: [
          "Exhaustive guarantees over all inputs or all interleavings.",
          "Finds bugs testing structurally cannot reach.",
          "Forces a precise specification, which is valuable by itself.",
          "Lightweight methods give much of the benefit cheaply."
        ],
        costs: [
          "Full verification can cost 20× the implementation effort.",
          "Requires specialist skills that are scarce.",
          "Guarantees are only as good as the spec and assumptions.",
          "Proofs must be maintained as code changes.",
          "Model checking hits state-space explosion."
        ],
        avoid: [
          "The cost of a bug is low and testing is proportionate.",
          "Requirements change rapidly — proofs would be rewritten constantly.",
          "The team has no formal methods experience and the stakes do not " +
            "justify acquiring it.",
          "**Property-based testing** would catch the realistic failures at a " +
            "fraction of the cost — often true."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "fasttext",

      why: {
        before: "**word2vec** and **GloVe** learned one vector per word from " +
          "corpus statistics — a genuine breakthrough, and a fixed vocabulary.",
        problem: "Two failures follow directly. Any word not seen in training " +
          "has **no vector at all** — typos, new product names, rare " +
          "inflections. And morphology is invisible: *running*, *runner* and " +
          "*runs* are unrelated symbols, so every form must be learned " +
          "separately. For morphologically rich languages like Finnish or " +
          "Turkish, where one root has hundreds of forms, this is crippling.",
        shift: "Represent a word as a **bag of character n-grams**. *running* " +
          "becomes `<ru`, `run`, `unn`, `nni`, `nin`, `ing`, `ng>` plus the " +
          "whole word, and its vector is the sum. Morphologically related words " +
          "now **share sub-word vectors**, and any unseen word can be " +
          "constructed from its n-grams."
      },

      num: {
        t: "Static word embeddings compared",
        h: ["Method", "Out-of-vocabulary", "Morphology", "Training"],
        r: [
          ["word2vec", "**no vector**", "ignored", "local windows"],
          ["GloVe", "**no vector**", "ignored", "**global co-occurrence**"],
          ["**FastText**", "**composed from n-grams**", "**captured**", "local + sub-word"]
        ],
        n: "The other thing FastText is known for is its **supervised text " +
          "classifier**, which is often the more useful half in practice: it " +
          "trains in **seconds to minutes on a CPU** and is frequently within a " +
          "point or two of a fine-tuned transformer on straightforward " +
          "classification, at a fraction of the cost. That makes it an " +
          "excellent **baseline** — if FastText gets 91% and your transformer " +
          "gets 92%, the transformer may not be worth its deployment cost. The " +
          "honest limitation of all three is **static** embeddings: one vector " +
          "per word regardless of context, so *bank* has a single meaning. " +
          "That is exactly what contextual embeddings from BERT onward fixed."
      },

      miss: [
        {
          w: "FastText embeddings are contextual.",
          r: "They are **static** — one vector per word, computed from " +
            "sub-words, identical in every sentence. *River bank* and " +
            "*investment bank* get the same vector. Contextual embeddings " +
            "require a transformer that reads the whole sentence."
        },
        {
          w: "It is obsolete now that transformers exist.",
          r: "For **classification at scale on CPU** it remains extremely " +
            "competitive — training in seconds, inference in microseconds, tiny " +
            "memory. It is the right choice for high-volume, latency-sensitive, " +
            "cost-sensitive classification, and the right first baseline " +
            "regardless."
        },
        {
          w: "Sub-word vectors solve out-of-vocabulary completely.",
          r: "They produce a **plausible** vector for any string, and the " +
            "quality depends on whether the n-grams were meaningfully trained. " +
            "A word with genuinely novel morphology, or a proper noun sharing " +
            "no informative n-grams, gets a vector that is a guess."
        },
        {
          w: "Bigger n-gram ranges are better.",
          r: "The default 3–6 is well-chosen. Larger ranges explode the hash " +
            "table and memory; smaller ones lose morphological signal. The " +
            "n-gram vocabulary is also **hashed into buckets**, so collisions " +
            "occur and larger ranges make them worse."
        }
      ],

      trade: {
        buys: [
          "Vectors for any word, including unseen ones.",
          "Captures morphology — vital for inflected languages.",
          "Extremely fast to train and to run, on CPU.",
          "Excellent classification baseline in minutes.",
          "Pretrained vectors for 150+ languages."
        ],
        costs: [
          "Static embeddings — no context sensitivity.",
          "Larger model than word2vec due to n-gram storage.",
          "N-gram hashing causes collisions.",
          "Beaten by contextual models on tasks needing disambiguation."
        ],
        avoid: [
          "The task needs word sense disambiguation or context.",
          "You need state-of-the-art accuracy and can afford a transformer.",
          "The language is not morphologically rich and word2vec suffices.",
          "The task is generation rather than representation."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "coreference-resolution",

      why: {
        before: "Information extraction processed sentences independently. " +
          "Each mention of an entity was treated as a separate thing.",
        problem: "Text does not repeat names — it uses pronouns and shortened " +
          "forms. *Marie Curie won the Nobel Prize. **She** later won a second " +
          "one, and **the physicist** remains the only person to win in two " +
          "sciences.* Without linking *she* and *the physicist* to *Marie " +
          "Curie*, two thirds of the information is unattached to anyone.",
        shift: "Explicitly resolve which mentions refer to the same entity. " +
          "The difficulty is that it frequently requires **world knowledge " +
          "rather than grammar**: *The trophy would not fit in the suitcase " +
          "because **it** was too big* — resolving *it* requires knowing that " +
          "trophies go in suitcases, not the reverse. That is the **Winograd " +
          "schema**, designed specifically to be unsolvable by syntax."
      },

      num: {
        t: "Kinds of coreference, by difficulty",
        h: ["Type", "Example", "Hard?"],
        r: [
          ["Pronominal", "*Marie … she*", "usually easy"],
          ["Nominal", "*Marie … the physicist*", "medium"],
          ["**Winograd-style**", "***it** was too big*", "**needs world knowledge**"],
          ["Split antecedent", "*Alice and Bob … they*", "hard"],
          ["Zero anaphora", "dropped subject (Chinese, Japanese)", "**very hard**"]
        ],
        n: "Coreference is a good example of a task that **large language " +
          "models largely absorbed rather than solved**. Winograd schemas were " +
          "proposed as an AI-complete benchmark and modern LLMs score above " +
          "90% — but they do it implicitly inside their representations, with " +
          "no explicit coreference chain you can inspect or correct. That " +
          "matters when you need **structured output**: building a knowledge " +
          "graph, tracking entities across a long document, or producing an " +
          "auditable extraction still wants explicit coreference. It also " +
          "remains important for **RAG chunking** — split a document mid-" +
          "discussion and the chunk full of *she* and *it* is unusable, which " +
          "is part of what contextual retrieval addresses."
      },

      miss: [
        {
          w: "Coreference resolution is mainly about pronouns.",
          r: "Pronouns are the easiest case. **Nominal** coreference — *the " +
            "physicist*, *the company*, *the device* — is harder and often " +
            "carries more information. So is deciding whether two mentions of " +
            "*the bank* refer to the same bank."
        },
        {
          w: "LLMs solved it, so it is no longer a separate task.",
          r: "They handle it **implicitly and well**. What they do not give you " +
            "is an **explicit chain** you can inspect, correct or store. For " +
            "knowledge graph construction, document analytics and auditable " +
            "extraction, explicit resolution is still the requirement."
        },
        {
          w: "It is a solved problem given high benchmark scores.",
          r: "Scores are high **on English news text**. Performance drops " +
            "substantially on dialogue, on domains with unusual entities, on " +
            "long documents where chains span thousands of tokens, and on " +
            "languages with zero anaphora where the mention is simply absent."
        },
        {
          w: "It matters only for linguistic applications.",
          r: "It is directly relevant to **RAG**: chunking a document breaks " +
            "coreference chains, leaving chunks that refer to entities named " +
            "elsewhere. Resolving references before chunking, or adding context " +
            "to chunks, measurably improves retrieval."
        }
      ],

      trade: {
        buys: [
          "Connects information scattered across a document to the right " +
            "entity.",
          "Essential for knowledge graph construction.",
          "Improves summarisation, extraction and RAG chunking.",
          "Produces an explicit, auditable structure."
        ],
        costs: [
          "Hard cases need world knowledge, not grammar.",
          "Errors propagate — a wrong link corrupts everything downstream.",
          "Adds a pipeline stage with its own latency and failure modes.",
          "Performance varies sharply by domain and language."
        ],
        avoid: [
          "An LLM handles the end-to-end task and you need no explicit chain.",
          "Text is short enough that entities are named each time.",
          "The domain is far from the resolver's training data.",
          "You need the answer, not the structure — ask the model directly."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "latent-dirichlet-allocation",

      why: {
        before: "Finding themes in a document collection meant clustering — " +
          "each document assigned to exactly one cluster.",
        problem: "Documents are not about one thing. A news article about a " +
          "pharmaceutical merger is **partly** business, **partly** medicine, " +
          "**partly** law. Hard clustering forces a false choice and loses the " +
          "mixture, which is usually the interesting part.",
        shift: "Model documents as **mixtures**. LDA is a generative story: " +
          "each document has a distribution over topics, each topic a " +
          "distribution over words, and each word is generated by first " +
          "picking a topic then picking a word from it. Inference runs that " +
          "story backwards to recover the topics that best explain the corpus."
      },

      num: {
        t: "LDA against modern approaches",
        h: ["Method", "Needs", "Interpretability", "Quality"],
        r: [
          ["**LDA**", "**CPU, no embeddings**", "**word lists per topic**", "moderate"],
          ["**BERTopic**", "embeddings + clustering", "good", "**better**"],
          ["Top2Vec", "embeddings", "good", "better"],
          ["LLM labelling", "API calls", "**excellent**", "best, most expensive"]
        ],
        n: "Two parameters dominate LDA in practice. **The number of topics `k` " +
          "must be chosen in advance** and there is no reliable automatic " +
          "criterion — perplexity is a poor guide because it often " +
          "*anti-correlates* with human judgements of topic quality, and " +
          "**coherence** measures are the better proxy. Second, the **Dirichlet " +
          "priors** control sparsity: a low alpha means each document is about " +
          "few topics, a low beta means each topic uses few words, and both " +
          "materially change what you get. LDA remains useful where you need " +
          "topic modelling **on CPU with no embedding infrastructure**, and " +
          "**BERTopic** generally produces more coherent topics where you can " +
          "afford embeddings."
      },

      miss: [
        {
          w: "LDA finds the topics that are really in the corpus.",
          r: "It finds a **statistical decomposition** that explains word " +
            "co-occurrence under its assumptions. Topics are word " +
            "distributions, and whether they correspond to human concepts is " +
            "something you assess afterwards — often several are incoherent or " +
            "duplicated."
        },
        {
          w: "You can determine the optimal number of topics from the data.",
          r: "There is no reliable automatic method. **Perplexity often gets " +
            "worse as human-judged quality improves**, so optimising it is " +
            "actively misleading. Coherence scores plus human inspection across " +
            "several values of `k` is the practical approach."
        },
        {
          w: "LDA understands word meaning.",
          r: "It is **bag-of-words** — order is discarded entirely, and " +
            "synonyms are unrelated symbols unless they co-occur. *Car* and " +
            "*automobile* only land in the same topic if they appear in similar " +
            "documents. This is exactly what embedding-based methods fixed."
        },
        {
          w: "Topics are stable across runs.",
          r: "Inference is stochastic — Gibbs sampling or variational — so " +
            "topic **numbers and contents shift between runs**. Fixing the seed " +
            "helps for reproducibility and does not make the decomposition " +
            "canonical. Do not build systems that depend on topic 3 meaning the " +
            "same thing tomorrow."
        }
      ],

      trade: {
        buys: [
          "Documents as mixtures rather than single clusters.",
          "Interpretable output — a word list per topic.",
          "Runs on CPU with no embedding model needed.",
          "Mature, well-understood, widely implemented.",
          "Scales to large corpora."
        ],
        costs: [
          "`k` must be chosen with no reliable criterion.",
          "Bag-of-words — ignores order and synonymy.",
          "Topics vary between runs.",
          "Poor on short texts like tweets.",
          "Generally beaten by embedding-based methods."
        ],
        avoid: [
          "You can use embeddings — **BERTopic** usually gives better topics.",
          "Documents are very short.",
          "You need stable topics across runs.",
          "An LLM could label documents directly against known categories.",
          "You actually need classification, not discovery."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "deserialisation-attack",

      why: {
        before: "Serialisation libraries made it trivially easy to persist and " +
          "transmit objects — Java's `ObjectInputStream`, Python's `pickle`, " +
          "PHP's `unserialize`. One line to save, one to restore.",
        problem: "Deserialisation does not just *read data* — it **constructs " +
          "objects and runs code**. Constructors, `readObject`, `__reduce__`, " +
          "`__wakeup` and property setters all execute during reconstruction. " +
          "An attacker controlling the byte stream controls **which classes " +
          "are instantiated and with what state**, which is a foothold for " +
          "arbitrary code execution.",
        shift: "Treat serialised data as **executable input**, not as data. " +
          "The realisation that shook the industry was **gadget chains**: an " +
          "attacker does not need a malicious class in your codebase, only a " +
          "sequence of ordinary library classes whose combined behaviour on " +
          "deserialisation reaches something dangerous."
      },

      num: {
        t: "Risk by format",
        h: ["Format", "Executes code?", "Safe with untrusted input?"],
        r: [
          ["Java `ObjectInputStream`", "**yes**", "**no**"],
          ["Python `pickle`", "**yes — by design**", "**no**"],
          ["PHP `unserialize`", "**yes**", "**no**"],
          ["**JSON**", "**no**", "**yes**"],
          ["Protobuf, MessagePack", "no", "yes"],
          ["YAML `safe_load`", "no", "yes"],
          ["YAML `load` (unsafe)", "**yes**", "**no**"]
        ],
        n: "The line is clean: **formats that reconstruct arbitrary objects are " +
          "unsafe with untrusted input; formats that produce plain data " +
          "structures are safe.** Python's documentation states plainly that " +
          "pickle is not secure — yet it is the default for model checkpoints, " +
          "which is why loading a `.pkl` or an untrusted PyTorch checkpoint is " +
          "**arbitrary code execution**, and why **safetensors** was created. " +
          "The **ysoserial** tool made this practical by publishing working " +
          "gadget chains for common Java libraries, turning a theoretical class " +
          "of bug into a point-and-click exploit. Deserialisation has been in " +
          "the OWASP Top 10 since 2017."
      },

      miss: [
        {
          w: "Validating the object after deserialisation prevents the attack.",
          r: "**The code has already run.** Gadget chains execute during " +
            "reconstruction, before your validation sees anything. Any check " +
            "must happen on the **bytes**, or you must use a format that does " +
            "not execute — the latter is the real fix."
        },
        {
          w: "Signing the serialised data solves it.",
          r: "It helps substantially and is a legitimate mitigation, provided " +
            "the key is genuinely secret and the signature is verified " +
            "**before** deserialising. It does nothing if the signing key " +
            "leaks, and it does not protect against a malicious authorised " +
            "sender."
        },
        {
          w: "It requires a vulnerable class in my own code.",
          r: "**Gadget chains use ordinary library classes.** Common " +
            "dependencies — Commons Collections, Spring, Groovy — contain " +
            "sequences that reach code execution when combined. Your own code " +
            "may be entirely clean and still exploitable."
        },
        {
          w: "Loading a model checkpoint is safe because it is just weights.",
          r: "A PyTorch `.pt` or `.pkl` is a **pickle**, and loading one from " +
            "an untrusted source executes whatever the file says. This is a " +
            "real supply-chain vector for downloaded models, and precisely why " +
            "**safetensors** exists as a data-only alternative."
        }
      ],

      trade: {
        buys: [
          "Understanding it eliminates an entire vulnerability class.",
          "The fix is usually simple — change format to JSON or protobuf.",
          "Allowlisting classes is effective where the format cannot change.",
          "Explains why safetensors and similar formats were created."
        ],
        costs: [
          "Data-only formats cannot express arbitrary object graphs.",
          "Migrating away from native serialisation can be substantial work.",
          "Allowlists need maintaining as classes change.",
          "Some frameworks make native serialisation hard to avoid."
        ],
        avoid: [
          "The data genuinely never crosses a trust boundary — internal, " +
            "authenticated, integrity-protected.",
          "You are using a data-only format already; the risk does not apply.",
          "The performance cost of a safe format is prohibitive and you have " +
            "a robust signing scheme — a considered trade, not a default."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "inode",

      why: {
        before: "Early filesystems stored a file's metadata **inside its " +
          "directory entry**: name, size, permissions and block locations all " +
          "in one record.",
        problem: "That conflates the file with its name. A file can then have " +
          "only **one** name, and moving it between directories means copying " +
          "the metadata. There is no way for two directory entries to be the " +
          "same file.",
        shift: "Separate them. The **inode** holds everything about the file — " +
          "permissions, timestamps, size, and pointers to data blocks — and " +
          "the directory holds only a **name-to-inode-number mapping**. A " +
          "directory entry becomes a *link*, and a file can have many. This one " +
          "decision explains most Unix filesystem behaviour that surprises " +
          "people."
      },

      num: {
        t: "What the separation explains",
        h: ["Behaviour", "Why"],
        r: [
          ["Hard links", "**several names, one inode**"],
          ["`rm` is `unlink`", "removes a name; data goes when links reach 0"],
          ["**Deleting an open file frees no space**", "**the open FD is a reference**"],
          ["Renaming is atomic and cheap", "only the directory entry changes"],
          ["Filename is **not** in the inode", "it lives in the directory"],
          ["`df` full but `du` small", "**inode exhaustion**, or deleted-but-open files"]
        ],
        n: "The last row is the classic production incident and worth " +
          "recognising: `df` reports the disk full while `du` finds nothing. " +
          "Two causes, both inode-related. Either a process still **holds a " +
          "deleted file open** — the link count reached zero but the file " +
          "descriptor keeps the inode alive, so the blocks are not freed until " +
          "the process exits (`lsof +L1` finds these, and truncating the FD " +
          "reclaims the space immediately) — or you have run out of **inodes**, " +
          "which are allocated at format time in ext4. Millions of tiny files " +
          "exhaust the inode table while plenty of blocks remain free, and " +
          "`df -i` is the command that shows it."
      },

      miss: [
        {
          w: "The inode contains the filename.",
          r: "It does **not**. The name lives in the directory entry pointing " +
            "at the inode. This is why a file can have several names via hard " +
            "links, why renaming is cheap, and why an inode has no idea what it " +
            "is called."
        },
        {
          w: "Deleting a file frees the disk space.",
          r: "Deleting removes a **link**. Space is freed when the link count " +
            "reaches zero **and** no process holds it open. Deleting a large " +
            "log file that a running process still has open frees nothing — " +
            "which is the standard *disk full but nothing to delete* incident."
        },
        {
          w: "Running out of disk space always means you are out of blocks.",
          r: "You can exhaust **inodes** while blocks remain free. On ext4 the " +
            "inode count is fixed at format time, so a directory of millions of " +
            "tiny files hits the limit and you get *no space left on device* " +
            "with a half-empty disk. `df -i` reveals it."
        },
        {
          w: "Hard links and symbolic links are similar.",
          r: "A **hard link** is another directory entry for the same inode — " +
            "indistinguishable from the original, and it keeps the file alive. " +
            "A **symlink** is a separate file containing a *path*, which breaks " +
            "if the target moves. Hard links cannot cross filesystems or " +
            "normally point at directories; symlinks can do both."
        }
      ],

      trade: {
        buys: [
          "Separates a file's identity from its names.",
          "Hard links, atomic renames and cheap moves follow directly.",
          "Explains the standard disk-space and permission puzzles.",
          "Metadata lookup is a single indexed read."
        ],
        costs: [
          "Fixed inode count on ext4 — a real exhaustion mode.",
          "One extra indirection for every file access.",
          "Deleted-but-open files hold space invisibly.",
          "The mental model is non-obvious until explained."
        ],
        avoid: [
          "You are on a filesystem that does not work this way — NTFS uses an " +
            "MFT, and Btrfs and ZFS allocate inodes dynamically.",
          "The concern is object storage, where there is no filesystem " +
            "hierarchy at all.",
          "You need to reason about performance rather than semantics — the " +
            "indirection is rarely the bottleneck."
        ]
      }
    }

  ]);
})(window.TD = window.TD || {});
