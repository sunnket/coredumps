/* Case studies — Papers & Breakthroughs. */
TD.addStudies("breakthroughs", [

{
 t: "Shannon's Information Theory",
 s: "The paper that invented the bit",
 y: 1948, when: "1948",
 g: ["information theory", "entropy", "compression", "bell labs"],
 tldr: "Claude Shannon published a paper that separated information from meaning, gave it a unit — the bit — and proved that every communication channel has a maximum rate above which error-free transmission is impossible and below which it is always achievable. Compression, error correction, cryptography and the cross-entropy loss in your neural network all descend from it.",
 say: [
  "Shannon separated information from meaning: how surprising a message is, not what it says.",
  "It is where the word *bit* comes from, and where entropy as a measure of uncertainty comes from.",
  "The channel coding theorem says there is a hard limit to error-free throughput over a noisy channel — and that you can always get arbitrarily close to it.",
  "The same entropy shows up as cross-entropy loss in ML, which is not a coincidence — it is literally the same quantity."
 ],
 b: [
  { h: "The move" },
  { p: "Before 1948, *information* was not a quantity you could measure. Shannon, working at Bell Labs on the practical problem of transmitting signals reliably, made a decision that looked like a limitation and turned out to be the key: he threw away meaning entirely." },
  { q: "The fundamental problem of communication is that of reproducing at one point either exactly or approximately a message selected at another point. Frequently the messages have meaning… These semantic aspects of communication are irrelevant to the engineering problem.", by: "Claude Shannon, A Mathematical Theory of Communication (1948)" },
  { p: "What remains once you discard meaning is **surprise**. A message that was certain in advance carries no information. A message that was one of a million equally likely possibilities carries a great deal. Information is the reduction of uncertainty, and uncertainty can be measured." },

  { h: "Entropy" },
  { p: "Shannon defined the entropy of a source as the average surprise of its output, measured in bits — the term suggested to him by his colleague John Tukey, short for *binary digit*." },
  { l: [
   "A fair coin has one bit of entropy per flip: two equally likely outcomes, and you need exactly one yes/no question to determine which.",
   "A two-headed coin has zero entropy. You already know the answer, so the flip tells you nothing.",
   "A biased coin, 90% heads, has about 0.47 bits per flip. Less surprising, so less information — and therefore compressible."
  ] },
  { p: "That last point is the **source coding theorem**: entropy is the hard floor on lossless compression. You cannot compress a source below its entropy, and you can always get arbitrarily close. This is why your ZIP file stops shrinking, and why compressing an already-compressed file achieves nothing — the redundancy is gone." },
  { n: "The cross-entropy loss used to train essentially every classifier is Shannon's quantity applied to a model's predictions: how surprised is the model by the true label? A confident correct prediction has low surprise; a confident wrong one has enormous surprise, which is why the log of a near-zero probability blows up. KL divergence, used in variational inference and distillation, measures the extra bits wasted by believing the wrong distribution.",
    nt: "Why this is in your loss function" },

  { h: "The channel coding theorem" },
  { p: "The second major result is more surprising. Every noisy channel has a **capacity** — a maximum rate in bits per second. The theorem states that below capacity, arbitrarily reliable communication is possible: you can drive the error rate as close to zero as you like. Above capacity, you cannot." },
  { p: "The counterintuitive part is that error-free communication over a noisy channel is achievable at all. The intuition beforehand was that you fought noise by shouting louder or repeating yourself, trading throughput for reliability with no clean stopping point. Shannon proved that clever enough coding beats repetition, and told you exactly how far you could push it." },
  { p: "He did not, however, say how to build such a code. That took another fifty years — turbo codes in 1993 and the rediscovery of LDPC codes finally approached the Shannon limit in practice, and they are now in Wi-Fi, 5G and satellite links." },

  { h: "What it underpins now" },
  { l: [
   "**Compression** — ZIP, JPEG, MP3, video codecs. All of them are exploiting the gap between raw size and actual entropy.",
   "**Error correction** — the reason a scratched disc still plays, a QR code works when partly obscured, and RAID survives a failed drive.",
   "**Cryptography** — Shannon's later work formalised perfect secrecy and showed the one-time pad achieves it, at the cost of a key as long as the message.",
   "**Machine learning** — cross-entropy loss, KL divergence, information gain in decision trees, mutual information in feature selection.",
   "**Everything else** — modems, mobile networks, deep space communication with Voyager, and the fact that you can quantify a channel at all."
  ] }
 ],
 k: [
  "Information is surprise, measured in bits — meaning is deliberately excluded.",
  "Entropy is the hard floor on lossless compression, which is why compressed files stop shrinking.",
  "Every noisy channel has a capacity: below it, near-perfect transmission is achievable; above it, impossible.",
  "The cross-entropy in your loss function is the same quantity, applied to a model's predictions."
 ],
 r: ["Entropy", "KL Divergence", "Information Gain", "Cross-Entropy", "Probability", "Bandwidth and Latency", "Hashing", "Encryption"],
 src: [
  { t: "Shannon — A Mathematical Theory of Communication, Bell System Technical Journal (1948)", u: "https://people.math.harvard.edu/~ctm/home/text/others/shannon/entropy/entropy.pdf" }
 ]
},

{
 t: "AlexNet",
 s: "The afternoon deep learning stopped being a backwater",
 y: 2012, when: "September 2012",
 g: ["deep learning", "imagenet", "gpu", "convolutional"],
 tldr: "A convolutional network trained on two consumer graphics cards won the 2012 ImageNet competition with a top-5 error of 15.3%, against 26.2% for the next best entry. Nothing in it was conceptually new — CNNs dated to the 1980s. What was new was enough labelled data, enough GPU compute, and a handful of training tricks. The field changed direction within a year.",
 say: [
  "The margin is the story: about 10 percentage points better than second place, in a competition usually won by fractions.",
  "The ideas were old — LeCun had convolutional nets working on cheques in the 1990s. What changed was ImageNet plus two GTX 580s.",
  "It is the canonical example of the bitter lesson: general methods plus compute beat hand-engineered features.",
  "It is also why NVIDIA is worth what it is worth — that afternoon started the GPU-for-AI trajectory."
 ],
 b: [
  { h: "Before" },
  { p: "Computer vision in 2011 was a discipline of hand-designed features. You built SIFT or HOG descriptors, encoded them, and fed the result to a classifier such as an SVM. Progress came from cleverer features designed by researchers who understood images. Neural networks were a minority interest, widely regarded as an idea that had been tried and had underdelivered." },
  { p: "Two things had quietly changed. Fei-Fei Li's group had built **ImageNet** — around 1.2 million labelled training images across 1,000 categories, an order of magnitude beyond what was previously available. And GPUs had become programmable general-purpose processors through CUDA." },

  { h: "The result" },
  { p: "Alex Krizhevsky, Ilya Sutskever and Geoffrey Hinton entered the 2012 ImageNet Large Scale Visual Recognition Challenge with a deep convolutional network of eight learned layers and around 60 million parameters." },
  { l: [
   "**AlexNet top-5 error: 15.3%.** Second place, using conventional methods: 26.2%.",
   "Trained on two NVIDIA GTX 580 cards with 3GB each — consumer gaming hardware — for roughly five to six days.",
   "The network was split across the two GPUs because it did not fit on one, an implementation constraint that shows up in the architecture diagram."
  ] },
  { n: "In a benchmark where the year's winner typically improved on the last by a point or two, a ten-point jump was not an incremental result. It was immediately obvious to everyone in the room that the approach was different in kind, and the following year's competition was dominated by deep networks.",
    nt: "Why the margin mattered more than the number" },

  { h: "What was actually new" },
  { p: "Very little, individually. The contribution was the combination, and the engineering to make it train at all." },
  { l: [
   "**ReLU activations** instead of tanh or sigmoid. Non-saturating, so gradients survive depth, and several times faster to train.",
   "**Dropout** in the fully connected layers — randomly zeroing units during training to prevent co-adaptation. With 60 million parameters and 1.2 million images, overfitting was the binding constraint.",
   "**Data augmentation** — random crops, horizontal flips and colour jitter, multiplying the effective dataset for free.",
   "**GPU training**, hand-written in CUDA, which is what made a network this size trainable in days rather than months.",
   "**Overlapping max pooling** and local response normalisation, the latter of which was subsequently dropped by nearly everyone."
  ] },
  { p: "The convolutional architecture itself came from Yann LeCun's work in the late 1980s and 1990s, which had been reading handwritten cheques commercially for years. The theory was not the bottleneck. Data and compute were." },

  { h: "What followed" },
  { p: "The pivot was fast. By 2013 the competition was almost entirely deep learning; by 2015, ResNet's 152 layers reached 3.6% top-5 error, below typical human performance on the task. Feature engineering as a research programme largely ended in vision." },
  { p: "Three consequences reach beyond vision:" },
  { l: [
   "**Transfer learning became routine.** A network trained on ImageNet learned general visual features in its early layers, so anyone could fine-tune it on a few thousand domain images. This is why small teams can do vision at all.",
   "**GPUs became AI infrastructure.** NVIDIA's decision to invest in CUDA and then in AI-specific hardware traces directly to this period.",
   "**The bitter lesson.** Rich Sutton's later essay argues that general methods leveraging computation consistently beat approaches encoding human knowledge about the domain. AlexNet is the canonical example, and the same argument would repeat with transformers."
  ] }
 ],
 k: [
  "The ideas were decades old; data and compute were the binding constraints.",
  "A large margin on a benchmark is a stronger signal than a small improvement, because it indicates a different approach rather than better tuning.",
  "Pretrained features transfer, which is what made deep learning accessible outside large labs.",
  "General methods plus compute have repeatedly beaten hand-engineered domain knowledge."
 ],
 r: ["Convolutional Neural Network", "ImageNet", "ReLU", "Dropout", "Data Augmentation", "GPU", "Transfer Learning", "Overfitting"],
 src: [
  { t: "Krizhevsky, Sutskever & Hinton — ImageNet Classification with Deep Convolutional Neural Networks (NeurIPS 2012)", u: "https://papers.nips.cc/paper_files/paper/2012/hash/c399862d3b9d6b76c8436e924a68c45b-Abstract.html" },
  { t: "Rich Sutton — The Bitter Lesson (2019)", u: "http://www.incompleteideas.net/IncIdeas/BitterLesson.html" }
 ]
},

{
 t: "Attention Is All You Need",
 s: "The paper that removed recurrence",
 y: 2017, when: "June 2017",
 g: ["transformer", "attention", "parallelism", "nlp"],
 tldr: "Eight researchers at Google published an architecture for machine translation that discarded recurrence and convolution entirely, using only attention and feed-forward layers. The practical consequence was that a sequence model could finally be trained in parallel across its whole length rather than one step at a time — which is what made training on thousands of GPUs worthwhile, and therefore made everything that followed possible.",
 say: [
  "The point is not that attention is smarter than recurrence — it is that attention parallelises and recurrence does not.",
  "An RNN has to process token 1 before token 2; a transformer sees the whole sequence at once, so you can actually saturate a GPU cluster.",
  "It was written as a translation paper. The authors did not frame it as a general architecture for everything.",
  "BERT, GPT, vision transformers and AlphaFold's attention modules all descend from it — it is the substrate of the current era."
 ],
 b: [
  { h: "The bottleneck it removed" },
  { p: "Sequence models before 2017 were recurrent. An LSTM processes a sentence one token at a time, carrying a hidden state forward. That creates two problems." },
  { l: [
   "**No parallelism along the sequence.** Step 50 depends on step 49. A GPU with thousands of cores sits mostly idle while a sentence is processed serially, so throwing hardware at training helps far less than it should.",
   "**Long-range dependencies degrade.** Information from token 3 reaching token 300 must survive 297 successive transformations. LSTMs mitigated this with gating; they did not solve it."
  ] },
  { p: "Attention had already been added to recurrent encoder-decoder models in 2014 and 2015, letting the decoder look back at any encoder position rather than relying on a single fixed summary vector. It worked well. The 2017 paper's move was to notice that if attention was doing the useful work, the recurrence could simply be deleted." },

  { h: "What the architecture does" },
  { p: "Self-attention computes, for every token, a weighted combination of every other token in the sequence. The weights come from learned query, key and value projections: each token emits a query describing what it is looking for, every token emits a key describing what it offers, and the match between them decides how much of each token's value is mixed in." },
  { l: [
   "Every position attends to every other position **in one operation**, so the path length between any two tokens is constant rather than proportional to their distance.",
   "The whole thing is matrix multiplication, which is exactly what GPUs are built for.",
   "**Multi-head attention** runs several attention operations in parallel with different projections, so different heads can specialise — some track syntax, some track coreference.",
   "Because there is no recurrence, the model has no inherent notion of order, so **positional encodings** are added to the input embeddings to supply it."
  ] },
  { n: "The cost is that attention is quadratic in sequence length: doubling the context quadruples the computation. Recurrence was linear. The trade was accepted because parallelism mattered more than asymptotics at the sequence lengths of 2017 — and the entire subsequent industry of long-context techniques, from sparse attention to FlashAttention, exists to manage that quadratic term.",
    nt: "The tradeoff they accepted" },

  { h: "How far it travelled" },
  { p: "The paper reported state-of-the-art results on English-to-German and English-to-French translation at a fraction of the training cost of the previous best models. That alone would have been a good paper. What happened next was disproportionate." },
  { tl: [
    { t: "2018", d: "BERT uses the encoder stack with masked-language pretraining and resets the state of the art across most NLP benchmarks. GPT uses the decoder stack for generative pretraining." },
    { t: "2019–2020", d: "GPT-2 and GPT-3 scale the decoder-only architecture, and scaling laws suggest performance improves predictably with parameters, data and compute." },
    { t: "2020–2021", d: "Vision Transformers apply the same architecture to image patches and match or beat convolutional networks. AlphaFold 2 uses attention for protein structure." },
    { t: "2022 onwards", d: "Essentially all frontier models — language, image, audio, multimodal — are transformer-based." }
  ] },
  { p: "The reason it generalised is that self-attention makes very few assumptions about its input. A convolution assumes spatial locality; a recurrent net assumes sequential order. Attention assumes only that the input is a set of things that might relate to each other. Give it image patches, amino acids or audio frames and the machinery is unchanged." },
  { n: "This is the bitter lesson again. Convolutions encode a genuinely true fact about images — nearby pixels are related — and that inductive bias helps enormously when data is limited. With enough data, a model that assumes less and learns the structure from scratch wins. Vision transformers underperform CNNs on small datasets and beat them on large ones.",
    nt: "Fewer assumptions, more data" }
 ],
 k: [
  "The breakthrough was parallelism, not intelligence — attention lets you use the hardware you already have.",
  "Constant path length between any two positions is what fixed long-range dependencies.",
  "Attention is quadratic in sequence length, which is the constraint the whole long-context field works around.",
  "It generalised because it assumes almost nothing about the input beyond it being a set of related elements."
 ],
 r: ["Transformer", "Attention Mechanism", "Self-Attention", "Positional Encoding", "Recurrent Neural Network", "BERT", "GPT", "Large Language Model"],
 src: [
  { t: "Vaswani et al. — Attention Is All You Need (NeurIPS 2017)", u: "https://arxiv.org/abs/1706.03762" },
  { t: "Jay Alammar — The Illustrated Transformer", u: "https://jalammar.github.io/illustrated-transformer/" }
 ]
},

{
 t: "AlphaGo's Move 37",
 s: "The move no human would have played",
 y: 2016, when: "March 2016",
 g: ["reinforcement learning", "search", "self-play", "deepmind"],
 tldr: "Go was expected to resist computers for another decade because its branching factor defeats brute-force search and positions are notoriously hard to evaluate. In March 2016 AlphaGo beat Lee Sedol 4–1 in Seoul. In game two it played a move on the fifth line that professional commentators initially called a mistake; AlphaGo estimated the chance a human would play it at about one in ten thousand. It won the game, and the move is now studied.",
 say: [
  "Go was considered a decade away because the search space is astronomically larger than chess and positions resist evaluation.",
  "The combination was policy and value networks guiding Monte Carlo tree search — learned intuition narrowing the search, not brute force.",
  "Move 37 is the famous one because it was genuinely novel, not just strong — professionals thought it was an error until it wasn't.",
  "Lee Sedol won game four with his own brilliant move, and later retired citing AI as a reason."
 ],
 b: [
  { h: "Why Go was hard" },
  { p: "Deep Blue beat Kasparov at chess in 1997 largely through search: evaluate enormous numbers of positions with a hand-crafted evaluation function. That approach does not transfer to Go." },
  { l: [
   "Chess has roughly 35 legal moves per position; Go has around 250, over a game roughly twice as long. The search tree is vastly larger.",
   "Chess positions can be evaluated tolerably by counting material. In Go, all stones are identical and value comes from shape, influence and territory that may not resolve for a hundred moves.",
   "Professional players describe much of their judgement as intuition — recognising that a position *feels* strong without being able to enumerate why."
  ] },
  { p: "Before AlphaGo, the strongest programs used Monte Carlo tree search with random playouts and were around strong amateur level. The consensus estimate for professional-level play was a decade or more away." },

  { h: "What DeepMind built" },
  { p: "AlphaGo combined learned evaluation with search rather than replacing one with the other." },
  { l: [
   "A **policy network**, trained first on around 30 million positions from human games, predicting which move a strong player would make. This narrows the search from 250 candidate moves to a handful worth considering.",
   "A **value network**, predicting the probability of winning from a given position — supplying the positional judgement that hand-crafted evaluation could not.",
   "**Monte Carlo tree search**, using both networks to decide where to spend search effort, so it explores deeply along promising lines rather than uniformly.",
   "**Self-play reinforcement learning**, improving the networks by playing against versions of itself, beyond what the human game corpus could teach."
  ] },

  { h: "Seoul, March 2016" },
  { tl: [
    { t: "Game 1", d: "AlphaGo wins. Lee Sedol, who had predicted a 5–0 or 4–1 victory for himself, is visibly surprised." },
    { t: "Game 2, move 37", d: "AlphaGo plays a shoulder hit on the fifth line. Commentators assume a mistake — the move violates conventional opening principles. It proves decisive far later in the game. AlphaGo wins." },
    { t: "Game 3", d: "AlphaGo wins, taking the match 3–0." },
    { t: "Game 4, move 78", d: "Lee plays a wedge later called the *God move*. AlphaGo's evaluation degrades sharply and it plays several weak moves. Lee wins — the only human victory against this version." },
    { t: "Game 5", d: "AlphaGo wins. Final score 4–1." }
  ] },
  { q: "I thought AlphaGo was based on probability calculation and it was merely a machine. But when I saw this move I changed my mind. Surely AlphaGo is creative.", by: "Lee Sedol, on move 37" },
  { n: "AlphaGo's own estimate was that a human player would choose move 37 with probability around 1 in 10,000. It played it because its value network judged the resulting position favourably, not because it resembled anything in the human corpus. This is what made it philosophically interesting: it was not imitating strong play, it had found something outside it.",
    nt: "One in ten thousand" },

  { h: "What came after" },
  { p: "**AlphaGo Zero** (2017) removed human games entirely, learning from self-play alone starting from the rules. It surpassed the version that beat Lee Sedol within days and was stronger than every previous version. Removing the human data made it better — the human corpus had been a floor and also a ceiling." },
  { p: "**AlphaZero** generalised the same method to chess and shogi, and its chess play was described by grandmasters as strikingly different from engine play — willing to sacrifice material for long-term positional advantage in ways conventional engines would not evaluate favourably." },
  { p: "The Go community absorbed the lessons rather than retreating. Opening theory changed; moves previously considered bad were re-examined and adopted. Professional players train against AI, and the general standard of play has risen." },
  { p: "Lee Sedol retired from professional play in 2019, saying that with AI as an entity that cannot be defeated, he no longer saw himself as reaching the top even if he became the best human player." }
 ],
 k: [
  "Learned evaluation narrows a search space that brute force cannot cover.",
  "Self-play removes the ceiling imposed by imitating human data — and removing human data entirely made it stronger.",
  "Novel-but-correct output is what makes a system feel creative rather than merely strong.",
  "Superhuman at one task says nothing about generality — AlphaGo could not play anything else."
 ],
 r: ["Reinforcement Learning", "Monte Carlo Method", "Neural Network", "Self-Supervised Learning", "Markov Decision Process", "Overfitting", "Gradient Descent"],
 src: [
  { t: "Silver et al. — Mastering the game of Go with deep neural networks and tree search, Nature (2016)", u: "https://www.nature.com/articles/nature16961" },
  { t: "AlphaGo — DeepMind", u: "https://deepmind.google/research/breakthroughs/alphago/" }
 ]
},

{
 t: "The ChatGPT Moment",
 s: "The interface was the breakthrough",
 y: 2022, when: "30 November 2022",
 g: ["llm", "product", "rlhf", "adoption"],
 tldr: "OpenAI released a chat interface to a fine-tuned GPT-3.5 as what it described as a low-key research preview. It reached roughly a million users in five days and around a hundred million monthly users in two months. The underlying model was not new — GPT-3 had been available through an API since 2020. What changed was instruction tuning, a conversational interface and free access, which turned a capability that already existed into something anyone could use.",
 say: [
  "The model wasn't new — GPT-3 had been public for two years. The chat interface and RLHF tuning were what changed.",
  "It is the clearest recent example of distribution and interface mattering more than raw capability.",
  "The term for the gap is capability overhang: the ability existed and nobody had packaged it usably.",
  "It triggered a genuine strategic scramble — Google declared an internal code red within weeks."
 ],
 b: [
  { h: "What already existed" },
  { p: "GPT-3 was announced in mid-2020 and available through an API. It could already write code, summarise, translate and hold a conversation of sorts. It was used by developers, startups and researchers, and it was largely invisible to everyone else." },
  { p: "The problem was that a raw language model is a text completer, not an assistant. Given *write me an email to my landlord*, a base model might continue with a list of similar requests, because that is a plausible continuation of that text. Getting useful behaviour required prompt engineering — few-shot examples, careful framing, and a mental model of what the thing actually does." },

  { h: "What changed" },
  { l: [
   "**Instruction tuning and RLHF.** InstructGPT, published in early 2022, fine-tuned the model on demonstrations of following instructions, then used reinforcement learning from human feedback to prefer helpful answers. This converts a completer into something that responds to requests.",
   "**A chat interface.** Turn-taking, conversation history, and a text box. No API key, no parameters, no system prompt to design. The interaction model was one everyone already understood from messaging.",
   "**Free and public.** No waiting list, no cost, no approval process.",
   "**Refusals and guardrails**, which made a public release defensible in a way that a raw base model would not have been."
  ] },
  { n: "None of this increased what the model could do. GPT-3.5 was an incremental improvement on GPT-3 at best. The step change was in what people could *get it to do*, which turns out to be a completely different quantity — and one that engineering culture systematically underweights.",
    nt: "Capability versus accessibility" },

  { h: "The adoption curve" },
  { tl: [
    { t: "30 Nov 2022", d: "Released as a research preview. OpenAI staff have described internal expectations as modest." },
    { t: "5 Dec 2022", d: "Over one million users." },
    { t: "Dec 2022", d: "Google reportedly declares an internal code red over the threat to search." },
    { t: "Jan 2023", d: "Estimated around 100 million monthly active users — reported at the time as the fastest-growing consumer application on record." },
    { t: "Feb–Mar 2023", d: "Microsoft integrates the technology into Bing; Google announces Bard; GPT-4 is released." },
    { t: "Through 2023", d: "*Prompt engineering* enters general vocabulary; enterprise AI strategy becomes a board-level topic almost universally." }
  ] },

  { h: "What engineers should take from it" },
  { l: [
   "**Capability overhang is real.** There is usually a gap between what a technology can do and what anyone has packaged it to do. That gap is a product problem, and it can be worth more than years of capability research.",
   "**The interface is not a wrapper.** *It is just a UI on an API* was a common dismissal at the time, and it was exactly backwards. The interface was the innovation.",
   "**Fluency is not accuracy.** RLHF optimises for responses humans rate highly, which correlates with being helpful and also with sounding confident. Confident wrong answers are a direct consequence of the training objective, not an incidental bug.",
   "**Distribution compounds.** Free public access generated the usage data and the feedback loop that improved subsequent models, which is a durable advantage that capability alone does not confer."
  ] },
  { p: "The historical parallel usually drawn is the graphical user interface. Everything Xerox PARC demonstrated existed before the Macintosh shipped; the machine that made it usable is the one that changed the industry. Whether that comparison holds is still being argued, which is itself a reasonable thing to say about it." }
 ],
 k: [
  "The capability existed for two years; the interface is what created the adoption.",
  "RLHF converted a text completer into something that follows instructions — that is the technical change.",
  "Optimising for responses humans rate well produces confident answers, correct or not.",
  "Free public distribution creates a data feedback loop that capability alone does not."
 ],
 r: ["Large Language Model", "GPT", "RLHF", "Fine-Tuning", "Prompt Engineering", "Hallucination", "Instruction Tuning", "Transformer"],
 src: [
  { t: "OpenAI — Introducing ChatGPT (November 2022)", u: "https://openai.com/index/chatgpt/" },
  { t: "Ouyang et al. — Training language models to follow instructions with human feedback (InstructGPT, 2022)", u: "https://arxiv.org/abs/2203.02155" }
 ]
},

{
 t: "Dijkstra's 'Go To Statement Considered Harmful'",
 s: "The letter that changed how we write code",
 y: 1968, when: "March 1968",
 g: ["structured programming", "control flow", "cs theory", "dijkstra"],
 tldr: "Edsger Dijkstra wrote a short letter to the editor of Communications of the ACM arguing that the GOTO statement should be abolished from high-level programming languages because it made programs nearly impossible to reason about. The letter ignited a decade-long debate, but its position won: structured programming — using only sequence, selection and iteration — became the default, and GOTO effectively vanished from mainstream practice. The phrase 'considered harmful' became a genre of its own.",
 say: [
  "The argument: GOTO lets execution jump anywhere, which means the relationship between the program text and the program's state at any point becomes intractable.",
  "Structured programming replaced it with three constructs: sequence, selection (if/else), and iteration (while/for). These are sufficient for any computation.",
  "The phrase 'considered harmful' has been applied to everything from semicolons to microservices — it became a meme before memes existed.",
  "Dijkstra did not actually title the letter that. The editor, Niklaus Wirth, changed 'A Case Against the GO TO Statement' to the more provocative title."
 ],
 b: [
  { h: "The problem with GOTO" },
  { p: "In the 1960s, most programming was done in assembly or in early high-level languages where GOTO was the primary control flow mechanism. A program was a sequence of labelled statements, and GOTO could jump to any label — forward, backward, into or out of loops." },
  { p: "Dijkstra's observation was precise: the quality of a programmer's reasoning about a program depends on the relationship between the static text of the program and the dynamic process it generates. With structured control flow, you can point at a line and know roughly where you are in the computation. With unrestricted GOTO, you cannot, because execution could have arrived from anywhere." },
  { q: "The go to statement as it stands is just too primitive; it is too much an invitation to make a mess of one's program.", by: "Edsger Dijkstra, Go To Statement Considered Harmful (1968)" },

  { h: "The structured programming theorem" },
  { p: "Böhm and Jacopini had already proved in 1966 that any program using GOTO can be rewritten using only three structures:" },
  { l: [
   "**Sequence** — execute statements in order.",
   "**Selection** — if/else branching.",
   "**Iteration** — while/for loops."
  ] },
  { p: "These three are sufficient to express any computable function. Dijkstra's argument was not just that GOTO was unnecessary, but that it was actively harmful — it invited error by making the relationship between code and computation opaque." },
  { n: "The debate was fierce. Donald Knuth wrote a nuanced response in 1974 ('Structured Programming with go to Statements') arguing that some uses of GOTO produced clearer code than the structured alternatives — particularly for error handling and breaking out of nested loops. Most modern languages settled this by providing constrained jumps: break, continue, return, and exceptions. These are GOTOs with restrictions that preserve the ability to reason about control flow.",
    nt: "Knuth's counterpoint" },

  { h: "What it changed" },
  { l: [
   "Structured programming became the default paradigm. New languages (Pascal, C, and every language since) were designed around structured control flow.",
   "Code became reasonably analysable — you can trace execution through a structured program without considering every possible jump.",
   "The principle extends: the argument against GOTO generalises to any construct that makes it hard to relate the text of a program to its execution. Unrestricted mutation, callback hell and deeply nested conditionals are all the same category of problem.",
   "The title format 'X Considered Harmful' became the most imitated pattern in computer science writing."
  ] }
 ],
 k: [
  "The ability to reason about a program depends on the relationship between the static text and the dynamic execution.",
  "Sequence, selection and iteration are sufficient for any computation — GOTO adds power that makes programs harder to understand without enabling anything new.",
  "Constrained jumps (break, continue, return, exceptions) are the compromise: they allow necessary escapes without destroying structure.",
  "The principle generalises: any construct that breaks the text-to-execution mapping makes programs harder to verify."
 ],
 r: ["Algorithm", "Recursion", "Compiler", "Code Review", "Refactoring", "Formal Verification"],
 src: [
  { t: "Dijkstra — Go To Statement Considered Harmful, Communications of the ACM (1968)", u: "https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf" },
  { t: "Knuth — Structured Programming with go to Statements (1974)", u: "https://dl.acm.org/doi/10.1145/356635.356640" }
 ]
},

{
 t: "The Turing Machine",
 s: "The theoretical foundation of all computation",
 y: 1936, when: "1936",
 g: ["computability", "theory", "halting problem", "turing"],
 tldr: "Alan Turing, a 23-year-old Cambridge mathematician, described an abstract machine — a tape, a head, a state table — and proved that some problems are fundamentally unsolvable by any mechanical process. The machine was a thought experiment to resolve a question in mathematical logic, but it turned out to define what computation itself means. Every computer ever built, from mainframes to smartphones to GPUs, is equivalent to Turing's imaginary machine.",
 say: [
  "A Turing machine is absurdly simple: an infinite tape, a read/write head, a finite set of states, and a transition table. That is provably enough for any computation.",
  "The halting problem is the famous result: you cannot write a program that decides, for all programs, whether they will finish or run forever.",
  "The Church-Turing thesis says anything that can be computed by any physical process can be computed by a Turing machine. It is an empirical claim, not a theorem, and nothing has contradicted it.",
  "Turing was 23 when he wrote the paper, which also happened to define the theoretical basis for the computer science degree you are studying."
 ],
 b: [
  { h: "The question" },
  { p: "David Hilbert had posed the *Entscheidungsproblem* (decision problem): is there a mechanical procedure that can determine the truth or falsehood of any mathematical statement? Turing needed to define what 'mechanical procedure' meant before he could answer, so he invented the machine." },

  { h: "The machine" },
  { p: "A Turing machine consists of:" },
  { l: [
   "**An infinite tape** divided into cells, each containing a symbol from a finite alphabet.",
   "**A head** that reads and writes symbols on the tape and moves left or right, one cell at a time.",
   "**A state register** holding the current state, from a finite set.",
   "**A transition function** that, given the current state and the symbol under the head, specifies: the symbol to write, the direction to move, and the next state."
  ] },
  { x: { lang: "text", code:
"Example: A machine that adds 1 to a binary number\n\nTape:  ... _ 1 0 1 1 _ ...\n                     ^\n                   head\n\nState   Read   Write   Move   Next State\nSTART   1      0       Left   CARRY\nSTART   0      1       Left   DONE\nCARRY   1      0       Left   CARRY\nCARRY   0      1       Left   DONE\nCARRY   _      1       Left   DONE\n\nResult: ... _ 1 1 0 0 _ ..." } },
  { p: "This is not meant to be practical. It is meant to capture the essence of what computation is, stripped to the absolute minimum. Every programming language, every CPU architecture, every model of computation anyone has ever proposed turns out to compute exactly the same class of functions as this machine." },

  { h: "The halting problem" },
  { p: "Turing proved that there exists no Turing machine H that can correctly decide, for every machine M and input I, whether M halts on I. The proof is a diagonal argument:" },
  { l: [
   "Assume H(M, I) exists and correctly returns HALTS or LOOPS for any M and I.",
   "Construct a new machine D that, given M, runs H(M, M) — feeding the machine its own description as input.",
   "If H says M halts on itself, D loops forever. If H says M loops on itself, D halts.",
   "Now run D on itself: D(D). If H says D halts, D loops. If H says D loops, D halts. Contradiction."
  ] },
  { n: "The halting problem is not an engineering limitation — it is a mathematical impossibility. No amount of compute, no cleverer algorithm, no future technology can solve it in general. It means there are questions about programs that no program can answer. This is why your compiler can catch syntax errors but cannot tell you whether your code will terminate.",
    nt: "Not hard — impossible" },

  { h: "Why it matters for your degree" },
  { l: [
   "**Computability theory.** The classes of problems that can and cannot be solved by any algorithm are defined relative to Turing machines.",
   "**Complexity theory.** P, NP, NP-completeness — all defined in terms of Turing machine time and space.",
   "**The Church-Turing thesis.** Any reasonable model of computation (lambda calculus, register machines, cellular automata, your laptop) computes the same class of functions.",
   "**Practical undecidability.** Rice's theorem generalises the halting problem: no non-trivial property of a program's behaviour can be decided in general. Perfect static analysis is mathematically impossible.",
   "**Universal Turing machine.** Turing also described a machine that takes the description of any other machine as input and simulates it — the theoretical basis of the stored-program computer and the interpreter."
  ] }
 ],
 k: [
  "A Turing machine defines computation: an infinite tape, a head, a finite state table. That is provably enough.",
  "The halting problem is undecidable — no program can decide for all programs whether they terminate.",
  "The Church-Turing thesis: everything physically computable is Turing-computable. No counterexample exists.",
  "Rice's theorem: no non-trivial semantic property of programs is decidable in general."
 ],
 r: ["Algorithm", "Time Complexity", "Big O Notation", "Recursion", "Compiler", "Formal Verification"],
 src: [
  { t: "Turing — On Computable Numbers, with an Application to the Entscheidungsproblem (1936)", u: "https://www.cs.virginia.edu/~robins/Turing_Paper_1936.pdf" }
 ]
},

{
 t: "Diffie-Hellman Key Exchange",
 s: "Public-key cryptography was born here",
 y: 1976, when: "1976",
 g: ["cryptography", "key exchange", "public key", "mathematics"],
 tldr: "Whitfield Diffie and Martin Hellman published a paper describing how two people could agree on a shared secret over a public channel without ever having met. The mathematical trick — modular exponentiation where the forward operation is easy but the inverse (discrete logarithm) is computationally infeasible — broke the fundamental assumption that secret communication required a pre-shared key. HTTPS, SSH, TLS, VPNs and every secure channel on the internet descend from this idea.",
 say: [
  "Before 1976, encryption required both parties to already share a secret key. The key distribution problem was the bottleneck — how do you get the key there securely?",
  "Diffie-Hellman solved it: two parties can compute a shared secret by exchanging public values, and an eavesdropper who sees everything cannot derive the secret.",
  "The mathematical basis is that modular exponentiation is easy to compute but the discrete logarithm is believed to be computationally infeasible.",
  "It underpins HTTPS, SSH, TLS and essentially every secure communication channel on the internet."
 ],
 b: [
  { h: "The key distribution problem" },
  { p: "Symmetric encryption — where the same key encrypts and decrypts — has been used for thousands of years. The fundamental problem is always the same: both parties need the key. If they could meet in person, they could exchange it. But if they were communicating over a distance — or had never met — how do they establish a shared secret without an eavesdropper learning it?" },
  { p: "Diffie and Hellman's breakthrough was showing that this was solvable mathematically, without a trusted courier." },

  { h: "How it works" },
  { p: "The mechanism relies on a one-way function: modular exponentiation." },
  { x: { lang: "text", code:
"Public parameters: a prime p and a generator g\n\nAlice:                         Bob:\n  Picks secret a                 Picks secret b\n  Computes A = g^a mod p         Computes B = g^b mod p\n  Sends A to Bob ───────────►\n                    ◄──────────── Sends B to Alice\n  Computes s = B^a mod p         Computes s = A^b mod p\n\nBoth compute: s = g^(ab) mod p\n\nEve sees: p, g, A, B\nTo find s, she needs a or b\nThat requires computing the discrete logarithm\nWhich is (believed to be) computationally infeasible" } },
  { l: [
   "**Forward direction (easy).** Computing g^a mod p is efficient even for very large numbers — square-and-multiply takes O(log a) multiplications.",
   "**Reverse direction (hard).** Given g^a mod p, finding a requires solving the discrete logarithm problem, for which no efficient classical algorithm is known.",
   "**The shared secret.** Alice computes B^a = (g^b)^a = g^(ab) mod p. Bob computes A^b = (g^a)^b = g^(ab) mod p. They arrive at the same value without either transmitting their secret."
  ] },
  { n: "This is the mathematical foundation of HTTPS. When your browser connects to a website, a variant of Diffie-Hellman (usually ECDHE — Elliptic Curve Diffie-Hellman Ephemeral) runs to establish a session key. That key encrypts the connection. The server's certificate proves identity (via RSA or ECDSA), but the session key comes from Diffie-Hellman. This is why forward secrecy works: even if the server's private key is later compromised, past session keys cannot be recovered because they were ephemeral.",
    nt: "This runs every time you open HTTPS" },

  { h: "What followed" },
  { tl: [
    { t: "1976", d: "Diffie and Hellman publish 'New Directions in Cryptography'." },
    { t: "1977", d: "Rivest, Shamir and Adleman publish RSA — the first practical public-key encryption system." },
    { t: "1985", d: "Elliptic curve cryptography proposed (Miller, Koblitz), enabling the same security with smaller keys." },
    { t: "1994", d: "SSL (later TLS) makes HTTPS possible, using DH for key exchange." },
    { t: "1997", d: "GCHQ declassifies that James Ellis and Clifford Cocks had independently discovered public-key cryptography in 1970–1973, but it remained classified." }
  ] },

  { h: "For your CS courses" },
  { l: [
   "**Number theory matters.** Modular arithmetic, prime numbers, group theory — this is where they have direct engineering impact.",
   "**Computational hardness is a feature.** The security relies on the assumed difficulty of the discrete logarithm. If someone finds an efficient algorithm, the system breaks.",
   "**Quantum threat.** Shor's algorithm can solve discrete logarithms efficiently on a quantum computer. Post-quantum cryptography research is developing alternatives that resist quantum attacks.",
   "**Perfect forward secrecy.** Using ephemeral DH keys per session means compromising a long-term key does not unlock past traffic."
  ] }
 ],
 k: [
  "Key exchange over a public channel is possible because modular exponentiation is easy but the discrete logarithm is hard.",
  "Diffie-Hellman solved the key distribution problem that had constrained cryptography for millennia.",
  "HTTPS, SSH and TLS all use DH variants for session key establishment.",
  "Quantum computers threaten DH — post-quantum alternatives are being standardised now."
 ],
 r: ["Public-Key Cryptography", "Encryption", "TLS", "SSH", "Hashing", "Authentication"],
 src: [
  { t: "Diffie & Hellman — New Directions in Cryptography, IEEE (1976)", u: "https://ieeexplore.ieee.org/document/1055638" }
 ]
},

{
 t: "Google Spanner",
 s: "Globally consistent, and they synchronised the clocks",
 y: 2012, when: "2012",
 g: ["distributed database", "consistency", "truetime", "google"],
 tldr: "Google built Spanner, a globally distributed database that provides external consistency — the strongest guarantee available — across data centres on different continents. The conventional wisdom, informed by the CAP theorem, was that you had to choose between consistency and availability at global scale. Spanner challenged that by using synchronised atomic clocks and GPS receivers to bound clock uncertainty, turning a distributed systems problem into a hardware problem. It is the database behind Google's most critical services.",
 say: [
  "Spanner is externally consistent at global scale — transactions are serialisable and real-time ordered across continents.",
  "The trick is TrueTime: atomic clocks and GPS in every data centre give a bounded uncertainty interval for the current time.",
  "Commits wait out the uncertainty interval before becoming visible, which guarantees ordering. The cost is latency proportional to clock uncertainty.",
  "It challenged the practical interpretation of CAP: you can have strong consistency at global scale if you invest enough in clock infrastructure."
 ],
 b: [
  { h: "The problem" },
  { p: "Google needed a database for critical systems (AdWords, Google Play) that was globally distributed for latency and availability, yet provided strong transactional guarantees. The existing options required choosing:" },
  { l: [
   "**Strong consistency, single region.** Traditional databases provide serialisable transactions but do not span continents.",
   "**Global distribution, weak consistency.** Dynamo-style systems span regions but offer only eventual consistency.",
   "**Spanner's claim.** Strong consistency at global scale. The cost is paid in latency (commit delays) and infrastructure (atomic clocks)."
  ] },

  { h: "TrueTime" },
  { p: "The fundamental problem in distributed systems is that clocks on different machines drift. You cannot determine the order of events on different machines by comparing timestamps if the clocks might be wrong." },
  { p: "Google's solution was hardware. Every Spanner data centre has redundant atomic clocks and GPS receivers. The TrueTime API does not return a timestamp — it returns an interval:" },
  { x: { lang: "text", code:
"TrueTime.now() → [earliest, latest]\n\nThe actual time is guaranteed to be within the interval.\nTypical uncertainty: about 1-7 milliseconds.\n\nCommit protocol:\n  1. Assign timestamp to transaction\n  2. Wait until TrueTime guarantees the timestamp\n     is in the past: wait for 'latest' to pass\n  3. Only then make the transaction visible\n\nThis wait (called 'commit-wait') is the price of\nexternal consistency. Smaller uncertainty = faster commits." } },
  { n: "This is the key insight: Spanner converts a distributed systems problem (ordering events without a global clock) into an engineering problem (making clocks accurate enough). The tighter the clock uncertainty, the shorter the commit-wait, the lower the latency. Google invested in custom atomic clock hardware specifically to make uncertainty small enough for this to be practical.",
    nt: "Clocks as infrastructure" },

  { h: "What external consistency means" },
  { l: [
   "If transaction T1 commits before transaction T2 starts (in real time, anywhere in the world), then T1 is ordered before T2 in the database.",
   "This is stronger than serialisability: it respects real-time ordering, not just some valid serial ordering.",
   "For the user: if you write data in the US and then read it in Asia, you see your write. Always. Not eventually — immediately."
  ] },

  { h: "What it changed" },
  { l: [
   "CockroachDB, YugabyteDB and TiDB are open-source databases inspired by Spanner's design, using software-based clock synchronisation (NTP/hybrid logical clocks) instead of atomic clocks.",
   "The paper reopened the CAP conversation: with enough clock infrastructure, the practical tradeoff between consistency and latency is more favourable than previously assumed.",
   "Cloud Spanner is available as a managed Google Cloud service, making the technology accessible outside Google.",
   "It demonstrated that hardware investment (custom clocks) can solve software problems (ordering) — an engineering approach that is unusual but effective."
  ] }
 ],
 k: [
  "External consistency at global scale is achievable if you solve the clock synchronisation problem with hardware.",
  "TrueTime returns an uncertainty interval, not a point — and commits wait out the uncertainty to guarantee ordering.",
  "The CAP tradeoff is practical, not absolute: better clocks reduce the consistency-latency tradeoff.",
  "Sometimes the right solution to a software problem is better hardware."
 ],
 r: ["Distributed System", "CAP Theorem", "ACID", "Consensus", "Replication", "Sharding", "Latency"],
 src: [
  { t: "Corbett et al. — Spanner: Google's Globally-Distributed Database (OSDI 2012)", u: "https://research.google/pubs/pub39966/" },
  { t: "Google Cloud — Cloud Spanner documentation", u: "https://cloud.google.com/spanner/docs" }
 ]
},

{
 t: "ResNet: Deep Residual Learning",
 s: "Skip connections solved the depth problem",
 y: 2015, when: "December 2015",
 g: ["deep learning", "computer vision", "skip connections", "imagenet"],
 tldr: "Deeper neural networks should be at least as good as shallower ones — a deeper network can always learn to copy the shallower one's weights and set the extra layers to identity. In practice, they degraded. Kaiming He and colleagues at Microsoft Research solved this by adding shortcut connections that let layers learn residual functions — the difference from identity — instead of the full transformation. ResNet trained networks with 152 layers, won ImageNet 2015 with 3.57% top-5 error (surpassing human performance on the benchmark), and the skip connection became the standard building block of deep learning.",
 say: [
  "The degradation problem: making a network deeper made it worse, even on training data. This was not overfitting — it was an optimisation failure.",
  "The fix was simple: add a shortcut connection from the input of a block to its output, so the layers learn the residual F(x) instead of the full mapping H(x) = F(x) + x.",
  "If the optimal transformation is close to identity, learning a small residual is easier than learning the full function from scratch.",
  "ResNet-152 achieved 3.57% top-5 error on ImageNet — better than typical human performance on the task."
 ],
 b: [
  { h: "The degradation problem" },
  { p: "By 2015, the trend was clear: deeper networks performed better. VGGNet (19 layers) beat AlexNet (8 layers). But past a certain depth, adding more layers made performance worse — not on the test set (which would indicate overfitting) but on the training set. The network could not learn the mapping." },
  { p: "This was surprising. A 56-layer network should be at least as good as a 20-layer one: the extra 36 layers could learn identity mappings and reproduce the 20-layer network's performance. In practice, they could not, because optimising a deep stack of nonlinear layers toward identity is difficult." },

  { h: "The residual block" },
  { p: "The solution was to explicitly make identity the default. Instead of asking a block to learn the mapping H(x), reroute the input around the block via a shortcut connection and ask the block to learn only the residual F(x) = H(x) − x." },
  { x: { lang: "text", code:
"Standard block:          Residual block:\n\n  x                        x ─────────────┐\n  │                        │               │\n  ▼                        ▼               │\n┌──────┐                ┌──────┐           │\n│ Conv │                │ Conv │           │\n│ BN   │                │ BN   │           │\n│ ReLU │                │ ReLU │           │\n│ Conv │                │ Conv │           │\n│ BN   │                │ BN   │           │\n└──────┘                └──┬───┘           │\n  │                        │               │\n  ▼                        ▼               │\n  H(x)                    F(x)  +  ◄──────┘\n                           │        (shortcut)\n                           ▼\n                        H(x) = F(x) + x" } },
  { l: [
   "If the optimal function is close to identity, F(x) is close to zero — which is easy for gradient descent to learn.",
   "The shortcut provides a direct gradient path from loss to early layers, alleviating the vanishing gradient problem.",
   "The shortcut adds no parameters and negligible computation — it is literally an addition.",
   "Blocks can be stacked to arbitrary depth because each block refines the representation rather than transforming it from scratch."
  ] },
  { n: "The skip connection is now ubiquitous. Transformers use residual connections around every attention and feed-forward block. U-Net uses them in medical imaging. DenseNet extends the idea to connect every layer to every other layer. The principle — make identity easy and let the network learn departures from it — is the most reusable architectural idea in modern deep learning.",
    nt: "It is everywhere now" },

  { h: "The results" },
  { tl: [
    { t: "Dec 2015", d: "ResNet paper submitted to CVPR. ResNet-152 achieves 3.57% top-5 error on ImageNet." },
    { t: "2015", d: "Wins ImageNet classification, detection and localisation, plus COCO detection and segmentation." },
    { t: "2016", d: "Becomes the default backbone for object detection (Faster R-CNN) and segmentation networks." },
    { t: "2017+", d: "Residual connections are adopted in transformers, generative models, reinforcement learning and essentially all deep architectures." }
  ] },
  { p: "The paper has over 200,000 citations. Kaiming He's initialisation scheme (He initialisation) is the other contribution from this line of work, and it is the default weight initialisation in most frameworks." }
 ],
 k: [
  "The degradation problem was not overfitting — it was an optimisation failure where deeper networks could not learn identity mappings.",
  "Skip connections make identity the default, so layers learn the residual — a small correction is easier to optimise than the full mapping.",
  "Direct gradient paths through shortcuts alleviate vanishing gradients and enable training hundreds of layers.",
  "The residual connection is the most reused architectural idea in deep learning — it appears in every major architecture since."
 ],
 r: ["Convolutional Neural Network", "Gradient Descent", "Backpropagation", "Batch Normalisation", "Transfer Learning", "ImageNet", "Overfitting"],
 src: [
  { t: "He et al. — Deep Residual Learning for Image Recognition (CVPR 2016)", u: "https://arxiv.org/abs/1512.03385" }
 ]
},

{
 t: "GANs: Generative Adversarial Networks",
 s: "Two networks, one competition, and fake data that looks real",
 y: 2014, when: "June 2014",
 g: ["generative model", "game theory", "adversarial", "deep learning"],
 tldr: "Ian Goodfellow proposed training two neural networks against each other: a generator that creates fake data and a discriminator that tries to tell real from fake. As the discriminator gets better at detecting fakes, the generator gets better at producing them. At equilibrium, the generator produces data indistinguishable from the real distribution. The idea was conceived during a discussion at a bar, implemented that night, and worked on the first try. It opened the era of high-quality generative models.",
 say: [
  "The generator makes fake data, the discriminator classifies real versus fake. They train simultaneously in a minimax game.",
  "At Nash equilibrium, the generator produces data from the true distribution and the discriminator cannot do better than chance.",
  "Goodfellow came up with the idea at a bar, went home, coded it, and it worked on the first run — possibly the best ROI on a night out in CS history.",
  "GANs made realistic image generation possible years before diffusion models — but they are notoriously hard to train (mode collapse, training instability)."
 ],
 b: [
  { h: "The idea" },
  { p: "Previous generative models (variational autoencoders, restricted Boltzmann machines) required explicit density estimation or approximate inference. Goodfellow's insight was that you could train a generative model without ever computing the density, by framing generation as a game." },
  { l: [
   "**Generator G** takes random noise z as input and produces a fake sample G(z).",
   "**Discriminator D** takes a sample (real or fake) and outputs the probability it is real.",
   "G tries to maximise D's error. D tries to minimise it. This is a minimax game."
  ] },
  { x: { lang: "text", code:
"min_G max_D V(D,G) = E[log D(x)] + E[log(1 - D(G(z)))]\n\n          Real data x          Noise z\n              │                    │\n              ▼                    ▼\n        ┌─────────┐          ┌─────────┐\n        │  Real   │          │Generator│\n        │ samples │          │    G    │\n        └────┬────┘          └────┬────┘\n             │                    │\n             ▼                    ▼\n        ┌────────────────────────────┐\n        │      Discriminator D      │\n        │   Real (1.0) or Fake (0)  │\n        └────────────────────────────┘\n\nD learns to distinguish → G learns to fool D\nAt equilibrium: D(G(z)) = 0.5 for all z" } },

  { h: "Why it was hard to train" },
  { p: "The minimax game is elegant in theory and unstable in practice." },
  { l: [
   "**Mode collapse.** The generator learns to produce only a few outputs that consistently fool the discriminator, ignoring the rest of the data distribution. The generated images may be realistic but not diverse.",
   "**Training instability.** If D gets too strong, G gets no useful gradient. If G gets too strong, D cannot learn. Balancing them requires careful hyperparameter tuning.",
   "**No convergence guarantee.** Unlike supervised learning with a clear loss to minimise, GAN training is a game. There is no guarantee of convergence to Nash equilibrium with gradient descent.",
   "**Evaluation is hard.** There is no single metric for 'how good are the generated samples'. FID (Fréchet Inception Distance) and IS (Inception Score) are proxies with known limitations."
  ] },
  { n: "The difficulty of training GANs drove an enormous amount of research: DCGAN established architectural best practices, WGAN introduced the Wasserstein distance for more stable gradients, Progressive GAN grew images from low to high resolution, and StyleGAN achieved photorealistic face generation. Each was a fix for a specific training pathology.",
    nt: "The research it spawned" },

  { h: "What it enabled" },
  { tl: [
    { t: "2014", d: "Original GAN paper. Generates blurry MNIST digits." },
    { t: "2016", d: "DCGAN establishes convolutional GAN architecture. Generates plausible bedroom images." },
    { t: "2017", d: "Pix2pix and CycleGAN demonstrate image-to-image translation (horse↔zebra, satellite→map)." },
    { t: "2018–2020", d: "StyleGAN generates photorealistic human faces. 'This person does not exist' goes viral." },
    { t: "2020+", d: "Diffusion models (DALL-E 2, Stable Diffusion) largely replace GANs for image generation, though GANs remain used for specific applications." }
  ] },
  { p: "GANs demonstrated that adversarial training could produce generative models of startling quality, and the adversarial principle — training against an opponent — now appears in domain adaptation, data augmentation, robustness testing and reinforcement learning." }
 ],
 k: [
  "Adversarial training frames generation as a game: the generator improves by fooling the discriminator.",
  "Mode collapse and training instability are fundamental challenges of minimax optimisation with neural networks.",
  "GANs avoid explicit density estimation — the generator learns to match the data distribution implicitly.",
  "The adversarial principle extends beyond generation: domain adaptation, robustness and data augmentation all use it."
 ],
 r: ["Neural Network", "Gradient Descent", "Backpropagation", "Loss Function", "Overfitting", "Transfer Learning"],
 src: [
  { t: "Goodfellow et al. — Generative Adversarial Nets (NeurIPS 2014)", u: "https://arxiv.org/abs/1406.2661" },
  { t: "Karras et al. — A Style-Based Generator Architecture for Generative Adversarial Networks (StyleGAN, 2019)", u: "https://arxiv.org/abs/1812.04948" }
 ]
},

{
 t: "AlphaFold",
 s: "Biology's 50-year challenge solved by deep learning",
 y: 2020, when: "November 2020",
 g: ["deep learning", "protein folding", "bioinformatics", "evoformer", "attention", "structural biology"],
 tldr: "For five decades, determining how a sequence of amino acids folds into its functional 3D protein structure was an intractable biological puzzle requiring years of lab crystallography per protein. DeepMind's AlphaFold 2 achieved sub-angstrom atomic accuracy at CASP14, predicted the structures of nearly all ~200 million known proteins in public databases, and earned Demis Hassabis and John Jumper the 2024 Nobel Prize in Chemistry.",
 say: [
  "AlphaFold replaced hand-crafted energy physics simulations with end-to-end spatial attention and Evoformers.",
  "It solved the 50-year protein folding challenge, generating 200M+ accurate 3D structures in years instead of millennia of lab experiments.",
  "It earned the 2024 Nobel Prize in Chemistry, proving deep learning can achieve transformative scientific breakthroughs.",
  "AlphaFold 3 expanded prediction from single proteins to complex DNA, RNA, ligands, and multi-molecular complexes."
 ],
 b: [
  { h: "The 50-year grand challenge" },
  { p: "In 1972, Christian Anfinsen accepted the Nobel Prize in Chemistry with a legendary hypothesis: a protein's 3D structure is completely determined by its 1D sequence of amino acids. For fifty years, biology tried and failed to predict this computationally." },
  { p: "Experimental methods like X-ray crystallography and Cryo-EM required months to years of painstaking wet-lab work and hundreds of thousands of dollars per structure. By 2020, humanity had mapped ~170,000 protein structures out of hundreds of millions found in nature. The remaining 99.9% remained dark matter." },

  { h: "The CASP14 shockwave" },
  { p: "Every two years, the Critical Assessment of Structure Prediction (CASP) competition evaluated computational folding on newly sequenced proteins whose structures had been solved experimentally but kept secret." },
  { l: [
   "A Global Distance Test (GDT) score of **90+** is considered competitive with experimental laboratory methods (sub-angstrom atomic error).",
   "For decades, the best computational models plateaued around a GDT of **30–40** for difficult targets.",
   "In November 2020, **AlphaFold 2 reached a median GDT score of 92.4** across all targets, with an average root-mean-square deviation (RMSD) under 1.6Å — matching experimental X-ray crystallography."
  ] },
  { n: "When the CASP14 results were announced, Andrei Lupas, an evolutionary biologist who had worked on an unsolved protein for a decade, stated: 'AlphaFold gave us the model in thirty minutes. It took us ten years to crystallize it.' The organisers declared the protein folding problem effectively solved.",
    nt: "The reaction from the structural biology community" },

  { h: "The architecture: Evoformer & Invariant Point Attention" },
  { p: "AlphaFold 1 (2018) had predicted 2D distance maps between amino acids and passed them to a physics-based optimizer. AlphaFold 2 scrapped this pipeline and designed an **end-to-end geometric deep learning system** with two core innovations:" },
  { l: [
   "**Multiple Sequence Alignment (MSA) & Pair Representation.** Evolution is the ultimate data generator. If two amino acids mutate together across millions of years in different organisms, they are likely in physical contact in the folded 3D shape. The **Evoformer** passes evolutionary and spatial representations back and forth through specialized attention layers.",
   "**Invariant Point Attention (IPA).** The structural module directly outputs 3D atomic coordinates (rotations and translations for each residue backbone) using SE(3)-equivariant geometric attention, preserving rotational and translational symmetries in 3D Euclidean space."
  ] },
  { x: { lang: "text", code:
"Amino Acid Sequence: [M, K, V, L, W, ...]\n        │\n        ▼\n┌────────────────────────┐       ┌────────────────────────┐\n│  MSA Evolution Matrix  │◄─────►│ Pair Spatial Distances │\n└───────────┬────────────┘       └───────────┬────────────┘\n            │                                │\n            └───────────────┬────────────────┘\n                            ▼\n                 ┌────────────────────┐\n                 │ 48 Evoformer Blocks│ (Iterative 2D-1D Attention)\n                 └──────────┬─────────┘\n                            ▼\n                 ┌────────────────────┐\n                 │ Invariant Point    │ (SE(3) Equivariant Attention)\n                 │ Attention (IPA)    │ Direct 3D Coordinate Output\n                 └──────────┬─────────┘\n                            ▼\n          Atomic 3D Protein Structure (PDB/mmCIF)" } },

  { h: "Global impact" },
  { p: "In 2021, DeepMind partnered with the European Bioinformatics Institute (EMBL-EBI) to release the **AlphaFold Protein Structure Database**, making over **200 million protein structures** — virtually every known protein across plants, animals, and bacteria — freely available to global researchers." },
  { l: [
   "Accelerated drug discovery for neglected tropical diseases, malaria, and cancer therapeutics.",
   "Enabled custom enzyme design for plastic recycling and carbon capture.",
   "Demis Hassabis and John Jumper were awarded the **2024 Nobel Prize in Chemistry** for protein structure prediction, cementing deep learning as a foundational tool for fundamental science."
  ] }
 ],
 k: [
  "AlphaFold 2 solved the 50-year protein folding grand challenge by achieving atomic accuracy (GDT > 90).",
  "The Evoformer treats evolutionary co-mutation matrices and pairwise spatial distances as coupled attention channels.",
  "Invariant Point Attention (IPA) directly reasons over 3D rigid-body spatial transformations with SE(3) equivariance.",
  "The release of 200M+ structures democratized structural biology, culminating in the 2024 Nobel Prize in Chemistry."
 ],
 r: ["Deep Learning", "Neural Network", "Attention Mechanism", "Transformer", "Loss Function", "Gradient Descent", "Computer Vision"],
 src: [
  { t: "Jumper et al. — Highly accurate protein structure prediction with AlphaFold (Nature 2021)", u: "https://www.nature.com/articles/s41586-021-03819-2" },
  { t: "AlphaFold Protein Structure Database (EMBL-EBI)", u: "https://alphafold.ebi.ac.uk/" }
 ]
},

{
 t: "The LLaMA Leak & Open-Weights Revolution",
 s: "The 4-bit torrent that democratised frontier AI",
 y: 2023, when: "March 2023",
 g: ["llm", "open source", "llama", "quantisation", "lora", "community"],
 tldr: "When Meta's research weights for LLaMA-65B were leaked via a BitTorrent magnet link on 4chan in March 2023, it triggered the most intense open-source engineering frenzy in computer science history. Within weeks, developers created llama.cpp to run 65B models on MacBooks, 4-bit quantization (GPTQ/AWQ), and $500 LoRA fine-tunes (Alpaca, Vicuna), proving the open-source community could rival billion-dollar proprietary APIs.",
 say: [
  "The LLaMA leak proved consumer hardware could run frontier LLMs via 4-bit integer quantisation and pure C++.",
  "It birthed the modern open-weights ecosystem: llama.cpp, Ollama, vLLM, Hugging Face, Mistral, and Llama 3.",
  "Georgi Gerganov wrote llama.cpp in plain C++ with zero dependencies, running 13B models locally on M1 Apple Silicon at interactive speeds.",
  "The leaked Google internal memo 'We Have No Moat, And Neither Does OpenAI' captured the panic as open models caught up in weeks."
 ],
 b: [
  { h: "The leak" },
  { p: "In February 2023, Meta AI published the LLaMA paper and shared weights with approved academic researchers. On March 3, 2023, an approved user posted a BitTorrent magnet link to the entire weight archive on 4chan and submitted a pull request directly to Meta's GitHub repository." },
  { p: "Unlike previous research models, LLaMA was trained on 1.4 trillion tokens of public text — clean, efficient, and compute-dense. The weights were out, and they could not be called back." },

  { h: "Ten days that shook the industry" },
  { p: "What followed over the next three weeks was an unprecedented explosion of distributed open-source optimization:" },
  { l: [
   "**March 10 — llama.cpp is born.** Bulgarian engineer Georgi Gerganov rewrote the entire LLaMA inference engine in raw C/C++ with zero dependencies. Within 48 hours, a 13B model was executing in real-time on an Apple M1 MacBook with no GPU required.",
   "**March 13 — Stanford Alpaca ($500 fine-tuning).** Researchers at Stanford used GPT-3.5 to generate 52,000 instruction pairs, fine-tuning LLaMA-7B for under $500 using LoRA (Low-Rank Adaptation).",
   "**March 19 — 4-bit integer quantization (GPTQ/GGML).** Quantization reduced memory requirements from 16-bit floats (130GB for 65B) down to 4-bit integers (35GB), allowing 65B frontier intelligence to run on a single consumer RTX 3090 GPU or MacBook Pro."
  ] },
  { x: { lang: "text", code:
"Original FP16 Model (65B):    65 Billion × 2 Bytes  = 130 GB VRAM (Requires 2× A100 $20,000)\n                                        │\n                       4-Bit Quantization (GPTQ / GGUF)\n                                        ▼\nQuantized Model (65B Q4_K_M): 65 Billion × 0.5 Bytes =  35 GB VRAM (Runs on 1× RTX 3090 / M1 Mac)" } },

  { n: "In May 2023, an internal Google memo leaked titled 'We Have No Moat, And Neither Does OpenAI': 'While we've been squabbling, a third faction has been quietly eating our lunch... Open source models are faster, more customizable, more private, and pound-for-pound more capable. They are doing things with $100 and 13B params that we struggle with at $10M and 540B.'",
    nt: "The 'We Have No Moat' realization" },

  { h: "What it built" },
  { p: "The momentum from the March 2023 leak permanently restructured the AI industry:" },
  { l: [
   "**Ecosystem tooling:** GGUF file format, Ollama, vLLM, Text Generation WebUI, and Hugging Face became the standard deployment stack.",
   "**Corporate strategy pivot:** Meta fully embraced open-weights by releasing **Llama 2** and **Llama 3** under permissive commercial licenses.",
   "**European & startup champions:** Mistral AI was founded by former Meta/DeepMind researchers, releasing Mistral-7B and Mixtral 8x7B directly as open-weight torrents."
  ] }
 ],
 k: [
  "4-bit quantization and C++ SIMD vectorization brought frontier LLM inference to consumer laptops.",
  "Low-Rank Adaptation (LoRA) reduced instruction fine-tuning costs from millions to hundreds of dollars.",
  "The open-source community caught up to proprietary cloud models within months of having access to compute-dense base weights.",
  "Meta transformed an accidental leak into a deliberate open-weights distribution strategy with Llama 2 and 3."
 ],
 r: ["Large Language Model", "Quantisation", "LoRA", "Inference", "Fine-Tuning", "Transformer", "Context Window"],
 src: [
  { t: "Touvron et al. — LLaMA: Open and Efficient Foundation Language Models (Meta AI 2023)", u: "https://arxiv.org/abs/2302.13971" },
  { t: "Georgi Gerganov — llama.cpp (GitHub)", u: "https://github.com/ggerganov/llama.cpp" }
 ]
},

{
 t: "FlashAttention",
 s: "The hardware-aware IO trick that unlocked long context",
 y: 2022, when: "May 2022",
 g: ["gpu", "attention", "transformer", "cuda", "memory hierarchy", "kernel"],
 tldr: "Standard Transformer attention required materializing the entire N×N attention matrix in slow GPU High Bandwidth Memory (HBM), creating an O(N²) memory wall that capped context windows at 2K–4K tokens. Tri Dao and Christopher Ré introduced FlashAttention — an exact, non-approximated attention algorithm that tiles the computation to keep data in fast on-chip SRAM using online softmax. It made training 3–4× faster and paved the way for 100K to 1M+ token context windows.",
 say: [
  "Attention wasn't compute-bound on modern GPUs; it was memory-bandwidth bound between HBM and SRAM.",
  "FlashAttention computes exact self-attention without ever writing the N×N intermediate matrix to global memory.",
  "It uses tiling and the online softmax trick to incrementally compute row-wise maxima and normalizers on fast on-chip SRAM.",
  "Every modern frontier LLM (GPT-4, Claude, Gemini, Llama 3) uses FlashAttention or its derivatives to train on long contexts."
 ],
 b: [
  { h: "The memory wall in Transformer attention" },
  { p: "Self-attention computes $O = \\text{softmax}(QK^T / \\sqrt{d}) V$. For a sequence of length $N$, the intermediate matrix $S = QK^T$ has size $N \\times N$." },
  { p: "On modern GPUs like the NVIDIA A100, tensor cores provide massive compute (312 TFLOPs), but global High Bandwidth Memory (HBM) is relatively slow (1.5–2.0 TB/s). In contrast, on-chip **SRAM** (192 KB per streaming multiprocessor) is 10× faster (~19 TB/s) but tiny." },
  { l: [
   "Standard PyTorch attention computed $QK^T$, wrote the $N \\times N$ matrix to slow HBM, read it back to compute Softmax, wrote it to HBM again, and read it back to multiply by $V$.",
   "For $N = 2,048$, $N \\times N$ is manageable. For $N = 64,000$ or $128,000$, the $N \\times N$ matrix occupies hundreds of gigabytes of VRAM, running out of memory before computation even begins.",
   "Attention was bottlenecked by **memory IO reads and writes**, not mathematical FLOPs."
  ] },

  { h: "The innovation: Tiling & Online Softmax" },
  { p: "Tri Dao, Daniel Haziza, Francisco Massa, and Christopher Ré designed FlashAttention around two core ideas:" },
  { l: [
   "**Tiling.** Split $Q, K, V$ into small blocks that fit entirely inside GPU SRAM (e.g. $64 \\times 64$).",
   "**Online Softmax.** The softmax function requires knowing the maximum value and denominator sum of the entire row: $m = \\max(x)$ and $d = \\sum e^{x_i - m}$. Traditionally, you cannot compute softmax on a block without seeing the whole sequence. Online softmax incrementally updates the scaling factor and running sum as new blocks are loaded, mathematically yielding the exact same output without ever storing the full $N \\times N$ matrix."
  ] },
  { x: { lang: "text", code:
"Standard Attention (Memory IO Bound):    FlashAttention (Hardware-Aware SRAM Tiling):\n\n     GPU SRAM (19 TB/s)                       GPU SRAM (19 TB/s)\n┌────────────────────────────┐           ┌────────────────────────────┐\n│ Q, K, V Blocks             │           │ Load Q_i, K_j, V_j Block   │\n└─────────────┬──────────────┘           │ Compute Partial Softmax    │\n              │ Write N×N matrix         │ Update Running Stats (m, d)│\n              ▼                          └─────────────┬──────────────┘\n     GPU HBM (1.5 TB/s)                                │ Write ONLY final Output O_i\n┌────────────────────────────┐                         ▼\n│ Huge N×N Attention Matrix  │                GPU HBM (1.5 TB/s)\n│ Memory: O(N²) Slow IO Bottleneck       ┌────────────────────────────┐\n└────────────────────────────┘           │ Final Output O: O(N) Mem   │\n                                         └────────────────────────────┘" } },

  { h: "Backward pass recomputation" },
  { p: "In standard backpropagation, the $N \\times N$ attention matrix had to be stored in VRAM during the forward pass so gradients could be calculated during the backward pass." },
  { p: "FlashAttention instead **discards** the intermediate attention scores and recomputes them on-the-fly during the backward pass from $Q, K, V$ blocks stored in SRAM. Recomputing is drastically faster than reading from slow HBM, reducing memory footprint from $O(N^2)$ to $O(N)$." },

  { h: "The impact on modern AI" },
  { p: "FlashAttention (and subsequent FlashAttention-2 and FlashAttention-3 for Hopper H100s) made exact attention 2–4× faster and enabled:" },
  { l: [
   "**100K to 1M+ token context windows** in models like Gemini 1.5, Llama 3.1, and Claude 3.",
   "Standard inclusion in PyTorch (`scaled_dot_product_attention`), vLLM, TensorRT-LLM, and Hugging Face Transformers.",
   "Proof that **hardware-aware algorithm design** yields greater speedups than naive brute-force scaling."
  ] }
 ],
 k: [
  "Standard attention was memory-bandwidth bound by reading/writing the N×N intermediate matrix to GPU HBM.",
  "FlashAttention uses SRAM tiling and online softmax to compute exact attention without storing the N×N matrix.",
  "Recomputing attention blocks during the backward pass is faster than storing and reading them from global memory.",
  "FlashAttention unlocked long-context LLMs, scaling sequence lengths from 2K tokens to 1M+ tokens."
 ],
 r: ["Attention Mechanism", "Transformer", "GPU", "CUDA", "Context Window", "Kernel", "Latency"],
 src: [
  { t: "Dao et al. — FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness (NeurIPS 2022)", u: "https://arxiv.org/abs/2205.14135" },
  { t: "Dao — FlashAttention-2: Faster Attention with Better Parallelism and Work Partitioning (2023)", u: "https://arxiv.org/abs/2307.08691" }
 ]
},

{
 t: "Word2Vec",
 s: "When vector arithmetic captured human meaning",
 y: 2013, when: "January 2013",
 g: ["nlp", "embeddings", "neural network", "semantics", "representation"],
 tldr: "Tomas Mikolov and his Google team showed that simple 2-layer neural networks (Continuous Bag of Words and Skip-gram) trained on raw unlabelled text learned dense continuous vector spaces where geometric relationships mirrored human semantic relationships. The famous demonstration that vector('King') - vector('Man') + vector('Woman') ≈ vector('Queen') marked the permanent transition from symbolic n-grams to dense learned representations.",
 say: [
  "Word2Vec proved that simple neural models trained on unlabeled text discover dense semantic representations.",
  "Vector arithmetic preserves analogies: King - Man + Woman = Queen, Paris - France + Italy = Rome.",
  "Skip-gram with Negative Sampling transformed a computationally impossible softmax over millions of words into simple binary logistic regressions.",
  "It established the embedding paradigm that underpins modern search, recommendation systems, and all Transformer LLMs."
 ],
 b: [
  { h: "Before: Sparse one-hot vectors" },
  { p: "In 2012, Natural Language Processing treated words as discrete, atomic symbols. In a vocabulary of 50,000 words, 'cat' was a 50,000-dimensional one-hot vector with a 1 at index 42 and 0s everywhere else. 'Dog' was a vector with a 1 at index 89." },
  { p: "The dot product between any two distinct one-hot vectors is always 0. To the computer, 'cat' was as mathematically distant from 'feline' and 'dog' as it was from 'refrigerator' or 'algebra'. Models had no concept of semantic similarity." },

  { h: "The distributional hypothesis in neural weights" },
  { p: "Linguist J.R. Firth famously wrote in 1957: *'You shall know a word by the company it keeps.'* Tomas Mikolov, Kai Chen, Greg Corrado, and Jeffrey Dean at Google operationalized this with two lightweight neural architectures:" },
  { l: [
   "**Continuous Bag of Words (CBOW):** Predict the target word given its surrounding context words (e.g. given 'the cat sits on the [?]', predict 'mat').",
   "**Skip-gram:** Predict the surrounding context words given a single target word (e.g. given 'cat', predict 'the', 'sits', 'purrs')."
  ] },

  { h: "The algorithmic leap: Negative Sampling" },
  { p: "A standard neural network output layer computing a softmax over a vocabulary of 1,000,000 words requires calculating a denominator with one million exponential terms for every single training word — computationally impossible on large corpora." },
  { p: "Mikolov introduced **Skip-gram with Negative Sampling (SGNS)**: instead of predicting the exact word across the whole vocabulary, turn it into a binary classification problem: *'Did this target word and context word appear together in the text (positive sample), or did we randomly pull this context word from a dictionary (negative sample)?'* This reduced training complexity from $O(|V|)$ to $O(k)$ where $k \\approx 5–20$." },
  { x: { lang: "text", code:
"                     Vector Subtraction & Addition in Embedding Space\n\n     Gender Direction ──►\n  ┌────────────────────────────────────────────────────────┐\n  │                                                        │\n  │    vec(\"King\") ───────────────► vec(\"Queen\")          │\n  │         │                            │                 │\n  │         │ Royalty                    │ Royalty         │\n  │         ▼                            ▼                 │\n  │    vec(\"Man\")  ───────────────► vec(\"Woman\")          │\n  │                                                        │\n  └────────────────────────────────────────────────────────┘\n\n  vec(\"King\") - vec(\"Man\") + vec(\"Woman\") ≈ vec(\"Queen\")\n  vec(\"Paris\") - vec(\"France\") + vec(\"Italy\") ≈ vec(\"Rome\")" } },

  { h: "Linear semantic geometry" },
  { p: "When the learned 300-dimensional vectors were examined, researchers discovered an astonishing emergent property: linear directions in the vector space corresponded to abstract semantic concepts." },
  { l: [
   "**Capital cities:** $\\vec{v}(\\text{Madrid}) - \\vec{v}(\\text{Spain}) + \\vec{v}(\\text{France}) \\approx \\vec{v}(\\text{Paris})$",
   "**Comparative adjectives:** $\\vec{v}(\\text{bigger}) - \\vec{v}(\\text{big}) + \\vec{v}(\\text{small}) \\approx \\vec{v}(\\text{smaller})$",
   "**Verb tenses:** $\\vec{v}(\\text{walking}) - \\vec{v}(\\text{walk}) + \\vec{v}(\\text{swim}) \\approx \\vec{v}(\\text{swimming})$"
  ] },

  { h: "The lineage" },
  { p: "Word2Vec proved that neural networks could distill unstructured human text into dense geometric representations without human supervision. It paved the way for GloVe (2014), FastText (2016), ELMo (2018), and ultimately the embedding layers that initiate every modern Transformer LLM." }
 ],
 k: [
  "Word2Vec replaced orthogonal one-hot vectors with dense 300D continuous semantic embeddings.",
  "Skip-gram with Negative Sampling turned multi-class vocabulary prediction into fast binary logistic regressions.",
  "Linear vector arithmetic in embedding space captures human analogies: King - Man + Woman = Queen.",
  "It established self-supervised pre-training on raw unlabelled text as the dominant NLP paradigm."
 ],
 r: ["Embedding", "Natural Language Processing", "Vector Database", "Cosine Similarity", "Neural Network", "Softmax", "Loss Function"],
 src: [
  { t: "Mikolov et al. — Efficient Estimation of Word Representations in Vector Space (ICLR 2013)", u: "https://arxiv.org/abs/1301.3781" },
  { t: "Mikolov et al. — Distributed Representations of Words and Phrases and their Compositionality (NeurIPS 2013)", u: "https://arxiv.org/abs/1310.4546" }
 ]
},

{
 t: "Chinchilla & Modern LLM Scaling Laws",
 s: "Why everyone was training the wrong models",
 y: 2022, when: "March 2022",
 g: ["llm", "scaling laws", "chinchilla", "training", "compute", "deepmind"],
 tldr: "OpenAI's 2020 Kaplan scaling laws suggested that parameter count was the dominant factor in model performance, leading the industry to train colossal, undertrained models like GPT-3 (175B on 300B tokens) and Gopher (280B on 300B tokens). DeepMind's Chinchilla paper (Hoffmann et al.) proved this was severely suboptimal: compute-optimal training requires scaling model parameters and training dataset tokens in a 1:1 ratio. A 70B Chinchilla model trained on 1.4T tokens outperformed 280B Gopher while being 4× cheaper to run.",
 say: [
  "Kaplan 2020 over-emphasized parameter count; Hoffmann 2022 showed tokens and parameters must scale equally.",
  "For compute-optimal training, a 70B parameter model requires ~1.4 trillion tokens, not 300 billion.",
  "Smaller, overtrained models are dramatically cheaper to serve in production (inference cost scales with parameters, not training tokens).",
  "Chinchilla reset the entire LLM training playbook — directly leading to LLaMA (7B/13B trained on 1T+ tokens) and modern efficient architectures."
 ],
 b: [
  { h: "The Kaplan era: Bigger is better" },
  { p: "In 2020, Jared Kaplan and the OpenAI team published *Scaling Laws for Neural Language Models*. Their empirical power-law equations concluded that model performance depended primarily on parameter count ($N$), whereas dataset size ($D$) was a secondary lever." },
  { p: "The industry interpreted this as a mandate to build giant parameter monsters. If you had a fixed compute budget, you poured the vast majority into making the network wider and deeper while keeping training tokens modest (~300 billion tokens):" },
  { l: [
   "**GPT-3 (OpenAI, 2020):** 175 Billion parameters trained on 300 Billion tokens.",
   "**Gopher (DeepMind, 2021):** 280 Billion parameters trained on 300 Billion tokens.",
   "**Megatron-Turing NLG (Microsoft/NVIDIA, 2021):** 530 Billion parameters trained on 270 Billion tokens."
  ] },

  { h: "DeepMind's Chinchilla re-evaluation" },
  { p: "Jordan Hoffmann, Sebastian Borgeaud, Arthur Mensch, and the DeepMind team suspected the Kaplan scaling law had an experimental flaw: Kaplan had kept learning rate schedules fixed across different model sizes, causing larger models to appear artificially more efficient." },
  { p: "DeepMind trained over **400 language models** ranging from 70 million to 16 billion parameters across various token budgets with cosine learning rate decay matched to total tokens. The mathematical result was unequivocal:" },
  { l: [
   "**Kaplan (2020):** As compute increases by $10\\times$, parameters should increase by $7.3\\times$ while tokens increase by only $1.7\\times$.",
   "**Chinchilla (Hoffmann et al., 2022):** Model parameters and training dataset tokens should scale in **equal 1:1 proportion** ($N \\propto C^{0.5}$ and $D \\propto C^{0.5}$)."
  ] },
  { x: { lang: "text", code:
"                      Compute-Optimal Scaling Frontier\n\n  Parameter Count (N)\n     ▲\n     │                  ✖ Gopher (280B params / 300B tokens) [Undertrained]\n     │                 / \n     │                /  ✖ GPT-3 (175B params / 300B tokens) [Undertrained]\n     │               /  \n     │              /    ● Chinchilla (70B params / 1.4T tokens) [OPTIMAL]\n     │             /    /\n     │            /    /  ● LLaMA-7B / 13B (Overtrained for inference efficiency)\n     │           /    /\n     └──────────┴────┴────────────────────────────────► Training Tokens (D)\n                 Kaplan Path       Chinchilla 1:1 Optimal Path" } },

  { h: "The Chinchilla result" },
  { p: "To prove the hypothesis, DeepMind trained **Chinchilla**: a 70-billion parameter model on **1.4 trillion tokens** — identical compute budget to 280B Gopher, but with 4× fewer parameters and 4.6× more tokens." },
  { l: [
   "Chinchilla **outperformed Gopher (280B), GPT-3 (175B), Jurassic-1 (178B), and Megatron-Turing (530B)** across MMLU, Big-Bench, commonsense reasoning, and code generation.",
   "Because Chinchilla had only 70B parameters, it required **4× less GPU VRAM** and delivered **4× higher inference throughput** in production."
  ] },

  { h: "The inference revolution" },
  { p: "Chinchilla fundamentally changed the economics of artificial intelligence. Training a model happens once, but running inference happens billions of times. An overtrained small model (like LLaMA-7B trained on 2 trillion tokens) is slightly suboptimal on training compute, but drastically cheaper to serve millions of users." },
  { p: "Every major modern foundation model — LLaMA 3, Mistral, Gemma, Claude 3.5, and GPT-4o — follows the Chinchilla scaling law." }
 ],
 k: [
  "Compute-optimal training requires scaling model parameters and training tokens in equal 1:1 proportion.",
  "GPT-3 (175B) and Gopher (280B) were severely undertrained due to flawed early scaling laws.",
  "Chinchilla (70B on 1.4T tokens) beat 280B Gopher while being 4× smaller and faster at inference.",
  "Modern open-weight models intentionally overtrain small models on trillions of tokens for inference efficiency."
 ],
 r: ["Large Language Model", "Parameters", "Training Data", "Token", "Inference", "Transformer"],
 src: [
  { t: "Hoffmann et al. — Training Compute-Optimal Large Language Models (Chinchilla, 2022)", u: "https://arxiv.org/abs/2203.15556" },
  { t: "Kaplan et al. — Scaling Laws for Neural Language Models (OpenAI 2020)", u: "https://arxiv.org/abs/2001.08361" }
 ]
},

{
 t: "DeepSeek: MLA & Reasoning at Scale",
 s: "Algorithmic efficiency versus brute-force compute",
 y: 2024, when: "December 2024",
 g: ["deepseek", "mla", "reasoning", "moe", "reinforcement learning", "efficiency"],
 tldr: "DeepSeek shocked the global AI industry by matching top US frontier models with DeepSeek-V3 and DeepSeek-R1 at a tiny fraction of conventional compute costs (~$6M training budget). Through architectural innovations like Multi-Head Latent Attention (MLA) for massive KV-cache compression, fine-grained sparse MoE routing (DeepSeekMoE), DualPipe pipeline overlapping, and pure Reinforcement Learning reasoning emergence without supervised warm-start, DeepSeek proved algorithmic elegance can beat pure capital expenditure.",
 say: [
  "Multi-Head Latent Attention (MLA) compresses Key-Value caches into low-dimensional latent vectors, slashing memory bottlenecks during generation.",
  "DeepSeek-V3 uses 256 fine-grained expert routing with 8 shared experts, activating only 37B out of 671B parameters per token.",
  "DeepSeek-R1 demonstrated that pure large-scale RL on base models triggers the 'Aha moment' — spontaneous self-correction and reasoning chains without supervised fine-tuning.",
  "It shifted the industry conversation from compute monopolies to architectural and algorithmic optimization."
 ],
 b: [
  { h: "The $6 Million shock" },
  { p: "In December 2024 and January 2025, Chinese research lab DeepSeek open-sourced DeepSeek-V3 (a 671-billion parameter base model) and DeepSeek-R1 (a frontier reasoning model matching OpenAI's o1)." },
  { p: "What stunned Silicon Valley and Wall Street was the reported training cost: **2.788 million GPU hours on an older NVIDIA H800 cluster, totaling roughly $5.58 million USD** — compared to the hundreds of millions or billions invested by US hyperscalers. DeepSeek achieved this not through shortcuts, but through relentless low-level algorithmic co-design." },

  { h: "Multi-Head Latent Attention (MLA)" },
  { p: "In standard Multi-Head Attention (MHA) and Grouped-Query Attention (GQA), the Key-Value (KV) cache grows linearly with context length and batch size during generation, quickly choking GPU VRAM." },
  { p: "DeepSeek introduced **Multi-Head Latent Attention (MLA)**: instead of caching the full multi-head Key and Value tensors, it compresses Keys and Values into a single low-dimensional **latent vector** ($d_c \\approx 512$). During generation, only this tiny compressed vector is cached in VRAM, decompressing it into full attention heads on-the-fly during matrix multiplication." },
  { x: { lang: "text", code:
"Standard GQA KV Cache per Token:         DeepSeek MLA Compressed KV Cache:\n┌──────────────────────────────────────┐ ┌──────────────────────────────────────┐\n│ Key Heads (e.g. 8 × 128 = 1024 dims) │ │ Latent KV Vector c_KV (512 dims)     │\n│ Val Heads (e.g. 8 × 128 = 1024 dims) │ │ Decoupled RoPE Key k_R (64 dims)     │\n│ Total: 2048 floats per token         │ │ Total: 576 floats per token          │\n└──────────────────────────────────────┘ └──────────────────────────────────────┘\nMemory Reduction: ~72% KV Cache Saved → Enables massive serving batch sizes & 128k context" } },

  { h: "DeepSeekMoE: Fine-grained expert specialization" },
  { p: "Traditional Mixture-of-Experts (like Mixtral 8x7B) route tokens to 2 out of 8 large experts. DeepSeek-V3 uses **256 fine-grained micro-experts** plus **8 shared experts** that are always activated:" },
  { l: [
   "**Fine-grained routing:** Activating 8 out of 256 smaller experts allows vastly more combinatorial combinations of specialized knowledge.",
   "**Shared experts:** Dedicated parameters that capture common, non-specialized knowledge without consuming routing bandwidth.",
   "**Auxiliary-loss-free load balancing:** Instead of penalizing routing with artificial loss terms that degrade model quality, DeepSeek dynamically adjusts expert bias thresholds during training to balance GPU compute loads."
  ] },

  { h: "DeepSeek-R1-Zero: Pure RL & The 'Aha Moment'" },
  { p: "Standard post-training required thousands of human-written Supervised Fine-Tuning (SFT) reasoning chains before applying RLHF. In **DeepSeek-R1-Zero**, researchers applied pure Reinforcement Learning (Rule-Based GRPO: Group Relative Policy Optimization) directly onto the raw base model using mathematical verification and code execution compilers as reward signals." },
  { p: "Without human demonstration, the model spontaneously learned to generate extended internal chains of thought, back-track, verify intermediate equations, allocate more thinking time for complex problems, and re-evaluate initial assumptions — exhibiting the celebrated 'Aha moment' of self-correction." }
 ],
 k: [
  "Multi-Head Latent Attention (MLA) compresses KV caches by over 70%, slashing inference memory bottlenecks.",
  "DeepSeekMoE uses 256 fine-grained experts with auxiliary-loss-free dynamic load balancing.",
  "DeepSeek-R1 proved pure RL without supervised fine-tuning can emerge complex self-correcting reasoning behaviors.",
  "Demonstrated that algorithmic innovation can achieve frontier AI parity at a fraction of hyperscaler capital expenditure."
 ],
 r: ["Large Language Model", "Mixture of Experts", "Reinforcement Learning", "Attention Mechanism", "Transformer", "KV Cache", "Inference"],
 src: [
  { t: "DeepSeek-AI — DeepSeek-V3 Technical Report (2024)", u: "https://arxiv.org/abs/2412.19437" },
  { t: "DeepSeek-AI — DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning (2025)", u: "https://arxiv.org/abs/2501.12948" }
 ]
}

]);

