/* Real-world examples and step-by-step flows — Machine Learning Core. */
TD.attach("ai-ml-core", {

"Artificial Intelligence": {
 ex: { h: "The word *engine* over two centuries",
       b: "A steam engine, a search engine and a game engine share a name and almost nothing else. AI has moved the same way: chess programs, spam filters and language models were all called AI in their decade, and each stopped feeling like AI once it worked. That receding definition is worth remembering when someone claims a system *is* AI." },
 fl: { t: "Placing a system on the map",
       s: ["Someone describes a system as AI",
           { q: "Are the rules written by a person?",
             y: "Symbolic or rule-based — powerful, brittle, and fully inspectable",
             n: "The rules were learned from data — machine learning" },
           { s: "Within ML, deep learning is one family", n: "Neural networks that learn their own features." },
           "The label matters less than: what data, what objective, what failure mode"] }
},

"Machine Learning": {
 ex: { h: "Teaching by examples instead of by rules",
       b: "Nobody could write down every rule that distinguishes spam from a real email — the spammers change them weekly. So you show a system a hundred thousand labelled examples and let it infer the rules, which it then keeps up to date as you feed it more. The trade is that you can no longer read the rules." },
 fl: { t: "Rules or learning?",
       s: ["You have a task to automate",
           { q: "Can you write the rules down completely?",
             y: "Write them. A rule engine is faster, cheaper and debuggable",
             n: "The rules are implicit in the data — machine learning fits" },
           { s: "You now need labelled examples, and lots of them", n: "Usually the real cost of the project." },
           "And you accept a model that is right most of the time, not always"] }
},

"Supervised Learning": {
 ex: { h: "Revising with the answers at the back",
       b: "You attempt a question, check the answer, and adjust. It is the fastest way to learn anything and it requires someone to have written the answers first — which is why supervised learning is usually bottlenecked on labelling, not on modelling." },
 fl: { t: "The supervised loop",
       s: ["Collect examples with known correct answers",
           { s: "Split into train, validation and test", n: "Never let them mix." },
           { s: "Model predicts; loss measures the gap to the label", n: "That gap is the only teaching signal there is." },
           { q: "Is validation performance still improving?",
             y: "Keep training",
             n: "Stop — beyond here it memorises the training set" },
           "Test once, at the very end, to get an honest estimate"] }
},

"Unsupervised Learning": {
 ex: { h: "Sorting a stranger's record collection",
       b: "Nobody tells you the categories. You notice some are loud and fast, some are quiet and long, and piles form. Whether those piles are *useful* is a separate question entirely — which is exactly the difficulty of evaluating unsupervised results." },
 fl: { t: "Finding structure with no labels",
       s: ["You have data and no answers",
           { q: "What are you hoping to find?",
             y: "Groups — clustering. Fewer dimensions — PCA or UMAP. Oddities — anomaly detection",
             n: "If you cannot say, the result will be hard to judge" },
           { s: "There is no accuracy score", n: "Evaluation is silhouette scores, stability, and human judgement." },
           "The clusters are real; whether they mean anything is your call"] }
},

"Semi-Supervised Learning": {
 ex: { h: "A few marked essays and a huge pile of unmarked ones",
       b: "The teacher marks two hundred and hands you five thousand. You use the marked ones to work out the standard, then use that understanding to make sense of the rest. It works when labels are expensive and raw data is not — which is most real situations." },
 fl: { t: "Using unlabelled data productively",
       s: ["You have 500 labelled and 50,000 unlabelled examples",
           { s: "Train an initial model on the labelled set", n: "Weak, but not useless." },
           { s: "Predict on the unlabelled data and keep the confident predictions", n: "Pseudo-labelling." },
           { q: "Were those confident predictions actually right?",
             y: "Retrain on the enlarged set and improve",
             n: "Confirmation bias — the model reinforces its own mistakes" },
           "Always keep a genuinely labelled validation set outside this loop"] }
},

"Self-Supervised Learning": {
 ex: { h: "Cloze exercises that mark themselves",
       b: "Cover a word in a sentence and try to guess it — the answer was already there. No teacher needed, which means you can do it on every book ever written. That is precisely how modern language models are pre-trained, and why the amount of data is limited only by what exists." },
 fl: { t: "Where the labels come from",
       s: ["Take raw, unlabelled data",
           { s: "Hide part of it and ask the model to reconstruct it", n: "Next token, masked word, missing patch of an image." },
           { q: "Where is the ground truth?",
             y: "In the data itself — you removed it, so you know the answer",
             n: "No human labelling is involved at any point" },
           "The learned representations then transfer to real tasks with far fewer labels"] }
},

"Reinforcement Learning": {
 ex: { h: "Training a dog with treats and no vocabulary",
       b: "You cannot explain *sit*. You can reward the behaviour when it happens and stay quiet when it does not, and the association forms. The hard part is credit assignment — which of the last twenty things it did earned the treat? — and that is the central difficulty of RL too." },
 fl: { t: "The agent–environment loop",
       s: ["The agent observes the current state",
           { s: "It chooses an action from its policy", n: "Sometimes the best known one, sometimes an exploratory one." },
           { s: "The environment returns a new state and a reward", n: "Often zero — rewards are usually sparse." },
           { q: "Which earlier action deserves the credit?",
             y: "That is the credit assignment problem, and it is the hard part",
             n: "Update the policy toward actions that led to higher return" },
           "Reward shaping is where most RL projects go wrong"] }
},

"Classification": {
 ex: { h: "Sorting post into pigeonholes",
       b: "Every letter goes in exactly one hole, and the holes were decided in advance. The interesting questions are not about the sorting but the design: what happens to something that fits two holes, and what happens to something that fits none — because in production both arrive constantly." },
 fl: { t: "From score to decision",
       s: ["The model outputs a probability per class",
           { q: "Binary or multi-class?",
             y: "Binary — compare against a threshold you choose deliberately",
             n: "Multi-class — take the highest, or the top-k" },
           { s: "The default 0.5 threshold is rarely right", n: "It assumes false positives and false negatives cost the same." },
           { q: "Is one error type much more expensive?",
             y: "Move the threshold to trade precision against recall",
             n: "Report the confusion matrix, never accuracy alone" }] }
},

"Regression": {
 ex: { h: "Estimating a house price, not naming a colour",
       b: "The answer is a number on a continuous scale, so *close* counts. Being £5,000 out on a £400,000 house is a good prediction; being one class out in a classifier is simply wrong. That difference is why regression and classification use entirely different metrics." },
 fl: { t: "Choosing an error metric",
       s: ["The model predicts a continuous value",
           { q: "Are large errors disproportionately bad?",
             y: "Mean squared error — it punishes big misses heavily",
             n: "Mean absolute error — robust to the occasional wild outlier" },
           { s: "Report in the units people understand", n: "*£12,000 average error* lands; *MSE 1.4e8* does not." },
           "Compare against a baseline — predicting the mean is harder to beat than you think"] }
},

"Clustering": {
 ex: { h: "Seating a wedding with no guest list categories",
       b: "You look at who talks to whom and tables form. Nobody told you *university friends* and *work colleagues* existed — and the groups you find may not match the ones anybody would have named. That is the promise and the problem of clustering in one image." },
 fl: { t: "From data to usable segments",
       s: ["Scale the features first",
           { s: "Distance-based methods are dominated by large-range features otherwise", n: "Income in pounds will swamp age in years." },
           { q: "Do you know how many groups you want?",
             y: "K-means — fast, needs k, assumes round clusters",
             n: "DBSCAN or hierarchical — finds the count, handles odd shapes" },
           { s: "Validate stability", n: "Do the clusters survive a different random seed or a data subset?" },
           "Then have a human name them — unnamed clusters get ignored"] }
},

"Dimensionality Reduction": {
 ex: { h: "Drawing a map of a mountain range",
       b: "You lose the third dimension and gain something you can actually read and print. The art is losing the dimension that mattered least — a map that flattened east–west instead of altitude would be useless. That is what PCA does mathematically: keep the directions with the most variation." },
 fl: { t: "Cutting columns without losing the signal",
       s: [{ s: "You have 500 columns and many of them overlap heavily", n: "Too many columns makes models slower, hungrier for data, and prone to memorising." },
           { q: "Are you doing this to feed a model, or to show a human?",
             y: "To feed a model — use a method that keeps as much of the variation as possible while removing duplication between columns",
             n: "To draw a picture — use a method built for squashing down to two dimensions that a person can actually look at, which is not the same job" },
           { s: "Work out the reduction from the training data alone, then apply it unchanged to everything else", n: "Same rule as any other preparation step: fitting on all your data leaks the answers." },
           { s: "You give up being able to explain the columns", n: "The new ones are blends, so \"column 1 went up\" no longer corresponds to anything a person can name." },
           { s: "Check how much variation you kept before trusting the result", n: "Squashing 500 columns to 2 and keeping 30% of the variation means you threw away most of your data." }] }
},

"Anomaly Detection": {
 ex: { h: "A bank noticing a card used in two countries at once",
       b: "Nobody labelled that transaction as fraud. It was flagged because it does not fit the pattern of everything else. Which is also why anomaly detectors produce so many false positives: unusual and wrong are different things, and a legitimate holiday looks a lot like a stolen card." },
 fl: { t: "Building one that people will not switch off",
       s: ["Learn what normal looks like from mostly-normal data",
           { s: "Score new points by how poorly they fit", n: "Isolation forests, autoencoder error, distance from a density model." },
           { q: "Is the alert rate tolerable for the people receiving it?",
             y: "Ship it — with an easy way to mark false positives",
             n: "Raise the threshold; an ignored alarm is worse than none" },
           "Normal drifts over time — a static model degrades quietly"] }
},

"Feature": {
 ex: { h: "What a doctor writes down before a diagnosis",
       b: "Age, temperature, blood pressure, symptom duration. Not everything about the patient — the things believed to carry signal. Choosing what to record is doing most of the diagnostic work, which is exactly why feature engineering used to dominate classical ML." },
 fl: { t: "Deciding whether something belongs in the feature set",
       s: ["You consider adding a column",
           { q: "Will its value be available at prediction time?",
             y: "Good — continue",
             n: "Leakage. It only exists after the outcome you are predicting" },
           { q: "Does it plausibly relate to the target?",
             y: "Add it and measure the change on validation",
             n: "Noise adds variance and dilutes the real signal" },
           "More features is not better — each one costs data to learn from"] }
},

"Feature Engineering": {
 ex: { h: "Turning a timestamp into *is it a weekend*",
       b: "The raw value `2026-08-23T14:30Z` is nearly useless to a model. *Saturday, afternoon, 3 days before payday* is not. Nothing was added — the same information was reshaped into a form where the pattern is one step away instead of ten." },
 fl: { t: "Reshaping raw data into signal",
       s: ["Start with the raw columns",
           { s: "Decompose", n: "A timestamp becomes hour, weekday, month, is-holiday." },
           { s: "Aggregate", n: "Orders become count, mean value, days since last, trend." },
           { s: "Combine", n: "Ratios and differences often carry more signal than either part." },
           { q: "Did validation performance improve?",
             y: "Keep it — and compute it identically in training and serving",
             n: "Drop it; complexity without signal is pure cost" }] }
},

"Feature Selection": {
 ex: { h: "Packing for a trip with one bag",
       b: "Taking everything is not an option and taking too little means you are cold. Extra features act like extra weight: they slow everything down, and each one gives the model another chance to learn a coincidence that will not hold next month." },
 fl: { t: "Cutting the feature set down",
       s: ["You have far more features than you need",
           { s: "Drop the near-constant and the duplicated", n: "Cheap, safe, and often removes a third of them." },
           { s: "Remove one of each highly correlated pair", n: "They carry the same information twice." },
           { q: "Still too many?",
             y: "Use model-based importance or recursive elimination, judged on validation",
             n: "Stop — do not over-engineer this" },
           "Always select using training data only, inside the cross-validation loop"] }
},

"Feature Scaling": {
 ex: { h: "Comparing a marathon time with a shoe size",
       b: "One is measured in thousands, the other in single digits. Any method that measures distance will be dominated by the marathon time and effectively ignore the shoe size — not because it matters more, but because its numbers are bigger. Scaling puts them on comparable footing." },
 fl: { t: "Deciding whether you need it at all",
       s: [{ s: "Your columns are on wildly different scales: age runs 0 to 100, salary runs 20,000 to 200,000", n: "To a computer those are just numbers, and the bigger ones look more important." },
           { q: "Does your model measure distances between rows, or adjust itself in small steps?",
             y: "Nearest neighbours, support vector machines, clustering, neural networks — then rescaling is required, not optional. Skip it and salary drowns out everything else",
             n: "Trees and forests ask questions like \"is salary above 50,000\", one column at a time. The scale is irrelevant to them" },
           { s: "Rescaling usually means shifting each column to sit around zero with a comparable spread", n: "After it, a step of 1 means roughly the same amount of change in every column." },
           { s: "Work out the rescaling from the training data only, then apply those same numbers everywhere else", n: "Calculating them from all your data lets information about the test set leak into training, and quietly inflates your score." }] }
},

"One-Hot Encoding": {
 ex: { h: "Ticking one box on a form, not writing a number",
       b: "Coding red as 1, green as 2 and blue as 3 tells the model that blue is three times red and that green sits between them — none of which is true. One column per colour, with a single tick, says only what you meant: it is this one and not the others." },
 fl: { t: "Encoding a categorical column",
       s: ["A column holds unordered categories",
           { q: "How many distinct values?",
             y: "A handful — one-hot is simple and correct",
             n: "Thousands — one-hot explodes the feature count; use target or hash encoding" },
           { s: "Fit the encoding on training data", n: "And decide what to do with unseen categories at serving time." },
           { q: "Is there a genuine order — small, medium, large?",
             y: "Ordinal encoding preserves it and uses one column",
             n: "One-hot; never invent an order that is not there" }] }
},

"Label Encoding": {
 ex: { h: "Numbering the runners in a race",
       b: "Runner 7 is not better than runner 3. The numbers are names. That is fine for a tree, which only ever asks *is it above or below this value* on the way to carving out the right group — and actively harmful for a linear model, which will read the numbers as a scale." },
 fl: { t: "When it is safe",
       s: ["You map categories to integers",
           { q: "Which model consumes this?",
             y: "Tree-based — safe, compact, and widely used",
             n: "Linear, KNN, or a neural network — it will infer an order that does not exist" },
           { s: "Ordinal data is the exception", n: "Small/medium/large genuinely has an order worth encoding." },
           "Store the mapping — you need it again at serving time"] }
},

"Training Data": {
 ex: { h: "The case files a junior lawyer learns from",
       b: "If every file involves commercial leases, they will be excellent at leases and lost in family law. The model can only know the world it was shown — which is why *the model is biased* is nearly always a statement about the data collection, not the algorithm." },
 fl: { t: "Auditing a dataset before you train",
       s: ["You have a candidate dataset",
           { s: "Check the class balance", n: "A 99:1 split makes accuracy meaningless." },
           { s: "Check coverage against production reality", n: "Which segments are absent or thin?" },
           { q: "Does it contain personal data?",
             y: "Anonymise, and check the legal basis before it goes anywhere",
             n: "Check for duplicates — they inflate scores quietly" },
           "The dataset is the product; the model is a consequence of it"] }
},

"Training, Validation and Test Split": {
 ex: { h: "Homework, mocks and the real exam",
       b: "You learn on the homework, tune your revision using the mock, and the real exam is sat once. Sit the real exam twenty times while adjusting and it stops measuring anything — which is exactly what happens to a test set you keep checking against." },
 fl: { t: "Keeping the final number honest",
       s: ["Split the data before you look at it",
           { s: "Train: the model learns here", n: "Roughly 70%." },
           { s: "Validation: choose hyperparameters here", n: "You may use this repeatedly." },
           { q: "Have you touched the test set yet?",
             y: "Every look leaks a little — it stops being an honest estimate",
             n: "Use it once, at the end, and report that number" },
           "Split by time or by group where records are related, never at random"] }
},

"Cross-Validation": {
 ex: { h: "Five different mock exams instead of one",
       b: "Doing well on a single mock might be luck — an easy paper, a good day. Five papers, each marked separately, and the spread tells you how reliable the average is. That spread is the real product of cross-validation, and people routinely ignore it." },
 fl: { t: "K-fold, done properly",
       s: ["Split the training data into k folds",
           { s: "Train on k−1, evaluate on the held-out one", n: "Repeat k times, so every fold is held out once." },
           { q: "Is any preprocessing fitted outside the loop?",
             y: "Leakage — scalers and encoders must be fitted inside each fold",
             n: "Average the k scores, and report the standard deviation too" },
           "For time series, use forward-chaining — never let the future train the past"] }
},

"Overfitting": {
 ex: { h: "Memorising past exam papers word for word",
       b: "Perfect marks on every paper you have seen, and confusion the moment the wording changes. The student learned the papers, not the subject. A model that scores 99% on training and 71% on validation has done precisely this, and the gap is the diagnosis." },
 fl: { t: "Spotting and fixing it",
       s: ["Compare training and validation scores",
           { q: "Is training far better than validation?",
             y: "Overfitting — the model learned noise specific to the training set",
             n: "Both poor? That is underfitting — a different problem entirely" },
           { s: "Fixes, in order of effectiveness", n: "More data, then regularisation, then a simpler model, then early stopping." },
           "The validation curve turning upward is your stopping signal"] }
},

"Underfitting": {
 ex: { h: "Fitting a straight ruler to a curve",
       b: "No amount of careful positioning makes a straight line follow a bend. The model is not capable of expressing the shape in the data, so it is mediocre everywhere — bad on training and bad on validation alike, which is what distinguishes it from overfitting." },
 fl: { t: "Diagnosing a model that is bad at everything",
       s: ["Training and validation scores are both poor",
           { q: "Are they close to each other?",
             y: "Underfitting — not enough capacity, or not enough signal in the features",
             n: "A large gap means overfitting instead" },
           { s: "Add capacity or better features", n: "A deeper model, interaction terms, non-linear transforms." },
           "Or accept that the features genuinely do not predict the target"] }
},

"Bias-Variance Trade-off": {
 ex: { h: "A cautious surveyor and a jumpy one",
       b: "One always reads two metres short, consistently — that is bias. The other averages correctly but scatters wildly between readings — that is variance. Both are wrong, in opposite ways, and reducing one usually increases the other." },
 fl: { t: "Working out which problem you have",
       s: [{ s: "There are exactly two ways a model can be wrong, and they need opposite fixes", n: "Getting this diagnosis backwards is why people spend weeks making a model worse." },
           { s: "Check its score on the data it learned from, and on data it has never seen", n: "Two numbers. Comparing them tells you everything." },
           { q: "Is it bad at both?",
             y: "The model is too simple to capture the pattern at all — it is underfitting. Give it more power: more features, a more flexible model, longer training",
             n: "Good on data it has seen, bad on data it has not? Then it memorised the examples instead of learning the pattern — it is overfitting" },
           { s: "For memorising, the fixes are the opposite: more data, a simpler model, or deliberately holding it back", n: "Anything that stops it fitting every last quirk of the training examples." },
           { s: "Some error is simply unavoidable, and no model beats it", n: "If two identical customers made different choices, nothing can predict which is which. Chasing that last bit is chasing noise." }] }
},

"Regularisation": {
 ex: { h: "A word limit on an essay",
       b: "It forces the writer to keep only the arguments that carry weight. Regularisation penalises complexity in exactly the same spirit: the model may use whatever it likes, but every coefficient costs something, so only the ones that genuinely help survive." },
 fl: { t: "Deliberately holding a model back",
       s: [{ s: "The problem: a model given free rein will memorise your training examples, quirks included", n: "Perfect on data it has seen, useless on anything new." },
           { s: "The fix is counter-intuitive — make it harder for the model to do well", n: "Add a penalty for complexity, so it now has to balance fitting the data against staying simple." },
           { s: "A model will only keep a complicated pattern if the data insists strongly enough to pay that penalty", n: "Coincidences in the training data are not worth the cost, so they get dropped." },
           { q: "Do you want useless columns removed completely, or just turned down?",
             y: "One version pushes unhelpful columns to exactly zero, which effectively deletes them and tells you which columns mattered",
             n: "The other shrinks everything towards zero without removing anything, which is usually the safer default" },
           { s: "Choose the strength by testing on data the model has not seen", n: "Too little and it memorises. Too much and it is too restricted to learn anything." }] }
},

"L1 and L2 Regularisation": {
 ex: { h: "Cutting a budget by department or across the board",
       b: "L1 closes some departments completely and leaves the rest funded — you end up with a shorter list. L2 trims every department by a proportion, keeping all of them alive but smaller. Both reduce spending; only one tells you what to stop doing." },
 fl: { t: "Choosing between them",
       s: ["You need to constrain a model with many features",
           { q: "Do you want a sparse, interpretable model?",
             y: "L1 (Lasso) — irrelevant coefficients become exactly zero",
             n: "L2 (Ridge) — all features kept, all shrunk, handles correlation better" },
           { s: "Elastic Net blends the two", n: "Sparsity, plus stability when features are correlated." },
           "Scale your features first — otherwise the penalty falls unevenly"] }
},

"Hyperparameter": {
 ex: { h: "Oven temperature versus the recipe",
       b: "The recipe is learned by cooking; the oven temperature is set by you before anything goes in. Hyperparameters are the dials — depth, learning rate, number of trees — and unlike the weights, no amount of training will adjust them for you." },
 fl: { t: "Parameter or hyperparameter?",
       s: ["You are looking at a number in the model setup",
           { q: "Is it learned from data during training?",
             y: "A parameter — weights, coefficients, split thresholds",
             n: "A hyperparameter — you set it, and you tune it on validation" },
           { s: "Tune on validation, never on test", n: "Every tuning decision that touches test leaks." },
           "Record the values with the run, or the result is not reproducible"] }
},

"Hyperparameter Tuning": {
 ex: { h: "Dialling in an espresso machine",
       b: "Grind, dose, temperature, time — all interacting, and changing two at once tells you nothing. Systematic beats intuition, and the biggest practical mistake is tasting the same cup twenty times: tuning against the test set until it stops meaning anything." },
 fl: { t: "Searching without fooling yourself",
       s: ["Define the search space for each hyperparameter",
           { q: "How large is the space?",
             y: "Small and discrete — grid search covers it exhaustively",
             n: "Large or continuous — random or Bayesian search finds more, faster" },
           { s: "Evaluate every candidate with cross-validation", n: "A single split will mislead you." },
           { s: "Pick the winner on validation", n: "Then score once on test and report that." },
           "Log every trial — the losers tell you where the sensitivity is"] }
},

"Grid Search": {
 ex: { h: "Trying every combination on a padlock",
       b: "Guaranteed to find it, and the cost multiplies with every extra dial. Four hyperparameters with five values each is 625 fits before cross-validation multiplies it again. Which is why random search, counter-intuitively, usually finds a better setting in the same time." },
 fl: { t: "When exhaustive search is the right call",
       s: ["You have a search space to explore",
           { q: "Is it two or three parameters with few sensible values?",
             y: "Grid search — complete, reproducible, easy to explain",
             n: "The combinations explode; use random or Bayesian search" },
           { s: "Random search wins because most parameters barely matter", n: "It spends its budget exploring the ones that do." },
           "Run it in parallel — every combination is independent"] }
},

"Loss Function": {
 ex: { h: "The scoring rule in a competition",
       b: "Choose to award points for distance and everyone throws far. Award them for accuracy and everyone aims. The loss function *is* the definition of good — the model will optimise exactly what you wrote down, including the part you did not mean to write down." },
 fl: { t: "Choosing one for the task",
       s: ["You need a single number saying how wrong a prediction is",
           { q: "Classification or regression?",
             y: "Classification — cross-entropy, which punishes confident errors hardest",
             n: "Regression — MSE for smooth data, MAE when outliers are real" },
           { s: "Weight it if the errors have unequal cost", n: "A missed fraud costs far more than a false alarm." },
           "The model optimises this and nothing else — write it carefully"] }
},

"Cost Function": {
 ex: { h: "The team's total versus one player's score",
       b: "Loss is usually one example's error; cost is the aggregate across the batch or dataset, often with a regularisation term added. In practice people use the words interchangeably, and the only time the distinction matters is when you are reading the maths carefully." },
 fl: { t: "From one wrong answer to a correction",
       s: [{ s: "For a single example, compare what the model said with what was true, and score how wrong it was", n: "One number. Bigger means worse." },
           { s: "Do that for every example in the batch and take the average", n: "One number for the whole batch, so a single odd example cannot dominate." },
           { s: "If you are penalising complexity, add that penalty on top", n: "Now the model is being scored on fitting the data *and* on staying simple, together." },
           { s: "That final number is the thing the whole of training is trying to make smaller", n: "Everything else — the optimiser, the step size, the schedule — exists only to push this number down." },
           { q: "What comes out of it?",
             y: "One number goes in, and a direction to nudge every single adjustable value comes out",
             n: "Which is what makes training possible at all: millions of separate decisions, from one score" }] }
},

"Gradient Descent": {
 ex: { h: "Walking downhill in thick fog",
       b: "You cannot see the valley. You can feel which way the ground slopes under your feet and take a step that way, then feel again. Take steps that are too big and you bounce across the valley; too small and night falls before you arrive. That step size is the learning rate." },
 fl: { t: "One step of learning",
       s: [{ s: "Imagine the model's error as a landscape, and its current settings as your position on it", n: "You want to reach the lowest point, but the whole landscape is hidden in fog." },
           { s: "Measure how wrong the model currently is on a batch of examples", n: "One number: your current altitude." },
           { s: "Work out which way is downhill for every adjustable number in the model", n: "Not by looking around — by calculating, from how the error responds to each one." },
           { s: "Take a small step downhill in all of them at once", n: "How big a step is your choice, and it is the setting that matters most." },
           { q: "Has the error stopped falling?",
             y: "Either stop, or take smaller steps — you may be bouncing over the bottom rather than settling into it",
             n: "Grab the next batch of examples and repeat. Thousands of times" },
           { s: "The landscape is bumpy, not a smooth bowl", n: "You end up in a good low spot, not provably the lowest one. In practice that is fine." }] }
},

"Stochastic Gradient Descent": {
 ex: { h: "Asking five people for directions instead of surveying the town",
       b: "Any one answer is noisy; you still make progress far faster than a complete survey would allow. And the noise turns out to help — it shakes you out of shallow dips you would otherwise settle into. That is the whole argument for mini-batches." },
 fl: { t: "Why deliberately imprecise steps work better",
       s: [{ s: "To take one perfectly-informed step, you would work out the error across every example you have", n: "With ten million examples that is ten million calculations for a single tiny step. Completely impractical." },
           { s: "So instead, grab a small random handful — perhaps 32 or 256 — and use those to decide the direction", n: "The answer is only roughly right, and it is thousands of times cheaper to get." },
           { s: "Take a step based on that rough direction, then grab a different random handful and repeat", n: "Thousands of slightly-wrong steps beat one perfect one you never had time to compute." },
           { q: "Does the imprecision hurt?",
             y: "Surprisingly, it helps. The randomness jolts the model out of mediocre resting places it would otherwise settle into and never leave",
             n: "The random word in the name refers exactly to that: each step is based on a random sample rather than everything" },
           { s: "So the noise is a feature, not a compromise", n: "Very large handfuls give smoother, more accurate steps and often end up generalising slightly worse." }] }
},

"Learning Rate": {
 ex: { h: "The size of the steps down a staircase in the dark",
       b: "Huge strides and you fall past the landing; tiny shuffles and you are still on the stairs at dawn. It is the single most important hyperparameter in deep learning, and the usual answer is not one value but a schedule: bold early, careful later." },
 fl: { t: "Diagnosing it from the loss curve",
       s: ["Plot the loss over training steps",
           { q: "Does it spike, oscillate or go NaN?",
             y: "Too high — reduce it by an order of magnitude",
             n: "Is it falling extremely slowly?" },
           { q: "Almost flat for many epochs?",
             y: "Too low — raise it, or use a warmup then decay",
             n: "It is roughly right; add a decay schedule for the final refinement" },
           "Warmup then cosine decay is the reliable default for transformers"] }
},

"Model": {
 ex: { h: "A tide table, not the sea",
       b: "It predicts the water level usefully well, it is wrong in a storm, and it contains no water. Every model is a compressed, lossy account of something more complicated — which is why *all models are wrong, some are useful* is the most quoted line in statistics." },
 fl: { t: "What a trained model actually is",
       s: ["An architecture defines the shape of the computation",
           { s: "Training fits the parameters to data", n: "The architecture is your choice; the parameters are the data's answer." },
           { q: "What do you ship?",
             y: "The parameters, plus the exact preprocessing that produced them",
             n: "Shipping weights without the feature pipeline guarantees a serving skew" },
           "It encodes the world as it was in the training data, and nothing since"] }
},

"Inference": {
 ex: { h: "The exam, not the revision",
       b: "Training is months of study; inference is answering one question, and it happens millions of times afterwards. That asymmetry is why a model that takes two weeks to train may need to answer in forty milliseconds, and why most engineering effort ends up on the second number." },
 fl: { t: "What happens when a real request arrives",
       s: [{ s: "Training is over. The model's numbers are now frozen and will not change again", n: "This is the difference: training adjusts, inference only reads." },
           { s: "A request arrives with raw data — a photo, a form, a sentence", n: "In whatever shape the outside world happens to send it." },
           { s: "Put it through exactly the same preparation steps used during training", n: "Same resizing, same scaling, same handling of blanks. This is where most production failures come from, and none of them raise an error." },
           { s: "Push it through the model once and read the answer", n: "No learning, no adjusting, no going backwards — which is why this is far cheaper than training." },
           { q: "Did it answer fast enough?",
             y: "Send the answer back",
             n: "Group requests together, shrink the model, cache repeated questions, or use a smaller model for the easy ones" },
           { s: "Record what went in and what came out", n: "Without that record you cannot tell later whether the world changed or your model broke." }] }
},

"Generalisation": {
 ex: { h: "A driving test taken on unfamiliar roads",
       b: "Anyone can drive a route they have practised a hundred times. The test uses roads you have not seen, because that is the only way to find out whether you learned to drive or learned a route. Every held-out set exists for exactly this reason." },
 fl: { t: "Measuring it honestly",
       s: ["The model performs well on training data",
           { q: "Does it perform similarly on data it has never seen?",
             y: "It generalised — the pattern was real",
             n: "It memorised — the pattern was noise specific to the training set" },
           { s: "New data must be genuinely new", n: "Duplicates and leakage make a memoriser look like a generaliser." },
           "Production is the real test set, and it keeps changing"] }
},

"Data Leakage": {
 ex: { h: "A mock exam that accidentally includes the real paper",
       b: "Everyone scores 98% and the school celebrates. Then the actual exam is sat and the results collapse. Leakage is exactly this — information about the answer sneaking into the inputs — and it is the single most common reason a promising model fails in production." },
 fl: { t: "Finding it before production does",
       s: ["Your validation score is suspiciously high",
           { q: "Is any feature only knowable after the outcome?",
             y: "That is target leakage — remove it and retrain",
             n: "Check the preprocessing next" },
           { q: "Were scalers or encoders fitted on the whole dataset?",
             y: "Test statistics leaked into training — fit inside the split",
             n: "Check for duplicate rows spanning the splits" },
           "Suspiciously good results deserve suspicion, not celebration"] }
},

"Class Imbalance": {
 ex: { h: "A smoke detector that never goes off",
       b: "In a building where fires are rare, a detector that stays permanently silent is right 99.9% of the time. Accuracy rewards it handsomely and it is completely useless — which is precisely what happens to a fraud model reporting 99% accuracy on a 1% fraud rate." },
 fl: { t: "Handling a rare positive class",
       s: ["The positive class is 1% of the data",
           { s: "Stop using accuracy immediately", n: "Always predicting *no* already scores 99%." },
           { q: "Which error is more expensive?",
             y: "Missed positives — optimise recall, and use precision-recall curves",
             n: "False alarms — optimise precision and raise the threshold" },
           { s: "Then rebalance if needed", n: "Class weights first; resampling or SMOTE second." },
           "Never resample the validation or test set — they must reflect reality"] }
},

"SMOTE": {
 ex: { h: "Sketching plausible in-between cases",
       b: "You have forty examples of a rare disease. Rather than duplicating them, you draw new points along the lines between existing ones — new, believable cases that were not in the file. It helps the boundary, and it is inventing data, which is the honest caveat." },
 fl: { t: "Using it without inflating your score",
       s: ["The minority class is too small to learn from",
           { s: "Pick a minority point and one of its neighbours", n: "Create a synthetic point on the line between them." },
           { q: "Where in the pipeline does this happen?",
             y: "Inside the cross-validation loop, on training folds only",
             n: "Oversampling before splitting leaks synthetic copies into validation" },
           { s: "Never touch validation or test", n: "They must reflect the real class distribution." },
           "Try class weights first — they are simpler and often just as effective"] }
},

"Confusion Matrix": {
 ex: { h: "A medical test result, broken into four boxes",
       b: "Correctly cleared, correctly caught, missed cases, false alarms. A single accuracy figure collapses all four into one number and hides the only distinction that matters clinically — whether the errors are missed diagnoses or unnecessary scares." },
 fl: { t: "Reading one properly",
       s: ["Lay out predicted against actual",
           { s: "True positives and true negatives are the diagonal", n: "The correct calls." },
           { s: "False positives are false alarms", n: "You said yes and were wrong." },
           { s: "False negatives are misses", n: "You said no and were wrong — usually the expensive one." },
           { q: "Which off-diagonal cell hurts most in your domain?",
             y: "Tune the threshold to shrink that cell, accepting more of the other",
             n: "Every metric — precision, recall, F1 — is derived from these four numbers" }] }
},

"Accuracy": {
 ex: { h: "A weather forecaster in a desert",
       b: "*No rain tomorrow* is correct 360 days a year. Impressive accuracy, zero value, and completely useless on the days anyone cares about. Accuracy only means something when the classes are roughly balanced and the errors cost about the same." },
 fl: { t: "Deciding whether accuracy is the right metric",
       s: ["You have an accuracy figure",
           { q: "What accuracy does the majority-class baseline get?",
             y: "Close to yours — your model has added nothing",
             n: "Meaningfully better; now check the error types" },
           { q: "Do false positives and false negatives cost the same?",
             y: "Accuracy is a reasonable summary",
             n: "Use precision, recall or a cost-weighted metric instead" }] }
},

"Precision": {
 ex: { h: "A spam filter and your job offer",
       b: "Precision asks: of the things I flagged, how many really were spam? Every mistake here means a real email in the junk folder — possibly the one you were waiting for. That is why spam filters are tuned for precision and cancer screening is not." },
 fl: { t: "When to optimise for it",
       s: ["Your model flags items for action",
           { q: "Is acting on a false positive expensive or damaging?",
             y: "Optimise precision — raise the threshold, flag less, be right more",
             n: "Recall may matter more — a missed case may be the costly error" },
           { s: "Precision and recall move in opposite directions", n: "You are choosing where on the curve to sit." },
           "Report both, plus the threshold you chose and why"] }
},

"Recall": {
 ex: { h: "A screening programme for a treatable cancer",
       b: "Recall asks: of everyone who has it, how many did we catch? A miss here is not an inconvenience. Which is why screening accepts a high false-alarm rate and a second test — the costs of the two errors are wildly unequal and the design reflects it." },
 fl: { t: "When to optimise for it",
       s: ["Your model must not miss cases",
           { q: "Is a missed positive far worse than a false alarm?",
             y: "Optimise recall — lower the threshold and accept more false positives",
             n: "Precision is probably the metric you want" },
           { s: "Pair it with a cheap second stage", n: "High-recall filter, then a precise reviewer — screening's own design." },
           "Recall of 1.0 is trivially achievable by flagging everything — report precision too"] }
},

"F1 Score": {
 ex: { h: "A single mark for two exam papers",
       b: "It is the harmonic mean, so it punishes imbalance: 90% and 10% averages to 18%, not 50%. That is deliberate — a model that is brilliant at precision and hopeless at recall should not look adequate. What it hides is which of the two is failing." },
 fl: { t: "Using it responsibly",
       s: ["You need one number for model selection",
           { s: "F1 combines precision and recall harmonically", n: "Both must be decent for the score to be decent." },
           { q: "Do the two error types cost the same?",
             y: "F1 is a fair summary",
             n: "Use F-beta — beta above 1 weights recall, below 1 weights precision" },
           "Always report precision and recall alongside it, or you have hidden the diagnosis"] }
},

"ROC Curve": {
 ex: { h: "Plotting a smoke alarm's sensitivity dial",
       b: "Turn it up and you catch every fire and also every piece of toast. Turn it down and it is peaceful and occasionally fatal. The curve shows the whole trade-off at once, so you can choose the setting rather than accepting whatever the default was." },
 fl: { t: "Reading it",
       s: ["Sweep the classification threshold from 1 to 0",
           { s: "At each point, plot true positive rate against false positive rate", n: "One point per threshold." },
           { q: "Where does the curve sit?",
             y: "Hugging the top-left — good separation between the classes",
             n: "Along the diagonal — no better than a coin flip" },
           { s: "With heavy class imbalance it flatters", n: "A precision-recall curve is more honest there." },
           "Pick the operating point deliberately from the curve"] }
},

"AUC": {
 ex: { h: "The probability of ranking a real case above a false one",
       b: "Pick one positive and one negative at random. AUC is the chance your model scores the positive higher. That interpretation is why it is threshold-free — it measures ranking quality, not any particular decision you might make with it." },
 fl: { t: "What the number means",
       s: ["Compute the area under the ROC curve",
           { q: "What did you get?",
             y: "0.5 is random; 0.7–0.8 is fair; above 0.9 is strong — or leaking",
             n: "Below 0.5 means your labels or signs are inverted" },
           { s: "It is threshold-independent", n: "Good for comparing models, useless for choosing an operating point." },
           "On a 1% positive rate, prefer average precision — AUC looks generous"] }
},

"Precision-Recall Curve": {
 ex: { h: "The honest chart for finding needles",
       b: "When 99% of the data is negative, an ROC curve can look excellent while the model still floods you with false alarms — because the false positive rate has an enormous denominator. The precision-recall curve has no such cushion, which is why it is the right chart for rare events." },
 fl: { t: "Choosing between the two curves",
       s: ["You are evaluating a binary classifier",
           { q: "Is the positive class rare?",
             y: "Precision-recall — it exposes the false alarm problem honestly",
             n: "ROC is fine and is more comparable across datasets" },
           { s: "The baseline is the positive rate", n: "At 1% positives, a random model has 0.01 average precision — not 0.5." },
           "Summarise with average precision, and pick your operating point from the curve"] }
},

"Mean Squared Error": {
 ex: { h: "Penalty points that square with the distance",
       b: "Two metres out costs four; ten metres out costs a hundred. That is deliberate — in many settings a single catastrophic miss is far worse than several small ones. It also means one bad outlier can dominate the whole score, which is sometimes right and sometimes misleading." },
 fl: { t: "Choosing MSE or MAE",
       s: ["You need a regression error metric",
           { q: "Are large errors disproportionately costly?",
             y: "MSE — it heavily penalises the big misses",
             n: "MAE — every error counts in proportion, robust to outliers" },
           { s: "Report RMSE for communication", n: "It is in the same units as the target, so people can interpret it." },
           "Check whether your outliers are real data or measurement errors first"] }
},

"Mean Absolute Error": {
 ex: { h: "Average minutes late, regardless of direction",
       b: "A train five minutes late and one five minutes early both count as five. No squaring, no drama — which makes it the number to quote to non-specialists, because *on average we are twelve minutes out* is immediately understandable." },
 fl: { t: "Reporting an error people can act on",
       s: ["You have per-prediction errors",
           { s: "MAE averages their absolute values", n: "Same units as the target." },
           { q: "Is there one enormous outlier?",
             y: "MAE barely moves; MSE would have exploded",
             n: "Both behave similarly on well-behaved data" },
           "Optimising MAE targets the median; optimising MSE targets the mean"] }
},

"R-Squared": {
 ex: { h: "How much better than guessing the average",
       b: "R² of 0 means you may as well have predicted the mean every time. 0.7 means you explained 70% of the variation. And it never goes down when you add a feature, however useless — which is exactly why adjusted R² exists." },
 fl: { t: "Reading it without being fooled",
       s: ["Compute R² on held-out data",
           { q: "Is it near zero?",
             y: "Your model is not beating the mean — start again",
             n: "Compare against a simple baseline before celebrating" },
           { s: "Adding any feature never lowers training R²", n: "Use adjusted R², or judge on validation instead." },
           "A high R² on training and low on validation is overfitting, plainly stated"] }
},

"Cross-Entropy": {
 ex: { h: "A betting market that punishes confident wrong calls",
       b: "Say 99% and be wrong, and the penalty is enormous. Say 60% and be wrong, and it is mild. That asymmetry is why cross-entropy trains well-calibrated classifiers: it rewards being confident only when you deserve to be." },
 fl: { t: "Why models are trained on this rather than on accuracy",
       s: [{ s: "The model does not output an answer — it outputs a confidence for each possible answer", n: "Perhaps 70% cat, 25% dog, 5% fox." },
           { s: "Look up how much confidence it gave to the answer that turned out to be right", n: "That single number is all this score uses." },
           { s: "High confidence in the right answer costs almost nothing. Low confidence costs a lot. Near-zero confidence costs enormously", n: "Being confidently wrong is punished far harder than being unsure, which is exactly the behaviour you want." },
           { q: "Why not just train on how often it is right?",
             y: "Because being right is a yes-or-no thing. It gives no hint about which direction to adjust — 60% and 90% confidence both count identically as one correct answer",
             n: "This score changes smoothly as the confidence changes, so there is always a clear direction to improve in" },
           { s: "This is also why a well-behaved model never claims total certainty", n: "Claiming 100% and being wrong would cost infinity, so training keeps it away from the extremes." }] }
},

"Baseline Model": {
 ex: { h: "The score to beat before anyone celebrates",
       b: "*Predict the most common class* or *predict yesterday's value* takes ten minutes and is astonishingly hard to beat in some domains. Any project that has not measured it does not know whether its 94% is impressive or embarrassing." },
 fl: { t: "The first thing to build",
       s: ["Before any modelling, build the trivial predictor",
           { q: "Classification or regression?",
             y: "Predict the majority class, or the class distribution",
             n: "Predict the mean, the median, or the last observed value" },
           { s: "Measure it with your real metric on real validation data", n: "This is now the number to beat." },
           { q: "Does your sophisticated model beat it meaningfully?",
             y: "Good — you have evidence the complexity is earning its keep",
             n: "Ship the baseline; it is faster, cheaper and easier to explain" }] }
},

"Linear Regression": {
 ex: { h: "A straight line through a scatter of house prices",
       b: "Each extra square metre adds roughly a fixed amount. It is often not quite true, and it is understandable, fast, and gives you a coefficient you can put in a slide. Which is why it remains the right first model far more often than people expect." },
 fl: { t: "Fitting and sanity-checking",
       s: ["Assume the target is a weighted sum of the features",
           { s: "Fit the coefficients to minimise squared error", n: "Closed-form, or by gradient descent." },
           { q: "Are the residuals patternless?",
             y: "The linear assumption holds well enough",
             n: "There is structure you are not capturing — add terms or change model" },
           { s: "Scale features to compare coefficients", n: "Otherwise their size reflects units, not importance." },
           "Correlation in the coefficients is not causation in the world"] }
},

"Logistic Regression": {
 ex: { h: "A credit decision you have to justify in writing",
       b: "It gives you a probability and a coefficient per factor, so you can say *income raised the odds, three recent applications lowered them*. That explainability is why regulated industries still run on it long after fancier models were available." },
 fl: { t: "From columns of data to a percentage",
       s: [{ s: "Multiply each input column by its own importance number and add everything up", n: "Same first step as drawing a straight line through data." },
           { s: "That total can be any number at all — minus fifty, or three thousand", n: "Which is useless as a probability, so it needs squashing." },
           { s: "Push it through a curve that maps any number into the range 0 to 1", n: "Very negative totals come out near 0, very positive near 1, and zero comes out at exactly 0.5." },
           { s: "Now you have a genuine percentage, not just a yes or no", n: "And unlike many models, this one's percentages are trustworthy enough to act on directly." },
           { q: "Do you need an actual decision rather than a percentage?",
             y: "Pick a cut-off — but choose it from what each kind of mistake costs, not by defaulting to 50%",
             n: "Otherwise use the percentage as it is. \"73% likely to cancel\" supports far better decisions than a bare yes" }] }
},

"Decision Tree": {
 ex: { h: "A triage flowchart pinned to a wall",
       b: "Temperature above 38? Then cough? Then duration? Anyone can follow it and anyone can audit it. Left unpruned it will also memorise every patient it ever saw, producing a perfect record on history and hopeless advice on the next arrival." },
 fl: { t: "How a tree is grown and why it must be pruned",
       s: ["Consider every feature and every split point",
           { s: "Pick the split that best separates the classes", n: "Gini impurity or information gain." },
           { s: "Repeat recursively on each side", n: "The tree grows deeper." },
           { q: "Left unconstrained, where does it stop?",
             y: "When every leaf is pure — a perfect memorisation of the training set",
             n: "Limit depth, minimum samples per leaf, or prune afterwards" },
           "A single tree is high variance — which is why forests exist"] }
},

"Random Forest": {
 ex: { h: "Asking a hundred slightly different doctors",
       b: "Each has seen a different subset of patients and considers a different subset of symptoms. Individually, several are wrong. Averaged, their errors cancel where they disagree and reinforce where they agree — which is the entire mechanism, and it is remarkably robust." },
 fl: { t: "Where the diversity comes from",
       s: ["Draw a bootstrap sample of the rows for each tree",
           { s: "At every split, consider only a random subset of features", n: "This is what stops all the trees looking the same." },
           { s: "Grow each tree deep, without pruning", n: "Individually overfitted, and that is fine." },
           { q: "How is a prediction made?",
             y: "Majority vote, or averaged probabilities across all trees",
             n: "Variance falls sharply; bias stays roughly where a single tree was" },
           "Very hard to make it perform badly — which is why it is a great baseline"] }
},

"Gradient Boosting": {
 ex: { h: "A proofreader who only reads the corrections",
       b: "The first pass catches the obvious errors. The second reader looks only at what the first missed, and the third at what the second missed. Each is weak alone; in sequence they produce something very hard to beat — and one bad reader early on propagates through everything after." },
 fl: { t: "Building the sequence",
       s: ["Start with a trivial prediction — usually the mean",
           { s: "Compute the residuals", n: "What the current ensemble is still getting wrong." },
           { s: "Fit a small tree to predict those residuals", n: "A weak learner, deliberately shallow." },
           { s: "Add it to the ensemble, scaled by the learning rate", n: "Small steps generalise better." },
           { q: "Is validation error still falling?",
             y: "Add another tree",
             n: "Stop — this is where early stopping earns its place" }] }
},

"XGBoost": {
 ex: { h: "The default answer for tabular competitions",
       b: "For a decade, if the data was rows and columns, the winning solution was gradient boosting and usually this implementation. Regularisation built into the objective, clever handling of missing values, and engineering that made it fast — a combination that is still hard to beat outside deep learning's home turf." },
 fl: { t: "Getting a strong result quickly",
       s: ["Start with sensible defaults and early stopping on a validation set",
           { s: "Set a low learning rate and many trees", n: "0.05 with early stopping beats 0.3 with a fixed count." },
           { q: "Overfitting?",
             y: "Increase `min_child_weight`, lower `max_depth`, add subsampling",
             n: "Tune `max_depth` and `colsample_bytree` next" },
           { s: "It handles missing values natively", n: "Learning which way to send them at each split." },
           "Feature engineering still moves the needle more than tuning does"] }
},

"LightGBM": {
 ex: { h: "Growing the branch that needs it most",
       b: "Rather than expanding a tree evenly level by level, it always splits wherever the biggest gain is available. Faster and more accurate on large data — and more prone to growing a deep, narrow, overfitted branch on a small dataset, which is exactly its trade-off." },
 fl: { t: "Choosing it over XGBoost",
       s: ["You have a large tabular dataset",
           { q: "How many rows?",
             y: "Hundreds of thousands or more — LightGBM is usually noticeably faster",
             n: "Small data — leaf-wise growth overfits easily; constrain `num_leaves`" },
           { s: "It handles categorical features natively", n: "No one-hot explosion needed." },
           "Control complexity with `num_leaves`, not `max_depth`"] }
},

"CatBoost": {
 ex: { h: "Built for columns full of names, not numbers",
       b: "Postcode, product code, merchant — thousands of distinct values each. One-hot encoding explodes and naive target encoding leaks. CatBoost's ordered encoding was designed precisely for this, which is why it often wins on datasets that are mostly categorical." },
 fl: { t: "When it is the right pick",
       s: ["Your data is dominated by high-cardinality categoricals",
           { q: "Would one-hot encoding produce thousands of columns?",
             y: "CatBoost handles them natively with ordered target statistics",
             n: "Any of the three boosters will do fine" },
           { s: "Ordered boosting avoids the target leakage naive encoding causes", n: "Which is the real innovation here." },
           "Defaults are unusually good — start there before tuning"] }
},

"Support Vector Machine": {
 ex: { h: "Drawing a border with the widest possible no-man's-land",
       b: "Many lines separate the two villages. The best one is as far as possible from the nearest house on either side, because that leaves the most room for error. Only the closest houses matter to where the border goes — everyone else could move and the line would not shift." },
 fl: { t: "Margin, support vectors and the kernel trick",
       s: ["Find the boundary that maximises the margin",
           { s: "Only the closest points influence it", n: "Those are the support vectors; the rest are irrelevant." },
           { q: "Are the classes linearly separable?",
             y: "A straight boundary works",
             n: "A kernel maps to a higher-dimensional space where they are" },
           { s: "Scale your features first", n: "Distances drive everything here." },
           "Excellent on small, high-dimensional data; poor at large scale"] }
},

"K-Nearest Neighbours": {
 ex: { h: "Judging a house price by the five nearest sales",
       b: "No model is fitted at all — the data is the model. Which makes it trivially simple to explain and expensive at prediction time, because every query means searching the whole dataset. It is also completely at the mercy of feature scaling." },
 fl: { t: "Making a prediction",
       s: ["Scale every feature — this is not optional",
           { s: "Compute the distance from the query to every training point", n: "Which is why prediction is slow, not training." },
           { s: "Take the k nearest and vote or average", n: "Small k is noisy; large k over-smooths." },
           { q: "How many features?",
             y: "Many — distances become meaningless. The curse of dimensionality bites hard",
             n: "Few — it works well and needs almost no tuning" }] }
},

"Naive Bayes": {
 ex: { h: "A spam filter that assumes words are independent",
       b: "It treats *free* and *money* as unrelated evidence, which is obviously false — and it works anyway, remarkably well, on text. That gap between a wrong assumption and a right answer is one of the more instructive results in the field." },
 fl: { t: "Why a false assumption still works",
       s: ["Estimate how often each word appears in each class",
           { s: "Multiply the per-word probabilities together", n: "This is the naive independence assumption." },
           { q: "Are the probabilities accurate?",
             y: "No — badly calibrated, often near 0 or 1",
             n: "But the *ranking* is usually right, and ranking is what classification needs" },
           { s: "Use Laplace smoothing", n: "Or a single unseen word zeroes the whole product." },
           "Extremely fast, needs little data — a fine baseline for text"] }
},

"K-Means Clustering": {
 ex: { h: "Placing k delivery depots to minimise driving",
       b: "Guess k locations, assign every address to its nearest, move each depot to the middle of what it was assigned, repeat. It converges quickly and where it converges depends on where you started — which is why you run it several times." },
 fl: { t: "The iteration, and its assumptions",
       s: ["Choose k and initialise the centroids",
           { s: "Assign each point to the nearest centroid", n: "Straight-line distance, so scaling matters enormously." },
           { s: "Move each centroid to the mean of its assigned points", n: "Repeat until nothing moves." },
           { q: "Are the true groups round and similarly sized?",
             y: "K-means will find them well",
             n: "Elongated or nested shapes defeat it — use DBSCAN instead" },
           "Choose k with the elbow method or silhouette score, and run multiple seeds"] }
},

"DBSCAN": {
 ex: { h: "Finding towns on a map by looking at building density",
       b: "Where houses are close together, that is a settlement. A lone farmhouse is not a tiny village — it is noise. That is the key difference from k-means: DBSCAN is allowed to say some points belong to nothing at all." },
 fl: { t: "How clusters form from density",
       s: ["Pick a radius and a minimum neighbour count",
           { q: "Does a point have enough neighbours within the radius?",
             y: "It is a core point — it starts or extends a cluster",
             n: "It is a border point or noise" },
           { s: "Clusters grow by chaining core points together", n: "Which is how it finds long, irregular shapes." },
           { s: "You never specify how many clusters", n: "The data decides — but the radius is very sensitive." },
           "It struggles when clusters have very different densities"] }
},

"Hierarchical Clustering": {
 ex: { h: "A family tree built from similarity",
       b: "Start with everyone separate, repeatedly join the two closest, and you end up with a tree you can cut at any height — two groups, or twenty, decided after you have seen the structure rather than before. The picture itself is often the deliverable." },
 fl: { t: "Building and reading a dendrogram",
       s: ["Start with every point as its own cluster",
           { s: "Merge the two closest clusters", n: "Closeness depends on the linkage rule you chose." },
           { s: "Repeat until one cluster remains", n: "Recording every merge and its height." },
           { q: "How many clusters do you want?",
             y: "Cut the tree at a height — you can decide afterwards, not in advance",
             n: "Long vertical gaps suggest natural cut points" },
           "It is O(n²) or worse — impractical beyond tens of thousands of points"] }
},

"Principal Component Analysis": {
 ex: { h: "Photographing a chair from its most informative angle",
       b: "One angle shows the shape clearly; another shows an ambiguous silhouette. PCA finds the directions along which the data varies most and keeps those, discarding the angles that carried little information. What it costs you is the ability to name the axes." },
 fl: { t: "Squashing many columns into a few",
       s: [{ s: "You have 500 columns, and most of them are telling you roughly the same thing", n: "Height in centimetres and height in inches are two columns carrying one fact." },
           { s: "First put every column on the same scale", n: "Otherwise a column measured in rupees dominates one measured in years, purely because its numbers are bigger." },
           { s: "Now find the direction in which the data is most spread out, then the next, and so on", n: "Each new direction is chosen to be unrelated to the ones before it, so nothing is counted twice." },
           { s: "Keep the first handful of directions and throw the rest away", n: "Usually enough to retain about 95% of the variation — the tool tells you how much each one is worth." },
           { q: "Can you still explain what the new columns mean?",
             y: "Not really — each one is a blend of the originals, so you can no longer say \"income mattered most\"",
             n: "That is the trade: far fewer columns, no duplication, and no human-readable meaning left" }] }
},

"t-SNE": {
 ex: { h: "A seating plan that keeps friends together",
       b: "It cares intensely about who sits next to whom and not at all about whether the two ends of the room mean anything. Which is why you may read the clusters in a t-SNE plot and must not read the distances between them, or the empty space." },
 fl: { t: "Reading a t-SNE plot without over-reading it",
       s: ["High-dimensional points are projected to 2D",
           { s: "Local neighbourhoods are preserved", n: "Points close in the original space stay close." },
           { q: "Are the gaps between clusters meaningful?",
             y: "No — global distances are not preserved and cluster sizes mean nothing",
             n: "Correct. Read membership, never geometry" },
           { s: "Perplexity changes the picture substantially", n: "Try several values before drawing conclusions." },
           "Visualisation only — never feed t-SNE output into a model"] }
},

"UMAP": {
 ex: { h: "The same seating plan, drawn faster and with the room layout kept",
       b: "It preserves more of the global structure than t-SNE and runs far faster on large datasets, which is why it largely displaced it for exploration. It can still exaggerate separation, so the same caution about over-reading a picture applies." },
 fl: { t: "Choosing UMAP over t-SNE",
       s: ["You need to visualise high-dimensional data",
           { q: "How many points?",
             y: "Hundreds of thousands — UMAP scales; t-SNE does not",
             n: "Either works; UMAP preserves more global structure" },
           { s: "`n_neighbors` trades local against global detail", n: "Low values emphasise fine structure." },
           { s: "It can transform new points", n: "Unlike t-SNE, which must be refitted." },
           "Still a picture, not a feature space to model on"] }
},

"Ensemble Learning": {
 ex: { h: "A jury rather than a single judge",
       b: "Twelve people who err in different directions reach a better verdict than any one of them, provided they are not all making the same mistake. That proviso is the whole science: ensembles work only to the extent that the members are genuinely diverse." },
 fl: { t: "Why combining helps",
       s: ["Train several models that make different errors",
           { q: "Are their mistakes correlated?",
             y: "Averaging gains you almost nothing — they are all wrong together",
             n: "Errors partially cancel; the ensemble beats every member" },
           { s: "Diversity comes from data, features, algorithms or seeds", n: "The more independent the sources, the better." },
           "You pay in latency, memory and interpretability — decide if that is worth it"] }
},

"Bagging": {
 ex: { h: "Polling several small samples instead of one",
       b: "Each sample gives a slightly different answer, and averaging them lands closer to the truth than any single sample. The models are trained in parallel and never see each other — which is exactly what makes it a variance-reduction method." },
 fl: { t: "Bootstrap aggregating",
       s: ["Draw a bootstrap sample of the training data",
           { s: "Sample with replacement, so each model sees a different subset", n: "About a third is left out each time." },
           { s: "Train a model on each sample, independently and in parallel", n: "They never interact." },
           { s: "Average or vote across them", n: "Variance drops sharply; bias is unchanged." },
           { q: "Need a free validation estimate?",
             y: "Use the out-of-bag samples each model never saw",
             n: "Random forest is bagging plus random feature selection" }] }
},

"Boosting": {
 ex: { h: "A relay where each runner starts where the last one struggled",
       b: "Sequential by construction: every model is trained specifically on what the ensemble so far is getting wrong. That is why it reduces bias rather than variance, why it cannot be parallelised the way bagging can, and why it overfits if you let it run too long." },
 fl: { t: "Boosting versus bagging",
       s: ["You want an ensemble",
           { q: "Are your base models overfitting individually?",
             y: "Bagging — train them in parallel and average away the variance",
             n: "Underfitting? Boosting — train sequentially on the residual errors" },
           { s: "Boosting is sequential and cannot be parallelised across rounds", n: "Slower to train, usually more accurate." },
           "It will overfit given enough rounds — early stopping is mandatory"] }
},

"Stacking": {
 ex: { h: "A manager who learns which specialist to trust when",
       b: "Rather than averaging the team's opinions equally, someone learns that the statistician is reliable on volume and the domain expert on unusual cases. The meta-model learns those weights from data — and it must learn them from predictions the base models did not train on." },
 fl: { t: "Building a stack without leaking",
       s: ["Train several diverse base models",
           { s: "Generate out-of-fold predictions for the training set", n: "Each prediction comes from a model that never saw that row." },
           { q: "Did you use in-sample predictions instead?",
             y: "Leakage — the meta-model learns to trust overfitted confidence",
             n: "Train the meta-model on those out-of-fold predictions" },
           { s: "Keep the meta-model simple", n: "Logistic regression is usually enough." },
           "Gains are real but small; the complexity cost is not"] }
},

"Curse of Dimensionality": {
 ex: { h: "A needle in a haystack that keeps getting bigger",
       b: "In one dimension, ten points cover a line reasonably. To cover a ten-dimensional space at the same density you would need ten billion. Everything becomes far apart from everything else, and *nearest* neighbour stops carrying any meaning." },
 fl: { t: "What breaks as dimensions grow",
       s: ["Add features to a fixed-size dataset",
           { s: "The space grows exponentially; the data does not", n: "Coverage collapses." },
           { q: "Which methods suffer most?",
             y: "Anything distance-based — KNN, K-means, SVM with RBF kernels",
             n: "Trees cope better; they only ever look one feature at a time" },
           { s: "Fix it with feature selection, PCA or embeddings", n: "Or with far more data, if you can get it." },
           "More features is not more information — it is often less"] }
},

"No Free Lunch Theorem": {
 ex: { h: "No single tool wins every job",
       b: "Averaged over every conceivable problem, all algorithms perform identically. That sounds nihilistic and is actually liberating: it means real progress comes from assumptions that match your actual domain, not from finding a universally superior model." },
 fl: { t: "What it means in practice",
       s: ["Someone claims one algorithm is universally best",
           { q: "Best over which set of problems?",
             y: "Over all possible problems, no — the theorem forbids it",
             n: "Over real-world problems with structure, some algorithms genuinely dominate" },
           { s: "The win comes from matching inductive bias to the domain", n: "Convolutions for images, trees for tabular data." },
           "Which is why you always try several and measure"] }
},

"Inductive Bias": {
 ex: { h: "The assumptions a detective brings to a case",
       b: "One assumes the simplest explanation; another assumes people act in self-interest. Neither is provable, both are necessary — you cannot reason from evidence with no assumptions at all. Every model has these built in, whether or not anyone stated them." },
 fl: { t: "Matching bias to data",
       s: ["You choose a model family",
           { s: "Each carries assumptions about what patterns look like", n: "Linear: additive. CNN: local and translation-invariant. Trees: axis-aligned splits." },
           { q: "Does the assumption match your data?",
             y: "You need far less data to learn the pattern",
             n: "The model fights the data and needs much more of it" },
           "Transformers have weak inductive bias, which is why they need enormous data"] }
},

"Interpretability": {
 ex: { h: "A loan refusal you have to explain in a letter",
       b: "*The model said no* is not an answer a regulator or a customer accepts. Sometimes it is a legal requirement, sometimes it is how you find out the model learned something absurd — and it is nearly always the thing that decides whether people trust the system." },
 fl: { t: "Choosing how much you need",
       s: ["A model is going into a decision that affects people",
           { q: "Must individual decisions be explainable?",
             y: "Prefer an inherently interpretable model — linear, or a shallow tree",
             n: "A complex model plus SHAP may be sufficient" },
           { s: "Post-hoc explanations approximate", n: "They describe the model's behaviour, not necessarily its reasoning." },
           "Global interpretability and per-decision explanation are different requirements"] }
},

"SHAP": {
 ex: { h: "Splitting a restaurant bill by what each person ordered",
       b: "Everyone contributed something to the total, and the fair share depends on what the bill would have been without them — averaged over every order in which people could have arrived. That is the Shapley value, borrowed from game theory and applied to features." },
 fl: { t: "Attributing one prediction",
       s: ["Start from the model's average prediction — the base value",
           { s: "Each feature pushes the prediction up or down from there", n: "SHAP values sum exactly to the difference." },
           { q: "What can you do with it?",
             y: "Explain one decision, or aggregate across many for global importance",
             n: "It is exact for trees and approximate elsewhere; it can be slow" },
           "It shows how the model behaves — not what causes what in the world"] }
},

"Feature Importance": {
 ex: { h: "Which ingredient the dish depends on",
       b: "Remove the stock and the soup collapses; remove the parsley and nobody notices. That is permutation importance in one sentence. What it will not tell you is whether the stock *causes* the flavour or merely correlates with the good cook who used it." },
 fl: { t: "Getting a trustworthy ranking",
       s: ["You want to know which features matter",
           { q: "Using built-in tree importance?",
             y: "Careful — it is biased toward high-cardinality features",
             n: "Permutation importance on held-out data is more trustworthy" },
           { s: "Shuffle one feature and measure the performance drop", n: "The bigger the drop, the more the model relied on it." },
           { q: "Are two features highly correlated?",
             y: "Both look unimportant — either can substitute for the other",
             n: "Importance is about the model, never about causation" }] }
},

"Active Learning": {
 ex: { h: "A student who asks about the questions they find hardest",
       b: "Rather than working through the textbook front to back, they seek out the problems at the edge of their understanding. Labelling the examples a model is least sure about gets you the same accuracy from a fraction of the labelling budget." },
 fl: { t: "Spending a labelling budget well",
       s: ["Train an initial model on a small labelled set",
           { s: "Score the unlabelled pool by uncertainty", n: "Points near the decision boundary teach the most." },
           { s: "Send the most uncertain ones for human labelling", n: "A batch at a time." },
           { q: "Has performance plateaued?",
             y: "Stop — further labelling is not buying you accuracy",
             n: "Retrain and select the next batch" },
           "Watch for sampling bias — the labelled set stops resembling reality"] }
},

"Online Learning": {
 ex: { h: "A shop assistant who adjusts as the day goes on",
       b: "They notice by eleven that everyone is buying umbrellas and change what they push. No overnight retraining. The risk is symmetrical: one strange hour, or a deliberate attempt to mislead, and the model has learned it before anyone reviewed anything." },
 fl: { t: "Updating a model in flight",
       s: ["A new example arrives with its label",
           { s: "Update the parameters immediately", n: "One example or a small batch, no full retrain." },
           { q: "Could the incoming data be poisoned or anomalous?",
             y: "You need validation gates and the ability to roll back the weights",
             n: "Adaptation is fast and memory use stays constant" },
           "Always keep a stable held-out set to detect silent degradation"] }
},

"AutoML": {
 ex: { h: "A shortlist produced by an agency",
       b: "It saves you from screening two hundred candidates and it will not tell you the role was mis-specified. AutoML searches models and hyperparameters competently; it does not question whether your target variable, your split, or your metric make any sense." },
 fl: { t: "Where it helps and where it cannot",
       s: ["You have a clean tabular dataset and a defined target",
           { s: "AutoML searches preprocessing, models and hyperparameters", n: "Often reaching a strong baseline in an hour." },
           { q: "Is the problem framing correct?",
             y: "You still had to decide that — and it is the part that goes wrong",
             n: "AutoML will optimise the wrong objective very efficiently" },
           { s: "Beware leakage", n: "It will happily exploit a leaked feature and report a wonderful score." },
           "Use it as a strong baseline, not as the end of the project"] }
},

"Recommendation System": {
 ex: { h: "A bookshop owner who remembers what you bought",
       b: "*People who liked this also liked that* is collaborative filtering in one sentence. The hard parts are the ones the shop owner also faces: what to suggest to a first-time visitor, and how to avoid recommending only the bestsellers to everyone." },
 fl: { t: "Serving a recommendation",
       s: ["Retrieve a few hundred candidates quickly",
           { s: "Collaborative signals, content similarity, popularity, recency", n: "Cheap and generous." },
           { s: "Rank them with a heavier model", n: "Using user context, time of day, and session history." },
           { q: "Is this a new user or a new item?",
             y: "Cold start — fall back to popularity and content features",
             n: "Apply business rules and diversity before displaying" },
           "Optimise for long-term engagement, or you build a filter bubble"] }
},

"Collaborative Filtering": {
 ex: { h: "Taste-matching with strangers",
       b: "The system knows nothing about the film itself — not the genre, the director or the year. It knows that people who rated the things you rated highly also rated this one highly. That is enough, and it is why it recommends things no content-based system would have connected." },
 fl: { t: "From a sparse rating matrix to a suggestion",
       s: ["Build a user–item matrix, mostly empty",
           { s: "Factorise it into user and item vectors", n: "Latent factors nobody named — they emerge from the ratings." },
           { s: "A predicted rating is the dot product of the two vectors", n: "Rank the unseen items by it." },
           { q: "New user with no history?",
             y: "Cold start — you need content features or popularity to bridge the gap",
             n: "Popularity bias creeps in; add diversity deliberately" }] }
},

"Time Series Forecasting": {
 ex: { h: "Predicting tomorrow's footfall in a shop",
       b: "Yesterday matters, last Saturday matters more, and last December matters most of all. Order is everything — which is why shuffling the data destroys the problem, and why random cross-validation on a time series is one of the most common leakage mistakes there is." },
 fl: { t: "Validating a forecaster correctly",
       s: ["Never shuffle — the order carries the signal",
           { s: "Split by time: train on the past, test on the future", n: "Exactly as you will use it." },
           { s: "Use forward-chaining cross-validation", n: "Expand the training window forward, evaluate on the next block." },
           { q: "Does it beat the naive baseline?",
             y: "Genuine skill — the baseline of *tomorrow equals today* is hard to beat",
             n: "Ship the baseline" },
           "Watch for trend, seasonality and regime changes — they break stationarity"] }
},

"Model Capacity": {
 ex: { h: "The size of the sketchpad",
       b: "A postcard cannot hold a detailed map; a wall-sized sheet can, and can also hold a lot of pointless doodling. Capacity is the range of functions a model can express — too little and it cannot represent the truth, too much and it will happily represent the noise." },
 fl: { t: "Working out whether your model is too simple or too complex",
       s: [{ s: "Capacity is how complicated a pattern a model is able to represent", n: "A straight line has very little. A deep network has an enormous amount." },
           { s: "Too little and it cannot capture the real pattern, however much data you give it", n: "Trying to fit a curve with a straight line. It will be wrong everywhere, in a consistent way." },
           { s: "Too much and it memorises your specific examples instead of learning the pattern", n: "Including the coincidences and the noise, which will not repeat on new data." },
           { q: "Which do you have? Compare its score on data it trained on against data it has not seen",
             y: "Bad on both means not enough capacity — give it more: more layers, more features, more flexibility",
             n: "Good on data it has seen but bad on data it has not means too much capacity for the amount of data you have" },
           { s: "For too much, either shrink the model or hold it back deliberately", n: "Holding it back — penalising complexity, stopping early, dropping units at random — is just capacity control by another route." },
           { s: "More data raises how much capacity you can safely use", n: "Which is why very large models became possible only once very large datasets did." }] }
},

"Calibration": {
 ex: { h: "A forecaster who says 70% and is right 70% of the time",
       b: "That is calibration, and it is different from accuracy. A model can rank cases perfectly and still say 95% when it means 60% — which matters enormously the moment a human or a threshold uses the number as a probability rather than a score." },
 fl: { t: "Checking and fixing it",
       s: ["Bucket predictions by confidence",
           { q: "In the 70% bucket, are 70% actually positive?",
             y: "Calibrated — the probabilities can be used as probabilities",
             n: "Miscalibrated — usually overconfident" },
           { s: "Plot a reliability diagram", n: "The diagonal is perfect calibration." },
           { s: "Fix with Platt scaling or isotonic regression", n: "Fitted on a held-out set, not on training data." },
           "Neural networks and boosted trees are routinely overconfident"] }
},

"Evaluation Metric": {
 ex: { h: "Choosing what the scoreboard shows",
       b: "Measure a hospital on average waiting time and it will optimise waiting time, including by discharging people early. The metric becomes the goal the moment anyone is judged by it, so choosing it is a decision about behaviour, not just measurement." },
 fl: { t: "Choosing one you will not regret",
       s: ["Write down what actually matters to the business",
           { q: "Do the two error types cost the same?",
             y: "A symmetric metric is fine — accuracy, F1, MSE",
             n: "Weight it, or optimise the one that matters — precision or recall" },
           { s: "Check the baseline first", n: "A metric that a trivial model already scores well on tells you nothing." },
           { q: "Could it be gamed?",
             y: "It will be. Add a guardrail metric alongside it",
             n: "Fix it before you start, and report it consistently" }] }
}

});
