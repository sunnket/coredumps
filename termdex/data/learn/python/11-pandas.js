/* Python — pandas. */
TD.addLessons("python", [

{
 t: "The DataFrame",
 m: "pandas",
 lvl: "intermediate",
 s: "A table in memory, with names on the columns and a mind of its own about the rows.",
 goal: [
  "Say what a DataFrame is and how it differs from a NumPy array",
  "Build one from a dictionary, and read one from a file",
  "Inspect an unfamiliar table in the four calls that matter"
 ],
 b: [
  { p: "NumPy gave you a fast grid of numbers. Real data is not a grid of numbers. It has a name on each column, a mix of types across them, dates in one place and free text in another, and holes where somebody did not fill in the form. **pandas** is NumPy with all of that admitted." },

  { h: "What it actually is" },
  { p: "A **DataFrame** is a table. Each column is a **Series** — a NumPy array with a label attached and its own handling of missing values. Stack several Series side by side, give them a shared row index, and you have a DataFrame." },
  { ana: "A NumPy array is a spreadsheet with the headers torn off and every cell forced to hold the same kind of thing. A DataFrame is the same spreadsheet with the header row back, each column allowed its own type, and a row number down the side that travels with the row wherever it goes.",
    at: "The header row, restored" },

  { tbl: { t: "Array versus DataFrame",
    h: ["", "ndarray", "DataFrame"],
    rows: [
     ["Columns", "Positions — you remember that 2 is salary", "**Names** — `df[\"salary\"]`"],
     ["Types", "One `dtype` for everything", "One per column; text and numbers coexist"],
     ["Missing values", "`np.nan`, floats only", "`NaN`, `NaT`, `pd.NA` — handled deliberately"],
     ["Rows", "Position only", "A labelled **index** that survives filtering and joining"],
     ["Speed", "The fastest thing in Python", "Slower — it is NumPy plus bookkeeping"],
     ["Right for", "Matrix maths, images, model input", "Loading, cleaning, joining, answering questions"]
    ] } },

  { h: "Building one" },
  { code: { lang: "python",
    lines: [
     { c: "import pandas as pd", w: "**`pd` is as fixed a convention as `np`.** Every example everywhere uses it." },
     { c: "", w: "" },
     { c: "df = pd.DataFrame({", w: "**A dictionary of columns** — the most common way to build one by hand. Each key becomes a column name." },
     { c: "    \"name\":   [\"Ada\", \"Linus\", \"Grace\", \"Guido\"],", w: "" },
     { c: "    \"lang\":   [\"analytical\", \"c\", \"cobol\", \"python\"],", w: "" },
     { c: "    \"year\":   [1843, 1991, 1959, 1991],", w: "**All the lists must be the same length**, or pandas raises. This catches a surprising number of data-entry errors." },
     { c: "    \"impact\": [9.1, 9.8, 9.4, 8.7],", w: "" },
     { c: "})", w: "" },
     { c: "", w: "" },
     { c: "print(df)", w: "" }
    ],
    out: "    name        lang  year  impact\n0    Ada  analytical  1843     9.1\n1  Linus           c  1991     9.8\n2  Grace       cobol  1959     9.4\n3  Guido      python  1991     8.7",
    after: "Note the unnamed column of `0 1 2 3` on the left. That is the **index**, created automatically because you did not supply one. It is not a column — it is the label of each row, and the next lesson is largely about it." } },

  { h: "Reading a real file" },
  { p: "In practice you almost never type data in. You read it." },
  { code: { lang: "python",
    lines: [
     { c: "df = pd.read_csv(\"sales.csv\")", w: "**The single most-used line in data work.** It handles the file opening, the parsing, the type guessing and the header row." },
     { c: "", w: "" },
     { c: "df = pd.read_csv(\"sales.csv\", parse_dates=[\"order_date\"])", w: "**Dates are not detected by default.** Without this, `order_date` is text and every date operation fails in a confusing way. Say which columns are dates." },
     { c: "df = pd.read_csv(\"messy.csv\", na_values=[\"N/A\", \"-\", \"missing\"])", w: "**Tell pandas what your source used for *nothing*.** Otherwise those strings become real values, your numeric column becomes text, and every sum is wrong." },
     { c: "df = pd.read_csv(\"big.csv\", usecols=[\"id\", \"amount\"])", w: "**Read only the columns you need.** On a wide file this is the difference between four seconds and forty, and between fitting in memory and not." },
     { c: "", w: "" },
     { c: "pd.read_excel(\"book.xlsx\", sheet_name=\"Q3\")", w: "The same idea for spreadsheets. Requires `openpyxl` installed." },
     { c: "pd.read_json(\"records.json\")", w: "And for JSON, Parquet (`read_parquet`), SQL (`read_sql`) and clipboard (`read_clipboard`, genuinely useful)." }
    ] } },
  { trap: "`read_csv` guesses each column's type from the first chunk of rows it sees. A column of IDs that starts `00123` becomes the integer `123`, silently destroying the leading zeros — the classic version of this ruins postcodes, phone numbers and product codes. When a column is an identifier rather than a quantity, say so: `dtype={\"zip\": str}`." },

  { h: "The four calls you make on every new table" },
  { code: { lang: "python", t: "Before you analyse anything, look at it",
    lines: [
     { c: "df.head()", w: "**The first five rows.** Always the first thing. `df.tail()` for the last five — worth checking too, because junk rows collect at the end of exported files." },
     { c: "df.shape", w: "`(rows, columns)`, exactly as in NumPy. A sanity check against what you expected to load." },
     { c: "df.info()", w: "**The most informative single call in pandas.** Every column, its dtype, and its non-null count. Two things jump out of it: a column that should be numeric showing `object`, and a column with far fewer non-nulls than there are rows.", hi: true },
     { c: "df.describe()", w: "Count, mean, std, min, quartiles and max for every numeric column. **Read the min and max first** — that is where impossible values hide: an age of 999, a price of -1." }
    ],
    out: "<class 'pandas.core.frame.DataFrame'>\nRangeIndex: 4 entries, 0 to 3\nData columns (total 4 columns):\n #   Column  Non-Null Count  Dtype  \n---  ------  --------------  -----  \n 0   name    4 non-null      object \n 1   lang    4 non-null      object \n 2   year    4 non-null      int64  \n 3   impact  4 non-null      float64" } },
  { n: "`object` in the Dtype column means *Python objects*, which in practice means **strings**. Seeing `object` where you expected `int64` or `float64` is the single most common signal that something went wrong on load — a stray `N/A`, a currency symbol, a thousands separator, a footer row. `df.info()` finds it in one line; discovering it later, when a `.sum()` concatenates ten thousand strings, takes considerably longer.",
    nt: "What `object` is telling you" },

  { h: "Getting at columns" },
  { code: { lang: "python",
    lines: [
     { c: "df[\"impact\"]", w: "**One column, as a Series.** Bracket notation always works." },
     { c: "df.impact", w: "The same thing. Convenient, but it breaks on names with spaces, names that clash with methods (`df.count`), and anything you build dynamically. **Prefer the brackets.**" },
     { c: "", w: "" },
     { c: "df[[\"name\", \"impact\"]]", w: "**Two brackets: a list of columns, giving a DataFrame back.** One bracket is a Series, two is a DataFrame — this trips up everyone once and then never again.", hi: true },
     { c: "", w: "" },
     { c: "df.columns", w: "All the column names. Assign to it to rename everything at once." },
     { c: "df[\"impact\"].mean()", w: "**Every NumPy aggregation works on a Series**, and skips missing values by default rather than poisoning the result." },
     { c: "df[\"lang\"].value_counts()", w: "**A frequency table, sorted.** The fastest way to understand a categorical column, and the call you will reach for constantly." }
    ] } },

  { tryit: { t: "Meet a table you have never seen",
    task: "Download or invent a CSV with at least five columns and a few hundred rows. Without doing any analysis, answer four questions: how many rows and columns, which columns have missing values, which column dtypes look wrong, and does any numeric column contain an impossible value.",
    hint: "`shape`, then `info()` for the first two, then `describe()` and read the min and max rows.",
    sol: { lang: "python", code: "import pandas as pd\n\ndf = pd.read_csv(\"data.csv\")\n\nprint(df.shape)\nprint(df.info())\nprint(df.describe())\n\n# missing values, ranked\nprint(df.isna().sum().sort_values(ascending=False))\n\n# every object column: what is actually in it?\nfor col in df.select_dtypes(\"object\"):\n    print(col, df[col].unique()[:10])" },
    w: "The loop at the end is the professional habit. Printing the first ten unique values of every text column is how you find the `\"N/A\"`, the `\"1,200\"` and the trailing space that are about to cost you an hour." } }
 ],
 k: [
  "A DataFrame is a table of Series — named columns, mixed types, a labelled row index, missing values handled properly.",
  "`read_csv` is the workhorse; tell it about dates, missing markers and identifier columns rather than trusting its guesses.",
  "`head`, `shape`, `info`, `describe` — run all four before you analyse anything.",
  "`object` dtype where you expected a number means something non-numeric got into the column."
 ],
 r: ["NumPy", "Data Type", "Data Quality", "Schema", "Serialisation"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "import pandas as pd", w: "import pandas under its universal alias" },
   { c: "df = pd.read_csv(\"sales.csv\")", w: "load a comma-separated file into a table" },
   { c: "df = pd.read_csv(\"sales.csv\", parse_dates=[\"order_date\"])", w: "load a file and turn a text column into real dates" },
   { c: "df.info()", w: "list every column with its type and non-null count" },
   { c: "df[[\"name\", \"impact\"]]", w: "select two columns and get a table back", hint: "how many brackets?" },
   { c: "df[\"lang\"].value_counts()", w: "count how often each value appears in a column" }
  ]
 }
},

{
 t: "Selecting Rows: loc, iloc and the Index",
 m: "pandas",
 lvl: "intermediate",
 s: "The part of pandas that confuses everyone, explained in the order that makes it stop.",
 goal: [
  "Explain what the index is and why it is not a column",
  "Choose between `loc` and `iloc` without guessing",
  "Filter rows on one or several conditions"
 ],
 b: [
  { p: "If pandas has a reputation for being fiddly, this lesson is the reason. It is entirely fixable, and it comes down to one idea held clearly: **the index is a label, not a position.**" },

  { h: "The index" },
  { p: "Every DataFrame has an index — the labels down the left side. By default it is `0, 1, 2, …`, which makes it look like a position and hides the difference. Set it to something meaningful and the difference becomes obvious." },
  { code: { lang: "python",
    lines: [
     { c: "df = pd.DataFrame({", w: "" },
     { c: "    \"city\": [\"Delhi\", \"Tokyo\", \"Lagos\", \"Lima\"],", w: "" },
     { c: "    \"pop\":  [32.9, 37.2, 15.4, 10.7],", w: "millions" },
     { c: "})", w: "" },
     { c: "df = df.set_index(\"city\")", w: "**The `city` column becomes the row labels.** It stops being a column — `df[\"city\"]` now raises a `KeyError`.", hi: true },
     { c: "print(df)", w: "" },
     { c: "", w: "" },
     { c: "print(df.loc[\"Tokyo\"])", w: "**Now a row has a name.** This is what the index buys you." },
     { c: "df = df.reset_index()", w: "And the way back — `city` returns to being an ordinary column and the plain `0,1,2` index comes back." }
    ],
    out: "        pop\ncity       \nDelhi  32.9\nTokyo  37.2\nLagos  15.4\nLima   10.7" } },
  { n: "After you filter or sort, the index keeps its original labels — a filtered frame can have an index of `3, 7, 12`. That is deliberate: it tells you which rows these were. It also means `df.loc[0]` may not exist and `df.loc[3]` is the *first* row. When you genuinely want fresh numbering, ask for it: `df.reset_index(drop=True)`, where `drop=True` throws the old index away instead of keeping it as a column.",
    nt: "Why your index has gaps in it" },

  { h: "loc and iloc" },
  { tbl: { h: ["", "`loc`", "`iloc`"],
    rows: [
     ["Takes", "**Labels** — whatever the index holds", "**Integer positions** — always 0-based"],
     ["Row example", "`df.loc[\"Tokyo\"]`", "`df.iloc[1]`"],
     ["Columns too", "`df.loc[\"Tokyo\", \"pop\"]`", "`df.iloc[1, 0]`"],
     ["Slice end", "**Inclusive** — `loc[\"a\":\"c\"]` includes `c`", "**Exclusive**, like every other Python slice"],
     ["Accepts a mask", "**Yes** — this is how filtering works", "No"],
     ["Use it when", "Almost always", "You genuinely mean *the third row*"]
    ] } },
  { trap: "**`loc` slices are inclusive of the end.** `df.loc[2:5]` returns rows labelled 2, 3, 4 **and 5** — five rows, where `df.iloc[2:5]` returns three. This is not a bug and it is not inconsistent: a label slice cannot use the half-open convention, because there is no guarantee a label after `5` even exists. Knowing it is the whole defence." },

  { code: { lang: "python", t: "Both, side by side, on the default index",
    lines: [
     { c: "df.loc[0]", w: "The row **labelled** 0." },
     { c: "df.iloc[0]", w: "The **first** row. On a fresh frame these are the same row — which is exactly why the distinction goes unnoticed until it bites." },
     { c: "", w: "" },
     { c: "df.loc[0, \"pop\"]", w: "One cell, by label." },
     { c: "df.iloc[0, 1]", w: "One cell, by position." },
     { c: "", w: "" },
     { c: "df.loc[:, \"pop\"]", w: "**Every row, one column** — the same `:` meaning *all* that NumPy uses." },
     { c: "df.iloc[:3]", w: "The first three rows." },
     { c: "df.iloc[-1]", w: "The last row. `loc` cannot do this — there is no label `-1`." }
    ] } },

  { h: "Filtering — the thing you will do most" },
  { p: "A comparison on a Series produces a boolean Series, exactly as in NumPy. Feed it back to the frame and you get the rows where it was `True`." },
  { code: { lang: "python",
    lines: [
     { c: "big = df[\"pop\"] > 20", w: "**A boolean Series**, one `True` or `False` per row, carrying the index along." },
     { c: "print(df[big])", w: "The rows where it was `True`." },
     { c: "", w: "" },
     { c: "print(df[df[\"pop\"] > 20])", w: "**The same thing in one line, and how it is actually written.** Read it as *the frame, where population exceeds twenty*.", hi: true },
     { c: "", w: "" },
     { c: "print(df[(df[\"pop\"] > 15) & (df[\"pop\"] < 35)])", w: "**`&` and `|`, and brackets around each condition.** The same operator-precedence trap as NumPy: `and` and `or` ask for a single truth value and raise." },
     { c: "print(df[~(df[\"pop\"] > 20)])", w: "`~` inverts a mask." },
     { c: "", w: "" },
     { c: "print(df[df[\"city\"].isin([\"Delhi\", \"Lima\"])])", w: "**`isin` is the `IN` clause**, and it replaces a chain of `|` comparisons that nobody wants to read." },
     { c: "print(df[df[\"city\"].str.startswith(\"L\")])", w: "**`.str` unlocks every string method on a whole column**, vectorised. `.str.contains`, `.str.lower`, `.str.strip` — this accessor does most of the work in text cleaning." },
     { c: "print(df[df[\"pop\"].isna()])", w: "**The rows with a missing value.** Never `== None` and never `== np.nan`; neither works." }
    ] } },

  { h: "Filtering and selecting at once" },
  { code: { lang: "python",
    lines: [
     { c: "df.loc[df[\"pop\"] > 20, \"city\"]", w: "**Mask for the rows, name for the columns.** This is the full form of `loc`, and it is worth using as a habit even when you only need the rows." },
     { c: "df.loc[df[\"pop\"] > 20, [\"city\", \"pop\"]]", w: "Several columns." },
     { c: "df.loc[df[\"pop\"] > 30, \"tier\"] = \"mega\"", w: "**Assign through it.** Creates the column if it does not exist and sets it only on the matching rows. The idiomatic way to add a derived flag.", hi: true }
    ] } },
  { trap: "**Chained assignment.** `df[df[\"pop\"] > 30][\"tier\"] = \"mega\"` looks equivalent and is not. The first bracket may return a *copy*, so the assignment lands on a temporary that is thrown away, and your original frame is unchanged. pandas warns about this — `SettingWithCopyWarning` — and the warning is right. The single-`loc` form above is not merely tidier; it is the version that works." },

  { h: "query — the readable alternative" },
  { code: { lang: "python",
    lines: [
     { c: "df.query(\"pop > 20 and city != 'Lagos'\")", w: "**The same filter as a string**, with `and`/`or` spelled out and no repetition of `df[...]`. On a long condition this is genuinely easier to read." },
     { c: "threshold = 20", w: "" },
     { c: "df.query(\"pop > @threshold\")", w: "**`@` refers to a Python variable** from the surrounding scope." }
    ],
    after: "`query` is slower on small frames and faster on very large ones. Choose it for readability, not speed." } },

  { tryit: { t: "Answer three questions with three filters",
    task: "On any table you have: select the rows where a numeric column is above its own mean; select the rows where a text column contains a substring, ignoring case; and set a new column to `\"flagged\"` only on the rows matching both conditions.",
    hint: "The mean of a column is available while you are filtering by it. `.str.contains(..., case=False, na=False)`. Then one `df.loc[mask, \"new\"] = ...`.",
    sol: { lang: "python", code: "above = df[df[\"amount\"] > df[\"amount\"].mean()]\n\nhits = df[df[\"notes\"].str.contains(\"urgent\", case=False, na=False)]\n\nmask = (df[\"amount\"] > df[\"amount\"].mean()) & \\\n       df[\"notes\"].str.contains(\"urgent\", case=False, na=False)\ndf.loc[mask, \"status\"] = \"flagged\"" },
    w: "`na=False` matters more than it looks. Without it, `.str.contains` returns `NaN` for missing values rather than `False`, and using that as a mask raises. Any time you filter on text that might be missing, pass it." } }
 ],
 k: [
  "The index is a **label**, not a position; it survives filtering, which is why filtered frames have gaps.",
  "`loc` takes labels and boolean masks and slices inclusively; `iloc` takes integer positions and slices exclusively.",
  "Filter with `df[mask]`, combine with `&` `|` `~`, and bracket every condition.",
  "Use one `df.loc[mask, col] = value` to assign — chained brackets may write to a copy."
 ],
 r: ["Index", "Boolean", "NULL", "SQL", "Subquery"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "df = df.set_index(\"city\")", w: "make a column into the row labels" },
   { c: "df.loc[\"Tokyo\", \"pop\"]", w: "get one cell by row label and column name" },
   { c: "df.iloc[-1]", w: "get the last row by position" },
   { c: "print(df[df[\"pop\"] > 20])", w: "keep only the rows above a threshold" },
   { c: "print(df[(df[\"pop\"] > 15) & (df[\"pop\"] < 35)])", w: "keep rows matching two conditions", hint: "brackets, single ampersand" },
   { c: "df.loc[df[\"pop\"] > 30, \"tier\"] = \"mega\"", w: "set a new column only on the matching rows" },
   { c: "print(df[df[\"pop\"].isna()])", w: "find the rows where a value is missing" }
  ]
 }
},

{
 t: "Cleaning Real Data",
 m: "pandas",
 lvl: "intermediate",
 s: "Missing values, wrong types, duplicates and text that nearly matches. Most of the job.",
 goal: [
  "Find and deal with missing values deliberately",
  "Fix a column whose type is wrong",
  "Remove duplicates and normalise inconsistent text"
 ],
 b: [
  { p: "There is a widely quoted figure that data scientists spend eighty per cent of their time cleaning data. The figure is made up; the sentiment is exactly right. This lesson is that eighty per cent." },
  { q: "Data cleaning is not the boring part before the real work. It *is* the work, and every conclusion you draw rests on it.", by: "The uncomfortable truth of the job" },

  { h: "Finding what is missing" },
  { code: { lang: "python",
    lines: [
     { c: "df.isna().sum()", w: "**Missing values per column.** `isna()` gives a boolean frame; summing a boolean column counts the `True`s. This is the first line of every cleaning session.", hi: true },
     { c: "df.isna().sum() / len(df)", w: "The same as a proportion, which is what actually informs the decision. Two per cent missing and forty per cent missing are different problems." },
     { c: "df.isna().sum(axis=1)", w: "**Missing values per *row*.** A row missing eight of its ten fields is usually junk rather than data." },
     { c: "df[df[\"email\"].isna()]", w: "**Look at the actual rows before deciding anything.** Missingness is rarely random — if every missing email belongs to a customer who signed up before 2019, that is information, not noise." }
    ] } },

  { h: "Deciding what to do about it" },
  { p: "There are three honest options and choosing between them is a judgement about the data, not a technical step." },
  { tbl: { h: ["Option", "When it is right", "The risk"],
    rows: [
     ["**Drop the rows**", "Few are missing, and they look random", "You quietly bias the result if they are not random"],
     ["**Drop the column**", "Most of it is missing and it is not central", "You may be discarding the most informative field"],
     ["**Fill them**", "You have a defensible value to fill with", "You invent data and later forget you invented it"]
    ] } },
  { code: { lang: "python",
    lines: [
     { c: "df = df.dropna()", w: "**Drops every row with any missing value at all.** On a wide table this can delete most of your data without saying so — always check `len` before and after." },
     { c: "df = df.dropna(subset=[\"email\"])", w: "**Far better: drop only where the column that matters is missing.** Almost always what you actually meant." },
     { c: "df = df.dropna(thresh=5)", w: "Keep rows with at least five non-null values. Good for cutting junk rows." },
     { c: "", w: "" },
     { c: "df = df.drop(columns=[\"middle_name\"])", w: "Drop a column outright." },
     { c: "", w: "" },
     { c: "df[\"qty\"] = df[\"qty\"].fillna(0)", w: "**A defensible fill: no quantity recorded means none were ordered.** Note that this is a claim about the data, and you should be able to defend it." },
     { c: "df[\"score\"] = df[\"score\"].fillna(df[\"score\"].median())", w: "**Median rather than mean** — it is not dragged around by outliers. Standard practice, and still an invention." },
     { c: "df[\"price\"] = df.groupby(\"category\")[\"price\"].transform(lambda s: s.fillna(s.median()))", w: "**Fill from the group the row belongs to** — a missing price gets its own category's median rather than the whole table's. Considerably more honest, and `transform` is explained in the next lesson." },
     { c: "df[\"reading\"] = df[\"reading\"].ffill()", w: "**Carry the last value forward.** Correct for a sensor that only reports on change; wrong for almost everything else." }
    ] } },
  { trap: "Filling missing values with **zero** by reflex is the most common way to publish a wrong number. A missing temperature is not zero degrees, a missing salary is not zero pay, and a missing rating is not the worst possible rating. Each of those fills drags every average you compute afterwards towards zero, and nothing in the output will tell you it happened." },
  { n: "Whatever you decide, record it. A comment in the notebook, a line in the README, a printed count — anything. The failure mode is not making a bad choice; it is making a reasonable choice and then, three weeks later, presenting a number without remembering that four per cent of it was invented.",
    nt: "Write down what you did" },

  { h: "Fixing types" },
  { code: { lang: "python",
    lines: [
     { c: "df[\"amount\"] = df[\"amount\"].str.replace(\",\", \"\", regex=False)", w: "**`1,200` is text, not a number.** Strip the separator first." },
     { c: "df[\"amount\"] = df[\"amount\"].str.replace(\"£\", \"\", regex=False)", w: "So is a currency symbol." },
     { c: "df[\"amount\"] = pd.to_numeric(df[\"amount\"], errors=\"coerce\")", w: "**`to_numeric` rather than `astype(float)`.** `errors=\"coerce\"` turns anything still unparseable into `NaN` instead of raising — so one bad row does not stop the load, and `isna()` afterwards tells you exactly which rows were bad.", hi: true },
     { c: "", w: "" },
     { c: "df[\"date\"] = pd.to_datetime(df[\"date\"], errors=\"coerce\")", w: "**Real dates.** Now `.dt.year`, `.dt.month`, `.dt.dayofweek` and date arithmetic all work." },
     { c: "df[\"date\"] = pd.to_datetime(df[\"date\"], format=\"%d/%m/%Y\")", w: "**Give the format when you know it.** It is much faster, and it removes the day/month ambiguity that silently mangles every date before the 13th of the month." },
     { c: "", w: "" },
     { c: "df[\"country\"] = df[\"country\"].astype(\"category\")", w: "**A repeated-string column as a category** stores each distinct value once. On a million rows of country names this can cut memory by ninety per cent and speed up grouping." }
    ] } },

  { h: "Duplicates" },
  { code: { lang: "python",
    lines: [
     { c: "df.duplicated().sum()", w: "How many rows are exact copies of an earlier row." },
     { c: "df[df.duplicated(keep=False)]", w: "**Show every row involved, including the first.** Look before deleting — duplicates are sometimes legitimate." },
     { c: "", w: "" },
     { c: "df = df.drop_duplicates()", w: "Keeps the first occurrence of each." },
     { c: "df = df.drop_duplicates(subset=[\"email\"], keep=\"last\")", w: "**Duplicate on the column that defines identity, not on the whole row.** Two records for one customer differing only in a timestamp are duplicates in every sense that matters; `keep=\"last\"` takes the most recent.", hi: true }
    ] } },

  { h: "Text that nearly matches" },
  { code: { lang: "python", t: "The same value, four ways",
    lines: [
     { c: "df[\"city\"].value_counts()", w: "**Run this on every text column.** It is how you discover `\" Delhi\"`, `\"delhi\"`, `\"DELHI\"` and `\"Delhi \"` are four different values as far as any grouping is concerned." },
     { c: "", w: "" },
     { c: "df[\"city\"] = df[\"city\"].str.strip()", w: "**Leading and trailing whitespace is the most common invisible bug in data.** Strip first, always." },
     { c: "df[\"city\"] = df[\"city\"].str.title()", w: "One consistent case. `.str.lower()` is the safer default for anything you will match on." },
     { c: "df[\"city\"] = df[\"city\"].replace({\"Bombay\": \"Mumbai\", \"Calcutta\": \"Kolkata\"})", w: "**An explicit mapping for genuine synonyms.** Keep the dictionary in the code where a reader can see and challenge it." },
     { c: "", w: "" },
     { c: "df.columns = df.columns.str.strip().str.lower().str.replace(\" \", \"_\")", w: "**Clean the column names too.** `\"Order Date \"` becoming `order_date` makes everything afterwards typeable and stops `df.query` and `df.` access from breaking." }
    ] } },

  { h: "A cleaning script that reads well" },
  { code: { lang: "python", file: "clean.py", t: "Chained, so each step is one readable line",
    lines: [
     { c: "clean = (", w: "**Wrap the chain in brackets** so you can put each step on its own line." },
     { c: "    pd.read_csv(\"raw.csv\", na_values=[\"N/A\", \"-\", \"\"])", w: "" },
     { c: "      .rename(columns=str.lower)", w: "" },
     { c: "      .drop_duplicates(subset=[\"order_id\"])", w: "" },
     { c: "      .dropna(subset=[\"order_id\", \"amount\"])", w: "**Only the columns without which the row is meaningless.**" },
     { c: "      .assign(", w: "**`assign` adds or replaces columns inside a chain**, which is what makes the whole pipeline expressible as one expression." },
     { c: "          amount=lambda d: pd.to_numeric(d[\"amount\"], errors=\"coerce\"),", w: "**The lambda receives the frame as it is at this point in the chain** — which is how a later step can use an earlier one's result." },
     { c: "          date=lambda d: pd.to_datetime(d[\"date\"], errors=\"coerce\"),", w: "" },
     { c: "          margin=lambda d: d[\"amount\"] - d[\"cost\"],", w: "" },
     { c: "      )", w: "" },
     { c: "      .query(\"amount > 0\")", w: "" },
     { c: "      .reset_index(drop=True)", w: "**Tidy numbering at the end**, once all the filtering is done." },
     { c: ")", w: "" },
     { c: "", w: "" },
     { c: "print(f\"{len(clean)} rows kept\")", w: "**Always print how much survived.** A pipeline that quietly drops ninety per cent of the data is a bug that produces no error." }
    ] } },
  { n: "Every step in that chain returns a **new** frame rather than modifying the old one, so `raw.csv` on disk and the original loaded frame are untouched. That is why a chain like this is safe to re-run and safe to read: nothing is hiding a side effect on a line you have already scrolled past.",
    nt: "Nothing is modified in place" },

  { tryit: { t: "Clean something genuinely messy",
    task: "Take a real public CSV — government open data is ideal, because it is authentically awful. Produce a cleaning chain that handles missing values, at least one wrong dtype, duplicates and inconsistent text. Print the row count before and after, and one sentence on every decision you made.",
    hint: "Start with `info()` and `value_counts()` on every object column. The problems announce themselves.",
    sol: { lang: "python", code: "raw = pd.read_csv(\"inspections.csv\", na_values=[\"N/A\", \"-\", \"unknown\", \"\"])\nprint(f\"loaded {len(raw)} rows\")\n\nclean = (\n    raw\n      .rename(columns=lambda c: c.strip().lower().replace(\" \", \"_\"))\n      .drop_duplicates(subset=[\"facility_id\", \"inspection_date\"])\n      .assign(\n          inspection_date=lambda d: pd.to_datetime(d[\"inspection_date\"], errors=\"coerce\"),\n          score=lambda d: pd.to_numeric(d[\"score\"], errors=\"coerce\"),\n          city=lambda d: d[\"city\"].str.strip().str.title(),\n      )\n      .dropna(subset=[\"facility_id\", \"inspection_date\"])\n      .reset_index(drop=True)\n)\n\nprint(f\"kept {len(clean)} rows ({len(clean)/len(raw):.1%})\")\nprint(clean.isna().sum())" },
    w: "The percentage kept is the line that earns its place. Anything under about ninety per cent deserves an explanation before you go any further — you have either found a genuine data problem or written an over-aggressive filter, and you want to know which." } }
 ],
 k: [
  "`df.isna().sum()` first; then look at the actual missing rows before choosing what to do.",
  "Drop, drop the column, or fill — each is a claim about the data, so make it consciously and write it down.",
  "`pd.to_numeric(..., errors=\"coerce\")` and `pd.to_datetime` fix types without one bad row stopping the load.",
  "`value_counts()` on every text column finds the whitespace and casing problems that break grouping."
 ],
 r: ["Data Quality", "Outlier", "NULL", "ETL", "Schema"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "df.isna().sum()", w: "count the missing values in each column" },
   { c: "df = df.dropna(subset=[\"email\"])", w: "drop rows only where one specific column is missing" },
   { c: "df[\"score\"] = df[\"score\"].fillna(df[\"score\"].median())", w: "fill missing values with the column's middle value" },
   { c: "df[\"amount\"] = pd.to_numeric(df[\"amount\"], errors=\"coerce\")", w: "convert to numbers, turning anything unparseable into missing" },
   { c: "df[\"date\"] = pd.to_datetime(df[\"date\"], errors=\"coerce\")", w: "convert a text column into real dates" },
   { c: "df = df.drop_duplicates(subset=[\"email\"], keep=\"last\")", w: "keep only the most recent record per identity" },
   { c: "df[\"city\"] = df[\"city\"].str.strip()", w: "remove the invisible whitespace around every value" }
  ]
 }
},

{
 t: "Grouping, Aggregating and Reshaping",
 m: "pandas",
 lvl: "advanced",
 s: "Split, apply, combine — and the pivot that turns rows into a report.",
 goal: [
  "Use `groupby` to answer a per-category question",
  "Aggregate several columns several ways in one call",
  "Reshape between long and wide with `pivot_table` and `melt`"
 ],
 b: [
  { p: "Almost every question anyone asks of data has the same shape: *what is the something, per something else*. Revenue per region. Average delay per airline. Failure rate per version. `groupby` is that sentence, written down." },

  { h: "Split, apply, combine" },
  { p: "The pattern has a name and three steps, and holding them separately in your head makes the whole API obvious." },
  { ol: [
   "**Split** the rows into groups by the value of one or more columns.",
   "**Apply** a function to each group independently.",
   "**Combine** the results back into a single frame, one row per group."
  ] },
  { code: { lang: "python",
    lines: [
     { c: "sales.groupby(\"region\")[\"amount\"].sum()", w: "**Split by region, take the amount column, add it up per group.** Read left to right and it is exactly the three steps.", hi: true },
     { c: "", w: "" },
     { c: "sales.groupby(\"region\")[\"amount\"].mean()", w: "Any aggregation works: `mean`, `median`, `count`, `min`, `max`, `std`, `nunique`." },
     { c: "sales.groupby(\"region\").size()", w: "**Rows per group.** Note `size` counts rows including missing values; `count` counts non-null values per column. The difference matters more often than you would think." },
     { c: "", w: "" },
     { c: "sales.groupby([\"region\", \"quarter\"])[\"amount\"].sum()", w: "**Two keys gives a hierarchical index** — every region/quarter combination that occurs. `.reset_index()` flattens it back to ordinary columns, which is usually what you want next." }
    ],
    out: "region\nEast     412500\nNorth    388100\nSouth    504200\nWest     297300\nName: amount, dtype: int64" } },
  { n: "The result of a `groupby` is indexed by the grouping key — `region` has become the index, not a column. Chain `.reset_index()` when you want a normal frame back, or pass `as_index=False` to the `groupby` itself. Forgetting this is why a groupby result sometimes refuses to merge with anything.",
    nt: "The group key becomes the index" },

  { h: "Aggregating properly" },
  { code: { lang: "python", t: "`agg` — several columns, several functions, named output",
    lines: [
     { c: "sales.groupby(\"region\").agg({", w: "**A dictionary: column to function.**" },
     { c: "    \"amount\": \"sum\",", w: "" },
     { c: "    \"order_id\": \"count\",", w: "" },
     { c: "    \"margin\": \"mean\",", w: "" },
     { c: "})", w: "" },
     { c: "", w: "" },
     { c: "sales.groupby(\"region\").agg(", w: "**Named aggregation — the modern form, and much better.** You choose the output column names instead of accepting whatever pandas builds.", hi: true },
     { c: "    revenue=(\"amount\", \"sum\"),", w: "`new_name=(source_column, function)`. The result has clean, single-level column names you can use immediately." },
     { c: "    orders=(\"order_id\", \"count\"),", w: "" },
     { c: "    avg_margin=(\"margin\", \"mean\"),", w: "" },
     { c: "    best=(\"amount\", \"max\"),", w: "" },
     { c: ").reset_index()", w: "" }
    ],
    out: "  region  revenue  orders  avg_margin   best\n0   East   412500     820       0.221   4100\n1  North   388100     754       0.198   3950\n2  South   504200     991       0.243   5200\n3   West   297300     612       0.187   2870" } },
  { p: "You can also pass your own function — `agg(lambda s: s.quantile(0.9))` — but reach for the built-in names first. They run in C; a lambda runs a Python call per group." },

  { h: "transform — a result the same shape as the input" },
  { p: "`agg` gives one row per group. `transform` gives one row per **original row**, with the group's answer broadcast back across its members. That is what you need whenever the answer must sit beside the data it describes." },
  { code: { lang: "python",
    lines: [
     { c: "sales[\"region_total\"] = sales.groupby(\"region\")[\"amount\"].transform(\"sum\")", w: "**Every row now carries its own region's total.** An `agg` could not do this — it would give four rows, not one per sale.", hi: true },
     { c: "sales[\"share\"] = sales[\"amount\"] / sales[\"region_total\"]", w: "**And now each sale's share of its region.** Percent-of-group is the classic `transform` job." },
     { c: "", w: "" },
     { c: "sales[\"vs_avg\"] = sales[\"amount\"] - sales.groupby(\"region\")[\"amount\"].transform(\"mean\")", w: "How far above or below its own region's average each sale sits." }
    ] } },
  { ana: "`agg` writes the summary at the bottom of each section of the report. `transform` writes the section's subtotal into every row of that section, so each line can be compared against it without you looking anything up.",
    at: "Summary at the bottom, or in every row" },

  { h: "filter and apply on groups" },
  { code: { lang: "python",
    lines: [
     { c: "big = sales.groupby(\"region\").filter(lambda g: g[\"amount\"].sum() > 400000)", w: "**Keeps the original rows of groups that pass a test on the whole group.** Not one row per group — every row belonging to a qualifying region." },
     { c: "", w: "" },
     { c: "top3 = sales.groupby(\"region\", group_keys=False).apply(", w: "**`apply` takes a whole group and returns anything** — a value, a Series, a frame. The most flexible and the slowest." },
     { c: "    lambda g: g.nlargest(3, \"amount\")", w: "**The three biggest sales in each region.** A genuinely awkward question in most tools and one line here." },
     { c: ")", w: "" }
    ] } },
  { trap: "`apply` runs your Python function once per group, which means it is the slow path. On a thousand groups nobody notices; on a million it is the difference between a second and several minutes. Before reaching for `apply`, check whether a built-in aggregation or a `transform` does the job — it usually does, and it stays in C." },

  { h: "Long and wide" },
  { p: "The same data can be laid out two ways, and knowing how to move between them is most of what reshaping is." },
  { tbl: { t: "The same three numbers, both shapes",
    h: ["**Long** (tidy)", "**Wide** (report)"],
    rows: [
     ["`East, Q1, 100`<br>`East, Q2, 120`<br>`West, Q1, 90`", "`region  Q1   Q2`<br>`East   100  120`<br>`West    90  NaN`"],
     ["One row per observation. What every tool wants as **input**.", "One row per entity, one column per period. What people want to **read**."]
    ] } },
  { code: { lang: "python", t: "Long to wide: pivot_table",
    lines: [
     { c: "report = sales.pivot_table(", w: "" },
     { c: "    index=\"region\",", w: "**What becomes the rows.**" },
     { c: "    columns=\"quarter\",", w: "**What spreads out into columns** — one per distinct value." },
     { c: "    values=\"amount\",", w: "**What fills the cells.**" },
     { c: "    aggfunc=\"sum\",", w: "**How to combine when several rows land in one cell.** `pivot_table` aggregates; plain `pivot` raises on duplicates instead. That difference is the whole reason to prefer `pivot_table`." },
     { c: "    fill_value=0,", w: "Empty combinations become 0 rather than `NaN`. A deliberate choice — here it is defensible, because no sales genuinely means zero." },
     { c: "    margins=True,", w: "**Adds a totals row and column**, labelled `All`. Turns the output into an actual report." },
     { c: ")", w: "" }
    ],
    out: "quarter      Q1      Q2      Q3      Q4      All\nregion                                            \nEast     101200  108400   99300  103600   412500\nNorth     94100   97800  100200   96000   388100\nSouth    121000  128700  127400  127100   504200\nWest      71200   75900   74800   75400   297300\nAll      387500  410800  401700  402100  1602100" } },

  { code: { lang: "python", t: "Wide to long: melt",
    lines: [
     { c: "long = report.reset_index().melt(", w: "" },
     { c: "    id_vars=\"region\",", w: "**The columns that stay as they are** — the identifiers." },
     { c: "    var_name=\"quarter\",", w: "**The old column headings become values in this new column.**" },
     { c: "    value_name=\"amount\",", w: "**And the cells become values in this one.**" },
     { c: ")", w: "" }
    ],
    after: "`melt` is what you run when someone sends you a spreadsheet with a column per month. Every plotting and modelling library wants long format; humans want wide. You will convert in both directions regularly." } },

  { h: "Sorting the answer" },
  { code: { lang: "python",
    lines: [
     { c: "result.sort_values(\"revenue\", ascending=False)", w: "**Sort by a column.** Descending is what you want for a leaderboard, and it is not the default." },
     { c: "result.sort_values([\"region\", \"revenue\"], ascending=[True, False])", w: "**Several keys, each with its own direction.** Region alphabetically, then revenue highest first within each." },
     { c: "result.nlargest(10, \"revenue\")", w: "**Top ten, in one call.** Faster than sorting the whole frame and slicing, and it says what you mean." }
    ] } },

  { tryit: { t: "Produce a real report",
    task: "From any transactional table, build a summary with one row per category showing: total, count, average, the single largest transaction, and each category's share of the overall total. Sort it by total descending. Then pivot the same data into a category-by-month grid.",
    hint: "Named `agg` for the first five; the share is the total divided by `result[\"total\"].sum()`. Then `pivot_table` with `index`, `columns`, `values`, `aggfunc`.",
    sol: { lang: "python", code: "summary = (\n    tx.groupby(\"category\")\n      .agg(\n          total=(\"amount\", \"sum\"),\n          n=(\"amount\", \"count\"),\n          avg=(\"amount\", \"mean\"),\n          biggest=(\"amount\", \"max\"),\n      )\n      .assign(share=lambda d: d[\"total\"] / d[\"total\"].sum())\n      .sort_values(\"total\", ascending=False)\n      .reset_index()\n)\nprint(summary)\n\ngrid = tx.pivot_table(\n    index=\"category\",\n    columns=tx[\"date\"].dt.to_period(\"M\"),\n    values=\"amount\",\n    aggfunc=\"sum\",\n    fill_value=0,\n)\nprint(grid)" },
    w: "`tx[\"date\"].dt.to_period(\"M\")` is the tidy way to group by month: it collapses every date in a month to one label without you building a string. `to_period(\"Q\")` and `to_period(\"W\")` follow the same pattern." } }
 ],
 k: [
  "`groupby` is split-apply-combine; the group key becomes the index, so `reset_index()` when you want a plain frame.",
  "Named aggregation — `agg(revenue=(\"amount\", \"sum\"))` — gives clean output column names.",
  "`agg` returns one row per group; `transform` returns one per original row, which is how percent-of-group works.",
  "`pivot_table` goes long to wide and aggregates duplicates; `melt` goes back the other way."
 ],
 r: ["Group By", "Aggregate Function", "OLAP", "Star Schema"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "sales.groupby(\"region\")[\"amount\"].sum()", w: "total one column for each value of another" },
   { c: "sales.groupby([\"region\", \"quarter\"])[\"amount\"].sum()", w: "total across two grouping keys at once" },
   { c: "sales.groupby(\"region\").agg(revenue=(\"amount\", \"sum\"))", w: "aggregate with a chosen output column name" },
   { c: "sales[\"region_total\"] = sales.groupby(\"region\")[\"amount\"].transform(\"sum\")", w: "put each group's total onto every row of that group" },
   { c: "result.sort_values(\"revenue\", ascending=False)", w: "sort a summary highest first" },
   { c: "result.nlargest(10, \"revenue\")", w: "take the top ten rows by a column" }
  ]
 }
},

{
 t: "Joining Tables and Time Series",
 m: "pandas",
 lvl: "advanced",
 s: "Bringing two tables together without silently multiplying your rows, and working with dates properly.",
 goal: [
  "Merge two frames and choose the right join type",
  "Detect and prevent a join that duplicated rows",
  "Resample and window a time series"
 ],
 b: [
  { p: "Data almost never arrives in one table. Orders are here, customers are there, product details are somewhere else. Joining them is routine — and it is also the single easiest way to produce a number that is confidently, invisibly wrong." },

  { h: "merge" },
  { code: { lang: "python",
    lines: [
     { c: "full = orders.merge(", w: "" },
     { c: "    customers,", w: "**The right-hand frame.**" },
     { c: "    on=\"customer_id\",", w: "**The column present in both.** If the names differ, use `left_on=\"cust_id\", right_on=\"id\"`." },
     { c: "    how=\"left\",", w: "**The join type**, and the most consequential argument here. Explained just below." },
     { c: "    validate=\"many_to_one\",", w: "**Assert the relationship you believe holds.** pandas raises if it does not. This one argument prevents most join disasters and almost nobody uses it.", hi: true },
     { c: "    indicator=True,", w: "**Adds a `_merge` column** saying whether each row matched on both sides, the left only, or the right only. Invaluable while you are checking, and dropped afterwards." },
     { c: ")", w: "" }
    ] } },

  { tbl: { t: "The four join types",
    h: ["`how=`", "Keeps", "Reach for it when"],
    rows: [
     ["`\"left\"`", "**Every row of the left frame**, matched or not", "You are enriching a table and must not lose any of it. **The default choice.**"],
     ["`\"inner\"`", "Only rows that matched on both sides", "You genuinely only want complete records — and accept that unmatched rows vanish silently"],
     ["`\"outer\"`", "Everything from both, filling gaps with `NaN`", "Reconciling two sources and needing to see what is in each but not the other"],
     ["`\"right\"`", "Every row of the right frame", "Rarely — swap the frames and use `left` instead; it reads better"]
    ] } },
  { n: "`left` is the right default because it is the one that cannot silently shrink your data. If you started with fifty thousand orders you still have fifty thousand rows afterwards, and any `NaN` in the joined columns is a visible signal that something did not match. An `inner` join in the same position would just return fewer rows, and nothing would tell you.",
    nt: "Why left is the safe default" },
  { dg: "joins" },

  { h: "The join that quietly duplicates everything" },
  { p: "This is the failure worth spending a page on, because it produces no error, no warning, and a total that is too large by an amount nobody can explain." },
  { code: { lang: "python", t: "How it happens",
    lines: [
     { c: "len(orders)", w: "50,000 orders." },
     { c: "len(customers)", w: "8,000 customers — or so you assume." },
     { c: "", w: "" },
     { c: "customers[\"customer_id\"].duplicated().sum()", w: "**12.** Twelve customers appear twice, because the export included one row per address.", hi: true },
     { c: "", w: "" },
     { c: "full = orders.merge(customers, on=\"customer_id\", how=\"left\")", w: "" },
     { c: "len(full)", w: "**50,190.** Every order belonging to a doubled customer became two rows — and every one of those orders now counts twice in every sum that follows." },
     { c: "", w: "" },
     { c: "full[\"amount\"].sum()", w: "**Larger than `orders[\"amount\"].sum()`, and there is nothing in the output to say so.**" }
    ] } },
  { code: { lang: "python", t: "The three habits that prevent it",
    lines: [
     { c: "assert customers[\"customer_id\"].is_unique", w: "**Check the key on the right-hand side is unique before joining.** One line, at the top of the merge." },
     { c: "", w: "" },
     { c: "before = len(orders)", w: "" },
     { c: "full = orders.merge(customers, on=\"customer_id\", how=\"left\", validate=\"many_to_one\")", w: "**`validate` does the same check for you and names the problem in the error message.** `\"one_to_one\"`, `\"one_to_many\"` and `\"many_to_one\"` are the options." },
     { c: "assert len(full) == before", w: "**And confirm the row count did not move.** Three lines that turn an invisible bug into a loud one." },
     { c: "", w: "" },
     { c: "print(full[\"_merge\"].value_counts())", w: "With `indicator=True` — how many rows failed to match. A large `left_only` count means your keys do not line up as you thought." }
    ] } },
  { trap: "Merging on a text key without cleaning it first is the other half of this problem. `\"ACME Ltd\"` and `\"acme ltd \"` do not match, so those rows fall through to `NaN` and you conclude the customer has no orders. Strip and case-fold both sides before joining on anything a human typed." },

  { h: "concat — stacking rather than joining" },
  { code: { lang: "python",
    lines: [
     { c: "all_months = pd.concat([jan, feb, mar], ignore_index=True)", w: "**Stacks frames on top of each other.** For twelve monthly files with identical columns, this is the call. `ignore_index=True` renumbers so you do not get three rows labelled 0." },
     { c: "", w: "" },
     { c: "frames = [pd.read_csv(f) for f in sorted(glob.glob(\"data/*.csv\"))]", w: "**Read every matching file...**" },
     { c: "df = pd.concat(frames, ignore_index=True)", w: "**...and stack them once.** Note it is one `concat` at the end, not a `concat` inside the loop — appending in a loop copies the whole frame every iteration and is quadratically slow.", hi: true },
     { c: "", w: "" },
     { c: "pd.concat([a, b], axis=1)", w: "Side by side instead, aligning on the index. Useful, and easy to get wrong if the indexes are not what you think." }
    ] } },

  { h: "Dates, once they are real dates" },
  { code: { lang: "python",
    lines: [
     { c: "df[\"date\"] = pd.to_datetime(df[\"date\"])", w: "**Nothing below works until this line has run.**" },
     { c: "", w: "" },
     { c: "df[\"year\"] = df[\"date\"].dt.year", w: "**`.dt` is to dates what `.str` is to text** — the accessor that exposes every date part across the whole column." },
     { c: "df[\"month\"] = df[\"date\"].dt.month_name()", w: "" },
     { c: "df[\"weekday\"] = df[\"date\"].dt.day_name()", w: "" },
     { c: "df[\"is_weekend\"] = df[\"date\"].dt.dayofweek >= 5", w: "**Monday is 0.** A one-line weekend flag." },
     { c: "", w: "" },
     { c: "df[\"days_open\"] = (pd.Timestamp.today() - df[\"date\"]).dt.days", w: "**Subtracting two datetimes gives a duration**, and `.dt.days` turns it into a number." },
     { c: "recent = df[df[\"date\"] > \"2026-01-01\"]", w: "**Compare against a plain string** — pandas parses it. Filtering by date needs no ceremony." }
    ] } },

  { h: "Resampling" },
  { p: "**Resampling** is grouping by time. Set the date as the index and pandas will bucket by any period you name." },
  { code: { lang: "python",
    lines: [
     { c: "ts = df.set_index(\"date\").sort_index()", w: "**Both steps matter.** A time series must be indexed by its date and sorted, or the windowing below is meaningless." },
     { c: "", w: "" },
     { c: "ts[\"amount\"].resample(\"D\").sum()", w: "**Daily totals**, including zero-filled days that had no rows at all — which a `groupby` would have skipped entirely." },
     { c: "ts[\"amount\"].resample(\"ME\").sum()", w: "**Month-end totals.** `W` weekly, `QE` quarterly, `YE` yearly, `h` hourly." },
     { c: "ts[\"amount\"].resample(\"ME\").agg([\"sum\", \"mean\", \"count\"])", w: "Several statistics per period at once." },
     { c: "", w: "" },
     { c: "ts[\"amount\"].rolling(7).mean()", w: "**A seven-row moving average** — the standard way to see a trend through daily noise. Each value is the average of itself and the six before it.", hi: true },
     { c: "ts[\"amount\"].rolling(\"7D\").mean()", w: "**A seven-*day* window**, which is different when your rows are irregularly spaced. Requires the sorted datetime index." },
     { c: "ts[\"amount\"].expanding().sum()", w: "A running total from the start." },
     { c: "", w: "" },
     { c: "ts[\"amount\"].pct_change()", w: "**Change from the previous row, as a proportion.** Growth rates in one call." },
     { c: "ts[\"prev\"] = ts[\"amount\"].shift(1)", w: "**`shift` moves the column down one row**, putting the previous value beside the current one. Every period-over-period comparison is built on this." }
    ] } },
  { trap: "`rolling(7).mean()` produces `NaN` for the first six rows, because a seven-row window does not exist yet. That is correct behaviour, not a bug — and it is why a chart of a rolling average starts slightly late. Do not `fillna(0)` those: a zero would draw a cliff that never happened." },

  { h: "Writing the answer out" },
  { code: { lang: "python",
    lines: [
     { c: "result.to_csv(\"summary.csv\", index=False)", w: "**`index=False` almost always.** Otherwise the row numbers become a nameless first column that confuses whoever opens it next." },
     { c: "result.to_parquet(\"summary.parquet\")", w: "**Parquet keeps the dtypes**, compresses far better, and reads back much faster. Use it for anything you will read again in Python — the next module explains why." },
     { c: "result.to_excel(\"report.xlsx\", index=False)", w: "For the colleague who wants a spreadsheet, which is most of them." }
    ] } },

  { tryit: { t: "Join, verify, and trend",
    task: "Join a transactions table to a customers table without changing the transaction row count, then produce monthly revenue with a three-month rolling average beside it, and flag every month that fell below that average.",
    hint: "`validate=\"many_to_one\"` and an assert on `len`. Then `resample(\"ME\").sum()`, `rolling(3).mean()`, and a comparison between the two columns.",
    sol: { lang: "python", code: "before = len(tx)\nfull = tx.merge(customers, on=\"customer_id\", how=\"left\",\n                validate=\"many_to_one\")\nassert len(full) == before, \"the join duplicated rows\"\n\nmonthly = (\n    full.set_index(\"date\")\n        .sort_index()[\"amount\"]\n        .resample(\"ME\").sum()\n        .to_frame(\"revenue\")\n        .assign(\n            rolling3=lambda d: d[\"revenue\"].rolling(3).mean(),\n            below=lambda d: d[\"revenue\"] < d[\"rolling3\"],\n        )\n)\nprint(monthly)" },
    w: "The `assert` on the line after the merge is the habit worth taking from this whole lesson. It costs nothing, it runs every time, and it converts the most expensive silent bug in data work into an immediate, obvious failure." } }
 ],
 k: [
  "`how=\"left\"` is the safe default — it cannot silently shrink your data, and `NaN` shows you what did not match.",
  "A duplicated key on the right-hand side multiplies rows with no error; `validate=` and an assert on `len` catch it.",
  "`concat` stacks frames — build a list and concatenate once, never inside a loop.",
  "Set a sorted datetime index, then `resample` for periods and `rolling` for moving windows."
 ],
 r: ["Join", "Merge", "Primary Key", "Foreign Key", "Time-Series Database", "Parquet"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "full = orders.merge(customers, on=\"customer_id\", how=\"left\")", w: "attach customer details to every order, keeping all orders" },
   { c: "assert customers[\"customer_id\"].is_unique", w: "check the join key cannot duplicate rows" },
   { c: "all_months = pd.concat([jan, feb, mar], ignore_index=True)", w: "stack three tables on top of each other with fresh numbering" },
   { c: "df[\"weekday\"] = df[\"date\"].dt.day_name()", w: "get the day name out of a date column" },
   { c: "ts[\"amount\"].resample(\"ME\").sum()", w: "total by calendar month" },
   { c: "ts[\"amount\"].rolling(7).mean()", w: "smooth daily noise with a seven-row moving average" },
   { c: "result.to_csv(\"summary.csv\", index=False)", w: "write the answer out without the row numbers" }
  ]
 }
}

]);
