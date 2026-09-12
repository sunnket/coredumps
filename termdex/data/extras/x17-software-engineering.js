/* Real-world examples and step-by-step flows — Software Engineering Practice. */
TD.attach("software-engineering", {

"Version Control": {
 ex: { h: "`report_final_v2_FINAL_actual.doc`",
       b: "Everyone has produced that folder, and version control is the answer to it: one file, every version, every author, every reason. What makes it indispensable is not the storage but `git bisect` — being able to find the exact commit where behaviour changed, out of two thousand." },
 fl: { t: "What it gives you",
       s: ["Every change is recorded with author, time and message",
           { s: "History becomes searchable", n: "*When did this line change, and why* has an answer." },
           { q: "Something broke and you do not know when?",
             y: "Bisect: binary search the history, testing each midpoint — twelve steps through four thousand commits",
             n: "Diff, blame and revert cover the rest" },
           { s: "Branches let work proceed in parallel", n: "And merging is what reconciles it." },
           "Commit messages are written once and read for years — invest the extra sentence"] }
},

"Git": {
 ex: { h: "Built to manage the Linux kernel, used for everything",
       b: "Its distributed model means every clone is a full repository with the entire history — you can commit, branch and search offline, and there is no single server whose loss destroys the project. The tradeoff is a genuinely confusing interface over a genuinely simple data model." },
 fl: { t: "The three places your work lives",
       s: ["The working directory — files as you see them",
           { s: "`git add` moves changes to the staging area", n: "Which is what lets you commit part of your work." },
           { s: "`git commit` writes the staged snapshot to history", n: "Local only — nothing has left your machine." },
           { q: "Ready to share?",
             y: "`git push` sends commits to the remote",
             n: "Keep committing locally; history is yours until you push" },
           { s: "A branch is just a movable pointer to a commit", n: "Which is why branching is instant." },
           "Learn the model — commits, trees, refs — and the commands stop being arbitrary"] }
},

"Commit": {
 ex: { h: "One change, one message, one reason",
       b: "A commit that fixes a bug, renames a variable and reformats a file is impossible to review and impossible to revert cleanly. Keeping each one coherent costs nothing at the time and repays itself the first time someone needs to undo exactly one of those things." },
 fl: { t: "Making a good commit",
       s: ["Stage only the changes that belong together",
           { s: "`git add -p` lets you stage part of a file", n: "Which is how you separate a fix from the tidying you did alongside it." },
           { s: "Write a short imperative subject line", n: "*Fix off-by-one in pagination*, under about fifty characters." },
           { q: "Does the change need explaining?",
             y: "A blank line, then a body saying why — not what; the diff shows what",
             n: "The subject alone is enough" },
           { s: "Reference the issue or ticket", n: "Future readers will want the discussion, not just the code." },
           "Commit often locally, then tidy the history before sharing it"] }
},

"Branch": {
 ex: { h: "A pointer, not a copy",
       b: "People expect branching to be expensive because in older systems it was — a full copy of the tree. In git it writes a 41-byte file containing a commit hash, which is why creating a branch to try something for ten minutes is entirely normal." },
 fl: { t: "Working on a branch",
       s: ["Create it from an up-to-date mainline",
           { s: "Starting from a stale base guarantees conflicts later", n: "Pull first, always." },
           { s: "Commit freely — it is your private workspace", n: "Nobody else is affected until you push." },
           { q: "Has it been alive more than a couple of days?",
             y: "Rebase or merge from main regularly — divergence compounds",
             n: "Open a pull request when the work is coherent" },
           { s: "Delete it after merging", n: "Stale branches accumulate and confuse everyone." },
           "Long-lived branches are the single biggest source of painful merges"] }
},

"Merge": {
 ex: { h: "Combining two histories that both moved",
       b: "Git compares both branches against their common ancestor and applies both sets of changes. It succeeds automatically far more often than people expect — and when it cannot decide, it stops and asks rather than guessing, which is exactly the right behaviour." },
 fl: { t: "What happens during a merge",
       s: ["Git finds the common ancestor of both branches",
           { q: "Has the target branch moved at all?",
             y: "A three-way merge, producing a merge commit with two parents",
             n: "Fast-forward — just move the pointer, no merge commit needed" },
           { s: "Changes to different parts of a file merge cleanly", n: "Even within the same file, most of the time." },
           { s: "Overlapping edits produce a conflict", n: "Which you resolve by hand and then commit." },
           { s: "A clean merge is not a correct one", n: "Two compatible-looking changes can still break — run the tests." },
           "Merge preserves true history; rebase rewrites it into a line — teams should pick one"] }
},

"Rebase": {
 ex: { h: "Pretending you started later",
       b: "Rebasing replays your commits on top of the updated mainline, producing a straight line instead of a merge bubble. The history reads beautifully; the commits are new objects with new hashes, which is precisely why rebasing a branch other people have pulled causes chaos." },
 fl: { t: "Rebasing safely",
       s: ["Ensure the branch is yours alone",
           { q: "Has anyone else pulled this branch?",
             y: "Do not rebase it — their history and yours have permanently diverged",
             n: "Rebase onto the latest main" },
           { s: "Each commit is replayed in order", n: "Conflicts can appear at any of them — resolve and continue." },
           { s: "Interactive rebase can squash, reorder and reword", n: "The standard way to tidy a branch before review." },
           { s: "Pushing a rebased branch needs `--force-with-lease`", n: "Which refuses if someone else pushed in the meantime." },
           "The rule that avoids all pain: never rebase anything that has been shared"] }
},

"Merge Conflict": {
 ex: { h: "Two people, the same three lines",
       b: "Git stops and marks both versions rather than picking one, because it genuinely cannot know which is correct. Conflicts are not a failure of the tool — they are the tool refusing to silently discard someone's work, and the frequency is a function of how long branches live." },
 fl: { t: "Resolving one",
       s: ["Git marks the conflicting region with both versions",
           { s: "`<<<<<<<` yours, `=======`, `>>>>>>>` theirs", n: "Both are shown; neither is chosen." },
           { q: "Do you understand what the other change was for?",
             y: "Combine them deliberately — often the answer is both, not either",
             n: "Ask the author; guessing here silently loses work" },
           { s: "Delete the markers and stage the resolved file", n: "Leaving a marker in the file compiles surprisingly often." },
           { s: "Run the tests before committing the resolution", n: "A syntactically valid resolution can be semantically wrong." },
           "Merge from main daily on a long branch — many small conflicts beat one enormous one"] }
},

"Pull Request": {
 ex: { h: "Where the conversation attaches to the code",
       b: "It is a merge request with a discussion thread, automated checks and a record of who approved what. Its most underrated property is the description — six months later, the PR is often the only place the reasoning behind a change survives." },
 fl: { t: "A PR that gets reviewed quickly",
       s: ["Keep it small — under about 400 lines of change",
           { s: "Review quality collapses beyond that", n: "Reviewers approve large PRs without reading them." },
           { s: "Write a description covering what and why", n: "Plus how you tested it, and anything you are unsure about." },
           { q: "Are CI checks green?",
             y: "Request review — do not make a human find what a machine would have",
             n: "Fix it first" },
           { s: "Respond to every comment", n: "Even to say you disagree and why." },
           "Separate refactoring from behaviour change into different PRs — mixing them makes review impossible"] }
},

"Code Review": {
 ex: { h: "Its real value is not finding bugs",
       b: "Reviews catch some defects, and they matter more for spreading knowledge, keeping design coherent, and ensuring at least two people understand every part of the system. A team where only one person can safely change the billing code has a staffing risk, not a code problem." },
 fl: { t: "Reviewing well",
       s: ["Understand the intent before reading the diff",
           { s: "Read the description and the ticket first", n: "A review without context is just style commentary." },
           { q: "Is something wrong, or merely different from how you would do it?",
             y: "Wrong: say so clearly, with the reason and ideally a suggestion",
             n: "Different: mention it as a non-blocking note, or say nothing" },
           { s: "Distinguish blocking from optional comments explicitly", n: "*Nit:* is a genuinely useful convention." },
           { s: "Approve when it is better than what is there", n: "Not when it is perfect — perfect blocks forever." },
           "Automate style entirely — humans should never be arguing about formatting"] }
},

"Trunk-Based Development": {
 ex: { h: "One branch, and flags for the unfinished parts",
       b: "Everyone merges to main at least daily, so integration problems appear in hours rather than weeks. It requires two things to be safe: a test suite you actually trust, and feature flags to hide work that is merged but not ready — deploy and release become separate events." },
 fl: { t: "Working on trunk",
       s: ["Take a short-lived branch, hours to a day",
           { s: "Or commit directly to main with pair review", n: "Both are trunk-based; the branch is a convenience." },
           { q: "Is the feature incomplete but the code safe to merge?",
             y: "Put it behind a flag, merged and dark — this is what makes small merges possible",
             n: "Break it into a smaller shippable piece" },
           { s: "Main must always be releasable", n: "A broken main blocks everyone, so fixing it is top priority." },
           { s: "Remove flags once the feature is stable", n: "Otherwise you accumulate permanent conditional complexity." },
           "It does not work without strong automated tests — that is the prerequisite, not an optional extra"] }
},

"Monorepo": {
 ex: { h: "One repository, atomic cross-cutting changes",
       b: "Changing an API and all twelve of its consumers in a single reviewable commit is genuinely valuable, and impossible across twelve repositories. The cost arrives with scale: naive tooling rebuilds everything on every change, and clone times become a daily annoyance." },
 fl: { t: "Making one work",
       s: ["Everything lives in one repository with a shared history",
           { q: "Does a change need to span several projects?",
             y: "One atomic commit — this is the central benefit",
             n: "Ownership still matters: use code owners per directory" },
           { s: "Build only what changed", n: "Bazel, Nx or Turborepo — without this a monorepo becomes unbearable." },
           { s: "CI must be selective and cached", n: "Running the full suite on every commit does not scale." },
           { s: "Shallow and partial clones keep checkouts fast", n: "Full history of everything is a lot of data." },
           "The decision is about tooling investment, not about the repository count itself"] }
},

"Semantic Versioning": {
 ex: { h: "The number that tells you whether to worry",
       b: "`2.4.1` to `2.5.0` should be safe; `2.x` to `3.0` should not. It works only if maintainers are disciplined about what counts as breaking — and *we did not think anyone relied on that* is how a patch release breaks production." },
 fl: { t: "Choosing the next version",
       s: ["Look at what changed from the consumer's perspective",
           { q: "Could existing code stop working?",
             y: "Major bump — regardless of how small the change looks to you",
             n: "New functionality is minor; a fix alone is patch" },
           { s: "Below 1.0, all bets are off by convention", n: "`0.x` signals an unstable public interface." },
           { s: "Bug fixes can be breaking changes", n: "If people worked around the bug, fixing it breaks them." },
           "Publish a changelog with every release, and migration notes with every major"] }
},

"Changelog": {
 ex: { h: "Written for humans, not generated from commits",
       b: "A hundred auto-generated lines of `fix: update deps` tells an upgrading user nothing. A good changelog answers three questions: what is new, what broke, and what do I have to change — grouped, in plain language, ordered by what matters to a reader." },
 fl: { t: "Writing an entry",
       s: ["Group by Added, Changed, Deprecated, Fixed, Removed, Security",
           { s: "The Keep a Changelog convention", n: "Predictable structure means people can skim it." },
           { q: "Is anything breaking?",
             y: "Put it first, with explicit before-and-after migration instructions",
             n: "Order the rest by likely impact" },
           { s: "Write from the user's perspective", n: "*Fixed timezone handling in exports*, not *patched DateUtil*." },
           { s: "Link to the PR or issue for detail", n: "Keeping the entry itself short." },
           "Update it in the same PR as the change — retrofitting a changelog at release time never happens"] }
},

"Unit Test": {
 ex: { h: "Fast, isolated, and the ones you run constantly",
       b: "Thousands of them should finish in seconds, which is what makes them a feedback loop rather than a ceremony. The classic mistake is mocking so thoroughly that the test only proves the mocks were called — passing perfectly while the real integration is broken." },
 fl: { t: "Writing a useful one",
       s: ["Pick one behaviour, not one method",
           { s: "*Rejects an expired token* is a behaviour", n: "Name the test after it — the name is documentation." },
           { s: "Arrange, act, assert — and one logical assertion", n: "A failing test should name exactly what broke." },
           { q: "Does it need a database, a network or the clock?",
             y: "Inject a substitute — but not so much that only the substitutes are tested",
             n: "Pure functions are the easiest and most valuable to test" },
           { s: "Test the edges: empty, null, boundary, maximum", n: "The middle of the range rarely breaks." },
           "A test that never fails is not protecting anything — break the code and check it catches it"] }
},

"Integration Test": {
 ex: { h: "The layer where the real bugs live",
       b: "Unit tests pass and the system does not work, because the ORM generates different SQL than expected or the API contract shifted. Integration tests exercise real components together — slower, occasionally flaky, and the tier that catches what mocks hide." },
 fl: { t: "Testing components together",
       s: ["Decide what is real and what is stubbed",
           { s: "Real database, stubbed payment provider", n: "Use your own infrastructure; do not call third parties." },
           { s: "Spin up dependencies in containers", n: "Testcontainers gives a real database per run." },
           { q: "Do tests interfere with each other?",
             y: "Isolate: a transaction rolled back per test, or a fresh schema",
             n: "They can run in parallel" },
           { s: "Seed data explicitly per test", n: "Shared fixtures create order dependencies and mysterious failures." },
           "Keep them fewer than unit tests and far more numerous than end-to-end ones"] }
},

"End-to-End Test": {
 ex: { h: "Expensive, slow, and you still need a few",
       b: "Driving a real browser through signup, checkout and confirmation catches the failures no other tier can — a misconfigured redirect, a broken CSP header, a missing environment variable. Have five of them covering the paths that lose money, not five hundred covering everything." },
 fl: { t: "Keeping them from becoming a burden",
       s: ["Cover only critical user journeys",
           { s: "Signup, checkout, login — the flows whose failure is unacceptable", n: "Everything else belongs lower in the pyramid." },
           { q: "Is a test flaky?",
             y: "Fix it or delete it — a flaky suite trains people to re-run without looking",
             n: "Keep it, and keep it fast" },
           { s: "Select elements by role or test id, never by CSS class", n: "A styling change should not break a test." },
           { s: "Wait for conditions, never for a fixed duration", n: "`sleep(2)` is the primary cause of flakiness." },
           "Run them against a production-like environment, or they test something you do not ship"] }
},

"Test Pyramid": {
 ex: { h: "And the ice cream cone people actually build",
       b: "Many fast unit tests, fewer integration tests, a handful of end-to-end ones. The inverted version — mostly end-to-end — is where teams end up by accident, and it produces a suite that takes forty minutes, fails randomly, and nobody trusts." },
 fl: { t: "Placing a new test",
       s: ["Ask what could realistically break",
           { q: "Is it logic inside one unit?",
             y: "Unit test — milliseconds, and it points straight at the cause",
             n: "Is it the interaction between components? Integration test" },
           { s: "Only user-visible journeys justify end-to-end", n: "Each one is a maintenance liability." },
           { s: "A failure high in the pyramid should be rare", n: "If E2E catches things units should have, the lower tiers are too thin." },
           "Optimise for feedback speed — a suite over ten minutes stops being run before pushing"] }
},

"Test-Driven Development": {
 ex: { h: "Writing the test first changes the design",
       b: "That is the real argument, more than coverage. Code that is awkward to test is usually badly coupled, and you feel it immediately rather than three months later. Its cost is that it is genuinely hard to do while you are still exploring what you are building." },
 fl: { t: "The red-green-refactor loop",
       s: ["Write a failing test for the next small behaviour",
           { s: "Run it and watch it fail", n: "A test that passes before the code exists is testing nothing." },
           { s: "Write the simplest code that makes it pass", n: "Deliberately simple — even obviously incomplete." },
           { q: "Green?",
             y: "Now refactor with the test as your safety net",
             n: "Fix the code, not the test" },
           { s: "Repeat in small increments", n: "Minutes per cycle, not hours." },
           "It suits well-understood problems; exploratory work is often better served by writing tests after"] }
},

"Behaviour-Driven Development": {
 ex: { h: "Given, When, Then — and who it is really for",
       b: "The value is a shared vocabulary between product and engineering, where the specification is executable. The failure mode is a team writing Gherkin for itself: all the ceremony of natural language with none of the audience it exists to serve." },
 fl: { t: "Using it properly",
       s: ["Write scenarios with the people who want the feature",
           { s: "*Given a customer with an expired card, When they check out, Then…*", n: "In their words, describing behaviour, not implementation." },
           { q: "Will a non-engineer ever read these?",
             y: "BDD is earning its keep",
             n: "You are paying the syntax cost for nothing — write ordinary tests" },
           { s: "Step definitions bind the prose to code", n: "Keep them thin — logic belongs in the application." },
           { s: "Scenarios describe behaviour, not UI mechanics", n: "*Then they see a confirmation*, not *then div.success appears*." },
           "Concrete examples are the point — the Given/When/Then syntax is only a container for them"] }
},

"Mocking": {
 ex: { h: "Useful, and easy to overdo",
       b: "You mock the payment provider because you cannot charge a real card in CI. You should not mock your own database into oblivion, because then the test asserts that your code calls the methods you told it to call — a tautology that passes while production fails." },
 fl: { t: "Deciding what to substitute",
       s: ["Identify the dependency causing difficulty",
           { q: "Is it external, slow, or non-deterministic?",
             y: "Substitute it — third-party APIs, the clock, randomness, the filesystem",
             n: "Use the real thing; an in-memory or containerised version is usually available" },
           { s: "Prefer fakes over mocks", n: "A working in-memory implementation tests behaviour; a mock tests calls." },
           { s: "Verifying interactions couples tests to implementation", n: "Refactoring then breaks tests without breaking behaviour." },
           "If mocking is painful, that is design feedback — the dependency is probably too tangled"] }
},

"Test Coverage": {
 ex: { h: "100% coverage, zero assertions",
       b: "A test that calls every function and asserts nothing achieves perfect coverage and tests nothing. Coverage measures which lines ran, not whether behaviour is correct — which makes it a useful way to find untested areas and a terrible target to manage people against." },
 fl: { t: "Using it well",
       s: ["Generate a coverage report",
           { q: "Are there whole files or branches at zero?",
             y: "That is the signal — untested areas are what the report is for",
             n: "Do not chase the last few percent; it is usually error handling that is hard to trigger" },
           { s: "Branch coverage is more informative than line coverage", n: "A line runs; both sides of its condition may not." },
           { s: "Weight by risk", n: "Payment logic at 95% and the admin page at 40% is a reasonable outcome." },
           "Mandating a percentage produces tests written to satisfy the number, which are worse than none"] }
},

"Flaky Test": {
 ex: { h: "The test that fails one time in twenty",
       b: "Everyone learns to re-run CI, and on the day the failure is real, it is re-run too. A flaky test is worse than a deleted one because it actively erodes trust in the whole suite — quarantine it immediately and fix it or remove it." },
 fl: { t: "Tracking one down",
       s: ["Confirm it is flaky by running it many times",
           { q: "Does it depend on timing?",
             y: "Fixed sleeps and race conditions — wait for a condition instead",
             n: "Check for shared state, test order dependence, or the real clock" },
           { s: "Time zones, dates and random data are frequent culprits", n: "Inject the clock and seed the randomness." },
           { s: "Parallel tests sharing a database or a port", n: "Isolate resources per test." },
           { s: "Quarantine it out of the required suite while you work", n: "So it stops training people to ignore red." },
           "Track flakiness rates over time — the trend tells you whether the suite is improving"] }
},

"Refactoring": {
 ex: { h: "Changing the shape, not the behaviour",
       b: "The discipline is in the second half: refactoring means the observable behaviour is identical afterwards. Mixing a refactor with a feature in one commit means that when something breaks, nobody can tell which half did it — including you, a week later." },
 fl: { t: "Refactoring safely",
       s: ["Ensure tests cover the current behaviour first",
           { q: "Is the area untested?",
             y: "Write characterisation tests first — capture what it does, bugs included",
             n: "You have a safety net" },
           { s: "Make one small transformation at a time", n: "Extract a method, rename, inline — run tests after each." },
           { s: "Commit each step separately", n: "So any one is revertible." },
           { s: "Never mix in a behaviour change", n: "Separate commit, ideally a separate PR." },
           "Refactor when you are about to change an area — not as a standalone project nobody can justify"] }
},

"Technical Debt": {
 ex: { h: "Deliberate debt is a tool; accidental debt is a mess",
       b: "Shipping a hardcoded workaround to hit a launch date, with a ticket to fix it, is a loan taken knowingly. A tangle nobody chose and nobody understands is not debt, it is neglect — and the metaphor matters because only the first kind can be planned and repaid." },
 fl: { t: "Managing it",
       s: ["Record it when you incur it",
           { s: "A ticket, or a comment naming the tradeoff and the trigger to revisit", n: "Undocumented debt is invisible and never repaid." },
           { q: "Is this area changing frequently?",
             y: "The interest is being paid daily — prioritise it",
             n: "Stable ugly code costs little; leave it" },
           { s: "Repay it alongside feature work in the same area", n: "A dedicated *tech debt sprint* rarely survives prioritisation." },
           { s: "Frame it in delivery terms to stakeholders", n: "*This is why the last three features took twice as long.*" },
           "Not all debt is worth repaying — code that never changes can stay imperfect forever"] }
},

"Code Smell": {
 ex: { h: "A symptom, not a diagnosis",
       b: "A 400-line function, a class with fifteen dependencies, a comment explaining what the next line does. None is necessarily wrong — each is a prompt to look closer. Treating smells as rules produces mechanical refactoring that makes code worse in the name of cleanliness." },
 fl: { t: "Reacting to one",
       s: ["Notice the surface indication",
           { s: "Long method, large class, duplicated logic, long parameter list", n: "The catalogue is well known." },
           { q: "Does it actually cause difficulty here?",
             y: "Refactor — usually a named extraction that clarifies intent",
             n: "Leave it; some long functions are the clearest form the logic takes" },
           { s: "Duplication is only a smell when the copies must change together", n: "Coincidental similarity is not duplication." },
           "Smells are heuristics for where to look, not a checklist to be cleared"] }
},

"Linter": {
 ex: { h: "The reviewer that never gets tired",
       b: "Unused variables, shadowed names, missing awaits, accidental globals — a linter catches them in milliseconds, before a human wastes review attention on them. The rule of thumb: if a machine can enforce it, no person should ever be commenting on it." },
 fl: { t: "Introducing one to an existing codebase",
       s: ["Adopt a standard config rather than inventing one",
           { s: "Bikeshedding the rules costs more than any rule is worth", n: "Take a community default and move on." },
           { q: "Are there thousands of existing violations?",
             y: "Baseline them — enforce only on changed files, and fix the rest gradually",
             n: "Turn it on as a blocking CI check" },
           { s: "Run it in the editor, not only in CI", n: "Feedback five minutes later is worth far less." },
           { s: "Disable rules deliberately, with a comment saying why", n: "Blanket disables defeat the tool." },
           "Separate correctness rules from stylistic ones — the formatter should own style entirely"] }
},

"Formatter": {
 ex: { h: "The argument that ends permanently",
       b: "Prettier, gofmt, Black — they reformat on save and remove formatting from human discussion entirely. Go shipped one from day one and the community simply never had the debate. The right level of configurability is close to none, precisely because options invite arguments." },
 fl: { t: "Adopting one",
       s: ["Pick a formatter and accept its defaults",
           { s: "Even the ones you dislike", n: "Consistency is the value; your preference is not." },
           { s: "Reformat the whole codebase in one commit", n: "Then add it to `.git-blame-ignore-revs` so blame stays useful." },
           { q: "Should it run automatically?",
             y: "Format on save, plus a pre-commit hook or a CI check",
             n: "Manual formatting drifts within a week" },
           "A repository-wide reformat makes one ugly commit and permanently ends the topic"] }
},

"Design Pattern": {
 ex: { h: "Vocabulary first, solution second",
       b: "Saying *this is an observer* conveys a structure in three words. The trap is the opposite direction: learning twenty-three patterns and looking for places to apply them, producing an AbstractSingletonProxyFactoryBean where a function would have done." },
 fl: { t: "Using them well",
       s: ["Encounter a recurring design problem",
           { q: "Do you have the problem the pattern solves?",
             y: "Use it — and name it, so readers recognise the shape",
             n: "Do not apply it preemptively; patterns add indirection, which has a cost" },
           { s: "Many classic patterns are language workarounds", n: "Strategy is a function in a language with first-class functions." },
           { s: "Let patterns emerge through refactoring", n: "Recognised, not imposed." },
           "The names are the durable value — the implementations vary enormously by language"] }
},

"Singleton": {
 ex: { h: "The pattern most likely to be regretted",
       b: "One database connection pool sounds obviously right until you write tests: global mutable state that cannot be substituted, initialised in an order nobody controls, and shared across threads. Dependency injection gives the same single instance without the global." },
 fl: { t: "Before reaching for it",
       s: ["You want exactly one instance of something",
           { q: "Is the *one instance* requirement essential, or just convenient?",
             y: "Create one instance at startup and inject it — same outcome, testable",
             n: "You probably do not need the pattern at all" },
           { s: "Global access is the real problem, not single instantiation", n: "It hides dependencies from every signature." },
           { s: "Tests cannot substitute or reset it", n: "Which is where the pain actually shows up." },
           "Configuration and logging are the defensible cases — most others are not"] }
},

"Factory Pattern": {
 ex: { h: "Deciding which class without saying so everywhere",
       b: "A payment processor that returns a Stripe or PayPal implementation based on configuration. Callers ask for a processor and get one; the decision lives in one place. Its overuse is equally recognisable — a factory that has exactly one product and always will." },
 fl: { t: "When it earns its place",
       s: ["Construction requires a decision or setup",
           { q: "Does the caller need to know the concrete type?",
             y: "Then just call the constructor — a factory adds indirection for nothing",
             n: "A factory returns the interface and hides the choice" },
           { s: "Useful when the type depends on configuration or input", n: "Or when construction requires several steps." },
           { s: "Registering implementations makes adding one a config change", n: "Rather than editing a switch statement." },
           "In dynamic languages a function returning an object is a factory — the ceremony is optional"] }
},

"Observer Pattern": {
 ex: { h: "Notify anyone interested, without knowing who",
       b: "A button that fires a click event does not know what listens. It is the foundation of every UI framework and every event bus — and its failure mode is equally universal: listeners that are never removed, holding references and leaking memory quietly." },
 fl: { t: "Wiring it up",
       s: ["The subject maintains a list of observers",
           { s: "It knows only the interface, never the concrete listeners", n: "That decoupling is the point." },
           { s: "On a state change it notifies every observer", n: "Order is usually unspecified — do not depend on it." },
           { q: "Does an observer outlive its interest?",
             y: "It must unsubscribe — this is the classic memory leak in every UI framework",
             n: "It keeps receiving until removed" },
           { s: "Debugging is harder", n: "Control flow is no longer visible in the source." },
           "Avoid observers that trigger further notifications — cycles are difficult to unpick"] }
},

"Strategy Pattern": {
 ex: { h: "Swap the algorithm, keep the caller",
       b: "Three shipping calculators behind one interface, chosen at runtime. It replaces a growing switch statement with a set of small classes — and in any language with first-class functions it is often just passing a function, with no classes at all." },
 fl: { t: "Applying it",
       s: ["Several algorithms serve the same purpose",
           { s: "Sorting rules, pricing rules, compression methods", n: "Interchangeable from the caller's point of view." },
           { q: "Does the choice happen at runtime?",
             y: "Strategy — inject the implementation and the caller stays unchanged",
             n: "A plain conditional is simpler and clearer" },
           { s: "Adding a strategy requires no change to the caller", n: "Which is the open-closed principle in practice." },
           { s: "Each strategy is independently testable", n: "A real practical benefit over a long switch." },
           "In Python or JavaScript, pass a function — the class hierarchy is usually unnecessary"] }
},

"MVC": {
 ex: { h: "One acronym, many incompatible interpretations",
       b: "Rails, ASP.NET and the original Smalltalk definition all mean genuinely different things by *controller*. What survives across all of them is the useful part: keep the data, the display and the coordination separate, so changing one does not force changing the others." },
 fl: { t: "Where a change belongs",
       s: ["Identify what kind of change it is",
           { q: "Is it a business rule?",
             y: "The model — it should be testable with no UI at all",
             n: "Presentation goes in the view; request coordination in the controller" },
           { s: "Fat controllers are the standard failure", n: "Business logic migrates there and becomes untestable." },
           { s: "Views should not query the database", n: "That coupling makes both untestable." },
           "Modern variants — MVVM, MVP, MVI — differ mainly in how the view and model communicate"] }
},

"SOLID": {
 ex: { h: "Five principles, one genuinely essential",
       b: "Dependency inversion — depend on abstractions, not concrete classes — is what makes code testable and swappable, and it earns its place. The other four are useful heuristics that, applied dogmatically, produce a class per method and an interface per class." },
 fl: { t: "Applying them proportionately",
       s: ["Single responsibility: one reason to change",
           { s: "*Responsibility* is subjective — it is a smell test, not a rule", n: "Ask who would request a change to this." },
           { s: "Open-closed: extend without modifying", n: "Achieved through interfaces and injection." },
           { q: "Does this class construct its own dependencies?",
             y: "Invert it — inject them, and it becomes testable immediately",
             n: "Liskov and interface segregation are mostly about not lying in your types" },
           "Apply them where change is likely — premature abstraction is its own kind of debt"] }
},

"DRY": {
 ex: { h: "Duplicated knowledge, not duplicated characters",
       b: "Two functions that look alike but change for different reasons should stay separate — merging them creates a coupling that hurts the first time one needs to change. The rule of three is a good default: wait until you see it a third time before abstracting." },
 fl: { t: "Deciding whether to extract",
       s: ["You notice two similar pieces of code",
           { q: "If one changes, must the other change identically?",
             y: "It is duplicated knowledge — extract it",
             n: "Coincidental similarity — leave both alone" },
           { s: "Premature abstraction is harder to undo than duplication", n: "*Duplication is cheaper than the wrong abstraction.*" },
           { s: "Wait for the third occurrence", n: "By then the shape of the real abstraction is clear." },
           "The worst outcome is an over-parameterised shared function with six boolean flags"] }
},

"KISS": {
 ex: { h: "The clever solution nobody can maintain",
       b: "A one-line regex doing five things is impressive and unmodifiable. Code is read far more often than written, usually by someone with less context than the author had — so *simple* means *simple to read*, not *shortest to type*." },
 fl: { t: "Checking for unnecessary complexity",
       s: ["Write the straightforward version first",
           { q: "Is there a measured reason to make it more complex?",
             y: "Optimise or generalise, with the measurement recorded in a comment",
             n: "Keep it simple — you are guessing at a future requirement" },
           { s: "Could a colleague understand it without you present?", n: "That is the operative test." },
           { s: "Complexity that solves a real problem is fine", n: "Complexity that solves an imagined one is not." },
           "Clever code is a liability at 3am, when the person reading it is tired and it is not you"] }
},

"YAGNI": {
 ex: { h: "The plugin system with one plugin",
       b: "Someone builds an abstraction layer for a database swap that never comes, and every query goes through three layers of indirection for a decade. Speculative generality costs immediately and pays only if the guess is right — which it usually is not." },
 fl: { t: "Resisting speculative work",
       s: ["You are about to build for a future requirement",
           { q: "Is it committed and scheduled?",
             y: "Build it — that is not speculation",
             n: "Do not — build the simple thing that works now" },
           { s: "Adding it later is usually cheap", n: "Removing an entrenched wrong abstraction is not." },
           { s: "Keep the code changeable rather than pre-generalised", n: "Good tests and clear boundaries beat guessing." },
           "It is not an argument against design — it is an argument against building unrequested features"] }
},

"Separation of Concerns": {
 ex: { h: "Why you can restyle without touching business logic",
       b: "When validation, persistence and presentation are tangled in one function, changing the button colour risks the tax calculation. Separated, each can be changed, tested and understood alone — which is the property that makes a system survive several years of change." },
 fl: { t: "Finding the seams",
       s: ["Look at what changes for different reasons",
           { s: "UI changes when design changes; rules change when the business does", n: "Different rates, different reasons — different modules." },
           { q: "Does changing one thing force changes in an unrelated place?",
             y: "The concerns are tangled — introduce a boundary",
             n: "The separation is holding" },
           { s: "Business logic should be testable with no framework", n: "The strongest single indicator of good separation." },
           "Do not over-separate — layers with one implementation each are indirection, not architecture"] }
},

"Documentation": {
 ex: { h: "Nobody reads it, and everybody needs it",
       b: "The reason documentation rots is that it lives far from the code and nothing enforces its accuracy. What survives is documentation that is either executed — examples in tests, generated API references — or that records reasoning, which does not go stale the way instructions do." },
 fl: { t: "Deciding what to write",
       s: ["Ask who will read this and when",
           { q: "Is it *how do I use this*?",
             y: "Working examples, generated references, and a quickstart that actually runs",
             n: "Is it *why is it like this*? Write an ADR — that is the highest-value kind" },
           { s: "Code documents what; comments should document why", n: "A comment restating the next line is noise." },
           { s: "Keep it next to the code", n: "Documentation in a separate wiki diverges within weeks." },
           { s: "Test your examples", n: "Doc examples that no longer compile are worse than none." },
           "Update it in the same PR as the change, or it will not happen"] }
},

"Architecture Decision Record": {
 ex: { h: "Answering *why on earth is it like this?*",
       b: "Two years later, everyone who made the decision has left and the choice looks obviously wrong. An ADR is one page recording the context, the options considered and the consequences accepted — cheap to write, and the difference between a mystery and a decision you can revisit." },
 fl: { t: "Writing one",
       s: ["Record the context — the forces and constraints at the time",
           { s: "This ages best and matters most", n: "Constraints explain decisions that look wrong later." },
           { s: "State the decision plainly, and the options rejected", n: "Including why they were rejected." },
           { s: "List the consequences, good and bad", n: "Honestly — every choice costs something." },
           { q: "Has a decision been reversed?",
             y: "Write a new ADR superseding the old one — never edit history",
             n: "It stands as the record" },
           "Store them in the repository, numbered — one file, a few paragraphs, no template ceremony"] }
},

"README": {
 ex: { h: "The first thirty seconds decide everything",
       b: "A new engineer, or an evaluating user, forms their entire impression from the top of this file. It should answer three things immediately: what is this, how do I run it, and where do I go next — before any badge, philosophy or contributor list." },
 fl: { t: "Structuring one",
       s: ["One sentence on what the project is and who it is for",
           { s: "Before badges, before installation", n: "A reader who cannot tell what it is will not scroll." },
           { s: "Then the shortest path to running it", n: "Copy-pasteable commands that work on a clean machine." },
           { q: "Can someone get it running in under five minutes?",
             y: "Add usage examples and links to deeper docs",
             n: "Fix that first — it is the highest-value part of the file" },
           { s: "Test the instructions on a fresh checkout", n: "READMEs bit-rot faster than code." },
           "Long content belongs in linked docs — the README is an index, not a manual"] }
},

"Agile": {
 ex: { h: "A manifesto, then twenty years of certification",
       b: "The original four values are about responding to change and delivering working software. What most organisations adopted was the ceremonies without the values — daily meetings and story points, while requirements are still fixed a year ahead and nothing responds to anything." },
 fl: { t: "Checking whether it is real",
       s: ["Look at what happens when learning contradicts the plan",
           { q: "Can the plan change based on what you learned?",
             y: "That is agility, whatever process you use",
             n: "It is waterfall with stand-ups" },
           { s: "Working software should reach users regularly", n: "Not just move to a *done* column." },
           { s: "The team should be able to change its own process", n: "A process imposed from outside cannot adapt." },
           "The practices are a means — a team shipping monthly and learning from it is agile with or without them"] }
},

"Scrum": {
 ex: { h: "Structure that helps, and ceremony that does not",
       b: "Fixed-length sprints, a prioritised backlog, and a review with real users is a reasonable operating system for a team. The recognisable failure is *scrum theatre*: velocity tracked as a performance metric, stand-ups that are status reports to a manager, and retrospectives with no resulting change." },
 fl: { t: "The cycle, and what each part is for",
       s: ["Planning: pick work from a prioritised backlog",
           { s: "The team commits to what it believes it can finish", n: "Commitment from the team, not to the team." },
           { s: "Daily stand-up: coordinate, surface blockers", n: "Fifteen minutes, for the team — not a report upward." },
           { q: "Is the sprint scope being changed mid-sprint?",
             y: "That is the thing sprints exist to prevent — protect the boundary",
             n: "Review with stakeholders, then retrospect" },
           { s: "The retrospective must produce a change", n: "Otherwise it is a complaint session with a calendar invite." },
           "Velocity is for the team's own forecasting — comparing it across teams is meaningless"] }
},

"Kanban": {
 ex: { h: "Limit work in progress and watch the queue drain",
       b: "Six things started and none finished is the normal state of an unlimited board. Kanban caps how many items can be in each column, so starting something new requires finishing something first — which feels restrictive and reliably increases throughput." },
 fl: { t: "Running a board",
       s: ["Visualise every stage the work passes through",
           { s: "Including waiting states — that is where the time actually goes", n: "*Waiting for review* is a column." },
           { s: "Set an explicit WIP limit per column", n: "The mechanism that makes it work." },
           { q: "Is a column at its limit?",
             y: "Nobody starts anything new — help clear the bottleneck instead",
             n: "Pull the next item" },
           { s: "Measure cycle time, not velocity", n: "How long from start to done is the number that matters." },
           "It suits continuous flow and support work better than Scrum's fixed iterations"] }
},

"Sprint": {
 ex: { h: "A timebox, not a deadline",
       b: "The point of a fixed two weeks is a regular rhythm of planning, delivering and reflecting — with a boundary that protects the team from mid-flight reprioritisation. Treating it as a series of mini-deadlines produces exactly the crunch it was designed to remove." },
 fl: { t: "A healthy sprint",
       s: ["The team selects work it believes it can complete",
           { s: "Based on past evidence, not on hope or pressure", n: "Chronic overcommitment destroys the value of the forecast." },
           { s: "Scope is protected during the sprint", n: "Genuine emergencies swap something out — they do not add." },
           { q: "Work not finished at the end?",
             y: "It returns to the backlog and is re-prioritised — it does not roll over automatically",
             n: "Review it with stakeholders, then retrospect" },
           { s: "The increment should be genuinely shippable", n: "*Done* means done, not *done except testing*." },
           "Shorter sprints give faster feedback and less room to hide — one to two weeks suits most teams"] }
},

"User Story": {
 ex: { h: "A placeholder for a conversation",
       b: "*As a customer, I want to save my basket, so that I can come back later.* The value is the *so that* — it names the outcome, which lets the team suggest a cheaper way to achieve it. A story that reads like a technical instruction has thrown that away." },
 fl: { t: "Writing one that works",
       s: ["Name the user, the want and the reason",
           { s: "The reason is the most useful part", n: "It permits alternative solutions." },
           { q: "Is it small enough to finish in one sprint?",
             y: "Add acceptance criteria — how you will know it is done",
             n: "Split it by workflow step or by data variation, not by technical layer" },
           { s: "Splitting into *frontend story* and *backend story* delivers nothing", n: "Each slice should be independently valuable." },
           { s: "Details are settled in conversation, not in the ticket", n: "The card is a reminder, not a specification." },
           "Include the non-obvious cases in acceptance criteria — that is where the surprises live"] }
},

"Retrospective": {
 ex: { h: "The meeting that must change something",
       b: "Discussing the same friction every two weeks and changing nothing is worse than skipping it — it teaches the team that raising problems is pointless. One concrete, owned action per retrospective beats a long list nobody revisits." },
 fl: { t: "Running one that matters",
       s: ["Start by reviewing the last retro's actions",
           { s: "This single habit is what separates useful retros from ritual", n: "If nothing happened, ask why — that is the real topic." },
           { s: "Gather what went well and what did not", n: "Written first, then discussed, so the loudest voice does not set the agenda." },
           { q: "Have you identified a theme?",
             y: "Pick one, and agree a specific action with an owner and a date",
             n: "Prioritise — five actions means zero actions" },
           { s: "Psychological safety is the prerequisite", n: "If naming a problem has consequences, people stop naming problems." },
           "Vary the format occasionally — the same three questions every fortnight stops producing insight"] }
},

"Waterfall": {
 ex: { h: "Fairly described, and unfairly maligned",
       b: "The 1970 paper that named it actually argued against doing it in a single pass. Sequential phases genuinely suit work where requirements cannot change and the cost of being wrong is catastrophic — bridges, avionics, medical devices. It suits exploratory software badly." },
 fl: { t: "When sequential works",
       s: ["Requirements are fixed and well understood",
           { q: "Can requirements change during the project?",
             y: "Waterfall will resist it expensively — iterate instead",
             n: "Sequential phases with formal sign-off are reasonable" },
           { s: "Regulated and safety-critical domains often mandate it", n: "The documentation trail is the point." },
           { s: "Its real weakness is late feedback", n: "Everything is validated at the end, when change costs most." },
           "Most real projects are hybrids — a fixed architecture with iterative delivery inside it"] }
},

"Software Development Life Cycle": {
 ex: { h: "The whole arc, including the part nobody plans",
       b: "Requirements, design, build, test, deploy, maintain — and maintenance is where most of the money goes, typically the majority of total cost. Decisions made in a week of design are paid for over a decade of operation, by people who were not in the room." },
 fl: { t: "The phases and where the cost sits",
       s: ["Requirements: understand the problem",
           { s: "Errors here are the most expensive to fix later", n: "By orders of magnitude, consistently measured." },
           { s: "Design and build", n: "The part most visible to management and the smallest share of lifetime cost." },
           { q: "Is the system live?",
             y: "Maintenance begins and continues for years — most of the total cost is here",
             n: "Testing and deployment gates precede it" },
           { s: "Plan retirement too", n: "Systems outlive their purpose, and nobody budgets for switching them off." },
           "Any model — waterfall, agile, spiral — covers these phases; they differ in ordering and iteration"] }
},

"Pair Programming": {
 ex: { h: "Expensive per hour, often cheaper per feature",
       b: "Two salaries on one keyboard looks wasteful until you count the review cycle it removes, the bugs caught during writing, and the knowledge that stops living in one person's head. It is exhausting, though — a few focused hours a day, not eight." },
 fl: { t: "Doing it effectively",
       s: ["Agree the goal before starting",
           { s: "Driver types; navigator thinks ahead", n: "Swap every twenty to thirty minutes." },
           { q: "Is one person doing all the talking and typing?",
             y: "It has become a lecture — swap the keyboard immediately",
             n: "Both are engaged; keep going" },
           { s: "Take real breaks", n: "It is far more intense than solo work." },
           { s: "Use it where it pays", n: "Tricky design, onboarding, unfamiliar code — not routine work." },
           "Mob programming extends it to the whole team, and suits high-stakes design decisions"] }
},

"Debugging": {
 ex: { h: "The bug is never where you first look",
       b: "The discipline is resisting the urge to change things and see what happens. Form a hypothesis, find a way to test it, and let the result narrow the search — because random edits occasionally hide the symptom and leave the cause in place." },
 fl: { t: "A systematic approach",
       s: ["Reproduce it reliably first",
           { s: "An intermittent bug you cannot trigger cannot be verified as fixed", n: "This step is worth real effort." },
           { s: "Reduce to the smallest failing case", n: "Half the time this alone reveals the cause." },
           { q: "Did it used to work?",
             y: "Bisect the history — that finds the change in about a dozen steps",
             n: "Form a hypothesis and design a test that would disprove it" },
           { s: "Verify the fix addresses the cause, not the symptom", n: "And add a test that fails without it." },
           "Question your assumptions in order — the bug is usually in the thing you were certain about"] }
},

"Rubber Duck Debugging": {
 ex: { h: "It works, and the reason is not mysterious",
       b: "Explaining out loud forces you to make every assumption explicit and sequential, which is exactly what silent reading skips. The bug is usually found mid-sentence, in the step you had been glossing over because you *knew* what it did." },
 fl: { t: "Doing it properly",
       s: ["Explain what the code is supposed to do, from the beginning",
           { s: "Out loud, in full sentences — writing works too", n: "Silent re-reading does not produce the same effect." },
           { s: "Walk through it line by line", n: "State what each line does, not what you intended it to do." },
           { q: "Did you hesitate or hand-wave over a step?",
             y: "That is where the bug is — go and verify it rather than assuming",
             n: "Continue to the end, then check your input assumptions" },
           "This is also why writing a good bug report so often solves the bug"] }
},

"Profiling": {
 ex: { h: "The bottleneck is never where you guessed",
       b: "A team spends a week optimising a function that turns out to be 2% of runtime, while an accidental N+1 query in a loop accounts for 80%. Profilers exist because human intuition about performance is reliably, measurably wrong." },
 fl: { t: "Profiling before optimising",
       s: ["Reproduce the slow path under realistic conditions",
           { s: "Production-shaped data — small test data hides scaling problems", n: "Many bottlenecks appear only at real volume." },
           { s: "Run a profiler and read the results by total time", n: "Not by call count." },
           { q: "Is one thing dominating?",
             y: "Fix that and re-profile — the bottleneck moves after every fix",
             n: "Death by a thousand cuts needs an architectural change, not micro-optimisation" },
           { s: "Check whether it is CPU, memory or I/O bound first", n: "They need entirely different fixes." },
           "Measure before and after — an optimisation without a measurement is a guess with extra complexity"] }
},

"Benchmark": {
 ex: { h: "Most microbenchmarks measure nothing",
       b: "A loop calling the same function a million times with the same input gets optimised away, runs entirely in cache, and reports a number that has no relationship to production. Benchmarking well is genuinely hard, which is why benchmark results should be read sceptically." },
 fl: { t: "Producing a trustworthy number",
       s: ["Warm up before measuring",
           { s: "JIT compilation and caches make the first runs unrepresentative", n: "Discard them." },
           { s: "Run many iterations and report the distribution", n: "Median and percentiles — a single run is noise." },
           { q: "Could the compiler eliminate the work?",
             y: "Consume the result so it cannot be optimised away — a classic invalid benchmark",
             n: "Vary the input to avoid unrealistic cache behaviour" },
           { s: "Control the environment", n: "Other processes, thermal throttling and power settings all move the number." },
           "Prefer measuring real workloads — a benchmark is a model, and models are wrong in useful ways"] }
},

"Legacy System": {
 ex: { h: "The system paying everyone's salary",
       b: "Twenty years old, no tests, one person who understands it, and it processes every transaction the company makes. *Legacy* is often used dismissively, but it usually means *successful for a long time* — which is why the rewrite instinct is so frequently a mistake." },
 fl: { t: "Changing one safely",
       s: ["Get it under test before changing anything",
           { s: "Characterisation tests capture what it does today", n: "Including behaviour that looks like a bug — something may depend on it." },
           { q: "Is a full rewrite being proposed?",
             y: "Almost always a trap — you rebuild years of undocumented edge cases from scratch",
             n: "Strangle it: route new functionality to new code, shrink the old system gradually" },
           { s: "Make small, reversible changes", n: "Each one verified before the next." },
           { s: "Document what you learn as you go", n: "You are the archaeologist; write it down." },
           "The undocumented behaviour is the specification — treat it with respect"] }
},

"Coding Standards": {
 ex: { h: "Agreement matters more than the content",
       b: "Whether the brace goes on the same line is genuinely unimportant; that the codebase is consistent is not. Standards exist so that reading unfamiliar code costs no extra effort — and so that reviews are about design rather than punctuation." },
 fl: { t: "Establishing them",
       s: ["Adopt an existing community standard",
           { s: "PEP 8, Google's style guides, the language default", n: "Writing your own from scratch is a poor use of a week." },
           { q: "Can a tool enforce it?",
             y: "Automate it — formatter and linter, in CI and in the editor",
             n: "Then it is a guideline, and it will drift; keep those few" },
           { s: "Document only what tooling cannot capture", n: "Naming conventions, error handling patterns, testing expectations." },
           { s: "Apply them to new and changed code first", n: "A big-bang reformat is one commit; retrofitting conventions is a project." },
           "Rules should be justifiable — an unexplained rule gets ignored the moment it is inconvenient"] }
},

"Formal Verification": {
 ex: { h: "Proof, where testing is not enough",
       b: "Amazon uses TLA+ to verify distributed protocols, because concurrency bugs hide in interleavings no test suite will ever exercise. It is expensive and narrow — you verify a specification, and a correct implementation of a wrong specification is still wrong." },
 fl: { t: "When it is worth the cost",
       s: ["Assess the cost of failure",
           { q: "Is it catastrophic and irreversible — avionics, cryptography, consensus protocols?",
             y: "Formal methods may be justified; testing cannot cover the state space",
             n: "Tests, types and reviews give better returns per hour" },
           { s: "Model checking explores every reachable state", n: "Which is how it finds interleavings a test never would." },
           { s: "You verify the model, not the code", n: "The gap between them is where bugs survive." },
           "Lightweight formal methods — strong types, invariants, property-based testing — capture much of the value cheaply"] }
}

});
