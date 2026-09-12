(function (TD) {
  "use strict";

  TD.depth = (TD.depth || []).concat([
    {
      slug: "version-control",
      why: {
        before: "In early software engineering, developers versioned codebases manually by copying directories across local disks or shared network drives with informal names like 'project_v1', 'project_final', and 'project_final_v2_real'.",
        problem: "Manual file copying had zero atomic change tracking, no concurrent editing conflict detection (two engineers editing the same file silently overwrote each other's changes), no cryptographic tamper-evidence, and no rollback mechanism.",
        shift: "Version Control Systems (VCS)—evolving from local locked files (RCS, SCCS) to centralized client-server repositories (CVS, Subversion) and distributed Directed Acyclic Graphs (Git, Mercurial)—formalized software history as an immutable, audited graph of project snapshots."
      },
      num: {
        t: "Version Control System Generations & Architectures",
        h: ["VCS Generation / Paradigm", "System Architecture", "History & Storage Model", "Concurrency & Locking Strategy", "Branching Overhead & Speed"],
        r: [
          ["Local VCS (SCCS / RCS)", "Single local workstation only", "Forward or reverse text diff deltas per file", "Pessimistic file locking (one editor at a time)", "Zero native branching; manual file copies"],
          ["Centralized VCS (CVS / SVN)", "Central server + dumb client checkouts", "Central database of delta revisions (r1, r2...)", "Pessimistic locking or centralized optimistic merge", "Slow; copies entire directory tree on server (/branches/)"],
          ["Distributed VCS (Git / Mercurial)", "Fully distributed peer-to-peer repositories", "Immutable Directed Acyclic Graph (DAG) of snapshots", "Optimistic concurrency; automated 3-way merge", "Instantaneous (< 1 ms); lightweight 41-byte pointer refs"],
          ["Virtual / Cloud Monorepo (Jujutsu / Sapling)", "Distributed core + on-demand cloud virtual file systems", "Commit DAG with first-class working-copy commits", "Optimistic; background sparse checkouts", "Instantaneous; scales to multi-terabyte monorepos"]
        ],
        n: "The fundamental architectural revolution in version control was the transition from delta-based file revisions to snapshot-based Directed Acyclic Graphs (DAGs). In Centralized VCS (like Subversion / SVN), the repository resides strictly on a centralized server; clients check out only the latest working copy. Every commit, log query, and branch creation requires a synchronous network round-trip to the central server. If the server is unreachable, developers cannot commit, view commit histories, or create branches. In Distributed Version Control Systems (DVCS like Git), every developer's local clone contains the complete, full-fidelity history of the entire repository. Concurrency resolution shifted from pessimistic locking (where a developer checks out a file and locks it, preventing all other team members from modifying it until unlocked) to optimistic concurrency control backed by three-way merge algorithms. Every project state in a modern DVCS is identified by a cryptographic content hash (SHA-1 or SHA-256), creating a Merkle tree where history is immutable and tamper-evident."
      },
      miss: [
        {
          w: "Version control systems store changes as a sequential list of file diffs (deltas) from commit to commit.",
          r: "Modern DVCS like Git do not store diffs; each commit points to a complete root tree snapshot representing the exact state of all files in the project at that instant, using content-addressable deduplication so unchanged files share identical blob pointers."
        },
        {
          w: "Centralized VCS (like SVN) is more secure than Git because developers cannot download the full history.",
          r: "Centralized VCS creates a catastrophic single point of failure: if the central server hard drive corrupts or is compromised, the entire corporate commit history is lost; in DVCS, every developer clone serves as a full, authenticated cryptographic backup."
        },
        {
          w: "Version control is only useful for software source code files.",
          r: "Version control tracks any plain-text or structured configuration: Infrastructure-as-Code (Terraform), Kubernetes manifests, database migrations, CI/CD pipelines, documentation, and operational runbooks."
        },
        {
          w: "Committing large binary files (like multi-gigabyte video or dataset files) into Git works smoothly.",
          r: "Git's packfile delta-compression and local cloning mechanisms struggle with large non-text binaries, ballooning repository clone sizes to hundreds of gigabytes; large binaries require Git LFS (Large File Storage) pointers."
        }
      ],
      trade: {
        buys: [
          "Complete historical auditability: tracks every line modification, author identity, timestamp, and commit rationale forever.",
          "Confident experimental branching: developers branch and experiment without fear of destabilizing the mainline production codebase.",
          "Concurrent developer productivity: multiple engineers work on the same codebase simultaneously without locking files.",
          "Instantaneous rollback capability: revert regressions or redeploy historical production releases with a single command."
        ],
        costs: [
          "Learning curve complexity: mastering DVCS concepts (DAGs, rebasing, merge bases, detached HEADs) requires developer training.",
          "Merge conflict resolution friction: concurrent modifications to overlapping lines require manual developer reconciliation.",
          "Repository bloat liability: committing large binaries or secrets bloats clone sizes and permanently contaminates repository history.",
          "Tooling and pipeline maintenance: configuring branch protection rules, CI/CD webhooks, and code review governance."
        ],
        avoid: [
          "Committing un-redacted API secrets, private keys, or passwords into version control repositories.",
          "Using version control as a file-sharing sync tool for multi-gigabyte compiled binaries and media files (use Git LFS).",
          "Writing monolithic, multi-week feature branches that diverge so far from mainline that merging becomes impossible.",
          "Allowing direct, unprotected pushes to production mainline branches (main/master) without code reviews."
        ]
      }
    },
    {
      slug: "git",
      why: {
        before: "In 2005, the Linux kernel project relied on BitKeeper, a proprietary distributed version control system. When the commercial relationship broke down and BitKeeper revoked free licensing, Linus Torvalds needed a free tool capable of handling thousands of kernel patches daily.",
        problem: "Existing open-source version control systems (CVS, Subversion) were centralized, painfully slow on massive codebases (taking minutes to compute diffs or branches), and lacked cryptographic integrity validation against disk corruption.",
        shift: "Linus Torvalds created Git in 2005 as a Content-Addressable Filesystem with a version control user interface, modeling project history as an immutable Directed Acyclic Graph (DAG) of cryptographically hashed objects (SHA-1 / SHA-256)."
      },
      num: {
        t: "Git Internal Object Model & Storage Primitives",
        h: ["Object Type", "Data Payload Content", "Storage Format (Header + Body)", "Filesystem Location", "Architectural Role in Git DAG"],
        r: [
          ["blob", "Raw file content data bytes", "'blob <size>\\0<bytes>'", ".git/objects/xx/xxxx...", "Stores file data; zero awareness of filename or permissions"],
          ["tree", "List of mode bits, types, hashes, filenames", "'tree <size>\\0<entries>'", ".git/objects/xx/xxxx...", "Represents a directory; maps filenames to child blobs or trees"],
          ["commit", "Tree hash, parent hashes, author, committer, message", "'commit <size>\\0<data>'", ".git/objects/xx/xxxx...", "Represents a point-in-time snapshot in the commit DAG"],
          ["tag (annotated)", "Commit hash, tagger identity, timestamp, GPG signature", "'tag <size>\\0<data>'", ".git/objects/xx/xxxx...", "Immutable, cryptographically signed release milestone pointer"],
          ["packfile", "Sliding-window delta-compressed object archives", "Binary .pack index + compressed payload", ".git/objects/pack/", "Massively compresses historical objects into compact archives"]
        ],
        n: "Git is fundamentally a content-addressable key-value object store located in the hidden .git/ directory. Every piece of stored data is an immutable object addressed by its cryptographic hash (historically SHA-1, modern Git supports SHA-256). An object's hash is computed over a standardized header: SHA1('<type> <size>\\0<payload>'). The four core object types form a hierarchical Merkle Tree: 1) **blob**: stores raw file content without metadata; 2) **tree**: models directory hierarchies, containing an array of (mode, filename, SHA) entries pointing to blobs or nested trees; 3) **commit**: points to a root tree object, records one or more parent commit SHAs, author/committer identities, and the commit message; 4) **annotated tag**: provides an immutable reference to a specific commit. Git coordinates state across **The Three Trees**: 1) The Working Directory (the actual checked-out files on your local filesystem); 2) The Staging Area / Index (the binary file at .git/index staging the proposed next commit); 3) The HEAD commit (the active commit snapshot in the DAG). To prevent disk exhaustion from thousands of loose object files, Git executes garbage collection (git gc), consolidating loose objects into packfiles (.pack) using sliding-window Boyer-Moore delta compression, compressing historical repositories by 80% to 95%."
      },
      miss: [
        {
          w: "Git branches are separate physical folders on your computer containing duplicate copies of your code.",
          r: "A Git branch is a tiny 41-byte plain-text file in .git/refs/heads/ containing a single 40-character commit hash; switching branches updates .git/HEAD and updates working directory files in place."
        },
        {
          w: "Git stores the difference (diff/patch) between files from commit to commit.",
          r: "Git stores full root tree snapshots for every commit; it deduplicates unchanged files by pointing to existing blob hashes, and computes diffs dynamically on demand via fast in-memory tree traversal."
        },
        {
          w: "Deleting a file with 'rm' on your computer deletes it from Git history.",
          r: "Deleting a local file merely removes it from your working directory; to reflect the deletion in Git, you must stage the deletion (git add/rm) and commit; historical commits permanently retain the file unless rewritten with git-filter-repo."
        },
        {
          w: "Git and GitHub are the exact same technology created by the same organization.",
          r: "Git is an open-source, command-line distributed version control system created by Linus Torvalds; GitHub is a commercial cloud hosting and collaboration platform (owned by Microsoft) that hosts Git repositories."
        }
      ],
      trade: {
        buys: [
          "Extreme local performance: diffs, logs, branches, and commits execute locally in milliseconds without network connectivity.",
          "Cryptographic data integrity: every file, tree, and commit is hashed in a Merkle DAG, preventing silent corruption or tampering.",
          "Universal software standard: ubiquitous adoption across developer tooling, CI/CD platforms, IDEs, and cloud hosting.",
          "Distributed resilience: every clone is a complete cryptographic backup of the entire repository history."
        ],
        costs: [
          "Steep conceptual learning curve: mastering plumbing vs porcelain commands, refspecs, and DAG rebasing requires effort.",
          "Large binary inefficiency: tracking massive non-text files (videos, ML models) bloats local repository clone sizes.",
          "Irreversible command danger: destructive commands (git reset --hard, git push --force) can permanently discard uncommitted work.",
          "Monorepo scaling limits: vanilla Git struggles on massive enterprise repositories with millions of files without virtual file systems (VFS)."
        ],
        avoid: [
          "Executing 'git push --force' on shared team branches (use '--force-with-lease' to prevent overwriting others' work).",
          "Committing build artifacts, temporary files, or node_modules into Git (always configure a robust .gitignore).",
          "Running 'git reset --hard' without checking 'git status' and 'git diff' to ensure uncommitted work is not destroyed.",
          "Storing large datasets or machine learning model weights directly in Git blobs without Git LFS."
        ]
      }
    },
    {
      slug: "commit",
      why: {
        before: "In centralized version control systems (SVN, CVS), saving changes required a network call that updated a global sequential integer revision on a remote server (e.g., r1042).",
        problem: "Developers could not save progressive checkpoints while offline, commits were tied to linear global numbers rather than cryptographic hashes, and rollbacks required complex reverse-patch calculations.",
        shift: "In Git, a commit is an immutable snapshot object in a local Directed Acyclic Graph (DAG), capturing the entire state of the project tree at a specific moment in time and referenced by a cryptographic content hash."
      },
      num: {
        t: "Git Commit Internal Anatomy & Header Breakdown",
        h: ["Commit Component", "Payload Stored", "Internal Formatting Syntax", "Cryptographic Role", "Developer Best Practice"],
        r: [
          ["Tree Pointer", "Root directory tree SHA hash", "'tree 7a8b9c0d...\\n'", "Binds the commit to the complete snapshot of all files", "Keep commits focused on single logical changes"],
          ["Parent Pointer(s)", "SHA hash(es) of ancestor commit(s)", "'parent d670460b...\\n' (Multiple for merge commits)", "Forms the edges in the Git Directed Acyclic Graph (DAG)", "Avoid criss-cross merge parent pollution"],
          ["Author Identity", "Name, email, and Unix epoch timestamp", "'author Jane Doe <jane@corp.com> 1700000000 +0000\\n'", "Records who originally created the code change", "Configure standard corporate email in git config"],
          ["Committer Identity", "Name, email, and Unix epoch timestamp", "'committer CI Bot <ci@corp.com> 1700000500 +0000\\n'", "Records who applied or rebased the commit into the branch", "Differentiates rebasers/cherry-pickers from author"],
          ["Commit Message", "Subject line + optional blank line + body", "'feat: implement JWT auth middleware\\n\\nCloses #42'", "Explains the engineering 'why' behind the change", "Follow Conventional Commits (feat, fix, refactor)"]
        ],
        n: "A Git commit is an immutable plain-text object stored in .git/objects/ containing structured metadata that points to the root directory tree. When a developer executes git commit, Git performs five operations: 1) It writes the current Staging Area (.git/index) into a tree object; 2) It identifies the current commit pointed to by HEAD as the parent commit; 3) It reads the author and committer names, emails, and current timestamps from git config and system clocks; 4) It constructs the commit text payload and computes its cryptographic hash: SHA = Hash('commit <size>\\0<payload>'); 5) It compresses the commit object with zlib and writes it to disk; 6) It updates the current branch ref file (e.g., .git/refs/heads/main) to point to the new commit's SHA. Because a commit's hash is computed over its tree SHA and its parent commit SHA, modifying any past commit in the history alters its hash, which recursively alters the hashes of all subsequent descendant commits—providing cryptographic proof of history. Modern engineering mandates **Atomic Commits**: each commit represents a single logical unit of change that compiles and passes tests independently, paired with Conventional Commits specifications (e.g., 'feat: add rate limiting middleware', 'fix: resolve race condition in token refresh') to facilitate automated semantic versioning and changelog generation."
      },
      miss: [
        {
          w: "A Git commit stores a file diff showing which lines of code were added or deleted.",
          r: "A Git commit stores a pointer to a full root tree snapshot of the entire project; Git computes diffs dynamically on the fly when you run 'git show' or 'git diff' by comparing two tree snapshots."
        },
        {
          w: "The commit author and the commit committer are always the exact same person.",
          r: "Git strictly differentiates Author (who wrote the code) from Committer (who applied, rebased, or cherry-picked the commit); rebasing code preserves the original author but updates the committer identity and timestamp."
        },
        {
          w: "Amending a commit with 'git commit --amend' edits the existing commit in place.",
          r: "Git objects are strictly immutable; 'git commit --amend' creates an entirely brand-new commit object with a new hash, abandoning the old commit in the reflog."
        },
        {
          w: "Writing short commit messages like 'fixed stuff' or 'wip' is harmless in professional engineering.",
          r: "Poor commit messages destroy maintainability, make 'git bisect' root-cause debugging difficult, break automated changelog generators, and obscure the architectural rationale behind changes during code reviews."
        }
      ],
      trade: {
        buys: [
          "Immutable project snapshots: captures verifiable, reproducible states of the entire application across time.",
          "Bisect debugging capability: allows 'git bisect' to execute automated binary searches across commits to find regression bugs in seconds.",
          "Atomic rollback safety: revert a single flawed feature commit cleanly using 'git revert' without unravelling adjacent work.",
          "Automated release pipelines: structured commit messages (Conventional Commits) drive automated version bumps and release notes."
        ],
        costs: [
          "Commit discipline overhead: requires developers to structure work into clean, atomic commits rather than massive 'end-of-week' dumps.",
          "Storage amplification for uncompressed binaries: committing accidental binary files permanently bloats repository object stores.",
          "History rewriting hazards: modifying published commits (via rebase or amend) disrupts collaborator repositories.",
          "Staging area management: requires developers to selectively stage files (using 'git add -p') to separate logical changes."
        ],
        avoid: [
          "Lumping unrelated changes (e.g., a bug fix, a refactor, and dependency updates) into a single monolithic commit.",
          "Writing vague, useless commit messages (e.g., 'update', 'fix bug', 'changes') without explaining the engineering context.",
          "Amending or rewriting commits that have already been pushed to a shared team branch.",
          "Committing broken code that fails unit tests or prevents the project from compiling."
        ]
      }
    },
    {
      slug: "branch",
      why: {
        before: "In centralized version control systems (such as Subversion / SVN), creating a branch required copying the entire project directory tree into a new '/branches/feature-x/' folder on the central server, taking minutes and consuming server storage.",
        problem: "Because branching was slow, expensive, and heavy, software teams avoided branching; developers worked directly on the shared mainline trunk, constantly breaking the build for colleagues and blocking long-term experimental work.",
        shift: "Git revolutionized software development by making branches ephemeral, 41-byte plain-text pointer files containing a single commit hash, making branch creation, switching, and deletion instantaneous (< 1 ms)."
      },
      num: {
        t: "Branching Mechanics Across Version Control Systems",
        h: ["VCS System / Platform", "Physical Branch Implementation", "Creation & Switch Latency", "Storage Footprint per Branch", "Primary Branching Model"],
        r: [
          ["Subversion (SVN)", "Full directory copy on central server (/branches/)", "Seconds to minutes (network-dependent)", "Storage proportional to repository files metadata", "Trunk-based with infrequent, heavy release branches"],
          ["Git (Modern Standard)", "41-byte plain-text file in .git/refs/heads/", "Sub-millisecond (< 1 ms; local file write)", "41 bytes on disk; zero object duplication", "Lightweight short-lived feature branches, GitHub Flow"],
          ["Mercurial (hg)", "Named branch metadata baked into changeset records", "Fast (< 10 ms)", "Embedded in changeset history (permanent names)", "Bookmarks (lightweight) or permanent named branches"],
          ["Perforce (Helix Core)", "Inter-file branch views and integration mappings", "Seconds; server metadata mapping", "Server metadata overhead", "Mainline branching / Stream-based development"]
        ],
        n: "In Git, a branch is not a directory or a separate container of files; a branch is strictly a movable pointer to a commit object in the DAG. When a developer creates a branch (git branch feature-auth), Git simply writes the current 40-character commit hash into a new text file at .git/refs/heads/feature-auth (consuming exactly 41 bytes including the trailing newline). When the developer switches branches (git switch feature-auth), Git updates the special pointer file .git/HEAD to contain the string 'ref: refs/heads/feature-auth', and checks out the corresponding tree snapshot into the working directory. When a new commit is created, Git creates the commit object, links it to the previous commit as parent, and moves the active branch ref pointer (.git/refs/heads/feature-auth) forward to point to the new commit SHA. Fast-forward merges occur when Branch A has not diverged from Branch B: Git integrates the changes simply by moving Branch A's pointer file forward to match Branch B's commit hash, creating zero merge commits. Remote-tracking branches (.git/refs/remotes/origin/main) maintain local read-only mirrors of upstream repository pointers, updated whenever git fetch or git pull is executed."
      },
      miss: [
        {
          w: "Creating a new Git branch duplicates all the files and folders of your project on your hard drive.",
          r: "Creating a branch allocates zero file copies; it creates a 41-byte text file containing a 40-character commit hash, pointing to the exact same shared, immutable Git objects in .git/objects/."
        },
        {
          w: "You must always create long-lived branches (like 'develop', 'release', 'staging') for a Git workflow to succeed.",
          r: "Modern high-performing engineering teams use Trunk-Based Development: engineers create short-lived feature branches that merge back into the main trunk within 24 to 48 hours, using feature flags rather than long-lived branches."
        },
        {
          w: "Deleting a branch deletes all the commit history created on that branch.",
          r: "Deleting a branch (git branch -d) merely deletes the 41-byte pointer file; the commits remain intact in the local object database and can be recovered via the Git Reflog (git reflog) until garbage-collected weeks later."
        },
        {
          w: "A 'Detached HEAD' state means your Git repository is corrupted and broken.",
          r: "Detached HEAD simply means .git/HEAD points directly to a specific commit hash rather than a named branch ref file; any commits made in this state are orphaned unless explicitly saved to a new branch."
        }
      ],
      trade: {
        buys: [
          "Zero-cost task isolation: engineers isolate features, bug fixes, and experiments without impacting teammates.",
          "Parallel development velocity: dozens of engineers work concurrently on disparate features without stepping on each other.",
          "Clean code review boundaries: short-lived feature branches provide concise, focused scopes for pull requests and CI testing.",
          "Non-destructive experimentation: test architectural spikes or risky refactors on branches that can be cleanly discarded."
        ],
        costs: [
          "Merge debt on long-lived branches: branches that diverge from mainline for weeks accumulate massive, painful merge conflicts.",
          "Branch sprawl maintenance: unpruned, abandoned remote branches clutter repositories and confuse team members.",
          "Context switching overhead: frequently stashing and switching branches disrupts local developer workflows.",
          "Complex Git graph topologies: disorganized branching strategies create tangled, unreadable commit histories."
        ],
        avoid: [
          "Maintaining long-lived feature branches for weeks or months without regularly rebasing or merging upstream main.",
          "Committing directly to production mainline branches without branch protection rules enabled.",
          "Leaving stale, merged feature branches unpruned on remote repositories (configure automated branch deletion in GitHub).",
          "Naming branches ambiguously (e.g., 'test' or 'temp') instead of using structured conventions (e.g., 'feat/auth-jwt', 'fix/login-race')."
        ]
      }
    },
    {
      slug: "merge",
      why: {
        before: "In early software collaboration, integrating code across divergent developer branches required manually generating unified diff patches (diff -u) and applying them via patch tools.",
        problem: "Two-way diffing algorithms lacked common ancestor context: when both developers modified a file, the merge engine could not determine which version was the original baseline and which was the newer modification, causing silent regressions and false conflicts.",
        shift: "The Three-Way Merge algorithm (3-way merge) revolutionized software integration: by locating the Most Recent Common Ancestor (MRCA / merge base) of two divergent branches, the engine automatically reconciles non-overlapping changes across branches."
      },
      num: {
        t: "Git Merge Strategies & Architectural Execution",
        h: ["Merge Strategy / Flag", "Ancestor Graph Prerequisite", "Resulting Commit History Topology", "Merge Conflict Behavior", "Primary Production Use Case"],
        r: [
          ["Fast-Forward Merge (--ff)", "Target branch tip is an ancestor of incoming branch", "Linear history; moves pointer forward; zero merge commit", "Zero conflicts possible (by definition)", "Integrating short-lived feature branches rebased on main"],
          ["Non-Fast-Forward Merge (--no-ff)", "Any valid commit graph", "Explicit merge commit with 2 parents; non-linear graph", "Standard 3-way conflict resolution", "Preserving historical record of feature branch lifecycles"],
          ["Squash Merge (--squash)", "Any valid commit graph", "Combines all branch commits into a single 1-parent commit", "Standard 3-way conflict resolution", "Trunk-based development; clean linear main history"],
          ["Recursive / ORT Strategy", "Divergent branches with complex or criss-cross ancestors", "Computes virtual common ancestor; handles directory renames", "High conflict resolution accuracy; rename detection", "Default Git merge engine (ORT is default in Git 2.34+)"],
          ["Octopus Merge", "Merging 3 or more branches simultaneously", "Creates a single merge commit with N parents", "Fails immediately if any conflict occurs", "Bundling multiple tested topic branches into release branches"]
        ],
        n: "The mathematical foundation of modern code integration is the **Three-Way Merge Algorithm**. Given two divergent branches—Branch A (ours) and Branch B (theirs)—Git automatically searches the DAG to locate their Most Recent Common Ancestor (MRCA, known as the Merge Base, O). For every line chunk in a file, Git compares the three versions: 1) If chunk in A matches O, but chunk in B differs from O, Git accepts B's modification (Branch B changed it, Branch A did not); 2) If chunk in B matches O, but chunk in A differs from O, Git accepts A's modification; 3) If both A and B made the exact same modification matching each other, Git accepts it; 4) If both A and B modified the chunk differently from O and differently from each other, a **Merge Conflict** is declared. In Git 2.34+, the default merge engine is **ORT (Ostensibly Recursive's Twin)**, a total rewrite of the legacy 'recursive' strategy. ORT re-architected merge execution to resolve complex 'criss-cross' merge histories (where two branches share multiple non-unique common ancestors) by generating a virtual ancestor commit that synthesizes the common bases. Furthermore, ORT implements advanced directory rename detection and memoization, executing massive repository merges up to 10x faster entirely in memory without dirtying working trees."
      },
      miss: [
        {
          w: "A Git merge always creates a merge commit with two parent commit hashes.",
          r: "If the target branch has not diverged from the incoming branch, Git performs a Fast-Forward merge by default: it simply moves the branch pointer forward without creating a merge commit (unless --no-ff is specified)."
        },
        {
          w: "Squash merging preserves the individual commit histories of the feature branch in the main branch.",
          r: "Squash merging collapses all commits from the feature branch into a single brand-new commit on the target branch; individual intermediate commit hashes, messages, and timestamps are completely discarded from the mainline history."
        },
        {
          w: "Git resolves merge conflicts by picking the version with the most recent timestamp.",
          r: "Git never uses timestamps to resolve conflicts; if two branches modify the same lines differently relative to the common ancestor, Git stops and requires human intervention to reconcile the code."
        },
        {
          w: "Merging main into your feature branch before opening a PR is harmful and should be avoided.",
          r: "Merging (or rebasing) main into your feature branch early allows you to test your feature against the latest codebase and resolve merge conflicts locally before impacting shared integration environments."
        }
      ],
      trade: {
        buys: [
          "Automated non-overlapping integration: merges thousands of lines of concurrent code across disparate files automatically.",
          "Preserved branch history: non-fast-forward merges document exactly when a feature was integrated and who approved it.",
          "Deterministic three-way reconciliation: mathematical common-ancestor analysis eliminates guesswork during code integration.",
          "High-throughput collaboration: enables hundreds of developers to work on shared codebases without synchronization bottlenecks."
        ],
        costs: [
          "Non-linear history tangles: frequent merge commits create messy, criss-crossed Git graph topologies that complicate debugging.",
          "Merge conflict resolution friction: resolving overlapping changes requires developer time, manual diffing, and testing.",
          "Semantic merge regression risk: code can merge cleanly with zero textual conflicts while introducing breaking functional bugs.",
          "Bisect traversal friction: non-linear merge commits make automated 'git bisect' regression searches harder to trace."
        ],
        avoid: [
          "Resolving merge conflicts by blind copy-pasting without running the application's automated test suite locally.",
          "Creating massive merge commits combining weeks of diverged code across hundreds of files.",
          "Using Fast-Forward merges when organizational policy requires tracking explicit feature branch boundaries.",
          "Ignoring semantic merge conflicts: always run integration tests after a merge even if Git reports 'Automatic merge went well'."
        ]
      }
    },
    {
      slug: "rebase",
      why: {
        before: "When developers needed to integrate upstream changes from the main branch into long-running feature branches, they repeatedly merged main into their branch, cluttering project history with dozens of redundant 'Merge branch main into feature' commits.",
        problem: "Tangled, criss-crossed merge graphs made Git histories unreadable, complicated automated regression tracking (git bisect), and made it impossible to maintain a clean linear commit narrative.",
        shift: "git rebase introduced the ability to rewrite project history by detaching a sequence of feature branch commits and replaying them one-by-one on top of a new upstream base commit, maintaining a pristine, perfectly linear project history."
      },
      num: {
        t: "Git Merge vs Git Rebase Architectural Comparison",
        h: ["Dimension / Behavior", "git merge (Non-Fast-Forward)", "git rebase", "git merge --squash"],
        r: [
          ["History Topology", "Non-linear; preserves branched DAG graph with merge commits", "Strictly linear; zero merge commits; flat chronological line", "Linear; single combined commit on target branch"],
          ["Commit Hashes (SHAs)", "Preserves original commit SHAs intact", "Creates brand-new commit SHAs for all replayed commits", "Creates a single brand-new commit SHA"],
          ["Conflict Resolution Timing", "Resolved once during the single merge commit", "Resolved commit-by-commit as each patch is replayed", "Resolved once during the single squash commit"],
          ["Golden Rule Compliance", "Safe on public, shared team branches", "Dangerous on shared public branches; rewriting history breaks peers", "Safe; commits only to the target branch"],
          ["Bisect & Revert Ergonomics", "Complex bisect paths; reverting merge commit requires -m flag", "Ideal bisect paths; clean single-commit git revert", "Single coarse-grained revert of entire feature"]
        ],
        n: "The internal execution sequence of git rebase operates in four distinct phases: 1) Git identifies the Most Recent Common Ancestor (merge base) between the current branch (feature) and the upstream target (main); 2) Git generates unified diff patches for every commit on feature since the merge base and stores them in memory (or .git/rebase-apply/); 3) Git resets the current branch pointer to the tip of main (equivalent to git reset --hard main); 4) Git iterates through the stored patches, applying them sequentially onto the new base commit. Because each replayed commit has a new parent commit hash and a new timestamp, **git rebase creates brand-new commit objects with brand-new SHA hashes**—even if the code diff is identical! The governing operational constraint is **The Golden Rule of Rebasing**: *Never rebase a branch that has been pushed to a public, shared repository where other developers are actively collaborating.* Because rebasing replaces old commits with new hashes, force-pushing a rebased shared branch destroys the commit graph for teammates, causing divergent histories and duplicate commits. Interactive Rebasing (git rebase -i) provides fine-grained history editing: developers can reorder commits, squash messy 'wip' commits into clean atomic units, edit commit messages (reword), and drop obsolete changes before opening a pull request."
      },
      miss: [
        {
          w: "git rebase simply moves existing commit objects to a new location in the Git repository.",
          r: "Git objects are cryptographically immutable; git rebase does not move anything; it creates brand-new commit objects with new parent hashes and new SHAs, leaving old commits orphaned in the reflog."
        },
        {
          w: "Using git rebase is always better than git merge under all circumstances.",
          r: "Rebasing rewrites history and destroys the historical record of when features were actually merged; for long-lived integration branches or public open-source forks, merging provides an accurate, non-destructive audit trail."
        },
        {
          w: "If you encounter merge conflicts during a rebase, your work is permanently corrupted and lost.",
          r: "A rebase can be safely aborted at any moment by running 'git rebase --abort', which instantly restores the branch to its exact pre-rebase state."
        },
        {
          w: "Pushing a rebased branch always requires running 'git push --force'.",
          r: "You should never use raw 'git push --force'; always use 'git push --force-with-lease', which verifies that no teammate has pushed new commits to the remote branch before overwriting the remote ref."
        }
      ],
      trade: {
        buys: [
          "Pristine linear Git history: eliminates messy merge commit noise, creating an intuitive, chronological project timeline.",
          "Effortless regression debugging: enables 'git bisect' to perform automated binary searches cleanly without navigating branch forks.",
          "Atomic PR preparation: interactive rebase (git rebase -i) allows developers to clean up messy local commits before code review.",
          "Simplified cherry-picking and reverts: linear commits can be individually cherry-picked or reverted with zero merge parent ambiguity."
        ],
        costs: [
          "Repeated conflict resolution: rebasing across multiple commits may force developers to resolve conflicts repeatedly on each commit.",
          "Public collaboration hazard: force-pushing rebased branches to shared repositories breaks collaborator local clones.",
          "Loss of chronological merge context: obscures the historical timeline of when code was originally written relative to main.",
          "Steep developer learning curve: confusing rebase conflicts and detached states can intimidate junior developers."
        ],
        avoid: [
          "Rebasing shared public branches (e.g., main, develop, or shared release branches).",
          "Using 'git push --force' instead of the safer 'git push --force-with-lease'.",
          "Rebasing long-running feature branches with hundreds of commits without squashing intermediate noise first.",
          "Panicking during rebase conflicts: use 'git rebase --abort' to return safely to the starting point if confused."
        ]
      }
    },
    {
      slug: "merge-conflict",
      why: {
        before: "Early concurrent revision systems used pessimistic file locking: before editing a file, a developer checked out a lock on the server; other developers were blocked from editing that file until the lock was released.",
        problem: "Pessimistic locking crippled team velocity: developers waited hours or days for locks to release, and forgotten locks halted entire sprint workflows.",
        shift: "Optimistic concurrency control allowed all developers to edit any file simultaneously, with three-way merge algorithms integrating changes automatically and triggering a 'Merge Conflict' strictly when two branches modified the exact same lines of code divergently."
      },
      num: {
        t: "Git Merge Conflict Anatomy & Index Resolution Stages",
        h: ["Conflict Marker / Stage", "Syntax Representation", "Internal Staged Version Meaning", "Underlying Git Index Stage", "Developer Action Required"],
        r: [
          ["Stage 1 (Merge Base)", "git checkout --merge / :1:file", "The original common ancestor version before divergence", "Index Stage 1 (.git/index)", "Reference baseline to understand what both sides changed"],
          ["Stage 2 (Ours / HEAD)", "<<<<<<< HEAD", "The current active branch version (where you are merging into)", "Index Stage 2 (.git/index)", "Keep our changes or reconcile with incoming changes"],
          ["Conflict Separator", "=======", "Boundary separator dividing our changes from their changes", "N/A (Visual marker in working tree)", "Must be deleted during conflict resolution"],
          ["Stage 3 (Theirs / Incoming)", ">>>>>>> branch-name", "The incoming branch version being integrated", "Index Stage 3 (.git/index)", "Keep incoming changes or reconcile with our changes"],
          ["Diff3 Style Conflict", "||||||| merged common ancestors", "Displays the common ancestor code directly between ours and theirs", "Enabled via merge.conflictStyle=zdiff3", "Highly recommended: reveals the exact original code baseline"]
        ],
        n: "A merge conflict occurs when the three-way merge engine detects that a specific line range in a file differs from the Common Ancestor (Base, Stage 1) in both the current branch (HEAD, Stage 2) and the incoming branch (Theirs, Stage 3), and the modifications are not identical. When this condition occurs, Git halts automated merging, writes the conflict markers directly into the working directory file, and records all three versions in the Git Index (.git/index) at stages 1, 2, and 3. By default, Git inserts standard two-way conflict markers (<<<<<<< HEAD, =======, >>>>>>> branch). Software engineers should immediately configure 'git config --global merge.conflictStyle zdiff3': zdiff3 embeds the common ancestor code directly inside the markers (||||||| base), allowing developers to see the exact original baseline and understand the architectural intent of both branches. To accelerate conflict resolution across repeated rebases, Git provides **git rerere (Reuse Recorded Resolution)**: when enabled via 'git config --global rerere.enabled true', Git takes a cryptographic fingerprint of the conflict pre-image and records the developer's resolved post-image. If the exact same conflict is encountered again during subsequent rebases, Git replays the resolution automatically, eliminating repetitive manual conflict resolution."
      },
      miss: [
        {
          w: "A merge conflict means someone wrote bad code or made a serious programming mistake.",
          r: "Merge conflicts are normal, expected occurrences in collaborative software engineering when two developers legitimately modify overlapping areas of the codebase concurrently."
        },
        {
          w: "You must always choose either 'Accept Current Change' or 'Accept Incoming Change' in your IDE.",
          r: "Choosing one side blindly frequently introduces regressions; resolving a conflict often requires combining both changes, refactoring the logic, or rewriting the block to support both features."
        },
        {
          w: "If a Git merge completes without any merge conflicts, the integrated software is guaranteed to work.",
          r: "Git detects only textual conflicts; it has zero awareness of semantic logic. Code can merge cleanly with zero text conflicts while introducing catastrophic runtime bugs (e.g., Branch A renames a function while Branch B calls the old function name)."
        },
        {
          w: "Git rerere automatically resolves new, unseen conflicts without human intervention.",
          r: "Git rerere (Reuse Recorded Resolution) only replays resolutions for conflicts that a human has *already resolved once before*; it never guesses how to resolve a new conflict."
        }
      ],
      trade: {
        buys: [
          "Safe optimistic concurrency: allows hundreds of engineers to edit code simultaneously without file locks.",
          "Deterministic boundary notification: prevents code modifications from silently overwriting overlapping logic.",
          "Resolution reuse via rerere: eliminates redundant conflict resolution when rebasing long-running feature branches.",
          "Granular index inspection: inspect individual ancestor, ours, and theirs stages using standard Git plumbing commands."
        ],
        costs: [
          "Developer time and cognitive friction: reconciling complex conflicts in large files requires careful code analysis.",
          "Semantic regression hazard: textually clean merges can still break application logic, requiring comprehensive automated test suites.",
          "False resolution risks: developers rushing to resolve conflicts can accidentally delete critical bug fixes or features.",
          "Rebase friction: rebasing a multi-commit branch across a conflicted base forces resolving the conflict across each commit."
        ],
        avoid: [
          "Resolving conflicts and committing without running unit tests and integration tests locally.",
          "Leaving unedited conflict markers (<<<<<<< HEAD) inside source code files, causing syntax compile crashes in production.",
          "Using default two-way conflict markers instead of configuring 'merge.conflictStyle = zdiff3'.",
          "Postponing conflict resolution for weeks by avoiding merging or rebasing upstream main into your feature branch."
        ]
      }
    },
    {
      slug: "pull-request",
      why: {
        before: "In early open-source and distributed development, sharing code required generating formatted patch files using 'git format-patch' and emailing them to public mailing lists (like the Linux Kernel Mailing List), where maintainers reviewed and applied them via 'git am'.",
        problem: "Email patch workflows had high operational friction: inline code discussions were fragmented across email threads, CI/CD automated testing could not easily report status, and tracking the review status of hundreds of patches required manual spreadsheet bookkeeping.",
        shift: "GitHub introduced the Pull Request (PR, in 2008 / GitLab Merge Request), creating a web-based collaboration, code review, automated testing, and branch governance hub that transformed modern software engineering workflows."
      },
      num: {
        t: "Code Integration & Review Workflows Comparison",
        h: ["Collaboration Model", "Review & Discussion Medium", "Automated CI/CD Integration", "Branch Protection Enforcement", "Primary Modern Adoption"],
        r: [
          ["Mailing List Patches (git send-email)", "Plain-text email threads (LKML)", "External automated bots replying via email", "Manual maintainer gatekeeping", "Linux kernel, Git core, PostgreSQL open-source"],
          ["Pull Request (GitHub / Bitbucket)", "Web forge UI with line-by-line diff threads", "Native webhook integration + Checks API (GitHub Actions)", "Cryptographic branch protection rules + mandatory reviews", "Global open source, standard enterprise SaaS engineering"],
          ["Merge Request (GitLab)", "Integrated GitLab Web UI + Web IDE", "Deep native GitLab CI/CD pipeline integration", "Protected branches, approval rules, merge trains", "Self-hosted enterprise, DevOps-centric organizations"],
          ["Change List (Gerrit / Google Piper)", "Per-commit review tool (Gerrit Code Review)", "Automated verification labels (+1, +2, Verified)", "Strict per-commit gating; zero fast-forward merges", "Android AOSP, Chromium, Google internal monorepos"],
          ["Trunk-Based Direct Push", "None (Direct push to main trunk)", "Post-commit CI builds; rollback on failure", "Zero branch gating; relies on high trust and feature flags", "High-velocity hyper-mature continuous delivery teams"]
        ],
        n: "A Pull Request (PR) is not a native Git command; it is a server-side repository forge abstraction built on top of Git remote branch tracking. When a developer pushes a branch (feature-auth) and opens a PR against the target branch (main), the forge executes an automated architectural lifecycle: 1) **Three-Way Diff Calculation**: The forge identifies the merge base between feature-auth and main and renders the unified diff in a web interface; 2) **Automated CI/CD Gating**: The forge fires webhook events (pull_request.opened), triggering CI/CD pipelines (e.g., GitHub Actions) to run linters, unit tests, security SAST scanners, and container builds in parallel; 3) **Branch Protection Enforcement**: Branch protection policies evaluate prerequisites: requiring status checks to pass, requiring minimum peer approvals (e.g., 2 approvals from CODEOWNERS), and requiring up-to-date branches; 4) **Peer Code Review**: Reviewers comment directly on specific diff lines, suggest code replacements, and submit formal reviews (Comment, Approve, Request Changes); 5) **Merge Execution**: Upon satisfaction of all gates, the forge executes the integration using one of three Git strategies: a true merge commit (--no-ff), a rebase and merge, or a squash and merge (collapsing all branch commits into a single atomic mainline commit)."
      },
      miss: [
        {
          w: "A Pull Request is a built-in command in the open-source Git command-line tool.",
          r: "Git CLI has 'git request-pull' (which generates an informational text summary for email), but the interactive web-based Pull Request with line comments, review workflows, and CI checks is a proprietary platform feature of GitHub, GitLab, and Bitbucket."
        },
        {
          w: "Submitting massive 2,000-line Pull Requests once a month is an effective engineering practice.",
          r: "'Large PRs receive rubber-stamp approvals, while 10-line PRs receive 20 comments'; massive PRs are impossible to review effectively, hide critical bugs, block CI pipelines, and cause painful merge conflicts (keep PRs under 400 lines)."
        },
        {
          w: "A Pull Request can only be merged if it has zero merge conflicts.",
          r: "Having zero textual merge conflicts is necessary but insufficient; PRs must also satisfy all branch protection gates: passing automated CI tests, receiving peer approvals, passing security audits, and having resolved review conversations."
        },
        {
          w: "Pull Request code reviews are solely intended to catch syntax typos and styling errors.",
          r: "Syntax and styling must be automated via linters and formatters in CI; human code reviews must focus on architectural design, edge cases, security implications, maintainability, and business logic correctness."
        }
      ],
      trade: {
        buys: [
          "Enforced software quality gates: automated CI tests and peer reviews block buggy or insecure code from reaching production.",
          "Knowledge sharing and team mentorship: junior engineers learn architectural patterns and best practices from senior code reviews.",
          "Asynchronous global collaboration: enables distributed engineering teams to review and discuss code across global time zones.",
          "Audited compliance governance: provides immutable compliance trails showing who authored, reviewed, and approved every production change."
        ],
        costs: [
          "Developer cycle time latency: waiting for peer code reviews can stall feature velocity and lead to context switching.",
          "Reviewer fatigue and cognitive overhead: reviewing hundreds of lines of complex diffs consumes significant engineering bandwidth.",
          "CI/CD compute infrastructure expenses: running heavy automated test suites on every PR push incurs significant cloud runner costs.",
          "Interpersonal friction: poorly phrased, overly pedantic code review comments can create friction and toxicity within engineering teams."
        ],
        avoid: [
          "Submitting massive, multi-thousand-line monolithic Pull Requests that overwhelm peer reviewers.",
          "Debating code formatting, tabs vs spaces, or variable naming in PR reviews (automate this via Prettier and ESLint in CI).",
          "Merging Pull Requests with failing CI status checks or bypassing branch protection rules without emergency break-glass procedures.",
          "Leaving PR review comments without clear, actionable feedback or constructive engineering rationale."
        ]
      }
    }
  ]);
})(typeof module !== "undefined" ? module.exports : (window.TD = window.TD || {}));
