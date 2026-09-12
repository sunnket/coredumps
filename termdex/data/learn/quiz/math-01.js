/* MATH — 50+ Hardcore Question Bank (IIT/PhD Level). */

/* ===================================================================
   Module: la — (16 Hardcore Questions)
   =================================================================== */

TD.addMCQ("math", "la", [
  {
    "tag": "Eckart-Young-Mirsky Low-Rank Approximation Theorem",
    "lvl": "advanced",
    "q": "Given real matrix $A \\in \\mathbb{R}^{m \\times n}$ with Singular Value Decomposition $A = U \\Sigma V^T = \\sum_{i=1}^r \\sigma_i u_i v_i^T$, what is the optimal rank-$k$ matrix $A_k$ that minimizes the Frobenius norm $\\|A - B\\|_F$ over all rank-$k$ matrices $B$?",
    "o": [
      "$A_k = A^T A$",
      "$A_k = \\sum_{i=1}^k \\sigma_i u_i v_i^T$, truncating all singular values $\\sigma_j$ for $j > k$ to zero (with approximation error $\\|A - A_k\\|_F^2 = \\sum_{i=k+1}^r \\sigma_i^2$)",
      "$A_k = \\Sigma_k^{-1}$",
      "$A_k = U_k V_k^T$"
    ],
    "a": 1,
    "x": "The Eckart-Young-Mirsky theorem proves that truncated SVD provides the best low-rank matrix approximation under both Frobenius and spectral norms."
  },
  {
    "tag": "PCA as Rayleigh Quotient Maximization",
    "lvl": "advanced",
    "q": "How is Principal Component Analysis (PCA) mathematically framed as maximizing the Rayleigh Quotient of sample covariance matrix $\\Sigma = \\frac{1}{n} X^T X$?",
    "o": [
      "Minimizing matrix trace",
      "$u_1 = \\arg\\max_{u \\neq 0} \\frac{u^T \\Sigma u}{u^T u}$; by Rayleigh-Ritz theorem, the maximum equals the largest eigenvalue $\\lambda_{\\max}(\\Sigma)$ achieved when $u$ is the corresponding principal eigenvector",
      "Solving a linear system $Ax = b$",
      "Computing the determinant of $X$"
    ],
    "a": 1,
    "x": "The Rayleigh quotient $R(\\Sigma, u) = \\frac{u^T \\Sigma u}{u^T u}$ attains its global maximum at the dominant eigenvector of $\\Sigma$, which equals the maximum variance projection."
  },
  {
    "tag": "Positive Semi-Definite Matrix Equivalences",
    "lvl": "advanced",
    "q": "Which of the following is NOT an equivalent characterization of a symmetric matrix $A \\in \\mathbb{R}^{n \\times n}$ being Positive Semi-Definite ($A \\succeq 0$)?",
    "o": [
      "$x^T A x \\ge 0$ for all vectors $x \\in \\mathbb{R}^n$",
      "All eigenvalues of $A$ are strictly positive ($\\lambda_i > 0$)",
      "All leading principal minors of $A$ are non-negative",
      "There exists a real matrix $L$ such that $A = L L^T$ (Cholesky factorization)"
    ],
    "a": 1,
    "x": "All eigenvalues strictly positive ($\\lambda_i > 0$) defines Positive **Definite** ($A \\succ 0$). Positive **Semi-Definite** ($A \\succeq 0$) allows eigenvalues to be zero ($\\lambda_i \\ge 0$)."
  },
  {
    "tag": "Condition Number & Gradient Descent Convergence",
    "lvl": "advanced",
    "q": "For a quadratic loss function $f(x) = \\frac{1}{2} x^T A x - b^T x$ with symmetric positive definite Hessian $A$, how does the matrix condition number $\\kappa(A) = \\frac{\\lambda_{\\max}(A)}{\\lambda_{\\min}(A)}$ dictate the convergence rate of Gradient Descent?",
    "o": [
      "Convergence is independent of $\\kappa(A)$",
      "The convergence rate is governed by $\\left( \\frac{\\kappa - 1}{\\kappa + 1} \\right)^2$; when $\\kappa \\gg 1$ (ill-conditioned Hessian with highly eccentric contours), standard gradient descent oscillates severely and exhibits extremely slow linear convergence",
      "High $\\kappa$ causes convergence in 1 step",
      "Ill-conditioned matrices converge faster"
    ],
    "a": 1,
    "x": "The error contraction factor is $\\left(\\frac{\\kappa-1}{\\kappa+1}\\right)$. If $\\kappa=1000$, error decreases by only $\\approx (0.998)^2$ per step, causing pathological zig-zagging across the ravine."
  },
  {
    "tag": "Gram-Schmidt Orthogonalization Projection Recurrence",
    "lvl": "advanced",
    "q": "In the Gram-Schmidt process converting linearly independent vectors $\\{v_1, \\dots, v_k\\}$ into orthogonal basis $\\{u_1, \\dots, u_k\\}$, what is the exact formula for $u_k$?",
    "o": [
      "$u_k = v_k - v_{k-1}$",
      "$u_k = v_k - \\sum_{j=1}^{k-1} \\frac{\\langle v_k, u_j \\rangle}{\\langle u_j, u_j \\rangle} u_j$",
      "$u_k = v_k / \\|v_k\\|$",
      "$u_k = \\sum_{j=1}^k v_j$"
    ],
    "a": 1,
    "x": "Gram-Schmidt subtracts the orthogonal projections of $v_k$ onto all previously constructed orthogonal basis vectors $u_1, \\dots, u_{k-1}$."
  },
  {
    "tag": "Rank-Nullity Theorem Dimensions",
    "lvl": "advanced",
    "q": "For a linear map represented by matrix $A \\in \\mathbb{R}^{m \\times n}$, what fundamental equation relates the dimension of its Null Space (kernel) and Column Space (image)?",
    "o": [
      "$\\text{dim}(\\text{Null}(A)) + \\text{dim}(\\text{Col}(A)) = m$",
      "$\\text{dim}(\\text{Null}(A)) + \\text{dim}(\\text{Col}(A)) = n$ (where $n$ is the number of columns / dimension of the domain)",
      "$\\text{dim}(\\text{Null}(A)) = \\text{dim}(\\text{Col}(A))$",
      "$\\text{dim}(\\text{Null}(A)) \\times \\text{dim}(\\text{Col}(A)) = n$"
    ],
    "a": 1,
    "x": "The Rank-Nullity Theorem states $\\text{nullity}(A) + \\text{rank}(A) = n$, where $n$ is the dimension of the domain."
  },
  {
    "tag": "Matrix Inversion Lemma (Woodbury Formula)",
    "lvl": "advanced",
    "q": "What is the Sherman-Morrison-Woodbury matrix inversion identity for $(A + U C V)^{-1}$ where $A \\in \\mathbb{R}^{n \\times n}, U \\in \\mathbb{R}^{n \\times k}, C \\in \\mathbb{R}^{k \\times k}, V \\in \\mathbb{R}^{k \\times n}$?",
    "o": [
      "$(A + U C V)^{-1} = A^{-1} + U^{-1} C^{-1} V^{-1}$",
      "$(A + U C V)^{-1} = A^{-1} - A^{-1} U (C^{-1} + V A^{-1} U)^{-1} V A^{-1}$, reducing an $n \\times n$ matrix inversion to a $k \\times k$ inversion when $k \\ll n$",
      "$(A + U C V)^{-1} = (U C V)^{-1} A^{-1}$",
      "$(A + U C V)^{-1} = A^{-1} - U C V$"
    ],
    "a": 1,
    "x": "Woodbury formula allows updating an $n \\times n$ inverse with low-rank perturbations $U C V$ in $O(n^2 k + k^3)$ time instead of $O(n^3)$."
  },
  {
    "tag": "Matrix Trace and Determinant Invariance",
    "lvl": "advanced",
    "q": "Under a change of basis transformation $B = P^{-1} A P$ (where $P$ is an invertible matrix), which spectral properties of matrix $A$ remain invariant?",
    "o": [
      "Only the diagonal entries",
      "Both the **Trace** $\\text{tr}(A) = \\sum \\lambda_i$ and the **Determinant** $\\det(A) = \\prod \\lambda_i$ (along with all eigenvalues and the characteristic polynomial)",
      "Only the eigenvectors",
      "None; all change"
    ],
    "a": 1,
    "x": "Trace, determinant, eigenvalues, and characteristic polynomial are similarity invariants under change of basis: $\\det(P^{-1} A P) = \\det(A)$ and $\\text{tr}(P^{-1} A P) = \\text{tr}(A)$."
  },
  {
    "tag": "Spectral Theorem for Real Symmetric Matrices",
    "lvl": "advanced",
    "q": "What does the Spectral Theorem guarantee for any real symmetric matrix $A = A^T \\in \\mathbb{R}^{n \\times n}$?",
    "o": [
      "All eigenvalues are complex numbers",
      "All eigenvalues $\\lambda_i$ are purely real, eigenvectors from distinct eigenspaces are strictly orthogonal, and $A$ is orthogonally diagonalizable as $A = Q \\ Lambda Q^T$ where $Q^T Q = I$",
      "The matrix is singular",
      "The determinant is always 0"
    ],
    "a": 1,
    "x": "Real symmetric matrices have purely real eigenvalues and an orthonormal basis of eigenvectors, guaranteeing orthogonal diagonalizability."
  },
  {
    "tag": "Frobenius Norm vs Spectral 2-Norm Inequality",
    "lvl": "advanced",
    "q": "For a matrix $A \\in \\mathbb{R}^{m \\times n}$ with singular values $\\sigma_1 \\ge \\sigma_2 \\ge \\dots \\ge \\sigma_r > 0$, what exact relationship holds between the Spectral 2-Norm $\\|A\\|_2$ and the Frobenius Norm $\\|A\\|_F$?",
    "o": [
      "$\\|A\\|_2 = \\|A\\|_F$",
      "$\\|A\\|_2 = \\sigma_1$ and $\\|A\\|_F = \\sqrt{\\sum_{i=1}^r \\sigma_i^2}$, implying $\\|A\\|_2 \\le \\|A\\|_F \\le \\sqrt{\\min(m, n)} \\|A\\|_2$",
      "$\\|A\\|_F \\le \\|A\\|_2$",
      "$\\|A\\|_2 = \\sum \\sigma_i$"
    ],
    "a": 1,
    "x": "The spectral norm is the maximal singular value $\\sigma_1$. The Frobenius norm is the $L_2$ norm of all singular values $\\sqrt{\\sum \\sigma_i^2}$."
  },
  {
    "tag": "Vector Dual Norms (L1 and L-Infinity Duality)",
    "lvl": "advanced",
    "q": "By definition, the dual norm $\\|y\\|_* = \\sup_{\\|x\\| \\le 1} y^T x$. What is the dual norm of the $L_1$ norm $\\|x\\|_1 = \\sum |x_i|$?",
    "o": [
      "$L_2$ Euclidean norm",
      "The **$L_\\infty$ Max Norm** $\\|y\\|_\\infty = \\max_i |y_i|$ (and conversely, the dual norm of $L_\\infty$ is $L_1$, while $L_2$ is self-dual)",
      "$L_0$ pseudo-norm",
      "$L_p$ norm with $p=1$"
    ],
    "a": 1,
    "x": "By Hölder's inequality, the dual of $L_p$ is $L_q$ where $\\frac{1}{p} + \\frac{1}{q} = 1$. For $p=1$, $q=\\infty$, making $L_\\infty$ the dual norm of $L_1$."
  },
  {
    "tag": "Cayley-Hamilton Theorem",
    "lvl": "advanced",
    "q": "What does the Cayley-Hamilton theorem state about any square matrix $A \\in \\mathbb{R}^{n \\times n}$ and its characteristic polynomial $p(\\lambda) = \\det(\\lambda I - A)$?",
    "o": [
      "$p(A) = I$",
      "Every square matrix satisfies its own characteristic polynomial: $p(A) = A^n + c_{n-1} A^{n-1} + \\dots + c_0 I = \\mathbf{0}$ (the zero matrix)",
      "$p(A) = A^T$",
      "$p(A)$ has no roots"
    ],
    "a": 1,
    "x": "Cayley-Hamilton proves that substituting the matrix $A$ into its scalar characteristic polynomial yields the all-zero matrix $\\mathbf{0}$."
  },
  {
    "tag": "QR Decomposition via Householder Reflections",
    "lvl": "advanced",
    "q": "How does QR Decomposition $A = Q R$ represent an $m \\times n$ matrix $A$ ($m \\ge n$)?",
    "o": [
      "$Q$ is diagonal; $R$ is symmetric",
      "$Q \\in \\mathbb{R}^{m \\times m}$ is an **Orthogonal Matrix** ($Q^T Q = I$) and $R \\in \\mathbb{R}^{m \\times n}$ is an **Upper Triangular Matrix**, computed numerically stably via Householder reflections",
      "$Q$ is singular; $R$ is zero",
      "$Q$ contains eigenvalues"
    ],
    "a": 1,
    "x": "QR factorization decomposes a matrix into an orthogonal matrix $Q$ and upper triangular matrix $R$, widely used for solving least-squares problems stably."
  },
  {
    "tag": "Orthogonal Projection Matrix Idempotency",
    "lvl": "advanced",
    "q": "For a subspace spanned by the columns of full-rank matrix $A \\in \\mathbb{R}^{m \\times k}$, what is the orthogonal projection matrix $P$ onto $\\text{Col}(A)$, and what algebraic properties does $P$ satisfy?",
    "o": [
      "$P = A^T A$",
      "$P = A (A^T A)^{-1} A^T$; $P$ is symmetric ($P^T = P$) and **Idempotent** ($P^2 = P$)",
      "$P = A^{-1}$",
      "$P = I - A$"
    ],
    "a": 1,
    "x": "The projection matrix $P = A(A^T A)^{-1}A^T$ projects any vector orthogonally onto $\\text{Col}(A)$ and satisfies $P^2 = P$ and $P^T = P$."
  },
  {
    "tag": "Matrix Exponential and Lie Algebra so(3)",
    "lvl": "advanced",
    "q": "For a $3 \\times 3$ skew-symmetric matrix $\\Omega = -\\Omega^T \\in \\mathfrak{so}(3)$, what does the matrix exponential $\\exp(\\Omega) = \\sum_{k=0}^\\infty \\frac{\\Omega^k}{k!}$ evaluate to by Rodrigues' Rotation Formula?",
    "o": [
      "Zero matrix",
      "A **3D Rotation Matrix** $R \\in SO(3)$ (where $R^T R = I$ and $\\det(R) = +1$): $R = I + \\frac{\\sin \\theta}{\\theta} \\Omega + \\frac{1 - \\cos \\theta}{\\theta^2} \\Omega^2$ (where $\\theta = \\sqrt{\\frac{1}{2} \\text{tr}(\\Omega^T \\Omega)}$)",
      "A diagonal matrix",
      "An unbounded matrix"
    ],
    "a": 1,
    "x": "The matrix exponential maps elements of the Lie algebra $\\mathfrak{so}(3)$ (skew-symmetric matrices) to the Lie group $SO(3)$ (orthogonal rotation matrices) via Rodrigues' formula."
  },
  {
    "tag": "Finite Dimensional Vector Norm Equivalence",
    "lvl": "advanced",
    "q": "What does the Equivalence of Norms theorem state for any two norms $\\|\\cdot\\|_a$ and $\\|\\cdot\\|_b$ on a finite-dimensional vector space $\\mathbb{R}^n$?",
    "o": [
      "They are identical for all $x$",
      "There exist positive constants $0 < c_1 \\le c_2 < \\infty$ such that $c_1 \\|x\\|_a \\le \\|x\\|_b \\le c_2 \\|x\\|_a$ for all vectors $x \\in \\mathbb{R}^n$, guaranteeing identical topological convergence and open sets",
      "$\\|x\\|_a / \\|x\\|_b = 1$",
      "Norms cannot be compared"
    ],
    "a": 1,
    "x": "In finite dimensions, all norms induce the exact same topology: a sequence converges under $L_1$ if and only if it converges under $L_2$ or $L_\\infty$."
  }
]);

/* ===================================================================
   Module: opt — (8 Hardcore Questions)
   =================================================================== */

TD.addMCQ("math", "opt", [
  {
    "tag": "KKT Conditions for Constrained Optimization",
    "lvl": "advanced",
    "q": "For primal problem $\\min f(x)$ subject to $g_i(x) \\le 0$ and $h_j(x) = 0$, which condition represents **Complementary Slackness** in the Karush-Kuhn-Tucker (KKT) first-order optimality conditions?",
    "o": [
      "$\\nabla f(x) = 0$",
      "$\\lambda_i g_i(x) = 0$ for all $i$ (where $\\lambda_i \\ge 0$ are the inequality Lagrange multipliers, meaning either $\\lambda_i = 0$ or the constraint is active $g_i(x) = 0$)",
      "$g_i(x) \\ge 0$",
      "$\\sum h_j(x) = 1$"
    ],
    "a": 1,
    "x": "Complementary slackness $\\lambda_i g_i(x) = 0$ ensures inactive constraints ($g_i(x) < 0$) have zero multiplier $\\lambda_i = 0$, while active constraints ($g_i(x)=0$) have $\\lambda_i \\ge 0$."
  },
  {
    "tag": "Subgradients of Non-Smooth Convex Functions",
    "lvl": "advanced",
    "q": "What is the Subdifferential $\\partial f(x)$ of the non-smooth convex function $f(x) = |x|$ at the origin $x = 0$?",
    "o": [
      "$\\partial f(0) = 0$",
      "$\\partial f(0) = [-1, +1]$ (the entire closed continuous interval of slopes between $-1$ and $+1$ satisfying $f(y) \\ge f(0) + g^T (y - 0)$)",
      "$\\partial f(0) = \\emptyset$ (undefined)",
      "$\\partial f(0) = \\{-1, +1\\}$"
    ],
    "a": 1,
    "x": "At a non-differentiable point, the subdifferential is the set of all supporting hyperplane slopes. For $|x|$ at 0, any slope $g \\in [-1, 1]$ satisfies the convexity lower-bound."
  },
  {
    "tag": "Proximal Operator for L1 Regularization (Soft-Thresholding)",
    "lvl": "advanced",
    "q": "What is the analytical closed-form solution of the Proximal Operator $\\text{prox}_{\\lambda \\|\\cdot\\|_1}(v) = \\arg\\min_x \\left( \\lambda \\|x\\|_1 + \\frac{1}{2} \\|x - v\\|_2^2 \\right)$?",
    "o": [
      "$\\text{prox}(v) = v / \\lambda$",
      "The **Soft-Thresholding Operator** $S_\\lambda(v) = \\operatorname{sign}(v) \\max(0, |v| - \\lambda)$",
      "$\\text{prox}(v) = \\min(v, \\lambda)$",
      "$\\text{prox}(v) = v^2$"
    ],
    "a": 1,
    "x": "The proximal operator of the $L_1$ norm is coordinate-wise soft-thresholding, shrinking values toward 0 by $\\lambda$ and setting values in $[-\\lambda, \\lambda]$ strictly to 0."
  },
  {
    "tag": "Legendre-Fenchel Convex Conjugate",
    "lvl": "advanced",
    "q": "What is the Fenchel Conjugate $f^*(y) = \\sup_{x} (y^T x - f(x))$ for the quadratic function $f(x) = \\frac{1}{2} x^T A x$ where $A \\succ 0$ is symmetric positive definite?",
    "o": [
      "$f^*(y) = \\frac{1}{2} y^T A y$",
      "$f^*(y) = \\frac{1}{2} y^T A^{-1} y$",
      "$f^*(y) = \\det(A)$",
      "$f^*(y) = -\\frac{1}{2} x^T x$"
    ],
    "a": 1,
    "x": "Taking gradient $\\nabla_x (y^T x - \\frac{1}{2} x^T A x) = y - A x = 0 \\implies x = A^{-1} y$. Substituting back gives $f^*(y) = y^T A^{-1} y - \\frac{1}{2} y^T A^{-1} y = \\frac{1}{2} y^T A^{-1} y$."
  },
  {
    "tag": "Lipschitz Gradient & Descent Lemma",
    "lvl": "advanced",
    "q": "If a differentiable function $f$ has an $L$-Lipschitz continuous gradient ($\\|\\nabla f(x) - \\nabla f(y)\\| \\le L \\|x - y\\|$), what quadratic upper bound does the Descent Lemma guarantee?",
    "o": [
      "$f(y) \\le f(x)$",
      "$f(y) \\le f(x) + \\nabla f(x)^T (y - x) + \\frac{L}{2} \\|y - x\\|_2^2$, guaranteeing that taking a gradient step with step size $\\alpha \\le 1/L$ strictly decreases the objective",
      "$f(y) \\ge f(x) + L \\|y - x\\|^2$",
      "$f(y) = \\nabla f(x)^T y$"
    ],
    "a": 1,
    "x": "The Descent Lemma upper-bounds the function by a quadratic with curvature $L$, ensuring step size $\\alpha = 1/L$ yields guaranteed loss reduction $\\Delta f \\le -\\frac{1}{2L}\\|\\nabla f\\|^2$."
  },
  {
    "tag": "Polyak-Łojasiewicz (PL) Inequality",
    "lvl": "advanced",
    "q": "What condition does the Polyak-Łojasiewicz (PL) inequality $\\frac{1}{2} \\|\\nabla f(x)\\|_2^2 \\ge \\mu (f(x) - f^*)$ provide for gradient descent optimization without requiring strict convexity?",
    "o": [
      "Guarantees loss is 0 everywhere",
      "Guarantees **Linear Convergence** ($f(x_k) - f^* \\le (1 - \\mu/L)^k (f(x_0) - f^*)$) to global minimum even for non-convex functions where every stationary point is a global minimum",
      "Causes gradient descent to diverge",
      "Requires Hessian to be diagonal"
    ],
    "a": 1,
    "x": "The PL inequality is weaker than strong convexity (satisfied by overparameterized neural networks), yet sufficient to prove global linear convergence of gradient descent."
  },
  {
    "tag": "Strong Convexity Lower Bound",
    "lvl": "advanced",
    "q": "If function $f$ is $\\mu$-strongly convex, what strict quadratic lower bound holds for all $x, y$?",
    "o": [
      "$f(y) \\le f(x)$",
      "$f(y) \\ge f(x) + \\nabla f(x)^T (y - x) + \\frac{\\mu}{2} \\|y - x\\|_2^2$, implying $\\nabla^2 f(x) \\succeq \\mu I$",
      "$f(y) = f(x) + \\mu$",
      "$f(y) \\ge 0$"
    ],
    "a": 1,
    "x": "Strong convexity guarantees the function grows at least as fast as a quadratic bowl with curvature $\\mu$, ensuring a unique global minimum."
  },
  {
    "tag": "Second-Order Taylor Hessian Expansion",
    "lvl": "advanced",
    "q": "What is the multivariate Second-Order Taylor series expansion of scalar function $f(x)$ around perturbation $\\Delta x$?",
    "o": [
      "$f(x + \\Delta x) = f(x) + \\Delta x$",
      "$f(x + \\Delta x) = f(x) + \\nabla f(x)^T \\Delta x + \\frac{1}{2} \\Delta x^T \\nabla^2 f(x) \\Delta x + O(\\|\\Delta x\\|^3)$ where $\\nabla^2 f(x)$ is the Hessian matrix",
      "$f(x + \\Delta x) = \\nabla^2 f(x)$",
      "$f(x + \\Delta x) = \\det(H)$"
    ],
    "a": 1,
    "x": "The second-order Taylor expansion approximates local curvature using the Hessian matrix $\\nabla^2 f(x)$, forming the basis of Newton-Raphson optimization."
  }
]);

/* ===================================================================
   Module: prob — (26 Hardcore Questions)
   =================================================================== */

TD.addMCQ("math", "prob", [
  {
    "tag": "Jensen's Inequality and ELBO Derivation",
    "lvl": "advanced",
    "q": "For a strictly concave function $g(x) = \\ln(x)$, how does Jensen's Inequality $\\mathbb{E}[g(X)] \\le g(\\mathbb{E}[X])$ establish the Evidence Lower Bound (ELBO) in Variational Autoencoders?",
    "o": [
      "$\\ln p(x) = \\text{ELBO}$",
      "$\\ln p(x) = \\ln \\mathbb{E}_{q(z|x)} \\left[ \\frac{p(x, z)}{q(z|x)} \\right] \\ge \\mathbb{E}_{q(z|x)} \\left[ \\ln \\frac{p(x, z)}{q(z|x)} \\right] = \\text{ELBO}(q)$, guaranteeing the ELBO is a strict lower bound on marginal data log-likelihood",
      "$\\ln p(x) \\le \\text{ELBO}$",
      "ELBO equals KL divergence"
    ],
    "a": 1,
    "x": "Because log is concave, moving the expectation inside the logarithm yields a lower bound: $\\log \\mathbb{E}[X] \\ge \\mathbb{E}[\\log X]$. This defines the ELBO."
  },
  {
    "tag": "Law of Total Variance (Eve's Law)",
    "lvl": "advanced",
    "q": "What is the exact decomposition of total variance $\\text{Var}(Y)$ conditioned on random variable $X$ according to Eve's Law?",
    "o": [
      "$\\text{Var}(Y) = \\text{Var}(X) + \\text{Var}(Y|X)$",
      "$\\text{Var}(Y) = \\mathbb{E}[\\text{Var}(Y|X)] + \\text{Var}(\\mathbb{E}[Y|X])$ (the Expected Value of Conditional Variance plus the Variance of Conditional Expectation)",
      "$\\text{Var}(Y) = \\mathbb{E}[Y|X]^2$",
      "$\\text{Var}(Y) = \\text{Cov}(X, Y)$"
    ],
    "a": 1,
    "x": "Eve's Law splits total variance into unexplained within-group variance $\\mathbb{E}[\\text{Var}(Y|X)]$ and explained between-group variance $\\text{Var}(\\mathbb{E}[Y|X])$."
  },
  {
    "tag": "Markov vs Chebyshev Tail Probability Bounds",
    "lvl": "advanced",
    "q": "Given random variable $X$ with mean $\\mu$ and variance $\\sigma^2$, what upper bound does Chebyshev's Inequality place on the probability of deviating by $k$ standard deviations $P(|X - \\mu| \\ge k\\sigma)$?",
    "o": [
      "$P \\le 1/k$",
      "$P(|X - \\mu| \\ge k\\sigma) \\le \\frac{1}{k^2}$ (applying Markov's inequality to $(X-\\mu)^2$ with zero assumptions about distribution shape)",
      "$P \\le e^{-k}$",
      "$P \\le 1/k^3$"
    ],
    "a": 1,
    "x": "Chebyshev bounds deviation for any distribution with finite variance: $P(|X-\\mu| \\ge k\\sigma) = P((X-\\mu)^2 \\ge k^2\\sigma^2) \\le \\frac{\\mathbb{E}[(X-\\mu)^2]}{k^2\\sigma^2} = \\frac{1}{k^2}$."
  },
  {
    "tag": "Multivariate Gaussian Conditional Distribution",
    "lvl": "advanced",
    "q": "For joint Gaussian $X = \\begin{bmatrix} X_1 \\\\ X_2 \\end{bmatrix} \\sim \\mathcal{N}\\left( \\begin{bmatrix} \\mu_1 \\\\ \\mu_2 \\end{bmatrix}, \\begin{bmatrix} \\Sigma_{11} & \\Sigma_{12} \\\\ \\Sigma_{21} & \\Sigma_{22} \\end{bmatrix} \\right)$, what is the conditional distribution $X_1 | X_2 = x_2$?",
    "o": [
      "$\\mathcal{N}(\\mu_1, \\Sigma_{11})$",
      "$\\mathcal{N}\\left( \\mu_1 + \\Sigma_{12} \\Sigma_{22}^{-1} (x_2 - \\mu_2), \\; \\Sigma_{11} - \\Sigma_{12} \\Sigma_{22}^{-1} \\Sigma_{21} \\right)$",
      "$\\mathcal{N}(\\mu_1 + \\mu_2, \\Sigma_{12})$",
      "$\\mathcal{N}(x_2, \\Sigma_{22})$"
    ],
    "a": 1,
    "x": "Conditional Gaussian distribution has conditional mean $\\mu_1 + \\Sigma_{12}\\Sigma_{22}^{-1}(x_2 - \\mu_2)$ and Schur complement covariance $\\Sigma_{11} - \\Sigma_{12}\\Sigma_{22}^{-1}\\Sigma_{21}$."
  },
  {
    "tag": "Fisher Information Matrix and CRLB Bound",
    "lvl": "advanced",
    "q": "What fundamental lower bound does the Cramér-Rao Lower Bound (CRLB) place on the variance of any unbiased estimator $\\hat{\\theta}$ of parameter $\\theta$ with Fisher Information $I(\\theta) = -\\mathbb{E}\\left[ \\frac{\\partial^2 \\log p(x;\\theta)}{\\partial \\theta^2} \\right]$?",
    "o": [
      "$\\text{Var}(\\hat{\\theta}) \\ge I(\\theta)$",
      "$\\text{Var}(\\hat{\\theta}) \\ge \\frac{1}{I(\\theta)}$ (the inverse of the Fisher Information Matrix)",
      "$\\text{Var}(\\hat{\\theta}) = 0$",
      "$\\text{Var}(\\hat{\\theta}) \\le 1/I(\\theta)$"
    ],
    "a": 1,
    "x": "CRLB proves that the variance of any unbiased estimator cannot be smaller than the inverse of the Fisher Information matrix: $\\text{Cov}(\\hat{\\theta}) \\succeq I(\\theta)^{-1}$."
  },
  {
    "tag": "Jacobian Determinant Probability Density Transform",
    "lvl": "advanced",
    "q": "If continuous random variable vector $X \\in \\mathbb{R}^{n}$ with PDF $p_X(x)$ undergoes invertible, differentiable transformation $Y = g(X)$, what is the probability density function $p_Y(y)$?",
    "o": [
      "$p_Y(y) = p_X(g(y))$",
      "$p_Y(y) = p_X(g^{-1}(y)) \\cdot \\left| \\det \\left( \\frac{\\partial g^{-1}(y)}{\\partial y} \\right) \\right|$ (multiplied by the absolute value of the Jacobian determinant of the inverse transform)",
      "$p_Y(y) = p_X(y) / \\det(J)$",
      "$p_Y(y) = \\int p_X(x) dx$"
    ],
    "a": 1,
    "x": "Multivariate change-of-variables theorem scales probability density by the volume change factor $|det(J_{g^{-1}})|$, the foundation of Normalizing Flows."
  },
  {
    "tag": "Pinsker's Inequality (Total Variation vs KL)",
    "lvl": "advanced",
    "q": "What mathematical upper bound does Pinsker's Inequality establish between the Total Variation Distance $\\delta(P, Q) = \\frac{1}{2} \\sum |P(x) - Q(x)|$ and Kullback-Leibler Divergence $D_{\\text{KL}}(P || Q)$?",
    "o": [
      "$\\delta(P, Q) \\ge D_{\\text{KL}}(P || Q)$",
      "$\\delta(P, Q) \\le \\sqrt{\\frac{1}{2} D_{\\text{KL}}(P || Q)}$",
      "$\\delta(P, Q) = D_{\\text{KL}}(P || Q)^2$",
      "$\\delta(P, Q) \\le \\frac{1}{2} D_{\\text{KL}}(P || Q)$"
    ],
    "a": 1,
    "x": "Pinsker's inequality upper-bounds Total Variation distance by $\\sqrt{\\frac{1}{2} D_{\\text{KL}}(P || Q)}$, proving that small KL divergence strictly implies small TV distance."
  },
  {
    "tag": "Gaussian Integral via Polar Coordinates",
    "lvl": "advanced",
    "q": "What is the exact value of the improper integral $I = \\int_{-\\infty}^{\\infty} e^{-x^2} dx$, and how is it evaluated?",
    "o": [
      "$I = \\pi$",
      "$I = \\sqrt{\\pi}$ (evaluated by squaring $I^2 = \\int_{-\\infty}^\\infty \\int_{-\\infty}^\\infty e^{-(x^2+y^2)} dx dy$ and converting to polar coordinates $\\int_0^{2\\pi} d\\theta \\int_0^\\infty r e^{-r^2} dr = \\pi$)",
      "$I = 1$",
      "$I = e$"
    ],
    "a": 1,
    "x": "The Gaussian integral is solved by computing $I^2$ in 2D polar coordinates, yielding $\\pi$, thus $I = \\sqrt{\\pi}$."
  },
  {
    "tag": "Metropolis-Hastings Detailed Balance Acceptance Ratio",
    "lvl": "advanced",
    "q": "In MCMC sampling from target distribution $P(x)$ using proposal distribution $Q(x'|x)$, what is the Metropolis-Hastings acceptance probability $\\alpha(x, x')$ that satisfies the Detailed Balance condition?",
    "o": [
      "$\\alpha(x, x') = 1$",
      "$\\alpha(x, x') = \\min\\left( 1, \\; \\frac{P(x') Q(x | x')}{P(x) Q(x' | x)} \\right)$",
      "$\\alpha(x, x') = P(x') / P(x)$",
      "$\\alpha(x, x') = Q(x'|x) / Q(x|x')$"
    ],
    "a": 1,
    "x": "The Metropolis-Hastings acceptance ratio $\\min\\left(1, \\frac{P(x')Q(x|x')}{P(x)Q(x'|x)}\\right)$ guarantees that the stationary distribution of the Markov chain matches $P(x)$."
  },
  {
    "tag": "Wasserstein-1 Kantorovich-Rubinstein Duality",
    "lvl": "advanced",
    "q": "What is the dual formulation of 1-Wasserstein (Earth Mover's) Distance $W_1(P, Q)$ used in Wasserstein GAN (WGAN)?",
    "o": [
      "$W_1(P, Q) = \\|P - Q\\|_2$",
      "$W_1(P, Q) = \\sup_{\\|f\\|_L \\le 1} \\left( \\mathbb{E}_{x \\sim P}[f(x)] - \\mathbb{E}_{y \\sim Q}[f(y)] \\right)$ where supremum is taken over all **1-Lipschitz continuous functions** $f$",
      "$W_1(P, Q) = D_{\\text{KL}}(P || Q)$",
      "$W_1(P, Q) = \\min(P, Q)$"
    ],
    "a": 1,
    "x": "Kantorovich-Rubinstein duality transforms the intractable primal transport problem into maximizing expectation differences over 1-Lipschitz discriminator functions."
  },
  {
    "tag": "Itô's Lemma for Stochastic Calculus",
    "lvl": "advanced",
    "q": "For a stochastic process $X_t$ governed by SDE $dX_t = \\mu_t dt + \\sigma_t dW_t$ (where $W_t$ is standard Brownian motion), what is the Itô differential of a smooth function $f(t, X_t)$?",
    "o": [
      "$df = \\frac{\\partial f}{\\partial t} dt + \\frac{\\partial f}{\\partial x} dX_t$",
      "$df = \\left( \\frac{\\partial f}{\\partial t} + \\mu_t \\frac{\\partial f}{\\partial x} + \\frac{1}{2} \\sigma_t^2 \\frac{\\partial^2 f}{\\partial x^2} \\right) dt + \\sigma_t \\frac{\\partial f}{\\partial x} dW_t$ (including the second-order $(dX_t)^2 = \\sigma_t^2 dt$ correction term)",
      "$df = \\frac{\\partial^2 f}{\\partial x^2} dt$",
      "$df = dW_t$"
    ],
    "a": 1,
    "x": "Because $(dW_t)^2 = dt$, Taylor expansion in stochastic calculus retains the second-order spatial derivative term $\\frac{1}{2}\\sigma_t^2 \\frac{\\partial^2 f}{\\partial x^2} dt$, known as Itô's drift correction."
  },
  {
    "tag": "Fokker-Planck (Kolmogorov Forward) Equation",
    "lvl": "advanced",
    "q": "In continuous diffusion models (Song et al.), what partial differential equation describes the time evolution of the probability density $p(x, t)$ of an Itô diffusion process $dX_t = f(x, t) dt + g(t) dW_t$?",
    "o": [
      "Wave Equation",
      "The **Fokker-Planck Equation**: $\\frac{\\partial p(x, t)}{\\partial t} = -\\nabla_x \\cdot \\left[ f(x, t) p(x, t) \\right] + \\frac{1}{2} g(t)^2 \\nabla_x^2 p(x, t)$",
      "Heat Equation with zero drift",
      "Navier-Stokes equation"
    ],
    "a": 1,
    "x": "The Fokker-Planck equation governs the deterministic drift and stochastic diffusion evolution of probability density over time."
  },
  {
    "tag": "Central Limit Theorem Lindeberg Condition",
    "lvl": "advanced",
    "q": "What does the Central Limit Theorem (CLT) state regarding the normalized sum $Z_n = \\frac{\\sum_{i=1}^n (X_i - \\mu)}{\\sigma \\sqrt{n}}$ of independent identically distributed random variables with finite mean $\\mu$ and variance $\\sigma^2$?",
    "o": [
      "$Z_n$ converges to a uniform distribution",
      "$Z_n \\xrightarrow{d} \\mathcal{N}(0, 1)$ (converges in distribution to the standard normal distribution as $n \\to \\infty$ regardless of the underlying distribution of $X_i$)",
      "$Z_n$ equals 0",
      "$Z_n$ converges only if $X_i$ is already Gaussian"
    ],
    "a": 1,
    "x": "CLT proves asymptotic convergence in distribution to $\\mathcal{N}(0, 1)$ for sums of i.i.d. variables with finite second moment."
  },
  {
    "tag": "Moment Generating Function (MGF) Uniqueness Theorem",
    "lvl": "advanced",
    "q": "If the Moment Generating Function $M_X(t) = \\mathbb{E}[e^{tX}]$ of a random variable $X$ exists and is finite in an open neighborhood around $t = 0$, what does the MGF Uniqueness Theorem guarantee?",
    "o": [
      "$X$ is a discrete variable",
      "The MGF **uniquely determines the probability distribution** of $X$ (if $M_X(t) = M_Y(t)$ for all $t \\in (-\\epsilon, \\epsilon)$, then $F_X(u) = F_Y(u)$ everywhere)",
      "All moments of $X$ are zero",
      "$X$ must be Gaussian"
    ],
    "a": 1,
    "x": "A finite MGF in an open interval around the origin uniquely characterizes the cumulative distribution function and all moments."
  },
  {
    "tag": "MLE Asymptotic Normality and Efficiency",
    "lvl": "advanced",
    "q": "Under standard regularity conditions, what asymptotic distribution does the Maximum Likelihood Estimator $\\hat{\\theta}_n$ follow as sample size $n \\to \\infty$?",
    "o": [
      "Cauchy distribution",
      "$\\sqrt{n}(\\hat{\\theta}_n - \\theta_0) \\xrightarrow{d} \\mathcal{N}\\left(0, \\; I(\\theta_0)^{-1}\\right)$ where $I(\\theta_0)$ is the Fisher Information, achieving the Cramér-Rao lower bound asymptotically (asymptotically efficient)",
      "Uniform distribution in $[0, 1]$",
      "Student's t-distribution with 1 df"
    ],
    "a": 1,
    "x": "MLE estimators are asymptotically unbiased, asymptotically normal, and achieve the minimum possible asymptotic variance $I(\\theta)^{-1}$."
  },
  {
    "tag": "Gibbs' Inequality on KL Divergence Non-Negativity",
    "lvl": "advanced",
    "q": "How is the non-negativity of Kullback-Leibler Divergence $D_{\\text{KL}}(P || Q) = \\sum P(x) \\ln \\frac{P(x)}{Q(x)} \\ge 0$ proven using the fundamental inequality $-\\ln u \\ge 1 - u$?",
    "o": [
      "By taking derivatives",
      "$-D_{\\text{KL}}(P || Q) = \\sum P(x) \\ln \\frac{Q(x)}{P(x)} \\le \\sum P(x) \\left( \\frac{Q(x)}{P(x)} - 1 \\right) = \\sum Q(x) - \\sum P(x) = 1 - 1 = 0$, proving $D_{\\text{KL}} \\ge 0$ with equality iff $P=Q$",
      "By integrating from 0 to 1",
      "By using Pythagoras theorem"
    ],
    "a": 1,
    "x": "Gibbs' inequality is a direct consequence of $-\\ln(u) \\ge 1 - u$ for all $u > 0$, guaranteeing non-negativity of relative entropy."
  },
  {
    "tag": "Chi-Square Quadratic Forms of Standard Normal Vectors",
    "lvl": "advanced",
    "q": "If $X = [X_1, X_2, \\dots, X_k]^T$ is a vector of $k$ independent standard normal random variables ($X_i \\sim \\mathcal{N}(0, 1)$), what is the exact probability distribution of the squared Euclidean norm $\\|X\\|_2^2 = X^T X = \\sum_{i=1}^k X_i^2$?",
    "o": [
      "Student's t-distribution with $k$ df",
      "The **Chi-Square Distribution with $k$ degrees of freedom** ($\\chi^2_k$), with mean $k$ and variance $2k$",
      "F-distribution",
      "Beta distribution"
    ],
    "a": 1,
    "x": "The sum of squares of $k$ independent standard normal variables follows a $\\chi^2$ distribution with $k$ degrees of freedom."
  },
  {
    "tag": "Laplace Approximation for Posterior Densities",
    "lvl": "advanced",
    "q": "How does the Laplace Approximation approximate an intractable posterior probability density $p(\\theta | D) \\propto p(D | \\theta) p(\\theta)$ around its Maximum A Posteriori (MAP) mode $\\hat{\\theta}$?",
    "o": [
      "By sampling with Monte Carlo",
      "Fits a second-order Taylor expansion to the log-posterior $\\log p(\\theta, D)$ around $\\hat{\\theta}$, approximating the posterior as a Gaussian $\\mathcal{N}(\\hat{\\theta}, \\Sigma)$ where covariance $\\Sigma = \\left( -\\nabla^2 \\log p(\\hat{\\theta}, D) \\right)^{-1}$ is the inverse negative Hessian",
      "Replaces posterior with a uniform distribution",
      "Rounds values to integers"
    ],
    "a": 1,
    "x": "Laplace approximation expands $\\log p(\\theta)$ around the MAP estimate $\\hat{\\theta}$, approximating the unnormalized posterior as a Gaussian with inverse Hessian covariance."
  },
  {
    "tag": "Fourier Transform and Convolution Theorem",
    "lvl": "advanced",
    "q": "What does the Convolution Theorem state about the continuous Fourier Transform $\\mathcal{F}\\{f * g\\}$ of two signals $f(t)$ and $g(t)$?",
    "o": [
      "$mathcal{F}\\{f * g\\} = \\mathcal{F}\\{f\\} + \\mathcal{F}\\{g\\}$",
      "$\\mathcal{F}\\{f * g\\} = \\mathcal{F}\\{f\\} \\cdot \\mathcal{F}\\{g\\}$ (spatial/time domain convolution is mathematically equivalent to pointwise multiplication in the frequency domain)",
      "$mathcal{F}\\{f * g\\} = \\mathcal{F}\\{f\\} / \\mathcal{F}\\{g\\}$",
      "$mathcal{F}\\{f * g\\} = 0$"
    ],
    "a": 1,
    "x": "The Convolution Theorem proves that convolution in time/space maps to simple point-wise multiplication in the frequency domain."
  },
  {
    "tag": "Natural Gradient and Fisher-Rao Information Metric",
    "lvl": "advanced",
    "q": "In Information Geometry (Amari), why does the **Natural Gradient** $\\tilde{\\nabla} L(\\theta) = I(\\theta)^{-1} \\nabla_\\theta L(\\theta)$ optimize probability distributions faster than standard Euclidean gradient descent?",
    "o": [
      "It uses faster CPU instructions",
      "Standard gradient descent depends on arbitrary parameter coordinate choices; Natural Gradient steps along the steepest descent direction on the **Riemannian Manifold of probability distributions** defined by the Fisher Information metric tensor, invariant to reparameterization",
      "It eliminates matrix multiplications",
      "It forces learning rate to 1.0"
    ],
    "a": 1,
    "x": "Natural gradient descent moves in the direction of steepest descent invariant to coordinate parameterization by measuring distance via KL divergence on the Riemannian manifold."
  },
  {
    "tag": "Continuous Conjugate Priors Updating",
    "lvl": "advanced",
    "q": "When modeling observations $X_1, \\dots, X_n \\sim \\text{Bernoulli}(p)$ with prior $p \\sim \\text{Beta}(\\alpha, \\beta)$, what is the analytical posterior distribution $p | X$?",
    "o": [
      "$p | X \\sim \\text{Gaussian}(\\alpha, \\beta)$",
      "$\\text{Beta}(\\alpha + \\sum X_i, \\; \\beta + n - \\sum X_i)$, directly updating the prior pseudo-counts algebraically without numerical integration",
      "$p | X \\sim \\text{Gamma}(\\alpha, \\beta)$",
      "$p | X \\sim \\text{Uniform}(0, 1)$"
    ],
    "a": 1,
    "x": "Beta is conjugate to Bernoulli/Binomial. The posterior simply adds the number of observed successes to $\\alpha$ and failures to $\\beta$."
  },
  {
    "tag": "Markov Chain Stationary Distribution Invariance",
    "lvl": "advanced",
    "q": "For an irreducible, aperiodic, finite Markov chain with transition probability matrix $P$, what does the Perron-Frobenius theorem guarantee regarding its stationary distribution $\\pi$?",
    "o": [
      "Stationary distribution does not exist",
      "There exists a **unique stationary distribution vector** $\\pi > 0$ such that $\\pi P = \\pi$ and $\\sum \\pi_i = 1$, and $\\lim_{n \\to \\infty} P^n = \\mathbf{1} \\pi$",
      "$\\pi = [0, 0, \\dots, 0]$",
      "The eigenvalues of $P$ are all $> 1$"
    ],
    "a": 1,
    "x": "Perron-Frobenius ensures a unique strictly positive stationary eigenvector with eigenvalue $\\lambda_1 = 1$, to which the chain converges from any initial state."
  },
  {
    "tag": "Poisson Process Memoryless Property",
    "lvl": "advanced",
    "q": "For a homogeneous Poisson process with rate $\\lambda$, what is the probability distribution of the waiting time $T$ between consecutive event arrivals, and what memoryless identity does it satisfy?",
    "o": [
      "$T \\sim \\text{Poisson}(\\lambda)$; $P(T > t+s) = P(T > t) + P(T > s)$",
      "$T \\sim \\text{Exponential}(\\lambda)$ with PDF $f(t) = \\lambda e^{-\\lambda t}$; satisfying $P(T > t + s \\mid T > s) = P(T > t)$ for all $s, t \\ge 0$",
      "$T \\sim \\text{Gaussian}(\\lambda, \\lambda^2)$",
      "$T \\sim \\text{Weibull}(\\lambda)$"
    ],
    "a": 1,
    "x": "Inter-arrival times in a Poisson process follow an exponential distribution, which is the unique continuous memoryless distribution."
  },
  {
    "tag": "Martingale Sequence Expectation Invariant",
    "lvl": "advanced",
    "q": "A stochastic process $\\{X_n\\}_{n \\ge 0}$ adapted to filtration $\\mathcal{F}_n$ is a **Martingale** if for all $n$, which expectation property holds?",
    "o": [
      "$\\mathbb{E}[X_{n+1} \\mid \\mathcal{F}_n] = 0$",
      "$\\mathbb{E}[X_{n+1} \\mid \\mathcal{F}_n] = X_n$ (and $\\mathbb{E}[|X_n|] < \\infty$), meaning the conditional expected value of the next state given all historical observations equals the present value",
      "$\\mathbb{E}[X_{n+1} \\mid \\mathcal{F}_n] > X_n$",
      "$\\mathbb{E}[X_{n+1}] = n X_0$"
    ],
    "a": 1,
    "x": "A martingale models a fair game where the conditional expectation of future wealth given history is equal to current wealth."
  },
  {
    "tag": "Gibbs Sampling Metropolis Acceptance Proof",
    "lvl": "advanced",
    "q": "Why does Gibbs sampling (sampling variable $x_i \\sim P(x_i \\mid x_{-i})$ one coordinate at a time) have a Metropolis-Hastings acceptance probability of **exactly $\\alpha = 1.0$** (100% acceptance)?",
    "o": [
      "Because proposals are generated randomly",
      "Because the proposal distribution is chosen to be the exact full conditional $Q(x' \\mid x) = P(x_i' \\mid x_{-i})$, making the ratio $\\frac{P(x') Q(x \\mid x')}{P(x) Q(x' \\mid x)} = \\frac{P(x_i' \\mid x_{-i}) P(x_{-i}) \\cdot P(x_i \\mid x_{-i})}{P(x_i \\mid x_{-i}) P(x_{-i}) \\cdot P(x_i' \\mid x_{-i})} = 1.0$",
      "Because Gibbs sampling is non-stochastic",
      "Because it uses Gaussian distributions"
    ],
    "a": 1,
    "x": "Gibbs sampling sets the proposal to the exact conditional distribution, causing target and proposal factors to cancel algebraically to $1.0$."
  },
  {
    "tag": "Kantorovich Relaxation in Optimal Transport",
    "lvl": "advanced",
    "q": "How did Leonid Kantorovich's formulation solve the unsolvable Monge optimal transport problem when splitting mass from source measure $\\mu$ to target measure $\\nu$?",
    "o": [
      "By rounding numbers to integers",
      "Replaced deterministic point-to-point transport maps $T(x) = y$ with a **Joint Coupling Measure (Transport Plan)** $\\gamma \\in \\Pi(\\mu, \\nu)$ that allows mass from a single point $x$ to be split across multiple destination points $y$, formulating OT as a convex linear programming problem $\\min_\\gamma \\int c(x, y) d\\gamma(x, y)$",
      "By ignoring transportation cost",
      "By setting transport distance to 0"
    ],
    "a": 1,
    "x": "Kantorovich relaxed Monge's rigid deterministic mapping into a joint probability coupling $\\gamma(x, y)$, making optimal transport convex and solvable via linear programming."
  }
]);

