/* Real-world examples and step-by-step flows — crash course, reading code. */
TD.attach("crash-course", {

"Variable": {
 ex: { h: "The name badge on a hotel room key",
       b: "The key card does not care which room it opens — reception writes room 402 onto it today and room 118 onto it tomorrow. The card is the variable, the room number is the value. Ask for the card and you get whatever was last written to it, which is exactly why reading a variable after some other line has changed it can surprise you." },
 fl: { t: "What the computer does with `age = 30`",
       s: [{ s: "A variable is a name you attach to a value so you can refer to it later", n: "Without names you would have to repeat the value everywhere, and change it everywhere too." },
           { s: "The computer sets aside a small space in memory and puts 30 in it", n: "Memory is just a very long row of numbered slots. Your value goes in one of them." },
           { s: "The name `age` is then pointed at that slot", n: "The name is a label on a drawer, not the contents. This distinction matters more than it sounds." },
           { q: "What happens if a later line says `age = 31`?",
             y: "The label is moved to point at a new slot holding 31. The old value is left behind and cleaned up automatically",
             n: "If nothing reassigns it, every later mention of `age` reads the same 30" },
           { s: "So reading a variable is just following the label to whatever it currently points at", n: "Which is why a variable changed inside one part of a program can surprise another part still reading it." }] }
},

"Constant": {
 ex: { h: "The VAT rate printed on a till roll",
       b: "A shop does not re-derive 20% at every checkout, and it does not let the cashier type it in. It is set once, in one place, and every receipt uses it. When the Chancellor changes it, one setting changes and eleven thousand tills are correct the next morning — which is exactly the argument for `TAX_RATE` instead of `0.2` sprinkled through your code." },
 fl: { t: "Why one named value beats twelve copies",
       s: ["Rate appears as `0.2` in twelve places",
           { q: "Does the rate change?",
             y: "You must find all twelve — miss one and refunds are wrong",
             n: "Nothing breaks, but nobody knows what `0.2` means" },
           "Instead: define `TAX_RATE = 0.2` once, at the top",
           { s: "Every site reads the name, not the number", n: "The name also documents what the number is." },
           "A change touches one line and the whole system follows"] }
},

"Data Type": {
 ex: { h: "The `1` on a bus and the `1` on a price tag",
       b: "Bus number 1 and £1 are written with the same glyph and nobody confuses them, because context tells you one is a label and the other is a quantity. A computer has no context, so it makes you say which you meant. That is why the `5` typed into a web form arrives as text, and adding it to another `5` gives `55` instead of `10` until you convert it." },
 fl: { t: "Why a form field quietly breaks your total",
       s: ["User types `5` into a quantity box",
           { s: "The browser hands your code the string `\"5\"`", n: "Every form value arrives as text. Always." },
           { q: "Did you convert it with `int()` or `Number()`?",
             y: "`5 + 5` is `10` — arithmetic behaves",
             n: "`\"5\" + \"5\"` is `\"55\"` — `+` joined the text instead" },
           "The wrong total is stored, and nothing raised an error"] }
},

"String": {
 ex: { h: "A printed label versus the thing it names",
       b: "A jar labelled SUGAR is not sugar; the label is just marks on paper that you can read, copy or reprint. A string is the same — marks the computer stores without understanding. That is why `\"01\"` keeps its leading zero and the number `01` does not, and why phone numbers and postcodes belong in strings even though they look numeric." },
 fl: { t: "Why `name.upper()` does not change `name`",
       s: [{ s: "A string is just text — a run of characters the computer stores as a unit", n: "`\"ada\"` is three characters kept together." },
           { s: "In most languages, once a piece of text exists it can never be altered", n: "This is deliberate. It means anyone else holding that same text can rely on it not changing under them." },
           { s: "So `name.upper()` does not change anything — it builds a brand new piece of text, `\"ADA\"`", n: "The original `\"ada\"` is still sitting there untouched." },
           { q: "Did you catch that new text in a variable?",
             y: "Then you can use it: `loud = name.upper()` gives you both the old and the new",
             n: "Then it was created, immediately thrown away, and `name` still reads `\"ada\"` — which is one of the most common beginner surprises there is" },
           { s: "The rule generalises: if a method returns something, it probably did not change the original", n: "If it returns nothing, it probably did." }] }
},

"Integer": {
 ex: { h: "Counting people in a lift",
       b: "A lift holds eight people, not 8.3. Anything you count rather than measure is an integer: users, retries, items in a basket, seats. The moment you divide — nine people into four lifts — you have to decide whether the answer is 2 (whole lifts) or 2.25, and different languages answer that question differently unless you say which you meant." },
 fl: { t: "The division trap",
       s: ["You write `7 / 2` on two whole numbers",
           { q: "Which language is this?",
             y: "Python: `/` gives `3.5`, and `//` gives `3`",
             n: "C, Java, Go: `/` gives `3` and the `.5` is gone" },
           { s: "A silently truncated value flows onward", n: "No error, no warning — just a number that is slightly wrong." },
           "Be explicit: convert to float, or use the floor operator deliberately"] }
},

"Floating-Point Number": {
 ex: { h: "Writing one third on a cheque",
       b: "Split £10 three ways and write each share on a cheque: 3.33, 3.33, 3.33 — and a penny has vanished. The paper only has so many decimal places, so you round, and the rounding does not add back up. Binary has exactly this problem with 0.1, which is why financial systems store pennies as whole numbers rather than pounds as decimals." },
 fl: { t: "Where the missing penny comes from",
       s: ["You store a price as `0.1`",
           { s: "0.1 has no exact form in binary", n: "The nearest representable value is stored instead." },
           "You add it to `0.2`, which is also slightly off",
           { q: "Do you compare with `==` to `0.3`?",
             y: "`False` — the tiny errors survived the addition",
             n: "Compare within a tolerance, or use a Decimal type" },
           "For money: store integer pence and format only for display"] }
},

"Boolean": {
 ex: { h: "The bouncer's clipboard",
       b: "Everything at the door reduces to yes or no: on the list, old enough, dress code. The bouncer does not have a *maybe* column. Every `if` in your program is a doorman, and the condition is the clipboard check — which is why naming the variable `is_on_list` rather than `check` makes the code read like the actual question being asked." },
 fl: { t: "How a condition becomes a decision",
       s: ["`age >= 18` is evaluated",
           { s: "The comparison produces `True` or `False`", n: "Never a number, never text — one of exactly two values." },
           "`and` / `or` / `not` combine it with other answers",
           { q: "Is the final value `True`?",
             y: "The `if` block runs",
             n: "The block is skipped; `else` runs if there is one" }] }
},

"Null and Undefined": {
 ex: { h: "A blank line on a form versus a zero",
       b: "On a tax form, writing £0 in the income box means *I earned nothing*. Leaving it blank means *I have not answered*. An auditor treats those completely differently, and so must your code — a user with `0` credits is not the same as a user whose credits have never been calculated." },
 fl: { t: "The most common crash in software",
       s: ["Code reads `user.address.city`",
           { q: "Does `user.address` exist?",
             y: "The city is read and the page renders",
             n: "TypeError — the whole request dies here" },
           { s: "Use `user.address?.city` instead", n: "Optional chaining short-circuits to `undefined`." },
           "Pair it with `?? \"unknown\"` so the page has something to show"] }
},

"Operator": {
 ex: { h: "The word *and* in English",
       b: "*Fish and chips* joins two things. *Stop and think* sequences two actions. *Two and two* adds. Same word, three jobs, and you pick the right one from context. `+` is exactly this: it adds numbers, joins strings, and merges lists — and since the computer reads types instead of context, mixing a number with text is where the confusion lands." },
 fl: { t: "How `+` decides what it means",
       s: ["The engine sees `a + b`",
           { s: "It looks at the type on each side", n: "Not what you meant — what the values actually are." },
           { q: "Are both sides numbers?",
             y: "Arithmetic: `2 + 3` is `5`",
             n: "At least one is text, so it joins: `\"2\" + 3` is `\"23\"`" },
           "The result carries the type of whichever rule won"] }
},

"Assignment Operator": {
 ex: { h: "Writing on a whiteboard, not solving an equation",
       b: "A shift handover board says *ON DUTY: Priya*. At six o'clock someone wipes it and writes *ON DUTY: Sam*. Nobody argues that Priya equals Sam. The board is a slot, the name is the current contents, and `=` is the marker. Read it as *becomes* and `x = x + 1` stops being nonsense." },
 fl: { t: "The order `x = x + 1` runs in",
       s: ["The right-hand side is evaluated first",
           { s: "`x + 1` reads the current `x` and computes a value", n: "If `x` was 5, this produces 6." },
           "That result is stored back into `x`",
           { q: "Did you mean to compare instead?",
             y: "You wanted `==` — in C this compiles and quietly assigns",
             n: "Carry on; `+=` is the shorter way to write the same thing" }] }
},

"Comparison Operators": {
 ex: { h: "Passport control checking a birth date",
       b: "The officer is not interested in the date itself; they want one bit back — is this person over 18. Every comparison is that: two values in, a yes or no out. The subtlety is what counts as *the same*: a passport that says 01/02 and a form that says 1 Feb are equal to a human and different to a naive string comparison." },
 fl: { t: "Why `0 == \"\"` is `true` in JavaScript",
       s: ["JavaScript sees `0 == \"\"` — different types",
           { q: "Are you using `==` or `===`?",
             y: "`==` converts both sides to numbers first, so `0 == 0` — `true`",
             n: "`===` compares type as well, so number vs string — `false`" },
           { s: "Prefer `===` and `!==` by default", n: "Reach for `==` only when you deliberately want coercion." },
           "Floats are the other trap — compare within a tolerance, never exactly"] }
},

"Logical Operators": {
 ex: { h: "Ticket rules at a cinema",
       b: "*Over 15 AND holding a ticket* gets you in. *Member OR bought a day pass* gets the discount. *NOT already refunded* lets you cancel. Three words cover every access rule the cinema will ever write, and the same three cover every access rule your code will ever write." },
 fl: { t: "Short-circuiting, and why it doubles as a null check",
       s: ["Code reads `user && user.name`",
           { q: "Is `user` falsy?",
             y: "The right side is never evaluated — the whole thing is `user`",
             n: "The right side runs and its value is the result" },
           { s: "That is why this is safe on a missing user", n: "No TypeError, because the property was never touched." },
           "`value || \"default\"` is the same trick used for fallbacks"] }
},

"Modulo": {
 ex: { h: "Working out the day of the week",
       b: "It is Tuesday. What day is it in 100 days? You do not count 100 days — you take the remainder of 100 divided by 7, which is 2, and move two days to Thursday. Every clock, calendar and rota runs on modulo, and so does every *log every hundredth row* and *stripe every other table row* in your code." },
 fl: { t: "Logging progress without drowning in output",
       s: ["A loop is about to process a million rows",
           { s: "Each iteration increases the counter `i`", n: "Printing every row would produce a million lines." },
           { q: "Is `i % 1000 == 0`?",
             y: "Print a progress line — one per thousand rows",
             n: "Stay silent and carry on" },
           "One thousand readable lines instead of a million useless ones"] }
},

"Expression": {
 ex: { h: "A phrase versus a sentence",
       b: "*The tallest building in Mumbai* is a phrase — it names something. *Go to the tallest building in Mumbai* is an instruction. You can put a phrase inside an instruction, but not the other way round. Expressions are phrases: they produce a value you can pass, store or nest. Statements are the instructions that use them." },
 fl: { t: "Where an expression is allowed",
       s: ["You want to put something inside `print(...)`",
           { q: "Does the code produce a value?",
             y: "It is an expression — legal as an argument, a return, an assignment",
             n: "It is a statement — the parser rejects it there" },
           { s: "This is why Python has a ternary", n: "`a if cond else b` is the expression form of an `if`." },
           "Nest freely: an expression can be built from other expressions"] }
},

"Statement": {
 ex: { h: "A line in a recipe",
       b: "*Preheat the oven to 180°C.* *Fold in the flour.* Each line does something and the order matters — folding before mixing gives you a different cake. A program is the same list read top to bottom, with loops and conditions deciding which lines get read and how many times." },
 fl: { t: "How a program runs its lines",
       s: ["Execution starts at the entry point",
           "The next statement in order is executed",
           { q: "Is it a loop or a conditional?",
             y: "It redirects the flow — repeat, skip, or jump into a block",
             n: "It runs, then control falls through to the next line" },
           "Continue until the last statement, or until something returns or throws"] }
},

"Conditional": {
 ex: { h: "The sorting hat at airport security",
       b: "Liquids over 100 ml? Separate bin. Laptop? Out of the bag. Neither? Straight through. The staff work down a list and the first rule that matches decides your route — which is exactly why order matters, and why a catch-all rule placed too early swallows everything below it." },
 fl: { t: "How an if / elif / else chain resolves",
       s: ["The first condition is evaluated",
           { q: "Is it true?",
             y: "Run that block, then skip every remaining branch",
             n: "Move down to the next `elif`" },
           { s: "Repeat until a branch matches", n: "Order matters — a broad test placed early hides the specific ones below." },
           "If nothing matched, run `else`, or nothing at all"] }
},

"Ternary Operator": {
 ex: { h: "The plural on a receipt",
       b: "*1 item* or *2 items* — one letter that depends on one number. Writing four lines of if/else around a single word is heavier than the decision deserves. That is the entire job of the ternary: a small either/or value, chosen inline, where the surrounding sentence stays readable." },
 fl: { t: "Choosing a value inline",
       s: ["You need one of two values, not one of two code paths",
           { q: "Is the decision a single simple test?",
             y: "`count === 1 ? \"item\" : \"items\"` — one clear line",
             n: "Use `if` / `else`; a nested ternary is unreadable" },
           "The chosen value is produced and used where it stands"] }
},

"Truthy and Falsy": {
 ex: { h: "An empty shopping trolley at the till",
       b: "A cashier glances at the trolley and treats *empty* as *nothing to scan* without counting. Languages do the same shortcut with `if (items)`. The catch is what counts as empty: an empty JavaScript array is treated as **not** empty, while an empty Python list is — so the same instinct gives opposite answers in the two languages." },
 fl: { t: "The zero-quantity bug",
       s: ["A user deliberately enters quantity `0`",
           { q: "Does your code use `qty || 10`?",
             y: "`0` is falsy, so it is replaced by `10` — a real order is corrupted",
             n: "`qty ?? 10` only replaces `null` / `undefined`, so `0` survives" },
           { s: "The same trap catches empty strings", n: "A deliberately blank note becomes placeholder text." },
           "Test for absence explicitly when zero or empty are valid answers"] }
},

"Loop": {
 ex: { h: "A postal worker and a sack of letters",
       b: "The round is not written as deliver letter one, then letter two, then letter three. It is: for each letter in the sack, deliver it — which works whether the sack holds four letters or four hundred. `break` is finding the parcel you were looking for and heading back to the van. `continue` is skipping a house because the address is wrong." },
 fl: { t: "How a `for` loop actually runs",
       s: [{ s: "A loop repeats the same instructions once for each item in a collection", n: "The alternative is writing the same lines out a thousand times." },
           { s: "It asks the collection for its first item", n: "A list, a set of lines in a file, a range of numbers — anything that can hand things over one at a time." },
           { q: "Is there an item waiting?",
             y: "Attach it to your loop variable and run the block of instructions underneath",
             n: "There is nothing left, so skip past the whole loop and carry on with the rest of the program" },
           { s: "When the block finishes, go straight back and ask for the next item", n: "Round and round, once per item." },
           { s: "Two words interrupt this: `continue` skips the rest of this pass and gets the next item, `break` leaves the loop entirely", n: "`break` is how you stop early once you have found what you were looking for." }] }
},

"Nesting": {
 ex: { h: "Checking every seat in every carriage",
       b: "A ticket inspector walking ten carriages of eighty seats does eight hundred checks, not ninety. That multiplication is the whole reason nested loops turn a fast script into an overnight job — and the reason a reader loses the thread three levels in, because they have to hold every enclosing condition in their head at once." },
 fl: { t: "Why the inner loop is where the cost is",
       s: ["Outer loop runs over 1,000 customers",
           { s: "For each one, the inner loop scans 1,000 orders", n: "That is 1,000,000 comparisons, not 2,000." },
           { q: "Can you build a lookup table first?",
             y: "One pass to index, one pass to match — 2,000 operations",
             n: "Extract the inner block into a named function to at least keep it readable" },
           "Deep nesting is a signal: something wants to be its own function"] }
},

"Function": {
 ex: { h: "A coffee order at the counter",
       b: "You say *flat white, oat, extra shot* and a cup comes back. You do not stand there specifying grind size, water temperature and steam pressure — the barista holds all of that. Your order is the arguments, the cup is the return value, the barista is the function. When the recipe changes, every customer gets the new version without changing a word of their order." },
 fl: { t: "What happens when you call one",
       s: [{ s: "A function is a named block of instructions you can run whenever you like", n: "Write it once, use it a hundred times, fix it in one place." },
           { s: "You call it and hand it some values: `total(9.99, 3)`", n: "Those values are copied into the names the function chose for them — here, price and quantity." },
           { s: "The function runs its own instructions, with its own private set of names", n: "Names created inside it do not exist outside it, which is why two functions can both use `i` without colliding." },
           { q: "Does it reach a line that says `return`?",
             y: "That value is handed straight back to whoever called it, and the function stops right there — anything after that line never runs",
             n: "If it just reaches the end, it hands back an empty value anyway. Forgetting the `return` is why a function \"does nothing\"" },
           { s: "Control returns to the exact spot that called it, and the program carries on", n: "The function's private names are discarded on the way out." }] }
},

"Parameter": {
 ex: { h: "The blank fields on a delivery slip",
       b: "The printed slip has boxes for *address*, *weight* and *service*. The boxes exist before any parcel does — they are the shape of the information the courier needs. A parameter is that empty box: it has a name and a place, and it holds nothing until an actual parcel is booked." },
 fl: { t: "The shared-default bug in Python",
       s: ["You write `def add(item, basket=[])`",
           { s: "The empty list is created once, when the function is defined", n: "Not once per call — once, ever." },
           { q: "Do two different callers use the default?",
             y: "They share the same list; the second sees the first one's items",
             n: "Looks fine — until the day someone omits the argument twice" },
           "Use `basket=None` and build a fresh list inside the body"] }
},

"Argument": {
 ex: { h: "Reading out a card number over the phone",
       b: "The operator asks for long number, expiry, then the three digits on the back — in that order. Say them in a different order and the payment fails even though every digit was correct. Positional arguments are exactly this. Naming them — *expiry is 09/28* — is why keyword arguments are worth the extra typing." },
 fl: { t: "Positional versus keyword, at the call site",
       s: ["You call `create_user(\"ana\", true, false, 3)`",
           { q: "Can a reader tell what `true, false, 3` mean?",
             y: "Fine — the call has one or two obvious arguments",
             n: "Switch to keywords: `admin=True, verified=False, seats=3`" },
           { s: "Keywords are matched by name, not order", n: "Reordering them is now harmless." },
           "The call site documents itself and survives a signature change"] }
},

"Return Value": {
 ex: { h: "A vending machine that keeps your crisps",
       b: "You press the button, the coil turns, and nothing drops into the tray. Something definitely happened — it just did not hand anything back. `list.sort()` is that machine: it reorders the list perfectly and returns nothing, so `x = list.sort()` leaves you holding `None` and wondering where your data went." },
 fl: { t: "Sorted or sorting? The classic `None` surprise",
       s: ["You write `result = nums.sort()`",
           { s: "`sort()` reorders `nums` in place", n: "The list is genuinely sorted — that part worked." },
           { q: "Does the method return the new list?",
             y: "You would use `sorted(nums)`, which builds and returns a new one",
             n: "In-place methods return `None` — `result` is now `None`" },
           "The next line uses `result` and crashes far from the real cause"] }
},

"Early Return": {
 ex: { h: "A bouncer who turns you away at the rope",
       b: "You are not walked to the bar, handed a menu and then told you cannot stay. The refusal happens at the door, with the reason attached. Early return is the same courtesy to the reader: every rejection sits next to the check that caused it, and the real work below is never buried under three layers of conditions." },
 fl: { t: "Flattening a function with guards",
       s: ["Function receives an order and a discount code",
           { q: "Is any precondition missing?",
             y: "`return` immediately, with the reason for that specific failure",
             n: "Fall through to the next check" },
           { s: "Repeat for each precondition", n: "Each one is a single unindented line at the top." },
           "The main logic runs last, flat, and can assume everything is valid"] }
},

"Guard Clause": {
 ex: { h: "The height stick at a theme-park ride",
       b: "You are measured before you queue, not after you are strapped in. One check, at the entrance, and everything downstream can assume the rider fits the harness. A guard clause is the height stick: it states a precondition once, loudly, so the rest of the function never has to ask again." },
 fl: { t: "Reading a function's contract in five seconds",
       s: ["Open the function and read the first few lines",
           { s: "Each guard names one thing that must be true", n: "`if (!order) return null;` — and now `order` is guaranteed." },
           { q: "Does a guard fail at runtime?",
             y: "You get a specific reason, at the top, before any side effects",
             n: "Every later line can skip re-checking that condition" },
           "The body reads as the happy path with nothing defensive in it"] }
},

"Method": {
 ex: { h: "The buttons on a washing machine",
       b: "`start`, `pause` and `drain` are printed on the machine, not kept in a manual on a shelf. They act on this machine's drum, this machine's water. That is a method — a capability attached to a particular object, which already knows which object it belongs to without you telling it." },
 fl: { t: "What the dot really does",
       s: ["You write `cart.add(\"book\")`",
           { s: "The left of the dot is the object", n: "`cart` — a specific instance holding its own data." },
           { s: "The right is a function that object provides", n: "It is passed `cart` as a hidden first argument: `self` / `this`." },
           { q: "Does the method change the object or return a new one?",
             y: "In-place — `cart` is different now and the return is often `None`",
             n: "It returns a fresh object and leaves `cart` untouched" }] }
},

"Property": {
 ex: { h: "What is printed on a passport",
       b: "Name, date of birth, expiry — data you read off the page. *Renew* and *report lost* are things you do, and they live somewhere else. Properties are the printed fields; methods are the actions. If it has brackets after it you are asking the passport office to do something; if it does not, you are just reading the page." },
 fl: { t: "Property or method? The brackets tell you",
       s: ["You see `user.name` in unfamiliar code",
           { q: "Are there brackets after it?",
             y: "It is a method — it runs code and may cost time or hit the network",
             n: "It is a property — you are reading stored or computed data" },
           { s: "Getters blur the line deliberately", n: "`user.full_name` may quietly run code each time you read it." },
           "Either way, reading it on `null` is the crash you will meet most often"] }
},

"Instance": {
 ex: { h: "One printed copy of a novel",
       b: "The manuscript is written once. The print run produces fifty thousand copies, and you can spill coffee on yours without affecting anyone else's. The class is the manuscript, each book is an instance, and the coffee stain is instance data — private to that copy even though every copy shares the same words." },
 fl: { t: "From class to living object",
       s: ["A class defines what every user will have",
           { s: "You call `User(\"Ada\")`", n: "This is instantiation — building one." },
           { s: "The constructor runs and stores the starting values", n: "`self.name = \"Ada\"` on this object only." },
           { q: "Do you build another with `User(\"Grace\")`?",
             y: "A second, fully independent object — separate data, shared methods",
             n: "You have one object; changing its fields affects nothing else" }] }
},

"Constructor": {
 ex: { h: "The registration desk at a conference",
       b: "You arrive, they check your name, print a badge and hand you a lanyard — and then you are a delegate. It happens once, at the start, and it is quick. A constructor that instead tried to fetch your dietary requirements from three external systems would create a queue out of the door, which is exactly what a constructor doing network calls does to your tests." },
 fl: { t: "What runs when an object is created",
       s: ["Caller writes `PaymentGateway(api_key)`",
           { s: "Memory for the new object is allocated", n: "Empty, with no fields yet." },
           { s: "The constructor body runs", n: "Validate the inputs, assign the fields, and stop." },
           { q: "Does it do network or file work here?",
             y: "Every creation is slow and every test needs a live service",
             n: "Creation stays instant and the object is trivially testable" },
           "The finished object is handed back to the caller"] }
},

"Module": {
 ex: { h: "Kitchen drawers instead of one big box",
       b: "Cutlery in one drawer, utensils in another, tea towels in a third. Nobody argues this is over-engineering — it is what makes a kitchen usable at speed. A module is a drawer: related things together, labelled, so you reach for the right one without emptying everything onto the counter." },
 fl: { t: "Splitting a file that got too big",
       s: ["One file has grown to 1,200 lines",
           { s: "Group the functions that belong together", n: "Pricing logic here, email logic there." },
           "Move each group into its own file",
           { q: "Do two modules now import each other?",
             y: "Circular import — pull the shared piece into a third module",
             n: "Each file has one job and can be tested on its own" }] }
},

"Import": {
 ex: { h: "Signing tools out of a workshop store",
       b: "The lathe is in the building, but it is not in your bay until you sign it out. Nothing in a source file can see anything outside it until you import it — which is why the first thing that breaks on a new machine is almost always an import, and almost always because the environment holding the tools was never activated." },
 fl: { t: "Diagnosing ModuleNotFoundError",
       s: ["Running the script raises `ModuleNotFoundError: requests`",
           { q: "Is the virtual environment activated?",
             y: "Activate it — you were looking at the system Python",
             n: "Install it into this environment: `pip install requests`" },
           { s: "Still failing? Check which interpreter is running", n: "`which python` — editors often pick a different one." },
           "Record it in `requirements.txt` so the next machine works first time"] }
},

"Namespace": {
 ex: { h: "Two people called Sam in one office",
       b: "You do not rename either of them. You say *Sam in Finance* and *Sam in Design*, and the ambiguity disappears. The department is the namespace and the dot is the word *in*. It is also why `from module import *` is discouraged — it drops everyone's first name into one room and hopes for the best." },
 fl: { t: "Why star-imports cause trouble",
       s: ["You write `from numpy import *`",
           { s: "Every public name from numpy lands in your file", n: "Including `array`, `sum`, `any` — names you may already use." },
           { q: "Do two modules define the same name?",
             y: "The later import silently wins; your function is shadowed",
             n: "It works today, but no reader can tell where a name came from" },
           "Import the module and keep the prefix: `np.array` says exactly where it lives"] }
},

"Comment": {
 ex: { h: "A note taped to a fuse box",
       b: "*Left switch trips when the kettle and heater run together — do not swap the breakers.* That note is worth more than a label reading THIS IS A SWITCH. Comments that restate the code age badly and get ignored; comments that record why a decision was made are read gratefully at 2 a.m. two years later." },
 fl: { t: "Deciding whether a comment earns its place",
       s: ["You are about to write a comment",
           { q: "Does it just restate what the line does?",
             y: "Delete it, or rename the variable so the code says it instead",
             n: "Keep it — it explains why, or which bug forced this shape" },
           { s: "Comments drift; code cannot", n: "A comment contradicting the code is worse than none at all." },
           "Never leave commented-out code — version control already remembers it"] }
},

"Docstring": {
 ex: { h: "The label on a medicine bottle",
       b: "Dose, what it treats, what not to take it with. It travels with the bottle, so it is there when you need it rather than in a leaflet you threw away. A docstring lives inside the function at runtime, which is why your editor can show it on hover and `help()` can read it back — a comment cannot do either." },
 fl: { t: "From docstring to hover tooltip",
       s: ["You write a triple-quoted string as the function's first line",
           { s: "Python stores it on the object as `__doc__`", n: "It is data, not a comment — available while the program runs." },
           { q: "Who reads it?",
             y: "Your editor on hover, `help()`, and doc generators like Sphinx",
             n: "Nothing, if you wrote it as a `#` comment instead" },
           "Cover purpose, inputs and outputs; leave the how to comments in the body"] }
},

"Indentation": {
 ex: { h: "Sub-clauses in a contract",
       b: "Clause 4.2 sits under clause 4 and only applies within it. Move it out and it now governs the whole agreement — same words, different meaning. Python treats whitespace exactly this seriously: shift a line one level and it moves out of the loop, runs once instead of a thousand times, and nothing complains." },
 fl: { t: "The one-line-out bug",
       s: ["A `return` sits inside a `for` loop",
           { q: "Is it indented to the loop's level or the function's?",
             y: "Inside the loop — it returns on the first item, every time",
             n: "Outside — the loop completes, then the function returns" },
           { s: "Both versions are valid Python", n: "No error; just a function that quietly does one job instead of another." },
           "Let a formatter own the whitespace so this is the only thing you have to think about"] }
},

"Zero-Based Indexing": {
 ex: { h: "Floors in a European building",
       b: "You walk in at the ground floor — floor 0 — and the first flight of stairs takes you to floor 1. The number is not *which floor* but *how far up from the entrance*. An array index is exactly that: an offset from the start, which is why the first item is at 0 and the last is at length minus one." },
 fl: { t: "Why `items[len(items)]` always fails",
       s: ["A list holds three items",
           { s: "Valid indexes are 0, 1 and 2", n: "Three items, but the highest index is 2." },
           { q: "Do you ask for `items[3]`?",
             y: "IndexError — you asked for a fourth item that does not exist",
             n: "Use `items[-1]` in Python, or `items[len - 1]` elsewhere" },
           "Better still: iterate the collection directly and never touch an index"] }
},

"Off-by-One Error": {
 ex: { h: "Fence posts and fence panels",
       b: "Ten posts hold up nine panels. Order ten panels and one gap stays open; count panels when you meant posts and you are one short. Every loop boundary is this fence, and the reason `range(len(items) - 1)` misses the last item is that someone counted panels while thinking about posts." },
 fl: { t: "Catching it before it ships",
       s: ["You write a loop with an explicit numeric range",
           { q: "Can you iterate the collection directly instead?",
             y: "Do that — the boundary disappears and so does the bug class",
             n: "You genuinely need indexes; keep going, carefully" },
           { s: "Test with an empty list and a one-item list", n: "Those two cases expose nearly every off-by-one." },
           "Remember the convention: start included, end excluded"] }
},

"Key-Value Pair": {
 ex: { h: "The luggage tag at a cloakroom",
       b: "You hand over a coat and get ticket 47. Nobody remembers *the coat is third from the left* — they look up 47 and the coat appears instantly, whether there are ten coats or a thousand. That is a key and a value, and the instant lookup is why dictionaries beat lists whenever you know the name of the thing you want." },
 fl: { t: "Why lookup by key is instant",
       s: ["You ask for `user[\"email\"]`",
           { s: "The key is run through a hash function", n: "Text in, a number out — always the same number for the same key." },
           "That number points straight at a storage slot",
           { q: "Does the size of the collection matter?",
             y: "No — ten pairs or ten million, it is one jump",
             n: "A list would have to scan every entry until it matched" }] }
},

"Dictionary": {
 ex: { h: "A hotel switchboard",
       b: "Ask for *room 402* and you are connected. Ask for *the fourth room along the second corridor* and the operator has to go and look. Dictionaries answer the first kind of question, lists answer the second — and choosing the wrong one is why some code walks the whole customer list to find one email address." },
 fl: { t: "Handling a key that might not be there",
       s: ["You read a value out of parsed JSON",
           { q: "Are you certain the key exists?",
             y: "`config[\"host\"]` is fine and fails loudly if you are wrong",
             n: "Use `config.get(\"debug\", False)` and carry on with a default" },
           { s: "JavaScript differs — a missing key gives `undefined`", n: "No exception, so the failure surfaces later and further away." },
           "For anything you did not create yourself, always take the safe form"] }
},

"Iterator": {
 ex: { h: "A conveyor belt at baggage claim",
       b: "You do not wait for every suitcase on the flight to be unloaded and stacked in the hall before looking. Bags arrive one at a time and you take yours when it appears. Iterating a 40 GB log file works the same way — one line in memory at a time, which is why it works on a laptop that has 16 GB of RAM." },
 fl: { t: "Reading a file bigger than your memory",
       s: ["Open the file and loop over it directly",
           { s: "One line is read into memory", n: "Not the file — one line." },
           "Process it, then let it be discarded",
           { q: "Do you loop over the same iterator a second time?",
             y: "Nothing happens — it was consumed the first time",
             n: "Repeat until the file signals it has no more lines" }] }
},

"Slicing": {
 ex: { h: "Cutting a train ticket strip",
       b: "You tear off coupons two through five. The tear is *before* coupon two and *before* coupon six, so you get four coupons and the strip joins back up with no overlap and no gap. That is why the end of a slice is excluded, and why `end - start` is exactly the number of items you get." },
 fl: { t: "Chunking text without losing a character",
       s: ["You need pieces of 500 characters",
           { s: "First slice is `text[0:500]`", n: "Characters 0 to 499 — 500 of them." },
           { q: "Where does the next slice start?",
             y: "At 500 — the excluded end becomes the next start, so nothing repeats",
             n: "Start at 501 and you have silently dropped character 500" },
           "Consecutive slices tile perfectly because the end is exclusive"] }
},

"List Comprehension": {
 ex: { h: "A shopping list written as a rule",
       b: "*Everything in the fridge that expires this week* is one sentence, not four steps of take-out, check-date, put-in-bag, repeat. A comprehension is that sentence in code — and like the sentence, it stops helping the moment you try to cram three unrelated conditions into it." },
 fl: { t: "Turning four lines into one",
       s: ["You start with create-list, loop, test, append",
           { s: "Move the expression to the front", n: "`u.name.title()` — what each result should be." },
           { s: "Then the loop, then the filter", n: "`for u in users if u.active`" },
           { q: "Would the one-liner need a comment to read?",
             y: "Keep the plain loop — clarity beats compactness",
             n: "The comprehension is shorter and reads like its own description" }] }
},

"Lambda Function": {
 ex: { h: "A one-off note versus a printed form",
       b: "You scribble *sort by date* on a sticky note and throw it away after the job. You do not design a form, name it, and file it. A lambda is the sticky note: used once, where it is needed, with no ceremony — and like a sticky note, it stops being appropriate the moment it needs three paragraphs." },
 fl: { t: "Sorting by something other than the value",
       s: ["`users.sort()` fails — objects have no natural order",
           { s: "Supply a key function that extracts what to sort on", n: "`key=lambda u: u.created_at`" },
           { q: "Does the key need more than one expression?",
             y: "Write a named function — a lambda cannot hold statements anyway",
             n: "The lambda stays inline and the intent is obvious at the call site" }] }
},

"Arrow Function": {
 ex: { h: "Pointing instead of writing out an address",
       b: "*That one, over there* works fine when the thing is in front of you. Arrow functions are the same shorthand for callbacks — and crucially they keep the surrounding context, so `this` still means what it meant in the room you were standing in, rather than mysteriously becoming something else." },
 fl: { t: "Why `this` used to break in callbacks",
       s: ["A method passes a callback to `setTimeout`",
           { q: "Is the callback a `function () {}`?",
             y: "It gets its own `this`, which is not the object — the classic bug",
             n: "An arrow inherits `this` from where it was written — it still works" },
           { s: "That is also why arrows are wrong for object methods", n: "A method needs its own `this`; an arrow will not give it one." },
           "Rule of thumb: arrows for callbacks, `function` for methods"] }
},

"Type Hint": {
 ex: { h: "Labelling the wires in a fuse box",
       b: "Nothing physically stops you connecting the wrong wire; the label stops *you*. Type hints are the same — Python does not enforce them at runtime, but your editor autocompletes correctly, the checker refuses obviously wrong code, and the next reader knows what the function actually expects without running it." },
 fl: { t: "Where a type hint gets checked",
       s: ["You annotate `def chunk(text: str) -> list[str]`",
           { s: "Python ignores it while running", n: "Passing an integer will not raise a type error by itself." },
           { q: "Do you run a checker like mypy, or use TypeScript?",
             y: "The mistake is caught before the code ever runs",
             n: "The hint still powers editor autocomplete and documents intent" },
           "TypeScript goes further — it checks at build time and strips the types out"] }
},

"String Interpolation": {
 ex: { h: "A mail-merge letter",
       b: "*Dear «FIRST_NAME», your order «ORDER_ID» has shipped.* You write the letter once with holes in it, and ten thousand personalised copies come out. What you never do is let a customer's own text become part of the instructions — which is the exact reason you never interpolate user input into a SQL query." },
 fl: { t: "The safe and unsafe uses of the same syntax",
       s: ["You need a value inside a piece of text",
           { q: "Is the text a message for a human?",
             y: "Interpolate freely: `f\"Hi {name}, you owe {total:,.2f}\"`",
             n: "It is SQL or a shell command — stop" },
           { s: "For a query, use a parameterised statement", n: "The database receives value and query separately and never confuses them." },
           "Interpolation formats output; it must never build commands"] }
},

"String Concatenation": {
 ex: { h: "Re-typing a letter to add one line",
       b: "If every new sentence meant retyping the whole letter from the top, a long letter would take all day — and that is precisely what `out += line` does inside a loop, because strings cannot be edited in place. Collect the lines and join them once and you type the letter exactly once." },
 fl: { t: "Why building text in a loop gets slow",
       s: ["A loop appends each row to a growing string",
           { s: "Strings are immutable", n: "Every `+=` allocates a brand new string and copies everything so far." },
           { q: "How many rows?",
             y: "Ten thousand — that is ten thousand copies of a growing string",
             n: "A handful — the difference is genuinely unmeasurable" },
           "Append to a list, then `\"\\n\".join(rows)` once at the end"] }
},

"Escape Character": {
 ex: { h: "Air quotes while telling a story",
       b: "You need to say the words *he shouted \"stop\"* without your listener thinking you are shouting. The quotation marks around the quotation need marking as content, not punctuation. A backslash is that gesture — and once you nest a regex inside a string inside a shell command, you end up making the gesture four times." },
 fl: { t: "Getting a quote inside a quoted string",
       s: ["You need `She said \"hi\"` as a value",
           { q: "Can you just switch the outer quote style?",
             y: "`'She said \"hi\"'` — no escaping needed at all",
             n: "Escape it: `\"She said \\\"hi\\\"\"`" },
           { s: "For Windows paths and regexes, use a raw string", n: "`r\"C:\\Users\\new\"` — backslashes stay exactly as written." },
           "Layers of escaping are a hint to use a library instead of string surgery"] }
},

"Optional Chaining": {
 ex: { h: "Asking a receptionist for someone who may be out",
       b: "*Is Priya's assistant free?* If Priya has no assistant, a good receptionist says *no* rather than throwing the phone down. `?.` is that composure: the moment any link in the chain is missing, the whole expression quietly becomes `undefined` and the page stays up." },
 fl: { t: "Reading a deeply nested optional field",
       s: ["You need `user.profile.avatar.url`",
           { q: "Could any link be missing?",
             y: "Write `user?.profile?.avatar?.url` and it returns `undefined` instead of throwing",
             n: "Plain dots are fine — and a crash here would be useful information" },
           { s: "Add a default with `??`", n: "`?? \"/default.png\"` so the UI always has something." },
           "Do not sprinkle `?.` everywhere — hiding a genuine bug is worse than the crash"] }
},

"Nullish Coalescing": {
 ex: { h: "A form that treats blank and zero the same",
       b: "Someone deliberately writes 0 in the *children* box. A system that reads that as *left blank* and substitutes a default of 2 has invented two children. `||` makes exactly this mistake because zero is falsy. `??` asks the narrower and correct question: was this actually answered?" },
 fl: { t: "Choosing between `||` and `??`",
       s: ["You need a fallback for a possibly-missing value",
           { q: "Are `0`, `\"\"` or `false` legitimate answers?",
             y: "Use `??` — only `null` and `undefined` trigger the fallback",
             n: "`||` is fine and slightly shorter" },
           { s: "Most user input falls in the first camp", n: "Quantities, notes, toggles — all have valid falsy values." },
           "Default to `??` and reach for `||` deliberately"] }
},

"Spread Operator": {
 ex: { h: "Photocopying a form before editing it",
       b: "You never scribble on the original. You copy it, change one field on the copy, and file both. `{ ...user, name: \"New\" }` is that photocopy — and like a photocopy of a form with a document stapled to it, the staple is shared: nested objects still point at the same thing in both copies." },
 fl: { t: "Updating state without mutating it",
       s: ["You need a user object with one field changed",
           { s: "Spread the original into a new object", n: "`{ ...user }` copies every top-level key." },
           { s: "Add the override after the spread", n: "Later keys win, so `name: \"New\"` replaces the copied one." },
           { q: "Does the object contain nested objects?",
             y: "Those are shared, not copied — mutating them changes both",
             n: "You have a clean independent copy; the original is untouched" }] }
},

"Naming Conventions": {
 ex: { h: "Road signs shaped by meaning",
       b: "A triangle warns, a circle commands, a rectangle informs — you read the shape before the words. `PascalCase` tells a Python reader *class* and `SCREAMING_SNAKE` tells them *do not change this*, both before they have read a single letter of the name. That free signal is why the conventions are worth following even though nothing enforces them." },
 fl: { t: "What the shape of a name tells you before you read anything",
       s: [{ s: "Programmers write names in fixed styles, and each style signals what kind of thing it is", n: "So you can often tell what something is without looking it up." },
           { s: "`ThisShape` — first letter of each word capitalised — is a blueprint for creating things", n: "A class, or a component. You make copies of it rather than using it directly." },
           { s: "`THIS_SHAPE` — all capitals with underscores — is a fixed value that never changes", n: "Set once near the top of the file. If you find yourself changing one, something is wrong." },
           { s: "`this_shape` or `thisShape` is an ordinary variable or function", n: "Which of the two depends on the language: Python prefers the first, JavaScript the second." },
           { q: "Why does any of this matter?",
             y: "Because you read far more code than you write, and these shapes let you skim without stopping to check every name",
             n: "Break them and every reader after you pays a small tax on every line" }] }
},

"Magic Number": {
  ex: { h: "A dial marked only with a scratch",
        b: "Someone put a scratch on the oven dial at the right spot for bread. It works, until they move house and the next owner has no idea what the scratch means or whether it still applies. `86400` in the middle of a function is that scratch; `SECONDS_PER_DAY` is a proper label." },
  fl: { t: "Turning an unexplained number into a name",
        s: ["You find `if elapsed > 86400` in a code review",
            { q: "Can a reader tell what the number is without doing arithmetic?",
              y: "Leave it — some numbers, like `0` or `2`, are self-evident",
              n: "Name it: `SECONDS_PER_DAY = 86_400` at the top of the module" },
            { s: "Now the value has one definition", n: "Change it once; search finds every use by name." },
            "The same applies to repeated strings — those belong in an enum"] }
},

"Enum": {
  ex: { h: "The status stamps at a passport office",
        b: "There is a drawer with four stamps: received, processing, approved, rejected. Nobody is writing *aproved* freehand, because there is no pen — only the four stamps. An enum takes the pen away, which is why a typo becomes an error your tools catch instead of a status that silently never matches." },
  fl: { t: "How an enum kills a whole class of bug",
        s: ["Status is currently stored as a loose string",
            { q: "Someone types `\"shiped\"` instead of `\"shipped\"`",
              y: "With strings: it saves fine and every later comparison quietly fails",
              n: "With an enum: `Status.SHIPED` does not exist — you find out immediately" },
            { s: "Editors autocomplete the valid options", n: "You stop having to remember the exact spelling." },
            "Every valid value lives in one place, so adding a fifth is one edit"] }
},

"Pass by Value vs Reference": {
  ex: { h: "Photocopying a document vs sharing a Google Doc link",
        b: "Pass by value is handing someone a photocopy: they can scribble all over their copy with red pen and your original document on your desk remains pristine. Pass by reference is sending someone the edit link to your live Google Doc: whatever changes they type happen directly to the original file you are both viewing." },
  fl: { t: "What happens when you pass data into a function",
        s: ["Variable passed as a function argument",
            { q: "Is the variable a primitive (number/boolean) or an object?",
              y: "Primitive: cloned into a separate box (pass by value) — caller safe",
              n: "Object / List: reference pointer is copied pointing to same memory" },
            { s: "Mutating object properties mutates caller's data", n: "Reassigning the variable does not affect caller." },
            "Use `{ ...obj }` or structuredClone to prevent accidental mutations"] }
},

"Memory Leak": {
  ex: { h: "Subscribing to magazines and never cancelling",
        b: "You sign up for five monthly magazines. When you move to a new flat, you forget to cancel your old subscriptions. The postal carrier keeps dropping boxes of magazines at your old doorstep every month forever, until the hallway is completely blocked and the building manager calls the authorities." },
  fl: { t: "How memory leaks develop and crash servers",
        s: ["An object is created and used for a task",
            { q: "Are all listeners, timers, and references cleared when done?",
              y: "Garbage collector reclaims the memory automatically",
              n: "Hidden reference retained in a global array or active event listener" },
            { s: "RAM usage climbs steadily with every user request", n: "System runs out of memory (OOM crash)." },
            "Use memory profilers to detect uncollected objects and clean up listeners"] }
},

});
