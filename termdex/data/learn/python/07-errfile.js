/* Python — errors and files. */
TD.addLessons("python", [

{
 t: "Handling Errors on Purpose",
 m: "errfile",
 lvl: "core",
 s: "try, except, and the difference between a program that crashes and one that copes.",
 goal: [
  "Catch a specific failure and carry on",
  "Explain why catching every exception is worse than catching none",
  "Raise your own error when the caller has given you something impossible"
 ],
 b: [
  { p: "Ground Zero taught you to read an error. This lesson is the other half: deciding, in advance, what your program should do when one happens." },
  { p: "The key reframe is that an **exception is not a bug**. A file that does not exist, a network that is down, a user who typed `thirty` — none of these are mistakes in your code. They are situations, and a program that handles them is finished software while one that crashes on them is a prototype." },

  { syn: { t: "The basic shape",
    parts: [
     { p: "try", w: "**Attempt this.** Everything in the indented block below runs normally until something goes wrong." },
     { p: ":" },
     { p: "  …  " },
     { p: "except", w: "**If it goes wrong, come here.** Execution jumps here the instant an exception is raised — the rest of the `try` block is abandoned." },
     { p: " " },
     { p: "ValueError", w: "**Which failure you are prepared for.** Naming the type matters enormously; the next section is about why." },
     { p: " as ", w: "Optional. Binds the exception object to a name so you can inspect it." },
     { p: "err", w: "The exception itself. `str(err)` gives the message Python would have printed." },
     { p: ":" }
    ] } },

  { code: { lang: "python", t: "The classic case: input that is not a number",
    lines: [
     { c: "try:", w: "" },
     { c: "    age = int(input(\"Your age? \"))", w: "This is the risky line. If they type `thirty`, `int()` raises `ValueError` here and everything below in this block is skipped." },
     { c: "    print(f\"Next year you are {age + 1}\")", w: "Only runs when the conversion succeeded." },
     { c: "except ValueError:", w: "**Catches only `ValueError`.** A different kind of failure would not be caught here — which is exactly what you want." },
     { c: "    print(\"That is not a whole number.\")", w: "Handle it. The program keeps running." }
    ],
    out: "Your age? thirty\nThat is not a whole number." } },

  { h: "Catch the failure you expected, and nothing else" },
  { vs: { t: "The single most damaging habit in Python", lang: "python",
    bad: { c: "try:\n    data = load(path)\n    result = analyse(data)\n    save(result)\nexcept:\n    print(\"Something went wrong\")", label: "A bare except",
      w: "This swallows **everything** — a typo in a variable name, a missing import, even `Ctrl+C`. Your program keeps going with no data and no idea why, and the traceback that would have told you exactly what happened is destroyed. Debugging this is genuinely miserable." },
    good: { c: "try:\n    data = load(path)\nexcept FileNotFoundError:\n    print(f\"No file at {path}\")\n    return\n\nresult = analyse(data)\nsave(result)", label: "One risky line, one named failure",
      w: "The `try` wraps only the line that can fail, and catches only the failure you actually anticipated. Anything else still crashes loudly — which is correct, because anything else is a bug you need to see." } } },
  { n: "The rule, and it is close to absolute: **keep the `try` block as small as possible, and always name the exception.** A wide `try` hides which line failed. A bare `except` hides *what* failed. Both trade a clear five-minute fix for a vague afternoon.",
    nt: "Small block, named exception" },

  { h: "Several kinds of failure" },
  { code: { lang: "python",
    lines: [
     { c: "try:", w: "" },
     { c: "    value = data[key] / divisor", w: "Two different things can go wrong on one line." },
     { c: "except KeyError:", w: "The key is not in the dictionary." },
     { c: "    print(f\"No such key: {key}\")" },
     { c: "except ZeroDivisionError:", w: "**Checked in order, and only one runs** — the same top-to-bottom, first-match rule as `if`/`elif`." },
     { c: "    print(\"Cannot divide by zero\")" },
     { c: "except (TypeError, ValueError) as err:", w: "**A tuple catches several types in one block** when the response is the same for all of them." },
     { c: "    print(f\"Bad data: {err}\")" }
    ] } },

  { h: "else and finally" },
  { code: { lang: "python", t: "The two clauses most people never learn",
    lines: [
     { c: "try:", w: "" },
     { c: "    f = open(\"data.csv\")", w: "Keep only the risky line here." },
     { c: "except FileNotFoundError:", w: "" },
     { c: "    print(\"Missing file\")" },
     { c: "else:", w: "**Runs only if the `try` block raised nothing.** It is where the *rest* of the happy path belongs — outside the `try`, so a failure in here is not accidentally caught by the `except` above." },
     { c: "    print(f.read())" },
     { c: "finally:", w: "**Runs no matter what** — success, handled failure, unhandled failure on its way out. This is for cleanup: closing files, releasing locks, disconnecting." },
     { c: "    print(\"done\")" }
    ] } },
  { p: "`else` exists to keep the `try` block honest. Without it, people put the whole happy path inside `try`, and then a `ValueError` raised twenty lines down gets caught by an `except` written for a completely different line." },

  { h: "Raising your own" },
  { code: { lang: "python",
    lines: [
     { c: "def set_age(age):", w: "" },
     { c: "    if not isinstance(age, int):", w: "`isinstance` asks whether a value is of a given type." },
     { c: "        raise TypeError(f\"age must be a whole number, got {type(age).__name__}\")", w: "**`raise` creates and throws an exception.** The message should say what was expected *and* what arrived — a message that only says \"invalid input\" wastes the reader's time." },
     { c: "    if age < 0 or age > 130:", w: "" },
     { c: "        raise ValueError(f\"age {age} is outside 0–130\")", w: "**`TypeError` for the wrong kind of thing, `ValueError` for the right kind with an impossible value.** That distinction is a convention every Python programmer expects." },
     { c: "    return age" }
    ] } },
  { p: "Raising early is a kindness. A function that rejects bad input immediately produces an error pointing at the caller who made the mistake. A function that quietly accepts it produces a confusing failure three hundred lines later, in code that did nothing wrong." },

  { h: "The exceptions worth knowing by name" },
  { tbl: { h: ["Exception", "Raised when"],
    rows: [
     ["`ValueError`", "Right type, impossible value — `int(\"abc\")`"],
     ["`TypeError`", "Wrong type entirely — `\"5\" + 1`"],
     ["`KeyError`", "A dictionary key does not exist"],
     ["`IndexError`", "A list position does not exist"],
     ["`FileNotFoundError`", "The path is not there"],
     ["`PermissionError`", "It is there and you are not allowed"],
     ["`ZeroDivisionError`", "Division or modulo by zero"],
     ["`AttributeError`", "No such attribute — very often *you have a `None`*"],
     ["`ImportError` / `ModuleNotFoundError`", "An import failed"]
    ] } },

  { trap: "`except Exception:` is narrower than a bare `except:` — it does not swallow `KeyboardInterrupt` — but it still catches almost everything and is nearly as damaging. If you genuinely need a catch-all at the top level of a program, always log the exception (`except Exception as err:` then record `err`) so the information is not simply destroyed." },

  { tryit: { t: "Make a robust reader",
    task: "Write `read_number(prompt)` that keeps asking until the user types a valid number, then returns it as a float. It should never crash, and `Ctrl+C` should still work.",
    hint: "A `while True:` loop with `try`/`except ValueError`, and `return` on success. Catch only `ValueError` — that is what keeps `Ctrl+C` working.",
    sol: { lang: "python", code: "def read_number(prompt):\n    while True:\n        try:\n            return float(input(prompt))\n        except ValueError:\n            print(\"Please type a number, like 3 or 3.5\")\n\nage = read_number(\"Your age? \")" },
    w: "`return` sits inside the `try` and is reached only when `float()` succeeded — so success exits the loop and failure falls through to the message and goes round again. Small block, named exception, no flags." } }
 ],
 k: [
  "An exception is a situation, not a bug — files go missing and users type nonsense.",
  "Keep the `try` block to the risky line and always name the exception you expect.",
  "`else` holds the rest of the happy path; `finally` runs no matter what.",
  "`raise TypeError` for the wrong kind of thing, `raise ValueError` for an impossible value."
 ],
 r: ["Exception", "Exception Handling", "Stack Trace", "Graceful Degradation"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "try:", w: "open a block of code that might fail" },
   { c: "except ValueError:", w: "catch only the failure that a bad conversion raises" },
   { c: "except (TypeError, ValueError) as err:", w: "catch two exception types and keep the exception object" },
   { c: "raise ValueError(f\"age {age} is outside 0-130\")", w: "throw your own error with a message naming the bad value" },
   { c: "finally:", w: "the clause that runs whatever happens" }
  ]
 }
},

{
 t: "Reading and Writing Files",
 m: "errfile",
 lvl: "core",
 s: "Getting data off the disk and back onto it — and the one line that stops you losing it.",
 goal: [
  "Read a file into your program, line by line or all at once",
  "Write results back out without destroying what was there",
  "Explain what `with` does and why every example uses it"
 ],
 b: [
  { p: "Everything so far has lived and died inside one run. Files are how a program remembers — and how it gets real data in the first place." },

  { h: "The shape you will always write" },
  { syn: { t: "Opening a file properly",
    parts: [
     { p: "with ", w: "**A context manager.** It guarantees that whatever it opened gets closed again — when the block ends normally, when you `return` out of it, and even when an exception is thrown. This is why every example uses it." },
     { p: "open(", w: "The built-in that actually opens the file and hands back a file object." },
     { p: "\"data.txt\"", w: "The path. A **relative** path is resolved against the current working directory, not the folder your script lives in — the Ground Zero lesson that catches everyone." },
     { p: ", " },
     { p: "\"r\"", w: "**The mode.** `r` read, `w` write (destroys existing contents), `a` append, and add `b` for binary. Default is `\"r\"`." },
     { p: ", encoding=\"utf-8\"", w: "**Always set this.** Without it Python uses whatever the operating system prefers, so a file that reads fine on your Mac produces mojibake on a colleague's Windows machine. `utf-8` is the correct answer essentially always." },
     { p: ")" },
     { p: " as ", w: "" },
     { p: "f", w: "The name for the open file inside the block." },
     { p: ":" }
    ] } },

  { code: { lang: "python", t: "Three ways to read, and when each is right",
    lines: [
     { c: "with open(\"notes.txt\", encoding=\"utf-8\") as f:", w: "" },
     { c: "    text = f.read()", w: "**Everything, as one string.** Simple, and it loads the whole file into memory — fine for a config file, catastrophic for a 10 GB log." },
     { c: "", w: "" },
     { c: "with open(\"notes.txt\", encoding=\"utf-8\") as f:", w: "" },
     { c: "    lines = f.readlines()", w: "**A list of lines**, each still carrying its trailing `\\n`. Also loads everything." },
     { c: "", w: "" },
     { c: "with open(\"notes.txt\", encoding=\"utf-8\") as f:", w: "" },
     { c: "    for line in f:", w: "**One line at a time, lazily.** The file object is an iterator, so this reads only what it needs and works on a file larger than your memory. **This is the one to reach for by default.**", hi: true },
     { c: "        print(line.rstrip())", w: "`rstrip()` removes the trailing newline — without it every `print` produces a blank line, because you print the file's newline *and* `print` adds its own." }
    ] } },
  { trap: "Forgetting `.rstrip()` gives you double-spaced output and, worse, comparisons that silently fail: `line == \"done\"` is `False` when the line is actually `\"done\\n\"`. Strip every line you read before you compare it to anything." },

  { h: "Writing" },
  { code: { lang: "python",
    lines: [
     { c: "with open(\"out.txt\", \"w\", encoding=\"utf-8\") as f:", w: "**`\"w\"` truncates the file to zero bytes the moment it opens** — before you write anything. Point it at the wrong path and the contents are gone, with no warning and no undo." },
     { c: "    f.write(\"first line\\n\")", w: "**`write` does not add a newline.** Unlike `print`, you supply every `\\n` yourself." },
     { c: "    f.write(\"second line\\n\")" },
     { c: "", w: "" },
     { c: "with open(\"log.txt\", \"a\", encoding=\"utf-8\") as f:", w: "**`\"a\"` appends** — existing contents are kept and everything you write lands at the end. This is what a log wants." },
     { c: "    f.write(\"appended\\n\")" },
     { c: "", w: "" },
     { c: "with open(\"out.txt\", \"w\", encoding=\"utf-8\") as f:", w: "" },
     { c: "    f.writelines(f\"{n}\\n\" for n in range(3))", w: "**`writelines` takes an iterable** and writes each item. Still no newlines added — the f-string supplies them." }
    ] } },

  { tbl: { t: "The modes",
    h: ["Mode", "Reads", "Writes", "If the file exists", "If it does not"],
    rows: [
     ["`r`", "Yes", "No", "Opens it", "`FileNotFoundError`"],
     ["`w`", "No", "Yes", "**Empties it**", "Creates it"],
     ["`a`", "No", "Yes", "Appends to the end", "Creates it"],
     ["`x`", "No", "Yes", "**`FileExistsError`**", "Creates it"],
     ["`r+`", "Yes", "Yes", "Opens it, keeps contents", "`FileNotFoundError`"]
    ] } },
  { n: "`\"x\"` is the mode nobody uses and probably should. It creates the file *only* if it does not already exist, which means an accidental overwrite becomes an error you can see instead of data you have lost.",
    nt: "The safe write mode" },

  { h: "Why with, specifically" },
  { vs: { t: "The same read, with and without", lang: "python",
    bad: { c: "f = open(\"data.txt\")\ndata = f.read()\nprocess(data)\nf.close()", label: "Manual close",
      w: "If `process(data)` raises, `f.close()` never runs. The file stays open, holding an operating-system handle. Do that in a loop over ten thousand files and you exhaust the process's handles and everything fails in a way that looks unrelated." },
    good: { c: "with open(\"data.txt\", encoding=\"utf-8\") as f:\n    data = f.read()\n\nprocess(data)", label: "with",
      w: "The file is closed the moment the block ends, however it ends. Note also that `process` sits **outside** the block — the file is not needed any more, so it should not still be open." } } },
  { p: "`with` is not file-specific. It works with anything that defines the context-manager protocol: database connections, locks, network sessions, timers. Whenever a library gives you something that must be released, it will almost certainly support `with`." },

  { h: "Paths, done properly" },
  { code: { lang: "python", t: "pathlib, which has replaced string paths in modern Python",
    lines: [
     { c: "from pathlib import Path", w: "Standard library, no install needed." },
     { c: "", w: "" },
     { c: "here = Path(__file__).parent", w: "**`__file__` is this source file's own path**, so `.parent` is the folder the script lives in — regardless of where it was launched from. This is the real fix for the relative-path problem from Ground Zero." },
     { c: "data_file = here / \"data\" / \"scores.csv\"", w: "**`/` joins path segments** and produces the right separator on every operating system. Far better than gluing strings with backslashes." },
     { c: "", w: "" },
     { c: "if data_file.exists():", w: "Ask before opening, when absence is normal." },
     { c: "    text = data_file.read_text(encoding=\"utf-8\")", w: "`Path` can read and write directly for small files — no `open`, no `with`." },
     { c: "", w: "" },
     { c: "for csv_path in here.glob(\"*.csv\"):", w: "**`glob` finds files by pattern.** `rglob` searches subfolders too. This is how you process a folder of data files." },
     { c: "    print(csv_path.name)", w: "`.name` is the filename, `.stem` drops the extension, `.suffix` is just the extension." }
    ] } },

  { tryit: { t: "Count the words in a file",
    task: "Read a text file line by line and print the five most common words, lowercased and stripped of punctuation. Handle the file being missing.",
    hint: "The counting dictionary idiom from the data module, plus `collections.Counter` which has a `.most_common(5)`.",
    sol: { lang: "python", code: "from collections import Counter\nfrom pathlib import Path\n\npath = Path(\"notes.txt\")\ncounts = Counter()\n\ntry:\n    with path.open(encoding=\"utf-8\") as f:\n        for line in f:\n            for word in line.lower().split():\n                counts[word.strip(\".,!?;:\\\"'\")] += 1\nexcept FileNotFoundError:\n    print(f\"No file at {path}\")\nelse:\n    for word, n in counts.most_common(5):\n        print(f\"{n:>4}  {word}\")" },
    w: "Line-by-line so it works on a file of any size, `try`/`except` around only the opening, and the happy path in `else`. Every rule from the last two lessons, in one small program." } }
 ],
 k: [
  "Always use `with open(...)` — it closes the file even when something throws.",
  "Always pass `encoding=\"utf-8\"`, or your code breaks on someone else's machine.",
  "`\"w\"` empties the file the instant it opens; `\"a\"` appends; `\"x\"` refuses to overwrite.",
  "Iterate the file object to read lazily, and use `pathlib` with `Path(__file__).parent` for paths."
 ],
 r: ["File System", "File Path", "Encoding", "Standard Library"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "with open(\"data.txt\", encoding=\"utf-8\") as f:", w: "open a file for reading, safely, with an explicit encoding" },
   { c: "    for line in f:", w: "read the file one line at a time instead of all at once", hint: "indented inside the with" },
   { c: "        print(line.rstrip())", w: "print a line without its trailing newline" },
   { c: "with open(\"log.txt\", \"a\", encoding=\"utf-8\") as f:", w: "open a file to add to the end without destroying it" },
   { c: "from pathlib import Path", w: "import the modern path type" },
   { c: "here = Path(__file__).parent", w: "get the folder this source file lives in" }
  ]
 }
},

{
 t: "CSV and JSON — Real Data Formats",
 m: "errfile",
 lvl: "core",
 s: "The two formats almost all data arrives in, and why you should not parse either by hand.",
 goal: [
  "Read and write a CSV without splitting on commas yourself",
  "Convert between JSON text and Python dictionaries",
  "Say which format is right for which job"
 ],
 b: [
  { p: "Data does not arrive as Python. It arrives as a file, and nine times out of ten that file is CSV or JSON. Both are plain text, both look easy to parse by hand, and one of them will punish you for trying." },

  { h: "CSV" },
  { p: "**Comma-Separated Values**: one row per line, fields separated by commas, usually a header row of column names. About as simple as a format can be, which is why it is everywhere — every spreadsheet, database and reporting tool exports it." },

  { vs: { t: "Why not to split on commas", lang: "python",
    bad: { c: "for line in f:\n    fields = line.strip().split(\",\")", label: "Works until it does not",
      w: "A field containing a comma is quoted: `\"Mumbai, India\"`. Splitting blindly turns one field into two and every column after it shifts. A field containing a newline inside quotes breaks it completely. This bug appears in production, on real data, months later." },
    good: { c: "import csv\n\nwith open(path, newline=\"\", encoding=\"utf-8\") as f:\n    for row in csv.reader(f):\n        ...", label: "The csv module",
      w: "Handles quoting, embedded commas, embedded newlines and escaped quotes — the whole specification. It is in the standard library and costs one import." } } },

  { code: { lang: "python", file: "read_csv.py", t: "Reading, the way you will actually want it",
    lines: [
     { c: "import csv", w: "" },
     { c: "", w: "" },
     { c: "with open(\"scores.csv\", newline=\"\", encoding=\"utf-8\") as f:", w: "**`newline=\"\"` is required by the csv module**, not optional. It stops Python translating line endings before csv sees them, which would corrupt fields containing newlines." },
     { c: "    reader = csv.DictReader(f)", w: "**`DictReader` uses the header row as keys**, so each row arrives as a dictionary. Far better than `csv.reader`, which gives you lists and forces you to remember that column 3 is the score." },
     { c: "", w: "" },
     { c: "    for row in reader:", w: "One row at a time — lazy, so file size does not matter." },
     { c: "        name = row[\"name\"]", w: "Access by column name. If the file's columns get reordered tomorrow, this still works." },
     { c: "        score = int(row[\"score\"])", w: "**Everything from a CSV is a string.** A CSV has no types — `42` and `\"42\"` are indistinguishable in the file. Convert at the point of reading, exactly as with `input()`." }
    ] } },

  { code: { lang: "python", t: "Writing",
    lines: [
     { c: "rows = [{\"name\": \"Aryan\", \"score\": 91}, {\"name\": \"Sam\", \"score\": 78}]", w: "" },
     { c: "", w: "" },
     { c: "with open(\"out.csv\", \"w\", newline=\"\", encoding=\"utf-8\") as f:", w: "`\"w\"`, `newline=\"\"`, `utf-8` — the same three every time." },
     { c: "    writer = csv.DictWriter(f, fieldnames=[\"name\", \"score\"])", w: "**`fieldnames` fixes the column order** and is required. A dictionary key missing from this list raises rather than being silently dropped." },
     { c: "    writer.writeheader()", w: "Writes the header row. Easy to forget, and a headerless CSV is a small act of hostility." },
     { c: "    writer.writerows(rows)", w: "`writerows` for many, `writerow` for one." }
    ] } },
  { n: "Once you reach the pandas module, `pd.read_csv(path)` replaces almost all of this in one line, and does type inference too. Learn the `csv` module anyway: it is the right tool for streaming a file too large for memory, for one-off scripts where importing pandas is overkill, and for understanding what pandas is doing for you.",
    nt: "You will not use this forever" },

  { h: "JSON" },
  { p: "**JavaScript Object Notation**: nested key–value data, and the format essentially every web API speaks. Unlike CSV it has types — strings, numbers, booleans, null, arrays and objects — and it nests, which CSV cannot do at all." },
  { p: "It maps almost exactly onto Python's own types, which is what makes it pleasant to work with." },

  { tbl: { t: "JSON to Python, and back",
    h: ["JSON", "Python"],
    rows: [
     ["object `{ }`", "`dict`"],
     ["array `[ ]`", "`list`"],
     ["string", "`str`"],
     ["number", "`int` or `float`"],
     ["`true` / `false`", "`True` / `False`"],
     ["`null`", "`None`"]
    ] } },

  { code: { lang: "python", t: "The four functions, and the letter that distinguishes them",
    lines: [
     { c: "import json", w: "" },
     { c: "", w: "" },
     { c: "with open(\"config.json\", encoding=\"utf-8\") as f:", w: "" },
     { c: "    config = json.load(f)", w: "**`load` reads from a file object.** The result is an ordinary Python dictionary." },
     { c: "", w: "" },
     { c: "text = '{\"name\": \"Aryan\", \"tags\": [\"py\"]}'", w: "JSON that arrived as a string — from an API, say." },
     { c: "data = json.loads(text)", w: "**`loads` — the `s` means *string*.** That single letter is the whole difference between the two, and it catches everyone at least once." },
     { c: "", w: "" },
     { c: "with open(\"out.json\", \"w\", encoding=\"utf-8\") as f:", w: "" },
     { c: "    json.dump(config, f, indent=2)", w: "**`dump` writes to a file.** `indent=2` pretty-prints it — without it everything lands on one enormous line, which is unreadable and produces a useless Git diff." },
     { c: "", w: "" },
     { c: "print(json.dumps(config, indent=2))", w: "**`dumps` returns a string** instead of writing. Genuinely the best way to inspect a nested structure while debugging." }
    ] } },

  { trap: "JSON requires **double quotes** and forbids a trailing comma. `{'name': 'Aryan'}` is valid Python and invalid JSON, and `{\"a\": 1,}` is invalid too. When `json.loads` raises `JSONDecodeError`, it tells you the exact character position — look there first, and it is usually a single quote or a stray comma." },

  { code: { lang: "python", t: "Reaching into nested JSON",
    lines: [
     { c: "data = json.loads(response_text)", w: "An API reply, now an ordinary dictionary." },
     { c: "", w: "" },
     { c: "name = data[\"user\"][\"profile\"][\"name\"]", w: "Each bracket steps one level in. Crashes with `KeyError` if any level is missing — which, with data from someone else's server, is a matter of when rather than if." },
     { c: "", w: "" },
     { c: "name = data.get(\"user\", {}).get(\"profile\", {}).get(\"name\")", w: "**Defaulting to an empty dictionary at each level** means a missing key gives `None` instead of a crash. Ugly, and the standard defensive move for data you did not produce." }
    ] } },

  { tbl: { t: "Which format for which job",
    h: ["", "CSV", "JSON"],
    rows: [
     ["Shape", "A flat table, rows and columns", "Nested, arbitrarily deep"],
     ["Types", "None — everything is text", "Strings, numbers, booleans, null"],
     ["Size", "Compact", "Repeats every key on every record"],
     ["Streamable", "Yes, line by line", "Usually not — it must be parsed whole"],
     ["Use it for", "Tabular data, exports, anything spreadsheet-shaped", "APIs, configuration, anything nested"]
    ] } },

  { tryit: { t: "Convert one to the other",
    task: "Read `people.csv` with columns `name,age,city` and write `people.json` as a list of objects, with age stored as a number rather than a string.",
    hint: "`DictReader` gives you a dictionary per row already — you just need to fix the type of one field and collect them into a list.",
    sol: { lang: "python", code: "import csv, json\n\npeople = []\nwith open(\"people.csv\", newline=\"\", encoding=\"utf-8\") as f:\n    for row in csv.DictReader(f):\n        row[\"age\"] = int(row[\"age\"])\n        people.append(row)\n\nwith open(\"people.json\", \"w\", encoding=\"utf-8\") as f:\n    json.dump(people, f, indent=2)" },
    w: "The `int()` conversion is the whole point of the exercise. CSV loses types on the way out and JSON keeps them, so the conversion has to happen in the middle — in your code." } }
 ],
 k: [
  "Never split CSV lines on commas yourself; `csv.DictReader` handles quoting and gives you dictionaries.",
  "Open CSV files with `newline=\"\"` — the module requires it.",
  "Everything read from a CSV is a string; JSON preserves types.",
  "`load`/`dump` work on files, `loads`/`dumps` on strings — the `s` is for string."
 ],
 r: ["JSON", "Serialisation", "Data Type", "API"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "import csv", w: "bring in the module that parses comma-separated files" },
   { c: "reader = csv.DictReader(f)", w: "read a CSV so each row arrives as a dictionary keyed by column name" },
   { c: "with open(path, newline=\"\", encoding=\"utf-8\") as f:", w: "open a CSV file with the two settings the csv module needs" },
   { c: "data = json.loads(text)", w: "turn a JSON string into Python data", hint: "the s means string" },
   { c: "json.dump(config, f, indent=2)", w: "write Python data to a file as readable, indented JSON" },
   { c: "print(json.dumps(config, indent=2))", w: "pretty-print a nested structure while debugging" }
  ]
 }
}

]);
