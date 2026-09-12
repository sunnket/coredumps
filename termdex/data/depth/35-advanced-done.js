/* ==========================================================================
   Depth pass 35 — the last thirteen advanced terms. With this file the
   advanced tier (252 of 1,481) is complete.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "hdfs",

      why: {
        before: "Storing a dataset larger than one machine meant a SAN or NAS " +
          "— specialised, expensive hardware with its own redundancy, and a " +
          "network link between storage and compute that became the " +
          "bottleneck.",
        problem: "At petabyte scale that hardware is prohibitively expensive, " +
          "and the architecture is wrong: you move terabytes across the " +
          "network to reach the CPU. Google's 2003 GFS paper argued the " +
          "opposite — **move the computation to the data**.",
        shift: "Split files into large **blocks** (128MB by default), replicate " +
          "each three times across commodity machines, and schedule " +
          "computation **on the machine already holding the block**. Failure " +
          "is expected rather than prevented: with thousands of cheap disks, " +
          "something is always broken, and replication plus automatic " +
          "re-replication handles it."
      },

      num: {
        t: "The design choices, and why",
        h: ["Choice", "Value", "Reason"],
        r: [
          ["Block size", "**128 MB**", "amortise seek time; fewer metadata entries"],
          ["Replication", "**3×**", "survive two failures; rack-aware placement"],
          ["Write model", "**append-only**", "no random writes — simplifies consistency"],
          ["Metadata", "**one NameNode, in RAM**", "**the scalability limit**"],
          ["Optimised for", "**throughput**", "not latency"]
        ],
        n: "The **NameNode** row is HDFS's defining constraint: all filesystem " +
          "metadata lives in the memory of a single machine, so the cluster's " +
          "file count is bounded by that machine's RAM — roughly **150 bytes " +
          "per file or block**, which makes millions of small files a genuine " +
          "operational crisis. This is the *small files problem*, and it is why " +
          "HDFS deployments obsess over compaction. The other thing to " +
          "understand is that HDFS is **largely being displaced by object " +
          "storage** — S3, GCS, ADLS — which separates storage from compute " +
          "entirely, scales metadata without a single node, and costs less. " +
          "Data locality mattered enormously when networks were 1Gb; at 25Gb " +
          "and above the argument weakened considerably."
      },

      miss: [
        {
          w: "HDFS is a general-purpose distributed filesystem.",
          r: "It is optimised for **large files, sequential reads and " +
            "append-only writes**. It has no random writes, poor small-file " +
            "handling, and high latency per operation. It is a batch analytics " +
            "substrate, not a POSIX filesystem replacement."
        },
        {
          w: "The 128MB block size wastes space on small files.",
          r: "Blocks are **not** pre-allocated — a 1MB file uses 1MB of disk. " +
            "The cost of small files is **NameNode memory**, since each file " +
            "and block consumes metadata regardless of size. The problem is " +
            "metadata, not disk."
        },
        {
          w: "Three-way replication means 3× the storage cost forever.",
          r: "**Erasure coding** (HDFS 3.0+) reduces overhead to roughly 1.5× " +
            "with comparable durability, at the cost of more CPU on " +
            "reconstruction and worse performance for frequently-read data. " +
            "It is standard for cold data."
        },
        {
          w: "You should use HDFS for a new big-data platform.",
          r: "Most new deployments use **object storage** with a table format " +
            "like Iceberg or Delta on top. It separates storage and compute, " +
            "scales metadata without a single node, and is cheaper. HDFS " +
            "remains where on-premises data locality or existing investment " +
            "justifies it."
        }
      ],

      trade: {
        buys: [
          "Petabyte scale on commodity hardware.",
          "Fault tolerance through replication and automatic recovery.",
          "Data locality for compute scheduling.",
          "High aggregate throughput for sequential scans.",
          "Mature ecosystem — Spark, Hive, HBase."
        ],
        costs: [
          "NameNode memory caps file count.",
          "Small files are pathological.",
          "No random writes; append-only.",
          "High per-operation latency.",
          "Storage and compute are coupled, so they scale together."
        ],
        avoid: [
          "You are starting fresh — **object storage** plus a table format.",
          "The workload involves many small files.",
          "You need random writes or low-latency access.",
          "You want to scale storage and compute independently.",
          "The data fits comfortably on one machine."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "orc",

      why: {
        before: "Hive stored tables as text or as row-oriented sequence files. " +
          "An analytical query reading three columns of fifty still read every " +
          "byte of every row.",
        problem: "That is the wrong layout for analytics, and the original " +
          "columnar format for Hive (RCFile) had weak type information and " +
          "limited statistics, so the engine could not skip data it did not " +
          "need.",
        shift: "**Optimised Row Columnar** — columnar storage with rich " +
          "**built-in indexes**. Data is divided into stripes, and each stripe " +
          "carries min/max statistics per column, plus optional bloom filters. " +
          "A query with a predicate can skip entire stripes without reading " +
          "them, which is where most of the speed-up comes from."
      },

      num: {
        t: "ORC against Parquet",
        h: ["", "ORC", "Parquet"],
        r: [
          ["Origin", "**Hive / Hortonworks**", "**Impala / Cloudera**"],
          ["Indexes", "**stripe + row-group + bloom**", "row-group stats"],
          ["**ACID in Hive**", "**yes — required**", "no"],
          ["Compression", "often slightly better", "comparable"],
          ["**Ecosystem support**", "Hive-centric", "**broader — Spark, Arrow, pandas**"]
        ],
        n: "The honest summary is that **the two are more similar than " +
          "partisans suggest**, and ecosystem support usually decides. " +
          "**Parquet has won the broader ecosystem** — it is the default in " +
          "Spark, integrates with Arrow, and is what pandas, DuckDB and " +
          "virtually every cloud tool expect. ORC retains an edge inside Hive, " +
          "where **ACID transactions require it**, and its finer-grained " +
          "built-in indexes can give better predicate pushdown on selective " +
          "queries. Both are columnar, both compress well, both support " +
          "predicate pushdown. The practical advice: **use Parquet unless you " +
          "are in a Hive-centric stack**, and do not spend long on the " +
          "comparison."
      },

      miss: [
        {
          w: "ORC and Parquet differ substantially in performance.",
          r: "Benchmarks are close and workload-dependent — each wins on some " +
            "queries. **Ecosystem fit matters far more** than the marginal " +
            "performance difference, and choosing based on benchmark blog posts " +
            "is optimising the wrong variable."
        },
        {
          w: "Columnar formats are always faster.",
          r: "For **analytical** queries reading few columns, yes. For reading " +
            "**entire rows** — a lookup returning all fifty columns — columnar " +
            "requires reassembling from fifty separate column chunks and can " +
            "be **slower** than row storage."
        },
        {
          w: "You can update rows in an ORC file.",
          r: "Files are **immutable**. Hive ACID achieves updates by writing " +
            "**delta files** that are merged on read and periodically " +
            "compacted. The illusion of mutation is a layer above the format, " +
            "and unmerged deltas degrade read performance."
        },
        {
          w: "Bloom filters should be enabled on every column.",
          r: "They cost storage and are only useful for **equality predicates " +
            "on high-cardinality columns**. On a low-cardinality column min/max " +
            "statistics already prune effectively, and the bloom filter is " +
            "wasted space."
        }
      ],

      trade: {
        buys: [
          "Columnar layout — read only the columns you need.",
          "Rich built-in indexes for aggressive stripe skipping.",
          "Strong compression, especially on repetitive columns.",
          "Required for Hive ACID tables.",
          "Full type information including complex types."
        ],
        costs: [
          "Narrower ecosystem support than Parquet.",
          "Immutable — updates need delta files and compaction.",
          "Poor for whole-row retrieval.",
          "Writing is more expensive than row formats.",
          "Bloom filters cost storage if misconfigured."
        ],
        avoid: [
          "You are outside the Hive ecosystem — **Parquet** integrates more " +
            "widely.",
          "The workload is transactional or row-oriented.",
          "Data is small enough that format barely matters.",
          "You need frequent single-row updates."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "wide-column-store",

      why: {
        before: "Relational tables have a **fixed schema**: every row has the " +
          "same columns, and adding one means a migration across every row.",
        problem: "Some data is genuinely sparse and irregular. A product " +
          "catalogue where books have ISBNs and shoes have sizes would need a " +
          "column for every attribute of every category, mostly null. Time " +
          "series where each sensor reports different metrics has the same " +
          "shape. A fixed schema forces either sparsity or a mess of joins.",
        shift: "Let **each row have its own columns**. A row is a key plus an " +
          "arbitrary map of column names to values, so rows in the same table " +
          "need not share structure. Columns are grouped into **column " +
          "families** stored together, and the model scales horizontally by " +
          "partitioning on the row key."
      },

      num: {
        t: "The data model, and what it costs",
        h: ["Property", "Wide-column", "Relational"],
        r: [
          ["Schema", "**per row**", "per table"],
          ["Sparse data", "**costs nothing**", "many nulls"],
          ["Joins", "**none**", "core capability"],
          ["Query flexibility", "**by key only**", "**ad-hoc**"],
          ["Scaling", "**horizontal by key**", "vertical, or manual sharding"],
          ["Examples", "Cassandra, HBase, Bigtable", "Postgres, MySQL"]
        ],
        n: "The **query flexibility** row is where teams get hurt. Wide-column " +
          "stores require you to **model tables around your queries**: there " +
          "are no joins, no ad-hoc `WHERE` on arbitrary columns, and a query " +
          "not including the partition key means scanning every node. The " +
          "consequence is that you **denormalise heavily and write the same " +
          "data into several tables**, one per access pattern — which is " +
          "correct practice here and looks alarming to anyone from a " +
          "relational background. It also means a **new access pattern " +
          "discovered later may require a new table and a backfill**, so the " +
          "cost of not knowing your queries up front is high."
      },

      miss: [
        {
          w: "Wide-column stores are the same as column-oriented databases.",
          r: "**Completely different.** Columnar analytical stores (ClickHouse, " +
            "Parquet) store *columns contiguously on disk* for scan " +
            "performance. Wide-column stores are **row-oriented** with flexible " +
            "per-row columns — the naming is genuinely confusing and the " +
            "confusion is common."
        },
        {
          w: "Schema flexibility means you do not need to design a schema.",
          r: "You need to design it **more carefully**, around access patterns " +
            "rather than around normalisation. The row key determines " +
            "partitioning, ordering and what queries are possible — and it is " +
            "effectively permanent."
        },
        {
          w: "You can add secondary indexes to query other columns.",
          r: "Cassandra's secondary indexes are **local to each node**, so a " +
            "query using one contacts every node in the cluster. They are " +
            "acceptable for low-cardinality columns within a partition and a " +
            "performance trap otherwise. The intended answer is another table."
        },
        {
          w: "It scales infinitely because it is distributed.",
          r: "It scales when **the row key distributes load evenly**. A hot " +
            "partition — one customer, one popular item, or a monotonic " +
            "timestamp key — creates a hotspot no amount of nodes fixes. Key " +
            "design is the whole scalability story."
        }
      ],

      trade: {
        buys: [
          "Sparse and irregular data with no null cost.",
          "Horizontal write scaling by partition key.",
          "Very high write throughput.",
          "Predictable latency for key-based access.",
          "Excellent for time series and event data."
        ],
        costs: [
          "No joins or ad-hoc queries.",
          "Data duplicated across query-specific tables.",
          "Row key design is effectively permanent.",
          "New access patterns may require backfills.",
          "Operationally demanding."
        ],
        avoid: [
          "You need joins, transactions or ad-hoc analytics.",
          "Access patterns are unknown or change often.",
          "The data fits comfortably in one relational database.",
          "The workload is read-heavy with complex queries.",
          "The team cannot operate a distributed database."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "web-component",

      why: {
        before: "Reusable UI meant a **framework component** — a React " +
          "component, an Angular directive, a Vue SFC — usable only inside " +
          "that framework, and rewritten when the framework changed.",
        problem: "A design system shipped as React components excludes every " +
          "team not using React, and a framework migration invalidates the " +
          "whole library. For a large organisation with several frameworks in " +
          "play, that is a recurring and expensive problem.",
        shift: "Standardise components in the **browser**. Three specifications " +
          "combine: **Custom Elements** (define `<my-widget>` with lifecycle " +
          "callbacks), **Shadow DOM** (encapsulate its styles and structure), " +
          "and **HTML templates**. The result is a component the platform " +
          "understands, usable from any framework or from plain HTML."
      },

      num: {
        t: "The honest state of play",
        h: ["Aspect", "Status"],
        r: [
          ["Browser support", "**universal in modern browsers**"],
          ["**Framework interop**", "**React was the weak point until v19**"],
          ["Form participation", "needs `ElementInternals`"],
          ["**SSR**", "**declarative Shadow DOM, still maturing**"],
          ["Ergonomics", "**verbose without a library (Lit)**"],
          ["Best fit", "**design systems, embeddable widgets**"]
        ],
        n: "**React's historical interop problem** is the reason web components " +
          "under-delivered for years: React passed everything as string " +
          "attributes rather than DOM properties, and did not listen for custom " +
          "events — so a component with an object property or a custom event " +
          "needed a wrapper. **React 19 fixed this**, which materially changes " +
          "the calculus. The remaining honest caveat is **ergonomics**: raw " +
          "Custom Elements are verbose, and almost everyone uses **Lit** for " +
          "reactive properties and declarative templates. Where web components " +
          "clearly win is **cross-framework design systems** — Adobe Spectrum, " +
          "Shoelace, and Salesforce Lightning are all built this way — and " +
          "**embeddable widgets** dropped into a page you do not control."
      },

      miss: [
        {
          w: "Web components will replace React and Vue.",
          r: "They solve **component encapsulation and distribution**, not " +
            "state management, routing, or rendering optimisation. Frameworks " +
            "provide much more. The realistic position is web components for " +
            "the shared design system, frameworks for the application."
        },
        {
          w: "You must use Shadow DOM to build a web component.",
          r: "**Custom Elements and Shadow DOM are separate specifications.** " +
            "You can define a custom element rendering into light DOM, which " +
            "many do specifically so global styles and existing tooling " +
            "continue to work."
        },
        {
          w: "They do not work with React.",
          r: "This was largely true and was **fixed in React 19**, which " +
            "handles properties and custom events correctly. Older React " +
            "versions need a wrapper, which is why the reputation persists " +
            "beyond the problem."
        },
        {
          w: "Writing them in vanilla JavaScript is the point.",
          r: "It is possible and unpleasant — manual attribute observation, " +
            "manual re-rendering, no reactivity. **Lit** adds about 5KB and " +
            "makes them genuinely pleasant. Using a library does not " +
            "compromise the standards-based output."
        }
      ],

      trade: {
        buys: [
          "Framework-independent — usable anywhere, including plain HTML.",
          "Real browser-enforced encapsulation via Shadow DOM.",
          "No build step required.",
          "Long-lived — a standard rather than a library.",
          "Ideal for design systems and embeddable widgets."
        ],
        costs: [
          "Verbose without a helper library.",
          "Global CSS and frameworks do not penetrate Shadow DOM.",
          "SSR support is still maturing.",
          "Form participation needs extra work.",
          "No state management or routing — that is your problem."
        ],
        avoid: [
          "You are building a single-framework application — use its " +
            "components.",
          "You depend on a global CSS framework like Tailwind inside " +
            "components.",
          "SSR and SEO are critical and the tooling is not ready.",
          "The team would write them without a library like Lit."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "mask-r-cnn",

      why: {
        before: "**Faster R-CNN** produced bounding boxes efficiently: a region " +
          "proposal network suggests candidate regions, then a head classifies " +
          "and refines each box.",
        problem: "Boxes are a poor description of shape. And the obvious " +
          "extension — add a segmentation head — hit a subtle problem: " +
          "**RoIPool**, which extracts features for each proposed region, " +
          "**quantised coordinates to integers**. That misalignment of a few " +
          "pixels is invisible for classification and ruinous for a pixel-level " +
          "mask.",
        shift: "Add a **mask branch** predicting a binary mask per instance, " +
          "and replace RoIPool with **RoIAlign** — bilinear interpolation with " +
          "no quantisation. That one change gave a large accuracy improvement, " +
          "and it is the paper's principal technical contribution."
      },

      num: {
        t: "The architecture",
        h: ["Component", "Job", "Note"],
        r: [
          ["Backbone (ResNet + FPN)", "extract features", "multi-scale"],
          ["Region Proposal Network", "suggest candidate boxes", "from Faster R-CNN"],
          ["**RoIAlign**", "**extract per-region features**", "**no quantisation — the key fix**"],
          ["Box head", "classify + refine", "from Faster R-CNN"],
          ["**Mask head**", "**28×28 binary mask per class**", "**decoupled from classification**"]
        ],
        n: "**Decoupling mask from class prediction** is the other design " +
          "decision worth understanding: the mask branch predicts a separate " +
          "binary mask for **every** class, and the classification branch " +
          "chooses which one to use. Predicting a single multi-class mask would " +
          "force classes to compete pixel-by-pixel, which measurably hurts. The " +
          "**28×28** resolution is the honest limitation — masks are upsampled " +
          "to the box, so thin structures, hair and precise boundaries are " +
          "lost. Mask R-CNN is now a **strong baseline rather than state of " +
          "the art** — transformer-based approaches (Mask2Former) and " +
          "promptable models (SAM) exceed it — but it remains widely deployed " +
          "because it is well understood, well implemented and fast enough."
      },

      miss: [
        {
          w: "Mask R-CNN segments the whole image.",
          r: "It predicts a mask **inside each detected box**. Pixels in no " +
            "detected instance get no label at all — that is instance " +
            "segmentation. Labelling every pixel including background is " +
            "**panoptic** segmentation, a different task."
        },
        {
          w: "RoIAlign is a minor implementation detail.",
          r: "It is the **main contribution**. RoIPool's coordinate " +
            "quantisation misaligns features by a few pixels — irrelevant for " +
            "classifying a box, ruinous for a mask. Replacing it with bilinear " +
            "interpolation produced a large accuracy gain."
        },
        {
          w: "The masks are high resolution.",
          r: "**28×28 per instance**, upsampled to the box. Fine detail is " +
            "lost by construction. Higher-fidelity boundaries need refinement " +
            "approaches like PointRend."
        },
        {
          w: "It is still the best instance segmentation method.",
          r: "It is a **strong, well-supported baseline**. Mask2Former and " +
            "other transformer-based methods outperform it, and **SAM** " +
            "changed the workflow entirely by producing class-agnostic masks " +
            "zero-shot. Mask R-CNN persists on maturity and speed, not peak " +
            "accuracy."
        }
      ],

      trade: {
        buys: [
          "Detection and instance segmentation in one model.",
          "RoIAlign fixed a real misalignment problem.",
          "Extends naturally to keypoints and pose.",
          "Mature, well-implemented, well-documented.",
          "Reasonable speed for a two-stage detector."
        ],
        costs: [
          "Two-stage — slower than single-stage detectors.",
          "28×28 masks lose fine detail.",
          "Mask annotation is expensive to obtain.",
          "Outperformed by newer transformer-based methods.",
          "Many hyperparameters inherited from Faster R-CNN."
        ],
        avoid: [
          "Boxes suffice — use a detector and skip the mask cost.",
          "Real-time on constrained hardware — use a single-stage model.",
          "You need every pixel labelled — that is panoptic segmentation.",
          "**SAM**-assisted labelling or a modern architecture would serve " +
            "better."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "panoptic-segmentation",

      why: {
        before: "Vision had two separate segmentation tasks with separate " +
          "benchmarks and separate models. **Semantic** segmentation labels " +
          "every pixel with a class but cannot separate instances. " +
          "**Instance** segmentation separates objects but ignores background " +
          "entirely.",
        problem: "Neither gives a complete scene description. For autonomous " +
          "driving you need both: *this pixel is road* (background, no " +
          "instances) **and** *these pixels are pedestrian #3* (a countable " +
          "object). Running two models and merging their outputs produces " +
          "conflicts — overlapping masks and unlabelled gaps — with no " +
          "principled resolution.",
        shift: "Unify them. Every pixel gets **exactly one** class label, and " +
          "pixels of countable classes also get an instance id. The key " +
          "distinction is **things against stuff**: *things* are countable " +
          "(car, person) and get instance ids; *stuff* is amorphous (road, " +
          "sky, vegetation) and does not."
      },

      num: {
        t: "The three tasks",
        h: ["Task", "Every pixel labelled?", "Instances separated?"],
        r: [
          ["Semantic", "**yes**", "**no**"],
          ["Instance", "no — only detected objects", "**yes**"],
          ["**Panoptic**", "**yes**", "**yes, for things**"],
          ["Metric", "mIoU", "mask AP"],
          ["**Panoptic metric**", "**PQ = SQ × RQ**", "**segmentation × recognition**"]
        ],
        n: "**Panoptic Quality** decomposes usefully into **Segmentation " +
          "Quality** (how accurate are the masks that were matched) and " +
          "**Recognition Quality** (an F1 over whether segments were detected " +
          "at all) — so a low PQ tells you *which* half is failing. The " +
          "defining constraint is **non-overlap**: every pixel has exactly one " +
          "label, which is what makes merging two independent models " +
          "unsatisfactory and motivated unified architectures. **Mask2Former** " +
          "is the notable modern result: a single architecture handling " +
          "semantic, instance and panoptic segmentation by treating all three " +
          "as **mask classification**, which retrospectively makes the " +
          "historical separation look like an artefact of how the field " +
          "developed rather than a real distinction."
      },

      miss: [
        {
          w: "Panoptic segmentation is semantic plus instance segmentation " +
            "merged.",
          r: "Naive merging produces **overlapping masks and unlabelled " +
            "pixels**, with no principled way to resolve conflicts. The task " +
            "definition requires exactly one label per pixel, which is why " +
            "unified architectures outperform post-hoc merging."
        },
        {
          w: "The things/stuff distinction is arbitrary.",
          r: "It reflects whether instances are **countable and " +
            "meaningful**. *Three cars* is meaningful; *three roads* in one " +
            "connected road region is not. The distinction is dataset-defined " +
            "and does encode a genuine semantic property."
        },
        {
          w: "You need panoptic segmentation for autonomous driving.",
          r: "It is a natural fit and frequently more than required. Many " +
            "systems use **detection plus lane segmentation** and never label " +
            "every pixel. Panoptic annotation is extremely expensive; only " +
            "adopt it if the complete labelling is genuinely used."
        },
        {
          w: "PQ is just an average of semantic and instance metrics.",
          r: "It is **SQ × RQ** — average IoU over *matched* segments " +
            "multiplied by an F1 over matching. That product means a model can " +
            "score badly for two quite different reasons, and the decomposition " +
            "is what tells you which."
        }
      ],

      trade: {
        buys: [
          "Complete scene description in one output.",
          "No overlaps and no unlabelled pixels by construction.",
          "PQ decomposes into interpretable components.",
          "One model where two were needed."
        ],
        costs: [
          "Annotation is the most expensive of the three tasks.",
          "Higher computational cost.",
          "Harder to evaluate and debug.",
          "Often more than the application requires."
        ],
        avoid: [
          "You only need object locations — detection is far cheaper.",
          "Background classes are irrelevant to the task.",
          "Annotation budget is limited.",
          "Instances do not need separating — semantic segmentation suffices."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "visual-question-answering",

      why: {
        before: "Vision models produced fixed outputs — a class label, boxes, " +
          "a segmentation map. What you could ask was decided when the model " +
          "was trained.",
        problem: "Real questions about images are open-ended and compositional: " +
          "*is the person on the left holding an umbrella?*, *what colour is " +
          "the third car?*, *why is this person laughing?* No fixed label set " +
          "covers them, and each would need its own model.",
        shift: "Make the **question** an input. A model that takes an image " +
          "**and** a natural-language question and produces an answer can " +
          "handle anything expressible in words. Modern approaches connect a " +
          "vision encoder to a language model, so the LLM reasons over visual " +
          "features."
      },

      num: {
        t: "The evaluation problem",
        h: ["Issue", "Detail"],
        r: [
          ["**Language priors**", "**answering without looking often scores well**"],
          ["Blind baseline on VQA v1", "~**50%**"],
          ["VQA v2 fix", "paired images with **different answers**"],
          ["**Open-ended scoring**", "**exact match punishes valid paraphrase**"],
          ["Hallucination", "confidently describes absent objects"]
        ],
        n: "The **language prior** problem is the defining lesson of this " +
          "benchmark's history: models learned that *what colour is the " +
          "banana* is answered *yellow* and *how many* is answered *two*, " +
          "scoring around 50% **without meaningfully using the image**. VQA v2 " +
          "was constructed specifically to break this, pairing each question " +
          "with two images having different answers so the prior is useless. " +
          "It is a general lesson about benchmark design: **if a shortcut " +
          "exists, models find it**, and a high score can mean the dataset was " +
          "gameable rather than the task was solved. The other live problem is " +
          "**object hallucination** — VLMs confidently describe objects that " +
          "are not present, which is why POPE and similar hallucination " +
          "benchmarks exist alongside accuracy metrics."
      },

      miss: [
        {
          w: "High VQA accuracy means the model understands images.",
          r: "It can mean the model exploits **language priors and dataset " +
            "biases**. This was measured, not speculated — blind models reached " +
            "~50% on VQA v1. Balanced datasets help; benchmark scores remain a " +
            "weak proxy for understanding."
        },
        {
          w: "VQA is solved because modern VLMs score highly.",
          r: "They perform well on **benchmark distributions** and still fail " +
            "on counting, spatial relations, text in images, and compositional " +
            "questions. **Hallucination** — confidently describing absent " +
            "objects — remains unsolved and is actively benchmarked."
        },
        {
          w: "Exact-match accuracy is a reasonable metric.",
          r: "It punishes valid paraphrase — *a dog* against *dog* against " +
            "*brown dog*. VQA uses agreement among ten human annotators to " +
            "soften this, and open-ended answers from modern VLMs still score " +
            "poorly under exact match while being correct."
        },
        {
          w: "You can trust a VLM's answer about an image.",
          r: "Object hallucination is common and **confidently stated**. For " +
            "anything consequential — medical, safety, legal — the answer needs " +
            "verification. Confidence is not correlated with correctness in the " +
            "way users assume."
        }
      ],

      trade: {
        buys: [
          "Open-ended questions with no fixed label set.",
          "One model replaces many task-specific ones.",
          "Natural interface — ask in plain language.",
          "Zero-shot on tasks nobody trained for.",
          "Enables accessibility applications."
        ],
        costs: [
          "Benchmark scores overstate real understanding.",
          "Object hallucination is common and confident.",
          "Weak at counting, spatial relations and text in images.",
          "Expensive relative to a specialised model.",
          "Evaluation of open-ended answers is genuinely hard."
        ],
        avoid: [
          "The task is fixed and well-defined — a specialised model is more " +
            "accurate and far cheaper.",
          "Answers must be reliable without verification.",
          "The question needs precise counting or spatial reasoning.",
          "The domain is specialised — medical or industrial imaging."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "robot-operating-system",

      why: {
        before: "Every robotics lab wrote its own software from scratch — " +
          "drivers, coordinate transforms, message passing, visualisation. " +
          "Code from one project could not be reused in another, and every " +
          "team reimplemented the same infrastructure.",
        problem: "That duplication consumed the effort that should have gone " +
          "into the actual research. A robot needs dozens of components — " +
          "sensors, planners, controllers, localisation — written in different " +
          "languages by different people, and they must communicate reliably.",
        shift: "Provide the **plumbing and the conventions**. ROS is a " +
          "message-passing framework with standard message types, a build " +
          "system, and a large library of reusable packages. Its most " +
          "important contribution is arguably **standard conventions** — " +
          "particularly `tf`, the coordinate-transform library that tracks " +
          "relationships between every frame on a robot over time."
      },

      num: {
        t: "ROS 1 against ROS 2",
        h: ["", "ROS 1", "ROS 2"],
        r: [
          ["Communication", "**custom TCPROS + roscore**", "**DDS**"],
          ["Single point of failure", "**yes — roscore**", "**no**"],
          ["Real-time capable", "no", "**yes, with effort**"],
          ["Security", "**none**", "SROS2"],
          ["Multi-robot", "awkward", "designed for it"],
          ["Status", "**EOL May 2025**", "current"]
        ],
        n: "**ROS 1 reached end of life in May 2025**, which makes the " +
          "migration question urgent for anyone still on it. The architectural " +
          "change is the move to **DDS** — an industrial middleware standard — " +
          "removing the central `roscore` broker that was both a single point " +
          "of failure and a barrier to real-time operation. The critical " +
          "caveat that catches newcomers: **ROS is not real-time by " +
          "default**, and *Operating System* in the name is misleading — it " +
          "runs on Linux and is a middleware framework. Hard real-time control " +
          "loops need a real-time kernel and careful configuration, or are " +
          "kept outside ROS entirely on a microcontroller."
      },

      miss: [
        {
          w: "ROS is an operating system.",
          r: "It is **middleware** running on Linux. The name is historical and " +
            "consistently misleading. It provides message passing, build " +
            "tooling, conventions and libraries — not scheduling, memory " +
            "management or drivers in the OS sense."
        },
        {
          w: "ROS is real-time, so it suits control loops.",
          r: "**Not by default.** ROS 2 with DDS *can* meet real-time " +
            "requirements with a real-time kernel and careful configuration. " +
            "Hard real-time control is usually kept on a separate " +
            "microcontroller, with ROS handling higher-level coordination."
        },
        {
          w: "You should start with ROS 1 because there are more tutorials.",
          r: "**ROS 1 is end-of-life as of May 2025.** New projects should use " +
            "ROS 2 — the ecosystem has migrated, and starting on a dead version " +
            "means an inevitable migration plus diverging community support."
        },
        {
          w: "ROS handles the hard parts of robotics.",
          r: "It handles the **plumbing** — messaging, transforms, tooling. " +
            "Perception, planning, control and manipulation remain genuinely " +
            "hard research problems. ROS removes the infrastructure burden, not " +
            "the robotics."
        }
      ],

      trade: {
        buys: [
          "Enormous ecosystem of reusable packages and drivers.",
          "Standard message types and conventions across projects.",
          "`tf` solves coordinate transforms properly.",
          "Excellent tooling — RViz, rosbag, introspection.",
          "Language-agnostic — C++ and Python interoperate."
        ],
        costs: [
          "Not real-time without significant work.",
          "Substantial learning curve.",
          "Heavy — considerable overhead for simple robots.",
          "ROS 2's DDS configuration is complex.",
          "Migration from ROS 1 is non-trivial."
        ],
        avoid: [
          "The robot is simple — a microcontroller loop is far simpler.",
          "You need hard real-time control as the primary requirement.",
          "Resources are severely constrained — ROS needs a real computer.",
          "The application is not robotics; the abstractions will not fit."
        ]
      }
    }

  ]);
})(window.TD = window.TD || {});
