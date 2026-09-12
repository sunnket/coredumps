/* Real-world examples and step-by-step flows — crash course, AI engineering. */
TD.attach("crash-course", {

"Weights": {
 ex: { h: "A piano tuned by ear over twenty years",
       b: "There is no sheet music inside the piano. Every note it can play is a consequence of where thousands of pins ended up after countless small adjustments. A model is the same: no stored facts, no lookup table — just billions of numbers that were nudged until the output stopped being wrong. Which is exactly why it can be fluent and confidently mistaken." },
 fl: { t: "Why a model invents a citation",
       s: ["You ask for a paper on a niche topic",
           { s: "The model has no database to consult", n: "Only patterns compressed into its weights." },
           { q: "Did it see that exact paper often during training?",
             y: "The pattern is strong and it recalls it correctly",
             n: "It generates a plausible-shaped title and author — a hallucination" },
           "Retrieval fixes this by putting the real document in the prompt"] }
},

"Parameter Count": {
 ex: { h: "Engine size on a car",
       b: "A 2.0-litre tells you roughly what it costs to run and what it needs to sit in. It does not tell you it will beat a well-tuned 1.4 from ten years later. Parameter count is exactly this: a reliable guide to memory and price, and only a loose guide to how good the thing actually is." },
 fl: { t: "Will this model fit on my GPU?",
       s: ["You want to run a 7B model locally",
           { s: "At 16-bit, budget ~2 GB per billion parameters", n: "So about 14 GB just for the weights." },
           { q: "Does your card have more than that, plus room for context?",
             y: "Load it at full precision and go",
             n: "Quantise to 4-bit — about 3.5 GB, with a small quality cost" },
           "Long prompts inflate the KV cache on top of all of this"] }
},

"Training": {
 ex: { h: "Teaching a child to catch",
       b: "You do not explain parabolas. You throw, they miss, they adjust, you throw again — thousands of times — and eventually the hands go to the right place without anyone being able to write down the rule. That is gradient descent, and *the rule* ends up distributed across the weights rather than stated anywhere." },
 fl: { t: "One step of the training loop",
       s: ["Feed the model one batch of examples",
           { s: "It predicts; you compare against the known answers", n: "The gap is the loss — a single number saying how wrong it was." },
           { s: "Work out which direction each weight should move", n: "That is backpropagation computing the gradients." },
           { s: "Nudge every weight a small amount", n: "How far is the learning rate." },
           { q: "Is validation loss still improving?",
             y: "Take another batch and repeat",
             n: "Stop — from here it is memorising, not learning" }] }
},

"Dataset": {
 ex: { h: "A driving instructor who only used one quiet street",
       b: "The learner passes every test on that street and stalls at the first roundabout. Whatever is absent from the data is absent from the model, which is why a model trained only on tidy support tickets falls apart on the angry ones — and why fixing the data almost always beats fixing the architecture." },
 fl: { t: "Splitting data so the numbers mean something",
       s: ["You have 100,000 labelled examples",
           { s: "Split into train, validation and test", n: "Roughly 70 / 15 / 15." },
           { q: "Could the same record appear in two splits?",
             y: "Leakage — your test score is fiction and production will disappoint",
             n: "Tune on validation; touch the test set once, at the very end" },
           { s: "Split by time or by user where relevant", n: "Random splitting leaks the future into the past." }] }
},

"Label": {
 ex: { h: "Two doctors disagreeing on the same X-ray",
       b: "If two radiologists disagree 15% of the time, no model trained on their reports will be more than about 85% right — the ceiling sits in the data, not the algorithm. Measuring how often your annotators agree, before you train anything, is one of the highest-return hours in the whole project." },
 fl: { t: "Before you train anything",
       s: ["You have a labelling guideline and two annotators",
           { s: "Have both label the same 200 examples", n: "Independently, without seeing each other's answers." },
           { q: "Do they agree often enough?",
             y: "That agreement rate is roughly your achievable ceiling",
             n: "The guideline is ambiguous — fix it before labelling 50,000 more" },
           "Disagreements are also your best source of edge cases"] }
},

"Target Variable": {
 ex: { h: "Predicting rain using the number of umbrellas on the street",
       b: "The model scores brilliantly and is useless: umbrellas appear because it is already raining. Any feature that is really a consequence of the target produces spectacular accuracy in testing and nothing at all in production — and it is the most common way a promising model turns out to be worthless." },
 fl: { t: "Catching leakage in a feature list",
       s: ["A model predicts customer churn with 99% accuracy",
           { q: "Is `cancellation_date` in the feature set?",
             y: "That is the answer, not a clue — remove it and retrain",
             n: "Check every feature for the same shape of problem" },
           { s: "The test: would this value be available at prediction time?", n: "If it only exists after the outcome, it cannot be an input." },
           "Suspiciously high accuracy is a signal to look harder, not to celebrate"] }
},

"Checkpoint": {
 ex: { h: "Saving your game before the boss fight",
       b: "Three hours of progress and one crash. The save is not about being cautious — it is about being able to go back to the version that was better, because in training, later is not automatically an improvement. The best checkpoint is usually not the last one." },
 fl: { t: "Picking the right checkpoint to keep",
       s: ["Training runs for many epochs, saving as it goes",
           { s: "Training loss keeps falling the whole time", n: "That alone tells you nothing useful." },
           { q: "Has validation loss started rising?",
             y: "Everything after that turn is overfitting — keep the checkpoint from just before",
             n: "Keep training; there is still generalisation to gain" },
           "Early stopping automates exactly this decision"] }
},

"VRAM": {
 ex: { h: "The size of your kitchen worktop",
       b: "You can own any ingredient you like; if it does not fit on the worktop, you cannot cook with it right now. GPU memory is a hard wall, not a slope — the model does not run slowly when it does not fit, it refuses to start. And long prompts are the guest who spreads out and takes half the counter." },
 fl: { t: "Diagnosing CUDA out of memory",
       s: ["The model fails to load, or dies mid-generation",
           { s: "Three things compete for the same memory", n: "Weights, activations, and the KV cache that grows with context length." },
           { q: "Does it fail immediately, on load?",
             y: "The weights alone are too big — quantise, or use a smaller model",
             n: "It fails during a long request — the KV cache did it. Cap context or batch size" },
           "Reducing batch size is the fastest lever; quantisation is the biggest"] }
},

"Zero-Shot Learning": {
 ex: { h: "Asking a well-read colleague to sort the post",
       b: "You do not train them. You say *bills in this tray, personal in that one, junk in the bin* and they get on with it, because they have seen enough post in their life. Trying that first costs you one sentence — and it is right often enough that skipping it wastes weeks." },
 fl: { t: "The escalation ladder, in order",
       s: ["Try zero-shot: a clear instruction and a defined output format",
           { q: "Is the accuracy good enough?",
             y: "Stop. You are done, at the lowest possible cost",
             n: "Add three or four examples to the prompt — few-shot" },
           { q: "Still not good enough?",
             y: "Add retrieval so the model has the actual facts to hand",
             n: "Stop here — you have avoided training entirely" },
           { s: "Only then consider fine-tuning", n: "Highest cost, hardest to change, needs real labelled data." }] }
},

"Prompt Template": {
 ex: { h: "A standard letter with fields to fill in",
       b: "The council does not rewrite the rent-arrears letter each time. The wording is agreed once, reviewed, and only the name and amount change. Once a prompt works it stops being something you type and becomes part of the codebase — versioned, tested, and changed deliberately rather than in a chat window." },
 fl: { t: "Building a template that resists injection",
       s: ["Write the instructions once, with a slot for user content",
           { s: "Put the instructions above, the data below", n: "And say explicitly that what follows is data to process." },
           { s: "Wrap the user content in clear delimiters", n: "`<ticket>…</ticket>` — the model can see where it ends." },
           { q: "Does the user text contain *ignore previous instructions*?",
             y: "Delimiting and framing reduce the risk; they do not eliminate it",
             n: "Validate the output anyway — never trust it into a tool call unchecked" }] }
},

"System Message": {
 ex: { h: "The briefing before a shift, not a sign on the wall",
       b: "*You are on the returns desk today. Be brief. Never authorise over £50 without a manager.* It sets the frame for everything that follows and outranks a customer telling them otherwise. But it is instruction, not a lock on the till — the actual limit has to be enforced by the system." },
 fl: { t: "Where a rule should really live",
       s: ["You need the assistant never to reveal internal pricing",
           { s: "State it in the system message", n: "Clear, specific, one sentence." },
           { q: "Is that sufficient protection?",
             y: "No. A determined user can often talk around it",
             n: "There is no yes here" },
           { s: "Enforce it in code as well", n: "Do not put the data in the context, and filter the output." },
           "The system message shapes behaviour; your code sets the boundary"] }
},

"Max Tokens": {
 ex: { h: "A word limit on an exam answer",
       b: "Set it too low and the essay stops mid-sentence — which is exactly what a truncated model response looks like, trailing off with no full stop. The examiner also does not extend the paper because your question was long: prompt and answer share the same page, which is what the context window is." },
 fl: { t: "Diagnosing a response that stops mid-sentence",
       s: ["The answer ends abruptly with no punctuation",
           { q: "What is the `finish_reason` in the response?",
             y: "`length` — you hit the cap. Raise `max_tokens`",
             n: "`stop` — the model genuinely finished, so the problem is the prompt" },
           { s: "Check the context window too", n: "A very long prompt leaves less room for the answer." },
           "Always read `finish_reason` before assuming a response is complete"] }
},

"Stop Sequence": {
 ex: { h: "*Over* on a radio transmission",
       b: "One agreed word tells the listener the message has ended, so they do not sit waiting or talk over you. Give the model a closing tag to emit and stop on it, and you get a clean, bounded answer instead of one that wanders into a second, unrequested example." },
 fl: { t: "Getting exactly one item back",
       s: ["The model keeps adding a second example you did not ask for",
           { s: "Ask it to close with a specific marker", n: "`</answer>` at the end." },
           { s: "Pass that marker as a stop sequence", n: "Generation halts the instant it appears." },
           { q: "Is the marker included in the returned text?",
             y: "No — it is excluded, so the output parses cleanly",
             n: "Still validate what came back; stopping early is not correctness" }] }
},

"Greedy Decoding": {
 ex: { h: "Always taking the widest road at every junction",
       b: "Each individual choice looks best, and you can end up somewhere no one wanted — because the widest road at every turn is not the shortest route. It is perfectly repeatable, though, which is exactly why it is the right setting for classification and extraction and the wrong one for writing." },
 fl: { t: "Choosing a decoding setting for the job",
       s: ["The model produces a probability for every next token",
           { q: "Do you need the same input to give the same output?",
             y: "Temperature 0 — always take the top token. Classification, extraction, code",
             n: "Sample with temperature, top-k or top-p for variety" },
           { s: "Greedy is locally optimal, not globally", n: "It can also loop, repeating a phrase indefinitely." },
           "Even at temperature 0, identical output is not fully guaranteed"] }
},

"Streaming Response": {
 ex: { h: "A waiter bringing bread while the kitchen cooks",
       b: "Dinner does not arrive sooner. But you are eating something within thirty seconds instead of staring at a tablecloth for fifteen minutes, and the meal feels transformed. That is the whole trick — total time is identical, perceived time is not." },
 fl: { t: "What streaming changes in your code",
       s: ["The request is sent with streaming enabled",
           { s: "Tokens arrive over a long-lived connection", n: "Server-sent events, usually." },
           { q: "Are you expecting structured JSON back?",
             y: "You cannot validate until the stream ends — buffer, then parse",
             n: "Render each chunk as it arrives" },
           { s: "Handle mid-stream failures", n: "An error can arrive after half an answer is already on screen." },
           "Give the user a stop button — long generations must be cancellable"] }
},

"Time To First Token": {
 ex: { h: "The pause before someone answers the phone",
       b: "Three seconds of silence feels rude however good the answer turns out to be. Once they start talking, you relax. Users judge an assistant almost entirely on that opening pause — which is why shortening the answer does nothing for perceived speed and shortening the prompt does." },
 fl: { t: "Reducing the wait before the first word",
       s: ["Users say the assistant feels slow",
           { s: "TTFT covers queueing plus processing the whole prompt", n: "Everything before a single token comes back." },
           { q: "Is your system prompt long and identical every time?",
             y: "Turn on prompt caching — the biggest single win available",
             n: "Trim resent conversation history and retrieved context" },
           "Making the answer shorter improves total time, not this number"] }
},

"Tokens Per Second": {
 ex: { h: "Reading speed versus a printing press",
       b: "A person reads about 12 tokens a second, so anything above 20 already feels instant while streaming. But a press that prints one book very fast is different from one that prints a thousand books an hour — and confusing per-request speed with total system throughput is how capacity planning goes wrong." },
 fl: { t: "Two different numbers, two different jobs",
       s: ["You are sizing a serving setup",
           { q: "Are you asking about one user's experience?",
             y: "Per-request tokens/sec — above ~20 feels instantaneous",
             n: "Total system throughput — what the hardware delivers across everyone" },
           { s: "Batching trades between them", n: "Bigger batches raise total throughput and slightly slow each request." },
           "Quantisation usually improves both, at some quality cost"] }
},

"Cost Per Token": {
 ex: { h: "A taxi meter that charges more for the return leg",
       b: "Input is the ride out, output is the ride back, and the return costs three to five times more. The surprise on the bill is usually not the answers — it is that you re-send the entire conversation on every single turn, so a long chat pays for its own history again and again." },
 fl: { t: "Finding where the bill actually goes",
       s: ["The monthly invoice is higher than expected",
           { q: "Are input tokens dominating output tokens?",
             y: "Almost always — resent history and retrieved documents",
             n: "You are generating long answers; cap `max_tokens`" },
           { s: "Cache the stable prefix", n: "A long system prompt sent unchanged every call is the ideal candidate." },
           { s: "Route easy requests to a smaller model", n: "Classification rarely needs your largest model." },
           "Trim conversation history — summarise older turns instead of resending them"] }
},

"Tool Use": {
 ex: { h: "A consultant who can phone the warehouse",
       b: "They do not memorise stock levels — they ask. That is the whole upgrade from a model that only writes text. But you would not hand a new consultant the authority to issue refunds on day one, and a model requesting a tool call deserves exactly the same scepticism as a form submitted by a stranger." },
 fl: { t: "Handling a tool call safely",
       s: ["You describe the available tools and their argument schemas",
           { s: "The model replies with a structured call, not prose", n: "`get_stock` with `{\"sku\": \"AB-12\"}`." },
           { q: "Do the arguments validate against your schema?",
             y: "Run the tool and return the result as another message",
             n: "Reject it — never pass model output straight into SQL or a shell" },
           { q: "Is the action destructive or irreversible?",
             y: "Require explicit human confirmation first",
             n: "Execute, return the result, and let the model continue" }] }
},

"Golden Dataset": {
 ex: { h: "A tasting panel with a fixed set of dishes",
       b: "You change the recipe and serve the same six dishes to the same panel. Without that fixed set, *it tastes better now* is one person's opinion on one evening. Fifty to two hundred well-chosen cases turn prompt engineering from guesswork into measurement." },
 fl: { t: "Building one that keeps earning its keep",
       s: ["Collect 50–200 real inputs with verified correct outputs",
           { s: "Include the ordinary, the awkward and the known failures", n: "Composition matters far more than size." },
           { q: "Are you about to change a prompt or a model?",
             y: "Run the set before and after — compare, do not guess",
             n: "Add every new production failure to the set permanently" },
           "Each captured failure is a bug that can never silently return"] }
},

"Determinism": {
 ex: { h: "A vending machine versus a jazz musician",
       b: "Press B4 a thousand times and a thousand identical bags of crisps come out. Ask a musician for the same solo twice and you get two performances. Model inference is the musician even at temperature 0, which is why asserting on an exact output string produces a permanently flaky test." },
 fl: { t: "Testing something that does not repeat",
       s: ["You want a regression test around an LLM feature",
           { q: "Are you asserting on the exact text?",
             y: "It will fail eventually for no reason — the team will start ignoring it",
             n: "Assert on structure and properties instead" },
           { s: "Check the JSON parses, required fields exist, the label is in the allowed set", n: "For open-ended output, use a model-as-judge with a rubric." },
           "Pin the model version — a silent upgrade is a silent behaviour change"] }
},

"Random Seed": {
 ex: { h: "A shuffled deck you can shuffle the same way twice",
       b: "Give a card-shuffling machine the same starting setting and it produces the identical order every time. That is what makes an experiment repeatable — but if your conclusion changes when you change the setting, you measured the shuffle rather than the strategy." },
 fl: { t: "Making a run reproducible, and knowing when it lies",
       s: ["Set the seed for every library involved",
           { s: "Python's `random`, NumPy, the framework, the data loader", n: "Miss one and the run is not reproducible." },
           { q: "Does changing the seed change your conclusion?",
             y: "You measured noise — report a mean and spread across several seeds",
             n: "The result is stable enough to act on" },
           "Never use a normal random generator for tokens, keys or passwords"] }
},

"Embedding Dimension": {
 ex: { h: "Two libraries with incompatible catalogue systems",
       b: "Both file by subject, both work perfectly, and a reference from one is meaningless in the other. Vectors from different embedding models are exactly this — not merely less accurate together, but genuinely uncomparable, which is why swapping models means re-embedding every document you have." },
 fl: { t: "Changing your embedding model",
       s: ["A newer, better embedding model is released",
           { q: "Do the dimensions or the model differ from what is indexed?",
             y: "Every stored vector is now incomparable — this is a migration",
             n: "There is no such case; even a version bump can shift the space" },
           { s: "Re-embed the whole corpus into a new index", n: "Then switch reads over and drop the old one." },
           "Budget for it before you choose the first model, not after"] }
},

"Chunk Overlap": {
 ex: { h: "Cutting a long document into pages mid-sentence",
       b: "*The refund period is* ends page one; *thirty days from delivery* starts page two. Retrieve either page alone and the answer is missing. Repeating the last line at the top of the next page — a running head — means the idea survives whichever page you happen to pull." },
 fl: { t: "Chunking so answers do not get severed",
       s: ["A long document is split for embedding",
           { q: "Do chunks break mid-sentence or mid-clause?",
             y: "Split on headings and paragraphs first — this matters more than the numbers",
             n: "Good; now add 10–20% overlap between consecutive chunks" },
           { s: "Boundaries now appear in two chunks", n: "So the idea is retrievable either way." },
           "Expect some near-duplicate results — dedupe or rerank before sending to the model"] }
},

"Ablation Study": {
 ex: { h: "Taking ingredients out of a sauce one at a time",
       b: "The sauce improved after you added four things. Which one did it? Possibly one; possibly one helped and another hurt and they cancelled. Removing each in turn and tasting again is how you find out — and it routinely reveals that the expensive ingredient contributed nothing." },
 fl: { t: "Finding out what is actually working",
       s: ["A pipeline has retrieval, reranking, few-shot examples and a long prompt",
           { s: "Fix your evaluation set", n: "Without it the numbers mean nothing." },
           { s: "Remove one component, re-measure, put it back", n: "Repeat for each." },
           { q: "Did removing something change nothing measurable?",
             y: "Delete it — free latency and cost, at no quality cost",
             n: "Now you know which parts are load-bearing" }] }
},

"Learning Curve": {
 ex: { h: "A student who aces homework and fails the exam",
       b: "The homework scores keep improving while the mock exam scores start sliding. That gap is the whole diagnosis: they are memorising the practice questions, not learning the subject. Plotting both lines together is how you see it happening long before the final result." },
 fl: { t: "Reading the two lines",
       s: ["Plot training and validation error against epochs",
           { q: "Are both falling and close together?",
             y: "It is learning — carry on",
             n: "Look at which one is misbehaving" },
           { s: "Training falls, validation rises", n: "Overfitting — stop at the turn, add regularisation or more data." },
           { s: "Both high and flat", n: "Underfitting — the model is too simple, or the features are too weak." },
           "Against dataset size instead, the curve tells you whether more data would help"] }
},

"Inference Endpoint": {
 ex: { h: "A specialist consultant on retainer",
       b: "They are extremely capable and extremely expensive to have sitting idle, so the practice keeps them booked back-to-back. That is why serving stacks batch requests. And bringing a new one in takes half an hour of reading in — which is the cold start every GPU-backed endpoint pays when it scales up." },
 fl: { t: "Why the first request after a quiet spell is slow",
       s: ["Traffic drops and the endpoint scales to zero",
           { s: "A request arrives", n: "There is no warm instance to take it." },
           { s: "A machine starts and loads the weights into GPU memory", n: "Tens of seconds for a large model." },
           { q: "Can you tolerate that occasionally?",
             y: "Scale-to-zero saves real money on bursty workloads",
             n: "Keep a minimum warm instance and pay for the idle time" },
           "Concurrency here is bounded by GPU memory, not CPU cores"] }
}

});
