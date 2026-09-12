/* Machine Learning — unsupervised learning. */
TD.addLessons("ml", [

{
 t: "Clustering, Reduction and Anomalies",
 m: "unsup",
 lvl: "core",
 s: "Finding structure with no answer key — and the honest difficulty of knowing whether you found anything.",
 goal: [
  "Run k-means and choose k for a reason rather than by habit",
  "Use PCA and UMAP for the right jobs and not the wrong ones",
  "Detect anomalies, and know why the results always need a human"
 ],
 b: [
  { p: "Unsupervised learning has no labels, which means no accuracy, no validation score, and no way to be told you are wrong. That freedom is why it is useful for discovery and why its results are so easy to over-sell." },

  { h: "k-means, and its assumptions" },
  { code: { lang: "python", t: "Clustering customers",
    lines: [
     { c: "from sklearn.cluster import KMeans", w: "" },
     { c: "from sklearn.preprocessing import StandardScaler", w: "" },
     { c: "", w: "" },
     { c: "Xs = StandardScaler().fit_transform(X)", w: "**Not optional.** k-means is distance-based, so an unscaled feature in lakhs decides every cluster on its own.", hi: true },
     { c: "", w: "" },
     { c: "km = KMeans(n_clusters=4, n_init=10, random_state=42).fit(Xs)", w: "**`n_init=10`** runs it ten times from different starts and keeps the best — k-means is sensitive to initialisation." },
     { c: "", w: "" },
     { c: "df['segment'] = km.labels_", w: "" },
     { c: "df.groupby('segment')[['spend','orders','tenure']].median()", w: "**Always profile the clusters.** A cluster you cannot describe in a sentence is not a segment, it is an artefact.", hi: true }
    ],
    out: "         spend  orders  tenure\nsegment\n0         340      1      45\n1        4200      9     380\n2       18500     31     720\n3         890      3     120" } },

  { p: "Now they can be named: new low-value, established regular, high-value loyal, occasional. Naming is not decoration — it is the test. If you cannot describe a cluster in words a colleague understands, you have partitioned the data without learning anything." },

  { tbl: { t: "What k-means assumes, and when it is wrong",
    h: ["Assumption", "Consequence when false"],
    rows: [
     ["Clusters are roughly **spherical**", "Elongated or curved groups get sliced across the middle"],
     ["Clusters are **similar in size**", "A small tight group is absorbed into a large loose one"],
     ["**You know k in advance**", "You do not, which is the next section"],
     ["**Euclidean distance is meaningful**", "Fails on high-dimensional sparse data, where all distances converge"]
    ] } },

  { h: "Choosing k" },
  { code: { lang: "python", t: "Two methods, used together",
    lines: [
     { c: "from sklearn.metrics import silhouette_score", w: "" },
     { c: "", w: "" },
     { c: "for k in range(2, 11):", w: "" },
     { c: "    km = KMeans(k, n_init=10, random_state=0).fit(Xs)", w: "" },
     { c: "    print(f'k={k}  inertia={km.inertia_:>10.0f}  '", w: "**Inertia** is total within-cluster distance. Always falls as k rises, so look for the *elbow* where it stops falling sharply." },
     { c: "          f'silhouette={silhouette_score(Xs, km.labels_):.3f}')", w: "**Silhouette** measures how well-separated the clusters are, from -1 to 1. Higher is better and it has a genuine maximum.", hi: true }
    ],
    out: "k=2  inertia=  38420  silhouette=0.412\nk=3  inertia=  27150  silhouette=0.448\nk=4  inertia=  20880  silhouette=0.471\nk=5  inertia=  18940  silhouette=0.396\nk=6  inertia=  17720  silhouette=0.362",
    after: "The elbow is around 4 and silhouette peaks at 4, so k=4 is defensible. When they disagree, prefer the interpretable answer — a technically optimal clustering nobody can act on is worth less than a slightly worse one that maps onto how the business already thinks." } },

  { n: "The real constraint on k is almost never mathematical. If the marketing team can run three campaigns, then k=3 is the right answer regardless of what silhouette says. Unsupervised results feed a decision, and the decision's structure should shape the analysis.",
    nt: "The constraint that actually decides k" },

  { h: "When k-means is the wrong tool" },
  { tbl: { t: "Alternatives worth knowing",
    h: ["Algorithm", "Good at", "Cost"],
    rows: [
     ["**DBSCAN**", "Arbitrary shapes, and it labels outliers as noise rather than forcing them into a cluster", "Two unintuitive parameters; struggles with varying density"],
     ["**Hierarchical**", "Produces a full tree, so you choose the number of clusters afterwards", "O(n²) memory — impractical beyond tens of thousands of rows"],
     ["**Gaussian mixture**", "Soft assignment — a point can be 70% cluster A, 30% cluster B", "More parameters, more ways to overfit"],
     ["**HDBSCAN**", "**The pragmatic modern default for embeddings.** Varying density, no k required", "Not in scikit-learn core; an extra dependency"]
    ] } },

  { h: "Dimensionality reduction" },
  { p: "Two tools that look similar and do completely different jobs. Confusing them is the most common mistake in this area." },

  { tbl: { t: "PCA against UMAP and t-SNE",
    h: ["", "PCA", "UMAP / t-SNE"],
    rows: [
     ["**What it does**", "Finds the directions of greatest variance; a **linear** projection", "Finds a low-dimensional layout preserving local neighbourhoods; **non-linear**"],
     ["**Reversible?**", "Yes, approximately", "**No.** There is no meaningful inverse"],
     ["**Use it for**", "**Preprocessing.** Compressing features before a model, denoising, speeding things up", "**Visualisation only.** Seeing structure in 2-D"],
     ["**Distances in the output**", "Meaningful", "**Not meaningful.** Cluster sizes and between-cluster distances in a UMAP plot mean nothing"],
     ["**Deterministic?**", "Yes", "No — different seeds give different pictures"]
    ] } },

  { trap: "Never cluster on UMAP output and report the clusters as a finding. UMAP is a projection tuned to make separated blobs, and it will produce visually convincing blobs from pure noise. Cluster in the original space — or on PCA output — and use UMAP only to *display* the result. Papers and dashboards are full of this mistake." },

  { code: { lang: "python", t: "Each in its proper role",
    lines: [
     { c: "from sklearn.decomposition import PCA", w: "" },
     { c: "", w: "" },
     { c: "pca = PCA(n_components=0.95).fit(Xs)", w: "**Keep enough components to retain 95% of the variance.** Specifying a fraction is far more useful than guessing a count.", hi: true },
     { c: "print(pca.n_components_)", w: "*12 components carry 95% of the variance in 40 features.*" },
     { c: "X_pca = pca.transform(Xs)", w: "**Now cluster or model on this.** Faster, less noisy, and distances still mean something." },
     { c: "", w: "" },
     { c: "import umap", w: "" },
     { c: "X_2d = umap.UMAP(n_neighbors=15).fit_transform(X_pca)", w: "**For the plot only.** Colour the points by the cluster labels you computed above." }
    ] } },

  { h: "Anomaly detection" },
  { p: "Find the points that do not look like the others. Useful for fraud, defects, monitoring and data quality — and it always needs a human at the end, because *unusual* and *bad* are different things." },

  { code: { lang: "python", t: "Isolation Forest, the practical default",
    lines: [
     { c: "from sklearn.ensemble import IsolationForest", w: "" },
     { c: "", w: "" },
     { c: "iso = IsolationForest(contamination=0.01, random_state=0).fit(X)", w: "**`contamination` is your guess at the anomaly rate.** It sets the threshold and it is a business decision, not something the data reveals.", hi: true },
     { c: "", w: "" },
     { c: "scores = iso.score_samples(X)", w: "**Lower is more anomalous.** Use the continuous score, not just the binary flag — it lets you rank and take the worst N." },
     { c: "df['anomaly_score'] = scores", w: "" },
     { c: "df.nsmallest(20, 'anomaly_score')", w: "**The twenty strangest rows.** Read them yourself.", hi: true }
    ],
    after: "The first time you run this on real data, most of the top twenty will be data quality problems rather than interesting anomalies — a test account, a currency stored in the wrong unit, a duplicated import. That is a genuinely valuable outcome and it is not the one people expect." } },

  { l: [
   "**Isolation Forest** — fast, handles many dimensions, sensible default.",
   "**Local Outlier Factor** — compares a point's density with its neighbours'. Better when normal behaviour varies by region.",
   "**Simple statistical rules** — beyond 3 standard deviations, or outside the 1st/99th percentile. **Frequently sufficient**, and far easier to explain to whoever has to act on the alert.",
   "**A supervised model** — if you have even a few hundred labelled anomalies, use them. Supervised beats unsupervised whenever labels exist."
  ] },

  { h: "The honest difficulty" },
  { p: "There is no answer key, so evaluation is a judgement. Three things make it defensible:" },
  { ol: [
   "**Stability.** Run it on two random halves of the data. If the clusters differ substantially, you found noise.",
   "**Interpretability.** Profile every cluster and name it. Anything unnameable is suspect.",
   "**Downstream usefulness.** Do the segments predict something you did not cluster on — retention, conversion, support volume? That is external validation and it is the strongest evidence available."
  ] },

  { tryit: { t: "Cluster, then check whether it is real",
    task: "Cluster any dataset with k-means. Then split the data in half at random, cluster each half separately, and compare the cluster profiles. Are the segments recognisably the same?",
    hint: "Compare the medians of your key features per cluster across the two halves. Cluster numbering is arbitrary, so match them by profile rather than by label.",
    sol: { lang: "python", code: "import numpy as np\nfrom sklearn.cluster import KMeans\n\nrng = np.random.default_rng(0)\nhalf = rng.permutation(len(Xs))\na, b = half[:len(half)//2], half[len(half)//2:]\n\nfor name, idx in [('half A', a), ('half B', b)]:\n    km = KMeans(4, n_init=10, random_state=0).fit(Xs[idx])\n    prof = (df.iloc[idx]\n              .assign(seg=km.labels_)\n              .groupby('seg')[['spend', 'orders', 'tenure']]\n              .median()\n              .sort_values('spend'))          # sort so numbering does not matter\n    print(f'\\n{name}'); print(prof.round(0))" },
    w: "If the two profile tables look substantially the same after sorting, your segments are a real property of the population and you can present them. If they look different, k-means partitioned noise — which it will always do, obligingly, because it has no way to tell you there is nothing there. This ten-minute check is the closest thing unsupervised learning has to a test set." } },

  { vocab: ["Clustering", "K-Means Clustering", "PCA", "Dimensionality Reduction", "Anomaly Detection", "UMAP"] }
 ],
 k: [
  "Scale before k-means, run with `n_init`, and profile every cluster — an unnameable cluster is an artefact.",
  "Choose k from the elbow, the silhouette and what the business can actually act on.",
  "PCA is for preprocessing and its distances are meaningful; UMAP and t-SNE are for pictures and theirs are not.",
  "Never cluster on UMAP output — it manufactures convincing blobs from noise.",
  "Validate unsupervised results by stability across halves, interpretability, and predicting something you did not cluster on."
 ],
 r: ["Clustering", "K-Means Clustering", "PCA", "Dimensionality Reduction", "Anomaly Detection", "Unsupervised Learning"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "KMeans(n_clusters=4, n_init=10, random_state=42)", w: "cluster, restarting to avoid a bad initialisation" },
   { c: "silhouette_score(Xs, labels)", w: "how well separated the clusters are" },
   { c: "PCA(n_components=0.95)", w: "keep 95% of the variance, however many components that takes" },
   { c: "IsolationForest(contamination=0.01)", w: "rank rows by how anomalous they are" },
   { c: "df.groupby('segment')[cols].median()", w: "profile clusters so you can name them" }
  ]
 }
}

]);
