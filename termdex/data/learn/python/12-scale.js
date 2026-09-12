/* Python — when the data stops fitting. */
TD.addLessons("python", [

{
 t: "Why pandas Runs Out of Memory",
 m: "scale",
 lvl: "advanced",
 s: "The wall every data person hits, what it is actually made of, and how far you can push it before moving.",
 goal: [
  "Explain why a 2 GB file needs far more than 2 GB of RAM",
  "Measure what your frame is really costing you",
  "Cut a frame's memory by most of its size without changing the analysis"
 ],
 b: [
  { p: "One day a file that worked yesterday produces this, and the session dies:" },
  { out: "MemoryError: Unable to allocate 4.47 GiB for an array with shape (3, 200000000) and data type float64", ot: "The message that ends the day" },
  { p: "This lesson is what that means, and it is the most useful thing in this module, because the honest answer to *my data is too big* is usually **it is not** — you were spending memory you did not need to spend." },

  { h: "Why the file size is not the memory size" },
  { p: "A 2 GB CSV routinely needs 10 GB of RAM. Four things account for the gap." },
  { ol: [
   "**A CSV is text.** The number `42` is two bytes on disk and eight bytes as an `int64` in memory. Numbers usually expand.",
   "**Strings expand enormously.** pandas stores an `object` column as a NumPy array of *pointers* to individual Python string objects. Each of those carries around 49 bytes of header before a single character. A column of two-letter country codes can cost 60 bytes per row.",
   "**pandas defaults to the widest type.** Every whole number becomes `int64` and every decimal `float64`, whether or not the values need 64 bits. A column of ages from 0 to 120 fits in one byte and is given eight.",
   "**Operations copy.** A merge, a sort, a `groupby` or a filter builds a new frame while the old one is still alive. **Peak memory is routinely two to three times the size of the frame itself** — which is why the crash so often lands on an operation rather than on the load."
  ] },
  { ana: "The file on disk is a folded map. Loading it into pandas is unfolding the map onto a table, and pandas unfolds it with generous margins on every side in case you want to write in them. Then merging two frames means unfolding a second copy beside the first before you throw either away.",
    at: "Folded on disk, unfolded in RAM" },

  { h: "Measure before you guess" },
  { code: { lang: "python",
    lines: [
     { c: "df.memory_usage(deep=True)", w: "**Bytes per column. `deep=True` is essential** — without it, an object column reports the size of its pointers and not the strings they point to, which is the thing that is actually killing you.", hi: true },
     { c: "df.memory_usage(deep=True).sum() / 1e9", w: "The whole frame, in gigabytes." },
     { c: "", w: "" },
     { c: "df.dtypes.value_counts()", w: "How many columns of each type. A row of `object` here is where the money is going." },
     { c: "df.info(memory_usage=\"deep\")", w: "All of it in one call — the version of `info` worth using once a frame gets large." }
    ],
    out: "Index                 128\nid              80000000\ncountry        612000000\nage             80000000\nscore           80000000\ndtype: int64",
    after: "Ten million rows. The `country` column — two-letter codes — is costing 612 MB while the numeric columns cost 80 MB each. That is the whole lesson in one output." } },

  { h: "Four changes that usually solve it" },
  { code: { lang: "python", t: "1 — read only the columns you need",
    lines: [
     { c: "df = pd.read_csv(\"big.csv\", usecols=[\"id\", \"amount\", \"date\"])", w: "**The largest single win available, and the easiest.** A file with sixty columns of which you need four costs you fifteen times more memory than necessary, and you are the one who chose to pay it.", hi: true }
    ] } },

  { code: { lang: "python", t: "2 — narrow the numeric types",
    lines: [
     { c: "df[\"age\"] = pd.to_numeric(df[\"age\"], downcast=\"unsigned\")", w: "**`int64` to `uint8` — an eightfold cut** on that column. `downcast` picks the smallest type that holds the actual values." },
     { c: "df[\"score\"] = pd.to_numeric(df[\"score\"], downcast=\"float\")", w: "`float64` to `float32`, halving it. **Check this one against your precision needs** — `float32` carries about seven significant digits, which is plenty for a score and not for money." },
     { c: "", w: "" },
     { c: "df = pd.read_csv(\"big.csv\", dtype={\"age\": \"uint8\", \"code\": \"category\"})", w: "**Better still: specify the types at load time**, so the wide version never exists in memory at all." }
    ] } },

  { code: { lang: "python", t: "3 — categories for repeated text",
    lines: [
     { c: "df[\"country\"].nunique()", w: "**195, across ten million rows.** That ratio is the signal." },
     { c: "df[\"country\"] = df[\"country\"].astype(\"category\")", w: "**Stores each distinct string once and gives every row a small integer code.** The 612 MB above becomes about 10 MB — a sixtyfold reduction, and grouping on it gets faster too.", hi: true },
     { c: "", w: "" },
     { c: "df[\"transaction_id\"].astype(\"category\")", w: "**Do not do this.** When almost every value is distinct, a category adds a lookup table the size of the column and saves nothing. The rule of thumb: categorise when unique values are under about half the row count." }
    ],
    after: "As a rough guide: if `nunique() / len(df)` is below 0.5, `category` will help, and the lower it goes the more dramatic the saving." } },

  { code: { lang: "python", t: "4 — process in chunks",
    lines: [
     { c: "totals = []", w: "" },
     { c: "for chunk in pd.read_csv(\"huge.csv\", chunksize=500_000):", w: "**`chunksize` returns an iterator of frames** rather than one frame. Only half a million rows are in memory at a time, whatever the file's size.", hi: true },
     { c: "    chunk = chunk[chunk[\"amount\"] > 0]", w: "Filter early — the sooner rows are discarded the less everything downstream costs." },
     { c: "    totals.append(chunk.groupby(\"region\")[\"amount\"].sum())", w: "**Aggregate each chunk to something small** and keep only that." },
     { c: "", w: "" },
     { c: "final = pd.concat(totals).groupby(level=0).sum()", w: "**Then combine the partial answers.** Sums, counts, mins and maxes combine trivially like this." }
    ] } },
  { trap: "Not every aggregation survives chunking. Sum, count, min and max combine across chunks; **median, percentiles and `nunique` do not** — the median of the chunk medians is not the median. For those you need either the whole column in memory, an approximate algorithm, or a tool that shuffles data between partitions, which is what the last lesson of this module is about." },

  { h: "How far this gets you" },
  { tbl: { t: "A realistic before and after",
    h: ["Change", "Memory", "Effort"],
    rows: [
     ["Naive `read_csv` of a 60-column file", "**11.2 GB** — crashes on a 16 GB laptop mid-merge", "—"],
     ["`usecols` down to the 8 columns needed", "1.6 GB", "One argument"],
     ["Downcast the numerics", "0.9 GB", "Three lines"],
     ["`category` on the 4 repeated text columns", "**0.3 GB**", "One line each"],
     ["Save as Parquet and read that instead", "0.3 GB, and loads in 2 s rather than 90 s", "One line, once"]
    ] } },
  { n: "That is a thirty-fold reduction from four small changes, and it is entirely typical. **Most *my data is too big* problems are really *my dtypes are too wide* problems.** Exhaust this lesson before you reach for a cluster — a distributed system you did not need is far more expensive, in both money and hours, than the afternoon it takes to fix your types.",
    nt: "Try this before you try anything else" },

  { tryit: { t: "Shrink a frame",
    task: "Take any table with at least a hundred thousand rows and several text columns. Record `memory_usage(deep=True).sum()`. Then downcast every numeric column and categorise every text column whose unique ratio is under 0.5. Report the before and after, and confirm a `groupby` gives identical results on both.",
    hint: "Loop over `df.select_dtypes(\"object\")` and check `nunique() / len(df)` for each.",
    sol: { lang: "python", code: "before = df.memory_usage(deep=True).sum()\n\nfor col in df.select_dtypes(\"integer\"):\n    df[col] = pd.to_numeric(df[col], downcast=\"integer\")\nfor col in df.select_dtypes(\"float\"):\n    df[col] = pd.to_numeric(df[col], downcast=\"float\")\nfor col in df.select_dtypes(\"object\"):\n    if df[col].nunique() / len(df) < 0.5:\n        df[col] = df[col].astype(\"category\")\n\nafter = df.memory_usage(deep=True).sum()\nprint(f\"{before/1e6:.0f} MB -> {after/1e6:.0f} MB ({after/before:.1%})\")" },
    w: "Run the check on the results too. Narrowing dtypes should never change an answer — if a `groupby` total moves, you downcast a float past the precision your data needed, and that is exactly the kind of thing you want to find on a test rather than in a report." } }
 ],
 k: [
  "A CSV expands several times over in RAM: text-to-number, string overhead, 64-bit defaults, and copies during operations.",
  "`memory_usage(deep=True)` is the only honest measurement — without `deep` the string columns lie.",
  "`usecols`, downcasting, and `category` on repeated text routinely cut a frame by 90 per cent or more.",
  "Chunking works for sums, counts and extremes; medians and distinct counts need the whole column."
 ],
 r: ["Memory Management", "Data Type", "Virtual Memory", "Columnar Storage"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "df.memory_usage(deep=True).sum()", w: "measure what the frame truly costs, strings included" },
   { c: "df = pd.read_csv(\"big.csv\", usecols=[\"id\", \"amount\", \"date\"])", w: "read only the columns you actually need" },
   { c: "df[\"age\"] = pd.to_numeric(df[\"age\"], downcast=\"unsigned\")", w: "shrink a numeric column to the smallest type that fits" },
   { c: "df[\"country\"] = df[\"country\"].astype(\"category\")", w: "store each repeated string once instead of per row" },
   { c: "for chunk in pd.read_csv(\"huge.csv\", chunksize=500_000):", w: "read a file a piece at a time instead of all at once" }
  ]
 }
},

{
 t: "Parquet and Columnar Storage",
 m: "scale",
 lvl: "advanced",
 s: "The file format that makes analytics fast, and why CSV was never meant for this.",
 goal: [
  "Explain the difference between row and column storage",
  "Say why Parquet is smaller and faster for analytics",
  "Choose the right format for a given job"
 ],
 b: [
  { p: "Changing one line — `to_csv` to `to_parquet` — routinely makes a file five times smaller and twenty times faster to read, and preserves the dtypes you spent the last lesson getting right. It is the highest return per character of typing in this entire track." },

  { h: "What is wrong with CSV" },
  { p: "Nothing, for what it was for. CSV is a text format for exchanging small tables between programs that agree on nothing else, and at that it is unbeatable. As a working format for analytics it has four real problems." },
  { l: [
   "**No types.** Everything is text. Every read re-guesses, which is slow and occasionally wrong — the leading zeros, the dates, the `\"NA\"` that became a float.",
   "**No compression.** Ten million rows of `\"United Kingdom\"` is ten million copies of the string on disk.",
   "**All or nothing.** Needing one column of sixty means reading and parsing all sixty, because the values are interleaved by row.",
   "**No metadata.** Row count, min and max per column, schema — none of it is recorded, so every question requires a full scan."
  ] },

  { h: "Row-oriented versus column-oriented" },
  { p: "The whole difference is the order the bytes are written in." },
  { code: { lang: "text", t: "The same four rows, stored two ways",
    lines: [
     { c: "TABLE   id | country        | amount", w: "" },
     { c: "        1  | United Kingdom | 250", w: "" },
     { c: "        2  | United Kingdom | 310", w: "" },
     { c: "        3  | India          | 190", w: "" },
     { c: "", w: "" },
     { c: "ROW-ORIENTED  (CSV, most databases)", w: "" },
     { c: "  1,United Kingdom,250 | 2,United Kingdom,310 | 3,India,190", w: "**All of row 1, then all of row 2.** Perfect for *fetch me everything about order 2* — one seek and one contiguous read." },
     { c: "", w: "" },
     { c: "COLUMN-ORIENTED  (Parquet, ORC, every warehouse)", w: "" },
     { c: "  1,2,3 | United Kingdom,United Kingdom,India | 250,310,190", w: "**All the ids, then all the countries, then all the amounts.** Perfect for *what is the total amount* — read one contiguous block and skip the rest of the file entirely.", hi: true }
    ] } },
  { p: "That single reordering produces every advantage that follows, and it is why the same data warehouse that answers an aggregate over a billion rows in two seconds is a poor choice for fetching one customer's record." },

  { h: "Why columns compress so much better" },
  { p: "A column holds one kind of thing, so the values next to each other are similar — and similarity is exactly what a compressor eats." },
  { l: [
   "**Dictionary encoding.** 195 distinct countries across ten million rows are stored as a small dictionary plus ten million tiny integers. This is the `category` trick from the last lesson, done by the file format.",
   "**Run-length encoding.** A sorted or clustered column stores *this value, 40,000 times* rather than forty thousand copies.",
   "**Type-aware packing.** A column known to be integers between 0 and 200 is packed at one byte each, without you asking.",
   "**Per-column codecs.** Snappy for speed, ZSTD for size, chosen per column rather than for the file as a whole."
  ] },
  { n: "A row-oriented file cannot do any of this well, because the compressor sees an integer, then a country name, then a price, then another integer. There is no pattern to exploit. Grouping like with like is what makes the compression possible, and a 5–10× reduction over CSV is ordinary.",
    nt: "Why the same data is five times smaller" },

  { h: "Predicate and projection pushdown" },
  { p: "Parquet stores the min and max of every column in every **row group** — a block of typically a hundred thousand rows. That small piece of bookkeeping lets a reader skip work rather than do it." },
  { code: { lang: "python",
    lines: [
     { c: "df = pd.read_parquet(\"sales.parquet\", columns=[\"date\", \"amount\"])", w: "**Projection pushdown.** Only those two columns are read off the disk. The other fifty-eight are never touched — impossible in a CSV, where they are interleaved with the ones you want.", hi: true },
     { c: "", w: "" },
     { c: "df = pd.read_parquet(\"sales.parquet\",", w: "" },
     { c: "                     filters=[(\"date\", \">=\", \"2026-01-01\")])", w: "**Predicate pushdown.** The reader checks each row group's recorded max date and skips whole blocks whose maximum is below the threshold — without decompressing them. On a file partitioned by date this can skip 95 per cent of the file." }
    ] } },
  { ana: "A CSV is a book with no contents page and no index: any question means reading every page. A Parquet file is a book where each chapter is one topic, and the first page lists the range of each chapter. Most questions are answered by reading the summary and then one chapter.",
    at: "The contents page" },

  { h: "Using it" },
  { code: { lang: "python",
    lines: [
     { c: "df.to_parquet(\"sales.parquet\")", w: "**That is the whole API.** Requires `pyarrow` installed — `pip install pyarrow`." },
     { c: "df = pd.read_parquet(\"sales.parquet\")", w: "**Dtypes come back exactly as they were.** Categories are still categories, dates are still dates, and nothing is re-guessed." },
     { c: "", w: "" },
     { c: "df.to_parquet(\"sales.parquet\", compression=\"zstd\")", w: "Smaller than the default snappy, slightly slower to write. `snappy` for working files, `zstd` for archives." },
     { c: "", w: "" },
     { c: "df.to_parquet(\"sales/\", partition_cols=[\"year\", \"region\"])", w: "**Writes a directory tree**, one folder per value: `sales/year=2026/region=East/…`. A query filtered on year and region then reads only the matching folders — the file layout itself does the filtering.", hi: true }
    ] } },
  { code: { lang: "text", t: "What a partitioned dataset looks like on disk",
    lines: [
     { c: "sales/", w: "" },
     { c: "  year=2025/", w: "" },
     { c: "    region=East/part-0.parquet", w: "" },
     { c: "    region=West/part-0.parquet", w: "" },
     { c: "  year=2026/", w: "" },
     { c: "    region=East/part-0.parquet", w: "**A query for `year == 2026 and region == \"East\"` opens exactly one file.** The directory names are the index — this is called *Hive partitioning* and every tool in the ecosystem understands it." }
    ] } },
  { trap: "Do not partition on something with high cardinality. Partitioning by `customer_id` produces a million directories each holding a few kilobytes, and the overhead of opening a million files dwarfs any saving. Partition on the column you filter by *and* which has few distinct values — date and region, essentially always." },

  { h: "Choosing a format" },
  { tbl: { h: ["Format", "Use it for", "Avoid it for"],
    rows: [
     ["**CSV**", "Handing data to a human or an unknown program; anything opened in a spreadsheet", "Anything you will read back in code, or anything large"],
     ["**Parquet**", "**The default for analytics.** Intermediate files, storage, anything read by pandas, Spark, DuckDB or a warehouse", "Frequent single-row lookups or updates"],
     ["**JSON / JSONL**", "Nested or irregular records; API payloads; logs", "Tabular data, where it is far larger and slower than it needs to be"],
     ["**SQLite**", "A real database in one file, with indexes and updates", "Sharing with tools that expect flat files"],
     ["**Feather / Arrow IPC**", "Fast temporary handoff between processes on one machine", "Long-term storage — it is not optimised for size"],
     ["**Pickle**", "Nothing you will keep", "**Everything.** It breaks between versions and executes arbitrary code on load — never open one you did not write"]
    ] } },

  { tryit: { t: "Measure the difference on your own data",
    task: "Take a table of at least a million rows. Write it as CSV and as Parquet. Compare the two file sizes, and time reading each back. Then time reading just two columns from each.",
    hint: "`os.path.getsize` for the sizes, `time.perf_counter` around the reads, `usecols` versus `columns` for the last part.",
    sol: { lang: "python", code: "import os, time\n\ndf.to_csv(\"t.csv\", index=False)\ndf.to_parquet(\"t.parquet\")\n\nfor f in (\"t.csv\", \"t.parquet\"):\n    print(f, f\"{os.path.getsize(f)/1e6:.1f} MB\")\n\nt = time.perf_counter(); pd.read_csv(\"t.csv\")\nprint(f\"csv full:      {time.perf_counter()-t:.2f}s\")\n\nt = time.perf_counter(); pd.read_parquet(\"t.parquet\")\nprint(f\"parquet full:  {time.perf_counter()-t:.2f}s\")\n\nt = time.perf_counter(); pd.read_csv(\"t.csv\", usecols=[\"id\", \"amount\"])\nprint(f\"csv 2 cols:    {time.perf_counter()-t:.2f}s\")\n\nt = time.perf_counter(); pd.read_parquet(\"t.parquet\", columns=[\"id\", \"amount\"])\nprint(f\"parquet 2 cols:{time.perf_counter()-t:.2f}s\")" },
    w: "The two-column read is where the gap becomes absurd — often a hundred times. The CSV still parses every byte of every column to find the two you asked for; Parquet reads two contiguous blocks and stops. That single number is why every analytical system on earth is columnar." } }
 ],
 k: [
  "Row storage keeps a record together; column storage keeps a field together, and analytics reads fields.",
  "Grouping like values makes dictionary and run-length compression work — hence 5–10× smaller than CSV.",
  "Parquet keeps dtypes and per-block statistics, enabling column and predicate pushdown.",
  "Partition on low-cardinality columns you filter by; never on an identifier."
 ],
 r: ["Parquet", "Columnar Storage", "ORC", "Data Lake", "Serialisation"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "df.to_parquet(\"sales.parquet\")", w: "save a table in a columnar format that keeps its types" },
   { c: "df = pd.read_parquet(\"sales.parquet\", columns=[\"date\", \"amount\"])", w: "read back only two columns, touching nothing else on disk" },
   { c: "df.to_parquet(\"sales.parquet\", compression=\"zstd\")", w: "write with stronger compression for archiving" },
   { c: "df.to_parquet(\"sales/\", partition_cols=[\"year\", \"region\"])", w: "split a dataset into folders so filters can skip whole files" },
   { c: "df = pd.read_parquet(\"sales.parquet\", filters=[(\"date\", \">=\", \"2026-01-01\")])", w: "let the reader skip blocks that cannot match" }
  ]
 }
},

{
 t: "Polars, DuckDB and the Single-Machine Ceiling",
 m: "scale",
 lvl: "advanced",
 s: "Two tools that handle far more than pandas on the same laptop, and how to tell which one you want.",
 goal: [
  "Say what Polars and DuckDB do differently from pandas",
  "Recognise which of the three fits a given problem",
  "Query a file larger than RAM without a cluster"
 ],
 b: [
  { p: "There is a large gap between *pandas is struggling* and *I need a cluster*, and almost everybody who jumps that gap did not need to. A modern laptop with 16 GB of RAM will comfortably handle a hundred million rows with the right tool. This lesson is those tools." },

  { h: "What pandas does that costs it" },
  { l: [
   "**Single-threaded, mostly.** Your other seven cores watch a `groupby` happen on one of them.",
   "**Eager.** Every step runs the moment you write it, materialising a full intermediate frame — so a filter after a merge merges everything first and then throws most of it away.",
   "**No query planner.** It does exactly what you wrote, in the order you wrote it, however wasteful that order was.",
   "**A heavy index.** The row labels are genuinely useful and they cost memory and complexity on every operation."
  ] },
  { p: "None of that was a mistake. pandas was designed in 2008 for datasets that fit comfortably in memory, and its ergonomics are still the best of the three. But the constraints it was designed under no longer describe the data most people have." },

  { h: "Polars" },
  { p: "**Polars** is a DataFrame library written in Rust with a familiar-looking API and three structural differences." },
  { ol: [
   "**Multi-threaded by default.** It uses every core with no configuration.",
   "**Built on Apache Arrow**, a columnar memory format — so no Python object overhead for strings, and zero-copy handoff to other Arrow tools.",
   "**A lazy mode with a query optimiser.** You describe the whole pipeline, and Polars rearranges it before running any of it."
  ] },
  { code: { lang: "python", t: "The same job, pandas and Polars",
    lines: [
     { c: "# pandas", w: "" },
     { c: "df = pd.read_csv(\"sales.csv\")", w: "**Reads the entire file** — every row, every column." },
     { c: "df = df[df[\"amount\"] > 100]", w: "Then discards most of it." },
     { c: "out = df.groupby(\"region\")[\"amount\"].sum()", w: "Three passes, all the data loaded, one core." },
     { c: "", w: "" },
     { c: "# polars, lazily", w: "" },
     { c: "import polars as pl", w: "" },
     { c: "out = (", w: "" },
     { c: "    pl.scan_csv(\"sales.csv\")", w: "**`scan_` rather than `read_` — nothing is loaded yet.** It reads the header and builds a plan." },
     { c: "      .filter(pl.col(\"amount\") > 100)", w: "" },
     { c: "      .group_by(\"region\")", w: "" },
     { c: "      .agg(pl.col(\"amount\").sum())", w: "" },
     { c: "      .collect()", w: "**Now it runs.** Having seen the whole pipeline first, Polars reads only the two columns involved, applies the filter *while* reading, and runs the grouping across every core.", hi: true },
     { c: ")", w: "" }
    ],
    after: "Typically five to twenty times faster on a multi-core machine, at a fraction of the memory — and with `scan_csv` the file need not fit in RAM at all." } },
  { n: "That reordering is the same idea SQL has used since the 1970s: describe the result, let the engine choose the strategy. It is the exact trade the SQL track opens with, arriving in the DataFrame world forty years later.",
    nt: "This is the SQL idea, borrowed" },

  { h: "DuckDB" },
  { p: "**DuckDB** takes the other route: it is a real analytical database that runs inside your Python process, with no server, no setup and no configuration — and you talk to it in SQL." },
  { code: { lang: "python",
    lines: [
     { c: "import duckdb", w: "`pip install duckdb`. There is nothing else to install and nothing to run." },
     { c: "", w: "" },
     { c: "duckdb.sql(\"\"\"", w: "" },
     { c: "    SELECT region, sum(amount) AS revenue", w: "" },
     { c: "    FROM 'sales/*.parquet'", w: "**Query files on disk directly.** No import step, no loading — DuckDB reads the Parquet itself, in parallel, pushing the filter and the column selection down into the reader.", hi: true },
     { c: "    WHERE amount > 100", w: "" },
     { c: "    GROUP BY region", w: "" },
     { c: "    ORDER BY revenue DESC", w: "" },
     { c: "\"\"\").df()", w: "**`.df()` hands the result back as a pandas DataFrame**, so this drops into an existing notebook with no disruption." },
     { c: "", w: "" },
     { c: "duckdb.sql(\"SELECT * FROM df WHERE amount > 100\").df()", w: "**And it reads your existing pandas frames by variable name**, with no copy. You can move between SQL and pandas mid-analysis." }
    ] } },
  { p: "DuckDB will happily query a file considerably larger than your RAM, spilling to disk as needed, and it is frequently the fastest of the three on aggregation-heavy work. If you already know SQL — and after the SQL track you will — it requires learning almost nothing." },

  { h: "Choosing" },
  { tbl: { t: "Which one, honestly",
    h: ["", "Sweet spot", "Choose it when"],
    rows: [
     ["**pandas**", "Up to ~5 million rows", "Exploring, plotting, feeding scikit-learn. **The ecosystem is the reason** — everything accepts a DataFrame"],
     ["**Polars**", "5 million to ~1 billion", "The pipeline is the bottleneck and you want DataFrame code, not SQL"],
     ["**DuckDB**", "5 million to well beyond RAM", "The work is aggregation and joins, the data is already Parquet, and you are comfortable in SQL"],
     ["**Spark**", "Genuinely beyond one machine", "Terabytes, or the data already lives in a cluster. **Not before** — see the next lesson"]
    ] } },
  { n: "These are not exclusive. A very common professional setup is DuckDB or Polars doing the heavy filtering and aggregation over Parquet, handing a few thousand rows to pandas for the final shaping and the chart. Use the big tool to make the data small, then the pleasant tool to finish.",
    nt: "The combination most professionals actually use" },

  { h: "Where the single-machine ceiling actually is" },
  { p: "Higher than almost everyone assumes. A commodity laptop in 2026 — 8 cores, 16 GB, an NVMe drive — running DuckDB over partitioned Parquet handles hundreds of millions of rows for ordinary analytical queries. A rented server with 128 GB, which costs a few pounds an hour, comfortably reaches billions." },
  { q: "Your data is probably not big enough to justify a distributed system, and the cost of pretending otherwise is measured in engineering years.", by: "The consensus that took the industry about a decade to reach" },

  { tryit: { t: "Race the three",
    task: "Generate a synthetic table of twenty million rows with a category column and two numeric columns. Save it as Parquet. Then compute the same grouped aggregation in pandas, Polars (lazy) and DuckDB, timing each and watching memory.",
    hint: "`pl.scan_parquet(...).group_by(...).agg(...).collect()` and `duckdb.sql(\"select ... from 'f.parquet' group by ...\")`.",
    sol: { lang: "python", code: "import time, numpy as np, pandas as pd, polars as pl, duckdb\n\nn = 20_000_000\nrng = np.random.default_rng(0)\npd.DataFrame({\n    \"region\": rng.choice([\"N\", \"S\", \"E\", \"W\"], n),\n    \"amount\": rng.random(n) * 1000,\n    \"qty\": rng.integers(1, 10, n),\n}).to_parquet(\"bench.parquet\")\n\nt = time.perf_counter()\npd.read_parquet(\"bench.parquet\").groupby(\"region\")[\"amount\"].sum()\nprint(f\"pandas:  {time.perf_counter()-t:.2f}s\")\n\nt = time.perf_counter()\n(pl.scan_parquet(\"bench.parquet\")\n   .group_by(\"region\").agg(pl.col(\"amount\").sum()).collect())\nprint(f\"polars:  {time.perf_counter()-t:.2f}s\")\n\nt = time.perf_counter()\nduckdb.sql(\"SELECT region, sum(amount) FROM 'bench.parquet' GROUP BY region\").df()\nprint(f\"duckdb:  {time.perf_counter()-t:.2f}s\")" },
    w: "Watch your machine's memory graph while each runs. pandas loads the whole file; the other two stream it. That difference — not the wall-clock time — is what decides whether a job runs at all on data three times this size." } }
 ],
 k: [
  "pandas is single-threaded and eager; Polars is multi-threaded, Arrow-backed and can plan a whole pipeline lazily.",
  "DuckDB is an in-process analytical database that queries Parquet on disk in SQL, beyond the size of RAM.",
  "Use the big tool to shrink the data, then pandas for the last few thousand rows and the chart.",
  "One machine reaches hundreds of millions of rows — far past where most people reach for a cluster."
 ],
 r: ["Query Optimiser", "Columnar Storage", "OLAP", "Parquet", "Lazy Loading"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "import polars as pl", w: "import the Rust-based dataframe library" },
   { c: "out = pl.scan_csv(\"sales.csv\").filter(pl.col(\"amount\") > 100).collect()", w: "build a lazy plan over a file and then run it" },
   { c: "duckdb.sql(\"SELECT region, sum(amount) FROM 'sales.parquet' GROUP BY region\").df()", w: "query a file on disk in SQL and get a dataframe back" },
   { c: "duckdb.sql(\"SELECT * FROM df WHERE amount > 100\").df()", w: "run SQL directly against a pandas frame in scope" }
  ]
 }
},

{
 t: "Spark, Hadoop and What Distributed Actually Means",
 m: "scale",
 lvl: "advanced",
 s: "The tools everyone has heard of, what they genuinely solve, and the honest test for whether you need them.",
 goal: [
  "Explain what a distributed system buys you and what it costs",
  "Say what MapReduce was and why Spark replaced it",
  "Apply a defensible test for whether your problem needs a cluster"
 ],
 b: [
  { p: "Everything so far has run on one machine. This lesson is what happens past that, and its real purpose is to let you recognise the boundary — both so you know the tools when you meet them, and so you can say *no, not yet* with confidence when someone proposes one." },

  { h: "The problem they were built for" },
  { p: "Around 2003, Google had a genuine version of this problem: more web pages than any single machine could store, let alone index. Two papers came out of it — the Google File System and MapReduce — and the open-source reimplementation of both became **Hadoop**." },
  { ol: [
   "**Split the data across many machines.** No machine holds it all; each holds a piece, replicated a few times so a dead disk loses nothing. That is **HDFS**.",
   "**Send the computation to the data.** Moving a terabyte across a network is slow; sending a few kilobytes of code to the machine already holding the terabyte is not. This inversion is the central idea.",
   "**Assume machines will fail.** At a thousand machines, something is always broken. The framework re-runs failed pieces elsewhere rather than aborting the job.",
   "**Combine the partial answers.** Each machine returns a small result; those are merged into the final one."
  ] },
  { ana: "One person counting every word in a library takes a year. A hundred people each counting one shelf takes a few days — but only if the counting can be split cleanly, the tallies can be added at the end, and somebody handles the fact that three counters will go home sick. The framework is the person handling the last part.",
    at: "A hundred people and a library" },

  { h: "MapReduce" },
  { p: "The programming model is two functions, and the whole framework exists to run them at scale." },
  { code: { lang: "text", t: "Counting words across a thousand machines",
    lines: [
     { c: "MAP     each machine, on its own shard:", w: "" },
     { c: "        \"the cat sat\"  ->  (the,1) (cat,1) (sat,1)", w: "**Emit key-value pairs.** Entirely independent — no machine needs anything from any other, which is what makes it parallel." },
     { c: "", w: "" },
     { c: "SHUFFLE across the network:", w: "" },
     { c: "        every (the,_) pair moves to the same machine", w: "**The expensive step, and the one that decides your job's runtime.** Data physically crosses the network so that all values for a key meet.", hi: true },
     { c: "", w: "" },
     { c: "REDUCE  per key:", w: "" },
     { c: "        (the, [1,1,1,1]) -> (the, 4)", w: "**Combine the values for one key into the answer.** Also independent, also parallel." }
    ] } },
  { p: "Every distributed data operation you will meet reduces to this shape. A `groupby` is a shuffle by the group key. A join is a shuffle by the join key on both sides. When someone says a distributed job is slow, they nearly always mean it is shuffling." },

  { h: "Why Spark replaced it" },
  { p: "Hadoop MapReduce wrote every intermediate result to disk, then read it back for the next stage. For a single pass that is fine. For an iterative algorithm — which is every machine-learning algorithm — it is disastrous: a hundred iterations meant two hundred trips to disk." },
  { tbl: { h: ["", "Hadoop MapReduce", "Apache Spark"],
    rows: [
     ["Between stages", "Written to disk", "**Kept in memory** where it fits"],
     ["Iterative work", "Punishing", "The design goal"],
     ["Writing a job", "Java, verbose, two functions at a time", "Python, Scala, SQL — a DataFrame API you already recognise"],
     ["Evaluation", "Eager, stage by stage", "**Lazy**, with a whole-job optimiser"],
     ["Typical speed-up", "—", "10–100× on iterative jobs"]
    ] } },
  { n: "Hadoop is not dead, but its role has narrowed. HDFS as a storage layer has largely been replaced by object storage — S3, GCS, Azure Blob — and the MapReduce engine has been replaced by Spark. What survived is the ideas: partitioned data, computation moved to storage, failure as normal.",
    nt: "What is left of Hadoop" },

  { h: "What Spark code looks like" },
  { code: { lang: "python", file: "job.py",
    lines: [
     { c: "from pyspark.sql import SparkSession", w: "" },
     { c: "from pyspark.sql import functions as F", w: "" },
     { c: "", w: "" },
     { c: "spark = SparkSession.builder.appName(\"sales\").getOrCreate()", w: "**The entry point.** On a cluster this connects to the resource manager; locally it starts threads on your own cores." },
     { c: "", w: "" },
     { c: "df = spark.read.parquet(\"s3://bucket/sales/\")", w: "**Nothing is read.** Spark records the intention. A Spark DataFrame is a *plan*, not data — which is the mental adjustment that matters most coming from pandas.", hi: true },
     { c: "", w: "" },
     { c: "out = (df", w: "" },
     { c: "       .filter(F.col(\"amount\") > 100)", w: "**Still nothing has run.** These are *transformations*; they extend the plan." },
     { c: "       .groupBy(\"region\")", w: "" },
     { c: "       .agg(F.sum(\"amount\").alias(\"revenue\")))", w: "" },
     { c: "", w: "" },
     { c: "out.show()", w: "**An *action*, and now the whole thing runs** — optimised as a unit, across every machine in the cluster. `write`, `count` and `collect` are the other common actions." },
     { c: "", w: "" },
     { c: "small = out.toPandas()", w: "**Bring the result back as a pandas frame — only when it is genuinely small.** `toPandas` on a large result pulls the entire dataset onto one machine and is the most common way to crash a Spark job." }
    ] } },
  { p: "The API is deliberately close to pandas, and that similarity is real: `filter`, `groupBy`, `agg`, `join` mean what you expect. The difference is entirely in the laziness and in the fact that your data is somewhere else." },
  { trap: "The pandas habits that hurt most in Spark are `collect()`, `toPandas()` and `count()` scattered through a pipeline. Each one forces the entire plan to execute up to that point. Sprinkling them in to *check progress* can turn a two-minute job into forty minutes of repeated work." },

  { h: "What it costs" },
  { l: [
   "**A cluster to run and pay for**, whether managed (Databricks, EMR, Dataproc) or your own.",
   "**Startup overhead.** A Spark job takes tens of seconds to begin before doing anything. On a small dataset a cluster is genuinely *slower* than your laptop.",
   "**A harder debugging story.** The failure happened on one of two hundred executors and the stack trace is in a log aggregator, in Java.",
   "**Shuffles.** The step that crosses the network dominates the runtime, and tuning it — partition counts, skew, broadcast joins — is a specialism.",
   "**Skew.** One key with a hundred times more rows than the others means one executor works for an hour while the rest idle. Diagnosing this is a rite of passage."
  ] },

  { h: "The honest test" },
  { p: "Work down this list. Stop at the first *no*." },
  { ol: [
   "Have you narrowed your dtypes and read only the columns you need? **Most problems end here.**",
   "Have you converted to Parquet and partitioned it sensibly?",
   "Have you tried DuckDB or Polars, which stream from disk and use every core?",
   "Have you tried renting a 128 GB machine for an hour, which costs less than a coffee?",
   "Is the data genuinely in the terabytes, *and* does the work genuinely need all of it at once?",
   "Is it already in a cluster, so that not using Spark means moving it out?"
  ] },
  { n: "If you reached the last two, use Spark and use it without apology — that is what it is for, and nothing else does the job. If you stopped at three or four, you have just saved yourself a cluster, a bill and a class of failure you would otherwise be debugging at midnight.",
    nt: "Both answers are respectable" },

  { h: "Where this track has brought you" },
  { p: "You started at `print(\"hello\")` and you have arrived at a working judgement about distributed systems. That progression is the whole point of the track — not that you now know every API, but that you can look at a data problem and reason about **what it will cost, where it will break, and which tool is the right size for it.**" },
  { p: "The pieces fit together like this: NumPy gave you the array and the reason vectorised code is fast. pandas gave you the labelled table and the cleaning and joining that real data demands. This module gave you the cost model underneath both — what memory is being spent, how storage layout changes what is possible, and where a single machine actually ends." },
  { l: [
   "**If you liked the data work**, the SQL track is the obvious next step; almost every dataset you will meet starts in a database, and DuckDB has already shown you how well the two worlds combine.",
   "**If you have not done the Git track**, do it before your next project. Everything above is more valuable when it is version-controlled and shareable.",
   "**If you want to build things people can see**, HTML and CSS are next, and they are short."
  ] },

  { tryit: { t: "Make the argument, in writing",
    task: "Take a real dataset you work with and write a short recommendation: its size, the operations you run on it, which of the four tools you would use and why — and specifically what would have to change for you to move up to the next one.",
    hint: "The last part is the valuable half. *We move to Polars when the daily file passes about 20 GB* is a real engineering decision; *we might need Spark someday* is not.",
    sol: { lang: "text", code: "Dataset: daily transaction export, ~40M rows, 12 columns, 3.1 GB Parquet\nWork:    filter by date, join to a 50k-row customer table, group by region and month\n\nDecision: DuckDB over the partitioned Parquet, results into pandas for charts.\n\nWhy:  the whole job is filter-join-aggregate, which is exactly SQL's shape, and\n      DuckDB reads only the 5 columns involved. Runs in ~4s on the laptop.\n      pandas needed 11 GB and 90s for the same result.\n\nMove up when: the daily file passes ~50 GB, or we need the last 3 years in one\n      query (~1.5 TB). Then Polars streaming first, Spark only if the join to\n      the events table (2 TB) becomes part of this job." },
    w: "Note that it names a number for the move-up trigger. A plan with a threshold in it is one you can act on later without re-litigating the whole argument — and it is the difference between an engineering decision and an opinion." } }
 ],
 k: [
  "Distributed processing splits data across machines, sends the computation to it, and expects failures.",
  "MapReduce is map, shuffle, reduce — and the shuffle, which crosses the network, is what costs.",
  "Spark replaced Hadoop MapReduce by keeping intermediates in memory and optimising the whole job lazily.",
  "Exhaust dtypes, Parquet, DuckDB/Polars and a bigger rented machine before a cluster — most problems end well before it."
 ],
 r: ["Apache Spark", "Hadoop", "MapReduce", "HDFS", "Distributed System", "Data Lake", "Partitioning"],
 drill: {
  lang: "python",
  reps: 3,
  items: [
   { c: "spark = SparkSession.builder.appName(\"sales\").getOrCreate()", w: "start or join a Spark session" },
   { c: "df = spark.read.parquet(\"s3://bucket/sales/\")", w: "declare a read that has not happened yet" },
   { c: "out = df.filter(F.col(\"amount\") > 100).groupBy(\"region\").agg(F.sum(\"amount\"))", w: "build a distributed plan without running it" },
   { c: "out.show()", w: "trigger the whole plan and print the result" },
   { c: "small = out.toPandas()", w: "bring a small result back to one machine", hint: "only when it is genuinely small" }
  ]
 }
}

]);
