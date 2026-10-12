# MathPivot Calculus Practice — Fullstack Application

## Overview

MathPivot Calculus Practice is a production-ready math education web application built for high school and college students studying calculus. It features plain-text math input (no LaTeX knowledge required), KaTeX rendering, printable worksheets, progress tracking, and a hybrid symbolic/numerical answer checker powered by math.js.

**Live URL:** `https://practice.mathpivot.com`

---

## Architecture

### Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 19 + Vite | UI framework & build tool |
| Styling | Tailwind CSS v3 + shadcn/ui | Utility-first CSS & component library |
| Math Rendering | KaTeX + react-katex | LaTeX math display in browser |
| Animations | Framer Motion | Page transitions & UI animations |
| Backend | Hono + tRPC 11.x | Type-safe API layer |
| Database | Neon PostgreSQL + Drizzle ORM | Serverless Postgres with type-safe queries |
| Auth | Clerk | OAuth 2.0 + Email/Password authentication |
| Payments | Stripe | Subscription & one-time purchases |
| Math Engine | math.js | Symbolic expression evaluation for answer checking |
| Deployment | Vercel | Edge network, preview deployments, analytics |

### Project Structure

```
├── api/                    # Backend API (tRPC routers)
│   ├── auth-router.ts      # User auth & sync with Clerk
│   ├── math-router.ts      # Progress tracking endpoints
│   ├── context.ts          # tRPC context (Clerk user ID)
│   ├── middleware.ts       # Auth guards (public, authed, admin)
│   ├── boot.ts             # Hono server entry point
│   ├── router.ts           # tRPC router composition
│   ├── env.ts              # Environment validation
│   ├── queries/
│   │   ├── connection.ts   # Neon PostgreSQL connection
│   │   └── users.ts        # User CRUD operations
│   └── lib/
│       ├── env.ts          # Server env vars (DATABASE_URL, CLERK_*)
│       └── vite.ts         # Static file serving helper
│
├── db/                     # Database schema & migrations
│   ├── schema.ts           # Users, progress, subscriptions tables
│   ├── relations.ts        # Drizzle table relationships
│   └── seed.ts             # Development seed data
│
├── contracts/              # Shared types & constants
│   └── constants.ts        # Error messages, paths
│
├── src/
│   ├── components/         # React components
│   │   ├── MathDisplay.tsx       # KaTeX math renderer
│   │   ├── generator/
│   │   │   └── AnswerInput.tsx   # Plain-text input with preview
│   │   ├── practice/
│   │   │   ├── ActiveSession.tsx # Live practice session
│   │   │   ├── SetupScreen.tsx   # Practice configuration
│   │   │   └── ResultsScreen.tsx # Session results & stats
│   │   └── ui/                   # shadcn/ui components
│   │
│   ├── hooks/
│   │   └── useAuth.ts      # Clerk auth hook wrapper
│   │
│   ├── providers/
│   │   └── trpc.tsx        # tRPC client + Clerk token injection
│   │
│   ├── lib/
│   │   ├── problemGenerator.ts   # Problem generation engine
│   │   ├── answerChecker.ts      # Hybrid math.js answer checker
│   │   └── mathNormalizer.ts     # Plain text → LaTeX conversion
│   │
│   ├── pages/
│   │   ├── Home.tsx         # Landing page
│   │   ├── Practice.tsx     # Practice mode
│   │   ├── Generator.tsx    # Problem generator
│   │   ├── Worksheets.tsx   # Printable worksheet generator
│   │   ├── Learn.tsx        # Theory & formula reference
│   │   ├── About.tsx        # About page
│   │   └── Login.tsx        # Clerk SignIn page
│   │
│   ├── App.tsx              # Route definitions
│   └── main.tsx             # Entry point (ClerkProvider + TRPCProvider)
│
├── .env                     # Environment variables (gitignored)
├── drizzle.config.ts        # Drizzle ORM configuration
├── vite.config.ts           # Vite build configuration
└── package.json             # Dependencies & scripts
```

---

## Current Content

### Subjects

| Subject | Techniques | Problems |
|---------|-----------|----------|
| Integration | 8 | 72 (24 easy + 24 medium + 24 hard) |
| Differentiation | 8 | 72 |
| Limits | 8 | 72 |
| **Total** | **24** | **216** |

### Integration Techniques
1. Basic Integration (Power Rule)
2. U-Substitution
3. Integration by Parts
4. Trigonometric Integrals
5. Trigonometric Substitution
6. Partial Fractions
7. Improper Integrals
8. Mixed Practice

### Differentiation Techniques
1. Basic Differentiation Rules
2. Product Rule
3. Quotient Rule
4. Chain Rule
5. Implicit Differentiation
6. Logarithmic Differentiation
7. Trigonometric Derivatives
8. Higher-Order Derivatives

### Limit Techniques
1. Direct Substitution
2. Factoring & Canceling
3. Rationalizing
4. Special Trig Limits
5. L'Hôpital's Rule
6. Infinite Limits
7. Limits at Infinity
8. Mixed Practice

---

## The Answer Checker (Competitive Advantage)

### Problem with String Matching

Traditional math apps use string comparison or LaTeX normalization:
- `x^2 + 2x + 1` ≠ `(x+1)^2` (string mismatch)
- `1/2` ≠ `0.5` (format mismatch)
- `converges` ≠ `convergent` (spelling mismatch)

### Our Hybrid Solution

The `answerChecker.ts` uses three strategies:

| Type | Strategy | Example |
|------|----------|---------|
| **Text** | Synonym mapping | `converges` ≈ `convergent` ≈ `yes` |
| **Numerical** | Fraction/decimal parse | `3/2` ≈ `1.5` ≈ `1.50` |
| **Symbolic** | Test-point evaluation | `x+1` ≈ `1+x` via math.js |

### How Symbolic Checking Works

1. User types `x^2 + 2x + 1`
2. Correct answer is `(x+1)^2`
3. Evaluate both at 8 test points: `x = 0.1, 0.5, 1, 2, 3.14, -0.5, -1, 5`
4. If 3+ points match within `1e-6`, answers are equivalent

This catches commutative, associative, and algebraic rearrangements that string comparison misses.

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  clerk_id VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255),
  email VARCHAR(320),
  avatar TEXT,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_sign_in_at TIMESTAMP DEFAULT NOW()
);
```

### Progress Table
```sql
CREATE TABLE progress (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  subject VARCHAR(50) NOT NULL,
  technique VARCHAR(100) NOT NULL,
  difficulty VARCHAR(20) NOT NULL,
  correct INTEGER DEFAULT 0,
  total INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  last_practiced TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Subscriptions Table
```sql
CREATE TABLE subscriptions (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  product VARCHAR(100) NOT NULL,
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  status VARCHAR(50) DEFAULT 'inactive',
  current_period_end TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## Environment Variables

### Required

```bash
# Database
DATABASE_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require

# Auth (Clerk)
CLERK_SECRET_KEY=sk_test_...
CLERK_PUBLISHABLE_KEY=pk_test_...
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...

# Payments (Stripe)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# App
APP_URL=https://practice.mathpivot.com
NODE_ENV=production
```

### Stripe Product IDs (Create in Stripe Dashboard)

```bash
STRIPE_PRICE_MONTHLY=price_...           # $12/mo Calculus Practice
STRIPE_PRICE_CALCULUS_PACK=price_...     # $19 one-time
STRIPE_PRICE_MATH1_EOC=price_...         # $19 one-time
STRIPE_PRICE_MATH3_EOC=price_...         # $19 one-time
```

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (localhost:3000) |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run check` | Type-check all TypeScript |
| `npm run db:push` | Sync schema to database (dev) |
| `npm run db:generate` | Generate migration SQL |
| `npm run db:migrate` | Apply pending migrations |

---

## License

Proprietary — MathPivot
