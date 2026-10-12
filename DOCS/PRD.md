# MathPivot — Product Requirements Document (PRD)

**Version:** 2.0  
**Date:** 2026-09-19  
**Status:** Draft — Pending Approval  
**Product Owner:** Eddy  
**Engineering Lead:** Kimi  

---

## 1. Executive Summary

MathPivot is a multi-subject math practice platform targeting English-speaking students and teachers globally, with a primary focus on the United States market. The platform differentiates through a proprietary hybrid answer checker (math.js-powered symbolic evaluation), plain-text math input (no LaTeX knowledge required), and printable worksheet generation.

The go-to-market strategy leverages free TikTok/YouTube Shorts content for acquisition, a freemium model for conversion, and a teacher tier for distribution scale.

### Key Metrics

| Metric | Launch Target | Month 6 | Month 12 |
|--------|--------------|---------|----------|
| Monthly Visitors | 1,000 | 10,000 | 25,000 |
| Signup Rate | 5% | 8% | 10% |
| Free → Paid Conversion | 2% | 5% | 7% |
| Monthly Churn | <10% | <5% | <4% |
| Teacher Adoption | 5 | 50 | 150 |

### Revenue Projections

| Scenario | Students @ $8/mo | Teachers @ $29/mo | MRR | ARR |
|----------|-----------------|-------------------|-----|-----|
| Conservative (Month 6) | 100 | 10 | $1,090 | $13,080 |
| Target (Month 12) | 500 | 50 | $5,450 | $65,400 |
| Growth (Month 18) | 2,000 | 200 | $21,800 | $261,600 |

---

## 2. Problem Statement

### Student Pain Points

1. **Khan Academy is too easy.** The problems lack depth for AP Calculus BC and university-level courses.
2. **Symbolab/Photomath solve problems.** They don't teach. Students paste homework answers without learning.
3. **Textbook problems are limited.** 40 problems per section, no adaptivity, no progress tracking.
4. **LaTeX is a barrier.** Most practice platforms require LaTeX input, alienating 80% of students.
5. **No printable resources.** Students want physical worksheets for offline study and exam prep.

### Teacher Pain Points

1. **Creating problem sets takes hours.** Finding differentiated problems, formatting, answer keys.
2. **No visibility into student struggle.** A class average of 72% hides that 30% of students can't do u-substitution.
3. **Grading is manual.** 150 students × 10 problems = 1,500 hand-graded items per week.
4. **Existing tools are expensive.** Brilliant ($25/mo), IXL ($300/yr) — pricing excludes public schools.

### MathPivot Solution

| Pain Point | MathPivot Feature |
|-----------|-------------------|
| Khan too easy | 9 difficulty levels per technique, university-level problems |
| Symbolab cheats | Step-by-step hints, not full solutions; practice mode enforces work |
| Limited problems | Procedural generation — thousands of unique problems per technique |
| LaTeX barrier | Plain-text input with KaTeX live preview — type `x^2` not `x^{2}` |
| No printable | One-click worksheet generation with answer keys |
| Problem set creation | Teacher dashboard — select topic, difficulty, count → assign instantly |
| No visibility | Per-student, per-technique progress breakdown |
| Manual grading | Auto-graded with symbolic answer checker |
| Expensive tools | $8/mo student, $29/mo teacher — undercuts market by 60% |

---

## 3. User Personas

### Persona 1: Stressed Sophomore (Student)

**Name:** Alex  
**Age:** 16  
**Location:** Austin, TX  
**Grade:** 11th, taking AP Calculus AB  
**Tech:** iPhone 14, school-issued Chromebook  

**Context:**
- Alex is struggling with integration by parts. The teacher moves fast — 2 days per technique.
- Symbolab gives answers but Alex still bombs quizzes.
- TikTok algorithm shows a 60-second "integration by parts trick" video from MathPivot.

**Journey:**
1. Watches TikTok → clicks link in bio
2. Lands on free practice page → attempts 5 integration by parts problems
3. Gets 2/5 correct. Hints explain the tabular method.
4. Hits daily limit. Sees "$8/mo — less than 2 Starbucks lattes."
5. Subscribes with Apple Pay. Practices 20 min/day for 2 weeks.
6. Gets 92% on integration unit test. Posts about it on TikTok.

**Needs:**
- Quick practice sessions (10-20 min)
- Clear hints, not just answers
- Mobile-friendly input
- Progress tracking to see improvement
- Affordable price (parent-funded or part-time job)

---

### Persona 2: Overwhelmed AP Teacher (Teacher)

**Name:** Ms. Rodriguez  
**Age:** 34  
**Location:** Orlando, FL  
**Role:** AP Calculus BC teacher, 6 sections, 150 students  
**Tech:** School MacBook, Google Classroom, TI-84 emulators  

**Context:**
- Spends 8 hours/week creating problem sets and grading.
- Has 4 students failing, 12 borderline — no time for individual intervention.
- Heard about MathPivot from a student. Skeptical — "another edtech tool."

**Journey:**
1. Student mentions MathPivot in class. Ms. Rodriguez checks it out.
2. Signs up for free teacher trial. Creates a class, assigns u-substitution review.
3. Sees dashboard: 12/150 students stuck on "choosing u." Targets them for tutoring.
4. Auto-graded assignment saves 3 hours of grading that week.
5. Converts to paid teacher tier ($29/mo). Tells 3 other math teachers.
6. Uses MathPivot for every unit review. Class pass rate increases from 78% to 91%.

**Needs:**
- Quick assignment creation (< 5 min)
- Per-student analytics by technique
- Export to Google Sheets/CSV
- Professional worksheets (no watermarks)
- Price low enough to pay out of pocket (school budgets are tight)

---

### Persona 3: Self-Studying Adult (Student Pro)

**Name:** James  
**Age:** 22  
**Location:** Remote, digital nomad  
**Context:** Engineering grad, self-studying for GRE Math Subject Test  

**Needs:**
- Advanced problems (real analysis level)
- Exam simulator with timing
- No hand-holding — just problems and solutions
- Works offline (printable worksheets for flights)

**Journey:**
- Discovers MathPivot via YouTube "sequences convergence tests" video.
- Subscribes to Student Pro ($15/mo) for exam simulator.
- Uses worksheets during 14-hour flight to Bali.
- Scores 90th percentile on GRE Math.

---

## 4. Feature Requirements

### 4.1 Free Tier (Acquisition)

| Feature | Requirement | Priority |
|---------|-------------|----------|
| Sample problems | 5 problems/day per subject | P0 |
| TikTok-embedded practice | Direct link to specific technique | P0 |
| Basic progress | Session score only (not persisted) | P0 |
| Watermarked worksheets | PDF with "MathPivot Free" watermark | P0 |
| Subject browsing | View all techniques, locked problems show preview | P1 |

### 4.2 Student Tier ($8/mo or $79/yr)

| Feature | Requirement | Priority |
|---------|-------------|----------|
| Unlimited practice | No daily limits | P0 |
| All subjects | Access to all current and future subjects | P0 |
| Progress persistence | Cloud-synced across devices | P0 |
| Streak tracking | Daily streak with calendar view | P0 |
| Printable worksheets | Clean PDF, no watermark, with answer key | P0 |
| Hint system | Tiered hints: strategy → first step → full solution | P0 |
| Difficulty selection | Easy / Medium / Hard per technique | P0 |
| Mixed practice | Random technique selection within subject | P1 |
| Weak area detection | "You've missed 70% of integration by parts — practice this" | P1 |
| Mobile app | PWA installable on iOS/Android | P2 |

### 4.3 Student Pro Tier ($15/mo or $149/yr)

| Feature | Requirement | Priority |
|---------|-------------|----------|
| Exam simulator | Timed full-length exams (AP Calculus AB/BC format) | P0 |
| Score prediction | Based on practice accuracy and speed | P1 |
| Advanced subjects | Differential equations, real analysis | P1 |
| Ad-free | No promotional content | P0 |
| Priority support | 24-hour response guarantee | P2 |

### 4.4 Teacher Tier ($29/mo or $299/yr)

| Feature | Requirement | Priority |
|---------|-------------|----------|
| Class creation | Create class → generate 6-digit join code | P0 |
| Student enrollment | Students join with code, no email required | P0 |
| Assignment builder | Select subject + technique + difficulty + problem count | P0 |
| Due dates | Optional deadline for assignments | P0 |
| Per-student analytics | Problems attempted, correct rate, time spent | P0 |
| Technique breakdown | "3 students struggle with partial fractions" | P0 |
| CSV export | Name, problems, correct, percentage, time | P0 |
| Watermark-free worksheets | Professional PDF for classroom handouts | P0 |
| Announcements | Post message to class ("Quiz Friday — practice limits") | P1 |
| Shared problem sets | Share assignments with other teachers | P2 |
| Google Classroom import | Sync roster from Google Classroom | P3 |

---

## 5. User Flows

### 5.1 Student Signup → First Practice

```
TikTok video (free content)
    ↓
Link in bio → Landing page
    ↓
"Try 5 free problems" → Practice page
    ↓
Subject select → Technique select → Difficulty select
    ↓
Problem renders → Student types answer → Submit
    ↓
Feedback (correct/incorrect + hint)
    ↓
5 problems complete → "Sign up to save progress"
    ↓
Clerk SignUp (Google or email, 30 seconds)
    ↓
"Upgrade to unlimited — $8/mo" OR continue free (5/day)
    ↓
Stripe Checkout → Payment complete
    ↓
Welcome to Student Dashboard
    ↓
Unlimited practice + progress tracking + worksheets
```

**Target conversion time:** 5 minutes from landing to first paid practice.

### 5.2 Teacher Signup → First Assignment

```
Word of mouth / conference / Google search
    ↓
Teacher landing page → "Free for 30 days"
    ↓
Clerk SignUp
    ↓
Teacher Dashboard
    ↓
"Create your first class" → Class name → Generate code
    ↓
"Share this code: 847291"
    ↓
"Create assignment" → Subject → Technique → Difficulty → Count → Due date
    ↓
Students complete assignment
    ↓
Teacher views analytics → Identifies struggling students
    ↓
Exports CSV → uploads to gradebook
    ↓
End of trial → Stripe subscription
```

**Target activation:** Teacher creates first assignment within 24 hours of signup.

### 5.3 Answer Submission Flow

```
Student types answer in plain text
    ↓
Live KaTeX preview renders below input
    ↓
Press Enter or click Submit
    ↓
Hybrid Answer Checker:
    1. Text synonym check ("converges" ≈ "convergent")
    2. Numerical parse ("3/2" ≈ "1.5")
    3. Symbolic test-point evaluation (math.js)
    ↓
Result: Correct → Green confetti + next problem
         Incorrect → Red shake + hint button appears
    ↓
Progress saved to Neon (if authenticated)
```

**Target response time:** < 200ms for answer check.

---

## 6. Content Strategy

### 6.1 Subject Expansion Roadmap

| Phase | Subject | Techniques | Problems | Timeline |
|-------|---------|-----------|----------|----------|
| 1 (Launch) | Integration | 8 | 72 | Now |
| 1 (Launch) | Differentiation | 8 | 72 | Now |
| 1 (Launch) | Limits | 8 | 72 | Now |
| 2 | Applications of Derivatives | 8 | 72 | Month 2 |
| 2 | Applications of Integration | 8 | 72 | Month 3 |
| 3 | Differential Equations | 8 | 72 | Month 5 |
| 3 | Sequences & Series | 8 | 72 | Month 6 |
| 4 | Algebra | 8 | 72 | Month 8 |
| 4 | Trigonometry | 8 | 72 | Month 9 |
| 4 | Precalculus | 8 | 72 | Month 10 |
| 5 | Statistics | 8 | 72 | Month 12 |

**Total by Month 12:** 11 subjects, 88 techniques, 792 problems.

### 6.2 Problem Generation

Each problem consists of:
- **Problem text** (LaTeX, displayed via KaTeX)
- **Answer** (string, checked via hybrid checker)
- **Difficulty** (easy/medium/hard)
- **Technique** (category for filtering)
- **Hint** (tiered: strategy → first step → solution)
- **Tags** (for search and recommendation)

**Generation approach:**
- Phase 1: Hand-crafted problem bank (72-216 problems)
- Phase 3: Parametric generation (random coefficients within difficulty bands)
- Phase 5: AI-assisted generation (reviewed by math educators)

### 6.3 TikTok Content Calendar

| Day | Content | Link Destination |
|-----|---------|------------------|
| Mon | "Integration by parts in 60 seconds" | Free practice → Integration by Parts |
| Tue | "Common mistake: forgetting +C" | Free practice → Basic Integration |
| Wed | Teacher tip: "How I use MathPivot for review" | Teacher landing |
| Thu | "This trick saves 5 minutes on every limit problem" | Free practice → L'Hôpital's Rule |
| Fri | Student testimonial (UGC) | Landing page |
| Sat | "My AP Calculus study routine" | Student dashboard |
| Sun | Live Q&A or problem walkthrough | YouTube long-form |

**Posting frequency:** 1-2 per day. Cross-post to Instagram Reels and YouTube Shorts.

---

## 7. Monetization & Pricing

### 7.1 Pricing Psychology

| Tactic | Implementation |
|--------|---------------|
| Anchor pricing | "$8/mo" is 68% cheaper than Brilliant ($25) — shown on pricing page |
| Annual framing | "$79/year = $6.58/month" — monthly equivalent shown |
| Free trial | 7 days free for all paid tiers — no credit card required |
| Teacher social proof | "Join 500+ teachers saving 5 hours/week" |
| Student social proof | "94% of students improve their test scores" |
| Scarcity (launch only) | "Founding student price — $6/mo forever" for first 100 subscribers |

### 7.2 Revenue Recognition

| Source | Recognition |
|--------|-------------|
| Monthly subscriptions | Deferred, recognized daily over subscription period |
| Annual subscriptions | Deferred, recognized monthly over 12 months |
| One-time purchases | Recognized immediately |
| Teacher subscriptions | Recognized monthly |

### 7.3 Refund Policy

- **Student tiers:** 7-day free trial → no refunds needed. After trial: prorated refund within 14 days.
- **Teacher tiers:** 30-day free trial → no refunds needed. After trial: prorated refund within 30 days.
- **Reason:** "If MathPivot doesn't improve your math scores, we'll refund you."

---

## 8. Success Metrics (KPIs)

### Product Metrics

| Metric | Definition | Target |
|--------|-----------|--------|
| DAU/MAU | Daily active users / Monthly active users | >20% (sticky product) |
| Avg Session Length | Time from start to end of practice | >12 minutes |
| Problems per Session | Problems completed in one session | >8 |
| Answer Accuracy | Correct answers / Total answers | 65-75% (too easy if >80%) |
| Hint Usage | Hints requested / Incorrect answers | >40% (students are learning) |
| Streak Retention | Users with 7+ day streak / Total users | >15% |

### Business Metrics

| Metric | Definition | Target |
|--------|-----------|--------|
| CAC | Cost to acquire one paying customer | <$5 (organic TikTok) |
| LTV | Lifetime value of a student | $96 (12 months × $8) |
| LTV:CAC Ratio | LTV / CAC | >19:1 |
| MRR | Monthly recurring revenue | Growth 15% MoM |
| Churn | Cancelled subscriptions / Total subscriptions | <5% monthly |
| NPS | Net Promoter Score | >40 |
| Teacher NPS | Teacher-specific NPS | >50 |

### Technical Metrics

| Metric | Target |
|--------|--------|
| Page load time (LCP) | <2.5s |
| Time to interactive | <3.5s |
| API response time (p95) | <200ms |
| Answer check latency | <100ms |
| Uptime | 99.9% |
| Error rate | <0.1% |

---

## 9. Non-Functional Requirements

### 9.1 Performance

- First contentful paint: <1.5s on 3G
- Largest contentful paint: <2.5s on 4G
- Time to interactive: <3.5s
- API response time: p50 <50ms, p95 <200ms
- Answer check: <100ms (client-side math.js)

### 9.2 Accessibility

- WCAG 2.1 AA compliance
- Keyboard navigation for all practice features
- Screen reader compatible math (aria-labels on KaTeX output)
- Color contrast ratio: 4.5:1 minimum (7:1 for body text)
- Math input accessible via voice (future)

### 9.3 Security

- All API endpoints authenticated (except health check)
- Clerk handles OAuth security — no custom auth
- Stripe handles PCI compliance — no card data touches our servers
- Database: Row-level security via userId filtering
- Rate limiting: 100 requests/minute per IP, 10 login attempts/minute
- CSP headers to prevent XSS

### 9.4 Compliance

- COPPA: No data collection from under-13 users without parental consent
- FERPA: Teacher data handled per educational privacy standards
- GDPR: EU users can export/delete data (self-service)
- CCPA: California users can request data deletion

### 9.5 Internationalization (Future)

- Framework: English only at launch
- Phase 3: Spanish (¡Matemáticas!) for US Hispanic market
- Phase 4: French, German for European expansion
- Math notation: Universal (algebraic notation works globally)

---

## 10. Risks & Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Answer checker gives false negatives | High | Medium | Monitor feedback, manual review queue, synonym mapping |
| TikTok algorithm shifts away from ed content | High | Medium | Diversify to YouTube Shorts, Instagram Reels, SEO |
| Competitor launches similar product | Medium | High | Moat: math.js checker + plain-text input + teacher network |
| Stripe account frozen | High | Low | Backup processor (LemonSqueezy) ready, maintain cash reserves |
| Teacher churn (school year ends) | Medium | High | Annual discounts, summer prep content, multi-subject value |
| Content creation bottleneck | Medium | Medium | Open-source contributions, teacher partnerships, AI-assisted |
| Neon database limits exceeded | Low | Low | Upgrade plan automatically, monitor usage |
| Math rendering breaks on old browsers | Low | Medium | KaTeX fallback, browser support matrix in docs |

---

## 11. Release Criteria

### MVP Launch (Phase 1)

- [ ] 3 subjects (Integration, Differentiation, Limits)
- [ ] 216 hand-crafted problems
- [ ] Plain-text input with KaTeX preview
- [ ] Hybrid answer checker (math.js)
- [ ] Practice mode with scoring
- [ ] Worksheet generator (PDF)
- [ ] Progress tracking (per user)
- [ ] Clerk auth (Google + Email)
- [ ] Stripe checkout (Student $8/mo, Student Pro $15/mo)
- [ ] Mobile responsive
- [ ] TypeScript compiles with 0 errors
- [ ] Lighthouse score >80

### Phase 2 (Applications)

- [ ] Applications of Derivatives (8 techniques, 72 problems)
- [ ] Applications of Integration (8 techniques, 72 problems)
- [ ] Teacher dashboard (create class, assign, view progress)
- [ ] Teacher tier ($29/mo)
- [ ] Class codes and enrollment
- [ ] CSV export

### Phase 3 (Advanced)

- [ ] Differential Equations (8 techniques, 72 problems)
- [ ] Sequences & Series (8 techniques, 72 problems)
- [ ] Exam simulator (timed, AP format)
- [ ] Teacher Slack community
- [ ] Weak area detection algorithm

---

## 12. Appendix

### A. Competitive Analysis

| Feature | Khan Academy | Symbolab | Brilliant | MathPivot |
|---------|-------------|----------|-----------|-----------|
| Price | Free | $7.49/mo | $25/mo | $8/mo |
| Plain-text input | No | No | No | **Yes** |
| Symbolic checker | No | Yes (solves) | No | **Yes (checks)** |
| Printable worksheets | No | No | No | **Yes** |
| Teacher tools | Limited | No | No | **Yes** |
| AP Calculus depth | Medium | High | Medium | **High** |
| TikTok presence | No | No | No | **Yes** |

### B. Glossary

| Term | Definition |
|------|-----------|
| **KaTeX** | Fast math typesetting library for web |
| **math.js** | JavaScript symbolic math library for expression evaluation |
| **Hybrid checker** | Text + numerical + symbolic answer verification system |
| **tRPC** | Type-safe RPC framework for TypeScript APIs |
| **Drizzle ORM** | Type-safe SQL-like ORM for TypeScript |
| **Neon** | Serverless PostgreSQL platform |
| **Clerk** | Authentication and user management platform |
| **PWA** | Progressive Web App — installable on mobile |
| **LCP** | Largest Contentful Paint — loading performance metric |
| **NPS** | Net Promoter Score — customer satisfaction metric |

---

**Document Owner:** Eddy  
**Last Updated:** 2026-09-19  
**Next Review:** Upon Phase 2 completion
