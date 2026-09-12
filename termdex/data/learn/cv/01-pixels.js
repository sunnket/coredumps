/* Computer Vision — what an image is, and the classical techniques.

   This track exists because there was no computer vision track at all: the
   dictionary carried thirty-three CV terms and nothing taught any of them,
   and the Deep Learning track's architecture module went from convolutions
   straight to transformers without ever showing what vision does with them.

   The opening module makes one claim and refuses to move past it until it is
   believed: an image is a grid of numbers, and every result in this field is
   arithmetic on that grid. Readers nod at that sentence and do not accept it.
   So the first lesson prints the numbers, the second does arithmetic on them
   by hand, and only then does anything called a network appear.

   The classical module is here for a reason that courses usually skip. A
   great deal of production vision is still thresholds, contours and template
   matching, because those are exact, free, debuggable and run on a
   microcontroller. A reader who reaches for a neural network to find a red
   circle on a white background has learned the wrong lesson. */
TD.addLessons("cv", [

{
 t: "An Image Is a Grid of Numbers",
 m: "pixels",
 lvl: "core",
 s: "Not a metaphor. Open the file and there is nothing in it but numbers.",
 goal: [
  "Describe the shape of an image array and what each axis means",
  "Explain why OpenCV gives you BGR and what breaks because of it",
  "Load an image and manipulate it as arithmetic"
 ],
 b: [
  { p: "Everything in this track rests on one fact, and it is worth taking literally rather than as an analogy: **a photograph is a grid of numbers.** There is no picture inside the file. There is a rectangle of integers, and a convention that says how to light up a screen from them." },

  { dg: "cv-pixels" },

  { h: "The shape" },
  { p: "A greyscale image is a 2D array: height × width, each value 0 (black) to 255 (white). A colour image adds a third axis of three channels." },
  { code: { lang: "python", t: "Reading the shape",
    lines: [
     { c: "import cv2", w: "" },
     { c: "img = cv2.imread('photo.jpg')", w: "" },
     { c: "print(img.shape)", w: "**(1080, 1920, 3)** — height, width, channels. **Height first.**" },
     { c: "print(img.dtype)", w: "**uint8** — unsigned 8-bit integers, so 0–255 and nothing else." },
     { c: "print(img[0, 0])", w: "**[34 87 210]** — one pixel, three numbers." }
    ] } },
  { trap: "Height comes first, not width. `img.shape` is `(h, w, c)` but every image tool in the world describes pictures as *1920×1080*, which is width first. This inversion is the single most common source of squashed, rotated or crashing image code, and it will catch you at least once. When indexing, `img[y, x]` — row before column." },

  { h: "The BGR problem" },
  { p: "OpenCV loads colour channels in the order **blue, green, red**. Almost everything else — matplotlib, PIL, PyTorch, the entire internet — uses **RGB**." },
  { p: "The reason is historical: OpenCV was written in 2000 when some camera hardware and Windows bitmaps used BGR, and changing it later would have broken everyone's code. So it stayed." },
  { vs: { t: "Why your image looks wrong", lang: "python",
    bad: { label: "Blue and red swapped", c: "img = cv2.imread('photo.jpg')\nplt.imshow(img)",
      w: "Skin turns blue, sky turns orange. The image is fine; the channel order does not match what matplotlib expects." },
    good: { label: "Converted", c: "img = cv2.imread('photo.jpg')\nplt.imshow(cv2.cvtColor(img, cv2.COLOR_BGR2RGB))",
      w: "One conversion. Get into the habit of doing it at the boundary, the moment an image leaves OpenCV." } } },

  { h: "Arithmetic is image editing" },
  { p: "Because an image is an array, ordinary arithmetic does familiar things — and seeing this once removes most of the mystery from image processing." },
  { code: { lang: "python", t: "Every one of these is a normal array operation",
    lines: [
     { c: "bright = cv2.add(img, 50)", w: "Brighten: add to every pixel. `cv2.add` clips at 255; plain `img + 50` **wraps around** and turns bright areas black." },
     { c: "dark = img // 2", w: "Halve every value — darker." },
     { c: "inverted = 255 - img", w: "A photographic negative." },
     { c: "crop = img[100:400, 200:600]", w: "Cropping is array slicing. Rows then columns." },
     { c: "flipped = img[:, ::-1]", w: "Mirror horizontally by reversing the column axis." },
     { c: "red_only = img[:, :, 2]", w: "One channel, as a 2D greyscale array. Index 2 is red **in BGR**." }
    ] } },
  { ana: "A spreadsheet where every cell holds a brightness and the cells are small enough that you see a picture rather than a table. Everything in this track is a formula applied across that spreadsheet — sometimes a very clever formula, but never anything other than arithmetic on cells.",
    at: "The very large spreadsheet" },

  { h: "Colour spaces, and why you would leave RGB" },
  { p: "RGB is how screens emit light, not how people describe colour, and that mismatch makes some tasks needlessly hard. *Find the red objects* in RGB means checking three channels against each other under every lighting condition." },
  { tbl: { t: "The ones worth knowing",
    h: ["Space", "Axes", "Good for"],
    rows: [
     ["**RGB / BGR**", "Red, green, blue", "Display; the default"],
     ["**HSV**", "Hue, saturation, value", "**Picking colours by name** — hue is one number"],
     ["**Greyscale**", "Brightness only", "Shape and edge work; a third of the data"],
     ["**LAB**", "Lightness, two colour axes", "Colour differences that match human perception"]
    ] } },
  { p: "HSV is the practical one. Selecting *anything reddish* becomes a range on a single axis, and it stays roughly stable as the lighting brightens or dims — which in RGB it does not." },
  { code: { lang: "python", t: "Finding red things, robustly",
    lines: [
     { c: "hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)", w: "" },
     { c: "mask = cv2.inRange(hsv, (0, 120, 70), (10, 255, 255))", w: "Hue 0–10 is red; the other two bounds reject grey and very dark pixels." },
     { c: "found = cv2.bitwise_and(img, img, mask=mask)", w: "Keep only the pixels the mask selected." }
    ] } },

  { tryit: { t: "Prove it to yourself",
    task: "Load any image. Print its shape and one pixel's values. Then make it brighter, mirror it, and extract the green channel — using only array operations.",
    hint: "If you have no image handy, make one: `np.zeros((200, 300, 3), dtype=np.uint8)` and draw on it with `cv2.circle`.",
    sol: { lang: "python", code: "import cv2, numpy as np\n\nimg = np.zeros((200, 300, 3), dtype=np.uint8)\ncv2.circle(img, (150, 100), 60, (0, 0, 255), -1)   # BGR: this is RED\n\nprint('shape:', img.shape, 'dtype:', img.dtype)\nprint('centre pixel:', img[100, 150])\n\nbright   = cv2.add(img, 60)\nmirrored = img[:, ::-1]\ngreen    = img[:, :, 1]\n\nprint('green channel shape:', green.shape)\ncv2.imwrite('out.png', np.hstack([img, bright, mirrored]))" },
    w: "Note that the circle drawn with `(0, 0, 255)` is red, not blue — that is BGR, and getting caught by it once here is much cheaper than getting caught by it in a model pipeline." } },

  { vocab: ["Computer Vision", "Colour Space", "OpenCV"] }
 ],
 k: [
  "An image is an array of shape (height, width, channels) with values 0–255.",
  "Height comes first in the shape, and indexing is img[y, x].",
  "OpenCV uses BGR; convert at the boundary or your colours are swapped.",
  "Brightening, cropping and flipping are ordinary array arithmetic.",
  "HSV makes colour selection one axis instead of three, and survives lighting changes."
 ],
 r: ["Computer Vision", "Colour Space", "OpenCV", "Image Preprocessing"]
},

{
 t: "Preprocessing: The Decisions That Set Your Ceiling",
 m: "pixels",
 lvl: "core",
 s: "Resize, normalise, and the two mistakes that quietly cost you accuracy.",
 goal: [
  "Resize images without distorting them",
  "Explain what normalisation does and why the numbers are what they are",
  "Match your preprocessing exactly between training and inference"
 ],
 b: [
  { p: "Preprocessing looks like plumbing and behaves like a hyperparameter. Two of the decisions here routinely cost more accuracy than a change of architecture, and neither produces an error message." },

  { h: "Resizing, and the aspect-ratio trap" },
  { p: "Networks want a fixed input size — 224×224 is the classic. Your photographs are not that shape, so something must give." },
  { vs: { t: "A 1920×1080 photo into a 224×224 network", lang: "python",
    bad: { label: "Squashed", c: "small = cv2.resize(img, (224, 224))",
      w: "The aspect ratio is destroyed. Every face is now wide and flat. The model can learn around it if *all* your images are distorted identically — but your production images will not be." },
    good: { label: "Letterboxed", c: "h, w = img.shape[:2]\ns = 224 / max(h, w)\nresized = cv2.resize(img, (int(w * s), int(h * s)))\ncanvas = np.zeros((224, 224, 3), np.uint8)\ny, x = (224 - resized.shape[0]) // 2, (224 - resized.shape[1]) // 2\ncanvas[y:y + resized.shape[0], x:x + resized.shape[1]] = resized",
      w: "Scale by the longer side, then pad. Shapes are preserved; you pay with some grey border." } } },
  { p: "Which is right depends on the task. For classification, squashing is often survivable. For **detection it is not**, because your box coordinates must be transformed identically and a distorted object is a distorted box. YOLO letterboxes for exactly this reason." },

  { h: "Interpolation, briefly" },
  { tbl: { t: "How to fill in pixels that did not exist",
    h: ["Method", "Use"],
    rows: [
     ["`INTER_AREA`", "**Shrinking.** Averages the pixels being merged — the correct default for downsizing"],
     ["`INTER_LINEAR`", "Enlarging. Fast, slightly soft. OpenCV's default"],
     ["`INTER_CUBIC`", "Enlarging, when quality matters more than speed"],
     ["`INTER_NEAREST`", "**Masks and label images.** Never averages, so it cannot invent a class that does not exist"]
    ] } },
  { trap: "Resizing a segmentation mask with the default interpolation is a real and quiet bug. Averaging label 1 and label 3 gives you label 2 — a class that was never there. **Always use `INTER_NEAREST` for masks and label maps.** The image and its mask need different interpolation, which is exactly the sort of asymmetry that gets missed." },

  { h: "Normalisation, and where those numbers come from" },
  { p: "Networks train badly on inputs in the range 0–255. Normalisation rescales to something small and centred around zero." },
  { code: { lang: "python", t: "The line you will copy a hundred times",
    lines: [
     { c: "from torchvision import transforms", w: "" },
     { c: "", w: "" },
     { c: "tf = transforms.Compose([", w: "" },
     { c: "    transforms.Resize(256),", w: "" },
     { c: "    transforms.CenterCrop(224),", w: "" },
     { c: "    transforms.ToTensor(),", w: "Converts to a tensor **and divides by 255**, giving 0–1." },
     { c: "    transforms.Normalize(mean=[0.485, 0.456, 0.406],", w: "" },
     { c: "                         std=[0.229, 0.224, 0.225]),", w: "**These are the ImageNet channel statistics.**" },
     { c: "])", w: "" }
    ] } },
  { p: "Those six numbers are not arbitrary and not magic: they are the per-channel mean and standard deviation of the ImageNet training set. Every pretrained vision model was trained on inputs normalised with them, so if you feed it anything else, you are handing it data from a distribution it has never seen." },
  { n: "This is the most common cause of *my pretrained model gives nonsense*. The weights are fine, the image is fine, and the input distribution is wrong. Use the exact normalisation the model was trained with — for torchvision models it is in the weights' `transforms()` metadata, so you need not remember the numbers.",
    nt: "Why the pretrained model is not working" },

  { h: "Train/serve skew, in vision form" },
  { p: "You have met this failure in the ML track. In vision it is more common, because preprocessing lives in two places: a training script and a serving path, written weeks apart." },
  { ol: [
   "Training resizes with PIL; serving resizes with OpenCV — subtly different results.",
   "Training normalises; serving forgets — the model receives 0–255 and outputs confident nonsense.",
   "Training uses RGB; serving uses OpenCV's BGR — every colour is wrong and nothing errors.",
   "Training centre-crops; serving squashes the whole frame."
  ] },
  { p: "The fix is structural: **write the preprocessing once, in one function, and import it in both places.** Never re-implement it on the serving side, however simple it looks." },

  { tryit: { t: "Build the letterbox, and check your maths",
    task: "Write a `letterbox(img, size)` function that resizes without distortion and pads to a square. Confirm the output is exactly the requested size and that the aspect ratio of the content is unchanged.",
    hint: "Scale by `size / max(h, w)`, then pad the difference. Watch for odd numbers of padding pixels.",
    sol: { lang: "python", code: "import cv2, numpy as np\n\ndef letterbox(img, size=224, fill=114):\n    h, w = img.shape[:2]\n    s = size / max(h, w)\n    nh, nw = int(round(h * s)), int(round(w * s))\n    resized = cv2.resize(img, (nw, nh), interpolation=cv2.INTER_AREA)\n\n    canvas = np.full((size, size, 3), fill, dtype=np.uint8)\n    top, left = (size - nh) // 2, (size - nw) // 2\n    canvas[top:top + nh, left:left + nw] = resized\n    return canvas, s, left, top          # return the transform, you will need it\n\nimg = np.zeros((1080, 1920, 3), np.uint8)\nout, s, dx, dy = letterbox(img)\nprint(out.shape, 'scale', round(s, 4), 'offset', dx, dy)" },
    w: "Returning `s`, `dx` and `dy` matters: to map a detection box back onto the original photograph you must undo exactly this transform. Forgetting to return it is why boxes land in the wrong place." } },

  { vocab: ["Image Preprocessing", "Data Augmentation"] }
 ],
 k: [
  "Squashing destroys aspect ratio; letterboxing preserves it and is required for detection.",
  "INTER_AREA to shrink, INTER_NEAREST for masks — averaging labels invents classes.",
  "The ImageNet mean/std numbers exist because pretrained models were trained with them.",
  "Wrong normalisation is the usual cause of a pretrained model producing nonsense.",
  "Write preprocessing once and import it in both training and serving."
 ],
 r: ["Image Preprocessing", "Data Augmentation", "Transfer Learning"]
},

{
 t: "Filters, Edges and Why Classical Vision Still Ships",
 m: "classic",
 lvl: "core",
 s: "Exact, free, debuggable, and running on a microcontroller near you right now.",
 goal: [
  "Explain how a blur and an edge detector are the same operation with different numbers",
  "Apply thresholding and contour finding to a real task",
  "Say when classical vision beats a neural network"
 ],
 b: [
  { p: "Before neural networks, computer vision was people designing filters by hand. It is tempting to treat that as history. It is not — a great deal of production vision is still exactly this, because a threshold is exact, free, and runs on a chip costing two dollars." },

  { h: "A filter is a small grid of numbers" },
  { p: "Take a 3×3 grid of weights. Lay it over a patch of the image, multiply each pixel by the weight above it, add the nine results, and write that single number to the output. Slide along and repeat." },
  { p: "That operation is **convolution**, and it is the entire basis of both classical filtering and the neural networks later in this track. The only difference is where the nine numbers come from." },
  { tbl: { t: "Same operation, different weights",
    h: ["Kernel", "Numbers", "Effect"],
    rows: [
     ["**Blur**", "All ⅑", "Average of neighbours — noise falls away"],
     ["**Sharpen**", "Centre 5, neighbours −1", "Amplifies difference from surroundings"],
     ["**Sobel X**", "`[-1 0 1; -2 0 2; -1 0 1]`", "**Vertical edges** — left minus right"],
     ["**Sobel Y**", "Same, rotated", "Horizontal edges"]
    ] } },
  { p: "Look at Sobel X for a moment. It subtracts the pixels on the left from the pixels on the right. Where the image is flat, that difference is zero. Where brightness changes sharply — an edge — it is large. **Edge detection is subtraction.** That is the whole idea, and once seen it never looks mysterious again." },

  { code: { lang: "python", t: "Filters in practice",
    lines: [
     { c: "grey = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)", w: "Edge work is done on brightness, not colour." },
     { c: "", w: "" },
     { c: "blur = cv2.GaussianBlur(grey, (5, 5), 0)", w: "**Always blur before edge detection.** Noise is a sharp change, and an edge detector cannot tell it from a real edge." },
     { c: "edges = cv2.Canny(blur, 100, 200)", w: "Two thresholds: strong edges above 200, weak ones above 100 kept only if connected to a strong one." },
     { c: "", w: "" },
     { c: "sx = cv2.Sobel(grey, cv2.CV_64F, 1, 0, ksize=3)", w: "Raw gradient in x. Note `CV_64F` — gradients go negative, and uint8 would clip them to zero." }
    ] } },
  { trap: "Computing gradients into a `uint8` array silently destroys half your edges. A dark-to-light edge is positive and a light-to-dark edge is negative, and unsigned integers cannot hold the negative half — so they clip to zero and one side of every object disappears. Use a signed float type, then take the absolute value." },

  { h: "Thresholding and contours: a complete pipeline" },
  { p: "For controlled scenes — a factory line, a document scanner, a chessboard — this five-step pipeline solves a startling number of real problems with no training data at all." },
  { code: { lang: "python", t: "Counting objects on a conveyor",
    lines: [
     { c: "grey = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)", w: "1. Simplify to brightness." },
     { c: "blur = cv2.GaussianBlur(grey, (5, 5), 0)", w: "2. Remove noise." },
     { c: "_, binary = cv2.threshold(blur, 0, 255,", w: "3. Split into foreground and background." },
     { c: "            cv2.THRESH_BINARY + cv2.THRESH_OTSU)", w: "**Otsu picks the threshold for you** by finding the split that best separates the two brightness groups." },
     { c: "", w: "" },
     { c: "contours, _ = cv2.findContours(binary,", w: "4. Trace the outline of every connected white region." },
     { c: "            cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)", w: "`RETR_EXTERNAL` ignores holes inside objects." },
     { c: "", w: "" },
     { c: "big = [c for c in contours if cv2.contourArea(c) > 500]", w: "5. Filter out specks. **This line is most of the accuracy.**" },
     { c: "print(f'{len(big)} objects')", w: "" }
    ] } },
  { p: "Every contour then gives you free measurements: `cv2.boundingRect` for a box, `cv2.contourArea` for size, `cv2.arcLength` for perimeter, `cv2.moments` for the centre. A shape can be classified by the ratio of its area to its perimeter without any learning at all." },

  { h: "When classical beats learned" },
  { ana: "You would not train a neural network to decide whether a number is even. You would check the last digit. Reaching for a model when an exact rule exists is the same category of mistake — you are paying data, compute and unpredictability for something arithmetic already answers perfectly.",
    at: "Checking the last digit" },
  { tbl: { t: "Choose deliberately",
    h: ["Situation", "Use"],
    rows: [
     ["Controlled lighting, known objects", "**Classical** — exact and free"],
     ["Must run on a microcontroller", "**Classical** — no model fits"],
     ["Must be explainable line by line", "**Classical**"],
     ["No training data at all", "**Classical**, to start"],
     ["Varying lighting, angle, background", "Neural network"],
     ["Objects vary in appearance", "Neural network"],
     ["Human-level judgement needed", "Neural network"]
    ] } },
  { n: "A hybrid is very often the answer, and it is what experienced teams build. Use classical CV to find candidate regions cheaply — anything roughly the right size and colour — then run a small network only on those crops. Ten times faster than sweeping a network over the whole frame, and much easier to debug when it goes wrong.",
    nt: "The hybrid that wins in practice" },

  { tryit: { t: "Count objects without any training data",
    task: "Generate an image containing several filled shapes, then count them with threshold + contours. Print each one's area and bounding box.",
    hint: "Draw circles and rectangles on a black canvas. Filter contours by area to ignore noise.",
    sol: { lang: "python", code: "import cv2, numpy as np\n\nimg = np.zeros((300, 400), np.uint8)\ncv2.circle(img, (80, 80), 40, 255, -1)\ncv2.circle(img, (250, 120), 55, 255, -1)\ncv2.rectangle(img, (60, 190), (160, 270), 255, -1)\ncv2.circle(img, (330, 250), 6, 255, -1)      # a speck, to be filtered out\n\nblur = cv2.GaussianBlur(img, (5, 5), 0)\n_, binary = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)\ncontours, _ = cv2.findContours(binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)\n\nbig = [c for c in contours if cv2.contourArea(c) > 500]\nprint(f'{len(contours)} contours, {len(big)} real objects')\nfor c in big:\n    x, y, w, h = cv2.boundingRect(c)\n    print(f'  area {cv2.contourArea(c):7.0f}  box ({x},{y},{w},{h})')" },
    w: "Three objects found, the speck rejected, and no model, no dataset and no GPU involved. On a controlled scene this is not a toy — it is the production answer." } },

  { vocab: ["Edge Detection", "OpenCV", "Histogram Equalisation"] }
 ],
 k: [
  "A filter is a small grid of weights slid across the image — convolution, done by hand.",
  "Edge detection is subtraction: left minus right is a vertical edge detector.",
  "Blur before detecting edges, and compute gradients into a signed type.",
  "Threshold + contours + an area filter solves a great many controlled-scene problems with no training.",
  "Classical wins on controlled scenes, tiny hardware and explainability; hybrids often win overall."
 ],
 r: ["Edge Detection", "OpenCV", "Image Preprocessing", "SIFT"]
}

]);
