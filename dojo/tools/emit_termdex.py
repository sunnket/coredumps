# -*- coding: utf-8 -*-
"""Emit the verified problem bank as CoreDumps data files.

    python tools/emit_termdex.py

Writes ../../termdex/data/code/*.js, one file per batch, each registering its
problems through TD.addKata(). Runs the same verification as build.py first -
nothing reaches termdex that has not executed and passed its assertions.
"""
import io
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

import build  # noqa: E402  (same directory)

OUT_DIR = os.path.normpath(os.path.join(HERE, "..", "..", "termdex", "data", "code"))

# batch -> (filename, human blurb for the file header)
FILES = [
    ("probs_a", "01-arrays.js", "Arrays, hashing and matrix work."),
    ("probs_b", "02-pointers-search.js", "Two pointers, sliding window, stacks and binary search."),
    ("probs_c", "03-lists-trees.js", "Linked lists and binary trees."),
    ("probs_d", "04-graphs-backtracking.js", "Graphs, backtracking, heaps, intervals and tries."),
    ("probs_e", "05-dp-bits.js", "Dynamic programming, bit manipulation, maths and greedy."),
]

FIELD_ORDER = ["id", "title", "diff", "pattern", "companies", "freq", "statement",
               "examples", "constraints", "context", "hints", "approach", "time",
               "space", "solution", "tests", "harness"]

HEADER = '''/* Code Dojo — %s

   Every solution in this file has been executed and its assertions checked
   before it was written out; see dojo/tools/build.py. Do not hand-edit —
   regenerate with `python tools/emit_termdex.py` from the dojo folder.

   `solution` is the reference the blueprint traces. `context` is the code the
   reader is given rather than typing (a node class, say), and `harness` is the
   scaffolding the listed assertions call. */
(function (TD) {
  "use strict";

  TD.addKata([
'''


def js_value(value, indent):
    """JSON is valid JS here, and json.dumps handles every escape we need."""
    pad = " " * indent
    if isinstance(value, str):
        return json.dumps(value, ensure_ascii=False)
    if isinstance(value, (int, float)):
        return json.dumps(value)
    if isinstance(value, (list, tuple)):
        if not value:
            return "[]"
        if all(isinstance(v, str) and "\n" not in v and len(v) < 60 for v in value):
            inner = ", ".join(json.dumps(v, ensure_ascii=False) for v in value)
            if len(inner) <= 88:
                return "[" + inner + "]"
        parts = [pad + "  " + js_value(v, indent + 2) for v in value]
        return "[\n" + ",\n".join(parts) + "\n" + pad + "]"
    raise TypeError("unsupported value: %r" % (value,))


def emit(problems, blurb):
    out = [HEADER % blurb]
    blocks = []
    for p in problems:
        lines = ["    {"]
        for field in FIELD_ORDER:
            if field not in p or p[field] in (None, "", []):
                continue
            lines.append("      %s: %s," % (field, js_value(p[field], 6)))
        lines[-1] = lines[-1][:-1]  # drop the trailing comma
        lines.append("    }")
        blocks.append("\n".join(lines))
    out.append(",\n".join(blocks))
    out.append("\n  ]);\n})(window.TD);\n")
    return "".join(out)


def main():
    problems = build.load_all()
    errors = []
    for p in problems:
        build.check_schema(p, errors)
        build.run_tests(p, errors)
    if errors:
        print("refusing to emit - %d problem(s):" % len(errors))
        for e in errors[:10]:
            print(" * " + e)
        return 1

    if not os.path.isdir(OUT_DIR):
        os.makedirs(OUT_DIR)

    total = 0
    for module, filename, blurb in FILES:
        batch = [p for p in problems if p.get("_batch") == module]
        js = emit(batch, blurb)
        path = os.path.join(OUT_DIR, filename)
        with io.open(path, "w", encoding="utf-8", newline="\n") as f:
            f.write(js)
        total += len(batch)
        print("%-28s %3d problems  %6.1f KB" % (filename, len(batch), len(js) / 1024.0))

    print("\n%d problems written to %s" % (total, OUT_DIR))
    return 0


if __name__ == "__main__":
    sys.exit(main())
