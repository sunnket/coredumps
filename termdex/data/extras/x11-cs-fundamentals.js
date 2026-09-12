/* Real-world examples and step-by-step flows — CS Fundamentals. */
TD.attach("cs-fundamentals", {

"Algorithm": {
 ex: { h: "The instructions on a shampoo bottle",
       b: "*Lather, rinse, repeat* is an algorithm with a famous flaw: no termination condition. A real one is a finite, unambiguous sequence that turns an input into an output and always stops. The recipe metaphor holds right down to *and this is why a missing step ruins it*." },
 fl: { t: "What makes a procedure an algorithm",
       s: ["Write down the steps to solve the problem",
           { q: "Is every step unambiguous?",
             y: "Good — anyone or anything can follow it identically",
             n: "*Season to taste* is not an algorithm" },
           { q: "Does it always terminate?",
             y: "You have an algorithm — now analyse its cost",
             n: "*Repeat* with no stopping rule runs forever" },
           "Correctness first, then complexity, then constant factors"] }
},

"Data Structure": {
 ex: { h: "Choosing between a filing cabinet and a stack of paper",
       b: "The stack is fastest to add to and slowest to search. The cabinet is slower to file and instant to look something up in. Neither is better — the right one depends entirely on whether you file more often than you retrieve." },
 fl: { t: "Picking one",
       s: ["List the operations you will actually perform most",
           { q: "Look things up by name?",
             y: "Hash table — near-instant by key, no ordering",
             n: "Need order, or the smallest item repeatedly?" },
           { q: "Need the minimum or maximum constantly?",
             y: "Heap — instant access to the extreme, O(log n) to insert",
             n: "Ordered traversal? A balanced tree. Sequential access? An array" },
           "The choice is a trade between insert, lookup, delete and memory"] }
},

"Big O Notation": {
 ex: { h: "How the queue grows when the shop gets busier",
       b: "One till: double the customers, double the wait. Everyone shaking hands with everyone: double the customers, quadruple the handshakes. Big O ignores whether each handshake takes two seconds or three — it describes the shape of the growth, which is what decides whether the system survives ten times the traffic." },
 fl: { t: "Working out how badly something slows down",
       s: [{ s: "The question is never *how many seconds* — it is *what happens when the input gets ten times bigger*", n: "Seconds depend on your laptop. Growth depends on your code, and that is what you can control." },
           { s: "Call the size of the input n. Now count how the work grows as n grows", n: "n might be the number of users, rows, or characters." },
           { q: "Does your code go through the input once, or once for every item?",
             y: "Once, in a single loop — ten times the data means ten times the work. Written O(n), and this is fine",
             n: "A loop inside another loop over the same data — ten times the data means a *hundred* times the work. Written O(n²), and this is where slow code comes from" },
           { s: "If each step throws away half of what is left, the work barely grows at all", n: "Written O(log n). Searching a sorted list of a million items takes about twenty steps." },
           { s: "Ignore fixed costs and smaller terms — only the fastest-growing part matters", n: "At a million items, an n² term dwarfs everything else, so nobody cares about the rest." }] }
},

"Time Complexity": {
 ex: { h: "Estimating a job before quoting for it",
       b: "*It scales linearly with the number of rooms* tells a decorator far more than *it took four hours last time*. Same for code: knowing the growth rate lets you predict behaviour on ten million rows from a test on a thousand, which no stopwatch can do." },
 fl: { t: "From code to a complexity class",
       s: ["Identify the input that grows — usually n",
           { s: "Count the operations that scale with it", n: "Ignore anything with a fixed cost." },
           { q: "Are loops nested over the same n?",
             y: "Multiply: two nested loops is O(n²)",
             n: "Sequential loops add, and the largest term wins" },
           { s: "Quote worst case unless you say otherwise", n: "Average case matters too — quicksort is O(n²) worst, O(n log n) typical." }] }
},

"Space Complexity": {
 ex: { h: "How much bench space the job needs",
       b: "An algorithm that sorts in place needs the bench it already has. One that builds a copy needs twice the bench. On a laptop nobody notices; on a device with 512 MB, or a dataset larger than RAM, the space bound decides whether it runs at all." },
 fl: { t: "Counting extra memory",
       s: ["Count memory beyond the input itself",
           { q: "Does it allocate a structure proportional to n?",
             y: "O(n) space — a hash set, a copy, a memo table",
             n: "A few variables only — O(1), in place" },
           { s: "Recursion costs stack space", n: "Depth d means O(d) frames, even with no explicit allocation." },
           "Time and space usually trade against each other — memoisation buys speed with memory"] }
},

"Amortised Analysis": {
 ex: { h: "Rent paid monthly for a boiler replaced once a decade",
       b: "One month is enormously expensive and every other month is not. Averaged over the lease, the cost per month is modest and predictable. A dynamic array's occasional doubling works exactly this way, which is why appending is called O(1) despite that one expensive step." },
 fl: { t: "Why appending to a list is O(1)",
       s: ["The array has spare capacity",
           { q: "Is there room?",
             y: "Write it in — genuinely O(1)",
             n: "Allocate double the size and copy everything — O(n), this once" },
           { s: "Doubling means the expensive step happens ever more rarely", n: "The copies sum to less than 2n over n appends." },
           "Amortised O(1): the average over a sequence, not a guarantee per call"] }
},

"Array": {
 ex: { h: "A row of numbered lockers",
       b: "Locker 47 is found instantly because you can calculate exactly where it is. Inserting a locker between 12 and 13 means physically shifting every locker after it. That asymmetry — instant access, expensive insertion — defines everything about arrays." },
 fl: { t: "Why index access is instant",
       s: ["Elements are stored in one contiguous block",
           { s: "Address = start + index × element size", n: "One arithmetic operation, no searching." },
           { q: "Inserting in the middle?",
             y: "Every later element shifts up one — O(n)",
             n: "Appending at the end is O(1) amortised" },
           "Contiguity also means excellent cache behaviour — often faster than the theory suggests"] }
},

"Linked List": {
 ex: { h: "A treasure hunt where each clue names the next location",
       b: "Adding a stop is trivial — rewrite one clue. Finding the fortieth stop means visiting the first thirty-nine. And because the clues are scattered rather than in a row, the walking between them is slow, which is the cache penalty arrays do not pay." },
 fl: { t: "Array or linked list?",
       s: ["You need a sequence",
           { q: "Do you access by index, or iterate?",
             y: "Array — O(1) indexing and far better cache behaviour",
             n: "Linked list — O(1) insertion and deletion once you hold the node" },
           { s: "In practice arrays usually win", n: "Cache locality beats theoretical insertion cost most of the time." },
           "Linked lists shine as the backbone of queues, LRU caches and allocators"] }
},

"Stack": {
 ex: { h: "A pile of plates",
       b: "You add to the top and take from the top. Last in, first out — and it is not an arbitrary rule but exactly what nested things require. Undo history, matching brackets, and the call stack itself all work this way because *the most recent unfinished thing* is always the one to resolve next." },
 fl: { t: "Matching brackets with a stack",
       s: ["Read the string one character at a time",
           { q: "Is it an opening bracket?",
             y: "Push it onto the stack",
             n: "Is it a closing bracket?" },
           { q: "Does it match what is on top?",
             y: "Pop and continue",
             n: "Mismatch — the string is invalid" },
           { s: "At the end, the stack must be empty", n: "Anything left is an unclosed bracket." }] }
},

"Queue": {
 ex: { h: "A queue at a post office",
       b: "First in, first out — and everyone accepts it because it is fair. Every job queue, print spool and message broker works this way for the same reason: without it, an unlucky item can be starved indefinitely while newer ones jump ahead." },
 fl: { t: "Where queues appear",
       s: ["Work arrives faster than it can be processed",
           { s: "Add to the back, remove from the front", n: "Both O(1) with the right structure." },
           { q: "Is the queue growing without bound?",
             y: "Producers are outpacing consumers — add workers or apply backpressure",
             n: "It is absorbing bursts, which is what it is for" },
           "BFS uses one to explore a graph level by level"] }
},

"Hash Table": {
 ex: { h: "A cloakroom that files coats by ticket number",
       b: "The ticket number is run through a rule that says which peg to use, so retrieval is one step regardless of how many coats there are. The catch is when two tickets produce the same peg — and how the cloakroom handles that is the whole engineering story." },
 fl: { t: "How a lookup finds the answer instantly",
       s: [{ s: "Imagine a long row of numbered boxes and a rule that turns any key into a box number", n: "That rule is the hash function. Feed it the same key and it always gives the same number." },
           { s: "To store something, run the key through the rule and put the value in that box", n: "No searching. You go straight there." },
           { s: "To fetch it, run the same key through the same rule and open that box", n: "One step, however many million things are stored. This is why lookups feel instant." },
           { q: "What if two different keys produce the same box number?",
             y: "That happens, and it is normal — the box holds a small list, and you check the few entries in it",
             n: "As long as those lists stay short, lookups are still effectively one step" },
           { s: "When too many boxes are full, make a bigger row and redistribute everything", n: "Occasionally expensive, but rare enough that the average stays fast." },
           { s: "If an attacker can force every key into the same box, every lookup becomes a long search", n: "That is a real attack, and it is why serious systems randomise the rule at startup." }] }
},

"Hash Collision": {
 ex: { h: "Two people with the same locker combination",
       b: "Inevitable, because there are more possible names than lockers — the pigeonhole principle guarantees it. The interesting question was never how to avoid collisions but how to handle them gracefully, and how to stop an attacker from causing them deliberately." },
 fl: { t: "Resolving one",
       s: ["Two keys hash to the same bucket",
           { q: "Which strategy does the table use?",
             y: "Chaining — keep a list in the bucket and search it",
             n: "Open addressing — probe forward for the next free slot" },
           { s: "Both degrade as the table fills", n: "Which is why the load factor triggers a resize." },
           "Randomised hash seeds defend against deliberately crafted collisions"] }
},

"Set": {
 ex: { h: "A guest list, not a seating plan",
       b: "It answers one question extremely well — is this person invited? — and it does not care about order or duplicates. Checking membership against a list of ten thousand names means reading all ten thousand; against a set it is one step." },
 fl: { t: "Replacing a slow membership check",
       s: ["Code does `if item in big_list`",
           { q: "How large is the list?",
             y: "Thousands, inside a loop — you have an O(n²) problem",
             n: "A handful — leave it alone" },
           { s: "Convert to a set once, outside the loop", n: "O(n) to build, O(1) per check." },
           "You lose ordering and duplicates — which is usually fine"] }
},

"Tree": {
 ex: { h: "A company org chart",
       b: "One person at the top, everyone else has exactly one manager, no loops. That structure is why file systems, HTML documents, JSON and database indexes are all trees — hierarchy with no cycles is an extremely common shape in the world." },
 fl: { t: "Traversing one",
       s: ["Start at the root",
           { q: "What order do you need?",
             y: "Depth-first — go deep before wide. Natural with recursion",
             n: "Breadth-first — level by level. Needs a queue" },
           { s: "In-order on a BST yields sorted values", n: "Left subtree, node, right subtree." },
           "Depth is what determines cost — a balanced tree is O(log n), a degenerate one O(n)"] }
},

"Binary Tree": {
 ex: { h: "A knockout tournament bracket",
       b: "Every match has exactly two feeding into it. That two-way branching is what makes depth logarithmic: a thousand competitors need only ten rounds. It is the same reason binary search and balanced trees are fast." },
 fl: { t: "Why two children specifically",
       s: ["Each node has at most a left and a right child",
           { q: "How does depth grow with size?",
             y: "Balanced: doubling the nodes adds one level — O(log n)",
             n: "Degenerate: every node has one child, and it becomes a linked list" },
           { s: "Balance is the whole game", n: "Which is why AVL and red-black trees exist." },
           "Complete binary trees can be stored in a flat array with no pointers — that is a heap"] }
},

"Binary Search Tree": {
 ex: { h: "A guess-the-number game with hints",
       b: "Smaller values to the left, larger to the right, and every lookup discards half of what remains. It is beautiful until you insert already-sorted data, at which point every node goes right and you have built an expensive linked list." },
 fl: { t: "Searching, and how it degenerates",
       s: ["Compare the target with the current node",
           { q: "Smaller or larger?",
             y: "Go left for smaller, right for larger — half the tree is gone",
             n: "Equal — found it" },
           { q: "Was the data inserted in sorted order?",
             y: "Every node went right — the tree is a linked list, and lookup is O(n)",
             n: "Roughly balanced, so lookup is O(log n)" },
           "Self-balancing variants guarantee O(log n) regardless of insertion order"] }
},

"Balanced Binary Tree": {
 ex: { h: "A bookshelf that reorganises itself as you add books",
       b: "Without it, adding books in alphabetical order piles them all at one end. Self-balancing trees perform small rotations on insertion to keep both sides roughly even, so lookup stays fast whatever order things arrive in." },
 fl: { t: "How balance is maintained",
       s: ["Insert a node as in an ordinary BST",
           { q: "Did the subtree heights become too uneven?",
             y: "Rotate — a local restructuring that restores balance in O(1)",
             n: "Nothing to do" },
           { s: "AVL keeps stricter balance, so lookups are faster", n: "Red-black rebalances less, so writes are faster." },
           "Guaranteed O(log n) for search, insert and delete"] }
},

"Heap": {
 ex: { h: "A hospital waiting room ordered by severity",
       b: "You do not need the room fully sorted — you need to know who is next. A heap keeps only that guarantee: the most urgent case is at the top, and everything below is loosely arranged. That weaker promise is what makes it cheap to maintain." },
 fl: { t: "Getting the top and restoring order",
       s: ["The root is always the min or max",
           { s: "Read it in O(1)", n: "That is the only strong guarantee the structure gives." },
           { q: "Removed it?",
             y: "Move the last element to the root and sift it down — O(log n)",
             n: "Inserting: add at the end and sift up — also O(log n)" },
           "Stored as a flat array — child indexes are 2i+1 and 2i+2, with no pointers"] }
},

"Priority Queue": {
 ex: { h: "A hospital triage list, not a post-office queue",
       b: "Arrival order is irrelevant; urgency decides. Almost always implemented with a heap, and it is the engine inside Dijkstra's algorithm, task schedulers and event simulations — anywhere *what should I do next* is decided by weight rather than by time." },
 fl: { t: "Using one",
       s: ["Work items arrive with a priority",
           { s: "Insert into the heap — O(log n)", n: "Position is decided by priority, not arrival." },
           { q: "Ready to process?",
             y: "Pop the highest priority in O(log n)",
             n: "Beware starvation — low-priority items may never be reached" },
           "Add ageing to boost long-waiting items if fairness matters"] }
},

"Trie": {
 ex: { h: "The index tabs in a dictionary, all the way down",
       b: "All words starting *pre* share one path, and from there you branch. That shared prefix is the whole idea: autocomplete costs the length of what you typed, not the size of the dictionary, and every word with that prefix is sitting in the subtree below." },
 fl: { t: "Autocomplete in one structure",
       s: ["Each node is one character; each path spells a prefix",
           { s: "Walk the tree following the typed characters", n: "O(length of prefix) — independent of dictionary size." },
           { q: "Reached the end of what was typed?",
             y: "Every word in the subtree below is a completion",
             n: "No such prefix exists — return nothing" },
           "Memory-hungry — a radix tree compresses single-child chains"] }
},

"Graph": {
 ex: { h: "The London Underground map",
       b: "Stations and the lines between them, with loops, multiple routes and no single root. Once you see it, graphs are everywhere: social networks, dependencies, road systems, web links. Trees are just graphs that agreed not to have cycles." },
 fl: { t: "Modelling a problem as a graph",
       s: ["Identify the things — those are nodes",
           { s: "Identify the relationships — those are edges", n: "Directed if the relationship is one-way." },
           { q: "Do edges carry a cost?",
             y: "Weighted — use Dijkstra for shortest path",
             n: "Unweighted — BFS finds the shortest path in hops" },
           "Cycles are the thing to check for — they break topological sort and cause infinite loops"] }
},

"Adjacency List": {
 ex: { h: "Each person's contacts list, not a full grid",
       b: "A matrix of every possible pair among a million users is a trillion cells, almost all empty. Storing only the connections that exist is dramatically smaller for sparse graphs — and real graphs are almost always sparse." },
 fl: { t: "List or matrix?",
       s: ["You need to store a graph",
           { q: "Is it sparse — far fewer edges than V²?",
             y: "Adjacency list — O(V + E) space, fast to iterate a node's neighbours",
             n: "Dense — a matrix gives O(1) edge lookup at O(V²) space" },
           { s: "Lists make traversal natural", n: "BFS and DFS both want the neighbours of a node." },
           "Checking whether a specific edge exists is slower in a list — use a set per node"] }
},

"Binary Search": {
 ex: { h: "Finding a name in a phone book",
       b: "Open the middle, decide which half, discard the other, repeat. Twenty steps covers a million entries. The precondition is absolute: the data must already be sorted, and the most common bug is running it on data that only looks sorted." },
 fl: { t: "The search, and the classic bug",
       s: ["Set low and high to the ends of the sorted array",
           { s: "Look at the middle element", n: "`mid = low + (high - low) // 2` — the subtraction form avoids overflow." },
           { q: "Is the target smaller?",
             y: "Discard the upper half: high = mid − 1",
             n: "Larger — discard the lower half: low = mid + 1" },
           { q: "Have low and high crossed?",
             y: "Not present",
             n: "Repeat — each step halves the space" }] }
},

"Sorting Algorithm": {
 ex: { h: "Ordering a hand of cards",
       b: "For seven cards you slot each into place as you pick it up — insertion sort, and it is genuinely optimal at that size. For seven thousand you would split the pile, sort each, and merge. The best algorithm depends on n, and real library sorts switch strategy partway through." },
 fl: { t: "Choosing a sort",
       s: ["You need ordered data",
           { q: "Is it more than a handful of items?",
             y: "Use the language's built-in — it is a tuned hybrid and hard to beat",
             n: "Insertion sort is genuinely fastest for tiny arrays" },
           { q: "Do equal items need to keep their original order?",
             y: "You need a stable sort — merge sort or Timsort",
             n: "Quicksort is fine and usually faster in practice" },
           "Comparison sorts cannot beat O(n log n); counting sort can, for small integer ranges"] }
},

"Merge Sort": {
 ex: { h: "Two sorted piles combined by comparing the tops",
       b: "Split until each pile is one card, then merge pairs by repeatedly taking the smaller top card. Guaranteed O(n log n) whatever the input, and stable — at the cost of needing a second pile's worth of space, which is why in-memory sorts often prefer quicksort." },
 fl: { t: "Divide, then merge",
       s: ["Split the array in half",
           { s: "Recursively sort each half", n: "Until each piece has one element and is trivially sorted." },
           { s: "Merge two sorted halves by comparing their fronts", n: "Take the smaller, advance that pointer, repeat." },
           { q: "What does it cost?",
             y: "O(n log n) always — log n levels of merging, O(n) work per level",
             n: "O(n) extra space, which is its main drawback" },
           "Stable, predictable, and the natural choice for sorting data on disk"] }
},

"Quick Sort": {
 ex: { h: "Sorting people by height using one volunteer",
       b: "Pick someone, put everyone shorter to their left and taller to their right, then repeat on each side. Fast, in place, and it collapses to O(n²) if you keep picking the shortest person — which is exactly what happens on already-sorted data with a naive pivot." },
 fl: { t: "Partition and recurse",
       s: ["Choose a pivot",
           { s: "Partition: smaller to the left, larger to the right", n: "The pivot is now in its final position." },
           { s: "Recurse on each side", n: "In place — no extra array needed." },
           { q: "Is the pivot chosen badly?",
             y: "Splits of 1 and n−1 give O(n²) — sorted input with a first-element pivot",
             n: "Randomised or median-of-three pivots make that vanishingly unlikely" },
           "Not stable — equal elements can be reordered"] }
},

"Recursion": {
 ex: { h: "Standing between two mirrors",
       b: "Each reflection contains a smaller version of the same scene. A recursive function calls itself on a smaller input, and the only thing preventing infinite regress is the base case — which is precisely the line people forget, and the reason for every stack overflow." },
 fl: { t: "Writing one that actually stops",
       s: [{ s: "Recursion is a function that calls itself on a smaller piece of the same problem", n: "Like looking up a word and finding its definition uses another word you must also look up." },
           { s: "Write the stopping case first, before anything else", n: "The smallest input where you already know the answer without asking again. Miss this and it never stops." },
           { q: "Is the input already at that smallest case?",
             y: "Return the answer straight away and call nothing further",
             n: "Call yourself on a *definitely smaller* input — and it must be genuinely smaller, or you will loop forever" },
           { s: "Take the answer that comes back and combine it with the current piece", n: "The mental leap is trusting that the call works, rather than trying to follow it all the way down in your head." },
           { q: "Could it go very deep before stopping?",
             y: "Python gives up at around a thousand nested calls — rewrite it as an ordinary loop instead",
             n: "If the same sub-problems keep coming up, remember past answers so you only work each one out once" }] }
},

"Memoisation": {
 ex: { h: "Writing an answer in the margin the first time",
       b: "Computing fibonacci(40) naively recomputes fibonacci(10) hundreds of millions of times. Caching each result the first time turns exponential into linear — one of the largest speed-ups available for a single decorator." },
 fl: { t: "Turning exponential into linear",
       s: ["A recursive function is called with some input",
           { q: "Have you computed this input before?",
             y: "Return the cached answer immediately",
             n: "Compute it, store it in the cache, then return it" },
           { s: "Requires a pure function", n: "Same input must always give the same output." },
           { s: "`@lru_cache` in Python does this in one line", n: "With a bound on cache size." },
           "This is top-down dynamic programming"] }
},

"Dynamic Programming": {
 ex: { h: "Filling in a crossword by working outward from what you know",
       b: "Each answer makes neighbouring answers easier, and you never re-solve a clue. DP is that discipline applied to overlapping subproblems: solve each once, store it, and build the larger answer from stored smaller ones." },
 fl: { t: "Spotting when it applies",
       s: [{ s: "The whole idea is: never work out the same answer twice", n: "That is genuinely all it is, despite the intimidating name." },
           { s: "First check the problem breaks into smaller versions of itself", n: "The best route to step 10 is built from the best route to step 9." },
           { q: "Do those smaller versions keep repeating?",
             y: "Yes — then plain recursion would work out the same thing over and over, sometimes millions of times. Write each answer down and reuse it",
             n: "No, each piece is used once — then ordinary recursion is fine and you need none of this" },
           { q: "Which way round should you build it?",
             y: "Start from the full problem and work down, keeping a note of every answer you have already found — closest to how you naturally think about it",
             n: "Or start from the smallest case and build up a table until you reach the full problem — no risk of running out of call depth" },
           { s: "The hard part is never the code — it is deciding what one entry in your table means", n: "Once you can finish the sentence *entry i holds the best answer for...*, the rest usually writes itself." }] }
},

"Greedy Algorithm": {
 ex: { h: "Giving change with the largest coins first",
       b: "With British coins it always gives the fewest coins. With a hypothetical set of 1, 3 and 4, making 6 greedily gives 4+1+1 when 3+3 was better. Greedy is fast and simple and only correct when the problem has the right structure — which must be proved, not assumed." },
 fl: { t: "Is greedy safe here?",
       s: ["At each step, take the locally best option",
           { q: "Does a locally optimal choice always lead to a global optimum?",
             y: "Greedy is correct — and much faster than DP",
             n: "It gives a plausible-looking wrong answer" },
           { s: "Proven greedy problems exist", n: "Interval scheduling, Huffman coding, minimum spanning trees." },
           "When in doubt, test against a brute-force solution on small inputs"] }
},

"Divide and Conquer": {
 ex: { h: "Splitting a search party",
       b: "Half the searchers take the north field, half the south, and each half splits again. The work per level is the same but the area per team collapses — which is where the log factor in merge sort and binary search comes from." },
 fl: { t: "The three steps",
       s: ["Divide the problem into independent subproblems",
           { s: "Conquer each recursively", n: "Down to a trivially small base case." },
           { s: "Combine the sub-answers", n: "This step is often where the real work is — the merge in merge sort." },
           { q: "Do the subproblems overlap?",
             y: "You want dynamic programming instead — divide-and-conquer would repeat work",
             n: "Independent subproblems also parallelise beautifully" }] }
},

"Backtracking": {
 ex: { h: "Solving a maze with a piece of chalk",
       b: "Take a turning, mark it, and if you hit a dead end walk back and rub out the mark. It is exhaustive search with the sense to abandon a branch the moment it becomes impossible — which is why sudoku solvers finish in milliseconds rather than centuries." },
 fl: { t: "Search with pruning",
       s: ["Make a choice and extend the partial solution",
           { q: "Is the partial solution still valid?",
             y: "Recurse deeper",
             n: "Abandon this branch immediately — do not explore below it" },
           { q: "Is it complete?",
             y: "Record the solution",
             n: "Undo the choice and try the next option" },
           "The pruning is everything — without it this is plain brute force"] }
},

"Two Pointers": {
 ex: { h: "Two people closing in from opposite ends of a shelf",
       b: "Looking for two books whose page counts sum to 500, in a shelf sorted by length: start at both ends and move inward. Too big, move the right one in; too small, move the left one out. One pass instead of comparing every pair." },
 fl: { t: "Finding a pair that sums to a target",
       s: ["Place one pointer at each end of a sorted array",
           { s: "Compute the sum of the two", n: "One comparison." },
           { q: "Is it too large?",
             y: "Move the right pointer left — the only way to reduce the sum",
             n: "Too small — move the left pointer right" },
           { q: "Have the pointers met?",
             y: "No such pair exists",
             n: "Repeat — O(n) instead of O(n²)" }] }
},

"Sliding Window": {
 ex: { h: "A carriage window on a moving train",
       b: "The view changes by what enters at the front and what leaves at the back — you do not re-survey the whole landscape each second. Recomputing a sum over every subarray is O(n²); adding the new element and subtracting the old is O(n)." },
 fl: { t: "Longest substring with no repeats",
       s: ["Two pointers define the current window",
           { s: "Extend the right edge by one character", n: "Add it to a set of seen characters." },
           { q: "Is the new character already in the window?",
             y: "Advance the left edge, removing characters, until it is not",
             n: "Record the window length if it is the longest so far" },
           { s: "Each character enters and leaves at most once", n: "Which is why the whole thing is O(n)." }] }
},

"Breadth-First Search": {
 ex: { h: "Ripples spreading from a stone in a pond",
       b: "Everything one step away, then everything two steps away. That is why BFS finds the shortest path in an unweighted graph — the first time you reach a node, you cannot have got there in fewer hops, because you exhausted every shorter distance first." },
 fl: { t: "Shortest path in hops",
       s: ["Put the start node in a queue and mark it visited",
           { s: "Take the front of the queue", n: "FIFO order is what enforces level-by-level exploration." },
           { q: "Is it the target?",
             y: "The path found is the shortest in number of edges",
             n: "Add every unvisited neighbour to the back of the queue and mark it" },
           { s: "Mark on enqueue, not on dequeue", n: "Otherwise nodes get queued many times." },
           "Memory is the cost — the queue can hold a whole level at once"] }
},

"Depth-First Search": {
 ex: { h: "Exploring a cave by always taking the left passage",
       b: "You go as deep as possible before backtracking. It uses far less memory than exploring level by level and it will not find the shortest route — the first exit you reach may be the long way round. But for *is there any path* and for cycle detection it is exactly right." },
 fl: { t: "DFS and what it is good for",
       s: ["Start at a node and mark it visited",
           { q: "Does it have an unvisited neighbour?",
             y: "Go there immediately and repeat — depth first",
             n: "Backtrack to the previous node" },
           { s: "Recursion gives you the stack for free", n: "Or use an explicit stack to avoid depth limits." },
           { q: "Did you meet a node already on the current path?",
             y: "You found a cycle",
             n: "Continue until everything reachable is visited" }] }
},

"Dijkstra's Algorithm": {
 ex: { h: "A satnav finding the fastest route, not the fewest turns",
       b: "Roads have costs — distance, time, tolls — so counting hops is useless. Dijkstra always expands whichever unvisited place is currently cheapest to reach, which guarantees that when it settles a node, no cheaper route to it can exist." },
 fl: { t: "How it settles each node",
       s: ["Set the start distance to 0 and everything else to infinity",
           { s: "Take the unvisited node with the smallest known distance", n: "A priority queue makes this efficient." },
           { s: "For each neighbour, check whether going via this node is cheaper", n: "If so, update its distance." },
           { q: "Are any edge weights negative?",
             y: "Dijkstra is invalid — use Bellman-Ford instead",
             n: "Mark the node settled and repeat" },
           "A* adds a heuristic to steer the search toward the target"] }
},

"Topological Sort": {
 ex: { h: "The order you can get dressed in",
       b: "Socks before shoes, shirt before jumper — and several valid orders satisfy all of it. Build systems, task schedulers and package managers all do this, and the moment there is a cycle no valid order exists at all, which is exactly a circular dependency error." },
 fl: { t: "Ordering tasks with dependencies",
       s: ["Count how many prerequisites each task has",
           { s: "Start with every task that has none", n: "Those can run immediately." },
           { s: "Complete one, and decrement its dependents' counts", n: "Any that reach zero become available." },
           { q: "Did you place every task?",
             y: "That order is valid",
             n: "A cycle exists — the dependency graph is unsatisfiable" }] }
},

"Union-Find": {
 ex: { h: "Working out which social circles have merged",
       b: "Two people introduce each other and their whole groups become one. You never need to list a group — only to answer *are these two in the same group?* — and that question can be answered in near-constant time however many merges have happened." },
 fl: { t: "Two operations, both near-constant",
       s: ["Each element starts in its own set",
           { s: "Find: follow parent pointers to the root", n: "Path compression flattens the chain as you go." },
           { s: "Union: point one root at the other", n: "Union by rank keeps the trees shallow." },
           { q: "Are two elements connected?",
             y: "Their roots are the same",
             n: "Different roots means different components" },
           "Used in Kruskal's minimum spanning tree and in connected-component detection"] }
},

"Bit Manipulation": {
 ex: { h: "A row of light switches instead of a list",
       b: "Thirty-two permissions in one integer, each a switch. Checking, setting and clearing one is a single machine instruction. It is compact and fast and it is also write-only code unless you name the masks — which is why permission flags always come with named constants." },
 fl: { t: "Flags in a single integer",
       s: ["Assign each flag a distinct bit: 1, 2, 4, 8…",
           { s: "Set: `flags |= WRITE`", n: "OR turns the bit on." },
           { s: "Check: `flags & WRITE`", n: "AND isolates it — non-zero means set." },
           { q: "Need to clear it?",
             y: "`flags &= ~WRITE` — AND with the inverse",
             n: "Toggle with XOR: `flags ^= WRITE`" },
           "Always name the masks — bare numbers here are unreadable"] }
},

"P vs NP": {
 ex: { h: "Solving a sudoku versus checking one",
       b: "Checking a completed grid takes seconds. Solving a hard one may take a very long time. P vs NP asks whether every problem that is quick to check is also quick to solve — and nobody knows, which is why it carries a million-dollar prize." },
 fl: { t: "Placing a problem",
       s: ["Consider how hard the problem is",
           { q: "Can you solve it in polynomial time?",
             y: "It is in P — sorting, shortest path, matching",
             n: "Can you at least *verify* a proposed answer quickly?" },
           { q: "Verification is quick?",
             y: "It is in NP — sudoku, travelling salesman, satisfiability",
             n: "Harder still — outside NP entirely" },
           "If P = NP, most cryptography would collapse overnight"] }
},

"NP-Complete": {
 ex: { h: "The hardest problems in the class, all secretly the same",
       b: "Solve any one of them efficiently and you have solved all of them, because each can be transformed into any other. Recognising that your problem is NP-complete is genuinely useful news: it tells you to stop hunting for an exact fast algorithm and start on approximations." },
 fl: { t: "What to do when you hit one",
       s: ["Your problem resembles a known NP-complete problem",
           { q: "Can you reduce a known one to yours?",
             y: "Yours is NP-hard — no exact polynomial algorithm is known to exist",
             n: "Keep looking; it may be in P" },
           { s: "Practical routes forward", n: "Heuristics, approximation with a proven bound, or a solver on the real instance sizes." },
           "Real instances are often far easier than the worst case — measure before despairing"] }
},

"Object-Oriented Programming": {
 ex: { h: "A department that owns its own filing cabinet",
       b: "You do not reach into HR's cabinet and rearrange the folders. You ask HR to do something and they maintain their own records. That bundling of data with the operations allowed on it is the whole idea, and the discipline it enforces is why large systems stay comprehensible." },
 fl: { t: "The four ideas, in order of usefulness",
       s: [{ s: "Encapsulation", n: "Data and the operations on it live together; internals stay private." },
           { s: "Abstraction", n: "Expose what it does, hide how." },
           { s: "Inheritance", n: "Share behaviour — useful, and overused." },
           { s: "Polymorphism", n: "One interface, many implementations." },
           { q: "Reaching for inheritance?",
             y: "Check whether composition would do — it usually would",
             n: "Encapsulation earns its keep every single time" }] }
},

"Class": {
 ex: { h: "The architect's drawing, not the house",
       b: "It specifies what every house of this design will have — three bedrooms, a south-facing kitchen — without being a house anybody can live in. You can build a thousand from one drawing, and each one gets its own furniture." },
 fl: { t: "From class to object",
       s: ["The class declares fields and methods",
           { s: "Nothing exists in memory yet", n: "It is a description." },
           { s: "Instantiating runs the constructor", n: "Which fills in this object's own field values." },
           { q: "Do instances share anything?",
             y: "Methods and class-level attributes — one copy for all",
             n: "Instance fields are per-object and independent" }] }
},

"Object": {
 ex: { h: "One actual house built from the drawing",
       b: "It has an address, furniture and a specific front door that sticks in wet weather. Everything the drawing described is real here, and it is independent — repainting yours does not repaint your neighbour's, even though both came from the same plan." },
 fl: { t: "What an object holds",
       s: ["State — this object's own field values",
           { s: "Behaviour — the methods it inherits from its class", n: "Shared, not copied." },
           { s: "Identity — it is distinguishable from an identical object", n: "`is` versus `==` in Python; reference versus value equality." },
           { q: "Comparing two objects?",
             y: "Define equality explicitly, or you compare memory addresses",
             n: "That default surprises people constantly" }] }
},

"Encapsulation": {
 ex: { h: "A car's pedals, not its fuel injection",
       b: "You control the car through a deliberately small interface, and the manufacturer is free to change the engine entirely without retraining you. Every field you make public is a promise you have to keep — which is why *private by default* saves so much pain later." },
 fl: { t: "Deciding what to expose",
       s: ["You are designing a class",
           { q: "Does anything outside genuinely need this field?",
             y: "Expose it through a method, so you can change the internals later",
             n: "Keep it private — the smaller the surface, the freer you are" },
           { s: "Every public member is a commitment", n: "Changing it breaks callers you cannot see." },
           "Invariants can only be enforced if the data is not directly reachable"] }
},

"Inheritance": {
 ex: { h: "A specialist role that is still a job",
       b: "A surgeon is a doctor — everything true of doctors is true of surgeons. That *is-a* test is the only justification for inheritance, and most misuse comes from using it to share code between things that are not really the same kind of thing." },
 fl: { t: "Should this be inheritance?",
       s: ["You want to reuse behaviour from another class",
           { q: "Is the new thing genuinely a kind of the old one?",
             y: "Inheritance is defensible — and it should satisfy Liskov substitution",
             n: "Use composition — hold an instance and delegate to it" },
           { s: "Deep hierarchies become impossible to reason about", n: "Two levels is usually plenty." },
           "Changes to a base class ripple everywhere — that is the hidden cost"] }
},

"Polymorphism": {
 ex: { h: "The word *play* applied to different instruments",
       b: "*Play* means something different on a violin and a drum, and a conductor does not need to know which. One instruction, many correct behaviours — which is what lets you add a new instrument without rewriting the score." },
 fl: { t: "One instruction, several behaviours",
       s: [{ s: "You want to write `shape.draw()` once, and have it work for circles, squares and triangles", n: "Without a long if-else chain checking which kind you were given." },
           { s: "Each kind of shape provides its own version of `draw`", n: "The circle knows how to draw a circle; the square knows about squares. Neither knows about the other." },
           { s: "Your code calls `draw` without ever asking what it is holding", n: "It only needs to know that whatever this is, it can be drawn." },
           { q: "How does the right version get chosen?",
             y: "The object itself carries the answer — it was created as a circle, so it runs the circle version",
             n: "Not decided by your code, and not decided in advance. Decided by the object at the moment you ask" },
           { s: "The payoff arrives when you add a hexagon", n: "You write the new shape and nothing else changes. Code that draws shapes has never heard of hexagons and does not need to." }] }
},

"Abstraction": {
 ex: { h: "A light switch",
       b: "You do not think about the grid, the substation or the wiring in the wall. The switch is a small, stable interface over enormous complexity — and it is a good abstraction because it almost never forces you to think about what is underneath." },
 fl: { t: "Judging an abstraction",
       s: ["You define an interface over something complex",
           { q: "Can callers use it without knowing the internals?",
             y: "The abstraction is doing its job",
             n: "It leaks — callers must understand what it was hiding" },
           { s: "All non-trivial abstractions leak somewhat", n: "Spolsky's law; the aim is to leak rarely." },
           "Too many layers is its own problem — each one costs a reader"] }
},

"Interface": {
 ex: { h: "A power socket standard",
       b: "Any appliance with the right plug works, and neither the appliance nor the grid needs to know anything else about the other. An interface is that contract: these operations exist, with these signatures, and how you provide them is entirely your business." },
 fl: { t: "Coding against an interface",
       s: ["Define the operations callers need",
           { s: "Implementations promise to provide them", n: "Several different ones can coexist." },
           { q: "What does the caller depend on?",
             y: "The interface only — so you can swap implementations freely",
             n: "If it depends on a concrete class, you have coupled them" },
           "This is what makes testing with a fake implementation possible"] }
},

"Composition over Inheritance": {
 ex: { h: "A phone that contains a camera, rather than being one",
       b: "*Has-a* is far more flexible than *is-a*. A phone that inherits from Camera is stuck with everything a camera is; a phone that holds a camera can swap it, have two, or have none. Most inheritance hierarchies that grow painful started as a *has-a* forced into an *is-a*." },
 fl: { t: "Choosing between them",
       s: ["You need behaviour from another class",
           { q: "Is it *is-a* or *has-a*?",
             y: "*Has-a* — hold an instance as a field and delegate",
             n: "Genuinely *is-a* — inheritance may be right" },
           { s: "Composition can change at runtime", n: "Inheritance is fixed at compile time." },
           "It also avoids the diamond problem and deep, fragile hierarchies"] }
},

"Functional Programming": {
 ex: { h: "A kitchen where nobody edits anyone else's dish",
       b: "Every station takes ingredients and produces a new plate; nothing is modified in place. It sounds wasteful and it makes reasoning enormously easier — any function's behaviour depends only on what you handed it, so testing and concurrency both get simpler." },
 fl: { t: "The core commitments",
       s: [{ s: "Pure functions", n: "Same input, same output, no side effects." },
           { s: "Immutable data", n: "Transform into new values rather than mutating." },
           { s: "Functions as values", n: "Pass them, return them, compose them." },
           { q: "Where do side effects go?",
             y: "Pushed to the edges — I/O at the boundary, pure logic in the middle",
             n: "You cannot eliminate them; you can concentrate them" }] }
},

"Pure Function": {
 ex: { h: "A vending machine versus a colleague's mood",
       b: "Press B4 and you always get the same thing, regardless of the weather or what happened yesterday. That predictability is what makes pure functions trivially testable, safely cacheable and inherently thread-safe — none of which is true of a function that reads a global." },
 fl: { t: "Is this function pure?",
       s: ["Look at what the function touches",
           { q: "Does it depend on anything except its arguments?",
             y: "Not pure — globals, the clock, a database, randomness",
             n: "Does it change anything outside itself?" },
           { q: "Does it mutate an argument, write a file or print?",
             y: "Not pure — that is a side effect",
             n: "Pure: safe to memoise, to parallelise, and trivial to test" }] }
},

"Side Effect": {
 ex: { h: "A librarian who also rearranges the shelves",
       b: "You asked for a book and the catalogue silently changed. That is what makes side effects hard to reason about — the function's name told you one thing and it did two. Not eliminable, but they belong where a reader expects them." },
 fl: { t: "Managing them",
       s: ["A function does something beyond returning a value",
           { q: "Does the name make it obvious?",
             y: "`save_user()` clearly writes — fine",
             n: "`get_user()` that also updates a timestamp will surprise someone" },
           { s: "Concentrate effects at the boundaries", n: "Pure core, effectful shell." },
           "Pure functions are testable without any setup; effectful ones need mocks"] }
},

"Immutability": {
 ex: { h: "Signing a contract rather than editing it",
       b: "Nobody amends the signed copy — you issue a new version. If everything is immutable, no other thread can change your data mid-operation, and *who changed this?* stops being a question. The cost is allocation, which modern runtimes handle better than you would expect." },
 fl: { t: "Why refusing to change things prevents bugs",
       s: [{ s: "An immutable value cannot be altered once created. Want a different one? You make a new one", n: "Text in most languages already works this way — adding to a string gives you a new string." },
           { s: "The bug it prevents: you pass a list to a function and the function quietly changes it", n: "Your list is now different and nothing told you. In a large program this is genuinely hard to track down." },
           { q: "What if two parts of the program share the same value?",
             y: "If it cannot change, sharing is completely safe — nobody can affect anybody else, even running at the same time",
             n: "If it can change, either part might alter it under the other's feet, and you are back to hunting invisible bugs" },
           { s: "It also makes things much easier to reason about", n: "If a value cannot change, then whatever it was at the top of the function, it still is at the bottom." },
           { s: "The cost is making copies, which uses more memory", n: "Usually a good trade, and languages built around this idea share the unchanged parts behind the scenes to keep it cheap." }] }
},

"Higher-Order Function": {
 ex: { h: "A manager who is handed the procedure to follow",
       b: "*Go through these files and apply this rule to each* — the rule is an argument, so the same manager handles filtering, transforming and summarising. `map`, `filter` and `sort` are exactly this, and it is why you can sort by anything without a new sort function." },
 fl: { t: "Passing behaviour as data",
       s: ["A function takes another function as an argument",
           { s: "Or returns one — a decorator does both", n: "Functions are values, like numbers." },
           { q: "What does this let you do?",
             y: "Write the loop once and vary the operation — map, filter, reduce, sort",
             n: "Without it, every variation needs its own function" },
           "A closure is how the returned function remembers its context"] }
},

"Closure": {
 ex: { h: "A lunchbox packed at home and opened at work",
       b: "The function was defined in one place and runs somewhere else entirely, and it still has access to the variables that surrounded it when it was written. That captured environment is what makes callbacks, decorators and function factories possible." },
 fl: { t: "What gets carried along, and the trap in loops",
       s: [{ s: "Normally, when a function finishes, its local variables disappear", n: "That is the usual and expected behaviour." },
           { s: "But if you define a function *inside* another and use the outer one's variables, something different happens", n: "The inner function needs those variables to work, so they cannot simply vanish." },
           { s: "Return that inner function and it carries those variables with it", n: "The outer function has finished, yet its variables live on because the inner one still uses them. That bundle is the closure." },
           { q: "Does it keep a copy of the value, or a link to the variable itself?",
             y: "A link to the variable — not a snapshot of what it held at the time",
             n: "This distinction sounds academic and causes a very common bug" },
           { s: "The trap: create functions inside a loop and they all share the same loop variable", n: "By the time you call any of them, the loop has finished, so every one of them sees the final value. Not the value at the moment it was created." }] }
},

"Declarative Programming": {
 ex: { h: "Ordering a taxi versus giving turn-by-turn directions",
       b: "*Take me to the station* leaves the route to the driver, who may know about the roadworks. SQL, HTML and React are declarative in exactly this way: you describe the destination and the engine chooses how — which is why the query planner can outperform your hand-written loop." },
 fl: { t: "What you give up and gain",
       s: ["You state the desired result",
           { q: "Who decides how it happens?",
             y: "The engine — a SQL planner, a rendering library, a build tool",
             n: "In imperative code, you do, step by step" },
           { s: "The engine can optimise in ways you would not", n: "And improve without you rewriting anything." },
           "You lose fine control, which occasionally matters — hence query hints"] }
},

"Imperative Programming": {
 ex: { h: "Turn-by-turn directions",
       b: "Left at the lights, second exit, park behind the church. Complete control and complete responsibility — if there are roadworks, you deal with them. Most code is imperative, and the skill is knowing when to hand a section over to something declarative." },
 fl: { t: "Where it is the right choice",
       s: ["You write explicit steps that change state",
           { q: "Does the *how* genuinely matter here?",
             y: "Imperative — performance-critical loops, precise control flow",
             n: "A declarative form is usually shorter and less error-prone" },
           { s: "Most languages support both", n: "A comprehension is declarative; the loop it replaced was not." },
           "Mixing them thoughtfully is normal — purity is not the goal"] }
},

"Compiler": {
 ex: { h: "Translating a whole book before publication",
       b: "The translator reads everything, flags contradictions, and produces a finished edition. Errors surface before a single reader opens it — which is exactly why a type error at compile time costs thirty seconds and the same error at runtime costs an incident." },
 fl: { t: "The stages, in order",
       s: [{ s: "Lexing", n: "Characters become tokens." },
           { s: "Parsing", n: "Tokens become an abstract syntax tree." },
           { s: "Semantic analysis", n: "Type checking, name resolution — where most errors are caught." },
           { s: "Optimisation, then code generation", n: "IR is transformed, then machine code is emitted." },
           { q: "When do you learn about errors?",
             y: "Before running anything — the whole point",
             n: "Runtime errors still exist; the compiler only catches what types can express" }] }
},

"Interpreter": {
 ex: { h: "A simultaneous interpreter at a conference",
       b: "They translate as you speak, so you get going immediately and any mistake surfaces the moment you reach it. Faster to start, slower overall — which is precisely the trade between an interpreted and a compiled language." },
 fl: { t: "Interpreted or compiled?",
       s: ["Source code needs to become behaviour",
           { q: "Is it translated ahead of time?",
             y: "Compiled — slower to start, faster to run, errors found early",
             n: "Interpreted — instant feedback, slower execution, errors found on that line" },
           { s: "Most modern runtimes do both", n: "CPython compiles to bytecode; V8 JITs hot paths to machine code." },
           "*Interpreted language* is really a statement about the usual implementation"] }
},

"Parser": {
 ex: { h: "Diagramming a sentence",
       b: "It works out that *the cat sat on the mat* has a subject, a verb and a prepositional phrase — the grammatical structure behind the flat sequence of words. Every compiler, JSON reader and template engine begins with exactly this step." },
 fl: { t: "From text to structure",
       s: ["The lexer produces a stream of tokens",
           { s: "The parser matches them against a grammar", n: "Building a tree as it goes." },
           { q: "Does the input fit the grammar?",
             y: "You get an abstract syntax tree to work with",
             n: "A syntax error, reported at the point the parser gave up" },
           "Never parse structured formats with regular expressions — use a real parser"] }
},

"Abstract Syntax Tree": {
 ex: { h: "The meaning of the sentence, not its punctuation",
       b: "The tree keeps that this is an addition of two things and discards the whitespace and the brackets that told the parser so. Every linter, formatter, minifier and codemod works on this tree — which is why they can restructure code safely and a regex cannot." },
 fl: { t: "What tools do with it",
       s: ["Source is parsed into a tree of nodes",
           { s: "Syntax noise is gone; structure remains", n: "Brackets and whitespace served their purpose during parsing." },
           { q: "What operates on it?",
             y: "Linters walk it, formatters print it back, compilers lower it to IR",
             n: "Codemods transform it and regenerate source" },
           "Python exposes it directly through the `ast` module"] }
},

"Machine Code": {
 ex: { h: "The instructions the machine actually obeys",
       b: "Numbers naming operations and registers, specific to one processor family — which is why an x86 binary will not run on an ARM chip. Everything above it, from assembly to Python, exists so humans never have to write it." },
 fl: { t: "How your code gets here",
       s: ["Source is compiled or interpreted",
           { q: "Ahead of time or during execution?",
             y: "AOT — a binary is produced for one architecture",
             n: "JIT — hot paths are compiled at runtime for whatever the machine is" },
           { s: "The CPU decodes and executes each instruction", n: "Fetch, decode, execute — billions per second." },
           "Portability is why the JVM and WebAssembly exist"] }
},

"Memory Management": {
 ex: { h: "Booking and releasing meeting rooms",
       b: "Book what you need, release it when you finish. Forget to release and eventually there are no rooms — that is a memory leak. Use a room after releasing it and you find someone else's meeting — that is a use-after-free, and it is the source of a great many security holes." },
 fl: { t: "Who is responsible",
       s: ["A program needs memory at runtime",
           { q: "Who frees it?",
             y: "You do — C and C++. Maximum control, maximum footguns",
             n: "A garbage collector — Java, Python, Go. Safer, with pauses" },
           { s: "Rust's ownership model is a third answer", n: "The compiler proves safety with no runtime collector." },
           "Leaks, double frees and use-after-free are the three classic failures"] }
},

"Stack and Heap Memory": {
 ex: { h: "Your desk versus the storeroom",
       b: "The desk is right there, strictly ordered, and small — put something down and pick it up in reverse order. The storeroom is large, requires a request, and you must remember to return things. Local variables live on the desk; anything large or long-lived goes to the storeroom." },
 fl: { t: "Where a value ends up",
       s: ["A function declares a variable",
           { q: "Is the size known and the lifetime local?",
             y: "The stack — allocation is a pointer bump, freed automatically on return",
             n: "The heap — explicit allocation, and a garbage collector or manual free" },
           { s: "Stack space is small — a few MB", n: "Deep recursion overflows it." },
           "Returning a pointer to a stack variable is a use-after-free waiting to happen"] }
},

"Pointer": {
 ex: { h: "A postal address, not the house",
       b: "You can copy the address onto a hundred envelopes without building a hundred houses. Everyone with the address can visit the same house and rearrange the furniture — which is the power and the hazard. An address for a demolished house is a dangling pointer." },
 fl: { t: "The three classic ways it goes wrong",
       s: [{ s: "A pointer does not hold a value — it holds the *address* of where a value is kept", n: "Like a note saying \"the file is in cabinet 3, drawer 2\" rather than the file itself." },
           { s: "To use it you follow the address to the actual value", n: "This is fine as long as something is genuinely there." },
           { q: "Is there really something at that address?",
             y: "Yes — follow it and read or change the value as normal",
             n: "No — it points at nothing, or at memory already given back. The program may crash, or may quietly read someone else's data" },
           { s: "First failure: giving the same memory back twice", n: "The system's records of what is free become corrupted, and this is frequently exploitable by an attacker." },
           { s: "Second failure: never giving it back at all", n: "The program's memory use creeps up for hours or days until it is killed. This is a leak." },
           { s: "Third failure: using it after giving it back", n: "The memory has probably been handed to another part of the program, so you are now reading or writing its data." }] }
},

"Garbage Collection": {
 ex: { h: "A cleaner who removes anything nobody can still reach",
       b: "If no route to an object exists from anywhere live, nobody can ever use it again and it can go. The cost is that the cleaner occasionally needs everyone to stop moving, which is the pause that latency-sensitive systems fight so hard to avoid." },
 fl: { t: "How it decides what to throw away",
       s: [{ s: "The rule is simple: if your program can no longer reach a piece of data, it can never use it again, so it is safe to reclaim", n: "Nothing to do with whether you *meant* to keep it." },
           { s: "Start from everything the program can definitely see right now", n: "Variables currently in use, and anything global." },
           { s: "Follow every reference outwards, ticking off everything you can reach", n: "Reach a list, then tick everything in that list, then everything in those, and so on." },
           { q: "Did anything never get ticked?",
             y: "Then no path leads to it from anywhere in the running program — reclaim its memory",
             n: "Anything ticked is still reachable and must be kept, even if you have forgotten about it" },
           { s: "Most objects die almost immediately, so collectors check new ones often and old ones rarely", n: "Scanning everything every time would be far too slow." },
           { s: "A reference you forgot about still counts as reachable", n: "A growing list nobody ever clears is a leak, and no collector will save you from it." }] }
},

"Concurrency": {
 ex: { h: "One cook managing four pans",
       b: "Only one pair of hands, but nothing waits idle: stir this while that simmers. Concurrency is about structure — dealing with many things at once — and it is exactly why one thread can serve thousands of network connections that are mostly waiting." },
 fl: { t: "Concurrency or parallelism?",
       s: ["Multiple tasks need to make progress",
           { q: "Are they waiting on I/O, or computing?",
             y: "Waiting — concurrency wins. One thread, an event loop, async/await",
             n: "Computing — you need parallelism and multiple cores" },
           { s: "Concurrency is a structuring approach", n: "Parallelism is simultaneous execution." },
           "Shared mutable state is where both go wrong — races, deadlocks, corruption"] }
},

"Parallelism": {
 ex: { h: "Four cooks, four hobs",
       b: "Genuinely simultaneous, and it requires four hobs — you cannot parallelise beyond your cores. Some jobs also refuse to split: nine women cannot make a baby in one month, and Amdahl's law puts a hard ceiling on what the serial part allows." },
 fl: { t: "Will parallelising help?",
       s: ["A task is slow",
           { q: "Is it CPU-bound?",
             y: "Split it across cores — real speed-up available",
             n: "I/O-bound — use concurrency; more cores will not help" },
           { q: "Can the work be split into independent pieces?",
             y: "Near-linear scaling, up to the number of cores",
             n: "Amdahl's law: the serial fraction caps your speed-up" },
           "Python's GIL means threads do not parallelise CPU work — use processes"] }
},

"Thread": {
 ex: { h: "Two people working from the same desk",
       b: "They share every document, which makes handing things over instant and makes it very easy to both edit the same page at once. That shared memory is the entire performance advantage of threads and the entire source of their bugs." },
 fl: { t: "Where the danger is",
       s: ["Threads share the process's memory",
           { q: "Do two threads write the same variable?",
             y: "A data race — the result depends on timing and is undefined",
             n: "Independent data is safe and fast" },
           { s: "Protect shared state with a mutex", n: "And now you can deadlock." },
           "The safest design is not to share mutable state at all — pass messages"] }
},

"Process": {
 ex: { h: "Two teams in separate offices",
       b: "Neither can touch the other's papers, which makes accidental interference impossible and passing something over deliberate and slower. If one office burns down the other carries on — process isolation is exactly why a browser tab crashing does not take the browser with it." },
 fl: { t: "Process or thread?",
       s: ["You need concurrent execution",
           { q: "Does isolation matter more than communication cost?",
             y: "Processes — a crash or a memory bug cannot spread",
             n: "Threads — shared memory, far cheaper to create and communicate" },
           { s: "Processes need IPC: pipes, sockets, shared memory", n: "Explicit, and therefore safer." },
           "In Python, processes are how you get real CPU parallelism past the GIL"] }
},

"Race Condition": {
 ex: { h: "Two people withdrawing from the same account at once",
       b: "Both read the balance as £100, both subtract £80, both write £20 — and £160 has left an account that held £100. Nothing was buggy in isolation; the interleaving was. Which is why these bugs vanish the moment you add a print statement." },
 fl: { t: "Why two correct pieces of code together are wrong",
       s: [{ s: "Two parts of a program run at the same time and both touch the same value", n: "Neither is wrong on its own. The trouble is entirely in the overlap." },
           { s: "Take something as simple as adding one to a counter. It is really three steps: read it, add one, write it back", n: "That looks like a single action in your code but is not." },
           { s: "Now imagine both parts read the value 5 at the same moment", n: "Both add one and get 6. Both write 6 back." },
           { q: "How many increments happened, and what does the counter say?",
             y: "Two happened, and it says 6. One was silently lost, with no error anywhere",
             n: "Run it again and it might work perfectly — which is what makes these so hard to find" },
           { s: "The fix is to make the whole read-add-write sequence uninterruptible", n: "Either with a lock, so only one part can be in that section at a time, or with a built-in operation that does all three as one." }] }
},

"Mutex": {
 ex: { h: "The key to a single toilet",
       b: "One key, so one person at a time, and everyone else waits. It works perfectly and it creates a queue — which is the cost. Take two keys in different orders and two people can wait for each other forever, which is deadlock." },
 fl: { t: "One key, one person at a time",
       s: [{ s: "You have a piece of code that must never be run by two things at once", n: "Anything that reads a value, changes it and writes it back." },
           { s: "A mutex is a single key for that section, held by one holder at a time", n: "The name is short for *mutual exclusion*, which is just a formal way of saying \"not both at once\"." },
           { q: "You arrive at the section. Is the key available?",
             y: "Take it, run the protected code, then put it back so the next one can proceed",
             n: "Wait until whoever has it puts it back. Doing nothing, until then" },
           { s: "Hold it for as short a time as possible", n: "Everything else that needs it is stopped dead while you have it, so a slow section blocks everyone." },
           { s: "Never do anything slow while holding it — no network calls, no file reading", n: "The classic performance disaster is holding a lock while waiting on something out of your control." },
           { s: "And always put it back, even if your code fails partway", n: "A key never returned means everything waiting for it waits forever. Most languages give you a construct that returns it automatically." }] }
},

"Semaphore": {
 ex: { h: "A car park with a counter on the barrier",
       b: "Twenty spaces, so twenty cars in and the twenty-first waits. A mutex is the special case of exactly one space. It is the natural way to cap concurrent database connections or simultaneous API calls." },
 fl: { t: "Limiting concurrency",
       s: ["Initialise the semaphore with the permitted count",
           { q: "Is a permit available?",
             y: "Take it, decrement the count, and proceed",
             n: "Block until someone releases one" },
           { s: "Always release in a `finally`", n: "A leaked permit shrinks capacity permanently." },
           "A semaphore of 1 is a mutex; larger values are a resource pool"] }
},

"Deadlock": {
 ex: { h: "Two people each holding the other's car keys",
       b: "Neither will hand over until they get theirs, so neither ever moves. Four conditions must all hold for it, and breaking any one prevents it — the easiest in practice being to always acquire locks in the same order." },
 fl: { t: "Preventing it",
       s: ["Thread A holds lock 1 and wants lock 2",
           { s: "Thread B holds lock 2 and wants lock 1", n: "Neither will release what it has." },
           { q: "How do you break the cycle?",
             y: "Always acquire locks in one globally agreed order",
             n: "Or use timeouts and back off, or take all locks at once" },
           "Coffman's four conditions: mutual exclusion, hold-and-wait, no preemption, circular wait"] }
},

"Atomic Operation": {
 ex: { h: "A revolving door with one compartment",
       b: "You are either in or out; there is no observable halfway state. An atomic increment cannot be interrupted between reading and writing, which is why a counter using one needs no lock at all — and why non-atomic `count += 1` from two threads loses updates." },
 fl: { t: "Why `count += 1` is not atomic",
       s: ["The statement compiles to three operations",
           { s: "Read the value, add one, write it back", n: "Three separate steps." },
           { q: "Can another thread run in between?",
             y: "Yes — both read the same value and one increment is lost",
             n: "An atomic instruction performs all three indivisibly" },
           "Compare-and-swap is the primitive most lock-free structures are built on"] }
},

"Asynchronous Programming": {
 ex: { h: "Ordering at a counter and being given a buzzer",
       b: "You do not stand at the till until the food is ready — you sit down and are called back. `await` is the buzzer: this line will resume when the answer arrives, and meanwhile the single thread serves other customers." },
 fl: { t: "What `await` actually does",
       s: ["Code calls an async function and awaits it",
           { s: "The operation is started and the function suspends", n: "It does not block the thread." },
           { q: "What runs while it waits?",
             y: "The event loop picks up other pending work",
             n: "This is how one thread serves thousands of connections" },
           { s: "The result arrives and the function resumes", n: "Exactly where it left off." },
           "One blocking call inside an async function stalls the entire loop"] }
},

"Callback": {
 ex: { h: "Leaving your number with the shop",
       b: "*Ring me when it arrives.* You get on with your day and they call you back. It is the oldest async pattern and it nests badly — a callback inside a callback inside a callback is the pyramid that promises and async/await were invented to flatten." },
 fl: { t: "From callbacks to await",
       s: ["Pass a function to be called when the work completes",
           { q: "Does the callback itself need another async step?",
             y: "It nests — three levels in, error handling becomes unmanageable",
             n: "A single callback is perfectly readable" },
           { s: "Promises flatten nesting into a chain", n: "`then().then().catch()`" },
           "`async`/`await` makes it read like sequential code, which is where it ended up"] }
},

"Promise": {
 ex: { h: "A cloakroom ticket for a coat still being hung",
       b: "The ticket is real and the coat is not ready. You can plan around it — *when I get my coat, I will leave* — and it resolves exactly once, either with a coat or with an apology. That single-resolution guarantee is what makes chaining safe." },
 fl: { t: "The three states",
       s: ["A promise starts pending",
           { q: "Does the operation succeed?",
             y: "Fulfilled — `then` handlers receive the value",
             n: "Rejected — `catch` handlers receive the error" },
           { s: "It settles exactly once and never changes again", n: "Which is why chains are predictable." },
           { s: "An unhandled rejection is a silent bug", n: "Always attach a catch, or await inside a try." },
           "`Promise.all` waits for all; `allSettled` waits without failing fast"] }
},

"Serialisation": {
 ex: { h: "Flat-packing furniture for the post",
       b: "The wardrobe becomes a flat box and an instruction sheet, and is rebuilt at the other end. What cannot be flat-packed — a function, a database connection, an open file — simply does not survive the trip, which is why those fields come back as nothing." },
 fl: { t: "Crossing a boundary",
       s: ["An in-memory object must leave the process",
           { s: "Serialise it to a portable format", n: "JSON for interoperability, protobuf for size and speed." },
           { q: "Does the format support every type you used?",
             y: "Round-trips cleanly",
             n: "Dates become strings, big integers lose precision, functions vanish" },
           { s: "Never deserialise untrusted input with pickle", n: "It can execute arbitrary code." },
           "Version your schema — old and new code will coexist"] }
},

"Unicode": {
 ex: { h: "One numbering scheme for every script on earth",
       b: "Before it, the same byte meant different letters in different countries and email crossing borders turned to mush. Unicode assigns every character a number; UTF-8 decides how those numbers become bytes. Confusing the two is the source of most encoding bugs." },
 fl: { t: "Why string length surprises you",
       s: ["A string contains an emoji or an accented letter",
           { q: "How many bytes is it?",
             y: "UTF-8 uses 1–4 bytes per character — not one",
             n: "How many characters do users think it is?" },
           { s: "A family emoji is several code points joined", n: "Length in code points, in bytes, and in visible characters all differ." },
           { s: "Normalise before comparing", n: "é can be one code point or two — NFC makes them equal." },
           "Validate length in whatever unit your users mean"] }
},

"Floating Point": {
 ex: { h: "A ruler marked in inconveniently spaced increments",
       b: "Some values simply fall between the marks, so you record the nearest one. 0.1 is one of them in binary. The errors are tiny and they accumulate — which is exactly why `0.1 + 0.2 == 0.3` is false and money never lives in a float." },
 fl: { t: "The rules that avoid the pain",
       s: ["A decimal is stored as the nearest representable binary value",
           { q: "Comparing two floats?",
             y: "Compare within a tolerance, never with `==`",
             n: "Accumulating money?" },
           { q: "Handling currency?",
             y: "Use integer pence, or a Decimal type",
             n: "Round only at the point of display" },
           "NaN is not equal to itself — that is by design, and it catches everyone"] }
},

"Integer Overflow": {
 ex: { h: "A milometer rolling past its last digit",
       b: "999999 plus one becomes 000000 and the car appears brand new. In C and Java a 32-bit counter silently wraps to a large negative number, and the bug appears at exactly two billion — long after testing. Python simply grows the integer instead." },
 fl: { t: "Where it bites",
       s: ["A fixed-width integer reaches its maximum",
           { q: "What does the language do?",
             y: "C, Java, Go: it wraps around, silently. Rust panics in debug builds",
             n: "Python grows the integer indefinitely — no overflow" },
           { s: "Classic case: `(low + high) / 2` in binary search", n: "Use `low + (high - low) / 2` instead." },
           "Overflow in a length or index check is a well-trodden route to a security hole"] }
},

"State Machine": {
 ex: { h: "A traffic light",
       b: "Red, red-amber, green, amber — and it can only move between them in a defined order. Modelling an order or a connection this way replaces a tangle of boolean flags with one `state` field, and makes illegal combinations unrepresentable rather than merely unlikely." },
 fl: { t: "Replacing a pile of flags",
       s: ["An object has `is_paid`, `is_shipped`, `is_cancelled`",
           { q: "How many combinations are actually legal?",
             y: "Far fewer than 2³ — most are nonsense like paid and cancelled",
             n: "Model it as one state field with defined transitions" },
           { s: "Define which transitions are permitted", n: "Everything else is rejected at the boundary." },
           "Now the illegal states cannot be represented, not merely avoided"] }
},

"Turing Complete": {
 ex: { h: "A language that can express any computation",
       b: "It needs surprisingly little — conditional branching and unbounded memory. Which is why CSS, spreadsheet formulas, TypeScript's type system and Magic: The Gathering have all been shown to be Turing complete, usually by someone who then implemented a computer in them." },
 fl: { t: "Why you might *not* want it",
       s: ["A system can express arbitrary computation",
           { q: "Is that desirable for a config format?",
             y: "It means you cannot guarantee it terminates or is safe to evaluate",
             n: "Deliberately non-Turing-complete languages can be analysed exhaustively" },
           { s: "The halting problem applies the moment you are complete", n: "No general termination check exists." },
           "Which is why smart-contract and query languages are often restricted on purpose"] }
},

"Halting Problem": {
 ex: { h: "A program that predicts whether programs finish",
       b: "Turing proved no such program can exist, by constructing one that asks the predictor about itself and then does the opposite. It is the reason no compiler can warn you about every infinite loop — not a limitation of current tools, but a proven impossibility." },
 fl: { t: "The contradiction, in three steps",
       s: ["Suppose a perfect halting-checker exists",
           { s: "Build a program that asks the checker about itself", n: "Then does the opposite of the answer." },
           { q: "Does that program halt?",
             y: "The checker said it halts, so it loops forever — contradiction",
             n: "The checker said it loops, so it halts — also a contradiction" },
           "Which is why static analysers are conservative and report *maybe*"] }
},

"Scope": {
 ex: { h: "Who can hear you in an office",
       b: "Speak in the meeting room and only that room hears. Announce over the tannoy and the whole building does. A variable declared inside a function is heard only there, which is what stops two functions using `i` from interfering." },
 fl: { t: "How a name is resolved",
       s: ["Code references a name",
           { s: "Look in the local scope first", n: "The current function." },
           { q: "Not found?",
             y: "Look outward — enclosing functions, then global, then built-ins",
             n: "Use it; the innermost match wins" },
           { s: "Assignment creates a local by default", n: "Which is why Python needs `global` or `nonlocal` to write outward." },
           "A local shadowing an outer name is legal and a frequent source of confusion"] }
},

"Idempotency": {
 ex: { h: "A lift button you can press five times",
       b: "The lift comes once. Contrast with a *submit order* button, where five presses can mean five orders — which is exactly what happens when a user's connection drops and they retry. Idempotency is what makes retrying safe, and retrying is unavoidable on a network." },
 fl: { t: "Making a payment endpoint safe to retry",
       s: ["The client generates a unique idempotency key",
           { s: "It is sent with the request", n: "And reused verbatim on every retry of that same request." },
           { q: "Has the server seen this key before?",
             y: "Return the original stored response — do not charge again",
             n: "Process it, store the result against the key, and return it" },
           { s: "In HTTP: GET, PUT and DELETE are idempotent; POST is not", n: "Which is why POST needs the key." }] }
}

});
