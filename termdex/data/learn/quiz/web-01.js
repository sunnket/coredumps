/* Git, HTML and CSS — question banks.

   Git questions focus on the mental model (three places, commits as snapshots)
   rather than on command recall, because someone who understands the model can
   derive the command and someone who memorised commands cannot recover from an
   unexpected state.

   HTML and CSS questions weight semantics and the cascade heavily -- those are
   what interviewers probe and what beginners most often get wrong. */

/* ===================================================================
   Git
   =================================================================== */

TD.addMCQ("git", "why", [
  {
    "tag": "What version control is for",
    "lvl": "core",
    "q": "Beyond backup, what does version control give you that copying folders does not?",
    "o": [
      "Faster file access",
      "A recorded history of *why* each change was made, the ability to work on several changes independently, and a safe way to experiment because nothing is ever lost",
      "Automatic code formatting",
      "Compression of old files"
    ],
    "a": 1,
    "x": "Copies give you states; git gives you a history with reasons attached. That history is what lets you find when a bug appeared, understand why a strange line exists, and branch freely — the confidence to experiment is arguably the biggest day-to-day benefit, because it removes the fear of breaking something that works."
  },
  {
    "tag": "Commits as snapshots",
    "lvl": "intermediate",
    "q": "A git commit stores a complete snapshot of the tracked files, not a diff. Why does the repository not become enormous?",
    "o": [
      "Git deletes old commits automatically after 90 days",
      "Unchanged files are stored once and referenced by content hash, so a snapshot only adds storage for what actually changed",
      "Commits are compressed diffs despite appearing as snapshots",
      "Git only stores the most recent 50 commits locally"
    ],
    "a": 1,
    "x": "Every file is stored by the hash of its contents, so a file that did not change between commits is the same object referenced twice. Diffs are *computed* when you ask for them, not stored. This content-addressing is also why git can detect a corrupted or altered object — the hash would not match."
  }
]);

TD.addMCQ("git", "local", [
  {
    "tag": "The three places",
    "lvl": "core",
    "q": "What are the three places your work exists in a git repository?",
    "o": [
      "Local, remote and backup",
      "The working directory (your edits), the staging area (what will go in the next commit), and the repository (committed history)",
      "HEAD, main and origin",
      "Draft, review and published"
    ],
    "a": 1,
    "x": "This model explains almost every git command. `git add` moves changes from working directory to staging; `git commit` moves staging into history. The staging area exists so you can commit a coherent subset of your changes rather than everything you happen to have touched — which is what makes `git add -p` so useful."
  },
  {
    "tag": "Staging selectively",
    "lvl": "intermediate",
    "q": "Why does `git add -p` produce better commit history than `git add .`?",
    "o": [
      "It runs faster on large repositories",
      "It shows each change as you stage it, so you review your own diff and can split unrelated work into separate, coherent commits",
      "It automatically writes the commit message",
      "It prevents merge conflicts"
    ],
    "a": 1,
    "x": "`git add .` stages whatever you happen to have touched, which mixes a bug fix with a stray debug print and an unrelated refactor. Reviewing hunk by hunk both catches accidents before they become history and produces commits that each do one thing — which is what makes `git bisect` and code review work."
  },
  {
    "tag": "Commit messages",
    "lvl": "core",
    "q": "Which commit message is most useful six months later?",
    "o": [
      "fixed bug",
      "Fix off-by-one in pagination that hid the last result page",
      "updates",
      "WIP"
    ],
    "a": 1,
    "x": "A message should say what changed and, where it is not obvious, why. The imperative present tense (`Fix`, not `Fixed`) is the git convention because it reads as a description of what applying the commit does. The audience is always your future self, trying to work out whether this commit is the one that broke something."
  }
]);

TD.addMCQ("git", "history", [
  {
    "tag": "diff versus staged",
    "lvl": "intermediate",
    "q": "You are about to commit and want to review exactly what will be included. Which command?",
    "o": [
      "git diff",
      "git diff --staged",
      "git log -p",
      "git status"
    ],
    "a": 1,
    "x": "Plain `git diff` shows *unstaged* changes — the opposite of what is about to be committed. `git diff --staged` (or `--cached`) shows the staged content, which is what the commit will contain. Confusing the two is why people commit things they meant to leave out."
  },
  {
    "tag": "Undoing safely",
    "lvl": "advanced",
    "q": "You need to undo a commit that has already been pushed to a shared branch. What is the safe command?",
    "o": [
      "git reset --hard HEAD~1 then force push",
      "git revert, which creates a new commit undoing the change and leaves history intact",
      "git commit --amend then force push",
      "Delete the branch and recreate it"
    ],
    "a": 1,
    "x": "`revert` adds a commit that reverses the change, so anyone who already pulled is unaffected. `reset` plus a force push rewrites shared history, which breaks every other clone and is how teams lose work. The rule: rewrite history freely before pushing, never after."
  }
]);

TD.addMCQ("git", "branch", [
  {
    "tag": "What a branch is",
    "lvl": "intermediate",
    "q": "What is a git branch, mechanically?",
    "o": [
      "A full copy of the repository at a point in time",
      "A movable pointer to a commit — creating one costs almost nothing because no files are copied",
      "A separate directory on disk",
      "A compressed archive of changes"
    ],
    "a": 1,
    "x": "A branch is a 41-byte file containing a commit hash. That is why branching is instant regardless of repository size, and why the advice to branch freely is practical rather than aspirational. Switching branches updates your working directory to match that commit; it does not copy anything."
  },
  {
    "tag": "Merge conflicts",
    "lvl": "intermediate",
    "q": "What causes a merge conflict?",
    "o": [
      "Two branches that have diverged at all",
      "Two branches changing the same lines of the same file differently, so git cannot decide which version is correct",
      "Committing without a message",
      "Merging a branch that is behind main"
    ],
    "a": 1,
    "x": "Git merges automatically whenever changes do not overlap — different files, or different regions of the same file, merge silently. A conflict means two edits genuinely compete and only a human knows the intent. Frequent small merges reduce conflicts; long-lived branches guarantee them."
  }
]);

TD.addMCQ("git", "github", [
  {
    "tag": "Pull requests",
    "lvl": "intermediate",
    "q": "What is a pull request, in terms of the underlying git operations?",
    "o": [
      "A command that pulls changes from a remote",
      "A request to merge one branch into another, wrapped in a review and discussion interface — the git operation itself is just a merge",
      "A way to copy someone else's repository",
      "An automated test run"
    ],
    "a": 1,
    "x": "The git part is trivial: merge branch A into branch B. Everything else — review, comments, CI checks, approvals — is a layer the platform adds around it. Knowing this helps when a PR misbehaves, because underneath it is only branches and commits."
  },
  {
    "tag": "origin and remotes",
    "lvl": "core",
    "q": "What does `origin` refer to?",
    "o": [
      "The first commit in the repository",
      "The conventional name for the remote repository you cloned from — a bookmark for a URL, not anything special to git",
      "The main branch",
      "Your local repository"
    ],
    "a": 1,
    "x": "`origin` is just the default name given to the remote when you clone. You can rename it, or have several remotes with different names — which is exactly how a fork workflow works, with `origin` as your copy and `upstream` as the original."
  }
]);

TD.addMCQ("git", "real", [
  {
    "tag": "Committing secrets",
    "lvl": "advanced",
    "q": "You accidentally commit an API key and push it. You then delete the line and commit again. Is the key safe?",
    "o": [
      "Yes, the latest commit no longer contains it",
      "No — it remains in the repository's history and must be treated as compromised and rotated immediately",
      "Yes, if the repository is private",
      "Only if you also force push"
    ],
    "a": 1,
    "x": "Git keeps everything. Anyone with the repository can read any past commit, and public repositories are scraped for keys within minutes. Removing it from history is possible but secondary — the key has been exposed, so the only real fix is to revoke and reissue it. Prevention is a `.gitignore` for env files, plus a pre-commit secret scanner."
  },
  {
    "tag": ".gitignore",
    "lvl": "intermediate",
    "q": "You add `secrets.env` to .gitignore, but git still tracks it. Why?",
    "o": [
      ".gitignore requires a leading slash",
      ".gitignore only prevents *untracked* files being added — a file already tracked keeps being tracked until you explicitly remove it from the index",
      "The file must be deleted and recreated",
      ".gitignore does not apply to .env files"
    ],
    "a": 1,
    "x": "Ignoring is about what git picks up, not what it already has. `git rm --cached secrets.env` removes it from tracking while leaving it on disk, and the next commit records the removal. This catches people constantly, usually right after they realise a file should never have been committed."
  }
]);

/* ===================================================================
   HTML
   =================================================================== */

TD.addMCQ("html", "brief", [
  {
    "tag": "Markup is not programming",
    "lvl": "core",
    "q": "What does it mean that HTML is a markup language rather than a programming language?",
    "o": [
      "It is simpler and therefore less important",
      "It describes structure and meaning; it has no logic, no variables and no way to make a decision",
      "It cannot be used for real applications",
      "It runs on the server rather than the browser"
    ],
    "a": 1,
    "x": "HTML annotates content with what each part *is* — a heading, a list, a form. There is no branching or state, which is why JavaScript exists. Understanding this boundary is what stops beginners looking for `if` statements in HTML and clarifies what each of the three web languages is responsible for."
  }
]);

TD.addMCQ("html", "structure", [
  {
    "tag": "Nesting",
    "lvl": "core",
    "q": "Why does `<p>text <div>block</div></p>` render unexpectedly?",
    "o": [
      "div is deprecated inside paragraphs",
      "A `p` cannot contain block-level elements, so the browser silently closes the paragraph before the div — producing a DOM different from what you wrote",
      "The div needs a closing slash",
      "Paragraphs must have a class to contain other elements"
    ],
    "a": 1,
    "x": "Browsers never reject invalid HTML — they repair it according to fixed rules, which is why the rendered DOM can differ from your source. This produces baffling CSS and JavaScript bugs, because your selectors target a structure that does not exist. Inspecting the live DOM rather than the source is how you find it."
  }
]);

TD.addMCQ("html", "content", [
  {
    "tag": "Alt text",
    "lvl": "core",
    "q": "When is `alt=\"\"` (deliberately empty) the correct choice for an image?",
    "o": [
      "Never — every image needs descriptive alt text",
      "When the image is purely decorative and conveys no information, so a screen reader should skip it entirely",
      "When the image fails to load",
      "When the filename is already descriptive"
    ],
    "a": 1,
    "x": "An empty alt attribute tells assistive technology to ignore the image, which is correct for decoration. *Omitting* alt entirely is different and worse: some screen readers then read the filename aloud. So the rule is describe it, or explicitly mark it decorative — never leave the attribute off."
  },
  {
    "tag": "Link text",
    "lvl": "core",
    "q": "Why is 'click here' poor link text?",
    "o": [
      "It is too short to be indexed by search engines",
      "Links are often navigated as a list out of context, so text that does not describe its destination is useless to screen reader users",
      "It triggers a browser warning",
      "It cannot be styled with CSS"
    ],
    "a": 1,
    "x": "Screen readers can present all links on a page as a list for navigation. A page of twenty links all reading 'click here' is unusable. Link text should describe the destination on its own — which also helps sighted users scanning, and search engines ranking."
  }
]);

TD.addMCQ("html", "forms", [
  {
    "tag": "Labels",
    "lvl": "core",
    "q": "Why associate a `<label>` with its input using `for` and `id` rather than just placing text nearby?",
    "o": [
      "It is required for the form to submit",
      "It announces the field's purpose to screen readers, and makes clicking the label focus the input — a real usability gain, especially for checkboxes",
      "It applies default styling",
      "It validates the input automatically"
    ],
    "a": 1,
    "x": "Nearby text is visual only; the association is what makes the relationship real in the accessibility tree. The larger click target matters too — hitting a small checkbox on a phone is much easier when the label is also clickable. Wrapping the input inside the label works equally well."
  }
]);

TD.addMCQ("html", "semantic", [
  {
    "tag": "Semantic elements",
    "lvl": "intermediate",
    "q": "`<div class=\"button\" onclick=\"...\">` looks and behaves like a button visually. What does it lack?",
    "o": [
      "Nothing, provided the CSS is correct",
      "Keyboard focus, Enter and Space activation, and the announcement 'button' to assistive technology — all of which a real <button> provides for free",
      "The ability to submit a form",
      "Hover states"
    ],
    "a": 1,
    "x": "Semantic elements come with behaviour and meaning, not just default styling. Recreating a button from a div means reimplementing tabindex, key handlers and ARIA role — and people almost never do all three. Using the right element is the cheapest accessibility decision available."
  }
]);

TD.addMCQ("html", "tables", [
  {
    "tag": "Tables for data",
    "lvl": "core",
    "q": "Why is using a table for page layout considered wrong, given that it works visually?",
    "o": [
      "Tables render more slowly",
      "A table declares 'this is tabular data' to assistive technology, so a screen reader announces rows and columns of a layout that has no such meaning",
      "Tables cannot be styled with flexbox",
      "Search engines refuse to index tables"
    ],
    "a": 1,
    "x": "The markup carries meaning independent of appearance. A layout table produces nonsensical announcements — 'row 3, column 2' for what is visually a sidebar. CSS grid and flexbox exist for layout precisely so tables can mean what they say. Use `<th>` and `scope` for real data tables."
  }
]);

/* ===================================================================
   CSS
   =================================================================== */

TD.addMCQ("css", "brief", [
  {
    "tag": "The cascade",
    "lvl": "core",
    "q": "Two rules set a different colour on the same element. How does the browser decide?",
    "o": [
      "The rule that appears first in the file wins",
      "Specificity first; if specificity ties, the rule appearing later wins",
      "The rule with more properties wins",
      "The browser picks randomly"
    ],
    "a": 1,
    "x": "The cascade resolves conflicts by origin, then importance, then specificity, then source order. In everyday work specificity and order are the two that matter. Understanding this is what turns 'my CSS isn't working' into a question you can actually answer by inspecting the element."
  }
]);

TD.addMCQ("css", "selectors", [
  {
    "tag": "Specificity",
    "lvl": "intermediate",
    "q": "Which selector has the highest specificity?",
    "o": [
      ".card .title",
      "#header .title",
      "div.card p.title",
      "p.title"
    ],
    "a": 1,
    "x": "Specificity is counted as ids, then classes/attributes/pseudo-classes, then elements. `#header .title` is (1,1,0); `div.card p.title` is (0,2,2); `.card .title` is (0,2,0). Any id beats any number of classes, which is why ids in stylesheets make later overrides painful — and why utility-first and BEM approaches avoid them."
  },
  {
    "tag": "!important",
    "lvl": "intermediate",
    "q": "Why is `!important` considered a last resort rather than a tool?",
    "o": [
      "It is deprecated in modern CSS",
      "It overrides the cascade entirely, so the only way to beat it is another !important — which escalates until specificity is meaningless",
      "It only works in some browsers",
      "It slows down rendering"
    ],
    "a": 1,
    "x": "Each `!important` removes a decision from the cascade, and the usual response to one is another one. A stylesheet full of them cannot be reasoned about at all. The legitimate uses are narrow: overriding third-party styles you cannot edit, and utility classes designed to win deliberately."
  }
]);

TD.addMCQ("css", "box", [
  {
    "tag": "box-sizing",
    "lvl": "core",
    "q": "An element with `width: 300px; padding: 20px; border: 2px` occupies 344px. What does `box-sizing: border-box` change?",
    "o": [
      "It removes the padding and border",
      "Width then includes padding and border, so the element occupies exactly 300px and the content area shrinks to fit",
      "It makes the element position: relative",
      "It centres the element"
    ],
    "a": 1,
    "x": "The default `content-box` means width describes only the content, with padding and border added on top — which makes layout arithmetic painful. `border-box` makes width mean the total, which is what people intuitively expect. Applying it to `*` is one of the most common lines in any CSS reset."
  },
  {
    "tag": "Margin collapse",
    "lvl": "intermediate",
    "q": "Two stacked elements have 20px bottom and 30px top margins. What gap appears between them?",
    "o": [
      "50px",
      "30px — adjacent vertical margins collapse to the larger of the two",
      "20px",
      "0px"
    ],
    "a": 1,
    "x": "Vertical margins between siblings collapse to the larger value rather than adding. This is deliberate — it makes consistent spacing between paragraphs work — but it surprises people constantly. It does not happen in flex or grid containers, which is one reason gap-based layouts are easier to reason about."
  }
]);

TD.addMCQ("css", "layout", [
  {
    "tag": "Flexbox versus grid",
    "lvl": "intermediate",
    "q": "What is the practical rule for choosing between flexbox and grid?",
    "o": [
      "Grid is newer, so always prefer it",
      "Flexbox for laying out along one axis where content sizes itself; grid for two-dimensional layouts where you define the structure",
      "Flexbox for mobile, grid for desktop",
      "They are interchangeable"
    ],
    "a": 1,
    "x": "Flexbox distributes space along one direction and is content-driven — a row of buttons, a navigation bar. Grid defines rows and columns up front and is layout-driven — a page skeleton, a card gallery with aligned rows. They compose freely: grid for the page, flex inside the cells."
  },
  {
    "tag": "gap",
    "lvl": "core",
    "q": "Why is `gap` preferable to margins for spacing flex or grid children?",
    "o": [
      "It renders faster",
      "It applies only *between* items, so there is no trailing margin on the last child to strip off with a last-child selector",
      "Margins do not work inside flex containers",
      "gap can be animated and margin cannot"
    ],
    "a": 1,
    "x": "The margin approach needs `:last-child { margin-right: 0 }` or a negative margin on the container to cancel the edge. `gap` puts space only between items by definition, so the container's own padding stays under your control. It also avoids margin collapse entirely."
  }
]);

TD.addMCQ("css", "visual", [
  {
    "tag": "Custom properties",
    "lvl": "intermediate",
    "q": "What can CSS custom properties (`--brand: #333`) do that Sass variables cannot?",
    "o": [
      "Be used in media queries",
      "Change at runtime and cascade — so a theme switch or a JavaScript update re-styles everything that references them, with no rebuild",
      "Store numeric values",
      "Be used inside calc()"
    ],
    "a": 1,
    "x": "A preprocessor variable is substituted at build time and then no longer exists. A custom property is live in the browser: it inherits, can be overridden per element, and can be set from JavaScript with `setProperty`. That is what makes dark mode and runtime theming straightforward."
  }
]);

TD.addMCQ("css", "responsive", [
  {
    "tag": "Mobile-first",
    "lvl": "intermediate",
    "q": "Why write base styles for small screens and use `min-width` media queries to add complexity?",
    "o": [
      "min-width queries are faster to evaluate",
      "The simplest layout becomes the default that always works, and each query adds capability — rather than starting complex and stripping features away",
      "max-width is deprecated",
      "Mobile browsers ignore max-width queries"
    ],
    "a": 1,
    "x": "Mobile-first is an ordering discipline more than a technical requirement. Starting simple means the fallback is always sensible, including on devices you did not anticipate; starting wide means every narrow case is a subtraction you must remember to make. The result is usually less CSS overall."
  }
]);

TD.addMCQ("css", "position", [
  {
    "tag": "Positioning context",
    "lvl": "advanced",
    "q": "`position: absolute` positions an element relative to what?",
    "o": [
      "The browser viewport, always",
      "Its nearest ancestor with a position other than static — or the document if there is none",
      "Its immediate parent, always",
      "The nearest block-level element"
    ],
    "a": 1,
    "x": "This is why `position: relative` on a parent with no offsets is such a common line: it does nothing visually but establishes the positioning context for absolutely positioned children. An absolute element flying to the corner of the page usually means no ancestor was positioned."
  }
]);

TD.addMCQ("css", "motion", [
  {
    "tag": "Animating cheaply",
    "lvl": "advanced",
    "q": "Why animate `transform: translateX()` rather than `left`?",
    "o": [
      "transform supports more units",
      "transform and opacity can be handled by the compositor without recalculating layout, so they stay smooth; animating `left` forces layout on every frame",
      "left cannot be transitioned",
      "transform works in more browsers"
    ],
    "a": 1,
    "x": "Changing `left` triggers layout, paint and composite for every frame. `transform` and `opacity` only need the composite step, which the GPU handles. On a busy page or a low-end phone that is the difference between smooth motion and visible stutter — and it is the single most useful CSS performance rule."
  },
  {
    "tag": "Reduced motion",
    "lvl": "intermediate",
    "q": "Why respect `prefers-reduced-motion`?",
    "o": [
      "It improves page load performance",
      "Vestibular disorders make large motion genuinely nauseating for some users, and the setting is how they ask for less of it",
      "It is required for valid CSS",
      "Search engines rank motion-free pages higher"
    ],
    "a": 1,
    "x": "This is an accessibility requirement rather than a preference. The usual implementation reduces or removes transforms and parallax while keeping essential feedback — a media query that shortens durations to near-zero is a reasonable blanket approach when a finer-grained one is impractical."
  }
]);
