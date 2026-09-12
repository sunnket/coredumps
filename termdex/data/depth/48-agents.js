/* ==========================================================================
   Depth pass 48 — agents: the loop, the frameworks, and the bounds.

   An agent is a model in a loop with tools. Everything difficult about them
   follows from that one sentence: a loop that decides its own next step can
   fail to terminate, can accumulate errors across steps, and can take actions
   nobody reviewed. The stop condition is not a detail — it is the difference
   between a system and a runaway process with a billing account.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "react",

      why: {
        before: "Chain-of-thought prompting improved reasoning by having the " +
          "model think step by step, and every step still drew only on " +
          "parametric knowledge. Separately, tool use let models call " +
          "functions, but without reasoning about **when** or **why**.",
        problem: "Reasoning alone hallucinates facts it cannot verify. Acting " +
          "alone calls tools without a plan and cannot recover when a result " +
          "is unexpected. Each half fails in the way the other half would " +
          "have fixed.",
        shift: "**Interleave them.** ReAct alternates *Thought* (reason about " +
          "the situation), *Action* (call a tool), *Observation* (read the " +
          "result) — and loops. Reasoning decides which action to take; " +
          "observation grounds the next round of reasoning in something real. " +
          "This loop is the foundation of essentially every agent framework in " +
          "use."
      },

      num: {
        t: "The loop, and where it fails",
        h: ["Step", "Purpose", "Failure mode"],
        r: [
          ["**Thought**", "**decide the next action**", "**plausible but wrong plan**"],
          ["Action", "call a tool", "wrong tool or bad arguments"],
          ["**Observation**", "**read the result**", "**error text misread as data**"],
          ["Loop", "repeat until done", "**never terminates**"],
          ["**Final answer**", "**stop and respond**", "**stops too early**"]
        ],
        n: "The **loop** row is the one that costs money. Without an explicit " +
          "bound, an agent that misreads an error can retry the same failing " +
          "call indefinitely, and each iteration is a full model call — this " +
          "is the single most common way an agent project produces a " +
          "surprising bill. Every ReAct implementation needs a **maximum " +
          "iteration count** at minimum. The other structural weakness is " +
          "**error compounding**: each step's output becomes the next step's " +
          "input, so a per-step accuracy of 95% gives roughly **60% over ten " +
          "steps**. That arithmetic is why shorter loops with better tools " +
          "outperform longer loops, and why the practical design advice is to " +
          "**make each tool do more** rather than composing many small ones. " +
          "Note that modern implementations rarely use ReAct's original text " +
          "format — **native tool calling** in the API is more reliable than " +
          "parsing `Action:` lines out of free text — but the loop structure " +
          "is unchanged."
      },

      miss: [
        {
          w: "ReAct is a prompt template.",
          r: "It is a **control loop**. The original paper used a text format " +
            "with `Thought:`/`Action:` markers; modern implementations use " +
            "**native tool calling**, which is far more reliable than parsing " +
            "free text. The pattern is the interleaving, not the syntax."
        },
        {
          w: "More reasoning steps give better results.",
          r: "Errors **compound** — 95% per step is about 60% over ten steps. " +
            "Longer loops accumulate more chances to go wrong. Fewer steps " +
            "with more capable tools generally beat many small steps."
        },
        {
          w: "The agent will stop when it has the answer.",
          r: "It may loop indefinitely, especially after misreading an error " +
            "as data. **Explicit iteration, token and time limits are " +
            "mandatory**, not defensive extras — this is the most common cause " +
            "of runaway agent cost."
        },
        {
          w: "Observations are always interpreted correctly.",
          r: "A tool returning an error string is just text in the context. " +
            "Agents routinely treat `{\"error\": \"not found\"}` as a result " +
            "and reason onward from it. **Tool outputs need clear, " +
            "unambiguous error signalling** designed for a model to read."
        }
      ],

      trade: {
        buys: [
          "Grounds reasoning in real tool results.",
          "Recovers from unexpected results by re-planning.",
          "Handles multi-step tasks no single call could.",
          "The trace is inspectable — you can see what it decided.",
          "Works with any tool that has a clear interface."
        ],
        costs: [
          "A model call per iteration — cost and latency.",
          "Errors compound across steps.",
          "Can loop without explicit bounds.",
          "Tool errors are easily misread.",
          "Non-deterministic — the same task can take different paths."
        ],
        avoid: [
          "One tool call answers the question — just call it.",
          "The workflow is fixed — write it as code.",
          "Latency is critical.",
          "Actions are irreversible and unreviewed."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "stop-condition",

      why: {
        before: "An agent loop runs until the model decides it is finished. " +
          "That works when the model is right about being finished.",
        problem: "It is often wrong. An agent that misreads an error retries " +
          "forever; one confused about its goal explores indefinitely; two " +
          "tools returning contradictory results produce oscillation. Each " +
          "iteration is a **paid model call**, so a loop that does not " +
          "terminate is a loop that spends money at a constant rate until " +
          "someone notices.",
        shift: "**Bound the loop externally.** Iteration count, token budget, " +
          "wall-clock time, cost ceiling, repeated-state detection. Stop " +
          "conditions are not error handling added later — they are part of " +
          "the agent's definition, because **an unbounded agent is not a " +
          "system, it is an incident waiting for a trigger**."
      },

      num: {
        t: "Bounds worth setting, and what each catches",
        h: ["Bound", "Catches", "Typical"],
        r: [
          ["**Max iterations**", "**infinite loops**", "**10–25**"],
          ["**Token budget**", "**context growth and cost**", "**a hard ceiling**"],
          ["Wall-clock timeout", "hung tools", "30–300 s"],
          ["**Cost ceiling**", "**runaway spend**", "**per task and per user**"],
          ["**Repeated state**", "**oscillation between two actions**", "**hash the last n steps**"],
          ["No-progress", "looping without advancing", "n steps without change"]
        ],
        n: "**Set all of them**, because each catches a different failure and " +
          "none subsumes the others: an iteration cap does not stop one tool " +
          "hanging for ten minutes, and a timeout does not stop twenty cheap " +
          "iterations that make no progress. **Repeated-state detection** is " +
          "the one most often omitted and it catches the most frustrating " +
          "case — an agent alternating between two actions forever, each " +
          "individually reasonable, never advancing. Hashing the last few " +
          "actions and halting on a repeat is cheap and effective. The " +
          "**behaviour on hitting a bound matters as much as the bound**: " +
          "returning partial progress with an explanation of what was " +
          "attempted is far more useful than a bare timeout error, and lets a " +
          "human resume. Finally, bounds belong **outside the model's " +
          "control** — an agent asked politely to limit itself to ten steps " +
          "will exceed it, so enforce them in the harness."
      },

      miss: [
        {
          w: "Instructing the model to stop after n steps is sufficient.",
          r: "Models do not reliably count their own iterations. Bounds must " +
            "be **enforced by the harness**, outside the model's control. A " +
            "prompt instruction is a suggestion; a loop counter is a " +
            "guarantee."
        },
        {
          w: "A max-iteration limit covers it.",
          r: "It does not catch a **single tool hanging** for minutes, a " +
            "context that grows past the window, or **oscillation** between " +
            "two actions within the limit. Each bound catches a different " +
            "failure — set several."
        },
        {
          w: "Hitting a limit means the task failed.",
          r: "Partial progress is often valuable. Return **what was " +
            "accomplished and what remained**, so a human can resume or " +
            "adjust. A bare timeout error discards work that was already paid " +
            "for."
        },
        {
          w: "Generous limits are safer than tight ones.",
          r: "Generous limits mean **expensive failures**. An agent looping 100 " +
            "times before stopping costs 100 model calls to reach the same " +
            "outcome as stopping at 10. Tight limits with clear partial " +
            "results usually serve users better."
        }
      ],

      trade: {
        buys: [
          "Bounded, predictable cost per task.",
          "Prevents runaway loops and surprise bills.",
          "Catches oscillation and no-progress states.",
          "Makes agent behaviour testable.",
          "Partial results remain useful."
        ],
        costs: [
          "May cut off a task that would have completed.",
          "Several bounds to configure and tune.",
          "Requires designing partial-result handling.",
          "Repeated-state detection needs state hashing.",
          "Tight limits can frustrate legitimate long tasks."
        ],
        avoid: [
          "There is no loop — a single call cannot run away.",
          "The workflow is fixed and terminates by construction.",
          "You have not instrumented cost and cannot choose sensible limits.",
          "The task genuinely has no bound — reconsider the design."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "agent-memory",

      why: {
        before: "Everything an agent knows sits in its context window. When " +
          "the conversation ends, or the window fills, it is gone.",
        problem: "That is untenable for anything long-running. An agent " +
          "working a multi-hour task forgets its earlier findings; one serving " +
          "a returning user forgets their preferences and re-asks the same " +
          "questions; one that learned a tool's quirk relearns it every " +
          "session. The context window is **working memory, not storage**.",
        shift: "**Store information outside the context and retrieve it when " +
          "relevant.** Agent memory splits into distinct kinds serving " +
          "different purposes — conversation history, durable facts about the " +
          "user, learned procedures — with different storage and retrieval " +
          "needs. Treating them as one undifferentiated store is why naive " +
          "implementations retrieve the wrong things."
      },

      num: {
        t: "Kinds of memory, and how each is stored",
        h: ["Kind", "Holds", "Storage"],
        r: [
          ["**Working**", "**the current task**", "**the context window**"],
          ["**Episodic**", "**what happened before**", "**conversation log, summarised**"],
          ["**Semantic**", "**facts about the user or domain**", "**key-value or vector store**"],
          ["Procedural", "how to do things", "prompts, tools, examples"],
          ["**Scratchpad**", "**intermediate work**", "**files, external state**"]
        ],
        n: "The distinction that matters operationally is **what gets written " +
          "and what gets retrieved**. Naive implementations embed every turn " +
          "and retrieve by similarity, which surfaces conversationally similar " +
          "but irrelevant material — the user asking about billing retrieves " +
          "an old billing chat rather than their stated preference. Better " +
          "systems **extract durable facts explicitly** (*prefers metric " +
          "units*, *works in the EU*) and store those separately from raw " +
          "history. The **scratchpad** row is underused and often the best " +
          "answer for long tasks: writing intermediate results to **files** " +
          "rather than carrying them in context keeps the window small and the " +
          "work durable across restarts. And memory needs **forgetting** — " +
          "stale facts are worse than absent ones, because an agent " +
          "confidently acting on a preference the user changed months ago is " +
          "more damaging than one that asks."
      },

      miss: [
        {
          w: "Memory means embedding the conversation and retrieving by " +
            "similarity.",
          r: "That retrieves **conversationally similar** text, not relevant " +
            "facts. Extracting durable facts explicitly and storing them " +
            "separately works far better than similarity search over raw " +
            "transcript."
        },
        {
          w: "A bigger context window removes the need for memory.",
          r: "It extends **working** memory only. Persistence **across " +
            "sessions**, cost control and attention dilution over long " +
            "contexts all remain. Memory is about what to keep and retrieve, " +
            "not only about capacity."
        },
        {
          w: "More memory is always better.",
          r: "**Stale memory is worse than none.** An agent acting confidently " +
            "on an outdated preference does damage a forgetful agent avoids. " +
            "Expiry, updating and conflict resolution are part of the design."
        },
        {
          w: "All memory should live in one store.",
          r: "The kinds have different access patterns. User facts want " +
            "**key-value** lookup; past episodes want **summarised " +
            "retrieval**; intermediate work wants **files**. One vector store " +
            "for everything retrieves the wrong thing for most queries."
        }
      ],

      trade: {
        buys: [
          "Continuity across sessions and long tasks.",
          "Avoids re-asking what the user already told you.",
          "Keeps the context window small and cheap.",
          "Durable intermediate work that survives restarts.",
          "Enables personalisation."
        ],
        costs: [
          "Storage and retrieval infrastructure to build.",
          "Stale memory produces confident wrong behaviour.",
          "Retrieval can surface irrelevant material.",
          "Privacy obligations — stored user data.",
          "Extraction and expiry logic to maintain."
        ],
        avoid: [
          "Tasks are single-turn and stateless.",
          "Everything needed fits comfortably in context.",
          "You cannot manage expiry and the data goes stale.",
          "Privacy constraints rule out persisting user data."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "model-context-protocol",

      why: {
        before: "Every AI application wrote its own integrations. Connecting a " +
          "model to GitHub, Postgres and Slack meant three bespoke tool " +
          "implementations — and the next application wrote all three again.",
        problem: "**M applications × N data sources = M×N integrations**, each " +
          "maintained separately. Tool authors could not write once and be " +
          "used everywhere; application authors rebuilt the same connectors " +
          "repeatedly. The integration burden grew multiplicatively.",
        shift: "**Standardise the interface between AI applications and " +
          "external systems.** MCP defines how a client discovers and calls " +
          "tools, reads resources and uses prompts from a server, over a " +
          "defined transport. **M + N** instead of **M × N**: write a server " +
          "once and any MCP client can use it. It is the USB-C argument " +
          "applied to model integrations."
      },

      num: {
        t: "What a server exposes",
        h: ["Primitive", "Is", "Controlled by"],
        r: [
          ["**Tools**", "**functions the model may call**", "**the model chooses**"],
          ["**Resources**", "**data the client may read**", "**the application chooses**"],
          ["Prompts", "reusable templates", "**the user chooses**"],
          ["Transport", "stdio or HTTP/SSE", "deployment"]
        ],
        n: "The **control** column is the design point people miss and it " +
          "matters for safety: **tools are model-controlled** — the model " +
          "decides when to invoke them, which is why each one needs an " +
          "authorisation story — while **resources are application-" +
          "controlled**, read deliberately by the host rather than at the " +
          "model's discretion. Conflating the two is how systems end up " +
          "letting a model reach data nobody meant to expose. The security " +
          "considerations are real and specific: an MCP server runs with " +
          "**whatever credentials you give it**, and a malicious or " +
          "compromised server can return content designed as a **prompt " +
          "injection** — tool *descriptions* are themselves untrusted text " +
          "that enters the model's context. Treat third-party servers with the " +
          "same caution as any dependency with credentials, prefer " +
          "least-privilege tokens, and keep destructive operations behind " +
          "explicit confirmation rather than relying on the model to be " +
          "careful."
      },

      miss: [
        {
          w: "MCP is a framework for building agents.",
          r: "It is a **protocol** for connecting applications to external " +
            "systems — the integration layer, not the agent loop. Frameworks " +
            "like LangGraph build agents; MCP standardises what those agents " +
            "can reach."
        },
        {
          w: "Tools and resources are two names for the same thing.",
          r: "**Tools are model-controlled** — the model decides to call them. " +
            "**Resources are application-controlled** — the host reads them " +
            "deliberately. The distinction determines who is deciding, which " +
            "is a security boundary."
        },
        {
          w: "Adding an MCP server is low risk.",
          r: "A server runs with **the credentials you give it** and returns " +
            "text that enters the model's context — including its own tool " +
            "descriptions. That is a **prompt injection surface**. Treat " +
            "third-party servers as dependencies with credentials."
        },
        {
          w: "More connected servers make an agent more capable.",
          r: "Every tool definition consumes context and adds selection " +
            "ambiguity. Beyond a few dozen tools, models choose worse. **Fewer, " +
            "better-scoped tools** outperform many overlapping ones."
        }
      ],

      trade: {
        buys: [
          "Write an integration once, use it from any client.",
          "M + N instead of M × N integrations.",
          "Clear separation between model-controlled and app-controlled " +
            "access.",
          "A growing ecosystem of existing servers.",
          "Transport-agnostic — local or remote."
        ],
        costs: [
          "Another process and protocol to operate.",
          "Third-party servers are a trust and injection surface.",
          "Tool definitions consume context.",
          "Credential scoping is the integrator's responsibility.",
          "Overhead for a single simple integration."
        ],
        avoid: [
          "You need one integration in one application — call the API.",
          "You cannot vet the servers you would connect.",
          "The tool surface would grow past what a model can choose among.",
          "Latency rules out an extra process hop."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "langchain",

      why: {
        before: "Building an LLM application meant writing HTTP calls, prompt " +
          "string assembly, output parsing, retry logic and document loaders " +
          "by hand — the same scaffolding in every project.",
        problem: "Everyone rebuilt it, and provider APIs differed, so " +
          "switching models meant rewriting. There was no shared vocabulary " +
          "for chains, retrievers or memory, and no library of the hundreds of " +
          "integrations applications needed.",
        shift: "**A framework of abstractions and integrations.** LangChain " +
          "provided a common interface across providers, a large connector " +
          "library, and composable chain primitives. It became the default " +
          "starting point — and drew heavy criticism for **abstraction " +
          "overhead**, since its layers can obscure what is ultimately a " +
          "handful of API calls."
      },

      num: {
        t: "When the framework pays for itself",
        h: ["Situation", "Verdict"],
        r: [
          ["**A single prompt and response**", "**use the SDK directly**"],
          ["**Many provider integrations needed**", "**framework helps**"],
          ["Document loaders for many formats", "**framework helps**"],
          ["**Debugging a subtle behaviour**", "**abstraction gets in the way**"],
          ["Production with tight control", "**often outgrown**"],
          ["Prototyping breadth quickly", "**framework helps**"]
        ],
        n: "The honest summary is that **LangChain's value is its " +
          "integrations, not its abstractions**. The connector library — " +
          "document loaders, vector stores, provider adapters — saves real " +
          "work. The chain abstractions add indirection over what is often a " +
          "few API calls, and when behaviour is unexpected you end up reading " +
          "framework source to find which layer modified your prompt. That is " +
          "why many teams **prototype with it and rewrite the core loop " +
          "directly for production**, keeping only the loaders they need. The " +
          "ecosystem has since split usefully: **LangGraph** for explicit " +
          "stateful agent control, **LangSmith** for tracing and evaluation — " +
          "and LangSmith is arguably the more valuable piece, since observing " +
          "what an LLM application actually did is genuinely hard to build " +
          "yourself. Judge the parts separately rather than adopting or " +
          "rejecting the whole."
      },

      miss: [
        {
          w: "You need a framework to build LLM applications.",
          r: "Most applications are **a few API calls with prompt " +
            "construction and parsing**. Provider SDKs are straightforward. " +
            "Frameworks earn their place through integrations and tooling, not " +
            "because the core is hard."
        },
        {
          w: "The abstractions make code more maintainable.",
          r: "They add indirection over something already simple. When " +
            "behaviour is unexpected you debug **through framework layers** to " +
            "find what modified your prompt. Many teams find direct calls " +
            "easier to maintain."
        },
        {
          w: "LangChain and LangGraph are alternatives.",
          r: "**LangGraph is for explicit stateful agent control** with " +
            "defined nodes and edges; LangChain is the broader integration " +
            "framework. They are complementary, and LangGraph addresses cases " +
            "where chain composition was too implicit."
        },
        {
          w: "Adopting it is all or nothing.",
          r: "The parts are separable. Many teams use **document loaders " +
            "only**, or **LangSmith for tracing** with a hand-written core " +
            "loop. Observability is often the most valuable piece and the " +
            "hardest to build yourself."
        }
      ],

      trade: {
        buys: [
          "A very large library of integrations and loaders.",
          "Common interface across providers.",
          "Fast prototyping across many components.",
          "LangSmith tracing and evaluation.",
          "Shared vocabulary and abundant examples."
        ],
        costs: [
          "Abstraction overhead over simple API calls.",
          "Debugging means reading framework internals.",
          "Rapid API churn between versions.",
          "Large dependency surface.",
          "Often outgrown in production."
        ],
        avoid: [
          "The application is a few API calls — use the SDK.",
          "You need precise control over prompts and retries.",
          "Dependency footprint matters.",
          "You only need one integration you could write directly."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "langgraph",

      why: {
        before: "Chain-based frameworks composed steps linearly: retrieve, " +
          "then prompt, then parse. That fits a pipeline and not an agent.",
        problem: "Agents **loop, branch and revisit**. They retry with " +
          "different parameters, escalate to a human, run steps in parallel " +
          "and return to earlier states. Expressing that as a chain produces " +
          "control flow hidden inside prompt strings — impossible to inspect, " +
          "test or resume.",
        shift: "**Model the agent as an explicit graph.** Nodes are steps, " +
          "edges are transitions, and a shared state object flows through. " +
          "Because the structure is data rather than implicit in the prompt, " +
          "you can **checkpoint state, resume after a failure, interrupt for " +
          "human approval, and inspect exactly where execution is** — which " +
          "chain abstractions cannot do."
      },

      num: {
        t: "What the explicit graph enables",
        h: ["Capability", "Why the graph makes it possible"],
        r: [
          ["**Cycles**", "**edges can point backwards — retry, revise**"],
          ["**Checkpointing**", "**state is an explicit object to persist**"],
          ["**Human-in-the-loop**", "**interrupt at a node, resume later**"],
          ["Conditional branching", "edges chosen by a function on state"],
          ["Parallel nodes", "independent branches run together"],
          ["**Inspectable control flow**", "**structure is data, not prose**"]
        ],
        n: "**Checkpointing is the capability that matters most in " +
          "production** and follows directly from making state explicit: " +
          "because the whole agent state is one serialisable object, a run can " +
          "be **paused, persisted, and resumed hours later** — which is what " +
          "makes human approval steps practical rather than a blocking wait. " +
          "An agent that drafts a change, stops for review, and continues " +
          "after someone approves is a graph interruption, and it is very " +
          "awkward to build without one. The cost is real: **you must design " +
          "the state schema and the graph up front**, which is more work than " +
          "a prompt loop and pays off precisely when the workflow is complex " +
          "enough to need it. For a straightforward ReAct loop with a few " +
          "tools, a hand-written `while` loop is clearer than a graph, and the " +
          "framework is overhead."
      },

      miss: [
        {
          w: "LangGraph is the next version of LangChain.",
          r: "It is a **different abstraction** for a different problem — " +
            "stateful, cyclic agent control rather than linear chain " +
            "composition. They are used together, and LangGraph addresses what " +
            "chains express badly."
        },
        {
          w: "You need a graph framework to build an agent.",
          r: "A basic ReAct loop is a `while` loop with tool dispatch — " +
            "clearer hand-written. Graphs earn their cost with **branching, " +
            "checkpointing, human approval and parallelism**."
        },
        {
          w: "The graph makes agent behaviour deterministic.",
          r: "The **control flow** becomes explicit; the model's decisions " +
            "remain probabilistic. Which edge is taken can still depend on " +
            "model output. You gain inspectable structure, not determinism."
        },
        {
          w: "Checkpointing is only for crash recovery.",
          r: "It is what makes **human-in-the-loop** practical: pause at a " +
            "node, persist, resume after approval — possibly hours later, in a " +
            "different process. That is often the reason to adopt it."
        }
      ],

      trade: {
        buys: [
          "Cycles and branching expressed explicitly.",
          "Checkpointing — pause, persist and resume.",
          "Human-in-the-loop approval steps.",
          "Inspectable control flow for debugging.",
          "Parallel execution of independent branches."
        ],
        costs: [
          "State schema and graph must be designed up front.",
          "More concepts than a plain loop.",
          "Framework dependency and version churn.",
          "Overhead for simple agents.",
          "Checkpoint storage to operate."
        ],
        avoid: [
          "The agent is a simple tool loop — write the loop.",
          "There is no branching, cycling or approval step.",
          "The workflow is fixed — write it as code.",
          "You cannot justify the state modelling effort."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "llamaindex",

      why: {
        before: "General LLM frameworks treated retrieval as one capability " +
          "among many, with document loading and indexing as auxiliary " +
          "features.",
        problem: "For RAG applications retrieval **is** the application, and " +
          "the hard parts are specific: parsing messy PDFs with tables, " +
          "chunking that respects document structure, indexing strategies " +
          "beyond flat vector search, and query engines that route across " +
          "multiple sources. A general framework treats these as edge cases.",
        shift: "**Build retrieval-first.** LlamaIndex organises around " +
          "ingestion, indexing and querying — with substantially stronger " +
          "document parsing than general frameworks, and index structures " +
          "(tree, keyword, knowledge graph, composed) that go beyond a single " +
          "vector store. If the application is fundamentally *answer questions " +
          "over my documents*, the abstractions line up with the problem."
      },

      num: {
        t: "Where the retrieval-first design shows",
        h: ["Area", "Strength"],
        r: [
          ["**Document parsing**", "**complex PDFs, tables — LlamaParse**"],
          ["**Chunking**", "**structure-aware, hierarchical**"],
          ["Index types", "**vector, tree, keyword, graph, composed**"],
          ["Query engines", "routing, sub-questions, multi-document"],
          ["**Agent support**", "**present but less developed**"],
          ["General orchestration", "narrower than LangChain"]
        ],
        n: "**Document parsing is the underrated differentiator**, because it " +
          "is where real RAG projects actually lose. A PDF with multi-column " +
          "layout, merged table cells and footnotes parses into garbage under " +
          "naive extraction, and **no retrieval tuning recovers from bad " +
          "chunks** — the information was destroyed before indexing. Teams " +
          "routinely spend weeks tuning embeddings and rerankers when the " +
          "actual problem is that their tables became unordered text. The " +
          "**hierarchical chunking** support matters for the same reason: " +
          "retrieving a small precise chunk but sending the model its larger " +
          "parent section gives precision in matching and context in " +
          "generation. The practical comparison: **LlamaIndex for " +
          "document-heavy RAG, LangGraph for complex agent control**, and many " +
          "teams use both for what each does well rather than choosing one " +
          "framework for everything."
      },

      miss: [
        {
          w: "LlamaIndex and LangChain are competitors you must choose " +
            "between.",
          r: "They **overlap and differ in emphasis** — LlamaIndex is " +
            "retrieval-first, LangChain is integration-and-orchestration-" +
            "first. Teams commonly use LlamaIndex for ingestion and retrieval " +
            "alongside another framework for agent control."
        },
        {
          w: "Document parsing is a solved preprocessing detail.",
          r: "It is where most RAG projects lose quality. Complex PDFs with " +
            "tables and multi-column layouts parse into garbage under naive " +
            "extraction, and **no amount of retrieval tuning recovers " +
            "destroyed information**."
        },
        {
          w: "A vector index is all you need.",
          r: "**Hierarchical and composed indexes** handle cases flat vector " +
            "search does not — summarising across a whole document, routing " +
            "between sources, or retrieving a precise chunk while sending its " +
            "larger parent for context."
        },
        {
          w: "The framework handles chunking correctly by default.",
          r: "Defaults are reasonable and **chunking is corpus-specific**. " +
            "Legal contracts, API documentation and support tickets need " +
            "different strategies. It remains the highest-leverage thing to " +
            "tune, and no default is right for every corpus."
        }
      ],

      trade: {
        buys: [
          "Strong parsing for complex documents and tables.",
          "Structure-aware and hierarchical chunking.",
          "Index types beyond flat vector search.",
          "Query engines for routing and multi-document questions.",
          "Abstractions that match RAG's actual shape."
        ],
        costs: [
          "Narrower than general frameworks outside retrieval.",
          "Agent support less developed than LangGraph.",
          "Another dependency with its own churn.",
          "Defaults still need corpus-specific tuning.",
          "LlamaParse for hard documents is a paid service."
        ],
        avoid: [
          "The application is agent-centric, not document-centric.",
          "Documents are simple text needing no parsing.",
          "You need broad orchestration beyond retrieval.",
          "A direct vector store client is sufficient."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "context-engineering",

      why: {
        before: "The discipline was called **prompt engineering** and focused " +
          "on phrasing: how to word an instruction so the model complies.",
        problem: "Phrasing stopped being the binding constraint. Real " +
          "applications assemble context from many sources — system " +
          "instructions, tool definitions, retrieved documents, conversation " +
          "history, memory, examples — and they **compete for a finite " +
          "window** that costs money per token and degrades in the middle. The " +
          "question is no longer *how do I word this* but **what deserves to " +
          "be in the window at all**.",
        shift: "**Treat the context window as a managed resource.** Decide " +
          "what to include, what to summarise, what to retrieve on demand, " +
          "what to push into files, and how to order it. Ordering alone " +
          "affects cost through prompt caching and quality through attention " +
          "position — so this is engineering with measurable outcomes, not " +
          "wording."
      },

      num: {
        t: "Ordering the window, and why",
        h: ["Position", "Put here", "Reason"],
        r: [
          ["**Front**", "**system prompt, tool definitions**", "**stable — cacheable**"],
          ["Early", "long-lived examples", "cacheable, stable"],
          ["**Middle**", "**bulk retrieved documents**", "**weakest attention — 'lost in the middle'**"],
          ["**End**", "**the user's actual question**", "**strongest attention, keeps cache valid**"],
          ["**Outside**", "**large intermediate work**", "**files, not context**"]
        ],
        n: "Two independent forces produce the same ordering, which is why it " +
          "is a genuine rule rather than a preference. **Prompt caching** " +
          "requires stable content first, since any change invalidates " +
          "everything after it — putting a timestamp near the top silently " +
          "destroys the entire saving. **Attention position** means material " +
          "at the start and end is used more reliably than material in the " +
          "middle, so the question belongs last. The **outside** row is the " +
          "most underused technique: an agent doing long work should write " +
          "intermediate results to **files** and read back only what it needs, " +
          "keeping the window small, the cost low and the work durable across " +
          "restarts. And the general finding worth internalising: **more " +
          "context is not better context** — irrelevant material measurably " +
          "degrades accuracy, so retrieval precision and summarisation are " +
          "quality tools, not merely cost tools."
      },

      miss: [
        {
          w: "Context engineering is prompt engineering renamed.",
          r: "Prompt engineering is about **wording**; context engineering is " +
            "about **what occupies a finite, costly window** — selection, " +
            "ordering, summarisation and offloading. The constraint moved from " +
            "phrasing to allocation."
        },
        {
          w: "Fill the context window since you are paying for the model " +
            "anyway.",
          r: "You pay **per token**, and irrelevant material **measurably " +
            "degrades accuracy**. More context is not better context — " +
            "precision in what you include is a quality decision as much as a " +
            "cost one."
        },
        {
          w: "Order within the prompt does not matter much.",
          r: "It affects **cost** through prompt caching, which needs stable " +
            "content first, and **quality** through attention position, which " +
            "favours the start and end. Both point the same way: stable " +
            "first, question last."
        },
        {
          w: "Larger context windows make this unnecessary.",
          r: "They raise the ceiling and change nothing about cost per token, " +
            "attention dilution, or the fact that most corpora exceed any " +
            "window. Larger windows make **selection more important**, not " +
            "less."
        }
      ],

      trade: {
        buys: [
          "Lower cost through caching and smaller prompts.",
          "Better accuracy by removing distracting material.",
          "Longer tasks via offloading to files.",
          "Predictable latency from bounded context.",
          "A framework for deciding what belongs in the window."
        ],
        costs: [
          "Requires designing the assembly pipeline.",
          "Summarisation loses detail.",
          "Ordering constraints limit prompt structure.",
          "Offloading needs external storage and retrieval.",
          "More components to test and monitor."
        ],
        avoid: [
          "Prompts are short and the window is not a constraint.",
          "The task is single-turn with fixed input.",
          "Cost and latency are not concerns.",
          "You have not measured whether context is the bottleneck."
        ]
      }
    }

  ]);
})(window.TD = window.TD || {});
