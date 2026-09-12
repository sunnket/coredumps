/* Real-world examples and step-by-step flows — Computer Vision. */
TD.attach("computer-vision", {

"Computer Vision": {
 ex: { h: "The checkout that watches instead of scanning",
       b: "A till-free shop needs to know which hand took which tin, from cameras alone. That single problem contains the whole field: detect objects, segment them, track them across frames, and be right often enough that nobody is charged for a tin they put back." },
 fl: { t: "How a vision system is put together",
       s: ["Frames arrive from a camera or a file",
           { s: "Preprocess — resize, normalise, correct colour", n: "The same way the model saw images in training, or accuracy drops for no visible reason." },
           { q: "What question are you asking of the image?",
             y: "What is in it → classification; where is it → detection or segmentation",
             n: "Where did it go → tracking across frames" },
           { s: "The model outputs boxes, masks or labels with scores", n: "Never certainties — always a confidence you must threshold." },
           "Lighting, angle and lens change everything — test on footage from the real camera"] }
},

"Image Classification": {
 ex: { h: "One label for the whole picture",
       b: "Is this X-ray normal or not? The simplest vision task and still the most deployed, because a great many real problems really are one decision per image. Its weakness is structural: it tells you a dog is present and nothing at all about where, how many, or how big." },
 fl: { t: "Training a classifier without a research budget",
       s: ["Start from a model pretrained on ImageNet",
           { s: "Replace the final layer with your own classes", n: "The features underneath already know edges, textures and shapes." },
           { q: "Do you have thousands of labelled images per class?",
             y: "Fine-tune the whole network",
             n: "Freeze the backbone and train only the head — far less overfitting" },
           { s: "Augment: flips, crops, colour jitter", n: "Free extra data, and it teaches invariance to things that should not matter." },
           "Check the errors by eye — models happily learn the watermark instead of the subject"] }
},

"Object Detection": {
 ex: { h: "Counting the cars at the junction",
       b: "Traffic planning needs a number per minute, per lane, per direction. Detection gives every vehicle a box and a class, which turns a video feed into a spreadsheet. The hard cases are exactly the interesting ones: overlapping objects, tiny distant ones, and things half out of frame." },
 fl: { t: "What happens in one detection pass",
       s: ["The image goes through a backbone that extracts features",
           { s: "The head proposes many candidate boxes with class scores", n: "Thousands of them, most of which are rubbish." },
           { s: "Discard everything below a confidence threshold", n: "That threshold is a product decision, not a technical one." },
           { q: "Several boxes on the same object?",
             y: "Non-maximum suppression keeps the best and drops the rest",
             n: "Output the survivors" },
           "Report mAP, but tune the threshold against the cost of a miss versus a false alarm"] }
},

"Bounding Box": {
 ex: { h: "A rectangle around a thing that is not rectangular",
       b: "A box around a cyclist contains a great deal of road. That looseness is the point — boxes are cheap to label, cheap to predict and good enough to count, track and crop. When the shape genuinely matters, that is when you pay for segmentation instead." },
 fl: { t: "Getting the coordinates right",
       s: ["Pick a format and write it down",
           { q: "Which convention is your model expecting?",
             y: "`[x_min, y_min, x_max, y_max]` — corner form, common in PyTorch",
             n: "`[x_centre, y_centre, w, h]`, often normalised 0–1 — YOLO form" },
           { s: "Mixing the two silently produces boxes in the wrong place", n: "The single most common bug in a detection pipeline." },
           { s: "Resizing an image must transform the boxes too", n: "Augmentation libraries do this; hand-rolled code usually forgets." },
           "Draw the boxes on a sample of images before training — three minutes that saves a day"] }
},

"Intersection over Union": {
 ex: { h: "How close is close enough?",
       b: "A predicted box overlapping the true one by 51% is a hit at IoU 0.5 and a miss at 0.75. Every detection metric hangs off that arbitrary line, which is why mAP is quoted as `mAP@0.5` or averaged across thresholds — the number without the threshold means nothing." },
 fl: { t: "Scoring a prediction",
       s: ["Take the predicted box and the ground-truth box",
           { s: "Compute the area they share", n: "The intersection." },
           { s: "Divide it by the area they cover together", n: "The union — so a huge box that swallows the target does not score well." },
           { q: "Is IoU above the threshold?",
             y: "Count it as a true positive — one per ground-truth box",
             n: "It is a false positive, and the target is a false negative" },
           "IoU is zero for boxes that do not touch, which gives gradients nothing to work with — hence GIoU and DIoU losses"] }
},

"Non-Maximum Suppression": {
 ex: { h: "Nine boxes, one car",
       b: "A detector fires on the same vehicle from slightly different anchors, and without cleanup your traffic count reads nine. NMS keeps the most confident box and deletes anything overlapping it too much — a two-line algorithm that every detector depends on completely." },
 fl: { t: "The suppression loop",
       s: ["Sort all boxes of a class by confidence",
           { s: "Take the highest-scoring box and keep it", n: "It is assumed to be the real detection." },
           { q: "Does another box overlap it above the IoU threshold?",
             y: "Discard that box — it is a duplicate",
             n: "Leave it; it is probably a different object" },
           { s: "Repeat with the next-highest survivor", n: "Until every box is kept or discarded." },
           "Set the threshold too low and genuinely overlapping objects — a crowd — get erased"] }
},

"Mean Average Precision": {
 ex: { h: "One number that hides two questions",
       b: "mAP folds precision and recall across every confidence threshold and every class into a single figure — convenient for a leaderboard, misleading for a product. A model at 0.62 mAP might be excellent on cars and useless on pedestrians, and the average will not tell you." },
 fl: { t: "How it is computed",
       s: ["For one class, sort detections by confidence",
           { s: "Walk down the list, marking true and false positives by IoU", n: "Recording precision and recall at each step." },
           { s: "The area under that precision-recall curve is average precision", n: "One number per class." },
           { q: "Multiple classes?",
             y: "Average the AP values — that is the *mean* in mAP",
             n: "AP alone is enough" },
           "Always look at per-class AP too — the mean conceals the class you care about"] }
},

"YOLO": {
 ex: { h: "One look, one pass, thirty frames a second",
       b: "Two-stage detectors propose regions and then classify them, which is accurate and slow. YOLO predicts every box and class in a single forward pass, which is what made real-time detection possible on ordinary hardware — and why it runs on drones, doorbells and factory lines." },
 fl: { t: "A single forward pass",
       s: ["Divide the image into a grid",
           { s: "Every cell predicts boxes, objectness and class scores", n: "All at once, for the whole image." },
           { q: "Need higher accuracy or higher speed?",
             y: "A larger variant — more parameters, better on small objects",
             n: "A nano variant — runs on a Raspberry Pi at useful frame rates" },
           { s: "Filter by confidence, then apply NMS", n: "The only post-processing there is." },
           "Check the licence of the specific version before shipping it commercially"] }
},

"Anchor Box": {
 ex: { h: "Guess a shape, then correct it",
       b: "Predicting box coordinates from nothing is a hard regression; nudging a preset shape is an easy one. Anchors encode the prior that people are tall rectangles and cars are wide ones — and if your objects are neither, the defaults quietly cap your accuracy." },
 fl: { t: "Tuning anchors for your data",
       s: ["Collect the width and height of every box in the training set",
           { q: "Do the default anchors match that spread?",
             y: "Leave them — the standard set covers common object shapes",
             n: "Cluster your boxes with k-means and use the centroids" },
           { s: "Each anchor is assigned to the ground truth it overlaps most", n: "The network then learns an offset, not an absolute position." },
           { s: "Anchor-free detectors skip this entirely", n: "FCOS and DETR predict centres or use learned queries instead." },
           "Long, thin or unusually large objects are the classic sign that anchors need retuning"] }
},

"Semantic Segmentation": {
 ex: { h: "Colouring in every pixel",
       b: "A self-driving stack needs to know which pixels are road, which are pavement and which are sky — and does not care that there are two lanes or three. Every pixel gets a class, individual objects are not separated, and the label cost is brutal: a single image can take an hour to annotate by hand." },
 fl: { t: "From image to mask",
       s: ["An encoder downsamples the image into features",
           { s: "Resolution is lost but meaning is gained", n: "The classic tension in segmentation." },
           { s: "A decoder upsamples back to full resolution", n: "Predicting a class for every pixel." },
           { q: "Are the edges blurry and imprecise?",
             y: "Add skip connections from the encoder — that is exactly what U-Net does",
             n: "Evaluate with mean IoU per class" },
           "Class imbalance is severe — sky is everywhere, traffic signs are not; weight the loss"] }
},

"Instance Segmentation": {
 ex: { h: "Not just *sheep* — sheep number four",
       b: "Semantic segmentation paints all the sheep one colour. Instance segmentation separates each animal, which is what you need to count them, track them, or measure one. It is the most expensive kind of label and the most useful when objects overlap." },
 fl: { t: "Detect, then segment",
       s: ["Run a detector to find object boxes",
           { s: "For each box, predict a binary mask inside it", n: "The Mask R-CNN approach: segmentation as a per-object add-on." },
           { q: "Do objects overlap heavily?",
             y: "This is where instance segmentation earns its cost — boxes alone cannot separate them",
             n: "Detection boxes may be enough and are far cheaper" },
           { s: "Masks are predicted at low resolution and upscaled", n: "Which is why fine boundaries stay a little soft." },
           "Labelling cost is the real constraint — budget for it before promising the feature"] }
},

"Panoptic Segmentation": {
 ex: { h: "Things and stuff, in one map",
       b: "Cars are countable *things* and need instance ids; road and sky are uncountable *stuff* and do not. Panoptic segmentation assigns every pixel exactly one label and, where it makes sense, one instance — producing the complete scene description an autonomous system actually wants." },
 fl: { t: "Producing the unified map",
       s: ["Segment the countable things into instances",
           { s: "Segment the amorphous stuff semantically", n: "Road, vegetation, sky — no instance ids." },
           { q: "Two predictions claim the same pixel?",
             y: "Resolve by confidence — every pixel gets exactly one label",
             n: "Merge into a single panoptic map" },
           { s: "Scored with panoptic quality", n: "Which combines segmentation and recognition into one metric." },
           "It is strictly more work than either task alone — only pay for it if you need both"] }
},

"U-Net": {
 ex: { h: "Built for microscopes, used everywhere",
       b: "Designed for biomedical images where you have thirty labelled samples rather than thirty thousand, its skip connections carry fine detail past the bottleneck so boundaries stay sharp. That architecture then turned up as the backbone of image-generating diffusion models — the same shape, a different job." },
 fl: { t: "Why the skips matter",
       s: ["The encoder downsamples, learning what is present",
           { s: "Spatial precision is destroyed on the way down", n: "A 512×512 image becomes a small dense feature map." },
           { q: "Decode from the bottleneck alone?",
             y: "You get the right class with a mushy, imprecise boundary",
             n: "Concatenate the matching encoder layer at each upsampling step" },
           { s: "Those skip connections restore the lost edges", n: "The U shape in the name is exactly this." },
           "Works with very little data, which is why it survived in medicine and remote sensing"] }
},

"Mask R-CNN": {
 ex: { h: "Faster R-CNN with one more branch",
       b: "It adds a small mask head alongside the existing box and class heads, and the accompanying fix — RoIAlign, which stops the feature grid being rounded to integers — was what actually made per-object masks sharp. A clean example of a large capability from a small architectural change." },
 fl: { t: "The two stages",
       s: ["A region proposal network suggests candidate object regions",
           { s: "Each region's features are extracted with RoIAlign", n: "Bilinear sampling, no rounding — this detail is why the masks are crisp." },
           { s: "Three heads run per region: class, box refinement, mask", n: "The mask branch is per-class and binary." },
           { q: "Is real-time speed required?",
             y: "Two stages are too slow — use YOLO-seg or a one-stage segmenter",
             n: "Mask R-CNN remains a strong, well-understood accuracy baseline" },
           "Its masks are predicted at 28×28 and upscaled — fine structures like wires are lost"] }
},

"Data Augmentation": {
 ex: { h: "Ten thousand images from one thousand",
       b: "A cat flipped horizontally is still a cat, so you get a free training example and teach the model that orientation is irrelevant. The judgement is knowing which transforms preserve the label: flip a photo of a cat freely, flip a photo of the digit 2 and you have taught the model a lie." },
 fl: { t: "Choosing transforms",
       s: ["List the variation your camera will genuinely produce",
           { q: "Would a human still give it the same label?",
             y: "Safe to augment — crops, small rotations, brightness, blur",
             n: "It corrupts the label — vertical flips on text, hue shifts on medical stains" },
           { s: "Apply randomly, on the fly, every epoch", n: "So the model never sees the same exact image twice." },
           { s: "Boxes and masks must be transformed with the image", n: "Forgetting this trains the model on systematically wrong labels." },
           "Never augment the validation set — you would be measuring a different task"] }
},

"OCR": {
 ex: { h: "The scanned invoice that becomes a row in a ledger",
       b: "Accounts payable receives PDFs that are pictures of paper. OCR turns them back into text, and the accuracy gap between a clean digital scan and a creased photo taken at an angle is enormous — which is why the preprocessing, not the recogniser, is usually where the work goes." },
 fl: { t: "From photograph to structured fields",
       s: ["Deskew, denoise and binarise the image",
           { s: "This step decides most of the accuracy", n: "A crooked or shadowed page defeats a good recogniser." },
           { s: "Detect text regions, then recognise the characters in each", n: "Detection and recognition are two separate models." },
           { q: "Do you need fields, not just text?",
             y: "Use the layout — position and neighbouring labels identify `Total` and `Invoice No`",
             n: "Return the raw text with confidences" },
           "Always keep the confidence per field and route low ones to a human"] }
},

"Face Recognition": {
 ex: { h: "Unlocking a phone, and everything that follows",
       b: "Technically it is embedding a face and comparing distances. Practically it is the most regulated capability in vision: accuracy differs measurably across skin tones, faces cannot be reissued like passwords when a database leaks, and several jurisdictions restrict its use outright." },
 fl: { t: "Verification, step by step",
       s: ["Detect the face and align it to a canonical pose",
           { s: "Embed it into a vector with a trained network", n: "Trained so the same person is close and different people are far." },
           { q: "Is the distance to the enrolled vector below threshold?",
             y: "Accept — and that threshold is the whole false-accept/false-reject tradeoff",
             n: "Reject" },
           { s: "Add liveness detection", n: "Otherwise a printed photo passes." },
           "Measure error rates per demographic group and publish them — an overall number hides the failure"] }
},

"Pose Estimation": {
 ex: { h: "A stick figure from a video frame",
       b: "A physiotherapy app checking a squat needs joint angles, not pixels. Locating shoulders, hips and knees turns a video into geometry you can measure — and the same skeletons drive motion capture, sports analytics and the gesture control on a games console." },
 fl: { t: "Finding the joints",
       s: ["Detect people in the frame",
           { q: "One person or a crowd?",
             y: "Top-down — detect each person, estimate their pose in the crop; accurate, slows with crowd size",
             n: "Bottom-up — find all joints at once and group them; constant speed, harder grouping" },
           { s: "The model outputs a heatmap per joint", n: "The peak is the joint location, and its height is the confidence." },
           { s: "Connect joints into a skeleton using known anatomy", n: "Which limits impossible configurations." },
           "Occluded joints must be marked missing, not guessed — downstream angles depend on it"] }
},

"Object Tracking": {
 ex: { h: "That is the same person, four seconds later",
       b: "Detection tells you there is a person in this frame. Tracking says it is the person from the last frame — which is what makes *dwell time*, *queue length* and *did they take it or put it back* answerable. Identity survives brief occlusion or the whole analysis falls apart." },
 fl: { t: "Tracking by detection",
       s: ["Detect objects independently in each frame",
           { s: "Predict where each existing track should be now", n: "A Kalman filter using its recent velocity." },
           { q: "Does a new detection match a predicted position?",
             y: "Assign it to that track — identity continues",
             n: "Start a new track, or keep the old one alive briefly in case of occlusion" },
           { s: "Appearance embeddings break ties", n: "Two people crossing have similar positions and different clothes." },
           "An identity switch is the metric that matters — count them, not just detections"] }
},

"Image Preprocessing": {
 ex: { h: "The step everyone skips and then debugs for a day",
       b: "A model trained on images normalised with ImageNet statistics, then served images scaled 0–1, will produce confident nonsense with no error message anywhere. Preprocessing must be byte-identical between training and inference, and the mismatch is invisible until you look at the accuracy." },
 fl: { t: "The standard chain",
       s: ["Decode the image and fix its colour order",
           { s: "OpenCV loads BGR, most models expect RGB", n: "A classic silent bug — the picture still looks fine to code." },
           { s: "Resize to the model's input size", n: "Letterbox rather than stretch if aspect ratio matters." },
           { s: "Normalise with the exact mean and standard deviation used in training", n: "Not an approximation. The same numbers." },
           { q: "Serving in a different language or framework?",
             y: "Re-verify pixel by pixel against the training pipeline",
             n: "Reuse the identical transform object" }] }
},

"Colour Space": {
 ex: { h: "Picking the ripe tomatoes",
       b: "In RGB a red tomato in shade and one in sunlight are far apart, because brightness is smeared through all three channels. Convert to HSV and hue barely moves — so a threshold that was hopeless becomes a two-line rule. Choosing the space is often the whole trick." },
 fl: { t: "Choosing a representation",
       s: ["Decide what you are trying to isolate",
           { q: "Is colour identity the signal, under changing light?",
             y: "HSV or LAB — they separate colour from brightness",
             n: "RGB is fine, and it is what neural networks expect" },
           { s: "Grayscale for shape and texture", n: "Edges, gradients and classical features rarely need colour." },
           { s: "LAB is perceptually uniform", n: "Equal numeric distances look equally different to a human eye." },
           "Convert once, early, and record which space each stage assumes"] }
},

"Histogram Equalisation": {
 ex: { h: "Rescuing an underexposed X-ray",
       b: "The information is there — squeezed into a narrow band of greys the eye cannot separate. Equalisation spreads those values across the full range and detail appears. Global equalisation also amplifies noise and can blow out bright regions, which is why CLAHE, working tile by tile, is what actually gets used." },
 fl: { t: "Improving contrast",
       s: ["Build the histogram of pixel intensities",
           { q: "Is it bunched into a narrow band?",
             y: "Equalise — remap so intensities spread across the full range",
             n: "Leave it; equalising a good image makes it worse" },
           { s: "Global equalisation amplifies noise everywhere", n: "Including in flat regions that had no detail to recover." },
           { s: "CLAHE equalises small tiles with a contrast limit", n: "Local detail without the noise explosion." },
           "It changes pixel statistics — apply it consistently in training and inference"] }
},

"Edge Detection": {
 ex: { h: "Finding the outline of the part on the conveyor",
       b: "Before deep learning, edges were the foundation of nearly everything in vision. They still are for measurement: a machine-vision system checking a component's dimensions to a tenth of a millimetre uses Canny, not a neural network, because it needs a repeatable geometric answer rather than a probability." },
 fl: { t: "The Canny detector",
       s: ["Blur the image slightly with a Gaussian",
           { s: "Without it, every speck of noise becomes an edge", n: "The blur radius is the main tuning knob." },
           { s: "Compute intensity gradients in x and y", n: "Magnitude and direction per pixel." },
           { s: "Thin the result to single-pixel lines", n: "Non-maximum suppression along the gradient direction." },
           { q: "Which pixels survive?",
             y: "Above the high threshold — definitely an edge",
             n: "Between the thresholds only if connected to a strong edge" }] }
},

"SIFT": {
 ex: { h: "Recognising a landmark from a different angle",
       b: "Two photos of the same building from opposite sides of the square, one zoomed in. SIFT finds keypoints that survive scale and rotation and describes each so it can be matched across images — the machinery behind panorama stitching and structure-from-motion, long before learned features existed." },
 fl: { t: "Matching two images",
       s: ["Find keypoints at multiple scales",
           { s: "Corners and blobs that stay distinctive when the image is resized", n: "This is where scale invariance comes from." },
           { s: "Assign each keypoint a dominant orientation", n: "Which is where rotation invariance comes from." },
           { s: "Describe the local gradients as a 128-number vector", n: "The descriptor that gets compared." },
           { q: "Do descriptors from the two images match?",
             y: "Fit a geometric transform with RANSAC to reject the wrong matches",
             n: "Too few matches — the images likely do not overlap" }] }
},

"Image Registration": {
 ex: { h: "Two scans, six months apart",
       b: "A radiologist comparing tumour size needs the two volumes in the same coordinate frame, or the difference measures patient position rather than disease. The same alignment underlies satellite change detection and every panorama your phone has ever stitched." },
 fl: { t: "Aligning two images",
       s: ["Pick a transform model",
           { q: "Is the difference a rigid movement?",
             y: "Rotation and translation only — few parameters, robust",
             n: "Affine or non-rigid — needed for tissue, terrain and lenses" },
           { s: "Find correspondences", n: "Feature matching, or optimise an intensity similarity measure directly." },
           { s: "Estimate the transform and resample one image onto the other", n: "Interpolation choice affects fine measurements." },
           "Always inspect a difference image afterwards — a plausible-looking result can be badly wrong"] }
},

"Super-Resolution": {
 ex: { h: "*Enhance* — with an asterisk",
       b: "The television trick is real in one narrow sense and dishonest in another: a model can generate a convincing high-resolution image, but it is inventing plausible detail, not recovering hidden truth. Excellent for restoring old family photos. Inadmissible for reading a number plate in evidence." },
 fl: { t: "How detail is invented",
       s: ["Train on pairs: a high-resolution image and its downscaled version",
           { s: "The model learns what typically produced that blur", n: "Textures, edges and letterforms it has seen many times." },
           { q: "Is the fine detail in the input at all?",
             y: "Then it is genuine recovery of what the sensor captured",
             n: "It is a plausible hallucination — convincing and unverifiable" },
           { s: "Perceptual and GAN losses look better and score worse on PSNR", n: "Sharp and slightly invented beats blurry and faithful, to a human eye." },
           "Never present super-resolved output as evidence of what was there"] }
},

"Image Captioning": {
 ex: { h: "Alt text for a million product photos",
       b: "Accessibility law requires descriptions; nobody is writing them by hand at that scale. Captioning bridges vision and language — and its failure mode is the standard generative one: it describes a plausible photo rather than this one, confidently adding a dog that is not there." },
 fl: { t: "From pixels to a sentence",
       s: ["Encode the image into visual features",
           { s: "A vision transformer or CNN backbone", n: "Often pretrained on image-text pairs, as in CLIP." },
           { s: "A language decoder generates words conditioned on those features", n: "Attending back to image regions as it writes." },
           { q: "Does the caption mention something absent?",
             y: "Object hallucination — check captions against a detector before publishing",
             n: "Score with CIDEr and a human sample" },
           "For alt text, specific and short beats fluent and long"] }
},

"Visual Question Answering": {
 ex: { h: "Asking the photo a question",
       b: "*How many people are wearing helmets?* requires detection, counting and language understanding in one answer. It is the natural interface for visual search, and the standard trap is that a model can score well by learning question priors alone — answering *two* to every *how many* question and being right often enough." },
 fl: { t: "Answering a question about an image",
       s: ["Encode the image and the question into a shared space",
           { s: "Attention lets the question select image regions", n: "*Helmets* focuses on heads, not the background." },
           { q: "Is the answer visible in the image?",
             y: "Ground it in the attended region and answer",
             n: "The model should abstain — most will guess instead" },
           { s: "Test with counterfactual images", n: "Change the picture, keep the question, and see if the answer moves." },
           "A model that never looks at the image can still score respectably — check that it does"] }
},

"ImageNet": {
 ex: { h: "The benchmark that started the era",
       b: "In 2012, AlexNet cut the error rate by ten points in one go and the field changed direction within a year. Its second, quieter legacy is transfer learning: nearly every vision model you fine-tune today starts from weights trained on those million labelled photographs." },
 fl: { t: "Why pretrained weights help you",
       s: ["A network is trained on a million images across a thousand classes",
           { s: "Early layers learn edges, colours and textures", n: "Universal features — nothing about the thousand classes is specific to them." },
           { q: "Is your domain natural photographs?",
             y: "Transfer works extremely well — freeze the backbone and retrain the head",
             n: "X-rays, satellite and microscope images transfer less; expect to fine-tune deeper" },
           { s: "You reach usable accuracy with hundreds of images, not millions", n: "This is why small teams can do vision at all." },
           "Its label set carries known biases and problematic classes — do not treat it as neutral"] }
},

"Grad-CAM": {
 ex: { h: "Checking the model looked at the right thing",
       b: "A classifier separating wolves from huskies with 95% accuracy turned out to be detecting snow in the background. Grad-CAM shows that in one heatmap. It is the cheapest sanity check in vision and it routinely catches models that are right for entirely the wrong reason." },
 fl: { t: "Producing the heatmap that shows where a model looked",
       s: [{ s: "A model says \"dog\" with 97% confidence. Grad-CAM answers the obvious next question: which part of the picture made it say that?", n: "The output is a heatmap laid over the photo, warm where the evidence was." },
           { s: "Run the image through the model as normal and pick the answer you want explained", n: "Usually the one it chose, but you can ask about any of them — including a wrong one." },
           { s: "Now work backwards to the last layer that still knows about position", n: "Deeper layers know what is in the image but have lost where. This layer still has both, which is exactly what you need." },
           { s: "That layer holds many maps, each highlighting where one pattern was found", n: "One for fur texture, one for an ear shape, and so on." },
           { s: "Work out how much each map mattered for this particular answer, and add them together weighted by that", n: "Maps that pushed strongly towards \"dog\" count heavily; irrelevant ones count for nothing." },
           { q: "What do you do with the result?",
             y: "Stretch it back to the size of the original photo and lay it over the top — warm areas are what drove the decision",
             n: "And check it looks sensible. A model highlighting the grass rather than the animal has learned that dogs appear on lawns, which will fail the moment one appears indoors" }] }
},

"OpenCV": {
 ex: { h: "The toolbox before and beside the models",
       b: "Reading video, resizing frames, warping perspective, finding contours, drawing boxes — the unglamorous 80% of any vision project. Two lifelong gotchas: it loads images as BGR rather than RGB, and its coordinates are `(x, y)` while NumPy indexes `(row, col)`." },
 fl: { t: "A typical video pipeline",
       s: ["Open the capture and read frames in a loop",
           { s: "Check every read succeeded", n: "A dropped frame returns false, not an exception." },
           { s: "Convert BGR to RGB before any model call", n: "Otherwise the model sees a blue-tinted world and quietly underperforms." },
           { q: "Is it too slow?",
             y: "Downscale before processing and skip frames — you rarely need all thirty",
             n: "Draw results and write out or display" },
           "Release the capture and writer explicitly, or the output file is unplayable"] }
},

"Neural Radiance Field": {
 ex: { h: "Fifty phone photos, one walkable scene",
       b: "NeRF fits a small network mapping position and viewing direction to colour and density, then renders new viewpoints by marching rays through it. The scene is stored as network weights rather than as geometry — which is elegant, and why editing it is awkward and Gaussian splatting overtook it for speed." },
 fl: { t: "Capture to novel view",
       s: ["Photograph the subject from many angles",
           { s: "Recover each camera's exact pose", n: "Structure-from-motion first — bad poses ruin everything downstream." },
           { s: "Train a small MLP to predict colour and density along rays", n: "Optimised so rendered views match the real photographs." },
           { q: "Do new views look right?",
             y: "The field has learned the geometry — render any camera path",
             n: "More views, better poses, or a static scene — moving subjects break it" },
           "Each scene is trained from scratch — this is a per-scene fit, not a general model"] }
},

"3D Reconstruction": {
 ex: { h: "Measuring a building from a drone flight",
       b: "Overlapping aerial photographs become a point cloud, then a mesh, then a survey with volumes and distances. The mathematics — triangulating a point seen from two known viewpoints — is the same as human stereo vision, scaled to thousands of images and solved as one enormous optimisation." },
 fl: { t: "Photogrammetry, end to end",
       s: ["Capture overlapping images from many positions",
           { s: "Sixty to eighty per cent overlap between neighbours", n: "Too little and the reconstruction has holes." },
           { s: "Match features and recover camera poses", n: "Structure-from-motion, refined by bundle adjustment." },
           { s: "Densify into a point cloud, then a mesh", n: "Multi-view stereo fills between the matched points." },
           { q: "Are surfaces blank, glossy or transparent?",
             y: "Feature matching fails — use projected patterns, LiDAR or a depth sensor",
             n: "Texture the mesh from the source photographs" }] }
}

});
