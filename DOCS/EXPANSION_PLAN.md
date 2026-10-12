# MathPivot Expansion Plan

## Product Vision

```
practice.mathpivot.com
├── /calculus/                # $12/mo or $19 pack
│   ├── limits
│   ├── differentiation
│   ├── applications-of-derivatives      [PHASE 2]
│   ├── integration
│   ├── applications-of-integration      [PHASE 2]
│   ├── differential-equations           [PHASE 3]
│   └── sequences-and-series             [PHASE 3]
│
├── /math1-eoc/               # $19 one-time pack  [PHASE 4]
│   ├── algebra
│   ├── functions
│   ├── geometry
│   └── statistics
│
├── /math3-eoc/               # $19 one-time pack  [PHASE 4]
│   ├── advanced-algebra
│   ├── trigonometry
│   ├── functions
│   └── statistics
│
└── / (landing page)          # Free marketing page
```

---

## Phase 1: Deploy Calculus Practice (CURRENT)

**Status:** Code complete, needs deployment
**Revenue:** $12/mo subscription + $19 one-time course pack
**Timeline:** 1-2 days (deployment + Stripe setup)

### What's Included
- Integration (8 techniques, 72 problems)
- Differentiation (8 techniques, 72 problems)
- Limits (8 techniques, 72 problems)
- Plain-text answer input with KaTeX preview
- math.js hybrid answer checker
- Printable worksheets
- Practice mode with scoring & streaks
- Clerk auth (Google + Email)
- Progress persistence (PostgreSQL)

### Stripe Products to Create

| Product | Type | Price | ID Env Var |
|---------|------|-------|------------|
| Calculus Practice Monthly | Recurring | $12/mo | `STRIPE_PRICE_MONTHLY` |
| Calculus Complete Pack | One-time | $19 | `STRIPE_PRICE_CALCULUS_PACK` |

### Revenue Model

```
Target: 100 paying users
  → 70 monthly ($12 × 70 = $840/mo)
  → 30 one-time ($19 × 30 = $570 one-time)
  → Monthly recurring: $840
  → Annual recurring: $10,080

Target: 1,000 paying users
  → Monthly recurring: ~$8,400
  → Annual recurring: ~$100,800
```

---

## Phase 2: Applications Topics (Months 1-2)

### Applications of Derivatives

**Status: ✅ COMPLETE (2026-09-30)** — 8 techniques, 63 problems with steps & hints, wired into Generator, Practice, Worksheets, Learn guide, MathPalette, and teacher assignment UI. Validated via strict KaTeX render + answer-checker round-trip + headless browser tests.

| Technique | Easy | Medium | Hard | Problem Types |
|-----------|------|--------|------|---------------|
| Optimization | 3 | 3 | 3 | Max area, min cost, max volume |
| Related Rates | 3 | 3 | 3 | Ladder, cone filling, shadow |
| Curve Sketching | 3 | 3 | 3 | Find intervals, asymptotes, critical points |
| Mean Value Theorem | 3 | 3 | 3 | Find c, prove inequalities |
| Linear Approximation | 3 | 3 | 3 | Estimate values using tangent lines |
| Motion (Position/Velocity) | 3 | 3 | 3 | Particle motion, projectile problems |
| Economics (Marginal Cost) | 3 | 3 | 3 | Cost/revenue/profit optimization |
| Mixed Applications | — | — | — | Random selection |

**Content Strategy:** These are word problems with context. Students need to extract the mathematical model before solving. This is where the plain-text input shines — answers are often numerical (`200 m²`) or simple expressions.

### Applications of Integration

**Status: ✅ COMPLETE (2026-10-01)** — 7 techniques + mixed, 63 problems with steps & hints, wired into Generator, Practice, Worksheets, Learn guide, MathPalette (with new definite-integral suggested button), and teacher assignment UI. Validated via strict KaTeX render + answer-checker round-trip + headless browser tests (all green, zero console errors).

| Technique | Easy | Medium | Hard | Problem Types |
|-----------|------|--------|------|---------------|
| Area Between Curves | 3 | 3 | 3 | Two functions, vertical/horizontal slices |
| Volumes of Revolution | 3 | 3 | 3 | Disk, washer, shell methods |
| Arc Length | 3 | 3 | 3 | Formula application |
| Surface Area | 3 | 3 | 3 | Revolution surface area |
| Work & Physics | 3 | 3 | 3 | Spring, pumping, lifting |
| Center of Mass | 3 | 3 | 3 | Moments, centroids |
| Probability / Averages | 3 | 3 | 3 | Mean value, probability density |
| Mixed Applications | — | — | — | Random selection |

**Implementation Effort:** ~200 lines per technique (problem data) + ~100 lines (Learn page theory)

---

## Phase 3: Advanced Topics (Months 2-4)

### Differential Equations

**Status: ✅ COMPLETE (2026-10-01)** — 8 techniques + mixed, 72 problems with steps & hints, wired into Generator, Practice, Worksheets, Learn guide, MathPalette, and teacher assignment UI. Answers avoid arbitrary constants (IVPs, particular solutions, point evaluations) so the checker verifies them. Validated via strict KaTeX render + answer-checker round-trip + headless browser tests (all green, zero console errors).

**Also shipped this session:** major answer-checker fix — the LaTeX→mathjs converter rewrote `^` as `**` (which mathjs cannot parse), so every exponent-containing answer across ALL subjects silently failed evaluation. Rebuilt the converter (balanced-brace `\frac`/`\sqrt`, `ln|x|` space forms, `tan^2 x` power forms, implicit multiplication, `+C` constants, two-variable `y` answers, identities with `=`) and regression-tested all 3,960 generated problems: 0 failures.

| Technique | Easy | Medium | Hard |
|-----------|------|--------|------|
| Separable Equations | 3 | 3 | 3 |
| Linear First-Order | 3 | 3 | 3 |
| Homogeneous Equations | 3 | 3 | 3 |
| Exact Equations | 3 | 3 | 3 |
| Second-Order Constant Coefficients | 3 | 3 | 3 |
| Undetermined Coefficients | 3 | 3 | 3 |
| Variation of Parameters | 3 | 3 | 3 |
| Laplace Transforms | 3 | 3 | 3 |

**Target Audience:** Engineering students, higher ed. Higher willingness to pay ($19-29).

### Sequences & Series

**Status: ✅ COMPLETE (2026-10-01)** — 8 techniques + mixed, 72 problems with steps & hints, wired into Generator, Practice, Worksheets, Learn guide (8 worked-example sections), MathPalette (summation / (-1)^n / ∞ tab), and teacher assignment UI. Categorical answers (`convergent`, `divergent`, `conditionally convergent`, `inconclusive`) round-trip through the hybrid checker's text normalization; numeric answers use numeric comparison. Validated via strict KaTeX render + answer-checker round-trip (72/72) + full regression (4,680 problems, 0 failures) + headless browser tests (all green, zero console errors). **Phase 3 is now fully complete.**

| Technique | Easy | Medium | Hard |
|-----------|------|--------|------|
| Geometric Series | 3 | 3 | 3 |
| p-Series & Telescoping | 3 | 3 | 3 |
| Divergence Test | 3 | 3 | 3 |
| Ratio Test | 3 | 3 | 3 |
| Root Test | 3 | 3 | 3 |
| Comparison Tests | 3 | 3 | 3 |
| Alternating Series | 3 | 3 | 3 |
| Power Series / Taylor-Maclaurin | 3 | 3 | 3 |

**Unique Challenge:** Answers are often categorical ("convergent", "divergent", "conditionally convergent") or involve radius of convergence (`R = 3`). The hybrid checker handles this perfectly via text synonym mapping.

**Decision Tree Feature:** Series & Series is the perfect topic for a "Which test should I use?" decision tree — a premium feature for paid users.

---

## Phase 4: EOC Prep Products (Months 4-6)

**Status: ✅ COMPLETE (2026-10-11)** — pipeline defined; **`math1-eoc` + `math3-eoc` shipped 2026-10-01** (all 50 item formats each, headless-tested); **`math7-eog` + `math8-eog` + `math6-eog` shipped 2026-10-11** (all 45 item formats each, headless-tested). All five EOC/EOG courses live. Second released forms for G6/G7/G8 remain nice-to-have if NCDPI publishes them.

**Analysis pipeline (per course):** collect 2 NCDPI released forms → item-by-item categorization (Generator-suitable / Static / Visual-SVG) → build generators for GEN items, SVG sub-generators for VIS items, static bank for STA items → original items only, exact released format, never copied content (NCDPI copyright).

**Math 1 2026 form findings** (full table: `DOCS/eoc/MATH1_2026_ANALYSIS.md`):
- 50 items: 29 MC + 16 gridded response + 3 drag-drop + 2 targeted-drop; DOK 1×12 / 2×34 / 3×4
- Domains: Algebra 19, Functions 17, Statistics 9, Geometry 5
- **48 of 50 generator-suitable**, 2 need SVG visuals (inequality graph choices Q1-style, dot-pattern Q42-style), 0 static
- Mapped to 7 generator techniques + Mixed for subject `math1-eoc`
- **Shipped 2026-10-01:** 40 procedural factories (`src/lib/problems/math1/`, unlimited seeded variants) covering **all 50 released item formats** — including the 2 visual-SVG types (`visual.ts` + `svg.ts`: inequality-graph MC choices with solid/dashed + shading distractors, and dot-pattern → nth-term function with figure SVGs). MC choice cards + GR numeric input + context prose + SVG stems/choices in Generator / Practice / Worksheets; DD/TD released item types converted to MC variants (see analysis §6). Validated: tsc clean, 2,400-seed generator validation 0 failures (incl. MC checker round-trip guard), full-bank regression 4,680 problems 0 failures, headless-browser test green, visual items screenshot-verified end-to-end (correct choice accepted, stats increment).
- Bug fix 2026-10-01: `checkAnswer` identity fast-path — MC choices that are systems of equations (two `=`) previously failed the single-equation symbolic pipeline even when the clicked choice was verbatim correct.
- **Course demarcation shipped 2026-10-01:** `src/lib/courses.ts` course registry (Calculus = 7 calculus subjects; Math 1 EOC + Math 3 EOC standalone) + shared `CourseSubjectPicker` (course dropdown → subject pills, single-subject courses auto-select) wired into Generator / Worksheets / Practice setup; ClassDetail assignment form shows full course names. `MIXED_TECHNIQUE` map routes each subject's mixed key in Practice / Worksheets / SetupScreen.

**Forms collected:** Math 1 ✅ 2026 + 2019, Math 3 ✅ 2026 + 2019 (+2018), Grade 6 ✅ 2026, Grade 7 ✅ 2026, Grade 8 ✅ 2026 — **at least one form for every course** (`DOCS/released/` holds the full drop incl. Grades 3–4 for future use). Test specifications PDF collected ✅ (`DOCS/eoc/eog_test_specifications.pdf`). Second distinct forms for G6/G7/G8 remain nice-to-have for style cross-checking, not blockers.

**`math7-eog` subject shipped 2026-10-11:** 36 procedural factories (`src/lib/problems/math7/`: ratios ×10, expressions ×10, numbers ×4, geometry ×7, statistics ×6, probability ×5) covering all 45 released item formats, incl. 8 SVG families (`svg.ts`: boxPlot, lineGraph, angleSplit, perpendicular, spinner, sector, rectAngle, prism — screenshot-verified in `m7_svg_gallery.png`). Full wiring: courses.ts registry ("Math 7 EOG"), MathPalette tab, TechniqueBadge/ResultsScreen names, Worksheets+Practice defaultTechs branches, ClassDetail. Validated: tsc clean, 2,100-seed validation 0 failures, full-bank regression 6,390 problems 0 failures (regression_all_banks.ts now sweeps EOC/EOG subjects too), headless browser test green (course picker, MC feedback, practice session, worksheet with choice letters), raw-LaTeX leak probe clean. Fixes along the way: `mcUnique` distractor-collision guards (distractor pools + top-up fallback) in all six factory files; context prose must be plain text — no `\frac`/`\$` (context paragraphs render as plain text, not KaTeX); lineGraph tick-label float artifacts fixed; sector arc sweep flag.

**Grade 7 2026 form findings** (full table: `DOCS/eoc/MATH7_2026_ANALYSIS.md`):
- 45 items: 36 MC + 9 GR — no DD/TD/MS technology-enhanced items (simpler than EOC); DOK 1×14 / 2×27 / 3×4
- Domains: RP 12, SP 11, EE 10, G 7, NS 5
- **33 GEN + 12 VIS + 0 static**; 8 new SVG types (box plots, proportional line graph ×4, table+graph, angle-split, perpendicular lines, spinner pair, circle sector, rectangle angle chase, isometric prism)
- Mapped to 6 techniques + `mixed-g7` for subject `math7-eog`: `g7-ratios-proportions`, `g7-expressions-equations`, `g7-numbers-operations`, `g7-geometry`, `g7-statistics`, `g7-probability`

**Grade 8 2026 form findings** (full table: `DOCS/eoc/MATH8_2026_ANALYSIS.md`):
- 45 items: 35 MC + 10 GR — same no-technology-enhanced profile as G7
- Domains: 8.F 14, 8.G 12, 8.EE 10, 8.SP 7, 8.NS 2
- **35 GEN + 10 VIS + 0 static**; 6 new SVG types (mini scatterplots association-ID ×3, not-a-function graph choices, coordinate-plane polygons ×3, parallel-lines+transversal, triangle exterior angle, qualitative distance-time graphs)
- Mapped to 5 techniques + `mixed-g8` for subject `math8-eog`: `g8-functions`, `g8-expressions-equations`, `g8-geometry`, `g8-statistics-probability`, `g8-number-system`

**Math 3 2026 form findings** (full table: `DOCS/eoc/MATH3_2026_ANALYSIS.md`):
- 50 items: 33 MC + 13 GR + 1 TD + 1 DD + 2 MS (multiselect — new vs Math 1); DOK 1×12 / 2×34 / 3×4 (same profile as Math 1)
- Domains: Algebra 17, Functions 18, Geometry 11 (much heavier than Math 1 — circle theorems, quadrilaterals, arc/radians, volume scaling), Statistics 4 (pure S-IC sampling)
- **44 of 50 generator-suitable**, 6 visual-SVG (exp/quartic/piecewise graph stems Q10/32/38, circle diagrams Q20/43, data chart Q22) — all buildable as computed SVGs via the `stemSvg`/`svgChoices` schema shipped with Math 1
- Mapped to 6 generator techniques + mixed for subject `math3-eoc`; MS items convert to MC variants in phase 1
- **Shipped 2026-10-01:** 43 procedural factories (`src/lib/problems/math3/`, unlimited seeded variants) covering **all 50 released item formats** — Polynomials ×9, Rational Expressions ×8, Exponentials & Logs ×6, Functions & Transformations ×8, Geometry ×12, Statistics ×4 — including all 6 visual-SVG types (`svg.ts`: computed function-plot stems with asymptote breaks, circle diagrams with labeled points/central-inscribed angles, bar-chart data stems; graph-ID items use `svgChoices`). MC choice cards + GR numeric input wired through Generator / Practice / Worksheets; TD/DD/MS released item types converted to MC variants. Validated: tsc clean, 2,100-seed generator validation 0 failures (incl. MC checker round-trip + svgChoices guards), full-bank regression 4,680 problems 0 failures, headless-browser test green (course picker, MC feedback, Practice session, Worksheet generation with choice letters), all 4 visual families screenshot-verified.
- Bug fixes 2026-10-01: distractor-collision guards in 3 factories (unique-set pre-check redraw); Worksheets `defaultTechs` missing the `math3-eoc` branch (fell through to Math 1 techniques → identical fallback problems + duplicate React keys); long prose choices wrapped in `\text{}` rendered as nowrap KaTeX and overflowed MC cards — unwrapped to plain prose (statistics, cubic-behavior, interpret-exp choices).

**`math8-eog` subject shipped 2026-10-11:** 44 procedural factories (`src/lib/problems/math8/`: functions ×14, expressions-equations ×9, geometry ×12, statistics ×6, number-system ×3) covering all 45 released item formats, incl. 6 SVG families (`svg.ts`: scatterplot, polygonPlane, paramPlot for function/not-function curves, transversal, exteriorAngle, qualitative story graphs — screenshot-verified in `m8_svg_gallery.png`). svgChoices items answer with letters A–D (same schema as math3 graph-ID). Validated: tsc clean, 1,800-seed validation 0 failures, full-bank regression 6,840 problems 0 failures, headless browser test green, leak probe clean. Same conventions as math7 (plain-text context prose, mcUnique pools).

**`math6-eog` subject shipped 2026-10-11:** 45 procedural factories (`src/lib/problems/math6/`: ratios ×12, expressions ×10, number-system ×10, geometry ×7, statistics ×6) covering all 45 released item formats (35 MC + 10 GR; 37 GEN + 8 VIS), incl. 6 new SVG families (`svg.ts`: inequality number-line choices, number-line hop model, prism T-net, triangle-strip net, dot plot, single box plot — screenshot-verified in `m6_svg_gallery.png`) plus reused math7 lineGraph/boxPlot. Full wiring: courses.ts registry ("Math 6 EOG"), MathPalette tab, TechniqueBadge/ResultsScreen names, Worksheets+Practice defaultTechs branches, ClassDetail. Validated: tsc clean, 1,800-seed validation 0 failures, full-bank regression 7,290 problems 0 failures, headless browser test green ×2, leak probe clean, build ✓. Analysis doc: `DOCS/eoc/MATH6_2026_ANALYSIS.md`. Fixes along the way: point-at-distance distractors that were also exactly d units away (replaced with diagonal/short moves), NOT-equivalent-ratio distractor colliding with the stem ratio (multipliers now guaranteed ≠ stem's), item name leaking italic into KaTeX question (wrapped in `\text{}`). Note: Grade 6 has only ONE released form (2025-26) — second form remains a nice-to-have if NCDPI publishes one.

### Math 1 EOC Prep ($19 one-time)

| Topic | Problem Count |
|-------|--------------|
| Linear Equations & Inequalities | 30 |
| Systems of Equations | 30 |
| Exponential Functions | 30 |
| Quadratic Functions | 30 |
| Geometry & Transformations | 30 |
| Statistics & Probability | 30 |
| **Total** | **180** |

### Math 3 EOC Prep ($19 one-time)

| Topic | Problem Count |
|-------|--------------|
| Polynomial & Rational Functions | 30 |
| Logarithmic Functions | 30 |
| Trigonometry (Unit Circle, Graphs) | 30 |
| Trigonometric Identities | 30 |
| Conic Sections | 30 |
| Statistics & Data Analysis | 30 |
| **Total** | **180** |

### Math 6 / 7 / 8 EOG Prep ($19 one-time each)

| Course | Subject key | Domains covered |
|--------|------------|-----------------|
| Math 6 EOG | `math6-eog` | RP 12, EE 11, NS 10, G 6, SP 6 (per 2025-26 form) — shipped 2026-10-11 |
| Math 7 EOG | `math7-eog` | RP 12, SP 11, EE 10, G 7, NS 5 (per 2026 form) — shipped 2026-10-11 |
| Math 8 EOG | `math8-eog` | F 14, G 12, EE 10, SP 7, NS 2 (per 2026 form) — shipped 2026-10-11 |

Naming per owner decision: courses appear as "Math 6 EOG", "Math 7 EOG", "Math 8 EOG" in the course dropdown — one shared app, course demarcation via the `courses.ts` registry.

**Architecture:** These are separate product gateways. Each has its own subject type, problem generator, and worksheet generator. The auth, payments, and progress tracking infrastructure is shared.

---

## Phase 5: Premium Features (Months 6-12)

### Adaptive Practice
- Machine learning model (simple rule-based first) adjusts difficulty based on student performance
- Spaced repetition for weak areas
- Personalized study plans

### Exam Simulator
- Timed full-length practice exams
- AP Calculus AB/BC format
- Score prediction based on historical data

### Teacher Dashboard
- Class management
- Assignment creation
- Grade reports
- Identify struggling students by topic

### Mobile App
- React Native or PWA
- Offline practice
- Push notifications for daily practice

---

## Content Expansion Cost

| Topic | Problems | Est. Dev Time | Revenue Impact |
|-------|----------|---------------|----------------|
| Applications of Derivatives | 72 | 2-3 days | Medium |
| Applications of Integration | 72 | 2-3 days | Medium |
| Differential Equations | 72 | 3-4 days | High (engineering) |
| Sequences & Series | 72 | 3-4 days | High (AP Calc BC) |
| Math 1 EOC | 180 | 5-7 days | New market |
| Math 3 EOC | 180 | 5-7 days | New market |

**Total to full catalog:** ~20-28 dev days

---

## Marketing Strategy

### Free Content (SEO / Acquisition)
- Landing page with sample problems
- Blog: "How to solve [topic] step by step"
- YouTube shorts: 60-second problem walkthroughs
- Free worksheet generator (5 problems, watermark)

### Paid Conversion
- Full access: $12/mo or $19 one-time
- Remove watermark on worksheets
- Progress tracking & streaks
- Printable answer keys
- Unlimited practice problems

### Channels
- **SEO:** Rank for "calculus practice problems", "AP calc BC series tests"
- **Reddit:** r/calculus, r/APStudents, r/learnmath
- **TikTok/YouTube Shorts:** Quick problem walkthroughs
- **Teachers:** Free classroom licenses → school-wide deals
- **Partnerships:** Tutoring centers, test prep companies

---

## Technical Debt & Maintenance

### Monitoring
- Vercel Analytics (free) — traffic, performance
- PostHog (free tier) — product analytics, funnels
- Sentry (free tier) — error tracking

### Regular Tasks
- Add new problems monthly (student feedback)
- Review answer checker edge cases
- Update dependencies quarterly
- Backup database weekly

### Scaling Considerations
- **Database:** Neon scales automatically. At 10K users, upgrade to paid tier ($19/mo).
- **API:** Vercel Edge Functions scale automatically. No action needed.
- **Auth:** Clerk free tier = 10K MAU. At 10K, upgrade to $25/mo.
- **Payments:** Stripe handles scale. No action needed.

---

## Key Metrics to Track

| Metric | Target (Month 1) | Target (Month 6) |
|--------|------------------|------------------|
| Monthly Visitors | 1,000 | 10,000 |
| Signup Rate | 5% | 8% |
| Free → Paid Conversion | 2% | 5% |
| Monthly Churn | <10% | <5% |
| NPS Score | 40+ | 50+ |
| Problems Practiced / User / Week | 10 | 20 |

---

## Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| Answer checker gives false negatives | Monitor feedback, add synonym mappings, manual review queue |
| Students share accounts | Device fingerprinting, rate limiting per account |
| Content creation bottleneck | Open-source problem contributions, teacher partnerships |
| Competitor undercuts price | Focus on quality (math.js checker, plain-text input) and community |
| Stripe account issues | Backup payment processor (LemonSqueezy) ready |

---

## Conclusion

**Phase 1 is the foundation.** Deploy Calculus Practice with the 3 subjects you have, start collecting paying users, and use their feedback to prioritize Phase 2-4.

The architecture is designed for rapid expansion — adding a new subject is ~3 days of content work, not infrastructure work. The moat (plain-text input + math.js checker + KaTeX rendering) compounds with every topic you add.

**Launch date target:** 1 week from env var setup.
