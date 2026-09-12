/* Learn Coding — track definitions.

   A track is a course in one language or one skill. Order here drives the
   Learn index, the sidebar and the "what to learn next" suggestions.

   Shape mirrors a category: id, name, short, icon, two accent colours and a
   description — plus two things a category does not have:

     brief    the orientation every track opens with. What the thing is,
              why it was invented, what it is genuinely good at, where it
              is the wrong tool, who pays people to write it, and what you
              will be able to build by the end. Nobody should type a line
              of a language without knowing what it is for.

     modules  the chapters. Lessons declare which module they belong to and
              the syllabus assembles itself in this order.
*/
TD.defineTracks([

  /* ------------------------------------------------------------------ */
  {
    id: "zero",
    name: "Ground Zero — Before You Write Any Code",
    short: "Ground Zero",
    icon: "terminal",
    kind: "foundation",
    tag: "Start here",
    col: "#94a3b8", colL: "#475569",
    deck: "The machine itself, then the terminal and the editor — everything every tutorial assumes you already know.",
    desc: "Every programming course starts at line one of some language and quietly assumes you know what a file is, what a terminal does, what an IDE is for, and what to do when red text appears. This track is that assumption, written down.",

    brief: {
      born: "The prerequisite nobody teaches",
      feel: "Like being walked around the car with the bonnet up before anyone hands you the keys.",
      what: [
        "This track has no language in it. It starts with the physical machine — the actual silicon on your desk — then covers the room your code will be written in and the vocabulary everything else takes for granted.",
        "You will learn what actually happens between you typing `print(\"hi\")` and the word appearing — because once you can picture that, error messages stop being noise and start being information."
      ],
      why: [
        "The reason most people quit in week one is not that loops are hard. It is that nobody ever showed them the machine. They were handed a black window and a command to paste, with no picture of what was on the other side of it.",
        "So this track starts one step earlier than everyone else: with the box itself. Learn what a CPU actually does and the terminal stops being frightening, because you finally know what you are talking to.",
        "Every hour spent here is repaid ten times over in every track that follows, because you stop guessing at the environment and start operating it."
      ],
      good: [
        "Knowing what is inside a computer and what each part is genuinely for",
        "Understanding what a program is, physically, on a real machine",
        "Being genuinely fluent in a terminal instead of afraid of it — including the Windows one you actually have",
        "Setting up an editor that helps you rather than one that fights you",
        "Reading an error message and knowing which part matters"
      ],
      bad: [
        "It teaches no language syntax — that starts in the next track",
        "It will not make you productive on its own; it makes everything after it possible"
      ],
      used: [
        { w: "Every single day, forever", d: "You will open a terminal on your first day of work and on your last. It never stops being the tool." },
        { w: "The moment something breaks", d: "Reading a stack trace correctly is the difference between a two-minute fix and a two-hour one." },
        { w: "Every tutorial you will ever follow", d: "They all assume this track. That is exactly why it exists." }
      ],
      build: [
        "A working development machine you actually understand",
        "The confidence to run a command someone gives you — and to know when not to",
        "A repeatable method for reading an error and finding the cause"
      ]
    },

    modules: [
      {
        id: "metal", name: "The machine itself",
        desc: "The physical thing on your desk. What is inside it, what each part is for, and why any of it is beautiful."
      },
      {
        id: "machine", name: "How the machine runs your code",
        desc: "What a program is, what happens when you run one, and where your files actually live."
      },
      {
        id: "shell", name: "The terminal — first contact",
        desc: "The black window, demystified. Where it is, what the prompt means, and how to move around without fear."
      },
      {
        id: "shellwork", name: "The terminal — doing real work",
        desc: "Reading files, searching them, chaining commands, and running the programs you install."
      },
      {
        id: "shellpower", name: "The terminal — where it pays off",
        desc: "Scripts, environments, background jobs, and the handful of habits that separate confident users from nervous ones."
      },
      {
        id: "tools", name: "Editors, IDEs and setup",
        desc: "What an IDE genuinely does for you, and how to install a language without the usual pain."
      },
      {
        id: "firstrun", name: "Your first program",
        desc: "Writing a file, running it, and understanding every step in between."
      },
      {
        id: "errors", name: "When it breaks",
        desc: "Reading an error message properly, and searching for an answer like an engineer rather than a tourist."
      }
    ]
  },

  /* ------------------------------------------------------------------ */
  {
    id: "basics",
    name: "Programming Basics — the ideas every language is made of",
    short: "Programming Basics",
    icon: "atom",
    kind: "foundation",
    tag: "Learn second",
    col: "#34d399", colL: "#047857",
    deck: "Syntax, variables, types, logic, loops, functions, data, errors — taught once, in no language, so every language after this is just vocabulary.",
    desc: "The track that sits between knowing nothing and opening an IDE. Every concept a programming language can throw at you, explained without committing to a language — because the concepts are the same everywhere and only the punctuation changes. Finish this and Python, JavaScript, Java, C++ or Go stop being nine new ideas each and become one familiar idea with a new spelling.",

    brief: {
      born: "The layer under every language",
      feel: "Like learning what a noun and a verb are before learning French. Slower for a week, then permanently faster.",
      what: [
        "This track teaches programming, not *a* programming language. Variables, types, operators, conditions, loops, functions, scope, data structures, errors, memory, complexity and paradigms — the things every language has, in the order they build on each other.",
        "Examples are shown in two or three languages side by side on purpose, so you see the same idea wearing different clothes. The point is never *how do I write this in Python*, it is *what is this thing, and what will it be called wherever I meet it next*."
      ],
      why: [
        "Almost everyone learns their first language and their first concepts simultaneously, which means they cannot tell which is which. They think indentation is programming, or that semicolons are, and then the second language feels like starting over. It is not — but it will feel that way until somebody separates the two.",
        "There is a second, harder reason. The bugs that cost you whole days are almost never syntax bugs. They are concept bugs: two names pointing at one list, an off-by-one in a loop, a variable that does not exist where you thought it did, a comparison between a number and a string that quietly returns false. None of those live in a language's documentation. They live here."
      ],
      good: [
        "Being ready to open any language tutorial and skim the first five chapters, because you already know what they are describing",
        "Reading code in a language you have never used and following roughly what it does",
        "Understanding *why* your program is wrong, not just *where* — the difference between fixing a bug and guessing at one",
        "Having the vocabulary to search properly: knowing a problem is a scope problem is ninety per cent of solving it"
      ],
      bad: [
        "It will not make you employable on its own — nobody hires for concepts without a language attached",
        "You cannot run most of this track's examples verbatim; they are deliberately written in the shape all languages share",
        "It is not a substitute for building things. Concepts learned and never used evaporate in a fortnight"
      ],
      used: [
        { w: "Your first week in any new language", d: "You skim instead of study, because you are looking for how this one spells ideas you already hold." },
        { w: "Every technical interview", d: "Nobody asks you to recite syntax. They ask you to reason about data structures, complexity and edge cases — this track, exactly." },
        { w: "Reading somebody else's code", d: "Which is most of the job, forever. You cannot follow a program whose building blocks you cannot name." },
        { w: "The moment a tutorial stops helping", d: "Tutorials teach one language's answer. Concepts let you work out the answer nobody wrote down." }
      ],
      build: [
        "A mental model of what a program is doing at every line, in any language",
        "The ability to write out a solution in plain English and translate it into code afterwards",
        "A repeatable debugging method that works on code you have never seen",
        "An honest sense of which of Python, JavaScript, Java or Go you should actually learn first, and why"
      ]
    },

    modules: [
      {
        id: "syntax", name: "What syntax actually is",
        desc: "Tokens, statements, expressions, blocks and comments — the grammar underneath every language."
      },
      {
        id: "values", name: "Values, variables and types",
        desc: "What a variable really is, the six types every language has, and the copy that was never a copy."
      },
      {
        id: "logic", name: "Operators and decisions",
        desc: "Arithmetic, precedence, booleans, comparison and the if/else that makes a program more than a list."
      },
      {
        id: "repeat", name: "Loops and repetition",
        desc: "while, for, break, continue, off-by-one, and the first moment speed starts to matter."
      },
      {
        id: "funcs", name: "Functions and scope",
        desc: "Naming behaviour, arguments and returns, where names live, the call stack, and recursion."
      },
      {
        id: "data", name: "Structuring data",
        desc: "Lists, maps, sets, tuples and objects — and how to pick the right one instead of the nearest one."
      },
      {
        id: "errors", name: "Errors and debugging",
        desc: "The three kinds of wrong, reading a stack trace, exceptions, and a method that always terminates."
      },
      {
        id: "craft", name: "Before you touch a hard language",
        desc: "Memory, Big-O, paradigms, packages, APIs and async — the advanced ideas that stop C++ or Java feeling hostile."
      },
      {
        id: "think", name: "Thinking like a programmer",
        desc: "Decomposition, pseudocode, reading unfamiliar code and documentation, and choosing your first real language."
      }
    ]
  },

  /* ------------------------------------------------------------------ */
  {
    id: "python",
    name: "Python — from your first line to production data work",
    short: "Python",
    icon: "code",
    kind: "language",
    tag: "Language",
    col: "#facc15", colL: "#8a6508",
    deck: "The whole road: variables to pandas to data that no longer fits on one machine.",
    desc: "The complete Python track. Starts at the first line you will ever write and does not stop until you are reshaping millions of rows, understanding why pandas runs out of memory, and knowing what to reach for when it does.",

    brief: {
      born: "1991 · Guido van Rossum",
      feel: "Like writing down what you mean and having it run. Python has less ceremony between the idea and the working program than almost anything else.",
      what: [
        "Python is a general-purpose, high-level, interpreted language. *High-level* means it hides the machine from you — you never allocate memory or think about registers. *Interpreted* means you run the source file directly instead of compiling it into a separate program first.",
        "It was designed with an unusual priority: that code is read far more often than it is written. That single decision explains almost every feature of the language, including the one beginners find strangest — that indentation is not style, it is syntax."
      ],
      why: [
        "In the 1990s the choice was between languages that were fast to run but slow to write (C, C++) and languages that were fast to write but toys (BASIC, early scripting). Python took a third position: be genuinely slower than C, and buy readability and speed of development with that difference.",
        "That trade turned out to be exactly right for science and data, where the expensive resource is the researcher's time, not the CPU's. The heavy numerical work got pushed down into C libraries — NumPy, and everything built on it — while the code humans write and read stayed Python. That is why the entire machine-learning world speaks it."
      ],
      good: [
        "Data analysis, data science and machine learning — this is Python's home turf and nothing is close",
        "Automation and scripting: the ten-line program that saves you an hour a week",
        "Backend web services, with Django and FastAPI",
        "Being the first language you learn, because you spend your effort on ideas rather than on ceremony"
      ],
      bad: [
        "Anything where raw speed is the product — game engines, high-frequency trading loops, operating systems",
        "Mobile apps; it is not what phones want to run",
        "Very large codebases with a big team, unless you are disciplined about type hints — dynamic typing scales worse than people expect",
        "Anything that must run in a browser, where JavaScript is the only native citizen"
      ],
      used: [
        { w: "Instagram", d: "One of the largest Django deployments on earth serves the feed you scroll." },
        { w: "Every ML team you have heard of", d: "PyTorch and TensorFlow are Python interfaces over C++ and CUDA. The research is written in Python." },
        { w: "Netflix, Spotify, Dropbox", d: "Data pipelines, recommendation infrastructure and internal tooling." },
        { w: "NASA and CERN", d: "Scientific analysis, where the readability of the code is part of the peer review." }
      ],
      build: [
        "Scripts that automate the boring parts of your own week",
        "A program that reads a messy CSV and answers a real question about it",
        "Data analysis with pandas — filtering, grouping, joining, summarising millions of rows",
        "An informed judgement about when a dataset has outgrown pandas, and what to move it to"
      ]
    },

    modules: [
      {
        id: "brief", name: "Getting oriented",
        desc: "What Python is, what it is for, and what the code you are about to write actually does."
      },
      {
        id: "setup", name: "Setting up Python",
        desc: "Installing it, the REPL, running a file, and virtual environments explained properly."
      },
      {
        id: "basics", name: "The absolute basics",
        desc: "Variables, types, strings, numbers, input and output — every line explained character by character."
      },
      {
        id: "flow", name: "Making decisions and repeating work",
        desc: "if, else, while, for — the four constructs that turn a list of statements into a program."
      },
      {
        id: "loops", name: "Loops in depth",
        desc: "Every loop pattern that matters — the famous ones, the underrated ones, and the iteration logic an AI engineer is expected to already know."
      },
      {
        id: "data", name: "Holding more than one thing",
        desc: "Lists, dictionaries, tuples, sets, slicing and comprehensions."
      },
      {
        id: "func", name: "Functions",
        desc: "Naming a piece of work so you can use it again, and the scope rules that surprise everyone."
      },
      {
        id: "errfile", name: "Errors and files",
        desc: "Handling failure on purpose, and reading and writing real files on disk."
      },
      {
        id: "oop", name: "Objects and classes",
        desc: "What an object actually is, why classes exist, and when they are the wrong answer."
      },
      {
        id: "pythonic", name: "Writing real Python",
        desc: "Modules, generators, decorators, type hints and tests — the difference between working and professional."
      },
      {
        id: "numpy", name: "NumPy — arrays and real speed",
        desc: "Why loops are slow, what vectorisation means, and the array that every data library is built on."
      },
      {
        id: "pandas", name: "pandas — working with real data",
        desc: "DataFrames, loading, cleaning, filtering, grouping, joining and reshaping actual datasets."
      },
      {
        id: "scale", name: "When the data stops fitting",
        desc: "Why pandas hits a wall, and what Parquet, Polars, Spark and Hadoop actually do about it."
      },
      {
        id: "regex", name: "Regular expressions",
        desc: "Pattern matching with the re module — search, findall, sub, groups and the patterns every developer needs."
      },
      {
        id: "datetime", name: "Dates and times",
        desc: "The datetime module: creating, formatting, parsing dates, timedelta arithmetic and timezone awareness."
      },
      {
        id: "json", name: "JSON and APIs",
        desc: "Reading and writing JSON, the requests library, and talking to any API on the internet."
      },
      {
        id: "collections", name: "Collections powertools",
        desc: "Counter, defaultdict, deque and namedtuple — the specialised structures that replace patterns you write by hand."
      }
    ]
  },

  /* ------------------------------------------------------------------ */
  {
    id: "git",
    name: "Git & GitHub — the skill nobody formally teaches",
    short: "Git & GitHub",
    icon: "gitbranch",
    kind: "tool",
    tag: "Essential tool",
    col: "#fb923c", colL: "#b4460b",
    deck: "Save points, branches, undo, and how to work with other people without destroying their work.",
    desc: "Most people learn three Git commands by copying them and then live in quiet fear of the rest. This track builds the mental model first — what a commit actually is — so every command afterwards is obvious rather than memorised.",

    brief: {
      born: "2005 · Linus Torvalds, in about ten days",
      feel: "Frightening until you understand the model, then genuinely enjoyable. The fear comes entirely from not knowing what the commands do to your work.",
      what: [
        "Git is a version control system: it records snapshots of your project over time so you can see what changed, go back, and work on two things at once without them colliding.",
        "GitHub is a website that hosts Git repositories and adds collaboration on top — pull requests, issues, reviews. They are not the same thing, and knowing the difference is the first real step."
      ],
      why: [
        "Before version control, sharing code meant emailing zip files and keeping folders named `project_final_v2_REAL_use_this`. When two people edited the same file, someone's work was silently lost.",
        "Linus Torvalds wrote Git because the Linux kernel — thousands of contributors, no central authority, no trust — broke every tool that existed. The design constraints were paranoid: every copy is complete, every change is content-hashed, and nothing is ever quietly overwritten. That paranoia is why your work is recoverable even when you are certain you destroyed it."
      ],
      good: [
        "Never losing work again, including work you deleted on purpose an hour ago",
        "Trying a risky change on a branch with a guaranteed way back",
        "Working with other people on the same files without collisions",
        "Being employable — no team on earth will hire someone who cannot use it"
      ],
      bad: [
        "Large binary files — video, datasets, design assets. Git stores every version in full and the repository explodes",
        "Being a backup system; a repository on your laptop is not a backup of your laptop",
        "Secrets. Anything committed once lives in the history forever, even after you delete it"
      ],
      used: [
        { w: "Literally every software team", d: "This is not an exaggeration. It is the single most universal tool in the industry." },
        { w: "Your job application", d: "A GitHub profile with real commits is read more carefully than a CV bullet point." },
        { w: "Open source", d: "Every contribution to every public project flows through a pull request." }
      ],
      build: [
        "A repository with a clean, readable history you are not embarrassed by",
        "The reflex to branch before trying something rather than after breaking something",
        "The ability to undo any mistake — staged, committed, or pushed",
        "A public GitHub profile that shows what you can do"
      ]
    },

    modules: [
      {
        id: "why", name: "What version control is really for",
        desc: "The problem Git solves, and the mental model that makes every command make sense."
      },
      {
        id: "local", name: "Working on your own",
        desc: "init, status, add, commit — the daily loop, and what each one actually moves."
      },
      {
        id: "history", name: "History and undo",
        desc: "Reading the past, and getting out of every category of mistake."
      },
      {
        id: "branch", name: "Branches and merging",
        desc: "Working on two things at once, and resolving a conflict without panic."
      },
      {
        id: "github", name: "GitHub and other people",
        desc: "Remotes, push, pull, pull requests, reviews and forks."
      },
      {
        id: "real", name: "How teams actually work",
        desc: "Branching strategy, good commit messages, .gitignore, and the habits that mark a professional."
      }
    ]
  },

  /* ------------------------------------------------------------------ */
  {
    id: "sql",
    name: "SQL — asking questions of data",
    short: "SQL",
    icon: "database",
    kind: "language",
    tag: "Language",
    col: "#38bdf8", colL: "#0369a1",
    deck: "The one language that has outlived every framework, and the fastest route from raw data to an answer.",
    desc: "SQL is fifty years old and still the highest-leverage thing a data person can learn. This track goes from your first SELECT to window functions, CTEs and understanding why a query is slow.",

    brief: {
      born: "1974 · Donald Chamberlin and Raymond Boyce at IBM",
      feel: "Unlike anything else you will learn. You describe the answer you want, not the steps to get it — and something else works out how.",
      what: [
        "SQL is a *declarative* language for working with data held in tables. In Python you write the loop. In SQL you describe the result and the database's query planner decides how to produce it — which index to use, what order to join in, whether to scan or seek.",
        "That inversion is the whole point, and it is why the same query keeps working when the table grows from a thousand rows to a billion. You never wrote the strategy, so the database is free to change it."
      ],
      why: [
        "Before relational databases, retrieving data meant writing code that walked physical pointers between records. Change the storage layout and every program broke.",
        "Edgar Codd's 1970 paper proposed separating the logical question from the physical storage entirely. SQL is that idea made usable. It has survived object databases, XML databases, the NoSQL movement and the big-data era — all of which eventually grew SQL interfaces, because it turned out people wanted to ask questions more than they wanted new syntax."
      ],
      good: [
        "Answering questions about data that already exists, fast",
        "Aggregating, joining and reshaping across millions of rows without writing a loop",
        "Being understood — analysts, engineers, data scientists and half of product all read SQL",
        "Working essentially unchanged across Postgres, MySQL, SQLite, BigQuery, Snowflake and Spark"
      ],
      bad: [
        "Complex procedural logic — loops with intricate state belong in a real programming language",
        "Machine learning, beyond simple feature preparation",
        "Highly hierarchical or graph-shaped data, where the joins become punishing",
        "Anything requiring the exact same behaviour on every engine; the dialects differ once you leave the core"
      ],
      used: [
        { w: "Every data analyst job posting", d: "It is the single most requested skill in data roles, ahead of Python." },
        { w: "Behind almost every application", d: "The app you used this morning asked a database a question in SQL to render its first screen." },
        { w: "Modern data warehouses", d: "BigQuery, Snowflake and Redshift are enormous distributed systems whose entire interface is SQL." }
      ],
      build: [
        "The ability to answer a real business question from a raw database yourself",
        "Multi-table joins that produce correct numbers rather than plausible ones",
        "Window functions — running totals, rankings, period-over-period comparison",
        "A working sense of why a query is slow and what to do about it"
      ]
    },

    modules: [
      {
        id: "brief", name: "What a database actually is",
        desc: "Tables, rows, columns, keys — and why declarative querying changed everything."
      },
      {
        id: "select", name: "Asking your first questions",
        desc: "SELECT, FROM, column selection, aliases and the order the database really reads your query in."
      },
      {
        id: "filter", name: "Filtering and sorting",
        desc: "WHERE, comparison, AND/OR, IN, BETWEEN, LIKE, NULL handling, ORDER BY and LIMIT."
      },
      {
        id: "agg", name: "Grouping and summarising",
        desc: "COUNT, SUM, AVG, GROUP BY and HAVING — turning rows into answers."
      },
      {
        id: "join", name: "Working across tables",
        desc: "Keys, INNER and LEFT joins, and how to tell when a join has quietly duplicated your rows."
      },
      {
        id: "write", name: "Changing data",
        desc: "INSERT, UPDATE, DELETE, transactions, and the WHERE clause that saves your job."
      },
      {
        id: "design", name: "Designing a schema",
        desc: "Data types, primary and foreign keys, normalisation and constraints."
      },
      {
        id: "advanced", name: "The professional tier",
        desc: "CTEs, subqueries, window functions, indexes and reading a query plan."
      },
      {
        id: "functions", name: "String, date and conversion functions",
        desc: "TRIM, UPPER, EXTRACT, DATE_TRUNC, CAST, COALESCE and CASE — the built-in toolkit for cleaning and reshaping data."
      },
      {
        id: "views", name: "Views",
        desc: "Saving a query as a reusable table — simplification, access control and materialised views."
      }
    ]
  },

  /* ------------------------------------------------------------------ */
  {
    id: "html",
    name: "HTML — the structure of everything on the web",
    short: "HTML",
    icon: "browser",
    kind: "language",
    tag: "Web",
    col: "#f87171", colL: "#b91c1c",
    deck: "Not a programming language, and understanding why is the first real lesson.",
    desc: "HTML is the skeleton under every page you have ever loaded. Short track, high leverage — and done properly it teaches semantics and accessibility rather than a pile of divs.",

    brief: {
      born: "1993 · Tim Berners-Lee at CERN",
      feel: "Immediate. You type, you save, you refresh, it is on the screen. Nothing else in this dictionary has a shorter loop between writing and seeing.",
      what: [
        "HTML is a *markup* language, not a programming language. It has no variables, no logic and no loops. What it does is take content and label what each piece **is** — this is a heading, this is a paragraph, this is a link, this is a button.",
        "That labelling is the entire job, and it matters more than beginners expect. A screen reader, a search engine and a browser's keyboard navigation all read those labels. Mark a button as a `<div>` and it looks fine and is unusable to anyone not holding a mouse."
      ],
      why: [
        "Berners-Lee needed physicists at CERN to share documents across incompatible machines. The insight was to describe a document's *structure* and let each machine decide how to display it — so the same file works on a mainframe terminal, a laptop, a phone and a braille reader.",
        "Three decades on, that decision is why the web still renders documents written in 1995. Backwards compatibility is close to absolute, and no other platform can claim it."
      ],
      good: [
        "Giving content meaning that machines and assistive technology can act on",
        "Being learnable in days rather than months",
        "Working forever — nothing you write here will be deprecated out from under you",
        "Forms, which are far more capable natively than most people realise"
      ],
      bad: [
        "Logic of any kind — that is JavaScript's job",
        "Appearance — that is CSS's job, and mixing them is a mistake you will pay for later",
        "Anything dynamic without help; HTML alone describes a static document"
      ],
      used: [
        { w: "Every web page in existence", d: "There is no exception. View source on any site and this is what is underneath." },
        { w: "Email templates", d: "An older, stricter dialect, but the same skill." },
        { w: "Most desktop and mobile apps you use", d: "Electron, React Native for Web and friends render HTML inside a native shell." }
      ],
      build: [
        "A complete, correctly structured page from an empty file",
        "Forms that work, validate and are usable with a keyboard",
        "Markup that a screen reader can navigate — which is also the markup Google ranks"
      ]
    },

    modules: [
      {
        id: "brief", name: "What HTML is and is not",
        desc: "Markup versus programming, and what the browser does with the file you wrote."
      },
      {
        id: "structure", name: "The skeleton of a page",
        desc: "Elements, tags, attributes, nesting, and the boilerplate every page starts with."
      },
      {
        id: "content", name: "Text, links, images and lists",
        desc: "The elements that carry ninety per cent of the content on the web."
      },
      {
        id: "forms", name: "Forms and input",
        desc: "How a page collects data and sends it somewhere — properly, and accessibly."
      },
      {
        id: "semantic", name: "Semantics and accessibility",
        desc: "Choosing the element that means the right thing, and why it decides who can use your site."
      },
      {
        id: "tables", name: "Tables",
        desc: "Presenting tabular data properly — caption, thead, tbody, tfoot, scope and accessible structure."
      }
    ]
  },

  /* ------------------------------------------------------------------ */
  {
    id: "css",
    name: "CSS — making it look like you meant it",
    short: "CSS",
    icon: "layers",
    kind: "language",
    tag: "Web",
    col: "#818cf8", colL: "#4338ca",
    deck: "The layer everyone fights until they learn the box model and the cascade — then it becomes the fun part.",
    desc: "CSS has a reputation for being fiddly, and it is entirely undeserved once three ideas land: the box model, the cascade, and how layout is actually computed. This track teaches those first and the properties second.",

    brief: {
      born: "1996 · Håkon Wium Lie",
      feel: "Frustrating while you are guessing, genuinely creative once you stop. The turning point is when you can predict what a change will do before you save the file.",
      what: [
        "CSS is a language for describing presentation. You write rules that say *which* elements you mean and *how* they should look, and the browser resolves the whole set into a final appearance for every element on the page.",
        "The word cascading is the important one and it is in the name. Many rules can target the same element, and CSS has a defined procedure for deciding which one wins. Almost every moment of CSS confusion is really a moment of not knowing that procedure."
      ],
      why: [
        "Early web pages controlled appearance inside the HTML itself, with `<font>` tags and layout tables. Changing a site's look meant editing every page, and the markup became unreadable.",
        "CSS separated the two so a document's structure could be written once and presented differently for a screen, a phone, a printer or a screen reader. That separation is also why a site can be completely redesigned without touching its content."
      ],
      good: [
        "Layout that adapts to any screen — Flexbox and Grid are genuinely excellent",
        "Theming and design systems, especially with custom properties",
        "Animation and transitions, which run on the compositor and stay smooth",
        "Doing more without JavaScript than most people assume is possible"
      ],
      bad: [
        "Logic and data — CSS is not a programming language and should not be bent into one",
        "Large codebases without a naming convention; unmanaged CSS becomes unmaintainable faster than any other layer",
        "Pixel-identical rendering across every browser and device, which was never achievable and is not the goal"
      ],
      used: [
        { w: "Every site with a visual identity", d: "The design you recognise is CSS. All of it." },
        { w: "Design systems", d: "Companies encode their entire brand as CSS tokens — this dictionary does exactly that." },
        { w: "Email, print and dark mode", d: "One document, several presentations, from the same markup." }
      ],
      build: [
        "A page that looks deliberate rather than default",
        "Layouts with Flexbox and Grid that survive a phone, a tablet and a wide monitor",
        "A themeable colour system using custom properties",
        "The ability to look at any site and work out how it was built"
      ]
    },

    modules: [
      {
        id: "brief", name: "What CSS is doing",
        desc: "How a stylesheet reaches an element, and why the cascade decides everything."
      },
      {
        id: "selectors", name: "Selecting and the cascade",
        desc: "Selectors, specificity, inheritance — the rules behind why your rule is being ignored."
      },
      {
        id: "box", name: "The box model",
        desc: "Every element is a box. Content, padding, border, margin — and the one line that fixes sizing forever."
      },
      {
        id: "layout", name: "Flexbox and Grid",
        desc: "The two layout systems that made CSS layout genuinely good, and when to use which."
      },
      {
        id: "visual", name: "Colour, type and the visual layer",
        desc: "Colour systems, typography, spacing rhythm, shadows and custom properties."
      },
      {
        id: "responsive", name: "Responsive and modern CSS",
        desc: "Media queries, fluid sizing, dark mode and the modern features worth using today."
      },
      {
        id: "position", name: "Positioning",
        desc: "static, relative, absolute, fixed, sticky — the five values that control layering, overlays and sticky headers."
      },
      {
        id: "motion", name: "Transitions and animations",
        desc: "Making things move — transition, @keyframes, transform and respecting prefers-reduced-motion."
      }
    ]
  }

  ,

  /* ------------------------------------------------------------------ */
  {
    id: "js",
    name: "JavaScript & TypeScript — The Language of the Web",
    short: "JavaScript",
    icon: "browser",
    kind: "language",
    tag: "Most-hired language",
    col: "#eab308", colL: "#a16207",
    deck: "The only language a browser runs, from syntax through the DOM and async to TypeScript and React.",
    desc: "HTML gives a page structure and CSS gives it appearance. Neither makes anything happen. JavaScript is the one language every browser executes, and it has since escaped the browser entirely — servers, build tools, mobile apps and desktop software all run it. This track covers the language properly, including the async model that confuses everyone, then TypeScript and enough React to build something real.",

    brief: {
      born: "1995 · written in ten days by Brendan Eich at Netscape, then standardised as ECMAScript",
      feel: "Like a language that grew up in public: some parts are beautifully designed, some are historical accidents nobody can remove, and you need to know which is which.",
      what: [
        "JavaScript is a dynamically typed language with first-class functions, prototype-based objects and a single-threaded event loop. That last part is the one that matters most: it never blocks, which is why almost everything that takes time returns a promise instead of an answer.",
        "TypeScript is JavaScript with a type checker bolted on top. It compiles to plain JavaScript and disappears at runtime — nothing it says is enforced when the code actually runs, which is the single most misunderstood thing about it."
      ],
      why: [
        "It is the only language a browser will execute. Every interactive page on the internet runs it, and there is no alternative to learn instead.",
        "It has the largest hiring market of any language by a wide margin, and the shallowest route from beginner to something you can show someone: a page you built, live, on a real domain.",
        "For AI work it matters more than people expect. Every model you build eventually needs an interface, and that interface is JavaScript."
      ],
      good: [
        "Anything that runs in a browser — there is no competition",
        "Fast, IO-heavy servers, thanks to the event loop",
        "Sharing one language and one set of types across a whole product",
        "Prototyping something a person can actually click on"
      ],
      bad: [
        "CPU-heavy work — the single thread is a real ceiling",
        "Numerical and scientific computing, where Python owns the ecosystem",
        "Anything needing precise decimal arithmetic without a library"
      ],
      pays: "The largest volume of junior openings in software, and the market where a portfolio of live sites substitutes most effectively for a degree.",
      build: [
        "Pages that respond to what a user does, not just display",
        "Code that talks to a real API and handles the request failing",
        "Typed, componentised applications you would not be embarrassed to show"
      ]
    },

    modules: [
      {
        id: "brief", name: "Getting oriented",
        desc: "What JavaScript is, why it is everywhere, and the reputation it half deserves."
      },
      {
        id: "syntax", name: "The language itself",
        desc: "Variables, types, functions, arrays and objects — and the equality rules that catch everyone."
      },
      {
        id: "funcs", name: "Functions, scope and closures",
        desc: "First-class functions, arrow syntax, `this`, and the closure that half of JavaScript is built on."
      },
      {
        id: "dom", name: "The DOM and events",
        desc: "Finding elements, changing them, and responding to what the user does."
      },
      {
        id: "async", name: "Asynchronous JavaScript",
        desc: "The event loop, callbacks, promises and async/await — the model that explains why nothing blocks."
      },
      {
        id: "fetch", name: "Talking to a server",
        desc: "fetch, JSON, error handling and the failures that only appear in production."
      },
      {
        id: "modern", name: "Modules and tooling",
        desc: "import/export, npm, bundlers, and what actually happens between your file and the browser."
      },
      {
        id: "ts", name: "TypeScript",
        desc: "Types, interfaces, generics and narrowing — and why none of it exists at runtime."
      },
      {
        id: "react", name: "React fundamentals",
        desc: "Components, state, effects and the mental model that makes the rest of it obvious."
      }
    ]
  }
  ,

  /* ------------------------------------------------------------------ */
  {
    id: "math",
    name: "Maths for Machine Learning — only the parts you will actually use",
    short: "ML Maths",
    icon: "sigma",
    kind: "foundation",
    tag: "Foundation",
    col: "#a78bfa", colL: "#6d28d9",
    deck: "Vectors, matrices, gradients and probability — taught as tools you pick up, not a syllabus you survive.",
    desc: "The maths that stops people entering machine learning is almost never the maths the job requires. This track teaches the working subset: enough linear algebra to know what a model is doing to your data, enough calculus to know what training is, and enough probability and statistics to know when a result is real. Every idea arrives attached to the thing it explains.",

    brief: {
      born: "Linear algebra 1850s · probability 1650s · both quietly repurposed by machine learning in the 2010s",
      feel: "Much smaller than you fear, and much more visual. Almost every idea here is a picture first and a formula second.",
      what: [
        "Four subjects, each cut down to what machine learning actually spends. **Linear algebra**, because your data is a matrix and a model is a transformation of it. **Calculus**, because training is rolling downhill and a gradient is the direction. **Probability**, because a model outputs a belief rather than an answer. **Statistics**, because you have to decide whether a number you measured means anything at all.",
        "This is deliberately not a mathematics course. There are no proofs to reproduce and nothing here is examinable. The test is whether you can read a method section, diagnose a shape mismatch, or hear *the loss has stopped decreasing* and know what is being described."
      ],
      why: [
        "Two mistakes cost people years. The first is skipping the maths entirely, which works fine until the first failure that is invisible without it — a leaking feature, an unfixable class imbalance, a loss that plateaus because the gradient vanished. You cannot debug what you cannot picture.",
        "The second is more common and considerably worse: deciding to *finish all the maths first*. People spend eight months inside a linear algebra course, never reach machine learning at all, and conclude they were not clever enough. The maths and the application have to grow together, each pulling the other along. This track is written to be taken alongside the ML and deep learning tracks, not as a gate in front of them."
      ],
      good: [
        "Reading a paper's method section and following the argument rather than drowning in notation",
        "Knowing why your matrix multiplication failed by reading the shapes instead of guessing",
        "Understanding what an optimiser is doing, and why the learning rate is the setting that matters most",
        "Telling a real improvement from noise — which is most of what applied machine learning consists of"
      ],
      bad: [
        "It will not prepare you for a mathematics degree, a research post, or a proof-based interview",
        "It does not derive backpropagation formally; it makes you able to picture it, which is what the job needs",
        "It is not a substitute for building things. Maths learned without application evaporates in about six weeks"
      ],
      used: [
        { w: "Every model you will ever debug", d: "Shape errors, exploding losses, vanishing gradients and degenerate solutions all have mathematical causes and mathematical tells." },
        { w: "Embeddings and retrieval", d: "Cosine similarity, dot products, projection and distance — the whole of vector search is linear algebra wearing a product name." },
        { w: "Any experiment you report", d: "'It improved by 2%' is a claim about a distribution. Statistics is what stops a colleague dismantling it with one question." }
      ],
      build: [
        "The ability to read `(32, 512) @ (512, 10)` and know both what happens and what it means",
        "A working picture of gradient descent that survives contact with a real training run",
        "Confidence with distributions, expectation, and the specific ways averages mislead",
        "A test you can apply to any reported result to decide whether to believe it"
      ]
    },

    modules: [
      {
        id: "why", name: "How much maths you actually need",
        desc: "The honest scope, the order to learn it in, and how to stop the subject swallowing your year."
      },
      {
        id: "vectors", name: "Vectors — meaning as direction",
        desc: "Vectors, dot products, norms and cosine similarity: the mathematics underneath every embedding."
      },
      {
        id: "matrices", name: "Matrices — data and transformation",
        desc: "Matrix multiplication, shapes, transposes, and why one neural layer is a single line of linear algebra."
      },
      {
        id: "calculus", name: "Calculus — the direction downhill",
        desc: "Derivatives, partial derivatives, gradients and the chain rule, built up to gradient descent."
      },
      {
        id: "prob", name: "Probability — reasoning under uncertainty",
        desc: "Distributions, expectation, conditional probability, Bayes, and what a softmax output really is."
      },
      {
        id: "stats", name: "Statistics — deciding what is real",
        desc: "Sampling, variance, confidence, hypothesis testing, and the ways numbers lie to you."
      },
      {
        id: "read", name: "Reading the maths in the wild",
        desc: "Notation as a phrasebook: how to read a method section, an equation and a loss function without panic."
      }
    ]
  },

  /* ------------------------------------------------------------------ */
  {
    id: "ml",
    name: "Machine Learning Foundations — learning from data",
    short: "Machine Learning",
    icon: "graph",
    kind: "field",
    tag: "Core",
    col: "#4ade80", colL: "#15803d",
    deck: "What it means for a program to learn, why models fail, and how to tell a real improvement from a lucky one.",
    desc: "The classical machine learning that every AI role still rests on. Not a tour of algorithms — a working method: frame the problem, build the dataset honestly, choose something simple, evaluate it in a way that survives contact with production, and know in advance exactly how it will decay.",

    brief: {
      born: "1959 · Arthur Samuel coins the term while writing a checkers program that went on to beat him",
      feel: "Less like engineering than you expect and more like science. You form a hypothesis, run an experiment, and are usually wrong.",
      what: [
        "Machine learning is writing programs whose behaviour is derived from data rather than written down by hand. You do not write the rule *if income above X and age below Y then risky*; you supply examples and an algorithm finds the rule.",
        "That trade is the entire subject. You gain the ability to solve problems nobody could specify — reading handwriting, ranking search results, spotting fraud. You give up certainty: the model is right about a distribution, not about a case, and it will fail in ways you did not write and cannot read."
      ],
      why: [
        "Some problems have no writable rule. Nobody can enumerate what makes handwriting a 7, and every attempt through the 1970s and 80s to hand-code such rules — the expert systems era — collapsed under its own maintenance cost. The rules existed; no human could state them.",
        "The second reason is economic and much less discussed. A hand-written rule is maintained by a person. A learned rule is maintained by a pipeline. When the world shifts you retrain rather than rewrite, and that is a fundamentally cheaper way to keep a system alive — which is why machine learning won in industry long before it won in research."
      ],
      good: [
        "Prediction where you hold a lot of labelled history: fraud, churn, demand, ranking, pricing, risk",
        "Problems where being right 94% of the time is worth money and being wrong occasionally is survivable",
        "Ranking and recommendation, quietly the largest commercial application of machine learning on earth",
        "Finding structure nobody knew was there — segments, anomalies, clusters"
      ],
      bad: [
        "Problems with no data, or where the data you hold describes a world that no longer exists",
        "Anything requiring a guarantee. A model has an error rate; if that rate must be zero, write the rule",
        "Decisions you are legally obliged to explain individually, unless you deliberately stay with interpretable models",
        "Cases an if-statement solves. This category is enormous and consistently underestimated"
      ],
      used: [
        { w: "Recommendation and ranking", d: "Feeds, search results, product listings, playlists. The highest-revenue application of machine learning in existence." },
        { w: "Risk and fraud", d: "Every payment you make is scored by a model inside a few milliseconds." },
        { w: "Forecasting", d: "Demand, inventory, capacity, price. Unglamorous, enormously valuable, and hiring constantly." },
        { w: "The foundation under deep learning", d: "Overfitting, validation, leakage, metrics — every idea here applies unchanged to neural networks and to language models." }
      ],
      build: [
        "A model trained end to end on real, messy data and evaluated in a way you can defend",
        "The instinct to distrust a good result until you have gone looking for the leak",
        "Fluency with the metrics, and the judgement to pick the one that matches the business cost",
        "The ability to say *this problem does not need machine learning* and be right"
      ]
    },

    modules: [
      {
        id: "what", name: "What learning from data means",
        desc: "Supervised, unsupervised and reinforcement learning, and the one question that decides whether ML applies at all."
      },
      {
        id: "pipeline", name: "The supervised pipeline",
        desc: "Features, labels, splits, training and the loop every machine learning project actually runs."
      },
      {
        id: "fit", name: "Overfitting and generalisation",
        desc: "The central problem of the field: why a model that scores perfectly is usually broken."
      },
      {
        id: "eval", name: "Evaluation and metrics",
        desc: "Where accuracy fails, precision and recall, ROC and AUC, regression metrics, and choosing by business cost."
      },
      {
        id: "models", name: "The models worth knowing",
        desc: "Linear and logistic regression, trees, random forests, gradient boosting and k-NN — and why boosting still wins on tables."
      },
      {
        id: "features", name: "Features and data",
        desc: "Encoding, scaling, missing values, imbalance and leakage — the part that actually moves the metric."
      },
      {
        id: "tuning", name: "Hyperparameter tuning and calibration",
        desc: "Grid, random and Bayesian search with Optuna, nested cross-validation, and model probability calibration."
      },
      {
        id: "timeseries", name: "Time series and forecasting",
        desc: "Lags, rolling windows, walk-forward validation, stationarity, and predicting the future without leaking it."
      },
      {
        id: "unsup", name: "Unsupervised learning",
        desc: "Clustering, dimensionality reduction and anomaly detection, and how to evaluate something with no answer key."
      },
      {
        id: "ship", name: "From notebook to production",
        desc: "Reproducibility, serving, monitoring and drift — the difference between an experiment and a system."
      }
    ]
  },

  /* ------------------------------------------------------------------ */
  {
    id: "dl",
    name: "Deep Learning & Transformers — from a single neuron to attention",
    short: "Deep Learning",
    icon: "brain",
    kind: "field",
    tag: "The engine room",
    col: "#f472b6", colL: "#be185d",
    deck: "Neural networks built up honestly, PyTorch as the tool, and the transformer taken apart until it stops being magic.",
    desc: "Deep learning explained as what it is: a stack of matrix multiplications with a squiggle between them, trained by rolling downhill. This track builds from one neuron to backpropagation to PyTorch to attention, and finishes with pretraining and the adaptation techniques — LoRA, QLoRA, instruction tuning — that put a model to work on data of your own.",

    brief: {
      born: "1958 the perceptron · 1986 backpropagation · 2012 AlexNet · 2017 the transformer",
      feel: "Two weeks of feeling that nothing makes sense, then one afternoon where the whole thing clicks and never un-clicks.",
      what: [
        "A neural network is a function with millions of adjustable numbers in it. You show it an input, compare its output with the right answer, and nudge every number very slightly in the direction that would have made the answer better. Repeat a few million times.",
        "That is genuinely all of it. Everything else — convolutions, recurrence, attention, normalisation, dropout — is an opinion about how to arrange those numbers so the nudging works better for a particular shape of data.",
        "The final third of this track is the transformer, because that one architecture now underlies text, images, audio, protein structure and code. Building a small one from scratch is the fastest way to stop treating language models as an oracle."
      ],
      why: [
        "Classical machine learning needed you to invent the features. Somebody had to decide that *edge density* or *word count* was the thing to measure, and the ceiling on the model was the ceiling on that person's imagination.",
        "Deep learning's bet was that if you make the model deep enough and the data large enough it will invent its own features — early layers finding edges, later ones finding faces, with nobody naming either. The bet was placed in the 1980s, lost for twenty-five years on insufficient data and compute, and won decisively in 2012. Everything since has been a consequence.",
        "The transformer arrived in 2017 solving a narrow translation problem and turned out to be the general answer. Its trick — let every position look directly at every other position, in parallel — removed the sequential bottleneck that had capped model size, and the field has been scaling ever since."
      ],
      good: [
        "Perception: images, audio, video — anything where a raw signal has to become meaning",
        "Language: understanding, generation, translation, summarisation, code",
        "Any problem with a great deal of data and no obvious hand-designed features",
        "Transfer: taking a model somebody else spent millions training and adapting it in an afternoon"
      ],
      bad: [
        "Small tabular datasets, where gradient boosting still beats it and trains in seconds",
        "Anything needing an explanation of one specific decision — this is the least interpretable technology in common use",
        "Problems with a few hundred examples and no relevant pretrained model to start from",
        "Situations where the training cost, in money or in carbon, exceeds the value of the answer"
      ],
      used: [
        { w: "Every large language model", d: "GPT, Claude, Llama, Gemini — all transformers, differing in scale, data and training method rather than in kind." },
        { w: "Computer vision in production", d: "Medical imaging, defect detection, autonomous driving, document understanding." },
        { w: "Speech and audio", d: "Transcription, voice interfaces, real-time translation." },
        { w: "The interview", d: "'Explain attention' is asked in essentially every AI engineering loop. Being able to draw it is a differentiator." }
      ],
      build: [
        "A neural network written from scratch in NumPy, so that backpropagation is never mysterious again",
        "Real fluency in PyTorch: tensors, autograd, modules, the training loop, and reading someone else's model code",
        "A small transformer that you built and trained yourself",
        "A fine-tuned model, and an honest answer to whether the fine-tuning was worth doing"
      ]
    },

    modules: [
      {
        id: "nets", name: "Neural networks from first principles",
        desc: "One neuron, then a layer, then a network — and why non-linearity is the entire reason depth works."
      },
      {
        id: "train", name: "How training actually works",
        desc: "Loss functions, backpropagation, optimisers, learning rates, batches, and the failure modes of each."
      },
      {
        id: "torch", name: "PyTorch",
        desc: "Tensors, autograd, nn.Module, DataLoader, and the training loop you will write a hundred times."
      },
      {
        id: "reg", name: "Making it generalise",
        desc: "Dropout, weight decay, normalisation, augmentation and early stopping — and diagnosing which one you need."
      },
      {
        id: "arch", name: "Architectures before the transformer",
        desc: "CNNs for spatial data, RNNs and LSTMs for sequences, and the bottleneck that motivated attention."
      },
      {
        id: "attn", name: "Attention and the transformer",
        desc: "Queries, keys and values; multi-head attention; positional encoding; the full block, drawn and then built."
      },
      {
        id: "pretrain", name: "Pretraining and scale",
        desc: "Next-token prediction, scaling laws, emergence, instruction tuning and RLHF — how a raw model becomes an assistant."
      },
      {
        id: "adapt", name: "Fine-tuning and adaptation",
        desc: "Full fine-tuning, LoRA, QLoRA, quantisation and distillation — and the judgement of when not to bother."
      },
      {
        id: "gen", name: "Generative models",
        desc: "Autoencoders, VAEs, GANs and diffusion — how a model learns to produce data rather than label it, and why diffusion won."
      },
      {
        id: "frontier", name: "Beyond supervised learning",
        desc: "Self-supervised and contrastive learning, reinforcement learning and RLHF, graph networks and mixture-of-experts."
      }
    ]
  },

  /* ------------------------------------------------------------------ */
  /* ------------------------------------------------------------------ */
  {
    id: "cv",
    name: "Computer Vision \u2014 teaching machines to see",
    short: "Computer Vision",
    icon: "eye",
    kind: "field",
    tag: "See it work",
    col: "#22d3ee", colL: "#0e7490",
    deck: "From a grid of numbers to detection, segmentation and the vision-language models that read a photograph.",
    desc: "An image is a grid of numbers, and every result in computer vision is arithmetic on that grid. This track builds from raw pixels through the classical filters that still run in production, to convolutional networks, to the detection and segmentation systems that carry most commercial vision work \u2014 finishing with vision transformers and CLIP.",

    brief: {
      born: "1959 the first scanned image \u2014 1980s hand-designed features \u2014 2012 AlexNet \u2014 2020 the vision transformer",
      feel: "The moment your own webcam feed comes back with boxes drawn on it, and you realise you built that.",
      what: [
        "A photograph is a grid of numbers between 0 and 255. Nothing else is in the file. Every technique in this track is a way of doing arithmetic on that grid until useful structure falls out.",
        "You will build up from that literal statement: filters that find edges by subtracting neighbouring pixels, convolutional networks that learn their own filters, detectors that place boxes, and segmentation models that label every pixel.",
        "The last module covers the shift that is still working through the field \u2014 transformers applied to images, and models like CLIP that put pictures and text in the same space so you can search photographs with a sentence."
      ],
      why: [
        "Vision is the field where deep learning first proved itself decisively. In 2012 AlexNet cut the ImageNet error rate almost in half in a single year, after a decade of incremental progress, and every AI thing that followed traces to that afternoon.",
        "It is also the most physical branch of AI. A model that reads a chest X-ray, sorts fruit on a conveyor, or steers a tractor is doing something you can stand next to and watch. When it fails you can usually see why, which makes it an unusually good field to learn debugging in.",
        "And it employs enormous numbers of people quietly: quality inspection, medical imaging, document processing, agriculture, retail analytics, sport. Far more than the self-driving headlines suggest."
      ],
      good: [
        "Classifying images \u2014 what is this a picture of",
        "Detecting and locating objects \u2014 what is here, and precisely where",
        "Segmenting \u2014 labelling every pixel, which is what medical imaging needs",
        "Reading text and structure out of documents and photographs",
        "Searching images by description, using vision-language models"
      ],
      bad: [
        "Anything needing genuine common sense about a scene rather than pattern recognition",
        "Situations where being confidently wrong is unacceptable and you cannot check the answer",
        "Very small datasets with no relevant pretrained model \u2014 though this is rarer every year"
      ],
      used: [
        { w: "Manufacturing", d: "Defect detection on a line, running at frame rate on a small box beside the conveyor." },
        { w: "Healthcare", d: "Segmenting a tumour on a scan, or flagging which images a radiologist should read first." },
        { w: "Documents", d: "OCR and layout understanding \u2014 turning scanned paper into structured data, at enormous volume." },
        { w: "Retail and agriculture", d: "Counting stock, grading produce, spotting disease in a field from a drone." }
      ],
      build: [
        "An image classifier fine-tuned on your own photographs",
        "An object detector that draws boxes on a live webcam feed",
        "A segmentation model that outlines every object in a scene",
        "A search tool that finds images from a written description"
      ]
    },

    modules: [
      {
        id: "pixels", name: "What an image actually is",
        desc: "Grids of numbers, colour spaces, and the preprocessing decisions that quietly set your ceiling."
      },
      {
        id: "classic", name: "Classical vision, which still ships",
        desc: "Filters, edges and contours \u2014 the techniques that are exact, free and often the right answer."
      },
      {
        id: "cnn", name: "Convolutional networks",
        desc: "Convolution built from scratch, then pooling, depth, and why ResNet made very deep networks trainable."
      },
      {
        id: "transfer", name: "Transfer learning \u2014 how real CV is done",
        desc: "Nobody trains from scratch. Fine-tuning a pretrained backbone, and the augmentation that makes it work."
      },
      {
        id: "detect", name: "Detection \u2014 what, and where",
        desc: "Boxes, IoU, non-maximum suppression, mAP and the YOLO family."
      },
      {
        id: "segment", name: "Segmentation \u2014 every pixel labelled",
        desc: "Semantic, instance and panoptic segmentation, U-Net, and the metrics that matter."
      },
      {
        id: "modern", name: "Transformers, CLIP and shipping it",
        desc: "Vision transformers, image-text models, and getting a model running fast enough to be useful."
      }
    ]
  },

  {
    id: "llm",
    name: "LLM Application Engineering — making models reliable enough to sell",
    short: "LLM Engineering",
    icon: "sparkles",
    kind: "field",
    tag: "The actual job",
    col: "#22d3ee", colL: "#0e7490",
    deck: "Prompting, structured output, tool calling, retrieval, agents, evaluation and cost — the demo-to-production gap, closed.",
    desc: "Anyone can build a language model demo in an afternoon. This track is about the other ninety percent: making the thing survive ten thousand users, adversarial input, a provider outage and a finance review. Retrieval done properly, evaluation you can defend, agents that stop, and a cost line that does not eat the margin.",

    brief: {
      born: "2020 · GPT-3 makes prompting a viable interface · 2023 · the industry discovers demos were the easy part",
      feel: "Deceptively easy for a week, then genuinely hard. The difficulty is never getting an answer; it is getting the same quality of answer every time.",
      what: [
        "You are building software whose most important component is non-deterministic, occasionally confidently wrong, priced per word, and updated by somebody else without asking you. Every technique in this track exists to make that acceptable.",
        "The work divides into four honest categories. **Getting the model to do the right thing** — prompting, structured output, tool calling. **Giving it facts it does not have** — retrieval. **Knowing whether it worked** — evaluation, which is the skill the market is most short of. **Making it affordable and fast enough to ship** — caching, routing, streaming, context budgeting."
      ],
      why: [
        "For sixty years the way to make a computer do something was to state the procedure. Language models inverted that: you state the goal, in prose, and the procedure is inferred. That is an enormous gain in reach and a total loss of guarantees.",
        "The industry spent 2023 learning that the loss of guarantees is the whole problem. Thousands of impressive demos never shipped — not because the model was not clever enough, but because nobody could answer *how do you know it will not do that to a customer?* The techniques in this track are the accumulated answer to that question, and they are what an AI engineer is actually paid for."
      ],
      good: [
        "Turning unstructured text into structured data — extraction, classification, routing, summarisation at scale",
        "Answering questions over a corpus too large to read and too specific to be inside the model",
        "Drafting, rewriting and translating, where a human still reviews the output",
        "Narrow automation with clear success criteria and a cheap failure mode"
      ],
      bad: [
        "Anything requiring arithmetic, exactness or auditability without a tool doing the real work",
        "Cases where a wrong answer is expensive and no human is in the loop",
        "Problems a database query, a regular expression or a small classifier solves for a thousandth of the cost — an extremely large category",
        "Open-ended autonomous agents in production today. The failure rate compounds with every step, and the honest ceiling is lower than the marketing suggests"
      ],
      used: [
        { w: "Support and internal knowledge", d: "The most-deployed real application by a wide margin: retrieval over documents nobody has time to read." },
        { w: "Document and data extraction", d: "Invoices, contracts, forms, medical notes. Boring, everywhere, and attached directly to money." },
        { w: "Developer tooling", d: "Code assistance, review, migration, test generation." },
        { w: "Every AI engineering interview", d: "'Design a RAG system and tell me how you would evaluate it' is close to a universal question." }
      ],
      build: [
        "A retrieval system with hybrid search, reranking and citations, which you can explain choice by choice",
        "An evaluation harness with a golden set and a regression gate — the rarest thing a junior candidate can show",
        "An agent that does one narrow thing reliably, including when its tools fail",
        "A cost and latency study on your own project, with a real number at the end of it"
      ]
    },

    modules: [
      {
        id: "model", name: "What you are actually calling",
        desc: "Tokens, context windows, temperature and sampling, streaming, latency, and what a request really costs."
      },
      {
        id: "prompt", name: "Prompt and context engineering",
        desc: "System prompts, few-shot design, decomposition, and treating context as a budget you spend."
      },
      {
        id: "struct", name: "Structured output and tool calling",
        desc: "JSON schemas, validation, retries, function calling, and making a probabilistic component fit a typed system."
      },
      {
        id: "rag", name: "Retrieval-augmented generation",
        desc: "Chunking, embeddings, vector and hybrid search, reranking, citation and grounding — done the way that survives production."
      },
      {
        id: "agents", name: "Agents and tool use",
        desc: "The loop, planning, memory, stop conditions, error recovery, and an honest map of where agents break."
      },
      {
        id: "eval", name: "Evaluation",
        desc: "Golden sets, LLM-as-judge and its failure modes, regression gates and online metrics — the skill that gets you hired."
      },
      {
        id: "guard", name: "Safety, guardrails and injection",
        desc: "Prompt injection, data exfiltration, PII, output validation, and the trust boundary you must not cross."
      },
      {
        id: "ops", name: "Cost, latency and observability",
        desc: "Token accounting, caching, batching, model routing, tracing, and catching quality drift in production."
      }
    ]
  },


  /* ------------------------------------------------------------------ */
  {
    id: "finetune",
    name: "Fine-Tuning & Model Adaptation — changing behaviour, not adding facts",
    short: "Fine-Tuning",
    icon: "flask",
    kind: "field",
    tag: "The senior signal",
    col: "#f472b6", colL: "#be185d",
    deck: "When to adapt a model and when not to, the dataset that decides everything, LoRA and QLoRA, preference tuning, honest evaluation, and serving the result.",
    desc: "Fine-tuning is the skill most often attempted badly and most often *not needed*. This track teaches the judgement first — because knowing when not to fine-tune is what a senior engineer is paid for — and then teaches you to do it properly on hardware you can actually rent: dataset construction, LoRA and QLoRA, preference tuning with DPO, evaluation that would survive scrutiny, and serving adapters in production. It ends with a fine-tune you can defend in an interview, including the case where the honest conclusion was that it did not help.",

    brief: {
      born: "2018 · BERT makes pre-train-then-fine-tune the standard · 2021 · LoRA makes it affordable · 2023 · QLoRA brings a 70B model within reach of one GPU",
      feel: "Much easier to start than people expect and much harder to do *honestly* than people expect. Getting a training run to complete takes an afternoon. Knowing whether it actually improved anything takes a week, and that week is the entire skill.",
      what: [
        "A pre-trained model already knows the language. Fine-tuning continues training it on a much smaller, targeted dataset so that its **behaviour** changes: a consistent output format, a domain register, a specific task done reliably, a refusal style. You are not teaching it facts — you are teaching it habits.",
        "The distinction that governs everything: **retrieval adds knowledge, fine-tuning changes behaviour.** Fine-tuning a model on your documentation to make it *know* your product produces a model that has learned the style of your documentation and invents its contents fluently, which is worse than not knowing. Internalise that sentence and half of this field's mistakes disappear."
      ],
      why: [
        "For most of machine learning's history, a new task meant a new model trained from nothing, which meant a large labelled dataset and a large budget. Transfer learning ended that: take a model that has already learned the general structure of language, and spend a tiny fraction of the original compute steering it towards your task.",
        "Then LoRA changed the economics again. Instead of updating all 7 billion weights, you train a few million and leave the rest frozen — so the memory, the storage and the serving cost all collapse. That is why per-customer adapted models became possible at all, and why a fine-tune is now something an individual can do on rented hardware for the price of a meal rather than something only a lab can afford."
      ],
      good: [
        "Enforcing an output format or a house style that prompting cannot hold reliably over long inputs",
        "A narrow, well-defined task with plenty of examples and no good verbal description",
        "Making a small cheap model match a frontier model on one task — the strongest economic case there is",
        "A domain register: legal drafting, clinical notes, a specific language or dialect",
        "Adapting an embedding or reranker model to your own corpus, which is undervalued and frequently the highest-return fine-tune available"
      ],
      bad: [
        "Teaching the model facts. That is retrieval, and fine-tuning does it badly and confidently",
        "Anything where the knowledge changes — you would retrain on every update",
        "Cases where you have fewer than a few hundred genuinely good examples",
        "A first attempt at a problem you have not yet tried to solve with a careful prompt, which is usually cheaper and often sufficient",
        "Situations needing per-document access control, since you cannot revoke a user's access to knowledge baked into weights"
      ],
      used: [
        { w: "Cost reduction at scale", d: "A fine-tuned 7B matching a frontier model on one narrow task can cut inference cost by an order of magnitude — the most common commercial reason to do this." },
        { w: "Structured extraction", d: "Invoices, forms, clinical notes: a fixed schema, thousands of examples, and a format prompting cannot enforce perfectly." },
        { w: "Domain and language adaptation", d: "Indic languages, legal drafting, code in an in-house framework — where the base model is weakest and the gain is largest." },
        { w: "Retrieval quality", d: "Fine-tuned embedding and reranker models are how a stuck RAG system gets unstuck once the cheap fixes are exhausted." },
        { w: "The interview", d: "\"When would you not fine-tune?\" is asked constantly, and a candidate who has done one and reports an honest negative result is rare and memorable." }
      ],
      build: [
        "A decision document arguing for or against fine-tuning a specific problem, with the prompting baseline measured",
        "A cleaned, deduplicated, correctly templated instruction dataset with an honest held-out split",
        "A QLoRA fine-tune of a 7–8B model on a single rented GPU, with the memory arithmetic done in advance",
        "A DPO preference-tuning run on top of it, and an understanding of what it did and did not fix",
        "An evaluation comparing the fine-tune against prompting a larger model — including a check that general capability did not regress",
        "The adapter served in production, and a written conclusion you would defend in an interview even if it says the fine-tune lost"
      ]
    },

    modules: [
      {
        id: "decide", name: "Should you fine-tune at all?",
        desc: "The decision procedure: prompting, retrieval, fine-tuning or none of them. What each fixes, what each costs, and the baseline you must measure before you are allowed to start."
      },
      {
        id: "data", name: "The dataset is the model",
        desc: "Sourcing, generating and mining examples; cleaning, deduplication and decontamination; chat templates and loss masking; how many examples you actually need and how to split them."
      },
      {
        id: "peft", name: "LoRA and QLoRA",
        desc: "What a low-rank update is and why it works, rank and alpha, which modules to target, the 4-bit quantised base, and the memory arithmetic that tells you whether it fits before you start."
      },
      {
        id: "run", name: "Running the training",
        desc: "The stack, hyperparameters that matter, reading a loss curve, out-of-memory triage, checkpoints, and renting a GPU without wasting money."
      },
      {
        id: "align", name: "Preference tuning: DPO and friends",
        desc: "SFT then preference optimisation, why RLHF became DPO, ORPO and KTO, building a preference dataset, and what alignment tuning genuinely fixes."
      },
      {
        id: "eval", name: "Did it actually work?",
        desc: "Held-out evaluation, catastrophic forgetting, contamination, benchmark theatre, comparing against a prompted larger model, and reporting a negative result honestly."
      },
      {
        id: "serve", name: "Serving the result",
        desc: "Merging against keeping adapters, multi-adapter serving, quantising a fine-tune, versioning, rollback, and the operational cost of owning a model."
      },
      {
        id: "embed", name: "Fine-tuning retrievers and small models",
        desc: "Adapting embedding models and rerankers with contrastive training and hard negatives, plus distillation — turning a large model's outputs into a small model that ships."
      }
    ]
  },
  /* ------------------------------------------------------------------ */
  {
    id: "backend",
    name: "Backend & APIs — turning your model into a service",
    short: "Backend & APIs",
    icon: "server",
    kind: "field",
    tag: "Ship it",
    col: "#60a5fa", colL: "#1d4ed8",
    deck: "HTTP, API design, FastAPI, async, queues and caching — because a notebook is not a product.",
    desc: "The gap between a working script and something another program can call is where most AI projects quietly die. This track builds the service layer: how HTTP really works, how to design an endpoint somebody else can use, FastAPI in real depth, async concurrency, background work, caching, and the reliability patterns that stop a slow, flaky, expensive dependency taking your system down with it.",

    brief: {
      born: "1991 · HTTP · and every API you will ever write is still a conversation in it",
      feel: "Reassuringly deterministic after machine learning. Things either work or return a status code telling you why not.",
      what: [
        "A backend is a program that waits. It sits on a port, accepts requests from clients it does not control, does something, and returns a response — reliably, concurrently, and inside a time budget.",
        "For an AI engineer the shape is specific: your service spends most of its life *waiting on someone else's model*, which makes concurrency, timeouts, retries and caching the dominant concerns rather than raw compute. A request that spends four seconds blocked on a network call is a very different engineering problem from one that spends four seconds calculating."
      ],
      why: [
        "Early web applications generated a whole page per request and knew exactly who was asking. Then came mobile apps, single-page frontends, third-party integrations and other services — many clients, one source of truth. The answer was to separate the data and the logic from any particular way of displaying them and expose them over HTTP. That separation is what an API is.",
        "For AI work there is a second, sharper reason. The model is a dependency you do not own: it goes down, it changes, it rate-limits you, it is slow, and it costs money per call. The service layer is where the timeouts, retries, fallbacks, cache and cost controls live. Without one, every one of those problems reaches your user directly."
      ],
      good: [
        "Giving every client — web, mobile, another service, a colleague's script — one dependable way in",
        "Putting a boundary around something slow, expensive or unreliable",
        "Enforcing auth, rate limits, validation and logging in exactly one place",
        "Scaling and deploying independently of whatever happens to be calling you"
      ],
      bad: [
        "A one-off analysis. If it runs once and a human reads the output, a script is the right answer",
        "Genuinely long jobs held open inside a request — that is what a queue is for",
        "Premature microservices. One well-organised service beats six that must all be running for anything to work",
        "Streaming heavy data through an API when the client could read the store directly"
      ],
      used: [
        { w: "Every AI feature that reached a user", d: "The model call is a fraction of the code. The rest is the service around it." },
        { w: "Every job description for this role", d: "'FastAPI' or 'Flask' appears in the majority of applied AI postings in India." },
        { w: "The system design interview", d: "Rate limits, caching, timeouts, idempotency and queues are exactly what that round is probing for." }
      ],
      build: [
        "A FastAPI service with validated inputs, typed responses and documentation that generates itself",
        "Streaming responses, background jobs, and a cache that measurably cuts your cost",
        "Retries with backoff, circuit breaking, and timeouts that behave correctly during a provider outage",
        "An API another engineer can use without asking you a single question"
      ]
    },

    modules: [
      {
        id: "http", name: "HTTP, properly",
        desc: "Requests, methods, status codes, headers, JSON, and what actually travels over the wire."
      },
      {
        id: "api", name: "Designing an API",
        desc: "Resources, verbs, versioning, errors, pagination, and contracts other people can rely on."
      },
      {
        id: "fastapi", name: "FastAPI in practice",
        desc: "Routes, Pydantic models, dependency injection, validation, generated docs and project structure."
      },
      {
        id: "async", name: "Concurrency and async",
        desc: "Blocking versus waiting, the event loop, async and await, and why it matters most when you call a model."
      },
      {
        id: "data", name: "Persistence, caching and queues",
        desc: "Talking to a database from a service, caching with Redis, and moving slow work off the request path."
      },
      {
        id: "reliable", name: "Failure is the normal case",
        desc: "Timeouts, retries with backoff, idempotency, circuit breakers, rate limits and graceful degradation."
      },
      {
        id: "secure", name: "Auth, secrets and safety",
        desc: "API keys, tokens, CORS, input validation, secret handling, and the mistakes that leak data."
      }
    ]
  },

  /* ------------------------------------------------------------------ */
  {
    id: "docker",
    name: "Docker & Deployment — putting it somewhere with a URL",
    short: "Docker & Deploy",
    icon: "layers",
    kind: "tool",
    tag: "Essential tool",
    col: "#38bdf8", colL: "#0369a1",
    deck: "Containers explained by the problem they solve, then a real deployment you can send somebody a link to.",
    desc: "A project nobody can open is not evidence. This track takes you from *it works on my machine* to a containerised service running on a cloud with logs, secrets, health checks and a bill you understand — including the parts specific to AI workloads, which are heavier, slower to start and considerably more expensive than an ordinary web service.",

    brief: {
      born: "2013 · Docker makes Linux container primitives usable by ordinary developers",
      feel: "Bewildering for two hours — images, containers, layers, volumes — and then genuinely simple, because there are only about four ideas.",
      what: [
        "A container is your application plus every dependency it needs, packaged so it runs identically anywhere a container runtime exists. It is not a virtual machine: it shares the host kernel, so it starts in under a second and costs almost nothing in overhead.",
        "The distinction that confuses everyone is image versus container. An **image** is the frozen result of a recipe — read-only, versioned, shareable. A **container** is one running instance of it. One image, many containers, exactly as with one class and many objects."
      ],
      why: [
        "*It works on my machine* was, for twenty years, a genuine engineering crisis rather than a joke. Your laptop had Python 3.11 and CUDA 12; the server had Python 3.8 and no GPU driver at all. Deployment meant reproducing an environment nobody had ever written down, and the differences surfaced at the worst possible moment.",
        "Containers made the environment part of the artefact. The dependency list stopped being tribal knowledge in a README and became a file in the repository that either builds or does not. That change is why deployment moved from an event to a routine, and why a project without a Dockerfile now looks unfinished."
      ],
      good: [
        "Guaranteeing that what you tested is what runs",
        "Running a full stack — service, database, vector store, cache — with one command",
        "Deploying the same artefact to any cloud, which keeps you portable and therefore cheap",
        "Onboarding: a new contributor runs one command instead of losing a day"
      ],
      bad: [
        "Desktop GUI applications, where the friction outweighs the gain",
        "Pretending to be a security boundary on its own — a container shares the host kernel",
        "Storing important data inside the container, which vanishes when it does",
        "Very heavy machine learning images, where a careless Dockerfile produces an eight-gigabyte build that takes twenty minutes"
      ],
      used: [
        { w: "Essentially all modern deployment", d: "Kubernetes, ECS, Cloud Run, Render, Fly and Railway all take a container as their unit of work." },
        { w: "Local development", d: "Running Postgres, Redis and a vector database locally without installing any of them." },
        { w: "Your portfolio", d: "A repository with a working Dockerfile and a live URL reads as professional in a way a notebook never will." }
      ],
      build: [
        "A Dockerfile for a Python AI service that builds small and fast, with its layers ordered on purpose",
        "A Compose stack running your API, a database and a vector store together",
        "A deployed, publicly reachable service with secrets handled properly and health checks that mean something",
        "A cost estimate you can defend, and the knowledge of what to switch off when it is too high"
      ]
    },

    modules: [
      {
        id: "why", name: "The problem containers solve",
        desc: "Environments, dependency hell, virtual machines versus containers, and the four ideas that make up Docker."
      },
      {
        id: "images", name: "Images and Dockerfiles",
        desc: "Layers, build cache, base image choice, multi-stage builds, and a Python Dockerfile that is not enormous."
      },
      {
        id: "run", name: "Running containers",
        desc: "Ports, environment variables, volumes, logs, shells, and debugging a container that will not start."
      },
      {
        id: "compose", name: "Multiple containers with Compose",
        desc: "Defining a stack, networking between services, dependencies, and a development setup worth having."
      },
      {
        id: "ship", name: "Deploying to a cloud",
        desc: "Registries, choosing a platform, environment configuration, domains and TLS, and getting a URL that works."
      },
      {
        id: "ops", name: "Living with it in production",
        desc: "Health checks, logs, secrets, resource limits, cost control, and what to do when it is on fire."
      }
    ]
  },


  /* ------------------------------------------------------------------ */
  {
    id: "cloud",
    name: "AWS for AI Engineers — one cloud, learned properly",
    short: "AWS Cloud",
    icon: "cloud",
    kind: "tool",
    tag: "Job requirement",
    col: "#f59e0b", colL: "#b45309",
    deck: "Accounts, IAM, S3, compute, networking, Bedrock, deployment, monitoring and the bill — the AWS an AI engineer is actually expected to know.",
    desc: "Almost every AI engineering job description names a cloud, and in India the one named most often is AWS. This track teaches the roughly fifteen services you will genuinely use, in the order you will meet them, with the reasoning behind each choice — and it teaches the two things that block beginners hardest and that no tutorial covers honestly: **IAM permissions** and **VPC networking**. It ends with your own AI service deployed, monitored, budgeted and reachable at a URL you can put on a resume.",

    brief: {
      born: "2006 · S3 and EC2 launch and turn servers into an API call · 2023 · Bedrock brings hosted models into the same account",
      feel: "Overwhelming at first because there are 200 services and you need about fifteen. Once you learn which fifteen, it becomes ordinary — and the two genuinely hard parts are permissions and networking, not the services themselves.",
      what: [
        "The cloud is somebody else's computers, rented by the second, reachable through an API. That is the whole idea. What makes it different from renting a server in 2005 is that everything — a machine, a database, a network, a permission — is created and destroyed by a command, which means your infrastructure can live in a file in your repository rather than in somebody's memory.",
        "AWS is the largest of them and the one most Indian employers name. The services divide into five families you will meet in this order: **identity** (who may do what), **storage** (S3), **compute** (Lambda, ECS, EC2), **networking** (VPC), and **managed things** (databases, queues, models). Everything else is a variation on one of those."
      ],
      why: [
        "Before the cloud, shipping something meant buying hardware, waiting weeks, racking it, and then owning it whether or not anybody used your product. Capacity was a guess made months in advance, and being wrong in either direction was expensive. That is why startups were slow and why most ideas were never tried.",
        "Renting by the second changed which ideas are possible. You can put a GPU behind an API for an afternoon and switch it off, which is why a student in Pune can build and deploy something that would have needed a data centre in 2005. The trade is that the bill is now a live engineering concern rather than a fixed cost — which is exactly why an AI engineer who understands cost is valuable."
      ],
      good: [
        "Putting an AI service on the internet with TLS, secrets, logs and autoscaling, in an afternoon",
        "Storing and serving large artefacts — documents, models, embeddings — cheaply and durably",
        "Running work that is spiky, occasional, or needs a GPU you cannot justify buying",
        "Meeting enterprise requirements you cannot meet on your laptop: audit, encryption, data residency, access control"
      ],
      bad: [
        "Anything running flat out, 24 hours a day, for years — at that point owned hardware is genuinely cheaper",
        "A project where the whole cost is one small always-on service, which a ₹500-a-month VPS runs perfectly well",
        "Learning it by collecting certifications rather than by deploying something. The certificate proves recall; the deployed URL proves capability",
        "Reaching for Kubernetes on day one, which is a solution to a scale problem you almost certainly do not have"
      ],
      used: [
        { w: "The job description", d: "\"Experience with AWS/GCP/Azure\" appears in the large majority of AI engineering postings. One cloud known properly clears it; three known vaguely does not." },
        { w: "Every deployed portfolio project", d: "The difference between a notebook and evidence is a URL somebody else can open." },
        { w: "Enterprise AI work", d: "Bedrock, private networking and per-service IAM are how a bank or a hospital is allowed to use a model at all." },
        { w: "The cost conversation", d: "An engineer who can read a bill and cut it by seventy percent has produced a number that appears in somebody's review." }
      ],
      build: [
        "An AWS account set up safely — root locked down, MFA on, a budget alarm before you spend anything",
        "An S3 document store with lifecycle rules, versioning and presigned uploads",
        "A containerised AI API on ECS Fargate or Lambda, behind HTTPS, with secrets injected properly",
        "A RAG service using Bedrock and pgvector on RDS, inside a VPC, with its permissions written down",
        "CloudWatch dashboards, alarms and a monthly cost you can explain line by line"
      ]
    },

    modules: [
      {
        id: "start", name: "The account, the bill and the map",
        desc: "What the cloud actually is, regions and availability zones, the fifteen services that matter, and setting up an account you will not regret — root lockdown, MFA, budgets and the free tier."
      },
      {
        id: "iam", name: "IAM — the part that blocks everyone",
        desc: "Users, roles, policies and trust. Why a role is not a user, how a policy is evaluated, least privilege in practice, and how to debug AccessDenied without granting yourself administrator."
      },
      {
        id: "s3", name: "S3 and storing things",
        desc: "Buckets, keys, durability, storage classes, lifecycle rules, versioning, presigned URLs, and how a document corpus is actually laid out for an AI pipeline."
      },
      {
        id: "compute", name: "Choosing where your code runs",
        desc: "Lambda, ECS Fargate, App Runner, EC2 and SageMaker endpoints compared honestly — cold starts, GPU access, cost per request, and which one your AI service belongs on."
      },
      {
        id: "data", name: "Databases, queues and vectors",
        desc: "RDS Postgres with pgvector, DynamoDB, OpenSearch, SQS and EventBridge — with the reasoning for when each is the right store for an AI workload."
      },
      {
        id: "bedrock", name: "Bedrock and AI services",
        desc: "Calling models inside your own account, Knowledge Bases, Guardrails, embeddings, batch inference, and when to use Bedrock rather than a provider API directly."
      },
      {
        id: "net", name: "VPC and networking, without the fear",
        desc: "Subnets, route tables, security groups, NAT and VPC endpoints. Why your Lambda cannot reach the internet, and why your database should not be able to."
      },
      {
        id: "deploy", name: "Deploying your service for real",
        desc: "ECR, ECS Fargate behind a load balancer, secrets from Secrets Manager, custom domains and TLS, health checks and zero-downtime deploys."
      },
      {
        id: "ops", name: "Monitoring, logs and the bill",
        desc: "CloudWatch logs and metrics, structured logging, alarms that mean something, X-Ray tracing, tagging for cost attribution, and cutting an AI bill without hurting the product."
      },
      {
        id: "iac", name: "Infrastructure as code",
        desc: "Why clicking in the console does not scale, Terraform from zero, state, environments, and the amount of this that actually belongs in an interview answer."
      },
      {
        id: "interview", name: "The AWS an interviewer asks about",
        desc: "The questions that recur in AI engineering loops, the certification question answered honestly, and a checklist for the cloud section of your resume."
      }
    ]
  },
  /* ------------------------------------------------------------------ */
  {
    id: "dsa",
    name: "DSA for Interviews — the game, played deliberately",
    short: "DSA",
    icon: "code",
    kind: "field",
    tag: "Interview prep",
    col: "#fbbf24", colL: "#b45309",
    deck: "The dozen patterns that cover most interview questions, learned as patterns rather than as four hundred separate puzzles.",
    desc: "Data structures and algorithms are a hiring format more than a daily job skill, and treating them as anything else wastes months. This track is honest about that: it teaches the patterns that cover the overwhelming majority of questions, the complexity analysis every answer is graded on, and how to actually behave in the room — which is worth as many points as the solution itself.",

    brief: {
      born: "1950s as computer science · 2000s as the industry's default filter",
      feel: "Frustrating, then suddenly pattern-shaped. The turning point is the first time a new problem reminds you of an old one.",
      what: [
        "Two things wearing one name. **Data structures** are ways of arranging data so that particular operations become cheap — an array for indexing, a hash map for lookup, a heap for the smallest thing, a graph for relationships. **Algorithms** are reusable procedures for getting from a question to an answer inside a cost you can state.",
        "For interviews specifically the subject collapses into roughly a dozen recurring patterns: two pointers, sliding window, hashing, binary search, BFS and DFS, heaps, intervals, backtracking, dynamic programming. Learn the patterns and a new problem becomes recognition. Learn four hundred separate solutions and it never does."
      ],
      why: [
        "The genuine reason: choosing the wrong structure turns a fast program into a slow one, and no amount of hardware rescues an algorithm that scales quadratically. That does happen in real work — your vector search, your deduplication and your retry queue all have complexity, and somebody has to notice.",
        "The commercial reason, which is why you are really here: companies need to filter thousands of applicants cheaply, and this format is scoreable, hard to fake and language-independent. It is an imperfect proxy and everyone involved knows it. Resenting it is understandable and costs you the offer. Treat it as a specific game with learnable rules, practise deliberately for a fixed period, and then stop."
      ],
      good: [
        "Passing the screening round at every product company, which is the point",
        "Recognising that your own code will not scale, before it is in production",
        "Reasoning about cost — time and memory — as a first-class property of a design",
        "Reading unfamiliar code faster, because the structures inside it are familiar"
      ],
      bad: [
        "It is not what the job is. Almost no working engineer implements a red-black tree",
        "It does not measure engineering judgement, collaboration, or the ability to finish anything",
        "Grinding it endlessly at the expense of building projects is the single most common way strong candidates fail AI interviews",
        "Startups often skip it entirely in favour of a practical take-home"
      ],
      used: [
        { w: "The coding round, everywhere in product", d: "Google, Amazon, Microsoft, Flipkart, Swiggy, Razorpay — the same format at all of them." },
        { w: "Roughly 150 problems", d: "That is the realistic number to cover the patterns. Not 500, and not 40." },
        { w: "Your own systems, occasionally", d: "When retrieval slows down at ten million vectors, complexity stops being interview trivia." }
      ],
      build: [
        "Fluency in the dozen patterns that cover most questions",
        "The ability to state the time and space complexity of anything you write, immediately",
        "A method for the room: clarify, example, brute force, improve, code, test",
        "A finite plan with an end date, so that this does not consume your year"
      ]
    },

    modules: [
      {
        id: "game", name: "The game and how to play it",
        desc: "What is really being scored, how many problems is enough, and a study method that does not waste months."
      },
      {
        id: "complexity", name: "Complexity",
        desc: "Big-O without the mathematics: counting operations, space cost, and the growth rates that actually matter."
      },
      {
        id: "arrays", name: "Arrays, strings and hashing",
        desc: "The hash map reflex, two pointers, sliding window and prefix sums — the highest-yield material there is."
      },
      {
        id: "linear", name: "Stacks, queues and heaps",
        desc: "Monotonic stacks, queues, priority queues, and the problems that announce themselves by needing one."
      },
      {
        id: "search", name: "Sorting and binary search",
        desc: "What sorting costs, when to sort first, and binary search on an answer — the pattern most people miss."
      },
      {
        id: "trees", name: "Trees and graphs",
        desc: "Traversals, BFS and DFS, binary search trees, and modelling a problem as a graph when it is not obviously one."
      },
      {
        id: "dp", name: "Recursion and dynamic programming",
        desc: "Recursion you can trust, memoisation, tabulation, and the small set of DP shapes that keep reappearing."
      },
      {
        id: "room", name: "Performing in the room",
        desc: "Thinking aloud, clarifying, handling a blank, testing your own code, and recovering from a wrong start."
      }
    ]
  },

  /* ------------------------------------------------------------------ */
  {
    id: "hunt",
    name: "Portfolio & the Job Hunt — converting skill into an offer",
    short: "Portfolio & Hunt",
    icon: "compass",
    kind: "career",
    tag: "The last mile",
    col: "#fb7185", colL: "#be123c",
    deck: "Projects that change a hiring decision, a resume that survives eight seconds, and a search run as a process rather than a hope.",
    desc: "The gap between people who can do the work and people who get hired to do it is almost entirely process. This track covers what to build and how to write it up, the resume conventions that decide whether a human ever sees you, referrals and where roles actually come from, the interview loop stage by stage, and how to read and negotiate an offer without either underselling yourself or being unpleasant about it.",

    brief: {
      born: "The stage every course leaves out",
      feel: "Uncomfortable, because it is about self-presentation rather than competence. It is also the highest-return few weeks of the entire path.",
      what: [
        "Three separable problems, usually confused with one another. **Proof** — artefacts that demonstrate capability to a stranger in minutes. **Access** — getting your name in front of somebody who can interview you, which is mostly a referral problem. **Conversion** — turning interviews into offers, which is a rehearsable skill and not a personality trait.",
        "Nothing here is about being deserving. The market does not measure effort; it measures legible evidence. This track is about making what you can already do legible."
      ],
      why: [
        "Hiring is a decision made under uncertainty by a busy person with hundreds of applications and no way to verify most of what is in front of them. Everything in this track follows from that single fact: they are looking for cheap, credible signals, and your job is to supply them.",
        "It is also why the common advice to *just keep learning* fails. Another course adds no signal at all. A deployed project with an honest write-up, a referral from somebody who has seen your work, and a rehearsed ninety-second story about what you built — those are signals, and they are what separates two candidates of identical ability."
      ],
      good: [
        "Getting interviews at all, which is the actual bottleneck for most people",
        "Standing out without an elite degree or a brand-name employer behind you",
        "Turning the same three projects into answers for every round of every loop",
        "Making a decision between offers on something other than the headline number"
      ],
      bad: [
        "It cannot substitute for the skill. A perfect resume over an empty portfolio fails at round three",
        "It will not make an unready candidate ready; it makes a ready one visible",
        "Nothing here is a trick. Fabrication dies instantly in a project deep-dive"
      ],
      used: [
        { w: "The first eight seconds", d: "That is roughly how long a recruiter spends on a resume. Everything above the fold is doing all of the work." },
        { w: "Referrals", d: "A large share of hires at good companies arrive through one. Cold applications are the highest-volume, lowest-yield channel there is." },
        { w: "The project deep-dive round", d: "Forty-five minutes inside something you built. The easiest round if the work is yours, and the hardest if it is not." }
      ],
      build: [
        "Two or three deployed projects with README files that answer a hiring manager's questions before they are asked",
        "A one-page resume carrying metrics and trade-offs instead of responsibilities",
        "A rehearsed ninety-second project story, and a real failure story you are not embarrassed by",
        "A tracked, deliberate search with a weekly target instead of a spiral"
      ]
    },

    modules: [
      {
        id: "proof", name: "Building proof",
        desc: "What makes a project count, the ones worth building for AI roles, and finishing instead of collecting."
      },
      {
        id: "write", name: "Writing it up",
        desc: "READMEs, write-ups and demos — turning work you did into evidence a stranger can evaluate in three minutes."
      },
      {
        id: "resume", name: "Resume and profile",
        desc: "The eight-second scan, bullets with numbers in them, keyword screens, GitHub and LinkedIn."
      },
      {
        id: "apply", name: "Where jobs actually come from",
        desc: "Referrals, the channels ranked by yield, targeting, volume, and running the search as a tracked process."
      },
      {
        id: "loop", name: "The interview loop",
        desc: "Every stage, what each one is really testing, and how to prepare for it specifically."
      },
      {
        id: "offer", name: "Offers and negotiation",
        desc: "Reading a CTC breakdown, valuing equity honestly, negotiating without hostility, and choosing between offers."
      }
    ]
  },

  /* ------------------------------------------------------------------ */
  {
    id: "mlops",
    name: "MLOps & Pipelines — turning notebooks into production systems",
    short: "MLOps & Pipelines",
    icon: "layers",
    kind: "field",
    tag: "Production",
    col: "#10b981", colL: "#047857",
    deck: "Experiment tracking, model registries, data versioning, workflow orchestration, high-throughput serving, and data drift monitoring.",
    desc: "A model running in a Jupyter notebook is 10% of the job. MLOps is the engineering discipline that turns machine learning code into reliable, versioned, automated, and monitored production infrastructure.",

    brief: {
      born: "2018 · when machine learning met DevOps and realized models decay independently of code",
      feel: "Rigorous and automated. Moving away from manual notebook runs to versioned artifact pipelines and continuous monitoring.",
      what: [
        "MLOps combines machine learning, DevOps, and data engineering to automate the deployment, monitoring, and management of ML models in production.",
        "Unlike traditional software, ML systems have three moving parts: code, data, and models. Code can remain unchanged while data distribution shifts, causing silent model failure."
      ],
      why: [
        "Without MLOps, models rot in notebooks, training is un-reproducible, deployments are manual file copies, and silent accuracy drops go unnoticed.",
        "Adopting MLOps guarantees reproducibility, automated evaluation gating, instant rollbacks, and continuous observability."
      ],
      good: [
        "Automated model evaluation before deployment",
        "Version-controlled datasets and model weights using DVC and MLflow",
        "Real-time drift detection and alert triggers",
        "Scalable inference microservices behind load balancers"
      ],
      bad: [
        "Manually running Jupyter cells to produce production pickle files",
        "Deploying un-versioned models directly to servers without rollback mechanisms",
        "Ignoring input feature drift in live production traffic"
      ],
      used: [
        { w: "Automated ML Retraining", d: "Airflow/Prefect pipelines triggered by data updates or accuracy degradation." },
        { w: "Model Governance", d: "MLflow registries tracking model approval states from staging to production." }
      ]
    },

    modules: [
      {
        id: "tracking", name: "Experiment tracking & data versioning",
        desc: "MLflow tracking, DVC dataset versioning, parameters, metrics, and artifact management."
      },
      {
        id: "registry", name: "Model registries & artifact governance",
        desc: "Staging/production model lifecycle management, versioning, and CI/CD evaluation gating."
      },
      {
        id: "orchestration", name: "Pipeline orchestration & automation",
        desc: "Apache Airflow, Prefect, DAG construction, and event-driven automated retraining."
      },
      {
        id: "serving", name: "Production model serving & inference",
        desc: "FastAPI containers, ONNX Runtime, Triton Inference Server, and low-latency API design."
      },
      {
        id: "monitoring", name: "Data drift & model observability",
        desc: "Evidently AI, PSI/KS drift metrics, continuous monitoring, automated alerting, and fallback strategies."
      }
    ]
  },

  /* ------------------------------------------------------------------ */
  {
    id: "nlp",
    name: "Natural Language Processing — teaching machines to read, write and listen",
    short: "NLP",
    icon: "chat",
    kind: "field",
    tag: "AI specialisation",
    col: "#2dd4bf", colL: "#0f766e",
    deck: "Tokenisation, embeddings, classification, extraction, translation, summarisation and the evaluation metrics that keep NLP honest.",
    desc: "Text is the most abundant data on earth and the hardest for machines to understand. This track walks from raw string preprocessing through classical representations, every major NLP task, the sequence models that changed the field, generation and translation, information extraction pipelines, and the evaluation methods that separate a working system from a confident wrong one.",

    brief: {
      born: "1950s · when Alan Turing asked whether machines can think, and the first answer was to try conversation",
      feel: "Like learning to see the structure underneath language — the patterns machines can catch and the ambiguity they cannot.",
      what: [
        "NLP is the branch of AI concerned with getting computers to understand, interpret and generate human language. It spans everything from simple keyword matching to transformer models that write fluent prose.",
        "The field moved through three eras: hand-written rules, statistical models with engineered features, and neural models that learn their own representations. Modern LLMs handle most classical NLP tasks as a side effect, but specialised models remain far cheaper for high-volume production work."
      ],
      why: [
        "Language is ambiguous at every level — the same word means different things, the same sentence parses several ways, and meaning depends on context, tone and shared knowledge that is never stated. That is what makes NLP hard, and why rule-based systems hit a ceiling.",
        "Understanding NLP properly means understanding what a model is actually doing when it classifies your email as spam, extracts a date from a contract, or translates a sentence. Without that, you are tuning knobs on a box you cannot see inside."
      ],
      good: [
        "Building text classification, sentiment analysis and entity extraction systems for production",
        "Understanding how embeddings, attention and transformers work on language specifically",
        "Designing retrieval, summarisation and question answering pipelines",
        "Evaluating NLP systems honestly instead of trusting a single metric"
      ],
      bad: [
        "It will not teach you to build a transformer from scratch — that is the deep learning track",
        "It focuses on text; speech and vision are separate specialisations",
        "It does not replace the ML core track — you need loss functions, overfitting and evaluation basics first"
      ],
      used: [
        { w: "Every search engine", d: "Query understanding, document ranking and snippet extraction are NLP from end to end." },
        { w: "Every support ticket system", d: "Classification, entity extraction and sentiment scoring run on millions of tickets daily." },
        { w: "Every translation service", d: "Neural machine translation is the task that invented the transformer architecture." },
        { w: "Every AI assistant", d: "Intent recognition, slot filling and response generation are classical NLP wrapped in a chat interface." }
      ],
      build: [
        "A text classification pipeline from TF-IDF baseline through fine-tuned transformer",
        "A named entity extraction system with BIO tagging and evaluation",
        "A semantic search system with sentence embeddings and reranking",
        "An honest evaluation harness that measures what matters, not what flatters"
      ]
    },

    modules: [
      {
        id: "text", name: "Text preprocessing & representation",
        desc: "Tokenisation, normalisation, stemming, lemmatisation, stop words and regex — the cleaning that decides whether anything downstream works."
      },
      {
        id: "vectors", name: "Word & sentence embeddings",
        desc: "From bag-of-words through TF-IDF, Word2Vec, GloVe and FastText to sentence encoders — turning text into numbers a model can use."
      },
      {
        id: "tasks", name: "Core NLP tasks",
        desc: "Classification, sentiment, NER, POS tagging, dependency parsing, coreference — the tasks that turn text into structure."
      },
      {
        id: "seq", name: "Sequence models & attention",
        desc: "RNNs, LSTMs, encoder-decoder, attention and the transformer — the architectures that made modern NLP possible."
      },
      {
        id: "gen", name: "Generation & translation",
        desc: "Language modelling, machine translation, summarisation and question answering — producing text, not just labelling it."
      },
      {
        id: "info", name: "Information extraction & knowledge",
        desc: "IE pipelines, relation extraction, knowledge graphs, topic modelling, intent recognition and speech."
      },
      {
        id: "eval", name: "NLP evaluation & production",
        desc: "BLEU, ROUGE, perplexity, BERTScore, human evaluation, and the concerns that separate research from production."
      }
    ]
  },

  /* ------------------------------------------------------------------ */
  {
    id: "osnet",
    name: "Operating Systems & Networking — What Runs Under Your Code",
    short: "OS & Networking",
    icon: "cpu",
    kind: "field",
    tag: "Fundamentals",
    col: "#f97316", colL: "#c2410c",
    deck: "Processes, threads, memory, the file system, and the full path a packet takes from your browser to a server and back.",
    desc: "Every program you write runs on an operating system and talks over a network, and both are invisible until something breaks. Then they are the only thing that matters: a memory leak, a deadlock, a connection that hangs for exactly 75 seconds, a service that works locally and not in production. This track makes the layer under your code legible.",

    brief: {
      born: "1960s onwards · from batch mainframes and ARPANET to Linux and the modern internet",
      feel: "Like being shown the wiring behind a wall you have walked past every day.",
      what: [
        "An operating system is the program that shares one machine between many programs: it decides which gets the CPU, hands out memory while pretending each has the whole machine, and stands between every process and the hardware.",
        "Networking is the set of agreements that let two machines that have never met exchange bytes reliably over an unreliable path. Almost all of it is layered, and almost every bug is a layer behaving exactly as designed while you assumed otherwise."
      ],
      why: [
        "These are the two topics that separate someone who can write code from someone who can run it. Production debugging is almost entirely OS and network debugging.",
        "Every backend, DevOps, SRE and systems interview draws on this. 'What happens when you type a URL and press enter' is asked constantly, and it is really a test of whether you understand DNS, TCP, TLS and HTTP as a chain rather than as words.",
        "For AI work specifically: GPU memory, data loader workers, blocking I/O in a training loop and inter-node communication are all operating-system problems wearing a machine-learning hat."
      ],
      good: [
        "Diagnosing why a service is slow when the code is fine",
        "Reading a stack trace, a `top` output or a `tcpdump` without guessing",
        "Reasoning about concurrency: threads, locks, deadlock and race conditions",
        "Understanding why containers work at all"
      ],
      bad: [
        "This is not a systems-programming course — you will not write a kernel",
        "It will not teach you a cloud provider's console; that is the Cloud track"
      ],
      pays: "Backend, DevOps, SRE, platform and infrastructure roles treat this as assumed knowledge rather than a bonus.",
      build: [
        "The ability to narrate exactly what happens between pressing enter on a URL and the page appearing",
        "A method for diagnosing a hung, slow or vanished process rather than guessing",
        "Enough concurrency judgement to know why a program produces a different wrong answer each run"
      ]
    },

    modules: [
      {
        id: "osbasics", name: "What an operating system does",
        desc: "Kernel and user space, system calls, and why your program cannot touch the hardware directly."
      },
      {
        id: "process", name: "Processes, threads and scheduling",
        desc: "How one CPU runs many programs, what a context switch costs, and the difference between a process and a thread."
      },
      {
        id: "memory", name: "Memory",
        desc: "Virtual memory, paging, the stack and the heap, and what actually happens when you run out."
      },
      {
        id: "concurrency", name: "Concurrency and its failures",
        desc: "Race conditions, locks, deadlock, and why concurrent code is wrong in ways sequential code cannot be."
      },
      {
        id: "storage", name: "Files and I/O",
        desc: "File systems, descriptors, blocking versus non-blocking, and why I/O dominates most real programs."
      },
      {
        id: "netbasics", name: "How networks are layered",
        desc: "The OSI and TCP/IP models, addressing, ports and routing — the map everything else hangs on."
      },
      {
        id: "transport", name: "TCP, UDP and what reliability costs",
        desc: "The handshake, flow control, congestion, and when giving up reliability is the right call."
      },
      {
        id: "web", name: "DNS, HTTP and TLS",
        desc: "The full chain from a typed URL to a rendered page, and where each link fails."
      },
      {
        id: "netops", name: "Diagnosing a real network",
        desc: "ping, traceroute, netstat, curl and tcpdump — finding out where the packets are actually going."
      }
    ]
  },

  /* ------------------------------------------------------------------ */
  {
    id: "systemdesign",
    name: "System Design — Architecting Scalable, Reliable Distributed Systems",
    short: "System Design",
    icon: "network",
    kind: "field",
    tag: "Architecture & Scale",
    col: "#38bdf8", colL: "#0369a1",
    deck: "Load balancing, sharding, replication, caching topologies, message queues, resilience patterns, and end-to-end whiteboard case studies.",
    desc: "A single server handles a hundred requests a second. At ten thousand, everything that worked becomes a liability: database connections saturate, disk I/O bottlenecks, single points of failure trigger cascades, and networks partition. This track walks from scaling primitives through storage partitioning, replication, distributed consistency, caching strategies, asynchronous messaging, fault tolerance, and full end-to-end interview case studies.",

    brief: {
      born: "1970s–2000s · from mainframe distributed compute to Google and Amazon scaling the global internet",
      feel: "Like stepping back from writing code to seeing the entire machine room — understanding where every millisecond and every byte goes.",
      what: [
        "System design is the engineering discipline of composing servers, databases, networks, and caches into a coherent system that satisfies functional requirements while maintaining availability, low latency, durability, and cost efficiency under high load.",
        "There is no single 'correct' design: every architecture is a calculated set of trade-offs between consistency, latency, throughput, complexity, and operational cost."
      ],
      why: [
        "Writing a feature is 10% of engineering; making it withstand 100x traffic spikes, network cuts, and node crashes is the remaining 90%.",
        "System design interviews are the primary differentiator between mid-level and senior/staff engineers. Memorising buzzwords fails quickly; what interviewers reward is systematic estimation, clear component boundaries, and defending trade-offs out loud."
      ],
      good: [
        "Designing scalable backends that survive millions of concurrent users",
        "Choosing storage, caching, and messaging technologies based on quantitative requirements",
        "Troubleshooting cascading failures, thundering herds, and data drift in production",
        "Acing senior engineering system design whiteboard interviews"
      ],
      bad: [
        "It will not teach basic programming syntax — you need backend or language basics first",
        "It focuses on high-level architecture rather than individual framework code",
        "It does not replace deep database indexing mechanics — pair with the SQL & DB tracks"
      ],
      used: [
        { w: "Every high-traffic web platform", d: "Horizontal scaling, CDN caching, and L7 load balancing keep services alive under millions of QPS." },
        { w: "Financial and payment gateways", d: "Idempotent processing, distributed transactions (Saga), and strict consistency prevent double-charges." },
        { w: "Real-time communication apps", d: "WebSockets, pub-sub clusters, and message queues deliver billions of messages in real time." },
        { w: "Video and content delivery networks", d: "Adaptive bitrate streaming, chunking, and geo-distributed edge nodes minimise playback buffer times." }
      ],
      build: [
        "A scalable URL shortener with Base62 encoding, collision avoidance, and multi-tier caching",
        "A distributed rate limiter using Redis sliding-window algorithms and token buckets",
        "A real-time chat architecture with presence tracking, push notifications, and offline delivery",
        "A globally distributed unique ID generator (Snowflake) producing 64-bit sortable IDs"
      ]
    },

    modules: [
      {
        id: "foundations", name: "Scaling, Load Balancing & Traffic Routing",
        desc: "Vertical vs horizontal scaling, L4 vs L7 load balancers, routing algorithms, reverse proxies, API Gateways, and Anycast CDNs."
      },
      {
        id: "data", name: "Storage, Partitioning & Replication",
        desc: "Database sharding strategies, consistent hashing rings, leader-follower vs multi-leader replication, and split-brain mitigation."
      },
      {
        id: "consistency", name: "Consistency, Consensus & Transactions",
        desc: "CAP theorem, PACELC, distributed transactions (2PC vs Saga), Raft/Paxos consensus, and eventual consistency models."
      },
      {
        id: "caching", name: "Distributed Caching & Invalidation",
        desc: "Cache-Aside, Write-Through, Write-Behind, eviction policies (LRU/LFU), cache stampedes, penetration, and Redis distributed locks."
      },
      {
        id: "async", name: "Asynchronous Messaging & Event-Driven Systems",
        desc: "Message queues vs Event streams (Kafka vs RabbitMQ), consumer groups, partition ordering, Dead Letter Queues, and CQRS."
      },
      {
        id: "resilience", name: "High Availability & Interview Case Studies",
        desc: "Circuit breakers, rate limiting algorithms, backoff with jitter, distributed tracing, and end-to-end design case studies."
      }
    ]
  },

  /* ------------------------------------------------------------------ */
  {
    id: "english",
    name: "Professional English — the language the corporate world actually runs on",
    short: "Professional English",
    icon: "chat",
    kind: "career",
    tag: "Runs alongside everything",
    col: "#38bdf8", colL: "#0369a1",
    deck: "Grammar that protects your credibility, a vocabulary that upgrades on demand, and the exact phrases used in meetings, emails, reviews, negotiations and interviews.",
    desc: "Technical skill gets you into the room. Language decides what happens in it. This track is professional English end to end — the grammar that people silently judge, systematic vocabulary building through roots and synonym ladders, the written formats work actually runs on, the phrase banks for every meeting situation, presentation and public speaking craft, interview and group-discussion English, fluency and pronunciation work, and the unwritten register rules nobody writes down. Built for a non-native speaker who is already competent and wants to stop sounding junior.",

    brief: {
      born: "The skill everyone assumes and nobody teaches",
      feel: "Like discovering the meeting had a second conversation running underneath it — one made of hedges, softeners and signposts — and that you had been hearing only half of it.",
      what: [
        "Two different languages live inside *professional English*. The first is **accuracy**: tenses, articles, prepositions, agreement, punctuation — the layer that, when it slips, quietly costs you authority even when your point is right. The second is **register**: the same idea said three ways, one of which sounds junior, one neutral, one senior. Most courses teach only the first. The second is where careers are actually made.",
        "This track covers both, plus the formats that carry them: the email, the status update, the escalation, the design doc, the standup, the disagreement, the presentation, the interview answer, the salary conversation. Every module ends in phrases you can use tomorrow morning, not rules you will forget by Friday."
      ],
      why: [
        "The research is blunt about it. Sylvia Ann Hewlett's work on executive presence found observers weight **gravitas at roughly 67%, communication at 28% and appearance at only 5%** — meaning nearly a third of how senior you seem is pure delivery, and most of the rest is expressed through language too. A voice that rushes signals anxiety. A sentence whose pitch drops away at the end signals uncertainty. Neither has anything to do with whether you were right.",
        "There is a second, more practical reason. Written English is now the majority of workplace communication — Slack, tickets, pull request reviews, docs, email. Every one of those is asynchronous, which means tone is carried entirely by word choice, because nobody can see your face. A sentence that would be perfectly friendly out loud can read as an accusation in a channel. A large share of the friction between competent colleagues is this and nothing else."
      ],
      good: [
        "Sounding senior in writing — the single highest-leverage change most engineers can make",
        "Running or surviving a meeting in a second language without losing the thread",
        "Disagreeing with someone more senior than you without it becoming a problem",
        "Interviews, where the gap between what you know and what you can say under pressure decides the outcome",
        "Any role with clients, stakeholders or a distributed team — which is now most roles"
      ],
      bad: [
        "It is not an accent-elimination programme. Clarity is the goal; a neutral accent is a side effect and never the point",
        "It will not make a weak argument strong. Polished delivery of a bad idea just gets the bad idea rejected faster",
        "It is not a jargon dictionary. Jargon is covered so you can *decode* it, and the advice is mostly to use less of it than the people around you"
      ],
      used: [
        { w: "The eight-second scan", d: "Roughly how long a recruiter spends on a resume, and about how long a busy person spends deciding whether to read your email properly. The first line does nearly all of the work." },
        { w: "Every asynchronous message", d: "Slack, PR comments, tickets, docs. No face, no tone of voice — word choice is carrying one hundred per cent of the politeness." },
        { w: "The moment you disagree", d: "The highest-stakes language in professional life. There is a small set of constructions that make disagreement safe, and most people know none of them." },
        { w: "Performance review season", d: "Twice a year your whole contribution is compressed into a paragraph somebody else will skim. The vocabulary you use to describe your own work has a salary attached to it." }
      ],
      build: [
        "A personal phrase bank for meetings, disagreement, escalation and pushback that you can reach for under pressure",
        "Email and document templates for the situations that cover most workplace writing",
        "A vocabulary system based on roots and synonym ladders rather than word lists you forget",
        "A rehearsed self-introduction, project story and failure story that survive an interview panel",
        "The ability to hear the difference between junior, neutral and senior phrasing — in your own drafts, before you send them"
      ]
    },

    modules: [
      {
        id: "grammar", name: "The grammar that is actually judged",
        desc: "Tenses, articles, prepositions, agreement, modals, conditionals and punctuation — only the parts that damage credibility when they slip."
      },
      {
        id: "vocab", name: "Building vocabulary that stays",
        desc: "Roots and affixes, synonym ladders by register, confusable pairs, collocations, phrasal verbs and idioms, and the upgrade-on-demand method."
      },
      {
        id: "write", name: "Everyday written English at work",
        desc: "Emails, Slack, status updates, follow-ups, saying no, chasing, apologising, escalating — the messages that cover most of the job."
      },
      {
        id: "mail", name: "Mail and application writing",
        desc: "The formal letter, the leave and permission application, the cover letter, the cold email, the resignation, the complaint and the follow-up — the documents that decide whether a door opens."
      },
      {
        id: "docs", name: "Long-form and high-stakes writing",
        desc: "Reports, proposals, design docs, executive summaries, meeting minutes, self-appraisals, resumes and LinkedIn prose."
      },
      {
        id: "speak", name: "Meetings, disagreement and pushback",
        desc: "Phrase banks for opening, interrupting, clarifying, disagreeing, buying time, negotiating, and giving hard feedback."
      },
      {
        id: "present", name: "Presenting and public speaking",
        desc: "Structure, storytelling, voice, pacing, pauses, filler removal, slide narration, demos and handling questions you cannot answer."
      },
      {
        id: "interview", name: "Interview and group-discussion English",
        desc: "Self-introduction, STAR answers, project stories, weakness and failure questions, GD strategy and the salary conversation."
      },
      {
        id: "fluency", name: "Fluency, pronunciation and listening",
        desc: "Stress, intonation, connected speech, the sounds that actually cause misunderstanding, thinking in English, and following fast native speech."
      },
      {
        id: "culture", name: "Register, tone and the unwritten rules",
        desc: "The politeness scale, hedging and softeners, decoding indirect feedback, corporate jargon translated, and cross-cultural differences that cause real damage."
      }
    ]
  },


  /* ------------------------------------------------------------------ */
  {
    id: "conduct",
    name: "Professional Presence — everything an engineer is judged on that is not code",
    short: "Professional Presence",
    icon: "compass",
    kind: "career",
    tag: "Nobody will teach you this",
    col: "#2dd4bf", colL: "#0f766e",
    deck: "How to sit, stand, dress, greet, eat, share a room and keep a body that lasts thirty years — the syllabus every workplace assumes you were handed and nobody ever hands anybody.",
    desc: "There is a second job description running underneath the first one. It covers how you sit for eight hours, what you wear on the day the client visits, where you put yourself in a meeting room, what your face is doing while somebody disagrees with you, whether people can rely on you, and whether your back still works at forty. None of it is written down, all of it is noticed, and most of it is genuinely learnable in an afternoon. This track writes it down.",

    brief: {
      born: "The curriculum nobody prints",
      feel: "Like being handed the rules to a game you have already been playing for two years, and finding out you were losing points for things you did not know were being scored.",
      what: [
        "This track is about your body, your habits and your conduct — the layer between being competent and being *treated* as competent. It covers posture and the workstation that either preserves your spine or quietly destroys it; dress, grooming and the first ninety seconds; greetings, names, handshakes and where to sit; meetings, video calls and the room you cannot see; food, travel and the events where a career sometimes turns; punctuality, reliability and how to own a mistake; and the boundaries that keep a job from eating a life.",
        "None of it is etiquette for its own sake. Every rule here exists because breaking it costs something specific, and the cost is named each time — a disc, a promotion, a client, an evening, a reputation. Where a rule is merely a local convention rather than a real cost, that is said plainly too, because a course that cannot tell the difference is teaching superstition."
      ],
      why: [
        "Two reasons, and the first is medical. An engineer sits for something close to eighty thousand hours across a career, most of them in front of a screen that is too low, on a chair nobody adjusted, with a neck held thirty degrees forward. Back pain, neck pain and wrist pain are the occupational injuries of this profession, they arrive far earlier than anyone expects, and almost all of the prevention is a handful of settings and one habit.",
        "The second is social, and less comfortable. People form a working impression of you long before they see any of your work, and they form it from things you can control: whether you arrive on time, whether you look like you meant to be there, whether you look at people when they speak, whether you do what you said you would. Sylvia Ann Hewlett's research on executive presence put appearance at roughly 5% of the judgement — small, but it is the 5% that decides whether the other 95% ever gets a hearing."
      ],
      good: [
        "Sitting, standing and working for eight hours without paying for it at thirty-five",
        "Walking into any room — an interview, a client office, a first day — knowing exactly what to do with your hands, your eyes and your feet",
        "Being read as senior before you are senior, which is most of how people become senior",
        "The situations that catch technical people out: the client dinner, the offsite, the first video call with a camera on, the day you have to admit you broke production",
        "Working with people from cultures whose defaults are not yours, without either giving offence or taking it"
      ],
      bad: [
        "It will not fix incompetence, and it is not meant to. Presence attached to no substance is the most disliked combination in any workplace",
        "It is not a personality transplant. Quiet people stay quiet; the goal is being heard, not being loud",
        "It cannot cover every culture. Where a norm varies, the variation is named rather than papered over — but you will still have to read your own room",
        "It is not medical advice. The ergonomics here are the standard recommendations; a body that already hurts needs a physiotherapist, not a diagram"
      ],
      used: [
        { w: "Eight hours a day, every day", d: "Posture is not an occasion. It is the single highest-volume thing your body does, and the only one on this list that compounds physically." },
        { w: "The first ninety seconds", d: "Walking in, saying your name, shaking a hand, choosing a chair. It is over before you have said anything of substance, and it sets the frame everything else is heard through." },
        { w: "The day something breaks", d: "How you own a mistake in front of people is remembered for years, and there is a specific way to do it that costs you nothing and a common way that costs you a lot." },
        { w: "The dinner after the meeting", d: "More is decided over food than in the meeting that preceded it, and nobody is briefed on how to behave there." }
      ],
      build: [
        "A workstation you have actually measured, and a body that will still work in twenty years",
        "A rehearsed first ninety seconds: the entrance, the greeting, the name, the seat",
        "A default answer for every situation where you currently freeze — the dinner, the camera, the disagreement, the mistake",
        "A reliability record: a small set of habits that make you the person a team routes work through",
        "The ability to read a room's norms in ten minutes and match them, anywhere in the world"
      ]
    },

    modules: [
      {
        id: "body", name: "How a body is read",
        desc: "Sitting, standing, walking, and the signals a body sends whether or not you meant to send them: posture, open and closed, eye contact and personal space."
      },
      {
        id: "look", name: "Dress, grooming and the first look",
        desc: "The four dress codes and how to tell which room you are in, plus the maintenance details that get noticed only when they are missing."
      },
      {
        id: "room", name: "Rooms, greetings and meetings",
        desc: "Entering, introducing, the handshake, names, where to sit, how to behave in a meeting, and the video call that is now most of your professional presence."
      },
      {
        id: "desk", name: "The workstation and the working day",
        desc: "The desk, the chair, the screen and the laptop trap; then breaks, eyes, wrists, sleep and the rhythm that makes eight hours survivable."
      },
      {
        id: "table", name: "Food, travel and the events",
        desc: "Office lunch, the client dinner, the formal cover, alcohol, offsites, travel and the party — the situations technical people are least prepared for."
      },
      {
        id: "time", name: "Time, reliability and reputation",
        desc: "Punctuality as arithmetic, the reliability ledger, saying no, and how to own a mistake without losing standing."
      },
      {
        id: "people", name: "People, boundaries and politics",
        desc: "Credit, disagreement, feedback, gossip, managing up, boundaries that hold, and how presence works when nobody can see you."
      }
    ]
  },
  /* ------------------------------------------------------------------ */
  {
    id: "aptitude",
    name: "Aptitude — from scratch to exam-hard",
    short: "Aptitude",
    icon: "sigma",
    kind: "foundation",
    tag: "Clears the filter",
    col: "#f59e0b", colL: "#b45309",
    deck: "Quantitative aptitude, data interpretation, logical reasoning and verbal ability — built from arithmetic you half-remember up to the speed and traps of a real test.",
    desc: "The test between you and the interview. This track builds quantitative aptitude from the number system upward, then arithmetic, algebra, geometry and modern maths, then data interpretation, the full logical-reasoning catalogue, verbal ability, and finally the exam craft — question selection, timing, negative-marking arithmetic and mock analysis — that decides scores far more than knowing one more formula does. Written to work for campus placements, CAT, banking and government exams, and any company aptitude round.",

    brief: {
      born: "The filter, not the job",
      feel: "Unfair at first, then mechanical, then genuinely fast. The change happens the week you stop solving questions and start recognising them.",
      what: [
        "Four separate skills wearing one name. **Quantitative aptitude** — arithmetic, algebra, geometry, counting. **Data interpretation** — reading tables and charts under time pressure. **Logical reasoning** — arrangements, puzzles, syllogisms, coding. **Verbal ability** — comprehension, para jumbles, sentence correction, critical reasoning.",
        "It also contains a fifth skill that no syllabus lists and that separates a 60th percentile from a 95th: **question selection**. In a sectional test with negative marking, choosing which twelve of twenty questions to attempt is worth more marks than solving any single one of them faster."
      ],
      why: [
        "Almost every large employer uses an aptitude round as a *cheap first filter*, because a test scales to fifty thousand applicants and an interview does not. It is not measuring whether you can do the job. It is measuring whether you can be safely removed from the pile. That is a bleak framing, and it is also exactly why it is beatable: a filter is a fixed, well-documented, entirely learnable pattern.",
        "The second reason is compounding. The topics repeat across every exam that exists — placements, CAT, banking, government, GRE. Percentages appear again in profit and loss, in data interpretation, in compound interest and in mixture problems. Learn the base layer properly once and four sections get easier at the same time."
      ],
      good: [
        "Campus and off-campus placement tests, which are the immediate reason most people are here",
        "CAT, XAT and other MBA entrances, where quant, DI/LR and VARC are the whole paper",
        "Banking and government exams, which lean heavier on arithmetic speed and puzzle-based reasoning",
        "Consulting and finance first rounds, where the same skills reappear as guesstimates and case maths"
      ],
      bad: [
        "It is not mathematics. Nothing here will help you prove a theorem, and a maths degree is not much of an advantage — speed and pattern recognition are",
        "It does not transfer directly to the coding interview. Do the DSA track for that",
        "Cramming shortcuts without the underlying concept fails the moment a question is worded slightly differently, which is exactly what hard papers do on purpose"
      ],
      used: [
        { w: "The first round, before anyone reads your resume", d: "Most placement processes shortlist on the test alone. Your projects are not looked at until after you pass it." },
        { w: "Under a 60–90 second per question budget", d: "Every technique in this track exists because of that clock. A method that is correct but slow is a wrong method here." },
        { w: "With negative marking", d: "A quarter-mark penalty changes the maths of guessing completely, and most candidates have never actually worked out where their break-even lies." },
        { w: "Guesstimates and case maths", d: "Consulting interviews, product-sense rounds and even some senior technical interviews are aptitude wearing different clothes." }
      ],
      build: [
        "A formula sheet you wrote yourself, which is the only kind anyone ever revises",
        "Mental-arithmetic speed: tables to 20, squares to 30, common fractions as percentages, and approximation you actually trust",
        "A worked method for every standard question type, and the ability to recognise the type in under ten seconds",
        "A personal attempt strategy — which sections first, which questions to skip on sight, and where your guessing break-even is",
        "A mock analysis routine that turns a bad score into a specific list of fixes instead of a bad mood"
      ]
    },

    modules: [
      {
        id: "numbers", name: "Numbers and calculation speed",
        desc: "Number system, divisibility, HCF/LCM, remainders, factors, surds and indices — plus the mental arithmetic the whole track runs on."
      },
      {
        id: "arith", name: "Commercial arithmetic",
        desc: "Percentages, profit and loss, discount, simple and compound interest, ratio and proportion, averages, mixtures and alligation."
      },
      {
        id: "tsd", name: "Time, speed, distance and work",
        desc: "Relative speed, trains, boats and streams, races, circular tracks, time and work, and pipes and cisterns."
      },
      {
        id: "algebra", name: "Algebra",
        desc: "Linear and quadratic equations, inequalities, progressions, functions and graphs, logarithms, and the identities worth memorising."
      },
      {
        id: "geometry", name: "Geometry and mensuration",
        desc: "Triangles, circles, polygons, similarity, 2D and 3D mensuration, coordinate geometry and the trigonometry that appears in tests."
      },
      {
        id: "counting", name: "Counting, probability and sets",
        desc: "Permutations and combinations, arrangement patterns, probability, set theory and Venn diagrams."
      },
      {
        id: "di", name: "Data interpretation",
        desc: "Tables, bar and line charts, pie charts, caselets and mixed sets — read fast, approximate safely, and skip the set that is a trap."
      },
      {
        id: "logical", name: "Logical reasoning",
        desc: "Seating and arrangement puzzles, blood relations, directions, syllogisms, coding-decoding, series, clocks, calendars, cubes and dice."
      },
      {
        id: "verbal", name: "Verbal ability and critical reasoning",
        desc: "Reading comprehension under time, para jumbles, para summary, sentence correction, and assumption-inference-conclusion questions."
      },
      {
        id: "exam", name: "Exam craft",
        desc: "Question selection, timing, negative-marking maths, sectional strategy, mock analysis, and what each major exam actually rewards."
      }
    ]
  }
]);

/* ======================================================================
   The roadmap.

   Tracks say what they teach. Stages say WHEN to take them and why that
   moment and not another — which is the question a beginner actually has
   and the one a grid of cards cannot answer.

   A stage is a rung on the ladder:

     n        the rung number, used as the visible label
     name     what this rung is for, in plain words
     lede     one sentence a complete beginner can act on
     who      how to know you are standing on this rung right now
     skip     when it is genuinely fine to step over it
     gets     what you can do once you are off it — the reason to climb
     tracks   which tracks live here, in the order to take them
     optional true when it is a branch rather than a rung

   Changing the roadmap means editing this list and nothing else.
   ====================================================================== */
TD.defineStages([

  {
    n: 1,
    id: "ground",
    name: "Get the machine ready",
    lede: "Before any language: what a program is, what the terminal does, and how to set up an editor that helps you.",
    who: "You have never opened a terminal, or a tutorial has told you to \"run this command\" and you did not know where.",
    skip: "You already use a terminal comfortably and have an editor set up.",
    gets: "A working machine you understand, and the confidence to run a command instead of fearing it.",
    tracks: ["zero"]
  },

  {
    n: 2,
    id: "concepts",
    name: "Learn how programming works",
    lede: "Every idea a language can throw at you — variables, types, logic, loops, functions, data, errors — taught once, in no language.",
    who: "You are about to pick a language, or you have tried one and the concepts never quite clicked.",
    skip: "Nothing here is safe to skip if this is your first time. This is the stage most courses leave out, and its absence is why people stall in month two.",
    gets: "The vocabulary and the mental model. Every language after this is spelling, not new ideas.",
    tracks: ["basics"]
  },

  {
    n: 3,
    id: "language",
    name: "Learn one real language",
    lede: "Now spend the concepts on actual syntax. Python first unless you have a specific reason otherwise — and SQL alongside it, because it is small and it never goes out of date.",
    who: "You can explain what a variable, a loop and a function are without looking them up.",
    skip: "Only if you already write one language fluently.",
    gets: "The ability to build something real and finish it.",
    tracks: ["python", "sql"]
  },

  {
    n: 4,
    id: "professional",
    name: "Work the way professionals work",
    lede: "Version control. Start this in your first weeks of real code, not your first year — it makes experimenting free, because nothing can be lost.",
    who: "You have written a script you would be upset to lose.",
    skip: "Do not skip it. Delay it by a few weeks at most.",
    gets: "A permanent undo, a record of every change, and the ability to work with other people.",
    tracks: ["git"]
  },

  {
    n: 5,
    id: "web",
    name: "Build for the browser",
    lede: "A branch, not a rung. Take it when the thing you want to build is a website — otherwise carry straight on.",
    who: "You want to make something people open in a browser.",
    skip: "Skip entirely if you are heading for data, scripting or backend work.",
    gets: "Pages you can put on the internet.",
    tracks: ["html", "css", "js"],
    optional: true
  },

  {
    n: 6,
    id: "foundations",
    name: "Get the maths and the method",
    lede: "The working subset of linear algebra, calculus, probability and statistics — taken alongside your first models, never as a gate in front of them.",
    who: "You can write Python comfortably and you are about to meet your first model.",
    skip: "Nobody should skip this entirely, but everybody should take it in parallel rather than in sequence. Two hours a week beside the ML track beats two months of it alone.",
    gets: "The ability to read a method section, diagnose a shape error, and tell a real improvement from noise.",
    tracks: ["math", "ml"]
  },

  {
    n: 7,
    id: "deep",
    name: "Learn how the models actually work",
    lede: "Neural networks from one neuron to the transformer, then the two modalities — language and vision — and the application engineering that turns a model into a product people pay for.",
    who: "You have trained a classical model, evaluated it honestly, and want to know what is inside the thing everyone is talking about.",
    skip: "Do not skip the deep learning track and jump straight to LLM work. It is possible, it is common, and it is exactly why so many people cannot debug their own retrieval.",
    gets: "A transformer you built yourself, and a retrieval system with an evaluation harness behind it.",
    tracks: ["dl", "llm", "nlp", "cv", "finetune"]
  },

  {
    n: 8,
    id: "production",
    name: "Make it something other people can use",
    lede: "A service, in a container, on the internet. This is the rung that separates a portfolio from a folder of notebooks.",
    who: "You have something that works on your machine and nowhere else.",
    skip: "Never. A project nobody can open is not evidence, however good the model inside it is.",
    gets: "A deployed URL, an API another engineer can call, and a cost you can explain.",
    tracks: ["backend", "docker", "cloud", "osnet", "mlops", "systemdesign"]
  },

  {
    n: 9,
    id: "filters",
    name: "Clear the filters humans put in front of the work",
    lede: "The aptitude test that shortlists before anyone reads your resume, the professional English that decides what happens once you are in the room, and the conduct everybody grades you on without ever mentioning it.",
    who: "You can build things, and the thing standing between you and an offer is now a timed test or a conversation rather than a missing skill.",
    skip: "Skip the aptitude track only if every company you are targeting is a startup with no test round — and check that before you assume it. Nobody should skip the English track; run it in parallel from day one, twenty minutes at a time, rather than treating it as a stage you arrive at.",
    gets: "Past the automated cut, and audible in the room afterwards — the two places where competent people most often lose to less competent ones.",
    tracks: ["aptitude", "english", "conduct"]
  },

  {
    n: 10,
    id: "offer",
    name: "Convert it into a job",
    lede: "The interview format, practised deliberately and finished — then the portfolio, the resume, the referrals and the offer.",
    who: "You have two or three real projects and you are ready to start applying.",
    skip: "Skip the DSA track only if you are targeting startups exclusively, and know that you are narrowing the funnel when you do.",
    gets: "Interviews, and the ability to convert them.",
    tracks: ["dsa", "systemdesign", "hunt"]
  }

]);
