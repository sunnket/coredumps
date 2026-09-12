/* Computer Vision — filling out the thin modules.

   The first pass left three modules with a single lesson each, which is the
   shape this whole expansion exists to remove: a module with one lesson names
   a subject rather than teaching it.

     classic    features and matching — the half of classical vision that is
                not filtering, and the reason panoramas and AR work at all
     transfer   the data problem, which is the actual bottleneck in every real
                vision project and is almost never taught
     segment    the tasks that are segmentation-shaped without being called
                that: OCR, pose, tracking

   The tracking lesson also closes a gap the track would otherwise leave: every
   preceding lesson treats images as independent, and a great deal of deployed
   vision is video, where the previous frame is the most useful feature you
   have and nobody thinks to use it. */
TD.addLessons("cv", [

{
 t: "Features and Matching: How Panoramas Work",
 m: "classic",
 lvl: "intermediate",
 s: "Finding the same point in two photographs, which is the basis of stitching, AR and 3D.",
 goal: [
  "Explain what a keypoint and a descriptor are",
  "Match features between two images and reject the bad matches",
  "Say why this is still used when neural networks exist"
 ],
 b: [
  { p: "Two photographs of the same scene from slightly different positions. To stitch them into a panorama, or work out how the camera moved, you must find points that appear in both — and you must do it despite the shift, the rotation, the zoom and the change in brightness." },
  { p: "This is **feature matching**, and it is the machinery underneath panoramas, augmented reality, image stabilisation, 3D reconstruction and most robot navigation." },

  { h: "Keypoints and descriptors" },
  { p: "The problem splits in two, and the split is the insight." },
  { ol: [
   "**A keypoint** is a location worth remembering — a corner, a blob, something locally distinctive. A point in a blank sky is useless because it looks like every other point in the sky.",
   "**A descriptor** is a short vector summarising the neighbourhood around that keypoint, built so it stays roughly the same when the patch is rotated, scaled or lit differently."
  ] },
  { p: "So: find distinctive spots, describe each one in a way that survives transformation, then match descriptors between images." },
  { ana: "Describing where you are standing in a city by the shape of the buildings around you rather than by the coordinates. Approach from a different street, in different weather, and the description still identifies the spot — because it captured the arrangement, not the viewpoint.",
    at: "Describing a corner, not a coordinate" },

  { h: "Corners are where the information is" },
  { p: "Why corners? Consider a small window sliding over the image:" },
  { tbl: { t: "What moving the window tells you",
    h: ["On a…", "Moving the window", "Useful?"],
    rows: [
     ["Flat region", "Nothing changes in any direction", "**No** — cannot localise at all"],
     ["Edge", "Changes across it, not along it", "**Partly** — you slide along the edge"],
     ["Corner", "**Changes in every direction**", "**Yes** — the position is pinned"]
    ] } },
  { p: "That is the entire Harris corner detector, and it explains why corner detection came first historically: a corner is the only local structure that fixes a position in two dimensions." },

  { code: { lang: "python", t: "Matching two images",
    lines: [
     { c: "import cv2", w: "" },
     { c: "", w: "" },
     { c: "orb = cv2.ORB_create(nfeatures=2000)", w: "**ORB** — free and fast. SIFT is better and now also free; SURF is still patent-encumbered." },
     { c: "k1, d1 = orb.detectAndCompute(img1, None)", w: "Keypoints and their descriptors." },
     { c: "k2, d2 = orb.detectAndCompute(img2, None)", w: "" },
     { c: "", w: "" },
     { c: "bf = cv2.BFMatcher(cv2.NORM_HAMMING)", w: "ORB descriptors are binary, so Hamming distance. SIFT would use L2." },
     { c: "matches = bf.knnMatch(d1, d2, k=2)", w: "**Two** nearest matches for each — the reason is the next block." },
     { c: "", w: "" },
     { c: "good = [m for m, n in matches if m.distance < 0.75 * n.distance]", w: "**Lowe's ratio test.**" }
    ] } },
  { p: "That last line is the piece worth understanding. A descriptor's best match is only trustworthy if it is *clearly* better than its second-best. If the two are nearly as good, the patch is ambiguous — repeated windows on a building, texture on a carpet — and the match is a coin flip. Requiring the best to be 25% better than the runner-up discards most bad matches for one comparison." },

  { h: "RANSAC: throwing away the rest" },
  { p: "Even after the ratio test some matches are wrong, and a single wrong match can wreck a fitted transform. **RANSAC** handles this by repeatedly guessing: pick four matches at random, compute the transform they imply, count how many other matches agree, and keep the guess with the most agreement." },
  { code: { lang: "python", t: "Fitting a transform that survives bad data",
    lines: [
     { c: "import numpy as np", w: "" },
     { c: "", w: "" },
     { c: "src = np.float32([k1[m.queryIdx].pt for m in good]).reshape(-1, 1, 2)", w: "" },
     { c: "dst = np.float32([k2[m.trainIdx].pt for m in good]).reshape(-1, 1, 2)", w: "" },
     { c: "", w: "" },
     { c: "H, mask = cv2.findHomography(src, dst, cv2.RANSAC, 5.0)", w: "`H` maps image 1 onto image 2. 5.0 pixels is the agreement tolerance." },
     { c: "print(f'{mask.sum()} of {len(good)} matches agree')", w: "**Check this.** Under about 15 inliers, do not trust the result." },
     { c: "", w: "" },
     { c: "warped = cv2.warpPerspective(img1, H, (w, h))", w: "Image 1, seen from image 2's viewpoint. Now they can be blended." }
    ] } },
  { n: "RANSAC is a general idea worth carrying beyond vision: when most of your data is good and a few points are catastrophically wrong, fit to random small subsets and keep the fit that the most points agree with. It is robust in a way that least-squares — which lets one outlier drag the whole line — simply is not.",
    nt: "Why RANSAC is worth knowing generally" },

  { trap: "Feature matching fails on texture-free scenes, and it fails completely rather than gracefully. A blank wall, a clear sky, a plain conveyor belt — there are no distinctive corners, so there is nothing to match, and you get a confident transform built from noise. Always check the inlier count before using a homography; a low count means *no answer*, not *a rough answer*." },

  { h: "Why this survives" },
  { p: "Learned feature matchers exist and are better on hard cases. Classical matching persists anyway because it needs no training data, runs in milliseconds on a phone, is deterministic and debuggable, and is precise to sub-pixel accuracy. Your phone's panorama mode and most AR tracking still run this, in real time, on battery." },

  { tryit: { t: "Stitch two photographs",
    task: "Take two overlapping photographs, match features between them, and warp one onto the other. Print how many matches survived the ratio test and RANSAC.",
    hint: "Photograph the same scene twice, moving sideways slightly. `cv2.drawMatches` visualises what matched.",
    sol: { lang: "python", code: "import cv2, numpy as np\n\nimg1 = cv2.imread('left.jpg', cv2.IMREAD_GRAYSCALE)\nimg2 = cv2.imread('right.jpg', cv2.IMREAD_GRAYSCALE)\n\norb = cv2.ORB_create(2000)\nk1, d1 = orb.detectAndCompute(img1, None)\nk2, d2 = orb.detectAndCompute(img2, None)\nprint(f'keypoints: {len(k1)}, {len(k2)}')\n\nbf = cv2.BFMatcher(cv2.NORM_HAMMING)\nmatches = bf.knnMatch(d1, d2, k=2)\ngood = [m for m, n in matches if m.distance < 0.75 * n.distance]\nprint(f'after ratio test: {len(good)}')\n\nif len(good) >= 15:\n    src = np.float32([k1[m.queryIdx].pt for m in good]).reshape(-1, 1, 2)\n    dst = np.float32([k2[m.trainIdx].pt for m in good]).reshape(-1, 1, 2)\n    H, mask = cv2.findHomography(src, dst, cv2.RANSAC, 5.0)\n    print(f'inliers after RANSAC: {int(mask.sum())}')\n    out = cv2.warpPerspective(img1, H, (img2.shape[1], img2.shape[0]))\n    cv2.imwrite('warped.jpg', out)\nelse:\n    print('too few matches — not enough texture')" },
    w: "Watch the count fall at each stage: thousands of keypoints, hundreds of good matches, perhaps a hundred inliers. That funnel is the algorithm working, and a collapse at any stage tells you exactly what went wrong." } },

  { vocab: ["SIFT", "OpenCV", "Image Registration"] }
 ],
 k: [
  "A keypoint is a distinctive location; a descriptor summarises its neighbourhood so it survives rotation, scale and lighting.",
  "Corners are used because they are the only local structure that pins a position in both directions.",
  "Lowe's ratio test discards matches whose best candidate is not clearly better than the second.",
  "RANSAC fits a transform that tolerates outliers by keeping the guess most points agree with.",
  "Matching fails completely on texture-free scenes — always check the inlier count."
 ],
 r: ["SIFT", "OpenCV", "Image Registration", "3D Reconstruction"]
},

{
 t: "The Data Problem, Which Is the Real Problem",
 m: "transfer",
 lvl: "intermediate",
 s: "Your model will be limited by your dataset long before it is limited by your architecture.",
 goal: [
  "Estimate how many images you actually need",
  "Find and fix the label errors that are certainly in your dataset",
  "Use active learning to label the images that matter"
 ],
 b: [
  { p: "Courses spend their time on architectures because architectures are teachable. Real vision projects are decided by the dataset, and the gap between those two facts is where most first projects go wrong." },

  { h: "How many images do you need?" },
  { p: "The honest answer is *it depends*, but the useful answer is a starting range." },
  { tbl: { t: "Rough, per class, with transfer learning",
    h: ["Situation", "Images per class"],
    rows: [
     ["Very distinct classes, controlled scene", "**50–100**"],
     ["Typical classification", "**200–1,000**"],
     ["Fine-grained distinctions", "**1,000–10,000**"],
     ["Detection", "**500–2,000 per class**, plus varied backgrounds"],
     ["Segmentation", "**200–1,000**, but each costs 20× more to label"],
     ["From scratch, no pretraining", "**100,000+** — which is why nobody does this"]
    ] } },
  { p: "Note how much smaller these are than people expect. Transfer learning is what makes 200 images viable, and it is why the first lesson of this module insists on it." },

  { h: "Your labels are wrong — measurably" },
  { p: "Studies of the standard benchmarks found label errors in all of them: roughly 3% of ImageNet's validation set, and around 6% across ten common datasets. **These are the datasets the field measures itself against.** Yours, labelled faster and with less review, is worse." },
  { p: "The good news is that finding the errors is cheap, because a trained model tells you where they are." },
  { code: { lang: "python", t: "Confident learning, in miniature",
    lines: [
     { c: "# out-of-fold predictions, so nothing predicts its own training data", w: "" },
     { c: "probs = cross_val_predict(model, X, y, cv=5, method='predict_proba')", w: "" },
     { c: "", w: "" },
     { c: "confidence_in_label = probs[range(len(y)), y]", w: "How confident is the model in the label it was *given*?" },
     { c: "suspects = confidence_in_label.argsort()[:100]", w: "**The hundred least-believed labels.** Look at these images." },
     { c: "", w: "" },
     { c: "for i in suspects[:10]:", w: "" },
     { c: "    print(f'{paths[i]}: labelled {classes[y[i]]}, '", w: "" },
     { c: "          f'model says {classes[probs[i].argmax()]}'", w: "" },
     { c: "          f' ({probs[i].max():.2f})')", w: "" }
    ] } },
  { p: "An afternoon reviewing that list typically finds genuine mislabels, images containing two classes, and images that are simply unclassifiable. Fixing a hundred labels frequently beats a week of architecture work — and unlike the architecture work, it improves every future model you train on that data." },
  { trap: "Fix errors in the **validation and test sets** first, not the training set. A model can absorb some training noise, but a wrong test label means you are measuring against a wrong answer — and it makes a correct prediction look like a failure. Every hour spent tuning against a dirty test set is wasted, and worse, misleading." },

  { h: "Active learning: label the images that matter" },
  { p: "With ten thousand unlabelled images and budget for a thousand, labelling a random thousand is the obvious approach and roughly the worst one. Most images are easy and teach the model nothing." },
  { ol: [
   "Label a small random seed — say 200 images.",
   "Train a model on them.",
   "Predict on everything unlabelled.",
   "**Label the ones the model is least sure about** — where the top two classes are nearly tied.",
   "Retrain, and repeat."
  ] },
  { code: { lang: "python", t: "Choosing the next batch",
    lines: [
     { c: "probs = model.predict_proba(X_unlabelled)", w: "" },
     { c: "top2 = np.sort(probs, axis=1)[:, -2:]", w: "" },
     { c: "margin = top2[:, 1] - top2[:, 0]", w: "**Small margin = the model is torn.** These are the informative ones." },
     { c: "next_batch = margin.argsort()[:200]", w: "" }
    ] } },
  { p: "This routinely reaches the same accuracy with half the labels, because you spend the budget on the boundary cases that actually define the decision rather than on a thousand obvious examples." },
  { ana: "Revising for an exam by working through the questions you get wrong rather than the ones you already answer instantly. Same hours, far more learned — and the easy questions were never the ones costing you marks.",
    at: "Revising the questions you get wrong" },

  { h: "Where the data comes from" },
  { tbl: { t: "In order of what to try",
    h: ["Source", "Note"],
    rows: [
     ["**A pretrained model, zero-shot**", "CLIP can often label a starter set for you, imperfectly but usefully"],
     ["**Public datasets**", "COCO, Open Images, Roboflow Universe — check the licence before shipping"],
     ["**Your own capture**", "Best match to deployment. Capture on the actual camera, in the actual place"],
     ["**Synthetic**", "Rendered or composited. Works well for rigid manufactured objects, poorly for people"],
     ["**Augmentation**", "Free multiplication, but it cannot invent variation your data never had"]
    ] } },
  { n: "The most valuable images are the ones from your deployment environment, on your camera, in your lighting. A thousand images from the actual production line beats fifty thousand scraped from the internet, because the internet images differ from your reality in ways you cannot enumerate and the model will find every one of them.",
    nt: "Which images are worth most" },

  { tryit: { t: "Find the errors in your own labels",
    task: "Train a model with cross-validated predictions, then list the twenty training examples whose given label the model most disagrees with. Inspect them and record how many are genuine errors.",
    hint: "`cross_val_predict` with `method='predict_proba'`. Sort by the probability assigned to the given label.",
    sol: { lang: "python", code: "import numpy as np\nfrom sklearn.model_selection import cross_val_predict\n\nprobs = cross_val_predict(model, X, y, cv=5, method='predict_proba')\ngiven = probs[np.arange(len(y)), y]\n\nsuspects = given.argsort()[:20]\nfor i in suspects:\n    pred = probs[i].argmax()\n    print(f'{i:5d}  labelled={classes[y[i]]:12s} '\n          f'model={classes[pred]:12s} '\n          f'conf_in_label={given[i]:.3f}')\n\n# then look at the images themselves and count the real mistakes" },
    w: "Expect somewhere between a fifth and a half of that list to be genuine label errors. That rate is normal, and it is why this check is worth running on every dataset you are handed." } },

  { vocab: ["Data Augmentation", "Transfer Learning", "ImageNet"] }
 ],
 k: [
  "With transfer learning, 200–1,000 images per class is a realistic starting range.",
  "Every dataset has label errors — around 3–6% even in the standard benchmarks.",
  "Find them by listing the examples whose given label your model least believes.",
  "Clean the validation and test sets first; a wrong test label makes a correct prediction look wrong.",
  "Active learning — labelling the least confident cases — reaches the same accuracy with about half the labels."
 ],
 r: ["Data Augmentation", "Transfer Learning", "ImageNet", "Data Leakage"]
},

{
 t: "OCR, Pose and Tracking: Vision Over Time",
 m: "segment",
 lvl: "intermediate",
 s: "Three tasks that shape a great deal of applied vision, and the one that needs the previous frame.",
 goal: [
  "Choose an OCR approach for documents versus photographs",
  "Explain how pose estimation predicts a set of points",
  "Turn a per-frame detector into a tracker that keeps identities"
 ],
 b: [
  { p: "Three tasks that between them account for an enormous amount of deployed vision — and the last introduces something every earlier lesson ignored: the previous frame." },

  { h: "OCR: two different problems" },
  { p: "*Reading text from an image* splits into two tasks that people conflate, with quite different difficulty." },
  { tbl: { t: "Which OCR problem do you have?",
    h: ["", "Document OCR", "Scene text"],
    rows: [
     ["**Input**", "A scan or PDF, mostly flat", "A photograph — signs, packaging, screens"],
     ["**Difficulty**", "Largely solved", "**Much harder** — angles, curves, lighting, reflections"],
     ["**Tools**", "Tesseract, PaddleOCR, cloud APIs", "Detection model plus a recognition model"],
     ["**Accuracy**", "98%+ on clean scans", "Highly variable"]
    ] } },
  { code: { lang: "python", t: "Preprocessing is most of document OCR",
    lines: [
     { c: "import cv2, pytesseract", w: "" },
     { c: "", w: "" },
     { c: "grey = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)", w: "" },
     { c: "grey = cv2.medianBlur(grey, 3)", w: "Remove scan speckle." },
     { c: "_, bw = cv2.threshold(grey, 0, 255,", w: "" },
     { c: "        cv2.THRESH_BINARY + cv2.THRESH_OTSU)", w: "**Clean black on white.** OCR engines expect this." },
     { c: "", w: "" },
     { c: "text = pytesseract.image_to_string(bw)", w: "" },
     { c: "data = pytesseract.image_to_data(bw,", w: "" },
     { c: "        output_type=pytesseract.Output.DICT)", w: "**Use this instead** — it gives per-word boxes and confidences, so you can drop low-confidence words rather than trusting a blob of text." }
    ] } },
  { trap: "Deskewing is the highest-value OCR preprocessing step and the most commonly skipped. A page rotated by three degrees can drop accuracy from 98% to below 70%, because the engine's line segmentation assumes horizontal text. Detect the angle with `cv2.minAreaRect` on the text mask and rotate before recognising — it is a dozen lines and often doubles your accuracy." },

  { h: "Pose estimation: predicting points, not boxes" },
  { p: "Pose estimation locates a fixed set of body keypoints — wrists, elbows, shoulders, ankles. The output is not a box or a mask but a list of coordinates with confidences." },
  { p: "The standard approach predicts a **heatmap per keypoint**: a full-resolution map where the brightest pixel is that joint's most likely position. This is more robust than regressing coordinates directly, because a heatmap can express uncertainty and even represent two plausible positions at once." },
  { code: { lang: "python", t: "Running a pose model",
    lines: [
     { c: "from ultralytics import YOLO", w: "" },
     { c: "", w: "" },
     { c: "model = YOLO('yolov8n-pose.pt')", w: "" },
     { c: "results = model('person.jpg')", w: "" },
     { c: "", w: "" },
     { c: "for r in results:", w: "" },
     { c: "    kp = r.keypoints.xy[0]", w: "**17 points** in the COCO convention." },
     { c: "    conf = r.keypoints.conf[0]", w: "" },
     { c: "    for i, (p, c) in enumerate(zip(kp, conf)):", w: "" },
     { c: "        if c > 0.5:", w: "**Always gate on confidence.** Occluded joints are predicted anyway, badly." },
     { c: "            print(f'point {i}: ({p[0]:.0f}, {p[1]:.0f})')", w: "" }
    ] } },
  { n: "Pose is usually a means rather than an end. The keypoints become features for something else — counting repetitions in an exercise, flagging unsafe posture on a worksite, judging a technique. Angles between joints are the useful derived quantity, and they are trivially computed from three points with `arctan2`.",
    nt: "What pose is actually for" },

  { h: "Tracking: the previous frame is free information" },
  { p: "Everything so far treated images as independent. In video that discards the single most useful signal available — an object in this frame is almost certainly near where it was in the last one." },
  { p: "Running a detector per frame gives you boxes but no identities: you know there are three people, not that *this* is the same person as before. Tracking assigns and maintains those identities." },
  { code: { lang: "python", t: "The tracking loop, conceptually",
    lines: [
     { c: "# 1. detect in the new frame", w: "" },
     { c: "detections = detector(frame)", w: "" },
     { c: "", w: "" },
     { c: "# 2. predict where each existing track should now be", w: "" },
     { c: "predictions = [t.kalman_predict() for t in tracks]", w: "**A motion model.** Constant velocity is usually enough." },
     { c: "", w: "" },
     { c: "# 3. match detections to predictions by IoU", w: "" },
     { c: "cost = 1 - iou_matrix(detections, predictions)", w: "" },
     { c: "rows, cols = linear_sum_assignment(cost)", w: "**The Hungarian algorithm** — optimal assignment, not greedy nearest." },
     { c: "", w: "" },
     { c: "# 4. update matched, start new, retire unseen", w: "" },
     { c: "#    a track survives a few missed frames before dying", w: "Occlusion is temporary; do not delete a person who walked behind a pillar." }
    ] } },
  { p: "That is SORT, and DeepSORT adds one thing: an appearance embedding per object, so a person re-identified after a long occlusion is matched by how they look as well as where they were. In practice `model.track()` in Ultralytics gives you this in one call." },
  { trap: "**ID switches** are the characteristic tracking failure. Two people cross paths and their identities swap, so your count of unique visitors is right while every individual trajectory is nonsense. Position alone cannot resolve a crossing — that is what the appearance embedding in DeepSORT is for. If you are counting unique objects rather than concurrent ones, measure ID switches explicitly; overall detection metrics will not show them." },

  { tryit: { t: "Count unique objects in a video",
    task: "Run a tracker over a video and count how many distinct objects appeared in total, not how many are present per frame. Then count how many times an ID appears, disappears and returns.",
    hint: "`model.track(persist=True)` keeps state between frames. Collect the set of ids you have ever seen.",
    sol: { lang: "python", code: "import cv2\nfrom ultralytics import YOLO\nfrom collections import defaultdict\n\nmodel = YOLO('yolov8n.pt')\ncap = cv2.VideoCapture('clip.mp4')\n\nseen, frames_per_id = set(), defaultdict(int)\n\nwhile True:\n    ok, frame = cap.read()\n    if not ok:\n        break\n    results = model.track(frame, persist=True, verbose=False)\n    boxes = results[0].boxes\n    if boxes.id is not None:\n        for tid in boxes.id.int().tolist():\n            seen.add(tid)\n            frames_per_id[tid] += 1\n\ncap.release()\nprint(f'unique objects: {len(seen)}')\nbrief = [i for i, n in frames_per_id.items() if n < 5]\nprint(f'ids lasting under 5 frames: {len(brief)}  <- likely ID switches')" },
    w: "Those very short-lived ids are the tell. A real object persists for many frames; a flurry of one- and two-frame ids means the tracker is losing and re-acquiring things, and your unique count is inflated." } },

  { vocab: ["OCR", "Pose Estimation", "Object Tracking"] }
 ],
 k: [
  "Document OCR is largely solved; scene text in photographs is much harder and needs detection plus recognition.",
  "Deskewing is the highest-value OCR preprocessing step — three degrees of rotation can halve accuracy.",
  "Pose predicts a heatmap per keypoint, which expresses uncertainty better than regressing coordinates.",
  "Tracking adds identity across frames: detect, predict with a motion model, match with the Hungarian algorithm.",
  "ID switches are the characteristic tracking failure and are invisible in per-frame detection metrics."
 ],
 r: ["OCR", "Pose Estimation", "Object Tracking", "Object Detection"]
}

]);
