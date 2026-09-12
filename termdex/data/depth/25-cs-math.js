/* ==========================================================================
   Depth pass 25 — balanced trees, the remaining DP patterns, and the
   mathematics that underpins optimisation.

   The maths terms here are the ones people use daily without inspecting.
   Maximum likelihood *is* what your loss function is doing; SVD *is* what
   PCA computes; convexity is the property that decides whether your
   optimiser has found the answer or merely stopped.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "red-black-tree",

      why: {
        before: "**AVL trees** guaranteed `O(log n)` by keeping sibling " +
          "subtree heights within 1 — a strict invariant, restored by " +
          "rotations after every modification.",
        problem: "Strictness costs. AVL's tight balance means **deletions can " +
          "cascade rotations up the whole tree**, so write-heavy workloads pay " +
          "repeatedly for a height advantage they rarely benefit from.",
        shift: "Loosen the invariant. Colour nodes red or black and require " +
          "only that **every root-to-leaf path has the same number of black " +
          "nodes**, with no two reds adjacent. That permits the longest path to " +
          "be up to **twice** the shortest — a taller tree, and crucially " +
          "**at most 3 rotations for a deletion**, versus AVL's `O(log n)`."
      },

      num: {
        t: "AVL against red-black",
        h: ["Property", "AVL", "Red-black"],
        r: [
          ["Height bound", "**~1.44 log n**", "~2 log n"],
          ["Rotations per insert", "≤ 2", "≤ 2"],
          ["**Rotations per delete**", "**O(log n)**", "**≤ 3**"],
          ["Lookup speed", "**faster**", "slower"],
          ["Write speed", "slower", "**faster**"],
          ["Used by", "databases, indexes", "**`std::map`, `TreeMap`, Linux CFS**"]
        ],
        n: "The last row is the practical answer to *which should I use*: " +
          "red-black won the standard libraries because **general-purpose " +
          "containers see mixed read and write workloads**, and bounded " +
          "deletion cost matters more there than a 30% height advantage. AVL " +
          "wins where reads dominate overwhelmingly. Both are largely " +
          "historical curiosities for application programmers now — you use " +
          "whatever `std::map` or `TreeMap` provides — but the trade-off " +
          "generalises: **stricter invariants give better queries and more " +
          "expensive maintenance**, which is the same argument as database " +
          "index design. Note also that on **disk**, both lose to a B-tree, " +
          "because the cost there is seeks rather than comparisons."
      },

      miss: [
        {
          w: "Red-black trees are balanced, so their height is log n.",
          r: "Their height is bounded by **2 log n**, which is *balanced " +
            "enough* for the asymptotic guarantee and genuinely taller than " +
            "AVL's 1.44 log n. On a million nodes that is roughly 40 levels " +
            "against 28 — a real difference in lookup work."
        },
        {
          w: "The colours have some meaning about the data.",
          r: "They are pure bookkeeping — one bit per node encoding enough " +
            "information to maintain the height bound. The colour of a node " +
            "says nothing about its key or value, and changes freely as the " +
            "tree is modified."
        },
        {
          w: "You should implement one to understand balanced trees.",
          r: "Red-black deletion has a genuinely large number of cases and is " +
            "notoriously error-prone — it is a poor first implementation. An " +
            "**AVL tree** or a **treap** teaches the same concepts with far " +
            "less case analysis, and a **skip list** achieves comparable " +
            "behaviour with dramatically simpler code."
        },
        {
          w: "Red-black trees are what databases use for indexes.",
          r: "Databases use **B-trees** and B+ trees. A binary tree of any " +
            "colour is the wrong shape for disk: each node is one page read, so " +
            "a 40-level binary tree means 40 seeks where a 4-level B-tree means " +
            "4. Fan-out, not balance strictness, is what matters there."
        }
      ],

      trade: {
        buys: [
          "Guaranteed `O(log n)` with bounded rotations on both insert and " +
            "delete.",
          "Better write performance than AVL.",
          "One bit of overhead per node.",
          "Battle-tested in every major standard library."
        ],
        costs: [
          "Taller than AVL, so lookups are slower.",
          "Deletion has many cases and is hard to implement correctly.",
          "Pointer-chasing gives poor cache locality.",
          "Beaten by B-trees on disk and hash tables for plain lookup."
        ],
        avoid: [
          "You need only key-value lookup — a **hash table** is faster.",
          "Data is on disk — use a **B-tree**.",
          "Reads dominate heavily — **AVL** is shorter.",
          "You are implementing it yourself — use the standard library, or a " +
            "**skip list** if you must write one."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "maximum-likelihood-estimation",

      why: {
        before: "Fitting a model meant choosing parameters that *looked right* " +
          "— least squares because the errors seemed small, or a heuristic " +
          "that matched the data.",
        problem: "Without a principle, there is no way to say which fit is " +
          "**correct**, no way to compare two estimators, and no theory about " +
          "how the estimate behaves as data grows.",
        shift: "Ask one question: **which parameter values make the observed " +
          "data most probable?** That is the likelihood, and maximising it is " +
          "a principled estimator with known properties — it is *consistent* " +
          "(converges to the truth) and *asymptotically efficient* (achieves " +
          "the lowest possible variance in the limit)."
      },

      num: {
        t: "Familiar losses are maximum likelihood in disguise",
        h: ["Assumed noise / distribution", "MLE gives you"],
        r: [
          ["Gaussian errors", "**least squares (MSE)**"],
          ["Bernoulli outcomes", "**binary cross-entropy**"],
          ["Categorical outcomes", "**categorical cross-entropy**"],
          ["Poisson counts", "Poisson loss"],
          ["Laplace errors", "**mean absolute error**"]
        ],
        n: "This table is the point: **your loss function is an assumption " +
          "about the noise distribution**, whether or not you made it " +
          "consciously. Choosing MSE asserts Gaussian errors — which is why MSE " +
          "is so sensitive to outliers, since a Gaussian assigns them near-zero " +
          "probability and the optimiser moves heaven and earth to accommodate " +
          "them. Choosing MAE asserts Laplace errors, which have fatter tails " +
          "and hence robustness. Two mechanical points: we maximise " +
          "**log**-likelihood because products of many small probabilities " +
          "underflow and sums are differentiable-friendly, and we **minimise " +
          "negative** log-likelihood because optimisers descend."
      },

      miss: [
        {
          w: "MLE gives the most likely parameter values.",
          r: "It gives the parameters under which the **data** is most likely — " +
            "`P(data | θ)`, not `P(θ | data)`. Those are different quantities, " +
            "related by Bayes' theorem and a prior. The parameter-probability " +
            "reading is the **MAP** estimate, which is MLE plus a prior."
        },
        {
          w: "MLE is unbiased.",
          r: "It is **consistent** — it converges to the truth as data grows — " +
            "and it can be **biased in finite samples**. The standard example: " +
            "the MLE of a Gaussian's variance divides by `n` and " +
            "systematically underestimates; the unbiased estimator divides by " +
            "`n−1`. That is exactly where Bessel's correction comes from."
        },
        {
          w: "Adding regularisation is an unrelated engineering trick.",
          r: "L2 regularisation **is** MLE with a Gaussian prior on the weights " +
            "(MAP estimation); L1 is a Laplace prior. Regularisation is not " +
            "bolted on — it is what happens when you write down a prior belief " +
            "and maximise the posterior instead of the likelihood."
        },
        {
          w: "MLE works well with limited data.",
          r: "Its good properties are **asymptotic**. With few samples it " +
            "overfits readily — the extreme case being a probability of exactly " +
            "zero for any unobserved outcome, which is why smoothing exists. " +
            "Bayesian methods with informative priors are better in the " +
            "small-data regime."
        }
      ],

      trade: {
        buys: [
          "A principled derivation for a loss function instead of a heuristic.",
          "Consistent and asymptotically efficient.",
          "Makes noise assumptions explicit and therefore checkable.",
          "Standard errors and confidence intervals come from the same theory."
        ],
        costs: [
          "Biased in finite samples.",
          "Overfits with limited data and no prior.",
          "Requires specifying a distribution, which may be wrong.",
          "Can be intractable, requiring EM or numerical methods."
        ],
        avoid: [
          "Data is scarce — use a **Bayesian** approach with a prior.",
          "You cannot justify a distributional assumption.",
          "The likelihood is intractable — consider variational or " +
            "likelihood-free methods.",
          "You need uncertainty over parameters, not a point estimate."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "singular-value-decomposition",

      why: {
        before: "**Eigendecomposition** reveals what a matrix does — scaling " +
          "along invariant directions — and only for **square** matrices, and " +
          "not even all of those, since defective matrices cannot be " +
          "diagonalised.",
        problem: "Most matrices in practice are rectangular: a data matrix of " +
          "1,000 samples by 50 features has no eigenvectors at all. And the " +
          "square ones you do encounter may be defective or numerically " +
          "unstable to decompose.",
        shift: "Factor **any** matrix as `A = UΣVᵀ` — a rotation, a scaling " +
          "along axes, another rotation. Every matrix has one. The singular " +
          "values in `Σ` are ordered by importance, so truncating after `k` of " +
          "them gives the **provably best rank-k approximation** " +
          "(Eckart-Young), which is what makes SVD the foundation of " +
          "compression and dimensionality reduction."
      },

      num: {
        t: "What SVD gives you directly",
        h: ["Application", "How"],
        r: [
          ["**PCA**", "SVD of the centred data matrix"],
          ["Low-rank compression", "keep top-k singular values"],
          ["Pseudoinverse", "invert nonzero σ, transpose"],
          ["**Condition number**", "**σ_max / σ_min**"],
          ["Rank", "count of nonzero σ"],
          ["Latent semantic analysis", "SVD of term-document matrix"]
        ],
        n: "**PCA is SVD** — running `eig` on the covariance matrix is the " +
          "textbook derivation and the numerically worse route, because " +
          "forming `XᵀX` **squares the condition number** and loses precision. " +
          "Every serious implementation uses SVD on the centred data directly. " +
          "The condition number row is the practical diagnostic: `σ_max/σ_min` " +
          "tells you how much a linear system amplifies input error, and a " +
          "value above ~10⁸ in double precision means your solution's digits " +
          "are mostly noise. Cost is `O(min(mn², m²n))`, which is why " +
          "**truncated** and randomised SVD exist for large matrices where you " +
          "only want the top few components."
      },

      miss: [
        {
          w: "SVD and eigendecomposition are basically the same thing.",
          r: "SVD exists for **every** matrix including rectangular ones; " +
            "eigendecomposition needs square and non-defective. They coincide " +
            "only for symmetric positive semi-definite matrices. SVD is also " +
            "**numerically more stable**, which is why libraries prefer it."
        },
        {
          w: "PCA requires computing the covariance matrix.",
          r: "That is the textbook derivation and the worse algorithm. Forming " +
            "`XᵀX` squares the condition number and destroys precision. " +
            "**SVD on the centred data matrix** gives the same components " +
            "with far better numerical behaviour."
        },
        {
          w: "Singular values are eigenvalues.",
          r: "Singular values are the **square roots of the eigenvalues of " +
            "`AᵀA`**, and are always **non-negative and real**. Eigenvalues can " +
            "be negative or complex. The relationship is close and they are not " +
            "the same quantity."
        },
        {
          w: "Truncating to k components is a heuristic approximation.",
          r: "The **Eckart-Young theorem** proves it is the *optimal* rank-k " +
            "approximation in both Frobenius and spectral norm. No other rank-k " +
            "matrix is closer. That optimality is why it appears in so many " +
            "compression and denoising methods."
        }
      ],

      trade: {
        buys: [
          "Exists for every matrix, square or not.",
          "Numerically stable — the standard tool for rank and conditioning.",
          "Provably optimal low-rank approximation.",
          "Underlies PCA, LSA, recommender systems and the pseudoinverse."
        ],
        costs: [
          "`O(min(mn², m²n))` — expensive for large dense matrices.",
          "Dense output even from a sparse input.",
          "Components are orthogonal but not necessarily interpretable.",
          "Full SVD is wasteful when only the top components are wanted."
        ],
        avoid: [
          "The matrix is huge and sparse — use truncated or randomised SVD.",
          "You need interpretable non-negative parts — use **NMF**.",
          "The matrix is symmetric positive definite and you need a solve — " +
            "**Cholesky** is far cheaper.",
          "Only the largest singular value is needed — power iteration."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "convex-optimisation",

      why: {
        before: "Optimisation meant running a local search and hoping. Gradient " +
          "descent finds *a* minimum, and whether it is *the* minimum was " +
          "unknowable — you could always be in a local trough.",
        problem: "That uncertainty is expensive. You cannot tell whether more " +
          "compute would help, whether a different initialisation would find " +
          "something better, or whether you have actually solved the problem.",
        shift: "Identify the class of problems where **local optimality implies " +
          "global optimality**. If the objective is convex — shaped like a bowl " +
          "— and the feasible set is convex, then any point where you cannot " +
          "improve locally is *the* answer. The dividing line in optimisation " +
          "is not linear against nonlinear; it is **convex against non-convex**."
      },

      num: {
        t: "The convex hierarchy",
        h: ["Class", "Example problem", "Solvable"],
        r: [
          ["Linear programming (LP)", "resource allocation", "**very fast**"],
          ["Quadratic programming (QP)", "**SVM, portfolio optimisation**", "fast"],
          ["Second-order cone (SOCP)", "robust least squares", "fast"],
          ["Semidefinite (SDP)", "relaxations, control", "slower"],
          ["**Non-convex**", "**neural networks**", "**local minima only**"]
        ],
        n: "Recognising convexity is the practical skill, and the useful " +
          "shortcut is composition rules rather than checking the Hessian: " +
          "**non-negative sums of convex functions are convex**, a convex " +
          "function of an affine function is convex, and pointwise maxima are " +
          "convex. That is enough to certify most objectives you meet. It " +
          "explains why `L1` and `L2` regularisation preserve convexity while " +
          "`L0` does not, and why logistic regression is convex while a neural " +
          "network is not. Deep learning is emphatically non-convex — and " +
          "works anyway, because in very high dimensions most critical points " +
          "are **saddle points** rather than poor local minima, and the many " +
          "minima that exist tend to have similar loss."
      },

      miss: [
        {
          w: "Convex means the function has a single minimum.",
          r: "It means every **local** minimum is **global**. A convex function " +
            "can have a flat region containing infinitely many minimisers — all " +
            "equally optimal. *Strictly* convex is the stronger condition that " +
            "gives a unique minimiser."
        },
        {
          w: "Non-convex problems cannot be solved.",
          r: "They cannot be solved with a **guarantee**. Deep learning is " +
            "non-convex and works well in practice; many non-convex problems " +
            "have good heuristics or convex relaxations. What you lose is the " +
            "certificate that you have finished."
        },
        {
          w: "Convexity is only relevant to classical optimisation, not ML.",
          r: "Linear and logistic regression, SVMs, LASSO and ridge are all " +
            "convex — which is why they are reproducible and have no " +
            "initialisation sensitivity. It also explains why **convex " +
            "relaxation** is such a common technique: replace an intractable " +
            "problem with a convex one that bounds it."
        },
        {
          w: "If gradient descent converges, the problem must be convex " +
            "enough.",
          r: "Convergence says only that the gradient became small — you may be " +
            "at a saddle point, a poor local minimum, or a plateau. **Only " +
            "convexity licences the conclusion that you have found the global " +
            "optimum.** Everything else is an empirical result."
        }
      ],

      trade: {
        buys: [
          "A certificate that the answer found is the answer.",
          "Reliable, well-understood solvers with predictable behaviour.",
          "No initialisation sensitivity or restart strategies.",
          "Duality gives bounds and sensitivity analysis for free."
        ],
        costs: [
          "Many real problems are simply not convex.",
          "Forcing convexity can mean a weaker model.",
          "Large-scale convex problems can still be slow.",
          "Recognising convexity takes practice."
        ],
        avoid: [
          "The problem is genuinely non-convex and the flexibility is worth " +
            "more than the guarantee — as in deep learning.",
          "A convex relaxation would lose too much fidelity.",
          "The problem is combinatorial with discrete variables.",
          "A heuristic already gives good enough answers."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "markov-decision-process",

      why: {
        before: "Sequential decision problems were handled with hand-written " +
          "rules or search. Each domain got its own bespoke formulation.",
        problem: "Without a common formalism there is no shared theory — no " +
          "way to prove an algorithm converges, no way to compare approaches, " +
          "and every problem restarts from scratch.",
        shift: "Define the general structure: **states, actions, transition " +
          "probabilities, rewards, and a discount factor**. The **Markov " +
          "property** — the next state depends only on the current state and " +
          "action, not the history — is what makes it tractable, because you " +
          "need only remember where you are. Bellman's equations then " +
          "characterise the optimal policy, and every reinforcement learning " +
          "algorithm is a way of solving them."
      },

      num: {
        t: "The five components, and what each decides",
        h: ["Symbol", "Meaning", "Design consequence"],
        r: [
          ["S", "states", "**must satisfy the Markov property**"],
          ["A", "actions", "the agent's choices"],
          ["P(s'|s,a)", "transitions", "known → planning; unknown → **RL**"],
          ["R(s,a)", "reward", "**where misspecification bites**"],
          ["**γ**", "discount factor", "**effective horizon ≈ 1/(1−γ)**"]
        ],
        n: "**γ is the parameter people underestimate.** It sets an effective " +
          "planning horizon of roughly `1/(1−γ)` steps: γ=0.9 means ~10 steps, " +
          "γ=0.99 means ~100, γ=0.999 means ~1,000. Too low and the agent is " +
          "myopic; too high and learning becomes slow and high-variance. The " +
          "third row is the division that matters most: if `P` is **known**, " +
          "this is a *planning* problem solved by value or policy iteration; " +
          "if unknown, it is *reinforcement learning* and must be learned from " +
          "experience. And the reward row is where real projects fail — a " +
          "misspecified reward is optimised faithfully into behaviour nobody " +
          "wanted, which is **reward hacking**."
      },

      miss: [
        {
          w: "The Markov property means the environment has no memory.",
          r: "It means the **state** must contain everything relevant to the " +
            "future. If history matters, the fix is to **put it in the state** " +
            "— stacking recent frames, or including a summary. The property is " +
            "a constraint on your state design, not a claim about the world."
        },
        {
          w: "MDPs require knowing the transition probabilities.",
          r: "That distinguishes **planning** from **learning**. Reinforcement " +
            "learning exists precisely because `P` is usually unknown — " +
            "model-free methods like Q-learning never estimate it at all, and " +
            "learn action values directly from experience."
        },
        {
          w: "The discount factor is a technical detail for convergence.",
          r: "It **defines what the agent cares about**. It is a modelling " +
            "choice encoding how much the future matters, and changing it " +
            "changes the optimal policy. It also happens to guarantee the value " +
            "series converges, which is a convenience rather than the purpose."
        },
        {
          w: "Real problems are MDPs, so RL applies directly.",
          r: "Most real problems are **partially observable** — you see an " +
            "observation, not the state. That is a **POMDP**, which is " +
            "dramatically harder: optimal policies need belief states over " +
            "possible worlds. In practice people approximate by stacking " +
            "observations or using a recurrent network, and call it an MDP."
        }
      ],

      trade: {
        buys: [
          "One formalism covering an enormous class of sequential problems.",
          "Bellman's equations give a principled characterisation of " +
            "optimality.",
          "Convergence guarantees for tabular methods.",
          "Separates planning from learning cleanly."
        ],
        costs: [
          "The Markov property forces state design that may be awkward.",
          "State and action spaces explode combinatorially.",
          "Reward specification is genuinely hard and failure is subtle.",
          "Real problems are usually partially observable."
        ],
        avoid: [
          "The problem is one-shot with no sequence — plain supervised " +
            "learning.",
          "You cannot define a reward that captures what you want.",
          "It is partially observable and you need the real POMDP treatment.",
          "Supervised learning on demonstrations would work — it usually needs " +
            "far less data."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "monte-carlo-method",

      why: {
        before: "Computing an integral, an expectation or a probability meant " +
          "finding a closed form or using deterministic numerical quadrature — " +
          "dividing the domain into a grid and summing.",
        problem: "Quadrature **dies in high dimensions**. A grid with 10 points " +
          "per axis needs `10^d` evaluations — 10 billion in ten dimensions, " +
          "and impossible in a hundred. Yet high-dimensional integrals are " +
          "exactly what Bayesian inference, statistical physics and finance " +
          "require.",
        shift: "Sample randomly instead of systematically. The error of a Monte " +
          "Carlo estimate is `O(1/√n)` **regardless of dimension** — the one " +
          "numerical method whose convergence rate does not degrade as " +
          "dimensions grow. It buys dimension-independence at the cost of a " +
          "slow rate."
      },

      num: {
        t: "Convergence: 1/√n is unforgiving",
        h: ["Samples", "Relative error", "To improve 10×"],
        r: [
          ["100", "~10%", "—"],
          ["10,000", "~1%", "**100× more samples**"],
          ["1,000,000", "~0.1%", "**100× more again**"],
          ["Quadrature in d dims", "grid `10^d`", "**infeasible past d≈6**"]
        ],
        n: "**Each extra decimal digit costs 100× the samples.** That is the " +
          "central limitation, and it is why variance reduction techniques — " +
          "importance sampling, control variates, antithetic variates — matter " +
          "so much: they reduce the constant in front of `1/√n`, which is the " +
          "only lever available since the rate itself is fixed. The other " +
          "essential distinction is between plain Monte Carlo, which needs " +
          "**independent samples from the target distribution**, and " +
          "**MCMC** (Metropolis-Hastings, HMC), which constructs a Markov " +
          "chain whose stationary distribution is the target — used when you " +
          "can evaluate the density up to a constant but cannot sample from it " +
          "directly, which is the normal situation in Bayesian inference."
      },

      miss: [
        {
          w: "More samples always give a proportionally better answer.",
          r: "Error falls as `1/√n`, not `1/n`. **Quadrupling samples halves " +
            "the error.** Going from 1% to 0.1% requires 100× the computation. " +
            "Budgeting Monte Carlo work without this in mind leads to badly " +
            "wrong estimates of how long something will take."
        },
        {
          w: "Monte Carlo is inefficient because it is random.",
          r: "In **high dimensions it is the only feasible method** — its " +
            "dimension-independence is a decisive advantage over any grid. " +
            "It is inefficient in one or two dimensions, where quadrature " +
            "converges far faster."
        },
        {
          w: "MCMC samples are independent draws from the target.",
          r: "They are **correlated** by construction — each depends on the " +
            "last. Effective sample size is much smaller than the chain length, " +
            "which is why you monitor autocorrelation, discard burn-in, and " +
            "check convergence diagnostics like R-hat. Treating MCMC output as " +
            "independent overstates your precision considerably."
        },
        {
          w: "The random number generator does not matter much.",
          r: "It matters. Poor generators with short periods or lattice " +
            "structure produce correlated samples and biased results, and this " +
            "has caused real errors in published physics simulations. " +
            "**Quasi-Monte Carlo** goes further and deliberately uses " +
            "low-discrepancy sequences, achieving nearly `1/n` in moderate " +
            "dimensions."
        }
      ],

      trade: {
        buys: [
          "Convergence rate independent of dimension.",
          "Works where no closed form exists.",
          "Trivially parallel — samples are independent.",
          "Simple to implement and to reason about.",
          "Gives an error estimate alongside the answer."
        ],
        costs: [
          "`1/√n` convergence is slow — each digit costs 100×.",
          "Results are stochastic and not reproducible without a fixed seed.",
          "MCMC needs convergence diagnostics and burn-in.",
          "Rare-event probabilities need importance sampling to be feasible."
        ],
        avoid: [
          "A closed form exists — use it.",
          "The problem is low-dimensional — quadrature converges much faster.",
          "You need a deterministic, reproducible answer.",
          "High precision is required — the sample cost becomes prohibitive.",
          "The event is very rare and you have not applied importance " +
            "sampling."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "sqrt-decomposition",

      why: {
        before: "Range queries with updates need a **segment tree** " +
          "(`O(log n)`, 4n memory, sixty lines) or a **Fenwick tree** " +
          "(`O(log n)`, invertible operations only).",
        problem: "Segment trees are a lot of intricate code for a competitive " +
          "programming session, and Fenwick trees do not handle minimum, " +
          "maximum or arbitrary merges. Sometimes you want something you can " +
          "write correctly in three minutes.",
        shift: "Split the array into blocks of about **√n**. Precompute an " +
          "aggregate per block. A range query then touches at most **two " +
          "partial blocks** (√n elements each) and **√n whole blocks** — so " +
          "`O(√n)` either way, and the balance is why √n is the right block " +
          "size."
      },

      num: {
        t: "Range structures compared",
        h: ["Structure", "Query", "Update", "Lines", "Generality"],
        r: [
          ["Prefix sums", "O(1)", "O(n)", "~3", "static, invertible"],
          ["Fenwick", "O(log n)", "O(log n)", "~10", "invertible only"],
          ["Segment tree", "O(log n)", "O(log n)", "~60", "**any associative**"],
          ["**Sqrt decomposition**", "**O(√n)**", "**O(1)**", "**~20**", "**anything**"]
        ],
        n: "At n = 10⁶, `√n` is **1,000** against `log n` at **20** — fifty " +
          "times slower per query, which matters when queries are many. Its " +
          "case is the last two columns: it is short enough to write from " +
          "memory under pressure, and it handles **operations a segment tree " +
          "struggles with** — *count elements greater than x in this range*, " +
          "for instance, by keeping each block **sorted** and binary searching " +
          "within it. That flexibility is the real argument. The offline " +
          "variant, **Mo's algorithm**, sorts queries by block and moves " +
          "pointers incrementally for `O((n+q)√n)` total, which solves problems " +
          "no online structure handles cleanly."
      },

      miss: [
        {
          w: "Sqrt decomposition is a worse segment tree.",
          r: "It is asymptotically worse and **more general and far shorter**. " +
            "Queries a segment tree cannot answer easily — order statistics " +
            "within a range, counting values above a threshold — are natural " +
            "here by keeping blocks sorted."
        },
        {
          w: "The block size must be exactly √n.",
          r: "√n balances the two halves of the query cost, and the optimum " +
            "depends on the relative cost of block operations against element " +
            "operations. Tuning it — often to a power of two for cheap " +
            "division — can measurably help. It is a starting point, not a " +
            "requirement."
        },
        {
          w: "It only works for sums.",
          r: "It works for **anything you can aggregate per block**: sums, " +
            "minima, maxima, sorted lists, frequency counts, even small hash " +
            "sets. This is precisely where it beats a Fenwick tree, which " +
            "requires invertibility."
        },
        {
          w: "Range updates need lazy propagation like a segment tree.",
          r: "They are much simpler here: apply a **block-level lazy value** " +
            "to fully covered blocks and update partial blocks element by " +
            "element. Roughly five lines, against segment tree lazy " +
            "propagation which is genuinely hard to get right."
        }
      ],

      trade: {
        buys: [
          "About twenty lines — writable correctly under pressure.",
          "Handles operations segment trees cannot express easily.",
          "`O(1)` point updates.",
          "Range updates without complex lazy propagation.",
          "Only `n` extra memory."
        ],
        costs: [
          "`O(√n)` is much slower than `O(log n)` at scale.",
          "Block size may need tuning.",
          "Two code paths — partial blocks and whole blocks.",
          "Not competitive when query volume is very high."
        ],
        avoid: [
          "Query volume is high and `O(log n)` matters — segment or Fenwick " +
            "tree.",
          "The array is static — prefix sums or a sparse table.",
          "You need range sums with point updates — **Fenwick** is shorter and " +
            "faster.",
          "n is large enough that √n becomes genuinely slow."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "state-machine-dp",

      why: {
        before: "Standard dynamic programming indexes states by **position**: " +
          "`dp[i]` is the best answer considering the first `i` elements.",
        problem: "That is insufficient when the answer depends on a **mode** " +
          "you are in. *Best profit from stock prices with at most one holding " +
          "at a time* cannot be answered by position alone — the best action " +
          "at day `i` depends entirely on whether you currently hold stock, and " +
          "one number cannot represent both situations.",
        shift: "Add a dimension for the mode: `dp[i][state]`. The transitions " +
          "become a **finite state machine** — from *holding* you can sell " +
          "(→ not holding) or wait (→ holding); from *not holding* you can buy " +
          "or wait. Draw the machine and the recurrence writes itself."
      },

      num: {
        t: "The stock problem family, by state count",
        h: ["Variant", "States", "Meaning"],
        r: [
          ["One transaction", "2", "held / not held"],
          ["Unlimited transactions", "2", "held / not held"],
          ["**With cooldown**", "**3**", "held / sold-today / free"],
          ["With a fee", "2", "fee applied on transition"],
          ["At most k transactions", "**2k**", "held/not held per transaction"]
        ],
        n: "The **cooldown** row shows the pattern's power: adding a rule that " +
          "you cannot buy the day after selling seems to require remembering " +
          "history, and it does not — it requires **one more state**. " +
          "*Sold-today* is distinct from *free to buy*, and the transition from " +
          "sold-today goes only to free. That is the whole method: whenever a " +
          "constraint seems to need memory of the past, ask whether it can be " +
          "encoded as a mode instead. The `k`-transaction variant also " +
          "illustrates the cost — states multiply with the constraint, and " +
          "`dp[i][k][2]` for large `k` becomes memory-bound, at which point you " +
          "keep only the previous row."
      },

      miss: [
        {
          w: "State machine DP is a distinct algorithm to learn.",
          r: "It is ordinary DP with a **state dimension added**. Recognising " +
            "that a problem has modes is the skill; the mechanics are the same " +
            "recurrence you already know. Naming it helps you spot the pattern, " +
            "not execute it."
        },
        {
          w: "More states always make the problem solvable.",
          r: "States multiply the table size and the transition count. If the " +
            "mode space is exponential — every subset of something — you have a " +
            "**bitmask DP** with its `n ≈ 20` ceiling, not a state machine. " +
            "The technique works when modes are *few*."
        },
        {
          w: "You need to store the full DP table.",
          r: "Transitions usually depend only on the **previous position**, so " +
            "a handful of variables suffices — the stock problems reduce to " +
            "two or three rolling variables. This drops memory from `O(n·s)` to " +
            "`O(s)` and is nearly always worth doing."
        },
        {
          w: "The states must be given in the problem statement.",
          r: "Identifying them is the actual work. The reliable question is: " +
            "*what do I need to know, besides my position, to decide the next " +
            "move?* If the answer is a small set of situations, those are your " +
            "states."
        }
      ],

      trade: {
        buys: [
          "Handles constraints that position alone cannot express.",
          "Drawing the machine makes the recurrence mechanical.",
          "Extends naturally as rules are added — one more state.",
          "Usually reduces to `O(1)` memory with rolling variables."
        ],
        costs: [
          "Table size multiplies by the state count.",
          "Identifying the right states requires insight.",
          "Missing a state gives silently wrong answers.",
          "Explodes if the mode space is combinatorial."
        ],
        avoid: [
          "Position alone determines the answer — plain DP.",
          "The mode space is exponential — that is bitmask DP with its own " +
            "limits.",
          "A greedy rule is provably correct, which is far cheaper.",
          "The constraint is better expressed as a graph shortest path."
        ]
      }
    }

  ]);
})(window.TD = window.TD || {});
