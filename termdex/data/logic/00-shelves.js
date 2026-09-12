/* Logic Vault — shelf definitions.

   A shelf is a broad area of recall. Order here is the order of the index,
   and it runs from the things every engineer needs regardless of speciality
   down to the ones specific to AI work.

   The rule for what belongs in this section at all: it must be something you
   are expected to *have*, not something you are expected to be able to look
   up. If reaching for a search engine mid-conversation would be embarrassing
   or too slow, it belongs here. */

TD.defineLogicShelves([

  {
    id: "complexity",
    name: "Complexity and Cost",
    icon: "gauge",
    col: "#f59e0b",
    deck: "What things cost, and the numbers you should never have to derive.",
    desc: "Big-O for every structure you will touch, the growth table, and the latency numbers that decide architectures. This is the shelf that turns 'it feels slow' into 'it is quadratic and here is why'."
  },

  {
    id: "structures",
    name: "Data Structures",
    icon: "layers",
    col: "#06b6d4",
    deck: "Which structure, and the one sentence that decides it.",
    desc: "Array, hash map, tree, heap, graph, trie. Not how to implement them — when to reach for each, what it costs, and the trade-off you accept by choosing it."
  },

  {
    id: "patterns",
    name: "Algorithmic Patterns",
    icon: "flow",
    col: "#8b5cf6",
    deck: "The recognition rules that turn a problem into a known shape.",
    desc: "Sliding window, two pointers, binary search, BFS/DFS, dynamic programming. Each one has a trigger phrase — learn the trigger and the solution follows."
  },

  {
    id: "systems",
    name: "Systems and Reliability",
    icon: "server",
    col: "#10b981",
    deck: "How distributed things fail, and the vocabulary for saying so.",
    desc: "CAP, consistency models, idempotency, backpressure, the failure modes that turn one slow service into an outage. The logic that makes a design review productive."
  },

  {
    id: "data",
    name: "Data and Databases",
    icon: "database",
    col: "#f43f5e",
    deck: "ACID, indexes, normalisation and the query that quietly does a full scan.",
    desc: "What a transaction guarantees, what an index actually is, and why the same query is instant on one table and fatal on another."
  },

  {
    id: "math",
    name: "Maths You Actually Use",
    icon: "sigma",
    col: "#0ea5e9",
    deck: "The probability, linear algebra and statistics that appear in real work.",
    desc: "Bayes, expectation, log rules, dot products, matrix shapes, distributions. Enough to read a paper, size a model, and not be fooled by a metric."
  },

  {
    id: "ml",
    name: "Machine Learning Core",
    icon: "brain",
    col: "#a855f7",
    deck: "Bias-variance, the metrics, and why your model looks better than it is.",
    desc: "The logic underneath every model: what overfitting is mechanically, which metric to quote for which problem, how leakage happens, and what a split is really for."
  },

  {
    id: "dl",
    name: "Deep Learning",
    icon: "cpu",
    col: "#ec4899",
    deck: "Gradients, attention, normalisation and the shapes that must line up.",
    desc: "Backpropagation as a rule rather than a mystery, why transformers won, what each normalisation layer fixes, and the arithmetic of memory on a GPU."
  },

  {
    id: "aieng",
    name: "The AI Engineer's Vault",
    icon: "sparkles",
    col: "#6366f1",
    deck: "Tokens, context, RAG, evals, agents and cost — the working set of the job.",
    desc: "Everything specific to building with language models: what a token costs, why retrieval beats fine-tuning most of the time, how to evaluate something non-deterministic, and where agents go wrong. This is the shelf for the role you are preparing for."
  },

  {
    id: "craft",
    name: "Engineering Judgement",
    icon: "compass",
    col: "#64748b",
    deck: "The rules seniors apply without noticing they are applying them.",
    desc: "Naming, error handling, when to abstract, what to test, how to read an unfamiliar codebase, and the estimates that keep you honest. The part that separates working code from engineering."
  }

]);
