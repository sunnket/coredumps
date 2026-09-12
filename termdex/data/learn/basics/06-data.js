/* Programming Basics — structuring data. */
TD.addLessons("basics", [

{
 t: "Lists and Arrays: Order and Position",
 m: "data",
 lvl: "core",
 s: "The first container, what it is fast at, what it is slow at, and why the difference exists.",
 goal: [
  "Index and slice a list confidently",
  "Say why appending is cheap and inserting at the front is not",
  "Replace a loop-and-append with a comprehension where it reads better"
 ],
 b: [
  { p: "A variable holds one thing. That is enough for arithmetic and useless for anything real — you have a hundred orders, ten thousand rows, a folder of files. A **collection** holds many things under one name, and the list is the one you will reach for most." },

  { dg: "data-shapes" },

  { h: "What a list is" },
  { p: "A **list** (Python, JS `Array`, Java `ArrayList`, Go slice, C# `List`) is an ordered sequence of values, each at a numbered position. Order is preserved, duplicates are allowed, and you get at things by their index." },

  { code: { lang: "python", t: "The operations you will use daily",
    lines: [
     { c: "names = [\"ana\", \"raj\", \"sam\"]", w: "Created with square brackets. In most languages a list can hold mixed types; in Java, Go, Rust and C# it is typed and holds one kind only." },
     { c: "", w: "" },
     { c: "names[0]", w: "\"ana\" — the first. Indexes start at zero because an index is a distance from the start." },
     { c: "names[-1]", w: "\"sam\" — the last. Python and Ruby only; elsewhere it is `names[len(names) - 1]`." },
     { c: "len(names)", w: "3. `.length` in JS and Java, `len()` in Python and Go." },
     { c: "", w: "" },
     { c: "names.append(\"kai\")", w: "Add to the end. `push` in JavaScript, `add` in Java, `append` in Go." },
     { c: "names.insert(0, \"zoe\")", w: "Add at a position, shuffling everything after it along. Legal, and quietly expensive — see below." },
     { c: "names.remove(\"raj\")", w: "Remove the first match. Errors if it is not there." },
     { c: "names.pop()", w: "Remove **and return** the last item. `pop(0)` takes from the front." },
     { c: "", w: "" },
     { c: "\"ana\" in names", w: "True/False. Readable — and a full scan, which matters inside a loop." },
     { c: "names.sort()", w: "Sorts **in place**, changing the list and returning `None`. `sorted(names)` returns a new list instead. Confusing these two is a very common bug." }
    ] } },

  { h: "Slicing: taking a piece" },

  { syn: { t: "A slice, part by part",
    parts: [
     { p: "items" },
     { p: "[", w: "Slicing uses the same brackets as indexing. One number gets an item; a colon gets a sub-list." },
     { p: "2", w: "**Start** — included. Item at index 2 is the first one you get." },
     { p: ":" },
     { p: "5", w: "**End** — excluded. You get 2, 3 and 4. The count is therefore `5 - 2 = 3`, with no arithmetic to get wrong." },
     { p: "]" }
    ],
    after: "Leave either side out for *from the beginning* or *to the end*: `items[:3]` is the first three, `items[3:]` is everything after them, and together they tile the whole list with no gap and no overlap. `items[:]` is a full shallow copy." } },

  { h: "Why appending is cheap and inserting is not" },
  { p: "This is the one performance fact worth knowing about lists, and it comes straight from how they are stored in memory: **one contiguous block, items side by side.**" },

  { tbl: { t: "The cost of each operation, and why",
    h: ["Operation", "Cost", "Because"],
    rows: [
     ["`items[i]` — read by index", "**Instant**", "The machine computes `start + i × size` and jumps straight there. Position 5 and position 5,000,000 cost the same."],
     ["`.append(x)` — add at the end", "**Cheap**", "There is usually spare room at the end. Occasionally the block is full and everything is copied to a bigger one — which averages out to cheap."],
     ["`.insert(0, x)` — add at the front", "**Expensive**", "Every existing item must shift one place along to make room. A million items means a million moves."],
     ["`.pop(0)` — remove the front", "**Expensive**", "Same, in reverse. Everything shifts back."],
     ["`x in items` — search", "**Expensive**", "No shortcut. It compares each item in turn until it finds one."],
     ["`.sort()`", "**Moderate**", "Roughly n × log n. Fine for a million items, and far better than you could write yourself."]
    ] } },

  { trap: "Using a list as a queue — `append` at one end, `pop(0)` at the other — is a classic accidental slowdown. Every removal shifts the entire list. Use a purpose-built double-ended queue instead: `collections.deque` in Python, `LinkedList`/`ArrayDeque` in Java, an index pointer in JavaScript. Same code shape, constant cost per operation." },

  { h: "Building lists: the loop and the comprehension" },

  { vs: { lang: "python", t: "The same transformation, two ways",
    bad: { label: "Loop and append — clear, and fine", c: "with_tax = []\nfor p in prices:\n    if p > 0:\n        with_tax.append(p * 1.2)",
      w: "Four lines, three of which are ceremony: create the empty list, loop, append. Nothing wrong with it, and in many languages it is the only option." },
    good: { label: "A comprehension", c: "with_tax = [p * 1.2 for p in prices if p > 0]",
      w: "One line, read as *the value, for each item, where the condition holds*. Python, and near-identical in JS (`prices.filter(p => p > 0).map(p => p * 1.2)`), C# LINQ, Ruby, Kotlin. It also states the shape up front: this produces a list of the same or smaller size." }
  } },

  { p: "Comprehensions are worth learning because they say *what* rather than *how*, and because you will read them constantly. They are worth abandoning the moment they get long — if the line does not fit comfortably or has two `for`s and two `if`s, the loop is more readable and nobody will thank you for the cleverness." },

  { h: "Two dimensions" },

  { code: { lang: "python", t: "A list of lists",
    lines: [
     { c: "grid = [", w: "" },
     { c: "    [1, 2, 3],", w: "Row 0" },
     { c: "    [4, 5, 6],", w: "Row 1" },
     { c: "]", w: "" },
     { c: "", w: "" },
     { c: "grid[1][2]", w: "6 — row first, then column. Read it left to right: *take the list at index 1, then index 2 of that*." },
     { c: "", w: "" },
     { c: "for row in grid:", w: "" },
     { c: "    for value in row:", w: "The nested loop mirrors the nested data. This is when nesting is correct rather than accidental." },
     { c: "        print(value)", w: "" }
    ] } },

  { trap: "Creating a grid with `[[0] * 3] * 2` gives you **the same inner list twice**, not two lists — the multiplication copies the reference. Setting `grid[0][0] = 9` changes both rows. Build it with a comprehension instead: `[[0] * 3 for _ in range(2)]`. The alias lesson comes back one more time." },

  { tryit: { t: "Predict each result",
    task: "For `items = ['a', 'b', 'c', 'd', 'e']`, what does each produce?",
    hint: "Slices exclude the end. Negative indexes count from the back.",
    sol: { lang: "python", code: "items[0]      -> 'a'\nitems[-1]     -> 'e'\nitems[1:3]    -> ['b', 'c']        (3 excluded)\nitems[:2]     -> ['a', 'b']\nitems[3:]     -> ['d', 'e']\nitems[:2] + items[2:] -> the whole list, no gap, no overlap\nitems[::2]    -> ['a', 'c', 'e']   (step of 2)\nitems[::-1]   -> ['e','d','c','b','a']  (reversed)\nitems[10]     -> IndexError\nitems[2:99]   -> ['c','d','e']     (slices clamp; indexes do not)" },
    w: "The last pair is worth noticing: an out-of-range *index* is an error, but an out-of-range *slice* silently clamps to what exists. Forgiving, and occasionally hides a bug." } },

  { vocab: ["Array", "Index", "Queue"] }
 ],
 k: [
  "A list is ordered, indexed from zero, and stored as one contiguous block — which explains every one of its performance characteristics.",
  "Reading by index and appending are cheap. Inserting or removing at the front is expensive, because everything shifts.",
  "Searching a list with `in` is a full scan. Inside a loop, that is the hidden quadratic from the last module.",
  "Slices exclude their end, so `end - start` is the count and adjacent slices tile perfectly."
 ],
 r: ["Array", "Index", "Time Complexity", "Queue"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "items.append(x)", w: "add to the end — the cheap operation" },
   { c: "first_three = items[:3]", w: "take a slice from the start, end excluded" },
   { c: "last = items[-1]", w: "the final item without computing its index" },
   { c: "clean = [x.strip() for x in rows if x]", w: "transform and filter in one line" },
   { c: "ordered = sorted(items)", w: "get a new sorted list without changing the original", hint: ".sort() mutates and returns None" }
  ]
 }
},

{
 t: "Maps, Dictionaries and Key–Value Thinking",
 m: "data",
 lvl: "core",
 s: "Looking things up by name instead of by position — and why it is instant no matter how big it gets.",
 goal: [
  "Choose a dictionary over a list when the access pattern calls for it",
  "Handle a missing key without crashing",
  "Explain roughly why a hash lookup does not slow down"
 ],
 b: [
  { p: "A list answers *what is at position 3?* A **dictionary** answers *what is stored under this name?* — and that is the question you actually have, most of the time. Called `dict` in Python, `Map` or object in JavaScript, `HashMap` in Java, `map` in Go, `Dictionary` in C#. Same structure, six names." },

  { code: { lang: "python", t: "The core operations",
    lines: [
     { c: "user = {\"name\": \"Ana\", \"age\": 30, \"city\": \"Pune\"}", w: "Curly braces, `key: value` pairs. Keys are usually strings; they can be any immutable value — numbers, tuples — but never a list, for a reason we get to below." },
     { c: "", w: "" },
     { c: "user[\"name\"]", w: "\"Ana\". Instant, regardless of how many keys the dictionary holds." },
     { c: "user[\"email\"]", w: "**KeyError.** Square brackets on a missing key raise. Often that is exactly what you want — a missing key is usually a bug worth hearing about." },
     { c: "user.get(\"email\")", w: "`None` instead of an error. Use it when absence is normal." },
     { c: "user.get(\"email\", \"none@given\")", w: "A default of your choosing. This one line replaces an if/else and is the idiom to reach for." },
     { c: "", w: "" },
     { c: "user[\"email\"] = \"a@b.com\"", w: "Adds if missing, overwrites if present. There is no separate *insert* and *update*." },
     { c: "del user[\"age\"]", w: "Removes the pair." },
     { c: "\"age\" in user", w: "Checks the **keys**, not the values. Instant." },
     { c: "", w: "" },
     { c: "for key, value in user.items():", w: "Iterate over pairs. `.keys()` and `.values()` give one side each." },
     { c: "    print(key, value)", w: "" }
    ] } },

  { h: "When to use which" },

  { tbl: { t: "List or dictionary?",
    h: ["You want to…", "Use", "Why"],
    rows: [
     ["Keep things in order and process them all", "**List**", "That is what order is for."],
     ["Find one thing by an id, name or code", "**Dictionary**", "Instant lookup instead of a scan."],
     ["Count how many times each thing appears", "**Dictionary**", "The thing is the key, the count is the value."],
     ["Ask *have I already seen this?*", "**Set** (or dict)", "Instant membership test. A list here is the classic slowdown."],
     ["Group items by a category", "**Dictionary of lists**", "Category as key, list of members as value."],
     ["Represent one real-world thing with named fields", "**Dictionary** (or an object)", "`user[\"email\"]` beats `user[2]` in every way."]
    ] } },

  { h: "The three patterns you will write forever" },

  { code: { lang: "python", t: "Count, group, index",
    lines: [
     { c: "# 1. counting", w: "" },
     { c: "counts = {}", w: "" },
     { c: "for word in words:", w: "" },
     { c: "    counts[word] = counts.get(word, 0) + 1", w: "*Take the current count, or zero if this is the first time, add one, store it back.* This single line is the entire word-frequency algorithm." },
     { c: "", w: "" },
     { c: "# 2. grouping", w: "" },
     { c: "by_city = {}", w: "" },
     { c: "for user in users:", w: "" },
     { c: "    by_city.setdefault(user[\"city\"], []).append(user)", w: "*Get the list for this city, creating an empty one if needed, and append.* `defaultdict(list)` does the same more readably in Python." },
     { c: "", w: "" },
     { c: "# 3. indexing -- turning a list into a lookup", w: "" },
     { c: "by_id = {u[\"id\"]: u for u in users}", w: "A dictionary comprehension. Build this **once**, before a loop, and every subsequent lookup is instant instead of a scan. This is the fix for the accidental quadratic from the loops module." }
    ],
    after: "Count, group, index. Recognising which of the three a problem is saves you re-deriving it, and between them they cover an enormous fraction of everyday data work." } },

  { h: "Why lookup is instant" },
  { p: "This is worth understanding roughly, because it explains both the speed and the restrictions." },

  { dg: "hash-table" },

  { ol: [
   "The key is fed through a **hash function** — a calculation that turns any value into a number.",
   "That number is reduced (with `%`, the modulo from the operators lesson) to a slot number in an underlying array.",
   "The value is stored in that slot. To look it up again, you hash the key and go straight to the slot."
  ] },
  { p: "There is no searching. The key *computes* its own address. That is why a dictionary with ten items and one with ten million take the same time to answer, and it is one of the genuinely beautiful ideas in computing." },

  { p: "Two consequences fall straight out of the mechanism:" },
  { l: [
   "**Keys must be immutable.** If you used a list as a key and then changed it, its hash would change, and the value would be sitting in a slot nobody will ever look in again. Python refuses outright: `TypeError: unhashable type: 'list'`. Use a tuple.",
   "**Order was historically not guaranteed.** Items are placed by hash, not by insertion. Modern Python (3.7+) and JavaScript do preserve insertion order, but Java's `HashMap` and Go's `map` do not — Go actively randomises it to stop you depending on it."
  ] },

  { h: "Nested structures: the shape of real data" },
  { p: "Combine lists and dictionaries and you can represent essentially anything. This is exactly what JSON is, which is why JSON is the format of the entire web." },

  { code: { lang: "python", t: "Reading nested data without fear",
    lines: [
     { c: "data = {", w: "" },
     { c: "  \"users\": [", w: "A dictionary whose value is a list…" },
     { c: "    {\"name\": \"Ana\", \"tags\": [\"admin\", \"dev\"]},", w: "…of dictionaries…" },
     { c: "    {\"name\": \"Raj\", \"tags\": []}", w: "…each containing a list. Three levels, and nothing new to learn." },
     { c: "  ]", w: "" },
     { c: "}", w: "" },
     { c: "", w: "" },
     { c: "data[\"users\"][0][\"tags\"][1]", w: "\"dev\". **Read strictly left to right**, one step at a time: the users list, its first item, that item's tags, the second tag. Long access chains are not complicated, just long." },
     { c: "", w: "" },
     { c: "for user in data[\"users\"]:", w: "" },
     { c: "    for tag in user[\"tags\"]:", w: "The loop nesting mirrors the data nesting, exactly as it did with the grid." },
     { c: "        print(user[\"name\"], tag)", w: "" }
    ] } },

  { trap: "Long chains break loudly the moment one link is missing, and the error names the last thing that worked, not the missing bit. `data[\"users\"][0][\"email\"]` on a user with no email raises a `KeyError` naming `email` — fine. But `data[\"user\"]` (singular, a typo) raises a `KeyError` naming `user`, and people stare at the `[0]` for ten minutes. Read the key in the error message; it is telling you precisely which step failed." },

  { code: { lang: "python", t: "Walking nested data safely",
    lines: [
     { c: "email = data.get(\"users\", [{}])[0].get(\"email\", \"unknown\")", w: "Works, and is horrible to read." },
     { c: "", w: "" },
     { c: "users = data.get(\"users\", [])", w: "Better: unpack one level at a time, with a sensible default at each step." },
     { c: "if users:", w: "" },
     { c: "    email = users[0].get(\"email\", \"unknown\")", w: "Now a failure tells you *which* level was missing, and the line fits on a screen." },
     { c: "", w: "" },
     { c: "// JavaScript has syntax for this:", w: "" },
     { c: "const email = data?.users?.[0]?.email ?? \"unknown\";", w: "**Optional chaining** — `?.` stops and yields `undefined` the moment anything is missing, and `??` supplies the default. Increasingly common; C# has `?.` too." }
    ] } },

  { tryit: { t: "Count and group",
    task: "Given a list of order dictionaries with `customer` and `amount`, produce total spend per customer.",
    hint: "The customer is the key. Start from zero when the key is new.",
    sol: { lang: "python", code: "orders = [\n    {\"customer\": \"ana\", \"amount\": 30},\n    {\"customer\": \"raj\", \"amount\": 20},\n    {\"customer\": \"ana\", \"amount\": 15},\n]\n\ntotals = {}\nfor o in orders:\n    totals[o[\"customer\"]] = totals.get(o[\"customer\"], 0) + o[\"amount\"]\n\n# {'ana': 45, 'raj': 20}\n\n# and the top spender\ntop = max(totals, key=totals.get)   # 'ana'" },
    w: "This is the count pattern with an amount instead of a 1. Recognising that it is the same pattern is the point — the entire *group and aggregate* family of problems, which is most of data work, reduces to this shape." } },

  { vocab: ["Hash Table", "Dictionary", "Key-Value Store", "JSON"] }
 ],
 k: [
  "A dictionary looks values up by key instead of by position, and the lookup is instant no matter how many entries there are.",
  "Use `.get(key, default)` when a missing key is normal, and square brackets when a missing key is a bug you want to hear about.",
  "Three patterns cover most data work: count by key, group by key, and index a list into a dictionary before looping.",
  "Keys must be immutable, because the key computes its own storage slot from its contents."
 ],
 r: ["Hash Table", "Dictionary", "JSON", "Key-Value Store"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "counts[word] = counts.get(word, 0) + 1", w: "count occurrences, starting from zero for new keys" },
   { c: "by_id = {u[\"id\"]: u for u in users}", w: "index a list into a dictionary for instant lookup" },
   { c: "email = user.get(\"email\", \"unknown\")", w: "read a key that may be absent, with a fallback" },
   { c: "for key, value in settings.items():", w: "iterate over pairs" },
   { c: "groups.setdefault(city, []).append(user)", w: "group items into per-key lists" }
  ]
 }
},

{
 t: "Sets, Tuples and Picking the Right Container",
 m: "data",
 lvl: "intermediate",
 s: "The two containers beginners skip, and a decision procedure for choosing between all four.",
 goal: [
  "Use a set for membership and de-duplication",
  "Say why a tuple's immutability is a feature",
  "Pick a container from the question being asked"
 ],
 b: [
  { p: "Most people learn lists and dictionaries and stop. Sets and tuples then get simulated badly with lists for years. Both take ten minutes to learn and each solves a problem you will otherwise solve worse." },

  { h: "Sets: membership and uniqueness" },
  { p: "A **set** is an unordered collection with no duplicates. Under the hood it is a dictionary with only keys — which means it inherits the instant lookup." },

  { code: { lang: "python", t: "What a set is for",
    lines: [
     { c: "seen = set()", w: "Empty set. Note `{}` is an empty *dictionary*, not a set — a genuine gotcha in Python." },
     { c: "seen.add(\"ana\")", w: "" },
     { c: "seen.add(\"ana\")", w: "Adding a duplicate is silently ignored. No error, no second copy. That *is* the guarantee, and it removes a whole class of if-check." },
     { c: "len(seen)", w: "1" },
     { c: "", w: "" },
     { c: "\"ana\" in seen", w: "**Instant**, at any size. On a list this is a scan, and this one line is the most common performance fix a beginner ever makes." },
     { c: "", w: "" },
     { c: "unique = set(names)", w: "De-duplicate a list in one word." },
     { c: "unique = list(set(names))", w: "…and back to a list, if you need one. Order is lost — use `list(dict.fromkeys(names))` to de-duplicate while keeping order." }
    ] } },

  { p: "Sets also give you the operations from school set theory, which turn several loops into one line each:" },

  { code: { lang: "python", t: "Set algebra, in real use",
    lines: [
     { c: "current = {\"ana\", \"raj\", \"sam\"}", w: "" },
     { c: "previous = {\"raj\", \"sam\", \"kai\"}", w: "" },
     { c: "", w: "" },
     { c: "current & previous", w: "**Intersection** — {\"raj\", \"sam\"}. *Who stayed?*" },
     { c: "current - previous", w: "**Difference** — {\"ana\"}. *Who joined?*" },
     { c: "previous - current", w: "{\"kai\"}. *Who left?*" },
     { c: "current | previous", w: "**Union** — everyone, no duplicates." },
     { c: "current ^ previous", w: "**Symmetric difference** — everyone who changed state either way." }
    ],
    after: "That is a complete change report in five lines, with no loops and no conditions. Any time you find yourself writing nested loops to compare two collections, stop and ask whether sets do it." } },

  { h: "Tuples: fixed groups" },
  { p: "A **tuple** is an ordered sequence, like a list, that cannot be changed after it is made. Round brackets in Python; records, structs or fixed arrays elsewhere." },

  { code: { lang: "python", t: "When immutability is the point",
    lines: [
     { c: "point = (18.52, 73.85)", w: "Latitude and longitude. These two numbers are **one thing**; changing one independently would produce a location nobody meant." },
     { c: "point[0]", w: "18.52 — indexing works exactly like a list." },
     { c: "point[0] = 0", w: "**TypeError.** And this is the feature: nothing anywhere in your program can corrupt this value, including you at 2am." },
     { c: "", w: "" },
     { c: "lat, lon = point", w: "**Unpacking.** The reason multiple return values are so pleasant in Python." },
     { c: "", w: "" },
     { c: "cache[(user_id, date)] = result", w: "A tuple can be a dictionary key; a list cannot. Compound keys like this are extremely useful and only tuples can do them." }
    ] } },

  { l: [
   "**Use a tuple when the number of items is fixed and each position means something specific** — a coordinate, an RGB colour, a date-and-value pair, a database row.",
   "**Use a list when the items are all the same kind of thing and the count varies** — all users, all prices, all lines of a file.",
   "The distinction is not pedantry: a reader who sees a tuple knows the shape is fixed, and a reader who sees a list knows to expect a loop."
  ] },

  { n: "For anything with more than two or three fields, prefer a named structure over a bare tuple — `namedtuple` or `dataclass` in Python, a record in Java, a struct in Go, an interface in TypeScript. `p.latitude` survives someone inserting a field; `p[0]` does not. Positional access is the same fragility as positional arguments.",
    nt: "When to give the positions names" },

  { h: "Choosing, mechanically" },
  { p: "Do not choose by habit. Choose by the question you are going to ask most often — the question decides the container, and picking wrong is where accidental slowness comes from." },

  { tbl: { t: "The decision table",
    h: ["Your main question", "Container", "Cost of the lookup"],
    rows: [
     ["\"Give me the *n*th one\" / \"process them in order\"", "**List / array**", "Instant by index"],
     ["\"Give me the one called X\"", "**Dictionary / map**", "Instant by key"],
     ["\"Have I seen this before?\" / \"remove duplicates\"", "**Set**", "Instant"],
     ["\"These values are one fixed thing\"", "**Tuple / record**", "Instant by position"],
     ["\"Always take the oldest waiting item\"", "**Queue** (deque)", "Instant at both ends"],
     ["\"Always take the most recent\"", "**Stack**", "Instant at the top"],
     ["\"Always take the highest priority\"", "**Heap / priority queue**", "Logarithmic — still fast"]
    ] } },

  { p: "The last three are worth naming even though you will not need them for a while. A **stack** is last-in-first-out — undo history, the call stack, matching brackets. A **queue** is first-in-first-out — job processing, print queues, breadth-first search. A **heap** always gives you the smallest or largest item cheaply — schedulers, top-N problems. Each is a list with a discipline about which end you may touch." },

  { h: "The conversions" },
  { code: { lang: "python", t: "Moving between containers is one word",
    lines: [
     { c: "list(my_set)", w: "Set to list — you get an order, though not a meaningful one." },
     { c: "set(my_list)", w: "List to set — de-duplicates and gives you fast membership." },
     { c: "tuple(my_list)", w: "List to tuple — freeze it, so it can be a dictionary key or a safe default." },
     { c: "dict(list_of_pairs)", w: "A list of two-item tuples becomes a dictionary." },
     { c: "list(my_dict.items())", w: "…and back to pairs." },
     { c: "sorted(my_set)", w: "Any collection to a sorted list. Works on sets, dictionaries (giving sorted keys), anything iterable." }
    ],
    after: "Because converting is this cheap, *use the right container for each stage of the work*. Build a set to de-duplicate, convert to a sorted list to display. You are not committing to anything by choosing one." } },

  { tryit: { t: "Pick the container",
    task: "For each requirement, name the container and say why.",
    hint: "Read the verb in the requirement: 'check whether', 'look up by', 'in order'.",
    sol: { lang: "text", code: "1. Check if a username is already taken, out of 2 million\n   -> SET. Instant membership; a list would scan 2m entries.\n\n2. Show the last 20 messages, newest last\n   -> LIST. Order is the requirement.\n\n3. Find a product's price given its SKU\n   -> DICT. Look up by name, not position.\n\n4. Store an RGB colour\n   -> TUPLE. Exactly three values, fixed, positionally meaningful.\n\n5. Process support tickets oldest first\n   -> QUEUE (deque). Removing from the front of a list is expensive.\n\n6. Count how many times each error code appeared\n   -> DICT. Code as key, count as value." },
    w: "Number 1 is the one that matters commercially. Getting it wrong makes signup slower every single day as the user table grows, and it will not show up in testing at all." } },

  { vocab: ["Set", "Stack", "Queue", "Data Structure"] }
 ],
 k: [
  "A set has no duplicates and instant membership testing. Converting a list to a set is the most common one-line performance fix there is.",
  "Set algebra — intersection, difference, union — replaces nested comparison loops with one line each.",
  "A tuple is a fixed group whose positions mean something. Its immutability lets it be a dictionary key and protects it from accidental change.",
  "Choose the container from the question you will ask most, not from habit."
 ],
 r: ["Set", "Stack", "Queue", "Data Structure", "Hash Table"]
},

{
 t: "Objects and Classes: Bundling State with Behaviour",
 m: "data",
 lvl: "intermediate",
 s: "The last big idea before you pick a language — what an object is, and what all the OOP vocabulary means.",
 goal: [
  "Say what a class is versus an object",
  "Explain encapsulation, inheritance and polymorphism in plain words",
  "Judge when a class is the right tool and when a function is"
 ],
 b: [
  { p: "So far data and behaviour have been separate: dictionaries hold values, functions do things to them. **Object-oriented programming** puts them together — a thing that holds its own data *and* the operations that belong to it." },
  { p: "You need this lesson even if you never write a class yourself, because you cannot avoid *using* them. `\"hello\".upper()`, `my_list.append(x)`, `response.json()` — every one of those is a method call on an object." },

  { dg: "oop" },

  { h: "Class and object" },
  { p: "A **class** is the blueprint. An **object** (or *instance*) is a thing built from it. One class, unlimited objects, each with its own data." },

  { code: { lang: "python", t: "A class, with every part labelled",
    lines: [
     { c: "class BankAccount:", w: "The blueprint. It describes what every account will have and be able to do. It is not itself an account, in the same way that an architectural drawing is not a house." },
     { c: "", w: "" },
     { c: "    def __init__(self, owner, balance=0):", w: "The **constructor** — run automatically when a new object is created. `__init__` in Python; `constructor` in JS; the class's own name in Java and C++." },
     { c: "        self.owner = owner", w: "**Attributes** (fields, properties): the object's own data. `self` means *this particular object*, so each account has its own owner and balance." },
     { c: "        self.balance = balance", w: "" },
     { c: "", w: "" },
     { c: "    def deposit(self, amount):", w: "A **method**: a function that belongs to the class. `self` is passed automatically and is the object it was called on." },
     { c: "        if amount <= 0:", w: "" },
     { c: "            raise ValueError(\"must be positive\")", w: "The object enforces its own rules. Nobody can deposit a negative amount through this door — which is the whole point of putting the behaviour with the data." },
     { c: "        self.balance += amount", w: "" },
     { c: "", w: "" },
     { c: "acc = BankAccount(\"Ana\", 100)", w: "**Instantiation.** One object now exists, with its own balance of 100." },
     { c: "acc.deposit(50)", w: "Calling a method on it. `self` is `acc`, filled in for you." },
     { c: "acc.balance", w: "150. Another `BankAccount` would be entirely unaffected." }
    ] } },

  { h: "The four words people quiz you on" },

  { p: "**Encapsulation** — keep the data and the operations together, and control access from outside. The rule *a balance can never go negative* lives inside the account, so it is enforced everywhere automatically. Compare a bare dictionary, where any line anywhere in the program can write `account[\"balance\"] = -500`. Languages mark internals as private with `private` (Java, C#), `#` (JavaScript), or a leading underscore by convention (Python)." },

  { p: "**Abstraction** — expose what something does, hide how. You call `file.write(data)` without knowing anything about disk sectors. You have been benefiting from this since your first `print()`." },

  { p: "**Inheritance** — a class can be built from another, taking its behaviour and adding or changing some. A `SavingsAccount` *is a* `BankAccount` that also pays interest." },

  { code: { lang: "python", t: "Inheritance and overriding",
    lines: [
     { c: "class SavingsAccount(BankAccount):", w: "Inherits everything: `deposit`, `owner`, `balance`, all of it." },
     { c: "    def __init__(self, owner, balance=0, rate=0.03):", w: "" },
     { c: "        super().__init__(owner, balance)", w: "`super()` calls the parent's version, so you do not duplicate its setup." },
     { c: "        self.rate = rate", w: "Then add what is new." },
     { c: "", w: "" },
     { c: "    def add_interest(self):", w: "New behaviour the parent does not have." },
     { c: "        self.deposit(self.balance * self.rate)", w: "And it can use the inherited method." }
    ] } },

  { p: "**Polymorphism** — different classes responding to the same call in their own way. It is the one that sounds most academic and is the most practically useful." },

  { code: { lang: "python", t: "The same call, different behaviour",
    lines: [
     { c: "for account in all_accounts:", w: "A mixed list of current accounts, savings accounts and business accounts." },
     { c: "    account.apply_monthly_fees()", w: "Each object runs **its own** version. The loop does not know or care which type each one is, and adding a new account type tomorrow requires no change to this line." }
    ],
    after: "The alternative is a giant `if type == ...` chain that must be edited every time a new type appears — and there are usually five such chains scattered around. Polymorphism is how you delete them." } },

  { h: "When a class is right, and when it is not" },
  { p: "Object orientation was oversold in the 1990s and every language that adopted it accumulated codebases with far too many classes. The modern position is more moderate." },

  { tbl: { t: "Class or function?",
    h: ["Situation", "Reach for"],
    rows: [
     ["Data that has rules about how it may change", "**A class.** The rules live with the data."],
     ["Several functions that all take the same three arguments", "**A class.** Those arguments are the object's state."],
     ["Many variants that must behave differently for the same call", "**A class**, using polymorphism."],
     ["A calculation: values in, value out", "**A function.** A class here adds ceremony and nothing else."],
     ["Plain data with no rules", "**A dict, record or dataclass.** Not a full class."],
     ["A class with one method called `run()`", "**That is a function** wearing a costume."]
    ] } },

  { trap: "Deep inheritance chains are a well-known trap. `Animal` → `Mammal` → `Dog` → `WorkingDog` → `PoliceDog` looks tidy in a textbook and becomes unmaintainable in practice: a change at the top ripples unpredictably, and real things stubbornly refuse to fit a single tree. The modern guidance is **prefer composition over inheritance** — give an object the pieces it needs rather than making it *be* a subtype. Inherit one level deep, or use interfaces, and stop." },

  { n: "Not every language does objects the same way. Java and C# are class-based and were built around them. Python and JavaScript support them and do not require them. Go has no classes or inheritance at all — it has structs plus interfaces, and gets polymorphism without the tree. Rust is similar. If a language you meet later seems to be *missing* OOP, it usually decided the tree was the problem.",
    nt: "Not everyone agreed" },

  { tryit: { t: "Class or function?",
    task: "For each, decide and justify in one sentence.",
    hint: "Ask whether there is *state with rules*. No state, no rules — no class.",
    sol: { lang: "text", code: "1. Convert Celsius to Fahrenheit\n   -> Function. Value in, value out, no state.\n\n2. A shopping cart: add, remove, total, apply a coupon,\n   never allow a negative quantity\n   -> Class. State plus rules that must always hold.\n\n3. Validate an email address\n   -> Function. Pure check, nothing remembered.\n\n4. A database connection that must be opened, used, closed,\n   and never used after closing\n   -> Class. It has a lifecycle and an illegal state to prevent.\n\n5. Five report types that all need `.render()`\n   -> Classes with a shared interface. Textbook polymorphism." },
    w: "The pattern in the yeses: something is *remembered between calls*, and there are *states that must never happen*. That is precisely what a class is for, and everything else is a function." } },

  { vocab: ["Object-Oriented Programming", "Class", "Encapsulation", "Inheritance", "Polymorphism", "Composition over Inheritance"] }
 ],
 k: [
  "A class is a blueprint; an object is one thing built from it, with its own data.",
  "Encapsulation means the rules live with the data, so they are enforced everywhere rather than remembered everywhere.",
  "Polymorphism lets one line of calling code work with many types, which is how you delete long chains of type checks.",
  "Use a class when there is state with rules attached. For a plain calculation, a function is the honest answer."
 ],
 r: ["Object-Oriented Programming", "Class", "Encapsulation", "Inheritance", "Polymorphism", "SOLID"]
}

]);
