/* ==========================================================================
   Depth pass 27 — the last of the advanced tier: specialised hardware,
   blockchain infrastructure, and applied computing domains.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "asic",

      why: {
        before: "General-purpose processors run any program, and pay for that " +
          "flexibility on every instruction: fetch, decode, register files, " +
          "branch prediction, caches sized for unknown workloads.",
        problem: "When you run **one** computation billions of times — mining " +
          "a hash, encoding video, multiplying matrices — that overhead is the " +
          "majority of the energy and area. A CPU spends most of its silicon " +
          "on being able to do something else.",
        shift: "Design the circuit for exactly that computation and " +
          "manufacture it. No instruction fetch, no decode, no generality — " +
          "just the datapath the algorithm needs, replicated as many times as " +
          "the die allows. You buy **100–1000× efficiency** and give up the " +
          "ability to change your mind."
      },

      num: {
        t: "The economics, not the technology",
        h: ["", "FPGA", "ASIC"],
        r: [
          ["NRE (design + masks)", "~0", "**$1M – $100M+**"],
          ["Time to first silicon", "days", "**12–24 months**"],
          ["Unit cost at volume", "high", "**very low**"],
          ["Efficiency vs CPU", "10–100×", "**100–1000×**"],
          ["Changeable after tape-out", "**yes**", "**never**"],
          ["Break-even volume", "—", "**typically 10k–1M+ units**"]
        ],
        n: "The **non-recurring engineering** cost is the whole decision. Mask " +
          "sets alone run into millions at leading process nodes, and that is " +
          "spent before a single working chip exists. It is therefore a " +
          "**volume** calculation: divide NRE by expected units and compare " +
          "against the FPGA unit-cost premium. A bug found after tape-out means " +
          "a **respin** — another mask set, another several months — which is " +
          "why verification consumes the majority of an ASIC project's effort " +
          "and why formal methods are standard practice there. Bitcoin is the " +
          "clearest case study: general-purpose mining became economically " +
          "impossible within about two years of ASICs arriving, because a " +
          "1000× efficiency gap cannot be competed with."
      },

      miss: [
        {
          w: "An ASIC is just a faster chip.",
          r: "It is a chip that does **one thing** and cannot do anything else. " +
            "A Bitcoin mining ASIC computes SHA-256 and is worthless for " +
            "anything else, including mining a different algorithm. Speed is " +
            "the consequence of specialisation, not the definition."
        },
        {
          w: "You can prototype on an FPGA and tape out the same design.",
          r: "The RTL largely transfers and the **timing does not**. FPGAs and " +
            "ASICs have completely different timing characteristics, clock " +
            "distribution and memory primitives. Significant re-verification " +
            "and physical design work follows, and FPGA-proven does not mean " +
            "ASIC-ready."
        },
        {
          w: "Modern chips are all ASICs, so the term means little.",
          r: "The term is used for **application-specific** designs as opposed " +
            "to general-purpose processors and reconfigurable logic. A GPU is a " +
            "custom chip and is programmable, so it sits between. A TPU is " +
            "closer to an ASIC — fixed function, no general programmability."
        },
        {
          w: "Once designed, manufacturing is straightforward.",
          r: "**Yield** is a live problem: defects mean a fraction of dies are " +
            "unusable, and yield falls with die size and improves as a process " +
            "matures. This is why chips are sold in **binned** grades — the " +
            "partially-defective dies become the cheaper product rather than " +
            "waste."
        }
      ],

      trade: {
        buys: [
          "100–1000× better performance per watt than general-purpose silicon.",
          "Very low unit cost at volume.",
          "Smallest possible die area and power.",
          "The only option for extreme efficiency requirements."
        ],
        costs: [
          "Enormous up-front NRE.",
          "12–24 months to first silicon.",
          "Completely fixed — a bug means a respin.",
          "Requires specialist design and verification teams.",
          "Yield risk and binning."
        ],
        avoid: [
          "Volume is below the break-even point — use an **FPGA**.",
          "The algorithm may change — cryptographic standards, evolving " +
            "models.",
          "Time to market matters more than efficiency.",
          "A GPU or existing accelerator is good enough, which it usually is."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "qubit",

      why: {
        before: "A classical bit is definitively 0 or 1. Every computation is " +
          "a deterministic sequence of such states.",
        problem: "Simulating a quantum system on classical bits requires " +
          "tracking **2ⁿ complex amplitudes** for n particles — 50 particles " +
          "exceeds any classical computer. The representation is exponentially " +
          "wrong for the physics.",
        shift: "Use a physical system that is *already* quantum. A qubit exists " +
          "in **superposition** — a weighted combination `α|0⟩ + β|1⟩` — so n " +
          "qubits hold 2ⁿ amplitudes simultaneously. The catch is that " +
          "**measurement collapses it** to a single classical outcome, chosen " +
          "at random by `|α|²`, so the amplitudes are not directly readable."
      },

      num: {
        t: "The gap between physical and useful",
        h: ["Property", "Today", "Needed for Shor on RSA-2048"],
        r: [
          ["Physical qubits", "~100–1,500", "**~10⁶–10⁷**"],
          ["Gate error rate", "~10⁻³", "**~10⁻¹⁵ logical**"],
          ["Physical per logical qubit", "—", "**~1,000**"],
          ["Coherence time", "µs to ms", "long enough for the circuit"]
        ],
        n: "The **1,000 physical qubits per logical qubit** figure is the " +
          "single most important number in the field, and it comes from " +
          "quantum error correction: qubits decohere and gates are imprecise, " +
          "so a logical qubit must be encoded redundantly across many physical " +
          "ones with continuous error detection. That is why *qubit count* " +
          "headlines are misleading — a machine with 1,000 noisy physical " +
          "qubits may have **one** usable logical qubit or none. **Coherence " +
          "time** is the other hard constraint: superposition survives only " +
          "microseconds to milliseconds before environmental interaction " +
          "destroys it, which bounds how long a circuit can run. Entanglement " +
          "is the third resource — correlations with no classical analogue, " +
          "and what algorithms actually exploit."
      },

      miss: [
        {
          w: "A qubit is both 0 and 1 at the same time.",
          r: "It is in a **superposition** — a specific complex-weighted " +
            "combination. *Both at once* suggests you get two answers; you get " +
            "**one**, randomly, on measurement. The useful content is in the " +
            "**amplitudes and their phases**, which is what interference " +
            "manipulates."
        },
        {
          w: "n qubits store 2ⁿ bits of information.",
          r: "They hold 2ⁿ **amplitudes** and you can extract only **n bits** " +
            "by measuring. This is Holevo's bound. The exponential is in the " +
            "state space you can *manipulate*, not in what you can read out — " +
            "and that distinction is why quantum algorithms are hard to design."
        },
        {
          w: "More qubits means a more powerful machine.",
          r: "**Quality dominates count.** A hundred high-fidelity, " +
            "long-coherence qubits outperform a thousand noisy ones. The " +
            "meaningful specifications are gate fidelity, coherence time and " +
            "connectivity; raw count alone is close to a marketing figure."
        },
        {
          w: "Qubits can transmit information faster than light via " +
            "entanglement.",
          r: "Entanglement produces **correlated random outcomes**, and " +
            "measuring one tells you nothing until you compare notes over a " +
            "classical channel. The **no-communication theorem** forbids using " +
            "it to signal. Quantum teleportation still requires sending two " +
            "classical bits."
        }
      ],

      trade: {
        buys: [
          "Exponentially large state space for structured problems.",
          "Genuine speed-ups for factoring and quantum simulation.",
          "Entanglement enables protocols with no classical equivalent.",
          "Quantum key distribution offers physics-based security."
        ],
        costs: [
          "Decoherence destroys states in microseconds.",
          "~1,000 physical qubits per usable logical one.",
          "Extreme physical requirements — millikelvin cooling.",
          "Measurement collapses the state, so readout is limited.",
          "Only a narrow set of problems benefits."
        ],
        avoid: [
          "Any current production workload.",
          "General computation — classical is better at nearly everything.",
          "You expect it to solve NP-complete problems efficiently.",
          "Planning on a short horizon, except for **post-quantum crypto " +
            "migration**, which is genuinely urgent."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "oracle",

      why: {
        before: "A smart contract executes deterministically — every node runs " +
          "the same code on the same inputs and must reach the same state, " +
          "which is what makes consensus possible.",
        problem: "That determinism **forbids reading the outside world**. A " +
          "contract cannot call an API, because each node would call at a " +
          "different moment and get a different answer, and consensus would " +
          "fail. So a contract paying out on a flight delay, a price, or a " +
          "match result cannot learn any of those things.",
        shift: "Push data **in** rather than pulling it out. An oracle is an " +
          "off-chain service that observes the world and writes the value into " +
          "a contract as a transaction, which then becomes part of the " +
          "consensus state. Determinism is preserved — every node sees the same " +
          "written value."
      },

      num: {
        t: "The trust problem, and how it is addressed",
        h: ["Design", "Trust", "Failure mode"],
        r: [
          ["Single oracle", "**total, in one party**", "lies, or goes offline"],
          ["**Decentralised network**", "**median of many**", "collusion, or all use one API"],
          ["Multiple independent sources", "aggregated", "correlated sources"],
          ["**TWAP** (time-weighted price)", "manipulation is costly", "slower to react"],
          ["Optimistic + challenge period", "economic", "delay before finality"]
        ],
        n: "The **oracle problem** is fundamental rather than incidental: a " +
          "blockchain guarantees the *execution* is correct and can say nothing " +
          "about whether the *input* was true. A decentralised contract fed by " +
          "one API is exactly as trustworthy as that API. This is not " +
          "theoretical — **oracle manipulation has caused repeated " +
          "nine-figure DeFi losses**, typically by using a flash loan to move " +
          "the price on a thin liquidity pool that a lending protocol was " +
          "reading as its price feed, then borrowing against the distorted " +
          "value. **TWAP** exists precisely because averaging over time makes " +
          "that attack require sustaining the manipulation, which is far more " +
          "expensive."
      },

      miss: [
        {
          w: "Using a decentralised oracle network removes the trust " +
            "requirement.",
          r: "It **distributes** it. You now trust that a majority of nodes " +
            "are honest and independent — and if they all read the same " +
            "underlying exchange API, the decentralisation is superficial. " +
            "Source diversity matters as much as node count."
        },
        {
          w: "The oracle problem is a solved engineering issue.",
          r: "It is **fundamental**. A blockchain cannot verify external " +
            "reality, so any external input is a trust assumption. The " +
            "mitigations reduce and reprice the risk; none eliminate it. It is " +
            "the point at which a *trustless* system stops being trustless."
        },
        {
          w: "Reading a price from a DEX on-chain avoids needing an oracle.",
          r: "An on-chain pool price **is** an oracle, and a notoriously " +
            "manipulable one — a flash loan can move a thin pool within a " +
            "single transaction. Spot pool prices as a feed have caused some of " +
            "the largest DeFi exploits on record."
        },
        {
          w: "Oracles are only needed for price data.",
          r: "Any external fact needs one: weather for parametric insurance, " +
            "sports results, shipment tracking, identity attestations, and " +
            "**randomness** — which is its own problem, since on-chain " +
            "randomness is manipulable by block producers and needs a VRF."
        }
      ],

      trade: {
        buys: [
          "Lets contracts respond to real-world events at all.",
          "Enables DeFi, parametric insurance and prediction markets.",
          "Decentralised networks reduce single-party trust.",
          "TWAP and aggregation make manipulation expensive."
        ],
        costs: [
          "Reintroduces a trust assumption into a trustless system.",
          "A frequent and expensive attack surface.",
          "Gas cost for every on-chain update.",
          "Latency — data is as fresh as the last write.",
          "Feed failure can freeze or break dependent protocols."
        ],
        avoid: [
          "The contract needs no external data — keep it fully on-chain.",
          "The data source is genuinely centralised, in which case ask whether " +
            "a blockchain is buying anything.",
          "You would use a spot DEX price as a feed — use TWAP or a " +
            "dedicated oracle.",
          "Latency requirements are tighter than block time."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "signal-processing",

      why: {
        before: "Signals — sound, images, sensor readings — were analysed as " +
          "sequences of values over time. Filtering meant averaging " +
          "neighbouring samples and hoping.",
        problem: "Many properties are invisible in the time domain. A recording " +
          "containing a 50Hz mains hum looks like noise in the waveform; " +
          "removing it by time-domain averaging blurs everything else too. " +
          "You cannot separate what you cannot distinguish.",
        shift: "**Change basis.** Fourier's result is that any signal can be " +
          "decomposed into a sum of sinusoids, and in that **frequency " +
          "domain** the hum is a single spike you can delete. The FFT computes " +
          "this in `O(n log n)` instead of `O(n²)`, and that algorithm is " +
          "arguably the most consequential in applied computing."
      },

      num: {
        t: "Sampling: the constraint everything rests on",
        h: ["Concept", "Rule", "Consequence"],
        r: [
          ["**Nyquist rate**", "**sample > 2× highest frequency**", "44.1kHz for 20kHz audio"],
          ["**Aliasing**", "under-sampling folds high into low", "**unrecoverable**"],
          ["Anti-alias filter", "low-pass **before** sampling", "mandatory, not optional"],
          ["FFT cost", "O(n log n)", "makes real-time practical"],
          ["Time-frequency", "**cannot localise both**", "the uncertainty principle"]
        ],
        n: "**Aliasing is irreversible and must be prevented before sampling.** " +
          "If a 30kHz tone is sampled at 44.1kHz it does not vanish — it " +
          "reappears as a spurious ~14kHz tone indistinguishable from real " +
          "signal, and no post-processing can remove it. That is why every ADC " +
          "has an analogue low-pass filter in front of it. The same phenomenon " +
          "is why wagon wheels appear to spin backwards on film, and why " +
          "downscaling an image without blurring first produces moiré. The " +
          "last row is the deep constraint: you cannot know both exactly when " +
          "something happened and exactly what frequency it was — a short " +
          "window gives good time resolution and poor frequency resolution, " +
          "which is why spectrograms and wavelets exist as compromises."
      },

      miss: [
        {
          w: "You can filter out aliasing after sampling.",
          r: "You cannot. Aliased content is **indistinguishable** from " +
            "genuine signal at the folded frequency — the information is gone. " +
            "The anti-alias filter must be **analogue and before** the " +
            "converter, which is why it is a hardware requirement rather than a " +
            "software step."
        },
        {
          w: "Sampling at exactly twice the highest frequency is sufficient.",
          r: "Nyquist requires **strictly greater** than twice, and real " +
            "systems need margin because practical filters have a transition " +
            "band rather than a brick wall. 44.1kHz for 20kHz audio provides " +
            "that margin; sampling at exactly 40kHz would not."
        },
        {
          w: "The FFT gives the frequencies present in a signal.",
          r: "It gives the frequency content **of the window you analysed**, " +
            "assuming that window repeats forever. A signal whose frequency " +
            "changes over time smears across bins, and discontinuities at the " +
            "window edges create **spectral leakage** — which is why windowing " +
            "functions (Hann, Hamming) exist."
        },
        {
          w: "Signal processing is a niche embedded topic.",
          r: "Convolution in a CNN **is** filtering. Spectrograms are the " +
            "standard input to speech models. Diffusion models are formulated " +
            "as noise processes. Time-series feature engineering is signal " +
            "processing under another name. The vocabulary transfers directly " +
            "into machine learning."
        }
      ],

      trade: {
        buys: [
          "Makes properties visible that the time domain hides.",
          "The FFT is fast enough for real-time work.",
          "A rigorous, decades-old theory with strong guarantees.",
          "Transfers directly into audio, imaging and ML."
        ],
        costs: [
          "Aliasing is unforgiving and must be prevented in hardware.",
          "Time-frequency resolution is fundamentally traded.",
          "Windowing artefacts require care.",
          "The mathematics is a real barrier — complex exponentials, " +
            "convolution theorems."
        ],
        avoid: [
          "The signal has no meaningful frequency structure.",
          "A simple time-domain threshold or moving average solves it.",
          "The data is not sampled from a continuous process at all.",
          "A learned model would extract the features and you have the data " +
            "to train it."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "high-performance-computing",

      why: {
        before: "Scientific computation ran on the largest single machine " +
          "available. More performance meant a faster processor.",
        problem: "Single-processor speed stopped scaling — Dennard scaling " +
          "ended around 2006, so clock speeds plateaued and further gains had " +
          "to come from parallelism. Meanwhile the problems (climate models, " +
          "molecular dynamics, fluid dynamics) grew without limit.",
        shift: "Couple thousands of machines with a **fast, low-latency " +
          "interconnect** and treat them as one computer. The distinguishing " +
          "feature against cloud computing is exactly that interconnect: HPC " +
          "workloads are **tightly coupled**, with nodes exchanging data every " +
          "few milliseconds, so network latency — not throughput — is the " +
          "binding constraint."
      },

      num: {
        t: "HPC against cloud",
        h: ["Property", "HPC cluster", "Typical cloud"],
        r: [
          ["Interconnect", "**InfiniBand, ~1µs latency**", "Ethernet, ~50–100µs"],
          ["Coupling", "**tight — MPI, frequent sync**", "loose, independent tasks"],
          ["Scheduling", "**batch, exclusive nodes**", "shared, on demand"],
          ["Filesystem", "parallel (Lustre, GPFS)", "object storage"],
          ["Failure model", "**restart from checkpoint**", "reschedule the task"],
          ["Bound by", "**latency and Amdahl**", "throughput and cost"]
        ],
        n: "**Amdahl's law** is the ceiling that governs everything here: if " +
          "5% of a program is inherently serial, the maximum speed-up is " +
          "**20×** no matter how many processors you add. That is why HPC " +
          "engineering is obsessive about removing synchronisation points and " +
          "overlapping communication with computation. The **checkpointing** " +
          "row is the other defining practice — at thousands of nodes running " +
          "for days, hardware failure is a certainty rather than a risk, so " +
          "jobs write state periodically and restart from the last checkpoint. " +
          "Gustafson's law is the optimistic counterpart: in practice people " +
          "scale the *problem* with the machine, and larger problems have " +
          "proportionally more parallel work."
      },

      miss: [
        {
          w: "HPC is just a large cloud deployment.",
          r: "The **interconnect** is the difference and it is not marginal. " +
            "HPC uses InfiniBand at around 1µs latency with RDMA; cloud " +
            "Ethernet is 50–100× slower. A tightly-coupled simulation that runs " +
            "well on InfiniBand can be **unusably slow** on standard cloud " +
            "networking."
        },
        {
          w: "Adding more nodes always makes the job finish sooner.",
          r: "**Amdahl's law** caps it, and past a point communication " +
            "overhead grows faster than the compute saved — adding nodes makes " +
            "the job **slower**. Every parallel application has a scaling " +
            "sweet spot that must be measured."
        },
        {
          w: "GPUs made HPC clusters obsolete.",
          r: "Modern supercomputers are **largely GPU-based** — GPUs are the " +
            "compute within HPC, not a replacement for it. What still " +
            "distinguishes HPC is coupling thousands of them with an " +
            "interconnect fast enough to exchange data every step."
        },
        {
          w: "You submit a job and it starts running.",
          r: "HPC clusters use **batch schedulers** (Slurm, PBS) with queues " +
            "that can be hours or days deep. You request nodes and a wall-clock " +
            "limit, and the job is killed if it exceeds it. That is a very " +
            "different operational model from on-demand cloud instances."
        }
      ],

      trade: {
        buys: [
          "Solves problems no single machine can hold.",
          "Microsecond interconnect makes tight coupling viable.",
          "Parallel filesystems handle enormous I/O.",
          "Mature tooling — MPI, OpenMP, domain libraries."
        ],
        costs: [
          "Amdahl's law caps achievable speed-up.",
          "Batch queues mean waiting, sometimes for days.",
          "Checkpointing is mandatory and adds I/O cost.",
          "Parallel programming is genuinely difficult.",
          "Very expensive infrastructure."
        ],
        avoid: [
          "The work is **embarrassingly parallel** — cloud is cheaper and " +
            "available now.",
          "It fits on one machine, or one machine with several GPUs.",
          "You need interactive or on-demand access.",
          "The bottleneck is I/O or data volume rather than compute coupling."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "bioinformatics",

      why: {
        before: "Biology was a laboratory science. Sequencing one gene was a " +
          "months-long project, and the results fitted in a notebook.",
        problem: "Sequencing cost collapsed faster than Moore's law — a human " +
          "genome went from **$3 billion** (2003) to roughly **$200** today. " +
          "The bottleneck moved decisively from **generating** data to " +
          "**analysing** it, and a single genome is around 100GB of raw reads.",
        shift: "Treat biology as a computational problem. Genomes are strings " +
          "over a four-letter alphabet, so sequence alignment, assembly and " +
          "search become **string algorithm** problems at enormous scale — and " +
          "the algorithms that make it tractable (Burrows-Wheeler transform, " +
          "FM-index, suffix arrays) are the same ones used in text search."
      },

      num: {
        t: "The scale, and what it forces",
        h: ["Quantity", "Figure", "Consequence"],
        r: [
          ["Human genome", "~3.2 billion base pairs", "~700MB compressed"],
          ["Raw sequencing output", "**~100GB per genome**", "storage dominates"],
          ["Read length (short-read)", "100–300 bp", "**assembly is a jigsaw**"],
          ["Cost per genome", "$3bn → **~$200**", "data grew faster than compute"],
          ["Alignment method", "**BWT / FM-index**", "same as text search"]
        ],
        n: "The **short reads** row is why assembly is hard: sequencers produce " +
          "millions of 100–300 base fragments from random positions, and " +
          "reconstructing the genome means solving an enormous overlap puzzle — " +
          "made worse by **repetitive regions**, where a repeated sequence " +
          "longer than the read length is fundamentally ambiguous. Long-read " +
          "technologies (PacBio, Oxford Nanopore) trade accuracy for read " +
          "length precisely to resolve this. The **BWT** row is the connection " +
          "worth noting: the Burrows-Wheeler transform, invented for " +
          "compression, underlies both `bzip2` and the aligners (BWA, Bowtie) " +
          "that map billions of reads to a reference — the same index structure " +
          "solving both problems."
      },

      miss: [
        {
          w: "Bioinformatics is applying standard machine learning to " +
            "biological data.",
          r: "A great deal of it is **classical algorithms at scale** — string " +
            "matching, dynamic programming for alignment (Smith-Waterman, " +
            "Needleman-Wunsch), graph algorithms for assembly. ML is " +
            "increasingly important and is one part of a broad field."
        },
        {
          w: "Sequencing a genome gives you the person's genetic information.",
          r: "It gives ~100GB of overlapping fragments that must be " +
            "**assembled or aligned**, then **variant called** to find " +
            "differences from a reference, then **annotated** to say what those " +
            "differences might mean. Each stage has real error rates, and the " +
            "interpretation step is the least reliable."
        },
        {
          w: "More data always improves the analysis.",
          r: "**Batch effects** are a defining problem: samples processed on " +
            "different days, machines or by different labs carry systematic " +
            "technical differences that can dominate the biological signal. " +
            "Combining datasets naively produces confident findings about " +
            "which laboratory processed the sample."
        },
        {
          w: "AlphaFold solved protein structure, so structural biology is " +
            "done.",
          r: "It predicts **static structures** with remarkable accuracy. " +
            "Proteins are dynamic, function through interactions and " +
            "conformational change, and are affected by binding partners and " +
            "environment. It was a genuine breakthrough on one well-defined " +
            "sub-problem."
        }
      ],

      trade: {
        buys: [
          "Makes genome-scale biology tractable at all.",
          "Classical string algorithms transfer directly.",
          "Cheap sequencing enables population-scale studies.",
          "Mature open tooling and public reference datasets."
        ],
        costs: [
          "Storage and compute costs are substantial.",
          "Batch effects and technical artefacts are pervasive.",
          "Repetitive regions are fundamentally hard to resolve.",
          "Requires genuine domain knowledge — the biology is not optional.",
          "Reproducibility is a known and serious problem."
        ],
        avoid: [
          "You lack biological domain expertise or a collaborator who has it.",
          "The question is answerable by a targeted assay rather than " +
            "whole-genome analysis.",
          "You are combining public datasets without accounting for batch " +
            "effects.",
          "Established pipelines exist — writing your own aligner is rarely " +
            "the right call."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "ethereum-virtual-machine",

      why: {
        before: "Bitcoin's scripting language is deliberately limited — no " +
          "loops, no unbounded computation — so every transaction's cost is " +
          "provable in advance and the network cannot be stalled.",
        problem: "That limitation forecloses general programmability. But " +
          "allowing arbitrary computation means the halting problem: a " +
          "contract could loop forever, and **every node in the network** would " +
          "hang trying to validate it.",
        shift: "Build a **deterministic, sandboxed, metered** virtual machine. " +
          "Every operation costs gas, the caller pays up front, and execution " +
          "halts when gas runs out — reverting state while keeping the fee. " +
          "Determinism is absolute: every node must reach byte-identical state, " +
          "so there is no floating point, no randomness, no clock and no I/O."
      },

      num: {
        t: "Constraints that shape everything",
        h: ["Property", "Value", "Why"],
        r: [
          ["Word size", "**256-bit**", "matches Keccak-256 hashes"],
          ["Architecture", "**stack machine**", "simple, deterministic"],
          ["Floating point", "**none**", "not bit-reproducible across platforms"],
          ["Randomness", "**none available**", "nodes must agree"],
          ["Storage cost", "20,000 gas per new slot", "state is replicated forever"],
          ["Execution", "**every node runs it**", "redundancy is the security model"]
        ],
        n: "The **256-bit word** is an unusual choice with real consequences: " +
          "it makes hash operations natural and makes ordinary arithmetic " +
          "expensive relative to a 64-bit machine, and it is why Solidity's " +
          "smaller integer types can cost *more* gas than `uint256` once " +
          "packing and masking are accounted for. The **every node runs it** " +
          "row is the deepest constraint: computation is replicated across " +
          "thousands of machines, which is why on-chain compute is roughly " +
          "**a million times more expensive** than a cloud VM and why the " +
          "design pressure is always to move work off-chain and verify " +
          "on-chain. The absence of randomness and clocks is not an oversight " +
          "— both would break consensus."
      },

      miss: [
        {
          w: "The EVM is slow because it is poorly optimised.",
          r: "It is slow because **every node executes every transaction** — " +
            "that replication *is* the security model. Optimising the " +
            "interpreter helps marginally; the cost is structural. This is why " +
            "rollups exist: execute once off-chain, prove or post the result " +
            "on-chain."
        },
        {
          w: "You can use a random number in a contract by hashing the block " +
            "hash.",
          r: "Block producers influence block hashes and timestamps, so any " +
            "such scheme is exploitable by the party producing the block — and " +
            "there is real money at stake. Secure randomness needs a **VRF " +
            "oracle** or a commit-reveal scheme."
        },
        {
          w: "EVM compatibility means contracts port between chains without " +
            "change.",
          r: "The bytecode runs, and **gas costs, opcodes, block times, " +
            "finality and precompiles differ** between chains and across " +
            "Ethereum hard forks. Contracts assuming specific gas costs or " +
            "timing can break. *EVM-compatible* is a strong claim about " +
            "bytecode and a weaker one about behaviour."
        },
        {
          w: "Optimising for gas is premature optimisation.",
          r: "Gas is **direct, permanent financial cost paid by every user on " +
            "every call**. A storage write costs about 4,000× an arithmetic " +
            "operation, so layout decisions have measurable economic " +
            "consequences. It is one of the few environments where " +
            "micro-optimisation is genuinely correct."
        }
      ],

      trade: {
        buys: [
          "Deterministic execution enabling consensus on results.",
          "Turing-complete programmability without halting risk, via gas.",
          "The largest smart contract ecosystem and tooling.",
          "Sandboxed — a contract cannot reach outside its state."
        ],
        costs: [
          "Enormously expensive computation relative to any normal machine.",
          "No floating point, randomness, clocks or external calls.",
          "256-bit words make ordinary arithmetic costly.",
          "Immutable once deployed — bugs are permanent.",
          "Storage costs make large on-chain data infeasible."
        ],
        avoid: [
          "The application does not need trustless execution — a database is " +
            "vastly cheaper.",
          "Computation is heavy — do it off-chain and verify.",
          "Data must be private; all state is public.",
          "You need randomness, precise timing or floating point."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "neuromorphic-computing",

      why: {
        before: "Neural networks run on von Neumann hardware — CPUs and GPUs " +
          "with memory separated from compute, processing dense matrices in " +
          "synchronised clock cycles.",
        problem: "That architecture is a poor match for what brains do. The " +
          "**von Neumann bottleneck** means most energy is spent moving " +
          "weights between memory and compute rather than on arithmetic. And " +
          "biological neurons are **event-driven** — they fire only when " +
          "something happens — where a GPU computes every activation for every " +
          "input regardless.",
        shift: "Build hardware that mirrors the structure: **memory colocated " +
          "with compute**, and **spiking** neurons that consume power only when " +
          "they fire. On sparse, event-driven workloads that gives energy " +
          "figures orders of magnitude below conventional hardware."
      },

      num: {
        t: "The comparison, and the honest caveat",
        h: ["Property", "GPU", "Neuromorphic (Loihi, TrueNorth)"],
        r: [
          ["Computation", "dense, clocked", "**sparse, event-driven**"],
          ["Memory", "separate from compute", "**colocated**"],
          ["Power on sparse workloads", "1×", "**100–1000× lower**"],
          ["Training", "**backprop, mature**", "**unsolved for spikes**"],
          ["Ecosystem", "**enormous**", "research-stage"],
          ["Human brain, for scale", "—", "**~20 watts**"]
        ],
        n: "The **training** row is why this remains research rather than " +
          "deployment. Backpropagation requires differentiable activations, and " +
          "a spike is a discontinuous event — so the algorithm that made deep " +
          "learning work does not directly apply. Workarounds exist (surrogate " +
          "gradients, converting a trained ANN to spikes, STDP local learning " +
          "rules) and none match backprop's effectiveness. The 20-watt brain " +
          "figure is the standing motivation: it performs work no datacentre " +
          "matches on a power budget smaller than a light bulb, and that gap is " +
          "architectural rather than a matter of process node."
      },

      miss: [
        {
          w: "Neuromorphic chips run neural networks faster.",
          r: "They run **spiking** neural networks with far lower energy on " +
            "**sparse, event-driven** workloads. On dense matrix multiplication " +
            "— what transformers and CNNs actually do — a GPU is far better. " +
            "It is a different computational model, not a faster " +
            "implementation of the same one."
        },
        {
          w: "They are more brain-like, so they will be more capable.",
          r: "Biological plausibility is not a guarantee of capability. " +
            "Aeroplanes do not flap. The argument for neuromorphic hardware is " +
            "**energy efficiency on suitable workloads**, and that case does " +
            "not depend on brain resemblance being intrinsically valuable."
        },
        {
          w: "You can port an existing model to neuromorphic hardware.",
          r: "ANN-to-SNN conversion exists and typically loses accuracy and " +
            "requires many timesteps per inference. Models designed as spiking " +
            "networks from the start do better and cannot be trained with " +
            "standard backpropagation. Neither path is a port."
        },
        {
          w: "It is ready for production use.",
          r: "It is **research-stage**. Loihi and SpiNNaker are research " +
            "platforms with small ecosystems and no mature toolchain. The " +
            "nearest thing to deployment is **event cameras** paired with " +
            "spiking processing for robotics, which is a genuine niche and a " +
            "small one."
        }
      ],

      trade: {
        buys: [
          "Orders of magnitude lower energy on sparse event-driven workloads.",
          "No von Neumann bottleneck — memory sits with compute.",
          "Naturally suited to always-on sensing at very low power.",
          "Native temporal processing."
        ],
        costs: [
          "No effective training algorithm for spiking networks.",
          "Poor fit for the dense workloads that dominate modern ML.",
          "Tiny ecosystem and immature tooling.",
          "Hardware is scarce and mostly research-only.",
          "Accuracy generally below conventional equivalents."
        ],
        avoid: [
          "The workload is dense matrix multiplication — that is a GPU's job.",
          "You need production-ready tooling.",
          "You need to train with standard deep learning methods.",
          "Accuracy matters more than energy — currently the usual case."
        ]
      }
    }

  ]);
})(window.TD = window.TD || {});
