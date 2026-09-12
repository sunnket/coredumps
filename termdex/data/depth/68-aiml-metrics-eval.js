/* ==========================================================================
   Depth pass 68 — AI/ML core batch 6: classification evaluation metrics.
   Confusion Matrix, Accuracy, Precision, Recall,
   F1 Score, ROC Curve, AUC, Precision-Recall Curve.

   Evaluation metrics are the lenses through which algorithms see reality:
   accuracy deceives under imbalance; ROC measures ranking; PR exposes false alarms.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "confusion-matrix",

      why: {
        before: "Classification performance was reported as a single aggregate " +
          "scalar percentage (e.g. '88% accuracy'), hiding the distribution of errors.",
        problem: "A single aggregate accuracy score conceals whether a model is failing " +
          "by generating costly false alarms (Type I Error) or by completely missing " +
          "dangerous catastrophic events (Type II Error).",
        shift: "**The Confusion Matrix: complete contingency table of classification truth.** " +
          "Lay out a structured $K \\times K$ cross-tabulation comparing ground-truth reality " +
          "against predicted labels, explicitly exposing True Positives, False Positives, " +
          "True Negatives, and False Negatives."
      },

      num: {
        t: "Binary 2x2 confusion matrix contingency layout & derived rates",
        h: ["Ground Truth \\ Predicted", "Predicted Negative ($\\hat{Y}=0$)", "Predicted Positive ($\\hat{Y}=1$)", "Marginal Row Metric"],
        r: [
          ["**Actual Negative ($Y=0$)**", "**True Negative (TN)**", "**False Positive (FP, Type I Error)**", "**Specificity (TNR) = $\\frac{\\text{TN}}{\\text{TN}+\\text{FP}}$**"],
          ["**Actual Positive ($Y=1$)**", "**False Negative (FN, Type II Error)**", "**True Positive (TP)**", "**Recall / Sensitivity = $\\frac{\\text{TP}}{\\text{TP}+\\text{FN}}$**"],
          ["**Marginal Column Metric**", "**NPV = $\\frac{\\text{TN}}{\\text{TN}+\\text{FN}}$**", "**Precision (PPV) = $\\frac{\\text{TP}}{\\text{TP}+\\text{FP}}$**", "**Accuracy = $\\frac{\\text{TP}+\\text{TN}}{\\text{Total}}$**"]
        ],
        n: "The Confusion Matrix is the foundational analytical artifact " +
          "underpinning all classification diagnostics. In binary classification, " +
          "it categorizes every prediction into one of four mutually exclusive " +
          "quadrants: (1) **True Positives (TP)**: correctly detected events; " +
          "(2) **True Negatives (TN)**: correctly rejected non-events; (3) " +
          "**False Positives (FP / Type I Error / False Alarm)**: innocent " +
          "instances flagged as positive; and (4) **False Negatives (FN / " +
          "Type II Error / Miss)**: critical events that slipped past the " +
          "model undetected. In multi-class classification, the matrix expands " +
          "to $K \\times K$: the diagonal elements represent correct predictions, " +
          "while off-diagonal cells pinpoint exact misclassification pairs " +
          "(e.g. revealing that a vision model specifically confuses 'Class 3' " +
          "with 'Class 8'). By multiplying the raw count confusion matrix " +
          "by an enterprise **Cost Matrix** (where each quadrant carries a " +
          "dollar value, e.g. $C_{\\text{FN}} = \\$5,000$ and $C_{\\text{FP}} " +
          "= \\$15$), organizations translate abstract statistical outputs " +
          "into direct financial ROI calculations."
      },

      miss: [
        {
          w: "The axis orientation of a confusion matrix is universally standardized.",
          r: "Different libraries and disciplines swap axes: scikit-learn places Actual classes " +
            "on rows and Predicted on columns; medical epidemiology and TensorFlow frequently invert them."
        },
        {
          w: "A confusion matrix is only applicable to binary classification.",
          r: "Confusion matrices generalize to $K \\times K$ multi-class classification, " +
            "exposing asymmetric confusions between specific pairs of classes."
        },
        {
          w: "Maximizing the overall diagonal sum is always the best business strategy.",
          r: "In asymmetric domains (cancer, fraud), sacrificing thousands of True Negatives " +
            "to prevent a single fatal False Negative maximizes real-world utility."
        },
        {
          w: "Raw count confusion matrices are sufficient for imbalanced datasets.",
          r: "In severe class imbalance, raw counts visually obscure minority performance; " +
            "normalizing by row (True Class) is required to see real per-class recall rates."
        }
      ],

      trade: {
        buys: [
          "Completely deconstructs model errors into distinct Type I and Type II failure modes.",
          "Provides the raw mathematical inputs for computing Precision, Recall, Specificity, and F1.",
          "Enables multiplying counts by financial cost matrices to calculate bottom-line business impact.",
          "Pinpoints specific class confusions in multi-class classification problems."
        ],
        costs: [
          "Static snapshot: evaluated at a single arbitrary decision threshold $\\tau$ (typically 0.5).",
          "Does not capture the model's underlying continuous probabilistic confidence scores.",
          "Requires visual inspection; cannot be used directly as a differentiable loss function.",
          "Large $K \\times K$ matrices (e.g. 100 classes) become visually overwhelming to parse."
        ],
        avoid: [
          "Evaluating classification systems without inspecting the full confusion matrix.",
          "Assuming row and column orientations without explicitly checking library axis documentation.",
          "Relying on raw unnormalized counts when evaluating heavily imbalanced datasets."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "accuracy",

      why: {
        before: "Engineers had no single intuitive standardized metric to report " +
          "what fraction of an algorithm's predictions were correct.",
        problem: "Naive reliance on accuracy produces disastrous failures in " +
          "imbalanced real-world environments, creating false confidence in broken systems.",
        shift: "**Classification Accuracy: the proportion of correct predictions.** " +
          "Compute the ratio of all correct predictions (TP + TN) to total instances, " +
          "providing an intuitive performance summary strictly valid for balanced datasets."
      },

      num: {
        t: "The Accuracy Paradox under severe class imbalance",
        h: ["Dataset Composition", "Model Behavior", "Resulting Accuracy", "Real-World Business Failure"],
        r: [
          ["**Balanced (50% Cat, 50% Dog)**", "**Trained Classifier**", "**88% Accuracy**", "**Honest, reliable evaluation of classification skill**"],
          ["**Imbalanced (99% Legitimate, 1% Fraud)**", "**Trivial Constant Model (predicts all 0)**", "**99.0% Accuracy**", "**Catastrophic failure: catches 0% of fraud transactions**"],
          ["**Medical (99.9% Healthy, 0.1% Cancer)**", "**Trivial Constant Model (predicts all 0)**", "**99.9% Accuracy**", "**Lethal failure: misses every single cancer patient**"],
          ["**Balanced Accuracy Alternative**", "**$\\frac{1}{2}(\\text{Sensitivity} + \\text{Specificity})$**", "**50.0% (Balanced)**", "**Correctly flags the trivial constant model as useless**"]
        ],
        n: "Classification Accuracy is defined as the fraction of predictions " +
          "the model got right: " +
          "$$\\text{Accuracy} = \\frac{\\text{TP} + \\text{TN}}{\\text{TP} + \\text{TN} + \\text{FP} + \\text{FN}}$$ " +
          "While it is the most intuitive metric in machine learning, accuracy " +
          "is notoriously dangerous due to the **Accuracy Paradox**. In any " +
          "dataset exhibiting class skew, a completely useless dummy model " +
          "that unconditionally outputs the majority class achieves an accuracy " +
          "identically equal to the majority class prevalence (e.g. $99.9\\%$ " +
          "in fraud detection). Accuracy commits two fatal conceptual errors: " +
          "(1) **Prevalence Insensitivity**: it treats a correct prediction " +
          "on an abundant negative sample as mathematically equivalent to a " +
          "correct prediction on a rare positive sample; and (2) **Cost " +
          "Symmetry**: it penalizes False Positives and False Negatives equally, " +
          "despite real-world costs being wildly asymmetric (missing cancer " +
          "is lethal; an unnecessary biopsy is an inconvenience). Accuracy " +
          "is strictly valid only when two conditions hold simultaneously: " +
          "**classes are balanced roughly 50/50**, and **misclassification " +
          "costs are symmetric**."
      },

      miss: [
        {
          w: "A model achieving 98% accuracy is high-performing and ready for production.",
          r: "On a dataset where the majority class is 98%, 98% accuracy is the trivial baseline " +
            "score of a broken zero-intelligence model that predicts only the majority class."
        },
        {
          w: "Accuracy can be directly maximized via gradient descent.",
          r: "Accuracy is a non-differentiable step function with zero derivatives almost everywhere; " +
            "models must optimize smooth surrogate loss functions like Cross-Entropy."
        },
        {
          w: "Balanced Accuracy is the exact same thing as standard Accuracy.",
          r: "Balanced Accuracy computes the unweighted average of recall per class, " +
            "preventing majority classes from artificially dominating the performance score."
        },
        {
          w: "Accuracy reveals what types of mistakes the model makes.",
          r: "Accuracy compresses all errors into a single scalar number, completely obscuring " +
            "whether failures are false alarms (Type I) or missed detections (Type II)."
        }
      ],

      trade: {
        buys: [
          "Extremely intuitive and universally understood by non-technical executive stakeholders.",
          "Statistically valid and informative when classes are balanced roughly 50/50.",
          "Fast, trivial calculation requiring zero hyperparameter configuration.",
          "Single scalar summary of overall classification correctness."
        ],
        costs: [
          "Completely deceptive and useless under class imbalance (the Accuracy Paradox).",
          "Blind to asymmetric real-world financial or clinical costs between error types.",
          "Insensitive to predicted probabilistic confidence: treats $p=0.51$ identical to $p=0.99$.",
          "Cannot be used as a differentiable loss function during gradient descent optimization."
        ],
        avoid: [
          "Using accuracy on imbalanced datasets (fraud detection, ad click prediction, disease diagnosis).",
          "Reporting accuracy when False Negative costs vastly exceed False Positive costs.",
          "Comparing models on different datasets using accuracy without verifying class distributions."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "precision",

      why: {
        before: "When an algorithm flagged 1,000 items as suspicious, evaluators had " +
          "no dedicated metric to measure what percentage of those flags were genuine.",
        problem: "In high-cost intervention domains (spam filtering, fraud investigation " +
          "queues, legal search warrants), false alarms (False Positives) waste thousands " +
          "of investigator hours and destroy user confidence.",
        shift: "**Precision (Positive Predictive Value): the purity of positive flags.** " +
          "Compute the ratio of True Positives to all Predicted Positives ($\\frac{\\text{TP}}{\\text{TP} + \\text{FP}}$), " +
          "measuring the probability that a positive prediction is correct in reality."
      },

      num: {
        t: "Precision across operational domains & false positive consequences",
        h: ["Application Domain", "Positive Flag ($\hat{Y}=1$)", "False Positive Consequence", "Operational Precision Mandate"],
        r: [
          ["**Email Spam Filtering**", "**Mark email as Spam**", "**Critical business or hospital email lost in spam folder**", "**Ultra-High (>99.5%): user trust destroyed if legitimate mail blocked**"],
          ["**Fraud Investigation Queue**", "**Flag transaction for manual review**", "**Investigator spends 20 minutes reviewing benign user**", "**High (>80%): prevents queue overflow and operational burnout**"],
          ["**Copyright Content Takedown**", "**Block YouTube video for infringement**", "**Wrongful takedown of fair-use creator content; PR backlash**", "**Very High: requires high legal certainty before action**"],
          ["**Autonomous Braking**", "**Trigger emergency vehicle brake**", "**Vehicle brakes at 70 mph on empty highway (phantom braking)**", "**Extremely High: false activation causes fatal rear-end collisions**"]
        ],
        n: "Precision (known in biostatistics as **Positive Predictive Value / " +
          "PPV**) answers the critical question: *'When the model predicts " +
          "positive, how often is it actually right?'*. Mathematically: " +
          "$$\\text{Precision} = \\frac{\\text{TP}}{\\text{TP} + \\text{FP}}$$ " +
          "In probability theory, Precision is the empirical estimate of " +
          "the conditional probability $P(Y=1 | \\hat{Y}=1)$. Precision is " +
          "the primary metric to optimize whenever the **cost of a False " +
          "Positive (Type I Error) is severe**. In spam detection, a false " +
          "positive sends a vital contract to the junk folder; in automated " +
          "content moderation, it bans legitimate users. Crucially, Precision " +
          "can be **trivially manipulated by raising the classification " +
          "threshold $\\tau$**: if a model is evaluated across 10,000 cases " +
          "and only flags the single single case it is 99.99% certain about, " +
          "its Precision is a perfect **100% (1.0)**, despite missing thousands " +
          "of other genuine cases (catastrophic Recall). Precision must " +
          "therefore never be reported in isolation; it must always be " +
          "paired with **Recall** or summarized via the **F1-Score**."
      },

      miss: [
        {
          w: "100% precision means the model detected all positive cases in the dataset.",
          r: "100% precision only means that of the cases the model chose to flag, all were correct. " +
            "It may have flagged only 1 case and missed 99% of actual positive events."
        },
        {
          w: "Precision and Accuracy mean the same thing in machine learning.",
          r: "Accuracy evaluates total correct predictions out of all samples. " +
            "Precision evaluates true positive cases strictly out of all *predicted positive* flags."
        },
        {
          w: "Precision penalizes false negatives (missed cases).",
          r: "The Precision formula $\\frac{\\text{TP}}{\\text{TP} + \\text{FP}}$ contains zero " +
            "terms for False Negatives; missing true positive cases has zero mathematical impact on precision."
        },
        {
          w: "Precision is independent of the classification decision threshold.",
          r: "Raising the decision threshold $\\tau$ increases precision (fewer, higher-confidence flags) " +
            "while lowering recall; lowering $\\tau$ degrades precision."
        }
      ],

      trade: {
        buys: [
          "Directly measures the reliability, trustworthiness, and purity of positive alerts.",
          "Protects operational teams from alert fatigue and wasted investigative resources.",
          "Prevents costly, disruptive false alarms in high-intervention systems (spam, phantom braking).",
          "Provides a key coordinate for Precision-Recall curve analysis."
        ],
        costs: [
          "Completely blind to False Negatives (missed detections).",
          "Can be artificially gamed by raising decision thresholds to extreme conservative levels.",
          "Sensitive to class prevalence: in rare-event data, even low false alarm rates degrade precision.",
          "Cannot serve as a sole optimization objective without a recall constraint."
        ],
        avoid: [
          "Reporting precision in isolation without accompanying recall metrics.",
          "Optimizing precision exclusively in life-safety domains where missed cases are catastrophic.",
          "Assuming high precision implies high detection coverage across the population."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "recall",

      why: {
        before: "Evaluators had no dedicated metric to quantify what fraction of " +
          "actual positive real-world events an algorithm succeeded in capturing.",
        problem: "In safety-critical or defensive domains (cancer screening, cybersecurity " +
          "intrusion detection, fraud prevention), missing a true positive (False Negative) " +
          "causes catastrophic, irreversible real-world damage.",
        shift: "**Recall (Sensitivity / True Positive Rate): the capture rate of positive reality.** " +
          "Compute the ratio of True Positives to all Actual Positives ($\\frac{\\text{TP}}{\\text{TP} + \\text{FN}}$), " +
          "measuring the probability that an actual real-world positive case is successfully detected."
      },

      num: {
        t: "Recall across high-stakes operational domains & false negative costs",
        h: ["Domain / Application", "Positive Target ($Y=1$)", "False Negative (Miss) Consequence", "Operational Recall Mandate"],
        r: [
          ["**Oncology Screening**", "**Malignant tumor present**", "**Patient sent home undiagnosed; cancer metastasizes fatally**", "**Near 100%: missed diagnosis is fatal; false alarms handled by biopsy**"],
          ["**Cybersecurity Intrusion**", "**Ransomware payload executing**", "**Entire corporate network encrypted; millions in extortion**", "**Ultra-High (>99%): must intercept attack before lateral movement**"],
          ["**Airport Security Screening**", "**Weapon in passenger luggage**", "**Armed individual boards commercial aircraft**", "**Absolute 100%: zero tolerance for false negatives**"],
          ["**Autonomous Collision Avoidance**", "**Pedestrian crossing street**", "**Vehicle strikes pedestrian at speed**", "**Maximum possible recall: life-safety mandate**"]
        ],
        n: "Recall (known in epidemiology as **Sensitivity** and in signal " +
          "processing as the **True Positive Rate / TPR**) answers the " +
          "foundational safety question: *'Out of all the actual positive " +
          "cases in reality, what percentage did the model successfully catch?'*. " +
          "Mathematically: " +
          "$$\\text{Recall} = \\frac{\\text{TP}}{\\text{TP} + \\text{FN}}$$ " +
          "In probability theory, Recall estimates the conditional probability " +
          "$P(\\hat{Y}=1 | Y=1)$. Recall is the supreme metric to maximize " +
          "whenever the **cost of a False Negative (Type II Error) is " +
          "catastrophic**. In medical diagnostics, an algorithm with 99% " +
          "precision but 40% recall is unacceptable: it leaves 60% of cancer " +
          "patients to die without treatment. Conversely, a model with 99% " +
          "recall catches almost every tumor, while its false alarms are " +
          "safely triaged by secondary clinical tests. However, Recall can " +
          "be **trivially gamed by lowering the decision threshold $\\tau \\to 0$**: " +
          "if an algorithm predicts positive for every single patient in " +
          "the hospital, its Recall is a perfect **100% (1.0)**, but its " +
          "Precision collapses to near zero, creating unmanageable panic " +
          "and queue collapse. Engineering excellence requires balancing " +
          "Recall against Precision."
      },

      miss: [
        {
          w: "100% recall proves the model is exceptionally skilled and accurate.",
          r: "Predicting positive for every single sample yields 100% recall, while rendering " +
            "the model completely useless due to massive false alarms."
        },
        {
          w: "Recall and Precision can easily be maximized to 100% simultaneously.",
          r: "Precision and Recall exist in an unavoidable mathematical trade-off; increasing " +
            "one almost always requires sacrificing the other unless the underlying model architecture is fundamentally improved."
        },
        {
          w: "Recall penalizes false alarms (False Positives).",
          r: "The Recall formula $\\frac{\\text{TP}}{\\text{TP} + \\text{FN}}$ contains zero terms " +
            "for False Positives; generating a million false alarms has zero mathematical impact on recall."
        },
        {
          w: "High recall ensures that flagged cases are trustworthy.",
          r: "High recall models often have low precision, meaning the majority of flagged " +
            "instances are false alarms that require secondary human verification."
        }
      ],

      trade: {
        buys: [
          "Directly measures detection thoroughness and population coverage.",
          "Guarantees that life-critical threats, rare diseases, and security breaches are not missed.",
          "The non-negotiable optimization target for defensive and safety-critical machine learning.",
          "Serves as the Y-axis coordinate for both ROC and Precision-Recall curves."
        ],
        costs: [
          "Completely blind to False Positives and operational false alarm costs.",
          "Can trigger severe alert fatigue and human operator burnout if precision collapses.",
          "Trivially gamed by setting ultralow classification decision thresholds.",
          "Cannot serve as an isolated optimization objective without a precision constraint."
        ],
        avoid: [
          "Reporting recall in isolation without accompanying precision metrics.",
          "Optimizing recall exclusively without verifying that operational triage teams can handle the alert volume.",
          "Lowering decision thresholds to chase recall without evaluating business costs."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "f1-score",

      why: {
        before: "Engineers faced the unavoidable Precision-Recall trade-off, struggling " +
          "to compare models when Model A had 90% Precision / 50% Recall, and Model B had 70% Precision / 85% Recall.",
        problem: "Taking the arithmetic mean ($\\frac{P + R}{2}$) is deceptive: a dummy " +
          "model predicting positive universally achieves 100% Recall and 1% Precision, " +
          "yet its arithmetic mean is 50.5%, disguising its total failure.",
        shift: "**The F1-Score: the harmonic mean of Precision and Recall.** " +
          "Compute $2 \\times \\frac{\\text{Precision} \\times \\text{Recall}}{\\text{Precision} + \\text{Recall}}$, " +
          "heavily penalizing extreme imbalances and rewarding models that maintain both high purity and high coverage."
      },

      num: {
        t: "Arithmetic Mean vs Harmonic Mean (F1-Score) across model scenarios",
        h: ["Model Scenario", "Precision ($P$)", "Recall ($R$)", "Arithmetic Mean", "F1-Score (Harmonic Mean)"],
        r: [
          ["**Balanced High Performer**", "**0.80 (80%)**", "**0.80 (80%)**", "**80.0%**", "**0.800 (80.0%)**"],
          ["**Moderate Imbalance**", "**0.90 (90%)**", "**0.40 (40%)**", "**65.0%**", "**0.554 (55.4%)**"],
          ["**Severe Imbalance**", "**0.95 (95%)**", "**0.10 (10%)**", "**52.5%**", "**0.181 (18.1%)**"],
          ["**Broken Dummy (Flags All)**", "**0.01 (1%)**", "**1.00 (100%)**", "**50.5% (Misleading)**", "**0.0198 (1.98% - True reflection)**"],
          ["**$F_2$ Score (Recall weighted 2x)**", "**0.70 (70%)**", "**0.90 (90%)**", "**—**", "**0.851 ($F_2$ prioritizes recall)**"]
        ],
        n: "The F1-Score is the definitive single-scalar benchmark balancing " +
          "Precision and Recall. Mathematically, it is the **Harmonic Mean** " +
          "of Precision and Recall: " +
          "$$F_1 = \\frac{2}{\\frac{1}{P} + \\frac{1}{R}} = 2 \\cdot \\frac{P \\cdot R}{P + R} = \\frac{2\\text{TP}}{2\\text{TP} + \\text{FP} + \\text{FN}}$$ " +
          "The harmonic mean has a profound mathematical property: **it is " +
          "dominated by the minimum of the two arguments**. If either Precision " +
          "or Recall collapses toward zero, the $F_1$ score plummets to near " +
          "zero, ruthlessly exposing models that cheat by predicting all " +
          "positives or only one ultra-conservative positive. When business " +
          "economics dictate that one metric is more valuable than the other, " +
          "engineers employ the generalized **$F_\\beta$ Score**: " +
          "$$F_\\beta = (1 + \\beta^2) \\frac{P \\cdot R}{\\beta^2 P + R}$$ " +
          "Setting $\\beta = 2$ ($F_2$) weights Recall twice as heavily as " +
          "Precision (ideal for medical diagnostics); setting $\\beta = 0.5$ " +
          "($F_{0.5}$) weights Precision twice as heavily as Recall (ideal " +
          "for customer-facing notifications). In multi-class problems, " +
          "**Macro-F1** computes the unweighted average of F1 across all classes " +
          "(protecting minority classes), whereas **Micro-F1** aggregates " +
          "global TPs and FPs."
      },

      miss: [
        {
          w: "The F1-score accounts for True Negatives.",
          r: "The F1 formula contains only TP, FP, and FN. True Negatives have zero mathematical " +
            "impact on F1, which is precisely why F1 is superior for imbalanced datasets."
        },
        {
          w: "The F1-score is universally the best metric for all classification problems.",
          r: "F1 weights Precision and Recall equally. When business costs between false alarms " +
            "and missed detections are highly asymmetric, the generalized $F_\\beta$ score is required."
        },
        {
          w: "Macro-F1 and Weighted-F1 are virtually identical.",
          r: "Weighted-F1 weights classes by sample frequency, allowing majority classes to dominate. " +
            "Macro-F1 weights all classes equally, exposing poor performance on rare minority classes."
        },
        {
          w: "An F1-score of 0.85 means the model is 85% accurate.",
          r: "F1 is the harmonic mean of precision and recall. It is a balance score, " +
            "not a percentage of correct overall predictions."
        }
      ],

      trade: {
        buys: [
          "Provides a single, balanced scalar metric summarizing the Precision-Recall trade-off.",
          "Heavily punishes extreme imbalances where an algorithm sacrifices precision for recall or vice versa.",
          "Immune to the distorting effects of massive True Negative counts in imbalanced datasets.",
          "Generalized $F_\\beta$ allows tuning the balance to reflect specific business priorities."
        ],
        costs: [
          "Treats Precision and Recall with equal 50/50 importance by default (unlike real business costs).",
          "Threshold-dependent: evaluated at a single arbitrary classification decision threshold.",
          "Does not capture probabilistic calibration or confidence scores.",
          "Can obscure whether a model needs more precision or more recall without inspecting components."
        ],
        avoid: [
          "Using standard F1 when business costs are deeply asymmetric (use $F_\\beta$ instead).",
          "Relying on Weighted-F1 in imbalanced datasets (it hides poor minority class performance).",
          "Optimizing F1 without verifying whether the resulting operational threshold is sustainable."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "roc-curve",

      why: {
        before: "Classification models were evaluated at a single arbitrary decision " +
          "threshold (like $\\tau = 0.5$), blinding engineers to how the model would perform " +
          "under different operational risk tolerances.",
        problem: "A model that looks mediocre at threshold 0.5 might be extraordinary " +
          "at threshold 0.1; single-threshold evaluations provide zero visibility into a " +
          "model's intrinsic discriminative ranking ability.",
        shift: "**The Receiver Operating Characteristic (ROC) Curve: visual trade-off frontier.** " +
          "Plot the True Positive Rate (Recall) against the False Positive Rate (1 - Specificity) " +
          "across all possible decision thresholds $\\tau \\in [0, 1]$, visualizing the complete diagnostic trade-off."
      },

      num: {
        t: "ROC curve coordinate anatomy & threshold trajectory",
        h: ["Threshold Operating Point", "Coordinate $(x, y)$", "Mathematical State", "Real-World Interpretation"],
        r: [
          ["**$\\tau \\to 1.0$ (Ultra-conservative)**", "**$(0, 0)$ (Bottom-Left)**", "**$\\text{FPR} = 0, \\text{TPR} = 0$**", "**Predicts all negative; zero false alarms, zero detections**"],
          ["**Intermediate Threshold $\\tau$**", "**$(x, y)$ along curve**", "**Trade-off between FPR and TPR**", "**Standard operational deployment point**"],
          ["**$\\tau \\to 0.0$ (Ultra-aggressive)**", "**$(1, 1)$ (Top-Right)**", "**$\\text{FPR} = 1, \\text{TPR} = 1$**", "**Predicts all positive; catches all events, 100% false alarms**"],
          ["**Random Guessing Diagonal**", "**Line $y = x$**", "**$\\text{TPR} = \\text{FPR}$**", "**Zero discriminative capability (coin toss)**"],
          ["**Perfect Classifier Corner**", "**$(0, 1)$ (Top-Left)**", "**$\\text{FPR} = 0, \\text{TPR} = 1$**", "**100% detection rate with zero false alarms**"]
        ],
        n: "The Receiver Operating Characteristic (ROC) curve originated in " +
          "radar signal detection theory during World War II (distinguishing " +
          "incoming aircraft from noisy radar clutter) and is now a cornerstone " +
          "of machine learning evaluation. The curve is parametric, plotting " +
          "two rates across all possible decision thresholds $\\tau \\in [0, 1]$: " +
          "$$\\text{Y-axis: True Positive Rate (Sensitivity / Recall)} = \\frac{\\text{TP}}{\\text{TP} + \\text{FN}}$$ " +
          "$$\\text{X-axis: False Positive Rate (1 - Specificity)} = \\frac{\\text{FP}}{\\text{FP} + \\text{TN}}$$ " +
          "As threshold $\\tau$ decreases from $1.0$ to $0.0$, the coordinate " +
          "traces a trajectory from $(0, 0)$ to $(1, 1)$. The closer the " +
          "curve arches toward the top-left corner $(0, 1)$, the superior " +
          "the classifier. Crucially, because TPR is calculated strictly " +
          "within the positive class column of the confusion matrix, and " +
          "FPR is calculated strictly within the negative class column, **the " +
          "ROC curve is mathematically invariant to shifts in class prevalence**. " +
          "If the test set ratio shifts from 50/50 to 90/10, the ROC curve " +
          "remains completely unchanged. However, this invariance is also " +
          "its greatest weakness: on **extreme class imbalance (e.g. 1:10,000)**, " +
          "a tiny False Positive Rate of 1% represents 100 false alarms for " +
          "every 1 true positive, which the ROC curve masks behind a deceptive " +
          "near-perfect visual curve."
      },

      miss: [
        {
          w: "The ROC curve is ideal for evaluating models with extreme class imbalance.",
          r: "When negatives heavily outnumber positives (e.g. 10,000 to 1), the FPR denominator " +
            "is massive, keeping FPR tiny even when thousands of false alarms occur. **Precision-Recall curves are mandatory.**"
        },
        {
          w: "The optimal operating point on a ROC curve is always the top-left point closest to (0, 1).",
          r: "The optimal threshold depends on the business cost ratio between False Positives " +
            "and False Negatives. In asymmetric domains, the optimal point shifts along the curve."
        },
        {
          w: "ROC curves evaluate discrete binary label predictions.",
          r: "ROC curves require continuous predicted probabilities or uncalibrated ranking scores " +
            "to sweep the decision threshold $\\tau$ continuously from 1 to 0."
        },
        {
          w: "If Model A has a higher AUC than Model B, Model A is better at every threshold.",
          r: "ROC curves frequently cross. Model A may dominate at low False Positive Rates, " +
            "while Model B dominates at high True Positive Rates."
        }
      ],

      trade: {
        buys: [
          "Evaluates a classifier's intrinsic discriminative ranking ability independent of threshold.",
          "Completely invariant to shifts in target class distribution and prevalence.",
          "Visualizes the complete operational trade-off frontier between sensitivity and specificity.",
          "Allows stakeholders to select operating thresholds based on specific business risk tolerances."
        ],
        costs: [
          "Deceptive under extreme class imbalance: masks massive false alarm counts behind tiny FPRs.",
          "Requires continuous output probabilities or ranking scores rather than discrete classes.",
          "Visual curves cannot be directly optimized inside an automated hyperparameter search loop.",
          "Does not reflect real-world positive predictive precision."
        ],
        avoid: [
          "Using ROC curves for extreme class imbalance problems (fraud detection, rare disease screening).",
          "Selecting operating thresholds based on geometric heuristics without considering business costs.",
          "Assuming high ROC curves imply clean, actionable precision in production."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "auc",

      why: {
        before: "Comparing candidate models using ROC curves required visual inspection " +
          "of overlapping plots, lacking an objective single scalar metric for automated pipelines.",
        problem: "Automated hyperparameter tuning, model registries, and CI/CD pipelines " +
          "require a standardized, reproducible single numerical score to rank models.",
        shift: "**Area Under the ROC Curve (AUC / ROC-AUC): the integral of discrimination.** " +
          "Compute the definite integral of the ROC curve from $0$ to $1$, yielding a standardized " +
          "scalar score measuring the probability that a classifier ranks a random positive sample higher than a random negative sample."
      },

      num: {
        t: "AUC performance tiers & probabilistic interpretation",
        h: ["ROC-AUC Score Range", "Discriminative Tier", "Probabilistic Ranking Interpretation", "Production Viability"],
        r: [
          ["**1.00**", "**Perfect Discrimination**", "**100% probability of ranking positive higher than negative**", "**Usually indicates target data leakage**"],
          ["**0.90 – 0.99**", "**Outstanding Discrimination**", "**90%–99% probability of correct pairwise ranking**", "**Production-ready high-performance model**"],
          ["**0.80 – 0.89**", "**Excellent / Good**", "**80%–89% probability of correct pairwise ranking**", "**Standard enterprise production benchmark**"],
          ["**0.70 – 0.79**", "**Fair / Acceptable**", "**70%–79% probability of correct pairwise ranking**", "**Viable baseline; requires feature tuning**"],
          ["**0.50**", "**Random Guessing**", "**50% probability (equivalent to random coin toss)**", "**Zero predictive signal; model is completely useless**"],
          ["**< 0.50**", "**Inverted Discrimination**", "**Model predicts opposite of truth**", "**Reverse predictions to achieve $1 - \\text{AUC}$**"]
        ],
        n: "Area Under the ROC Curve (AUC or ROC-AUC) is the definitive " +
          "threshold-independent performance metric for binary classification. " +
          "Mathematically, AUC is the definite integral of the ROC curve: " +
          "$$\\text{AUC} = \\int_0^1 \\text{TPR}(\\text{FPR}) \\, d(\\text{FPR})$$ " +
          "Beyond geometry, AUC possesses a profound probabilistic theorem: " +
          "**AUC is mathematically identical to the probability that a " +
          "randomly chosen positive instance will receive a higher predicted " +
          "score than a randomly chosen negative instance**: " +
          "$$\\text{AUC} = P(\\hat{s}(\\mathbf{x}^+) > \\hat{s}(\\mathbf{x}^-))$$ " +
          "This establishes an equivalence between AUC and the non-parametric " +
          "**Wilcoxon-Mann-Whitney U statistic**. AUC evaluates pure **ranking " +
          "skill**: it is completely invariant to monotonic transformations " +
          "of scores and uncalibrated probabilities. A model that predicts " +
          "probabilities $[0.51, 0.52]$ achieves the exact same perfect AUC " +
          "of $1.0$ as a model that predicts $[0.01, 0.99]$, provided the " +
          "positive instance is ranked higher. However, because AUC integrates " +
          "over all thresholds—including clinically absurd thresholds where " +
          "$\\text{FPR} = 0.9$—a model with a higher total AUC can actually " +
          "be inferior in the narrow, low-FPR operating window required by business."
      },

      miss: [
        {
          w: "An AUC of 0.90 guarantees that a model will be accurate at threshold 0.5.",
          r: "AUC measures ranking ability across all thresholds. If probabilities are uncalibrated, " +
            "a model can achieve an AUC of 0.90 while performing terribly at $\\tau = 0.5$."
        },
        {
          w: "An AUC below 0.5 means the algorithm completely failed.",
          r: "An AUC of 0.10 means the model learned an excellent representation but inverted " +
            "the class labels; simply flipping predictions yields a stellar AUC of 0.90."
        },
        {
          w: "ROC-AUC is reliable for evaluating rare-event fraud detection.",
          r: "ROC-AUC can remain deceptively high (e.g. 0.98) in extreme fraud scenarios where " +
            "thousands of false alarms occur; **PR-AUC (Average Precision)** is mandatory."
        },
        {
          w: "AUC measures how well a model's predicted probabilities match true probabilities.",
          r: "AUC is purely a ranking metric invariant to calibration; measuring probability " +
            "fidelity requires Brier Score, Log Loss, or calibration curves."
        }
      ],

      trade: {
        buys: [
          "Single, standardized scalar score evaluating overall discriminative ranking power.",
          "Completely threshold-independent: evaluates model capability without picking a threshold.",
          "Invariant to monotonic score scalings and target class prevalence shifts.",
          "Clear probabilistic interpretation via the Wilcoxon-Mann-Whitney U test."
        ],
        costs: [
          "Integrates over clinically irrelevant threshold regions (e.g. FPR > 50%).",
          "Deceptively optimistic under severe class imbalance.",
          "Insensitive to probability calibration (well-ranked uncalibrated scores achieve high AUC).",
          "Cannot tell practitioners what threshold to select for production deployment."
        ],
        avoid: [
          "Using ROC-AUC as the sole evaluation metric on extreme 1:1,000 imbalanced datasets.",
          "Deploying models into production based on AUC without selecting and testing an operating threshold.",
          "Assuming a high AUC implies calibrated probability outputs."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "precision-recall-curve",

      why: {
        before: "Practitioners used ROC curves for all classification problems, " +
          "including fraud detection, cybersecurity intrusion, and rare disease diagnosis.",
        problem: "Under extreme class imbalance (1 positive per 10,000 negatives), " +
          "the massive True Negative count keeps the False Positive Rate tiny, causing " +
          "ROC curves to look deceptively near-perfect while the system generates thousands of false alarms.",
        shift: "**The Precision-Recall (PR) Curve: the honest mirror of imbalanced classification.** " +
          "Plot Precision against Recall across all decision thresholds, focusing exclusively " +
          "on the positive minority class and ruthlessly exposing false alarms."
      },

      num: {
        t: "ROC Curve vs Precision-Recall Curve under extreme class imbalance",
        h: ["Evaluation Dimension", "ROC Curve ($\text{TPR}$ vs $\text{FPR}$)", "Precision-Recall Curve ($P$ vs $R$)"],
        r: [
          ["**Baseline (Random Guessing)**", "**Diagonal line $y = x$ ($\\text{AUC} = 0.50$)**", "**Horizontal line at class prevalence ($y = P / (P+N)$)**"],
          ["**Impact of 10,000 False Alarms**", "**Negligible: swallowed by massive True Negative count**", "**Catastrophic: causes Precision to plummet toward zero**"],
          ["**Invariance to Class Skew**", "**Completely invariant to class balance shifts**", "**Directly reflects real-world operational prevalence**"],
          ["**Area Under Curve Summary**", "**ROC-AUC (Integral of ROC)**", "**PR-AUC / Average Precision (AP)**"],
          ["**Optimal Application Domain**", "**Balanced datasets; medical screening specificity**", "**Extreme class imbalance: fraud, ad click, search ranking**"]
        ],
        n: "The Precision-Recall (PR) Curve is the non-negotiable gold standard " +
          "evaluation framework for imbalanced machine learning. It plots " +
          "**Precision (Y-axis)** against **Recall (X-axis)** as the classification " +
          "decision threshold $\\tau$ is swept from $1.0$ down to $0.0$. " +
          "The critical mathematical distinction between ROC and PR lies in " +
          "the **absence of True Negatives ($\text{TN}$)** in the PR formulation: " +
          "$$\\text{Precision} = \\frac{\\text{TP}}{\\text{TP} + \\text{FP}}, \\quad \\text{Recall} = \\frac{\\text{TP}}{\\text{TP} + \\text{FN}}$$ " +
          "In a credit card fraud dataset with 1,000,000 legitimate transactions " +
          "and 100 fraudulent transactions, generating 5,000 false alarms " +
          "yields a False Positive Rate of only $5,000 / 1,000,000 = 0.5\\%$, " +
          "producing a dazzling ROC-AUC of **0.98**. However, the Precision " +
          "is $100 / (100 + 5,000) = 1.96\\%$—meaning **98% of flagged alerts " +
          "are false alarms**! The PR curve exposes this operational disaster " +
          "instantly, with the curve collapsing toward zero. The summary " +
          "scalar **PR-AUC (Average Precision / AP)** computes the area under " +
          "the PR curve: " +
          "$$\\text{AP} = \\sum_k (R_k - R_{k-1}) P_k$$ " +
          "Unlike ROC where random guessing yields $0.5$, random guessing on " +
          "a PR curve yields an AP equal to the **positive class prevalence** " +
          "(e.g. $0.0001$), providing a brutally honest assessment of predictive skill."
      },

      miss: [
        {
          w: "A random classifier achieves a PR-AUC of 0.5 like in ROC.",
          r: "Random guessing on a PR curve yields an AUC equal to positive class prevalence " +
            "$\\frac{P}{P+N}$, which can be $0.001$ in fraud or $0.0001$ in rare disease screening."
        },
        {
          w: "The PR curve is always a smooth monotonically decreasing line.",
          r: "Unlike ROC curves which are strictly monotonic, PR curves can zig-zag " +
            "because precision can fluctuate as threshold changes alter TP and FP counts unevenly."
        },
        {
          w: "A model with a higher ROC-AUC always has a higher PR-AUC.",
          r: "ROC-AUC and PR-AUC frequently disagree. Model A can dominate ROC-AUC by rejecting " +
            "easy negatives, while Model B dominates PR-AUC by maintaining higher precision on top alerts."
        },
        {
          w: "PR curves are always superior to ROC curves for all machine learning tasks.",
          r: "On balanced datasets, ROC curves provide superior diagnostic visibility into True Negative " +
            "specificity; PR curves are specifically engineered for imbalanced domains."
        }
      ],

      trade: {
        buys: [
          "Ruthlessly exposes false alarm rates in imbalanced datasets without being masked by TNs.",
          "Directly reflects real-world user experience and investigator queue capacity.",
          "Average Precision (PR-AUC) provides a statistically rigorous benchmark for ranking systems.",
          "The essential evaluation tool for fraud detection, ad tech, search engines, and cybersecurity."
        ],
        costs: [
          "Baseline score depends directly on class prevalence, preventing comparison across different datasets.",
          "Curves can be non-monotonic and noisy due to discrete precision fluctuations.",
          "Does not reward or evaluate correct rejection of negative samples (True Negatives).",
          "Visual curves require more statistical sophistication to interpret than ROC curves."
        ],
        avoid: [
          "Using ROC curves instead of PR curves on extreme 1:1,000 imbalanced datasets.",
          "Comparing PR-AUC scores across datasets with different positive class prevalence rates.",
          "Using PR curves on balanced 50/50 datasets where ROC curves provide cleaner specificity analysis."
        ]
      }
    }

  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
