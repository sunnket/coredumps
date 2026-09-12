/* ==========================================================================
   Depth pass 91 — Computer Vision batch 2: Detectors, Segmentation & Vision Pipelines.
   YOLO, Semantic Segmentation, U-Net, Data Augmentation,
   OCR, Face Recognition, Image Preprocessing.

   Dense feature pyramid regressions drive real-time single-pass inference;
   encoder-decoder skip connections recover fine-grained spatial pixel topologies.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "yolo",

      why: {
        before: "Object detection required complex, multi-stage pipelines (R-CNN, Faster R-CNN) that first generated thousands of candidate region proposals, cropped features, and classified them sequentially, running at sluggish rates of 0.5 to 5 FPS.",
        problem: "Real-time edge applications (autonomous robotics, drone navigation, live video surveillance) require processing video feeds at 30 to 60+ FPS, which two-stage architectures could not achieve on commercial hardware.",
        shift: "**YOLO (You Only Look Once): A single-stage object detection architecture that reframes object detection as a single regression problem directly from full image pixels to bounding box coordinates and class probabilities in a single forward pass.** Introduced by Joseph Redmon et al. in 2015, YOLO revolutionized computer vision by achieving real-time inference ($>45$ FPS)."
      },

      num: {
        t: "YOLO Architectural Evolution: Generations, Innovations & COCO Benchmark",
        h: ["YOLO Generation", "Primary Architectural Innovation", "Head Type", "COCO mAP@[.5:.95]", "FPS (NVIDIA V100 / T4)"],
        r: [
          ["YOLOv1 (Redmon 2015)", "Dense $S \\times S$ grid regression", "Coupled fully connected", "13.8% (VOC: 63.4%)", "45 FPS (Titan X)"],
          ["YOLOv3 (Redmon 2018)", "Darknet-53 + Multi-scale FPN (3 scales)", "Anchor-based multi-scale", "33.0%", "~30 FPS"],
          ["YOLOv5 (Jocher 2020)", "CSPDarknet backbone + Mosaic augmentation", "Anchor-based + Auto-anchor", "50.7% (v5x)", "~45 FPS"],
          ["YOLOv7 (Wang et al. 2022)", "E-ELAN architecture + Reparameterization", "Auxiliary head coarse-to-fine", "56.8% (v7-E6)", "~36 FPS"],
          ["YOLOv8 (Ultralytics 2023)", "Anchor-free decoupled head + Task-Aligned Assigner", "Decoupled anchor-free", "53.9% (v8x)", "~60 FPS"],
          ["YOLOv10 (Wang et al. 2024)", "Consistent dual assignments (NMS-free training)", "NMS-free end-to-end", "54.4%", "~75 FPS"]
        ],
        n: "In YOLOv1, the image is partitioned into an $S \\times S$ grid (e.g., $7 \\times 7$). If an object's center falls into a grid cell, that cell is responsible for detecting it. Each cell predicts $B$ bounding boxes (each with $[x, y, w, h]$ and box confidence score $C = P(\\text{Object}) \\times \\text{IoU}$) plus $C$ conditional class probabilities $P(\\text{Class}_i \\mid \\text{Object})$. Modern YOLO architectures (v8, v9, v10) introduced three major architectural leaps: (1) **Decoupled Heads**: Separating classification and box regression branches to eliminate task conflict. (2) **Anchor-Free Detection**: Directly regressing the distance from cell centers to four bounding box edges ($[l, t, r, b]$) using Distribution Focal Loss (DFL), eliminating brittle anchor box hyperparameter clustering. (3) **Dual Label Assignment (YOLOv10)**: Training with one-to-many matching for rich gradient supervision alongside one-to-one matching, allowing NMS post-processing to be completely discarded at inference time."
      },

      miss: [
        {
          w: "YOLO detects objects by cropping out windows and evaluating them one by one.",
          r: "YOLO processes the entire image globally in a single neural network forward pass. Its convolutional feature maps preserve global contextual reasoning, allowing it to naturally reason about background context and object co-occurrences."
        },
        {
          w: "YOLO cannot detect small or tightly packed objects.",
          r: "While early YOLOv1 struggled with small objects due to coarse grid constraints ($7 \\times 7$), modern YOLO versions (v4 through v10) utilize Feature Pyramid Networks (FPN) and Path Aggregation Networks (PAN) across 3 or 4 spatial strides ($8, 16, 32, 64$), excelling at small object detection."
        },
        {
          w: "YOLO is strictly limited to 2D bounding box object detection.",
          r: "The modern YOLO framework is a multi-task vision backbone supporting Instance Segmentation (YOLO-seg), Pose Estimation / Keypoint detection (YOLO-pose), Oriented Bounding Boxes (YOLO-obb), and Classification (YOLO-cls)."
        },
        {
          w: "YOLO models require massive enterprise GPUs to run in production.",
          r: "YOLO nano and small variants (e.g., YOLOv8n, YOLOv10n with $<3\\text{M}$ parameters) execute at $>60$ FPS on Apple Silicon, Raspberry Pi 5, Intel CPUs via OpenVINO, and mobile edge NPUs via ONNX Runtime and TensorRT."
        }
      ],

      trade: {
        buys: [
          "Extreme inference velocity ($>60$ to $150+$ FPS) enabling real-time edge video processing on low-power hardware.",
          "End-to-end differentiable pipeline: trains directly on whole images, learning global contextual relationships.",
          "Mature, production-hardened developer ecosystem with native export to ONNX, TensorRT, CoreML, and OpenVINO.",
          "Versatile unified architecture spanning detection, instance segmentation, oriented bounding boxes, and pose tracking."
        ],
        costs: [
          "Extreme version fragmentation: rapid releases (v5 through v10) from competing teams create licensing and API shifts.",
          "Slightly lower localization accuracy on high-density occluded crowds compared to heavy two-stage or query-based transformers.",
          "Anchor-based legacy versions require careful k-means clustering of dataset bounding box shapes.",
          "High sensitivity to extreme aspect ratio distortions if training augmentations (Mosaic) are poorly configured."
        ],
        avoid: [
          "Never deploy legacy YOLOv1 or YOLOv2 in new production systems; modern anchor-free versions are vastly superior.",
          "Do not train YOLO on custom datasets without verifying that bounding box coordinates are correctly normalized ($0-1$).",
          "Avoid using giant YOLO-X models on mobile edge devices when YOLO-N or YOLO-S delivers equivalent operational accuracy."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "semantic-segmentation",

      why: {
        before: "Bounding box object detection provided coarse rectangular enclosures that included extensive background pixels, unable to delineate the exact irregular, organic physical boundary of objects.",
        problem: "High-precision computer vision tasks (medical tumor delineation, autonomous driving drivable-surface estimation, satellite crop mapping) require knowing the exact class identity of every individual pixel in the image.",
        shift: "**Semantic Segmentation: Classifying every single pixel in an image into a predefined semantic class category ($y_{i,j} \\in \\{1, \\dots, C\\}$).** Evolved from classical thresholding/GraphCuts to Fully Convolutional Networks (FCN, Long et al. 2015), Dilated/Atrous Convolutions (DeepLab), and Transformer SegFormers."
      },

      num: {
        t: "Semantic Segmentation Paradigms: Mean IoU (mIoU) on Cityscapes Benchmark",
        h: ["Architecture", "Spatial Recovery Mechanism", "Cityscapes mIoU (%)", "Inference Latency (GPU)", "Receptive Field Technique"],
        r: [
          ["FCN-8s (Long et al. 2015)", "Transposed convs + skip additions", "65.3%", "~150 ms", "Standard pooling downsampling"],
          ["SegNet (Badrinarayanan 2017)", "Max-pooling index unpooling", "60.1%", "~60 ms", "Encoder pooling indices transfer"],
          ["U-Net (Ronneberger 2015)", "Direct channel concatenation skips", "72.4%", "~40 ms", "Symmetric Contracting-Expanding"],
          ["DeepLabv3+ (Chen et al. 2018)", "Atrous Spatial Pyramid Pooling (ASPP)", "82.1%", "~70 ms", "Dilated / Atrous convolutions"],
          ["SegFormer-B5 (Xie et al. 2021)", "Hierarchical Vision Transformer + MLP", "84.0%", "~45 ms", "Multi-scale self-attention without ASPP"],
          ["Mask2Former (Cheng et al. 2022)", "Masked-attention query transformers", "84.5%+", "~90 ms", "Unified panoptic query formulation"]
        ],
        n: "Semantic segmentation produces a dense prediction tensor $\\hat{Y} \\in \\mathbb{R}^{H \\times W \\times C}$. The network encoder downsamples spatial dimensions (typically by a stride factor of $32$) to enlarge receptive fields and extract high-level semantic features. The decoder progressively upsamples representations back to full resolution $(H \\times W)$ using transposed convolutions or bilinear interpolation. DeepLab introduced **Atrous (Dilated) Convolutions**: $y[i] = \\sum_k x[i + r \\cdot k] w[k]$, where dilation rate $r$ expands the kernel's spatial receptive field exponentially without increasing parameter counts or losing spatial resolution. Loss optimization combines per-pixel categorical cross-entropy with **Dice Loss** to overcome severe background pixel imbalance: $\\mathcal{L}_{\\text{Dice}} = 1 - \\frac{2 \\sum_{i} y_i \\hat{y}_i + \\epsilon}{\\sum_i y_i + \\sum_i \\hat{y}_i + \\epsilon}$."
      },

      miss: [
        {
          w: "Semantic segmentation differentiates between two different people standing side by side.",
          r: "Semantic segmentation is class-aware but instance-agnostic: all pixels belonging to the class 'person' receive the identical label, merging them into a single amorphous mask. Differentiating individual people requires **Instance Segmentation** or **Panoptic Segmentation**."
        },
        {
          w: "Transposed convolutions (deconvolutions) are always superior to bilinear upsampling.",
          r: "Transposed convolutions frequently create visually jarring 'checkerboard artifacts' due to uneven overlap when kernel size is not evenly divisible by stride. Bilinear or nearest-neighbor upsampling followed by standard convolution avoids checkerboarding."
        },
        {
          w: "Pixel accuracy is a reliable evaluation metric for semantic segmentation.",
          r: "Pixel accuracy is deceptive in dense scenes (e.g., road lane markers make up $<1\%$ of pixels; predicting 'road' everywhere yields $99\%$ pixel accuracy with $0\\%$ lane marker recall). **Mean Intersection over Union (mIoU)** is the required metric."
        },
        {
          w: "Semantic segmentation models require square images and fail on rectangular inputs.",
          r: "Fully Convolutional Networks (FCNs) contain no fixed-dimension dense layers and operate natively on arbitrary input resolutions, though aspect-ratio variations can alter effective receptive field scales."
        }
      ],

      trade: {
        buys: [
          "Dense, pixel-perfect spatial semantic maps capturing exact organic contours and irregular geometries.",
          "Crucial foundation for autonomous vehicle perception (drivable free space, lane markings, sidewalks).",
          "Essential for biomedical diagnostics: cell boundary delineation, MRI organ volume quantification, tumor margins.",
          "Enables computational photography effects (portrait mode background bokeh blur, virtual green screens)."
        ],
        costs: [
          "Prohibitive annotation expense: polygon/brush labeling a single complex image requires 30 to 90 minutes of human labor.",
          "High GPU memory consumption: preserving and upsampling full-resolution feature maps strains VRAM during training.",
          "Instance blindness: merges adjacent objects of the same category into single contiguous masks.",
          "Boundary ambiguity: object edges suffer from blurring, partial volume effects, and label noise."
        ],
        avoid: [
          "Never evaluate imbalanced segmentation datasets with pixel accuracy; always compute class-averaged mIoU.",
          "Do not use semantic segmentation when your downstream task requires counting individual distinct objects; use instance segmentation.",
          "Avoid large transposed convolution kernels that introduce checkerboard artifacts into output masks."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "u-net",

      why: {
        before: "Standard convolutional networks downsampled spatial dimensions via max-pooling to learn semantic features, losing precise spatial boundary locations; upsampling back to full resolution produced blurry, low-resolution masks.",
        problem: "Biomedical image segmentation (segmenting microscopic cells, glioblastomas, retina blood vessels) requires both global contextual understanding AND exact pixel-level localization, often with only dozens of training images.",
        shift: "**U-Net: A symmetric encoder-decoder convolutional architecture featuring direct lateral skip connections that concatenate high-resolution contracting features with upsampled expanding features.** Introduced by Olaf Ronneberger et al. in 2015 for biomedical microscopy, U-Net became the foundational backbone for image segmentation and modern diffusion generative models."
      },

      num: {
        t: "U-Net Architectural Variants: Mechanism, Parameter Scales & Domain Applications",
        h: ["Variant", "Structural Modification", "Typical Parameters", "Primary Domain", "Key Advantage"],
        r: [
          ["Standard U-Net (2015)", "Symmetric 4-level encoder-decoder + concat skips", "31.0M", "Biomedical cell segmentation", "Learns from tiny datasets via elastic deformation"],
          ["Attention U-Net (2018)", "Additive attention gates on skip connections", "34.8M", "Abdominal CT / Ultrasound", "Suppresses irrelevant background skip noise"],
          ["U-Net++ (Nested 2018)", "Dense nested skip pathways + deep supervision", "36.6M", "Medical polyp / lesion segmentation", "Bridges semantic gap between encoder and decoder"],
          ["nnU-Net (Isensee 2021)", "Self-configuring heuristic framework (2D/3D)", "Variable", "Global medical challenge gold standard", "Zero manual architecture tuning"],
          ["Diffusion U-Net (DDPM)", "ResNet blocks + Cross-attention + Time embeddings", "860M (SD 1.5)", "Latent text-to-image synthesis", "Iterative score-based denoising backbones"]
        ],
        n: "The U-Net architecture comprises a **contracting path (encoder)** and an **expanding path (decoder)** forming a distinct 'U' shape. The encoder repeatedly applies two $3 \\times 3$ convolutions followed by a $2 \\times 2$ max-pooling operation (stride 2), halving spatial dimensions and doubling feature channels. The decoder repeatedly applies $2 \\times 2$ up-convolutions (transposed convs or bilinear upsampling), halving channels and doubling resolution. Crucially, at every level, **Skip Connections** copy the high-resolution feature maps from the encoder and concatenate them along the channel dimension with the corresponding upsampled decoder features: $x_{\\text{dec}}^{(l)} = [\\text{Up}(x_{\\text{dec}}^{(l+1)}); x_{\\text{enc}}^{(l)}]$. This allows the network to combine fine-grained spatial edge coordinates directly with deep abstract semantic features, completely bypassing the spatial information bottleneck."
      },

      miss: [
        {
          w: "U-Net can only be used for biomedical cell microscopy images.",
          r: "U-Net is an architectural topology widely adopted across satellite remote sensing, industrial defect inspection, autonomous driving depth estimation, video matting, and as the core denoising backbone in Latent Diffusion Models (Stable Diffusion)."
        },
        {
          w: "Skip connections in U-Net simply add features together like ResNet residual blocks.",
          r: "U-Net skip connections **concatenate** feature maps along the channel axis (e.g., merging 64 encoder channels and 64 decoder channels into 128 channels), preserving distinct spatial representations rather than performing element-wise summation."
        },
        {
          w: "U-Net requires tens of thousands of annotated training images to converge.",
          r: "Ronneberger et al. originally trained U-Net on only 30 microscopy images by leveraging aggressive **elastic deformation** data augmentation, which simulated realistic biological tissue stretching and microscopic shear."
        },
        {
          w: "3D U-Net is simply running standard 2D U-Net slice-by-slice across CT/MRI volumes.",
          r: "3D U-Net uses true 3D volumetric convolutions ($3 \\times 3 \\times 3$ kernels) and 3D max-pooling, directly learning spatial continuity and anatomical correlations across z-axis slice dimensions."
        }
      ],

      trade: {
        buys: [
          "Unmatched precision in recovering fine boundaries and microscopic details thanks to direct lateral skip connections.",
          "High data efficiency: learns robust representations from small training datasets ($< 100$ annotated samples).",
          "Flexible, symmetrical topology easily adapted with modern backbones (ResNet, EfficientNet, ConvNeXt encoders).",
          "Serves as the proven workhorse architecture powering modern continuous score-based diffusion models."
        ],
        costs: [
          "High memory consumption during backpropagation: storing full-resolution skip connection activations strains GPU VRAM.",
          "Semantic gap: early encoder features are low-level and noisy, potentially introducing texture noise into decoder stages.",
          "Vanilla U-Net lacks global contextual attention across distant pixels (resolved by Attention U-Net or SegFormer).",
          "Slow inference when scaled to large 3D volumetric medical scans without memory-efficient tiling."
        ],
        avoid: [
          "Never train U-Net on small biological datasets without extensive elastic and affine data augmentations.",
          "Do not use naive transposed convolutions if checkerboard artifacts appear in segmented masks; switch to bilinear upsampling.",
          "Avoid using standard 2D U-Net on anisotropic 3D medical scans where z-axis slice thickness diverges from x-y resolution."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "data-augmentation",

      why: {
        before: "Computer vision models trained on limited image datasets severely overfitted to training backgrounds, camera angles, and lighting conditions, collapsing when deployed to real-world cameras.",
        problem: "Collecting and hand-annotating hundreds of thousands of diverse images is prohibitively expensive and time-consuming, yet deep neural networks require massive data variety to generalize.",
        shift: "**Data Augmentation: Artificially expanding the size and diversity of a training dataset by applying label-preserving transformations, synthetic perturbations, and image mixtures.** Evolved from basic flips and crops to advanced stochastic policies (AutoAugment, RandAugment) and multi-image blending (Mixup, CutMix, Mosaic)."
      },

      num: {
        t: "Data Augmentation Strategies: Mechanisms, Regularization & ImageNet Top-1 Gains",
        h: ["Strategy / Method", "Transformation Mechanism", "Labels Modified?", "ImageNet Top-1 Gain", "Compute Overhead"],
        r: [
          ["Standard Baseline", "Random crop, horizontal flip, color jitter", "No (discrete label preserved)", "Baseline (76.1% ResNet-50)", "Negligible (on-the-fly CPU)"],
          ["AutoAugment (Cubuk 2018)", "Reinforcement learning searched policy", "No", "+1.5%", "High (thousands of search hours)"],
          ["RandAugment (Cubuk 2020)", "Random selection from $N$ transforms with magnitude $M$", "No", "+1.6%", "Zero search cost"],
          ["Mixup (Zhang et al. 2017)", "Linear pixel blend: $\\tilde{x} = \\lambda x_i + (1-\\lambda) x_j$", "Yes (soft labels $\\tilde{y} = \\lambda y_i + (1-\\lambda) y_j$)", "+1.5%", "Negligible"],
          ["CutMix (Yun et al. 2019)", "Patches cut and pasted between images", "Yes (labels proportional to patch area)", "+2.3%", "Negligible"],
          ["Mosaic (YOLOv4 / v5)", "Stitches 4 training images into one frame", "No (bounding box coordinates transformed)", "Massive boost on small objects", "Low"]
        ],
        n: "Data augmentation acts as an explicit prior regularizer that enforces domain invariance directly into network weights. Basic geometric operations (translations, rotations, reflections) encode Euclidean group symmetries ($SE(2)$ invariance). **Mixup** regularizes models by enforcing linear behavior between training examples: $\\tilde{x} = \\lambda x_i + (1 - \\lambda) x_j$ and $\\tilde{y} = \\lambda y_i + (1 - \\lambda) y_j$, where $\\lambda \\sim \\text{Beta}(\\alpha, \\alpha)$. This prevents the network from assigning extreme overconfident predictions outside training clusters. **CutMix** replaces a spatial bounding region with a patch from another image, forcing the model to identify objects from partial cues and preventing over-reliance on a single dominant visual feature."
      },

      miss: [
        {
          w: "All data augmentation transformations preserve the ground truth label.",
          r: "Transformations must respect domain physics: horizontally flipping an image of a dog preserves the 'dog' label, but flipping an image of the digit '6' turns it into a '9' (corrupting labels in MNIST or OCR), and flipping a medical chest X-ray creates artificial situs inversus."
        },
        {
          w: "Data augmentation should be applied during both training and inference.",
          r: "Standard data augmentation is applied exclusively during training to regularize gradients. Applying random rotations during inference degrades test accuracy, unless structured as Test-Time Augmentation (TTA), which averages predictions across deterministic views."
        },
        {
          w: "Data augmentation requires saving millions of transformed images to disk before training.",
          r: "Augmentations are applied dynamically on-the-fly in RAM/GPU memory during training batch collation (via PyTorch DataLoader or Albumentations), incurring zero persistent disk storage overhead."
        },
        {
          w: "More aggressive augmentation always leads to better model performance.",
          r: "Overly severe augmentations (extreme solarization, heavy blur, or excessive CutMix occlusion) can destroy critical semantic features, rendering images unlearnable and underfitting the model."
        }
      ],

      trade: {
        buys: [
          "Dramatically reduces overfitting, acting as one of the most effective regularizers in deep learning.",
          "Multiplies effective dataset diversity by $10\\times$ to $100\\times$ without spending additional annotation budget.",
          "Mosaic and CutMix force object detectors to learn context-independent, partially occluded feature representations.",
          "Significantly improves out-of-distribution robustness against sensor noise, weather, and camera angle shifts."
        ],
        costs: [
          "Increases training convergence time: heavily augmented datasets require more training epochs to reach loss minimums.",
          "DataLoader CPU preprocessing bottleneck: complex CPU augmentations can starve fast GPUs of training batches.",
          "Bounding box and segmentation mask augmentations require complex synchronized coordinate transformations.",
          "Requires careful hyperparameter tuning (selecting magnitude $M$ and transform subsets suitable for the specific domain)."
        ],
        avoid: [
          "Never apply horizontal flips to OCR, text detection, or asymmetric medical imaging datasets.",
          "Do not forget to apply identical geometric transformations to ground-truth bounding boxes and segmentation masks.",
          "Avoid running heavy CPU-bound augmentations in Python without multi-process DataLoader workers or GPU libraries (Kornia)."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "ocr",

      why: {
        before: "Extracting text from scanned paper invoices, books, and receipts required manual typing, creating massive corporate administrative backlogs and high data-entry error rates.",
        problem: "Document text appears in diverse fonts, handwriting, resolutions, page skews, folds, watermarks, and complex multi-column tabular layouts that simple template matching cannot parse.",
        shift: "**Optical Character Recognition (OCR): The computational conversion of images of typed, handwritten, or printed text into machine-encoded text.** Advanced from classical feature matchers (Tesseract) to deep neural pipelines (CRNN + CTC, DBNet + SVTR, TrOCR) and Vision-Language Document Models (Donut, Nougat)."
      },

      num: {
        t: "OCR Paradigms: Architectures, Scene Text Accuracy & Inference Latency",
        h: ["Paradigm", "Representative System", "Pipeline Architecture", "Word Recognition Accuracy", "Handling Complex Layouts"],
        r: [
          ["Classical Pipeline", "Tesseract 3 (Ostroff 1985–2006)", "Binarization + Contour segmentation + Classifier", "~72.0%", "Brittle (fails on multi-column / skews)"],
          ["Recurrent Hybrid", "Tesseract 4 / CRNN (Shi 2016)", "CNN feature extractor + BiLSTM + CTC loss", "~84.5%", "Requires separate layout detector"],
          ["Modern Industrial Pipeline", "PaddleOCR (PP-OCRv4)", "DBNet (Detection) + SVTR (Recognition)", "~94.8%", "Multi-stage: Layout $\\rightarrow$ Detection $\\rightarrow$ Rec"],
          ["Transformer Encoder-Decoder", "TrOCR (Li et al. 2021)", "ViT image encoder + RoBERTa text decoder", "~96.2%", "Word/line level recognition only"],
          ["End-to-End Document VLM", "Nougat / Donut (Kim 2022)", "Swin Transformer + mBART (OCR-free)", "~97.5%", "Direct image-to-Markdown / JSON mapping"]
        ],
        n: "Modern OCR operates via a two-stage or end-to-end framework: (1) **Text Detection**: Detecting arbitrary-shaped text bounding boxes or polygons in the image. Algorithms like **DBNet (Differentiable Binarization)** use a FCN to predict probability and threshold maps, inserting a differentiable step function to extract precise text boundaries. (2) **Text Recognition**: Transcribing cropped text line images into character strings. In the landmark **CRNN (Convolutional Recurrent Neural Network)** architecture, a CNN extracts visual feature sequences, a deep BiLSTM models character sequence dependencies, and a **CTC (Connectionist Temporal Classification)** layer aligns speech/text frames without character-level segmentation. Recent models (TrOCR, Donut) treat OCR as an image-to-text sequence-to-sequence translation task, directly generating formatted Markdown or structured JSON."
      },

      miss: [
        {
          w: "OCR and Document Information Extraction are the exact same task.",
          r: "OCR simply extracts raw strings of characters and coordinates. Converting those strings into structured, validated business data (e.g., mapping a text snippet to 'Total Amount Due: $450.00' in an ERP) requires Document AI, layout analysis, and entity extraction."
        },
        {
          w: "Tesseract OCR works out-of-the-box on noisy smartphone photos of receipts.",
          r: "Tesseract was optimized for high-contrast, flatbed 300 DPI document scans. On noisy smartphone photos with shadows, perspective skew, and folds, Tesseract accuracy plummets unless preceded by aggressive deskewing and adaptive thresholding."
        },
        {
          w: "OCR models segment and recognize each letter one by one like a human reading slowly.",
          r: "Modern OCR models transcribe entire words or lines simultaneously using CTC or attention decoders, recognizing global word shape and character context rather than chopping letters into isolated boxes."
        },
        {
          w: "Character Error Rate (CER) and Word Error Rate (WER) measure the same errors.",
          r: "A single wrong letter in a 10-letter word yields a low 10% CER but a devastating 100% WER. In downstream financial or medical workflows, a 1-character typo in a dosage or serial number completely breaks operations."
        }
      ],

      trade: {
        buys: [
          "Digitizes trillions of legacy paper documents, contracts, medical records, and receipts into searchable text.",
          "Enables automated Robotic Process Automation (RPA) for accounts payable, customs clearance, and KYC identity verification.",
          "Powers scene text reading for visually impaired accessibility and autonomous driving road sign comprehension.",
          "Lightweight models (PaddleOCR) run in under 20ms on mobile edge devices for instant camera translation."
        ],
        costs: [
          "Vulnerable to environmental degradation: camera glare, motion blur, crumpled paper, and low resolution cause character drops.",
          "Struggles with handwriting (HTR), historical cursive calligraphy, and dense overlapping tabular layouts.",
          "High compute overhead when executing heavy Vision-Language Transformer models on multi-page PDF documents.",
          "Error propagation: downstream LLMs or NLP parsers fail if OCR misrecognizes critical digits or punctuation."
        ],
        avoid: [
          "Never pass raw, un-deskewed, un-thresholded phone photos directly into Tesseract without image preprocessing.",
          "Do not use character segmentation for cursive or connected script languages (Arabic, Hindi); use CTC or attention decoders.",
          "Avoid evaluating financial document OCR on CER alone; measure exact field-level extraction accuracy."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "face-recognition",

      why: {
        before: "Identity verification required physical ID cards, passports, or manual human facial comparison at border checkpoints, which was slow, subject to human fatigue, and easily forged.",
        problem: "Human faces undergo continuous variations in facial expression, aging, pose angle, facial hair, glasses, and lighting, making exact pixel matching impossible.",
        shift: "**Face Recognition: Biometric verification (1:1) or identification (1:N) of an individual based on mathematical representations of their facial features.** Evolved from Eigenfaces (PCA) and Fisherfaces (LDA) to deep metric learning using Siamese Triplet Loss (FaceNet) and Additive Angular Margin Loss (ArcFace)."
      },

      num: {
        t: "Face Recognition Paradigms: Loss Functions & LFW Benchmark Verification Accuracy",
        h: ["Methodology / Loss", "Mathematical Mechanism", "LFW Verification Accuracy", "Metric Space", "Angular Margin"],
        r: [
          ["Eigenfaces (Turk & Pentland 1991)", "Principal Component Analysis (PCA)", "60.0 – 70.0%", "Euclidean eigenspace", "None"],
          ["Softmax Cross-Entropy (DeepFace)", "Standard multi-class classification head", "97.35%", "Euclidean feature space", "No explicit metric constraint"],
          ["Triplet Loss (FaceNet 2015)", "$\\|f(a) - f(p)\\|^2 + \\alpha < \\|f(a) - f(n)\\|^2$", "99.63%", "Euclidean unit hypersphere", "Euclidean margin $\\alpha$"],
          ["SphereFace (Liu et al. 2017)", "Multiplicative angular margin $\\cos(m\\theta)$", "99.42%", "Hyperspherical manifold", "Angular margin $m$"],
          ["ArcFace (Deng et al. 2019)", "Additive angular margin $\\cos(\\theta + m)$", "99.83%", "Geodesic hypersphere ($S^{d-1}$)", "Exact geodesic margin $m=0.5$"]
        ],
        n: "Face recognition is fundamentally an **open-set metric learning** problem: the identities evaluated during deployment are never present in the training set. A deep convolutional network (e.g., ResNet-100) maps an aligned facial crop into a compact normalized embedding vector $x \\in \\mathbb{R}^{512}$ with $\\|x\\|_2 = 1$. The state-of-the-art loss function is **ArcFace (Additive Angular Margin Loss)**: $\\mathcal{L} = -\\log \\frac{\\exp(s \\cos(\\theta_{y_i} + m))}{\\exp(s \\cos(\\theta_{y_i} + m)) + \\sum_{j \\ne y_i} \\exp(s \\cos \\theta_j)}$, where $s$ is the hypersphere radius scale and $m$ is the additive angular margin penalty. By penalizing the geodesic angle $\\theta$ directly on the unit hypersphere, ArcFace simultaneously maximizes intra-class compactness and inter-class discrepancy, ensuring that embeddings of the same person cluster tightly together while embeddings of different people are pushed far apart."
      },

      miss: [
        {
          w: "Face Recognition and Face Detection are the exact same computer vision task.",
          r: "Face Detection (e.g., RetinaFace, MTCNN) merely locates where a human face exists in an image with a bounding box. Face Recognition extracts the identity embedding vector from that cropped face and matches it against a biometric database."
        },
        {
          w: "Face recognition stores actual photos of people's faces inside the security database.",
          r: "Production systems never store raw photos; they store encrypted, non-invertible 512-dimensional floating-point embedding vectors (biometric templates) representing facial geometry coordinates."
        },
        {
          w: "Face recognition models trained with standard Softmax classification generalize seamlessly to new people.",
          r: "Standard Softmax loss learns separable features, not discriminative metric features. It works for closed-set classification of training individuals, but fails completely when computing cosine distances between novel unseen faces unless trained with angular margin losses (ArcFace)."
        },
        {
          w: "A 2D camera photograph is sufficient for secure biometric authentication.",
          r: "A 2D photo is highly vulnerable to presentation attacks (holding up an iPad photo or printed paper mask). Secure production systems mandate **Liveness Detection** (anti-spoofing) using infrared sensors, 3D structured light, or blink/motion challenges."
        }
      ],

      trade: {
        buys: [
          "Frictionless, instantaneous biometric authentication: unlocks devices and verifies identities in $< 50$ ms.",
          "High 1:1 verification accuracy ($> 99.8\\%$) on global benchmarks, surpassing human visual inspection capabilities.",
          "Compact representation: compresses complex facial identity down to a 512-float vector (2 KB per identity).",
          "Ultra-fast 1:N search: querying a face against 10 million templates takes milliseconds using FAISS vector search."
        ],
        costs: [
          "Severe privacy, surveillance, and civil liberties concerns regarding unconsented public tracking.",
          "Susceptible to demographic bias: lower accuracy and higher false match rates on marginalized demographic groups if datasets are skewed.",
          "Presentation attack vulnerability: requires dedicated hardware and anti-spoofing neural models to detect spoofing.",
          "Biometric theft risk: unlike a password, a compromised facial biometric cannot be reset or changed."
        ],
        avoid: [
          "Never deploy facial recognition for authentication without certified presentation attack (anti-spoofing) liveness detection.",
          "Do not train face recognition models with vanilla Softmax cross-entropy; use ArcFace or CosFace.",
          "Avoid matching un-aligned facial crops; always align faces using 5 facial landmarks (eyes, nose, mouth corners) before embedding."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "image-preprocessing",

      why: {
        before: "Passing raw camera sensor images directly into computer vision models resulted in training instability, exploding gradients, and severe distribution drift across different camera hardware.",
        problem: "Raw digital photos have variable dimensions, disparate color channel orders (RGB vs BGR), non-standardized brightness distributions ($0-255$), and sensor noise that derail mathematical neural optimizers.",
        shift: "**Image Preprocessing: The deterministic transformation, resizing, normalization, and filtering of raw visual inputs into standardized mathematical tensors required by vision models.** Encompasses aspect-preserving resizing (letterboxing), color space standardization, dynamic range scaling, and z-score standardization."
      },

      num: {
        t: "Standard Preprocessing Operations Across Computer Vision Ecosystems",
        h: ["Preprocessing Stage", "Operation / Formula", "Target Dimension / Range", "Ecosystem Standard", "Failure Mode if Omitted"],
        r: [
          ["Channel Ordering", "BGR $\\leftrightarrow$ RGB swap", "$H \\times W \\times 3$", "OpenCV (BGR) vs PyTorch (RGB)", "Color inversion (skin tones render blue)"],
          ["Dimension Standardization", "Bilinear / Bicubic resize + Letterbox", "$224 \\times 224$ or $640 \\times 640$", "Standard model backbones", "Shape mismatch error or aspect ratio squishing"],
          ["Value Scaling", "$x / 255.0$", "$[0.0, 1.0]$ float32", "Universal neural input", "Gradient explosion with uint8 values"],
          ["Z-Score Standardization", "$\\frac{x - \\mu}{\\sigma}$ (ImageNet stats)", "Mean 0, Std 1 ($\\mu=[.485,.456,.406]$)", "PyTorch Torchvision models", "Massive accuracy degradation on pre-trained weights"],
          ["Tensor Transposition", "$H \\times W \\times C \\rightarrow C \\times H \\times W$", "$3 \\times H \\times W$", "PyTorch / ONNX (NCHW layout)", "Stride memory layout corruption"]
        ],
        n: "Image preprocessing bridges the gap between raw hardware frame captures and mathematical tensor inputs. In production object detection (e.g., YOLO), resizing an arbitrary $1920 \\times 1080$ rectangular image to a square $640 \\times 640$ model input by simple stretching destroys geometric aspect ratios, warping circular road signs into ovals and degrading detection accuracy. Industry practice employs **Letterboxing**: scaling the image uniformly to fit within the bounding canvas while maintaining aspect ratio, padding the remaining borders with a neutral gray value ($114$). Furthermore, pre-trained models require exact **Z-score normalization**: $x_{\\text{norm}} = \\frac{x - \\mu}{\\sigma}$, utilizing the exact channel-wise mean $\\mu = [0.485, 0.456, 0.406]$ and standard deviation $\\sigma = [0.229, 0.224, 0.225]$ calculated over ImageNet-1K."
      },

      miss: [
        {
          w: "Image preprocessing and Data Augmentation are identical concepts.",
          r: "Preprocessing is **deterministic** and applied identically to both training and test images (resizing, RGB conversion, ImageNet normalization). Data Augmentation is **stochastic** and applied exclusively during training to artificially expand dataset variance."
        },
        {
          w: "OpenCV and PIL load images with identical color channel conventions.",
          r: "OpenCV loads images in **BGR** order by default, whereas PIL and PyTorch expect **RGB**. Passing an OpenCV BGR image into a PyTorch model inverts red and blue channels, severely degrading model inference accuracy."
        },
        {
          w: "Simple geometric resizing (stretching) does not hurt neural network accuracy.",
          r: "Stretching non-square images distorts the aspect ratio of objects, turning pedestrians thin or vehicles squat. The model's learned spatial filters fail on distorted aspect ratios; aspect-preserving letterboxing is mandatory."
        },
        {
          w: "Normalizing pixel values from $[0, 255]$ to $[0.0, 1.0]$ is all the normalization a model needs.",
          r: "Pre-trained vision models (ResNet, ViT, EfficientNet) were trained on zero-centered data with unit variance. Bypassing ImageNet mean/std z-score normalization causes substantial drops in inference accuracy (often $>15\\%$ accuracy loss)."
        }
      ],

      trade: {
        buys: [
          "Guarantees numerical stability: transforms heterogeneous camera inputs into standardized, zero-centered tensors.",
          "Preserves aspect ratio fidelity via letterboxing, preventing geometric distortion of real-world objects.",
          "Ensures flawless inference compatibility with pre-trained weights from torchvision and Hugging Face.",
          "Reduces downstream computational complexity by eliminating extraneous high-frequency sensor noise."
        ],
        costs: [
          "Introduces inference preprocessing latency (CPU color conversions and bilinear interpolations take 2 to 8 ms).",
          "Letterbox padding introduces synthetic grey borders that the neural network must process as dead space.",
          "Loss of fine resolution: downsampling a $4K$ medical scan to $224 \\times 224$ discards crucial microscopic diagnostic details.",
          "Requires strict maintenance across deployment platforms (C++, Python, mobile) to ensure mathematical parity."
        ],
        avoid: [
          "Never pass OpenCV-loaded images to a PyTorch model without running `cv2.cvtColor(img, cv2.COLOR_BGR2RGB)`.",
          "Do not stretch non-square images to square dimensions for object detection; always use aspect-preserving letterboxing.",
          "Avoid hardcoding different normalization constants between training and production inference pipelines."
        ]
      }
    }

  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
