(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([
{
      slug: "evaluation",
      why: {
        before: "AI application validation relied on anecdotal 'vibe checks', subjective ad-hoc prompting, or static unit tests that failed to capture the non-deterministic, open-ended generative nature of Large Language Models.",
        problem: "Shipping LLM applications to production based on manual spot-checks inevitably leads to silent regressions, hallucinations on edge cases, prompt injection vulnerabilities, and catastrophic brand reputational damage.",
        shift: "Modern LLM Evaluation (Evals) establishes automated, reproducible measurement pipelines combining deterministic checks (exact match, regex, JSON schema validation), model-graded metrics (LLM-as-a-judge), and statistical benchmarks to systematically gate CI/CD deployments."
      },
      num: {
        t: "LLM Evaluation Methodology Comparison",
        h: ["Evaluation Type", "Scoring Mechanism", "Latency / Cost", "Scalability", "Primary Failure Mode"],
        r: [
          ["Deterministic Assertions", "Regex, schema validation, exact match", "Instant / Near-zero cost", "Infinite automated CI", "Cannot assess semantic quality"],
          ["Traditional NLP Metrics", "BLEU, ROUGE, METEOR, BERTScore", "Milliseconds / Low cost", "High automated CI", "Poor correlation with human judgment"],
          ["LLM-as-a-Judge", "Rubric prompting on frontier models", "Seconds / Moderate API cost", "High automated pipelines", "Position, length, & self-enhancement bias"],
          ["Human Annotation", "Double-blind expert review", "Days-Weeks / High cost", "Low (spot-checks only)", "Inter-annotator disagreement & fatigue"],
          ["Task-Based Evals", "Tool calls, unit test execution (SWE-bench)", "Minutes / Compute bound", "Moderate automated sandbox", "Environment flakiness & timeout risks"]
        ],
        n: "Rigorous LLM evaluation tracks both model capability and system alignment. Model-graded rubrics score responses across Likert scales ($1-5$) using pairwise Bradley-Terry comparison: $P(A \\succ B) = \\frac{1}{1 + 10^{(R_B - R_A)/400}}$, swapping candidate presentation order to neutralize position bias."
      },
      miss: [
        {
          w: "Evaluating generative AI applications requires having human reviewers grade every output.",
          r: "Automated LLM-as-a-judge pipelines with calibrated rubrics achieve $>85\\%$ correlation with human experts, enabling continuous regression testing at a fraction of the cost."
        },
        {
          w: "ROUGE and BLEU scores are sufficient for evaluating modern generative LLM responses.",
          r: "ROUGE and BLEU measure superficial n-gram overlap; an answer phrased differently with identical meaning scores near zero, while a fluent hallucination can score misleadingly high."
        },
        {
          w: "LLM-as-a-judge evaluations are completely objective and immune to bias.",
          r: "Judge models suffer from well-documented biases: position bias (favoring response A), verbosity bias (favoring longer answers), and self-enhancement bias (favoring their own generated outputs)."
        },
        {
          w: "Running 10 test prompts in a playground constitutes a valid evaluation suite.",
          r: "Valid eval suites require statistically significant sample sizes ($N \\ge 100-500$), representative domain distributions, edge cases, and adversarial counter-examples."
        }
      ],
      trade: {
        buys: [
          "Eliminates subjective guesswork with quantifiable regression metrics on prompt/model updates.",
          "Enables automated CI/CD deployment gates that block faulty prompt modifications.",
          "Identifies exact failure modes across fine-grained sub-categories (reasoning, safety, formatting).",
          "Accelerates engineering velocity by decoupling prompt experimentation from manual QA."
        ],
        costs: [
          "Significant recurring API token costs for running judge LLMs across evaluation suites.",
          "High initial time investment required to curate representative, gold-standard test datasets.",
          "Risk of benchmark gaming or overfitting prompts to the specific evaluation dataset.",
          "Judge models require ongoing calibration against human expert judgment baselines."
        ],
        avoid: [
          "Avoid deploying prompt or model changes to production without running automated regression evals.",
          "Avoid relying on n-gram metrics (BLEU/ROUGE) for creative or complex analytical reasoning tasks.",
          "Avoid using LLM-as-a-judge without swapping response presentation order to eliminate position bias.",
          "Avoid evaluating systems only on synthetic, clean data while ignoring messy real-world user logs."
        ]
      }
    },
    {
      slug: "error-analysis",
      why: {
        before: "When LLM or ML systems underperformed, teams simply looked at aggregate loss or accuracy numbers and blindly threw more data or bigger models at the problem without diagnosing the underlying cause.",
        problem: "In production AI systems, a 95% aggregate accuracy score can mask catastrophic 0% performance on critical minority sub-slices (e.g., specific dialects, edge-case financial queries, or adversarial attacks).",
        shift: "Error Analysis systematically decomposes model failures into a structured taxonomy (retrieval misses, reasoning errors, hallucination, refusal, format violation), performing slice-based analysis to target high-ROI engineering fixes rather than undirected retraining."
      },
      num: {
        t: "RAG & LLM Failure Mode Diagnostic Taxonomy",
        h: ["Failure Category", "Root Cause Mechanism", "Diagnostic Indicator", "Corrective Action", "Target Metric"],
        r: [
          ["Retrieval Missing", "Semantic gap or bad chunking", "Relevant facts absent from context", "Hybrid search & reranking", "Recall@K"],
          ["Context Dilution", "Context window lost-in-the-middle", "Fact present in context but ignored", "Rerank top-3 & chunk compression", "Context Precision"],
          ["Generator Hallucination", "Prior parametric memory conflict", "Output contradicts context", "Few-shot grounded prompts", "Faithfulness"],
          ["Formatting Violation", "Schema non-compliance", "JSON parse failure / missing keys", "Instructor / Pydantic schemas", "Schema Pass Rate"],
          ["Adversarial Jailbreak", "Prompt injection via context", "Safety refusal bypassed", "Input sanitization & guardrails", "Refusal Rate"]
        ],
        n: "Slice-based error analysis partitions test data into orthogonal metadata cohorts $S_1, S_2, \\dots, S_m$. The error rate on slice $S_k$ is computed as $\\epsilon(S_k) = \\frac{1}{|S_k|} \\sum_{i \\in S_k} \\mathbb{I}(y_i \\ne \\hat{y}_i)$, exposing isolated sub-demographic vulnerabilities hidden by global macro-averages."
      },
      miss: [
        {
          w: "Error analysis is only necessary when a model fails to achieve high overall benchmark accuracy.",
          r: "High aggregate accuracy frequently hides severe localized failures on critical business domains, high-risk compliance segments, or rare corner cases."
        },
        {
          w: "The best solution to errors discovered during analysis is to fine-tune the model immediately.",
          r: "Error analysis often reveals that the majority of failures stem from poor retrieval chunking, ambiguous prompt instructions, or dirty training data, which are far cheaper to fix than model retraining."
        },
        {
          w: "Error analysis can be fully automated without ever reading individual error instances.",
          r: "Automated slicing identifies where failures cluster, but qualitative manual inspection of 50-100 failure traces is essential to uncover surprising failure mechanisms and prompt ambiguities."
        },
        {
          w: "Labeling errors as simply 'hallucination' provides sufficient diagnostic detail.",
          r: "'Hallucination' is too broad; rigorous analysis distinguishes between ungrounded fabrication, entity confusion, temporal mismatch, and parametric memory intrusion."
        }
      ],
      trade: {
        buys: [
          "Pinpoints exact system bottlenecks, preventing wasted compute on ineffective model retraining.",
          "Exposes hidden performance drops on critical minority user groups and niche domains.",
          "Creates high-value regression test suites directly from cataloged failure instances.",
          "Provides actionable engineering insights that bridge product requirements and ML modeling."
        ],
        costs: [
          "Requires dedicated engineering hours to manually review and categorize failure instances.",
          "Demands maintenance of rich metadata logging pipelines to support granular slicing.",
          "Can reveal architectural limitations that necessitate significant pipeline redesigns.",
          "Risk of false pattern discovery if error sample sizes in minority slices are too small."
        ],
        avoid: [
          "Avoid relying solely on single aggregate macro metrics to judge system health.",
          "Avoid retraining models before verifying whether retrieval or prompt engineering caused the failure.",
          "Avoid treating error taxonomy categories as vague catch-alls without clear operational definitions.",
          "Avoid ignoring errors that occur on low-frequency query types if their business impact is critical."
        ]
      }
    },
    {
      slug: "mt-bench",
      why: {
        before: "LLM evaluation relied on single-turn multiple-choice benchmarks (MMLU) or isolated question-answering datasets that failed to test how assistants handle multi-turn conversations, follow-up instructions, and stateful dialog.",
        problem: "Models that scored impressively on single-turn benchmarks frequently failed in real conversational deployments, forgetting previous turn constraints, hallucinating follow-up corrections, and losing context coherence.",
        shift: "MT-Bench (Multi-Turn Benchmark), created by LMSYS, introduced an automated, multi-turn evaluation framework of 80 high-quality two-turn dialog questions across 8 core domains, using GPT-4 as an automated judge to score answer quality and consistency on a 1-10 scale."
      },
      num: {
        t: "MT-Bench Core Domain Breakdown & Evaluation Structure",
        h: ["Domain / Category", "Turn 1 Focus", "Turn 2 Challenge", "Evaluation Rubric", "Common Failure Mode"],
        r: [
          ["Coding", "Algorithm implementation", "Refactoring / Bug fixing in Turn 1 code", "Syntactic & logical correctness", "Regenerates Turn 1 code without requested changes"],
          ["Math", "Mathematical word problem", "Changing problem constraints / Extension", "Calculation precision & proof steps", "Carries forward arithmetic errors from Turn 1"],
          ["Roleplay", "Adopting specialized persona", "Handling adversarial persona pushback", "Voice consistency & style adherence", "Breaks character into generic assistant tone"],
          ["Reasoning", "Deductive logic riddle", "Modifying premise / Counterfactuals", "Logical validity & deduction", "Contradicts previous logical deductions"],
          ["Writing", "Essay / Story generation", "Tone shift / Format re-writing", "Creativity, structure, vocabulary", "Ignores word count or stylistic constraints"]
        ],
        n: "MT-Bench scores two turns independently on a 1-10 scale: Turn 1 evaluates standalone instruction following, while Turn 2 tests conversational memory, critique handling, and iterative refinement: $S_{\\text{MT}} = \\frac{1}{2} (S_1 + S_2)$. Scores correlate $>80\\%$ with human Chatbot Arena Elo ratings."
      },
      miss: [
        {
          w: "MT-Bench tests general knowledge breadth like MMLU.",
          r: "MT-Bench explicitly evaluates conversational ability, complex instruction adherence, and multi-turn consistency across 80 challenging questions, not encyclopedic memorization."
        },
        {
          w: "MT-Bench scores can be directly compared when evaluated using different judge models.",
          r: "The canonical MT-Bench benchmark specifies GPT-4 as the reference judge; using GPT-3.5 or Claude as the judge shifts the scoring scale and invalidates direct comparisons."
        },
        {
          w: "A high Turn 1 score guarantees a high Turn 2 score on MT-Bench.",
          r: "Many models score 8-9 on Turn 1 but drop below 5 on Turn 2 because they fail to incorporate feedback or break formatting constraints established in the initial turn."
        },
        {
          w: "MT-Bench questions are simple casual chatbot banter.",
          r: "MT-Bench questions are expertly engineered multi-step prompts requiring complex mathematical proofs, functional coding, and deep creative writing under strict constraints."
        }
      ],
      trade: {
        buys: [
          "Directly benchmarks conversational multi-turn capability with high correlation to human preference.",
          "Fast and reproducible: evaluates an entire model checkpoint for a few dollars in judge API credits.",
          "Covers 8 diverse reasoning and creative domains in a balanced, compact suite.",
          "Exposes conversational degradation between initial generation and follow-up turns."
        ],
        costs: [
          "Relies on closed frontier models (GPT-4) as the authoritative judge, introducing potential bias.",
          "Small dataset size (80 questions, 160 turns) means individual prompt variations can skew scores.",
          "Susceptible to verbosity bias where the judge awards higher points to longer answers.",
          "Does not test extreme long-context retrieval or multi-modal capabilities."
        ],
        avoid: [
          "Avoid using weaker models (e.g. GPT-3.5) as the MT-Bench judge; their reasoning fails to evaluate Turn 2 nuances.",
          "Avoid averaging Turn 1 and Turn 2 without inspecting the conversational drop-off delta.",
          "Avoid tuning prompts specifically on the 80 MT-Bench questions to prevent benchmark overfitting.",
          "Avoid evaluating without prompt template consistency matching the model's official chat format."
        ]
      }
    },
    {
      slug: "benchmark-contamination",
      why: {
        before: "Pre-training web corpora were relatively small and distinct from curated academic test sets, allowing standard train/test splits to accurately reflect true out-of-sample generalization.",
        problem: "Modern LLMs train on multi-trillion token web scrapes (Common Crawl, GitHub, Wikipedia) that unknowingly ingest benchmark test sets (MMLU, GSM8K, HumanEval), causing models to memorize answers and post fake, inflated benchmark records.",
        shift: "Benchmark Contamination detection employs strict n-gram containment filters, decontamination pipelines, canary string assertions, and synthetic, continuously refreshed evaluation suites to ensure reported benchmarks reflect true reasoning rather than memorization."
      },
      num: {
        t: "Benchmark Decontamination Techniques & Safeguards",
        h: ["Technique", "Mechanism", "Detection Target", "Overhead / Complexity", "Effectiveness"],
        r: [
          ["N-gram Overlap Filtering", "8-to-13 gram sliding window search", "Exact textual matches in pre-training data", "Moderate (requires MinHash/Bloom filter)", "High for verbatim copies, poor for paraphrases"],
          ["Canary Strings (BIG-bench)", "Unique cryptographic hash GUID embedded in test sets", "Detects if test file was ingested into training web scrape", "Zero runtime overhead", "Absolute proof of ingestion if canary appears in weights"],
          ["Embedding Similarity Search", "Dense vector cosine distance", "Semantic paraphrases of benchmark prompts", "High computational cost", "Catches rephrased and translated contamination"],
          ["Dynamic Synthetic Evals", "LLM-generated novel problems with verified ground truth", "Eliminates static test sets entirely", "Requires automated verification tooling", "Immune to historical pre-training contamination"],
          ["Perplexity Anomaly Detection", "Unusually low perplexity on test set questions", "Detects memorized token sequences", "Low (evaluates standard model logits)", "Strong statistical indicator of rote memorization"]
        ],
        n: "Contamination severity is formally quantified via $n$-gram match ratios: $C(T, D) = \\frac{|\\{s \\in \\text{ngrams}_n(T) \\mid s \\in D\\}|}{|\\text{ngrams}_n(T)|}$. If a 13-gram overlap between test item $T$ and training corpus $D$ occurs, the sample is flagged as contaminated and excluded."
      },
      miss: [
        {
          w: "If a model's creators didn't intentionally download the test set, the model cannot be contaminated.",
          r: "Automated web scrapers ingest public repositories, blogs, solutions guides, and Kaggle notebooks that contain benchmark questions and answers without explicit curation."
        },
        {
          w: "Contamination only happens if the exact question and answer string matches word-for-word.",
          r: "Semantic contamination occurs when paraphrased explanations, chain-of-thought solutions, or re-ordered multiple-choice answers leak into training data."
        },
        {
          w: "A model that achieves 90% on GSM8K is proven to possess advanced mathematical reasoning.",
          r: "If the model memorized the template patterns or contaminated problem variants, performance can collapse to below 40% on perturbed numbers or modified story premises."
        },
        {
          w: "Canary strings completely prevent contamination from occurring.",
          r: "Canary strings only alert researchers that an ingestion leak occurred; they do not remove the data unless web scrapers explicitly filter out files containing the canary GUID."
        }
      ],
      trade: {
        buys: [
          "Guarantees scientific integrity and honest assessment of genuine model generalization.",
          "Prevents shipping models to production that collapse when encountering novel distribution shifts.",
          "Protects organizations from reputational damage caused by public benchmark gaming scandals.",
          "Encourages the development of dynamic, robust, and perturbable evaluation pipelines."
        ],
        costs: [
          "Massive computational overhead to run $n$-gram and MinHash deduplication over trillions of tokens.",
          "Requires continuous maintenance and regeneration of private, unreleased evaluation sets.",
          "False positives during filtering can discard legitimate, educational pre-training material.",
          "Paraphrase contamination remains extremely difficult to detect with complete mathematical certainty."
        ],
        avoid: [
          "Avoid publishing evaluation test sets online without embedding standard Canary GUID strings.",
          "Avoid trusting state-of-the-art benchmark claims that lack published decontamination reports.",
          "Avoid using static, public benchmarks as the sole criteria for production model deployment.",
          "Avoid evaluating models on public Kaggle datasets without checking whether the training scrape included them."
        ]
      }
    }
  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
