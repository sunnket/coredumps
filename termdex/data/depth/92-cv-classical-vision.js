/* ==========================================================================
   Depth pass 92 — Computer Vision batch 3: Classical vision, benchmarks & multimodality.
   Colour Space, Histogram Equalisation, Edge Detection,
   Image Captioning, ImageNet, OpenCV.

   Non-linear chromaticity manifolds decouple luminance from colorimetry;
   orthogonal spatial image gradients isolate photometric reflectance discontinuities.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "colour-space",

      why: {
        before: "Early computer graphics and imaging stored digital pictures exclusively as additive RGB (Red, Green, Blue) phosphor values, conflating physical lighting intensity with chromatic hue.",
        problem: "In standard RGB, a shadow falling across an object drastically changes all three R, G, and B channel values simultaneously, making robust color segmentation, skin detection, and tracking impossible under varying illumination.",
        shift: "**Colour Space: A mathematical model describing the way colors can be represented as tuples of numbers, allowing decoupling of brightness (luminance) from chromatic information (chrominance).** Major color models include RGB (additive hardware), HSV/HSL (perceptual human intuition), YUV/YCbCr (video compression), and CIELAB (perceptually uniform metric space)."
      },

      num: {
        t: "Standard Colour Spaces: Channel Decompositions, Coordinate Systems & Primary Use Cases",
        h: ["Colour Space", "Channels", "Luminance Decoupled?", "Perceptually Uniform?", "Primary Application Domain"],
        r: [
          ["RGB / sRGB", "$R, G, B \\in [0, 255]$", "No (coupled across all 3)", "No", "Hardware monitors, digital cameras, raw sensor arrays"],
          ["HSV / HSB", "Hue ($[0, 360^\\circ]$), Saturation, Value", "Yes ($V$ is brightness)", "No (hue singularity at black/white)", "Color-based object tracking, thresholding, UI pickers"],
          ["YCbCr / YUV", "Luma ($Y$), Blue difference ($Cb$), Red ($Cr$)", "Yes ($Y$ is pure luma)", "No", "MPEG/JPEG video compression, broadcast television"],
          ["CIE $L^*a^*b^*$", "Lightness ($L^*$), Green-Red ($a^*$), Blue-Yellow ($b^*$)", "Yes ($L^*$ scaled 0–100)", "Yes ($\\Delta E$ matches human vision)", "Industrial color matching, printing, paint formulation"],
          ["CMYK", "Cyan, Magenta, Yellow, Key (Black)", "No (subtractive)", "No", "Physical four-color offset and digital printing"]
        ],
        n: "A color space maps electromagnetic wavelengths to a finite-dimensional coordinate system. In RGB, Euclidean distance does not reflect perceptual color difference (the human eye is far more sensitive to green wavelengths than blue due to cone cell distribution). In **CIE $L^*a^*b^*$**, the Euclidean distance $\\Delta E^* = \\sqrt{(\\Delta L^*)^2 + (\\Delta a^*)^2 + (\\Delta b^*)^2}$ is **perceptually uniform**: a distance of $1.0$ corresponds precisely to a Just Noticeable Difference (JND) to human observers. In video compression and digital image processing, **YCbCr** enables **chroma subsampling** (e.g., 4:2:0): because human vision has high spatial acuity for brightness ($Y$) but low acuity for color ($Cb, Cr$), color resolution can be downsampled by $75\\%$ with virtually zero perceived loss of fidelity, reducing bandwidth dramatically."
      },

      miss: [
        {
          w: "RGB is an intuitive and optimal color space for writing computer vision color-filtering algorithms.",
          r: "Writing color thresholding rules in RGB is notoriously brittle because changes in ambient lighting simultaneously alter R, G, and B. Converting to HSV or LAB allows filtering on Hue or $a^*/b^*$ channels independent of lighting brightness variations."
        },
        {
          w: "Hue values in HSV can be filtered with a simple linear range check (`low < H < high`).",
          r: "Hue is a circular angular coordinate ($0^\\circ$ to $360^\\circ$). Red wraps around $0^\\circ$ (spanning $350^\\circ - 360^\\circ$ and $0^\\circ - 10^\\circ$), requiring two separate threshold masks combined with a logical OR."
        },
        {
          w: "All RGB color spaces (sRGB, Adobe RGB, DCI-P3) represent the exact same gamut of physical colors.",
          r: "Different RGB color spaces cover radically different **gamuts** (ranges of visible chromaticity). DCI-P3 covers a 25% larger color gamut than standard sRGB. Processing a wide-gamut image with sRGB assumptions causes washed-out, inaccurate colors."
        },
        {
          w: "Converting between color spaces is a lossless, reversible mathematical operation.",
          r: "Quantization during integer color space conversions (e.g., converting 8-bit RGB to 8-bit HSV and back) incurs roundoff errors and gamut clipping, resulting in banding artifacts and loss of high-frequency chromatic gradients."
        }
      ],

      trade: {
        buys: [
          "Decouples lighting illumination from color identity, enabling robust object tracking and skin detection.",
          "Chroma subsampling in YCbCr reduces uncompressed video bandwidth by 50% without visible human quality loss.",
          "CIE LAB provides mathematically rigorous, perceptually uniform metrics for industrial quality control.",
          "HSV simplifies algorithmic color segmentation to simple 1D angular range checks."
        ],
        costs: [
          "Non-linear trigonometric conversions (RGB to HSV/LAB) introduce mathematical singularities at $S=0$ or $V=0$.",
          "Processing color conversions across high-resolution 4K video feeds incurs CPU/GPU computational latency.",
          "Integer quantization errors cause irreversible banding and precision loss across multiple conversions.",
          "Different libraries adopt conflicting channel scales (e.g., OpenCV maps Hue to $[0, 180]$ to fit in a uint8 byte)."
        ],
        avoid: [
          "Never write color-tracking or segmentation algorithms in raw RGB; convert to HSV or LAB first.",
          "Do not forget OpenCV's non-standard Hue range ($0-180$ instead of $0-360$) when porting mathematical algorithms.",
          "Avoid using standard Euclidean distance in RGB space to determine if two colors look similar to humans; use $\\Delta E$ in LAB."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "histogram-equalisation",

      why: {
        before: "Images captured under poor lighting conditions (underexposed medical X-rays, overexposed outdoor surveillance) suffered from low visual contrast, with pixel values concentrated in a narrow band of the brightness range.",
        problem: "Low-contrast images obscure critical structural details, boundaries, and textures, causing downstream edge detectors, feature matchers, and human clinicians to miss essential visual cues.",
        shift: "**Histogram Equalisation (HE): A non-linear point-processing transformation that flattens and stretches an image's pixel intensity histogram across the full dynamic range using the Cumulative Distribution Function (CDF).** Advanced from global HE to local adaptive methods, principally Contrast Limited Adaptive Histogram Equalization (CLAHE)."
      },

      num: {
        t: "Histogram Equalisation Techniques: Contrast Enhancement, Noise & Artifact Profiles",
        h: ["Method", "Locality Scope", "Contrast Enhancement Factor", "Background Noise Amplification", "Boundary Artifacts"],
        r: [
          ["Global Histogram Equalisation (GHE)", "Global entire image", "Unconstrained global stretching", "Severe in homogenous regions", "None (continuous global map)"],
          ["Adaptive Histogram Equalisation (AHE)", "Local contextual tiles", "High local dynamic expansion", "Catastrophic noise amplification", "Severe block boundary seams"],
          ["CLAHE (Zuiderveld 1994)", "Local tiles + Clip limit", "Controlled via clip limit (e.g., 2.0–4.0)", "Suppressed via histogram clipping", "Eliminated via bilinear interpolation"],
          ["Gamma Correction", "Global power-law ($I_{\\text{out}} = I^{\\gamma}$)", "Non-linear global shift", "Low", "None (smooth parametric curve)"]
        ],
        n: "Given a grayscale image $I$ with $L$ discrete gray levels ($L=256$ for 8-bit), the probability of occurrence of intensity level $r_k$ is $p(r_k) = \\frac{n_k}{N}$. Global Histogram Equalization computes the transformation $s = T(r)$ using the normalized Cumulative Distribution Function (CDF): $s_k = T(r_k) = (L - 1) \\sum_{j=0}^k p(r_j) = \\frac{L-1}{N} \\sum_{j=0}^k n_j$. In continuous calculus, this transformation provably produces a uniform probability density function $p_s(s) = \\frac{1}{L-1}$, maximizing the information entropy of the image. However, in uniform regions (like a flat blue sky or dark background), global HE over-amplifies noise. **CLAHE** solves this by dividing the image into contextual grids (e.g., $8 \\times 8$ tiles), clipping the histogram at a user-defined threshold (redistributing the excess uniformly), and smoothing tile boundaries using bilinear interpolation."
      },

      miss: [
        {
          w: "Histogram equalisation creates new visual information and details in an image.",
          r: "Histogram equalization cannot synthesize missing information; it merely redistributes existing quantized intensity levels across a wider dynamic range, making subtle pre-existing contrast gradients visible to human eyes and detectors."
        },
        {
          w: "Histogram equalisation should be applied independently to the R, G, and B channels of a color image.",
          r: "Equalizing R, G, and B independently alters the relative chromatic ratios of pixels, causing bizarre and unnatural color shifts (e.g., turning gray skin tones purple). Color images must be converted to YCrCb, HSV, or LAB, equalizing ONLY the luminance/lightness channel ($Y$ or $L^*$)."
        },
        {
          w: "Global Histogram Equalisation is optimal for medical imaging enhancement.",
          r: "Global HE often over-saturates bright bone structures into blinding pure white while turning background air into noisy gray speckles. Medical imaging almost exclusively uses CLAHE with strict clip limits."
        },
        {
          w: "Histogram equalisation is an essential preprocessing step before feeding images to modern deep CNNs.",
          r: "Modern deep neural networks are trained with Batch Normalization and aggressive photometric data augmentations, learning contrast invariance automatically. Forcing HE can introduce high-frequency artifacts that degrade CNN accuracy."
        }
      ],

      trade: {
        buys: [
          "Instantly reveals hidden structures, micro-textures, and boundaries in low-contrast, murky, or washed-out images.",
          "Zero machine learning required: deterministic, mathematically proven algorithm running in milliseconds on CPU.",
          "CLAHE effectively enhances localized details in medical radiography (mammography, chest X-rays) and underwater photography.",
          "Maximizes image dynamic range and information entropy without requiring specialized sensor hardware."
        ],
        costs: [
          "Global HE amplifies background sensor noise, compression artifacts, and grain in homogenous regions.",
          "Can produce washed-out or unnatural, harsh visual appearances with reduced overall aesthetic quality.",
          "Local adaptive methods (AHE) without clipping cause severe noise blooming in flat regions.",
          "Tile-based CLAHE introduces processing latency compared to simple global look-up table (LUT) transformations."
        ],
        avoid: [
          "Never apply histogram equalization directly across RGB channels; convert to LAB or YUV and equalize only luminance.",
          "Do not use unconstrained AHE; always use Contrast Limited AHE (CLAHE) with a modest clip limit (e.g., 2.0 to 3.0).",
          "Avoid applying aggressive histogram equalization to clean images that already possess balanced dynamic contrast."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "edge-detection",

      why: {
        before: "Computer vision systems attempted to understand images by evaluating millions of raw pixel values directly, which was computationally overwhelmed by lighting noise and redundant uniform surfaces.",
        problem: "Biological visual systems rely on boundaries to segment physical objects from backgrounds; computers needed a way to strip away millions of redundant surface pixels and extract the compact structural geometry of a scene.",
        shift: "**Edge Detection: Mathematical algorithms that identify points in a digital image where luminous intensity changes sharply or has spatial discontinuities.** Advanced from first-order spatial gradient operators (Sobel, Prewitt, Roberts Cross) and second-order Laplacians to the optimal multi-stage Canny Edge Detector and deep neural edge extractors (HED, BDCN)."
      },

      num: {
        t: "Edge Detection Algorithms: Mathematical Formulation, Noise Sensitivity & Edge Quality",
        h: ["Algorithm", "Mathematical Operator", "Noise Filtering", "Edge Thickness", "Localization Accuracy"],
        r: [
          ["Sobel Operator (1968)", "$3 \\times 3$ directional gradient convolution", "Minimal (built-in smoothing)", "Thick (diffuse gradient bands)", "Moderate (blurred edges)"],
          ["Laplacian of Gaussian (LoG / Marr-Hildreth)", "Second derivative zero-crossings ($\\nabla^2 G * I$)", "Gaussian pre-filter ($\\sigma$)", "Single pixel thin", "Prone to spurious zero-crossings"],
          ["Canny Edge Detector (1986)", "Optimal criteria: Detection + Localization + Single Response", "Gaussian blur + Non-Maximal Suppression + Hysteresis", "Strictly single pixel thin", "High (mathematically proven optimal for step edges)"],
          ["Holistically-Nested (HED 2015)", "Deep fully convolutional multi-scale supervision", "Deep hierarchical learning", "Semantic boundary thick", "Exceptional semantic boundary quality"]
        ],
        n: "Edges correspond to local maxima of the image intensity gradient magnitude. The spatial gradient vector $\\nabla I = [G_x, G_y]^T = [\\frac{\\partial I}{\\partial x}, \\frac{\\partial I}{\\partial y}]^T$ is approximated using discrete convolution kernels. The gradient magnitude is $G = \\sqrt{G_x^2 + G_y^2}$ and direction is $\\theta = \\arctan \\frac{G_y}{G_x}$. John F. Canny formulated edge detection as an optimal mathematical optimization problem based on three criteria: low error rate, precise localization, and a single response to a single edge. The **Canny Edge Pipeline** comprises four sequential stages: (1) **Gaussian Smoothing** to attenuate high-frequency sensor noise. (2) **Gradient Calculation** via Sobel filters. (3) **Non-Maximum Suppression (NMS)** along the gradient vector $\\theta$ to thin wide gradient ridges into single-pixel edges. (4) **Hysteresis Thresholding** with high ($T_{\\text{high}}$) and low ($T_{\\text{low}}$) thresholds to preserve continuous genuine edges while discarding isolated noise specks."
      },

      miss: [
        {
          w: "Applying a Sobel filter directly outputs thin, final edge lines.",
          r: "The Sobel filter outputs a continuous gradient magnitude image with thick, blurry ridges (often 3 to 7 pixels wide). Producing clean, single-pixel thin edge boundaries requires directional Non-Maximum Suppression (NMS)."
        },
        {
          w: "Canny edge detection uses a single global threshold to decide what is an edge.",
          r: "Canny explicitly uses **double-threshold hysteresis**: pixels above $T_{\\text{high}}$ are strong edges; pixels below $T_{\\text{low}}$ are suppressed; pixels between the two are preserved ONLY if they are connected to a strong edge, ensuring contour continuity without noise specks."
        },
        {
          w: "Edge detection identifies semantic object boundaries (e.g., distinguishing a cat from a rug).",
          r: "Classical edge detectors respond to ANY sharp photometric gradient, including shadow boundaries, fabric textures, wood grains, and reflections. Semantic boundary detection requires deep learning models (HED) trained with semantic ground truth."
        },
        {
          w: "Gaussian blur should be avoided before edge detection because it blurs edges.",
          r: "Numerical differentiation amplifies high-frequency noise. Computing spatial derivatives on raw, un-smoothed images yields hundreds of false edges caused entirely by sensor photon noise; Gaussian smoothing is mathematically mandatory."
        }
      ],

      trade: {
        buys: [
          "Extreme data reduction: discards 95%+ of redundant pixel data while preserving structural scene geometry.",
          "Sub-millisecond execution: classical Canny and Sobel run instantaneously on low-power microcontrollers and CPUs.",
          "Invariance to illumination levels: captures shape contours regardless of global brightness shifts.",
          "Crucial prerequisite for geometric computer vision algorithms (Hough Transform line/circle detection, contour analysis)."
        ],
        costs: [
          "Lacks semantic awareness: detects clutter, surface textures, and cast shadows with equal intensity as physical object edges.",
          "Sensitive to threshold hyperparameter selection ($T_{\\text{high}}, T_{\\text{low}}$), requiring manual tuning per camera scene.",
          "Broken edge contours: noise or weak contrast causes discontinuities in extracted object boundaries.",
          "Classical operators struggle with complex occlusions and low-contrast boundaries where gradient magnitude approaches zero."
        ],
        avoid: [
          "Never run edge detection on noisy digital images without prior Gaussian or bilateral filtering.",
          "Do not use fixed hardcoded Canny thresholds for dynamic lighting environments; use Otsu's method to compute median-based thresholds.",
          "Avoid using classical edge detection for semantic instance segmentation in complex natural scenes; use deep learning."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "image-captioning",

      why: {
        before: "Computer vision produced isolated bounding boxes or category labels, while NLP processed text in isolation; computers could not synthesize coherent natural language descriptions explaining complete visual scenes.",
        problem: "Describing a scene requires not just recognizing individual objects, but understanding their spatial relationships, interactions, attributes, and actions, synthesizing them into a grammatically fluent sentence.",
        shift: "**Image Captioning: Automatically generating a descriptive, grammatically fluent natural language sentence depicting the contents of an image.** Evolved from Show and Tell (CNN encoder + LSTM decoder with Bahdanau visual attention) to modern multimodal Vision-Language Models (Flamingo, BLIP-2, LLaVA, GPT-4V)."
      },

      num: {
        t: "Image Captioning Paradigms: Architectures, Benchmarks & CIDEr-D Scores (MS COCO)",
        h: ["Architecture / Model", "Visual Feature Extractor", "Language Decoder", "MS COCO CIDEr-D", "Hallucination Rate"],
        r: [
          ["Show and Tell (Vinyals 2015)", "GoogLeNet CNN", "Vanilla LSTM decoder", "85.5", "High (repetitive object hallucination)"],
          ["Show, Attend and Tell (Xu 2015)", "VGG-16 feature grid", "LSTM + Spatial visual attention", "96.4", "Moderate"],
          ["Up-Down Attention (Anderson 2018)", "Faster R-CNN (Bottom-Up object features)", "Top-Down LSTM", "120.1", "Low on common objects"],
          ["BLIP-2 (Li et al. 2023)", "EVA-CLIP ViT", "Q-Former + Flan-T5 / OPT", "144.5", "Low (strong visual grounding)"],
          ["LLaVA-1.5 / GPT-4V (Modern VLM)", "CLIP-ViT-L/14 patch tokens", "Autoregressive LLM (Vicuna 13B)", "148.0+", "Very Low (rich conversational reasoning)"]
        ],
        n: "Image captioning bridges vision and language by framing description as conditional sequence generation: $P(Y \\mid I) = \\prod_{t=1}^T P(w_t \\mid w_{<t}, I)$. In classical models (Show and Tell), a CNN extracts a visual vector $v = f_\\theta(I)$ that initializes the hidden state of an LSTM decoder: $h_0 = \\text{Linear}(v)$. In the seminal **Up-Down Attention** model, bottom-up object proposals from Faster R-CNN are attended to by a top-down language LSTM using spatial cross-attention. Modern Vision-Language Models (VLMs like LLaVA) map image patch embeddings into the token embedding space of a large language model via a simple linear projection or Q-Former: $X_{\\text{visual}} = W_p \\cdot \\text{VisionEncoder}(I)$. Training optimizes autoregressive cross-entropy loss, evaluated using **CIDEr (Consensus-based Image Description Evaluation)**, which measures consensus across multiple human reference captions using TF-IDF weighted n-gram matching."
      },

      miss: [
        {
          w: "Image captioning models 'understand' the story and emotions behind an image like a human.",
          r: "Captioning models rely on statistical correlations between visual features and linguistic collocations learned from paired datasets (COCO, LAION). They frequently describe superficial visual objects while missing subtle irony, emotional subtext, or causal events."
        },
        {
          w: "BLEU-4 is the best metric for evaluating image captions.",
          r: "BLEU was designed for machine translation and correlates poorly with human judgments of caption quality. The computer vision community specifically developed **CIDEr** and **SPICE**, which weight informative salient content words over common grammatical filler."
        },
        {
          w: "Object hallucination does not occur if the model uses a powerful Vision Transformer.",
          r: "Multimodal LLMs suffer from severe **object hallucination**—generating plausible objects (e.g., claiming there is a dog in a park scene) based entirely on linguistic priors from the language model, even when the visual encoder features provide zero evidence for the object."
        },
        {
          w: "Grid-based CNN features are always superior to object bounding-box features for captioning.",
          r: "Anderson et al. demonstrated that 'Bottom-Up' features extracted from salient object bounding boxes (via Faster R-CNN) vastly outperform uniform spatial grid features by focusing attention on discrete physical objects."
        }
      ],

      trade: {
        buys: [
          "Unifies computer vision and natural language processing into coherent multimodal comprehension.",
          "Crucial for accessibility: provides automated screen-reader alternative text (alt text) for visually impaired users.",
          "Enables open-domain semantic image search using complex conversational natural language queries.",
          "Serves as the core visual reasoning engine in modern multimodal AI assistants (LLaVA, GPT-4V, Claude 3.5)."
        ],
        costs: [
          "High hallucination rates: models frequently invent non-existent objects driven by language model priors.",
          "Computationally intensive: modern vision-language models require billions of parameters and dedicated GPU hardware.",
          "Heavily biased toward dominant cultural depictions present in web-scraped caption datasets.",
          "Evaluation metrics (CIDEr, ROUGE) struggle to measure creative, diverse, or metaphorical descriptions accurately."
        ],
        avoid: [
          "Never deploy image captioning in high-liability medical/forensic contexts without hallucination guardrails.",
          "Do not use BLEU alone to evaluate caption quality; always report CIDEr and SPICE.",
          "Avoid using unaligned pre-trained LLMs without explicit vision-language bridge training (like Q-Former or projection layers)."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "imagenet",

      why: {
        before: "Computer vision research was bottlenecked by tiny, bespoke datasets (Caltech-101, PASCAL VOC with 20 classes and ~10,000 images) where models overfitted to artificial lab conditions, convincing researchers that hand-crafted features (SIFT) had reached an insurmountable ceiling.",
        problem: "Statistical learning theory dictates that high-capacity models require millions of diverse training examples to discover generalizable hierarchical representations without memorization.",
        shift: "**ImageNet: A massive benchmark dataset comprising over 14 million hand-annotated images organized according to the WordNet visual hierarchy across 20,000+ synset categories.** Spearheaded by Fei-Fei Li in 2009, ImageNet and its annual competition (ILSVRC) catalyzed the modern deep learning revolution."
      },

      num: {
        t: "ILSVRC ImageNet Competition Milestones (2010–2017): Error Rates & Architectures",
        h: ["Year", "Winning Architecture", "Primary Mechanism", "Top-5 Error Rate", "Historical Impact"],
        r: [
          ["2010", "NEC-UIUC", "SIFT + LBP + Sparse Coding + SVM", "28.2%", "Apex of hand-crafted feature engineering"],
          ["2011", "XRCE", "Fisher Vectors + Linear Classifiers", "25.8%", "Final classical non-neural victory"],
          ["2012", "AlexNet (Krizhevsky et al.)", "8-layer Deep CNN + ReLU + Dropout + GPU", "16.4% (Massive drop)", "Ignited the modern deep learning revolution"],
          ["2013", "ZFNet (Zeiler & Fergus)", "Deconvolutional visualization + tuned strides", "11.7%", "Revealed hierarchical internal CNN representations"],
          ["2014", "GoogLeNet / VGG-16", "Inception multi-scale blocks / $3\\times 3$ deep stacks", "6.7% / 7.3%", "Proved depth and architectural design scale accuracy"],
          ["2015", "ResNet (He et al.)", "152-layer Residual Connections ($F(x) + x$)", "3.57%", "Surpassed estimated human-level top-5 error (~5.1%)"],
          ["2017", "SENet (Hu et al.)", "Squeeze-and-Excitation channel attention", "2.25%", "Final year of ILSVRC; competition officially retired"]
        ],
        n: "The ImageNet Large Scale Visual Recognition Challenge (ILSVRC) benchmarked algorithms on a standardized subset: **ImageNet-1K**, consisting of exactly 1,000 mutually exclusive categories, 1.28 million training images, 50,000 validation images, and 100,000 test images. The primary evaluation metric was **Top-5 Error Rate**: an image was classified correctly if the true ground truth label appeared within the model's top 5 most confident softmax predictions. ImageNet's true significance extends far beyond classification: representations learned by pre-training on ImageNet-1K demonstrated universal transfer learning capabilities, serving as pre-trained backbones across object detection, semantic segmentation, visual tracking, and medical imaging for over a decade."
      },

      miss: [
        {
          w: "ImageNet is just a large folder of images with labels.",
          r: "ImageNet is structured explicitly around the **WordNet lexical ontology**. Classes are organized into 'synsets' (synonym sets) with formal hierarchical hypernym/hyponym relationships (e.g., 'terrier' is a kind of 'dog', which is a kind of 'mammal')."
        },
        {
          w: "Surpassing 'human-level performance' (3.57% vs 5.1%) on ImageNet means computers see better than humans.",
          r: "The human benchmark (tested by Andrej Karpathy) required identifying 120 esoteric, fine-grained dog breeds that average humans cannot differentiate without a canine encyclopedia. Machines excel at memorizing fine-grained dog breeds, but humans possess vastly superior physical world-reasoning and out-of-distribution robustness."
        },
        {
          w: "ImageNet pre-training is mandatory for training any computer vision model.",
          r: "Modern foundation models (CLIP, DINOv2) train directly on billions of weakly supervised web image-text pairs or self-supervised masked autoencoders, bypassing supervised ImageNet pre-training entirely."
        },
        {
          w: "ImageNet-1K labels are 100% clean and error-free.",
          r: "Extensive audits (Beyer et al., 2020) revealed significant label noise: ~20% of images contain multiple valid objects where only one was labeled, and many classes are visually indistinguishable, leading to the creation of ImageNet-ReaL."
        }
      ],

      trade: {
        buys: [
          "Catalyzed the deep learning revolution: proved empirically that deep neural networks scale with massive data volume.",
          "Universal transfer learning backbone: pre-trained ImageNet weights accelerated computer vision across all domains.",
          "Standardized academic evaluation: provided a rigorous, reproducible benchmark that drove a decade of architectural innovation.",
          "WordNet ontological hierarchy enables hierarchical evaluation and distance-aware error analysis."
        ],
        costs: [
          "Heavily skewed toward fine-grained categories: 120 of the 1,000 classes are different breeds of dogs.",
          "Supervised classification pre-training induces a strong bias toward surface texture rather than global shape.",
          "Significant label noise, co-occurring object omissions, and historical demographic biases in source images.",
          "ImageNet-1K saturation: modern models exceed 91% Top-1 accuracy, causing research to migrate to harder benchmarks."
        ],
        avoid: [
          "Never evaluate modern vision models purely on Top-5 accuracy; use Top-1 accuracy and out-of-distribution sets (ImageNet-A, -R).",
          "Do not assume pre-trained ImageNet-1K weights are optimal for fine-grained medical radiography without domain adaptation.",
          "Avoid ignoring multi-label ambiguity in ImageNet images; use ImageNet-ReaL labels for clean academic evaluation."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "opencv",

      why: {
        before: "Computer vision researchers had to re-implement low-level matrix mathematics, image decoders, and convolution loops in C/Fortran from scratch for every project, creating immense development overhead and non-reproducible code.",
        problem: "Computer vision requires real-time matrix processing (convolutions, matrix inversions, morphological transforms) optimized for CPU hardware vectorization (SIMD, SSE, AVX), which naive programming languages cannot deliver.",
        shift: "**OpenCV (Open Source Computer Vision Library): The preeminent open-source library for real-time computer vision, image processing, and machine learning.** Initiated by Intel in 1999 under Gary Bradski, OpenCV provides thousands of hardware-accelerated algorithms in C++, Python, and Java."
      },

      num: {
        t: "OpenCV Core Modules: Mathematical Capabilities & Underlying Acceleration",
        h: ["Module Name", "Primary Functionality", "Core Data Structure", "Hardware Acceleration Engine", "Key Algorithms"],
        r: [
          ["`core`", "N-dimensional dense arrays & linear algebra", "`cv::Mat` / NumPy ndarray", "Intel IPP, AVX2/AVX-512, OpenCL", "SVD, matrix inversion, DFT, PCA"],
          ["`imgproc`", "2D image processing & filtering", "`cv::Mat` (2D grid)", "SIMD vectorization / OpenCL", "Canny, Hough Transform, bilateral filter, warpAffine"],
          ["`video` / `videoio`", "Motion analysis, optical flow & camera I/O", "Video stream buffer", "FFmpeg, GStreamer, DirectShow", "Lucas-Kanade, Farneback, Kalman filter"],
          ["`calib3d`", "Camera calibration & 3D multiview geometry", "Homography / Projection matrices", "LAPACK / Eigen backend", "Stereo BM/SGBM, solvePnP, epipolar geometry"],
          ["`dnn`", "Deep neural network inference engine", "`cv::dnn::Net` (Graph)", "OpenVINO, CUDA, cuDNN, Vulkan", "Optimized forward-pass execution (ONNX, Caffe, TF)"]
        ],
        n: "At the core of OpenCV is the **`cv::Mat`** structure (bridged seamlessly to NumPy arrays in Python via the buffer protocol), which manages a memory header and a pointer to contiguous pixel memory. OpenCV is engineered for extreme execution speed, leveraging Intel Integrated Performance Primitives (IPP), OpenCL (for GPU offloading), and explicit CPU vector SIMD instructions. In classical 3D vision, OpenCV's **`calib3d`** module models camera perspective distortion via Zhang's pinhole camera calibration method: $\\begin{bmatrix} u \\\\ v \\\\ 1 \\end{bmatrix} = \\mathbf{K} [\\mathbf{R} \\mid \\mathbf{t}] \\begin{bmatrix} X \\\\ Y \\\\ Z \\\\ 1 \\end{bmatrix}$, computing radial distortion coefficients $(k_1, k_2, p_1, p_2)$ to un-distort wide-angle lens cameras in real time."
      },

      miss: [
        {
          w: "OpenCV loads color images in standard RGB format by default.",
          r: "Due to historical Intel hardware camera driver conventions in 1999, OpenCV loads color images in **BGR (Blue-Green-Red)** order. Passing an OpenCV image to Matplotlib, PIL, or PyTorch without calling `cv2.cvtColor(img, cv2.COLOR_BGR2RGB)` results in swapped blue and red channels."
        },
        {
          w: "OpenCV is only for classical computer vision and cannot run deep neural networks.",
          r: "OpenCV contains a highly optimized `cv2.dnn` module capable of loading and running ONNX, TensorFlow, and PyTorch models on CPU/GPU via OpenVINO or CUDA, often outperforming raw PyTorch runtime on Intel CPUs."
        },
        {
          w: "In OpenCV image indexing, coordinates are specified as `(x, y)` everywhere.",
          r: "Pixel matrix indexing follows standard linear algebra row-column notation: `img[y, x]` or `img[row, col]`. However, geometric functions (like `cv2.resize`, `cv2.line`, `cv2.rectangle`) expect coordinates as `(x, y)`, causing frequent transposition bugs."
        },
        {
          w: "OpenCV image modifications always create a safe, independent memory copy.",
          r: "Python array slicing on an OpenCV image (e.g., `crop = img[y1:y2, x1:x2]`) returns a **view** into the original memory buffer, not a copy. Modifying `crop` directly alters the pixels of `img` unless `.copy()` is explicitly called."
        }
      ],

      trade: {
        buys: [
          "Unrivaled execution speed: hand-optimized C++ SIMD routines deliver microsecond latency on edge CPUs.",
          "Massive comprehensive suite: provides over 2,500 algorithms spanning filtering, calibration, tracking, and stereo vision.",
          "Cross-platform ubiquity: runs natively on Linux, Windows, macOS, Android, iOS, and embedded ARM chips.",
          "Seamless zero-copy interoperability with NumPy in Python enables high-productivity data science scripting."
        ],
        costs: [
          "Legacy quirks: default BGR channel ordering and transposed `(x, y)` vs `(y, x)` coordinate conventions create common bugs.",
          "Memory mutation pitfalls: view-based slicing can inadvertently corrupt original image arrays.",
          "Deep learning module (`cv2.dnn`) is strictly for inference; it contains no training or backpropagation capabilities.",
          "Monolithic binary footprint: compiling the full library with all contrib modules requires substantial disk space."
        ],
        avoid: [
          "Never pass OpenCV-loaded images directly into Matplotlib or PyTorch without converting BGR to RGB.",
          "Do not forget that OpenCV image slicing uses `img[y1:y2, x1:x2]` while functions expect `(x, y)`.",
          "Avoid training deep neural networks inside OpenCV; use PyTorch or TensorFlow and export to ONNX for OpenCV deployment."
        ]
      }
    }

  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
