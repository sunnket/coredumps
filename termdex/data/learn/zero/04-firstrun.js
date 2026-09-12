/* Ground Zero — writing and running your first program. */
TD.addLessons("zero", [

{
 t: "Your First Program, Start to Finish",
 m: "firstrun",
 lvl: "core",
 s: "Every step from an empty folder to text on the screen, with nothing skipped.",
 goal: [
  "Create a project folder, a file, and a running program without help",
  "Explain what each of the three commands you type is doing",
  "Run the same code two different ways and know why you would choose each"
 ],
 b: [
  { p: "Everything in this track has been preparation. This lesson spends it. You will go from an empty disk to a program that runs, and — this is the point — nothing in the sequence will be magic." },
  { p: "The code itself is two lines and you are not expected to understand it yet. The Python track explains every character. What matters here is the **sequence**: folder, file, save, run." },

  { h: "Step 1 — make somewhere to work" },
  { term: { lines: [
   { c: "cd ~", w: "Start from home, so this works identically on your machine and mine." },
   { c: "mkdir first-program", w: "A folder for this project. One folder per project, always — it is what lets your editor and your tools understand the boundary of your work." },
   { c: "cd first-program", w: "Step inside. From here on, *here* means this folder." },
   { c: "pwd", w: "Confirm. This habit costs a second and saves hours." },
   { out: "/Users/aryan/first-program" }
  ] } },

  { h: "Step 2 — open the folder in your editor" },
  { term: { lines: [
   { c: "code .", w: "Open VS Code on the current directory. The `.` is the relative path meaning *here* — the same dot from the paths lesson, doing exactly what it always does." }
  ] } },
  { p: "VS Code opens with an empty file explorer on the left. That emptiness is correct: the folder genuinely is empty. Create a file through the explorer's *new file* icon, or with `Ctrl + N` then save, and name it **`hello.py`**." },
  { p: "The `.py` matters. Not to the disk — the disk stores bytes — but to VS Code, which uses it to decide to load the Python extension, colour your keywords and start checking for errors. Name it `hello.txt` and you get a plain grey wall of text." },

  { h: "Step 3 — write two lines" },
  { code: { lang: "python", file: "hello.py",
    lines: [
     { c: "name = \"Aryan\"", w: "Create a **variable**. The word `name` becomes a label pointing at the text `Aryan`. The `=` does not mean *equals* — it means **store the right-hand side under the left-hand name**. The quotes are what make `Aryan` a piece of text rather than a name Python must look up." },
     { c: "print(name)", w: "`print` is a **function** — a named piece of work that already exists. The parentheses mean *run it now*, and whatever sits between them is what you are handing it. Note there are no quotes around `name`: you want the value in the box, not the four-letter word `name`." }
    ],
    out: "Aryan",
    after: "Two lines, and every character in them was a decision. That is the level of attention the Python track keeps up for the whole language." } },
  { p: "Now **save it** — `Ctrl + S`. Remember the earlier lesson: saving is not running. Nothing has happened yet. The file on disk now contains those two lines, and Python has not looked at it." },

  { h: "Step 4 — run it" },
  { p: "Open the integrated terminal with `Ctrl + \\``. It opens standing in your project folder, which is exactly why you opened the folder rather than the file." },
  { term: { lines: [
   { c: "python hello.py", w: "Read this as: run the program `python`, and hand it the argument `hello.py`. Program, then argument — the grammar from the flags lesson, unchanged." },
   { out: "Aryan" }
  ] } },
  { p: "That is a complete, working program. Trace what just happened: the shell searched PATH, found the Python interpreter, and started it as a process. The interpreter opened `hello.py` — a *relative* path, resolved against the current directory, which is why standing in the right folder mattered. It read line one and stored a value. It read line two and printed it. It reached the end, and the process exited." },
  { p: "Every piece of that sentence is something you learned in this track." },

  { trap: "`python: can't open file 'hello.py': [Errno 2] No such file or directory` is the error you are most likely to see, and it does not mean what it appears to. The file exists — you are looking at it. Your terminal is standing somewhere else. Run `pwd`, then `ls`, and you will find you are one folder up. This is the single most common beginner error in existence and it is always the same cause." },

  { h: "The other way to run it: the REPL" },
  { p: "There is a second mode, and it is the one you will actually use for quick questions." },
  { term: { lines: [
   { c: "python", w: "With no filename, Python starts **interactively**. You are now typing at the interpreter itself rather than handing it a file." },
   { out: "Python 3.13.1\nType \"help\", \"copyright\" for more information.\n>>>" },
   { c: ">>> 2 + 2", w: "The `>>>` is Python's prompt — its equivalent of the shell's `$`, and again you never type it. Enter an expression and it evaluates and shows the result immediately." },
   { out: "4" },
   { c: ">>> name = \"Aryan\"", w: "Assignment produces no output, so nothing is printed. Silence means it worked." },
   { c: ">>> name", w: "Type a name on its own and the REPL prints its value — a convenience that only exists here, not in a saved file." },
   { out: "'Aryan'" },
   { c: ">>> exit()", w: "Leave. `Ctrl + D` on macOS and Linux, `Ctrl + Z` then Enter on Windows, does the same." }
  ] } },
  { p: "This is the **REPL** — Read, Evaluate, Print, Loop. It reads what you typed, works it out, prints the answer, and goes round again. Nothing is saved; close it and it is gone." },

  { tbl: { t: "When to use which",
    h: ["", "A file", "The REPL"],
    rows: [
     ["Saved", "Yes — this is a real program", "No, gone when you close it"],
     ["Good for", "Anything you will run more than once", "*Does this do what I think it does?*"],
     ["Prints", "Only what you explicitly `print`", "The value of anything you type"],
     ["How you use it in practice", "Where your work lives", "A calculator and a scratchpad, open beside your editor"]
    ] } },

  { n: "That difference in printing catches people out. In the REPL, typing `2 + 2` shows `4`. In a file, a line that just says `2 + 2` computes four and throws it away silently, because a file only outputs what you ask it to. If your program prints nothing, the first question is always whether you actually called `print`.",
    nt: "Why your file prints nothing" },

  { tryit: { t: "Do it without looking",
    task: "Close everything. Now, from a fresh terminal, create a folder called `practice-run`, make a file called `greet.py` inside it, write a program that stores your own name and prints a greeting with it, and run it. Then open the REPL and check what `\"Hello, \" + \"Aryan\"` gives you before you use it.",
    hint: "Two pieces of text can be joined with `+`. The `print` function can take one thing built out of several.",
    sol: { lang: "python", code: "name = \"Aryan\"\nprint(\"Hello, \" + name)" },
    w: "You have now done the entire loop unaided: folder, file, code, save, run. Everything from here is more interesting code inside the same loop." } }
 ],
 k: [
  "The loop never changes: make a folder, open the folder, write a file, save, run it from a terminal standing in that folder.",
  "`python hello.py` is program-then-argument, and the filename is a relative path resolved against your current directory.",
  "`can't open file` means your terminal is standing somewhere else. Run `pwd`.",
  "The REPL prints the value of anything you type; a saved file prints only what you explicitly ask it to."
 ],
 r: ["REPL", "Interpreter", "Command Line Interface", "Variable"],
 drill: {
  lang: "bash",
  reps: 3,
  items: [
   { c: "mkdir first-program", w: "create a folder for a new project" },
   { c: "code .", w: "open your editor on the folder you are standing in" },
   { c: "python hello.py", w: "run a Python file from the terminal" },
   { c: "name = \"Aryan\"", w: "store the text Aryan under the name `name`", lang: "python", hint: "quotes make it text" },
   { c: "print(name)", w: "display the value held in `name` on the screen", lang: "python", hint: "no quotes — you want the value, not the word" }
  ]
 }
}

]);
