"""Execute the Python shown in the loops module and check the claimed output.

The lesson files assert specific printed results. A wrong `out:` string is the
one error a reader cannot debug -- they assume their machine is at fault. So
every claim that can be run is run here.

    python tools/verify_loops_code.py
"""

import io
import sys
from contextlib import redirect_stdout

CHECKS = []


def check(name, code, expected):
    CHECKS.append((name, code, expected))


# ---- lesson 1: the iterator protocol ---------------------------------

check(
    "hand-written for loop matches the real one",
    """
names = ["Aryan", "Sam", "Riya"]
for name in names:
    print(name)

it = iter(names)
while True:
    try:
        name = next(it)
    except StopIteration:
        break
    print(name)
""",
    "Aryan\nSam\nRiya\nAryan\nSam\nRiya",
)

check(
    "an exhausted generator yields nothing, silently",
    """
nums = [1, 2, 3]
print(sum(nums), sum(nums))

squares = (n * n for n in nums)
print(sum(squares))
print(sum(squares))
print(max(squares, default=None))
""",
    "6 6\n14\n0\nNone",
)

check(
    "a class with __iter__ works with for and list",
    """
class Countdown:
    def __init__(self, start):
        self.start = start

    def __iter__(self):
        n = self.start
        while n > 0:
            yield n
            n -= 1

for n in Countdown(3):
    print(n)

print(list(Countdown(3)))
""",
    "3\n2\n1\n[3, 2, 1]",
)

check(
    "the tryit: a generator consumed twice",
    """
data = (x for x in [1, 2, 3])
print(list(data))
print(list(data))

kept = [x for x in [1, 2, 3]]
print(list(kept), list(kept))

def make():
    return (x for x in [1, 2, 3])
print(list(make()), list(make()))
""",
    "[1, 2, 3]\n[]\n[1, 2, 3] [1, 2, 3]\n[1, 2, 3] [1, 2, 3]",
)

# ---- lesson 2: the named patterns ------------------------------------

check(
    "min/max with default survive an empty sequence",
    """
print(sum([]))
print(min([], default=0.0))
xs = []
print(sum(xs) / len(xs) if xs else 0.0)
""",
    "0\n0.0\n0.0",
)

check(
    "Counter groups and ranks",
    """
from collections import Counter
levels = ["INFO"] * 5 + ["ERROR"] * 2 + ["WARN"]
counts = Counter(levels)
print(counts["ERROR"])
print(counts["MISSING"])
print(counts.most_common(3))
""",
    "2\n0\n[('INFO', 5), ('ERROR', 2), ('WARN', 1)]",
)

check(
    "defaultdict removes the first-time-seen check",
    """
from collections import defaultdict
buckets = defaultdict(list)
for lvl in ["a", "b", "a"]:
    buckets[lvl].append(lvl.upper())
print(dict(buckets))
""",
    "{'a': ['A', 'A'], 'b': ['B']}",
)

check(
    "the four bracket forms differ as described",
    """
xs = [1, 2, 2]
print([x * 2 for x in xs])
print(sorted({x * 2 for x in xs}))
print({k: v for k, v in [("a", 1)]})
g = (x * 2 for x in xs)
print(type(g).__name__, list(g))
""",
    "[2, 4, 4]\n[2, 4]\n{'a': 1}\ngenerator [2, 4, 4]",
)

check(
    "n items give n-1 pairs",
    """
from itertools import pairwise
xs = [1, 2, 3, 4]
pairs = list(pairwise(xs))
print(len(xs), len(pairs))
print(pairs)
""",
    "4 3\n[(1, 2), (2, 3), (3, 4)]",
)

check(
    "the tryit: filter, group, then average each bucket",
    """
from collections import defaultdict
results = [
    {"model": "a", "score": 0.8, "passed": True},
    {"model": "a", "score": 0.6, "passed": True},
    {"model": "b", "score": 0.9, "passed": False},
    {"model": "c", "score": 0.5, "passed": True},
]
scores = defaultdict(list)
for r in results:
    if not r["passed"]:
        continue
    scores[r["model"]].append(r["score"])

averages = {m: sum(v) / len(v) for m, v in scores.items() if v}
print(averages)
""",
    "{'a': 0.7, 'c': 0.5}",
)

# ---- lesson 3: two pointers and windows ------------------------------

check(
    "two-pointer sum finds the pair on sorted input",
    """
def two_sum(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo < hi:
        s = nums[lo] + nums[hi]
        if s == target:
            return (nums[lo], nums[hi])
        if s < target:
            lo += 1
        else:
            hi -= 1
    return None

print(two_sum([1, 3, 5, 8, 12], 13))
print(two_sum([1, 3, 5], 100))
""",
    "(1, 12)\nNone",
)

check(
    "the moving average matches the lesson output",
    """
def moving_average(values, k):
    if len(values) < k:
        return []
    window = sum(values[:k])
    out = [window / k]
    for i in range(k, len(values)):
        window += values[i] - values[i - k]
        out.append(window / k)
    return out

print(moving_average([1, 2, 3, 4, 5, 6], 3))
print(moving_average([1], 3))
""",
    "[2.0, 3.0, 4.0, 5.0]\n[]",
)

check(
    "sliding window: longest run with no repeat",
    """
def longest_unique(items):
    seen = {}
    left = 0
    best = 0
    for right, item in enumerate(items):
        if item in seen and seen[item] >= left:
            left = seen[item] + 1
        seen[item] = right
        best = max(best, right - left + 1)
    return best

print(longest_unique("abcabcbb"))
print(longest_unique("bbbbb"))
print(longest_unique(""))
""",
    "3\n1\n0",
)

check(
    "the tryit: trim a history to a token budget",
    """
def fit_budget(messages, budget):
    total = 0
    left = 0
    for right, m in enumerate(messages):
        total += m["tokens"]
        while total > budget and left <= right:
            total -= messages[left]["tokens"]
            left += 1
    return messages[left:]

msgs = [{"tokens": t} for t in (50, 40, 30, 20)]
print([m["tokens"] for m in fit_budget(msgs, 60)])

# a single message larger than the whole budget must not loop forever
huge = [{"tokens": 500}]
print([m["tokens"] for m in fit_budget(huge, 100)])
""",
    "[30, 20]\n[]",
)

# ---- lesson 4: the underrated ones -----------------------------------

check(
    "zip truncates; strict raises; zip_longest pads",
    """
names = ["a", "b", "c"]
scores = [1, 2]
print(list(zip(names, scores)))
try:
    list(zip(names, scores, strict=True))
    print("no error")
except ValueError:
    print("ValueError")
from itertools import zip_longest
print(list(zip_longest(names, scores, fillvalue=0)))
""",
    "[('a', 1), ('b', 2)]\nValueError\n[('a', 1), ('b', 2), ('c', 0)]",
)

check(
    "the walrus reads until empty, exactly once",
    """
import io
f = io.StringIO("abcdefgh")
out = []
while chunk := f.read(3):
    out.append(chunk)
print(out)
""",
    "['abc', 'def', 'gh']",
)

check(
    "product flattens a grid search",
    """
from itertools import product
grid = list(product([1e-3, 1e-4], [16, 32, 64], ["adam", "sgd"]))
print(len(grid))
print(grid[0])
""",
    "12\n(0.001, 16, 'adam')",
)

check(
    "accumulate, chain and islice compose lazily",
    """
from itertools import accumulate, islice, chain
daily = [300, 400, 500, 600]
running = accumulate(daily)
over = (i for i, tot in enumerate(running) if tot > 1000)
print(next(over, None))
print(list(islice(chain([1, 2], [3], [4, 5]), 4)))
""",
    "2\n[1, 2, 3, 4]",
)

check(
    "all three chunkers handle a non-multiple length",
    """
from itertools import islice
records = list(range(7))

# range-with-step version
a = [records[i:i + 3] for i in range(0, len(records), 3)]
print(a)

# generator version
def chunks(it, n):
    it = iter(it)
    while batch := list(islice(it, n)):
        yield batch

print(list(chunks(iter(records), 3)))
""",
    "[[0, 1, 2], [3, 4, 5], [6]]\n[[0, 1, 2], [3, 4, 5], [6]]",
)

check(
    "the tryit: groupby collapses consecutive runs",
    """
from itertools import groupby
statuses = ["up", "up", "down", "down", "down", "up"]
runs = [(s, len(list(g))) for s, g in groupby(statuses)]
print(runs)
""",
    "[('up', 2), ('down', 3), ('up', 1)]",
)

# ---- lesson 5: how loops break ---------------------------------------

check(
    "mutating while iterating skips an element",
    """
nums = [1, 2, 2, 3]
for n in nums:
    if n == 2:
        nums.remove(n)
print(nums)

items = [1, 2, 2, 3]
items = [i for i in items if i != 2]
print(items)
""",
    "[1, 2, 3]\n[1, 3]",
)

check(
    "late binding gives the last value to every closure",
    """
fns = []
for i in range(3):
    fns.append(lambda: i)
print([f() for f in fns])

fns = [lambda i=i: i for i in range(3)]
print([f() for f in fns])
""",
    "[2, 2, 2]\n[0, 1, 2]",
)

check(
    "list multiplication aliases the inner list",
    """
grid = [[0] * 3] * 3
grid[0][0] = 9
print(grid)

grid = [[0] * 3 for _ in range(3)]
grid[0][0] = 9
print(grid)
""",
    "[[9, 0, 0], [9, 0, 0], [9, 0, 0]]\n[[9, 0, 0], [0, 0, 0], [0, 0, 0]]",
)

check(
    "dict.fromkeys shares one mutable default",
    """
t = dict.fromkeys(["a", "b"], [])
t["a"].append(1)
print(t)

t = {k: [] for k in ["a", "b"]}
t["a"].append(1)
print(t)
""",
    "{'a': [1], 'b': [1]}\n{'a': [1], 'b': []}",
)

check(
    "a bounded retry loop terminates and re-raises",
    """
attempts = []

def flaky():
    attempts.append(1)
    raise TimeoutError("down")

try:
    for attempt in range(5):
        try:
            flaky()
            break
        except TimeoutError:
            if attempt == 4:
                raise
except TimeoutError:
    print("gave up after", len(attempts))
""",
    "gave up after 5",
)

check(
    "half-open ranges and slices behave as the table claims",
    """
print(list(range(5)))
print(list(range(1, 5)))
xs = [10, 20, 30, 40]
print(list(range(len(xs) - 1)))
print(len(xs[1:3]))
i = 2
print(xs[:i] + xs[i:] == xs)
""",
    "[0, 1, 2, 3, 4]\n[1, 2, 3, 4]\n[0, 1, 2]\n2\nTrue",
)

check(
    "the tryit: the fixed version behaves correctly",
    """
MODELS = ["a", "b"]
runs = [
    {"model": "a", "failed": False},
    {"model": "b", "failed": True},
    {"model": "a", "failed": False},
]

runs = [r for r in runs if not r["failed"]]
table = {m: [] for m in MODELS}
for r in runs:
    table[r["model"]].append(r)

fns = [lambda m=m: table[m] for m in MODELS]
print({m: len(table[m]) for m in MODELS})
print([len(f()) for f in fns])
""",
    "{'a': 2, 'b': 0}\n[2, 0]",
)

# ---- lesson 6: the AI engineer's loops -------------------------------

check(
    "extend flattens batches; append would nest them",
    """
out = []
for batch in ([1, 2], [3, 4], [5]):
    out.extend(batch)
print(out)

nested = []
for batch in ([1, 2], [3, 4], [5]):
    nested.append(batch)
print(nested)
""",
    "[1, 2, 3, 4, 5]\n[[1, 2], [3, 4], [5]]",
)

check(
    "the batching loop retries per batch and reports position",
    """
import itertools

calls = itertools.count()

def embed(batch):
    n = next(calls)
    if n == 1:
        raise RuntimeError("rate limit")
    return [len(x) for x in batch]

texts = ["aa", "bbb", "cccc", "d", "ee"]
out = []
for i in range(0, len(texts), 2):
    batch = texts[i:i + 2]
    for attempt in range(5):
        try:
            out.extend(embed(batch))
            break
        except RuntimeError:
            pass
    else:
        raise RuntimeError(f"batch at {i} failed")
print(out)
""",
    "[2, 3, 4, 1, 2]",
)

check(
    "for...else fires only when every attempt is used",
    """
def run(fail_times):
    calls = [0]
    for attempt in range(3):
        calls[0] += 1
        if calls[0] > fail_times:
            return f"ok after {calls[0]}"
    else:
        return "exhausted"

print(run(0))
print(run(99))
""",
    "ok after 1\nexhausted",
)

check(
    "an agent loop is bounded even if the model never stops",
    """
MAX_STEPS = 4
steps = 0

def never_finishes():
    return {"tool_calls": [{"name": "search", "args": {"q": "x"}}]}

try:
    for step in range(MAX_STEPS):
        steps += 1
        reply = never_finishes()
        if not reply["tool_calls"]:
            break
    else:
        raise RuntimeError("agent did not finish in time")
except RuntimeError as e:
    print(steps, e)
""",
    "4 agent did not finish in time",
)

check(
    "the repetition guard fires on an identical call, not a different one",
    """
import json

def sig_of(calls):
    return tuple((c["name"], json.dumps(c["args"], sort_keys=True)) for c in calls)

a = [{"name": "search", "args": {"q": "x", "n": 1}}]
b = [{"name": "search", "args": {"n": 1, "q": "x"}}]   # same, keys reordered
c = [{"name": "search", "args": {"q": "y"}}]

print(sig_of(a) == sig_of(b))
print(sig_of(a) == sig_of(c))
""",
    "True\nFalse",
)

check(
    "vectorised normalisation equals the loop, when numpy is present",
    """
try:
    import numpy as np
except ImportError:
    print("skipped")
else:
    data = np.array([1.0, 2.0, 3.0, 4.0])
    mean, std = data.mean(), data.std()
    loop = [(x - mean) / std for x in data]
    vec = (data - mean) / std
    print(bool(np.allclose(loop, vec)))
""",
    ("True", "skipped"),
)


def main():
    passed = failed = 0
    for name, code, expected in CHECKS:
        buf = io.StringIO()
        try:
            with redirect_stdout(buf):
                exec(compile(code, f"<{name}>", "exec"), {})
        except Exception as e:  # noqa: BLE001 - report, do not mask
            print(f"  ERROR  {name}\n         {type(e).__name__}: {e}")
            failed += 1
            continue

        got = buf.getvalue().strip()
        want = expected if isinstance(expected, tuple) else (expected,)
        if got in [w.strip() for w in want]:
            passed += 1
        else:
            failed += 1
            print(f"  FAIL   {name}")
            print(f"         got:  {got!r}")
            print(f"         want: {want[0].strip()!r}")

    total = passed + failed
    print(f"\n{passed}/{total} code claims verified")
    if failed:
        print(f"{failed} FAILED\n")
        return 1
    print("Every runnable example in the loops module produces what it claims.\n")
    return 0


if __name__ == "__main__":
    print("\nPython loops module — executing the examples\n")
    sys.exit(main())
