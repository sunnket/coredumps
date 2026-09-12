/* Real-world examples and step-by-step flows — Deep Learning. */
TD.attach("deep-learning", {

"Deep Learning": {
 ex: { h: "A production line that designs its own stages",
       b: "Classical ML asks you to decide what to measure before anything can be learned. Deep learning discovers those measurements itself: early layers find edges, middle layers find shapes, later layers find faces. Nobody wrote *edge detector* — it emerged because it helped." },
 fl: { t: "Why nobody hand-picks features any more",
       s: [{ s: "Raw data goes straight in — the actual pixels of a photo, or the actual characters of a sentence", n: "Nobody tells the model what to look for first." },
           { s: "The first few layers learn to spot the simplest things", n: "In a photo: edges, corners, patches of colour. Nothing more clever than that." },
           { s: "The next layers build bigger things out of those small ones", n: "Edges become textures, textures become a wheel, wheels become a car." },
           { s: "Layers keep stacking, and each one works with bigger pieces than the last", n: "This is the whole trick. Simple parts, combined over and over." },
           { q: "So what did a person actually have to decide?",
             y: "Only the shape of the network and what counts as a right answer — never what to look for",
             n: "The cost of that convenience: far more example data and far more computing power than older methods needed" }] }
},

"Neural Network": {
 ex: { h: "A very large panel of very simple voters",
       b: "Each unit does something trivial — add up its inputs, apply a curve, pass it on. Nothing in there is clever. What is clever is that stacking enough of these and adjusting the connections lets the whole thing approximate almost any function you like." },
 fl: { t: "How one prediction is produced",
       s: [{ s: "Your numbers go into the first layer — a photo's pixels, a row of data, whatever you are feeding it", n: "Everything from here on is arithmetic on those numbers." },
           { s: "Each unit multiplies every number coming in by its own importance value, then adds the results together", n: "Like a weighted vote: some inputs count more than others, and the model decides how much." },
           { s: "Each unit adds one more number of its own to shift the total up or down", n: "This lets a unit switch on at any level, not only when its total passes zero." },
           { s: "That total is passed through a bending function, which stops the answer being a straight line", n: "Without this bend, stacking a hundred layers would do no more than one layer could." },
           { q: "Is this the last layer?",
             y: "Yes — turn the final numbers into the answer: a probability, a category, or a plain value",
             n: "No — hand these numbers to the next layer as its inputs, and repeat the whole thing" }] }
},

"Perceptron": {
 ex: { h: "A single yes/no rule with adjustable weights",
       b: "Rosenblatt's 1958 machine could learn to separate two groups with a straight line — and famously could not learn XOR, which killed funding for a decade. The fix was not a cleverer perceptron but a stack of them, which is the whole idea of a hidden layer." },
 fl: { t: "What one unit can and cannot learn",
       s: [{ s: "Multiply each input by its importance value and add everything up", n: "One number out of however many went in." },
           { s: "If that total is over a set level, answer 1. Otherwise answer 0", n: "A hard yes-or-no, with nothing in between." },
           { s: "Because of that, it can only separate two groups with one straight line", n: "Draw the line; everything on one side is a yes, everything on the other is a no." },
           { q: "Can your two groups be split by a single straight line?",
             y: "Then this will always find that line, given enough attempts — that is mathematically guaranteed",
             n: "Then it never finds an answer. The classic example is XOR, where the two groups sit in opposite corners" },
           { s: "The fix is not a cleverer single unit — it is stacking many of them with a bend in between", n: "That stack is a neural network, and it can carve out any shape." }] }
},

"Multilayer Perceptron": {
 ex: { h: "Folding paper to make a straight cut curved",
       b: "One cut through flat paper is a straight line. Fold it first and the same straight cut produces a complex shape. Hidden layers with non-linear activations do exactly that to the input space, which is why a stack of simple units can carve out arbitrary boundaries." },
 fl: { t: "Why the layers need a bend between them",
       s: [{ s: "Your numbers pass through a layer that multiplies and adds", n: "On its own, this can only draw straight lines." },
           { q: "Is there a bending function after that layer?",
             y: "Yes — the space is now warped, so the next layer can carve a curved boundary through it",
             n: "No — a straight line fed into another straight line is still just a straight line, so the extra layer bought you nothing at all" },
           { s: "With enough units and those bends, the network can copy almost any pattern you like", n: "This is a proven result, not a hope." },
           { s: "But *possible to copy* is not the same as *easy to learn*", n: "In practice, more layers works far better than one very wide layer." }] }
},

"Weight": {
 ex: { h: "How loudly each opinion counts in a committee",
       b: "The chair does not average opinions equally. Someone with a track record on this topic gets more weight. Training is the process of discovering, from evidence, who should be listened to and by how much — and a weight of zero means *ignore this input entirely*." },
 fl: { t: "How one importance value gets adjusted",
       s: [{ s: "The network makes a prediction using the value this connection currently has", n: "It starts as a random number and gets corrected from here." },
           { s: "Compare the prediction with the right answer to get one number: how wrong it was", n: "This single number scores the whole network's performance on that example." },
           { s: "Work backwards through the network to find this one connection's share of the blame", n: "Every connection gets its own share. Big share means it mattered a lot to the mistake." },
           { q: "Would turning this value up make the answer worse?",
             y: "Then turn it down a little",
             n: "Then turn it up a little — and how big that step is depends on the learning rate you set" },
           { s: "Repeat this for every connection, on every example, millions of times", n: "That repetition is all training is." }] }
},

"Bias Term": {
 ex: { h: "The intercept on a graph",
       b: "Without it every line has to pass through the origin, which is a severe and arbitrary restriction. The bias lets a neuron activate at a threshold other than zero — a small addition that makes the difference between a model that can fit your data and one that cannot." },
 fl: { t: "What that one extra number buys you",
       s: [{ s: "A unit multiplies its inputs by their importance values and adds them up", n: "So far the total is entirely decided by the inputs." },
           { q: "Do you add one extra number that has nothing to do with the inputs?",
             y: "Yes — now the unit can switch on at any level you like, not only when the inputs happen to total zero",
             n: "No — every boundary the network draws is forced to pass through the exact centre point, which is a severe and pointless restriction" },
           { s: "This extra number is learned from the data, exactly like the importance values", n: "One per unit, and it usually starts at zero." },
           { s: "It is the same idea as the starting height of a line on a graph", n: "Without it, every line has to begin at the origin." }] }
},

"Activation Function": {
 ex: { h: "The bend that stops a stack collapsing",
       b: "Ten linear layers in a row are mathematically identical to one linear layer — all that depth buys nothing at all. The activation puts a kink in the line between layers, and that kink is the entire reason deep networks can represent complicated things." },
 fl: { t: "Picking the bending function",
       s: [{ s: "A layer has finished its multiplying and adding, and now has a total for each unit", n: "At this point everything is still straight lines." },
           { q: "Is this a middle layer, or the last one?",
             y: "A middle layer — use ReLU or GELU. They are cheap, and they do not flatten out for large numbers",
             n: "The last layer — here the choice is decided entirely by what kind of answer you need" },
           { s: "For a yes/no answer use sigmoid. For picking one of many use softmax. For predicting a plain number, use nothing at all", n: "Match this to how you are scoring the model, or the two will fight each other." },
           { s: "Never use sigmoid or tanh in middle layers of a deep network", n: "They flatten at both ends, and a flat curve gives the network nothing to learn from." }] }
},

"ReLU": {
 ex: { h: "A one-way valve",
       b: "Positive flows through unchanged, negative is stopped dead. It is almost embarrassingly simple, it costs a single comparison, and it fixed the vanishing gradient problem that had stalled deep networks for years. Its failure mode is equally simple: a neuron stuck negative never recovers." },
 fl: { t: "The dying ReLU problem",
       s: [{ s: "ReLU is the simplest rule imaginable: if the number is positive keep it, if it is negative make it zero", n: "One comparison. That is the whole function." },
           { s: "A unit's total goes negative, so ReLU outputs zero", n: "Fine on its own — plenty of units are quiet on any given example." },
           { s: "But the signal used to correct that unit is also zero", n: "Zero output means zero blame, which means no instruction to change." },
           { q: "Can that unit ever come back to life?",
             y: "Only if the other inputs eventually push its total positive again",
             n: "If the learning rate was too big it can be stuck at zero forever — a dead unit that contributes nothing for the rest of training" },
           { s: "Leaky ReLU fixes this by letting negatives through very slightly instead of flattening them to zero", n: "A tiny slope means the correction signal is never exactly zero." }] }
},

"Sigmoid": {
 ex: { h: "A dimmer switch that flattens at both ends",
       b: "Turn the dial far enough either way and further turning changes almost nothing. That flattening is exactly the problem: where the curve is flat the gradient is near zero, so learning stops. Perfect as a final layer producing a probability; poison in the middle of a deep stack." },
 fl: { t: "Why it left the middle layers",
       s: [{ s: "Sigmoid squashes any number, however large or small, into the range 0 to 1", n: "Perfect when you want a probability out." },
           { q: "Is the incoming number far from zero, in either direction?",
             y: "Then the curve is almost flat there, so a change in the input barely changes the output — and the network gets almost no signal about how to improve",
             n: "Near zero it behaves nicely, but that is a narrow band and inputs do not politely stay inside it" },
           { s: "Now stack many layers, each multiplying that tiny signal by another tiny signal", n: "By the early layers there is essentially nothing left, so they never learn." },
           { s: "It survives in one place: the final layer of a yes/no classifier", n: "There you actually want a number between 0 and 1, and there is no stack below it to starve." }] }
},

"Tanh": {
 ex: { h: "Sigmoid, recentred on zero",
       b: "Same S-shape, but the output runs from −1 to +1 rather than 0 to 1. Zero-centred outputs make the next layer's gradients better behaved, which is why tanh beat sigmoid in hidden layers — before ReLU made both largely obsolete." },
 fl: { t: "Where it still shows up",
       s: [{ s: "Tanh is the same S-shape as sigmoid, but its output runs from −1 to +1 instead of 0 to 1", n: "Centred on zero, which is the one real advantage." },
           { q: "Is this an ordinary middle layer in a modern network?",
             y: "Then use ReLU or GELU instead — tanh flattens at both ends and starves the layers below it",
             n: "Inside LSTM and GRU units, tanh and sigmoid are still used on purpose, because those designs need values in a fixed range" },
           { s: "It flattens at both ends exactly like sigmoid does", n: "Same starved-signal problem in a deep stack." },
           { s: "Being centred on zero is why it beat sigmoid historically", n: "The next layer receives a balanced mix of positives and negatives rather than all positives." }] }
},

"Softmax": {
 ex: { h: "Turning scores into shares of a vote",
       b: "Three candidates with raw scores 5, 3 and 1 become percentages that add to 100. Exponentiating first means the leader's advantage is amplified — which is why a small gap in logits can become a large gap in probabilities, and why softmax outputs often look overconfident." },
 fl: { t: "Turning raw scores into percentages",
       s: [{ s: "The last layer gives one raw score per possible answer — say 5, 3 and 1 for three categories", n: "These can be any numbers at all, including negatives. They do not mean anything yet." },
           { s: "Raise a fixed number to the power of each score", n: "This makes them all positive, and stretches the gaps: a small lead becomes a big one." },
           { s: "Add up those results, then divide each one by that total", n: "Now they all add up to 1, so you can read them as percentages." },
           { q: "Can you trust those percentages as real confidence?",
             y: "Not straight away — networks are routinely far more confident than they should be, and need correcting against real outcomes first",
             n: "You can flatten or sharpen them deliberately by dividing the raw scores by a number before starting — that number is called temperature" }] }
},

"GELU": {
 ex: { h: "ReLU with the corner sanded off",
       b: "Instead of a hard cut at zero, the transition is smooth, and small negative values pass through slightly rather than being annihilated. Smoother gradients, marginally better results, and it became the default in transformers largely on empirical grounds." },
 fl: { t: "GELU or ReLU?",
       s: [{ s: "ReLU chops negatives off at exactly zero — a sharp corner in the curve", n: "Simple and fast, but abrupt." },
           { s: "GELU does the same job with the corner rounded off, letting small negatives through a little", n: "Think of a dimmer switch rather than an on/off switch." },
           { q: "What are you building?",
             y: "A transformer — use GELU, because that is what the design was tuned around",
             n: "A vision network — ReLU is cheaper and in practice performs about the same" },
           { s: "Because negatives are not flattened completely, GELU units cannot die the way ReLU units can", n: "The cost is slightly more computing work per unit." }] }
},

"Forward Pass": {
 ex: { h: "Reading a recipe top to bottom",
       b: "Inputs enter, every layer transforms them in order, and a prediction comes out the other end. Nothing is learned during this — it is pure computation. Inference is only ever this, which is why it is so much cheaper than training." },
 fl: { t: "What happens, in order",
       s: [{ s: "Your input numbers enter the first layer", n: "A batch of images, a batch of sentences — whatever you are feeding in." },
           { s: "Each layer multiplies, adds, and bends, then hands its results to the next layer", n: "Straight down the stack, no going back." },
           { q: "Are you training the model, or just using it?",
             y: "Training — keep every layer's intermediate results in memory, because working out the corrections needs them",
             n: "Just using it — throw those intermediates away as you go. This is what `no_grad` does, and it saves an enormous amount of memory" },
           { s: "The last layer produces the output: raw scores, or a predicted number", n: "Nothing has been learned during any of this. It is pure calculation." }] }
},

"Backpropagation": {
 ex: { h: "Tracing a fault back through a production line",
       b: "The final product is wrong. You work backwards, station by station, apportioning how much each one contributed to the defect — and each station only needs to know the blame passed back to it and its own operation. That locality is what makes it efficient." },
 fl: { t: "How blame travels backwards",
       s: [{ s: "Compare the network's answer with the right answer and get one number for how wrong it was", n: "This single number is the only feedback the whole network ever gets." },
           { s: "Start at the last layer and work out how much each of its outputs contributed to that mistake", n: "If nudging an output up would make things worse, that is useful to know." },
           { s: "Pass that blame back one layer, and work out the same thing there", n: "Each layer only needs to know the blame handed to it, plus what it did itself." },
           { s: "Keep going backwards until every layer has its share", n: "This is why it is called *back*propagation — the answer goes forwards, the blame comes backwards." },
           { q: "Did every layer get a usable amount of blame?",
             y: "Yes — now every connection can be nudged in the right direction",
             n: "No — if the blame shrank to nothing or blew up on the way back, the early layers learn nothing at all" },
           { s: "Going backwards costs roughly twice what going forwards does", n: "Which is why training is far more expensive than just using a model." }] }
},

"Epoch": {
 ex: { h: "One complete read of the textbook",
       b: "You do not learn a subject in one reading. Each pass through the material reinforces what stuck and corrects what did not — but a student who reads the same book fifty times starts reciting it rather than understanding it, which is exactly overfitting." },
 fl: { t: "Deciding how many passes to do",
       s: [{ s: "One epoch means the model has seen every training example exactly once", n: "Ten thousand examples seen once is one epoch." },
           { s: "Inside that one pass, the model is corrected many times, not once", n: "It updates after each small group of examples, so one epoch may hold thousands of corrections." },
           { q: "Is the model still improving on data it has never been trained on?",
             y: "Yes — do another pass. There is still something left to learn",
             n: "No, it is getting worse — stop. From here it is memorising the training examples rather than learning the pattern" },
           { s: "Very large language models often do just one pass over enormous amounts of text", n: "With enough fresh data, there is no reason to go round twice." }] }
},

"Batch Size": {
 ex: { h: "How many exam papers you mark before adjusting the mark scheme",
       b: "Mark one and adjust — noisy, fast, and you overreact to a single odd script. Mark all ten thousand — accurate, and you have made one decision all day. Somewhere in between is where the useful trade-off lives, and it is bounded by how much fits in memory." },
 fl: { t: "Choosing how many examples per update",
       s: [{ s: "The model looks at a small group of examples, then corrects itself once based on all of them together", n: "That group is a batch. Its size is your choice." },
           { s: "A small batch means fast, frequent, but jumpy corrections", n: "Like changing your mind after every single piece of feedback." },
           { s: "A large batch means slower, steadier, better-informed corrections", n: "Like collecting a hundred opinions before deciding." },
           { q: "Does your chosen size fit in the graphics card's memory?",
             y: "Yes — bigger batches use the hardware more efficiently and give steadier corrections",
             n: "No — either shrink it, or collect the corrections from several small batches and apply them together as if they were one big one" },
           { s: "Oddly, very large batches can end up generalising worse", n: "The jumpiness of small batches acts a bit like healthy noise, stopping the model settling too neatly." }] }
},

"Iteration": {
 ex: { h: "One turn of the handle",
       b: "One batch in, one gradient computed, one update applied. An epoch is however many turns it takes to get through the data once — which is why *trained for 100,000 steps* and *trained for 3 epochs* can describe the same run and neither is redundant." },
 fl: { t: "How steps relate to epochs",
       s: [{ s: "One iteration is one batch in, one correction applied. One step of learning", n: "The smallest unit of training there is." },
           { s: "Divide your number of examples by your batch size to get iterations per epoch", n: "50,000 examples in batches of 32 is 1,563 steps to get through them all once." },
           { q: "When a tool talks about progress, which is it counting?",
             y: "Usually steps — things like warming up and winding down the learning rate are counted in steps",
             n: "But saving checkpoints and running checks are usually counted in epochs" },
           { s: "This is why changing the batch size quietly changes everything else", n: "Bigger batches mean fewer steps per epoch, which shifts every step-based schedule." }] }
},

"Optimiser": {
 ex: { h: "The driving style, not the destination",
       b: "Gradient descent says which way is downhill. The optimiser decides how to move: cautiously, with momentum, faster on directions that have been consistent. Same landscape, very different journeys — and on some landscapes only one of them arrives." },
 fl: { t: "Choosing how to take each step",
       s: [{ s: "Backpropagation has told you which direction is downhill for every connection", n: "It says which way to go, not how far or how fast." },
           { s: "The optimiser is the rule that decides how to actually move", n: "Cautiously? Building up speed? Faster in directions that have been consistent?" },
           { q: "Which should you pick?",
             y: "AdamW as a default — it adapts the step size per connection and works nearly everywhere with no tuning",
             n: "SGD with momentum can end up slightly better on image tasks, but needs far more careful tuning to get there" },
           { s: "Adam keeps two extra numbers for every single connection in the network", n: "This is why the optimiser alone can take up more memory than the model itself." },
           { s: "Whichever you choose, the learning rate matters more", n: "A good optimiser with a bad learning rate loses to the reverse." }] }
},

"Adam Optimiser": {
 ex: { h: "A hiker who remembers both direction and terrain",
       b: "It keeps a running sense of which way it has been heading, and how bumpy each direction has been. Steady directions get bigger steps; erratic ones get smaller. That per-parameter adaptation is why it works out of the box on so many problems." },
 fl: { t: "What it remembers about each connection",
       s: [{ s: "It keeps a running average of which direction this connection has been pushed recently", n: "So a connection consistently pushed the same way builds up speed." },
           { s: "It also keeps a running average of how *big* those pushes have been", n: "This tells it whether this connection's feedback is steady or wildly jumpy." },
           { s: "It then divides the first by the second", n: "Steady directions get big confident steps. Jumpy, unreliable ones get small careful steps." },
           { q: "Why do people say AdamW rather than plain Adam?",
             y: "AdamW keeps the shrink-toward-zero tidying separate from that per-connection scaling, so the tidying works as intended",
             n: "In plain Adam the two get tangled together, and connections that already take small steps get tidied far less than they should" }] }
},

"Momentum": {
 ex: { h: "A ball rolling down a bumpy hill",
       b: "It does not stop at every small dip, because it carries speed from where it has been. That is the whole idea: accumulate a running average of past gradients so that consistent directions accelerate and oscillations across a narrow valley cancel out." },
 fl: { t: "Why it speeds things up",
       s: [{ s: "Plain gradient descent steps only on what the current batch says, forgetting everything before it", n: "Every step starts from scratch." },
           { s: "Momentum instead keeps most of its previous direction and adds the new push on top", n: "Like a ball rolling downhill — it does not stop dead at every small bump." },
           { q: "What if the slope is a long narrow valley?",
             y: "Without momentum the steps bounce off the steep side walls and barely creep along the valley floor",
             n: "With momentum the side-to-side bounces cancel each other out, and the steady downhill direction builds up speed" },
           { s: "A typical setting keeps 90% of the previous direction each step", n: "Opposing pushes cancel; agreeing pushes add up." }] }
},

"Learning Rate Schedule": {
 ex: { h: "Driving fast on the motorway and slowly into the parking space",
       b: "A single speed for the whole journey is wrong at both ends. Large steps early cover ground; small steps late let you settle precisely. Warmup then decay is the pattern that made large transformer training stable." },
 fl: { t: "The standard shape",
       s: [{ s: "The learning rate is simply how big a step you take each time you correct the model", n: "Too big and you overshoot; too small and you never arrive." },
           { s: "Start it very small and raise it gradually over the first few hundred steps", n: "Early on the model is random and its corrections are wild — one big step here can wreck the whole run." },
           { s: "Hold it at its highest useful value for the bulk of training", n: "This is where most of the ground is covered." },
           { s: "Then ease it down towards zero as you approach the end", n: "Like slowing down as you pull into a parking space rather than braking at the last second." },
           { q: "What if progress stalls halfway through?",
             y: "Dropping the learning rate sharply often unsticks it and squeezes out more improvement",
             n: "Otherwise leave the schedule alone and let it finish" }] }
},

"Weight Decay": {
 ex: { h: "A small tax on every parameter",
       b: "Every weight is pulled slightly toward zero on every step, so a weight only stays large if the data keeps pushing it back. It is L2 regularisation applied directly in the update, and it is one of the most reliable ways to reduce overfitting in deep networks." },
 fl: { t: "Applying it correctly",
       s: [{ s: "On every single update, every connection value is nudged very slightly towards zero", n: "A small tax on being large." },
           { s: "So a connection only stays big if the data keeps pushing it back up", n: "Anything not genuinely useful quietly fades away." },
           { q: "Which optimiser are you using?",
             y: "Adam — you must use the AdamW version, or this nudging gets distorted by Adam's per-connection scaling and stops working properly",
             n: "Plain SGD — the simple version works correctly as it is" },
           { s: "Leave the bias numbers and the normalisation settings out of it", n: "Shrinking those towards zero usually makes things worse, not better." }] }
},

"Dropout": {
 ex: { h: "A team that trains with random people absent",
       b: "If any one person might be missing on match day, nobody can be indispensable and everybody learns to cover. Randomly switching off neurons during training forces the network to spread its representation instead of relying on a few brittle pathways." },
 fl: { t: "Why it behaves differently when training and when used",
       s: [{ s: "While training, randomly switch off a share of the units on every pass", n: "Typically between one in ten and half of them." },
           { s: "A different random set is switched off each time", n: "So no unit can ever count on any particular partner being there." },
           { s: "This forces the network to spread what it knows around rather than relying on a few fragile paths", n: "Like a team that trains with random players missing — everyone learns to cover." },
           { s: "Turn up the remaining units slightly to make up for the missing ones", n: "So the next layer receives roughly the same total either way." },
           { q: "What happens when you actually use the model?",
             y: "Dropout is switched off completely — every unit is used, every time",
             n: "Forgetting to switch it off is a classic bug: your predictions come out slightly different on every run for no visible reason" }] }
},

"Batch Normalisation": {
 ex: { h: "Recalibrating the scales between every station",
       b: "As data flows through layers its scale drifts, and later layers have to keep re-adapting to a moving input distribution. Normalising each mini-batch to zero mean and unit variance holds that steady, which is why it allowed much higher learning rates." },
 fl: { t: "Why it acts differently when training and when used",
       s: [{ s: "As numbers flow through layers, their typical size drifts, and later layers keep having to re-adjust", n: "Like a production line where each station's output slowly changes size and the next one keeps recalibrating." },
           { s: "While training, rescale each batch so its numbers sit around zero with a consistent spread", n: "Worked out from the batch currently being processed." },
           { s: "Then let the model learn how to stretch and shift them back if it wants", n: "So normalising never removes anything the model actually needed." },
           { s: "Quietly keep a running average of those rescaling numbers as training goes on", n: "Building up a picture of what is typical across the whole dataset." },
           { q: "What is used when you feed it a single example later?",
             y: "The stored running averages — one example on its own has no batch to measure",
             n: "This is also why training with a batch size of 1 breaks it: there is nothing to average over" }] }
},

"Layer Normalisation": {
 ex: { h: "Normalising each pupil's marks across their own subjects",
       b: "Rather than comparing everyone in the class on one paper, you standardise within each individual's own set of results. That independence from the rest of the batch is exactly why it works for sequences of different lengths and for batch size 1." },
 fl: { t: "Why transformers use this instead",
       s: [{ s: "Rescale the numbers within one single example, using only that example's own values", n: "Like marking one pupil against their own subjects rather than against the rest of the class." },
           { q: "Does it need to look at the other examples in the batch?",
             y: "No — which is exactly why it works with a batch of one, and with sentences of different lengths",
             n: "Batch normalisation does need them, and that is precisely what makes it awkward for text" },
           { s: "It behaves identically whether you are training or using the model", n: "There are no running averages to keep, so nothing can go out of sync." },
           { s: "Doing this before each block rather than after makes very deep stacks train more reliably", n: "Almost every modern transformer is built this way." }] }
},

"Early Stopping": {
 ex: { h: "Taking the cake out when the skewer comes clean",
       b: "Leaving it in longer does not make it more cooked, it makes it dry. Validation loss turning upward is the skewer test — and keeping the checkpoint from the moment before the turn is the whole technique." },
 fl: { t: "Doing it properly",
       s: [{ s: "After each pass through the data, test the model on examples it has never trained on", n: "This is the only honest measure of whether it is actually learning." },
           { q: "Did that score improve?",
             y: "Save a copy of the model as the best so far, and reset your patience counter to zero",
             n: "Add one to the patience counter and carry on for now" },
           { q: "Has the counter reached your limit — say five passes with no improvement?",
             y: "Stop, and go back to the best saved copy. Not the most recent one, the best one",
             n: "Keep going. Scores bounce around, and one bad pass means very little on its own" },
           { s: "This is the cheapest protection against overfitting there is", n: "It costs nothing but a little disk space for the saved copies." }] }
},

"Vanishing Gradient": {
 ex: { h: "A whisper passed down a very long line",
       b: "By the twentieth person there is nothing left to hear. Each layer multiplies the gradient by something smaller than one, and thirty layers later the early layers receive essentially zero signal — so they never learn anything at all." },
 fl: { t: "Finding and fixing it",
       s: [{ s: "The network trains, but the early layers barely change from where they started", n: "The later layers learn fine, which is what makes this confusing to spot." },
           { s: "The cause: correction signals shrink a little at every layer on the way back", n: "Multiply by a half thirty times and there is essentially nothing left. Like a whisper passed down a very long line." },
           { q: "Are you using sigmoid or tanh in the middle layers?",
             y: "That is very likely the cause — both flatten out, and a flat curve passes back almost no signal. Swap them for ReLU or GELU",
             n: "Print the size of the correction signal at each layer and see where it falls off a cliff" },
           { s: "Add shortcut connections that skip past blocks", n: "These give the signal a clear path straight back, avoiding all that shrinking." },
           { s: "Add normalisation layers to keep the numbers in a sensible range", n: "Numbers that stay reasonable produce correction signals that stay reasonable." }] }
},

"Exploding Gradient": {
 ex: { h: "Feedback howl in a PA system",
       b: "A small signal is amplified, fed back, amplified again, and within a second the room is unusable. Gradients multiplied through many layers can do the same, and the symptom is unmistakable: the loss becomes NaN and the run is dead." },
 fl: { t: "When the loss suddenly becomes NaN",
       s: [{ s: "Training is going fine, then the loss jumps to infinity or NaN and never recovers", n: "NaN means *not a number* — the arithmetic has broken down completely." },
           { s: "The cause is the mirror image of vanishing: signals get multiplied *up* at every layer", n: "Like microphone feedback — a small squeal amplified round a loop until the room is unusable." },
           { q: "Are you capping the size of the corrections?",
             y: "Yes — lower that cap, and lower the learning rate as well",
             n: "No — add that cap. It is the standard fix and it takes one line" },
           { s: "Also check how the connection values were set at the very start", n: "Starting them too large is a common root cause." },
           { s: "Networks that process long sequences step by step are especially prone to this", n: "More steps means more chances to multiply up." }] }
},

"Gradient Clipping": {
 ex: { h: "A speed limiter on a delivery van",
       b: "The driver can accelerate normally; the van simply will not exceed a set speed. Clipping caps the norm of the gradient so one pathological batch cannot throw every weight into nonsense — the direction is preserved, only the magnitude is capped." },
 fl: { t: "How the cap works",
       s: [{ s: "Work out the corrections for every connection in the network as normal", n: "Nothing is changed yet." },
           { s: "Measure their combined size as one single number", n: "Across the whole network at once, not connection by connection." },
           { q: "Is that number above your chosen limit?",
             y: "Scale every correction down by the same proportion, so the direction is untouched and only the size is reduced",
             n: "Apply them exactly as they are" },
           { s: "This is a speed limiter, not a steering change", n: "The van still goes where the driver points it; it simply cannot exceed a set speed." },
           { s: "Cap the combined size, not each value separately", n: "Capping values one by one bends the direction, which is the thing you wanted to preserve." }] }
},

"Weight Initialisation": {
 ex: { h: "Where you drop the hikers at the start",
       b: "Drop them all at the same spot and every hiker walks the same route — which is exactly what happens if you initialise every weight to zero: all neurons in a layer compute the same thing forever. Random, but carefully scaled, is the requirement." },
 fl: { t: "Why the starting scale matters",
       s: [{ s: "Before training, every connection needs a starting value", n: "Training only ever adjusts these; it never creates them." },
           { q: "Could you just set them all to zero?",
             y: "No — every unit in a layer would then receive identical feedback and stay identical forever, so the layer acts as one unit",
             n: "They must be random, so units start out different and can specialise" },
           { s: "But random is not enough — the size of those random numbers is critical", n: "Too big and the numbers blow up through the layers; too small and they fade to nothing. Both kill training in the first few steps." },
           { s: "The standard recipes scale the randomness by how many inputs each unit has", n: "More inputs, smaller starting values, so the totals stay in a sensible range." },
           { s: "Frameworks pick something sensible by default", n: "Worth checking only when a run refuses to get started at all." }] }
},

"Convolutional Neural Network": {
 ex: { h: "A magnifying glass swept across a photograph",
       b: "The same small detector is applied everywhere, so a cat's ear is recognised whether it appears top-left or bottom-right. That weight sharing is what makes vision tractable — a fully connected layer on a megapixel image would need billions of parameters for the first layer alone." },
 fl: { t: "How an image becomes a label",
       s: [{ s: "Take a small window of numbers — say 3 by 3 — and slide it across the image, one position at a time", n: "At each stop it reports how strongly that patch matches the pattern it is looking for." },
           { s: "The same window is used at every position, so a shape is recognised wherever it appears", n: "A cat's ear is a cat's ear whether it is top-left or bottom-right." },
           { s: "Shrink the result by keeping only the strongest response in each small area", n: "You lose the exact position and keep the fact that something was there — which is usually what matters." },
           { s: "Repeat, and each round sees a wider area of the original picture than the last", n: "Edges become textures, textures become parts, parts become whole objects." },
           { q: "How does it finish?",
             y: "Flatten everything into a list of numbers and pass it to ordinary layers that produce the final answer",
             n: "Or simply average each pattern's map down to one number each, which uses far fewer connections" }] }
},

"Convolution": {
 ex: { h: "A stencil dabbed across a wall",
       b: "The same pattern is applied at every position, and where the wall matches the stencil the result is bright. Different stencils detect different things — vertical edges, horizontal edges, blobs — and in a CNN nobody designs them: they are learned." },
 fl: { t: "One step of the sliding window",
       s: [{ s: "Line the small window up over a patch of the image", n: "The window holds a grid of numbers — nine of them for a 3 by 3." },
           { s: "Multiply each window number by the image number underneath it, then add all the results together", n: "One number comes out: how strongly this patch matches this pattern." },
           { s: "Write that number down and slide the window along to the next position", n: "Repeat across the whole image." },
           { s: "The grid of numbers you have written down is a map of where that pattern was found", n: "Bright where it matched, dark where it did not." },
           { q: "How many different windows does one layer use?",
             y: "As many as you choose — each learns to spot something different, and each produces its own map",
             n: "So the number of windows decides how many maps come out the other side" }] }
},

"Kernel": {
 ex: { h: "A small window with a pattern printed on it",
       b: "Three by three, nine numbers. Hold it over any part of the image and it reports how well that part matches. A network learns hundreds of these, and inspecting the first layer of a trained CNN shows edge and colour detectors — never designed, simply useful." },
 fl: { t: "Choosing the window size",
       s: [{ s: "A kernel is just a small grid of numbers the network learns", n: "Three by three means nine numbers. That is the entire thing." },
           { s: "Hold it over any patch of the image and it reports how well that patch matches", n: "Nobody designs these — after training, the first layer's kernels turn out to be edge and colour detectors." },
           { q: "How big should it be?",
             y: "3 by 3 is the modern default — and stacking two of them sees as wide an area as one 5 by 5, using fewer numbers",
             n: "A 1 by 1 kernel is also useful: it mixes information across the different pattern maps without looking sideways at all" },
           { s: "Several small windows in a row beat one big window", n: "Fewer numbers to learn, and a bend between each one, which adds flexibility." }] }
},

"Stride": {
 ex: { h: "How far you step between photographs",
       b: "Step one pace and consecutive shots overlap heavily. Step two and you cover the ground in half the frames, at half the resolution. Stride does exactly that to a feature map — and a stride of 2 is a common alternative to a pooling layer." },
 fl: { t: "How far the window jumps",
       s: [{ s: "After each stop, the sliding window moves along by a set number of positions", n: "That number is the stride." },
           { q: "Move by one, or by two?",
             y: "One — consecutive patches overlap heavily, and the output comes out nearly the same size as the input",
             n: "Two — you cover the image in half as many stops, and the output comes out roughly half the size in each direction" },
           { s: "A bigger jump means less computing work and less fine detail kept", n: "Like taking photographs every two paces instead of every one." },
           { s: "This is now a common way to shrink an image inside the layer itself", n: "It increasingly replaces a separate shrinking step, because the network can learn how to shrink." }] }
},

"Padding": {
 ex: { h: "A border round a photo so the frame does not crop it",
       b: "Without padding, every convolution shaves pixels off the edges, and a deep network eats the borders away entirely. Adding a ring of zeros keeps the output the same size, which is what lets you stack fifty layers without the image disappearing." },
 fl: { t: "Same size, or shrinking?",
       s: [{ s: "The sliding window cannot be centred on an edge pixel — part of it would hang off the picture", n: "So without help, every pass shaves a border off the image." },
           { q: "Do you want the output the same size as the input?",
             y: "Yes — add a ring of zeros around the edge first, so the window has something to sit on. The size comes out unchanged",
             n: "No — allow it to shrink a little at every layer. Fine for a shallow network, fatal for a deep one" },
           { s: "Stack fifty layers with no padding and the image disappears entirely", n: "A few pixels lost per layer adds up fast." },
           { s: "Edge pixels get looked at fewer times than middle ones either way", n: "Padding partly makes up for that." }] }
},

"Pooling": {
 ex: { h: "Summarising each square of a map as its highest peak",
       b: "You lose the exact position of the peak and keep the fact that there was one. That is deliberate: a cat is a cat whether the ear is at pixel 40 or 43, and discarding that precision makes the representation smaller and more robust." },
 fl: { t: "Making the picture smaller",
       s: [{ s: "Divide the map into small squares — usually 2 by 2", n: "Four numbers per square." },
           { q: "Keep the biggest, or the average?",
             y: "The biggest — this keeps the strongest evidence that a pattern was found, and is the usual choice",
             n: "The average — smoother, and averaging each map down to a single number is a neat way to finish a network" },
           { s: "Either way the map comes out half as wide and half as tall", n: "Four numbers become one." },
           { s: "You deliberately lose the exact position and keep the fact that something was there", n: "A cat is a cat whether the ear sits at pixel 40 or pixel 43." },
           { s: "There is nothing to learn here — it is a fixed rule", n: "Which is why strided convolutions, which can learn how to shrink, are steadily replacing it." }] }
},

"Feature Map": {
 ex: { h: "A heat map of where one pattern was found",
       b: "Apply the vertical-edge kernel across the photo and you get an image that is bright wherever a vertical edge appeared. Sixty-four kernels produce sixty-four such maps, stacked — and the next layer looks for patterns *among those patterns*." },
 fl: { t: "How the depth builds up",
       s: [{ s: "Slide one window across the image and you get one grid of numbers back", n: "Bright wherever that window's pattern was found. That grid is a feature map." },
           { s: "Use sixty-four different windows and you get sixty-four such grids", n: "One looking for vertical edges, one for horizontal, one for a particular colour, and so on." },
           { s: "Stack those grids on top of each other like a deck of cards", n: "Same width and height, sixty-four layers deep." },
           { q: "What does the next layer look at?",
             y: "All of them at once — its windows reach down through the whole stack",
             n: "Which is how it builds corners out of edges, and shapes out of corners" },
           { s: "As you go deeper the maps get smaller but the stack gets taller", n: "Less about where, more about what." }] }
},

"Receptive Field": {
 ex: { h: "How much of the photograph one neuron can see",
       b: "A first-layer neuron sees a 3×3 patch. A twentieth-layer neuron, through all that stacking, effectively sees most of the image. That widening is why early layers find edges and late layers find objects — they literally cannot see enough to do otherwise." },
 fl: { t: "Why depth gives you context",
       s: [{ s: "A unit in the first layer only ever sees a 3 by 3 patch of the original photo", n: "Nine pixels. It cannot possibly recognise a face from that." },
           { s: "A unit in the second layer sees a 3 by 3 patch *of first-layer results*", n: "But each of those already summarised nine pixels, so it is really seeing a 5 by 5 area of the original." },
           { s: "Keep stacking and that window keeps widening", n: "By layer twenty a single unit is effectively looking at most of the picture." },
           { q: "Need a unit that can see the whole image at once?",
             y: "Go deeper, make the windows skip pixels to cover more ground, or use attention, which sees everything in one step",
             n: "Otherwise the area grows steadily with depth, and faster if you shrink the image along the way" },
           { s: "This is precisely why early layers find edges and late layers find objects", n: "The early ones literally cannot see enough to do anything else." }] }
},

"Residual Connection": {
 ex: { h: "A bypass lane around each roundabout",
       b: "Traffic can go through the roundabout or straight past it. Adding the input back to the output means a layer only has to learn the *difference* it makes, and a layer that learns nothing useful becomes harmless rather than harmful — which is why hundred-layer networks became trainable." },
 fl: { t: "What the shortcut actually buys",
       s: [{ s: "A block of layers does its usual work on the numbers coming in", n: "Multiply, add, bend, and so on." },
           { s: "Then the block's original input is added straight back onto its output", n: "Written simply: output = what the block did + what came in. One extra addition." },
           { s: "So the block only has to work out the *change* it wants to make, not rebuild everything from scratch", n: "Like editing a document with tracked changes instead of retyping the whole page." },
           { q: "Why does this matter so much when correcting the network?",
             y: "The correction signal can travel back straight through that addition, skipping the block entirely, so it never gets shrunk away",
             n: "Without it, thirty layers of shrinking leaves nothing for the early layers to learn from" },
           { s: "And a block that learns nothing useful simply passes its input through unchanged", n: "So adding more depth can no longer make things worse." }] }
},

"ResNet": {
 ex: { h: "The architecture that made depth stop hurting",
       b: "Before it, adding layers beyond about twenty made networks *worse*, and not from overfitting — they were harder to optimise. Residual connections fixed that, and networks jumped from tens of layers to hundreds in a single paper." },
 fl: { t: "The problem it solved",
       s: ["Deeper plain networks performed worse than shallower ones",
           { q: "Was it overfitting?",
             y: "No — training error was higher too. It was an optimisation problem",
             n: "Correct: the deeper network could not even fit the training data" },
           { s: "Residual blocks let each block learn a small correction", n: "Rather than an entire transformation from scratch." },
           "The same idea underpins every transformer written since"] }
},

"Recurrent Neural Network": {
 ex: { h: "Reading a sentence while holding the gist so far",
       b: "You process one word at a time and carry a running summary. That summary is the hidden state. It works, and it has two consequences: you cannot process the sentence in parallel, and by word two hundred the beginning has largely faded." },
 fl: { t: "Why transformers replaced them",
       s: ["Process one token, update the hidden state, move on",
           { q: "Can the sequence be processed in parallel?",
             y: "No — each step depends on the previous one",
             n: "Which caps training throughput regardless of hardware" },
           { s: "Long-range dependencies fade", n: "Gradients vanish across many time steps." },
           "Self-attention sees the whole sequence at once, in parallel"] }
},

"LSTM": {
 ex: { h: "A notebook with an explicit *keep* and *erase* decision",
       b: "Rather than one blurred running summary, an LSTM maintains a cell state plus gates that decide what to write, what to erase and what to read out. That deliberate memory is what let RNNs handle hundreds of steps instead of tens." },
 fl: { t: "What the three gates do",
       s: ["A new token arrives alongside the previous state",
           { s: "Forget gate: what to drop from the cell state", n: "A sigmoid per dimension — 0 erases, 1 keeps." },
           { s: "Input gate: what new information to write", n: "Scaled by another sigmoid." },
           { s: "Output gate: what part of the cell state to expose", n: "The hidden state passed onward." },
           { q: "Why does this fix vanishing gradients?",
             y: "The cell state has an additive path across time steps",
             n: "Same principle as a residual connection, applied along time" }] }
},

"GRU": {
 ex: { h: "An LSTM with two gates instead of three",
       b: "It merges the forget and input gates into a single update gate and drops the separate cell state. Fewer parameters, faster to train, and in most comparisons statistically indistinguishable in quality — which is why it is often the default when an RNN is called for." },
 fl: { t: "GRU or LSTM?",
       s: ["You need a recurrent unit",
           { q: "Is training speed or data volume a constraint?",
             y: "GRU — fewer parameters, trains faster, usually the same accuracy",
             n: "LSTM — occasionally better on very long sequences" },
           { s: "GRU has update and reset gates", n: "No separate cell state." },
           "For most modern sequence work, a transformer beats both"] }
},

"Sequence Model": {
 ex: { h: "Anything where order changes the meaning",
       b: "*Dog bites man* and *man bites dog* use identical words. Any model that treats input as an unordered bag cannot tell them apart, which is why sequence models exist — and why transformers need positional encodings, since attention alone is order-blind." },
 fl: { t: "Choosing an architecture for ordered data",
       s: ["Your input has meaningful order",
           { q: "How long are the sequences and how much data do you have?",
             y: "Long sequences, lots of data — a transformer, parallel and global",
             n: "Short sequences or streaming with tight memory — an RNN still fits" },
           { s: "Convolutions also work on sequences", n: "Fast, with a limited receptive field." },
           "Whatever you choose must encode position somehow"] }
},

"Attention Mechanism": {
 ex: { h: "Deciding which words in the question matter",
       b: "Translating *the animal did not cross the street because it was too tired*, you need to know what *it* refers to. Attention lets the model weight *animal* heavily and *street* lightly when processing *it* — learned, per token, from context." },
 fl: { t: "Query, key and value",
       s: ["Each token produces a query, a key and a value",
           { s: "Compare this token's query against every key", n: "A dot product — how relevant is that token to this one?" },
           { s: "Softmax the scores into weights that sum to 1", n: "The attention distribution." },
           { s: "Take the weighted sum of the values", n: "This token's new representation, built from everything relevant." },
           { q: "What is the cost?",
             y: "Every token compares against every other — quadratic in sequence length",
             n: "Which is why long context is expensive" }] }
},

"Self-Attention": {
 ex: { h: "Everyone in a meeting listening to everyone else at once",
       b: "Not a chain where each person hears only the one before. Every word attends to every other word in the same sequence simultaneously, which is both why transformers capture long-range relationships and why they cost quadratically in length." },
 fl: { t: "Why it replaced recurrence",
       s: ["Every token attends to every token in the same sequence",
           { q: "How many steps to relate word 1 and word 500?",
             y: "One — attention is direct, regardless of distance",
             n: "An RNN needs 499 sequential steps, and the signal decays" },
           { s: "All positions computed in parallel", n: "Which is what made large-scale training feasible." },
           "The cost is O(n²) in sequence length — the central constraint on context size"] }
},

"Multi-Head Attention": {
 ex: { h: "Several readers, each looking for something different",
       b: "One tracks grammatical subject, another tracks pronoun references, another tracks topic. Running attention several times in parallel with different learned projections lets the model attend to different kinds of relationship simultaneously, then combine the findings." },
 fl: { t: "Splitting attention into heads",
       s: ["Project the input into h separate lower-dimensional spaces",
           { s: "Run attention independently in each", n: "Each head learns a different relationship type." },
           { s: "Concatenate the results and project back", n: "Total compute is similar to one full-width head." },
           { q: "Do the heads specialise?",
             y: "Interpretability work finds syntactic, positional and coreference heads",
             n: "Many heads are also redundant and can be pruned" }] }
},

"Positional Encoding": {
 ex: { h: "Numbering the pages before shuffling the folder",
       b: "Attention sees a set, not a sequence — without position information *dog bites man* and *man bites dog* are identical to it. Positional encodings add that information back into the token representations before attention ever runs." },
 fl: { t: "Adding order to an order-blind mechanism",
       s: ["Token embeddings carry meaning but no position",
           { q: "How is position injected?",
             y: "Added to the embeddings — sinusoidal or learned vectors",
             n: "Or applied inside attention itself — RoPE rotates the query and key" },
           { s: "Rotary embeddings became standard", n: "They extrapolate better to lengths not seen in training." },
           "How position is encoded is a major constraint on usable context length"] }
},

"Transformer": {
 ex: { h: "Reading the whole page at once instead of word by word",
       b: "The 2017 paper's title was the whole claim: attention is all you need. Drop recurrence entirely, let every token look at every other in parallel, and training scales with the hardware. Every large language model since is a variation on that block." },
 fl: { t: "One transformer block",
       s: ["Input embeddings plus positional information",
           { s: "Multi-head self-attention", n: "Each token gathers what is relevant from the whole sequence." },
           { s: "Add the input back and normalise", n: "The residual connection and layer norm." },
           { s: "A feed-forward network applied per position", n: "Where most of the parameters actually live." },
           { q: "Then?",
             y: "Add and normalise again, and pass to the next identical block",
             n: "Stack 12 to 100+ of these; the final layer produces logits" }] }
},

"Encoder-Decoder": {
 ex: { h: "An interpreter who listens fully, then speaks",
       b: "They do not translate word by word as you speak — they take in the whole sentence, form the meaning, then produce it in the other language. The encoder reads bidirectionally; the decoder generates left to right while attending back to what was read." },
 fl: { t: "How the two halves connect",
       s: ["The encoder reads the entire input, bidirectionally",
           { s: "It produces a representation of every input position", n: "Each position informed by the whole input." },
           { s: "The decoder generates output tokens one at a time", n: "Attending to its own output so far, causally." },
           { s: "Cross-attention lets it look back at the encoder output", n: "This is the bridge between the halves." },
           { q: "When is this better than decoder-only?",
             y: "Translation and summarisation, where input and output are distinct",
             n: "For open-ended generation, decoder-only won on simplicity and scale" }] }
},

"Embedding": {
 ex: { h: "Giving every word a set of map coordinates",
       b: "*King* and *queen* end up near each other, and the direction from one to the other turns out to be roughly the same as from *man* to *woman*. Nobody built that structure — it emerged because those relationships help predict surrounding words." },
 fl: { t: "Turning meaning into numbers you can compare",
       s: [{ s: "Computers cannot compare meaning directly, so text is turned into a long list of numbers", n: "Typically a few hundred to a couple of thousand numbers per piece of text." },
           { s: "The numbers are arranged so that text used in similar ways ends up with similar numbers", n: "Think of a huge map where related things sit near each other. Nobody labelled the directions — the arrangement emerged from training." },
           { s: "To compare two pieces of text, measure how close their two lists are", n: "Close together means used in similar contexts. That is the whole mechanism behind search by meaning." },
           { q: "Does close together mean the same thing?",
             y: "Usually, and this is where it catches people out — opposites appear in identical contexts, so they land close together too",
             n: "*The patient has diabetes* and *the patient does not have diabetes* score as almost identical, which matters enormously in some settings" },
           { s: "So use it to narrow thousands of documents down to fifty, then check those properly", n: "It is an excellent filter and a poor final judge." }] }
},

"Transfer Learning": {
 ex: { h: "A qualified chef learning one restaurant's menu",
       b: "You do not teach knife skills again. Years of general competence transfer, and only the specifics need learning — which is why fine-tuning a pre-trained model on a thousand examples can beat training from scratch on a hundred thousand." },
 fl: { t: "Adapting a pre-trained model",
       s: ["Start from weights trained on a large general corpus",
           { q: "How much task-specific data do you have?",
             y: "Very little — freeze the backbone and train only a new head",
             n: "More — unfreeze the upper layers and fine-tune with a low learning rate" },
           { s: "Use a much smaller learning rate than pre-training", n: "Or you destroy what was learned — catastrophic forgetting." },
           "Early layers hold general features; later layers hold task-specific ones"] }
},

"Pre-training": {
 ex: { h: "A general education before a professional qualification",
       b: "Years of broad reading, none of it aimed at any particular job, and then a short conversion course. Pre-training is the expensive general phase — done once, by someone with a data centre — and everything you do afterwards is the conversion course." },
 fl: { t: "Where the capability comes from",
       s: ["Train on an enormous general corpus with a self-supervised objective",
           { s: "Next-token prediction, or masked-token prediction", n: "No human labels required at all." },
           { q: "What does the model end up with?",
             y: "Grammar, facts, styles, reasoning patterns — whatever helps predict the next token",
             n: "It is not yet helpful; instruction tuning comes after" },
           "One organisation pays for this; everyone else adapts the result"] }
},

"Autoencoder": {
 ex: { h: "Summarising a book, then rewriting it from the summary",
       b: "The quality of the reconstruction tells you how good the summary was. Force the summary to be short and the network must learn what actually matters. That compressed middle is the representation you were really after." },
 fl: { t: "Learning a compressed representation",
       s: ["The encoder compresses the input to a small bottleneck",
           { s: "The decoder reconstructs the input from it", n: "The loss is reconstruction error." },
           { q: "What forces it to learn something useful?",
             y: "The bottleneck — it cannot copy, so it must keep only what matters",
             n: "Without a bottleneck it learns the identity function and nothing else" },
           "Reconstruction error also makes a natural anomaly detector"] }
},

"Variational Autoencoder": {
 ex: { h: "A summary that describes a range, not a point",
       b: "Instead of *this book is at coordinate 4.2*, it says *this book is somewhere around 4.2, give or take*. That fuzziness forces nearby points to decode into sensible outputs, which is what makes the space continuous enough to sample new examples from." },
 fl: { t: "Why the randomness matters",
       s: ["The encoder outputs a mean and a variance, not a point",
           { s: "Sample from that distribution", n: "The reparameterisation trick keeps it differentiable." },
           { s: "The decoder reconstructs from the sample", n: "So nearby points must decode to similar things." },
           { q: "What does the KL term do?",
             y: "Pulls the latent distribution toward a standard normal, keeping the space smooth",
             n: "Which is what lets you sample new points and get valid outputs" },
           "Outputs are typically blurrier than a GAN's — the trade for a well-behaved space"] }
},

"Generative Adversarial Network": {
 ex: { h: "A forger and a detective improving together",
       b: "The forger makes fakes, the detective tries to spot them, and each gets better because the other does. When the detective can no longer tell, the fakes are good. It is also famously unstable — if either side gets too far ahead, both stop learning." },
 fl: { t: "The adversarial loop",
       s: ["The generator turns noise into a candidate image",
           { s: "The discriminator judges real versus generated", n: "Trained on both." },
           { q: "Who wins this round?",
             y: "Discriminator spots it — the generator gets a gradient telling it what gave it away",
             n: "It is fooled — the discriminator learns from its mistake" },
           { q: "Is training stable?",
             y: "Rarely. Mode collapse and oscillation are the standard failure modes",
             n: "Diffusion models largely replaced GANs for image generation" }] }
},

"Diffusion Model": {
 ex: { h: "Un-blurring a photograph, one small step at a time",
       b: "Train by progressively adding noise to real images until they are static. Then learn to reverse one step of that. Do it fifty times from pure noise, guided by a text prompt, and an image that never existed emerges — far more stably than a GAN ever managed." },
 fl: { t: "Forward and reverse",
       s: ["Forward process: add a little noise, repeatedly, until only noise remains",
           { s: "This part needs no learning at all", n: "It is a fixed schedule." },
           { s: "Train a network to predict the noise added at each step", n: "Given a noisy image and a timestep." },
           { q: "To generate?",
             y: "Start from pure noise and reverse the process step by step",
             n: "Conditioning on a text embedding is what makes it follow a prompt" },
           "Working in a compressed latent space is what made it run on consumer GPUs"] }
},

"Tensor": {
 ex: { h: "A spreadsheet that can have more than two dimensions",
       b: "A number is 0D, a list is 1D, a table is 2D, and a batch of colour images is 4D — batch, height, width, channel. Ninety percent of deep learning debugging is working out why the shape at line 40 is not what the layer at line 41 expects." },
 fl: { t: "Debugging a shape mismatch",
       s: ["An error says shapes do not align",
           { s: "Print the shape at every step", n: "The single most effective debugging habit in this field." },
           { q: "Is the batch dimension where you expect?",
             y: "Check the channel convention — NCHW versus NHWC differs by framework",
             n: "You probably dropped or added a dimension with a reshape or an index" },
           { s: "Broadcasting silently expands dimensions of size 1", n: "Which can hide an error until the loss is inexplicable." }] }
},

"Automatic Differentiation": {
 ex: { h: "A machine that differentiates your code for you",
       b: "Nobody writes the derivative of a fifty-layer network by hand, and numerically approximating it would be far too slow and inaccurate. Autodiff records what operations ran and applies the chain rule mechanically — exactly, and at roughly the cost of the forward pass." },
 fl: { t: "How the framework knows the gradient",
       s: ["Every operation on a tracked tensor is recorded",
           { s: "Building a graph of what depended on what", n: "PyTorch builds it as you go; JAX traces the function." },
           { s: "Calling backward walks the graph in reverse", n: "Applying each operation's known local derivative." },
           { q: "Why not approximate numerically?",
             y: "Autodiff is exact and far cheaper — one backward pass, not one per parameter",
             n: "Which is why frameworks are built around this" }] }
},

"Computational Graph": {
 ex: { h: "A flowchart of every calculation that happened",
       b: "Node by node, which value fed into which operation. It is what makes backpropagation mechanical — walk the graph backwards applying the chain rule. Static graphs compile and optimise well; dynamic ones let you use a Python `if` in the middle of a model." },
 fl: { t: "Static or dynamic",
       s: ["Operations build a graph of dependencies",
           { q: "Is the graph fixed before running?",
             y: "Static — compiles and optimises well, harder to debug",
             n: "Dynamic — built on the fly, so Python control flow works naturally" },
           { s: "PyTorch is dynamic by default, with compilation available", n: "The best of both, mostly." },
           "The graph is discarded after each backward pass unless you ask to keep it"] }
},

"Mixed Precision Training": {
 ex: { h: "Doing the rough work in pencil and the totals in ink",
       b: "Most of the arithmetic does not need full precision, so it runs in 16-bit — half the memory, much faster on modern hardware. The running totals, where small errors would accumulate, stay in 32-bit. Same result, roughly twice the speed." },
 fl: { t: "How it stays numerically safe",
       s: ["Run most operations in 16-bit",
           { s: "Keep a master copy of the weights in 32-bit", n: "So tiny updates are not lost to rounding." },
           { q: "Do small gradients underflow to zero in 16-bit?",
             y: "Loss scaling multiplies the loss up before backward, then divides after",
             n: "Frameworks handle this automatically with autocast and a grad scaler" },
           "Roughly 2× throughput and half the activation memory, for a few lines of code"] }
},

"Distributed Training": {
 ex: { h: "A large build split across several crews",
       b: "More hands finish sooner, and only if the coordination overhead does not eat the gain. Splitting the batch across GPUs is straightforward; splitting a model that does not fit on one card is a much harder engineering problem." },
 fl: { t: "Choosing a strategy",
       s: ["Training is too slow or too large for one GPU",
           { q: "Does the model fit on a single device?",
             y: "Data parallelism — same model everywhere, split the batch",
             n: "Model, tensor or pipeline parallelism — split the model itself" },
           { s: "Gradients must be synchronised each step", n: "All-reduce across devices; interconnect speed becomes the bottleneck." },
           "ZeRO and FSDP shard optimiser state and parameters to save memory"] }
},

"Data Parallelism": {
 ex: { h: "Four markers each taking a quarter of the papers",
       b: "Everyone has an identical copy of the mark scheme, splits the pile, marks their share, and then they compare notes and agree a single update. Simple, effective, and the only requirement is that each marker can hold the whole scheme." },
 fl: { t: "One step across N devices",
       s: ["Replicate the model on every GPU",
           { s: "Split the batch — each device gets a slice", n: "Effective batch size is N times the per-device size." },
           { s: "Each computes gradients on its slice", n: "Independently, in parallel." },
           { s: "All-reduce averages the gradients across devices", n: "The communication step, and often the bottleneck." },
           { q: "What if the model does not fit on one GPU?",
             y: "This will not help — you need model or tensor parallelism",
             n: "Scale the learning rate with the effective batch size" }] }
},

"Knowledge Distillation": {
 ex: { h: "An experienced teacher writing the notes, a student learning from them",
       b: "The large model's full probability distribution says more than the correct label alone — that this image is 70% cat, 25% lynx, 5% dog carries information about how classes relate. The small model learns from that richer signal and ends up far better than training on hard labels alone." },
 fl: { t: "Training a small model from a large one",
       s: ["Run the teacher on the training data",
           { s: "Keep its full softmax output, not just the argmax", n: "Softened with a temperature, so the small probabilities are visible." },
           { s: "Train the student to match that distribution", n: "Often combined with the true labels." },
           { q: "How much smaller can the student be?",
             y: "Often 5–10× with a modest quality loss",
             n: "It inherits the teacher's mistakes and biases along with its skill" }] }
},

"Graph Neural Network": {
 ex: { h: "Reputation spreading through a social network",
       b: "What you know about a person comes partly from their neighbours, and from their neighbours' neighbours. GNNs formalise that: each node repeatedly aggregates information from its neighbours, so after k rounds each node knows about everything within k hops." },
 fl: { t: "Message passing",
       s: ["Every node starts with its own feature vector",
           { s: "Each node aggregates its neighbours' vectors", n: "Sum, mean, max, or attention-weighted." },
           { s: "Combine that with its own and update", n: "One layer, one hop of information." },
           { q: "How many layers?",
             y: "k layers means k hops of context",
             n: "Too many and every node's representation converges — over-smoothing" },
           "Suits molecules, road networks, fraud rings and recommendation graphs"] }
},

"Contrastive Learning": {
 ex: { h: "Learning faces by matching photos of the same person",
       b: "You are never told who anyone is. You are shown two photos of the same person and two of different people, and asked to pull the first pair together and push the second apart. Do that at scale and you learn what makes faces similar without a single name." },
 fl: { t: "Learning without labels",
       s: ["Create two augmented views of the same example",
           { s: "Crop, colour-shift, mask — the pair is a positive", n: "Different examples in the batch are negatives." },
           { s: "Train so positives are close and negatives far apart", n: "In embedding space." },
           { q: "How many negatives do you need?",
             y: "Many — large batches or a memory bank; quality depends on it",
             n: "This is exactly how CLIP learned to align images and captions" }] }
},

"Catastrophic Forgetting": {
 ex: { h: "Cramming for one exam and losing the last subject",
       b: "Fine-tune enthusiastically on legal documents and the model gets noticeably worse at everything else. The weights that encoded general ability get overwritten, because nothing in the new objective was defending them." },
 fl: { t: "Fine-tuning without destroying the base",
       s: ["You fine-tune on a narrow dataset",
           { q: "Learning rate at pre-training levels?",
             y: "General ability is being overwritten — use 10–100× smaller",
             n: "Check on a general benchmark, not just your task" },
           { s: "Freeze most of the model and train an adapter", n: "LoRA sidesteps the problem almost entirely." },
           { s: "Or mix general data into the fine-tuning set", n: "Rehearsal keeps the old skills alive." },
           "Always evaluate on the old task as well as the new one"] }
},

"PyTorch": {
 ex: { h: "A workshop where you can stop the machine mid-cut",
       b: "The graph is built as the code runs, so you can put a print statement or a breakpoint anywhere and inspect real values. That debuggability is why research moved to it wholesale, and why almost every model released today ships as PyTorch first." },
 fl: { t: "The standard training loop",
       s: ["`optimizer.zero_grad()` — clear last step's gradients",
           { s: "Forward pass, then compute the loss", n: "Skipping the zero_grad is the classic bug: gradients accumulate." },
           { s: "`loss.backward()` — autograd fills in every gradient", n: "Walking the graph built during the forward pass." },
           { s: "`optimizer.step()` — apply the update", n: "Then repeat for the next batch." },
           { q: "Evaluating?",
             y: "`model.eval()` and `torch.no_grad()` — dropout off, no graph built",
             n: "Forgetting either gives wrong results or wastes memory" }] }
},

"TensorFlow": {
 ex: { h: "Built for the factory floor, not the workbench",
       b: "Its strength was always deployment: SavedModel, TF Serving, TF Lite on phones, TFX pipelines. Version 2 adopted eager execution to close the usability gap with PyTorch, by which point research had largely moved on — but production TensorFlow is still very much alive." },
 fl: { t: "Where it still wins",
       s: ["You need to deploy a model somewhere constrained",
           { q: "Mobile, embedded, or browser?",
             y: "TF Lite and TF.js are mature and well-trodden paths",
             n: "TF Serving and TFX cover large-scale production pipelines" },
           { s: "`tf.function` compiles a graph from eager code", n: "Debuggability while developing, performance when it matters." },
           "Keras is the high-level API and now works across backends"] }
},

"Keras": {
 ex: { h: "The friendly front desk of a large building",
       b: "`model.fit()` hides the training loop entirely, which is exactly right when you want a standard model trained on standard data. The moment you need a custom loss over two models with an unusual schedule, you go through the door behind the desk." },
 fl: { t: "Which API to use",
       s: ["You are defining a model",
           { q: "Is it a simple stack of layers?",
             y: "Sequential — the shortest path from idea to trained model",
             n: "Functional API for multi-input or branching architectures" },
           { s: "Subclass `Model` for full control", n: "Custom training steps, unusual losses, research code." },
           "Keras 3 runs on TensorFlow, JAX or PyTorch backends"] }
},

"JAX": {
 ex: { h: "A set of composable power tools",
       b: "`jit` compiles it, `grad` differentiates it, `vmap` batches it, `pmap` spreads it across devices — and they compose, so you can differentiate a batched compiled function without writing any of that plumbing. The requirement is that your functions are pure." },
 fl: { t: "Why purity is required",
       s: ["You write a plain numerical function",
           { q: "Does it mutate state or depend on anything external?",
             y: "The transformations will not work correctly — JAX needs pure functions",
             n: "`jit` traces it once and compiles it via XLA" },
           { s: "Transformations compose freely", n: "`jit(grad(vmap(f)))` is ordinary usage." },
           "Random numbers need explicit keys — there is no hidden global state"] }
},

"NumPy": {
 ex: { h: "The common language every numerical library speaks",
       b: "Pandas, scikit-learn, SciPy, matplotlib and every deep learning framework can all accept or produce a NumPy array. Its real contribution is vectorisation: operations run in compiled C over whole arrays, so a Python loop over a million elements becomes one line and a hundredfold speed-up." },
 fl: { t: "Why the loop is slow and the array is fast",
       s: ["You need to operate on a million numbers",
           { q: "Python `for` loop?",
             y: "Every iteration pays Python's interpreter overhead — seconds",
             n: "One vectorised expression runs in compiled C — milliseconds" },
           { s: "Broadcasting handles mismatched shapes automatically", n: "Powerful, and a common source of silent bugs." },
           "Slices are views, not copies — writing to a slice changes the original"] }
},

"Vision Transformer": {
 ex: { h: "Treating an image as a sentence of patches",
       b: "Cut the picture into 16×16 squares, flatten each into a vector, and feed the sequence to a transformer as if the patches were words. It works, and it needs far more data than a CNN — because it has none of the built-in assumption that nearby pixels are related." },
 fl: { t: "From image to sequence",
       s: ["Split the image into fixed-size patches",
           { s: "Flatten and linearly project each into an embedding", n: "Now it is a sequence of tokens." },
           { s: "Add positional embeddings", n: "Otherwise the patches are an unordered set." },
           { s: "Run standard transformer blocks", n: "Global attention from the first layer onward." },
           { q: "Trained on a small dataset?",
             y: "It underperforms a CNN — no locality prior to fall back on",
             n: "With enough data or pre-training, it matches or beats CNNs" }] }
},

"Word2Vec": {
 ex: { h: "Learning a word's meaning from the company it keeps",
       b: "Nothing was defined. The model was trained to predict surrounding words, and out of that fell a space where *king* minus *man* plus *woman* lands near *queen*. That result convinced a generation that meaning could be geometry." },
 fl: { t: "How the vectors emerge",
       s: ["Slide a window across a large corpus",
           { q: "Which direction do you predict?",
             y: "Skip-gram — from the centre word, predict the neighbours",
             n: "CBOW — from the neighbours, predict the centre word" },
           { s: "Train with negative sampling for efficiency", n: "Real pairs up, random pairs down." },
           { s: "The hidden layer weights become the word vectors", n: "The prediction task was only ever a means to that end." },
           "One vector per word, so *bank* has a single blended meaning — which is what contextual models fixed"] }
}

});
