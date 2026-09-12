/* Git — branches and merging. */
TD.addLessons("git", [

{
 t: "Branches — Working on Two Things at Once",
 m: "branch",
 lvl: "core",
 s: "What a branch actually is, which turns out to be far smaller than everyone assumes.",
 goal: [
  "Say what a branch physically is in Git",
  "Create, switch and delete branches confidently",
  "Explain what HEAD is and what detached HEAD means"
 ],
 b: [
  { p: "Branching is Git's headline feature and the reason it beat everything before it. In older systems a branch meant copying the entire project — slow, heavy, and rare enough that teams avoided it. In Git a branch is a **41-byte file**, and that difference changed how software is written." },

  { h: "What a branch is" },
  { p: "A branch is a **file containing one commit hash**. That is the whole implementation." },
  { term: { title: "Terminal", t: "Look at it directly, once, and branches stop being mysterious",
    lines: [
     { c: "cat .git/refs/heads/main", w: "" },
     { out: "7c4f21ad9e3b5c8f1a2d4e6b8c0f2a4d6e8b0c2f" },
     { c: "", w: "**Forty characters and a newline. That is the entire branch.** Nothing is copied, nothing is duplicated — it is a sticky note pointing at one commit.", hi: true }
    ] } },
  { p: "Because a commit records its parent, pointing at one commit gives you the entire line of history behind it for free. The branch only needs to know where the tip is." },
  { ana: "The commits are a chain of numbered pages, each referring back to the previous one. A branch is a bookmark clipped to one page. Making a new branch clips a second bookmark to the same page — instant, and it copies nothing. Committing on that branch writes a new page and moves *that* bookmark forward, leaving the other where it was.",
    at: "Bookmarks, not photocopies" },

  { h: "HEAD" },
  { p: "**`HEAD` is a pointer to the branch you are currently on.** One more small file." },
  { term: { title: "Terminal",
    lines: [
     { c: "cat .git/HEAD", w: "" },
     { out: "ref: refs/heads/main" },
     { c: "", w: "**HEAD points at a branch, and that branch points at a commit.** When you commit, Git writes the new commit and moves the branch HEAD names. That indirection is the whole mechanism." }
    ] } },
  { code: { lang: "text", t: "Committing, in terms of pointers",
    lines: [
     { c: "  A --- B --- C   <- main   <- HEAD", w: "Before." },
     { c: "", w: "" },
     { c: "  git commit", w: "" },
     { c: "", w: "" },
     { c: "  A --- B --- C --- D   <- main   <- HEAD", w: "**D is written, main moves to D, HEAD still says main.** Nothing else changed." }
    ] } },

  { h: "The commands" },
  { code: { lang: "bash",
    lines: [
     { c: "git branch", w: "**List local branches**, with a `*` on the current one." },
     { c: "git branch -a", w: "Include remote-tracking branches." },
     { c: "git branch -v", w: "With each one's latest commit." },
     { c: "", w: "" },
     { c: "git switch -c feature/reset-password", w: "**Create a branch and move onto it.** The modern command, and the one to use.", hi: true },
     { c: "git switch main", w: "**Move to an existing branch.**" },
     { c: "git switch -", w: "**Back to the previous branch**, exactly like `cd -`. Genuinely useful." },
     { c: "", w: "" },
     { c: "git checkout -b feature/reset-password", w: "**The older equivalent**, still everywhere in documentation and in your colleagues' fingers. `checkout` does a dozen unrelated things, which is why `switch` and `restore` were split out of it in 2019." },
     { c: "", w: "" },
     { c: "git branch -d feature/reset-password", w: "**Delete a merged branch.** Refuses if it holds unmerged commits, which is a feature." },
     { c: "git branch -D feature/reset-password", w: "**Force delete.** The commits survive in the reflog." },
     { c: "git branch -m old-name new-name", w: "Rename." }
    ] } },

  { h: "What switching does to your files" },
  { p: "Switching branches **rewrites the files in your working directory** to match that branch's tip commit. Files that differ change; files that do not are untouched." },
  { term: { title: "Terminal",
    lines: [
     { c: "git switch feature/reset-password", w: "" },
     { out: "Switched to branch 'feature/reset-password'" },
     { c: "ls", w: "**`reset.py` appears**, because it exists on this branch and not on main." },
     { c: "git switch main", w: "" },
     { c: "ls", w: "**And it is gone again.** The file is not deleted — it is safely inside the commits on the other branch. This is the single most disconcerting thing about branches on first encounter." }
    ] } },
  { trap: "Git refuses to switch when uncommitted changes would be overwritten, and it is protecting you. The two honest fixes are to commit the work (on the branch it belongs to) or to `git stash` it. There is a third — carrying changes across with `git switch -m` — but the first two are almost always what you meant." },

  { h: "Naming branches" },
  { l: [
   "**`feature/reset-password`** — a new capability. The slash prefix groups them in every UI.",
   "**`fix/login-timeout`** — a bug fix.",
   "**`chore/upgrade-deps`** — maintenance with no user-visible change.",
   "**`aryan/experiment`** — personal scratch work, clearly marked as such.",
   "Avoid `test`, `new`, `temp`, `branch2`. In two weeks nobody, including you, will know what they were."
  ] },
  { n: "Many teams put the issue number in: `fix/142-login-timeout`. It costs nothing and makes the link between the branch, the ticket and the pull request obvious in every tool. Follow whatever convention your team already has — consistency beats any particular scheme.",
    nt: "Include the ticket number" },

  { h: "Detached HEAD" },
  { p: "Checking out a *commit* rather than a branch puts HEAD directly on that commit with no branch attached. Git prints a paragraph of warning and everyone panics; it is harmless once you know what it means." },
  { term: { title: "Terminal",
    lines: [
     { c: "git switch --detach 9f8e7d6", w: "**Deliberately visiting an old commit** to see what the code looked like." },
     { out: "You are in 'detached HEAD' state. You can look around, make experimental\nchanges and commit them, and you can discard any commits you make in this\nstate without impacting any branches by switching back to a branch." },
     { c: "", w: "" },
     { c: "git switch main", w: "**The way out: just switch back to a branch.** Nothing was harmed." },
     { c: "", w: "" },
     { c: "git switch -c experiment", w: "**Or, if you committed something here and want to keep it**, make a branch at this point. Without this, those commits become unreferenced when you leave — recoverable via reflog, but easy to forget.", hi: true }
    ] } },
  { ana: "Normally you are holding a bookmark and every page you write gets the bookmark moved onto it. In detached HEAD you are standing on a page holding no bookmark. You can still write new pages, but nothing marks where they are, so when you walk away they are hard to find again. Making a branch is clipping on a bookmark before you leave.",
    at: "Standing on a page with no bookmark" },

  { h: "Why cheap branching changed practice" },
  { p: "When a branch costs nothing, you branch for everything: every feature, every bug fix, every experiment. That habit produces a series of consequences that add up to how modern software is developed." },
  { l: [
   "**`main` always works**, because unfinished work lives elsewhere.",
   "**Experiments are free.** Try the risky rewrite; if it fails, delete the branch and nothing was risked.",
   "**Review happens before merge**, because there is a natural unit — the branch — to review.",
   "**Several people work in parallel** without waiting for each other."
  ] },

  { tryit: { t: "Feel the pointers move",
    task: "In a scratch repository: make two commits on `main`, branch to `feature`, make two commits there, then switch back to `main` and confirm the feature files vanish. Look at `.git/refs/heads/` at each step and watch the hashes change.",
    hint: "`cat .git/refs/heads/*` after each commit, and `git log --oneline --graph --all` to see the shape.",
    sol: { lang: "bash", code: "mkdir demo && cd demo && git init\necho \"one\" > a.txt && git add . && git commit -m \"Add a\"\necho \"two\" > b.txt && git add . && git commit -m \"Add b\"\n\ngit switch -c feature\necho \"feature\" > f.txt && git add . && git commit -m \"Add f\"\n\nls                      # a.txt b.txt f.txt\ncat .git/refs/heads/main\ncat .git/refs/heads/feature   # different hash\n\ngit switch main\nls                      # f.txt is gone\ngit log --oneline --graph --all" },
    w: "Watch the two hash files. `main` never moved while you were committing on `feature` — the commits were written and only the feature bookmark advanced. That is genuinely all a branch is, and seeing it once removes most of the mystery." } }
 ],
 k: [
  "A branch is a small file holding one commit hash — creating one copies nothing and is instant.",
  "`HEAD` points at a branch; committing writes a commit and moves that branch forward.",
  "`git switch -c name` creates and moves; switching rewrites your working files to match that branch.",
  "Detached HEAD just means HEAD is on a commit with no branch — switch back, or `switch -c` to keep the work."
 ],
 r: ["Branch", "Git", "Commit", "Repository", "Feature Flag"],
 drill: {
  lang: "bash",
  reps: 3,
  items: [
   { c: "git branch -v", w: "list local branches with their latest commit" },
   { c: "git switch -c feature/reset-password", w: "create a branch and move onto it" },
   { c: "git switch main", w: "move back to the main branch" },
   { c: "git switch -", w: "jump back to the branch you were on before" },
   { c: "git branch -d feature/reset-password", w: "delete a branch that has been merged" }
  ]
 }
},

{
 t: "Merging, and Resolving a Conflict",
 m: "branch",
 lvl: "intermediate",
 s: "Bringing two lines of work together, including the part everybody dreads.",
 goal: [
  "Explain fast-forward and three-way merges",
  "Resolve a conflict calmly, start to finish",
  "Say when to merge and when to rebase"
 ],
 b: [
  { p: "A branch is only useful if the work comes back. Merging is that, and conflicts — the reason people fear it — turn out to be a short, mechanical procedure once you have done one." },

  { h: "Fast-forward" },
  { p: "When the target branch has not moved since you branched, there is nothing to combine. Git simply slides the pointer forward." },
  { code: { lang: "text",
    lines: [
     { c: "  A --- B   <- main", w: "" },
     { c: "         \\", w: "" },
     { c: "          C --- D   <- feature", w: "**`main` has not moved.** Everything in main is already an ancestor of D." },
     { c: "", w: "" },
     { c: "  git switch main && git merge feature", w: "" },
     { c: "", w: "" },
     { c: "  A --- B --- C --- D   <- main, feature", w: "**Main just moves to D.** No merge commit, perfectly linear history.", hi: true }
    ] } },
  { code: { lang: "bash",
    lines: [
     { c: "git merge feature", w: "Fast-forwards when it can." },
     { c: "git merge --no-ff feature", w: "**Force a merge commit even when a fast-forward is possible.** Many teams require this, because the merge commit records that these commits were one unit of work — which a linear history loses." }
    ] } },

  { h: "Three-way merge" },
  { p: "When both branches have moved, Git compares three commits: the two tips and their **common ancestor**." },
  { code: { lang: "text",
    lines: [
     { c: "  A --- B --- E --- F   <- main", w: "Main moved on while you worked." },
     { c: "         \\", w: "" },
     { c: "          C --- D   <- feature", w: "" },
     { c: "", w: "" },
     { c: "  git switch main && git merge feature", w: "" },
     { c: "", w: "" },
     { c: "  A --- B --- E --- F --- M   <- main", w: "" },
     { c: "         \\             /", w: "" },
     { c: "          C --- D ----'", w: "**M is a merge commit with two parents.** It is what records that two lines of development came together here." }
    ] } },
  { p: "Git works out what changed from B to F, and what changed from B to D, and applies both. When those two sets of changes touch different lines — which is the overwhelming majority of the time — it does this silently and correctly." },
  { n: "Merges succeed automatically far more often than the fear suggests. A conflict happens only when both sides changed **the same lines of the same file**. Different files, or different parts of the same file, merge without you noticing.",
    nt: "Most merges are silent" },

  { h: "A conflict, start to finish" },
  { term: { title: "Terminal",
    lines: [
     { c: "git merge feature", w: "" },
     { out: "Auto-merging config.py\nCONFLICT (content): Merge conflict in config.py\nAutomatic merge failed; fix conflicts and then commit the result." },
     { c: "git status", w: "**Read this. It names the files and the next command**, as always." },
     { out: "You have unmerged paths.\n  (fix conflicts and run \"git commit\")\n\nUnmerged paths:\n        both modified:   config.py" }
    ] } },
  { p: "Git has stopped mid-merge and written both versions into the file, marked up." },
  { code: { lang: "text", file: "config.py", t: "What a conflict looks like in the file",
    lines: [
     { c: "TIMEOUT = 30", w: "Unchanged, above the conflict." },
     { c: "", w: "" },
     { c: "<<<<<<< HEAD", w: "**Everything below this, until `=======`, is the version on the branch you are merging *into*** — main, here.", hi: true },
     { c: "MAX_RETRIES = 3", w: "" },
     { c: "BACKOFF = 1.5", w: "" },
     { c: "=======", w: "**The divider.**" },
     { c: "MAX_RETRIES = 5", w: "**Everything below this, until `>>>>>>>`, is the version from the branch being merged in.**" },
     { c: "BACKOFF = 2.0", w: "" },
     { c: ">>>>>>> feature", w: "**The end, labelled with where it came from.**" },
     { c: "", w: "" },
     { c: "LOG_LEVEL = \"info\"", w: "Unchanged, below." }
    ] } },
  { ol: [
   "**Open the file and decide what the code should actually be.** Not which side wins — what is correct. Often it is a combination, and occasionally it is neither.",
   "**Delete all three marker lines** — `<<<<<<<`, `=======` and `>>>>>>>`. Every one of them.",
   "**Save, and check the file makes sense.** Run it, or run the tests.",
   "**`git add config.py`** — staging a conflicted file is how you tell Git it is resolved.",
   "**`git commit`** — with no `-m`; Git has a merge message ready."
  ] },
  { code: { lang: "python", file: "config.py", t: "Resolved — a genuine decision, not a coin toss",
    lines: [
     { c: "TIMEOUT = 30", w: "" },
     { c: "", w: "" },
     { c: "MAX_RETRIES = 5", w: "**Took the feature branch's value** — it was raised deliberately for the flaky endpoint." },
     { c: "BACKOFF = 1.5", w: "**Kept main's value** — the increase to 2.0 was incidental and pushes the worst case over the timeout. Both sides examined on their own merits." },
     { c: "", w: "" },
     { c: "LOG_LEVEL = \"info\"", w: "" }
    ] } },
  { trap: "The genuine danger in a conflict is not choosing wrong — it is leaving a marker behind. A stray `<<<<<<< HEAD` is a syntax error in every language, and if it lands in a file nobody runs immediately, it can reach production. Search the whole project for `<<<<<<<` before committing a merge; most editors and linters will also flag it." },

  { h: "Tools that help" },
  { code: { lang: "bash",
    lines: [
     { c: "git merge --abort", w: "**Stop the merge and return to exactly where you were.** Always available while a merge is in progress, and worth knowing before you start.", hi: true },
     { c: "", w: "" },
     { c: "git checkout --ours config.py", w: "**Take your branch's version wholesale.** Only right when the other side's change is genuinely irrelevant." },
     { c: "git checkout --theirs config.py", w: "The incoming version wholesale." },
     { c: "", w: "" },
     { c: "git diff", w: "**During a conflict, this shows a combined diff** of both sides against the ancestor." },
     { c: "git mergetool", w: "Opens a configured three-way visual editor. VS Code's built-in merge editor is genuinely good and is what most people use now." },
     { c: "", w: "" },
     { c: "git config --global merge.conflictstyle zdiff3", w: "**Adds the original ancestor version between the two sides.** Seeing what the line was *before* either change usually makes the right resolution obvious. Strongly worth turning on." }
    ] } },

  { h: "Merge or rebase" },
  { p: "The other way to combine branches. `rebase` replays your commits on top of the target, producing a straight line instead of a merge commit." },
  { code: { lang: "text",
    lines: [
     { c: "  A --- B --- E --- F   <- main", w: "" },
     { c: "         \\", w: "" },
     { c: "          C --- D   <- feature", w: "" },
     { c: "", w: "" },
     { c: "  git switch feature && git rebase main", w: "" },
     { c: "", w: "" },
     { c: "  A --- B --- E --- F   <- main", w: "" },
     { c: "                     \\", w: "" },
     { c: "                      C' --- D'   <- feature", w: "**C and D are re-created on top of F.** New commits, new hashes — the originals are abandoned. That is the crucial detail.", hi: true }
    ] } },
  { tbl: { h: ["", "merge", "rebase"],
    rows: [
     ["History", "Shows what really happened, branches and all", "Clean straight line"],
     ["Commits", "Preserved exactly", "**Rewritten** — new hashes"],
     ["Safe on shared branches", "**Yes**", "**No** — rewriting shared commits breaks everyone else"],
     ["Conflicts", "Once, at the end", "Potentially once per commit being replayed"],
     ["Best for", "Merging a finished feature into main", "Tidying **your own** branch before opening a pull request"]
    ] } },
  { n: "The practical rule, and the one most teams settle on: **rebase your own unpushed branch to keep it tidy; merge to bring finished work into a shared branch.** The absolute version — never rebase anything you have pushed and others may have pulled — is the part that is not negotiable.",
    nt: "The rule teams converge on" },
  { code: { lang: "bash",
    lines: [
     { c: "git switch feature && git rebase main", w: "**Bring your branch up to date with main** before opening a pull request, so the reviewer sees only your changes." },
     { c: "git rebase --continue", w: "After resolving a conflict during a rebase." },
     { c: "git rebase --abort", w: "**Back out entirely.** As with merge, know this before you start." },
     { c: "git rebase -i HEAD~4", w: "**Interactive: reorder, squash, reword or drop your last four commits.** How a messy local branch becomes three clean commits before anyone sees it." }
    ] } },

  { h: "Avoiding conflicts in the first place" },
  { l: [
   "**Keep branches short.** A branch alive for a day rarely conflicts; one alive for three weeks reliably does.",
   "**Pull from main often.** `git merge main` into your branch regularly means small conflicts as you go, rather than one enormous one at the end.",
   "**Small, focused commits.** A conflict in a ten-line commit is obvious; in a four-hundred-line commit it is archaeology.",
   "**Talk to your team.** Two people rewriting the same module is a coordination problem, and Git can only report it, not prevent it."
  ] },

  { tryit: { t: "Cause a conflict and resolve it",
    task: "Deliberately create one. Two branches, both editing the same line of the same file differently. Merge, resolve, commit. Then do it again and use `git merge --abort` instead, confirming you land back exactly where you started.",
    hint: "Turn on `zdiff3` first — seeing the original line between the two versions makes the resolution far clearer.",
    sol: { lang: "bash", code: "git config --global merge.conflictstyle zdiff3\n\nmkdir conflict-demo && cd conflict-demo && git init\necho \"MAX_RETRIES = 3\" > config.py\ngit add . && git commit -m \"Add config\"\n\ngit switch -c feature\necho \"MAX_RETRIES = 5\" > config.py\ngit commit -am \"Raise retries for flaky endpoint\"\n\ngit switch main\necho \"MAX_RETRIES = 10\" > config.py\ngit commit -am \"Raise retries after the outage\"\n\ngit merge feature          # CONFLICT\ncat config.py              # look at the markers\n# ...edit, remove all markers...\ngit add config.py\ngit commit\n\ngit log --oneline --graph --all" },
    w: "Doing this deliberately, once, on a repository you do not care about, is what removes the fear. A conflict is Git saying *two people changed this line and I will not guess which is right* — which is exactly the correct behaviour, and the only sane one." } }
 ],
 k: [
  "A fast-forward just moves the pointer; a three-way merge compares both tips against their common ancestor.",
  "A conflict means both sides changed the same lines — edit the file, delete all three markers, `add`, `commit`.",
  "`git merge --abort` and `git rebase --abort` return you to where you started; know them before you start.",
  "Rebase your own unpushed branch to tidy it; merge to bring work into shared branches. Never rebase shared history."
 ],
 r: ["Merge", "Merge Conflict", "Branch", "Rebase", "Git"],
 drill: {
  lang: "bash",
  reps: 4,
  items: [
   { c: "git merge feature", w: "bring another branch's work into this one" },
   { c: "git merge --no-ff feature", w: "merge but always record a merge commit" },
   { c: "git merge --abort", w: "stop a conflicted merge and return to where you were" },
   { c: "git rebase main", w: "replay your branch's commits on top of the latest main" },
   { c: "git rebase -i HEAD~4", w: "reorder, squash or reword your last four commits" },
   { c: "git config --global merge.conflictstyle zdiff3", w: "show the original version between the two conflicting sides" }
  ]
 }
}

]);
