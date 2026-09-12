/* Ground Zero and Programming Basics — question banks.

   These two tracks had no questions at all, which is backwards: they are the
   tracks a complete beginner spends their first six weeks in, and the point
   where a misunderstanding does the most damage later.

   Questions are written to catch the specific confusions that stall people in
   month two -- what a path is, what an error message means, why a variable is
   not an equation -- rather than to test vocabulary. */

/* ===================================================================
   Ground Zero
   =================================================================== */

TD.addMCQ("zero", "machine", [
  {
    "tag": "What running a program means",
    "lvl": "core",
    "q": "You double-click a program and it opens. What has the operating system actually done?",
    "o": [
      "Displayed a file that was already running in the background",
      "Loaded the program's instructions from disk into memory and told the CPU to start executing them",
      "Compiled the source code from scratch",
      "Connected to the internet to fetch the program"
    ],
    "a": 1,
    "x": "A program on disk is an inert file. Running it means copying its instructions into RAM and pointing the CPU at the first one. This is why a program takes a moment to start, why it uses memory while open, and why closing it frees that memory — the disk copy never changed."
  },
  {
    "tag": "RAM versus disk",
    "lvl": "core",
    "q": "Your editor loses unsaved work when the power cuts, but the saved file survives. Why?",
    "o": [
      "The editor deletes unsaved work on shutdown",
      "Unsaved work lives in RAM, which needs power to hold anything; saving writes it to disk, which does not",
      "Saved files are backed up to the cloud automatically",
      "The operating system compresses unsaved work and discards it"
    ],
    "a": 1,
    "x": "RAM is fast and volatile — it holds data only while powered. Disk is slower and persistent. Everything you are working on lives in RAM until you save, which is the whole reason saving exists as a separate action. This is also why more RAM lets you keep more open at once, and why it has nothing to do with storage space."
  },
  {
    "tag": "File paths",
    "lvl": "core",
    "q": "What is the difference between `/home/aryan/notes.txt` and `notes.txt`?",
    "o": [
      "The first is a file and the second is a folder",
      "The first is an absolute path — unambiguous from anywhere; the second is relative and means 'in the current directory'",
      "The first works on Linux and the second on Windows",
      "There is no difference; the shell expands both the same way"
    ],
    "a": 1,
    "x": "An absolute path starts from the root and always points at the same file. A relative path is resolved against wherever you currently are, so the same command can find different files — or nothing — depending on your working directory. Almost every 'file not found' error from a beginner is a relative path resolved from an unexpected place."
  }
]);

TD.addMCQ("zero", "shell", [
  {
    "tag": "The working directory",
    "lvl": "core",
    "q": "A tutorial says `python script.py` but you get `can't open file 'script.py': No such file or directory`. The file definitely exists. What is wrong?",
    "o": [
      "Python is not installed correctly",
      "Your terminal's working directory is not the folder containing the file — check with `pwd` and move there with `cd`",
      "The file needs to be made executable first",
      "The filename must be given in full uppercase"
    ],
    "a": 1,
    "x": "The shell resolves `script.py` relative to wherever it currently is. `pwd` prints that location and `ls` shows what is there. This single confusion accounts for an enormous share of the frustration in a beginner's first week, and the fix is always the same: find out where you are before running anything."
  },
  {
    "tag": "Navigating",
    "lvl": "core",
    "q": "What does `cd ..` do?",
    "o": [
      "Returns to your home directory",
      "Moves up one level, to the parent of the current directory",
      "Lists the contents of the current directory",
      "Undoes the previous cd command"
    ],
    "a": 1,
    "x": "`..` always means the parent directory, and `.` means the current one. `cd` with no arguments goes home, and `cd -` returns to where you were previously. These four are most of the navigation you will ever need."
  },
  {
    "tag": "Reading a command",
    "lvl": "core",
    "q": "In `grep -rn \"error\" logs/`, which part is the option, which is the argument, and which is the target?",
    "o": [
      "grep is the option, -rn the argument, \"error\" the target",
      "-rn are options modifying behaviour, \"error\" is the pattern argument, logs/ is the target directory",
      "All three parts after grep are equivalent arguments in any order",
      "\"error\" is an option because it is quoted"
    ],
    "a": 1,
    "x": "Every shell command follows this shape: the program, then options (usually dash-prefixed, and often combinable as `-rn`), then the things to act on. Recognising the shape means you can read an unfamiliar command and guess correctly what it does, which is far more useful than memorising individual commands."
  },
  {
    "tag": "Tab completion",
    "lvl": "core",
    "q": "Why is pressing Tab while typing a filename more than a convenience?",
    "o": [
      "It runs the command immediately",
      "It completes only names that actually exist, so a completed path is guaranteed to be spelled correctly and to be present",
      "It converts the path to an absolute path",
      "It checks file permissions before running"
    ],
    "a": 1,
    "x": "Tab completion is also verification: if it does not complete, the thing you are typing is not there. That turns a class of typo into immediate feedback instead of a confusing error later, and it is the single habit that most speeds up a beginner in the terminal."
  },
  {
    "tag": "Piping",
    "lvl": "intermediate",
    "q": "What does the `|` do in `cat access.log | grep 404 | wc -l`?",
    "o": [
      "Runs the three commands in parallel",
      "Sends the output of each command as the input of the next, so this counts lines containing 404",
      "Chooses whichever command succeeds first",
      "Runs the next command only if the previous one fails"
    ],
    "a": 1,
    "x": "A pipe connects one program's output to the next one's input. This is the core idea of the Unix shell: many small programs that each do one thing, composed into something specific. Note that `cat` here is unnecessary — `grep 404 access.log | wc -l` does the same with one process fewer."
  }
]);

TD.addMCQ("zero", "errors", [
  {
    "tag": "Reading a traceback",
    "lvl": "core",
    "q": "A Python traceback is 12 lines long. Which line should you read first?",
    "o": [
      "The first line, which names the file where execution started",
      "The last line, which names the actual error and its message",
      "The middle line, where the call stack is deepest",
      "All of them in order, top to bottom"
    ],
    "a": 1,
    "x": "Python prints the call chain first and the error last. The final line tells you what went wrong; the line immediately above it tells you where. Reading top-down is why beginners find tracebacks intimidating — read the bottom two lines first, then walk upwards only if you need the path that got you there."
  },
  {
    "tag": "Error categories",
    "lvl": "core",
    "q": "What distinguishes a syntax error from a runtime error?",
    "o": [
      "Syntax errors happen in interpreted languages, runtime errors in compiled ones",
      "A syntax error means the code is not valid and nothing runs at all; a runtime error means valid code failed while executing",
      "Syntax errors are warnings and can be ignored",
      "Runtime errors always crash the program; syntax errors do not"
    ],
    "a": 1,
    "x": "A syntax error is caught before execution begins — a missing colon or unbalanced bracket means the file cannot even be parsed, so no line of it runs. A runtime error means the code was valid but something went wrong as it ran: a missing file, a wrong type, a division by zero. The distinction tells you whether to look for a typo or for a logic problem."
  }
]);

/* ===================================================================
   Programming Basics
   =================================================================== */

TD.addMCQ("basics", "values", [
  {
    "tag": "Assignment is not equality",
    "lvl": "core",
    "q": "Why is `x = x + 1` a sensible line of code, when it is nonsense as a mathematical equation?",
    "o": [
      "Programming languages solve the equation for x",
      "`=` means 'put this value in this box', not 'these are equal' — the right side is evaluated first, then stored",
      "It is only valid if x was previously undefined",
      "The compiler rewrites it as x + 1 = x"
    ],
    "a": 1,
    "x": "This is the single biggest conceptual hurdle for beginners with a maths background. Assignment is an instruction with a direction: evaluate the right, store into the left. `=` for assignment and `==` for comparison exist as separate operators precisely because they are different ideas."
  },
  {
    "tag": "Types",
    "lvl": "core",
    "q": "A form gives you the value `\"25\"` and you add 10, getting `\"2510\"`. What happened?",
    "o": [
      "The number overflowed",
      "The value is a string, and `+` on strings joins them rather than adding — it needs converting to a number first",
      "The form corrupted the data",
      "10 was silently converted to a string by the language"
    ],
    "a": 1,
    "x": "Input from forms, files and APIs arrives as text. `+` is overloaded: addition for numbers, concatenation for strings. Converting deliberately at the boundary — `int(x)` or `Number(x)` — is the fix, and forgetting to is one of the most common bugs in a beginner's first program that reads real input."
  },
  {
    "tag": "Mutability",
    "lvl": "intermediate",
    "q": "You pass a list to a function, the function appends to it, and the caller's list has changed too. Why?",
    "o": [
      "The function returned the list implicitly",
      "The function received a reference to the same list, not a copy — mutating it affects every holder of that reference",
      "Lists are always global",
      "Appending creates a new list and rebinds the caller's variable"
    ],
    "a": 1,
    "x": "Arguments pass a reference to the same object, so mutation is visible everywhere that object is held. This is efficient — no copying — and it is why accidental shared mutation is such a common source of confusing bugs. Pass a copy (`list(items)` or `items[:]`) when the caller must be protected."
  },
  {
    "tag": "Naming",
    "lvl": "core",
    "q": "Why do experienced programmers treat naming as a design activity rather than a formality?",
    "o": [
      "Longer names run faster in most interpreters",
      "A name states intent, so a good one removes the need for a comment — and struggling to name something usually means it does more than one thing",
      "Compilers optimise better with descriptive names",
      "Naming conventions are enforced by most languages"
    ],
    "a": 1,
    "x": "Code is read far more often than it is written, and a name is the highest-leverage documentation available: it appears at every use site for free. The diagnostic value matters too — if you cannot name a function clearly, that is usually evidence the function has more than one responsibility."
  }
]);

TD.addMCQ("basics", "logic", [
  {
    "tag": "Short-circuit evaluation",
    "lvl": "intermediate",
    "q": "Why does `if user and user.name:` not crash when `user` is None?",
    "o": [
      "The language checks for None automatically in conditions",
      "`and` short-circuits — if the left side is falsy the right side is never evaluated",
      "Accessing a property on None returns None rather than raising",
      "The condition is rewritten by the interpreter"
    ],
    "a": 1,
    "x": "Logical operators stop as soon as the answer is known. `False and anything` is False regardless, so there is no reason to evaluate the right side — and that makes the guard-then-use pattern safe. `or` short-circuits the same way on a truthy left side, which is what makes `name or \"anonymous\"` work as a default."
  },
  {
    "tag": "Guard clauses",
    "lvl": "intermediate",
    "q": "What is the main advantage of returning early on invalid input rather than wrapping the main logic in an if?",
    "o": [
      "It executes fewer CPU instructions",
      "The real work stays at one indentation level, and each new rule adds two lines rather than another level of nesting",
      "It prevents exceptions from being raised",
      "Early returns are required by most style guides"
    ],
    "a": 1,
    "x": "Nested conditions push the important code to the right and make it harder to see what the function actually does. Guard clauses handle the exceptional cases first and leave the main path flat and prominent. The same idea applies to loops via `continue`, and it is one of the most visible markers of experienced code."
  },
  {
    "tag": "Boolean naming",
    "lvl": "core",
    "q": "Which boolean variable name is best?",
    "o": [
      "flag",
      "is_valid",
      "not_invalid",
      "validity_status"
    ],
    "a": 1,
    "x": "A boolean should read as a question with a yes/no answer, which makes `if is_valid:` read as English. Avoid negation in the name — `not_invalid` produces `if not not_invalid:` at some point, which nobody can read reliably. `flag` says nothing at all about what it means."
  },
  {
    "tag": "Comparing floats",
    "lvl": "intermediate",
    "q": "`0.1 + 0.2 == 0.3` is False. What is the correct way to compare decimal results?",
    "o": [
      "Round both sides to 15 decimal places",
      "Compare with a small tolerance — check that the absolute difference is below some epsilon",
      "Convert both to strings and compare those",
      "Use a different comparison operator"
    ],
    "a": 1,
    "x": "Binary floating point cannot represent 0.1 exactly, so tiny errors accumulate. This is a property of the hardware, not a language bug, and it will never be fixed. Compare with a tolerance (`abs(a - b) < 1e-9`), and never store money as a float — use integer cents or a decimal type."
  }
]);

TD.addMCQ("basics", "funcs", [
  {
    "tag": "Why functions exist",
    "lvl": "core",
    "q": "Beyond avoiding repetition, what is the main benefit of extracting code into a named function?",
    "o": [
      "Functions run faster than inline code",
      "A name lets a reader skip the implementation entirely — the function becomes one concept instead of ten lines to trace",
      "Functions use less memory",
      "It is required for the code to be testable"
    ],
    "a": 1,
    "x": "Repetition is the obvious reason and the smaller one. The larger benefit is compression of attention: `validate_email(address)` can be understood without reading its body, so the calling code stays legible. A function used exactly once can still be worth extracting purely for the name."
  },
  {
    "tag": "Return versus print",
    "lvl": "core",
    "q": "A function calculates a total and prints it. The caller gets None when trying to use the result. Why?",
    "o": [
      "print consumes the value",
      "The function has no return statement, so it returns None — printing displays a value, returning hands it back to the caller",
      "The total must be declared global",
      "print returns the value only in interactive mode"
    ],
    "a": 1,
    "x": "Printing and returning are unrelated: one writes to the screen, the other passes a value back into the program. A function that prints is a dead end — its result cannot be stored, tested or reused. As a rule, calculate and return; let the caller decide whether to display it."
  },
  {
    "tag": "Scope",
    "lvl": "intermediate",
    "q": "A variable assigned inside a function is not visible outside it. Why is that a good thing?",
    "o": [
      "It saves memory by discarding the variable immediately",
      "It means a function's internals cannot accidentally collide with or corrupt anything elsewhere, so a function can be understood in isolation",
      "It makes the function run faster",
      "It is required for recursion to work"
    ],
    "a": 1,
    "x": "Local scope is what makes a function a self-contained unit. Without it, every variable name would be a potential collision across the whole program, and no function could be understood without reading all the others. This is also why heavy use of global variables makes code so hard to reason about."
  },
  {
    "tag": "Mutable default arguments",
    "lvl": "advanced",
    "q": "`def add(item, bucket=[]):` accumulates items across separate calls. Why?",
    "o": [
      "The list is declared global implicitly",
      "The default is created once when the function is defined, not per call — so every call without an explicit bucket shares one list",
      "Python caches function arguments for performance",
      "Lists cannot be used as default values at all"
    ],
    "a": 1,
    "x": "Default arguments are evaluated once, at definition time. A mutable default therefore persists between calls and accumulates. The fix is `def add(item, bucket=None):` then `if bucket is None: bucket = []` inside. This is one of the most famous Python gotchas and it appears in interview questions constantly."
  }
]);

TD.addMCQ("basics", "errors", [
  {
    "tag": "Catching specifically",
    "lvl": "intermediate",
    "q": "What is wrong with `try: ... except: pass`?",
    "o": [
      "It is slower than catching a specific exception",
      "It silently swallows every error including ones you did not anticipate — and in Python it also catches Ctrl-C, so the program refuses to stop",
      "`pass` is not valid inside an except block",
      "It only catches the first exception raised"
    ],
    "a": 1,
    "x": "A bare except hides bugs rather than handling them: the program continues in a state you did not design for, and the eventual failure appears somewhere unrelated. Catch the specific exception you can actually do something about, and let everything else travel up to where it will be seen."
  },
  {
    "tag": "Fail fast",
    "lvl": "intermediate",
    "q": "Why validate input at the point it enters your program rather than where it is eventually used?",
    "o": [
      "Validation is faster on unprocessed data",
      "The error is raised where the cause is visible — a bad value caught three layers deep produces a stack trace pointing at code that is not at fault",
      "It reduces the number of exception handlers needed",
      "Late validation cannot detect type errors"
    ],
    "a": 1,
    "x": "The distance between where a bad value enters and where it causes a failure is the main multiplier on debugging time. Validating at the boundary means the traceback points at the actual problem. This is the same principle behind schema validation on API responses and type checks on function arguments."
  },
  {
    "tag": "Debugging method",
    "lvl": "core",
    "q": "A program produces the wrong answer with no error. What is the most reliable first step?",
    "o": [
      "Rewrite the function from scratch",
      "Print or inspect the intermediate values to find the first point where reality diverges from expectation",
      "Add a try/except to see if something is being swallowed",
      "Search the error message online"
    ],
    "a": 1,
    "x": "Debugging is binary search over the execution: find a point where the state is still correct and a point where it is wrong, then narrow between them. Printing intermediate values is the crudest form of this and works everywhere; a debugger does it more comfortably. Rewriting without understanding usually reproduces the bug."
  },
  {
    "tag": "Reproducing",
    "lvl": "intermediate",
    "q": "Why is reproducing a bug reliably considered most of the work of fixing it?",
    "o": [
      "Most bugs disappear once observed",
      "Without reproduction you cannot tell whether a change fixed the bug or merely changed the timing — and you cannot prove it stays fixed",
      "Reproduction is required by version control",
      "It is the only way to see the stack trace"
    ],
    "a": 1,
    "x": "An unreproducible fix is a guess. Reliable reproduction gives you a before-and-after test, converts the fix into evidence, and can become a regression test that stops the bug returning. This is why bug reports ask for exact steps rather than a description of the symptom."
  }
]);

TD.addMCQ("basics", "think", [
  {
    "tag": "Decomposition",
    "lvl": "core",
    "q": "Faced with a problem you do not know how to solve, what is the most productive first move?",
    "o": [
      "Search for a complete solution to copy",
      "Break it into the smallest sub-problem you can definitely solve, solve that, and see what the next unknown becomes",
      "Write the whole structure first and fill in details later",
      "Choose the data structures before understanding the problem"
    ],
    "a": 1,
    "x": "Decomposition converts one intimidating problem into several small ones, and solving the first usually clarifies the rest. It also gives you working code early, which is far better for morale and for feedback than a large structure that does not run yet."
  },
  {
    "tag": "Working before elegant",
    "lvl": "core",
    "q": "Why write the obvious, clumsy solution before the clever one?",
    "o": [
      "Clumsy code runs faster in interpreted languages",
      "A working version gives you something to test the clever one against, and often proves the clever version was unnecessary",
      "It is required by test-driven development",
      "Clever solutions are always wrong on the first attempt"
    ],
    "a": 1,
    "x": "Correct-then-fast is the order that works. The naive version is a reference implementation you can compare against, and profiling frequently shows the bottleneck was somewhere else entirely — so the clever version would have been effort spent on the wrong thing."
  },
  {
    "tag": "Rubber ducking",
    "lvl": "core",
    "q": "Why does explaining a bug out loud — even to nobody — so often reveal the answer?",
    "o": [
      "Speaking activates a separate part of the brain used for logic",
      "Explaining forces you to state assumptions explicitly, and the wrong one usually becomes obvious as you say it",
      "It slows you down enough to notice typos",
      "It is a placebo with no real effect"
    ],
    "a": 1,
    "x": "Bugs live in the gap between what you believe the code does and what it does. Reading silently lets you skim past an assumption; narrating forces each step into words, and the false assumption tends to sound wrong when spoken. This is why the technique works with a rubber duck as well as a colleague."
  }
]);
