/* Python — setting up. */
TD.addLessons("python", [

{
 t: "The REPL as Your Laboratory",
 m: "setup",
 lvl: "core",
 s: "The fastest feedback loop in programming, and how professionals actually use it.",
 goal: [
  "Use the REPL to answer a question in seconds instead of writing a file",
  "Inspect any unfamiliar value with `type`, `dir` and `help`",
  "Know exactly when the REPL is the wrong tool"
 ],
 b: [
  { p: "You met the REPL briefly in Ground Zero. It deserves a lesson of its own, because used properly it is the single fastest way to learn a language — and almost every beginner underuses it." },
  { p: "**REPL** stands for Read, Evaluate, Print, Loop. You type an expression, it works out the answer, shows you, and waits for the next one. The loop is under a second long, which means you can ask the language a question and get a definitive answer faster than you could find it in documentation." },

  { h: "Start it" },
  { term: { lines: [
   { c: "python", w: "No filename. Python starts in interactive mode." },
   { out: "Python 3.13.1 (main, Dec  3 2025)\nType \"help\", \"copyright\", \"credits\" or \"license\" for more information.\n>>>" }
  ] } },
  { p: "The `>>>` is Python's prompt. As with the shell's `$`, you never type it — examples show it to mark *this is what you type*, and anything on the line below with no prompt is what came back." },

  { h: "It prints the value of everything" },
  { p: "This is the behaviour that makes it a laboratory rather than just a slow way to run code." },
  { code: { lang: "python", t: "In the REPL, an expression on its own shows its result",
    lines: [
     { c: ">>> 2 + 2", w: "An expression. The REPL evaluates it and prints the answer with no `print` needed." },
     { c: "4" },
     { c: ">>> \"hello\".upper()", w: "Ask a piece of text for an uppercase version of itself. The result is shown immediately." },
     { c: "'HELLO'" },
     { c: ">>> name = \"Aryan\"", w: "Assignment is a **statement**, not an expression — it produces no value, so nothing is printed. Silence here means success." },
     { c: ">>> name", w: "But a bare name *is* an expression, so its value is shown. Note the quotes: the REPL shows you the *representation*, which tells you this is text and not a variable name." },
     { c: "'Aryan'" },
     { c: ">>> print(name)", w: "Whereas `print` shows the value as a human would want to read it. The difference between these two lines is a genuinely useful distinction." },
     { c: "Aryan" }
    ] } },

  { h: "The three commands that answer everything" },
  { p: "When you meet an unfamiliar value — from a library, from a file, from anywhere — three built-ins will tell you what it is and what it can do. Learn these now and you will use them for the rest of your career." },

  { code: { lang: "python", t: "Interrogating an unknown value",
    lines: [
     { c: ">>> scores = [72, 91, 65]", w: "Something to inspect." },
     { c: ">>> type(scores)", w: "**What kind of thing is this?** The single most useful function in Python when something is behaving oddly." },
     { c: "<class 'list'>" },
     { c: ">>> len(scores)", w: "**How many things are in it?** Works on anything with a length — lists, text, dictionaries." },
     { c: "3" },
     { c: ">>> dir(scores)", w: "**What can it do?** Lists every method and attribute available. Ignore the `__dunder__` entries for now — the useful names are at the end." },
     { c: "[..., 'append', 'clear', 'copy', 'count', 'extend', 'index', 'insert', 'pop', 'remove', 'reverse', 'sort']" },
     { c: ">>> help(scores.sort)", w: "**How exactly does this one work?** Prints the documentation for that specific method, straight from the source. Press `q` to leave, the same key as `man`." }
    ],
    after: "`type` then `dir` then `help` is a complete workflow for understanding something you have never seen. It works on anything — a pandas DataFrame, a database connection, an object from a library documented in a language you cannot read." } },

  { trap: "A `TypeError` is nearly always answered by `type()`. When Python says an operation is not supported between two things, print the type of each one and the cause is usually immediately obvious — most often a number that is secretly text, because it came from a file or an input box and was never converted." },

  { h: "Where the REPL is genuinely wrong" },
  { p: "It has no memory. Close it and everything is gone. There is no file, no history you can share, no way to run it again tomorrow." },
  { tbl: { h: ["Use the REPL for", "Use a file for"],
    rows: [
     ["*Does `.split()` include the separator?*", "Anything you will run more than once"],
     ["Checking what a value's type actually is", "Anything longer than about five lines"],
     ["Arithmetic you would otherwise open a calculator for", "Anything you want to keep or share"],
     ["Trying a library function before committing to it", "Anything with a loop or a function in it"]
    ] } },
  { p: "The working pattern is both at once: your editor on top, a REPL open in the terminal underneath. You write in the file, and whenever you are unsure what something does, you check in the REPL rather than guessing." },

  { n: "Try `python -i script.py`. It runs your file and then **drops you into a REPL with everything still loaded** — every variable, every function, exactly as the program left them. You can poke at the results of a program you just ran. It is the fastest debugging tool nobody tells beginners about.",
    nt: "The flag worth remembering" },

  { tryit: { t: "Interrogate something",
    task: "Open the REPL. Make a piece of text, then use `dir()` on it to find the methods available. Find one you have never heard of, use `help()` to read what it does, and then actually run it.",
    hint: "`dir(\"hello\")` lists them. `strip`, `replace`, `startswith` and `title` are all worth meeting.",
    sol: { lang: "python", code: ">>> s = \"  hello world  \"\n>>> dir(s)\n>>> help(s.strip)\n>>> s.strip()\n'hello world'\n>>> s.title()\n'  Hello World  '" },
    w: "You just learned two string methods without a tutorial, a search engine or an assistant. That is the loop this tool gives you, and it works on every library you will ever touch." } }
 ],
 k: [
  "The REPL prints the value of any expression, so you never need `print` to check something.",
  "`type()`, `dir()` and `help()` will tell you what any unknown value is and what it can do.",
  "A `TypeError` is usually solved by printing the type of both operands.",
  "`python -i script.py` runs a file and leaves you in a REPL with all its variables intact."
 ],
 r: ["REPL", "Interpreter", "Data Type", "Debugging"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "type(scores)", w: "ask Python what kind of thing a value is" },
   { c: "len(scores)", w: "count how many items a collection holds" },
   { c: "dir(scores)", w: "list every method and attribute a value has" },
   { c: "help(scores.sort)", w: "read the documentation for one specific method" }
  ]
 }
},

{
 t: "Virtual Environments, Explained Properly",
 m: "setup",
 lvl: "core",
 s: "The thing every tutorial says to do and none of them explain — and why skipping it will hurt.",
 goal: [
  "Say what problem a virtual environment actually solves",
  "Create, activate and deactivate one without copying commands",
  "Recognise the symptom of running the wrong environment"
 ],
 b: [
  { p: "Every Python tutorial tells you to make a virtual environment. Almost none say why, so most people skip it, and then in month two they hit a problem that takes a day to untangle. Here is the why, properly, in one page." },

  { h: "The problem" },
  { p: "Packages you install go, by default, into one shared folder belonging to your Python installation. Every project on your machine reads from the same folder. That is fine until it is not." },
  { p: "Suppose you build a project in March using pandas version 2.1. In September you start a new project and install the newest pandas, which is 2.4. That upgrade is **global** — the March project now runs against 2.4 too, without you touching it. If anything changed between those versions, your working project quietly breaks, and the change that broke it happened in a completely different project." },
  { p: "Now scale that up. Ten projects, forty packages each, all pulling on one shared set of versions with conflicting requirements. This is a genuine, famous, unpleasant class of problem." },

  { ana: "Installing globally is one kitchen shared by every cook in the building. Someone reorganises the spice rack for their recipe and four other dinners are ruined. A virtual environment gives each project its own kitchen — same building, same you, completely separate shelves.",
    at: "The shared kitchen" },

  { h: "What a virtual environment actually is" },
  { p: "It is a **folder**. That is genuinely all it is, and the demystification matters." },
  { p: "Inside that folder sits a copy of the Python interpreter (or a link to one) and an empty package directory. When the environment is *activated*, your shell's PATH is temporarily rearranged so that `python` and `pip` resolve to the ones inside that folder instead of the global ones. Packages you install land in that folder. Delete the folder and every trace is gone." },
  { p: "Everything you learned about PATH in Ground Zero is exactly what is happening here. Activation is a PATH change, nothing more mysterious." },

  { h: "Create one" },
  { term: { t: "From inside your project folder",
    lines: [
     { c: "python -m venv .venv", w: "`-m venv` runs Python's built-in `venv` module. The final `.venv` is the **folder name** to create — you could call it anything, and `.venv` is the near-universal convention. The leading dot hides it from a plain `ls`." },
     { c: "ls -a", w: "Confirm it appeared." },
     { out: ".        ..       .venv     hello.py" }
    ] } },
  { p: "One environment per project, created inside the project folder. It is never shared, never committed to Git, and always disposable." },

  { h: "Activate it" },
  { tbl: { t: "The command differs by shell — this is the one place it does",
    h: ["Shell", "Command"],
    rows: [
     ["macOS / Linux (bash, zsh)", "`source .venv/bin/activate`"],
     ["Windows PowerShell", "`.venv\\Scripts\\Activate.ps1`"],
     ["Windows cmd", "`.venv\\Scripts\\activate.bat`"],
     ["Git Bash on Windows", "`source .venv/Scripts/activate`"]
    ] } },
  { term: { lines: [
   { c: "source .venv/bin/activate", w: "Rearranges PATH for this terminal session only." },
   { c: "", w: "" },
   { out: "(.venv) aryan@laptop:~/project$" },
   { w: "**Look at the prompt.** The `(.venv)` prefix is your confirmation. If it is not there, the environment is not active, no matter what you just typed." }
  ] } },
  { term: { t: "Prove it worked",
    lines: [
     { c: "which python", w: "The diagnostic from Ground Zero, doing exactly the same job." },
     { out: "/Users/aryan/project/.venv/bin/python" },
     { w: "It now points inside your project rather than at the system Python. That is the whole mechanism, visible." }
    ] } },

  { trap: "Activation applies to **one terminal window, for as long as it stays open**. Open a second tab and it is not active there. Close the terminal and it is gone. Almost every *but I installed it!* confusion is a package installed in one terminal and a program run in another. When something is missing, check the prompt for `(.venv)` before you check anything else." },

  { term: { t: "When you are done",
    lines: [
     { c: "deactivate", w: "Puts PATH back. Just closing the terminal does the same thing." }
    ] } },

  { h: "How VS Code fits in" },
  { p: "VS Code usually spots a `.venv` folder and offers to use it. Accept. If it does not, press `Ctrl + Shift + P`, run **Python: Select Interpreter**, and pick the one whose path is inside your project." },
  { p: "Once selected, every new integrated terminal activates it automatically, and the error squiggles start checking against the packages you actually installed rather than the global ones. Getting this right is the difference between an editor that helps and one that lies to you." },

  { n: "You will hear about `conda`, `poetry`, `pipenv`, `uv` and `pdm`. They all solve this same problem with more features — locking exact versions, resolving conflicts, managing Python versions themselves. `uv` in particular is dramatically faster and increasingly the default in new projects. Learn `venv` first, because it is built in, it always exists, and every one of the others is a variation on the idea you now understand.",
    nt: "The other tools you will hear about" }
 ],
 k: [
  "A virtual environment is a folder with its own interpreter and packages; activation just rearranges PATH.",
  "One per project, named `.venv`, never committed, always disposable.",
  "The `(.venv)` prefix in your prompt is the only proof it is active — check it before debugging anything.",
  "Activation lasts for one terminal session, which explains almost every *but I installed it* moment."
 ],
 r: ["Virtual Environment", "Package Manager", "Environment Variable", "Dependency"],
 drill: {
  lang: "bash",
  reps: 3,
  items: [
   { c: "python -m venv .venv", w: "create a virtual environment in a folder called .venv" },
   { c: "source .venv/bin/activate", w: "activate it on macOS or Linux" },
   { c: "which python", w: "confirm the interpreter now points inside your project" },
   { c: "deactivate", w: "put PATH back to normal" }
  ]
 }
},

{
 t: "pip and Your First Package",
 m: "setup",
 lvl: "core",
 s: "Standing on other people's work — installing it, pinning it, and reproducing it elsewhere.",
 goal: [
  "Install a package and use it in the same minute",
  "Record your project's dependencies so someone else can reproduce them",
  "Diagnose `ModuleNotFoundError` in one step"
 ],
 b: [
  { p: "Python's real superpower is not the language. It is that roughly six hundred thousand packages exist for it, and installing one takes about four seconds. Almost nothing you want to do requires starting from nothing." },
  { p: "**pip** is the tool that fetches them. It talks to **PyPI**, the Python Package Index — a public repository at `pypi.org` that anyone can publish to. That openness is the reason there is a package for everything, and also a reason to glance at what you are installing." },

  { h: "Install something" },
  { term: { t: "With your virtual environment active — check the prompt",
    lines: [
     { c: "pip install requests", w: "Downloads `requests` and everything it depends on, and puts them in the active environment. `requests` is the standard library for fetching things over HTTP, and one of the most-used packages in existence." },
     { out: "Collecting requests\n  Downloading requests-2.32.3-py3-none-any.whl (64 kB)\nCollecting urllib3<3,>=1.21.1\nCollecting certifi>=2017.4.17\nSuccessfully installed certifi-2025.8.3 charset-normalizer-3.4.1 idna-3.10 requests-2.32.3 urllib3-2.3.0" }
   ] } },
  { p: "You asked for one package and five were installed. `requests` depends on `urllib3`, which depends on others — pip resolved the whole tree for you. This is called **transitive dependency resolution**, and it is the bulk of what a package manager actually does." },

  { code: { lang: "python", file: "fetch.py", t: "Use it immediately",
    lines: [
     { c: "import requests", w: "The name you import is usually, but not always, the name you installed. `pip install scikit-learn` gives you `import sklearn`, and that mismatch catches everyone once." },
     { c: "", w: "" },
     { c: "response = requests.get(\"https://api.github.com\")", w: "Call `get` from inside `requests`, handing it a URL. The result — a whole response object — is stored in `response`." },
     { c: "print(response.status_code)", w: "The dot again: look inside `response` for something called `status_code`. `200` means the request succeeded." },
     { c: "print(response.json()[\"current_user_url\"])", w: "`json()` converts the response body into a Python dictionary; the square brackets look up one key inside it." }
    ],
    out: "200\nhttps://api.github.com/user",
    after: "Four lines to make a real network request and read a structured reply. Writing that from scratch is a week's work; someone did it, and you get it for four seconds and a command." } },

  { h: "The commands worth knowing" },
  { term: { lines: [
   { c: "pip list", w: "Everything installed in the active environment, with versions. Run it after activating to confirm you are where you think you are." },
   { c: "pip show requests", w: "Details for one package — version, dependencies, and crucially the **Location** it was installed to." },
   { c: "pip install requests==2.31.0", w: "A specific version. Two equals signs. Use this when something newer broke you." },
   { c: "pip install --upgrade requests", w: "Move to the latest." },
   { c: "pip uninstall requests", w: "Remove it. Note that its dependencies stay behind — pip does not clean those up." }
  ] } },

  { h: "Recording what your project needs" },
  { p: "Your environment is disposable and not committed to Git. So how does anyone else — or you, on a new laptop — get the same packages? You write down the list." },
  { term: { lines: [
   { c: "pip freeze > requirements.txt", w: "`pip freeze` prints every installed package with its exact version. The `>` redirects that output into a file instead of the screen — the same shell redirection idea as the pipe, sending output to a file rather than another program." },
   { c: "cat requirements.txt" },
   { out: "certifi==2025.8.3\ncharset-normalizer==3.4.1\nidna==3.10\nrequests==2.32.3\nurllib3==2.3.0" }
  ] } },
  { term: { t: "And on the other machine",
    lines: [
     { c: "python -m venv .venv", w: "A fresh, empty environment." },
     { c: "source .venv/bin/activate" },
     { c: "pip install -r requirements.txt", w: "`-r` means *read the list from this file*. Every package, at every exact version, restored." }
    ] } },
  { p: "This file **is** committed to Git. It is the difference between a project someone else can run and one that only works on your laptop — and *works on my machine* is a phrase with a long, painful history behind it." },

  { h: "The one error you will get" },
  { code: { lang: "text", t: "And the one-step diagnosis",
    lines: [
     { c: "ModuleNotFoundError: No module named 'requests'", w: "This almost never means the package does not exist. It means it is not in **the environment you are currently running**." }
    ] } },
  { ol: [
   "Is `(.venv)` in your prompt? If not, activate.",
   "Run `pip list`. Is it there? If not, install it — you installed it somewhere else.",
   "In VS Code, is the selected interpreter your `.venv`? Check the bottom-right status bar.",
   "If all three are right, check the import name — `pip install pillow` is `import PIL`, and `pip install beautifulsoup4` is `import bs4`."
  ] },

  { trap: "Do not use `sudo pip install`. It installs into the system Python that your operating system depends on, needs administrator rights it should never have, and is the classic way to break a machine's package management. If pip says permission denied, the real problem is that you forgot to activate your environment. Fix that instead." },

  { n: "`python -m pip install X` is a marginally safer form than `pip install X`. It uses *the pip belonging to the Python you just named*, which removes any ambiguity about which environment you are installing into. When something strange is happening with pip, switch to this form and the strangeness usually explains itself.",
    nt: "The form that removes all doubt" }
 ],
 k: [
  "`pip install` fetches from PyPI and resolves the whole dependency tree for you.",
  "`pip freeze > requirements.txt` records exact versions; `pip install -r requirements.txt` restores them.",
  "`ModuleNotFoundError` means *not in this environment* far more often than *not installed*.",
  "Never `sudo pip install` — it is a symptom of a forgotten activation, not a solution."
 ],
 r: ["Package Manager", "Dependency", "Virtual Environment", "Semantic Versioning"],
 drill: {
  lang: "bash",
  reps: 3,
  items: [
   { c: "pip install requests", w: "install a package into the active environment" },
   { c: "pip list", w: "show every package installed in this environment" },
   { c: "pip freeze > requirements.txt", w: "write exact versions of everything into a file" },
   { c: "pip install -r requirements.txt", w: "restore an environment from that file" },
   { c: "python -m pip install requests", w: "install using the pip belonging to a specific Python, removing all ambiguity" }
  ]
 }
}

]);
