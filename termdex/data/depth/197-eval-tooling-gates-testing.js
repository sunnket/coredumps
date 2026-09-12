(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([
    {
      slug: "benchmark-saturation",
      why: {
        before: "Academic NLP and AI benchmarks were assumed to measure decades of gradual scientific progress (e.g., ImageNet, GLUE, SQuAD, MMLU), serving as long-term barometers of general model capabilities.",
        problem: "Rapid scaling laws and architectural breakthroughs caused state-of-the-art LLMs to reach near-ceiling accuracy (90-95%+) on benchmarks within months of publication, collapsing variance and making it impossible to differentiate superior frontier models from mediocre ones.",
        shift: "Benchmark Saturation forces the AI research ecosystem away from static, multiple-choice tests towards dynamic, expert-level, and tool-augmented benchmarks (e.g., SWE-bench, MMLU-Pro, Humanity's Last Exam) that exhibit much lower baseline saturation floors and continuous difficulty scaling."
      },
      num: {
        t: "Benchmark Saturation Timelines & Discriminating Ceilings",
        h: ["Benchmark", "Initial Publication", "Human Baseline", "Saturation Year", "Modern SOTA Accuracy"],
        r: [
          ["SQuAD 2.0 (Reading Comp)", "2018", "86.8% F1", "2019 (1 year)", "93.2% F1 (Superhuman)"],
          ["SuperGLUE (General NLU)", "2019", "89.8 score", "2021 (2 years)", "91.0+ score (Superhuman)"],
          ["GSM8K (Grade School Math)", "2021", "60.0% unassisted", "2023-2024 (2-3 years)", "96.0%+ (Ceiling saturated)"],
          ["MMLU (Multi-task Knowledge)", "2020", "89.8% expert", "2024 (4 years)", "88-91% (Approaching ceiling)"],
          ["SWE-bench Verified", "2024", "N/A (Real SWE issues)", "Unsaturated", "35-50% (Active frontier)"]
        ],
        n: "When a benchmark saturates ($S(M) \\to 100\\%$), the discriminative power $D = \\text{Var}(S(M))$ approaches zero. Differentiating frontier models requires non-saturated evaluations where task completion requires multi-step agency, deep verification loops, and sandboxed code execution."
      },
      miss: [
        {
          w: "A saturated benchmark proves that Artificial General Intelligence (AGI) has been achieved in that domain.",
          r: "Benchmark saturation typically indicates that models have mastered the specific question phrasing, format shortcuts, or multiple-choice biases of that dataset, not true universal mastery."
        },
        {
          w: "When a benchmark saturates, it is completely useless for all engineering purposes.",
          r: "Saturated benchmarks serve as excellent, fast regression tests in CI/CD pipelines to ensure smaller edge models or quantized variants do not suffer catastrophic degradation."
        },
        {
          w: "Adding more multiple-choice questions is the best way to solve benchmark saturation.",
          r: "Multiple-choice formats suffer from guessing baselines (25%) and spurious correlations; resolving saturation requires open-ended, verifiable, tool-use tasks (e.g., executing code against unit tests)."
        },
        {
          w: "Human baselines on academic benchmarks represent the pinnacle of human capability.",
          r: "Human baselines are often established using crowdsourced workers (MTurk) who make careless errors; expert humans under unhurried conditions frequently score substantially higher."
        }
      ],
      trade: {
        buys: [
          "Drives development of realistic, rigorous evaluation suites that mirror genuine human work.",
          "Exposes model performance cliffs that static multiple-choice evaluations disguise.",
          "Forces models to demonstrate multi-step agentic execution, reasoning, and self-correction.",
          "Prevents false confidence from misleading 99% accuracy marketing claims."
        ],
        costs: [
          "New, unsaturated benchmarks (e.g., SWE-bench, GAIA) are orders of magnitude more expensive to run.",
          "Evaluating agentic benchmarks requires complex Docker sandboxing and execution runtimes.",
          "High runtime latency: running a saturated test takes minutes, whereas agentic evals can take hours.",
          "Difficult to standardize environments across different research labs and hardware setups."
        ],
        avoid: [
          "Avoid using saturated benchmarks (like GSM8K or basic MMLU) to justify purchasing or deploying frontier models.",
          "Avoid confusing high multiple-choice accuracy with real-world agentic problem-solving competence.",
          "Avoid abandoning older benchmarks entirely without keeping them as fast smoke/regression checks.",
          "Avoid comparing models on benchmarks where data contamination has rendered scores meaningless."
        ]
      }
    },
    {
      slug: "deepeval",
      why: {
        before: "Evaluating LLM applications required writing fragile custom Python scripts, ad-hoc LangChain evaluators, or manually inspecting JSON logs, resulting in unmaintainable, bespoke testing infrastructure.",
        problem: "Engineers lacked a unified, standardized framework resembling standard software unit testing (like Pytest) tailored for generative AI assertions, making it difficult to integrate evals into existing CI/CD pipelines.",
        shift: "DeepEval provides an open-source, production-grade LLM evaluation framework built natively on top of Pytest, offering battle-tested metrics (Faithfulness, Answer Relevancy, Hallucination, RAG Triad, Toxicity) with automated synthetic dataset generation and seamless CI gate integration."
      },
      num: {
        t: "DeepEval Evaluation Metrics & Framework Attributes",
        h: ["Metric", "Underlying Technique", "Inputs Required", "Execution Time", "Standard Threshold"],
        r: [
          ["Faithfulness Metric", "Truth-extraction + LLM-judge", "Input, Actual Output, Retrieval Context", "1-3 seconds", "Score >= 0.70"],
          ["Answer Relevancy", "Reverse question generation & similarity", "Input, Actual Output", "1-2 seconds", "Score >= 0.80"],
          ["Hallucination Metric", "Fact-checking against provided context", "Actual Output, Context", "1-2 seconds", "Score <= 0.10"],
          ["Contextual Precision", "Ranked retrieval relevance analysis", "Input, Expected Output, Retrieval Context", "2-4 seconds", "Score >= 0.75"],
          ["GEval (Custom Metric)", "LLM-as-a-judge with custom criteria rubric", "Input, Output, Custom Criteria", "2-5 seconds", "Score >= 0.70"]
        ],
        n: "DeepEval integrates directly into standard `pytest` workflows via `@pytest.mark` decorators and `assert_test(test_case, [metric])`. If an evaluation metric score drops below its configured threshold $\\theta$, the Pytest run fails with an explicit diagnostic explanation: $S_{\\text{metric}} < \\theta \\implies \\text{ExitCode}(1)$."
      },
      miss: [
        {
          w: "DeepEval can only evaluate applications built with specific orchestration libraries like LlamaIndex.",
          r: "DeepEval is framework-agnostic and evaluates any system outputs provided as standard `LLMTestCase` objects (strings containing input, actual output, expected output, and retrieval context)."
        },
        {
          w: "DeepEval requires an active paid subscription to Confident AI cloud.",
          r: "DeepEval is 100% open-source and runs entirely locally or in private CI runners; the Confident AI cloud dashboard is completely optional for web-based telemetry."
        },
        {
          w: "DeepEval metrics only work with OpenAI GPT-4 as the judge.",
          r: "DeepEval allows developers to configure any custom LLM (Claude, Gemini, local Ollama/vLLM models) as the evaluation judge by implementing a simple base model wrapper class."
        },
        {
          w: "Using DeepEval eliminates the need to collect production user data.",
          r: "DeepEval synthesizes initial test cases for development, but evaluating against real user failure cases and production query distributions remains essential."
        }
      ],
      trade: {
        buys: [
          "Leverages standard Pytest syntax, making AI testing feel natural to existing software engineering teams.",
          "Pre-built, mathematically sound implementations of core RAG metrics (faithfulness, relevancy, precision).",
          "Automated synthetic golden dataset generator creates hundreds of test cases from raw documents.",
          "Direct integration with GitHub Actions, GitLab CI, and common CI/CD deployment pipelines."
        ],
        costs: [
          "Running comprehensive eval suites incurs significant LLM API token consumption for judge models.",
          "Evaluation tests run noticeably slower than traditional unit tests (seconds per test case vs milliseconds).",
          "Custom GEval rubrics require careful prompt engineering to ensure consistent scoring.",
          "Requires caching strategies to prevent duplicate API evaluations on identical prompt outputs."
        ],
        avoid: [
          "Avoid running full hundred-test eval suites on every single git commit; run them on PR merges or nightly runs.",
          "Avoid using weak or small models as the judge for complex reasoning metrics like faithfulness.",
          "Avoid skipping context inputs when evaluating RAG pipelines; faithfulness cannot be measured without context.",
          "Avoid ignoring the detailed reason strings emitted by DeepEval when test cases fail."
        ]
      }
    },
    {
      slug: "promptfoo",
      why: {
        before: "Developers experimented with prompts manually in playground web UIs, copy-pasting outputs into spreadsheets to compare different model responses or prompt alterations.",
        problem: "Manual spreadsheet comparisons cannot scale, provide no automated regression protection, fail to systematically detect security vulnerabilities (jailbreaks, prompt injections), and produce subjective impressions rather than empirical metrics.",
        shift: "Promptfoo provides a lightweight, blazingly fast CLI and evaluation library that turns prompt engineering into test-driven development (TDD), running matrix evaluations across dozens of models and prompt variations with declarative YAML assertions, automated red-teaming, and CI integration."
      },
      num: {
        t: "Promptfoo Operational Architecture & Capabilities",
        h: ["Capability / Feature", "Promptfoo", "Custom Scripting", "Cloud Eval Platforms", "Manual Web Playground"],
        r: [
          ["Configuration Format", "Declarative YAML / JSON", "Imperative Python / TS", "Web UI / Proprietary JSON", "Manual form fields"],
          ["Assertion Library", "Built-in (regex, LLM, cost, latency)", "Must write from scratch", "Platform-dependent rubrics", "Subjective eye-balling"],
          ["Execution Concurrency", "High (native parallel workers)", "Requires custom async logic", "Managed cloud queue", "Single request at a time"],
          ["Red Teaming Suite", "Automated OWASP LLM probes", "Manual adversarial writing", "Add-on security modules", "None"],
          ["CI/CD Integration", "Direct CLI exit code & SARIF", "Custom exit code scripting", "Webhook / API trigger", "Impossible"]
        ],
        n: "Promptfoo defines evaluations via `promptfooconfig.yaml`, testing the Cartesian product of prompts $\\mathcal{P}$, model providers $\\mathcal{M}$, and test cases $\\mathcal{T}$. Results are scored against assertions ($N = |\\mathcal{P}| \\times |\\mathcal{M}| \\times |\\mathcal{T}|$), caching LLM responses locally via SQLite to minimize cost."
      },
      miss: [
        {
          w: "Promptfoo only works with OpenAI models.",
          r: "Promptfoo supports dozens of providers natively (Anthropic, Google, AWS Bedrock, Ollama, HuggingFace, local Python/Node scripts, and custom HTTP endpoints)."
        },
        {
          w: "Running Promptfoo tests is expensive because it re-runs everything every time.",
          r: "Promptfoo includes an aggressive local caching layer (SQLite); identical prompt-model-input combinations are fetched instantly from cache at zero API cost."
        },
        {
          w: "Promptfoo cannot evaluate non-deterministic or open-ended responses.",
          r: "Promptfoo supports model-graded assertions (`llm-rubric`, `factuality`, `model-graded-closedqa`) alongside deterministic assertions (`contains`, `regex`, `is-json`, `javascript`)."
        },
        {
          w: "Promptfoo is exclusively a developer CLI and cannot generate visual reports.",
          r: "Running `promptfoo view` launches an interactive local web UI featuring side-by-side output matrices, latency/cost comparisons, and filtering dashboards."
        }
      ],
      trade: {
        buys: [
          "Declarative YAML test configuration enables rapid onboarding and version-controlled prompt tests.",
          "Built-in caching drastically reduces API spend during iterative prompt development.",
          "Out-of-the-box red-teaming tool identifies prompt injection and jailbreak vulnerabilities.",
          "Seamless CLI exit codes integrate instantly into GitHub Actions and pre-commit hooks."
        ],
        costs: [
          "Model-graded assertions still require reliable frontier API access and incur token costs.",
          "YAML syntax can become verbose for highly dynamic test suites without external Python/JS test loaders.",
          "Does not replace full production application observability and distributed tracing.",
          "Complex multi-agent stateful workflows require custom provider scripts rather than raw prompt templates."
        ],
        avoid: [
          "Avoid committing prompt changes without running `promptfoo eval` against regression suites.",
          "Avoid disabling the local cache during iterative prompt refining to save API costs.",
          "Avoid using loose assertions that pass on generic non-answers or polite refusals.",
          "Avoid running destructive red-team suites against production endpoints without rate-limiting guards."
        ]
      }
    },
    {
      slug: "eval-gate",
      why: {
        before: "Prompt modifications and model upgrades were pushed directly to production following anecdotal developer approval, treating non-deterministic AI models like traditional deterministic code.",
        problem: "Minor wording tweaks in system prompts frequently degrade unseen downstream capabilities, introduce new hallucination vectors, or bypass safety guardrails without triggering traditional unit test failures.",
        shift: "An Eval Gate enforces an automated quality barrier in CI/CD pipelines that executes a curated test suite of evaluation assertions, automatically blocking pull request merges and deployment promotions if key metrics (accuracy, faithfulness, safety, latency) fall below defined thresholds."
      },
      num: {
        t: "Eval Gate Deployment Policy Criteria",
        h: ["Gating Metric", "Enforcement Condition", "Failure Action", "Typical Evaluation Set Size", "Execution Frequency"],
        r: [
          ["Safety / Refusal Rate", "Strictly == 100% on attack set", "Immediate Block (Hard Gate)", "50-100 adversarial prompts", "Every Pull Request"],
          ["JSON Schema Compliance", "Strictly == 100%", "Immediate Block (Hard Gate)", "100-200 functional inputs", "Every Pull Request"],
          ["Faithfulness (RAG)", "Mean score >= 0.85 & 0 drops > 0.1", "Block PR with diff report", "200-500 RAG samples", "Nightly / Staging PR"],
          ["Answer Accuracy / F1", "Delta >= -0.01 vs Main baseline", "Warning / Block on regression", "500-1000 domain questions", "Pre-release staging"],
          ["p95 Generation Latency", "< 1500 ms TTFT / < 3000 ms total", "Flag for performance review", "100 concurrent requests", "Canary deployment"]
        ],
        n: "The eval gate computes test suite metrics $\\mathbf{M}_{\\text{new}}$ against baseline $\\mathbf{M}_{\\text{base}}$. A gate rule $R_i(\\mathbf{M}_{\\text{new}}, \\mathbf{M}_{\\text{base}})$ triggers failure if any hard threshold is violated: $\\text{GateStatus} = \\bigwedge_{i=1}^K R_i$. Violations halt deployment pipelines automatically."
      },
      miss: [
        {
          w: "An eval gate should test 10,000 queries on every pull request.",
          r: "Running massive suites on every commit creates developer friction and exorbitant API costs; eval gates use a tiered approach: fast smoke tests (50 cases) on PR, full suites on merge or nightly."
        },
        {
          w: "Eval gates eliminate the need for canary deployments and production monitoring.",
          r: "Eval gates catch known regressions pre-merge, but canary deployments and real-time observability are still essential to catch novel production distribution shifts."
        },
        {
          w: "Passing an eval gate once means the prompt is permanently safe.",
          r: "Upstream changes to third-party model weights (e.g. OpenAI updating GPT-4 snapshots) can degrade performance without any internal code changes, requiring recurring cron gates."
        },
        {
          w: "Eval gates must require 100% scores across all subjective metrics to pass.",
          r: "LLMs exhibit slight natural stochastic variance; hardcoding 100% requirements on model-graded subjective metrics causes false alarms; gates should enforce non-regression bands (e.g., within 2% of baseline)."
        }
      ],
      trade: {
        buys: [
          "Prevents broken prompts, safety leaks, and severe regressions from reaching production users.",
          "Provides objective, data-driven criteria for approving or rejecting prompt pull requests.",
          "Instills engineering confidence to iterate rapidly on prompts and model version migrations.",
          "Creates audit trails documenting model performance history across every deployment."
        ],
        costs: [
          "Increases CI/CD pipeline duration by adding 2 to 10 minutes of LLM evaluation runtime.",
          "Generates recurring API costs for running model-graded evaluators on every pull request.",
          "Requires maintaining and curating gold-standard test datasets as product features evolve.",
          "Risk of false positives if stochastic temperature settings create non-deterministic test failures."
        ],
        avoid: [
          "Avoid running eval gates with high LLM sampling temperatures; set `temperature=0` for evaluation reproducibility.",
          "Avoid failing builds over minor statistical noise; establish confidence interval regression thresholds.",
          "Avoid allowing manual overrides of safety eval gates without senior engineering authorization.",
          "Avoid static eval gate test sets that never incorporate newly discovered production edge-case bugs."
        ]
      }
    },
    {
      slug: "regression-testing",
      why: {
        before: "When an LLM prompt bug was reported in production (e.g., a hallucination on a specific financial term), engineers tweaked the prompt until the bug was fixed, without verifying whether the edit broke 10 other existing capabilities.",
        problem: "Generative prompts exhibit extreme non-linear coupling: adding an instruction to solve one edge case frequently causes the model to ignore earlier constraints, creating a frustrating cycle of fixing one bug while introducing two others.",
        shift: "LLM Regression Testing treats every cataloged user bug, edge case, and historical failure mode as a permanent automated test case in a regression suite, continuously executing it against prompt and model updates to mathematically guarantee zero backward regressions."
      },
      num: {
        t: "Regression Testing Strategy Across AI Evolution",
        h: ["Testing Layer", "Test Case Source", "Verification Engine", "Execution Frequency", "Regression Detection Target"],
        r: [
          ["Unit Prompt Tests", "Engineered edge cases", "Deterministic Regex & JSON parser", "Pre-commit / PR", "Formatting & schema regressions"],
          ["Bug-Fix Golden Set", "Historical production customer tickets", "LLM-as-a-judge / Ground truth match", "Every Pull Request", "Re-emergence of known defects"],
          ["Adversarial Security Set", "Red-team attack catalogs (OWASP)", "Safety classifier / Refusal assertion", "Nightly automated CI", "Bypass of established safety guardrails"],
          ["Distributional Baseline", "Sampled production logs (anonymized)", "Embedding distance & accuracy drift", "Weekly / Model version updates", "Subtle semantic drift & tone changes"],
          ["End-to-End Workflow", "Synthetic multi-turn scenarios", "Mock tool sandbox execution", "Pre-release deployment", "Agent tool execution & planning loops"]
        ],
        n: "Regression testing measures the empirical pass rate $P = \\frac{1}{N} \\sum_{i=1}^N \\mathbb{I}(\\text{Test}_i \\text{ passes})$. A code or prompt change is flagged for regression if $P_{\\text{new}} < P_{\\text{base}} - \\epsilon$, or if any critical severity Tier-1 test fails: $\\exists i \\in T_{\\text{crit}} \\text{ s.t. } \\text{Test}_i = \\text{Fail}$."
      },
      miss: [
        {
          w: "Traditional software regression testing principles do not apply to probabilistic LLMs.",
          r: "While individual generations are probabilistic, aggregate pass rates across curated test suites follow predictable statistical distributions, making regression testing fully viable."
        },
        {
          w: "A regression test suite only needs to contain 10-20 general questions.",
          r: "Effective regression suites contain hundreds of targeted test cases, specifically populated by every production failure and edge case ever encountered by the application."
        },
        {
          w: "Prompt regressions can be prevented by writing longer, more detailed system prompts.",
          r: "Excessively long system prompts increase instruction conflict and context dilution, making regressions more frequent rather than less."
        },
        {
          w: "Regression testing is only necessary when upgrading to a completely new foundation model.",
          r: "Minor changes to prompt wording, few-shot examples, retriever chunking, or temperature settings regularly cause severe regressions and require immediate testing."
        }
      ],
      trade: {
        buys: [
          "Guarantees that previously resolved production bugs do not re-emerge in future prompt releases.",
          "Decouples prompt optimization from fear of breaking existing critical workflows.",
          "Turns user bug reports into valuable, permanent intellectual property and testing assets.",
          "Provides empirical evidence of system stability and reliability over time."
        ],
        costs: [
          "Regression test suites steadily grow in size, increasing CI test execution time and API costs.",
          "Requires continuous maintenance to update expected outputs when intentional product requirements change.",
          "Storage and anonymization requirements for capturing real-world customer bug reports.",
          "Risk of flaky tests if assertions are too tightly coupled to arbitrary exact-string phrasing."
        ],
        avoid: [
          "Avoid closing a production LLM bug ticket without adding a corresponding regression test case.",
          "Avoid exact-string matching for open-ended answers; use semantic similarity or LLM-as-a-judge rubrics.",
          "Avoid testing with variable temperatures; use deterministic sampling (`temperature=0`) for regression suites.",
          "Avoid discarding failing tests without investigating why the model behavior shifted."
        ]
      }
    }
  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
