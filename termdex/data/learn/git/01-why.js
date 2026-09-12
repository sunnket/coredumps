/* Git — what version control is really for. */
TD.addLessons("git", [

{
 t: "The Problem Before Git",
 m: "why",
 lvl: "core",
 s: "Why folders named final_v2_REAL are a symptom, and what the cure had to do.",
 goal: [
  "Describe the three problems version control exists to solve",
  "Explain why a folder of copies is not a solution",
  "Say what Git is and what GitHub is, without confusing them"
 ],
 b: [
  { p: "Before any command, the model. Git makes complete sense once you know what it was built to fix, and almost none before — which is why most people who learn the commands first spend years afraid of it." },

  { h: "The folder everyone has had" },
  { code: { lang: "text", t: "Manual version control, as practised worldwide",
    lines: [
     { c: "report.docx", w: "" },
     { c: "report_v2.docx", w: "" },
     { c: "report_v2_final.docx", w: "" },
     { c: "report_v2_final_REAL.docx", w: "" },
     { c: "report_v2_final_REAL_priya_edits.docx", w: "" },
     { c: "report_FINAL_USE_THIS_ONE.docx", w: "**You have done this.** Everyone has done this, and it fails in three specific ways worth naming precisely." }
    ] } },
  { ol: [
   "**You cannot tell what changed.** Two files, five hundred lines each, and the only way to find the difference is to read both.",
   "**You cannot tell why.** Nothing records the reason a change was made, so in six months nobody — including you — knows whether that odd-looking line was a bug fix or an accident.",
   "**Two people cannot work at once.** Priya edits her copy while you edit yours, and merging them means one person manually retyping the other's work, or silently losing it."
  ] },
  { p: "A version control system solves exactly these three. Everything Git does is in service of *what changed*, *why*, and *how do we combine two people's work*." },

  { h: "What a version control system actually stores" },
  { p: "The idea that unlocks Git: it does not store your files. It stores **snapshots of your whole project, in order, with a note attached to each one**." },
  { ana: "Think of a video game with save points. You play for a while, you save. You try a risky route, and if it goes badly you reload the last save and nothing is lost. You can look at the list of saves and see when each was made and what you were doing. Git is that, for a folder of files — and unlike a game, you can also keep two saves going in parallel and merge them later.",
    at: "Save points for your work" },
  { l: [
   "**A snapshot is the whole project**, not one file. That is what lets Git restore a working state rather than a working file.",
   "**Each snapshot carries a message**, written by you, saying why. This is the *why* that filenames could never record.",
   "**Snapshots are ordered**, each pointing back to the one before, which is what makes a history rather than a pile.",
   "**Nothing is overwritten.** A new snapshot is added; the old ones stay exactly as they were. This is the property that makes Git safe."
  ] },

  { h: "Git versus GitHub" },
  { p: "These are different things and the confusion causes real problems, so it is worth being precise once." },
  { tbl: { h: ["", "Git", "GitHub"],
    rows: [
     ["What it is", "**A program on your computer**", "**A website**"],
     ["Made by", "Linus Torvalds, 2005", "A company, 2008; now owned by Microsoft"],
     ["Needs internet", "**No.** Everything works offline", "Obviously yes"],
     ["Does what", "Records snapshots, branches, merges, undoes", "Hosts a copy of a repository and adds collaboration around it"],
     ["Alternatives", "Mercurial, SVN — both far less used now", "GitLab, Bitbucket, Codeberg, or your company's own server"],
     ["Could you use one without the other", "**Yes, entirely.** Git alone is completely usable", "Not really — GitHub hosts Git repositories"]
    ] } },
  { n: "You can do this entire track's first three modules with no internet connection and no GitHub account. Git is the tool; GitHub is one popular place to put a copy. Keeping them separate in your head prevents a whole category of confusion later, particularly the belief that `commit` sends your work somewhere. It does not.",
    nt: "The distinction that saves confusion later" },

  { h: "Why Linus wrote it in ten days" },
  { p: "In 2005 the Linux kernel lost access to the proprietary tool it had been using. Torvalds looked at the alternatives, decided none of them could handle the kernel's situation, and wrote his own." },
  { p: "The kernel's situation was unusual and it shaped everything: thousands of contributors, scattered worldwide, with **no central server they all trusted** and no way to verify who was who. The design that fell out of those constraints is why Git behaves as it does." },
  { l: [
   "**Distributed.** Every clone is a complete repository with the full history, not a partial checkout. There is no privileged master copy — GitHub feels like one only by convention.",
   "**Content-addressed.** Every snapshot is identified by a cryptographic hash of its contents. Change one byte anywhere and the hash changes, so silent corruption is detectable.",
   "**Append-only in practice.** Operations add new objects rather than destroying old ones, which is why almost everything is recoverable.",
   "**Fast.** Branching and merging had to be cheap enough to do constantly, because thousands of parallel efforts were the normal state."
  ] },
  { q: "I'm an egotistical bastard, and I name all my projects after myself. First Linux, now git.", by: "Linus Torvalds, on the name" },
  { n: "That paranoid design is why the promise at the top of this track holds: your work is very hard to genuinely lose. Commands that look destructive usually just move a pointer, leaving the actual snapshot sitting there unreferenced and recoverable. The history module is where you learn to go and get it.",
    nt: "Why Git is safer than it feels" },

  { h: "What you get out of it" },
  { l: [
   "**A safety net.** Try the risky refactor. If it fails, one command puts everything back exactly as it was.",
   "**A record.** `git log` and `git blame` answer *when did this break* and *why is this line here* in seconds.",
   "**Collaboration without collisions.** Several people on the same files, with conflicts surfaced explicitly rather than resolved by whoever saved last.",
   "**Employability.** There is no software team that does not use this. None."
  ] },

  { tryit: { t: "Find the folder",
    task: "Before writing any Git, find a real example of manual version control on your own machine — a folder of dated copies, a `_final` file, a `backup_old` directory. Then write down the three questions from this lesson that it cannot answer.",
    hint: "Downloads and Documents are where these live. The three questions: what changed, why, and how would two people combine their edits.",
    sol: { lang: "text", code: "essay/\n  draft.docx            2026-03-02\n  draft_new.docx        2026-03-09\n  draft_new_fixed.docx  2026-03-09\n  draft_send.docx       2026-03-11\n\nWhat changed between new and new_fixed?  No idea without opening both.\nWhy was it fixed?                         Nothing records it.\nIf two of us edited draft_send at once?   One of us loses the work." },
    w: "Doing this once, on your own files, is worth more than reading three explanations. Every Git command in this track is an answer to one of those three questions." } }
 ],
 k: [
  "Version control answers three questions filenames cannot: what changed, why, and how to combine two people's work.",
  "Git stores ordered **snapshots of the whole project**, each with a message, and never overwrites the old ones.",
  "Git is a program on your machine; GitHub is a website that hosts copies. You can use Git entirely offline.",
  "Its distributed, content-hashed design came from the Linux kernel's needs — and is why your work is hard to lose."
 ],
 r: ["Version Control", "Git", "Repository", "Commit", "Distributed System"]
},

{
 t: "The Three Places Your Work Lives",
 m: "why",
 lvl: "core",
 s: "Working directory, staging area, repository — the mental model that makes every command obvious.",
 goal: [
  "Name the three places a change can be and say what each means",
  "Explain what the staging area is for",
  "Predict which command moves a change between them"
 ],
 b: [
  { p: "This is the most important lesson in the track. Every Git command you will ever run moves changes between three places, and once you can picture them, the commands stop needing memorisation." },

  { h: "The three places" },
  { code: { lang: "text", t: "One project, three states a change can be in",
    lines: [
     { c: "  WORKING DIRECTORY          STAGING AREA            REPOSITORY", w: "" },
     { c: "  (your actual files)        (the next snapshot)     (all past snapshots)", w: "" },
     { c: "", w: "" },
     { c: "  edited app.py       -->    app.py ready      -->   commit a1b2c3d", w: "" },
     { c: "  edited notes.txt           (notes.txt not          commit 9f8e7d6", w: "" },
     { c: "                              included)              commit 4c5b6a1", w: "" },
     { c: "", w: "" },
     { c: "       git add  ------------->                              ", w: "**`add` moves a change from your files into the staging area.**" },
     { c: "                    git commit ----------------->            ", w: "**`commit` turns everything staged into a permanent snapshot.**", hi: true }
    ] } },

  { tbl: { h: ["Place", "Also called", "What is in it"],
    rows: [
     ["**Working directory**", "working tree", "The actual files on your disk, exactly as your editor sees them right now"],
     ["**Staging area**", "the index, the cache", "A list of the changes you have chosen to include in your **next** snapshot"],
     ["**Repository**", "the `.git` folder, history", "Every snapshot ever committed, permanently"]
    ] } },

  { h: "Why the middle one exists" },
  { p: "Most people meeting Git ask why staging exists at all — why not just save everything you changed? The answer is that a commit should be **one coherent idea**, and an afternoon's editing usually is not." },
  { ana: "You are packing a parcel. The working directory is your desk, covered in things. The staging area is the open box: you put in only the things that belong in *this* parcel, and you can take something back out before sealing it. The commit is sealing and posting it. Without the box you would have to post the entire desk every time.",
    at: "The box before you seal it" },
  { code: { lang: "bash", t: "A realistic afternoon",
    lines: [
     { c: "# you have changed three files:", w: "" },
     { c: "#   auth.py     - fixed the login bug", w: "" },
     { c: "#   auth.py     - also renamed a variable while you were in there", w: "" },
     { c: "#   notes.txt   - unrelated personal scratch notes", w: "" },
     { c: "", w: "" },
     { c: "git add auth.py", w: "**Stage only the file that belongs in this commit.** `notes.txt` stays out of it." },
     { c: "git commit -m \"Fix login failure on expired sessions\"", w: "One commit, one idea, one message that will still make sense in a year.", hi: true }
    ] } },
  { n: "This matters more than it sounds. A history where each commit is one clear change lets you find the commit that broke something, undo one change without undoing four others, and read the log as a description of the project's development. A history of commits called `stuff` and `more fixes` can do none of that, and staging is the tool that makes the difference.",
    nt: "Why one commit per idea pays off" },

  { h: "Seeing all three at once" },
  { term: { title: "Terminal", t: "`git status` is a picture of the three places, and you should run it constantly.",
    lines: [
     { c: "git status", w: "" },
     { out: "On branch main\n\nChanges to be committed:\n  (use \"git restore --staged <file>...\" to unstage)\n        modified:   auth.py\n\nChanges not staged for commit:\n  (use \"git add <file>...\" to update what will be committed)\n        modified:   config.py\n\nUntracked files:\n  (use \"git add <file>...\" to include in what will be committed)\n        notes.txt" }
    ] } },
  { p: "Three headings, and each is one of the three places." },
  { l: [
   "**Changes to be committed** — staged. In the box, ready to be sealed.",
   "**Changes not staged for commit** — modified in your working directory, but Git already knows about the file and you have not chosen to include this change.",
   "**Untracked files** — files Git has never seen. It will not touch them until you `add` them once."
  ] },
  { n: "Notice that `git status` prints the command to fix each situation, in brackets, every time. Git's error and status messages are unusually good at this, and reading them rather than searching the web is the single fastest way to get better at Git.",
    nt: "Git tells you the next command" },

  { h: "The fourth place, once GitHub appears" },
  { p: "There is one more, and it only exists once you have a remote copy." },
  { code: { lang: "text",
    lines: [
     { c: "  WORKING  -->  STAGING  -->  LOCAL REPO  -->  REMOTE REPO", w: "" },
     { c: "           add          commit           push", w: "**`push` is a fourth, separate step.** Committing does *not* send anything anywhere — your commits sit on your own machine until you explicitly push them.", hi: true }
    ] } },
  { trap: "*I committed it, so it's backed up* is wrong and it costs people work. A commit writes to `.git` inside the same folder, on the same disk. If the laptop dies, the commits die with it. Only `push` puts a copy somewhere else. The GitHub module covers this properly, but the misconception is worth killing now." },

  { h: "The whole daily loop" },
  { code: { lang: "bash", t: "Four commands, in this order, forever",
    lines: [
     { c: "git status", w: "**Where am I and what have I changed.** Run this more often than you think you need to." },
     { c: "git add <files>", w: "**Choose what goes in this commit.**" },
     { c: "git commit -m \"message\"", w: "**Seal it, with a note saying why.**" },
     { c: "git push", w: "**Send it to the shared copy.** Once there is one." }
    ],
    after: "That is genuinely the ninety-per-cent case. Everything else in this track is either inspecting the history or getting out of trouble." } },

  { tryit: { t: "Say where each change is",
    task: "For each of these, name which of the three places the change is in: (a) you typed into a file and saved it; (b) you ran `git add` on it; (c) you ran `git commit`; (d) you created a brand-new file and did nothing else; (e) you ran `git add` and then edited the file again.",
    hint: "(e) is the interesting one — think about what `add` actually copied, and when.",
    sol: { lang: "text", code: "a) Working directory. Git sees it as modified, not staged.\nb) Staging area. It is in the box for the next commit.\nc) Repository. A permanent snapshot; working dir and staging are now clean.\nd) Working directory, and untracked — Git has never seen this file.\ne) BOTH. The version you added is staged; the newer edit is unstaged.\n   git status will list the same file under two headings at once." },
    w: "(e) surprises everyone the first time, and it is the clearest proof that staging is a real snapshot rather than a list of filenames. `git add` copies the file's content *at that moment*. Edit afterwards and the box still holds the older version — which is why running `git add` again before committing is such a common habit." } }
 ],
 k: [
  "Three places: working directory (your files), staging area (the next snapshot), repository (all past snapshots).",
  "`add` moves working → staging; `commit` moves staging → repository; `push` sends the repository elsewhere.",
  "Staging exists so one commit can be one coherent idea rather than an afternoon of unrelated edits.",
  "`git status` shows all three at once and prints the command you need — read it rather than guessing."
 ],
 r: ["Git", "Commit", "Repository", "Version Control", "Merge"],
 drill: {
  lang: "bash",
  reps: 3,
  items: [
   { c: "git status", w: "see what is changed, staged and untracked" },
   { c: "git add auth.py", w: "put one file's current content into the next snapshot" },
   { c: "git commit -m \"Fix login failure on expired sessions\"", w: "seal the staged changes with a message saying why" }
  ]
 }
}

]);
