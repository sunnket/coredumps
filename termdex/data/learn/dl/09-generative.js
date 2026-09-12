/* Deep Learning — generative models.

   The track jumped from CNNs to transformers and never explained how a model
   learns to *produce* data rather than label it. This module is that gap:
   autoencoders, VAEs, GANs and diffusion, in the order the field actually
   discovered them, because each one exists to fix a specific failure of the
   one before it.

   House rule for this file: the maths appears only where it changes what you
   would type. Every loss is written as code you could run, because "minimise
   the ELBO" means nothing until you see which two numbers get added together. */

TD.addLessons("dl", [

/* ==================================================================== */
{
 t: "Autoencoders: Learning to Compress",
 m: "gen",
 lvl: "intermediate",
 s: "The simplest generative architecture — and the bottleneck that forces a model to understand its data.",
 goal: [
  "Explain what the bottleneck layer forces the network to learn",
  "Write an autoencoder and say what its loss is measuring",
  "Say why a plain autoencoder cannot generate anything new"
 ],
 b: [
  { p: "Every model so far has taken data and produced a **label**. A generative model runs the other way: it learns the structure of the data well enough to produce more of it. The autoencoder is the smallest possible version of that idea, and everything in this module is a repair to something it gets wrong." },

  { h: "The architecture is a shape, not a trick" },
  { p: "An autoencoder is two networks facing each other. The **encoder** squeezes an input down to a small vector; the **decoder** expands that vector back to the original size. The whole thing is trained to output what it was given." },

  { ana: "Imagine being asked to describe a photograph in twelve words, to someone who must then redraw it. Twelve words cannot hold the pixels, so you are forced to describe what *matters* — a bearded man in a red coat, facing left. The bottleneck does the same thing to a network: too small to memorise, so it must learn structure.",
    at: "Twelve words for a photograph" },

  { p: "That sounds useless — a network trained to copy its input could just pass it straight through. The bottleneck is what stops it. If the middle layer is 32 numbers and the input is 784 pixels, the information *cannot* fit, so the network is forced to discard everything except the patterns that let it reconstruct." },

  { code: { lang: "python", file: "autoencoder.py", t: "The whole architecture",
    lines: [
     { c: "class AutoEncoder(nn.Module):", w: "" },
     { c: "    def __init__(self, dim=784, latent=32):", w: "`latent` is the bottleneck width — the single most important hyperparameter here." },
     { c: "        super().__init__()", w: "" },
     { c: "        self.encoder = nn.Sequential(", w: "**Down.** 784 to 32." },
     { c: "            nn.Linear(dim, 128), nn.ReLU(),", w: "" },
     { c: "            nn.Linear(128, latent),", w: "No activation on the final encoder layer — the latent vector should be free to take any value.", hi: true },
     { c: "        )", w: "" },
     { c: "        self.decoder = nn.Sequential(", w: "**Up.** 32 back to 784, mirroring the encoder." },
     { c: "            nn.Linear(latent, 128), nn.ReLU(),", w: "" },
     { c: "            nn.Linear(128, dim), nn.Sigmoid(),", w: "`Sigmoid` because pixel values live in [0, 1]. Match the final activation to the range of your data — this is where people quietly go wrong." },
     { c: "        )", w: "" },
     { c: "", w: "" },
     { c: "    def forward(self, x):", w: "" },
     { c: "        z = self.encoder(x)", w: "`z` is the **latent code** — the compressed representation. This is the thing you actually want." },
     { c: "        return self.decoder(z), z", w: "Return both: the reconstruction for the loss, the code for everything else." }
    ] } },

  { code: { lang: "python", t: "The loss is one line, and it is just 'how different'",
    lines: [
     { c: "recon, z = model(x)", w: "" },
     { c: "loss = F.mse_loss(recon, x)", w: "**Reconstruction loss.** Compare the output to the input — the target *is* the input, which is why this needs no labels at all.", hi: true },
     { c: "loss.backward()", w: "" }
    ],
    after: "No labels anywhere. That makes an autoencoder **self-supervised**: the supervision signal is manufactured from the data itself. It is why you can train one on any pile of unlabelled images you happen to have." } },

  { h: "What they are actually used for" },
  { l: [
   "**Dimensionality reduction** — like PCA, but non-linear, so it captures curved structure PCA cannot.",
   "**Anomaly detection** — train on normal data only; anything that reconstructs badly is unusual. This is a genuinely common production use.",
   "**Denoising** — feed a corrupted input, ask for the clean original. The network learns what the signal is, as distinct from the noise.",
   "**Pretraining** — learn a representation from unlabelled data, then fine-tune the encoder on your small labelled set."
  ] },

  { code: { lang: "python", t: "Anomaly detection, the whole method",
    lines: [
     { c: "model.eval()", w: "" },
     { c: "with torch.no_grad():", w: "" },
     { c: "    recon, _ = model(x)", w: "" },
     { c: "    error = ((recon - x) ** 2).mean(dim=1)", w: "Per-sample reconstruction error — `dim=1` keeps one number per example rather than collapsing the batch." },
     { c: "", w: "" },
     { c: "threshold = train_errors.quantile(0.99)", w: "Set the threshold from the *training* distribution, not by guessing. The 99th percentile means you accept a 1% false-positive rate.", hi: true },
     { c: "anomalies = error > threshold", w: "Trained only on normal data, so anything it reconstructs badly is something it has never seen." }
    ] } },

  { h: "The failure that motivates everything else" },
  { trap: "A plain autoencoder **cannot generate new data**, and this is the whole reason VAEs exist. The latent space it learns has holes: training data maps to scattered points, and the space between them means nothing. Pick a random `z` and decode it and you get noise, because nothing ever forced the region around a valid code to also be valid. The encoder learned a lookup table, not a space." },

  { p: "So the autoencoder gives you compression and detection, but not generation. The next lesson fixes exactly that — by forcing the latent space to be continuous rather than scattered." },

  { tryit: { t: "Predict the effect of the bottleneck",
    task: "You train the autoencoder above with `latent=784` — the same size as the input. What does it learn, and what is the reconstruction loss? Then say what happens at `latent=2`.",
    hint: "Ask what the network *could* do if the bottleneck imposes no constraint at all.",
    sol: { lang: "python", code: "# latent = 784 (no bottleneck)\n#   The network can learn the identity function: copy input to\n#   output through the middle. Reconstruction loss goes to ~0, and\n#   the model has learned NOTHING about the structure of the data.\n#   A perfect score that is completely worthless.\n\n# latent = 2\n#   Far too little capacity. Reconstructions are blurry averages --\n#   digits become smudges. But those 2 numbers ARE plottable, and\n#   this is exactly how autoencoders get used for visualisation.\n\n# The bottleneck is the entire method. Too wide and it memorises;\n# too narrow and it cannot represent. Tuning it IS the modelling." },
    w: "This is the general shape of every generative model's central trade-off: capacity against the constraint that forces learning. Recognising it here makes VAEs and diffusion far easier to read." } }
 ],
 k: [
  "An autoencoder squeezes input through a bottleneck and reconstructs it.",
  "The bottleneck is the method: too small to memorise, so it must learn structure.",
  "The target is the input, so it needs no labels — this is self-supervised learning.",
  "Reconstruction error on a model trained only on normal data is anomaly detection.",
  "It cannot generate: the latent space has holes, and a random `z` decodes to noise."
 ],
 r: ["Autoencoder", "Dimensionality Reduction", "Anomaly Detection", "Self-Supervised Learning"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "self.encoder = nn.Sequential(", w: "start the down-projection half" },
   { c: "loss = F.mse_loss(recon, x)", w: "the reconstruction loss — target is the input itself" },
   { c: "error = ((recon - x) ** 2).mean(dim=1)", w: "per-sample reconstruction error" },
   { c: "threshold = train_errors.quantile(0.99)", w: "set an anomaly threshold from the training distribution" },
   { c: "nn.Linear(latent, 128), nn.ReLU(),", w: "the first layer back up from the bottleneck" }
  ]
 }
},

/* ==================================================================== */
{
 t: "Variational Autoencoders: A Latent Space With No Holes",
 m: "gen",
 lvl: "advanced",
 s: "Encode a distribution instead of a point — and the two-term loss that makes generation possible.",
 goal: [
  "Say why encoding a distribution fixes the hole problem",
  "Name both terms of the VAE loss and what each one pulls towards",
  "Explain the reparameterisation trick in terms of where the gradient flows"
 ],
 b: [
  { p: "A VAE changes one thing about the autoencoder and gets generation in return. Instead of encoding an input to a **point**, it encodes to a **distribution** — a mean and a variance. That single change forces the latent space to be continuous, which is exactly what the plain autoencoder lacked." },

  { h: "Why a distribution fixes it" },
  { p: "If an input maps to a *region* rather than a dot, then every point in that region has to decode to something sensible — because during training, points are sampled from it at random and the decoder is penalised for getting them wrong. Do that for every training example and the regions overlap and tile the space. Now a random `z` lands somewhere meaningful." },

  { ana: "A plain autoencoder files each photo at an exact address. A VAE files each photo in a *neighbourhood*, and insists every house in that neighbourhood looks roughly like the photo. Do that for a million photos and there are no empty lots left — every address you pick has a house on it.",
    at: "Addresses versus neighbourhoods" },

  { code: { lang: "python", file: "vae.py", t: "Two heads instead of one",
    lines: [
     { c: "self.fc_mu = nn.Linear(128, latent)", w: "**The mean** of the distribution for this input." },
     { c: "self.fc_logvar = nn.Linear(128, latent)", w: "**The log-variance.** Log, not variance, so the network can output any real number and `exp` makes it positive — a variance can never be negative, and this is how you enforce that without a constraint.", hi: true },
     { c: "", w: "" },
     { c: "def encode(self, x):", w: "" },
     { c: "    h = self.shared(x)", w: "" },
     { c: "    return self.fc_mu(h), self.fc_logvar(h)", w: "One input, two vectors out. Together they describe a Gaussian per dimension." }
    ] } },

  { h: "The reparameterisation trick" },
  { p: "There is a problem: you need to *sample* from that distribution, and sampling is random — you cannot backpropagate through a random draw. The fix is to move the randomness out of the path the gradient travels." },

  { code: { lang: "python", t: "The one trick that makes the whole thing trainable",
    lines: [
     { c: "def reparameterise(mu, logvar):", w: "" },
     { c: "    std = torch.exp(0.5 * logvar)", w: "Log-variance to standard deviation. The 0.5 is because variance is sigma squared, so half the log gives the log of sigma." },
     { c: "    eps = torch.randn_like(std)", w: "**All the randomness lives here** — and `eps` has no parameters, so no gradient needs to pass through it.", hi: true },
     { c: "    return mu + eps * std", w: "The sample. Gradients flow cleanly back through `mu` and `std`, because from the gradient's point of view `eps` is just a constant that happened to be drawn.", hi: true }
    ],
    after: "This is the whole of the reparameterisation trick, and it is worth being able to say out loud: sampling is not differentiable, so you sample a fixed noise vector and *scale* it by the learned parameters instead. The randomness is still there; it is simply no longer in the gradient's way." } },

  { h: "The loss has exactly two terms, and they fight" },
  { code: { lang: "python", t: "Reconstruction pulls one way, KL pulls the other",
    lines: [
     { c: "recon_loss = F.mse_loss(recon, x, reduction=\"sum\")", w: "**Term 1: be accurate.** Identical to the plain autoencoder — make the output look like the input." },
     { c: "", w: "" },
     { c: "kl = -0.5 * torch.sum(1 + logvar - mu.pow(2) - logvar.exp())", w: "**Term 2: stay organised.** The KL divergence between the encoder's distribution and a standard normal. It penalises the network for putting codes far from the origin or making the variance tiny.", hi: true },
     { c: "", w: "" },
     { c: "loss = recon_loss + beta * kl", w: "`beta` weights the trade-off. This is the single knob that decides what kind of model you get.", hi: true }
    ] } },

  { tbl: { t: "What beta actually controls",
    h: ["beta", "What wins", "What you get"],
    rows: [
     ["**0**", "Reconstruction only", "A plain autoencoder again — sharp reconstructions, unusable latent space"],
     ["**1**", "The balance from the original paper", "Blurry but coherent samples; the standard starting point"],
     ["**> 1**", "The KL term", "A more disentangled, better-behaved latent space, blurrier output (this is beta-VAE)"],
     ["**too high**", "KL collapses everything", "Posterior collapse: the encoder outputs the prior and ignores the input entirely"]
    ] } },

  { trap: "**Posterior collapse** is the VAE failure everyone hits. If the KL term dominates, the cheapest way to minimise it is for the encoder to output exactly the standard normal for every input — ignoring `x` completely. The loss looks like it is going down; the model has learned nothing. The standard fix is *KL annealing*: start `beta` near zero and raise it over the first few epochs, so reconstruction establishes itself first." },

  { h: "Generating, finally" },
  { code: { lang: "python", t: "The payoff — no encoder involved",
    lines: [
     { c: "model.eval()", w: "" },
     { c: "with torch.no_grad():", w: "" },
     { c: "    z = torch.randn(16, latent)", w: "Sample straight from the standard normal — the exact distribution the KL term trained the space to match.", hi: true },
     { c: "    samples = model.decoder(z)", w: "Decode. These are new images the model has never seen, and the encoder was not used at all." }
    ],
    after: "This line is impossible with a plain autoencoder — the same call would return noise. The KL term is what bought it." } },

  { n: "VAE samples are famously blurry, and the reason is the loss. MSE between an output and a target is minimised by predicting the *average* of all plausible outputs, and the average of many sharp images is a blurry one. GANs attack exactly this problem, which is the next lesson.",
    nt: "Why VAE output is blurry" },

  { tryit: { t: "Diagnose a collapsed VAE",
    task: "Your VAE's total loss drops nicely, but every sample looks like the same grey blob, and reconstructions of different inputs are nearly identical. What has happened, and what would you check first?",
    hint: "Look at the two loss terms separately rather than the sum.",
    sol: { lang: "python", code: "# Posterior collapse. Log the two terms SEPARATELY -- the sum\n# hides this completely:\n\nprint(f\"recon {recon_loss.item():.1f}  kl {kl.item():.4f}\")\n\n# The signature: kl is near zero and stays there while recon\n# plateaus high. The encoder is emitting the prior for every\n# input, so mu ~ 0 and logvar ~ 0 regardless of x.\n\n# Fix 1 -- KL annealing: let reconstruction win early\nbeta = min(1.0, epoch / 10)\nloss = recon_loss + beta * kl\n\n# Fix 2 -- free bits: allow some KL per dimension at no cost\nkl_per_dim = -0.5 * (1 + logvar - mu.pow(2) - logvar.exp())\nkl = torch.clamp(kl_per_dim, min=0.05).sum()" },
    w: "The general lesson outlives VAEs: **when a loss is a sum of terms, always log the terms separately.** A falling total can hide one term collapsing while another stagnates, and you cannot see it in the number you are watching." } }
 ],
 k: [
  "A VAE encodes a distribution (mean and log-variance), not a point.",
  "That forces the latent space to be continuous, so a random `z` decodes to something real.",
  "Reparameterisation moves the randomness out of the gradient path: `mu + eps * std`.",
  "The loss is reconstruction + beta x KL, and the two terms actively fight.",
  "Posterior collapse is the classic failure — always log the two loss terms separately."
 ],
 r: ["Variational Autoencoder", "KL Divergence", "Autoencoder", "Sampling"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "self.fc_logvar = nn.Linear(128, latent)", w: "the head that outputs log-variance" },
   { c: "std = torch.exp(0.5 * logvar)", w: "convert log-variance to standard deviation" },
   { c: "eps = torch.randn_like(std)", w: "the noise that keeps sampling differentiable" },
   { c: "return mu + eps * std", w: "the reparameterisation trick in one line" },
   { c: "kl = -0.5 * torch.sum(1 + logvar - mu.pow(2) - logvar.exp())", w: "the KL term of the VAE loss" }
  ]
 }
},

/* ==================================================================== */
{
 t: "GANs: Two Networks in an Arms Race",
 m: "gen",
 lvl: "advanced",
 s: "A generator and a discriminator training against each other — the sharpest images and the hardest training in deep learning.",
 goal: [
  "Describe the minimax game in terms of what each network wants",
  "Write the alternating training loop and say why the order matters",
  "Name the three classic failure modes and the fix for each"
 ],
 b: [
  { q: "The most interesting idea in the last ten years in machine learning.", by: "Yann LeCun, on adversarial training" },

  { p: "Ian Goodfellow's idea, reportedly worked out in a pub argument in 2014: instead of hand-writing a loss that says what a good image is — which nobody knows how to do — **train a second network to be the loss**. That second network's only job is to spot fakes, and the first network's job is to fool it." },

  { h: "The two players" },
  { ol: [
   "The **generator** takes random noise and produces an image. It never sees real data directly — only the discriminator's verdict on its work.",
   "The **discriminator** is a plain binary classifier: real or fake. It sees both real images and the generator's attempts."
  ] },
  { p: "They are trained in alternation, each getting slightly better, each forcing the other to improve. When it works, the generator ends up producing images the discriminator cannot distinguish from real ones — which is the strongest definition of *realistic* anyone has managed to write down." },

  { ana: "A forger and a detective who train each other. The forger never sees a real banknote — only whether this week's attempt was caught. The detective sees both. Each round the detective gets sharper, so the forger must too. Neither could improve alone; the pressure is what produces the skill.",
    at: "The forger and the detective" },

  { h: "The training loop, which is unlike any you have written" },
  { code: { lang: "python", file: "gan.py", t: "Two optimisers, two backward passes, one loop",
    lines: [
     { c: "for real in loader:", w: "" },
     { c: "    # ---- 1. train the discriminator ----", w: "**Discriminator first.** A generator trained against an untrained critic learns nothing useful." },
     { c: "    opt_d.zero_grad()", w: "" },
     { c: "    z = torch.randn(batch, latent)", w: "The generator's only input is noise." },
     { c: "    fake = generator(z)", w: "" },
     { c: "", w: "" },
     { c: "    d_real = discriminator(real)", w: "" },
     { c: "    d_fake = discriminator(fake.detach())", w: "**`.detach()` is critical.** It cuts the graph so this backward pass updates only the discriminator. Forget it and you train the generator to help the discriminator catch it.", hi: true },
     { c: "", w: "" },
     { c: "    loss_d = bce(d_real, ones) + bce(d_fake, zeros)", w: "Real should score 1, fake should score 0." },
     { c: "    loss_d.backward(); opt_d.step()", w: "" },
     { c: "", w: "" },
     { c: "    # ---- 2. train the generator ----", w: "" },
     { c: "    opt_g.zero_grad()", w: "" },
     { c: "    d_fake = discriminator(fake)", w: "No `.detach()` this time — the gradient must reach the generator through the discriminator." },
     { c: "    loss_g = bce(d_fake, ones)", w: "**The generator wants its fakes labelled real** — hence `ones`, not `zeros`. This is the non-saturating form, and it gives far better gradients early on than trying to maximise the discriminator's error directly.", hi: true },
     { c: "    loss_g.backward(); opt_g.step()", w: "" }
    ],
    after: "Two `zero_grad`s, two `backward`s, two `step`s, and one `.detach()` that decides whether any of it works. Being able to write this from memory and explain the `.detach()` is a standard senior-level interview question." } },

  { h: "Why GAN training is genuinely hard" },
  { p: "Every other model you have trained minimises a loss towards a floor. A GAN is looking for an **equilibrium** between two competing objectives, and there is no number that goes down to tell you it is working. A GAN loss chart that looks flat and noisy may be perfectly healthy; one that looks like it is converging beautifully may be collapsing." },

  { tbl: { t: "The three failures, and what to do",
    h: ["Failure", "What you see", "The fix"],
    rows: [
     ["**Mode collapse**", "Every sample looks the same — the generator found one image that fools the critic and stopped exploring", "Minibatch discrimination, unrolled steps, or switch to WGAN-GP"],
     ["**Discriminator wins**", "`loss_d` goes to 0, `loss_g` climbs forever — a perfect critic gives no usable gradient", "Weaken it: fewer updates, label smoothing, lower its learning rate"],
     ["**Oscillation**", "Sample quality visibly cycles and never settles", "Two-timescale update rule (different learning rates), or spectral normalisation"]
    ] } },

  { trap: "Do not judge a GAN by its loss curves. The single most useful diagnostic is a fixed noise vector — sample from the *same* `z` every epoch and look at the images. Real progress is visible there long before any number tells you, and mode collapse is instantly obvious in a way it never is in a loss chart." },

  { code: { lang: "python", t: "The diagnostic that actually works",
    lines: [
     { c: "fixed_z = torch.randn(64, latent)", w: "Created **once**, before training, and never regenerated. That is what makes epochs comparable.", hi: true },
     { c: "", w: "" },
     { c: "@torch.no_grad()", w: "" },
     { c: "def snapshot(epoch):", w: "" },
     { c: "    generator.eval()", w: "" },
     { c: "    imgs = generator(fixed_z)", w: "Same input every time, so any change you see is the model changing." },
     { c: "    save_image(imgs, f\"epoch_{epoch:03d}.png\", nrow=8)", w: "An 8x8 grid. If all 64 tiles converge to the same picture, that is mode collapse, and no loss curve would have told you." },
     { c: "    generator.train()", w: "" }
    ] } },

  { h: "Where GANs actually stand today" },
  { p: "GANs dominated image generation from 2014 to roughly 2021 and have largely been displaced by diffusion for general-purpose generation — diffusion trains stably and covers the full data distribution, which GANs struggle to do. But GANs are still the right tool where they win:" },
  { l: [
   "**Speed.** A GAN generates in one forward pass; diffusion needs many steps. For real-time work that is decisive.",
   "**Super-resolution and restoration**, where the adversarial loss produces sharper detail than any pixel-wise loss.",
   "**Image-to-image translation** — CycleGAN and pix2pix remain standard.",
   "**Audio and voice synthesis**, where fast single-pass generation matters."
  ] },
  { n: "The GAN idea outlived the architecture. Adversarial *losses* now appear inside models that are not GANs at all — as one term among several, providing the sharpness that a reconstruction loss alone cannot. That pattern is what to carry forward.",
    nt: "The idea, not the architecture" },

  { tryit: { t: "Find the bug",
    task: "This training step runs without error and the discriminator learns fine, but the generator never improves at all. What is wrong?\n\n`fake = generator(z)` … `d_fake = discriminator(fake.detach())` … `loss_g = bce(d_fake, ones)` … `loss_g.backward()`",
    hint: "Follow the gradient backwards from `loss_g` and ask what it can reach.",
    sol: { lang: "python", code: "# The bug: .detach() is still applied when training the GENERATOR.\n\n# detach() cuts the graph between the generator and the loss, so\n# loss_g.backward() computes gradients for the discriminator only.\n# The generator's parameters receive nothing -- no error, no warning,\n# just a model that never changes.\n\n# Correct:\nfake = generator(z)\n\n# discriminator step -- detach, so only D is updated\nd_fake = discriminator(fake.detach())\nloss_d = bce(d_real, ones) + bce(d_fake, zeros)\nloss_d.backward(); opt_d.step()\n\n# generator step -- NO detach, the gradient must flow through D\n# and onward into G\nd_fake = discriminator(fake)\nloss_g = bce(d_fake, ones)\nloss_g.backward(); opt_g.step()" },
    w: "Silent, and very common. The tell is that the generator's parameters never change — check with `sum(p.grad.abs().sum() for p in generator.parameters())` after `backward()`. If that is zero, the graph is cut." } }
 ],
 k: [
  "A generator makes fakes from noise; a discriminator judges real against fake.",
  "The generator's loss labels its own fakes as real — the non-saturating form.",
  "`.detach()` when training the discriminator, never when training the generator.",
  "GAN loss curves are not progress. Sample a fixed `z` every epoch and look.",
  "Mode collapse, a winning discriminator and oscillation are the three failures."
 ],
 r: ["Generative Adversarial Network", "Generative AI", "Loss Function", "Neural Network"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "fake = generator(z)", w: "produce a batch of fakes from noise" },
   { c: "d_fake = discriminator(fake.detach())", w: "judge fakes while updating only the discriminator" },
   { c: "loss_d = bce(d_real, ones) + bce(d_fake, zeros)", w: "the discriminator's two-part loss" },
   { c: "loss_g = bce(d_fake, ones)", w: "the generator wants its fakes called real" },
   { c: "fixed_z = torch.randn(64, latent)", w: "the fixed noise that makes epochs comparable" }
  ]
 }
},

/* ==================================================================== */
{
 t: "Diffusion Models: Learning to Undo Noise",
 m: "gen",
 lvl: "advanced",
 s: "Destroy an image step by step, then train a network to reverse it — the method behind every modern image generator.",
 goal: [
  "Describe the forward and reverse processes in one sentence each",
  "Say what the network is actually trained to predict",
  "Explain why diffusion trains stably where GANs do not"
 ],
 b: [
  { p: "Diffusion powers Stable Diffusion, DALL-E, Midjourney and Sora. The idea is stranger and simpler than GANs, and the reason it won is not sample quality alone — it is that **training is a plain regression problem**, with a loss that actually goes down." },

  { h: "Two processes, and only one is learned" },
  { ol: [
   "**Forward (fixed, no learning).** Take a real image and add a little Gaussian noise. Repeat a thousand times. You end with pure static. This process is defined by a formula, not trained — you already know how to destroy an image.",
   "**Reverse (learned).** Train a network to take a noisy image and predict the noise that was added. Run it repeatedly and you walk backwards from static to an image."
  ] },

  { ana: "Watching a photograph dissolve into television static, one frame at a time, and training a model to play the tape backwards. Each step is a small, easy prediction — remove a little noise. A thousand small easy steps compose into something no single step could do.",
    at: "The tape, played backwards" },

  { h: "The trick that makes it trainable" },
  { p: "You never have to run a thousand forward steps during training. Because adding Gaussian noise repeatedly is itself Gaussian, you can jump straight to any timestep in one line." },

  { code: { lang: "python", t: "Jump to timestep t directly",
    lines: [
     { c: "t = torch.randint(0, T, (batch,))", w: "A **random** timestep per example. The network must handle every noise level, so it sees them all across training." },
     { c: "noise = torch.randn_like(x0)", w: "The noise that will be added — and the target the network must predict." },
     { c: "", w: "" },
     { c: "a = alpha_bar[t].view(-1, 1, 1, 1)", w: "The cumulative noise schedule at `t`. Reshaped to broadcast over an image batch." },
     { c: "xt = a.sqrt() * x0 + (1 - a).sqrt() * noise", w: "**The whole forward process in one line.** At small `t` it is mostly image; at large `t` mostly noise. No loop required.", hi: true }
    ] } },

  { code: { lang: "python", t: "And the loss is just MSE",
    lines: [
     { c: "pred = model(xt, t)", w: "The network sees the noisy image and the timestep. `t` matters — removing noise at step 900 is a different job from step 10." },
     { c: "loss = F.mse_loss(pred, noise)", w: "**Predict the noise, not the image.** This is the counter-intuitive part, and it is the whole design.", hi: true },
     { c: "loss.backward()", w: "" }
    ],
    after: "That is the entire training loop. No adversary, no equilibrium, no balancing act — a regression problem with a loss that decreases monotonically and tells you the truth. Compare that with the GAN loop and you can see immediately why the field moved." } },

  { n: "Why predict the noise rather than the clean image? They are algebraically equivalent — given `xt` and the noise you can solve for `x0`. But the noise is a standard normal at every timestep, so the target always has the same scale, while `x0` does not. A target with constant statistics is far easier to fit, and that detail is most of why the method works.",
    nt: "The reason the target is noise" },

  { h: "Sampling: the slow part" },
  { code: { lang: "python", t: "Walking back from static",
    lines: [
     { c: "x = torch.randn(1, 3, 64, 64)", w: "Start from pure noise." },
     { c: "for t in reversed(range(T)):", w: "**Loop, every time you generate.** This is the cost: a GAN generates in one forward pass, diffusion needs hundreds or thousands.", hi: true },
     { c: "    pred_noise = model(x, t)", w: "" },
     { c: "    x = step(x, pred_noise, t)", w: "Remove a little of the predicted noise and add a little fresh noise back — the small re-injection is what keeps samples diverse rather than collapsing to one image." },
     { c: "return x", w: "" }
    ],
    after: "Slow sampling is diffusion's real weakness, and the whole reason for DDIM, latent diffusion and distilled few-step samplers. The 2020 original needed 1,000 steps; modern distilled models produce comparable images in 4." } },

  { h: "The two ideas that made it practical" },
  { l: [
   "**Latent diffusion (Stable Diffusion).** Do the whole process in a compressed latent space from an autoencoder instead of on pixels. A 512x512 image becomes a 64x64 latent — around 48x less data per step. This is what moved diffusion onto consumer GPUs, and note that it is the *autoencoder* from the first lesson doing the compressing.",
   "**Classifier-free guidance.** Train with the text prompt sometimes dropped, then at sampling time push away from the unconditional prediction and towards the conditional one. The `guidance_scale` you set in any image tool is exactly this number — higher means more literal adherence to the prompt and less diversity."
  ] },

  { tbl: { t: "The three families, side by side",
    h: ["", "VAE", "GAN", "Diffusion"],
    rows: [
     ["**Training**", "Stable", "Unstable, adversarial", "Stable, plain regression"],
     ["**Sample quality**", "Blurry", "Sharp", "Sharp"],
     ["**Coverage**", "Good", "Poor (mode collapse)", "Excellent"],
     ["**Speed**", "One pass", "One pass", "Many steps — slow"],
     ["**Latent space**", "Smooth, editable", "Usable", "Not a compact code"],
     ["**Use it for**", "Compression, anomalies", "Real-time, restoration", "Almost all generation today"]
    ] } },

  { tryit: { t: "Reason about the schedule",
    task: "Your diffusion model trains with a loss that falls nicely, but samples are pure noise. You discover the noise schedule reaches `alpha_bar ≈ 0.4` at the final timestep instead of near 0. Why does that break generation, when training looked fine?",
    hint: "Sampling starts from `torch.randn` — pure noise. Ask what the model was actually trained to expect at its highest timestep.",
    sol: { lang: "python", code: "# Training and sampling disagree about what step T looks like.\n\n# With alpha_bar[T] = 0.4, the noisiest example the model ever\n# saw was still 63% signal:\n#     xt = sqrt(0.4) * x0 + sqrt(0.6) * noise\n#          ~0.63 * image + ~0.77 * noise\n\n# But sampling starts from PURE noise -- equivalent to\n# alpha_bar = 0. That input is out of distribution: the model has\n# never seen it, so its first prediction is meaningless and every\n# later step compounds the error.\n\n# The loss looked fine because the model learned its training\n# distribution perfectly well. It was simply the wrong one.\n\n# Fix: the schedule must end effectively at zero.\nalpha_bar[-1] < 1e-4   # so x_T is indistinguishable from randn" },
    w: "A train/inference distribution mismatch — the same class of bug as forgetting `model.eval()`, and just as invisible in the loss. Whenever training looks healthy and inference does not, ask what the model saw at training time that it is not seeing now." } }
 ],
 k: [
  "Forward: add noise by formula, no learning. Reverse: a network predicts the noise.",
  "You can jump to any timestep in one line — training never runs the full chain.",
  "The loss is plain MSE against the noise, which is why training is stable.",
  "Sampling loops hundreds of times; that is diffusion's real cost.",
  "Latent diffusion runs the process in an autoencoder's latent space to make it affordable."
 ],
 r: ["Diffusion Model", "Stable Diffusion", "Generative AI", "Sampling"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "t = torch.randint(0, T, (batch,))", w: "a random timestep per example" },
   { c: "xt = a.sqrt() * x0 + (1 - a).sqrt() * noise", w: "jump straight to timestep t" },
   { c: "loss = F.mse_loss(pred, noise)", w: "predict the noise, not the image" },
   { c: "for t in reversed(range(T)):", w: "walk backwards from pure noise" },
   { c: "x = torch.randn(1, 3, 64, 64)", w: "the static that sampling starts from" }
  ]
 }
}

]);
