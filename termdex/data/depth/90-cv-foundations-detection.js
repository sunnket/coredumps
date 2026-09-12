/* ==========================================================================
   Depth pass 90 — Computer Vision batch 1: Foundations & Object Detection Mechanics.
   Computer Vision, Image Classification, Object Detection,
   Bounding Box, Intersection over Union, Non-Maximum Suppression, Mean Average Precision.

   Spatial grid anchor regressions refine candidate bounding coordinates;
   greedy IoU suppression collapses redundant high-confidence spatial proposals.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "computer-vision",

      why: {
        before: "Digital cameras recorded optical scenes as 2D arrays of raw RGB pixel brightness values, but computers lacked any visual cognitive model to interpret shapes, depths, objects, or actions within those numbers.",
        problem: "An image is an ill-posed 2D projection of an ambiguous 3D world; perspective projection, changing illumination, non-rigid deformations, occlusions, and clutter mean identical physical objects yield radically different pixel arrays.",
        shift: "**Computer Vision (CV): The interdisciplinary field enabling computational systems to extract high-level semantic understanding from digital images, videos, and multi-spectral sensors.** Evolved from classical edge/feature geometry (SIFT, HOG, Canny) to deep convolutional networks (AlexNet, ResNet) and Vision Transformers (ViT)."
      },

      num: {
        t: "Computer Vision Paradigms: Historical Milestones, Math Foundations & Benchmarks",
        h: ["Era / Paradigm", "Representational Paradigm", "Feature Extraction", "ImageNet Top-5 Error", "Core Limitation"],
        r: [
          ["Classical Geometry (1970–2000)", "Edge graphs, Marr's 2.5D sketch", "Hand-crafted gradients (Sobel, Canny)", "N/A (simple lab sets)", "Brittle to lighting & viewpoint changes"],
          ["Statistical Local Descriptors (2000–2012)", "Bag of Visual Words (BoVW)", "SIFT, SURF, HOG + SVM classifiers", "~26.2%", "Cannot capture deep hierarchical semantics"],
          ["Deep CNNs (2012–2020)", "Hierarchical spatial feature maps", "Learned 2D convolutions (AlexNet, ResNet)", "~3.57% (Superhuman)", "Inductive bias fixed to local receptive fields"],
          ["Vision Transformers (2020–Present)", "Patch tokens + global self-attention", "All-to-all dot-product attention (ViT)", "< 1.2% (Top-1: 91%+)", "Requires massive pre-training data ($>300M$ images)"]
        ],
        n: "Computer Vision operates by transforming discrete spatial sensor readings $I(x, y, c) \\in \\mathbb{R}^{H \\times W \\times C}$ into continuous semantic representations $z \\in \\mathbb{R}^d$ or dense spatial label maps. The fundamental challenge is the **Semantic Gap**—the vast chasm between raw photometric radiance measurements (e.g., pixel value 142 at coordinates (120, 84)) and high-level abstract conceptualization (e.g., 'a Golden Retriever catching a frisbee'). Deep learning bridged this gap by learning hierarchical compositional representations: initial convolutional layers extract oriented Gabor-like edge filters; intermediate layers assemble edges into textures, corners, and motifs; and deep layers synthesize object parts and semantic entities invariant to translation, scale, and lighting."
      },

      miss: [
        {
          w: "Computers 'see' images the same way the human visual cortex processes light.",
          r: "Humans process visual scenes via active foveated saccadic scanning, biological recurrence, and deep physical world-model priors. Standard feedforward neural networks process all pixel patches uniformly in parallel without intuitive physics or causal reasoning."
        },
        {
          w: "High image resolution always improves computer vision model accuracy.",
          r: "Increasing resolution quadruples compute and memory costs ($O(H \\cdot W)$ in CNNs, $O((H \\cdot W)^2)$ in standard ViTs) while introducing high-frequency sensor noise. Most models downsample images to standard squares (e.g., $224 \\times 224$ or $384 \\times 384$) with minimal loss of semantic accuracy."
        },
        {
          w: "Vision models trained on daylight photos generalize seamlessly to night or rain.",
          r: "Computer vision models suffer from severe distribution shift when confronted with sensor noise, rain streaks, lens flare, or low-light photon noise unless explicitly trained with domain adaptation or synthetic weather augmentation."
        },
        {
          w: "Vision Transformers (ViT) are universally superior to CNNs for all visual applications.",
          r: "ViTs lack translation equivariance and local spatial inductive bias. On small datasets (< 100,000 images) or resource-constrained embedded edge devices, modern CNNs (such as ConvNeXt or MobileNetV4) frequently outperform ViTs with lower memory and faster latency."
        }
      ],

      trade: {
        buys: [
          "Automates high-throughput visual inspection in manufacturing, medical imaging diagnostics, and robotics.",
          "Enables autonomous navigation for self-driving vehicles, drones, and warehouse automated guided vehicles (AGVs).",
          "Extracts real-time spatial awareness and safety monitoring from ubiquitous video surveillance streams.",
          "Powers facial recognition, biometric authentication, and accessible visual screen readers for the visually impaired."
        ],
        costs: [
          "Enormous compute and memory footprint: high-resolution video streams require costly GPU acceleration clusters.",
          "High vulnerability to adversarial perturbations: imperceptible imperceptible pixel noise can induce false classifications.",
          "Severe safety risks in autonomous systems due to out-of-distribution optical edge cases (e.g., blinding glare).",
          "Privacy and surveillance concerns regarding automated biometric tracking in public spaces."
        ],
        avoid: [
          "Never deploy safety-critical vision systems (e.g., automated driving) without redundant multi-modal sensors (LiDAR/Radar).",
          "Do not train Vision Transformers from scratch on small datasets without extensive pre-training or data augmentation.",
          "Avoid using raw un-normalized RGB pixel values ($0-255$) without standard z-score normalization."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "image-classification",

      why: {
        before: "Automated photo sorting required human tagging or hand-crafted heuristic filters (e.g., counting green pixels to classify 'landscape' vs 'portrait') that broke down across real-world photos.",
        problem: "Objects appear in infinite poses, backgrounds, scales, and lighting conditions; a single category like 'chair' encompasses thousands of visually distinct geometries that cannot be described with explicit rules.",
        shift: "**Image Classification: Assigning a single categorical label to an entire digital image from a predefined discrete set of classes ($y \\in \\{1, \\dots, C\\}$).** The breakthrough of AlexNet on ImageNet (2012) triggered the modern deep learning revolution, replacing SIFT/SVM pipelines with end-to-end convolutional and transformer encoders."
      },

      num: {
        t: "ImageNet-1K Benchmark Milestones: Parameters, FLOPs & Top-1 Accuracy",
        h: ["Architecture", "Year", "Parameters", "Inference FLOPs", "Top-1 Accuracy (%)"],
        r: [
          ["AlexNet (Krizhevsky et al.)", "2012", "61M", "0.72 GFLOPs", "63.3% (Top-5: 84.7%)"],
          ["VGG-16 (Simonyan & Zisserman)", "2014", "138M", "15.5 GFLOPs", "74.4%"],
          ["ResNet-50 (He et al.)", "2015", "25.6M", "4.1 GFLOPs", "76.1%"],
          ["EfficientNet-B7 (Tan & Le)", "2019", "66M", "37.0 GFLOPs", "84.3%"],
          ["ViT-H/14 (Dosovitskiy et al.)", "2020", "632M", "167.0 GFLOPs", "88.5%"],
          ["CoCa / Florence-2 (Foundation)", "2023+", "> 1.0B", "> 250 GFLOPs", "91.2%+"]
        ],
        n: "Image classification maps input tensor $x \\in \\mathbb{R}^{H \\times W \\times 3}$ to a probability vector $\\hat{y} \\in \\Delta^{C-1}$ over $C$ classes. A deep neural backbone extracts global spatial feature vector $h = f_\\theta(x) \\in \\mathbb{R}^d$ via global average pooling (GAP) over final spatial feature maps. The classification head computes un-normalized logits $z_c = w_c^T h + b_c$, mapped to probabilities via the softmax function: $P(y = c \\mid x) = \\frac{\\exp(z_c)}{\\sum_{j=1}^C \\exp(z_j)}$. The network parameters are optimized by minimizing categorical cross-entropy loss: $\\mathcal{L}_{\\text{CE}} = -\\sum_{c=1}^C y_c \\log \\hat{y}_c$. To prevent overconfident outputs and improve generalization, modern classification pipelines incorporate **Label Smoothing**: $y_c^{\\text{smooth}} = (1 - \\epsilon) y_c + \\frac{\\epsilon}{C}$."
      },

      miss: [
        {
          w: "Image classification tells you where an object is located within the image.",
          r: "Image classification outputs a single global label for the entire image without spatial bounding coordinates. Locating where objects reside requires Object Detection (bounding boxes) or Semantic Segmentation (pixel masks)."
        },
        {
          w: "Global Average Pooling (GAP) loses all spatial awareness compared to flattening dense layers.",
          r: "GAP dramatically reduces parameter counts (preventing overfitting in VGG-style dense heads) while acting as a structural regularizer. Class Activation Mapping (CAM) demonstrates that GAP backpropagates clean spatial localization cues."
        },
        {
          w: "A 95% top-1 accuracy model is ready for immediate deployment in clinical medical diagnosis.",
          r: "ImageNet benchmarks are curated with balanced, clean photos. Real-world clinical datasets feature severe class imbalance, confounding artifacts (e.g., hospital watermark tags), and high out-of-distribution variance requiring calibrated uncertainty estimation."
        },
        {
          w: "Vision models see textures and shapes in the exact same priority order as humans.",
          r: "Geirhos et al. proved that standard convolutional networks are heavily biased toward surface **texture** rather than global **shape** (e.g., classifying a cat with elephant-skin texture as an elephant), making them susceptible to adversarial texture shifts."
        }
      ],

      trade: {
        buys: [
          "Fundamental building block of visual AI: pre-trained classification backbones serve as feature extractors for detection and segmentation.",
          "High operational throughput: optimized mobile models (MobileNetV4) execute in under 2ms on smartphone NPUs.",
          "Straightforward annotation pipeline: labeling an image category is fast and cost-effective compared to drawing pixel masks.",
          "Enables automated image search, visual content moderation, and industrial product defect sorting."
        ],
        costs: [
          "Provides no spatial localization: cannot identify object boundaries or handle multiple distinct objects in one frame.",
          "Vulnerable to spurious correlations (e.g., associating 'ship' labels with blue water backgrounds rather than the vessel).",
          "Texture bias over shape bias creates brittleness against stylistic and lighting perturbations.",
          "Fixed category taxonomy requires retraining or zero-shot vision-language alignment (CLIP) to recognize novel classes."
        ],
        avoid: [
          "Do not use image classification when an application requires counting or localizing multiple instances of an object.",
          "Never evaluate imbalanced industrial defect datasets with raw accuracy; use Precision-Recall AUC or Macro-F1.",
          "Avoid using giant Vision Transformers when a lightweight ResNet or MobileNet meets latency and accuracy requirements."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "object-detection",

      why: {
        before: "Computer vision systems could classify an entire image into a category, but could neither determine where multiple objects were located nor differentiate multiple overlapping instances of the same class.",
        problem: "Real-world scenes contain varying numbers of objects at diverse spatial coordinates, scales, and aspect ratios, creating a combinatorial explosion of possible bounding box locations.",
        shift: "**Object Detection: Simultaneously classifying and localizing multiple distinct objects within an image using axis-aligned bounding boxes.** Evolved from multi-scale sliding windows (Viola-Jones) to two-stage region proposal networks (R-CNN, Faster R-CNN) and real-time single-stage detectors (YOLO, SSD, DETR)."
      },

      num: {
        t: "Object Detection Paradigms: Architectures, Latency & COCO mAP Benchmark",
        h: ["Detector Paradigm", "Representative Model", "Stages", "COCO mAP@[.5:.95]", "Inference Latency (GPU)"],
        r: [
          ["Sliding Window / HOG", "DPM (Felzenszwalb 2010)", "Multi-scale cascade", "~15.0% (PASCAL)", "> 1,000 ms (CPU)"],
          ["Two-Stage Region Proposal", "Faster R-CNN (Ren 2015)", "Two-stage (RPN + RoI)", "42.0%", "~50 ms"],
          ["Feature Pyramid Two-Stage", "Mask R-CNN + FPN (2017)", "Two-stage (FPN + RoIAlign)", "46.5%", "~70 ms"],
          ["Single-Stage Anchor-Based", "YOLOv4 / RetinaNet (Focal Loss)", "Single-stage (Dense grid)", "43.5 – 48.0%", "~15 ms"],
          ["Single-Stage Anchor-Free", "YOLOv8 / CenterNet", "Single-stage (Keypoints/Decoupled)", "53.9%", "~8 ms (Real-Time)"],
          ["Transformer-Based", "DINO-DETR (Zhang 2022)", "Bipartite matching / Hungarian", "63.3%+", "~35 ms"]
        ],
        n: "Object detection decomposes into two coupled optimization tasks: **classification** (what object is present) and **regression** (where the object is located: $[x, y, w, h]$). In classical **two-stage** architectures (Faster R-CNN), a Region Proposal Network (RPN) slides over convolutional feature maps to propose candidate object bounds, which pass through RoIAlign to extract fixed-size feature vectors for class softmax and bounding box refinement. In **single-stage** architectures (YOLO), the network treats detection as a direct spatial regression problem: a single pass outputs dense multi-scale grid predictions encoding class probabilities and coordinate offsets directly. Detection models optimize a multi-task loss function: $\\mathcal{L} = \\mathcal{L}_{\\text{cls}} + \\lambda_1 \\mathcal{L}_{\\text{box}} + \\lambda_2 \\mathcal{L}_{\\text{obj}}$, where box regression typically uses Complete IoU (CIoU) or Distribution Focal Loss (DFL)."
      },

      miss: [
        {
          w: "Two-stage detectors (Faster R-CNN) are always more accurate than single-stage detectors (YOLO).",
          r: "Modern single-stage detectors (YOLOv8, YOLOv10) match or exceed Faster R-CNN accuracy while executing $5\\times$ to $10\\times$ faster, thanks to decoupled heads, anchor-free task-aligned assigners, and feature pyramid networks."
        },
        {
          w: "Object detection can identify precise irregular object contours (e.g., human arms and legs).",
          r: "Standard object detection outputs coarse axis-aligned rectangular bounding boxes that include significant background pixels. Precise pixel-level boundary delineation requires Instance Segmentation (e.g., Mask R-CNN)."
        },
        {
          w: "Detectors predict bounding boxes by evaluating every possible pixel window across the image.",
          r: "Exhaustive sliding windows are computationally impossible ($O(W^2 H^2)$ combinations). Detectors evaluate anchor boxes on downsampled spatial feature pyramids (stride 8, 16, 32) or use anchor-free center-point keypoint regression."
        },
        {
          w: "Focal Loss and Cross-Entropy Loss perform identically in single-stage detectors.",
          r: "Single-stage detectors evaluate tens of thousands of candidate grid locations, where $>99\%$ are background (negative samples). Standard cross-entropy is overwhelmed by easy negative gradients. Focal Loss down-weights easy examples by $(1 - p_t)^\\gamma$, preventing gradient saturation."
        }
      ],

      trade: {
        buys: [
          "Provides both semantic identity and spatial localization coordinates for multiple objects in complex scenes.",
          "Real-time inference capability ($> 60$ FPS) enables autonomous driving, robotics, and sports tracking.",
          "Standardized output format (bounding box arrays) integrates directly into downstream tracking and analytics systems.",
          "Handles multi-scale visual elements via Feature Pyramid Networks (FPN) and Path Aggregation Networks (PAN)."
        ],
        costs: [
          "Complex multi-task loss optimization requiring careful balancing between classification and geometric regression.",
          "Axis-aligned boxes encompass irrelevant background pixels, causing errors when objects overlap diagonally.",
          "High annotation cost: drawing thousands of precise bounding boxes is labor-intensive and subject to annotator variance.",
          "Dense cluster detection (e.g., crowded pedestrian crossings or dense warehouse shelves) triggers occlusion dropouts."
        ],
        avoid: [
          "Do not use two-stage Faster R-CNN for edge deployments where real-time frame rates ($>30$ FPS) are mandatory.",
          "Never evaluate object detectors on small objects without verifying that feature pyramid strides preserve small features.",
          "Avoid using standard $L_1$ or Smooth-$L_1$ loss for bounding box regression; use scale-invariant CIoU or GIoU loss."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "bounding-box",

      why: {
        before: "Early vision systems highlighted regions of interest using raw spatial coordinates, pixel masks, or ad-hoc ellipses without standardized mathematical representations across datasets and libraries.",
        problem: "Neural network regression requires standardized, scale-invariant, and geometrically stable parameterizations to learn object coordinates without destabilizing gradient descent across varying image sizes.",
        shift: "**Bounding Box (BBox): An axis-aligned or oriented rectangle enclosing an object of interest, defined by four numerical spatial coordinates.** Formats standardized into canonical coordinate representations ($[x_{\\min}, y_{\\min}, x_{\\max}, y_{\\max}]$ vs $[x_c, y_c, w, h]$ normalized to $[0, 1]$)."
      },

      num: {
        t: "Bounding Box Coordinate Formats Across Frameworks & Libraries",
        h: ["Format Name", "Coordinate Representation", "Value Range", "Standard Ecosystem / Framework", "Conversion Formula from Corners"],
        r: [
          ["Pascal VOC", "`[xmin, ymin, xmax, ymax]`", "Absolute pixels ($[0, W], [0, H]$)", "Pascal VOC, Albumentations, PyTorch", "Identity (native corners)"],
          ["COCO Format", "`[xmin, ymin, width, height]`", "Absolute pixels", "COCO API, Detectron2, MMDetection", "`w = xmax - xmin`, `h = ymax - ymin`"],
          ["YOLO Format", "`[x_center, y_center, width, height]`", "Normalized floats ($[0.0, 1.0]$)", "Ultralytics YOLO, Darknet", "`xc = (xmin + xmax) / (2 * W)`"],
          ["TensorFlow / TFOD", "`[ymin, xmin, ymax, xmax]`", "Normalized floats ($[0.0, 1.0]$)", "TensorFlow Object Detection API", "Normalized swapped corner coordinates"],
          ["Oriented BBox (OBB)", "`[xc, yc, w, h, angle]`", "Floats + rotation $\\theta \\in [-\\pi/2, \\pi/2]$", "Aerial imagery (DOTA), text OCR", "Includes angular rotation offset $\\theta$"]
        ],
        n: "A 2D bounding box represents the minimal enclosing rectangle containing an object's visible boundaries: $B = (x_1, y_1, x_2, y_2)$. When training neural networks, predicting absolute pixel coordinates causes gradient explosion when image resolution changes. Modern detectors normalize coordinates relative to image width $W$ and height $H$, or predict scale-invariant log-space offsets relative to anchor boxes: $t_x = (x - x_a) / w_a$, $t_y = (y - y_a) / h_a$, $t_w = \\log(w / w_a)$, $t_h = \\log(h / h_a)$. In aerial drone imagery and rotated text detection, axis-aligned boxes include excessive background when objects lie at $45^\\circ$ angles; **Oriented Bounding Boxes (OBB)** introduce a rotational degree of freedom $\\theta$ to tightly bind skewed geometry."
      },

      miss: [
        {
          w: "All computer vision frameworks use the exact same bounding box format.",
          r: "Bounding box conventions diverge across frameworks: COCO uses `[x, y, w, h]` in absolute pixels; YOLO uses `[xc, yc, w, h]` normalized to $[0, 1]$; TensorFlow uses `[ymin, xmin, ymax, xmax]`. Mixing formats causes completely broken spatial predictions."
        },
        {
          w: "A bounding box contains only the pixels belonging to the target object.",
          r: "Axis-aligned bounding boxes include substantial non-object background pixels, especially for diagonal, thin, or concave objects (e.g., an elongated baseball bat or a coiled rope), leading to feature noise."
        },
        {
          w: "Predicting bounding box coordinates using Mean Squared Error (MSE) is optimal.",
          r: "MSE treats $x, y, w, h$ as four independent variables, ignoring their collective geometric correlation. A 5-pixel error on a tiny 10-pixel box destroys IoU, while the same error on a 500-pixel box is negligible. IoU-based loss functions are required."
        },
        {
          w: "Normalizing bounding box coordinates by image dimensions eliminates all scale variance.",
          r: "While normalized coordinates handle varying canvas dimensions, objects at different camera depths still experience extreme scale variance on convolutional feature maps, necessitating multi-scale Feature Pyramid Networks (FPN)."
        }
      ],

      trade: {
        buys: [
          "Ultra-compact numerical representation: encodes an object's spatial location and size in just 4 floating-point numbers.",
          "Fast, standardized mathematical operations: Intersection-over-Union (IoU) and non-maximum suppression run in microseconds.",
          "Cost-effective to annotate: human annotators draw bounding boxes $10\\times$ faster than tracing pixel-accurate segmentation masks.",
          "Universal standard supported across all edge hardware, camera chips, and computer vision deployment SDKs."
        ],
        costs: [
          "Cannot capture fine-grained geometry, non-convex boundaries, or thin diagonal objects without background contamination.",
          "Incompatible with dense overlapping occlusions where two boxes encompass identical bounding coordinates.",
          "Format fragmentation across libraries creates frequent coordinate transposition bugs in production code.",
          "Scale imbalance: tiny objects ($< 32 \\times 32$ pixels) produce unstable gradient updates during regression."
        ],
        avoid: [
          "Never pass bounding boxes between libraries (e.g., OpenCV to YOLO) without explicit format verification.",
          "Do not use $L_1$ or $L_2$ regression loss for bounding box coordinate optimization; use Complete IoU (CIoU).",
          "Avoid axis-aligned boxes when detecting rotated aerial satellite imagery or skewed license plates; use OBB."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "intersection-over-union",

      why: {
        before: "Evaluating bounding box accuracy using Euclidean distance between corner points or centers failed to account for object scale, meaning a 10-pixel error was catastrophic for a small bird but insignificant for an airplane.",
        problem: "Computer vision required a scale-invariant, bounded, and geometrically intuitive metric to measure the spatial overlap between predicted and ground-truth bounding regions.",
        shift: "**Intersection over Union (IoU / Jaccard Index): The ratio of the area of overlap between two bounding regions to the area of their union.** Defined as $\\text{IoU} = \\frac{\\text{Area}(A \\cap B)}{\\text{Area}(A \\cup B)}$, IoU became the foundational standard for object detection evaluation, non-maximum suppression, and regression loss."
      },

      num: {
        t: "IoU Variants: Mathematical Formulations, Penalty Terms & Gradient Properties",
        h: ["IoU Variant", "Formula / Penalty Term", "Range", "Gradient when Disjoint ($A \\cap B = 0$)", "Geometric Alignment"],
        r: [
          ["Standard IoU", "$\\frac{|A \\cap B|}{|A \\cup B|}$", "$[0, 1]$", "Zero (vanishing gradient)", "Area overlap only"],
          ["GIoU (Generalized)", "$\\text{IoU} - \\frac{|C \\setminus (A \\cup B)|}{|C|}$", "$[-1, 1]$", "Non-zero (moves towards ground truth)", "Smallest enclosing convex hull $C$"],
          ["DIoU (Distance)", "$\\text{IoU} - \\frac{\\rho^2(b, b^{gt})}{c^2}$", "$[-1, 1]$", "High (minimizes normalized center distance)", "Central distance $\\rho$ normalized by diagonal $c$"],
          ["CIoU (Complete)", "$\\text{DIoU} - \\alpha v$", "$[-1, 1]$", "Full directional gradient", "Overlap + Center distance + Aspect ratio consistency $v$"],
          ["EIoU (Efficient)", "$\\text{DIoU} - \\frac{\\rho_w^2}{c_w^2} - \\frac{\\rho_h^2}{c_h^2}$", "$[-1, 1]$", "Decoupled width/height gradients", "Explicitly minimizes width and height discrepancies"]
        ],
        n: "Intersection over Union measures the degree of geometric alignment between candidate bounding box $B_p$ and target box $B_g$: $\\text{IoU} = \\frac{|B_p \\cap B_g|}{|B_p \\cup B_g|} = \\frac{|B_p \\cap B_g|}{|B_p| + |B_g| - |B_p \\cap B_g|}$. In COCO benchmarks, a prediction is deemed a True Positive only if $\\text{IoU} \\ge 0.50$ (or averaged across thresholds from $0.50$ to $0.95$). While standard IoU is an effective evaluation metric, using $\\mathcal{L} = 1 - \\text{IoU}$ as a training loss fails when boxes do not overlap ($A \\cap B = \\emptyset$), because $\\text{IoU} = 0$ everywhere, providing zero gradient $\\nabla \\mathcal{L} = 0$. **CIoU (Complete IoU)** resolves this by adding penalty terms for normalized center-point Euclidean distance $\\rho^2$ and aspect ratio consistency $v = \\frac{4}{\\pi^2} \\left( \\arctan \\frac{w^{gt}}{h^{gt}} - \\arctan \\frac{w}{h} \\right)^2$."
      },

      miss: [
        {
          w: "An IoU of 0.50 represents poor overlap between bounding boxes.",
          r: "To the human eye, an IoU of 0.50 appears as a substantial visual match that clearly encloses the target object. In PASCAL VOC benchmarks, 0.50 IoU was the definitive acceptance threshold for true positives."
        },
        {
          w: "Standard IoU loss can guide two non-overlapping boxes to find each other.",
          r: "When two boxes have zero overlap, $\\text{IoU} = 0$ and its derivative is identically zero. The optimizer receives no directional guidance on which way to move or scale the box, which is why GIoU, DIoU, and CIoU were invented."
        },
        {
          w: "IoU can only be computed on rectangular 2D bounding boxes.",
          r: "IoU is a universal set-theoretic metric (Jaccard Index) valid on arbitrary geometric shapes: 3D bounding cuboids in LiDAR autonomous driving, polygon segmentation masks, and pixel-level boolean masks."
        },
        {
          w: "Maximizing IoU guarantees identical aspect ratios between boxes.",
          r: "Two boxes can achieve an IoU of 0.70 while possessing noticeably different aspect ratios (e.g., a square box overlapping a rectangular box). CIoU explicitly penalizes aspect ratio deviation to enforce shape alignment."
        }
      ],

      trade: {
        buys: [
          "Strictly scale-invariant metric: a 90% overlap receives 0.90 IoU regardless of whether the box is $10\\times 10$ or $1000\\times 1000$ pixels.",
          "Bounded mathematical range: normalized between $[0, 1]$ (or $[-1, 1]$ for generalized variants).",
          "Directly correlates with human perceptual judgment of spatial alignment.",
          "Differentiable formulations (GIoU/CIoU) allow direct end-to-end backpropagation for bounding box regression."
        ],
        costs: [
          "Standard IoU provides zero gradient and plateaus when candidate and target boxes do not overlap.",
          "Computing IoU for oriented bounding boxes (OBB) or 3D bounding boxes requires complex computational geometry algorithms.",
          "Sensitive to minor boundary jitter on extremely small objects ($< 10$ pixels across).",
          "Does not explicitly penalize which specific edge (top vs bottom) is misaligned."
        ],
        avoid: [
          "Never train bounding box regression with vanilla $1 - \\text{IoU}$ loss without non-overlapping penalty terms (CIoU/GIoU).",
          "Do not use IoU thresholds $> 0.75$ when evaluating tiny object detection datasets where annotator variance exceeds 20%.",
          "Avoid using axis-aligned 2D IoU algorithms on rotated or 3D point cloud cuboids."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "non-maximum-suppression",

      why: {
        before: "Dense object detectors predicted hundreds of overlapping candidate bounding boxes for a single physical object, cluttering scenes with duplicate detections and distorting object counts.",
        problem: "Every anchor box or spatial grid cell near an object's center outputs a high confidence score for that object; detectors need an algorithmic way to select the single best box and discard redundant duplicates.",
        shift: "**Non-Maximum Suppression (NMS): A post-processing algorithm that eliminates redundant, overlapping bounding boxes, preserving only the highest-scoring unique detection for each physical object.** Evolved from greedy hard-threshold NMS to Soft-NMS, Matrix NMS, and end-to-end bipartite matching (DETR)."
      },

      num: {
        t: "NMS Algorithms: Complexity, Occlusion Handling & mAP Impact (COCO)",
        h: ["NMS Algorithm", "Suppression Strategy", "Time Complexity", "COCO mAP Gain", "Behavior in Dense Crowds"],
        r: [
          ["Greedy Hard NMS (Neubeck 2006)", "Hard zeroing if $\\text{IoU} \\ge \\tau$", "$O(N^2)$ (sorted pairwise)", "Baseline (e.g. 40.0%)", "Aggressively deletes true overlapping objects"],
          ["Soft-NMS (Bodla et al. 2017)", "Decays score via Gaussian / Linear $\\text{IoU}$", "$O(N^2)$", "+1.2% to +1.8%", "Preserves occluded objects with lowered scores"],
          ["Matrix NMS (Wang et al. 2020)", "Parallel matrix operations in one step", "$O(1)$ on GPU tensor", "+1.5% (Faster runtime)", "Fast parallel execution; preserves overlapping instances"],
          ["DIoU-NMS (Zheng et al. 2020)", "Suppression based on IoU and center distance", "$O(N^2)$", "+0.8%", "Distinguishes side-by-side objects sharing high IoU"],
          ["End-to-End DETR (Carion 2020)", "Hungarian bipartite matching loss", "Zero post-processing ($O(1)$)", "Built into decoder", "Eliminates NMS entirely via set prediction"]
        ],
        n: "Standard Greedy Hard NMS operates sequentially: (1) Sort all candidate boxes $\\mathcal{B}$ in descending order of classification confidence score $\\mathcal{S}$. (2) Select the highest-scoring box $M$ and move it to final output set $\\mathcal{D}$. (3) For every remaining box $b_i \\in \\mathcal{B}$, compute $\\text{IoU}(M, b_i)$. If $\\text{IoU}(M, b_i) \\ge N_{\\text{thresh}}$ (typically $0.45$ to $0.60$), discard $b_i$. (4) Repeat until $\\mathcal{B}$ is empty. In dense crowd scenes (e.g., pedestrians walking together), two distinct humans naturally share an IoU $> 0.50$; Hard NMS deletes the second person. **Soft-NMS** resolves this by decaying rather than deleting confidence scores: $s_i = s_i \\exp \\left( -\\frac{\\text{IoU}(M, b_i)^2}{\\sigma} \\right)$, allowing true overlapping detections to survive."
      },

      miss: [
        {
          w: "NMS is a neural network layer trained with gradient backpropagation.",
          r: "Classical NMS is a non-differentiable heuristic post-processing algorithm executed after network inference on CPU or via custom CUDA kernels. It contains no learnable weights."
        },
        {
          w: "Soft-NMS completely eliminates false positives in crowd scenes.",
          r: "Soft-NMS decays confidence scores of overlapping boxes. While it prevents true occluded objects from being discarded, tuning the score threshold remains difficult and can increase false positive rates if background boxes survive."
        },
        {
          w: "All modern object detection models require an NMS post-processing step.",
          r: "Transformer-based detectors like DETR and RT-DETR model object detection as direct set prediction using Hungarian matching loss, producing one-to-one predictions without any NMS post-processing."
        },
        {
          w: "Class-agnostic NMS and Class-aware NMS produce identical results.",
          r: "Class-aware NMS suppresses overlapping boxes only if they share the exact same predicted class label. Class-agnostic NMS suppresses boxes regardless of class, which erroneously deletes a person riding a bicycle because the person and bicycle share high spatial IoU."
        }
      ],

      trade: {
        buys: [
          "Crucial deduplication mechanism transforming noisy multi-anchor outputs into clean, single-box-per-object detections.",
          "Simple, robust, and fast: GPU-accelerated Batched NMS processes thousands of candidate boxes in under 1 millisecond.",
          "Tunable operational trade-off: adjusting IoU threshold balances precision against recall in dense scenes.",
          "Class-aware filtering enables proper handling of multi-class scenes with overlapping objects (e.g., rider and horse)."
        ],
        costs: [
          "Hard threshold failure in crowded scenes: deletes genuine occluded objects whose mutual IoU exceeds the threshold.",
          "Heuristic non-differentiable nature prevents direct end-to-end optimization of the true detection loss.",
          "Sequential nature in classical CPU implementations introduces an inference latency bottleneck.",
          "Requires careful manual tuning of score thresholds and IoU suppression thresholds per deployment environment."
        ],
        avoid: [
          "Never use class-agnostic NMS when scenes contain inherently co-located objects (e.g., person wearing a helmet).",
          "Do not set the NMS IoU threshold too low ($< 0.30$), which aggressively deletes valid adjacent objects.",
          "Avoid running CPU-bound Python NMS loops in high-framerate production pipelines; use Torchvision or TensorRT CUDA NMS."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "mean-average-precision",

      why: {
        before: "Object detectors were evaluated using classification accuracy or raw precision/recall, which failed because detection requires evaluating both classification confidence ranking and geometric bounding box localization overlap simultaneously.",
        problem: "A detector can achieve 99% precision by outputting only its 3 most confident predictions, or 99% recall by outputting 5,000 low-confidence boxes; benchmarks needed an integrated metric that captures performance across all confidence thresholds and spatial IoU criteria.",
        shift: "**Mean Average Precision (mAP): The primary evaluation metric for object detection, calculated as the mean of Average Precision (AP) values across all object classes and spatial IoU thresholds.** Evolved from PASCAL VOC 11-point interpolation at fixed 0.50 IoU (mAP@50) to the COCO primary challenge metric averaging across 10 IoU thresholds from 0.50 to 0.95 (mAP@[.5:.95])."
      },

      num: {
        t: "Benchmark Evaluation Protocols: PASCAL VOC vs COCO mAP Standards",
        h: ["Benchmark Standard", "Primary Metric Notation", "IoU Thresholds Evaluated", "Precision-Recall Integration", "Object Scale Breakdown"],
        r: [
          ["PASCAL VOC 2007", "mAP@0.50", "Fixed at $\\text{IoU} = 0.50$", "11-point interpolation ($r \\in \\{0, 0.1, \\dots, 1.0\\}$)", "None (all scales grouped)"],
          ["PASCAL VOC 2012", "mAP@0.50", "Fixed at $\\text{IoU} = 0.50$", "All-point area under curve (AUC)", "None"],
          ["COCO Primary Challenge", "mAP@[.50:.95]", "10 steps: $0.50, 0.55, \\dots, 0.95$", "101-point interpolated AUC", "Explicitly splits $\\text{AP}_S, \\text{AP}_M, \\text{AP}_L$"],
          ["COCO Loose (PASCAL-style)", "mAP@0.50 (AP50)", "Fixed at $\\text{IoU} = 0.50$", "101-point interpolated AUC", "Useful for rough localization tasks"],
          ["COCO Strict", "mAP@0.75 (AP75)", "Strict localization at $\\text{IoU} = 0.75$", "101-point interpolated AUC", "Evaluates high-precision boundary tightness"]
        ],
        n: "To calculate Average Precision (AP) for class $c$: (1) Rank all model predictions across the entire test dataset in descending order of confidence score. (2) Each prediction is matched to the highest-IoU ground-truth box of class $c$. If $\\text{IoU} \\ge \\tau$ and that ground truth has not yet been matched, flag it as a **True Positive (TP)**; otherwise flag it as a **False Positive (FP)**. (3) Compute cumulative precision $P(k) = \\frac{\\text{TP}_k}{\\text{TP}_k + \\text{FP}_k}$ and cumulative recall $R(k) = \\frac{\\text{TP}_k}{\\text{Total Ground Truths}}$ at each rank $k$. (4) Compute the area under the interpolated Precision-Recall curve: $\\text{AP} = \\int_0^1 p_{\\text{interp}}(r) dr$, where $p_{\\text{interp}}(r) = \\max_{\\tilde{r} \\ge r} p(\\tilde{r})$. **Mean Average Precision (mAP)** averages AP across all $C$ classes: $\\text{mAP} = \\frac{1}{C} \\sum_{c=1}^C \\text{AP}_c$. Under COCO protocol, mAP is further averaged across 10 IoU thresholds $\\tau \\in [0.50, 0.95]$ with step size $0.05$."
      },

      miss: [
        {
          w: "mAP@50 and COCO mAP are directly comparable numbers.",
          r: "mAP@50 tests only loose 0.50 IoU overlap. COCO mAP@[.5:.95] averages across 10 thresholds up to strict 0.95 IoU. A detector with 75% mAP@50 typically scores only 50% to 55% on COCO mAP@[.5:.95]."
        },
        {
          w: "mAP can be computed on a single isolated image in real time.",
          r: "mAP is fundamentally a global dataset-level ranking metric. It requires ranking all candidate predictions across the entire corpus by confidence to trace the full Precision-Recall curve. Computing mAP on a single image is mathematically meaningless."
        },
        {
          w: "A higher mAP guarantees that the model has fewer false alarms in production.",
          r: "mAP integrates the area under the PR curve across all possible confidence thresholds. If a detector's curve is high at low recall but drops precipitously at high recall, deploying it with a static confidence threshold may yield excessive false alarms."
        },
        {
          w: "Duplicate detections of the same ground truth box are simply ignored in mAP.",
          r: "The COCO and VOC evaluation protocols strictly match only the first (highest confidence) prediction to a ground truth box. Every subsequent duplicate prediction overlapping that same ground truth is penalized as a **False Positive**, heavily degrading precision."
        }
      ],

      trade: {
        buys: [
          "The definitive gold-standard benchmark metric for object detection, instance segmentation, and multi-object tracking.",
          "Comprehensive evaluation combining classification confidence ranking and spatial localization tightness.",
          "COCO scale breakdowns ($\\text{AP}_S, \\text{AP}_M, \\text{AP}_L$) isolate small-object detection failure modes.",
          "Threshold-agnostic: measures the complete potential of a detector across all operational confidence settings."
        ],
        costs: [
          "Computationally intensive post-evaluation: requires running inference over the full test dataset and performing global sorting.",
          "Complex to interpret: a single mAP number hides whether failures stem from classification confusion or bounding box jitter.",
          "Does not directly specify the optimal confidence threshold for production deployment.",
          "Heavily penalized by missing ground truth annotations in imperfect test datasets."
        ],
        avoid: [
          "Never compare model papers without confirming whether they report mAP@50 or the strict COCO mAP@[.5:.95].",
          "Do not optimize production thresholding based solely on global mAP; plot class-specific Precision-Recall curves.",
          "Avoid evaluating small datasets with severe class imbalance without inspecting per-class AP breakdowns."
        ]
      }
    }

  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
