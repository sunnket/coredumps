/* Git — GitHub and other people. */
TD.addLessons("git", [

{
 t: "Remotes, push and pull",
 m: "github",
 lvl: "core",
 s: "Getting your commits off your laptop, and other people's onto it.",
 goal: [
  "Connect a local repository to a remote and push to it",
  "Explain what a remote-tracking branch is",
  "Choose between pull, fetch and pull --rebase deliberately"
 ],
 b: [
  { p: "Everything so far has happened on your own machine. A **remote** is another copy of the repository somewhere else — usually on GitHub — and the commands in this lesson move commits between the two." },

  { h: "Authenticating first" },
  { p: "GitHub stopped accepting passwords over HTTPS in 2021. There are two working options and it is worth doing this once, properly." },
  { tbl: { h: ["", "SSH key", "Personal access token"],
    rows: [
     ["Setup", "Generate a key, paste the public half into GitHub", "Generate a token in GitHub settings, use it as your password"],
     ["Feels like", "Nothing — it just works after setup", "A password you paste occasionally"],
     ["URL form", "`git@github.com:user/repo.git`", "`https://github.com/user/repo.git`"],
     ["Best for", "**Your own machine.** Set it up once and forget it", "Machines you do not control, CI, short-lived access"]
    ] } },
  { term: { title: "Terminal", t: "SSH setup, once per machine",
    lines: [
     { c: "ssh-keygen -t ed25519 -C \"you@example.com\"", w: "**Generates a key pair.** Press Enter to accept the default location; set a passphrase if you want one." },
     { c: "cat ~/.ssh/id_ed25519.pub", w: "**The *public* half.** Copy this into GitHub under Settings → SSH and GPG keys." },
     { c: "ssh -T git@github.com", w: "**Test it.**" },
     { out: "Hi aryan! You've successfully authenticated, but GitHub does not provide shell access." }
    ] } },
  { trap: "Never share or commit the file **without** `.pub` — `id_ed25519` is your private key, and anyone holding it can act as you. This is exactly the kind of thing `.gitignore` and a moment's care are for. The `.pub` file is designed to be handed out; the other one never leaves your machine." },

  { h: "Connecting a repository" },
  { term: { title: "Terminal",
    lines: [
     { c: "git remote add origin git@github.com:aryan/price-tracker.git", w: "**`origin` is just a name** — the conventional one for *the place I cloned from*. Nothing about it is special; you can have several remotes with any names." },
     { c: "git remote -v", w: "**List remotes.** Two lines per remote: one for fetching, one for pushing." },
     { out: "origin  git@github.com:aryan/price-tracker.git (fetch)\norigin  git@github.com:aryan/price-tracker.git (push)" },
     { c: "", w: "" },
     { c: "git push -u origin main", w: "**The first push.** `-u` sets `origin/main` as this branch's upstream, so afterwards a bare `git push` knows where to go.", hi: true },
     { c: "git push", w: "**Every push after that.**" }
    ] } },
  { n: "A repository cloned from GitHub already has `origin` configured, and its branches already have upstreams. `git remote add` is only for a repository you started locally with `git init` and are now publishing.",
    nt: "Cloned repositories skip this" },

  { h: "Remote-tracking branches" },
  { p: "After talking to a remote, you have a third kind of branch: `origin/main`. It is **your local record of where the remote's `main` was the last time you checked** — not a live view." },
  { code: { lang: "text",
    lines: [
     { c: "  main         <- your branch, which you commit to", w: "" },
     { c: "  origin/main  <- where origin's main was at your last fetch", w: "**Read-only, and possibly stale.** It updates only when you fetch, pull or push.", hi: true },
     { c: "", w: "" },
     { c: "  A --- B --- C   <- origin/main", w: "" },
     { c: "               \\", w: "" },
     { c: "                D --- E   <- main", w: "**You are two commits ahead.** That is what *Your branch is ahead of origin/main by 2 commits* means." }
    ] } },
  { code: { lang: "bash",
    lines: [
     { c: "git status", w: "**Reports ahead/behind against the upstream** — but only as of your last fetch." },
     { c: "git fetch", w: "**Update your remote-tracking branches. Changes nothing else.** Completely safe, and the right first move when you want to know what has happened.", hi: true },
     { c: "git log --oneline main..origin/main", w: "**What is on the remote that I do not have.** Two dots means *in the second, not the first*." },
     { c: "git log --oneline origin/main..main", w: "And the reverse — what I have that is not pushed." },
     { c: "git diff main origin/main", w: "The actual changes between them." }
    ] } },

  { h: "fetch, pull, and the difference" },
  { p: "This is the distinction worth being precise about, because `pull` is two commands wearing a coat." },
  { code: { lang: "text",
    lines: [
     { c: "git fetch    =  download commits, update origin/*", w: "**Safe. Never touches your files or your branch.**" },
     { c: "git merge origin/main  =  combine them into your branch", w: "" },
     { c: "", w: "" },
     { c: "git pull     =  fetch + merge, in one step", w: "**Convenient, and occasionally surprising** — it can produce a conflict or a merge commit you were not expecting.", hi: true }
    ] } },
  { code: { lang: "bash",
    lines: [
     { c: "git pull", w: "Fetch and merge. The default." },
     { c: "git pull --rebase", w: "**Fetch, then replay your local commits on top** instead of merging. Avoids a merge commit every time you sync, keeping history linear.", hi: true },
     { c: "git config --global pull.rebase true", w: "**Make rebase the default for pull.** Many teams do this; it removes the *Merge branch main of…* commits that otherwise litter a history." },
     { c: "", w: "" },
     { c: "git fetch && git log --oneline HEAD..origin/main", w: "**The cautious version: look before you integrate.** Worth doing when you have been away for a while." }
    ] } },
  { n: "`git pull --rebase` is right when your local commits are not yet pushed. If they have been pushed, rebasing rewrites them and you are back in the *do not rewrite shared history* territory from the last module. In practice this is fine, because the commits you are rebasing in a `pull` are almost always ones you have not pushed yet — that is why you are behind.",
    nt: "When --rebase is the right default" },

  { h: "When push is rejected" },
  { term: { title: "Terminal",
    lines: [
     { c: "git push", w: "" },
     { out: "! [rejected]        main -> main (fetch first)\nerror: failed to push some refs to 'github.com:aryan/price-tracker.git'\nhint: Updates were rejected because the remote contains work that you do\nhint: not have locally." },
     { c: "", w: "**Somebody else pushed while you were working.** This is normal, expected, and not a problem." },
     { c: "git pull --rebase", w: "**Bring their work in and put yours on top.** Resolve any conflict, then:" },
     { c: "git push", w: "Now it goes." }
    ] } },
  { trap: "**`git push --force` is the wrong answer here**, and it is the one people reach for because it makes the error go away. It does that by deleting your colleague's commits from the remote. If you genuinely must force — after rebasing your own feature branch, which is legitimate — use `git push --force-with-lease`, which refuses if the remote has moved since your last fetch. It is the difference between *overwrite what I expect to be there* and *overwrite whatever is there*." },

  { h: "The daily rhythm with a team" },
  { code: { lang: "bash", t: "Morning to evening",
    lines: [
     { c: "git switch main && git pull", w: "**Start from current main.** Branching off a stale main is how you create conflicts for yourself." },
     { c: "git switch -c fix/142-login-timeout", w: "" },
     { c: "# ...work, commit, work, commit...", w: "" },
     { c: "git pull --rebase origin main", w: "**Periodically, if the branch lives more than a day.** Small conflicts now beat one large one later." },
     { c: "git push -u origin fix/142-login-timeout", w: "**Push the branch.** Now it is backed up and visible to others." },
     { c: "# open a pull request", w: "The next lesson." }
    ] } },

  { tryit: { t: "Publish something real",
    task: "Take a project you have on your machine — even a small script — and publish it. Create an empty repository on GitHub, connect it, push, and confirm the files and history appear on the site. Then make a change on GitHub's web editor, and pull it down.",
    hint: "Create the GitHub repository **without** a README, so the first push is not rejected for having unrelated histories.",
    sol: { lang: "bash", code: "# locally, in the project\ngit init\nprintf '.env\\n__pycache__/\\n' > .gitignore\ngit add .\ngit commit -m \"Initial commit\"\n\n# after creating an empty repo on github.com\ngit remote add origin git@github.com:aryan/price-tracker.git\ngit push -u origin main\n\n# edit the README on github.com, then:\ngit pull\ngit log --oneline -3" },
    w: "If GitHub created a README and your push is rejected for *unrelated histories*, the clean fix is `git pull --rebase origin main` to bring their commit in underneath yours, then push. `--allow-unrelated-histories` also works and produces a messier result." } }
 ],
 k: [
  "Set up an SSH key once; the private key never leaves your machine.",
  "`origin/main` is your last-known snapshot of the remote, not a live view — `git fetch` refreshes it and changes nothing else.",
  "`git pull` is fetch plus merge; `--rebase` replays your commits on top instead, keeping history linear.",
  "A rejected push means someone else pushed — pull first. Never plain `--force`; use `--force-with-lease` if you must."
 ],
 r: ["Git", "Repository", "Branch", "SSH", "Merge"],
 drill: {
  lang: "bash",
  reps: 3,
  items: [
   { c: "git remote add origin git@github.com:aryan/price-tracker.git", w: "point this repository at a copy on GitHub" },
   { c: "git push -u origin main", w: "push and remember where this branch belongs" },
   { c: "git fetch", w: "download what is new without touching your files" },
   { c: "git pull --rebase", w: "bring in others' work and replay yours on top" },
   { c: "git push --force-with-lease", w: "overwrite the remote branch, but only if it has not moved", hint: "never the plain --force" }
  ]
 }
},

{
 t: "Pull Requests, Reviews and Forks",
 m: "github",
 lvl: "intermediate",
 s: "How work actually gets into a shared codebase, everywhere in the industry.",
 goal: [
  "Open a pull request that is easy to review",
  "Give and receive review comments usefully",
  "Contribute to a project you do not have access to"
 ],
 b: [
  { p: "A **pull request** is a proposal: *here are some commits on a branch; please look at them and, if you agree, merge them into main.* It is not a Git feature — it is something GitHub added around Git, and it became the way essentially all software is written." },

  { h: "What a pull request actually is" },
  { l: [
   "**A diff**, between your branch and the target, rendered for reading.",
   "**A conversation**, threaded on specific lines of code.",
   "**A gate.** Automated tests, linters and required approvals run before merging is allowed.",
   "**A record.** In two years, the PR explains why the change was made and who agreed to it — often better than the commit messages do."
  ] },

  { h: "Opening one" },
  { code: { lang: "bash",
    lines: [
     { c: "git switch main && git pull", w: "" },
     { c: "git switch -c fix/142-login-timeout", w: "" },
     { c: "# ...work and commit...", w: "" },
     { c: "git rebase main", w: "**Tidy first: bring it up to date so the diff shows only your changes.** A PR full of unrelated commits from main is much harder to review." },
     { c: "git push -u origin fix/142-login-timeout", w: "**GitHub prints a URL to open the PR** directly in the output." },
     { c: "", w: "" },
     { c: "gh pr create --fill", w: "**Or from the terminal**, with GitHub's CLI. `--fill` uses your commit messages as the title and body." },
     { c: "gh pr status", w: "Where your open PRs stand." }
    ] } },

  { h: "Writing one people want to review" },
  { code: { lang: "text", t: "A description that earns a fast review",
    lines: [
     { c: "Fix session timeout on password reset", w: "**Title: same rules as a commit summary.** Imperative, specific, short." },
     { c: "", w: "" },
     { c: "## What", w: "" },
     { c: "Sessions expired after 5 minutes on the reset flow, so", w: "" },
     { c: "anyone who checked their email first was logged out.", w: "**The symptom, in user terms.** A reviewer who was not in the bug report can follow." },
     { c: "", w: "" },
     { c: "## Why", w: "" },
     { c: "The reset token TTL was being used as the session TTL.", w: "**The root cause**, which is what a reviewer actually needs to evaluate the fix." },
     { c: "", w: "" },
     { c: "## How to test", w: "" },
     { c: "1. Request a reset, wait 6 minutes, follow the link", w: "**Reproduction steps.** This single section does more for review speed than anything else.", hi: true },
     { c: "2. It should complete, not redirect to /login", w: "" },
     { c: "", w: "" },
     { c: "Fixes #142", w: "**Closes the issue automatically on merge.**" }
    ] } },
  { l: [
   "**Keep it small.** A 200-line PR gets a real review; a 2,000-line PR gets *looks good to me*. This is the single biggest factor in review quality.",
   "**One concern per PR.** A bug fix and a refactor together means the reviewer cannot approve half.",
   "**Say what you are unsure about.** *I wasn't sure whether to cache this — thoughts?* gets you a better answer than silence.",
   "**Mark it draft** while it is in progress, so nobody reviews something you are still changing."
  ] },
  { n: "Research on code review consistently finds that reviewers' ability to find defects falls off sharply after roughly 200–400 lines. Beyond that, the review becomes a formality regardless of who is doing it. Splitting a large change into three PRs is not bureaucratic — it is the difference between being reviewed and being rubber-stamped.",
    nt: "Why small PRs are not just politeness" },

  { h: "Responding to review" },
  { code: { lang: "bash",
    lines: [
     { c: "# make the requested changes", w: "" },
     { c: "git add -p && git commit -m \"Extract the TTL constant per review\"", w: "**A new commit, not an amend.** The reviewer can see what changed since they last looked; amending forces them to re-read everything." },
     { c: "git push", w: "**The PR updates automatically.** No re-opening required." },
     { c: "", w: "" },
     { c: "# once approved, some teams squash before merge:", w: "" },
     { c: "git rebase -i main", w: "**Collapse the review fixups into clean commits** — or use GitHub's *Squash and merge* button, which does the same thing." }
    ] } },
  { tbl: { t: "The three merge buttons",
    h: ["Option", "Produces", "Use when"],
    rows: [
     ["**Merge commit**", "All your commits, plus a merge commit", "The individual commits are meaningful on their own"],
     ["**Squash and merge**", "**One commit** on main, PR title as its message", "**The common default.** The branch had fixup commits nobody needs to keep"],
     ["**Rebase and merge**", "Your commits replayed, no merge commit", "You want linear history and every commit is already clean"]
    ] } },

  { h: "Reviewing someone else's" },
  { l: [
   "**Read the description first**, then the diff. Understanding the intent before the code makes review far faster.",
   "**Distinguish blocking from optional.** *This will crash on empty input* and *I'd have named this differently* are not the same, and saying which is which is a kindness.",
   "**Ask rather than assert.** *What happens if this is null?* opens a conversation; *this is broken* starts a defence.",
   "**Approve when it is good enough**, not when it is what you would have written. Perfect is a way of never shipping.",
   "**Say what is good.** Reviews that are only criticism make people dread the process."
  ] },
  { q: "Review the code, not the coder. Every comment should be something you would be happy to receive.", by: "The only rule that matters" },

  { h: "Forks — contributing without access" },
  { p: "You cannot push a branch to a repository you do not have write access to. A **fork** is your own copy of it under your account, and it is how all open-source contribution works." },
  { code: { lang: "text",
    lines: [
     { c: "  upstream: github.com/python/cpython     <- the real project", w: "" },
     { c: "        |  fork (a button on GitHub)", w: "" },
     { c: "        v", w: "" },
     { c: "  origin:   github.com/aryan/cpython      <- your copy, you can push here", w: "" },
     { c: "        |  clone", w: "" },
     { c: "        v", w: "" },
     { c: "  local:    ~/code/cpython                <- your machine", w: "**Then a pull request goes from your fork's branch back to upstream.**", hi: true }
    ] } },
  { term: { title: "Terminal", t: "The full contribution flow",
    lines: [
     { c: "git clone git@github.com:aryan/cpython.git", w: "**Clone your fork**, not the original." },
     { c: "cd cpython", w: "" },
     { c: "git remote add upstream https://github.com/python/cpython.git", w: "**Add the original as a second remote**, so you can pull their updates. Convention names it `upstream`.", hi: true },
     { c: "", w: "" },
     { c: "git fetch upstream", w: "**Get their latest.**" },
     { c: "git switch -c fix/typo-in-docs upstream/main", w: "**Branch from *their* main**, not your fork's — which may be months stale." },
     { c: "# ...make the change, commit...", w: "" },
     { c: "git push -u origin fix/typo-in-docs", w: "**Push to *your* fork.**" },
     { c: "gh pr create --repo python/cpython", w: "**Open the PR against the original.** Or use the button GitHub shows on your fork's page." }
    ] } },
  { n: "Read the project's `CONTRIBUTING.md` before opening anything. Most established projects have specific requirements — commit message format, tests, a signed contributor agreement, an issue opened first. Ignoring it is the most common reason a good contribution sits unreviewed.",
    nt: "Read CONTRIBUTING.md first" },

  { h: "Issues, and the rest of GitHub" },
  { l: [
   "**Issues** — bug reports and feature requests. Reference one in a commit or PR with `#142`; write `Fixes #142` to close it on merge.",
   "**Actions** — CI. Runs your tests on every push, automatically. A `.github/workflows/test.yml` file is all it takes.",
   "**Releases** — a tagged commit with notes and downloadable artifacts. `git tag -a v1.2.0 -m \"...\"` then `git push --tags`.",
   "**Pages** — free static hosting from a repository, which is how a great many project sites and portfolios are hosted.",
   "**Your profile** — the thing a hiring manager actually looks at. A few real repositories with clean histories and readable READMEs say more than any CV bullet."
  ] },

  { tryit: { t: "Make a real contribution",
    task: "Find a genuine typo or unclear sentence in the documentation of a project you use. Fork it, fix it on a branch, and open a pull request following their CONTRIBUTING guide.",
    hint: "Documentation fixes are the ideal first contribution — clearly useful, low risk, and reviewers are glad to take them. Many projects tag issues `good first issue` for exactly this.",
    sol: { lang: "bash", code: "# fork on github.com, then:\ngit clone git@github.com:aryan/somelib.git && cd somelib\ngit remote add upstream https://github.com/original/somelib.git\ngit fetch upstream\n\ngit switch -c docs/fix-install-typo upstream/main\n# ...fix the typo...\ngit commit -am \"Fix broken install command in README\"\ngit push -u origin docs/fix-install-typo\n\ngh pr create --repo original/somelib \\\n  --title \"Fix broken install command in README\" \\\n  --body \"The README says 'pip install somelib-py' but the package \\\nis published as 'somelib'. Verified against PyPI.\"" },
    w: "Note the body cites how it was verified. A reviewer who does not have to check your claim themselves merges much faster — and that habit, showing your evidence, is what makes a contributor easy to work with." } }
 ],
 k: [
  "A pull request is a diff plus a conversation plus a gate — GitHub's addition around Git, and how nearly all software ships.",
  "Small PRs get real reviews; past a few hundred lines, review quality collapses regardless of who is reviewing.",
  "Respond to review with new commits so the reviewer can see what changed, then squash on merge if the team prefers.",
  "Fork, add the original as `upstream`, branch from `upstream/main`, push to `origin`, open the PR against the original."
 ],
 r: ["Pull Request", "Code Review", "Continuous Integration", "Open Source", "Branch"],
 drill: {
  lang: "bash",
  reps: 3,
  items: [
   { c: "git push -u origin fix/142-login-timeout", w: "publish a branch and set its upstream in one go" },
   { c: "gh pr create --fill", w: "open a pull request from the terminal using your commit messages" },
   { c: "git remote add upstream https://github.com/python/cpython.git", w: "track the original project alongside your fork" },
   { c: "git fetch upstream", w: "get the original project's latest commits" },
   { c: "git switch -c fix/typo-in-docs upstream/main", w: "branch from the original's main, not your stale fork" }
  ]
 }
}

]);
