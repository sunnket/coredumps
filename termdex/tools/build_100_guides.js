const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'data', 'guides.js');
let originalContent = fs.readFileSync(filePath, 'utf8');

// The 36 new deeply elaborated guides to reach 100 total guides
const newGuides = [
  {
    id: "push-from-antigravity",
    t: "Push code to GitHub from Antigravity IDE",
    g: "git",
    mins: 6,
    diff: "beginner",
    why: "Antigravity combines AI pair programming with a full development environment. Pushing cleanly means committing human and AI changes atomically while keeping conversation artifacts, IDE cache, and secrets out of your repository.",
    need: [
      "A project open in Google Antigravity IDE",
      "A GitHub account and repository created"
    ],
    steps: [
      {
        do: "Open the built-in terminal in Antigravity IDE.",
        cmd: "Ctrl + `  (or click Terminal -> New Terminal in the top menu)",
        out: "A PowerShell or bash terminal opens in your project root.",
        note: "Antigravity's terminal automatically inherits the active workspace environment, virtualenv, and project directory."
      },
      {
        do: "Add a robust .gitignore to exclude internal Antigravity AI metadata and secrets.",
        cmd: {
          win: "Add-Content .gitignore \"`n.gemini/`nbrain/`nscratch/`n.system_generated/`n.env`nnode_modules/\"",
          mac: "printf \"\\n.gemini/\\nbrain/\\nscratch/\\n.system_generated/\\n.env\\nnode_modules/\\n\" >> .gitignore"
        },
        out: "Updated .gitignore file in the project root.",
        note: "Antigravity stores session logs, temporary conversation artifacts, and system prompts under .gemini and brain/. Never commit these or your API keys to a public GitHub repo."
      },
      {
        do: "Inspect what has changed across your workspace.",
        cmd: "git status",
        out: "A list of untracked and modified files waiting to be committed.",
        note: "Carefully inspect the list. If you see secret files like .env or large binary logs, add them to .gitignore before staging."
      },
      {
        do: "Stage your project code files.",
        cmd: "git add .",
        out: "All modified and new files move to the staging area.",
        note: "You can also stage individual files or folders with `git add src/` to keep your commits atomic and focused."
      },
      {
        do: "Commit with a clear, conventional message summarizing the changes.",
        cmd: "git commit -m \"feat: implement core feature with Antigravity AI pair programming\"",
        out: "Commit hash generated with file change statistics.",
        note: "Antigravity can help draft commit messages, but always follow conventional commit standards (feat:, fix:, chore:, refactor:)."
      },
      {
        do: "Link your local repository to your remote GitHub repository if not already connected.",
        cmd: "git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git",
        out: "No output means success.",
        note: "Verify your connected remote anytime with `git remote -v`."
      },
      {
        do: "Authenticate with GitHub if this is your first push from Antigravity.",
        cmd: "gh auth login",
        out: "Interactive prompt asking for account type and browser authentication.",
        note: "Select 'GitHub.com', 'HTTPS', and log in via browser. Alternatively, Git Credential Manager will pop up an authentication dialog on your first push."
      },
      {
        do: "Push your commits to GitHub and set up remote tracking.",
        cmd: "git push -u origin main",
        out: "Writing objects: 100%, branch 'main' set up to track 'origin/main'.",
        note: "The `-u` flag sets the default upstream branch so all future pushes only require typing `git push`."
      }
    ],
    fix: [
      {
        p: "fatal: Authentication failed for 'https://github.com/...' in Antigravity",
        s: "GitHub stopped accepting password logins. Run `gh auth login` in the Antigravity terminal, or generate a GitHub Personal Access Token (classic) with 'repo' permissions and paste it as your password."
      },
      {
        p: "Accidentally committed .gemini or brain/ folders to Git",
        s: "Untrack them without deleting local files: run `git rm -r --cached .gemini/ brain/`, add them to `.gitignore`, and run `git commit -m 'chore: remove IDE metadata from tracking'`."
      },
      {
        p: "error: src refspec main does not match any",
        s: "Your default local branch may still be called 'master' or you have not made your first commit yet. Run `git branch -M main` followed by `git commit -m 'initial commit'`."
      }
    ],
    next: ["push-from-vscode", "push-terminal-deep", "gitignore-secrets"]
  },

  {
    id: "push-from-vscode",
    t: "Push code to GitHub using VS Code GUI",
    g: "git",
    mins: 5,
    diff: "beginner",
    why: "You do not need to memorize command-line flags to use Git. Visual Studio Code includes a built-in Source Control graphical interface that lets you inspect diffs, stage files, write commit messages, and push to GitHub entirely with mouse clicks.",
    need: [
      "VS Code installed with your project folder opened",
      "Git installed on your operating system",
      "A GitHub account"
    ],
    steps: [
      {
        do: "Open the Source Control view in VS Code.",
        cmd: "Ctrl + Shift + G  (or click the branched source icon in the left Activity Bar)",
        out: "The Source Control sidebar slides open showing your modified files.",
        note: "On macOS, the shortcut is Cmd + Shift + G."
      },
      {
        do: "Review your line-by-line changes visually.",
        out: "Clicking any file in the 'Changes' list opens a side-by-side split diff.",
        note: "Deletions appear in red on the left; additions appear in green on the right. You can even stage individual lines by right-clicking them."
      },
      {
        do: "Stage the files you want to include in this commit.",
        out: "Hover over a file and click the '+' icon (Stage Changes), or click '+' on the 'Changes' header to stage everything.",
        note: "Files move up into the 'Staged Changes' section. Only files in Staged Changes will be included in the commit."
      },
      {
        do: "Type a descriptive commit message in the message box at the top.",
        cmd: "feat: add user authentication and login route",
        out: "The commit message is typed into the box above Staged Changes.",
        note: "Follow the conventional commits pattern: start with a verb in imperative mood (feat:, fix:, docs:, chore:)."
      },
      {
        do: "Click the blue 'Commit' button or press Ctrl + Enter.",
        out: "The staged files disappear and your changes are safely committed locally.",
        note: "On macOS, the commit shortcut is Cmd + Enter."
      },
      {
        do: "Publish or Push your branch to GitHub.",
        out: "Click the blue 'Publish Branch' button (if new repo), or click the circular 'Sync Changes' icon in the blue bottom status bar.",
        note: "The bottom status bar shows outgoing and incoming commit arrows (e.g. 1↑ 0↓)."
      },
      {
        do: "Authorize GitHub in the VS Code popup if prompted.",
        out: "A browser tab opens asking you to sign into GitHub and authorize Visual Studio Code.",
        note: "Once authorized, VS Code securely stores your GitHub credentials and will never ask you again."
      }
    ],
    fix: [
      {
        p: "VS Code displays: 'Make sure you configure your user.name and user.email in git'",
        s: "Open terminal in VS Code (Ctrl + `) and run: `git config --global user.name 'Your Name'` and `git config --global user.email 'your-email@example.com'`."
      },
      {
        p: "The 'Publish Branch' or 'Sync Changes' button spins forever",
        s: "A GitHub credential window might be hidden in the background behind VS Code. Check your OS taskbar or alt-tab to find the GitHub login prompt."
      },
      {
        p: "Merge conflict appears during Sync Changes",
        s: "Conflicting files will show an orange 'C' badge. Click the file, then click the blue 'Resolve in Merge Editor' button at the bottom right to choose Current vs Incoming changes with a single click."
      }
    ],
    next: ["push-from-antigravity", "push-terminal-deep", "diff-before-commit"]
  },

  {
    id: "push-terminal-deep",
    t: "Push code to GitHub from Terminal (Comprehensive)",
    g: "git",
    mins: 8,
    diff: "beginner",
    why: "The terminal is the ultimate universal developer interface. GUI tools can freeze and differ between operating systems, but terminal Git commands work identically across Windows, macOS, Linux servers, and automated cloud CI/CD pipelines.",
    need: [
      "Git installed on your system (`git --version`)",
      "An empty repository created on GitHub"
    ],
    steps: [
      {
        do: "Navigate to your project root and verify the current folder.",
        cmd: { win: "pwd", mac: "pwd" },
        out: "The full path to your project folder.",
        note: "Always confirm your current folder before running git commands so you don't accidentally initialize Git in your home directory."
      },
      {
        do: "Initialize a new Git repository if not already initialized.",
        cmd: "git init",
        out: "Initialized empty Git repository in .../.git/",
        note: "If Git was already initialized, running `git init` is safe and will not overwrite existing history."
      },
      {
        do: "Rename your primary branch to 'main' to match modern GitHub defaults.",
        cmd: "git branch -M main",
        out: "No output means success.",
        note: "Older Git installations defaulted to 'master'. GitHub uses 'main' as standard; aligning them avoids branch mismatch errors."
      },
      {
        do: "Stage all files in your project directory.",
        cmd: "git add .",
        out: "Files staged silently.",
        note: "To exclude files from being staged, ensure you create a `.gitignore` file before running `git add .`."
      },
      {
        do: "Create your initial commit with an informative summary.",
        cmd: "git commit -m \"feat: initial commit with project architecture\"",
        out: "[main (root-commit) 4a1c2e3] feat: initial commit... N files changed, N insertions(+).",
        note: "A commit is a permanent snapshot saved to your local disk. It does not exist on GitHub until you push."
      },
      {
        do: "Check if any remote repository is already configured.",
        cmd: "git remote -v",
        out: "Empty output if none exists, or origin URLs if already added.",
        note: "If an incorrect remote already exists, remove it with `git remote remove origin`."
      },
      {
        do: "Add your GitHub repository as the remote 'origin'.",
        cmd: "git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git",
        out: "No output means success.",
        note: "Substitute your real GitHub username and repository name. You can use HTTPS or SSH (`git@github.com:...`)."
      },
      {
        do: "Push your code to GitHub and set the upstream tracking branch.",
        cmd: "git push -u origin main",
        out: "Enumerating objects... Writing objects: 100%... Branch 'main' set up to track remote branch 'main' from 'origin'.",
        note: "The `-u` (upstream) flag links your local `main` to `origin/main`. Future pushes only require typing `git push`."
      },
      {
        do: "Verify that your local repository and GitHub remote are in sync.",
        cmd: "git status",
        out: "On branch main. Your branch is up to date with 'origin/main'. nothing to commit, working tree clean.",
        note: "You can now open your repository on GitHub.com in any web browser and see all your files, commits, and history."
      }
    ],
    fix: [
      {
        p: "error: failed to push some refs to 'https://github.com/...' (non-fast-forward)",
        s: "The remote repository has commits that you do not have locally (often an auto-generated README, License, or .gitignore created on GitHub). Run `git pull --rebase origin main`, resolve any conflict, and then run `git push`."
      },
      {
        p: "fatal: remote origin already exists",
        s: "You already linked this folder to a remote earlier. Check it with `git remote -v`. Update the URL with `git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPO.git`."
      },
      {
        p: "fatal: Authentication failed for 'https://github.com/...'",
        s: "GitHub does not accept account passwords via command line. When prompted for password, paste a Personal Access Token (classic) with `repo` scope, or install the GitHub CLI and run `gh auth login`."
      }
    ],
    next: ["push-from-antigravity", "push-from-vscode", "git-branch"]
  },

  {
    id: "git-stash-workflow",
    t: "Save unfinished work temporarily with git stash",
    g: "git",
    mins: 5,
    diff: "intermediate",
    why: "You are halfway through a feature when production breaks. You cannot commit broken half-code, but you cannot switch branches with dirty files. Stashing tucks your changes away cleanly so your working tree is pristine.",
    need: ["A git repository with modified, uncommitted files"],
    steps: [
      {
        do: "View uncommitted work that needs stashing.",
        cmd: "git status",
        out: "Shows modified and untracked files.",
        note: "Standard git stash ignores untracked new files unless you pass the `-u` flag."
      },
      {
        do: "Stash changes with a descriptive label.",
        cmd: "git stash push -m \"wip: shopping cart discount calculation\"",
        out: "Saved working directory and index state WIP on main: ...",
        note: "Always name your stash with `-m`. In two weeks, `stash@{0}` means nothing without a label."
      },
      {
        do: "Include newly created untracked files in the stash.",
        cmd: "git stash push -u -m \"wip: cart calculations and new test files\"",
        out: "Saved working directory, index state, and untracked files.",
        note: "The `-u` (untracked) flag ensures brand new files are preserved along with edits to existing files."
      },
      {
        do: "Verify your working directory is now completely clean.",
        cmd: "git status",
        out: "nothing to commit, working tree clean",
        note: "You are now free to switch branches, pull remote changes, or debug an urgent production issue."
      },
      {
        do: "List all stashes saved in the repository.",
        cmd: "git stash list",
        out: "stash@{0}: On main: wip: cart calculations...\nstash@{1}: On main: wip: discount...",
        note: "Stashes act like a stack: the most recently saved stash is always `stash@{0}`."
      },
      {
        do: "Inspect what changes are inside a stash without applying it.",
        cmd: "git stash show -p stash@{0}",
        out: "A full git diff of all modifications stored in that stash entry.",
        note: "The `-p` flag displays the actual code patch rather than just a summary of filenames."
      },
      {
        do: "Restore the stashed work and remove it from the stash stack.",
        cmd: "git stash pop",
        out: "Your modified files are restored back into your working directory and dropped from stash list.",
        note: "If you want to keep the stash entry while restoring, use `git stash apply` instead of `pop`."
      }
    ],
    fix: [
      {
        p: "Conflict when running `git stash pop`",
        s: "The branch you returned to changed lines you had stashed. Git restores the changes and marks conflict blocks with `<<<<<<<`. Resolve the conflicts, run `git add .`, then delete the stash entry manually with `git stash drop`."
      },
      {
        p: "Accidentally dropped or lost a stash",
        s: "Run `git fsck --unreachable | grep commit` to find orphaned commits, then inspect them with `git show <hash>` to recover your stashed code."
      }
    ],
    next: ["git-branch", "git-cherry-pick", "git-conflict"]
  },

  {
    id: "git-cherry-pick",
    t: "Pick specific commits into your branch with cherry-pick",
    g: "git",
    mins: 6,
    diff: "intermediate",
    why: "A teammate fixed an urgent bug on an unmerged feature branch, or you committed a hotfix to the wrong branch. Instead of merging 40 unrelated commits, cherry-pick extracts only the exact commit you need.",
    need: ["Two branches in a git repository", "The commit hash you want to copy"],
    steps: [
      {
        do: "Locate the commit hash you want to copy.",
        cmd: "git log --oneline other-branch -n 5",
        out: "7b2d9e1 fix: prevent null pointer exception in payment token verification",
        note: "Copy the 7-character hexadecimal commit hash at the beginning of the line."
      },
      {
        do: "Switch to the target branch where you want the fix applied.",
        cmd: "git checkout main",
        out: "Switched to branch 'main'.",
        note: "On modern Git (2.23+), you can also use `git switch main`."
      },
      {
        do: "Ensure your target branch is clean and up to date.",
        cmd: "git pull origin main",
        out: "Already up to date.",
        note: "Never cherry-pick into a dirty working tree with uncommitted modifications."
      },
      {
        do: "Cherry-pick the specific commit.",
        cmd: "git cherry-pick 7b2d9e1",
        out: "[main c4a8f21] fix: prevent null pointer exception in payment token verification",
        note: "Notice the new commit has a brand new hash (`c4a8f21`) because its parent commit is different."
      },
      {
        do: "Optionally copy changes into your staging area without committing immediately.",
        cmd: "git cherry-pick -n 7b2d9e1",
        out: "Changes applied to working tree and staged.",
        note: "The `-n` (--no-commit) flag lets you review, edit, or bundle multiple cherry-picks into a single commit."
      },
      {
        do: "Push your updated branch to GitHub.",
        cmd: "git push origin main",
        out: "Writing objects: 100%, commit pushed successfully.",
        note: "The bugfix is now live on main without bringing in any unfinished feature branch code."
      }
    ],
    fix: [
      {
        p: "error: could not apply 7b2d9e1... (conflict)",
        s: "The commit touches code that looks different in your current branch. Open the conflicting files, resolve the `<<<<<<<` conflict markers, stage with `git add .`, and run `git cherry-pick --continue`."
      },
      {
        p: "I changed my mind during a conflict and want to cancel",
        s: "Run `git cherry-pick --abort`. Git cancels the cherry-pick and returns your branch to the exact state before the command was executed."
      }
    ],
    next: ["git-stash-workflow", "git-interactive-rebase", "git-branch"]
  },

  {
    id: "git-interactive-rebase",
    t: "Clean up commit history with interactive rebase",
    g: "git",
    mins: 9,
    diff: "advanced",
    why: "During development, you make 12 messy commits: 'typo', 'wip', 'fix test', 'actually fix test'. Before creating a Pull Request, an interactive rebase collapses them into one clean, professional commit.",
    need: ["A feature branch with multiple local commits"],
    steps: [
      {
        do: "Review your recent local commits to count how many you want to squash.",
        cmd: "git log --oneline -n 6",
        out: "Displays commit hashes and messages from newest to oldest.",
        note: "Count the number of commits you want to clean up (for example, the last 4 commits)."
      },
      {
        do: "Start an interactive rebase for the last N commits.",
        cmd: "git rebase -i HEAD~4",
        out: "An editor opens displaying a list of commands with your 4 commits.",
        note: "In the rebase list, commits are ordered from OLDEST at the top to NEWEST at the bottom (opposite of git log)."
      },
      {
        do: "Configure squashing in the rebase editor.",
        out: "Leave the first line as 'pick', change the other 3 lines below it from 'pick' to 'squash' (or 's').",
        note: "'squash' fuses that commit into the commit directly above it."
      },
      {
        do: "Save and close the editor.",
        cmd: ":wq (in vim) or Ctrl+S then close tab (in VS Code)",
        out: "Git automatically opens a second editor screen to write the combined commit message.",
        note: "Delete the scratch commit messages ('typo', 'wip') and write one cohesive Conventional Commit message."
      },
      {
        do: "Save the final commit message.",
        out: "Successfully rebased and updated refs/heads/feature-branch.",
        note: "All 4 commits are now combined into 1 single, clean commit."
      },
      {
        do: "Verify your clean commit history.",
        cmd: "git log --oneline -n 3",
        out: "Shows your single polished commit atop main.",
        note: "The git log is now tidy and ready for code review."
      },
      {
        do: "Push safely to your remote branch.",
        cmd: "git push --force-with-lease origin feature-branch",
        out: "Forced update of feature branch.",
        note: "Always use `--force-with-lease` instead of `--force`. It refuses to overwrite remote changes if a teammate pushed while you were rebasing."
      }
    ],
    fix: [
      {
        p: "I made a mistake in the editor and want to abort completely",
        s: "Run `git rebase --abort`. Your repository immediately returns to the exact state prior to starting the rebase."
      },
      {
        p: "Never rebase commits that have already been merged into main",
        s: "Interactive rebase rewrites commit hashes. Only rebase private feature branches before they are merged into shared branches."
      }
    ],
    next: ["github-pull-request", "push-terminal-deep"]
  },

  {
    id: "github-pull-request",
    t: "Create, review, and merge a GitHub Pull Request",
    g: "git",
    mins: 7,
    diff: "beginner",
    why: "Pull Requests are how real engineering teams collaborate. They allow teammates and automated CI checks to review, test, and comment on code before it touches production.",
    need: ["A pushed feature branch on GitHub", "A GitHub repository with a main branch"],
    steps: [
      {
        do: "Create a feature branch and switch to it.",
        cmd: "git checkout -b feat/user-avatars",
        out: "Switched to a new branch 'feat/user-avatars'.",
        note: "Always branch off the latest main branch."
      },
      {
        do: "Write code, stage, and commit your changes.",
        cmd: "git commit -am \"feat: upload and resize custom user avatars\"",
        out: "[feat/user-avatars 9e3a1f2] feat: upload and resize custom user avatars",
        note: "The `-am` shortcut stages tracked modified files and commits in one command."
      },
      {
        do: "Push your feature branch to GitHub.",
        cmd: "git push -u origin feat/user-avatars",
        out: "Total N, delta N... Create a pull request for 'feat/user-avatars' on GitHub by visiting...",
        note: "GitHub outputs a direct link in the terminal to create the Pull Request with one click."
      },
      {
        do: "Create the Pull Request using GitHub CLI (or open the link in browser).",
        cmd: "gh pr create --title \"feat: custom user avatars\" --body \"Implements client-side avatar resizing and cloud upload.\"",
        out: "https://github.com/USERNAME/REPO/pull/14",
        note: "The GitHub CLI creates the PR instantly without opening a browser tab."
      },
      {
        do: "Fill in the Pull Request description template.",
        out: "Provide: 1. What was changed, 2. Why it was needed, 3. How to manually test.",
        note: "Attach screenshots or recordings for any UI changes so reviewers can visualize the impact."
      },
      {
        do: "Verify automated CI status checks.",
        out: "GitHub Actions runs tests, linters, and build checks; all show green checkmarks.",
        note: "Never merge a Pull Request with failing status checks."
      },
      {
        do: "Merge the Pull Request using 'Squash and merge'.",
        cmd: "gh pr merge --squash --delete-branch",
        out: "Squashed and merged pull request #14, deleted branch feat/user-avatars.",
        note: "Squash and merge combines all branch commits into a single commit on main and cleans up the remote branch."
      }
    ],
    fix: [
      {
        p: "'This branch has conflicts that must be resolved'",
        s: "Update your branch from main: `git checkout feat/user-avatars`, run `git merge origin/main`, resolve conflicts locally, test, and push."
      },
      {
        p: "'Review required before merging'",
        s: "Branch protection rules are active. Request a review from a teammate using the Reviewers menu on the right side of the PR page."
      }
    ],
    next: ["github-actions-ci", "github-cli-mastery", "husky-commit-hooks"]
  },

  {
    id: "git-lfs-large-files",
    t: "Track large model weights and datasets with Git LFS",
    g: "git",
    mins: 6,
    diff: "intermediate",
    why: "Standard Git bloats dramatically when storing binary files (AI weights, datasets, video, zip). GitHub blocks any single file over 100MB. Git Large File Storage (LFS) replaces large files with lightweight text pointers.",
    need: ["Git installed", "A project containing files over 50MB (e.g. .onnx, .bin, .parquet)"],
    steps: [
      {
        do: "Download and install Git LFS once on your system.",
        cmd: "git lfs install",
        out: "Git LFS initialized.",
        note: "You only need to run this command once per machine."
      },
      {
        do: "Tell Git LFS which file extensions to track as large assets.",
        cmd: "git lfs track \"*.onnx\" \"*.pt\" \"*.parquet\" \"*.bin\"",
        out: "Tracking \"*.onnx\", Tracking \"*.pt\"...",
        note: "Git LFS records these rules inside a special `.gitattributes` configuration file."
      },
      {
        do: "Inspect the created .gitattributes file.",
        cmd: { win: "Get-Content .gitattributes", mac: "cat .gitattributes" },
        out: "*.onnx filter=lfs diff=lfs merge=lfs -text\n*.pt filter=lfs diff=lfs merge=lfs -text",
        note: "This configuration instructs Git to substitute binary content with hash pointers."
      },
      {
        do: "Always commit .gitattributes before adding large files.",
        cmd: "git add .gitattributes && git commit -m \"chore: configure Git LFS tracking\"",
        out: "Committed .gitattributes.",
        note: "If you add the large file before committing `.gitattributes`, Git will attempt to store it as a regular file."
      },
      {
        do: "Add and commit your large binary model file normally.",
        cmd: "git add model.onnx && git commit -m \"feat: add quantized speech recognition model\"",
        out: "File committed smoothly.",
        note: "Git commits the lightweight pointer file locally in milliseconds."
      },
      {
        do: "Verify the file is tracked by LFS and not standard Git.",
        cmd: "git lfs ls-files",
        out: "e3b0c44... * model.onnx",
        note: "An asterisk indicates the file is successfully managed by Git LFS."
      },
      {
        do: "Push to GitHub as usual.",
        cmd: "git push origin main",
        out: "Uploading LFS objects: 100% (1/1), 140 MB | ... MB/s, done.\nWriting objects: 100%...",
        note: "The binary payload is uploaded to GitHub's LFS storage, while your git commit history stays tiny."
      }
    ],
    fix: [
      {
        p: "remote: error: File model.pt is 142 MB; this exceeds GitHub's file size limit of 100.00 MB",
        s: "The file was already committed to standard Git history before LFS tracking was enabled. Run `git lfs migrate import --include='*.pt'`, then push again."
      },
      {
        p: "git lfs: command not found",
        s: "Install Git LFS on Windows with `winget install GitHub.GitLFS` or macOS with `brew install git-lfs`."
      }
    ],
    next: ["push-to-github", "embeddings-search"]
  },

  {
    id: "github-cli-mastery",
    t: "Control GitHub from your terminal with gh CLI",
    g: "tools",
    mins: 6,
    diff: "beginner",
    why: "Context switching between your IDE, terminal, and browser tab to check PRs or create repositories destroys focus. The GitHub CLI (`gh`) puts 90% of GitHub's web features right into your shell.",
    need: ["GitHub account", "gh CLI installed (`winget install GitHub.cli` or `brew install gh`)"],
    steps: [
      {
        do: "Authenticate your terminal with your GitHub account.",
        cmd: "gh auth login",
        out: "Interactive menu asking for account type and preferred protocol.",
        note: "Select 'GitHub.com', 'HTTPS', authenticate with a web browser, and enter the one-time code."
      },
      {
        do: "Create a brand new GitHub repository and push your current folder in one step.",
        cmd: "gh repo create my-app --public --source=. --remote=origin --push",
        out: "Created repository USERNAME/my-app on GitHub, pushed to origin.",
        note: "This replaces: opening browser, clicking New Repo, typing name, copying URL, running remote add, and pushing."
      },
      {
        do: "Clone any repository directly without hunting for URLs.",
        cmd: "gh repo clone vercel/next.js",
        out: "Cloning into 'next.js'...",
        note: "No need to copy HTTPS or SSH links; `owner/repo` syntax works everywhere."
      },
      {
        do: "List open Pull Requests on the current project.",
        cmd: "gh pr list",
        out: "Displays PR numbers, titles, branch names, and status tags.",
        note: "Filter by author, reviewer, or label: `gh pr list --author '@me'`."
      },
      {
        do: "Checkout a teammate's Pull Request locally to test it.",
        cmd: "gh pr checkout 42",
        out: "Switched to branch 'feat/auth-update'.",
        note: "Automatically fetches the remote branch, configures tracking, and switches to it in one command."
      },
      {
        do: "View the diff of a Pull Request in your terminal.",
        cmd: "gh pr diff 42",
        out: "Colorized git diff of all changes in that PR.",
        note: "Pipe to less or review side-by-side with your favorite diff tool."
      },
      {
        do: "Create an official GitHub Release with a binary asset attached.",
        cmd: "gh release create v1.0.0 --title \"v1.0.0 Release\" --notes \"Production release\" dist.zip",
        out: "https://github.com/USERNAME/REPO/releases/tag/v1.0.0",
        note: "Generates git tag, creates release notes, and uploads your distribution zip."
      }
    ],
    fix: [
      {
        p: "'gh: command not found'",
        s: "Install the official GitHub CLI: Windows `winget install --id GitHub.cli`, macOS `brew install gh`, Linux `sudo apt install gh`. Restart your terminal."
      },
      {
        p: "Authentication token expired or insufficient permissions",
        s: "Run `gh auth refresh -h github.com -s repo,read:org` to re-authorize with extended scopes."
      }
    ],
    next: ["github-pull-request", "push-terminal-deep"]
  },

  {
    id: "husky-commit-hooks",
    t: "Block bad commits with Husky and lint-staged",
    g: "tools",
    mins: 7,
    diff: "intermediate",
    why: "Nobody likes finding out a build failed on GitHub Actions because of a missing semicolon or formatting error. Husky runs your linter and formatter on changed files before the commit is ever created.",
    need: ["Node.js project with a package.json", "Git initialized in the folder"],
    steps: [
      {
        do: "Install husky and lint-staged as development dependencies.",
        cmd: "npm install -D husky lint-staged",
        out: "added 2 packages...",
        note: "Husky manages Git hooks; lint-staged ensures you only lint modified files, not your entire 100,000-line codebase."
      },
      {
        do: "Initialize Husky in your project.",
        cmd: "npx husky init",
        out: "Created .husky/ directory and added prepare script to package.json.",
        note: "The `prepare: \"husky\"` script guarantees teammates automatically configure git hooks when running `npm install`."
      },
      {
        do: "Add a lint-staged configuration block inside package.json.",
        out: "Add: \"lint-staged\": { \"*.{js,ts,jsx,tsx}\": [\"prettier --write\", \"eslint --fix\"] }",
        note: "Prettier formats the code cleanly; ESLint checks for syntax and logic errors."
      },
      {
        do: "Configure the pre-commit hook to execute lint-staged.",
        cmd: {
          win: "Set-Content .husky/pre-commit \"npx lint-staged\"",
          mac: "echo \"npx lint-staged\" > .husky/pre-commit"
        },
        out: ".husky/pre-commit updated.",
        note: "Git executes this shell script automatically whenever `git commit` is invoked."
      },
      {
        do: "Test your hook by creating a commit.",
        cmd: "git commit -m \"test: verify automated pre-commit hook\"",
        out: "[STARTED] Preparing lint-staged...\n[STARTED] Running tasks for *.{js,ts}...\n[SUCCESS] lint-staged completed.",
        note: "If any linter error exists, the commit is aborted before Git writes anything to disk."
      }
    ],
    fix: [
      {
        p: "Commit rejected because of ESLint error",
        s: "Husky did its job! Check the terminal line numbers for the syntax error, fix the code, run `git add .`, and commit again."
      },
      {
        p: "Need to bypass the pre-commit hook in an emergency hotfix",
        s: "Pass the `--no-verify` flag: `git commit -m 'urgent hotfix' --no-verify`."
      }
    ],
    next: ["format-lint", "github-actions-ci"]
  },

  {
    id: "setup-nextjs-app",
    t: "Initialize a production Next.js App Router project",
    g: "start",
    mins: 6,
    diff: "beginner",
    why: "Next.js is the standard React framework for modern fullstack applications. Using create-next-app with TypeScript, Tailwind CSS, and App Router gives you server components, SEO metadata, and API routes out of the box.",
    need: ["Node.js 18.17+ installed (`node -v`)"],
    steps: [
      {
        do: "Run the official Next.js project bootstrapper.",
        cmd: "npx create-next-app@latest my-app --typescript --tailwind --eslint --app --src-dir --import-alias \"@/*\"",
        out: "Creating a new Next.js app in .../my-app. Installing dependencies...",
        note: "Passing these flags avoids interactive prompts and configures production best practices automatically."
      },
      {
        do: "Navigate into your new application directory.",
        cmd: "cd my-app",
        out: "Current directory is my-app.",
        note: "Verify files: `src/app/page.tsx`, `src/app/layout.tsx`, `tailwind.config.ts`, `tsconfig.json`."
      },
      {
        do: "Start the local Next.js development server.",
        cmd: "npm run dev",
        out: "▲ Next.js 14.x.x\n- Local: http://localhost:3000\n- Ready in 1200ms",
        note: "Next.js uses Turbo/Webpack to compile pages on-demand only when they are requested."
      },
      {
        do: "Open the site in your browser to verify the welcome page.",
        cmd: { win: "Start-Process http://localhost:3000", mac: "open http://localhost:3000" },
        out: "Browser opens displaying the Next.js starter page.",
        note: "Check the terminal: each page compile status appears with its render time."
      },
      {
        do: "Edit src/app/page.tsx to test Fast Refresh.",
        out: "Save changes in page.tsx and watch your browser update instantly without reloading the page.",
        note: "React Fast Refresh preserves client component state during code edits."
      },
      {
        do: "Validate that the production build compiles without type errors.",
        cmd: "npm run build",
        out: "✓ Generating static pages (5/5)\n✓ Finalizing page optimization...",
        note: "Always run `npm run build` locally before pushing to catch TypeScript and routing errors."
      }
    ],
    fix: [
      {
        p: "Port 3000 is already in use",
        s: "Next.js will offer to use port 3001, or pass a custom port: `npm run dev -- -p 4000`."
      },
      {
        p: "Cannot find module '@/components/...' or path alias fails",
        s: "Check `tsconfig.json` compilerOptions: ensure `\"paths\": { \"@/*\": [\"./src/*\"] }` is defined."
      }
    ],
    next: ["setup-tailwind-css", "deploy-static", "env-vars"]
  },

  {
    id: "setup-vite-react",
    t: "Build a lightning-fast React app with Vite and TypeScript",
    g: "start",
    mins: 5,
    diff: "beginner",
    why: "Old tools like Create React App take 30 seconds to start and reload slowly. Vite uses native ES modules in development, booting in 200 milliseconds with instantaneous hot module replacement.",
    need: ["Node.js installed (`node -v`)", "npm or pnpm"],
    steps: [
      {
        do: "Scaffold a fresh Vite project with React and TypeScript.",
        cmd: "npm create vite@latest my-react-app -- --template react-ts",
        out: "Scaffolding project in .../my-react-app... Done.",
        note: "The `--template react-ts` flag configures strict TypeScript and React 18+ instantly."
      },
      {
        do: "Navigate into the created folder.",
        cmd: "cd my-react-app",
        out: "Current directory is my-react-app.",
        note: "Inspect `index.html` at the project root — in Vite, `index.html` is the entry point."
      },
      {
        do: "Install the project dependencies.",
        cmd: "npm install",
        out: "added N packages in 4s",
        note: "Installs `react`, `react-dom`, `@types/react`, and Vite development plugins."
      },
      {
        do: "Start the lightning-fast development server.",
        cmd: "npm run dev",
        out: "VITE v5.x.x  ready in 210 ms\n➜  Local:   http://localhost:5173/",
        note: "Vite uses native browser ES modules, so server start time is independent of codebase size."
      },
      {
        do: "Open http://localhost:5173 in your browser.",
        cmd: { win: "Start-Process http://localhost:5173", mac: "open http://localhost:5173" },
        out: "Vite + React interactive counter page appears.",
        note: "Try clicking the counter button, then edit `src/App.tsx` — notice the count state is preserved across edits!"
      },
      {
        do: "Build the optimized production bundle.",
        cmd: "npm run build",
        out: "vite v5.x.x building for production...\ndist/index.html\ndist/assets/index-xxx.js",
        note: "Rollup bundles and tree-shakes your code into pure static assets inside the `dist/` directory."
      }
    ],
    fix: [
      {
        p: "Uncaught ReferenceError: process is not defined",
        s: "Vite runs in standard browser modules. Replace `process.env.VITE_VAR` with `import.meta.env.VITE_VAR`. Note that custom env vars must start with the `VITE_` prefix."
      },
      {
        p: "Adding path alias '@/...' causes error",
        s: "Install `vite-tsconfig-paths`: `npm install -D vite-tsconfig-paths`, and add `plugins: [react(), tsconfigPaths()]` inside `vite.config.ts`."
      }
    ],
    next: ["setup-tailwind-css", "deploy-static", "setup-typescript"]
  },

  {
    id: "setup-tailwind-css",
    t: "Add Tailwind CSS to any modern web project",
    g: "tools",
    mins: 6,
    diff: "beginner",
    why: "Writing vanilla CSS files leads to naming fatigue and dead stylesheet bloat. Tailwind provides curated utility classes that compile down to only the exact CSS rules your project actually uses.",
    need: ["A web project with package.json (Vite, Next.js, or HTML)"],
    steps: [
      {
        do: "Install Tailwind CSS and PostCSS tools as development dependencies.",
        cmd: "npm install -D tailwindcss postcss autoprefixer",
        out: "added 3 packages...",
        note: "Autoprefixer automatically adds vendor prefixes (`-webkit-`, `-moz-`) to modern CSS properties."
      },
      {
        do: "Generate the Tailwind and PostCSS configuration files.",
        cmd: "npx tailwindcss init -p",
        out: "Created Tailwind CSS config file: tailwind.config.js\nCreated PostCSS config file: postcss.config.js",
        note: "The `-p` flag creates `postcss.config.js` alongside `tailwind.config.js`."
      },
      {
        do: "Configure the template paths inside tailwind.config.js.",
        out: "Set content: [\"./index.html\", \"./src/**/*.{js,ts,jsx,tsx}\"]",
        note: "Tailwind scans these files to discover which utility classes you used in your code."
      },
      {
        do: "Add the Tailwind directives to the top of your main CSS file (src/index.css).",
        out: "@tailwind base;\n@tailwind components;\n@tailwind utilities;",
        note: "These three lines inject Tailwind's reset styles and utility classes."
      },
      {
        do: "Test Tailwind utility classes in your markup.",
        out: "<h1 class=\"text-4xl font-extrabold text-indigo-600 hover:text-indigo-800 transition tracking-tight\">Tailwind Works!</h1>",
        note: "Combine layout, spacing, typography, and hover state utilities directly in class names."
      },
      {
        do: "Run your development server and check the styled result.",
        cmd: "npm run dev",
        out: "Styled heading displays with indigo color and smooth transition hover effect.",
        note: "In production builds, Tailwind purges all unused classes, producing tiny stylesheets (typically < 10KB)."
      }
    ],
    fix: [
      {
        p: "Tailwind classes do not apply any styles",
        s: "Verify the `content` array in `tailwind.config.js`. If your source files live in a folder not covered by your glob patterns (e.g. `./components/`), Tailwind will not scan them."
      },
      {
        p: "Unknown at-rule @tailwind warning in VS Code",
        s: "Install the official 'Tailwind CSS IntelliSense' extension, or change CSS validation settings in VS Code to ignore unknown at-rules."
      }
    ],
    next: ["setup-vite-react", "setup-nextjs-app"]
  },

  {
    id: "setup-typescript",
    t: "Add TypeScript to a JavaScript project without pain",
    g: "tools",
    mins: 7,
    diff: "intermediate",
    why: "JavaScript lets you access properties on `undefined` and only tells you in production at 3am. TypeScript catches type errors, broken arguments, and missing props right inside your editor as you type.",
    need: ["A JavaScript project with package.json"],
    steps: [
      {
        do: "Install TypeScript and Node type declarations as devDependencies.",
        cmd: "npm install -D typescript @types/node",
        out: "added 2 packages...",
        note: "@types/node provides types for Node built-ins like `process`, `fs`, and `path`."
      },
      {
        do: "Generate a standard tsconfig.json configuration file.",
        cmd: "npx tsc --init",
        out: "Created a new tsconfig.json with recommended settings.",
        note: "The generated file includes comments explaining every compiler option."
      },
      {
        do: "Enable modern, practical compiler options in tsconfig.json.",
        out: "Ensure: \"target\": \"ES2022\", \"moduleResolution\": \"bundler\", \"strict\": true, \"skipLibCheck\": true",
        note: "`skipLibCheck: true` prevents third-party node_modules from failing your local build."
      },
      {
        do: "Rename a single JavaScript file to TypeScript to start migrating.",
        cmd: { win: "Rename-Item src/utils.js utils.ts", mac: "mv src/utils.js src/utils.ts" },
        out: "File renamed to utils.ts.",
        note: "Never rename your whole project at once. Convert utilities first, then services, then components."
      },
      {
        do: "Add explicit types to function parameters.",
        out: "function formatCurrency(amount: number, currency: string = 'USD'): string { ... }",
        note: "TypeScript infers return types automatically, but function parameters require explicit types in strict mode."
      },
      {
        do: "Run the TypeScript compiler in typecheck mode.",
        cmd: "npx tsc --noEmit",
        out: "Zero errors if your types match, or detailed filename and line numbers where types mismatch.",
        note: "`--noEmit` performs a fast typecheck without writing any compiled JavaScript files to disk."
      },
      {
        do: "Add a typecheck script to package.json.",
        out: "Add to scripts: \"typecheck\": \"tsc --noEmit\"",
        note: "Now you or CI can verify types anytime by running `npm run typecheck`."
      }
    ],
    fix: [
      {
        p: "Could not find a declaration file for module 'xyz'",
        s: "Install community DefinitelyTyped definitions: `npm install -D @types/xyz`. If no `@types` package exists, create a `declarations.d.ts` file containing `declare module 'xyz';`."
      },
      {
        p: "Dozens of 'any' type errors appear after enabling strict mode",
        s: "Set `\"noImplicitAny\": false` temporarily while migrating, and re-enable it once core files are typed."
      }
    ],
    next: ["setup-nextjs-app", "setup-vite-react"]
  },

  {
    id: "pnpm-bun-package-managers",
    t: "Switch to high-speed package managers: pnpm and bun",
    g: "env",
    mins: 6,
    diff: "intermediate",
    why: "Standard npm downloads redundant duplicate packages across every project on your hard drive, filling gigabytes of disk. `pnpm` shares packages globally via hard links, while `bun` installs dependencies 10x faster.",
    need: ["Node.js installed"],
    steps: [
      {
        do: "Enable pnpm using Corepack (built into modern Node.js).",
        cmd: "corepack enable && corepack prepare pnpm@latest --activate",
        out: "Preparing pnpm@latest... Activated.",
        note: "Corepack manages package manager versions without needing global npm installs."
      },
      {
        do: "Or install Bun for ultra-fast JavaScript runtime and package manager.",
        cmd: {
          win: "powershell -c \"irm bun.sh/install.ps1 | iex\"",
          mac: "curl -fsSL https://bun.sh/install | bash"
        },
        out: "Bun was installed successfully.",
        note: "Bun is written in Zig and replaces Node, npm, and npx with a single binary."
      },
      {
        do: "Install project dependencies using pnpm.",
        cmd: "pnpm install",
        out: "Packages are hard linked from the content-addressable store to the virtual store. Progress: 100%.",
        note: "If 10 projects use React 18, pnpm only stores React 18 ONCE on your hard drive."
      },
      {
        do: "Or install dependencies using bun.",
        cmd: "bun install",
        out: "Saved lockfile bun.lockb. Installed 480 packages in 420ms.",
        note: "Bun reads binary lockfiles and parallelizes network calls at system level."
      },
      {
        do: "Run project scripts directly without typing 'run'.",
        cmd: "pnpm dev  (or bun dev)",
        out: "Starts your dev script instantly.",
        note: "Both pnpm and bun eliminate the need to type `npm run dev`."
      },
      {
        do: "Prune unused packages from the global pnpm store to reclaim disk space.",
        cmd: "pnpm store prune",
        out: "Removed N unreferenced packages from store.",
        note: "Frees up gigabytes of unused packages from old deleted projects."
      }
    ],
    fix: [
      {
        p: "ERR_PNPM_PEER_DEP_ISSUES: Unmet peer dependencies",
        s: "pnpm is strict about peer dependencies. Add `auto-install-peers=true` to an `.npmrc` file in your project root."
      },
      {
        p: "Module not found in pnpm that worked in npm",
        s: "npm hoists dependencies flat, allowing code to import undeclared transitive packages. In pnpm, you must explicitly declare any imported package in `package.json`."
      }
    ],
    next: ["npm-basics", "monorepo-workspaces"]
  },

  {
    id: "monorepo-workspaces",
    t: "Manage multi-package monorepos with workspaces",
    g: "env",
    mins: 8,
    diff: "advanced",
    why: "Instead of managing 5 separate repositories with duplicated configs and publishing internal packages to npm just to share code, a monorepo keeps your frontend, backend, and shared types in a single repository.",
    need: ["npm 7+ or pnpm installed"],
    steps: [
      {
        do: "Create a root folder and initialize private workspace package.json.",
        cmd: {
          win: "New-Item -ItemType Directory my-monorepo; Set-Location my-monorepo; '{\"private\": true, \"workspaces\": [\"apps/*\", \"packages/*\"]}' | Out-File -Encoding utf8 package.json",
          mac: "mkdir my-monorepo && cd my-monorepo && echo '{\"private\": true, \"workspaces\": [\"apps/*\", \"packages/*\"]}' > package.json"
        },
        out: "package.json created with workspaces config.",
        note: "`\"private\": true` ensures the root folder is never accidentally published to npm."
      },
      {
        do: "Create workspace subdirectories.",
        cmd: {
          win: "New-Item -ItemType Directory -Force apps/web, apps/api, packages/shared-types",
          mac: "mkdir -p apps/web apps/api packages/shared-types"
        },
        out: "Directory structure created.",
        note: "`apps/` contains deployable applications; `packages/` contains shared libraries and utilities."
      },
      {
        do: "Define a shared types package in packages/shared-types/package.json.",
        out: "Set name to \"@repo/types\" and version to \"1.0.0\".",
        note: "Scoped package names like `@repo/...` make internal imports clean and unambiguous."
      },
      {
        do: "Reference @repo/types inside apps/web/package.json.",
        out: "Add to dependencies: \"@repo/types\": \"workspace:*\" (pnpm) or \"*\" (npm).",
        note: "The package manager symlinks the local folder directly — no npm publish required!"
      },
      {
        do: "Run install from the monorepo root.",
        cmd: "pnpm install  (or npm install)",
        out: "Symlinks created across all workspace packages.",
        note: "All shared dependencies are hoisted to the root `node_modules` for deduplication."
      },
      {
        do: "Import shared code inside your web app.",
        out: "import { UserProfile } from \"@repo/types\";",
        note: "Changes made in `packages/shared-types` are reflected instantly in your apps without rebuilding."
      },
      {
        do: "Run build or test scripts across all workspaces simultaneously.",
        cmd: "pnpm -r build  (or npm run build --workspaces)",
        out: "Executes build script inside every package containing a build script.",
        note: "Use `-r` (recursive) in pnpm to execute scripts across all workspaces."
      }
    ],
    fix: [
      {
        p: "Cannot find module '@repo/types' or types are missing",
        s: "Run `npm install` from the monorepo root (not from inside the app folder) so the symlink is created in root `node_modules`."
      },
      {
        p: "Version mismatch across shared dependencies",
        s: "Use a monorepo orchestration tool like Turborepo (`npx turbo`) to manage build caching, task dependencies, and pipeline execution."
      }
    ],
    next: ["pnpm-bun-package-managers", "setup-typescript"]
  },

  {
    id: "local-https-mkcert",
    t: "Run localhost with real HTTPS and valid SSL using mkcert",
    g: "web",
    mins: 6,
    diff: "intermediate",
    why: "Modern browser APIs like Camera, Microphone, Geolocation, HTTP/2, and secure cookies (`SameSite=None; Secure`) are blocked on plain HTTP. `mkcert` creates locally trusted SSL certificates with zero browser security warnings.",
    need: ["Administrative terminal access to install root CA"],
    steps: [
      {
        do: "Install mkcert using your system package manager.",
        cmd: {
          win: "winget install FiloSottile.mkcert",
          mac: "brew install mkcert"
        },
        out: "mkcert installed successfully.",
        note: "mkcert is a simple zero-config tool that creates locally-trusted certificates using your own private CA."
      },
      {
        do: "Install the local certificate authority into your operating system trust store.",
        cmd: "mkcert -install",
        out: "The local CA is now installed in the system trust store! ⚡",
        note: "This generates a private Certificate Authority that your browsers (Chrome, Edge, Safari, Firefox) trust automatically."
      },
      {
        do: "Generate certificates for localhost and local IP addresses.",
        cmd: "mkcert localhost 127.0.0.1 ::1",
        out: "Created a new certificate valid for the following names: - \"localhost\" - \"127.0.0.1\"\nThe certificate is at \"./localhost.pem\" and the key at \"./localhost-key.pem\"",
        note: "Generates two files: the public certificate (`localhost.pem`) and the private key (`localhost-key.pem`)."
      },
      {
        do: "Configure your local dev server (Vite) to use the certificates.",
        out: "In vite.config.ts: server: { https: { key: './localhost-key.pem', cert: './localhost.pem' } }",
        note: "Or in Node.js HTTPS server: `https.createServer({ key, cert }, app).listen(3000)`."
      },
      {
        do: "Start your dev server and navigate to https://localhost:5173.",
        cmd: { win: "Start-Process https://localhost:5173", mac: "open https://localhost:5173" },
        out: "Your web application loads with a valid green SSL padlock in the address bar.",
        note: "No 'Your connection is not private' red warning screen!"
      }
    ],
    fix: [
      {
        p: "Firefox still displays 'Warning: Potential Security Risk Ahead'",
        s: "Firefox maintains an independent certificate store. Close Firefox completely and re-run `mkcert -install` in your terminal."
      },
      {
        p: "Accidentally committed .pem private key files to git",
        s: "Add `*.pem` and `*.key` to `.gitignore` immediately: `echo \"*.pem\" >> .gitignore`. Never commit private keys to GitHub."
      }
    ],
    next: ["run-local-server", "cors-explained"]
  },

  {
    id: "jwt-auth-flow",
    t: "Implement JWT Access and Refresh Tokens in an API",
    g: "api",
    mins: 8,
    diff: "intermediate",
    why: "Storing sessions in server memory doesn't scale across multiple servers. JSON Web Tokens (JWT) allow stateless, cryptographically signed user authentication with short-lived access tokens and secure refresh cookies.",
    need: ["Node.js API project (Express or Fastify)", "`jsonwebtoken` package installed"],
    steps: [
      {
        do: "Install jsonwebtoken and cookie-parser dependencies.",
        cmd: "npm install jsonwebtoken cookie-parser && npm install -D @types/jsonwebtoken @types/cookie-parser",
        out: "added packages...",
        note: "Access tokens are transmitted via Authorization headers; refresh tokens are stored in HttpOnly cookies to prevent XSS attacks."
      },
      {
        do: "Define secret keys in your .env configuration.",
        out: "JWT_ACCESS_SECRET=\"secret-key-1\"\nJWT_REFRESH_SECRET=\"secret-key-2\"",
        note: "Never reuse the same secret for both access and refresh tokens."
      },
      {
        do: "Generate tokens upon successful user login.",
        out: "const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });\nconst refreshToken = jwt.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });",
        note: "Keep access tokens short-lived (15 minutes). If an access token is leaked, damage is limited."
      },
      {
        do: "Send the refresh token in a secure HttpOnly cookie.",
        out: "res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 7 * 24 * 60 * 60 * 1000 });\nres.json({ accessToken });",
        note: "`httpOnly: true` prevents browser JavaScript from reading the cookie, stopping XSS token theft."
      },
      {
        do: "Create an authentication middleware to verify access tokens.",
        out: "const auth = (req, res, next) => { const token = req.headers.authorization?.split(' ')[1]; if (!token) return res.sendStatus(401); jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, user) => { if (err) return res.sendStatus(403); req.user = user; next(); }); };",
        note: "Attach this middleware to any protected route: `app.get('/api/profile', auth, ...)`."
      },
      {
        do: "Build a /api/refresh endpoint to issue fresh access tokens.",
        out: "Verify req.cookies.refreshToken against JWT_REFRESH_SECRET and return a fresh 15-minute accessToken.",
        note: "When the access token expires, frontend clients call this refresh endpoint silently in the background."
      }
    ],
    fix: [
      {
        p: "TokenExpiredError: jwt expired",
        s: "This is expected when the 15-minute token ends. Configure an HTTP interceptor (like Axios interceptors) on the frontend to automatically call `/api/refresh` and retry the original request."
      },
      {
        p: "Never store passwords or sensitive data in JWT payload",
        s: "JWT payloads are base64-encoded strings, not encrypted! Anyone with the token can decode the payload. Only store non-sensitive IDs and roles."
      }
    ],
    next: ["api-auth-tokens", "first-api-express"]
  },

  {
    id: "websocket-realtime",
    t: "Build real-time bidirectional messaging with WebSockets",
    g: "api",
    mins: 7,
    diff: "intermediate",
    why: "HTTP request-response forces the client to poll the server repeatedly. WebSockets maintain an open, full-duplex TCP connection, allowing the server to push chat messages, stock tickers, or notifications instantly.",
    need: ["Node.js server environment"],
    steps: [
      {
        do: "Install the standard high-performance 'ws' library.",
        cmd: "npm install ws && npm install -D @types/ws",
        out: "added ws package...",
        note: "`ws` is the battle-tested, lightweight WebSocket server implementation for Node.js."
      },
      {
        do: "Create a WebSocket server listening on a port.",
        out: "import { WebSocketServer } from 'ws';\nconst wss = new WebSocketServer({ port: 8080 });",
        note: "Or attach to an existing HTTP server: `new WebSocketServer({ server: httpServer })`."
      },
      {
        do: "Handle incoming client connections.",
        out: "wss.on('connection', (ws) => {\n  console.log('Client connected');\n  ws.send(JSON.stringify({ type: 'welcome', text: 'Connected to server' }));\n});",
        note: "Each connected client gets its own `ws` socket instance."
      },
      {
        do: "Handle incoming messages and broadcast to other clients.",
        out: "ws.on('message', (data) => {\n  wss.clients.forEach(client => {\n    if (client.readyState === 1) client.send(data);\n  });\n});",
        note: "`client.readyState === 1` means the socket is in the `OPEN` state."
      },
      {
        do: "Connect from the browser using the native WebSocket API.",
        out: "const ws = new WebSocket('ws://localhost:8080');\nws.onmessage = (e) => console.log('Message from server:', e.data);\nws.onopen = () => ws.send('Hello from client!');",
        note: "Native WebSockets require zero client libraries in modern browsers."
      },
      {
        do: "Implement heartbeat ping-pong to keep connection alive.",
        out: "setInterval(() => wss.clients.forEach(ws => ws.ping()), 30000);",
        note: "Prevents cloud load balancers and routers from terminating idle connections after 60 seconds."
      }
    ],
    fix: [
      {
        p: "Mixed Content: The page was loaded over HTTPS but requested an insecure WebSocket endpoint 'ws://...'",
        s: "If your website is served over HTTPS, you must connect via secure WebSockets: `wss://yourdomain.com`, not `ws://`."
      },
      {
        p: "WebSocket connection closes abruptly in production",
        s: "Configure your reverse proxy (Nginx or Cloudflare) to support WebSocket upgrade headers (`Upgrade $http_upgrade`, `Connection 'upgrade'`)."
      }
    ],
    next: ["first-api-express", "cors-explained"]
  },

  {
    id: "api-rate-limiting",
    t: "Protect your API from abuse with Rate Limiting",
    g: "api",
    mins: 6,
    diff: "intermediate",
    why: "Without rate limiting, a single runaway while-loop or malicious script can send 10,000 requests per second, exhausting server CPU, maxing out database connections, and running up expensive LLM API bills.",
    need: ["An Express, Fastify, or Next.js API"],
    steps: [
      {
        do: "Install the standard express-rate-limit middleware.",
        cmd: "npm install express-rate-limit",
        out: "added 1 package...",
        note: "Tracks incoming requests per client IP address in memory or Redis."
      },
      {
        do: "Create a rate limiter configuration.",
        out: "import { rateLimit } from 'express-rate-limit';\nconst limiter = rateLimit({\n  windowMs: 15 * 60 * 1000,\n  max: 100,\n  standardHeaders: true,\n  legacyHeaders: false,\n  message: { error: 'Too many requests. Please try again later.' }\n});",
        note: "Allows 100 requests per 15-minute sliding window per IP address."
      },
      {
        do: "Apply the limiter globally across all API routes.",
        out: "app.use('/api/', limiter);",
        note: "Or apply stricter limiters to sensitive endpoints: `app.use('/api/auth/login', authLimiter)`."
      },
      {
        do: "Test rate limit enforcement from the terminal.",
        cmd: {
          win: "for ($i=0; $i -lt 105; $i++) { curl.exe -s -o NUL -w \"%{http_code}`n\" http://localhost:3000/api/test }",
          mac: "for i in {1..105}; do curl -s -o /dev/null -w \"%{http_code}\\n\" http://localhost:3000/api/test; done"
        },
        out: "Returns 200 for the first 100 requests, then switches to 429 for request 101+.",
        note: "HTTP status 429 means 'Too Many Requests'."
      },
      {
        do: "Inspect standard rate limiting headers in the response.",
        cmd: "curl.exe -i http://localhost:3000/api/test",
        out: "RateLimit-Limit: 100\nRateLimit-Remaining: 98\nRateLimit-Reset: 840",
        note: "Informs API consumers how many requests they have remaining before reset."
      }
    ],
    fix: [
      {
        p: "All users get blocked simultaneously in production",
        s: "Your app is behind a reverse proxy (Nginx, Vercel, or AWS ALB), so all requests share the internal proxy IP. Add `app.set('trust proxy', 1);` in Express so it inspects `X-Forwarded-For`."
      },
      {
        p: "Rate limits reset whenever the server restarts",
        s: "Memory stores are ephemeral. For multi-server clusters or persistent limits, use `rate-limit-redis` to store hit counts in Redis."
      }
    ],
    next: ["redis-caching-layer", "first-api-express"]
  },

  {
    id: "file-upload-s3-r2",
    t: "Upload files securely using Presigned URLs to S3 or R2",
    g: "api",
    mins: 8,
    diff: "advanced",
    why: "Streaming large 50MB file uploads through your API server eats up server RAM, hogs CPU, and chokes other API requests. Presigned URLs let your client upload directly to Cloudflare R2 or Amazon S3 safely.",
    need: ["AWS S3 bucket or Cloudflare R2 account", "Bucket credentials (Access Key ID & Secret)"],
    steps: [
      {
        do: "Install the AWS S3 client and request presigner packages.",
        cmd: "npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner",
        out: "added AWS SDK packages...",
        note: "Cloudflare R2 is 100% S3-compatible and uses the exact same AWS SDK without egress fees."
      },
      {
        do: "Initialize the S3Client using environment variables.",
        out: "const s3 = new S3Client({ region: 'auto', credentials: { accessKeyId: process.env.S3_KEY, secretAccessKey: process.env.S3_SECRET }, endpoint: process.env.S3_ENDPOINT });",
        note: "Store bucket credentials in `.env` — never hardcode them in source code."
      },
      {
        do: "Create a backend endpoint that generates the presigned PUT URL.",
        out: "app.post('/api/upload-url', async (req, res) => {\n  const { filename, fileType } = req.body;\n  const key = `uploads/${Date.now()}-${filename}`;\n  const command = new PutObjectCommand({ Bucket: 'my-bucket', Key: key, ContentType: fileType });\n  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 });\n  res.json({ uploadUrl, key });\n});",
        note: "The presigned URL is only valid for 60 seconds and only allows uploading the specified file."
      },
      {
        do: "In the browser frontend, upload directly to the presigned URL using fetch.",
        out: "const { uploadUrl, key } = await fetch('/api/upload-url', { method: 'POST', body: JSON.stringify({ filename: file.name, fileType: file.type }) }).then(r => r.json());\nawait fetch(uploadUrl, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } });",
        note: "The file streams directly from the user's browser to the cloud storage bucket, bypassing your application server entirely."
      },
      {
        do: "Save the resulting storage key in your database.",
        out: "Save `key` to user profile record for later retrieval.",
        note: "Store the key or public CDN URL in your database, not the temporary upload URL."
      }
    ],
    fix: [
      {
        p: "CORS error when browser uploads directly to S3 / R2",
        s: "Configure Bucket CORS policy in your cloud console: allow `PUT` method from your frontend domain (`AllowedOrigins: ['https://myapp.com']`, `AllowedHeaders: ['*']`)."
      },
      {
        p: "SignatureDoesNotMatch error during upload",
        s: "The `Content-Type` header sent by `fetch` must match the exact `ContentType` string used when generating the presigned command."
      }
    ],
    next: ["first-api-express", "cors-explained"]
  },

  {
    id: "graphql-first-query",
    t: "Query and mutate data with GraphQL",
    g: "api",
    mins: 7,
    diff: "intermediate",
    why: "REST endpoints force you to over-fetch 40 fields you don't need or make 5 sequential round-trips to get related data. GraphQL lets the client ask for exactly what it needs in a single request.",
    need: ["Node.js project", "`graphql` and `@apollo/server` installed"],
    steps: [
      {
        do: "Install Apollo Server and GraphQL core.",
        cmd: "npm install @apollo/server graphql",
        out: "added packages in 3s",
        note: "Apollo Server is the leading GraphQL implementation for Node.js."
      },
      {
        do: "Define your Type Definitions (Schema).",
        out: "const typeDefs = `#graphql\n  type Product {\n    id: ID!\n    name: String!\n    price: Float!\n    inStock: Boolean!\n  }\n  type Query {\n    products: [Product]\n    product(id: ID!): Product\n  }\n`;",
        note: "The schema is the strict contract defining all available types, queries, and mutations."
      },
      {
        do: "Create resolvers to fetch the requested data.",
        out: "const resolvers = {\n  Query: {\n    products: () => db.getProducts(),\n    product: (_, { id }) => db.getProductById(id)\n  }\n};",
        note: "Resolvers are plain JavaScript functions that execute database queries or API calls."
      },
      {
        do: "Instantiate and start the Apollo Server.",
        out: "const server = new ApolloServer({ typeDefs, resolvers });\nconst { url } = await startStandaloneServer(server, { listen: { port: 4000 } });\nconsole.log(`Server ready at ${url}`);",
        note: "Starts Apollo Server listening on http://localhost:4000."
      },
      {
        do: "Send a query requesting only product name and price from terminal.",
        cmd: "curl.exe -X POST http://localhost:4000/ -H \"Content-Type: application/json\" -d \"{\\\"query\\\": \\\"{ products { name price } }\\\"}\"",
        out: "{\"data\":{\"products\":[{\"name\":\"Mechanical Keyboard\",\"price\":129.99}]}}",
        note: "Notice `id` and `inStock` were not returned — only the exact fields requested were sent over the wire."
      }
    ],
    fix: [
      {
        p: "The N+1 database problem in nested GraphQL queries",
        s: "If fetching 20 posts and their authors causes 21 separate database queries, use `dataloader` to batch and deduplicate database requests into a single query."
      },
      {
        p: "Cannot return null for non-nullable field",
        s: "The exclamation mark `String!` enforces that the field can never be null. If the database returns null, either provide a fallback or remove `!` in the schema."
      }
    ],
    next: ["first-api-express", "curl-request"]
  },

  {
    id: "prisma-orm-setup",
    t: "Define schemas and run migrations with Prisma ORM",
    g: "data",
    mins: 8,
    diff: "intermediate",
    why: "Writing raw SQL strings leaves you open to SQL injection and has zero editor autocomplete. Prisma gives you a declarative schema file, automated migrations, and 100% type-safe database queries.",
    need: ["Node.js / TypeScript project", "PostgreSQL, MySQL, or SQLite database"],
    steps: [
      {
        do: "Install Prisma CLI as a devDependency and the Prisma Client.",
        cmd: "npm install -D prisma && npm install @prisma/client",
        out: "added prisma packages...",
        note: "`prisma` is the CLI for schema migrations; `@prisma/client` is the generated runtime query engine."
      },
      {
        do: "Initialize Prisma in your project with SQLite for quick local development.",
        cmd: "npx prisma init --datasource-provider sqlite",
        out: "Created prisma/schema.prisma\nCreated .env file with DATABASE_URL",
        note: "You can easily switch `datasource-provider` to `postgresql` or `mysql` later."
      },
      {
        do: "Open prisma/schema.prisma and define your models.",
        out: "model User {\n  id        Int      @id @default(autoincrement())\n  email     String   @unique\n  name      String?\n  createdAt DateTime @default(now())\n  posts     Post[]\n}\n\nmodel Post {\n  id       Int    @id @default(autoincrement())\n  title    String\n  content  String?\n  authorId Int\n  author   User   @relation(fields: [authorId], references: [id])\n}",
        note: "Prisma manages foreign key relations and indexes declaratively."
      },
      {
        do: "Create and apply your first database migration.",
        cmd: "npx prisma migrate dev --name init",
        out: "Your database is now in sync with your schema.\nGenerated Prisma Client.",
        note: "Prisma generates an incremental SQL migration file inside `prisma/migrations/` and updates the DB."
      },
      {
        do: "Query your database with full TypeScript autocomplete.",
        out: "import { PrismaClient } from '@prisma/client';\nconst prisma = new PrismaClient();\nconst users = await prisma.user.findMany({\n  where: { email: { endsWith: '@gmail.com' } },\n  include: { posts: true }\n});",
        note: "Your IDE will autocomplete model names, fields, and relation filters with zero runtime overhead."
      },
      {
        do: "Open Prisma Studio to inspect and edit database records visually.",
        cmd: "npx prisma studio",
        out: "Prisma Studio is up on http://localhost:5555",
        note: "A visual admin dashboard opens in your browser to view, filter, edit, and add database rows."
      }
    ],
    fix: [
      {
        p: "PrismaClientInitializationError: Unable to open database file",
        s: "Verify `DATABASE_URL` in `.env`. For SQLite, use `file:./dev.db`. For PostgreSQL, ensure Docker or Postgres service is running on port 5432."
      },
      {
        p: "Schema changes in schema.prisma are not showing in code",
        s: "Run `npx prisma generate` to re-generate the TypeScript types inside `node_modules/@prisma/client`."
      }
    ],
    next: ["sqlite-basics", "postgres-connect"]
  },

  {
    id: "redis-caching-layer",
    t: "Cache slow database queries with Redis",
    g: "data",
    mins: 7,
    diff: "intermediate",
    why: "A database query that takes 300ms under load will bring down your application during traffic spikes. Redis stores key-value pairs in memory, serving cached queries in under 2 milliseconds.",
    need: ["Docker running locally, or a managed Redis instance"],
    steps: [
      {
        do: "Start a lightweight local Redis container using Docker.",
        cmd: "docker run -d --name redis-local -p 6379:6379 redis:alpine",
        out: "Container ID printed, Redis running on port 6379.",
        note: "Redis Alpine is under 30MB and boots in less than 1 second."
      },
      {
        do: "Install the high-performance ioredis client in your Node project.",
        cmd: "npm install ioredis && npm install -D @types/ioredis",
        out: "added ioredis package...",
        note: "ioredis supports promises, automatic reconnection, clustering, and Sentinel out of the box."
      },
      {
        do: "Connect to the Redis server.",
        out: "import Redis from 'ioredis';\nconst redis = new Redis('redis://localhost:6379');",
        note: "In production, pass password and host from environment variables."
      },
      {
        do: "Implement the Cache-Aside pattern in your database query.",
        out: "const cacheKey = 'products:top';\nconst cachedData = await redis.get(cacheKey);\nif (cachedData) return JSON.parse(cachedData);\n\nconst freshData = await db.query('SELECT * FROM products ORDER BY sales DESC LIMIT 20');\nawait redis.setex(cacheKey, 60, JSON.stringify(freshData));\nreturn freshData;",
        note: "`setex` sets the key with an automatic expiration Time To Live (TTL) in seconds."
      },
      {
        do: "Invalidate the cache when underlying data is updated.",
        out: "await redis.del('products:top');",
        note: "Deleting the key forces the next request to fetch fresh data from the database."
      },
      {
        do: "Verify cache hits using the Redis CLI inside the container.",
        cmd: "docker exec -it redis-local redis-cli KEYS \"*\"",
        out: "1) \"products:top\"",
        note: "Inspect keys and TTLs anytime with `redis-cli TTL products:top`."
      }
    ],
    fix: [
      {
        p: "Stale data: Users see old prices after an update",
        s: "Always invalidate related cache keys during update mutations (`await redis.del(...)`), or shorten the TTL to 10-30 seconds."
      },
      {
        p: "Redis runs out of memory under heavy load (OOM command not allowed)",
        s: "Configure memory eviction in Redis config: `maxmemory 256mb` and `maxmemory-policy allkeys-lru` so least recently used keys are purged automatically."
      }
    ],
    next: ["postgres-connect", "docker-first-container"]
  },

  {
    id: "database-backup-restore",
    t: "Dump and restore PostgreSQL and MySQL databases",
    g: "data",
    mins: 6,
    diff: "intermediate",
    why: "Hard drives fail, cloud providers have outages, and developers accidentally run `DELETE FROM users` without a WHERE clause. Automated backups are the only true insurance policy for your application.",
    need: ["PostgreSQL or MySQL client tools installed (`pg_dump` or `mysqldump`)"],
    steps: [
      {
        do: "Export a full PostgreSQL database dump in custom binary format.",
        cmd: "pg_dump -h localhost -U postgres -d my_db -F c -b -v -f backup_latest.dump",
        out: "pg_dump: saving database definition... pg_dump: finished.",
        note: "The `-F c` custom format is compressed and allows parallel restoration of specific tables."
      },
      {
        do: "Or export a MySQL database to a compressed SQL file.",
        cmd: {
          win: "mysqldump -u root -p my_db | Out-File -Encoding utf8 backup_latest.sql",
          mac: "mysqldump -u root -p my_db | gzip > backup_latest.sql.gz"
        },
        out: "Prompts for database password, then exports tables and rows.",
        note: "Dumps contain DDL (`CREATE TABLE`) and DML (`INSERT INTO`) statements."
      },
      {
        do: "Inspect the backup file size to verify it contains data.",
        cmd: { win: "Get-Item backup_*", mac: "ls -lh backup_*" },
        out: "Displays file size in megabytes.",
        note: "If your backup file is 0 bytes, check the error output — authentication likely failed."
      },
      {
        do: "Create a fresh temporary sandbox database to test restoration.",
        cmd: "createdb -h localhost -U postgres test_restore_db",
        out: "Database created.",
        note: "NEVER test a database restore on your live production database!"
      },
      {
        do: "Restore the PostgreSQL dump into the test database.",
        cmd: "pg_restore -h localhost -U postgres -d test_restore_db -v backup_latest.dump",
        out: "pg_restore: processing data for table \"users\"... pg_restore: finished.",
        note: "The `-v` (verbose) flag displays table names as they are restored."
      },
      {
        do: "Verify row counts in the restored database.",
        cmd: "psql -h localhost -U postgres -d test_restore_db -c \"SELECT count(*) FROM users;\"",
        out: "count: 14820",
        note: "A backup that has never been restored is not a backup — it is an unverified wish."
      }
    ],
    fix: [
      {
        p: "pg_dump: error: server version mismatch",
        s: "Your local `pg_dump` binary version is older than the target server. Upgrade client tools so `pg_dump --version` matches or exceeds the server version."
      },
      {
        p: "Out of memory during massive mysqldump restore",
        s: "Increase `max_allowed_packet` in MySQL config or restore in batches."
      }
    ],
    next: ["postgres-connect", "sqlite-basics"]
  },

  {
    id: "docker-multistage-build",
    t: "Shrink Docker image sizes by 80% with Multi-Stage Builds",
    g: "container",
    mins: 8,
    diff: "intermediate",
    why: "A naive Dockerfile leaves compilers, TypeScript packages, and devDependencies inside your production image, resulting in a 1.4GB image that deploys slowly. Multi-stage builds produce a tiny, secure 75MB image.",
    need: ["Docker installed", "A Node.js or Go application"],
    steps: [
      {
        do: "Open your Dockerfile and create the first 'builder' stage.",
        out: "FROM node:20-alpine AS builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\nRUN npm prune --production",
        note: "The builder stage installs devDependencies, compiles TypeScript, and removes devDependencies."
      },
      {
        do: "Create the lean second 'runner' stage in the same Dockerfile.",
        out: "FROM node:20-alpine AS runner\nWORKDIR /app\nENV NODE_ENV=production\n\nCOPY --from=builder /app/package.json ./\nCOPY --from=builder /app/node_modules ./node_modules\nCOPY --from=builder /app/dist ./dist\n\nUSER node\nEXPOSE 3000\nCMD [\"node\", \"dist/index.js\"]",
        note: "The runner stage starts from a clean alpine image and only copies production artifacts from the builder."
      },
      {
        do: "Add a .dockerignore file to exclude local artifacts.",
        cmd: {
          win: "'node_modules`ndist`n.git`n.env' | Out-File -Encoding utf8 .dockerignore",
          mac: "echo -e \"node_modules\\ndist\\n.git\\n.env\" > .dockerignore"
        },
        out: ".dockerignore created.",
        note: "Prevents copying local `node_modules` into the container, ensuring clean Linux-compiled binaries."
      },
      {
        do: "Build the production image.",
        cmd: "docker build -t my-app:prod .",
        out: "[+] Building ... [builder] ... [runner] ... Successfully tagged my-app:prod",
        note: "Docker executes both stages and discards the builder stage when finished."
      },
      {
        do: "Compare the image size.",
        cmd: "docker images my-app:prod",
        out: "REPOSITORY   TAG    SIZE\nmy-app       prod   78.4MB",
        note: "The final image is 78MB instead of 1.2GB — downloads in 2 seconds on production servers."
      },
      {
        do: "Run your optimized container.",
        cmd: "docker run -d -p 3000:3000 --name app my-app:prod",
        out: "Container running on http://localhost:3000.",
        note: "Runs securely under the unprivileged `node` user instead of `root`."
      }
    ],
    fix: [
      {
        p: "Error: Cannot find module 'dist/index.js'",
        s: "Verify that `COPY --from=builder /app/dist ./dist` matches the output directory configured in `tsconfig.json` (`outDir`)."
      },
      {
        p: "Prisma Client binary not found in Alpine runner",
        s: "Alpine uses musl libc instead of glibc. Add `RUN apk add --no-cache openssl` in the runner stage for Prisma engine compatibility."
      }
    ],
    next: ["dockerfile-write", "docker-compose"]
  },

  {
    id: "docker-volumes-persistence",
    t: "Persist database data and mount code with Docker Volumes",
    g: "container",
    mins: 6,
    diff: "intermediate",
    why: "Containers are ephemeral: when a container stops or is recreated, all data written inside its filesystem vanishes. Docker Volumes store database data safely on the host machine outside the container lifecycle.",
    need: ["Docker installed"],
    steps: [
      {
        do: "Create a named Docker volume for database storage.",
        cmd: "docker volume create postgres_data",
        out: "postgres_data",
        note: "Named volumes are managed directly by Docker and stored safely on host disk."
      },
      {
        do: "Inspect the volume details on your system.",
        cmd: "docker volume inspect postgres_data",
        out: "Shows Mountpoint on host filesystem, driver, and creation timestamp.",
        note: "On Linux/WSL, volumes live in `/var/lib/docker/volumes/`."
      },
      {
        do: "Start a PostgreSQL container mounted to the volume.",
        cmd: "docker run -d --name pg-db -e POSTGRES_PASSWORD=mysecret -v postgres_data:/var/lib/postgresql/data -p 5432:5432 postgres:16-alpine",
        out: "Container started with volume mounted.",
        note: "The `-v volume_name:container_path` syntax mounts the persistent volume inside the container."
      },
      {
        do: "Insert test data into the database.",
        cmd: "docker exec -it pg-db psql -U postgres -c \"CREATE TABLE notes (id serial, text text); INSERT INTO notes (text) VALUES ('Persistent data!');\"",
        out: "CREATE TABLE, INSERT 0 1",
        note: "Data is written through the mount point directly into the `postgres_data` volume."
      },
      {
        do: "Stop and completely remove the container.",
        cmd: "docker stop pg-db && docker rm pg-db",
        out: "pg-db removed.",
        note: "The container is deleted, but the volume remains completely untouched."
      },
      {
        do: "Start a brand new container attached to the same volume.",
        cmd: "docker run -d --name pg-db-new -e POSTGRES_PASSWORD=mysecret -v postgres_data:/var/lib/postgresql/data -p 5432:5432 postgres:16-alpine",
        out: "New container running.",
        note: "Mounting the existing volume attaches all previously written data."
      },
      {
        do: "Query the new container and verify your data is intact.",
        cmd: "docker exec -it pg-db-new psql -U postgres -c \"SELECT * FROM notes;\"",
        out: "1 | Persistent data!",
        note: "Zero data loss across container teardown and recreation!"
      }
    ],
    fix: [
      {
        p: "Permission denied on volume mount inside container",
        s: "Container user ID mismatch. Set ownership on the host directory or use Docker named volumes instead of host bind mounts."
      },
      {
        p: "How to delete a volume and completely reset database",
        s: "Stop the container, then remove the volume: `docker volume rm postgres_data`. This permanently erases all data in that volume."
      }
    ],
    next: ["docker-first-container", "docker-compose"]
  },

  {
    id: "nginx-reverse-proxy",
    t: "Set up Nginx as a Reverse Proxy with SSL",
    g: "ship",
    mins: 8,
    diff: "intermediate",
    why: "Exposing your Node.js, Python, or Go app directly on port 80/443 is insecure and inflexible. Nginx handles SSL termination, gzip compression, rate limiting, and static file caching before requests reach your app.",
    need: ["Linux server or Nginx installed locally", "An app running on port 3000"],
    steps: [
      {
        do: "Open or create your Nginx site configuration file.",
        cmd: "sudo nano /etc/nginx/sites-available/myapp",
        out: "Nginx configuration editor opens.",
        note: "On Ubuntu/Debian, configurations live in `/etc/nginx/sites-available/`."
      },
      {
        do: "Define the reverse proxy server block.",
        out: "server {\n    listen 80;\n    server_name example.com www.example.com;\n\n    location / {\n        proxy_pass http://127.0.0.1:3000;\n        proxy_http_version 1.1;\n        proxy_set_header Upgrade $http_upgrade;\n        proxy_set_header Connection 'upgrade';\n        proxy_set_header Host $host;\n        proxy_set_header X-Real-IP $remote_addr;\n        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n        proxy_set_header X-Forwarded-Proto $scheme;\n        proxy_cache_bypass $http_upgrade;\n    }\n}",
        note: "Forwards all incoming HTTP requests to your Node app running on port 3000 while passing client IP headers."
      },
      {
        do: "Enable the site configuration by creating a symlink.",
        cmd: "sudo ln -s /etc/nginx/sites-available/myapp /etc/nginx/sites-enabled/",
        out: "Symlink created in sites-enabled.",
        note: "Keeps configurations modular and easily enabled/disabled."
      },
      {
        do: "Test your Nginx syntax without restarting the server.",
        cmd: "sudo nginx -t",
        out: "nginx: the configuration file /etc/nginx/nginx.conf syntax is ok\nnginx: configuration file test is successful",
        note: "Always run `nginx -t` before reloading. A syntax error will crash the live web server."
      },
      {
        do: "Reload Nginx to apply changes with zero downtime.",
        cmd: "sudo systemctl reload nginx",
        out: "Nginx reloaded.",
        note: "`reload` applies changes without dropping existing active connections, unlike `restart`."
      },
      {
        do: "Obtain free automated SSL certificates using Certbot.",
        cmd: "sudo certbot --nginx -d example.com -d www.example.com",
        out: "Deploying certificate... Congratulations! Successfully enabled HTTPS.",
        note: "Certbot automatically configures SSL, redirects HTTP to HTTPS, and schedules auto-renewal."
      }
    ],
    fix: [
      {
        p: "502 Bad Gateway error",
        s: "Nginx is running, but your backend app on port 3000 is stopped or crashed. Check your backend status with `pm2 status` or `systemctl status myapp`."
      },
      {
        p: "nginx: [emerg] bind() to 0.0.0.0:80 failed (98: Address already in use)",
        s: "Another service (Apache or another Nginx instance) is bound to port 80. Find it with `sudo lsof -i :80` and stop the conflicting service."
      }
    ],
    next: ["deploy-to-render-railway", "pm2-process-manager"]
  },

  {
    id: "deploy-to-render-railway",
    t: "Deploy a fullstack backend with database to Render or Railway",
    g: "ship",
    mins: 7,
    diff: "beginner",
    why: "Managing virtual machines, firewalls, and SSL certificates manually is time-consuming. Platforms like Render and Railway give you automated Git push deployments, managed PostgreSQL databases, and free HTTPS in 5 minutes.",
    need: ["A backend project pushed to GitHub", "A free Render or Railway account"],
    steps: [
      {
        do: "Push your latest code to your GitHub repository.",
        cmd: "git push origin main",
        out: "Code is up to date on GitHub.",
        note: "PaaS platforms trigger automated builds whenever you push to your default branch."
      },
      {
        do: "Log into Render (render.com) or Railway (railway.app) and create a New Project.",
        out: "Click 'New +' -> 'Web Service', connect GitHub, and select your repository.",
        note: "Both platforms automatically detect Node.js, Python, Docker, or Go codebases."
      },
      {
        do: "Configure Build and Start Commands.",
        out: "Build Command: npm install && npm run build\nStart Command: npm start (or node dist/index.js)",
        note: "Ensure your `package.json` has valid `build` and `start` scripts defined."
      },
      {
        do: "Provision a managed PostgreSQL database.",
        out: "Click 'New +' -> 'PostgreSQL Database'.",
        note: "The platform provisions a dedicated database instance and generates connection credentials."
      },
      {
        do: "Link the database URL in your Web Service Environment Variables.",
        out: "Add environment variable `DATABASE_URL` set to the Internal Database URL provided by the platform.",
        note: "Internal database connections stay inside the cloud private network with zero egress bandwidth latency."
      },
      {
        do: "Ensure your server listens on process.env.PORT.",
        out: "const PORT = process.env.PORT || 3000;\napp.listen(PORT, '0.0.0.0', () => console.log(`Listening on ${PORT}`));",
        note: "PaaS platforms assign dynamic ports via `$PORT`. Never hardcode port 3000 in production server code!"
      },
      {
        do: "Click Deploy and watch the live deployment logs.",
        out: "Build succeeded... Container started... Service is live at https://my-app.onrender.com",
        note: "Every future `git push origin main` will automatically rebuild and deploy your application!"
      }
    ],
    fix: [
      {
        p: "Error: Port scan timeout / Service failed to bind to $PORT",
        s: "Your server is hardcoded to port 3000 or listening on localhost (`127.0.0.1`). Bind to `0.0.0.0` and use `process.env.PORT`."
      },
      {
        p: "Database migrations did not run during deploy",
        s: "Update your Build Command to include migrations: `npm install && npx prisma migrate deploy && npm run build`."
      }
    ],
    next: ["push-to-github", "deploy-static", "env-vars"]
  },

  {
    id: "pm2-process-manager",
    t: "Keep Node.js apps alive forever in production with PM2",
    g: "ship",
    mins: 6,
    diff: "intermediate",
    why: "If you run `node server.js` in a terminal, closing the terminal or an unhandled exception terminates your server. PM2 restarts your app automatically on crash, clusters across CPU cores, and survives server reboots.",
    need: ["Node.js installed on your production server"],
    steps: [
      {
        do: "Install PM2 globally on your server.",
        cmd: "npm install -g pm2",
        out: "added pm2 globally...",
        note: "PM2 runs as a background daemon process supervisor."
      },
      {
        do: "Start your application under PM2 supervision.",
        cmd: "pm2 start server.js --name \"my-api\"",
        out: "┌─────┬──────────┬─────────────┬─────────┬─────────┬──────────┐\n│ id  │ name     │ mode        │ status  │ cpu     │ memory   │\n│ 0   │ my-api   │ fork        │ online  │ 0%      │ 32.4mb   │\n└─────┴──────────┴─────────────┴─────────┴─────────┴──────────┘",
        note: "If the application crashes, PM2 restarts it in less than 50 milliseconds."
      },
      {
        do: "Scale your app in cluster mode across all CPU cores.",
        cmd: "pm2 start server.js -i max --name \"my-cluster\"",
        out: "Launches one process per available CPU core with built-in load balancing.",
        note: "Utilizes 100% of multi-core server hardware without changing a line of code."
      },
      {
        do: "Monitor CPU, RAM, and event loop latency in real time.",
        cmd: "pm2 monit",
        out: "Terminal dashboard displaying real-time memory usage, log stream, and CPU graphs.",
        note: "Press 'q' to exit the monitor dashboard."
      },
      {
        do: "Stream aggregated application logs.",
        cmd: "pm2 logs my-api --lines 50",
        out: "Displays the last 50 log lines and streams new console output live.",
        note: "PM2 automatically redirects stdout and stderr to rotating log files on disk."
      },
      {
        do: "Perform a zero-downtime reload after code updates.",
        cmd: "pm2 reload all",
        out: "Reloads worker processes one by one without dropping a single active HTTP request.",
        note: "Users experience zero downtime while your updated code deploys."
      },
      {
        do: "Configure PM2 to resurrect your apps on system reboot.",
        cmd: "pm2 startup && pm2 save",
        out: "Generates systemd service and saves active process list.",
        note: "If the server machine reboots, PM2 restarts all your applications automatically."
      }
    ],
    fix: [
      {
        p: "Application enters infinite restart loop ('errored' status)",
        s: "Inspect the error log: `pm2 logs my-api --err --lines 50`. Commonly caused by missing environment variables, syntax errors, or port already in use."
      },
      {
        p: "Code changes do not take effect",
        s: "If using TypeScript, run `npm run build` before executing `pm2 reload all`, or pass `--watch` in development."
      }
    ],
    next: ["read-logs", "kill-process"]
  },

  {
    id: "llm-structured-outputs",
    t: "Enforce strict JSON schema responses from LLMs",
    g: "ai",
    mins: 7,
    diff: "intermediate",
    why: "Standard LLM prompts asking for 'JSON only' still randomly output conversational text like 'Sure, here is your JSON:' or trailing markdown fences that break `JSON.parse()`. Structured Outputs guarantee 100% schema compliance.",
    need: ["OpenAI / Gemini / Anthropic API Key", "Zod or JSON Schema installed"],
    steps: [
      {
        do: "Install the OpenAI SDK and Zod for schema validation.",
        cmd: "npm install openai zod zod-to-json-schema",
        out: "added packages in 2s",
        note: "Zod defines your schema in TypeScript and exports the standard JSON schema that LLMs expect."
      },
      {
        do: "Define your expected data structure with Zod.",
        out: "import { z } from 'zod';\nconst ExtractionSchema = z.object({\n  sentiment: z.enum(['positive', 'neutral', 'negative']),\n  summary: z.string(),\n  keyPoints: z.array(z.string()),\n  confidenceScore: z.number().min(0).max(1)\n});",
        note: "Define enum values, required fields, and nested structures with full type safety."
      },
      {
        do: "Convert the Zod schema to JSON Schema.",
        out: "import { zodToJsonSchema } from 'zod-to-json-schema';\nconst jsonSchema = zodToJsonSchema(ExtractionSchema, 'output');",
        note: "The API engine uses this schema to constrain token generation at the grammar level."
      },
      {
        do: "Call the API with strict structured outputs enabled.",
        out: "const response = await openai.chat.completions.create({\n  model: 'gpt-4o',\n  messages: [{ role: 'user', content: 'Analyze this customer review: ...' }],\n  response_format: {\n    type: 'json_schema',\n    json_schema: {\n      name: 'review_extraction',\n      strict: true,\n      schema: jsonSchema.definitions.output\n    }\n  }\n});",
        note: "`strict: true` guarantees the model will never produce a token that violates your schema."
      },
      {
        do: "Parse and use the guaranteed JSON output.",
        out: "const rawText = response.choices[0].message.content;\nconst data = JSON.parse(rawText);\nconst typedData = ExtractionSchema.parse(data);",
        note: "Zero regex stripping, zero markdown cleanup, and 100% type-safe!"
      }
    ],
    fix: [
      {
        p: "OpenAI error: In strict mode, all fields must be required",
        s: "In strict schema mode, every field must be listed in `required: [...]`. If a field is optional, declare it as nullable: `z.string().nullable()` instead of `z.string().optional()`."
      },
      {
        p: "How to enable structured output in Google Gemini",
        s: "In Google Gemini SDK, pass `generationConfig: { responseMimeType: 'application/json', responseSchema: yourSchema }`."
      }
    ],
    next: ["llm-api-call", "llm-function-calling"]
  },

  {
    id: "llm-function-calling",
    t: "Connect LLMs to external tools and APIs with Function Calling",
    g: "ai",
    mins: 9,
    diff: "advanced",
    why: "LLMs alone cannot check the live weather, query your database, or send an email. Function calling gives the model access to your actual code tools, enabling it to decide when and how to call external APIs.",
    need: ["Node.js or Python environment", "LLM API credentials"],
    steps: [
      {
        do: "Define your real code functions that perform actions.",
        out: "async function getStockPrice({ symbol }) {\n  const res = await fetch(`https://api.example.com/quote/${symbol}`);\n  return res.json();\n}",
        note: "Functions can query databases, call third-party APIs, or perform mathematical calculations."
      },
      {
        do: "Define the tool definition specification for the model.",
        out: "const tools = [{\n  type: 'function',\n  function: {\n    name: 'getStockPrice',\n    description: 'Get current stock market price and trading volume for a ticker symbol',\n    parameters: {\n      type: 'object',\n      properties: {\n        symbol: { type: 'string', description: 'Stock ticker, e.g. AAPL, GOOG' }\n      },\n      required: ['symbol']\n    }\n  }\n}];",
        note: "The model reads the tool description to decide if and when the function should be invoked."
      },
      {
        do: "Send the conversation messages along with the available tools.",
        out: "const messages = [{ role: 'user', content: 'What is Apple stock trading at right now?' }];\nconst response = await openai.chat.completions.create({\n  model: 'gpt-4o',\n  messages,\n  tools\n});",
        note: "The model will recognize that it needs external data and output a `tool_calls` request instead of text."
      },
      {
        do: "Inspect the model response and execute the requested tool.",
        out: "const msg = response.choices[0].message;\nif (msg.tool_calls) {\n  const toolCall = msg.tool_calls[0];\n  const args = JSON.parse(toolCall.function.arguments);\n  const result = await getStockPrice(args);\n}",
        note: "The model specifies the function name and structured JSON arguments."
      },
      {
        do: "Feed the tool result back into the conversation.",
        out: "messages.push(msg);\nmessages.push({\n  role: 'tool',\n  tool_call_id: toolCall.id,\n  content: JSON.stringify(result)\n});",
        note: "The `tool_call_id` links your result back to the specific function call request."
      },
      {
        do: "Call the model a second time to generate the final human answer.",
        out: "const finalResponse = await openai.chat.completions.create({ model: 'gpt-4o', messages });\nconsole.log(finalResponse.choices[0].message.content);",
        note: "Output: 'Apple (AAPL) is currently trading at $224.50, up 1.8% today.'"
      }
    ],
    fix: [
      {
        p: "The model refuses to call the tool and makes up a fake number",
        s: "Set `tool_choice: { type: 'function', function: { name: 'getStockPrice' } }` or improve the tool description so the model understands it has live access."
      },
      {
        p: "Model enters an infinite tool-calling loop",
        s: "Limit maximum tool iterations in your code loop (e.g. max 5 tool hops) and check for duplicate tool calls."
      }
    ],
    next: ["llm-structured-outputs", "rag-pipeline"]
  },

  {
    id: "vector-db-pinecone-qdrant",
    t: "Store and query vector embeddings in a Vector Database",
    g: "ai",
    mins: 8,
    diff: "intermediate",
    why: "Traditional SQL databases do keyword matching (`WHERE text LIKE '%dog%'`). Vector databases store high-dimensional math representations of text, finding conceptually similar documents in milliseconds.",
    need: ["Vector database account (Pinecone, Qdrant, or Chroma)", "OpenAI embeddings API key"],
    steps: [
      {
        do: "Install the vector database client and OpenAI SDK.",
        cmd: "npm install @pinecone-database/pinecone openai",
        out: "added packages in 3s",
        note: "Pinecone is a serverless vector database; Qdrant and Chroma offer self-hosted open source options."
      },
      {
        do: "Initialize the Vector Database client.",
        out: "import { Pinecone } from '@pinecone-database/pinecone';\nconst pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });\nconst index = pc.index('knowledge-base');",
        note: "The index must be configured with metric: 'cosine' and dimension matching your embedding model (1536)."
      },
      {
        do: "Generate dense vector embeddings for your text documents.",
        out: "import OpenAI from 'openai';\nconst openai = new OpenAI();\nconst text = 'Refund policy: Customers can request a full refund within 30 days of purchase.';\nconst emb = await openai.embeddings.create({\n  model: 'text-embedding-3-small',\n  input: text\n});\nconst vector = emb.data[0].embedding;",
        note: "`text-embedding-3-small` generates a 1536-dimensional array of floating point numbers."
      },
      {
        do: "Upsert vector embeddings with metadata into the index.",
        out: "await index.upsert([\n  {\n    id: 'doc-refund-policy',\n    values: vector,\n    metadata: { category: 'billing', title: 'Refund Policy', text }\n  }\n]);",
        note: "Store the raw text inside metadata so you can retrieve it directly when querying."
      },
      {
        do: "Query the index using semantic similarity.",
        out: "const userQuestion = 'Can I get my money back if I am unhappy?';\nconst qEmb = await openai.embeddings.create({ model: 'text-embedding-3-small', input: userQuestion });\nconst results = await index.query({\n  vector: qEmb.data[0].embedding,\n  topK: 3,\n  includeMetadata: true\n});",
        note: "Notice the user prompt didn't say the word 'refund', yet the vector database matches the refund policy with 88% similarity!"
      },
      {
        do: "Inspect the top matched document chunks.",
        out: "results.matches.forEach(m => console.log(`${m.id}: score ${m.score} -> ${m.metadata.text}`));",
        note: "Feed the top matching metadata chunks into an LLM context window to build a full RAG system."
      }
    ],
    fix: [
      {
        p: "Dimension mismatch error (expected 1536, received 3072)",
        s: "The embedding model output dimension must match your index dimension. `text-embedding-3-small` outputs 1536; `text-embedding-3-large` outputs 3072."
      },
      {
        p: "Pinecone query returns 0 matches",
        s: "Check if you specified a namespace when upserting. If data was upserted into namespace 'production', queries must specify `index.namespace('production').query(...)`."
      }
    ],
    next: ["embeddings-search", "rag-pipeline"]
  },

  {
    id: "tmux-screen-multiplexer",
    t: "Run persistent background sessions with tmux",
    g: "term",
    mins: 6,
    diff: "intermediate",
    why: "When you run a 3-hour script over SSH and your Wi-Fi blips for 1 second, the SSH connection dies and kills your script. `tmux` runs terminal sessions on the server independent of your connection.",
    need: ["Linux / macOS terminal, or WSL on Windows"],
    steps: [
      {
        do: "Install tmux using your package manager if not already installed.",
        cmd: { win: "wsl -- sudo apt install tmux", mac: "brew install tmux" },
        out: "tmux installed.",
        note: "On Windows, use WSL (Windows Subsystem for Linux) to run tmux natively."
      },
      {
        do: "Start a brand new named tmux session.",
        cmd: "tmux new -s dev-session",
        out: "A fresh green status bar appears at the bottom of your terminal.",
        note: "Naming your session (`-s dev-session`) makes it easy to reconnect later."
      },
      {
        do: "Split the terminal into two side-by-side vertical panes.",
        cmd: "Press Ctrl + b, release, then press % (Shift + 5)",
        out: "The window splits vertically into two independent shell panes.",
        note: "`Ctrl + b` is tmux's default 'prefix' key. Every tmux command starts with pressing Ctrl + b."
      },
      {
        do: "Split the active pane horizontally into top and bottom.",
        cmd: "Press Ctrl + b, release, then press \" (Shift + ')",
        out: "The pane divides horizontally.",
        note: "Navigate between panes by pressing `Ctrl + b` followed by arrow keys."
      },
      {
        do: "Start a long-running process in one pane.",
        cmd: "python train_model.py  (or npm run dev)",
        out: "Script begins logging output.",
        note: "This process runs entirely inside the tmux server session."
      },
      {
        do: "Detach safely from the session without interrupting the running script.",
        cmd: "Press Ctrl + b, release, then press d",
        out: "[detached (from session dev-session)]",
        note: "You are returned to your normal shell. You can close the terminal, shut your laptop, or disconnect from SSH!"
      },
      {
        do: "Re-attach to your running session anytime later.",
        cmd: "tmux attach -t dev-session",
        out: "Your multi-pane layout reappears with the script still running exactly where you left it.",
        note: "List active sessions anytime with `tmux ls`."
      }
    ],
    fix: [
      {
        p: "Cannot scroll up with mouse inside tmux pane",
        s: "Enable mouse mode: press `Ctrl + b`, type `:set -g mouse on` and press Enter. To make this permanent, add `set -g mouse on` to `~/.tmux.conf`."
      },
      {
        p: "Sessions vanish when the server reboots",
        s: "Tmux sessions live in memory. For persistent production daemon services that survive reboots, use PM2 or systemd services."
      }
    ],
    next: ["tail-two-terminals", "kill-process"]
  },

  {
    id: "powershell-profile-tuning",
    t: "Supercharge PowerShell on Windows with custom profiles and aliases",
    g: "term",
    mins: 6,
    diff: "beginner",
    why: "Default PowerShell on Windows lacks common Unix shortcuts, uses clunky verbose commands, and shows garbled UTF-8 symbols. Customizing your PowerShell profile gives you instant shortcuts and a beautiful prompt.",
    need: ["Windows PowerShell 5.1 or PowerShell 7"],
    steps: [
      {
        do: "Check the path to your current user PowerShell profile file.",
        cmd: "$PROFILE",
        out: "C:\\Users\\YOU\\Documents\\WindowsPowerShell\\Microsoft.PowerShell_profile.ps1",
        note: "This script is executed automatically every time a new PowerShell terminal opens."
      },
      {
        do: "Create the profile file and parent directory if it does not exist yet.",
        cmd: "if (!(Test-Path -Path $PROFILE)) { New-Item -ItemType File -Path $PROFILE -Force }",
        out: "Directory and profile file created.",
        note: "The `-Force` flag creates parent directories if they don't exist."
      },
      {
        do: "Open the profile in VS Code or Notepad.",
        cmd: "code $PROFILE",
        out: "VS Code opens your profile script in an editor tab.",
        note: "Or use `notepad $PROFILE` if VS Code is not installed in your PATH."
      },
      {
        do: "Add productivity aliases and UTF-8 encoding configuration.",
        out: "# UTF-8 output encoding\n[Console]::OutputEncoding = [System.Text.Encoding]::UTF8\n$OutputEncoding = [System.Text.Encoding]::UTF8\n\n# Git shortcuts\nfunction g { git status }\nfunction gp { git push }\nfunction gl { git pull }\nfunction gd { git diff }\nfunction gco { git checkout $args }\n\n# Navigation\nfunction .. { Set-Location .. }\nfunction ... { Set-Location ../.. }\nSet-Alias -Name ll -Value Get-ChildItem",
        note: "These functions let you type `g` instead of `git status` and `..` to jump up a directory."
      },
      {
        do: "Allow local profile scripts to execute on your machine.",
        cmd: "Set-ExecutionPolicy -Scope CurrentUser RemoteSigned",
        out: "Execution policy updated for CurrentUser.",
        note: "Allows local scripts you created to run while blocking untrusted unsigned scripts downloaded from the internet."
      },
      {
        do: "Reload your profile instantly without closing the terminal.",
        cmd: ". $PROFILE",
        out: "Profile reloaded cleanly.",
        note: "The dot-source syntax (`. $PROFILE`) runs the script in the current session scope."
      },
      {
        do: "Test your new shortcuts.",
        cmd: "g",
        out: "Executes `git status` instantly!",
        note: "You can add custom directory shortcuts or environment variables to this file anytime."
      }
    ],
    fix: [
      {
        p: "File cannot be loaded because running scripts is disabled on this system",
        s: "Open PowerShell and run `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned -Force`. This enables script execution for your user account without requiring administrator privileges."
      },
      {
        p: "Garbled unicode characters or emoji in terminal output",
        s: "Add `[Console]::OutputEncoding = [System.Text.Encoding]::UTF8` to the very top of your `$PROFILE` file."
      }
    ],
    next: ["open-terminal", "move-around"]
  },

  {
    id: "fine-tuning-vs-rag",
    t: "Choose between Fine-Tuning and RAG for your AI project",
    g: "ai",
    mins: 7,
    diff: "intermediate",
    why: "Teams frequently spend $10,000 fine-tuning a model to teach it new facts, only to find it still hallucinates. Understanding when to use Retrieval-Augmented Generation (RAG) vs Fine-Tuning saves months of wasted engineering.",
    need: ["Basic understanding of LLMs and prompt engineering"],
    steps: [
      {
        do: "Understand the core distinction between the two approaches.",
        out: "RAG is an OPEN-BOOK exam: the model is given factual reference passages to read before answering.\nFine-Tuning is MUSCLE MEMORY: the model updates internal neural weights to learn tone, structure, or specialized jargon.",
        note: "Never fine-tune an LLM just to teach it factual documents — LLM weights are lossy knowledge stores."
      },
      {
        do: "Choose RAG when your data is dynamic or factual.",
        out: "Use RAG if: 1. Knowledge changes frequently (daily prices, documentation, wiki updates), 2. You need source citations with page numbers, 3. You need user-level document permissions.",
        note: "Updating a RAG system is as simple as inserting a new row into a vector database."
      },
      {
        do: "Choose Fine-Tuning when you need specialized behavior or cost efficiency.",
        out: "Use Fine-Tuning if: 1. Teaching a strict non-standard syntax (e.g. specialized medical format or custom SQL dialect), 2. Eliminating 2,000-token system prompts to reduce inference latency and API cost, 3. Training a small 8B model to match a 70B model on one specific task.",
        note: "Fine-tuning requires a minimum of 500-1,000 high-quality, human-curated input/output prompt pairs."
      },
      {
        do: "Calculate the total cost of ownership.",
        out: "RAG costs: Embedding API calls + Vector DB hosting + inference token usage.\nFine-Tuning costs: Dataset curation time + GPU training hours + dedicated model serving hosting.",
        note: "RAG has higher per-request token costs; fine-tuning has high upfront engineering and training costs."
      },
      {
        do: "Consider the modern Production Hybrid approach.",
        out: "Fine-tune a smaller model (like Llama-3-8B) to follow strict output rules, and feed it fresh real-time knowledge using RAG at runtime.",
        note: "Gives you the best of both worlds: ultra-fast, cheap inference with 100% accurate, up-to-date facts."
      }
    ],
    fix: [
      {
        p: "Our fine-tuned model still hallucinates product specs and prices",
        s: "Fine-tuning adjusts probabilities across billions of parameters; it does not guarantee factual recall. Switch to RAG for factual data retrieval."
      },
      {
        p: "RAG retrieval returns irrelevant chunks that confuse the model",
        s: "Implement a hybrid search (Dense vector search + BM25 keyword search) and re-rank the top 20 retrieved passages using a Cross-Encoder before feeding them to the LLM."
      }
    ],
    next: ["rag-pipeline", "embeddings-search"]
  }
];

console.log('Number of new guides to add:', newGuides.length);

// Extract existing guides
const globalWindow = {};
eval(originalContent.replace('window.TD = window.TD || {}', 'globalWindow.TD = globalWindow.TD || {}'));
const existingGuides = globalWindow.TD.guides;
console.log('Existing guides count:', existingGuides.length);

// Check for ID duplicates
const existingIds = new Set(existingGuides.map(g => g.id));
for (const g of newGuides) {
  if (existingIds.has(g.id)) {
    console.error(`DUPLICATE ID FOUND: ${g.id}`);
    process.exit(1);
  }
  existingIds.add(g.id);
}

console.log('Total unique guide IDs after addition:', existingIds.size);

// Format the new guides nicely into JS
function formatGuide(g) {
  return '    {\n' +
    `      id: ${JSON.stringify(g.id)},\n` +
    `      t: ${JSON.stringify(g.t)},\n` +
    `      g: ${JSON.stringify(g.g)},\n` +
    `      mins: ${g.mins},\n` +
    `      diff: ${JSON.stringify(g.diff)},\n` +
    `      why: ${JSON.stringify(g.why)},\n` +
    `      need: ${JSON.stringify(g.need)},\n` +
    (g.diag ? `      diag: ${JSON.stringify(g.diag)},\n` : '') +
    '      steps: [\n' +
    g.steps.map(s => {
      let lines = ['        {'];
      lines.push(`          do: ${JSON.stringify(s.do)}`);
      if (s.cmd) {
        if (typeof s.cmd === 'string') {
          lines.push(`,          cmd: ${JSON.stringify(s.cmd)}`);
        } else {
          lines.push(`,          cmd: { win: ${JSON.stringify(s.cmd.win)}, mac: ${JSON.stringify(s.cmd.mac)} }`);
        }
      }
      if (s.out) lines.push(`,          out: ${JSON.stringify(s.out)}`);
      if (s.note) lines.push(`,          note: ${JSON.stringify(s.note)}`);
      lines.push('        }');
      return lines.join('\n');
    }).join(',\n') + '\n      ],\n' +
    '      fix: [\n' +
    g.fix.map(f => `        { p: ${JSON.stringify(f.p)}, s: ${JSON.stringify(f.s)} }`).join(',\n') + '\n      ],\n' +
    `      next: ${JSON.stringify(g.next)}\n` +
    '    }';
}

const formattedNewGuides = ',\n\n' + newGuides.map(formatGuide).join(',\n\n') + '\n\n';

// Replace the closing array bracket in originalContent
// Find the last '  ];'
const lastClosingBracket = originalContent.lastIndexOf('  ];');
if (lastClosingBracket === -1) {
  console.error('Could not find closing bracket   ]; in original file!');
  process.exit(1);
}

const updatedContent = originalContent.slice(0, lastClosingBracket) + formattedNewGuides + '  ];\n})(window.TD = window.TD || {});\n';

fs.writeFileSync(filePath, updatedContent, 'utf8');
console.log('Successfully updated guides.js!');

// Verify
const verifyWindow = {};
eval(updatedContent.replace('window.TD = window.TD || {}', 'verifyWindow.TD = verifyWindow.TD || {}'));
console.log('Verified guides count in updated file:', verifyWindow.TD.guides.length);
