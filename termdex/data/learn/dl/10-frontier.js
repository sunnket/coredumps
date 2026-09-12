/* Deep Learning — beyond supervised learning.

   Three ideas that sit behind most modern systems and are almost never taught
   together: learning without labels, learning from a reward, and making a
   model bigger without making it slower.

   Each is here because it turns up in AI-engineering interviews and in real
   architectures, not because it completes a taxonomy. */

TD.addLessons("dl", [

/* ==================================================================== */
{
 t: "Self-Supervised and Contrastive Learning",
 m: "frontier",
 lvl: "advanced",
 s: "Manufacture the labels from the data itself — the idea that made foundation models possible.",
 goal: [
  "Explain what a pretext task is and why it works",
  "Write the InfoNCE loss and say what the temperature controls",
  "Say why CLIP made text-to-image generation possible"
 ],
 b: [
  { p: "Labelled data is the expensive part of machine learning. Self-supervised learning sidesteps it entirely by inventing a task whose answer is already contained in the data — so an unlimited pile of unlabelled text or images becomes a training set." },

  { p: "You have already met one: next-token prediction. The label for every position is simply the next word, which the text supplies for free. That single trick is why language models could be trained on the internet, and it is the same idea in every case below." },

  { h: "Pretext tasks" },
  { tbl: { t: "Invented tasks whose answers are free",
    h: ["Task", "The manufactured label", "What it forces the model to learn"],
    rows: [
     ["Next token", "The following word", "Grammar, facts, reasoning — everything"],
     ["Masked token", "The word you hid", "Bidirectional context (this is BERT)"],
     ["Rotation", "The angle you rotated by", "What upright looks like, so: object structure"],
     ["Jigsaw", "The original patch order", "Spatial relationships within an object"],
     ["Colourisation", "The colours you removed", "That grass is green and skin is not"],
     ["Contrastive", "Which two views came from the same image", "A representation robust to how a thing is photographed"]
    ] } },

  { h: "Contrastive learning, and the loss you should know" },
  { p: "The strongest of these: take one image, make two different augmented views of it, and train so those two land close together in embedding space while everything else in the batch is pushed away. There is no label at all — the supervision is *which two crops came from the same original*." },

  { code: { lang: "python", file: "contrastive.py", t: "InfoNCE — cross-entropy over similarities",
    lines: [
     { c: "z1 = F.normalize(encoder(view1), dim=1)", w: "Normalise to unit length, so a dot product **is** cosine similarity and magnitude cannot distort the comparison.", hi: true },
     { c: "z2 = F.normalize(encoder(view2), dim=1)", w: "The same encoder, a different augmentation of the same images." },
     { c: "", w: "" },
     { c: "sim = z1 @ z2.T / temperature", w: "Every pair in the batch, scored. The diagonal is the matching pairs; everything off-diagonal is a negative.", hi: true },
     { c: "labels = torch.arange(len(z1))", w: "Row *i* should match column *i* — the label is just the position, which is what makes this self-supervised." },
     { c: "loss = F.cross_entropy(sim, labels)", w: "**The whole loss.** Contrastive learning reduces to a classification problem where the classes are the other items in the batch." }
    ],
    after: "Batch size matters enormously here: every other example in the batch is a negative, so a larger batch gives a harder, more informative task. This is why the contrastive papers all trained with batches in the thousands." } },

  { n: "`temperature` sharpens the distribution. Low (0.05) makes the loss focus hard on the most confusing negatives and learn fine distinctions; high (0.5) treats all negatives more equally and learns coarser structure. It is the main knob in these methods, and 0.07 is the value most papers land on.",
    nt: "What temperature does" },

  { h: "CLIP: contrastive learning across two modalities" },
  { p: "The same loss, but the two views are an **image** and its **caption**, encoded by two different networks into one shared space. Train on 400 million image-text pairs scraped from the web and you get a space where a photo of a dog and the words *a photo of a dog* land in the same place." },

  { l: [
   "**Zero-shot classification.** Embed the candidate labels as sentences, embed the image, pick the nearest. No training on your classes at all.",
   "**Text-to-image generation.** This is the load-bearing one: Stable Diffusion is conditioned on CLIP text embeddings. Without a shared image-text space there is nothing for the prompt to steer.",
   "**Semantic image search.** Search a photo library with a sentence.",
   "**Evaluating generated images** — CLIP score measures whether an output matches its prompt."
  ] },

  { trap: "Contrastive learning lives or dies on augmentation choice, and the failure is silent. If your augmentations preserve something trivially predictable — say, colour — the model will use that shortcut and learn nothing about shape. This is why SimCLR's ablations found colour jitter essential: without it, the model just matched crops by average colour and scored beautifully while learning nothing." },

  { tryit: { t: "Choose the augmentations",
    task: "You are building a contrastive model for medical X-rays. Standard image augmentation includes random horizontal flip, colour jitter, and random crop. Which of these would you keep, and which is actively harmful here?",
    hint: "Ask what information in an X-ray is diagnostic, and whether the augmentation destroys it.",
    sol: { lang: "python", code: "# Horizontal flip -- HARMFUL. Anatomy is not symmetric: the heart\n# sits left, the liver right. Flipping teaches the model that\n# situs inversus is the same as normal, which is a condition it\n# should be able to detect.\n\n# Colour jitter -- mostly meaningless. X-rays are single-channel;\n# aggressive intensity shifts can destroy the density information\n# that IS the diagnosis. Mild intensity/contrast only.\n\n# Random crop -- KEEP, but bounded. Useful for robustness to\n# framing, harmful if it crops out the pathology entirely.\n\ntransform = T.Compose([\n    T.RandomResizedCrop(224, scale=(0.7, 1.0)),   # bounded\n    T.RandomRotation(10),                          # small only\n    T.ColorJitter(brightness=0.2, contrast=0.2),   # mild\n    # NO horizontal flip\n])" },
    w: "The general rule: an augmentation must preserve everything the downstream task cares about. Copying a default transform list from a natural-image tutorial into a medical or scientific domain is one of the most common quiet mistakes in applied deep learning." } }
 ],
 k: [
  "Self-supervision manufactures labels from the data — next-token prediction is the famous case.",
  "Contrastive learning pulls two views of one thing together and pushes everything else apart.",
  "InfoNCE is cross-entropy over a similarity matrix; the batch supplies the negatives.",
  "Temperature controls how hard the loss focuses on confusing negatives; ~0.07 is standard.",
  "CLIP's shared image-text space is what lets a text prompt steer image generation."
 ],
 r: ["Self-Supervised Learning", "Contrastive Learning", "CLIP", "Embedding"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "z1 = F.normalize(encoder(view1), dim=1)", w: "unit-normalise so dot product is cosine" },
   { c: "sim = z1 @ z2.T / temperature", w: "score every pair in the batch" },
   { c: "labels = torch.arange(len(z1))", w: "the label is the position — self-supervised" },
   { c: "loss = F.cross_entropy(sim, labels)", w: "the InfoNCE loss" },
   { c: "T.ColorJitter(brightness=0.2, contrast=0.2),", w: "a mild intensity augmentation" }
  ]
 }
},

/* ==================================================================== */
{
 t: "Reinforcement Learning and RLHF",
 m: "frontier",
 lvl: "advanced",
 s: "Learning from a reward rather than an answer — and how it turned a text predictor into an assistant.",
 goal: [
  "Name the five parts of an RL problem and give an example of each",
  "Explain the exploration-exploitation trade-off in one sentence",
  "Describe the three stages of RLHF and what each one contributes"
 ],
 b: [
  { p: "Supervised learning needs the right answer for every input. Reinforcement learning needs only a **score** for whatever you did — which is the only feedback available for most interesting problems. Nobody can write down the correct move in chess, but anyone can tell you whether you won." },

  { h: "The five parts" },
  { ol: [
   "**Agent** — the thing making decisions. Your model.",
   "**Environment** — everything else. The game, the market, the conversation.",
   "**State** — what the agent can see right now.",
   "**Action** — what it can do.",
   "**Reward** — a number saying how that went. This is the whole supervision signal."
  ] },
  { p: "The agent's goal is not to maximise the next reward but the **total reward over time**, which is what makes RL hard. A move that looks bad now may win the game in twenty turns, and the algorithm has to assign credit backwards across that gap." },

  { ana: "Training a dog with treats rather than a manual. You never explain *sit* — you reward the behaviour when it happens, and the dog works out the mapping. The hard part is the same as in RL: if the treat arrives ten seconds late, which of the last ten actions earned it?",
    at: "Credit assignment" },

  { h: "Exploration versus exploitation" },
  { p: "The permanent tension: do the thing you already know works, or try something new that might work better? Exploit only, and you lock in the first decent strategy you found. Explore only, and you never capitalise on anything. Every RL algorithm is partly an answer to this." },

  { code: { lang: "python", t: "Epsilon-greedy — the simplest answer, and a real one",
    lines: [
     { c: "def act(state, epsilon):", w: "" },
     { c: "    if random.random() < epsilon:", w: "" },
     { c: "        return env.sample_action()", w: "**Explore.** A random action, to discover what you have not tried." },
     { c: "    return q_network(state).argmax()", w: "**Exploit.** The action the model currently rates highest." },
     { c: "", w: "" },
     { c: "epsilon = max(0.05, 1.0 - episode / 500)", w: "Decay it: explore heavily at first when you know nothing, then mostly exploit. Never quite to zero — the environment may change.", hi: true }
    ] } },

  { h: "RLHF: how a text predictor became an assistant" },
  { p: "A pretrained language model predicts likely text. It does not want to be helpful, and *helpful* is not something you can write a loss function for. But humans can compare two answers and say which is better — and that comparison is a reward signal." },

  { dg: "finetune" },

  { ol: [
   "**Supervised fine-tuning (SFT).** Humans write good answers to prompts; the model is fine-tuned on them normally. This teaches the *format* of being an assistant — answering rather than continuing.",
   "**Reward model.** Humans rank several model answers best-to-worst. A separate model is trained to predict those rankings — turning a fuzzy human preference into a number a machine can optimise.",
   "**RL fine-tuning (PPO).** The language model now generates, the reward model scores, and the policy updates to score higher — with a KL penalty that stops it drifting too far from the SFT model."
  ] },

  { code: { lang: "python", t: "The reward model's loss is a comparison, not a score",
    lines: [
     { c: "r_chosen = reward_model(prompt, chosen)", w: "The answer a human preferred." },
     { c: "r_rejected = reward_model(prompt, rejected)", w: "The one they did not." },
     { c: "", w: "" },
     { c: "loss = -F.logsigmoid(r_chosen - r_rejected).mean()", w: "**Only the difference matters.** Nobody can put an absolute score on an answer, but anyone can pick the better of two — so the loss is built entirely from pairwise comparisons.", hi: true }
    ] } },

  { code: { lang: "python", t: "And why the KL penalty is not optional",
    lines: [
     { c: "reward = reward_model(prompt, response)", w: "" },
     { c: "kl = kl_divergence(policy_logprobs, sft_logprobs)", w: "How far the model has drifted from where it started." },
     { c: "objective = reward - beta * kl", w: "**Reward hacking is the failure this prevents.** Without it the policy finds text that scores highly on the reward model but is degenerate — repeating flattering phrases, or emitting something that is not language at all.", hi: true }
    ],
    after: "This is Goodhart's law in a loop: the reward model is a *proxy* for human preference, and any proxy optimised hard enough stops tracking the thing it proxies for. The KL term is the leash." } },

  { n: "**DPO** (Direct Preference Optimisation) skips stages 2 and 3 entirely: it trains directly on preference pairs with a classification-style loss, no separate reward model and no RL loop. It is far simpler, far more stable, and now the default for most open fine-tuning work. Know RLHF because it is what interviewers ask about and what the papers describe; reach for DPO in practice.",
    nt: "What you would actually use today" },

  { tryit: { t: "Design the reward",
    task: "You are using RL to train an agent that summarises documents. Your reward is the ROUGE score against a human summary. Name two ways the agent will exploit this reward rather than summarising well.",
    hint: "ROUGE largely counts overlapping n-grams. What maximises overlap without being a good summary?",
    sol: { lang: "python", code: "# 1. Length gaming. ROUGE recall rises as you include more text,\n#    so the agent learns to output near the length limit and\n#    copy large spans verbatim. It scores well and summarises\n#    nothing.\n\n# 2. Extractive copying. Lifting the document's opening sentences\n#    usually overlaps heavily with a human summary, so the agent\n#    learns to copy rather than compress or paraphrase.\n\n# Mitigations -- all of them are 'stop optimising one number':\nreward = (\n    0.5 * rouge\n    + 0.3 * reward_model(doc, summary)   # learned human preference\n    - 0.2 * length_penalty(summary)      # explicit cost for padding\n)\n# plus the KL leash to the SFT model, as always." },
    w: "The general law: **any single metric optimised by a capable agent will be gamed.** This applies well beyond RL — it is the same reason a team measured only on ticket count closes tickets rather than solving problems." } }
 ],
 k: [
  "RL learns from a reward rather than a correct answer: agent, environment, state, action, reward.",
  "The hard part is credit assignment — which of many past actions earned a delayed reward.",
  "Exploration versus exploitation is the permanent trade-off; epsilon-greedy is the simplest answer.",
  "RLHF is three stages: supervised fine-tune, reward model from rankings, then RL against it.",
  "The KL penalty stops reward hacking. DPO now replaces the whole RL stage in practice."
 ],
 r: ["Reinforcement Learning", "RLHF", "Fine-Tuning"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "return q_network(state).argmax()", w: "exploit: take the best-rated action" },
   { c: "epsilon = max(0.05, 1.0 - episode / 500)", w: "decay exploration over time" },
   { c: "loss = -F.logsigmoid(r_chosen - r_rejected).mean()", w: "train a reward model from preference pairs" },
   { c: "objective = reward - beta * kl", w: "reward, leashed to the starting model" },
   { c: "kl = kl_divergence(policy_logprobs, sft_logprobs)", w: "measure drift from the SFT model" }
  ]
 }
},

/* ==================================================================== */
{
 t: "Mixture of Experts and Modern Scaling",
 m: "frontier",
 lvl: "advanced",
 s: "How a model gets ten times bigger without getting ten times slower — the architecture behind most frontier models.",
 goal: [
  "Explain the difference between total and active parameters",
  "Say what the router does and why load balancing needs its own loss",
  "Name what MoE costs you, since it is not free"
 ],
 b: [
  { p: "In a dense model every parameter participates in every token. Double the parameters and you double the compute per token. **Mixture of Experts** breaks that link: the model holds many parameters but uses only a fraction of them for any given token." },

  { h: "The architecture" },
  { p: "Replace the feed-forward block in each transformer layer with *N* parallel copies — the experts — plus a small **router** that picks which two or so to use for each token. The attention layers stay shared and dense." },

  { code: { lang: "python", file: "moe.py", t: "The router is a linear layer and a top-k",
    lines: [
     { c: "class MoELayer(nn.Module):", w: "" },
     { c: "    def __init__(self, dim, n_experts=8, k=2):", w: "`k` is how many experts each token uses — almost always 1 or 2." },
     { c: "        self.experts = nn.ModuleList([FFN(dim) for _ in range(n_experts)])", w: "Eight full feed-forward networks where a dense model has one." },
     { c: "        self.router = nn.Linear(dim, n_experts)", w: "**The router.** One tiny linear layer that scores each expert for this token." },
     { c: "", w: "" },
     { c: "    def forward(self, x):", w: "" },
     { c: "        scores = self.router(x).softmax(dim=-1)", w: "A probability per expert." },
     { c: "        weight, idx = scores.topk(self.k, dim=-1)", w: "**Keep only the top k.** Every other expert is skipped entirely — no compute spent on them at all. This is where the saving comes from.", hi: true },
     { c: "        weight = weight / weight.sum(dim=-1, keepdim=True)", w: "Renormalise over the chosen few, so the weights still sum to one." },
     { c: "", w: "" },
     { c: "        out = torch.zeros_like(x)", w: "" },
     { c: "        for i, expert in enumerate(self.experts):", w: "" },
     { c: "            mask = (idx == i).any(dim=-1)", w: "Which tokens routed here." },
     { c: "            if mask.any():", w: "" },
     { c: "                out[mask] += expert(x[mask]) * weight_for(i, mask)", w: "Each expert sees only its own tokens." },
     { c: "        return out", w: "" }
    ] } },

  { tbl: { t: "Total versus active parameters",
    h: ["Model", "Total", "Active per token", "Costs like"],
    rows: [
     ["Dense 7B", "7B", "7B", "a 7B model"],
     ["MoE 8x7B", "~47B", "~13B", "a 13B model, knows like a much larger one"],
     ["Dense 70B", "70B", "70B", "a 70B model"]
    ] } },
  { p: "That middle row is the entire pitch: the capacity of a very large model at the inference cost of a middling one. Most frontier models are now built this way — and it is why a model's parameter count alone tells you much less than it used to." },

  { h: "The problem that needs its own loss" },
  { trap: "Routers collapse. Left alone, the router finds two experts that work adequately and sends nearly everything to them — the other six receive almost no gradient, never improve, and you have paid for eight experts to get two. This is not a rare edge case; it is the default behaviour without a countermeasure." },

  { code: { lang: "python", t: "The auxiliary loss that keeps experts busy",
    lines: [
     { c: "frac_tokens = mask.float().mean(dim=0)", w: "What fraction of tokens each expert actually received." },
     { c: "frac_prob = scores.mean(dim=0)", w: "The average routing probability each expert was assigned." },
     { c: "aux_loss = n_experts * (frac_tokens * frac_prob).sum()", w: "Minimised when both are uniform. It penalises exactly the imbalance that causes collapse.", hi: true },
     { c: "", w: "" },
     { c: "loss = task_loss + 0.01 * aux_loss", w: "A small weight. Too large and the router balances at the expense of routing *well* — sending tokens to the wrong expert just to keep the counts even.", hi: true }
    ] } },

  { h: "What it costs" },
  { l: [
   "**Memory.** Every expert must be resident even though most are idle for any given token. An 8x7B model needs the VRAM of a 47B model — you save compute, not memory.",
   "**Communication.** Experts are usually spread across GPUs, so tokens travel between devices. On a slow interconnect this can erase the speed advantage entirely.",
   "**Training instability.** Router decisions are discrete, and small changes flip tokens between experts, which makes the loss noisier than a dense model's.",
   "**Fine-tuning difficulty.** MoE models are noticeably more delicate to fine-tune than dense ones of equivalent quality."
  ] },

  { n: "The interview-ready summary: MoE trades **memory and complexity** for **compute**. Choose it when you are compute-bound and have VRAM to spare, which describes large-scale serving. For a single-GPU deployment, a dense model of the same active size is usually the better answer.",
    nt: "When it is the right call" },

  { tryit: { t: "Read the symptom",
    task: "You train an 8-expert MoE. Loss falls, but slightly worse than a dense baseline with the same *active* parameter count — and inference is no faster. Logging shows experts 3 and 6 handle 78% of all tokens. Diagnose it.",
    hint: "Two separate things are wrong, and one of them explains why there is no speed-up.",
    sol: { lang: "python", code: "# 1. Router collapse. 78% to two of eight experts means the other\n#    six are barely trained -- you have an expensive 2-expert\n#    model. The auxiliary loss is missing or weighted too low.\n\naux_weight = 0.01          # from 0.001, or from absent\n\n# Confirm it is working by logging the distribution, not the loss:\nprint(frac_tokens)         # want ~0.125 each for 8 experts\n\n# 2. No speed-up: the two hot experts are almost certainly on the\n#    same device, so every token is routed across the interconnect\n#    and the transfer dominates. Balanced routing fixes the\n#    imbalance; expert placement fixes the transfers.\n\n# The general lesson: an average metric (loss) cannot show you a\n# distribution problem. Log the distribution." },
    w: "Same lesson as the collapsed VAE two lessons ago, in different clothing: the aggregate number was healthy while the thing underneath it was badly wrong. Log distributions, not just averages." } }
 ],
 k: [
  "MoE replaces one feed-forward block with many, and a router picks a few per token.",
  "Total parameters buy capacity; active parameters set the compute cost.",
  "Routers collapse onto a few experts without an auxiliary load-balancing loss.",
  "You save compute, never memory — every expert stays resident.",
  "Log the routing distribution, not just the loss; an average cannot show imbalance."
 ],
 r: ["Mixture of Experts", "Transformer", "Scaling Laws", "Inference"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "self.router = nn.Linear(dim, n_experts)", w: "the layer that scores experts per token" },
   { c: "weight, idx = scores.topk(self.k, dim=-1)", w: "keep only the top-k experts" },
   { c: "aux_loss = n_experts * (frac_tokens * frac_prob).sum()", w: "the load-balancing loss" },
   { c: "loss = task_loss + 0.01 * aux_loss", w: "add balancing at a small weight" },
   { c: "print(frac_tokens)", w: "log the routing distribution, not just the loss" }
  ]
 }
}

]);
