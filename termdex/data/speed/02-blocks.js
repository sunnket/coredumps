/* Speed Coding — rung 3: blocks, where the indentation is part of the motion.

   This is the rung where most people slow right down, because newline-then-
   indent is a movement nobody practises deliberately. The sets are ordered
   from general Python through to the lines specific to AI engineering work.

   Blocks are short on purpose. A twelve-line card stops training fluency and
   starts training patience -- three to six lines is where the value is. */

TD.addSpeedSets([

  {
    id: "blocks",
    rung: 3,
    name: "Everyday blocks",
    lvl: "intermediate",
    time: "8 min",
    why: "Several lines together, where the indentation is part of what you are typing. Get these into your hands and the shape of ordinary Python stops costing you any thought at all.",
    cards: [
      { c: "try:\n    main()\nexcept Exception as e:\n    logger.exception(e)",
        w: "run something and log whatever goes wrong", hint: "four lines",
        why: "`logger.exception` records the full traceback and may only be called inside an `except` block. `logger.error` in the same place throws the stack trace away." },

      { c: "for row in rows:\n    if not row.valid:\n        continue\n    process(row)",
        w: "skip the invalid rows with a guard, then work", hint: "four lines",
        why: "The `continue` guard keeps the real work at one indentation level. Adding a fifth rule later is two more lines, not another level of nesting." },

      { c: "def load(path):\n    with open(path) as f:\n        return json.load(f)",
        w: "a function that reads and returns JSON", hint: "three lines",
        why: "Returning from inside `with` is fine — the file still closes. The block's clean-up runs on the way out, however you leave it." },

      { c: "class User:\n    def __init__(self, name):\n        self.name = name",
        w: "the smallest useful class", hint: "three lines",
        why: "If a class is only this, a `@dataclass` or a `NamedTuple` gives you equality, a readable repr and immutability for free." },

      { c: "if response.ok:\n    return response.json()\nreturn None",
        w: "return the body on success, nothing otherwise", hint: "three lines",
        why: "No `else` needed — the early return already ended that path. Guard-and-return keeps functions flat and is what senior code tends to look like." },

      { c: "counts = defaultdict(list)\nfor r in records:\n    counts[r.key].append(r)",
        w: "group records by a key", hint: "three lines",
        why: "`defaultdict(list)` creates the empty list the first time a key is touched, which deletes the check-then-insert dance and the `KeyError` that comes with forgetting it." },

      { c: "with open(path) as f:\n    for line in f:\n        process(line.strip())",
        w: "stream a file of any size", hint: "three lines",
        why: "A file object is its own iterator, so this holds one line in memory at a time. It reads a 400 GB log on a laptop; `f.readlines()` would not." },

      { c: "def get(d, key, default=None):\n    try:\n        return d[key]\n    except KeyError:\n        return default",
        w: "a safe lookup, written out longhand", hint: "five lines",
        why: "Worth typing once to see what `dict.get` already does for you. In real code use `d.get(key, default)` — this is the version to recognise, not to write." },

      { c: "@dataclass\nclass Point:\n    x: float\n    y: float",
        w: "a class with no boilerplate at all", hint: "four lines",
        why: "The decorator writes `__init__`, `__repr__` and `__eq__` from the annotations. Add `frozen=True` and instances become immutable and hashable." },

      { c: "def main():\n    args = parse_args()\n    run(args)\n\n\nif __name__ == \"__main__\":\n    main()",
        w: "the standard shape of a runnable script", hint: "seven lines, two blank",
        why: "Two blank lines before a top-level statement is PEP 8, and every formatter will enforce it. Worth having in the fingers rather than fixed after the fact." }
    ]
  },

  {
    id: "aieng",
    rung: 3,
    name: "The training loop",
    lvl: "intermediate",
    time: "8 min",
    why: "The lines specific to the job you are preparing for. In an interview you will be talking while you type these, so they need to come out of your hands without any attention at all.",
    cards: [
      { c: "optimizer.zero_grad()", w: "clear last step's gradients",
        why: "PyTorch accumulates gradients by default. Omit this and every batch's gradients sum together, so the model updates on nonsense — the single most common training bug." },

      { c: "loss.backward()", w: "compute gradients for every parameter",
        why: "This walks the graph built during the forward pass and fills in `.grad` on every tensor. It changes no weights at all — that is the optimiser's job." },

      { c: "optimizer.step()", w: "apply one update to the weights",
        why: "This line, and only this line, changes the model. Everything before it measures; this is the part that learns." },

      { c: "with torch.no_grad():", w: "run inference without tracking gradients",
        why: "Stops the graph being recorded, which saves memory and time. Its absence is why validation sometimes runs out of GPU memory when training did not." },

      { c: "model.eval()", w: "switch layers to inference behaviour",
        why: "Changes dropout and batch-norm, nothing else. Forgetting it gives quietly wrong predictions with no error — dropout stays on and batch-norm keeps updating." },

      { c: "device = \"cuda\" if torch.cuda.is_available() else \"cpu\"",
        w: "pick the accelerator if there is one",
        why: "Write it once at the top and send both model and batches to `device`. A model on the GPU and data on the CPU raises an error that names neither as the cause." },

      { c: "for batch in train_loader:", w: "one step per batch",
        why: "A DataLoader is an iterable, not a list — it yields batches on demand, which is how a dataset larger than RAM trains at all." },

      { c: "loss = criterion(outputs, labels)", w: "measure how wrong the batch was",
        why: "Argument order is predictions first, truth second. Swapping them silently gives a different number for most loss functions, and no error." },

      { c: "optimizer.zero_grad()\noutputs = model(x)\nloss = criterion(outputs, y)\nloss.backward()\noptimizer.step()",
        w: "the five lines that do the learning, in order", hint: "five lines",
        why: "This exact order is a standard screening question. Zero, forward, measure, backward, step — every other line in a training script is bookkeeping around these five." },

      { c: "model.train()\nfor epoch in range(epochs):\n    for batch in loader:\n        train_step(batch)",
        w: "the two nested loops of training", hint: "four lines",
        why: "Epochs outside, batches inside. One epoch is one pass over the whole dataset; one batch is one weight update." },

      { c: "torch.save(model.state_dict(), path)", w: "save the weights, not the object",
        why: "Saving `state_dict()` stores just the tensors, so the checkpoint survives you refactoring the class. Pickling the whole model does not." },

      { c: "scaler.step(optimizer)\nscaler.update()", w: "the two lines mixed precision adds", hint: "two lines",
        why: "Mixed precision scales the loss up before the backward pass so small gradients do not vanish in fp16, then unscales before the step. These lines are the unscale-and-adjust." }
    ]
  },

  {
    id: "llmops",
    rung: 3,
    name: "Working with language models",
    lvl: "advanced",
    time: "7 min",
    why: "The lines an AI engineer types that an ML engineer usually does not — API calls, retries, structured output and the retrieval loop.",
    cards: [
      { c: "client = Anthropic(api_key=os.environ[\"ANTHROPIC_API_KEY\"])",
        w: "construct a client from the environment",
        why: "`os.environ[...]` raises immediately if the key is missing; `os.environ.get` returns None and fails much later with a confusing auth error. Fail early." },

      { c: "response = client.messages.create(\n    model=\"claude-sonnet-4-5\",\n    max_tokens=1024,\n    messages=messages,\n)",
        w: "the standard call shape", hint: "five lines",
        why: "`max_tokens` caps the *output*, and output is the expensive, slow half. Setting it deliberately is the cheapest cost control you have." },

      { c: "messages.append({\"role\": \"user\", \"content\": text})",
        w: "add a turn to the conversation",
        why: "The model has no memory between calls — this list is the entire context. Everything it knows about the conversation, you are sending every time." },

      { c: "for attempt in range(5):\n    try:\n        return call()\n    except RateLimitError:\n        time.sleep(2 ** attempt)",
        w: "a bounded retry with backoff", hint: "five lines",
        why: "A `for` over a fixed range cannot hang, unlike `while True`. Doubling the wait stops a struggling service being hammered by its own clients." },

      { c: "embeddings = model.encode(texts, normalize_embeddings=True)",
        w: "turn text into vectors",
        why: "Normalising makes the dot product equal cosine similarity, so your vector store can use the cheaper operation and still rank correctly." },

      { c: "hits = index.search(query_vec, k=5)", w: "retrieve the nearest neighbours",
        why: "`k` is a real tuning knob. Too few and the answer is not in context; too many and the useful chunk gets buried in the middle, where models attend worst." },

      { c: "class Extract(BaseModel):\n    name: str\n    amount: float",
        w: "a schema for structured output", hint: "three lines",
        why: "Validating the shape proves the JSON parsed — never that the values are right. Check enums and ranges separately, and never trust a returned id without looking it up." },

      { c: "parsed = Extract.model_validate_json(raw)",
        w: "parse and validate in one step",
        why: "Pydantic v2 names it `model_validate_json`; v1 called it `parse_raw`. Reaching for the v1 name on a v2 project is a very common few minutes lost." },

      { c: "@retry(stop=stop_after_attempt(3))", w: "the decorator form of a retry",
        why: "Fine for idempotent reads. Never wrap a non-idempotent write in a blind retry — that is how a payment gets charged twice." },

      { c: "tokens = len(encoding.encode(text))", w: "count tokens before sending",
        why: "Count before the call, not after the error. Code and non-English text tokenise two to three times less efficiently than English prose, so a character estimate will mislead you." }
    ]
  },

  {
    id: "interview",
    rung: 3,
    name: "Interview reflexes",
    lvl: "advanced",
    time: "8 min",
    why: "The handful of patterns that open half of all coding questions. Typing these without hesitating buys you the thinking time you actually need for the hard part of the problem.",
    cards: [
      { c: "seen = {}\nfor i, n in enumerate(nums):\n    if target - n in seen:\n        return [seen[target - n], i]\n    seen[n] = i",
        w: "two-sum, the whole solution", hint: "five lines",
        why: "The hash map turns a nested loop into one pass — O(n) instead of O(n squared). It is the single most reused trick in interview problems." },

      { c: "lo, hi = 0, len(nums) - 1\nwhile lo < hi:",
        w: "set up two pointers and walk them inward", hint: "two lines",
        why: "Strictly `<`, not `<=`: when the pointers meet there is no pair left to form, and `lo == hi` would pair an element with itself." },

      { c: "left = 0\nfor right, x in enumerate(xs):\n    while invalid():\n        left += 1",
        w: "the sliding window skeleton", hint: "four lines",
        why: "It looks nested but is linear: `left` only ever moves right, so across the whole run it advances at most n times in total — not n times per step." },

      { c: "@lru_cache(maxsize=None)\ndef solve(i, k):", w: "memoise a recursive solution", hint: "two lines",
        why: "The fastest route to a dynamic-programming answer: write the plain recursion, confirm it is correct, then add this one line. Arguments must be hashable." },

      { c: "queue = deque([start])\nwhile queue:\n    node = queue.popleft()",
        w: "the BFS skeleton", hint: "three lines",
        why: "`deque.popleft()` is O(1); `list.pop(0)` is O(n) because everything shifts. Using a list here turns a linear BFS into a quadratic one." },

      { c: "visited = set()\nif node in visited:\n    continue\nvisited.add(node)",
        w: "the guard that stops a graph walk looping", hint: "four lines",
        why: "Any graph with a cycle runs forever without this. Adding the visited check is the difference between a traversal and an infinite loop." },

      { c: "heapq.heappush(heap, (-score, item))", w: "push onto a max-heap",
        why: "Python's `heapq` is min-only, so you negate to get a maximum. The tuple sorts by the first element, which is why the score goes first." },

      { c: "return sorted(counts.items(), key=lambda kv: -kv[1])[:k]",
        w: "the top k by count",
        why: "Fine for small inputs; for large ones `heapq.nlargest(k, ...)` is O(n log k) rather than O(n log n). Saying which you would use, and why, is the answer they want." }
    ]
  }

]);
