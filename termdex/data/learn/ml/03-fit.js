/* Machine Learning — overfitting and generalisation. */
TD.addLessons("ml", [

  {
    t: "Overfitting Is the Whole Problem",
    m: "fit",
    lvl: "core",
    s: "Why a model that scores perfectly is usually broken, and how to tell from two numbers.",
    goal: [
      "Diagnose overfitting and underfitting from train and validation scores",
      "Explain the bias-variance trade-off without the formula",
      "Choose the right remedy for the failure you actually have"
    ],
    b: [
      { p: "Every model faces the same tension. It must learn the pattern in the training data — but the training data contains both the pattern and a great deal of accident, and a model powerful enough to learn the pattern is usually powerful enough to learn the accidents too." },

      { h: "Two numbers tell you everything" },
      { p: "Print the training score and the validation score together. Their relationship diagnoses the problem, every time." },

      {
        tbl: {
          t: "The diagnostic table",
          h: ["Train", "Validation", "Diagnosis", "What to do"],
          rows: [
            ["0.99", "0.72", "**Overfitting.** Memorised the training data including its noise", "Simplify the model, add data, add regularisation, remove features"],
            ["0.71", "0.70", "**Underfitting.** Too simple to capture the real pattern", "More capacity, better features, train longer, less regularisation"],
            ["0.86", "0.84", "**Healthy.** A small gap is normal and expected", "Nothing. Improve features if you want more"],
            ["0.70", "0.85", "**Something is wrong.** Validation should not beat training", "Suspect a leak, a bad split, or dropout being active at the wrong time"]
          ]
        }
      },

      {
        n: "That last row surprises people. Validation scoring higher than training usually means your validation set is easier — often because of a leak, a non-random split, or duplicate rows. In neural networks it can also be benign: dropout is active during training and off during evaluation, so the training number is measured on a deliberately handicapped model. Know which case you are in.",
        nt: "The row that means investigate"
      },

      { h: "Watching it happen" },
      {
        code: {
          lang: "python", t: "Model capacity against generalisation",
          lines: [
            { c: "from sklearn.tree import DecisionTreeClassifier", w: "" },
            { c: "", w: "" },
            { c: "for depth in [1, 3, 5, 10, 20, None]:", w: "**Depth is capacity.** `None` means grow until every leaf is pure." },
            { c: "    m = DecisionTreeClassifier(max_depth=depth, random_state=0)", w: "" },
            { c: "    m.fit(X_train, y_train)", w: "" },
            { c: "    print(f'depth={str(depth):>4}  train={m.score(X_train, y_train):.3f}'", w: "" },
            { c: "          f'  val={m.score(X_val, y_val):.3f}')", w: "", hi: true }
          ],
          out: "depth=   1  train=0.812  val=0.809\ndepth=   3  train=0.847  val=0.841\ndepth=   5  train=0.869  val=0.856\ndepth=  10  train=0.923  val=0.848\ndepth=  20  train=0.994  val=0.812\ndepth=None  train=1.000  val=0.798",
          after: "Validation peaks at depth 5 and then falls, while training keeps climbing to a perfect 1.000. Everything after depth 5 is the model learning things that are true of these particular rows and of nothing else. That divergence point is the model you want."
        }
      },

      {
        ana: "A student who memorises past exam papers word for word scores perfectly on those papers and fails the new one — they learned the papers, not the subject. A student who only learned *there is usually a question about photosynthesis* is underfitting: too crude a rule to answer anything specific. Good learning sits between, and the only way to find out where you are is to test on a paper nobody has seen.",
        at: "Memorising the papers versus learning the subject"
      },

      { h: "Bias and variance" },
      { p: "The same tension, in the field's own vocabulary — worth knowing because interviewers use it and because it names the trade cleanly." },

      {
        tbl: {
          t: "Two ways to be wrong",
          h: ["", "Bias", "Variance"],
          rows: [
            ["**Means**", "The model is systematically wrong — too simple to represent the truth", "The model swings wildly depending on which data it happened to be trained on"],
            ["**Looks like**", "Underfitting. Poor on train, poor on validation", "Overfitting. Excellent on train, poor on validation"],
            ["**Analogy**", "A dartboard where every throw lands in the same wrong spot", "A dartboard where throws scatter all over, averaging out to the centre"],
            ["**Reduce it by**", "More capacity, better features, less regularisation", "More data, less capacity, more regularisation, ensembling"]
          ]
        }
      },

      { p: "The trade is real: reducing one usually raises the other. Total error is roughly bias plus variance plus irreducible noise, and that third term is the floor no model gets under — set by label noise, missing information and genuine randomness in the world." },

      {
        n: "Knowing the irreducible floor exists changes how you work. If two expert annotators agree only 85% of the time, chasing 95% is chasing something that is not there. Estimate the ceiling early, and you will stop three months of effort that would have gone nowhere.",
        nt: "Why the floor matters"
      },

      { h: "The remedies, matched to the failure" },
      {
        tbl: {
          t: "Overfitting: pick by cost and effect",
          h: ["Remedy", "How it works", "Cost"],
          rows: [
            ["**More data**", "Accidents do not repeat; patterns do. Noise averages out as n grows", "**The most effective and usually the least available.** If you can get it, do this first"],
            ["**Less capacity**", "Shallower trees, fewer parameters, stronger constraints", "Free. Try it immediately"],
            ["**Regularisation**", "Penalise large weights so the model prefers simpler explanations", "One hyperparameter. L2 shrinks weights, L1 zeroes them out entirely"],
            ["**Fewer features**", "Fewer ways to find spurious patterns", "Cheap, and often improves interpretability at the same time"],
            ["**Ensembling**", "Average many models; their individual overfitting is uncorrelated and cancels", "**This is what a random forest is**, and why it works so well by default"],
            ["**Early stopping**", "Stop training when validation stops improving", "Free, and standard in every gradient boosting and neural network library"]
          ]
        }
      },

      {
        code: {
          lang: "python", t: "Regularisation strength, visible",
          lines: [
            { c: "from sklearn.linear_model import LogisticRegression", w: "" },
            { c: "", w: "" },
            { c: "for C in [0.001, 0.01, 0.1, 1, 100]:", w: "**`C` is inverse regularisation strength.** Small C means heavy penalty, simpler model." },
            { c: "    m = LogisticRegression(C=C, max_iter=1000).fit(X_train, y_train)", w: "" },
            { c: "    nonzero = (abs(m.coef_) > 0.01).sum()", w: "How many features the model is actually using." },
            { c: "    print(f'C={C:<7} train={m.score(X_train,y_train):.3f} '", w: "" },
            { c: "          f'val={m.score(X_val,y_val):.3f} features_used={nonzero}')", w: "", hi: true }
          ],
          out: "C=0.001   train=0.801 val=0.804 features_used=4\nC=0.01    train=0.834 val=0.836 features_used=11\nC=0.1     train=0.859 val=0.855 features_used=23\nC=1       train=0.871 val=0.851 features_used=38\nC=100     train=0.889 val=0.833 features_used=40",
          after: "Best validation at C=0.1, using 23 of 40 features. Heavier regularisation forced the model to ignore the weakest signals — which is precisely what you want, because the weakest signals are where the noise lives."
        }
      },

      { h: "Underfitting is rarer and easier" },
      { p: "If train and validation are both poor and close together, the model is too simple or the features do not contain the answer. In order:" },
      {
        ol: [
          "**Check the features actually contain signal.** If they do not, no model class will help and you need different data.",
          "**Raise capacity.** Deeper trees, more estimators, a more expressive model.",
          "**Reduce regularisation.**",
          "**Build better features.** Usually the real answer, and the features module is about exactly this.",
          "**Accept the ceiling.** Sometimes the problem is genuinely hard and 71% is the honest answer. Saying so is a professional skill."
        ]
      },

      { trap: "Do not fix overfitting by adding features. It is the instinctive move — *the model is wrong, give it more information* — and it makes overfitting worse, because every extra column is another opportunity to find a coincidence. When the training score is far above validation, the model already has more than it can use responsibly." },

      { h: "The double descent footnote" },
      { p: "Very large modern neural networks break this picture: past a certain enormous size, validation error starts *falling* again after the classical overfitting peak. This is real, it is called **double descent**, and it is part of why scaling language models worked at all." },
      { p: "It does not apply to your tabular gradient boosting model, and treating it as permission to skip regularisation is a mistake. For everything in this track, the classical picture holds." },

      {
        tryit: {
          t: "Draw the curve yourself",
          task: "Take any dataset and sweep one capacity parameter — tree depth, or `n_estimators`, or `C` — across a wide range. Plot train and validation scores on the same axes. Find the point where they diverge.",
          hint: "matplotlib: two `plt.plot` calls on the same figure, x-axis the parameter, y-axis the score. The divergence point is the model to pick.",
          sol: { lang: "python", code: "import matplotlib.pyplot as plt\nfrom sklearn.tree import DecisionTreeClassifier\n\ndepths = range(1, 26)\ntr, va = [], []\n\nfor d in depths:\n    m = DecisionTreeClassifier(max_depth=d, random_state=0).fit(X_train, y_train)\n    tr.append(m.score(X_train, y_train))\n    va.append(m.score(X_val, y_val))\n\nplt.plot(depths, tr, label='train')\nplt.plot(depths, va, label='validation')\nplt.axvline(depths[va.index(max(va))], ls='--', c='grey', label='best')\nplt.xlabel('max_depth'); plt.ylabel('accuracy'); plt.legend()\nplt.show()\n\nprint('best depth:', depths[va.index(max(va))])" },
          w: "That figure — two curves that rise together and then separate — is the single most useful plot in classical machine learning. Once you have drawn it a few times you start recognising the shape from the numbers alone, and you can diagnose a model's problem from two printed scores without plotting anything."
        }
      },

      { vocab: ["Overfitting", "Underfitting", "Bias-Variance Trade-off", "Regularisation", "L1 and L2 Regularisation"] }
    ],
    k: [
      "Print train and validation together; their gap diagnoses overfitting, underfitting or health.",
      "Validation scoring above training means something is wrong — a leak, a bad split, or dropout.",
      "Bias is being systematically wrong; variance is swinging with the training sample. Reducing one usually raises the other.",
      "Fix overfitting with more data, less capacity, regularisation, fewer features, ensembling or early stopping.",
      "Never fix overfitting by adding features — every extra column is another chance to find a coincidence."
    ],
    r: ["Overfitting", "Underfitting", "Bias-Variance Trade-off", "Regularisation", "L1 and L2 Regularisation", "Cross-Validation"],
    drill: {
      lang: "python",
      reps: 3,
      items: [
        { c: "m.score(X_train, y_train), m.score(X_val, y_val)", w: "the two numbers that diagnose any model" },
        { c: "DecisionTreeClassifier(max_depth=5)", w: "limit capacity to stop memorisation" },
        { c: "LogisticRegression(C=0.1)", w: "smaller C means heavier regularisation" },
        { c: "(abs(m.coef_) > 0.01).sum()", w: "how many features the model actually uses" }
      ]
    }
  },

  {
    t: "Learning Curves and Capacity Control",
    m: "fit",
    lvl: "intermediate",
    s: "How to know if you need more data, a bigger model, or better regularization before wasting time.",
    goal: [
      "Use scikit-learn learning_curve to plot performance vs dataset size",
      "Distinguish between data-starved models and capacity-constrained models",
      "Apply structural regularization constraints across tree and linear model families"
    ],
    b: [
      { p: "When your model performance plateaus, engineers often ask: 'Should I collect more rows of data, or should I switch to a more complex model architecture?' Learning curves give you the empirical answer in thirty seconds." },

      { h: "Plotting performance against sample size" },
      { p: "A learning curve plots training score and validation score as a function of the number of training examples used. The gap and trajectory tell you if collecting 50,000 more rows will move the needle." },

      {
        code: {
          lang: "python", t: "Computing learning curves with scikit-learn",
          lines: [
            { c: "import numpy as np", w: "" },
            { c: "from sklearn.model_selection import learning_curve", w: "" },
            { c: "", w: "" },
            { c: "train_sizes, train_scores, val_scores = learning_curve(", w: "" },
            { c: "    model, X, y, cv=5, scoring='f1',", w: "" },
            { c: "    train_sizes=np.linspace(0.1, 1.0, 5), random_state=42)", w: "**Vary sample size from 10% to 100% of dataset.**", hi: true },
            { c: "", w: "" },
            { c: "tr_mean, va_mean = train_scores.mean(axis=1), val_scores.mean(axis=1)", w: "" },
            { c: "for size, t_s, v_s in zip(train_sizes, tr_mean, va_mean):", w: "" },
            { c: "    print(f'N={size:<6} train_f1={t_s:.3f}  val_f1={v_s:.3f}  gap={t_s - v_s:.3f}')", w: "**Watch if the gap is closing as N increases.**", hi: true }
          ],
          out: "N=500    train_f1=0.982  val_f1=0.612  gap=0.370\nN=1250   train_f1=0.941  val_f1=0.684  gap=0.257\nN=2500   train_f1=0.910  val_f1=0.742  gap=0.168\nN=3750   train_f1=0.885  val_f1=0.771  gap=0.114\nN=5000   train_f1=0.870  val_f1=0.792  gap=0.078",
          after: "As N increases, validation score keeps climbing steep and the gap is narrowing fast. This trajectory means the model is **high-variance (data-starved)** — gathering more data will directly increase performance without any model tuning."
        }
      },

      {
        tbl: {
          t: "Diagnosing learning curves",
          h: ["Curve Trajectory", "Validation Score", "Primary Bottleneck", "Correct Engineering Action"],
          rows: [
            ["Both curves flat and close together", "Low (e.g. 0.65)", "High Bias (Underfitting)", "Add higher-capacity model, engineer interaction features"],
            ["Validation climbing steadily, gap closing", "Improving (0.61 -> 0.79)", "High Variance (Data-starved)", "Collect more data rows or apply data augmentation"],
            ["Curves plateaued with wide gap", "Stuck (e.g. 0.72 vs 0.95 train)", "Overfitting (Unconstrained)", "Apply stronger regularization, prune depth, drop weak features"]
          ]
        }
      },

      {
        n: "If both train and validation curves flatten early and stay at low accuracy, your model has reached its **representational capacity limit**. Collecting 1,000,000 extra rows will produce zero improvement. You must either increase model complexity or engineer features that expose non-linear relationships.",
        nt: "When data won't save you"
      },

      { h: "L1 vs L2 Regularization Mechanics" },
      { p: "Regularization forces the model optimization objective to penalize complexity. The choice of norm dictates how weights are constrained." },

      {
        tbl: {
          t: "L1 (Lasso) vs L2 (Ridge)",
          h: ["Property", "L1 (Lasso / absolute penalty)", "L2 (Ridge / squared penalty)"],
          rows: [
            ["Loss Penalty", "`+ λ Σ |w_i|`", "`+ λ Σ w_i²`"],
            ["Weight Effect", "Drives uninformative weights **exactly to zero**", "Shrinks weights **proportionally close to zero**"],
            ["Primary Benefit", "Built-in feature selection and sparse models", "Handles correlated features smoothly by sharing credit"],
            ["Use Case", "High-dimensional data with noisy/irrelevant columns", "Dense data where most features carry small signals"]
          ]
        }
      },

      {
        code: {
          lang: "python", t: "L1 feature selection in action",
          lines: [
            { c: "from sklearn.linear_model import LogisticRegression", w: "" },
            { c: "", w: "" },
            { c: "# L1 penalty with liblinear or saga solver", w: "" },
            { c: "clf = LogisticRegression(penalty='l1', C=0.05, solver='liblinear').fit(X_tr, y_tr)", w: "**C=0.05 enforces aggressive L1 sparsity.**", hi: true },
            { c: "selected = (abs(clf.coef_[0]) > 1e-5).sum()", w: "" },
            { c: "print(f'Retained {selected} of {X_tr.shape[1]} features')", w: "" }
          ],
          out: "Retained 14 of 120 features"
        }
      },

      {
        tryit: {
          t: "Run learning curve analysis",
          task: "Generate a synthetic dataset with noise. Train a RandomForest model and compute the learning curve across 5 data sizes. Identify if the model is data-starved or capacity-saturated.",
          hint: "Use `learning_curve(RandomForestClassifier(), X, y, cv=5, train_sizes=np.linspace(0.1, 1.0, 5))`.",
          sol: { lang: "python", code: "import numpy as np\nfrom sklearn.datasets import make_classification\nfrom sklearn.ensemble import RandomForestClassifier\nfrom sklearn.model_selection import learning_curve\n\nX, y = make_classification(n_samples=3000, n_features=20, random_state=42)\nm = RandomForestClassifier(max_depth=4, random_state=42)\n\nsizes, tr_scores, va_scores = learning_curve(\n    m, X, y, cv=5, train_sizes=np.linspace(0.2, 1.0, 5), scoring='accuracy')\n\nfor s, t, v in zip(sizes, tr_scores.mean(axis=1), va_scores.mean(axis=1)):\n    print(f'Samples: {s:4d} | Train Acc: {t:.3f} | Val Acc: {v:.3f}')" },
          w: "Notice how limiting max_depth=4 keeps the gap between training and validation accuracy tiny even with small sample sizes. Capacity control enforces stable generalization."
        }
      },

      { vocab: ["Learning Curve", "Bias-Variance Trade-off"] }
    ],
    k: [
      "Learning curves tell you whether to spend budget on getting more data or tuning model architecture.",
      "High variance shows a wide gap between train and validation scores; high bias shows both curves plateauing at unacceptable performance.",
      "L1 (Lasso) regularization sets weak feature weights exactly to zero, giving built-in feature selection.",
      "L2 (Ridge) regularization shrinks all weights smoothly, ideal for correlated inputs."
    ],
    r: ["Overfitting", "Underfitting", "Bias-Variance Trade-off", "Regularisation", "Cross-Validation"],
    drill: {
      lang: "python",
      reps: 3,
      items: [
        { c: "learning_curve(model, X, y, cv=5, train_sizes=np.linspace(0.1, 1.0, 5))", w: "plot train vs validation performance across dataset sizes" },
        { c: "LogisticRegression(penalty='l1', C=0.1, solver='saga')", w: "L1 regularization for sparse zero-weight selection" },
        { c: "Ridge(alpha=1.0)", w: "L2 regularized linear regression" }
      ]
    }
  }

]);
