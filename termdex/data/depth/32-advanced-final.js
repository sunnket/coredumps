/* ==========================================================================
   Depth pass 32 — completing the advanced tier.

   The DP variants here (interval, digit) round out the family started in
   pass 24: each is the same recurrence machinery applied to a different
   notion of "what state do I need to carry forward". Digit DP in particular
   is worth internalising as a template — once you see that "build the number
   one digit at a time, tracking whether you are still bounded by N" is the
   whole trick, an entire class of counting problems becomes routine.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "digit-dp",

      why: {
        before: "Counting numbers in a range with some property meant " +
          "iterating over the range and testing each one — fine to a few " +
          "million, impossible at 10¹⁸.",
        problem: "Ranges in real problems are enormous. *How many numbers " +
          "below 10¹⁸ contain no two adjacent equal digits?* cannot be " +
          "answered by enumeration, and there is rarely a closed form.",
        shift: "Build the number **one digit at a time**, left to right, and " +
          "count paths rather than numbers. The key state is a single boolean: " +
          "**tight** — whether the prefix built so far exactly matches N's " +
          "prefix. If tight, the next digit is capped by N's digit; if not, " +
          "any digit is allowed and the remaining count depends only on " +
          "position and property state, so it memoises."
      },

      num: {
        t: "Why it works — the state space",
        h: ["Dimension", "Size", "Meaning"],
        r: [
          ["position", "~18", "which digit we are placing"],
          ["**tight**", "**2**", "**still bounded by N?**"],
          ["started", "2", "leading zeros handled?"],
          ["property state", "problem-specific", "e.g. last digit, digit sum"],
          ["**Total states**", "**~18 × 2 × 2 × k**", "**tiny — memoises trivially**"]
        ],
        n: "The whole range 0..10¹⁸ collapses to a few hundred states, which " +
          "is why this converts an impossible enumeration into an instant " +
          "computation. Two standard details: **range queries** use " +
          "`f(R) − f(L−1)`, so you only ever write the *count up to N* " +
          "function; and **leading zeros** need the `started` flag because " +
          "`007` and `7` are the same number but different digit strings, and " +
          "properties like *no two adjacent equal digits* must not see the " +
          "padding zeros. The memoisation must **exclude the tight state** " +
          "from being cached across different N — or equivalently, only " +
          "memoise when `tight` is false, since the tight branch is visited at " +
          "most once per position anyway."
      },

      miss: [
        {
          w: "You memoise on all state dimensions including tight.",
          r: "The **tight** branch is followed at most once per position — " +
            "there is only one prefix that matches N exactly — so caching it is " +
            "pointless and, if the cache persists across different N values, " +
            "**wrong**. Standard implementations memoise only the non-tight " +
            "case."
        },
        {
          w: "Leading zeros can be ignored.",
          r: "They change digit-based properties. Counting numbers with no two " +
            "adjacent equal digits, `0007` would be rejected for its repeated " +
            "zeros — but the number is 7 and should count. The `started` flag " +
            "exists precisely to suppress the property check until the first " +
            "nonzero digit."
        },
        {
          w: "It only counts — you cannot find the k-th such number.",
          r: "The same DP supports **k-th element queries** by walking digits " +
            "greedily: at each position, try digits in order and use the " +
            "counting function to see how many completions each allows, " +
            "descending into the branch containing the k-th. Counting and " +
            "ranking are the same machinery."
        },
        {
          w: "Digit DP is a niche competitive-programming trick.",
          r: "The **structure** — build an object incrementally while tracking " +
            "whether you are still constrained by an upper bound — recurs in " +
            "constraint counting, combinatorics on strings, and any " +
            "*count objects below a lexicographic bound* problem."
        }
      ],

      trade: {
        buys: [
          "Counts over ranges up to 10¹⁸ instantly.",
          "Tiny state space that memoises trivially.",
          "One template covers a large family of counting problems.",
          "Extends to k-th element and to digit-sum constraints."
        ],
        costs: [
          "The tight/started flags are subtle and commonly mishandled.",
          "Only applies to properties expressible digit by digit.",
          "The recursion is hard to read.",
          "Different bases or non-decimal representations need rework."
        ],
        avoid: [
          "The range is small enough to enumerate.",
          "The property is not decomposable by digit position — divisibility " +
            "by an arbitrary number, for instance, unless you track the " +
            "remainder.",
          "A closed-form combinatorial formula exists.",
          "You need the actual numbers rather than a count of them."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "interval-dp",

      why: {
        before: "Dynamic programming over sequences indexes by **position**: " +
          "`dp[i]` is the answer for the prefix ending at `i`, built left to " +
          "right.",
        problem: "That fails when the answer depends on how you **group** " +
          "elements rather than where you stop. Matrix chain multiplication, " +
          "optimal binary search trees and burst balloons all have the same " +
          "shape: the cost of combining a range depends on the order of " +
          "combination, and no left-to-right sweep captures it.",
        shift: "Index by **range**: `dp[i][j]` is the answer for the segment " +
          "from `i` to `j`, computed by trying every **split point** inside it. " +
          "Because a range's answer depends only on shorter ranges, iterating " +
          "by **increasing length** gives a valid computation order."
      },

      num: {
        t: "The template",
        h: ["Loop", "Over", "Why this order"],
        r: [
          ["outer", "**length 2..n**", "**shorter ranges must be done first**"],
          ["middle", "start position i", "j = i + length − 1"],
          ["inner", "**split point k**", "try every way to divide [i,j]"],
          ["Complexity", "**O(n³)**", "n² ranges × n splits"]
        ],
        n: "**Iterating by length is the whole trick** — it is what guarantees " +
          "that every sub-range `dp[i][k]` and `dp[k+1][j]` is already computed " +
          "when you need it. Writing the loops as `for i` then `for j` produces " +
          "wrong answers silently, exactly as the `k`-outermost rule does in " +
          "Floyd-Warshall. The family is large and worth recognising: matrix " +
          "chain multiplication, optimal binary search trees, polygon " +
          "triangulation, burst balloons, and **optimal file merging**. " +
          "**Knuth's optimisation** reduces the inner loop for problems " +
          "satisfying the quadrangle inequality, taking `O(n³)` down to " +
          "`O(n²)` — which matters when n reaches a few thousand."
      },

      miss: [
        {
          w: "You can iterate i and j in any order as long as both loops run.",
          r: "You **cannot**. Shorter ranges must be computed before longer " +
            "ones containing them. Iterating by **length** guarantees this; " +
            "iterating by start and end position does not, and the result is " +
            "silently wrong."
        },
        {
          w: "The split point always divides the range in half.",
          r: "You try **every** split point and take the best — that is the " +
            "inner loop and the source of the `O(n³)`. Assuming a midpoint " +
            "split is a greedy heuristic, and for matrix chain multiplication " +
            "it is provably not optimal."
        },
        {
          w: "Interval DP is only for combining adjacent elements.",
          r: "**Burst balloons** inverts it — you think about which element is " +
            "removed *last* from a range, not first, because that makes the " +
            "subproblems independent. Recognising which decomposition makes " +
            "the ranges independent is the actual difficulty."
        },
        {
          w: "The cost is always O(n³), so it caps out around n = 1000.",
          r: "**Knuth's optimisation** applies when the cost function satisfies " +
            "the quadrangle inequality — true for optimal BSTs and several " +
            "others — and reduces it to `O(n²)` by bounding where the optimal " +
            "split can be. Worth checking before assuming the cubic bound."
        }
      ],

      trade: {
        buys: [
          "Solves grouping and ordering problems no linear DP can express.",
          "One template covers a large problem family.",
          "Knuth's optimisation reduces it to `O(n²)` where applicable.",
          "Reconstruction is straightforward from a stored split table."
        ],
        costs: [
          "`O(n³)` time and `O(n²)` memory.",
          "The length-first loop order is a silent correctness trap.",
          "Finding the right decomposition requires insight.",
          "Impractical beyond n of a few thousand."
        ],
        avoid: [
          "A linear DP over positions suffices.",
          "A greedy choice is provably optimal.",
          "n is large enough that `O(n³)` is prohibitive and no optimisation " +
            "applies.",
          "The problem decomposes by subtree rather than range — that is " +
            "**tree DP**."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "manacher-s-algorithm",

      why: {
        before: "Finding the longest palindromic substring meant expanding " +
          "around every possible centre — `O(n²)` in the worst case, and the " +
          "expansions overlap heavily.",
        problem: "That repeated work is exactly what an algorithm should " +
          "eliminate. A palindrome has **mirror symmetry**, so information " +
          "learned about one side is directly informative about the other, and " +
          "the naive approach discards it.",
        shift: "Maintain the **rightmost palindrome** found so far. For a new " +
          "centre inside it, the mirror position's radius is already known and " +
          "gives a **lower bound** you can start from rather than expanding " +
          "from zero. The right boundary only ever moves forward, so the total " +
          "expansion work across the whole string is `O(n)`."
      },

      num: {
        t: "Longest palindromic substring",
        h: ["Method", "Time", "Space", "Complexity to implement"],
        r: [
          ["Brute force", "O(n³)", "O(1)", "trivial"],
          ["Expand around centre", "**O(n²)**", "O(1)", "**easy**"],
          ["**Manacher**", "**O(n)**", "O(n)", "**subtle**"],
          ["Suffix automaton / Eertree", "O(n)", "O(n)", "harder"]
        ],
        n: "The **odd/even problem** is handled by a preprocessing trick worth " +
          "knowing: interpolate a separator character between every pair, so " +
          "`abba` becomes `#a#b#b#a#`. Every palindrome in the transformed " +
          "string has **odd** length, which removes the need to handle two " +
          "cases separately and is why the algorithm looks deceptively simple. " +
          "The honest practical note is the last column: **expand-around-centre " +
          "at `O(n²)` is fine for most real inputs** — n would need to reach " +
          "tens of thousands before the difference matters — and Manacher's " +
          "mirror-and-boundary logic is genuinely easy to get subtly wrong. It " +
          "is the right answer when n is large or the input is adversarial, and " +
          "over-engineering otherwise."
      },

      miss: [
        {
          w: "Manacher finds all palindromic substrings.",
          r: "It computes the **radius at every centre**, from which all " +
            "palindromes can be derived — a palindrome of radius r at a centre " +
            "implies r smaller ones nested inside. Enumerating them all is " +
            "`O(n²)` because there can be that many; the algorithm gives you " +
            "the compact representation."
        },
        {
          w: "The separator characters need to be absent from the alphabet.",
          r: "They must not **match** any real character, so a character " +
            "outside the input alphabet is used. Since every position in the " +
            "transformed string alternates separator and real character, a " +
            "separator can only ever align with another separator — which is " +
            "why the transform works."
        },
        {
          w: "It is the standard solution to the longest-palindrome problem.",
          r: "**Expand around centre** is the standard answer in interviews and " +
            "in most codebases, because `O(n²)` with a tiny constant is fast " +
            "enough and obviously correct. Manacher is reached for when n is " +
            "large enough that the asymptotic difference is real."
        },
        {
          w: "The algorithm expands from each centre, so it is really O(n²).",
          r: "The **right boundary is monotonic** — it never moves left — so " +
            "the total number of expansion steps across all centres is bounded " +
            "by n. Each individual centre may expand a lot; the sum cannot. " +
            "That amortised argument is the correctness proof."
        }
      ],

      trade: {
        buys: [
          "Linear time for all palindromic radii.",
          "The separator trick removes odd/even case handling.",
          "Gives a compact representation of every palindrome.",
          "Deterministic — no hashing or randomisation."
        ],
        costs: [
          "The mirror and boundary logic is easy to get wrong.",
          "`O(n)` extra space for the transformed string and radius array.",
          "Harder to verify than expand-around-centre.",
          "Rarely necessary at realistic input sizes."
        ],
        avoid: [
          "n is small — **expand around centre** is simpler and fast enough.",
          "You need palindromic substructure beyond radii — consider an " +
            "**Eertree**.",
          "Correctness under time pressure matters more than asymptotics.",
          "The problem is about subsequences rather than substrings, which is " +
            "a different DP."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "continuous-training",

      why: {
        before: "A model was trained once, validated, deployed, and left. " +
          "Retraining happened when someone noticed a problem and had time to " +
          "act on it.",
        problem: "Models decay because **the world moves** — prices inflate, " +
          "behaviour shifts, a competitor launches. Manual retraining is slow, " +
          "inconsistent between engineers, and reactive: by the time someone " +
          "notices, the model has been degrading for weeks.",
        shift: "Make retraining a **pipeline**, not a project. Trigger on a " +
          "schedule, on drift, or on new data volume; retrain automatically; " +
          "**validate against the incumbent**; deploy only if it wins. The " +
          "validation gate is the essential part — automating retraining " +
          "without it means automating the deployment of bad models."
      },

      num: {
        t: "Triggers and their failure modes",
        h: ["Trigger", "Fires on", "Risk"],
        r: [
          ["Schedule", "weekly, monthly", "retrains when nothing changed"],
          ["**Drift detection**", "input distribution shift", "**a pipeline bug looks like drift**"],
          ["Performance drop", "accuracy falls", "**needs labels — often delayed**"],
          ["Data volume", "N new examples", "ignores whether they matter"],
          ["**Manual**", "someone decides", "slow, but a human saw it"]
        ],
        n: "The **drift trigger** row carries the most dangerous failure: the " +
          "most common cause of a drift alert is not the world changing but an " +
          "**upstream pipeline bug** — a renamed column, a unit change, a " +
          "default that became null. Retraining on corrupted data bakes the " +
          "corruption into the model and makes things substantially worse, " +
          "automatically and at speed. That is why the validation gate must " +
          "compare against the **current production model on a held-out set**, " +
          "and why a champion-challenger deployment with automatic rollback is " +
          "the standard shape. The other essential piece is **reproducibility**: " +
          "every automated run must record its data version, code version and " +
          "hyperparameters, or you cannot investigate the run that broke " +
          "production."
      },

      miss: [
        {
          w: "Continuous training means the model gets better over time.",
          r: "It means the model is **retrained** over time. Whether each new " +
            "model is better depends entirely on the data and the validation " +
            "gate. Without a gate, you have automated the deployment of " +
            "whatever the latest data produced — including corruption."
        },
        {
          w: "Drift detection is a good automatic retraining trigger.",
          r: "It is a good **investigation** trigger. Firing retraining " +
            "directly on drift means a pipeline bug — the most common cause of " +
            "drift alerts — is automatically converted into a bad model in " +
            "production. Investigate the cause before retraining on it."
        },
        {
          w: "It is the same as online learning.",
          r: "**Continuous training retrains a model in batch and gates the " +
            "result**; online learning updates the deployed model " +
            "incrementally with no validation step. The gate is the whole " +
            "difference, and it is why continuous training is far safer."
        },
        {
          w: "More frequent retraining is better.",
          r: "Each run costs compute and each deployment carries risk. " +
            "Retraining daily on a stable distribution produces noise-level " +
            "differences at real cost. Frequency should follow **how fast the " +
            "data actually shifts**, measured rather than assumed."
        }
      ],

      trade: {
        buys: [
          "Models stay current without manual intervention.",
          "Consistent, reproducible retraining process.",
          "Validation gate prevents bad models reaching production.",
          "Faster response to genuine distribution change."
        ],
        costs: [
          "Substantial pipeline infrastructure.",
          "Compute cost per run.",
          "Automating a bad process automates the damage.",
          "Needs reproducibility tracking to be debuggable.",
          "Labels are often too delayed for a performance trigger."
        ],
        avoid: [
          "The distribution is genuinely stable — measure before building.",
          "You have no validation gate; automating without one is dangerous.",
          "Labels arrive too slowly to validate a challenger.",
          "The volume does not justify the infrastructure — scheduled manual " +
            "retraining may be right."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "sglang",

      why: {
        before: "**vLLM** solved KV memory fragmentation with PagedAttention " +
          "and continuous batching — a large throughput win for independent " +
          "requests.",
        problem: "Modern LLM workloads are not independent requests. Agent " +
          "loops resend the whole conversation each turn; few-shot prompts " +
          "share long prefixes; tree-of-thought explores branches from a " +
          "common root. All of that shares **prefix KV state**, and a cache " +
          "keyed on exact full-prompt matches captures almost none of it.",
        shift: "Store the KV cache in a **radix tree** keyed by token prefix. " +
          "Any shared prefix — between requests, between branches, across " +
          "turns — is automatically detected and reused at whatever depth it " +
          "diverges. **RadixAttention** turns prefix sharing from an " +
          "opt-in optimisation into an automatic property of the cache."
      },

      num: {
        t: "Prefix reuse compared",
        h: ["Scenario", "Exact-match cache", "**RadixAttention**"],
        r: [
          ["Same system prompt", "**hit**", "hit"],
          ["Agent turn 5 of a conversation", "**miss**", "**hit on turns 1–4**"],
          ["Parallel sampling branches", "miss", "**hit on the common root**"],
          ["Few-shot with different query", "**miss**", "**hit on the examples**"],
          ["Tree-of-thought exploration", "miss", "**hit at every branch point**"]
        ],
        n: "The middle rows are where the gains come from, and they are " +
          "exactly the workloads that grew after vLLM was designed. An agent " +
          "loop resends its entire history every turn, so by turn five roughly " +
          "80% of the prompt is already cached — an exact-match cache sees a " +
          "different string each time and reuses nothing. SGLang also ships a " +
          "**structured generation** frontend with constrained decoding via " +
          "compressed finite state machines, which is a genuinely separate " +
          "contribution: enforcing a JSON schema during generation rather than " +
          "validating afterwards. The trade against vLLM is maturity and " +
          "ecosystem — vLLM has broader adoption and hardware support, SGLang " +
          "wins clearly on prefix-heavy and structured workloads."
      },

      miss: [
        {
          w: "RadixAttention is a different attention algorithm.",
          r: "The attention computation is unchanged. It is a **cache indexing " +
            "strategy** — a radix tree over token prefixes deciding what can be " +
            "reused. The name follows PagedAttention's convention and, like " +
            "it, describes memory management rather than mathematics."
        },
        {
          w: "It only helps if requests share a system prompt.",
          r: "That is the case an exact-match cache already handles. The " +
            "distinctive gains are **partial and nested** sharing — " +
            "conversation turns, sampling branches, tree exploration — where " +
            "the shared portion differs per pair of requests."
        },
        {
          w: "SGLang replaces vLLM.",
          r: "They overlap heavily and differ in emphasis. vLLM has broader " +
            "hardware support and a larger ecosystem; SGLang leads on " +
            "prefix-sharing workloads and structured output. Both are actively " +
            "developed and borrow from each other."
        },
        {
          w: "Automatic prefix caching means you need not think about prompt " +
            "structure.",
          r: "Sharing still requires a **common prefix from position zero**. " +
            "Injecting a timestamp or a request ID at the start of every prompt " +
            "defeats it entirely. Put static content first — the advice is the " +
            "same as for any prefix cache."
        }
      ],

      trade: {
        buys: [
          "Automatic reuse of any shared prefix at any depth.",
          "Large gains on agent loops and tree search.",
          "Structured generation with constrained decoding.",
          "Competitive throughput with vLLM on ordinary workloads."
        ],
        costs: [
          "Radix tree adds memory and management complexity.",
          "Less mature ecosystem than vLLM.",
          "Narrower hardware support.",
          "Cache eviction policy interacts with request scheduling."
        ],
        avoid: [
          "Requests share no prefixes — the advantage disappears.",
          "You need the broadest hardware support — **vLLM**.",
          "Maximum single-configuration performance on NVIDIA — " +
            "**TensorRT-LLM**.",
          "You need a mature, widely-deployed stack above all else."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "candidate-generation",

      why: {
        before: "A recommender scored every item for every user with its best " +
          "model — accurate, and requiring one forward pass per item.",
        problem: "With ten million items and a 100ms budget, that is " +
          "impossible. But you cannot simply use a cheaper model either, " +
          "because the cheap model is not accurate enough to rank the final " +
          "results the user actually sees.",
        shift: "**Split the problem by cost and precision.** A cheap " +
          "high-recall stage narrows millions of items to hundreds; an " +
          "expensive high-precision stage ranks those. The first stage's job " +
          "is emphatically **not** to be right — it is to **not lose** the " +
          "right answer, because anything it drops can never be recovered."
      },

      num: {
        t: "The funnel",
        h: ["Stage", "Items in → out", "Budget per item", "Optimises"],
        r: [
          ["**Candidate generation**", "**10M → ~1,000**", "**microseconds**", "**recall**"],
          ["Filtering", "1,000 → 500", "cheap rules", "eligibility"],
          ["Ranking", "500 → 50", "milliseconds", "**precision**"],
          ["Re-ranking", "50 → 10", "expensive", "diversity, business rules"]
        ],
        n: "**Recall at the first stage caps everything downstream** — this is " +
          "the single most important property of the architecture. If " +
          "candidate generation misses the item the user would have loved, no " +
          "amount of ranking sophistication recovers it, and your offline " +
          "ranking metrics will look fine because they only evaluate what was " +
          "retrieved. That is why production systems use **several parallel " +
          "generators** — a two-tower embedding retriever, a collaborative " +
          "filtering source, a trending source, a recently-viewed source — and " +
          "union their outputs, each covering a different failure mode. It is " +
          "also why measuring candidate-generation recall against the eventual " +
          "engagement is a distinct and necessary evaluation from ranking " +
          "quality."
      },

      miss: [
        {
          w: "Candidate generation should be as accurate as possible.",
          r: "It should be **high recall**, which is a different objective. " +
            "Precision is the ranker's job. A candidate generator optimised for " +
            "precision returns a narrow, safe set and systematically loses the " +
            "long tail — which is where most of the value in recommendation " +
            "lives."
        },
        {
          w: "One good retrieval model is enough.",
          r: "Production systems use **multiple parallel generators** because " +
            "each fails differently — embeddings miss cold-start items, " +
            "collaborative filtering misses new users, popularity misses niche " +
            "interests. The union covers what any single source would drop."
        },
        {
          w: "Ranking metrics tell you how the system is performing.",
          r: "They evaluate **only the items that were retrieved**. A system " +
            "with excellent nDCG over a candidate set that systematically " +
            "excludes relevant items looks healthy and is failing. " +
            "Candidate-generation recall must be measured separately."
        },
        {
          w: "More candidates is always better.",
          r: "More candidates cost ranker compute linearly, and returns flatten " +
            "quickly — going from 1,000 to 10,000 typically adds little " +
            "because the additional items are genuinely poor. The number is a " +
            "latency-versus-recall trade to be measured, not maximised."
        }
      ],

      trade: {
        buys: [
          "Makes real-time recommendation over millions of items possible.",
          "Each stage uses the right model for its cost budget.",
          "Multiple generators cover complementary failure modes.",
          "Expensive ranking is applied only where it matters."
        ],
        costs: [
          "First-stage recall caps the whole system.",
          "Several models to train, serve and monitor.",
          "Recall failures are invisible in ranking metrics.",
          "Multiple sources need deduplication and merging."
        ],
        avoid: [
          "The catalogue is small enough to rank exhaustively.",
          "You cannot measure first-stage recall — you will not notice it " +
            "failing.",
          "One retrieval source genuinely covers the catalogue.",
          "Latency is unconstrained, as in batch recommendation."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "dependency-parsing",

      why: {
        before: "Sentence structure was analysed with **constituency " +
          "parsing** — nested phrases: a noun phrase inside a verb phrase " +
          "inside a sentence, following a formal grammar.",
        problem: "Constituency trees are large, grammar-specific, and awkward " +
          "for the question applications actually ask: **who did what to " +
          "whom**. Extracting *the subject of this verb* from a nested phrase " +
          "structure requires traversing the tree; and languages with free " +
          "word order fit the phrase-structure model badly.",
        shift: "Model **direct relations between words** instead. Each word " +
          "has exactly one head and a labelled relation to it — *subject*, " +
          "*object*, *modifier*. The result is a tree over words with no " +
          "intermediate nodes, which is smaller, more directly useful, and " +
          "works far better for morphologically rich languages."
      },

      num: {
        t: "Parsing approaches",
        h: ["Approach", "Complexity", "Property"],
        r: [
          ["**Transition-based**", "**O(n) — linear**", "greedy, fast, error propagation"],
          ["**Graph-based**", "O(n²) or O(n³)", "**globally optimal**"],
          ["Constituency (CKY)", "O(n³)", "phrase structure"],
          ["**Universal Dependencies**", "—", "**one label set, 100+ languages**"]
        ],
        n: "**Universal Dependencies** is the practically important row: a " +
          "cross-linguistically consistent annotation scheme covering over a " +
          "hundred languages, which means a parser and downstream code can " +
          "work across languages without relearning a label set per language. " +
          "The transition-versus-graph split is the classic trade: " +
          "transition-based parsers make greedy local decisions in linear time " +
          "and **cannot recover from an early mistake**; graph-based parsers " +
          "score all possible arcs and find the optimal tree, at higher cost. " +
          "The honest current position is that for most downstream tasks, " +
          "**transformers absorbed this** — a fine-tuned model extracts " +
          "relations end-to-end without an explicit parse. Dependency parsing " +
          "remains valuable where you need **explicit, inspectable structure**: " +
          "linguistic research, rule-based extraction, and low-resource " +
          "languages without enough data to fine-tune."
      },

      miss: [
        {
          w: "Dependency and constituency parsing are alternatives for the " +
            "same output.",
          r: "They encode **different information**. Constituency captures " +
            "phrase structure and nesting; dependency captures word-to-word " +
            "grammatical relations. Conversion between them is possible and " +
            "lossy in both directions."
        },
        {
          w: "A parse tree tells you the meaning of the sentence.",
          r: "It gives **syntactic** structure. *The chicken is ready to eat* " +
            "has one unambiguous parse and two meanings. Semantics requires " +
            "more than syntax, which is precisely the limitation that motivated " +
            "semantic role labelling and, eventually, end-to-end neural models."
        },
        {
          w: "Transition-based parsing is worse because it is greedy.",
          r: "It is **linear time** and, with beam search and good features, " +
            "competitive in accuracy. Greedy decisions do propagate errors, and " +
            "the speed difference is decisive when parsing large corpora. " +
            "Neither dominates."
        },
        {
          w: "LLMs made dependency parsing obsolete.",
          r: "For most **downstream tasks**, largely yes — a fine-tuned model " +
            "extracts relations directly. Explicit parsing remains valuable for " +
            "**inspectable structure**, linguistic research, rule-based " +
            "systems, and low-resource languages where no fine-tuning data " +
            "exists."
        }
      ],

      trade: {
        buys: [
          "Direct word-to-word grammatical relations.",
          "Compact — one node per word, no phrase nodes.",
          "Universal Dependencies works across 100+ languages.",
          "Suits free-word-order languages better than phrase structure.",
          "Explicit, inspectable structure for rule-based extraction."
        ],
        costs: [
          "Syntactic only — says nothing about meaning.",
          "Accuracy degrades on informal text and unusual domains.",
          "Adds a pipeline stage with its own error rate.",
          "Largely superseded by end-to-end models for downstream tasks."
        ],
        avoid: [
          "An LLM handles the end task and you need no explicit structure.",
          "The text is informal — social media, transcripts — where parsers " +
            "degrade.",
          "You need semantics rather than syntax.",
          "The downstream task does not use the structure."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "f-sharp",

      why: {
        before: "**.NET** had C# — a capable, pragmatic, object-oriented " +
          "language with an enormous ecosystem and, in its early years, " +
          "considerable ceremony.",
        problem: "Microsoft Research wanted the **ML family's** strengths — " +
          "type inference, algebraic data types, exhaustive pattern matching, " +
          "immutability by default — on a platform enterprises already used. " +
          "Rewriting the .NET ecosystem was not an option.",
        shift: "Port **OCaml to .NET**. F# keeps ML's core — inference so " +
          "strong that annotations are rare, discriminated unions, pattern " +
          "matching with exhaustiveness checking — while calling any .NET " +
          "library and interoperating with C#. Functional-first, not " +
          "functional-only."
      },

      num: {
        t: "F# against C#",
        h: ["Feature", "C#", "F#"],
        r: [
          ["Type inference", "local (`var`)", "**whole-program**"],
          ["**Discriminated unions**", "**only recently, limited**", "**core feature**"],
          ["Exhaustive matching", "improving", "**compiler-enforced**"],
          ["Immutable by default", "no", "**yes**"],
          ["Null", "**everywhere**", "**Option instead**"],
          ["**Units of measure**", "**no**", "**compile-time checked**"]
        ],
        n: "**Units of measure** is F#'s genuinely distinctive feature and one " +
          "almost no other mainstream language has: `1.0<m>` and `1.0<ft>` are " +
          "different types, so adding metres to feet is a **compile error** " +
          "and the checking is erased at runtime with zero cost. That is " +
          "exactly the class of error that destroyed the Mars Climate Orbiter. " +
          "The two rows that matter most in daily use are **discriminated " +
          "unions with exhaustive matching** — making illegal states " +
          "unrepresentable, and the compiler telling you when a new case is " +
          "unhandled — and **Option instead of null**, which removes the " +
          "single most common source of runtime errors in C#. F# is " +
          "concentrated in finance and domain modelling for precisely these " +
          "reasons."
      },

      miss: [
        {
          w: "F# is a functional language, so you cannot use OOP.",
          r: "It is **functional-first, not functional-only**. Classes, " +
            "interfaces, inheritance and mutable state are all available and " +
            "used freely at .NET boundaries. The defaults favour functional " +
            "style; the escape hatches are first-class."
        },
        {
          w: "You cannot use C# libraries from F#.",
          r: "Full interop in **both directions** — same runtime, same type " +
            "system, same package ecosystem. The friction is stylistic: C# " +
            "APIs return null and use mutation, so idiomatic F# usually wraps " +
            "them thinly."
        },
        {
          w: "F# is dying because C# keeps adding functional features.",
          r: "C# has added records, pattern matching and immutability, and it " +
            "has **not** added whole-program inference, true discriminated " +
            "unions, or units of measure — and its null-by-default legacy " +
            "cannot be removed. The gap narrowed and did not close."
        },
        {
          w: "Type inference means you never write type annotations.",
          r: "Inference is **order-dependent** — types flow top to bottom, " +
            "left to right — so a function used before its types are known " +
            "needs annotation. Public API boundaries also want explicit types " +
            "for documentation and stability."
        }
      ],

      trade: {
        buys: [
          "Whole-program inference — very few annotations.",
          "Discriminated unions with exhaustive matching.",
          "Option instead of null.",
          "Units of measure checked at compile time, free at runtime.",
          "Full access to the .NET ecosystem."
        ],
        costs: [
          "Small hiring pool relative to C#.",
          "Less Microsoft investment than C#.",
          "Tooling is good and not as polished as C#'s.",
          "Order-dependent compilation constrains project layout.",
          "Interop with C# APIs needs wrapping to stay idiomatic."
        ],
        avoid: [
          "The team is C#-fluent and the domain is straightforward CRUD.",
          "Hiring is a hard constraint.",
          "You need the very best tooling and library support on .NET.",
          "The problem has no complex domain modelling — the type system's " +
            "value is in modelling."
        ]
      }
    }

  ]);
})(window.TD = window.TD || {});
