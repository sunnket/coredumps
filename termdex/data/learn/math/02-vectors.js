/* ML Maths — vectors. */
TD.addLessons("math", [

{
 t: "A Vector Is a List of Numbers That Points Somewhere",
 m: "vectors",
 lvl: "core",
 s: "The one object that data, meaning and gradients are all made of.",
 goal: [
  "Read a vector as both a list and a direction, and switch between the two",
  "Add and scale vectors, and say what each operation does geometrically",
  "Explain why a row of a spreadsheet is a point in space"
 ],
 b: [
  { p: "A **vector** is an ordered list of numbers. That is the whole definition, and it is deliberately boring, because the interesting part is what you decide the list *means*." },

  { h: "The same list, three readings" },
  { code: { lang: "python",
    lines: [
     { c: "import numpy as np", w: "" },
     { c: "", w: "" },
     { c: "v = np.array([2.0, 3.0])", w: "Two numbers. What they *are* depends entirely on what you decided to store." },
     { c: "", w: "" },
     { c: "# reading 1: a data point", w: "A customer: 2 years old as an account, 3 orders placed. **A row of a spreadsheet is a vector.**" },
     { c: "# reading 2: a position", w: "The point 2 across, 3 up. Now geometry applies, and distance becomes meaningful." },
     { c: "# reading 3: a direction and a distance", w: "An arrow from the origin, pointing up and to the right. **This reading is where embeddings come from.**", hi: true }
    ],
    after: "All three readings are correct simultaneously. Machine learning constantly uses one to reason about another — which is exactly the trick that makes it work." } },

  { ana: "A spreadsheet with five columns is a room with five dimensions, and every row is one point floating in it. Two customers who behave alike are two points near each other. Clustering is finding clumps in that room, and a classifier is a wall drawn through it. Once you see the spreadsheet as a room, most of machine learning becomes geometry — and geometry has intuition attached, which tables do not.",
    at: "Your spreadsheet is a room" },

  { h: "Dimensions are just columns" },
  { p: "People find *512-dimensional space* alarming, which is understandable and unnecessary. A 512-dimensional vector is a list of 512 numbers. You cannot picture it, and you do not need to — every operation you will perform on it is defined arithmetically and works identically at 2 dimensions or 2,000." },

  { tbl: { t: "The same object at different sizes",
    h: ["Where", "Dimensions", "What one number means"],
    rows: [
     ["A point on a map", "2", "latitude, longitude"],
     ["A row in a customer table", "8", "age, orders, spend, days since last visit…"],
     ["A greyscale 28×28 image", "784", "the brightness of one pixel"],
     ["A sentence embedding", "384–1536", "**Nothing nameable.** A learned coordinate with no human meaning on its own"],
     ["One token inside a language model", "4096+", "Same — a learned coordinate in a space the model built for itself"]
    ] } },

  { n: "That last row is the one worth sitting with. In a customer table, column 3 means *number of orders* and you can say so. In an embedding, dimension 3 means nothing you can name. The meaning is not in any single dimension; it is in the *directions* and the *distances* between whole vectors. That is why you can never inspect one number of an embedding and learn anything, and why the only sensible question to ask an embedding is *what is near it*.",
    nt: "Why you cannot read an embedding" },

  { h: "The two operations" },
  { p: "There are exactly two things you can do to vectors on their own, and both have a clean geometric meaning." },

  { code: { lang: "python", t: "Addition and scaling",
    lines: [
     { c: "a = np.array([2, 3])", w: "" },
     { c: "b = np.array([1, -1])", w: "" },
     { c: "", w: "" },
     { c: "a + b", w: "**Element by element.** `[3, 2]`. Geometrically: walk along a, then walk along b from where you land." },
     { c: "a - b", w: "`[1, 4]`. **The vector from b to a** — this one appears constantly, because differences are what distances are made of." },
     { c: "", w: "" },
     { c: "2 * a", w: "**Scaling.** `[4, 6]`. Same direction, twice as long. Direction is preserved; only magnitude changes.", hi: true },
     { c: "-1 * a", w: "`[-2, -3]`. Same line, opposite direction." },
     { c: "0.5 * a", w: "`[1, 1.5]`. Same direction, half as long." }
    ],
    out: "[3 2]\n[1 4]\n[4 6]\n[-2 -3]\n[1.  1.5]",
    after: "Scaling never changes direction. That fact is the whole reason cosine similarity exists — you will meet it in the next lesson." } },

  { h: "Length, and why you normalise" },
  { p: "The **norm** of a vector is its length, and it is Pythagoras extended to any number of dimensions: square every component, add them up, take the square root." },

  { code: { lang: "python",
    lines: [
     { c: "v = np.array([3.0, 4.0])", w: "" },
     { c: "np.linalg.norm(v)", w: "**5.0** — because 3² + 4² = 25, and √25 = 5. The classic triangle, in vector form." },
     { c: "", w: "" },
     { c: "unit = v / np.linalg.norm(v)", w: "**Normalising**: divide by your own length, and the result has length exactly 1.", hi: true },
     { c: "np.linalg.norm(unit)", w: "1.0. The direction survived; the magnitude was thrown away." }
    ],
    out: "5.0\n1.0" } },

  { p: "Normalising matters enormously in practice because it separates *which way* from *how much*. Two documents about the same subject, one three paragraphs long and one thirty pages, produce embeddings pointing in a similar direction but with different magnitudes. If you compare raw lengths, the long document wins on being long. If you normalise first, you compare meaning instead of size — which is what you wanted." },

  { trap: "`np.linalg.norm` on a 2-D array does not do what most people assume. By default it treats the whole matrix as one flat vector and returns a single number. To get the length of each row separately — which is nearly always what you want when normalising a batch of embeddings — you must say `np.linalg.norm(X, axis=1, keepdims=True)`. Silently normalising a whole batch by one global number is a real bug that produces plausible, quietly wrong results." },

  { code: { lang: "python", t: "Normalising a batch of embeddings, correctly",
    lines: [
     { c: "X = np.random.randn(1000, 384)", w: "A thousand embeddings, 384 dimensions each." },
     { c: "", w: "" },
     { c: "lengths = np.linalg.norm(X, axis=1, keepdims=True)", w: "**`axis=1` means along each row.** `keepdims=True` keeps the shape as (1000, 1) so the division broadcasts correctly.", hi: true },
     { c: "X_unit = X / lengths", w: "Every row now has length 1." },
     { c: "", w: "" },
     { c: "np.linalg.norm(X_unit, axis=1)[:5]", w: "Check it. All ones, give or take floating point dust." }
    ],
    out: "array([1., 1., 1., 1., 1.])" } },

  { tryit: { t: "Distance in a room you cannot picture",
    task: "Create three 5-dimensional vectors: `a = [1,2,3,4,5]`, `b = [1,2,3,4,6]` and `c = [9,8,7,6,5]`. Compute the distance from a to b and from a to c using `np.linalg.norm(a - b)`. Then predict which pair a nearest-neighbour search would return before you run it.",
    hint: "The distance between two points is the length of the vector between them. Subtract, then take the norm.",
    sol: { lang: "python", code: "import numpy as np\n\na = np.array([1, 2, 3, 4, 5])\nb = np.array([1, 2, 3, 4, 6])\nc = np.array([9, 8, 7, 6, 5])\n\nprint(np.linalg.norm(a - b))   # 1.0\nprint(np.linalg.norm(a - c))   # 10.95\n\n# nearest neighbour to a, out of {b, c}\ncandidates = {'b': b, 'c': c}\nnearest = min(candidates, key=lambda k: np.linalg.norm(a - candidates[k]))\nprint(nearest)                 # b" },
    w: "You just wrote nearest-neighbour search. A vector database does exactly this, over millions of vectors, with an index so it does not have to check every one. The mathematics does not get harder as it scales — only the engineering does." } },

  { vocab: ["Vector", "Norm", "Embedding", "Tensor"] }
 ],
 k: [
  "A vector is an ordered list of numbers, readable as a data point, a position or a direction.",
  "A row of your dataset is a point in a space with one dimension per column.",
  "An embedding's individual dimensions mean nothing nameable — only directions and distances carry meaning.",
  "The norm is the length; normalising throws away magnitude and keeps direction, which is usually what you want.",
  "Use `axis=1, keepdims=True` when normalising a batch, or you will silently normalise by the wrong number."
 ],
 r: ["Vector", "Norm", "Embedding", "Tensor", "Linear Algebra"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "v = np.array([2.0, 3.0])", w: "build a vector from a list" },
   { c: "np.linalg.norm(v)", w: "the length of a vector" },
   { c: "unit = v / np.linalg.norm(v)", w: "normalise to length 1, keeping only direction" },
   { c: "np.linalg.norm(a - b)", w: "the distance between two points" },
   { c: "np.linalg.norm(X, axis=1, keepdims=True)", w: "the length of every row, shaped so it broadcasts" }
  ]
 }
},

{
 t: "The Dot Product Is How Machines Measure Meaning",
 m: "vectors",
 lvl: "core",
 s: "One operation, and the entire mathematical content of semantic search.",
 goal: [
  "Compute a dot product and say what a large, zero or negative result means",
  "Derive cosine similarity from the dot product and explain why the division is there",
  "Choose correctly between dot product, cosine and Euclidean distance"
 ],
 b: [
  { p: "If you learn one operation from this whole track, learn this one. The **dot product** is how a machine decides two things are similar, and every retrieval system you will ever build rests on it." },

  { h: "The operation" },
  { p: "Multiply matching positions, add up the results. One number comes out." },

  { syn: { t: "The dot product of two vectors",
    parts: [
     { p: "a · b", w: "Written with a centre dot, said *a dot b*. In NumPy it is the `@` operator, or `np.dot`." },
     { p: " = " },
     { p: "a₁b₁ + a₂b₂ + … + aₙbₙ", w: "**Pair up matching positions, multiply, sum.** Both vectors must have the same length or the operation is undefined." }
    ],
    after: "The result is a single number — a **scalar** — not a vector. That collapse from two lists to one number is what makes it a *measure*." } },

  { code: { lang: "python",
    lines: [
     { c: "a = np.array([1, 2, 3])", w: "" },
     { c: "b = np.array([4, 5, 6])", w: "" },
     { c: "", w: "" },
     { c: "a @ b", w: "1·4 + 2·5 + 3·6 = 4 + 10 + 18 = **32**. The `@` operator is the modern spelling and reads much better than `np.dot(a, b)`.", hi: true }
    ],
    out: "32" } },

  { h: "What the number means" },
  { p: "The dot product measures **alignment**. Two vectors pointing the same way produce a large positive number; perpendicular vectors produce zero; opposed vectors produce a negative number. This is the entire intuition and it is worth burning in." },

  { tbl: { t: "Reading a dot product",
    h: ["Result", "Geometrically", "In an application"],
    rows: [
     ["**Large positive**", "Pointing in a similar direction", "These two documents are about the same thing"],
     ["**Around zero**", "Perpendicular — no relationship", "Unrelated. This is what most pairs in a corpus look like"],
     ["**Negative**", "Pointing in opposite directions", "Opposed in whatever the dimensions encode. Rarer than beginners expect in real embeddings"],
     ["**Very large**", "Aligned **or** simply long", "**Ambiguous, and this is the problem.** A long document can beat a relevant one on magnitude alone"]
    ] } },

  { h: "The problem, and cosine similarity" },
  { p: "That last row is the flaw. The dot product mixes two things you probably wanted to keep separate: how aligned the vectors are, and how long they are. A thirty-page document and a one-line query can have a large dot product because the document is long, not because it is relevant." },

  { p: "**Cosine similarity** fixes it by dividing the magnitude out. Divide the dot product by both lengths and what remains is pure direction — a number from -1 to 1 that does not care how big either vector is." },

  { code: { lang: "python", t: "The formula, and the reason for every part of it",
    lines: [
     { c: "def cosine(a, b):", w: "" },
     { c: "    return (a @ b) / (np.linalg.norm(a) * np.linalg.norm(b))", w: "**Alignment on top, magnitudes underneath.** The division is what removes the length bias entirely.", hi: true },
     { c: "", w: "" },
     { c: "short = np.array([1.0, 1.0])", w: "A short vector pointing north-east." },
     { c: "long  = np.array([50.0, 50.0])", w: "**The same direction**, fifty times longer. Think: same topic, much longer document." },
     { c: "other = np.array([1.0, 0.0])", w: "A different direction entirely." },
     { c: "", w: "" },
     { c: "short @ long", w: "100.0 — enormous, entirely because `long` is long." },
     { c: "short @ other", w: "1.0 — small." },
     { c: "", w: "" },
     { c: "cosine(short, long)", w: "**1.0 — identical direction.** Length was correctly ignored.", hi: true },
     { c: "cosine(short, other)", w: "0.707 — 45 degrees apart. A real, comparable similarity." }
    ],
    out: "100.0\n1.0\n1.0\n0.7071067811865475",
    after: "Raw dot product ranked `long` a hundred times higher than `other`. Cosine correctly reported that `long` is the same topic and `other` is partly related. This is not a toy difference — it is the difference between a search engine that returns the longest document and one that returns the right document." } },

  { n: "The range is -1 to 1: identical direction is 1, perpendicular is 0, opposite is -1. In practice, with real text embeddings, almost everything lands between about 0.1 and 0.9, and unrelated text sits around 0.1–0.3 rather than at 0. Absolute values are close to meaningless — **only the ranking matters.** A team that tries to set a fixed cutoff like *0.8 means relevant* will discover it does not transfer between models, between corpora, or even between two versions of the same model.",
    nt: "What the numbers look like in reality" },

  { h: "The shortcut everyone uses" },
  { p: "If every vector is already normalised to length 1, the division does nothing — you are dividing by 1 × 1. So cosine similarity and dot product become the same operation." },

  { code: { lang: "python", t: "Why production systems normalise on write",
    lines: [
     { c: "X = np.random.randn(100000, 384)", w: "A hundred thousand embeddings." },
     { c: "X = X / np.linalg.norm(X, axis=1, keepdims=True)", w: "**Normalise once, at insert time.** Paid once, forever." },
     { c: "", w: "" },
     { c: "q = np.random.randn(384)", w: "The query embedding." },
     { c: "q = q / np.linalg.norm(q)", w: "Normalised too." },
     { c: "", w: "" },
     { c: "scores = X @ q", w: "**One matrix-vector product scores all 100,000 documents.** Because everything is unit length, this is exactly cosine similarity — with no square roots at query time.", hi: true },
     { c: "top = np.argsort(-scores)[:5]", w: "The five best. `argsort` of the negated scores gives descending order." }
    ],
    after: "This is precisely what a vector database does, plus an approximate index so it does not have to touch all hundred thousand rows. The mathematics is one line; everything else is engineering." } },

  { h: "Choosing between the three measures" },
  { tbl: { t: "Which one, and when",
    h: ["Measure", "Sensitive to", "Use it when"],
    rows: [
     ["**Cosine similarity**", "Direction only", "**Text embeddings, almost always.** You want topic, not length. This is the default and you need a reason to deviate"],
     ["**Dot product**", "Direction and magnitude", "Your model was explicitly trained for it, or magnitude encodes something real like confidence or popularity"],
     ["**Euclidean (L2) distance**", "Actual separation in space", "Genuine coordinates, clustering, k-NN over real measured features rather than learned embeddings"]
    ] } },

  { trap: "Use the metric your embedding model was trained with. Models are trained against a specific similarity function, and using a different one at query time degrades results in a way that is invisible — nothing errors, the numbers look reasonable, and retrieval is just quietly worse. Check the model card. For most sentence embedding models the answer is cosine, and most of them ship already normalised, which is why the distinction so often goes unnoticed until it bites." },

  { tryit: { t: "Build a tiny semantic search",
    task: "Make five 3-dimensional vectors representing documents, and one query vector. Rank the documents by cosine similarity and print them in order. Then rank them by raw dot product and find a case where the two orders disagree.",
    hint: "To force a disagreement, make one document point in a mediocre direction but give it a large magnitude — multiply it by 20.",
    sol: { lang: "python", code: "import numpy as np\n\ndocs = {\n    'about cats':      np.array([0.9, 0.1, 0.0]),\n    'about dogs':      np.array([0.8, 0.2, 0.1]),\n    'about finance':   np.array([0.0, 0.1, 0.9]),\n    'long, mediocre':  np.array([0.4, 0.4, 0.4]) * 20,\n    'about pets':      np.array([0.85, 0.15, 0.05]),\n}\nq = np.array([1.0, 0.0, 0.0])   # query: 'cats'\n\ndef cosine(a, b):\n    return (a @ b) / (np.linalg.norm(a) * np.linalg.norm(b))\n\nprint('by cosine:')\nfor name, v in sorted(docs.items(), key=lambda kv: -cosine(kv[1], q)):\n    print(f'  {cosine(v, q):.3f}  {name}')\n\nprint('by dot product:')\nfor name, v in sorted(docs.items(), key=lambda kv: -(kv[1] @ q)):\n    print(f'  {v @ q:.3f}  {name}')" },
    w: "The long, mediocre document climbs to the top under raw dot product and sits fourth under cosine. That is exactly the failure mode in production: a verbose FAQ page that outranks the precise answer, on every query, for no reason a user could ever guess. One line of normalisation prevents it." } },

  { vocab: ["Dot Product", "Cosine Similarity", "Embedding", "Vector Database", "Norm"] }
 ],
 k: [
  "The dot product multiplies matching positions and sums them — one number measuring alignment.",
  "Large positive means aligned, zero means unrelated, negative means opposed.",
  "Raw dot product confuses alignment with length; cosine similarity divides the length out.",
  "Normalise embeddings once at write time and cosine similarity becomes a single matrix multiply.",
  "Absolute similarity values are not portable between models — only the ranking is."
 ],
 r: ["Dot Product", "Cosine Similarity", "Embedding", "Vector Database", "Norm", "Semantic Search"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "a @ b", w: "the dot product — alignment as one number" },
   { c: "(a @ b) / (np.linalg.norm(a) * np.linalg.norm(b))", w: "cosine similarity, written out in full" },
   { c: "X = X / np.linalg.norm(X, axis=1, keepdims=True)", w: "normalise every embedding once, at write time" },
   { c: "scores = X @ q", w: "score every document against the query in one operation" },
   { c: "top = np.argsort(-scores)[:5]", w: "the five highest-scoring, in descending order" }
  ]
 }
}

]);
