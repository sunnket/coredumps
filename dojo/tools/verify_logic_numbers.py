"""Check the numeric claims made by Logic Vault cards.

The cards assert specific figures -- log2(1,000,000) is about 20, a 7B model
in fp16 is about 14 GB, a 99%-accurate test for a 1-in-1000 disease is right
about 9% of the time. Those are the claims a reader will repeat in an
interview, so a wrong one is worse than no card at all.

Anything derivable is derived here and compared against what the card says.

    python tools/verify_logic_numbers.py
"""

import math
import sys

CHECKS = []


def check(name, got, want, tol=0.05):
    """tol is a relative tolerance -- the cards say 'about', and mean it."""
    CHECKS.append((name, got, want, tol))


# ---- the growth table (complexity / bigo-core) ------------------------

check("log2(1,000) is ~10", math.log2(1_000), 10)
check("log2(1,000,000) is ~20", math.log2(1_000_000), 20)
check("log2(1,000,000,000) is ~30", math.log2(1_000_000_000), 30)

# The card claims a million-item binary search is ~20 comparisons.
check("binary search over 1e6 is ~20 steps", math.ceil(math.log2(1_000_000)), 20)

# The card claims sorting a million items is "roughly 20 million operations".
check("n log n at n=1e6 is ~2e7", 1_000_000 * math.log2(1_000_000), 2e7, tol=0.10)

# ---- operation budgets (complexity / bigo-core) ----------------------

# "n = 100,000 needs n log n": the card's claim is that n^2 is not viable
# there but n log n is. Check both sides of that against the stated budget
# of ~1e8 simple operations per second in a compiled language.
check("n^2 at n=1e5 exceeds a 1e8 budget", (100_000 ** 2) / 1e8, 100, tol=0.01)
check("n log n at n=1e5 is trivial", (100_000 * math.log2(100_000)) / 1e8, 0.017, tol=0.10)

# ---- Little's Law (complexity / latency) -----------------------------

LAMBDA, W = 100, 0.2
check("L = lambda x W gives 20 concurrent", LAMBDA * W, 20)

# ---- latency ladder (complexity / latency) ---------------------------

# The card's claim is that each step up the ladder is "roughly 1000x".
check("memory to SSD is ~1000x", 100e-6 / 100e-9, 1000)
check("L1 to main memory is ~100x", 100e-9 / 1e-9, 100)

# The N+1 claim: ten sequential 5 ms calls versus one.
check("10 sequential 5ms calls is 50ms", 10 * 5, 50)

# ---- Bayes (math / math-working) -------------------------------------

def posterior(prevalence, sensitivity, specificity):
    tp = sensitivity * prevalence
    fp = (1 - specificity) * (1 - prevalence)
    return tp / (tp + fp)

# The card: 1-in-1000 disease, 99% accurate test, "~9%" chance of being sick
# given a positive result.
check("P(sick | positive) is ~9%", posterior(0.001, 0.99, 0.99) * 100, 9, tol=0.05)

# ---- the normal distribution (math / math-working) -------------------

def within(sigmas):
    return math.erf(sigmas / math.sqrt(2)) * 100

check("1 sigma covers ~68%", within(1), 68, tol=0.01)
check("2 sigma covers ~95%", within(2), 95, tol=0.01)
check("3 sigma covers ~99.7%", within(3), 99.7, tol=0.01)

# ---- matrix shapes (math / math-working) -----------------------------

# (32, 768) x (768, 10) -> (32, 10). Verified structurally rather than
# numerically: the inner dimensions must match and disappear.
def matmul_shape(a, b):
    assert a[1] == b[0], f"inner dims {a[1]} != {b[0]}"
    return (a[0], b[1])

check("(32,768) x (768,10) gives 32 rows", matmul_shape((32, 768), (768, 10))[0], 32)
check("(32,768) x (768,10) gives 10 cols", matmul_shape((32, 768), (768, 10))[1], 10)

# ---- model memory (dl / dl-core) -------------------------------------

PARAMS_7B = 7e9

def gb(params, bytes_per_param):
    return params * bytes_per_param / 1e9

check("7B in fp16 is ~14 GB", gb(PARAMS_7B, 2), 14)
check("7B in fp32 is ~28 GB", gb(PARAMS_7B, 4), 28)
check("7B at 4-bit is ~3.5 GB", gb(PARAMS_7B, 0.5), 3.5)

# Training with Adam in fp32: 4 bytes params + 4 gradients + 8 optimiser
# state (two moments) = 16 bytes per parameter. The card says ~112 GB.
check("7B fp32 training with Adam is ~112 GB", gb(PARAMS_7B, 16), 112)

# The card's "training needs about 4x inference memory" claim.
check("training is ~4x inference memory", gb(PARAMS_7B, 16) / gb(PARAMS_7B, 4), 4)

# ---- attention cost (dl / dl-core) -----------------------------------

# "Doubling context quadruples attention cost."
check("doubling n quadruples n^2", (2 ** 2) / (1 ** 2), 4)

# ---- tokens (aieng / tokens-context) ---------------------------------

# "1,000 tokens is about 750 words", from ~0.75 words per token.
check("1000 tokens is ~750 words", 1000 * 0.75, 750)
# "roughly 4 characters" per token, consistent with 0.75 words at ~5.3 chars
# per English word including the trailing space.
check("4 chars/token implies ~0.75 words/token", 4 / 5.3, 0.75, tol=0.06)

# ---- hyperparameter grid (referenced in the loops module too) --------

check("2 x 3 x 2 grid is 12 runs", 2 * 3 * 2, 12)

# ---- classification metrics (ml / ml-core) ---------------------------

def precision(tp, fp):
    return tp / (tp + fp)

def recall(tp, fn):
    return tp / (tp + fn)

def f1(p, r):
    return 2 * p * r / (p + r)

P, R = precision(80, 20), recall(80, 40)
check("precision 80/(80+20) is 0.8", P, 0.8)
check("recall 80/(80+40) is ~0.667", R, 2 / 3)
check("F1 is the harmonic mean", f1(P, R), 2 * P * R / (P + R), tol=1e-9)

# The imbalanced-data claim: at 1% positives, always predicting negative
# scores 99% accuracy.
check("always-negative scores 99% at 1% positives", (1 - 0.01) * 100, 99)


def main():
    passed = failed = 0
    for name, got, want, tol in CHECKS:
        if want == 0:
            close = abs(got) <= tol
        else:
            close = abs(got - want) / abs(want) <= tol
        if close:
            passed += 1
        else:
            failed += 1
            print(f"  FAIL   {name}")
            print(f"         computed {got!r}, card claims {want!r} (tol {tol:.0%})")

    total = passed + failed
    print(f"\n{passed}/{total} numeric claims verified")
    if failed:
        print(f"{failed} FAILED\n")
        return 1
    print("Every derivable number in the Logic Vault checks out.\n")
    return 0


if __name__ == "__main__":
    print("\nLogic Vault — checking the numbers\n")
    sys.exit(main())
