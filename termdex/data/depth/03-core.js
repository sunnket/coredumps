/* ==========================================================================
   Depth pass 3 — machine learning, and the parts of it people repeat without
   having checked.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "overfitting",

      why: {
        before: "A model was judged on how well it fitted the data it was " +
          "shown. Lower training error meant a better model.",
        problem: "That metric is trivially gameable — a model that memorises " +
          "every training example scores perfectly and knows nothing. A lookup " +
          "table has zero training error. The number you were optimising was " +
          "not the number you cared about.",
        shift: "Split the data. Judge the model only on examples it has never " +
          "seen. Everything in modern practice — validation sets, " +
          "cross-validation, early stopping, held-out test sets — exists " +
          "because training error is not evidence."
      },

      num: {
        t: "What the two curves look like",
        h: ["Stage", "Training error", "Validation error"],
        r: [
          ["Underfitting", "high", "high"],
          ["Good fit", "low", "low"],
          ["Overfitting", "very low → 0", "rising"]
        ],
        n: "The signature is the **gap**, and specifically validation error " +
          "turning upward while training error keeps falling. That turning " +
          "point is where **early stopping** halts training. A useful rule of " +
          "thumb: if training accuracy is 99% and validation is 75%, you are " +
          "not looking at a model that needs more epochs — you are looking at " +
          "one that needs more data, fewer parameters, or stronger " +
          "regularisation."
      },

      miss: [
        {
          w: "Overfitting means the model is too complex.",
          r: "It means the model is too complex **relative to the data " +
            "available**. The same network that overfits a thousand examples " +
            "may underfit a million. Complexity is only ever meaningful as a " +
            "ratio to the size and diversity of your dataset."
        },
        {
          w: "A bigger model always overfits more.",
          r: "This was the received wisdom and modern deep learning broke it. " +
            "**Double descent** is real: as models grow past the point of " +
            "interpolating the training set, test error often starts falling " +
            "again. Very large networks generalise better than the classical " +
            "bias-variance picture predicts, and why is still actively argued."
        },
        {
          w: "My test accuracy is high, so I have not overfitted.",
          r: "Not if you have been *choosing* against that test set. Every " +
            "time you tune a hyperparameter based on test performance, you leak " +
            "information from it — after fifty experiments your test set has " +
            "quietly become a training set. This is why the discipline is " +
            "train / validation / **test**, and the test set is touched once."
        },
        {
          w: "Regularisation prevents overfitting.",
          r: "It *reduces* it, by making some solutions costlier than others — " +
            "L2 penalises large weights, dropout forces redundancy. None of it " +
            "creates information that is not in your data. If the dataset is " +
            "too small or unrepresentative, regularisation buys you a less " +
            "confidently wrong model, not a right one."
        }
      ],

      trade: {
        buys: [
          "Noticing it is what makes a model trustworthy rather than merely " +
            "impressive.",
          "The train/validation split is cheap and catches most of it.",
          "The gap is a clear signal for what to change next."
        ],
        costs: [
          "Held-out data is data you did not train on — painful when examples " +
            "are scarce or expensive.",
          "Regularisation adds hyperparameters, each needing tuning.",
          "Early stopping risks halting before the model has finished learning " +
            "something real."
        ],
        avoid: [
          "You genuinely want memorisation — a lookup or retrieval system is " +
            "*supposed* to reproduce its inputs.",
          "The training set already covers the entire input space and always " +
            "will.",
          "You are still underfitting. Fighting overfitting when training " +
            "error is high makes the model worse in both directions."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "gradient-descent",

      why: {
        before: "Some models have a closed-form solution — linear regression " +
          "has the normal equation, and you can simply solve for the best " +
          "parameters directly.",
        problem: "That requires inverting a matrix, roughly `O(n³)` in the " +
          "number of features, and it only exists for a small family of " +
          "models. A neural network has no closed form at all, and models now " +
          "have billions of parameters.",
        shift: "Stop trying to jump to the answer and walk toward it instead. " +
          "The gradient points uphill, so step the other way, repeatedly. It " +
          "needs only the ability to compute a derivative — which " +
          "backpropagation gives you cheaply — so it scales to models no " +
          "closed form could touch."
      },

      num: {
        t: "The three variants, per parameter update",
        h: ["Variant", "Examples per step", "Character"],
        r: [
          ["Batch", "all of them", "smooth, slow, exact"],
          ["Stochastic (SGD)", "1", "very noisy, fast steps"],
          ["Mini-batch", "32–512", "the practical default"]
        ],
        n: "Mini-batch wins for a reason that is about hardware, not " +
          "mathematics: a GPU computes 256 examples in roughly the time it " +
          "takes for one, so the noisier-but-cheaper estimate is nearly free. " +
          "The **learning rate** matters more than almost any other " +
          "hyperparameter — too high and the loss diverges to `NaN` within a " +
          "few steps, too low and training takes a hundred times longer than " +
          "it needs to. A common starting point is `3e-4` for Adam, and it is " +
          "worth tuning before anything else."
      },

      miss: [
        {
          w: "Gradient descent finds the global minimum.",
          r: "Only for **convex** loss surfaces. A neural network's loss is " +
            "wildly non-convex with astronomically many local minima. In " +
            "practice this matters far less than expected: in high dimensions " +
            "most critical points are **saddle points** rather than bad minima, " +
            "and the many local minima that exist tend to have similar loss."
        },
        {
          w: "A bigger learning rate trains faster.",
          r: "Up to a point, then the loss explodes — you overshoot the minimum " +
            "and each step lands further away. The relationship is not " +
            "monotonic. This is why **schedules** exist: warm up to let early " +
            "unstable steps settle, then decay so late steps can fine-tune."
        },
        {
          w: "The gradient tells you which direction the minimum is in.",
          r: "It tells you the steepest direction **right where you are " +
            "standing**, which is a purely local fact. In a narrow ravine the " +
            "steepest direction points across the valley rather than along it, " +
            "so plain gradient descent zig-zags. **Momentum** exists precisely " +
            "to average out that oscillation."
        },
        {
          w: "Loss went down, so the model is learning.",
          r: "Training loss going down can simply mean memorisation. It can " +
            "also fall while the model gets worse at what you actually want, " +
            "because the loss is a proxy for the goal and not the goal. Always " +
            "watch validation loss and a metric you actually care about."
        }
      ],

      trade: {
        buys: [
          "Works on any differentiable model, including ones with billions of " +
            "parameters.",
          "Memory cost is per mini-batch, not per dataset — you can train on " +
            "data far larger than RAM.",
          "The noise in SGD is mildly helpful: it can knock the model out of " +
            "sharp minima that generalise poorly."
        ],
        costs: [
          "Hyperparameters — learning rate, schedule, batch size — that need " +
            "tuning and interact.",
          "No guarantee of the global optimum, and no way to know how close " +
            "you are.",
          "Many passes over the data, which is the bulk of training cost.",
          "Can diverge outright if the learning rate is wrong."
        ],
        avoid: [
          "A closed-form solution exists and the problem is small — solve it " +
            "directly and be exact.",
          "The function is not differentiable; use evolutionary methods or " +
            "Bayesian optimisation.",
          "The search space is small enough to enumerate or grid-search.",
          "You need a guaranteed global optimum and the problem admits a " +
            "solver that provides one."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "transformer",

      why: {
        before: "RNNs and LSTMs processed a sequence one token at a time, " +
          "carrying a hidden state forward. Position 500 could not be computed " +
          "until positions 1 through 499 were done.",
        problem: "Two failures, and both were fatal at scale. Training could " +
          "not be parallelised, so it ran at the speed of the sequence rather " +
          "than the hardware. And information had to survive hundreds of " +
          "sequential steps to reach the end, so long-range dependencies faded " +
          "— the vanishing gradient problem that LSTMs reduced but never solved.",
        shift: "Remove recurrence entirely. Let every position attend to every " +
          "other position **simultaneously**. Path length between any two " +
          "tokens becomes constant rather than linear, and the whole sequence " +
          "computes in parallel — so training now scales with the number of " +
          "GPUs you can buy. That is the change that made large language models " +
          "possible."
      },

      num: {
        t: "Cost of attention as context grows",
        h: ["Context length", "Attention pairs", "Relative cost"],
        r: [
          ["1,000", "1,000,000", "1×"],
          ["4,000", "16,000,000", "16×"],
          ["32,000", "1,024,000,000", "1,024×"],
          ["128,000", "16,384,000,000", "16,384×"]
        ],
        n: "This is the `O(n²)` wall, and it is why context length was the " +
          "hard-won frontier rather than a free parameter. Doubling context " +
          "quadruples attention cost *and* memory. **FlashAttention** does not " +
          "change the complexity — it makes it memory-efficient by never " +
          "materialising the full matrix, which is why it unlocked long " +
          "contexts in practice. Note also that most **parameters** live in the " +
          "feed-forward layers, not attention: roughly two thirds of a " +
          "transformer block's weights are in the MLP."
      },

      miss: [
        {
          w: "Attention means the model is focusing on the important words.",
          r: "Attention weights are learned similarity scores, and interpreting " +
            "them as explanation is contested — *Attention is not Explanation* " +
            "(2019) showed you can often change the weights substantially " +
            "without changing the prediction. Pretty heatmaps are suggestive, " +
            "not evidence."
        },
        {
          w: "Transformers understand word order naturally.",
          r: "Self-attention is **permutation-invariant** — shuffle the input " +
            "and the output is shuffled identically, because attention is a " +
            "weighted sum with no notion of position. Order comes entirely from " +
            "the positional encoding added to the embeddings. Remove it and the " +
            "model sees a bag of words."
        },
        {
          w: "More layers means more understanding.",
          r: "Depth helps until it does not, and the returns are strongly " +
            "diminishing. Scaling laws suggest parameters, data and compute " +
            "must grow **together** — Chinchilla showed most large models of " +
            "its era were badly undertrained for their size, and that a smaller " +
            "model on more tokens beat a larger one on fewer."
        },
        {
          w: "The transformer was designed for language.",
          r: "It was introduced for machine translation, but nothing in the " +
            "architecture is linguistic. It operates on sequences of vectors, " +
            "so it works on image patches (ViT), audio (Whisper), protein " +
            "sequences (AlphaFold) and video. That generality is arguably the " +
            "more important result."
        }
      ],

      trade: {
        buys: [
          "Full parallelism during training — the reason it scales with " +
            "hardware.",
          "Constant path length between any two positions, so long-range " +
            "dependencies survive.",
          "One architecture across text, vision, audio and biology.",
          "Transfers extremely well: pretrain once, fine-tune cheaply."
        ],
        costs: [
          "`O(n²)` time and memory in sequence length, which bounds context.",
          "Very data-hungry — weaker inductive bias than a CNN, so it needs " +
            "more examples to learn what a CNN assumes.",
          "Generation is still sequential, one token at a time, so inference " +
            "does not parallelise the way training does.",
          "Large memory footprint at inference from the KV cache."
        ],
        avoid: [
          "The dataset is small and the domain has strong structure — a **CNN** " +
            "for images or a gradient-boosted tree for tabular data will beat " +
            "it and train in minutes.",
          "Sequences are extremely long and the task is local; the quadratic " +
            "cost is not worth paying.",
          "You need strict latency on modest hardware, where a smaller " +
            "recurrent or convolutional model fits the budget.",
          "The problem is tabular. Gradient boosting still wins there far more " +
            "often than not."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "recursion",

      why: {
        before: "Repetition meant a loop and an explicit stack of your own if " +
          "the structure was nested — walking a tree with a `while` loop means " +
          "manually pushing and popping the nodes you still owe a visit.",
        problem: "That bookkeeping is where the bugs live, and it obscures the " +
          "shape of the problem. A tree is *defined* recursively — a node with " +
          "subtrees — so code that walks it with a manual stack does not look " +
          "like the thing it is walking.",
        shift: "Let the call stack be the stack. If the problem is defined in " +
          "terms of smaller versions of itself, write it that way and the " +
          "language keeps track. The definition and the implementation become " +
          "the same shape."
      },

      num: {
        t: "Recursion depth before the stack overflows",
        h: ["Runtime", "Default limit", "Note"],
        r: [
          ["Python", "1,000", "`sys.setrecursionlimit` raises it"],
          ["Node.js", "~11,000", "varies by frame size"],
          ["JVM", "~10,000–20,000", "`-Xss` sets thread stack size"],
          ["Go", "millions", "stack grows on the heap"]
        ],
        n: "A balanced binary tree of a million nodes is only **20** deep, so " +
          "recursion is completely safe. A *degenerate* tree — a linked list in " +
          "disguise — is a million deep and will blow the stack in most " +
          "languages. The depth that matters is the recursion depth, not the " +
          "data size, and the difference between them is the whole risk. " +
          "Naive recursive Fibonacci is a separate disaster: `fib(50)` makes " +
          "about **2.5 billion** calls because it recomputes the same " +
          "subproblems exponentially. Memoisation takes it to 50."
      },

      miss: [
        {
          w: "Recursion is always slower than iteration.",
          r: "It usually carries some call overhead, but the gap is small and " +
            "sometimes zero. Where languages implement **tail-call " +
            "optimisation** — Scheme, Haskell, Scala, Lua — a tail-recursive " +
            "function compiles to a loop with no stack growth at all. Notably " +
            "Python and Java do *not*, by deliberate design choices."
        },
        {
          w: "Every recursive function can be trivially rewritten as a loop.",
          r: "Every one *can* be rewritten, but not trivially. Single recursion " +
            "converts easily; **tree recursion** — where a function calls " +
            "itself more than once — requires you to build an explicit stack " +
            "and reimplement exactly what the runtime was doing for you. The " +
            "iterative version is usually longer and harder to verify."
        },
        {
          w: "Recursion is elegant, so it is the better choice.",
          r: "Elegance is not the criterion; matching the problem's shape is. " +
            "Recursion is right for trees, graphs, parsers and divide-and-" +
            "conquer. Using it to sum a flat array is worse code than a loop — " +
            "same result, more risk, less clarity."
        },
        {
          w: "The base case is the easy part.",
          r: "It is where most bugs are. A missing or wrong base case gives " +
            "infinite recursion; an off-by-one gives a subtly wrong answer at " +
            "the boundary. Write the base case first and test it in isolation " +
            "before the recursive step exists."
        }
      ],

      trade: {
        buys: [
          "Code that mirrors the structure of recursively-defined data.",
          "Dramatically shorter and clearer for trees, graphs and parsers.",
          "The runtime manages the stack, removing a whole class of manual " +
            "bookkeeping bugs."
        ],
        costs: [
          "Stack depth is finite, and exceeding it crashes rather than degrades.",
          "Per-call overhead where there is no tail-call optimisation.",
          "Harder to step through in a debugger — many frames of the same " +
            "function.",
          "Naive recursion on overlapping subproblems is exponential."
        ],
        avoid: [
          "Depth can grow with input size in a language without TCO — an " +
            "adversarial input becomes a crash.",
          "The problem is a flat sequence. A loop is clearer and safer.",
          "Subproblems overlap and you have not memoised — the cost is " +
            "exponential for no reason.",
          "You are in a tight performance-critical loop where call overhead is " +
            "measurable."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "load-balancer",

      why: {
        before: "One server answered every request. Scaling meant buying a " +
          "bigger machine, and that machine was also the single point of " +
          "failure.",
        problem: "Vertical scaling runs out — there is a largest server, and it " +
          "is priced accordingly. Worse, deploying meant downtime, because the " +
          "one machine had to restart.",
        shift: "Put something in front that spreads requests across many " +
          "identical servers. Scaling becomes *add another box*, deploys become " +
          "*drain one at a time*, and a dead server becomes a health check " +
          "failure rather than an outage."
      },

      num: {
        t: "Algorithms, and when each is wrong",
        h: ["Algorithm", "Picks", "Fails when"],
        r: [
          ["Round robin", "next in line", "requests differ in cost"],
          ["Least connections", "fewest active", "connections are long-lived"],
          ["Least response time", "fastest lately", "adds measurement overhead"],
          ["IP hash", "same client → same server", "one client dominates"],
          ["Consistent hashing", "key → server", "the general answer for caches"]
        ],
        n: "**Consistent hashing** is the one worth understanding properly. " +
          "With plain `hash(key) % N`, adding one server to a pool of ten " +
          "remaps roughly **90%** of keys — every cache in the fleet misses at " +
          "once. Consistent hashing remaps only about `1/N`, around **9%**. " +
          "That difference is why it underpins CDNs, distributed caches and " +
          "sharded databases."
      },

      miss: [
        {
          w: "A load balancer distributes load evenly.",
          r: "It distributes **requests**, which is only the same thing if " +
            "requests cost the same. Round robin sending a report generation " +
            "and a health check to alternating servers has balanced the count " +
            "and not the load. This is why least-connections or " +
            "least-response-time exist."
        },
        {
          w: "Adding a load balancer removes the single point of failure.",
          r: "It moves it. The balancer itself is now the thing everything " +
            "depends on, which is why they are deployed in pairs with a " +
            "floating IP, or fronted by DNS-level balancing. *What happens when " +
            "the load balancer dies* is a question with a real answer required."
        },
        {
          w: "Sticky sessions are a reasonable way to handle login state.",
          r: "They work, and they undo much of the point. A sticky client " +
            "cannot be moved, so a server cannot be drained without dropping " +
            "sessions, and load cannot rebalance. The better answer is making " +
            "servers **stateless** — put the session in Redis or a signed " +
            "token — so any server can serve any request."
        },
        {
          w: "Health checks tell you a server is healthy.",
          r: "They tell you the health endpoint responded. A server whose " +
            "database connection pool is exhausted can still return `200 OK` " +
            "from `/health` while failing every real request. A useful health " +
            "check exercises the dependencies the service actually needs — and " +
            "then you must be careful it does not cascade, taking out the whole " +
            "fleet when one shared dependency wobbles."
        }
      ],

      trade: {
        buys: [
          "Horizontal scaling — capacity becomes a purchasing decision.",
          "Zero-downtime deploys by draining one server at a time.",
          "Automatic removal of failed servers from rotation.",
          "A natural place for TLS termination, rate limiting and routing."
        ],
        costs: [
          "Another hop, so a little latency on every request.",
          "Another component to run, monitor and make highly available.",
          "Forces statelessness on the servers behind it, which is work.",
          "Health checks can be wrong in both directions — removing healthy " +
            "servers, or keeping broken ones."
        ],
        avoid: [
          "One server genuinely handles the load and brief downtime is " +
            "acceptable — the complexity is not free.",
          "The workload is inherently stateful per connection and cannot be " +
            "made otherwise.",
          "You are already behind a platform that does this for you — a " +
            "Kubernetes Service or a managed serverless runtime.",
          "The bottleneck is the database. Balancing across ten app servers " +
            "that all queue on one database moves the queue, not the limit."
        ]
      }
    }

  ]);
})(window.TD = window.TD || {});
