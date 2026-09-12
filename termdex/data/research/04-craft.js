/* Research Hub — the craft layer.

   The existing files cover taxonomy, venues, landmark papers and templates.
   This adds the parts a first-time author actually gets wrong: how to read a
   paper without drowning, what each section is structurally for, and the
   reasons papers are rejected before anyone reads the method. */
(function (TD) {
  "use strict";

  /* Keegan McCallum's three-pass method, which is the single most useful
     thing to hand someone who has just been told to "read the literature". */
  TD.readingPasses = [
    {
      pass: 1,
      name: "The scan",
      time: "5–10 minutes",
      goal: "Decide whether to keep reading.",
      does: [
        "Title, abstract, introduction.",
        "Every section and subsection heading — nothing else.",
        "The conclusions.",
        "Glance at the references for names you recognise."
      ],
      answers: [
        "What category of paper is this?",
        "What is it related to, and which theory does it rest on?",
        "Does it appear correct?",
        "What are its contributions, as the authors state them?"
      ],
      outcome: "Most papers stop here, and that is correct. Reading everything you open is how a literature review takes six months."
    },
    {
      pass: 2,
      name: "The grasp",
      time: "About an hour",
      goal: "Understand the content well enough to summarise it to someone else.",
      does: [
        "Read the whole paper, but skip proofs and derivations.",
        "Look carefully at every figure, graph and table.",
        "Check whether axes are labelled, whether error bars are present, and whether the baselines are fair.",
        "Mark references you have not read."
      ],
      answers: [
        "What is the mechanism, in your own words?",
        "What is the evidence, and is it convincing?",
        "What did they compare against, and was that comparison fair?"
      ],
      outcome: "You can now summarise the paper with supporting evidence. That is enough for most citations."
    },
    {
      pass: 3,
      name: "The reconstruction",
      time: "Four to five hours",
      goal: "Be able to reproduce it.",
      does: [
        "Virtually re-implement the paper: make the same assumptions and re-derive the result.",
        "Compare your reconstruction against the actual paper and note every divergence.",
        "Challenge every assumption, not just the ones flagged.",
        "Think about how you would have presented the idea."
      ],
      answers: [
        "Which assumptions are load-bearing, and which are decoration?",
        "What are the hidden failure modes the paper does not mention?",
        "What would you do differently?"
      ],
      outcome: "Reserve this for papers you are building on or reviewing. It is expensive and it is the only way to genuinely know a paper."
    }
  ];

  /* The structural job of each section, rendered as a blueprint so the
     dependencies between sections are visible rather than implied. */
  TD.paperAnatomy = {
    title: "What each section is structurally for",
    alt: "Diagram of a research paper's sections and how they depend on each other",
    nodes: [
      { id: "t", label: "Title", sub: "the claim, findable", kind: "client", col: 0, row: 0 },
      { id: "a", label: "Abstract", sub: "the whole paper in 5 sentences", kind: "client", col: 1, row: 0 },
      { id: "i", label: "Introduction", sub: "gap → insight → contributions", kind: "service", col: 2, row: 0 },
      { id: "r", label: "Related work", sub: "why yours is not theirs", kind: "service", col: 3, row: 0 },
      { id: "m", label: "Method", sub: "reproducible mechanism", kind: "model", col: 1, row: 1, span: 2 },
      { id: "e", label: "Experiments", sub: "fair baselines, same budget", kind: "service", col: 0, row: 2 },
      { id: "ab", label: "Ablations", sub: "isolate every claimed gain", kind: "service", col: 1, row: 2 },
      { id: "l", label: "Limitations", sub: "stated by you, not a reviewer", kind: "note", col: 2, row: 2 },
      { id: "c", label: "Conclusion", sub: "what changed, and what is next", kind: "client", col: 3, row: 2 }
    ],
    edges: [
      { from: "t", to: "a" },
      { from: "a", to: "i" },
      { from: "i", to: "r" },
      { from: "i", to: "m", label: "promises" },
      { from: "r", to: "m", label: "positions", dashed: true },
      { from: "m", to: "e", label: "must be testable" },
      { from: "e", to: "ab" },
      { from: "ab", to: "l" },
      { from: "l", to: "c" }
    ],
    groups: [{ label: "The claim", cols: [0, 3], rows: [0, 0] }],
    note: "The contributions listed in the introduction must map **one to one** onto experiments. A contribution with no experiment is a reviewer's first question, and an experiment supporting no contribution is padding."
  };

  /* The peer-review lifecycle as a flow rather than a numbered list — the
     loops matter, and a list cannot show them. */
  TD.reviewFlow = {
    title: "From submission to camera-ready",
    alt: "Diagram of the peer review lifecycle",
    nodes: [
      { id: "sub", label: "Submission", sub: "anonymised PDF + arXiv", kind: "client", col: 0, row: 1 },
      { id: "desk", label: "Desk screening", sub: "format · scope · page limit", kind: "service", col: 1, row: 1 },
      { id: "rej1", label: "Desk reject", sub: "no reviewer ever reads it", kind: "note", col: 1, row: 0 },
      { id: "ac", label: "Area chair", sub: "assigns 3–4 reviewers", kind: "service", col: 2, row: 1 },
      { id: "rev", label: "Review period", sub: "scores + written critique", kind: "worker", col: 3, row: 1 },
      { id: "reb", label: "Author rebuttal", sub: "5–7 days, tightly bounded", kind: "client", col: 4, row: 2 },
      { id: "disc", label: "Reviewer discussion", sub: "scores can move either way", kind: "service", col: 4, row: 0 },
      { id: "dec", label: "Decision", sub: "oral · poster · reject", kind: "service", col: 5, row: 1 },
      { id: "cam", label: "Camera-ready", sub: "+ artifact evaluation", kind: "store", col: 6, row: 1 }
    ],
    edges: [
      { from: "sub", to: "desk" },
      { from: "desk", to: "rej1", label: "≈15–30%" },
      { from: "desk", to: "ac" },
      { from: "ac", to: "rev" },
      { from: "rev", to: "reb" },
      { from: "reb", to: "disc", label: "your one chance" },
      { from: "rev", to: "disc" },
      { from: "disc", to: "dec" },
      { from: "dec", to: "cam", label: "accept" }
    ],
    note: "The rebuttal is the only point where you can change the outcome. Reviewers rarely raise a score for politeness — they raise it for a **number you gave them that they asked for**."
  };

  /* Ordered by how often they actually happen, not by severity. */
  TD.rejectionReasons = [
    {
      reason: "The contribution is not clear",
      share: "very common",
      tell: "A reviewer cannot state your contribution in one sentence after reading the introduction.",
      fix: "End Section 1 with three explicit bullet points, each mapping to a section number."
    },
    {
      reason: "Unfair or missing baselines",
      share: "very common",
      tell: "Your method is tuned and the baseline is at default settings, or a recent obvious competitor is absent.",
      fix: "Give every baseline the same hyperparameter budget as your method, and say so explicitly."
    },
    {
      reason: "No ablations",
      share: "common",
      tell: "The paper proposes four components and reports one number.",
      fix: "One table, one row per component removed. Any component that does not earn its row should be cut from the paper."
    },
    {
      reason: "Evaluation does not match the claim",
      share: "common",
      tell: "You claim generality and evaluate on one dataset in one domain.",
      fix: "Either broaden the evaluation or narrow the claim. Narrowing is faster and reviewers respect it."
    },
    {
      reason: "Not reproducible",
      share: "common",
      tell: "No code, no seeds, no hyperparameters, no compute budget stated.",
      fix: "A repository with a single command that reproduces the headline table. This also wins artifact badges."
    },
    {
      reason: "Related work is thin or unfair",
      share: "common",
      tell: "A closely related paper from last year is uncited, or dismissed in half a sentence.",
      fix: "Cite it, describe it accurately, and state the specific difference. Reviewers are often the authors of what you dismissed."
    },
    {
      reason: "Formatting and length violations",
      share: "avoidable",
      tell: "Over the page limit, wrong template, de-anonymised, references malformed.",
      fix: "This is a desk reject for nothing. Check the checklist twice — it costs an hour and a whole cycle."
    },
    {
      reason: "Overclaiming",
      share: "common",
      tell: "'Solves', 'first ever', 'human-level' — with a 2% improvement on one benchmark.",
      fix: "State exactly what improved, by how much, under what conditions. Precision reads as confidence; hype reads as insecurity."
    }
  ];

  /* Numbers people ask for and then cannot find. */
  TD.venueFacts = [
    { k: "Typical desk-reject rate", v: "15–30%", note: "Before any review. Mostly formatting and scope." },
    { k: "Reviewers per paper", v: "3–4", note: "Plus an area chair who reads the discussion." },
    { k: "Rebuttal window", v: "5–7 days", note: "Fixed. Plan the experiments you might need in advance." },
    { k: "Submission to decision", v: "3–5 months", note: "Longer for journals; shorter for workshops." },
    { k: "Typical acceptance", v: "20–25%", note: "At a flagship venue. Workshops are far higher." }
  ];
})(window.TD = window.TD || {});
