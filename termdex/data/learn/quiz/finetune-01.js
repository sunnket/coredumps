/* Fine-Tuning & Model Adaptation — question bank.

   Heavily weighted towards `hardcore`, because almost every real fine-tuning
   mistake is a plausible decision that fails silently: a run that trains
   happily, shows a falling loss curve, and produces a model that is quietly
   worse than the one you started with. */

TD.addMCQ("finetune", "decide", [
  {
    tag: "Knowledge or behaviour",
    lvl: "hardcore",
    q: "Your support assistant gives wrong answers about your product's current pricing. What should you do?",
    o: [
      "Retrieval — the pricing is knowledge, and it changes",
      "Fine-tune on the pricing pages so the model learns them",
      "Fine-tune on support transcripts so it learns the domain",
      "Increase the temperature so the model explores more answers"
    ],
    a: 0,
    x: "Retrieval adds knowledge; fine-tuning changes behaviour. Facts that change need to be looked up, not baked into weights.",
    note: "Fine-tuning on the pricing pages is the tempting answer and the expensive one: the model learns the *style* of your pricing pages and then invents plausible prices in that style — fluently, confidently, and much harder to catch than an admission of ignorance."
  },
  {
    tag: "The baseline",
    lvl: "hardcore",
    q: "Which baseline must a fine-tune beat before it is worth shipping?",
    o: [
      "The same base model prompted well, with few-shot examples in context",
      "The base model with a zero-shot prompt",
      "A randomly initialised model of the same size",
      "The previous fine-tune of the same base"
    ],
    a: 0,
    x: "Few-shot prompting is genuinely strong and it costs an afternoon. If your three-week fine-tune does not beat it, you have produced a maintenance burden rather than an improvement.",
    note: "Beating zero-shot is the trap, because zero-shot was never the alternative. A report comparing a fine-tune against zero-shot has compared it against a straw man."
  },
  {
    tag: "Signals to proceed",
    lvl: "hardcore",
    q: "You measure prompting with 5 and then 20 in-context examples. Accuracy rises from 0.84 to 0.87. What does that suggest?",
    o: [
      "More examples still help, so a fine-tune on thousands of them is likely to pay",
      "Prompting has plateaued, so fine-tuning will not help either",
      "The evaluation set is too small to be informative",
      "The model is overfitting to the examples in context"
    ],
    a: 0,
    x: "A curve still rising with more examples is evidence that the model benefits from more of your data than fits in a prompt — which is exactly the situation fine-tuning addresses.",
    note: "The reverse is the more useful reading: if going from 3 to 20 examples changes nothing, the model has extracted everything it can from your data and a fine-tune will not either."
  },
  {
    tag: "Access control",
    lvl: "hardcore",
    q: "Your enterprise customer needs per-document access control over an assistant. Why does that rule out fine-tuning on their documents?",
    o: [
      "Weights cannot be un-learned for one user, so anything in them is available to everyone who can call the model",
      "Fine-tuning is not permitted on data subject to a DPA",
      "Fine-tuned models cannot be deployed inside a VPC",
      "Access control requires embeddings, which fine-tuning removes"
    ],
    a: 0,
    x: "Retrieval can filter per user at query time. A fact absorbed into weights is available to every caller, and revoking one person's access to it is not a thing you can do.",
    note: "This is often the argument that settles an enterprise design discussion, and it is worth raising unprompted."
  },
  {
    tag: "The strongest case",
    lvl: "intermediate",
    q: "Which situation is the most defensible commercial reason to fine-tune?",
    o: [
      "A frontier model does one narrow task well at high cost, and you have thousands of logged examples of it doing so",
      "The team wants experience with fine-tuning",
      "The model occasionally makes factual errors about your domain",
      "The base model is a few months old and a newer one exists"
    ],
    a: 0,
    x: "Distilling a specific behaviour into a small model can cut inference cost by an order of magnitude, and the training data already exists in your logs.",
    note: "That arithmetic — the cost of building the dataset against the monthly saving — is the business case, and it is the version of this project most likely to be approved and most likely to succeed."
  }
]);

TD.addMCQ("finetune", "data", [
  {
    tag: "Quantity and quality",
    lvl: "hardcore",
    q: "You can have 1,000 hand-checked examples or 10,000 scraped ones. Which produces a better fine-tune?",
    o: [
      "The 1,000 checked examples, usually by a clear margin",
      "The 10,000 scraped examples, since more data always helps",
      "They perform identically once deduplicated",
      "Whichever has the longer average sequence length"
    ],
    a: 0,
    x: "This is the most reliable empirical finding in applied fine-tuning. Bad examples do not average out — the model learns them.",
    note: "It is also the opposite of the instinct people bring from classical machine learning, where more rows genuinely does help. Here every hour spent removing bad examples beats several spent adding more."
  },
  {
    tag: "Deduplication",
    lvl: "hardcore",
    q: "Your log-derived dataset contains 400 support tickets differing only in the customer's name. What is the effect of training on all of them?",
    o: [
      "That phrasing dominates the gradient and the model produces it regardless of input",
      "Nothing — repeated examples reinforce a correct pattern",
      "The model becomes more robust to name variation",
      "Training loss rises, making the problem visible"
    ],
    a: 0,
    x: "Duplicates act as a higher learning rate on one example. The result is a model that answers with that template whatever it is asked.",
    note: "Training loss goes **down**, not up, which is why this is invisible unless you deduplicate deliberately. Near-duplicate removal routinely cuts a log-derived dataset by a third, and the smaller dataset is the better one."
  },
  {
    tag: "Decontamination",
    lvl: "hardcore",
    q: "Why remove training examples that closely resemble examples in your evaluation set?",
    o: [
      "Otherwise the evaluation measures memorisation rather than capability",
      "Because duplicate text causes a tokeniser error",
      "To keep the training set balanced by category",
      "It is only necessary when using a public benchmark"
    ],
    a: 0,
    x: "An evaluation example the model has effectively already seen produces a number that will not survive contact with production.",
    note: "There are two contaminations to worry about: yours, which you control, and the base model's — public benchmarks are in pre-training corpora, so a base model's benchmark score is a weak absolute claim even before you touch it."
  },
  {
    tag: "Splitting",
    lvl: "hardcore",
    q: "Your dataset contains several chunks from each source contract. How should you split train and test?",
    o: [
      "By contract, so no contract appears on both sides",
      "Randomly by row, which is the standard approach",
      "By chunk length, keeping the distributions matched",
      "By category, one category held out entirely"
    ],
    a: 0,
    x: "Two chunks of the same contract in train and test is leakage. Split by the unit that produced the rows — document, customer, or time period.",
    note: "A random row split is the tempting answer because it is what every tutorial does, and it will flatter your score by several points in a way you cannot detect from the numbers alone."
  },
  {
    tag: "Chat templates",
    lvl: "hardcore",
    q: "Why format training examples with `tokenizer.apply_chat_template` rather than writing the special tokens yourself?",
    o: [
      "The model was trained to condition on its own exact markers, and a mismatch teaches it a second, conflicting convention",
      "Hand-written templates cause a tokenisation error that fails fast",
      "The template is required for gradient checkpointing to work",
      "Writing them by hand is slower at training time"
    ],
    a: 0,
    x: "Each model family has its own markers. Using the wrong ones means the fine-tune fights the pre-training, and the symptom is a model that leaks markers and is broadly slightly worse.",
    note: "It fails silently, which is the point. There is no error — just a diagnosis of \"the fine-tune made the model worse\", which is the least actionable sentence in the field."
  },
  {
    tag: "Loss masking",
    lvl: "hardcore",
    q: "You train without masking the prompt, so loss is computed on every token. What does the resulting model do at inference?",
    o: [
      "It answers, then writes a plausible next user question and answers that too",
      "It refuses to answer anything outside the training distribution",
      "It produces empty outputs",
      "It ignores the system prompt entirely"
    ],
    a: 0,
    x: "Graded on predicting the user's turn as well, the model learns to generate user messages — so it continues past its own answer.",
    note: "It looks like a stop-sequence problem, which is why people spend a day on generation settings. The other two options here are real failures with different causes: empty outputs come from pad and eos being the same unmasked token, and never stopping comes from no EOS in the training sequences."
  },
  {
    tag: "Verification",
    lvl: "intermediate",
    q: "Before starting a run, you decode one batch and print only the tokens whose label is not -100. What should you see?",
    o: [
      "The assistant's answer and nothing else",
      "The full conversation including the user's message",
      "Only the special tokens",
      "The prompt with the answer masked out"
    ],
    a: 0,
    x: "That is the definition of correct masking, and this two-minute check catches template mismatches, missing EOS and unmasked prompts before you spend four hours on a bad run.",
    note: "Also check that an EOS token is present and that pad differs from eos — three of the four common silent failures are visible in this one printout."
  }
]);

TD.addMCQ("finetune", "peft", [
  {
    tag: "The decomposition",
    lvl: "core",
    q: "In LoRA, which parameters are updated during training?",
    o: [
      "Only the low-rank matrices A and B; the base weights stay frozen",
      "All weights, but at a reduced learning rate",
      "Only the attention weights; the feed-forward layers are frozen",
      "The base weights, with A and B acting as a regulariser"
    ],
    a: 0,
    x: "The base model is frozen and the update is expressed as B·A with rank far below the weight matrix's dimension. That is why gradients, master weights and optimiser state exist only for a fraction of a percent of the parameters.",
    note: "B is initialised to zero so that B·A is zero at step 0 — training therefore starts from exactly the base model, not from a randomly perturbed one."
  },
  {
    tag: "Inference cost",
    lvl: "hardcore",
    q: "How much slower is a **merged** LoRA model than the base model at inference?",
    o: [
      "Not at all — merging folds B·A into W, so it is the same computation on the same shapes",
      "About 10%, from the extra matrix multiplications",
      "Roughly double, because both paths must be evaluated",
      "It depends on the rank, scaling linearly with r"
    ],
    a: 0,
    x: "After merging there is one weight matrix and one matmul, identical in shape to the original. Exactly as fast, not nearly.",
    note: "The 10% figure describes an *unmerged* adapter, which is a deliberate choice you make to serve many adapters against one base. The pre-LoRA adapter-layer approach could not be merged at all, and that permanent latency cost is the problem LoRA solved."
  },
  {
    tag: "Rank and alpha",
    lvl: "hardcore",
    q: "You double the rank from 16 to 32 while leaving `lora_alpha` at 32, and the model performs worse. What is the most likely explanation?",
    o: [
      "The effective scale is alpha/r, so doubling r halved the update's magnitude",
      "Rank 32 always overfits on datasets under 10,000 examples",
      "The adapter no longer fits in memory and was silently truncated",
      "Higher rank requires a lower learning rate to converge at all"
    ],
    a: 0,
    x: "Alpha and rank interact through the scaling factor. Changing one without the other changes two things at once, and the comparison means nothing.",
    note: "Fix `alpha = 2r` and vary r alone. This is why so many people conclude \"higher rank did not help\" from an experiment that never tested higher rank."
  },
  {
    tag: "Target modules",
    lvl: "intermediate",
    q: "Current practice targets which modules with LoRA?",
    o: [
      "All linear layers — the attention projections and the feed-forward projections",
      "Only the query and value projections, as in the original paper",
      "Only the embedding and output layers",
      "The layer norms, since they control activation scale"
    ],
    a: 0,
    x: "Targeting every linear layer consistently outperforms attention-only for a modest increase in trainable parameters.",
    note: "The original paper's query-and-value-only setup is still widely copied and is now a mild handicap."
  },
  {
    tag: "Memory arithmetic",
    lvl: "hardcore",
    q: "Roughly how much memory does full fine-tuning need per parameter, with mixed precision and Adam, before activations?",
    o: [
      "About 16 bytes",
      "About 2 bytes, since the weights are BF16",
      "About 4 bytes, since the optimiser stores one FP32 copy",
      "About 8 bytes, split evenly between weights and gradients"
    ],
    a: 0,
    x: "2 for BF16 weights, 2 for gradients, 4 for the FP32 master copy, and 4 each for Adam's two moments.",
    note: "The FP32 master copy is the term people forget. Mixed precision does not mean everything is 16-bit — the optimiser keeps a full-precision copy or the small updates round away to nothing.",
    steps: [
      "BF16 weights: 2 bytes/param.",
      "BF16 gradients: 2 bytes/param.",
      "FP32 master weights: 4 bytes/param.",
      "Adam first moment: 4 bytes/param. Second moment: 4 bytes/param.",
      "Total 16 bytes/param — an 8B model needs ~128 GB before a single activation."
    ]
  },
  {
    tag: "Merging",
    lvl: "hardcore",
    q: "You trained with QLoRA against a 4-bit quantised base. Which weights should you merge the adapter into?",
    o: [
      "The original BF16 weights, loaded fresh",
      "The 4-bit quantised weights you trained against, for consistency",
      "Either — the result is numerically identical",
      "Neither; a QLoRA adapter cannot be merged"
    ],
    a: 0,
    x: "Merging into the quantised weights bakes quantisation error permanently into the model. Load the original full-precision base and merge into that, then quantise the result if you want to.",
    note: "\"For consistency\" is the tempting reasoning and it is exactly backwards: the quantisation was a memory device for training, not a property you want to preserve."
  },
  {
    tag: "Compute dtype",
    lvl: "hardcore",
    q: "You configure 4-bit loading but leave `bnb_4bit_compute_dtype` at its default. What is the likely consequence?",
    o: [
      "Matmuls run in FP32 after dequantisation, roughly halving training speed for no benefit",
      "The model fails to load with a dtype error",
      "Memory usage doubles",
      "Nothing — the compute dtype only affects inference"
    ],
    a: 0,
    x: "The frozen weights are dequantised for each matrix multiply, and this setting decides the precision of that arithmetic. FP32 is slower and buys nothing here.",
    note: "It produces no error and no warning — just a run that takes twice as long as it should, which people attribute to the hardware."
  }
]);

TD.addMCQ("finetune", "run", [
  {
    tag: "Learning rate",
    lvl: "hardcore",
    q: "Your LoRA run's loss barely moves over three epochs. Which cause should you check first?",
    o: [
      "The learning rate is around 2e-5, which is a full-fine-tuning rate and far too low for an adapter",
      "The dataset is too small",
      "The rank is too low to represent the task",
      "The base model is too strong to improve"
    ],
    a: 0,
    x: "LoRA wants roughly 1e-4 to 3e-4 — about ten times a full fine-tuning rate — because only a small adapter is moving.",
    note: "Reusing 2e-5 out of habit is the single most common reason a LoRA run appears to do nothing, and the flat loss curve looks exactly like a data problem."
  },
  {
    tag: "Base model choice",
    lvl: "intermediate",
    q: "You have 6,000 instruction-following examples. Should you start from the base model or the instruct-tuned model?",
    o: [
      "The instruct model, because it already follows instructions and you are only adjusting how",
      "The base model, so the fine-tune is not fighting existing behaviour",
      "It makes no measurable difference at this dataset size",
      "The base model, because instruct models cannot be fine-tuned further"
    ],
    a: 0,
    x: "Teaching instruction-following from scratch needs tens of thousands of examples. Starting from the instruct model means your 6,000 are spent on your actual task.",
    note: "Starting from the base model is right when you have a very large dataset or when the instruct model's behaviour genuinely conflicts with what you want."
  },
  {
    tag: "Checkpoints",
    lvl: "hardcore",
    q: "Why set `load_best_model_at_end` rather than shipping the final checkpoint?",
    o: [
      "The final checkpoint is usually past the point where validation stopped improving",
      "The final checkpoint is stored in a different format",
      "Early checkpoints train faster at inference",
      "The final checkpoint omits the adapter weights"
    ],
    a: 0,
    x: "Training loss keeps falling after validation flattens. The last checkpoint is therefore often more overfitted and more forgetful than one from two-thirds through.",
    note: "It also costs nothing — the checkpoints are being written anyway."
  },
  {
    tag: "Probes",
    lvl: "hardcore",
    q: "You add three generation probes that run at every evaluation step. Why include one that is unrelated to your task?",
    o: [
      "It is an early-warning signal for catastrophic forgetting, visible while the run is still going",
      "It keeps the evaluation loss comparable across runs",
      "It prevents the model overfitting to the probes",
      "It is required for the trainer to compute a validation metric"
    ],
    a: 0,
    x: "Watching an off-task answer become terse and odd at step 900 tells you the model is losing general capability, and lets you stop rather than discovering it after four hours.",
    note: "The on-task probes tell you it is learning. Only the off-task probe tells you what it is forgetting, and forgetting is the failure that survives to production."
  },
  {
    tag: "Precision",
    lvl: "intermediate",
    q: "Why prefer BF16 over FP16 for training, given BF16 has fewer mantissa bits?",
    o: [
      "BF16 has the same exponent range as FP32, so it does not overflow and needs no loss scaling",
      "BF16 uses half the memory of FP16",
      "FP16 is not supported on modern GPUs",
      "BF16 is more accurate per operation"
    ],
    a: 0,
    x: "Range matters more than precision in training. FP16's narrow exponent produces overflow, NaNs and the whole apparatus of dynamic loss scaling; BF16 avoids all of it.",
    note: "It is one of those trades where giving up precision to gain range was clearly correct in hindsight and took the field a while to adopt."
  },
  {
    tag: "Cost discipline",
    lvl: "hardcore",
    q: "You are about to rent a GPU for a full run. What should you do first?",
    o: [
      "Run the script end to end on a tiny model and 50 examples, then 100 steps on the real model",
      "Book the largest instance available, since the run only happens once",
      "Set the number of epochs high and stop it manually when it looks good",
      "Disable evaluation to save time"
    ],
    a: 0,
    x: "Every configuration bug is far cheaper to find on a free tier with a small model. The 100-step run on the real model then confirms memory and speed before you commit hours.",
    note: "Disabling evaluation is the actively harmful option here: it saves a few minutes and removes the only signal telling you whether to stop the run."
  }
]);

TD.addMCQ("finetune", "align", [
  {
    tag: "Order of stages",
    lvl: "core",
    q: "Where does preference tuning sit relative to supervised fine-tuning?",
    o: [
      "After it, on the same model — preference tuning refines a model that already follows instructions",
      "Before it, so supervised tuning can correct any damage",
      "Instead of it, when you have preference data",
      "In parallel, on two copies that are then merged"
    ],
    a: 0,
    x: "Supervised tuning teaches what a good answer looks like. Preference tuning then teaches which of two acceptable answers people prefer. It refines and cannot build.",
    note: "Running DPO on a model that cannot yet follow instructions has nothing to refine."
  },
  {
    tag: "Why DPO",
    lvl: "hardcore",
    q: "What does DPO remove compared with PPO-based RLHF?",
    o: [
      "The separate reward model, by substituting the closed-form optimal policy back into the objective",
      "The need for preference data",
      "The reference model, leaving only the policy",
      "The need for a supervised fine-tuning stage"
    ],
    a: 0,
    x: "The reward cancels out algebraically, leaving a classification loss on preference pairs. Two models in memory instead of four, and far more stable.",
    note: "DPO still needs the reference model — it is what constrains drift. And it still needs preference data and an SFT stage; those are the two things it does not remove."
  },
  {
    tag: "Unpaired feedback",
    lvl: "hardcore",
    q: "Your product collects thumbs up and thumbs down on individual answers, not comparisons. Which method fits?",
    o: [
      "KTO, which trains on unpaired binary feedback",
      "DPO, by randomly pairing a thumbs-up with a thumbs-down answer",
      "PPO, which requires no preference data",
      "None — preference tuning always requires pairs to the same prompt"
    ],
    a: 0,
    x: "KTO is designed for exactly this signal, which is what real products actually produce.",
    note: "Randomly pairing unrelated answers is the tempting shortcut and it is wrong: DPO's pairs must be two responses **to the same prompt**, or the comparison carries no information about that prompt."
  },
  {
    tag: "Learning rate",
    lvl: "hardcore",
    q: "You reuse your SFT learning rate of 2e-4 for a DPO run. What is the likely outcome?",
    o: [
      "The model degenerates — terse, evasive or repetitive output",
      "The model converges faster with no downside",
      "The run fails immediately with a divergence error",
      "Nothing, because DPO normalises the learning rate internally"
    ],
    a: 0,
    x: "DPO is a refinement step and wants roughly 5e-6. An SFT-scale rate pushes the policy far from the reference and quality collapses.",
    note: "This is the most common DPO mistake, and the loss curve does not look alarming while it happens."
  },
  {
    tag: "Reading DPO metrics",
    lvl: "hardcore",
    q: "During DPO, `rewards/accuracies` is climbing nicely but `logps/chosen` is falling steeply. What does that mean?",
    o: [
      "The model is becoming less likely to produce the good answers too — a sign of degeneration",
      "Training is working exactly as intended",
      "The reference model has drifted and should be re-initialised",
      "The preference pairs are mislabelled"
    ],
    a: 0,
    x: "DPO's loss only cares about the *difference* between chosen and rejected. It can satisfy itself by suppressing the rejected answer heavily while also suppressing the chosen one.",
    note: "Raise beta, lower the learning rate, or switch to ORPO. Watching only `rewards/accuracies` makes this failure invisible until you read the outputs."
  },
  {
    tag: "Length exploitation",
    lvl: "hardcore",
    q: "After a few hundred DPO steps every answer is noticeably longer and more padded. What has happened?",
    o: [
      "Raters and judges mildly prefer longer answers, so DPO learned verbosity rather than quality",
      "The maximum length setting was raised accidentally",
      "Beta is too high, forcing the model to stay near a verbose reference",
      "The tokeniser is producing more tokens per word after tuning"
    ],
    a: 0,
    x: "Length bias is present in both human and LLM preference judgements, and DPO amplifies whatever bias is in the pairs.",
    note: "Track mean output length as a first-class metric during preference tuning. If it is climbing, you are training length, and SimPO or length-normalised pairs are the fix."
  },
  {
    tag: "Control pairs",
    lvl: "hardcore",
    q: "You build 300 preference pairs teaching the model to decline when the sources do not support an answer. Why also include pairs where declining is the *rejected* answer?",
    o: [
      "Without them the model learns that declining is generally preferred and starts refusing answerable questions",
      "To balance the dataset size across categories",
      "Because DPO requires an equal number of each label",
      "To prevent the reference model from drifting"
    ],
    a: 0,
    x: "Every preference set teaches a general rule as well as the specific one. Control pairs are how you constrain which rule is learned.",
    note: "In practice, a refusal-only preference set can take over-refusal from 4% to 30%+ — replacing one product problem with a worse one."
  }
]);

TD.addMCQ("finetune", "eval", [
  {
    tag: "Forgetting",
    lvl: "hardcore",
    q: "After tuning, MMLU is essentially unchanged but your users report the model is worse. What should you check?",
    o: [
      "Per-capability guards for the things your users actually rely on — reasoning, other languages, instruction following",
      "Whether MMLU was measured on the merged or unmerged model",
      "The training loss, which should have gone lower",
      "Whether the base model's MMLU score was contaminated"
    ],
    a: 0,
    x: "Aggregate benchmarks hide uneven damage. A model tuned on English extraction data can hold MMLU while losing five points of reasoning and six of non-English performance.",
    note: "Guard the capabilities your users depend on, not the ones that are easy to measure. If 30% of your traffic is Hindi and your guard is English-only, it is blind to the failure that will actually hurt you."
  },
  {
    tag: "Statistical care",
    lvl: "hardcore",
    q: "On a 400-example evaluation set your fine-tune scores 0.871 against a baseline of 0.862. What should you conclude?",
    o: [
      "Probably nothing — bootstrap a confidence interval, because a difference that size is usually noise at this sample size",
      "The fine-tune is better and should ship",
      "The evaluation set is biased towards the baseline",
      "The fine-tune is worse, since it did not clear a 5% threshold"
    ],
    a: 0,
    x: "Under roughly three points on 400 examples, the intervals will overlap almost entirely. A point estimate without an interval is not a result.",
    note: "Four lines of bootstrap code turn \"0.871 versus 0.862\" into \"the intervals overlap, so I cannot claim a difference\" — which is a much stronger thing to be able to say."
  },
  {
    tag: "Loss and usefulness",
    lvl: "hardcore",
    q: "Across a rank sweep, validation loss keeps falling as rank rises while your task metric plateaus and MMLU drops. Which rank should you ship?",
    o: [
      "The lowest rank at which the task metric plateaued",
      "The rank with the lowest validation loss",
      "The highest rank tested, since capacity cannot hurt",
      "The rank with the largest gap between train and validation loss"
    ],
    a: 0,
    x: "Validation loss measures fit to the training distribution, not usefulness. The task metric and the capability guard are what you are optimising.",
    note: "Choosing on loss is the trap because loss is the number the trainer prints most prominently. It is the wrong objective for the decision."
  },
  {
    tag: "The four comparisons",
    lvl: "intermediate",
    q: "Which comparison does a fine-tune report most often omit — and most need?",
    o: [
      "The base model prompted with few-shot examples",
      "The base model with a zero-shot prompt",
      "The tuned model at a different temperature",
      "A second training run with a different seed"
    ],
    a: 0,
    x: "It is the honest floor, and it is the one that most often shows the fine-tune bought very little.",
    note: "The full set worth reporting is: base zero-shot, base few-shot, a larger model few-shot, and your tuned model — all scored by the same function on the same held-out set."
  },
  {
    tag: "Negative results",
    lvl: "hardcore",
    q: "Your fine-tune reaches 0.87 against a few-shot baseline of 0.86. What is the strongest thing to do?",
    o: [
      "Report it as a negative result with a diagnosis and a recommendation not to ship",
      "Report 0.87 as a success without naming the baseline",
      "Train for more epochs until the gap widens",
      "Switch to a larger evaluation set until the difference becomes significant"
    ],
    a: 0,
    x: "One point for three weeks of work and a model to maintain is not a win, and saying so with a mechanism and a next step is a genuinely senior contribution.",
    note: "The last option is the subtle trap — enlarging the sample until a tiny difference clears significance is a real practice and it produces true statements that are not useful decisions."
  }
]);

TD.addMCQ("finetune", "serve", [
  {
    tag: "Merge or not",
    lvl: "intermediate",
    q: "You serve six per-customer variants of the same base model. Should you merge each adapter?",
    o: [
      "No — keep them as adapters so all six share one copy of the base weights in memory",
      "Yes — merged models are always faster and that dominates",
      "Yes — adapters cannot be served concurrently",
      "It makes no difference to memory either way"
    ],
    a: 0,
    x: "Six merged 8B models are six full weight copies. Six adapters against one base is one copy plus about a gigabyte, and swapping between them takes milliseconds.",
    note: "Merging is right when you serve one variant and want maximum throughput. The multi-adapter case is what made LoRA economically interesting in the first place."
  },
  {
    tag: "Quantised serving",
    lvl: "hardcore",
    q: "You quantise a merged fine-tune to 4-bit for serving. What happens to single-stream decode speed?",
    o: [
      "It roughly doubles, because decode is memory-bandwidth-bound and there are half as many bytes to read",
      "It halves, because dequantisation adds work per token",
      "It is unchanged, since quantisation only affects memory",
      "It becomes unpredictable and depends on batch size"
    ],
    a: 0,
    x: "Generating one token requires reading every weight. Fewer bytes to read means faster tokens, and it also frees memory for a larger KV cache, so concurrency rises too.",
    note: "This is one of the few optimisations that improves memory and speed simultaneously, and it is why weight-only quantisation is the default for LLM serving."
  },
  {
    tag: "Self-hosting economics",
    lvl: "hardcore",
    q: "You compute that a saturated GPU serves your workload at ₹0.07 per request against ₹0.05 from an API, and conclude self-hosting is nearly competitive. What is wrong with the comparison?",
    o: [
      "Real utilisation on a product with daily traffic cycles is 20–40%, so the true figure is two to three times higher",
      "API prices include tax and the GPU figure does not",
      "The GPU figure should exclude the cost of the instance when idle",
      "Nothing — the comparison is sound"
    ],
    a: 0,
    x: "An idle GPU at 3am costs exactly what a busy one does. Dividing by theoretical capacity rather than realistic utilisation flatters self-hosting by a factor of three.",
    note: "Self-hosting typically wins above roughly two to three million steady requests a month — or when the reason is not cost at all: residency, latency, or a model nobody hosts."
  },
  {
    tag: "Safe rollout",
    lvl: "intermediate",
    q: "What is the most valuable safety net when shipping a fine-tuned model that is strong on 90% of cases?",
    o: [
      "A fallback that routes schema failures and low-confidence outputs to the frontier model",
      "A higher temperature, so the model explores more on hard cases",
      "Retrying the same request three times",
      "Serving the base model alongside and averaging the outputs"
    ],
    a: 0,
    x: "The small model handles what it is good at, the expensive one catches the tail, and blended quality exceeds either alone.",
    note: "It also gives you a live measurement of exactly which cases the fine-tune cannot handle — which is your next training set."
  }
]);

TD.addMCQ("finetune", "embed", [
  {
    tag: "Diagnosis",
    lvl: "hardcore",
    q: "Your RAG system has recall@100 of 0.91 and recall@5 of 0.61. Where should you work?",
    o: [
      "Ranking — the right chunk is being found and mis-ranked, so a reranker is where the return is",
      "Retrieval — recall@5 is low, so the retriever is failing",
      "Chunking — the chunks must be too large",
      "The generator — it is ignoring the chunks it receives"
    ],
    a: 0,
    x: "High recall@100 means the retriever finds the right passage; low recall@5 means it does not rank it into the context. That is precisely what a cross-encoder reranker fixes.",
    note: "The reverse pattern — low recall@100 — means no reranker can help, because the passage never entered the candidate set. Ten minutes of measurement decides which week of work is worth doing."
  },
  {
    tag: "Which to train",
    lvl: "hardcore",
    q: "Why train a reranker before training an embedding model?",
    o: [
      "A new reranker requires no re-indexing, whereas a new embedding model means re-embedding the entire corpus",
      "Rerankers are more accurate than embedding models at every scale",
      "Embedding models cannot be fine-tuned on small datasets",
      "Rerankers do not need negative examples"
    ],
    a: 0,
    x: "Deploying a reranker is deploying a model. Deploying a new embedding model is a full backfill, a dual index and a shadow-read rollout — weeks, plus a permanent operational pattern.",
    note: "The two embedding spaces are incomparable, so there is no partial migration. That asymmetry, not accuracy, is what decides the order."
  },
  {
    tag: "Hard negatives",
    lvl: "hardcore",
    q: "You mine hard negatives by taking the top 10 results your retriever returns for each training query. What goes wrong?",
    o: [
      "Many of those are correct passages you simply have not labelled, so you train the model that right answers are wrong",
      "The top 10 are too easy to be useful negatives",
      "The retriever's ranking is not stable enough to mine from",
      "Ten negatives per query is too many for contrastive training"
    ],
    a: 0,
    x: "The highest-ranked candidates are disproportionately relevant. Taking them as negatives is actively harmful in a way the loss curve will not reveal.",
    note: "Mine from roughly ranks 10–50 and filter each candidate with a cross-encoder or a model check first. On a real corpus that filter typically removes 15–20% of mined negatives as false — and skipping it is the commonest way a retriever fine-tune fails."
  },
  {
    tag: "Batch size",
    lvl: "intermediate",
    q: "Why does contrastive training of embedding models want a large batch size?",
    o: [
      "Every other item in the batch acts as a negative, so batch size is the number of free negatives per step",
      "Large batches reduce gradient noise, which matters more here than elsewhere",
      "Embedding models need more data per step to converge",
      "Small batches cause the temperature parameter to become unstable"
    ],
    a: 0,
    x: "In-batch negatives are the cheap half of the training signal, and there are exactly as many of them as the batch is large.",
    note: "They are also easy negatives, which is why explicitly mined hard negatives still matter — the two do different jobs."
  },
  {
    tag: "Distillation",
    lvl: "hardcore",
    q: "You distil a frontier model into a small one by logging 20,000 of its outputs on real inputs. What is the essential step before training?",
    o: [
      "Verify each output — schema, arithmetic, execution or entailment — and discard what fails",
      "Increase the teacher's temperature so the outputs are more diverse",
      "Paraphrase each output so the student does not memorise",
      "Balance the dataset so every output length is equally represented"
    ],
    a: 0,
    x: "Unverified distillation copies the teacher's mistakes and pays for the privilege. Expect to lose 40–50% of attempts to verification and deduplication, and budget for it.",
    note: "Use real production inputs, not synthetic ones — a model trained on synthetic inputs is good at synthetic inputs. And check the provider's terms; some prohibit training competing models on their outputs."
  },
  {
    tag: "Order of work",
    lvl: "hardcore",
    q: "Retrieval quality is poor. Which should you try first?",
    o: [
      "Add BM25 and fuse with reciprocal rank fusion",
      "Fine-tune the embedding model on your corpus",
      "Switch to a larger generator model",
      "Increase the number of chunks passed to the model from 5 to 20"
    ],
    a: 0,
    x: "Dense retrieval fails on exact tokens — product codes, error strings, rare acronyms. Adding the keyword half is an afternoon's work and is frequently the single largest improvement available.",
    note: "Passing more chunks is the actively harmful option: it costs money, adds latency and dilutes the model's attention, and it usually makes answers worse rather than better."
  }
]);
