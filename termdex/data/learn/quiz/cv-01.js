/* Computer Vision — question bank.

   Written against the failure modes the track teaches rather than the
   definitions it states, because a reader who can recite what IoU is and
   still cannot say why their boxes land in the wrong place has not learned
   the useful half.

   Every distractor here is somebody's real mistake: BGR versus RGB, averaging
   a segmentation mask during a resize, comparing mAP figures at different IoU
   thresholds, benchmarking CUDA without synchronising. Getting one of those
   wrong is information rather than noise, which is what the hardcore level is
   for in this app. */

/* ===================================================================
   Module: pixels — what an image actually is
   =================================================================== */

TD.addMCQ("cv", "pixels", [
  {
    "tag": "Array shape conventions",
    "lvl": "core",
    "q": "`cv2.imread` returns an array whose `.shape` is `(1080, 1920, 3)`. What is the width of this image, and how would you index the pixel 100 across and 50 down?",
    "o": [
      "Width 1080; index `img[100, 50]`",
      "Width 1920; index `img[50, 100]`",
      "Width 1920; index `img[100, 50]`",
      "Width 3; index `img[1080, 1920]`"
    ],
    "a": 1,
    "x": "The shape is (height, width, channels), so the width is 1920. Indexing follows the same order — row first, then column — so a pixel 100 across and 50 down is `img[50, 100]`. Every image tool describes pictures as width×height, which is the reverse, and that inversion causes a great many squashed or crashing pipelines."
  },
  {
    "tag": "The BGR trap",
    "lvl": "core",
    "q": "You load a photograph with OpenCV and display it with `plt.imshow(img)`. Skin tones appear blue and the sky appears orange. What has happened?",
    "o": [
      "The image file is corrupted",
      "OpenCV loads channels as BGR while matplotlib expects RGB, so the red and blue channels are swapped",
      "The image needs normalising before display",
      "matplotlib cannot display uint8 arrays"
    ],
    "a": 1,
    "x": "OpenCV has used BGR channel order since 2000 for historical hardware reasons, and almost everything else uses RGB. Convert with `cv2.cvtColor(img, cv2.COLOR_BGR2RGB)` at the boundary where the image leaves OpenCV. Nothing errors — the colours are simply wrong."
  },
  {
    "tag": "Integer overflow when brightening",
    "lvl": "intermediate",
    "q": "You brighten a uint8 image with `img + 50` and the brightest areas turn black. Why, and what is the fix?",
    "o": [
      "The image was already saturated; use a smaller increment",
      "uint8 arithmetic wraps around, so 220 + 50 becomes 14; use `cv2.add`, which saturates at 255",
      "NumPy cannot add scalars to image arrays",
      "The array needs converting to float before display"
    ],
    "a": 1,
    "x": "Unsigned 8-bit integers wrap on overflow: 220 + 50 = 270, which is 14 modulo 256. `cv2.add` clips at 255 instead of wrapping. This is the same class of bug as computing gradients into a uint8 array, where negative values clip to zero and one side of every edge disappears."
  },
  {
    "tag": "Interpolation for masks",
    "lvl": "advanced",
    "q": "You resize a segmentation mask containing class ids 0, 1 and 3 using the default interpolation and later find pixels labelled 2. What happened?",
    "o": [
      "The model predicted class 2 during resizing",
      "Bilinear interpolation averaged neighbouring label values, inventing a class that was never present; masks require INTER_NEAREST",
      "The mask was saved in the wrong dtype",
      "Class ids must always be consecutive"
    ],
    "a": 1,
    "x": "Interpolation averages. Averaging label 1 and label 3 gives label 2 — a class that does not exist in your data. Label maps and masks must be resized with `INTER_NEAREST`, which copies the nearest value and never averages. The image and its mask therefore need different interpolation, which is exactly the asymmetry people forget."
  },
  {
    "tag": "Normalisation constants",
    "lvl": "intermediate",
    "q": "A pretrained torchvision model produces confident nonsense on obviously valid images. The weights loaded without error. What is the most likely cause?",
    "o": [
      "The model needs retraining on your data",
      "The input was not normalised with the statistics the model was trained on, so it is receiving a distribution it has never seen",
      "The model requires a GPU to produce correct output",
      "The batch size is too small"
    ],
    "a": 1,
    "x": "Pretrained vision models expect inputs normalised with the ImageNet channel means and standard deviations. Feed them 0–255 values, or the wrong statistics, and the weights are fine while the input distribution is wrong. Use the weights' own `transforms()` so preprocessing matches training exactly."
  },
  {
    "tag": "Letterboxing versus squashing",
    "lvl": "intermediate",
    "q": "Why is naive `cv2.resize` to a square particularly damaging for object detection, compared with classification?",
    "o": [
      "Detection models cannot accept square inputs",
      "Distorting the aspect ratio distorts the objects and their boxes, and the box coordinates must be transformed identically — so letterboxing preserves shape and the mapping back",
      "Resizing removes the colour information detectors rely on",
      "Detection requires the original resolution to be preserved exactly"
    ],
    "a": 1,
    "x": "A classifier can often learn around consistent distortion. A detector must return coordinates that map back onto the original photograph, and a squashed object produces a squashed box. YOLO letterboxes — scale by the longer side, then pad — and returns the scale and offsets so the transform can be inverted."
  }
]);

/* ===================================================================
   Module: classic — classical vision
   =================================================================== */

TD.addMCQ("cv", "classic", [
  {
    "tag": "Edge detection is subtraction",
    "lvl": "core",
    "q": "The Sobel X kernel is `[-1 0 1; -2 0 2; -1 0 1]`. In one sentence, what does it compute and why does that find edges?",
    "o": [
      "It averages the neighbourhood, so flat regions become bright",
      "It subtracts the pixels on the left from those on the right, giving zero on flat regions and a large value where brightness changes sharply",
      "It counts how many neighbours exceed a threshold",
      "It measures the variance of the 3×3 patch"
    ],
    "a": 1,
    "x": "Edge detection is subtraction. Where the image is flat, left and right are equal and the difference is zero; at a vertical edge the difference is large. Every classical edge detector is this idea with different weights, and it is the same convolution operation a neural network later learns rather than being given."
  },
  {
    "tag": "Gradient dtype",
    "lvl": "advanced",
    "q": "You compute Sobel gradients into a `uint8` array and find that edges appear on only one side of each object. Why?",
    "o": [
      "The kernel size is too small for the image",
      "Gradients are signed — a light-to-dark edge is negative — and unsigned integers clip negatives to zero, erasing half the edges",
      "Sobel only detects edges in one direction by design",
      "The image needed blurring first"
    ],
    "a": 1,
    "x": "A dark-to-light transition gives a positive gradient and light-to-dark gives a negative one. uint8 cannot represent the negative half, so it clips to zero and one side of every object vanishes. Compute into `cv2.CV_64F` and then take the absolute value."
  },
  {
    "tag": "Blur before edges",
    "lvl": "core",
    "q": "Why is a Gaussian blur applied before edge detection in essentially every pipeline?",
    "o": [
      "To make the image smaller and the detection faster",
      "Noise is itself a sharp local change, so an edge detector cannot distinguish it from a real edge; blurring removes it first",
      "Edge detectors require a floating-point input",
      "Blurring increases the contrast of real edges"
    ],
    "a": 1,
    "x": "An edge detector responds to sharp changes, and sensor noise is exactly that at the pixel scale. Without a blur you get an edge map dominated by speckle. This is why Canny includes a Gaussian stage internally."
  },
  {
    "tag": "When classical beats learned",
    "lvl": "intermediate",
    "q": "A factory needs to count identical bright components on a dark conveyor under fixed lighting, running on a small embedded board. What should you try first?",
    "o": [
      "Fine-tune a YOLO detector on a few thousand labelled frames",
      "Threshold, find contours, and filter by area — exact, free of training data, and fast enough for a microcontroller",
      "Train a CNN classifier from scratch on cropped components",
      "Use CLIP zero-shot with the prompt 'a photo of a component'"
    ],
    "a": 1,
    "x": "Controlled lighting and known objects is precisely where classical vision wins: no training data, deterministic behaviour, debuggable line by line, and it runs on hardware costing a couple of dollars. Reaching for a network here is the same category of mistake as training a model to decide whether a number is even."
  },
  {
    "tag": "Lowe's ratio test",
    "lvl": "advanced",
    "q": "In feature matching, why is each descriptor's *two* nearest neighbours retrieved rather than just one?",
    "o": [
      "To double the number of matches available for fitting",
      "So a match can be rejected when its best candidate is not clearly better than its second — an ambiguous patch produces two near-equal matches and either could be wrong",
      "Because RANSAC requires pairs of matches as input",
      "To allow matching in both directions between the images"
    ],
    "a": 1,
    "x": "Lowe's ratio test keeps a match only when the best distance is under about 75% of the second-best. Repeated structures — windows on a building, carpet texture — produce several equally good candidates, and a match chosen among them is a coin flip. One extra comparison discards most bad matches."
  },
  {
    "tag": "RANSAC",
    "lvl": "advanced",
    "q": "What problem does RANSAC solve when fitting a homography from feature matches, that least-squares fitting does not?",
    "o": [
      "It is faster on large numbers of matches",
      "It tolerates outliers: a few catastrophically wrong matches cannot drag the fit, because it keeps the model that the most points agree with",
      "It removes the need for the ratio test",
      "It produces sub-pixel accurate keypoint positions"
    ],
    "a": 1,
    "x": "Least-squares lets a single wrong match distort the whole transform, because it minimises total squared error and an outlier contributes enormously. RANSAC repeatedly fits to random minimal subsets and keeps the fit with the most inliers. Always check the inlier count — a low count means no answer, not a rough one."
  }
]);

/* ===================================================================
   Module: cnn — convolutional networks
   =================================================================== */

TD.addMCQ("cv", "cnn", [
  {
    "tag": "Why not a dense layer",
    "lvl": "core",
    "q": "A fully connected layer with 1,000 neurons applied to a 224×224×3 image needs roughly how many parameters, and what is the second, deeper problem with it?",
    "o": [
      "About 150,000 — and it trains too slowly",
      "About 150 million — and it has no notion that neighbouring pixels are related, so shuffling all pixels identically would not affect what it learns",
      "About 1.5 million — and it cannot handle colour images",
      "About 15 million — and it requires a fixed batch size"
    ],
    "a": 1,
    "x": "224 × 224 × 3 × 1000 is 150,528,000 parameters for a single layer. The deeper problem is that spatial structure is discarded entirely: to that layer, adjacent pixels are simply two arbitrary inputs. Convolution fixes both at once."
  },
  {
    "tag": "The output size formula",
    "lvl": "intermediate",
    "q": "An input of 224, a 3×3 kernel, padding 1 and stride 2 produces what output size?",
    "o": ["224", "112", "111", "56"],
    "a": 1,
    "x": "out = (in − kernel + 2·padding) / stride + 1 = (224 − 3 + 2) / 2 + 1 = 112. Padding 1 with a 3×3 kernel and stride 1 preserves the size, which is why that combination is everywhere; stride 2 halves it, which is how networks shrink the image as they deepen."
  },
  {
    "tag": "Two 3×3 versus one 5×5",
    "lvl": "advanced",
    "q": "Why did 3×3 become the near-universal kernel size after VGG, rather than larger kernels?",
    "o": [
      "Larger kernels cannot be implemented efficiently on a GPU",
      "Two stacked 3×3 layers cover the same 5×5 receptive field with fewer parameters and add an extra non-linearity",
      "3×3 is the largest kernel that preserves image size with padding",
      "Larger kernels produce checkerboard artefacts"
    ],
    "a": 1,
    "x": "Two 3×3 layers over 64 channels use about 74,000 parameters against 102,000 for one 5×5, reach the same 5×5 receptive field, and interleave two ReLUs rather than one. More expressive, cheaper, and it composes — which is why depth became the lever."
  },
  {
    "tag": "Residual connections",
    "lvl": "advanced",
    "q": "Networks deeper than about twenty layers trained *worse* than shallower ones — including on the training set. What did residual connections fix?",
    "o": [
      "Overfitting, by regularising the deeper layers",
      "Vanishing gradients: the addition gives gradients an unmultiplied path back, and the block only has to learn the difference from its input",
      "Memory usage, by reusing activations between layers",
      "The need for batch normalisation in very deep networks"
    ],
    "a": 1,
    "x": "The training error being worse rules out overfitting — the deep network was failing to learn at all, because gradients multiplied down to nothing through many layers. `out + identity` provides a direct path for the gradient, and lets a block that has nothing to add output zero and pass its input through untouched."
  },
  {
    "tag": "Max pooling",
    "lvl": "intermediate",
    "q": "Why does max pooling keep the largest value in each patch rather than the average, and why are newer architectures replacing it with stride-2 convolutions?",
    "o": [
      "Maximum is faster to compute; strided convolutions are simply more fashionable",
      "A large value means a filter fired strongly there, so the strongest evidence is preserved rather than diluted — and a strided convolution learns how to shrink instead of always taking the maximum",
      "Averaging would produce negative values that break ReLU",
      "Max pooling preserves the spatial dimensions that averaging destroys"
    ],
    "a": 1,
    "x": "In a feature map, a large activation means the filter detected its pattern strongly at that position; averaging it with three quiet neighbours dilutes exactly the signal you want. Pooling is not wrong — it is a fixed rule where a learned one is now available, which is why stride-2 convolutions increasingly replace it."
  },
  {
    "tag": "Transfer learning order",
    "lvl": "advanced",
    "q": "You unfreeze a pretrained backbone and fine-tune immediately at 1e-3 alongside a freshly initialised head. Accuracy ends up worse than the frozen-backbone baseline. Why?",
    "o": [
      "The learning rate was too low for the backbone to adapt",
      "The random head produced large meaningless gradients that flowed back and destroyed pretrained features in the first few batches",
      "Fine-tuning requires more data than feature extraction and the dataset was too small",
      "Batch normalisation statistics cannot be updated during fine-tuning"
    ],
    "a": 1,
    "x": "Train the head first with everything frozen, then unfreeze at around 1e-5. A randomly initialised head generates large gradients that, at a normal learning rate, wreck features that took a GPU-month to learn. Skipping the first phase is the most common way to end up worse off than not using transfer learning at all."
  }
]);

/* ===================================================================
   Module: detect — detection and segmentation
   =================================================================== */

TD.addMCQ("cv", "detect", [
  {
    "tag": "Choosing the task",
    "lvl": "core",
    "q": "Roughly how much more expensive is labelling for segmentation than for classification, per image?",
    "o": [
      "About twice as much",
      "About fifteen times",
      "About two hundred times",
      "Roughly the same, since both need one pass over the image"
    ],
    "a": 2,
    "x": "Classification is 1–3 seconds per image, detection 20–60 seconds, segmentation 3–15 minutes — so roughly 1× / 15× / 200×. Annotation is usually the dominant project cost, which is why the right question is what the least precise output that answers the business question is."
  },
  {
    "tag": "IoU implementation",
    "lvl": "intermediate",
    "q": "In an IoU implementation, why must the intersection width and height be clamped with `max(0, ...)`?",
    "o": [
      "To avoid dividing by zero in the union term",
      "Because non-overlapping boxes give negative width and height, whose product is positive and would report a spurious overlap",
      "To keep the result within the range 0 to 1",
      "Because box coordinates may be given as floats"
    ],
    "a": 1,
    "x": "For boxes that do not overlap, `x2 - x1` and `y2 - y1` are both negative, and multiplying two negatives gives a positive intersection area. Without the clamp you get confident overlap between boxes at opposite corners of the image."
  },
  {
    "tag": "NMS threshold failure",
    "lvl": "advanced",
    "q": "Your detector misses people standing close together in crowds. Detection confidence is high and the model trains well. What should you check first?",
    "o": [
      "The learning rate schedule",
      "The NMS IoU threshold — set too low, it deletes a genuinely separate object that overlaps a kept one",
      "The number of anchor boxes per grid cell",
      "Whether the images were letterboxed correctly"
    ],
    "a": 1,
    "x": "NMS deletes every box overlapping a kept box above the threshold. Two people standing shoulder to shoulder produce genuinely overlapping boxes, and too low a threshold treats the second as a duplicate. Too high and one object keeps several boxes — there is no setting that avoids both, which is why it is a dial you own."
  },
  {
    "tag": "Comparing mAP figures",
    "lvl": "advanced",
    "q": "Model A reports mAP 0.65 and model B reports mAP 0.45 on the same dataset. What must you check before concluding A is better?",
    "o": [
      "Whether both were trained for the same number of epochs",
      "The IoU threshold each figure uses — mAP@0.5 and mAP@0.5:0.95 differ by 15–25 points on the same model and are not comparable",
      "Whether both used the same backbone",
      "The batch size used during evaluation"
    ],
    "a": 1,
    "x": "mAP@0.5 is the lenient Pascal VOC convention; mAP@0.5:0.95 averages over ten stricter thresholds and is the COCO standard. The same model scores far lower under the second. Always state the threshold — a paper that omits it is usually quoting the flattering one."
  },
  {
    "tag": "Objectness in YOLO",
    "lvl": "intermediate",
    "q": "What does the objectness score in a YOLO output do that the class probabilities do not?",
    "o": [
      "It measures how tightly the predicted box fits the object",
      "It answers whether anything is present at all, letting the overwhelming majority of empty grid cells be rejected cheaply before any class reasoning",
      "It ranks detections for non-maximum suppression",
      "It indicates which anchor box was used"
    ],
    "a": 1,
    "x": "Most grid cells contain nothing. Objectness separates 'is there something here' from 'what is it', so a single number rejects the empty majority. NMS then cleans up the survivors."
  },
  {
    "tag": "Small object detection",
    "lvl": "advanced",
    "q": "A detector performs well overall but misses small objects in high-resolution images. What is the most effective first fix?",
    "o": [
      "Increase the number of training epochs",
      "Raise the input resolution or tile the image into overlapping crops, because downsampling leaves a small object only a few pixels wide",
      "Lower the confidence threshold",
      "Add more anchor boxes at every scale"
    ],
    "a": 1,
    "x": "A 20-pixel object in a 4000-pixel image is around three pixels after the network's downsampling — there is nothing left to detect. Tiling routinely doubles small-object recall at the cost of inference time. Check `mAP_small` separately, since large objects dominate the overall average and hide this."
  },
  {
    "tag": "Segmentation metrics",
    "lvl": "advanced",
    "q": "A tumour segmentation model reports 99.5% pixel accuracy. Why is this figure meaningless, and what should be reported?",
    "o": [
      "Pixel accuracy ignores boundary pixels; report boundary F1 instead",
      "The foreground is a tiny fraction of the image, so predicting background everywhere scores near-perfectly — report IoU or Dice, per class",
      "Accuracy cannot be computed for multi-class segmentation; report cross-entropy",
      "Pixel accuracy requires the mask and image to be the same resolution"
    ],
    "a": 1,
    "x": "If the tumour is 0.5% of the scan, an all-background prediction scores 99.5% and finds nothing. IoU and Dice ignore the vast correct background. Report per-class figures too — a road-scene model can post a respectable mIoU while scoring near zero on pedestrians."
  },
  {
    "tag": "U-Net skip connections",
    "lvl": "advanced",
    "q": "What do U-Net's skip connections restore that the encoder-decoder path alone loses?",
    "o": [
      "The colour information discarded during greyscale conversion",
      "Fine spatial detail — by the bottom of the U the network knows what is present but has discarded precise boundaries, which are the product",
      "Gradient flow, in the same way residual connections do",
      "The batch normalisation statistics from the encoder"
    ],
    "a": 1,
    "x": "Downsampling trades spatial precision for semantic understanding. The decoder needs both, and the encoder still has the fine detail at each level, so a wire straight across supplies it. Gradient flow is a secondary benefit; the boundary detail is the point."
  }
]);

/* ===================================================================
   Module: modern — transformers, CLIP and deployment
   =================================================================== */

TD.addMCQ("cv", "modern", [
  {
    "tag": "Inductive bias and data",
    "lvl": "advanced",
    "q": "You have 8,000 labelled images. Why is a pretrained CNN usually the better choice than a vision transformer here?",
    "o": [
      "Transformers cannot be fine-tuned on datasets this small",
      "A CNN has locality and translation invariance built into its structure, while a ViT must learn them from data — and at this size there is not enough data to learn what the CNN assumes for free",
      "Vision transformers require square images and yours may not be",
      "CNNs converge faster, so they reach a higher final accuracy"
    ],
    "a": 1,
    "x": "Inductive bias substitutes for data. Structural assumptions help when data is scarce and become a ceiling when it is abundant — which is why ViTs overtake CNNs somewhere above roughly 100 million images and lose below about 10,000."
  },
  {
    "tag": "Position embeddings",
    "lvl": "advanced",
    "q": "Why does feeding a ViT a different input resolution than it was trained at cause problems, when a CNN handles it comfortably?",
    "o": [
      "ViTs have a fixed batch size requirement",
      "Position embeddings are learned for a specific number of patches, so a different resolution changes the sequence length and the embeddings no longer correspond",
      "Attention cannot be computed on non-square inputs",
      "The patch projection layer requires exactly 196 patches"
    ],
    "a": 1,
    "x": "A transformer is permutation-invariant, so position embeddings supply the spatial information — and they are learned for one grid size. A CNN slides the same kernels over whatever arrives. If you fine-tune at 224 and serve at 384 you must interpolate the position embeddings."
  },
  {
    "tag": "CLIP prompt phrasing",
    "lvl": "intermediate",
    "q": "Why does 'a photo of a cat' outperform the bare label 'cat' for CLIP zero-shot classification?",
    "o": [
      "Longer prompts produce more stable embeddings by averaging over more tokens",
      "The text encoder was trained on internet captions, which are sentences, so a sentence matches the distribution it learned",
      "The word 'photo' activates the image encoder's visual pathway",
      "Bare labels are treated as out-of-vocabulary tokens"
    ],
    "a": 1,
    "x": "CLIP learned from 400 million image–caption pairs, and captions are phrases rather than bare nouns. Matching that distribution is worth several accuracy points. Testing three or four phrasings on a validation set is genuinely worth the time — prompt engineering, arriving in vision."
  },
  {
    "tag": "CLIP limitations",
    "lvl": "advanced",
    "q": "Which of these is CLIP *least* reliable at?",
    "o": [
      "Deciding whether a photograph shows an indoor or outdoor scene",
      "Distinguishing 'a cat on a box' from 'a box on a cat'",
      "Finding photographs matching the description 'something to eat'",
      "Classifying broad object categories it never saw as labelled examples"
    ],
    "a": 1,
    "x": "Spatial relations and counting are CLIP's clearest weaknesses — the two sentences contain identical words and embed almost identically. Broad categories and loose semantic search are exactly what it is good at, which is why the failure is surprising in deployment."
  },
  {
    "tag": "Benchmarking on GPU",
    "lvl": "advanced",
    "q": "Your GPU benchmark reports 2 ms for a model that takes 40 ms in production. What is the most likely error?",
    "o": [
      "The batch size differed between benchmark and production",
      "`torch.cuda.synchronize()` was omitted, so you timed how fast Python queued the work rather than how long it took",
      "The model was left in training mode",
      "The benchmark did not include preprocessing time"
    ],
    "a": 1,
    "x": "CUDA calls are asynchronous and return immediately. Without synchronising before and after the timed region you measure queueing, not execution. Warm-up runs, `eval()` and `no_grad()` also matter, but the impossibly-fast number specifically points at missing synchronisation."
  },
  {
    "tag": "Deployment levers",
    "lvl": "intermediate",
    "q": "A model must run 2× faster on fixed hardware. Which lever should you try first?",
    "o": [
      "INT8 quantisation, for the largest theoretical speed-up",
      "Reducing the input resolution, since it is one line, often gives 2–4×, and is trivially reversible",
      "Exporting to TensorRT",
      "Retraining a smaller architecture from scratch"
    ],
    "a": 1,
    "x": "Halving the input side is one changed number and frequently gets you the whole way, and you can measure the accuracy cost on your own validation set in minutes. Quantisation and TensorRT give real gains but cost an export step, a version to maintain, and an accuracy check — try the free lever first."
  },
  {
    "tag": "Deployed vision failures",
    "lvl": "intermediate",
    "q": "An industrial vision system's accuracy drops sharply overnight with no deployment and no code change. Which cause should you investigate first?",
    "o": [
      "Concept drift in the relationship between images and labels",
      "A physical change — the camera moved, a light failed, or the lens is dirty — since these are far more common and far cheaper to check",
      "Numerical instability accumulating in the model weights",
      "A memory leak degrading inference quality"
    ],
    "a": 1,
    "x": "Sudden change with no deploy is almost never drift, which is gradual. Vision runs in physical places, and the mundane causes — a knocked mount, a replaced fluorescent tube, dust on the lens — account for a large share of incidents. This is why you store sample production frames: the first question is what the input looks like now."
  }
]);
