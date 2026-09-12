/* ==========================================================================
   Depth pass 77 — Deep Learning batch 5: spatial operators, ResNet & recurrence.
   Stride, Padding, Pooling, Feature Map,
   Residual Connection, ResNet, Recurrent Neural Network, LSTM.

   Spatial strides downsample feature resolutions; identity skip highways
   defeat degradation; gated cell carousels preserve gradients across temporal loops.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "stride",

      why: {
        before: "Convolutional layers shifted the sliding filter window by a single pixel ($S=1$), " +
          "preserving the full spatial resolution and requiring separate pooling layers to downsample feature dimensions.",
        problem: "Executing convolutions at unit stride across high-resolution images requires excessive floating-point " +
          "operations (FLOPs) and inflates memory footprint during activation caching.",
        shift: "**Stride ($S$): Discrete sliding step size.** " +
          "Advance the kernel window by $S > 1$ pixels along horizontal and vertical axes between successive dot products, " +
          "simultaneously performing spatial filtering and downsampling in a single unified operation."
      },

      num: {
        t: "Stride impact on spatial resolution, FLOPs & receptive field",
        h: ["Stride Setting ($S$)", "Output Spatial Dimension ($W_{\\text{out}}$)", "Layer FLOPs Multiplier", "Downsampling Mechanism"],
        r: [
          ["**Unit Stride ($S=1$)**", "$W - K + 2P + 1$", "$1.0\\times$ (baseline)", "No downsampling; dense spatial coverage"],
          ["**Strided Conv ($S=2$)**", "$\\lfloor \\frac{W - K + 2P}{2} \\rfloor + 1 \\approx W/2$", "**$\\approx 0.25\\times$ ($75\\%$ FLOP reduction)**", "**Learned downsampling**: replaces Max Pooling (Springenberg 2014)"],
          ["**Large Stride ($S=4$ or $S=16$)**", "$\\approx W/4$ or $W/16$", "**Massive compute slash**", "Vision Transformers: $S=16$ patch projection converts image to tokens"],
          ["**Fractional Stride ($S < 1$)**", "Increases spatial dimension (upsampling)", "Expands tensor resolution", "**Transposed Convolution**: used in GANs, super-resolution & VAE decoders"]
        ],
        n: "Stride ($S$) dictates the step size of the convolutional filter " +
          "as it traverses the input tensor. When $S=1$, the kernel evaluates every overlapping " +
          "window, producing an output feature map of nearly identical spatial resolution. " +
          "When $S=2$, the kernel skips every other pixel along both height and width, " +
          "reducing both spatial dimensions by half ($H/2, W/2$) and shrinking the total " +
          "activation area by a factor of **$4\\times$**. In modern deep computer vision " +
          "(such as ResNet and modern ConvNeXt backbones), **Strided Convolutions have " +
          "largely replaced Max Pooling**. Springenberg et al. (2014, *The All Convolutional Net*) " +
          "proved that using a convolution with $S=2$ achieves identical downsampling while " +
          "allowing the network to learn its own parameterized, anti-aliased downsampling filters " +
          "rather than relying on hardcoded heuristics. Furthermore, in **Vision Transformers (ViT)**, " +
          "the initial patch extraction is implemented as a single convolution with $K = 16$ and $S = 16$, " +
          "cleanly mapping non-overlapping $16 \\times 16$ image patches into linear token embeddings in one shot."
      },

      miss: [
        {
          w: "Stride can only be applied along spatial height and width.",
          r: "Stride can be configured independently along any dimension: 1D audio convolutions use 1D strides, while 3D video convolutions use temporal strides across sequential video frames."
        },
        {
          w: "Setting stride S = 2 loses 50% of the input image information.",
          r: "Strided convolution halves spatial resolution, but networks universally compensate by doubling the number of output channels ($C_{\\text{out}} = 2 C_{\\text{in}}$), preserving total representational capacity."
        },
        {
          w: "Max pooling is always computationally faster than strided convolution.",
          r: "Modern GPU tensor cores are heavily optimized for matrix multiplications. A strided convolution running via `im2col` or Winograd often executes faster than separate conv + max-pooling passes."
        },
        {
          w: "Fractional stride is implemented by literally stepping half a pixel.",
          r: "Fractional striding (transposed convolution) is implemented on hardware by padding zeros between input elements and convolving with a standard integer stride."
        }
      ],

      trade: {
        buys: [
          "Learned downsampling: allows the network to optimize its own anti-aliasing spatial pooling filters.",
          "Dramatic compute reduction: setting $S=2$ cuts downstream layer FLOPs and activation VRAM by 75%.",
          "Accelerates receptive field growth: deeper layers view broader spatial context much earlier in the network."
        ],
        costs: [
          "Aggressive striding ($S > 2$) in early layers discards fine-grained sub-pixel edge information.",
          "Can induce checkerboard artifacts in generative decoders when using transposed strided convolutions.",
          "Asymmetric strides ($S_h \\ne S_w$) complicate spatial aspect ratio management in object detection heads."
        ],
        avoid: [
          "Using large strides ($S \\ge 4$) in early layers of segmentation or fine-grained medical imaging models.",
          "Combining $S=2$ strided convolutions immediately with Max Pooling in the same stage (causes severe information loss)."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "padding",

      why: {
        before: "Applying a convolutional filter (e.g. $3 \\times 3$) without padding caused spatial dimensions " +
          "to shrink at every layer ($(W - K + 1)$), while boundary border pixels were sampled far fewer times than central pixels.",
        problem: "In a 50-layer network, losing 2 pixels per layer collapses a $100 \\times 100$ image into zero spatial dimensions " +
          "within 50 layers, making deep architectures impossible while throwing away boundary information.",
        shift: "**Padding ($P$): Boundary frame expansion.** " +
          "Surround the perimeter of input feature maps with synthetic values (typically zeros), " +
          "preserving spatial dimensions across deep layers ('Same' padding) and ensuring border pixels receive equal gradient attention."
      },

      num: {
        t: "Padding modes, spatial resolution formulas & boundary properties",
        h: ["Padding Mode", "Padding Size ($P$)", "Output Size ($W_{\\text{out}}$)", "Border Sampling Property"],
        r: [
          ["**Valid Padding (No Padding)**", "$P = 0$", "$W - K + 1$ (shrinks by $K-1$)", "Border pixels sampled once; center sampled $K^2$ times; spatial erosion"],
          ["**Same Padding (Half Padding)**", "$P = \\lfloor (K - 1) / 2 \\rfloor$", "$W_{\\text{out}} = W$ (strictly identical)", "**Universal standard**: preserves spatial dimensions across arbitrary depth"],
          ["**Full Padding**", "$P = K - 1$", "$W + K - 1$ (expands)", "Every pixel (including corners) sampled an equal number of times"],
          ["**Reflection / Mirror Padding**", "Mirrors edge pixels across border", "$W + 2P$", "Prevents black-border artifacts in super-resolution and style transfer"],
          ["**Replication Padding**", "Replicates edge pixel value outward", "$W + 2P$", "Maintains boundary color continuity without introducing synthetic zeros"]
        ],
        n: "Padding is the simple yet vital mathematical operator that makes " +
          "**deep convolutional networks spatially sustainable**. When convolving a feature map " +
          "of width $W$ with a filter of size $K$, the output width without padding is $W - K + 1$. " +
          "For a standard $3 \\times 3$ kernel, two pixels are shaved off each dimension at every layer. " +
          "Without padding, a $32 \\times 32$ CIFAR-10 image would completely vanish after only 16 layers! " +
          "Furthermore, in **Valid Padding**, a corner pixel is sampled exactly *once* (when the kernel " +
          "touches the corner), whereas a center pixel is sampled $K^2 = 9$ times, causing severe " +
          "**boundary erosion** where edge context is discarded. " +
          "By introducing **Same Padding**—setting $P = \\lfloor \\frac{K - 1}{2} \\rfloor$ (e.g. $P = 1$ for a " +
          "$3 \\times 3$ kernel, or $P = 2$ for a $5 \\times 5$ kernel)—the output spatial dimensions " +
          "remain strictly identical to the input ($W_{\\text{out}} = W$). This spatial invariance " +
          "is what enables architectures like **ResNet** to perform element-wise residual additions " +
          "$F(x) + x$, which mathematically requires $F(x)$ and $x$ to have identical spatial tensor shapes."
      },

      miss: [
        {
          w: "Zero padding introduces false information into the network by adding zeros.",
          r: "Neural networks naturally learn to use border zeros as spatial reference anchors: the presence of zero-padding helps the network infer absolute spatial location and image boundaries."
        },
        {
          w: "You can achieve 'Same' padding with an even kernel size like 4x4.",
          r: "Even-sized kernels require asymmetric padding (e.g. padding 1 pixel on the left and 2 on the right), which shifts feature maps off-center. Odd-sized kernels (3x3, 5x5) pad symmetrically and are universally preferred."
        },
        {
          w: "Padding increases the number of learnable parameters in the convolutional layer.",
          r: "Padding simply extends the input tensor with constant or mirrored numbers before computation. It introduces zero learnable parameters."
        },
        {
          w: "Reflection padding is always identical to zero padding in practice.",
          r: "In generative vision (GANs, image inpainting, style transfer), zero padding creates harsh dark border halos; reflection padding smoothly mirrors visual textures, eliminating boundary artifacts."
        }
      ],

      trade: {
        buys: [
          "Preserves spatial resolution: permits building arbitrarily deep networks without collapsing feature map dimensions.",
          "Enables residual skip connections: guarantees output $F(x)$ matches input $x$ dimensions for element-wise addition.",
          "Protects border information: ensures peripheral pixels are sampled as thoroughly as central pixels."
        ],
        costs: [
          "Slightly increases memory consumption by expanding tensor dimensions in VRAM.",
          "Zero padding can introduce mild boundary edge artifacts in high-fidelity image restoration pipelines.",
          "Requires careful padding calculations when combining odd and even kernel dimensions."
        ],
        avoid: [
          "Using even-sized kernels (e.g. 2x2, 4x4) for standard convolutions without accounting for asymmetric padding shifts.",
          "Omitting padding in deep networks, which rapidly erodes spatial feature maps to zero."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "pooling",

      why: {
        before: "Early computer vision systems were fragile to small spatial perturbations: shifting " +
          "an object by 2 pixels produced a completely different set of internal neural activations.",
        problem: "High-resolution feature maps consume massive GPU memory and retain redundant, high-frequency " +
          "sub-pixel noise that is irrelevant for high-level semantic object recognition.",
        shift: "**Pooling (Subsampling / Aggregation): Spatial downsampling with local translation invariance.** " +
          "Aggregate local spatial neighborhoods using non-parametric operators—taking the maximum (Max Pooling) " +
          "or arithmetic mean (Average Pooling)—to shrink feature dimensions and enforce spatial translation invariance."
      },

      num: {
        t: "Pooling operator comparison & characteristics",
        h: ["Pooling Paradigm", "Mathematical Formulation", "Primary Inductive Bias / Feature", "Standard Domain / Use Case"],
        r: [
          ["**Max Pooling**", "$y = \\max_{m, n \\in \\Omega} x(m, n)$", "**Sharp feature detection**: retains strongest edge or texture signal", "Intermediate feature downsampling in classical CNNs (VGGNet)"],
          ["**Average Pooling**", "$y = \\frac{1}{|\\Omega|} \\sum_{m, n \\in \\Omega} x(m, n)$", "**Smooth background averaging**: retains spatial proportions", "Downsampling smooth feature textures or audio spectrograms"],
          ["**Global Average Pooling (GAP)**", "$y_c = \\frac{1}{H \\cdot W} \\sum_{i=1}^H \\sum_{j=1}^W x(c, i, j)$", "**Eliminates dense layers**: collapses $H \\times W$ into a single scalar per channel", "**Universal standard**: replaces flattening before classification in ResNet"],
          ["**Global Max Pooling**", "$y_c = \\max_{i, j} x(c, i, j)$", "Detects whether a feature appears *anywhere* in the entire image", "Weakly supervised object localization & point-cloud processing (PointNet)"],
          ["**Learnable Parameters**", "**Zero parameters**", "Non-parametric fixed operator", "Runs branchless comparisons or additions on hardware"]
        ],
        n: "Pooling is a fixed, non-parametric spatial subsampling operation. " +
          "A pooling window of size $P_h \\times P_w$ with stride $S$ slides across the input tensor, " +
          "computing a summary statistic over each local neighborhood. In **Max Pooling**, the operator " +
          "selects the maximum activation: $y = \\max_{(i, j) \\in \\Omega} x_{i, j}$. " +
          "This injects a powerful structural prior: **Local Translation Invariance**. If a feature " +
          "(e.g. an eye or corner) shifts by 1-2 pixels within the window, the maximum activation " +
          "remains identical, allowing the network to recognize objects despite camera jitter and minor deformations. " +
          "Furthermore, pooling halves spatial dimensions, cutting the memory footprint for subsequent layers " +
          "by 75% and expanding the **effective receptive field** of downstream neurons. " +
          "A monumental innovation in modern CNN design was **Global Average Pooling (GAP)** (Lin et al. 2013). " +
          "Historically, networks like AlexNet flattened the final $7 \\times 7 \\times 512$ feature map into a 1D vector " +
          "and connected it to massive dense layers, consuming over 80% of the entire model's parameters. " +
          "GAP averages each feature map across all spatial coordinates into a single scalar, connecting directly " +
          "to the output Softmax, eliminating millions of parameters and radically suppressing overfitting."
      },

      miss: [
        {
          w: "Max Pooling has learnable weight parameters just like a convolutional layer.",
          r: "Standard pooling has ZERO learnable weights. It is a fixed, deterministic mathematical operation (max or average) that requires zero parameter memory."
        },
        {
          w: "Backpropagation cannot pass gradients through a Max Pooling layer because it is non-differentiable.",
          r: "During the forward pass, Max Pooling records the exact coordinate (argmax index) of the winning maximum element. During backpropagation, the full gradient is routed strictly to that winning coordinate, with zeros sent elsewhere."
        },
        {
          w: "Max Pooling is always preferred over Average Pooling everywhere in a network.",
          r: "Max Pooling is preferred in intermediate feature extraction layers to capture prominent edges, but Global Average Pooling (GAP) is universally preferred at the final output layer to synthesize global channel representations."
        },
        {
          w: "Modern networks still use Max Pooling after every single convolutional layer.",
          r: "Modern networks (ResNet, ConvNeXt) rarely use intermediate pooling, opting instead for strided convolutions ($S=2$) to perform learned, differentiable downsampling."
        }
      ],

      trade: {
        buys: [
          "Enforces local translation invariance: robust to minor pixel shifts, rotations, and distortions.",
          "Global Average Pooling eliminates parameter-heavy dense layers, slashing model size by up to 80%.",
          "Zero learnable parameters: reduces spatial dimensions without adding parameter bloat."
        ],
        costs: [
          "Irreversibly discards fine-grained spatial location coordinates (sub-pixel precision is lost).",
          "Can discard subtle low-contrast visual features if dominated by a single sharp noise spike.",
          "Outperformed in modern architectures by strided convolutions that learn adaptive downsampling."
        ],
        avoid: [
          "Using Max Pooling in segmentation or depth estimation tasks where precise pixel coordinates are required.",
          "Flattening high-dimensional feature maps into massive fully connected layers instead of using Global Average Pooling."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "feature-map",

      why: {
        before: "Dense neural networks flattened internal states into abstract 1D activation vectors, " +
          "destroying spatial geometry and making it impossible to visualize what visual features the model had detected.",
        problem: "Computer vision requires tracking spatial coordinates and channel-specific visual detectors " +
          "simultaneously across hierarchical levels of abstraction.",
        shift: "**Feature Map (Activation Tensor): Multi-channel spatial representation grid.** " +
          "Represent internal layer outputs as 3D tensors $C \\times H \\times W$, where each channel slice " +
          "acts as a 2D spatial heatmap indicating where a specific visual filter detected its corresponding feature."
      },

      num: {
        t: "Feature map hierarchical progression across network depth",
        h: ["Network Stage", "Tensor Geometry ($C \\times H \\times W$)", "Receptive Field Size", "Learned Semantic Representation"],
        r: [
          ["**Input Layer**", "$3 \\times 224 \\times 224$", "$1 \\times 1$ pixel", "Raw uncalibrated RGB pixel intensities"],
          ["**Early Layers (Conv 1-2)**", "$64 \\times 112 \\times 112$", "Small ($3 - 7$ pixels)", "**Low-level primitives**: Gabor-like oriented edges, colors, gradients"],
          ["**Middle Layers (Conv 3-4)**", "$256 \\times 28 \\times 28$", "Medium ($20 - 50$ pixels)", "**Mid-level motifs**: corners, textures, honeycombs, circular curves"],
          ["**Late Layers (Conv 5)**", "$512 \\times 7 \\times 7$", "Large ($150 - 224$ pixels)", "**High-level semantic parts**: dog snouts, car wheels, human eyes"],
          ["**Global Avg Pool (GAP)**", "$512 \\times 1 \\times 1$", "Entire image ($224 \\times 224$)", "Semantic class embedding vector ready for classification"]
        ],
        n: "A Feature Map (also called an **activation map**) is the 3D output tensor " +
          "$A \\in \\mathbb{R}^{C \\times H \\times W}$ generated when a bank of $C$ convolutional " +
          "filters slides across an input. Each individual channel $A_c \\in \\mathbb{R}^{H \\times W}$ " +
          "is a 2D spatial grid corresponding to a single specific filter. If filter $c$ was trained " +
          "to detect diagonal lines at 45 degrees, the 2D slice $A_c$ will exhibit bright, high-value " +
          "activations wherever 45-degree lines exist in the input image, while remaining dark and zeroed " +
          "elsewhere. Across the depth of a deep ConvNet, feature maps follow an inverse scaling law: " +
          "**spatial dimensions shrink ($H, W \\downarrow$) while semantic channel capacity expands ($C \\uparrow$)**. " +
          "Early feature maps preserve high spatial resolution ($112 \\times 112$) but possess few channels (64), " +
          "capturing *where* simple edges are located. Deep feature maps have tiny spatial resolution ($7 \\times 7$) " +
          "but massive channel depth (2,048), capturing *what* complex semantic objects are present " +
          "with broad, translation-invariant receptive fields."
      },

      miss: [
        {
          w: "All channels in a feature map look like human-interpretable photographs.",
          r: "Only the first 1-2 layers resemble edges and color maps. Deeper feature maps look like abstract, noisy heatmaps of activations that are interpretable only to the downstream neural layers."
        },
        {
          w: "A feature map's spatial dimensions must match the input image dimensions.",
          r: "Through striding and pooling, feature maps shrink rapidly: an input image of 224x224 typically produces a 7x7 feature map at the final convolutional block."
        },
        {
          w: "Feature maps exist only in convolutional neural networks.",
          r: "Feature maps exist in any spatial neural network, including Vision Transformers (where patch tokens are reshaped back into 2D grids) and U-Net generative diffusion models."
        },
        {
          w: "Feature maps consume very little GPU memory compared to weights.",
          r: "During training, caching all intermediate feature maps (activations) across a batch consumes over 70% of total GPU VRAM—vastly exceeding the memory used to store model weights."
        }
      ],

      trade: {
        buys: [
          "Preserves 2D spatial relationships: maintains topological coordinate coherence through deep representation layers.",
          "Exceptional interpretability: feature maps can be directly visualized via Grad-CAM to audit model attention and bias.",
          "Enables multi-scale tasks: skip connections can extract feature maps from multiple stages for object detection (FPN) and segmentation (U-Net)."
        ],
        costs: [
          "Massive GPU VRAM consumption: caching multi-channel feature maps across large batch sizes causes out-of-memory (OOM) errors.",
          "Memory bandwidth bottlenecks: streaming high-resolution feature maps to and from GPU SRAM strains memory buses.",
          "Dimension mismatches require explicit $1 \\times 1$ projection convolutions when merging feature maps from different stages."
        ],
        avoid: [
          "Caching full-resolution feature maps across all layers during inference without `torch.no_grad()`.",
          "Ignoring feature map resolution when designing real-time low-latency edge vision backbones."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "residual-connection",

      why: {
        before: "Stacking more layers in a deep neural network caused accuracy to saturate and then rapidly degrade " +
          "('the Degradation Problem'), with a 56-layer network exhibiting worse training error than a 20-layer network.",
        problem: "In theory, deeper networks should have representational capacity at least equal to shallow networks " +
          "(by having extra layers learn the identity mapping $f(x) = x$), but gradient descent struggled to optimize identity mappings.",
        shift: "**Residual Connection (Skip / Shortcut Connection, He et al. 2015): Reformulate learning to residual residuals.** " +
          "Add an identity bypass around parameterized layers: $\\mathcal{H}(x) = \\mathcal{F}(x) + x$, " +
          "creating an unobstructed gradient highway that enables backpropagation through hundreds of layers without attenuation."
      },

      num: {
        t: "Residual connection mathematical formulations & gradient flow",
        h: ["Property / Formulation", "Standard Plain Feedforward Network", "Residual Network (ResNet)"],
        r: [
          ["**Target Mapping**", "Must learn full underlying mapping $\\mathcal{H}(x)$", "Learns residual perturbation: **$\\mathcal{F}(x) = \\mathcal{H}(x) - x$**"],
          ["**Layer Output**", "$y = \\mathcal{F}(x)$", "**$y = \\mathcal{F}(x) + x$** (identity addition)"],
          ["**Identity Initialization**", "Requires finding $W$ such that $W x = x$ (difficult)", "**Trivial**: initialize $W=0 \\implies \\mathcal{F}(x)=0 \\implies y=x$"],
          ["**Backprop Gradient Formula**", "$\\frac{\\partial \\mathcal{L}}{\\partial x} = \\frac{\\partial \\mathcal{L}}{\\partial y} \\cdot \\frac{\\partial \\mathcal{F}}{\\partial x}$", "**$\\frac{\\partial \\mathcal{L}}{\\partial x} = \\frac{\\partial \\mathcal{L}}{\\partial y} \\left( \\frac{\\partial \\mathcal{F}}{\\partial x} + I \\right)$**"],
          ["**Gradient Vanishing Resistance**", "Gradients vanish exponentially: $\\prod J_k \\to 0$", "**Gradient Highway**: the $+I$ term prevents gradient from ever decaying to zero"]
        ],
        n: "The Residual Connection is arguably the single most important architectural " +
          "discovery in modern deep learning history (Kaiming He, Xiangyu Zhang, Shaoqing Ren, " +
          "Jian Sun, 2015). Prior to ResNet, researchers encountered the **Degradation Problem**: " +
          "as network depth increased, training error *increased*, proving that deep plain networks " +
          "were fundamentally failing to optimize. He et al. realized that if an added layer could " +
          "simply learn an **identity mapping** ($f(x) = x$), a deeper model could never perform worse " +
          "than its shallower counterpart. However, forcing layers of weights and non-linearities " +
          "to approximate an identity function is notoriously hard for gradient descent. " +
          "The solution was breathtakingly simple: **reparameterize the network to learn the residual " +
          "difference** $\\mathcal{F}(x) = \\mathcal{H}(x) - x$, casting the output as $\\mathcal{H}(x) = \\mathcal{F}(x) + x$. " +
          "If identity is optimal, the optimizer simply drives the weights toward zero ($\\mathcal{F}(x) \\to 0$), " +
          "which is trivial for weight decay. The mathematical magic appears during backpropagation: " +
          "$\\frac{\\partial \\mathcal{L}}{\\partial x} = \\frac{\\partial \\mathcal{L}}{\\partial y} \\left( \\frac{\\partial \\mathcal{F}}{\\partial x} + I \\right) " +
          "= \\frac{\\partial \\mathcal{L}}{\\partial y} \\frac{\\partial \\mathcal{F}}{\\partial x} + \\frac{\\partial \\mathcal{L}}{\\partial y}$. " +
          "Even if the parameterized gradient $\\frac{\\partial \\mathcal{F}}{\\partial x}$ approaches zero, " +
          "the **identity term $+I$ ensures the error gradient flows directly and unimpeded to early layers**, " +
          "shattering depth barriers from 20 layers to over 1,000 layers. Today, residual connections " +
          "are mandatory in every foundation model, from ResNet to **Transformers (Self-Attention and FFN sub-layers)**."
      },

      miss: [
        {
          w: "Residual connections add millions of extra learnable parameters to the model.",
          r: "A standard identity shortcut adds ZERO parameters: it is simply an element-wise addition of two existing tensors ($F(x) + x$). Only when channel dimensions change is a lightweight $1 \\times 1$ projection convolution required."
        },
        {
          w: "The degradation problem solved by ResNet was caused by vanishing gradients.",
          r: "He et al. verified that networks were normalized with BatchNorm and had non-zero gradients; the degradation problem was an optimization failure—deep plain networks simply couldn't find identity mappings on complex loss surfaces."
        },
        {
          w: "Residual connections are only useful in convolutional vision networks.",
          r: "Residual connections are the fundamental backbone of Transformers: every Multi-Head Attention and Feedforward block in GPT, BERT, and Llama is wrapped in a residual skip connection."
        },
        {
          w: "In ResNet, the activation function is applied before the shortcut addition.",
          r: "In classical ResNet, the shortcut addition occurs first ($F(x) + x$), followed immediately by the ReLU activation: $y = \\text{ReLU}(F(x) + x)$."
        }
      ],

      trade: {
        buys: [
          "Completely cures the degradation problem: enables stable optimization of networks with 1,000+ layers.",
          "Creates unobstructed gradient highways where backpropagation signals bypass saturated layers via the $+I$ term.",
          "Universal building block across all modern deep learning architectures (ResNets, Transformers, Diffusion U-Nets)."
        ],
        costs: [
          "Requires tensors along the skip path and residual path to share identical spatial and channel dimensions.",
          "Slightly increases activation memory overhead during training because input tensor $x$ must be retained until addition.",
          "Dense multi-branch residual topologies can introduce memory bandwidth overhead on edge accelerators."
        ],
        avoid: [
          "Building deep neural networks (>15 layers) without residual skip connections.",
          "Placing non-linear operations directly inside the shortcut path, which obstructs the clean $+I$ gradient highway."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "resnet",

      why: {
        before: "Deep vision models were bottlenecked at roughly 16 to 22 layers (VGGNet, GoogLeNet); " +
          "pushing deeper led to severe performance degradation on both training and test sets.",
        problem: "ImageNet classification demanded vastly deeper representations to capture subtle semantic nuances, " +
          "but training networks with 50-100+ layers was numerically and empirically impossible.",
        shift: "**ResNet (Residual Networks, He et al. 2015): Deep residual learning architecture.** " +
          "Structure deep networks into modular Residual Blocks using BasicBlock and Bottleneck designs, " +
          "enabling successful training of 152-layer networks that swept the ImageNet, COCO, and VOC 2015 competitions."
      },

      num: {
        t: "ResNet architectural variants & parameter scaling on ImageNet",
        h: ["ResNet Variant", "Block Type", "Layer Depth", "Top-1 Accuracy (ImageNet)", "Total Parameters"],
        r: [
          ["**ResNet-18**", "BasicBlock ($3 \\times 3 \\to 3 \\times 3$)", "18 layers", "$69.8\\%$", "$11.7$ Million"],
          ["**ResNet-34**", "BasicBlock ($3 \\times 3 \\to 3 \\times 3$)", "34 layers", "$73.3\\%$", "$21.8$ Million"],
          ["**ResNet-50**", "**Bottleneck** ($1 \\times 1 \\to 3 \\times 3 \\to 1 \\times 1$)", "50 layers", "$76.1\\%$", "$25.6$ Million"],
          ["**ResNet-101**", "**Bottleneck**", "101 layers", "$77.4\\%$", "$44.5$ Million"],
          ["**ResNet-152**", "**Bottleneck**", "152 layers", "**$78.3\\%$** (2015 winner)", "$60.2$ Million"]
        ],
        n: "ResNet (Residual Networks) is the watershed architecture of modern deep " +
          "learning. Winner of the 2015 ImageNet competition with an unprecedented " +
          "**3.57% top-5 error rate** (surpassing human-level performance for the first time), " +
          "ResNet proved that network depth is the primary driver of representation quality. " +
          "The architecture is organized into four hierarchical stages with two block variants: " +
          "(1) **BasicBlock** (used in ResNet-18 and ResNet-34): contains two stacked $3 \\times 3$ " +
          "convolutions wrapped by an identity skip connection: $y = \\text{ReLU}(\\text{Conv}_2(\\text{ReLU}(\\text{Conv}_1(x))) + x)$; " +
          "and (2) **Bottleneck Block** (used in ResNet-50, 101, 152): designed for computational efficiency " +
          "at extreme depth. A Bottleneck block uses three convolutions: a $1 \\times 1$ convolution " +
          "that reduces channel dimensions by $4\\times$ (e.g. 256 down to 64), a standard $3 \\times 3$ " +
          "convolution operating in the cheap low-dimensional space, and a final $1 \\times 1$ convolution " +
          "that restores the original high-dimensional channel depth (back to 256). This bottleneck design " +
          "allows ResNet-50 to achieve far higher accuracy than ResNet-34 while requiring virtually the " +
          "exact same computational FLOP budget."
      },

      miss: [
        {
          w: "ResNet-50 has more parameters and higher FLOPs than VGG-16.",
          r: "VGG-16 has 138 million parameters due to massive fully connected layers. ResNet-50 has only 25.6 million parameters (80% fewer!) and requires significantly fewer FLOPs because of Global Average Pooling."
        },
        {
          w: "ResNet requires identical channel numbers across all blocks throughout the network.",
          r: "ResNet doubles the channel count at the start of each of its four stages. When channel counts change, the shortcut connection uses a $1 \\times 1$ convolution with stride 2 to match dimensions."
        },
        {
          w: "ResNet blocks must always place ReLU after the residual addition.",
          r: "He et al. later introduced ResNet-v2 (Identity Mappings in Deep Residual Networks), which uses Pre-Activation: BatchNorm and ReLU are applied BEFORE the convolutions, keeping the skip connection completely clean."
        },
        {
          w: "ResNet cannot be used as a backbone for object detection.",
          r: "ResNet is the industry-standard backbone for Faster R-CNN, Mask R-CNN, and RetinaNet, serving as the multi-scale feature extractor across Feature Pyramid Networks (FPN)."
        }
      ],

      trade: {
        buys: [
          "Unlocks ultra-deep architectures: effortlessly trains 50 to 152+ layers with guaranteed convergence.",
          "Bottleneck design allows high capacity with minimal floating-point computational overhead.",
          "Industry standard backbone: universal feature extractor across classification, detection, and segmentation."
        ],
        costs: [
          "Memory overhead: caching intermediate skip activations across 152 layers increases VRAM pressure during training.",
          "Sequential block execution: cannot parallelize forward propagation across consecutive residual blocks.",
          "Outperformed in pure computational throughput by modern ConvNeXt and MobileNet architectures on edge hardware."
        ],
        avoid: [
          "Using plain non-residual CNNs for vision tasks requiring more than 20 layers.",
          "Using ResNet-18 or 34 when compute budgets easily accommodate the vastly superior Bottleneck-based ResNet-50."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "recurrent-neural-network",

      why: {
        before: "Feedforward neural networks (MLPs, CNNs) assumed all input vectors were independent and identically distributed (IID) " +
          "with fixed, rigid input dimensions, unable to process sequential data of variable length.",
        problem: "Natural language, speech, financial time series, and sensor telemetry exhibit strong temporal dependencies " +
          "where the interpretation of the current token depends crucially on words that appeared dozens of steps earlier.",
        shift: "**Recurrent Neural Network (RNN, Elman 1990): Cyclic hidden state memory.** " +
          "Introduce a cyclical recurrent connection in the hidden layer: $h_t = \\tanh(W_{hh} h_{t-1} + W_{xh} x_t + b)$, " +
          "enabling the network to maintain an internal memory state that persists information across arbitrary sequence lengths."
      },

      num: {
        t: "Recurrent neural network mathematical formulation & BPTT complexity",
        h: ["Component / Operation", "Mathematical Formula", "Tensor Dimensions", "Operational Meaning"],
        r: [
          ["**Hidden State Update**", "$h_t = \\tanh(W_{hh} h_{t-1} + W_{xh} x_t + b_h)$", "$h_t \\in \\mathbb{R}^{d_h}$", "Fuses incoming input $x_t$ with historical context vector $h_{t-1}$"],
          ["**Output Projection**", "$y_t = \\text{softmax}(W_{hy} h_t + b_y)$", "$y_t \\in \\mathbb{R}^{d_y}$", "Emits task prediction at current time step $t$"],
          ["**Time Complexity (BPTT)**", "$\\mathcal{O}(T \\cdot d_h^2)$ across sequence length $T$", "Inherently sequential", "**Zero time-step parallelization**: step $t$ depends strictly on $t-1$"],
          ["**Parameter Sharing**", "Same $W_{hh}, W_{xh}, W_{hy}$ reused at every time step", "Fixed parameter count", "Handles arbitrary, variable-length sequential inputs"],
          ["**Gradient Decay Horizon**", "$\\frac{\\partial h_t}{\\partial h_k} = \\prod_{j=k+1}^t W_{hh}^T \\text{diag}(1 - h_j^2)$", "Exponential decay/explosion", "Vanishing gradients limit effective memory to **$10 - 20$ time steps**"]
        ],
        n: "A Recurrent Neural Network (RNN) processes sequences by unrolling " +
          "a cyclic computation graph across time. At time step $t$, the hidden state vector " +
          "$h_t$ is computed as an affine transformation of both the current input vector $x_t$ " +
          "and the *previous* hidden state $h_{t-1}$: $h_t = \\tanh(W_{xh} x_t + W_{hh} h_{t-1} + b)$. " +
          "Crucially, the weight matrices $W_{xh}$ and $W_{hh}$ are **shared across all time steps**, " +
          "allowing the network to process sequences of arbitrary length with a fixed parameter count. " +
          "Training is conducted via **Backpropagation Through Time (BPTT)**: the network is unrolled " +
          "across $T$ steps, loss is accumulated $\\mathcal{L} = \\sum_{t=1}^T \\mathcal{L}_t$, and error " +
          "gradients are propagated backward through the temporal sequence. " +
          "However, standard (vanilla) RNNs suffer catastrophically from the **Vanishing and Exploding " +
          "Gradient Problem**: computing the gradient of $h_t$ with respect to an early state $h_k$ " +
          "requires chaining $t-k$ matrix multiplications of the transition matrix $W_{hh}$. " +
          "Because $\\tanh'$ is bounded by $1.0$, the gradient decays exponentially to zero if the spectral " +
          "norm of $W_{hh} < 1$, preventing standard RNNs from learning dependencies longer than " +
          "roughly **10 to 20 time steps**—a limitation that motivated the creation of LSTMs and Transformers."
      },

      miss: [
        {
          w: "An RNN creates a new set of weights for every new word or time step in a sentence.",
          r: "The exact same weight matrices (W_xh, W_hh, W_hy) are reused at every single time step. An RNN has a fixed parameter count regardless of whether the sequence is 5 tokens or 5,000 tokens long."
        },
        {
          w: "Vanilla RNNs can remember context across an entire 500-word essay.",
          r: "Due to exponential gradient decay during BPTT, standard vanilla RNNs suffer from catastrophic amnesia, losing effective context after only 10-15 time steps."
        },
        {
          w: "RNNs can be parallelized during training across sequence length just like CNNs and Transformers.",
          r: "Because $h_t$ strictly requires the completion of $h_{t-1}$, training execution has an inescapable sequential dependency $\\mathcal{O}(T)$ that cannot be parallelized across time steps on GPUs."
        },
        {
          w: "Bidirectional RNNs can be used for real-time streaming speech recognition.",
          r: "Bidirectional RNNs require reading the ENTIRE sequence backward from the future ($t=T$ down to $t=1$). They cannot be used in real-time streaming applications where future audio has not occurred yet."
        }
      ],

      trade: {
        buys: [
          "Natively models sequential time series, text, and audio with arbitrary, variable input lengths.",
          "Compact parameter efficiency: reuses the same recurrent transformation matrices across all time steps.",
          "Online streaming capability: can emit predictions continuously as each new token arrives."
        ],
        costs: [
          "Sequential training bottleneck: cannot parallelize forward or backward passes across time on GPUs.",
          "Severe vanishing/exploding gradients prevent standard vanilla RNNs from capturing long-range dependencies.",
          "High inference latency compared to non-recurrent feedforward projections."
        ],
        avoid: [
          "Using standard vanilla RNNs for sequences longer than 20 time steps (use LSTMs, GRUs, or Transformers).",
          "Training deep RNNs without norm-based gradient clipping."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "lstm",

      why: {
        before: "Standard Recurrent Neural Networks (RNNs) suffered from exponential vanishing gradients, " +
          "completely forgetting context and dependencies after only 10-15 time steps.",
        problem: "In language, translation, and time series, critical dependencies span hundreds of steps " +
          "(e.g. matching a subject at the start of a paragraph with a verb at the end); models required an unattenuated memory store.",
        shift: "**Long Short-Term Memory (LSTM, Hochreiter & Schmidhuber 1997): Constant Error Carousel with gating.** " +
          "Introduce an additive Cell State ($c_t$) regulated by three multiplicative gates (Forget, Input, Output), " +
          "creating an uninterrupted linear gradient highway that preserves long-term memories across hundreds of time steps."
      },

      num: {
        t: "LSTM gating equations & functional roles",
        h: ["Gate / Component", "Mathematical Formulation", "Activation Function", "Functional Role"],
        r: [
          ["**Forget Gate ($f_t$)**", "$f_t = \\sigma(W_f [h_{t-1}, x_t] + b_f)$", "Sigmoid (0 to 1)", "Decides what fraction of old memory to erase ($0 = \\text{wipe}, 1 = \\text{keep}$)"],
          ["**Input Gate ($i_t$)**", "$i_t = \\sigma(W_i [h_{t-1}, x_t] + b_i)$", "Sigmoid (0 to 1)", "Decides which new candidate values will be written to memory"],
          ["**Candidate State ($\\tilde{c}_t$)**", "$\\tilde{c}_t = \\tanh(W_c [h_{t-1}, x_t] + b_c)$", "Tanh (-1 to +1)", "Generates new candidate information to add to cell state"],
          ["**Cell State Update ($c_t$)**", "$c_t = f_t \\odot c_{t-1} + i_t \\odot \\tilde{c}_t$", "**Linear Additive Highway**", "**Constant Error Carousel**: preserves gradients across time without decay"],
          ["**Output Gate ($o_t$)**", "$o_t = \\sigma(W_o [h_{t-1}, x_t] + b_o)$", "Sigmoid (0 to 1)", "Decides which parts of cell state $c_t$ to emit to hidden state $h_t$"],
          ["**Hidden State ($h_t$)**", "$h_t = o_t \\odot \\tanh(c_t)$", "Tanh squashed", "Emitted output and recurrent input for next time step $t+1$"]
        ],
        n: "Long Short-Term Memory (LSTM) was conceived by Sepp Hochreiter and " +
          "Jürgen Schmidhuber in 1997 to solve the vanishing gradient problem in RNNs. " +
          "The core innovation of the LSTM is the **Cell State ($c_t$)**, which acts as a " +
          "conveyor belt running straight down the entire temporal chain with only minor linear " +
          "interactions. Information is added or removed from the cell state via three specialized " +
          "**multiplicative gates**: (1) the **Forget Gate ($f_t$)** uses a Sigmoid activation to " +
          "determine what percentage of the previous cell state $c_{t-1}$ to retain (e.g., forgetting " +
          "an old singular subject when a new plural subject appears); (2) the **Input Gate ($i_t$)** " +
          "and candidate vector $\\tilde{c}_t$ identify what new information to write into the cell; " +
          "and (3) the **Output Gate ($o_t$)** filters the squashed cell state $\\tanh(c_t)$ to produce " +
          "the visible hidden state $h_t$. Crucially, the cell state update equation is **strictly additive**: " +
          "$c_t = f_t \\odot c_{t-1} + i_t \\odot \\tilde{c}_t$. " +
          "During backpropagation, the derivative $\\frac{\\partial c_t}{\\partial c_{t-1}} = f_t$. " +
          "If the forget gate is saturated at $1.0$, the error gradient flows backward across time steps " +
          "**without any multiplicative decay or exponential vanishing**—the celebrated **Constant Error Carousel (CEC)**. " +
          "This unlocked industrial NLP breakthroughs from Google Translate (GNMT) to Siri speech recognition."
      },

      miss: [
        {
          w: "LSTMs completely eliminate the sequential processing bottleneck of RNNs.",
          r: "LSTMs solve vanishing gradients, but they are still inherently recurrent: step t strictly depends on hidden state $h_{t-1}$ and cell state $c_{t-1}$, preserving the slow $\\mathcal{O}(T)$ sequential training bottleneck."
        },
        {
          w: "Initializing LSTM forget gate biases to zero is standard practice.",
          r: "Initializing forget gate bias $b_f = 0$ makes $\\sigma(0) = 0.5$, which halves the memory signal at every step! Gers et al. proved that initializing $b_f$ to a large positive value ($1.0$ or $2.0$) keeps gates open and dramatically improves training."
        },
        {
          w: "An LSTM has the same number of parameters as a standard RNN.",
          r: "An LSTM contains 4 separate internal linear transformations (Forget, Input, Candidate, Output), requiring roughly 4x more parameters than a vanilla RNN of the same hidden dimension."
        },
        {
          w: "LSTMs can handle infinite context windows like 100,000 tokens.",
          r: "While vastly superior to vanilla RNNs, LSTMs struggle when sequence lengths exceed 500 to 1,000 steps due to information compression bottlenecks into a fixed-size vector $c_t$."
        }
      ],

      trade: {
        buys: [
          "Cures vanishing gradients in sequence modeling via the additive Constant Error Carousel.",
          "Captures long-range temporal dependencies spanning hundreds of time steps.",
          "Dynamic memory management: selectively forgets, writes, and reads information via differentiable gates."
        ],
        costs: [
          "Inescapable sequential execution bottleneck: cannot parallelize training across sequence lengths on modern GPUs.",
          "4x higher parameter count and compute cost compared to simple vanilla RNNs.",
          "Fixed-size hidden state creates an information compression bottleneck on very long documents (exceeded by Transformers)."
        ],
        avoid: [
          "Initializing LSTM forget gate biases to zero (always initialize $b_f = 1.0$ or use PyTorch defaults).",
          "Using LSTMs for document-level NLP when Transformers with full self-attention are computationally viable."
        ]
      }
    }

  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
