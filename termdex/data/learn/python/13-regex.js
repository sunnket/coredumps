/* Python — regular expressions. */
TD.addLessons("python", [

{
 t: "What Regular Expressions Are For",
 m: "regex",
 lvl: "intermediate",
 s: "Pattern matching: the tool that turns impossible text problems into one-liners.",
 goal: [
  "Explain what a regex is and when it is the right tool",
  "Write a pattern that matches a phone number, an email or a date",
  "Use `re.search`, `re.findall` and `re.sub` on real text"
 ],
 b: [
  { p: "You have used `.startswith()`, `.endswith()`, `.strip()` and `in` to work with text, and they cover a lot. But they fall apart the moment the rule is **a pattern rather than a literal value**. *Does this look like an email? Does this line contain a date? Pull every number out of this paragraph.* Regular expressions are the answer to all three, and to every question shaped like them." },

  { h: "The re module" },
  { p: "Python's `re` module is the standard tool. It compiles a pattern string into a small matching engine and runs it across your text." },
  { code: { lang: "python", t: "The three functions you will use ninety per cent of the time",
    lines: [
     { c: "import re", w: "Standard library — no install." },
     { c: "", w: "" },
     { c: "text = \"Order #1234 placed on 2026-08-25 for $49.99\"", w: "A piece of messy real-world text." },
     { c: "", w: "" },
     { c: "match = re.search(r\"\\d{4}-\\d{2}-\\d{2}\", text)", w: "**`search` finds the first match anywhere.** The `r` before the string makes it raw so backslashes are literal. `\\d` means any digit, `{4}` means exactly four of them." },
     { c: "print(match.group())", w: "**`.group()` returns the actual matched text.**" },
     { c: "", w: "" },
     { c: "print(re.findall(r\"\\d+\", text))", w: "**`findall` returns every match as a list.** `\\d+` means one or more digits." },
     { c: "", w: "" },
     { c: "clean = re.sub(r\"#\\d+\", \"#REDACTED\", text)", w: "**`sub` replaces every match.** Like `.replace()` but the thing you are looking for is a pattern, not a fixed string." },
     { c: "print(clean)" }
    ],
    out: "2026-08-25\n['1234', '2026', '08', '25', '49', '99']\nOrder #REDACTED placed on 2026-08-25 for $49.99" } },

  { h: "The pattern language" },
  { p: "A regex is a tiny language inside a string. Most characters match themselves — `a` matches `a`. A handful of characters have special meaning, and those few do all the work." },
  { tbl: { t: "The characters that matter",
    h: ["Pattern", "Matches", "Example"],
    rows: [
     ["`\\d`", "Any digit (0–9)", "`\\d\\d` matches `42`"],
     ["`\\w`", "Any word character (letter, digit, underscore)", "`\\w+` matches `user_name`"],
     ["`\\s`", "Any whitespace (space, tab, newline)", "`\\s+` matches any gap"],
     ["`.`", "Any character except newline", "`a.b` matches `a2b`, `a-b`, `a b`"],
     ["`^`", "Start of string", "`^Error` matches only if it starts with Error"],
     ["`$`", "End of string", "`.py$` matches filenames ending in .py"],
     ["`[abc]`", "Any one of these characters", "`[aeiou]` matches a vowel"],
     ["`[^abc]`", "Anything **except** these", "`[^0-9]` matches a non-digit"],
     ["`|`", "Either side", "`cat|dog` matches cat or dog"],
     ["`()`", "A group — captures the match", "`(\\d{4})-(\\d{2})` captures year and month separately"]
    ] } },

  { h: "Quantifiers — how many" },
  { tbl: { h: ["Quantifier", "Means", "Example"],
    rows: [
     ["`*`", "Zero or more", "`ab*c` matches `ac`, `abc`, `abbc`"],
     ["`+`", "One or more", "`\\d+` matches one or more digits"],
     ["`?`", "Zero or one (optional)", "`colou?r` matches `color` and `colour`"],
     ["`{n}`", "Exactly n", "`\\d{4}` matches exactly four digits"],
     ["`{n,m}`", "Between n and m", "`\\d{2,4}` matches 2, 3 or 4 digits"],
     ["`{n,}`", "n or more", "`\\d{3,}` matches three or more digits"]
    ] } },

  { h: "Capturing groups" },
  { p: "Parentheses do two things: they group alternatives, and they **capture** the matched text so you can pull it out afterwards." },
  { code: { lang: "python",
    lines: [
     { c: "line = \"2026-08-25 ERROR Connection refused\"", w: "" },
     { c: "", w: "" },
     { c: "m = re.search(r\"(\\d{4}-\\d{2}-\\d{2})\\s+(\\w+)\\s+(.+)\", line)", w: "**Three groups.** Group 1 is the date, group 2 is the level, group 3 is the message." },
     { c: "print(m.group(1))", w: "The date." },
     { c: "print(m.group(2))", w: "The log level." },
     { c: "print(m.group(3))", w: "The rest of the line." }
    ],
    out: "2026-08-25\nERROR\nConnection refused" } },

  { n: "**Named groups** are the version worth using in real code. `(?P<date>\\d{4}-\\d{2}-\\d{2})` captures into a name, and `m.group(\"date\")` reads it. Six months later, `group(\"date\")` tells you something; `group(1)` does not.",
    nt: "Named groups" },

  { h: "Real patterns you will actually use" },
  { code: { lang: "python", t: "Five patterns that solve real problems",
    lines: [
     { c: "# Email (simplified — real email validation is impossible with regex alone)", w: "" },
     { c: "re.findall(r\"[\\w.+-]+@[\\w-]+\\.[\\w.]+\", text)", w: "" },
     { c: "", w: "" },
     { c: "# Phone number: +91 98765 43210 or 9876543210", w: "" },
     { c: "re.findall(r\"\\+?\\d[\\d\\s-]{8,}\\d\", text)", w: "" },
     { c: "", w: "" },
     { c: "# URL", w: "" },
     { c: "re.findall(r\"https?://[^\\s]+\", text)", w: "" },
     { c: "", w: "" },
     { c: "# ISO date", w: "" },
     { c: "re.findall(r\"\\d{4}-\\d{2}-\\d{2}\", text)", w: "" },
     { c: "", w: "" },
     { c: "# Price with currency symbol", w: "" },
     { c: "re.findall(r\"[₹$€£]\\s?[\\d,]+\\.?\\d*\", text)", w: "" }
    ] } },

  { h: "Common mistakes" },
  { trap: "**Forgetting the raw string prefix `r`.** Without `r`, `\"\\d\"` is a backslash-d sequence that Python itself tries to interpret, usually mangling your pattern silently. Always use `r\"...\"` for regex patterns." },
  { trap: "**Greedy matching.** `.*` matches as much as it can. On `<b>one</b> and <b>two</b>`, the pattern `<b>.*</b>` matches the *entire* string from the first `<b>` to the last `</b>`. Add a `?` to make it lazy: `<b>.*?</b>` matches each tag separately." },

  { vs: { t: "Greedy versus lazy", lang: "python",
    bad: { c: "re.findall(r\"<b>.*</b>\", \"<b>one</b> and <b>two</b>\")", label: "One match: the whole thing",
      w: "`.*` grabs everything between the *first* `<b>` and the *last* `</b>`." },
    good: { c: "re.findall(r\"<b>.*?</b>\", \"<b>one</b> and <b>two</b>\")", label: "Two matches",
      w: "`.*?` stops at the *first* closing tag each time." } } },

  { h: "When NOT to use regex" },
  { l: [
   "**Parsing HTML or XML.** Use `BeautifulSoup` or `lxml`. HTML is a nested structure; regex is a flat scanner.",
   "**Validating email fully.** The RFC is absurdly complex. Use a library or just send a confirmation email.",
   "**Complex data formats.** JSON, CSV, YAML all have proper parsers that handle edge cases.",
   "**When a simple string method works.** `if line.startswith(\"ERROR\"):` beats `if re.match(r\"^ERROR\", line):` every time — it is faster, clearer, and has nothing to get wrong."
  ] },

  { h: "Compiling for performance" },
  { code: { lang: "python",
    lines: [
     { c: "pattern = re.compile(r\"\\d{4}-\\d{2}-\\d{2}\")", w: "**Compile once, use many times.** If the same pattern is used in a loop, compiling it avoids re-parsing each iteration." },
     { c: "", w: "" },
     { c: "for line in logfile:", w: "" },
     { c: "    m = pattern.search(line)", w: "Now it uses the compiled version." },
     { c: "    if m:", w: "" },
     { c: "        dates.append(m.group())" }
    ] } },

  { tryit: { t: "Parse a log file",
    task: "Given lines like `2026-08-25 14:32:01 ERROR [auth] Login failed for user aryan@example.com`, write a regex that captures the date, time, level, component (in brackets) and the message. Use named groups.",
    hint: "`(?P<name>...)` creates a named group. The bracket is literal so it needs escaping: `\\[...\\]`.",
    sol: { lang: "python", code: "import re\n\nline = \"2026-08-25 14:32:01 ERROR [auth] Login failed for user aryan@example.com\"\n\npattern = re.compile(\n    r\"(?P<date>\\d{4}-\\d{2}-\\d{2})\\s+\"\n    r\"(?P<time>\\d{2}:\\d{2}:\\d{2})\\s+\"\n    r\"(?P<level>\\w+)\\s+\"\n    r\"\\[(?P<component>\\w+)\\]\\s+\"\n    r\"(?P<message>.+)\"\n)\n\nm = pattern.search(line)\nif m:\n    print(m.groupdict())" },
    w: "`groupdict()` gives everything as a clean dictionary — date, time, level, component, message — which is exactly the shape you would feed into a DataFrame or a database." } }
 ],
 k: [
  "`re.search` finds the first match; `re.findall` gives every match; `re.sub` replaces matches.",
  "`\\d` is a digit, `\\w` is a word character, `\\s` is whitespace; `+` means one or more, `*` means zero or more.",
  "Always use raw strings (`r\"...\"`) for patterns, and compile if using the same pattern repeatedly.",
  "Use named groups `(?P<name>...)` so the code reads as documentation."
 ],
 r: ["Regular Expression", "String"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "import re", w: "import the regular expression module" },
   { c: "re.search(r\"\\d{4}-\\d{2}-\\d{2}\", text)", w: "find the first date in a string" },
   { c: "re.findall(r\"\\d+\", text)", w: "extract all numbers from a string" },
   { c: "re.sub(r\"#\\d+\", \"#REDACTED\", text)", w: "replace all ID numbers with a placeholder" },
   { c: "pattern = re.compile(r\"\\d+\")", w: "compile a pattern for reuse in a loop" },
   { c: "m.group(\"date\")", w: "get a named capture group from a match" }
  ]
 }
}

]);
