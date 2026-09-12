/* Technical interview rehearsal — saying the answers out loud.

   The question bank in the Question Bank section tests whether you *know*
   these. This tests whether you can *say* them, which is a different skill and
   the one actually being graded in the room. Reading an answer and producing
   one under observation feel nothing alike, and the gap only closes by
   speaking.

   Every activity here is `kind: "prompt"` — an open question marked on the
   points covered, the pace, the filler density and the length against a
   brief. The `expect` lists are pipe-separated alternatives because there is
   never one right word; the `avoid` lists are the specific hedges and
   overclaims that make a technically correct answer land badly.
*/
TD.addSpeakSessions([

  {
    id: "explain-attention",
    t: "Explain attention, three ways",
    m: "room",
    track: "dsa",
    lvl: "core",
    icon: "brain",
    s: "The most-asked GenAI question, at three different audience levels.",
    why: "Interviewers ask you to explain attention to a non-technical person specifically to see whether you understand it or have memorised a formula. If you can only produce the formula, that shows immediately.",
    goal: [
      "Explain self-attention without notation, in under a minute",
      "Give the technical version with the formula and the √d justification",
      "Say why transformers replaced RNNs, in the right order"
    ],
    coach: [
      "The plain-English version should contain no matrices. If you cannot describe it without them, you are reciting.",
      "Query, Key, Value is a lookup analogy — use it, but say what each one *means* rather than naming the letters.",
      "For *why did transformers win*, lead with parallelism. It is the more fundamental reason and most candidates lead with long-range context."
    ],
    acts: [
      {
        kind: "prompt",
        t: "To a product manager, no maths",
        brief: "Explain self-attention to someone smart who does not write code. Sixty seconds. No matrices, no formulas — an analogy and what it buys you.",
        secs: 60,
        expect: [
          "every word|each word|every token|each token",
          "looks at|attends to|compares|relates to",
          "relevant|important|matters|related",
          "context|meaning|which word|refers to"
        ],
        avoid: ["softmax", "matrix|matrices", "dot product"],
        tip: "The sentence *the animal did not cross the street because it was too tired* is the cleanest example — the model has to work out what *it* refers to."
      },
      {
        kind: "prompt",
        t: "The technical version",
        brief: "Now the engineer's answer. Cover Q, K and V, what the dot product measures, why you divide by √d, and what softmax does. Forty-five seconds.",
        secs: 45,
        expect: [
          "query|queries",
          "key|keys",
          "value|values",
          "dot product|similarity|score",
          "softmax|weights|normalis|normaliz",
          "square root|sqrt|scale|scaling|saturat|vanish"
        ],
        avoid: ["I think|I believe|sort of|kind of"],
        tip: "The √d answer is: large dot products push softmax into a near one-hot spike where gradients vanish. Say the consequence, not just the operation."
      },
      {
        kind: "prompt",
        t: "Why transformers beat RNNs",
        brief: "Two reasons, in order of importance, plus the trade-off transformers accepted. Forty seconds.",
        secs: 40,
        expect: [
          "parallel|parallelis|parallelize|at once|all at the same time",
          "sequential|one at a time|token by token",
          "long range|long-range|distance|far apart|direct",
          "quadratic|n squared|expensive|cost"
        ],
        avoid: ["better|just better", "more powerful"],
        tip: "Parallelism first — it is what made internet-scale training possible. Then constant path length. Then admit the O(n²) cost, because volunteering the downside is what makes the answer credible."
      }
    ]
  },

  {
    id: "rag-vs-finetune",
    t: "RAG, fine-tuning, and defending the choice",
    m: "room",
    track: "dsa",
    lvl: "intermediate",
    icon: "compass",
    s: "The decision question that appears in nearly every GenAI interview.",
    why: "Almost every candidate can define both. Far fewer can say which they would choose under stated constraints and why — which is the actual question being asked.",
    goal: [
      "State the knowledge-versus-behaviour distinction in one sentence",
      "Add the operational reasoning: update speed, citations, auditability",
      "Name the preconditions you would want before fine-tuning at all"
    ],
    coach: [
      "*RAG solves a knowledge problem; fine-tuning solves a behaviour problem* is the sentence. Lead with it, then justify.",
      "The strongest addition is the precondition list — an eval set showing the base model has plateaued, a stable output schema, a few hundred good examples.",
      "Say that production systems usually need both. Treating it as either/or is the junior answer."
    ],
    acts: [
      {
        kind: "prompt",
        t: "The core distinction",
        brief: "A colleague asks whether to fine-tune or use RAG for a customer-support assistant over internal docs. Answer in forty seconds.",
        secs: 40,
        expect: [
          "knowledge|facts|information|what it knows",
          "behaviour|behavior|tone|format|style|how it responds",
          "rag|retriev",
          "update|change|refresh|minutes|quickly",
          "cite|citation|source"
        ],
        avoid: ["it depends", "both are good"],
        tip: "*It depends* is only acceptable if the next sentence says on what. Name the deciding factor immediately."
      },
      {
        kind: "prompt",
        t: "When would you actually fine-tune?",
        brief: "State the preconditions you would want in place before recommending a fine-tune. Forty seconds.",
        secs: 40,
        expect: [
          "eval|evaluation|measured|baseline|plateau",
          "examples|data|hundred|thousand",
          "schema|format|structure|consistent",
          "prompt|prompting|tried"
        ],
        avoid: ["always|never"],
        tip: "*I would not fine-tune until I had an eval set showing the base model has plateaued* is the line that separates an engineer from a hobbyist."
      },
      {
        kind: "prompt",
        t: "The follow-up: long context makes RAG obsolete?",
        brief: "An interviewer says context windows are cheap now, so why bother with retrieval. Push back, fairly. Forty seconds.",
        secs: 40,
        expect: [
          "cost|expensive|token|pay",
          "latency|slow|time",
          "middle|lost|recall|attention",
          "cite|citation|source|audit",
          "permission|access|filter"
        ],
        avoid: ["no|wrong|that is wrong"],
        tip: "Concede the real part — for a small corpus, long context genuinely is simpler. Then give the reasons it does not generalise: cost per call, lost-in-the-middle recall, citations, and access control."
      }
    ]
  },

  {
    id: "kv-cache-vram",
    t: "KV cache, GQA and the VRAM question",
    m: "room",
    track: "dsa",
    lvl: "advanced",
    icon: "cpu",
    s: "The four topics that carry most GenAI technical rounds, spoken aloud.",
    why: "*What hardware do you need to serve this?* is a real question with a real method. Showing the levers matters more than getting the arithmetic exactly right — but you have to actually say the arithmetic.",
    goal: [
      "Explain why the KV cache exists and what it costs",
      "Place MHA, GQA and MQA on one trade-off and say what moves",
      "Walk a VRAM estimate out loud and then offer the levers"
    ],
    coach: [
      "The KV cache answer has two halves: what it saves (recomputation) and what it costs (memory that grows with every token, layer and request).",
      "For GQA, say the dial explicitly — fewer K/V heads means a smaller cache and some quality loss. That framing covers all four variants at once.",
      "On the VRAM question, finish with the levers. Quantise, switch to GQA, cap the context, shard across two GPUs."
    ],
    acts: [
      {
        kind: "prompt",
        t: "What is the KV cache and why does it exist?",
        brief: "Explain it and then name its cost. Forty seconds.",
        secs: 40,
        expect: [
          "recompute|recalculat|again|repeat",
          "previous|earlier|past token|already",
          "memory|ram|vram|grows",
          "quadratic|n squared|linear"
        ],
        avoid: ["faster|just faster"],
        tip: "Without it, generating token 501 recomputes keys and values for 500 tokens that have not changed. With it, generation is linear per step and memory becomes the binding constraint."
      },
      {
        kind: "prompt",
        t: "MHA versus MQA versus GQA",
        brief: "Explain what is being traded across the three, and why GQA became the default. Forty seconds.",
        secs: 40,
        expect: [
          "head|heads",
          "share|shared|group",
          "cache|memory",
          "quality|degrad|loss|worse",
          "default|llama|mistral|compromise|middle"
        ],
        avoid: ["flashattention"],
        tip: "FlashAttention does not belong in this list — it is an exact algorithm for computing attention, not an architecture. Volunteering that distinction scores well."
      },
      {
        kind: "prompt",
        t: "Serve a 13B model to 100 users at 8k context",
        brief: "Work the estimate out loud, then offer the levers if it does not fit. Sixty seconds.",
        secs: 60,
        expect: [
          "26|twenty six|13 times 2|thirteen times two",
          "kv cache|cache",
          "overhead|twenty per cent|20%|1.2",
          "quantis|quantiz|int8|int4",
          "shard|tensor parallel|two gpu|second gpu|cap the context|reduce context"
        ],
        avoid: ["I do not know|not sure|no idea"],
        tip: "Weights at BF16 are 13 × 2 = 26 GB. Estimate the cache from layers and heads, add 20% overhead, name a GPU — then immediately offer what you would do if it did not fit."
      }
    ]
  },

  {
    id: "evals-out-loud",
    t: "How would you evaluate this?",
    m: "room",
    track: "dsa",
    lvl: "intermediate",
    icon: "gauge",
    s: "The question the field says candidates answer worst, rehearsed properly.",
    why: "Practitioners and hiring managers converge on evals being the biggest gap in entry-level AI engineers. Being able to answer this fluently puts you in a small minority immediately.",
    goal: [
      "Describe building an eval harness in the right order",
      "Name the LLM-judge biases without prompting",
      "Explain why public benchmarks do not answer the question"
    ],
    coach: [
      "Start at the bottom of the pyramid. Deterministic assertions are free and most people skip straight past them to an LLM judge.",
      "Error analysis before metrics. Read fifty outputs, categorise the failures, then decide what to measure.",
      "Naming position, verbosity and self-preference bias unprompted is the single clearest signal that you have actually run judged evaluations."
    ],
    acts: [
      {
        kind: "prompt",
        t: "How would you evaluate an LLM application?",
        brief: "Describe your approach end to end. Sixty seconds.",
        secs: 60,
        expect: [
          "golden|dataset|test set|examples",
          "assertion|deterministic|schema|json|valid",
          "judge|llm-as-judge|llm as judge|rubric",
          "error analysis|read|categoris|categoriz|failure mode",
          "ci|pipeline|regression|gate"
        ],
        avoid: ["benchmark|mmlu"],
        tip: "Golden dataset, error analysis, cheap deterministic assertions, then a judge with a rubric, validated against humans, wired into CI. In that order."
      },
      {
        kind: "prompt",
        t: "What is wrong with an LLM judge?",
        brief: "Name the biases and what you would do about each. Forty-five seconds.",
        secs: 45,
        expect: [
          "position|order|first",
          "verbos|longer|length",
          "self|own|same family",
          "swap|average|validate|human|agreement"
        ],
        avoid: ["nothing|it is fine"],
        tip: "Position bias — swap the order and average. Verbosity — put conciseness in the rubric. Self-preference — use a third-family judge. And validate against human labels on a sample."
      },
      {
        kind: "prompt",
        t: "Why not just use public benchmarks?",
        brief: "Explain in thirty-five seconds.",
        secs: 35,
        expect: [
          "contaminat|leak|training data|memoris|memoriz",
          "saturat|ceiling|clustered|no longer",
          "your own|your task|your data|specific"
        ],
        avoid: ["they are useless|no value"],
        tip: "*Benchmarks tell you which models to shortlist; they do not tell you whether a model works for your task.* Then add contamination and saturation as the reasons."
      }
    ]
  },

  {
    id: "narrate-a-problem",
    t: "Narrating a coding problem, start to finish",
    m: "room",
    track: "dsa",
    lvl: "core",
    icon: "code",
    s: "The six-step method, spoken — because a silent correct answer scores below a narrated one.",
    why: "Communication is graded alongside the solution. Most candidates practise only the typing, and then discover in the room that thinking out loud while coding is a separate skill they have never rehearsed.",
    goal: [
      "Open with clarifying questions rather than code",
      "State the brute force and its complexity before optimising",
      "Name the bottleneck, then the tool that removes it"
    ],
    coach: [
      "Never start coding immediately. The ambiguity in the problem statement is deliberate and asking about it is part of the assessment.",
      "Stating the brute force costs fifteen seconds, buys goodwill, and leaves you a fallback if you run out of time.",
      "Say the complexity of both time *and* space, and say what n is. Vague complexity answers read as memorised."
    ],
    acts: [
      {
        kind: "prompt",
        t: "The opening two minutes",
        brief: "You have just been given: *find two numbers in an array that sum to a target*. Do not solve it. Just do the clarifying and the example. Forty seconds.",
        secs: 40,
        expect: [
          "empty|no elements|zero",
          "duplicate|repeated|same",
          "negative|negatives",
          "sorted|order",
          "index|indices|value",
          "example|let me take|say we have"
        ],
        avoid: ["so the answer is|I would use a hash map"],
        tip: "Resist solving it. This activity is specifically training the habit of clarifying first, which is the habit that disappears under pressure."
      },
      {
        kind: "prompt",
        t: "Brute force, then optimise",
        brief: "Same problem. State the naive approach with its complexity, name the bottleneck, then the tool that removes it. Forty seconds.",
        secs: 40,
        expect: [
          "nested|two loops|every pair|n squared|quadratic",
          "bottleneck|repeated|scanning|searching",
          "hash|map|dictionary|set",
          "o of n|linear|constant time|space"
        ],
        avoid: ["obviously|trivially|easy"],
        tip: "*The naive approach is nested loops, O(n²) time and O(1) space. The bottleneck is the repeated inner search — a hash map makes that lookup O(1), trading O(n) space for O(n) time.*"
      },
      {
        kind: "prompt",
        t: "Closing: test your own code",
        brief: "You have finished coding. Walk your own solution and cover the edge cases, then close with the complexity. Forty-five seconds.",
        secs: 45,
        expect: [
          "walk through|trace|let me run|step through",
          "empty|single|one element",
          "duplicate|identical|all the same",
          "time|space|complexity"
        ],
        avoid: ["I think it works|should be fine|probably"],
        tip: "Testing your own code before the interviewer asks is a strong signal. Finishing on a confident complexity statement is how you want the round to end."
      }
    ]
  },

  {
    id: "prompt-injection-defence",
    t: "Prompt injection, and defending an agent",
    m: "room",
    track: "dsa",
    lvl: "advanced",
    icon: "shield",
    s: "The safety question that comes up in almost every AI system-design round.",
    why: "The wrong answer is a confident claim that a guardrail solves it. The right answer includes the caveat that it is unsolved, and designs so a successful injection has limited blast radius.",
    goal: [
      "Distinguish direct from indirect injection and say why the second is worse",
      "List layered defences rather than one fix",
      "State honestly that it is not a solved problem"
    ],
    coach: [
      "Indirect injection is the dangerous one because the user never sees it — the instruction hides in a page, a PDF, an email, a code comment.",
      "The severity scales with the agent's tools. Read plus network is the pairing that enables exfiltration.",
      "*I would treat prompt injection as unsolved and design so a successful injection has limited blast radius* is the sentence to land."
    ],
    acts: [
      {
        kind: "prompt",
        t: "Direct versus indirect",
        brief: "Explain both, and say which worries you more and why. Forty seconds.",
        secs: 40,
        expect: [
          "direct|user types|user asks",
          "indirect|hidden|fetched|web page|document|email",
          "does not see|never sees|invisible|unaware",
          "tool|agent|act"
        ],
        avoid: ["easy to fix|solved"],
        tip: "The model cannot distinguish your instructions from data it was told to read. Both arrive as text in the same context window — that is the whole vulnerability."
      },
      {
        kind: "prompt",
        t: "How would you defend an agent with tools?",
        brief: "Give layered defences, and be honest about their limits. Fifty seconds.",
        secs: 50,
        expect: [
          "least privilege|minimum|scope|only the tools",
          "human|approval|confirm",
          "egress|network|allowlist|outbound|domain",
          "validate|schema|output",
          "not solved|unsolved|cannot fully|no single|blast radius"
        ],
        avoid: ["guardrail solves|prompt tells it|instruct the model not to"],
        tip: "Egress filtering is the one worth naming specifically — it works even after an injection succeeds, because the exfiltration step still fails."
      }
    ]
  },

  {
    id: "walk-your-project",
    t: "Walking one project end to end",
    m: "room",
    track: "dsa",
    lvl: "intermediate",
    icon: "compass",
    s: "The single answer that filters more candidates than any technical round.",
    why: "Being able to walk one project through problem, data, architecture, evals, failures, cost and what you would change is the clearest evidence that you have actually shipped something rather than followed a tutorial.",
    goal: [
      "Open with the problem, not the technology stack",
      "Attach real numbers — latency, cost, a quality metric",
      "Name a genuine failure and what you would change"
    ],
    coach: [
      "Lead with the problem and who had it. Opening with *I used LangChain and Pinecone* answers a question nobody asked.",
      "Numbers are the fastest credibility signal available. *p95 1.4 seconds, $0.008 per query, precision@5 up from 0.61 to 0.84.*",
      "The *what I would change* section is where judgement shows. Have a real one, not a modest-sounding non-answer."
    ],
    acts: [
      {
        kind: "prompt",
        t: "The ninety-second walkthrough",
        brief: "Walk one project end to end: the problem, your approach, how you evaluated it, and one number. Ninety seconds.",
        secs: 90,
        expect: [
          "problem|needed|could not|took too long|manual",
          "chose|decided|because|instead of",
          "eval|measur|test|metric|precision|recall|accuracy",
          "latency|cost|per query|p95|seconds"
        ],
        avoid: ["I used|built with", "basically|kind of|sort of"],
        tip: "Ninety seconds is long enough to cover everything and short enough that you must have decided in advance what to leave out. Rehearse the cuts."
      },
      {
        kind: "prompt",
        t: "Where it fails, and what you would change",
        brief: "Describe a real failure mode you found, and what you would do differently with more time. Forty-five seconds.",
        secs: 45,
        expect: [
          "fail|broke|wrong|missed|degrad",
          "found|noticed|discovered|when",
          "would|next time|if I|change|instead"
        ],
        avoid: ["nothing|it worked well|no issues|perfect"],
        tip: "*It all worked* is the weakest possible answer. A specific failure you found and diagnosed demonstrates that you tested honestly, which is more impressive than a clean demo."
      }
    ]
  }

]);
