/* Computer Vision — transformers, vision-language models, and shipping.

   The last module covers the shift still working through the field, and then
   the part that decides whether any of it matters: getting a model running
   fast enough, on hardware someone will pay for.

   The deployment lesson is deliberately the final one in the track. Vision is
   the branch of AI most likely to run somewhere physical and constrained — a
   camera on a production line, a phone, a drone — and a model that needs an
   A100 to hit frame rate has not solved the problem it was built for. That is
   a different failure from an inaccurate model and it is much more common
   than courses admit. */
TD.addLessons("cv", [

{
 t: "Vision Transformers: Images as Sequences",
 m: "modern",
 lvl: "advanced",
 s: "The architecture that took over language, applied to pictures — and what it gave up to get there.",
 goal: [
  "Explain how an image becomes a sequence of tokens",
  "Say what inductive bias a CNN has that a ViT does not",
  "Choose between a CNN and a ViT on the size of your dataset"
 ],
 b: [
  { p: "In 2020 a paper asked what happens if you apply a transformer to images with essentially no vision-specific machinery. The answer, given enough data, was: it wins. The paper's title said the quiet part — *an image is worth 16×16 words*." },

  { h: "How an image becomes a sentence" },
  { p: "A transformer consumes a sequence of tokens. So chop the image into a grid of fixed patches and call each patch a token." },
  { code: { lang: "python", t: "The whole preparation step",
    lines: [
     { c: "# a 224x224 image, 16x16 patches", w: "" },
     { c: "(224 // 16) ** 2", w: "**196 patches** — a sequence of 196 tokens." },
     { c: "16 * 16 * 3", w: "**768 numbers** per patch, flattened." },
     { c: "", w: "" },
     { c: "# each patch is projected to the model dimension,", w: "" },
     { c: "# a position embedding is added, and the whole", w: "**Position embeddings are essential** — without them the transformer has no idea which patch was where. It is permutation-invariant by nature." },
     { c: "# sequence goes into a standard transformer encoder.", w: "" }
    ] } },
  { p: "That is genuinely it. No convolutions, no pooling. The same encoder architecture as a language model, fed squares of a photograph instead of words." },

  { h: "What was given up" },
  { p: "A convolutional network has locality and translation invariance **built in** — it cannot help but treat nearby pixels as related, because that is what the architecture does. These are **inductive biases**: assumptions baked into the structure rather than learned." },
  { p: "A vision transformer has almost none of that. Every patch can attend to every other patch from layer one; nothing tells it that adjacent patches are more related than distant ones. It must learn that from data." },
  { tbl: { t: "The consequence, and it is stark",
    h: ["Dataset size", "Better choice", "Why"],
    rows: [
     ["< 10k images", "**CNN**, pretrained", "ViT has too little data to learn what a CNN assumes for free"],
     ["10k–1M", "Either; a pretrained ViT is competitive", "Transfer learning supplies what the data does not"],
     ["> 100M", "**ViT**", "With enough data, learned structure beats assumed structure"]
    ] } },
  { ana: "A CNN is an apprentice told in advance that things near each other are related. A ViT is one told nothing and left to work it out. Given a dozen examples the apprentice with the hint does better. Given a decade of examples the one who worked it out has learned finer distinctions than the hint allowed.",
    at: "Two apprentices" },
  { n: "This generalises well beyond vision, and it is worth carrying: **inductive bias substitutes for data.** Structural assumptions help when data is scarce and become a ceiling when data is abundant. That trade explains a great deal of the last decade of architecture research.",
    nt: "The idea underneath" },

  { h: "In practice" },
  { p: "You will rarely train either from scratch, so the choice is really about which pretrained backbone to fine-tune — and the honest answer for most projects is still a ConvNeXt or ResNet, because most projects have thousands of images rather than millions." },
  { code: { lang: "python", t: "Both, the same way",
    lines: [
     { c: "import timm", w: "The library with essentially every pretrained vision model." },
     { c: "", w: "" },
     { c: "cnn = timm.create_model('resnet50', pretrained=True, num_classes=10)", w: "" },
     { c: "vit = timm.create_model('vit_base_patch16_224', pretrained=True, num_classes=10)", w: "Identical interface." },
     { c: "", w: "" },
     { c: "cfg = timm.data.resolve_data_config({}, model=vit)", w: "**Get the model's own preprocessing.** Different backbones expect different normalisation." },
     { c: "tf = timm.data.create_transform(**cfg)", w: "" }
    ] } },
  { trap: "A ViT's position embeddings are learned for one specific image size, so feeding it a different resolution silently degrades or errors. CNNs are far more forgiving — they slide the same kernels over whatever arrives. If you fine-tune a ViT at 224 and serve at 384, you must interpolate the position embeddings; `timm` will do it, but only if you ask." },

  { tryit: { t: "Compare them on a small dataset",
    task: "Fine-tune a pretrained ResNet and a pretrained ViT on the same small dataset. Compare accuracy, training time and the number of epochs each needs.",
    hint: "Use `timm` for both so the only difference is the backbone. Keep the head, optimiser and augmentation identical.",
    sol: { lang: "python", code: "import timm, torch, time\n\ndef build(name, n_classes):\n    m = timm.create_model(name, pretrained=True, num_classes=n_classes)\n    for p in m.parameters():\n        p.requires_grad = False\n    for p in m.get_classifier().parameters():\n        p.requires_grad = True\n    return m\n\nfor name in ['resnet50', 'vit_base_patch16_224']:\n    m = build(name, 10)\n    n_train = sum(p.numel() for p in m.parameters() if p.requires_grad)\n    n_total = sum(p.numel() for p in m.parameters())\n    print(f'{name:24s} {n_total/1e6:6.1f}M params, {n_train:,} trainable')\n\n    x = torch.randn(8, 3, 224, 224)\n    t0 = time.time()\n    with torch.no_grad():\n        m(x)\n    print(f'{\"\":24s} forward pass {time.time()-t0:.3f}s')" },
    w: "On a small dataset the ResNet usually matches or beats the ViT and runs faster. That result surprises people who assume newer means better — it is dataset size, not calendar year, that decides." } },

  { vocab: ["Vision Transformer", "Attention Mechanism", "Transfer Learning"] }
 ],
 k: [
  "A ViT splits the image into fixed patches and treats each as a token in a sequence.",
  "Position embeddings are essential, because a transformer has no inherent notion of where a patch was.",
  "CNNs have locality and translation invariance built in; ViTs must learn them from data.",
  "Below roughly 10k images a pretrained CNN usually wins; above ~100M the ViT does.",
  "Inductive bias substitutes for data — and becomes a ceiling once data is plentiful."
 ],
 r: ["Vision Transformer", "Attention Mechanism", "Transfer Learning", "ResNet"]
},

{
 t: "CLIP: Putting Images and Words in One Space",
 m: "modern",
 lvl: "advanced",
 s: "Search photographs with a sentence, and classify things the model was never trained on.",
 goal: [
  "Explain contrastive training in one paragraph",
  "Build zero-shot classification with no training data",
  "Say honestly where CLIP fails"
 ],
 b: [
  { p: "Every model so far needed labelled examples of your classes. CLIP does not — and the reason it does not is one of the more elegant ideas in modern machine learning." },

  { h: "How it was trained" },
  { p: "Take 400 million image–caption pairs scraped from the internet. Encode each image with a vision model and each caption with a text model, into vectors of the same size. Then train so that **matching pairs land close together and mismatched pairs are pushed apart.**" },
  { p: "That is contrastive learning. There is no classification head, no fixed set of categories. The result is a single shared space where the vector for a photograph of a dog sits near the vector for the words *a photo of a dog*." },
  { ana: "Two people describing the same scene, one in English and one in French, learning to point at the same spot on a shared map. Once the map exists, you can say something in French and find the English speaker's photograph — without ever having translated directly.",
    at: "The shared map" },

  { h: "Zero-shot classification" },
  { p: "Because captions live in the same space as images, you can classify by writing the class names as sentences and asking which is nearest." },
  { code: { lang: "python", t: "Classification with no training data at all",
    lines: [
     { c: "import torch, clip", w: "" },
     { c: "from PIL import Image", w: "" },
     { c: "", w: "" },
     { c: "model, preprocess = clip.load('ViT-B/32')", w: "" },
     { c: "", w: "" },
     { c: "labels = ['a photo of a cracked panel',", w: "**Full sentences, not bare words.**" },
     { c: "          'a photo of an undamaged panel',", w: "" },
     { c: "          'a photo of a rusted panel']", w: "" },
     { c: "text = clip.tokenize(labels)", w: "" },
     { c: "image = preprocess(Image.open('panel.jpg')).unsqueeze(0)", w: "" },
     { c: "", w: "" },
     { c: "with torch.no_grad():", w: "" },
     { c: "    logits, _ = model(image, text)", w: "" },
     { c: "    probs = logits.softmax(dim=-1)", w: "" },
     { c: "print(dict(zip(labels, probs[0].tolist())))", w: "A working classifier, with zero labelled examples." }
    ] } },
  { n: "The phrasing of your labels matters more than seems reasonable. `'a photo of a {}'` beats a bare class name by several points, because the training captions were sentences and the text encoder is tuned to that distribution. This is prompt engineering, arriving in computer vision — and testing three or four phrasings on a validation set is genuinely worth the ten minutes.",
    nt: "Prompt engineering, for images" },

  { h: "Semantic image search" },
  { p: "The same property gives you search. Embed your image library once, then embed a query sentence and find the nearest images." },
  { code: { lang: "python", t: "Search a photo library by description",
    lines: [
     { c: "# once, offline:", w: "" },
     { c: "with torch.no_grad():", w: "" },
     { c: "    feats = torch.cat([model.encode_image(preprocess(Image.open(p)).unsqueeze(0))", w: "" },
     { c: "                       for p in paths])", w: "" },
     { c: "    feats /= feats.norm(dim=-1, keepdim=True)", w: "**Normalise**, so a dot product is cosine similarity." },
     { c: "", w: "" },
     { c: "# per query:", w: "" },
     { c: "q = model.encode_text(clip.tokenize(['a dog on a beach at sunset']))", w: "" },
     { c: "q /= q.norm(dim=-1, keepdim=True)", w: "" },
     { c: "best = (feats @ q.T).squeeze().topk(5)", w: "Five nearest images to that sentence." }
    ] } },
  { p: "No tags, no metadata, no manual curation. This is how modern photo apps let you search for *birthday cake* in pictures nobody labelled." },

  { h: "Where it fails" },
  { p: "CLIP is genuinely useful and routinely oversold. Four honest limits:" },
  { ol: [
   "**Counting.** *Three cats* and *five cats* embed almost identically. CLIP has very little numeracy.",
   "**Spatial relations.** *A cat on a box* versus *a box on a cat* — the words are the same and the embeddings nearly are.",
   "**Fine-grained distinctions.** Dog breeds, specific components, medical findings. A small model fine-tuned on your data will beat it comfortably.",
   "**Text in images.** It picks up on written words in a picture and can be led badly astray by them — a famous demonstration fooled it by taping a handwritten label onto an object."
  ] },
  { trap: "CLIP inherits the biases of 400 million unfiltered internet captions, and it inherits them strongly. It carries measurable associations between appearance and profession, nationality and character. Before deploying it anywhere that touches people, test it explicitly for that — this is not a theoretical concern, and 'we used a pretrained model' is not a defence anyone will accept." },

  { p: "The realistic pattern: use CLIP zero-shot to get something working in an afternoon and to find out whether the task is feasible at all. If accuracy is short, use it to label a starter dataset, then fine-tune a small supervised model on that. You have skipped the cold start, which is usually the expensive part." },

  { tryit: { t: "Build a searchable photo library",
    task: "Embed a folder of your own photographs with CLIP, then search them with three written descriptions. Also try zero-shot classification with two different label phrasings and compare.",
    hint: "Normalise the embeddings, then a matrix multiply gives all similarities at once.",
    sol: { lang: "python", code: "import torch, clip, glob\nfrom PIL import Image\n\nmodel, preprocess = clip.load('ViT-B/32')\npaths = glob.glob('photos/*.jpg')\n\nwith torch.no_grad():\n    feats = torch.cat([model.encode_image(preprocess(Image.open(p)).unsqueeze(0))\n                       for p in paths])\n    feats /= feats.norm(dim=-1, keepdim=True)\n\ndef search(query, k=3):\n    with torch.no_grad():\n        q = model.encode_text(clip.tokenize([query]))\n        q /= q.norm(dim=-1, keepdim=True)\n    sims = (feats @ q.T).squeeze(1)\n    top = sims.topk(min(k, len(paths)))\n    for score, i in zip(top.values, top.indices):\n        print(f'  {score:.3f}  {paths[i]}')\n\nfor q in ['something to eat', 'a person outdoors', 'text on a screen']:\n    print(q)\n    search(q)" },
    w: "Try 'cat' versus 'a photo of a cat' as labels and watch the confidences shift. That gap is the prompt-engineering effect, and it is larger than most people expect." } },

  { vocab: ["CLIP", "Embedding", "Zero-Shot Learning"] }
 ],
 k: [
  "CLIP trains image and text encoders so matching pairs land close in one shared space.",
  "Zero-shot classification works by embedding class names as sentences and taking the nearest.",
  "Label phrasing matters — 'a photo of a {}' beats a bare class name.",
  "It is weak at counting, spatial relations, fine-grained classes and text inside images.",
  "It carries internet-scale bias; test explicitly before using it on anything involving people."
 ],
 r: ["CLIP", "Embedding", "Zero-Shot Learning", "Cosine Similarity"]
},

{
 t: "Shipping a Vision Model",
 m: "modern",
 lvl: "intermediate",
 s: "A model that misses frame rate on the hardware you can afford has not solved the problem.",
 goal: [
  "Measure inference latency honestly",
  "Apply the levers that make a model fast enough",
  "Handle the failure modes specific to deployed vision"
 ],
 b: [
  { p: "Vision runs in physical places — a camera above a conveyor, a phone, a drone, a till. Those places have a frame rate to hit and a budget for hardware, and a model that needs a data-centre GPU to keep up has not solved the problem it was built for." },

  { h: "Measure it properly" },
  { code: { lang: "python", t: "The benchmark people get wrong",
    lines: [
     { c: "import torch, time", w: "" },
     { c: "", w: "" },
     { c: "model.eval()", w: "**Essential.** Leaves dropout off and batch-norm in inference mode." },
     { c: "x = torch.randn(1, 3, 224, 224)", w: "" },
     { c: "", w: "" },
     { c: "with torch.no_grad():", w: "No gradients — otherwise you measure training, not serving." },
     { c: "    for _ in range(10):", w: "" },
     { c: "        model(x)", w: "**Warm up.** The first runs include lazy initialisation and are not representative." },
     { c: "", w: "" },
     { c: "    if torch.cuda.is_available():", w: "" },
     { c: "        torch.cuda.synchronize()", w: "**GPU calls are asynchronous.** Without this you time how fast Python queues work, not how fast it runs." },
     { c: "    t0 = time.perf_counter()", w: "" },
     { c: "    for _ in range(100):", w: "" },
     { c: "        model(x)", w: "" },
     { c: "    if torch.cuda.is_available():", w: "" },
     { c: "        torch.cuda.synchronize()", w: "" },
     { c: "    ms = (time.perf_counter() - t0) * 10", w: "" },
     { c: "print(f'{ms:.1f} ms  ({1000 / ms:.0f} fps)')", w: "" }
    ] } },
  { trap: "Forgetting `torch.cuda.synchronize()` produces benchmark numbers that are wildly, impossibly fast — people report 2 ms for models that take 40 — because CUDA calls return immediately and the work happens later. If a measurement looks too good, this is almost always why." },

  { h: "The levers, in order of return" },
  { tbl: { t: "What actually makes it fast enough",
    h: ["Lever", "Typical gain", "Cost"],
    rows: [
     ["**Smaller input**", "**2–4×**", "Accuracy on small objects. Try it first — often free"],
     ["**Smaller model**", "**2–10×**", "Some accuracy; usually less than feared"],
     ["**Batching**", "**2–5× throughput**", "Latency per item rises. Only for offline work"],
     ["**FP16 / half precision**", "**~2× on GPU**", "Almost none in practice"],
     ["**ONNX Runtime / TensorRT**", "**2–5×**", "An export step and a version to maintain"],
     ["**INT8 quantisation**", "**2–4×**", "1–3 accuracy points; needs calibration data"]
    ] } },
  { p: "Start at the top. Halving the input resolution is one line and frequently gets you the whole way, and it is reversible in a way that retraining a smaller model is not." },

  { code: { lang: "python", t: "Export to ONNX, which is the usual production path",
    lines: [
     { c: "torch.onnx.export(", w: "" },
     { c: "    model, torch.randn(1, 3, 224, 224), 'model.onnx',", w: "" },
     { c: "    input_names=['input'], output_names=['output'],", w: "" },
     { c: "    dynamic_axes={'input': {0: 'batch'}},", w: "**Allow a variable batch size**, or you are locked to exactly one image per call." },
     { c: "    opset_version=17,", w: "" },
     { c: ")", w: "" },
     { c: "", w: "" },
     { c: "import onnxruntime as ort", w: "" },
     { c: "sess = ort.InferenceSession('model.onnx')", w: "No PyTorch needed at serving time — a much smaller install." },
     { c: "out = sess.run(None, {'input': arr})[0]", w: "" }
    ] } },
  { n: "Always compare outputs before and after any export or quantisation, on a fixed batch. `np.testing.assert_allclose(torch_out, onnx_out, rtol=1e-3)`. Conversions do occasionally change behaviour — an unsupported operator silently substituted, a precision difference compounding — and discovering that in production rather than in a two-line check is a bad afternoon.",
    nt: "The check that takes two lines" },

  { h: "Failures specific to deployed vision" },
  { ol: [
   "**The camera moved.** Someone knocked the mount and every frame is now shifted. Accuracy falls off a cliff with no code change. Monitor the input distribution, exactly as in the ML track.",
   "**The lighting changed.** Trained in summer daylight, deployed in winter, or someone replaced a fluorescent tube. This is data drift with a physical cause you can often just fix.",
   "**A new product variant.** The model has never seen this packaging. Detected as nothing, or as the wrong thing, confidently.",
   "**Dirt on the lens.** Genuinely one of the most common causes of a degraded industrial vision system, and no amount of model work addresses it.",
   "**Compression.** Your training images were clean PNGs; production frames arrive as heavily compressed JPEG from a network camera. Train on what you will actually receive."
  ] },
  { p: "That list is why deployed vision needs a saved sample of production frames. When accuracy drops, the first question is *what does the input look like now* — and without stored frames it is unanswerable." },

  { h: "The confidence threshold is a product decision" },
  { p: "Exactly as in the ML track, the model gives a score and you choose the cut. In vision this is usually visible to a person, which makes the conversation concrete:" },
  { ol: [
   "**High threshold** — few false alarms, some defects missed. Right when a human checks everything anyway and you are saving them time.",
   "**Low threshold** — catch nearly everything, more false alarms. Right when missing one is expensive and a person reviews the flags.",
   "**Two thresholds** — auto-accept above 0.9, auto-reject below 0.3, send the middle to a human. Usually the best answer, and it needs no model change."
  ] },

  { tryit: { t: "Make a model twice as fast",
    task: "Benchmark a pretrained model properly. Then apply two levers — smaller input and half precision, or ONNX export — and measure again. Verify the outputs still agree.",
    hint: "Warm up, synchronize, and compare outputs with `assert_allclose` at a sensible tolerance.",
    sol: { lang: "python", code: "import torch, time, timm\n\ndef bench(model, size, half=False, n=50):\n    model = model.eval()\n    x = torch.randn(1, 3, size, size)\n    if half and torch.cuda.is_available():\n        model, x = model.half().cuda(), x.half().cuda()\n    with torch.no_grad():\n        for _ in range(10):\n            model(x)\n        if torch.cuda.is_available():\n            torch.cuda.synchronize()\n        t0 = time.perf_counter()\n        for _ in range(n):\n            model(x)\n        if torch.cuda.is_available():\n            torch.cuda.synchronize()\n    ms = (time.perf_counter() - t0) / n * 1000\n    return ms\n\nm = timm.create_model('resnet50', pretrained=True)\nfor size in (224, 160, 128):\n    ms = bench(m, size)\n    print(f'{size}x{size}: {ms:6.1f} ms  ({1000/ms:5.1f} fps)')" },
    w: "Dropping from 224 to 128 is usually close to a 3× speed-up for one changed number. Check what it costs you on your own validation set — frequently far less than expected." } },

  { vocab: ["Object Tracking", "Model Drift", "Quantisation"] }
 ],
 k: [
  "Benchmark with eval mode, no_grad, a warm-up, and cuda.synchronize — or your numbers are fiction.",
  "Try smaller input first: one line, often a 2–4× gain.",
  "ONNX Runtime or TensorRT gives 2–5× and drops the PyTorch dependency at serving time.",
  "Always compare outputs before and after export or quantisation.",
  "Deployed vision fails from moved cameras, changed lighting, new variants, dirty lenses and compression — store production frames so you can see it."
 ],
 r: ["Model Drift", "Quantisation", "Object Tracking", "Data Drift"]
}

]);
