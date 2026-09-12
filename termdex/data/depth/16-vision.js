/* ==========================================================================
   Depth pass 16 — computer vision, and the architectures built for data that
   is not a sequence.

   The vision terms trace one long argument: how much structure should be
   built into the model. Classical CV hand-engineered every feature (SIFT),
   CNNs learned features but assumed locality, and ViTs assume almost
   nothing and demand data instead. Each step traded human prior knowledge
   for learned representation, and each was right for its era's data scale.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "receptive-field",

      why: {
        before: "A convolutional network was understood layer by layer: this " +
          "layer has 64 filters, that one has 128. The architecture was a list " +
          "of hyperparameters.",
        problem: "That description does not answer the question that decides " +
          "whether the network can work: **how much of the image can one unit " +
          "actually see?** A network detecting cars whose deepest units see " +
          "only a 30-pixel patch cannot detect a car — it has never seen one, " +
          "only fragments.",
        shift: "Compute it. The receptive field grows with depth, kernel size " +
          "and stride, and it is a property you can calculate before training " +
          "anything. If the objects you care about are larger than it, the " +
          "architecture is wrong regardless of how you tune it."
      },

      num: {
        t: "How receptive field grows",
        h: ["Mechanism", "Effect on RF", "Cost"],
        r: [
          ["Stack 3×3 convs", "+2 per layer", "linear — slow growth"],
          ["Larger kernel (7×7)", "+6 per layer", "**k² parameters**"],
          ["Stride 2 / pooling", "**doubles** growth rate", "loses resolution"],
          ["Dilated conv (rate r)", "+2r per layer", "**free** — same params"],
          ["Self-attention", "**global immediately**", "quadratic in tokens"]
        ],
        n: "Two 3×3 convolutions have the same 5×5 receptive field as one 5×5 " +
          "convolution, with **18 parameters instead of 25** and an extra " +
          "non-linearity — which is the entire argument VGG made for small " +
          "kernels, and why they became standard. The crucial subtlety is that " +
          "the **effective** receptive field is much smaller than the " +
          "theoretical one: contributions decay roughly Gaussian from the " +
          "centre, so a unit with a theoretical 200-pixel field may " +
          "meaningfully depend on only ~70. This is why segmentation " +
          "architectures use dilated convolutions or explicit global context " +
          "modules rather than relying on depth alone."
      },

      miss: [
        {
          w: "A deeper network always has a large enough receptive field.",
          r: "With 3×3 convolutions and no downsampling it grows by only 2 " +
            "pixels per layer — **50 layers reaches 101 pixels**, which is " +
            "inadequate for large objects in a 512-pixel image. Downsampling or " +
            "dilation is what actually makes it grow fast enough."
        },
        {
          w: "The theoretical receptive field is what the unit sees.",
          r: "Luo et al. (2016) showed the **effective** receptive field is " +
            "roughly Gaussian and substantially smaller — often a fraction of " +
            "the theoretical size. Architectures are frequently under-powered " +
            "in practice despite calculating out fine on paper."
        },
        {
          w: "Larger receptive fields are always better.",
          r: "For **localisation** tasks, too much context blurs precision — a " +
            "unit responsible for a boundary pixel that averages over half the " +
            "image loses the edge. This is why U-Net uses **skip connections**, " +
            "combining deep semantic features with shallow high-resolution ones."
        },
        {
          w: "Transformers removed the need to think about this.",
          r: "Self-attention gives global range from layer one, which removes " +
            "*this* constraint and introduces others: quadratic cost, and the " +
            "loss of the locality prior that made CNNs data-efficient. " +
            "Hierarchical designs like Swin deliberately **reintroduce** " +
            "restricted windows because unrestricted global attention is " +
            "unaffordable at image resolution."
        }
      ],

      trade: {
        buys: [
          "A calculable check that an architecture can see what it must.",
          "Explains why downsampling and dilation exist.",
          "Guides kernel and depth choices with arithmetic instead of guessing.",
          "Diagnoses a class of failure that looks like a training problem."
        ],
        costs: [
          "The theoretical figure overstates the effective one.",
          "Growing it costs resolution, parameters or compute.",
          "Says nothing about whether the features learned are useful."
        ],
        avoid: [
          "The architecture is attention-based with global range already.",
          "Objects are small and uniform relative to the image.",
          "You are fine-tuning a proven backbone — the design question is " +
            "settled.",
          "The bottleneck is data or labels, which no architecture change " +
            "fixes."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "anchor-box",

      why: {
        before: "Early detectors slid a window across the image at many scales " +
          "and ran a classifier at each position — enormously expensive and " +
          "still bad at objects with unusual aspect ratios.",
        problem: "Regressing a box directly from an image region is an " +
          "unstable learning problem: the network must predict arbitrary " +
          "coordinates from scratch, and *tall thin* and *short wide* objects " +
          "at the same location need different answers from one prediction " +
          "head.",
        shift: "Predefine a set of **reference boxes** at each location — " +
          "several scales and aspect ratios — and have the network predict " +
          "only a small **offset** from the nearest one, plus a confidence. " +
          "Regressing a correction to a reasonable starting point is far easier " +
          "than regressing absolute coordinates."
      },

      num: {
        t: "Anchor-based against anchor-free detectors",
        h: ["", "Anchor-based", "Anchor-free"],
        r: [
          ["Examples", "Faster R-CNN, YOLOv3, SSD", "FCOS, CenterNet, DETR"],
          ["Hyperparameters", "**scales, ratios, IoU thresholds**", "few"],
          ["Class imbalance", "severe — mostly background", "milder"],
          ["Boxes per image", "~100k anchors", "one per location"],
          ["Tuning burden", "high, dataset-specific", "low"]
        ],
        n: "The imbalance is the defining problem: with ~100,000 anchors and " +
          "perhaps 10 objects, **99.99% of training examples are background**, " +
          "so a naive loss is minimised by predicting *nothing here* everywhere. " +
          "**Focal loss** was invented for exactly this — down-weighting easy " +
          "negatives so the rare positives dominate the gradient. Anchor design " +
          "is also dataset-specific: anchors tuned for COCO's object " +
          "distribution are wrong for aerial imagery or text detection, and " +
          "YOLOv2 onward **cluster the training boxes with k-means** to derive " +
          "anchors from the data rather than guessing them."
      },

      miss: [
        {
          w: "More anchors give better detection.",
          r: "More anchors worsen the imbalance and increase compute, with " +
            "diminishing returns on recall. The goal is a **small set that " +
            "covers the actual box distribution**, which is why clustering the " +
            "training data beats adding more hand-chosen shapes."
        },
        {
          w: "Anchors are a fundamental part of object detection.",
          r: "They are one design choice, and modern detectors increasingly " +
            "drop them. **DETR** treats detection as set prediction with " +
            "learned queries and no anchors at all; FCOS predicts distances to " +
            "box edges per pixel. Anchors solved a real problem in 2015 and are " +
            "not load-bearing."
        },
        {
          w: "The IoU threshold for positive anchors is not important.",
          r: "It determines which anchors are trained as positives and is one " +
            "of the most sensitive hyperparameters. Set too high, small objects " +
            "get **no** positive anchor and are never learned; too low, and " +
            "poorly-aligned anchors are trained as correct. Cascade R-CNN " +
            "exists specifically to address this by using increasing thresholds " +
            "across stages."
        },
        {
          w: "Non-maximum suppression is a post-processing detail.",
          r: "It is a **non-differentiable, hand-tuned** step in the middle of " +
            "an otherwise learned pipeline, and it fails predictably on " +
            "overlapping objects — a crowd of people suppresses genuine " +
            "detections. Removing NMS is one of DETR's main claimed advantages."
        }
      ],

      trade: {
        buys: [
          "Turns coordinate regression into easy offset regression.",
          "Handles multiple objects and aspect ratios at one location.",
          "Well understood, with mature implementations.",
          "Dense prediction enables single-stage speed."
        ],
        costs: [
          "Many hyperparameters requiring dataset-specific tuning.",
          "Extreme foreground-background imbalance.",
          "Anchors tuned for one dataset transfer poorly.",
          "Requires NMS, which is hand-tuned and fails in crowds."
        ],
        avoid: [
          "Objects vary wildly in shape — anchor-free adapts better.",
          "You want an end-to-end differentiable pipeline — **DETR**.",
          "Objects overlap heavily, where NMS suppresses true positives.",
          "You lack the data or time to tune anchors properly."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "contrastive-learning",

      why: {
        before: "Representation learning needed labels. Pretrain on ImageNet's " +
          "million labelled images, then transfer — which caps you at the " +
          "labelled data available, and labelling is the expensive part.",
        problem: "There are billions of unlabelled images and no obvious " +
          "training signal in them. Autoencoders reconstruct pixels, which " +
          "wastes capacity on texture and lighting detail that carries no " +
          "semantic meaning.",
        shift: "Create the labels from the data's own structure. **Two " +
          "augmentations of the same image should have similar " +
          "representations; two different images should not.** No human labels " +
          "required — the supervision comes from knowing which crops came from " +
          "the same source."
      },

      num: {
        t: "What contrastive methods need",
        h: ["Method", "Negatives needed", "Key mechanism"],
        r: [
          ["SimCLR", "**large batch (4096+)**", "in-batch negatives"],
          ["MoCo", "moderate", "momentum-updated queue"],
          ["BYOL", "**none**", "predictor + stop-gradient"],
          ["CLIP", "in-batch, 32k", "image-text pairs"]
        ],
        n: "Negatives are the practical difficulty. Contrastive loss needs " +
          "*many* negatives to be informative, and SimCLR's answer — batch " +
          "size 4096 — requires a TPU pod. **MoCo** decoupled negatives from " +
          "batch size with a queue of past encodings and a slowly-updated " +
          "momentum encoder. **BYOL** then showed that with a predictor head " +
          "and a stop-gradient, negatives are not needed at all, which was " +
          "surprising: the obvious failure mode is *collapse*, where the " +
          "network maps everything to one vector and trivially satisfies the " +
          "loss. **Augmentation choice matters more than architecture** — " +
          "SimCLR's ablations showed random crop plus colour jitter is the " +
          "critical pair, because without colour jitter the network can cheat " +
          "by matching colour histograms."
      },

      miss: [
        {
          w: "Contrastive learning is unsupervised.",
          r: "It is **self-supervised**: labels are generated from the data's " +
            "structure rather than absent. That distinction matters because the " +
            "quality of the generated task — the augmentations — determines " +
            "what is learned, and designing it is a supervised-style modelling " +
            "decision."
        },
        {
          w: "The augmentations are just data augmentation.",
          r: "They **define the invariances the representation learns**. " +
            "Training with colour jitter teaches the model that colour is " +
            "irrelevant — which is wrong if you are classifying ripe fruit or " +
            "reading traffic lights. The augmentation set is a statement about " +
            "what should not matter."
        },
        {
          w: "You need negatives, or the model collapses.",
          r: "That was the assumption until **BYOL**, which uses only positive " +
            "pairs with an asymmetric predictor and stop-gradient and does not " +
            "collapse. Exactly why remains debated — batch norm's implicit " +
            "contrast was one proposed explanation and was subsequently " +
            "challenged."
        },
        {
          w: "It gives you a model ready for your task.",
          r: "It gives a **representation**. You still need labelled data to " +
            "train a head — though far less, which is the point: contrastive " +
            "pretraining plus 1–10% of the labels often matches fully " +
            "supervised training on all of them."
        }
      ],

      trade: {
        buys: [
          "Learns strong representations from unlabelled data.",
          "Dramatically reduces the labels needed downstream.",
          "Representations transfer well across tasks.",
          "The basis of CLIP and multimodal alignment."
        ],
        costs: [
          "Large batches or a negative queue, so compute-heavy.",
          "Augmentation design is domain-specific and consequential.",
          "Collapse risk needs architectural care.",
          "Learned invariances may be wrong for your task."
        ],
        avoid: [
          "You already have abundant labels — supervised training is simpler " +
            "and stronger.",
          "You cannot define meaningful augmentations for the domain.",
          "Compute is limited; these methods are expensive to pretrain.",
          "A suitable pretrained model already exists — use it."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "graph-neural-network",

      why: {
        before: "Neural networks assumed a fixed grid (images) or a fixed " +
          "sequence (text). Both have a rigid, known structure.",
        problem: "Molecules, social networks, road systems and knowledge graphs " +
          "have **no fixed size, no natural ordering, and irregular " +
          "connectivity**. Flattening a graph into a vector destroys exactly " +
          "the relational information that makes it a graph, and the flattening " +
          "depends on an arbitrary node ordering.",
        shift: "Operate on the structure directly with **message passing**: " +
          "each node repeatedly aggregates information from its neighbours and " +
          "updates its own representation. The aggregation must be " +
          "**permutation invariant** — sum, mean, max — so the result does not " +
          "depend on the arbitrary order neighbours are listed in."
      },

      num: {
        t: "Message passing rounds and reach",
        h: ["Layers", "Node sees", "Problem"],
        r: [
          ["1", "immediate neighbours", "too local"],
          ["2–3", "**2–3 hops** — the usual choice", "—"],
          ["5+", "most of the graph", "**over-smoothing**"],
          ["Many", "everything", "all nodes converge to one vector"]
        ],
        n: "**Over-smoothing** is the defining limitation and the reason GNNs " +
          "are shallow where CNNs are deep: repeated neighbour averaging is a " +
          "diffusion process, and it converges to every node holding the same " +
          "representation. Two or three layers is standard. The second hard " +
          "limit is **expressiveness** — standard message-passing GNNs are " +
          "provably no more powerful than the **Weisfeiler-Lehman graph " +
          "isomorphism test**, so there are pairs of distinct graphs they " +
          "cannot tell apart at all. And on very large graphs, a node's " +
          "3-hop neighbourhood can be most of the graph, which is why " +
          "**neighbour sampling** (GraphSAGE) exists."
      },

      miss: [
        {
          w: "Deeper GNNs capture more structure.",
          r: "Past a few layers they capture **less** — over-smoothing makes " +
            "all node representations converge. This is the opposite of the CNN " +
            "intuition, and it is why residual connections and jumping " +
            "knowledge networks exist as mitigations."
        },
        {
          w: "GNNs can distinguish any two different graphs.",
          r: "Standard message-passing GNNs are bounded by the 1-WL test and " +
            "**cannot distinguish** certain non-isomorphic graphs — for " +
            "instance, they cannot count triangles. Higher-order GNNs and " +
            "positional encodings exist to exceed this bound."
        },
        {
          w: "You need a GNN for graph data.",
          r: "Often you do not. Hand-engineered graph features — degree, " +
            "centrality, clustering coefficient — fed to gradient boosting is a " +
            "strong and frequently unbeaten baseline. GNNs win when the " +
            "relational structure is complex and the features are hard to " +
            "specify."
        },
        {
          w: "Transformers are unrelated to GNNs.",
          r: "A transformer **is** a GNN on a fully connected graph, with " +
            "attention as the aggregation function. Positional encodings supply " +
            "the structure that graph edges supply elsewhere. Graph " +
            "transformers make the connection explicit."
        }
      ],

      trade: {
        buys: [
          "Operates on irregular structure without flattening it.",
          "Permutation invariant by construction.",
          "Generalises to graphs of unseen size and shape.",
          "State of the art in molecular property prediction and " +
            "recommendation."
        ],
        costs: [
          "Over-smoothing caps useful depth at a few layers.",
          "Expressiveness bounded by the WL test.",
          "Neighbourhood explosion on large dense graphs.",
          "Batching irregular structures is awkward and framework-specific."
        ],
        avoid: [
          "The data is genuinely tabular — the graph is imagined.",
          "Simple graph features plus gradient boosting suffices, which is " +
            "common.",
          "The graph is enormous and dense — sampling may lose what matters.",
          "The task depends on structure the WL test cannot see, such as " +
            "counting cycles."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "mamba",

      why: {
        before: "Transformers dominate sequence modelling, and their attention " +
          "is `O(n²)` in sequence length, with a KV cache that grows linearly " +
          "with context during generation.",
        problem: "That is a hard wall for very long sequences — genomics, " +
          "high-resolution audio, million-token documents. **State space " +
          "models** offered linear scaling and had a fatal weakness: their " +
          "dynamics were **fixed**, applying the same transition regardless of " +
          "input, so they could not selectively remember or ignore content the " +
          "way attention does.",
        shift: "Make the state space parameters **a function of the input** — " +
          "*selective* SSM. The model can now choose what to keep and what to " +
          "forget based on what it is reading. That breaks the convolutional " +
          "formulation that made SSMs fast, so Mamba adds a hardware-aware " +
          "**parallel scan** to recover training speed."
      },

      num: {
        t: "Mamba against transformer",
        h: ["Property", "Transformer", "Mamba"],
        r: [
          ["Training complexity", "O(n²)", "**O(n)**"],
          ["Inference per token", "O(n) — grows with context", "**O(1)**"],
          ["Inference memory", "KV cache grows", "**constant state**"],
          ["Reported throughput", "1×", "~5× at inference"],
          ["In-context retrieval", "**strong**", "weaker"]
        ],
        n: "The **constant-size state** is the headline: generation cost per " +
          "token does not grow with context at all, where a transformer must " +
          "attend over an ever-larger KV cache. The honest counterpoint is the " +
          "last row. Compressing history into a fixed state means information " +
          "is necessarily lost, and Mamba is measurably weaker at " +
          "**copying and precise in-context retrieval** — finding an exact " +
          "string mentioned 50,000 tokens ago. This is why **hybrid** " +
          "architectures (Jamba, Zamba) interleave a few attention layers " +
          "among many Mamba layers: linear scaling for most of the work, " +
          "attention where exact recall is needed."
      },

      miss: [
        {
          w: "Mamba replaces transformers.",
          r: "It is competitive at similar scale and **weaker at retrieval " +
            "tasks**. The direction the field actually took is hybrid: mostly " +
            "SSM layers with a few attention layers. Framing it as a " +
            "replacement misses why the hybrids exist."
        },
        {
          w: "It is an RNN, so it cannot be trained in parallel.",
          r: "That was true of classical RNNs and is the specific problem Mamba " +
            "solves. A **parallel scan** computes the recurrence across the " +
            "sequence in `O(log n)` depth, so training parallelises across the " +
            "sequence. It behaves like an RNN at inference and like a " +
            "parallelisable model at training."
        },
        {
          w: "Linear scaling means unlimited context for free.",
          r: "Compute is linear; **capacity is fixed**. A constant-size state " +
            "cannot hold unlimited information, so quality on long-range recall " +
            "degrades even though the cost does not. Cheap to run over a " +
            "million tokens is not the same as *effective* over them."
        },
        {
          w: "State space models are a new idea.",
          r: "They come from classical control theory, and the deep-learning " +
            "line runs S4 → H3 → Mamba. Mamba's contributions are specifically " +
            "**selectivity** and the hardware-aware scan, not the state-space " +
            "formulation itself."
        }
      ],

      trade: {
        buys: [
          "Linear training and constant per-token inference cost.",
          "Constant memory during generation — no growing KV cache.",
          "Practical for very long sequences.",
          "Around 5× inference throughput at comparable quality."
        ],
        costs: [
          "Weaker at exact in-context retrieval and copying.",
          "Fixed state capacity regardless of context length.",
          "Far less tooling, tuning knowledge and ecosystem than transformers.",
          "Requires custom kernels for the scan to be fast."
        ],
        avoid: [
          "The task depends on precise retrieval from long context — use " +
            "attention or a hybrid.",
          "Sequences are short, where quadratic cost is irrelevant.",
          "You need mature tooling and a large body of pretrained models.",
          "You cannot deploy the custom CUDA kernels it depends on."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "grad-cam",

      why: {
        before: "A CNN classified an image and gave a confidence number. Why it " +
          "decided that was entirely opaque — the useful information was " +
          "distributed across millions of weights.",
        problem: "Opacity is dangerous in specific ways. A famous case: a " +
          "classifier distinguishing huskies from wolves turned out to be " +
          "detecting **snow in the background**, because wolf photos had snow. " +
          "It scored well and had learned nothing about animals.",
        shift: "Use the gradients you already compute. The gradient of the " +
          "class score with respect to the **final convolutional feature " +
          "maps** says how much each map mattered; weight the maps by those " +
          "gradients, sum, and apply ReLU. The result is a coarse heatmap over " +
          "the image showing which regions drove the prediction."
      },

      num: {
        t: "Visual explanation methods",
        h: ["Method", "Resolution", "Needs", "Weakness"],
        r: [
          ["**Grad-CAM**", "coarse (last conv layer)", "gradients only", "low detail"],
          ["Guided Backprop", "pixel-level", "modified backward pass", "**fails sanity checks**"],
          ["Occlusion", "coarse", "many forward passes", "slow"],
          ["Integrated Gradients", "pixel-level", "a baseline + many passes", "baseline-sensitive"],
          ["Attention maps", "patch-level", "attention model", "contested as explanation"]
        ],
        n: "Grad-CAM's resolution is limited by the last convolutional layer — " +
          "typically **7×7** or **14×14** for a 224×224 input, upsampled to " +
          "look smooth. It genuinely localises and does not give pixel " +
          "precision. The important caveat comes from Adebayo et al.'s " +
          "**sanity checks** (2018): several popular saliency methods produce " +
          "similar-looking maps even when the model's weights are " +
          "**randomised**, meaning they were showing image edges rather than " +
          "model behaviour. Grad-CAM passes these checks where Guided " +
          "Backpropagation largely does not — a reason to prefer it despite " +
          "the coarser output."
      },

      miss: [
        {
          w: "Grad-CAM shows what the model is looking at.",
          r: "It shows which **spatial regions of the final feature maps** " +
            "contributed positively to that class score. That is a specific " +
            "technical statement, not a window into reasoning. A model can " +
            "produce a correct-looking heatmap and still be using a spurious " +
            "correlation within that region."
        },
        {
          w: "A good heatmap means the model is correct.",
          r: "It means the model used a plausible region. The husky-versus-wolf " +
            "case produced heatmaps highlighting the animal *and* the snow — " +
            "the tell was reading it carefully, not that it looked wrong at a " +
            "glance. Heatmaps require interpretation and can reassure falsely."
        },
        {
          w: "It works on any architecture.",
          r: "It requires **convolutional feature maps with spatial " +
            "structure**. It does not apply directly to a plain MLP or to " +
            "tabular models. Transformer variants exist and must choose which " +
            "layer to target, which changes the result substantially."
        },
        {
          w: "Higher resolution explanations are better.",
          r: "Not if they are unfaithful. Pixel-precise methods that fail " +
            "randomisation sanity checks are showing you the image's edges " +
            "dressed as an explanation. A coarse but faithful map is more " +
            "useful than a sharp but meaningless one."
        }
      ],

      trade: {
        buys: [
          "Fast — one backward pass, no retraining and no architecture change.",
          "Passes randomisation sanity checks that several rivals fail.",
          "Class-discriminative: different classes give different maps.",
          "Effective at catching spurious background correlations."
        ],
        costs: [
          "Coarse resolution, limited by the final conv layer.",
          "Requires convolutional spatial features.",
          "Shows correlation with the score, not causal reasoning.",
          "Easy to over-interpret."
        ],
        avoid: [
          "The model is not convolutional and has no spatial feature maps.",
          "You need pixel-precise attribution and can validate the method's " +
            "faithfulness.",
          "You need a causal explanation, which no saliency method provides.",
          "It would be used to reassure stakeholders rather than to " +
            "investigate — that is its most common misuse."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "sift",

      why: {
        before: "Matching the same object across two photographs meant " +
          "comparing raw pixels, which fails the moment anything moves, " +
          "rotates, or the lighting changes.",
        problem: "You need features that are **the same feature** despite the " +
          "object being closer, rotated, or differently lit. Raw pixel patches " +
          "have none of those invariances, so a photograph of the same building " +
          "from two angles shares almost no matching pixels.",
        shift: "Engineer invariance deliberately. Find keypoints as extrema in " +
          "a **scale-space** (difference of Gaussians across blur levels) so " +
          "scale is handled; assign each a dominant **orientation** and " +
          "describe it relative to that so rotation is handled; describe it as " +
          "a **histogram of gradients**, normalised, so illumination is handled."
      },

      num: {
        t: "SIFT and its descendants",
        h: ["Method", "Descriptor", "Speed", "Licence"],
        r: [
          ["SIFT (1999)", "128-d float", "slow", "**patent expired 2020**"],
          ["SURF", "64-d float", "faster", "still patented"],
          ["ORB", "256-bit binary", "**very fast**", "free"],
          ["Learned (SuperPoint)", "learned", "GPU", "free"]
        ],
        n: "The 128-dimensional descriptor is 4×4 spatial cells × 8 gradient " +
          "orientation bins. The patent expiring in **March 2020** is a real " +
          "historical fact worth knowing — for two decades ORB existed largely " +
          "*because* SIFT could not be used freely in commercial products, and " +
          "OpenCV moved SIFT out of the non-free module afterwards. Classical " +
          "descriptors remain genuinely competitive for **geometric** matching: " +
          "structure-from-motion, panorama stitching and SLAM still use them, " +
          "because they need precise correspondence rather than semantic " +
          "understanding, and they work with no training data and no GPU."
      },

      miss: [
        {
          w: "SIFT is obsolete now that we have deep learning.",
          r: "For **semantic** tasks, yes. For **geometric** correspondence — " +
            "SfM, SLAM, image registration, panorama stitching — classical " +
            "descriptors are still widely used and competitive. COLMAP, the " +
            "standard structure-from-motion tool, uses SIFT."
        },
        {
          w: "SIFT is fully invariant to viewpoint.",
          r: "It is invariant to **scale, rotation and illumination**, and only " +
            "partially robust to affine and perspective change. A large " +
            "viewpoint shift breaks it, which is why **ASIFT** and affine-" +
            "covariant detectors exist."
        },
        {
          w: "More keypoints means better matching.",
          r: "Weak keypoints in low-contrast regions produce unreliable " +
            "descriptors and false matches. SIFT deliberately **discards** " +
            "low-contrast and edge-like candidates, and the ratio test (Lowe's " +
            "0.8 threshold on nearest to second-nearest distance) discards " +
            "ambiguous matches. Filtering is most of what makes it work."
        },
        {
          w: "Matching descriptors gives you the correspondence.",
          r: "It gives **candidate** correspondences with many outliers. " +
            "**RANSAC** or a similar robust estimator is required to fit a " +
            "geometric model and reject them. Descriptor matching without " +
            "geometric verification is not usable."
        }
      ],

      trade: {
        buys: [
          "Scale and rotation invariant matching with no training data.",
          "Runs on CPU with no GPU requirement.",
          "Precise geometric localisation, which learned features often lack.",
          "Well understood, deterministic and debuggable.",
          "Patent-free since 2020."
        ],
        costs: [
          "Slow relative to binary descriptors like ORB.",
          "128 floats per keypoint is a large descriptor.",
          "No semantic understanding — matches texture, not meaning.",
          "Struggles with large viewpoint change and textureless surfaces."
        ],
        avoid: [
          "The task is semantic — recognising object categories rather than " +
            "instances.",
          "You need real-time performance on mobile — **ORB** is far faster.",
          "Surfaces are textureless, where no keypoints exist to find.",
          "Learned features are available and the domain matches their " +
            "training."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "stacking",

      why: {
        before: "Ensembles combined models by **averaging** or **voting** — " +
          "simple, robust, and treating every model as equally trustworthy " +
          "everywhere.",
        problem: "Models are not equally good, and more importantly they are " +
          "not equally good in the same **regions**. One model may be reliable " +
          "on common cases and poor on rare ones, another the reverse. A fixed " +
          "average cannot express that.",
        shift: "**Learn the combination.** Train a meta-model whose inputs are " +
          "the base models' predictions and whose output is the final answer. " +
          "It can learn to weight models differently, and to weight them " +
          "differently depending on the input."
      },

      num: {
        t: "Ensemble methods",
        h: ["Method", "Combines", "Base models", "Risk"],
        r: [
          ["Bagging", "average", "same type, different data", "low"],
          ["Boosting", "weighted sum", "sequential, error-correcting", "overfits noise"],
          ["Voting", "majority", "any", "low"],
          ["**Stacking**", "**a learned model**", "any, diverse", "**leakage**"]
        ],
        n: "The critical implementation detail is that **the meta-model must be " +
          "trained on out-of-fold predictions**. If you train base models on " +
          "the full training set and then train the meta-model on their " +
          "predictions *of that same data*, the base models have effectively " +
          "memorised those rows — their predictions look far better than they " +
          "will be at inference, and the meta-model learns to trust them " +
          "excessively. The correct procedure is k-fold: for each fold, train " +
          "the bases on the other k−1 and predict this one. Getting this wrong " +
          "produces a model that validates beautifully and fails in production, " +
          "which is the most expensive kind of bug."
      },

      miss: [
        {
          w: "Stacking is just an ensemble, so it always helps a bit.",
          r: "Done wrong it actively **hurts** — leakage produces a meta-model " +
            "calibrated to unrealistically good base predictions. Even done " +
            "right the gain over simple averaging is often small, and it costs " +
            "considerable complexity."
        },
        {
          w: "The meta-model should be powerful to learn complex combinations.",
          r: "It should usually be **simple** — logistic or ridge regression is " +
            "the standard choice. It is training on few features (one per base " +
            "model) and relatively little data (the out-of-fold predictions), " +
            "so a complex meta-model overfits readily."
        },
        {
          w: "More base models give a better ensemble.",
          r: "**Diversity** matters more than count. Five highly correlated " +
            "gradient boosting models add almost nothing; a boosted tree, a " +
            "neural network and a linear model make different errors and " +
            "combine usefully. The point of an ensemble is uncorrelated " +
            "mistakes."
        },
        {
          w: "It is what wins Kaggle competitions, so it is best practice.",
          r: "It wins where a **0.1% metric gain** is decisive and inference " +
            "cost is irrelevant. In production you are running every base model " +
            "plus the meta-model on every request, for a gain that is often " +
            "smaller than the variance in your data. The trade is usually poor " +
            "outside competitions."
        }
      ],

      trade: {
        buys: [
          "Learns which model to trust, potentially per input region.",
          "Combines genuinely different model families.",
          "Usually beats simple averaging when done correctly.",
          "Can exploit complementary strengths automatically."
        ],
        costs: [
          "Leakage risk if out-of-fold predictions are not used.",
          "Every base model must run at inference — multiplied latency and " +
            "cost.",
          "Much harder to debug, explain and monitor.",
          "Gains are often marginal."
        ],
        avoid: [
          "Inference latency or cost matters — you pay for every base model.",
          "You need interpretability; a stack is opaque by construction.",
          "Base models are highly correlated, so there is nothing to gain.",
          "The team cannot maintain the k-fold discipline; leakage is silent " +
            "and severe."
        ]
      }
    }

  ]);
})(window.TD = window.TD || {});
