/* ==========================================================================
   Depth pass 80 — Deep Learning batch 8: core software frameworks & Word2Vec.
   TensorFlow, Keras, NumPy, Word2Vec.

   Strided C-buffers form universal numerical substrates; multi-backend APIs
   orchestrate production graphs; self-supervised skip-grams embed semantic manifolds.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "tensorflow",

      why: {
        before: "First-generation deep learning toolkits (Caffe, Theano, Torch7) struggled with " +
          "heterogeneous distributed deployment across massive datacenter clusters and mobile embedded devices.",
        problem: "Enterprise scale demands a unified system that seamlessly distributes execution across heterogeneous hardware " +
          "(CPUs, GPUs, TPUs), serializes self-contained execution graphs without Python dependencies, and serves microsecond web requests.",
        shift: "**TensorFlow (Google Brain 2015, Abadi et al.): Production-grade distributed dataflow computation.** " +
          "Express computation as a distributed dataflow graph, enabling automated device placement, XLA compilation, " +
          "and self-contained `SavedModel` serialization for robust enterprise serving via TF Serving and TFLite."
      },

      num: {
        t: "TensorFlow architectural evolution & deployment subsystem comparison",
        h: ["Component / Subsystem", "Technical Architecture", "Primary Operational Role"],
        r: [
          ["**TensorFlow 1.x**", "Static Declarative Graph (`tf.Graph` + `tf.Session`)", "Strict separation of graph compilation from execution; difficult to debug"],
          ["**TensorFlow 2.x**", "Eager Execution by default + `@tf.function` AutoGraph", "Pythonic imperative development with optional graph compilation via AutoGraph"],
          ["**XLA (Accelerated Linear Algebra)**", "Domain-specific optimizing compiler", "Fuses operations, eliminates intermediate buffers, generates specialized TPU/GPU machine code"],
          ["**SavedModel Format**", "Language-neutral serialized protocol buffer", "**Zero Python dependency**: self-contained graph deployed via C++ runtimes"],
          ["**TF Serving & TFLite**", "High-throughput C++ server & quantized mobile engine", "Serves billions of real-time queries/sec on Google servers & Android phones"]
        ],
        n: "TensorFlow was developed by the Google Brain team and released in 2015 " +
          "as the successor to DistBelief. Designed primarily with massive-scale industrial " +
          "infrastructure in mind, TensorFlow abstracts computation into a **distributed " +
          "dataflow graph** where operations (kernels) are assigned dynamically to target " +
          "devices (CPU threads, GPU CUDA streams, or Google Cloud TPU cores). " +
          "While **TensorFlow 1.x** enforced a rigid declarative 'define-and-run' paradigm " +
          "that required executing graphs inside a `tf.Session()`, **TensorFlow 2.0** integrated " +
          "imperative Eager Execution and made **Keras** the default high-level modeling API. " +
          "A foundational technological triumph of TensorFlow is the **`SavedModel` format**: " +
          "it serializes the complete computational graph, trained parameter weights, and execution " +
          "signatures into a language-agnostic protocol buffer. This allows a model developed in " +
          "Python to be deployed directly into a hardened, high-throughput **C++ runtime " +
          "(TF Serving)** or converted via **TensorFlow Lite (TFLite)** into flatbuffer binaries " +
          "running directly on edge microcontrollers and mobile NPUs without a Python interpreter."
      },

      miss: [
        {
          w: "TensorFlow 2 still requires creating a `tf.Session()` to run operations.",
          r: "`tf.Session` was completely eliminated in TensorFlow 2.0. TF 2 operates imperatively with eager execution by default, behaving identically to standard Python and PyTorch."
        },
        {
          w: "PyTorch has completely eliminated TensorFlow from all commercial use.",
          r: "While PyTorch dominates academic research, TensorFlow remains deeply entrenched across massive global enterprise production pipelines, Google Cloud TPU deployments, and hundreds of millions of Android edge devices via TFLite."
        },
        {
          w: "The `@tf.function` decorator only speeds up code by a tiny fraction.",
          r: "`@tf.function` traces Python code into a high-performance static computational graph using AutoGraph and XLA, frequently delivering 2x to 5x throughput speedups over pure eager execution."
        },
        {
          w: "TensorFlow can only be used on Google Cloud TPUs.",
          r: "TensorFlow runs across all major hardware backends: multi-GPU Nvidia clusters via cuDNN, Intel CPUs via oneDNN, Apple Silicon via Metal (MPS), and Qualcomm mobile NPUs."
        }
      ],

      trade: {
        buys: [
          "Enterprise production superiority: `SavedModel` enables C++ deployments with zero Python runtime overhead.",
          "Native Google TPU hardware acceleration via XLA domain-specific linear algebra compilation.",
          "Comprehensive end-to-end ecosystem: TF Serving, TFLite, TF.js, and TensorBoard visualization suite."
        ],
        costs: [
          "Historic API fragmentation: technical debt and legacy code discrepancies between TF 1.x and TF 2.x.",
          "Steeper debugging curve when transitioning between eager execution and `@tf.function` AutoGraph tracing.",
          "Significantly lower adoption in cutting-edge academic open-source LLM research compared to PyTorch."
        ],
        avoid: [
          "Writing legacy TF 1.x session-based code (`tf.Session`, `tf.placeholder`) in modern projects.",
          "Deploying raw Python inference loops in high-scale enterprise production without testing TF Serving or TFLite."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "keras",

      why: {
        before: "Building neural networks required writing verbose, error-prone boilerplate " +
          "manually managing tensor allocations, variable scoping, and low-level computational execution graphs.",
        problem: "Machine learning practitioners needed an intuitive, high-level ergonomic API that prioritized " +
          "human developer experience and rapid experimentation without sacrificing low-level flexibility.",
        shift: "**Keras (François Chollet 2015, Keras 3): User-centric deep learning API with multi-backend orchestration.** " +
          "Standardize neural network architecture into high-level declarative abstractions (Sequential, Functional, Subclassing) " +
          "while providing native interoperability across JAX, PyTorch, and TensorFlow backends."
      },

      num: {
        t: "Keras design API paradigms & Keras 3 multi-backend engine",
        h: ["API Paradigm / Feature", "Syntax Style", "Flexibility vs Safety", "Ideal Application Domain"],
        r: [
          ["**Sequential API**", "`keras.Sequential([Dense(64), Dense(10)])`", "High safety, simple; strictly single-input single-output stacks", "Beginner prototypes, simple feedforward classifiers"],
          ["**Functional API**", "`y = Dense(10)(Dense(64)(x))`", "**Optimal balance**: supports multi-input, multi-output, residual DAGs", "ResNets, multi-task learning, complex non-linear graphs"],
          ["**Model Subclassing**", "`class MyModel(keras.Model): def call(...)`", "**Infinite flexibility**: full imperative dynamic Python control", "Custom attention mechanisms, research architectures"],
          ["**Keras 3 Multi-Backend**", "`os.environ['KERAS_BACKEND'] = 'torch' / 'jax' / 'tensorflow'`", "**Write once, run anywhere**: identical code runs on all 3 engines", "Cross-framework library authoring, zero framework lock-in"]
        ],
        n: "Keras was created in 2015 by Google engineer François Chollet with " +
          "the core design principle of **Progressive Disclosure of Complexity**: " +
          "easy things should be simple and intuitive, while complex things should be possible. " +
          "Keras eliminated the impenetrable boilerplate of early deep learning by introducing " +
          "clean layer abstractions (`keras.layers.Dense`, `Conv2D`, `Dropout`) and the iconic " +
          "`model.compile()` and `model.fit()` lifecycle workflow. " +
          "Keras offers three distinct API tiers: (1) **Sequential API** for linear layer stacks, " +
          "(2) **Functional API** for arbitrary directed acyclic graphs with multiple inputs/outputs " +
          "and residual skip connections, and (3) **Model Subclassing** for completely imperative, " +
          "dynamic forward logic. With the release of **Keras 3**, the framework underwent an " +
          "architectural renaissance: it became a completely framework-agnostic engine that runs " +
          "seamlessly on top of **JAX, PyTorch, or TensorFlow**. A model written in Keras 3 can " +
          "be trained on GPUs using PyTorch, deployed in C++ via TensorFlow Serving, or compiled " +
          "for ultra-high-speed TPU execution using JAX with zero code modifications."
      },

      miss: [
        {
          w: "Keras is just a toy framework for beginners and cannot be used for serious deep learning.",
          r: "Keras powers high-stakes enterprise systems at YouTube, Waymo, and CERN. Its subclassing API provides the exact same low-level mathematical control as native PyTorch."
        },
        {
          w: "Keras is permanently locked to TensorFlow.",
          r: "Keras 3 is completely decoupled from TensorFlow: you can run Keras natively on PyTorch or JAX without ever importing or installing TensorFlow."
        },
        {
          w: "The Sequential API can build arbitrary architectures like ResNet with skip connections.",
          r: "The Sequential API strictly enforces a linear, single-stream layer sequence. Skip connections, branching paths, and multi-input topologies require the Functional API or Model Subclassing."
        },
        {
          w: "Calling `model.fit()` hides training details so you cannot customize the training loop.",
          r: "Keras allows overriding `train_step()` within Model Subclassing, providing complete, fine-grained control over gradient computation, custom loss handling, and multi-optimizer updates."
        }
      ],

      trade: {
        buys: [
          "Unrivaled developer velocity: construct, compile, and train deep models in a fraction of the code required by raw frameworks.",
          "Write once, run anywhere: Keras 3 code executes interchangeably on JAX, PyTorch, and TensorFlow.",
          "Built-in enterprise validation: automated metrics tracking, early stopping callbacks, and serialization hooks."
        ],
        costs: [
          "High-level abstractions can obscure low-level memory allocation and CUDA kernel synchronization.",
          "Debugging low-level gradient issues inside `model.fit()` can be less direct than raw PyTorch loops.",
          "Framework bridging in Keras 3 can introduce minor overhead compared to pure native low-level implementations."
        ],
        avoid: [
          "Using the rigid Sequential API when designing architectures that require residual skip connections.",
          "Thinking Keras is an inferior wrapper rather than an expressive, multi-engine deep learning API."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "numpy",

      why: {
        before: "Standard Python stored numbers as boxed heap objects and iterated via interpreted bytecode loops, " +
          "running numerical array calculations 100x to 1,000x slower than compiled C or Fortran code.",
        problem: "Scientific computing and machine learning require evaluating billions of floating-point operations " +
          "at native hardware speeds without leaving the ergonomic Python ecosystem.",
        shift: "**NumPy (Travis Oliphant 2006, Harris et al. 2020): Homogeneous strided N-dimensional array processing.** " +
          "Allocate contiguous C-memory buffers via `ndarray`, executing vectorized SIMD arithmetic and linear algebra " +
          "through compiled BLAS/LAPACK backends, establishing the foundational bedrock of all modern AI frameworks."
      },

      num: {
        t: "NumPy `ndarray` architecture & vectorized broadcasting rules",
        h: ["Feature / Component", "Internal Mechanism", "Performance / Operational Role"],
        r: [
          ["**Contiguous C-Buffer**", "Raw pointer to linear sequential memory block", "Enables hardware SIMD vectorization and CPU cache pre-fetching"],
          ["**Strided Memory Indexing**", "Byte offset calculation: $\\text{addr}(i, j) = \\text{ptr} + i \\cdot s_0 + j \\cdot s_1$", "**Zero-copy slicing**: views execute in $\\mathcal{O}(1)$ time without copying data"],
          ["**Vectorized `ufuncs`**", "Universal functions compiled in optimized C", "Replaces slow Python bytecode loops with single-instruction multi-data CPU execution"],
          ["**Broadcasting Semantics**", "Aligns trailing dimensions; expands size-1 dimensions", "Performs arithmetic across disparate shapes without allocating duplicate memory"],
          ["**BLAS / LAPACK Binding**", "Links to OpenBLAS, MKL, or Apple Accelerate", "Executes matrix multiplications (`np.dot`, `@`) at near-peak CPU hardware limits"]
        ],
        n: "NumPy is the universal foundational substrate upon which the entire Python " +
          "scientific computing and machine learning ecosystem is built (Pandas, SciPy, " +
          "Scikit-Learn, PyTorch, TensorFlow). Developed by Travis Oliphant in 2006 by unifying " +
          "Numeric and Numarray, NumPy's central technical asset is the **`ndarray` (N-dimensional array)**. " +
          "Unlike standard Python lists (which store pointers to isolated Python objects scattered " +
          "across heap memory), an `ndarray` is a contiguous block of homogeneous memory elements. " +
          "By delegating math to compiled C and Fortran libraries (BLAS/LAPACK), NumPy executes " +
          "operations at native CPU speeds. The engine relies on two brilliant concepts: " +
          "(1) **Strided Indexing**: an array's coordinate shape is decoupled from its physical memory " +
          "layout through stride multipliers, allowing slicing, transposition, and reshaping to execute " +
          "in $\\mathcal{O}(1)$ time as zero-copy views. (2) **Broadcasting**: when operating on arrays " +
          "of different shapes, NumPy matches dimensions from right to left; any dimension of size 1 " +
          "is virtually stretched to match the larger array by setting its stride to 0, evaluating " +
          "element-wise operations without allocating extra memory. NumPy's array protocol is the " +
          "direct conceptual and architectural template for all modern GPU tensor libraries."
      },

      miss: [
        {
          w: "Vectorized NumPy operations are fast because Python runs them faster under the hood.",
          r: "NumPy is fast because it BYPASSES the Python interpreter entirely. Operations are executed inside compiled C, C++, and Fortran routines with SIMD vector instructions."
        },
        {
          w: "Slicing a NumPy array creates an independent duplicate copy of the data.",
          r: "Basic slicing (`a[1:5]`) creates a VIEW pointing to the exact same underlying memory buffer. Modifying the slice directly mutates the original parent array! Explicit `.copy()` is required to duplicate data."
        },
        {
          w: "NumPy can run natively on GPUs.",
          r: "NumPy is strictly a CPU library. For GPU-accelerated array computing with identical NumPy syntax, libraries like CuPy, PyTorch, or JAX must be used."
        },
        {
          w: "Broadcasting duplicates the data in memory to match the larger array's shape.",
          r: "Broadcasting never duplicates data in memory: it simply sets the stride for that dimension to zero, repeatedly reading the exact same memory address during the vectorized C loop."
        }
      ],

      trade: {
        buys: [
          "Universal lingua franca: seamless zero-overhead interoperability across all Python data science and ML tools.",
          "Blistering CPU performance: vectorized C-loops and BLAS integration run up to 100x faster than raw Python.",
          "Zero-copy slicing and strided broadcasting eliminate unnecessary memory allocations."
        ],
        costs: [
          "CPU-bound: does not natively execute on GPU accelerators or TPU clusters.",
          "Cannot track gradients: lacks native automatic differentiation engines (unlike PyTorch and JAX).",
          "Global Interpreter Lock (GIL) limits multi-threaded parallelism outside compiled BLAS routines."
        ],
        avoid: [
          "Using Python `for` loops to iterate over elements of a NumPy array (always vectorize operations).",
          "Mutating a sliced array without realizing it modifies the underlying original parent array."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "word2vec",

      why: {
        before: "Natural Language Processing relied on discrete One-Hot encodings and Bag-of-Words matrices, " +
          "which suffered from extreme sparsity, ignored context, and treated synonyms as completely orthogonal vectors.",
        problem: "Early neural language models used massive recurrent networks with full Softmax normalization, " +
          "taking weeks to train on modest vocabularies and scaling poorly to billions of words.",
        shift: "**Word2Vec (Mikolov et al. 2013, Google): Scalable self-supervised continuous word embeddings.** " +
          "Train shallow 2-layer neural networks using Continuous Bag-of-Words (CBOW) or Skip-Gram objectives, " +
          "replacing expensive Softmax normalizations with Negative Sampling to learn semantically rich vector spaces."
      },

      num: {
        t: "Word2Vec architecture comparison: CBOW vs Skip-Gram",
        h: ["Dimension / Property", "Continuous Bag-of-Words (CBOW)", "Skip-Gram with Negative Sampling (SGNS)"],
        r: [
          ["**Prediction Objective**", "Predicts **center target word** from context: $w_t \\mid w_{t-c}, \\dots, w_{t+c}$", "Predicts **surrounding context words** from center word: $w_{t+j} \\mid w_t$"],
          ["**Training Speed**", "**Faster**: averages context into a single vector; trains in $1/c$ steps", "Slower: treats each context-target pair as a separate training sample"],
          ["**Rare Word Representation**", "Averages out rare words with common context words", "**Superior**: provides individual gradient updates for rare words"],
          ["**Negative Sampling (SGNS)**", "$\\log \\sigma(v_{w_t}^T u_c) + \\sum_{k=1}^K \\mathbb{E}[\\log \\sigma(-v_{w_{n_k}}^T u_c)]$", "Converts multiclass classification into $K+1$ binary logistic regressions"],
          ["**Semantic Analogy Vector Math**", "$\\|\\vec{v}_{\\text{King}} - \\vec{v}_{\\text{Man}} + \\vec{v}_{\\text{Woman}} - \\vec{v}_{\\text{Queen}}\\| \\approx 0$", "Captures linear linguistic regularities and relational offsets"]
        ],
        n: "Word2Vec, engineered by Tomas Mikolov and colleagues at Google in 2013, " +
          "is the landmark breakthrough that launched modern representation learning in NLP. " +
          "Grounding its theory in Firth's Distributional Hypothesis (*'words in similar contexts " +
          "have similar meanings'*), Mikolov eliminated the hidden non-linear layers of prior " +
          "neural language models, designing an ultra-lean architecture with two variants: " +
          "(1) **CBOW (Continuous Bag-of-Words)**: takes the average of context word vectors " +
          "and predicts the missing center word; and (2) **Skip-Gram**: uses the center word vector " +
          "to predict surrounding context words within a window $c$. " +
          "The critical computational invention was **Negative Sampling (SGNS)**: computing a full " +
          "Softmax over a vocabulary of $V = 1,000,000$ words requires normalizing across 1 million exponents " +
          "per step ($\mathcal{O}(V)$). Negative Sampling reformulates the task as **binary logistic regression**: " +
          "maximize the probability that the true target word co-occurs with the context, while minimizing " +
          "the probability for $K$ randomly drawn noise words (sampled proportional to unigram frequency $U(w)^{3/4}$): " +
          "$\\mathcal{L} = \\log \\sigma(v'_{w_O} v_{w_I}) + \\sum_{i=1}^K \\mathbb{E}_{w_i \\sim P_n(w)} [\\log \\sigma(-v'_{w_i} v_{w_I})]$. " +
          "This reduced complexity from $\\mathcal{O}(V)$ to $\\mathcal{O}(K)$ (where $K \\approx 5-20$), " +
          "allowing Word2Vec to train on billions of words in hours and revealing miraculous linear semantic properties " +
          "(e.g. $\\vec{v}_{\\text{Madrid}} - \\vec{v}_{\\text{Spain}} + \\vec{v}_{\\text{France}} \\approx \\vec{v}_{\\text{Paris}}$)."
      },

      miss: [
        {
          w: "Word2Vec is a deep neural network with dozens of non-linear hidden layers.",
          r: "Word2Vec is explicitly a shallow 2-layer network with NO non-linear activation functions in its projection layer. Its speed stems directly from this linear architectural simplicity."
        },
        {
          w: "Word2Vec generates dynamic contextual embeddings based on surrounding sentence context.",
          r: "Word2Vec produces STATIC embeddings: each word in the vocabulary is assigned a single fixed vector. Dynamic contextual embeddings were introduced later by ELMo and BERT."
        },
        {
          w: "Negative Sampling selects noise words uniformly at random from the dictionary.",
          r: "Negative words are sampled from a unigram distribution raised to the 3/4 power ($P(w)^{0.75}$). This dampens the frequency of ultra-common words (like 'the') while boosting rare words."
        },
        {
          w: "Word2Vec can process new Out-Of-Vocabulary (OOV) words at inference time.",
          r: "If a word was not seen during training, Word2Vec has no vector for it. FastText solved this limitation by modeling words as bags of character n-grams."
        }
      ],

      trade: {
        buys: [
          "Superlative computational efficiency: trains high-quality semantic embeddings on billions of tokens in hours.",
          "Captures linear relational analogies and semantic hierarchies within an intuitive geometric vector space.",
          "Negative Sampling replaces intractable full-vocabulary Softmax with fast binary logistic regressions."
        ],
        costs: [
          "Static representations fail on polysemous words: collapses multiple meanings ('apple' fruit vs company) into one vector.",
          "Cannot handle Out-Of-Vocabulary (OOV) words or morphological typos without retraining.",
          "Lacks cross-word contextual attention, superseded in modern NLP by Transformer foundation models."
        ],
        avoid: [
          "Using Word2Vec for tasks requiring nuanced contextual disambiguation (use modern Transformer embeddings instead).",
          "Sampling negative words uniformly without applying the $3/4$ unigram power weighting."
        ]
      }
    }

  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
