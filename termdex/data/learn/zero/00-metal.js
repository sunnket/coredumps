/* Ground Zero — the machine itself.

   This module exists because every other beginner course starts one step too
   late. They open with "what a program is", which is software, and quietly
   assume the reader has a working picture of the thing the software runs on.
   Most people do not. They have a box that gets warm.

   So this comes first, and it has two jobs that are not the same job:

     1. Explain the hardware honestly, in the order the parts actually matter
        rather than the order a spec sheet lists them.

     2. Make the reader *want* the next module. That is a real goal, not a
        garnish. Nobody finishes a course they are not curious about, and
        curiosity about a computer comes from finally seeing how absurd it is
        that any of it works at all.

   Every lesson ends with the same structural beat: the part just learned, in
   its AI-engineering form. Not as a career advert bolted on the end, but as
   the payoff — you learned what RAM is, so now the sentence "a 70B model
   needs 140 GB" is not jargon any more, it is arithmetic you can do. That
   turn from mystified to fluent is what recruits people, and it is why the
   thread is woven through every lesson instead of saved for a capstone.

   The diagrams are the animated ones from assets/js/machine.js. They are
   used where motion is the actual content — a bus is traffic, a clock is a
   beat, a cycle is a loop — and nowhere else. */
TD.addLessons("zero", [

{
 t: "The Box on Your Desk",
 m: "metal",
 lvl: "core",
 s: "Open it up. Five parts, and you already understand four of them by analogy.",
 goal: [
  "Name the five components inside any computer and what each is for",
  "Explain why a phone, a laptop and a data-centre server are the same design",
  "Point at the part that does the work and the part that remembers"
 ],
 b: [
  { p: "There is a thing on your desk, or in your hand, and it cost you real money, and you have almost certainly never been told what is inside it. That is a strange gap. You would not drive a car for ten years without knowing there is an engine under the bonnet." },
  { p: "So before a single line of code: what is in there?" },
  { p: "The answer is smaller than you expect. Five things. Everything else is wiring, cooling and marketing." },

  { dg: "mc-box" },

  { h: "The five parts" },
  { p: "**The CPU** is the worker. It does the actual thinking — every calculation, every comparison, every decision. It is the only part that *does* anything; the rest exist to keep it fed." },
  { p: "**RAM** is the desk. It is where the things you are working on right now are spread out, within arm's reach. It is fast, and it is completely wiped the moment power goes." },
  { p: "**Storage** — your SSD or hard drive — is the filing cabinet. Slower to reach into, but it remembers when the power is off. Your files, your photos, your operating system: all in the cabinet." },
  { p: "**The bus** is the set of roads between them. Nothing moves between the CPU, RAM and storage without travelling on it, and — as you will see — those roads are more often the traffic jam than the worker is." },
  { p: "**The GPU** is a second worker with a completely different personality. Where the CPU is a few brilliant generalists, the GPU is thousands of simple specialists who all do the same thing at once. Hold onto that one. It is the reason modern AI exists." },

  { ana: "Think of a kitchen. The chef is the CPU. The counter is RAM — everything currently being cooked is on it, and at closing time it gets wiped clean. The pantry is storage: slower to walk to, but it still has your flour tomorrow morning. The floor between them is the bus, and if the kitchen is badly laid out the chef spends the whole night walking rather than cooking. The GPU is a hundred prep cooks who can only chop, but who chop *simultaneously*.",
    at: "The kitchen" },

  { h: "The same five parts, all the way up" },
  { p: "Here is the part that surprises people. This is not a description of a laptop. It is a description of *every* computer that has ever been built." },
  { ol: [
   "The phone in your pocket: CPU, RAM, storage, bus, GPU.",
   "The laptop you are reading this on: the same five, physically larger.",
   "A $400,000 server training an AI model: the same five, with eight enormous GPUs instead of one small one.",
   "The computer that guided Apollo 11 to the moon: the same design, with less memory than a single one of your photographs."
  ] },
  { p: "The design has not fundamentally changed since the 1940s. What changed is that the parts got about a trillion times smaller and faster, and nothing else. When you learn this once, you have learned every computer, forever. That is an unusually good return on twenty minutes." },

  { n: "You cannot break anything by understanding it. Nothing in this module asks you to open your actual computer — and please do not. This is a map, not a repair manual. The point is that when someone says *it's a memory problem*, you know which of the five they mean.",
    nt: "Read-only" },

  { h: "Where this shows up in AI" },
  { p: "You will hear AI engineers talk about hardware constantly, far more than other programmers do. People find this odd. It is not odd at all — it is these five parts, and one of them is always the bottleneck." },
  { p: "When you eventually read a sentence like *“we had to shard the model across two A100s because it wouldn't fit in VRAM”* — that sentence is about **the GPU**, and about **memory**, and about **the bus** between them. Three of the five parts you just met." },
  { p: "Right now that sentence probably reads as noise. By the end of this module it will read as plain English, and the shift from one to the other is genuinely the most satisfying week in learning to program." }
 ],
 k: [
  "Five parts: CPU (does the work), RAM (the desk), storage (the filing cabinet), the bus (the roads), GPU (the crowd of simple workers).",
  "A phone, a laptop and a server rack are the same five-part design at different sizes.",
  "The design has barely changed since the 1940s; the parts just got smaller and faster.",
  "AI engineers talk about hardware constantly because one of these five is always the bottleneck."
 ],
 r: ["CPU", "GPU", "Operating System", "Virtual Memory", "Process"]
},

{
 t: "What the CPU Actually Does",
 m: "metal",
 lvl: "core",
 s: "Fetch, decode, execute. Three steps, three billion times a second, since 1945.",
 goal: [
  "Describe the fetch-decode-execute cycle in your own words",
  "Explain what a clock speed number actually measures",
  "Say why a faster clock is not the same as a faster computer"
 ],
 b: [
  { p: "The CPU is the part that thinks, so it ought to be the complicated one. It is not. It is the *simplest* thing in the box, and that is the fact worth sitting with, because it is where the wonder actually is." },
  { p: "A CPU does exactly three things, in a loop, forever:" },

  { dg: "mc-cycle" },

  { ol: [
   "**Fetch** — go to memory and collect the next instruction.",
   "**Decode** — work out which of its handful of operations that instruction is asking for.",
   "**Execute** — do it. Add two numbers. Compare two numbers. Move a number somewhere else."
  ] },
  { p: "Then it goes back to step one. That is the entire job. It has been the entire job since 1945, and it will still be the entire job in whatever you are using in 2050." },

  { h: "The absurd part" },
  { p: "Here is what makes it worth caring about. The list of things a CPU can actually *do* is tiny — add, subtract, compare, move, jump to a different instruction. Perhaps a few hundred operations, and the useful ones number a few dozen. A capable teenager could learn the full list in an afternoon." },
  { p: "Every film you have streamed, every game you have played, every conversation you have had with an AI model — all of it is that same small handful of operations, arranged carefully, and repeated an unfathomable number of times." },
  { p: "Nothing was added. Nobody taught the CPU what a photograph is. It still only adds and compares. We just got very, very good at arranging." },

  { ana: "It is like discovering that every book in every library is made from twenty-six letters. The letters did not get cleverer to accommodate Tolstoy. The arrangement did all the work. A CPU's instruction set is that alphabet, and every program ever written is a sentence in it.",
    at: "Twenty-six letters" },

  { h: "What clock speed means" },
  { p: "The number on the spec sheet — *3.5 GHz* — is how many times per second that loop runs. Giga means billion. So 3.5 GHz is three and a half **billion** steps every second." },
  { p: "Try to hold that honestly for a moment. In the time it takes you to blink — about a third of a second — your CPU has run through more than a billion instructions. In the time it took you to read this sentence, several hundred billion." },
  { p: "This is why programs feel instant, and it is also why a program with a stupid mistake in it can lock up your machine in a fraction of a second. The machine does not hesitate. It does exactly what you said, a billion times, before you have noticed." },

  { trap: "A bigger clock number does not mean a faster computer, which is why phones with lower GHz figures often feel snappier than laptops with higher ones. A CPU running at 4 GHz that spends most of its cycles *waiting for data to arrive* is slower in practice than a 3 GHz chip that is kept fed. Speed is about the whole system, not the headline number — which is exactly what the next two lessons are about." },

  { h: "Where this shows up in AI" },
  { p: "Now do the arithmetic that makes AI training make sense." },
  { p: "Training a large model means performing something like **10²³ operations** — a one with twenty-three zeros after it. Your CPU does roughly 10¹⁰ operations a second, being generous about how many it handles per tick." },
  { p: "Divide one by the other and a single CPU would need **on the order of three hundred thousand years**. Not a slow afternoon. Longer than our species has had writing." },
  { p: "That is not a small inefficiency to be optimised away. That is a wall. And when you hit a wall like that, you do not need a faster version of the same thing — you need a fundamentally different shape of machine. Which is exactly what a GPU is, and why the lesson about it is the one that explains the entire AI industry." }
 ],
 k: [
  "A CPU does three things forever: fetch an instruction, decode it, execute it.",
  "Its full repertoire is a few dozen useful operations — add, compare, move, jump. Nothing more.",
  "Clock speed is how many times per second that loop runs. 3.5 GHz is 3.5 billion times.",
  "A faster clock does not mean a faster computer if the CPU is left waiting for data."
 ],
 r: ["CPU", "Machine Code", "Compiler", "Process", "Latency"]
},

{
 t: "Memory: The Desk and the Filing Cabinet",
 m: "metal",
 lvl: "core",
 s: "Why your computer has two kinds of memory, and why one of them forgets everything.",
 goal: [
  "Explain the difference between RAM and storage without using the words fast and slow",
  "Say why unsaved work disappears when the power goes",
  "Describe why memory gets slower the further it sits from the CPU"
 ],
 b: [
  { p: "Every beginner asks some version of this question, and it is a good question: why does a computer have two different kinds of memory? Why not just one big fast one?" },
  { p: "Because we cannot build one. Fast memory is expensive and small. Big memory is cheap and slow. Nobody has ever found a way around that, so every computer ever made is a compromise — a stack of memories, each one slower and larger than the one above it." },

  { dg: "mc-memory" },

  { h: "How far is far?" },
  { p: "The numbers in that diagram are hard to feel, so scale them up. Pretend one CPU tick is one second of your time." },
  { ol: [
   "Reading from a **register**, inside the CPU: 1 second. It is in your hand.",
   "Reading from **cache**: about 10 seconds. It is on your desk.",
   "Reading from **RAM**: about 3 minutes. You get up and walk to the shelf.",
   "Reading from an **SSD**: about 6 days. You post a letter.",
   "Reading from **the network**: about 3 years. You send an expedition."
  ] },
  { p: "That is the real shape of a computer, and it is the single most useful mental model in this entire module. The CPU is almost never *thinking* too slowly. It is **waiting**. Nearly all performance work, at every level of the industry, is the art of not making the CPU wait." },

  { ana: "You are cooking. Ingredients in your hand are registers. Ingredients on the counter are RAM. Ingredients in the pantry are the SSD. Ingredients at the shop are the network. A great chef is not one who chops faster — it is one who plans so that they almost never walk to the shop mid-recipe.",
    at: "Never go to the shop" },

  { h: "Why unsaved work vanishes" },
  { p: "RAM is **volatile**, which is a precise technical word meaning it holds its contents only while electricity flows through it. Each bit is stored as a tiny charge that must be constantly refreshed — thousands of times a second — or it drains away." },
  { p: "So when the power goes, RAM does not *lose* your document in the way you lose your keys. There is nothing left to find. The charges are gone, and with them everything that was only in RAM." },
  { p: "Storage works differently: it holds its state physically, with no power at all. That is why it survives, and why it is slower — physical state is more work to change than a charge is." },
  { p: "This is what saving *is*. Saving is copying from the desk into the cabinet. Every time you hit Ctrl+S you are moving something from a place that forgets to a place that remembers." },

  { trap: "“The computer ate my essay” is always this. The essay was in RAM, never copied to storage, and the power went. It is not bad luck and it is not a bug — it is exactly what volatile memory means. Once you understand this, the habit of saving stops being nagging advice and starts being obvious." },

  { h: "Where this shows up in AI" },
  { p: "Now the sentence from the first lesson becomes arithmetic you can actually do." },
  { p: "A model's size is measured in **parameters** — the numbers it learned during training. A large open model might have **70 billion** of them. Each parameter is typically stored in 2 bytes." },
  { p: "So: 70 billion × 2 bytes = **140 GB**. And here is the part that matters — to *use* the model, all 140 GB must be in memory at once, because any parameter might be needed for any word it generates. You cannot stream it from disk; go back to the scale above and you will see why. That would be posting a letter for every calculation." },

  { dg: "mc-ai-scale" },

  { p: "Your laptop has perhaps 16 GB. A large data-centre GPU has 80 GB. The model needs 140 GB. It does not fit, so it has to be split across two GPUs — and *that* is what “we sharded it across two A100s” means. Nothing more mysterious than a thing being too big for a shelf." },
  { p: "You have just done real AI-infrastructure reasoning using nothing but the idea of a desk and a filing cabinet. That is not a simplification for beginners — it is genuinely how engineers think about it." }
 ],
 k: [
  "Fast memory is small and expensive; large memory is slow and cheap. Every computer is a stack of compromises between them.",
  "The CPU spends most of its time waiting for data, not calculating. Performance work is mostly about reducing waiting.",
  "RAM is volatile: it holds data only while powered. Saving means copying to storage, which holds state physically.",
  "A model's memory need is parameters × bytes each — and all of it must be resident at once."
 ],
 r: ["Virtual Memory", "Cache", "Memory Management", "VRAM", "Stack and Heap Memory"]
},

{
 t: "The GPU, or Why AI Happened When It Did",
 m: "metal",
 lvl: "core",
 s: "The most important accident in computing: video-game hardware turned out to be exactly what AI needed.",
 goal: [
  "Explain the difference between a CPU core and a GPU core",
  "Say why matrix multiplication suits a GPU so well",
  "Describe why AI became possible in the 2010s rather than the 1990s"
 ],
 b: [
  { p: "This lesson explains an entire industry, and it does it with one idea, so it is worth reading slowly." },
  { p: "A CPU has a few cores — four, eight, maybe sixteen — and each one is a genius. It can handle wildly different instructions one after another, predict which way a decision will go, and reorganise its own work to go faster. It is a brilliant, flexible generalist." },
  { p: "A GPU has thousands of cores, and each one is, frankly, a bit dim. It cannot do anything clever. It cannot make complicated decisions. But there are **thousands** of them and they all do the same simple operation at the same instant." },

  { dg: "mc-cpu-gpu" },

  { ana: "A CPU is four professors. Give them a hard, subtle problem and they will reason their way through it. A GPU is four thousand schoolchildren with calculators. Ask the professors to multiply four thousand pairs of numbers and they will be at it a while. Ask the children and it is done in the time it takes to say it. Neither is smarter. They are shaped for different problems.",
    at: "Professors and schoolchildren" },

  { h: "Why this was built for video games" },
  { p: "GPUs were not invented for AI. They were invented so games could draw 3D graphics, and drawing 3D graphics means doing the same small arithmetic to two million pixels, sixty times a second. Every pixel is independent, so every pixel can be computed simultaneously." },
  { p: "That is the shape of problem GPUs were built for: **the same simple operation, applied to an enormous pile of numbers, all at once**. Nvidia spent two decades and a fortune making hardware that did exactly that, for teenagers who wanted better explosions." },

  { h: "And then the accident" },
  { p: "Neural networks — the thing under every modern AI system — are built almost entirely out of **matrix multiplication**. And matrix multiplication is: the same simple operation, applied to an enormous pile of numbers, all at once." },
  { p: "It is the identical shape. Researchers in the late 2000s realised the graphics cards sitting in gaming PCs were, by pure coincidence, close to the perfect machine for training neural networks. Not somewhat better — around a hundred times faster for this specific job." },
  { p: "That is the moment. Not a breakthrough in theory: most of the mathematics behind modern AI was published in the 1980s and earlier. What changed is that the hardware to run it at scale already existed, built by accident, for something else entirely." },

  { n: "This is worth internalising as a way of seeing the field. AI did not arrive because someone had a brilliant new idea. It arrived because old ideas met hardware that could finally afford them. Almost every leap since has followed the same pattern — an idea waiting for a machine. It is one of the reasons hardware literacy is worth more in this field than in any other kind of programming.",
    nt: "Ideas waiting for machines" },

  { h: "Where this shows up in AI" },
  { p: "This is not history. It is your daily working reality if you go into this field." },
  { ol: [
   "**When you train a model, you rent GPUs**, and they are expensive — often several dollars an hour each. Knowing why the job needs a GPU rather than a CPU is knowing what you are paying for.",
   "**When training is slow, the fix is usually feeding the GPU better**, not getting a faster GPU. A GPU starved of data sits idle, exactly like the waiting CPU from the last lesson.",
   "**When a model will not fit, you quantise it** — store each parameter in 1 byte instead of 2, halving the memory. That number came straight out of the previous lesson."
  ] },
  { p: "Three real engineering decisions, all of which follow from *a GPU is thousands of simple workers and it has its own limited memory*. You now know enough to follow the reasoning in a real infrastructure conversation, and you have not written a line of code yet." }
 ],
 k: [
  "A CPU has a few very capable cores; a GPU has thousands of simple ones that act in unison.",
  "GPUs were built for graphics: the same arithmetic applied to millions of pixels at once.",
  "Neural networks are mostly matrix multiplication, which has the identical shape — hence the accident.",
  "AI became practical when existing ideas met hardware that could afford them."
 ],
 r: ["GPU", "VRAM", "Matrix Multiplication", "Parallelism", "Quantisation"]
},

{
 t: "Everything Is Switches",
 m: "metal",
 lvl: "core",
 s: "The bottom of the stack. Below this there is only physics.",
 goal: [
  "Explain what a bit physically is",
  "Describe how numbers, text, images and sound are all the same thing underneath",
  "Say what a transistor does and why smaller is faster"
 ],
 b: [
  { p: "You have heard that computers work in ones and zeros. It is one of those facts everybody repeats and almost nobody has been shown, so it stays a slogan rather than an understanding. Let us fix that, because the ground floor of the building turns out to be the most beautiful part of it." },
  { p: "A **bit** is a switch. That is all. A tiny electrical switch that is either on or off. Not a symbol for on and off — an actual switch, made of silicon, roughly a few dozen atoms across." },

  { dg: "mc-bits" },

  { h: "From switches to everything" },
  { p: "One switch gives you two possibilities. Eight switches together — a **byte** — give you 256 combinations, because each added switch doubles the count." },
  { p: "And then comes the only real trick in the whole of computing: **we decide what the patterns mean.**" },
  { ol: [
   "Agree that 01001000 means the number 72, and you have arithmetic.",
   "Agree that 72 means the letter *H*, and you have text.",
   "Agree that three numbers mean the redness, greenness and blueness of one dot, and you have images.",
   "Agree that a number means air pressure at one instant, and you have sound.",
   "Agree that a number is the strength of a connection in a neural network, and you have an AI model."
  ] },
  { p: "There is no photograph inside your computer. There are switches, and an agreement about how to read them. Every file format, every language, every standard, is a written-down agreement about what some pattern of switches means." },

  { ana: "Morse code is two things — a dot and a dash — and it carried the news of two world wars. The dots did not need to become richer to convey more. The code did the work. Binary is the same bargain, with switches instead of sounds, and agreements instead of a codebook.",
    at: "Dots and dashes" },

  { h: "What a transistor is" },
  { p: "The switch is a **transistor**: a component with no moving parts, which lets current through or blocks it depending on whether another current is applied. A switch operated by electricity rather than by a finger." },
  { p: "That is the whole invention. It is arguably the most consequential object of the twentieth century, and it does something a light switch does." },
  { p: "The CPU in your laptop contains somewhere between ten and a hundred **billion** of them. They are so small that their size is quoted in nanometres — a few dozen atoms across. Manufacturing them requires the most precise machines humans have ever built, in rooms cleaner than operating theatres, using light bent by mirrors polished to within a few atoms of perfect." },

  { n: "Smaller transistors are faster for a plain physical reason: electricity takes time to travel, and a shorter distance takes less time. Shrinking them also lets you fit more in the same space, and reduces the power each one needs. That single trend — smaller, therefore faster, cheaper and cooler — is what powered sixty years of computers improving. It is also why it is now slowing down: we are approaching sizes where atoms are simply too big.",
    nt: "Why smaller means faster" },

  { h: "Where this shows up in AI" },
  { p: "The word you will meet constantly is **precision** — how many bits are used for each number in a model. This lesson is the whole of it." },
  { ol: [
   "**FP32** — 32 bits per number. Very precise, and four bytes each.",
   "**FP16 / BF16** — 16 bits. Half the memory, slightly less precise, and the normal choice for training.",
   "**INT8** — 8 bits. A quarter of the original memory.",
   "**INT4** — 4 bits. An eighth. A model that needed 140 GB now needs about 35."
  ] },
  { p: "That is **quantisation**, one of the most-used techniques in practical AI, and it is nothing more than *use fewer switches per number and accept a little imprecision in exchange for fitting on the hardware you can afford*." },
  { p: "It is a direct trade between accuracy and memory, and now you can see exactly what is being traded — because you know what a bit is." }
 ],
 k: [
  "A bit is a physical switch — a transistor, a few dozen atoms across.",
  "Eight bits make a byte: 256 possible patterns.",
  "Numbers, text, images, sound and AI models are all patterns of switches plus an agreement about meaning.",
  "Precision is how many bits per number; quantisation trades accuracy for memory."
 ],
 r: ["Bit Manipulation", "Floating Point", "Unicode", "Quantisation", "Machine Code"]
},

{
 t: "The Traffic Between the Parts",
 m: "metal",
 lvl: "core",
 s: "The part nobody teaches, and the reason most slow things are slow.",
 goal: [
  "Explain what a bus is and why it is often the bottleneck",
  "Distinguish latency from bandwidth with an everyday example",
  "Say why moving data is frequently more expensive than computing on it"
 ],
 b: [
  { p: "Four lessons in, you know the parts. Here is the thing spec sheets never advertise and beginners never hear: the parts are rarely the problem. **The roads between them are.**" },
  { p: "The **bus** is the set of wires connecting everything — CPU to RAM, RAM to storage, CPU to GPU. Every byte that moves anywhere travels on it, and it has a hard capacity, and it is very often full." },

  { dg: "mc-run" },

  { h: "Two different words for slow" },
  { p: "People say a connection is *slow* and mean one of two completely different things. Getting them straight is one of those small distinctions that quietly marks out someone who knows what they are talking about." },
  { p: "**Latency** is how long one thing takes to arrive. **Bandwidth** is how much can arrive per second." },
  { ana: "A truck full of hard drives driving across a country has terrible latency — it takes two days — and staggering bandwidth, because it is carrying petabytes. A text message has superb latency and hopeless bandwidth. Neither is simply *fast*. Ask which one your problem needs.",
    at: "The truck full of drives" },
  { p: "This is not trivia. A model that responds in 200 milliseconds instead of 2 seconds is a latency win. A system that serves ten thousand users at once instead of a hundred is a bandwidth win. They are different engineering problems with different solutions, and confusing them wastes months." },

  { h: "Moving is more expensive than thinking" },
  { p: "Here is the fact that reorganises how you think about performance. On modern hardware, **fetching a number from RAM can cost more than a hundred arithmetic operations on it**." },
  { p: "Read that again, because it inverts the intuition almost everyone starts with. The calculation is nearly free. The *fetching* is what costs. Adding two numbers is trivial; going and getting them is the expensive part." },
  { p: "This is why professional performance work so often looks strange from outside. Engineers restructure code to touch memory in a tidy order, or do *more* arithmetic to avoid one extra trip to memory. They are not optimising the thinking. They are optimising the walking." },

  { trap: "The instinct is to speed up a slow program by reducing the number of calculations. Usually the real win is reducing the number of *trips* — reading data once instead of five times, keeping related things next to each other, doing all the work on a piece while you have it. Same answer, a fraction of the traffic." },

  { h: "Where this shows up in AI" },
  { p: "Modern AI is a memory-bandwidth problem far more than a computation problem, and now you have the vocabulary for why." },
  { p: "When a language model generates text, it produces one token at a time. For every single token, it must read **every parameter in the model** — all 140 GB of them for a 70B model — from GPU memory into the GPU's cores." },
  { p: "So the speed at which a model talks to you is not really set by how fast the GPU can calculate. It is set by how fast 140 GB can be pulled across a wire, over and over, once per word." },
  { p: "That single realisation is behind a large share of modern AI engineering:" },
  { ol: [
   "**Quantisation** halves or quarters the bytes that must be moved per token. Fewer bits, less traffic, faster output.",
   "**Batching** serves many users on one pass of the weights, so one expensive trip does thirty people's work rather than one.",
   "**KV caching** stores what has already been computed so the model does not redo — and re-fetch — the whole conversation for every new word."
  ] },
  { p: "Three cornerstone techniques, and all three are *reduce the traffic*. You met that idea one paragraph after meeting the word bus. Nothing has been dumbed down for you — this is the actual reasoning." }
 ],
 k: [
  "The bus carries everything between the parts, and is very often the real bottleneck.",
  "Latency is how long one thing takes; bandwidth is how much arrives per second. Different problems.",
  "Fetching a number from RAM can cost more than a hundred arithmetic operations on it.",
  "Most AI inference optimisation is traffic reduction: quantisation, batching, KV caching."
 ],
 r: ["Latency", "Throughput", "Cache", "KV Cache", "VRAM"]
},

{
 t: "From This Box to an AI Engineer",
 m: "metal",
 lvl: "core",
 s: "What you now understand, what the job actually is, and the honest route from here to there.",
 goal: [
  "Recognise how much real engineering vocabulary you already hold",
  "Describe what an AI engineer does day to day",
  "Know the next three steps, in order, without guessing"
 ],
 b: [
  { p: "Six lessons ago you had a warm box that ran things. Before going on to software, it is worth being shown what you picked up, because progress in learning to program is notoriously invisible while it is happening." },

  { h: "Read this and notice that it makes sense" },
  { q: "We're serving a quantised 70B on two A100s. Throughput was bad because we were memory-bandwidth bound, not compute bound — so we increased the batch size and turned on KV caching. Latency's up slightly, but we're serving eight times the users per GPU-hour." },
  { p: "That is a real sentence, of the kind said in real meetings, and a week ago it would have been noise. Go through it:" },
  { ol: [
   "**Quantised** — fewer bits per parameter, so it fits and moves faster. *(Lesson 5.)*",
   "**70B on two A100s** — 140 GB does not fit in 80, so it is split. *(Lesson 3.)*",
   "**Memory-bandwidth bound** — the limit is moving the weights, not calculating with them. *(Lesson 6.)*",
   "**Batch size** — serve many requests per expensive pass over the weights. *(Lesson 6.)*",
   "**Latency up, throughput up** — the two meanings of fast, traded against each other. *(Lesson 6.)*"
  ] },
  { p: "Every clause maps to something you have actually been taught. That is not a trick of presentation — the jargon in this field is unusually thin. It is ordinary physical reasoning about a machine, wearing acronyms." },

  { h: "What the job actually is" },
  { p: "Set aside the job title for a second. Day to day, an AI engineer does roughly this:" },
  { ol: [
   "**Gets data into a usable shape.** Realistically the largest share of the work, and the least glamorous. Everyone underestimates it, forever.",
   "**Wires models into products.** Taking something that produces good output in a notebook and making it survive real users, real failures and real bills.",
   "**Measures whether it actually works.** Evaluation is the skill that separates people who ship from people who demo.",
   "**Makes it affordable.** Which, as you now know, mostly means reducing traffic and fitting things into memory."
  ] },
  { p: "Notice what is not on that list: inventing new architectures. That is research, it is a different job, and it employs a tiny fraction of the people. The field is overwhelmingly engineering — and engineering is a thing you can learn deliberately, in order, starting from a lesson about a box on a desk." },

  { n: "Nobody arrives here already knowing this. Every engineer whose sentences sound effortless was, at some point, someone who did not know what RAM was. The difference between them and you is a number of months, not a kind of person. That is not encouragement — it is just the actual shape of how this goes.",
    nt: "The honest version" },

  { h: "When you do X, Y happens" },
  { p: "The thing that keeps people going is not motivation, it is **feedback** — the loop of doing something and watching the machine respond. It starts immediately and it never stops being satisfying:" },
  { ol: [
   "You write `print(\"hello\")` and run it → words you chose appear on a machine that did not have them a second ago. Small, and genuinely the whole thing in miniature.",
   "You write a loop → it does something ten thousand times, faster than you can blink. You have just done a week of manual work in a moment.",
   "You write your first script that renames five hundred files → you have automated a real chore out of your life, permanently.",
   "You call a model's API → the thing you have read about answers *you*, on your machine, in your program.",
   "You fine-tune a small model on your own data → it starts producing things nobody has produced before, because nobody had your data.",
   "You put it on the internet → strangers use a thing you made."
  ] },
  { p: "Each of those is a few weeks apart, not years. The first is achievable this afternoon. And every one of them runs on the five parts from lesson one — you now know where your code lives while it runs, and what it is running on." },

  { h: "Your next three steps, in order" },
  { ol: [
   "**Finish Ground Zero.** The next module explains what a program is now that you know what runs it, then the terminal, then your editor, then your first program. Do not skip to a language — this is the part that makes every tutorial afterwards readable.",
   "**Learn Python properly.** Not a weekend skim. It is the language of this field, and fluency in one language beats familiarity with four.",
   "**Build something small and finished.** Finished matters more than impressive. A tiny working thing teaches more than an ambitious half-thing, and this app's project tracks exist for exactly that."
  ] },
  { p: "That is the route. It is not short, but it is completely mapped, and none of it depends on being a certain kind of person." },
  { p: "You started this module not knowing what was inside your computer. You can now follow an infrastructure conversation. Go and meet the software." }
 ],
 k: [
  "You already hold real engineering vocabulary: quantisation, bandwidth, latency, batching, VRAM.",
  "The job is mostly data, integration, evaluation and cost — not inventing architectures.",
  "The reward loop starts on day one and compounds: print, loop, script, API, fine-tune, ship.",
  "Next: finish Ground Zero, learn Python properly, build something small and actually finished."
 ],
 r: ["VRAM", "Quantisation", "Latency", "Throughput", "Inference"]
}

]);
