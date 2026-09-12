/* Python — objects and classes. */
TD.addLessons("python", [

{
 t: "What an Object Actually Is",
 m: "oop",
 lvl: "intermediate",
 s: "Data and the things you can do to it, bundled — and you have been using them all along.",
 goal: [
  "Explain what a class is and what an instance is",
  "Write `__init__` and say exactly what `self` is",
  "Decide honestly whether a problem needs a class at all"
 ],
 b: [
  { p: "Object-oriented programming is usually taught as a philosophy, which makes it sound harder than it is. Here is the mechanical version, which is all you need." },
  { p: "**An object is some data plus the functions that work on that data, bundled together under one name.** That is it. A list is an object: it holds items, and `.append()` and `.sort()` are functions that work on those items. You have been using objects since your second lesson." },

  { code: { lang: "python", t: "The evidence",
    lines: [
     { c: ">>> \"hello\".upper()", w: "The string holds data; `.upper()` is a function that belongs to it. That is an object." },
     { c: ">>> [3, 1, 2].sort()", w: "Same shape. Data plus behaviour, reached with a dot." },
     { c: ">>> type(5)", w: "**Even a number.** In Python everything is an object, including functions and classes themselves." },
     { c: "<class 'int'>", w: "And `class` is the word Python uses for *what kind of object this is*." }
    ] } },

  { h: "A class is a blueprint; an instance is a thing built from it" },
  { ana: "A class is the recipe and an instance is the cake. The recipe describes what ingredients every cake has and what you can do with it; the cake is a real object with real, specific ingredients. One recipe, any number of cakes, each with its own values. `list` is the recipe; `[1, 2, 3]` is a cake.",
    at: "Recipe and cake" },

  { syn: { t: "Defining your own",
    parts: [
     { p: "class", w: "**The keyword.** Like `def`, this creates something and remembers it — it does not run the body's methods now." },
     { p: " " },
     { p: "BankAccount", w: "**The name, in PascalCase** — capital letter on each word, no underscores. This is the one place Python does not use snake_case, and the different casing is a signal: a capitalised name means a class." },
     { p: ":", w: "The colon, opening the block, exactly as everywhere else." }
    ] } },

  { code: { lang: "python", file: "account.py", t: "A complete, small class",
    lines: [
     { c: "class BankAccount:", w: "The blueprint." },
     { c: "    def __init__(self, owner, balance=0):", w: "**`__init__` runs automatically every time you create an instance.** The name is fixed — Python looks for exactly this. Its job is to set up the new object's data. It is *not* a constructor in the C++ sense; the object already exists by the time this runs." },
     { c: "        self.owner = owner", w: "**`self` is the specific instance being worked on.** `self.owner = owner` stores the argument *on this object*, so it survives after `__init__` finishes. Without `self.`, `owner` would be an ordinary local variable and vanish." },
     { c: "        self.balance = balance", w: "Another attribute. These two lines are what makes each account distinct." },
     { c: "", w: "" },
     { c: "    def deposit(self, amount):", w: "**A method is a function defined inside a class**, and `self` is always its first parameter. You never pass it — Python supplies it automatically from whatever is left of the dot." },
     { c: "        if amount <= 0:", w: "" },
     { c: "            raise ValueError(\"deposit must be positive\")", w: "The class is the natural place for rules about its own data. Nothing outside can deposit a negative amount without going around this method." },
     { c: "        self.balance += amount", w: "Changes *this* account's balance and no other." },
     { c: "        return self.balance" },
     { c: "", w: "" },
     { c: "acc = BankAccount(\"Aryan\", 100)", w: "**Creating an instance looks like calling the class.** Python makes a blank object, passes it as `self`, and runs `__init__` with your arguments." },
     { c: "acc.deposit(50)", w: "**`acc.deposit(50)` is really `BankAccount.deposit(acc, 50)`.** That is the whole mystery of `self`: the thing before the dot becomes the first argument." },
     { c: "print(acc.owner, acc.balance)" }
    ],
    out: "Aryan 150" } },

  { n: "`self` is not a keyword. It is an ordinary parameter name, and Python only cares that it comes first. You could call it `this` or `me` and it would work. Everyone calls it `self`, and code that does not is genuinely jarring to read — so call it `self`.",
    nt: "self is a convention, not a rule" },

  { trap: "Forgetting `self.` inside a method is the most common beginner error here. `balance += amount` creates a local variable, adds to it, and throws it away when the method returns — with no error at all. The account's balance never changes and nothing tells you. Anything that should outlive the method needs `self.` in front of it." },

  { h: "Each instance is separate" },
  { code: { lang: "python",
    lines: [
     { c: "a = BankAccount(\"Aryan\", 100)", w: "" },
     { c: "b = BankAccount(\"Sam\", 50)", w: "Two separate objects from the same blueprint." },
     { c: "", w: "" },
     { c: "a.deposit(25)", w: "Only `a` changes." },
     { c: "print(a.balance, b.balance)" }
    ],
    out: "125 50",
    after: "This is the point of a class. Two variables would need `aryan_balance` and `sam_balance` and every function would need to be told which. With a class, the data and the operations travel together." } },

  { h: "Class attributes versus instance attributes" },
  { code: { lang: "python",
    lines: [
     { c: "class BankAccount:", w: "" },
     { c: "    interest_rate = 0.04", w: "**A class attribute** — defined in the class body, shared by every instance. Use it for genuine constants that belong to the concept." },
     { c: "", w: "" },
     { c: "    def __init__(self, owner):", w: "" },
     { c: "        self.owner = owner", w: "**An instance attribute** — set on `self`, so each object has its own." },
     { c: "        self.history = []", w: "**Built inside `__init__`, deliberately.** Put `history = []` in the class body instead and every account would share one list — the mutable-default bug from the data module, wearing a different hat." }
    ] } },

  { h: "When not to write a class" },
  { p: "The honest counterweight to everything above: Python does not require classes, and beginners coming from Java write far too many." },
  { vs: { t: "A class that should have been a function", lang: "python",
    bad: { c: "class Calculator:\n    def __init__(self, a, b):\n        self.a = a\n        self.b = b\n\n    def add(self):\n        return self.a + self.b\n\nresult = Calculator(2, 3).add()", label: "Ceremony",
      w: "The object exists for one line and holds nothing worth holding. Nine lines to do what one does." },
    good: { c: "def add(a, b):\n    return a + b\n\nresult = add(2, 3)", label: "A function",
      w: "If there is no state worth keeping between calls, you wanted a function." } } },
  { l: [
   "**Write a class** when several pieces of data belong together *and* there are operations that only make sense on that combination — an account with a balance and rules about changing it.",
   "**Write a function** when you transform an input into an output and keep nothing.",
   "**Use a dictionary** when you only need to group data with no behaviour attached.",
   "**Use a dataclass** — a lesson away — when you need a class that is almost entirely data."
  ] },

  { tryit: { t: "Model something real",
    task: "Write a `Playlist` class that holds a name and a list of songs. Give it `add(song)`, `remove(song)` that does not crash when the song is absent, and `total()` returning how many songs it holds.",
    hint: "Build the empty list inside `__init__`, never in the class body. For `remove`, check membership before removing.",
    sol: { lang: "python", code: "class Playlist:\n    def __init__(self, name):\n        self.name = name\n        self.songs = []\n\n    def add(self, song):\n        self.songs.append(song)\n\n    def remove(self, song):\n        if song in self.songs:\n            self.songs.remove(song)\n\n    def total(self):\n        return len(self.songs)\n\npl = Playlist(\"Focus\")\npl.add(\"Blue Train\")\npl.remove(\"Not there\")\nprint(pl.name, pl.total())" },
    w: "Note `self.songs = []` inside `__init__` — one list per playlist. In the class body it would be one list shared by every playlist you ever create." } }
 ],
 k: [
  "An object is data plus the functions that work on it. Lists and strings already are objects.",
  "A class is the blueprint; each instance built from it has its own data.",
  "`self` is the instance being worked on — `acc.deposit(50)` really means `BankAccount.deposit(acc, 50)`.",
  "Forgetting `self.` silently creates a local that vanishes. And if there is no state to keep, write a function."
 ],
 r: ["Object-Oriented Programming", "Class", "Instance", "Constructor", "Encapsulation"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "class BankAccount:", w: "begin defining a class named BankAccount", hint: "PascalCase, and a colon" },
   { c: "    def __init__(self, owner, balance=0):", w: "define the setup method that runs when an instance is created", hint: "two underscores each side" },
   { c: "        self.balance = balance", w: "store a value on this specific instance so it survives the method" },
   { c: "    def deposit(self, amount):", w: "define a method taking one argument besides the instance" },
   { c: "acc = BankAccount(\"Aryan\", 100)", w: "create an instance of the class" }
  ]
 }
},

{
 t: "Dunder Methods — Making Your Class Behave",
 m: "oop",
 lvl: "intermediate",
 s: "How `len()`, `print()` and `==` work on your own objects, and why Python has no interfaces.",
 goal: [
  "Make your object print as something readable",
  "Make two of your objects compare correctly with `==`",
  "Explain what the double underscores actually mean"
 ],
 b: [
  { p: "You have seen `__init__` and probably found the underscores off-putting. They are a naming convention with a precise meaning, and once it lands, a large amount of Python stops being mysterious." },
  { p: "A **dunder method** — *double underscore* — is a method Python calls *for you*, in response to ordinary syntax. You almost never call them directly. You write them, and then built-in operations start working on your class." },

  { tbl: { t: "The syntax, and the method it really calls",
    h: ["You write", "Python calls"],
    rows: [
     ["`len(x)`", "`x.__len__()`"],
     ["`x + y`", "`x.__add__(y)`"],
     ["`x == y`", "`x.__eq__(y)`"],
     ["`x[0]`", "`x.__getitem__(0)`"],
     ["`for i in x`", "`x.__iter__()`"],
     ["`print(x)`", "`x.__str__()`"],
     ["`x()`", "`x.__call__()`"],
     ["`with x:`", "`x.__enter__()` then `x.__exit__()`"]
    ] } },
  { n: "This is why Python has no `interface` keyword. Instead of declaring that your class implements *Sized*, you simply define `__len__` — and `len()` works. Behaviour is decided by the methods a thing has, not by what it claims to be. The name for this is **duck typing**: if it walks like a duck, it is treated as one.",
    nt: "Why there is no `interface` keyword" },

  { h: "__str__ and __repr__" },
  { code: { lang: "python", t: "The first thing worth adding to any class",
    lines: [
     { c: "class Song:", w: "" },
     { c: "    def __init__(self, title, artist):", w: "" },
     { c: "        self.title = title" },
     { c: "        self.artist = artist" },
     { c: "", w: "" },
     { c: "s = Song(\"Blue Train\", \"Coltrane\")", w: "" },
     { c: "print(s)", w: "**This is what you get without a `__str__`** — useless, and the moment most people decide classes are unfriendly." }
    ],
    out: "<__main__.Song object at 0x104b2c9d0>" } },

  { code: { lang: "python", t: "Two methods, two audiences",
    lines: [
     { c: "class Song:", w: "" },
     { c: "    def __init__(self, title, artist):", w: "" },
     { c: "        self.title = title" },
     { c: "        self.artist = artist" },
     { c: "", w: "" },
     { c: "    def __str__(self):", w: "**For a human.** Called by `print()` and `str()`. Make it readable; no need for it to be complete." },
     { c: "        return f\"{self.title} by {self.artist}\"" },
     { c: "", w: "" },
     { c: "    def __repr__(self):", w: "**For a programmer.** Called in the REPL, in a traceback, and when the object is inside a list you print. The convention is that it looks like the code that would recreate the object." },
     { c: "        return f\"Song({self.title!r}, {self.artist!r})\"", w: "**`!r` inside an f-string means *use `repr` for this value*** — which is what puts the quotes around the strings." },
     { c: "", w: "" },
     { c: "s = Song(\"Blue Train\", \"Coltrane\")", w: "" },
     { c: "print(s)", w: "Uses `__str__`." },
     { c: "print([s])", w: "**A list prints its items with `__repr__`, not `__str__`** — which is why a class with only `__str__` still shows gibberish inside a list." }
    ],
    out: "Blue Train by Coltrane\n[Song('Blue Train', 'Coltrane')]",
    after: "If you write only one, write `__repr__` — Python falls back to it for `str()` when `__str__` is missing, so you get both for the price of one." } },

  { h: "__eq__ and the hash rule" },
  { code: { lang: "python",
    lines: [
     { c: "a = Song(\"Blue Train\", \"Coltrane\")", w: "" },
     { c: "b = Song(\"Blue Train\", \"Coltrane\")", w: "Identical contents." },
     { c: "print(a == b)", w: "**`False` by default.** Without `__eq__`, Python compares identity — the same test as `is` — and these are two separate objects." }
    ],
    out: "False" } },
  { code: { lang: "python",
    lines: [
     { c: "    def __eq__(self, other):", w: "" },
     { c: "        if not isinstance(other, Song):", w: "**Always type-check first.** Comparing a `Song` to a string should say no, not crash with `AttributeError`." },
     { c: "            return NotImplemented", w: "**`NotImplemented`, not `False`.** It tells Python to try the *other* object's `__eq__` before giving up — which is how comparison between unrelated types stays sane." },
     { c: "        return (self.title, self.artist) == (other.title, other.artist)", w: "**Compare the fields as a tuple.** Tuples compare element by element, so this is one readable line regardless of how many fields there are." },
     { c: "", w: "" },
     { c: "    def __hash__(self):", w: "**Defining `__eq__` sets `__hash__` to `None`**, which makes your objects unusable in a set or as a dictionary key. If two objects are equal they must hash the same, so Python refuses to guess." },
     { c: "        return hash((self.title, self.artist))", w: "Hash the same tuple you compared. Only do this for objects that never change — a mutable object whose hash moves will get lost inside a dictionary." }
    ] } },

  { h: "The ones worth reaching for" },
  { code: { lang: "python", t: "Making a container behave like a container",
    lines: [
     { c: "class Playlist:", w: "" },
     { c: "    def __init__(self, songs):", w: "" },
     { c: "        self.songs = list(songs)" },
     { c: "", w: "" },
     { c: "    def __len__(self):", w: "Now `len(playlist)` works." },
     { c: "        return len(self.songs)" },
     { c: "", w: "" },
     { c: "    def __getitem__(self, i):", w: "Now `playlist[0]` works — **and so does `for song in playlist`**, because Python falls back to indexing from zero when there is no `__iter__`." },
     { c: "        return self.songs[i]" },
     { c: "", w: "" },
     { c: "    def __contains__(self, song):", w: "Now `song in playlist` works. Without it Python would still answer by looping, just more slowly." },
     { c: "        return song in self.songs" }
    ],
    after: "Four small methods, and your class now supports `len`, indexing, slicing, iteration, `in`, and unpacking — every one of them ordinary Python syntax that a reader already knows." } },

  { h: "@property — a method that looks like an attribute" },
  { code: { lang: "python",
    lines: [
     { c: "class Rectangle:", w: "" },
     { c: "    def __init__(self, w, h):", w: "" },
     { c: "        self.width = w" },
     { c: "        self.height = h" },
     { c: "", w: "" },
     { c: "    @property", w: "**A decorator** — the next module explains the mechanism. Its effect here: `area` is computed on demand but accessed with no parentheses." },
     { c: "    def area(self):" },
     { c: "        return self.width * self.height" },
     { c: "", w: "" },
     { c: "r = Rectangle(3, 4)", w: "" },
     { c: "print(r.area)", w: "**No brackets.** It looks like stored data and is calculated fresh every time — so it can never go stale when width changes." },
     { c: "r.area = 20", w: "`AttributeError` — read-only unless you also write a setter. Usually exactly what you want." }
    ],
    out: "12" } },
  { p: "This is why Python does not need Java-style getters and setters. You expose a plain attribute; if it later needs logic behind it, you convert it to a `@property` and **no calling code changes**. That is the whole argument, and it is a good one." },

  { tryit: { t: "Make a class behave properly",
    task: "Add `__str__`, `__repr__`, `__eq__` and `__len__` to a `Team` class holding a name and a list of members, so that printing it is readable, two teams with the same name and members are equal, and `len(team)` gives the member count.",
    hint: "Compare tuples in `__eq__`, and remember `NotImplemented` for the wrong type.",
    sol: { lang: "python", code: "class Team:\n    def __init__(self, name, members):\n        self.name = name\n        self.members = list(members)\n\n    def __str__(self):\n        return f\"{self.name} ({len(self.members)} members)\"\n\n    def __repr__(self):\n        return f\"Team({self.name!r}, {self.members!r})\"\n\n    def __eq__(self, other):\n        if not isinstance(other, Team):\n            return NotImplemented\n        return (self.name, self.members) == (other.name, other.members)\n\n    def __len__(self):\n        return len(self.members)" },
    w: "No `__hash__` here, deliberately: `members` is a list and can change, so a hash would go stale. A class that can change should usually not be hashable." } }
 ],
 k: [
  "A dunder method is one Python calls for you in response to ordinary syntax.",
  "`__str__` is for humans, `__repr__` is for programmers — and lists print with `__repr__`.",
  "Defining `__eq__` disables hashing; define `__hash__` too, and only for objects that never change.",
  "`@property` turns a method into a read-only attribute, which is why Python needs no getters."
 ],
 r: ["Duck Typing", "Polymorphism", "Class", "Abstraction"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "    def __str__(self):", w: "define what print should show for this object", hint: "two underscores each side" },
   { c: "        return f\"{self.title} by {self.artist}\"", w: "return a readable description built from two attributes" },
   { c: "    def __repr__(self):", w: "define what the REPL and a traceback should show" },
   { c: "    def __len__(self):", w: "make the built-in len work on your object" },
   { c: "        return (self.title, self.artist) == (other.title, other.artist)", w: "compare two objects field by field as tuples" },
   { c: "    @property", w: "mark the next method as accessible without parentheses" }
  ]
 }
},

{
 t: "Inheritance, and When Not To Use It",
 m: "oop",
 lvl: "intermediate",
 s: "Building one class on another — and the reason experienced engineers reach for it less than you would think.",
 goal: [
  "Write a subclass that extends rather than repeats its parent",
  "Use `super()` correctly and say what it does",
  "Choose composition over inheritance, and explain why"
 ],
 b: [
  { p: "**Inheritance** lets one class start from another: it gets all the parent's methods for free and can add or replace whatever it likes. It is the most-taught idea in object-oriented programming and, in modern practice, the most over-used." },

  { code: { lang: "python", file: "animals.py", t: "The mechanics",
    lines: [
     { c: "class Animal:", w: "**The parent**, also called the base or superclass." },
     { c: "    def __init__(self, name):", w: "" },
     { c: "        self.name = name" },
     { c: "", w: "" },
     { c: "    def speak(self):", w: "" },
     { c: "        return \"...\"" },
     { c: "", w: "" },
     { c: "    def describe(self):", w: "" },
     { c: "        return f\"{self.name} says {self.speak()}\"", w: "**Note `self.speak()`.** It calls whichever `speak` belongs to the actual object at runtime — so this one method works correctly for every subclass without knowing any of them exist." },
     { c: "", w: "" },
     { c: "class Dog(Animal):", w: "**The parent in brackets is the whole syntax.** `Dog` now has `__init__`, `speak` and `describe` without a line being written." },
     { c: "    def speak(self):", w: "**Overriding**: same name, so this replaces the parent's version for dogs." },
     { c: "        return \"Woof\"" },
     { c: "", w: "" },
     { c: "print(Dog(\"Rex\").describe())", w: "`describe` came from `Animal` and called `Dog`'s `speak`. That mechanism is **polymorphism**, and it is the actual payoff of inheritance." }
    ],
    out: "Rex says Woof" } },

  { h: "super()" },
  { code: { lang: "python", t: "Extending the parent instead of replacing it",
    lines: [
     { c: "class GuideDog(Dog):", w: "" },
     { c: "    def __init__(self, name, handler):", w: "" },
     { c: "        super().__init__(name)", w: "**`super()` means *the parent version of this*.** Run the parent's setup first, so `self.name` gets assigned, then add your own. Forget this line and `self.name` never exists." },
     { c: "        self.handler = handler", w: "The extra data this subclass adds." },
     { c: "", w: "" },
     { c: "    def describe(self):", w: "" },
     { c: "        base = super().describe()", w: "**Reuse the parent's work, then extend it.** This is what `super()` is genuinely for — not just in `__init__`." },
     { c: "        return f\"{base}, and works with {self.handler}\"" }
    ],
    out: "Rex says Woof, and works with Aryan" } },
  { trap: "Calling the parent by name — `Animal.__init__(self, name)` — works and is wrong. `super()` walks Python's method resolution order, which handles multiple inheritance and a class hierarchy that changes later. Hard-coding the parent's name breaks silently the moment someone inserts a class in between." },

  { h: "isinstance and the type question" },
  { code: { lang: "python",
    lines: [
     { c: "d = GuideDog(\"Rex\", \"Aryan\")", w: "" },
     { c: "print(isinstance(d, GuideDog))", w: "" },
     { c: "print(isinstance(d, Dog))", w: "**True — a subclass instance *is* an instance of every ancestor.** This is what makes it safe to hand a `GuideDog` to code expecting a `Dog`." },
     { c: "print(isinstance(d, Animal))", w: "True as well, all the way up." },
     { c: "print(type(d) is Dog)", w: "**False.** `type()` asks for the exact class, ignoring the hierarchy. Prefer `isinstance` — it is nearly always the question you actually meant." }
    ],
    out: "True\nTrue\nTrue\nFalse" } },

  { h: "The is-a test" },
  { p: "Inheritance is only correct when the subclass genuinely **is a** kind of the parent, and can be used anywhere the parent can without surprising anybody. If that is not true, the hierarchy will hurt you." },
  { vs: { t: "Two hierarchies, one of them a trap", lang: "python",
    bad: { c: "class Rectangle:\n    def set_width(self, w): ...\n    def set_height(self, h): ...\n\nclass Square(Rectangle):\n    def set_width(self, w):\n        self.w = self.h = w", label: "A square is a rectangle, surely",
      w: "Mathematically yes; as code, no. Any function that sets width and height independently and expects both to stick is now broken by a `Square`. This is the classic illustration of the *Liskov substitution principle* — a subclass must be usable wherever the parent is." },
    good: { c: "class Shape:\n    def area(self): ...\n\nclass Rectangle(Shape):\n    def area(self):\n        return self.w * self.h\n\nclass Square(Shape):\n    def area(self):\n        return self.side ** 2", label: "Siblings, not parent and child",
      w: "Both are shapes, neither pretends to be the other, and nothing can be broken by substitution." } } },

  { h: "Composition, and why to prefer it" },
  { p: "The alternative is to **hold** an object rather than **be** one. Instead of inheriting an ability, keep an object that has it." },
  { vs: { t: "Inheriting a capability versus owning one", lang: "python",
    bad: { c: "class Report(DatabaseConnection):\n    def generate(self):\n        rows = self.query(\"SELECT ...\")\n        return format(rows)", label: "Inheritance",
      w: "A report is not a kind of database connection. `Report` now exposes every method on the connection — `close()`, `commit()`, `rollback()` — to callers who should never see them, and it can only ever have one." },
    good: { c: "class Report:\n    def __init__(self, db):\n        self.db = db\n\n    def generate(self):\n        rows = self.db.query(\"SELECT ...\")\n        return format(rows)", label: "Composition",
      w: "The report *has* a connection. It exposes only `generate`, it can hold two connections if it ever needs to, and you can hand it a fake database in a test by passing a different object. Nothing about the class needs changing." } } },
  { n: "The industry rule of thumb is **prefer composition over inheritance**, and it is worth taking seriously. Inheritance couples two classes permanently: a change to the parent reaches every descendant, and a deep hierarchy means reading five files to understand one method. Composition is looser, more testable, and easier to change. Use inheritance when the *is-a* relationship is genuine and shallow. Reach for composition the rest of the time.",
    nt: "The rule worth remembering" },

  { h: "Abstract base classes" },
  { code: { lang: "python", t: "Declaring that subclasses must implement something",
    lines: [
     { c: "from abc import ABC, abstractmethod", w: "Standard library." },
     { c: "", w: "" },
     { c: "class Exporter(ABC):", w: "**`ABC` makes the class abstract** — it cannot be instantiated directly." },
     { c: "    @abstractmethod", w: "" },
     { c: "    def export(self, rows):", w: "**No body needed.** This declares the contract: every subclass must provide this method." },
     { c: "        ..." },
     { c: "", w: "" },
     { c: "class CsvExporter(Exporter):", w: "" },
     { c: "    def export(self, rows):", w: "Provide it, or instantiating `CsvExporter` raises `TypeError` — **at creation time**, not when the missing method is eventually called." },
     { c: "        ..." }
    ],
    after: "This is Python's nearest thing to an interface. Reach for it when several classes must be interchangeable and you want the failure to be loud and early rather than a mysterious `AttributeError` in production." } },

  { tryit: { t: "Refactor away from inheritance",
    task: "You have `class EmailNotifier(SmtpClient)` with a `send(user, message)` method that calls `self.connect()` and `self.send_mail(...)`. Rewrite it using composition and say what you gained.",
    hint: "Take the SMTP client as a constructor argument and store it.",
    sol: { lang: "python", code: "class EmailNotifier:\n    def __init__(self, client):\n        self.client = client\n\n    def send(self, user, message):\n        self.client.connect()\n        self.client.send_mail(user.email, message)\n\n# real use\nnotifier = EmailNotifier(SmtpClient(host=\"smtp.example.com\"))\n\n# in a test, with no network at all\nnotifier = EmailNotifier(FakeClient())" },
    w: "The last two lines are the gain. With inheritance the SMTP client was welded in and the class could not be tested without a mail server. With composition, swapping it is one argument." } }
 ],
 k: [
  "`class Child(Parent):` inherits everything; redefining a method overrides it.",
  "`super()` calls the parent version — use it rather than naming the parent class.",
  "Inheritance is only right when the subclass can be used anywhere the parent can.",
  "Prefer composition: holding an object is looser, more testable and easier to change than being one."
 ],
 r: ["Inheritance", "Polymorphism", "Composition over Inheritance", "SOLID Principles"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "class Dog(Animal):", w: "define a class that inherits from Animal" },
   { c: "        super().__init__(name)", w: "run the parent's setup before adding your own" },
   { c: "        base = super().describe()", w: "reuse the parent's version of a method you are extending" },
   { c: "print(isinstance(d, Animal))", w: "check an object is an instance of a class or any of its ancestors" },
   { c: "    def __init__(self, client):\n        self.client = client", w: "the composition pattern: take a collaborator in and hold it", hint: "two lines" }
  ]
 }
},

{
 t: "Dataclasses — Classes Without the Boilerplate",
 m: "oop",
 lvl: "intermediate",
 s: "One decorator that writes `__init__`, `__repr__` and `__eq__` for you.",
 goal: [
  "Replace a data-holding class with a dataclass",
  "Set defaults safely, including for lists",
  "Choose between a dataclass, a dictionary and a NamedTuple"
 ],
 b: [
  { p: "Most classes in real code exist mainly to hold data. Writing `__init__`, `__repr__` and `__eq__` by hand for each one is tedious, and every one is a chance to mistype a field name. Since Python 3.7 the standard library writes them for you." },

  { vs: { t: "The same class, twice", lang: "python",
    bad: { c: "class Point:\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y\n\n    def __repr__(self):\n        return f\"Point(x={self.x}, y={self.y})\"\n\n    def __eq__(self, other):\n        if not isinstance(other, Point):\n            return NotImplemented\n        return (self.x, self.y) == (other.x, other.y)", label: "By hand",
      w: "Fourteen lines carrying two facts. Every field name appears four times, and adding a `z` means editing three methods." },
    good: { c: "from dataclasses import dataclass\n\n@dataclass\nclass Point:\n    x: float\n    y: float", label: "A dataclass",
      w: "Identical behaviour. `__init__`, `__repr__` and `__eq__` are all generated from those two lines. Adding `z: float = 0` is one line and everything updates." } } },

  { syn: { t: "The field declaration",
    parts: [
     { p: "x", w: "**The field name.** It becomes an `__init__` parameter and an instance attribute, in the order written." },
     { p: ": ", w: "The annotation separator." },
     { p: "float", w: "**A type hint, and it is required here** — a bare `x` with no annotation is not treated as a field at all, and is silently ignored. This is the one gotcha. Note that Python does not *enforce* the type; it is documentation that tools read." },
     { p: " = ", w: "Optional." },
     { p: "0.0", w: "**A default**, which makes the field optional. As with functions, fields with defaults must come after fields without." }
    ] } },

  { code: { lang: "python", t: "What you get for free",
    lines: [
     { c: "from dataclasses import dataclass, field", w: "" },
     { c: "", w: "" },
     { c: "@dataclass", w: "" },
     { c: "class Song:", w: "" },
     { c: "    title: str", w: "Required." },
     { c: "    artist: str", w: "Required." },
     { c: "    year: int = 0", w: "Optional, defaults to 0." },
     { c: "    tags: list[str] = field(default_factory=list)", w: "**The mutable-default rule, solved properly.** `= []` here raises an error at class creation — the dataclass refuses to let you make that mistake. `default_factory=list` calls `list()` once **per instance**, so every song gets its own." },
     { c: "", w: "" },
     { c: "s = Song(\"Blue Train\", \"Coltrane\", 1957)", w: "`__init__` was generated." },
     { c: "print(s)", w: "`__repr__` was generated, and it is readable." },
     { c: "print(s == Song(\"Blue Train\", \"Coltrane\", 1957))", w: "`__eq__` was generated, comparing all fields." }
    ],
    out: "Song(title='Blue Train', artist='Coltrane', year=1957, tags=[])\nTrue" } },
  { n: "Python catching `= []` on a dataclass field is a rare and pleasant thing: a language taking a famous footgun and making it impossible rather than merely documented. `field(default_factory=...)` works for `dict` and `set` too, and for any function producing a fresh default.",
    nt: "A footgun closed off" },

  { h: "The options worth knowing" },
  { code: { lang: "python",
    lines: [
     { c: "@dataclass(frozen=True)", w: "**Makes instances immutable.** Assigning to a field afterwards raises, and Python generates `__hash__` — so the object works as a dictionary key or in a set. Excellent for values that represent a fact rather than a thing that changes." },
     { c: "class Point:", w: "" },
     { c: "    x: float" },
     { c: "    y: float" },
     { c: "", w: "" },
     { c: "@dataclass(order=True)", w: "**Generates `<`, `<=`, `>`, `>=`**, comparing fields in declaration order. Instances become sortable with no `key=` needed." },
     { c: "class Version:", w: "" },
     { c: "    major: int", w: "Compared first..." },
     { c: "    minor: int", w: "...then this, only when majors are equal. Exactly how tuple comparison works, because that is what it uses." },
     { c: "", w: "" },
     { c: "@dataclass(slots=True)", w: "**Cuts memory and speeds attribute access** by removing each instance's internal dictionary. Worth adding when you have millions of instances; irrelevant otherwise." }
    ] } },

  { h: "Methods still work normally" },
  { code: { lang: "python",
    lines: [
     { c: "@dataclass", w: "" },
     { c: "class Rectangle:", w: "" },
     { c: "    width: float" },
     { c: "    height: float" },
     { c: "", w: "" },
     { c: "    def area(self):", w: "**A dataclass is an ordinary class.** The decorator only adds the boilerplate; everything else you know still applies." },
     { c: "        return self.width * self.height" },
     { c: "", w: "" },
     { c: "    def __post_init__(self):", w: "**Runs immediately after the generated `__init__`** — the hook for validation or derived fields." },
     { c: "        if self.width <= 0 or self.height <= 0:" },
     { c: "            raise ValueError(\"dimensions must be positive\")" }
    ] } },

  { h: "Choosing" },
  { tbl: { h: ["Use", "When", "Watch out for"],
    rows: [
     ["**dict**", "Data whose shape you do not control — parsed JSON, a CSV row", "No autocomplete, and a typo in a key is a runtime `KeyError`"],
     ["**dataclass**", "**The default for your own structured data**", "Types are documentation, not enforcement"],
     ["**frozen dataclass**", "A value that should never change; needs to be a dict key", "Any change means making a new one"],
     ["**NamedTuple**", "A small fixed record that should behave like a tuple and unpack", "Immutable, and awkward once it needs methods"],
     ["**plain class**", "Behaviour dominates and the data is incidental", "You are writing the boilerplate by hand"]
    ] } },

  { code: { lang: "python", t: "The functions that come with it",
    lines: [
     { c: "from dataclasses import asdict, astuple, replace", w: "" },
     { c: "", w: "" },
     { c: "print(asdict(s))", w: "**Converts to a dictionary, recursively** — including nested dataclasses. This is how a dataclass becomes JSON in one step." },
     { c: "print(astuple(s))", w: "The same as a tuple." },
     { c: "s2 = replace(s, year=1958)", w: "**A copy with one field changed.** Essential for frozen dataclasses, where you cannot assign — and a clean pattern even when you can." }
    ] } },

  { tryit: { t: "Model a small domain",
    task: "Write a frozen `Money` dataclass with `amount` and `currency`, comparable and usable as a dictionary key, that raises if the amount is negative. Then write an `Order` dataclass holding an id and a list of `Money` lines, with a `total()` method.",
    hint: "`frozen=True` plus `__post_init__` for the validation, and `field(default_factory=list)` for the lines.",
    sol: { lang: "python", code: "from dataclasses import dataclass, field\n\n@dataclass(frozen=True, order=True)\nclass Money:\n    amount: float\n    currency: str = \"INR\"\n\n    def __post_init__(self):\n        if self.amount < 0:\n            raise ValueError(f\"amount cannot be negative: {self.amount}\")\n\n@dataclass\nclass Order:\n    order_id: str\n    lines: list[Money] = field(default_factory=list)\n\n    def total(self):\n        return sum(m.amount for m in self.lines)\n\no = Order(\"A-1\", [Money(100), Money(250)])\nprint(o.total())" },
    w: "`__post_init__` runs even on a frozen dataclass, because it fires before the instance is sealed. That makes frozen dataclasses genuinely good at representing validated values." } }
 ],
 k: [
  "`@dataclass` generates `__init__`, `__repr__` and `__eq__` from annotated fields.",
  "A field needs a type annotation or it is silently ignored; use `field(default_factory=list)` for mutable defaults.",
  "`frozen=True` makes instances immutable and hashable; `order=True` makes them sortable.",
  "`asdict()` converts recursively to a dictionary, and `replace()` makes a copy with one field changed."
 ],
 r: ["Immutability", "Type Hint", "Boilerplate", "Encapsulation"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "from dataclasses import dataclass, field", w: "import the decorator and the field helper" },
   { c: "@dataclass", w: "mark the class below as a dataclass" },
   { c: "    year: int = 0", w: "declare an optional integer field defaulting to zero" },
   { c: "    tags: list[str] = field(default_factory=list)", w: "declare a list field that is fresh for every instance", hint: "not = []" },
   { c: "@dataclass(frozen=True)", w: "make a dataclass immutable and hashable" },
   { c: "    def __post_init__(self):", w: "add a hook that validates right after construction" }
  ]
 }
}

]);
