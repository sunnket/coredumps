/* Git — history and undo. */
TD.addLessons("git", [

{
 t: "Reading the Past: log and blame",
 m: "history",
 lvl: "core",
 s: "Finding the commit that matters, out of ten thousand.",
 goal: [
  "Shape `git log` output into something readable",
  "Search history by message, by content and by file",
  "Use `blame` to find why a line exists"
 ],
 b: [
  { p: "A history you cannot search is a history you do not have. These commands turn the pile of commits into an answer, and they are how you resolve *why on earth is this line here* without asking anyone." },

  { h: "log, made readable" },
  { p: "Plain `git log` is verbose — five lines per commit, and a page of scrolling for a week's work. Nobody uses it undecorated." },
  { term: { title: "Terminal",
    lines: [
     { c: "git log --oneline", w: "**One line per commit: short hash and summary.** This is the everyday form." },
     { out: "7c4f21a Add password reset endpoint\n9f8e7d6 Fix session timeout on reset\n4c5b6a1 Add rate limiting to login\n2a1b3c9 Initial commit" },
     { c: "git log --oneline --graph --all", w: "**Draws the branch structure as ASCII art.** Once branches exist this is how you see the shape of the project." },
     { c: "git log --oneline -10", w: "The last ten only." },
     { c: "git log --stat", w: "Each commit with the files it touched." }
    ] } },
  { code: { lang: "bash", t: "Worth setting up once",
    lines: [
     { c: "git config --global alias.lg \"log --oneline --graph --decorate --all\"", w: "**An alias.** Now `git lg` gives you the good view everywhere, forever. Almost every experienced user has some version of this.", hi: true },
     { c: "git config --global alias.st \"status -sb\"", w: "`git st` for a compact status." },
     { c: "git config --global alias.last \"log -1 HEAD --stat\"", w: "`git last` — what did I just commit." }
    ] } },

  { h: "Searching history" },
  { code: { lang: "bash",
    lines: [
     { c: "git log --oneline --grep=\"login\"", w: "**Commits whose *message* mentions login.**" },
     { c: "git log --oneline -S\"make_token\"", w: "**Commits that added or removed that *string in the code*.** Called the pickaxe, and it is the fastest way to find where a function was introduced or deleted.", hi: true },
     { c: "git log --oneline -G\"def login\"", w: "The same idea with a regular expression." },
     { c: "", w: "" },
     { c: "git log --oneline -- auth.py", w: "**Only commits that touched this file.** The `--` is what separates paths from other arguments." },
     { c: "git log --oneline --author=\"priya\"", w: "By author." },
     { c: "git log --oneline --since=\"2 weeks ago\"", w: "By date. `--until` too, and both accept human phrasing." },
     { c: "", w: "" },
     { c: "git log --oneline --since=\"1 month ago\" --author=\"priya\" -- src/", w: "**They combine.** *What did Priya change under src in the last month.*" }
    ] } },
  { n: "`-S` is the one worth remembering specifically. When you find a mysterious function and want to know who added it and why, searching the *content* of every diff in history finds the introducing commit in one command — and that commit's message is usually the explanation you wanted.",
    nt: "The pickaxe is the underused one" },

  { h: "blame — who wrote this line, and when" },
  { term: { title: "Terminal",
    lines: [
     { c: "git blame auth.py", w: "**Every line, annotated with the commit that last changed it**, its author and its date." },
     { out: "9f8e7d6 (Priya  2026-03-02 14:22) def login(user, password):\n9f8e7d6 (Priya  2026-03-02 14:22)     if not user:\n7c4f21a (Aryan  2026-08-19 09:41)     if user.is_locked:\n7c4f21a (Aryan  2026-08-19 09:41)         raise AccountLocked(user.id)" },
     { c: "git blame -L 40,60 auth.py", w: "**Only lines 40 to 60.** Essential on a long file." },
     { c: "git blame -w auth.py", w: "**Ignore whitespace changes**, so a reformatting commit does not claim authorship of every line." },
     { c: "git show 7c4f21a", w: "**The natural follow-up.** Blame gives you the hash; `show` gives you the message and the surrounding change — which is the actual answer." }
    ] } },
  { n: "The name is unfortunate. The purpose is almost never to assign fault — it is to find the context. *Why does this check exist* is answered by the commit message and the pull request behind it, and blame is just the fastest route to the hash. Some tools now call it `annotate` for this reason.",
    nt: "It is not really about blame" },
  { trap: "Blame shows the commit that *last touched* a line, which is not always the commit that put it there. A reformat, a rename or a bulk find-and-replace makes everyone the author of everything. `-w` helps; `git log -S` on the line's content is the reliable way to find the true origin." },

  { h: "Naming a commit" },
  { p: "Every command that takes a commit accepts several ways of naming one." },
  { tbl: { h: ["Reference", "Means"],
    rows: [
     ["`7c4f21a`", "That specific commit. **Seven characters is enough** — Git resolves any unambiguous prefix"],
     ["`HEAD`", "Where you are right now — usually the tip of the current branch"],
     ["`HEAD~1`", "One commit back. `HEAD~3` is three back"],
     ["`HEAD^`", "The parent. Same as `HEAD~1`, except on merges where `^2` is the second parent"],
     ["`main`", "The tip of the `main` branch"],
     ["`main@{yesterday}`", "Where `main` pointed yesterday"],
     ["`v1.2.0`", "A tag — a permanent human-readable name for a commit"]
    ] } },

  { h: "bisect — finding the commit that broke it" },
  { p: "Something works in a release from a month ago and is broken now, with three hundred commits in between. `git bisect` finds the culprit by binary search — about eight steps rather than three hundred." },
  { term: { title: "Terminal",
    lines: [
     { c: "git bisect start", w: "" },
     { c: "git bisect bad", w: "**The current commit is broken.**" },
     { c: "git bisect good v1.2.0", w: "**This older commit was fine.** Git now checks out a commit halfway between them." },
     { out: "Bisecting: 152 revisions left to test after this (roughly 8 steps)" },
     { c: "# test it, then say which it was", w: "" },
     { c: "git bisect good", w: "**Or `git bisect bad`.** Git halves the range again and checks out the next candidate." },
     { out: "9f8e7d6 is the first bad commit\n    Cache country lookups for 24 hours" },
     { c: "git bisect reset", w: "**Always finish with this** — it returns you to where you started." }
    ] } },
  { code: { lang: "bash", t: "Automated, when you have a test",
    lines: [
     { c: "git bisect start HEAD v1.2.0", w: "Bad and good in one line." },
     { c: "git bisect run pytest tests/test_login.py", w: "**Git runs the command at each step** and reads its exit code — zero is good, non-zero is bad. Walks away and comes back with the answer.", hi: true }
    ],
    after: "This is where small, single-purpose commits pay off spectacularly. Bisect hands you a commit; if that commit changed one thing you have your answer immediately, and if it changed forty files you have merely narrowed it down." } },

  { tryit: { t: "Investigate a real codebase",
    task: "Clone a project you use. Pick a file, find the commit that introduced a specific function using the pickaxe, read its message, then use `blame` to see which lines of that function have been changed since and by whom.",
    hint: "`git log -S\"def function_name\" --oneline -- path/to/file.py`, then `git show` the oldest result.",
    sol: { lang: "bash", code: "git clone https://github.com/psf/requests.git && cd requests\n\n# when was this function introduced, and why?\ngit log --oneline -S\"def get_encoding_from_headers\" -- requests/utils.py\ngit show <the oldest hash from that list>\n\n# what has happened to it since?\ngit blame -w -L '/def get_encoding_from_headers/,+15' requests/utils.py" },
    w: "The `-L '/pattern/,+15'` form is worth stealing: it blames fifteen lines starting from wherever a pattern matches, so you do not have to look up line numbers first. On a file that changes often, that saves the annoyance of your line numbers being out of date." } }
 ],
 k: [
  "`git log --oneline --graph --all` is the everyday view; set it as an alias and stop typing it.",
  "`-S\"text\"` searches the content of every diff — the fastest way to find where something was introduced.",
  "`git blame` finds the commit that last touched a line; `git show` on that hash gives the actual reason.",
  "`git bisect run <test>` binary-searches history for the commit that broke something."
 ],
 r: ["Git", "Commit", "Diff", "Debugging", "Regression"],
 drill: {
  lang: "bash",
  reps: 3,
  items: [
   { c: "git log --oneline --graph --all", w: "see the whole history and branch shape compactly" },
   { c: "git log --oneline -S\"make_token\"", w: "find the commits that added or removed a piece of code" },
   { c: "git log --oneline -- auth.py", w: "see only the commits that touched one file" },
   { c: "git blame -w auth.py", w: "annotate every line with the commit that last changed it" },
   { c: "git bisect run pytest tests/test_login.py", w: "let Git binary-search for the commit that broke a test" }
  ]
 }
},

{
 t: "Undoing Anything",
 m: "history",
 lvl: "intermediate",
 s: "One page you will come back to. Every category of mistake, and the way out of each.",
 goal: [
  "Choose the right undo for the situation you are actually in",
  "Explain the difference between `reset`, `revert` and `restore`",
  "Recover a commit you believe you destroyed"
 ],
 b: [
  { p: "The fear people have of Git is almost entirely fear of losing work. This lesson removes it, and the honest summary is: **if it was ever committed, you can almost certainly get it back.**" },

  { h: "The question that picks the command" },
  { p: "Ask one thing first: **has it been pushed?**" },
  { tbl: { h: ["Situation", "Command", "Safe?"],
    rows: [
     ["Changed a file, want the old version back", "`git restore <file>`", "**Destroys the edit permanently** — Git never had it"],
     ["Staged something by accident", "`git restore --staged <file>`", "Completely safe; the edit stays"],
     ["Bad message on the last commit", "`git commit --amend`", "Safe **if not pushed**"],
     ["Forgot a file in the last commit", "`git add <f>` then `git commit --amend --no-edit`", "Safe if not pushed"],
     ["Want the last commit undone, keeping the changes", "`git reset --soft HEAD~1`", "Safe if not pushed"],
     ["Want the last commit gone entirely", "`git reset --hard HEAD~1`", "**Destroys the changes.** Recoverable via reflog"],
     ["Undo a commit that others already have", "`git revert <hash>`", "**Always safe.** The correct tool for shared history"],
     ["Deleted a branch you needed", "`git reflog` then `git checkout -b <name> <hash>`", "Recoverable for ~90 days"]
    ] } },

  { h: "reset — moving the branch pointer" },
  { p: "`reset` moves the current branch to point at a different commit. What it does with your files depends entirely on the flag, and those three flags are the whole command." },
  { code: { lang: "text", t: "Before: main is at C",
    lines: [
     { c: "A --- B --- C   <- main, HEAD", w: "" },
     { c: "", w: "" },
     { c: "git reset --soft B", w: "" },
     { c: "A --- B   <- main, HEAD          C's changes: STAGED", w: "**The commit is gone, the work is in the box, ready to re-commit.** Use this to redo the last commit differently — split it, reword it, add to it." },
     { c: "", w: "" },
     { c: "git reset --mixed B   (the default)", w: "" },
     { c: "A --- B   <- main, HEAD          C's changes: in your files, unstaged", w: "**The commit is gone, the work is in your working directory.** The default, and the usual choice." },
     { c: "", w: "" },
     { c: "git reset --hard B", w: "" },
     { c: "A --- B   <- main, HEAD          C's changes: GONE", w: "**Commit and work both discarded.** Your files are exactly as they were at B.", hi: true }
    ] } },
  { code: { lang: "bash", t: "In practice",
    lines: [
     { c: "git reset --soft HEAD~1", w: "**Undo the last commit but keep everything staged.** The most useful of the three — for when the commit was right but the message or the scope was not." },
     { c: "git reset HEAD~1", w: "Same, but unstaged. `--mixed` is the default so it is rarely typed." },
     { c: "git reset --hard HEAD~1", w: "**Delete the last commit and its changes.** Correct when the commit was genuinely a mistake." },
     { c: "git reset --hard origin/main", w: "**Throw away everything local and match the remote exactly.** The nuclear option, and occasionally exactly right." }
    ] } },
  { trap: "`git reset --hard` is the one command in Git that can genuinely lose work, and only in one specific way: **uncommitted changes are unrecoverable**, because Git never stored them. Committed work reset away is still findable in the reflog. The habit that makes this safe is `git stash` before any `--hard` — thirty seconds of insurance." },

  { h: "revert — the safe undo" },
  { p: "`revert` does not remove anything. It creates a **new commit** that applies the inverse of an old one. The history grows rather than changing, which is why it is the only correct undo for anything already shared." },
  { code: { lang: "text",
    lines: [
     { c: "A --- B --- C --- D   <- main", w: "C introduced a bug and is already pushed." },
     { c: "", w: "" },
     { c: "git revert C", w: "" },
     { c: "", w: "" },
     { c: "A --- B --- C --- D --- C'  <- main", w: "**C is still there. C' undoes it.** Everyone who already pulled C simply receives C' next time and ends up in the same state as you — no rewritten history, no conflicts, no messages on the team chat.", hi: true }
    ] } },
  { code: { lang: "bash",
    lines: [
     { c: "git revert 7c4f21a", w: "Creates the inverse commit and opens an editor for its message." },
     { c: "git revert --no-edit 7c4f21a", w: "Accept the generated message." },
     { c: "git revert -n 7c4f21a", w: "**Stage the inverse without committing**, so you can revert several commits into one." },
     { c: "git revert HEAD~3..HEAD", w: "Revert a range." },
     { c: "git revert -m 1 <merge-hash>", w: "**Reverting a merge needs `-m 1`** to say which parent is the mainline. Git cannot guess." }
    ] } },
  { n: "The rule that keeps teams sane: **`reset` for history only you have, `revert` for history anyone else has.** Resetting a pushed branch and force-pushing rewrites commits under other people's feet, and the recovery is manual and irritating for everyone but you.",
    nt: "The rule that matters" },

  { h: "reflog — the safety net" },
  { p: "Git records every place `HEAD` has pointed, for around ninety days, including positions no branch references any more. This is why *I deleted it* is nearly always wrong." },
  { term: { title: "Terminal", t: "Recovering a commit destroyed by a hard reset",
    lines: [
     { c: "git reset --hard HEAD~3", w: "Three commits of work, apparently gone." },
     { c: "git log --oneline", w: "They are not in the log. This is the moment people panic." },
     { c: "", w: "" },
     { c: "git reflog", w: "**The list of everywhere HEAD has been.**", hi: true },
     { out: "a1b2c3d HEAD@{0}: reset: moving to HEAD~3\n7c4f21a HEAD@{1}: commit: Add password reset endpoint\n9f8e7d6 HEAD@{2}: commit: Fix session timeout\n4c5b6a1 HEAD@{3}: commit: Add rate limiting" },
     { c: "git reset --hard 7c4f21a", w: "**Back exactly where you were.** The commits were never deleted — only unreferenced." },
     { c: "git branch rescue 7c4f21a", w: "Or, more cautiously, put a branch on them and look before moving." }
    ] } },
  { n: "Unreferenced commits are eventually cleaned up by garbage collection, typically after 90 days. In practice this means: if you notice within a few weeks, it is recoverable. `git reflog` is the first thing to try whenever something appears to be gone, and it is the reason experienced users are so relaxed about commands that look destructive.",
    nt: "Why nothing is really gone" },

  { h: "stash — parking work" },
  { p: "Not undo exactly, but the same family: get your changes out of the way without committing them." },
  { code: { lang: "bash",
    lines: [
     { c: "git stash", w: "**Takes all uncommitted changes and puts them aside.** Your working directory returns to the last commit, clean." },
     { c: "git stash push -m \"half-done reset form\"", w: "**With a message**, which matters the moment you have more than one." },
     { c: "git stash -u", w: "**Include untracked files.** Plain `stash` leaves new files behind, which surprises people." },
     { c: "", w: "" },
     { c: "git stash list", w: "" },
     { c: "git stash pop", w: "**Reapply the most recent and remove it from the list.** The usual one." },
     { c: "git stash apply stash@{2}", w: "Reapply a specific one and keep it stashed." },
     { c: "git stash drop", w: "Discard one." }
    ],
    after: "The classic use: you are mid-change when an urgent bug comes in. `git stash`, fix the bug on a clean tree, commit, `git stash pop`, carry on." } },
  { trap: "Stashes are easy to forget. They do not appear in `git status`, they are not pushed anywhere, and a stash from three weeks ago will apply into a codebase that has moved on, producing conflicts that make no sense. Treat the stash as a place to park work for hours, not weeks — if it needs to survive longer, commit it on a branch." },

  { h: "The recovery flowchart" },
  { code: { lang: "text", t: "Something went wrong. Work down this.",
    lines: [
     { c: "Is the work committed?", w: "" },
     { c: "  NO  -> uncommitted changes are the only truly losable thing.", w: "" },
     { c: "         git stash saves them; git restore destroys them.", w: "" },
     { c: "  YES -> it is recoverable. Continue.", w: "" },
     { c: "", w: "" },
     { c: "Is the bad commit pushed?", w: "" },
     { c: "  NO  -> git reset (soft/mixed/hard) or git commit --amend.", w: "" },
     { c: "  YES -> git revert. Do not rewrite shared history.", w: "**This branch of the tree is the one people get wrong.**", hi: true },
     { c: "", w: "" },
     { c: "Cannot find the commit at all?", w: "" },
     { c: "  -> git reflog, find the hash, git reset --hard <hash>", w: "" }
    ] } },

  { tryit: { t: "Break it and fix it, deliberately",
    task: "In a scratch repository with four or five commits: (1) commit something with a wrong message and fix it; (2) hard-reset away two commits and recover them with the reflog; (3) revert a middle commit and confirm the history still shows the original.",
    hint: "Do this on a throwaway repository, not real work. The point is to feel the recovery before you need it.",
    sol: { lang: "bash", code: "# 1 — wrong message\ngit commit -m \"asdf\"\ngit commit --amend -m \"Add retry helper for flaky API calls\"\n\n# 2 — destroy and recover\ngit log --oneline          # note the top hash\ngit reset --hard HEAD~2\ngit log --oneline          # two commits gone\ngit reflog                 # they are all still listed\ngit reset --hard 7c4f21a   # back to where you were\n\n# 3 — safe undo of a middle commit\ngit revert --no-edit 9f8e7d6\ngit log --oneline          # 9f8e7d6 is still there, plus the new revert" },
    w: "Doing this once, on purpose, on a repository you do not care about, is worth more than any amount of reading. The panic that makes people do something worse comes from never having seen the recovery work — and it takes ten minutes to never feel it again." } }
 ],
 k: [
  "Only **uncommitted** changes can be truly lost — `git restore` and `reset --hard` destroy them; everything committed is recoverable.",
  "`reset` moves the branch pointer: `--soft` keeps changes staged, `--mixed` unstaged, `--hard` discards them.",
  "`revert` adds an inverse commit and is the only correct undo for anything already pushed.",
  "`git reflog` lists every position HEAD has held for ~90 days — the first thing to try when something looks gone."
 ],
 r: ["Git", "Commit", "Rollback", "Backup", "Version Control"],
 drill: {
  lang: "bash",
  reps: 4,
  items: [
   { c: "git reset --soft HEAD~1", w: "undo the last commit but keep its changes staged" },
   { c: "git reset --hard HEAD~1", w: "delete the last commit and its changes", hint: "the destructive one" },
   { c: "git revert 7c4f21a", w: "undo a pushed commit by adding its inverse" },
   { c: "git reflog", w: "list every position HEAD has held, including unreferenced ones" },
   { c: "git stash push -m \"half-done reset form\"", w: "park uncommitted work with a label" },
   { c: "git stash pop", w: "bring the parked work back and remove it from the list" }
  ]
 }
}

]);
