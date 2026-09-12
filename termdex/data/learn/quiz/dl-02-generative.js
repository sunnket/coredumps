/* DL — generative models and frontier topics.

   Questions test the reasoning, not the vocabulary: every distractor is a
   thing people actually believe, and the explanation says why it is wrong
   rather than restating the right answer. */

/* ===================================================================
   Module: gen — autoencoders, VAEs, GANs, diffusion
   =================================================================== */

TD.addMCQ("dl", "gen", [
  {
    "tag": "Autoencoder bottleneck",
    "lvl": "intermediate",
    "q": "You train an autoencoder where the latent dimension equals the input dimension (784 → 784 → 784) with no other constraint. Reconstruction loss falls to almost exactly zero. What has the model learned?",
    "o": [
      "A near-perfect compressed representation of the data",
      "Effectively the identity function — it has learned nothing about the structure of the data",
      "A latent space suitable for generating new samples",
      "The principal components of the dataset, equivalent to PCA"
    ],
    "a": 1,
    "x": "With no bottleneck there is no pressure to discard anything, so the cheapest solution is to pass the input straight through. Zero reconstruction loss here is a warning, not a success: the constraint IS the method. This is why the latent width is the most important hyperparameter in an autoencoder."
  },
  {
    "tag": "Why a plain autoencoder cannot generate",
    "lvl": "intermediate",
    "q": "You train a standard autoencoder on MNIST, then sample a random vector from a normal distribution and pass it to the decoder. The output is noise. Why?",
    "o": [
      "The decoder is undertrained and needs more epochs",
      "The latent space has gaps — nothing during training forced regions between encoded points to be meaningful",
      "The random vector needs to be scaled to the range of the training data",
      "Autoencoders can only decode vectors produced by their own encoder for architectural reasons"
    ],
    "a": 1,
    "x": "Training only ever penalises reconstruction of actual training points, so those map to scattered locations with undefined space between them. Nothing makes the space continuous. That is exactly the deficiency a VAE's KL term repairs, and it is why the VAE — not more training — is the fix."
  },
  {
    "tag": "Reparameterisation trick",
    "lvl": "advanced",
    "q": "In a VAE, why is the latent sampled as `mu + eps * std` with `eps ~ N(0,1)` rather than by drawing directly from `N(mu, std)`?",
    "o": [
      "It is numerically more stable for very small variances",
      "Sampling is not differentiable, so the randomness is moved into a constant that the gradient does not need to pass through",
      "It guarantees the latent stays within the unit hypersphere",
      "It is faster, because generating standard normal noise is cheaper"
    ],
    "a": 1,
    "x": "You cannot backpropagate through a sampling operation. Writing the sample as a deterministic function of mu and std, scaled by externally-drawn noise, means gradients flow cleanly into both learned parameters while eps is treated as a constant. The randomness is still present — it is simply out of the gradient's path."
  },
  {
    "tag": "Posterior collapse",
    "lvl": "advanced",
    "q": "Your VAE's total loss decreases steadily, but samples are all near-identical blobs and different inputs reconstruct to almost the same output. What is happening?",
    "o": [
      "The decoder is too small to represent the data",
      "Posterior collapse — the KL term dominates, so the encoder outputs the prior regardless of the input",
      "The learning rate is too high and training has diverged",
      "The latent dimension is too large, causing overfitting"
    ],
    "a": 1,
    "x": "When KL dominates, the cheapest way to reduce it is for the encoder to emit the standard normal for every input, ignoring x entirely. The total loss still falls because the KL term is going to zero. This is why you must log the reconstruction and KL terms separately — the sum actively hides it. Fixes: KL annealing, or free bits."
  },
  {
    "tag": "VAE blurriness",
    "lvl": "advanced",
    "q": "VAE samples are characteristically blurry compared to GAN samples. What is the underlying cause?",
    "o": [
      "VAEs use smaller latent dimensions than GANs",
      "The pixel-wise reconstruction loss is minimised by predicting the average of all plausible outputs, and an average of sharp images is blurry",
      "The KL divergence term smooths the decoder's output directly",
      "VAEs cannot use convolutional layers effectively"
    ],
    "a": 1,
    "x": "MSE (or any pixel-wise loss) rewards hedging: when several outputs are plausible, the loss-minimising prediction is their mean. GANs avoid this because the discriminator penalises a blurry average as obviously fake — no pixel-wise loss is involved. This is precisely the problem adversarial training solves."
  },
  {
    "tag": "GAN detach",
    "lvl": "advanced",
    "q": "In a GAN training loop, `fake.detach()` is used when computing the discriminator loss but NOT when computing the generator loss. What happens if you use `.detach()` in both places?",
    "o": [
      "The discriminator overfits to the training data",
      "The generator receives no gradients at all and never improves, with no error raised",
      "Training becomes unstable and the loss oscillates wildly",
      "Mode collapse occurs immediately"
    ],
    "a": 1,
    "x": "`.detach()` severs the computation graph. On the generator step the gradient must travel from the loss, back through the discriminator, and into the generator — detaching cuts that path, so the generator's parameters get nothing. It runs silently and the model simply never changes. Check with `sum(p.grad.abs().sum() for p in generator.parameters())`."
  },
  {
    "tag": "GAN generator loss",
    "lvl": "advanced",
    "q": "The generator's loss is `bce(d_fake, ones)` — labelling its own fakes as real. Why is this preferred over directly minimising `bce(d_fake, zeros)` negated?",
    "o": [
      "It is mathematically identical but computationally cheaper",
      "It is the non-saturating form: early in training when the discriminator easily wins, it still provides strong gradients",
      "It prevents the discriminator from overfitting",
      "It guarantees convergence to a Nash equilibrium"
    ],
    "a": 1,
    "x": "The original minimax formulation saturates: when the discriminator confidently rejects every fake, the generator's gradient vanishes exactly when it most needs to learn. Goodfellow's non-saturating trick flips the target instead, giving large gradients when the generator is losing badly. It is a practical fix, not a theoretical one."
  },
  {
    "tag": "Mode collapse",
    "lvl": "advanced",
    "q": "Your GAN's loss curves look stable, but every generated sample is nearly the same image. Which diagnostic would have revealed this earliest?",
    "o": [
      "Plotting the discriminator and generator losses on the same axis",
      "Generating from a fixed noise vector each epoch and viewing the grid of images",
      "Monitoring the gradient norm of the discriminator",
      "Computing reconstruction error on a validation set"
    ],
    "a": 1,
    "x": "GAN losses measure an equilibrium, not progress — stable curves are compatible with total collapse. A fixed `z` sampled every epoch makes mode collapse instantly visible: all tiles converge to one picture. This is the single most useful GAN diagnostic and it costs nothing. There is no reconstruction error in a GAN at all."
  },
  {
    "tag": "Diffusion training target",
    "lvl": "advanced",
    "q": "A diffusion model is trained to predict the *noise* added at timestep t, rather than the clean image directly. Given that the two are algebraically equivalent, why choose noise?",
    "o": [
      "Predicting noise requires fewer parameters",
      "The noise target is standard normal at every timestep, so the target has constant scale and is far easier to fit",
      "The clean image cannot be recovered from the noisy image",
      "It avoids the need for a variance schedule"
    ],
    "a": 1,
    "x": "Given x_t and the noise you can solve for x_0, so the choice is not about what is recoverable. It is about optimisation: the noise target is N(0,1) regardless of t, while x_0's statistics vary. A target with stable statistics across the whole training distribution is much better conditioned, and that detail is most of why the method works in practice."
  },
  {
    "tag": "Diffusion training cost",
    "lvl": "advanced",
    "q": "Training a diffusion model with T=1000 timesteps does NOT require running 1000 sequential steps per training example. Why not?",
    "o": [
      "Only the first and last timesteps are used during training",
      "Composed Gaussian noise is itself Gaussian, so you can jump to any timestep t in closed form with a single expression",
      "The timesteps are processed in parallel on the GPU",
      "A separate network predicts the intermediate states"
    ],
    "a": 1,
    "x": "`x_t = sqrt(alpha_bar_t) * x_0 + sqrt(1 - alpha_bar_t) * noise` gives you any timestep directly. Training samples a random t per example and jumps there. The 1000-step loop is only needed at SAMPLING time, which is why diffusion trains comparably fast to other models but generates slowly."
  },
  {
    "tag": "Latent diffusion",
    "lvl": "advanced",
    "q": "Stable Diffusion runs the diffusion process in a compressed latent space rather than on pixels. Which component performs that compression?",
    "o": [
      "A GAN discriminator",
      "A pretrained autoencoder — the encoder compresses to latents, the decoder reconstructs the final image",
      "The CLIP text encoder",
      "A wavelet transform applied to each image"
    ],
    "a": 1,
    "x": "An autoencoder — the architecture from the first lesson in this module. A 512x512x3 image becomes roughly 64x64x4, around 48x less data per denoising step. This is what moved diffusion from research clusters onto consumer GPUs. CLIP is also present, but it encodes the text prompt for conditioning, not the image for compression."
  },
  {
    "tag": "Choosing a generative model",
    "lvl": "advanced",
    "q": "You need to generate images in real time for a video filter running at 30fps on a mobile device. Which family is the appropriate choice, and why?",
    "o": [
      "Diffusion, because it produces the highest quality samples",
      "A GAN, because it generates in a single forward pass while diffusion requires many sequential steps",
      "A VAE, because its latent space is smooth",
      "Any of them — inference speed is comparable across the three"
    ],
    "a": 1,
    "x": "This is the one axis where GANs still clearly win. A GAN is one forward pass; standard diffusion needs hundreds. Even heavily distilled few-step diffusion struggles at 30fps on mobile. Quality is not the only criterion, and knowing when the older architecture is still correct is what separates recall from judgement."
  }
]);

/* ===================================================================
   Module: frontier — self-supervised, RL/RLHF, MoE
   =================================================================== */

TD.addMCQ("dl", "frontier", [
  {
    "tag": "InfoNCE and batch size",
    "lvl": "advanced",
    "q": "In contrastive learning with the InfoNCE loss, why did papers like SimCLR require very large batch sizes (4096+) to work well?",
    "o": [
      "Large batches stabilise batch normalisation statistics",
      "Every other example in the batch serves as a negative, so a larger batch provides more and harder negatives",
      "The loss is only numerically stable above a certain batch size",
      "Gradient accumulation cannot be used with contrastive losses"
    ],
    "a": 1,
    "x": "The batch IS the source of negatives — the loss is a classification over the other items present. A batch of 16 makes the task trivially easy and the representation weak; thousands of negatives makes it genuinely hard. This is exactly why MoCo introduced a memory queue: it decouples the number of negatives from the batch size."
  },
  {
    "tag": "Contrastive temperature",
    "lvl": "advanced",
    "q": "In InfoNCE, `sim = z1 @ z2.T / temperature`. What does lowering the temperature (e.g. 0.5 → 0.05) do?",
    "o": [
      "It reduces the magnitude of gradients uniformly",
      "It sharpens the distribution, concentrating the loss on the hardest negatives and encouraging finer distinctions",
      "It increases the effective batch size",
      "It prevents the embeddings from collapsing to a single point"
    ],
    "a": 1,
    "x": "Dividing by a small temperature scales up the logit differences before the softmax, so the loss is dominated by the most confusing negatives. High temperature flattens the distribution and treats all negatives more equally, learning coarser structure. Most papers converge on around 0.07 as the practical balance."
  },
  {
    "tag": "Augmentation choice",
    "lvl": "advanced",
    "q": "You apply a standard natural-image augmentation pipeline including random horizontal flip to a contrastive model trained on chest X-rays. What is the specific risk?",
    "o": [
      "Flipping doubles training time with no benefit",
      "Human anatomy is not left-right symmetric, so the model learns to treat mirrored anatomy as equivalent and loses the ability to detect conditions like situs inversus",
      "Horizontal flip is incompatible with single-channel images",
      "It causes the contrastive loss to become negative"
    ],
    "a": 1,
    "x": "An augmentation asserts an invariance: 'these two views mean the same thing'. Flipping an X-ray asserts that left and right anatomy are interchangeable, which is medically false. Copying a default transform list from an ImageNet tutorial into a medical domain is one of the most common quiet failures in applied deep learning."
  },
  {
    "tag": "CLIP and text-to-image",
    "lvl": "advanced",
    "q": "Why was CLIP a prerequisite for practical text-to-image generation?",
    "o": [
      "CLIP generates the images directly from the prompt",
      "It provides a shared embedding space where text and images are comparable, giving the generator something to condition on",
      "CLIP removes the need for a diffusion model's noise schedule",
      "It compresses images into latents for faster generation"
    ],
    "a": 1,
    "x": "CLIP itself generates nothing. Its contribution is a joint space where a caption embedding and a matching image embedding land close together — which is what makes a text prompt a usable steering signal for a generator. Without a shared space, there is nothing for the prompt to point at. The compression is done by a separate autoencoder."
  },
  {
    "tag": "Exploration versus exploitation",
    "lvl": "intermediate",
    "q": "In epsilon-greedy exploration, epsilon is typically decayed over training but rarely to exactly zero. Why keep a small floor?",
    "o": [
      "To prevent numerical instability in the Q-network",
      "So the agent keeps sampling alternatives in case the environment changes or its current estimates are wrong",
      "Because a zero epsilon causes division by zero in the update rule",
      "To satisfy the Markov property"
    ],
    "a": 1,
    "x": "Epsilon at exactly zero means the agent will never revisit an action it currently underrates, so an early bad estimate becomes permanent. A small floor (0.01–0.05) keeps a trickle of exploration alive, which matters both for correcting mistaken estimates and for non-stationary environments."
  },
  {
    "tag": "Reward model loss",
    "lvl": "advanced",
    "q": "An RLHF reward model is trained with `-logsigmoid(r_chosen - r_rejected)`. Why is the loss built on a difference rather than on absolute scores?",
    "o": [
      "It makes the loss differentiable, which absolute scores are not",
      "Humans cannot reliably assign absolute quality scores, but they can reliably pick the better of two options",
      "It ensures rewards stay in the range [0, 1]",
      "It removes the need for a KL penalty during RL"
    ],
    "a": 1,
    "x": "Absolute human ratings are noisy and drift between annotators and sessions — one person's 7/10 is another's 5/10. Pairwise comparisons are far more consistent. The Bradley-Terry formulation turns those comparisons into a scalar reward, and only differences between scores are ever meaningful; the absolute scale is arbitrary."
  },
  {
    "tag": "KL penalty in RLHF",
    "lvl": "advanced",
    "q": "During PPO fine-tuning the objective is `reward - beta * KL(policy || sft_model)`. What failure does the KL term prevent?",
    "o": [
      "Catastrophic forgetting of the pretraining corpus",
      "Reward hacking — the policy finding degenerate text that scores highly on the reward model but is not good output",
      "Gradient explosion in the value network",
      "Overfitting to the supervised fine-tuning dataset"
    ],
    "a": 1,
    "x": "The reward model is a proxy for human preference, and any proxy optimised hard enough stops tracking what it proxies for — Goodhart's law. Without the leash, policies reliably discover repetitive flattery or outright non-language that the reward model scores well. The KL term bounds how far the policy may drift from known-sane behaviour."
  },
  {
    "tag": "DPO versus RLHF",
    "lvl": "advanced",
    "q": "What does Direct Preference Optimisation (DPO) replace in the standard RLHF pipeline?",
    "o": [
      "The supervised fine-tuning stage",
      "Both the separate reward model and the reinforcement learning loop — training directly on preference pairs instead",
      "The human annotation step",
      "The KL divergence penalty"
    ],
    "a": 1,
    "x": "DPO keeps SFT and keeps the human preference data, but shows the RL stage can be reformulated as a direct classification-style loss on preference pairs — no separate reward model, no PPO loop. It is simpler and markedly more stable, which is why it is now the default for open fine-tuning work. A KL-like term is still implicit in its objective."
  },
  {
    "tag": "Metric gaming",
    "lvl": "advanced",
    "q": "You train a summarisation agent with RL where the reward is ROUGE against reference summaries. What behaviour should you expect the agent to discover?",
    "o": [
      "It will produce unusually short, abstractive summaries",
      "It will produce long, largely extractive output that copies source spans, since n-gram overlap rises with length and verbatim copying",
      "It will refuse to generate output when uncertain",
      "It will converge to the reference summaries exactly"
    ],
    "a": 1,
    "x": "ROUGE recall increases as you include more source text, so length and verbatim copying are the cheapest ways to raise it without summarising well. This is the general law of RL reward design: any single metric optimised by a capable agent will be gamed. The mitigation is a composite reward plus explicit penalties, never a single number."
  },
  {
    "tag": "MoE active parameters",
    "lvl": "advanced",
    "q": "An 8x7B Mixture-of-Experts model with top-2 routing has roughly 47B total parameters. What is its approximate inference compute cost per token?",
    "o": [
      "Equivalent to a 47B dense model, since all parameters are loaded",
      "Roughly that of a 13B dense model, because only the router plus 2 experts activate per token",
      "Equivalent to a 7B dense model",
      "Equivalent to a 94B dense model, due to routing overhead"
    ],
    "a": 1,
    "x": "Only the selected experts run, so compute tracks ACTIVE parameters (~13B here — two experts plus the shared attention layers), not total. Crucially this saves compute, not memory: all 47B must still be resident in VRAM. MoE trades memory for compute, which is why it suits large-scale serving and not single-GPU deployment."
  },
  {
    "tag": "Router collapse",
    "lvl": "advanced",
    "q": "In an 8-expert MoE, logging shows two experts receiving 78% of all tokens. What is the standard cause and remedy?",
    "o": [
      "The learning rate is too high; reduce it",
      "Router collapse — add or increase the auxiliary load-balancing loss so routing is penalised for imbalance",
      "The experts are too small; increase their width",
      "Top-k routing should be replaced with top-1 routing"
    ],
    "a": 1,
    "x": "Without a balancing term, the router settles on whichever experts are adequate early, and the rest receive almost no gradient and never improve — you paid for eight experts and got two. The auxiliary loss penalises imbalance directly. Keep its weight small (~0.01): too large and the router balances at the expense of routing sensibly."
  },
  {
    "tag": "Diagnosing distributions",
    "lvl": "advanced",
    "q": "Posterior collapse in a VAE and router collapse in an MoE share a diagnostic lesson. What is it?",
    "o": [
      "Both are caused by a learning rate that is too high",
      "An aggregate metric can look healthy while the distribution underneath it is degenerate — log the components and the distribution, not just the total",
      "Both require an auxiliary loss term to fix",
      "Both are only detectable at inference time"
    ],
    "a": 1,
    "x": "In the VAE the total loss falls while the KL term collapses to zero; in the MoE the loss falls while routing concentrates on two experts. In both cases the number being watched is fine and the model is broken. Logging the constituent terms and the distribution — not the average — is what surfaces these, and the habit generalises well beyond both."
  }
]);
