/* ==========================================================================
   Depth pass 102 — Mathematics & Statistics batch 1: Linear Algebra & Vector Geometry.
   Linear Algebra, Vector, Matrix, Matrix Multiplication,
   Dot Product, Norm, Derivative.

   Linear maps preserve vector space topological operations across continuous manifolds;
   differential gradients project instantaneous rate-of-change tangents along loss surfaces.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "linear-algebra",

      why: {
        before: "Early computation treated mathematical models as ad-hoc systems of scalar equations, requiring nested loops that could not represent high-dimensional geometric transformations or scale across thousands of variables.",
        problem: "Modern machine learning, computer graphics, and physics simulations operate on millions of continuous parameters simultaneously; solving these without vector space abstraction is mathematically intractable.",
        shift: "**Linear Algebra: The branch of mathematics concerning vector spaces, linear mappings, and systems of linear equations ($A x = b$).** The foundational universal language of machine learning, graphics, quantum computing, and scientific engineering."
      },

      num: {
        t: "Linear Algebra Computational Primitives & Computational Complexities",
        h: ["Operation / Decomposition", "Mathematical Definition", "BLAS Level", "Time Complexity", "Machine Learning Application"],
        r: [
          ["Vector Dot Product", "$x^T y = \\sum_{i=1}^n x_i y_i$", "BLAS Level 1 (Vector-Vector)", "$O(n)$", "Dense embedding similarity / single neuron forward pass"],
          ["Matrix-Vector Multiply (GEMV)", "$y = A x + y$", "BLAS Level 2 (Matrix-Vector)", "$O(n^2)$", "RNN step forward pass / linear layer inference"],
          ["Matrix-Matrix Multiply (GEMM)", "$C = \\alpha A B + \\beta C$", "BLAS Level 3 (Matrix-Matrix)", "$O(n^3)$ (Strassen: $O(n^{2.81})$)", "Transformer multi-head self-attention / dense layer batches"],
          ["Singular Value Decomposition (SVD)", "$A = U \\Sigma V^T$", "LAPACK factorization", "$O(m n^2)$", "Principal Component Analysis (PCA) / latent semantic analysis"],
          ["Eigendecomposition", "$A v = \\lambda v$", "Spectral factorization", "$O(n^3)$", "Graph Laplacians, spectral clustering, Markov state analysis"]
        ],
        n: "Linear algebra studies vector spaces $V$ over a field $\\mathbb{F}$ equipped with two fundamental operations: **vector addition** ($u + v \\in V$) and **scalar multiplication** ($c \\cdot v \\in V$), satisfying eight structural axioms (associativity, commutativity, distributivity). A linear transformation $T: V \\rightarrow W$ preserves these operations: $T(c u + v) = c T(u) + T(v)$. In finite dimensions, every linear operator is isomorphic to a **Matrix** $A \\in \\mathbb{R}^{m \\times n}$. Machine learning reformulates statistical inference as geometry: datasets are matrices where rows are observations and columns are features; neural networks are compositions of linear matrix transformations interleaved with non-linear activation functions: $f(x) = \\sigma(W_L \\dots \\sigma(W_1 x + b_1) \\dots + b_L)$."
      },

      miss: [
        {
          w: "Linear algebra is only useful for basic graphics and 2D/3D video games.",
          r: "Linear algebra is the core computing engine behind all modern AI: Large Language Models (transformer self-attention is pure matrix multiplication), recommendation engines (matrix factorization), computer vision (convolutions as Toeplitz matrices), and search engines (PageRank)."
        },
        {
          w: "Matrix operations in software are fast because modern CPU clocks are fast.",
          r: "Raw CPU clock speeds plateaued in 2004. Modern linear algebra achieves extreme throughput through memory hierarchy optimization: SIMD vector registers (AVX-512), cache blocking (L1/L2/L3 cache tiling), and GPU Tensor Cores optimized for GEMM routines."
        },
        {
          w: "Non-linear problems cannot be addressed with linear algebra.",
          r: "Modern calculus and deep learning solve complex non-linear problems by linearizing them locally: computing the Jacobian matrix of first-order partial derivatives to approximate non-linear manifolds with linear tangent hyperplanes."
        },
        {
          w: "Every square matrix can be inverted ($A^{-1}$ exists).",
          r: "A matrix is invertible if and only if its determinant is non-zero ($\\det(A) \\ne 0$) and its columns are linearly independent. Singular matrices (rank-deficient) cannot be inverted; numerical algorithms use the Moore-Penrose Pseudoinverse ($A^+$) via SVD instead."
        }
      ],

      trade: {
        buys: [
          "Universal mathematical framework: unifies neural networks, graphics, optimization, and quantum algorithms.",
          "Hardware-accelerated execution: matrix operations map directly to GPU Tensor Cores, TPUs, and CPU SIMD registers.",
          "Geometric intuition: conceptualizes high-dimensional data projections, rotations, shears, and dimensionality reduction.",
          "Analytically tractable optimization: convex quadratic problems have closed-form analytical solutions ($x = (A^T A)^{-1} A^T y$)."
        ],
        costs: [
          "Curse of Dimensionality: high-dimensional vector spaces become exponentially sparse, breaking nearest-neighbor distance metrics.",
          "Cubic computational complexity: exact matrix inversion and full decompositions scale as $O(n^3)$, bottlenecking large dimensions.",
          "Memory bandwidth limits: large weight matrices exceed fast cache memory, turning algorithms memory-bandwidth bound.",
          "Floating-point numerical instability: ill-conditioned matrices (high condition number $\\kappa(A)$) amplify roundoff errors."
        ],
        avoid: [
          "Never compute explicit matrix inverses $A^{-1}$ to solve $A x = b$; use LU decomposition or Cholesky solving (`np.linalg.solve`).",
          "Do not implement matrix operations using raw Python loops; always use vectorized NumPy/PyTorch BLAS calls.",
          "Avoid ignoring matrix condition numbers when solving ill-posed linear regression problems; use L2 ridge regularization."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "vector",

      why: {
        before: "Computer programs represented entities using scattered individual scalar variables (`user_age`, `user_income`, `user_clicks`), making it impossible to perform geometric operations, distance calculations, or spatial transformations on multi-attribute entities.",
        problem: "Machine learning algorithms require a mathematically unified, coordinate-invariant representation that can encode an arbitrary number of quantitative features as a single cohesive mathematical entity.",
        shift: "**Vector: An element of a vector space, geometrically representing a directed line segment with magnitude and direction, and computationally represented as an ordered 1D array of numerical scalars ($v = [v_1, v_2, \\dots, v_n]^T \\in \\mathbb{R}^n$).** The foundational data primitive of modern computing, embeddings, and machine learning."
      },

      num: {
        t: "Vector Operations, Mathematical Formulations & Geometric Intuition",
        h: ["Operation", "Algebraic Formula", "Geometric Meaning", "Computational Complexity", "Machine Learning Application"],
        r: [
          ["Vector Addition", "$u + v = [u_1 + v_1, \\dots, u_n + v_n]^T$", "Parallelogram law of displacement", "$O(n)$", "Residual skip connections ($F(x) + x$)"],
          ["Scalar Multiplication", "$c \\cdot v = [c v_1, \\dots, c v_n]^T$", "Scaling length without altering direction", "$O(n)$", "Learning rate parameter scaling ($\\eta \\nabla L$)"],
          ["Euclidean Norm ($L_2$)", "$\\|v\\|_2 = \\sqrt{\\sum_{i=1}^n v_i^2}$", "Physical geometric length in space", "$O(n)$", "Weight decay regularization / vector normalization"],
          ["Dot Product", "$u \\cdot v = \\sum_{i=1}^n u_i v_i = \\|u\\| \\|v\\| \\cos \\theta$", "Projection of $u$ onto $v$ scaled by length", "$O(n)$", "Cosine similarity / attention query-key scoring"],
          ["Outer Product", "$u \\otimes v = u v^T \\in \\mathbb{R}^{n \\times m}$", "Constructs rank-1 transformation matrix", "$O(n m)$", "Gradient outer product update ($\\Delta W = \\delta x^T$)"]
        ],
        n: "In abstract mathematics, a vector is any object that satisfies the eight formal vector space axioms under addition and scalar multiplication. In applied computer science, vectors are typically elements of Euclidean space $\\mathbb{R}^n$. A vector $v \\in \\mathbb{R}^n$ can be interpreted through three complementary lenses: (1) **Physics**: A directed arrow with magnitude $\\|v\\|$ and spatial direction $\\theta$. (2) **Computer Science**: A contiguous, indexable 1D array of floating-point numbers allocated in memory. (3) **Data Science (Embeddings)**: A point in a high-dimensional semantic latent space where Euclidean distance or cosine similarity reflects semantic relatedness (e.g., Word2Vec, CLIP embeddings, user profile vectors)."
      },

      miss: [
        {
          w: "A vector is just a standard Python list of numbers (`[1.2, 3.4, 5.6]`).",
          r: "A Python list is a fragmented array of pointers to heap-allocated PyObject instances. A mathematical vector in numerical computing is a **contiguous block of memory** of primitive floats (NumPy array / PyTorch tensor) executable via SIMD CPU/GPU hardware instructions."
        },
        {
          w: "Vectors can only exist in 2D or 3D physical space.",
          r: "Vector mathematics generalizes to arbitrary finite and infinite dimensional spaces. Modern Large Language Models represent text tokens as dense vectors in $4,096$ to $12,288$ dimensions ($\\{v \\in \\mathbb{R}^{4096}\\}$)."
        },
        {
          w: "Cosine similarity between two vectors is identical to Euclidean distance.",
          r: "Cosine similarity measures **angle/direction** independent of vector magnitude: $\\cos \\theta = \\frac{u \\cdot v}{\\|u\\| \\|v\\|}$. Euclidean distance measures absolute **spatial separation**: $\\|u - v\\|_2$. Two vectors pointing in the exact same direction have a cosine similarity of $1.0$ even if one is $100\\times$ longer than the other."
        },
        {
          w: "Adding two vectors can change the dimensionality of the space.",
          r: "Vector spaces are closed under addition: if $u, v \\in \\mathbb{R}^n$, then $u + v \\in \\mathbb{R}^n$. Vector addition is strictly element-wise and requires both vectors to share identical dimensions."
        }
      ],

      trade: {
        buys: [
          "Compact mathematical encapsulation: encodes multi-dimensional entities into a single unified variable.",
          "Hardware vectorization: SIMD instructions (AVX-512) process 16 float32 operations in a single CPU clock cycle.",
          "Enables semantic embedding spaces: maps text, images, and audio into geometric metric spaces.",
          "Standardized distance metrics: enables nearest-neighbor search (HNSW, FAISS) for RAG and recommendation systems."
        ],
        costs: [
          "Curse of dimensionality: in high-dimensional spaces ($n > 1000$), vectors become nearly equidistant and orthogonal.",
          "Memory overhead: storing millions of dense 1536-dimensional float32 vectors requires gigabytes of high-speed RAM.",
          "Loss of symbolic explainability: dense vectors obscure individual human-readable feature semantics.",
          "Requires strict dimensional alignment: mismatched vector lengths trigger runtime matrix shape exceptions."
        ],
        avoid: [
          "Never iterate over vector elements using raw Python `for` loops; use vectorized NumPy/PyTorch operations.",
          "Do not compute cosine similarity on un-normalized vectors using dot product without explicit normalization.",
          "Avoid storing billions of dense float32 vectors in memory without quantization (FP16 or INT8 vector quantization)."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "matrix",

      why: {
        before: "Representing multiple simultaneous linear transformations or tabular datasets required writing thousands of independent scalar algebraic equations, obscuring systemic patterns and preventing parallel hardware execution.",
        problem: "Simultaneously transforming hundreds of multi-dimensional data points (e.g., rotating a 3D graphic or processing a batch of images through neural network weights) requires a 2D mathematical operator capable of acting on entire spaces at once.",
        shift: "**Matrix: A rectangular 2D array of numbers, symbols, or expressions arranged in rows and columns ($A \\in \\mathbb{R}^{m \\times n}$), representing linear transformations between vector spaces.** The core computational workhorse of machine learning and computer graphics."
      },

      num: {
        t: "Special Matrix Structures, Algebraic Properties & Computational Benefits",
        h: ["Matrix Structure", "Mathematical Property", "Storage Complexity", "Inversion Complexity", "Machine Learning Role"],
        r: [
          ["Diagonal Matrix", "$A_{i,j} = 0$ for $i \\ne j$", "$O(n)$ sparse", "$O(n)$ (reciprocal of diagonal)", "Weight scaling, learning rate schedules, SVD singular values"],
          ["Symmetric Matrix", "$A = A^T$ ($A_{i,j} = A_{j,i}$)", "$n(n+1)/2$ entries", "$O(n^3)$ (Cholesky $O(n^3/3)$)", "Covariance matrices, Hessian optimization matrices, graph Laplacians"],
          ["Orthogonal Matrix", "$A^T A = A A^T = I$ ($A^{-1} = A^T$)", "$O(n^2)$", "Instantaneous ($O(1)$ pointer swap)", "Rotations, QR decomposition, preserving gradient norms"],
          ["Toeplitz Matrix", "$A_{i,j} = A_{i-1, j-1}$ (constant diagonals)", "$O(n)$ unique entries", "$O(n^2)$ (Levinson-Durbin)", "1D and 2D discrete convolutions formulated as matrix multiply"],
          ["Sparse Matrix", "Fraction of non-zero entries $\\ll 1$", "$O(\\text{nnz})$ (CSR/CSC format)", "Variable (iterative Krylov solvers)", "Bag-of-Words, TF-IDF, graph adjacency matrices, graph neural nets"]
        ],
        n: "A matrix $A \\in \\mathbb{R}^{m \\times n}$ consists of $m$ rows and $n$ columns. Algebraically, a matrix is a compact representation of a system of $m$ linear equations in $n$ variables: $A x = b$. Geometrically, a matrix represents a **Linear Transformation** $T: \\mathbb{R}^n \\rightarrow \\mathbb{R}^m$ that maps basis vectors to new coordinates, stretching, rotating, shearing, or projecting space while keeping the origin fixed and grid lines parallel. The **Rank** of a matrix denotes the dimension of the vector space spanned by its columns (the number of linearly independent columns). The **Determinant** $\\det(A)$ measures the factor by which the transformation scales volume (with $\\det(A) = 0$ indicating space collapsed into a lower dimension, making the matrix non-invertible)."
      },

      miss: [
        {
          w: "A matrix is simply a 2D spreadsheet or table of data.",
          r: "A spreadsheet is a passive container for records. A matrix is an active **linear operator**: it transforms vector spaces, rotates coordinates, and defines metric spaces via bilinear forms ($x^T A y$)."
        },
        {
          w: "Matrix addition can be performed between any two matrices.",
          r: "Matrix addition is strictly defined ONLY between matrices sharing the **exact same dimensions** ($m \\times n$). Adding matrices with mismatched shapes is undefined (unless broadcasting rules apply in software frameworks like NumPy)."
        },
        {
          w: "Every matrix has an inverse ($A^{-1}$).",
          r: "Only square matrices ($n \\times n$) with full rank ($\\det(A) \\ne 0$) have true inverses. Singular matrices collapse dimensions to zero and cannot be inverted. Rectangular or singular matrices require the Moore-Penrose Pseudoinverse ($A^+$)."
        },
        {
          w: "Sparse matrices with 99% zeros should be stored in standard 2D NumPy arrays.",
          r: "Storing sparse matrices as dense 2D arrays wastes gigabytes of memory storing useless zeros. Sparse formats (Compressed Sparse Row, CSR / CSC) store only non-zero coordinates and values, reducing memory by 99%."
        }
      ],

      trade: {
        buys: [
          "Encapsulates complex multi-dimensional linear transformations into compact symbolic notation.",
          "Directly maps to GPU Tensor Cores and optimized BLAS linear algebra libraries (cuBLAS, Intel MKL).",
          "Batched execution: allows applying a linear model to 10,000 data points simultaneously via a single matrix operation.",
          "Spectral decomposition: reveals underlying data structures via eigenvalues, eigenvectors, and singular values."
        ],
        costs: [
          "High memory footprint: dense $10,000 \\times 10,000$ float32 matrices consume 400 MB of RAM each.",
          "Matrix operations can be numerically unstable: ill-conditioned matrices amplify floating-point truncation errors.",
          "Transposition cache misses: iterating through matrix columns in row-major memory layouts causes cache thrashing.",
          "Dimensional constraints: requires strict tracking of inner and outer dimensions to prevent shape mismatch errors."
        ],
        avoid: [
          "Never store massive graph adjacency or TF-IDF matrices as dense 2D arrays; use `scipy.sparse` CSR/CSC.",
          "Do not invert matrices directly using `np.linalg.inv(A)`; solve systems using `np.linalg.solve(A, b)`.",
          "Avoid row-by-row iteration over matrices; vectorize operations across rows or columns simultaneously."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "matrix-multiplication",

      why: {
        before: "Computing sequential transformations on data points required evaluating hundreds of separate linear scalar formulas one by one, scaling linearly with sample size and creating immense CPU execution bottlenecks.",
        problem: "Deep neural networks evaluate millions of weights across thousands of inputs in parallel; computing these operations without optimized parallel matrix multiplication is computationally intractable.",
        shift: "**Matrix Multiplication (GEMM): The fundamental mathematical binary operation that takes two matrices $A \\in \\mathbb{R}^{m \\times k}$ and $B \\in \\mathbb{R}^{k \\times n}$ and produces matrix $C \\in \\mathbb{R}^{m \\times n}$, representing the functional composition of two linear transformations.** The universal computational kernel powering over 90% of deep learning FLOPs."
      },

      num: {
        t: "Matrix Multiplication Computational Formulations & Algorithmic Complexities",
        h: ["Algorithm / Hardware Engine", "Mechanism / Architecture", "Time Complexity", "Memory Bandwidth Behavior", "Hardware Execution Layer"],
        r: [
          ["Naive 3-Nested Loops", "Row-column dot products ($i, j, k$)", "$O(m n k) \\approx O(n^3)$", "Catastrophic cache misses ($O(n^3)$ transfers)", "Standard unoptimized Python/C loop"],
          ["Tiled / Blocked GEMM", "Partitioned into sub-matrices fitting L1/L2 cache", "$O(n^3)$ operations", "Optimal cache reuse ($O(n^3 / \\sqrt{M})$ transfers)", "OpenBLAS, Intel MKL, BLIS"],
          ["Strassen Algorithm (1969)", "Recursive sub-matrix decomposition (7 sub-multiplies)", "$O(n^{\\log_2 7}) \\approx O(n^{2.807})$", "Higher memory allocation overhead", "Theoretical / large-scale CPU matrix libraries"],
          ["NVIDIA Tensor Cores (GEMM)", "Fused Multiply-Accumulate (FMA) 16x16x16 matrix steps", "Hardware-accelerated $O(1)$ cycle ops", "Direct SRAM $\\leftrightarrow$ Tensor Core register pipelines", "NVIDIA Hopper / Blackwell Tensor Cores"],
          ["FlashAttention GEMM", "Tiled online softmax fused with GEMM", "$O(N^2 d)$ operations", "Minimal HBM reads/writes ($O(N^2 / M)$)", "SRAM-tiled Transformer attention layers"]
        ],
        n: "For matrix $A \\in \\mathbb{R}^{m \\times k}$ and $B \\in \\mathbb{R}^{k \\times n}$, their product $C = A B \\in \\mathbb{R}^{m \\times n}$ is defined element-wise by the inner product of row $i$ of $A$ and column $j$ of $B$: $C_{i,j} = \\sum_{p=1}^k A_{i,p} B_{p,j}$. Crucially, matrix multiplication is defined **only** when the inner dimensions match ($A$'s column count $k$ equals $B$'s row count $k$). Matrix multiplication is associative ($(A B) C = A (B C)$) and distributive ($A (B + C) = A B + A C$), but is strictly **non-commutative**: in general, $A B \\ne B A$. In deep learning hardware, GEMM (General Matrix Multiply: $C = \\alpha A B + \\beta C$) is the most heavily optimized primitive on Earth, utilizing cache tiling, register re-use, and dedicated hardware units (Tensor Cores) that execute $16 \\times 16$ mixed-precision matrix multiplies in single clock cycles."
      },

      miss: [
        {
          w: "Matrix multiplication is performed by multiplying matching elements ($A_{i,j} \\times B_{i,j}$).",
          r: "Element-wise multiplication is the **Hadamard Product** ($A \\odot B$), which requires identical matrix shapes. Matrix multiplication ($A B$) is a dot product between rows and columns, requiring matching inner dimensions ($m \\times k$ and $k \\times n$)."
        },
        {
          w: "Matrix multiplication is commutative: $A B = B A$.",
          r: "Matrix multiplication is strictly **non-commutative**. In fact, if $A$ is $2 \\times 3$ and $B$ is $3 \\times 4$, the product $A B$ is a valid $2 \\times 4$ matrix, but $B A$ is mathematically impossible because the inner dimensions ($4$ and $2$) do not match."
        },
        {
          w: "Writing 3 nested `for` loops in C is an efficient way to implement matrix multiplication.",
          r: "Naive 3-loop implementations run up to $50\\times$ slower than optimized BLAS libraries because they ignore CPU cache hierarchies. Fast GEMM requires multi-level cache tiling, memory alignment, register blocking, and SIMD vector assembly."
        },
        {
          w: "Python's `*` operator performs standard matrix multiplication.",
          r: "In NumPy and PyTorch, `A * B` performs **element-wise** Hadamard multiplication. Standard matrix multiplication requires the **`@` operator** (`A @ B`) or `np.matmul(A, B)`."
        }
      ],

      trade: {
        buys: [
          "Extreme parallel efficiency: the regular structure of GEMM allows full saturation of GPU Tensor Cores and TPUs.",
          "Compositional power: multiplying transformation matrices composes rotations, scaling, and shears into a single operation.",
          "Batched inference: enables computing forward-pass predictions across 1,000 samples simultaneously via $X W^T$.",
          "Underpins the modern AI revolution: enables Transformers, CNNs, and MLPs to scale across billions of parameters."
        ],
        costs: [
          "Cubic computational scaling: classical algorithms scale as $O(n^3)$, making massive matrix operations compute-heavy.",
          "Memory bandwidth pressure: feeding large matrices to compute cores requires massive memory bandwidth (HBM3).",
          "Shape rigidity: strict inner dimension alignment ($k=k$) causes frequent dimension mismatch runtime exceptions.",
          "Numerical precision loss: accumulating thousands of floating-point products can lead to rounding and precision loss."
        ],
        avoid: [
          "Never use the `*` operator when you intend to perform matrix multiplication in NumPy/PyTorch; use `@`.",
          "Do not implement custom matrix multiplication loops in Python; use `np.dot`, `torch.matmul`, or BLAS routines.",
          "Avoid computing chain matrix products like $A B C$ without checking associative ordering to minimize FLOPs."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "dot-product",

      why: {
        before: "Measuring the geometric alignment, directional similarity, or projected magnitude between multi-dimensional vectors required cumbersome trigonometric calculations with angles and lengths.",
        problem: "Neural network neurons and search engines need an ultra-fast, algebraic way to measure how strongly an input vector aligns with a learned weight vector or query embedding in a single operation.",
        shift: "**Dot Product (Scalar Product / Inner Product): An algebraic operation that takes two equal-length vectors and returns a single scalar by summing the products of their corresponding components.** Formally defined as $u \\cdot v = \\sum_{i=1}^n u_i v_i = \\|u\\| \\|v\\| \\cos \\theta$, serving as the fundamental engine of artificial neurons and attention mechanisms."
      },

      num: {
        t: "Dot Product Geometric Regimes & Machine Learning Behaviors",
        h: ["Angle $\\theta$ Between Vectors", "Dot Product Sign / Value", "Geometric Relationship", "Attention / Neuron Activation", "Physical Example"],
        r: [
          ["$\\theta = 0^\\circ$", "$u \\cdot v = \\|u\\| \\|v\\|$ (Maximum positive)", "Perfect directional alignment (parallel)", "Maximum positive activation / maximum attention score", "Identical word embeddings / maximum feature match"],
          ["$0^\\circ < \\theta < 90^\\circ$", "$u \\cdot v > 0$ (Positive scalar)", "Acute angle (pointing in similar direction)", "Positive activation", "Semantically related search query and document"],
          ["$\\theta = 90^\\circ$", "$u \\cdot v = 0$ (Zero)", "Strictly orthogonal (perpendicular)", "Zero activation / zero correlation", "Independent, uncorrelated features / orthogonal basis"],
          ["$90^\\circ < \\theta < 180^\\circ$", "$u \\cdot v < 0$ (Negative scalar)", "Obtuse angle (pointing away from each other)", "Inhibitory activation (suppressed by ReLU)", "Contradictory semantic concepts / opposing forces"],
          ["$\\theta = 180^\\circ$", "$u \\cdot v = -\\|u\\| \\|v\\|$ (Maximum negative)", "Directly opposing (anti-parallel)", "Maximum inhibition", "Opposite semantic antonyms / inverted polarities"]
        ],
        n: "The dot product bridges algebra and Euclidean geometry. Algebraically, it is the sum of element-wise products: $u \\cdot v = \\sum_{i=1}^n u_i v_i$. Geometrically, it is the product of their Euclidean lengths and the cosine of the angle between them: $u \\cdot v = \\|u\\| \\|v\\| \\cos \\theta$. In a single artificial neuron, the pre-activation value is simply a dot product between input feature vector $x$ and synaptic weight vector $w$, plus bias: $z = w \\cdot x + b$. In Transformer **Scaled Dot-Product Attention**, the alignment score between query token $q$ and key token $k$ is computed via dot product scaled by embedding dimension $d_k$: $\\text{Score}(q, k) = \\frac{q \\cdot k}{\\sqrt{d_k}}$. The scaling factor $\\frac{1}{\\sqrt{d_k}}$ is mathematically necessary because for high dimensions, the dot product variance grows as $O(d_k)$, pushing the subsequent softmax function into regions with near-zero vanishing gradients."
      },

      miss: [
        {
          w: "The dot product and the cross product are the same thing.",
          r: "They are completely different operations. The **dot product** takes two vectors and outputs a **scalar**. The **cross product** ($u \\times v$) exists strictly in 3D space and outputs a **vector** that is perpendicular to both input vectors."
        },
        {
          w: "A dot product of zero means that at least one of the vectors is zero.",
          r: "Two non-zero vectors have a dot product of zero if and only if they are **orthogonal (perpendicular)** to each other ($\\cos 90^\\circ = 0$). Orthogonality is the geometric definition of linear independence."
        },
        {
          w: "Dot product is identical to Cosine Similarity.",
          r: "Dot product includes vector magnitude ($u \\cdot v = \\|u\\| \\|v\\| \\cos \\theta$). **Cosine similarity** normalizes vectors to unit length ($\\|u\\|=1, \\|v\\|=1$), isolating pure angular direction. Dot product equals cosine similarity ONLY if both vectors are strictly $L_2$-normalized."
        },
        {
          w: "The dot product operation is inherently slow on high-dimensional vectors.",
          r: "The dot product is an $O(n)$ operation heavily optimized in hardware via Fused Multiply-Add (FMA) CPU SIMD and GPU instructions, executing thousands of multiplications and additions per clock cycle."
        }
      ],

      trade: {
        buys: [
          "Ultra-fast similarity metric: computes geometric alignment and projection in a single $O(n)$ hardware loop.",
          "Core foundation of neural networks: powers dense layer forward passes, convolutions, and attention scoring.",
          "Direct geometric interpretability: sign instantly reveals whether vectors align, oppose, or are orthogonal.",
          "Bilinear mathematical properties enable easy symbolic differentiation in backpropagation."
        ],
        costs: [
          "Conflates angle and magnitude: a vector with high magnitude can yield a high dot product despite poor angular alignment.",
          "Variance explosion in high dimensions: variance scales with dimension $d$, requiring scaling factors (as in Transformers).",
          "Sensitive to coordinate axes: un-normalized raw inputs can distort dot product magnitudes.",
          "Linear-only metric: cannot capture non-linear, manifold, or topological vector interactions without kernel tricks."
        ],
        avoid: [
          "Never use unscaled dot product for attention mechanisms in high dimensions; scale by $\\frac{1}{\\sqrt{d_k}}$.",
          "Do not use dot product as a pure directional similarity metric without first $L_2$-normalizing your embedding vectors.",
          "Avoid implementing dot products using Python loops; use `np.dot` or PyTorch `@`."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "norm",

      why: {
        before: "Measuring the 'size', 'length', or 'magnitude' of a multi-dimensional vector or matrix lacked a unified mathematical framework, leading to inconsistent regularization penalties and non-standardized distance calculations.",
        problem: "Machine learning models overfit when weight parameters grow excessively large, and vector search algorithms need mathematically rigorous ways to measure vector length and constrain parameter complexity.",
        shift: "**Norm: A mathematical function that assigns a strictly positive real number representing length, size, or magnitude to vectors in a vector space ($v \\mapsto \\|v\\|$).** Governs Euclidean distances, regularizations ($L_1$ Lasso, $L_2$ Ridge), and gradient clipping."
      },

      num: {
        t: "Vector and Matrix Norms: Formulations, Geometries & Machine Learning Roles",
        h: ["Norm", "Mathematical Formula", "Unit Ball Geometry", "Inductive Bias", "Machine Learning Role"],
        r: [
          ["$L_1$ Norm (Manhattan)", "$\\|x\\|_1 = \\sum_{i=1}^n |x_i|$", "Diamond / Cross-polytope (sharp corners)", "Promotes exact weight sparsity (zeros out features)", "L1 Regularization (Lasso) / feature selection"],
          ["$L_2$ Norm (Euclidean)", "$\\|x\\|_2 = \\sqrt{\\sum_{i=1}^n x_i^2}$", "Smooth hypersphere", "Distributes small weights smoothly across features", "L2 Regularization (Ridge/Weight Decay) / Gradient Clipping"],
          ["$L_\\infty$ Norm (Max / Chebyshev)", "$\\|x\\|_\\infty = \\max_i |x_i|$", "Hypercube", "Bounds the single largest coordinate deviation", "Fast Gradient Sign Method (FGSM) adversarial attacks"],
          ["$L_0$ 'Norm' (Hamming)", "$\\|x\\|_0 = \\sum_{i=1}^n \\mathbb{I}(x_i \\ne 0)$", "Discontinuous non-convex axis spikes", "Exact cardinality counting", "Sparse model compression / non-differentiable penalty"],
          ["Frobenius Norm (Matrix)", "$\\|A\\|_F = \\sqrt{\\sum_{i,j} A_{i,j}^2} = \\sqrt{\\text{Tr}(A^T A)}$", "High-dimensional matrix sphere", "Penalizes aggregate matrix parameter magnitudes", "Matrix regularization / reconstruction loss in SVD & autoencoders"]
        ],
        n: "A formal norm $\\|\\cdot\\|: V \\rightarrow \\mathbb{R}$ on a vector space must satisfy four non-negotiable mathematical axioms: (1) **Non-negativity**: $\\|v\\| \\ge 0$, (2) **Definiteness**: $\\|v\\| = 0 \\iff v = \\mathbf{0}$, (3) **Absolute Homogeneity**: $\\|c v\\| = |c| \\|v\\|$ for any scalar $c$, and (4) **Triangle Inequality**: $\\|u + v\\| \\le \\|u\\| + \\|v\\|$. The general family of **$L_p$ norms** is defined as $\\|x\\|_p = \\left( \\sum_{i=1}^n |x_i|^p \\right)^{1/p}$ for $p \\ge 1$. The sharp geometric corners of the $L_1$ unit ball intersect loss contours on coordinate axes, mathematically driving irrelevant weights to exactly zero (producing sparse models). In contrast, the smooth spherical geometry of the $L_2$ norm shrinks weights towards zero without setting them exactly to zero, preventing any single feature from dominating."
      },

      miss: [
        {
          w: "$L_0$ is a true mathematical norm.",
          r: "$L_0$ (which counts the number of non-zero elements) is **not a true norm** because it violates the absolute homogeneity axiom: $\\|c v\\|_0 \\ne |c| \\|v\\|_0$. It is non-convex and non-differentiable, making optimization NP-hard."
        },
        {
          w: "$L_1$ and $L_2$ regularization produce identical model behaviors.",
          r: "$L_1$ regularization produces **sparse models** by driving non-informative feature weights to exactly $0.0$, performing automatic feature selection. $L_2$ regularization shrinks weights smoothly toward zero but almost never sets them exactly to zero."
        },
        {
          w: "The Euclidean norm ($L_2$) is always the best metric to measure vector magnitude.",
          r: "In high-dimensional spaces (e.g., $d > 1000$), $L_2$ distance suffers from concentration of measure (all pairwise distances converge to the same value). Fractional norms or cosine distances often provide superior discriminative power."
        },
        {
          w: "Gradient clipping using norm clipping and value clipping are identical.",
          r: "Value clipping clips each gradient element independently ($g_i = \\text{clip}(g_i, -c, c)$), which **alters the spatial direction** of the gradient vector. Norm clipping scales the entire gradient vector proportionally ($g = g \\cdot \\frac{c}{\\|g\\|}$), preserving the true gradient direction."
        }
      ],

      trade: {
        buys: [
          "Defines a rigorous mathematical metric for distance, length, and error in high-dimensional vector spaces.",
          "$L_1$ regularization performs automated feature selection by zeroing out irrelevant input weights.",
          "$L_2$ regularization prevents weight explosion and overfitting, improving out-of-distribution generalization.",
          "Gradient norm clipping prevents exploding gradients, stabilizing deep neural network and LLM training."
        ],
        costs: [
          "$L_1$ norm is non-differentiable at zero ($x=0$), requiring sub-gradient optimization techniques (coordinate descent).",
          "In high dimensions ($d > 1000$), $L_2$ norm distances lose contrast due to the curse of dimensionality.",
          "Norm calculations require a full reduction pass over vector elements, adding computational overhead in inner loops.",
          "Hyperparameter tuning: balancing task loss against norm penalty terms ($\\lambda$) requires extensive cross-validation."
        ],
        avoid: [
          "Never perform element-wise value clipping when you intend to preserve gradient vector trajectory; use global norm clipping.",
          "Do not use $L_1$ regularization if features are highly collinear; use ElasticNet (combining $L_1$ and $L_2$).",
          "Avoid computing $\\|x\\|_2$ in floating-point code without scaling if values risk numerical overflow; use `hypot`."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "derivative",

      why: {
        before: "Optimizing mathematical functions required brute-force grid search, evaluating millions of random trial points, or calculating discrete differences that were computationally slow and failed to scale beyond a few parameters.",
        problem: "Training machine learning models requires tuning millions to billions of parameters to minimize error; without calculus derivatives, finding the loss minimum in high dimensions is practically impossible.",
        shift: "**Derivative: The fundamental calculus operator representing the instantaneous rate of change of a function with respect to an independent variable, geometrically corresponding to the slope of the tangent line.** The foundational mathematical basis of gradient descent and neural network backpropagation."
      },

      num: {
        t: "Differentiation Methodologies: Mathematical Formulation, Precision & Compute Cost",
        h: ["Methodology", "Mathematical Mechanism", "Numerical Precision", "Computational Cost (for $N$ params)", "Primary Machine Learning Use"],
        r: [
          ["Symbolic Differentiation", "Applies analytical calculus rules via AST manipulation", "Exact analytical solution", "Exponential formula bloat ($O(2^N)$)", "Computer algebra systems (SymPy, Mathematica)"],
          ["Numerical Differentiation (Finite Diff)", "$\\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}$", "Truncted / Roundoff error ($O(h)$ or $O(h^2)$)", "$O(N)$ forward passes (slow)", "Gradient checking / debugging backprop code"],
          ["Automatic Differentiation (Forward)", "Propagates dual numbers alongside forward pass", "Exact to machine floating-point precision", "$O(N)$ forward passes", "Functions with few inputs and many outputs ($f: \\mathbb{R}^1 \\rightarrow \\mathbb{R}^M$)"],
          ["Automatic Differentiation (Reverse)", "Adjoint / reverse graph traversal (Backpropagation)", "Exact to machine floating-point precision", "$O(1)$ forward + $O(1)$ backward pass", "Universal standard for Deep Learning ($f: \\mathbb{R}^N \\rightarrow \\mathbb{R}^1$)"]
        ],
        n: "The derivative of a real-valued single-variable function $f(x)$ at point $x$ is defined as the limit of the difference quotient: $f'(x) = \\frac{df}{dx} = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h}$. Geometrically, it represents the slope of the tangent line touching the function curve at $(x, f(x))$. Physically, it measures instantaneous sensitivity: if $f'(x) = 3$, an infinitesimal change $dx$ produces a change $df \\approx 3 \\, dx$. Machine learning optimizes models by locating local extrema (minima of loss functions $\\mathcal{L}(w)$) where the derivative equals zero: $f'(w) = 0$. In gradient descent, parameters are updated in the direction opposing the derivative: $w \\leftarrow w - \\eta \\frac{d\\mathcal{L}}{dw}$, ensuring that the model steps downhill along the loss surface towards minimum error."
      },

      miss: [
        {
          w: "Deep learning libraries compute derivatives using finite difference approximations (e.g., $h = 10^{-5}$).",
          r: "Finite differences are far too slow (requiring $N$ separate forward passes for $N$ parameters) and suffer from floating-point truncation and roundoff errors. Deep learning frameworks use **Reverse-Mode Automatic Differentiation (Autograd)**, which computes exact analytical derivatives in a single backward pass."
        },
        {
          w: "A derivative can only be computed if a function is continuous and smooth everywhere.",
          r: "Functions with sharp non-differentiable points (like the **ReLU** activation function $f(x) = \\max(0, x)$ at $x=0$) do not have classical derivatives. Deep learning uses **Sub-gradient Calculus**, arbitrarily assigning a valid sub-gradient value (typically 0 or 1 at $x=0$), allowing backpropagation to proceed flawlessly."
        },
        {
          w: "A zero derivative ($f'(x) = 0$) guarantees that the function has reached a global minimum.",
          r: "A zero derivative indicates a **stationary point**, which can be a local minimum, a local maximum, or an inflection/saddle point. In high-dimensional deep learning loss landscapes, the vast majority of zero-gradient stationary points are **saddle points**, not local minima."
        },
        {
          w: "The derivative of a multi-variable function is a single scalar number.",
          r: "For a multi-variable scalar function $f(x_1, x_2, \\dots, x_n)$, the rate of change with respect to each variable is a **Partial Derivative** $\\frac{\\partial f}{\\partial x_i}$, and the collection of all partial derivatives forms a vector called the **Gradient** $\\nabla f$."
        }
      ],

      trade: {
        buys: [
          "The foundational engine of optimization: enables automated parameter updates via gradient descent.",
          "Provides exact quantitative sensitivity: measures how altering an input feature or weight influences output loss.",
          "Reverse-mode automatic differentiation computes derivatives of millions of parameters in a single backward pass.",
          "Enables first-order and second-order optimization algorithms (SGD, Adam, L-BFGS)."
        ],
        costs: [
          "Vanishing and exploding gradients: chaining many derivatives in deep networks can cause gradients to shrink to 0 or explode to infinity.",
          "Memory overhead: automatic differentiation requires caching intermediate forward-pass activations in memory for the backward pass.",
          "Local optimization trap: derivatives provide strictly local slope information, potentially trapping optimizers in suboptimal local minima or saddle points.",
          "Non-differentiable operations: cannot backpropagate through discrete operations (e.g., argmax, hard thresholding) without smooth approximations (Gumbel-Softmax)."
        ],
        avoid: [
          "Never use numerical finite differences for training neural networks; use reverse-mode automatic differentiation.",
          "Do not insert non-differentiable discrete operations in neural network computational paths without reparameterization tricks.",
          "Avoid initializing all network weights to zero, which produces identical derivatives and prevents symmetry breaking."
        ]
      }
    }

  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
