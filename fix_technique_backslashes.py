"""Fix single backslashes in getTechniques() example strings in problemGenerator.ts.

Only touches lines matching `example: '...'` and doubles every backslash that
is not already part of a `\\` pair.
"""
import re
from pathlib import Path

path = Path(r"C:\Users\HP\Documents\mathpivot-practice\src\lib\problemGenerator.ts")
text = path.read_text(encoding="utf-8")
lines = text.split("\n")

changed = []
pattern = re.compile(r"^(\s*example:\s*)'(.*)'(,?)\s*$")
for i, line in enumerate(lines):
    m = pattern.match(line)
    if not m:
        continue
    prefix, content, suffix = m.groups()
    # Double any backslash not already part of a pair
    fixed = re.sub(r"(?<!\\)\\(?!\\)", r"\\\\", content)
    if fixed != content:
        lines[i] = f"{prefix}'{fixed}'{suffix}"
        changed.append((i + 1, content, fixed))

if changed:
    path.write_text("\n".join(lines), encoding="utf-8")

print(f"Changed {len(changed)} lines:")
for lineno, old, new in changed:
    print(f"  L{lineno}: {old!r}\n        -> {new!r}")
