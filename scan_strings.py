"""Properly scan a TS file for JS string literals containing unpaired backslashes
(intended LaTeX commands like \\quad written as single \\q...), and optionally fix.

A backslash is considered 'unpaired' if it is not preceded by another backslash
and is followed by a letter or { (i.e., a LaTeX command) — meaning the author
almost certainly wanted a literal backslash in the output.
Excludes \\' and \\" (quote escapes) and \\\\ (already paired).
"""
import re
import sys
from pathlib import Path

PATH = Path(r"C:\Users\HP\Documents\mathpivot-practice\src\lib\problemGenerator.ts")

def scan_and_fix(text, fix=False):
    out = []
    i = 0
    n = len(text)
    issues = []
    in_str = None  # quote char or None
    line = 1
    while i < n:
        c = text[i]
        if c == "\n":
            line += 1
        if in_str is None:
            out.append(c)
            if c in "'\"":
                in_str = c
            elif c == "/" and i + 1 < n and text[i + 1] == "/":
                # line comment: copy until newline
                j = text.find("\n", i)
                if j == -1:
                    j = n
                out.append(text[i + 1:j])
                line += text[i:j].count("\n")
                i = j - 1
            i += 1
            continue
        # inside string
        if c == "\\":
            nxt = text[i + 1] if i + 1 < n else ""
            prev = text[i - 1] if i > 0 else ""
            if prev == "\\":
                # this is the second char of an escape pair already handled;
                # copy verbatim (we copied first one last iteration)
                out.append(c)
                i += 1
                continue
            if nxt in "\\'\"":
                out.append(c)
                i += 1
                continue
            if nxt.isalpha() or nxt == "{":
                issues.append((line, "\\" + nxt))
                if fix:
                    out.append("\\\\")
                    i += 1
                    continue
                out.append(c)
                i += 1
                continue
            out.append(c)
            i += 1
            continue
        out.append(c)
        if c == in_str:
            in_str = None
        i += 1
    return "".join(out), issues

text = PATH.read_text(encoding="utf-8")
fix = "--fix" in sys.argv
new_text, issues = scan_and_fix(text, fix=fix)
from collections import Counter
counts = Counter(tok for _, tok in issues)
print(f"{len(issues)} unpaired backslash-letter sequences:")
for tok, cnt in counts.most_common():
    print(f"  {tok}  x{cnt}")
lines_with = sorted(set(l for l, _ in issues))
print(f"on {len(lines_with)} lines")
if fix and issues:
    PATH.write_text(new_text, encoding="utf-8")
    print("FIXED and written.")
