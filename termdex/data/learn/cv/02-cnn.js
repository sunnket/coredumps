/* Computer Vision — convolutional networks, and transfer learning.

   The DL track teaches neural networks in general. This module teaches the
   one architectural idea that made vision work, and it is deliberately built
   in the opposite order from most courses: the *problem* first (a dense layer
   on an image is absurd), then convolution as the answer, then the animated
   diagram, and only then any code.

   The transfer-learning module that follows is the most practically important
   in the whole track. Almost nobody trains a vision model from scratch, and a
   reader who leaves believing they should will waste weeks and a lot of money
   before discovering otherwise. */
TD.addLessons("cv", [

{
 t: "Why a Normal Network Cannot See",
 m: "cnn",
 lvl: "core",
 s: "Work out the parameter count for one dense layer on one photograph. The number ends the argument.",
 goal: [
  "Calculate why a fully connected layer is hopeless for images",
  "State the two assumptions convolution makes about pictures",
  "Explain parameter sharing and translation invariance"
 ],
 b: [
  { p: "Before convolution can seem clever, the problem it solves has to be felt. So do the arithmetic." },

  { h: "The number that settles it" },
  { p: "Take a modest 224×224 colour photograph and feed it to an ordinary fully connected layer with 1,000 neurons — the kind used everywhere else in deep learning." },
  { code: { lang: "python", t: "One layer",
    lines: [
     { c: "pixels = 224 * 224 * 3", w: "**150,528** input values." },
     { c: "neurons = 1000", w: "" },
     { c: "params = pixels * neurons", w: "**150,528,000 parameters.** For one layer." }
    ] } },
  { p: "A hundred and fifty million weights, in the first layer alone, for one small image. A real network has dozens of layers. The memory is impossible, the data required to fit that many parameters is impossible, and it would overfit catastrophically on anything you could actually collect." },
  { p: "And it gets worse. That layer has **no idea that neighbouring pixels are related**. Pixel (0,0) and pixel (0,1) are adjacent in the photograph and are just two arbitrary inputs to it. Shuffle every pixel in your dataset by the same random permutation and the network learns equally well — which tells you it was never using the spatial structure at all." },

  { h: "Two assumptions, and everything follows" },
  { p: "Convolution is what you get if you take two obvious facts about photographs seriously." },
  { ol: [
   "**Locality.** What makes a patch of image meaningful is mostly its immediate neighbourhood. To decide whether there is an edge at a point, you need the pixels around that point — not pixels in the far corner.",
   "**Translation invariance.** A cat in the top-left is the same cat as one in the bottom-right. A detector that finds whiskers should work everywhere in the frame, not be relearned per position."
  ] },
  { p: "Take those seriously and you get: **a small window of weights, applied identically at every position.** That is a convolutional layer, and it is not a trick — it is the direct consequence of two things everyone already believes about pictures." },

  { dg: "cv-convolution" },

  { h: "What that buys" },
  { code: { lang: "python", t: "The same job, honestly counted",
    lines: [
     { c: "# dense layer, 1000 neurons", w: "" },
     { c: "224 * 224 * 3 * 1000", w: "**150,528,000 parameters**" },
     { c: "", w: "" },
     { c: "# convolutional layer, 64 filters of 3x3", w: "" },
     { c: "3 * 3 * 3 * 64 + 64", w: "**1,792 parameters** — around 84,000 times fewer." }
    ] } },
  { p: "And it is not merely smaller. It is **better**, because the constraint encodes something true. A filter that learned to find a vertical edge in the top-left automatically finds vertical edges everywhere, since it is the same nine numbers applied at every position. You could not have got that from a dense layer without showing it edges in every location separately." },
  { ana: "Hiring one inspector who walks the whole factory floor, rather than a thousand inspectors who each watch one square metre and must be trained individually. The single roving inspector has less to learn, learns it from more examples, and cannot be fooled by an object moving two metres to the left.",
    at: "One inspector, walking" },

  { h: "The vocabulary you will meet constantly" },
  { tbl: { t: "Four terms that appear in every architecture description",
    h: ["Term", "What it is", "Effect"],
    rows: [
     ["**Kernel size**", "The window — usually 3×3", "Larger sees more per step, costs more"],
     ["**Stride**", "How far the window jumps", "Stride 2 halves the output size"],
     ["**Padding**", "A border added before sliding", "`same` padding keeps the output size equal to the input"],
     ["**Channels**", "How many different filters", "Each learns a different pattern"]
    ] } },
  { code: { lang: "python", t: "The output size formula, worth memorising",
    lines: [
     { c: "out = (in - kernel + 2 * padding) // stride + 1", w: "" },
     { c: "", w: "" },
     { c: "# 224 input, 3x3 kernel, padding 1, stride 1:", w: "" },
     { c: "(224 - 3 + 2) // 1 + 1", w: "**224** — unchanged. This is why 3×3 with padding 1 is everywhere." },
     { c: "", w: "" },
     { c: "# same kernel, stride 2:", w: "" },
     { c: "(224 - 3 + 2) // 2 + 1", w: "**112** — halved. This is how networks shrink the image as they go deeper." }
    ] } },
  { trap: "A shape mismatch is the most common error you will hit building vision models, and the message is unhelpful — usually a matrix multiplication complaining about dimensions somewhere far from the real cause. Print `x.shape` after every layer while you are building. The formula above tells you what it should be; when the two disagree, you have found your bug immediately instead of an hour later." },

  { tryit: { t: "Count the parameters yourself",
    task: "Write a function that computes the parameter count for a dense layer and for a convolutional layer on the same input, and print the ratio. Then compute the output size for a few kernel/stride/padding combinations.",
    hint: "Conv parameters are `k * k * in_channels * out_channels + out_channels` — the bias is one per output channel.",
    sol: { lang: "python", code: "def dense_params(h, w, c, neurons):\n    return h * w * c * neurons + neurons\n\ndef conv_params(k, cin, cout):\n    return k * k * cin * cout + cout\n\nd = dense_params(224, 224, 3, 1000)\nc = conv_params(3, 3, 64)\nprint(f'dense: {d:,}')\nprint(f'conv:  {c:,}')\nprint(f'ratio: {d / c:,.0f}x')\n\ndef out_size(n, k, p, s):\n    return (n - k + 2 * p) // s + 1\n\nfor k, p, s in [(3, 1, 1), (3, 1, 2), (7, 3, 2), (1, 0, 1)]:\n    print(f'k={k} p={p} s={s}: 224 -> {out_size(224, k, p, s)}')" },
    w: "The last row — a 1×1 kernel — looks pointless and is not. It mixes channels without touching spatial layout, and it is how networks cheaply change their channel count. You will see it constantly in ResNet and beyond." } },

  { vocab: ["Convolutional Neural Network", "Computer Vision"] }
 ],
 k: [
  "A dense layer on a 224×224 image needs 150 million parameters and ignores spatial structure entirely.",
  "Convolution follows from two facts about images: locality and translation invariance.",
  "A 3×3 conv layer with 64 filters uses about 1,800 parameters — roughly 84,000× fewer.",
  "out = (in − kernel + 2·padding) / stride + 1. Memorise it; it prevents most shape errors.",
  "3×3 with padding 1 keeps the size; stride 2 halves it."
 ],
 r: ["Convolutional Neural Network", "Computer Vision", "Pooling"]
},

{
 t: "Building a CNN: Pooling, Depth and ResNet",
 m: "cnn",
 lvl: "intermediate",
 s: "From one convolution to a real architecture, and the one idea that made very deep networks trainable.",
 goal: [
  "Explain what pooling does and why architectures are moving away from it",
  "Describe the receptive field and why depth matters",
  "Say what a residual connection solves"
 ],
 b: [
  { p: "One convolutional layer finds edges. A network finds objects. What happens in between is a repeated pattern: convolve, activate, shrink — with the image getting smaller and the channel count getting larger, over and over." },

  { dg: "cv-hierarchy" },

  { h: "The standard block" },
  { code: { lang: "python", t: "The unit that repeats",
    lines: [
     { c: "import torch.nn as nn", w: "" },
     { c: "", w: "" },
     { c: "block = nn.Sequential(", w: "" },
     { c: "    nn.Conv2d(64, 128, kernel_size=3, padding=1),", w: "64 channels in, 128 out." },
     { c: "    nn.BatchNorm2d(128),", w: "**Normalises activations.** Lets you train faster and with a higher learning rate." },
     { c: "    nn.ReLU(inplace=True),", w: "Non-linearity. Without it, stacked convolutions collapse into one." },
     { c: "    nn.MaxPool2d(2),", w: "Halve the spatial size." },
     { c: ")", w: "" }
    ] } },
  { p: "Convolution, normalise, activate, shrink. Stack that pattern eight or twenty times and you have essentially every convolutional architecture from 2015 onwards." },

  { h: "Pooling, and its decline" },
  { p: "**Max pooling** takes each 2×2 patch and keeps only the largest value. It shrinks the image, discards three-quarters of the data, and does so with no parameters at all." },
  { p: "Why keep the maximum rather than the average? Because in a feature map a large value means *this filter fired strongly here*, and you want to preserve the strongest evidence rather than dilute it with three quiet neighbours." },
  { n: "Modern architectures increasingly skip pooling and use a stride-2 convolution instead, which shrinks by the same factor but **learns how** to shrink rather than always taking the maximum. Pooling is not wrong, it is just a fixed rule where a learned one is available. You will see both, and knowing why the newer one exists is the useful part.",
    nt: "Why newer networks drop it" },

  { h: "The receptive field: what depth actually buys" },
  { p: "A 3×3 filter sees nine pixels. Stack a second 3×3 on top and each of *its* outputs draws on a 5×5 patch of the original image, because each of its nine inputs already summarised nine pixels. A third layer sees 7×7." },
  { p: "That growing window is the **receptive field**, and it is the real reason depth matters. A network cannot recognise a face until some neuron somewhere is looking at a region big enough to contain one. Depth is how a 3×3 window eventually sees the whole picture." },
  { code: { lang: "python", t: "Two small kernels beat one large one",
    lines: [
     { c: "# one 5x5 layer", w: "" },
     { c: "5 * 5 * 64 * 64", w: "**102,400 parameters**, receptive field 5×5" },
     { c: "", w: "" },
     { c: "# two stacked 3x3 layers", w: "" },
     { c: "2 * (3 * 3 * 64 * 64)", w: "**73,728 parameters**, receptive field also 5×5 — *and* two non-linearities instead of one" }
    ] } },
  { p: "Fewer parameters, the same field of view, and more non-linearity. This is why 3×3 became the default kernel size across the entire field after VGG demonstrated it in 2014." },

  { h: "The problem depth created" },
  { p: "If depth is good, deeper should be better. It was not. Networks past about twenty layers trained **worse** than shallower ones — and not from overfitting, because their *training* error was worse too. They were failing to learn at all." },
  { p: "The cause is the gradient. Backpropagation multiplies gradients layer by layer on the way back; through fifty layers of small numbers the signal reaching the early layers is effectively zero, and those layers never move." },

  { h: "Residual connections" },
  { p: "ResNet's answer in 2015 is one of the highest-value-per-character ideas in deep learning. Add a shortcut that skips past the block:" },
  { code: { lang: "python", t: "The whole idea",
    lines: [
     { c: "def forward(self, x):", w: "" },
     { c: "    identity = x", w: "**Remember the input.**" },
     { c: "    out = self.conv1(x)", w: "" },
     { c: "    out = self.bn1(out)", w: "" },
     { c: "    out = self.relu(out)", w: "" },
     { c: "    out = self.conv2(out)", w: "" },
     { c: "    out = self.bn2(out)", w: "" },
     { c: "    out = out + identity", w: "**The residual connection.** One line." },
     { c: "    return self.relu(out)", w: "" }
    ] } },
  { p: "Two consequences, and both matter. First, the gradient now has a path straight back through the addition without being multiplied down, so early layers keep learning. Second — and this is the deeper point — the block only has to learn *the difference* from its input. If a layer has nothing useful to add, it can output zero and the input passes through untouched." },
  { ana: "Editing a document by tracking changes rather than retyping it. A section needing no change costs nothing, and you can never accidentally lose the original by mistyping it. A plain deep network retypes the whole document at every layer and hopes nothing is dropped.",
    at: "Tracked changes" },
  { p: "That single line took workable depth from about 20 layers to over 150, and ResNet-50 remains an entirely reasonable choice today. Residual connections are now in almost everything, including every transformer." },

  { tryit: { t: "Build one, and watch the shapes",
    task: "Build a small CNN in PyTorch and print the tensor shape after every layer. Then implement a residual block and verify its output shape matches its input.",
    hint: "Register a forward hook, or just print inside `forward`. The residual add requires matching shapes — that is the constraint that shapes ResNet's design.",
    sol: { lang: "python", code: "import torch, torch.nn as nn\n\nclass Residual(nn.Module):\n    def __init__(self, c):\n        super().__init__()\n        self.conv1 = nn.Conv2d(c, c, 3, padding=1)\n        self.bn1   = nn.BatchNorm2d(c)\n        self.conv2 = nn.Conv2d(c, c, 3, padding=1)\n        self.bn2   = nn.BatchNorm2d(c)\n        self.relu  = nn.ReLU(inplace=True)\n\n    def forward(self, x):\n        idn = x\n        out = self.relu(self.bn1(self.conv1(x)))\n        out = self.bn2(self.conv2(out))\n        return self.relu(out + idn)\n\nnet = nn.Sequential(\n    nn.Conv2d(3, 32, 3, padding=1), nn.BatchNorm2d(32), nn.ReLU(), nn.MaxPool2d(2),\n    nn.Conv2d(32, 64, 3, padding=1), nn.BatchNorm2d(64), nn.ReLU(), nn.MaxPool2d(2),\n    Residual(64),\n    nn.AdaptiveAvgPool2d(1), nn.Flatten(), nn.Linear(64, 10),\n)\n\nx = torch.randn(1, 3, 224, 224)\nfor layer in net:\n    x = layer(x)\n    print(f'{layer.__class__.__name__:20s} {tuple(x.shape)}')" },
    w: "Watch the spatial dimensions halve at each pool while channels double, then `AdaptiveAvgPool2d(1)` collapses everything to one number per channel. That last trick is how a network accepts any input size — worth remembering." } },

  { vocab: ["Pooling", "Batch Normalisation", "Residual Connection", "ResNet"] }
 ],
 k: [
  "The repeating block is convolve, normalise, activate, shrink.",
  "Max pooling keeps the strongest activation; stride-2 convolutions increasingly replace it because they learn how to shrink.",
  "The receptive field grows with depth — two 3×3 layers see 5×5 with fewer parameters than one 5×5.",
  "Past ~20 layers, plain networks train worse because gradients vanish.",
  "A residual connection adds the input back, giving gradients a clear path and letting a block learn only the difference."
 ],
 r: ["Pooling", "Batch Normalisation", "Residual Connection", "ResNet"]
},

{
 t: "Transfer Learning: How Vision Is Actually Done",
 m: "transfer",
 lvl: "core",
 s: "Nobody trains from scratch. Two hundred of your images beats two million of someone else's.",
 goal: [
  "Explain why a model trained on other people's photographs helps with yours",
  "Choose between freezing the backbone and fine-tuning it",
  "Fine-tune a pretrained model on a small dataset"
 ],
 b: [
  { p: "If you take one practical thing from this track, take this: **you will almost never train a vision model from scratch.** Not because it is too hard, but because it is strictly worse — slower, more expensive, and less accurate than starting from weights someone else already paid for." },

  { dg: "cv-transfer" },

  { h: "Why someone else's model helps with your problem" },
  { p: "A network trained on ImageNet has seen a million photographs across a thousand categories. In learning to tell a terrier from a spaniel it had to learn edges, textures, corners, shapes, materials, shading." },
  { p: "**None of that is specific to dogs.** Edges are edges. Your medical scans, your circuit boards, your satellite images are all made of edges, textures and shapes, because they are all photographs of a physical world with the same optics." },
  { p: "Only the last part — the layer that maps learned features to *dog breeds* — is specific. So you keep everything else and replace that." },

  { h: "The two modes" },
  { tbl: { t: "Freeze or fine-tune",
    h: ["", "Feature extraction", "Fine-tuning"],
    rows: [
     ["**What trains**", "Only the new head", "The head, plus some or all of the backbone"],
     ["**Learning rate**", "Normal (1e-3)", "**Much lower** (1e-4 or 1e-5)"],
     ["**Data needed**", "Very little — 50 per class works", "More — a few hundred per class"],
     ["**Speed**", "Very fast", "Slower"],
     ["**Best when**", "Your images resemble ImageNet photos", "Your domain is unusual — X-rays, microscopy, satellite"]
    ] } },
  { p: "Start with feature extraction. It takes minutes, and it tells you whether the pretrained features are useful for your problem at all before you spend anything larger." },

  { code: { lang: "python", t: "Feature extraction — the whole thing",
    lines: [
     { c: "import torch, torch.nn as nn", w: "" },
     { c: "from torchvision import models", w: "" },
     { c: "", w: "" },
     { c: "weights = models.ResNet50_Weights.DEFAULT", w: "" },
     { c: "model = models.resnet50(weights=weights)", w: "" },
     { c: "preprocess = weights.transforms()", w: "**Use this.** It carries the exact resize and normalisation the model expects." },
     { c: "", w: "" },
     { c: "for p in model.parameters():", w: "" },
     { c: "    p.requires_grad = False", w: "Freeze everything." },
     { c: "", w: "" },
     { c: "model.fc = nn.Linear(model.fc.in_features, num_classes)", w: "**Replace the head.** New layers default to `requires_grad=True`, so only this trains." },
     { c: "", w: "" },
     { c: "opt = torch.optim.Adam(model.fc.parameters(), lr=1e-3)", w: "Optimise only the head." }
    ] } },

  { h: "Fine-tuning, and the learning rate that ruins it" },
  { p: "When the frozen version is not enough, unfreeze — but carefully." },
  { trap: "Fine-tuning at your normal learning rate destroys the pretrained weights in the first few batches. Your randomly initialised head produces large, meaningless gradients, and at 1e-3 those flow back and wreck features that took a GPU-month to learn. **Train the head first with everything frozen, then unfreeze at 1e-5.** Skipping that first phase is the most common way to end up worse than not using transfer learning at all." },
  { code: { lang: "python", t: "The two-phase recipe",
    lines: [
     { c: "# phase 1 — head only, a few epochs", w: "" },
     { c: "for p in model.parameters(): p.requires_grad = False", w: "" },
     { c: "model.fc = nn.Linear(model.fc.in_features, num_classes)", w: "" },
     { c: "train(model, lr=1e-3, epochs=5)", w: "Let the head find its feet against stable features." },
     { c: "", w: "" },
     { c: "# phase 2 — unfreeze the last block, very low rate", w: "" },
     { c: "for p in model.layer4.parameters(): p.requires_grad = True", w: "The last block holds the most task-specific features." },
     { c: "opt = torch.optim.Adam([", w: "" },
     { c: "    {'params': model.layer4.parameters(), 'lr': 1e-5},", w: "**Discriminative learning rates** — earlier layers change least." },
     { c: "    {'params': model.fc.parameters(),     'lr': 1e-4},", w: "" },
     { c: "])", w: "" }
    ] } },

  { h: "Augmentation: more data without more data" },
  { p: "With a small dataset the model memorises. **Augmentation** shows it altered copies — flipped, rotated, recoloured — so it must learn the object rather than the photograph." },
  { code: { lang: "python", t: "A sane default set",
    lines: [
     { c: "train_tf = transforms.Compose([", w: "" },
     { c: "    transforms.RandomResizedCrop(224, scale=(0.7, 1.0)),", w: "Random crop and zoom. Usually the single most effective one." },
     { c: "    transforms.RandomHorizontalFlip(),", w: "Free doubling — for most subjects." },
     { c: "    transforms.ColorJitter(0.2, 0.2, 0.2),", w: "Survive different lighting." },
     { c: "    transforms.ToTensor(),", w: "" },
     { c: "    transforms.Normalize(mean, std),", w: "" },
     { c: "])", w: "" }
    ] } },
  { trap: "Augment the training set only — never validation or test. Validating on randomly altered images means your score changes between runs and you are measuring luck as well as skill. And think before flipping: horizontal flips are wrong for text, for road signs, and for any medical image where left and right are clinically distinct. A flipped chest X-ray is a different patient." },

  { n: "Choose augmentations by asking what variation your *deployed* model will actually meet. A fixed overhead camera on a production line never sees a rotated part, so rotation augmentation teaches it to handle something that will never happen and costs capacity. A phone camera sees every angle and every light. Augment for reality, not for a checklist.",
    nt: "How to choose augmentations" },

  { tryit: { t: "Fine-tune on your own images",
    task: "Take a pretrained ResNet, replace the head for your number of classes, freeze the backbone, and train on a small dataset. Report accuracy, then unfreeze the last block at 1e-5 and see whether it improves.",
    hint: "`torchvision.datasets.ImageFolder` reads a directory of class-named subfolders. Fifty images per class is enough to see this work.",
    sol: { lang: "python", code: "import torch, torch.nn as nn\nfrom torchvision import models, datasets\nfrom torch.utils.data import DataLoader\n\nweights = models.ResNet18_Weights.DEFAULT\nmodel = models.resnet18(weights=weights)\ntf = weights.transforms()\n\ntrain = datasets.ImageFolder('data/train', transform=tf)\nloader = DataLoader(train, batch_size=32, shuffle=True)\n\nfor p in model.parameters():\n    p.requires_grad = False\nmodel.fc = nn.Linear(model.fc.in_features, len(train.classes))\n\nopt = torch.optim.Adam(model.fc.parameters(), lr=1e-3)\nlossf = nn.CrossEntropyLoss()\n\nfor epoch in range(5):\n    total = correct = 0\n    for x, y in loader:\n        opt.zero_grad()\n        out = model(x)\n        loss = lossf(out, y)\n        loss.backward()\n        opt.step()\n        correct += (out.argmax(1) == y).sum().item()\n        total += y.size(0)\n    print(f'epoch {epoch}: train acc {correct / total:.3f}')" },
    w: "Usable accuracy in five epochs on a laptop, from a few hundred images. Training that same network from scratch would need hundreds of thousands of images and a GPU for days, and would still be worse." } },

  { vocab: ["Transfer Learning", "Data Augmentation", "ImageNet", "Fine-Tuning"] }
 ],
 k: [
  "Almost nobody trains vision models from scratch — pretrained features transfer because edges and textures are universal.",
  "Feature extraction freezes the backbone and trains a new head; fine-tuning unfreezes some of it at a much lower rate.",
  "Always train the head first — fine-tuning immediately at a normal learning rate destroys pretrained weights.",
  "Use the weights' own `transforms()` so preprocessing matches training exactly.",
  "Augment training data only, and choose augmentations that match what deployment will really see."
 ],
 r: ["Transfer Learning", "Data Augmentation", "ImageNet", "Fine-Tuning", "ResNet"]
}

]);
