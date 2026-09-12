(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([
    {
      slug: "key-value-pair",
      why: {
        before: "Data could only be stored in positional arrays or sequential record lists, requiring programs to search through an entire dataset sequentially ($O(N)$) using integer indices to find an entity.",
        problem: "Linear searching through thousands of records was excruciatingly slow ($O(N)$ time complexity); correlating disparate attributes (like linking a user ID to their profile data) required complex parallel arrays.",
        shift: "Computer science formalized the Key-Value Pair: an associative data primitive coupling a unique identifier (Key) to a data payload (Value), enabling $O(1)$ constant-time associative lookups via hashing."
      },
      num: {
        t: "Key-Value Pair Storage Paradigms & Constraints",
        h: ["Storage Paradigm / Technology", "Key Constraint / Requirement", "Value Flexibility", "Lookup Time Complexity", "Primary Real-World Use Case"],
        r: [
          ["In-Memory Hash Table (JS `Map` / Python `dict`)", "Must be hashable (immutable or unique identity)", "Arbitrary primitive, object, or function payload", "Average $O(1)$ constant time ($O(N)$ worst-case)", "In-memory caching, indexing records by ID, symbol tables"],
          ["Distributed Key-Value Store (Redis)", "Binary-safe string (up to 512 MB)", "Strings, hashes, lists, sets, bitmaps", "Sub-millisecond $O(1)$ in-memory network lookup", "Session management, distributed rate limiting, pub/sub queues"],
          ["LSM-Tree Persistent Store (RocksDB)", "Ordered byte array (`byte[]`)", "Unstructured byte blob", "$O(\\log N)$ disk read via bloom filters and memtables", "High-throughput write-heavy storage engines, Kafka storage"],
          ["Relational Primary Key Mapping", "Unique, indexed column (UUID, auto-increment integer)", "Normalized SQL table row tuple", "$O(\\log N)$ B-Tree index traversal ($O(1)$ with hash index)", "Transactional relational databases (PostgreSQL, MySQL)"]
        ],
        n: "A key-value pair is the foundational atom of associative data structures. The relationship is strictly unidirectional: given a Key, the system resolves the associated Value in $O(1)$ average time, but finding a Key from a given Value requires an exhaustive $O(N)$ scan across the entire collection. In hash-based implementations, the Key is passed through a Hash Function (such as MurmurHash3 or SipHash) to compute a 32-bit or 64-bit integer hash code. This hash code is mapped via modulo arithmetic to a specific memory slot (bucket) in an array. Crucially, the Key must satisfy the Invariant of Hashability: if two keys are considered equal according to the equality operator, their computed hash codes must be mathematically identical, and their hash values must remain invariant throughout their lifetime in the collection."
      },
      miss: [
        {
          w: "Any mutable object or array can be safely used as a key in a hash map.",
          r: "If an object is mutated after being inserted as a key, its internal hash code changes; the hash map will search the wrong bucket on subsequent lookups, causing the key-value pair to become permanently lost in memory."
        },
        {
          w: "In JavaScript, a standard object `{}` and a `Map` are identical key-value structures.",
          r: "Standard JS objects only allow strings and symbols as keys, carry default prototype keys, and lack size properties; `Map` allows *any* data type (including functions and DOM elements) as keys, preserves insertion order, and tracks size in $O(1)$."
        },
        {
          w: "Looking up a key in a key-value store is mathematically guaranteed to be $O(1)$ in all circumstances.",
          r: "If a poor hash function creates excessive hash collisions (or during an algorithmic Hash-DoS attack), all keys collapse into a single linked list bucket, degrading lookup performance from $O(1)$ to $O(N)$."
        },
        {
          w: "Key-value pairs can be efficiently queried in reverse by value.",
          r: "Key-value stores are indexed strictly by Key; searching for a specific Value requires an $O(N)$ full-table scan unless a secondary reverse index is explicitly maintained."
        }
      ],
      trade: {
        buys: [
          "Instantaneous $O(1)$ data retrieval: access values instantly by ID without scanning through arrays.",
          "Natural associative modeling: models real-world dictionaries, phonebooks, user profiles, and configuration settings.",
          "Extreme distributed scalability: simple key-value interfaces partition and shard across clusters (DynamoDB, Redis) seamlessly.",
          "Dynamic schema flexibility: store arbitrary, heterogeneous values under structured keys without schema migrations."
        ],
        costs: [
          "Memory overhead: hash tables require significant memory over-allocation (load factors of 0.6 to 0.75) to prevent collisions.",
          "Inefficient range querying: unordered hash maps cannot perform range scans (`key > 10 && key < 20`) without scanning all keys.",
          "Hash collision latency: handling hash collisions via probing or chaining causes latency spikes during table resizing.",
          "Lack of relationships: raw key-value stores lack foreign key constraints, joins, and cascading integrity checks."
        ],
        avoid: [
          "Mutating an object's properties while it is currently acting as a key in an associative collection.",
          "Using raw JavaScript objects `{}` as hash maps when keys are user-controlled strings (vulnerable to Prototype Pollution).",
          "Scanning an entire key-value dictionary in an $O(N)$ loop inside high-frequency request paths.",
          "Using a distributed key-value store when your domain requires multi-table relational ACID transactions and joins."
        ]
      }
    },
    {
      slug: "dictionary",
      why: {
        before: "Associative mappings had to be implemented manually using parallel arrays (one array for keys, one for values) or binary search trees requiring complex pointer rebalancing.",
        problem: "Parallel arrays required $O(N)$ linear scans to find keys; binary search trees required $O(\\log N)$ traversals and suffered high memory overhead and cache misses.",
        shift: "Programming languages standardized Dictionaries (Python `dict`, JS `Map` / Object, Go `map`, Rust `HashMap`, Java `HashMap`): native associative collections backed by highly optimized hash tables delivering average $O(1)$ lookups, insertions, and deletions."
      },
      num: {
        t: "Dictionary Implementations & Hash Table Architectures",
        h: ["Language / Engine", "Underlying Collision Strategy", "Hash Algorithm Applied", "Insertion Order Preservation", "Resizing / Load Factor Threshold"],
        r: [
          ["Python 3.7+ (`dict`)", "Compact Hash Table (Indices array + dense Entries array)", "SipHash-1-3 / internal hash", "Strictly preserved (by design of compact layout)", "Resizes when $\\frac{2}{3}$ full (Load Factor $\\approx 0.66$)"],
          ["JavaScript (`Map`)", "Deterministic hash table with linked-list entry pointers", "V8 internal identity hash", "Strictly preserved (ECMAScript specification)", "Dynamic rehash when bucket capacity exceeded"],
          ["Java (`HashMap`)", "Separate Chaining (Buckets transition from LinkedList to Red-Black Tree)", "32-bit XOR bit-shift spreading hash", "Not preserved (use `LinkedHashMap` for order)", "Default Load Factor = 0.75; converts to tree at 8 collisions"],
          ["Rust (`HashMap`)", "Open Addressing with Robin Hood Hashing / Swiss Tables", "SipHash-1-3 (cryptographically secure against HashDoS)", "Not preserved (use `IndexMap` for order)", "Resizes at 87.5% load factor; uses 1-byte control metadata bytes"]
        ],
        n: "A dictionary is an implementation of an Associative Array backed by a Hash Table. The efficiency of a dictionary depends on its collision resolution architecture. In Separate Chaining (Java), each array bucket points to a linked list or balanced binary tree of colliding entries. In Open Addressing (Python, Rust Swiss Tables), colliding entries are stored in neighboring array slots via Linear Probing or Quadratic Probing. Python 3.6+ revolutionized dictionary memory efficiency with its 'Compact Dict' architecture: instead of allocating a sparse array of large 24-byte structs, it allocates a dense array of entries packed sequentially in the exact order they were inserted, paired with a small, sparse byte array of indices. This design cut Python dictionary memory consumption by 30-40% while making insertion-order preservation a permanent language guarantee."
      },
      miss: [
        {
          w: "Looking up a key in a dictionary is mathematically guaranteed to always take $O(1)$ time in every situation.",
          r: "Hash lookups are $O(1)$ *on average*; if many keys collide in the same bucket, worst-case performance degrades to $O(N)$ (or $O(\\log N)$ in Java's treeified buckets)."
        },
        {
          w: "Iterating over a standard JavaScript object `{}` guarantees alphabetical ordering of keys.",
          r: "JavaScript objects iterate integer-like keys in ascending numerical order first, followed by string keys in chronological insertion order, which can cause subtle ordering bugs."
        },
        {
          w: "You can safely add or delete keys from a dictionary while iterating over it.",
          r: "Mutating a dictionary while iterating over it alters the underlying bucket layout and indices, throwing a `RuntimeError: dictionary changed size during iteration` in Python and causing skipped keys in other languages."
        },
        {
          w: "A dictionary and a set are completely different data structures under the hood.",
          r: "A Set is simply a Hash Table dictionary where keys map to null or dummy values; they share identical hashing, collision resolution, and $O(1)$ performance mechanics."
        }
      ],
      trade: {
        buys: [
          "Sub-millisecond $O(1)$ lookups: find, insert, update, and delete entries in constant time regardless of dataset size.",
          "Rich, human-readable data modeling: naturally represents JSON payloads, database rows, and entity state.",
          "Automatic collision resolution: modern runtime dictionaries handle hash collisions and dynamic resizing transparently.",
          "Insertion-order preservation: modern Python dicts and JS Maps preserve the sequence in which keys were added."
        ],
        costs: [
          "Substantial memory overhead: hash tables require significant spare bucket capacity (30% to 50% empty space) to operate efficiently.",
          "Algorithmic HashDoS vulnerability: malicious users crafting colliding keys can exhaust server CPU via collision lists.",
          "Lack of sorting: hash maps do not maintain keys in sorted numerical or alphabetical order (requires B-Trees or TreeMaps).",
          "Cache-unfriendly pointer hopping: separate chaining hash tables suffer CPU cache misses dereferencing collision pointers."
        ],
        avoid: [
          "Mutating a dictionary's keys while iterating through it in a loop (iterate over a copy of keys instead).",
          "Using standard JavaScript `{}` when keys need to be non-string types or when key names are derived from untrusted input.",
          "Storing millions of integers in a dictionary when a flat typed array or vector would consume 10x less memory.",
          "Assuming dictionary keys are sorted alphabetically (use a sorted map structure if ordering matters)."
        ]
      }
    },
    {
      slug: "iterator",
      why: {
        before: "Every collection type (arrays, linked lists, binary trees, hash sets) required its own proprietary traversal methods, forcing developers to write custom, tightly coupled loops for every distinct data structure.",
        problem: "Code could not be written to iterate polymorphically over arbitrary data sources; and processing massive datasets required loading all gigabytes of data into RAM simultaneously.",
        shift: "The Gang of Four formalized the Iterator Pattern (standardized in ECMAScript, Python, Rust, and Java): decoupling collection traversal from underlying data storage, enabling uniform traversal and lazy evaluation."
      },
      num: {
        t: "Iterator Protocols & Traversal Mechanics Across Languages",
        h: ["Language", "Iterator Protocol Interface", "Advancement Method & Signature", "Termination / Completion Signal", "Lazy Evaluation Mechanism"],
        r: [
          ["JavaScript / TypeScript", "`Iterable` & `Iterator` protocols", "`next() => { value: T, done: boolean }`", "`done: true` returned by `next()`", "Generator functions (`function*` / `yield`)"],
          ["Python", "`__iter__()` and `__next__()`", "`__next__() => T`", "Raises `StopIteration` exception", "Generators (`def` with `yield`), Generator expressions"],
          ["Rust", "`std::iter::Iterator` trait", "`next(&mut self) -> Option<Self::Item>`", "`None` returned by `next()`", "Lazy adapter pipelines (`.map()`, `.filter()`, `.take()`)"],
          ["Java", "`java.util.Iterator<E>` interface", "`next() => E` after checking `hasNext()`", "`hasNext() == false` (throws `NoSuchElementException`)", "Java 8 Streams (`Stream.generate()`, lazy evaluation)"]
        ],
        n: "The Iterator pattern provides a standard interface to sequentially traverse elements of an aggregate collection without exposing its internal representation (whether a flat array, a doubly-linked list, or a Red-Black tree). In the ECMAScript specification (§27.1), an object is an **Iterable** if it implements the `[Symbol.iterator]` method, which returns an **Iterator** object. The iterator provides a `next()` method that returns an iteration result object: `{ value: any, done: boolean }`. The profound architectural power of iterators is **Lazy Evaluation**: an iterator does not need to pre-compute or store all elements in memory; it computes or streams each element on demand when `next()` is called. This enables representing infinite sequences (such as Fibonacci streams or real-time event logs) in $O(1)$ constant memory."
      },
      miss: [
        {
          w: "Iterating over a collection with an iterator loads all elements into memory at once.",
          r: "Iterators evaluate lazily on-demand; a generator iterator can process a 50-gigabyte file line-by-line in a stream while consuming only a few kilobytes of RAM."
        },
        {
          w: "An iterator can be reset and reused from the beginning once it has finished traversing.",
          r: "Most iterators are one-way, single-pass consumption streams; once an iterator returns `done: true` or raises `StopIteration`, it is exhausted and cannot be reused without obtaining a fresh iterator."
        },
        {
          w: "The `for...in` loop in JavaScript is the standard way to iterate over an array's values.",
          r: "`for...in` iterates over an object's enumerable *property keys* (as strings, including prototype properties); iterating over collection *values* requires `for...of`, which invokes the iterator protocol."
        },
        {
          w: "Generators and iterators run on background parallel worker threads.",
          r: "Standard generator iterators execute on the exact same single thread as calling code; calling `yield` pauses the function's local execution context until the caller explicitly invokes `.next()`."
        }
      ],
      trade: {
        buys: [
          "Polymorphic traversal: write generic algorithms (`filter`, `find`, `sum`) that operate identically on arrays, trees, and streams.",
          "Minimal memory consumption: process multi-gigabyte datasets line-by-line in $O(1)$ constant memory via lazy streaming.",
          "Infinite data streams: represent mathematical sequences and endless event streams that compute values only when queried.",
          "Encapsulation preservation: consumers iterate over private internal collections without gaining access to internal data structures."
        ],
        costs: [
          "Single-pass exhaustion: once an iterator completes traversal, it cannot be rewound or restarted without creating a new instance.",
          "No random access: accessing the $N$-th element requires $O(N)$ sequential `.next()` calls (cannot jump directly to index $N$).",
          "Method call overhead: invoking `.next()` on every single element adds slight function call overhead compared to raw index loops.",
          "Stateful debugging complexity: iterators maintain internal mutation state, making time-travel debugging tricky."
        ],
        avoid: [
          "Using `for...in` in JavaScript when you want to iterate over iterable array values (always use `for...of`).",
          "Attempting to read an iterator multiple times after it has already been exhausted.",
          "Converting a lazy iterator directly to a full array (`[...infiniteIterator]`) when the dataset is unbounded, causing OOM crashes.",
          "Mutating the underlying collection while an iterator is actively traversing it, causing concurrent modification errors."
        ]
      }
    },
    {
      slug: "slicing",
      why: {
        before: "Extracting a sub-section of an array or string required writing manual loops with temporary buffers, or mutating the original collection in-place.",
        problem: "Manual extraction loops were verbose and error-prone; while in-place mutation destroyed the original collection and prevented pure functional transformations.",
        shift: "Programming languages introduced Slicing (`arr.slice()`, Python `arr[start:stop:step]`, Go slices): standardized operations that extract a contiguous subsequence of an array, string, or buffer."
      },
      num: {
        t: "Slicing Mechanisms: Memory Copies vs Zero-Copy Views",
        h: ["Language / Implementation", "Slicing Syntax / Method", "Memory Allocation Behavior", "Mutation Impact on Original", "Performance Characteristics"],
        r: [
          ["JavaScript (`Array.prototype.slice`)", "`arr.slice(start, end)`", "Shallow memory copy (allocates new array)", "Original array unmodified (pure function)", "Fast for small arrays, but scales $O(K)$ in memory with slice size $K$"],
          ["Python List Slicing", "`arr[start:stop:step]`", "Shallow memory copy (allocates new list)", "Original list unmodified", "Flexible step stride; allocates new list of references"],
          ["Go Slices (`[]T`)", "`slice[low:high:max]`", "Zero-copy View (points to same backing array)", "Mutating slice elements mutates the original backing array!", "Ultra-fast $O(1)$ constant-time slicing; zero memory allocations"],
          ["Python `memoryview` / Numpy", "`memoryview(buf)[start:stop]`", "Zero-copy View over raw binary buffer", "Mutating memoryview mutates original underlying buffer", "Crucial for high-performance audio, video, and tensor processing"],
          ["Rust Slices (`&[T]`)", "`&arr[start..end]`", "Zero-copy borrow view (pointer + length fat pointer)", "Guaranteed read-only view; compiler enforces borrow rules", "Ultra-fast $O(1)$ zero-cost abstraction enforced at compile time"]
        ],
        n: "Slicing operates under two distinct architectural models: **Copy Slicing** and **View Slicing**. In copy slicing (standard JavaScript `arr.slice()` and Python list slicing `list[1:4]`), the runtime allocates a brand-new array on the heap and shallow-copies the element references into it in $O(K)$ time, ensuring that modifying the new slice has zero effect on the original collection. In contrast, view slicing (Go slices, Rust `&[T]`, and Python `memoryview`) performs zero memory copying: it creates an 8-byte or 16-byte 'Fat Pointer' consisting of a pointer to the original array's memory address plus a length count. While view slicing executes in instantaneous $O(1)$ constant time regardless of whether the slice covers 5 elements or 50 million elements, modifying elements in a view slice mutates the original underlying memory."
      },
      miss: [
        {
          w: "JavaScript's `slice()` and `splice()` methods are identical functions with different names.",
          r: "`slice()` is a pure function that copies a portion of an array without modifying the original; `splice()` is an in-place mutating method that deletes, inserts, and alters the original array."
        },
        {
          w: "Slicing an array creates a deep clone of all nested objects inside it.",
          r: "Slicing performs a *shallow copy*; primitive values are copied, but object references remain shared, meaning mutating a nested object inside a slice mutates the object in the original array."
        },
        {
          w: "In Python, the slice `arr[2:5]` includes the element at index 5.",
          r: "Python slicing follows Dijkstra's half-open range $[\\text{start}, \\text{stop})$; index `stop` is explicitly exclusive, so `arr[2:5]` extracts elements at indices 2, 3, and 4 only."
        },
        {
          w: "Go slices are completely safe from memory leaks because they are lightweight views.",
          r: "A tiny Go slice referencing a small sub-slice of a multi-gigabyte backing array pins the *entire* multi-gigabyte array in memory, preventing garbage collection until the slice is released."
        }
      ],
      trade: {
        buys: [
          "Concise subsequence extraction: extract subarrays, substrings, and pagination windows in a single readable line.",
          "Immutability in copy slicing: creates clean independent copies without corrupting original source data.",
          "Zero-copy performance in view slicing: Go and Rust slices operate with $O(1)$ instant speed without allocating memory.",
          "Negative index flexibility: modern slicing handles negative offsets (e.g. `slice(-3)`) to grab trailing elements elegantly."
        ],
        costs: [
          "Memory allocation in copy slicing: slicing large arrays in tight loops allocates gigabytes of temporary memory.",
          "Subtle shared reference bugs: in shallow copies, mutating nested object properties affects both slice and parent.",
          "Memory retention leaks in view slicing: retaining a tiny view slice prevents the massive underlying backing array from being GC'd.",
          "Confusion between `slice()` and mutating `splice()`: common source of beginner and interview bugs in JavaScript."
        ],
        avoid: [
          "Using `splice()` when you intended to use pure `slice()` without mutating the original array.",
          "Assuming slicing creates a deep clone of nested objects (use `structuredClone()` for deep copies).",
          "Holding long-lived references to tiny sub-slices of massive memory buffers (copy the small slice to free the large buffer).",
          "Forgetting that the end index in standard slice operations is strictly exclusive."
        ]
      }
    },
    {
      slug: "list-comprehension",
      why: {
        before: "Transforming or filtering a collection required writing multi-line imperative loops with an empty result list, multiple temporary variables, and repetitive `.append()` calls.",
        problem: "Imperative loops were cluttered with visual boilerplate; state mutation was scattered; and higher-order functional methods (`map`, `filter`) required verbose lambda syntax.",
        shift: "Programming languages (pioneered by Haskell and standardized in Python) introduced List Comprehensions: a declarative syntactic construct based on mathematical set-builder notation that constructs new collections from existing iterables in a single, readable line."
      },
      num: {
        t: "List Comprehensions vs Imperative Loops vs Functional Map/Filter",
        h: ["Implementation Style", "Syntax / Form", "Evaluation Model", "Execution Speed in Python", "Readability / Declarative Intent"],
        r: [
          ["List Comprehension", "`[x * 2 for x in nums if x > 0]`", "Eagerly evaluated in C-level optimized bytecode loop", "Fastest (bytecode-optimized loop; 20-30% faster than append)", "High; concise declarative expression of transformation + filtering"],
          ["Imperative `for` Loop", "`for x in nums: if x > 0: res.append(x * 2)`", "Eagerly evaluated via Python bytecode VM stack operations", "Slower (repeatedly looks up `.append` attribute on each iteration)", "Low; multi-line boilerplate with mutable state accumulation"],
          ["Functional (`map` + `filter`)", "`list(map(lambda x: x*2, filter(lambda x: x>0, nums)))`", "Eagerly materialized into list (after lazy pipeline)", "Slowest (incurs Python function call overhead for every element)", "Poor in Python; noisy nested lambda syntax"],
          ["Generator Expression", "`(x * 2 for x in nums if x > 0)`", "Lazy evaluation on demand (iterator stream)", "Fastest startup; minimal memory footprint ($O(1)$ RAM)", "High; ideal for piping into aggregators (`sum()`, `max()`)"]
        ],
        n: "List comprehensions are derived from mathematical set-builder notation: $\\{ f(x) \\mid x \\in S \\land P(x) \\}$. In Python, a list comprehension is not merely syntactic sugar for an imperative `for` loop; it is compiled into dedicated optimized bytecode. In an imperative loop, executing `result.append(x)` requires the Python virtual machine to perform an attribute lookup on the `result` object (`LOAD_ATTR`) and push a function call frame on every single iteration. In contrast, a list comprehension uses the specialized `LIST_APPEND` bytecode opcode, which directly appends to the pre-allocated C-level list struct in memory without method resolution overhead, making comprehensions 20% to 30% faster than standard Python loops."
      },
      miss: [
        {
          w: "List comprehensions are just aesthetic syntax sugar that execute at the exact same speed as imperative loops.",
          r: "In Python, list comprehensions execute significantly faster than manual `for` loops because they are compiled into specialized `LIST_APPEND` bytecode that bypasses attribute lookup and stack overhead."
        },
        {
          w: "Using list comprehensions that span 4 nested loops and 5 conditionals is great, pythonic code.",
          r: "Comprehensions should be simple and readable; nesting multiple loops or conditions inside a single comprehension creates dense, unreadable code that should be refactored into standard loops."
        },
        {
          w: "List comprehensions evaluate lazily on-demand.",
          r: "List comprehensions are strictly *eager*; they immediately compute all elements and allocate the full list in memory; lazy on-demand evaluation requires a Generator Expression `(...)`."
        },
        {
          w: "List comprehensions should be used to execute side effects like printing to the console or writing to files.",
          r: "Comprehensions are designed purely to construct new data collections; using them solely for side effects (`[print(x) for x in items]`) is an anti-pattern that creates and discards temporary lists."
        }
      ],
      trade: {
        buys: [
          "Declarative clarity: combines mapping, filtering, and collection construction into a single expressive, readable line.",
          "C-level bytecode speed: in Python, executes 20-30% faster than manual `for` loops with `.append()` calls.",
          "Elimination of mutable boilerplate: replaces manual empty list initialization and state mutations.",
          "Natural mathematical alignment: maps directly to set-builder notation taught in mathematics and data science."
        ],
        costs: [
          "Eager memory allocation: creating a list comprehension over 10 million elements immediately allocates hundreds of megabytes of RAM.",
          "Readability decay if overused: complex nested comprehensions with multiple `for` and `if` clauses become unreadable.",
          "Difficult to set debugger breakpoints: stepping through a single-line comprehension in an interactive debugger is clumsy.",
          "Temptation for side-effects: developers misuse comprehensions for side-effect loops where standard `for` loops belong."
        ],
        avoid: [
          "Nesting more than two loops inside a single list comprehension (use standard readable `for` loops instead).",
          "Using list comprehensions solely to execute side effects without using the resulting list.",
          "Using a list comprehension when a memory-efficient lazy Generator Expression `(...)` would prevent high RAM usage.",
          "Writing 150-character unformatted comprehensions that wrap across multiple editor lines."
        ]
      }
    },
    {
      slug: "lambda-function",
      why: {
        before: "Passing a tiny, one-time calculation (like a custom sorting key or a filter predicate) required formally declaring a full named function elsewhere in the file using `def` or `function`.",
        problem: "Naming single-use throwaway functions cluttered the namespace, separated the transformation logic from where it was used, and bloated codebase line counts.",
        shift: "Alonzo Church's Lambda Calculus inspired Lambda Functions: anonymous, inline function expressions defined without an identifier, passed directly as arguments to higher-order functions."
      },
      num: {
        t: "Anonymous & Lambda Functions Across Programming Languages",
        h: ["Language", "Syntax / Declaration", "Expression vs Statement Body", "Lexical Scoping / Closure Support", "Primary Use Case"],
        r: [
          ["Python", "`lambda x, y: x + y`", "Strictly restricted to a single expression (no statements allowed)", "Full lexical closure; late binding caveat", "Short sorting key functions (`key=lambda x: x.age`), quick transforms"],
          ["JavaScript / TypeScript", "`() => {}` (Arrow Function)", "Both expressions (`x => x * 2`) and statements (`x => { ... }`)", "Full lexical closure + Lexical `this` binding", "Universal callbacks, functional array methods, event handlers"],
          ["Java (Java 8+)", "`(a, b) -> a + b`", "Both expression and block bodies; target typed to Functional Interface", "Captures effectively final variables only", "Java Streams (`stream().map(x -> x * 2)`), event listeners"],
          ["Rust", "`|x, y| x + y` (Closures)", "Both expressions and blocks; infers `Fn`, `FnMut`, or `FnOnce` traits", "Captures environment by reference (`&`), mutable ref (`&mut`), or move", "Iterator pipelines, thread spawning, asynchronous tasks"],
          ["C++ (C++11+)", "`[capture](args) { body }`", "Full statement blocks with explicit capture lists (`[&]`, `[=]`)", "Explicit control over capturing by value or reference", "STL algorithms (`std::sort`), concurrency tasks"]
        ],
        n: "A lambda function is fundamentally an anonymous function defined inline as an expression. In computer science theory, Alonzo Church formulated the Lambda Calculus in the 1930s as a formal system for function definition, application, and recursion. In practical software engineering, lambda functions are first-class citizens: they can be bound to variables, passed as arguments to higher-order functions (such as `map`, `filter`, `sort`), and returned from other functions. A critical operational aspect of lambdas is their Lexical Environment Closure: a lambda captures references to variables defined in its enclosing scope. In Python, late binding can cause the classic closure loop bug: if a lambda references a loop variable `i`, all lambdas evaluate `i` at invocation time rather than capture time, unless pinned with a default argument (`lambda x, i=i: x + i`)."
      },
      miss: [
        {
          w: "A lambda function is fundamentally faster and uses less CPU memory than a standard named function.",
          r: "A lambda function is compiled into the exact same function object or machine code as a named function; its benefit is syntactic brevity and locality, not raw CPU performance."
        },
        {
          w: "In Python, you should assign lambda functions to variables instead of writing `def` (`my_func = lambda x: x + 1`).",
          r: "PEP 8 explicitly forbids assigning lambdas to variables; use standard `def my_func(x): return x + 1` because named functions have proper `__name__` metadata for tracebacks."
        },
        {
          w: "Lambda functions in Python can contain multi-line statements, `try/except` blocks, and loops.",
          r: "Python lambdas are syntactically restricted to a single expression that yields a value; complex multi-line logic requires a standard `def` function."
        },
        {
          w: "Closures inside lambdas create deep copies of all captured variables at the instant of creation.",
          r: "Closures capture variable *references*, not value snapshots; if a captured variable changes in the outer scope before the lambda executes, the lambda reads the updated mutated value."
        }
      ],
      trade: {
        buys: [
          "Syntactic locality: define small, throwaway transformation logic directly at the call site where it is used.",
          "Namespace hygiene: avoids cluttering the module namespace with dozens of trivial single-use helper function names.",
          "Higher-order composability: powers functional paradigms (`map`, `filter`, `reduce`, event callbacks).",
          "Lexical closure encapsulation: easily captures surrounding state and configuration without passing extra arguments."
        ],
        costs: [
          "Degraded stack trace debugging: anonymous functions appear as `<anonymous>` or `<lambda>` in stack traces, obscuring errors.",
          "Syntactic limitations: in Python, lambdas are restricted to single expressions and cannot contain statements or assignments.",
          "Readability decay if overused: writing long, complex logic inside a lambda makes code unreadable and hard to test.",
          "Late-binding closure traps: capturing loop variables in closures without default pinning causes subtle concurrency and loop bugs."
        ],
        avoid: [
          "Assigning lambda functions to variables in Python (`f = lambda x: x * 2`); use a standard `def` function instead.",
          "Writing 80-character lambdas with nested ternaries; extract into a named function for clarity and testability.",
          "Capturing loop variables in lambdas without pinning their value at capture time (`lambda x, i=i: ...`).",
          "Using lambdas for complex business logic that deserves its own isolated, named unit tests."
        ]
      }
    },
    {
      slug: "arrow-function",
      why: {
        before: "In JavaScript, traditional `function` declarations bound their `this` context dynamically based on how they were called, requiring developers to write awkward workarounds like `var self = this;` or `.bind(this)`.",
        problem: "Passing traditional functions as asynchronous callbacks or event handlers stripped the object context, causing `this` to become `undefined` or the global `window` object, causing ubiquitous frontend runtime errors.",
        shift: "ECMAScript 2015 (ES6) introduced Arrow Functions (`() => {}`): concise anonymous functions featuring Lexical `this` Binding, inheriting the `this` context of their enclosing lexical scope automatically."
      },
      num: {
        t: "Arrow Functions vs Traditional JavaScript Functions",
        h: ["Feature / Dimension", "Arrow Function (`() => {}`)", "Traditional Function (`function() {}`)", "Primary Behavioral Impact", "Key Constraint / Anti-Pattern"],
        r: [
          ["`this` Binding", "Lexical (inherits `this` from enclosing static scope)", "Dynamic (bound at call site based on caller context)", "Eliminates `var self = this;` and `.bind(this)` boilerplate", "Never use as an object method requiring dynamic caller `this`"],
          ["Constructor Capability", "Cannot be called with `new` (lacks `[[Construct]]`)", "Can be called with `new` as a constructor", "Prevents calling lightweight callbacks as constructors", "Calling `new ArrowFunc()` throws fatal `TypeError`"],
          ["`arguments` Object", "Does NOT possess its own `arguments` object", "Possesses internal `arguments` array-like object", "Uses modern ES6 Rest parameters (`...args`) instead", "Accessing `arguments` inside arrow references parent scope"],
          ["`prototype` Property", "Has no `prototype` property (undefined)", "Has a `.prototype` property pointing to prototype object", "Consumes less memory per function instance", "Cannot be used for prototypal inheritance"],
          ["Concise Expression Body", "Supports implicit return (`x => x * 2`)", "Mandates explicit `{ return x * 2; }` block", "Clean, concise functional piping in array methods", "Returning object literal requires parentheses `() => ({ a: 1 })`"]
        ],
        n: "The defining technical breakthrough of ES6 Arrow Functions is **Lexical `this` Binding**. In standard JavaScript functions, the value of `this` is determined dynamically at runtime based on the invocation pattern (e.g. `obj.method()` sets `this` to `obj`, while a standalone callback `fn()` sets `this` to `undefined` in strict mode). This dynamic binding broke object-oriented callbacks (such as `setTimeout(function() { this.render(); }, 1000)`). Arrow functions do not define their own `this` execution context; instead, the JavaScript engine resolves `this` lexically by walking up the static scope chain to the enclosing lexical environment, exactly like resolving a standard variable identifier. Furthermore, arrow functions lack internal `[[Construct]]` method slots, saving memory and preventing them from being mistakenly invoked with the `new` operator."
      },
      miss: [
        {
          w: "Arrow functions should completely replace standard `function` declarations everywhere in JavaScript.",
          r: "Arrow functions are inappropriate for object methods (where dynamic caller `this` is required), class prototype methods, event handlers needing the event target as `this`, and constructor functions."
        },
        {
          w: "Using `.bind(newThis)` or `.call(newThis)` can change the `this` context of an arrow function.",
          r: "Arrow functions have immutable lexical `this`; calling `.bind()`, `.call()`, or `.apply()` on an arrow function passes arguments, but silently ignores any attempt to override `this`."
        },
        {
          w: "An arrow function returning an object literal can be written as `() => { a: 1 }`.",
          r: "Curly braces are parsed as a function body block statement, so `{ a: 1 }` is parsed as an empty statement with a labeled identifier, returning `undefined`; returning an object requires wrapping in parentheses: `() => ({ a: 1 })`."
        },
        {
          w: "Arrow functions have their own `arguments` object just like traditional functions.",
          r: "Arrow functions have no `arguments` object; referencing `arguments` inside an arrow function accesses the `arguments` of the nearest non-arrow parent function (use `...args` instead)."
        }
      ],
      trade: {
        buys: [
          "Lexical `this` preservation: seamlessly access parent class or component context inside callbacks without `.bind(this)`.",
          "Concise expression bodies: implicit return (`x => x * 2`) eliminates boilerplate curly braces and `return` statements.",
          "Reduced memory footprint: lacking `prototype` properties and constructor slots makes arrow functions lightweight.",
          "Clean functional array chaining: transforms `.map().filter().reduce()` pipelines into highly readable one-liners."
        ],
        costs: [
          "Inappropriate for object methods: declaring object methods with arrow functions binds `this` to `window`/global.",
          "Object return syntax trap: forgetting parentheses when returning object literals (`() => ({})`) causes silent `undefined` returns.",
          "Anonymous stack traces: arrow functions assigned to callbacks without names can show up as `<anonymous>` in traces.",
          "Cannot be used as generators: arrow functions cannot contain the `yield` keyword and cannot act as generator functions."
        ],
        avoid: [
          "Defining methods on object literals using arrow functions (`const user = { name: 'A', print: () => this.name }`).",
          "Forgetting parentheses when returning an object literal in concise body syntax (`x => ({ key: x })`).",
          "Attempting to use arrow functions as constructors with the `new` operator.",
          "Using arrow functions for DOM event listeners where accessing the clicked DOM element via `this` is expected."
        ]
      }
    }
  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
