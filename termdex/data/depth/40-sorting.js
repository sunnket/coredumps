/* ==========================================================================
   Depth pass 40 — divide and conquer, and the sorting algorithms built on it.

   Sorting is the best-studied problem in computing, which makes it the best
   place to see *why* algorithms differ. Every sort here is correct. They
   differ on constants, memory, stability, cache behaviour and worst-case
   guarantees — and those differences are exactly what decides which one a
   standard library actually ships.
   ========================================================================== */

(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([

    /* ------------------------------------------------------------------ */
    {
      slug: "divide-and-conquer",

      why: {
        before: "Solving a large problem meant processing it as a whole, " +
          "typically with loops over the entire input. The cost grew with the " +
          "size of the input in whatever way the loops dictated — often " +
          "quadratically.",
        problem: "Many problems are **easier per element when smaller**. " +
          "Sorting 1,000 items with insertion sort costs about a million " +
          "operations; sorting two halves of 500 costs half a million between " +
          "them. The work is superlinear, so splitting genuinely reduces the " +
          "total — provided recombining is cheap.",
        shift: "**Split, solve each part independently, combine.** The " +
          "recursion depth is `log n` because each level halves the size, and " +
          "if each level costs `O(n)` to combine, the total is `O(n log n)`. " +
          "The independence of the subproblems is what separates this from " +
          "dynamic programming — and it is also what makes divide-and-conquer " +
          "**trivially parallel**."
      },

      num: {
        t: "The master theorem, read practically",
        h: ["Recurrence", "Result", "Example"],
        r: [
          ["T(n) = 2T(n/2) + O(n)", "**O(n log n)**", "**merge sort**"],
          ["T(n) = 2T(n/2) + O(1)", "O(n)", "tree traversal"],
          ["T(n) = T(n/2) + O(1)", "**O(log n)**", "**binary search**"],
          ["T(n) = 7T(n/2) + O(n²)", "O(n^2.81)", "Strassen matrix multiply"],
          ["T(n) = T(n−1) + O(n)", "**O(n²)**", "**quicksort worst case**"]
        ],
        n: "The rule of thumb behind the table: compare the **work done " +
          "splitting and combining** against the **work done in the " +
          "recursion**. If combining dominates, the top level sets the cost; " +
          "if the recursion dominates, the leaves do; if they balance, you get " +
          "the extra `log n` factor. The last row is the warning — **the split " +
          "must actually be balanced**. Quicksort with a bad pivot removes one " +
          "element per level instead of half, giving `n` levels of `O(n)` work " +
          "and quadratic time. Divide-and-conquer's guarantee comes from the " +
          "split being even, not from the fact that you recursed."
      },

      miss: [
        {
          w: "Divide and conquer is the same idea as dynamic programming.",
          r: "The subproblems must be **independent**. In DP they " +
            "**overlap**, which is what makes caching worthwhile. Memoising a " +
            "merge sort gains nothing because no subproblem ever recurs. " +
            "Overlap is the dividing line between the two techniques."
        },
        {
          w: "Recursion makes an algorithm divide and conquer.",
          r: "Recursion is the usual implementation, not the definition. " +
            "Reducing a problem by **one** element per call is recursion " +
            "without division — linear depth, no `log n`. The technique " +
            "requires splitting into **substantially smaller** parts."
        },
        {
          w: "It always makes things faster.",
          r: "Only when the work is **superlinear** in the input size. Summing " +
            "an array is `O(n)` however you split it, and recursion adds " +
            "overhead. Real implementations exploit this in reverse: they " +
            "**stop recursing at small sizes** and switch to insertion sort, " +
            "because below roughly 16 elements the recursion costs more than " +
            "the quadratic algorithm."
        },
        {
          w: "The combine step is the easy part.",
          r: "It is frequently the hard part and the one that sets the " +
            "complexity. Merge sort's split is trivial and its merge does the " +
            "work; quicksort's partition does the work and its combine is " +
            "nothing. Where the effort sits is the main design decision."
        }
      ],

      trade: {
        buys: [
          "Superlinear problems reduced, commonly to `O(n log n)`.",
          "Subproblems are independent, so it parallelises directly.",
          "Recursive structure often mirrors the problem clearly.",
          "Good cache behaviour once subproblems fit in cache."
        ],
        costs: [
          "Recursion overhead and stack depth.",
          "Often needs auxiliary memory for the combine step.",
          "Slower than a simple loop on small inputs.",
          "An unbalanced split destroys the guarantee."
        ],
        avoid: [
          "The work is already linear.",
          "Subproblems overlap — that is **dynamic programming**.",
          "The input is small enough that overhead dominates.",
          "You cannot guarantee a balanced split."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "merge-sort",

      why: {
        before: "Simple sorts — bubble, selection, insertion — compare " +
          "adjacent or scan for extremes. All are `O(n²)`, which is fine for " +
          "twenty items and hopeless for a million.",
        problem: "The quadratic cost comes from each element being compared " +
          "against many others individually. There is no mechanism for one " +
          "comparison to settle the relative order of many pairs at once.",
        shift: "**Merging two already-sorted lists is linear.** Compare the " +
          "fronts, take the smaller, repeat. So sort each half recursively and " +
          "merge: `log n` levels of `O(n)` merging gives `O(n log n)` " +
          "**guaranteed**, on every input. That guarantee, plus **stability**, " +
          "is why merge sort survives despite using extra memory."
      },

      num: {
        t: "Merge sort's properties",
        h: ["Property", "Value", "Consequence"],
        r: [
          ["Best / average / worst", "**all O(n log n)**", "**no bad inputs**"],
          ["Extra space", "**O(n)**", "**its main cost**"],
          ["Stable", "**yes**", "**equal keys keep order**"],
          ["Cache behaviour", "sequential", "good for large data"],
          ["Parallelisable", "**yes**", "halves are independent"],
          ["External sorting", "**yes**", "**works on data exceeding RAM**"]
        ],
        n: "**Stability** is the property that decides real API design: sort a " +
          "table by name, then by department, and with a stable sort the " +
          "names stay ordered within each department. That is why **Java's " +
          "`Arrays.sort` uses merge sort for objects and quicksort for " +
          "primitives** — primitives have no identity beyond their value, so " +
          "stability is meaningless for them, and quicksort's smaller " +
          "constants win. The **external sorting** row is the other reason " +
          "merge sort persists: because it only ever reads sequentially, it " +
          "sorts files far larger than memory by merging sorted runs from " +
          "disk, which quicksort's random access cannot do."
      },

      miss: [
        {
          w: "Merge sort is slower than quicksort, so it is obsolete.",
          r: "It has **larger constants** but a better guarantee — `O(n log n)` " +
            "always, where quicksort can degrade to `O(n²)`. It is also stable " +
            "and works externally. Java, Python and C++ all ship merge-sort " +
            "derivatives for cases where those matter."
        },
        {
          w: "The `O(n)` extra space is unavoidable.",
          r: "**In-place merge sort** exists, and its merge is far more " +
            "complex and slower in practice. The usual real optimisation is " +
            "allocating **one** buffer up front and reusing it, rather than " +
            "allocating at every recursion level."
        },
        {
          w: "It always splits exactly in half.",
          r: "That is the textbook version. **Timsort**, the production " +
            "descendant, finds **naturally occurring sorted runs** in the data " +
            "and merges those instead — which is why it hits `O(n)` on " +
            "already-sorted input where textbook merge sort still does " +
            "`n log n` work."
        },
        {
          w: "Recursion is required.",
          r: "**Bottom-up merge sort** iterates: merge pairs of size 1, then " +
            "size 2, then 4. Same complexity, no stack usage, and easier to " +
            "parallelise across threads. Production implementations often use " +
            "this form."
        }
      ],

      trade: {
        buys: [
          "`O(n log n)` guaranteed on every input.",
          "Stable — equal elements keep their relative order.",
          "Sequential access, so it works on data larger than memory.",
          "Parallelises naturally.",
          "Predictable performance, valuable for real-time work."
        ],
        costs: [
          "`O(n)` extra memory.",
          "Larger constant factors than quicksort.",
          "Not in place — poor for tightly memory-constrained systems.",
          "Does not exploit existing order unless adapted."
        ],
        avoid: [
          "Memory is tight and in-place matters — use **heapsort**.",
          "Raw average speed on primitives matters — **quicksort**.",
          "The data is small — insertion sort is faster.",
          "The keys are small integers — **counting** or **radix sort** beats " +
            "`n log n`."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "quick-sort",

      why: {
        before: "Merge sort achieved `O(n log n)` but needed an `O(n)` buffer " +
          "and copied data back and forth. On 1960s machines, memory was the " +
          "binding constraint.",
        problem: "The extra array is not merely memory: it is copying, " +
          "allocation and cache pressure. On modern hardware the cache cost " +
          "often matters more than the memory footprint.",
        shift: "**Partition in place around a pivot**, then recurse on each " +
          "side. Everything smaller goes left, larger goes right, so once both " +
          "sides are sorted the array is sorted — **no combine step at all**. " +
          "Hoare's algorithm sorts in place with `O(log n)` stack, and its " +
          "tight sequential inner loop makes it the fastest general-purpose " +
          "sort in practice despite a quadratic worst case."
      },

      num: {
        t: "Pivot choice decides everything",
        h: ["Pivot strategy", "Worst case", "Triggered by"],
        r: [
          ["**First element**", "**O(n²)**", "**already-sorted input**"],
          ["Random", "O(n²) but improbable", "bad luck only"],
          ["**Median of three**", "O(n²)", "**adversarial input**"],
          ["**Introsort** (heapsort fallback)", "**O(n log n)**", "**nothing**"],
          ["True median", "O(n log n)", "too slow to compute"]
        ],
        n: "The **first-element** row is a genuine production hazard rather " +
          "than a textbook curiosity: picking the first element makes " +
          "**already-sorted data the worst case**, which is exactly the input " +
          "real systems see most often — re-sorting a sorted list is common. " +
          "The row that resolves this is **introsort**: run quicksort, track " +
          "recursion depth, and if it exceeds about `2 log n` switch to " +
          "**heapsort** for that subarray. You keep quicksort's speed and gain " +
          "an `O(n log n)` worst-case guarantee. C++'s `std::sort` is " +
          "introsort, which is why the standard can promise `O(n log n)` while " +
          "still being quicksort in the common case. Note also that quicksort " +
          "is **not stable** — partitioning swaps distant elements, destroying " +
          "the relative order of equal keys."
      },

      miss: [
        {
          w: "Quicksort is `O(n log n)`.",
          r: "Its **average** is `O(n log n)`; its **worst case is O(n²)**, " +
            "when partitions are consistently unbalanced. Naive " +
            "implementations hit this on sorted input, and adversarial input " +
            "has been used as a denial-of-service vector against services that " +
            "sort user data."
        },
        {
          w: "Random pivots make the worst case impossible.",
          r: "They make it **improbable and input-independent** — no attacker " +
            "can construct a bad input without predicting your randomness. The " +
            "worst case still exists; it just cannot be triggered " +
            "deliberately. For a guarantee you need **introsort**."
        },
        {
          w: "Quicksort is stable.",
          r: "It is **not**. Partitioning swaps elements across the array, so " +
            "equal keys lose their original order. If you sort by one field " +
            "then another expecting the first to be preserved, quicksort " +
            "breaks that — which is why languages use merge-sort derivatives " +
            "for objects."
        },
        {
          w: "Duplicate values are harmless.",
          r: "Many duplicates cause **catastrophic imbalance** in a naive " +
            "two-way partition — an array of all-identical elements is a worst " +
            "case. The fix is **three-way partitioning** (Dutch national flag): " +
            "less-than, equal, greater-than, with the equal block excluded from " +
            "recursion entirely."
        }
      ],

      trade: {
        buys: [
          "Fastest general-purpose sort in practice — small constants.",
          "In place, `O(log n)` stack only.",
          "Excellent cache locality from sequential partitioning.",
          "No combine step.",
          "Adapts to introsort for a worst-case guarantee."
        ],
        costs: [
          "`O(n²)` worst case without safeguards.",
          "Not stable.",
          "Performance depends entirely on pivot choice.",
          "Naive versions degrade on sorted or duplicate-heavy data.",
          "Recursive by nature."
        ],
        avoid: [
          "Stability is required — use **merge sort**.",
          "You need a hard worst-case bound — **heapsort** or introsort.",
          "Data may be adversarial and the pivot is not randomised.",
          "Sorting data larger than memory — merge sort sorts externally."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "heapsort",

      why: {
        before: "Quicksort is fast but can degrade to `O(n²)`. Merge sort " +
          "guarantees `O(n log n)` but needs `O(n)` extra memory. Neither " +
          "gives both.",
        problem: "Some systems need **both** guarantees: a hard upper bound on " +
          "time *and* constant extra space. Embedded software, real-time " +
          "systems and kernel code cannot allocate a buffer proportional to " +
          "the input, and cannot risk a quadratic blow-up.",
        shift: "**Use a heap.** Build a max-heap in `O(n)`, then repeatedly " +
          "swap the root to the end of the array and sift down — each " +
          "extraction is `O(log n)`, and the sorted portion grows into the " +
          "space the heap vacates. `O(n log n)` worst case, `O(1)` extra " +
          "space. The reason it is not the default is **cache behaviour**."
      },

      num: {
        t: "The three O(n log n) sorts",
        h: ["", "Heapsort", "Merge sort", "Quicksort"],
        r: [
          ["Worst case", "**O(n log n)**", "**O(n log n)**", "**O(n²)**"],
          ["Extra space", "**O(1)**", "O(n)", "O(log n)"],
          ["Stable", "**no**", "**yes**", "no"],
          ["Cache locality", "**poor — jumps**", "good", "**excellent**"],
          ["Real-world speed", "**slowest of the three**", "middle", "**fastest**"],
          ["Typical role", "**introsort fallback**", "objects, external", "default"]
        ],
        n: "The **cache locality** row explains the apparent paradox of the " +
          "table: heapsort has the best asymptotic profile of the three and is " +
          "the slowest in practice, typically **2–3× slower than quicksort**. " +
          "Sifting down jumps between index `i` and `2i+1`, and once the array " +
          "exceeds cache size nearly every one of those jumps is a cache miss, " +
          "while quicksort's partition walks memory sequentially. This is the " +
          "clearest everyday demonstration that **big-O ignores the memory " +
          "hierarchy**. Heapsort's real job today is as **introsort's " +
          "fallback**: rarely executed, but its guarantee is what lets " +
          "`std::sort` promise `O(n log n)`."
      },

      miss: [
        {
          w: "Heapsort is fast because its complexity is optimal.",
          r: "It is typically the **slowest** of the three `O(n log n)` sorts " +
            "in practice. Sifting down jumps around memory, causing cache " +
            "misses that quicksort's sequential partition avoids. Asymptotics " +
            "do not capture the memory hierarchy."
        },
        {
          w: "Building the heap costs `O(n log n)`.",
          r: "**Building is `O(n)`** when done bottom-up — most nodes are near " +
            "the leaves and sift down only a level or two. The `n log n` comes " +
            "from the **n extractions**, not the build. Inserting elements one " +
            "at a time *would* cost `O(n log n)`, which is why the bottom-up " +
            "build exists."
        },
        {
          w: "Heapsort needs a separate heap structure.",
          r: "It uses the **same array**. Children of index `i` live at `2i+1` " +
            "and `2i+2`, so the heap is implicit. The array is split in place " +
            "into a shrinking heap and a growing sorted region — that is what " +
            "makes it `O(1)` space."
        },
        {
          w: "Heapsort is obsolete because it is never the fastest.",
          r: "It is the **safety net** in every introsort implementation, " +
            "including C++'s `std::sort`. It also underpins **priority " +
            "queues** and partial sorting — *top k of n* costs `O(n + k log n)` " +
            "with a heap, far less than sorting everything."
        }
      ],

      trade: {
        buys: [
          "`O(n log n)` worst case guaranteed.",
          "`O(1)` extra space — truly in place.",
          "No recursion, so no stack growth.",
          "Predictable — no bad inputs.",
          "The heap structure also serves priority queues and top-k."
        ],
        costs: [
          "Slowest of the three in practice — poor cache locality.",
          "Not stable.",
          "Does not benefit from partially sorted input.",
          "Harder to parallelise than merge sort."
        ],
        avoid: [
          "Average speed matters most — **quicksort**.",
          "Stability is required — **merge sort**.",
          "The data is nearly sorted — **Timsort** exploits that.",
          "You need a parallel sort."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "counting-sort",

      why: {
        before: "`O(n log n)` was accepted as the sorting limit, and it is a " +
          "**proven lower bound** — any sort that works by comparing pairs " +
          "needs at least `n log n` comparisons in the worst case.",
        problem: "That proof assumes comparisons are the only tool. It says " +
          "nothing about what happens when you can **use the values " +
          "themselves** — when the keys are small integers, the value *is* an " +
          "index.",
        shift: "**Count occurrences, then read them back out.** Sorting a " +
          "million values in the range 0–255 needs one pass to count and one " +
          "pass to emit: `O(n + k)`, linear. The comparison lower bound is not " +
          "violated because **counting sort makes no comparisons at all** — it " +
          "escapes the model rather than beating it."
      },

      num: {
        t: "When counting sort wins",
        h: ["n", "Key range k", "Counting sort", "Comparison sort"],
        r: [
          ["1,000,000", "**256**", "**~1,000,256 ops**", "~20,000,000 ops"],
          ["1,000,000", "1,000,000", "~2,000,000", "~20,000,000"],
          ["1,000", "**2³²**", "**~4 billion — unusable**", "**~10,000 ops**"],
          ["100", "1,000", "~1,100", "~700"]
        ],
        n: "The **third row** is the whole caution: counting sort's cost " +
          "includes `k`, the size of the key **range**, not just the input. " +
          "Sorting a thousand 32-bit integers would allocate a four-billion-" +
          "entry counting array — catastrophically worse than any comparison " +
          "sort. The rule is `k = O(n)`; once the range greatly exceeds the " +
          "input size, the technique inverts from best to worst. When keys are " +
          "wide but you still want linear time, the answer is **radix sort**, " +
          "which applies counting sort digit by digit so `k` stays small. " +
          "Counting sort's **stability** — achieved by computing a prefix sum " +
          "of the counts and iterating the input backwards — is not optional " +
          "there: radix sort is only correct because each digit pass is stable."
      },

      miss: [
        {
          w: "Counting sort breaks the `O(n log n)` lower bound.",
          r: "That bound applies to **comparison-based** sorts, and counting " +
            "sort makes no comparisons — it uses values as array indices. " +
            "Different model, different bound. It does not disprove the " +
            "theorem; it sits outside its assumptions."
        },
        {
          w: "It is always faster because it is linear.",
          r: "It is `O(n + k)`. When `k` is large relative to `n`, the `k` term " +
            "dominates and it is far worse — sorting 100 values with keys up " +
            "to a billion is absurd. It only wins when the key range is " +
            "comparable to the input size."
        },
        {
          w: "It only sorts integers.",
          r: "It sorts anything mappable to a **small dense integer range**: " +
            "characters, enum values, dates within a known span, bucketed " +
            "scores. The requirement is a bounded discrete key, not the `int` " +
            "type."
        },
        {
          w: "Stability is incidental.",
          r: "It is **deliberate and essential**. The prefix-sum step plus " +
            "iterating the input **backwards** is what preserves order among " +
            "equal keys. Remove that and **radix sort breaks entirely**, since " +
            "radix relies on earlier digit passes surviving later ones."
        }
      ],

      trade: {
        buys: [
          "`O(n + k)` — linear when the key range is bounded.",
          "Stable when implemented with prefix sums.",
          "No comparisons — simple, branch-light inner loop.",
          "The building block that makes radix sort possible."
        ],
        costs: [
          "Memory proportional to the **key range**, not the input.",
          "Useless when the range is large or unbounded.",
          "Requires discrete, mappable keys.",
          "Needs the range known or computed in advance."
        ],
        avoid: [
          "The key range greatly exceeds the input size.",
          "Keys are floats, strings or arbitrary objects.",
          "The range is unknown and unbounded.",
          "Keys are wide integers — use **radix sort** instead."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "radix-sort",

      why: {
        before: "Counting sort is linear but needs memory proportional to the " +
          "key range, so 32-bit integers are out of reach — a four-billion-" +
          "entry array is not a sort, it is a memory error.",
        problem: "Wide keys have a large range but are made of **narrow " +
          "digits**. A 32-bit integer is four bytes, each with only 256 " +
          "possible values. The range problem is about how you look at the key, " +
          "not about the key itself.",
        shift: "**Sort one digit at a time, least significant first, with a " +
          "stable sort at each pass.** Each pass is a counting sort over 256 " +
          "buckets. After the last pass the array is fully sorted, because each " +
          "stable pass preserves the ordering the previous passes established. " +
          "Total cost `O(d · (n + k))` with `d` passes — linear in `n`, and " +
          "genuinely faster than quicksort on large integer arrays."
      },

      num: {
        t: "Choosing the radix for 32-bit keys",
        h: ["Bits per pass", "Passes", "Buckets", "Note"],
        r: [
          ["1 (binary)", "**32**", "2", "too many passes"],
          ["**8 (byte)**", "**4**", "**256**", "**counters fit in L1 cache**"],
          ["11", "3", "2,048", "counters exceed L1"],
          ["16", "**2**", "**65,536**", "**counter array thrashes cache**"]
        ],
        n: "The table is a cache argument, not an arithmetic one. Fewer passes " +
          "sounds strictly better, and it is not: a 65,536-entry counter array " +
          "does not fit in L1, so every count increment risks a miss and the " +
          "two-pass version loses to the four-pass one. **8 bits is the usual " +
          "sweet spot** because 256 counters sit comfortably in L1 while four " +
          "passes stay cheap. Two further practical points: **LSD radix must " +
          "use a stable sub-sort** or earlier passes are destroyed, and " +
          "**signed integers and floats need a key transform** — flipping the " +
          "sign bit for signed ints, and for IEEE-754 floats flipping all bits " +
          "of negatives and just the sign bit of positives — because their " +
          "bit patterns do not sort in the same order as their values."
      },

      miss: [
        {
          w: "Radix sort is always linear, so it always beats quicksort.",
          r: "It is `O(d · n)` where `d` is the number of digit passes, and " +
            "it makes `d` full passes over memory. For small `n`, quicksort's " +
            "single-pass cache-friendly partitioning wins. Radix pays off on " +
            "**large arrays of fixed-width keys**, typically above tens of " +
            "thousands of elements."
        },
        {
          w: "It works on any data type.",
          r: "It needs keys decomposable into **positional digits** with " +
            "lexicographic order matching value order. Signed integers and " +
            "floats **require a bit transform** first, and arbitrary objects " +
            "with a comparison function cannot be radix sorted at all."
        },
        {
          w: "Most significant digit first is the natural direction.",
          r: "**MSD** requires recursively sorting each bucket separately and " +
            "handles variable-length keys such as strings; **LSD** is a flat " +
            "sequence of stable passes and is simpler and faster for " +
            "fixed-width keys. Both exist and they suit different data."
        },
        {
          w: "The sub-sort choice does not matter.",
          r: "It **must be stable**. LSD radix works only because each pass " +
            "preserves the ordering established by earlier, less significant " +
            "passes. Swap in an unstable sub-sort and the algorithm produces " +
            "wrong output — it is the single most common implementation bug."
        }
      ],

      trade: {
        buys: [
          "Linear in `n` for fixed-width keys.",
          "Genuinely beats quicksort on large integer arrays.",
          "Stable when implemented with counting sort.",
          "No comparisons — no branch misprediction in the inner loop.",
          "Parallelises well; the basis of fast GPU sorts."
        ],
        costs: [
          "`O(n + k)` extra memory per pass.",
          "Multiple full passes over the data.",
          "Requires positional keys; needs transforms for signed and float.",
          "Loses to quicksort on small inputs.",
          "The stable sub-sort requirement is easy to get wrong."
        ],
        avoid: [
          "Keys are arbitrary objects with a comparator.",
          "The input is small.",
          "Memory is constrained.",
          "Keys are variable-length and MSD's complexity is not justified."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "timsort",

      why: {
        before: "Textbook sorts assume **random input**, and their analysis is " +
          "correct for it. Merge sort does `n log n` work whether the array is " +
          "shuffled or already sorted.",
        problem: "Real data is rarely random. It is appended-to sorted lists, " +
          "concatenated sorted files, sorted-then-slightly-modified arrays, " +
          "data with long runs of existing order. Textbook merge sort does " +
          "full `n log n` work on an already-sorted array — throwing away the " +
          "order that was already there.",
        shift: "**Find the order that already exists and merge it.** Tim " +
          "Peters' 2002 algorithm for Python scans for natural ascending or " +
          "descending runs, extends short ones with binary insertion sort, and " +
          "merges the runs under rules that keep the merge tree balanced. " +
          "Already-sorted input becomes **O(n)** — one scan. It is now the " +
          "default in Python, Java, Android, Swift and Rust."
      },

      num: {
        t: "Timsort against textbook merge sort",
        h: ["Input", "Merge sort", "Timsort"],
        r: [
          ["Random", "n log n", "n log n"],
          ["**Already sorted**", "**n log n**", "**O(n)**"],
          ["Reverse sorted", "n log n", "**O(n)** — run reversed in place"],
          ["**Two sorted halves**", "n log n", "**O(n)**"],
          ["Sorted plus a few inserts", "n log n", "**close to O(n)**"]
        ],
        n: "**Adaptivity** is the entire point: Timsort matches merge sort on " +
          "random data and collapses to linear on the structured data real " +
          "programs actually sort. Three details make it work. `minrun` (32–64) " +
          "is chosen so the number of runs is close to a power of two, keeping " +
          "the merge tree balanced. **Galloping mode** kicks in when one run " +
          "keeps winning: it binary-searches ahead instead of comparing one " +
          "element at a time, turning the merge of two well-separated runs into " +
          "`O(log n)` comparisons. And the **stack invariants** on run lengths " +
          "force merges to stay balanced — these were subtly wrong for years " +
          "until a 2015 formal-verification effort found a case that could " +
          "overflow the run stack in Java and Python, a good reminder that " +
          "*widely deployed* is not the same as *proven correct*."
      },

      miss: [
        {
          w: "Timsort is a merge sort with a small optimisation.",
          r: "It is a **hybrid**: binary insertion sort for short runs, merge " +
            "sort for combining them, galloping search inside merges, plus " +
            "invariants governing merge order. Each piece addresses a specific " +
            "real-data pattern."
        },
        {
          w: "It is stable, so it is safe to use everywhere.",
          r: "It is stable and it needs **`O(n)` extra memory** in the worst " +
            "case. Memory-constrained environments still prefer heapsort or " +
            "introsort. Java uses Timsort for objects and a dual-pivot " +
            "quicksort for primitives for exactly this reason."
        },
        {
          w: "Being widely deployed means it was proven correct.",
          r: "Its merge invariants were **subtly wrong** in Python, Java and " +
            "Android for years. A 2015 formal-verification paper found an input " +
            "that could overflow the run stack and crash. Ubiquity is not " +
            "proof."
        },
        {
          w: "Timsort is faster than quicksort.",
          r: "On **structured** data, often dramatically. On genuinely random " +
            "data quicksort's tighter loop and in-place operation usually win. " +
            "Timsort is chosen as a default because it is stable and adaptive, " +
            "not because it is the fastest on random input."
        }
      ],

      trade: {
        buys: [
          "`O(n)` on sorted, reverse-sorted or run-structured data.",
          "`O(n log n)` worst case guaranteed.",
          "Stable.",
          "Galloping makes merges of separated runs very cheap.",
          "Excellent on the concatenated and appended data real code sorts."
        ],
        costs: [
          "`O(n)` extra memory.",
          "Complex — hard to implement correctly, as its own history shows.",
          "No advantage over merge sort on random data.",
          "More branches than a simple sort."
        ],
        avoid: [
          "Memory is constrained — **heapsort**.",
          "Data is uniformly random and stability is irrelevant — " +
            "**quicksort**.",
          "Keys are small integers — **radix** or **counting sort**.",
          "You are implementing it yourself rather than using a library one."
        ]
      }
    },

    /* ------------------------------------------------------------------ */
    {
      slug: "hash-collision",

      why: {
        before: "A hash table's promise is `O(1)` lookup: hash the key, index " +
          "the array, done. That promise is what makes dictionaries the " +
          "default data structure in most languages.",
        problem: "A hash maps an **unbounded** key space into a **bounded** " +
          "number of slots, so collisions are not a flaw to be engineered away " +
          "— they are a **mathematical certainty**. With a million slots and " +
          "just 1,177 random keys, a collision is more likely than not.",
        shift: "**Design for collisions rather than against them.** Chain " +
          "colliding entries in a list, or probe for the next free slot. `O(1)` " +
          "is the **average** with a good hash and a controlled load factor; " +
          "the worst case is `O(n)` when everything collides — and an attacker " +
          "who can predict your hash function can force exactly that."
      },

      num: {
        t: "Chaining against open addressing",
        h: ["", "Separate chaining", "Open addressing"],
        r: [
          ["Collision handling", "**list per bucket**", "**probe next slot**"],
          ["Load factor limit", "**can exceed 1**", "**must stay < 1 (~0.7)**"],
          ["Cache behaviour", "poor — pointer chasing", "**good — contiguous**"],
          ["Deletion", "**simple**", "**needs tombstones**"],
          ["Memory", "pointer overhead", "**compact**"],
          ["Clustering", "none", "**degrades near capacity**"]
        ],
        n: "Two numbers do the real work here. **Load factor** is the " +
          "occupancy ratio, and open addressing degrades sharply as it " +
          "approaches 1 — at 0.9, linear probing averages around **50 probes " +
          "per lookup**, so implementations resize at roughly 0.7. The other " +
          "is **hash flooding**: before 2011, most languages used deterministic " +
          "string hashes, so an attacker could POST a form whose field names " +
          "all hashed to one bucket, turning an `O(1)` table into an `O(n)` " +
          "list and every request into a quadratic CPU burn. The fix — now " +
          "standard in Python, Ruby, PHP, Node and Rust — is **randomised " +
          "hash seeds per process**, which is also why **iteration order " +
          "varies between runs** and must never be relied on. Java takes a " +
          "different route: since Java 8, a bucket with more than eight " +
          "entries converts to a **red-black tree**, bounding the worst case " +
          "at `O(log n)`."
      },

      miss: [
        {
          w: "A good enough hash function eliminates collisions.",
          r: "Impossible. Mapping unbounded keys to bounded slots guarantees " +
            "collisions by the **pigeonhole principle**. A good hash " +
            "**distributes** them evenly; it cannot remove them. The birthday " +
            "paradox means they appear far sooner than intuition suggests."
        },
        {
          w: "Hash tables are `O(1)`.",
          r: "**`O(1)` average, `O(n)` worst case.** With adversarial keys or a " +
            "poor hash, every key lands in one bucket and lookup becomes a " +
            "linear scan. This has been exploited as a real denial-of-service " +
            "vector against web frameworks."
        },
        {
          w: "Deletion is straightforward in any hash table.",
          r: "In **open addressing** it is not. Simply clearing a slot breaks " +
            "probe chains, orphaning entries stored past it. You must write a " +
            "**tombstone** marker, and accumulated tombstones degrade " +
            "performance until a rehash clears them."
        },
        {
          w: "Two objects with the same hash are equal.",
          r: "The implication runs **one way only**: equal objects must have " +
            "equal hashes, but equal hashes do not imply equality. Every " +
            "lookup must compare keys after matching the hash. Overriding " +
            "`equals` without `hashCode` — or vice versa — silently breaks " +
            "every hash-based collection."
        }
      ],

      trade: {
        buys: [
          "Average `O(1)` lookup, insert and delete.",
          "Chaining tolerates load factors above 1.",
          "Open addressing is compact and cache-friendly.",
          "Tree-converting buckets bound the worst case at `O(log n)`."
        ],
        costs: [
          "Worst case `O(n)` without safeguards.",
          "Open addressing needs tombstones and early resizing.",
          "Chaining costs pointer memory and cache misses.",
          "Randomised seeds make iteration order non-deterministic.",
          "Resizing is an `O(n)` pause."
        ],
        avoid: [
          "You need **ordered** iteration — use a tree map.",
          "Worst-case latency must be bounded and the table is untreed.",
          "Keys come from untrusted input and the hash is not randomised.",
          "The dataset is tiny — a linear scan of an array is faster."
        ]
      }
    }

  ]);
})(window.TD = window.TD || {});
