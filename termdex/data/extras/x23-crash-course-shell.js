/* Real-world examples and step-by-step flows — crash course, the machine and
   everyday version control. */
TD.attach("crash-course", {

"Working Directory": {
 ex: { h: "Asking for directions without saying where you are",
       b: "*Take the second left* is perfect advice and useless without a starting point. A relative path is the same instruction, and the working directory is the corner you happen to be standing on. This is why the identical command succeeds in one terminal tab and fails in another — the instruction never changed, the corner did." },
 fl: { t: "Why the same command fails in a different tab",
       s: ["You run `python app.py` and get *no such file*",
           { q: "Have you checked where the terminal actually is?",
             y: "`pwd` — nine times out of ten you are one folder above or below",
             n: "Doubting the command first is the slow path" },
           { s: "`ls` shows what is actually here", n: "If app.py is not listed, the error was correct." },
           { s: "`cd` to the right folder, or use a path from here", n: "`python src/app.py` works without moving." },
           "Each tab keeps its own directory — opening a new one starts at home"] }
},

"Absolute and Relative Path": {
 ex: { h: "A street address versus *two doors down*",
       b: "*221B Baker Street* finds the house from anywhere in the world. *Two doors down* only works if the listener knows where you are standing. Both are useful — you would not read out the full address to describe your neighbour — but only one survives being written into a note that someone else reads next Tuesday from somewhere else. That note is your cron job." },
 fl: { t: "Choosing between them",
       s: ["You need to refer to a file",
           { q: "Will this run from a predictable directory?",
             y: "Relative is fine, and moves with the project when it is copied",
             n: "Absolute — cron, CI and systemd have no meaningful *here*" },
           { s: "Inside a project, relative keeps it portable", n: "`./config.yml` works on every machine that clones it." },
           { s: "In a script, derive the absolute path from the script itself", n: "`dirname \"$0\"` gives you a reliable anchor." },
           "The bug appears later, on a machine that started somewhere else"] }
},

"PATH": {
 ex: { h: "A row of toolboxes searched strictly left to right",
       b: "You ask for a hammer. Someone opens the first box, then the second, then the third, and hands you the first hammer they find — even if a much better one sits in box four. That is `PATH`. It explains both *command not found* (no box had one) and the far more confusing *I installed the new version and it is still running the old one* (an earlier box had one too)." },
 fl: { t: "Diagnosing the wrong version",
       s: ["`python --version` shows a version you did not install",
           { q: "Which file is actually running?",
             y: "`which python` prints the winning path — start here, always",
             n: "Reinstalling without checking usually adds a third copy" },
           { s: "`echo $PATH` shows the search order", n: "Left to right; the first match wins outright." },
           { s: "Put the folder you want earlier in the list", n: "`export PATH=\"/new/bin:$PATH\"` — prepend, do not append." },
           "Make it permanent in `~/.bashrc` or `~/.zshrc`, or it dies with the tab"] }
},

"Glob Pattern": {
 ex: { h: "The command never sees the star",
       b: "You type `rm *.log` and picture `rm` cleverly matching filenames. It does nothing of the sort. The shell expands the star first and hands `rm` a finished list — `rm a.log b.log c.log`. Everything surprising about globs follows from that ordering: when nothing matches, the shell often passes the literal `*.log` through, and `rm` dutifully reports that no file named `*.log` exists." },
 fl: { t: "Who expands the pattern",
       s: ["You write a pattern on the command line",
           { q: "Is it quoted?",
             y: "The shell leaves it alone and the command does its own matching",
             n: "The shell expands it first; the command only sees filenames" },
           { s: "This is why `find . -name \"*.log\"` needs quotes", n: "Unquoted, the shell expands it before find ever runs." },
           { s: "And why an unmatched pattern gives a strange error", n: "The literal `*.log` was passed through as a filename." },
           "`echo *.log` shows exactly what the command will receive"] }
},

"Permissions": {
 ex: { h: "Three keys, three groups of people",
       b: "A shared office has a key for you, one for your team and one for the cleaners. Each opens a different set of doors. Unix permissions are the same idea with three doors — read, write, run — and three key holders: owner, group, everyone. `chmod 777` is handing every door key to every person who walks past the building, which is why it appears in so many tutorials and so few good systems." },
 fl: { t: "*Permission denied* on a script",
       s: ["`./deploy.sh` says permission denied",
           { q: "Does `ls -l` show an `x` for you?",
             y: "Then the problem is elsewhere — check the interpreter line",
             n: "The execute bit is missing: `chmod +x deploy.sh`" },
           { s: "Still failing with a strange character?", n: "Windows line endings — the `\\r` became part of the interpreter path." },
           { s: "SSH refusing your key is the same category", n: "`chmod 600` — SSH ignores keys that others can read." },
           "Grant the narrowest thing that works, not 777"] }
},

"Symbolic Link": {
 ex: { h: "A forwarding address",
       b: "Post sent to the old house is redirected to the new one, and the sender never knows. If the new house is demolished, the forwarding instruction still exists and now points nowhere — which is precisely a broken symlink. It also explains why `python` on your machine can become 3.12 without anything moving: the signpost was repainted." },
 fl: { t: "Following one",
       s: ["`ls -l` shows `python -> /usr/bin/python3.11`",
           { q: "Is the target still there?",
             y: "Opening the link opens the target, transparently",
             n: "A broken link — it exists, and points at nothing" },
           { s: "`readlink -f` follows the whole chain", n: "Links can point at links; this resolves to the real file." },
           { s: "Repointing it switches versions instantly", n: "`ln -sf` overwrites the existing link." },
           "Copying a folder may copy links or their targets, depending on the flags"] }
},

"Standard Streams and Redirection": {
 ex: { h: "Two conveyor belts, not one",
       b: "A machine has one belt for finished products and another for rejects. Sending the products to a box while watching the rejects go past is the natural setup, and it is exactly what `command > out.txt` gives you: results filed away, errors still visible. Merge the belts with `2>&1` only when you genuinely want everything in one pile." },
 fl: { t: "Capturing output without losing errors",
       s: ["A long command produces both results and complaints",
           { q: "Do you want the errors in the file too?",
             y: "`cmd > all.log 2>&1` — order matters, redirect first",
             n: "`cmd > out.log` leaves errors on your screen, which is usually right" },
           { s: "`>>` appends where `>` overwrites", n: "The wrong one silently destroys the previous contents." },
           { s: "`2>/dev/null` discards errors entirely", n: "Useful, and it also hides errors you needed to see." },
           "`tee` writes to a file and the screen at once"] }
},

"Background Process": {
 ex: { h: "Leaving the washing machine running while you go out",
       b: "It carries on without you — until someone pulls the plug. Closing the terminal is pulling the plug: the job was never independent of the session that started it. `nohup` and `tmux` are the equivalent of putting the machine on its own circuit, which is why every guide to running something on a server arrives at them eventually." },
 fl: { t: "Keeping a long job alive",
       s: ["A training run will take four hours",
           { q: "Will you keep the terminal open the whole time?",
             y: "`&` is enough — the prompt returns and the job runs",
             n: "It dies when the session ends. Use `tmux` or `nohup`" },
           { s: "`tmux` lets you detach and reattach later", n: "Even from a different machine, which `nohup` does not give you." },
           { s: "`jobs` lists what you have parked here", n: "`fg %1` brings job 1 back to the foreground." },
           "Redirect the output somewhere, or it scrolls past and is gone"] }
},

"Process ID": {
 ex: { h: "A ticket number at a busy counter",
       b: "Nobody is called by name; they are called by number, because numbers are unambiguous and easy to look up. When the counter jams, you need the ticket number of whoever is holding it up. *Address already in use* is exactly that jam — some earlier copy of your server never left, and `lsof -i :8000` reads its ticket." },
 fl: { t: "*Address already in use*",
       s: ["Your server will not start — the port is taken",
           { q: "Do you know what is holding it?",
             y: "Stop that process properly",
             n: "`lsof -i :8000` names it, with its PID" },
           { s: "`kill PID` asks it to shut down cleanly", n: "It gets a chance to close files and finish requests." },
           { s: "`kill -9` only if it ignores that", n: "No cleanup at all — a last resort, not a first move." },
           "An old `--reload` process is the usual culprit"] }
},

"Exit Code Conventions": {
 ex: { h: "A thumbs-up nobody sees unless they look",
       b: "Every command finishes with a silent verdict. You never notice it while typing by hand, and every script and CI pipeline you have ever used runs entirely on it. A build *passes* because a number was zero. A deploy step runs because the one before it returned zero. It is the most consequential invisible thing in a terminal." },
 fl: { t: "Why a script continued after a failure",
       s: ["A deploy script ran to the end and shipped something broken",
           { q: "Did the script check exit codes?",
             y: "Then the failing step returned zero — it lied about succeeding",
             n: "Bash ignores failures by default and carries on" },
           { s: "`set -e` stops at the first failing command", n: "The single most valuable line in any shell script." },
           { s: "`set -o pipefail` catches failures inside a pipe", n: "Without it, only the LAST command in a pipeline counts." },
           "`set -euo pipefail` is the standard header, for exactly these reasons"] }
},

"Shell Alias": {
 ex: { h: "A speed-dial button",
       b: "You do not dial your own home number digit by digit every time. An alias is that button for commands you type twenty times a day. The reason people set them up years too late is that each individual `git status` feels too small to bother optimising — and twenty a day for three years is not small." },
 fl: { t: "Making one stick",
       s: ["You type the same long command constantly",
           { s: "`alias gs='git status'` works immediately", n: "But only in this terminal, and only until you close it." },
           { q: "Do you need arguments in the middle?",
             y: "Use a shell function — an alias can only append",
             n: "An alias is enough" },
           { s: "Add it to `~/.bashrc` or `~/.zshrc`", n: "Now every new terminal has it." },
           "`type gs` tells you what a name really resolves to"] }
},

".gitignore": {
 ex: { h: "A bouncer who only checks people not already inside",
       b: "Adding a name to the list stops that person entering. It does nothing about the ones already at the bar. This is the single most misunderstood thing about `.gitignore`: adding `.env` after committing it changes nothing at all, because git is already tracking that file and continues to. You have to walk them out with `git rm --cached`." },
 fl: { t: "A secret was committed by accident",
       s: ["`.env` is in the repository",
           { s: "Add it to `.gitignore` — necessary and not sufficient", n: "This alone stops nothing; the file is already tracked." },
           { s: "`git rm --cached .env` then commit", n: "Untracks it while leaving your local copy alone." },
           { q: "Was it ever pushed anywhere others could see?",
             y: "Rotate the secret. It is in the history and in every clone",
             n: "Rotate it anyway — the cost is minutes and the alternative is a breach" },
           "Rewriting history is possible, awkward, and never the first step"] }
},

"Git Blame": {
 ex: { h: "Asking why the fence is there, not who built it",
       b: "The name is unfortunate and the use is archaeological. You find a line nobody understands, and blame hands you the commit — and the commit message usually explains a production incident from two years ago that the line quietly prevents. That context is what turns *this looks pointless* into an informed decision either way." },
 fl: { t: "Investigating a strange line",
       s: ["A line makes no sense and you want to remove it",
           { s: "`git blame file` gives you the commit hash", n: "With the author and the date, per line." },
           { s: "`git show <hash>` gives the message and full change", n: "The message is what you actually came for." },
           { q: "Does the reason still apply?",
             y: "Leave it — and add the comment that was missing",
             n: "Now you can remove it knowing what you are removing" },
           "A reformatting commit hides the real author; `-w` skips whitespace changes"] }
},

"Squash": {
 ex: { h: "Publishing the essay, not the drafts",
       b: "Nobody wants your seventeen saves, three of which were called *wip* and one *actually fix it this time*. They want the finished piece with a title. Squashing publishes the essay. The counter-argument is real though: sometimes the drafts show why an approach was abandoned, and that reasoning is genuinely useful to the next person." },
 fl: { t: "Merging a messy branch",
       s: ["Your branch has eleven commits, four of them typo fixes",
           { q: "Does the intermediate history teach anything?",
             y: "Keep it, and write a decent merge commit message",
             n: "Squash — one commit, one clear message" },
           { s: "*Squash and merge* on the pull request is the easy route", n: "The host does it; you just write the final message." },
           { s: "A clean main makes `git bisect` far more useful", n: "Every commit builds and every commit is a complete change." },
           "Never rewrite commits that other people have already pulled"] }
},

"Root Cause Analysis": {
 ex: { h: "Mopping the floor while the tap runs",
       b: "The floor is wet, so you mop it. It is wet again in an hour. Mopping is not wrong — the floor did need mopping — but it is not the fix, and doing only that means mopping forever. The pressure during an incident is entirely towards mopping, which is why the analysis has to be a deliberate step scheduled afterwards rather than something you hope happens." },
 fl: { t: "Getting past the first answer",
       s: ["Service recovered. Now find out why it broke",
           { s: "Write the symptom, then ask why", n: "The first answer is almost always a symptom too." },
           { q: "Would the fix prevent this whole class of failure?",
             y: "You have probably reached the real cause",
             n: "Ask why again — you are still on the symptom" },
           { s: "The answers stop being technical after a few rounds", n: "*Nobody reviewed it* and *staging is not like production* are causes." },
           "Fix the immediate problem first — then actually schedule the real one"] }
},

"Premature Optimisation": {
 ex: { h: "Tuning the engine of a car with a flat tyre",
       b: "Hours spent on the engine, genuine improvement made, and the car still will not move. The work was real and it was aimed at the wrong thing. What makes this hard is that the engine is interesting and the tyre is boring — and intuition points at the interesting part every single time, which is exactly why measurement beats intuition here." },
 fl: { t: "Something is slow",
       s: ["A page takes eight seconds to load",
           { q: "Have you profiled it?",
             y: "Optimise whatever the profiler names, then measure again",
             n: "Stop. You are about to optimise the wrong thing" },
           { s: "Guesses are usually wrong by an order of magnitude", n: "The hand-tuned loop is rarely the problem; a query in it usually is." },
           { s: "Algorithmic choice is the exception", n: "An O(n²) design is worth fixing on sight, before measuring." },
           "Stop when it is fast enough — not when it is as fast as possible"] }
},

"Scope Creep": {
 ex: { h: "Painting one wall",
       b: "You agreed to paint one wall. While the tin is open, the other three look uneven. Then the skirting boards. Then the ceiling was always a bit yellow. Every step was reasonable and nobody ever decided to redecorate the room — which is the problem, because redecorating the room was a decision someone should have made deliberately." },
 fl: { t: "*While you are in there...*",
       s: ["A new request arrives mid-task",
           { q: "Is it genuinely part of what was agreed?",
             y: "Do it — that was always the job",
             n: "Price it out loud rather than absorbing it silently" },
           { s: "*That adds about three days — before or after we ship?*", n: "You have agreed, priced it, and handed back the decision." },
           { s: "Watch your own ideas most closely", n: "Most creep is self-inflicted, not requested." },
           "Without a written original scope, creep is invisible by definition"] }
},

"Bikeshedding": {
 ex: { h: "An hour on the bike shed, ten minutes on the reactor",
       b: "Parkinson's original example, and it survives because everyone recognises it. The reactor is beyond most of the committee, so there is nothing to say. The bike shed is a shed — everyone has built a shelf, everyone has a view, and the discussion goes where the opinions are rather than where the risk is." },
 fl: { t: "Noticing it in the room",
       s: ["A meeting has spent twenty minutes on a name",
           { q: "Is the time spent proportional to the consequence?",
             y: "Then it is a real debate — carry on",
             n: "This is bikeshedding. Say so, kindly, and move" },
           { s: "*Shall we take the first option and move to the schema?*", n: "Naming it and offering a decision usually resolves it." },
           { s: "Automate the recurring ones out of existence", n: "A formatter ends formatting debates permanently." },
           "The dangerous sign is the hard decision passing with no discussion at all"] }
},

"Yak Shaving": {
 ex: { h: "Needing a haircut to fix the sink",
       b: "The original image is absurd on purpose: to fix the sink you need a part, the shop is shut, you borrow the neighbour's car, which needs petrol, and somehow you end up shaving a yak. Every step follows logically from the last. The absurdity is only visible from outside, which is why the fix is to look up occasionally and check what you were doing." },
 fl: { t: "Two levels deep and descending",
       s: ["You cannot start the real task until something else works",
           { s: "Write down the original goal", n: "Explicitly. You will need it in three hours." },
           { q: "Is there a way around this, rather than through it?",
             y: "Take it — a container or a colleague's setup often is one",
             n: "Continue, but keep the list visible" },
           { s: "Timebox it", n: "*If this is not working in an hour, I ask for help.*" },
           "Some yaks genuinely must be shaved. Just do it knowingly"] }
},

"Chesterton's Fence": {
 ex: { h: "The fence in the middle of an empty field",
       b: "The reformer sees no purpose and proposes clearing it. The wiser answer: find out why it was built, and then we can discuss removing it. Not because tradition deserves respect, but because *I cannot see the reason* and *there is no reason* are different statements, and only one of them is knowledge." },
 fl: { t: "Before deleting the strange code",
       s: ["You find a line that appears to do nothing useful",
           { s: "`git blame` it and read the commit message", n: "This takes thirty seconds and is usually decisive." },
           { q: "Did you find the reason?",
             y: "Now judge whether it still applies",
             n: "Ask someone, or leave it and add a TODO — do not guess" },
           { s: "Still relevant? Add the comment that was missing", n: "So the next person does not repeat this investigation." },
           "No longer relevant? Remove it properly, and say why in your commit"] }
},

"Cargo Cult Programming": {
 ex: { h: "A bamboo control tower",
       b: "Everything is the right shape — the runway, the tower, the headphones carved from wood — and no plane ever lands, because the shape was never what brought the planes. Copied code has the same problem: it looks exactly like the working version, and the part that made it work was the understanding, which does not copy across." },
 fl: { t: "You pasted something and it worked",
       s: ["A config block from Stack Overflow fixed your problem",
           { q: "Can you explain what each line does?",
             y: "Then it is not cargo cult — you copied and learned",
             n: "You now own code you cannot debug or safely change" },
           { s: "Spend ten minutes reading the documentation for it", n: "Far cheaper now than during an incident." },
           { s: "Leave a comment saying what it does and why", n: "Including the link you took it from." },
           "`try/except: pass` is the most common example — it hides the problem"] }
},

"Bus Factor": {
 ex: { h: "One person who knows where the keys are",
       b: "Everything runs perfectly until they take two weeks off, and then nobody can get into the building. Nothing was done wrong — knowledge simply settled where the work happened. It stays invisible precisely because things are working, and becomes visible at the worst possible moment." },
 fl: { t: "Finding yours",
       s: ["List the things that must keep working",
           { s: "For each, write down who could actually do it", n: "Not who could work it out — who could do it on a bad Tuesday." },
           { q: "Does any row have exactly one name?",
             y: "That is a bus factor of one, and it is a real risk",
             n: "Check whether the second name has ever actually done it" },
           { s: "The fix is boring: runbooks, rotation, cross-review", n: "None of it is glamorous and all of it works." },
           "Let the person who does not know write the runbook"] }
},

"Toil": {
 ex: { h: "Bailing out a boat instead of finding the hole",
       b: "Bailing works, it is visibly hard work, and everyone can see you doing it. Finding the hole is fiddly, looks like nothing is happening, and ends the bailing forever. Teams reward the bailing because it is legible — which is precisely why toil needs a name and a number, so that the hole gets budgeted for." },
 fl: { t: "Deciding what to automate",
       s: ["A task keeps coming back",
           { q: "Is it manual, repetitive and free of judgement?",
             y: "That is toil — a candidate for removal",
             n: "It may just be the job. Not all repetition is toil" },
           { s: "Does it grow as the system grows?", n: "If yes, it will eventually consume everything." },
           { s: "Track how much time it takes", n: "Untracked toil never appears on a roadmap." },
           "Better than automating it: remove the need for it"] }
},

"Dogfooding": {
 ex: { h: "A chef who never eats in their own restaurant",
       b: "The food may be excellent and they would still not know the tables wobble, the menu is unreadable in the low light, and the bill takes twenty minutes. None of that shows in the kitchen. Using your own product is how you find the wobbling table — and it is also why you never notice how hard the front door is to find, since you come in through the back." },
 fl: { t: "What it does and does not catch",
       s: ["The team starts using its own tool for real work",
           { s: "Daily friction surfaces within days", n: "Confusing flags, unhelpful errors, slow steps." },
           { q: "Will this catch onboarding problems?",
             y: "No — and assuming it does is the trap",
             n: "Correct. You are never a new user again" },
           { s: "Watch a real new user, in silence", n: "Do not help. The urge to help is the finding." },
           "Both are needed; they find genuinely different things"] }
}

});
