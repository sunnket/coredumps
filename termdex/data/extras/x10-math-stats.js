/* Real-world examples and step-by-step flows — Maths & Statistics. */
TD.attach("math-stats", {

"Linear Algebra": {
 ex: { h: "Why your laptop can do this at all",
       b: "A neural network layer is one matrix multiply. Expressed as loops it is millions of separate operations; expressed as a matrix it is a single call into hardware built for exactly that shape. Linear algebra is not the theory behind machine learning so much as its file format." },
 fl: { t: "Where it shows up in practice",
       s: ["Data becomes a matrix: rows are examples, columns are features",
           { s: "A model's parameters are also matrices", n: "Which is why a *model* is a folder of numeric arrays." },
           { q: "Does an operation apply the same rule to every row?",
             y: "Express it as a matrix operation — vectorised, and orders of magnitude faster",
             n: "You are probably writing a Python loop you will later regret" },
           { s: "Shape errors are the most common bug in the field", n: "Print shapes before debugging logic." },
           "You need the mechanics far more than the proofs — dimensions, dot products and transposes"] }
},

"Vector": {
 ex: { h: "A customer as an arrow in 40-dimensional space",
       b: "Age, spend, tenure, visits — put them in a list and the customer is a point. Suddenly *similar customers* means *nearby points*, and a question that was vague becomes a distance calculation. Every embedding in machine learning is this trick applied to something less numeric." },
 fl: { t: "From records to geometry",
       s: ["Represent each entity as an ordered list of numbers",
           { s: "The order is fixed and meaningful", n: "Position three is always tenure, for every record." },
           { q: "Are the features on wildly different scales?",
             y: "Standardise — otherwise income dominates every distance you compute",
             n: "Distances and dot products are now meaningful" },
           { s: "Similar entities end up close together", n: "Which is what makes nearest-neighbour search useful." },
           "Direction often matters more than magnitude — cosine similarity ignores length deliberately"] }
},

"Matrix": {
 ex: { h: "One object, two readings",
       b: "A matrix is either a table of data — 10,000 customers by 40 features — or a transformation that rotates and stretches space. Machine learning uses both meanings in the same equation, which is precisely why the subject feels slippery at first and obvious later." },
 fl: { t: "Keeping the shapes straight",
       s: ["Write down the shape of every array",
           { s: "`(n_samples, n_features)` is the near-universal convention", n: "Getting this backwards is the classic first bug." },
           { q: "Multiplying A by B?",
             y: "A's columns must equal B's rows — `(m,n) × (n,p)` gives `(m,p)`",
             n: "Transpose one of them, and check you meant to" },
           { s: "Broadcasting silently stretches dimensions of size 1", n: "Convenient, and a frequent source of silently wrong results." },
           "Print shapes at every step — it resolves more bugs than reading the maths again"] }
},

"Matrix Multiplication": {
 ex: { h: "The operation your GPU exists for",
       b: "Every fully connected layer, every attention head, every embedding lookup ends in a matmul. Hardware is designed around it — tensor cores do nothing else — which is why *make it a matrix multiply* is a legitimate optimisation strategy in numerical code." },
 fl: { t: "What one multiply does",
       s: ["Take a row from the left matrix and a column from the right",
           { s: "Their dot product is one output cell", n: "Repeat for every row-column pair." },
           { q: "Do the inner dimensions match?",
             y: "The result is `(rows of A) × (columns of B)`",
             n: "Shape error — and it is never the maths, it is the transpose" },
           { s: "It is not commutative", n: "`AB` and `BA` are different, and often only one is even defined." },
           "Cost grows roughly as n³ — which is why model size and compute rise together so steeply"] }
},

"Dot Product": {
 ex: { h: "How much do these two things agree?",
       b: "It is one multiply-and-sum, and it answers *how aligned are these vectors*. Recommendation scores, attention weights and similarity search are all dot products underneath — which is why a search over a million documents can be one large matrix multiply." },
 fl: { t: "What the resulting number tells you",
       s: [{ s: "Take two lists of numbers of the same length", n: "They might be two documents turned into numbers, or two directions in space." },
           { s: "Multiply the first number of one by the first of the other, the second by the second, and so on", n: "Then add all of those results together. One number comes out." },
           { q: "Is that number large and positive?",
             y: "The two lists point in a similar direction — they agree, and are probably both large",
             n: "Near zero means they are unrelated. Negative means they point in opposite directions" },
           { s: "But there is a catch: the size of the numbers inflates the result", n: "A long document scores highly against absolutely everything, purely for being long." },
           { s: "So shrink both lists to a standard length first, then take the dot product", n: "Now you are comparing direction only, ignoring size — which is what you almost always actually wanted." }] }
},

"Norm": {
 ex: { h: "How big is this vector?",
       b: "L2 is the ordinary straight-line length; L1 is the sum of absolute values. The choice is not cosmetic — used as a regularisation penalty, L2 shrinks all weights smoothly while L1 drives many of them to exactly zero, which is the difference between a smaller model and a sparser one." },
 fl: { t: "Choosing how to measure size",
       s: [{ s: "A norm is a way of turning a list of numbers into one number saying how big it is", n: "There is more than one sensible way to do that, and the choice changes what your model does." },
           { s: "The everyday one is straight-line distance: square everything, add, take the square root", n: "The distance you would measure with a ruler. Smooth, and the default nearly everywhere." },
           { s: "The other common one just adds up the sizes, ignoring signs", n: "Like walking city blocks rather than flying — you cannot cut the corner." },
           { q: "Which should you use to penalise a model's complexity?",
             y: "The block-walking one pushes unhelpful values to exactly zero, which effectively deletes those inputs and tells you which ones mattered",
             n: "The straight-line one shrinks everything towards zero without ever quite removing anything, which is gentler and usually the safer default" },
           { s: "There is a third that ignores everything except the single largest value", n: "Used when only the worst case matters — the biggest error, not the average one." }] }
},

"Eigenvalue": {
 ex: { h: "The directions a transformation leaves alone",
       b: "Stretch a rubber sheet and most arrows drawn on it swing round; a few only get longer or shorter. Those are eigenvectors, and their stretch factors are eigenvalues. PCA is exactly this on a covariance matrix — the eigenvector with the biggest eigenvalue is the direction the data varies most." },
 fl: { t: "What they are, and why PCA needs them",
       s: [{ s: "Picture your data as a cloud of dots. The cloud is usually stretched further in some directions than others", n: "Height and weight together form a long thin cloud, because tall people tend to be heavier." },
           { s: "An eigenvector is one of those directions of stretch. Its eigenvalue is how far the cloud stretches along it", n: "A big eigenvalue means the data varies a lot in that direction, so that direction carries a lot of information." },
           { s: "First, put every feature on the same scale", n: "Otherwise a column measured in rupees automatically looks more important than one measured in years, purely because the numbers are bigger." },
           { s: "Then work out how each pair of features moves together, and find the stretch directions from that", n: "Libraries do this in one line — the useful part is knowing what comes out." },
           { q: "Do two or three directions account for most of the stretch?",
             y: "Then keep only those. You have thrown away most of the columns and kept nearly all of the information",
             n: "Then the data genuinely varies in many directions at once, and squashing it down will lose something real" }] }
},

"Singular Value Decomposition": {
 ex: { h: "The general-purpose tool behind half the toolbox",
       b: "SVD factors any matrix — square or not — into rotate, stretch, rotate. Keep only the largest singular values and you get the best possible low-rank approximation, which is simultaneously image compression, latent semantic analysis, and collaborative-filtering recommendations." },
 fl: { t: "Compressing with a truncated SVD",
       s: ["Factor the matrix into U, Σ and Vᵀ",
           { s: "Σ holds the singular values in decreasing order", n: "Each one is how much that component contributes." },
           { q: "Do the first k values hold most of the total?",
             y: "Keep k components — provably the best rank-k approximation there is",
             n: "The matrix has no low-rank structure to exploit" },
           { s: "Reconstruct from the truncated factors", n: "A ratings matrix becomes a latent-factor recommender." },
           "It is numerically stable on matrices where eigendecomposition struggles — prefer it"] }
},

"Derivative": {
 ex: { h: "The slope you are standing on",
       b: "Training a model is walking downhill on an error surface you cannot see. The derivative tells you which way is down and how steep it is, at your current point only — which is why learning proceeds in small steps, and why too large a step overshoots the valley entirely." },
 fl: { t: "Why training needs it",
       s: ["The loss function measures how wrong the model is",
           { s: "Its derivative with respect to a weight says how the loss moves if that weight moves", n: "Positive slope means increasing the weight makes things worse." },
           { q: "Is the derivative near zero?",
             y: "You are at a flat point — a minimum, a maximum, or a plateau",
             n: "Step opposite the slope, scaled by the learning rate" },
           { s: "A vanishing derivative stalls learning", n: "Which is exactly the vanishing gradient problem in deep networks." },
           "Non-differentiable points — like ReLU at zero — are handled by convention, not by theory"] }
},

"Partial Derivative": {
 ex: { h: "One dial at a time",
       b: "A model has millions of parameters and the loss depends on all of them at once. A partial derivative asks a tractable question: holding everything else fixed, how does the loss respond to this one weight? Assemble all of them and you have the gradient." },
 fl: { t: "Working out the effect of one thing at a time",
       s: [{ s: "An ordinary derivative answers: if I nudge this input, how much does the output move?", n: "Steepness, in one dimension." },
           { s: "But a model has millions of inputs you can nudge, not one", n: "So you ask the question about each of them separately." },
           { s: "Pick one number. Pretend every other number in the model is frozen. Now ask how much nudging this one changes the error", n: "That is the partial derivative — partial because you deliberately ignored everything else." },
           { s: "Do that for every adjustable number and collect the answers into one long list", n: "That list is the gradient: the full picture of which way to move everything." },
           { q: "But surely the numbers affect each other?",
             y: "They do, and the answers are only exactly right for the spot you are standing on right now — which is fine, because you only take a small step before recalculating",
             n: "Doing this one number at a time would take forever, so training computes all of them in a single sweep backwards through the model" }] }
},

"Gradient": {
 ex: { h: "The compass needle pointing uphill",
       b: "It bundles every partial derivative into one vector aimed at steepest increase. Training walks the opposite way. The subtlety that catches people: it is a local reading, valid only where you are standing, which is why gradient descent can settle into a valley that is not the deepest one." },
 fl: { t: "How one training step uses it",
       s: [{ s: "Imagine standing on a hillside in fog. The gradient is the direction of steepest uphill, and how steep it is", n: "You want to go down, so you walk the opposite way." },
           { s: "For a model, downhill means less wrong. So work out the direction that would reduce the error", n: "Every single adjustable number in the model gets its own answer: which way, and how strongly." },
           { q: "Is the slope enormous?",
             y: "Cap it before stepping. One freakishly steep reading can throw every number in the model into nonsense in a single step",
             n: "Take a step in the downhill direction, sized by your chosen step length" },
           { s: "Step too far and you overshoot the bottom. Step too little and you never arrive", n: "This step length is the single setting that matters most in training, and it is why so much effort goes into choosing it." },
           { s: "Better methods remember previous steps rather than reacting only to the current one", n: "Like a ball rolling downhill, which does not stop dead at every small bump." }] }
},

"Chain Rule": {
 ex: { h: "The rule that makes deep learning possible",
       b: "A twenty-layer network is a function of a function of a function. The chain rule says the derivative of the whole is the product of the derivatives of each part — so error at the output can be attributed to a weight in layer three. Backpropagation is this rule applied efficiently." },
 fl: { t: "How the error signal travels backwards",
       s: [{ s: "The chain rule answers a simple question: if A affects B, and B affects C, how much does A affect C?", n: "Multiply the two effects together. That is the whole rule." },
           { s: "A network is exactly that, stacked deep — each layer feeds the next, which feeds the next", n: "So to know how the first layer affects the final error, you multiply the effects all the way along." },
           { s: "Start at the end: how much would changing the final output change the error?", n: "Easy to work out, because the error is computed directly from that output." },
           { s: "Then step back one layer and multiply by how much that layer affects the one after it", n: "Repeat, layer by layer, until you reach the beginning." },
           { q: "What if each of those numbers is smaller than one?",
             y: "Multiplying thirty small fractions leaves almost nothing, so the earliest layers receive no useful signal and never learn",
             n: "And if they are consistently larger than one, the opposite happens — the numbers explode and training collapses" }] }
},

"Convex Optimisation": {
 ex: { h: "The bowl you cannot get lost in",
       b: "In a convex problem, downhill always leads to the single global minimum — so the solution is unique and the algorithm is guaranteed to find it. Logistic regression and SVMs live here. Neural networks emphatically do not, which is why their training is an empirical craft rather than a solved problem." },
 fl: { t: "Does convexity apply to you?",
       s: ["Look at the loss surface's shape",
           { q: "Is it convex?",
             y: "Any local minimum is the global one — the optimiser's answer is the answer",
             n: "Many local minima and saddle points; initialisation and seed matter" },
           { s: "Convex problems are reproducible", n: "Same data, same solution, every time." },
           { s: "Non-convex training is still practical", n: "In high dimensions most bad points are saddles, and good minima are plentiful." },
           "Adding L2 regularisation to a convex loss keeps it convex — and makes it strictly so"] }
},

"Probability": {
 ex: { h: "*30% chance of rain* means what, exactly?",
       b: "On days that look like this one, it rained three times in ten. That frequency reading is one interpretation; the Bayesian one treats it as a degree of belief you would bet on. The distinction sounds academic until you have to price something that only happens once." },
 fl: { t: "Sanity-checking a probability",
       s: ["Confirm it lies between 0 and 1",
           { q: "Do the possibilities cover everything, without overlap?",
             y: "Their probabilities must sum to exactly 1",
             n: "Your event space is malformed — fix that before computing anything" },
           { s: "A probability of 0 or 1 is a strong claim", n: "In modelling, it usually indicates a bug or overfitting." },
           { s: "Model outputs are not automatically probabilities", n: "A softmax score of 0.9 does not mean right 90% of the time — check calibration." },
           "*Probability of what, given what* — stating both halves prevents most confusion"] }
},

"Conditional Probability": {
 ex: { h: "The test came back positive",
       b: "For a disease affecting 1 in 1,000, a test with a 5% false-positive rate returns positive for roughly 51 people per 10,000 — of whom about 10 actually have it. So a positive result means around a 1 in 5 chance, not 95%. Conditioning on the right thing is where intuition fails hardest." },
 fl: { t: "Getting the conditioning right",
       s: ["Write down exactly what is known and what is asked",
           { s: "P(positive | disease) and P(disease | positive) are different numbers", n: "Confusing them is the prosecutor's fallacy." },
           { q: "Is the base rate very low?",
             y: "False positives will outnumber true ones — the test's accuracy is not the answer",
             n: "The conditional is closer to the test's sensitivity" },
           { s: "Counting out of 10,000 imaginary cases beats formulas", n: "The arithmetic becomes obvious and the intuition follows." },
           "Independence means conditioning changes nothing — rarely true, and usually assumed anyway"] }
},

"Bayes Theorem": {
 ex: { h: "Updating a belief when evidence arrives",
       b: "You believed something with 1% confidence; a test that is right 95% of the time says yes; the theorem tells you exactly what to believe now. It is arithmetic for changing your mind — and its practical lesson is that strong evidence against a rare hypothesis still leaves it unlikely." },
 fl: { t: "Working through an update",
       s: ["State the prior — what you believed beforehand",
           { s: "This is where base rates enter, and where they are usually forgotten", n: "Ignoring it is the base-rate fallacy." },
           { s: "State the likelihood — how probable this evidence is under each hypothesis", n: "Both hypotheses, not just the interesting one." },
           { q: "Is the evidence much more likely under one hypothesis?",
             y: "The posterior shifts strongly toward it",
             n: "Weak evidence barely moves a strong prior" },
           "Naive Bayes is this theorem with an assumption of independence that is false and works anyway"] }
},

"Random Variable": {
 ex: { h: "A name for a number you do not know yet",
       b: "*Tomorrow's order count* is not a number, it is a distribution — and treating it as a single number is how forecasts become promises. Naming it as a random variable is what lets you talk about its mean, its spread and its worst plausible case separately." },
 fl: { t: "Using one properly",
       s: ["Identify the quantity determined by chance",
           { q: "Can it take only distinct separate values?",
             y: "Discrete — counts, categories, successes; described by a probability mass function",
             n: "Continuous — time, weight, price; described by a density" },
           { s: "Its distribution is the full description", n: "The mean alone throws away everything about risk." },
           { s: "Functions of random variables are random variables too", n: "Which is why error propagates through a calculation." },
           "Report an interval, not a point — a single-number forecast hides all the uncertainty"] }
},

"Probability Distribution": {
 ex: { h: "The shape behind the average",
       b: "Two datasets share a mean of 100: one is every value between 99 and 101, the other is half zeros and half two hundreds. Same average, completely different business. The distribution is the thing; summary statistics are lossy compressions of it." },
 fl: { t: "Understanding a variable",
       s: ["Plot the distribution before computing anything",
           { s: "A histogram answers more questions than a summary table", n: "Bimodality and outliers are invisible in a mean." },
           { q: "Is it roughly symmetric and single-peaked?",
             y: "Mean and standard deviation describe it well",
             n: "Use median and quantiles — the mean is misleading under skew" },
           { s: "Two peaks usually means two populations mixed together", n: "Split them and model separately." },
           "Choosing a distribution is a modelling assumption — state it, and check the residuals against it"] }
},

"Normal Distribution": {
 ex: { h: "Common, and less universal than assumed",
       b: "Heights and measurement errors are genuinely bell-shaped. Incomes, city sizes, file sizes and response times are not — they are heavy-tailed, and assuming normality there systematically underestimates how often extreme values occur. That assumption has broken more risk models than any other." },
 fl: { t: "Before assuming your data is bell-shaped",
       s: [{ s: "The normal distribution is the familiar bell curve: most values near the middle, fewer as you move out, symmetric on both sides", n: "An enormous number of statistical methods quietly assume your data looks like this." },
           { s: "So plot it and look, before assuming anything", n: "Thirty seconds with a histogram prevents most of the mistakes in this area." },
           { q: "Is it roughly symmetric, with extreme values genuinely rare?",
             y: "Then the standard toolkit applies, and the handy rule holds: about two thirds of values sit within one step of the middle, 95% within two, and almost everything within three",
             n: "Income, file sizes and web page durations are all lopsided, with rare enormous values. Bell-curve methods will badly understate how often extremes happen" },
           { s: "For lopsided data, try taking logarithms first, or use a method built for that shape", n: "Taking logs often turns a skewed pile into something usefully bell-shaped." },
           { s: "One thing people get backwards: the famous result about averages becoming bell-shaped applies to *averages*, not to raw data", n: "Average enough samples of anything and the averages form a bell curve. That says nothing about the individual values, which may be wildly lopsided." }] }
},

"Binomial Distribution": {
 ex: { h: "How many conversions from a thousand visitors?",
       b: "Fixed number of independent trials, each succeeding with the same probability. It is the natural model for conversion counts, defect rates and A/B test outcomes — and the independence assumption is the one that breaks, because visitors who arrive together are often not independent at all." },
 fl: { t: "Checking it actually applies to your situation",
       s: [{ s: "This describes counting successes in a fixed number of independent yes/no attempts", n: "Ten coin flips, a thousand visitors who either buy or do not." },
           { s: "First check: is the number of attempts fixed in advance?", n: "A thousand visitors, decided beforehand. Not \"however many turn up until we see fifty sales\"." },
           { q: "Is the chance of success genuinely the same every single time?",
             y: "Then this applies, and the arithmetic is simple: the expected count is attempts × chance",
             n: "If mobile visitors convert at 2% and desktop at 8%, you have two different populations mixed together, and the results will vary far more than this predicts" },
           { s: "Second check: does one attempt affect another?", n: "Five sessions from the same person are not five independent attempts, and neither are visitors who all arrived from the same advert." },
           { s: "With enough attempts, the pattern becomes the familiar bell curve", n: "Which is where the standard formulas behind A/B test calculators come from." }] }
},

"Poisson Distribution": {
 ex: { h: "Support tickets between two and three",
       b: "Rare, independent events arriving at a steady average rate: emails per hour, server failures per month, goals per match. Its distinctive property is that variance equals the mean — so a queue averaging four an hour will sometimes see nine, and that is not an anomaly." },
 fl: { t: "Modelling arrivals",
       s: ["Confirm events are independent and the rate is roughly constant",
           { s: "Rush hour breaks the constant-rate assumption", n: "Model periods separately rather than averaging across them." },
           { q: "Is the observed variance close to the mean?",
             y: "Poisson fits — capacity planning can use it directly",
             n: "Over-dispersed: use a negative binomial instead" },
           { s: "The interval between events is exponentially distributed", n: "Same process, viewed from the other side." },
           "Staffing to the mean guarantees you are understaffed roughly half the time"] }
},

"Expected Value": {
 ex: { h: "The average that nobody experiences",
       b: "A lottery with a £2 ticket and an expected value of 80p is a bad bet on average, and its expected value has never been anyone's outcome. It is the right tool for decisions repeated many times, and a poor one for decisions taken once with ruinous downside." },
 fl: { t: "Using it to make a decision",
       s: [{ s: "Expected value is the average result you would get if you could repeat a gamble endlessly", n: "It is not what will happen this time. It is the long-run average." },
           { s: "List every outcome and how likely each is", n: "A 10% chance of winning 100, and a 90% chance of losing 5." },
           { s: "Multiply each outcome by its chance and add them all up", n: "0.1 × 100 plus 0.9 × −5 = 5.5. Positive, so worth taking — on average." },
           { q: "Will you actually face this decision many times?",
             y: "Then take the positive-expectation option every time. The average is what you will genuinely end up with",
             n: "If it is a one-off, the average may be irrelevant — a 99% chance of gaining 10 and a 1% chance of losing everything has a fine average and is still a terrible idea" },
           { s: "The rule that overrides the arithmetic: never risk something you cannot come back from", n: "You cannot play the long run if one bad outcome removes you from the game." }] }
},

"Variance": {
 ex: { h: "Two suppliers, same average delivery time",
       b: "Both average four days; one is always four days, the other varies between one and ten. Identical means, entirely different planning problems. Variance is what turns *on average it is fine* into a statement you can actually schedule around." },
 fl: { t: "Computing and reading it",
       s: ["Find the mean",
           { s: "Take each value's distance from it and square that", n: "Squaring makes deviations positive and penalises large ones heavily." },
           { s: "Average the squares", n: "Divide by n−1 for a sample, not n — Bessel's correction." },
           { q: "Do you need it in the original units?",
             y: "Take the square root — that is the standard deviation",
             n: "Variance is what the mathematics uses, because it adds for independent variables" },
           "It is extremely sensitive to outliers — one bad value dominates the whole figure"] }
},

"Standard Deviation": {
 ex: { h: "Spread, in units you can use",
       b: "Variance is in squared pounds, which nobody can picture. Standard deviation is in pounds. For roughly bell-shaped data, two thirds of values lie within one of them, and 95% within two — a rule of thumb that is genuinely useful and genuinely misleading on skewed data." },
 fl: { t: "Reporting spread honestly",
       s: ["Compute the standard deviation alongside the mean",
           { q: "Is the data roughly symmetric?",
             y: "Mean ± SD communicates the spread well",
             n: "Report median and interquartile range instead" },
           { s: "For heavy tails the SD understates the risk badly", n: "It is why *six sigma* events keep happening in finance." },
           { s: "The standard error is a different thing", n: "SD describes the data; standard error describes the precision of the mean." },
           "Quote both, and say which one you mean — they get confused constantly"] }
},

"Covariance": {
 ex: { h: "Do these two move together?",
       b: "Positive means when one is above its average the other tends to be too. Its problem is that the number depends entirely on the units — covariance in pounds-times-hours is uninterpretable, which is exactly why correlation, its normalised form, is what people actually quote." },
 fl: { t: "From covariance to something readable",
       s: ["For each pair, multiply the two deviations from their means",
           { s: "Both above average or both below gives a positive product", n: "Opposite sides gives a negative one." },
           { s: "Average those products — that is the covariance", n: "Its sign is meaningful; its magnitude is not, on its own." },
           { q: "Want a comparable number?",
             y: "Divide by both standard deviations — you get correlation, bounded −1 to 1",
             n: "The covariance matrix is what PCA needs, unnormalised" },
           "Zero covariance means no *linear* relationship — a perfect parabola has covariance zero"] }
},

"Correlation": {
 ex: { h: "−1 to 1, and only about straight lines",
       b: "It is the workhorse of exploratory analysis and it measures exactly one thing: linear association. A perfect U-shaped relationship has a correlation near zero. So does a strong relationship with one enormous outlier pulling in the opposite direction." },
 fl: { t: "Using it without being misled",
       s: [{ s: "Correlation is one number from −1 to +1 saying how much two things move together", n: "+1 means they rise in perfect step, −1 means one rises exactly as the other falls, 0 means no straight-line relationship." },
           { s: "Before computing anything, plot the two things against each other and look", n: "There is a famous set of four datasets with identical correlations that look completely different when drawn. The plot takes ten seconds and prevents most mistakes." },
           { q: "Does the relationship bend rather than following a straight line?",
             y: "Then this number will understate it badly. Use the version that compares rankings instead of raw values",
             n: "If it looks roughly like a straight line, the ordinary measure is fine" },
           { s: "A single odd point can swing it enormously", n: "Remove your most extreme data point and recompute. If the conclusion changes, you have not got a conclusion." },
           { s: "And the famous warning genuinely matters: moving together does not mean one causes the other", n: "Ice cream sales and drownings rise together. Both are caused by summer." }] }
},

"Mean, Median and Mode": {
 ex: { h: "Bill Gates walks into a bar",
       b: "The mean income in the room becomes tens of millions; the median barely moves. Which one you report is an editorial decision about skewed data, and *average salary* in a company with three executives and forty staff is almost always the wrong statistic to quote." },
 fl: { t: "Choosing the right centre",
       s: ["Look at the shape of the distribution",
           { q: "Is it skewed, or does it contain outliers?",
             y: "Median — it is robust; half the values sit either side regardless",
             n: "Mean — it uses every value and has better mathematical properties" },
           { s: "Mode is the only option for categories", n: "There is no mean favourite colour." },
           { s: "Mean above median indicates right skew", n: "A quick diagnostic without plotting anything." },
           "Report both when they differ — the gap between them is itself information"] }
},

"Percentile": {
 ex: { h: "Why engineers report p99 latency",
       b: "Mean response time of 200ms sounds healthy while the slowest 1% of requests take four seconds — and that 1% is your most active users, hitting the most endpoints. Percentiles describe the experience at the edges, which is where users actually notice." },
 fl: { t: "Reading a latency distribution",
       s: ["Sort the measurements",
           { s: "The p50 is the median — a typical request", n: "Half are faster, half slower." },
           { q: "Is p99 far above p50?",
             y: "A long tail — investigate the slow path, not the average one",
             n: "The distribution is tight and the mean is informative" },
           { s: "Percentiles cannot be averaged across servers", n: "The mean of two p99s is not the overall p99 — a very common reporting bug." },
           "A user making 100 requests hits p99 about once — the tail is more common than it sounds"] }
},

"Outlier": {
 ex: { h: "Error, or the most interesting row in the table?",
       b: "A £2 million transaction is a data entry mistake, a fraud, or your largest ever customer — and deleting it without deciding which is a choice, not a cleanup. In fraud detection and fault monitoring, the outliers are the entire signal." },
 fl: { t: "Handling one",
       s: ["Detect it — IQR rule, z-score, or a domain threshold",
           { q: "Is it impossible rather than merely extreme?",
             y: "A negative age is an error — fix or remove, and record that you did",
             n: "It is real data; removing it is a modelling decision to justify" },
           { s: "Never delete silently", n: "Document every exclusion or your analysis is not reproducible." },
           { s: "Consider robust methods instead", n: "Median, trimmed mean, or Huber loss keep the point without letting it dominate." },
           "Run the analysis with and without it — if the conclusion flips, that is the finding"] }
},

"Skewness": {
 ex: { h: "The long tail on one side",
       b: "Salaries, house prices and session durations all pile up at the low end with a tail stretching right. That asymmetry is why the mean sits above the median, why *average* is misleading, and why log-transforming these variables so often makes a model behave." },
 fl: { t: "Detecting and handling it",
       s: ["Compare mean and median",
           { q: "Is the mean well above the median?",
             y: "Right-skewed — a long upper tail, and the mean is being dragged by it",
             n: "Mean below median means left skew; equal suggests symmetry" },
           { s: "Log or square-root transform compresses the tail", n: "Often turning a hopeless variable into a well-behaved one." },
           { s: "Report the median and quantiles for skewed data", n: "And say that you have." },
           "Remember to transform back before presenting — log-pounds mean nothing to a reader"] }
},

"Central Limit Theorem": {
 ex: { h: "Why polling a thousand people works",
       b: "Individual opinions are not normally distributed and it does not matter: the *average* of a large enough sample is, whatever the underlying shape. That single result is what makes confidence intervals and most hypothesis tests possible at all." },
 fl: { t: "What it does and does not promise",
       s: ["Take many independent samples and compute each one's mean",
           { s: "Those means form an approximately normal distribution", n: "Centred on the true population mean." },
           { q: "Is the underlying data heavily skewed?",
             y: "You need a larger sample before the approximation holds — n=30 is folklore, not a rule",
             n: "It converges quickly" },
           { s: "It says nothing about the raw data being normal", n: "The single most common misreading of it." },
           "Independence is required — clustered or time-correlated samples break the guarantee"] }
},

"Sampling": {
 ex: { h: "The 1936 poll that got it spectacularly wrong",
       b: "A magazine surveyed 2.4 million people from telephone and car-registration lists and confidently predicted the loser. A rival polled 50,000 representatively and got it right. Sample size does not fix a biased frame — it just makes you confidently wrong." },
 fl: { t: "Designing a sample",
       s: ["Define the population you are claiming to describe",
           { q: "Does everyone in it have a known chance of selection?",
             y: "You have a probability sample — inference is valid",
             n: "It is a convenience sample; the bias is unbounded and unmeasurable" },
           { s: "Stratify on variables that matter", n: "Guarantees representation rather than hoping for it." },
           { s: "Non-response is a second selection", n: "The people who reply differ from those who do not." },
           "Report how the sample was drawn — without it, the margin of error is decorative"] }
},

"Hypothesis Testing": {
 ex: { h: "Is the new button genuinely better?",
       b: "Version B converted at 4.2% against 4.0%. A test asks how often you would see a gap that large if the two were identical. It answers exactly that narrow question — not whether the difference matters, and not whether B is better in any sense you would act on." },
 fl: { t: "Running a test properly",
       s: ["State the null hypothesis and the effect size that would matter",
           { s: "Before collecting data — this is the part that gets skipped", n: "Deciding afterwards is how noise becomes a finding." },
           { s: "Compute the required sample size for that effect", n: "Underpowered tests mostly produce false negatives and inflated effect estimates." },
           { q: "Is p below your pre-set threshold?",
             y: "Reject the null — but report the effect size and interval, not just the verdict",
             n: "Fail to reject — which is not evidence of no difference" },
           "Testing many variants multiplies false positives — correct for it or you will find something every time"] }
},

"Null Hypothesis": {
 ex: { h: "The boring explanation you have to rule out",
       b: "*The two versions are identical and this gap is chance.* Statistics is built as a courtroom where that is presumed true — you either gather enough evidence to reject it or you do not, and failing to reject is not the same as proving innocence." },
 fl: { t: "Framing it",
       s: ["Write the null as *no effect, no difference*",
           { s: "Specific and falsifiable", n: "*The conversion rates are equal*, not *the button is fine*." },
           { s: "The alternative is what you suspect", n: "One-sided if direction is predetermined; two-sided otherwise — decide in advance." },
           { q: "Did you fail to reject?",
             y: "You lack evidence — the effect may be real and your test underpowered",
             n: "You have evidence against the null, at your chosen error rate" },
           "You never *accept* the null — absence of evidence is not evidence of absence"] }
},

"P-Value": {
 ex: { h: "The most misread number in science",
       b: "p = 0.03 means: if there were genuinely no effect, data this extreme would appear 3% of the time. It is not the probability the hypothesis is wrong, not the probability the result is a fluke, and not a measure of how large or important the effect is." },
 fl: { t: "Reading it correctly",
       s: ["It assumes the null hypothesis is true",
           { s: "Everything it says is conditional on that assumption", n: "Which is why it cannot tell you the probability of that assumption." },
           { q: "Is p small?",
             y: "The data is surprising under the null — that is the whole claim",
             n: "The data is unremarkable under the null; it proves nothing either way" },
           { s: "0.05 is a convention, not a law of nature", n: "0.049 and 0.051 are the same evidence." },
           "Always report the effect size and confidence interval alongside — p alone is nearly uninformative"] }
},

"Confidence Interval": {
 ex: { h: "A range, which is more honest than a point",
       b: "*4.2% ± 0.8%* tells a reader far more than *4.2%*. The technical meaning is slippery — 95% of intervals built this way would contain the true value — but its practical use is sound: it shows how much the data actually pins down." },
 fl: { t: "Reading one",
       s: ["Compute the estimate and its standard error",
           { s: "The interval is roughly the estimate ± 2 standard errors", n: "For 95%, given a large enough sample." },
           { q: "Does the interval include zero, or no difference?",
             y: "You cannot rule out no effect at this confidence level",
             n: "The effect is distinguishable from zero — now ask whether it is large enough to matter" },
           { s: "Width is what matters, not just the centre", n: "A wide interval means the study answered very little." },
           "It is a statement about the procedure over many repetitions, not about this one interval"] }
},

"Statistical Significance": {
 ex: { h: "Significant and irrelevant at the same time",
       b: "With ten million users, a 0.01% conversion difference is highly significant and worth nothing. Significance measures your confidence that an effect exists; effect size measures whether anyone should care. Large samples make the first easy and the second essential." },
 fl: { t: "Deciding whether to act",
       s: ["Check statistical significance first",
           { q: "Is the effect statistically distinguishable from zero?",
             y: "Now ask the separate question: is it big enough to be worth the change?",
             n: "You cannot distinguish it from noise — do not ship on it" },
           { s: "Define the minimum effect worth acting on before testing", n: "It sets the sample size and prevents rationalising afterwards." },
           { s: "Consider the cost of the change too", n: "A real 0.1% lift may not repay a month of engineering." },
           "Significance is about evidence; importance is about the world — never conflate them"] }
},

"Type I and Type II Error": {
 ex: { h: "The fire alarm and the smoke detector",
       b: "A false positive is an alarm with no fire — annoying, and eventually ignored. A false negative is a fire with no alarm. You cannot minimise both with fixed data, so the honest question is which mistake costs more here: in cancer screening and in spam filtering, the answers are opposite." },
 fl: { t: "Setting the balance",
       s: ["Name the cost of each error in your domain",
           { q: "Which is worse — a false alarm or a missed case?",
             y: "Missed cases worse — lower the threshold, accept more false positives",
             n: "False alarms worse — raise the threshold, accept more misses" },
           { s: "Moving the threshold trades one for the other", n: "The ROC curve is exactly this tradeoff drawn out." },
           { s: "More data improves both", n: "The only way to escape the trade rather than just move along it." },
           "Alarm fatigue is real — a screening test with too many false positives stops being acted on"] }
},

"Statistical Power": {
 ex: { h: "The test that could never have found it",
       b: "Running an A/B test on 200 visitors to detect a 1% lift is theatre — the experiment had almost no chance of reaching significance even if the effect were real. Computing power beforehand tells you whether the test is worth running at all." },
 fl: { t: "Powering an experiment",
       s: ["Decide the smallest effect worth detecting",
           { s: "A business decision, not a statistical one", n: "Everything downstream depends on this number." },
           { s: "Choose your acceptable error rates", n: "Conventionally 5% false positives, 20% false negatives — 80% power." },
           { q: "Is the required sample size achievable?",
             y: "Run it, and run it to completion",
             n: "Do not run it — you would be buying a coin flip with a month of traffic" },
           "Underpowered studies that do reach significance overestimate the effect — the winner's curse"] }
},

"Maximum Likelihood Estimation": {
 ex: { h: "Which parameters make this data least surprising?",
       b: "Seven heads from ten flips: the coin bias that makes that outcome most probable is 0.7. That is MLE, and it underlies linear regression, logistic regression and the cross-entropy loss every classifier is trained with — minimising that loss is maximising likelihood." },
 fl: { t: "Finding the settings that best explain what you saw",
       s: [{ s: "You have some data and a theory with unknown numbers in it — a coin with an unknown bias, say", n: "The question: which bias best explains the results you actually observed?" },
           { s: "For any guess at those numbers, you can work out how probable your observed data would be", n: "If the coin were 50-50, how likely was 8 heads in 10? What if it were 80-20?" },
           { s: "The best estimate is simply the guess that makes what you saw most probable", n: "That is the entire idea. 8 heads in 10 is most probable if the coin is 80-20, so that is your estimate." },
           { s: "In practice you work with the logarithm of that probability rather than the probability itself", n: "Multiplying thousands of small probabilities together underflows to zero on a computer. Logarithms turn multiplication into addition, which is stable." },
           { q: "Can you solve it exactly?",
             y: "For simple cases yes, and the answer is often something obvious — the best estimate of the coin's bias is just the fraction of heads you saw",
             n: "For anything complicated there is no exact answer, so you search for it step by step. That search is exactly what training a model is" }] }
},

"Entropy": {
 ex: { h: "How many yes/no questions to pin it down",
       b: "A fair coin is one bit of uncertainty; a two-headed coin is zero. Entropy quantifies that, and it is why compression works — predictable data carries less information — and why decision trees split on whichever feature removes the most uncertainty." },
 fl: { t: "Measuring how uncertain something is",
       s: [{ s: "Entropy is one number answering: how surprised will I be by the outcome?", n: "A coin that always lands heads is unsurprising. A fair coin is maximally surprising for two options." },
           { s: "Start with the chances of each possible outcome", n: "Say 90% rain and 10% sun, or an even 50-50." },
           { q: "Is one outcome nearly certain?",
             y: "Then entropy is low. You already know what will happen, so the answer teaches you almost nothing",
             n: "If everything is equally likely, entropy is at its highest — every outcome is a genuine surprise" },
           { s: "This is exactly how a model's mistakes get scored during training", n: "Compare what the model predicted against what actually happened, and measure how surprised it should be." },
           { s: "Being confidently wrong is punished far more than being unsure and wrong", n: "Saying \"99% certain\" about something false costs enormously more than saying \"55% certain\", which is exactly the behaviour you want." }] }
},

"KL Divergence": {
 ex: { h: "The cost of believing the wrong distribution",
       b: "You compress data assuming distribution Q while the truth is P; KL divergence is the extra bits you waste. It is not a distance — D(P‖Q) differs from D(Q‖P) — and that asymmetry is exactly what makes variational inference and distillation behave the way they do." },
 fl: { t: "Measuring how far one set of predictions is from another",
       s: [{ s: "You have two sets of probabilities over the same outcomes — what really happens, and what your model predicts", n: "This gives one number for how different they are." },
           { s: "It answers: if I used the model's beliefs while reality followed the true ones, how much would I be surprised on average?", n: "Zero means the model matches reality exactly. Larger means it is more often caught out." },
           { s: "The order matters, and swapping it gives a different answer", n: "It is not a distance in the ordinary sense — the gap from A to B is not the gap from B to A. Always be clear which one you called the truth." },
           { q: "What if your model says something is impossible, and it happens?",
             y: "The measure becomes infinite. Assigning zero probability to something that occurs is infinitely surprising",
             n: "Which is why practical systems never let a probability reach exactly zero — a small floor is always added" },
           { s: "This is why training a classifier is really just minimising this gap", n: "Pushing the model's predicted probabilities towards the real ones is exactly the same operation." }] }
},

"Information Gain": {
 ex: { h: "Which question narrows it down most?",
       b: "In twenty questions you ask *is it alive* before *is it a badger*, because the first halves the space. A decision tree does the same arithmetic on every feature at every node, choosing the split that reduces entropy most — and that greedy choice is why trees are fast and slightly short-sighted." },
 fl: { t: "How a decision tree picks its next question",
       s: [{ s: "A tree grows by repeatedly asking a yes/no question that splits the data into two groups", n: "The whole skill is choosing which question to ask at each point." },
           { s: "Start by measuring how mixed up the current group is", n: "All one answer is perfectly tidy. A 50-50 mixture is as messy as it gets." },
           { s: "For every question you could ask, try it and measure how mixed the two resulting groups are", n: "Count the bigger group more heavily — tidying up three rows matters less than tidying up three hundred." },
           { s: "The improvement is the messiness before, minus the messiness after. That is the information gain", n: "Pick whichever question improves things most, then repeat inside each new group." },
           { q: "What if a column has a unique value for every single row — an ID, say?",
             y: "It looks perfect, because splitting on it puts one row in each group and every group is trivially tidy — and it is completely useless on new data",
             n: "Which is why a correction exists that penalises questions with very many possible answers" }] }
},

"Gini Impurity": {
 ex: { h: "Entropy's cheaper substitute",
       b: "It answers nearly the same question — how mixed is this node — without computing a logarithm, which mattered when trees were built on much slower machines. In practice the two pick the same split the overwhelming majority of the time, and it is why Gini is scikit-learn's default." },
 fl: { t: "Reading the number",
       s: ["Take the class proportions in the node",
           { s: "Gini is 1 minus the sum of squared proportions", n: "Zero when the node is pure." },
           { q: "Is the node all one class?",
             y: "Impurity zero — stop splitting, it is a leaf",
             n: "Split on whatever reduces weighted impurity most" },
           { s: "Maximum is 0.5 for two balanced classes", n: "Entropy's maximum is 1 bit for the same case — different scales, same ordering." },
           "The stopping rules and pruning matter far more to tree quality than Gini versus entropy"] }
},

"Euclidean Distance": {
 ex: { h: "Straight-line distance, and its limits",
       b: "It is the obvious default and it fails in two common ways: unscaled features let income in pounds swamp age in years, and in a few hundred dimensions every pair of points ends up roughly equidistant — the curse of dimensionality, which is why cosine similarity dominates embedding search." },
 fl: { t: "Choosing a distance",
       s: ["Check your feature scales first",
           { q: "Are features on different scales?",
             y: "Standardise, or the largest-unit feature defines the distance by itself",
             n: "Euclidean is meaningful" },
           { s: "In very high dimensions, distances concentrate", n: "Everything is far from everything, and *nearest* stops meaning much." },
           { s: "For embeddings, use cosine similarity", n: "Direction carries the meaning; magnitude usually does not." },
           "Manhattan distance is more robust in high dimensions and to outliers"] }
},

"Z-Score": {
 ex: { h: "Comparing a test score with a height",
       b: "Different units, different spreads, no common ground — until each is expressed as *how many standard deviations from its own mean*. That is standardisation, and it is why so many models require it: without it, features with large numeric ranges dominate everything." },
 fl: { t: "Standardising features",
       s: ["Compute the mean and standard deviation on the training set only",
           { s: "Then apply those same numbers to validation and test", n: "Fitting the scaler on all the data leaks information — a classic mistake." },
           { s: "Subtract the mean and divide by the standard deviation", n: "Every feature now has mean 0 and standard deviation 1." },
           { q: "Are there heavy outliers?",
             y: "Use a robust scaler based on median and IQR instead",
             n: "Z-scores above 3 are conventionally flagged as unusual" },
           "Distance-based and gradient-based models need this; tree-based models do not care"] }
},

"Correlation vs Causation": {
 ex: { h: "Ice cream sales and drownings",
       b: "Both rise together every summer, and neither causes the other — temperature drives both. The pattern repeats endlessly in analytics: users of feature X retain better, therefore build more X, when in fact engaged users were always going to find X." },
 fl: { t: "Testing a causal claim",
       s: ["You observe two things moving together",
           { q: "Could a third factor drive both?",
             y: "Confounding — the correlation is real and the causal story is not",
             n: "Could the causation run the other way? Often it does" },
           { s: "The only reliable answer is a randomised experiment", n: "Randomisation breaks the link to every confounder, known and unknown." },
           { q: "Cannot randomise?",
             y: "Natural experiments, instrumental variables, difference-in-differences — with stated assumptions",
             n: "Report it as an association and say so plainly" },
           "*Controlling for* observed variables never handles the ones you did not measure"] }
},

"Confounding Variable": {
 ex: { h: "The hidden third factor",
       b: "A study finds coffee drinkers get more lung cancer. Coffee drinkers also smoke more. Smoking is the confounder, and unless it is measured and adjusted for, the finding is real, reproducible and completely wrong about the cause." },
 fl: { t: "Handling confounders",
       s: ["List everything that could affect both the supposed cause and the outcome",
           { s: "Domain knowledge, not the data, generates this list", n: "The data cannot tell you what it does not contain." },
           { q: "Can you randomise assignment?",
             y: "Confounding is eliminated by design — including for variables you never thought of",
             n: "Adjust statistically: stratify, match, or regress on the measured ones" },
           { s: "Unmeasured confounders remain a permanent threat", n: "State this limitation explicitly in any observational finding." },
           "Beware over-adjusting: controlling for something on the causal path removes the effect you are measuring"] }
},

"Simpson's Paradox": {
 ex: { h: "Better in every department, worse overall",
       b: "The Berkeley admissions case: women were admitted at higher rates than men in nearly every department, and at a lower rate overall — because they applied disproportionately to the most competitive departments. Both figures were correct, and only one was relevant." },
 fl: { t: "Guarding against it",
       s: ["Compute the metric overall",
           { s: "Then compute it again within meaningful subgroups", n: "Always — this takes minutes and prevents public embarrassment." },
           { q: "Does the direction reverse between the two views?",
             y: "Simpson's paradox — an unequal group mix is driving the aggregate",
             n: "The aggregate is representative" },
           { s: "The correct view is the one the causal question demands", n: "Which requires knowing why the groups differ in size." },
           "It shows up constantly in A/B tests split unevenly across segments"] }
},

"Bootstrapping": {
 ex: { h: "Uncertainty without a formula",
       b: "You have the median of 500 response times and want a confidence interval, but there is no clean formula for a median's standard error. Resample the data with replacement a few thousand times, compute the median each time, and read the spread. Compute replaces algebra." },
 fl: { t: "The procedure",
       s: ["Draw a sample the same size as your data, with replacement",
           { s: "Some points appear twice, some not at all", n: "That variation is the point." },
           { s: "Compute your statistic on that resample", n: "Median, correlation, model score — anything." },
           { s: "Repeat a few thousand times", n: "You now have a distribution of the statistic." },
           { q: "Want a 95% interval?",
             y: "Take the 2.5th and 97.5th percentiles of those values",
             n: "The spread alone estimates the standard error" },
           "It cannot rescue a biased sample — it only quantifies sampling variability"] }
},

"Monte Carlo Method": {
 ex: { h: "Simulating your way to an answer",
       b: "Estimating whether a project finishes on time when every task has its own uncertain duration is analytically horrible and trivially simulable: draw random durations, run the schedule, repeat ten thousand times, count. Its cost is that accuracy improves only with the square root of the number of runs." },
 fl: { t: "Answering a hard question by simulating it many times",
       s: [{ s: "Some questions are too tangled to solve with a formula, but easy to imitate", n: "\"Will this project finish on time?\" depends on a dozen uncertain things multiplying together." },
           { s: "For each uncertain input, write down not one number but a range with likelihoods", n: "\"This task takes 3 to 8 days, most likely 5\" rather than pretending you know it is 5." },
           { s: "Now pick one random value from each range and work out what happens. That is one possible future", n: "One roll of the dice for the whole project." },
           { s: "Do that ten thousand times and collect all the outcomes", n: "You now have a picture of what usually happens, and what happens when things go badly." },
           { q: "Do any of your inputs move together?",
             y: "You must build that in — if one delay causes another, treating them as unrelated will make the bad cases look far rarer than they really are",
             n: "Then read the results: the middle value for a typical outcome, and the worst 5% for what you should actually plan around" },
           { s: "The answer is only as trustworthy as the ranges you invented", n: "The simulation cannot know something your assumptions did not." }] }
},

"Markov Chain": {
 ex: { h: "Tomorrow depends on today, not on last week",
       b: "PageRank models a surfer clicking randomly and asks where they end up; a weather model says the chance of rain tomorrow depends only on today. That memorylessness is a strong assumption, and it is what makes these systems solvable rather than intractable." },
 fl: { t: "Modelling with one",
       s: ["Define the states and the transition probabilities between them",
           { s: "Each row of the transition matrix sums to 1", n: "From any state, something must happen." },
           { q: "Does the next state genuinely depend only on the current one?",
             y: "Markov applies — you can compute long-run behaviour directly",
             n: "Enrich the state to include what matters from the history" },
           { s: "Iterating the transition matrix converges to a steady state", n: "The long-run proportion of time spent in each state." },
           "Enriching state is the standard escape hatch — *last two days* becomes one state"] }
},

"Markov Decision Process": {
 ex: { h: "The formal skeleton of reinforcement learning",
       b: "States, actions, transition probabilities, rewards, and a discount factor. Every RL algorithm is a way of finding a good policy for an MDP — and the difficult part in practice is never the mathematics, it is designing a reward that means what you intended." },
 fl: { t: "Framing a problem as an MDP",
       s: ["Define the state — everything the agent needs to decide",
           { s: "It must satisfy the Markov property, or the theory does not apply", n: "Stack recent observations if a single one is insufficient." },
           { s: "Define the actions available in each state", n: "And the reward for each transition." },
           { q: "Does the reward capture what you actually want?",
             y: "Careful — agents optimise the stated reward, not the intended one",
             n: "Reward hacking follows: the boat that spins collecting points instead of racing" },
           { s: "The discount factor sets the horizon", n: "Near 1 is far-sighted and harder to train." },
           "Sparse rewards make learning nearly impossible — shape them, carefully"] }
},

"Statistics": {
 ex: { h: "The discipline of not fooling yourself",
       b: "Its purpose is to say how much a set of observations actually supports a claim. Most of its practical value is defensive — recognising that a sample was not representative, that a difference is noise, or that a striking pattern was found by looking long enough." },
 fl: { t: "Approaching a question with data",
       s: ["State the question precisely, before looking",
           { s: "Vague questions are answered by whatever the data happens to show", n: "This is where most bad analysis begins." },
           { s: "Describe the data honestly — distributions, missingness, how it was collected", n: "Collection method constrains every claim you can make." },
           { q: "Are you testing a hypothesis or generating one?",
             y: "Testing: fix the analysis plan in advance",
             n: "Exploring: say so, and confirm findings on fresh data" },
           "The largest errors are almost always in the sampling, not in the arithmetic"] }
},

"Data Visualisation": {
 ex: { h: "Anscombe's quartet, in one picture",
       b: "Four datasets with identical means, variances and correlations look completely different when plotted — one is linear, one curved, one has a single outlier driving everything. Plotting is not the presentation step; it is the step that stops you reporting nonsense." },
 fl: { t: "Making a chart that informs",
       s: ["Decide the single question the chart answers",
           { q: "Comparing values, showing change, or showing distribution?",
             y: "Bar, line and histogram respectively — match the form to the question",
             n: "A pie chart is almost never the answer" },
           { s: "Start bar charts at zero", n: "A truncated axis exaggerates differences, whether or not you meant it to." },
           { s: "Label axes with units, and keep the ink low", n: "Every gridline and gradient competes with the data." },
           "Check it in greyscale and for colour-blind readers — colour alone should never carry meaning"] }
},

"Exploratory Data Analysis": {
 ex: { h: "An hour that saves a week",
       b: "Before modelling: how many rows, how many missing, what is the distribution of the target, which features are constant, and are there duplicate ids? Nearly every serious modelling problem is visible in that first hour — and invisible for weeks afterwards if you skip it." },
 fl: { t: "A first pass through a dataset",
       s: ["Check shape, types and missingness per column",
           { s: "A column that is 95% null is not a feature", n: "And missingness itself is often predictive." },
           { s: "Plot the distribution of every variable", n: "Look for skew, outliers, spikes at zero, and impossible values." },
           { q: "Is the target heavily imbalanced?",
             y: "It changes your metric, your sampling and your baseline — decide now",
             n: "Look at relationships between features and target" },
           { s: "Check for duplicates and leakage", n: "A feature that predicts too well is usually a leak." },
           "Write down what you find — EDA that lives only in a notebook gets repeated by the next person"] }
}

});
