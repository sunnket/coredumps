# -*- coding: utf-8 -*-
"""Validate every problem in the bank, run its tests, then emit problems.js.

Usage:
    python tools/build.py          # verify + write ../problems.js
    python tools/build.py --check  # verify only
"""
import importlib
import json
import os
import sys
import traceback

BATCHES = ["probs_a", "probs_b", "probs_c", "probs_d", "probs_e"]

REQUIRED = ["id", "title", "diff", "pattern", "companies", "freq", "statement",
            "examples", "constraints", "hints", "approach", "time", "space",
            "solution", "tests"]

# Helpers available to every test expression. Defined first; they resolve
# ListNode / TreeNode from the problem's own `context` at call time.
COMMON = '''
def _build_list(values):
    dummy = ListNode(0)
    tail = dummy
    for v in values:
        tail.next = ListNode(v)
        tail = tail.next
    return dummy.next


def _to_list(node):
    out = []
    while node:
        out.append(node.val)
        node = node.next
    return out


def _build_tree(values):
    if not values or values[0] is None:
        return None
    root = TreeNode(values[0])
    queue = [root]
    i = 1
    while queue and i < len(values):
        node = queue.pop(0)
        if i < len(values):
            v = values[i]
            i += 1
            if v is not None:
                node.left = TreeNode(v)
                queue.append(node.left)
        if i < len(values):
            v = values[i]
            i += 1
            if v is not None:
                node.right = TreeNode(v)
                queue.append(node.right)
    return root


def _tree_to_list(root):
    if not root:
        return []
    out = []
    queue = [root]
    while queue:
        node = queue.pop(0)
        if node is None:
            out.append(None)
        else:
            out.append(node.val)
            queue.append(node.left)
            queue.append(node.right)
    while out and out[-1] is None:
        out.pop()
    return out


def _find(root, val):
    if not root:
        return None
    if root.val == val:
        return root
    return _find(root.left, val) or _find(root.right, val)
'''

DIFFS = {"Easy", "Medium", "Hard"}

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "..", "problems.js")


def load_all():
    sys.path.insert(0, HERE)
    problems = []
    for name in BATCHES:
        try:
            mod = importlib.import_module(name)
        except ModuleNotFoundError:
            print("  (skipping missing batch %s)" % name)
            continue
        for p in mod.PROBLEMS:
            p["_batch"] = name          # which source file it came from
        problems.extend(mod.PROBLEMS)
    return problems


def check_schema(p, errors):
    for field in REQUIRED:
        if field not in p:
            errors.append("%s: missing field '%s'" % (p.get("id", "?"), field))
    if p.get("diff") not in DIFFS:
        errors.append("%s: bad difficulty %r" % (p.get("id"), p.get("diff")))
    if not isinstance(p.get("freq"), int) or not 1 <= p["freq"] <= 5:
        errors.append("%s: freq must be 1-5" % p.get("id"))
    for ex in p.get("examples", []):
        if not isinstance(ex, (list, tuple)) or len(ex) != 3:
            errors.append("%s: example must be (input, output, note)" % p.get("id"))
    if not p.get("tests"):
        errors.append("%s: no tests" % p.get("id"))
    sol = p.get("solution", "")
    if sol != sol.rstrip():
        errors.append("%s: solution has trailing whitespace" % p.get("id"))
    if "\t" in sol:
        errors.append("%s: solution contains a tab character" % p.get("id"))
    for i, line in enumerate(sol.split("\n"), 1):
        if line.rstrip() != line:
            errors.append("%s: trailing space on solution line %d" % (p.get("id"), i))


def run_tests(p, errors):
    """exec the solution, then assert every test expression is True."""
    ns = {}
    pieces = [COMMON, p.get("context", ""), p["solution"], p.get("harness", "")]
    source = "\n\n".join(piece for piece in pieces if piece)
    try:
        exec(compile(source, "<%s>" % p["id"], "exec"), ns)
    except Exception:
        errors.append("%s: solution failed to execute\n%s" % (p["id"], traceback.format_exc()))
        return
    for expr in p["tests"]:
        try:
            result = eval(expr, dict(ns))
        except Exception:
            errors.append("%s: test raised -> %s\n%s" % (p["id"], expr, traceback.format_exc()))
            continue
        if result is not True:
            errors.append("%s: test FAILED -> %s  (got %r)" % (p["id"], expr, result))


def main():
    problems = load_all()
    errors = []

    seen = set()
    for p in problems:
        if p.get("id") in seen:
            errors.append("duplicate id: %s" % p.get("id"))
        seen.add(p.get("id"))
        check_schema(p, errors)
        run_tests(p, errors)

    diffs = {}
    patterns = {}
    for p in problems:
        diffs[p.get("diff")] = diffs.get(p.get("diff"), 0) + 1
        patterns[p.get("pattern")] = patterns.get(p.get("pattern"), 0) + 1

    print("problems : %d" % len(problems))
    print("by diff  : %s" % ", ".join("%s %d" % kv for kv in sorted(diffs.items())))
    print("patterns : %d" % len(patterns))
    for k in sorted(patterns):
        print("   %-26s %d" % (k, patterns[k]))
    total_tests = sum(len(p.get("tests", [])) for p in problems)
    print("assertions ran: %d" % total_tests)

    if errors:
        print("\n=== %d PROBLEM(S) ===" % len(errors))
        for e in errors:
            print(" * " + e)
        return 1

    print("\nAll solutions execute and all assertions pass.")

    if "--check" not in sys.argv:
        payload = []
        for p in problems:
            q = dict(p)
            q.pop("_batch", None)
            q["examples"] = [list(e) for e in q["examples"]]
            payload.append(q)
        js = "window.PROBLEMS = " + json.dumps(payload, indent=1, ensure_ascii=False) + ";\n"
        with open(OUT, "w", encoding="utf-8", newline="\n") as f:
            f.write(js)
        print("wrote %s (%.1f KB)" % (os.path.normpath(OUT), len(js) / 1024.0))
    return 0


if __name__ == "__main__":
    sys.exit(main())
