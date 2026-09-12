/* ==========================================================================
   Depth pass 36 — the final five advanced terms.

   ADVANCED TIER COMPLETE: all 252 advanced terms now carry the four
   reasoning sections. Next: the intermediate tier (458 terms).
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "mixed-precision",

      why: {
        before: "Neural networks trained entirely in **fp32** — 32-bit floats " +
          "for weights, activations, gradients and every arithmetic operation " +
          "— because that was assumed necessary for numerical stability.",
        problem: "It wastes the hardware. Modern GPUs have **tensor cores** " +
          "that perform 16-bit matrix multiplies several times faster than " +
          "32-bit ones, and half-precision halves memory traffic. Training in " +
          "fp32 leaves most of the chip's throughput unused.",
        shift: "Use 16-bit where precision does not matter — the matrix " +
          "multiplications — and **keep a 32-bit master copy of the weights** " +
          "for the update step. That master copy is the essential detail: " +
          "adding a tiny gradient update to a large fp16 weight **rounds to no " +
          "change at all**, so training silently stalls without it."
      },

      num: {
        t: "The formats and their trade",
        h: ["Format", "Exponent / mantissa", "Dynamic range", "Loss scaling?"],
        r: [
          ["fp32", "8 / 23", "~1e±38", "no"],
          ["**fp16**", "**5 / 10**", "**6e-5 to 65,504**", "**required**"],
          ["**bf16**", "**8 / 7**", "**same as fp32**", "**not needed**"],
          ["fp8 (E4M3)", "4 / 3", "very narrow", "yes, plus per-tensor scaling"]
        ],
        n: "**bf16 trades precision for range**, and that is why it won. It " +
          "has the same exponent width as fp32, so it cannot underflow or " +
          "overflow where fp32 would not — which eliminates the need for " +
          "**loss scaling** entirely. fp16's narrow range means small " +
          "gradients flush to zero, so the loss is multiplied by a large " +
          "factor before backpropagation and the gradients divided afterwards; " +
          "modern implementations do this dynamically, halving the scale on " +
          "overflow. Typical gains are **2–3× faster training with roughly " +
          "half the activation memory**. Note the naming confusion: **mixed " +
          "precision** is the general technique, and *Automatic Mixed " +
          "Precision* (AMP) is the framework feature that applies it — " +
          "choosing per-operation which precision is safe."
      },

      miss: [
        {
          w: "Mixed precision halves memory usage.",
          r: "It roughly halves **activation** memory, which is often the " +
            "largest single component. Weights and optimiser state are usually " +
            "kept in fp32, so total savings are typically **30–40%**. Attacking " +
            "optimiser state is what **FSDP/ZeRO** does."
        },
        {
          w: "You can drop the fp32 master weights to save more memory.",
          r: "Then training **stalls**. Adding a small update to a large fp16 " +
            "weight rounds to zero — the weight simply stops changing. The " +
            "master copy exists specifically to make the update step " +
            "meaningful, and removing it is not a memory optimisation but a " +
            "correctness bug."
        },
        {
          w: "bf16 is strictly better than fp16.",
          r: "Better for **training**, where dynamic range matters more than " +
            "precision. fp16's extra mantissa bits can be preferable for " +
            "**inference**, where values are well-scaled. bf16 also requires " +
            "Ampere-generation hardware or newer."
        },
        {
          w: "A NaN loss means mixed precision is the problem.",
          r: "It is a common cause and not the only one — a too-high learning " +
            "rate, a division by zero or an unstable loss produce NaN in fp32 " +
            "too. Test by switching to fp32; if the NaN persists, precision was " +
            "not the cause."
        }
      ],

      trade: {
        buys: [
          "2–3× faster training on tensor-core hardware.",
          "Roughly half the activation memory, enabling larger batches.",
          "Nearly free — one or two lines in modern frameworks.",
          "Accuracy matching fp32 when implemented correctly."
        ],
        costs: [
          "fp16 needs loss scaling and can still overflow.",
          "Numerically sensitive operations must stay in fp32.",
          "Debugging numerical issues becomes harder.",
          "bf16 requires recent hardware."
        ],
        avoid: [
          "The hardware has no tensor cores — you gain memory, not speed.",
          "The model is known to be numerically delicate.",
          "You are debugging a convergence problem — eliminate precision as a " +
            "variable first.",
          "Scientific computing where full precision is a correctness " +
            "requirement."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "3d-reconstruction",

      why: {
        before: "A photograph is a **projection** — the 3D world collapsed " +
          "onto a 2D plane, with depth information discarded at capture. One " +
          "image cannot recover it, because infinitely many 3D scenes produce " +
          "the same picture.",
        problem: "Yet depth is exactly what robotics, AR, mapping, surveying " +
          "and cultural heritage need. The information is not in any single " +
          "image; it has to come from somewhere else.",
        shift: "Recover depth from **multiple viewpoints**. If the same point " +
          "appears in two images taken from known positions, triangulation " +
          "gives its 3D location. **Structure from Motion** solves the harder " +
          "version — recovering both the camera positions *and* the geometry " +
          "simultaneously, from images with no known poses."
      },

      num: {
        t: "Approaches, by input",
        h: ["Method", "Input", "Output", "Limitation"],
        r: [
          ["Stereo", "2 calibrated cameras", "depth map", "**baseline limits range**"],
          ["**Structure from Motion**", "**many photos, unknown poses**", "**sparse points + poses**", "needs texture"],
          ["Multi-View Stereo", "SfM output", "dense point cloud", "slow"],
          ["LiDAR / depth sensor", "active sensing", "**direct measurement**", "hardware cost"],
          ["**Monocular depth (learned)**", "**one image**", "**relative depth**", "**no true scale**"]
        ],
        n: "The **scale ambiguity** in the last row is fundamental rather than " +
          "a limitation of current methods: from images alone you recover " +
          "geometry **up to an unknown scale factor** — a doll's house and a " +
          "real house produce identical images. Absolute scale requires a " +
          "known reference object, a calibrated stereo baseline, or an active " +
          "sensor. The other structural difficulty is **textureless " +
          "surfaces**: a blank white wall offers no features to match across " +
          "views, so photogrammetry produces holes exactly where the geometry " +
          "is simplest. **Bundle adjustment** — jointly refining all camera " +
          "poses and all 3D points to minimise reprojection error — is the " +
          "optimisation at the heart of every SfM pipeline and the reason " +
          "COLMAP is slow."
      },

      miss: [
        {
          w: "More photographs always give a better reconstruction.",
          r: "**Overlap and viewpoint diversity** matter more than count. A " +
            "hundred photographs from nearly the same position reconstruct " +
            "worse than twenty with good coverage and 60–80% overlap. Motion " +
            "blur and inconsistent lighting actively hurt."
        },
        {
          w: "Photogrammetry gives you accurate measurements.",
          r: "It gives geometry **up to scale** unless you provide a reference " +
            "— a scale bar, a known dimension, or GPS. Without one, the " +
            "reconstruction is correctly shaped and of unknown size, which " +
            "makes it useless for surveying."
        },
        {
          w: "Learned monocular depth models made multi-view methods obsolete.",
          r: "They produce **relative** depth from one image, which is " +
            "impressive and not metric. They also **hallucinate plausible " +
            "geometry** where the image is ambiguous. For measurement or " +
            "safety-critical use, multi-view or active sensing remains " +
            "necessary."
        },
        {
          w: "Gaussian splatting replaced photogrammetry.",
          r: "It excels at **novel view synthesis** — producing photorealistic " +
            "renders — and does not produce clean mesh geometry. If you need " +
            "an editable, measurable model, classical photogrammetry is still " +
            "the tool. They optimise for different outputs."
        }
      ],

      trade: {
        buys: [
          "3D geometry from ordinary cameras with no special hardware.",
          "SfM recovers camera poses and structure together.",
          "Mature open tooling — COLMAP, OpenMVG, Meshroom.",
          "Scales from a phone to aerial survey."
        ],
        costs: [
          "Scale is unrecoverable without a reference.",
          "Fails on textureless, reflective and transparent surfaces.",
          "Bundle adjustment is computationally expensive.",
          "Requires careful capture — overlap, lighting, focus.",
          "Output needs cleanup before it is usable."
        ],
        avoid: [
          "You need metric accuracy and have no scale reference — use LiDAR " +
            "or calibrated stereo.",
          "Surfaces are textureless or highly reflective.",
          "You need novel views rather than geometry — **Gaussian " +
            "splatting**.",
          "You only have a single image and need true measurements."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "brain-computer-interface",

      why: {
        before: "Controlling a computer required **muscle movement** — typing, " +
          "speaking, moving a mouse or an eye. Every interface assumed a " +
          "functioning motor pathway.",
        problem: "For people with severe paralysis — ALS, brainstem stroke, " +
          "spinal cord injury — that pathway is broken while the brain remains " +
          "intact. The intention to move is generated normally and never " +
          "reaches the muscle. Locked-in syndrome is the extreme case: full " +
          "cognition, almost no output channel.",
        shift: "Read the **neural signal directly** and decode intent from it. " +
          "Motor cortex activity when imagining a movement is measurable, and " +
          "a decoder trained on that activity can drive a cursor, a robotic " +
          "arm, or a speech synthesiser — bypassing the broken pathway " +
          "entirely."
      },

      num: {
        t: "The signal-quality against invasiveness trade",
        h: ["Method", "Signal quality", "Risk", "Longevity"],
        r: [
          ["**EEG (scalp)**", "**poor — skull blurs it**", "**none**", "indefinite"],
          ["ECoG (on cortex surface)", "good", "surgery", "years"],
          ["**Utah array (penetrating)**", "**single neurons**", "**surgery**", "**degrades — scarring**"],
          ["Neuralink-style threads", "high channel count", "surgery", "under evaluation"],
          ["fNIRS / fMRI", "poor temporal resolution", "none", "not portable"]
        ],
        n: "**Signal quality trades directly against invasiveness**, and there " +
          "is no way around it: the skull acts as a low-pass filter, so " +
          "non-invasive EEG gives a blurred summation of millions of neurons. " +
          "Consumer EEG headsets are essentially limited to coarse state " +
          "classification, not thought reading. The recurring problem with " +
          "penetrating electrodes is the **foreign body response** — glial " +
          "scarring gradually insulates the electrodes, so signal quality " +
          "**degrades over months to years**, which is the central unsolved " +
          "engineering problem. Recent results are genuine and narrow: speech " +
          "decoding at **60–80 words per minute** for participants with " +
          "paralysis, and reliable cursor control — impressive medical " +
          "achievements, and not general-purpose thought reading."
      },

      miss: [
        {
          w: "BCIs can read your thoughts.",
          r: "They decode **specific trained signals** — imagined movement, " +
            "attempted speech — after calibration with that individual. There " +
            "is no general thought decoding, and decoders do not transfer " +
            "between people or reliably between sessions with the same person."
        },
        {
          w: "Consumer EEG headsets provide meaningful brain-computer control.",
          r: "Scalp EEG is severely limited by the skull and by muscle " +
            "artefacts. Many consumer demonstrations are actually detecting " +
            "**jaw clenching, eye movement or blinks** rather than cortical " +
            "intent. Useful for coarse state estimation; not for control."
        },
        {
          w: "Implanted BCIs work indefinitely once installed.",
          r: "**Glial scarring** progressively degrades penetrating electrode " +
            "signals over months to years, and the decoder must be recalibrated " +
            "regularly as signals shift. Long-term stability is the central " +
            "open engineering problem, not a solved detail."
        },
        {
          w: "BCIs are close to consumer applications.",
          r: "Current systems require **neurosurgery** and are justified only " +
            "for severe medical need, where the risk-benefit calculation is " +
            "clear. Non-invasive methods lack the bandwidth for general " +
            "control. Consumer applications remain distant."
        }
      ],

      trade: {
        buys: [
          "Restores communication and control for severe paralysis.",
          "Bypasses damaged motor pathways entirely.",
          "Speech decoding at genuinely useful rates.",
          "Advances basic neuroscience understanding."
        ],
        costs: [
          "High-quality signals require neurosurgery.",
          "Signal degrades over time from tissue response.",
          "Per-individual calibration and frequent recalibration.",
          "Very expensive and available at few centres.",
          "Serious privacy and autonomy questions with neural data."
        ],
        avoid: [
          "The person has any usable motor control — eye tracking and switch " +
            "access are far less invasive.",
          "You expect general-purpose thought decoding.",
          "The application is consumer or entertainment.",
          "Non-invasive alternatives meet the need."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "groovy",

      why: {
        before: "Java in the mid-2000s was verbose and statically typed with " +
          "no closures, no literal syntax for lists and maps, and " +
          "considerable ceremony for simple tasks. Scripting on the JVM meant " +
          "leaving Java entirely.",
        problem: "Build scripts, glue code and configuration are exactly the " +
          "tasks where Java's ceremony costs most and its type safety matters " +
          "least. Ant's XML build files were the symptom — a declarative " +
          "format straining to express logic it was never designed for.",
        shift: "Add a **dynamic scripting language** to the JVM that is " +
          "**near-source-compatible with Java** — most Java code is valid " +
          "Groovy — while adding closures, literal collections, optional " +
          "typing and metaprogramming. Its defining application became " +
          "**building DSLs**, which is why Gradle and Jenkins pipelines are " +
          "written in it."
      },

      num: {
        t: "Where Groovy actually lives",
        h: ["Use", "Why Groovy", "Status"],
        r: [
          ["**Gradle build scripts**", "**DSL syntax**", "**Kotlin DSL now preferred**"],
          ["**Jenkins pipelines**", "**Jenkinsfile is Groovy**", "**still dominant**"],
          ["Spock testing", "expressive specification DSL", "well-liked"],
          ["General application code", "—", "**largely lost to Kotlin**"],
          ["Grails web framework", "Rails-like productivity", "niche"]
        ],
        n: "The **Kotlin displacement** is the honest story: Groovy's " +
          "value proposition was *a concise, pleasant JVM language*, and " +
          "**Kotlin delivered that with static typing** — better IDE support, " +
          "compile-time safety and Android's official backing. Gradle now " +
          "recommends its Kotlin DSL. What keeps Groovy in daily use is " +
          "**Jenkins**: every Jenkinsfile is Groovy, and that installed base " +
          "is enormous. Its remaining technical distinction is **`@CompileStatic`** " +
          "— an annotation switching a class to static compilation, recovering " +
          "most of Java's speed and type checking while keeping the syntax, " +
          "which is a genuinely unusual gradual-typing story."
      },

      miss: [
        {
          w: "Groovy is slow because it is dynamic.",
          r: "Dynamic dispatch does cost, and **`@CompileStatic`** switches a " +
            "class to static compilation with performance close to Java. The " +
            "flexibility is opt-out per class, which is more nuanced than " +
            "*dynamic languages are slow*."
        },
        {
          w: "Groovy is dead now that Kotlin exists.",
          r: "It lost **general application development** to Kotlin and " +
            "remains everywhere Jenkins runs. Millions of Jenkinsfiles are " +
            "Groovy, and Spock is still widely used for testing. Declining in " +
            "new adoption, not absent."
        },
        {
          w: "Java code always runs unmodified as Groovy.",
          r: "It is **near**-compatible with known differences: `==` calls " +
            "`equals()` rather than comparing references, array literal syntax " +
            "differs, and inner class handling varies. Close enough to be " +
            "useful, different enough to surprise."
        },
        {
          w: "You should learn Groovy for JVM scripting.",
          r: "For **new** work, **Kotlin** offers similar concision with static " +
            "typing and far better tooling. Learn Groovy because your build " +
            "system or CI requires it — which is a very common reason, and " +
            "different from choosing it."
        }
      ],

      trade: {
        buys: [
          "Concise syntax with near-Java compatibility.",
          "Excellent for building readable DSLs.",
          "Optional typing — dynamic or `@CompileStatic` per class.",
          "Full Java ecosystem access.",
          "Powerful runtime metaprogramming."
        ],
        costs: [
          "Dynamic typing means runtime errors by default.",
          "Weaker IDE support than statically typed JVM languages.",
          "Slower without `@CompileStatic`.",
          "Declining adoption for new projects.",
          "Metaprogramming makes code hard to follow statically."
        ],
        avoid: [
          "Starting a new JVM project — use **Kotlin**.",
          "You need strong compile-time guarantees.",
          "The team values IDE refactoring support.",
          "You are choosing a language rather than inheriting one — the " +
            "usual reason to use Groovy is that Jenkins or Gradle requires it."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "pascal",

      why: {
        before: "Programming in 1970 was taught in FORTRAN or assembly — " +
          "languages designed for machine efficiency, with `GOTO`-driven " +
          "control flow and no facilities for expressing program structure.",
        problem: "Niklaus Wirth's concern was **teaching**. Students learned " +
          "languages that permitted — and encouraged — unstructured, " +
          "unreadable code, and the languages themselves offered no way to " +
          "express the disciplined thinking he wanted to instil.",
        shift: "Design a language **for the pedagogy**: strong static typing, " +
          "structured control flow with no `GOTO` needed, explicit " +
          "declarations, and a syntax that reads as prose (`begin`/`end` " +
          "rather than braces). It was small enough to compile in one pass, " +
          "which is what made it practical on 1970s hardware."
      },

      num: {
        t: "Pascal's lasting influence",
        h: ["Contribution", "Where it went"],
        r: [
          ["**Structured programming taught by default**", "**every modern language**"],
          ["Strong static typing for teaching", "the norm now"],
          ["**Range and subrange types**", "**Ada, and rarely elsewhere**"],
          ["**P-code (compile to VM bytecode)**", "**Java bytecode, .NET CIL**"],
          ["Turbo Pascal's integrated IDE", "**every IDE since**"],
          ["Delphi / Object Pascal", "still commercially maintained"]
        ],
        n: "**P-code is the underappreciated legacy**: Pascal compilers " +
          "targeted a virtual machine rather than native code, so the compiler " +
          "was portable to any machine with a P-code interpreter. That is " +
          "precisely the architecture Java and .NET adopted two decades later, " +
          "and it was Pascal's answer to the same portability problem. **Turbo " +
          "Pascal** (1983) is the other landmark — an integrated editor, " +
          "compiler and debugger at a price students could afford, compiling " +
          "so fast it changed expectations about the edit-compile-run cycle. " +
          "Pascal's decline came from real limitations for systems work: " +
          "fixed-length strings, weak separate compilation, and no easy escape " +
          "to the metal — which C offered and which mattered once students " +
          "became professionals."
      },

      miss: [
        {
          w: "Pascal is a dead language.",
          r: "**Delphi** and **Free Pascal** are actively maintained, and " +
            "substantial commercial applications still run on Object Pascal. It " +
            "is not chosen for new projects and has a real installed base, " +
            "particularly in Europe and in Windows desktop software."
        },
        {
          w: "It was replaced by C because C is more powerful.",
          r: "C won for **systems programming** — direct memory access, easy " +
            "assembly integration, and Unix's adoption. Pascal was designed for " +
            "**teaching**, and its restrictions were deliberate. They are " +
            "different design goals, not a straightforward capability ranking."
        },
        {
          w: "Pascal's strict typing was pedantic and unnecessary.",
          r: "It was a **deliberate teaching decision**, and the industry " +
            "eventually agreed — modern languages have moved toward stronger " +
            "typing, not weaker. Pascal's stance looks conservative for 1970 " +
            "and mainstream today."
        },
        {
          w: "Learning Pascal has no value now.",
          r: "The **ideas** are universal — structured programming, strong " +
            "typing, explicit declaration. Pascal made them teachable. That " +
            "said, learning them in a currently-used language is the practical " +
            "route; Pascal's value now is largely historical."
        }
      ],

      trade: {
        buys: [
          "Extremely readable syntax, designed for comprehension.",
          "Strong static typing catching errors early.",
          "Range and subrange types encoding constraints.",
          "Very fast compilation — single-pass by design.",
          "Delphi remains productive for Windows desktop work."
        ],
        costs: [
          "Original Pascal was too restrictive for systems programming.",
          "Fixed-length strings and weak separate compilation.",
          "Small modern ecosystem.",
          "Very small hiring pool.",
          "Dialect fragmentation — ISO, Turbo, Delphi, Free Pascal."
        ],
        avoid: [
          "Any new project — modern languages cover the same ground better.",
          "You need a large ecosystem or cross-platform reach.",
          "Hiring is a consideration.",
          "You are learning to program — a currently-used language teaches " +
            "the same principles with transferable skills."
        ]
      }
    }

  ]);
})(window.TD = window.TD || {});
