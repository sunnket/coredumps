/* Research Hub — Paper Writing Playbook, LaTeX Templates & Guides */
(function (TD) {
  TD.writingGuide = {
    titleFormulas: [
      {
        pattern: "[Catchy Name]: [Action-Oriented System/Method Description]",
        example: "FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness",
        why: "Provides instant name recognition while clearly declaring the exact technical mechanism."
      },
      {
        pattern: "[Bold Hypothesis / Question] for [Problem Domain]",
        example: "Attention Is All You Need",
        why: "Memorable, provocative, and conveys total confidence in an architectural paradigm shift."
      },
      {
        pattern: "[Core Technique] for [Target Application] with [Key Performance Bound]",
        example: "Deep Residual Learning for Image Recognition",
        why: "Direct, precise, and highly indexable by search engines and academic citation algorithms."
      }
    ],

    abstractFormula: [
      {
        sentence: "1. Context & Motivation",
        desc: "State the broader real-world importance and current state of the field (1 sentence).",
        example: "Large language models have achieved extraordinary performance on reasoning tasks, but their autoregressive decoding is severely memory-bandwidth bound."
      },
      {
        sentence: "2. The Critical Problem / Gap",
        desc: "Explain exactly why existing approaches fail or hit fundamental scaling limits (1 sentence).",
        example: "Existing exact attention implementations scale quadratically $O(N^2)$ with respect to High-Bandwidth Memory (HBM) transfers, restricting practical context lengths."
      },
      {
        sentence: "3. Our Proposed Solution / Novel Contribution",
        desc: "Introduce your method/system by name and state its core technical insight (1–2 sentences).",
        example: "We propose FlashAttention, an IO-aware exact attention algorithm that leverages GPU SRAM tiling and online softmax to eliminate redundant memory roundtrips without approximation."
      },
      {
        sentence: "4. Quantitative Empirical Results",
        desc: "Provide concrete, verifiable benchmark numbers comparing against state-of-the-art baselines (1 sentence).",
        example: "FlashAttention trains Transformers 3× faster than standard attention and unlocks 10× longer context windows with zero loss in mathematical accuracy."
      },
      {
        sentence: "5. Broader Impact & Open Availability",
        desc: "Highlight broader implications and confirm open-source artifact release (1 sentence).",
        example: "Our implementation is fully open-sourced, providing the foundational speedup for next-generation frontier foundation models."
      }
    ],

    /* The LaTeX template described as structure rather than shipped as a wall
       of source. A first-time author needs to know what each block of the
       document is *for* and roughly how long it should be; the raw .tex stays
       one disclosure click away for the reader who only wants to paste it
       into Overleaf. */
    latexKit: {
      docclass: "\\documentclass[10pt,twocolumn,letterpaper]{article}",
      classNote: "This line survives only until you download the venue's own style file. NeurIPS, ACM and IEEE each ship one and it overrides everything here. A submission in the wrong template is noticed before anything else in it.",

      preamble: [
        { pkg: "microtype", why: "Sub-pixel spacing adjustments. Buys roughly half a page of room and costs one line." },
        { pkg: "amsmath · amssymb · amsthm", why: "Aligned equations, the full symbol set, and numbered theorem and proof environments." },
        { pkg: "graphicx", why: "Figure inclusion. Export figures as PDF, never PNG — vector text stays sharp when a reviewer zooms in." },
        { pkg: "booktabs", why: "toprule, midrule, bottomrule. No vertical rules: they are the clearest tell of a first submission." },
        { pkg: "algorithm · algpseudocode", why: "Floating pseudocode with numbered lines you can cross-reference from the prose." },
        { pkg: "hyperref · cleveref", why: "Clickable links, and cref writes “Figure 3” for you so a renumbered float never leaves stale text behind." },
        { pkg: "xcolor", why: "Colour for links — and for the todo notes you have to remember to strip before the deadline." }
      ],

      /* Ordered exactly as the sections appear in the compiled document, so
         this list and the page preview beside it read as the same object. */
      skeleton: [
        {
          part: "Title & authors",
          cmd: "\\title{} \\author{} \\maketitle",
          len: "≤ 15 words",
          what: "The claim, phrased to be findable. System name first, mechanism second.",
          watch: "Anonymise for double-blind venues via the class option, not by deleting the block."
        },
        {
          part: "Abstract",
          cmd: "\\begin{abstract}",
          len: "150–200 words",
          what: "The whole paper in five sentences: context, gap, method, one headline number, availability.",
          watch: "No citations and no cross-references. It is read standalone in the programme."
        },
        {
          part: "Introduction",
          cmd: "\\section{Introduction}",
          len: "1–1.5 columns",
          what: "Gap, then insight, then an explicit itemised list of contributions.",
          watch: "Every bullet must name the section that delivers it."
        },
        {
          part: "Related work",
          cmd: "\\section{Related Work}",
          len: "0.5–1 column",
          what: "Grouped by approach, not by author. Say what each family cannot do that you can.",
          watch: "A missing recent line of work reads as not knowing the field."
        },
        {
          part: "Method",
          cmd: "\\section{System Architecture}",
          len: "2–3 columns",
          what: "Enough that a competent reader could reimplement it. One architecture figure carries most of the load.",
          watch: "Float the figure to the top of a column with [t]; never set it inline."
        },
        {
          part: "Evaluation",
          cmd: "\\section{Evaluation}",
          len: "2–3 columns",
          what: "Open by stating the research questions, then answer them in order with one table or chart each.",
          watch: "A table that answers no stated question is padding, and reads that way."
        },
        {
          part: "Ablations",
          cmd: "\\section{Ablation Studies}",
          len: "0.5–1 column",
          what: "Disable one component at a time. This is where a reviewer decides whether the gains are real.",
          watch: "Skipping it is the fastest route to “gains are not attributed”."
        },
        {
          part: "Limitations & conclusion",
          cmd: "\\section{Conclusion}",
          len: "≈ 0.5 column",
          what: "What changed, what it cost, what is next — with the limits stated in your own words.",
          watch: "A limitation a reviewer finds that you did not name discredits everything else."
        },
        {
          part: "References",
          cmd: "\\bibliography{references}",
          len: "usually uncounted",
          what: "BibTeX with the venue's own style file. Most conferences exclude references from the page limit.",
          watch: "Confirm that rule for your venue specifically. It is not universal."
        }
      ]
    },

    /* The rebuttal rendered as the correspondence it actually is: what the
       reviewer said, what you say back, and why that particular reply is the
       one that moves a score. */
    rebuttalKit: {
      window: "5–7 days",
      budget: "500–800 words",
      audience: "Reviewers + area chair",

      opening: {
        note: "Thank them, then quote the phrases they already agreed on. You are reminding the area chair — who has not read your paper — that three specialists already liked something about it.",
        text: "We thank the reviewers for their thorough and constructive feedback. We are encouraged that reviewers found our problem formulation “timely and impactful” (R1, R3), the theoretical analysis “sound and rigorous” (R2), and the empirical benchmarks “convincing” (R1, R4)."
      },

      threads: [
        {
          who: "R1",
          kind: "Asked for an experiment",
          score: "5 → 6",
          q: "How does the system perform when memory is constrained below 4 GB?",
          a: "We ran new microbenchmarks at 2 GB and 4 GB ceilings. Under a 2 GB limit SystemName sustains 8.4M req/s — a 14% drop from peak — while Baseline A fails with OOM errors. The full memory-scaling curve will be added as Section 5.3.",
          move: "Answer with a number and the section it will live in. “We will investigate this in future work” scores nothing and costs you the reviewer."
        },
        {
          who: "R2",
          kind: "Found something unclear",
          score: "unchanged",
          q: "Clarification needed on the proof of Lemma 3.2 in Section 4.",
          a: "R2 is right that line 342 is ambiguous. The expectation is taken over the randomised hash seeds rather than over message arrival order. The step-by-step derivation is now explicit in Appendix B.",
          move: "Concede the ambiguity in one clause, then fix it. Arguing that a confused reviewer misread you has never once raised a score."
        },
        {
          who: "R3",
          kind: "Wants a missing baseline",
          score: "3 → 5",
          q: "No comparison against the recent [Smith et al., 2024] baseline.",
          a: "We implemented [Smith et al., 2024] in our testbed during the rebuttal period. SystemName reaches 2.1× lower tail latency, attributable to the lock-free buffer design. It is added to Table 2 with the citation.",
          move: "A missing baseline is at once the most fatal complaint and the most fixable one. Run it inside the window, even roughly, rather than explaining why you did not."
        }
      ],

      closing: "We will incorporate all textual clarifications, additional citations and new experimental tables into the camera-ready version.",

      rules: [
        {
          do: "Lead every reply with the change you made.",
          dont: "Opening with a paragraph of context before the reviewer reaches the answer."
        },
        {
          do: "Group by reviewer, and label every question.",
          dont: "One undifferentiated essay the area chair has to map back onto the reviews."
        },
        {
          do: "Answer the weakest score first, and at the greatest length.",
          dont: "Spending the word budget agreeing with the reviewer who already accepted."
        },
        {
          do: "Say “we have added” only when it is done, “we will add” when it is not.",
          dont: "Claiming an experiment exists that you have not actually run."
        },
        {
          do: "Concede one point that genuinely cannot be fixed.",
          dont: "Rebutting every reviewer on every point — it reads as defensiveness, not rigour."
        }
      ]
    },

    latexTemplate: `% =========================================================================
% Standard Peer-Reviewed CS Conference LaTeX Template (Overleaf / arXiv)
% Suitable for NeurIPS, ICML, ICLR, OSDI, SOSP, and IEEE Conferences
% =========================================================================
\\documentclass[10pt,twocolumn,letterpaper]{article}

% --- Core Packages ---
\\usepackage[utf8]{inputenc}
\\usepackage{amsmath,amssymb,amsfonts,amsthm} % Math symbols & theorems
\\usepackage{booktabs}                         % Publication-quality tables
\\usepackage{graphicx}                          % Figures and vector graphics
\\usepackage{microtype}                         % Sub-pixel typographical refinement
\\usepackage{xcolor}                            % Color palettes
\\usepackage{hyperref}                          % Clickable links
\\usepackage{algorithm}                         % Pseudocode algorithms
\\usepackage{algpseudocode}
\\usepackage{cite}                              % BibTeX citations
\\usepackage{cleveref}                          % Smart cross-referencing

% --- Hyperlink Styling ---
\\hypersetup{
    colorlinks=true,
    linkcolor=blue!70!black,
    citecolor=green!50!black,
    urlcolor=purple!70!black
}

% =========================================================================
% Title & Authors
% =========================================================================
\\title{\\textbf{SystemName: High-Throughput Distributed Architecture for Large-Scale Perception}}

\\author{
  \\textbf{Alex Chen}$^{1}$ \\quad \\textbf{Sarah Jenkins}$^{1}$ \\quad \\textbf{Marcus Vance}$^{2}$ \\quad \\textbf{Elena Rostova}$^{1}$ \\\\[4pt]
  $^{1}$Department of Computer Science, University / Lab \\\\
  $^{2}$AI Research Labs, San Francisco, CA \\\\
  \\texttt{\\{alex.chen, sjenkins\\}@university.edu} \\quad \\texttt{marcus@airesearch.org}
}

\\date{}

% =========================================================================
% Main Document
% =========================================================================
\\begin{document}
\\maketitle

% --- 1. Abstract ---
\\begin{abstract}
Autonomous perception pipelines require real-time processing of high-throughput sensor telemetry under strict sub-10ms latency deadlines. However, existing message queues and distributed stream processors introduce high serialization overhead and non-deterministic memory garbage collection pauses. In this paper, we propose \\textbf{SystemName}, a zero-copy distributed streaming architecture that combines kernel-level eBPF packet demultiplexing with lock-free ring buffers. We evaluate SystemName on a 100-node cluster under 10,000,000 requests per second. Empirical results demonstrate that SystemName reduces P99 tail latency by 4.2$\\times$ compared to Apache Kafka while consuming 65\\% less CPU memory bandwidth. Our codebase and benchmark harnesses are publicly available.
\\end{abstract}

% --- 2. Introduction ---
\\section{Introduction}
\\label{sec:intro}
Distributed stream processing constitutes the backbone of modern cloud infrastructure...
Our primary contributions in this work are:
\\begin{itemize}
    \\item We formalize the IO memory wall bottleneck in real-time message brokers.
    \\item We design and implement \\textbf{SystemName}, introducing a lock-free eBPF kernel pipeline.
    \\item We conduct extensive evaluations across 5 real-world workloads, showing a 4.2$\\times$ tail latency reduction.
\\end{itemize}

% --- 3. Related Work ---
\\section{Related Work}
\\label{sec:related}
Prior approaches to distributed streaming fall into two main paradigms: row-oriented log brokers \\cite{dean2004mapreduce} and in-memory caches \\cite{decandia2007dynamo}...

% --- 4. System Architecture & Methodology ---
\\section{System Architecture}
\\label{sec:system}
\\subsection{Overview & Threat Model}
SystemName operates across three distinct execution tiers...

\\begin{figure}[t]
    \\centering
    \\includegraphics[width=\\linewidth]{architecture_diagram.pdf}
    \\caption{\\textbf{System Architecture of SystemName.} Data flows from raw network interfaces through kernel eBPF ring buffers directly into SIMD execution workers without userspace context switching.}
    \\label{fig:arch}
\\end{figure}

% --- 5. Empirical Evaluation ---
\\section{Evaluation}
\\label{sec:eval}
We evaluate SystemName to answer three key research questions:
\\begin{enumerate}
    \\item[\\textbf{RQ1:}] What is the peak throughput and P99 latency under saturated workloads?
    \\item[\\textbf{RQ2:}] How does our kernel bypass perform against standard baseline brokers?
    \\item[\\textbf{RQ3:}] What are the individual contributions of each architectural component (Ablations)?
\\end{enumerate}

\\begin{table}[h]
\\centering
\\caption{\\textbf{End-to-End Performance Comparison.} Benchmarked on 64-core AMD EPYC servers with 100GbE NICs.}
\\label{tab:results}
\\begin{tabular}{lrrr}
\\toprule
\\textbf{System} & \\textbf{Throughput (M req/s)} & \\textbf{P99 Latency (ms)} & \\textbf{RAM (GB)} \\\\
\\midrule
Baseline A       & 1.84                          & 18.40                      & 32.4               \\\\
Baseline B       & 3.20                          & 9.12                       & 24.1               \\\\
\\textbf{SystemName (Ours)} & \\textbf{9.85}       & \\textbf{1.95}             & \\textbf{8.2}      \\\\
\\bottomrule
\\end{tabular}
\\end{table}

% --- 6. Ablation Studies ---
\\section{Ablation Studies}
\\label{sec:ablations}
To isolate the sources of performance gains, we systematically disable individual subsystems...

% --- 7. Conclusion & Broader Impact ---
\\section{Conclusion}
\\label{sec:conclusion}
In this paper, we presented SystemName, demonstrating that hardware-aware kernel streaming resolves latency bottlenecks at scale. Future work will extend this model to heterogeneous GPU clusters.

% --- References ---
\\bibliographystyle{IEEEtran}
\\bibliography{references}

\\end{document}`,

    rebuttalTemplate: `% =========================================================================
% Standard Conference Peer-Review Rebuttal Template (500–800 words)
% =========================================================================
We thank the reviewers for their constructive, thorough, and insightful feedback. We are encouraged that reviewers found our problem formulation "timely and impactful" (R1, R3), our theoretical analysis "sound and rigorous" (R2), and our empirical benchmarks "convincing" (R1, R4).

Below, we address all specific reviewer questions and include new ablation experiments requested during the review period.

-------------------------------------------------------------------------
[Response to Reviewer 1 (R1)]
Q1.1: "How does the system perform when memory is constrained below 4GB?"
A1.1: We thank R1 for this excellent question. We ran new microbenchmarks under 2GB and 4GB memory limits. Under a strict 2GB ceiling, SystemName achieves 8.4M req/s (only a 14% drop from peak), whereas Baseline A crashes due to OOM errors. We will include this complete memory scaling curve in Section 5.3 of the revised paper.

-------------------------------------------------------------------------
[Response to Reviewer 2 (R2)]
Q2.1: "Clarification on the proof of Lemma 3.2 in Section 4."
A2.1: We appreciate R2 pointing out the ambiguous wording in Line 342. In Lemma 3.2, the expectation is taken over the randomized hash seeds rather than message arrival order. We have rewritten the step-by-step proof in Appendix B to make this derivation completely explicit.

-------------------------------------------------------------------------
[Response to Reviewer 3 (R3)]
Q3.1: "Comparison with very recent baseline [Smith et al., 2024]."
A3.1: We have implemented the [Smith et al., 2024] benchmark in our testbed. SystemName achieves 2.1x lower tail latency due to our lock-free buffer design. We have added this comparison to Table 2 and cited the paper accordingly.

-------------------------------------------------------------------------
We will incorporate all textual clarifications, additional citations, and new experimental tables into the camera-ready version.`
  };
})(window.TD = window.TD || {});
