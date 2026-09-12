/* Research Hub — Metadata, Taxonomy & Paper Anatomy */
(function (TD) {
  TD.researchMeta = {
    title: "Research Hub & Paper Writing Academy",
    tagline: "The complete engineering guide to understanding, writing, and publishing world-class scientific papers.",
    paperTypes: [
      {
        id: "systems",
        name: "Systems & Architecture Papers",
        short: "Systems",
        icon: "server",
        badge: "OSDI / SOSP Style",
        desc: "Presents a novel, working software or hardware system that solves scalability, throughput, latency, or fault-tolerance bottlenecks with measurable production benchmarks.",
        when: "You built a new database, distributed cache, container runtime, compiler, or kernel subsystem that outperforms existing baselines under heavy workloads.",
        keyElements: ["System Architecture Diagram", "Design Trade-Offs", "Detailed Implementation Details (Lines of Code, Concurrency)", "Rigorous Microbenchmarks & Macro-evaluations", "Failure Recovery Analysis"],
        example: "The Google File System (Ghemawat et al., SOSP 2003)"
      },
      {
        id: "empirical",
        name: "Empirical & Experimental ML Papers",
        short: "AI & ML",
        icon: "spark",
        badge: "NeurIPS / ICML Style",
        desc: "Proposes a novel neural architecture, loss function, optimizer, or training methodology validated through extensive empirical experiments against standardized benchmarks.",
        when: "You developed a new deep learning technique (e.g. attention mechanism, quantization method, RL algorithm) that achieves state-of-the-art accuracy or compute efficiency.",
        keyElements: ["Formal Mathematical Problem Formulation", "Theoretical Intuition", "Standard Benchmark Comparisons (GLUE, ImageNet)", "Ablation Studies (isolating each component's gain)", "Error & Failure Analysis"],
        example: "Attention Is All You Need (Vaswani et al., NeurIPS 2017)"
      },
      {
        id: "theoretical",
        name: "Theoretical & Algorithmic Papers",
        short: "Algorithms",
        icon: "cpu",
        badge: "STOC / FOCS / PODC Style",
        desc: "Formally proves mathematical properties, time/space complexity bounds, impossibility theorems, or exact approximation guarantees for computational algorithms.",
        when: "You proved a new theorem, discovered a faster algorithmic bound (e.g. $O(N \\log N)$ vs $O(N^2)$), or solved an open distributed consensus challenge.",
        keyElements: ["Rigorous Definitions & Lemmas", "Inductive or Reductive Proofs", "Asymptotic Big-O Complexity Analysis", "Worst-Case & Average-Case Guarantees"],
        example: "In Search of an Understandable Consensus Algorithm (Raft) (Ongaro & Ousterhout, USENIX ATC 2014)"
      },
      {
        id: "benchmark",
        name: "Dataset & Benchmark Papers",
        short: "Benchmarks",
        icon: "pipeline",
        badge: "NeurIPS Datasets Style",
        desc: "Introduces a standardized, high-quality benchmark dataset or evaluation harness that tests an unsolved challenge in AI, security, or distributed systems.",
        when: "Existing research is held back because there is no standardized, reproducible dataset to compare competing models or systems.",
        keyElements: ["Data Collection & Cleaning Methodology", "Annotation & Inter-Annotator Agreement", "Ethical & PII Governance", "Baseline Model Evaluations", "Public Hosting & Maintenance Plan"],
        example: "SWE-bench: Can Language Models Resolve Real-World GitHub Issues? (Jimenez et al., ICLR 2024)"
      },
      {
        id: "survey",
        name: "Comprehensive Survey & Meta-Analysis",
        short: "Surveys",
        icon: "book",
        badge: "ACM Computing Surveys Style",
        desc: "Synthesizes hundreds of papers across a rapidly evolving subfield, creating a unified taxonomy, comparing trade-offs, and charting open future research directions.",
        when: "A new research area has exploded with conflicting terminology and unorganized papers (e.g. Retrieval-Augmented Generation, LLM Multi-Agent Systems).",
        keyElements: ["Systematic Taxonomy Hierarchy", "Comparative Dimension Matrix Tables", "Chronological Milestone Evolution", "Critical Open Challenges & Unsolved Problems"],
        example: "A Survey on Large Language Models (Zhao et al., 2023)"
      },
      {
        id: "security",
        name: "Security, Attack & Measurement Papers",
        short: "Security",
        icon: "shield",
        badge: "IEEE S&P / USENIX Sec Style",
        desc: "Discloses a novel zero-day attack vector, cryptographic vulnerability, or empirical measurement of internet-scale security infrastructure.",
        when: "You discovered a new class of hardware vulnerabilities (e.g. Spectre/Meltdown), software side-channels, or measured global DNS hijacking.",
        keyElements: ["Threat Model Definition", "Vulnerability Mechanism & Proof-of-Concept Exploit", "Empirical Blast Radius Measurement", "Responsible Disclosure Timeline", "Countermeasures & Mitigations"],
        example: "Spectre Attacks: Exploiting Speculative Execution (Kocher et al., IEEE S&P 2019)"
      }
    ],

    teamRoles: [
      {
        role: "First Author (Lead Researcher / Builder)",
        size: "1–2 Engineers",
        desc: "Conceives the primary hypothesis, implements the core code/system, conducts the experiments, writes 70%+ of the draft text, and handles peer-review rebuttals.",
        responsibility: "Codebase execution, experimental figures, initial full paper draft."
      },
      {
        role: "Co-Authors (Collaborators)",
        size: "1–3 Engineers",
        desc: "Contributes specific components: runs comparative baselines, conducts ablation tests, writes specific sections (e.g. Related Work, Math Proofs), and reviews drafts.",
        responsibility: "Baseline experiments, mathematical formalisms, proofreading."
      },
      {
        role: "Senior Author / Principal Investigator (PI / Advisor)",
        size: "1 Senior Researcher / Professor",
        desc: "Provides overarching scientific direction, ensures methodological rigor, funds compute/hardware, refines the paper's narrative framing, and champions the work.",
        responsibility: "High-level framing, narrative polish, publication venue selection."
      }
    ],

    reviewProcess: [
      {
        step: 1,
        title: "Paper Submission & ArXiv Preprint",
        desc: "Submit anonymous PDF (for Double-Blind conferences) before the hard deadline. Simultaneously post preprint to ArXiv to establish intellectual priority."
      },
      {
        step: 2,
        title: "Desk Screening & Area Chair Assignment",
        desc: "Program Chairs (PC) check for formatting, page limits, and dual-submission violations. An Area Chair assigns 3–4 expert peer reviewers."
      },
      {
        step: 3,
        title: "Peer Review Period (Single vs Double Blind)",
        desc: "Reviewers independently evaluate novelty, soundness, evaluation rigor, clarity, and ethical impact, assigning numerical scores (1–10) and detailed critiques."
      },
      {
        step: 4,
        title: "Author Rebuttal & Response Window",
        desc: "Authors receive initial reviews and have 5–7 days to write a concise, respectful response addressing misunderstandings, clarifying math, and providing missing ablation numbers."
      },
      {
        step: 5,
        title: "Reviewer Discussion & Final Decision",
        desc: "Reviewers debate amongst themselves and update scores. Area Chairs issue final decisions: Accept (Oral/Spotlight/Poster), Minor Revision, or Reject."
      },
      {
        step: 6,
        title: "Camera-Ready Polish & Code Artifact Release",
        desc: "Authors incorporate reviewer feedback into the final camera-ready version, submit artifact evaluation badges (reproducible code/Docker), and present at the conference."
      }
    ]
  };
})(window.TD = window.TD || {});
