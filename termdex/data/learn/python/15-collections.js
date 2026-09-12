/* Python — collections powertools. */
TD.addLessons("python", [

    {
        t: "Counter, defaultdict and deque",
        m: "collections",
        lvl: "intermediate",
        s: "Three data structures that replace patterns you write by hand every week.",
        goal: [
            "Count things in one line instead of a loop",
            "Build a dictionary of lists without checking for missing keys",
            "Use a deque as a fast queue or a sliding window"
        ],
        b: [
            { p: "The data structures module taught you lists, dictionaries, tuples and sets. That is the foundation, and it covers most situations. The `collections` module in the standard library has specialised versions of dictionaries and lists that turn common three-line patterns into one-liners. You meet three here — Counter, defaultdict and deque — because you will use all three within your first month of real work." },

            { h: "Counter — counting things" },
            { p: "You wrote a counting loop in the data structures lesson: build an empty dict, check if the key exists, increment. `Counter` does the whole thing." },
            {
                code: {
                    lang: "python",
                    lines: [
                        { c: "from collections import Counter", w: "" },
                        { c: "", w: "" },
                        { c: "words = [\"apple\", \"banana\", \"apple\", \"cherry\", \"apple\", \"banana\"]", w: "" },
                        { c: "counts = Counter(words)", w: "**One line. Same result as the loop.**" },
                        { c: "print(counts)", w: "" },
                        { c: "", w: "" },
                        { c: "print(counts[\"apple\"])", w: "Look up a count by key." },
                        { c: "print(counts[\"mango\"])", w: "**A missing key returns 0, not a KeyError.** This is the whole reason Counter exists over a plain dict." },
                        { c: "", w: "" },
                        { c: "print(counts.most_common(2))", w: "**The top N, sorted.** The method you will reach for constantly." }
                    ],
                    out: "Counter({'apple': 3, 'banana': 2, 'cherry': 1})\n3\n0\n[('apple', 3), ('banana', 2)]"
                }
            },

            {
                code: {
                    lang: "python", t: "Counter on text",
                    lines: [
                        { c: "text = \"hello world\"", w: "" },
                        { c: "print(Counter(text))", w: "**Works on any iterable** — strings, files, generators." },
                        { c: "", w: "" },
                        { c: "# Combine two counts", w: "" },
                        { c: "a = Counter([\"x\", \"y\", \"x\"])", w: "" },
                        { c: "b = Counter([\"x\", \"z\"])", w: "" },
                        { c: "print(a + b)", w: "**Add them** — counts merge." },
                        { c: "print(a - b)", w: "**Subtract** — removes, dropping zeros." }
                    ],
                    out: "Counter({'l': 3, 'o': 2, 'h': 1, 'e': 1, ' ': 1, 'w': 1, 'r': 1, 'd': 1})\nCounter({'x': 3, 'y': 1, 'z': 1})\nCounter({'x': 1, 'y': 1})"
                }
            },

            { h: "defaultdict — dictionaries that build themselves" },
            { p: "The pattern: you want a dictionary where values are lists, and you need to append to a key that might not exist yet." },
            {
                vs: {
                    t: "Grouping items by a key", lang: "python",
                    bad: {
                        c: "groups = {}\nfor name, dept in employees:\n    if dept not in groups:\n        groups[dept] = []\n    groups[dept].append(name)", label: "Manual check every time",
                        w: "Three lines of bookkeeping for one line of work. Every loop that builds a dict-of-lists looks like this, and it is tedious every time."
                    },
                    good: {
                        c: "from collections import defaultdict\n\ngroups = defaultdict(list)\nfor name, dept in employees:\n    groups[dept].append(name)", label: "defaultdict(list)",
                        w: "**The first access to a missing key creates a fresh empty list automatically.** No `if`, no `setdefault`. One argument — `list` — tells it what to create."
                    }
                }
            },

            {
                code: {
                    lang: "python", t: "Different defaults",
                    lines: [
                        { c: "counts = defaultdict(int)", w: "**Missing keys start at 0** — because `int()` is `0`. Perfect for counting." },
                        { c: "counts[\"a\"] += 1", w: "" },
                        { c: "counts[\"a\"] += 1", w: "" },
                        { c: "counts[\"b\"] += 1", w: "" },
                        { c: "print(dict(counts))", w: "`dict()` converts it back to a plain dict for clean output." },
                        { c: "", w: "" },
                        { c: "registry = defaultdict(set)", w: "Missing keys start as empty sets." },
                        { c: "registry[\"admin\"].add(\"aryan\")", w: "" },
                        { c: "registry[\"admin\"].add(\"sam\")", w: "" },
                        { c: "registry[\"viewer\"].add(\"aryan\")", w: "" },
                        { c: "print(dict(registry))" }
                    ],
                    out: "{'a': 2, 'b': 1}\n{'admin': {'aryan', 'sam'}, 'viewer': {'aryan'}}"
                }
            },
            { trap: "**Accessing a missing key creates it.** `if key in d:` on a regular dict just checks; on a defaultdict the key would not be created because `in` does not trigger `__missing__`. But `d[key]` on a missing key *does* create an entry. Be aware that iterating with `d[k]` on keys you are only checking can pollute the dict. Use `d.get(k)` or convert to a plain dict first if this matters." },

            { h: "deque — a double-ended queue" },
            { p: "A list is fast at the right end (`append`, `pop`) and slow at the left (`insert(0, ...)`, `pop(0)`) — both are O(n) because every element shifts. A **deque** (pronounced *deck*) is fast at both ends." },
            {
                code: {
                    lang: "python",
                    lines: [
                        { c: "from collections import deque", w: "" },
                        { c: "", w: "" },
                        { c: "q = deque([1, 2, 3])", w: "" },
                        { c: "q.append(4)", w: "Add to the right — same as a list." },
                        { c: "q.appendleft(0)", w: "**Add to the left — O(1).** This is what lists cannot do efficiently." },
                        { c: "print(q)", w: "" },
                        { c: "", w: "" },
                        { c: "print(q.pop())", w: "Remove from the right." },
                        { c: "print(q.popleft())", w: "**Remove from the left — O(1).** This makes it a proper queue." },
                        { c: "print(q)" }
                    ],
                    out: "deque([0, 1, 2, 3, 4])\n4\n0\ndeque([1, 2, 3])"
                }
            },

            { h: "maxlen — a sliding window" },
            {
                code: {
                    lang: "python",
                    lines: [
                        { c: "recent = deque(maxlen=3)", w: "**A bounded deque.** When it is full, adding to one end silently drops from the other." },
                        { c: "", w: "" },
                        { c: "for n in range(6):", w: "" },
                        { c: "    recent.append(n)", w: "" },
                        { c: "    print(list(recent))" }
                    ],
                    out: "[0]\n[0, 1]\n[0, 1, 2]\n[1, 2, 3]\n[2, 3, 4]\n[3, 4, 5]",
                    after: "That is a **sliding window of the last three items**, built with no code at all. This pattern appears in moving averages, recent-log buffers, undo stacks with a size limit, and rate limiters."
                }
            },

            { h: "When to use which" },
            {
                tbl: {
                    h: ["Need", "Use", "Why"],
                    rows: [
                        ["Count occurrences", "**Counter**", "One-liner, `most_common`, missing keys give 0"],
                        ["Group by a key into a list/set", "**defaultdict(list)**", "No key-existence check needed"],
                        ["Running totals by key", "**defaultdict(int)**", "Missing keys start at 0"],
                        ["A queue (FIFO)", "**deque**", "O(1) at both ends, unlike list"],
                        ["A recent-N buffer", "**deque(maxlen=N)**", "Auto-evicts the oldest item"],
                        ["An immutable record", "**namedtuple**", "Lighter than a class, labels on a tuple"]
                    ]
                }
            },

            { h: "namedtuple — labelled tuples" },
            {
                code: {
                    lang: "python",
                    lines: [
                        { c: "from collections import namedtuple", w: "" },
                        { c: "", w: "" },
                        { c: "Point = namedtuple(\"Point\", [\"x\", \"y\"])", w: "**Creates a new type** — a tuple with named fields." },
                        { c: "p = Point(3, 7)", w: "" },
                        { c: "print(p.x, p.y)", w: "**Access by name** — clearer than `p[0]`, `p[1]`." },
                        { c: "print(p)", w: "Readable repr for free." },
                        { c: "", w: "" },
                        { c: "# p.x = 10  # AttributeError — immutable, like all tuples", w: "" }
                    ],
                    out: "3 7\nPoint(x=3, y=7)"
                }
            },
            { p: "`namedtuple` was the go-to before `@dataclass`. Use it when you want something lighter than a class that cannot be changed. For anything mutable or with methods, use a dataclass." },

            {
                tryit: {
                    t: "Analyse a word list",
                    task: "Take any paragraph of text. Split it into words, lowercase them, and use Counter to find the 5 most common words and their counts. Then use defaultdict(list) to group the words by their first letter.",
                    hint: "`text.lower().split()` gives you the word list. `Counter(words).most_common(5)` and a loop with `groups[word[0]].append(word)`.",
                    sol: { lang: "python", code: "from collections import Counter, defaultdict\n\ntext = \"the quick brown fox jumps over the lazy dog the fox the dog\"\nwords = text.lower().split()\n\ncounts = Counter(words)\nprint(\"Top 5:\", counts.most_common(5))\n\ngroups = defaultdict(list)\nfor word in words:\n    groups[word[0]].append(word)\n\nfor letter in sorted(groups):\n    print(f\"{letter}: {groups[letter]}\")" },
                    w: "The grouping loop is exactly the pattern `defaultdict(list)` exists for. Without it, every iteration needs an `if` check or a `setdefault` call."
                }
            }
        ],
        k: [
            "`Counter(iterable)` counts in one line; missing keys return 0; `.most_common(n)` is the killer feature.",
            "`defaultdict(list)` eliminates the key-existence check when building a dict of lists (or sets, or ints).",
            "`deque` is O(1) at both ends; `deque(maxlen=N)` is a sliding window with zero code.",
            "`namedtuple` gives a tuple named fields — lighter than a class, immutable by nature."
        ],
        r: ["Hash Table", "Queue", "Stack", "Time Complexity"],
        drill: {
            lang: "python",
            reps: 3,
            items: [
                { c: "from collections import Counter, defaultdict, deque", w: "import the three most-used collections types" },
                { c: "counts = Counter(words)", w: "count every item in a list in one line" },
                { c: "counts.most_common(5)", w: "get the five most frequent items and their counts" },
                { c: "groups = defaultdict(list)", w: "create a dictionary where missing keys start as empty lists" },
                { c: "q = deque(maxlen=100)", w: "create a bounded queue that holds the last 100 items" },
                { c: "Point = namedtuple(\"Point\", [\"x\", \"y\"])", w: "create an immutable type with named fields" }
            ]
        }
    }

]);
