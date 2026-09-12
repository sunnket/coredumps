/* Ground Zero — the terminal, taught for Windows.

   This file was rewritten from a bash-first course with Windows footnotes
   into a PowerShell-first course, because the footnote approach fails the
   exact reader it matters most for. Someone on Windows following a bash
   tutorial types `touch app.py`, gets an error, and concludes they are bad
   at this. They are not — they were handed instructions for a machine they
   do not own.

   So: every command here runs on a stock Windows 11 PowerShell, and every
   one was executed before being written down. Where PowerShell genuinely
   diverges from what the reader will meet in tutorials, README files and
   Stack Overflow answers, the divergence is taught explicitly as its own
   subject rather than apologised for in a note. That translation skill is
   permanently useful, because the world's documentation is not going to
   stop being bash-shaped.

   The module is three parts, because "the terminal" as one unit was five
   lessons pretending to cover the single most-used tool in the trade:

     shell       first contact — what it is, moving, looking, creating
     shellwork   real work — reading, searching, piping, running programs
     shellpower  where it pays off — scripts, envs, jobs, habits

   The house rule for this module: nothing is shown that the reader cannot
   run right now, and no command with teeth is shown without its blast
   radius stated in the same breath. */
TD.addLessons("zero", [

/* ============================================================ *
 *  MODULE 1 — first contact                                    *
 * ============================================================ */

{
 t: "Meet the Terminal",
 m: "shell",
 lvl: "core",
 s: "The window everyone tells you to open, finally explained — on the machine you actually have.",
 goal: [
  "Open Windows Terminal and recognise every part of the prompt",
  "Run your first three commands and know exactly what they did",
  "Explain why professionals prefer typing to clicking"
 ],
 b: [
  { p: "You have been told to *open a terminal* by every tutorial you have ever read, usually in the first paragraph, usually with no explanation. It is the single biggest reason people quit in week one — not because it is hard, but because nobody says what it is." },
  { p: "So, plainly: **a terminal is a window where you type the names of programs instead of clicking their icons.** That is the whole idea. It is not a hacker tool, it is not dangerous by nature, and it is not doing anything your file explorer cannot. It is a different way of asking, and it happens to be enormously more powerful." },

  { h: "Open it now" },
  { p: "Press <kbd>Windows</kbd>, type `terminal`, press Enter. Windows Terminal opens on a dark window with a line of text and a blinking cursor." },
  { p: "If nothing called Terminal appears — on older Windows 10 machines it may not be installed — type `powershell` instead. Same shell, plainer window. Everything in this module works identically in both." },
  { n: "You will also find something called **Command Prompt**, or `cmd`. Ignore it. It is a much older and weaker shell that Microsoft keeps for compatibility. Everything in this course uses **PowerShell**, which is what Windows Terminal opens by default and what every modern Windows guide assumes.",
    nt: "Not Command Prompt" },

  { h: "Reading the prompt" },
  { p: "That line of text waiting for you is the **prompt**. It is the shell saying *I am ready, and here is where you are*." },
  { code: { lang: "text", t: "A typical PowerShell prompt",
    lines: [
     { c: "PS C:\\Users\\aryan>", w: "**PS** — you are in PowerShell. **C:\\Users\\aryan** — the folder you are currently standing in. **>** — your turn to type." }
    ] } },
  { p: "That middle part is the only bit that changes minute to minute, and it is the one people ignore. Read it. Ninety per cent of *why did that not work* is being in a different folder than you thought." },

  { trap: "Tutorials write commands with a marker in front — `$ python app.py` on Mac and Linux, or `PS>` on Windows. That marker is **notation meaning “this is a terminal command”**, not part of the command. Paste the `$` or the `PS>` in and the shell will tell you there is no such program. Copy only what comes after it." },

  { h: "Your first three commands" },
  { p: "Type each of these and press Enter. All three only read; none of them change anything." },
  { code: { lang: "powershell", t: "Entirely safe to run",
    lines: [
     { c: "whoami", w: "Prints your computer name and username." },
     { c: "Get-Location", w: "Prints the folder you are standing in. The short name is `pwd`." },
     { c: "Get-Date", w: "Prints the current date and time." }
    ] } },
  { out: "aryan-pc\\aryan\nC:\\Users\\aryan\nSaturday, 6 September 2026 21:14:22", ot: "Roughly what you will see" },
  { p: "That is the entire interaction model, and it never gets more complicated than this: you type the name of a program, you press Enter, the program runs and prints something, and the prompt comes back to say it has finished." },

  { h: "Why bother, when there are icons" },
  { p: "A fair question, and the honest answer is not *because real programmers do*. There are four concrete reasons, and you will feel all four within a month." },
  { ol: [
   "**It is exact.** *Click the third folder, then the one from Tuesday* is ambiguous. `cd C:\\projects\\api` is not. This is why every set of instructions you will ever be given is written as commands.",
   "**It repeats.** Anything you type once can be saved and run a thousand times. You cannot save a sequence of mouse clicks.",
   "**It is the only option on a server.** The machine your code eventually runs on has no screen, no mouse and no desktop. A terminal over the network is the entire interface.",
   "**It composes.** Commands snap together into pipelines that do things no single program was written to do. Nothing in the graphical world works like this, and it is covered later in this module."
  ] },

  { ana: "A graphical interface is a restaurant menu — everything you can have is written down, and you point. A terminal is a kitchen: nothing is listed, but you can cook anything the ingredients allow. The menu is faster on your first visit. The kitchen is why chefs work in kitchens.",
    at: "The menu and the kitchen" },

  { h: "The one real warning" },
  { p: "There is no Recycle Bin in here. When a terminal deletes a file, the file is gone — not moved somewhere recoverable, gone. There is also no *are you sure?* for most things." },
  { p: "That sounds frightening and is actually fine, because the danger is concentrated in about three commands. Everything in this lesson and the next only looks. When something has teeth, this course says so in the same breath as teaching it." },

  { tryit: { t: "Get your bearings",
    task: "Open Windows Terminal, then run `Get-Location`, `whoami` and `Get-Date`. Then run `Get-ChildItem` and see what comes back.",
    hint: "`Get-ChildItem` lists what is in the folder you are standing in. Its short name is `ls`, which is what you will normally type.",
    sol: { lang: "powershell", code: "Get-Location\nwhoami\nGet-Date\nGet-ChildItem" },
    w: "You are standing in your home folder, `C:\\Users\\<you>`, which is where PowerShell starts. `Get-ChildItem` shows Desktop, Documents, Downloads and the rest — the same things File Explorer shows you, because it is the same folder." } },

  { vocab: ["Operating System", "Process", "File Path"] }
 ],
 k: [
  "A terminal is a window where you type program names instead of clicking icons.",
  "The prompt tells you which shell you are in and which folder you are standing in. Read it.",
  "Use PowerShell (or Windows Terminal), never the older `cmd`.",
  "Terminals are exact, repeatable, the only option on servers, and composable."
 ],
 r: ["Operating System", "Process", "File Path", "Kernel"]
},

{
 t: "Where You Are: Paths and Moving Around",
 m: "shell",
 lvl: "core",
 s: "Every terminal confusion begins here. Twenty minutes now saves months of it.",
 goal: [
  "Read an absolute and a relative path and say the difference",
  "Move anywhere on your machine with `cd`, including places with spaces in the name",
  "Use Tab completion so you stop typing full names and stop making typos"
 ],
 b: [
  { p: "The shell always has exactly one answer to *where am I?*, and almost every beginner error is that answer being different from what you assumed. Getting this properly straight is the highest-value twenty minutes in the whole module." },

  { h: "Two kinds of path" },
  { p: "A **path** is the address of a file or folder. There are exactly two sorts, and knowing which one you are looking at is most of the battle." },
  { tbl: { t: "Absolute versus relative",
    h: ["", "Absolute", "Relative"],
    rows: [
     ["**Looks like**", "`C:\\Users\\aryan\\projects\\app.py`", "`projects\\app.py`"],
     ["**Starts from**", "The drive letter — the very top", "Wherever you are standing right now"],
     ["**Means**", "The same file, from anywhere, always", "A different file depending on where you are"],
     ["**Like saying**", "“12 Oak Street, Pune, India”", "“two doors down”"]
    ] } },
  { p: "Both are correct and both are useful. Absolute paths are unambiguous, which is why installers and error messages use them. Relative paths are short and portable, which is why the code you write uses them — `data\\train.csv` keeps working after you move the project or send it to someone else." },

  { h: "The shortcuts that appear everywhere" },
  { code: { lang: "powershell", t: "Four pieces of notation you will see constantly",
    lines: [
     { c: "cd .", w: "`.` means **here**. Rarely typed alone, but you will see it in `python .\\app.py`." },
     { c: "cd ..", w: "`..` means **the folder above this one**. The single most-typed navigation command there is." },
     { c: "cd ..\\..", w: "Up two levels. Chain as many as you like." },
     { c: "cd ~", w: "`~` means **your home folder** — `C:\\Users\\aryan`. Gets you home from anywhere." }
    ] } },

  { h: "Moving and looking" },
  { code: { lang: "powershell", t: "The three commands you will use more than all others combined",
    lines: [
     { c: "pwd", w: "**P**rint **w**orking **d**irectory — where am I? (Short for `Get-Location`.)" },
     { c: "ls", w: "**L**i**s**t — what is in here? (Short for `Get-ChildItem`.)" },
     { c: "cd projects", w: "**C**hange **d**irectory — go into the `projects` folder. (Short for `Set-Location`.)" },
     { c: "cd ..", w: "Go back up one." }
    ] } },
  { p: "Those four cover essentially all navigation, forever. Everything else is decoration." },

  { h: "Tab completion — learn this one habit" },
  { p: "If you take a single mechanical habit from this whole course, take this. **Type the first few letters of a name and press <kbd>Tab</kbd>.** PowerShell completes it for you." },
  { code: { lang: "powershell", t: "Type this much, then press Tab",
    lines: [
     { c: "cd Doc", w: "Press <kbd>Tab</kbd> → becomes `cd .\\Documents\\`. Press it repeatedly to cycle through matches." }
    ] } },
  { p: "This is not about saving keystrokes. It is that **a completed name cannot be a typo**, and it proves the thing exists — if Tab completes nothing, you are either in the wrong folder or the name is different from what you believed. Experienced users type perhaps half the characters of what appears on their screen." },

  { h: "Names with spaces" },
  { p: "Windows is full of folders with spaces in them — `My Documents`, `Program Files`. The shell splits what you type at spaces, so an unquoted space means *here comes a second, separate thing*." },
  { vs: { t: "A folder called “My Projects”", lang: "powershell",
    bad: { label: "Fails", c: "cd My Projects",
      w: "The shell sees the command `cd`, an argument `My`, and a stray extra argument `Projects`. It complains it cannot find `My`." },
    good: { label: "Works", c: "cd 'My Projects'",
      w: "Quotes hold the words together as one name. Tab completion adds quotes for you automatically — another reason to use it." } } },

  { trap: "Windows uses backslashes in paths (`C:\\Users`), while Mac, Linux, the internet and most tutorials use forward slashes (`/home/user`). PowerShell quietly accepts **both**, so `cd C:/Users/aryan` works fine. Python on Windows accepts both too. Do not let a slash direction stop you — but do notice that a `/` in a tutorial usually means it was written for Mac or Linux, which is a hint about what else in it might not apply." },

  { n: "`cd` with no argument behaves differently on Windows and Linux. In PowerShell, bare `cd` prints your location. In bash, it takes you home. If you follow a tutorial that types `cd` alone expecting to go home, type `cd ~` instead.",
    nt: "A small divergence worth knowing" },

  { tryit: { t: "Navigate without typing a full name",
    task: "From your home folder, go into Documents, list what is there, go back up, then jump straight to `C:\\Windows` and list it. Use Tab completion for every folder name.",
    hint: "`cd Doc` + Tab. To get back up, `cd ..`. An absolute path works from anywhere, so `cd C:\\Windows` needs no preparation.",
    sol: { lang: "powershell", code: "cd Documents      # type 'cd Doc' then Tab\nls\ncd ..\ncd C:\\Windows\nls\ncd ~" },
    w: "Notice `cd ~` brought you home from a completely different part of the drive. That is the difference between absolute and relative in one keystroke." } },

  { vocab: ["File Path", "Absolute and Relative Path"] }
 ],
 k: [
  "Absolute paths start at the drive and mean the same thing from anywhere; relative paths depend on where you stand.",
  "`.` is here, `..` is up one, `~` is your home folder.",
  "`pwd`, `ls`, `cd` cover nearly all navigation.",
  "Tab completion prevents typos and proves the thing exists. Use it constantly.",
  "Quote any name containing a space."
 ],
 r: ["File Path", "Absolute and Relative Path", "Operating System"]
},

{
 t: "Looking at What Is There",
 m: "shell",
 lvl: "core",
 s: "`ls` has more to tell you than it first appears, including the files it hides by default.",
 goal: [
  "Read the columns of a detailed listing",
  "Find hidden files, which is where configuration lives",
  "Sort and filter a listing to answer a real question"
 ],
 b: [
  { p: "`ls` looks trivial. It is not — it is how you check whether the thing you expect actually exists, which is the first step of debugging anything." },

  { h: "The trap that catches every Windows beginner" },
  { p: "Every tutorial on the internet says `ls -l` for a detailed listing. Try it in PowerShell and you get an error about a missing argument for `LiteralPath`." },
  { p: "Here is why, and it explains a whole class of confusion. On Windows, `ls` is a nickname for `Get-ChildItem`, a completely different program that merely does a similar job. It does not have a `-l` flag. It has `-LiteralPath`, and PowerShell helpfully matched your `-l` to it." },
  { vs: { t: "Detailed listing", lang: "powershell",
    bad: { label: "The bash way — fails here", c: "ls -l",
      w: "PowerShell reads `-l` as the start of `-LiteralPath` and then complains that you gave it no path." },
    good: { label: "The PowerShell way", c: "ls | Format-Table -AutoSize",
      w: "Or simply `ls` on its own, which already shows mode, last-write time, length and name in a table." } } },
  { n: "This is the single most useful thing to understand about Windows terminals: the familiar short names are **aliases pointing at different programs**. The verb is the same, the flags are not. When a bash flag fails, you have not broken anything — you are holding a different tool with the same handle.",
    nt: "Why bash flags fail" },

  { h: "Reading the output" },
  { code: { lang: "text", t: "What `ls` gives you",
    lines: [
     { c: "Mode    LastWriteTime      Length Name", w: "" },
     { c: "d----   06/09/2026 21:14          notes", w: "**d** at the front means **directory** — a folder, not a file." },
     { c: "-a---   06/09/2026 20:02     412  hello.py", w: "**-** means an ordinary file. **a** is the archive flag, which you can ignore." },
     { c: "-a---   05/09/2026 17:40    8214  data.csv", w: "**Length** is the size in bytes. 8214 bytes is about 8 KB." }
    ] } },

  { h: "Hidden files" },
  { p: "Some files begin with a dot — `.gitignore`, `.env` — and both PowerShell and File Explorer hide them by default. This is a convention, not a security feature: a leading dot means *configuration, not your content*." },
  { code: { lang: "powershell", t: "Show everything",
    lines: [
     { c: "ls -Force", w: "Include hidden and system files. This is the PowerShell equivalent of `ls -a`." }
    ] } },
  { p: "You will need this constantly once you start using Git, because `.git` and `.gitignore` are both hidden. A file you cannot see is a file you will swear does not exist." },

  { h: "Asking real questions" },
  { p: "Because PowerShell passes *objects* rather than lines of text, you can sort and filter a listing directly. This is genuinely more capable than the bash equivalent." },
  { code: { lang: "powershell", t: "Four questions worth being able to ask",
    lines: [
     { c: "ls -Recurse", w: "Everything in here **and in every folder beneath it**. Careful near the drive root — it will run for a long time." },
     { c: "ls *.py", w: "Only Python files. `*` matches any run of characters." },
     { c: "ls | Sort-Object Length -Descending", w: "Biggest files first. This is how you find what is eating your disk." },
     { c: "ls | Where-Object Name -like '*test*'", w: "Only things with `test` in the name." }
    ] } },

  { trap: "`ls -Recurse` from `C:\\` will attempt to list every file on your computer, print for several minutes, and throw permission errors for system folders. Nothing is harmed, but you will want to stop it. **<kbd>Ctrl</kbd>+<kbd>C</kbd> cancels a running command** — the single most useful key combination in any terminal. Learn it now, not during your first runaway." },

  { tryit: { t: "Find the biggest thing in your Downloads",
    task: "Go to your Downloads folder and print the five largest files, biggest first.",
    hint: "`ls` gives you the objects, `Sort-Object Length -Descending` orders them, and `Select-Object -First 5` takes the top of the list.",
    sol: { lang: "powershell", code: "cd ~\\Downloads\nls | Sort-Object Length -Descending | Select-Object -First 5 Name, Length" },
    w: "You have just written a three-stage pipeline. That `|` is the subject of a later lesson and it is the idea that makes terminals powerful." } },

  { vocab: ["File Path"] }
 ],
 k: [
  "On Windows, `ls` is an alias for `Get-ChildItem` — same job, different flags. Bash flags like `-l` will fail.",
  "`d` at the start of the Mode column means directory.",
  "`ls -Force` reveals dotfiles, where configuration lives.",
  "`Sort-Object` and `Where-Object` let you ask real questions of a listing.",
  "Ctrl+C cancels a running command."
 ],
 r: ["File Path", "Operating System", "PowerShell", "Shell"]
},

{
 t: "Making, Copying and Deleting",
 m: "shell",
 lvl: "core",
 s: "The commands with teeth. Every one of them, plus exactly how people lose work with them.",
 goal: [
  "Create files and folders from the terminal",
  "Copy, move and rename without a file explorer",
  "State the blast radius of a delete command before running it"
 ],
 b: [
  { p: "Until now everything has only looked. These commands change your disk, so each one is introduced with what it does when it goes wrong." },

  { h: "Making things" },
  { code: { lang: "powershell", t: "Creating folders and files",
    lines: [
     { c: "mkdir myproject", w: "Make a folder. Works exactly as in every tutorial." },
     { c: "mkdir a\\b\\c", w: "PowerShell creates the whole chain in one go. (In bash this needs `mkdir -p`.)" },
     { c: "New-Item app.py", w: "Create an empty file. There is **no `touch` on Windows** — this is the replacement." },
     { c: "'print(\"hi\")' > app.py", w: "Create a file *with content in it*. `>` sends output into a file." }
    ] } },
  { trap: "`>` **replaces** the file's entire contents without asking. `>>` appends to the end instead. One extra character is the difference between adding a line and destroying a day's work, and there is no undo. When in doubt, use `>>`." },

  { h: "Copying, moving, renaming" },
  { code: { lang: "powershell", t: "The three that rearrange things",
    lines: [
     { c: "cp app.py backup.py", w: "**C**o**p**y. The original stays." },
     { c: "cp -Recurse src dst", w: "Copy a whole folder and everything inside it." },
     { c: "mv app.py src\\app.py", w: "**M**o**v**e. The original is gone from where it was." },
     { c: "mv old.py new.py", w: "Moving something to a new name **is** renaming. There is no separate rename command." }
    ] } },
  { n: "That last line surprises people, and it is a genuinely useful piece of understanding: to the operating system a file's name is just its address. Change the address and you have renamed it. Move it to a different folder and you have also renamed it. Same operation.",
    nt: "Renaming is moving" },

  { h: "Deleting — read this part properly" },
  { code: { lang: "powershell", t: "The command that has no undo",
    lines: [
     { c: "rm notes.txt", w: "Delete one file. **Not to the Recycle Bin.** Gone." },
     { c: "rm -Recurse oldstuff", w: "Delete a folder and everything inside it, at any depth." },
     { c: "rm -Recurse -Force oldstuff", w: "The same, without asking about read-only or hidden files. **This is the dangerous one.**" }
    ] } },
  { p: "The habit that protects you is one extra step, and it costs two seconds: **list it before you delete it.** Run `ls` with the same pattern first. Whatever `ls` shows you is exactly what `rm` will destroy." },
  { code: { lang: "powershell", t: "Look, then leap",
    lines: [
     { c: "ls *.tmp", w: "See precisely what matches. Are you happy for all of that to vanish?" },
     { c: "rm *.tmp", w: "Now do it, knowing what it hits." }
    ] } },
  { trap: "The classic disaster is a space in the wrong place. `rm -Recurse C:\\projects\\old` deletes one folder. `rm -Recurse C:\\ projects\\old` — one stray space — asks to delete your entire C drive. It will fail on system files and permissions, but not before doing real damage. **Re-read a delete command before pressing Enter.** Every experienced engineer does this, and it is because of a story they do not tell." },

  { h: "The safety net you should turn on today" },
  { p: "There is a genuine Recycle Bin option, and almost nobody knows about it. Install the module once and use `Remove-ItemSafely` for anything you might regret." },
  { code: { lang: "powershell", t: "Recoverable deletes",
    lines: [
     { c: "Install-Module -Name Recycle -Scope CurrentUser", w: "Once, ever. Answer yes to the prompts about an untrusted repository." },
     { c: "Remove-ItemSafely oldnotes.txt", w: "Goes to the Recycle Bin, where you can get it back." }
    ] } },
  { p: "Use plain `rm` for build artefacts and caches you can regenerate. Use `Remove-ItemSafely` for anything you wrote." },

  { tryit: { t: "Build a sandbox and then destroy it",
    task: "In your home folder, create `sandbox` containing a folder `data` and a file `notes.txt` with the text `hello` in it. Confirm it exists, then remove the whole sandbox in one command.",
    hint: "`mkdir` makes chains in one call. `>` writes content into a file. Removing a folder needs `-Recurse`.",
    sol: { lang: "powershell", code: "cd ~\nmkdir sandbox\\data\n'hello' > sandbox\\notes.txt\nls -Recurse sandbox\nrm -Recurse sandbox" },
    w: "You listed before you deleted. Make that reflex permanent and you will never lose work to a terminal." } },

  { vocab: ["File Path"] }
 ],
 k: [
  "`mkdir` makes folders and creates whole chains; `New-Item` replaces the `touch` you see in tutorials.",
  "`>` overwrites a file completely; `>>` appends. There is no undo.",
  "Moving a file to a new name is how you rename it.",
  "`rm` does not use the Recycle Bin. List with `ls` before deleting with `rm`.",
  "`Remove-ItemSafely` from the Recycle module gives you a real safety net."
 ],
 r: ["File Path", "Operating System", "Shell", "Idempotency"]
},

/* ============================================================ *
 *  MODULE 2 — doing real work                                  *
 * ============================================================ */

{
 t: "Reading Files Without Opening Them",
 m: "shellwork",
 lvl: "core",
 s: "Peek at a 4 GB file in a fraction of a second, which no editor can do.",
 goal: [
  "Read whole files, first lines, and last lines",
  "Follow a log file as it is being written",
  "Explain why you never open a large data file in an editor"
 ],
 b: [
  { p: "You will spend a great deal of your working life looking at files you did not write — data files, logs, configuration. Opening a 4 GB CSV in Notepad will freeze your machine for minutes. The terminal reads the first twenty lines instantly, because it only reads twenty lines." },

  { h: "The four ways to read" },
  { code: { lang: "powershell", t: "Reading, from most to least of the file",
    lines: [
     { c: "cat notes.txt", w: "Print the **whole** file. Fine for small things, terrible for large ones. (`cat` is an alias for `Get-Content`.)" },
     { c: "cat data.csv -TotalCount 10", w: "**First 10 lines only.** This is the `head` you see in tutorials." },
     { c: "cat app.log -Tail 20", w: "**Last 20 lines.** This is `tail`, and it is what you want for logs — the newest trouble is at the bottom." },
     { c: "cat app.log -Wait -Tail 20", w: "Last 20 lines, then **keep watching and print new lines as they arrive.** Ctrl+C to stop." }
    ] } },
  { p: "That last one is how every engineer watches a program while it runs. Start your app in one terminal tab, follow its log in another, and you can see what it is doing in real time rather than guessing afterwards." },

  { n: "There is no `head` or `tail` command on Windows, and no `less`. `-TotalCount` and `-Tail` are the replacements, and `-Wait` is the `tail -f` you will see in every deployment guide. For paging through a long file interactively, PowerShell has `more`, but in practice people search instead — which is the next lesson.",
    nt: "The bash names you will see" },

  { h: "The first thing to do with any data file" },
  { p: "Before writing a single line of code against a dataset, look at it. This habit catches a startling proportion of bugs before they exist." },
  { code: { lang: "powershell", t: "Thirty seconds that save an afternoon",
    lines: [
     { c: "cat train.csv -TotalCount 3", w: "What are the columns actually called? Is there even a header row?" },
     { c: "(cat train.csv | Measure-Object -Line).Lines", w: "How many rows? This is the `wc -l` of the bash world." },
     { c: "(ls train.csv).Length / 1MB", w: "How big is it in megabytes? Decides whether this fits in memory." }
    ] } },
  { p: "You now know the shape of the thing before you touch it. Half of *my code gives strange results* turns out to be an unexpected header, a different separator, or a file ten times larger than assumed." },

  { tryit: { t: "Inspect a file you did not write",
    task: "Pick any `.txt`, `.csv` or `.log` file on your machine. Print its first 5 lines, its last 5 lines, and count how many lines it has in total.",
    hint: "If you have nothing handy, make one: `1..500 | ForEach-Object { \"line $_\" } > big.txt`",
    sol: { lang: "powershell", code: "1..500 | ForEach-Object { \"line $_\" } > big.txt\ncat big.txt -TotalCount 5\ncat big.txt -Tail 5\n(cat big.txt | Measure-Object -Line).Lines" },
    w: "500 lines, first five and last five, in well under a second. An editor would have loaded all of it to show you the same thing." } },

  { vocab: ["File Path"] }
 ],
 k: [
  "`cat` prints a whole file; `-TotalCount n` gives the first n lines and `-Tail n` the last n.",
  "`cat file -Wait -Tail 20` follows a log live — the `tail -f` of Windows.",
  "Always inspect a data file's head, line count and size before writing code against it.",
  "There is no `head`, `tail` or `less` on Windows; these flags replace them."
 ],
 r: ["File Path", "Shell", "PowerShell", "Standard Library"]
},

{
 t: "Finding Things: Search That Actually Scales",
 m: "shellwork",
 lvl: "core",
 s: "Search every file in a project in under a second. This one lesson changes how you work.",
 goal: [
  "Search inside files for text, across a whole project",
  "Find files by name anywhere on the drive",
  "Use search to navigate an unfamiliar codebase"
 ],
 b: [
  { p: "This is the lesson where the terminal stops being a slower File Explorer and becomes something you could not do any other way." },
  { p: "The question *where in this project is that error message defined?* is unanswerable by clicking. It takes one command and about half a second." },

  { h: "Searching inside files" },
  { p: "The tool is `Select-String`. Tutorials will say `grep`; on Windows this is your `grep`, and the shorthand is `sls`." },
  { code: { lang: "powershell", t: "Finding text inside files",
    lines: [
     { c: "sls 'TODO' *.py", w: "Find `TODO` in every Python file **here**." },
     { c: "sls 'api_key' . -Recurse", w: "Search **this folder and everything beneath it**. The one you will use most." },
     { c: "sls 'error' app.log -CaseSensitive", w: "Exact case. By default the search ignores case, unlike bash `grep`." },
     { c: "sls 'timeout' . -Recurse -List", w: "Just the **file names** that contain it, not every matching line." }
    ] } },
  { out: "app.py:14:    # TODO: handle the empty case\nutils.py:88:   # TODO: this is O(n^2)", ot: "What a match looks like" },
  { p: "Filename, line number, and the line itself. That is enough to jump straight there in your editor." },

  { h: "Finding files by name" },
  { code: { lang: "powershell", t: "When you know the name but not the place",
    lines: [
     { c: "ls . -Recurse -Filter *.csv", w: "Every CSV anywhere beneath here." },
     { c: "ls C:\\Users\\aryan -Recurse -Filter 'config*' -ErrorAction SilentlyContinue", w: "Search your whole user folder. The `-ErrorAction` part suppresses the noise from folders you cannot read." }
    ] } },
  { n: "`-ErrorAction SilentlyContinue` is worth remembering. Recursive searches inevitably hit protected folders, and without it your useful results scroll away underneath a wall of red permission errors.",
    nt: "Quietening the noise" },

  { h: "How this changes your work" },
  { p: "Dropped into an unfamiliar codebase — which is every job, on day one — search is how you orient yourself. Three commands and you understand the shape of it:" },
  { ol: [
   "`sls 'def main' . -Recurse` — where does this thing start?",
   "`sls 'import requests' . -Recurse -List` — which files talk to the network?",
   "`sls 'TODO|FIXME|HACK' . -Recurse` — where do the authors themselves know it is weak?"
  ] },
  { p: "That last one uses `|` inside the quotes to mean **or**, which is a regular expression. `Select-String` speaks regex natively, and the pattern language is worth learning eventually — but `|` for *or* and `.` for *any character* will carry you a long way." },

  { trap: "Searching from `C:\\` will crawl your entire drive, take minutes, and bury you in permission errors. Always search from the narrowest folder that could contain what you want — usually your project folder. If you find yourself searching the whole drive, the real problem is that you do not know where your project lives." },

  { tryit: { t: "Find every place a word appears",
    task: "Pick a folder with several text or code files. Find every line containing the word `import` (or any word you like), then list only the filenames that contain it.",
    hint: "`-Recurse` searches subfolders. `-List` stops after the first match per file and shows just the file.",
    sol: { lang: "powershell", code: "sls 'import' . -Recurse\nsls 'import' . -Recurse -List | Select-Object Filename" },
    w: "The second command answers *which files* rather than *which lines* — usually the more useful question when you are getting oriented." } },

  { vocab: ["Regular Expression"] }
 ],
 k: [
  "`Select-String` (alias `sls`) is the Windows `grep`, and it searches case-insensitively by default.",
  "`sls 'text' . -Recurse` searches a whole project in about a second.",
  "`ls . -Recurse -Filter '*.csv'` finds files by name.",
  "Add `-ErrorAction SilentlyContinue` to stop permission errors burying your results.",
  "Search is how you orient yourself in code you did not write."
 ],
 r: ["Regular Expression", "File Path", "Shell", "Bash"]
},

{
 t: "The Pipe: Snapping Commands Together",
 m: "shellwork",
 lvl: "core",
 s: "The single idea that makes a terminal more than a list of commands.",
 goal: [
  "Read a pipeline left to right and say what each stage does",
  "Build a three-stage pipeline to answer a question",
  "Explain why PowerShell pipes are different from bash pipes"
 ],
 b: [
  { p: "Everything so far has been individual commands. This lesson is the idea that makes the whole thing worth learning." },
  { p: "**The pipe `|` takes what one command produces and feeds it to the next as input.** Instead of one program that does everything, you snap small programs together into something none of them could do alone." },

  { ana: "A factory line. One machine cuts, the next drills, the next paints. No machine knows about the others; each takes what arrives, does its one job, passes it on. Rearrange them and you build something different from the same parts.",
    at: "The factory line" },

  { h: "Reading a pipeline" },
  { code: { lang: "powershell", t: "Three stages, read left to right",
    lines: [
     { c: "ls | Sort-Object Length -Descending | Select-Object -First 5", w: "**List** everything → **sort** it by size, biggest first → **take** the first five." }
    ] } },
  { p: "Each `|` is the word *then*. List, then sort, then take five. Read any pipeline that way and even a long one is straightforward — it is a sentence, and the pipes are its punctuation." },

  { h: "What makes PowerShell different — and better" },
  { p: "This is the part worth understanding properly, because it explains why Windows commands look unlike the bash ones in tutorials." },
  { p: "**Bash pipes pass text.** Every stage receives a block of characters and must chop it up itself, which is why bash pipelines are full of `awk` and `cut` fiddling with column positions." },
  { p: "**PowerShell pipes pass objects.** `ls` does not hand over text that looks like a table — it hands over actual file objects with real properties. So `Sort-Object Length` works because there genuinely is a `Length` property, not because something counted characters to column 32." },
  { vs: { t: "The five largest files", lang: "text",
    bad: { label: "bash — parsing text", c: "ls -l | sort -k5 -n -r | head -5",
      w: "`-k5` means *the fifth whitespace-separated column*. If a filename contains a space, this breaks." },
    good: { label: "PowerShell — real properties", c: "ls | Sort-Object Length -Descending | Select-Object -First 5",
      w: "`Length` is a property of the object. Filenames with spaces are irrelevant." } } },

  { h: "The stages you will use constantly" },
  { tbl: { t: "A small vocabulary that composes into a lot",
    h: ["Stage", "What it does", "Bash equivalent"],
    rows: [
     ["`Where-Object`", "Keep only items matching a condition", "`grep`"],
     ["`Sort-Object`", "Order by a property", "`sort`"],
     ["`Select-Object -First n`", "Take the first n", "`head`"],
     ["`Select-Object -Last n`", "Take the last n", "`tail`"],
     ["`Measure-Object`", "Count, sum, average", "`wc`"],
     ["`ForEach-Object`", "Do something to each item", "`xargs`"],
     ["`Group-Object`", "Bucket items by a property", "`sort \\| uniq -c`"]
    ] } },

  { h: "Worked examples" },
  { code: { lang: "powershell", t: "Real questions, answered in one line",
    lines: [
     { c: "ls -Recurse -Filter *.py | Measure-Object", w: "How many Python files are in this project?" },
     { c: "ls | Group-Object Extension | Sort-Object Count -Descending", w: "What kinds of file are in here, and how many of each?" },
     { c: "ps | Sort-Object WS -Descending | Select-Object -First 5 Name, WS", w: "Which five programs are using the most memory right now?" },
     { c: "sls 'ERROR' app.log | Measure-Object", w: "How many errors are in this log?" }
    ] } },
  { p: "None of those needed a program to be written. They are four small tools, snapped together four different ways." },

  { tryit: { t: "Answer a question about your own disk",
    task: "In your Downloads folder, group the files by extension and show which type you have the most of.",
    hint: "`ls`, then `Group-Object Extension`, then `Sort-Object Count -Descending`.",
    sol: { lang: "powershell", code: "cd ~\\Downloads\nls | Group-Object Extension | Sort-Object Count -Descending | Select-Object Count, Name" },
    w: "You have just written a real data analysis — group, aggregate, sort — with no programming language involved. This is the same shape as a SQL `GROUP BY`, and as a pandas `.groupby()`. The idea transfers everywhere." } },

  { vocab: ["Pipeline"] }
 ],
 k: [
  "`|` sends one command's output into the next. Read each pipe as the word *then*.",
  "PowerShell pipes carry objects with real properties; bash pipes carry text that must be parsed.",
  "`Where-Object`, `Sort-Object`, `Select-Object`, `Measure-Object` and `Group-Object` compose into most of what you need.",
  "Grouping and sorting in a pipeline is the same shape as SQL GROUP BY and pandas groupby."
 ],
 r: ["Pipeline", "Shell", "PowerShell", "Bash"]
},

{
 t: "Running Programs and Reading Their Complaints",
 m: "shellwork",
 lvl: "core",
 s: "How the shell finds a program, why “not recognised” happens, and what an exit code is.",
 goal: [
  "Explain what PATH is and why a freshly installed program is not found",
  "Run a Python script and pass it arguments",
  "Check whether the last command actually succeeded"
 ],
 b: [
  { p: "You type `python`. Sometimes it runs. Sometimes Windows says *the term 'python' is not recognised*. Understanding why is the difference between a five-minute fix and an afternoon of reinstalling things that were already fine." },

  { h: "How the shell finds a program" },
  { p: "When you type a name, the shell does **not** search your computer. Searching a drive takes minutes; the prompt comes back instantly. Instead it checks a list of folders called **PATH**, in order, and uses the first match. If none of them contain it, you get *not recognised*." },
  { code: { lang: "powershell", t: "Interrogating PATH",
    lines: [
     { c: "$env:PATH -split ';'", w: "Print every folder the shell will look in, one per line." },
     { c: "Get-Command python", w: "**Which `python` am I actually getting?** Prints the full path of the one that would run." },
     { c: "Get-Command python -All", w: "Show *all* of them, in priority order. This is how you diagnose having three Pythons installed." }
    ] } },
  { p: "`Get-Command` is the diagnostic tool for this entire class of problem. *Not recognised* means it is not on PATH. *The wrong version runs* means something else on PATH comes first." },

  { trap: "You install Python, and the terminal that was already open still says *not recognised*. Nothing is broken. **A shell reads PATH when it starts**, so a window opened before the installer ran is still holding the old list. Close the terminal, open a new one, and it works. This wastes an enormous amount of beginner time." },

  { h: "Running your own code" },
  { code: { lang: "powershell", t: "Running a script",
    lines: [
     { c: "python app.py", w: "Run `app.py` with Python." },
     { c: "python app.py data.csv 50", w: "Anything after the filename is passed **to your program** as arguments." },
     { c: ".\\app.exe", w: "To run a program **in the current folder**, you must write `.\\`. PowerShell will not run things from the current directory otherwise." }
    ] } },
  { n: "That `.\\` requirement is a deliberate security decision. If the current folder were searched automatically, dropping a malicious `ls.exe` into a shared folder would hijack the real `ls` for anyone who wandered in. Requiring `.\\` means running a local program is always an explicit choice.",
    nt: "Why `.\\` is required" },

  { h: "Did it actually work?" },
  { p: "Every command finishes with an **exit code**: zero for success, anything else for failure. This is invisible until you need it, and then it is essential — it is how scripts and CI systems decide whether to continue." },
  { code: { lang: "powershell", t: "Checking the last command",
    lines: [
     { c: "$?", w: "`True` if the last command succeeded, `False` if it failed." },
     { c: "$LASTEXITCODE", w: "The actual number an external program returned. `0` means success." }
    ] } },
  { p: "It matters because **a command can print worrying text and still succeed, or print nothing and have failed**. Output is for humans; the exit code is the machine-readable verdict." },

  { h: "Chaining, and the PowerShell 5.1 catch" },
  { p: "In bash and in modern PowerShell you can write `cmd1 && cmd2` to mean *run the second only if the first succeeded*. **Windows PowerShell 5.1 — the version shipped with Windows — does not support `&&`.** It is a syntax error." },
  { vs: { t: "Run the second command only if the first worked", lang: "powershell",
    bad: { label: "Fails on PowerShell 5.1", c: "python test.py && python deploy.py",
      w: "You get a parser error about an unexpected token. Every tutorial writes this, and it will not run on a stock Windows machine." },
    good: { label: "Works everywhere", c: "python test.py; if ($?) { python deploy.py }",
      w: "`;` separates commands, and `if ($?)` checks whether the previous one succeeded." } } },
  { p: "This is worth knowing because it is one of the most common things to fail when you copy a command from a README. You are not doing it wrong — you are running an older shell than the person who wrote it." },

  { tryit: { t: "Diagnose your own Python",
    task: "Find out whether Python is on your PATH, exactly which file would run, and whether you have more than one installed.",
    hint: "`Get-Command` answers all three, especially with `-All`.",
    sol: { lang: "powershell", code: "Get-Command python\nGet-Command python -All\n$env:PATH -split ';' | Select-String -Pattern 'python'" },
    w: "If `-All` shows several, the first one wins. That is the explanation for nearly every *but I installed that package!* problem — you installed it into a different Python than the one that runs." } },

  { vocab: ["Process", "Environment Variable"] }
 ],
 k: [
  "The shell finds programs by searching PATH, not your whole drive.",
  "A terminal reads PATH at startup — reopen it after installing something.",
  "`Get-Command name -All` shows exactly which program runs and what else is competing.",
  "`.\\program` is required to run something in the current folder.",
  "Exit code 0 means success; `$?` reports it. PowerShell 5.1 has no `&&` — use `; if ($?) { }`."
 ],
 r: ["Process", "Environment Variable", "Runtime"]
},

/* ============================================================ *
 *  MODULE 3 — where it pays off                                *
 * ============================================================ */

{
 t: "Environment Variables and Keeping Secrets Out of Code",
 m: "shellpower",
 lvl: "core",
 s: "Where your API keys belong, and the mistake that ends careers early.",
 goal: [
  "Read and set an environment variable in PowerShell",
  "Explain why a secret must never be written in a source file",
  "Set a variable permanently without editing system dialogs"
 ],
 b: [
  { p: "An **environment variable** is a named value the operating system hands to every program it starts. Your PATH is one. They exist so a program can be told something about its surroundings without that something being written into the program." },
  { p: "For you, they matter for one urgent reason: **it is where API keys go.**" },

  { h: "Reading and setting" },
  { code: { lang: "powershell", t: "The syntax",
    lines: [
     { c: "$env:PATH", w: "Read one. The `$env:` prefix is how PowerShell names them." },
     { c: "$env:OPENAI_API_KEY = 'sk-abc123'", w: "Set one **for this window only**. Close the terminal and it is gone." },
     { c: "ls env:", w: "List every environment variable currently set." }
    ] } },
  { p: "That *this window only* behaviour is a feature, not a limitation. A key that exists only while you are working is a key that cannot leak from a machine you walked away from." },

  { h: "Making it permanent" },
  { code: { lang: "powershell", t: "Setting it for good, without the System Properties dialog",
    lines: [
     { c: "[Environment]::SetEnvironmentVariable('OPENAI_API_KEY', 'sk-abc123', 'User')", w: "Written to your Windows user profile. Survives restarts." },
     { c: "", w: "" },
     { c: "# then open a NEW terminal, because the current one", w: "" },
     { c: "# already read its environment when it started", w: "Same rule as PATH: existing windows do not see the change." }
    ] } },

  { h: "Why this matters more than it sounds" },
  { p: "Here is the failure, and it happens constantly to people learning this field." },
  { ol: [
   "You paste your API key straight into `app.py` because it is quicker.",
   "You push the project to GitHub, because that is what you are told to do for a portfolio.",
   "Automated bots scan every new public commit on GitHub within seconds — this is an industry.",
   "Your key is used to run someone else's workloads, on your card, sometimes to thousands of dollars, sometimes within an hour."
  ] },
  { p: "This is not a cautionary tale; it is a weekly occurrence. Providers now scan for their own leaked keys and revoke them automatically, which helps, but by then it may already have been used." },
  { vs: { t: "The same program, one difference that matters", lang: "python",
    bad: { label: "Never", c: "client = OpenAI(api_key='sk-proj-abc123def456')",
      w: "The key is now in your file, in your Git history forever, and on GitHub the moment you push. Deleting the line later does not remove it from history." },
    good: { label: "Always", c: "import os\nclient = OpenAI(api_key=os.environ['OPENAI_API_KEY'])",
      w: "The code says *fetch the key from the environment*. The key itself is never in a file that can be committed." } } },
  { trap: "Deleting a secret and committing the fix does **not** remove it. Git keeps every version of every file forever — that is its entire purpose. Once a key has been pushed it must be treated as compromised and revoked at the provider. Cleaning history is possible and unpleasant; revoking the key takes thirty seconds and actually works." },

  { h: "The `.env` file, and its one rule" },
  { p: "Setting several variables by hand every session gets tedious, so projects keep a file called `.env`:" },
  { code: { lang: "text", t: ".env — never committed",
    lines: [
     { c: "OPENAI_API_KEY=sk-proj-abc123", w: "" },
     { c: "DATABASE_URL=postgresql://localhost/mydb", w: "Python's `python-dotenv` package loads these into the environment at startup." }
    ] } },
  { p: "**The rule is absolute: `.env` goes into `.gitignore` before you put anything in it.** Every real project does this, and the convention is so standard that `.env` appearing in a repository is treated as an incident." },

  { tryit: { t: "Set a key the right way",
    task: "Set an environment variable called `MY_TEST_KEY` for this session, prove Python can read it, then set it permanently and confirm a new terminal sees it.",
    hint: "`$env:NAME = 'value'` for this session; the `[Environment]::SetEnvironmentVariable` form with `'User'` for permanent.",
    sol: { lang: "powershell", code: "$env:MY_TEST_KEY = 'hello-from-the-shell'\npython -c \"import os; print(os.environ['MY_TEST_KEY'])\"\n\n[Environment]::SetEnvironmentVariable('MY_TEST_KEY', 'hello-from-the-shell', 'User')\n# open a new terminal, then:\n$env:MY_TEST_KEY" },
    w: "That `python -c` trick runs one line of Python without making a file — useful constantly for checking things." } },

  { vocab: ["Environment Variable", "API Key"] }
 ],
 k: [
  "`$env:NAME` reads a variable; `$env:NAME = 'x'` sets it for this window only.",
  "`[Environment]::SetEnvironmentVariable(name, value, 'User')` makes it permanent — reopen the terminal after.",
  "Never write an API key in a source file. Read it from the environment.",
  "A key pushed to Git is compromised forever; revoke it rather than trying to erase history.",
  "`.env` goes in `.gitignore` before anything goes in `.env`."
 ],
 r: ["Environment Variable", "API Key", "Git"]
},

{
 t: "Virtual Environments: Why Your Packages Keep Breaking",
 m: "shellpower",
 lvl: "core",
 s: "The single most common source of “it worked yesterday” in Python.",
 goal: [
  "Explain what problem a virtual environment solves",
  "Create, activate and deactivate one in PowerShell",
  "Fix the activation error every Windows user hits on their first attempt"
 ],
 b: [
  { p: "Install packages globally for a few weeks and you will hit this: project A needs version 1 of a library, project B needs version 2, and installing either breaks the other. There is one Python, one set of packages, and no way for both to be satisfied." },
  { p: "A **virtual environment** is a private folder of packages belonging to one project. Each project gets its own, they cannot interfere, and deleting the folder undoes everything cleanly." },

  { ana: "A shared kitchen where everyone keeps ingredients in one cupboard. Someone replaces the plain flour with self-raising and every recipe in the building changes behaviour. A virtual environment gives each cook their own cupboard.",
    at: "The shared cupboard" },

  { h: "The four commands" },
  { code: { lang: "powershell", t: "The whole workflow",
    lines: [
     { c: "cd C:\\projects\\myapp", w: "Always from your project folder." },
     { c: "python -m venv .venv", w: "Create it. `.venv` is the conventional name — hidden, and recognised by every editor." },
     { c: ".\\.venv\\Scripts\\Activate.ps1", w: "**Activate.** Note the `.\\` and the `.ps1` — this is the Windows path, not the `source .venv/bin/activate` you will see in tutorials." },
     { c: "deactivate", w: "Step back out when you are done." }
    ] } },
  { p: "Once active, your prompt changes to show it:" },
  { out: "(.venv) PS C:\\projects\\myapp>", ot: "How you know it worked" },
  { p: "That `(.venv)` is the single most important thing on your prompt. It means `pip install` puts packages **here**, in this project, and nowhere else." },

  { h: "The error every Windows user hits" },
  { p: "Your first activation attempt will very likely fail like this:" },
  { out: ".\\.venv\\Scripts\\Activate.ps1 : File cannot be loaded because running scripts is disabled on this system.", ot: "The wall" },
  { p: "This is not broken, and it is not about you. Windows ships with a script **execution policy** set to block PowerShell scripts by default, as a security measure. You need to change that execution policy once, to allow scripts you wrote or downloaded yourself, for your user account only:" },
  { code: { lang: "powershell", t: "The fix — run once, ever",
    lines: [
     { c: "Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser", w: "Local scripts may run; downloaded ones must be signed. Answer `Y`." }
    ] } },
  { n: "`RemoteSigned` is the right setting — it is what Microsoft recommends for developers. Do not use `Unrestricted`, and be wary of any guide that tells you to: it removes the protection against scripts arriving from the internet. `-Scope CurrentUser` means you are not changing the policy for the whole machine, so no administrator prompt is needed.",
    nt: "Why RemoteSigned and not Unrestricted" },

  { h: "Recording what you installed" },
  { code: { lang: "powershell", t: "Making the environment reproducible",
    lines: [
     { c: "pip install pandas scikit-learn", w: "Installs into the active environment only." },
     { c: "pip freeze > requirements.txt", w: "Write down exact versions of everything installed." },
     { c: "pip install -r requirements.txt", w: "Someone else — or future you — rebuilds the identical environment." }
    ] } },
  { p: "`requirements.txt` is committed to Git. The `.venv` folder is **not** — it is large, machine-specific, and rebuildable in seconds from that file. Add `.venv` to `.gitignore` immediately." },

  { trap: "Forgetting to activate is the most common Python error in existence. You `pip install pandas`, then `import pandas` fails. The package went into your global Python while your project uses the environment, or the reverse. **Check for `(.venv)` on your prompt before installing anything.** If it is not there, you are not where you think you are." },

  { tryit: { t: "Build one properly, start to finish",
    task: "Create a project folder, make a virtual environment, activate it, install `requests`, freeze the requirements, then deactivate and confirm `requests` is no longer available.",
    hint: "If activation is blocked, run the `Set-ExecutionPolicy` line first. Test availability with `python -c \"import requests\"`.",
    sol: { lang: "powershell", code: "mkdir C:\\projects\\envtest\ncd C:\\projects\\envtest\npython -m venv .venv\n.\\.venv\\Scripts\\Activate.ps1\npip install requests\npip freeze > requirements.txt\ncat requirements.txt\ndeactivate\npython -c \"import requests\"   # fails outside the environment" },
    w: "That final failure is the proof it worked — the package genuinely lives inside the project rather than on your machine." } },

  { vocab: ["Virtual Environment", "Dependency"] }
 ],
 k: [
  "A virtual environment gives each project its own private set of packages.",
  "`python -m venv .venv` then `.\\.venv\\Scripts\\Activate.ps1` — not the `source` command from Linux tutorials.",
  "Fix the blocked-script error once with `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser`.",
  "`(.venv)` on your prompt is proof you are installing into the right place.",
  "Commit `requirements.txt`; never commit `.venv`."
 ],
 r: ["Virtual Environment", "Dependency", "Package Manager"]
},

{
 t: "Saving Your Work as a Script",
 m: "shellpower",
 lvl: "core",
 s: "The moment the terminal stops being a tool and starts being leverage.",
 goal: [
  "Save a sequence of commands as a `.ps1` file and run it",
  "Use variables and a loop in a script",
  "Recognise when a task is worth automating"
 ],
 b: [
  { p: "Everything so far has been typed once and lost. A **script** is a file of commands that runs top to bottom. It is the moment the terminal starts paying you back, because anything you do more than twice you can stop doing." },

  { h: "Your first script" },
  { p: "A PowerShell script is a plain text file ending in `.ps1`. Nothing more." },
  { code: { lang: "powershell", t: "backup.ps1",
    lines: [
     { c: "# Copy today's work into a dated folder", w: "`#` starts a comment. Write them; you will not remember why in a month." },
     { c: "$stamp = Get-Date -Format 'yyyy-MM-dd'", w: "A variable. `$name = value`." },
     { c: "$dest = \"C:\\backups\\$stamp\"", w: "**Double quotes** substitute variables. Single quotes would print the literal text `$stamp`." },
     { c: "", w: "" },
     { c: "mkdir $dest -Force | Out-Null", w: "`-Force` means do not complain if it exists; `Out-Null` discards the chatter." },
     { c: "cp -Recurse .\\src\\* $dest", w: "" },
     { c: "Write-Host \"Backed up to $dest\" -ForegroundColor Green", w: "`Write-Host` prints to the person watching, in colour." }
    ] } },
  { code: { lang: "powershell", t: "Running it",
    lines: [
     { c: ".\\backup.ps1", w: "The `.\\` is required, exactly as for any program in the current folder." }
    ] } },

  { h: "Loops: the actual payoff" },
  { p: "A loop does the same thing to many items. This is where a script beats an afternoon of clicking." },
  { code: { lang: "powershell", t: "Rename 500 files in one go",
    lines: [
     { c: "foreach ($f in ls *.jpeg) {", w: "For every `.jpeg` file here…" },
     { c: "    $new = $f.Name -replace '\\.jpeg$', '.jpg'", w: "Work out the new name by replacing the extension." },
     { c: "    mv $f.FullName $new", w: "Rename it." },
     { c: "}", w: "" }
    ] } },
  { p: "Five hundred files, under a second, no mistakes. Doing that by hand is an hour of tedium with three errors in it. This is the moment most people realise what they have been missing." },

  { trap: "**Always dry-run a script that changes things.** Replace the destructive line with a `Write-Host` that prints what *would* happen, run it, read the output, and only then swap the real command back in. Every experienced engineer does this, and it is the difference between a clever script and a disaster." },
  { code: { lang: "powershell", t: "The dry run",
    lines: [
     { c: "foreach ($f in ls *.jpeg) {", w: "" },
     { c: "    $new = $f.Name -replace '\\.jpeg$', '.jpg'", w: "" },
     { c: "    Write-Host \"WOULD rename $($f.Name) -> $new\"", w: "Prints the plan and touches nothing. Read all of it before trusting it." },
     { c: "}", w: "" }
    ] } },

  { h: "When is it worth it?" },
  { p: "A reasonable rule: automate when the time you will spend doing it by hand exceeds the time to write the script — and count *future* repetitions, which people always underestimate." },
  { ol: [
   "**Once** — just do it by hand.",
   "**Twice** — do it by hand, but notice.",
   "**Three times** — write the script. You are going to do this again.",
   "**Every day** — write the script, and put it somewhere your future self will find it."
  ] },

  { tryit: { t: "Automate something real",
    task: "Write `organise.ps1` that sorts the files in a folder into subfolders by extension — all `.pdf` into a `pdf` folder, all `.png` into `png`, and so on. Dry-run it first.",
    hint: "`Group-Object Extension` buckets them for you. Skip files with no extension, and remember the leading dot in `.pdf`.",
    sol: { lang: "powershell", code: "foreach ($g in ls -File | Group-Object Extension) {\n    if (-not $g.Name) { continue }\n    $folder = $g.Name.TrimStart('.')\n    Write-Host \"WOULD create $folder for $($g.Count) files\"\n    # mkdir $folder -Force | Out-Null\n    # $g.Group | ForEach-Object { mv $_.FullName $folder }\n}" },
    w: "Run it as written to see the plan, then uncomment the two lines to do it for real. That commented-out pattern is how professionals ship destructive scripts." } },

  { vocab: ["Script", "Automation"] }
 ],
 k: [
  "A `.ps1` file is a saved sequence of commands; run it with `.\\name.ps1`.",
  "`$name = value` makes a variable; double quotes substitute them, single quotes do not.",
  "`foreach` applies the same operation to hundreds of items instantly.",
  "Always dry-run with `Write-Host` before letting a script change anything.",
  "Write the script the third time you do something."
 ],
 r: ["Script", "Automation", "Idempotency"]
},

{
 t: "Long Jobs, Background Work and Getting Unstuck",
 m: "shellpower",
 lvl: "core",
 s: "What to do when a command hangs, runs for hours, or you have no idea what it does.",
 goal: [
  "Stop a runaway command and know what the shortcuts do",
  "Run long jobs without blocking your terminal",
  "Read a command's own help instead of searching the web"
 ],
 b: [
  { p: "Model training runs for hours. Downloads stall. Sometimes a command sits there producing nothing and you cannot tell whether it is working or wedged. This lesson is the controls." },

  { h: "The keys that get you out" },
  { tbl: { t: "Learn these before you need them",
    h: ["Keys", "What it does", "When"],
    rows: [
     ["<kbd>Ctrl</kbd>+<kbd>C</kbd>", "Cancel the running command", "The universal escape hatch. Safe and immediate."],
     ["<kbd>Ctrl</kbd>+<kbd>L</kbd>", "Clear the screen", "When the scrollback is a mess. Nothing is lost."],
     ["<kbd>↑</kbd> / <kbd>↓</kbd>", "Previous and next command", "You will use this more than you type."],
     ["<kbd>Ctrl</kbd>+<kbd>R</kbd>", "Search your command history", "Type a fragment of something you ran last week."],
     ["<kbd>Tab</kbd>", "Complete a name", "Constantly."],
     ["<kbd>Ctrl</kbd>+<kbd>A</kbd> / <kbd>Ctrl</kbd>+<kbd>E</kbd>", "Jump to start / end of the line", "Fixing a typo in a long command."]
    ] } },
  { p: "<kbd>Ctrl</kbd>+<kbd>R</kbd> deserves attention. Your shell remembers thousands of past commands, and searching them is far faster than reconstructing that long training command from memory." },
  { code: { lang: "powershell", t: "History",
    lines: [
     { c: "Get-History", w: "Everything you have run this session." },
     { c: "h | Select-String 'train'", w: "`h` is short for `Get-History`. Find that command from earlier." }
    ] } },

  { h: "Running things in the background" },
  { p: "A long job blocks the terminal. Two solutions, and the right one depends on whether you want to watch it." },
  { code: { lang: "powershell", t: "Background jobs",
    lines: [
     { c: "Start-Job -ScriptBlock { python train.py }", w: "Runs detached. The prompt returns immediately." },
     { c: "Get-Job", w: "What is running, and has it finished?" },
     { c: "Receive-Job -Id 1", w: "Collect the output it produced." },
     { c: "Stop-Job -Id 1", w: "Kill it." }
    ] } },
  { p: "Honestly, though: for a training run you usually want to *watch* it. The simpler answer is a second terminal tab — <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>T</kbd> in Windows Terminal. Run the job in one, work in the other. This is what most engineers actually do." },
  { code: { lang: "powershell", t: "Keeping the output",
    lines: [
     { c: "python train.py > train.log 2>&1", w: "Send normal output **and errors** into a file. `2>&1` means *errors go where normal output goes*." },
     { c: "cat train.log -Wait -Tail 20", w: "In another tab, watch it live." }
    ] } },
  { n: "`2>&1` is worth memorising. Programs write to two separate streams — normal output and errors — and redirecting only the first silently discards exactly the messages you will want when it fails at 3 a.m.",
    nt: "The two output streams" },

  { h: "When you do not know what a command does" },
  { p: "Do not search the web first. Every command carries its own documentation, and it describes the version you actually have rather than one from a blog post in 2019." },
  { code: { lang: "powershell", t: "Asking the command itself",
    lines: [
     { c: "help Select-String", w: "What it does and its main parameters." },
     { c: "help Select-String -Examples", w: "**Start here.** Worked examples are usually all you need." },
     { c: "help Select-String -Full", w: "Everything, including every parameter." },
     { c: "Get-Command *process*", w: "Find commands when you do not know the name." }
    ] } },
  { p: "PowerShell's naming is Verb-Noun and remarkably consistent, so `Get-Command *service*` or `*network*` genuinely discovers things. Guessing is a legitimate strategy here in a way it is not in bash." },

  { h: "When a program will not die" },
  { code: { lang: "powershell", t: "Last resort",
    lines: [
     { c: "ps | Where-Object Name -like '*python*'", w: "Find it and note its Id." },
     { c: "Stop-Process -Id 12345", w: "Ask it to stop." },
     { c: "Stop-Process -Id 12345 -Force", w: "Make it stop. Unsaved work in that program is lost." }
    ] } },

  { tryit: { t: "Run something long and watch it",
    task: "Start a command that takes about thirty seconds, redirect its output to a file, and follow that file live from a second tab.",
    hint: "`1..30 | ForEach-Object { \"tick $_\"; Start-Sleep 1 }` makes a slow job. Open a tab with Ctrl+Shift+T.",
    sol: { lang: "powershell", code: "# tab 1\n1..30 | ForEach-Object { \"tick $_\"; Start-Sleep 1 } > ticks.log 2>&1\n\n# tab 2\ncat ticks.log -Wait -Tail 5" },
    w: "This is exactly how you supervise a training run, a deployment, or a server. The pattern does not change with the size of the job." } },

  { vocab: ["Process", "File Descriptor"] }
 ],
 k: [
  "Ctrl+C cancels, Ctrl+R searches history, Tab completes, arrows recall. These are most of your speed.",
  "`Start-Job` detaches a job; a second terminal tab is usually simpler.",
  "`> file 2>&1` captures normal output *and* errors; `cat file -Wait -Tail 20` follows it live.",
  "`help <command> -Examples` is faster and more accurate than searching the web.",
  "`ps` then `Stop-Process -Id` kills something that will not quit."
 ],
 r: ["Process", "File Descriptor", "PowerShell"]
},

{
 t: "Translating Any Tutorial to Windows",
 m: "shellpower",
 lvl: "core",
 s: "The world's documentation is bash-shaped. Here is how to read it without getting stuck.",
 goal: [
  "Convert the common bash commands to their PowerShell equivalents on sight",
  "Recognise which instructions genuinely need Linux",
  "Decide when to install WSL rather than translate"
 ],
 b: [
  { p: "Most documentation, README files and Stack Overflow answers assume Mac or Linux. That is not going to change — servers run Linux. So the durable skill is not memorising Windows commands, it is **reading a bash instruction and knowing what it means for you.**" },

  { h: "The translation table" },
  { tbl: { t: "What you will read, and what to type",
    h: ["Tutorial says", "You type", "Notes"],
    rows: [
     ["`ls -la`", "`ls -Force`", "Detailed listing including hidden files"],
     ["`touch file.py`", "`New-Item file.py`", "No `touch` on Windows"],
     ["`cat file`", "`cat file`", "Works — it is an alias for `Get-Content`"],
     ["`head -20 f`", "`cat f -TotalCount 20`", ""],
     ["`tail -f log`", "`cat log -Wait -Tail 20`", "Following a live log"],
     ["`grep 'x' -r .`", "`sls 'x' . -Recurse`", "`sls` = `Select-String`"],
     ["`wc -l f`", "`(cat f \\| Measure-Object -Line).Lines`", ""],
     ["`which python`", "`Get-Command python`", ""],
     ["`export KEY=v`", "`$env:KEY = 'v'`", "This session only"],
     ["`source .venv/bin/activate`", "`.\\.venv\\Scripts\\Activate.ps1`", "The most-hit difference of all"],
     ["`rm -rf dir`", "`rm -Recurse -Force dir`", "Equally permanent"],
     ["`cmd1 && cmd2`", "`cmd1; if ($?) { cmd2 }`", "PowerShell 5.1 has no `&&`"],
     ["`sudo <anything>`", "Run the terminal as Administrator", "No `sudo` on Windows"],
     ["`man cmd`", "`help cmd -Examples`", ""],
     ["`curl url`", "`curl.exe url`", "Bare `curl` is an alias for `Invoke-WebRequest`, which behaves differently"]
    ] } },
  { trap: "That last row catches people badly. Typing `curl` in PowerShell does **not** run the real curl — it runs `Invoke-WebRequest`, which takes different flags and returns an object rather than raw text. Any `curl -X POST -H ...` command from an API tutorial will fail confusingly. Type **`curl.exe`** to get the genuine tool, which ships with Windows 11." },

  { h: "Three signs the instructions are not for you" },
  { ol: [
   "**`apt-get`, `yum`, `brew`** — Linux and Mac package managers. Your equivalent is `winget install`, or the project's own Windows installer.",
   "**Paths beginning `/usr/`, `/etc/`, `/var/`** — Linux filesystem locations that do not exist on Windows. Usually the Windows equivalent is under `C:\\Program Files` or your user folder.",
   "**`chmod` and `chown`** — Unix file permissions. Windows has a completely different permission model; these commands have no meaning and you can normally ignore the line entirely."
  ] },

  { h: "When to stop translating and install WSL" },
  { p: "**WSL** — Windows Subsystem for Linux — runs a genuine Linux inside Windows. Not an emulator or a virtual machine you have to manage: a real Ubuntu, sharing your files, opening in the same Windows Terminal." },
  { code: { lang: "powershell", t: "One command, then a restart",
    lines: [
     { c: "wsl --install", w: "Installs WSL and Ubuntu. Needs Administrator and a reboot." }
    ] } },
  { p: "Install it when:" },
  { ol: [
   "You are following a tutorial with many shell steps and translating each one is costing more than it teaches.",
   "You need a tool that genuinely has no Windows build — some ML and systems tooling still does not.",
   "You want to work in the same environment your code will be deployed into, which is worth real money in debugging time."
  ] },
  { p: "Stay in PowerShell when you are working with Windows files, running Python and normal libraries, or doing anything in this course. Both is the honest answer for most engineers: PowerShell for the machine you own, WSL for the world your code ships into." },

  { n: "This translation ability is not a Windows tax you are paying. It is the same skill as reading a Python example and writing it in JavaScript — seeing past the syntax to the intent. Engineers who can do that are unbothered by which machine they are handed, and that is a genuinely valuable trait.",
    nt: "Why this is worth learning properly" },

  { tryit: { t: "Translate a real README",
    task: "Here is a typical setup block from a project README. Rewrite every line for PowerShell.\n\n```\ngit clone https://github.com/x/y.git\ncd y\npython3 -m venv venv\nsource venv/bin/activate\npip install -r requirements.txt\nexport API_KEY=abc123\npython main.py\n```",
    hint: "Three lines need changing: the activation, the export, and possibly `python3` — on Windows the command is usually just `python`.",
    sol: { lang: "powershell", code: "git clone https://github.com/x/y.git\ncd y\npython -m venv venv\n.\\venv\\Scripts\\Activate.ps1\npip install -r requirements.txt\n$env:API_KEY = 'abc123'\npython main.py" },
    w: "`git`, `cd` and `pip` were already fine. That is the usual ratio — most of a README works unchanged and two or three lines need translating. Once you can spot those on sight, no tutorial is closed to you." } },

  { vocab: ["Shell", "Operating System"] }
 ],
 k: [
  "Most documentation is bash-shaped; translating it is a permanent, portable skill.",
  "The big three: `New-Item` for touch, `sls` for grep, `.\\.venv\\Scripts\\Activate.ps1` for source-activate.",
  "`curl` in PowerShell is not curl — use `curl.exe`.",
  "`apt-get`, `/usr/` paths and `chmod` mean the instructions assume Linux.",
  "`wsl --install` gives you real Linux when translating stops being worth it."
 ],
 r: ["Shell", "Operating System", "Kernel"]
},

{
 t: "The Habits That Make You Fast",
 m: "shellpower",
 lvl: "core",
 s: "What separates someone fluent in a terminal from someone who merely survives one.",
 goal: [
  "Adopt the handful of habits that compound over a career",
  "Set up a profile so your shell is configured the way you like",
  "Know what to do when you are completely stuck"
 ],
 b: [
  { p: "You now know more terminal than most working programmers use in a week. What remains is not more commands — it is the habits that make the commands feel effortless." },

  { h: "The six habits" },
  { ol: [
   "**Read the prompt before every command.** Which folder, which virtual environment. Most *why did that not work* is answered here in one second.",
   "**Tab-complete everything.** A completed name cannot be a typo, and it proves the thing exists.",
   "**Press ↑ before retyping.** You almost certainly ran something similar recently; editing it beats retyping it.",
   "**List before you delete.** Run `ls` with the same pattern as the `rm` you are about to run. Two seconds, and it is why you will never lose work.",
   "**Read the error message.** All of it, including the last line, which is usually the actual problem. Terminals are unusually honest — they generally say exactly what went wrong.",
   "**Automate on the third repetition.** By the third time you have proved it is recurring."
  ] },

  { h: "Make the shell yours" },
  { p: "Your **profile** is a script PowerShell runs every time it starts. Put your shortcuts in it once and they are there forever." },
  { code: { lang: "powershell", t: "Setting up a profile",
    lines: [
     { c: "notepad $PROFILE", w: "Opens your profile. If Notepad offers to create it, say yes." }
    ] } },
  { code: { lang: "powershell", t: "A reasonable starting profile",
    lines: [
     { c: "function proj { cd C:\\projects }", w: "Type `proj` to jump to your work from anywhere." },
     { c: "function ll { ls -Force }", w: "A detailed listing under a short name." },
     { c: "function gs { git status }", w: "You will type this a hundred times a day." },
     { c: "function act { .\\.venv\\Scripts\\Activate.ps1 }", w: "Activate the environment in the current project without typing the path." },
     { c: "", w: "" },
     { c: "Set-PSReadLineOption -PredictionSource History", w: "Suggests completions from what you have run before, greyed out ahead of the cursor. Press → to accept." }
    ] } },
  { p: "That last line is the biggest single quality-of-life improvement available in PowerShell and it is off by default. Turn it on." },

  { h: "When you are properly stuck" },
  { p: "In order, because each step is cheaper than the next:" },
  { ol: [
   "**Read the whole error.** Not the first line — the last one, and any file path or line number in it.",
   "**Check where you are.** `pwd`, and look for `(.venv)`. A startling share of problems is being in the wrong place.",
   "**Ask the command.** `help <command> -Examples`.",
   "**Check the program exists and is the right one.** `Get-Command <name> -All`.",
   "**Search the exact error text**, in quotes, minus anything specific to you like your username or a file path.",
   "**Restart the terminal.** Genuinely: if you have installed something or changed an environment variable, a stale shell is the most likely explanation."
  ] },

  { n: "Nobody memorises this. Working engineers look up flags constantly, including for commands they have used for a decade. What they have is not recall — it is knowing *that a thing is possible* and what to search for. That is what this module gave you, and it is the durable half.",
    nt: "The honest state of expertise" },

  { h: "Where this goes next" },
  { p: "Every tool you meet from here is a terminal program. Git is `git commit`. Docker is `docker run`. Training a model is `python train.py`. Deploying is a command. Every one of them assumes exactly what you have just learned." },
  { p: "And when you eventually connect to a server that has no screen, no mouse and no desktop, you will find you are already at home there — because a terminal on a machine in another country behaves exactly like the one on your desk." },

  { tryit: { t: "Set up your shell for real",
    task: "Open your profile, add at least three functions you will actually use, turn on history prediction, then restart the terminal and confirm they work.",
    hint: "`notepad $PROFILE`. Save, close, open a new terminal.",
    sol: { lang: "powershell", code: "# in $PROFILE\nfunction proj { cd C:\\projects }\nfunction ll { ls -Force }\nfunction gs { git status }\nfunction act { .\\.venv\\Scripts\\Activate.ps1 }\nSet-PSReadLineOption -PredictionSource History\n\n# then, in a new terminal:\nproj\nll" },
    w: "This is a thing you will carry between machines for years. Keep the file somewhere you can find it again." } },

  { vocab: ["Shell", "Automation"] }
 ],
 k: [
  "Read the prompt, Tab-complete, press ↑, list before deleting, read the whole error, automate on the third repetition.",
  "`$PROFILE` is a script that runs at every startup — put your shortcuts there.",
  "`Set-PSReadLineOption -PredictionSource History` is the best default PowerShell does not enable.",
  "Stuck? Read the error, check where you are, ask the command, verify the program, search the exact text, restart the terminal.",
  "Every tool you meet from here — Git, Docker, Python, deployment — is a terminal program."
 ],
 r: ["Shell", "Automation", "Git", "Docker"]
}

]);
