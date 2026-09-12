/* ==========================================================================
   Depth pass 85 — Generative AI & LLMs batch 5: reasoning, alignment & serving architectures.
   Stable Diffusion, Reasoning Model, Model Routing, Alignment,
   Red Teaming, Open-Weight Model, Latency, Streaming,
   Knowledge Cutoff, GPT, BERT.

   Test-time compute scaling unlocks mathematical reasoning; direct preference
   optimization aligns foundation models; streaming SSE tokens mask memory-bound latency.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "stable-diffusion",

      why: {
        before: "Pixel-space diffusion models (DDPM, Imagen) evaluated deep U-Nets directly on high-resolution " +
          "image tensors ($1024 \\times 1024 \\times 3$), requiring massive GPU clusters and hours of compute per image batch.",
        problem: "Pixel-level RGB representations contain high-frequency imperceptible noise that wastes 90% of diffusion compute; " +
          "diffusion needed a compressed, perceptually equivalent latent representation space.",
        shift: "**Stable Diffusion (Latent Diffusion Models, Rombach et al. 2022): Diffusion in low-dimensional latent space.** " +
          "Compress raw images $8\\times$ spatially into a latent space via a pre-trained VQ-VAE/Autoencoder, " +
          "running iterative diffusion on compact latent representations conditioned on CLIP text embeddings via Cross-Attention."
      },

      num: {
        t: "Stable Diffusion architecture components & spatial dimensions",
        h: ["Subsystem / Component", "Architecture / Model", "Spatial / Tensor Dimensions", "Operational Function"],
        r: [
          ["**Autoencoder (VAE)**", "Trained perceptual encoder & decoder ($f, g$)", "$512 \\times 512 \\times 3 \\to **64 \\times 64 \\times 4$**", "Compresses image data by **$48\\times$ byte volume**; encodes pixels $\\leftrightarrow$ latents"],
          ["**Denoising Backbone**", "Time-conditioned U-Net with ResNet blocks", "$64 \\times 64 \\times 4$ latent space", "Predicts injected latent noise vector $\\epsilon_\\theta(z_t, t, c)$"],
          ["**Conditioning Engine**", "CLIP ViT-L/14 Text Encoder", "$77 \\text{ tokens} \\times 768 \\text{ dim}$", "Encodes natural language prompt into cross-attention keys & values"],
          ["**Cross-Attention Mechanism**", "$\\text{Attention}(Q_{\\text{unet}}, K_{\\text{clip}}, V_{\\text{clip}})$", "Injected at intermediate U-Net resolutions", "Steers spatial feature generation based on textual semantic tokens"],
          ["**Classifier-Free Guidance (CFG)**", "$\\tilde{\\epsilon} = \\epsilon_{\\text{uncond}} + s(\\epsilon_{\\text{cond}} - \\epsilon_{\\text{uncond}})$", "Standard scale $s = 7.0 - 7.5$", "Amplifies text adherence at the expense of sample diversity"]
        ],
        n: "Stable Diffusion (Latent Diffusion Models / LDM) was developed by " +
          "Robin Rombach, Andreas Blattmann, Dominik Lorenz, Patrick Esser, and Björn Ommer " +
          "(CompVis / Runway / Stability AI) in 2022. Its revolutionary breakthrough was " +
          "**decoupling perceptual compression from generative modeling**. " +
          "Rather than running expensive diffusion in pixel space ($512 \\times 512 \\times 3 = 786,432$ values), " +
          "a pre-trained Variational Autoencoder (VAE) compresses the image by an $8\\times$ spatial downsampling " +
          "factor into a compact latent tensor: $z \\in \\mathbb{R}^{4 \\times 64 \\times 64} = 16,384$ values—a " +
          "**48x reduction in computational complexity**! " +
          "The iterative diffusion process (forward noising and reverse denoising) operates entirely " +
          "inside this compact latent manifold. Text conditioning is integrated via **Cross-Attention**: " +
          "the prompt is tokenized and encoded by a frozen CLIP text encoder into embeddings $\\tau_\\theta(y)$, " +
          "which act as Keys and Values for cross-attention layers embedded throughout the U-Net backbone. " +
          "Once the reverse diffusion process completes its scheduled denoising steps (typically 20-30 steps via " +
          "Euler or DPM-Solver), the final clean latent $z_0$ is passed through the VAE Decoder $g(z_0)$ " +
          "in a single forward pass to render the full-resolution $512 \\times 512$ or $1024 \\times 1024$ photorealistic image. " +
          "By releasing the weights completely open-source, Stable Diffusion triggered the global explosion of consumer generative art."
      },

      miss: [
        {
          w: "Stable Diffusion generates images by searching Google Images and blending pieces together.",
          r: "Stable Diffusion contains zero images in its weights: its 860M-parameter U-Net learns the statistical score function of visual distributions, generating images from scratch by denoising Gaussian noise."
        },
        {
          w: "The CLIP text encoder is trained jointly with the U-Net during diffusion pre-training.",
          r: "The CLIP text encoder is frozen and static. It was pre-trained by OpenAI on contrastive image-text pairs; Stable Diffusion simply reuses its text representations to condition the U-Net."
        },
        {
          w: "Setting CFG (Classifier-Free Guidance) to 20 makes the image look twice as realistic.",
          r: "High CFG ($s > 12$) over-saturates colors, introduces harsh edge artifacts, and blows out contrast. Optimal CFG values for Stable Diffusion 1.5/SDXL typically range between 5.0 and 8.0."
        },
        {
          w: "Stable Diffusion can only be used to generate images from text prompts (Text-to-Image).",
          r: "Because diffusion operates on latents, it natively supports Image-to-Image (encoding an existing image to noise at step $t$), Inpainting (masking regions of the latent), and ControlNet (structural spatial guidance via depth/edge maps)."
        }
      ],

      trade: {
        buys: [
          "Democratized generative media: runs locally on consumer GPUs (RTX 3060/4090) with as little as 4-8 GB of VRAM.",
          "Rich open-source ecosystem: supported by thousands of community fine-tuned LoRAs, ControlNets, and IP-Adapters.",
          "Flexible control: natively supports inpainting, outpainting, image-to-image, and structural depth conditioning."
        ],
        costs: [
          "Iterative generation latency: requires 20-30 sequential forward passes through a heavy U-Net to render one image.",
          "Struggles with complex typographic text spelling and intricate human anatomy (e.g. realistic hands) in early SD versions.",
          "High VRAM memory bandwidth pressure during multi-batch generation."
        ],
        avoid: [
          "Running diffusion in pixel space when latent diffusion achieves identical visual fidelity with 90% less compute.",
          "Using legacy 1000-step DDPM sampling in production when modern solvers (Euler Ancestral, DPM++ 2M Karras) converge in 20 steps."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "reasoning-model",

      why: {
        before: "Standard Large Language Models (GPT-4, Claude 3.5) emitted answers immediately via single forward passes, " +
          "frequently failing on complex Olympiad-level mathematics, competitive programming, and formal logic.",
        problem: "In classical deep learning, scaling compute was confined entirely to pre-training; " +
          "inference compute was fixed and constant, preventing models from 'thinking harder' on difficult questions.",
        shift: "**Reasoning Model (Test-Time Compute Scaling, OpenAI o1 / o3, DeepSeek R1): Autonomous deliberative thinking.** " +
          "Train models via large-scale Reinforcement Learning to generate extensive internal, self-correcting reasoning chains " +
          "prior to answering, establishing an inference-time compute scaling law where accuracy scales monotonically with thinking duration."
      },

      num: {
        t: "Standard LLM vs Test-Time Reasoning Model comparison",
        h: ["Dimension / Property", "Standard Conversational LLM (GPT-4o, Llama 3)", "Reasoning Model (OpenAI o1, DeepSeek R1)"],
        r: [
          ["**Inference Compute Allocation**", "**Fixed**: $\\mathcal{O}(L)$ constant forward passes per output token", "**Dynamic**: scales compute from 100 to 10,000+ internal thinking tokens"],
          ["**Reinforcement Learning Focus**", "Preference alignment (RLHF on human tone & safety)", "**Reinforcement Learning on Verified Outcomes** (Math, Code unit tests)"],
          ["**Self-Correction Capability**", "Poor: once a model makes a mistake, it doubles down", "**Native**: backtracks, explores alternative paths, verifies intermediate work"],
          ["**Competitive Math Benchmark (AIME)**", "$\\approx 12 - 15\\%$ accuracy", "**$>83 - 90\\%$ accuracy** (Olympiad-tier competitive mathematics)"],
          ["**Target Domain Suitability**", "Fast customer chat, creative prose, summarization", "Complex software architecture, security auditing, mathematical proofs, drug discovery"]
        ],
        n: "Reasoning Models represent the most significant paradigm shift " +
          "in artificial intelligence since the 2020 scaling laws (OpenAI o1 / o3, DeepSeek R1 2024-2025). " +
          "Historically, AI scaling was bounded by pre-training compute. Reasoning models unlock " +
          "a complementary **Inference-Time (Test-Time) Compute Scaling Law**: " +
          "accuracy on complex reasoning benchmarks scales monotonically with the number of tokens " +
          "allocated to the model's internal **Chain-of-Thought thinking process**. " +
          "Unlike standard models trained via simple supervised instruction tuning, reasoning models " +
          "are trained through **large-scale Reinforcement Learning (RL) on verifiable domains** (such as " +
          "competitive programming unit tests and formal mathematical proofs). Through RL, the model " +
          "discovers emergent cognitive behaviors without human demonstration: " +
          "it learns to **decompose complex questions**, **hypothesize multiple speculative solution paths**, " +
          "**critique its own intermediate logic**, **detect its own mistakes**, and **backtrack** when a path " +
          "reaches a dead end. Because these 'thinking tokens' are generated prior to the final visible answer, " +
          "the model can spend seconds or minutes of dedicated compute navigating complex problem spaces."
      },

      miss: [
        {
          w: "Reasoning models should be used for simple tasks like summarization and email writing.",
          r: "Using a reasoning model for simple prose wastes massive time and money: the model will spend 15 seconds over-analyzing a simple email that a fast conversational LLM drafts in 200 milliseconds."
        },
        {
          w: "Reasoning models are trained by humans hand-writing thousands of long thinking chains.",
          r: "DeepSeek R1 and OpenAI proved that reasoning emerges autonomously through pure Reinforcement Learning on rule-based outcome rewards (e.g. did the compiler pass? is the math answer correct?), without human-authored thinking demonstrations."
        },
        {
          w: "The internal thinking tokens generated by reasoning models are completely free of charge.",
          r: "Thinking tokens are fully materialized autoregressive forward passes on GPU hardware. API providers bill for internal thinking tokens as standard output tokens, making complex reasoning calls significantly more expensive."
        },
        {
          w: "Reasoning models are completely immune to hallucinations.",
          r: "While reasoning models drastically reduce logical and deductive errors in math and code, they can still hallucinate non-existent empirical facts, citations, or API specifications if they lack external grounding."
        }
      ],

      trade: {
        buys: [
          "Superhuman performance on competitive programming (Codeforces), Olympiad mathematics (AIME), and complex logic.",
          "Autonomous error detection and backtracking: self-corrects mistakes before emitting final answers.",
          "Dynamic test-time compute: automatically spends more time thinking on difficult problems and less on easy ones."
        ],
        costs: [
          "High end-to-end latency: users must wait 5 to 60 seconds for the model to finish its internal deliberation.",
          "Multiplied token costs: generating thousands of hidden thinking tokens significantly inflates per-query billing.",
          "Prone to over-thinking simple questions, producing needlessly complex or overly literal responses."
        ],
        avoid: [
          "Deploying reasoning models in real-time latency-critical customer support chat interfaces.",
          "Using reasoning models for open-ended creative writing where logical proof verification is meaningless."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "model-routing",

      why: {
        before: "Applications routed 100% of user queries to a single monolithic frontier model (e.g. GPT-4), " +
          "wasting millions of dollars by using a massive model for trivial tasks like 'Hello' or 'Extract the date'.",
        problem: "In production, over 70% of user requests are simple, low-complexity tasks; " +
          "paying frontier model prices (\\$10+/1M tokens) for basic queries destroys unit economics.",
        shift: "**Model Routing: Intelligent hierarchical request triage.** " +
          "Deploy a lightweight router (classifier, embedding similarity, or small SLM) that analyzes incoming prompts " +
          "and dynamically dispatches them to the cheapest, fastest model capable of solving that specific task tier."
      },

      num: {
        t: "Model routing tier architecture & economic cost savings",
        h: ["Routing Tier", "Assigned Model Class", "Query Share", "Latency & Cost Profile"],
        r: [
          ["**Tier 1: Lightweight Edge**", "Small Language Model ($1\\text{B} - 3\\text{B}$ / Gemma, Llama 8B)", "**$\\approx 50 - 60\\%$ of queries**", "**Ultra-fast ($<200\\text{ ms}$)**; cost is $\\approx \\$0.10 / 1\\text{M}$ tokens"],
          ["**Tier 2: General Purpose**", "Mid-sized Model ($70\\text{B}$ / Claude 3.5 Sonnet, GPT-4o-mini)", "**$\\approx 30 - 35\\%$ of queries**", "Fast; cost is $\\approx \\$0.50 - \\$3.00 / 1\\text{M}$ tokens"],
          ["**Tier 3: Frontier Reasoning**", "Heavy Frontier / Reasoning (GPT-4o, o1, Claude Opus)", "**$\\approx 10\\%$ of queries**", "High latency; cost is $\\approx \\$15 - \\$60 / 1\\text{M}$ tokens"],
          ["**Blended Cost Reduction**", "**Up to $70 - 85\\%$ total bill reduction**", "100% of queries routed dynamically", "**Maintains 98% of frontier benchmark accuracy** across the system"]
        ],
        n: "Model Routing is the premier architectural strategy for optimizing " +
          "enterprise AI unit economics. The foundational premise is that **different tasks " +
          "exhibit vastly different intrinsic complexity**. Routing architectures operate " +
          "through three primary mechanisms: " +
          "(1) **Semantic Embedding Routing**: the user's prompt is embedded via a fast embedding model; " +
          "if cosine similarity matches a known cluster of simple tasks (e.g. FAQ retrieval, date extraction), " +
          "it routes immediately to a cheap 8B model. " +
          "(2) **Classifier Routing (e.g. RouteLLM, Martian)**: a lightweight BERT or MLP classifier " +
          "evaluates the syntactic and structural complexity of the query, predicting whether a smaller " +
          "model can achieve quality parity with a frontier model. " +
          "(3) **LLM Cascade / Fallback**: the request is sent to the cheap small model first; " +
          "an automated evaluator verifies the output (checking confidence, format validity, or test passes); " +
          "if the cheap model fails, the request escalates automatically to the frontier reasoning model. " +
          "Production implementations consistently prove that **routing 80% of volume to small models " +
          "slashes enterprise API bills by over 70%** while cutting P50 latency in half."
      },

      miss: [
        {
          w: "Model routing degrades user experience because users always receive worse answers from small models.",
          r: "Small models match or exceed frontier models on simple extraction, formatting, and classification tasks. Users receive identical quality answers, but with vastly lower latency (3x faster responses)."
        },
        {
          w: "The routing classifier adds more latency than it saves.",
          r: "A specialized routing classifier executes in less than 10-20 milliseconds on CPU, whereas routing an easy query to an 8B model saves hundreds of milliseconds compared to a massive 400B frontier model."
        },
        {
          w: "Model routing requires writing manual regex rules for every possible user prompt.",
          r: "Modern routing engines (RouteLLM) use learned preference models trained on Chatbot Arena win-rate data, algorithmically predicting the probability that a small model will satisfy the user."
        },
        {
          w: "Model routing is only useful for cutting costs.",
          r: "Model routing provides vital redundancy and reliability: if an upstream API provider experiences an outage, the router dynamically reroutes traffic to an alternative provider with zero downtime."
        }
      ],

      trade: {
        buys: [
          "Slashes enterprise generative AI operating costs by 70% to 85% through traffic triage.",
          "Dramatically reduces median response latency (P50) for the majority of end users.",
          "Builds multi-provider redundancy and high availability into the application architecture."
        ],
        costs: [
          "Adds architectural complexity: requires maintaining routing logic, fallback mechanisms, and multi-model API clients.",
          "Routing errors: occasionally misclassifies a subtly difficult query as simple, requiring fallback escalation.",
          "Requires continuous evaluation to recalibrate routing thresholds as underlying models are updated."
        ],
        avoid: [
          "Sending every single API call to a single frontier model without evaluating a routing tier.",
          "Building complex multi-step routing cascades for low-volume internal prototypes where simplicity matters more than cost."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "alignment",

      why: {
        before: "Pre-trained base models optimized solely for next-token prediction mirrored the worst " +
          "aspects of the internet: generating toxic rants, providing instructions for chemical weapons, and refusing to help.",
        problem: "Maximizing statistical likelihood is misaligned with human intent; models must be intentionally " +
          "steered to be helpful, honest, harmless, and socially cooperative.",
        shift: "**AI Alignment (RLHF / DPO / Constitutional AI): Value-conforming policy optimization.** " +
          "Steer the foundation model's policy using preference learning (Reinforcement Learning from Human Feedback, " +
          "Direct Preference Optimization) so its generative behaviors conform to the '3H' criteria: Helpful, Honest, and Harmless."
      },

      num: {
        t: "AI Alignment methodologies: RLHF vs DPO vs Constitutional AI",
        h: ["Alignment Methodology", "Mathematical Mechanism", "Requires Separate Reward Model?", "Algorithmic Complexity & Stability"],
        r: [
          ["**RLHF (Christiano 2017, Ouyang 2022)**", "PPO policy gradient: $\\max_\\theta \\mathbb{E}[R(x, y)] - \\beta D_{\\text{KL}}(\\pi_\\theta \\parallel \\pi_{\\text{ref}})$", "**Yes** (trains scalar reward model from human preferences)", "High: notoriously unstable; requires 4 models in GPU memory"],
          ["**DPO (Direct Preference Opt, 2023)**", "Implicit reward reparameterization: $\\mathcal{L} = -\\mathbb{E}[\\log \\sigma(\\beta \\log \\frac{\\pi(y_w)}{\\pi_{\\text{ref}}(y_w)} - \\dots)]$", "**No** (optimizes policy directly on preference pairs $(y_w, y_l)$)", "**Low / SOTA**: stable binary cross-entropy; 50% less VRAM"],
          ["**Constitutional AI (Anthropic 2022)**", "RLAIF: AI critiques and aligns itself against a written constitution", "Yes (Reward model trained by AI feedback)", "**Scalable**: eliminates human annotation bottleneck"],
          ["**Alignment Tax**", "Empirical drop on raw pre-training benchmarks", "N/A", "Mild capability degradation in exchange for safety & compliance"]
        ],
        n: "AI Alignment is the discipline of ensuring that artificial intelligence " +
          "systems reliably pursue outcomes that conform to human values and operational intent. " +
          "In the foundational framing popularized by Anthropic, alignment targets the **'3H' Criteria**: " +
          "(1) **Helpful** (the model follows instructions, provides accurate solutions, and seeks clarification); " +
          "(2) **Honest** (the model conveys accurate information and admits uncertainty without fabricating facts); " +
          "and (3) **Harmless** (the model refuses to assist with dangerous, illegal, or malicious activities). " +
          "Historically, alignment was executed via **RLHF (Reinforcement Learning from Human Feedback)**: " +
          "human annotators ranked pairs of model completions ($y_{\\text{win}} > y_{\\text{lose}}$), " +
          "a **Reward Model** was trained to predict human preference scores, and the LLM was optimized " +
          "against this reward model using **PPO (Proximal Policy Optimization)** with a KL-divergence penalty " +
          "to prevent policy collapse. In 2023, Rafael Rafailov et al. revolutionized the field with " +
          "**DPO (Direct Preference Optimization)**, which proved mathematically that the reward model can be " +
          "analytically expressed in terms of the optimal policy itself, allowing alignment to be trained " +
          "directly on preference pairs via simple binary cross-entropy **without ever training a separate reward model**."
      },

      miss: [
        {
          w: "Alignment completely deletes dangerous information from the model's memory.",
          r: "Alignment merely shifts the model's sampling probabilities so that refusal tokens are chosen when dangerous concepts are prompted. The underlying raw knowledge remains encoded in the weights and can be resurfaced via jailbreaks."
        },
        {
          w: "A perfectly aligned model will never refuse a legitimate, safe request.",
          r: "Alignment algorithms frequently suffer from 'Over-Refusal' (the Alignment Tax): safety boundaries become overly generalized, causing models to refuse historical, academic, or benign creative queries."
        },
        {
          w: "RLHF is the only way to align an LLM.",
          r: "Modern alignment increasingly uses Direct Preference Optimization (DPO), Odds Ratio Preference Optimization (ORPO), and Constitutional AI (RLAIF), which are faster, cheaper, and more numerically stable than RLHF."
        },
        {
          w: "Alignment is just corporate political censorship.",
          r: "Alignment is the sole reason modern LLMs are usable as conversational products. Without alignment, a base model will hallucinate wild continuations, swear at users, and autocomplete medical queries with internet satire."
        }
      ],

      trade: {
        buys: [
          "Transforms raw next-token predictors into helpful, cooperative, and safe conversational assistants.",
          "Protects applications from generating illegal advice, cyberweapons, and severe reputational damage.",
          "Teaches models to decline impossible questions and admit epistemic uncertainty."
        ],
        costs: [
          "Alignment Tax: can subtly reduce creative expressiveness, benchmark perplexity, and coding edge-case performance.",
          "Vulnerable to Over-Refusal: models frequently misinterpret harmless academic questions as dangerous.",
          "Curating balanced human preference datasets requires significant annotation expense and operational oversight."
        ],
        avoid: [
          "Deploying raw unaligned base foundation models in consumer-facing interactive chat products.",
          "Using complex PPO-based RLHF pipelines when DPO achieves identical alignment with 50% less compute and engineering complexity."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "red-teaming",

      why: {
        before: "AI safety testing relied on passive automated unit tests and benchmark datasets, " +
          "which failed to anticipate novel, creative attack strategies devised by human adversarial hackers.",
        problem: "Adversarial actors actively probe AI applications for edge-case vulnerabilities, " +
          "prompt injection channels, data extraction loopholes, and safety bypasses.",
        shift: "**AI Red Teaming: Proactive adversarial penetration testing.** " +
          "Deploy dedicated internal adversarial teams and automated perturbation frameworks to deliberately attack, " +
          "jailbreak, and probe AI models for security flaws, biosecurity risks, and compliance violations prior to deployment."
      },

      num: {
        t: "AI Red Teaming methodology: Manual vs Automated red teaming",
        h: ["Red Teaming Dimension", "Manual Expert Red Teaming", "Automated Red Teaming (ART / LLM Red Teams)"],
        r: [
          ["**Attack Generation**", "Human security experts, linguistic hackers, domain specialists", "**Adversarial Attacker LLMs** (prompt mutators, GCG optimizers)"],
          ["**Exploration Breadth**", "High-depth, creative, multi-turn sociological manipulation", "**Massive scale**: generates millions of attack variants across thousands of categories"],
          ["**Target Domains**", "CBRN (Chemical, Biological, Radiological, Nuclear), legal liabilities", "Prompt injection, PII extraction, toxicity, jailbreak bypasses"],
          ["**Evaluation Metric**", "**Attack Success Rate (ASR)** ($0 - 100\\%$)", "**Attack Success Rate (ASR)** across automated test matrix"],
          ["**Remediation Loop**", "Informs alignment constitutions, policy updates, and guardrail rules", "Generates synthetic DPO preference pairs for automated retraining"]
        ],
        n: "AI Red Teaming is the rigorous cybersecurity discipline of probing " +
          "AI models from an adversarial perspective. Borrowed from military and software security " +
          "traditions, red teaming treats the model as an active target to be compromised. " +
          "The process operates across two complementary modalities: " +
          "(1) **Human Red Teaming**: domain experts (chemists, cryptographers, lawyers, ethical hackers) " +
          "spend weeks attempting to coerce the model into generating hazardous outputs: " +
          "synthesizing biological pathogens (CBRN), writing zero-day exploit payloads, " +
          "extracting confidential enterprise system prompts, or committing slander. " +
          "(2) **Automated Red Teaming (ART)**: because manual probing cannot cover millions of combinatorial " +
          "linguistic paths, teams deploy **Attacker LLMs** trained via reinforcement learning to automatically " +
          "mutate, rephrase, and escalate adversarial prompts against the target model. " +
          "Every successful jailbreak or policy violation discovered during red teaming is labeled, " +
          "cataloged, and fed directly into the model's alignment pipeline as **negative preference pairs** " +
          "for subsequent DPO retraining or used to calibrate external guardrail classifiers."
      },

      miss: [
        {
          w: "Red teaming is only necessary for massive foundation model creators like OpenAI and Anthropic.",
          r: "Any enterprise deploying an LLM connected to internal databases or APIs must red-team their specific application to defend against indirect prompt injection, data exfiltration, and unauthorized tool execution."
        },
        {
          w: "A successful red team exercise means the model is now 100% secure.",
          r: "Security is an ongoing operational posture, not a static milestone. Red teaming identifies known vulnerabilities; new adversarial attack vectors and jailbreaks emerge continuously."
        },
        {
          w: "Automated red teaming completely replaces the need for human red teamers.",
          r: "Automated tools excel at broad linguistic permutation, but lack the domain intuition to discover subtle multi-step attacks in specialized disciplines like synthetic biology or financial fraud."
        },
        {
          w: "Red teaming is identical to standard software quality assurance (QA).",
          r: "Standard QA tests whether the software works correctly under expected user behavior. Red teaming tests whether the software can be subverted under hostile, malicious, and adversarial conditions."
        }
      ],

      trade: {
        buys: [
          "Exposes catastrophic security vulnerabilities, prompt injections, and legal liabilities prior to public launch.",
          "Generates high-value adversarial datasets to harden models via DPO alignment retraining.",
          "Required to satisfy international AI regulatory standards (e.g. White House Executive Order, EU AI Act)."
        ],
        costs: [
          "High financial cost: hiring elite domain experts and cybersecurity red-teamers is expensive.",
          "Can delay product launch timelines while vulnerabilities are remediated and re-tested.",
          "Automated red teaming generates massive API compute and token billing overhead."
        ],
        avoid: [
          "Launching public-facing AI agents with API write privileges without conducting structured adversarial red teaming.",
          "Treating red teaming as a one-time pre-launch checklist item rather than an ongoing operational practice."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "open-weight-model",

      why: {
        before: "Frontier AI was entirely locked inside proprietary commercial APIs (OpenAI, Google, Anthropic), " +
          "leaving developers with zero transparency into internal weights, architecture, or training data.",
        problem: "Enterprises in defense, healthcare, and finance cannot send sensitive proprietary data " +
          "to third-party cloud APIs due to strict data sovereignty, privacy, and regulatory compliance laws.",
        shift: "**Open-Weight Model: Decentralized self-hosted foundation weights.** " +
          "Distribute trained neural network weight files publicly under open or permissive commercial licenses (Llama 3, Mistral, Qwen, DeepSeek), " +
          "enabling complete local on-premises deployment, private fine-tuning, and zero vendor lock-in."
      },

      num: {
        t: "Closed Commercial API vs Open-Weight Model operational comparison",
        h: ["Dimension / Requirement", "Closed Commercial API (OpenAI / Anthropic)", "Open-Weight Model (Llama / Mistral / DeepSeek)"],
        r: [
          ["**Deployment Infrastructure**", "Hosted vendor cloud; access via HTTPS REST API", "**Self-hosted on-premise**, private cloud (AWS/GCP), or local workstation"],
          ["**Data Privacy & Compliance**", "Data leaves enterprise perimeter; subject to vendor terms", "**100% Data Sovereignty**: runs completely offline in air-gapped data centers"],
          ["**Customization Freedom**", "Limited to API parameters and hosted fine-tuning", "**Infinite control**: full weight access, LoRA, custom CUDA kernels, quantization"],
          ["**Operational Cost Model**", "Variable operational expense (pay per token)", "**Fixed capital/compute expense** (GPU server leasing or purchase)"],
          ["**Model Transparency**", "Black-box weights; unannounced behavioral drift / deprecation", "**Immutable, reproducible weights**: model never changes or expires unexpectedly"]
        ],
        n: "Open-Weight Models represent the democratization and decentralization " +
          "of artificial intelligence. Pioneered by Meta's release of the **Llama series** " +
          "(Touvron et al. 2023), followed by **Mistral**, **Qwen**, and **DeepSeek**, " +
          "an open-weight model is a foundation model whose complete numerical parameter tensors " +
          "(e.g. safetensors checkpoints) are released publicly for download. " +
          "It is important to distinguish **Open-Weight** from strictly **Open-Source**: " +
          "most open-weight models release the final weights, but withhold the raw pre-training " +
          "datasets and pre-training code pipelines. " +
          "Open-weight models provide four decisive enterprise advantages: " +
          "(1) **Absolute Data Sovereignty**: models can be deployed on isolated, air-gapped servers, " +
          "guaranteeing that patient records, classified military intelligence, or proprietary financial " +
          "codebases never leave the corporate firewall. " +
          "(2) **No Behavioral Drift**: proprietary API models are periodically updated or modified by providers, " +
          "often breaking downstream application prompts; open-weight models are immutable and reproducible forever. " +
          "(3) **Hyper-Optimization**: open weights can be quantized (INT4, FP8), compiled with TensorRT-LLM, " +
          "or adapted with custom LoRA layers. (4) **Cost Decoupling**: at high volume, self-hosting open-weight " +
          "models on reserved GPU instances is significantly cheaper than paying metered API token rates."
      },

      miss: [
        {
          w: "Open-weight models are always inferior to closed proprietary models.",
          r: "State-of-the-art open models (Llama 3 405B, DeepSeek V3/R1) match or exceed proprietary models (GPT-4o, Claude 3.5 Sonnet) across premier coding, reasoning, and knowledge benchmarks."
        },
        {
          w: "An open-weight model is 100% free to use in production.",
          r: "While the software weights are free, running a 70B model requires expensive GPU hardware (e.g. 2x A100s or 4x RTX 4090s) and ongoing electrical and cloud hosting costs."
        },
        {
          w: "Open-weight models have no licensing restrictions.",
          r: "Many open models use custom commercial licenses (e.g. Meta Llama 3 requires a custom license if an application exceeds 700 million monthly active users). Licenses must be formally reviewed for commercial compliance."
        },
        {
          w: "You cannot serve open-weight models at high concurrent user throughput.",
          r: "Modern open-source inference engines (vLLM, TGI, TensorRT-LLM) deliver world-class serving throughput using PagedAttention, continuous batching, and tensor parallelism matching commercial API speeds."
        }
      ],

      trade: {
        buys: [
          "Complete data sovereignty and privacy: enables deployment in air-gapped, HIPAA, and defense environments.",
          "Immutable stability: eliminates unexpected API behavioral drift, price hikes, and model deprecation shutdowns.",
          "Deep architectural control: inspect activations, fine-tune all layers, quantize to 4-bit, and optimize CUDA kernels."
        ],
        costs: [
          "Requires dedicated MLOps infrastructure: managing GPU clusters, hardware failures, and serving runtimes.",
          "Fixed hosting costs regardless of user traffic (unlike serverless pay-per-token APIs).",
          "Responsible for your own security, red-teaming, and content moderation guardrails."
        ],
        avoid: [
          "Self-hosting large open models on cloud GPU instances with low, sporadic traffic when serverless APIs are cheaper.",
          "Failing to review the specific commercial license terms of open-weight models before enterprise deployment."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "latency",

      why: {
        before: "Web APIs returned responses in single synchronous blocks, where latency was simply " +
          "the round-trip HTTP request-response time.",
        problem: "Generative LLMs produce responses autoregressively token by token; " +
          "waiting for a 1,000-token completion to finish before displaying anything causes unbearable 20-second user wait times.",
        shift: "**Generative Latency Profiling: Decomposing TTFT and Inter-Token Latency.** " +
          "Decompose serving latency into Time-To-First-Token (TTFT, compute-bound pre-fill) and " +
          "Inter-Token Latency (ITL / Time-per-Output-Token, memory-bandwidth-bound decoding), optimizing both via streaming and KV-caching."
      },

      num: {
        t: "LLM latency decomposition metrics & production SLA targets",
        h: ["Latency Metric", "Operational Phase", "Hardware Bound Regime", "Target Production SLA (Interactive Chat)"],
        r: [
          ["**Time To First Token (TTFT)**", "Prompt Ingestion (Prefill)", "**Compute Bound** (GEMM over entire prompt)", "**$< 500 - 800\\text{ ms}$** (critical for perceived responsiveness)"],
          ["**Time Per Output Token (TPOT / ITL)**", "Token Generation (Decode)", "**Memory Bandwidth Bound** (reading weights per token)", "**$< 20 - 40\\text{ ms/token}$** ($25 - 50\\text{ tokens/sec}$)"],
          ["**End-to-End Latency ($T_{\\text{total}}$)**", "$\\text{TTFT} + (N_{\\text{out}} \\times \\text{TPOT})$", "Combined lifecycle", "Depends entirely on requested output length $N_{\\text{out}}$"],
          ["**P99 Tail Latency**", "Worst 1% response times", "KV-cache evictions & queue contention", "**$< 2\\times$ P50 latency** (requires continuous batching)"],
          ["**Human Reading Speed**", "Average human reading rate", "Cognitive threshold", "**$\\approx 5 - 8\\text{ words/sec}$** ($6 - 10\\text{ tokens/sec}$); TPOT $>30\\text{ tps}$ feels instantaneous"]
        ],
        n: "Latency in Generative AI differs fundamentally from traditional web services " +
          "because response duration is **dynamic and sequential**. " +
          "Production systems evaluate latency through two independent metrics: " +
          "(1) **Time-To-First-Token (TTFT)**: the time elapsed from when the user submits a prompt " +
          "until the very first output token appears on the screen. TTFT is dominated by the **Prefill Phase**: " +
          "ingesting the prompt requires parallel matrix multiplications across all input tokens. " +
          "Long system prompts and massive RAG contexts directly inflate TTFT. " +
          "(2) **Time-Per-Output-Token (TPOT)** (also called Inter-Token Latency, ITL): the time required " +
          "to generate each subsequent token during the **Decode Phase**. Because autoregressive generation " +
          "must stream all model weights from GPU VRAM for every single token, TPOT is strictly bound " +
          "by GPU **memory bandwidth**. " +
          "Because the average human reads at roughly 5 to 8 words per second (~7 tokens/sec), " +
          "achieving an ITL of 30 ms per token (~33 tokens/sec) means the model generates text **substantially " +
          "faster than human reading speed**. When paired with **Streaming**, high TTFT and high generation speeds " +
          "create an interface that feels instantaneous to the end user."
      },

      miss: [
        {
          w: "Total end-to-end latency is the best metric to optimize for conversational chat applications.",
          r: "In interactive chat, Time-To-First-Token (TTFT) paired with streaming is vastly more important. A user who sees tokens streaming within 300ms perceives the app as instantaneous, even if the full response takes 10 seconds to finish."
        },
        {
          w: "Increasing GPU computing power (TFLOPS) always speeds up token generation (TPOT).",
          r: "During the autoregressive decode phase, generation is strictly memory-bandwidth bound, not compute-bound. Upgrading to a GPU with higher memory bandwidth (HBM3) accelerates generation; adding more compute cores does not."
        },
        {
          w: "Prompt length has no impact on latency once generation begins.",
          r: "Prompt length directly increases TTFT (more tokens to prefill) and inflates the size of the KV-cache, which increases memory traffic and can slow down generation during high concurrent load."
        },
        {
          w: "Batching multiple user requests together speeds up individual request latency.",
          r: "Batching maximizes overall SYSTEM THROUGHPUT (tokens per second per GPU), but slightly INCREASES individual request latency due to memory contention. Systems balance batch size to respect latency SLAs."
        }
      ],

      trade: {
        buys: [
          "Understanding latency bottlenecks enables surgical optimization (e.g. prompt caching for TTFT, quantization for TPOT).",
          "Streaming architecture masks decode latency, delivering world-class perceived user responsiveness.",
          "Proper SLA modeling ensures applications meet real-time voice and conversational interface thresholds."
        ],
        costs: [
          "Optimizing for ultra-low latency often requires smaller models, higher quantization, or costly un-batched GPU allocations.",
          "Speculative decoding to lower TPOT requires deploying secondary draft models and consumes extra compute.",
          "Monitoring granular latency metrics (TTFT, ITL, P99) requires specialized APM observability tooling."
        ],
        avoid: [
          "Buffering the entire LLM response on the server before sending it to the client (always stream tokens).",
          "Stuffing massive 50,000-token prompts into latency-sensitive voice or real-time autocomplete APIs."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "streaming",

      why: {
        before: "APIs waited for the language model to complete its entire generation (taking 5 to 30 seconds) " +
          "before returning a monolithic JSON HTTP response, leaving users staring at a frozen spinner.",
        problem: "Autoregressive generation takes 30-50ms per token; a 500-token answer takes 20 seconds to complete, " +
          "creating an unacceptably sluggish user experience that feels unresponsive and broken.",
        shift: "**Token Streaming (Server-Sent Events / SSE): Incremental real-time output delivery.** " +
          "Establish an open, persistent HTTP connection using Server-Sent Events (SSE) or WebSockets, " +
          "transmitting each token to the client interface the exact millisecond it is sampled from the GPU."
      },

      num: {
        t: "Non-Streaming vs Streaming user experience and network protocol comparison",
        h: ["Protocol / Pattern", "Perceived User Wait Time", "Network Transport Protocol", "Connection Lifecycle"],
        r: [
          ["**Non-Streaming (Standard HTTP POST)**", "Full completion time ($5 - 30\\text{ seconds}$)", "Standard HTTP/1.1 or HTTP/2 JSON", "Single request $\\to$ wait $\\to$ single monolithic response"],
          ["**Server-Sent Events (SSE / Streaming)**", "**Instantaneous**: first token appears in **$< 400\\text{ ms}$**", "`text/event-stream` over HTTP", "Unidirectional stream; server pushes token events chunks continuously"],
          ["**WebSockets**", "Instantaneous ($< 400\\text{ ms}$)", "Full-duplex `ws://` protocol", "Bi-directional persistent socket; ideal for real-time voice agents"],
          ["**Data Chunk Format**", "`data: {\"choices\": [{\"delta\": {\"content\": \"hello\"}}]}\`", "Standardized across OpenAI / Anthropic", "Terminated by special `data: [DONE]` payload"],
          ["**Psychological Impact**", "Users perceive slow, broken software", "**Users read while generation occurs**", "Completely eliminates the perception of generation latency"]
        ],
        n: "Token Streaming is the defining user interface pattern of the Generative " +
          "AI era. Because autoregressive models generate text token-by-token sequentially, " +
          "waiting for the entire sequence to finish before responding is unnecessary and poor UX. " +
          "Streaming is universally implemented using **Server-Sent Events (SSE)** over standard HTTP: " +
          "(1) The client issues a standard HTTP `POST` request with the configuration flag `\"stream\": true`. " +
          "(2) The server responds immediately with HTTP headers: " +
          "`Content-Type: text/event-stream`, `Cache-Control: no-cache`, and `Connection: keep-alive`. " +
          "(3) As the GPU finishes each autoregressive forward pass and samples a new token, the serving " +
          "engine dispatches an individual SSE chunk formatted as: " +
          "`data: {\"choices\": [{\"delta\": {\"content\": \"token_text\"}}]}\n\n`. " +
          "(4) The client's JavaScript `fetch` API consumes the response stream using a `ReadableStreamDefaultReader`, " +
          "parsing chunks and appending text directly to the DOM in real time. " +
          "(5) Once the model emits the end-of-sequence token (`<|endoftext|>`), the server sends " +
          "`data: [DONE]\n\n` and closes the connection. " +
          "Streaming masks generation latency by aligning output display with human reading speed."
      },

      miss: [
        {
          w: "Streaming makes the GPU generate tokens faster under the hood.",
          r: "Streaming does not alter generation speed at all: the GPU computes tokens at the exact same physical pace. Streaming changes WHEN the tokens are transmitted to the user, eliminating perceived wait time."
        },
        {
          w: "Server-Sent Events (SSE) require setting up complex WebSocket servers.",
          r: "SSE runs over standard, unidirectional HTTP requests. Any standard web server (FastAPI, Express, Next.js) can stream SSE events without requiring complex bidirectional WebSocket infrastructure."
        },
        {
          w: "You cannot perform output guardrail checks or schema validation when streaming.",
          r: "Production systems use chunked stream buffering: tokens are buffered in sliding windows (or parsed via streaming JSON parsers like `jitson`) to validate safety or syntax before displaying them."
        },
        {
          w: "Streaming works automatically across all corporate enterprise proxies.",
          r: "Many corporate firewalls and HTTP reverse proxies (like default Nginx configurations) buffer HTTP responses by default. Streaming requires explicitly configuring `X-Accel-Buffering: no` to prevent intermediate buffering."
        }
      ],

      trade: {
        buys: [
          "Transforms perceived user latency from 20 seconds to sub-second responsiveness.",
          "Engages users immediately: humans begin reading and processing information while the model continues generating.",
          "Enables early user termination: users can hit 'Stop' if the model takes an incorrect path, saving GPU compute."
        ],
        costs: [
          "Network connection management: holding HTTP connections open across long streams strains server connection pools.",
          "Intermediate proxy buffering (Nginx, Cloudflare) can silently break streaming if buffer headers are misconfigured.",
          "Complicates post-generation processing (e.g. logging full answers, token counting, and output guardrails)."
        ],
        avoid: [
          "Failing to disable response buffering in reverse proxies (`proxy_buffering off;` in Nginx).",
          "Building conversational AI chat applications without enabling streaming tokens."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "knowledge-cutoff",

      why: {
        before: "Users assumed that because Large Language Models were connected to the internet, " +
          "they possessed real-time awareness of breaking news, recent elections, and current stock prices.",
        problem: "Pre-training a foundation model takes months; the model's parametric knowledge " +
          "is permanently frozen on the date its pre-training dataset was compiled and crawled.",
        shift: "**Knowledge Cutoff: The temporal horizon of parametric memory.** " +
          "Acknowledge that neural weights are frozen snapshots of past data; mitigate knowledge limitations " +
          "by integrating Retrieval-Augmented Generation (RAG) and search tools for events occurring after the cutoff date."
      },

      num: {
        t: "Frontier model knowledge cutoff milestones & temporal boundaries",
        h: ["Model Architecture", "Release Date", "Knowledge Cutoff Date", "Handling Post-Cutoff Queries"],
        r: [
          ["**GPT-3 (Original)**", "June 2020", "**June 2020**", "Hallucinates or asserts events did not happen"],
          ["**GPT-4 (Original)**", "March 2023", "**September 2021**", "Politely states knowledge cutoff; refuses to guess"],
          ["**Llama 3 (8B / 70B)**", "April 2024", "**March 2023** (8B) / **December 2023** (70B)", "Requires external RAG for 2024+ events"],
          ["**GPT-4o**", "May 2024", "**October 2023**", "Integrated with live web search tool fallback"],
          ["**RAG Grounded Model**", "Any base model", "**Current Time ($t_{\\text{now}}$)**", "**Real-time**: dynamically retrieves live web/database data"]
        ],
        n: "The Knowledge Cutoff is the definitive temporal boundary " +
          "of a foundation model's **parametric memory**. Training an LLM requires " +
          "crawling the web, filtering petabytes of text, tokenizing, and running gradient " +
          "descent across thousands of GPUs for months. The exact day that the data collection " +
          "pipeline ceases ingestion establishes the model's **knowledge cutoff date**. " +
          "For any event, discovery, political election, or software library released *after* " +
          "that date, the model has **zero internal knowledge**. " +
          "When asked about events beyond its cutoff date, a model behaves in one of three ways: " +
          "(1) **Aligned Refusal**: a well-aligned model recognizes the temporal mismatch and admits: " +
          "*'My knowledge cutoff is October 2023, so I cannot provide information on the 2024 election'*; " +
          "(2) **Severe Extrinsic Hallucination**: an unaligned or poorly prompted model attempts to " +
          "autocomplete the query, fabricating plausible-sounding fictional events, fake winners, or non-existent laws; " +
          "or (3) **Temporal Anachronism**: the model assumes deceased public figures are still alive or refers " +
          "to historical events as future possibilities. " +
          "Eliminating the knowledge cutoff barrier in production is achieved exclusively through " +
          "**external grounding**: connecting the LLM to live web search engines, enterprise databases, and **RAG**."
      },

      miss: [
        {
          w: "Telling an LLM the current date in the system prompt gives it knowledge of current events.",
          r: "Injecting `Today is September 2026` in the system prompt only informs the model of the current calendar date; it does NOT magically populate its neural weights with news, stock prices, or events that occurred after its training cutoff."
        },
        {
          w: "Continuous pre-training every week is the best way to keep an LLM's knowledge fresh.",
          r: "Continuous pre-training is financially prohibitive, risks catastrophic forgetting of early skills, and introduces training instability. Real-time updates are handled via RAG and web search tools."
        },
        {
          w: "An LLM's knowledge cutoff is identical to its release date.",
          r: "Training and aligning a frontier model takes 6 to 12 months after data collection ends. A model released in mid-2024 often has a knowledge cutoff dating back to late 2023."
        },
        {
          w: "Models always know what their own knowledge cutoff date is.",
          r: "Base models do not know when their data was collected. Models only state their cutoff date because it was explicitly hardcoded into their system prompts or instruction-tuning datasets during alignment."
        }
      ],

      trade: {
        buys: [
          "Clear epistemic boundary: allows developers to design fallback triggers for time-sensitive questions.",
          "Enforces alignment discipline: well-trained models decline to answer rather than hallucinating recent news.",
          "Highlights when external RAG or live tool invocation is strictly required."
        ],
        costs: [
          "Static parametric memory: model rapidly becomes obsolete on evolving software APIs, libraries, and laws.",
          "Requires engineering live search and retrieval tooling to handle recent real-time queries.",
          "System prompt injection of temporal metadata is required to anchor the model's relative time reasoning."
        ],
        avoid: [
          "Relying on closed-book LLM memory for dynamic, fast-evolving topics (current stock prices, sports scores, weather).",
          "Forgetting to inject the current date into the system prompt when building conversational scheduling or calendar assistants."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "gpt",

      why: {
        before: "Natural Language Processing was dominated by bidirectional masked encoders (BERT) " +
          "or complex recurrent seq2seq models, assuming generative language modeling required separate encoder-decoder architectures.",
        problem: "Bidirectional models cannot generate fluent long-form text autoregressively, " +
          "while encoder-decoder models suffered from architectural complexity and fragmented task interfaces.",
        shift: "**GPT (Generative Pre-trained Transformer, Radford et al. 2018, OpenAI): Autoregressive decoder-only scaling.** " +
          "Pre-train a stack of causal Transformer decoder blocks using a simple next-token prediction objective, " +
          "proving that scaling pure autoregressive models unlocks universal multi-task learning, in-context reasoning, and conversational intelligence."
      },

      num: {
        t: "GPT architectural scaling lineage: GPT-1 to GPT-4",
        h: ["Model Generation", "Release Year", "Parameter Scale", "Context Window", "Architectural Breakthrough"],
        r: [
          ["**GPT-1**", "2018", "$117$ Million", "$512$ tokens", "Showed generative pre-training + supervised fine-tuning outperforms task-specific models"],
          ["**GPT-2**", "2019", "$1.5$ Billion", "$1,024$ tokens", "**Zero-shot multi-task emergence**: showed models learn tasks without explicit supervision"],
          ["**GPT-3**", "2020", "$175$ Billion", "$2,048$ tokens", "**In-Context Learning (Few-Shot)**: proved massive scale unlocks general reasoning"],
          ["**GPT-4**", "2023", "$\\approx 1.8$ Trillion (MoE)", "$32\\text{k} - 128\\text{k}$ tokens", "**Mixture of Experts (MoE)**, multimodal vision integration, professional exam dominance"],
          ["**Shared objective**", "all", "—", "—", "**Autoregressive loss** $\\mathcal{L} = -\\sum \\log P(x_t \\mid x_{<t})$ with strictly causal masking — one text-in, text-out interface for every task"]
        ],
        n: "GPT (Generative Pre-trained Transformer) is the defining architectural " +
          "family of modern artificial intelligence. Conceived by Alec Radford and colleagues " +
          "at OpenAI in 2018, GPT proved that the simplest possible objective—**predicting the next " +
          "token in a text stream**—is sufficient to learn generalized representations of language, " +
          "logic, and the physical world. Unlike BERT (which used bidirectional attention to encode text " +
          "for classification), GPT uses a **Decoder-Only architecture** equipped with strict **Causal " +
          "Masking**: when predicting token $t$, the self-attention mechanism masks out all future tokens " +
          "($j > t$), forcing the model to predict the future purely from the past. " +
          "The evolutionary history of GPT validates the **Scaling Hypothesis**: " +
          "**GPT-1 (117M)** demonstrated transfer learning; " +
          "**GPT-2 (1.5B)** revealed that scaling unsupervised models enables zero-shot task execution; " +
          "**GPT-3 (175B)** unlocked **In-Context Learning**, showing that scaling parameters by 100x " +
          "allows a model to learn new tasks at inference time via demonstration prompts without weight updates; " +
          "and **GPT-4** scaled to a massive **Sparse Mixture of Experts (MoE)** architecture, achieving " +
          "human-level scores on the Uniform Bar Exam, USABO, and GRE. GPT's unified 'text-to-text' paradigm " +
          "rendered dozens of specialized legacy NLP architectures obsolete."
      },

      miss: [
        {
          w: "GPT models use an encoder and a decoder.",
          r: "GPT is strictly a DECODER-ONLY architecture. It completely discards the encoder and cross-attention mechanisms of the original Vaswani Transformer, relying entirely on causal masked self-attention."
        },
        {
          w: "GPT-4 is a single dense 1.8 trillion parameter model.",
          r: "GPT-4 is widely understood to be a Sparse Mixture-of-Experts (MoE) architecture (e.g. 16 experts of ~110B parameters each), routing each token dynamically to only 2 active experts, keeping inference compute manageable."
        },
        {
          w: "GPT models can look ahead at future words during training.",
          r: "GPT utilizes an upper-triangular causal attention mask where all entries for $j > i$ are set to $-\\infty$. Looking ahead is mathematically prohibited during both training and inference."
        },
        {
          w: "GPT is an OpenAI-exclusive proprietary architecture that cannot be replicated.",
          r: "The GPT architecture is public and universal: Meta's Llama, Mistral, Qwen, DeepSeek, and Gemma are all fundamentally GPT-style autoregressive causal decoder-only Transformers."
        }
      ],

      trade: {
        buys: [
          "Universal generative interface: unifies translation, coding, reasoning, extraction, and conversation into one model.",
          "Monotonic scalability: performance scales predictably as compute and parameters increase.",
          "Native autoregressive generation: effortlessly outputs long-form text, code files, and reasoning chains."
        ],
        costs: [
          "Sequential generation latency: autoregressive decoding is inherently bound by GPU memory bandwidth.",
          "Causal mask limits bidirectional understanding compared to BERT on extractive feature embedding tasks.",
          "Quadratic self-attention complexity $\\mathcal{O}(N^2)$ without FlashAttention or sliding-window attention."
        ],
        avoid: [
          "Using GPT decoder-only models for high-throughput sentence embeddings when bidirectional encoder models (BERT/E5) are faster and more accurate.",
          "Deploying massive 175B+ GPT models without prompt caching and continuous batching."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "bert",

      why: {
        before: "Language representations were unidirectional: models like Word2Vec were static, " +
          "and early language models (GPT-1) read text strictly left-to-right, failing to utilize right-side context when understanding ambiguous words.",
        problem: "In sentence understanding ('The bank of the river' vs 'The bank of England'), the meaning of 'bank' " +
          "depends simultaneously on words appearing both before and after it; causal left-to-right models are blind to future context.",
        shift: "**BERT (Devlin et al. 2018, Google): Bidirectional Encoder Representations from Transformers.** " +
          "Pre-train an unmasked Transformer Encoder using Masked Language Modeling (MLM), " +
          "enabling every token to attend to both left and right context simultaneously to generate deeply contextualized representations."
      },

      num: {
        t: "BERT vs GPT architectural & objective comparison",
        h: ["Dimension / Property", "BERT (Bidirectional Encoder)", "GPT (Causal Decoder)"],
        r: [
          ["**Transformer Architecture**", "**Encoder-Only** (no causal masking)", "**Decoder-Only** (strict causal mask)"],
          ["**Attention Direction**", "**Fully Bidirectional**: token $i$ attends to all $1 \\dots N$ tokens", "**Unidirectional**: token $i$ attends only to past tokens $j \\le i$"],
          ["**Pre-training Objective**", "**Masked Language Modeling (MLM)** ($15\\%$ masked tokens)", "**Next-Token Prediction** (Causal Autoregressive)"],
          ["**Text Generation Capability**", "**Incapable**: cannot generate autoregressive text", "**Native**: world-class long-form text generation"],
          ["**Ideal Downstream Tasks**", "**Classification, Named Entity Recognition (NER), Semantic Search, Reranking**", "Conversational Chat, Reasoning, Coding, Creative Writing"]
        ],
        n: "BERT (Bidirectional Encoder Representations from Transformers) " +
          "was introduced by Jacob Devlin and colleagues at Google in 2018, transforming " +
          "discriminative Natural Language Processing. Prior to BERT, language models were strictly " +
          "left-to-right, because allowing tokens to look ahead in standard next-token prediction " +
          "would allow the model to trivially 'cheat' by copying the target token. " +
          "Devlin et al. solved this by introducing **Masked Language Modeling (MLM)** (the 'Cloze' task): " +
          "15% of the tokens in an input sentence are randomly selected; 80% of these are replaced with " +
          "a special `[MASK]` token, 10% are replaced with a random word, and 10% remain unchanged. " +
          "The model's task is to predict the original masked tokens based on the bidirectional " +
          "surrounding context: $\\mathcal{L}_{\\text{MLM}} = -\\sum_{i \\in \\text{Mask}} \\log P(x_i \\mid X_{\\setminus i})$. " +
          "Because every layer employs **unconstrained bidirectional self-attention**, the hidden " +
          "state for each token integrates deep contextual clues from both the past and future. " +
          "While BERT cannot generate running text, it became the undisputed king of **discriminative NLP**: " +
          "text classification, semantic similarity, named entity recognition (NER), extractive question answering, " +
          "and search engine query understanding (powering Google Search)."
      },

      miss: [
        {
          w: "BERT can be used as a conversational chatbot like ChatGPT.",
          r: "BERT is an Encoder-Only model: it has no autoregressive decoding loop and cannot generate conversational responses. It is designed strictly for encoding, classification, embedding, and extraction."
        },
        {
          w: "BERT is obsolete and has been completely replaced by modern LLMs.",
          r: "BERT models (and modern descendants like RoBERTa, DeBERTa-v3, and BGE) remain the dominant, cost-effective standard for search engine ranking, vector embedding generation, and high-throughput classification, processing thousands of queries/sec on single CPUs."
        },
        {
          w: "The [CLS] token automatically captures the entire meaning of the sentence without fine-tuning.",
          r: "In raw pre-trained BERT, the [CLS] token is not an optimal sentence embedding; it requires contrastive fine-tuning (Sentence-BERT / SBERT) to produce state-of-the-art cosine similarity embeddings."
        },
        {
          w: "Next Sentence Prediction (NSP) was the most important part of BERT's training.",
          r: "Subsequent research (RoBERTa, Liu et al. 2019) proved that the Next Sentence Prediction (NSP) task was unnecessary and degraded performance; modern BERT variants train exclusively on Masked Language Modeling."
        }
      ],

      trade: {
        buys: [
          "Deep, unconstrained bidirectional context: captures nuanced sentence semantics far better than unidirectional models.",
          "Exceptional efficiency for classification and extraction: small 110M parameter models run with millisecond latency on standard CPUs.",
          "Powers modern dense vector search embeddings (SBERT, BGE) and Cross-Encoder re-rankers."
        ],
        costs: [
          "Completely incapable of autoregressive free-form text generation.",
          "Pre-training via Masked Language Modeling is data-inefficient (only 15% of tokens produce gradients per pass).",
          "Hard context length limit: classical BERT is rigidly constrained to a maximum of 512 tokens."
        ],
        avoid: [
          "Attempting to force BERT to generate text or act as an interactive conversational agent.",
          "Using raw un-tuned BERT `[CLS]` token vectors for semantic cosine similarity search (use Sentence-BERT or modern embedding models)."
        ]
      }
    }

  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
