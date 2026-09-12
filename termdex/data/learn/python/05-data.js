/* Python — holding more than one thing. */
TD.addLessons("python", [

{
 t: "Lists — Holding Many Things",
 m: "data",
 lvl: "core",
 s: "An ordered, changeable collection, and the twelve operations that cover almost everything.",
 goal: [
  "Build a list, reach into it, and change it in place",
  "Add and remove items with the right method for the job",
  "Sort a list without accidentally destroying the original"
 ],
 b: [
  { p: "A variable holds one value. Real programs deal in many — every score in a class, every row in a file, every user in a database. A **list** is Python's default answer, and it is the collection you will use most." },

  { code: { lang: "python", t: "Making one",
    lines: [
     { c: "scores = [72, 91, 65, 88]", w: "**Square brackets, comma separated.** The list keeps the order you wrote — position 0 is 72 and will stay 72 until you change it." },
     { c: "mixed = [1, \"two\", 3.0, True]", w: "Python does not require the items to be the same type. It is legal and it is usually a design smell — a list whose items differ is hard to loop over, because the body has to cope with everything." },
     { c: "empty = []", w: "An empty list. Very common as a starting point when you are about to fill it in a loop." },
     { c: "nested = [[1, 2], [3, 4]]", w: "Lists can hold lists. This is how you represent a grid or a table before you meet pandas." }
    ] } },

  { h: "Reaching in" },
  { code: { lang: "python", t: "Exactly the same indexing and slicing as strings",
    lines: [
     { c: "scores = [72, 91, 65, 88]", w: "" },
     { c: "print(scores[0])", w: "First item. Counting starts at zero." },
     { c: "print(scores[-1])", w: "Last item, without needing to know the length." },
     { c: "print(scores[1:3])", w: "A slice — items 1 and 2, because the end is excluded. **A slice of a list is a new list**, not a view of the old one." },
     { c: "print(len(scores))", w: "How many items. The last valid index is always `len(scores) - 1`." }
    ],
    out: "72\n88\n[91, 65]\n4",
    after: "The consistency is deliberate. Once you know how to index and slice one sequence in Python, you know how to do it for all of them." } },
  { trap: "`IndexError: list index out of range` means you asked for a position that does not exist — nearly always because you wrote `scores[len(scores)]` when you meant `scores[len(scores) - 1]`, or because the list was empty and you assumed it was not. Check with `if scores:` before indexing anything that might be empty." },

  { h: "Lists are mutable" },
  { p: "This is the big difference from strings. A string cannot be changed — every method returns a new one. A list **can**, and most list methods change it in place and return nothing." },
  { code: { lang: "python",
    lines: [
     { c: "scores = [72, 91, 65]", w: "" },
     { c: "scores[0] = 100", w: "Assign straight into a position. The list is modified; no new list is made." },
     { c: "print(scores)" },
     { c: "", w: "" },
     { c: "name = \"Aryan\"", w: "" },
     { c: "name[0] = \"B\"", w: "The same move on a string raises `TypeError: 'str' object does not support item assignment`. Strings are immutable and lists are not — this is the distinction to hold on to." }
    ],
    out: "[100, 91, 65]\nTypeError: 'str' object does not support item assignment" } },

  { h: "Adding and removing" },
  { tbl: { h: ["Call", "Does", "Returns"],
    rows: [
     ["`scores.append(95)`", "Adds one item to the end. **The one you will use most**", "`None`"],
     ["`scores.extend([95, 80])`", "Adds *each item* of another list to the end", "`None`"],
     ["`scores.insert(0, 95)`", "Inserts at a position, shifting everything after it", "`None`"],
     ["`scores.remove(91)`", "Removes the first item *equal to* 91. `ValueError` if absent", "`None`"],
     ["`scores.pop()`", "Removes **and gives you** the last item", "the item"],
     ["`scores.pop(0)`", "Removes and returns the item at a position", "the item"],
     ["`del scores[0]`", "Deletes by position. A statement, not a method", "—"],
     ["`scores.clear()`", "Empties it", "`None`"]
    ] } },

  { trap: "Look at that `Returns` column. Almost every list method returns **`None`**, because it changed the list rather than producing a new one. So `scores = scores.append(95)` sets `scores` to `None` and destroys your data — a genuinely nasty bug, because nothing errors until you use it later. **Call it and do not assign: `scores.append(95)`.** This is the exact opposite of the string rule, and the difference catches everybody." },

  { vs: { t: "The two rules, side by side", lang: "python",
    bad: { c: "scores = scores.append(95)   # scores is now None\nname.strip()                 # result thrown away", label: "Both wrong",
      w: "The first assigns the return value of a mutating method. The second discards the return value of a non-mutating one. Same confusion, opposite directions." },
    good: { c: "scores.append(95)            # list changed in place\nname = name.strip()          # new string kept", label: "Both right",
      w: "**Mutable — call it. Immutable — assign it.** That one line resolves most of the confusion between lists and strings." } } },

  { h: "Sorting" },
  { code: { lang: "python", t: "Two ways, and the difference matters",
    lines: [
     { c: "scores = [72, 91, 65, 88]", w: "" },
     { c: "", w: "" },
     { c: "ordered = sorted(scores)", w: "**`sorted()` is a function that returns a new list.** The original is untouched. Use this when you need both." },
     { c: "print(scores, ordered)" },
     { c: "", w: "" },
     { c: "scores.sort()", w: "**`.sort()` is a method that reorders in place** and returns `None` — the same rule as `append`. The original order is gone permanently." },
     { c: "print(scores)" },
     { c: "", w: "" },
     { c: "scores.sort(reverse=True)", w: "Descending. Works on `sorted()` too." },
     { c: "names.sort(key=len)", w: "**`key` takes a function** applied to each item to decide what to sort *by*. Here: sort names by their length rather than alphabetically. `key=str.lower` gives a case-insensitive sort." }
    ],
    out: "[72, 91, 65, 88] [65, 72, 88, 91]\n[65, 72, 88, 91]" } },

  { h: "The questions you will ask a list" },
  { code: { lang: "python",
    lines: [
     { c: "print(91 in scores)", w: "**Membership.** Reads exactly as English and is the normal way to ask." },
     { c: "print(scores.count(91))", w: "How many times it appears." },
     { c: "print(scores.index(91))", w: "The position of the first match. `ValueError` if it is not there, so check with `in` first." },
     { c: "print(sum(scores), max(scores), min(scores))", w: "Built-in functions, not methods. They work on any collection of numbers." },
     { c: "print(scores.reverse())", w: "Careful — reverses in place and returns `None`. `reversed(scores)` or `scores[::-1]` give you a new one." }
    ] } },

  { tryit: { t: "Build a leaderboard",
    task: "Start with an empty list. Add five scores one at a time. Remove the lowest. Sort what remains highest first, and print each with its rank.",
    hint: "`append` five times, `remove(min(scores))` for the lowest, `sort(reverse=True)`, then `enumerate(..., start=1)`.",
    sol: { lang: "python", code: "scores = []\nfor s in [72, 91, 65, 88, 79]:\n    scores.append(s)\n\nscores.remove(min(scores))\nscores.sort(reverse=True)\n\nfor rank, score in enumerate(scores, start=1):\n    print(f\"{rank}. {score}\")" },
    w: "`remove(min(scores))` reads as one thought: *remove the smallest*. Python's built-ins compose like that constantly, and noticing it is what makes code short." } }
 ],
 k: [
  "A list is ordered and mutable, written with square brackets, indexed from zero.",
  "Mutating methods return `None` — call them, never assign them. `scores = scores.append(x)` destroys your data.",
  "`sorted(x)` returns a new list; `x.sort()` reorders in place and returns nothing.",
  "`key=` lets you sort by anything: length, lowercase, a field inside each item."
 ],
 r: ["Array", "Array vs Linked List", "Immutability", "Sorting Algorithm", "Zero-Based Indexing"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "scores = [72, 91, 65, 88]", w: "create a list of four numbers" },
   { c: "scores.append(95)", w: "add one item to the end of a list", hint: "do not assign the result" },
   { c: "scores.sort(reverse=True)", w: "reorder a list in place, highest first" },
   { c: "ordered = sorted(scores)", w: "make a new sorted list, leaving the original alone" },
   { c: "names.sort(key=len)", w: "sort names by their length rather than alphabetically" },
   { c: "if 91 in scores:", w: "test whether a value is present in a list" }
  ]
 }
},

{
 t: "Dictionaries — Looking Things Up By Name",
 m: "data",
 lvl: "core",
 s: "The most useful structure in Python, and the shape almost all real data arrives in.",
 goal: [
  "Store and retrieve values by a meaningful name instead of a position",
  "Handle a missing key without crashing",
  "Loop over keys, values, or both at once"
 ],
 b: [
  { p: "A list answers *what is at position 2*. That is only useful when position means something. A **dictionary** answers *what is the value for `\"name\"`* — and that is how almost all real data is shaped." },
  { p: "Every JSON response from an API, every row from a database, every configuration file: dictionaries. If you learn one collection properly, learn this one." },

  { code: { lang: "python", t: "Making one",
    lines: [
     { c: "user = {\"name\": \"Aryan\", \"age\": 30, \"city\": \"Mumbai\"}", w: "**Curly braces, and each entry is `key: value`.** The key is what you look things up by; the value is what you get back. Compare this to `[\"Aryan\", 30, \"Mumbai\"]` — where you would have to remember that position 1 means age." },
     { c: "empty = {}", w: "An empty dictionary. Note that `{}` is a dict, not a set — an empty set needs `set()`." },
     { c: "print(user[\"name\"])", w: "**Square brackets again**, but with a key inside rather than a number. The syntax is shared; the meaning is *look this up*." }
    ],
    out: "Aryan" } },

  { ana: "It is an actual dictionary. You do not read a dictionary from the front counting words — you look up the word you want and read its definition. The key is the word, the value is the definition, and finding it takes the same amount of time whether the book has ten entries or ten million.",
    at: "Why it has that name" },

  { h: "Keys have rules; values do not" },
  { l: [
   "**Keys must be unique.** Assign the same key twice and the second silently wins — no error.",
   "**Keys must be immutable** — strings, numbers and tuples work; a list cannot be a key. This is because the dictionary hashes the key to find it instantly, and a key that could change afterwards would become unfindable.",
   "**Values can be anything**, including lists and other dictionaries. Nested dictionaries are how JSON is represented.",
   "**Order is preserved** since Python 3.7 — items come back in the order you inserted them. Do not lean on it heavily, but it is guaranteed."
  ] },

  { h: "Changing it" },
  { code: { lang: "python",
    lines: [
     { c: "user[\"age\"] = 31", w: "The key exists, so this **updates** it." },
     { c: "user[\"email\"] = \"a@example.com\"", w: "The key does not exist, so this **creates** it. Same syntax for both — there is no separate *add* operation." },
     { c: "del user[\"city\"]", w: "Remove an entry entirely." },
     { c: "user.update({\"age\": 32, \"country\": \"India\"})", w: "Several at once: updates what exists, adds what does not." }
    ] } },

  { h: "The missing key problem" },
  { code: { lang: "python", t: "This is the error you will hit most with dictionaries",
    lines: [
     { c: "print(user[\"phone\"])", w: "`KeyError: 'phone'`. Square brackets on an absent key **crashes**. Unlike a list, there is no *close enough*." }
    ],
    out: "KeyError: 'phone'" } },
  { code: { lang: "python", t: "Three ways to cope, in order of usefulness",
    lines: [
     { c: "print(user.get(\"phone\"))", w: "**`.get()` returns `None` instead of raising.** This is the everyday answer and you will use it constantly." },
     { c: "print(user.get(\"phone\", \"unknown\"))", w: "A second argument is the fallback, so you can supply a sensible default rather than `None`." },
     { c: "", w: "" },
     { c: "if \"phone\" in user:", w: "**`in` checks keys**, not values. Use it when you want to branch on presence rather than substitute a default." },
     { c: "    print(user[\"phone\"])" },
     { c: "", w: "" },
     { c: "user.setdefault(\"tags\", []).append(\"new\")", w: "*Give me the value; if there is no key, create it with this default first.* The idiom for building a dictionary of lists as you go." }
    ],
    out: "None\nunknown" } },
  { n: "`.get()` versus `[]` is a real design decision, not a style preference. Use `[]` when a missing key means your data is broken and you *want* the crash — better a loud failure than a silent wrong answer. Use `.get()` when absence is a legitimate possibility. Choosing deliberately is a mark of someone who has debugged a few of these.",
    nt: "When you want it to crash" },

  { h: "Looping" },
  { code: { lang: "python", t: "Three ways, and only one of them is usually right",
    lines: [
     { c: "for key in user:", w: "**Looping a dictionary gives you its keys.** Not the values, not pairs — the keys. This surprises people once." },
     { c: "    print(key)" },
     { c: "", w: "" },
     { c: "for value in user.values():", w: "Just the values, when the keys are irrelevant." },
     { c: "    print(value)" },
     { c: "", w: "" },
     { c: "for key, value in user.items():", w: "**`.items()` gives you both**, unpacked into two variables — the same unpacking as `enumerate`. This is the one you want almost every time." },
     { c: "    print(f\"{key}: {value}\")" }
    ],
    out: "name\nage\nAryan\n30\nname: Aryan\nage: 30" } },

  { h: "Counting things — the classic use" },
  { code: { lang: "python", file: "count.py", t: "The pattern you will write a hundred times",
    lines: [
     { c: "words = [\"apple\", \"banana\", \"apple\", \"cherry\", \"apple\"]", w: "" },
     { c: "counts = {}", w: "Start empty." },
     { c: "", w: "" },
     { c: "for word in words:", w: "" },
     { c: "    counts[word] = counts.get(word, 0) + 1", w: "**The whole trick in one line.** Get the current count, defaulting to 0 if this is the first time, add one, store it back. No `if` needed.", hi: true },
     { c: "", w: "" },
     { c: "print(counts)" }
    ],
    out: "{'apple': 3, 'banana': 1, 'cherry': 1}",
    after: "Python has `collections.Counter` which does exactly this in one call — `Counter(words)`. Write the loop by hand once so you understand it, then use `Counter` forever after." } },

  { h: "Nesting, which is what JSON looks like" },
  { code: { lang: "python",
    lines: [
     { c: "data = {", w: "" },
     { c: "    \"user\": {", w: "A dictionary as a value. This is exactly the shape an API returns." },
     { c: "        \"name\": \"Aryan\"," },
     { c: "        \"scores\": [91, 78, 85]", w: "And a list as a value, nested inside that." },
     { c: "    }" },
     { c: "}" },
     { c: "", w: "" },
     { c: "print(data[\"user\"][\"scores\"][0])", w: "**Read the lookups left to right**: `data`, then inside it `user`, then inside that `scores`, then position 0 of that list. Each bracket steps one level in." }
    ],
    out: "91" } },

  { tryit: { t: "Invert a dictionary",
    task: "Given `{\"a\": 1, \"b\": 2, \"c\": 3}`, build a new dictionary with the values as keys and the keys as values.",
    hint: "Loop with `.items()` and assign into a new dictionary the other way round.",
    sol: { lang: "python", code: "original = {\"a\": 1, \"b\": 2, \"c\": 3}\nflipped = {}\n\nfor key, value in original.items():\n    flipped[value] = key\n\nprint(flipped)\n# {1: 'a', 2: 'b', 3: 'c'}" },
    w: "Worth noticing: if two keys shared a value, the flip would silently lose one, because dictionary keys must be unique. Inverting is only safe when the values already are." } }
 ],
 k: [
  "A dictionary maps keys to values with `{\"key\": value}` and looks up in constant time.",
  "`user[\"missing\"]` raises `KeyError`; `user.get(\"missing\", default)` does not.",
  "Looping a dictionary gives keys — use `.items()` when you want both.",
  "`counts[k] = counts.get(k, 0) + 1` is the counting idiom, and `Counter` does it for you."
 ],
 r: ["Dictionary", "Hash Table", "JSON", "Key-Value Pair"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "user = {\"name\": \"Aryan\", \"age\": 30}", w: "create a dictionary with two entries" },
   { c: "print(user.get(\"phone\", \"unknown\"))", w: "look up a key that may not exist, with a fallback" },
   { c: "for key, value in user.items():", w: "loop over a dictionary getting both key and value" },
   { c: "counts[word] = counts.get(word, 0) + 1", w: "the one-line counting idiom" },
   { c: "user.setdefault(\"tags\", []).append(\"new\")", w: "append to a list stored under a key, creating it if absent" }
  ]
 }
},

{
 t: "Tuples and Sets",
 m: "data",
 lvl: "core",
 s: "The two collections people skip — and each one solves a problem elegantly.",
 goal: [
  "Say when a tuple is a better choice than a list",
  "Use a set to deduplicate and to test membership fast",
  "Recognise tuple unpacking, which you have already been using"
 ],
 b: [
  { p: "Python has four built-in collections. You will use lists and dictionaries daily; these two show up less often but each is clearly the right answer to a particular question." },

  { h: "Tuples — a list that cannot change" },
  { code: { lang: "python",
    lines: [
     { c: "point = (3, 4)", w: "**Round brackets.** Otherwise it looks and indexes exactly like a list." },
     { c: "print(point[0])", w: "Same indexing, same slicing, same `len`, same `in`." },
     { c: "point[0] = 5", w: "**And this fails.** A tuple is immutable — once made, it cannot be changed, exactly like a string." }
    ],
    out: "3\nTypeError: 'tuple' object does not support item assignment" } },
  { p: "The obvious question is why you would want a collection you cannot change. Three real reasons." },
  { ol: [
   "**It signals intent.** A tuple says *these belong together and this will not change* — coordinates, an RGB colour, a database row. A reader learns something from the brackets alone.",
   "**It can be a dictionary key.** Lists cannot, tuples can. `{(0, 0): \"origin\"}` is legal, which makes tuples the way to key a grid or a pair.",
   "**It protects you.** A value handed to a function as a tuple cannot be modified by that function by accident."
  ] },

  { code: { lang: "python", t: "You have been using tuples since the variables lesson",
    lines: [
     { c: "x, y = 10, 20", w: "The right side `10, 20` **is a tuple** — the brackets are optional. Then it is unpacked into two names." },
     { c: "x, y = y, x", w: "The swap builds a tuple `(20, 10)` and unpacks it. That is why it works in one line." },
     { c: "", w: "" },
     { c: "def min_max(values):", w: "" },
     { c: "    return min(values), max(values)", w: "**Returning two values** really means returning one tuple. This is how a Python function gives back more than one thing." },
     { c: "", w: "" },
     { c: "low, high = min_max([3, 9, 1])", w: "And the caller unpacks it straight into two names. Neat, and completely standard." }
    ] } },
  { trap: "A one-item tuple needs a trailing comma: `(5,)` is a tuple, `(5)` is just the number 5 with pointless brackets. It looks like a typo and it is the syntax. Python needs the comma because brackets alone already mean grouping." },

  { h: "Sets — unique things, no order" },
  { code: { lang: "python",
    lines: [
     { c: "tags = {\"python\", \"data\", \"python\"}", w: "**Curly braces, but no colons** — that is what makes it a set rather than a dictionary. The duplicate is dropped silently on creation." },
     { c: "print(tags)", w: "Two items. Order is not guaranteed and may differ between runs." },
     { c: "", w: "" },
     { c: "empty = set()", w: "**`{}` is an empty dictionary**, so an empty set needs the function. A genuine wart in the language." },
     { c: "", w: "" },
     { c: "tags.add(\"ml\")", w: "Add one. Adding something already present does nothing and does not error." },
     { c: "tags.discard(\"data\")", w: "Remove if present. `.remove()` does the same but raises `KeyError` when absent." }
    ],
    out: "{'python', 'data'}" } },

  { p: "Sets are for two jobs, and both are worth knowing." },
  { code: { lang: "python", t: "Job one: remove duplicates",
    lines: [
     { c: "emails = [\"a@x.com\", \"b@x.com\", \"a@x.com\"]", w: "" },
     { c: "unique = list(set(emails))", w: "**Into a set to deduplicate, back to a list to restore ordering behaviour.** The single most common use of sets there is." },
     { c: "print(len(unique))" }
    ],
    out: "2",
    after: "This loses the original order. When order matters, use `list(dict.fromkeys(emails))` — dictionary keys are unique *and* ordered, so it deduplicates while preserving first appearance." } },

  { code: { lang: "python", t: "Job two: membership testing at scale",
    lines: [
     { c: "banned = {\"spam@x.com\", \"bot@y.com\"}", w: "A set." },
     { c: "if email in banned:", w: "**Checking membership in a set is instant** regardless of size, because it hashes rather than searches. In a *list*, `in` walks every item one at a time." },
     { c: "    reject()" }
    ],
    after: "With ten items the difference is invisible. With a million, a list check is roughly a million times slower — and this is a genuine, frequent cause of slow programs. If you are repeatedly asking *is this in that*, and *that* does not need order, make it a set." } },

  { h: "Set arithmetic" },
  { code: { lang: "python", t: "Comparing two groups, without any loops",
    lines: [
     { c: "a = {1, 2, 3}", w: "" },
     { c: "b = {3, 4, 5}", w: "" },
     { c: "print(a | b)", w: "**Union** — in either. Also written `a.union(b)`." },
     { c: "print(a & b)", w: "**Intersection** — in both. *Which users are in both segments?*" },
     { c: "print(a - b)", w: "**Difference** — in `a` but not `b`. *Which records did we lose?*" },
     { c: "print(a ^ b)", w: "**Symmetric difference** — in one but not both. *What changed between these two files?*" }
    ],
    out: "{1, 2, 3, 4, 5}\n{3}\n{1, 2}\n{1, 2, 4, 5}",
    after: "These four operators replace a surprising amount of loop-and-compare code, and they are far faster than writing it by hand." } },

  { tbl: { t: "Choosing between the four",
    h: ["", "Ordered", "Changeable", "Duplicates", "Reach for it when"],
    rows: [
     ["**list**", "Yes", "Yes", "Yes", "The default. Order matters and you will change it"],
     ["**tuple**", "Yes", "No", "Yes", "A fixed group that belongs together, or a dictionary key"],
     ["**dict**", "Yes*", "Yes", "Keys unique", "You look things up by name"],
     ["**set**", "No", "Yes", "No", "Uniqueness, or fast membership tests"]
    ] } },

  { tryit: { t: "Compare two lists",
    task: "You have yesterday's user IDs and today's. Print how many are new, how many left, and how many stayed — without writing a loop.",
    hint: "Convert both to sets. Today minus yesterday is new; yesterday minus today is gone; the intersection stayed.",
    sol: { lang: "python", code: "yesterday = {1, 2, 3, 4}\ntoday = {3, 4, 5, 6}\n\nprint(f\"New:     {len(today - yesterday)}\")\nprint(f\"Left:    {len(yesterday - today)}\")\nprint(f\"Stayed:  {len(today & yesterday)}\")" },
    w: "Three lines instead of three loops, and each reads as the question it answers. That is what picking the right collection buys you." } }
 ],
 k: [
  "A tuple is an immutable list — use it for fixed groups, and it is the only collection that can be a dictionary key.",
  "Returning two values from a function really means returning one tuple, which the caller unpacks.",
  "A set holds unique items with no order; `list(set(x))` deduplicates.",
  "`in` on a set is instant; `in` on a list walks every item. That difference matters at scale."
 ],
 r: ["Set", "Hash Table", "Immutability", "Time Complexity"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "point = (3, 4)", w: "create a two-item tuple" },
   { c: "low, high = min_max(values)", w: "unpack two returned values into two names" },
   { c: "unique = list(set(emails))", w: "remove duplicates from a list" },
   { c: "if email in banned:", w: "test membership against a set" },
   { c: "print(a & b)", w: "find the items present in both sets" },
   { c: "print(a - b)", w: "find the items in the first set but not the second" }
  ]
 }
},

{
 t: "Comprehensions",
 m: "data",
 lvl: "intermediate",
 s: "Building a new collection from an old one in a single line — the most Pythonic thing there is.",
 goal: [
  "Rewrite a build-a-list loop as a comprehension",
  "Add a filter, and know where the condition goes",
  "Recognise when a comprehension has gone too far"
 ],
 b: [
  { p: "You will constantly write the same four-line loop: make an empty list, loop over something, transform each item, append it. Python has syntax that says exactly that in one line, and it is used so heavily that unfamiliarity with it makes real code unreadable." },

  { vs: { t: "The same thing, twice", lang: "python",
    bad: { c: "squares = []\nfor n in range(5):\n    squares.append(n ** 2)", label: "The loop",
      w: "Perfectly clear. Four lines, and three of them are ceremony — the empty list, the append, the loop header." },
    good: { c: "squares = [n ** 2 for n in range(5)]", label: "The comprehension",
      w: "One line, and it reads as a description of the result rather than instructions for building it." } } },

  { syn: { t: "Taking it apart",
    parts: [
     { p: "[", w: "**Square brackets mean a list comes out.** Change these to `{ }` and you get a set; add a `key: value` and you get a dictionary." },
     { p: "n ** 2", w: "**The expression** — what to put in the new list for each item. Written *first*, which is the part that feels backwards until it does not. Read it as *give me n squared...*" },
     { p: " for n in ", w: "**The source loop**, exactly the header of a normal `for` loop, minus the colon. *...for every n in...*" },
     { p: "range(5)", w: "**Where the items come from.** Any iterable — a list, a string, a dictionary, a file." },
     { p: "]" }
    ],
    after: "Read it right to left when writing and left to right when reading: **the loop supplies items, the expression transforms them, the brackets decide the container.**" } },

  { h: "Adding a filter" },
  { code: { lang: "python",
    lines: [
     { c: "evens = [n for n in range(10) if n % 2 == 0]", w: "**The `if` goes at the end** and decides whether each item is included at all. Read: *give me n, for every n in range 10, if n is even*." },
     { c: "print(evens)" },
     { c: "", w: "" },
     { c: "labels = [n if n % 2 == 0 else -n for n in range(5)]", w: "**A different `if` entirely.** This one is the one-line conditional from the flow lesson, sitting inside the *expression*, so it appears **before** the `for`. Filtering goes after; choosing a value goes before." },
     { c: "print(labels)" }
    ],
    out: "[0, 2, 4, 6, 8]\n[0, -1, 2, -3, 4]",
    after: "That is the one genuinely confusing thing here: an `if` before the `for` picks between two values, and an `if` after the `for` decides whether to include the item at all. They are different constructs that happen to share a keyword." } },

  { h: "The other three kinds" },
  { code: { lang: "python",
    lines: [
     { c: "unique_lengths = {len(w) for w in words}", w: "**A set comprehension** — curly braces, so duplicates collapse automatically." },
     { c: "", w: "" },
     { c: "lengths = {w: len(w) for w in words}", w: "**A dictionary comprehension** — curly braces with `key: value`. Enormously useful for building lookup tables." },
     { c: "", w: "" },
     { c: "total = sum(n ** 2 for n in range(1000))", w: "**A generator expression** — round brackets, or none at all when it is the only argument. It produces values one at a time instead of building a list, so it uses almost no memory. Prefer this whenever you are feeding straight into `sum`, `max`, `any` or `all`." }
    ] } },

  { h: "Two loops" },
  { code: { lang: "python",
    lines: [
     { c: "pairs = [(x, y) for x in [1, 2] for y in [\"a\", \"b\"]]", w: "**The loops read left to right in exactly the order you would nest them** — `x` is the outer, `y` the inner. This is the one place the ordering is not reversed, which is why it is worth stating." },
     { c: "print(pairs)" },
     { c: "", w: "" },
     { c: "grid = [[1, 2], [3, 4]]", w: "" },
     { c: "flat = [n for row in grid for n in row]", w: "**Flattening a nested list.** Outer loop over rows, inner over the numbers in each. This exact line is worth memorising — you will need it." }
    ],
    out: "[(1, 'a'), (1, 'b'), (2, 'a'), (2, 'b')]\n[1, 2, 3, 4]" } },

  { h: "When to stop" },
  { trap: "A comprehension is for a **simple transform, optionally filtered**. The moment it needs two conditions, a nested comprehension and a ternary, it has become worse than the loop it replaced. The test is honest and simple: if you cannot read it aloud as one sentence, write the loop. Nobody has ever been criticised for a readable four-line loop." },
  { vs: { t: "Past the line", lang: "python",
    bad: { c: "r = [f(x) if g(x) else h(x)\n     for sub in data\n     for x in sub\n     if x is not None and x.ok]", label: "Too clever",
      w: "Two loops, a filter with two clauses and a ternary. It works. Nobody can read it, including you in a month." },
    good: { c: "r = []\nfor sub in data:\n    for x in sub:\n        if x is None or not x.ok:\n            continue\n        r.append(f(x) if g(x) else h(x))", label: "Boring and better",
      w: "Longer, and every line does one thing. This is the version you can debug at 3am." } } },

  { n: "Comprehensions are also genuinely faster than the equivalent loop — the list is sized ahead and the appending happens in C rather than through the interpreter. Not a reason to use them, but a nice consequence of the readable choice being the fast one, which happens more often in Python than people expect.",
    nt: "They are faster too" },

  { tryit: { t: "Three in a row",
    task: "From `words = [\"apple\", \"fig\", \"banana\", \"kiwi\"]`, build: a list of their lengths; a list of only the words longer than four letters, uppercased; and a dictionary mapping each word to its length.",
    hint: "Three comprehensions. The second needs both a transform and a filter — remember the filter goes at the end.",
    sol: { lang: "python", code: "words = [\"apple\", \"fig\", \"banana\", \"kiwi\"]\n\nlengths = [len(w) for w in words]\nlong_upper = [w.upper() for w in words if len(w) > 4]\nlookup = {w: len(w) for w in words}\n\nprint(lengths)      # [5, 3, 6, 4]\nprint(long_upper)   # ['APPLE', 'BANANA']\nprint(lookup)       # {'apple': 5, 'fig': 3, 'banana': 6, 'kiwi': 4}" },
    w: "Notice the second one does the transform on the way out and the filter on the way in — `w.upper()` runs only for words that survived `len(w) > 4`." } }
 ],
 k: [
  "`[expr for item in source]` builds a list; `{ }` builds a set or dict; `( )` builds a lazy generator.",
  "A filtering `if` goes after the `for`; a value-choosing `if/else` goes before it.",
  "Multiple `for` clauses read left to right, outermost first.",
  "If you cannot read it aloud as one sentence, write the loop instead."
 ],
 r: ["List Comprehension", "Iteration", "Iterator", "Lazy Loading"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "squares = [n ** 2 for n in range(5)]", w: "build a list of the first five squares in one line" },
   { c: "evens = [n for n in range(10) if n % 2 == 0]", w: "build a list of only the even numbers below ten" },
   { c: "lookup = {w: len(w) for w in words}", w: "build a dictionary mapping each word to its length" },
   { c: "flat = [n for row in grid for n in row]", w: "flatten a list of lists into one flat list" },
   { c: "total = sum(n ** 2 for n in range(1000))", w: "sum a million squares without building a list", hint: "no brackets needed inside sum" }
  ]
 }
},

{
 t: "The Mutability Trap",
 m: "data",
 lvl: "intermediate",
 s: "Why changing one list changed another one — the bug that makes people distrust Python.",
 goal: [
  "Explain why two names can refer to the same list",
  "Copy a list properly, including one containing lists",
  "Avoid the mutable default argument, permanently"
 ],
 b: [
  { p: "This lesson exists because of a specific bug that every Python programmer hits, usually alone, usually for an hour. Understanding it takes ten minutes and it never happens to you again." },

  { code: { lang: "python", t: "Read this and predict the output before scrolling",
    lines: [
     { c: "a = [1, 2, 3]", w: "" },
     { c: "b = a", w: "" },
     { c: "b.append(4)", w: "" },
     { c: "print(a)", w: "Most people say `[1, 2, 3]`. It is not." }
    ],
    out: "[1, 2, 3, 4]" } },
  { p: "`a` changed, and you never touched `a`. Nothing is broken — this is exactly what the language promised in the very first lesson, and the label picture explains it completely." },

  { ana: "`a = [1, 2, 3]` creates one list and sticks the label `a` on it. `b = a` does **not** copy the list — it sticks a second label on the *same* list. Now `b.append(4)` modifies the one object both labels point at. There was only ever one list. This is why the box picture fails and the label picture does not.",
    at: "Two labels, one object" },

  { code: { lang: "python", t: "Prove it with `is`",
    lines: [
     { c: "a = [1, 2, 3]", w: "" },
     { c: "b = a", w: "" },
     { c: "c = [1, 2, 3]", w: "A separate list that happens to contain the same values." },
     { c: "", w: "" },
     { c: "print(a == b, a == c)", w: "**`==` asks *do they contain the same things*.** Both are true." },
     { c: "print(a is b, a is c)", w: "**`is` asks *are they literally the same object*.** Only the first is. This is the distinction the `None` lesson introduced, and here is where it earns its keep." },
     { c: "print(id(a), id(b), id(c))", w: "`id()` shows the identity Python uses. The first two match." }
    ],
    out: "True True\nTrue False" } },

  { h: "Why numbers and strings never do this" },
  { p: "The same thing happens with numbers — but numbers are immutable, so nothing can modify them in place. `b = a; b += 1` cannot change what `a` refers to, because `+= 1` on a number *makes a new number* and moves only `b`'s label." },
  { p: "So the rule is: **aliasing only bites with mutable things** — lists, dictionaries, sets, and objects you define yourself. Strings, numbers and tuples are safe by construction." },

  { h: "Copying, properly" },
  { code: { lang: "python", t: "Three ways to make a genuinely separate list",
    lines: [
     { c: "b = a.copy()", w: "**The clearest.** A new list with the same items." },
     { c: "b = a[:]", w: "A full slice, which produces a new list. Older idiom, still very common in code you will read." },
     { c: "b = list(a)", w: "Same effect, useful when `a` is any iterable rather than specifically a list." }
    ],
    after: "All three make a **shallow** copy: a new outer list, containing the same inner objects. That distinction is the second half of this lesson." } },

  { code: { lang: "python", t: "Where a shallow copy is not enough",
    lines: [
     { c: "grid = [[1, 2], [3, 4]]", w: "A list whose items are themselves lists." },
     { c: "copy = grid.copy()", w: "A new outer list — but its two items are **the same two inner lists**. It copied the labels, not the objects they point at." },
     { c: "", w: "" },
     { c: "copy[0].append(99)", w: "Reaching into an inner list and modifying it..." },
     { c: "print(grid)", w: "...changes the original too, because that inner list was never copied.", hi: true },
     { c: "", w: "" },
     { c: "import copy as copy_module", w: "" },
     { c: "deep = copy_module.deepcopy(grid)", w: "**`deepcopy` copies all the way down**, recursively. Now nothing is shared at any level. It is slower, so use it only when you have nesting and genuinely need independence." }
    ],
    out: "[[1, 2, 99], [3, 4]]" } },

  { h: "The mutable default argument" },
  { p: "This is the famous one, and it looks so reasonable that it is worth seeing in full." },
  { code: { lang: "python", t: "A function that gets worse every time you call it",
    lines: [
     { c: "def add_item(item, basket=[]):", w: "*If no basket is given, start with an empty one.* That is the intent, and it is wrong." },
     { c: "    basket.append(item)" },
     { c: "    return basket" },
     { c: "", w: "" },
     { c: "print(add_item(\"apple\"))", w: "As expected." },
     { c: "print(add_item(\"banana\"))", w: "**The apple is still there.**", hi: true }
    ],
    out: "['apple']\n['apple', 'banana']" } },
  { p: "The cause is the execution model from the very first Python module. **Default values are evaluated once, when the `def` line runs** — not on each call. So `[]` creates exactly one list, at definition time, and every call that omits the argument shares it. It fills up forever." },

  { vs: { t: "The fix, which is always the same shape", lang: "python",
    bad: { c: "def add_item(item, basket=[]):\n    basket.append(item)\n    return basket", label: "Never do this",
      w: "One list, created once, shared by every call. Applies to `{}` and `set()` identically." },
    good: { c: "def add_item(item, basket=None):\n    if basket is None:\n        basket = []\n    basket.append(item)\n    return basket", label: "The standard pattern",
      w: "`None` is immutable and safe as a default. The real empty list is created **inside** the function, so every call that needs one gets a fresh one." } } },
  { n: "**Never use a mutable value as a default argument.** Lists, dictionaries and sets are out. Use `None` and build the real default inside. Every linter you will ever run flags this, and now you know why it is not being fussy.",
    nt: "The rule, stated plainly" },

  { tryit: { t: "Predict all four",
    task: "Say what each prints:\n1. `a=[1,2]; b=a; b[0]=9; print(a)`\n2. `a=[1,2]; b=a.copy(); b[0]=9; print(a)`\n3. `a=[[1],[2]]; b=a.copy(); b[0][0]=9; print(a)`\n4. `a=\"hi\"; b=a; b+=\"!\"; print(a)`",
    hint: "Two of these change `a` and two do not. Ask each time: is there one object or two, and is it mutable?",
    sol: { lang: "python", code: "# 1. [9, 2]     — same object, two labels\n# 2. [1, 2]     — copy made a genuinely separate outer list\n# 3. [[9], [2]] — shallow copy shares the inner lists\n# 4. hi         — strings are immutable, += made a new one" },
    w: "Number three is the one that catches experienced people. A copy is only as deep as you asked for." } }
 ],
 k: [
  "`b = a` creates a second label on the same object, not a copy.",
  "`==` compares contents; `is` compares identity. Aliasing bugs only show up under `is`.",
  "`a.copy()` is shallow — inner lists are still shared. Use `deepcopy` for nested structures.",
  "Never use `[]`, `{}` or `set()` as a default argument; use `None` and build it inside."
 ],
 r: ["Pass by Value vs Reference", "Immutability", "Garbage Collection", "Memory Management"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "b = a.copy()", w: "make a genuinely separate copy of a list" },
   { c: "print(a is b)", w: "test whether two names refer to the same object" },
   { c: "deep = copy.deepcopy(grid)", w: "copy a nested structure all the way down" },
   { c: "def add_item(item, basket=None):", w: "the safe way to declare a function with a collection default", hint: "not an empty list" },
   { c: "if basket is None:\n    basket = []", w: "build the real default inside the function body", hint: "two lines" }
  ]
 }
}

]);
