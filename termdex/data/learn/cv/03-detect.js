/* Computer Vision — detection and segmentation.

   These two modules carry most commercial vision work, and they are where a
   reader most needs to be told which task they actually have. "Find the
   defects" could mean classification, detection or segmentation, and picking
   the most precise one by default is a very expensive habit: segmentation
   labels cost roughly twenty times what classification labels cost, and the
   annotation bill is usually larger than the compute bill.

   So the module opens by separating the three tasks, and every lesson after
   that keeps returning to cost — of labels, of inference, of the metric being
   optimised. The animated IoU and NMS diagrams live here because both are
   processes: a still frame of non-maximum suppression is either the input or
   the output and never the thing itself. */
TD.addLessons("cv", [

{
 t: "Classification, Detection, Segmentation — Choosing the Task",
 m: "detect",
 lvl: "core",
 s: "The most expensive mistake in a vision project is solving a harder problem than you have.",
 goal: [
  "Distinguish the three tasks by their output shape",
  "Estimate the annotation cost of each",
  "Choose the least precise task that answers the real question"
 ],
 b: [
  { p: "Someone asks you to *find the defects on these panels*. Before writing anything, you must decide which of three quite different problems that is — because the answer sets your labelling budget, your model, your metric and your timeline." },

  { dg: "cv-tasks" },

  { h: "The three, by what they output" },
  { tbl: { t: "Same image, three answers",
    h: ["Task", "Output", "Answers"],
    rows: [
     ["**Classification**", "One label per image", "*Is there a defect?*"],
     ["**Detection**", "A box and label per object", "*Where are the defects, and how many?*"],
     ["**Segmentation**", "A label for every pixel", "*What is the exact shape and area?*"]
    ] } },

  { h: "The cost nobody budgets for" },
  { p: "The model is rarely the expensive part. The labels are." },
  { tbl: { t: "Roughly, per image, for a human annotator",
    h: ["Task", "Time per image", "Relative cost"],
    rows: [
     ["Classification", "1–3 seconds", "**1×**"],
     ["Detection", "20–60 seconds", "**~15×**"],
     ["Segmentation", "3–15 minutes", "**~200×**"]
    ] } },
  { p: "Ten thousand images is an afternoon of clicking for classification, a fortnight for detection, and several months for segmentation. That difference decides projects, and it is why the right question is not *what would be nicest?* but **what is the least precise output that answers the actual business question?**" },
  { ana: "Asked how many people are in a room, you can answer 'some', 'four, standing there, there, there and there', or hand over a precise outline of each person's silhouette. All three are correct. Only one of them is worth three months of tracing.",
    at: "Counting people in a room" },

  { n: "The right answer is frequently classification on crops. Use cheap classical vision or a coarse detector to find candidate regions, then classify each crop. You get per-object answers with per-image labelling costs, and it is a pattern that has quietly shipped an enormous amount of industrial vision.",
    nt: "The middle path worth knowing" },

  { h: "How the outputs are represented" },
  { code: { lang: "python", t: "What your model actually returns",
    lines: [
     { c: "# classification", w: "" },
     { c: "{'label': 'defect', 'confidence': 0.94}", w: "One answer." },
     { c: "", w: "" },
     { c: "# detection", w: "" },
     { c: "[{'box': [x1, y1, x2, y2], 'label': 'crack', 'confidence': 0.91},", w: "" },
     { c: " {'box': [x1, y1, x2, y2], 'label': 'dent',  'confidence': 0.77}]", w: "A variable-length list — which is what makes detection architecturally harder." },
     { c: "", w: "" },
     { c: "# segmentation", w: "" },
     { c: "mask  # an array shaped (height, width), one class id per pixel", w: "Same size as the image." }
    ] } },
  { p: "That variable length is the crux. A classifier always outputs one thing; a detector must output an unknown number of things, and every detection architecture is an answer to *how do you make a fixed-size network produce a variable-length list?*" },

  { h: "Box formats, and the bug they cause" },
  { trap: "There are three common box formats and mixing them is a rite of passage. **Pascal VOC** is `[x1, y1, x2, y2]` — corners. **COCO** is `[x, y, width, height]`. **YOLO** is `[cx, cy, w, h]` *normalised to 0–1*. Passing COCO boxes to code expecting VOC gives you boxes in roughly the right place and the wrong size, which looks like a bad model rather than a bug. Whenever you load a dataset, print one box and check it against the image dimensions before anything else." },
  { code: { lang: "python", t: "Converting, carefully",
    lines: [
     { c: "def coco_to_voc(b):", w: "" },
     { c: "    x, y, w, h = b", w: "" },
     { c: "    return [x, y, x + w, y + h]", w: "" },
     { c: "", w: "" },
     { c: "def yolo_to_voc(b, img_w, img_h):", w: "" },
     { c: "    cx, cy, w, h = b", w: "" },
     { c: "    cx, w = cx * img_w, w * img_w", w: "**Denormalise first.** YOLO boxes are fractions of the image." },
     { c: "    cy, h = cy * img_h, h * img_h", w: "" },
     { c: "    return [cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2]", w: "Centre to corners." }
    ] } },

  { tryit: { t: "Cost your own project",
    task: "Pick a vision problem you might build. Write down what the business question really is, decide the least precise task that answers it, and estimate the annotation hours for 5,000 images under each of the three tasks.",
    hint: "Use 2s, 40s and 8min per image. Convert to working days at 6 productive hours.",
    sol: { lang: "python", code: "N = 5000\nrates = {'classification': 2, 'detection': 40, 'segmentation': 8 * 60}  # seconds\n\nfor task, secs in rates.items():\n    hours = N * secs / 3600\n    print(f'{task:15s} {hours:7.1f} hours  ({hours / 6:5.1f} working days)')" },
    w: "Classification is under half a day. Segmentation is over a hundred. If your answer was 'segmentation, obviously', check that the extra precision genuinely changes a decision someone makes — often it does not." } },

  { vocab: ["Image Classification", "Object Detection", "Semantic Segmentation", "Bounding Box"] }
 ],
 k: [
  "Classification gives one label, detection gives boxes, segmentation gives a label per pixel.",
  "Annotation cost is roughly 1× / 15× / 200× — usually the dominant project cost.",
  "Choose the least precise task that answers the real question.",
  "Detection is architecturally hard because the output is a variable-length list.",
  "VOC, COCO and YOLO box formats differ; print and check one box before trusting a dataset."
 ],
 r: ["Image Classification", "Object Detection", "Semantic Segmentation", "Bounding Box"]
},

{
 t: "IoU, NMS and mAP: How Detection Is Scored",
 m: "detect",
 lvl: "intermediate",
 s: "Three pieces of machinery. Understand them and every detection paper becomes readable.",
 goal: [
  "Compute IoU and say what threshold means",
  "Explain what non-maximum suppression does and how its threshold fails",
  "Read a mAP figure correctly, including the @0.5:0.95 notation"
 ],
 b: [
  { p: "Classification is scored by comparing labels. Detection cannot be, because a predicted box is never *exactly* the true box — so you need a way to say how nearly right a box is, a way to remove duplicates, and a way to reduce all of it to one number." },

  { h: "IoU: how nearly right" },
  { dg: "cv-iou" },
  { p: "**Intersection over Union** divides the overlapping area by the total area covered by both boxes. Identical boxes score 1; boxes that do not touch score 0." },
  { code: { lang: "python", t: "Twelve lines, worth writing once by hand",
    lines: [
     { c: "def iou(a, b):", w: "Boxes as [x1, y1, x2, y2]." },
     { c: "    x1, y1 = max(a[0], b[0]), max(a[1], b[1])", w: "**Top-left of the overlap** is the larger of the two top-lefts." },
     { c: "    x2, y2 = min(a[2], b[2]), min(a[3], b[3])", w: "Bottom-right is the smaller of the two." },
     { c: "", w: "" },
     { c: "    inter = max(0, x2 - x1) * max(0, y2 - y1)", w: "**The `max(0, ...)` matters** — without it, non-overlapping boxes give a positive product of two negatives." },
     { c: "    if inter == 0:", w: "" },
     { c: "        return 0.0", w: "" },
     { c: "", w: "" },
     { c: "    area_a = (a[2] - a[0]) * (a[3] - a[1])", w: "" },
     { c: "    area_b = (b[2] - b[0]) * (b[3] - b[1])", w: "" },
     { c: "    return inter / (area_a + area_b - inter)", w: "Union is both areas minus the double-counted overlap." }
    ] } },
  { p: "The convention is that IoU ≥ 0.5 counts as a correct detection. That is a loose bar — a box at 0.5 looks visibly off — which is why modern benchmarks average over stricter thresholds too." },

  { h: "NMS: removing the duplicates" },
  { p: "A detector fires at many nearby positions for the same object, so a single cat produces a dozen overlapping boxes. Non-maximum suppression keeps the confident one and deletes its neighbours." },
  { dg: "cv-nms" },
  { code: { lang: "python", t: "The algorithm, in full",
    lines: [
     { c: "def nms(boxes, scores, thresh=0.5):", w: "" },
     { c: "    order = sorted(range(len(boxes)),", w: "" },
     { c: "                   key=lambda i: scores[i], reverse=True)", w: "**Most confident first.**" },
     { c: "    keep = []", w: "" },
     { c: "    while order:", w: "" },
     { c: "        i = order.pop(0)", w: "Take the best remaining." },
     { c: "        keep.append(i)", w: "" },
     { c: "        order = [j for j in order", w: "" },
     { c: "                 if iou(boxes[i], boxes[j]) < thresh]", w: "**Delete everything overlapping it.** Survivors go round again." },
     { c: "    return keep", w: "" }
    ] } },
  { trap: "The NMS threshold trades two failures against each other and there is no setting that avoids both. Too high and one object keeps several boxes. Too low and two genuinely separate objects standing close together — a crowd, a shelf of products — get merged into one. If your detector misses people in crowds, this threshold is the first thing to check, before you touch the model." },
  { n: "Run NMS **per class**, not across all classes at once. A dog standing in front of a car produces heavily overlapping boxes of different classes, and class-agnostic NMS will delete one of them. Most libraries offer `batched_nms` for exactly this; using plain NMS is a quiet source of missed detections.",
    nt: "The per-class detail" },

  { h: "mAP: one number for the whole detector" },
  { p: "For each class, sweep the confidence threshold from high to low, plot precision against recall, and take the area under that curve — the **average precision**. Do it for every class and take the mean: **mean average precision**." },
  { p: "What it captures is the quality of the *ranking*. A detector whose confident predictions are reliably correct scores well even if its uncertain ones are poor, which matches how detectors are actually used." },
  { tbl: { t: "Reading the notation",
    h: ["Written as", "Means"],
    rows: [
     ["**mAP@0.5**", "IoU threshold 0.5. The Pascal VOC convention — the easy one"],
     ["**mAP@0.75**", "Threshold 0.75. Demands tight boxes"],
     ["**mAP@0.5:0.95**", "**Averaged over ten thresholds from 0.5 to 0.95.** The COCO standard, and much harsher"],
     ["**mAP_small**", "Only small objects — usually the weakest number a detector has"]
    ] } },
  { trap: "A model reporting mAP 0.65 sounds better than one reporting 0.45 and may well be worse. If the first is mAP@0.5 and the second is mAP@0.5:0.95, they are not comparable at all — the COCO figure is typically 15–25 points lower on the same model. Whenever you read or quote a detection number, state the threshold. Papers that omit it are usually quoting the flattering one." },

  { tryit: { t: "Implement IoU and NMS from scratch",
    task: "Write `iou` and `nms` yourself, then test them on overlapping boxes. Show that raising the NMS threshold keeps more boxes and lowering it merges nearby objects.",
    hint: "Make two clusters of boxes — one cluster per 'object' — and check that a sensible threshold keeps exactly two.",
    sol: { lang: "python", code: "def iou(a, b):\n    x1, y1 = max(a[0], b[0]), max(a[1], b[1])\n    x2, y2 = min(a[2], b[2]), min(a[3], b[3])\n    inter = max(0, x2 - x1) * max(0, y2 - y1)\n    if inter == 0:\n        return 0.0\n    aa = (a[2] - a[0]) * (a[3] - a[1])\n    bb = (b[2] - b[0]) * (b[3] - b[1])\n    return inter / (aa + bb - inter)\n\ndef nms(boxes, scores, thresh=0.5):\n    order = sorted(range(len(boxes)), key=lambda i: scores[i], reverse=True)\n    keep = []\n    while order:\n        i = order.pop(0)\n        keep.append(i)\n        order = [j for j in order if iou(boxes[i], boxes[j]) < thresh]\n    return keep\n\nboxes = [[10, 10, 110, 110], [15, 15, 115, 115], [12, 8, 108, 112],   # object A\n         [300, 50, 400, 150], [305, 55, 405, 155]]                     # object B\nscores = [0.9, 0.85, 0.8, 0.95, 0.7]\n\nprint('iou A1,A2 =', round(iou(boxes[0], boxes[1]), 3))\nprint('iou A1,B1 =', round(iou(boxes[0], boxes[3]), 3))\nfor t in (0.3, 0.5, 0.9):\n    print(f'thresh {t}: kept {nms(boxes, scores, t)}')" },
    w: "At 0.9 almost nothing is suppressed and you keep duplicates; at 0.3 and 0.5 you correctly get two. Seeing the threshold move the answer is the point — it is a dial you own, not a constant." } },

  { vocab: ["Intersection over Union", "Non-Maximum Suppression", "Mean Average Precision"] }
 ],
 k: [
  "IoU is overlap ÷ union; 0.5 is the traditional bar for a correct detection.",
  "NMS sorts by confidence, keeps the best, and deletes anything overlapping above the threshold.",
  "Too high an NMS threshold keeps duplicates; too low merges nearby objects. Run it per class.",
  "mAP is the area under the precision-recall curve, averaged over classes.",
  "mAP@0.5 and mAP@0.5:0.95 are not comparable — always state the threshold."
 ],
 r: ["Intersection over Union", "Non-Maximum Suppression", "Mean Average Precision", "Bounding Box"]
},

{
 t: "YOLO and the Detection Architectures",
 m: "detect",
 lvl: "intermediate",
 s: "How a fixed-size network produces a variable-length list of objects.",
 goal: [
  "Explain the one-stage versus two-stage split",
  "Describe how YOLO turns detection into a grid prediction",
  "Train a detector on your own data and read its output"
 ],
 b: [
  { p: "A network outputs a fixed-size tensor. Detection needs a variable-length list. Every detection architecture is a different answer to that mismatch, and there are essentially two families." },

  { h: "Two stages versus one" },
  { tbl: { t: "The trade that defines the field",
    h: ["", "Two-stage (R-CNN family)", "One-stage (YOLO, SSD, RetinaNet)"],
    rows: [
     ["**How**", "Propose regions, then classify each", "Predict boxes and classes in a single pass"],
     ["**Speed**", "Slower — 5–15 fps", "**Fast — 30–150 fps**"],
     ["**Accuracy**", "Historically higher, especially on small objects", "Now very close, and often better in practice"],
     ["**Use for**", "Offline analysis, medical imaging", "**Video, real time, edge devices**"]
    ] } },
  { p: "The accuracy gap that justified two-stage detectors has largely closed. Unless you have a specific reason, start with a modern one-stage model." },

  { h: "YOLO's idea" },
  { p: "You Only Look Once, from 2016, reframed detection as a single regression problem. Divide the image into a grid. Each cell predicts a handful of boxes, each with coordinates, an objectness score, and class probabilities. One forward pass, everything at once." },
  { code: { lang: "python", t: "The output tensor, decoded",
    lines: [
     { c: "# for a 13x13 grid, 3 boxes per cell, 80 classes:", w: "" },
     { c: "output.shape", w: "**(13, 13, 3, 85)**" },
     { c: "", w: "" },
     { c: "# those 85 numbers per box are:", w: "" },
     { c: "#   4  box coordinates (cx, cy, w, h)", w: "" },
     { c: "#   1  objectness  — is there anything here at all?", w: "**The key idea.** It separates *something is here* from *what it is*." },
     { c: "#  80  class probabilities", w: "" }
    ] } },
  { p: "Objectness is what makes this work. The overwhelming majority of grid cells contain nothing, so a single number can cheaply reject them before any class reasoning happens. Then NMS cleans up the survivors." },
  { ana: "Rather than searching a car park space by space, you take one photograph and answer, for every marked bay simultaneously, 'is there a car here, and what kind?' The grid is the bays; objectness is 'is there anything here'.",
    at: "One photograph of the car park" },

  { h: "Using it, which is genuinely easy now" },
  { code: { lang: "python", t: "A working detector in six lines",
    lines: [
     { c: "from ultralytics import YOLO", w: "" },
     { c: "", w: "" },
     { c: "model = YOLO('yolov8n.pt')", w: "`n` is nano — the smallest. Also s, m, l, x as you trade speed for accuracy." },
     { c: "results = model('photo.jpg')", w: "" },
     { c: "", w: "" },
     { c: "for r in results:", w: "" },
     { c: "    for box in r.boxes:", w: "" },
     { c: "        cls = model.names[int(box.cls)]", w: "" },
     { c: "        print(cls, float(box.conf), box.xyxy[0].tolist())", w: "Label, confidence, corners. NMS has already been applied." }
    ] } },
  { code: { lang: "python", t: "Training on your own objects",
    lines: [
     { c: "# data.yaml describes the dataset:", w: "" },
     { c: "#   path: ./mydata", w: "" },
     { c: "#   train: images/train", w: "" },
     { c: "#   val: images/val", w: "" },
     { c: "#   names: {0: crack, 1: dent}", w: "" },
     { c: "", w: "" },
     { c: "model = YOLO('yolov8n.pt')", w: "**Start from pretrained.** Transfer learning applies here exactly as in classification." },
     { c: "model.train(data='data.yaml', epochs=100, imgsz=640)", w: "" },
     { c: "metrics = model.val()", w: "" },
     { c: "print(metrics.box.map, metrics.box.map50)", w: "mAP@0.5:0.95 and mAP@0.5 — now you can read both." }
    ] } },
  { p: "Labels are one text file per image, one line per object: `class cx cy w h`, normalised to 0–1. Tools like Label Studio or Roboflow export this directly." },

  { trap: "Small objects are where detectors fail, and the fix is usually not the model. A 20-pixel object in a 4000-pixel image is about 3 pixels wide after the network's downsampling — there is nothing left to detect. Raise `imgsz`, or **tile the image**: cut it into overlapping crops, detect in each, and merge the results back with NMS. Tiling routinely doubles small-object recall and costs nothing but inference time." },

  { n: "Check `mAP_small` separately from overall mAP. A detector can look excellent overall while being useless on exactly the small objects your application cares about, because large objects dominate the average. This is one of the most common gaps between a benchmark number and a disappointed user.",
    nt: "The number to check" },

  { tryit: { t: "Detect on your own webcam",
    task: "Run a pretrained YOLO model on a live camera feed or a video file, draw the boxes, and print the frame rate. Then re-run with a larger model and compare speed and detections.",
    hint: "`cv2.VideoCapture(0)` opens the default camera. Compare `yolov8n` with `yolov8s`.",
    sol: { lang: "python", code: "import cv2, time\nfrom ultralytics import YOLO\n\nmodel = YOLO('yolov8n.pt')\ncap = cv2.VideoCapture(0)\nprev = time.time()\n\nwhile True:\n    ok, frame = cap.read()\n    if not ok:\n        break\n\n    results = model(frame, verbose=False)\n    annotated = results[0].plot()\n\n    now = time.time()\n    fps = 1 / (now - prev)\n    prev = now\n    cv2.putText(annotated, f'{fps:.1f} fps', (10, 30),\n                cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)\n\n    cv2.imshow('detections', annotated)\n    if cv2.waitKey(1) == 27:      # Esc\n        break\n\ncap.release()\ncv2.destroyAllWindows()" },
    w: "This is the moment the track pays off — your own face, boxed, in real time, in about twenty lines. Note how much the frame rate drops between the nano and small models; that trade is the whole of deployment engineering." } },

  { vocab: ["YOLO", "Object Detection", "Anchor Box", "Non-Maximum Suppression"] }
 ],
 k: [
  "Two-stage detectors propose then classify; one-stage predict everything in a single pass and are now competitive.",
  "YOLO divides the image into a grid; each cell predicts boxes with an objectness score plus class probabilities.",
  "Objectness cheaply rejects the vast majority of empty cells before class reasoning.",
  "Fine-tune from pretrained weights; YOLO labels are normalised `class cx cy w h`.",
  "Small objects fail because downsampling erases them — raise the image size or tile, and check mAP_small."
 ],
 r: ["YOLO", "Object Detection", "Anchor Box", "Mean Average Precision"]
},

{
 t: "Segmentation: Labelling Every Pixel",
 m: "segment",
 lvl: "intermediate",
 s: "U-Net, the three kinds of segmentation, and the metric that stops you fooling yourself.",
 goal: [
  "Distinguish semantic, instance and panoptic segmentation",
  "Explain the encoder-decoder shape and what skip connections restore",
  "Choose a loss and metric that survive a tiny foreground"
 ],
 b: [
  { p: "Segmentation classifies every pixel. It is the most precise vision output, the most expensive to label, and the right answer whenever *shape or area* is the thing you actually need — a tumour's size, a field's boundary, the exact silhouette for a background blur." },

  { h: "Three kinds" },
  { tbl: { t: "Three photographs of two cats and a sofa",
    h: ["Kind", "Output", "Distinguishes"],
    rows: [
     ["**Semantic**", "Every pixel labelled *cat* or *sofa*", "Classes, not individuals — both cats are one blob"],
     ["**Instance**", "A separate mask per cat", "Individuals, but ignores the background sofa"],
     ["**Panoptic**", "Both — individual cats *and* labelled sofa", "Everything"]
    ] } },
  { p: "Semantic is the usual starting point and is what U-Net does. Instance segmentation is Mask R-CNN and its descendants: detect first, then predict a mask inside each box." },

  { h: "The encoder-decoder shape" },
  { p: "A classifier compresses an image down to one label. Segmentation must come back out again to full resolution — so the architecture goes down and then up, which is why U-Net is drawn as a U." },
  { ol: [
   "**The encoder** downsamples: 224 → 112 → 56 → 28 → 14. Spatial detail is traded for semantic understanding, exactly as in a classifier.",
   "**The decoder** upsamples back: 14 → 28 → 56 → 112 → 224, producing a full-resolution map of class predictions."
  ] },
  { p: "Done naively this loses badly. By the bottom of the U the network knows *there is a cat here* but has thrown away the precise boundary — and a boundary is the entire product." },

  { h: "Skip connections: the actual idea" },
  { p: "U-Net's contribution is a wire from each encoder level directly across to the matching decoder level. The decoder gets both the coarse semantic signal from below and the fine spatial detail it had on the way down." },
  { ana: "Describing a route from memory versus describing it with the map still in front of you. The compressed memory holds the gist — 'left at the church, then the river'. The map holds the exact corners. Skip connections hand the decoder the map back.",
    at: "The route and the map" },
  { code: { lang: "python", t: "The shape, in miniature",
    lines: [
     { c: "def forward(self, x):", w: "" },
     { c: "    e1 = self.enc1(x)          # 224", w: "" },
     { c: "    e2 = self.enc2(self.pool(e1))   # 112", w: "" },
     { c: "    e3 = self.enc3(self.pool(e2))   # 56", w: "" },
     { c: "    b  = self.bottom(self.pool(e3)) # 28", w: "Deepest point — most semantics, least detail." },
     { c: "", w: "" },
     { c: "    d3 = self.up3(b)", w: "" },
     { c: "    d3 = self.dec3(torch.cat([d3, e3], dim=1))", w: "**The skip.** Concatenate the encoder's features back in." },
     { c: "    d2 = self.dec2(torch.cat([self.up2(d3), e2], dim=1))", w: "" },
     { c: "    d1 = self.dec1(torch.cat([self.up1(d2), e1], dim=1))", w: "" },
     { c: "    return self.head(d1)       # (B, classes, 224, 224)", w: "One class score per pixel." }
    ] } },

  { h: "The metric, and why accuracy is a trap here" },
  { p: "Segmentation data is extremely imbalanced. A tumour might be 0.5% of a scan, so a model predicting *background* for every pixel scores 99.5% pixel accuracy and has found nothing." },
  { p: "The honest metrics both ignore the vast correct background:" },
  { tbl: { t: "Use these instead",
    h: ["Metric", "Formula", "Note"],
    rows: [
     ["**IoU / Jaccard**", "overlap ÷ union", "Same idea as detection IoU, applied per pixel"],
     ["**Dice / F1**", "2 × overlap ÷ (sum of both areas)", "**The medical-imaging standard.** More forgiving on small objects"],
     ["**mIoU**", "IoU averaged over classes", "The benchmark standard for scene segmentation"]
    ] } },
  { trap: "Report per-class IoU, never only the mean. A road-scene model can post a respectable mIoU while scoring near zero on pedestrians, because road and sky are enormous and easy and dominate the average. The class you care about is usually the small one, and the mean is exactly what hides it." },

  { h: "Loss functions that cope" },
  { code: { lang: "python", t: "Dice loss, and why it is combined",
    lines: [
     { c: "def dice_loss(pred, target, eps=1.0):", w: "" },
     { c: "    pred = torch.sigmoid(pred)", w: "" },
     { c: "    inter = (pred * target).sum()", w: "" },
     { c: "    return 1 - (2 * inter + eps) / (pred.sum() + target.sum() + eps)", w: "`eps` keeps it defined when an image contains no foreground at all." },
     { c: "", w: "" },
     { c: "loss = 0.5 * bce(pred, target) + 0.5 * dice_loss(pred, target)", w: "**The standard combination.** Cross-entropy gives stable per-pixel gradients; Dice optimises the metric you will be judged on." }
    ] } },
  { p: "Pure cross-entropy on a 0.5% foreground barely moves — the background swamps it. Pure Dice can be unstable early in training. The half-and-half combination is what most medical segmentation code uses, for both reasons." },

  { tryit: { t: "Segment something, and score it honestly",
    task: "Fine-tune a pretrained segmentation model on any small dataset. Report pixel accuracy, mean IoU and per-class IoU, and explain the gap between the first and the last.",
    hint: "`segmentation_models_pytorch` gives you a U-Net with a pretrained encoder in two lines.",
    sol: { lang: "python", code: "import segmentation_models_pytorch as smp\nimport torch\n\nmodel = smp.Unet(\n    encoder_name='resnet34',\n    encoder_weights='imagenet',      # transfer learning again\n    in_channels=3,\n    classes=2,\n)\n\ndef iou_per_class(pred, target, n_classes):\n    pred = pred.argmax(1)\n    out = []\n    for c in range(n_classes):\n        p, t = (pred == c), (target == c)\n        inter = (p & t).sum().item()\n        union = (p | t).sum().item()\n        out.append(inter / union if union else float('nan'))\n    return out\n\n# after training:\n# ious = iou_per_class(model(x), y, 2)\n# print('per-class IoU:', [round(i, 3) for i in ious])\n# print('mIoU:', round(sum(ious) / len(ious), 3))" },
    w: "Pixel accuracy will look excellent and the foreground IoU will not. That gap is the whole reason segmentation is scored the way it is." } },

  { vocab: ["Semantic Segmentation", "Instance Segmentation", "U-Net", "Mask R-CNN"] }
 ],
 k: [
  "Semantic labels classes, instance separates individuals, panoptic does both.",
  "Segmentation networks are encoder-decoder: compress for meaning, expand for resolution.",
  "Skip connections hand spatial detail back to the decoder, which is U-Net's key idea.",
  "Pixel accuracy is meaningless on small foregrounds — use IoU or Dice, and report per class.",
  "Combine cross-entropy with Dice loss: stable gradients plus the metric you are scored on."
 ],
 r: ["Semantic Segmentation", "Instance Segmentation", "U-Net", "Mask R-CNN", "Panoptic Segmentation"]
}

]);
