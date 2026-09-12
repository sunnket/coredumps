/* PYTHON — 50+ Hardcore Question Bank (IIT/FAANG Level). */

/* ===================================================================
   Module: pythonic — (8 Hardcore Questions)
   =================================================================== */

TD.addMCQ("python", "pythonic", [
  {
    "tag": "Data Descriptor Precedence",
    "lvl": "advanced",
    "q": "Given an instance `f = Foo()` where `f.__dict__['x'] = 100`, but `Foo` defines a Data Descriptor `x` (with `__get__` and `__set__`), what does evaluating `f.x` return?",
    "o": [
      "`100` from instance dictionary",
      "The return value of `Foo.__dict__['x'].__get__(f, Foo)`",
      "Raises `AttributeError`",
      "`None`"
    ],
    "a": 1,
    "x": "In Python attribute resolution order, Data Descriptors take strict precedence over instance `__dict__` entries."
  },
  {
    "tag": "Non-Data Descriptor vs Instance Dict",
    "lvl": "advanced",
    "q": "If `x` is a Non-Data Descriptor (implements only `__get__`, no `__set__`), and `f.__dict__['x'] = 200` is set, what does `f.x` return?",
    "o": [
      "`200` from instance `__dict__` (instance `__dict__` overrides Non-Data Descriptors)",
      "The descriptor's `__get__` method",
      "Raises `TypeError`",
      "`None`"
    ],
    "a": 0,
    "x": "Non-Data Descriptors (like standard methods) have lower precedence than instance `__dict__`. If a key exists in `f.__dict__`, Python returns it directly."
  },
  {
    "tag": "Closure Late Binding Loop",
    "lvl": "advanced",
    "q": "What does `[f() for f in [lambda: i*2 for i in range(4)]]` output?",
    "o": [
      "[0, 2, 4, 6]",
      "[6, 6, 6, 6]",
      "[0, 0, 0, 0]",
      "TypeError"
    ],
    "a": 1,
    "x": "Python closures bind variables by reference in the enclosing lexical scope. By invocation time, the loop has finished with `i = 3`, so `3 * 2 = 6` for all 4 functions."
  },
  {
    "tag": "CPython GIL CPU-Bound Multithreading",
    "lvl": "advanced",
    "q": "Why do multi-threaded CPU-bound programs in CPython execute slower than single-threaded equivalents on multi-core hardware?",
    "o": [
      "Python threads are emulated in user space",
      "The Global Interpreter Lock (GIL) serializes bytecode execution, causing continuous OS thread context switching, lock acquisition spinning, and CPU cache thrashing",
      "Stack memory is limited to 4KB",
      "OS scheduler disables multi-core for Python"
    ],
    "a": 1,
    "x": "Only one native thread can execute Python bytecode at a time. Multiple CPU threads compete aggressively for the GIL, wasting CPU time on lock contention."
  },
  {
    "tag": "__slots__ Memory Mechanics",
    "lvl": "advanced",
    "q": "What internal optimization occurs when a class declares `__slots__ = ('a', 'b')`?",
    "o": [
      "Disables garbage collection for instances",
      "Suppresses the per-instance `__dict__` allocation, replacing dynamic hash table lookups with fixed-offset C pointer arrays in `PyObject` (~150+ bytes saved per instance)",
      "Makes attributes private",
      "Compiles class to C code"
    ],
    "a": 1,
    "x": "`__slots__` eliminates the overhead of an instance hash map dictionary, storing attributes in fixed descriptor slots directly in the C struct."
  },
  {
    "tag": "Small Integer Singleton Caching",
    "lvl": "advanced",
    "q": "What is the output of `a = 256; b = 256; a is b` versus `x = 257; y = 257; x is y` in the interactive CPython REPL?",
    "o": [
      "`True` and `True`",
      "`True` and `False`",
      "`False` and `False`",
      "`False` and `True`"
    ],
    "a": 1,
    "x": "CPython pre-allocates singletons for integers in the range `[-5, 256]`. Integers in this range always share identical memory addresses."
  },
  {
    "tag": "C3 Linearization Diamond MRO",
    "lvl": "advanced",
    "q": "Given `class A: pass`, `class B(A): pass`, `class C(A): pass`, `class D(B, C): pass`, what is `D.__mro__`?",
    "o": [
      "`D, B, A, C, object`",
      "`D, B, C, A, object`",
      "`D, C, B, A, object`",
      "`D, A, B, C, object`"
    ],
    "a": 1,
    "x": "C3 Linearization guarantees local precedence and monotonicity: `L(D) = D + merge(L(B), L(C), (B, C)) = [D, B, C, A, object]`."
  },
  {
    "tag": "Metaclass __prepare__ Hook",
    "lvl": "advanced",
    "q": "What is the purpose of the metaclass classmethod `__prepare__(cls, name, bases, **kwargs)`?",
    "o": [
      "Allocates the C heap memory",
      "Returns a custom mapping (e.g. `OrderedDict`) to serve as the local namespace dictionary while the class body is being executed",
      "Validates type annotations",
      "Runs after `__init__`"
    ],
    "a": 1,
    "x": "`__prepare__` is invoked before executing the class body, allowing the metaclass to provide a custom dictionary to track attribute declaration order or disallow duplicates."
  }
]);

/* ===================================================================
   Module: func — (9 Hardcore Questions)
   =================================================================== */

TD.addMCQ("python", "func", [
  {
    "tag": "Generator yield from Delegation",
    "lvl": "advanced",
    "q": "In Python generators, what happens to the return value when `result = yield from subgen()` runs and `subgen()` terminates with `return 42`?",
    "o": [
      "Raises unhandled `StopIteration`",
      "Transparently catches the terminal `StopIteration(42)` exception and assigns the value `42` directly to `result`",
      "Returns `None`",
      "Restarts `subgen()`"
    ],
    "a": 1,
    "x": "`yield from` establishes two-way delegation. When the subgenerator completes with `return value`, the value stored inside `StopIteration(value)` is returned as the expression value."
  },
  {
    "tag": "Context Manager Exception Handling",
    "lvl": "advanced",
    "q": "In a context manager's `__exit__(self, exc_type, exc_val, exc_tb)`, how do you suppress an exception raised inside the `with` block?",
    "o": [
      "Return `None`",
      "Return `True` (or a truthy value)",
      "Return `False`",
      "Raise `StopIteration`"
    ],
    "a": 1,
    "x": "Returning `True` from `__exit__` tells Python the exception was handled, suppressing it and resuming normal execution after the `with` block."
  },
  {
    "tag": "Mutable Default Argument Evaluation",
    "lvl": "advanced",
    "q": "Why does `def append_to(x, target=[]): target.append(x); return target` retain values across multiple separate function calls?",
    "o": [
      "Python variables are global by default",
      "Default parameter expressions are evaluated **once at function definition time (compile time)**, so all calls without an explicit argument share the exact same list instance in memory",
      "Lists are immutable in Python",
      "Garbage collection is disabled for functions"
    ],
    "a": 1,
    "x": "Default argument values are stored in the function's `__defaults__` tuple created at definition time. Mutating it affects all future invocations."
  },
  {
    "tag": "Weak References and Cycles",
    "lvl": "advanced",
    "q": "What is the key characteristic of a `weakref.ref(obj)`?",
    "o": [
      "It reduces `obj` memory footprint",
      "It references `obj` without incrementing its `ob_refcnt`, allowing `obj` to be garbage collected immediately when no strong references remain",
      "It makes `obj` thread-safe",
      "It prevents `obj` from being modified"
    ],
    "a": 1,
    "x": "Weak references do not increase reference count, preventing cyclic memory leaks in cache implementations like `WeakValueDictionary`."
  },
  {
    "tag": "CPython Bytecode LOAD_FAST vs LOAD_GLOBAL",
    "lvl": "advanced",
    "q": "Why is local variable access (`LOAD_FAST`) substantially faster than global variable access (`LOAD_GLOBAL`) in CPython?",
    "o": [
      "Local variables are cached in CPU L1 registers",
      "`LOAD_FAST` indexes directly into the stack frame's fixed C array in $O(1)$, while `LOAD_GLOBAL` performs dictionary hash lookups in `globals()` and `__builtins__`",
      "Global variables are encrypted",
      "Local variables bypass the GIL"
    ],
    "a": 1,
    "x": "Local variable names are determined at compile time and assigned fixed array offsets (`co_varnames`). `LOAD_GLOBAL` requires dictionary hash lookups."
  },
  {
    "tag": "Asyncio Event Loop Sleep(0)",
    "lvl": "advanced",
    "q": "What is the precise execution effect of calling `await asyncio.sleep(0)` inside a CPU-intensive async coroutine?",
    "o": [
      "Pauses thread for 1 ms",
      "Yields control back to the event loop, allowing other scheduled tasks in the runnable queue to execute before resuming",
      "Resets the call stack",
      "Cancels pending tasks"
    ],
    "a": 1,
    "x": "`await asyncio.sleep(0)` creates a zero-delay timer that yields execution to the event loop, preventing task starvation."
  },
  {
    "tag": "Zero-Copy Memoryview Slicing",
    "lvl": "advanced",
    "q": "Why does `memoryview(large_bytes)[1000:2000]` outperform `large_bytes[1000:2000]`?",
    "o": [
      "`memoryview` creates an $O(1)$ buffer view sharing the underlying C memory buffer without allocating new memory or copying bytes",
      "`memoryview` uses GPU RAM",
      "`large_bytes` slice deletes the buffer",
      "`memoryview` compresses data"
    ],
    "a": 0,
    "x": "Standard `bytes` slicing allocates a new string and copies $K$ bytes. A `memoryview` slice creates a pointer window over existing memory in $O(1)$ time and $0$ allocations."
  },
  {
    "tag": "LRU Cache Typed Disambiguation",
    "lvl": "advanced",
    "q": "In `functools.lru_cache(maxsize=128, typed=True)`, what is the effect of setting `typed=True`?",
    "o": [
      "Enforces Python type hints at runtime",
      "Arguments of different types are cached separately (e.g. `f(3)` and `f(3.0)` are treated as distinct cache keys)",
      "Restricts arguments to integers",
      "Caches to disk"
    ],
    "a": 1,
    "x": "When `typed=True`, argument types are inspected, so `f(3)` and `f(3.0)` produce separate cache entries rather than sharing a cached return value."
  },
  {
    "tag": "Inspect Parameter Kinds",
    "lvl": "advanced",
    "q": "In Python 3.8+ syntax `def fn(a, b, /, c, *, d): pass`, what are the parameter kinds of `a` and `d` respectively?",
    "o": [
      "`a` is Keyword-Only; `d` is Positional-Only",
      "`a` is Positional-Only (before `/`); `d` is Keyword-Only (after `*`)",
      "Both are standard positional or keyword arguments",
      "Syntax is invalid in Python 3"
    ],
    "a": 1,
    "x": "`/` denotes that all preceding parameters must be passed positionally. `*` denotes that all following parameters must be passed by keyword."
  }
]);

/* ===================================================================
   Module: oop — (5 Hardcore Questions)
   =================================================================== */

TD.addMCQ("python", "oop", [
  {
    "tag": "__new__ vs __init__ in Object Creation",
    "lvl": "advanced",
    "q": "What is the exact distinction between `__new__` and `__init__` in Python class instantiation?",
    "o": [
      "`__init__` creates the object, `__new__` initializes attributes",
      "`__new__` is the static constructor that allocates and returns the raw `PyObject` instance; `__init__` is the initializer that configures attributes on the newly created instance",
      "There is no difference",
      "`__new__` is only for metaclasses"
    ],
    "a": 1,
    "x": "`__new__(cls, ...)` is the static allocator that creates the instance and returns it. Python then automatically calls `__init__(self, ...)` with the returned instance."
  },
  {
    "tag": "Singleton via __new__",
    "lvl": "advanced",
    "q": "How can a thread-safe Singleton pattern be implemented natively in Python without metaclasses?",
    "o": [
      "By overriding `__init__` to raise an exception",
      "By overriding `__new__` to check a class-level `_instance` variable and return the existing instance if already created",
      "By defining `__slots__ = ()`",
      "By setting `__del__ = None`"
    ],
    "a": 1,
    "x": "Overriding `__new__` allows returning an already existing cached instance stored on the class, ensuring only one instance is ever created."
  },
  {
    "tag": "Abstract Base Class ABCMeta Invariant",
    "lvl": "advanced",
    "q": "What happens when you attempt to instantiate a class inheriting from `abc.ABC` that has an unimplemented `@abc.abstractmethod`?",
    "o": [
      "It instantiates with `None` return values",
      "Python raises `TypeError: Can't instantiate abstract class with abstract method ...` at instantiation time",
      "It compiles to a no-op",
      "It triggers a deprecation warning"
    ],
    "a": 1,
    "x": "`ABCMeta.__new__` inspects the class attributes and prevents instantiation if any `@abstractmethod` decorators remain un-overridden."
  },
  {
    "tag": "Custom __eq__ and __hash__ Invariant",
    "lvl": "advanced",
    "q": "In Python, if a class overrides `__eq__` but does NOT define `__hash__`, what is the default behavior when attempting to use its instances as dictionary keys?",
    "o": [
      "Python falls back to object memory address hashing",
      "Python automatically sets `__hash__ = None`, making instances unhashable and raising `TypeError: unhashable type`",
      "Instances are hashed to 0",
      "Dictionaries convert to lists"
    ],
    "a": 1,
    "x": "To maintain the hash invariant (objects that compare equal must have equal hash values), overriding `__eq__` without `__hash__` causes Python to explicitly set `__hash__ = None`."
  },
  {
    "tag": "Sys Getrefcount Increment Quirk",
    "lvl": "advanced",
    "q": "Why does `sys.getrefcount(x)` always return a value that is strictly 1 higher than the actual number of active references pointing to `x` in memory?",
    "o": [
      "CPython allocates a hidden root pointer",
      "Passing `x` as an argument into `sys.getrefcount(x)` creates a temporary reference inside the function call frame itself, incrementing `ob_refcnt` by 1 during evaluation",
      "Reference counts are 1-indexed in C",
      "GIL holds a reference"
    ],
    "a": 1,
    "x": "Function calls pass references. Evaluating `sys.getrefcount(x)` binds `x` to the function argument parameter, temporarily increasing its reference count by 1."
  }
]);

/* ===================================================================
   Module: errfile — (2 Hardcore Questions)
   =================================================================== */

TD.addMCQ("python", "errfile", [
  {
    "tag": "Exception Chaining 'from None'",
    "lvl": "advanced",
    "q": "In Python 3 exception handling, what does `raise CustomError(...) from None` do?",
    "o": [
      "Suppresses the `CustomError`",
      "Explicitly suppresses the `__context__` attribute, preventing the traceback from displaying 'During handling of the above exception, another exception occurred:'",
      "Deletes error logs",
      "Rethrows original exception"
    ],
    "a": 1,
    "x": "Exception chaining tracks original exceptions in `__context__` or `__cause__`. `from None` sets `__suppress_context__ = True`, hiding the previous traceback."
  },
  {
    "tag": "PEP 442 Destructor Reference Cycles",
    "lvl": "advanced",
    "q": "How did Python 3.4 (PEP 442 - Safe Object Finalization) fix cyclic garbage collection for objects with `__del__` methods?",
    "o": [
      "Disabled `__del__` completely",
      "Allows the cyclic garbage collector to safely break cycles containing objects with `__del__` destructors without moving them to `gc.garbage`",
      "Killed circular references with SIGKILL",
      "Enforced weak references on all classes"
    ],
    "a": 1,
    "x": "Prior to PEP 442, reference cycles with `__del__` were uncollectable and leaked memory in `gc.garbage`. PEP 442 generalized topological destructor ordering."
  }
]);

/* ===================================================================
   Module: basics — (4 Hardcore Questions)
   =================================================================== */

TD.addMCQ("python", "basics", [
  {
    "tag": "Walrus Operator Scope and Precedence",
    "lvl": "advanced",
    "q": "What is the scope of variable `n` in `if (n := len(data)) > 10: pass`?",
    "o": [
      "Restricted to the `if` block",
      "Persists in the surrounding function/module scope even after the `if` statement finishes",
      "Scoped only to the condition expression",
      "Deleted at block exit"
    ],
    "a": 1,
    "x": "The walrus operator `:=` assigns to the current local or global scope. It is not block-scoped, so `n` remains accessible throughout the remainder of the function."
  },
  {
    "tag": "Tuple Immutability vs Element Mutability",
    "lvl": "advanced",
    "q": "Given `t = (1, 2, [3, 4])`. What happens when executing `t[2] += [5, 6]`?",
    "o": [
      "`t` becomes `(1, 2, [3, 4, 5, 6])` without errors",
      "The list is modified in-place to `[3, 4, 5, 6]`, BUT Python simultaneously raises `TypeError: 'tuple' object does not support item assignment`",
      "Raises `TypeError` and list remains unchanged",
      "`t` is converted to a list"
    ],
    "a": 1,
    "x": "`+=` on lists mutates the list in-place (`extend`), but then attempts to assign the list reference back to `t[2]`. The assignment to a tuple index raises `TypeError`, leaving the list mutated!"
  },
  {
    "tag": "String Interning Mechanics",
    "lvl": "advanced",
    "q": "Why does `sys.intern(string_var)` optimize memory and lookup speed in dictionary-heavy applications?",
    "o": [
      "Compresses strings with snappy",
      "Ensures all identical strings share a single canonical `PyASCIIObject` in memory, converting string equality checks from $O(N)$ character comparisons into instant $O(1)$ C pointer comparisons (`a is b`)",
      "Encrypts strings",
      "Stores strings on disk"
    ],
    "a": 1,
    "x": "Interned strings share a global singleton pointer. Comparing interned strings reduces to comparing 64-bit pointers ($O(1)$)."
  },
  {
    "tag": "Dict Hash Collision Resolution",
    "lvl": "advanced",
    "q": "In CPython's dict implementation (since Python 3.6), how are hash collisions resolved?",
    "o": [
      "Separate chaining with linked lists",
      "Open addressing with Perturbation Pseudo-Random Probing ($j = ((5j + 1) + (\\text{perturb} \\gg 5)) \\bmod \\text{mask}$)",
      "Linear probing",
      "Binary search tree"
    ],
    "a": 1,
    "x": "CPython dicts use open addressing with quadratic-style perturbation probing to jump across the hash table, preventing clustering."
  }
]);

/* ===================================================================
   Module: numpy — (4 Hardcore Questions)
   =================================================================== */

TD.addMCQ("python", "numpy", [
  {
    "tag": "NumPy Strides and Zero-Copy Views",
    "lvl": "advanced",
    "q": "In NumPy, what do `arr.strides` represent, and why does transposing a 2D array `arr.T` execute in $O(1)$ time?",
    "o": [
      "Strides count non-zero elements",
      "`strides` is a tuple of byte steps to move 1 element along each dimension; transposing simply swaps the stride tuple values without copying any array data in memory",
      "Transposing allocates a new C buffer",
      "Strides compress array"
    ],
    "a": 1,
    "x": "A NumPy array is a contiguous memory buffer with a shape and stride metadata. Transposing `arr` simply swaps `strides[0]` and `strides[1]` in $O(1)$ time with 0 byte copying."
  },
  {
    "tag": "NumPy Broadcasting Invariants",
    "lvl": "advanced",
    "q": "When are two NumPy arrays $A$ and $B$ compatible for element-wise broadcasting?",
    "o": [
      "They must have identical shapes",
      "Traversing dimensions from right to left, the dimension sizes must either be equal or one of them must be 1",
      "Total number of elements must match",
      "One array must be 1D"
    ],
    "a": 1,
    "x": "Broadcasting rule: Starting from trailing (rightmost) dimensions, two dimensions are compatible if they are equal, or one of them is 1."
  },
  {
    "tag": "Fortran vs C Contiguity (F-Order vs C-Order)",
    "lvl": "advanced",
    "q": "Why does performing column-wise reductions on a large 2D C-contiguous NumPy array execute significantly slower than row-wise reductions?",
    "o": [
      "NumPy disables vectorization on columns",
      "In C-order, rows are contiguous in memory; traversing columns requires jumping by `stride[0]` bytes per element, causing CPU L1/L2 cache line misses on every element",
      "Columns use 64-bit floats",
      "C-order does not support SIMD"
    ],
    "a": 1,
    "x": "Row traversal reads contiguous 64-byte CPU cache lines sequentially. Column traversal jumps across memory rows, triggering cache misses on every access."
  },
  {
    "tag": "Fancy Indexing vs Slicing Copy Rule",
    "lvl": "advanced",
    "q": "What is the critical distinction between standard slicing (`arr[1:5]`) and integer array 'fancy indexing' (`arr[[1, 2, 4]]`) in NumPy?",
    "o": [
      "Slicing is slower",
      "Standard slicing returns a zero-copy **View** of the original buffer, while fancy indexing always allocates and returns a **Copy**",
      "Fancy indexing returns a view",
      "There is zero difference"
    ],
    "a": 1,
    "x": "Basic slicing produces views that mutate the original array if edited. Advanced/fancy indexing (passing lists/arrays of indices) always creates an independent copy."
  }
]);

/* ===================================================================
   Module: pandas — (3 Hardcore Questions)
   =================================================================== */

TD.addMCQ("python", "pandas", [
  {
    "tag": "SettingWithCopyWarning Mechanics",
    "lvl": "advanced",
    "q": "Why does executing `df[df['col'] > 0]['target'] = 1` trigger Pandas `SettingWithCopyWarning`?",
    "o": [
      "`target` column does not exist",
      "Chained indexing `df[...][...]` creates an intermediate DataFrame that might be a copy rather than a view, causing the assignment to mutate a temporary discarded object rather than `df` directly; use `df.loc[df['col'] > 0, 'target'] = 1`",
      "Pandas is single-threaded",
      "Numbers must be floats"
    ],
    "a": 1,
    "x": "Chained indexing makes it unpredictable whether the intermediate slice is a view or a copy. Using `.loc[row_indexer, col_indexer]` ensures direct in-place mutation."
  },
  {
    "tag": "Categorical Dtype Memory Compression",
    "lvl": "advanced",
    "q": "How does converting a low-cardinality string column with 10M rows to `category` dtype reduce Pandas memory usage by up to 90%?",
    "o": [
      "Compresses strings with gzip",
      "Replaces repetitive string objects with compact 8-bit integer codes (`int8`) referencing a small unique category index array",
      "Stores data in SQLite",
      "Deletes duplicate rows"
    ],
    "a": 1,
    "x": "Instead of allocating 10M distinct 64-bit string pointers, `category` stores an array of integer keys (e.g. `int8` = 1 byte per row) pointing to a single lookup table."
  },
  {
    "tag": "Arrow Backend in Pandas 2.0",
    "lvl": "advanced",
    "q": "What is the primary memory and performance advantage of using PyArrow-backed types (`dtype='string[pyarrow]'`) in Pandas 2.0 over standard NumPy object dtypes?",
    "o": [
      "PyArrow runs on GPU only",
      "PyArrow provides contiguous columnar memory buffers with native bitmap null masks, eliminating Python object pointer overhead and enabling zero-copy sharing with Arrow ecosystem",
      "PyArrow converts strings to integers",
      "PyArrow disables index lookup"
    ],
    "a": 1,
    "x": "Object dtypes in Pandas store arrays of 64-bit Python pointers to scattered heap objects. Arrow stores contiguous byte arrays with bitmask null tracking."
  }
]);

/* ===================================================================
   Module: collections — (4 Hardcore Questions)
   =================================================================== */

TD.addMCQ("python", "collections", [
  {
    "tag": "ChainMap Lookup Order",
    "lvl": "advanced",
    "q": "In `collections.ChainMap(dict1, dict2, dict3)`, how are key lookups and mutations handled?",
    "o": [
      "Lookups search all dicts in parallel; mutations write to all dicts",
      "Lookups search `dict1`, then `dict2`, then `dict3` sequentially; mutations (inserts/updates/deletes) always operate strictly on the **first mapping (`dict1`)**",
      "Lookups merge dicts into a new dict",
      "Mutations are disallowed"
    ],
    "a": 1,
    "x": "`ChainMap` groups multiple mappings into a single view. Key lookups evaluate in order from first to last. All write operations target strictly `maps[0]`."
  },
  {
    "tag": "defaultdict vs setdefault",
    "lvl": "advanced",
    "q": "What is the performance advantage of `collections.defaultdict(list)` over `dict.setdefault(key, [])` inside a loop inserting 1M items?",
    "o": [
      "`defaultdict` is written in C while `setdefault` is in Python",
      "`setdefault` evaluates the default argument `[]` on **every single iteration** regardless of whether `key` already exists, allocating 1M useless empty lists; `defaultdict` invokes the factory callable only upon a missing key",
      "`defaultdict` uses binary search",
      "`setdefault` raises `KeyError`"
    ],
    "a": 1,
    "x": "`dict.setdefault(k, [])` instantiates a new empty list object in memory before passing it to the method call on every iteration, incurring heavy allocation waste."
  },
  {
    "tag": "Counter Most Common Heap Complexity",
    "lvl": "advanced",
    "q": "What is the time complexity of `collections.Counter(arr).most_common(k)` on an array of $N$ elements with $U$ unique keys?",
    "o": [
      "$O(U \\log U)$",
      "$O(N + U \\log k)$ using a min-heap of size $k$",
      "$O(N \\log N)$",
      "$O(k \\log N)$"
    ],
    "a": 1,
    "x": "Counting frequencies takes $O(N)$. Extracting top $k$ items uses `heapq.nlargest(k, ...)` with a min-heap of size $k$ in $O(U \\log k)$ time."
  },
  {
    "tag": "Deque Thread Safety Guarantee",
    "lvl": "advanced",
    "q": "Why is `collections.deque` thread-safe for appends and pops from opposite ends without explicit locks in CPython?",
    "o": [
      "Deques lock the entire OS memory",
      "In CPython, `append()`, `appendleft()`, `pop()`, and `popleft()` on a deque are implemented as single atomic C bytecode operations protected by the GIL, eliminating race conditions on end pointers",
      "Deques use software transactional memory",
      "Deques run on background threads"
    ],
    "a": 1,
    "x": "Double-ended mutations in CPython deques mutate C-level doubly linked block pointers atomically under GIL ownership, making end mutations thread-safe without locks."
  }
]);

/* ===================================================================
   Module: scale — (2 Hardcore Questions)
   =================================================================== */

TD.addMCQ("python", "scale", [
  {
    "tag": "Multiprocessing Fork vs Spawn on Linux",
    "lvl": "advanced",
    "q": "Why did Python 3.8+ change the default start method for multiprocessing on macOS to `'spawn'` instead of `'fork'`?",
    "o": [
      "`fork` is deprecated in POSIX",
      "Calling `fork()` in a multi-threaded process copies locks held by other threads in an acquired state, causing immediate deadlocks when child processes call system libraries (e.g. CoreFoundation/ObjC runtime)",
      "`spawn` is 10x faster",
      "`fork` cannot allocate memory"
    ],
    "a": 1,
    "x": "`fork()` copies the process space without copying background threads. If a background thread held an internal OS lock when fork was called, the lock is permanently locked in the child process, deadlocking subsequent calls."
  },
  {
    "tag": "ProcessPoolExecutor vs ThreadPoolExecutor",
    "lvl": "advanced",
    "q": "When should `concurrent.futures.ProcessPoolExecutor` be chosen over `ThreadPoolExecutor`?",
    "o": [
      "For network I/O requests",
      "For CPU-bound numerical computations in CPython to bypass the GIL by executing tasks across separate OS processes with distinct Python interpreter instances and memory spaces",
      "For GUI applications",
      "To save RAM"
    ],
    "a": 1,
    "x": "`ProcessPoolExecutor` spawns independent Python interpreter processes, each with its own GIL and memory space, enabling true parallel execution across multi-core CPUs."
  }
]);

/* ===================================================================
   Module: flow — (2 Hardcore Questions)
   =================================================================== */

TD.addMCQ("python", "flow", [
  {
    "tag": "Iterator Protocol StopIteration Invariant",
    "lvl": "advanced",
    "q": "According to PEP 234 (Iterators), once an iterator's `__next__()` method raises `StopIteration`, what must all subsequent calls to `__next__()` do?",
    "o": [
      "Restart iteration from the beginning",
      "Must continue to raise `StopIteration` on all subsequent calls",
      "Return `None`",
      "Raise `RuntimeError`"
    ],
    "a": 1,
    "x": "The iterator protocol requires that once exhausted, an iterator remains exhausted and continues to raise `StopIteration` on all subsequent calls."
  },
  {
    "tag": "For-Else Semantic Meaning",
    "lvl": "advanced",
    "q": "In Python `for item in sequence: ... else: ...`, when does the `else` block execute?",
    "o": [
      "Whenever the loop encounters an exception",
      "When the loop completes normally without encountering a `break` statement (or if the sequence is empty)",
      "Only if the sequence was empty",
      "In parallel with the loop"
    ],
    "a": 1,
    "x": "The `else` clause of a loop executes if and only if the loop terminates normally without hitting a `break` statement."
  }
]);

/* ===================================================================
   Module: data — (3 Hardcore Questions)
   =================================================================== */

TD.addMCQ("python", "data", [
  {
    "tag": "Set Mutation During Iteration",
    "lvl": "advanced",
    "q": "What happens if a set or dictionary is mutated (adding/removing items) while directly iterating over it in a `for key in my_dict:` loop?",
    "o": [
      "The loop skips mutated elements",
      "CPython raises `RuntimeError: dictionary changed size during iteration`",
      "The dictionary is cloned automatically",
      "The process enters an infinite loop"
    ],
    "a": 1,
    "x": "CPython tracks a dictionary mutation counter (`ma_version_tag`). If the dictionary size changes during iteration, it immediately raises `RuntimeError` to prevent memory corruption."
  },
  {
    "tag": "Tuple Hashability Invariant",
    "lvl": "advanced",
    "q": "Under what exact condition is a Python tuple `t` hashable and usable as a dictionary key?",
    "o": [
      "All tuples are always hashable",
      "A tuple is hashable if and only if **every element contained inside the tuple is itself hashable**",
      "Only tuples containing integers",
      "Only tuples of length $\\le 3$"
    ],
    "a": 1,
    "x": "A tuple is recursively hashable: `hash(t)` evaluates the hash of all child elements. If `t` contains any unhashable mutable object (e.g. `(1, 2, [3, 4])`), `hash(t)` raises `TypeError: unhashable type: 'list'`."
  },
  {
    "tag": "MappingProxyType Immutable View",
    "lvl": "advanced",
    "q": "What is the purpose of `types.MappingProxyType(dictionary)` in Python?",
    "o": [
      "Compresses dictionary keys",
      "Provides a read-only, immutable proxy view of the underlying dictionary that prevents direct mutation through the proxy while dynamically reflecting changes made to the original dictionary",
      "Converts dictionary to JSON",
      "Encrypts dictionary values"
    ],
    "a": 1,
    "x": "`MappingProxyType` creates a read-only view of a mapping. Attempting to set or delete keys on the proxy raises `TypeError`."
  }
]);

/* ===================================================================
   Module: setup — (1 Hardcore Questions)
   =================================================================== */

TD.addMCQ("python", "setup", [
  {
    "tag": "PYTHONPATH vs sys.path Mechanics",
    "lvl": "advanced",
    "q": "How does Python initialize `sys.path` on startup?",
    "o": [
      "`sys.path` contains only the standard library",
      "`sys.path` is initialized with the directory containing the input script (or current directory `''`), followed by `PYTHONPATH` environment variable directories, then standard library and installed `site-packages`",
      "`sys.path` is populated alphabetically",
      "`sys.path` only scans `/usr/lib`"
    ],
    "a": 1,
    "x": "Python prepends the script directory (or current directory `''`), then inserts directories listed in `PYTHONPATH`, and finally appends system library paths and `site-packages`."
  }
]);

/* ===================================================================
   Module: datetime — (1 Hardcore Questions)
   =================================================================== */

TD.addMCQ("python", "datetime", [
  {
    "tag": "Naive vs Aware Datetime Comparison",
    "lvl": "advanced",
    "q": "What happens when comparing a timezone-naive datetime object `dt1 = datetime(2025, 1, 1)` with a timezone-aware datetime `dt2 = datetime(2025, 1, 1, tzinfo=timezone.utc)` using `dt1 == dt2` or `dt1 < dt2`?",
    "o": [
      "`dt1 == dt2` returns `False`, but ordering comparisons (`dt1 < dt2`) raise `TypeError: can't compare offset-naive and offset-aware datetimes`",
      "Both evaluate in UTC",
      "Raises `ValueError`",
      "Converts naive datetime to local timezone"
    ],
    "a": 0,
    "x": "In Python 3, equality between naive and aware datetimes safely returns `False`, but ordering comparisons (`<`, `>`, `<=`, `>=`) raise `TypeError`."
  }
]);

/* ===================================================================
   Module: regex — (1 Hardcore Questions)
   =================================================================== */

TD.addMCQ("python", "regex", [
  {
    "tag": "Regex Catastrophic Backtracking",
    "lvl": "advanced",
    "q": "Why does evaluating the regex `^(a+)+$` against a 30-character string `'aaaaaaaaaaaaaaaaaaaaaaaaaaaaab'` cause CPU utilization to spike to 100% and hang indefinitely?",
    "o": [
      "Regex engine runs out of memory",
      "Nested non-atomic quantifiers create $O(2^N)$ exponential backtracking paths as the NFA tries every permutation of grouping 'a' characters before failing on 'b'",
      "Python regex engine is single-threaded",
      "String length exceeds buffer limit"
    ],
    "a": 1,
    "x": "Nested quantifiers `(a+)+` allow exponential combinations of partitioning $N$ characters. On a failing match, standard backtracking tests all $2^N$ combinations, freezing execution."
  }
]);

/* ===================================================================
   Module: json — (1 Hardcore Questions)
   =================================================================== */

TD.addMCQ("python", "json", [
  {
    "tag": "JSON Custom Datetime Serialization",
    "lvl": "advanced",
    "q": "Why does `json.dumps({'time': datetime.now()})` raise `TypeError: Object of type datetime is not JSON serializable`, and what is the standard fix?",
    "o": [
      "JSON only supports integers",
      "Python's `json` encoder standard library does not implement a default mapping for `datetime` objects; pass `default=str` or provide a custom `json.JSONEncoder` subclass overriding `default()`",
      "Datetime must be converted to float timestamp first",
      "JSON keys cannot be strings"
    ],
    "a": 1,
    "x": "Standard `json.dumps` only serializes primitive types (dict, list, str, int, float, bool, None). Handling datetime requires `default=str` or overriding `JSONEncoder.default()`."
  }
]);

