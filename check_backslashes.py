import re
from pathlib import Path

text = Path(r"C:\Users\HP\Documents\mathpivot-practice\src\lib\problemGenerator.ts").read_text(encoding="utf-8")
bad = []
unpaired = re.compile(r"(?<!\\)\\(?!\\)")
for m in re.finditer(r"'([^'\n]*)'", text):
    if unpaired.search(m.group(1)):
        bad.append(("single", m.group(1)))
for m in re.finditer(r'"([^"\n]*)"', text):
    if unpaired.search(m.group(1)):
        bad.append(("double", m.group(1)))
print(f"{len(bad)} strings with unpaired backslash")
for kind, s in bad[:20]:
    print(kind, repr(s))
