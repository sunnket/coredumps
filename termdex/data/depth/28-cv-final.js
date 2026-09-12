/* ==========================================================================
   Depth pass 28 — segmentation, tracking, 3D, and the training internals.

   The vision tasks here form a ladder of increasing commitment: detection
   says *there is a car about here*, instance segmentation says *these exact
   pixels are that car*, panoptic says *and every other pixel is something
   too*. Each step up costs far more annotation, and choosing a level above
   what the application needs is one of the most common and expensive
   mistakes in applied vision.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "instance-segmentation",

      why: {
        before: "**Object detection** gives a bounding box per object; " +
          "**semantic segmentation** labels every pixel with a class. Both are " +
          "useful and both lose something.",
        problem: "A box is a poor description of a non-rectangular object — a " +
          "box around a bicycle is mostly background. And semantic " +
          "segmentation cannot **count**: a crowd of people is one connected " +
          "region labelled *person*, so *how many people are here* is " +
          "unanswerable.",
        shift: "Combine both: **per-pixel masks with per-object identity**. " +
          "Each detected instance gets its own mask, so overlapping objects are " +
          "separated and counting works. The standard approach — Mask R-CNN — " +
          "adds a mask branch to a detector, predicting a small mask **inside " +
          "each detected box** rather than segmenting the whole image."
      },

      num: {
        t: "The vision task ladder",
        h: ["Task", "Output", "Annotation cost", "Can count?"],
        r: [
          ["Classification", "one label", "**seconds/image**", "no"],
          ["Detection", "boxes", "~10s per object", "yes"],
          ["Semantic segmentation", "per-pixel class", "**minutes/image**", "**no**"],
          ["**Instance segmentation**", "**per-object masks**", "**~10× detection**", "yes"],
          ["Panoptic", "both, every pixel", "highest", "yes"]
        ],
        n: "The **annotation cost** column is the practical constraint people " +
          "underestimate: polygon-annotating an image can take a skilled " +
          "annotator several minutes against ten seconds for a box, so a " +
          "dataset that costs £5,000 to label for detection costs £50,000 for " +
          "instance segmentation. That is why **SAM** (Segment Anything) " +
          "mattered so much — it produces class-agnostic masks zero-shot, so " +
          "the practical workflow became *detect with your own model, then " +
          "prompt SAM with the box* rather than annotating masks at all. Note " +
          "also **RoIAlign**, Mask R-CNN's key technical contribution: the " +
          "earlier RoIPool quantised coordinates to integers, misaligning masks " +
          "by a few pixels, and using bilinear interpolation instead gave a " +
          "large accuracy gain for a small change."
      },

      miss: [
        {
          w: "Instance segmentation is semantic segmentation plus counting.",
          r: "Semantic segmentation genuinely **cannot** be post-processed into " +
            "instances when objects touch — two overlapping people form one " +
            "connected region with no boundary to find. Instance segmentation " +
            "predicts separate masks; connected-component analysis on a " +
            "semantic map fails exactly where it matters."
        },
        {
          w: "You should use it whenever you need object locations.",
          r: "If a bounding box suffices — counting, tracking, cropping — " +
            "detection is far cheaper to annotate, train and run. Masks are " +
            "warranted when **shape or exact boundaries matter**: measuring " +
            "area, robotic grasping, medical imaging, background removal."
        },
        {
          w: "Mask R-CNN masks are high-resolution.",
          r: "The mask branch typically predicts a **28×28** mask per instance, " +
            "upsampled to the box. Fine detail — hair, thin structures, sharp " +
            "boundaries — is lost. Higher-fidelity boundaries need refinement " +
            "networks like PointRend."
        },
        {
          w: "SAM removed the need for task-specific models.",
          r: "SAM is **class-agnostic** — it segments *a thing* when prompted " +
            "and does not know what it is. You still need detection or " +
            "classification to say what each mask contains, and to decide which " +
            "objects matter. It removes the annotation burden, not the model."
        }
      ],

      trade: {
        buys: [
          "Exact object boundaries, not rectangles.",
          "Separates overlapping instances so counting works.",
          "Enables area, shape and orientation measurement.",
          "Essential for grasping, medical imaging and editing."
        ],
        costs: [
          "Annotation costs roughly 10× detection.",
          "Slower inference than detection.",
          "Mask resolution is limited in standard architectures.",
          "More failure modes to evaluate and monitor."
        ],
        avoid: [
          "A bounding box is sufficient — usually true for counting and " +
            "tracking.",
          "You cannot afford mask annotation and cannot use SAM-assisted " +
            "labelling.",
          "Objects never overlap and semantic segmentation would do.",
          "Real-time constraints are tight on modest hardware."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "object-tracking",

      why: {
        before: "Detection runs per frame, independently. Each frame yields a " +
          "fresh set of boxes with no relationship to the last.",
        problem: "Almost every video question needs **identity across time**: " +
          "how many distinct people entered, how fast is this car, did the same " +
          "person return. Per-frame detection cannot answer any of them — and " +
          "detection is imperfect, so an object missed for three frames looks " +
          "like it left and a new one arrived.",
        shift: "Add **association**: match this frame's detections to existing " +
          "tracks. The dominant paradigm is **tracking-by-detection** — run a " +
          "detector, then associate — where the association uses motion " +
          "prediction (a Kalman filter), spatial overlap, and often an " +
          "appearance embedding to survive occlusion."
      },

      num: {
        t: "The tracking-by-detection stack",
        h: ["Component", "Job", "Failure it causes"],
        r: [
          ["Detector", "find objects per frame", "missed detection → fragmented track"],
          ["**Motion model** (Kalman)", "predict next position", "fast/erratic motion breaks it"],
          ["**Association** (Hungarian)", "match detections to tracks", "**ID switches**"],
          ["Appearance embedding", "re-identify after occlusion", "similar-looking objects swap"],
          ["Track management", "birth, death, age-out", "ghost tracks, premature deletion"]
        ],
        n: "**ID switches** are the characteristic failure and the reason " +
          "**MOTA** and **IDF1** exist as separate metrics: MOTA is dominated " +
          "by detection quality, while IDF1 measures whether identity was " +
          "preserved — a tracker can score well on one and badly on the other. " +
          "The typical trigger is two similar objects crossing paths, where " +
          "motion prediction alone cannot disambiguate and the tracks swap. The " +
          "notable practical finding from **ByteTrack** is that associating " +
          "**low-confidence** detections as well as high-confidence ones " +
          "substantially reduces fragmentation — a partially occluded object " +
          "produces a weak detection that a confidence threshold would discard, " +
          "breaking the track for no good reason."
      },

      miss: [
        {
          w: "A better detector gives better tracking.",
          r: "It helps and does not fix **association**. Two people crossing " +
            "produce perfect detections and an ID switch, because the problem " +
            "is deciding *which is which*, not finding them. Detection quality " +
            "and identity preservation are largely separate axes."
        },
        {
          w: "You should discard low-confidence detections before tracking.",
          r: "ByteTrack showed the opposite. A partially occluded object " +
            "produces a low-confidence detection, and discarding it breaks the " +
            "track. Associating low-confidence boxes to **existing** tracks " +
            "(while not starting new tracks from them) is a large and cheap " +
            "improvement."
        },
        {
          w: "Kalman filtering handles any motion.",
          r: "It assumes **linear motion with Gaussian noise**. Sudden " +
            "direction changes, camera motion, and objects that stop and start " +
            "all violate it. Sports and drone footage are common cases where " +
            "the motion model is the weak link."
        },
        {
          w: "Tracking is a solved problem for pedestrians.",
          r: "Benchmark performance on standard pedestrian datasets is high; " +
            "**dense crowds, long occlusions, camera motion and " +
            "similar-appearance objects** remain genuinely hard. Multi-camera " +
            "re-identification is harder still."
        }
      ],

      trade: {
        buys: [
          "Object identity across frames — counting, speed, dwell time.",
          "Smooths detection noise via motion prediction.",
          "Survives short occlusions.",
          "Modular — swap the detector without rewriting the tracker."
        ],
        costs: [
          "ID switches on crossing or similar objects.",
          "Appearance embeddings add computation per object.",
          "Many parameters — thresholds, track ages, motion noise.",
          "Errors accumulate over long sequences."
        ],
        avoid: [
          "Per-frame detection answers the question — presence, not identity.",
          "The scene has one object with no ambiguity.",
          "Frame rate is too low for motion prediction to work.",
          "You need re-identification across cameras — that is a different and " +
            "harder problem."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "neural-radiance-field",

      why: {
        before: "Reconstructing 3D from photographs meant **photogrammetry**: " +
          "match features across images, triangulate points, build a mesh. " +
          "Effective, and it struggles badly with reflections, transparency, " +
          "thin structures and textureless surfaces.",
        problem: "Those failures are structural. Feature matching assumes a " +
          "surface point looks the same from every angle — which is false for " +
          "glass, water, metal and anything specular. A mesh also cannot " +
          "represent volumetric phenomena like smoke or foliage.",
        shift: "Do not reconstruct geometry at all. Train a small network to " +
          "map **(position, viewing direction) → (colour, density)**, then " +
          "render by **marching rays** through the volume and integrating. " +
          "The scene is stored *as network weights*, and because colour depends " +
          "on view direction, reflections and specularity come out naturally."
      },

      num: {
        t: "NeRF against Gaussian splatting",
        h: ["", "Original NeRF", "3D Gaussian Splatting (2023)"],
        r: [
          ["Representation", "**MLP weights**", "**explicit 3D Gaussians**"],
          ["Training", "**hours to days**", "~30 minutes"],
          ["Rendering", "~30 seconds/frame", "**real-time, 100+ fps**"],
          ["Editing the scene", "**very hard**", "easier — explicit primitives"],
          ["Storage", "small (a few MB)", "larger"]
        ],
        n: "**3D Gaussian Splatting has largely displaced NeRF in practice**, " +
          "and it is worth being clear why: it keeps the same core idea — " +
          "optimise a volumetric representation against photographs using " +
          "differentiable rendering — but replaces the implicit MLP with " +
          "explicit 3D Gaussians that rasterise directly. That makes rendering " +
          "real-time rather than seconds per frame, which is the difference " +
          "between a research result and a usable tool. What both share is the " +
          "input requirement: **many photographs with accurate camera poses**, " +
          "usually recovered with COLMAP, and pose errors degrade results " +
          "badly. Both are also **per-scene optimisations** — you train one " +
          "model per scene, not a general model."
      },

      miss: [
        {
          w: "A NeRF is a 3D model you can export.",
          r: "It is a **function**, not geometry. Extracting a mesh requires a " +
            "separate step (marching cubes on the density field) and typically " +
            "produces poor-quality geometry, because the network was never " +
            "optimised to have a well-defined surface — only to render " +
            "correctly."
        },
        {
          w: "It reconstructs the scene in 3D.",
          r: "It learns to **reproduce photographs from viewpoints**. The " +
            "density field is not constrained to be a physically sensible " +
            "surface — it can place floating semi-transparent material that " +
            "renders correctly from the training views and is nonsense " +
            "geometrically."
        },
        {
          w: "You can build one from any set of photos.",
          r: "You need **accurate camera poses**, usually recovered by " +
            "structure-from-motion, and that step fails on textureless scenes, " +
            "images with too little overlap, or motion blur. Pose accuracy " +
            "limits final quality more than the NeRF training does."
        },
        {
          w: "NeRF is state of the art for novel view synthesis.",
          r: "**Gaussian splatting** overtook it in 2023 on training speed and " +
            "rendering speed at comparable or better quality. NeRF remains " +
            "important conceptually and for some variants; for a practical " +
            "project today, splatting is usually the starting point."
        }
      ],

      trade: {
        buys: [
          "Photorealistic novel views including reflections and transparency.",
          "Handles what photogrammetry fails on.",
          "Compact representation as network weights.",
          "Needs only photographs and poses."
        ],
        costs: [
          "Per-scene optimisation — no generalisation.",
          "Requires accurate camera poses.",
          "Original NeRF is slow to train and render.",
          "Extracting usable geometry is hard.",
          "Struggles with sparse views and dynamic scenes."
        ],
        avoid: [
          "You need an editable mesh — use photogrammetry.",
          "The scene is dynamic; standard methods assume static.",
          "You have few images or unreliable poses.",
          "Real-time is required and you are using original NeRF — use " +
            "**splatting**.",
          "A single photograph is all you have."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "super-resolution",

      why: {
        before: "Enlarging an image meant **interpolation** — bicubic, Lanczos " +
          "— computing new pixels as weighted averages of neighbours.",
        problem: "Interpolation cannot create detail that is not there. " +
          "Upscaling 4× gives a smooth, blurry image because the high-frequency " +
          "information was destroyed by downsampling and averaging cannot " +
          "recover it. The problem is **fundamentally ill-posed**: many " +
          "high-resolution images are consistent with the same low-resolution " +
          "input.",
        shift: "Learn a **prior** over what real images look like. A model " +
          "trained on high-resolution photographs learns that edges are sharp, " +
          "textures have structure, and faces have particular geometry — so it " +
          "can produce a **plausible** high-resolution image consistent with " +
          "the input. It is generating detail, not recovering it."
      },

      num: {
        t: "The metric trap",
        h: ["Method optimising", "PSNR/SSIM", "Perceptual quality"],
        r: [
          ["Pixel loss (MSE)", "**highest**", "**blurry**"],
          ["Perceptual loss", "lower", "better"],
          ["**GAN / diffusion**", "**lowest**", "**best-looking**"]
        ],
        n: "This inversion is the defining fact of the field: **the methods " +
          "that score best on PSNR look worst to people**. MSE is minimised by " +
          "predicting the *average* of all plausible high-resolution images, " +
          "and an average of sharp textures is a blur. Adversarial and " +
          "diffusion methods commit to one plausible option, which looks far " +
          "better and scores worse because it does not match the ground truth " +
          "pixel-for-pixel. Hence **LPIPS** and human evaluation as the metrics " +
          "that matter. The consequence people must understand: **super-" +
          "resolution invents detail**. A hallucinated licence plate is " +
          "plausible and not evidence, which is why *enhance* in forensic " +
          "contexts is not a valid operation."
      },

      miss: [
        {
          w: "Super-resolution recovers the original detail.",
          r: "It **generates plausible** detail. The information was destroyed; " +
            "the model is producing something consistent with the input and " +
            "with its training data. Different models produce different, " +
            "equally plausible outputs from the same input."
        },
        {
          w: "Higher PSNR means a better result.",
          r: "PSNR **anti-correlates** with perceptual quality in this domain. " +
            "Optimising it produces blur. Use LPIPS, no-reference perceptual " +
            "metrics, or human judgement — this is one of the clearest cases " +
            "where the convenient metric is the wrong one."
        },
        {
          w: "You can use it to read a blurry licence plate or face.",
          r: "You cannot, and this is a genuine harm. The output is a plausible " +
            "reconstruction, not evidence — a model can produce a clear, " +
            "readable, **wrong** plate. Face super-resolution has demonstrably " +
            "produced outputs biased toward training-set demographics."
        },
        {
          w: "A model trained on one dataset works on any images.",
          r: "It learns the **degradation** it was trained on — typically " +
            "bicubic downsampling. Real degradation (compression, sensor noise, " +
            "motion blur, unknown resampling) differs, which is why " +
            "*blind* super-resolution models trained on varied degradations " +
            "exist and why results on real photographs are worse than on " +
            "benchmarks."
        }
      ],

      trade: {
        buys: [
          "Genuinely sharper, more detailed output than interpolation.",
          "Restores old or low-quality media convincingly.",
          "Enables lower-resolution capture, transmission or storage.",
          "Real-time variants exist for video and gaming."
        ],
        costs: [
          "Invents detail that may be wrong.",
          "Standard metrics mislead.",
          "Generalises poorly to unseen degradations.",
          "Can amplify training-data bias, particularly on faces.",
          "Computationally expensive at high scale factors."
        ],
        avoid: [
          "The output would be used as evidence or for identification.",
          "Accuracy matters more than appearance — medical or scientific " +
            "imaging without validation.",
          "Interpolation is sufficient for the use case.",
          "You cannot validate that the invented detail is acceptable."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "pose-estimation",

      why: {
        before: "Understanding what a person is doing from an image meant " +
          "classifying the whole frame — *this is a photo of someone running* " +
          "— which throws away all spatial structure.",
        problem: "Actions are defined by **configuration**: the relative " +
          "positions of joints over time. A classifier trained on whole images " +
          "learns backgrounds and clothing as much as posture, and cannot " +
          "generalise to the same action in a new setting.",
        shift: "Extract the **skeleton** — locate each joint and connect them. " +
          "That reduces a person to perhaps 17 coordinate pairs, which is a " +
          "compact, background-independent representation that downstream " +
          "models can classify, compare or measure."
      },

      num: {
        t: "The two architectures",
        h: ["Approach", "Method", "Scales with people?"],
        r: [
          ["**Top-down**", "detect person → pose per box", "**no — linear cost**"],
          ["**Bottom-up**", "find all joints → group them", "**yes — constant**"],
          ["Accuracy", "**top-down higher**", "bottom-up lower"],
          ["Crowds", "detector fails on occlusion", "**grouping is the hard part**"]
        ],
        n: "The choice is a genuine trade: **top-down** runs a pose model once " +
          "per detected person, so accuracy is high and cost grows linearly " +
          "with crowd size; **bottom-up** (OpenPose and successors) finds every " +
          "joint in one pass and then solves the assignment problem of which " +
          "elbow belongs to which shoulder, giving constant cost and lower " +
          "accuracy. A subtlety worth knowing: **heatmap** regression — " +
          "predicting a probability map per joint and taking the argmax — " +
          "consistently outperforms directly regressing coordinates, because it " +
          "preserves spatial structure and handles ambiguity gracefully. The " +
          "hardest remaining cases are **occlusion** (the model must infer " +
          "hidden joints) and **left-right confusion**, which is a persistent " +
          "and characteristic error."
      },

      miss: [
        {
          w: "Pose estimation gives you 3D positions.",
          r: "Standard models give **2D image coordinates**. Recovering 3D from " +
            "a single view is fundamentally ambiguous — depth is unobservable, " +
            "and the same 2D projection corresponds to many 3D poses. 3D " +
            "estimation needs multiple cameras, depth sensors, or a learned " +
            "prior that can be confidently wrong."
        },
        {
          w: "Top-down is always more accurate, so use it.",
          r: "Its accuracy depends entirely on the **detector**. In crowds with " +
            "heavy occlusion the detector fails and the pose model never sees " +
            "the person. Bottom-up degrades more gracefully in exactly those " +
            "conditions."
        },
        {
          w: "Skeletons are anonymous, so pose data avoids privacy concerns.",
          r: "**Gait is identifying.** Individuals can be recognised from " +
            "skeleton sequences alone, and pose reveals health conditions, " +
            "pregnancy and disability. It is less identifying than video and " +
            "not anonymous."
        },
        {
          w: "Higher keypoint accuracy means better downstream action " +
            "recognition.",
          r: "Only up to a point. Action recognition depends on **temporal " +
            "patterns**, so a consistently slightly-off skeleton is often more " +
            "useful than an accurate one that jitters or swaps left and right " +
            "between frames. Temporal smoothing frequently matters more than " +
            "per-frame accuracy."
        }
      ],

      trade: {
        buys: [
          "Compact, background-independent representation of a person.",
          "Enables action recognition, form analysis, ergonomics, animation.",
          "Far less identifying than raw video.",
          "Real-time on modest hardware with lightweight models."
        ],
        costs: [
          "2D only without multiple views or depth.",
          "Occlusion is a persistent failure mode.",
          "Left-right confusion is common.",
          "Top-down cost scales with the number of people.",
          "Gait remains identifying despite appearing anonymous."
        ],
        avoid: [
          "You need object identity across frames — that is tracking.",
          "The action is defined by objects or context rather than posture.",
          "Occlusion is severe and constant.",
          "You need reliable 3D from a single camera."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "gelu",

      why: {
        before: "**ReLU** — `max(0, x)` — replaced sigmoid and tanh because it " +
          "does not saturate for positive inputs, so gradients flow and deep " +
          "networks train.",
        problem: "ReLU is **not differentiable at zero** and has a hard cutoff: " +
          "a unit whose input goes negative outputs exactly zero and receives " +
          "exactly zero gradient. It can become permanently inactive — the " +
          "*dying ReLU* problem — and the sharp corner interacts badly with " +
          "the smooth optimisation landscape transformers seem to prefer.",
        shift: "Weight the input by the **probability that it is positive** " +
          "under a standard normal: `GELU(x) = x · Φ(x)`. That gives a smooth " +
          "curve that is nearly zero for very negative inputs, nearly identity " +
          "for very positive ones, and **slightly negative** in between — a " +
          "soft, probabilistically-motivated gate rather than a hard switch."
      },

      num: {
        t: "Activation functions in practice",
        h: ["Function", "Smooth?", "Used in"],
        r: [
          ["ReLU", "**no** — corner at 0", "CNNs, most classical nets"],
          ["**GELU**", "**yes**", "**BERT, GPT-2/3, ViT**"],
          ["SiLU / Swish", "yes", "EfficientNet, YOLO"],
          ["**SwiGLU**", "yes, **gated**", "**Llama, PaLM, most modern LLMs**"]
        ],
        n: "The last row is where the field actually went: **SwiGLU** — a " +
          "gated variant combining Swish with a learned gate — outperforms " +
          "GELU in most recent large models, at the cost of an extra weight " +
          "matrix in the feed-forward block (usually compensated by reducing " +
          "the hidden dimension to keep parameter count constant). Note also " +
          "that GELU is often computed with a **tanh approximation** rather " +
          "than the exact Gaussian CDF, because the exact form calls `erf` " +
          "which is slower — the two differ slightly, and a model trained with " +
          "one and served with the other has a small mismatch that is " +
          "occasionally a real bug. Noam Shazeer's own paper on these variants " +
          "concludes, memorably, that their success is attributable to *divine " +
          "benevolence*, which is a fair summary of how well anyone understands " +
          "why one activation beats another."
      },

      miss: [
        {
          w: "GELU is better than ReLU, so it should be used everywhere.",
          r: "It wins consistently in **transformers** and the difference in " +
            "CNNs is small or absent. ReLU is cheaper and remains standard in " +
            "convolutional networks. Activation choice is empirical and " +
            "architecture-dependent, not universally ordered."
        },
        {
          w: "The smoothness is why it works.",
          r: "That is the usual explanation and it is not established. " +
            "Swish/SiLU is also smooth and performs differently; SwiGLU beats " +
            "both through **gating** rather than smoothness. The honest " +
            "position is that this is empirical and the mechanism is not well " +
            "understood."
        },
        {
          w: "The tanh approximation is equivalent to exact GELU.",
          r: "It is very close and **not identical**. Frameworks differ in " +
            "which they use by default, and a checkpoint trained with one and " +
            "served with the other has a small systematic difference — usually " +
            "harmless, occasionally the cause of a puzzling accuracy drop after " +
            "porting a model."
        },
        {
          w: "Choosing the right activation is an important tuning decision.",
          r: "It is one of the **lower-leverage** choices. Data quality, " +
            "learning rate, model scale and architecture all matter far more. " +
            "Use whatever the reference architecture uses and spend the effort " +
            "elsewhere."
        }
      ],

      trade: {
        buys: [
          "Smooth and differentiable everywhere.",
          "No dying-unit problem.",
          "Empirically better in transformers.",
          "A probabilistic interpretation as a stochastic gate."
        ],
        costs: [
          "More expensive than ReLU — an approximation is normally used.",
          "The exact/approximate distinction is a portability trap.",
          "The advantage is empirical and not well explained.",
          "Superseded by SwiGLU in recent large models."
        ],
        avoid: [
          "The architecture is a CNN where ReLU is standard and cheaper.",
          "Inference cost matters on constrained hardware.",
          "You are building a modern LLM — **SwiGLU** is the current default.",
          "You are treating activation choice as a major tuning lever."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "jax",

      why: {
        before: "PyTorch and TensorFlow are deep learning **frameworks** — " +
          "layers, optimisers, training loops, and a large object-oriented " +
          "surface built around neural networks specifically.",
        problem: "Much scientific computing is not neural networks, and it " +
          "still wants automatic differentiation, GPU acceleration and " +
          "vectorisation. Framework abstractions get in the way, and " +
          "PyTorch's mutable-state, define-by-run model is hard to compile " +
          "aggressively.",
        shift: "Provide **composable function transformations** over NumPy-like " +
          "code instead of a framework. `grad` differentiates, `jit` compiles " +
          "via XLA, `vmap` vectorises, `pmap` parallelises across devices — " +
          "and they **compose arbitrarily**. The price is a **functional " +
          "programming discipline**: pure functions, no side effects, explicit " +
          "random state."
      },

      num: {
        t: "The four transformations, and what they demand",
        h: ["Transform", "Does", "Requires"],
        r: [
          ["`grad`", "automatic differentiation", "pure function"],
          ["**`jit`**", "**XLA compilation**", "**static shapes**"],
          ["`vmap`", "auto-vectorise over a batch axis", "no data-dependent control flow"],
          ["`pmap` / `shard_map`", "parallelise across devices", "—"],
          ["All of them", "**compose freely**", "**functional purity**"]
        ],
        n: "**Static shapes** is the constraint that decides whether JAX suits " +
          "your problem. `jit` compiles a specialised kernel per input shape, " +
          "so a shape it has not seen triggers **recompilation** — which is " +
          "excellent for fixed-size training batches and painful for variable-" +
          "length sequences, where you must pad to buckets. The functional " +
          "discipline shows up most visibly in **random numbers**: there is no " +
          "global seed, and you must thread an explicit `PRNGKey` through your " +
          "code and split it whenever you need independent randomness. That is " +
          "genuinely more work and it makes randomness **reproducible across " +
          "devices and parallelism**, which is why researchers who need exact " +
          "reproducibility value it."
      },

      miss: [
        {
          w: "JAX is Google's PyTorch.",
          r: "It is a **numerical computing library with transformations**, not " +
            "a deep learning framework. It has no layers, optimisers or " +
            "training loops — those come from **Flax**, **Haiku** or **Optax** " +
            "built on top. The comparison is closer to NumPy than to PyTorch."
        },
        {
          w: "`jit` always makes code faster.",
          r: "It compiles per input **shape**. Variable shapes cause repeated " +
            "recompilation that can be far slower than not compiling at all. " +
            "The first call also includes compilation time, which surprises " +
            "people benchmarking naively."
        },
        {
          w: "You can use Python control flow inside jitted functions.",
          r: "Only control flow that does not depend on **traced values**. " +
            "`if x > 0` where `x` is a traced array fails, because tracing does " +
            "not have concrete values. You need `jax.lax.cond`, `scan` and " +
            "`while_loop`, which is a real adjustment."
        },
        {
          w: "The functional style is just a stylistic preference.",
          r: "It is **required**. In-place mutation does not work — arrays are " +
            "immutable, and you use `.at[].set()` which returns a new array. " +
            "Side effects inside jitted functions run only during tracing, so a " +
            "`print` fires once and then never again. These are behavioural " +
            "consequences, not conventions."
        }
      ],

      trade: {
        buys: [
          "Composable transformations that combine freely.",
          "XLA compilation gives excellent performance.",
          "`vmap` removes hand-written batching entirely.",
          "First-class TPU support.",
          "Functional purity makes reproducibility and parallelism cleaner."
        ],
        costs: [
          "Static shape requirement causes recompilation.",
          "Functional discipline is a real adjustment.",
          "Debugging traced code is harder — no ordinary prints.",
          "Smaller ecosystem than PyTorch.",
          "Needs a separate neural network library."
        ],
        avoid: [
          "Shapes are highly dynamic — variable-length sequences without " +
            "bucketing.",
          "The team knows PyTorch and the gain does not justify retraining " +
            "them.",
          "You need the PyTorch deployment and serving ecosystem.",
          "The work is standard supervised learning where PyTorch is simpler."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "image-registration",

      why: {
        before: "Comparing two images of the same scene — a scan from January " +
          "and one from June, two satellite passes, two microscope frames — " +
          "meant comparing them as captured.",
        problem: "They are never aligned. The patient lay differently, the " +
          "satellite passed at a different angle, the stage shifted. Any " +
          "pixel-wise comparison then measures **misalignment** rather than " +
          "change, and a subtraction image is dominated by edges rather than by " +
          "what actually differs.",
        shift: "Find the **transformation** that maps one image onto the other, " +
          "then apply it. The problem decomposes into four choices: what " +
          "**transformation model** (rigid, affine, deformable), what " +
          "**similarity metric**, what **optimiser**, and what " +
          "**interpolation** — and the metric choice is the one that decides " +
          "whether it works at all."
      },

      num: {
        t: "Transformation models, by degrees of freedom",
        h: ["Model", "DoF (2D)", "Preserves", "Use for"],
        r: [
          ["Rigid", "3", "shape and size", "same rigid object"],
          ["Similarity", "4", "shape", "+ scale change"],
          ["Affine", "6", "parallel lines", "mild geometric distortion"],
          ["Projective", "8", "straight lines", "**different viewpoints**"],
          ["**Deformable**", "**thousands**", "topology, ideally", "**soft tissue, growth**"]
        ],
        n: "The **metric** choice matters more than the model. For images from " +
          "the **same modality**, correlation or sum-of-squared-differences " +
          "works. For **different modalities** — aligning an MRI to a CT, where " +
          "bone is bright in one and dark in the other — intensities are not " +
          "comparable at all, and you need **mutual information**, which " +
          "measures statistical dependence rather than similarity. That single " +
          "insight made multi-modal medical registration possible. **Deformable** " +
          "registration is the dangerous end: with thousands of degrees of " +
          "freedom it can warp anything into anything, so regularisation and " +
          "topology preservation are essential — an unregularised deformable " +
          "registration will happily fold tissue through itself to improve the " +
          "metric."
      },

      miss: [
        {
          w: "Registration is just aligning images.",
          r: "*Which* transformation you allow determines what the result " +
            "means. A **rigid** registration says *the same object moved*; a " +
            "**deformable** one says *the shape changed and here is how*. " +
            "Choosing deformable when rigid is correct can warp away the very " +
            "difference you were trying to measure."
        },
        {
          w: "A better similarity score means a better alignment.",
          r: "With enough degrees of freedom the metric can always be improved " +
            "by warping the image into nonsense. This is why deformable " +
            "registration needs **regularisation** penalising implausible " +
            "deformations, and why the metric alone is not a validity check."
        },
        {
          w: "Deep learning has replaced classical registration.",
          r: "Learned methods (VoxelMorph and successors) are dramatically " +
            "**faster** — inference rather than per-pair optimisation — and " +
            "classical iterative methods remain competitive on accuracy and " +
            "**more trustworthy** where no training data exists for the " +
            "specific anatomy or modality."
        },
        {
          w: "Interpolation is a minor implementation detail.",
          r: "Applying a transform requires resampling, and nearest-neighbour " +
            "creates aliasing while smooth interpolation blurs. In quantitative " +
            "imaging this changes measured values, so **label maps use " +
            "nearest-neighbour** and intensity images use linear or spline — " +
            "getting it backwards corrupts the analysis."
        }
      ],

      trade: {
        buys: [
          "Makes before-and-after comparison meaningful.",
          "Enables multi-modal fusion — MRI with CT, optical with radar.",
          "Foundation of atlas-based segmentation and population studies.",
          "Mutual information handles genuinely incomparable intensities."
        ],
        costs: [
          "Iterative optimisation is slow, especially deformable.",
          "Deformable registration can produce implausible warps.",
          "Metric and model choice require domain knowledge.",
          "Validating that a registration is correct is genuinely hard."
        ],
        avoid: [
          "Images are already aligned by acquisition.",
          "You need feature correspondence rather than dense alignment — use " +
            "keypoints.",
          "The scene changed so much that no transformation is meaningful.",
          "A rigid transform suffices and you are reaching for deformable."
        ]
      }
    }

  ]);
})(window.TD = window.TD || {});
