# -*- coding: utf-8 -*-
"""Inline styles.css, problems.js and app.js into a single distributable page.

    python tools/bundle.py

Writes dist/blueprint-dojo.html (a standalone file) and dist/artifact.html
(the same page without the <!doctype>/<html>/<head>/<body> wrapper, which the
Artifact publisher supplies itself).
"""
import io
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, "..")
DIST = os.path.join(ROOT, "dist")


def read(name):
    with io.open(os.path.join(ROOT, name), encoding="utf-8") as f:
        return f.read()


def main():
    html = read("index.html")
    css = read("styles.css")
    problems = read("problems.js")
    app = read("app.js")

    html = html.replace(
        '<link rel="stylesheet" href="styles.css">',
        "<style>\n" + css + "\n</style>",
    )
    html = html.replace(
        '<script src="problems.js"></script>\n<script src="app.js"></script>',
        "<script>\n" + problems + "\n</script>\n<script>\n" + app + "\n</script>",
    )

    if "styles.css" in html or 'src="app.js"' in html:
        raise SystemExit("inlining failed - check the placeholders in index.html")

    if not os.path.isdir(DIST):
        os.mkdir(DIST)

    standalone = os.path.join(DIST, "blueprint-dojo.html")
    with io.open(standalone, "w", encoding="utf-8", newline="\n") as f:
        f.write(html)

    # Artifact bodies are wrapped by the publisher: keep <title> and the fonts
    # link (both are hoisted into the supplied <head>), drop the outer skeleton.
    body = html
    body = re.sub(r"^<!DOCTYPE html>\s*<html[^>]*>\s*<head>\s*", "", body, flags=re.I)
    body = body.replace('<meta charset="utf-8">\n', "")
    body = body.replace('<meta name="viewport" content="width=device-width, initial-scale=1">\n', "")
    body = re.sub(r"</head>\s*<body>\s*", "", body, flags=re.I)
    body = re.sub(r"\s*</body>\s*</html>\s*$", "\n", body, flags=re.I)

    artifact = os.path.join(DIST, "artifact.html")
    with io.open(artifact, "w", encoding="utf-8", newline="\n") as f:
        f.write(body)

    for path in (standalone, artifact):
        print("%-34s %6.1f KB" % (os.path.basename(path), os.path.getsize(path) / 1024.0))


if __name__ == "__main__":
    main()
