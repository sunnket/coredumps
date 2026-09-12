/* Real-world examples and step-by-step flows — Emerging & Adjacent Tech. */
TD.attach("emerging-tech", {

"Blockchain": {
 ex: { h: "A very slow database with one unusual property",
       b: "By every ordinary measure it is worse than Postgres — slower, more expensive, harder to change. The one thing it offers is that no single party controls the history, which is valuable precisely when the participants do not trust each other and cannot agree on a custodian." },
 fl: { t: "Deciding whether you need one",
       s: ["You need shared state between organisations",
           { q: "Is there a party everyone already trusts to hold it?",
             y: "Use a database — it will be faster, cheaper and simpler in every respect",
             n: "No trusted custodian is the actual case for a blockchain" },
           { s: "Each block commits to the previous one by hash", n: "Altering old history invalidates every block after it." },
           { s: "Consensus decides which chain is canonical", n: "That mechanism is what actually costs the money and the energy." },
           "Data on-chain is public and permanent — that combination is a compliance problem, not a feature"] }
},

"Smart Contract": {
 ex: { h: "Code as the final arbiter, bugs included",
       b: "The DAO hack in 2016 drained $50 million through a reentrancy bug in deployed code that could not be patched. *Code is law* is not a slogan about ideals — it is a literal statement about what happens when the contract does something you did not intend." },
 fl: { t: "Deploying one responsibly",
       s: ["Write and test the contract exhaustively",
           { s: "Deployed bytecode is usually immutable", n: "There is no hotfix — this is not ordinary software deployment." },
           { q: "Does it call an external contract?",
             y: "Reentrancy risk — update your state before the external call, always",
             n: "Check arithmetic, access control and gas limits" },
           { s: "Get an independent audit before it holds value", n: "And treat the findings as blocking, not advisory." },
           { s: "Consider an upgrade proxy pattern", n: "Which reintroduces a trusted admin key — a real tradeoff, not a free fix." },
           "Every line costs gas to execute, so efficiency is a direct financial constraint"] }
},

"Ethereum Virtual Machine": {
 ex: { h: "A computer where every instruction has a price",
       b: "Thousands of nodes execute the same bytecode and must reach identical results, so the EVM is deterministic and metered. Gas is not a fee model bolted on — it is the mechanism that stops an infinite loop from halting the entire network." },
 fl: { t: "Executing a transaction",
       s: ["A transaction specifies a contract, data and a gas limit",
           { s: "Every opcode has a fixed gas cost", n: "Storage writes are dramatically more expensive than computation." },
           { q: "Does execution run out of gas?",
             y: "The whole transaction reverts — but the gas spent is not refunded",
             n: "State changes commit and unused gas is returned" },
           { s: "Every node runs it identically", n: "Which is why there is no randomness, no clock and no network access." },
           "Storage is the dominant cost — minimising on-chain state is the primary optimisation"] }
},

"Consensus Mechanism": {
 ex: { h: "Making agreement expensive on purpose",
       b: "Anyone can propose a version of history, so the network needs a way to make lying costly. Proof of work burns electricity; proof of stake risks capital. Both answer the same question: what does an attacker have to spend to rewrite the past?" },
 fl: { t: "How agreement is reached",
       s: ["Multiple valid histories are proposed",
           { q: "Which one does the network accept?",
             y: "Proof of work: the chain with the most accumulated computation",
             n: "Proof of stake: validators attest, and misbehaviour destroys their stake" },
           { s: "Both make attack economically irrational rather than impossible", n: "A 51% attack is a budget question, not a technical barrier." },
           { s: "Finality differs", n: "PoW is probabilistic — wait for confirmations; PoS chains can offer explicit finality." },
           "Ethereum's move to proof of stake cut its energy use by roughly 99.9%"] }
},

"Cryptocurrency": {
 ex: { h: "A bearer asset with no recovery process",
       b: "Lose the private key and the funds are gone — not frozen, not recoverable, gone. That absence of an intermediary is either the entire point or the fatal flaw, depending on whether you value censorship resistance or the ability to reverse a mistaken transfer." },
 fl: { t: "How a transfer actually works",
       s: ["A key pair is generated; the public key derives the address",
           { s: "The private key is the sole proof of ownership", n: "There is no account, no password reset, no support line." },
           { s: "A transaction is signed and broadcast to the network", n: "Anyone can verify the signature against the address." },
           { q: "Is it included in a block?",
             y: "Wait for confirmations — depth is what makes reversal impractical",
             n: "It sits in the mempool until a fee makes it attractive" },
           "Custodial exchanges hold your keys — convenient, and a reintroduction of exactly the trusted third party"] }
},

"Internet of Things": {
 ex: { h: "A million devices that outlive their vendor",
       b: "The Mirai botnet enrolled hundreds of thousands of cameras and routers using default credentials, and took down a large part of the internet's DNS. The difficulty is not building connected devices — it is patching them for a decade after the company that made them has moved on." },
 fl: { t: "Designing a fleet you can live with",
       s: ["Provision each device with a unique identity",
           { s: "Never a shared default password", n: "This single decision prevents most historical IoT compromises." },
           { s: "Devices connect outbound to a broker", n: "MQTT or similar — no inbound ports on a device behind a home router." },
           { q: "Can the device be updated in the field?",
             y: "Signed firmware over the air, with rollback on failure",
             n: "You have shipped a permanent vulnerability with a ten-year life" },
           { s: "Assume intermittent connectivity", n: "Buffer locally and reconcile when the link returns." },
           "Plan for end of life — an unmaintained fleet is a liability that keeps running"] }
},

"Edge Computing": {
 ex: { h: "The round trip you cannot afford",
       b: "A factory camera checking parts at 60fps cannot send every frame to a cloud region 80ms away. Processing locally and sending only the results cuts latency, bandwidth cost and privacy exposure at once — at the price of managing compute in a thousand awkward locations." },
 fl: { t: "Splitting work between edge and cloud",
       s: ["Identify what genuinely must be local",
           { q: "Does the decision need a sub-100ms response, or must the raw data stay on site?",
             y: "Run inference at the edge — send only the outcome",
             n: "Send it to the cloud, where compute is cheaper and easier to manage" },
           { s: "Train centrally, deploy to the edge", n: "Edge devices infer; they rarely train." },
           { s: "Model updates need the same care as firmware", n: "Signed, staged and rollback-capable." },
           "Edge fleets have no console access — observability has to be designed in from the start"] }
},

"Embedded Systems": {
 ex: { h: "Software with no operating system to hide behind",
       b: "A washing machine controller, an infusion pump, a car's brake module — code that runs for years without restarting, in kilobytes of RAM, where a memory leak is not a slow degradation but an eventual failure with physical consequences." },
 fl: { t: "Constraints that shape the code",
       s: ["Memory is fixed and small",
           { s: "Dynamic allocation is often banned outright", n: "Static buffers, no heap fragmentation, no surprises at hour 10,000." },
           { q: "Is there a hard timing requirement?",
             y: "An RTOS or a bare-metal loop with measured worst-case timing",
             n: "A superloop with interrupts may be entirely sufficient" },
           { s: "Debugging needs hardware", n: "JTAG, a logic analyser, or blinking an LED." },
           { s: "A watchdog timer resets a hung system", n: "The last line of defence, and it must be fed correctly." },
           "Field updates are risky — a failed flash can brick a device you cannot reach"] }
},

"Firmware": {
 ex: { h: "The software layer nobody sees and everyone trusts",
       b: "It runs before the operating system, with total hardware access, and it is signed precisely because malicious firmware survives a disk wipe and an OS reinstall. Updating it is also the riskiest routine operation a device performs — power loss mid-write can be fatal." },
 fl: { t: "A safe over-the-air update",
       s: ["The device downloads a signed image",
           { s: "Verify the signature before writing anything", n: "Unsigned firmware update is a complete compromise path." },
           { s: "Write it to a second, inactive slot", n: "A/B partitioning — the running image is untouched." },
           { q: "Does the new image boot and pass self-checks?",
             y: "Mark it valid and switch permanently",
             n: "The bootloader falls back to the previous slot automatically" },
           "Never write over the only copy — that is what turns a failed update into a dead device"] }
},

"Microcontroller": {
 ex: { h: "A whole computer for under a pound",
       b: "Processor, memory, timers and I/O on one chip, drawing microamps when asleep. It is why a battery sensor can run for five years — the chip spends 99.9% of its life asleep and wakes for milliseconds at a time. Power budgeting, not clock speed, is the design problem." },
 fl: { t: "Designing for battery life",
       s: ["Compute the energy budget from the battery and the target lifetime",
           { s: "Everything else follows from that number", n: "Work backwards from years, not forwards from features." },
           { q: "What is the duty cycle?",
             y: "Sleep deep between events and wake on interrupt — this is where the savings are",
             n: "A polling loop will drain the battery in days" },
           { s: "Radio transmission dominates power use", n: "Batch and compress before sending." },
           "Measure actual current draw on hardware — datasheet figures assume ideal conditions"] }
},

"Real-Time Operating System": {
 ex: { h: "Predictable beats fast",
       b: "An airbag controller that responds in 5ms 99.99% of the time and 200ms occasionally is not acceptable. An RTOS guarantees a bounded worst case, which usually means lower average throughput — a trade Linux makes in the opposite direction." },
 fl: { t: "Meeting a deadline",
       s: ["Assign priorities to tasks by deadline urgency",
           { s: "Rate-monotonic: shorter period, higher priority", n: "There is real scheduling theory behind this." },
           { q: "Is a hard deadline involved — a missed one is a system failure?",
             y: "Hard real-time: the worst case must be analysed and proven",
             n: "Soft real-time: occasional misses degrade quality rather than causing failure" },
           { s: "Priority inversion is the classic hazard", n: "It delayed Mars Pathfinder; priority inheritance is the fix." },
           "The interesting number is worst-case latency, never the average"] }
},

"FPGA": {
 ex: { h: "Hardware you can rewrite",
       b: "It sits between a CPU and a custom chip: reconfigurable logic that runs genuinely in parallel, with deterministic latency measured in nanoseconds. High-frequency trading and prototype ASIC designs use them for exactly that — and you program them by describing circuits, not by writing sequential code." },
 fl: { t: "Choosing between a chip you design and one you buy",
       s: [{ s: "An ordinary processor runs whatever instructions you give it. A graphics card runs many copies of one instruction at once", n: "Both are fixed hardware running your software." },
           { s: "An FPGA is different: it is a blank chip whose internal wiring you configure", n: "You are not writing software for it. You are describing circuitry, which it then becomes." },
           { s: "An ASIC is the same idea made permanent — a chip manufactured for exactly one job", n: "Fastest and most efficient by far, and utterly unchangeable once made." },
           { q: "Is the job fixed forever, produced in enormous volume, and worth millions to optimise?",
             y: "Then a purpose-built chip wins. This is why Bitcoin miners and phone camera processors use them",
             n: "If the job might change, or the volume is modest, a configurable chip lets you rewire it next month instead of remanufacturing" },
           { s: "Choose a configurable chip when the timing must be exactly predictable, every single time", n: "Trading systems and medical devices care more about a guaranteed response time than about raw average speed." },
           { s: "Choose a graphics card when you have lots of similar calculations and no unusual timing requirement", n: "Which covers almost all machine learning." }] }
},

"ASIC": {
 ex: { h: "Committed silicon",
       b: "Bitcoin mining moved from CPUs to GPUs to FPGAs to ASICs within a few years, and each step made the previous hardware worthless. That is the ASIC bargain: enormous efficiency for one fixed task, a multi-million-pound tooling cost, and no possibility of changing your mind afterwards." },
 fl: { t: "The path to a chip",
       s: ["Prove the design works, usually on an FPGA first",
           { s: "Fixing a bug after fabrication means a new mask set", n: "Which is why verification consumes most of the schedule." },
           { s: "Synthesise, place and route, then tape out", n: "Tape-out is the point of no return." },
           { q: "Will volume justify the fixed cost?",
             y: "Per-unit cost and power are unbeatable at scale",
             n: "An FPGA or a GPU will be cheaper overall" },
           "Design cycles run to years — the requirements must be genuinely stable"] }
},

"TPU": {
 ex: { h: "A chip that mostly does one thing",
       b: "A large systolic array of multiply-accumulate units, built because Google worked out that adding voice search to Android would otherwise have required doubling its data centres. It is fast for dense matrix work and comparatively inflexible everywhere else." },
 fl: { t: "When a TPU fits",
       s: ["Check the shape of the computation",
           { q: "Is it large dense matrix multiplication with standard operations?",
             y: "TPUs excel — and large batch sizes are needed to keep the array fed",
             n: "Custom kernels and dynamic shapes are far easier on a GPU" },
           { s: "They are available through Google Cloud, not on the shelf", n: "Which is a strategic consideration as much as a technical one." },
           { s: "Reduced-precision arithmetic is native", n: "bfloat16 is used throughout, deliberately." },
           "Software support is narrower than CUDA's — check your framework before committing"] }
},

"CUDA": {
 ex: { h: "The real reason NVIDIA dominates AI",
       b: "The hardware is excellent and the moat is the software: fifteen years of libraries, tooling and every framework targeting CUDA first. Competitors have produced comparable silicon and still cannot match an ecosystem that every researcher already has installed." },
 fl: { t: "How work actually reaches the graphics card",
       s: [{ s: "The card has its own memory, entirely separate from your computer's main memory", n: "It cannot see your data until you copy it across." },
           { s: "So first, reserve space on the card and copy the data over", n: "For small jobs this copying takes longer than the calculation. Keep data on the card between steps rather than shuttling it back and forth." },
           { s: "Then launch your calculation across thousands of workers at once", n: "You write the code for one worker; the card runs it simultaneously on thousands of different pieces of data." },
           { s: "Workers are handled in small fixed groups that must all do the same thing at the same moment", n: "This is where the speed comes from — one instruction driving many workers." },
           { q: "What if your code has an `if` and workers in a group disagree?",
             y: "The group runs both branches in turn, with the wrong workers idling through each — so a branch can halve your speed",
             n: "Which is why code written for these cards avoids branching wherever it can" },
           { s: "Finally, copy the results back to main memory", n: "And that transfer costs again, which is why you batch as much work as possible before bringing anything home." }] }
},

"Quantum Computing": {
 ex: { h: "Real, narrow, and heavily oversold",
       b: "For factoring large numbers and simulating molecules, a sufficiently large quantum computer would be transformative. For your database, your web app or your neural network, it offers nothing at all — and current machines are too noisy for useful work regardless." },
 fl: { t: "Where it would actually help",
       s: ["Identify the problem's structure",
           { q: "Is it factoring, discrete logarithms, or quantum simulation?",
             y: "Exponential speedup in principle — this is the genuine case",
             n: "Unstructured search gets only a quadratic speedup; most problems get nothing" },
           { s: "Qubits decohere in microseconds", n: "Error correction may need a thousand physical qubits per logical one." },
           { s: "Results are probabilistic", n: "Run many times and take the distribution." },
           "The practical consequence today is post-quantum cryptography, not quantum applications"] }
},

"Qubit": {
 ex: { h: "Not simply *both at once*",
       b: "The popular framing — a qubit is 0 and 1 simultaneously — misleads more than it explains. A qubit holds a combination with amplitudes, and the algorithms work by arranging for wrong answers to cancel each other out. Measurement then collapses it to a single classical bit." },
 fl: { t: "What a computation involves",
       s: ["Initialise qubits to a known state",
           { s: "Superposition lets n qubits represent 2ⁿ amplitudes", n: "Which is not the same as storing 2ⁿ answers you can read." },
           { s: "Gates evolve the amplitudes; entanglement links qubits", n: "The algorithm is designed so wrong answers interfere destructively." },
           { q: "Measure?",
             y: "It collapses to one classical outcome — you get n bits, not 2ⁿ",
             n: "Any stray interaction with the environment collapses it anyway" },
           "Physical qubits are extremely noisy — the useful count is logical, error-corrected qubits"] }
},

"Post-Quantum Cryptography": {
 ex: { h: "Harvest now, decrypt later",
       b: "An adversary recording encrypted traffic today can decrypt it once a sufficiently capable quantum computer exists. For anything that must stay secret for twenty years, the threat is present-tense — which is why NIST standardised replacement algorithms before the machine that breaks the old ones exists." },
 fl: { t: "Preparing for the transition",
       s: ["Inventory where public-key cryptography is used",
           { s: "TLS, code signing, VPNs, document signatures", n: "You cannot migrate what you have not found." },
           { q: "Does any data need confidentiality beyond a decade?",
             y: "Migrate first — that data is already exposed to recording",
             n: "Plan the transition, and prefer hybrid modes meanwhile" },
           { s: "Symmetric cryptography is largely fine", n: "Doubling AES key length restores the margin." },
           { s: "Hybrid schemes run classical and PQC together", n: "Safe if either one holds." },
           "Design for crypto-agility — the ability to swap algorithms is the durable capability"] }
},

"Extended Reality": {
 ex: { h: "The 20ms rule",
       b: "If the view lags head movement by more than about 20 milliseconds, a meaningful share of users feel sick. That single constraint dictates the rendering budget, the tracking hardware and the entire software architecture — and it is why XR is a latency problem before it is a graphics one." },
 fl: { t: "Building something usable",
       s: ["Track head and hand position continuously",
           { s: "Inside-out tracking with onboard cameras is now standard", n: "No external base stations required." },
           { q: "Can you hold 90fps consistently?",
             y: "Comfortable — budget roughly 11ms per frame, for both eyes",
             n: "Reduce fidelity; a dropped frame is nausea, not a visual blemish" },
           { s: "Foveated rendering saves work", n: "Full detail only where the eye is looking." },
           { s: "Design for comfort", n: "Teleport movement, seated options, no forced camera motion." },
           "Test on real users early — motion sensitivity varies enormously between people"] }
},

"Digital Twin": {
 ex: { h: "A model of the turbine, fed by the turbine",
       b: "Sensor data streams into a simulation of the physical asset, so you can ask *what happens if I run it 10% harder* without running it 10% harder. Its accuracy decays exactly as fast as the model drifts from reality — keeping it calibrated is the whole ongoing cost." },
 fl: { t: "Building and maintaining one",
       s: ["Build a physics or data-driven model of the asset",
           { s: "Validated against the real thing", n: "An uncalibrated twin is a simulation with a marketing name." },
           { s: "Stream live sensor data into it continuously", n: "This is what makes it a twin rather than a model." },
           { q: "Do predictions diverge from observed behaviour?",
             y: "Recalibrate — and the divergence itself is often the anomaly signal you wanted",
             n: "Use it for what-if analysis and predictive maintenance" },
           "Instrumentation quality caps the whole thing — bad sensors, bad twin"] }
},

"Robotics": {
 ex: { h: "Moravec's paradox, in a warehouse",
       b: "Chess is easy for machines and picking up an unfamiliar object is hard — perception and manipulation turn out to be the difficult problems, not reasoning. A warehouse robot navigating reliably is impressive engineering; one that can grasp any item on any shelf is still an open problem." },
 fl: { t: "The sense-plan-act loop",
       s: ["Sense: cameras, lidar, encoders, force sensors",
           { s: "All noisy, all needing fusion into one estimate", n: "Kalman filters and their descendants live here." },
           { s: "Localise and build a map of the environment", n: "SLAM — doing both simultaneously." },
           { q: "Is the environment structured and predictable?",
             y: "Classical planning works well — most deployed robots live here",
             n: "Unstructured environments are where learning-based control is genuinely needed" },
           { s: "Act, then sense again immediately", n: "The world does not do what the model predicted." },
           "Safety is not a layer on top — for anything sharing space with people it is the architecture"] }
},

"Robot Operating System": {
 ex: { h: "Not an operating system at all",
       b: "It is middleware: a message bus, a package system and a set of conventions so a navigation stack from one lab works with a driver from another. ROS 1 was research-grade; ROS 2 rebuilt the communications layer on DDS for real-time and multi-robot use." },
 fl: { t: "How a ROS system is structured",
       s: ["Each capability is a node — a separate process",
           { s: "Camera driver, perception, planner, motor controller", n: "Independent, and individually restartable." },
           { s: "Nodes publish and subscribe to named topics", n: "Publishers do not know who is listening." },
           { q: "Need a request and a response?",
             y: "Use a service or an action — actions handle long-running goals with feedback",
             n: "Topics for continuous streams" },
           { s: "Record everything to a bag file", n: "Replaying real sensor data is how robotics debugging actually works." },
           "ROS 2 for anything new — real-time support and security were the reasons it was rewritten"] }
},

"WebAssembly": {
 ex: { h: "Photoshop in a browser tab",
       b: "A C++ codebase compiled to a binary format that runs at near-native speed in a sandbox. It was built for the browser and turned out to be just as useful outside it — a fast, safe, language-agnostic sandbox is exactly what edge platforms and plugin systems needed." },
 fl: { t: "Where it fits",
       s: ["Compile from C, C++, Rust or Go to a `.wasm` module",
           { q: "Is the work compute-heavy — codecs, simulation, image processing?",
             y: "Wasm is a strong fit; JavaScript is genuinely slower for this",
             n: "For DOM-heavy UI work, JavaScript is simpler and often faster" },
           { s: "It has no direct DOM or system access", n: "Everything goes through explicit imports — that is the sandbox." },
           { s: "WASI defines a system interface outside the browser", n: "Which is what makes edge runtimes and plugin hosts possible." },
           "Module size matters on the web — a large binary trades startup time for execution speed"] }
},

"5G": {
 ex: { h: "Three networks sold as one number",
       b: "Low-band 5G covers wide areas and is barely faster than good 4G. Millimetre-wave delivers the gigabit headlines and struggles to pass through a window. The genuinely new capability is neither speed nor coverage — it is device density and low-latency slices for industrial use." },
 fl: { t: "What you actually get",
       s: ["Check which band the coverage uses",
           { q: "Millimetre-wave?",
             y: "Very high bandwidth over a few hundred metres, blocked by walls and rain",
             n: "Sub-6GHz — a solid improvement over 4G, not a transformation" },
           { s: "Network slicing reserves capacity for a use case", n: "Which is the feature industrial customers are actually buying." },
           { s: "Edge computing pairs with it", n: "Low radio latency is wasted on a distant data centre." },
           "Do not design a product around gigabit mobile speeds — real-world throughput is far lower"] }
},

"High-Performance Computing": {
 ex: { h: "Weather forecasting has a hard deadline",
       b: "Tomorrow's forecast is worthless if it takes 26 hours to compute. HPC exists for problems that are one enormous coupled calculation — climate, crash simulation, protein folding — where the machines are tightly interconnected precisely because the parts cannot be computed independently." },
 fl: { t: "How an HPC job runs",
       s: ["Submit a job to a scheduler with a resource request",
           { s: "Nodes, cores, memory, wall time — and you queue", n: "Slurm or PBS allocates when resources free up." },
           { s: "The job runs across many nodes, communicating via MPI", n: "Explicit message passing between processes." },
           { q: "Does adding nodes stop helping?",
             y: "Communication dominates — Amdahl's law is the ceiling, and it is unforgiving",
             n: "Scale further; check the interconnect is not saturated" },
           { s: "Checkpoint periodically", n: "A week-long job needs to survive a node failure." },
           "It differs from cloud fundamentally: tightly coupled and interconnect-bound, not embarrassingly parallel"] }
},

"Mainframe": {
 ex: { h: "The 1970s hardware processing your card payment",
       b: "Banks and insurers still run mainframes because nothing else matches their transaction throughput and reliability — measured in decades of uptime. They persist not from inertia but because the migration risk on a system handling millions of transactions an hour is genuinely enormous." },
 fl: { t: "Why they have not been replaced",
       s: ["Assess what the machine actually does",
           { s: "Enormous transaction volumes with hardware redundancy throughout", n: "Designed for continuous availability, not for scale-out." },
           { q: "Is a full rewrite proposed?",
             y: "Decades of undocumented business rules live in that COBOL — this is the highest-risk project in enterprise IT",
             n: "Wrap it in APIs and modernise incrementally around it" },
           { s: "COBOL expertise is scarce and ageing", n: "Which is a workforce risk, not a technology one." },
           "The strangler pattern applies here as much as anywhere — move functionality out gradually"] }
},

"Expert System": {
 ex: { h: "The AI approach that worked and did not scale",
       b: "MYCIN diagnosed blood infections in the 1970s at the level of a specialist, using explicit rules a doctor could inspect. The knowledge acquisition bottleneck killed the approach: encoding expertise by hand is slow, and the rules do not generalise beyond exactly what was written." },
 fl: { t: "Rules or a model?",
       s: ["Look at how the knowledge exists today",
           { q: "Is it written down as explicit rules — regulation, policy, tax law?",
             y: "A rule engine: auditable, explainable, and correct by construction",
             n: "Is it tacit and pattern-based? Then machine learning" },
           { s: "Rules explain themselves", n: "Which is decisive in regulated decisions." },
           { s: "They do not degrade gracefully", n: "An unanticipated case gets no answer at all." },
           "Hybrids are common and sensible — a model proposes, rules constrain what it may do"] }
},

"Neuromorphic Computing": {
 ex: { h: "Chips that only work when something changes",
       b: "A conventional camera sends 30 full frames a second whether or not anything moved. An event camera and a spiking chip fire only on change — which for always-on sensing means milliwatts instead of watts, and a fundamentally different programming model." },
 fl: { t: "Why the efficiency comes",
       s: ["Neurons fire only when their input crosses a threshold",
           { s: "No clock stepping every element every cycle", n: "Idle regions consume almost nothing." },
           { s: "Memory sits with computation", n: "Avoiding the von Neumann bottleneck that dominates conventional energy use." },
           { q: "Is your data naturally sparse and event-driven?",
             y: "Neuromorphic hardware fits — always-on audio, event cameras, tactile sensing",
             n: "Dense batched matrix work is what GPUs are for" },
           "Tooling is immature — training spiking networks is nothing like training a standard one"] }
},

"Brain-Computer Interface": {
 ex: { h: "A cursor moved by intention",
       b: "Paralysed patients with implanted arrays have controlled cursors and robotic arms for two decades — the medical case is real and established. Non-invasive consumer headsets read a far coarser signal through the skull, which is why their capabilities are correspondingly modest." },
 fl: { t: "From neural signal to action",
       s: ["Record electrical activity from the cortex",
           { q: "Invasive or not?",
             y: "Implanted electrodes: high fidelity, surgical risk, and scarring degrades signal over time",
             n: "EEG through the skull: safe, and a much blurrier signal" },
           { s: "Decode intent from the pattern", n: "A model trained per individual — signals are not transferable." },
           { s: "Recalibrate regularly", n: "Signals drift day to day as tissue and electrodes change." },
           "Neural data is the most sensitive category imaginable — the ethics and law are still being written"] }
},

"Green Computing": {
 ex: { h: "Data centres use roughly 1–2% of global electricity",
       b: "The largest single lever is usually not the hardware but the software: an inefficient query running a billion times a day costs real megawatt-hours. After that, scheduling flexible work for when the grid is cleanest is the highest-impact change most teams can actually make." },
 fl: { t: "Reducing computing's footprint",
       s: ["Measure before optimising",
           { s: "Cloud providers publish per-service carbon data", n: "Without measurement it is guesswork and marketing." },
           { q: "Is the workload time-flexible — training, batch, backups?",
             y: "Schedule it when and where the grid is cleanest — often the single biggest reduction",
             n: "Optimise the code and right-size the instances" },
           { s: "Idle resources are pure waste", n: "Autoscaling and shutting down non-production overnight." },
           { s: "Manufacturing carbon is significant", n: "Extending hardware life often beats replacing it with something more efficient." },
           "Efficient code is the underrated lever — a 10x faster query is a 10x smaller footprint"] }
},

"Bioinformatics": {
 ex: { h: "A genome is three gigabytes of a four-letter alphabet",
       b: "Sequencing produces millions of short overlapping reads that must be assembled or aligned against a reference. It is a string-algorithms problem at enormous scale — and the field's real bottleneck moved from generating data to storing, moving and interpreting it." },
 fl: { t: "A typical analysis pipeline",
       s: ["Sequencing produces millions of short reads with quality scores",
           { s: "Quality control and trimming first", n: "Errors at the read ends propagate into every downstream conclusion." },
           { s: "Align reads to a reference genome", n: "Or assemble de novo if no reference exists." },
           { q: "Does a position differ from the reference?",
             y: "Variant calling — with confidence, because sequencing errors look similar",
             n: "Move to annotation: what genes and functions are affected" },
           { s: "Pipelines are long and reproducibility is essential", n: "Which is why Nextflow and Snakemake exist." },
           "Genomic data is identifying and permanent — the privacy obligations are unusually strict"] }
},

"Signal Processing": {
 ex: { h: "The maths behind noise cancellation",
       b: "Headphones sample the outside world, compute the inverse waveform and play it, all in under a millisecond. The same toolkit — Fourier transforms, filters, sampling theory — underlies audio, radio, imaging, seismology and every sensor pipeline you will ever build." },
 fl: { t: "Working with a sampled signal",
       s: ["Sample at more than twice the highest frequency present",
           { s: "Nyquist — and an anti-aliasing filter before the converter", n: "Aliased frequencies cannot be removed afterwards; they are indistinguishable." },
           { s: "Transform to the frequency domain to see what is there", n: "The FFT is the workhorse of the entire field." },
           { q: "Is unwanted content in a separable frequency band?",
             y: "Filter it — low-pass, high-pass or notch",
             n: "Overlapping bands need adaptive filtering or source separation" },
           { s: "Filters introduce phase delay", n: "Which matters enormously in real-time and control applications." },
           "Windowing before an FFT prevents spectral leakage — a very common beginner omission"] }
},

"Oracle": {
 ex: { h: "The bridge, and the weakest link",
       b: "A blockchain cannot see the outside world, so an insurance contract paying out on rainfall needs someone to report the rainfall. That reporter becomes the single point of trust in an otherwise trustless system — and manipulating the price feed is how most large DeFi exploits actually work." },
 fl: { t: "Getting external data on-chain",
       s: ["A contract needs a real-world value",
           { q: "Is it from a single source?",
             y: "That source can be compromised or bribed — the whole contract inherits its trust",
             n: "Aggregate many independent reporters and take a median" },
           { s: "Use time-weighted averages for prices", n: "A momentary spike should not trigger liquidations." },
           { s: "Reporters stake collateral", n: "So false reporting is economically punished." },
           "The oracle problem is fundamental, not a bug — every external dependency reintroduces trust"] }
},

"Federated Learning": {
 ex: { h: "Your keyboard learns without sending your messages",
       b: "The model goes to the phone, trains on local text overnight while charging, and sends back a weight update rather than the text. Millions of updates are averaged into a new global model — and the raw data never leaves the device that produced it." },
 fl: { t: "One training round",
       s: ["The server sends the current model to a sample of devices",
           { s: "Only devices that are idle, charging and on wifi", n: "Otherwise you are spending users' battery and data." },
           { s: "Each trains locally on its own data", n: "The data never leaves the device." },
           { s: "Devices send back model updates, which are averaged", n: "Federated averaging." },
           { q: "Could an update leak information about the data?",
             y: "Yes — add differential privacy noise and secure aggregation",
             n: "Publish the new global model and repeat" },
           "Non-identical data distributions across devices make convergence harder than centralised training"] }
},

"Differential Privacy": {
 ex: { h: "Provable deniability, bought with noise",
       b: "The guarantee is precise: the published result is almost identical whether or not your record was included, so nothing about you can be inferred from it. Apple and the US Census both use it — and the noise it requires is a genuine, measurable loss of accuracy." },
 fl: { t: "Applying it to a query",
       s: ["Determine the query's sensitivity",
           { s: "How much can one individual change the answer?", n: "A count changes by 1; an average with an unbounded value can change without limit — clip it." },
           { s: "Add calibrated random noise to the result", n: "Scaled to sensitivity and to epsilon, the privacy parameter." },
           { q: "Is epsilon small?",
             y: "Stronger privacy, noisier and less useful results — this is the whole tradeoff",
             n: "Better accuracy, weaker guarantee" },
           { s: "Every query spends privacy budget", n: "Repeated queries eventually reveal the answer regardless." },
           "Anonymisation without it has repeatedly failed — re-identification from *anonymous* datasets is routine"] }
}

});
