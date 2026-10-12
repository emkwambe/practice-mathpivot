# Independent Audit Prompt — give this + a `*_worksheet.md` to the reviewing model

You are an independent math reviewer auditing an auto-generated practice worksheet.
The worksheet's answer key is HIDDEN from you on purpose.

## Your task

1. Solve every item **from scratch**, as a careful student would. Do not assume the
   worksheet is correct.
2. For MC items: give the letter AND the value/expression you computed.
3. For GR/FR items: give your final answer in the simplest exact form
   (fraction preferred over rounded decimal unless the item says otherwise).
4. If an item is ambiguous, ill-posed, has no correct choice, or has MORE than one
   correct choice, flag it in `"flags"` with a one-line reason.
5. For figure items (choices shown as figures/SVG descriptions): if the figure
   description is insufficient to solve, flag it as `"figure-unclear"`.

## Output format — end your reply with EXACTLY one fenced JSON block:

```json
{
  "answers": [
    { "n": 1, "letter": "B", "value": "12", "flags": [] },
    { "n": 2, "letter": null, "value": "3/4", "flags": ["ambiguous units"] }
  ]
}
```

Rules:
- One entry per question number, in order.
- `letter` is null for GR/FR items; `value` is always required.
- Do not include worked solutions in the JSON — just answers and flags.
- If you cannot solve an item, set `"value": null` and add flag `"unsolvable"`.
