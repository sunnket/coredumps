/* Python — NumPy. */
TD.addLessons("python", [

{
 t: "Why Python Loops Are Slow",
 m: "numpy",
 lvl: "intermediate",
 s: "The honest explanation, and the single idea that makes numerical Python fast.",
 goal: [
  "Explain what Python is actually doing on every iteration of a loop",
  "Say what vectorisation means and why it is faster",
  "Recognise when a loop should become an array operation"
 ],
 b: [
  { p: "The Python track's first lesson said Python is slower than C and buys readability with the difference. This lesson is where that bill arrives, and where you learn how the entire data world avoids paying it." },

  { h: "What one loop iteration costs" },
  { p: "In C, adding two numbers is one machine instruction. In Python, `a + b` is a small ceremony." },
  { ol: [
   "Look up the name `a`, then `b` — dictionary lookups, not fixed memory offsets.",
   "Both are **objects on the heap**, not raw numbers. A Python `int` is a struct carrying a type pointer, a reference count and the value.",
   "Ask `a`'s type for its `__add__` method.",
   "Call it, checking types on the way.",
   "**Allocate a brand-new object** for the result, because integers are immutable.",
   "Adjust reference counts so the garbage collector stays correct."
  ] },
  { p: "That is roughly fifty to a hundred times the work of the machine instruction it wraps. Over a million iterations it is the difference between a second and a minute." },

  { code: { lang: "python", t: "Measure it rather than take my word for it",
    lines: [
     { c: "import time, numpy as np", w: "" },
     { c: "", w: "" },
     { c: "n = 5_000_000", w: "**Underscores in a number are ignored by Python** and make large literals readable. Purely cosmetic and worth using." },
     { c: "py_list = list(range(n))", w: "" },
     { c: "np_arr = np.arange(n)", w: "NumPy's equivalent, which the next lesson explains." },
     { c: "", w: "" },
     { c: "t = time.perf_counter()", w: "`perf_counter` is the right clock for measuring elapsed time." },
     { c: "total = 0", w: "" },
     { c: "for x in py_list:", w: "**Five million times through the ceremony above.**" },
     { c: "    total += x * 2" },
     { c: "print(f\"loop:  {time.perf_counter() - t:.3f}s\")" },
     { c: "", w: "" },
     { c: "t = time.perf_counter()", w: "" },
     { c: "total = (np_arr * 2).sum()", w: "**One Python statement.** The multiplication and the sum both happen inside compiled C, over a contiguous block of memory, with no Python objects created at all.", hi: true },
     { c: "print(f\"numpy: {time.perf_counter() - t:.3f}s\")" }
    ],
    out: "loop:  0.612s\nnumpy: 0.011s",
    after: "Roughly fifty times faster, and the NumPy version is shorter and easier to read. That combination is the reason the scientific Python world exists." } },

  { h: "Where the speed comes from" },
  { tbl: { t: "A Python list versus a NumPy array, in memory",
    h: ["", "list", "ndarray"],
    rows: [
     ["What it holds", "**Pointers** to objects scattered across the heap", "**The values themselves**, in one contiguous block"],
     ["Types", "Anything, mixed", "One type for the whole array, fixed"],
     ["Memory for a million ints", "~40 MB", "~8 MB"],
     ["Adding to every element", "A Python loop, one object at a time", "A C loop over adjacent memory"],
     ["CPU cache", "Poor — every element is a jump elsewhere", "Excellent — the next value is already loaded"],
     ["Vector instructions", "Impossible", "The CPU processes 4–8 values per instruction"]
    ] } },
  { p: "The contiguity is doing more work than it appears to. A modern CPU fetches memory in blocks, so reading one number from a packed array brings the next several along for free. A list of pointers defeats that entirely — every element is a jump to somewhere unrelated." },

  { h: "Vectorisation" },
  { p: "**Vectorisation** means expressing an operation over a whole array at once, instead of writing the loop yourself. The loop still happens — it happens in C, once, with none of the per-element overhead." },

  { vs: { t: "The same calculation, both ways", lang: "python",
    bad: { c: "celsius = [0, 20, 37, 100]\nfahrenheit = []\nfor c in celsius:\n    fahrenheit.append(c * 9 / 5 + 32)", label: "The loop you know how to write",
      w: "Four lines, an accumulator, and every one of those additions paid the full Python object cost." },
    good: { c: "celsius = np.array([0, 20, 37, 100])\nfahrenheit = celsius * 9 / 5 + 32", label: "Vectorised",
      w: "One line that reads like the formula it implements. `celsius * 9` produces a whole new array in C; so does each subsequent step." } } },

  { n: "This changes how you think, and that is the real lesson. In plain Python you ask *what do I do to each item*. In NumPy and pandas you ask *what do I do to the whole column*. Every time you find yourself writing `for` over a numeric array, stop and look for the array operation — it is nearly always there, nearly always shorter, and often a hundred times faster.",
    nt: "The mental shift" },

  { h: "The honest limits" },
  { l: [
   "**Small data.** Under a few thousand elements, NumPy's setup cost can make it slower. Do not reach for it to add up ten numbers.",
   "**Non-numeric work.** Arrays of arbitrary Python objects get none of the benefit — you are back to pointers.",
   "**Genuinely sequential logic.** When each step depends on the previous one in a way that cannot be expressed as an array operation, a loop is correct.",
   "**Memory.** An array is contiguous, so it must fit in one continuous block. This is exactly the wall the final module is about."
  ] },
  { trap: "`np.vectorize` sounds like the answer and is not. It is a convenience wrapper that still loops in Python — it makes code tidier and gives you essentially no speed. Real speed comes from NumPy's own operations (`+`, `*`, `np.where`, `np.sum`) which are implemented in C." },

  { tryit: { t: "Feel the difference yourself",
    task: "Time computing the sum of squares of ten million numbers three ways: a `for` loop, a generator expression with `sum()`, and NumPy. Predict the order before you run it.",
    hint: "`np.arange(n) ** 2` then `.sum()`. The generator will be close to the loop — laziness saves memory, not arithmetic.",
    sol: { lang: "python", code: "import time, numpy as np\nn = 10_000_000\n\nt = time.perf_counter()\ntotal = 0\nfor x in range(n):\n    total += x * x\nprint(f\"loop:      {time.perf_counter() - t:.3f}s\")\n\nt = time.perf_counter()\ntotal = sum(x * x for x in range(n))\nprint(f\"generator: {time.perf_counter() - t:.3f}s\")\n\nt = time.perf_counter()\ntotal = (np.arange(n) ** 2).sum()\nprint(f\"numpy:     {time.perf_counter() - t:.3f}s\")" },
    w: "The generator is roughly as slow as the loop, which is the useful surprise. Laziness is about *memory*, not speed — the per-element Python overhead is identical. Only dropping into C removes it." } }
 ],
 k: [
  "Every Python arithmetic operation involves lookups, method dispatch and allocating a new object.",
  "A list holds pointers to scattered objects; an ndarray holds the values themselves, packed contiguously.",
  "Vectorisation means describing the operation over the whole array so the loop happens in C.",
  "Stop writing `for` over numeric data — ask what to do to the whole column instead."
 ],
 r: ["NumPy", "Array", "CPU Cache", "Time Complexity"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "import numpy as np", w: "import NumPy under its universal alias" },
   { c: "celsius = np.array([0, 20, 37, 100])", w: "build an array from a Python list" },
   { c: "fahrenheit = celsius * 9 / 5 + 32", w: "convert a whole array at once, with no loop" },
   { c: "total = (np_arr * 2).sum()", w: "double every element and add them up, entirely in C" },
   { c: "t = time.perf_counter()", w: "start a timer for measuring how long something takes" }
  ]
 }
},

{
 t: "The ndarray",
 m: "numpy",
 lvl: "intermediate",
 s: "One data structure that every scientific library in Python is built on.",
 goal: [
  "Create arrays in the four ways that matter",
  "Read `shape`, `dtype` and `ndim` and say what each tells you",
  "Index and slice in more than one dimension"
 ],
 b: [
  { p: "**`ndarray`** — N-dimensional array — is NumPy's single data structure. pandas is built on it, scikit-learn takes it as input, PyTorch and TensorFlow copied its interface. Learning it once pays across the whole ecosystem." },

  { h: "Creating one" },
  { code: { lang: "python",
    lines: [
     { c: "import numpy as np", w: "**`np` is not optional in practice.** Every book, tutorial and codebase uses it; anything else looks wrong." },
     { c: "", w: "" },
     { c: "a = np.array([1, 2, 3, 4])", w: "**From a Python list.** The most common starting point, and the slowest — it copies everything." },
     { c: "b = np.zeros(5)", w: "Five zeros, as floats. `np.ones` and `np.full(5, 7)` follow the same shape." },
     { c: "c = np.arange(0, 10, 2)", w: "**Like `range`, but produces an array** and accepts floats for the step, which `range` does not." },
     { c: "d = np.linspace(0, 1, 5)", w: "**Five values evenly spaced from 0 to 1 inclusive.** `arange` takes a step and `linspace` takes a count — that is the whole difference, and `linspace` is what you want for plotting." },
     { c: "e = np.random.default_rng(42).normal(size=1000)", w: "A thousand samples from a normal distribution. **`default_rng(seed)` is the modern API** — seeding it makes the result reproducible, which matters enormously in anything scientific." }
    ] } },

  { h: "The three attributes you check constantly" },
  { code: { lang: "python",
    lines: [
     { c: "m = np.array([[1, 2, 3], [4, 5, 6]])", w: "**A nested list becomes a 2-D array.** Two rows, three columns." },
     { c: "", w: "" },
     { c: "print(m.shape)", w: "**A tuple: the size along each dimension.** `(rows, columns)`. This is the first thing to print when anything goes wrong." },
     { c: "print(m.ndim)", w: "How many dimensions. 1 is a vector, 2 a matrix, 3+ a tensor." },
     { c: "print(m.dtype)", w: "**The single type of every element.** Not `int` — `int64`, with an explicit size in bits, because the memory layout is fixed." },
     { c: "print(m.size)", w: "Total number of elements, which is `shape` multiplied out." }
    ],
    out: "(2, 3)\n2\nint64\n6" } },
  { n: "`shape` is the diagnostic. Nearly every NumPy error — and a very large share of machine-learning errors — is two arrays whose shapes do not line up. `ValueError: operands could not be broadcast together with shapes (3,) (4,)` is that message, and printing `.shape` on both sides answers it immediately.",
    nt: "Print the shape first, always" },

  { h: "dtype, and why it bites" },
  { code: { lang: "python",
    lines: [
     { c: "a = np.array([1, 2, 3])", w: "Inferred as `int64` — every element is a whole number." },
     { c: "a[0] = 3.7", w: "**Silently truncated to 3.** The array's type is fixed at creation, so the float is coerced with no warning. This is a real and quiet source of wrong numbers." },
     { c: "print(a)" },
     { c: "", w: "" },
     { c: "b = np.array([1, 2, 3], dtype=float)", w: "**Say what you want.** Now `b[0] = 3.7` keeps the 3.7." },
     { c: "c = a.astype(float)", w: "Or convert afterwards — `astype` always returns a **new** array; it never changes the original." },
     { c: "", w: "" },
     { c: "d = np.array([1, 2, \"three\"])", w: "**Mixed types collapse to strings.** NumPy has one type per array, so it widens everything to the only type that fits — and now your numbers are text and arithmetic fails." },
     { c: "print(d.dtype)" }
    ],
    out: "[3 2 3]\n<U21" } },
  { trap: "`<U21` means *Unicode string, up to 21 characters*. Seeing it where you expected numbers means something non-numeric got into your data — a header row read as data, an empty field, an `N/A`. It is one of the most common data-loading bugs, and the `dtype` is what tells you." },

  { h: "Indexing" },
  { code: { lang: "python",
    lines: [
     { c: "a = np.arange(10)", w: "0 through 9." },
     { c: "print(a[0], a[-1])", w: "**Exactly like a list.** Everything you know about indexing carries over." },
     { c: "print(a[2:5])", w: "And slicing." },
     { c: "", w: "" },
     { c: "m = np.array([[1, 2, 3], [4, 5, 6]])", w: "" },
     { c: "print(m[0, 2])", w: "**Row 0, column 2 — one pair of brackets, comma separated.** `m[0][2]` also works but is slower, because it builds an intermediate array for the row." },
     { c: "print(m[0])", w: "A whole row." },
     { c: "print(m[:, 1])", w: "**A whole column.** The colon means *every row*, then column 1. **This is the notation you will use most**, and it has no equivalent in a list of lists.", hi: true },
     { c: "print(m[:, 1:])", w: "Every row, columns 1 onwards. Slicing works in each dimension independently." }
    ],
    out: "0 9\n[2 3 4]\n3\n[1 2 3]\n[2 5]\n[[2 3]\n [5 6]]" } },

  { trap: "**A NumPy slice is a *view*, not a copy.** `b = a[2:5]` shares memory with `a`, so `b[0] = 99` changes `a` too. This is the opposite of a Python list slice, which copies — and it is deliberate, because copying gigabytes on every slice would be ruinous. When you need independence, say so: `b = a[2:5].copy()`." },

  { h: "Reshaping" },
  { code: { lang: "python",
    lines: [
     { c: "a = np.arange(12)", w: "Twelve values in a line." },
     { c: "m = a.reshape(3, 4)", w: "**Three rows of four.** The total must match — `reshape(3, 5)` raises, because 15 ≠ 12. No data moves; it is the same memory read differently." },
     { c: "m = a.reshape(3, -1)", w: "**`-1` means *work it out*.** With 12 elements and 3 rows, the columns must be 4. Extremely common when one dimension is known and the other is not." },
     { c: "", w: "" },
     { c: "print(m.T)", w: "**Transpose** — rows become columns. Also a view, and free." },
     { c: "print(m.flatten())", w: "Back to one dimension. `flatten` copies; `ravel` returns a view when it can." }
    ] } },

  { tryit: { t: "Build and inspect",
    task: "Make a 4×3 array of the numbers 1 to 12. Print its shape and dtype. Extract the second column, the last row, and the bottom-right 2×2 block. Then convert it to floats and confirm the original is unchanged.",
    hint: "`np.arange(1, 13).reshape(4, 3)`. For the block, slice both dimensions with negative indices.",
    sol: { lang: "python", code: "import numpy as np\n\nm = np.arange(1, 13).reshape(4, 3)\nprint(m.shape, m.dtype)   # (4, 3) int64\n\nprint(m[:, 1])            # [ 2  5  8 11]\nprint(m[-1])              # [10 11 12]\nprint(m[-2:, -2:])        # [[ 8  9]\n                          #  [11 12]]\n\nf = m.astype(float)\nprint(m.dtype, f.dtype)   # int64 float64" },
    w: "`m[-2:, -2:]` is the last two rows and the last two columns. Slicing each dimension independently is what makes NumPy indexing so much more expressive than nested lists." } }
 ],
 k: [
  "`ndarray` is one contiguous block with a single `dtype`, and every scientific library is built on it.",
  "`shape`, `dtype` and `ndim` are the diagnostics — print `shape` first when anything misbehaves.",
  "`m[:, 1]` takes a whole column; each dimension slices independently.",
  "A NumPy slice is a **view** that shares memory — use `.copy()` when you need independence."
 ],
 r: ["NumPy", "Array", "Data Type", "Matrix", "Tensor"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "m = np.arange(12).reshape(3, 4)", w: "make twelve values and lay them out as three rows of four" },
   { c: "print(m.shape)", w: "check the size along each dimension" },
   { c: "print(m[:, 1])", w: "take the whole of column one" },
   { c: "print(m[0, 2])", w: "take the value at row zero, column two" },
   { c: "m = a.reshape(3, -1)", w: "reshape to three rows and let NumPy work out the columns" },
   { c: "b = a[2:5].copy()", w: "take a slice that does not share memory with the original" }
  ]
 }
},

{
 t: "Broadcasting and Vectorised Operations",
 m: "numpy",
 lvl: "advanced",
 s: "How NumPy combines arrays of different shapes — and the rule that decides whether it will.",
 goal: [
  "Apply an operation across a whole array without a loop",
  "State the broadcasting rule and use it to predict a result shape",
  "Read a shape-mismatch error and fix it"
 ],
 b: [
  { p: "Every arithmetic operator in NumPy works element by element, and this is where the fifty-times speed-up actually lives." },

  { code: { lang: "python", t: "Element-wise arithmetic",
    lines: [
     { c: "a = np.array([1, 2, 3])", w: "" },
     { c: "b = np.array([10, 20, 30])", w: "" },
     { c: "", w: "" },
     { c: "print(a + b)", w: "Position by position, in C. Nothing here loops in Python." },
     { c: "print(a * b)", w: "**Element-wise multiply — not matrix multiplication.** Everyone coming from linear algebra expects otherwise once." },
     { c: "print(a @ b)", w: "**`@` is the matrix product**, and here that means the dot product: 1·10 + 2·20 + 3·30." },
     { c: "print(a ** 2)", w: "Every element squared." },
     { c: "print(np.sqrt(a))", w: "**A universal function** — `np.sqrt`, `np.exp`, `np.log`, `np.sin` all apply element-wise in C." }
    ],
    out: "[11 22 33]\n[10 40 90]\n140\n[1 4 9]\n[1.  1.41421356 1.73205081]" } },

  { h: "Broadcasting" },
  { p: "The obvious question: what happens when the shapes differ? NumPy has a precise answer, and it is one of the best ideas in the library." },
  { code: { lang: "python",
    lines: [
     { c: "a = np.array([1, 2, 3])", w: "Shape `(3,)`." },
     { c: "print(a * 2)", w: "**The scalar is stretched to match.** No array of twos is ever built — NumPy simply reuses the value. That is broadcasting in its simplest form, and you have been using it since the first lesson." },
     { c: "", w: "" },
     { c: "m = np.array([[1, 2, 3], [4, 5, 6]])", w: "Shape `(2, 3)`." },
     { c: "row = np.array([10, 20, 30])", w: "Shape `(3,)`." },
     { c: "print(m + row)", w: "**The row is applied to every row of the matrix.** Adding a per-column offset to a whole table, in one operation and with no copy.", hi: true }
    ],
    out: "[2 4 6]\n[[11 22 33]\n [14 25 36]]" } },

  { h: "The rule" },
  { p: "Compare the shapes **from the right**. Two dimensions are compatible when they are equal, **or** when one of them is 1. A missing dimension counts as 1." },
  { code: { lang: "text", t: "Worked, right to left",
    lines: [
     { c: "  (2, 3)      m", w: "" },
     { c: "     (3,)     row", w: "" },
     { c: "  --------", w: "" },
     { c: "  (2, 3)      result", w: "**Rightmost: 3 vs 3, equal — fine. Next: 2 vs nothing, treated as 1 — stretched to 2.** Result `(2, 3)`." },
     { c: "", w: "" },
     { c: "  (3, 1)      column vector", w: "" },
     { c: "     (4,)     row vector", w: "" },
     { c: "  --------", w: "" },
     { c: "  (3, 4)      result", w: "**Rightmost: 1 vs 4, one is 1 — stretched to 4. Next: 3 vs nothing — stretched to 3.** An outer product, from two 1-D arrays." },
     { c: "", w: "" },
     { c: "  (3,)        ", w: "" },
     { c: "  (4,)        ", w: "" },
     { c: "  --------", w: "" },
     { c: "  ERROR", w: "**3 vs 4: not equal, neither is 1.** `operands could not be broadcast together with shapes (3,) (4,)`." }
    ] } },

  { code: { lang: "python", t: "Making a shape broadcastable on purpose",
    lines: [
     { c: "m = np.arange(6).reshape(2, 3)", w: "Shape `(2, 3)`." },
     { c: "col = np.array([10, 20])", w: "Shape `(2,)` — one value per **row**." },
     { c: "", w: "" },
     { c: "print(m + col)", w: "**Fails.** Right-aligned, that is 3 vs 2 — incompatible. NumPy assumes a bare 1-D array is a *row*." },
     { c: "", w: "" },
     { c: "print(m + col.reshape(2, 1))", w: "**Reshape it into a column**, shape `(2, 1)`. Now: 3 vs 1 stretches, 2 vs 2 matches." },
     { c: "print(m + col[:, np.newaxis])", w: "**`np.newaxis` inserts a dimension of size 1** — the same result, and the idiom you will see in real code. `None` works as a synonym." }
    ],
    out: "[[10 11 12]\n [23 24 25]]" } },
  { n: "Broadcasting never copies the stretched array. `m + row` on a million-row table does not build a million copies of `row` — NumPy reuses the same values as it walks. That is why the pattern is both convenient and cheap.",
    nt: "Nothing is actually duplicated" },

  { h: "A real use: normalising a dataset" },
  { code: { lang: "python", file: "normalise.py",
    lines: [
     { c: "data = rng.normal(loc=50, scale=10, size=(1000, 4))", w: "A thousand samples, four features. Shape `(1000, 4)`." },
     { c: "", w: "" },
     { c: "means = data.mean(axis=0)", w: "**`axis=0` collapses down the rows**, giving one mean per column. Shape `(4,)`. The next lesson covers axes properly." },
     { c: "stds = data.std(axis=0)", w: "Likewise, shape `(4,)`." },
     { c: "", w: "" },
     { c: "scaled = (data - means) / stds", w: "**Both `(4,)` arrays broadcast across all thousand rows.** This is standardisation — the preprocessing step in front of almost every machine-learning model — in one line and no loop.", hi: true },
     { c: "", w: "" },
     { c: "print(scaled.mean(axis=0).round(6))", w: "Every column now has mean 0..." },
     { c: "print(scaled.std(axis=0).round(6))", w: "...and standard deviation 1." }
    ],
    out: "[ 0. -0.  0.  0.]\n[1. 1. 1. 1.]" } },

  { h: "Comparison produces arrays too" },
  { code: { lang: "python",
    lines: [
     { c: "a = np.array([1, 5, 3, 8, 2])", w: "" },
     { c: "print(a > 3)", w: "**A boolean array, not a single True or False.** Every element compared, in C." },
     { c: "", w: "" },
     { c: "print((a > 3) & (a < 8))", w: "**Combine with `&`, `|`, `~` — not `and`, `or`, `not`.** The word forms ask for one truth value and raise `ValueError: truth value of an array is ambiguous`, which is a rite of passage." },
     { c: "", w: "" },
     { c: "print(np.where(a > 3, a, 0))", w: "**`np.where(condition, if_true, if_false)`** — the vectorised `if`. Keeps values above 3 and replaces everything else with 0, in one pass." }
    ],
    out: "[False  True False  True False]\n[False  True False False False]\n[0 5 0 8 0]" } },
  { trap: "**The brackets around each comparison are required.** `a > 3 & a < 8` is parsed as `a > (3 & a) < 8` because `&` binds tighter than `>` — a genuine operator-precedence trap that produces a wrong answer or a confusing error rather than an obvious one. Always write `(a > 3) & (a < 8)`." },

  { tryit: { t: "Vectorise a loop",
    task: "Rewrite this without any loop: `result = []` / `for row in matrix:` / `  result.append([x - row.mean() for x in row])` — that is, subtract each row's own mean from its elements.",
    hint: "`matrix.mean(axis=1)` gives one mean per row, shape `(n,)`. You need it as a column to broadcast across the rows.",
    sol: { lang: "python", code: "row_means = matrix.mean(axis=1, keepdims=True)\nresult = matrix - row_means" },
    w: "`keepdims=True` is the neat part: it keeps the collapsed dimension as size 1, giving shape `(n, 1)` directly instead of `(n,)`, so it broadcasts without a reshape. Two lines replacing four, and roughly a hundred times faster." } }
 ],
 k: [
  "Every operator works element-wise; `*` multiplies element by element and `@` is the matrix product.",
  "Broadcasting compares shapes from the right: equal, or one of them is 1.",
  "Reshape to `(n, 1)` or use `[:, np.newaxis]` when you need a value per row rather than per column.",
  "Use `&`, `|`, `~` on boolean arrays, and bracket each comparison — precedence will bite you otherwise."
 ],
 r: ["NumPy", "Matrix", "Normalisation", "Feature Scaling"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "scaled = (data - means) / stds", w: "standardise a table by subtracting column means and dividing by deviations" },
   { c: "means = data.mean(axis=0)", w: "get one mean per column" },
   { c: "print(m + col[:, np.newaxis])", w: "add a per-row value by turning a 1-D array into a column" },
   { c: "print((a > 3) & (a < 8))", w: "combine two element-wise comparisons", hint: "brackets and a single ampersand" },
   { c: "print(np.where(a > 3, a, 0))", w: "keep values above three and zero the rest, without a loop" }
  ]
 }
},

{
 t: "Aggregation, Axes and Boolean Masking",
 m: "numpy",
 lvl: "advanced",
 s: "Collapsing an array to an answer, and selecting exactly the rows you want.",
 goal: [
  "Use `axis` correctly, and say what it collapses",
  "Select elements with a boolean mask",
  "Handle missing values without corrupting your results"
 ],
 b: [
  { p: "Two ideas complete the NumPy foundation, and both carry straight into pandas: **aggregation with axes**, and **boolean masking**. Understanding them here means the pandas module is mostly new syntax over familiar ideas." },

  { h: "axis — the one that confuses everyone" },
  { p: "The rule is short and worth memorising exactly: **`axis` names the dimension that disappears.**" },
  { code: { lang: "python",
    lines: [
     { c: "m = np.array([[1, 2, 3],", w: "" },
     { c: "              [4, 5, 6]])", w: "Shape `(2, 3)` — axis 0 is the rows, axis 1 is the columns." },
     { c: "", w: "" },
     { c: "print(m.sum())", w: "**No axis: everything collapses to one number.**" },
     { c: "print(m.sum(axis=0))", w: "**`axis=0` collapses the rows**, leaving one value per column. Shape `(2,3)` → `(3,)`. Read it as *down the columns*.", hi: true },
     { c: "print(m.sum(axis=1))", w: "**`axis=1` collapses the columns**, leaving one value per row. Shape `(2,3)` → `(2,)`. Read it as *across each row*." }
    ],
    out: "21\n[5 7 9]\n[ 6 15]" } },
  { ana: "Picture the axis you name being squashed flat. `axis=0` squashes the rows together, so the rows vanish and you are left with one value per column. That is why `axis=0` gives *column* totals, which feels backwards until you think of it as *which dimension am I removing*.",
    at: "The axis you name is the one that goes" },
  { n: "In a table with rows as records and columns as features — which is essentially every dataset — **`axis=0` is what you almost always want**. Mean per feature, max per feature, standard deviation per feature. `axis=1` is for *per record* questions: this student's total across all subjects.",
    nt: "Which one you usually want" },

  { h: "The aggregations" },
  { tbl: { h: ["Call", "Gives"],
    rows: [
     ["`m.sum()` `m.mean()` `m.std()`", "Total, average, spread"],
     ["`m.min()` `m.max()`", "Extremes"],
     ["`m.argmin()` `m.argmax()`", "**The position** of the extreme, not the value — how you find *which* row was highest"],
     ["`np.median(m)` `np.percentile(m, 90)`", "Median and any percentile"],
     ["`m.cumsum()`", "Running total, same shape as the input"],
     ["`m.any()` `m.all()`", "Is anything true / is everything true"]
    ] } },
  { p: "All of them take `axis`, and all of them take `keepdims=True` to hold the collapsed dimension at size 1 so the result still broadcasts — the trick from the end of the last lesson." },

  { h: "Boolean masking" },
  { p: "You saw that `a > 3` produces a boolean array. Feeding that array back in as an index is where it becomes powerful." },
  { code: { lang: "python",
    lines: [
     { c: "a = np.array([1, 5, 3, 8, 2])", w: "" },
     { c: "mask = a > 3", w: "A boolean array the same length as `a`." },
     { c: "print(mask)" },
     { c: "print(a[mask])", w: "**Indexing with booleans keeps only the positions that are `True`.** This is the foundation of every filter you will write in pandas.", hi: true },
     { c: "print(a[a > 3])", w: "The same thing in one step — how it is actually written." },
     { c: "", w: "" },
     { c: "print(a[(a > 2) & (a < 8)])", w: "Combined conditions. Brackets, and `&`." },
     { c: "", w: "" },
     { c: "a[a > 3] = 0", w: "**A mask can be assigned through.** Every element above 3 is set to 0, in place, in one pass." },
     { c: "print(a)" }
    ],
    out: "[False  True False  True False]\n[5 8]\n[5 8]\n[5 3]\n[1 0 3 0 2]" } },

  { code: { lang: "python", t: "Masking rows of a table by a column's value",
    lines: [
     { c: "data = np.array([[25, 50000],", w: "age, salary" },
     { c: "                 [32, 72000],", w: "" },
     { c: "                 [41, 61000]])", w: "" },
     { c: "", w: "" },
     { c: "ages = data[:, 0]", w: "The age column." },
     { c: "print(data[ages > 30])", w: "**A 1-D mask indexing the first dimension selects whole rows.** Exactly what a `WHERE` clause does in SQL, and exactly what `df[df.age > 30]` does in pandas.", hi: true }
    ],
    out: "[[   32 72000]\n [   41 61000]]" } },

  { h: "Missing values" },
  { p: "Real data has holes. NumPy represents them with `np.nan` — *not a number* — which is a float value with one deeply strange property." },
  { code: { lang: "python",
    lines: [
     { c: "a = np.array([1.0, 2.0, np.nan, 4.0])", w: "**The array must be float**; there is no integer NaN. Reading a column with a blank field will silently turn an int column into float for exactly this reason." },
     { c: "", w: "" },
     { c: "print(np.nan == np.nan)", w: "**`False`.** NaN is not equal to anything, including itself — that is the IEEE floating-point specification, not a Python quirk. So you can never test for it with `==`." },
     { c: "print(np.isnan(a))", w: "**This is how you test for it.** A boolean mask of where the holes are." },
     { c: "", w: "" },
     { c: "print(a.mean())", w: "**One NaN poisons the whole result.** Any arithmetic touching NaN produces NaN, and it propagates silently through every subsequent step.", hi: true },
     { c: "print(np.nanmean(a))", w: "**The `nan`-prefixed versions skip them.** `nanmean`, `nansum`, `nanmax`, `nanstd` — all of them exist for this reason." },
     { c: "", w: "" },
     { c: "clean = a[~np.isnan(a)]", w: "**Or drop them: `~` inverts a boolean mask.** Now decide deliberately whether dropping or filling is right." },
     { c: "filled = np.nan_to_num(a, nan=0.0)", w: "Or fill them. **Filling with 0 is a decision about your data, not a neutral act** — a missing temperature is not zero degrees." }
    ],
    out: "False\n[False False  True False]\nnan\n2.3333333333333335" } },
  { trap: "A result that comes out as `nan` when you expected a number nearly always means one missing value somewhere upstream. Do not reach for `nanmean` reflexively — first find out *why* the value is missing. Whether to drop, fill or investigate is a question about the data, and answering it with a function call hides a decision you should be making consciously." },

  { h: "Sorting and finding" },
  { code: { lang: "python",
    lines: [
     { c: "a = np.array([3, 1, 4, 1, 5])", w: "" },
     { c: "print(np.sort(a))", w: "A new sorted array; `a.sort()` sorts in place." },
     { c: "print(np.argsort(a))", w: "**The indices that *would* sort it.** This is how you sort one array by another — sort scores, apply the same order to names." },
     { c: "", w: "" },
     { c: "print(np.unique(a))", w: "Sorted unique values. Add `return_counts=True` and you get a frequency table in one call." },
     { c: "print(np.count_nonzero(a > 2))", w: "**Counting a mask.** `(a > 2).sum()` does the same, since `True` is 1." }
    ],
    out: "[1 1 3 4 5]\n[1 3 0 2 4]\n[1 3 4 5]\n3" } },

  { tryit: { t: "Analyse a small dataset",
    task: "Given a `(100, 3)` array of student marks in three subjects, with some NaNs: find each subject's average ignoring missing marks, find how many students scored above 80 in every subject, and find the index of the best overall student.",
    hint: "`nanmean` with an axis, `.all(axis=1)` on a mask for *every subject*, and `argmax` on the row totals.",
    sol: { lang: "python", code: "import numpy as np\nrng = np.random.default_rng(0)\nmarks = rng.integers(40, 100, size=(100, 3)).astype(float)\nmarks[rng.random(marks.shape) < 0.05] = np.nan\n\nprint(np.nanmean(marks, axis=0))\n\nall_high = (marks > 80).all(axis=1)\nprint(f\"{all_high.sum()} students above 80 in every subject\")\n\ntotals = np.nansum(marks, axis=1)\nprint(f\"best student is index {totals.argmax()}\")" },
    w: "`(marks > 80).all(axis=1)` is the line worth studying: compare the whole table, then collapse the columns with `all` so one boolean survives per student. Two vectorised steps replace a nested loop." } }
 ],
 k: [
  "`axis` names the dimension that disappears — `axis=0` collapses rows and gives one value per column.",
  "A boolean array used as an index keeps only the `True` positions; assign through it to modify in place.",
  "A 1-D mask on a 2-D array selects whole rows — this is what a SQL `WHERE` clause does.",
  "`nan != nan`, so test with `np.isnan`; one NaN poisons an aggregate unless you use `nanmean` and friends."
 ],
 r: ["NumPy", "Aggregate Function", "Outlier", "Boolean", "Data Quality"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "print(m.sum(axis=0))", w: "total each column by collapsing the rows" },
   { c: "print(a[a > 3])", w: "keep only the elements greater than three" },
   { c: "print(data[ages > 30])", w: "select whole rows where a column exceeds a value" },
   { c: "print(np.isnan(a))", w: "find where the missing values are", hint: "not ==" },
   { c: "clean = a[~np.isnan(a)]", w: "drop the missing values from an array", hint: "invert the mask" },
   { c: "all_high = (marks > 80).all(axis=1)", w: "find rows where every column exceeds eighty" }
  ]
 }
}

]);
