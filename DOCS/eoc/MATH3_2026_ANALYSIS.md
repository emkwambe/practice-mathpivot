# NC Math 3 EOC — 2026 Released Form Analysis

**Source:** `DOCS/released/NCMath3_Released2026.pdf` (41 pages, published August 2026; extracted text: `NCMath3_2026_text.txt`).
**Copyright guardrail:** NCDPI items are never copied. We build *original* items that match each released item's format, standard, DOK, and skill.

## 1. Item-Type Mix (from official answer key, Table 1)

| Type | Count | Items |
|---|---|---|
| MC (multiple choice) | 33 | 1–3, 6–8, 10–13, 16–19, 22, 24, 25, 28, 29, 31, 32, 35–37, 39–41, 45–50 |
| GR (gridded numeric response) | 13 | 4, 9, 14, 15, 20, 21, 26, 27, 33, 34, 38, 42, 43 |
| TD (targeted drop — build expression) | 1 | 5 |
| DD (drag & drop classification) | 1 | 23 |
| MS (multiselect — pick two) | 2 | 30, 44 |

**DOK mix:** DOK 1 ×12, DOK 2 ×34, DOK 3 ×4 (Q26, Q41, Q48, Q50) — same profile as Math 1 2026.
**MS note:** Math 3 introduces multiselect ("select the two…"). Phase 1 converts MS → MC variants ("which statement is true?"); a real MS UI is a possible later enhancement.

## 2. Standards Coverage (domain totals)

| Domain | Items | Count |
|---|---|---|
| Algebra (A-SSE, A-REI, A-APR, A-CED) | 1, 2, 6, 11–13, 15, 24, 26–28, 34–36, 40–42 | **17** |
| Functions (F-IF, F-BF, F-LE, F-TF) | 3–5, 7–10, 14, 16, 25, 29–33, 37–39 | **18** |
| Geometry (G-MG, G-CO, G-C, G-GPE, G-GMD) | 17–21, 43, 45–49 | **11** |
| Statistics (S-IC) | 22, 23, 44, 50 | **4** |

Geometry is much heavier than Math 1 (11 vs 5): circle theorems, quadrilateral properties, circle equations, arc length/radians, volume scaling. Statistics is pure S-IC (sampling methodology) — no S-ID data analysis on this form.

## 3. Item-by-Item Categorization

Category legend:
- **GEN** — generator-suitable: parameterize numbers/context, auto-check answer
- **VIS** — needs visual (SVG): graph/diagram is the stem or the choices (all buildable with our svg.ts approach)
- **STA** — static: fixed conceptual wording, randomization adds nothing

| # | Type | Standard | DOK | Skill | Cat |
|---|------|----------|-----|-------|-----|
| 1 | MC | A-SSE.2 | 1 | Factor difference of squares x² − c²y² | GEN |
| 2 | MC | A-REI.11 | 1 | Solve f(x) = g(x), linear vs rational | GEN |
| 3 | MC | F-IF.4 | 2 | Positive discontinuity of rational function (hole vs asymptote) | GEN |
| 4 | GR | F-IF.2 | 1 | Evaluate piecewise f(a) + f(b) | GEN |
| 5 | TD | F-BF.3 | 2 | Translate f(x) = 1/x up k, left h → build g(x) | GEN (TD→MC) |
| 6 | MC | A-APR.6 | 1 | Polynomial long division, no remainder | GEN |
| 7 | MC | F-IF.7 | 2 | Discontinuity of c / quadratic | GEN |
| 8 | MC | F-LE.4 | 2 | Exponential equation via logs, 4-decimal answer | GEN |
| 9 | GR | F-IF.7 | 1 | Sum of zeros of cubic (Vieta) | GEN |
| 10 | MC | F-BF.1.a | 2 | Identify exponential decay graph → function | **VIS** (graph stem) |
| 11 | MC | A-APR.2 | 2 | Factor theorem: f(a) = 0 → pick the factor | GEN |
| 12 | MC | A-CED.1 | 2 | Work-rate problem (two workers) | GEN |
| 13 | MC | A-APR.7.a | 2 | Subtract rational expressions (conjugate denominators) | GEN |
| 14 | GR | F-LE.4 | 2 | Solve a^(bx+c) = d via logs, 2 decimals | GEN |
| 15 | GR | A-REI.2 | 2 | Rational equation with factored denominators | GEN |
| 16 | MC | F-BF.4.c | 2 | Inverse of linear function (z-score context) | GEN |
| 17 | MC | G-MG.1 | 2 | Annulus (ring) area in terms of π | GEN |
| 18 | MC | G-MG.1 | 2 | Regular hexagon area → cost per unit area | GEN |
| 19 | MC | G-CO.14 | 2 | Rhombus perimeter from half-diagonals | GEN |
| 20 | GR | G-C.2 | 2 | Minor arc measure from inscribed-angle diagram | **VIS** (circle diagram) |
| 21 | GR | G-GPE.1 | 2 | Radius from circle equation (complete the square) | GEN |
| 22 | MC | S-IC.5 | 2 | Paired-difference experiment → valid conclusion (chart) | **VIS** (chart stem) |
| 23 | DD | S-IC.1 | 1 | Classify population vs sample | GEN (DD→MC) |
| 24 | MC | A-SSE.1.a | 1 | Interpret a(1+r)^t: initial value / rate | GEN |
| 25 | MC | F-TF.1 | 2 | Arc length → central angle in radians | GEN |
| 26 | GR | A-CED.1 | 3 | Average-cost break-even inequality (coffee maker) | GEN |
| 27 | GR | A-REI.2 | 1 | Rational proportion a = (x+b)/(cx−d) | GEN |
| 28 | MC | A-APR.2 | 2 | Cubic with factor (x−r) → find k | GEN |
| 29 | MC | F-IF.2 | 1 | Evaluate piecewise at negative value | GEN |
| 30 | MS | F-IF.7 | 1 | Cubic end behavior + relative extrema (pick 2 true) | GEN (MS→MC) |
| 31 | MC | F-BF.3 | 1 | Translate y = \|x\| right h, down k | GEN |
| 32 | MC | F-BF.1.a | 2 | Identify quartic from graph | **VIS** (graph stem) |
| 33 | GR | F-LE.4 | 2 | Solve a^(x+c) = d via logs, 2 decimals | GEN |
| 34 | GR | A-REI.11 | 2 | Intersection y-value: rational ∩ quadratic | GEN |
| 35 | MC | A-APR.6 | 2 | Polynomial division with remainder | GEN |
| 36 | MC | A-APR.7.a | 2 | Rational expression simplification with factoring | GEN |
| 37 | MC | F-LE.3 | 1 | Greatest rate of change: linear vs quad vs cubic vs exp | GEN |
| 38 | GR | F-IF.2 | 2 | f(a) + 2f(b) − f(c) from piecewise-linear graph | **VIS** (graph stem) |
| 39 | MC | F-BF.1.a | 2 | Build quartic from zeros (incl. double zero) | GEN |
| 40 | MC | A-CED.2 | 2 | Open-top box volume polynomial | GEN |
| 41 | MC | A-SSE.3 | 3 | Yearly tripling → weekly growth base | GEN |
| 42 | GR | A-APR.3 | 2 | Find b given factor (x−5) and zero at 6 | GEN |
| 43 | GR | G-C.2 | 2 | Angle measure from circle diagram | **VIS** (circle diagram) |
| 44 | MS | S-IC.1 | 2 | Identify random sampling procedures (pick 2) | GEN (MS→MC) |
| 45 | MC | G-GPE.1 | 2 | Circle equation from diameter endpoints | GEN |
| 46 | MC | G-CO.14 | 2 | Circumcenter geometry → solve for x | GEN |
| 47 | MC | G-C.5 | 1 | Arc length → central angle in degrees | GEN |
| 48 | MC | G-GMD.3 | 3 | Volume tripled → side-length scale factor (∛3) | GEN |
| 49 | MC | G-CO.14 | 2 | Rectangle diagonals bisect → find segment | GEN |
| 50 | MC | S-IC.3 | 3 | Choose the unbiased sampling procedure | GEN |

## 4. Verdict

| Category | Count | Items |
|---|---|---|
| **Generator-suitable** | **44** | everything except 10, 20, 22, 32, 38, 43 |
| **Needs visual (SVG)** | **6** | 10 (exponential graph), 20 + 43 (circle diagrams), 22 (data chart), 32 (quartic graph), 38 (piecewise-linear graph) |
| **Static** | **0** | — |

Same story as Math 1: 88% pure parameterization. The 6 visual items are all SVG-generatable — exponential/quartic/piecewise curves are computed polylines (we evaluate the function and draw the path), circle diagrams are arcs + angles, and the S-IC.5 chart is a small bar/dot chart. All reuse the `stemSvg`/`svgChoices` schema built for Math 1.

## 5. Generator Module Map (Math 3)

Proposed technique grouping for subject `math3-eoc` (6 techniques + mixed):

| Technique | Modules | Items covered |
|---|---|---|
| `m3-polynomials` | factor a²−b² forms; long division (no remainder / with remainder); Vieta sum of zeros; factor theorem (find k / pick factor / build quartic from zeros); box volume model | 1, 6, 9, 11, 28, 35, 39, 40, 42 |
| `m3-rational-expressions` | discontinuity (hole/asymptote); add/subtract rational expressions; rational equations; f(x) = g(x) with rational; intersection y-value | 2, 3, 7, 13, 15, 27, 34, 36 |
| `m3-exponential-logs` | solve a^(bx+c) = d via logs (MC 4-decimal + GR 2-decimal); interpret a(1+r)^t; yearly→weekly base conversion; rate-of-change comparison; exponential graph identification (VIS) | 8, 10, 14, 24, 33, 37, 41 |
| `m3-functions-transformations` | translations of 1/x and \|x\| (TD→MC); inverse of linear; piecewise evaluation (GR + MC); cubic end behavior/extrema (MS→MC); quartic graph identification (VIS); graph-reading arithmetic (VIS) | 4, 5, 16, 29, 30, 31, 32, 38 |
| `m3-geometry` | annulus & hexagon area; rhombus/rectangle diagonal properties; circumcenter; circle equations (radius GR, from diameter MC); arc ↔ angle in degrees & radians; inscribed-angle diagrams (VIS); volume scale factor | 17–21, 25, 43, 45–49 |
| `m3-statistics` | population vs sample (DD→MC); random-sample procedures (MS→MC + MC); paired-difference conclusion with chart (VIS) | 22, 23, 44, 50 |

Estimated factories: ~26 GEN modules + 4 SVG sub-generators (curve plotter, circle diagram, bar chart) ≈ 30 factories — smaller than Math 1 because several modules share parameterization patterns.

## 6. Conversion Notes (DD/TD/MS → MC)

- **Q5-style TD** (build g(x) from translation): becomes MC "Which function is g(x)?" with 4 transformed-expression choices.
- **Q23-style DD** (population/sample): becomes MC "Which option lists a population and a matching sample correctly?" — 4 paired statements.
- **Q30-style MS** (two true statements about a cubic): becomes MC "Which statement about f(x) = … is true?" — rotate which property is asked.
- **Q44-style MS** (two valid random samples): becomes MC "Which procedure would produce a random sample?" with 3 biased + 1 unbiased options.

## 7. What's Reused From Math 1 Infrastructure

- `stemSvg` / `svgChoices` schema fields and rendering (Generator, Practice, Worksheets) — done
- MC/GR item types + gridded input + answer checker identity fast-path — done
- Course registry: add `{ id: 'math3-eoc', name: 'Math 3 EOC', subjects: ['math3-eoc'] }` — one line
- SVG approach: computed-polyline function plotter generalizes the inequality-graph builder

## 8. Forms Status

Math 3 2026 ✅ (this document). Still needed for the full EOC/EOG pipeline: Math 1 second form, Math 3 second form, Math 6/7/8 EOG ×2 each.
