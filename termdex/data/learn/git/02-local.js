/* Git — working on your own. */
TD.addLessons("git", [

{
 t: "Starting a Repository",
 m: "local",
 lvl: "core",
 s: "One command, and what it actually creates.",
 goal: [
  "Turn any folder into a repository",
  "Say what the `.git` directory holds and why you never touch it",
  "Set up the configuration Git will otherwise nag you about"
 ],
 b: [
  { p: "Before the first commit, two small pieces of setup. They take three minutes and save an afternoon of confusion later." },

  { h: "Tell Git who you are" },
  { p: "Every commit records an author. Git refuses to guess, and if you skip this it will stop you at your first commit with an unhelpful error." },
  { term: { title: "Terminal", t: "Run these once per machine, not once per project.",
    lines: [
     { c: "git config --global user.name \"Aryan Sharma\"", w: "**`--global` means for every repository on this computer.** Without it, the setting applies only to the folder you are standing in." },
     { c: "git config --global user.email \"you@example.com\"", w: "**Use the address you will register with GitHub.** GitHub matches commits to your account by this email — get it wrong and your work shows up as an anonymous stranger." },
     { c: "git config --global init.defaultBranch main", w: "**Names the first branch `main` rather than the older `master`.** Every hosting platform now defaults to `main`; matching it avoids a small annoyance on every new repository." },
     { c: "git config --list", w: "Check what is set. `git config --global --edit` opens the file directly." }
    ] } },
  { n: "The email is recorded in every commit and is public in any repository you publish. If you would rather not expose a personal address, GitHub can give you a `@users.noreply.github.com` address in its email settings — use that as your `user.email` and commits still attribute correctly.",
    nt: "That email will be public" },

  { h: "Creating the repository" },
  { term: { title: "Terminal",
    lines: [
     { c: "cd ~/projects/my-app", w: "**Stand in the folder you want to track.** This is where `pwd` from the Ground Zero track earns its keep — running `init` in the wrong directory is a classic first mistake." },
     { c: "git init", w: "" },
     { out: "Initialized empty Git repository in /Users/aryan/projects/my-app/.git/" },
     { c: "git status", w: "**Confirm it worked.** Outside a repository this command errors, so it doubles as a check." },
     { out: "On branch main\n\nNo commits yet\n\nnothing to commit (create/copy files and use \"git add\" to track)" }
    ] } },
  { p: "That is the whole thing. `init` does not upload anything, does not require an account, and does not change any of your files. It creates one hidden folder." },

  { h: "What is in `.git`" },
  { term: { title: "Terminal",
    lines: [
     { c: "ls -a", w: "**`-a` shows hidden files**, and `.git` is hidden because you are not meant to be in there." },
     { out: ".  ..  .git  app.py  README.md" },
     { c: "ls .git", w: "" },
     { out: "HEAD  config  description  hooks/  info/  objects/  refs/" }
    ] } },
  { l: [
   "**`objects/`** — every snapshot, every file version, every commit, stored by content hash. **This is your entire history.**",
   "**`refs/`** — the branches and tags: small files each containing one commit hash.",
   "**`HEAD`** — a single line saying which branch you are currently on.",
   "**`config`** — this repository's own settings, layered over your global ones."
  ] },
  { trap: "Deleting `.git` deletes your entire history — every commit, every branch — instantly and with no confirmation. The files in the folder survive, because those are just files, but the project reverts to being an ordinary directory. It is the one folder in Git that is genuinely dangerous, and the only reason to touch it is if you deliberately want to un-version a project." },
  { ana: "`.git` is the archive room behind the office. You work in the office; the archive holds every previous version of everything, filed by a system you do not need to understand. You go in through the front desk — the `git` commands — rather than rearranging the shelves yourself.",
    at: "The archive room" },

  { h: "Cloning instead" },
  { p: "The other way a repository appears on your machine: copying someone else's." },
  { term: { title: "Terminal",
    lines: [
     { c: "git clone https://github.com/user/project.git", w: "**Downloads the entire repository — every commit, every branch, the whole history** — into a new folder named `project`." },
     { c: "git clone https://github.com/user/project.git myfolder", w: "Into a folder you name instead." },
     { c: "cd project", w: "**`clone` runs `init` for you**, so the folder is already a repository. Never run `git init` inside a clone." }
    ],
    after: "This is the distributed design from the first lesson made concrete: you did not download a copy of the latest files, you downloaded a complete, independent repository. Unplug the network and you can still browse the entire history, create branches and commit." } },

  { h: "Choosing what not to track" },
  { p: "Some files should never be committed, and the mechanism for that is a file called `.gitignore` in the root of the repository." },
  { code: { lang: "bash", file: ".gitignore",
    lines: [
     { c: "# Python", w: "**Lines starting with `#` are comments.**" },
     { c: "__pycache__/", w: "**A trailing slash means a directory.** Compiled bytecode — regenerated automatically, so committing it is noise." },
     { c: "*.pyc", w: "**`*` matches anything.** Same reasoning." },
     { c: ".venv/", w: "**Never commit a virtual environment.** It is thousands of files, it is machine-specific, and `requirements.txt` recreates it in one command." },
     { c: "", w: "" },
     { c: "# secrets — the important ones", w: "" },
     { c: ".env", w: "**API keys, passwords, connection strings.** Committing one of these is the most expensive Git mistake there is, and this line prevents it.", hi: true },
     { c: "*.key", w: "" },
     { c: "credentials.json", w: "" },
     { c: "", w: "" },
     { c: "# editor and OS noise", w: "" },
     { c: ".vscode/", w: "" },
     { c: ".DS_Store", w: "macOS puts one of these in every folder it looks at." },
     { c: "", w: "" },
     { c: "# data and build output", w: "" },
     { c: "*.csv", w: "**Large data files do not belong in Git.** Every version is stored in full, and the repository grows without bound." },
     { c: "dist/", w: "" },
     { c: "!sample.csv", w: "**`!` un-ignores something.** Ignore all CSVs, but keep the small sample file the tests need." }
    ] } },
  { trap: "**`.gitignore` only applies to files Git is not already tracking.** Add a file to it after you have committed that file once, and Git carries on tracking it happily. To stop: `git rm --cached secrets.env`, which removes it from tracking while leaving it on your disk — and then commit that removal. Note that this does *not* remove it from the past history, which is why a committed secret must be treated as leaked and rotated, not just deleted." },
  { n: "You rarely need to write one from scratch. `github.com/github/gitignore` holds a curated file for every language, and most tools generate one. Start from theirs and add your own project's specifics.",
    nt: "Do not write it by hand" },

  { tryit: { t: "Set up a real project",
    task: "Create a folder, put two or three files in it including one that should never be committed (a fake `.env` with an obviously fake key), run `git init`, write a `.gitignore` and confirm with `git status` that the secret does not appear as untracked.",
    hint: "If it still shows up, check the `.gitignore` is in the repository root and the pattern matches exactly.",
    sol: { lang: "bash", code: "mkdir price-tracker && cd price-tracker\ngit init\n\nprintf 'API_KEY=fake-not-a-real-key\\n' > .env\nprintf 'print(\"hello\")\\n' > app.py\nprintf '# Price Tracker\\n' > README.md\n\nprintf '.env\\n__pycache__/\\n.venv/\\n' > .gitignore\n\ngit status\n# Untracked files:\n#   .gitignore\n#   README.md\n#   app.py\n# .env is absent — which is the point" },
    w: "Commit the `.gitignore` itself. It is one of the few files that belongs in every repository, and committing it means everyone who clones the project gets the same protection rather than each person having to remember." } }
 ],
 k: [
  "Set `user.name` and `user.email` globally once — the email is public in every commit you make.",
  "`git init` creates one hidden `.git` folder holding your entire history; deleting it deletes everything.",
  "`git clone` downloads a complete independent repository, not just the latest files.",
  "`.gitignore` keeps secrets, dependencies and build output out — but only for files not already tracked."
 ],
 r: ["Git", "Repository", "Configuration File", "Environment Variable", "Secrets Management"],
 drill: {
  lang: "bash",
  reps: 3,
  items: [
   { c: "git config --global user.email \"you@example.com\"", w: "set the email recorded on every commit from this machine" },
   { c: "git init", w: "turn the current folder into a repository" },
   { c: "git clone https://github.com/user/project.git", w: "download a complete copy of someone's repository" },
   { c: "git rm --cached secrets.env", w: "stop tracking a file without deleting it from disk" }
  ]
 }
},

{
 t: "add, commit and the Daily Loop",
 m: "local",
 lvl: "core",
 s: "The two commands you will run thousands of times, and how to write a message worth reading.",
 goal: [
  "Stage exactly the changes you intend, and no more",
  "Write a commit message that helps the next reader",
  "Recognise and fix the mistakes people make in this loop"
 ],
 b: [
  { p: "Two commands, run over and over. What separates a professional history from an unusable one is not knowing more commands — it is being deliberate with these two." },

  { h: "Staging" },
  { code: { lang: "bash",
    lines: [
     { c: "git add app.py", w: "**One file.** The most deliberate form, and the right default." },
     { c: "git add app.py tests/test_app.py", w: "Several, named." },
     { c: "git add src/", w: "Everything under a directory." },
     { c: "git add *.py", w: "Everything matching a pattern." },
     { c: "", w: "" },
     { c: "git add .", w: "**Everything changed below the current directory.** Convenient, and the source of most accidental commits — it will happily stage the debug file, the large CSV and the config you were experimenting with.", hi: true },
     { c: "", w: "" },
     { c: "git add -p", w: "**Interactive: Git shows each chunk of change and asks whether to stage it.** `y`, `n`, `s` to split a chunk smaller, `q` to stop. This is how one file's worth of mixed edits becomes two clean commits, and it is the habit that most marks out someone who is good at Git." }
    ] } },
  { n: "`git add .` is not forbidden — most people use it most of the time. The rule that makes it safe is to run `git status` **before** it and `git diff --staged` **after**, so you have looked at what you are about to commit. The failure mode is `add .` followed immediately by `commit`, with no look in between.",
    nt: "When `add .` is fine" },

  { h: "Committing" },
  { code: { lang: "bash",
    lines: [
     { c: "git commit -m \"Add password reset endpoint\"", w: "**`-m` supplies the message inline.** Without it Git opens an editor, which is fine but surprises people the first time." },
     { c: "", w: "" },
     { c: "git commit -am \"Fix typo in error text\"", w: "**`-a` stages every already-tracked file automatically**, skipping `add`. It does **not** pick up new files, which is exactly the trap: your new module silently stays out of the commit." },
     { c: "", w: "" },
     { c: "git commit", w: "**No `-m` opens your editor** for a multi-line message — the right choice when the change needs a paragraph of explanation." }
    ] } },
  { term: { title: "Terminal", t: "What a commit prints back",
    lines: [
     { c: "git commit -m \"Add password reset endpoint\"", w: "" },
     { out: "[main 7c4f21a] Add password reset endpoint\n 2 files changed, 47 insertions(+), 3 deletions(-)\n create mode 100644 auth/reset.py" },
     { c: "", w: "**`7c4f21a` is the commit's hash**, shortened. That is its permanent name, and every command that takes a commit takes this. Read the line under it as a sanity check — *2 files changed* when you expected one is a signal to look." }
    ] } },

  { h: "Writing the message" },
  { p: "The message is the *why* that the whole system exists to record. It is written once and read many times, often by you, often at speed, often while something is broken." },
  { vs: { t: "The same change, two messages", lang: "text",
    bad: { c: "git commit -m \"fix\"\ngit commit -m \"stuff\"\ngit commit -m \"asdf\"\ngit commit -m \"final fix pls work\"", label: "Useless in three weeks",
      w: "Nobody — including you — can find anything in this history. When a bug appears you have no way to narrow down which commit introduced it." },
    good: { c: "git commit -m \"Fix session timeout on password reset\"\ngit commit -m \"Add rate limiting to the login endpoint\"\ngit commit -m \"Cache the country lookup, cutting page load 400ms\"", label: "Still useful in three years",
      w: "Each one says what changed and implies why. `git log --oneline` becomes a readable summary of the project's development." } } },
  { l: [
   "**Use the imperative mood** — *Add*, *Fix*, *Remove*, not *Added* or *Adding*. The convention reads as *this commit will…*, and Git's own generated messages follow it.",
   "**Keep the first line under about 50 characters.** It is the summary line, shown truncated in most tools.",
   "**Say what and why, not how.** The diff already shows how. `Fix login crash` is weaker than `Fix login crash when the session cookie is missing`.",
   "**Blank line, then a paragraph**, if the change needs justification. The body is where you explain a non-obvious decision.",
   "**Reference an issue** if there is one — `Fixes #142`. GitHub links and closes it automatically."
  ] },
  { code: { lang: "text", t: "A full message, for a change that needs one",
    lines: [
     { c: "Cache country lookups for 24 hours", w: "**Summary: imperative, short, specific.**" },
     { c: "", w: "**Blank line. Required** — without it Git treats the whole thing as one long summary." },
     { c: "The country API is called on every page render and takes", w: "" },
     { c: "roughly 400ms. The data changes at most once a year, so", w: "**The body explains the reasoning**, which the diff cannot." },
     { c: "caching it in Redis for 24h is safe.", w: "" },
     { c: "", w: "" },
     { c: "Median page load drops from 1.1s to 0.7s.", w: "**Evidence.** A future reader can tell whether the trade was worth it." },
     { c: "", w: "" },
     { c: "Fixes #142", w: "" }
    ] } },

  { h: "How big should a commit be" },
  { p: "One idea. The practical test: can you describe it in one line without using the word *and*? If not, it probably wants to be two commits." },
  { tbl: { h: ["Too small", "About right", "Too large"],
    rows: [
     ["One commit per line changed", "**One bug fixed**", "*Work from Tuesday*"],
     ["`Add semicolon`", "**One feature added**", "Three features and a refactor"],
     ["Noise that hides the real changes", "**One refactor, no behaviour change**", "Impossible to review or to revert cleanly"]
    ] } },
  { n: "The pay-off for small commits arrives when something breaks. `git bisect` can find the exact commit that introduced a bug by binary search through your history — which is close to magic when commits are small and single-purpose, and useless when each one changes forty files.",
    nt: "Why small commits pay off later" },

  { h: "Undoing before you commit" },
  { code: { lang: "bash",
    lines: [
     { c: "git restore --staged app.py", w: "**Unstage it.** The change stays in your working directory; it is just taken back out of the box." },
     { c: "git restore app.py", w: "**Discard the change entirely**, reverting the file to its last committed state. **This one genuinely destroys uncommitted work** — there is no undo, because Git never had a copy.", hi: true },
     { c: "", w: "" },
     { c: "git commit --amend -m \"Better message\"", w: "**Rewrite the most recent commit.** Fixes a typo in a message, or adds a file you forgot — stage it first, then amend." },
     { c: "git commit --amend --no-edit", w: "Add the staged changes to the last commit, keeping its message." }
    ] } },
  { trap: "`--amend` does not edit the old commit — it **replaces** it with a new one that has a different hash. That is harmless while the commit is only on your machine. Once it has been pushed and someone else has pulled it, amending rewrites shared history and creates a genuine mess for them. The rule: amend freely before pushing, essentially never after." },

  { tryit: { t: "Two ideas, two commits",
    task: "In a scratch repository, make two unrelated changes to the *same file* — fix a typo in a comment and add a new function. Then commit them as two separate commits, each with a clean message.",
    hint: "`git add -p` is what makes this possible. Say `y` to one chunk and `n` to the other, commit, then repeat.",
    sol: { lang: "bash", code: "# both edits are in app.py\ngit add -p app.py\n#  Stage this hunk [y,n,q,a,d,s,e,?]? y      <- the typo fix\n#  Stage this hunk [y,n,q,a,d,s,e,?]? n      <- the new function\ngit commit -m \"Fix typo in the rate limit comment\"\n\ngit add app.py\ngit commit -m \"Add retry helper for transient API failures\"\n\ngit log --oneline -2" },
    w: "This is the technique that separates people who fight Git from people who use it. The alternative — one commit called `typo fix and new helper` — cannot be reverted, reviewed or bisected independently, and you gave that up to save fifteen seconds." } }
 ],
 k: [
  "`git add -p` stages individual chunks, which is how one messy file becomes two clean commits.",
  "`git add .` is fine when `git status` before and `git diff --staged` after are part of the habit.",
  "Write messages in the imperative, under 50 characters, saying what and why — the diff already shows how.",
  "`git restore <file>` destroys uncommitted work permanently; `--amend` is safe only before pushing."
 ],
 r: ["Commit", "Git", "Code Review", "Diff", "Refactoring"],
 drill: {
  lang: "bash",
  reps: 3,
  items: [
   { c: "git add -p", w: "step through each chunk of change and choose what to stage" },
   { c: "git commit -m \"Add password reset endpoint\"", w: "seal the staged changes with a one-line message" },
   { c: "git restore --staged app.py", w: "take a file back out of the next commit, keeping the edit" },
   { c: "git restore app.py", w: "throw away an uncommitted edit entirely", hint: "no undo for this one" },
   { c: "git commit --amend --no-edit", w: "fold the staged change into the previous commit" }
  ]
 }
},

{
 t: "diff — Seeing Exactly What Changed",
 m: "local",
 lvl: "core",
 s: "Reading the format Git speaks in, and the habit that prevents most bad commits.",
 goal: [
  "Read a unified diff line by line",
  "Choose the right diff command for what you want to see",
  "Check a change before committing it"
 ],
 b: [
  { p: "`git diff` answers *what changed*, which was the first of the three questions from the opening lesson. It also appears everywhere else — in pull request reviews, in `git show`, in every code review tool ever built — so learning to read the format once pays out constantly." },

  { h: "The four diffs" },
  { tbl: { h: ["Command", "Compares"],
    rows: [
     ["`git diff`", "**Working directory against staging.** What you have changed but not staged"],
     ["`git diff --staged`", "**Staging against the last commit.** Exactly what your next commit will contain"],
     ["`git diff HEAD`", "Working directory against the last commit — both of the above together"],
     ["`git diff main feature`", "One branch against another"],
     ["`git diff a1b2c3d 7f8e9d0`", "Any two commits"],
     ["`git show a1b2c3d`", "What one commit changed, with its message"]
    ] } },
  { n: "`git diff --staged` is the one to make a habit of. Run it immediately before every commit and you will catch the debug print, the commented-out block and the accidentally-included file — the three things that most often slip through. It takes two seconds.",
    nt: "The habit worth building" },

  { h: "Reading the format" },
  { code: { lang: "diff", t: "A real diff, annotated",
    lines: [
     { c: "diff --git a/auth.py b/auth.py", w: "**Which file.** `a/` is the old version, `b/` is the new one." },
     { c: "index 8c3d1f2..a91b7e4 100644", w: "The internal hashes and the file mode. Safe to ignore." },
     { c: "--- a/auth.py", w: "**The old version** is marked with `---`." },
     { c: "+++ b/auth.py", w: "**The new version** with `+++`." },
     { c: "@@ -14,7 +14,9 @@ def login(user, password):", w: "**The hunk header.** *From the old file, 7 lines starting at line 14; from the new file, 9 lines starting at line 14.* The text after it is the enclosing function, which Git works out to give you context.", hi: true },
     { c: "     if not user:", w: "**A leading space means unchanged** — context lines, shown so you can see where you are." },
     { c: "         return None", w: "" },
     { c: "-    token = make_token(user)", w: "**A leading minus is a removed line.** Red in a colour terminal." },
     { c: "+    if user.is_locked:", w: "**A leading plus is an added line.** Green." },
     { c: "+        raise AccountLocked(user.id)", w: "" },
     { c: "+    token = make_token(user, ttl=3600)", w: "" },
     { c: "     return token", w: "" }
    ] } },
  { p: "That is the entire format. A modified line appears as a removal immediately followed by an addition, because a diff has no concept of *edited* — only of lines that left and lines that arrived." },
  { trap: "A one-character change to a long line shows as the whole line removed and the whole line added, which makes small changes look alarming. `git diff --word-diff` marks changes within the line instead, and is much easier to read for prose, documentation and config files." },

  { h: "Making diffs readable" },
  { code: { lang: "bash",
    lines: [
     { c: "git diff --stat", w: "**A summary rather than the content** — files changed and how many lines each. The right first look at a large change." },
     { c: "git diff --name-only", w: "Just the filenames. Useful for piping into other commands." },
     { c: "", w: "" },
     { c: "git diff -w", w: "**Ignore whitespace changes.** Turns a reindentation that touched 300 lines back into the two real changes hiding inside it." },
     { c: "git diff --word-diff", w: "Highlight changes within a line." },
     { c: "", w: "" },
     { c: "git diff -- auth.py", w: "**Limit to one file.** The bare `--` separates paths from other arguments, which matters when a file and a branch share a name." },
     { c: "git diff HEAD~3", w: "**Against three commits ago.** `~n` means *n commits back from here*." }
    ] } },

  { h: "git show" },
  { term: { title: "Terminal", t: "One commit, in full",
    lines: [
     { c: "git show 7c4f21a", w: "**The message, the author, the date and the complete diff** for that one commit." },
     { c: "git show HEAD", w: "The most recent commit. `HEAD~1` is the one before it." },
     { c: "git show HEAD:auth.py", w: "**The whole file as it was at that commit** — not a diff. The quickest way to see a file's earlier state without checking anything out." },
     { c: "git show --stat HEAD", w: "Just which files that commit touched." }
    ] } },

  { h: "A pre-commit routine" },
  { code: { lang: "bash", t: "Twenty seconds that prevents most bad commits",
    lines: [
     { c: "git status", w: "**What is changed, staged and untracked.** Anything unexpected in the untracked list?" },
     { c: "git diff", w: "**What have I changed but not staged?** Is there something here that should be in this commit?" },
     { c: "git add -p", w: "**Stage deliberately**, looking at each chunk as it goes by." },
     { c: "git diff --staged", w: "**Read exactly what is about to be committed.** This is the step people skip and the one that catches things.", hi: true },
     { c: "git commit -m \"...\"", w: "" }
    ] } },

  { tryit: { t: "Read a diff you did not write",
    task: "Clone any small open-source project. Run `git log --oneline -20`, pick a commit whose message interests you, and run `git show` on it. Work out what the change did from the diff alone, then check whether the message describes it accurately.",
    hint: "`git show --stat` first to see the shape of the change, then the full `git show` for the detail.",
    sol: { lang: "bash", code: "git clone --depth 50 https://github.com/psf/requests.git\ncd requests\n\ngit log --oneline -20\ngit show --stat 3f9d1c2\ngit show 3f9d1c2\n\n# then, for one file's history:\ngit log --oneline -- requests/sessions.py" },
    w: "`--depth 50` clones only the last fifty commits, which is much faster on a large project. Reading other people's diffs is the fastest way to get fluent at the format — and to develop an eye for what a well-scoped commit looks like." } }
 ],
 k: [
  "`git diff` is unstaged changes; `git diff --staged` is exactly what your next commit contains.",
  "In a diff, `-` is removed, `+` is added, a leading space is context, and `@@` gives the line numbers.",
  "`-w` ignores whitespace and `--stat` summarises — both make large changes readable.",
  "Read `git diff --staged` before every commit; it catches the debug print and the stray file."
 ],
 r: ["Diff", "Commit", "Code Review", "Version Control"],
 drill: {
  lang: "bash",
  reps: 3,
  items: [
   { c: "git diff", w: "see what you changed but have not staged" },
   { c: "git diff --staged", w: "see exactly what the next commit will contain" },
   { c: "git diff --stat", w: "summarise a change as files and line counts" },
   { c: "git show HEAD", w: "see the last commit's message and full diff" },
   { c: "git show HEAD:auth.py", w: "print a whole file as it was at a commit" }
  ]
 }
}

]);
