/* Git — how teams actually work. */
TD.addLessons("git", [

{
 t: "Branching Strategies and Team Conventions",
 m: "real",
 lvl: "intermediate",
 s: "How a team agrees to use Git, and why the simplest answer usually wins.",
 goal: [
  "Describe the two branching models you will actually meet",
  "Say what protecting a branch does and why teams do it",
  "Recognise which model a repository is using from its history"
 ],
 b: [
  { p: "Git imposes no workflow. That freedom means every team must agree on one, and the disagreements are surprisingly heated for something so procedural. In practice there are two models you will meet, and one of them has largely won." },

  { h: "GitHub Flow — the one most teams use" },
  { p: "One long-lived branch, `main`, which is always deployable. Everything else is a short-lived branch that merges into it and is deleted." },
  { code: { lang: "text",
    lines: [
     { c: "  main  ----o-------o-----------o-------o------>   always deployable", w: "" },
     { c: "             \\     /             \\     /", w: "" },
     { c: "              o---o               o---o", w: "**Feature branches, alive for hours or days.**" },
     { c: "              fix/142             feat/export", w: "" }
    ] } },
  { ol: [
   "Branch from `main`.",
   "Commit, push, open a pull request.",
   "Review, and CI runs the tests.",
   "Merge to `main`, delete the branch.",
   "Deploy — often automatically, on merge."
  ] },
  { l: [
   "**Why it works:** minimal ceremony, everyone always sees everyone else's work quickly, and no long-lived divergence means few painful merges.",
   "**What it requires:** genuinely good automated tests, and a way to hide unfinished features in production — feature flags, usually.",
   "**Who uses it:** most web companies, most startups, and most open-source projects."
  ] },

  { h: "Git Flow — the heavyweight one" },
  { p: "Two permanent branches (`main` and `develop`) plus prescribed `feature/`, `release/` and `hotfix/` branches with rules about which may merge into which." },
  { code: { lang: "text",
    lines: [
     { c: "  main     ----o------------------o---------->  released versions only", w: "" },
     { c: "                \\                /", w: "" },
     { c: "  release        o----o---------o", w: "**Stabilisation happens here.**" },
     { c: "                /      \\", w: "" },
     { c: "  develop  --o--------o-o----------o--------->  integration branch", w: "" },
     { c: "              \\      /", w: "" },
     { c: "  feature      o----o", w: "" }
    ] } },
  { l: [
   "**Why it exists:** it was designed for software with **versioned releases** — desktop applications, mobile apps, anything where several versions are supported simultaneously and you cannot simply deploy `main`.",
   "**What it costs:** a lot of merging, long-lived branches that diverge badly, and a mental overhead that is real.",
   "**Its own author** published a note years later saying that if you deliver continuously, you should probably not use it."
  ] },
  { n: "The honest summary: **use GitHub Flow unless you have a specific reason not to.** The specific reason is usually versioned releases that must be maintained in parallel. If you deploy from `main` several times a week, Git Flow's machinery is solving a problem you do not have.",
    nt: "Which one to pick" },

  { h: "Trunk-based development" },
  { p: "The furthest extreme: everyone commits to `main` several times a day, with branches living hours at most. Unfinished work ships behind feature flags." },
  { l: [
   "**Requires** excellent automated testing and a real feature-flag system.",
   "**Gives** essentially zero merge pain, because nothing ever diverges long enough to conflict.",
   "**Used by** Google, and by teams that have invested heavily in test infrastructure. It is less a branching model than a consequence of very fast CI."
  ] },

  { h: "Protected branches" },
  { p: "Whatever the model, teams stop people pushing directly to `main`. GitHub calls these branch protection rules and they are set on the repository, not in Git." },
  { tbl: { h: ["Rule", "Effect"],
    rows: [
     ["**Require a pull request**", "No direct pushes to `main`. Everything is reviewed"],
     ["**Require approvals**", "One or two reviewers must approve before merge is enabled"],
     ["**Require status checks**", "**Tests must pass.** The single most valuable rule"],
     ["**Require branch up to date**", "Must be rebased or merged with current `main` before merging"],
     ["**Block force pushes**", "Nobody can rewrite `main`'s history, including by accident"],
     ["**Require signed commits**", "Cryptographic proof of authorship. Common in security-sensitive projects"]
    ] } },
  { n: "These rules are not distrust. They are the mechanism that lets a team move fast without fear — the tests always ran, someone always looked, and `main` cannot be broken by a mistyped command at six in the evening. Every team that removes them adds them back within a year.",
    nt: "Why the rules help rather than slow you" },

  { h: "Reading a repository's conventions" },
  { p: "Joining a project, you can work out its conventions in about two minutes." },
  { code: { lang: "bash",
    lines: [
     { c: "git log --oneline -30", w: "**Commit message style.** Imperative? Prefixed with `feat:` or `fix:`? Ticket numbers?" },
     { c: "git log --oneline --graph -40", w: "**Merge commits or a straight line?** That tells you merge versus squash versus rebase." },
     { c: "git branch -a", w: "**Is there a `develop`?** If so, it is some form of Git Flow." },
     { c: "cat CONTRIBUTING.md", w: "**If it exists, it is the answer.** Read it before your first PR." },
     { c: "ls .github/workflows/", w: "What CI runs, and therefore what must pass." }
    ] } },

  { h: "Conventional Commits" },
  { p: "A widely used message convention that makes history machine-readable, and drives automatic changelogs and version numbers." },
  { code: { lang: "text",
    lines: [
     { c: "feat: add CSV export to the reports page", w: "**A new feature.** Bumps the minor version under semantic versioning." },
     { c: "fix: correct timezone handling in the daily summary", w: "**A bug fix.** Bumps the patch version." },
     { c: "docs: clarify the install steps for Windows", w: "" },
     { c: "refactor: extract the token helper", w: "No behaviour change." },
     { c: "test: add cases for expired sessions", w: "" },
     { c: "chore: upgrade pytest to 8.2", w: "" },
     { c: "", w: "" },
     { c: "feat(auth)!: require MFA for admin accounts", w: "**`!` marks a breaking change**, bumping the major version. The scope in brackets is optional.", hi: true }
    ],
    after: "Adopt it if your team has, ignore it if they have not. Consistency within a repository matters much more than which convention is chosen." } },

  { tryit: { t: "Diagnose three repositories",
    task: "Clone three projects you use. For each, determine in under five minutes: their branching model, their merge style, their commit message convention, and what CI must pass. Write one line per project.",
    hint: "`git log --graph` answers the merge style instantly — lots of merge commits means merge, a perfect straight line means squash or rebase.",
    sol: { lang: "text", code: "requests    GitHub Flow, squash merges (linear log), plain imperative\n            messages, CI = pytest across 6 Python versions.\n\nvscode      GitHub Flow off main, merge commits kept, messages reference\n            issue numbers heavily. Huge CI matrix incl. integration tests.\n\nsome-corp   develop branch present -> Git Flow. Merge commits everywhere,\n            Conventional Commits enforced by a commitlint action." },
    w: "Doing this before your first PR on a new project is worth the five minutes every time. Matching a team's existing conventions is most of what makes a first contribution land smoothly — and getting it wrong is the most common reason a technically fine PR gets bounced." } }
 ],
 k: [
  "GitHub Flow — one deployable `main`, short-lived branches — is the right default for almost everyone.",
  "Git Flow's machinery is for parallel versioned releases; its own author advises against it for continuous delivery.",
  "Branch protection (required review, required passing tests, no force push) is what lets a team move fast safely.",
  "Read a repository's log, branches and CONTRIBUTING before your first PR — conventions vary and matching them matters."
 ],
 r: ["Branch", "Continuous Integration", "Code Review", "Semantic Versioning", "Feature Flag", "Trunk-Based Development"],
 drill: {
  lang: "bash",
  reps: 3,
  items: [
   { c: "git log --oneline --graph -40", w: "read a project's merge style from the shape of its history" },
   { c: "git branch -a", w: "check whether the project has a develop branch" },
   { c: "git switch -c feat/csv-export main", w: "start a feature branch from current main" }
  ]
 }
},

{
 t: "The Professional Habits",
 m: "real",
 lvl: "intermediate",
 s: "Tags, hooks, large files, secrets — and the short list of things not to do.",
 goal: [
  "Tag a release and understand semantic versioning",
  "Handle the situations Git handles badly",
  "Know what to do when a secret is committed"
 ],
 b: [
  { p: "The last lesson. These are the things that separate someone who uses Git from someone who is trusted with a repository — mostly small habits, and a handful of situations where doing the wrong thing is expensive." },

  { h: "Tags and releases" },
  { p: "A **tag** is a permanent name for a commit. Unlike a branch, it never moves." },
  { code: { lang: "bash",
    lines: [
     { c: "git tag -a v1.2.0 -m \"Add CSV export and fix the timezone bug\"", w: "**An annotated tag** — carries a message, an author and a date. Use these for releases." },
     { c: "git tag v1.2.0", w: "A lightweight tag: just a name on a commit. Fine for personal bookmarks." },
     { c: "", w: "" },
     { c: "git tag", w: "List them." },
     { c: "git show v1.2.0", w: "The tag's message and the commit it points at." },
     { c: "git push origin v1.2.0", w: "**Tags are not pushed by `git push`.** This surprises everyone once — you tag, you push, and nothing appears on GitHub.", hi: true },
     { c: "git push --tags", w: "All of them at once." },
     { c: "", w: "" },
     { c: "git tag -a v1.1.9 9f8e7d6 -m \"...\"", w: "Tag an older commit retroactively." },
     { c: "git describe --tags", w: "**`v1.2.0-4-g7c4f21a`** — four commits after v1.2.0. The standard way to generate a build version string." }
    ] } },
  { p: "**Semantic versioning** — `MAJOR.MINOR.PATCH` — is the near-universal convention for what those numbers mean." },
  { tbl: { h: ["Bump", "When", "Example"],
    rows: [
     ["**PATCH** `1.2.0 → 1.2.1`", "A bug fix, no interface change", "Fix a crash on empty input"],
     ["**MINOR** `1.2.1 → 1.3.0`", "New functionality, **backwards compatible**", "Add an optional parameter"],
     ["**MAJOR** `1.3.0 → 2.0.0`", "**A breaking change.** Existing code stops working", "Remove a function, change a return type"]
    ] } },

  { h: "Large files" },
  { p: "Git stores every version of every file in full, forever. That is exactly right for source code and catastrophic for anything large and binary." },
  { l: [
   "**A 50 MB video, edited ten times, is 500 MB in the repository** — permanently, for everyone who clones it.",
   "**Binary files cannot be diffed or merged.** Two people editing the same PSD produces a conflict Git cannot help with.",
   "**Deleting the file does not shrink the repository.** The old versions are still in the history."
  ] },
  { code: { lang: "bash", t: "Git LFS, when you genuinely need binaries versioned",
    lines: [
     { c: "git lfs install", w: "Once per machine." },
     { c: "git lfs track \"*.psd\"", w: "**Now those files are replaced in the repository by small pointers**, with the content stored separately and fetched on demand." },
     { c: "git add .gitattributes", w: "**Commit this** — it is what tells everyone else's Git to do the same." }
    ],
    after: "Better still, where possible: keep large assets outside Git entirely — object storage, a CDN, a dedicated asset pipeline — and commit only a reference. LFS is the answer when the binary genuinely needs to be versioned alongside the code." } },

  { h: "Secrets — the expensive mistake" },
  { p: "This is the one worth reading carefully, because the instinctive fix is wrong." },
  { code: { lang: "bash", t: "What people do, and why it fails",
    lines: [
     { c: "git rm .env && git commit -m \"Remove secrets\"", w: "**This does not work.** The file is gone from the current commit and sitting in every previous one. Anyone who clones the repository gets the key.", hi: true },
     { c: "git log -p --all -- .env", w: "**Proof: the content is right there**, readable, forever." }
    ] } },
  { ol: [
   "**Rotate the credential immediately.** This is the only step that genuinely matters. Assume it is compromised the moment it was pushed — bots scan public GitHub for exactly this within seconds.",
   "**Then remove it from history**, with `git filter-repo` (or BFG Repo-Cleaner). Both rewrite every commit, which means everyone must re-clone.",
   "**Add it to `.gitignore`** so it cannot happen again.",
   "**Check for others.** `gitleaks` or `trufflehog` scan a whole history in seconds."
  ] },
  { term: { title: "Terminal", t: "Removing a file from all history",
    lines: [
     { c: "pip install git-filter-repo", w: "**The maintained tool.** `git filter-branch` is deprecated and dangerously slow." },
     { c: "git filter-repo --path .env --invert-paths", w: "**Rewrites every commit as though `.env` never existed.** Every hash changes." },
     { c: "git push --force --all", w: "**Rewriting shared history**, which is exactly the thing you normally must not do — and here it is necessary. Tell your team first; everyone must re-clone." }
    ] } },
  { trap: "Even after a perfect history rewrite, treat the secret as compromised. GitHub keeps unreferenced commits accessible by hash for a period, forks retain the old history entirely, and anyone who cloned still has it. **Rotation is the fix; the rewrite is cleanup.** Doing the second without the first is the actual mistake." },

  { h: "Hooks" },
  { p: "Scripts Git runs automatically at certain points. They live in `.git/hooks/` and are **not** committed — which is why most teams use a manager instead." },
  { code: { lang: "bash",
    lines: [
     { c: "# .git/hooks/pre-commit — must be executable", w: "" },
     { c: "#!/bin/sh", w: "" },
     { c: "ruff check . || exit 1", w: "**A non-zero exit aborts the commit.** Catches the lint error before it reaches CI." },
     { c: "pytest -q tests/unit || exit 1", w: "**Keep hooks fast.** A pre-commit hook that takes thirty seconds is a hook people bypass with `--no-verify`." },
     { c: "", w: "" },
     { c: "pip install pre-commit && pre-commit install", w: "**The standard tool.** Configuration lives in a committed `.pre-commit-config.yaml`, so the whole team gets the same hooks.", hi: true }
    ] } },
  { l: [
   "**`pre-commit`** — lint, format, scan for secrets. The most useful one.",
   "**`commit-msg`** — enforce a message convention.",
   "**`pre-push`** — run the fuller test suite before anything leaves the machine."
  ] },

  { h: "The short list of things not to do" },
  { tbl: { h: ["Do not", "Because", "Instead"],
    rows: [
     ["`git push --force` to a shared branch", "Deletes other people's commits", "`--force-with-lease`, and only on your own branch"],
     ["Commit secrets", "Permanent, and scanned by bots within seconds", "`.gitignore` plus a secret manager"],
     ["Commit generated files or dependencies", "Noise in every diff, conflicts on every merge", "`.gitignore` and a lockfile"],
     ["Rebase a branch others have pulled", "Rewrites history under their feet", "Merge, or coordinate explicitly first"],
     ["Commit a whole day's work at once", "Impossible to review, revert or bisect", "Small commits, one idea each"],
     ["Write `fix` as a message", "Useless in a week, let alone a year", "Say what and why"],
     ["Work directly on `main`", "No review, no safety net", "A branch, always"],
     ["Delete `.git`", "Destroys the entire history instantly", "Nothing. There is no reason"]
    ] } },

  { h: "The commands, ranked by how often you will use them" },
  { code: { lang: "bash", t: "Realistically, this is your whole career",
    lines: [
     { c: "git status", w: "**Constantly.** More than any other command." },
     { c: "git add -p / git add .", w: "Every commit." },
     { c: "git commit -m \"...\"", w: "Every commit." },
     { c: "git push / git pull", w: "Several times a day." },
     { c: "git switch -c / git switch", w: "Several times a day." },
     { c: "git log --oneline --graph", w: "Daily." },
     { c: "git diff / git diff --staged", w: "Daily." },
     { c: "git merge / git rebase", w: "Weekly." },
     { c: "git stash / git restore", w: "Weekly." },
     { c: "git reset / git revert / git reflog", w: "**When something is wrong** — which is exactly when you will be glad you read that lesson." },
     { c: "git bisect / git filter-repo", w: "Rarely, and memorably." }
    ],
    after: "Eleven lines. Everything else is a variation, a flag, or a situation you will look up when you meet it — which is the right way to use the rest of Git." } },

  { h: "Where to go next" },
  { l: [
   "**Put a project on GitHub this week.** Not a tutorial follow-along — something of your own, with a README that says what it does and how to run it. This is the single highest-value thing in this track.",
   "**Make one open-source contribution.** A documentation fix counts, and the process is the point.",
   "**Turn on branch protection** on your own repository, even solo. Reviewing your own PR is a surprisingly good habit.",
   "**If you have not done the Python or SQL tracks**, they are where the code you will be versioning comes from."
  ] },

  { tryit: { t: "Set up a repository properly, end to end",
    task: "Take a real project and give it the full treatment: a `.gitignore`, a README explaining what it does and how to run it, clean commit history, a `v0.1.0` tag pushed to GitHub, a pre-commit hook running your linter, and branch protection on `main`.",
    hint: "If the history is already messy, `git rebase -i` can clean it up — it is your own unpushed work, so rewriting it is entirely fair.",
    sol: { lang: "bash", code: "# a clean history before anyone sees it\ngit rebase -i --root        # squash, reword, reorder\n\n# hooks the whole team gets\ncat > .pre-commit-config.yaml <<'YAML'\nrepos:\n  - repo: https://github.com/astral-sh/ruff-pre-commit\n    rev: v0.6.0\n    hooks: [{id: ruff}, {id: ruff-format}]\n  - repo: https://github.com/gitleaks/gitleaks\n    rev: v8.18.0\n    hooks: [{id: gitleaks}]\nYAML\npre-commit install\ngit add .pre-commit-config.yaml\ngit commit -m \"Add pre-commit hooks for linting and secret scanning\"\n\n# tag the first release\ngit tag -a v0.1.0 -m \"First working version\"\ngit push origin main --tags\n\n# then, on github.com: Settings -> Branches -> protect main" },
    w: "The gitleaks hook is the one to keep in every project. It scans each commit for anything shaped like a credential before it is recorded — which turns the most expensive mistake in this lesson into a two-second error message you can act on." } }
 ],
 k: [
  "Tags are permanent names for commits and are **not** pushed by `git push` — use `--tags` or push them by name.",
  "Git stores every version of every file forever; keep large binaries out, or use LFS if they must be versioned.",
  "A committed secret must be **rotated** first; rewriting history with `git filter-repo` is only cleanup.",
  "Eleven commands cover almost all real use — status, add, commit, push, pull, switch, log, diff, merge, stash, reset."
 ],
 r: ["Git", "Semantic Versioning", "Secrets Management", "Continuous Integration", "Repository", "Code Review"],
 drill: {
  lang: "bash",
  reps: 3,
  items: [
   { c: "git tag -a v1.2.0 -m \"Add CSV export and fix the timezone bug\"", w: "give a commit a permanent release name" },
   { c: "git push origin v1.2.0", w: "send a tag to the remote", hint: "a plain push does not include it" },
   { c: "git describe --tags", w: "generate a version string from the nearest tag" },
   { c: "git filter-repo --path .env --invert-paths", w: "erase a file from every commit in history" },
   { c: "pre-commit install", w: "wire the project's shared hooks into this clone" }
  ]
 }
}

]);
