/* Ground Zero — editors, IDEs and installing a language. */
TD.addLessons("zero", [

{
 t: "What an IDE Actually Does For You",
 m: "tools",
 lvl: "core",
 s: "Why professionals do not write code in Notepad, and what the editor is doing while you type.",
 goal: [
  "Say what separates a text editor from an IDE",
  "Name the four features that genuinely change how fast you work",
  "Choose an editor without spending a weekend on the decision"
 ],
 b: [
  { p: "Code is plain text. You could write every program in this course in Notepad and it would run identically. So the question is not whether you *need* an editor — it is what a good one gives you that a plain one does not." },
  { p: "The answer is that a good editor **reads your code while you type it**. It is not storing characters; it is parsing them, building a model of what you have written, and using that model to answer questions before you have to ask them." },

  { h: "The four things that actually matter" },
  { ol: [
   "**Syntax highlighting.** Keywords, strings, numbers and comments get different colours. This sounds cosmetic and is not: an unclosed quote turns half your file into string-coloured text, and you spot the mistake from across the room without reading a character.",
   "**Error squiggles.** A red underline appears under a mistake *as you type it*, before you run anything. For a beginner this is worth more than everything else combined — it collapses the feedback loop from minutes to zero.",
   "**Autocomplete.** Start typing a name and it offers the ones that exist. Beyond saving keystrokes, it is a correctness check: if the name you want is not offered, you have misspelled it or it is not in scope.",
   "**Go to definition.** Ctrl-click any name and jump to where it was created — even into a library you did not write. This is how you read unfamiliar code, and it is the feature people miss most when they lose it."
  ] },

  { tbl: { t: "The three tiers, honestly",
    h: ["Kind", "What it is", "Examples", "When it is right"],
    rows: [
     ["**Text editor**", "Types characters into a file. Nothing more", "Notepad, `nano`, TextEdit", "Editing one config file on a server"],
     ["**Code editor**", "Understands code through plugins; light and fast", "**VS Code**, Sublime, Neovim", "Almost always. This is where the industry lives"],
     ["**Full IDE**", "Editor plus debugger, build tools, test runner, database client, all in one", "PyCharm, IntelliJ, Visual Studio", "Large projects in one language, where the deep integration pays for the weight"]
    ] } },

  { p: "The line between the middle and the right column has almost dissolved. VS Code with the Python extension does nearly everything PyCharm does, starts in a second, and handles Python, SQL, HTML, CSS, JavaScript and Markdown in the same window. For this course that matters, because you will be working in four languages." },

  { n: "There is a genuine, endless argument about editors, and you should not participate in it yet. Every option in the middle column is good. Pick **VS Code** because the next lesson assumes it, because it is free, and because most tutorials you find will show it. If you love a different one in a year, switching costs an afternoon.",
    nt: "Do not spend a weekend choosing" },

  { h: "The one thing an editor cannot do" },
  { p: "It cannot tell you your logic is wrong. A red squiggle means *this is not valid code*. It does not mean *this will not do what you want*. A program that adds when it should subtract is flawless as far as the editor is concerned, and completely broken as far as you are concerned." },
  { trap: "Beginners come to trust the absence of squiggles as *my code is correct*. It means only that your code is **grammatically valid** — the same way a sentence can be perfectly formed and still say something false. Everything the editor catches is spelling and grammar. Meaning is entirely your job, and that is what testing and debugging are for." }
 ],
 k: [
  "A code editor parses what you type and answers questions before you ask them.",
  "Syntax highlighting, live error squiggles, autocomplete and go-to-definition are the four features that change your speed.",
  "VS Code is the right default: light, free, and fluent in every language in this course.",
  "No squiggles means grammatically valid, never correct. The editor cannot check meaning."
 ],
 r: ["Integrated Development Environment", "Syntax", "Syntax Error", "Debugging", "Linter"]
},

{
 t: "Setting Up VS Code Properly",
 m: "tools",
 lvl: "core",
 s: "Ten minutes now that pays back every day — extensions, format on save, and the integrated terminal.",
 goal: [
  "Install VS Code and the extensions that matter",
  "Open a *folder* rather than a file, and know why that is different",
  "Turn on format-on-save and stop thinking about layout forever"
 ],
 b: [
  { p: "A fresh VS Code install is deliberately plain. Four changes turn it into a tool that actively helps, and they take about ten minutes." },

  { h: "1. Install it" },
  { p: "Download from `code.visualstudio.com` and install normally. On Windows, tick **Add to PATH** during setup if you are offered it — that is what lets you type `code .` in a terminal to open the current folder, which you will do constantly." },

  { h: "2. Open a folder, not a file" },
  { p: "This is the single most important habit in this lesson and almost nobody explains it." },
  { p: "If you open a lone file, VS Code sees one file. If you open a **folder**, it indexes everything inside — so autocomplete knows about your other files, go-to-definition can jump between them, search covers the project, and the built-in terminal starts already standing in the right place." },
  { term: { t: "Two equivalent ways to open a project folder",
    lines: [
     { c: "code .", w: "From a terminal: open VS Code on the current directory. The `.` means *here*, exactly as in the paths lesson." },
     { c: "code ~/projects/python-practice", w: "Or name the folder explicitly. Same result." }
    ] } },
  { p: "Through the interface it is **File → Open Folder**, never *Open File*. Make one folder per project, and always open that." },

  { h: "3. Install four extensions" },
  { p: "Open the Extensions panel — the squares icon in the left bar, or `Ctrl + Shift + X` — and install these." },
  { tbl: { h: ["Extension", "Publisher", "What it gives you"],
    rows: [
     ["**Python**", "Microsoft", "Everything: highlighting, error squiggles, the debugger, test running, environment selection. Non-negotiable."],
     ["**Pylance**", "Microsoft", "The fast language server behind autocomplete and type checking. Usually installed automatically with Python."],
     ["**Ruff**", "Astral", "Instant linting and formatting. This is what will keep your code tidy without you thinking about it."],
     ["**Error Lens**", "Alexander", "Prints the error message *inline on the line itself*, instead of hiding it in a panel you never open. Genuinely transformative for a beginner."]
    ] } },
  { p: "For the web tracks later, add **Live Server** — it opens your HTML page in a browser and refreshes it automatically every time you save." },

  { h: "4. Change three settings" },
  { p: "Open settings with `Ctrl + ,`, then click the small *Open Settings (JSON)* icon in the top right to edit the file directly." },
  { code: { lang: "json", file: "settings.json", t: "Paste these inside the outer braces.",
    lines: [
     { c: "{", w: "The settings file is JSON — a format you will meet properly in the Python track. For now, note that every setting is a `\"name\": value` pair and pairs are separated by commas." },
     { c: "  \"editor.formatOnSave\": true,", w: "**The important one.** Every time you save, the file is reformatted to a consistent style — spacing, indentation, quote marks. You stop making layout decisions entirely, and you stop arguing about them with other people." },
     { c: "  \"editor.rulers\": [88],", w: "Draws a faint vertical line at 88 characters. Not a limit, a hint: a line past it is usually doing too much and is worth breaking up." },
     { c: "  \"files.trimTrailingWhitespace\": true", w: "Strips invisible spaces from the ends of lines on save. They are invisible to you and very visible in a Git diff, where they create noise in changes you did not make." },
     { c: "}", w: "No comma after the last pair — JSON is strict about that, and it is the most common way to break this file." }
    ] } },

  { h: "The shortcuts worth learning on day one" },
  { tbl: { h: ["Keys", "Does"],
    rows: [
     ["`Ctrl + \\``", "Toggle the integrated terminal. Already standing in your project folder"],
     ["`Ctrl + P`", "Jump to any file by typing part of its name"],
     ["`Ctrl + Shift + P`", "The command palette — every command VS Code has, searchable. When you do not know how to do something, this is where you look"],
     ["`Ctrl + /`", "Comment or uncomment the selected lines"],
     ["`F5`", "Run the current file with the debugger attached"],
     ["`Ctrl + D`", "Select the next occurrence of the word you have selected — then type once and change all of them"]
    ] } },

  { n: "The integrated terminal (`Ctrl + \\``) is the whole reason the last module mattered. It opens inside VS Code, already standing in your project folder, so `python hello.py` just works with no navigating. Editor on top, terminal underneath — that split is what a working setup actually looks like.",
    nt: "Where you will really live" },

  { tryit: { t: "Set it up for real",
    task: "Make a folder called `python-practice` from the terminal, then open it in VS Code from the terminal, and open the integrated terminal inside it. Run `pwd` in that terminal and confirm it says what you expect.",
    hint: "`mkdir`, then `cd` into it, then `code .` — and `Ctrl + \\`` once VS Code is open.",
    sol: { lang: "bash", code: "mkdir python-practice\ncd python-practice\ncode .\n# then Ctrl + ` inside VS Code, and:\npwd" },
    w: "The integrated terminal inherits the folder you opened. That is why *open the folder* mattered — you never have to navigate again." } }
 ],
 k: [
  "Always open a **folder**, never a lone file — that is what gives you project-wide autocomplete, search and navigation.",
  "Python, Pylance, Ruff and Error Lens are the four extensions worth installing before you write anything.",
  "`editor.formatOnSave` ends every layout decision you would otherwise make.",
  "`Ctrl + Shift + P` is the answer to *how do I do X in this editor*."
 ],
 r: ["Integrated Development Environment", "Linter", "JSON", "Code Formatter"],
 drill: {
  lang: "bash",
  reps: 3,
  items: [
   { c: "code .", w: "open VS Code on the folder you are currently standing in" },
   { c: "mkdir python-practice", w: "create a folder for your practice work" },
   { c: "\"editor.formatOnSave\": true", w: "the settings line that reformats a file every time you save it", lang: "json", hint: "quoted key, colon, value" }
  ]
 }
},

{
 t: "Installing a Language, and Why PATH Breaks",
 m: "tools",
 lvl: "core",
 s: "The single concept behind `python is not recognised as a command` — and how to fix it for good.",
 goal: [
  "Install Python and confirm it worked",
  "Explain what PATH is and why the shell needs it",
  "Diagnose `command not found` without guessing"
 ],
 b: [
  { p: "Installing a language means putting a program on your machine — for Python, the interpreter from the compiling lesson. That part is a normal installer and rarely goes wrong. What goes wrong is the step afterwards, and it goes wrong for one specific reason that is worth understanding once." },

  { h: "Install it" },
  { tbl: { h: ["System", "How", "Watch out for"],
    rows: [
     ["**Windows**", "From `python.org`, latest stable release", "**Tick *Add python.exe to PATH* on the first screen.** This one checkbox is the entire lesson. It is off by default and it is the cause of nearly every Windows setup failure"],
     ["**macOS**", "`brew install python` if you have Homebrew, otherwise `python.org`", "macOS ships an old Python for its own use. Do not touch it, and do not assume `python` means yours"],
     ["**Linux**", "Usually already there. `sudo apt install python3 python3-pip` if not", "The system depends on its Python. Never uninstall or replace it"]
    ] } },

  { h: "Confirm it worked" },
  { term: { t: "Open a **new** terminal — an already-open one will not have noticed the install.",
    lines: [
     { c: "python --version", w: "Ask the interpreter to state its version and exit. If this prints a number, everything is fine and you can skip the rest of this lesson." },
     { out: "Python 3.13.1" },
     { c: "python3 --version", w: "On macOS and Linux, `python` may not exist at all while `python3` does — a leftover from the long migration away from Python 2. Try both." },
     { out: "Python 3.13.1" }
    ] } },
  { p: "If either printed a version, you are done. If both said *command not found* or *not recognised*, read on — this is the interesting part." },

  { h: "What PATH is" },
  { p: "When you type `python`, the shell does not search your whole computer. Searching a disk takes seconds, and the shell answers in milliseconds. Instead it consults a list of folders it has been told to look in, checks each one in order, and runs the first match it finds." },
  { p: "That list is called **PATH**. It is an environment variable — a named value the operating system hands to every program it starts — and it is just a string of folder paths separated by a delimiter." },

  { term: { t: "Look at yours",
    lines: [
     { c: "echo $PATH", w: "macOS and Linux. `echo` prints something; the `$` means *the value of the variable named PATH*, not the literal word." },
     { out: "/usr/local/bin:/usr/bin:/bin:/Users/aryan/.local/bin" },
     { c: "$env:PATH", w: "PowerShell's equivalent syntax. Same concept, different punctuation — and Windows separates entries with `;` rather than `:`." }
    ] } },
  { p: "Read that output as a list: `/usr/local/bin`, then `/usr/bin`, then `/bin`, then `/Users/aryan/.local/bin`. When you type `python`, the shell checks each of those folders in order for a file called `python` and runs the first one it finds." },

  { ana: "PATH is a list of shops you have agreed to check, in order, when you need something. Ask for milk and you go to shop one, then shop two, until you find it. `command not found` does not mean milk does not exist — it means it is not in any shop on your list. And *the wrong version ran* means an earlier shop on the list also sells milk.",
    at: "The list of shops" },

  { h: "The two failures, and what each one means" },
  { tbl: { h: ["Symptom", "What is actually true", "Fix"],
    rows: [
     ["`python: command not found`", "Python is installed, but its folder is not on PATH", "Add it to PATH — on Windows, re-run the installer and choose **Modify**, then tick the box"],
     ["Wrong version runs", "Two Pythons are installed and an earlier PATH entry wins", "Run `which python` (or `where python` on Windows) to see exactly which file is being chosen"],
     ["Works in one terminal, not another", "PATH changed after that terminal was opened", "Close it and open a new one. A shell reads PATH once, at startup"],
     ["Works for you, not for a scheduled job", "Background jobs get a different, minimal PATH", "Use the full absolute path to the interpreter in the job definition"]
    ] } },

  { term: { t: "The diagnostic that ends the guessing",
    lines: [
     { c: "which python", w: "macOS and Linux: prints the **exact file** the shell would run. Not a version, not a guess — the actual path it resolved to." },
     { out: "/usr/local/bin/python" },
     { c: "where python", w: "The Windows equivalent, and it lists **every** match on PATH in priority order — which is how you catch two installations fighting." }
    ] } },
  { p: "Whenever a language behaves in a way that makes no sense, run this first. A surprising amount of the time the answer is that you have been running a different installation than the one you have been carefully configuring." },

  { trap: "The tempting fix for *wrong version* is to uninstall everything and start again. Do not, especially on macOS and Linux, where the operating system itself uses a Python and removing it breaks parts of the system. The correct fix is never to remove interpreters — it is to stop caring which one is default, by giving every project its own **virtual environment**. That is covered early in the Python track, and it makes this entire class of problem disappear." },

  { n: "You will meet `pip` immediately after this — Python's package installer, which comes bundled with modern Python. Confirm it with `pip --version`. If `python` works and `pip` does not, run `python -m pip --version` instead: `-m` means *run this installed module*, and it works even when `pip` itself is not on PATH.",
    nt: "The other half of the install" }
 ],
 k: [
  "PATH is an ordered list of folders the shell searches to turn a command name into a program.",
  "`command not found` means *not on PATH*, which is rarely the same as *not installed*.",
  "`which python` / `where python` tells you exactly which file is being run — always check before theorising.",
  "A shell reads PATH once at startup, so a new install needs a new terminal."
 ],
 r: ["Environment Variable", "Shell", "Command Line Interface", "Package Manager"],
 drill: {
  lang: "bash",
  reps: 3,
  items: [
   { c: "python --version", w: "check that Python is installed and print which version" },
   { c: "echo $PATH", w: "print the list of folders the shell searches for commands" },
   { c: "which python", w: "show the exact file the shell would run for the command python" },
   { c: "python -m pip --version", w: "run pip as a module, for when pip itself is not on PATH", hint: "the -m flag" }
  ]
 }
}

]);
