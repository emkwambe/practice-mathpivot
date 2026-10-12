# MathPivot Calculus Practice — Kimi Code Handoff

## Project Overview

MathPivot is a fullstack calculus education platform with:
- **Frontend**: React 19 + Vite + TypeScript + Tailwind CSS + shadcn/ui + Framer Motion
- **Backend**: Hono + tRPC 11.x + Drizzle ORM + Neon PostgreSQL (serverless)
- **Auth**: Clerk (Google + Email) with real `pk_test_` publishable key
- **Math rendering**: KaTeX for display, math.js + custom normalizer for answer checking
- **Math input**: Plain-text natural language (no LaTeX knowledge required from students)

## Directory Structure

```
app/
├── api/                    # Backend (tRPC + Hono)
│   ├── auth-router.ts      # Clerk user sync (createUser, me, logout)
│   ├── boot.ts             # Hono server entry + static file serving
│   ├── context.ts          # tRPC context (extracts x-clerk-user-id header)
│   ├── math-router.ts      # saveProgress, getProgress mutations
│   ├── middleware.ts       # tRPC init, publicQuery, authedQuery, adminQuery
│   ├── router.ts           # App router (auth + math sub-routers)
│   └── queries/
│       ├── connection.ts   # Drizzle DB connection (Neon)
│       └── users.ts
├── db/
│   ├── schema.ts           # users, progressTable, subscriptionsTable
│   ├── relations.ts
│   └── seed.ts
├── src/
│   ├── components/
│   │   ├── MathPalette.tsx         # NEW: Tabbed math symbol palette with live KaTeX preview
│   │   ├── MathDisplay.tsx         # KaTeX rendering wrapper
│   │   ├── Navbar.tsx              # Top nav (has MathPivot branding)
│   │   ├── Footer.tsx              # Footer (has MathPivot branding)
│   │   ├── TechniqueBadge.tsx
│   │   ├── DifficultySelector.tsx
│   │   ├── generator/              # Worksheet generator components
│   │   │   ├── AnswerInput.tsx     # Updated: now includes MathPalette
│   │   │   ├── AnswerFeedback.tsx
│   │   │   ├── ProblemHistory.tsx
│   │   │   ├── SolutionSteps.tsx
│   │   │   ├── SessionStats.tsx
│   │   │   └── TechniqueSelector.tsx
│   │   ├── practice/               # Practice mode components
│   │   │   ├── ActiveSession.tsx   # Updated: includes MathPalette below input
│   │   │   ├── AnswerFeedback.tsx
│   │   │   ├── PauseOverlay.tsx
│   │   │   ├── ResultsScreen.tsx   # Updated: MathPivot branding
│   │   │   ├── SessionTimer.tsx
│   │   │   ├── SetupScreen.tsx
│   │   │   └── StreakIndicator.tsx
│   │   └── ui/                     # shadcn/ui components
│   ├── lib/
│   │   ├── problemGenerator.ts     # ALL math problems (CRITICAL: see notes below)
│   │   ├── answerChecker.ts        # Hybrid math.js + string normalization checker
│   │   ├── mathNormalizer.ts       # plainToLatex() + normalizeMathAnswer()
│   │   └── utils.ts
│   ├── pages/
│   │   ├── Home.tsx                # Updated: MathPivot branding
│   │   ├── About.tsx               # Updated: MathPivot branding
│   │   ├── Worksheets.tsx          # STILL HAS "MathGen" at line ~337
│   │   ├── Learn.tsx
│   │   ├── Practice.tsx
│   │   ├── Generator.tsx           # Updated: passes subject to AnswerInput
│   │   ├── Login.tsx
│   │   └── NotFound.tsx
│   ├── providers/
│   │   └── trpc.tsx                # tRPC client with Clerk auth headers
│   ├── main.tsx                    # React entry: ClerkProvider + TRPCProvider
│   └── App.tsx                     # Routes
├── index.html                      # Updated: MathPivot title
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
└── package.json
```

## What Was Changed This Session

### 1. LaTeX Backslash Fix (CRITICAL — you fixed locally)
- **File**: `src/lib/problemGenerator.ts`
- **Issue**: Differentiation (lines ~746–1777) and Limits (lines ~1867–2651) problem arrays used single backslashes (`\frac`) in JS strings, which rendered as garbage (form feed characters) instead of KaTeX.
- **Fix**: Changed to double backslashes (`\\frac`, `\\sin`, `\\cos`, `\\ln`, `\\sqrt`, `\\lim`, `\\infty`, etc.) in all diff* and limit* arrays.
- **Status**: ✅ You fixed this locally. The file in this sandbox still has the OLD broken version — **use your local copy**.

### 2. Branding MathGen → MathPivot
- **Files updated**: `index.html`, `Navbar.tsx`, `Footer.tsx`, `Home.tsx`, `About.tsx`, `ResultsScreen.tsx`
- **Still needs fix**: `src/pages/Worksheets.tsx` line ~337 still says `"MathGen Worksheet Generator"`

### 3. MathPalette Component (NEW)
- **File**: `src/components/MathPalette.tsx`
- Features:
  - Collapsible palette with tabs: Suggested, Algebra, Functions, Calculus
  - **Live KaTeX preview** above the palette that renders the current input as math
  - Context-aware "Suggested" tab based on subject (integration/differentiation/limits)
  - Smart cursor insertion (inserts at cursor position, not end)
  - Smart cursor placement after insert (e.g., `\sin(` puts cursor inside parens)
  - Smart spacing (adds spaces between tokens when needed)
  - Undo button (removes last token)
  - Dark theme matching app

### 4. Palette Integration
- **ActiveSession.tsx**: MathPalette inserted between input box and Submit button. Passes `currentProblem.subject`.
- **AnswerInput.tsx**: Completely rewritten to include MathPalette. Added optional `subject` prop.
- **Generator.tsx**: Passes `currentProblem.subject` to AnswerInput.

## Environment Variables (Required)

Create `.env` in project root:

```bash
# Clerk (required for auth)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...   # Your real Clerk publishable key

# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://...             # Your Neon connection string

# Optional: AWS S3 (for file uploads)
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=...
AWS_S3_BUCKET=...
```

**Important**: Clerk auth is NOT optional. The app uses real Clerk keys (`pk_test_...`). Do NOT use mock/fallback auth wrappers.

## How to Run

```bash
# Use pnpm (NOT npm — npm had dead mirror issues in package-lock.json)
pnpm install

# Dev server
pnpm dev          # Vite dev server on http://localhost:3000

# Type check
pnpm run check    # tsc -b

# Production build
pnpm run build    # vite build + esbuild boot.ts

# Start production server
pnpm start        # node dist/boot.js
```

## Critical Gotchas

### 1. JavaScript String Escaping
In `problemGenerator.ts`, LaTeX backslashes MUST be doubled:
```typescript
// WRONG — produces form feed character
"\frac{d}{dx}(x^5)"

// RIGHT — produces literal \frac in output
"\\frac{d}{dx}(x^5)"
```
- Integration problems already use `\\` (correct)
- Differentiation and Limits problems were fixed to use `\\`
- The `getTechniques()` function at the bottom also has single-quoted strings with single backslashes — check those too

### 2. Package Manager
Use **pnpm**, not npm. The `package-lock.json` had dead mirror URLs (`npm.mirrors.msh.team`) that caused `ENOTFOUND` errors.

### 3. Auth Flow
- Frontend: `@clerk/clerk-react` provides `useAuth()` → tRPC client sends `Authorization: Bearer <token>` + `x-clerk-user-id` headers
- Backend: `api/context.ts` reads `x-clerk-user-id` header, `api/middleware.ts` `requireAuth` checks `ctx.userId`
- NO fallback/mock auth — real Clerk keys required

### 4. Math Answer Checking
`src/lib/answerChecker.ts` uses **math.js** to evaluate both student answer and correct answer numerically, plus string normalization as fallback. Students type plain text like `x^3/3 + C`, `sin(x^2) + C`, `sqrt(x)` — NO LaTeX knowledge needed.

### 5. Math Palette Preview
The palette's live preview uses `plainToLatex()` from `mathNormalizer.ts` to convert plain text to LaTeX, then renders via KaTeX. If the user types raw LaTeX (with `\`), it passes through directly.

## Remaining Tasks / Known Issues

| # | Task | Priority | File(s) |
|---|------|----------|---------|
| 1 | **Fix "MathGen" branding in Worksheets.tsx** | High | `src/pages/Worksheets.tsx:337` |
| 2 | **Mobile responsive palette** | Medium | `MathPalette.tsx` — buttons may overflow on 375px width |
| 3 | **KaTeX-rendered button labels** | Low | `MathPalette.tsx` — render `d/dx` as actual fraction inside buttons |
| 4 | **Full undo/redo history stack** | Low | `MathPalette.tsx` — currently just removes last token |
| 5 | **Add more symbol buttons** | Low | `MathPalette.tsx` — add `e^x`, `π`, `dx` variants per feedback |
| 6 | **Check `getTechniques()` single backslashes** | Medium | `problemGenerator.ts` bottom — `example: '\int x^n \, dx = \frac...'` uses single quotes with single backslashes, may need `\\` |

## Database Schema

Current tables:
- `users` (id, clerkId, name, email, avatar, role, createdAt, updatedAt, lastSignInAt)
- `progress` (id, userId, subject, technique, difficulty, correct, total, streak, lastPracticed)
- `subscriptions` (id, userId, product, stripeCustomerId, stripeSubscriptionId, status, currentPeriodEnd)

**Teacher Dashboard tables NOT yet created** (MVP spec mentioned classes, classEnrollments, assignments, assignmentProgress — but these don't exist in schema yet).

## tRPC API Endpoints

```
auth.me          → GET    → returns current user or null
auth.createUser  → POST   → creates/syncs Clerk user in DB
auth.logout      → POST   → returns { success: true }
math.saveProgress→ POST   → saves practice progress per subject/technique/difficulty
math.getProgress → GET    → returns all progress rows for user
ping             → GET    → health check
```

## Files to Read First When Starting

1. `src/lib/problemGenerator.ts` — understand the problem data structure
2. `src/components/MathPalette.tsx` — understand the palette component
3. `src/lib/mathNormalizer.ts` — understand plain text → LaTeX conversion
4. `src/lib/answerChecker.ts` — understand answer validation
5. `src/components/practice/ActiveSession.tsx` — understand practice flow
6. `src/pages/Generator.tsx` — understand worksheet generator flow
7. `api/router.ts` + `api/math-router.ts` — understand backend API

## Quick Test Checklist

After making changes, verify:
1. `pnpm run check` → 0 errors
2. `pnpm run build` → success
3. Generate differentiation problem → KaTeX renders correctly (no raw `\frac`)
4. Generate limits problem → KaTeX renders correctly
5. Type in answer box → live preview appears above palette
6. Click palette buttons → symbols insert at cursor position
7. Click `lim` → `\lim_{x \to }` inserts, cursor after `\to `
8. Click `sin` → `\sin(` inserts, cursor inside parens
9. Click `√x` → `\sqrt{}` inserts, cursor inside braces
10. Submit answer → feedback shows correctly
