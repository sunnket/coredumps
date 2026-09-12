/* Ground Zero — how the machine runs your code. */
TD.addLessons("zero", [

{
 t: "What a Program Actually Is",
 m: "machine",
 lvl: "core",
 s: "Before any syntax: what you are actually making when you write code.",
 goal: [
  "Say what a program is without using the word *program*",
  "Explain the difference between writing code and running code",
  "Describe what the computer is doing while your code runs"
 ],
 b: [
  { p: "You are about to spend a long time writing instructions for a machine. It is worth thirty seconds understanding what the machine is, because almost every confusion in your first month comes from a wrong mental picture of it." },
  { p: "A computer, stripped of everything else, does one thing: it reads an instruction, does it, and moves to the next one. That is the whole machine. It is extraordinarily fast — billions of instructions a second — and it is extraordinarily stupid. It has no idea what you meant. It has no idea what any of it is *for*. It reads the next instruction and does exactly that." },
  { p: "A **program** is an ordered list of those instructions, written down and saved. That is it. When people say *software*, they mean a list of instructions saved in a file. When they say *running* a program, they mean the machine is currently walking down that list." },

  { ana: "A program is a recipe, and the computer is a cook who follows instructions perfectly and thinks about nothing. Write *add salt* and it adds salt. Write *add salt* twice and it adds salt twice, without wondering whether you meant to. Forget to say *turn off the oven* and the oven stays on until the building burns down. Every bug you will ever write is the recipe saying something you did not mean.",
    at: "The obedient cook" },

  { h: "The three things every program does" },
  { p: "Whatever you go on to build — a website, a game, a model that predicts house prices — it is made of exactly three activities. There is no fourth." },
  { ol: [
   "**Input** — get something in. A number you typed, a file on disk, a click, a row from a database, a message from another computer.",
   "**Processing** — do something to it. Add it up, sort it, filter it, compare it, transform it, decide based on it.",
   "**Output** — put something out. Print to the screen, save a file, draw a pixel, send a response, write to a database."
  ] },
  { p: "Instagram is input (your photo), processing (resize, filter, store) and output (a page other people load). A machine-learning model is input (data), processing (arithmetic, an enormous amount of it) and output (a number). When you get lost inside a large program later, this is the question that finds you again: what is coming in, what is being done to it, what is going out?" },

  { h: "Writing it and running it are different moments" },
  { p: "This trips up nearly everyone at the start, so make it explicit." },
  { p: "**Writing** code is you, in a text editor, typing characters into a file and saving it. Nothing happens. The file is inert — it is text, no different from a shopping list, and the computer is not paying attention to it. You could write a program with a hundred mistakes in it and your computer would sit there perfectly happy." },
  { p: "**Running** code is a separate act, that you trigger, later, on purpose. You tell the machine: take that file and start doing what it says. *Now* things happen. Now the mistakes matter." },
  { trap: "Beginners save a file and expect something to happen. Nothing does, and they assume it is broken. Saving is not running. They are two different acts, usually seconds apart, and the gap between them is where you get to change your mind." },

  { h: "What is actually happening while it runs" },
  { p: "When you run a program, the operating system — Windows, macOS, Linux — creates something called a **process**. A process is your program plus everything it needs while alive: a slice of memory to hold its values, a position marker for which instruction it is on, and a channel to the screen and the keyboard." },
  { ol: [
   "The operating system loads your instructions into memory.",
   "It sets a marker at the first instruction.",
   "It executes that instruction, moves the marker down one, and repeats.",
   "When the list runs out — or when something goes badly wrong — the process ends and its memory is handed back."
  ] },
  { p: "The phrase *the program crashed* means step three hit an instruction it could not carry out and the whole process was stopped. The phrase *the program hung* means step three is still going, forever, because you accidentally wrote a list that loops back on itself with no way out. Both will happen to you this month, and neither breaks your computer." },

  { n: "You cannot damage your machine by writing bad code. A process is fenced in: it gets its own memory and cannot scribble on anyone else's, and the operating system can stop it at any moment. The worst a beginner's program realistically does is run forever until you close it, or delete a file you told it to delete. Write freely. Be careful specifically around deleting things, and nowhere else.",
    nt: "You are not going to break it" },

  { h: "Why any of this matters" },
  { p: "It matters because it changes what an error message means to you. When the machine says something failed, it is not being obstructive and it is not judging you. It reached an instruction it could not perform, and it is telling you which one and why. That is genuinely all an error is: a report from a very fast, very literal reader that line 12 did not make sense." },
  { p: "Hold on to the picture of the obedient cook. Every single thing in this course is about writing clearer instructions for something that will follow them exactly." }
 ],
 k: [
  "A program is a saved list of instructions. Running it means the machine is walking down that list.",
  "Every program is input, processing and output. There is no fourth thing.",
  "Writing code and running code are separate acts — saving a file does nothing on its own.",
  "The computer never infers what you meant. Every bug is instructions that were followed exactly and were wrong."
 ],
 r: ["Process", "Runtime", "Runtime Error", "Bug", "Syntax"]
},

{
 t: "Source Code, Machine Code and the Thing In Between",
 m: "machine",
 lvl: "core",
 s: "Why some languages are compiled, some are interpreted, and why anyone should care.",
 goal: [
  "Explain why a computer cannot read the code you write",
  "Say the difference between a compiler and an interpreter, and give an example of each",
  "Predict which kind of error a language will catch before it runs"
 ],
 b: [
  { p: "The last lesson said a computer reads instructions. That was true but incomplete, and the missing piece explains a decision every language has made differently." },
  { p: "The instructions a processor genuinely understands are numbers. Not words — numbers. A real instruction looks like `10110000 01100001`, and it means something like *put the value 97 into register A*. This is **machine code**, and it is the only thing the hardware can execute. Nobody writes it. Nobody has written it seriously since the 1950s, and the people who did found it as unpleasant as it sounds." },
  { p: "What you write is **source code** — text, in a language designed for humans, full of words like `if` and `print` and names you chose. The processor cannot read a single character of it. Something has to sit in the middle and turn one into the other." },

  { h: "The two strategies" },
  { p: "Every language picks one of two approaches to that translation, and the choice shapes everything about what it feels like to use." },

  { tbl: { t: "The trade every language has to make",
    h: ["", "Compiled", "Interpreted"],
    rows: [
     ["When translation happens", "Once, ahead of time, before anyone runs it", "Continuously, while it runs"],
     ["What you ship", "A finished executable — a `.exe`, a binary", "The source code itself, plus the interpreter"],
     ["Speed when running", "Fast. The translation cost was paid already", "Slower. It is translating as it goes"],
     ["Speed of your loop", "Slower — edit, compile, wait, run", "Instant — edit, run"],
     ["Errors found early", "Many. It reads the whole file before running any of it", "Few. It finds line 40's mistake only after running lines 1 to 39"],
     ["Examples", "C, C++, Rust, Go, Java (to bytecode)", "Python, JavaScript, Ruby, PHP"]
    ] } },

  { h: "What a compiler is doing" },
  { p: "A **compiler** reads your entire source file, checks it makes sense, translates all of it into machine code, and writes out a new file — the executable. That file is what people actually run, and it no longer needs your source code or the compiler to exist. This is why you can download a program and run it without installing the language it was written in." },
  { p: "Because a compiler reads everything before producing anything, it can refuse. Misspell a variable name on line 400 and a compiler tells you now, before a single instruction has run. That is a genuine safety net, and it is the strongest argument for compiled languages on a large project." },

  { h: "What an interpreter is doing" },
  { p: "An **interpreter** takes your source code and executes it directly, line by line, translating each piece the moment it is needed. There is no separate output file. When you install Python you are installing an interpreter — a program whose entire job is reading Python and doing what it says." },
  { p: "This is why Python feels immediate. There is no build step, no waiting. You save and run, and it starts doing things straight away. It is also why Python will happily run the first thirty-nine lines of your file and then stop dead at a typo on line forty — it never looked at line forty until it got there." },

  { trap: "People hear *interpreted is slower* and conclude Python is a bad choice for heavy work. That is the wrong conclusion. The trick the whole data world uses is to write the *coordination* in Python and let the heavy arithmetic drop into compiled C underneath — which is exactly what NumPy, pandas and PyTorch are. You get Python's speed of writing and C's speed of running, and later in this course you will see precisely where that boundary sits." },

  { h: "Where it leaves you" },
  { p: "Python is interpreted, so you get instant feedback and pay for it with errors that surface late. That is a good trade for someone learning, because the loop between an idea and seeing whether it worked is a few seconds long. You will meet compiled languages later and the discipline they demand will make more sense once you have felt the alternative." },
  { n: "You will hear that Java is \"compiled\" and also that it \"runs on a virtual machine\", and both are true. Java compiles to *bytecode* — an intermediate form that is not machine code — which a virtual machine then interprets. Plenty of languages sit on this middle ground. The two-way split is a map, not a law, and like all maps it is useful precisely because it leaves things out.",
    nt: "The line is blurrier than the table suggests" }
 ],
 k: [
  "Processors execute numbers. Source code is for humans and must be translated.",
  "A compiler translates everything up front and produces a standalone file; an interpreter translates and runs line by line.",
  "Compilers catch mistakes before anything runs. Interpreters find them only when execution reaches them.",
  "Python is interpreted, which is why it is immediate — and why its heavy libraries are secretly written in C."
 ],
 r: ["Compiler", "Interpreter", "Machine Code", "Runtime Environment", "Syntax Error"]
},

{
 t: "Files, Folders and the Path",
 m: "machine",
 lvl: "core",
 s: "Where your code lives, and the single concept behind half of all beginner errors.",
 goal: [
  "Read an absolute path and a relative path and say which is which",
  "Explain what the *current directory* is and why it decides whether your program works",
  "Know why `file not found` is almost never about the file"
 ],
 b: [
  { p: "You have used folders for years. What you may not have is the precise version of that idea, and the precise version is the one your code will depend on constantly." },
  { p: "A **file** is a named lump of bytes on a disk. A **folder** — the same thing as a *directory*, the word engineers use — is a file whose contents are a list of other files. That is the whole structure, and because folders can contain folders, it produces a tree." },

  { h: "A path is a set of directions" },
  { p: "A **path** is how you name a file precisely enough that there is no ambiguity. It is a route through the tree, with a separator between each step." },

  { syn: { t: "An absolute path, on macOS or Linux",
    parts: [
     { p: "/", w: "The leading slash means **start at the very top of the disk**. This is the root — everything on the machine is somewhere below it. A path that begins here is *absolute*: it means the same file no matter where you are standing when you say it." },
     { p: "Users" },
     { p: "/" },
     { p: "aryan", w: "Your home folder. Everything that belongs to you lives under here." },
     { p: "/" },
     { p: "projects" },
     { p: "/" },
     { p: "hello.py", w: "The file itself. The part after the final dot is the **extension** — a convention that tells you, and your editor, what kind of file this is." }
    ],
    after: "On Windows the same idea is written `C:\\Users\\aryan\\projects\\hello.py` — a drive letter instead of a bare slash, and backslashes instead of forward ones. Same tree, different punctuation." } },

  { h: "Where you are standing" },
  { p: "Here is the piece that is genuinely new, and it is the one that matters." },
  { p: "At every moment, a running program is *standing somewhere* in that tree. That location is called the **current working directory**, and it is not necessarily where the code file lives — it is wherever the thing that launched the program happened to be." },
  { p: "This exists so you do not have to write out the full route to everything. If you are already standing in `projects`, you can say `hello.py` and be understood. That is a **relative path**: directions from where you are now, rather than from the top of the disk." },

  { tbl: { t: "The pieces of a relative path",
    h: ["Written", "Means"],
    rows: [
     ["`data.csv`", "A file called `data.csv`, right here in the current directory"],
     ["`notes/data.csv`", "Go down into the `notes` folder, then the file"],
     ["`./data.csv`", "Identical to the first. The `.` means *here*, written out for clarity"],
     ["`../data.csv`", "Go **up** one level, then the file. Two dots means the parent"],
     ["`../../data.csv`", "Up two levels. Chain as many as you need"]
    ] } },

  { h: "Why this causes so much pain" },
  { p: "Nearly every beginner hits this within a week, in exactly this shape. You write a program that opens `data.csv`. It works. You run it again the next day from a different place, and it insists the file does not exist — while you are looking straight at the file in your file browser." },
  { p: "The file exists. The program is not standing where you think it is standing. `data.csv` is a *relative* path, so it means *`data.csv` from wherever I currently am* — and that is somewhere else." },

  { vs: { t: "Two ways to open the same file", lang: "python",
    bad: { c: "open(\"data.csv\")", label: "Depends on where you are standing",
      w: "Works when your current directory happens to contain the file, and fails otherwise. Fine for a quick script; a landmine in anything you schedule or share." },
    good: { c: "open(\"/Users/aryan/projects/data.csv\")", label: "Means the same thing from anywhere",
      w: "Unambiguous, but now it only works on your machine, with your username. In real projects you build the path from the code file's own location — which you will learn how to do later." } } },

  { ana: "A relative path is *the café two streets over*. Perfectly clear directions if the listener knows where you are standing, and useless otherwise. An absolute path is the full street address including the country. Longer, uglier, never ambiguous.",
    at: "Directions versus an address" },

  { h: "Extensions are a convention, not a rule" },
  { p: "The `.py` on the end of `hello.py` does not make a file Python. It is a hint — to you, to your editor for colouring, and to your operating system for deciding what to open it with. The contents are what they are regardless. Rename a photograph to `photo.py` and Python will try to read it as code and fail; the bytes never changed." },
  { n: "Windows hides known file extensions by default, which means `report.txt` shows as `report`, and a file genuinely named `hello.py.txt` shows as `hello.py`. This has cost beginners more hours than almost anything else on this page. Turn extensions on: File Explorer, View, tick **File name extensions**. Do it before you write your first line.",
    nt: "Turn this setting on right now" }
 ],
 k: [
  "A path is a route through the folder tree. Absolute starts at the root; relative starts from wherever the program is standing.",
  "The current working directory is where the program is standing — and it is set by whatever launched it, not by where the code file lives.",
  "`file not found` almost always means your current directory is not what you assumed, not that the file is missing.",
  "An extension is a hint about a file's contents, never a guarantee."
 ],
 r: ["File System", "File Path", "File Permissions", "Command Line Interface"]
}

]);
