/* Real-world examples and step-by-step flows — crash course, tools and process. */
TD.attach("crash-course", {

"Bug": {
 ex: { h: "A satnav that takes you to the wrong Newport",
       b: "The device did not malfunction. It routed you flawlessly to a place called Newport — just not the one in Wales. Every instruction was followed exactly; the instruction itself was wrong. That gap between what you meant and what you said is the whole of debugging, and it is why *the computer is being weird* is almost never the answer." },
 fl: { t: "Triage before you touch the code",
       s: ["Something is not behaving as expected",
           { q: "Does the program start at all?",
             y: "It runs, so this is a runtime or a logic bug",
             n: "Syntax error — the file could not even be parsed" },
           { q: "Does it crash, or finish with a wrong answer?",
             y: "A crash gives you a stack trace — start at your topmost frame",
             n: "Silently wrong: find one input that reliably reproduces it" },
           "Reproduce it on demand before changing a single line"] }
},

"Syntax Error": {
 ex: { h: "A sentence with a bracket left open",
       b: "*(She left the room and* — a reader stops, not because the words are wrong but because the sentence never closed. They will point at where they gave up, which is later than where you went wrong. Parsers do the same, which is why an unclosed bracket on line 40 gets reported on line 41 or 44." },
 fl: { t: "Reading the line number correctly",
       s: ["The interpreter refuses to run and names a line",
           { q: "Does that line look correct?",
             y: "Look at the line **above** — an unclosed bracket or quote runs on",
             n: "Fix it there; often a missing colon, comma or closing paren" },
           { s: "Nothing ran at all", n: "No side effects happened — this is the safest kind of error to have." },
           "An editor with bracket matching catches almost all of these as you type"] }
},

"Runtime Error": {
 ex: { h: "A vending machine that jams on one specific coin",
       b: "It served three thousand customers happily and then met a bent 50p and stopped. The machine was fine; the input was outside what it was built for. Runtime errors are exactly this — code that is perfectly valid meeting data it was never designed to handle, often for one user in a thousand." },
 fl: { t: "Why it only broke in production",
       s: ["Code runs fine locally and in tests",
           { s: "Your test data is tidy", n: "Every user has an email, every list has items." },
           { q: "Does real data include an empty list or a null field?",
             y: "The unguarded path is reached and the request dies",
             n: "It survives — until the day someone submits a blank form" },
           "Validate at the boundary, and test the empty, single and malformed cases"] }
},

"Exception": {
 ex: { h: "A fire alarm, not a fire extinguisher",
       b: "The smoke detector in the kitchen knows there is smoke; it has no idea whether to open a window, evacuate the building or ignore burnt toast. So it raises an alarm and lets whoever can decide, decide. A function reading a missing file is in exactly that position — it knows something is wrong, not what should be done about it." },
 fl: { t: "How an exception travels",
       s: ["`open(path)` fails deep inside a helper",
           { s: "An exception object is raised and execution stops there", n: "The rest of that function never runs." },
           { q: "Does the caller catch this type?",
             y: "Control jumps to the handler, which decides the fallback",
             n: "It keeps rising to the caller's caller, and so on" },
           "If nobody catches it, the program exits and prints a stack trace"] }
},

"Exception Handling": {
 ex: { h: "A restaurant with a plan for a failed card",
       b: "The terminal declines. Good staff say *no problem, shall we try another?* — they do not pretend it worked, and they do not stand there frozen. Bad handling is either extreme: silently marking the bill paid, or crashing the evening. Catching one specific, expected failure and having an answer for it is the whole skill." },
 fl: { t: "Catching well versus catching everything",
       s: ["A network call might time out",
           { q: "Do you catch the specific exception you expect?",
             y: "You can do something useful — retry, or serve from cache",
             n: "A bare `except:` also swallows typos and bugs you never saw" },
           { s: "Never leave the handler empty", n: "A silent failure becomes a wrong answer with no trace." },
           "Anything you cannot genuinely handle should be re-raised and seen"] }
},

"Stack Trace": {
 ex: { h: "A parcel's tracking history, read backwards",
       b: "The parcel is lost. The tracking page shows every depot it passed through, most of which belong to the courier and none of which you control. You scan for the last place *you* touched it — the post office counter — and start there. A stack trace is that history, and your own file is the counter." },
 fl: { t: "Getting from a wall of red text to the actual line",
       s: ["An uncaught exception prints a trace",
           { s: "Find the error type and message", n: "Python puts it last; JavaScript puts it first." },
           { q: "Is the top frame in a library folder?",
             y: "Scroll until you reach a file you wrote — that is where to look",
             n: "You already have your own file and line number" },
           "Set a breakpoint or a print on that line and inspect the values"] }
},

"Edge Case": {
 ex: { h: "The lift that fails when exactly one person rides it",
       b: "Tested with a full car, tested empty, never tested with a single passenger under the sensor threshold. Boundaries are where things break because the middle is what everybody exercises. Empty, one, and maximum are three inputs that take a minute to try and find most of what a week of use would." },
 fl: { t: "The five-minute checklist for any function",
       s: ["The function works on your normal example",
           { s: "Try empty: no items, empty string, no rows", n: "The single most productive test you can run." },
           { s: "Try one, and try many", n: "Off-by-one bugs live at exactly these two." },
           { q: "Does it handle zero, negative and null?",
             y: "Write a test for each so it stays handled",
             n: "You just found the bug before your users did" }] }
},

"Happy Path": {
 ex: { h: "A wedding plan with no wet-weather option",
       b: "Every photo, every table, every timing assumes sunshine. It is beautiful and it is 40% of the planning. The marquee, the spare van and the backup registrar are the other 60%, and they are what makes the day survive contact with reality. Software estimates go wrong in exactly this proportion." },
 fl: { t: "Finding the work hiding in a feature",
       s: ["Write out the ideal flow, step by step",
           { s: "For each step, ask how it can fail", n: "Network down, input malformed, user leaves mid-way, service slow." },
           { q: "Have you decided what happens for each failure?",
             y: "Retry, degrade or fail loudly — now the estimate is honest",
             n: "Your estimate covers the demo, not the feature" },
           "Most of the code you eventually write lives on these branches"] }
},

"IDE": {
 ex: { h: "A workshop where every tool knows the job",
       b: "A plain bench holds your tools. A good workshop has a jig that stops you cutting the wrong angle. An editor shows characters; an IDE has read your whole project, so it can rename a function in forty files correctly, or tell you a variable does not exist before you have run anything." },
 fl: { t: "The three features worth learning first",
       s: ["Open an unfamiliar codebase",
           { s: "Go to definition", n: "Jump into any function, including inside your dependencies." },
           { s: "Find all references", n: "See everywhere a thing is used before you change it." },
           { q: "Still using print statements to debug?",
             y: "Learn the debugger — pause and inspect every value at once",
             n: "You are already getting most of the value the tool offers" }] }
},

"Command Line Interface": {
 ex: { h: "Texting an assistant instead of pointing at things",
       b: "Pointing is easy to learn and impossible to repeat. A written instruction can be saved, sent to a colleague, run at 3 a.m. by a machine, and executed on a server with no screen. That is the entire trade the terminal makes, and it is why every serious tool is a command first and a button second." },
 fl: { t: "Finding your way in an unfamiliar shell",
       s: ["`pwd` — where am I?",
           "`ls -la` — what is here, hidden files included",
           { s: "`cd path` to move, Tab to autocomplete", n: "Tab twice lists the options." },
           { q: "Did something run away with itself?",
             y: "Ctrl-C stops the foreground process",
             n: "Up arrow recalls the last command so you can edit it" }] }
},

"File Path": {
 ex: { h: "A full postal address versus *two doors down*",
       b: "The full address works from anywhere in the world. *Two doors down* is shorter and only means anything if you already know where the speaker is standing. Relative paths break exactly this way: run the same script from a different folder and *two doors down* points at a different house." },
 fl: { t: "Why the script cannot find its data file",
       s: ["`open(\"data/terms.json\")` fails",
           { s: "Relative paths resolve from the working directory", n: "Where you launched the process — not where the file lives." },
           { q: "Did you run it from a different folder?",
             y: "That is the whole bug — the path was never wrong, your location was",
             n: "Build the path from the script's own location instead" },
           "`Path(__file__).parent / \"data\" / \"terms.json\"` works from anywhere"] }
},

"Localhost": {
 ex: { h: "An intercom inside one house",
       b: "You can call the kitchen from the bedroom, and no signal leaves the building. `127.0.0.1` is that intercom — real networking, but the packets loop back inside the machine. Which is also why your phone on the same wifi cannot open `localhost:3000`: it is standing outside the house." },
 fl: { t: "Address already in use",
       s: ["`npm run dev` fails with EADDRINUSE on port 3000",
           { s: "Another process is already holding that port", n: "Usually a previous run you closed the terminal on." },
           { q: "Do you know which process?",
             y: "`lsof -i :3000` or `netstat -ano | findstr :3000`, then stop it",
             n: "Start on a different port instead: `npm run dev -- --port 3001`" },
           "To reach it from a phone, use the machine's LAN address, not localhost"] }
},

"Bash and PowerShell": {
 ex: { h: "Driving in a country that swapped the pedals",
       b: "Both cars go forwards, both have a wheel, and the muscle memory from one actively hurts you in the other. `export VAR=x` and `$env:VAR = 'x'` do the same job in two dialects, and pasting one into the other produces errors that look like the command is broken when only the grammar is." },
 fl: { t: "Why the snippet from that blog post fails",
       s: ["You paste a command and get a parse error",
           { q: "Which shell are you actually in?",
             y: "PowerShell: `&&` chaining, `$VAR` and `2>/dev/null` are not valid there",
             n: "bash / zsh: PowerShell cmdlets and `$env:` will not work" },
           { s: "On Windows, Git Bash gives you the bash dialect", n: "Handy when following Linux-flavoured instructions." },
           "Translate the idiom rather than fighting the error message"] }
},

"Standard Input and Output": {
 ex: { h: "A kitchen hatch, a serving counter, and a complaints book",
       b: "Orders come in through the hatch, plates go out over the counter, and complaints go in a separate book so they never end up on somebody's dinner. Keeping errors on their own channel is precisely why you can pipe a program's results into another tool and still see its warnings on screen." },
 fl: { t: "Why your JSON output is corrupted",
       s: ["A script prints JSON that a downstream tool parses",
           { q: "Does the script also `print()` its log lines?",
             y: "They go to stdout too and land in the middle of the JSON",
             n: "The output is clean and parses fine" },
           { s: "Send diagnostics to stderr instead", n: "The pipe carries only stdout, so the data stays machine-readable." },
           "`command > out.json 2> errors.log` keeps the two apart on disk too"] }
},

"Pipe": {
 ex: { h: "A production line, not a set of buckets",
       b: "Each station does one thing and hands the item straight to the next. Nobody fills a bucket, carries it across the floor and tips it out. That is why `cat huge.log | grep ERROR | tail -20` starts printing immediately and works on a file far larger than your memory." },
 fl: { t: "Building a one-line investigation",
       s: ["Start with the raw source: `cat access.log`",
           { s: "Narrow it: `| grep \" 500 \"`", n: "Only server errors now flow onward." },
           { s: "Shape it: `| awk '{print $7}' | sort | uniq -c`", n: "Count which URLs failed most." },
           { q: "Need only the worst offenders?",
             y: "`| sort -rn | head -10` finishes the pipeline",
             n: "Each stage streams, so results appear before the file is fully read" }] }
},

"Exit Code": {
 ex: { h: "A thumbs up that means nothing else",
       b: "The diver surfaces and gives one signal: OK, or not OK. It carries no detail and it does not need to — the boat only has to decide whether to continue the dive. CI does the same with your test command, which is why a script that always exits 0 will happily let a pipeline deploy broken code." },
 fl: { t: "How CI decides whether to continue",
       s: ["The pipeline runs `npm test`",
           { s: "The process finishes and leaves a number behind", n: "`echo $?` shows it." },
           { q: "Is the exit code 0?",
             y: "Success — the pipeline proceeds to build and deploy",
             n: "Non-zero — the pipeline stops and reports failure" },
           "Your own scripts must exit non-zero on failure or automation goes blind"] }
},

"Script": {
 ex: { h: "The laminated card by the espresso machine",
       b: "Nobody trains each new barista by describing the descale procedure from memory. It is written down, in order, on the machine — and it is right, because it is what everyone actually follows. A script in the repo is that card, except it cannot go stale, because it is the thing that runs." },
 fl: { t: "When a sequence of commands becomes a script",
       s: ["You run the same three commands again",
           { q: "Have you now done this twice?",
             y: "Put it in a file with a name that says what it does",
             n: "Fine — do it manually once more" },
           { s: "Add it to the README and the repo", n: "Now a new teammate does not have to be told in chat." },
           "When it grows conditionals and error handling, move it to Python or Node"] }
},

"Entry Point": {
 ex: { h: "The front door of an unfamiliar building",
       b: "You do not understand a hospital by wandering into a random corridor. You start at reception and follow the signs. Reading a new codebase works the same way: find the file that actually runs first, then follow the calls outward. Everything else is a corridor you will reach eventually." },
 fl: { t: "Finding where an unfamiliar project starts",
       s: ["Open `package.json` or `pyproject.toml`",
           { s: "Look at the `scripts` or `[project.scripts]` section", n: "It names the file that runs." },
           { q: "Is it a container?",
             y: "The Dockerfile's `CMD` or `ENTRYPOINT` is the real starting line",
             n: "Open the named file and read from the top" },
           "In Python, `if __name__ == \"__main__\"` marks the runnable part"] }
},

"Package": {
 ex: { h: "Buying a bookshelf instead of milling the timber",
       b: "The flat pack saves you a weekend and comes with fittings you did not choose. Most of the time that is a fine trade. But you are now depending on a company you have never met for the replacement dowels, and a bookshelf that arrives with forty smaller boxes inside it deserves a second look." },
 fl: { t: "Deciding whether to add a dependency",
       s: ["You need a small piece of functionality",
           { q: "Would twenty lines of your own do it?",
             y: "Write them — no supply chain, no updates, no surprises",
             n: "Look the package up before installing" },
           { s: "Check: last release date, open issues, dependency count", n: "One package can drag in eighty." },
           "If it stays, pin it in the lockfile and audit it periodically"] }
},

"Dependency": {
 ex: { h: "Subcontractors on a building site",
       b: "You hired the electrician. The electrician hired the person who makes the junction boxes, who buys copper from someone else. If any of them stops turning up, your building stops. You chose one of them; the rest arrived with him — which is exactly the difference between a direct and a transitive dependency." },
 fl: { t: "Where the 800 packages came from",
       s: ["You install four libraries",
           { s: "Each brings its own dependencies", n: "And those bring theirs, recursively." },
           { q: "Is a package needed at runtime or only while developing?",
             y: "Runtime — it ships to production and must be secure and current",
             n: "Dev-only: test runners, formatters — keep them out of the image" },
           "Run an audit regularly; unmaintained packages accumulate known holes"] }
},

"Lockfile": {
 ex: { h: "A recipe that names the exact tin, not just *chopped tomatoes*",
       b: "*A tin of tomatoes* gives a different sauce depending on which shop you visit. The manifest is the shopping list; the lockfile is the receipt showing precisely which brand, size and batch were used — which is why the same dish comes out of every kitchen that follows it." },
 fl: { t: "Why it works on your machine and not on CI",
       s: ["Your manifest says `^4.2.0` — a range, not a version",
           { q: "Is the lockfile committed?",
             y: "Every machine installs the identical tree; builds are reproducible",
             n: "CI resolves the range today and may get 4.9 with a breaking change" },
           { s: "Never hand-edit it", n: "Change the manifest and let the tool regenerate it." },
           "A lockfile diff in a PR is a real change and deserves reading"] }
},

"Virtual Environment": {
 ex: { h: "Separate toolboxes for two jobs",
       b: "The plumbing job needs the old spanner set; the boiler job needs the new one. Keeping both loose in the van means you grab whichever surfaces first. A per-project environment gives each job its own box, which is why activating it is the fix for almost every *but I installed that* moment in Python." },
 fl: { t: "The ModuleNotFoundError ritual",
       s: ["`import requests` fails, but you installed it yesterday",
           { q: "Does your prompt show the environment name?",
             y: "It is active — check whether you installed into a different one",
             n: "Activate it and try again; that is usually the whole story" },
           { s: "Confirm the interpreter", n: "`which python` should point inside `.venv`, not `/usr/bin`." },
           "Commit `requirements.txt`, never the `.venv` folder itself"] }
},

"Environment Variable": {
 ex: { h: "Hotel keys handed out at the desk, not baked into the door",
       b: "The door does not know which guest is staying; the key it accepts is issued per stay. Your code should not know the production database password — it is handed in at start-up, differs per environment, and can be reissued the moment it leaks. Baking it into the door means changing the door." },
 fl: { t: "What to do when a key gets committed",
       s: ["A secret is spotted in a diff",
           { q: "Was it ever pushed?",
             y: "Assume it is compromised — rotate the key immediately",
             n: "Rotate anyway; it costs a minute" },
           { s: "Deleting the line does not remove it", n: "Git history keeps every version forever." },
           "Move it to `.env`, add `.env` to `.gitignore`, commit `.env.example` instead"] }
},

"Configuration File": {
 ex: { h: "The thermostat, not the boiler",
       b: "Changing the temperature should not require a plumber. Config is everything you might reasonably want to adjust without a code review: ports, log levels, timeouts, feature toggles, model names. Anything a plumber must handle is code, and anything a burglar could use is a secret — those belong somewhere else again." },
 fl: { t: "Layering configuration so it is predictable",
       s: ["Start with sensible defaults in code",
           { s: "A config file overrides them per project", n: "Committed, readable, reviewable." },
           { s: "Environment variables override the file", n: "Per-deployment, and where secrets live." },
           { q: "Is a required value missing at start-up?",
             y: "Fail immediately with a clear message naming the setting",
             n: "Log the resolved config (minus secrets) so the run is reproducible" }] }
},

"Build": {
 ex: { h: "A restaurant kitchen versus the dining room",
       b: "Nobody serves raw ingredients on a plate. Prep, cook, plate — and what reaches the table is a transformed thing. TypeScript becomes JavaScript, forty modules become three bundles, everything is minified. That output is what ships, which is also why committing it to the repo is like storing yesterday's plated meals in the pantry." },
 fl: { t: "From source file to what the browser downloads",
       s: ["Your source: TypeScript, JSX, several hundred modules",
           { s: "Transpile — modern and typed syntax becomes plain JavaScript", n: "Types are checked, then erased." },
           { s: "Bundle and tree-shake", n: "Unreachable code is dropped; modules are merged." },
           { s: "Minify and hash the filenames", n: "Hashing lets caches hold files forever and still update." },
           { q: "Does the same source produce the same output anywhere?",
             y: "Reproducible — CI is meaningful and rollbacks are exact",
             n: "Pin the toolchain and the lockfile until it does" }] }
},

"Runtime": {
 ex: { h: "The projector, not the film",
       b: "The reel holds the film; the projector makes it happen — supplies the light, the speed, the sound. Node, the JVM and CPython are projectors. And *at runtime* means *while the film is playing*, as opposed to while it was being edited, which is exactly the compile-time versus runtime distinction." },
 fl: { t: "Why it broke only on the server",
       s: ["Code runs locally and fails after deploy",
           { q: "Do local and server run the same runtime version?",
             y: "Look elsewhere — config, environment variables, data",
             n: "That is very likely it: a syntax or API that exists in one and not the other" },
           { s: "Pin the version explicitly", n: "`.nvmrc`, `engines`, or the base image tag." },
           "Errors caught at compile time cost seconds; the same error at runtime costs an incident"] }
},

"Library": {
 ex: { h: "A cordless drill in your own workshop",
       b: "You decide what to build, when to pick the drill up and when to put it down. It does not tell you what the shelf should look like. Swapping to a different brand of drill next month changes almost nothing about your project — which is precisely the difference from a framework." },
 fl: { t: "Library or framework? Ask who calls whom",
       s: ["You are evaluating a tool",
           { q: "Do you call it, or does it call your code?",
             y: "You call it — that is a library, and it is easy to remove later",
             n: "It calls you at moments it chooses — that is a framework" },
           { s: "Libraries compose", n: "Ten of them coexist without arguing about structure." },
           "Prefer a library when you already know the shape your app should have"] }
},

"Framework": {
 ex: { h: "Moving into a serviced flat",
       b: "The kitchen is fitted, the wiring is done, the bins are collected — and you cannot move a wall. You are productive on day one and constrained on day four hundred. That trade is honest and often correct; what is not honest is pretending you can leave cheaply, because leaving is a rewrite." },
 fl: { t: "The shape of a framework decision",
       s: ["You pick a framework for a new project",
           { s: "Weeks 1–4 are dramatically faster", n: "Routing, auth, forms, conventions — all supplied." },
           { q: "Does a requirement fall outside what it anticipated?",
             y: "You now fight the framework, and the workaround is the expensive part",
             n: "You keep gaining from the conventions and the community" },
           "Choose for the conventions and the ecosystem, not the feature list"] }
},

"SDK": {
 ex: { h: "An IKEA kit with the right Allen key in the box",
       b: "You could source the bolts yourself and it would work. The kit exists because the fiddly parts — the exact thread, the order of assembly, the bit that always goes on backwards — are already solved. An SDK is the vendor packing the retries, the pagination and the error shapes so you do not re-derive them." },
 fl: { t: "SDK or raw HTTP?",
       s: ["You need to call a third-party service",
           { q: "Is the platform large and well maintained?",
             y: "Use the SDK — auth, retries and pagination are handled and typed",
             n: "Plain HTTP is often more predictable than a half-finished wrapper" },
           { s: "The API is the contract; the SDK is a convenience over it", n: "SDKs lag behind new endpoints." },
           "Either way you own keeping it updated"] }
},

"API Key": {
 ex: { h: "A hotel master key with your name on the log",
       b: "It opens the rooms and every use is attributed to you. Lend it out and the charges are still yours. Which is why it never goes in a shared drawer, never gets photocopied into a group chat, and gets cancelled the moment you cannot account for it — and why an API key in frontend JavaScript is a master key taped to the front door." },
 fl: { t: "Where a key may and may not live",
       s: ["You need to call a paid API from a web app",
           { q: "Is the call made from the browser?",
             y: "Stop — everything shipped to the browser is readable. Proxy it through your server",
             n: "Read it from an environment variable on the server" },
           { s: "Give each environment its own key", n: "One leak then compromises one environment, not all of them." },
           "If it ever leaks, rotate — removing the commit is not enough"] }
},

"Code Formatter": {
 ex: { h: "A house style at a newspaper",
       b: "Nobody at a newspaper argues about whether it is *email* or *e-mail* — the style guide decided years ago and everyone got on with the actual writing. A formatter is that ruling, applied automatically, which ends the argument permanently and makes every diff show only real changes." },
 fl: { t: "Why formatting matters for reviews",
       s: ["You change three lines of logic and reformat the file",
           { s: "The diff now shows 400 changed lines", n: "399 of them whitespace." },
           { q: "Can a reviewer see what you actually did?",
             y: "Only if formatting was already consistent and automatic",
             n: "Split it: one commit for formatting, one for the change" },
           "Run the formatter on save and enforce it in CI, and the problem disappears"] }
},

"Boilerplate": {
 ex: { h: "The safety briefing before every flight",
       b: "Necessary, identical every time, and carrying no information specific to your journey. The problem is not that it exists — it is what happens when three crews improvise slightly different versions and one of them forgets the exits. Hand-copied boilerplate drifts in exactly that way." },
 fl: { t: "When to eliminate it and when to keep it",
       s: ["The same setup block appears in a fourth service",
           { q: "Was it copied by hand?",
             y: "It has already drifted — extract it into a shared module or a template",
             n: "It is generated or imported, so improvements reach every copy" },
           { s: "Some explicitness is worth keeping", n: "Hiding everything behind magic makes debugging much harder." },
           "The test: if you improve it here, does everywhere else get the improvement?"] }
},

"Scaffolding": {
 ex: { h: "A show home you are handed the keys to",
       b: "Everything is fitted and the kettle works. It is also full of choices someone else made — a sofa you did not pick, a subscription you did not know about. Spending twenty minutes walking through what was generated, and removing what you do not want, is much cheaper before you have built four rooms on top of it." },
 fl: { t: "The twenty minutes after `create-next-app`",
       s: ["One command produces a working project",
           { s: "Read the generated config files", n: "You own them now, whether or not you chose them." },
           { q: "Is there tooling you will not use?",
             y: "Delete it now, before other code starts depending on it",
             n: "Commit the untouched scaffold as its own first commit" },
           "That first commit makes every later change readable in the diff"] }
},

"Jupyter Notebook": {
 ex: { h: "A lab bench where nothing gets tidied",
       b: "Every reagent from the last three experiments is still out, which is wonderful for trying the next thing quickly and terrible for anyone trying to reproduce your result. A notebook keeps everything in memory — including the variable you defined in a cell you have since deleted." },
 fl: { t: "Before you trust or share a result",
       s: ["Your notebook shows a promising number",
           { q: "Have you run Restart and Run All since?",
             y: "The result is reproducible from top to bottom",
             n: "It may depend on a cell you deleted or ran out of order" },
           { s: "Move anything reusable into a module", n: "Then import it — the notebook stays for exploring." },
           "Strip outputs before committing, or the diff is unreadable"] }
},

"Repository": {
 ex: { h: "A ship's log, not a whiteboard",
       b: "Every entry is dated, signed and permanent — you correct a mistake by writing a new line, never by rubbing one out. That permanence is the value and the hazard: git can show you any file as it stood in March, and it also still holds the password someone pasted in March." },
 fl: { t: "The first five minutes of a new repo",
       s: ["`git init` in the project folder",
           { s: "Write `.gitignore` before the first commit", n: "Secrets, build output, `node_modules`, `.venv`." },
           { q: "Did a secret slip into a commit anyway?",
             y: "Rotate the credential — history keeps it even after you delete the line",
             n: "Commit, add a remote, and push" },
           "Every clone carries the full history, which is what makes git distributed"] }
},

"Diff": {
 ex: { h: "Track changes on a contract",
       b: "The other side does not reread all forty pages; they read the marked-up bits. Your change is only as reviewable as its diff, which is why reformatting a file in the same commit as a logic change is genuinely unkind — you have hidden two real lines inside four hundred cosmetic ones." },
 fl: { t: "Making a change easy to review",
       s: ["You have finished the work",
           { q: "Does the diff contain unrelated formatting or renames?",
             y: "Split them into separate commits so each one reads cleanly",
             n: "Read your own diff before opening the PR" },
           { s: "`git diff` shows unstaged; `git diff --staged` shows what is about to be committed", n: "Reading it catches debug statements you forgot." },
           "A reviewer's attention is finite — spend it on the logic"] }
},

"Stash": {
 ex: { h: "Sweeping the desk into a drawer for a visitor",
       b: "It is perfect for two minutes and disastrous for two weeks — by then you have forgotten what was in there and it may as well not exist. A stash has no branch, no useful message and is invisible to teammates, so anything that must survive until tomorrow deserves a work-in-progress commit instead." },
 fl: { t: "Handling an urgent interruption mid-feature",
       s: ["You are halfway through a feature and a P1 lands",
           { s: "`git stash -u -m \"half-done filter\"`", n: "`-u` includes untracked files, which is usually what you want." },
           "Switch branch, fix the urgent thing, ship it",
           { q: "Coming back within the hour?",
             y: "`git switch` back and `git stash pop`",
             n: "Make a WIP commit on a branch instead — stashes get lost" }] }
},

"Fork": {
 ex: { h: "Photocopying a form you are not allowed to write on",
       b: "The council's master copy stays untouched. You take a copy, fill it in, and submit it back for their approval. That is the whole open-source contribution flow: you cannot push to a project you do not have write access to, so you push to your copy and ask them to pull it in." },
 fl: { t: "Contributing to a project you do not own",
       s: ["Fork the repository to your own account",
           { s: "Clone your fork and add the original as `upstream`", n: "Two remotes: yours to push to, theirs to pull from." },
           "Branch, commit, push to your fork, open a pull request",
           { q: "Has the original moved on since you forked?",
             y: "`git fetch upstream && git rebase upstream/main` before you ask for review",
             n: "The maintainer sees a clean, mergeable change" }] }
},

"Upstream": {
 ex: { h: "The river, not the reservoir",
       b: "Everything flows from upstream to you. Pollute the reservoir and the town notices; block the river and the reservoir empties. The word is used identically in two places — the repo you forked from, and the service you depend on — and it means the same thing in both: the source you are downstream of." },
 fl: { t: "Why `git push` sometimes needs no arguments",
       s: ["A new local branch has no upstream yet",
           { q: "Have you pushed it before?",
             y: "Git knows the tracking branch — bare `push` and `pull` just work",
             n: "`git push -u origin my-branch` sets it once, and then they do" },
           { s: "The same word in production", n: "An *upstream timeout* means a service you call was too slow." },
           "Upstream is always the source; downstream is always you"] }
},

"Cherry-Pick": {
 ex: { h: "Taking one paragraph out of a long email",
       b: "You forward the sentence the client actually needs, not the whole thread. The paragraph now exists in two places, which is fine as long as everyone knows. Cherry-picking a hotfix onto a release branch does exactly this — the same change, twice in history, under two different identifiers." },
 fl: { t: "Backporting a fix to a released version",
       s: ["A fix is already merged into `main`",
           { s: "Note its commit hash", n: "`git log --oneline` on main." },
           { s: "Switch to the release branch and `git cherry-pick <hash>`", n: "The change replays as a brand new commit." },
           { q: "Do you want the whole branch, not one commit?",
             y: "Merge it instead — cleaner history and no duplicate change",
             n: "Push, and note the duplication so later merges make sense" }] }
},

"Release": {
 ex: { h: "A print edition versus the newsroom",
       b: "The newsroom changes all day; the edition is a fixed thing with a date on it that you can pull off a shelf in five years and read exactly as it went out. A tagged release is that edition — which is why a bug report against version 2.3.1 is answerable and one against *the website* is not." },
 fl: { t: "Turning a commit into something supportable",
       s: ["Decide `main` is in a shippable state",
           { s: "Tag the commit with a version number", n: "Semantic versioning tells users whether upgrading is safe." },
           { s: "Build the artifacts and write the changelog", n: "Both derive from the same tagged commit." },
           { q: "Does a customer report a bug in this version months later?",
             y: "Check out the tag and see exactly the code they are running",
             n: "Automate the whole sequence — a manual release is a recurring outage risk" }] }
},

"Open Source": {
 ex: { h: "A community allotment",
       b: "Anyone can take vegetables, the gates are unlocked, and it is kept going by people who owe you nothing on their weekends. Reading the sign about which beds are shared matters — and so does the fact that *free to take* is not the same as *nobody is responsible if the water runs out*." },
 fl: { t: "Before you depend on a project",
       s: ["You find a package that does what you need",
           { q: "Is there a licence file?",
             y: "Read it — permissive, or copyleft with obligations on your own code?",
             n: "No licence means all rights reserved, even on a public repo" },
           { s: "Check the pulse", n: "Last release, open issue count, how maintainers answer." },
           "If it becomes load-bearing, contributing back is how it stays alive"] }
},

"Software License": {
 ex: { h: "The terms on the back of a ticket",
       b: "The ticket gets you in either way; the small print decides whether you may photograph the show, resell the seat or bring a guest. MIT lets you do almost anything if you keep the notice. GPL says your derivative must be as open as the original — which is why some companies forbid it outright." },
 fl: { t: "Checking a licence before you ship",
       s: ["A dependency is about to enter a commercial product",
           { q: "Is it MIT, Apache or BSD?",
             y: "Permissive — keep the notice and you are generally fine",
             n: "GPL / AGPL — distributing may oblige you to open your own source" },
           { s: "Apache 2.0 also grants patent rights", n: "Which is why legal teams often prefer it to MIT." },
           "Run a licence scanner in CI so a transitive dependency cannot surprise you"] }
},

"Issue Tracker": {
 ex: { h: "The maintenance book in a block of flats",
       b: "*Lift making a noise* helps nobody. *Lift judders between floors 3 and 4 when going down, started Tuesday, two witnesses* gets an engineer with the right part. The tracker is also the building's memory — in two years it is the only record of why that pipe was rerouted." },
 fl: { t: "Writing an issue somebody can act on",
       s: ["Something is broken",
           { s: "State what happened and what you expected", n: "Those are two different sentences and both are needed." },
           { s: "Add exact steps to reproduce, plus version and environment", n: "If you cannot reproduce it, say that explicitly." },
           { q: "Is it clear when this is done?",
             y: "Link the PR when it lands so the reasoning survives",
             n: "Add an acceptance criterion before anyone starts work" }] }
},

"Standup": {
 ex: { h: "A pit crew radio check, not a progress report",
       b: "Nobody on the wall wants a narrative of the last lap. They want to know if anything is about to stop the car. A standup that becomes serial reporting to the lead has lost the plot; the whole value is in someone saying *I am stuck on the auth callback* and hearing *I fixed that in March*." },
 fl: { t: "Keeping it to fifteen minutes",
       s: ["Each person answers three short questions",
           { s: "Done, doing, blocked", n: "The third is the one that matters." },
           { q: "Does a topic need real discussion?",
             y: "Name who needs to be in it and take it offline immediately",
             n: "Move to the next person" },
           "Status lives in the tracker; the meeting exists to unblock people"] }
},

"Runbook": {
 ex: { h: "The emergency card in the seat pocket",
       b: "Written calmly, months in advance, by people who were not on fire at the time. Nobody wants to be reasoning from first principles about the door mechanism during the actual event. A runbook is written right after the incident that taught you the steps, while you still remember them." },
 fl: { t: "Turning an incident into a runbook",
       s: ["An incident is resolved",
           { s: "Write the steps down while they are fresh", n: "Including the dead ends, so the next person skips them." },
           { s: "Add how to confirm it is actually fixed", n: "A runbook without a verification step is half a runbook." },
           { q: "Has it been tested since it was written?",
             y: "Date it and note who verified it",
             n: "An untested runbook is a guess in a formal font" }] }
},

"Legacy Code": {
 ex: { h: "A Victorian house with unexplained pipework",
       b: "The pipe running diagonally through the pantry looks pointless until you remove it and the upstairs bathroom floods. Chesterton's fence: find out why the fence is there before you take it down. Legacy code is ugly because it accumulated real requirements that nobody wrote down anywhere else." },
 fl: { t: "Changing code you do not understand",
       s: ["You need to modify a module with no tests",
           { q: "Do you know why the odd-looking check exists?",
             y: "Change it deliberately, and note the reason in the commit",
             n: "Search the history and the tracker — it usually encodes an incident" },
           { s: "Write characterisation tests first", n: "Not tests of what it should do — tests of what it currently does." },
           "Now refactor. The tests tell you the moment behaviour changes"] }
},

"Minimum Viable Product": {
 ex: { h: "A food stall before a restaurant",
       b: "One dish, done properly, with real customers paying real money. Not a restaurant with an empty kitchen and half a menu. You learn whether people want the thing, at a fraction of the cost — and the dish is genuinely good, because *viable* is the operative word and it is the one everyone skips." },
 fl: { t: "Scoping an MVP without shipping something broken",
       s: ["List everything the full product would do",
           { s: "Cut features, never quality", n: "One flow that works beats five that almost do." },
           { q: "Have you decided what result would change your mind?",
             y: "You have a learning instrument — ship it and measure",
             n: "You have an unfinished product; nobody will know what to conclude" },
           "Security and data correctness are never in the cut list"] }
},

"Hotfix": {
 ex: { h: "Gaffer tape on a burst pipe at midnight",
       b: "You stop the water. You do not also re-tile the bathroom because you are already in there. And in the morning you make sure the proper repair reaches the main plumbing plan — because the one thing worse than an emergency fix is an emergency fix that gets overwritten by the next scheduled release." },
 fl: { t: "Shipping an urgent fix safely",
       s: ["Users are broken now; the next release is Thursday",
           { s: "Branch from the released tag, not from `main`", n: "`main` may contain unreleased work you do not want to ship." },
           { s: "Change the minimum possible", n: "Resist every temptation to tidy while you are in there." },
           { q: "Have you merged it back into `main`?",
             y: "Good — the next release keeps the fix",
             n: "Thursday's release will silently reintroduce the bug" }] }
},

"Staging Environment": {
 ex: { h: "A dress rehearsal on the actual stage",
       b: "Same lights, same set, same cues — that is what makes it worth doing. A rehearsal in a different room with different props tells you almost nothing. Staging is only useful to the degree it resembles production, which is why stale data and drifted config quietly turn it into theatre." },
 fl: { t: "Keeping staging honest",
       s: ["A change passes locally",
           { q: "Does staging match production's versions and config shape?",
             y: "A pass here is real evidence",
             n: "Fix the drift, or stop treating the result as a signal" },
           { s: "Refresh with anonymised production data periodically", n: "A thousand rows will not reveal what ten million will." },
           "Even so, use feature flags — staging never fully replaces gradual rollout"] }
},

"Production Environment": {
 ex: { h: "Operating on a patient, not a cadaver",
       b: "Everything is the same except that mistakes matter and cannot be undone by starting again. That single difference is why access is restricted, changes are logged, and every experienced engineer's first instinct during an incident is to stop the bleeding rather than to understand the cause." },
 fl: { t: "During an incident, in order",
       s: ["Something is broken for real users",
           { q: "Can you roll back?",
             y: "Roll back first. Understand it afterwards, with users unaffected",
             n: "Mitigate: disable the feature flag, shed load, serve stale cache" },
           { s: "Only then investigate the cause", n: "Debugging while users are down is the expensive order to do it in." },
           "Write the postmortem the same week, blameless, with concrete actions"] }
},

"Deployment": {
 ex: { h: "Changing a wheel on a moving bus",
       b: "You do it one wheel at a time, with the bus still carrying passengers, and you keep the old wheel within reach. Rolling deploys and health checks are how that is possible — and *can we put the old wheel back on in thirty seconds* is a far more useful question than *how fast can we fit the new one*." },
 fl: { t: "What a safe deploy looks like",
       s: ["A change is merged and CI passes",
           { s: "Build an immutable artifact and push it to a registry", n: "The same artifact goes to every environment." },
           { s: "Roll it out gradually behind health checks", n: "A few instances first, watching error rates." },
           { q: "Do the metrics look wrong?",
             y: "Roll back immediately — that is why the deploy was gradual",
             n: "Continue the rollout, then watch the dashboards for a while" },
           "Feature flags let the code ship dark and be released separately"] }
},

"Pseudocode": {
 ex: { h: "Sketching a room before drawing plans",
       b: "The napkin sketch settles where the door goes without anyone arguing about wall thickness. Writing the steps in plain language separates *what should happen* from *how do I spell this in Python*, and those genuinely are two different problems that are much harder when tackled together." },
 fl: { t: "Using it inside a real function",
       s: ["You have an empty function and a vague plan",
           { s: "Write the steps as comments, in order", n: "Plain English, no syntax, no lookups." },
           { q: "Reading them back, is a step missing?",
             y: "Fix it now, while it costs one line instead of an afternoon",
             n: "Replace each comment with the code that does it" },
           "The comments that survive are the ones explaining why"] }
},

"Assertion": {
 ex: { h: "The final check before a plane pushes back",
       b: "Doors armed, cross-check. It is a specific, verifiable claim with a yes or no answer — not *the plane seems fine*. A test with no assertion is a walk through the cabin that concludes *nothing fell over*, which is a much weaker statement than most people think they are making." },
 fl: { t: "What makes a test meaningful",
       s: ["The test calls the code under test",
           { q: "Does it assert on a specific outcome?",
             y: "A failure now tells you exactly what changed",
             n: "You have only proved the code did not throw" },
           { s: "Assert on behaviour, not incidental detail", n: "Fifteen brittle assertions train the team to ignore red builds." },
           "A good failure message names what was expected and what arrived"] }
},

"Mock": {
 ex: { h: "A crash-test dummy",
       b: "You do not test seatbelts with volunteers. The dummy is predictable, repeatable and free, and it lets you run the same collision a thousand times. Mocking a payment provider is the same instinct — but a car tested only on dummies still needs a real road test before it ships." },
 fl: { t: "What to mock and what to leave real",
       s: ["A test would otherwise hit a live service",
           { q: "Is the dependency slow, costly, or outside your control?",
             y: "Mock it — network, clock, payments, randomness",
             n: "Use the real thing; mocking your own code tests your mocks" },
           { s: "Keep a small set of real integration tests", n: "Otherwise nothing ever exercises the actual wiring." },
           "When the real API changes, only those tests will notice"] }
},

"Stub": {
 ex: { h: "A stand-in at a photo shoot",
       b: "Someone stands where the celebrity will be so the lighting can be set. Nobody asks whether the stand-in delivered the right performance — they are there to make the scene possible. A stub supplies data so the test can proceed; a mock is there to verify that a particular interaction happened." },
 fl: { t: "Stub or mock? Ask what you are checking",
       s: ["The test needs a collaborator that is not the subject",
           { q: "Are you asserting on how it was called?",
             y: "That is a mock — you care about the interaction",
             n: "That is a stub — it just returns canned data so you can proceed" },
           { s: "Asserting on stub calls couples the test to implementation", n: "Refactoring then breaks tests that should not care." },
           "Prefer asserting on the outcome the caller can observe"] }
},

"Fixture": {
 ex: { h: "A clean tray of instruments for every patient",
       b: "Nobody reuses the previous tray. Each procedure starts from a known, sterile state, and afterwards everything is cleared away. Tests that share mutable state pass alone and fail together, or fail only in a different order — which is the most exhausting category of failure to diagnose." },
 fl: { t: "Why the suite passes alone and fails together",
       s: ["Two tests use the same fixture object",
           { q: "Does one of them modify it?",
             y: "The second sees the mutation and fails, depending on order",
             n: "They are independent and order does not matter" },
           { s: "Build a fresh fixture per test and tear it down after", n: "Slower, and worth it every time." },
           "Keep the values the test cares about visible in the test, not buried in setup"] }
},

"Code Coverage": {
 ex: { h: "Counting which rooms the cleaner walked through",
       b: "Ninety percent of rooms visited tells you nothing about whether anything got cleaned. Coverage measures execution, not verification — a test with no assertions still lights the lines green. Low coverage on a critical module is a real warning; a coverage target is a number that will be gamed." },
 fl: { t: "Using the number honestly",
       s: ["The report says 87%",
           { q: "Are you about to chase the last 13%?",
             y: "Stop — look at which lines are uncovered and whether they matter",
             n: "Good; open the report and read the gaps" },
           { s: "Executed is not tested", n: "Check the covered lines actually have assertions behind them." },
           "Cover the payment path properly and let the logging helper stay red"] }
},

"Smoke Test": {
 ex: { h: "Turning the key before the long drive",
       b: "Engine starts, lights work, no warning lights. Thirty seconds, and it catches the catastrophes. It is not a service and it will not find a worn brake pad — but nobody sets off on a six-hour drive without it, and nobody should run a thirty-minute test suite before checking the app boots." },
 fl: { t: "Where it belongs in the pipeline",
       s: ["A build finishes",
           { s: "Run the smoke checks first", n: "Does the app start? Does `/health` return 200? Can a user log in?" },
           { q: "Did any of them fail?",
             y: "Stop the pipeline now — the full suite would waste thirty minutes",
             n: "Run the real test suite" },
           "Run the same checks again immediately after deploy"] }
},

"Seed Data": {
 ex: { h: "A furnished show flat",
       b: "An empty flat tells a buyer nothing about how the kitchen works. Seed data furnishes the app so it can be developed against: a few users, a few orders, and deliberately one of each awkward case. What it must never be is a copy of the real residents' post." },
 fl: { t: "Seeding a development database safely",
       s: ["A fresh database has no rows",
           { s: "Run the seed script committed with the code", n: "So the schema and the data stay in step." },
           { s: "Include the edge cases you care about", n: "A user with no orders, an order with fifty lines, a cancelled one." },
           { q: "Tempted to copy production data instead?",
             y: "Anonymise first — this is the classic route for personal data to leak",
             n: "Obviously fake names make it clear nobody is looking at a real customer" }] }
},

"Migration": {
 ex: { h: "Building an extension while people live in the house",
       b: "You do not knock the wall through on a Tuesday afternoon with the family inside. You build the new room first, move things across gradually, and only then remove the old wall. Renaming a column on a large live table is exactly this, done in one afternoon, and it is how downtime happens." },
 fl: { t: "Renaming a column with no downtime",
       s: ["Add the new column alongside the old one",
           { s: "Deploy code that writes to both, reads from the old", n: "Nothing has changed for users yet." },
           { s: "Backfill the new column in batches", n: "Small batches, so no long lock." },
           { q: "Are reads switched over and stable?",
             y: "A later release drops the old column",
             n: "Roll back safely — the old column is still authoritative" },
           "Four small deploys instead of one dangerous one"] }
},

"Array vs Linked List": {
  ex: { h: "A row of numbered lockers vs a treasure hunt map",
        b: "An array is a row of physical lockers #1 to #100: to open locker #42, you walk straight to door 42 in one second. A linked list is a treasure hunt: locker #1 holds a clue with the address of locker #88, which holds the address of locker #12. Inserting a clue is easy, but finding the 50th clue requires walking the whole chain." },
  fl: { t: "Choosing between the two",
       s: [{ s: "An array keeps all its items side by side in one continuous block of memory", n: "Like numbered seats in a row. Seat 47 is found instantly by counting from the first one." },
           { s: "A linked list scatters items anywhere, and each one holds a note saying where the next one is", n: "Like a treasure hunt. To reach the 47th you must follow 46 notes." },
           { q: "Do you mostly need to jump straight to item number 47?",
             y: "Use an array. It works out the exact position with one calculation and goes there immediately, however large the list",
             n: "Use a linked list if you mostly insert and remove things in the middle" },
           { s: "Inserting into the middle of an array means shifting everything after it along one place", n: "Fine for a hundred items, painful for a million." },
           { s: "A linked list just rewrites two notes, no matter how big it is", n: "But it uses extra memory for all those notes, and jumping around memory is slower than reading a solid block." },
           { s: "In practice, arrays win far more often than people expect", n: "Modern processors read memory in chunks, so items sitting side by side are dramatically faster to work through." }] }
},

"Stack and Queue": {
  ex: { h: "A stack of pancakes vs the airport security queue",
        b: "A stack is hot pancakes on a plate: the chef slides the freshest pancake onto the top (push), and you eat the top pancake first (pop / LIFO). A queue is airport security: the first passenger to join the ribbon queue is the first passenger checked (FIFO) — cutting in line is strictly forbidden." },
  fl: { t: "Choosing between the two",
       s: [{ s: "Both hold items waiting to be dealt with. The only difference is which one you take out next", n: "That single choice changes what each is useful for entirely." },
           { s: "A stack gives you back the most recent thing you put in", n: "Like a pile of plates: you take from the top, so the last one on is the first one off." },
           { s: "A queue gives you back the oldest thing you put in", n: "Like a queue at a shop: first in, first served. Nobody jumps ahead." },
           { q: "Should the newest item be handled first?",
             y: "Use a stack. Undo history works this way — the last thing you did is the first thing undone. So does checking that brackets match",
             n: "Use a queue. Jobs waiting to be processed, messages waiting to be sent, printing — anything where waiting longer should mean going first" },
           { s: "Both add and remove in a fixed tiny amount of time, however many items they hold", n: "A million items is no slower than ten, because neither ever searches — it always knows exactly which item is next." }] }
},

"Graph Traversal": {
  ex: { h: "Ripples on a lake (BFS) vs an explorer in a cave (DFS)",
        b: "BFS is dropping a stone into water: waves expand in concentric circles, touching every pebble 1 metre away before reaching 2 metres away. DFS is an explorer entering a cave: they follow one tunnel as deep as it goes until hitting a dead end, mark the wall with chalk, and backtrack to the last fork." },
  fl: { t: "Choosing between BFS and DFS",
        s: ["You need to traverse a network or tree",
            { q: "Do you need to find the shortest path / minimum hops?",
              y: "BFS: uses a Queue, visits all neighbors level-by-level",
              n: "DFS: uses a Stack or Recursion, explores deep branches" },
            { s: "Track `visited` set to avoid infinite loops in graphs", n: "Essential for cyclic networks." },
            "BFS finds nearest neighbors; DFS is ideal for maze solving and cycle detection"] }
},

"Process vs Thread": {
  ex: { h: "Separate office buildings vs coworkers sharing one desk",
        b: "Two processes are two separate office buildings with security gates: one building burning down does not affect the other, but sending a message requires courier trucks (IPC). Multiple threads are coworkers sitting around one shared whiteboard: they can share ideas instantly, but if one spills coffee on the board, everyone's work is ruined." },
  fl: { t: "Process vs Thread architectural decision",
        s: ["Designing a concurrent or parallel application",
            { q: "Do workers need isolated crash protection and secure private memory?",
              y: "Process: separate memory address space, high isolation, IPC required",
              n: "Thread: shared memory space, ultra-fast data sharing, mutex required" },
            { s: "Threads crash together if shared memory is corrupted", n: "Processes survive independent crashes." },
            "Use worker processes for heavy tasks; threads or async for lightweight concurrency"] }
},

"SOLID Principles": {
  ex: { h: "Interchangeable USB plugs vs soldered wires",
        b: "If your mouse was soldered directly to your motherboard, upgrading the mouse would require buying a new computer. USB is the Dependency Inversion and Open/Closed principle in physical hardware: any device matching the standard USB interface can be plugged in without opening the laptop casing." },
  fl: { t: "Applying the SOLID checklist to a code review",
        s: ["Reviewing class design and module boundaries",
            { q: "Does the class do more than one single distinct job?",
              y: "Violates Single Responsibility: decompose into smaller focused classes",
              n: "Complies: easy to test and maintain" },
            { s: "Inject abstractions (interfaces) rather than concrete dependencies", n: "Enables mocking and easy extension." },
            "A SOLID codebase adapts to new requirements without breaking existing features"] }
},

});
