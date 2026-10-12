import re
from pathlib import Path

lines = Path(r"C:\Users\HP\Documents\mathpivot-practice\src\lib\problemGenerator.ts").read_text(encoding="utf-8").split("\n")
pat = re.compile(r"(?<!\\)\\(quad|text|to|mathbb|Rightarrow|ln|lim)")
shown = 0
for i, l in enumerate(lines, 1):
    if pat.search(l):
        print(f"L{i}: {l.strip()[:170]}")
        shown += 1
        if shown >= 16:
            break
print("---")
# check which arrays these fall in by finding nearest preceding array header
headers = []
for i, l in enumerate(lines, 1):
    m = re.match(r"\s*(?:const|export const)\s+(\w+)\s*[:=]", l)
    if m:
        headers.append((i, m.group(1)))
for i, l in enumerate(lines, 1):
    if pat.search(l):
        hdr = max((h for h in headers if h[0] < i), default=None)
        print(f"L{i} in {hdr[1] if hdr else '?'}")
print("total headers:", len(headers))
