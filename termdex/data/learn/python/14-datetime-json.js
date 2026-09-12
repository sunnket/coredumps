/* Python — dates, times and JSON. */
TD.addLessons("python", [

    {
        t: "Dates and Times — The datetime Module",
        m: "datetime",
        lvl: "intermediate",
        s: "The module everyone avoids until a deadline involves a deadline.",
        goal: [
            "Create, format and parse dates and times",
            "Calculate the difference between two dates",
            "Explain why naive datetimes cause real bugs and how to add timezone awareness"
        ],
        b: [
            { p: "Time is one of the hardest problems in computing, and most of the difficulty is invisible until something goes wrong. This lesson covers the practical surface — creating, formatting, parsing and doing arithmetic on dates — and flags the traps that will otherwise find you in production." },

            { h: "Creating dates and times" },
            {
                code: {
                    lang: "python", t: "The four types in datetime",
                    lines: [
                        { c: "from datetime import date, time, datetime, timedelta", w: "The module and its main class have the same name — `from datetime import datetime` is not a typo." },
                        { c: "", w: "" },
                        { c: "d = date(2026, 8, 25)", w: "**A date — year, month, day.** No time component." },
                        { c: "t = time(14, 30, 0)", w: "**A time — hour, minute, second.** No date." },
                        { c: "dt = datetime(2026, 8, 25, 14, 30, 0)", w: "**Both together.** This is the one you will use most." },
                        { c: "", w: "" },
                        { c: "print(date.today())", w: "Today's date, from the system clock." },
                        { c: "print(datetime.now())", w: "Right now, including the time." }
                    ],
                    out: "2026-08-25\n2026-08-25 14:30:00"
                }
            },

            { h: "Formatting — turning a date into text" },
            { p: "`.strftime()` renders a datetime as a string using format codes. The name stands for *string format time*." },
            {
                code: {
                    lang: "python",
                    lines: [
                        { c: "dt = datetime(2026, 8, 25, 14, 30)", w: "" },
                        { c: "", w: "" },
                        { c: "print(dt.strftime(\"%d %B %Y\"))", w: "Day, full month name, four-digit year." },
                        { c: "print(dt.strftime(\"%Y-%m-%d\"))", w: "**ISO format** — the format databases and APIs expect, and the one you should default to." },
                        { c: "print(dt.strftime(\"%I:%M %p\"))", w: "12-hour clock with AM/PM." },
                        { c: "print(dt.strftime(\"%A, %d %b %Y\"))", w: "Full weekday name, abbreviated month." }
                    ],
                    out: "25 August 2026\n2026-08-25\n02:30 PM\nTuesday, 25 Aug 2026"
                }
            },

            {
                tbl: {
                    t: "The format codes worth memorising",
                    h: ["Code", "Produces", "Example"],
                    rows: [
                        ["`%Y`", "Four-digit year", "`2026`"],
                        ["`%m`", "Zero-padded month", "`08`"],
                        ["`%d`", "Zero-padded day", "`25`"],
                        ["`%H`", "Hour (24h)", "`14`"],
                        ["`%I`", "Hour (12h)", "`02`"],
                        ["`%M`", "Minute", "`30`"],
                        ["`%S`", "Second", "`00`"],
                        ["`%p`", "AM / PM", "`PM`"],
                        ["`%A`", "Full weekday", "`Tuesday`"],
                        ["`%B`", "Full month name", "`August`"],
                        ["`%b`", "Abbreviated month", "`Aug`"]
                    ]
                }
            },

            { h: "Parsing — turning text into a date" },
            {
                code: {
                    lang: "python",
                    lines: [
                        { c: "text = \"25/08/2026 14:30\"", w: "Text from a file, a form, an API." },
                        { c: "dt = datetime.strptime(text, \"%d/%m/%Y %H:%M\")", w: "**`strptime` is the reverse** — *string parse time*. The format must match the input exactly or it raises `ValueError`." },
                        { c: "print(dt)" },
                        { c: "", w: "" },
                        { c: "# ISO format has a shortcut", w: "" },
                        { c: "dt = datetime.fromisoformat(\"2026-08-25T14:30:00\")", w: "**`fromisoformat` parses the standard format without a format string.** Use this whenever the data is already ISO-formatted." },
                        { c: "print(dt)" }
                    ],
                    out: "2026-08-25 14:30:00\n2026-08-25 14:30:00"
                }
            },
            { trap: "`strptime` is strict — `%m` needs a zero-padded month, and `%d/%m/%Y` on `25-08-2026` (dashes instead of slashes) raises `ValueError`. When the format varies, parse defensively with `try/except`, or use the third-party `dateutil.parser.parse` which handles almost anything." },

            { h: "Date arithmetic — timedelta" },
            {
                code: {
                    lang: "python",
                    lines: [
                        { c: "from datetime import timedelta", w: "" },
                        { c: "", w: "" },
                        { c: "today = date.today()", w: "" },
                        { c: "one_week = timedelta(days=7)", w: "A **duration** — the gap between two points in time." },
                        { c: "print(today + one_week)", w: "**Add a duration to a date and get a date.**" },
                        { c: "", w: "" },
                        { c: "deadline = date(2026, 12, 31)", w: "" },
                        { c: "remaining = deadline - today", w: "**Subtract two dates and get a timedelta.**" },
                        { c: "print(f\"{remaining.days} days left\")", w: "" },
                        { c: "", w: "" },
                        { c: "shift = timedelta(hours=8, minutes=30)", w: "Durations can mix units." },
                        { c: "start = datetime(2026, 8, 25, 9, 0)", w: "" },
                        { c: "print(start + shift)", w: "" }
                    ],
                    out: "2026-09-01\n128 days left\n2026-08-25 17:30:00"
                }
            },
            { p: "A `timedelta` understands days, hours, minutes, seconds and microseconds — but **not months or years**, because those are not fixed lengths. February is 28 or 29 days; a year is 365 or 366. For month arithmetic use `dateutil.relativedelta`." },

            { h: "Accessing parts" },
            {
                code: {
                    lang: "python",
                    lines: [
                        { c: "dt = datetime(2026, 8, 25, 14, 30)", w: "" },
                        { c: "print(dt.year, dt.month, dt.day)", w: "Individual components." },
                        { c: "print(dt.weekday())", w: "**0 = Monday, 6 = Sunday.** `isoweekday()` gives 1 = Monday, 7 = Sunday." },
                        { c: "print(dt.date())", w: "Extract just the date." },
                        { c: "print(dt.time())", w: "Extract just the time." },
                        { c: "print(dt.replace(year=2027))", w: "**A new datetime with one part changed.** Datetimes are immutable, like strings." }
                    ],
                    out: "2026 8 25\n0\n2026-08-25\n14:30:00\n2027-08-25 14:30:00"
                }
            },

            { h: "Timezones — the trap that costs real money" },
            { p: "`datetime.now()` gives a **naive** datetime — it has no timezone. It looks like it is UTC, or local time, or Mumbai time, but it is not any of them, because it does not know. Two naive datetimes from different time zones subtract to nonsense." },
            {
                code: {
                    lang: "python",
                    lines: [
                        { c: "from datetime import timezone", w: "Built in since Python 3.2." },
                        { c: "", w: "" },
                        { c: "utc_now = datetime.now(timezone.utc)", w: "**Aware** — the datetime knows it is UTC." },
                        { c: "print(utc_now)" },
                        { c: "", w: "" },
                        { c: "from zoneinfo import ZoneInfo", w: "Built in since Python 3.9. On older versions: `pip install tzdata`." },
                        { c: "", w: "" },
                        { c: "ist = ZoneInfo(\"Asia/Kolkata\")", w: "" },
                        { c: "mumbai_now = datetime.now(ist)", w: "" },
                        { c: "print(mumbai_now)", w: "UTC + 5:30." },
                        { c: "", w: "" },
                        { c: "print(mumbai_now - utc_now)", w: "**Subtraction works correctly** because both know their timezone." }
                    ],
                    out: "2026-08-25 06:46:44.123456+00:00\n2026-08-25 12:16:44.123456+05:30\n0:00:00"
                }
            },
            {
                n: "**Store and transmit in UTC. Display in local time.** This is the professional rule. Every database column, every log timestamp, every API response should be UTC. Convert to the user's timezone only at the moment you show it to them. Every application that stores local times eventually has a daylight saving time bug.",
                nt: "The rule"
            },

            {
                tryit: {
                    t: "Build a countdown",
                    task: "Ask the user for a date in `DD/MM/YYYY` format. Parse it, calculate how many days from today, and print `X days, Y hours, Z minutes remaining` — or say it is in the past.",
                    hint: "`datetime.now()` gives a datetime; `date.today()` gives a date. Match types before subtracting.",
                    sol: { lang: "python", code: "from datetime import datetime\n\nraw = input(\"Target date (DD/MM/YYYY): \")\ntarget = datetime.strptime(raw, \"%d/%m/%Y\")\n\nnow = datetime.now()\nremaining = target - now\n\nif remaining.total_seconds() < 0:\n    print(\"That date is in the past.\")\nelse:\n    days = remaining.days\n    hours, rest = divmod(remaining.seconds, 3600)\n    minutes = rest // 60\n    print(f\"{days} days, {hours} hours, {minutes} minutes remaining\")" },
                    w: "`divmod` splits a number into quotient and remainder in one call — exactly the tool for decomposing a total number of seconds into hours, minutes and seconds."
                }
            }
        ],
        k: [
            "`date`, `time`, `datetime` and `timedelta` cover most needs; `strftime` formats, `strptime` parses.",
            "Subtracting two dates gives a `timedelta`; adding a `timedelta` to a date gives a date.",
            "`timedelta` handles days and shorter — not months or years, because those are variable lengths.",
            "Store in UTC, display in local time. A naive datetime with no timezone is a bug waiting to happen."
        ],
        r: ["Serialisation"],
        drill: {
            lang: "python",
            reps: 3,
            items: [
                { c: "from datetime import datetime, timedelta", w: "import the datetime class and duration type" },
                { c: "datetime.now()", w: "get the current date and time" },
                { c: "dt.strftime(\"%Y-%m-%d\")", w: "format a datetime as an ISO date string" },
                { c: "datetime.strptime(text, \"%d/%m/%Y\")", w: "parse a date string into a datetime object" },
                { c: "deadline - date.today()", w: "calculate the number of days until a deadline" },
                { c: "datetime.now(timezone.utc)", w: "get the current time with timezone awareness" }
            ]
        }
    },

    {
        t: "JSON — The Language of Data Exchange",
        m: "json",
        lvl: "intermediate",
        s: "Reading, writing and thinking in the format every API on the internet speaks.",
        goal: [
            "Read and write JSON files from Python",
            "Convert between dictionaries and JSON strings",
            "Handle the gotchas that trip up everyone once"
        ],
        b: [
            { p: "**JSON** — JavaScript Object Notation — is a text format for structured data. It looks almost identical to a Python dictionary, and that resemblance is a trap: they are close enough to lull you and different enough to bite. This lesson is both the tool and the traps." },

            { h: "What JSON looks like" },
            {
                code: {
                    lang: "json", t: "A JSON file",
                    lines: [
                        { c: "{", w: "" },
                        { c: "  \"name\": \"Aryan\",", w: "**Always double quotes.** Single quotes are a syntax error in JSON." },
                        { c: "  \"age\": 30,", w: "Numbers, with no quotes." },
                        { c: "  \"active\": true,", w: "**Lowercase `true` and `false`** — not `True` and `False`." },
                        { c: "  \"address\": null,", w: "**`null`, not `None`.**" },
                        { c: "  \"tags\": [\"python\", \"data\"]", w: "Arrays use square brackets, like Python lists." },
                        { c: "}" }
                    ]
                }
            },

            {
                tbl: {
                    t: "Python ↔ JSON type mapping",
                    h: ["Python", "JSON", "Gotcha"],
                    rows: [
                        ["`dict`", "`{}`", "Keys **must** be strings in JSON; Python allows any hashable"],
                        ["`list`, `tuple`", "`[]`", "Tuples become arrays and come back as lists — the distinction is lost"],
                        ["`str`", "`\"\"`", "Always double quotes"],
                        ["`int`, `float`", "`number`", "No distinction between int and float in JSON"],
                        ["`True` / `False`", "`true` / `false`", "Case difference"],
                        ["`None`", "`null`", "Spelling difference"],
                        ["`set`", "—", "**Not supported.** Convert to a list first"],
                        ["`datetime`", "—", "**Not supported.** Convert to an ISO string first"]
                    ]
                }
            },

            { h: "Reading and writing JSON strings" },
            {
                code: {
                    lang: "python",
                    lines: [
                        { c: "import json", w: "Standard library." },
                        { c: "", w: "" },
                        { c: "data = {\"name\": \"Aryan\", \"age\": 30, \"tags\": [\"python\"]}", w: "" },
                        { c: "", w: "" },
                        { c: "text = json.dumps(data)", w: "**`dumps` — dump to string.** Produces a JSON string from a Python object." },
                        { c: "print(text)", w: "" },
                        { c: "print(type(text))", w: "It is a plain string." },
                        { c: "", w: "" },
                        { c: "obj = json.loads(text)", w: "**`loads` — load from string.** Parses the JSON text back into a Python object." },
                        { c: "print(obj[\"name\"])", w: "A normal dictionary again." }
                    ],
                    out: "{\"name\": \"Aryan\", \"age\": 30, \"tags\": [\"python\"]}\n<class 'str'>\nAryan"
                }
            },

            { h: "Pretty-printing" },
            {
                code: {
                    lang: "python",
                    lines: [
                        { c: "print(json.dumps(data, indent=2))", w: "**`indent=2` makes it readable.** Essential for debugging, config files, and anything a human reads." },
                        { c: "", w: "" },
                        { c: "print(json.dumps(data, indent=2, sort_keys=True))", w: "**Sorted keys** make diffs stable — same data always produces the same text." }
                    ],
                    out: "{\n  \"age\": 30,\n  \"name\": \"Aryan\",\n  \"tags\": [\n    \"python\"\n  ]\n}"
                }
            },

            { h: "Reading and writing JSON files" },
            {
                code: {
                    lang: "python", t: "dump and load — no 's'",
                    lines: [
                        { c: "# Writing", w: "" },
                        { c: "with open(\"config.json\", \"w\", encoding=\"utf-8\") as f:", w: "" },
                        { c: "    json.dump(data, f, indent=2, ensure_ascii=False)", w: "**`dump` (no s) writes to a file.** `ensure_ascii=False` preserves Unicode characters like ₹ and é instead of escaping them." },
                        { c: "", w: "" },
                        { c: "# Reading", w: "" },
                        { c: "with open(\"config.json\", encoding=\"utf-8\") as f:", w: "" },
                        { c: "    config = json.load(f)", w: "**`load` (no s) reads from a file.** One line; the whole file is parsed and returned as a Python object." },
                        { c: "print(config[\"name\"])" }
                    ],
                    out: "Aryan"
                }
            },
            {
                n: "`dumps` / `loads` are for strings — the **s** is for **string**. `dump` / `load` are for files. This naming catches everyone; recognise the pattern and the confusion disappears.",
                nt: "The s stands for string"
            },

            { h: "Handling types JSON does not support" },
            {
                code: {
                    lang: "python",
                    lines: [
                        { c: "from datetime import datetime", w: "" },
                        { c: "", w: "" },
                        { c: "data = {\"event\": \"launch\", \"when\": datetime.now()}", w: "" },
                        { c: "# json.dumps(data)  # TypeError: Object of type datetime is not JSON serializable", w: "" },
                        { c: "", w: "" },
                        { c: "# Solution 1: convert before serialising", w: "" },
                        { c: "data[\"when\"] = data[\"when\"].isoformat()", w: "Turn the datetime into an ISO string yourself." },
                        { c: "print(json.dumps(data))", w: "" },
                        { c: "", w: "" },
                        { c: "# Solution 2: a custom serialiser", w: "" },
                        { c: "def default(obj):", w: "" },
                        { c: "    if isinstance(obj, datetime):", w: "" },
                        { c: "        return obj.isoformat()", w: "" },
                        { c: "    raise TypeError(f\"Not serialisable: {type(obj)}\")", w: "" },
                        { c: "", w: "" },
                        { c: "data = {\"event\": \"launch\", \"when\": datetime.now()}", w: "" },
                        { c: "print(json.dumps(data, default=default, indent=2))", w: "**`default` is called for anything JSON cannot handle.** The cleanest approach when you have many non-standard types." }
                    ]
                }
            },

            { h: "Working with APIs — the requests library" },
            { p: "JSON is the language APIs speak. The `requests` library — `pip install requests` — is how you talk to them." },
            {
                code: {
                    lang: "python",
                    lines: [
                        { c: "import requests", w: "`pip install requests` — the most downloaded Python package." },
                        { c: "", w: "" },
                        { c: "resp = requests.get(\"https://api.github.com/users/torvalds\")", w: "**An HTTP GET request.** Returns a response object." },
                        { c: "print(resp.status_code)", w: "**200 means success.** 404 means not found. 500 means the server broke." },
                        { c: "", w: "" },
                        { c: "data = resp.json()", w: "**`.json()` parses the response body as JSON** — equivalent to `json.loads(resp.text)` but shorter." },
                        { c: "print(data[\"name\"])", w: "" },
                        { c: "print(data[\"public_repos\"])" },
                        { c: "", w: "" },
                        { c: "# POST with a JSON body", w: "" },
                        { c: "resp = requests.post(", w: "" },
                        { c: "    \"https://httpbin.org/post\",", w: "" },
                        { c: "    json={\"action\": \"create\", \"item\": \"widget\"},", w: "**`json=` serialises the dict and sets the Content-Type header** — both in one argument." },
                        { c: ")", w: "" },
                        { c: "print(resp.json()[\"json\"])" }
                    ],
                    out: "200\nLinus Torvalds\n7\n{'action': 'create', 'item': 'widget'}"
                }
            },

            {
                tbl: {
                    t: "HTTP status codes worth knowing",
                    h: ["Code", "Meaning", "You should"],
                    rows: [
                        ["`200`", "OK", "Use the data"],
                        ["`201`", "Created", "The resource was made successfully"],
                        ["`400`", "Bad request", "Your input was wrong — check the payload"],
                        ["`401`", "Unauthorised", "Missing or invalid credentials"],
                        ["`403`", "Forbidden", "You are authenticated but not allowed"],
                        ["`404`", "Not found", "The URL is wrong or the resource does not exist"],
                        ["`429`", "Too many requests", "You hit a rate limit — slow down"],
                        ["`500`", "Server error", "Their problem, not yours — retry later"]
                    ]
                }
            },

            { trap: "**Never hardcode API keys.** Use environment variables: `os.environ[\"API_KEY\"]`. A key accidentally committed to Git is compromised the moment it is pushed — scanners find them in seconds." },

            {
                tryit: {
                    t: "Fetch and save real data",
                    task: "Use the GitHub API to fetch the 5 most-starred Python repositories (`https://api.github.com/search/repositories?q=language:python&sort=stars&per_page=5`). Extract the name, stars and description of each, and save the result as a pretty-printed JSON file.",
                    hint: "The results are in `data[\"items\"]`. Use a list comprehension to extract the fields, then `json.dump` with `indent=2`.",
                    sol: { lang: "python", code: "import requests, json\n\nresp = requests.get(\n    \"https://api.github.com/search/repositories\",\n    params={\"q\": \"language:python\", \"sort\": \"stars\", \"per_page\": 5}\n)\nresp.raise_for_status()\n\nrepos = [\n    {\n        \"name\": r[\"full_name\"],\n        \"stars\": r[\"stargazers_count\"],\n        \"description\": r[\"description\"]\n    }\n    for r in resp.json()[\"items\"]\n]\n\nwith open(\"top_python.json\", \"w\", encoding=\"utf-8\") as f:\n    json.dump(repos, f, indent=2, ensure_ascii=False)\n\nprint(f\"Saved {len(repos)} repos\")" },
                    w: "`resp.raise_for_status()` turns any non-2xx response into an exception — which is almost always what you want, because silently processing an error response produces wrong results rather than a clear failure. `params=` builds the query string so you never have to URL-encode by hand."
                }
            }
        ],
        k: [
            "`json.dumps`/`json.loads` work with strings; `json.dump`/`json.load` work with files — **the s is for string**.",
            "JSON requires double quotes, lowercase `true`/`false`, and `null` instead of `None`.",
            "For types JSON cannot handle, convert before serialising or pass a `default` function.",
            "`requests.get(url).json()` is the one-liner for reading any JSON API."
        ],
        r: ["JSON", "HTTP", "Serialisation"],
        drill: {
            lang: "python",
            reps: 3,
            items: [
                { c: "text = json.dumps(data, indent=2)", w: "convert a dictionary to a pretty JSON string" },
                { c: "obj = json.loads(text)", w: "parse a JSON string into a Python dictionary" },
                { c: "json.dump(data, f, indent=2, ensure_ascii=False)", w: "write JSON to a file preserving Unicode" },
                { c: "config = json.load(f)", w: "read a JSON file into a Python object" },
                { c: "data = resp.json()", w: "parse the response body of an HTTP request as JSON" },
                { c: "resp.raise_for_status()", w: "raise an exception if the HTTP request failed" }
            ]
        }
    }

]);
